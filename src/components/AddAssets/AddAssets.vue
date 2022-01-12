<script setup>
import daiIcon from '@/assets/imgs/dai-icon.png'
import usdtIcon from '@/assets/imgs/usdt-icon.png'
import usdcIcon from '@/assets/imgs/usdc-icon.png'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { BigNumber } from 'bignumber.js'
import { ethers } from 'ethers'
import queryAllBalance from '@/contract/queryAllBalance'
import { ElLoading, ElMessageBox } from 'element-plus'
import { getContracts } from '@/contract/contracts.js'
import queryTokenUsdPrice from '@/contract/queryTokenUsdPrice.js'
import queryPledgeRate from '@/contract/queryPledgeRate.js'
import { gasOpt } from '@/consts/gasOpt.js'
import queryMinAdQuantityMantissa from '@/contract/queryMinAdQuantityMantissa.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const tokenIconMap = {
  DAI: daiIcon,
  USDT: usdtIcon,
  USDC: usdcIcon
}
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  },
  addAssetsTitle: {
    type: String,
    required: false,
    default: ''
  },
  addAssetsType: {
    type: String,
    required: true,
    // sell,pledge
    default: ''
  },
  tokens: {
    type: Array,
    required: true,
    default() {
      return []
    }
  },
  accountType: {
    type: String,
    required: true,
    default: ''// dotc、wallet
  },
  prepareSell: {
    type: Object,
    required: false,
    default() {
      return {
        token: '',
        amount: 0
      }
    }
  }
})

const sumAmount = ref(0)
const typeTxt = ref('')
const store = useStore()
const route = useRoute()
const listTotalUsd = ref('0.00')
const contentList = ref([])
const timer = ref([])
const emit = defineEmits(['update:modelValue', 'confirmAdd', 'pledgeValues', 'changeAccountType'])

watch(
  () => props.modelValue,
  async (newV) => {
    if (newV) {
      listTotalUsd.value = '0.00'
      let loadingInstance = ElLoading.service({ fullscreen: true })
      await Promise.all([queryAllBalance(), queryTokenUsdPrice(), queryPledgeRate()])
      loadingInstance.close()
      loadingInstance = null
      try {
        initListCoins()
      } catch (err) {
        console.log('=err-initListCoins=', err)
      }
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  timer.value.forEach((item) => {
    clearTimeout(item)
  })
  timer.value = []
})

function initListCoins() {
  const { addAssetsType, prepareSell } = props
  typeTxt.value = addAssetsType === 'sell' ? '出售' : '抵押'
  const { dotc, tokens } = store.state
  const isDotc = props.accountType === 'dotc'
  const tokenMap = isDotc ? dotc : tokens
  // 如果是质押的情况下，要减去准备出售的资产
  // 质押
  const isPledge = addAssetsType === 'pledge'
  // 准备出售的资产
  const sellToken = prepareSell.token
  const sellAmount = prepareSell.amount
  contentList.value = props.tokens.map((token, index) => {
    let amount = tokenMap[token][(isDotc && 'amount') || 'balance']
    const price = tokens[token].price
    if (isPledge) {
      if (token === sellToken) {
        amount = BigNumber(amount).minus(sellAmount).toString()
      }
    }
    const totalUsd = BigNumber(amount).multipliedBy(price).toFixed(2)
    const item = {
      token,
      totalUsd,
      inputTokenAmount: '',
      inputUsdAmount: '0',
      icon: tokenIconMap[token]
    }
    return item
  })
}
function clearAddInfo() {
  // sumAmount.value = []
}
function clickCloseIcon() {
  emit('update:modelValue', false)
  clearAddInfo()
}
function handleSellListTotal() {
  const { inputTokenAmount } = contentList.value[0]
  sumAmount.value = inputTokenAmount
}
function handlePledgeListTotal() {
  let sum = 0
  contentList.value.forEach((item) => {
    sum = BigNumber(sum).plus(item.inputUsdAmount)
  })
  sumAmount.value = sum.toFixed(2)
}
function handleListTotal() {
  switch (props.addAssetsType) {
    case 'sell':
      return handleSellListTotal()
    case 'pledge':
      return handlePledgeListTotal()
    default:
      break
  }
}
async function moreThanMinAdQuanlty() {
  const loading = ElLoading.service({ fullscreen: true })
  await queryMinAdQuantityMantissa()
  loading.close()
  const { minOrderQuantity } = store.state
  const moreThanMin = Number(listTotalUsd.value) >= Number(minOrderQuantity)
  if (!moreThanMin) {
    ElMessageBox({
      message: `售卖数量不能低于${minOrderQuantity}个`,
      type: 'warning',
      showCancelButton: false,
      showConfirmButton: false
    })
    const timeout = setTimeout(() => {
      ElMessageBox.close()
    }, 2000)
    timer.value.push(timeout)
  }
  return moreThanMin
}
async function clickConfirmAdd() {
  if (!contentList.value.length) return
  if (exceedTotal.value) return
  if (route.path.includes('/buy-sell/sell-coin')) {
    const moreThanMin = await moreThanMinAdQuanlty()
    if (!moreThanMin) return
  }
  handleListTotal()
  if (props.accountType === 'wallet') {
    try {
      await handleWalletApprove()
    } catch (err) {
      console.log('=handleWalletApprove-err=', err)
    }
  }
  if (props.addAssetsType === 'pledge') {
    const pledgeValues = contentList.value.map(item => ethers.utils.parseUnits(item.inputTokenAmount || '0', store.state.tokens[item.token].decimals))
    console.log('=pledgeValues=', pledgeValues)
    const key = props.accountType === 'dotc' ? 'collateralDotcValues' : 'collateralWalletValues'
    emit('pledgeValues', {
      addAssetsType: 'pledge',
      [key]: pledgeValues
    })
  }
  const totalAmount = {
    addAssetsType: props.addAssetsType,
    sumAmount: { [props.accountType]: sumAmount.value }
  }
  console.log('=clickConfirmAdd=', totalAmount)
  emit('confirmAdd', totalAmount)
  emit('update:modelValue', false)
}
function handleWalletApprove() {
  let complete = 0
  const { tokens } = store.state
  const { tokensIns, dotcIns } = getContracts()
  console.log('=handleWalletApprove=')
  const valuableList = contentList.value.filter((item) => Number(item.inputUsdAmount) > 0)
  const len = valuableList.length
  if (!len) return false
  console.log('=valuableList=', valuableList)
  return new Promise(async (right, wrong) => {
    for (let index = 0; index < len; index++) {
      const amount = ethers.utils.parseUnits(valuableList[index].inputTokenAmount, tokens.USDT.decimals)
      console.log('=approve-addr=', dotcIns.addr)
      console.log('=approve-amount=', amount)
      console.log('=store.state.tokens[valuableList[index].token]=', store.state.tokens[valuableList[index].token])
      const approveTx = await tokensIns[store.state.tokens[valuableList[index].token].index].write.approve(dotcIns.addr, amount)
      console.log('=approveTx=', approveTx)
      const approveReciept = await approveTx.wait()
      console.log('=approveReciept=', approveReciept)
      if (approveReciept.status) {
        complete++
        if (complete === len) {
          right()
        }
      } else {
        wrong()
      }
    }
  })
}
async function handleDotcDeposit() {
  console.log('=开始执行handleDotcDeposit=')
  const { tokensIns, dotcIns } = getContracts()
  const tokens = store.state.tokens
  const valueableList = contentList.value.filter((item) => Number(item.inputUsdAmount) > 0)
  const collateral_tokens = valueableList.map(item => tokens[item.token].addr)
  const collateral_wallet_values = valueableList.map(item => ethers.utils.parseUnits(item.inputTokenAmount, tokens[item.token].decimals))
  console.log('=depositvalue=', collateral_wallet_values[0])
  console.log('collateral_tokens', collateral_tokens)
  console.log('collateral_wallet_values', collateral_wallet_values)
  const depositTx = await dotcIns.write.batch_collateral(collateral_tokens, collateral_wallet_values, gasOpt)
  console.log('=depositTx=', depositTx)
  const depositReciept = await depositTx.wait()
  const status = depositReciept.status
  if (!status) {
    ElMessageBox({
      message: '存入DOTC账户失败',
      type: 'warning',
      showCancelButton: false,
      showConfirmButton: false
    })
    const timeout = setTimeout(() => {
      ElMessageBox.close()
    }, 2000)
    timer.value.push(timeout)
  }
  return status
}
async function clickConfirmDeposit() {
  if (!contentList.value.length) return
  if (exceedTotal.value) return
  if (exceedTokenAccount()) return
  if (!effectiveValue()) return
  handleListTotal()
  try {
    let loadingInstance = ElLoading.service({ fullscreen: true })
    const res = await handleWalletApprove()
    console.log('=执行完了handleWalletApprove=')
    const status = await handleDotcDeposit()
    loadingInstance.close()
    loadingInstance = null
    if (!status) return
    ElMessageBox({
      message: '成功存入dotc',
      type: 'success',
      showCancelButton: false,
      showConfirmButton: false
    })
    const timeout = setTimeout(() => {
      ElMessageBox.close()
      emit('changeAccountType', 'dotc')
    }, 2000)
    timer.value.push(timeout)
  } catch (err) {
    console.log('=clickConfirmDeposit-err=', err)
  }
}

function inputTokenAmountEvent() {
  const { tokens } = store.state
  listTotalUsd.value = contentList.value.reduce((sum, item) => {
    const inputUsdValue = BigNumber(item.inputTokenAmount || 0).multipliedBy(tokens[item.token].price)
    item.inputUsdAmount = inputUsdValue.toFixed(2)
    sum = inputUsdValue.plus(sum)
    return sum
  }, 0).toFixed(2)
}
const exceedTotal = computed(() => {
  return Number(listTotalUsd.value) > Number(contentList.value.reduce((sum, item) => {
    sum = BigNumber(sum).plus(item.totalUsd)
    return sum
  }, 0).toFixed(2))
})
function clickDepositFromWallet() {
  emit('changeAccountType', 'wallet')
}
function exceedTokenAccount() {
  const exceed = contentList.value.some(item => (Number(item.inputUsdAmount) > Number(item.totalUsd)))
  if (exceed) {
    ElMessageBox({
      message: '每种币存入的数量应小于等于您持有该币的总量',
      type: 'warninng',
      showCancelButton: false,
      showConfirmButton: false
    })
    const timeout = setTimeout(() => {
      ElMessageBox.close()
    }, 2000)
    timer.value.push(timeout)
  }
  return exceed
}
function effectiveValue() {
  const Zero = contentList.value.every((item) => Number(item.inputUsdAmount) >= 0)
  const greaterZero = contentList.value.some((item) => Number(item.inputUsdAmount) > 0)
  const res = Zero && greaterZero
  if (!res) {
    ElMessageBox({
      message: '请输入有效值',
      type: 'warninng',
      showCancelButton: false,
      showConfirmButton: false
    })
    const timeout = setTimeout(() => {
      ElMessageBox.close()
    }, 2000)
    timer.value.push(timeout)
  }
  return res
}
</script>

<template>
  <dialog-box
    v-model="modelValue"
    :title="$t(addAssetsTitle)"
    :closeControl="true"
    @clickCloseIcon="clickCloseIcon"
  >
    <div class="add-pledge-body">
      <div class="column-subject">
        <!-- <span>可{{ typeTxt }}资产</span> -->
        <span>资产</span>
        <span>{{ $t('message.Operate') }}</span>
      </div>
      <template v-if="contentList.length">
        <div v-for="(item, index) in contentList" class="coin-item-container" :key="index">
          <div class="coin-item-left">
            <img class="coin-item-icon" :src="item.icon" alt="usdt-icon" />
            <div class="coin-item-txt">
              <p class="coin-item-name">{{ item.token }}</p>
              <p class="coin-item-total">≈${{ item.totalUsd }}</p>
            </div>
          </div>
          <div class="coin-item-right">
            <div class="pledge-input">
              <!-- <span class="pledge-tip">{{ typeTxt }}</span> -->
              <el-input
                @input="inputTokenAmountEvent"
                size="small"
                v-model="item.inputTokenAmount"
                placeholder="添加"
              ></el-input>
            </div>
            <span class="coin-type">{{ item.token }}</span>
            <span class="coin-amount">≈${{ item.inputUsdAmount }}</span>
          </div>
        </div>
      </template>
      <div v-else class="no-record-container">
        <img class="no-record-img" src="@/assets/imgs/no-record.png" alt="no-record" />
        <span class="no-record-txt">{{ $t('message.NoRecords') }}</span>
      </div>
      <div class="bottom-container">
        <p class="bottom-left">
          <span class="total-txt">{{ typeTxt }}{{ $t('message.TotalAmount') }}</span>
          <span class="total-amount">${{ listTotalUsd }}</span>
          <br />
          <span class="total-txt total-exceed-tip" v-show="exceedTotal">累计出售资产数额已超出</span>
        </p>
        <div class="right-btns" v-if="accountType === 'dotc'">
          <p
            class="bottom-right save-from-wallet"
            :class="{ 'disable-gray': !contentList.length }"
            @click="clickDepositFromWallet"
          >从钱包中存入</p>
          <p
            class="bottom-right"
            :class="{ 'disable-gray': !contentList.length }"
            @click="clickConfirmAdd"
          >确定添加</p>
        </div>
        <p
          v-if="accountType === 'wallet'"
          class="bottom-right"
          :class="{ 'disable-gray': !contentList.length }"
          @click="clickConfirmDeposit"
        >确定存入</p>
      </div>
      <span class="bottom-line"></span>
    </div>
  </dialog-box>
</template>

<style lang="styl" scoped>
.add-pledge-body {
  width: 552px;
  .bottom-line {
    position: absolute;
    width: 100%;
    height: 1px;
    background: #F0F3F7;
    bottom: 92px;
    left: 0px;
  }
  .bottom-container {
    margin-top: 44px;
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .bottom-left {
      text-align: left;
      .total-txt {
        font-family: 'Montserrat', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
        color: #959DAD;
      }
      .total-exceed-tip {
        padding-top: 4px;
        color: #F3882B;
      }
      .total-amount {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        color: #3F475A;
        padding-left: 8px;
      }
    }
    .right-btns {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .bottom-right {
      width: 112px;
      height: 48px;
      background: #10B488;
      border-radius: 6px;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      text-align: center;
      color: #FFFFFF;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      margin-left: 16px;
    }
    .save-from-wallet {
      background: rgba(16, 180, 136, 0.1);
      color: #10B488;
      width: 128px;
    }
    .disable-gray {
      background: #F0F3F7;
      color: #959DAD;
    }
  }
  .no-record-container {
    height: 278px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .no-record-img {
      width: 80px;
      height: 80px;
    }
    .no-record-txt {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      text-align: center;
      color: #7B8293;
    }
  }
  .coin-item-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 552px;
    height: 100px;
    border-bottom: 1px solid #F0F3F7;
    .coin-item-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      .coin-type {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        color: #959DAD;
        line-height: 1.6;
      }
      .coin-amount {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        color: #959DAD;
      }
      .pledge-input {
        width: 165px;
        height: 35px;
        border: 1px solid #D8DCE6;
        box-sizing: border-box;
        border-radius: 6px;
        background: #FFFFFF;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0px 8px;
        .pledge-tip {
          font-family: 'PingFang SC', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: #959DAD;
          width: 35px;
          padding: 0px;
        }
      }
    }
    .coin-item-left {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .coin-item-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      .coin-item-txt {
        margin-left: 8px;
        height: 41px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .coin-item-name {
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          color: #1F2933;
        }
        .coin-item-total {
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: #1F2933;
        }
      }
    }
  }
  .column-subject {
    margin-top: 57px;
    padding-bottom: 16px;
    border-bottom: 1px solid #F0F3F7;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-family: 'Montserrat', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #959DAD;
  }
}
</style>

<style lang="styl">
.coin-item-container {
  .coin-item-right {
    .pledge-input {
      .el-input--small {
        .el-input__inner {
          padding: 0px;
          border: none;
          text-align: right;
          padding-left: 3px;
        }
      }
    }
  }
}
</style>

<script setup>
import AddAssets from '@/components/AddAssets/AddAssets.vue'
import SelectBankCard from '../../../../components/SelectBankCard/SelectBankCard.vue'
import { ref, inject, nextTick, reactive, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import queryAllBalance from '@/contract/queryAllBalance.js'
import { ElLoading } from 'element-plus'
import { useStore } from 'vuex'
import queryTokenUsdPrice from '@/contract/queryTokenUsdPrice.js'
import { BigNumber } from "bignumber.js"
import queryPledgeRate from '@/contract/queryPledgeRate.js'
import { ethers } from 'ethers'
import checkConnect from '@/contract/checkConnect.js'
import { ElMessageBox } from 'element-plus'
import { savePledgeInfo, savePledgeHash } from '@/urls/sell-coin.js'
import { getContracts } from '@/contract/contracts.js'
import { gasOpt } from '@/consts/gasOpt.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const updateListStep = inject('updateListStep')
const props = defineProps({
  sellInfo: {
    type: Object,
    required: false,
    default() {
      return {
      }
    }
  }
})
const sellAssetsFirstTip = ref(false)
const store = useStore()
const route = useRoute()
const addAssetsPop = reactive({ addAssetsTitle: '', addAssetsType: '', accountType: '', tokens: [], prepareSell: { token: '', amount: 0 } })
const showAddAssets = ref(false)
const emit = defineEmits(['sellPledgeInfo'])
const sellInfo = JSON.parse(route.query.sellInfo)
const pageInfo = reactive({
  selectedBanks: [],
  maxCouldSellToken: 0,
  sellCoin: sellInfo.symbol,
  allAccountUsd: 0,
  pledgeRateTxt: '',
  maxCouldSellUsd: 0,
  sell: {
    dotc: '0',
  },
  pledge: {
    dotc: '0',
    collateralDotcValues: []
  }
})
const willSellTotalToken = computed(() => BigNumber(pageInfo.sell.dotc).toFixed())
const willPledgeTotalUsd = computed(() => BigNumber(pageInfo.pledge.dotc).toFixed(2))
const needPledgeTotalUsd = computed(() => {
  const res = BigNumber(willSellTotalToken.value).multipliedBy(store.state.tokens[pageInfo.sellCoin].price).multipliedBy(store.state.pledgeRate).toFixed(2)
  return isNaN(res) ? '0.00' : res
})
onMounted(() => {
  updateListStep(2)
  if (!pageInfo.sellCoin) {
    updateListStep(1)
    router.push('/buy-sell/sell-coin/publish-sell/sell-info')
  }
})
function forMatPledgeRateTxt() {
  pageInfo.pledgeRateTxt = BigNumber(store.state.pledgeRate).multipliedBy(100).toFixed() + '%'
}
function calculMaxCouldSellUsd() {
  const { allAccountUsd } = pageInfo
  BigNumber(1).dividedBy(BigNumber())
  const sellRate = BigNumber(1)
  const totalRate = BigNumber(store.state.pledgeRate).plus(1)
  const realRate = sellRate.dividedBy(totalRate)
  const couldSellUsd = realRate.multipliedBy(allAccountUsd).toFixed(2)
  pageInfo.maxCouldSellUsd = couldSellUsd
  return couldSellUsd
}
function clickAddSellFromDotc() {
  if (!checkConnect()) return
  showAddAssets.value = true
  addAssetsPop.addAssetsTitle = 'message.AddFormREEXAccount'
  addAssetsPop.addAssetsType = 'sell'
  addAssetsPop.accountType = 'dotc'
  sellAssetsFirstTip.value = false
  addAssetsPop.tokens = [pageInfo.sellCoin]
  addAssetsPop.prepareSell.token = pageInfo.sellCoin
}
function clickAddSellFromWallet() {
  if (!checkConnect()) return
  showAddAssets.value = true
  addAssetsPop.addAssetsTitle = ''
  addAssetsPop.addAssetsType = 'sell'
  addAssetsPop.accountType = 'wallet'
  sellAssetsFirstTip.value = false
  addAssetsPop.tokens = Object.keys(store.state.tokens)
}
function clickAddPledgeFromDotc() {
  if (!checkConnect()) return
  const sellReady = checkSellRedy()
  if (!sellReady) return
  showAddAssets.value = true
  addAssetsPop.addAssetsTitle = 'message.AddFormREEXAccount'
  addAssetsPop.addAssetsType = 'pledge'
  addAssetsPop.accountType = 'dotc'
  addAssetsPop.tokens = Object.keys(store.state.tokens)
}
function clickAddPledgeFromWallet() {
  if (!checkConnect()) return
  const sellReady = checkSellRedy()
  if (!sellReady) return
  showAddAssets.value = true
  addAssetsPop.addAssetsTitle = '从钱包账户中存入'
  addAssetsPop.addAssetsType = 'pledge'
  addAssetsPop.accountType = 'wallet'
  addAssetsPop.tokens = Object.keys(store.state.tokens)
}
function checkSellRedy() {
  const check = Number(willSellTotalToken.value) <= 0
  if (check) {
    sellAssetsFirstTip.value = true
    return false
  }
  return true
}
const showSelectCard = ref(false)
function clickSelectCard() {
  if (!checkConnect()) return
  showSelectCard.value = true
}
const router = useRouter()
function clickPreStep() {
  updateListStep(1)
  router.push('/buy-sell/sell-coin/publish-sell/sell-info')
}
function checkMinSell() {
  const { minOrderQuantity } = store.state
  if (Number(willSellTotalToken.value) >= Number(minOrderQuantity)) {
    return true
  }
  ElMessageBox({
    title: `最小准备出售量不能低于${minOrderQuantity}个`,
    type: 'warning',
    confirmButtonText: '知道了'
  })
  return false
}
function checkPledgeEnough() {
  if (willPledgeTotalUsd.value >= needPledgeTotalUsd.value) {
    return true
  }
  ElMessageBox({
    title: `已准备锁仓资金不得低于${needPledgeTotalUsd.value}USD`,
    type: 'warning',
    confirmButtonText: '知道了'
  })
  return false
}
function checkBankCard() {
  const hasBankCard = pageInfo.selectedBanks.length > 0
  if (!hasBankCard) {
    ElMessageBox({
      title: '请选择入金银行卡',
      type: 'warning',
      confirmButtonText: '好的'
    })
  }
  return hasBankCard
}
function prepareSellLimitInfo() {
  const { parseUnits } = ethers.utils
  const sellLimitInfo = {
    symbol: sellInfo.symbol,
    token_addr: store.state.tokens[sellInfo.symbol].addr,
    fiat_price: parseUnits(sellInfo.priceLimit, 18),
    low_limit: parseUnits(sellInfo.singleMin, 18),
    high_limit: parseUnits(sellInfo.singleMax, 18),
    fiatPrice: sellInfo.priceLimit,
    lowLimit: sellInfo.singleMin,
    highLimit: sellInfo.singleMax
  }
  return sellLimitInfo
}
function prepareSellInfo() {
  const { sellCoin, sell } = pageInfo
  const { tokens } = store.state
  const { parseUnits, formatUnits } = ethers.utils
  const { decimals } = tokens[sellCoin]
  const { collateralDotcValues } = pageInfo.pledge
  const collateral_tokens = addAssetsPop.tokens.map(token => tokens[token].addr)
  console.log('=collateralDotcValues=', collateralDotcValues)
  const collateral_dotc_values = Array.from(collateralDotcValues)
  const hasValueTokens = []
  const hasValuePledges = collateral_dotc_values.filter((item, index) => {
    const hasValue = Number(item) > 0
    if (hasValue) {
      hasValueTokens.push(collateral_tokens[index])
    }
    return hasValue
  })
  const sellPledgeInfo = {
    dotc_amount: parseUnits(sell.dotc, decimals),
    collateral_tokens: hasValueTokens,
    collateral_dotc_values: hasValuePledges,
    bankIds: pageInfo.selectedBanks.map(item => (item.bankId || item.id)),
    dotcAmount: sell.dotc,
    pledges: addAssetsPop.tokens.map((token, index) => {
      return {
        symbol: token,
        amount: formatUnits(collateral_dotc_values[index], tokens[token].decimals),
        address: collateral_tokens[index]
      }
    })
  }
  return sellPledgeInfo
}
function listenEvent() {
  getContracts().dotcIns.on('NewAdOrder', function recieve() {
    console.log('=-NewAdOrder-res=', arguments)
  })
}
async function publishSellOrder(sellLimitInfo, sellPledgeInfo) {
  const { symbol, token_addr, fiat_price, low_limit, high_limit, fiatPrice, lowLimit, highLimit } = sellLimitInfo
  const { dotc_amount, collateral_tokens, collateral_dotc_values, bankIds, dotcAmount, pledges } = sellPledgeInfo
  let loadingInstance = ElLoading.service({ fullscreen: true })
  listenEvent()
  const { orderNo } = await savePledgeInfo({ symbol, fiatPrice, lowLimit, highLimit, dotcAmount, usd2Cny: store.state.floatRate.usd2Cny, totalPledgeAmt: willPledgeTotalUsd.value, pledges, bankIds })
  console.log('=sellOrder=', { ...sellLimitInfo, ...sellPledgeInfo })
  const sellOrderTx = await getContracts().dotcIns.write.new_sell_ad_order(token_addr, fiat_price, low_limit, high_limit, dotc_amount, collateral_tokens, collateral_dotc_values, gasOpt)
  console.log('=sellOrderTx=', sellOrderTx)
  if (sellOrderTx.hash) {
    const [sellOrderReciept, backSaveHash] = await Promise.all([sellOrderTx.wait(), savePledgeHash({ orderNo, txHash: sellOrderTx.hash })])
    console.log('=sellOrderReciept=', sellOrderReciept)
    console.log('=backSaveHash=', backSaveHash)
    if (sellOrderReciept.status) {
      await queryAllBalance()
    }
    loadingInstance.close()
    loadingInstance = null
    updateListStep(3)
  }
  router.push({ path: '/buy-sell/sell-coin/publish-sell/publish-success', query: { sellCoin: pageInfo.sellCoin, orderNo } })
}
function clickPublishSell() {
  if (!checkBankCard()) return
  if (!checkConnect()) return
  if (!checkMinSell()) return
  if (!checkPledgeEnough()) return
  const sellLimitInfo = prepareSellLimitInfo()
  const sellPledgeInfo = prepareSellInfo()
  publishSellOrder(sellLimitInfo, sellPledgeInfo)
}
function clickConfirmAdd({ addAssetsType, sumAmount }) {
  // addAssetsType 添加类型，值为sell、pledge
  // addAmount 添加的币种及数量{ dotc: 2, wallet:5 }
  // 整个数据结构 { sell: { dotc: 2, wallet: 10 }, pledge: { dotc: 1, wallet: 2 } }
  const accountSell = { ...pageInfo[addAssetsType], ...sumAmount }
  pageInfo[addAssetsType] = accountSell
  if (addAssetsType === 'sell') {
    addAssetsPop.prepareSell.amount = accountSell.dotc
  }
}
function calculAllAccountUsd() {
  const { tokens, dotc } = store.state
  const dotcUsd = Object.keys(dotc).reduce((sum, token) => {
    sum = BigNumber(dotc[token].amount).multipliedBy(tokens[token].price).plus(sum).toFixed()
    return sum
  }, 0)
  const walletUsd = Object.keys(tokens).reduce((sum, token) => {
    sum = BigNumber(tokens[token].balance).multipliedBy(tokens[token].price).plus(sum).toFixed()
    return sum
  }, 0)
  pageInfo.allAccountUsd = BigNumber(dotcUsd).plus(walletUsd).toFixed()
}
function calculMaxCouldSellToken() {
  const { sellCoin } = pageInfo
  const { tokens, dotc } = store.state
  const maxCouldSell = BigNumber(tokens[sellCoin].balance).plus(dotc[sellCoin].amount).toFixed()
  pageInfo.maxCouldSellToken = maxCouldSell
}
function initPageInfo() {
  calculMaxCouldSellToken()
  calculAllAccountUsd()
  forMatPledgeRateTxt()
  calculMaxCouldSellUsd()
  initCollateralArray()
}
function initCollateralArray() {
  const { tokens } = store.state
  const zeroValues = Object.keys(tokens).map(token => ethers.utils.parseUnits('0', tokens[token].decimals))
  pageInfo.pledge.collateralWalletValues = zeroValues
  pageInfo.pledge.collateralDotcValues = zeroValues
}
watch(
  () => store.getters.addressAndContractReady,
  async (ready) => {
    if (ready) {
      let loadingInstance = ElLoading.service({ fullscreen: true })
      await Promise.all([queryAllBalance(), queryTokenUsdPrice(), queryPledgeRate()])
      initPageInfo()
      loadingInstance.close()
      loadingInstance = null
    }
  },
  { immediate: true }
)
const exceedMaxSellQuota = computed(() => {
  return Number(willSellTotalToken.value) > Number(pageInfo.maxCouldSellToken)
})
function recievePledgeValues(pledgeInfo) {
  const { addAssetsType } = pledgeInfo
  console.log('=recievePledgeInfo=', addAssetsType, pledgeInfo)
  Object.keys(pledgeInfo).forEach((key) => {
    if (key !== 'addAssetsType') {
      pageInfo[addAssetsType][key] = pledgeInfo[key]
    }
  })
}
function recieveSelectedBankCards(selectedBanks) {
  pageInfo.selectedBanks = selectedBanks
}
async function changeAccountType(accountType) {
  showAddAssets.value = false
  addAssetsPop.accountType = accountType
  addAssetsPop.tokens = addAssetsPop.addAssetsType === 'sell' ? [pageInfo.sellCoin] : Object.keys(store.state.tokens)
  await nextTick()
  showAddAssets.value = true
}
</script>

<template>
  <div class="pledge-uplink-container">
    <div class="no-assets-tip" v-show="sellAssetsFirstTip">请先准备出售资产</div>
    <select-bank-card v-model="showSelectCard" @selectedBankCards="recieveSelectedBankCards"></select-bank-card>
    <add-assets
      v-model="showAddAssets"
      @confirmAdd="clickConfirmAdd"
      v-bind="addAssetsPop"
      @pledgeValues="recievePledgeValues"
      @changeAccountType="changeAccountType"
    ></add-assets>
    <p class="pledge-head">{{ $t('message.PledgeAssetOnChian') }}</p>
    <p class="pledge-assets">准备出售资产</p>
    <p class="max-amount">
      <span class="max-amount-txt">最多可出售额度</span>
      <el-tooltip placement="top-start" effect="light">
        <template #content>
          <p class="price-limit-question-pop-tip">
            <span>您总可锁仓资产是{{ pageInfo.allAccountUsd }} USD，按{{ pageInfo.pledgeRateTxt }}质押率，理论最多可出售{{ pageInfo.maxCouldSellUsd }} USD</span>
            <!-- <span>，同时您有2000.00 USD的免质押额度，实际最多可出售12000.00 USD。</span> -->
          </p>
        </template>
        <img class="wenhao-icon" src="@/assets/imgs/wenhao-icon.png" alt="wenhao-icon" />
      </el-tooltip>
      <span class="max-amount-num">{{ pageInfo.maxCouldSellToken + ' ' + pageInfo.sellCoin }}</span>
    </p>
    <div class="has-prepare">
      <div class="prepare-amount">
        <span class="prepare-left">已准备</span>
        <div class="prepare-right">
          <span class="prepare-num">{{ willSellTotalToken }}</span>
          <span class="prepare-unit">&nbsp;{{ pageInfo.sellCoin }}</span>
        </div>
      </div>
      <p class="prepare-tip" v-show="exceedMaxSellQuota">{{ $t('message.ExceededReset') }}</p>
      <p class="prepare-divide"></p>
      <div class="dotc-row">
        <span class="dotc-left">DOTC账户</span>
        <p class="dotc-right">
          <span class="dotc-num">{{ pageInfo.sell.dotc }}</span>
          <span class="dotc-unit">&nbsp;{{ pageInfo.sellCoin }}</span>
          <img
            class="plus-icon"
            src="@/assets/imgs/plus-icon.png"
            alt="plus-icon"
            @click="clickAddSellFromDotc"
          />
        </p>
      </div>
    </div>
    <p class="expense-tip">平台会收取1%的质押资产作为管理费用</p>
    <div class="total-lock">
      <span class="total-lock-left">总计锁仓资产</span>
      <p class="total-lock-right">
        <span class="total-lock-num">{{ needPledgeTotalUsd }}</span>
        <span class="total-lock-unit">&nbsp;USD</span>
      </p>
    </div>
    <!-- <p class="pledge-free">免质押额度 2000.00 USD</p> -->
    <div class="has-prepare">
      <div class="prepare-amount">
        <span class="prepare-left">已准备锁仓资金</span>
        <div class="prepare-right">
          <span class="prepare-num">{{ willPledgeTotalUsd }}</span>
          <span class="prepare-unit">&nbsp;USD</span>
        </div>
      </div>
      <p class="prepare-divide"></p>
      <div class="dotc-row">
        <span class="dotc-left">DOTC账户</span>
        <p class="dotc-right">
          <span class="dotc-num">{{ pageInfo.pledge.dotc }}</span>
          <span class="dotc-unit">&nbsp;USD</span>
          <img
            class="plus-icon"
            src="@/assets/imgs/plus-icon.png"
            alt="plus-icon"
            @click="clickAddPledgeFromDotc"
          />
        </p>
      </div>
    </div>
    <div class="select-bank-card">
      <span class="select-bank-card-left">选择入金银行卡</span>
      <p class="select-bank-card-right" @click="clickSelectCard">
        <span class="selected-nums">已选择{{ pageInfo.selectedBanks.length }}张</span>
        <el-icon class="right-arrow-icon">
          <arrow-right />
        </el-icon>
      </p>
    </div>
    <div class="bottom-btns">
      <span class="left-btn" @click="clickPreStep">上一步</span>
      <span class="right-btn" @click="clickPublishSell">{{ $t('message.PulishSellOrder') }}</span>
    </div>
  </div>
</template>

<style lang="styl" scoped>
.pledge-uplink-container {
  width: 486px;
  height: 722px;
  background: #FFFFFF;
  border: 1px solid #F0F3F7;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 32px;
  box-sizing: border-box;
  position: relative;
  .no-assets-tip {
    position: absolute;
    width: 144px;
    height: 36px;
    background: #1F2933;
    opacity: 0.8;
    border-radius: 6px;
    line-height: 36px;
    text-align: center;
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #FFFFFF;
    top: 416px;
    left: 50%;
    transform: translateX(-50%);
  }
  .pledge-head {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 132%;
    color: #1F2933;
    margin-bottom: 32px;
    text-align: left;
  }
  .pledge-assets {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 132%;
    color: #1F2933;
    text-align: left;
  }
  .prepare-lock {
    padding: 20px 16px;
    width: 422px;
    height: 138px;
    background: #F7F9FC;
    border-radius: 6px;
    box-sizing: border-box;
  }
  .pledge-free {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 132%;
    color: #959DAD;
    text-align: right;
  }
  .total-lock {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .total-lock-left {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 132%;
      color: #1F2933;
    }
    .total-lock-right {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
      .total-lock-num {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 132%;
        text-align: right;
        color: #1F2933;
      }
      .total-lock-unit {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: bold;
        line-height: 1.9;
        text-align: right;
        color: #1F2933;
        font-size: 12px;
        padding-left: 5px;
      }
    }
  }
  .expense-tip {
    font-family: 'SF UI Text', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 132%;
    color: #959DAD;
    margin: 12px 0px 24px 0px;
    text-align: left;
  }
  .bottom-btns {
    margin-top: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .left-btn {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 14px 16px;
      width: 96px;
      height: 48px;
      background: rgba(16, 180, 136, 0.1);
      border-radius: 6px;
      box-sizing: border-box;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 132%;
      text-align: center;
      color: #10B488;
    }
    .right-btn {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 14px 24px;
      width: 310px;
      height: 48px;
      background: #10B488;
      border-radius: 6px;
      box-sizing: border-box;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 132%;
      text-align: center;
      color: #FFFFFF;
    }
  }
  .select-bank-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    .select-bank-card-left {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 132%;
      color: #1F2933;
    }
    .select-bank-card-right {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;
      .selected-nums {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 132%;
        text-align: right;
        color: #1F2933;
      }
      .right-arrow-icon {
        width: 16px;
        height: 16px;
      }
    }
  }
  .has-prepare {
    padding: 20px 16px;
    width: 422px;
    height: 120px;
    background: #F7F9FC;
    border-radius: 6px;
    box-sizing: border-box;
    margin-top: 16px;
    .dotc-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      .dotc-left {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #6E798F;
      }
      .dotc-right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        .dotc-num,
        .dotc-unit {
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 132%;
          text-align: right;
          color: #1F2933;
        }
        .plus-icon {
          width: 16px;
          height: 16px;
          margin-left: 4px;
          cursor: pointer;
        }
      }
    }
    .prepare-divide {
      height: 16px;
      border-bottom: 1px solid #F0F3F7;
      margin-bottom: 8px;
    }
    .prepare-tip {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 132%;
      color: #E35E5E;
      margin-top: 3px;
      text-align: right;
    }
    .prepare-amount {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .prepare-left {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: #6E798F;
      }
      .prepare-right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: right;
        .prepare-num,
        .prepare-unit {
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 132%;
          text-align: right;
          color: #1F2933;
        }
      }
    }
  }
  .max-amount {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .max-amount-txt {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 132%;
      color: #959DAD;
      margin-top: 4px;
    }
    .wenhao-icon {
      width: 16px;
      height: 16px;
      margin: 0px 4px 0px 2px;
      cursor: pointer;
    }
    .max-amount-num {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 132%;
      color: #3F475A;
      mix-blend-mode: normal;
    }
  }
}
</style>
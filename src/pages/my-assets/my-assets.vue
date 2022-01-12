<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import PledgeAssetTable from '@/components/MyAssetTable/PledgeAssetTable.vue'
import CashRecordTable from '@/components/MyAssetTable/CashRecordTable.vue'
import InTransactionTable from '@/components/MyAssetTable/InTransactionTable.vue'
import PunishRecordTable from '@/components/MyAssetTable/PunishRecordTable.vue'
import DialogBox from '@/components/DialogBox/DialogBox.vue'
import SellOrderTable from '@/components/MyAssetTable/SellOrderTable.vue'
import WalletAccountTable from '@/components/MyAssetTable/WalletAccountTable.vue'
import SaveToDotc from '@/components/MyAssetTable/SaveToDotc.vue'
import WithDrawalFromDotc from '@/components/MyAssetTable/WithDrawalFromDotc.vue'
import store from '@/store'
import { ethers } from 'ethers'
import { ElMessage } from 'element-plus'
import queryAllBalance from '@/contract/queryAllBalance.js'
import { getContracts } from '@/contract/contracts.js'
import { useI18n } from 'vue-i18n'
import BigNumber from 'bignumber.js'
import { queryPledge, queryTrading, querySpot, queryPunish } from '@/urls/my-assets'
import { ElLoading } from 'element-plus'

const { t } = useI18n()
const showWithDrawalFromDotc = ref(false)
const showSaveDotcAccount = ref(false)
const showWalletAccount = ref(false)
const showSellDetail = ref(false)
const role = ref('以买卖双方身份查看')
const roleOptions = [
  { label: 'message.AllRoleLook', value: 'message.AllRoleLook' },
  { label: '以买方身份查看', value: '以买方身份查看' },
  { label: '以卖方身份查看', value: '以卖方身份查看' }
]
const activeAssetType = ref(4)
const walletTotalAssets = ref('--')
const dotcAssets = reactive({
  totalUsd: '--',
  pledgeAssets: '--',
  tradingAssets: '--',
  cashAssets: '--',
  punishAssets: '--'
})
const depositToken = ref('--')
watch(
  () => store.getters.addressAndContractReady,
  async (newV) => {
    if (newV) {
      await queryAllBalance()
      handleWalletTotalAssets()
    }
  },
  { immediate: true }
)
onMounted(async () => {
  const req = { pageIndex: 1, pageSize: 20 }
  const loading = ElLoading.service({ fullscreen: true })
  const assetsArr = await Promise.all([queryPledge(req), queryTrading(req), querySpot(req), queryPunish(req)])
  initDotcAssets(assetsArr)
  loading.close()
})
function initDotcAssets(assetsArr) {
  const [pledgeAssets, tradingAssets, cashAssets, punishAssets] = assetsArr
  dotcAssets.pledgeAssets = pledgeAssets
  dotcAssets.tradingAssets = tradingAssets
  dotcAssets.cashAssets = cashAssets
  dotcAssets.punishAssets = punishAssets
}
function clickWithDrawal() {
  showWithDrawalFromDotc.value = true
}
function clickCompleteOrder() { }
function clickMore() {
  showWalletAccount.value = true
}
function lookDetail() {
  showSellDetail.value = true
}
async function clickSaveDotcAccount(token) {
  showSaveDotcAccount.value = true
  depositToken.value = token
}
function handleWalletTotalAssets() {
  const tokens = store.state.tokens
  walletTotalAssets.value = Object.keys(tokens).reduce((sum, currentCoin) => {
    const balance = tokens[currentCoin].balance
    const price = tokens[currentCoin].price
    return BigNumber(balance).multipliedBy(price).plus(sum).toString()
  }, 0)
}
function clickCancelSave() {
  showSaveDotcAccount.value = false
}
function clickConfirmSave() {
  // 请求存入dotc，然后关闭弹窗
  showSaveDotcAccount.value = false
}
function clickCancelWithDrawal() {
  showWithDrawalFromDotc.value = false
}
function clickConfirmWithDrawal() {
  // 请求从dotc提现，然后关闭弹窗
  showWithDrawalFromDotc.value = false
}
// onMounted(async () => {
//   await queryAllBalance()
// })
</script>

<template>
  <div class="my-assets-home">
    <dialog-box title="从DOTC账户提现" v-model="showWithDrawalFromDotc" width="392px">
      <with-drawal-from-dotc
        @clickCancel="clickCancelWithDrawal"
        @clickConfirm="clickConfirmWithDrawal"
        excessBalance
      ></with-drawal-from-dotc>
    </dialog-box>
    <dialog-box title="存入DOTC账户" v-model="showSaveDotcAccount" width="392px">
      <save-to-dotc
        :depositToken="depositToken"
        @clickCancel="clickCancelSave"
        @clickConfirm="clickConfirmSave"
      ></save-to-dotc>
    </dialog-box>
    <dialog-box title="钱包账户" v-model="showWalletAccount">
      <wallet-account-table @clickSaveDotcAccount="clickSaveDotcAccount"></wallet-account-table>
    </dialog-box>
    <dialog-box title="卖单详情" v-model="showSellDetail">
      <sell-order-table></sell-order-table>
    </dialog-box>
    <el-select v-model="role" placeholder="Select" class="role-selector">
      <el-option
        v-for="item in roleOptions"
        :key="item.value"
        :label="$t(item.label)"
        :value="item.value"
      ></el-option>
    </el-select>
    <p class="total-assets-title">账户总资产</p>
    <div class="total-assets-desc">
      <span class="total-assets-num">$6,198.00</span>
      <!-- <div class="pledge-free">
        <span class="pledge-free-txt">免抵押额度</span>
        <span class="pledge-free-num">100/2000 USDT</span>
      </div>-->
    </div>
    <div class="asset-type">
      <div class="dotc-account asset-card">
        <p class="account-name">DOTC账户</p>
        <p class="account-amount">$2,443.56</p>
        <div class="account-type">
          <span class="type-asset">抵押账户资产</span>
          <span class="type-amount">$61980</span>
        </div>
        <div class="account-type">
          <span class="type-asset">交易中资产</span>
          <span class="type-amount">$61980</span>
          <p class="operate" @click="clickCompleteOrder">
            <span class="operate-txt">去完成订单</span>
            <img class="right-arrow" src="@/assets/imgs/right-arrow.png" alt="right-arrow" />
          </p>
        </div>
        <div class="account-type">
          <span class="type-asset">现货账户资产</span>
          <span class="type-amount">$61980</span>
          <p class="operate" @click="clickWithDrawal">
            <span class="operate-txt">提现到钱包</span>
            <img class="right-arrow" src="@/assets/imgs/right-arrow.png" alt="right-arrow" />
          </p>
        </div>
      </div>
      <div class="cash-accpunt asset-card">
        <div class="wallet-asset">
          <p class="account-name">钱包账户资产</p>
          <!-- <p class="account-more" @click="clickMore">
            <span class="more-txt">更多</span>
            <img class="right-arrow" src="@/assets/imgs/right-arrow.png" alt="right-arrow" />
          </p>-->
        </div>
        <p class="account-amount">${{ walletTotalAssets }}</p>
        <div class="account-type">
          <p class="type-asset">
            <img class="dai-icon" src="@/assets/imgs/dai-icon.png" alt="dai-icon" />
            <span class="dai-txt">DAI</span>
          </p>
          <span class="type-amount">{{ $store.state.tokens.DAI.balance }}</span>
          <p
            class="operate"
            @click="clickSaveDotcAccount('DAI')"
            v-if="$store.state.tokens.DAI.balance > 0"
          >
            <span class="operate-txt">存入DOTC账户</span>
            <img class="right-arrow" src="@/assets/imgs/right-arrow.png" alt="right-arrow" />
          </p>
        </div>
        <div class="account-type">
          <p class="type-asset">
            <img class="dai-icon" src="@/assets/imgs/usdt-icon.png" alt="usdt-icon" />
            <span class="dai-txt">USDT</span>
          </p>
          <span class="type-amount">{{ $store.state.tokens.USDT.balance }}</span>
          <p
            class="operate"
            @click="clickSaveDotcAccount('USDT')"
            v-if="$store.state.tokens.USDT.balance > 0"
          >
            <span class="operate-txt">存入DOTC账户</span>
            <img class="right-arrow" src="@/assets/imgs/right-arrow.png" alt="right-arrow" />
          </p>
        </div>
        <div class="account-type">
          <p class="type-asset">
            <img class="dai-icon" src="@/assets/imgs/usdc-icon.png" alt="usdc-icon" />
            <span class="dai-txt">USDC</span>
          </p>
          <span class="type-amount">{{ $store.state.tokens.USDC.balance }}</span>
          <p
            class="operate"
            @click="clickSaveDotcAccount('USDC')"
            v-if="$store.state.tokens.USDC.balance > 0"
          >
            <span class="operate-txt">存入DOTC账户</span>
            <img class="right-arrow" src="@/assets/imgs/right-arrow.png" alt="right-arrow" />
          </p>
        </div>
      </div>
    </div>
    <p class="asset-status-type">
      <span
        class="type-item"
        :class="{ 'is-active': activeAssetType === 1 }"
        @click="activeAssetType = 1"
      >抵押资产</span>
      <span
        class="type-item"
        :class="{ 'is-active': activeAssetType === 2 }"
        @click="activeAssetType = 2"
      >交易中</span>
      <span
        class="type-item"
        :class="{ 'is-active': activeAssetType === 3 }"
        @click="activeAssetType = 3"
      >现货交易记录</span>
      <span
        class="type-item"
        :class="{ 'is-active': activeAssetType === 4 }"
        @click="activeAssetType = 4"
      >处罚记录</span>
    </p>
    <pledge-asset-table v-if="activeAssetType === 1" @lookDetail="lookDetail" />
    <in-transaction-table v-if="activeAssetType === 2" />
    <cash-record-table v-if="activeAssetType === 3" />
    <punish-record-table v-if="activeAssetType === 4" />
  </div>
</template>

<style scoped lang="styl">
.my-assets-home {
  width: 100%;
  text-align: left;
  padding-top: 40px;
  .asset-status-type {
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 48px;
    .type-item {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 48px;
      color: #959DAD;
      margin-right: 24px;
      cursor: pointer;
    }
    .is-active {
      color: #3F475A;
      border-bottom: 1px solid #10B488;
    }
  }
  .role-selector {
    text-align: left;
  }
  .asset-type {
    margin-top: 18px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .asset-card {
      width: 588px;
      height: 290px;
      background: #F7F9FC;
      border-radius: 12px;
      padding: 32px 32px;
      box-sizing: border-box;
      .wallet-asset {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .account-more {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          cursor: pointer;
          .more-txt {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 132%;
            color: #10B488;
          }
          .right-arrow {
            width: 16px;
            height: 16px;
            margin-left: 4px;
          }
        }
      }
      .account-name {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #959DAD;
      }
      .account-amount {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 132%;
        color: #1F2933;
        margin-bottom: 24px;
      }
      .account-type {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 56px;
        .type-asset {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 132%;
          color: #6E798F;
          width: 182px;
          text-align: left;
        }
        .type-amount {
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 132%;
          color: #1F2933;
          width: 181px;
          margin-left: 24px;
        }
        .operate {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          width: 116px;
          margin-left: 21px;
          cursor: pointer;
          .operate-txt {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 132%;
            color: #10B488;
          }
          .right-arrow {
            width: 16px;
            height: 16px;
            margin-left: 4px;
          }
        }
      }
    }
    .dotc-account {
    }
    .cash-accpunt {
      .account-type {
        .type-asset {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          .dai-icon {
            width: 28px;
            height: 28px;
          }
          .dai-txt {
            font-family: 'SF UI Text', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 132%;
            color: #1F2933;
            margin-left: 8px;
          }
        }
      }
    }
  }
  .total-assets-title {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: #60687B;
    margin-top: 41px;
  }
  .total-assets-desc {
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .pledge-free {
      width: 184px;
      height: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .pledge-free-txt {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: #60687B;
      }
      .pledge-free-num {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #1F2933;
      }
    }
    .total-assets-num {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 36px;
      line-height: 132%;
      color: #1F2933;
    }
  }
}
</style>

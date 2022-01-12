<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import useBuyDialogBox from '@/composables/useBuyDialogBox.js'
import BigNumber from 'bignumber.js'
import { ElLoading } from 'element-plus'
import queryTokenUsdPrice from '@/contract/queryTokenUsdPrice.js'
import { queryFloatRate } from '@/urls/common-api.js'
import { querySellList } from '@/urls/buy-coin.js'
import ScrollTable from '@/components/ScrollTable/ScrollTable.vue'
import formatAddress from '@/tools/formatAddress.js'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useStore()
const router = useRouter()
const selectedCoin = ref('USDT')
const inputCnyAmount = ref('0.00')
// const sellList = reactive({ total: 0, ignoreBuyTip: 0, records: [{ symbol: 'USDT', sellAddress: '0xc59Ca1f01b99C15F8bb8ABE3B92fa4fD6dc6D4AA', amount: 20, minPrice: 100, minLimit: 1000, maxLimit: 2000, sellCount: 50, orderNo: '123', sellId: '456' }], })
const sellList = reactive({ total: 0, ignoreBuyTip: 0, records: [], })
const reqConf = reactive({ pageIndex: 1, pageSize: 20, cnyTotal: inputCnyAmount.value, symbol: selectedCoin.value, usd2Cny: store.state.floatRate.usd2Cny })
const coinTypes = Object.keys(store.state.tokens).map(token => ({ ...store.state.tokens[token], english: token }))
const {
  confirmBoxContent,
  boxShow,
  showBuyTip,
  clickBuy,
  remNoTip,
  befBuySecs,
  clickMeKnown,
  clickBoxConfirm,
  clickBoxCancel
} = useBuyDialogBox(router)
const selectedIcon = computed(() => store.state.tokens[selectedCoin.value].icon)
const outputCoinAmount = computed(() => {
  const price = store.state.tokens[selectedCoin.value].price
  if (!Number(price)) return '0.00'
  return BigNumber(parseFloat(inputCnyAmount.value)).multipliedBy(store.state.floatRate.cny2Usd).dividedBy(store.state.tokens[selectedCoin.value].price)
})
watch(
  () => store.state.floatRate.usd2Cny,
  (newV) => {
    reqConf.usd2Cny = newV
  },
  { immediate: true }
)
watch(
  inputCnyAmount,
  (newV) => {
    reqConf.cnyTotal = newV
  }
)
watch(
  selectedCoin,
  (newV) => {
    reqConf.symbol = newV
  }
)
watch(
  () => store.getters.addressAndContractReady,
  async (newV) => {
    if (newV) {
      // selectedIndex.value = -1
      let loadingInstance = ElLoading.service({ fullscreen: true })
      await Promise.all([queryTokenUsdPrice(), queryFloatRate()])
      await reqQuerySellList()
      loadingInstance.close()
      loadingInstance = null
    }
  },
  { immediate: true }
)
const refreshFn = debounce(async (newV) => {
  console.log('=refreshFn=')
  await reqQuerySellList()
}, 1500)
watch(
  reqConf,
  refreshFn,
  { deep: true }
)
watch(
  () => sellList.ignoreBuyTip,
  (newV) => {
    showBuyTip.value = !newV
    if (newV) {
      remNoTip.value = newV
    }
  }
)
const selectedSymbolCnyPrice = computed(() => {
  return BigNumber(store.state.tokens[reqConf.symbol].price).multipliedBy(store.state.floatRate.usd2Cny).toString()
})
function debounce(fun, delay) {
  let deferTimer = null
  return (newV) => {
    // 获取函数的作用域和变量
    // 每次事件被触发，都会清除当前的timeer，然后重写设置超时调用
    if (parseFloat(newV.cnyTotal) > 0) {
      deferTimer && (clearTimeout(deferTimer), deferTimer = null)
      deferTimer = setTimeout(function () {
        fun(newV)
      }, delay)
    }
  }
}
function reqMoreData() {
  reqConf.pageSize += 20
}
async function reqQuerySellList() {
  let loadingInstance = ElLoading.service({ fullscreen: true })
  sellList.ignoreBuyTip = 1
  reqConf.usd2Cny = store.state.floatRate.usd2Cny
  const sellOrders = await querySellList(reqConf)
  if (sellOrders) {
    Object.keys(sellOrders).forEach((key) => {
      sellList[key] = sellOrders[key]
    })
  }
  loadingInstance.close()
}
</script>
<template>
  <div class="seller-list-container">
    <dialog-box v-model="showBuyTip" title="下单时，您需有资产质押">
      <div class="before-buy-dialog">
        <div class="before-buy-desc-list">
          <div class="before-buy-desc-item">
            <span class="before-buy-item-dot"></span>
            <div class="before-buy-item-subject">
              <p class="before-buy-subject-bold">为什么要用资产抵押？</p>
              <span>{{ showBuyTip }}</span>
              <p class="before-buy-subject-gray">DOTC以用户的抵押资产作为抗风险手段，用户匿名购买资产需有信用委托。</p>
            </div>
          </div>
          <div class="before-buy-desc-item">
            <span class="before-buy-item-dot"></span>
            <div class="before-buy-item-subject">
              <p class="before-buy-subject-bold">如何用资产抵押？</p>
              <p
                class="before-buy-subject-gray"
              >如果您在平台合作的项目中已有投资，可直接用正在投资的资金进行抵押即可，投资资金抵押后，您可继续在投资平台进行投资，您会持续有收益。</p>
              <p class="before-buy-subject-gray">您也可以通过钱包账户抵押到DOTC，从而完成买币流程。</p>
            </div>
          </div>
          <div class="before-buy-desc-item">
            <span class="before-buy-item-dot"></span>
            <div class="before-buy-item-subject">
              <p class="before-buy-subject-bold">我需要质押多少？</p>
              <p
                class="before-buy-subject-gray"
              >DOTC目前实行{{ $store.state.pledgeRate * 100 % + '%' }}质押率，您购买的资产数额即为抵押数额。</p>
            </div>
          </div>
        </div>
        <div class="before-buy-tip-btn">
          <el-checkbox v-model="remNoTip" :label="$t('message.DontMentionTitle')"></el-checkbox>
          <span
            class="count-down-btn"
            :class="{ 'tip-timer-over': befBuySecs === 0 }"
            @click="clickMeKnown"
          >{{ $t('message.IKnown') }}({{ befBuySecs }}s)</span>
        </div>
      </div>
    </dialog-box>
    <confirm-box
      v-model="boxShow"
      v-bind="confirmBoxContent"
      @clickConfirm="clickBoxConfirm(inputCnyAmount, outputCoinAmount)"
      @clickCancel="clickBoxCancel"
    ></confirm-box>
    <div class="change-rate">
      <el-input v-model="inputCnyAmount" placeholder="0.00" class="cny-wrap">
        <template #suffix>
          <div class="right-icon-container">
            <!-- <span class="cny-icon"></span> -->
            <img src="@/assets/imgs/cny-icon.png" alt="cny-icon" style="width:16px;height:16px;" />
            <span class="txt-cny">CNY</span>
          </div>
        </template>
      </el-input>
      <span class="yue-dengyu">&#8776;</span>
      <div class="select-wrap">
        <el-input v-model="outputCoinAmount" placeholder="0.00" class="token-input" />
        <el-select
          v-model="selectedCoin"
          placeholder="Select"
          class="nest-select"
          :style="{ backgroundImage: 'url(' + selectedIcon + ')' }"
        >
          <el-option
            v-for="(item, index) in coinTypes"
            :key="index"
            :label="item.english"
            :value="item.english"
            class="custom-select-option"
          >
            <img :src="item.icon" class="select-option-img" />
            <span class="select-option-txt">{{ item.english }}</span>
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="market-uni-price">
      <div class="uni-price-left">
        <span class="price-tip">{{ $t('message.MarketPrice') }}</span>
        <span class="price-rate">1 {{ reqConf.symbol }} ≈ {{ selectedSymbolCnyPrice }}CNY</span>
      </div>
      <div class="uni-price-right">
        <span class="price-tip">{{ $t('message.PaymentMethod') }}</span>
        <span class="price-rate">{{ $t('message.BankCard') }}</span>
      </div>
    </div>
    <div class="seller-product-list">
      <div class="seller-product-list-header">
        <span class="sell-address">{{ $t('message.Seller') }}</span>
        <span class="sell-amount">{{ $t('message.TotalSales') }}</span>
        <span class="sell-limit">{{ $t('message.SingleLimit') }}</span>
      </div>

      <scroll-table
        class="seller-product-list-body"
        @moreData="reqMoreData"
        v-if="$store.getters.addressAndContractReady"
      >
        <div class="no-buyer-txt" v-if="!sellList.records.length">{{ $t('message.NoBuyers') }}</div>
        <div
          class="seller-product-list-item"
          v-for="(record, index) in sellList.records"
          :key="index"
        >
          <div class="item-address">
            <img class="tou-xiang" :src="$store.state.tokens[record.symbol].icon" />
            <div class="adress-deal">
              <span class="top-adress">{{ formatAddress(record.sellAddress) }}</span>
              <span
                class="bottom-deal"
                v-if="record.sellCount > 10"
              >{{ $t('message.CompletedOrdersAmt') }} {{ record.sellCount }}</span>
            </div>
          </div>
          <div class="item-amount">
            <span class="amount-number">{{ record.amount }}</span>
            <span class="amount-coin">{{ record.symbol }}</span>
          </div>
          <div class="item-limit">
            <span class="limit-amount">{{ record.minLimit }}-{{ record.maxLimit }}</span>
            <span class="limit-coin">CNY</span>
          </div>
          <div
            class="buy-btn"
            @click="clickBuy(record, inputCnyAmount, outputCoinAmount)"
          >{{ $t('message.buy') }}</div>
        </div>
        <!-- <div class="seller-product-list-item">
          <div class="item-address">
            <div class="tou-xiang">0x</div>
            <div class="adress-deal">
              <span class="top-adress">0xasdf...asdf</span>
              <span class="bottom-deal">{{ $t('message.CompletedOrdersAmt') }} 35</span>
            </div>
          </div>
          <div class="item-amount">
            <span class="amount-number">800,000.00</span>
            <span class="amount-coin">USDT</span>
          </div>
          <div class="item-limit">
            <span class="limit-amount">8,000-100,00</span>
            <span class="limit-coin">CNY</span>
          </div>
          <div class="buy-btn" @click="clickBuy">{{ $t('message.Buy') }}</div>
        </div>-->
      </scroll-table>
      <div class="wallet-disconnect" v-else>
        <img
          src="@/assets/imgs/wallet-disconnect.png"
          alt="wallet-disconnect"
          class="wallet-disconnect-png"
        />
        <span class="wallet-disconnect-tip">{{ $t('message.BuyNoConnect') }}</span>
        <span
          class="wallet-disconnect-btn cursor-pointer"
          @click="$store.dispatch('connectWallet')"
        >{{ $t('message.ConnectWallet') }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="styl">
@import '../../../../assets/css/common.styl';
.seller-list-container {
  .before-buy-dialog {
    padding-top: 9px;
    .before-buy-desc-list {
      .before-buy-desc-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 15px;
        .before-buy-item-dot {
          width: 6px;
          height: 6px;
          background: #10B488;
          border-radius: 50%;
        }
        .before-buy-item-subject {
          flex: 1;
          margin-left: 12px;
          text-align: left;
          .before-buy-subject-bold {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            color: #1F2933;
          }
          .before-buy-subject-gray {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            color: #959DAD;
            line-height: 32px;
          }
        }
      }
    }
    .before-buy-tip-btn {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .count-down-btn {
        width: 148px;
        height: 48px;
        left: 428px;
        top: 362px;
        background: #F0F3F7;
        border-radius: 6px;
        line-height: 48px;
        text-align: center;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        text-align: center;
        color: #AAB1BF;
        cursor: pointer;
      }
      .tip-timer-over {
        background: #10B488;
        color: #fff;
      }
    }
  }
  .seller-product-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 32px;
    /* position: absolute; */
    width: 690px;
    background: #FFFFFF;
    border: 1px solid #F0F3F7;
    box-sizing: border-box;
    border-radius: 12px;
    .seller-product-list-header {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: #959DAD;
      width: 624px;
      height: 48px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .sell-address {
        width: 166px;
        height: 18px;
        text-align: left;
      }
      .sell-amount {
        width: 138px;
        margin-left: 51x;
        height: 18px;
      }
      .sell-limit {
        width: 139px;
        margin-left: 24px;
        height: 18px;
      }
    }
    .wallet-disconnect {
      width: 100%;
      box-sizing: border-box;
      height: 416px;
      padding-bottom: 15px;
      padding-right: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-top: 1px solid #F0F3F7;
      .wallet-disconnect-png {
        width: 80px;
        height: 80px;
      }
      .wallet-disconnect-tip {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        text-align: center;
        color: #7B8293;
        text-align: center;
        margin: 24px 0px;
      }
      .wallet-disconnect-btn {
        width: 83px;
        height: 36px;
        background: #10B488;
        border-radius: 6px;
        text-align: center;
        line-height: 36px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        text-align: center;
        color: #FFFFFF;
      }
    }
    .seller-product-list-body {
      height: 416px;
      padding-bottom: 15px;
      padding-right: 5px;
      overflow-y: scroll;
      .no-buyer-txt {
        width: 690px;
        text-align: center;
        line-height: 416px;
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        text-align: center;
        color: #7B8293;
      }
      .seller-product-list-item {
        width: 626px;
        height: 88px;
        border-top: 1px solid #F0F3F7;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .buy-btn {
          margin-left: 28px;
          width: 80px;
          height: 36px;
          background: #10B488;
          border-radius: 6px;
          font-family: 'PingFang SC', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          text-align: center;
          color: #FFFFFF;
          line-height: 36px;
          cursor: pointer;
        }
        .item-limit {
          margin-left: 20px;
          width: 139px;
          height: 39px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;
          .limit-amount {
            font-family: 'SF UI Text', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            color: #1F2933;
            text-align: left;
          }
          .limit-coin {
            font-family: 'SF UI Text', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            color: #959DAD;
          }
        }
        .item-amount {
          width: 138px;
          height: 39px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;
          margin-left: 20px;
          .amount-number {
            font-family: 'SF UI Text', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            color: #1F2933;
          }
          .amount-coin {
            font-family: 'SF UI Text', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            color: #959DAD;
          }
        }
        .item-address {
          width: 193px;
          height: 39px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          .adress-deal {
            margin-left: 8px;
            height: 39px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: flex-start;
            .top-adress {
              font-family: 'SF UI Text', sans-serif;
              font-style: normal;
              font-weight: 500;
              font-size: 16px;
              display: flex;
              align-items: center;
              color: #1F2933;
            }
            .bottom-deal {
              font-family: 'SF UI Text', sans-serif;
              font-style: normal;
              font-weight: 500;
              font-size: 12px;
              display: flex;
              align-items: center;
              color: #959DAD;
            }
          }
          .tou-xiang {
            width: 32px;
            height: 32px;
            background: #6284F5;
            border-radius: 32px;
            overflow: hidden;
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 132%;
            color: #FFFFFF;
            text-align: center;
            line-height: 32px;
          }
        }
      }
    }
  }
  .market-uni-price {
    margin-top: 12px;
    margin-bottom: 24px;
    width: 690px;
    height: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .price-tip {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      color: #959DAD;
    }
    .price-rate {
      margin-left: 8px;
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      text-align: right;
      color: #1F2933;
    }
  }
  .change-rate {
    display: flex;
    flex-direction: row;
    width: 430px;
    justify-content: space-between;
    align-items: center;
    .cny-wrap {
      width: 200px;
    }
    .yue-dengyu {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #959DAD;
    }
    .select-wrap {
      box-sizing: border-box;
      padding-left: 15px;
      width: 200px;
      height: 40px;
      border: 1px solid #e6e7f0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-radius: 6px;
      .token-input {
        box-sizing: border-box;
        flex: 6;
        height: 90%;
      }
      .nest-select {
        box-sizing: border-box;
        flex: 3.2;
        height: 90%;
        padding-left: 23px;
        background-size: 16px 16px;
        background-repeat: no-repeat;
        background-position: 1px center;
      }
    }
    .right-icon-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .cny-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-set('../../../../assets/imgs/cny-icon.png', 0, 0, 16px, 16px)
      }
      .txt-cny {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #3F475A;
        margin: 0px 9px 0px 6px;
      }
    }
    .in-input-select {
      width: 50px;
    }
  }
}
</style>
<style lang="styl">
.seller-list-container {
  .change-rate {
    .el-input__inner {
      height: 40px;
    }
    .cny-wrap {
      .el-input__inner {
        padding-right: 0.68rem;
      }
    }
    .select-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: left;
      .token-input {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .el-input__inner {
          border: none;
          height: 100%;
          padding: 0;
        }
      }
      .nest-select {
        .select-trigger {
          height: 100%;
          width: 70px;
          .el-input--suffix {
            height: 100%;
            .el-input__inner {
              height: 100%;
              padding: 0;
              border: none;
              font-size: 14px;
            }
            .el-input__suffix {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            .el-input__suffix-inner {
            }
          }
        }
     }
   }
  }
}
</style>
<style lang="styl">
.el-select-dropdown__list {
  .el-select-dropdown__item.custom-select-option {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 110px;
    .select-option-img {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      overflow: hidden;
    }
    .select-option-txt {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 132%;
      color: #3F475A;
    }
  }
}
</style>
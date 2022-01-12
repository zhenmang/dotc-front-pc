<script setup>
import SelectTabs from '@/components/SelectTabs/SelectTabs.vue'
import useNavTabs from '@/composables/useNavTabs.js'
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import { queryOrderList, querySellOrderTrackList } from '@/urls/order.js'
import { updateOrderBank, cancelSellOrder } from '@/urls/sell-coin.js'
import { ElLoading } from 'element-plus'
import store from '@/store';
import SelectBankCard from '@/components/SelectBankCard/SelectBankCard.vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { navTabs } = useNavTabs()
// const releaseList = ref([{}])
// const operateList = ref([{}])
const releaseList = ref([])
const operateList = ref([])
const router = useRouter()
const showSelectCard = ref(false)
const clickOrderNo = ref('')

watch(
  () => store.getters.addressAndChainIdReady,
  (newV) => {
    if (newV) {
      initPageList()
    }
  }
)
function recieveSelectedBankCards(selectedBanks) {
  selectedBanks = selectedBanks
  console.log('=selectedBanks=', selectedBanks)
  updateOrderBank({ orderNo: clickOrderNo.value, bankIds: selectedBanks.map(item => item.bankId) })
  // 发送修改银行卡的请求
}
async function initPageList() {
  let loading = ElLoading.service({ fullscreen: true })
  const [orders, operates] = await Promise.all([queryOrderList({ pageIndex: 0, pageSize: 100, orderType: 2 }), querySellOrderTrackList({ pageIndex: 1, pageSize: 100 })])
  releaseList.value = orders.records
  operateList.value = operates.records
  loading.close()
  loading = null
}
function clickSellOrder() {
  router.push('/buy-sell/sell-coin/publish-sell/sell-info')
}
function clickCollectManage() {
  router.push('/buy-sell/sell-coin/collect-manage')
}
function clickModifyBankCard(orderNo) {
  // 选择银行卡
  showSelectCard.value = true
  clickOrderNo.value = orderNo
}
async function clickCancelSellOrder(orderNo) {
  let loading = ElLoading.service({ fullscreen: true })
  const res = await cancelSellOrder({ orderNo })
  loading.close()
  loading = null
}
</script>

<template>
  <div class="sell-coin-container">
    <div class="sell-coin-head">
      <select-tabs :tabs="navTabs" />
      <div class="top-right-operate">
        <span
          class="recieve-manage top-right-btn"
          @click="clickCollectManage"
        >{{ $t('message.CollectManage') }}</span>
        <span
          class="publish-sell top-right-btn"
          @click="clickSellOrder"
        >{{ $t('message.PulishSellOrder') }}</span>
      </div>
    </div>
    <div class="sell-coin-table">
      <div class="module-section my-release">
        <p class="title-section release-title">{{ $t('message.MyPublic') }}</p>
        <select-bank-card v-model="showSelectCard" @selectedBankCards="recieveSelectedBankCards"></select-bank-card>
        <div class="release-table">
          <div class="head-section release-table-head">
            <span class="table-head-field coin-type-column">{{ $t('message.CoinType') }}</span>
            <span class="table-head-field old-numbers-column">{{ $t('message.OrderNumber') }}</span>
            <span class="table-head-field balance-on-sale-column">{{ $t('mesage.Balance') }}</span>
            <span class="table-head-field valuation-column">{{ $t('message.Valuation') }}</span>
            <span class="table-head-field single-limit-column">{{ $t('message.SingleLimit') }}</span>
            <span class="table-head-field operation-column">{{ $t('message.Operate') }}</span>
          </div>
          <div v-if="releaseList.length" class="table-body-height release-table-body">
            <div
              class="item-row release-table-body-row"
              v-for="(release, index) in releaseList"
              :key="index"
            >
              <p class="coin-type-value">
                <img class="coin-icon" src="@/assets/imgs/usdt-icon.png" alt="coin-icon" />
                <span class="coin-name">{{ release.symbol }}/CNY</span>
              </p>
              <span class="old-numbers-value">{{ release.orderNo }}</span>
              <span class="balance-on-sale-value">{{ release.lastAmount }} USDT</span>
              <span class="valuation-value">{{ release.lastAmt }} CNY</span>
              <span class="single-limit-value">{{ release.minLimit }}-{{ release.maxLimit }} CNY</span>
              <p class="operation-value">
                <span
                  class="operator-item modify-bank cursor-pointer"
                  @click="clickModifyBankCard(release.orderNo)"
                >{{ $t('message.ModifyBankCard') }}</span>
                <span
                  class="operator-item cancel-sell-order cursor-pointer"
                  @click="clickCancelSellOrder(release.orderNo)"
                >{{ $t('message.CancelPendingOrder') }}</span>
              </p>
            </div>
            <div class="item-row release-table-body-row">
              <p class="coin-type-value">
                <img class="coin-icon" src="@/assets/imgs/usdt-icon.png" alt="coin-icon" />
                <span class="coin-name">USDT/CNY</span>
              </p>
              <span class="old-numbers-value">123847129</span>
              <span class="balance-on-sale-value">632,849.11 USDT</span>
              <span class="valuation-value">361,230.91 CNY</span>
              <span class="single-limit-value">10,000-100,000 CNY</span>
              <p class="operation-value">
                <span
                  class="operator-item modify-bank"
                  @click="clickModifyBankCard"
                >{{ $t('message.ModifyBankCard') }}</span>
                <span class="operator-item cancel-sell-order">{{ $t('message.CancelPendingOrder') }}</span>
              </p>
            </div>
          </div>
          <div v-else class="table-body-height empty-table-body">
            <img class="no-record-img" src="@/assets/imgs/no-record.png" alt="no-record" />
            <span
              class="no-record-txt"
              v-if="$store.getters.addressAndChainIdReady"
            >{{ $t('message.NoRecords') }}</span>
            <span
              class="no-record-txt cursor-pointer"
              v-else
              @click="$store.dispatch('connectWallet')"
            >{{ $t('message.ConnectWallet') }}</span>
          </div>
        </div>
      </div>
      <div class="module-section my-operation-record">
        <p class="title-section">{{ $t('message.MyOperationRecord') }}</p>
        <div class="record-table">
          <div class="head-section record-table-head">
            <span class="table-head-field operate-column">{{ $t('message.Operate') }}</span>
            <span class="table-head-field operate-time-column">{{ $t('message.OperateDate') }}</span>
            <span class="table-head-field order-column">{{ $t('message.OrderNumber') }}</span>
            <span class="table-head-field sell-coin-type-column">{{ $t('message.SellCoinType') }}</span>
          </div>
          <div v-if="operateList.length" class="table-body-height record-table-body">
            <div
              class="item-row record-table-row"
              v-for="(operate, index) in operateList"
              :key="index"
            >
              <span class="operate-value">{{ operate.title }}</span>
              <span class="operate-time-value">{{ operate.createTime }}</span>
              <span class="order-value">{{ operate.orderNo }}</span>
              <span class="sell-coin-type-value">{{ operate.symbol }}/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
            <div class="item-row record-table-row">
              <span class="operate-value">{{ $t('message.CreateSellOrder') }}</span>
              <span class="operate-time-value">2021-07-06 09:19:57</span>
              <span class="order-value">123847129</span>
              <span class="sell-coin-type-value">USDT/CNY</span>
            </div>
          </div>
          <div v-else class="table-body-height empty-table-body">
            <img class="no-record-img" src="@/assets/imgs/no-record.png" alt="no-record" />
            <span
              class="no-record-txt"
              v-if="$store.getters.addressAndChainIdReady"
            >{{ $t('message.NoRecords') }}</span>
            <span
              class="no-record-txt cursor-pointer"
              v-else
              @click="$store.dispatch('connectWallet')"
            >{{ $t('message.ConnectWallet') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="styl">
.sell-coin-container {
  .sell-coin-table {
    width: 1200px;
    padding-bottom: 50px;
    .module-section {
      width: 100%;
      .item-row {
        border-bottom: 0.01rem solid #f0f3f7;
      }
      .title-section {
        width: 100%;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 22px;
        color: #1F2933;
        margin: 48px 0px 40px 0px;
        text-align: left;
      }
      .table-head-field {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: #959DAD;
        line-height: 48px;
      }
      .head-section {
        width: 100%;
        height: 48px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #F0F3F7;
      }
      .empty-table-body {
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
            line-height: 132%;
            text-align: center;
            color: #7B8293;
          }
        }
    }
  }
}
.sell-coin-container {
  width: 1200px;
  .sell-coin-head {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;
    margin-bottom: 48px;
    .top-right-operate {
      /* width: 208px; */
      height: 36px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      line-height: 36px;
      .top-right-btn {
        min-width: 96px;
        height: 36px;
        border-radius: 6px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        cursor: pointer;
        margin-left: 20px;
        padding: 0 10px;
      }
      .recieve-manage {
        background: rgba(16, 180, 136, 0.1);
        color: #10B488;
      }
      .publish-sell {
        background: #10B488;
        color: #FFFFFF;
      }
    }
  }
  .sell-coin-table {
    .table-body-height {
      height: 264px;
      overflow-y: scroll;
    }
    .my-operation-record {
      .record-table {
        .record-table-head {
          .operate-column {
            width: 198px;
            text-align: left;
          }
          .operate-time-column {
            width: 310px;
            text-align: right;
            margin-left: 24px;
          }
          .order-column {
            margin-left: 24px;
            width: 311px;
            text-align: right;
          }
          .sell-coin-type-column {
            margin-left: 24px;
            width: 309px;
            text-align: right;
          }
        }
        .record-table-body {
          width: 100%;
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          text-align: right;
          color: #1F2933;
          .record-table-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 88px;
            .operate-value {
              width: 198px;
              text-align: left;
              font-family: PingFang SC;
              font-weight: 500;
            }
            .operate-time-value {
              width: 310px;
              text-align: right;
              margin-left: 24px;
            }
            .order-value {
              margin-left: 24px;
              width: 311px;
              text-align: right;
            }
            .sell-coin-type-value {
              margin-left: 24px;
              width: 309px;
              text-align: right;
            }
          }
        }
      }
    }
    .my-release {
      .release-table {
        .release-table-head {
          .coin-type-column {
            width: 159px;
            text-align: left;
          }
          .old-numbers-column {
            width: 123px;
            text-align: right;
          }
          .balance-on-sale-column {
            width: 184px;
            text-align: right;
          }
          .valuation-column {
            width: 184px;
            text-align: right;
          }
          .single-limit-column {
            width: 244px;
            text-align: right;
          }
          .operation-column {
            width: 306px;
            text-align: right;
          }
        }
        .release-body {
          width: 100%;
          height: 264px;
        }
        .release-table-body {
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          color: #1F2933;

          .release-table-body-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 88px;
            .coin-type-value {
              width: 159px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              text-align: left;
              .coin-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
              }
              .coin-name {
                margin-left: 8px;
              }
            }
            .old-numbers-value {
              width: 123px;
              text-align: right;
            }
            .balance-on-sale-value {
              width: 184px;
              text-align: right;
            }
            .valuation-value {
              width: 184px;
              text-align: right;
            }
            .single-limit-value {
              width: 244px;
              text-align: right;
            }
            .operation-value {
              width: 306px;
              text-align: right;
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              align-items: center;
              line-height: 18px;
              .operator-item {
                font-family: 'PingFang SC', sans-serif;;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                color: #10B488;
                line-height: 18px;
              }
              .modify-bank {}
              .cancel-sell-order {
                margin-left: 24px;
              }
            }
          }
        }
      }
    }
  }
}
</style>

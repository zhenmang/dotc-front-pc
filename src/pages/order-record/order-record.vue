<script setup>
import SelectTabs from '../../components/SelectTabs/SelectTabs.vue';
import useNavTabs from '@/composables/useNavTabs.js'
import { reactive, ref, watch, provide, computed } from 'vue'
import { useRouter } from 'vue-router'
import { queryOrderList } from '@/urls/order.js'
import { sellOrderStatus, buyOrderStatus, allOrderStatus } from '@/consts/userOrderStatus.js'
import { ElLoading } from 'element-plus'
import { useStore } from 'vuex'
import useToggleStep from '@/composables/useToggleStep.js'
import formatAddress from '@/tools/formatAddress'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { listStep, updateListStep } = useToggleStep()
provide('listStep', listStep)
provide('updateListStep', updateListStep)

const router = useRouter()
const store = useStore()
const { navTabs } = useNavTabs()
const defaulCondition = { pageIndex: 0, pageSize: 20, orderNo: '', symbol: '', amount: '', totalAmt: '', chainId: '', orderType: 0, orderStatus: '' }
const search = reactive(JSON.parse(JSON.stringify(defaulCondition)))
const netOptions = [
  // { value: 'Ropsten', label: 'Ropsten' },
  { value: '0x1', label: '以太坊' },
  { value: '0x4', label: 'Rinkeby' }
  // { value: 'Kovan', label: 'Kovan' },
]
const netMap = netOptions.reduce((origin, item, index) => {
  origin[item.value] = item.label
  return origin
}, {})
const directOptions = [
  { value: 1, label: 'message.Buy' },
  { value: 2, label: '出售' },
  { value: 0, label: '全部' }
]
const orderStatusMap = {
  1: buyOrderStatus,
  2: sellOrderStatus,
  3: allOrderStatus
}
const statusOptions = computed(() => orderStatusMap[search.orderType])
const tableData = reactive({})

watch(
  () => store.getters.addressAndChainIdReady,
  async (newV) => {
    if (newV) {
      await getQueryOrderList()
    }
  },
  { immediate: true }
)
watch(
  search,
  async () => {
    await getQueryOrderList()
  },
  { deep: true }
)
async function getQueryOrderList() {
  let loadingInstance = ElLoading.service({ fullscreen: true })
  const result = await queryOrderList(search)
  console.log('=发送了请求=')
  loadingInstance.close()
  loadingInstance = null
  if (typeof result === 'object') {
    Object.keys(result).forEach((key) => {
      tableData[key] = result[key]
    })
  }
}
async function clickReset() {
  Object.keys(defaulCondition).forEach((key) => {
    search[key] = defaulCondition[key]
  })
  await getQueryOrderList()
}
function clickAppeal(record) {
  router.push({ path: '/appeal/home', query: record })
}
function clickContinueBuy(record) {
  router.push({ path: '/buy-sell/buy-coin/order-payment/pay-upchain', query: { ...record } })
}
function orderStatusTxt(record) {
  const match = orderStatusMap[record.orderType].filter((item) => item.value === record.orderStatus)[0]
  return match && match.label
}
function clickOrderItem(orderNo, orderType) {
  console.log('=orderNo-orderType=', orderNo, orderType)
  let path
  switch (orderType) {
    case 1:
      path = '/buy-sell/order-record/buy-order-status'
      break
    case 2:
      path = '/buy-sell/order-record/sell-order-status'
      break
    default:
      break
  }
  router.push(path)
}
</script>

<template>
  <div class="buy-sell-coin">
    <select-tabs :tabs="navTabs" class="record-tabs"></select-tabs>
    <div class="search-criteria">
      <el-input v-model="search.orderNo" :placeholder="$t('message.OrderNumber')" />
      <el-input v-model="search.symbol" :placeholder="$t('message.CoinType')" />
      <el-input v-model="search.amount" :placeholder="$t('message.Amount')" />
      <el-input v-model="search.totalAmt" :placeholder="$t('message.TotalAmount')" />
      <el-select
        v-model="search.chainId"
        :placeholder="$t('message.Network')"
        class="select-custom"
      >
        <el-option
          v-for="item in netOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="search.orderType"
        :placeholder="$t('message.TransDir')"
        class="select-custom"
      >
        <el-option
          v-for="item in directOptions"
          :key="item.value"
          :label="$t(item.label)"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="search.orderStatus"
        :placeholder="$t('message.OrderStatus')"
        class="select-custom"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <el-tooltip class="item" effect="dark" :content="item.tip" placement="top">
            <span>{{ item.label }}</span>
          </el-tooltip>
        </el-option>
      </el-select>
      <span class="reset-btn" @click="clickReset">{{ $t('message.Reset') }}</span>
    </div>
    <div class="table-list">
      <div class="table-head flex-row">
        <span class="order-number">{{ $t('message.OrderNumber') }}</span>
        <span class="direction">{{ $t('message.TransDir') }}</span>
        <span class="network">{{ $t('message.Network') }}</span>
        <span class="order-time">下单时间</span>
        <span class="coin-amount">{{ $t('message.Amount') }}</span>
        <span class="cash-amount">{{ $t('message.TotalAmount') }}</span>
        <span class="unit-price">单价</span>
        <span class="opposite-address">{{ $t('message.OppositeAddress') }}</span>
        <span class="order-status">{{ $t('message.OrderStatus') }}</span>
        <span class="operation">{{ $t('message.Operate') }}</span>
      </div>
      <div class="table-body-item flex-row" v-for="(item, index) in tableData.records" :key="index">
        <div class="item-info-left" @click="clickOrderItem(item.orderNo, item.orderType)">
          <!-- <span class="order-number">10239419</span> -->
          <span class="order-number">{{ item.orderNo || formatAddress(item.orderNo) }}</span>
          <!-- <span class="direction" :class="{ 'red-mark': false }">{{ $t('message.Buy') }}</span> -->
          <span
            class="direction"
            :class="{ 'red-mark': item.orderType === 2 }"
          >{{ item.orderType === 1 ? $t('message.Buy') : '出售 ' }}</span>
          <!-- <span class="network">Ethereum</span> -->
          <span class="network">{{ netMap[item.chainId] || 'Rinkeby' }}</span>
          <p class="order-time">
            <!-- <span>2021-07-04</span> -->
            <span>{{ item.createTime.split(' ')[0] }}</span>
            <br />
            <!-- <span>22:30:59</span> -->
            <span>{{ item.createTime.split(' ')[1] }}</span>
          </p>
          <p class="coin-amount">
            <!-- <span>10000.00</span> -->
            <span>{{ item.amount }}</span>
            <br />
            <span>USDT</span>
          </p>
          <p class="cash-amount">
            <!-- <span>654700.00</span> -->
            <span>{{ item.totalAmt }}</span>
            <br />
            <span>CNY</span>
          </p>
          <p class="unit-price">
            <span>1 USDT</span>
            <br />
            <!-- <span>= 6.47 CNY</span> -->
            <span>= {{ item.price }} CNY</span>
          </p>
          <!-- <span class="opposite-address">0x1234...1234</span> -->
          <span
            class="opposite-address"
          >{{ formatAddress(item.orderType === 1 ? item.sellAddress : item.buyAddress) }}</span>
          <!-- <span class="order-status">待支付</span> -->
          <span class="order-status">{{ $t(orderStatusTxt(item)) }}</span>
        </div>
        <div class="operation">
          <template v-if="item.orderStatus === 3 && item.orderType === 1">
            <!-- <p class="continue-buy" @click="clickContinueBuy">继续购买</p> -->
            <p class="continue-buy" @click="clickContinueBuy(item)">继续购买</p>
            <p class="tips">
              <span class="cancel-order">撤单</span>
              <span class="encount-problem">遇到问题</span>
            </p>
          </template>
          <span
            v-if="item.orderStatus === 3 && item.orderType === 2"
            class="appeal"
            @click="clickAppeal(item)"
          >申诉</span>
        </div>
      </div>
      <div class="table-body-item flex-row">
        <div class="item-info-left" @click="clickOrderItem('1478766258185965568', 1)">
          <span class="order-number">10239419</span>
          <span class="direction" :class="{ 'red-mark': true }">出售</span>
          <span class="network">HECO</span>
          <p class="order-time">
            <span>2021-07-04</span>
            <br />
            <span>22:30:59</span>
          </p>
          <p class="coin-amount">
            <span>10000.00</span>
            <br />
            <span>USDT</span>
          </p>
          <p class="cash-amount">
            <span>654700.00</span>
            <br />
            <span>CNY</span>
          </p>
          <p class="unit-price">
            <span>1 USDT</span>
            <br />
            <span>= 6.47 CNY</span>
          </p>
          <span class="opposite-address">0x1234...1234</span>
          <span class="order-status">{{ $t('message.PendingPayTimeOut') }}</span>
        </div>
        <div class="operation">
          <template v-if="false">
            <p class="continue-buy" @click="clickContinueBuy">继续购买</p>
            <p class="tips">
              <span class="cancel-order">撤单</span>
              <span class="encount-problem">遇到问题</span>
            </p>
          </template>
          <span v-if="true" class="appeal" @click="clickAppeal({ orderNo: 123, accountType: 1 })">申诉</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="styl">
.buy-sell-coin {
  .record-tabs {
    margin-top: 32px;
  }
  .table-list {
    margin-top: 24px;
    text-align: left;
    .flex-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .item-info-left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
      }
      .order-number {
        width: 188px;
        font-size: 12px;
      }
      .direction {
        width: 28px;
      }
      .network {
        width: 60px;
        margin-left: 60px;
      }
      .order-time {
        margin-left: 38px;
        width: 82px;
      }
      .coin-amount {
        margin-left: 36px;
        width: 65px;
      }
      .cash-amount {
        margin-left: 37px;
        width: 75px;
      }
      .unit-price {
        margin-left: 10px;
        width: 100px;
      }
      .opposite-address {
        margin-left: 48px;
        width: 97px;
      }
      .order-status {
        margin-left: 42px;
        width: 80px;
      }
      .operation {
        margin-left: 66px;
        width: 88px;
        text-align: right;
      }
    }
    .table-head {
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #F0F3F7;
    }
    .table-body-item {
      height: 108px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 132%;
      color: #1F2933;
      border-bottom: 1px solid #F0F3F7;
      .order-number,
      .direction {
        font-family: 'SF UI Text';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 132%;
        color: #10B488;
      }
      .order-number {
        cursor: pointer;
      }
      .red-mark {
        color: #D85D5D;
      }
      .operation {
        width: 108px;
        height: 62px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        .appeal {
          background: rgba(81, 177, 166, 0.1);
          border-radius: 6px;
          width: 96px;
          height: 36px;
          font-family: 'PingFang SC', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 36px;
          text-align: center;
          color: #10B488;
          cursor: pointer;
        }
        .continue-buy {
          background: #10B488;
          border-radius: 6px;
          width: 96px;
          height: 36px;
          font-family: 'PingFang SC', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          text-align: center;
          color: #FFFFFF;
          line-height: 36px;
          cursor: pointer;
        }
        .tips {
          width: 108px;
          height: 18px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          font-family: SF UI Text;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: #959DAD;
          line-height: 1;
          margin-top: 8px;
          .cancel-order {
            cursor: pointer;
          }
          .encount-problem {
            cursor: pointer;
          }
        }
      }
    }
  }
  .search-criteria {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .reset-btn {
      width: 72px;
      height: 36px;
      background: rgba(81, 177, 166, 0.1);
      border-radius: 6px;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 36px;
      text-align: center;
      color: #10B488;
      cursor: pointer;
    }
  }
}
</style>

<style lang="styl">
.buy-sell-coin {
  .search-criteria {
    margin-top: 40px;
    div.el-input {
      width: 120px;
      height: 36px;
      margin-right: 12px;
      input.el-input__inner {
        height: 100%;
      }
    }
    .el-select.select-custom {
      div.el-input.el-input--suffix {
        span.el-input__suffix {
          span.el-input__suffix-inner {
            i.el-select__caret.el-input__icon.el-icon-arrow-up {
              height: 36px;
              line-height: 36px;
            }
          }
        }
      }
    }
  }
}
</style>
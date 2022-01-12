<script setup>
import { queryOrderDetail } from '@/urls/order.js'
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const route = useRoute()
const order = reactive({ detail: {} })
const store = useStore()
watch(
  () => store.state.addressAndChainIdReady,
  async (newV) => {
    if (newV) {
      const res = await queryOrderDetail({ orderNo: route.query.orderNo })
      Object.keys(res).forEach((key) => {
        order.detail[key] = res[key]
      })
    }
  },
  { immediate: true }
)
</script>
<template>
  <div class="transaction-complete">
    <div class="head">
      <p class="head-left">
        <img class="success-icon" src="@/assets/imgs/success-icon.png" alt="success-icon" />
        <span class="complete-txt">{{ $t('message.TransCompleted') }}</span>
      </p>
      <p class="head-right">
        <!-- <span class="head-num">154</span>
        <span class="head-unit">USDT</span>-->
        <span class="head-num">{{ order.detail.amount }}</span>
        <span class="head-unit">{{ $route.query.symbol }}</span>
      </p>
    </div>
    <div class="order">
      <p class="order-row">
        <span class="order-item-key">{{ $t('message.OrderNumber') }}</span>
        <span class="order-item-value">{{ $route.query.orderNo }}</span>
      </p>
      <p class="order-row">
        <span class="order-item-key">创建时间</span>
        <span class="order-item-value">{{ order.detail.createTime }}</span>
      </p>
      <p class="order-row">
        <span class="order-item-key">单价</span>
        <span
          class="order-item-value"
        >1 {{ $route.query.symbol }} = {{ order.detail.rate && order.detail.rate.split('/')[1] }} CNY</span>
      </p>
      <p class="order-row">
        <span class="order-item-key">数量</span>
        <span class="order-item-value">{{ order.detail.amount + ' ' + $route.query.symbol }}</span>
      </p>
      <p class="order-row">
        <span class="order-item-key">总额</span>
        <span class="order-item-value">{{ order.detail.cnyAmt }} CNY</span>
      </p>
      <p class="order-row">
        <span class="order-item-key">完成时间</span>
        <span class="order-item-value">{{ order.detail.finishTime }}</span>
      </p>
    </div>
    <div class="pledge">
      <p class="pledge-head">
        <span class="pledge-total">抵押资产总额</span>
        <span class="pledge-amount">{{ pledgeAmt }} USD</span>
      </p>
      <div class="pledge-row">
        <p class="pledge-item-left">
          <img class="pledge-item-icon" src="@/assets/imgs/usdt-icon.png" alt="pledge-item-icon" />
          <span class="pledge-item-num">204</span>
          <span class="pledge-item-coin">cETH</span>
        </p>
        <p class="pledge-item-right">
          <span class="pledge-item-value">200.00</span>
          <span class="pledge-item-unit">USD</span>
        </p>
      </div>
      <div class="pledge-row">
        <p class="pledge-item-left">
          <img class="pledge-item-icon" src="@/assets/imgs/dai-icon.png" alt="pledge-item-icon" />
          <span class="pledge-item-num">20</span>
          <span class="pledge-item-coin">cUSDC+cDAI+cUSDT</span>
        </p>
        <p class="pledge-item-right">
          <span class="pledge-item-value">200.00</span>
          <span class="pledge-item-unit">USD</span>
        </p>
      </div>
      <div class="pledge-row">
        <p class="pledge-item-left">
          <img class="pledge-item-icon" src="@/assets/imgs/uni-icon.png" alt="pledge-item-icon" />
          <span class="pledge-item-num">1</span>
          <span class="pledge-item-coin">UNI-V3-POS</span>
        </p>
        <p class="pledge-item-right">
          <span class="pledge-item-value">200.00</span>
          <span class="pledge-item-unit">USD</span>
        </p>
      </div>
    </div>
    <div class="change">
      <p class="change-head">DOTC账户资产变更详情</p>
      <p class="change-item">
        <span class="change-item-key">抵押资产</span>
        <span class="change-item-value">{{ order.detail.pledgeAmt }} USD</span>
      </p>
      <p class="change-item">
        <span class="change-item-key">出售资产</span>
        <span class="change-item-value">{{ order.detail.sellAmt }} USD</span>
      </p>
    </div>
  </div>
</template>

<style lang="styl" scoped>
.transaction-complete {
  width: 486px;
  /* height: 627px; */
  padding: 32px;
  background: #FFFFFF;
  border: 1px solid #F0F3F7;
  box-sizing: border-box;
  border-radius: 12px;
  .change {
    padding-top: 14px;
    .change-item {
      padding: 6px 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .change-item-key {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: #6E798F;
      }
      .change-item-value {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        text-align: right;
        color: #1F2933;
      }
    }
    .change-head {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: #959DAD;
      padding: 10px 0px;
      text-align: left;
    }
  }
  .pledge {
    padding: 16px 0px;
    border-bottom: 1px solid #F0F3F7;
    .pledge-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 20px;
      width: 100%;
      padding: 8px 0px;
      .pledge-item-right {
        text-align: right;
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        text-align: right;
        color: #1F2933;
      }
      .pledge-item-left {
        display: flex;
        direction: row;
        justify-content: flex-start;
        align-items: center;
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: #3F475A;
        .pledge-item-icon {
          width: 20px;
          height: 20px;
          border-radius: 50px;
        }
        .pledge-item-num {
          margin-left: 8px;
        }
        .pledge-item-coin {
          margin-left: 5px;
        }
      }
    }
    .pledge-head {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 18px;
      padding: 8px 0px;
      .pledge-total {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: #959DAD;
      }
      .pledge-amount {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: #1F2933;
      }
    }
  }
  .order {
    padding: 18px 0px;
    border-bottom: 1px solid #F0F3F7;
    .order-row {
      width: 100%;
      height: 18px;
      padding: 6px 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .order-item-key {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: #6E798F;
      }
      .order-item-value {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        text-align: right;
        color: #1F2933;
      }
    }
  }
  .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 32px;
    border-bottom: 1px solid #F0F3F7;
    .head-left {
      width: 104px;
      height: 24px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .success-icon {
        width: 24px;
        height: 24px;
        border-radius 50%;
      }
      .complete-txt {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        color: #1F2933;
      }
    }
    .head-right {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: bold;
      color: #1F2933;
      .head-num {
        font-size: 24px;
      }
      .head-unit {
        margin-left: 10px;
        font-size: 12px;
      }
    }
  }
}
</style>

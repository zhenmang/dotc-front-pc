<script setup>
import BigNumber from 'bignumber.js';
import store from '@/store';
import { useRoute } from 'vue-router'
import { queryOrderDetail } from '@/urls/order.js'
import { watch, reactive, inject } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const route = useRoute()
const updateListStep = inject('updateListStep')
updateListStep(2)
const totalCny = BigNumber(route.query.amount).multipliedBy(store.state.tokens[route.query.symbol].price).multipliedBy(store.state.cancelPenalty).multipliedBy(store.state.floatRate.usd2Cny).toFixed(2)
const order = reactive({ detail: {} })
watch(
  () => store.state.addressAndChainIdReady,
  async (newV) => {
    if (newV) {
      order.detail = await queryOrderDetail({ orderNo: route.query.orderNo })
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="has-cancel-container">
    <div class="content-head">
      <div class="cancel-title">已取消</div>
      <div class="total-cny">
        <span class="cny-num">{{ totalCny }}&nbsp;</span>
        <!-- <span class="cny-num">1000&nbsp;</span> -->
        <span class="cny-unit">CNY</span>
      </div>
    </div>
    <div class="content-body">
      <div class="detail-title">订单详情</div>
      <div class="detail-desc">
        <span class="detail-left">{{ $t('message.OrderNumber') }}</span>
        <!-- <span class="detail-right">120389230941238123</span> -->
        <span class="detail-right">{{ $route.query.orderNo }}</span>
      </div>
      <div class="detail-desc">
        <span class="detail-left">创建时间</span>
        <!-- <span class="detail-right">2021-07-03 00:41:49</span> -->
        {{ order.detail.createTime }}
      </div>
      <div class="detail-desc">
        <span class="detail-left">单价</span>
        <span
          class="detail-right"
        >1 USD = {{ BigNumber($store.state.floatRate.usd2Cny).toFixed(2) }} CNY</span>
      </div>
    </div>
  </div>
</template>

<style lang="styl" scoped>
.has-cancel-container {
  box-sizing: border-box;
  padding: 32px;
  width: 486px;
  background: #FFFFFF;
  /* Line/light */
  border: 1px solid #F0F3F7;
  box-sizing: border-box;
  border-radius: 12px;
  .content-body {
    .detail-title {
      font-family: 'SF UI Text';
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 132%;
      color: #959DAD;
      margin-top: 24px;
      text-align: left;
    }
    .detail-desc {
      margin-top: 24px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .detail-left {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #6E798F;
      }
      .detail-right {
        font-family: 'SF UI Text';
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        text-align: right;
        color: #1F2933;
      }
    }
  }
  .content-head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 40px;
    border-bottom: 1px solid #F0F3F7;
    .cancel-title {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 132%;
      color: #1F2933;
    }
    .total-cny {
      .cny-num {
        font-family: 'SF UI Text';
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 132%;
      }
      .cny-unit {
        font-family: 'SF UI Text';
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        text-align: right;
        color: #1F2933;
      }
    }
  }
}
</style>
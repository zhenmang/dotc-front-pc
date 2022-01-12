<script setup>
import { onMounted, inject, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { queryOrderDetail } from '@/urls/order.js'
import { ElLoading } from 'element-plus'
import store from '@/store'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const updateListStep = inject('updateListStep')
const route = useRoute()
const pageInfo = reactive({ cnyAmt: '--', orderNo: '--', createTime: '--', finishTime: '--', rate: '1/--', amount: '--', pledgeAmt: '--', sellAmt: '--', sellCoin: route.query.sellCoin })
onMounted(async () => {
  updateListStep(3)
})
watch(
  () => store.getters.addressAndChainIdReady,
  async (newV) => {
    if (!newV) return
    let loadingInstance = ElLoading.service({ fullscreen: true })
    const result = await queryOrderDetail({ orderNo: route.query.orderNo })
    loadingInstance.close()
    loadingInstance = null
    if (result) {
      Object.keys(result).forEach((key) => {
        pageInfo[key] = result[key]
      })
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="publish-success">
    <div class="head">
      <span class="head-left">卖单发布成功</span>
      <p class="head-right">
        <span class="head-num">{{ pageInfo.cnyAmt }}</span>
        <span class="head-unit">&nbsp;CNY</span>
      </p>
    </div>
    <div class="order-detail">
      <p class="order-head">订单详情</p>
      <p class="order-item">
        <span class="order-item-left">{{ $t('message.OrderNumber') }}</span>
        <span class="order-item-right">{{ pageInfo.orderNo }}</span>
      </p>
      <p class="order-item">
        <span class="order-item-left">创建时间</span>
        <span class="order-item-right">{{ pageInfo.createTime }}</span>
      </p>
      <p class="order-item">
        <span class="order-item-left">完成时间</span>
        <span class="order-item-right">{{ pageInfo.finishTime }}</span>
      </p>
      <p class="order-item">
        <span class="order-item-left">汇率</span>
        <span class="order-item-right">1 USD = {{ pageInfo.rate }} CNY</span>
      </p>
      <p class="order-item">
        <span class="order-item-left">数量</span>
        <span class="order-item-right">{{ pageInfo.amount }} {{ pageInfo.sellCoin }}</span>
      </p>
    </div>
    <div class="order-detail">
      <p class="order-head">DOTC账户资产变更详情</p>
      <p class="order-item">
        <span class="order-item-left">抵押资产</span>
        <span class="order-item-right">{{ pageInfo.pledgeAmt }} USD</span>
      </p>
      <p class="order-item">
        <span class="order-item-left">出售资产</span>
        <span class="order-item-right">{{ pageInfo.sellAmt }} USD</span>
      </p>
    </div>
  </div>
</template>

<style lang="styl" scoped>
.publish-success {
  width: 486px;
  height: 464px;
  background: #FFFFFF;
  border: 1px solid #F0F3F7;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 36px 32px;
  .order-detail {
    padding: 14px 0px 18px 0px;
    border-top: 1px solid #F0F3F7;
    .order-item {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0px;
      .order-item-left {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #6E798F;
      }
      .order-item-right {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 132%;
        text-align: right;
        color: #1F2933;
      }
    }
    .order-head {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 132%;
      color: #959DAD;
      padding: 10px 0px;
      text-align: left;
    }
  }
  .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 32px;
    .head-left {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 132%;
      color: #1F2933;
    }
    .head-right {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
      .head-num {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 132%;
        text-align: right;
        color: #1F2933;
      }
      .head-unit {
        font-weight: 500;
        font-size: 14px;
        line-height: 132%;
        text-align: right;
        color: #1F2933;
        padding-bottom: 3px;
      }
    }
  }
}
</style>

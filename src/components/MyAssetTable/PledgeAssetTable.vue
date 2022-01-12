<script setup>
const emit = defineEmits(['lookDetail'])
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
function clickLookDetail() {
  emit('lookDetail')
}
</script>

<template>
  <div class="pledge-asset-table">
    <p class="table-head">
      <span class="order-no">归属订单号</span>
      <span class="lock-amount">{{ $t('message.LockUpLimit') }}</span>
      <span class="start-time">开始抵押时间</span>
      <span class="from-source">来源</span>
      <span class="end-time">到期日</span>
      <span class="cash-status">{{ $t('message.FundStatus') }}</span>
    </p>
    <div class="table-body">
      <div class="body-row">
        <span class="order-no">E23401234</span>
        <span class="lock-amount">8,000.00 USDT</span>
        <span class="start-time">2021-06-26 09:37:43</span>
        <span class="from-source">买币抵押</span>
        <p class="end-time nostart-waitpay" v-if="false">
          <span>未开始计期</span>
          <span class="wait-pay">{{ $t('message.PendingPay') }}</span>
        </p>
        <p class="end-time count-period" v-if="false">
          <span>计期中</span>
          <span class="remain-days">剩余28天 已暂停</span>
        </p>
        <p class="end-time look-detail" v-if="true">
          <span class="look-detail-txt" @click="clickLookDetail">查看详情</span>
        </p>
        <p class="end-time nostart-amount" v-if="false">
          <span class="nostart-amount-txt">未开始计期 13894 USDT</span>
        </p>
        <span class="cash-status" v-if="false">{{ $t('message.NormalFund') }}</span>
        <span class="cash-status" v-if="true">{{ $t('message.Freezing') }}</span>
        <span class="cash-status" v-if="false">--</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="styl">
.pledge-asset-table {
  width: 100%;
  .order-no {
    width: 90px;
    text-align: left;
  }
  .lock-amount {
    margin-left: 73px;
    width: 221px;
    text-align: right;
  }
  .start-time {
    margin-left: 24px;
    width: 221px;
    text-align: right;
  }
  .from-source {
    margin-left: 24px;
    width: 139px;
    text-align: right;
  }
  .end-time {
    margin-left: 24px;
    width: 221px;   
    text-align: right; 
  }
  .cash-status {
    margin-left: 24px;
    width: 139px;
    text-align: right;
  }
  .table-body {
    width: 100%;
    .body-row {
      width: 100%;
      height: 100px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #F0F3F7;
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 132%;
      color: #1F2933;
      span {
        font-size: 16px;
      }
      .look-detail {
        .look-detail-txt {
          font-family: 'PingFang SC', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 132%;
          text-align: right;
          color: #10B488;
          cursor: pointer;
        }
      }
      .count-period {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        .remain-days {
          margin-top: 4px;
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 132%;
          text-align: right;
          color: #959DAD;
        }
      }
      .nostart-amount {
        .nostart-amount-txt {}
      }
      .nostart-waitpay {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        .wait-pay {
          margin-top: 4px;
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 132%;
          text-align: right;
          color: #F3882B;
        }
      }
    }
  }
  .table-head {
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-family: 'SF UI Text', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 48px;
    color: #959DAD;
    border-top: 1px solid #F0F3F7;
    border-bottom: 1px solid #F0F3F7;
    span {
      font-size: 14px;
    }
    .order-no {}
    .lock-amount {}
    .start-time {}
    .from-source {}
    .end-time {}
    .cash-status {}
  }
}
</style>

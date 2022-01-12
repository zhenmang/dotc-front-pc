<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <div class="in-transaction-table">
        <p class="table-head">
            <span class="order-no">归属订单号</span>
            <span class="trans-amount">交易数额</span>
            <span class="start-time">订单开始时间</span>
            <span class="role">身份</span>
            <span class="trans-status">交易状态</span>
        </p>
        <div class="table-body">
            <div class="body-row">
                <span class="order-no">E23401234</span>
                <span class="trans-amount">8,000.00 USDT</span>
                <span class="start-time">2021-06-26 09:37:43</span>
                <span class="role">买方</span>
                <span class="trans-status">待线下付款</span>
            </div>
            <div class="body-row">
                <span class="order-no">E23401234</span>
                <span class="trans-amount">8,000.00 USDT</span>
                <span class="start-time">2021-06-26 09:37:43</span>
                <span class="role">卖方</span>
                <span class="trans-status">待买方吃单</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="styl">
.in-transaction-table {
    width: 100%;
    .order-no {
        width: 188px;
        text-align: left;
    }
    .trans-amount {
        margin-left: 0px;
        width: 259px;
        text-align: right;
    }
    .start-time {
        margin-left: 24px;
        width: 258px;
        text-align: right;
    }
    .role {
        margin-left: 24px;
        width: 165px;
        text-align: right;
    }
    .trans-status {
        margin-left: 61px;
        width: 221px;
        text-align: right;
    }
    .table-head {
        width: 100%;
        height: 48px;
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 48px;
        color: #959DAD;
        border-top: 1px solid #F0F3F7;
        border-bottom: 1px solid #F0F3F7;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        span {
            font-size: 14px;
        }
    }
    .table-body {
        width: 100%;
        .body-row {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            height: 100px;
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 132%;
            color: #1F2933;
            border-bottom: 1px solid #F0F3F7;
            .trans-status {
                color: #F3882B;
            }
            span {
                font-size: 16px;
            }
        }
    }
}
</style>

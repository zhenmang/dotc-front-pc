<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <div class="punish-record-table">
        <div class="table-head">
            <span class="order-no">归属订单号</span>
            <span class="role">身份</span>
            <span class="buy-time">买家吃单时间</span>
            <span class="punish-amount">{{ $t('message.PenaltyAmount') }}</span>
            <span class="reason">原因</span>
        </div>
        <div class="table-body">
            <div class="body-row">
                <span class="order-no">E23401234</span>
                <span class="role">买家</span>
                <span class="buy-time">2021-06-26 09:37:43</span>
                <span class="punish-amount">+8,000.00 USDT</span>
                <p class="reason">
                    <span>{{ $t('message.CancellationPenalty') }}</span>
                    <span v-if="true" class="punish-detail">千1惩罚 10 USDT + Fast Gas Fee 10USDT</span>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="styl">
.punish-record-table {
    width: 100%;
    .order-no {
        text-align: left;
        width: 175px;
    }
    .role {
        width: 151px;
    }
    .buy-time {
        margin-left: 24px;
        width: 238px;
    }
    .punish-amount {
        margin-left: 24px;
        width: 238px;
    }
    .reason {
        margin-left: 24px;
        width: 326px;
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
        line-height: 132%;
        color: #959DAD;
        border-top: 1px solid #F0F3F7;
        border-bottom: 1px solid #F0F3F7;
        span {
            font-size: 14px;
        }
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
            .reason {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                .punish-detail {
                    font-family: 'SF UI Text', sans-serif;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 14px;
                    line-height: 132%;
                    color: #959DAD;
                    margin-top: 4px;
                }
            }
        }
    }
}
</style>
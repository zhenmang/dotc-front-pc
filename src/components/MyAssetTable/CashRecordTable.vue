<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <div class="cash-record-table">
        <div class="table-head">
            <span class="role">身份</span>
            <span class="direction">流向</span>
            <span class="explain">说明</span>
            <span class="amount">{{ $t('message.Amount') }}</span>
            <span class="update-time">更新时间</span>
        </div>
        <div class="table-body">
            <div class="body-row">
                <span class="role">买方</span>
                <span class="direction">流入</span>
                <span class="explain">买币交易成功</span>
                <span class="amount">+8,000.00 USDT</span>
                <span class="update-time">2021-06-26 09:37:43</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="styl">
.cash-record-table {
    width: 100%;
    .role {
        width: 164px;
        text-align: left;
    }
    .direction {
        width: 165px;
        margin-left: 24px;
        text-align: right;
    }
    .explain {
        width: 258px;
        margin-left: 24px;
        text-align: right;
    }
    .amount {
        width: 259px;
        margin-left: 24px;
        text-align: right;
    }
    .update-time {
        width: 258px;
        margin-left: 24px;
        text-align: right;
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
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 132%;
            text-align: right;
            color: #1F2933;
            .direction {
                color: #2EAD65;
            }
            span {
                font-size: 16px;
            }
        }
    }
}
</style>

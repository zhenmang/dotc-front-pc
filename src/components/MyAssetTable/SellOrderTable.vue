<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <div class="sell-order-table">
        <div class="table-head">
            <span class="order-no">归属订单号</span>
            <span class="buy-count">购买数量</span>
            <span class="buy-address">买方地址</span>
            <span class="pledge-asset">质押资产</span>
            <span class="end-date">到期日</span>
            <span class="capital-status">{{ $t('message.FundStatus') }}</span>
        </div>
        <div class="table-body">
            <div class="body-row">
                <span class="order-no">E23401234</span>
                <p class="buy-count">
                    <span>8,000.00</span>
                    <span>USDT</span>
                </p>
                <span class="buy-address">0X12341234</span>
                <p class="pledge-asset">
                    <span>8,000.00</span>
                    <span>USDT</span>
                </p>
                <p class="end-date">
                    <span>计期中</span>
                    <span class="end-date-days">剩余22天</span>
                </p>
                <span class="capital-status">{{ $t('message.NormalFund') }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="styl">
.sell-order-table {
    width: 552px;
    .order-no {
        width: 93px;
        text-align: left;
    }
    .buy-count {
        width: 87px;
        text-align: right;
    }
    .buy-address {
        width: 85px;
        margin-left: 7px;
        text-align: right;
    }
    .pledge-asset {
        width: 85px;
        margin-left: 8px;
        text-align: right;
    }
    .end-date {
        margin-left: 8px;
        width: 86px;
        text-align: right;
    }
    .capital-status {
        margin-left: 8px;
        width: 85px;
        text-align: right;
    }
    .table-head {
        width: 100%;
        height: 48px;
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        text-align: right;
        color: #959DAD;
        line-height: 48px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-top: 21px;
        border-bottom: 1px solid #F0F3F7;
        span {
            font-size: 14px;
        }
    }
    .table-body {
        width: 100%;
        max-height: 379px;
        overflow-y: scroll;
        .body-row {
            width: 100%;
            height: 80px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 132%;
            color: #1F2933;
            border-bottom: 1px solid #F0F3F7;
            span {
                font-size: 14px;
            }
            .buy-count {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
            }
            .buy-address {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .end-date {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                .end-date-days {
                    font-family: 'SF UI Text', sans-serif;
                    font-style: normal;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 132%;
                    color: #959DAD;
                }
            }
        }
    }
}
</style>

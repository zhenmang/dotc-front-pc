<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const emit = defineEmits(['clickSaveDotcAccount'])
function clickSaveDotcAccount() {
    emit('clickSaveDotcAccount')
}
</script>

<template>
    <div class="wallet-account-table">
        <div class="table-head">
            <span class="asset">资产</span>
            <span class="amount">{{ $t('message.Amount') }}</span>
            <span class="dollar-value">美元价值</span>
            <span class="operate">{{ $t('message.Operate') }}</span>
        </div>
        <div class="table-body">
            <div class="body-row">
                <p class="asset">
                    <img class="usdt-icon" src="@/assets/imgs/usdt-icon.png" alt="usdt-icon" />
                    <span>USDT</span>
                </p>
                <span class="amount">10</span>
                <span class="dollar-value">$632,849.11</span>
                <p class="operate" @click="clickSaveDotcAccount" v-if="true">
                    <span class="operate-txt">存入DOTC账户</span>
                    <img class="right-arrow" src="@/assets/imgs/right-arrow.png" alt="right-arrow" />
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="styl">
.wallet-account-table {
    width: 100%;
    .asset {
        width: 120px;
        text-align: left;
    }
    .amount {
        margin-left: 24px;
        width: 120px;
        text-align: left;
    }
    .dollar-value {
        margin-left: 24px;
        width: 120px;
        text-align: left;
    }
    .operate {
        margin-left: 24px;
        width: 120px;
        text-align: right;
    }
    .table-head {
        padding-top: 21px;
        width: 100%;
        height: 48px;
        border-bottom: 1px solid #F0F3F7;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        span {
            font-family: 'Montserrat', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 16px;
            color: #959DAD;
        }
    }
    .table-body {
        width: 100%;
        max-height: 347px;
        overflow-y: scroll;
        .body-row {
            width: 100%;
            height: 80px;
            border-bottom: 1px solid #F0F3F7;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            span {
                font-family: 'SF UI Text', sans-serif;
                font-style: normal;
                font-weight: normal;
                font-size: 16px;
                line-height: 132%;
                color: #1F2933;
            }
            .asset {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                .usdt-icon {
                    width: 32px;
                    height: 32px;
                    margin-right: 8px;
                }
            }
            .amount {}
            .dollar-value {}
            .operate {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
                cursor: pointer;
                .operate-txt {
                    font-family: 'PingFang SC', sans-serif;
                    font-style: normal;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 132%;
                    color: #10B488;
                }
                .right-arrow {
                    width: 16px;
                    height: 16px;
                    margin-left: 4px;
                }
            }
        }
    }
}
</style>

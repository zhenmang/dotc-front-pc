<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const router = useRouter()
function clickAppeal() {
    router.push('/appeal/home')
}
</script>
<template>
    <div class="buy-coin-right">
        <div class="publish-success">
            <div class="head">
                <span class="head-left" v-if="false">撤单上链中</span>
                <div class="trans-success" v-if="true">
                    <p class="big-title">
                        <img
                            class="success-icon"
                            src="@/assets/imgs/success-icon.png"
                            alt="success-icon"
                        />
                        <span class="complete-title">{{ $t('message.TransCompleted') }}</span>
                    </p>
                    <div class="status-detail">
                        <span class="status-txt" v-if="false">锁仓资产罚没中</span>
                        <p class="operate">
                            <span class="operate-txt" @click="clickAppeal">申诉</span>
                            <img
                                class="right-arrow"
                                src="@/assets/imgs/right-arrow.png"
                                alt="right-arrow"
                            />
                        </p>
                    </div>
                </div>
                <p class="head-right">
                    <span class="head-num">1000</span>
                    <span class="head-unit">&nbsp;CNY</span>
                </p>
            </div>
            <div class="order-detail">
                <p class="order-head">订单详情</p>
                <p class="order-item">
                    <span class="order-item-left">{{ $t('message.OrderNumber') }}</span>
                    <span class="order-item-right">3464547854</span>
                </p>
                <p class="order-item">
                    <span class="order-item-left">创建时间</span>
                    <span class="order-item-right">2021-07-03 00:41:49</span>
                </p>
                <p class="order-item">
                    <span class="order-item-left">完成时间</span>
                    <span class="order-item-right">2021-07-03 00:41:49</span>
                </p>
                <p class="order-item">
                    <span class="order-item-left">汇率</span>
                    <span class="order-item-right">1 USDT = 6.47 CNY</span>
                </p>
                <p class="order-item">
                    <span class="order-item-left">数量</span>
                    <span class="order-item-right">155.2 USDT</span>
                </p>
            </div>
            <div class="order-detail" v-if="true">
                <p class="order-head">DOTC账户资产变更详情</p>
                <p class="order-item">
                    <span class="order-item-left">抵押资产</span>
                    <span class="order-item-right">155.2 USD</span>
                </p>
                <p class="order-item">
                    <span class="order-item-left">出售资产</span>
                    <span class="order-item-right">155.2 USD</span>
                </p>
            </div>
        </div>
    </div>
</template>
<style scoped lang="styl">
.buy-coin-right {
    min-width: 692px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    margin-top: 108px;
    padding-bottom: 65px;
    .publish-success {
        width: 486px;
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
            .trans-success {
                .big-title {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    .success-icon {
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                    }
                    .complete-title {
                        font-family: 'PingFang SC', sans-serif;
                        font-style: normal;
                        font-weight: 600;
                        font-size: 18px;
                        line-height: 132%;
                        color: #1F2933;
                    }
                }
                .status-detail {
                    margin-left: 32px;
                    margin-top: 8px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    .status-txt {
                        font-family: 'PingFang SC', sans-serif;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 14px;
                        line-height: 132%;
                        color: #959DAD;
                        margin-right: 8px;
                    }
                    .operate {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
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
}
</style>

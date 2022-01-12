<script setup>
import { reactive, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ethers } from 'ethers'
import queryMinAdQuantityMantissa from '@/contract/queryMinAdQuantityMantissa.js'
import { getContracts } from '@/contract/contracts.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const updateListStep = inject('updateListStep')
const store = useStore()
const router = useRouter()
const form = reactive({ symbol: 'USDT', priceLimit: '0', singleMin: '0', singleMax: '0' })
const symbolsOptions = Object.keys(store.state.tokens)
const emit = defineEmits(['recieveData', 'cacheSellLimitInfo'])
function nextStep() {
    const { parseUnits } = ethers.utils
    updateListStep(2)
    router.push(`/buy-sell/sell-coin/publish-sell/pledge-uplink?sellInfo=${JSON.stringify(form)}`)
}
onMounted(() => {
    updateListStep(1)
})
</script>

<template>
    <div class="sell-info-container">
        <p class="sell-title">{{ $t('message.SellInfo') }}</p>
        <div class="coin-type">
            <p class="coin-type-top">{{ $t('message.SellCoinType') }}</p>
            <el-select
                v-model="form.symbol"
                :placeholder="$t('message.InputSellCoinType')"
                class="coin-type-select"
            >
                <el-option
                    v-for="(item, index) in symbolsOptions"
                    :key="index"
                    :label="item"
                    :value="item"
                ></el-option>
            </el-select>
        </div>
        <div class="price-limit">
            <p class="price-limit-top">
                <span class="price-limit-top-txt">{{ $t('message.MinimumSellingUnitPrice') }}</span>
                <el-tooltip placement="top-start" effect="light">
                    <template #content>
                        <p class="price-limit-question-pop-tip">{{ $t('message.FairSalePrice') }}</p>
                    </template>
                    <img
                        class="question-icon"
                        src="@/assets/imgs/question-icon.png"
                        alt="question-icon"
                    />
                </el-tooltip>
            </p>
            <el-input
                v-model="form.priceLimit"
                :placeholder="$t('message.MinimumSellingUnitPrice')"
                class="price-limit-input"
            >
                <template #suffix>
                    <span class="coin-txt-suffix">CNY</span>
                </template>
            </el-input>
        </div>
        <div class="single-limit">
            <p class="single-limit-head">{{ $t('message.SingleLimit') }}</p>
            <div class="single-limit-inputs">
                <el-input v-model="form.singleMin" placeholder="输入金额" class="price-limit-input">
                    <template #suffix>
                        <span class="coin-txt-suffix">CNY</span>
                    </template>
                </el-input>
                <p class="single-limit-divide"></p>
                <el-input v-model="form.singleMax" placeholder="输入金额" class="price-limit-input">
                    <template #suffix>
                        <span class="coin-txt-suffix">CNY</span>
                    </template>
                </el-input>
            </div>
        </div>
        <div class="tip">{{ $t('message.SellPriceAs') }}</div>
        <div class="btn" @click="nextStep">{{ $t('message.NextStep') }}</div>
    </div>
</template>

<style scoped lang="styl">
.sell-info-container {
    width: 486px;
    height: 552px;
    background: #FFFFFF;
    border: 1px solid #F0F3F7;
    box-sizing: border-box;
    border-radius: 12px;
    padding: 32px;
    text-align: left;
    .sell-title {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 132%;
        color: #1F2933;
        margin-bottom: 32px;
        text-align: left;
    }
    .coin-type {
        .coin-type-top {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 132%;
            color: #1F2933;
            margin-bottom: 8px;
        }
        .coin-type-select {
            width: 422px;
        }
    }
    .btn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 14px 24px;
        position: static;
        width: 422px;
        height: 48px;
        background: #10B488;
        border-radius: 6px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 48px;
        text-align: center;
        color: #FFFFFF;
        box-sizing: border-box;
        cursor: pointer;
    }
    .tip {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: #F3882B;
        padding: 12px 16px;
        position: static;
        width: 422px;
        height: 42px;
        background: rgba(243, 136, 43, 0.08);
        border-radius: 6px;
        box-sizing: border-box;
        line-height: 18px;
        margin: 24px 0px 40px 0px;
    }
    .single-limit {
        .single-limit-head {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 132%;
            color: #1F2933;
            margin: 24px 0px 8px 0px;
        }
        .single-limit-inputs {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .single-limit-divide {
                width: 9px;
                height: 1px;
                background: #959DAD;
                margin: 0px 11px;
            }
        }
    }
    .price-limit {
        .price-limit-top {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            color: #1F2933;
            margin: 24px 0px 8px 0px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .price-limit-top-txt {
                line-height: 1;
                font-weight: 500;
                font-size: 14px;
            }
            .question-icon {
                width: 16px;
                height: 16px;
                margin-left: 8px;
            }
        }
    }
}
.coin-txt-suffix {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #6E798F;
    line-height: 46px;
    padding-right: 10px;
}
</style>

<style lang="styl">
.price-limit-question-pop-tip {
    width: 280px;
    background: #FFFFFF;
    /* box-shadow: 0px 4px 8px rgba(142, 141, 208, 0.16); */
    border-radius: 6px;
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 132%;
    color: #1F2933;
}
.price-limit {
    .price-limit-input {
        .el-input__inner {
            padding-right: 50px;
        }
    }
}
.single-limit {
    .single-limit-inputs {
        .el-input__inner {
            padding-right: 50px;
        }
    }
}
</style>

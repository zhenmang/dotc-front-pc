<script setup>
import { ref, inject, reactive, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import NotificationVue from '../../../../components/Notification/Notification.vue';
import AddAssets from '@/components/AddAssets/AddAssets.vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import BigNumber from 'bignumber.js';
import queryTokenUsdPrice from '@/contract/queryTokenUsdPrice.js'
import { queryFloatRate } from '@/urls/common-api.js'
import { ElLoading, ElMessageBox } from 'element-plus'
import checkConnect from '@/contract/checkConnect.js'
import { getContracts } from '@/contract/contracts.js'
import { ethers } from 'ethers'
import { saveBuyerOrder, saveBuyerOrderHash } from '@/urls/buy-coin.js'
import { gasOpt } from '@/consts/gasOpt.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const updateListStep = inject('updateListStep')
const accountType = ref('dotc')
const store = useStore()
const route = useRoute()
const router = useRouter()
const notiType = ref('')
const pledgeTokens = reactive(Object.keys(store.state.tokens))
const needPledgeUsd = ref(BigNumber(route.query.finalPurchaseCoinAmt).multipliedBy(store.state.tokens[route.query.symbol].price).multipliedBy(store.state.pledgeRate).toString())
const countdownNumber = ref(10)
const timer = ref(null)
const showAddAssets = ref(false)
const addAssetsPop = reactive({ addAssetsTitle: '', addAssetsType: '', accountType: '', tokens: [], prepareSell: { token: '', amount: 0 } })
const willPledgeTotalUsd = computed(() => BigNumber(pageInfo.pledge.dotc).toFixed(2))

onMounted(() => {
    const getSetInterval = () => {
        return setInterval(async () => {
            countdownNumber.value--
            if (countdownNumber.value === -1) {
                // 发送请求，更新币种价格，将计时器归到10
                countdownNumber.value = 10
                clearInterval(timer.value)
                await queryTokenUsdPrice()
                timer.value = getSetInterval()
            }
        }, 1000)
    }
    timer.value = getSetInterval()
    updateListStep(2)
})
onBeforeUnmount(() => {
    if (timer.value) {
        clearInterval(timer.value)
    }
})
async function sendBuyOrder() {
    const PledgeInfo = preparePledgeInfo()
    console.log('=PledgeInfo=', PledgeInfo)
    let loading = ElLoading.service({ fullscreen: true })
    const res = await sendBackBuy(PledgeInfo.backPledgeInfo)
    if (res && res.orderNo) {
        await sendContractBuy(PledgeInfo.conractPledgeInfo, res.orderNo)
    }
    loading.close()
    loading = null
}
async function sendBackBuy(backPledgeInfo) {
    const { buyPrice, sellOrderNo, pledgeAmt, buyAmount, cnyAmt, pledges } = backPledgeInfo
    const res = await saveBuyerOrder({ buyPrice, sellOrderNo, pledgeAmt, buyAmount, cnyAmt, pledges })
    return res
}
async function sendContractBuy(conractPledgeInfo, orderNo) {
    const { token_addr, buy_price, buy_amount, seller_addr, sell_ad_id, collateral_tokens, collateral_dotc_values } = conractPledgeInfo
    notiType.value = 'waiting'
    const buyOrderTx = await getContracts().dotcIns.write.new_buy_order(token_addr, buy_price, buy_amount, seller_addr, sell_ad_id, collateral_tokens, collateral_dotc_values, gasOpt)
    console.log('=buyOrderTx=', buyOrderTx)
    if (buyOrderTx.hash) {
        const [backHashRes, buyOrderReciept] = await Promise.all([saveBuyerOrderHash({ orderNo, txHash: buyOrderTx.hash }), buyOrderTx.wait()])
        console.log('=backHashRes=', backHashRes)
        console.log('=buyOrderReciept=', buyOrderReciept)
        if (buyOrderReciept.status) {
            notiType.value = 'success'
            setTimeout(() => {
                notiType.value = ''
            }, 2000)
            return true
        }
    }
}
function checkEnough() {
    const enough = Number(willPledgeTotalUsd.value) >= Number(needPledgeUsd.value)
    if (!enough) {
        ElMessageBox({
            message: `质押资产不能低于${needPledgeUsd.value}USD`,
            type: 'warning',
            showCancelButton: false,
            showConfirmButton: false
        })
        const timeout = setTimeout(() => {
            ElMessageBox.close()
        }, 2000)
    }
    return enough
}
async function clickPlaceOrder() {
    if (!checkEnough()) return
    // 发送买单
    await sendBuyOrder()
    updateListStep(3)
    router.push({ path: '/buy-sell/buy-coin/order-payment/pay-upchain', query: { ...route.query, state: 'toBePaid' } })
}
function clickPreStep() {
    updateListStep(1)
    router.go(-1)
}
// watch(
//     () => store.getters.addressAndContractReady,
//     async (newV) => {
//         if (newV) {
//             // selectedIndex.value = -1
//             let loadingInstance = ElLoading.service({ fullscreen: true })
//             Promise.all([queryTokenUsdPrice()])
//                 .then(() => {
//                     needPledgeUsd.value = BigNumber(route.query.amount).multipliedBy(store.state.tokens[route.query.symbol].price).toFixed(2)
//                 })
//                 .finally(() => {
//                     loadingInstance.close()
//                     loadingInstance = null
//                 })
//         }
//     },
//     { immediate: true }
// )
function clickAddPledgeFromDotc() {
    if (!checkConnect()) return
    showAddAssets.value = true
    addAssetsPop.addAssetsTitle = 'message.AddFormREEXAccount'
    addAssetsPop.addAssetsType = 'pledge'
    addAssetsPop.accountType = 'dotc'
    addAssetsPop.tokens = Object.keys(store.state.tokens)
}
const pageInfo = reactive({
    symbol: route.query.symbol,
    pledge: {
        dotc: '0',
        collateralDotcValues: []
    }
})
function clickConfirmAdd({ addAssetsType, sumAmount }) {
    // addAssetsType 添加类型，值为sell、pledge
    // addAmount 添加的币种及数量{ dotc: 2, wallet:5 }
    // 整个数据结构 { sell: { dotc: 2, wallet: 10 }, pledge: { dotc: 1, wallet: 2 } }
    const accountSell = { ...pageInfo[addAssetsType], ...sumAmount }
    pageInfo[addAssetsType] = accountSell
    if (addAssetsType === 'sell') {
        addAssetsPop.prepareSell.amount = accountSell.dotc
    }
}
function recievePledgeValues(pledgeInfo) {
    const { addAssetsType } = pledgeInfo
    Object.keys(pledgeInfo).forEach((key) => {
        if (key !== 'addAssetsType') {
            pageInfo[addAssetsType][key] = pledgeInfo[key]
        }
    })
}
async function changeAccountType(accountType) {
    showAddAssets.value = false
    addAssetsPop.accountType = accountType
    addAssetsPop.tokens = addAssetsPop.addAssetsType === 'sell' ? [pageInfo.symbol] : Object.keys(store.state.tokens)
    await nextTick()
    showAddAssets.value = true
}
function preparePledgeInfo() {
    const { symbol, pledge: { dotc, collateralDotcValues } } = pageInfo
    const { tokens, floatRate } = store.state
    const { query } = route
    const { parseUnits, formatUnits } = ethers.utils
    const { decimals } = tokens[symbol]
    const collateral_tokens = addAssetsPop.tokens.map(token => tokens[token].addr)
    const collateral_dotc_values = Array.from(collateralDotcValues)
    const hasValueTokens = []
    const hasValuePledges = collateral_dotc_values.filter((item, index) => {
        const hasValue = Number(item) > 0
        if (hasValue) {
            hasValueTokens.push(collateral_tokens[index])
        }
        return hasValue
    })
    const conractPledgeInfo = {
        // 合约参数
        token_addr: tokens[symbol].addr,
        buy_price: parseUnits(BigNumber(tokens[symbol].price).multipliedBy(floatRate.usd2Cny).toString(), 18),
        buy_amount: parseUnits(BigNumber(query.finalPurchaseCoinAmt).toFixed(decimals), decimals),
        seller_addr: query.sellAddress,
        sell_ad_id: query.sellId,
        collateral_tokens: hasValueTokens,
        collateral_dotc_values: hasValuePledges
    }
    const backPledgeInfo = {
        buyPrice: BigNumber(tokens[symbol].price).multipliedBy(floatRate.usd2Cny).toString(),
        sellOrderNo: query.orderNo,
        pledgeAmt: willPledgeTotalUsd.value,
        buyAmount: query.finalPurchaseCoinAmt,
        cnyAmt: query.finalPurchaseCny,
        pledges: addAssetsPop.tokens.map((token, index) => {
            return {
                symbol: token,
                amount: formatUnits(collateral_dotc_values[index], store.state.tokens[token].decimals),
                address: collateral_tokens[index]
            }
        }).filter(item => (Number(item.amount) > 0))
    }
    return { conractPledgeInfo, backPledgeInfo }
}
</script>

<template>
    <div class="pledge-required-container">
        <notification-vue v-model="notiType"></notification-vue>
        <!-- <add-assets
            v-model="addPledgeShow"
            addAssetsType="pledge"
            :tokens="pledgeTokens"
            :accountType="accountType"
        ></add-assets>-->
        <add-assets
            v-model="showAddAssets"
            @confirmAdd="clickConfirmAdd"
            v-bind="addAssetsPop"
            @pledgeValues="recievePledgeValues"
            @changeAccountType="changeAccountType"
        ></add-assets>
        <div class="order-uplink">
            <p class="order-uplink-head">
                <span class="order-uplink-title">{{ $t('message.OrderUpChain') }}</span>
                <el-tooltip placement="top-start" effect="light">
                    <template #content>
                        <p
                            class="price-limit-question-pop-tip"
                        >您需要在链上抵押资产，抵押资产额度需大于等于您期望购买的资产额度。如您下单后取消，平台会扣除{{ $store.state.cancelPenalty * 100 + '%' }}作为撤单惩罚。</p>
                    </template>
                    <img
                        class="order-uplink-question"
                        src="@/assets/imgs/wenhao-gray.png"
                        alt="question-icon"
                    />
                </el-tooltip>
            </p>
            <p
                class="order-uplink-desc"
            >您需要在链上抵押资产，抵押资产额度需大于等于您期望购买的资产额度。如您下单后取消，平台会扣除{{ $store.state.cancelPenalty * 100 + '%' }}作为撤单惩罚。</p>
        </div>
        <div class="need-pledge">
            <div class="big-title">
                <span class="big-title-txt">需质押</span>
                <p class="big-title-right">
                    <span class="big-title-num">{{ needPledgeUsd }}</span>
                    <span class="big-title-unit">USD</span>
                </p>
            </div>
            <p class="small-desc">
                <span class="small-desc-orange">{{ countdownNumber }}秒后刷新</span>
                <span
                    class="small-desc-gray"
                >{{ $route.query.finalPurchaseCoinAmt }} {{ $route.query.symbol }} ≈ {{ needPledgeUsd }} USD</span>
            </p>
        </div>
        <div class="pledge-info">
            <div class="pre-pledge">
                <p class="pre-row">
                    <span class="pre-txt">已准备质押物</span>
                    <span class="pre-amount">{{ willPledgeTotalUsd }} USD</span>
                </p>
                <p class="pre-tip">超出的准备额度将存入您的DOTC资产中</p>
            </div>
            <div class="pledge-wallet">
                <div class="dotc-acount">
                    <span class="acount-name">DOTC账户</span>
                    <p class="acount-amount">
                        <span class="amount-num">{{ pageInfo.pledge.dotc }} USD</span>
                        <span class="amount-plus" @click="clickAddPledgeFromDotc">+</span>
                    </p>
                </div>
                <!-- <div class="dotc-acount">
                    <span class="acount-name">钱包账户</span>
                    <p class="acount-amount">
                        <span class="amount-num">300 USD</span>
                        <span class="amount-plus" @click="clickWalletAcountAdd">+</span>
                    </p>
                </div>-->
            </div>
        </div>
        <p class="pledge-tip">平台会收取1%的质押资产作为管理费用</p>
        <div class="bottom-btn">
            <span class="before-step" @click="clickPreStep">上一步</span>
            <p class="place-order" @click="clickPlaceOrder">
                <!-- <loading-icon color="white"></loading-icon> -->
                <span class="order-txt">下单</span>
            </p>
        </div>
    </div>
</template>

<style lang="stylus" scoped>
.pledge-required-container {
    box-sizing: border-box;
    width: 486px;
    height: 533px;
    background: #FFFFFF;
    border: 1px solid #F0F3F7;
    box-sizing: border-box;
    border-radius: 12px;
    padding: 32px 32px 40px 32px;
    .bottom-btn {
        margin-top: 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .before-step {
            width: 96px;
            height: 48px;
            background: rgba(16, 180, 136, 0.1);
            border-radius: 6px;
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            text-align: center;
            color: #10B488;
            line-height: 48px;
            text-align: center;
            cursor: pointer;
        }
        .place-order {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 310px;
            height: 48px;
            background: #10B488;
            border-radius: 6px;
            cursor: pointer;
            .order-txt {
                margin-left: 9px;
                font-family: 'PingFang SC', sans-serif;
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                text-align: center;
                color: #FFFFFF;
            }
        }
    }
    .pledge-tip {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 1;
        color: #959DAD;
        margin-top: 12px;
        text-align: left;
    }
    .pledge-info {
        width: 422px;
        height: 156px;
        background: #F7F9FC;
        border-radius: 6px;
        padding: 20px 16px;
        margin-top: 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .pledge-wallet {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: space-between;
            flex: 1;
            padding-top: 16px;
            .dotc-acount {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: space-between;
                .acount-name {
                    font-family: 'PingFang SC', sans-serif;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 14px;
                    color: #6E798F;
                }
                .acount-amount {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .amount-num {
                        font-family: 'SF UI Text', sans-serif;
                        font-style: normal;
                        font-weight: 500;
                        font-size: 14px;
                        text-align: right;
                        color: #1F2933;
                    }
                    .amount-plus {
                        width: 13px;
                        height: 13px;
                        line-height: 13px;
                        font-size: 10px;
                        color: #10B488;
                        border: 1px solid #10B488;
                        border-radius: 50%;
                        margin-left: 5px;
                        text-align: center;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                    }
                }
            }
        }
        .pre-pledge {
            padding-bottom: 16px;
            border-bottom: 1px solid #F0F3F7;
            .pre-row {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .pre-txt {
                    font-family: 'PingFang SC', sans-serif;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 14px;
                    line-height: 132%;
                    color: #6E798F;
                }
                .pre-amount {
                    font-family: 'SF UI Text', sans-serif;
                    font-style: normal;
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 132%;
                    text-align: right;
                    color: #1F2933;
                }
            }
            .pre-tip {
                font-family: 'SF UI Text', sans-serif;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 132%;
                color: #959DAD;
                text-align: right;
            }
        }
    }
    .need-pledge {
        margin-top: 24px;
        .big-title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            .big-title-txt {
                font-family: 'PingFang SC', sans-serif;
                font-style: normal;
                font-weight: 500;
                font-size: 14px;
                line-height: 1;
                color: #3F475A;
            }
            .big-title-right {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: flex-end;
                .big-title-num {
                    font-family: 'SF UI Text', sans-serif;
                    font-style: normal;
                    font-weight: bold;
                    font-size: 24px;
                    line-height: 1;
                    text-align: right;
                    color: #1F2933;
                }
                .big-title-unit {
                    font-family: 'SF UI Text', sans-serif;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 12px;
                    line-height: 1;
                    color: #1F2933;
                    top: -2px;
                    position: relative;
                    margin-left: 5px;
                }
            }
        }
        .small-desc {
            text-align: right;
            margin-top: 5px;
            .small-desc-orange {
                color: #F3882B;
            }
            .small-desc-gray {
                color: #959DAD;
            }
        }
    }
    .order-uplink {
        padding-bottom: 32px;
        border-bottom: 1px solid #F0F3F7;
        .order-uplink-desc {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 132%;
            color: #959DAD;
            text-align: left;
            margin-top: 8px;
        }
        .order-uplink-head {
            text-align: left;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 95px;
            height: 24px;
            .order-uplink-title {
                font-family: 'PingFang SC', sans-serif;
                font-style: normal;
                font-weight: 600;
                font-size: 18px;
                color: #1F2933;
            }
            .order-uplink-question {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                color: #6E798F;
                font-size: 13px;
                line-height: 14px;
                text-align: center;
                cursor: pointer;
            }
        }
    }
}
</style>

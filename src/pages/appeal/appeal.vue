<script setup>
import DialogBox from '@/components/DialogBox/DialogBox.vue'
import AppealBlackUsd from '@/components/AppealUpload/AppealBlackUsd.vue'
import AppealPayLess from '@/components/AppealUpload/AppealPayLess.vue'
import { ref, watch, computed } from 'vue'
import { saveAppealResult, saveAppealHash } from '@/urls/appeal.js'
import { gasOpt } from '@/consts/gasOpt.js'
import { useRoute } from 'vue-router'
import { ElLoading } from 'element-plus'
import { getContracts } from '@/contract/contracts.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const showConfirmBox = ref(false)
const route = useRoute()
const boxIs = ref('')
const boxMap = {
    copyInfo: {
        titleDesc: '信息已收到',
        detailDesc: '请耐心等待工作人员审核，预计3-5个工作日审核完毕',
        cancelBtnTxt: 'message.Cancel',
        confirmBtnTxt: '确定'
    },
    paySuccess: {
        titleDesc: '补款成功',
        detailDesc: '您已成功上传截图。',
        cancelBtnTxt: 'message.Cancel',
        confirmBtnTxt: '确定'
    },
    appealConfirm: {
        titleDesc: '申诉确认',
        detailDesc: '是否确认未收到买家付款？',
        cancelBtnTxt: '否',
        confirmBtnTxt: '是'
    }
}
const boxContent = ref({})
const showBlackUsd = ref(false)
const showPayLess = ref(false)
function clickBlackUsd() {
    showBlackUsd.value = true
}
function clickPayMore() { }
function clickPayLess() {
    showPayLess.value = true
}
function clickAssetBack() { }
function clickForgetConfirm() { }
async function clickSubmitInfo(obj) {
    // 发送少付，最后关闭弹窗
    showPayLess.value = false
    // 补款成功弹窗
    boxIs.value = 'paySuccess'
    // 发送申诉黑U的请求信息
    // 最后关闭弹窗
    const { orderNo, orderType } = route.query
    console.log('=clickSubmitInfo=', obj)
    await Promise.all([backSaveAppealResult({ ...obj, orderNo, accountType: orderType }), contractApeal()])
    if (orderType === 8) {
        showBlackUsd.value = false
        // 确认框告知受理时间
        boxIs.value = 'copyInfo'
    }
    if (orderType === 4) {
        // 发送少付，最后关闭弹窗
        showPayLess.value = false
        // 补款成功弹窗
        boxIs.value = 'paySuccess'
    }
}
async function contractApeal() {
    const loading = ElLoading.service({ fullscreen: true })
    const { orderNo, orderType } = route.query
    const order_id = orderNo
    const status = 7
    const reason = '黑U'
    console.log('=contractApeal=', order_id, status, reason)
    const blackUTx = await getContracts().dotcIns.write[(orderType === 1 ? 'buyer' : 'seller') + '_label_arbitration'](order_id, status, reason, gasOpt)
    if (blackUTx && blackUTx.hash) {
        const { orderNo } = await saveAppealHash({ id: orderNo, txHash: blackUTx.hash })
        const saveAppealReciept = await blackUTx.wait()
        if (saveAppealReciept.status) {
            // 申诉成功
        }
    }
    loading.close()
}
async function backSaveAppealResult(reqData) {
    let loading = ElLoading.service({ fullscreen: true })
    const res = await saveAppealResult(reqData)
    if (res) {
        const { orderNo, hasOtherBank } = res
    }
    loading.close()
}
watch(
    boxIs,
    (newV) => {
        if (!newV) {
            showConfirmBox.value = false
            return
        }
        boxContent.value = boxMap[newV]
        showConfirmBox.value = true
    },
    { immediate: true }
)
function clearBox() {
    boxIs.value = ''
    boxContent.value = {}
}
function clickCancelBox() {
    clearBox()
}
function clickConfirmBox() {
    clearBox()
}
function clickCloseIcon() {
    clearBox()
}
</script>

<template>
    <div class="appeal-container">
        <confirm-box
            v-model="showConfirmBox"
            v-bind="boxContent"
            @clickCancel="clickCancelBox"
            @clickConfirm="clickConfirmBox"
            @clickCloseIcon="clickCloseIcon"
        ></confirm-box>
        <appeal-black-usd v-model="showBlackUsd" @clickSubmitInfo="clickSubmitInfo"></appeal-black-usd>
        <appeal-pay-less v-model="showPayLess" @clickSubmitInfo="clickSubmitInfo"></appeal-pay-less>
        <div class="appeal-head">
            <p class="head-title">申诉</p>
            <p class="gead-desc">请选择您希望申诉的类型</p>
        </div>
        <div class="appeal-types">
            <div class="appeal-item">
                <div class="item-title">
                    <img
                        class="problem-icon"
                        src="@/assets/imgs/bank-problem-icon.png"
                        alt="bank-problem-icon"
                    />
                    <span class="title-txt">黑U问题</span>
                </div>
                <div class="item-list">
                    <span class="item-problem" @click="clickBlackUsd">卖家的U是黑U</span>
                </div>
            </div>
            <div class="appeal-item">
                <div class="item-title">
                    <img
                        class="problem-icon"
                        src="@/assets/imgs/pay-problem-icon.png"
                        alt="bank-problem-icon"
                    />
                    <span class="title-txt">支付问题</span>
                </div>
                <div class="item-list">
                    <!-- <span class="item-problem" @click="clickPayMore">我付多了钱</span> -->
                    <span class="item-problem" @click="clickPayLess">我付少了钱</span>
                </div>
            </div>
            <!-- <div class="appeal-item">
            <div class="item-title">
                <img class="problem-icon" src="@/assets/imgs/bank-problem-icon.png" alt="bank-problem-icon">
                <span class="title-txt" @click="clickAssetBack">资产被退回问题</span>
            </div>
            <div class="item-list">
                <span class="item-problem" @click="clickForgetConfirm">我已付款，忘记确认，卖家把资产申诉回去了</span>
            </div>
            </div>-->
        </div>
    </div>
</template>

<style scoped lang="styl">
.appeal-container {
    .appeal-head {
        padding: 60px 0px;
        text-align: left;
        border-bottom: 1px solid #F0F3F7;
        .head-title {
            font-family: 'PingFang SC',sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 36px;
            line-height: 132%;
            color: #1F2933;
        }
        .gead-desc {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 132%;
            color: #6E798F;
            margin-top: 8px;
        }
    }
    .appeal-types {
        margin-top: 48px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        .appeal-item {
            margin-left: 126px;
            margin-bottom: 89px;
            width: 430px;
            .item-title {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 33px;
                .problem-icon {
                    width: 48px;
                    height: 48px;
                }
                .title-txt {
                    font-family: 'PingFang SC', sans-serif;
                    font-style: normal;
                    font-weight: 600;
                    font-size: 24px;
                    line-height: 132%;
                    color: #000000;
                }
            }
            .item-list {
                height: 144px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                .item-problem {
                    font-family: 'PingFang SC', sans-serif;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 16px;
                    line-height: 132%;
                    color: #1F2933;
                    margin: 25px 0px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>

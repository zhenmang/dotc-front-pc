<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { saveAppealResult } from '@/urls/appeal.js'
import { ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const reqData = reactive({ orderNo: route.query.orderNo, content: '', appealType: '', accountType: route.query.role, urls: [] })
function goBackPage() {
    router.push({ path: route.query.fromPath, query: { state: route.query.fromState } })
}

const dialogShow = ref(false)
const dialogTitle = ref('')
const dialogMap = {
    1: {
        type: 'frozen',
        title: '请上传卖家银行卡被冻卡截图'
    },
    5: {
        type: 'quota',
        title: '请上传卖家银行卡被限额截图'
    },
    3: {
        type: 'incorrect',
        title: '请上传卖家银行卡信息有误截图',
    }
}
const boxContent = ref({ titleDesc: '', detailDesc: '', cancelBtnTxt: '', confirmBtnTxt: '' })
const boxMap = {
    afterUpload: {
        titleDesc: '信息已提交',
        detailDesc: '请耐心等待，工作人员正在验证中，预计5分钟会有结果。',
        cancelBtnTxt: 'message.Cancel',
        confirmBtnTxt: '确定'
    },
    7: {
        type: 'payMore',
        titleDesc: '我多付了钱',
        detailDesc: '请您先完成这笔订单，上传截图时请上传带有支付金额的截图。完成订单后，请在订单记录中申诉这笔订单，然后按提示流程操作即可。',
        cancelBtnTxt: 'message.Cancel',
        confirmBtnTxt: '确定'
    },
    4: {
        type: 'payLess',
        titleDesc: '我少付了钱',
        detailDesc: '请在线下补全您少付的款项，补全金额后，将付款截图记录上传。',
        cancelBtnTxt: 'message.Cancel',
        confirmBtnTxt: '确定'
    }
}
const boxShow = ref(false)
const { proxy } = getCurrentInstance()
function clickBankPro(proType, txt) {
    reqData.content = txt
    reqData.appealType = proType
    dialogShow.value = true
    dialogTitle.value = dialogMap[proType].title
}
function confirmSave(afterUpload) {
    // 1.发起保存的请求
    // 2.关闭弹窗，弹出处理时效的提示弹窗
    proxy.$refs.uploadPic.$refs.uploadRef.submit()
    dialogShow.value = false
    boxContent.value = boxMap[afterUpload]
    boxShow.value = true
}
function clickMoneyPro(proType, txt) {
    reqData.content = txt
    reqData.appealType = proType
    boxContent.value = boxMap[proType]
    boxShow.value = true
}
function clickBoxConfirm() {
    boxShow.value = false
}
async function backSaveAppealResult() {
    let loading = ElLoading.service({ fullscreen: true })
    const res = await saveAppealResult(reqData)
    const buyerAppealTx = await getContracts().dotcIns.write.buyer_label_arbitration(order_id, status, reason)
    if (buyerAppealTx.hash) {
        const buyerAppealReciept = await buyerAppealTx.wait()
        if (buyerAppealReciept.status) { }
    }
    if (res) {
        const { orderNo, hasOtherBank } = res
    }
    loading.close()
}
function handleUploadSuccess(res, file, fileList) {
    const len = fileList.length
    if (reqData.urls.length === len) {
        backSaveAppealResult()
    } else {
        reqData.urls.push(res.data)
    }
}
</script>

<template>
    <div class="feed-backcontainer">
        <dialog-box v-model="dialogShow" :title="dialogTitle" class="problem-dialog-box">
            <upload-pic
                ref="uploadPic"
                class="problem-upload-pic"
                :autoUpload="false"
                @handleUploadSuccess="handleUploadSuccess"
            ></upload-pic>
            <div class="confirm-btn">
                <span class="confirm-save" @click="confirmSave('afterUpload')">确认保存</span>
            </div>
        </dialog-box>
        <confirm-box v-model="boxShow" v-bind="boxContent" @clickConfirm="clickBoxConfirm"></confirm-box>
        <div class="head-container">
            <p class="big-title">常见问题</p>
            <p class="small-title">请问您遇到了什么问题？</p>
        </div>
        <div class="pro-types">
            <div class="bank-problems">
                <div class="bank-title">
                    <img
                        class="problem-icon"
                        src="@/assets/imgs/bank-problem-icon.png"
                        alt="problem-icon"
                    />
                    <span class="problem-txt">银行卡问题</span>
                </div>
                <div class="pro-lists">
                    <p class="pro-item" @click="clickBankPro(1, '卖家银行卡被冻卡')">卖家银行卡被冻卡</p>
                    <p class="pro-item" @click="clickBankPro(5, '卖家银行卡被限额')">卖家银行卡被限额</p>
                    <p class="pro-item" @click="clickBankPro(3, '卖家银行卡信息有误')">卖家银行卡信息有误</p>
                </div>
            </div>
            <div class="bank-problems pay-problems">
                <div class="bank-title">
                    <img
                        class="problem-icon"
                        src="@/assets/imgs/pay-problem-icon.png"
                        alt="problem-icon"
                    />
                    <span class="problem-txt">支付问题</span>
                </div>
                <div class="pro-lists">
                    <p class="pro-item" @click="clickMoneyPro(7, '我付多了钱')">我付多了钱</p>
                    <p class="pro-item" @click="clickMoneyPro(4, '我付少了钱')">我付少了钱</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="styl" scoped>
.feed-backcontainer {
    position: relative;
    width: 100%;
    padding: 82px;
    box-sizing: border-box;
    .problem-dialog-box {
        text-align: left;
        .problem-upload-pic {
            margin: 60px 0px;
        }
        .confirm-btn {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: flex-start;
            .confirm-save {
                width: 112px;
                height: 48px;
                background: #10B488;
                border-radius: 6px;
                line-height: 48px;
                text-align: center;
                font-family: 'PingFang SC', sans-serif;
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                text-align: center;
                color: #FFFFFF;
                cursor: pointer;
            }
        }
    }
    .pro-types {
        width: 100%;
        margin-top: 109px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        .pay-problems {
            margin-left: 400px;
        }
        .bank-problems {
            .bank-title {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                .problem-icon {
                    width: 37px;
                    height: 33p;
                }
                .problem-txt {
                    font-family: 'PingFang SC', sans-serif;
                    font-style: normal;
                    font-weight: 600;
                    font-size: 24px;
                    color: #000000;
                    margin-left: 18px;
                }
            }
            .pro-lists {
                margin-left: 55px;
                .pro-item {
                    margin-top: 51px;
                    font-family: 'PingFang SC', sans-serif;
                    font-style: normal;
                    font-weight: 500;
                    font-size: 16px;
                    color: #1F2933;
                    text-align: left;
                    cursor: pointer;
                }
            }
        }
    }
    .head-container {
        text-align: left;
        width: 176px;
        height: 77px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .big-title {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 36px;
            color: #1F2933;
        }
        .small-title {
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            color: #6E798F;
        }
    }
}
</style>

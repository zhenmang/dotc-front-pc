<script setup>
import { ref, inject, reactive, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import UploadPaymentVoucher from '@/components/UploadPaymentVoucher/UploadPaymentVoucher.vue'
import useConfirmBox from '@/composables/useConfirmBox.js'
import { ElLoading, ElMessageBox } from 'element-plus'
import { queryOrderDetail } from '@/urls/order.js'
import { saveBuyerCancel, saveBuyerPayUrlsResult, saveBuyerPayInfo, saveBuyerPayHash } from '@/urls/buy-coin.js'
import { getContracts } from '@/contract/contracts.js'
import BigNumber from 'bignumber.js'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { gasOpt } from '@/consts/gasOpt.js'
const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const store = useStore()
const updateListStep = inject('updateListStep')
const showUploadVoucher = ref(false)
const pageInfo = reactive({ cnyAmt: route.query.finalPurchaseCny, sellId: route.query.sellId, userName: '--', cardNo: '--', bankName: '--', orderNo: route.query.orderNo, createTime: '--' })
const uploadUrls = ref([])
const toBePaid = computed(() => (route.query.state === 'toBePaid'))
const topics = {
  toBePaid: {
    titleTxt: 'message.PendingPayment',
    rightBtn: '我已支付，上传凭证截图',
    continueUploadTip: false
  },
  toBeUpChain: {
    titleTxt: '待上链',
    rightBtn: '确认上链',
    continueUploadTip: true
  }
}
const topic = computed(() => (toBePaid.value ? topics.toBePaid : topics.toBeUpChain))
onMounted(async () => {
  updateListStep(3)
})
watch(
  () => store.getters.addressAndChainIdReady,
  async (newV) => {
    if (newV) {
      const orderInfo = await queryOrderDetail({ orderNo: route.query.orderNo })
      console.log('=queryOrderDetail=', orderInfo)
      if (orderInfo) {
        Object.keys(orderInfo).forEach((key) => {
          pageInfo[key] = orderInfo[key]
        })
      }
    }
  },
  { immediate: true }
)
const { boxShow, confirmBoxContent, setConfirmBoxContent, cleanConfirmBoxcontent } = useConfirmBox()
setConfirmBoxContent({
  boxIs: 'cancelOrder',
  titleDesc: 'message.ConfirmCancelOrder',
  detailDesc: `如您发起一笔交易，用来取消订单，取消后，您将受到撤单惩罚，是您下单价值的5%。预计 ${BigNumber(route.query.amount).multipliedBy(store.state.tokens[route.query.symbol].price).multipliedBy(store.state.cancelPenalty).toFixed(2)} USD`,
  cancelBtnTxt: 'message.Cancel',
  confirmBtnTxt: '确认'
})
function clickCancelOrder() {
  boxShow.value = true
}
async function clickBoxConfirm() {
  if (confirmBoxContent.boxIs.includes('cancelOrder')) {
    // 取消订单
    const res = await backCancelBuy()
    if (res && res.orderNo) {
      await contractCancelBuy()
    }
    boxShow.value = false
    router.push({ path: '/buy-sell/buy-coin/has-cancel', query: { ...route.query } })
  }
}
async function contractCancelBuy() {
  let loading = ElLoading.service({ fullscreen: true })
  const cancelBuyTx = await getContracts().dotcIns.write.buyer_cancel_order(pageInfo.buyId, gasOpt)
  if (cancelBuyTx && cancelBuyTx.hash) {
    const { orderNo } = await saveCancelHash({ orderNo: pageInfo.orderNo, txHash: cancelBuyTx.hash })
    const cancelBuyReciept = await cancelBuyTx.wait()
    if (cancelBuyReciept.status) {
      // 取消成功
    }
  }
  loading.close()
  loading = null
}
async function backCancelBuy() {
  let loading = ElLoading.service({ fullscreen: true })
  await saveBuyerCancel({ orderNo: pageInfo.orderNo })
  loading.close()
  loading = null
}
function clickBoxCancel() {
}
function clickHasPayPic() {
  if (route.query.state === 'toBePaid') {
    showUploadVoucher.value = true
    return
  }
  payUpChain()
}
async function payUpChain() {
  let loading = ElLoading.service({ fullscreen: true })
  const res = await saveBuyerPayInfo({ orderNo: pageInfo.orderNo })
  if (res && res.orderNo) {
    // buyer_label_paid(uint256 buyer_order_id)
    const tx = await getContracts().dotcIns.write.buyer_label_paid(pageInfo.buyId, gasOpt)
    if (tx.hash) {
      const [backRes, reciept] = await Promise.all([saveBuyerPayHash({ orderNo: pageInfo.orderNo, txhash: tx.hash }), tx.wait()])
      if (reciept.status) {
        router.push({ path: '/buy-sell/buy-coin/transaction-completion', query: { ...route.query } })
      }
    }
  }
  loading.close()
}
function confirmSaveUpload() {
  // router.push({ query: { ...route.query, state: 'toBeUpChain' }, replace: true })
}

function clickPayProblems() {
  // 1卖2买	
  router.push({ path: '/problem/feedback', role: 2, query: { ...route.query, fromPath: '/buy-sell/buy-coin/order-payment/pay-upchain', fromState: 'toBeUpChain' } })
}
function clickContinueUpload() {
  showUploadVoucher.value = true
}
function clickCopy(content) {
  const input = document.createElement('input')  // 直接构建input
  input.value = content  // 设置内容
  document.body.appendChild(input)    // 添加临时实例
  input.select()   // 选择实例内容
  const result = document.execCommand('Copy')   // 执行复制
  document.body.removeChild(input) // 删除临时实例
  if (result) {
    ElMessageBox({
      message: '复制成功',
      type: 'success',
      showCancelButton: false,
      showConfirmButton: false
    })
    setTimeout(() => {
      ElMessageBox.close()
    }, 2000)
  }
}
async function backSavePayPicUrl(urls) {
  let loading = ElLoading.service({ fullscreen: true })
  const res = await saveBuyerPayUrlsResult({ orderNo: pageInfo.orderNo, urls })
  console.log('=执行了saveBuyerPayUrlsResult=')
  loading.close()
  loading = null
  if (res && res.orderNo) {
    router.push({ query: { ...route.query, state: 'toBeUpChain' }, replace: true })
  }
}
async function handleUploadSuccess(res, file, fileList) {
  const len = fileList.length
  const url = res.data
  uploadUrls.value.push(url)
  if (len === uploadUrls.value.length) {
    await backSavePayPicUrl(uploadUrls.value)
    // 支付上链
    uploadUrls.value = []
    router.push({ query: { ...route.query, state: 'toBeUpChain' }, replace: true })
  }
}
</script>

<template>
  <div class="to-be-paid">
    <upload-payment-voucher
      v-model="showUploadVoucher"
      @confirmSave="confirmSaveUpload"
      :autoUpload="false"
      @handleUploadSuccess="handleUploadSuccess"
    ></upload-payment-voucher>
    <confirm-box
      v-model="boxShow"
      v-bind="confirmBoxContent"
      @clickConfirm="clickBoxConfirm"
      @clickCancel="clickBoxCancel"
    ></confirm-box>
    <div class="title-content">
      <div class="title-row-1">
        <p class="title-row-1-txt">{{ $t(topic.titleTxt) }}</p>
        <p class="title-row-1-amount">
          <span class="amount-num">{{ pageInfo.cnyAmt }}</span>
          <span class="amount-unit">CNY</span>
        </p>
      </div>
      <div class="title-row-2">
        <span class="title-row-2-time">24:00:00</span>
        <span class="title-row-2-txt">
          内未完成交易，卖家申诉成功后您
          <br />会损失资金
        </span>
      </div>
    </div>
    <div class="account-info">
      <p class="account-item">
        <span class="account-left">{{ $t('message.PaymentMethod') }}</span>
        <span class="account-right">{{ $t('message.BankCard') }}</span>
      </p>
      <div class="account-item">
        <span class="account-left">姓名</span>
        <p class="account-right">
          <!-- <span>张三</span> -->
          <span>{{ pageInfo.userName }}</span>
          <img
            src="@/assets/imgs/copy-icon.png"
            alt="copy-icon"
            class="copy-icon"
            @click="clickCopy(pageInfo.userName)"
          />
        </p>
      </div>
      <div class="account-item">
        <span class="account-left">银行账号</span>
        <p class="account-right">
          <!-- <span>6226 0000 0000 0000</span> -->
          <span>{{ pageInfo.cardNo }}</span>
          <img
            src="@/assets/imgs/copy-icon.png"
            alt="copy-icon"
            class="copy-icon"
            @click="clickCopy(pageInfo.cardNo)"
          />
        </p>
      </div>
      <div class="account-item">
        <span class="account-left">开户银行</span>
        <p class="account-right">
          <!-- <span>招商银行</span> -->
          <span>{{ pageInfo.bankName }}</span>
          <img
            src="@/assets/imgs/copy-icon.png"
            alt="copy-icon"
            class="copy-icon"
            @click="clickCopy('招商银行')"
          />
        </p>
      </div>
    </div>
    <div class="order-detail">
      <p class="order-detail-title">订单详情</p>
      <p class="order-detail-item">
        <span class="order-detail-left">{{ $t('message.OrderNumber') }}</span>
        <!-- <span class="order-detail-right">120389230941238123</span> -->
        <span class="order-detail-right">{{ pageInfo.orderNo }}</span>
      </p>
      <p class="order-detail-item">
        <span class="order-detail-left">创建时间</span>
        <!-- <span class="order-detail-right">2021-07-03 00:41:49</span> -->
        <span class="order-detail-right">{{ pageInfo.createTime }}</span>
      </p>
      <p class="order-detail-item">
        <span class="order-detail-left">单价</span>
        <!-- <span class="order-detail-right">1 USD = 6.47 CNY</span> -->
        <span class="order-detail-right">1 USD = {{ $store.state.floatRate.usd2Cny }} CNY</span>
      </p>
    </div>
    <div class="warn-tips">
      <p class="warn-tips-item">请确保您的钱来路明确！如果涉及黑钱，您抵押的所有资产将会被罚没。</p>
      <p class="warn-tips-item">如您取消订单，则会从抵押资产中扣除部分资金作为惩罚。</p>
    </div>
    <div class="btn-container">
      <p class="cancel-order-btn" @click="clickCancelOrder">
        <!-- <loading-icon color="green"></loading-icon> -->
        <span class="cancel-order">{{ $t('message.CancelOrder') }}</span>
      </p>
      <p class="has-payed-btn" @click="clickHasPayPic">{{ topic.rightBtn }}</p>
    </div>
    <div class="bottom-link-container">
      <div class="bottom-link-item" @click="clickContinueUpload" v-if="topic.continueUploadTip">
        <span class="bottom-link-txt">{{ $t('message.ContinueUpload') }}</span>
        <img class="bottom-link-arrow" src="@/assets/imgs/right-arrow.png" alt="right-arrow" />
      </div>
      <div class="bottom-link-item" @click="clickPayProblems">
        <span class="bottom-link-txt">支付遇到问题</span>
        <img class="bottom-link-arrow" src="@/assets/imgs/right-arrow.png" alt="right-arrow" />
      </div>
    </div>
  </div>
</template>

<style lang="styl" scoped>
.to-be-paid {
  padding: 32px;
  width: 486px;
  height: 695px;
  box-sizing: border-box;
  background: #FFFFFF;
  border: 1px solid #F0F3F7;
  box-sizing: border-box;
  border-radius: 12px;
  .bottom-link-container {
    margin-top: 17px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .bottom-link-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;
      margin-left: 18px;
      .bottom-link-txt {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #10B488;
      }
      .bottom-link-arrow {
        width: 12px;
        height: 9px;
        margin-left: 6px;
      }
    }
  }
  .btn-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    .has-payed-btn {
      width: 278px;
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
    .cancel-order-btn {
      width: 128px;
      height: 48px;
      background: rgba(16, 180, 136, 0.1);
      border-radius: 6px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .cancel-order {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 48px;
        text-align: center;
        color: #10B488;
        margin-left: 9px;
      }
    }
  }
  .warn-tips {
    box-sizing: border-box;
    width: 422px;
    height: 84px;
    padding: 12px 16px;
    background: rgba(243, 136, 43, 0.08);
    border-radius: 6px;
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: normal;
    color: #F3882B;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .warn-tips-item {
      font-size: 14px;
      text-align: left;
      line-height: 132%;
    }
  }
  .order-detail {
    padding: 16px 0px 8px 0px;
    .order-detail-title {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 132%;
      color: #959DAD;
      text-align: left;
      padding: 8px 0px;
    }
    .order-detail-item {
      padding: 8px 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .order-detail-left {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #6E798F;
      }
      .order-detail-right {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 132%;
        text-align: right;
        color: #1F2933;
      }
    }
  }
  .account-info {
    padding: 24px 0px 11px 0px;
    border-bottom: 1px solid #F0F3F7;
    .account-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 13px;
      .account-left {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #6E798F;
      }
      .account-right {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #1F2933;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .copy-icon {
          width: 12px;
          height: 14px;
          margin-left: 8px;
        }
      }
    }
  }
  .title-content {
    padding-bottom: 32px;
    border-bottom: 1px solid #F0F3F7;
    .title-row-1 {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .title-row-1-txt {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        color: #1F2933;
      }
      .title-row-1-amount {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-end;
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: bold;
        text-align: right;
        color: #1F2933;
        .amount-num {
          font-size: 24px;
        }
        .amount-unit {
          font-size: 14px;
          position: relative;
          bottom: 2px;
          margin-left: 3px;
        }
      }
    }
    .title-row-2 {
      margin-top: 8px;
      width: 274px;
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 132%;
      color: #F3882B;
      text-align: left;
      .title-row-2-time {
        color: #F3882B;
      }
      .title-row-2-txt {
        color: #959DAD;
      }
    }
  }
}
</style>

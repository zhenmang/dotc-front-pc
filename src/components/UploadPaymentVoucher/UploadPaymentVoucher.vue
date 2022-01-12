<script setup>
import useTimediffCountdown from '@/composables/useTimediffCountdown.js'
import { ArrowLeft } from '@element-plus/icons'
import { onBeforeUnmount, watch, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  }
})
const { proxy } = getCurrentInstance()
const { remainTime, clearRemainTimer, startCountDown } = useTimediffCountdown()
watch(
  () => props.modelValue,
  (newV) => {
    if (!newV) {
      clearRemainTimer()
    } else {
      startCountDown()
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  clearRemainTimer()
})

const emit = defineEmits(['update:modelValue', 'confirmSave', 'handleUploadSuccess'])
function clickCloseIcon() {
  emit('update:modelValue', false)
}

function clickConfirmSave() {
  proxy.$refs.uploadPic.$refs.uploadRef.submit()
  // 1.关闭弹窗s
  emit('update:modelValue', false)
  // 2.发送到后端，进行fileList的保存
  // 3.通知父组件，父组件处理自定义逻辑
  emit('confirmSave')
}
function handleUploadSuccess(res, file, fileList) {
  emit('handleUploadSuccess', res, file, fileList)
}
</script>

<template>
  <dialog-box
    v-model="modelValue"
    title="请上传有效的交易凭证截图"
    @clickCloseIcon="clickCloseIcon"
    deped="UploadPaymentVoucher"
  >
    <div class="payment-voucher">
      <p class="title-tip">如若涉及交易仲裁，您提供的交易凭证截图将作为有效证据。</p>
      <upload-pic
        class="upload-pic-container"
        ref="uploadPic"
        :autoUpload="false"
        @handleUploadSuccess="handleUploadSuccess"
      ></upload-pic>
      <div class="bottom-container">
        <div class="count-down">
          <p class="first-line">
            <span class="count-down-txt">交易倒计时</span>
            <!-- 23:50:49 -->
            <span class="count-down-num">{{ remainTime }}</span>
          </p>
          <span class="second-line">倒计时期间未完成交易，卖家申诉成功后您会损失资金</span>
        </div>
        <span class="confirm-save" @click="clickConfirmSave">确认保存</span>
      </div>
    </div>
  </dialog-box>
</template>

<style lang="styl" scoped>
.payment-voucher {
  text-align: left;
  .upload-pic-container {
    margin: 40px 0px;
  }
  .title-tip {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #959DAD;
    margin-top: 44px;
  }
  .bottom-container {
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
    .count-down {
      width: 288px;
      height: 38px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      .first-line {
        line-height: 18px;
        .count-down-txt {
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: #1F2933;
        }
        .count-down-num {
          font-size: 14px;
          font-weight: 500;
          color: #E48D42;
        }
      }
      .second-line {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        color: #AAB1BF;
      }
    }
  }
}
</style>

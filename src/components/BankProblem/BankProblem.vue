<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirmSave'])
function clickCloseIcon() {
  emit('update:modelValue', false)
}

function clickConfirmSave() {
  // 1.关闭弹窗
  emit('update:modelValue', false)
  // 2.发送到后端，进行fileList的保存
  // 3.通知父组件，父组件处理自定义逻辑
  emit('confirmSave')
}
</script>

<template>
  <dialog-box v-model="modelValue" title="请上传有效的交易凭证截图" @clickCloseIcon="clickCloseIcon" deped="UploadPaymentVoucher">
    <div class="payment-voucher">
      <p class="title-tip">如若涉及交易仲裁，您提供的交易凭证截图将作为有效证据。</p>
      <upload-pic class="upload-pic-container"></upload-pic>
      <div class="bottom-container">
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
  }
}
</style>

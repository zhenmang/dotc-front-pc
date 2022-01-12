<script setup>
import successIcon from '@/assets/imgs/success-icon.png'
import alarmClock from '@/assets/imgs/alarm-clock.png'
import shareIcon from '@/assets/imgs/share-icon.png'
import closeIcon from '@/assets/imgs/close-icon.png'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    validator: value => {
      return ['waiting', 'success', ''].includes(value)
    }
  }
})

const iconTxt = {
  waiting: { icon: alarmClock, txt: '交易确认中...' },
  success: { icon: successIcon, txt: '交易成功' }
}
const content = computed(() => iconTxt[props.modelValue])

const emit = defineEmits(['update:modelValue'])
function clickShareIcon() {
  window.open(`https://etherscan.io/tx/${'0xa9cc0712f660e1a5ddd58b28f48a99d64e5e0dbe2e5b29b7c2f4ad34d4d0c54c'}`, '_blank')
}
function clickCloseIcon() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="notify-container" v-if="content">
    <div class="notify-content">
      <img :src="content.icon" alt="alarm-clock" class="alarm-clock" />
      <span class="trans-confirm">{{ content.txt }}</span>
      <img :src="shareIcon" alt="share-icon" class="share-icon" @click="clickShareIcon" />
      <img :src="closeIcon" alt="close-icon" class="close-icon" @click="clickCloseIcon" />
    </div>
  </div>
</template>

<style lang="styl" scoped>
.notify-container {
  position: absolute;
  top: 78px;
  right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  @keyframes noti-right {
    0% {
      right: -50px;
    }
    100% {
      right: 0;
    }
  }
  .notify-content {
    transition: right;
    will-change: right;
    animation: noti-right 0.1s linear;
    margin-top: 16px;
    padding: 17px 16px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    background: #FFFFFF;
    border: 1px solid #F0F3F7;
    box-sizing: border-box;
    box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.06), 0px 2px 8px rgba(14, 14, 44, 0.02);
    border-radius: 8px;
    position: relative;
    .alarm-clock {
      width: 16px;
      height: 16px;
      border-radius: 16px;
      margin-right: 8px;
    }
    .trans-confirm {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #1F2933;
    }
    .share-icon {
      width: 12px;
      height: 12px;
      margin-left: 50px;
    }
    .close-icon {
      margin-left: 20px;
      width: 11px;
      height: 11px;
    }
  }
}
</style>

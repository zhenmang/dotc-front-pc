<script setup>
import DepositWithDrawal from '@/components/MyAssetTable/DepositWithDrawal.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['clickCancel', 'clickConfirm'])
function clickCancel() {
  emit('clickCancel')
}
function clickConfirm() {
  emit('clickConfirm')
}
</script>

<template>
  <deposit-with-drawal
    subject="提现额度"
    balance="2000.00"
    :excessBalance="false"
    @clickCancel="clickCancel"
    @clickConfirm="clickConfirm"
  ></deposit-with-drawal>
</template>

<style lang="styl" scoped>
</style>

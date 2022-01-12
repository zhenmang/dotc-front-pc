<script setup>
import SelectTabs from '@/components/SelectTabs/SelectTabs.vue'
import StepLists from '@/components/StepLists/StepLists.vue'
import useNavTabs from '@/composables/useNavTabs.js'
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
  fixTab: {
    type: Number,
    required: false,
    default: 0
  },
  fixStep: {
    type: Number,
    required: false,
    default: 0
  }
})

const { navTabs } = useNavTabs()
const router = useRouter()
const buySteps = [
  { title: 'message.SelectSeller', description: 'message.SelectSellerTip' },
  { title: 'message.OrderUpChain', description: 'message.PledgeOrder' },
  { title: 'message.OnChainPayment', description: 'message.PayInfoUpChain' },
  { title: 'message.TransCompleted', description: '' }
]
const listStep = inject('listStep')
const updateListStep = inject('updateListStep')
// const stepPaths = {
//   1: '/buy-sell/buy-coin/select-seller/seller-list',
//   2: '/buy-sell/buy-coin/order-uplink/pledge-required',
//   3: '/buy-sell/buy-coin/order-payment/pay-upchain',
//   4: '/buy-sell/buy-coin/transaction-completion'
// }
function updateStep(step) {
  updateListStep(1)
  router.push('/buy-sell/buy-coin/select-seller/seller-list')
  // router.push(stepPaths[step])
}
</script>

<template>
  <div class="buy-sell-left">
    <select-tabs :tabs="navTabs" :fixTab="fixTab" class="buy-tab-nav" />
    <p class="remove-center-buy-coin">{{ $t('message.BuyCoin') }}</p>
    <step-lists
      :steps="buySteps"
      :activeStep="listStep"
      @updateStep="updateStep"
      class="add-steps-style"
      :fixStep="fixStep"
    />
  </div>
</template>

<style scoped lang="styl">
.buy-sell-left {
  .buy-tab-nav {
    margin-top: 32px;
    margin-bottom: 40px;
  }
  .add-steps-style {
    margin-top: 32px;
  }
  .remove-center-buy-coin {
    text-align: left;
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 36px;
    line-height: 132%;
    color: #1F2933;
  }
}
</style>

<script setup>
import DepositWithDrawal from '@/components/MyAssetTable/DepositWithDrawal.vue'
import { useI18n } from 'vue-i18n'
import { stringifyQuery } from 'vue-router'
import store from '../../store'
import { ethers } from 'ethers'
import { ElMessage, ElLoading } from 'element-plus'
import { getContracts } from '@/contract/contracts.js'
import { dotcAddr, daiAddr, usdtAddr, usdcAddr, chainlinkAddr } from '@/consts/address.js'
import queryAllBalance from '@/contract/queryAllBalance'
const { t } = useI18n()
const props = defineProps({
  depositToken: {
    type: String,
    required: false,
    default: '--'
  }
})
const emit = defineEmits(['clickCancel', 'clickConfirm'])
function clickCancel() {
  emit('clickCancel')
}
async function clickConfirm(amount) {
  await depositToDotc(amount)
  emit('clickConfirm')
}
async function depositToDotc(inputAmt) {
  const loading = ElLoading.service({ fullscreen: true })
  const amount = ethers.utils.parseUnits(inputAmt, store.state.tokens[props.depositToken].decimals)
  try {
    const { tokensIns, dotcIns } = getContracts()
    const approveTx = await tokensIns[store.state.tokens[props.depositToken].index].write.approve(dotcAddr, amount)
    const approveReciept = await approveTx.wait()
    if (approveReciept.status) {
      const depositTx = await dotcIns.write.deposit(store.state.tokens[props.depositToken].addr, amount)
      const depositReciept = await depositTx.wait()
      if (depositReciept.status) {
        await queryAllBalance()
      }
    }
  } catch (err) {
    console.log(err)
    // ElMessage.error(err.message)
  }
  loading.close()
}
</script>

<template>
  <deposit-with-drawal
    subject="存入额度"
    :depositToken="depositToken"
    :excessBalance="false"
    @clickCancel="clickCancel"
    @clickConfirm="clickConfirm"
  ></deposit-with-drawal>
</template>

<style lang="styl" scoped>
</style>

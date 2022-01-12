<script setup>
import { ElMessageBox } from 'element-plus'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import ConfirmBox from '@/components/ConfirmBox/ConfirmBox.vue'
import { ethers } from 'ethers'
import { ElLoading } from 'element-plus'
import request from '@/tools/request'
import { queryFloatRate } from '@/urls/common-api.js'
import { getProvider, getSigner } from '@/contract/providerSign.js'
import loginServer from '@/urls/loginServer.js'
// import queryAllBalance from '@/contract/queryAllBalance.js'
import { initContracts } from '@/contract/contracts.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const store = useStore()
const showWalletNotice = ref(false)
let providerInstance
let signer
onMounted(() => {
  window.addEventListener('DOMContentLoaded', init)
})
async function init() {
  let loadingInstance = ElLoading.service({ fullscreen: true })
  const metaMaskProvider = await getProvider()
  if (!metaMaskProvider) return
  providerInstance = metaMaskProvider
  signer = await getSigner()
  watchChange()
  await initContracts(providerInstance, signer)
  loadingInstance.close()
  loadingInstance = null
}
function watchChange() {
  watchChainChange()
  watchAccountChange()
}
async function initFloatRate() {
  const loading = ElLoading.service({ fullscreen: true })
  const floatRate = await queryFloatRate()
  if (floatRate && floatRate.usd2Cny) {
    store.commit('updateFloatRate', floatRate)
  }
  loading.close()
}
function accountsChanged(accounts) {
  store.commit('handleAccountsChanged', accounts)
  console.log('=accountsChanged=')
}
function watchAccountChange() {
  store.dispatch('requestEthAccounts')
  window.ethereum.on('accountsChanged', accountsChanged)
}
function chainChanged(chainId) {
  store.commit('handleChainChanged', chainId)
  console.log('=chainChanged=', chainId)
}
function watchChainChange() {
  store.dispatch('requestEthChainId')
  window.ethereum.on('chainChanged', chainChanged);
}
onUnmounted(() => {
  window.ethereum && window.ethereum.removeListener('accountsChanged', accountsChanged);
  window.ethereum && window.ethereum.removeListener('chainChanged', chainChanged)
})
function clickConfirmNotice() {
  store.commit('updateWalletNotice', [])
}
watch(
  () => store.state.walletNotice,
  (newV) => {
    showWalletNotice.value = !!newV.length
  }
)
watch(
  () => store.getters.addressAndChainIdReady,
  async (newV) => {
    if (newV) {
      request.defaults.headers.chainId = store.state.chainId
      request.defaults.headers.address = store.getters.currentAccount
      // queryAllBalance()
      // await loginServer()
      // await initFloatRate()
    }
  },
  { immediate: true }
)
</script>

<template>
  <confirm-box
    v-model="showWalletNotice"
    titleDesc="提示"
    singleBtn
    @clickConfirm="clickConfirmNotice"
  >
    <template v-slot:default>
      <p
        class="wallet-notice-desc"
        v-for="(item, index) in store.state.walletNotice"
        :key="index"
      >{{ item }}</p>
    </template>
  </confirm-box>
</template>

<style lang="styl" scoped>
.wallet-notice-desc {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    text-align: center;
    color: #6E798F;
    line-height: 1.3;
    margin-top: 8px;
    width: 100%;
    overflow: hidden;
    word-break: break-all;
}
</style>

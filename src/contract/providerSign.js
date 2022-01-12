import store from '@/store'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider';
// import { getCurrentInstance } from 'vue'
// const { proxy }  = getCurrentInstance()
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

let providerCache = null
let signerCache = null
async function initProvider() {
  const provider = await detectEthereumProvider();
  if (provider) {
    if (provider !== window.ethereum) {
      store.commit('updateWalletNotice', ['您是否安装了多个钱包插件？', '请切换到MetaMask'])
    } else {
      const metaMaskProvider = new ethers.providers.Web3Provider(provider)
      updateProviderReady()
      providerCache = metaMaskProvider
      return metaMaskProvider
    }
  } else {
    store.commit('updateWalletNotice', ['请安装并开启MetaMask插件。', '下载地址https://metamask.io/'])
    // 请安装MetaMask
    // const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
  }
}
function updateProviderReady() {
  const conStatus = window.ethereum && window.ethereum.isConnected()
  if (conStatus) {
    store.commit('updateProviderReady', conStatus)
  }
}

async function initSigner() {
  const providerCache = await returnProvider()
  signerCache = providerCache.getSigner()
  return signerCache
}

async function returnProvider() {
  if (providerCache) return providerCache
  return await initProvider()
}

export const getProvider = returnProvider

export async function getSigner() {
  if (signerCache) return signerCache
  return await initSigner()
}

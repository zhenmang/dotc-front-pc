import { ethers } from 'ethers'
const actions = {
  async connectWallet({ commit }) {
    if (!window.ethereum) {
      commit('updateWalletNotice', ['请安装并开启MetaMask插件。', '下载地址https://metamask.io/'])
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      commit('handleAccountsChanged', accounts)
    } catch(err) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        commit('updateWalletTip', '请先链接到MetaMask')
      } else {
        console.error(err);
      }
    }
  },
  async requestEthAccounts({ commit }) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    commit('handleAccountsChanged', accounts)
  },
  async requestEthChainId({ commit }) {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    commit('handleChainChanged', chainId)
  },
  async requestBalance({ commit, state, getters }, account) {
    const instance = state.contract
    try {
      console.log('=合约实例=', instance)
      const balance = await instance.getBalance(getters.currentAccount)
      commit('updateBalance', balance)
      console.log('=返回值=', ethers.utils.formatUnits(balance, 18))
      const txHash = await ethereum.request({
        method: 'eth_getBalance',
        params: [ getters.currentAccount, 'latest'],
      });
      console.log('=txHash1=', ethers.utils.formatEther(txHash))
      console.log('=txHash2=', ethers.utils.formatUnits(txHash, 18))
    } catch (err) {
      console.log('=err.message=', err.message)
    }
  }
}

export default actions

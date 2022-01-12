import { ethers } from 'ethers'
const mutations = {
  updateCurrentAccount(state, currentAccount) {
    state.currentAccount = currentAccount
  },
  handleAccountsChanged(state, accounts) {
    state.accounts = accounts
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      state.walletTip = '请先链接到MetaMask'
    }
  },
  updateWalletTip(state, walletTip) {
    state.walletTip = walletTip
  },
  handleChainChanged(state, chainId) {
    state.chainId = chainId
  },
  updateContractObj(state, contractObj) {
    state.contractObj = contractObj
  },
  updateWalletNotice(state, notices) {
    state.walletNotice = notices
  },
  updateBalance(state, balance) {
    state.balance = balance
  },
  updateProviderReady(state, status) {
    state.providerStatus = status
  },
  updateFloatRate(state, floatRate) {
    state.floatRate = floatRate
  },
  updateTokensBanlances(state, tokensBalances) {
    Object.keys(state.tokens).forEach((token, index) => {
      state.tokens[token].balance = tokensBalances[index]
    })
  },
  updateDotcAccountDetail(state, dotcAccountDetail) {
    // symbols: ["USDT", "USDC", "DAI"]
    // addrs: ["0x2131", "0x2131", "0x2131"]
    // frozens: [BigNumbe, BigNumbe, BigNumbe]
    // amounts: [BigNumbe, BigNumbe, BigNumbe]
    // DAI: { addr: '0xdEbEf0Db8ac27da32E27917fEfde489cdec9De1E', amount: 0, frozen: 0 }
    state.dotc = dotcAccountDetail
  },
  updateRouteHistory(state, toPath) {
    const len = state.routeHistory.length
    state.routeHistory.splice(len, 0, toPath)
  },
  updateTokenDecimals(state, decimals) {
    const tokenKeys = Object.keys(state.tokens)
    tokenKeys.forEach((token, index) => {
      state.tokens[token].decimals = decimals[index]
    })
  },
  updateTokensPrice(state, tokensPrice) {
    Object.keys(state.tokens).forEach((token, index) => {
      state.tokens[token].price = tokensPrice[index]
    })
  },
  updatePledgeRate(state, pledgeRate) {
    state.pledgeRate = pledgeRate
  },
  updateOrderMinQuantity(state, minOrderQuantity) {
    state.minOrderQuantity = minOrderQuantity
  },
  updateContractsStatus(state, boolean) {
    state.contractsStatus = boolean
  },
  logOutWallet(state) {
    state.accounts = []
  }
}

export default mutations

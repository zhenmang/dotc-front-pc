const getters = {
  currentAccount(state) {
    return state.accounts[0]
  },
  addressAndChainIdReady(state) {
    return state.accounts[0] && state.chainId
  },
  // totalUnlockValue(state) {
  //   // dotc里面的amount + 钱包账户中的三种token余额，乘以价格
  //   const dotc = state.dotc
  //   const dotcUnlockValue = Object.keys(dotc).reduce((total, token) => {
  //     const amount = dotc[token].amount
  //     // const value = amount * tokenPrice
  //     return total
  //   }, 0)
  //   state.tokens
  // },
  addressAndContractReady(state) {
    return state.accounts[0] && state.contractsStatus
  }
}

export default getters;

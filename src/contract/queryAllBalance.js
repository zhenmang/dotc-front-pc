import store from '@/store'
import { ethers } from 'ethers'
import { getContracts } from '@/contract/contracts.js'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
export default async function queryAllBalance() {
  const address = store.getters.currentAccount
  const { dotcIns, tokensIns } = getContracts()
  const tokenInstances = tokensIns.map(tokenIns => tokenIns.read)
  console.log('=tokenInstances=',tokenInstances)
  const hasTokenInstance = tokenInstances.every(item => !!item)
  if (!hasTokenInstance) return
  // 各种tokens余额
  const tokenBalancePromises = tokenInstances.map(contract => contract.balanceOf(address))
  // 获取token的decimals
  const tokenDecimalsPromises = tokenInstances.map(contract => contract.decimals())
  // dotc账户余额
  const dotcInstance = dotcIns.read
  console.log('=dotcInstance=', dotcInstance)
  const dotcAccountDetailPromise = dotcInstance.getUserTokenList(address)

  // const tokenBalances = await Promise.all(tokenBalancePromises)
  // const tokenDecimals = await Promise.all(tokenDecimalsPromises)
  // const dotcAccountDetail = await dotcInstance.getUserTokenList(address)
  const totalRes = await Promise.all([ ...tokenBalancePromises, ...tokenDecimalsPromises, dotcAccountDetailPromise ])
  const dotcAccountDetail = totalRes.pop()
  const tokenBalances = totalRes.splice(0, totalRes.length / 2)
  const tokenDecimals = totalRes

  const formatTokensBalances = tokenBalances.map((balance, index) => ethers.utils.formatUnits(balance, tokenDecimals[index]))
  store.commit('updateTokensBanlances', formatTokensBalances)
  store.commit('updateTokenDecimals', tokenDecimals)
  console.log('=dotcAccountDetail=', dotcAccountDetail)
  const symbols = dotcAccountDetail[0]
  const addrs = dotcAccountDetail[1]
  const amounts = dotcAccountDetail[2]
  // const frozens = dotcAccountDetail[3]
  const dotcAccount = symbols.reduce((map, token, index) => {
    const decimals = store.state.tokens[token].decimals
    const amount = ethers.utils.formatUnits(amounts[index], decimals)
    // const frozen = ethers.utils.formatUnits(frozens[index], decimals)
    // map[token] = { addr: addrs[index], amount, frozen }
    map[token] = { addr: addrs[index], amount }
    return map
  }, {})
  store.commit('updateDotcAccountDetail', dotcAccount)
}

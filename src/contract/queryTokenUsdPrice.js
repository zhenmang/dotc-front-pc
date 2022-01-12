import store from '@/store'
import { ethers } from 'ethers'
import { getContracts, getContractsAdds } from '@/contract/contracts'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

export default async function queryTokenUsdPrice() {
  const oracle = getContracts().oracleIns.read
  const { tokensAddrs } = getContractsAdds()
  const tokenKeys = Object.keys(store.state.tokens)
  const promises = tokensAddrs.map(token => oracle.getPrice(token))
  const tokensPrice = await Promise.all(promises)
  const formatPrices = tokensPrice.map((bigNumberPrice) => {
    const price = ethers.utils.formatUnits(bigNumberPrice, 18)
    return price
  })
  store.commit('updateTokensPrice', formatPrices)
}

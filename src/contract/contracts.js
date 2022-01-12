import { ethers } from 'ethers'
import daiAbi from './abi/daiAbi.json'
import usdtAbi from './abi/usdtAbi.json'
import usdcAbi from './abi/usdcAbi.json'
import dotcAbi from './abi/dotcAbi.json'
import chainlinkAbi from './abi/chainlinkOracle.json'
import store from '@/store'
import { dotcAddr, daiAddr, usdtAddr, usdcAddr, chainlinkAddr } from '@/consts/address.js'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

let dotcIns = null
let daiIns = null
let usdtIns = null
let usdcIns = null
let oracleIns = null
let allInsReady = null

export function initContracts(providerInstance, signer) {
  dotcIns = { read: new ethers.Contract(dotcAddr, dotcAbi, providerInstance), write: new ethers.Contract(dotcAddr, dotcAbi, signer), addr: dotcAddr }
  daiIns = { read: new ethers.Contract(daiAddr, daiAbi, providerInstance), write: new ethers.Contract(daiAddr, daiAbi, signer), addr: daiAddr }
  usdtIns = { read: new ethers.Contract(usdtAddr, usdtAbi, providerInstance), write: new ethers.Contract(usdtAddr, usdtAbi, signer), addr: usdtAddr }
  usdcIns = { read: new ethers.Contract(usdcAddr, usdcAbi, providerInstance), write: new ethers.Contract(usdcAddr, usdcAbi, signer), addr: usdcAddr }
  oracleIns = { read: new ethers.Contract(chainlinkAddr, chainlinkAbi, providerInstance), write: new ethers.Contract(chainlinkAddr, chainlinkAbi, signer), addr: chainlinkAddr }
  allInsReady = dotcIns && daiIns && usdtIns && usdcIns && oracleIns
  if (allInsReady) {
    store.commit('updateContractsStatus', true)
  }
}

export function getContracts() {
  if (!allInsReady) {
    initContracts()
  }
  return {
    dotcIns,
    tokensIns: [
      daiIns,
      usdtIns,
      usdcIns
    ],
    oracleIns
  }
}

export function getContractsAdds() {
  return {
    dotcAddr,
    tokensAddrs: [
      daiAddr,
      usdtAddr,
      usdcAddr
    ],
    chainlinkAddr
  }
}

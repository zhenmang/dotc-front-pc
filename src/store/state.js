import { dotcAddr, daiAddr, usdtAddr, usdcAddr, chainlinkAddr } from '@/consts/address.js'
import usdtIcon from '@/assets/imgs/usdt-icon.png'
import daiIcon from '@/assets/imgs/dai-icon.png'
import usdcIcon from '@/assets/imgs/usdc-icon.png'
const state = {
  routeHistory: [],
  providerStatus: false,
  accounts: [],
  walletTip: '',
  chainId: '',
  walletNotice: [],
  chainlinkOracle: { addr: chainlinkAddr, balance: 0, decimals: 18 },
  dotc: {
    addr: dotcAddr,
    DAI: { amount: 0, frozen: 0 },
    USDT: { amount: 0, frozen: 0 },
    USDC: { amount: 0, frozen: 0 }
  },
  tokens: {
    DAI: { balance: 0, decimals: 18, price: '1.00', addr: daiAddr, chinese: 'DAI', icon: daiIcon, index: 0 },
    USDT: { balance: 0, decimals: 6, price: '1.00', addr: usdtAddr, chinese: 'USDT', icon: usdtIcon, index: 1 },
    USDC: { balance: 0, decimals: 6, price: '1.00', addr: usdcAddr, chinese: 'USDC', icon: usdcIcon, index: 2 }
  },
  floatRate: { cny2Usd: '0.1569', usd2Cny: '6.3748' },
  pledgeRate: 1.1,
  approveAmount: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  minOrderQuantity: 10,
  contractsStatus: false,
  oracle: { addr: chainlinkAddr },
  cancelPenalty: 0.05
}

export default state

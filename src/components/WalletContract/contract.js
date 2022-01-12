import dotc_artifacts from './dotc.json'
// import Web3 from 'web3/dist/web3.min.js'
import { ElMessageBox } from 'element-plus'
// const TruffleContract = require('./truffle-contract.min.js')
// import './truffle-contract.min.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

console.log('=TruffleContract=', TruffleContract)
class OtcContract {
  constructor() {
    if (OtcContract.instance) {
      return OtcContract.instance
    }
    this.web3 = null
    window.addEventListener('DOMContentLoaded', this.init.call(this));
  }
  async init() {
    // this.initWeb3()
    const isMetaMask = await this.initProvider()
    if (!isMetaMask) return
    // await this.watchEvents()
    await this.initContract()
  }
  // initWeb3() {
  //   if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
  //     console.log('MetaMask is not installed!');
  //     if (typeof web3 !== 'undefined') {
  //       // Use Mist/MetaMask's provider
  //       this.web3 = new Web3(web3.currentProvider)
  //     } else {
  //       // console.warn("No web3 detected. Falling back to http://localhost:7545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
  //       // // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  //       // this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  //     }
  //   } else {
  //     ElMessageBox.confirm({
  //       title: '提示',
  //       message: '请先安装MetaMask插件https://metamask.io/',
  //       type: 'warning'
  //     })
  //   }
  // }
  async initProvider() {
    const provider = await detectEthereumProvider();
    if (provider) {
      if (provider !== window.ethereum) {
        ElMessageBox({
          message: '您是否安装了多个钱包插件？请切换到MetaMask',
          type: 'confirm'
        })
      } else {
        return true
      }
    } else {
      ElMessageBox({
        message: '请先安装MetaMask插件https://metamask.io/',
        type: 'confirm'
      })
    }
  }
  async initContract() {
    const contractObj = TruffleContract({abi: dotc_artifacts})
    contractObj.setProvider(window.ethereum)
    // OtcContract.instance = await contractObj.deployed()
  }
  providerStatus() {
    return window.ethereum && window.ethereum.isConnected()
  }
  async watchEvents() {
    await this.watchChainChange()
    await this.watchAccountChange()
  }
  handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }
  async watchChainChange() {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    this.handleChainChanged(chainId);
    window.ethereum.on('chainChanged', handleChainChanged);
  }
  async watchAccountChange() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      this.handleAccountsChanged(accounts)
    } catch (err) {
      console.error(err);
    }
    window.ethereum.on('accountsChanged', this.handleAccountsChanged.call(this));
  }
  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      ElMessageBox({
        message: '请先链接到MetaMask',
        type: 'confirm'
      })
    } else if (accounts[0] !== this.currentAccount) {
      currentAccount = accounts[0];
      // Do any other work!
    }
  }
  async connectWallet() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      this.handleAccountsChanged(accounts)
    } catch(err) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        ElMessageBox({
          message: '请先链接到MetaMask',
          type: 'confirm'
        })
      } else {
        console.error(err);
      }
    }
  }
}

export default OtcContract

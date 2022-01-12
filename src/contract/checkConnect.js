import store from '@/store'
import { ElMessageBox } from 'element-plus'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
export default function checkConnect() {
  if (!store.getters.currentAccount) {
    ElMessageBox.close()
    ElMessageBox({
      title: '您尚未连接钱包',
      type: 'warning',
      confirmButtonText: '连接钱包',
      callback: (action) => {
        store.dispatch('connectWallet')
      },
    })
    return false
  }
  return true
}

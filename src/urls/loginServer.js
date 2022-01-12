import store from '@/store'
import { getSigner } from '@/contract/providerSign.js'
import { queryTk, loginByTk } from '@/urls/common-api.js'
import request from '@/tools/request.js'
import { ElLoading, ElMessageBox } from 'element-plus'

async function getServerToken() {
  const address = store.getters.currentAccount
  ElMessageBox({
    message: '请您先进行签名，以登录服务',
    type: 'warning',
    confirmButtonText: '好的',
    async callback(action) {
      if (action === 'confirm') {
        let loadingInstance = ElLoading.service({ fullscreen: true })
        const { tk } = await queryTk({ address })
        const signer = await getSigner()
        const signature = await signer.signMessage(tk)
        const { token } = await loginByTk({ sign: signature, address })
        if (token) {
          request.defaults.headers['X-Access-Token'] = token
          localStorage.setItem('backEndToken', token)
        }
        loadingInstance.close()
        loadingInstance = null
      }
    }
  })
}
export default async function loginServer(unAuth) {
  if (unAuth) {
    return await getServerToken()
  }
  let token = localStorage.getItem('backEndToken')
  if (!token) {
    return await getServerToken()
  } else {
    request.defaults.headers['X-Access-Token'] = token
  }
}

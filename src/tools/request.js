import axios from 'axios'
import loginServer from '@/urls/loginServer.js'
import { ElMessageBox } from 'element-plus'
import checkConnect from '@/contract/checkConnect.js'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 5000,
  headers: {
    chainId: '',
    address: '',
    'X-Access-Token': localStorage.getItem('backEndToken')
  },
  cancelToken: source.token
})
instance.interceptors.request.use(function (config) {
    if (!checkConnect()) {
        source.cancel(400)
    }
    return config
}, function (err) {
    return Promise.reject(err)
});

instance.interceptors.response.use(function (response) {
    console.log('=公共response=', response)
    const { status, data } = response
    if (status === 200) {
        const { code, msg, data: result } = data
        if (code === 200) {
            return result
        }
        if (code === 401) {
            loginServer('unAuth')
            return
        }
        errHandler(msg)
        return
    }
    errHandler()
    return response
}, function (err) {
    if (err.message === 400) {
        return
    } else if (err.response && err.response.status === 401) {
        loginServer('unAuth')
    } else {
        errHandler()
    }
    return Promise.reject(err)
})

function errHandler(msg) {
    ElMessageBox({
        message: msg || '服务异常',
        type: 'warning',
        showCancelButton: false,
        showConfirmButton: false
    })
    setTimeout(() => {
        ElMessageBox.close()
    }, 3000)
}

export default instance

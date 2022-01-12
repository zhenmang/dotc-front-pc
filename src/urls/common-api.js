import request from '@/tools/request'
import store from '@/store'
// 1获取登录TK
export function queryTk(params) {
  return request.get('/com/queryTk', { params })
}
export function loginByTk(data) {
  return request.post('/com/loginByTk', data)
}
export async function queryFloatRate(params) {
  const floatRate = await request.get('/com/price', { params })
}
export async function upload(data) {
  return request.post('/com/upload', data)
}

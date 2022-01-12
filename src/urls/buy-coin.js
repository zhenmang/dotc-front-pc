import request from '@/tools/request'
// 查询卖家列表
export function querySellList(params) {
  return request.get('/buy/querySellList', { params }).catch((err) => console.error(err.message))
}
// 下单提示忽略
export function saveIgnoreBuyTip(data) {
  return request.post('/buy/saveIgnoreBuyTip', data)
}
// 下单上链
export function saveBuyerOrder(data) {
  return request.post('/buy/saveBuyerOrder', data)
}
// 下单上链交易Hash
export function saveBuyerOrderHash(data) {
  return request.post('/buy/saveBuyerOrderHash', data)
}
// 支付上链
export function saveBuyerPayInfo(data) {
  return request.post('/buy/saveBuyerPayInfo', data)
}
// 支付上链Hash
export function savePayHash(data) {
  return request.post('/buy/savePayHash', data)
}
// 提交支付截图结果
export function saveBuyerPayUrlsResult(data) {
  return request.post('/buy/saveBuyerPayUrlsResult', data)
}
// 取消上链
export function saveBuyerCancel(data) {
  return request.post('/buy/saveBuyerCancel', data)
}
// 取消上链交易Hash
export function saveCancelHash(data) {
  return request.post('/buy/saveCancelHash', data)
}
// 提交被冻卡截图结果
export function saveFrozenResult(data) {
  return request.post('/buy/saveFrozenResult', data)
}
// 支付上链Hash
export function saveBuyerPayHash(data) {
  return request.post('/buy/saveBuyerPayHash', data)
}

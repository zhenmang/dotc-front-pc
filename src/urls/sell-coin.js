import request from '@/tools/request'
// 保存质押上链信息
export function savePledgeInfo(data) {
  return request.post('/sell/savePledgeInfo', data)
}
// 保存质押上链交易Hash
export function savePledgeHash(data) {
  return request.post('/sell/savePledgeHash', data)
}
// 查询卖单信息
export function querySellOrder(params) {
  return request.get('/sell/querySellOrder', { params })
}
// 查询卖单操作列表
export function querySellOrderTrackList(params) {
  return request.get('/sell/querySellOrderTrackList', { params })
}
// 取消挂单
export function cancelSellOrder(data) {
  return request.post('/sell/cancelSellOrder', data)
}
// 修改卖单银行卡
export function updateOrderBank(data) {
  return request.post('/sell/updateOrderBank', data)
}
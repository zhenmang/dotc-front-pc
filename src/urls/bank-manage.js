import request from '@/tools/request'
// 添加银行卡
export async function saveBankCard(data) {
  return request.post('/payment/saveBankCard', data)
}
// 查询银行卡列表
export async function queryBankList(params) {
  return request.get('/payment/queryBankList', { params })
}
// 查询银行卡是否有卖单
export async function queryBankHasOrder(params) {
  return request.get('/payment/queryBankHasOrder', { params })
}
// deleteBankCard
export async function deleteBankCard(data) {
  return request.post('/payment/deleteBankCard', data)
}
// 查询银行卡开户行
export async function queryBankName(params) {
  return request.get('/payment/queryBankName', { params })
}

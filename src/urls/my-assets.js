import request from '@/tools/request'
// 查询抵押资产列表
export function queryPledge(params) {
  return request.get('/account/queryPledge', { params })
}

// 查询交易中资产列表
export function queryTrading(params) {
  return request.get('/account/queryTrading', { params })
}

// 查询现货资产列表
export function querySpot(params) { 
  return request.get('/account/querySpot', { params })
}

// 查询处罚资产列表
export function queryPunish(params) {
  return request.get('/account/queryPunish', { params })
}

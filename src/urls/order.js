import request from '@/tools/request'

// 查询订单记录列表
export function queryOrderList(params) {
  return request.get('/buy/queryOrderList', { params })
}

//
export function querySellOrderTrackList(params) {
  return request.get('/sell/querySellOrderTrackList', { params })
}

// 查询订单信息
export function queryOrderDetail(params) { 
  return request.get('/buy/queryOrderDetail', { params })
}
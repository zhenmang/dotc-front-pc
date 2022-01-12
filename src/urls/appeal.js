import request from '@/tools/request'

// 【申诉】提交被冻卡限额少付钱截图结果
export function saveAppealResult(data) {
  return request.post('/buy/saveAppealResult', data)
}

// 【申诉】保存申诉Hash
export function saveAppealHash(data) {
  return request.post('/buy/saveAppealHash', data)
}

// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
export const buyOrderStatus = [
  { value: 1, label: '下单上链中', tip: '下单交易已广播，等待上链' },
  { value: 2, label: '下单上链确认中', tip: '下单交易已上链，等待n个确认' },
  { value: 3, label: 'message.PendingPayment', tip: '3个情况：\n1.下单已上链  已n个确认，待授权\n2.下单已上链，已n个确认，待发起支付交易\n3.授权已上链，待发起支付交易' },
  { value: 4, label: '已关闭', tip: '卖方卡有问题，并且没其它卡，交易自动关闭' },
  { value: 5, label: '授权上链中', tip: '授权交易已广播，等待上链' },
  { value: 6, label: '支付上链中', tip: '支付交易已广播，等待上链' },
  { value: 7, label: '支付上链确认中', tip: '支付已上链，等待n个确认' },
  { value: 8, label: '已完成', tip: '支付已上链  已n个确认' },
  { value: 9, label: 'message.InSellerAppeal', tip: '卖家发起申诉上链交易，并已上链以及有n个确认' },
  { value: 10, label: '撤单上链中', tip: '撤单已广播，等待上链' },
  { value: 11, label: '撤单上链确认中', tip: '撤单交易已上链，等待n个确认' },
  { value: 12, label: 'message.CancelledOrder', tip: '撤单交易已上链，已n个确认' },
  { value: 13, label: '退回上链中', tip: '超时未确认支付，卖家申请退回成功了，由平台发起退回上链' },
  { value: 14, label: '退回上链确认中', tip: '已上链，待n个确认' },
  { value: 15, label: '已退回', tip: '已完成上链且完成n个确认' },
  { value: 16, label: '已完成，锁仓资产罚没中', tip: '卖家申诉成功后，后台将买家质押资产罚没，归属到卖家dotc资产中，此时正在上链中。' },
  { value: 17, label: '已完成，锁仓资产已罚没', tip: '罚没交易已上链成功' }
]
export const sellOrderStatus = [
  { value: 1, label: '买方下单上链中', tip: '下单交易已广播，等待上链' },
  { value: 2, label: '待买方付款', tip: '下单交易已上链，等待n个确认' },
  { value: 3, label: '买方支付上链中', tip: '3个情况：\n1.下单已上链  已n个确认，待授权\n2.下单已上链，已n个确认，待发起支付交易\n3.授权已上链，待发起支付交易' },
  { value: 4, label: '买方撤单上链中', tip: '授权交易已广播，等待上链' },
  { value: 5, label: '买方已撤单', tip: '支付交易已广播，等待上链' },
  { value: 6, label: '已完成', tip: '支付已上链，等待n个确认' },
  { value: 7, label: 'message.InSellerAppeal', tip: '支付已上链  已n个确认' },
  { value: 8, label: '资产退回中', tip: '撤单已广播，等待上链' },
  { value: 9, label: 'message.AssetReturned', tip: '撤单交易已上链，等待n个确认' },
  { value: 10, label: '已完成，锁仓资产罚没中', tip: '买家申诉成功后，后台将卖家质押资产罚没，归属到买家dotc资产中，此时正在上链中。' }, 
  { value: 11, label: '已完成，锁仓资产已罚没', tip: '罚没交易已上链成功' },
  { value: 12, label: '待买方付款（超时）', tip: '买家超24小时未付款' },// 新增
]
export const allOrderStatus = buyOrderStatus.concat(sellOrderStatus)

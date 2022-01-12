import BuyCoin from '@/pages/buy-sell/buy-coin/buy-coin.vue'
// import FloatingRate from '@/pages/buy-sell/buy-coin/select-seller/floating-rate.vue'
import SellerList from '@/pages/buy-sell/buy-coin/select-seller/seller-list.vue'
import PledgeRequired from '@/pages/buy-sell/buy-coin/order-uplink/pledge-required.vue'
import PayUpChain from '@/pages/buy-sell/buy-coin/order-payment/pay-upchain.vue'
import TransactionCompletion from '@/pages/buy-sell/buy-coin/transaction-completion/transaction-completion.vue'
import HasCancel from '@/pages/buy-sell/buy-coin/has-cancel/has-cancel.vue'

const routes = [
  {
    path: '/buy-sell/buy-coin',
    component: BuyCoin,
    children: [
      // {
      //   path: 'select-seller/floating-rate',
      //   component: FloatingRate
      // },
      {
        path: 'select-seller/seller-list',
        component: SellerList
      },
      {
        path: 'order-uplink/pledge-required',
        component: PledgeRequired
      },
      {
        path: 'order-payment/pay-upchain',
        component: PayUpChain
      },
      {
        path: 'has-cancel',
        component: HasCancel
      },
      {
        path: 'transaction-completion',
        component: TransactionCompletion
      }
    ]
  }
]

export default routes

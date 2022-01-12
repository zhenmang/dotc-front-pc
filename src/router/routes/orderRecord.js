import OrderRecord from '@/pages/order-record/order-record.vue'
import buyOrderStatus from '@/pages/order-record/buy-order-status/buy-order-status.vue'
import sellOrderStatus from '@/pages/order-record/sell-order-status/sell-order-status.vue'

const routes = [
    { path: '/buy-sell/order-record/home', component: OrderRecord },
    { path: '/buy-sell/order-record/buy-order-status', component: buyOrderStatus },
    { path: '/buy-sell/order-record/sell-order-status', component: sellOrderStatus }
]

export default routes

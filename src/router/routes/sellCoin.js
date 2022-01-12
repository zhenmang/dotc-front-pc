import SellHome from '@/pages/buy-sell/sell-coin/sell-home.vue'
import PublishSell from '@/pages/buy-sell/sell-coin/publish-sell.vue'
import SellInfo from '@/pages/buy-sell/sell-coin/sell-info/sell-info.vue'
import PledgeUplink from '@/pages/buy-sell/sell-coin/pledge-uplink/pledge-uplink.vue'
import PublishSuccess from '@/pages/buy-sell/sell-coin/publish-success/publish-success.vue'
import CollectManage from '@/pages/buy-sell/sell-coin/collect-manage/collect-manage.vue'

const routes = [
    { path: '/buy-sell/sell-coin/sell-home', component: SellHome },
    {
        path: '/buy-sell/sell-coin/publish-sell',
        component: PublishSell,
        children: [
            {
                path: 'sell-info',
                component: SellInfo
            },
            {
                path: 'pledge-uplink',
                component: PledgeUplink
            },
            {
                path: 'publish-success',
                component: PublishSuccess
            }
        ]
    },
    { path: '/buy-sell/sell-coin/collect-manage', component: CollectManage },
    { path: '/buy-sell/sell-coin', redirect: '/buy-sell/sell-coin/sell-home' },
]

export default routes

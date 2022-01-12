// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
export default function useNavTabs() {
    const navTabs = [
        { text: 'message.BuyCoin', path: '/buy-sell/buy-coin/select-seller/seller-list', acPath: '/buy-sell/buy-coin' },
        { text: 'message.SellCoin', path: '/buy-sell/sell-coin', acPath: '/buy-sell/sell-coin' },
        { text: 'message.OrderRecord', path: '/buy-sell/order-record/home', acPath: '/buy-sell/order-record' }
    ]
    return {
        navTabs
    }
}

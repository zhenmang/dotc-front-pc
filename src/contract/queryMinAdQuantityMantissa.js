import store from '@/store'
import { ethers } from 'ethers'
import { getContracts } from '@/contract/contracts.js'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
export default async function queryMinAdQuantityMantissa() {
    let minQuantity = await getContracts().dotcIns.read.minAdQuantityMantissa()
    if (minQuantity) {
        minQuantity = ethers.utils.formatUnits(minQuantity, 6)
        store.commit('updateOrderMinQuantity', minQuantity)
    }
}

<script setup>
import SellCoinLeft from '@/components/SellCoinLeft/SellCoinLeft.vue'
import useToggleStep from '@/composables/useToggleStep.js'
import { provide } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useStore()
const { listStep, updateListStep } = useToggleStep()
provide('listStep', listStep)
provide('updateListStep', updateListStep)
</script>

<template>
    <div class="publish-sell-continer">
        <sell-coin-left />
        <div class="buy-coin-right">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped lang="styl">
.publish-sell-continer {
    display: flex;
	flex-direction: row;
	justify-content: space-around;
    .buy-coin-right {
        margin-top: 101px;
        min-width: 692px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        margin-top: 108px;
        padding-bottom: 65px;
    }
}
</style>

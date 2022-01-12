<script setup>
import StepLists from '@/components/StepLists/StepLists.vue'
import { inject } from 'vue'
import router from '../../router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const sellSteps = [
    { title: 'message.FillInSells', description: 'message.SetMixPriceRange' },
    { title: 'message.PledgeAssetOnChian', description: 'message.upChainSoldLocked' },
    { title: 'message.PulishSuccess', description: '' },
]
const stepPaths = {
    1: '/buy-sell/sell-coin/publish-sell/sell-info',
    // 2: '/buy-sell/sell-coin/publish-sell/pledge-uplink',
    // 3: '/buy-sell/sell-coin/publish-sell/publish-success'
}
const activeStep = inject('listStep')
const updateListStep = inject('updateListStep')
function updateStep(step) {
    step = 1
    updateListStep(step)
    router.push(stepPaths[step])
}
</script>

<template>
    <div class="sell-coin-left">
        <p class="sell-coin-nav">
            <span class="sell-coin-txt">{{ $t('message.SellCoin') }}</span>
            <span class="sell-coin-divide">/</span>
            <span class="publish-order-txt">{{ $t('message.PulishSellOrder') }}</span>
        </p>
        <p class="sell-coin-left-title">{{ $t('message.PulishSellOrder') }}</p>
        <step-lists
            :steps="sellSteps"
            :activeStep="activeStep"
            @updateStep="updateStep"
            class="sell-coin-steps"
        ></step-lists>
    </div>
</template>

<style scoped lang="styl">
.sell-coin-left {
    .sell-coin-nav {
        margin-top: 40px;
        font-family: 'PingFang SC', sans-serif;;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 132%;
        display: flex;
        align-items: left;
        color: #959DAD;
        .publish-order-txt {
            color: #1F2933;
        }
        .sell-coin-divide {}
    }
    .sell-coin-left-title {
        margin: 40px 0px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        line-height: 132%;
        color: #1F2933;
        text-align: left;
    }
    .sell-coin-steps {

    }
}
</style>

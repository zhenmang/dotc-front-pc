<script setup>
import BuyCoinLeft from '@/components/BuyCoinLeft/BuyCoinLeft.vue';
import { provide, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useToggleStep from '@/composables/useToggleStep.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { listStep, updateListStep } = useToggleStep()
const router = useRouter()
const route = useRoute()
provide('listStep', listStep)
provide('updateListStep', updateListStep)

</script>
<template>
	<div class="buy-coin">
		<buy-coin-left />
		<div class="buy-coin-right">
			<router-view></router-view>
		</div>
	</div>
</template>
<style scoped lang="styl">
	.buy-coin {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		.buy-coin-right {
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

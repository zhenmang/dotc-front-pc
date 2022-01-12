<script setup>
import BuyCoinLeft from '@/components/BuyCoinLeft/BuyCoinLeft.vue'
import OrderDetail from '@/components/OrderDetail/OrderDetail.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template>
	<div class="buy-coin">
		<buy-coin-left :fixTab="1" :fixStep="2" />
		<order-detail></order-detail>
	</div>
</template>
<style scoped lang="styl">
	.buy-coin {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
</style>

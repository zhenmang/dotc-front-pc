<script setup>
import { ref, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
// const baseUrl = process.env.BASE_URL;
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useStore()
const selectedCoin = ref('USDT')
const coinTypes = Object.keys(store.state.tokens).map(token => ({ ...store.state.tokens[token], english: token }))
function leftIconEle() {
	if (!leftIconEle.value) {
		leftIconEle.value = document.querySelector('.left-coin-icon .select-trigger .el-input--suffix .el-input__inner')
	}
	return leftIconEle.value;
}
const emit = defineEmits(['changeTargetCoin'])
watch(selectedCoin, async (newV, oldV) => {
	await nextTick()
	emit('changeTargetCoin', newV)
	const icon = coinTypes.filter((item) => item.english === newV)[0].icon
	leftIconEle().style.backgroundImage = 'url(' + icon + ')';
}, { immediate: true })
</script>
<template>
	<el-select v-model="selectedCoin" placeholder="USDT" class="left-coin-icon">
		<el-option
			v-for="(item, index) in coinTypes"
			:key="index"
			:label="item.english"
			:value="item.english"
		>
			<div class="slot-icon-coin">
				<img class="slot-img-icon" :src="item.icon" alt="icon" />
				<div class="slot-txt-icon">
					<p class="slot-coin-type">{{ item.english }}</p>
					<p class="slot-coin-chinese">{{ item.chinese }}</p>
				</div>
			</div>
		</el-option>
	</el-select>
</template>
<style scoped lang="styl">
	.slot-icon-coin {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		/* margin: 5px 0px; */
		.slot-img-icon {
			width: 28px;
			height: 28px;
		}
		.slot-txt-icon {
			.slot-coin-chinese {
				margin-left:8px;
				font-family: 'PingFang SC', sans-serif;
				font-style: normal;
				font-weight: normal;
				font-size: 12px;
				line-height: 132%;
				color: #959DAD;
				line-height: 1;
			}
		}
		.slot-coin-type {
			margin-left:8px;
			line-height: 28px;
			font-family: "SF UI Text", sans-serif;
			font-style: normal;
			font-weight: normal;
			font-size: 16px;
			line-height: 1.1;
			color: #1f2933;
		}
	}
</style>
<style lang="styl">
	.left-coin-icon {
		.el-input--suffix {
			.el-input__inner {
				padding-left: 36px;
				background-position: left center;
				background-repeat: no-repeat;
				background-size: 28px 28px;
				border: none;
				font-family: 'SF UI Text', sans-serif;
				font-style: normal;
				font-weight: normal;
				font-size: 16px;
				color: #1F2933;
				width: 85px;
				/* box-sizing: border-box; */
				padding-right: 0px !important;
			}
		}
	}
	.el-select__popper.el-popper[role=tooltip] {
		transform: translateX(-20px);
	}
	.el-select-dropdown__item {
		padding: 5px 20px !important;
	}
</style>
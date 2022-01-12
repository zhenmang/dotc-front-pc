<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import SelectCoin from '@/components/SelectCoin/SelectCoin.vue'
import PayMethod from '@/components/PayMethod/PayMethod.vue'
import queryTokenUsdPrice from '@/contract/queryTokenUsdPrice.js'
import { queryFloatRate } from '@/urls/common-api.js'
import { ElLoading } from 'element-plus'
import metaMaskIcon from '@/assets/imgs/meta-mask-icon.png'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useStore()
const router = useRouter()
const symbol = ref('USDT');
const cnyTotal = ref('0.00')
const tokenTotal = computed(() => {
	return BigNumber(parseFloat(cnyTotal.value || 0)).multipliedBy(store.state.floatRate.cny2Usd).dividedBy(store.state.tokens[symbol.value].price).toFixed(2)
})
const tokenCnyPrice = computed(() => {
	return BigNumber(store.state.floatRate.usd2Cny).multipliedBy(store.state.tokens[symbol.value].price).toFixed(2)
})
function changeTargetCoin(targetCoin) {
	symbol.value = targetCoin
}

// const showWalletSelects = ref(false);
function clickConnectWallet() {
	// showWalletSelects.value = true;
	store.dispatch('connectWallet')
}
watch(
	() => store.getters.addressAndContractReady,
	async (newV) => {
		if (newV) {
			// selectedIndex.value = -1
			let loadingInstance = ElLoading.service({ fullscreen: true })
			await Promise.all([queryTokenUsdPrice(), queryFloatRate()])
			loadingInstance.close()
			loadingInstance = null
		}
	},
	{ immediate: true }
)
// import walletConnectIcon from '@/assets/imgs/wallet-connect-icon.png'
const walletList = [
	{ icon: metaMaskIcon, title: 'MetaMask', desc: 'Connect using browser wallet' },
	// { icon: walletConnectIcon, title: 'Wallet Connect', desc: 'Connect using browser wallet' }
];

// const selectedIndex = ref(-1)
// function selecWallet(clickIndex) {
// 	selectedIndex.value = clickIndex
// 	initWallet(clickIndex)
// }

// const router = useRouter()
// async function initWallet(clickIndex) {
// 	let wallet = walletList[clickIndex].title;
// 	wallet = wallet.replaceAll(' ', '')
// 	await eval('init' + wallet + '()')
// 	// selectedIndex.value = -1
// 	// showWalletSelects.value = false
// 	router.push('/buy-sell/buy-coin/select-seller/seller-list')
// }

function initMetaMask() {
	console.log('initMetaMask')
}
function clickNextStep() {
	router.push({ path: '/buy-sell/buy-coin/select-seller/seller-list', query: { cnyTotal: cnyTotal.value, tokenTotal: tokenTotal.value, usd2Cny: store.state.floatRate.usd2Cny, symbol: symbol.value } })
}
</script>
<template>
	<div class="select-seller-container">
		<div class="usdt-value">
			<p class="usdt-value-tip">1{{ symbol }}的价值约</p>
			<p class="usdt-value-number">{{ tokenCnyPrice }} CNY</p>
		</div>
		<div class="pay-recieve-container">
			<div class="i-want-pay">
				<p class="i-want-pay-text">我要支付</p>
				<div class="coin-detail">
					<div class="icon-coin">
						<img class="img-icon" src="@/assets/imgs/cny-icon.png" alt />
						<p class="coin-type">CNY</p>
					</div>
					<!-- <p class="coin-number">0.00</p> -->
					<el-input v-model="cnyTotal" placeholder="0.00" class="cny-amount" />
				</div>
			</div>
			<div class="i-want-receive i-want-pay">
				<p class="i-want-pay-text">我将收到</p>
				<div class="coin-detail">
					<select-coin @changeTargetCoin="changeTargetCoin" class="limit-select-width"></select-coin>
					<p class="coin-number">{{ tokenTotal }}</p>
				</div>
			</div>
		</div>
		<pay-method></pay-method>
		<div class="connect-wallet">
			<!-- <custom-button @click="clickConnectWallet" v-if="!store.state.providerStatus">连接钱包</custom-button> -->
			<!-- <custom-button @click="clickNextStep" v-else>下一步</custom-button> -->
			<custom-button @click="clickNextStep">{{ $t('message.NextStep') }}</custom-button>
			<!-- <dialog-box title="连接钱包" v-model="showWalletSelects" :titleShow="false" width="392px">
				<div class="connect-wallet-selects">
					<div
						class="select-item"
						:class="{ 'bottom-none': index === walletList.length - 1 }"
						@click="selecWallet(index)"
						v-for="(wallet, index) in walletList"
						:key="index"
					>
						<div class="icon-text">
							<img :src="wallet.icon" alt class="icon-img" />
							<div class="title-desc">
								<p class="title">{{ wallet.title }}</p>
								<p class="desc">{{ wallet.desc }}</p>
							</div>
						</div>
						<loading-icon v-if="selectedIndex === index" color="green"></loading-icon>
						<el-icon v-else>
							<arrow-right />
						</el-icon>
					</div>
				</div>
			</dialog-box>-->
		</div>
	</div>
</template>
<style scoped lang="styl">
	.select-seller-container {
		text-align: left;
		padding: 32px;
		width: 400px;
		background: #ffffff;
		/* Depth/Shadow-L */
		box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.06),
			0px 2px 8px rgba(14, 14, 44, 0.02);
		border-radius: 12px;
		box-sizing: border-box;
		.connect-wallet {
			margin-top: 32px;
			.connect-wallet-selects {
				width: 344px;
				border: 1px solid #f0f3f7;
				box-sizing: border-box;
				border-radius: 12px;
				.select-item {
					cursor: pointer;
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 24px 20px;
					box-sizing: border-box;
					border-bottom: 1px solid #f0f3f7;
					.icon-text {
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						.icon-img {
							width: 45px;
							height: 36px;
						}
						.title-desc {
							margin-left: 17px;
							.title {
								font-family: "SF UI Text", sans-serif;
								font-style: normal;
								font-weight: normal;
								font-size: 16px;
								line-height: 1.5;
								color: #1f2933;
							}
							.desc {
								font-family: "SF UI Text", sans-serif;
								font-style: normal;
								font-weight: normal;
								font-size: 12px;
								line-height: 1.5;
								color: #959dad;
							}
						}
					}
				}
				.bottom-none {
					border-bottom: none;
				}
			}
		}
		.pay-recieve-container {
			margin-top: 25px;
			width: 336px;
			border: 1px solid #f0f3f7;
			box-sizing: border-box;
			border-radius: 12px;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 0px;
			text-align: left;
			border-radius: 12px;
			border-bottom: 1px solid #f0f3f7;
			.i-want-pay {
				width: 100%;
				height: 88px;
				left: 0px;
				top: 0px;
				padding: 16px;
				box-sizing: border-box;
				border-bottom: 1px solid #f0f3f7;
				.i-want-pay-text {
					font-family: "PingFang SC", sans-serif;
					font-style: normal;
					font-weight: 500;
					font-size: 12px;
					line-height: 132%;
					color: #959dad;
				}
				.coin-detail {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.limit-select-width {
						width: 112px;
					}
					.icon-coin {
						margin-top: 10px;
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						.img-icon {
							width: 28px;
							height: 28px;
						}
						.coin-type {
							margin-left: 8px;
							line-height: 28px;
							font-family: "SF UI Text", sans-serif;
							font-style: normal;
							font-weight: normal;
							font-size: 16px;
							line-height: 132%;
							color: #1f2933;
						}
					}
					.cny-amount {
						width: 160px;
					}
					.coin-number {
						font-family: "SF UI Text", sans-serif;
						font-style: normal;
						font-weight: bold;
						font-size: 24px;
						line-height: 132%;
						text-align: right;
						color: #aab1bf;
					}
				}
			}
		}
		.usdt-value {
			width: 100%;
			.usdt-value-tip {
				font-family: "PingFang SC", sans-serif;
				font-style: normal;
				font-weight: normal;
				font-size: 14px;
				line-height: 132%;
				color: #959dad;
			}
			.usdt-value-number {
				font-family: "SF UI Text", sans-serif;
				font-style: normal;
				font-weight: bold;
				font-size: 24px;
				line-height: 132%;
				/* identical to box height, or 32px */
				display: flex;
				align-items: center;
				/* Text/amplified */
				color: #1f2933;
			}
		}
	}
</style>
<style lang="styl">
	.el-select-dropdown__item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}
	.cny-amount {
		width: 160px;
		.el-input__inner {
			font-family: "SF UI Text", sans-serif;
			font-style: normal;
			font-weight: bold;
			font-size: 24px;
			line-height: 132%;
			text-align: right;
			color: #aab1bf;
			padding: 0;
			border: none;
		}
	}
</style>

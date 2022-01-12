import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import { saveIgnoreBuyTip } from '@/urls/buy-coin.js'
import useConfirmBox from './useConfirmBox.js'
import { ElLoading } from 'element-plus'
import store from '@/store'
import BigNumber from 'bignumber.js'
import checkConnect from '@/contract/checkConnect.js'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

export default function useBuyDialogBox(router) {
	const { pledgeRate, cancelPenalty } = store.state
	const selectedRecord = reactive({})
	const finalPurchaseCny = ref('0.00')
	const finalPurchaseCoinAmt = ref('0.00')
	const tips = {
		unFinTran: { titleDesc: '您有一笔未完成交易', detailDesc: '请完成后再发起新交易', cancelBtnTxt: 'message.Cancel', confirmBtnTxt: '立即前往' },
		ERC20: { titleDesc: '您需要抵押一些ERC20资产', detailDesc: `如您后续取消订单，系统会扣除一部分抵押资产作为惩罚，需您在下单环节准备ERC20资产，确保系统可正常运转。需您抵押${parseFloat(BigNumber(cancelPenalty).multipliedBy(100).toFixed(2))}%的购买资产对应的抵押资产即可。预计：$0 USD。`, cancelBtnTxt: 'message.Cancel', confirmBtnTxt: '确认' },
		buyInfo: { titleDesc: '请确认购买信息', detailDesc: [ { label: '地址', value: '--' }, { label: '需要花费', value: '--CNY' }, { label: '即将收到', value: '--USDT' } ], cancelBtnTxt: 'message.Cancel', confirmBtnTxt: '确定' },
	}
	const { boxShow, confirmBoxContent, setConfirmBoxContent, cleanConfirmBoxcontent } = useConfirmBox(tips)

	function clickBoxConfirm(inputCnyAmount, outputCoinAmount) {
		// 如果勾选了下次不再提示，则发起请求进行记录
		switch (confirmBoxContent.boxIs) {
			case 'ERC20':
				confirmBoxContent.boxIs = 'buyInfo'
				break
			case 'buyInfo':
				confirmBoxContent.boxIs = ''
				router.push({ path: '/buy-sell/buy-coin/order-uplink/pledge-required', query: { ...selectedRecord, finalPurchaseCny: finalPurchaseCny.value, finalPurchaseCoinAmt: finalPurchaseCoinAmt.value } })
				break
		}
	}
	function handleBuyInfoTips(finalPurchaseCny, outputCoinAmount) {
		// 地址
		tips.buyInfo.detailDesc[0].value = selectedRecord.sellAddress
		// 花费
		// tips.buyInfo.detailDesc[1].value = BigNumber(selectedRecord.amount).multipliedBy(store.state.tokens[selectedRecord.symbol].price).multipliedBy(store.state.floatRate.usd2Cny).toFixed(2) + 'CNY'
		tips.buyInfo.detailDesc[1].value = finalPurchaseCny + 'CNY'
		// 即将收到
		// tips.buyInfo.detailDesc[2].value = selectedRecord.amount + selectedRecord.symbol
		tips.buyInfo.detailDesc[2].value = finalPurchaseCoinAmt.value + selectedRecord.symbol
	}
	function clickBoxCancel() { }

	// 买前提示：先确认用户是否勾选过下次不再提示，默认没有
	const showBuyTip = ref(false)
	function clickBuy(record, inputCnyAmount, outputCoinAmount) {
		const recordCnyAmount = BigNumber(record.amount).multipliedBy(store.state.tokens[record.symbol].price).multipliedBy(store.state.floatRate.usd2Cny).toString()
		finalPurchaseCny.value = Number(recordCnyAmount) > Number(inputCnyAmount) ? inputCnyAmount : recordCnyAmount
		finalPurchaseCoinAmt.value = BigNumber(finalPurchaseCny.value).multipliedBy(store.state.floatRate.cny2Usd).dividedBy(store.state.tokens[record.symbol].price).toString()
		// 如果后端返回为已记，则不再提示，跳转至ERC20
		// confirmBoxContent.boxIs = 'ERC20'
		// 如果之前没记住，则先给出提示
		if (!checkConnect()) return
		Object.keys(record).forEach((key) => {
			selectedRecord[key] = record[key]
		})
		handleBuyInfoTips(finalPurchaseCny.value, outputCoinAmount)
		// const needPledgeUsd = BigNumber(record.amount).multipliedBy(store.state.pledgeRate).multipliedBy(store.state.tokens[record.symbol].price).toFixed(2)
		const needPledgeUsd = BigNumber(finalPurchaseCny.value).multipliedBy(store.state.floatRate.cny2Usd).multipliedBy(store.state.pledgeRate).toFixed(2)
		tips.ERC20.detailDesc = tips.ERC20.detailDesc.replace('预计：$0 USD', `预计：$${needPledgeUsd} USD`)
		if (!showBuyTip.value) {
			// 弹出ERC20的提示
			confirmBoxContent.boxIs = 'ERC20'
			return
		}
		showBuyTip.value = true
	}
	const remNoTip = ref(false)
	let befBuyTimer = null
	const befBuySecs = ref(10)
	onBeforeUnmount(() => {
		window.clearInterval(befBuyTimer)
	})
	watch(
		showBuyTip,
		(newV, oldV) => {
			if (newV) {
				window.clearInterval(befBuyTimer)
				befBuySecs.value = 10
				befBuyTimer = setInterval(() => {
				befBuySecs.value--;
				if (befBuySecs.value === 0) {
					window.clearInterval(befBuyTimer)
				}
				}, 1000)
			} else {
				befBuySecs.value = 10
				window.clearInterval(befBuyTimer)
			}
		},
		{ immediate: true }
	)
	// 点击我已知晓，不是在Box内
	async function clickMeKnown() {
		if (befBuySecs.value > 0) {
			return
		}
		showBuyTip.value = false
		if (remNoTip.value) {
			let loadingInstance = ElLoading.service({ fullscreen: true })
			try {
				const res = await saveIgnoreBuyTip({})
			} catch (err) {
				console.log(err)
			}
			loadingInstance.close()
			loadingInstance = null
		}
		// 弹出ERC20的提示
		confirmBoxContent.boxIs = 'ERC20'
	}

	return {
		confirmBoxContent,
		boxShow,
		clickBoxConfirm,
		showBuyTip,
		clickBuy,
		remNoTip,
		befBuySecs,
		clickMeKnown,
		clickBoxCancel
	}
}
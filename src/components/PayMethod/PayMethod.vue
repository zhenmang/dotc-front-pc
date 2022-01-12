<script setup>
import { ref, nextTick, watch } from 'vue'
const selectedPayMethod = ref('bankCard');
import bankCardIcon from '@/assets/imgs/bank-card.png'
import alipayIcon from '@/assets/imgs/bank-card.png'
import wechatIcon from '@/assets/imgs/bank-card.png'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const payMethods = [
    { method: 'bankCard', label: 'message.BankCard', icon: bankCardIcon },
    // { method: 'alipay', label: '支付宝', icon: alipayIcon },
    // { method: 'wechat', label: '微信', icon: WechatIcon }
];
const leftIconEleRef = ref(null)
function leftIconEle() {
    if (!leftIconEle.value) {
        leftIconEle.value = document.querySelector('.pay-method .select-trigger .el-input--suffix .el-input__inner')
    }
    return leftIconEle.value;
}
const payMethodIcon = {
    alipay: alipayIcon,
    wechat: wechatIcon
}
watch(selectedPayMethod, async (newV, oldV) => {
    await nextTick()
    leftIconEle().style.backgroundImage = 'url(' + payMethodIcon[newV] + ')';
}, { immediate: true })
</script>
<template>
    <div class="pay-method">
        <p class="pay-method-text">{{ $t('message.PaymentMethod') }}</p>
        <el-select v-model="selectedPayMethod" placeholder="支付方式" class="pay-method-select">
            <el-option
                v-for="(item, index) in payMethods"
                :key="index"
                :label="$t(item.label)"
                :value="item.method"
            >
                <div class="slot-icon-coin">
                    <img class="slot-img-icon" :src="item.icon" alt="icon" />
                    <p class="slot-coin-type">{{ item.label }}</p>
                </div>
            </el-option>
        </el-select>
    </div>
</template>
<style lang="stylus" scoped>
.pay-method {
    margin-top: 24px;
    .pay-method-text {
        font-family: "PingFang SC", sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #3f475a;
        mix-blend-mode: normal;
        margin-bottom: 6px;
    }
}
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
<style lang="stylus">
	.pay-method {
		.pay-method-select {
			width: 100%;
			.select-trigger .el-input--suffix .el-input__inner {
				background-color: #F7F9FC;
			}
		}
		.el-input--suffix {
			.el-input__inner {
				padding-left: 40px;
				background-position: 5px center;
				background-repeat: no-repeat;
				background-size: 28px 28px;
				font-family: 'PingFang SC', sans-serif;
				font-style: normal;
				font-weight: 500;
				font-size: 16px;
				color: #1F2933;
			}
		}
	}
</style>
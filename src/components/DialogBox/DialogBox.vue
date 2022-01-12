<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
	title: {
		type: String,
		required: false,
		default: '',
	},
	modelValue: {
		type: Boolean,
		required: true,
		default: false
	},
	closeControl: {
		type: Boolean,
		required: false,
		default: false
	},
	titleShow: {
		type: Boolean,
		required: false,
		default: true
	},
	width: {
		type: String,
		required: false,
		default: '600px'
	}
});

const emit = defineEmits(['update:modelValue', 'clickCloseIcon']);
function close() {
	if (props.closeControl) {
		emit('clickCloseIcon')
		return
	}
	emit('update:modelValue', false);
}
</script>
<template>
	<div class="mask-layer-container" v-if="modelValue">
		<div class="mask-layer"></div>
		<div class="mask-inner" :style="{ width: width }">
			<div class="mask-header">
				<span class="mask-title">{{ title }}</span>
				<el-icon class="mask-close-icon" @click="close">
					<close-bold />
				</el-icon>
			</div>
			<span v-if="title && titleShow" class="split-line"></span>
			<slot></slot>
		</div>
	</div>
</template>
<style scoped lang="styl">
	.mask-layer-container {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		z-index: 2;
		.mask-layer {
			width: 100%;
			height: 100%;
			background: #3f475a;
			opacity: 0.6;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}
		.split-line {
			position: absolute;
			width: 100%;
			height: 1px;
			background: #F0F3F7;
			top: 64px;
			left: 0;
		}
		.mask-inner {
			position: relative;
			min-width: 200px;
			min-height: 100px;
			z-index: 1;
			padding: 24px;
			background: white;
			box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.06),
				0px 2px 8px rgba(14, 14, 44, 0.02);
			border-radius: 12px;
			box-sizing: border-box;
			.mask-header {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 22px;
				.mask-title {
					font-family: "PingFang SC", sans-serif;
					font-style: normal;
					font-weight: 500;
					font-size: 18px;
					color: #1f2933;
				}
				.mask-close-icon {
					cursor: pointer;
				}
			}
		}
	}
</style>

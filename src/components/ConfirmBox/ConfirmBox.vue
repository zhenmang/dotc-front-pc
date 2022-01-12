<script setup>
import { ref, useSlots, computed } from 'vue'
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
    titleDesc: {
        type: String,
        required: false,
        default: ''
    },
    detailDesc: {
        type: [String, Array],
        required: false,
        default: ''
    },
    cancelBtnTxt: {
        type: String,
        required: false,
        default: 'message.Cancel'
    },
    confirmBtnTxt: {
        type: String,
        required: false,
        default: '确定'
    },
    singleBtn: {
        default: false,
        required: false,
        type: Boolean
    }
});

const detailType = computed(() => { return props.detailDesc.length > 0 && Object.prototype.toString.call(props.detailDesc).slice(8, -1) })

const emit = defineEmits(['update:modelValue', 'clickCancel', 'clickConfirm', 'clickCloseIcon'])

const slots = useSlots()

function clickConfirm() {
    emit('clickConfirm')
}

function clickCancel() {
    emit('update:modelValue', false)
    emit('clickCancel')
}

function clickCloseIcon() {
    emit('update:modelValue', false)
    emit('clickCloseIcon')
}

</script>
<template>
    <dialog-box
        v-model="modelValue"
        :title="title"
        @clickCloseIcon="clickCloseIcon"
        :closeControl="true"
        width="392px"
    >
        <div class="confirm-box-body">
            <img class="exclamatory-mark" src="@/assets/imgs/gantanhao.png" alt="exclamatory-mark" />
            <span class="title-desc">{{ $t('message.titleDesc') }}</span>
            <span v-if="detailType === 'String'" class="detail-desc">{{ $t('message.detailDesc') }}</span>
            <div v-else-if="detailType === 'Array'" class="detail-list">
                <div v-for="(item, index) in detailDesc" :key="index" class="detail-item">
                    <span class="detail-item-label">{{ item.label }}</span>
                    <span
                        class="detail-item-value"
                        :class="{ 'detail-item-adress': !index }"
                    >{{ item.value }}</span>
                </div>
            </div>
            <slot v-else></slot>
            <div class="btn-container" v-if="!singleBtn">
                <span class="cancel-btn" @click="clickCancel">{{ $t(cancelBtnTxt) }}</span>
                <span class="confirm-btn" @click="clickConfirm">{{ confirmBtnTxt }}</span>
            </div>
            <div v-else class="single-btn" @click="clickConfirm">好的</div>
        </div>
    </dialog-box>
</template>
<style lang="stylus" scoped>
.confirm-box-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .detail-list {
        width: 344px;
        background: #F7F9FC;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px 16px;
        margin-top: 16px;
        .detail-item {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            width: 100%;
            margin: 8px 0;
            .detail-item-label {
                font-family: 'PingFang SC', sans-serif;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                color: #6E798F;
                text-align: left;
                width: 56px;
            }
            .detail-item-value {
                font-family: 'SF UI Text', sans-serif;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                text-align: right;
                color: #6E798F;
                text-align: right;
                flex: 1;
                word-wrap: break-word;
                overflow: hidden;
            }
            .detail-item-adress {
                line-height: 18px;
            }
        }
    }
    .exclamatory-mark {
        width: 48px;
        height: 48px;
    }
    .title-desc {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        text-align: center;
        color: #1F2933;
        margin: 16px 0px 8px 0px;
    }
    .detail-desc {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        text-align: center;
        color: #6E798F;
        line-height: 1.3;
        margin-top: 8px;
        width: 100%;
        overflow: hidden;
        word-break: break-all;
    }
    .single-btn {
        margin-top: 32px;
        cursor: pointer;
        width: 344px;
        height: 48px;
        border-radius: 6px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        text-align: center;
        line-height: 48px;
        background: #10B488;
        color: #FFFFFF;
    }
    .btn-container {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        text-align: center;
        margin-top: 32px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 344px;
        line-height: 48px;
        .cancel-btn {
            background: rgba(16, 180, 136, 0.1);
            color: #10B488;
        }
        .confirm-btn {
            background: #10B488;
            color: #FFFFFF;
        }
        .cancel-btn,
        .confirm-btn {
            cursor: pointer;
            width: 164px;
            height: 48px;
            border-radius: 6px;
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            text-align: center;
        }
    }
}
</style>
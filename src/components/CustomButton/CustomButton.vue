<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const emit = defineEmits(['click'])
function click(event) {
    emit('click', event)
}
</script>
<template>
<div class="custom-button" @click="click"><slot></slot></div>
</template>
<style scoped lang="styl">
.custom-button {
    min-width: 64px;
    height: 48px;
    background: #10B488;
    border-radius: 6px;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 48px;
    text-align: center;
    color: #FFFFFF;
    cursor:pointer;
}
</style>

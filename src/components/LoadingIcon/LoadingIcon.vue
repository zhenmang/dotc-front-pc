<script setup>
import greenIcon from '@/assets/imgs/loading-green.png'
import whiteIcon from '@/assets/imgs/loading-white.png'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    color: {
        type: String,
        required: true,
        default: 'white',
        validator(value) {
            return ['white', 'green'].includes(value)
        }
    }
})
const icons = {
    white: whiteIcon,
    green: greenIcon
}
const currentIcon = ref('')
watch(
    () => props.color,
    (newV) => {
        currentIcon.value = icons[newV]
    },
    { immediate: true }
)
</script>

<template>
    <img :src="currentIcon" alt="loading-icon" class="loading-icon" />
</template>

<style lang="stylus" scoped>
@keyframes xuanzhuan{
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.loading-icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    color: #10B488;
    animation: xuanzhuan 1s linear infinite;
}
</style>

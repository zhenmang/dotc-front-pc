<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    steps: {
        type: Array,
        required: true,
        default() {
            return []
        }
    },
    activeStep: {
        type: Number,
        required: true,
        default: 1
    },
    fixStep: {
        type: Number,
        required: false,
        default: 0
    }
})
const active = computed(() => {
    return props.fixStep || props.activeStep
})
const emit = defineEmits(['updateStep'])
function clickStep(index) {
    if (props.fixStep) return
    emit('updateStep', index + 1)
}
</script>

<template>
    <div class="step-lists-container">
        <el-steps direction="vertical" :active="active">
            <el-step
                v-for="(item, index) in steps"
                :key="index"
                :title="$t(item.title)"
                :description="$t(item.description)"
                icon="el-icon-circle-check"
                @click="clickStep(index)"
            />
        </el-steps>
    </div>
</template>
<style scoped lang="styl">
.step-lists-container {
    height: 288px;
}
</style>
<style>
.el-step.is-vertical {
    cursor: pointer;
}
</style>

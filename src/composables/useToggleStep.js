import { ref } from 'vue'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

export default function useToggleStep() {
    const listStep = ref(1)
    const updateListStep = (stepNumber, callback) => {
        listStep.value = stepNumber
        callback && callback()
    }
    return {
        listStep,
        updateListStep
    }
}

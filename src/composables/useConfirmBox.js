import { ref, reactive, watch } from 'vue'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

export default function useConfirmBox(tips) {
    const boxShow = ref(false)
    const confirmBoxContent = reactive({ boxIs: '', titleDesc: '', detailDesc: '', cancelBtnTxt: 'message.Cancel', confirmBtnTxt: '确定' })	

    watch(
		() => confirmBoxContent.boxIs,
		(newV, oldV) => {
			if (newV) {
				boxShow.value = true
				setConfirmBoxContent(tips[newV])
			} else {
				boxShow.value = false
				cleanConfirmBoxcontent()
			}
		},
		{ immediate: true }
	)

	watch(
		boxShow,
		(newV) => {
			if (!newV) {
				confirmBoxContent.boxIs = ''
			}
		}
    )

    function setConfirmBoxContent(options) {
        Object.keys(options).forEach((item) => {
            options[item] && (confirmBoxContent[item] = options[item])
        })
    }
    function cleanConfirmBoxcontent() {
        Object.keys(confirmBoxContent).forEach((item) => {
            confirmBoxContent[item] = ''
        })
    }

    return {
        boxShow,
        confirmBoxContent,
        setConfirmBoxContent,
        cleanConfirmBoxcontent
    }
}

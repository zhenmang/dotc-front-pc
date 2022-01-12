<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({
    modelValue: {
        type: Boolean,
        required: true,
        default: false
    }
})
const emit = defineEmits(['update:modelValue', 'clickSubmitInfo'])
const { proxy } = getCurrentInstance()
const uploadUrls = ref([])
function clickCloseIcon() {
    emit('update:modelValue', false)
}
function clickSubmitInfo() {
    proxy.$refs.uploadPic.$refs.uploadRef.submit()
}
async function handleUploadSuccess(res, file, fileList) {
  const len = fileList.length
  const url = res.data
  uploadUrls.value.push(url)
  if (len === uploadUrls.value.length) {
    // await backSavePayPicUrl(uploadUrls.value)
    uploadUrls.value = []
    emit('clickSubmitInfo', { appealType: 4, content: '', urls: uploadUrls.value })
  }
}
</script>

<template>
    <dialog-box title="我少付了钱" v-model="modelValue" closeControl @clickCloseIcon="clickCloseIcon">
        <div class="pay-less-body">
            <p class="less-title">请在线下补全您少付的款项，补全金额后，将所有的付款截图记录上传。</p>
            <upload-pic
                class="black-usd-pic"
                ref="uploadPic"
                :autoUpload="false"
                @handleUploadSuccess="handleUploadSuccess"
            ></upload-pic>
            <div class="bottom-btn">
                <p class="submit-info" @click="clickSubmitInfo">提交信息</p>
            </div>
        </div>
    </dialog-box>
</template>

<style scoped lang="styl">
.pay-less-body {
    text-align: left;
    .less-title {
        padding-top: 24px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #1F2933;
    }
    .less-pic {
        margin-top: 8px;
    }
    .bottom-btn {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-start;
        width: 100%;
        margin-top: 24px;
        .submit-info {
            width: 112px;
            height: 48px;
            background: #10B488;
            border-radius: 6px;
            font-family: 'PingFang SC', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 48px;
            text-align: center;
            color: #FFFFFF;
            cursor: pointer;
        }
    }
}
</style>

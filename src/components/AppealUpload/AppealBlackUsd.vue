<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
    modelValue: {
        type: Boolean,
        required: true,
        default: false
    },
    record: {
        type: Object,
        required: false,
        default: {}
    }
})
const channel = ref('')
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
    const payload = { appealType: 8, content: channel.value, urls: uploadUrls.value }
    emit('clickSubmitInfo', payload)
  }
}
</script>

<template>
<dialog-box title="卖家的U是黑U" v-model="modelValue" closeControl @clickCloseIcon="clickCloseIcon">
    <div class="black-usd-body">
        <p class="channel-tip">您是通过什么途径知道是黑U的？</p>
        <el-input class="channel-input" v-model="channel" placeholder="请输入"/>
        <p class="upload-txt">上传截图</p>
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
.black-usd-body {
    text-align: left;
    .channel-tip {
        padding-top: 24px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #1F2933;
    }
    .channel-input {
        margin-top: 8px;
    }
    .upload-txt {
        margin-top: 24px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #1F2933;
    }
    .black-usd-pic {
        margin-top: 8px;
    }
    .bottom-btn {
        width: 100%;
        margin-top: 24px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-start;
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

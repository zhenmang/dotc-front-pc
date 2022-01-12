<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import useConfirmBox from '@/composables/useConfirmBox'
import request from '@/tools/request.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { boxShow, confirmBoxContent, setConfirmBoxContent, cleanConfirmBoxcontent } = useConfirmBox()
const props = defineProps({
  autoUpload: {
    type: Boolean,
    required: false,
    default: true
  }
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref([])
// let uploadRef = ref(null)

const boxContentMap = {
  deletePic: {
    boxIs: 'delelePic',
    titleDesc: '是否确认删除该图片？',
    detailDesc: '',
    cancelBtnTxt: 'message.Cancel',
    confirmBtnTxt: '删除'
  },
  continueSave: {
    boxIs: 'continueSave',
    titleDesc: 'message.NoProve',
    detailDesc: '如若涉及交易总裁，您提供的交易凭证截图如果不是真实交易凭证，您的抵押资产可能有被罚没的风险。',
    cancelBtnTxt: 'message.Cancel',
    confirmBtnTxt: '保存'
  }
}

const emit = defineEmits(['handleUploadSuccess'])
let promiseMap
function handleBeforeRemove(file, fileLis) {
  boxShow.value = true
  setConfirmBoxContent(boxContentMap.deletePic)
  return new Promise(function (resolve, reject) {
    promiseMap = { resolve, reject }
  })
}
function clickPicCancel() {
  promiseMap.reject()
  promiseMap = null
}
function clickPicDelete() {
  // 1. 发送接口给后端，同步删除
  promiseMap.resolve()
  promiseMap = null
}

function clickConfirm() {
  switch (boxIs.value) {
    case 'deletePic':
      clickPicDelete()
      break
    case 'continueSave':
      boxShow.value = false
      cleanConfirmBoxcontent()
      break
  }
}
function clickCancel() {
  cleanConfirmBoxcontent()
  if (boxIs.value === 'continueSave') {
    // 1.发送删除请求给后端进行这个图片的删除
    // 2.更新fileList
    fileList.splice(fileList.length - 1)
  }
}
function handleRemove(file, fileList) {
  console.log(file, fileList)
}
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
const formatTip = ref('')
function beforeUpload(file) {
  const accepts = ['image/jpeg', 'image/jpg', 'image/png']
  const isJPGOrPng = accepts.includes(file.type)
  const isLt100M = file.size / 1024 / 1024 < 100

  if (!isJPGOrPng) {
    ElMessage.error('您上传的图片格式错误，请重新上传')
    formatTip.value = '您上传的图片格式错误，请重新上传'
  }
  if (!isLt100M) {
    ElMessage.error('您上传的图片大于100M，请重新上传')
    formatTip.value = '您上传的图片大于100M，请重新上传'
  }
  return isJPGOrPng && isLt100M
}
function handleUploadSuccess(res, file, fileList) {
  console.log('=handleUploadSuccess=', res, file, fileList)
  dialogImageUrl.value = URL.createObjectURL(file.raw)
  // 发起请求判断当前图片是否为交易凭证，如果不是交易凭证，则给出保存确认框
  emit('handleUploadSuccess', res, file, fileList)
  if (typeof res.valid !== 'undefined' && !res.valid) {
    setConfirmBoxContent(boxContentMap.continueSave)
  }
}
function handleFileChange(file, fileList) {
  fileList.value = fileList
}
</script>

<template>
  <div class="upload-pic-container">
    <confirm-box
      v-model="boxShow"
      v-bind="confirmBoxContent"
      @clickConfirm="clickConfirm"
      @clickCancel="clickCancel"
    ></confirm-box>
    <el-upload
      multiple
      action="/f/com/upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      accept=".png, .jpg, .jpeg"
      :on-success="handleUploadSuccess"
      :before-remove="handleBeforeRemove"
      :file-list="fileList"
      :on-change="handleFileChange"
      :auto-upload="autoUpload"
      :headers="request.defaults.headers"
      ref="uploadRef"
    >
      <el-icon>
        <plus />
      </el-icon>
      <template #tip>
        <div class="upload-tip">
          <p class="format-tip">PNG或Jepg,不超过100MB</p>
          <p class="waring-tip" v-if="formatTip">{{ formatTip }}</p>
        </div>
      </template>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<style lang="styl" scoped>
.upload-tip {
  font-family: 'PingFang SC', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #AAB1BF;
  margin-top: 6px;
  .waring-tip {
    font-family: 'PingFang SC', san-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: #E35E5E;
    margin-top: 4px;
  }
}
</style>

<script setup>
import { reactive, ref, watch } from 'vue'
import DialogBox from '../DialogBox/DialogBox.vue';
import { saveBankCard, queryBankName } from '@/urls/bank-manage.js'
import { ElMessageBox } from 'element-plus'
import { ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'confirmAddBank'])
function clickCloseIcon() {
  emit('update:modelValue', false)
}
const bankInfo = reactive({ userName: '', cardNo: '', bankName: '' })
const queryed = ref(false)
// const bankOptions = [
//   { value: '招商银行', label: '招商银行' },
//   { value: '工商银行', label: '工商银行' },
//   { value: '建设银行', label: '建设银行' },
// ]
watch(
  () => bankInfo.cardNo,
  async (newV) => {
    const cardNo = newV.trim().replace(/\s/g, '')
    if (cardNo.length > 7) {
      if (queryed.value) return
      const { bankName, bankId, logo, bankCode } = await getQueryBankName(cardNo)
      bankInfo.bankName = bankName
      queryed.value = true
    } else {
      queryed.value = false
    }
  }
)
async function getQueryBankName(cardNo) {
  const loading = ElLoading.service({ fullscreen: true })
  const res = await queryBankName({ cardNo })
  loading.close()
  return res
}
async function clickConfirmAdd() {
  const cardNo = bankInfo.cardNo.trim().replace(/\s/g, '')
  let res = await saveBankCard({ ...bankInfo, cardNo })
  if (res && res.bankId) {
    ElMessageBox({
      message: '添加成功',
      type: 'success',
      showCancelButton: false,
      showConfirmButton: false
    })
    setTimeout(() => {
      ElMessageBox.close()
      emit('update:modelValue', false)
      emit('confirmAddBank')
    }, 3000)
  }
}
</script>

<template>
  <dialog-box
    title="添加银行卡"
    v-if="modelValue"
    v-model="modelValue"
    :closeControl="true"
    @clickCloseIcon="clickCloseIcon"
    width="392px"
    class="add-bank-card-contaner"
  >
    <div class="add-bank-card-body">
      <div class="add-bank-card-item">
        <p class="bank-owner-tip">{{ $t('message.BankCardName') }}</p>
        <el-input
          :placeholder="$t('message.InputName')"
          class="input-card-owner"
          v-model="bankInfo.userName"
        ></el-input>
      </div>
      <div class="add-bank-card-item">
        <p class="bank-owner-tip">{{ $t('message.BankCardNo') }}</p>
        <el-input
          :placeholder="$t('message.InputName')"
          class="input-card-owner"
          v-model="bankInfo.cardNo"
        ></el-input>
      </div>
      <div class="add-bank-card-item">
        <p class="bank-owner-tip">{{ $t('message.DepositBank') }}</p>
        <el-input :placeholder="$t('message.DepositBank')" v-model="bankInfo.bankName" disabled></el-input>
        <!-- <el-select v-model="bankInfo.bankName" :placeholder="$t('message.SelectBank')">
          <el-option
            v-for="item in bankOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->
      </div>
      <span class="btn-divide"></span>
      <div class="btn-container">
        <span class="btn-txt" @click="clickConfirmAdd">确定添加</span>
      </div>
    </div>
  </dialog-box>
</template>

<style lang="styl" scoped>
.add-bank-card-contaner {
  z-index: 3;
}
.add-bank-card-body {
  padding-top: 32px;
  width: 100%;
  /* height: 529px; */
  .btn-divide {
    position: absolute;
    width: 100%;
    height: 1px;
    background: #F0F3F7;
    bottom: 96px;
    left: 0;
  }
  .btn-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: end;
    padding-top: 32px;
    .btn-txt {
      cursor: pointer;
      width: 112px;
      height: 48px;
      background: #10B488;
      border-radius: 6px;
      line-height: 48px;
      text-align: center;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      text-align: center;
      color: #FFFFFF;
    }
  }
  .add-bank-card-item {
    margin-bottom: 24px;
    .bank-owner-tip {
      text-align: left;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 132%;
      color: #1F2933;
      margin-bottom: 8px;
    }
  }
}
</style>

<style lang="styl">
.add-bank-card-body {
  .add-bank-card-item {
    .el-select {
      width: 100%;
    }
  }
}
</style>

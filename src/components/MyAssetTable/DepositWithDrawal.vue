<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
  subject: {
    type: String,
    required: true,
    default: '存入额度'
  },
  excessBalance: {
    type: Boolean,
    required: true,
    default: false
  },
  depositToken: {
    type: String,
    required: false,
    default: '--'
  }
})

const amount = ref(0)

const emit = defineEmits(['clickCancel', 'clickConfirm'])
function clickCancel() {
  emit('clickCancel')
}
function clickConfirm() {
  emit('clickConfirm', amount.value)
}
</script>

<template>
  <div class="save-into-dotc">
    <p class="save-amount-tip">{{ subject }}</p>
    <el-input
      v-model="amount"
      placeholder="请输入数量"
      :class="{ 'excess-balance-input': excessBalance }"
    >
      <!-- <template #suffix>
        <span class="save-amount-unit">USD</span>
      </template>-->
    </el-input>
    <p class="balance-tips">
      <span class="balance-txt">余额</span>
      <span class="balance-num">{{ $store.state.tokens[depositToken].balance }} {{ depositToken }}</span>
    </p>
    <p class="excess-balance-tip" v-if="excessBalance">超出钱包余额</p>
    <p class="tns">
      <span class="btn-cancel" @click="clickCancel">{{ $t('message.Cancel') }}</span>
      <span class="btn-confirm" @click="clickConfirm">确定</span>
    </p>
  </div>
</template>

<style scoped lang="styl">
.save-into-dotc {
  padding-top: 32px;
  .save-amount-tip {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 132%;
    color: #1F2933;
    margin-bottom: 6px;
  }
  .save-amount-input {
    .save-amount-unit {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 132%;
      color: #6E798F;
      line-height: 46px;
    }
  }
  .tns {
    margin-top: 54px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .btn-cancel {
      width: 64px;
      height: 48px;
      background: rgba(16, 180, 136, 0.1);
      border-radius: 6px;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 48px;
      text-align: center;
      color: #10B488;
      cursor: pointer;
    }
    .btn-confirm {
      cursor: pointer;
      width: 80px;
      height: 48px;
      background: #10B488;
      border-radius: 6px;
      margin-left: 16px;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 48px;
      text-align: center;
      color: #FFFFFF;
    }
  }
  .excess-balance-tip {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #E35E5E;
    mix-blend-mode: normal;
    margin-top: 4px;
  }
  .balance-tips {
    margin-top: 8px;
    .balance-txt {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 132%;
      color: #959DAD;
    }
    .balance-num {
      font-family: 'SF UI Text', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 132%;
      color: #3F475A;
      mix-blend-mode: normal;
      padding-left: 4px;
    }
  }
}
</style>

<style lang="styl">
.save-into-dotc {
  padding-top: 32px;
  .excess-balance-input {
    .el-input__inner {
      border-color: #e35e5e;
    }
  }
}
</style>

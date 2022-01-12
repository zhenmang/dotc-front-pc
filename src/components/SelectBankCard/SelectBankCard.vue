<script setup>
import DialogBox from '../DialogBox/DialogBox.vue';
import { ref, reactive, watch } from 'vue'
import { queryBankList } from '@//urls/bank-manage.js'
import { ElMessageBox } from 'element-plus'
import bankIcon from '@/assets/imgs/zhaoshang-icon.png'
import AddBankCard from '@/components/AddBankCard/AddBankCard.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true
  }
})
const emit = defineEmits(['update:modelValue', 'selectedBankCards'])
const selectBankCardPage = reactive({ bankLists: [], selected: [] })
const showAddBankCard = ref(false)

watch(
  () => props.modelValue,
  async (newV) => {
    if (newV) {
      try {
        await initPageData()
      } catch (err) {
        console.log('错误了，关掉页面')
        emit('update:modelValue', false)
      }
    }
  }
)
async function initPageData() {
  const { records, total } = await queryBankList({ pageIndex: 1, pageSize: 1000 })
  // [ { icon: bankIcon, bankName: '招商银行', bankId: 1, cardNo: '6226 9176 3214 8765', userName: '张三', bankStatus: '' } ]
  selectBankCardPage.bankLists = records
}
function clickCloseIcon() {
  emit('update:modelValue', false)
}
const selectAll = ref(false)
function clickSelectBankCard(index) {
  try {
    if (selectBankCardPage.selected.includes(index)) {
      const position = selectBankCardPage.selected.findIndex((item) => item === index)
      selectBankCardPage.selected.splice(position, 1)
    } else {
      selectBankCardPage.selected.push(index)
    }
    console.dir(selectBankCardPage.selected)
  } catch (err) {
    console.log('err-clickSelectBankCard', err)
  }
}
function clickConfirm() {
  if (!selectBankCardPage.bankLists.length) {
    emit('update:modelValue', false)
    return
  }
  if (selectBankCardPage.selected.length === 0) {
    ElMessageBox({
      message: '您没有选择银行卡',
      type: 'warning',
      confirmButtonText: '去选一张',
      cancelButtonText: '不选了',
      async callback(action) {
        if (action === 'cancel') {
          emit('update:modelValue', false)
        }
      }
    })
    return
  }
  // 选中了银行卡，回显主页，关闭此弹窗
  const selectedBanks = selectBankCardPage.selected.map((index) => selectBankCardPage.bankLists[index])
  console.log('=selectedBanks=', selectedBanks)
  emit('selectedBankCards', selectedBanks)
  emit('update:modelValue', false)
}
function clickAddBankCard() {
  showAddBankCard.value = true
}
async function confirmAddBank() {
  await initPageData()
}
watch(
  selectAll,
  () => {
    selectBankCardPage.selected = selectBankCardPage.bankLists.map((item, index) => index)
  }
)
</script>

<template>
  <dialog-box
    title="选择入金银行卡"
    v-model="modelValue"
    width="392px"
    @clickCloseIcon="clickCloseIcon"
    :closeControl="true"
  >
    <add-bank-card v-model="showAddBankCard" @confirmAddBank="confirmAddBank"></add-bank-card>
    <div class="bank-card-body" v-if="selectBankCardPage.bankLists.length">
      <div
        class="bank-card-item"
        :class="{ 'selected-card': selectBankCardPage.selected.includes(index) }"
        v-for="(item, index) in selectBankCardPage.bankLists"
        @click="clickSelectBankCard(index)"
        :key="index"
      >
        <img class="right-bottom-img" :src="item.icon" alt="right-bottom-img" />
        <p class="bank-card-no">
          <img class="bank-card-icon" :src="item.icon" alt="zhaoshang-icon" />
          <span class="bank-card-number">{{ item.cardNo }}</span>
        </p>
        <span class="bank-card-owner">{{ item.userName }}</span>
      </div>
      <div class="add-card-tip">
        <div class="right-add-tip" @click="clickAddBankCard">
          <img class="plus-icon" src="@/assets/imgs/plus-icon.png" alt="plus-icon" />
          <span class="add-card-txt">添加银行卡</span>
        </div>
      </div>
      <div class="btns">
        <span class="btn-divide"></span>
        <div class="btns-left">
          <el-checkbox v-model="selectAll" label="全部银行卡" class="all-check-box"></el-checkbox>
          <span class="divide-vertical">|</span>
          <span class="selected-txt">已选择</span>
          <span class="card-amount">{{ selectBankCardPage.selected.length }}张</span>
        </div>
        <span class="confirm-btn" @click="clickConfirm">确定</span>
      </div>
    </div>
    <div v-else class="empty-card-body">
      <div class="middle-container">
        <div class="center-content">
          <img class="no-card-img" src="@/assets/imgs/no-record.png" alt="no-record" />
          <span class="no-card-txt">暂无银行卡</span>
          <span class="add-card-txt" @click="clickAddBankCard">添加银行卡</span>
        </div>
      </div>
      <span class="divide-line"></span>
      <div class="btns">
        <p class="btns-left">
          <span class="left-txt">已选择</span>
          <span class="left-num">{{ selectBankCardPage.selected.length }}张</span>
        </p>
        <span class="confirm-txt" @click="clickConfirm">确定</span>
      </div>
    </div>
  </dialog-box>
</template>

<style lang="styl" scoped>
.empty-card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .btns {
    width: 100%;
    height: 96px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btns-left {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .left-txt {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #959DAD;
      }
      .left-num {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 132%;
        color: #1F2933;
        margin-left: 4px;
      }
    }
    .confirm-txt {
      width: 80px;
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
      cursor: pointer;
    }
  }
  .divide-line {
    position: absolute;
    width: 100%;
    height: 1px;
    background: #F0F3F7;
    top: 481px;
    left: 0;
  }
  .middle-container {
    height: 417px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .center-content {
      width: 320px;
      height: 158px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .no-card-img {
        width: 80px;
        height: 80px;
      }
      .no-card-txt {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        text-align: center;
        color: #7B8293;
      }
      .add-card-txt {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 9px 16px;
        position: static;
        width: 102px;
        height: 36px;
        background: #10B488;
        border-radius: 6px;
        box-sizing: border-box;
        margin-top: 24px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #FFFFFF;
        cursor: pointer;
      }
    }
  }
}
.bank-card-body {
  width: 100%;
  padding-top: 24px;
  .btns {
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .btn-divide {
      position: absolute;
      width: 100%;
      height: 1px;
      background: #F0F3F7;
      left: 0;
      bottom: 96px;
    }
    .btns-left {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .all-check-box {}
      .divide-vertical {
        color: #E6E7F0;
        font-size: 14px;
        margin: 0px 8px;
      }
      .selected-txt {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        color: #959DAD;
      }
      .card-amount {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 132%;
        color: #1F2933;
        margin-left: 4px;
      }
    }
    .confirm-btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 14px 24px;
      position: static;
      width: 80px;
      height: 48px;
      background: #10B488;
      border-radius: 6px;
      box-sizing: border-box;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 132%;
      text-align: center;
      color: #FFFFFF;
      cursor: pointer;
    }
  }
  .add-card-tip {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .right-add-tip {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;
      .plus-icon {
        width: 16px;
        height: 16px;
      }
      .add-card-txt {
        margin-left: 4px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 132%;
        color: #10B488;
      }
    }
  }
  .bank-card-item {
    width: 344px;
    height: 100px;
    background: linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%);
    border: 1px solid #E6E7F0;
    box-sizing: border-box;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    .right-bottom-img {
      width: 72px;
      height: 72px;
      position: absolute;
      right: -7px;
      bottom: -14px;
      opacity: 0.04;
    }
    .bank-card-no {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .bank-card-icon {
        width: 28px;
        height: 28px;
      }
      .bank-card-number {
        margin-left: 12px;
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 132%;
        color: #000000;
      }
    }
    .bank-card-owner {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 132%;
      color: #3F475A;
    }
  }
  .selected-card {
    border: 1px solid #10B488;
  }
}
</style>

<style lang="styl">
.bank-card-body {
  .btns {
    .btns-left {
      .all-check-box {
        .el-checkbox__inner {
          width: 16px;
          height: 16px;
        }
        .el-checkbox__label {
          font-family: 'PingFang SC', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 132%;
          color: #6E798F;
          padding-left: 6px;
        }
      }
    }
  }
}
</style>

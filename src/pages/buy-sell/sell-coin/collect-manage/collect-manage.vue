<script setup>
import AddBankCard from '../../../../components/AddBankCard/AddBankCard.vue';
import ConfirmBox from '../../../../components/ConfirmBox/ConfirmBox.vue';
import { ref, reactive, watch, onMounted } from 'vue'
import { queryBankList, queryBankHasOrder, deleteBankCard } from '@/urls/bank-manage.js'
import bankIcon from '@/assets/imgs/zhaoshang-icon.png'
import store from '@/store'
import { ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// const bankLists = [
//   { icon: bankIcon, no: '6226 9176 3214 8765', owner: '张三', current: true },
//   { icon: bankIcon, no: '6226 9176 3214 8765', owner: '王皮皮' },
//   { icon: bankIcon, no: '6226 9176 3214 8765', owner: '李四' },
// ]
const bankLists = ref([])
const showAddCard = ref(false)
const showBox = ref(false)
const boxIs = ref('')
const boxContent = ref({ titleDesc: '', detailDesc: '', cancelBtnTxt: '', confirmBtnTxt: '' })
const boxMap = {
  repeatAdd: {
    titleDesc: 'message.HasAddedBankCard',
    detailDesc: 'message.DoNotAddRepeated',
    singleBtn: true
  },
  delInSell: {
    titleDesc: 'message.ConfirmCancel',
    detailDesc: '该卡已经被添加到卖单中，是否删除？',
    cancelBtnTxt: 'message.Cancel',
    confirmBtnTxt: '确认'
  },
  delInBuy: {
    titleDesc: 'message.NotSupportDelete',
    detailDesc: '该卡正有买家下单，暂不支持删除，确定无交易订单后便可删除该卡。',
    singleBtn: true
  },
  confirmDel: {
    titleDesc: 'message.ConfirmCancel',
    detailDesc: '',
    cancelBtnTxt: 'message.Cancel',
    confirmBtnTxt: '确认'
  }
}
watch(
  boxIs,
  (newV) => {
    boxContent.value = boxMap[newV]
    if (newV) {
      showBox.value = true
    }
  },
  { immediate: true }
)
watch(
  () => store.getters.addressAndChainIdReady,
  queryList,
  { immediate: true }
)
async function queryList(newV) {
  if (newV) {
    let loading = ElLoading.service({ fullscreen: true })
    const { records, total } = await queryBankList({ pageIndex: 1, pageSize: 1000 })
    bankLists.value = records
    loading.close()
    loading = null
  }
}
function clickAddCard() {
  showAddCard.value = true
}
function clickBoxConfirm() {
  showBox.value = false
}
function clickConfirmAdd() {
  // showBox.value = true
  // boxIs.value = 'repeatAdd'
  queryBankList()
}
async function checkBindStatus(params) {
  let loading = ElLoading.service({ fullscreen: true })
  const { has, orderNo } = await queryBankHasOrder(params)
  loading.close()
  loading = null
  if (has === 1) {
    showBox.value = true
    // 发请求判断当前银行卡被绑定的状态
    boxIs.value = 'delInBuy'
    return true
  }
}
async function deleteBankCardFn(params) {
  let loading = ElLoading.service({ fullscreen: true })
  const data = await deleteBankCard(params)
  loading.close()
  loading = null
  return data
}
async function clickDelIcon(cardId) {
  console.log('==clickDelIcon==', cardId)
  // const hasBindSell = await checkBindStatus({ cardId })
  // if (hasBindSell) return
  const data = await deleteBankCardFn({ cardId })
  if (!data) {
    queryList(true)
  }
}
function clickConnectWallet() {
  store.dispatch('connectWallet')
}
</script>

<template>
  <div class="collect-manage">
    <add-bank-card v-model="showAddCard" @confirmAddBank="clickConfirmAdd"></add-bank-card>
    <confirm-box v-model="showBox" v-bind="boxContent" @clickConfirm="clickBoxConfirm"></confirm-box>
    <p class="head">{{ $t('message.CollectManage') }}</p>
    <div class="main" v-if="!bankLists.length">
      <div class="empty">
        <img class="empty-icon" src="@/assets/imgs/no-record.png" alt="empty-icon" />
        <template v-if="$store.getters.addressAndChainIdReady">
          <span class="no-card">暂无银行卡</span>
          <span class="add-card" @click="clickAddCard">添加银行卡</span>
        </template>
        <template v-else>
          <span class="no-card">请连接钱包</span>
          <span class="add-card" @click="clickConnectWallet">连接钱包</span>
        </template>
      </div>
    </div>
    <div class="content" v-else>
      <div
        class="list-item card-item"
        v-for="(item, index) in bankLists"
        :key="index"
        :class="{ 'no-r-p': ((index + 1) % 3) === 0 }"
      >
        <img class="right-bottom-icon" :src="item.icon" alt="right-bottom-icon" />
        <div class="card-first">
          <p class="first-left">
            <img class="card-icon" :src="item.icon" alt="zhaoshang-icon" />
            <span class="card-no">{{ item.cardNo }}</span>
          </p>
          <!-- <span class="card-ellipsis">...</span> -->
          <img
            class="close-icon"
            src="@/assets/imgs/close-icon.png"
            alt="close-icon"
            @mouseenter="clickDelIcon(item.bankId)"
          />
        </div>
        <p class="card-last">{{ item.userName }}</p>
      </div>
      <div
        class="list-item add-item"
        :class="{ 'no-r-p': ((bankLists.length + 1) % 3) === 0 }"
        @click="clickAddCard"
      >
        <div class="center-tip">
          <img class="plus-img" src="@/assets/imgs/plus-sign.png" alt="plus-sign" />
          <span class="add-txt">添加银行卡</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="styl" scoped>
.collect-manage {
  margin-top: 40px;
  width: 1200px;
  .head {
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 132%;
    text-align: left;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 40px;
    flex-wrap: wrap;
    .no-r-p {
      margin-right: 0px !important;
    }
    .list-item {
      padding: 28px 24px;
      width: 384px;
      height: 160px;
      border: 1px solid #E6E7F0;
      box-sizing: border-box;
      border-radius: 12px;
      margin-right: 24px;
      margin-bottom: 24px;
    }
    .add-item {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .center-tip {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .plus-img {
          width: 18px;
          height: 18px;
        }
        .add-txt {
          margin-top: 15px;
          font-family: 'PingFang SC', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 132%;
          color: #6E798F;
        }
      }
    }
    .card-item {
      background: linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      overflow: hidden;
      .right-bottom-icon {
        width: 90px;
        height: 90px;
        position: absolute;
        right: -8px;
        bottom: -15px;
        opacity: 0.04;
      }
      .card-first {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .close-icon {
          width: 12px;
          height: 12px;
          cursor: pointer;
        }
        .first-left {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          .card-icon {
            width: 32px;
            height: 32px;
          }
          .card-no {
            font-family: 'SF UI Text', sans-serif;
            font-style: normal;
            font-weight: bold;
            font-size: 18px;
            line-height: 32px;
            color: #000000;
            margin-left: 12px;
          }
        }
        .card-ellipsis {
          color: #959DAD;
          font-size: 18px;
          line-height: 1;
          position: relative;
          bottom: 5px;
        }
      }
      .card-last {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 132%;
        color: #3F475A;
      }
    }
  }
  .main {
    width: 100%;
    height: 664px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 100px
      .empty-icon {
        height: 80px;
        width: 80px;
      }
      .no-card {
        font-family: 'SF UI Text', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        text-align: center;
        color: #7B8293;
      }
      .add-card {
        margin-top: 24px;
        width: 102px;
        height: 36px;
        background: #10B488;
        border-radius: 6px;
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 132%;
        text-align: center;
        color: #FFFFFF;
        line-height: 36px;
        cursor: pointer;
      }
    }
  }
}
</style>

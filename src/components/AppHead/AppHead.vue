<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import formatAddress from '@/tools/formatAddress.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useStore()
const { proxy } = getCurrentInstance()
// tab列表
const tabs = [
  { path: '/home', text: 'message.Homepage' },
  { path: '/buy-sell', text: 'message.BuySellCoin' },
  { path: '/invest', text: 'message.Investment' },
  { path: '/my-assets/home', text: 'message.MyAsset' }
]

// 语言
const langs = [
  {
    text: '简体中文',
    lang: 'zh'
  },
  {
    text: 'English',
    lang: 'en'
  }
]

langs.reduce((origin, currentValue, currentIndex) => {
  origin.pos++
  origin.langs.splice(currentIndex + origin.pos, 0, { text: '|' })
  return origin
}, { langs, pos: 0 }).langs.pop()

// 点击tab
const router = useRouter()
// 当前的路由
const currentRoute = useRoute()
// 点击语言
let activedLang = ref('zh')

function selectTab(path) {
  if (path) {
    router.push(path)
  }
}

function selectLang(lang) {
  activedLang.value = lang
  proxy.$i18n.locale = lang
}

// 激活tab
function avtiveTab(item, currentRoute) {
  const { path: itemPath } = item
  const { path: routePath } = currentRoute
  return routePath.includes(itemPath)
}

const arrowDirec = ref(false)
function clickEthWall() {
  arrowDirec.value = !arrowDirec.value
}
function clickConnectWallet() {
  store.dispatch('connectWallet')
}
function clickLogOut() {
  store.commit('logOutWallet')
}
</script>
<template>
  <div class="app-head">
    <div class="left">
      <div class="dotc-txt"></div>
      <ul class="list">
        <li
          class="list-item"
          v-for="(item, index) in tabs"
          :key="index"
          :class="{ 'actived-tab': currentRoute.path.includes(item.path) }"
          @click="selectTab(item.path)"
        >{{ $t(item.text) }}</li>
      </ul>
    </div>
    <ul class="right">
      <el-popover
        v-if="store.getters.currentAccount"
        placement="bottom"
        :width="140"
        trigger="click"
      >
        <template #reference>
          <div class="ethereum-wallet" @click="clickEthWall">
            <img class="eth-icon" src="@/assets/imgs/eth-icon.png" alt="eth-icon" />
            <p class="eth-txts">
              <span class="eth-name">Ethereum</span>
              <span class="eth-address">{{ formatAddress(store.getters.currentAccount) }}</span>
            </p>
            <img
              class="down-arrow"
              :class="{ 'up-arrow': arrowDirec }"
              src="@/assets/imgs/up-down-arrow.png"
              alt="up-down-arrow"
            />
          </div>
        </template>
        <div class="options">
          <!-- <p class="option-row">
            <img
              class="option-row-icon toggle-wallet-icon"
              src="@/assets/imgs/toggle-wallet-icon.png"
              alt="toggle-wallet-icon"
            />
            <span class="option-row-txt togge-wallet-txt">切换钱包</span>
          </p>-->
          <p class="option-row" @click="clickLogOut">
            <img
              class="option-row-icon log-out-icon"
              src="@/assets/imgs/log-out-icon.png"
              alt="log-out-icon"
            />
            <span class="option-row-txt og-out-txt">登出</span>
          </p>
        </div>
      </el-popover>
      <!-- <div v-else class="top-connect-wallet" @click="clickConnectWallet" id="connect-wallet">{{ $t('message.ConnectWallet') }}</div> -->
      <div
        v-else
        class="top-connect-wallet"
        @click="clickConnectWallet"
        id="connect-wallet"
      >{{ $t(`message.Homepage`) }}</div>
      <template v-for="(item, index) in langs" :key="index">
        <li
          v-if="item.lang"
          class="right-item"
          @click="selectLang(item.lang)"
          :class="{ 'actived-lang': activedLang === item.lang }"
        >{{ item.text }}</li>
        <li v-else class="right-item">{{ item.text }}</li>
      </template>
    </ul>
  </div>
</template>
<style lang="styl" scoped>
@import '../../assets/css/common.styl';
.app-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 25px 0px;
  border-bottom: 1px solid #F0F3F7;

  .left {
    display: flex;
    flex-direction: row;

    .dotc-txt {
      background-set('../../assets/imgs/dotc-logo.png', center, center, 110px, 30px);
      margin-right: 17px;
      width: 110px;
      height: 30px;
    }

    .list {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 136%;
      mix-blend-mode: normal;
      opacity: 0.85;
      color: #1F2933;

      .list-item {
        margin: 0px 14px;
        cursor: pointer;
      }
      .actived-tab {
        color: #10B488;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    .top-connect-wallet {
      width: 88px;
      height: 36px;
      background: #10B488;
      border-radius: 6px;
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 36px;
      text-align: center;
      color: #FFFFFF;
      cursor: pointer;
      margin-right: 12px;
    }
    .ethereum-wallet {
      width: 140px;
      height: 34px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 0px 17px;
      cursor: pointer;
      .eth-icon {
        width: 28px;
        height: 28px;
      }
      .eth-txts {
        width: 80px;
        height: 34px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        margin-left: 8px;
        .eth-name {
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 132%;
          text-align: justify;
          color: #1F2933;
          mix-blend-mode: normal;
          opacity: 0.85;
        }
        .eth-address {
          font-family: 'SF UI Text', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 132%;
          display: flex;
          align-items: center;
          text-align: center;
          color: #959DAD;
        }
      }
      .down-arrow {
        transition: transform 0.4s;
        width: 12px;
        height: 6px;
        will-change: transform;
        transform: rotateZ(0);
      }
      .up-arrow {
        transform: rotateZ(180deg);
      }
    }

    .right-item {
      margin: 0 12px;
      color: #959DAD;
      cursor: pointer;
      font-size: 14px;
    }
    .actived-lang {
      color: #3F475A;
    }
  }
}
</style>

<style lang="styl">
.options {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  padding: 8px 0px;
  /* height: 88px; */
  .option-row {
    padding: 0px 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 44px;
    width: 100%;
    cursor: pointer;
    .option-row-icon {
      width: 19px;
      height: 19px;
    }
    .option-row-txt {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 132%;
      color: #1F2933;
      margin-left: 11px;
    }
  }
  .option-row:hover {
    background: #F7F9FC;
  }
}

.el-popover.el-popper {
  padding: 0px 0px !important;
  width: 170px;
  /* height: 104px; */
  background: #FFFFFF;
  box-shadow: 0px 12px 60px rgba(14, 32, 66, 0.15), 0px 1px 2px rgba(14, 32, 66, 0.05);
  border-radius: 4px;
}

.el-popover[data-popper-placement="bottom"] {
  .el-popper__arrow {
    display: none;
  }
}
</style>

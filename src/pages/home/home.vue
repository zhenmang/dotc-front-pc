<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// defineProps({
//   msg: String
// })

const count = ref(0)
const router = useRouter()
function startOTC() {
  router.push('/buy-sell')
}

onMounted(() => {
  const appEl = document.body.querySelector('#app')
  appEl.querySelector('.home-bottom').style.width = appEl.querySelector('.inner-container').style.width
})
</script>

<template>
  <div class="home-page">
    <div class="big-intro">
      <p class="dotc-title">REEX</p>
      <p class="dotc-platform">{{ $t('message.REEXTitle') }}</p>
      <p class="dotc-remark">{{ $t('message.REEXDesc') }}</p>
      <div class="start-btn" @click="startOTC">{{ $t('message.TradeTitle') }}</div>
    </div>
    <div class="cooperative-partner">
      <p class="partner-title">{{ $t('message.TradeDesc') }}</p>
      <img class="partner-logos" src="@/assets/imgs/partner-logo.png" alt="partner-log" />
    </div>
    <div class="content-section">
      <div class="content-section-txts">
        <p class="content-section-title">{{ $t('message.OnChainTradeTitle') }}</p>
        <p class="content-section-desc">{{ $t('message.OnChainTradeDesc') }}</p>
        <!-- <ul class="content-section-ul">
          <li class="content-section-li">Fully organized UI components</li>
          <li class="content-section-li">License to use on multiple projects</li>
          <li class="content-section-li">Clean, Minimal & Modern Design</li>
        </ul>-->
      </div>
      <div class="content-section-img remove-img"></div>
    </div>
    <div class="content-section">
      <div class="content-section-img order-trade-img"></div>
      <div class="content-section-txts">
        <p class="content-section-title">{{ $t('message.HundredPayout') }}</p>
        <p class="content-section-desc">{{ $t('message.HundredDesc') }}</p>
        <!-- <ul class="content-section-ul">
          <li class="content-section-li">Fully organized UI components</li>
          <li class="content-section-li">License to use on multiple projects</li>
          <li class="content-section-li">Clean, Minimal & Modern Design</li>
        </ul>-->
      </div>
    </div>
    <div class="content-section">
      <div class="content-section-txts">
        <p class="content-section-title">{{ $t('message.ImmediateTrans') }}</p>
        <p class="content-section-desc">{{ $t('message.ImmediateDesc') }}</p>
        <!-- <ul class="content-section-ul">
          <li class="content-section-li">Fully organized UI components</li>
          <li class="content-section-li">License to use on multiple projects</li>
          <li class="content-section-li">Clean, Minimal & Modern Design</li>
        </ul>-->
      </div>
      <div class="content-section-img compensation-img"></div>
    </div>
    <teleport to="#app">
      <div class="home-footer">
        <p class="home-footer-title">{{ $t('message.TradeOnREEX') }}</p>
        <p class="home-footer-desc">{{ $t('message.TradeOnREEXDesc') }}</p>
        <p class="home-footer-btn" @click="startOTC">{{ $t('message.TradeTitle') }}</p>
      </div>
      <div class="home-bottom">
        <div class="home-bottom-left">
          <p class="home-bottom-logo"></p>
          <p class="home-bottom-copyright">© 2020 Landify UI Kit. All rights reserved</p>
        </div>
        <ul class="home-bottom-txts">
          <li class="home-bottom-txt">白皮书</li>
          <li class="home-bottom-txt">使用指南</li>
          <li class="home-bottom-txt">费用说明</li>
          <li class="home-bottom-txt">{{ $t('message.FAQ') }}</li>
        </ul>
      </div>
    </teleport>
  </div>
</template>

<style scoped lang="styl">
@import '../../assets/css/common.styl';
.home-page {
  position: relative;
  width: 100%;
  padding: 140px 100px 50px 100px;
  box-sizing: border-box;
  .content-section {
    margin-top: 180px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .content-section-img {
      width: 340px;
      height: 327px;
    }
    .remove-img {
      background-set('../../assets/imgs/remove-center-img.png', center, center, 100%, 100%);
    }
    .order-trade-img {
      background-set('../../assets/imgs/order-is-trade-img.png', center, center, 100%, 100%);
    }
    .compensation-img {
      background-set('../../assets/imgs/compensation-img.png', center, center, 100%, 100%);     
    }
    .content-section-txts {
      text-align: left;
      .content-section-title {
        font-family: 'PingFang SC', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        color: #1F2933;
        line-height: 1.4;
      }
      .content-section-desc {
        font-family: Montserrat sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 28px;
        color: #959DAD;
      }
      .content-section-ul {
        margin-top: 33px;
        .content-section-li {
          font-family: Inter, sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 24px;
          font-feature-settings: 'salt' on, 'liga' off;
          color: #1F2933;
          padding-left: 33px;
          background-set('../../assets/imgs/right-icon.png', left, center, 16px, 16px);
        }
      }
    }
  }
  .cooperative-partner {
    margin-top: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .partner-logos {
      width: 896px;
    }
    .partner-title {
      font-family: 'PingFang SC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      font-feature-settings: 'salt' on, 'liga' off;
      color: #AAB1BF;
      margin-bottom: 40px;
    }
  }
  .big-intro {
    text-align: left;
    .dotc-title {
      font-family: Montserrat;
      font-style: normal;
      font-weight: bold;
      font-size: 80px;
      line-height: 136%;
      color: #10B488;
    }
    .dotc-platform {
      font-family: PingFang SC, sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 44px;
      line-height: 132%;
    }
    .dotc-remark {
      font-family: Montserrat, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 132%;
      color: #1F2933;
      opacity: 0.4;
      margin-top: 16px;
    }
    .start-btn {
      text-align: center;
      line-height: 56px;
      width: 200px;
      height: 56px;
      background: #1F2933;
      border-radius: 6px;
      font-family: PingFang SC, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      color: #FFFFFF;
      margin-top: 48px;
      cursor: pointer;
    }
  }
}
.home-footer {
  margin-top: 140px;
  width: 100%;
  height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(94.84deg, #10B488 0%, rgba(16, 180, 136, 0.75) 100.38%);
  .home-footer-title {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 600;
    font-size: 40px;
    font-feature-settings: 'salt' on, 'liga' off;
    color: #FFFFFF;
    margin-bottom: 12px;
    line-height:1.32;
  }
  .home-footer-desc {
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height:1.32;
    font-feature-settings: 'salt' on, 'liga' off;
    color: #FFFFFF;
  }
  .home-footer-btn {
    margin-top: 48px;
    background: #FFFFFF;
    border-radius: 6px;
    padding: 14px 36px;
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #10B488;
    cursor: pointer;
  }
}
.home-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 196px;
  .home-bottom-left {
    .home-bottom-logo {
      width: 104px;
      height: 28px;
      background-set('../../assets/imgs/dotc-logo.png', left, center, 100%, 100%);
    }
    .home-bottom-copyright {
      text-align: left;
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 24px;
      font-feature-settings: 'salt' on, 'liga' off;
      color: #959DAD;
    }
  }
  .home-bottom-txts {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: 'PingFang SC', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 136%;
    color: #1F2933;
    mix-blend-mode: normal;
    opacity: 0.85;
    .home-bottom-txt {
      margin-left: 28px;
    }
  }
}
</style>


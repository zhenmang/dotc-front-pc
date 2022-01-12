<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'
import AppHead from '@/components/AppHead/AppHead.vue';
import { watchPostEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import WalletContract from '@/components/WalletContract/WalletContract.vue'
const route = useRoute();
watchPostEffect(() => {
  if (route.path === '/home') {
    const app = document.body.querySelector('#app')
    app.classList.add('home-bg')
  } else {
    app.classList.remove('home-bg')
  }
});
onMounted(() => {
  const innerContainer = document.body.querySelector('#app').querySelector('.inner-container')
  const docEl = window.document.documentElement
  const rect = docEl.getBoundingClientRect()
  const isMob = /Mobi/.test(navigator.userAgent);
  let width = isMob ? rect.width : (docEl.clientWidth || body.clientWidth)
  if (width > 1200) {
    width = 1200;
  }
  innerContainer.style.width = width + 'px';
  const homeBottom = document.body.querySelector('#app').querySelector('.home-footer')
  if (homeBottom) {
    homeBottom.style.width = width + 'px';
  }
})
</script>

<template>
  <div class="inner-container">
    <wallet-contract></wallet-contract>
    <app-head></app-head>
    <router-view></router-view>
  </div>
</template>

<style lang="styl">
@import './assets/css/common.styl'
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  .inner-container {
    position: relative;
  }
}
.home-bg {
  background-set('./assets/imgs/home-bg.png', center, top, 100%, auto);
}
:root {
  background: #10b488;
  --el-color-primary: #10b488;
}
</style>

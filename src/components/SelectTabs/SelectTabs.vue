<script setup>
import { ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({
  tabs: {
    type: Array,
    required: true,
    default() {
      return []
    }
  },
  fixTab: {
    type: Number,
    required: false,
    default: 0
  }
})
const route = useRoute()
const router = useRouter()
const updateListStep = inject('updateListStep')

function clickTab(item) {
  router.push(item.path)
  updateListStep(1)
}
</script>

<template>
  <ul class="tabs-ul">
    <li
      class="tabs-li"
      v-for="(item, index) in tabs"
      :key="index"
      @click="clickTab(item)"
      :class="{ 'active-tab': fixTab && fixTab === (index + 1) || route.path.includes(item.acPath) }"
    >{{ $t(item.text) }}</li>
  </ul>
</template>

<style scoped lang="styl">
.tabs-ul {
  background: #F0F3F7;
  /* width: 212px; */
  width: 220px;
  height: 36px;
  padding: 2px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'SF UI Text', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 132%;
  color: #1F2933;
  background-color:#F0F3F7;
  border-radius: 6px;

  .tabs-li {
    flex: 1;
    background-color:#F0F3F7;
    line-height:36px;
    cursor: pointer;
    border-radius: 4px;
  }
  .active-tab {
    background-color: white;
  }
}
</style>

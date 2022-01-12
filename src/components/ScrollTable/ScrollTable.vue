<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const emit = defineEmits(['moreData'])
const timer = ref(null)
const ele = ref(null)
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// const elInfo = ref({ el: null, scrollHeight: 0, height: 0, scrollTop: 0 })
onMounted(() => {
  ele.value = document.querySelector('.seller-product-list-body')
  const height = Number(getComputedStyle(ele.value).height.slice(0, -2))
  let lock = true // 开
  ele.value.onscroll = (e) => {
    if (!lock) return
    const scrollHeight = ele.value.scrollHeight
    const curEle = e.target || e.srcElement
    const scrollTop = curEle.scrollTop
    const diff = scrollHeight - (height + scrollTop) < 15
    if (diff) {
      lock = false
      emit('moreData')
      timer.value = setTimeout(() => {
        lock = true
      }, 2000)
    }
  }
})
onBeforeUnmount(() => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  if (ele.value) {
    ele.value = null
  }
})
</script>
<template>
  <div class="scroll-table">
    <slot></slot>
  </div>
</template>
<style scoped lang="styl">
</style>

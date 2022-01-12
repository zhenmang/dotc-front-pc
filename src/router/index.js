import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes/index.js'
import store from '@/store'
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from) => {
  // store.commit('updateRouteHistory', to)
  console.log('=beforeEach=', to, from)
})

// router.beforeRouteEnter(to, from, next) {
//   this.fromPage = from
//   console.log(from)
//   next()
// }

export default router

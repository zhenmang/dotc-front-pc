import { createStore } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state from './state.js'

export default createStore({
  state,
  getters,
  mutations,
  actions
})

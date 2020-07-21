import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import modules from './modules'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  getters,
  plugins: [
    createPersistedState(), // save the state to AppData path with json format
    // createSharedMutations() // used for main process to operation mutation in renders process
  ],
  strict: process.env.NODE_ENV !== 'production'
})

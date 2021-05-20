import Vue from 'vue'
import Vuex from 'vuex'

import WebSocketClient from '@/utils/websocket'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ws: null,
    num: 0,
    token: localStorage.getItem('token') || '',
  },
  mutations: {

    initWebSocket (state, config) {
          state.ws = new WebSocketClient(config)
          state.ws.init()
    },
     setMessage (state, value) {
      state.num = value
    },
     setToken (state, value) {
      state.token = value
      localStorage.setItem('token', value)
    },

  },
  actions: {
     message ({ commit }, msg) {
      commit('setMessage', msg)
    }
  }
})

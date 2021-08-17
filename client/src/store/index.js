import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: {
      isLogin: false,
      isAdmin: false,
      name: ''
    }
  },
  getters: {
    getUserInfo(state) {
      return state.user;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    setUser(context, user) {
      context.commit('setUser', user);
    }
  }
});

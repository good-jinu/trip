import Vue from 'vue';
import Vuex from 'vuex';
import {
  fetchPlaceList,
  // fetchPlace
} from '../api/index.js'
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: {
      isLogin: false,
      isAdmin: false,
      name: ''
    },
    place: []
  },
  getters: {
    getUserInfo(state) {
      return state.user;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
		initUser(state) {
			state.user = {
				isLogin: false,
				isAdmin: false,
				name: ''
			}
		},
    SET_PLACE(state, place) {
      state.place = place;
    }
  },
  actions: {
    setUser(context, user) {
      context.commit('setUser', user);
    },
    FETCH_PLACE() {
      fetchPlaceList()
        .then(response => {
          console.log(response);
          // commit("SET_PLACE", data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
});
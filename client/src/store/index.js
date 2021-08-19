import Vue from 'vue';
import Vuex from 'vuex';
import { fetchCity, fetchPlace } from "../api/index.js";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: {
      isLogin: false,
      isAdmin: false,
      name: "",
    },
    city: {},
    place: {},
  },
  getters: {
    getUserInfo(state) {
      return state.user;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    SET_CITY(state, city) {
      state.city = city;
    },
    SET_PLACE(state, place) {
      state.place = place;
    },
  },
  actions: {
    setUser(context, user) {
      context.commit("setUser", user);
    },
    FETCH_CITY(context) {
      fetchCity()
        .then((response) => {
          context.commit("SET_CITY", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    FETCH_PLACE(context, name) {
      fetchPlace(name)
        .then((response) => {
          context.commit("SET_PLACE", response.data);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  },
});

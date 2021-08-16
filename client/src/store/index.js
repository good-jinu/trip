import Vue from 'vue';
import Vuex from 'vuex';
import {
  fetchPlaceList,
  fetchPlace
} from "../api/index.js";
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: {
      isLogin: false,
      isAdmin: false,
      name: "",
    },
    places: {},
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
    initUser(state) {
      state.user = {
        isLogin: false,
        isAdmin: false,
        name: "",
      };
    },
    SET_PLACES(state, places) {
      state.places = places;
    },
    SET_PLACE(state, place) {
      state.place = place;
    },
  },
  actions: {
    setUser(context, user) {
      context.commit("setUser", user);
    },
    FETCH_PLACES(context) {
      fetchPlaceList()
        .then((response) => {
          context.commit("SET_PLACES", response.data);
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
        });
    },
  },
});
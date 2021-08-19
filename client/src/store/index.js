import Vue from 'vue';
import Vuex from 'vuex';
import { fetchPlace, fetchAttraction } from "../api/index.js";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: {
      isLogin: false,
      isAdmin: false,
      name: "",
    },
    place: {},
    attraction: [],
    schedule: [],
  },
  getters: {
    getUserInfo(state) {
      return state.user;
    },
    // getAttractionInfo(state) {
    //   return state.attraction;
    // }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    SET_PLACE(state, place) {
      state.place = place;
    },
    SET_ATTRACTION(state, attraction) {
      state.attraction = attraction;
    },
    SET_SCHEDULE(state, obj) {
      function addProperty(key) {
        try {
          obj[key] = state.attraction.find((x) => x.attraction == obj.attraction)[key];
        } catch (error) {
          obj[key] = "";
        }
      }
      addProperty("imageSrc")
      addProperty("imageCopyright");
      addProperty("description");

      let arr = {
        date: obj.startDateTime.slice(5, 10),
        data: [
          {
            place: obj.place,
            attraction: obj.attraction,
            description: obj.description,
            startDateTime: new Date(obj.startDateTime),
            startTime: obj.startDateTime.slice(11),
            endTime: obj.endDateTime.slice(11),
            imageSrc: obj.imageSrc,
            imageCopyright: obj.imageCopyright,
          },
        ],
      };
      let schedule = state.schedule;
      let indexNum = schedule.findIndex((item) => item.date == arr.date);

      if (indexNum === -1) {
        schedule.push(arr);
      } else {
        schedule[indexNum].data.push(arr.data[0]);
      }

      schedule.sort((a, b) => {
        return a.data[0].startDateTime - b.data[0].startDateTime;
      });

      for (let i = 0; i < schedule.length; i++) {
        schedule[i].data.sort((a, b) => {
          return a.startDateTime - b.startDateTime;
        });
      }
    },
  },
  actions: {
    setUser(context, user) {
      context.commit("setUser", user);
    },
    FETCH_PLACE(context) {
      fetchPlace()
        .then((response) => {
          context.commit("SET_PLACE", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    FETCH_ATTRACTION(context, name) {
      fetchAttraction(name)
        .then((response) => {
          context.commit("SET_ATTRACTION", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // REGISTER_SCHDULE() {

    // }
  },
});

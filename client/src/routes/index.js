import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import To from '../views/To.vue';
import Edit from '../views/Edit.vue';
import Schedule from "../views/Schedule.vue";

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/to/:place",
      component: To,
    },
    {
      path: "/edit",
      component: Edit,
    },
    {
      path: "/schedule",
      component: Schedule,
    },
  ],
});

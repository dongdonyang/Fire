import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import api from "./plugins/api.js";
import axios from "./plugins/axios.js";
import echarts from "echarts";
import Cookies from "js-cookie";
import "./plugins/BaseComponent"; // 引入全局注册组件

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$cookies = Cookies;

//todo 获取用户信息、然后存在vuex中、以供全局使用、目前根据session中的数据来判断有没有登录的，因为cookie后端设置前端获取不到
// todo 跳过登录
if (Cookies.get("userInfo")) {
  let info = JSON.parse(Cookies.get("userInfo"));
  let tok = Cookies.get("isLogin");
  console.log("token信息：", tok);
  console.log("用户信息：", info);
  store.commit("setUserInfo", info, tok);
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

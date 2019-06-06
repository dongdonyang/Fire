import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import api from "./plugins/api.js";
import axios from "./plugins/axios.js";
import Cookies from "js-cookie";
import "./plugins/BaseComponent"; // 引入全局注册组件

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;

//todo 获取用户信息、然后存在vuex中、以供全局使用、目前根据session中的数据来判断有没有登录的，因为cookie后端设置前端获取不到
// todo 跳过登录
// sessionStorage.setItem(
//   "userInfo",
//   JSON.stringify({
//     userId: "1",
//     deptName: "默认用户"
//   })
// );
let info = JSON.parse(sessionStorage.getItem("userInfo"));
let tok = Cookies.get("UM_distinctid");
console.log("token信息：", tok);
console.log("用户信息：", info);
store.commit("setUserInfo", info, tok);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

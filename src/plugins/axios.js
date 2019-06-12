import axios from "axios";
import { Message } from "element-ui";
import store from "../store";
import NProgress from "nprogress"; // 顶部进度条
import "nprogress/nprogress.css";

// axios.defaults.baseURL = "http://47.98.179.238:5080";
// axios.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded;charset=UTF-8";
const service = axios.create({
  timeout: 30000
});

service.interceptors.request.use(
  function(config) {
    NProgress.start();
    let value = config.params;
    if (value) {
      // config.headers["Cookie"] = store.state.token;
      value.UserId = store.state.userInfo.userId; // 给所有请求加上用户id
      //  todo 删除对象中为空的属性，以防接口报错
      if (value instanceof Object) {
        for (let item in value) {
          if (value[item] === "") {
            delete value[item];
          }
        }
      }
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function(response) {
    NProgress.done();
    return Promise.resolve(response.data);
  },
  function(error) {
    NProgress.done();
    //  todo 打印错误
    if (error.response) {
      Message.error(JSON.stringify(error.response.data.error));
    }
    return Promise.reject(error);
  }
);

export default service;

import Vue from "vue";
import Router from "vue-router";
import Login from "./views/login/Index";
import store from "./store";
import { Message } from "element-ui";
import Cookies from "js-cookie";

Vue.use(Router);

const router = new Router({
  routes: [
    // todo 登录界面
    {
      path: "/",
      name: "login",
      component: Login
    },
    //  todo 内容index
    {
      path: "/home",
      name: "home",
      redirect: { name: "UnitList" }, // 重定向
      component: () => import("./views/home/index"),
      children: [
        //  todo 防火单位
        {
          //  地图展示
          path: "UnitMap",
          name: "UnitMap",
          component: () => import("./views/home/UnitMap")
        },
        {
          //  单位列表
          path: "UnitList",
          name: "UnitList",
          component: () => import("./views/home/UnitList")
        },
        {
          //  监督检查
          path: "UnitInspect",
          name: "UnitInspect",
          component: () => import("./views/home/UnitInspect")
        },
        {
          //  火灾报警监控
          path: "UnitAlarm",
          name: "UnitAlarm",
          component: () => import("./views/home/UnitAlarm")
        },
        {
          //  安全用电监控
          path: "UnitElectricity",
          name: "UnitElectricity",
          component: () => import("./views/home/UnitElectricity")
        },
        {
          //  设施故障监控
          path: "UnitFault",
          name: "UnitFault",
          component: () => import("./views/home/UnitFault")
        },
        {
          //  值班巡逻监控
          path: "UnitPatrol",
          name: "UnitPatrol",
          component: () => import("./views/home/UnitPatrol")
        },
        //  todo 消防维保
        //   消防维保列表
        {
          path: "RepairList",
          name: "RepairList",
          component: () => import("./views/home/RepairList")
        },
        //  todo 街道网络
        //  网格列表
        {
          path: "StreetGridList",
          name: "StreetGridList",
          component: () => import("./views/home/StreetGridList")
        },
        //  事件列表
        {
          path: "StreetEventList",
          name: "StreetEventList",
          component: () => import("./views/home/StreetEventList")
        },
        //  todo 微型消防站
        //  微型消防站列表
        {
          path: "FirehouseList",
          name: "FirehouseList",
          component: () => import("./views/home/FirehouseList")
        },
        //  微型消防站地图
        {
          path: "FirehouseMap",
          name: "FirehouseMap",
          component: () => import("./views/home/FirehouseMap")
        },
        //  todo 市政消火栓
        //  消火栓列表
        {
          path: "GovernHydrant",
          name: "GovernHydrant",
          component: () => import("./views/home/GovernHydrant")
        },
        //  消火栓地图
        {
          path: "GovernMap",
          name: "GovernMap",
          component: () => import("./views/home/GovernMap")
        }
      ]
    },
    {
      path: "/404",
      name: "404",
      component: () => import(/* webpackChunkName: "404" */ "./views/404.vue")
    },
    {
      path: "*", // 此处需特别注意至于最底部
      redirect: "/404"
    }
  ]
});
// todo 登录判定
router.beforeEach(function(to, from, next) {
  if (Cookies.get("isLogin")) {
    //表示登陆状态
    console.log(from, to);
    if (to.name === "login") {
      next("/home");
      // Message.info("你已登录、请勿重复登录！");
    } else {
      next();
    }
  } else {
    if (to.name !== "login") {
      next("/");
    } else {
      next(); //放行了,不能少，否则不会执行跳转
    }
  }
});
export default router;

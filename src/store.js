import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import API from "./plugins/api";

Vue.use(Vuex);

export default new Vuex.Store({
  // todo this.$store.state.name;
  state: {
    userInfo: {}, // 用户登录信息
    token: 0 // 保存的登录token信息
  },
  // todo this.$store.commit("increment")
  mutations: {
    // 设置用户信息
    setUserInfo(state, payload = {}, token = 0) {
      state.userInfo = payload ? payload : {};
      state.token = token;
    }
  },
  // todo this.$store.dispatch("increment")
  actions: {
    //  todo 导出EXCEL、IE浏览器不兼容改方法
    exportFile(context, apiName) {
      // 下载名称的替换、应该把这些替换放在router的定义中，统一放置。
      const fileName = {
        GET_SUPERVISION_LIST_EXCEL: "监督执法",
        GET_SAFE_UNITS_EXCEL: "消防维保",
        GET_STREET_GRID_EXCEL: "街道网格",
        GET_STREET_EVENT_EXCEL: "街道事件",
        GET_HYDRANT_EXCEL: "消火栓",
        GET_FIRE_UNIT_LIST_EXCEL: "防火单位",
        GET_FIREALARM_LIST_EXCEL: "火灾报警监控",
        GET_TEMP_ALARMLIST_EXCEL: "安全用电监控电缆温度",
        GET_ELEC_ALARMLIST_EXCEL: "安全用电监控剩余电流",
        GET_FAULTLIST_EXCEL: "设备设施故障监控",
        GET_STATION_EXCEL: "微型消防站"
      };
      axios
        .get(API[apiName], {
          responseType: "blob"
        })
        .then(res => {
          let url = window.URL.createObjectURL(res.data);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            `城市智慧消防安全用电系统${fileName[apiName]}列表.xlsx`
          );
          document.body.appendChild(link);
          link.click();
        });
    },
    //    todo 获取当前位置
    getCurrentPosition() {
      let mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function() {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete); //返回定位信息
        AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
      });
      function onComplete(status, result) {
        console.log(status, result);
        return status;
      }
      function onError(status, result) {
        console.log(status, result);
      }
    },
    //  todo 经纬度=》具体位置、使用的事web服务、返回一个promise对象、方便使用
    getPositionName(context, place) {
      let url = `http://restapi.amap.com/v3/geocode/regeo?key=e86bd3cdfc91ca7a46c44ddf62e1d80f&location=${
        place.lng
      },${place.lat}`;
      return axios.get(url);
    }
  }
});

<template>
  <div class="base-map">
    <div>
      <el-autocomplete
        style="width: 80%"
        size="small"
        v-model="keyWord"
        :fetch-suggestions="searchKey"
        @select="handleSelect"
        placeholder="请输入地址信息"
      ></el-autocomplete>
      <el-button style="float: right" size="small" @click="savePositon"
        >确定</el-button
      >
    </div>
    <div id="panel"></div>
    <div style="height:500px" id="container"></div>
  </div>
</template>

<script>
// Todo VUE代码风格、拒绝硬编码！
/**
 *  作者：                                             时间：
 *  1,常量从js文件引入，不要定义魔术变量
 *  2,超过两次使用的方法定义为公共方法，import导入
 *  3,不涉及修改vuex中state中的值时候，不要在action中写方法
 *  4,css字体公用颜色，样式从文件中导入，个性化样式写在组件内
 *  5,定义全局标量来保存很多地方都要使用的值
 *  6,事先定义好基础的公共组件，全局注册
 */
// import AMap from "AMap";
export default {
  name: "BaseMap",
  // Todo: 组件注册
  components: {},
  // Todo: 特性
  props: {},
  // Todo: 双向绑定的数据
  data() {
    return {
      position: {},
      keyWord: "",
      mapObject: Object
    };
  },
  // Todo: 计算属性
  computed: {},
  // Todo: 数据监听
  watch: {},
  // Todo: HTML 渲染前
  created: function() {},
  // Todo: HTML渲染后
  mounted: function() {
    this.getPosition();
  },
  // Todo: 方法
  methods: {
    // todo 返回位置具体信息
    savePositon() {
      this.$emit(
        "setPosition",
        this.position.name ? this.position : this.keyWord
      );
    },
    // todo 下拉选择的值
    handleSelect(val) {
      let that = this;
      console.log("选择的值", val);
      AMap.service("AMap.PlaceSearch", function() {
        let placeSearch = new AMap.PlaceSearch({
          pageSize: 5, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: "成都", // 兴趣点城市
          citylimit: true, //是否强制限制在设置的城市内搜索
          map: that.mapObject, // 展现结果的地图实例
          panel: "panel", // 结果列表将在此容器中进行展示。
          autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //todo 查询附件的点
        placeSearch.search(val.name, function(status, result) {
          console.log("placeSearch.search", status, result);
        });
        //  todo 事件监听、地图的点选中时
        AMap.event.addListener(placeSearch, "selectChanged", select);
        function select(val) {
          console.log("选中PLO", val);
          that.position = val.selected.data;
          that.keyWord = that.position.name;
        }
      });
    },
    // todo 位置搜索
    searchKey(keyword, cb) {
      console.log("关键字", keyword);
      if (keyword) {
        setTimeout(() => {
          AMap.plugin("AMap.Autocomplete", function() {
            // 实例化Autocomplete
            let autoOptions = {
              //city 限定城市，默认全国
              city: "成都"
            };
            let autoComplete = new AMap.Autocomplete(autoOptions);
            autoComplete.search(keyword, function(status, result) {
              console.log("关键字查询的结果", status, result);
              if (result.tips) {
                for (let item of result.tips) {
                  item.value = item.name;
                }
                cb(result.tips);
              } else {
                cb([]);
              }
            });
          });
        }, 500);
      }
    },
    // todo 获取当前位置
    getPosition() {
      let that = this;
      let mapObj = new AMap.Map("container");
      that.mapObject = mapObj;
      mapObj.plugin("AMap.Geolocation", function() {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "RB", //定位按钮停靠位置，默认：'LB'，左下角
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
        console.log("位置信息", status, result);
      }
      function onError(status, result) {
        console.log(status, result);
      }
    }
  }
};
</script>
<style lang="scss">
.base-map {
  & > :first-child {
    margin-bottom: 10px;
  }
}
#panel {
  z-index: 10;
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 111px;
  left: -250px;
  width: 275px;
}
</style>

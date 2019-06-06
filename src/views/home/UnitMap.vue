<template>
  <div class="unit-map">
    <div id="container"></div>
    <div>
      <div>单位名称</div>
      <div>互联网单位类型分布</div>
    </div>
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
export default {
  name: "UnitMap",
  // Todo: 组件注册
  components: {},
  // Todo: 特性
  props: {},
  // Todo: 双向绑定的数据
  data() {
    return {};
  },
  // Todo: 计算属性
  computed: {},
  // Todo: 数据监听
  watch: {},
  // Todo: HTML 渲染前
  created: function() {},
  // Todo: HTML渲染后
  mounted: function() {
    this.newMap();
  },
  // Todo: 方法
  methods: {
    // todo 初始化地图
    newMap() {
      let map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11, //初始化地图层级
        mapStyle: "amap://styles/darkblue"
      });
    }
  }
};
</script>

<style lang="scss">
.unit-map {
  display: flex;
  & > :first-child {
    flex: 5 0 auto;
    border: 2px solid red;
    margin-right: 5px;
  }
  & > :last-child {
    flex: 1 0 auto;
    & > :first-child,
    & > :last-child {
      border: 2px solid red;
      box-sizing: border-box;
      min-height: 50%;
      padding: 15px;
    }
  }
}
</style>

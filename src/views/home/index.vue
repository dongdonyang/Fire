<template>
  <!--    element自带滚动条-->
  <el-scrollbar>
    <div class="index">
      <base-header></base-header>
      <el-container class="index-content">
        <!--      todo 左边菜单栏-->
        <el-aside class="index-aside">
          <base-aside></base-aside>
        </el-aside>
        <router-view></router-view>
      </el-container>
      <!--    todo 尾部-->
      <base-footer></base-footer>
    </div>
  </el-scrollbar>
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
import BaseHeader from "../../components/BaseHeader";
import BaseFooter from "../../components/BaseFooter";
import BaseAside from "../../components/BaseAside";
export default {
  name: "index",
  // Todo: 组件注册
  components: {
    BaseHeader,
    BaseFooter,
    BaseAside
  },
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
  mounted: function() {},
  // Todo: 方法
  methods: {}
};
</script>
<style lang="scss">
/*  todo
     flex
   属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto
 */
.index {
  height: 100vh;
  display: flex;
  flex-direction: column;
  &-content {
    flex: 2 0 auto;
    display: flex;
    & > :last-child {
      margin-left: 10px;
      flex: 2 0 auto;
    }
  }
  &-aside {
    width: 200px !important;
    /*border: 1px solid red;*/
  }
}
</style>

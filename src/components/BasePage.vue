<template>
  <div class="base-page">
    <el-pagination
      background
      :pager-count="5"
      @current-change="currentChange"
      :current-page="propPag.current"
      :page-size="propPag.MaxResultCount"
      layout="total, prev, pager, next"
      prev-text="上一页"
      next-text="下一页"
      :total="propPag.total"
    >
    </el-pagination>
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
  name: "BasePage",
  // Todo: 组件注册
  components: {},
  // Todo: 特性
  props: {
    propPag: {
      required: true,
      type: Object
    }
  },
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
  methods: {
    //    todo 当前页改变
    currentChange(val) {
      console.log(`当前页${val}`);
      let p = this.propPag;
      p.current = val;
      p.SkipCount = (val - 1) * p.MaxResultCount; // todo 分页，需要跳过多少数据进行查询
      this.$emit("currentChange");
    }
  }
};
</script>

<style lang="scss">
@import "../style/app-variables";
.base-page {
  background-color: $table-body;
  text-align: center;
  padding: 5px 0;
  /*todo 总数*/
  .el-pagination__total {
    color: $font-white;
  }
  /*todo 上一下、下一页*/
  .btn-prev,
  .btn-next {
    color: $font-white !important;
    padding: 2px !important;
    background-color: $table-header !important;
  }
  /*  todo 选中时*/
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: $body-back !important;
    border: 1px solid $table-header;
  }
  /*  todo 未选中时/展开更多按钮*/
  .number,
  .el-icon,
  .more,
  .btn-quickprev,
  .el-icon-more {
    background-color: $table-header !important;
    color: $font-white !important;
  }
}
</style>

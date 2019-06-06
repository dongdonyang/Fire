<template>
  <div class="grid-list">
    <!--    todo 筛选-->
    <div class="grid-list-header">
      <div>
        <el-input
          clearable
          size="small"
          placeholder="请输入网格名称"
          v-model="page.GridName"
          @change="getList"
        >
          <template slot="append"
            ><i class="el-icon-search"></i
          ></template>
        </el-input>
      </div>
      <div>
        <el-button
          type="text"
          @click="$store.dispatch('exportFile', 'GET_STREET_GRID_EXCEL')"
          ><img src="../../assets/dowload.png" />导出</el-button
        >
      </div>
    </div>

    <!--    todo table列表-->
    <base-table
      :column-list="tableList"
      :table-data="tableData"
      @deleteInfo="deleteInfo"
      @getDetail="getDetail"
    ></base-table>

    <!--      todo 分页-->
    <base-page v-bind:prop-pag.sync="page" @currentChange="getList"></base-page>
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
import BaseTable from "../../components/BaseTable";
import BasePage from "../../components/BasePage";
export default {
  name: "StreetGridList",
  // Todo: 组件注册
  components: {
    BasePage,
    BaseTable
  },
  // Todo: 特性
  props: {},
  // Todo: 双向绑定的数据
  data() {
    return {
      typeOptions: [],
      isDeit: 0, // 0-提交、1-修改、2-保存
      form: {},
      tableData: [],
      tableList: [
        {
          prop: "gridName",
          label: "网格名称"
        },
        {
          prop: "street",
          label: "所属街道"
        },
        {
          prop: "community",
          label: "所属社区"
        },
        {
          prop: "name",
          label: "联系人"
        },
        {
          prop: "phone",
          label: "联系电话"
        }
      ],
      page: {
        MaxResultCount: 10, // 查询当前页面的数量
        total: 0,
        SkipCount: 0, // 跳过的查询的数量
        current: 1 // 当前页面
      }
    };
  },
  // Todo: 计算属性
  computed: {},
  // Todo: 数据监听
  watch: {},
  // Todo: HTML 渲染前
  created: function() {
    this.getList();
  },
  // Todo: HTML渲染后
  mounted: function() {},
  // Todo: 方法
  methods: {
    // todo 修改
    editInfo(val) {
      this.isDeit = val;
    },
    //  todo 获取街道网格list
    getList() {
      this.page.SkipCount = (this.page.current - 1) * this.page.MaxResultCount;
      this.$axios
        .get(this.$api.GET_USER_LIST, {
          params: this.page
        })
        .then(res => {
          if (res.success) {
            this.tableData = res.result.items;
            this.page.total = res.result.totalCount;
          }
        });
    },
    // todo 新增街道网格
    addInfo() {
      this.$refs.BaseDialog.show = true;
      this.$refs.BaseDialog.title = "ADD_UNIT_LIST";
      this.form = {};
      this.isDeit = 0;
    },
    // todo 查看详情
    getDetail(id) {
      this.$axios
        .get(this.$api.GET_FIRE_UNIT_INFO, {
          params: { id }
        })
        .then(res => {
          if (res.success) {
            this.$refs.BaseDialog.show = true;
            this.$refs.BaseDialog.title = "EDIT_UNIT_LIST";
            this.form = res.result;
            this.isDeit = 1;
          }
        });
    },
    //  todo 删除数据
    deleteInfo(val) {
      this.$axios
        .delete(this.$api.DELETE_FIRE_UNIT, {
          params: { id: val.id }
        })
        .then(res => {
          if (res.success) {
            this.$message.success(`删除${val.name}成功`);
            this.page.SkipCount = 1;
            this.getList();
          }
        });
    }
  }
};
</script>

<style lang="scss">
@import "../../style/app-variables";
.grid-list {
  display: flex;
  flex-direction: column;
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    & > :last-child {
      float: right;
    }
    //修改text按钮样式，垂直居中
    .el-button--text {
      span {
        display: flex;
        align-items: center;
      }
    }
  }
  & > :nth-child(2) {
    flex: 2 0 auto;
  }
  &-form {
    .el-form-item {
      padding: 5px 0;
      margin-bottom: 5px;
      border-bottom: 1.2px solid $input-back;
      /*  下拉样式*/
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>

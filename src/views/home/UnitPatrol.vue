<template>
  <el-tabs class="unit-patrol" v-model="tabValue" type="card">
    <el-tab-pane label="巡逻记录" name="first">
      <div class="unit-patrol-tab">
        <!--    todo 筛选-->
        <div class="unit-patrol-header">
          <div>
            <el-input
              clearable
              size="small"
              placeholder="请输入防火单位"
              v-model="page.Name"
              @change="getList"
            >
              <template slot="append"
                ><i class="el-icon-search"></i
              ></template>
            </el-input>
          </div>
          <el-checkbox v-model="checked"
            >超过7天没有巡查的数量：{{ noWork7DayCount }}</el-checkbox
          >
        </div>

        <!--    todo table 列表-->
        <base-table
          :column-list="tableList"
          :table-data="tableData"
        ></base-table>

        <!--    todo 分页-->
        <base-page
          v-bind:prop-pag.sync="page"
          @currentChange="getList"
        ></base-page>

        <!--    todo 弹窗-->
      </div>
    </el-tab-pane>

    <!--    todo -------值班记录值和巡逻记录都写在一个页面中、使用的事一模一样的html------------- -->

    <!--    todo 值班记录-->
    <el-tab-pane label="值班记录" name="second">
      <div class="unit-patrol-tab">
        <!--    todo 筛选-->
        <div class="unit-patrol-header">
          <div>
            <el-input
              clearable
              size="small"
              placeholder="请输入防火单位"
              v-model="page.Name"
              @change="getList"
            >
              <template slot="append"
                ><i class="el-icon-search"></i
              ></template>
            </el-input>
          </div>
          <div>
            <el-checkbox v-model="checked"
              >超过1天没有巡查的数量：{{ noWork7DayCount }}</el-checkbox
            >
          </div>
        </div>

        <!--    todo table 列表-->
        <base-table
          :column-list="tableList"
          :table-data="tableData"
        ></base-table>

        <!--    todo 分页-->
        <base-page
          v-bind:prop-pag.sync="page"
          @currentChange="getList"
        ></base-page>

        <!--    todo 弹窗-->
      </div>
    </el-tab-pane>
  </el-tabs>
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
// todo 路由匹配、tabs、和checkbox不同对应的url不同
const URL_ADDRESS = {
  first: {
    false: "GET_FIRE_UNIT_PATROL_LIST",
    true: "GET_NOPATROL7DAY_LIST"
  },
  second: {
    false: "GET_FIRE_UNIT_DUTY_LIST",
    true: "GET_NODUTY1DAY_LIST"
  }
};
export default {
  name: "UnitPatrol",
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
      checked: false,
      noWork7DayCount: 0,
      tabValue: "first",
      url: "GET_FIRE_UNIT_PATROL_LIST",
      tableData: [],
      tableList: [
        {
          prop: "fireUnitName",
          label: "防火单位"
        },
        {
          prop: "lastTime",
          label: "最近一次提交记录时间"
        },
        {
          width: "200",
          prop: "recent30DayCount",
          label: "最近30天提交记录数"
        }
      ],
      page: {
        MaxResultCount: 20, // 查询当前页面的数量
        total: 0,
        SkipCount: 0, // 跳过的查询的数量
        current: 1 // 当前页面
      }
    };
  },
  // Todo: 计算属性
  computed: {},
  // Todo: 数据监听
  watch: {
    // 监听是否否选7天、1天按钮
    checked: function(value) {
      this.page.current = 1;
      this.url = URL_ADDRESS[this.tabValue][value];
      this.getList();
    },
    // 监听tabs选项
    tabValue: function(value) {
      this.page.current = 1;
      this.url = URL_ADDRESS[value][this.checked];
      this.getList();
    }
  },
  // Todo: HTML 渲染前
  created: function() {
    this.getList();
  },
  // Todo: HTML渲染后
  mounted: function() {},
  // Todo: 方法
  methods: {
    //  todo 获取值班巡逻监控list、超过多少天没有巡查的数量
    getList() {
      this.page.SkipCount = (this.page.current - 1) * this.page.MaxResultCount;
      this.$axios
        .get(this.$api[this.url], {
          params: this.page
        })
        .then(res => {
          if (res.success) {
            let { items, totalCount } = res.result.pagedResultDto;
            this.noWork7DayCount = res.result.noWork7DayCount
              ? res.result.noWork7DayCount
              : res.result.noWork1DayCount;
            this.tableData = items;
            this.page.total = totalCount;
          }
        });
    }
  }
};
</script>

<style lang="scss">
@import "../../style/app-variables";
.unit-patrol {
  padding-top: 5px;
  &-tab {
    height: 100%;
    display: flex;
    flex-direction: column;
    & > :nth-child(2) {
      flex: 2 0 auto;
    }
  }
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    & > :last-child {
      float: right;
      display: flex;
    }
  }
}
</style>

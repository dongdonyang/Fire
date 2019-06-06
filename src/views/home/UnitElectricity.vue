<template>
  <el-tabs
    type="card"
    v-model="tabValue"
    @tab-click="getList"
    class="unit-electricity"
  >
    <el-tab-pane label="剩余电流" name="first">
      <div class="unit-electricity-tab">
        <!--    todo 筛选-->
        <div class="unit-electricity-header">
          <div>
            <el-form class="unit-electricity-form" :inline="true" :model="page">
              <el-form-item>
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
              </el-form-item>
              <el-form-item label="类型">
                <el-select
                  clearable
                  @change="getList"
                  size="small"
                  v-model="page.FireUnitTypeId"
                  placeholder="全部"
                >
                  <el-option
                    v-for="item in alarmTypeOpt"
                    :key="item.typeName"
                    :label="item.typeName"
                    :value="item.typeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="网关状态">
                <el-select
                  clearable
                  size="small"
                  v-model="page.GetwayStatusValue"
                  placeholder="全部"
                  @change="getList"
                >
                  <el-option
                    v-for="item in alarmStatusOpt"
                    :key="item.gatewayStatusName"
                    :label="item.gatewayStatusName"
                    :value="item.gatewayStatusValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-button
              type="text"
              @click="$store.dispatch('exportFile', 'GET_ELEC_ALARMLIST_EXCEL')"
              ><img src="../../assets/dowload.png" />导出</el-button
            >
          </div>
        </div>

        <!--    todo table 列表-->
        <base-table
          @slotDetail="slotDetail"
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

    <!--    todo 剩余电流和电缆温度都在同一个页面、-->
    <el-tab-pane label="电缆温度" name="second">
      <div class="unit-electricity-tab">
        <!--    todo 筛选-->
        <div class="unit-electricity-header">
          <div>
            <el-form class="unit-electricity-form" :inline="true" :model="page">
              <el-form-item>
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
              </el-form-item>
              <el-form-item label="类型">
                <el-select
                  clearable
                  @change="getList"
                  size="small"
                  v-model="page.FireUnitTypeId"
                  placeholder="全部"
                >
                  <el-option
                    v-for="item in alarmTypeOpt"
                    :key="item.typeName"
                    :label="item.typeName"
                    :value="item.typeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="网关状态">
                <el-select
                  clearable
                  size="small"
                  v-model="page.GetwayStatusValue"
                  placeholder="全部"
                  @change="getList"
                >
                  <el-option
                    v-for="item in alarmStatusOpt"
                    :key="item.gatewayStatusName"
                    :label="item.gatewayStatusName"
                    :value="item.gatewayStatusValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-button
              type="text"
              @click="$store.dispatch('exportFile', 'GET_TEMP_ALARMLIST_EXCEL')"
              ><img src="../../assets/dowload.png" />导出</el-button
            >
          </div>
        </div>

        <!--    todo table 列表-->
        <base-table
          @slotDetail="slotDetail"
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

    <!--    todo 弹窗-报警记录-->
    <base-dialog
      ref="getTimeDetail"
      dia-width="650px"
      :is-show-footer="false"
      class="alarm-record"
    >
      <div>
        <span>{{ slotValue.fireUnitName }}</span>
        <span style="float: right">总数量：{{ slotPage.total }}</span>
      </div>
      <el-form>
        <el-form-item v-for="(item, index) in partTableData" :key="index">
          <div>
            时间：<span>{{ item.time }}</span>
          </div>
          <div>
            事件：<span>{{ item.content }}</span>
          </div>
        </el-form-item>
      </el-form>
      <!--        分页-->
      <base-page
        v-bind:prop-pag.sync="slotPage"
        @currentChange="slotDetail"
      ></base-page>
    </base-dialog>

    <!--    todo 弹窗-报警部件-->
    <base-dialog ref="getPartsDetail" dia-width="650px" :is-show-footer="false">
      <div>
        <span>{{ slotValue.fireUnitName }}</span>
        <span style="float: right">总数量：{{ slotPage.total }}</span>
      </div>
      <base-table
        :column-list="partTableList"
        :table-data="partTableData"
      ></base-table>
      <!--        分页-->
      <base-page
        v-bind:prop-pag.sync="slotPage"
        @currentChange="slotDetail"
      ></base-page>
    </base-dialog>
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
export default {
  name: "UnitElectricity",
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
      partTableData: [],
      partTableList: [
        {
          prop: "name",
          label: "网关地址"
        },
        {
          prop: "time",
          label: "最近报警时间"
        },
        {
          prop: "count",
          label: "最近30天报警次数"
        }
      ],
      slotValue: {},
      slotName: "",
      slotPage: {
        MaxResultCount: 10, // 查询当前页面的数量
        total: 0,
        SkipCount: 0, // 跳过的查询的数量
        current: 1 // 当前页面
      },
      alarmStatusOpt: [],
      alarmTypeOpt: [],
      tabValue: "first",
      tableData: [],
      tableList: [
        {
          prop: "fireUnitName",
          label: "防火单位"
        },
        {
          prop: "typeName",
          label: "类型"
        },
        {
          prop: "alarmTime",
          label: "最近报警时间"
        },
        {
          prop: "alarmCount",
          label: "最近30天报警次数",
          slot: "getTimeDetail",
          unit: "次"
        },
        {
          prop: "highFreqCount",
          label: "高频报警部件",
          slot: "getPartsDetail",
          unit: "个"
        },
        {
          prop: "statusName",
          label: "网关状态",
          map: "statusName"
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
  watch: {},
  // Todo: HTML 渲染前
  created: function() {
    this.getList();
    this.getUnitType();
    this.getStatusType();
  },
  // Todo: HTML渲染后
  mounted: function() {},
  // Todo: 方法
  methods: {
    // todo 获取slot详情
    slotDetail(val, slotName) {
      if (arguments.length) {
        this.slotValue = val;
        this.slotName = slotName;
        this.slotPage.id = val.fireUnitId;
        this.slotPage.current = 1;
      }
      const APILIST = {
        //  最近30天报警次数
        getTimeDetail: {
          url:
            this.tabValue === "first"
              ? this.$api.Get_30Day_Alarm_ElecE
              : this.$api.Get_30Day_Alarm_ElecT,
          title: "ALARM_COUNT"
        },
        //  高频报警部件
        getPartsDetail: {
          url:
            this.tabValue === "first"
              ? this.$api.GET_ALARM_ELECE
              : this.$api.GET_ALARM_ELECT,
          title: "HIGH_FIRE_COUNT"
        }
      };
      this.slotPage.SkipCount =
        (this.slotPage.current - 1) * this.slotPage.MaxResultCount;
      this.$axios
        .get(APILIST[this.slotName].url, {
          params: this.slotPage
        })
        .then(res => {
          if (res.success) {
            this.partTableData = res.result.items;
            this.slotPage.total = res.result.totalCount;
            this.$refs[this.slotName].title = APILIST[this.slotName].title;
            this.$refs[this.slotName].show = true;
          }
        });
    },
    // todo 获取报警次数详情
    // todo 获取报警部件详情
    // todo 获取单位类型
    getUnitType() {
      this.$axios.get(this.$api.GET_FIRE_UNIT_TYPES).then(res => {
        if (res.success) {
          this.alarmTypeOpt = res.result;
        }
      });
    },
    // todo 获取网关类型
    getStatusType() {
      this.$axios.get(this.$api.GET_GATEWAY_STATUS_TYPES).then(res => {
        if (res.success) {
          this.alarmStatusOpt = res.result;
        }
      });
    },
    //  todo 获取剩余电流和电缆温度list
    getList() {
      this.page.SkipCount = (this.page.current - 1) * this.page.MaxResultCount;
      let url =
        this.tabValue === "first"
          ? this.$api.GET_AREAS30DAY_ELECALARM_LIST
          : this.$api.GET_AREAS30DAY_TEMPALARM_LIST;
      this.$axios
        .get(url, {
          params: this.page
        })
        .then(res => {
          if (res.success) {
            let { items, totalCount } = res.result;
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
.unit-electricity {
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  & > :last-child {
    flex: 2 0 auto;
    display: flex;
    & > :first-child,
    & > :nth-child(2) {
      flex: 2 0 auto;
    }
  }
  &-tab {
    height: 100%;
    display: flex;
    flex-direction: column;
    & > :nth-child(2) {
      flex: 2 0 auto;
    }
  }
  &-form {
    .el-select {
      width: 120px;
    }
    .el-form-item {
      margin-bottom: 0;
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
    //修改text按钮样式，垂直居中
    .el-button--text {
      span {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>

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
                  @change="getScreen"
                >
                  <template slot="append"
                    ><i class="el-icon-search"></i
                  ></template>
                </el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select
                  clearable
                  @change="getScreen"
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
                  @change="getScreen"
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
                  @change="getScreen"
                >
                  <template slot="append"
                    ><i class="el-icon-search"></i
                  ></template>
                </el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select
                  clearable
                  @change="getScreen"
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
                  @change="getScreen"
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
      dia-width="900px"
      :is-show-footer="false"
      class="alarm-record"
    >
      <div>
        <span>{{ slotValue.fireUnitName }}</span>
        <span style="float: right">总数量：{{ slotPage.total }}</span>
      </div>
      <base-table
        :column-list="detailTableList"
        :table-data="partTableData"
      ></base-table>
      <!--        分页-->
      <base-page
        v-bind:prop-pag.sync="slotPage"
        @currentChange="slotDetail"
      ></base-page>
    </base-dialog>

    <!--    todo 弹窗-报警部件-->
    <base-dialog
      class="alarm-record"
      ref="getPartsDetail"
      dia-width="900px"
      :is-show-footer="false"
    >
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

    <!--    todo 部分离线弹窗-->
    <base-dialog
      ref="getOfflineList"
      dia-width="900px"
      class="alarm-record"
      :is-show-footer="false"
    >
      <div>
        <span>{{ slotValue.fireUnitName }}</span>
        <span style="float: right">总数量：{{ offlinePage.total }}</span>
      </div>
      <base-table
        :column-list="OfflineTable"
        :table-data="OfflineList"
      ></base-table>
      <!--        分页-->
      <base-page
        v-bind:prop-pag.sync="offlinePage"
        @currentChange="getOffline"
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
      OfflineList: [], // 部分离线数据
      OfflineTable: [
        {
          prop: "gateway",
          label: "设备网关"
        },
        {
          prop: "location",
          label: "安装位置"
        },
        {
          prop: "status",
          label: "在线状态"
        }
      ], // 字段关系
      partTableData: [],
      partTableList: [
        {
          prop: "name",
          label: "报警部件",
          width: "500px"
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
      detailTableList: [
        {
          prop: "content",
          label: "事件",
          width: "500"
        },
        {
          prop: "location",
          label: "地点"
        },
        {
          prop: "time",
          label: "时间"
        }
      ],
      slotValue: {},
      slotName: "",
      slotPage: {
        MaxResultCount: 8, // 查询当前页面的数量
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
        MaxResultCount: 10, // 查询当前页面的数量
        total: 0,
        SkipCount: 0, // 跳过的查询的数量
        current: 1 // 当前页面
      },
      offlinePage: {
        FireSysType: 1, // 1:安全用电，2:火灾报警
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
  mounted: function() {
    this.getUnitType();
    this.getStatusType();
  },
  // Todo: 方法
  methods: {
    // todo 条件筛选
    getScreen() {
      this.$store.dispatch({
        type: "setPage",
        page: this.page,
        fun: this.getList
      });
    },
    // todo 获取slot详情
    slotDetail(val, slotName) {
      let s = this.slotPage;
      if (arguments.length) {
        this.slotValue = val;
        this.slotName = slotName;
        s.id = val.fireUnitId;
        s.current = 1;
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
      s.SkipCount = (s.current - 1) * s.MaxResultCount;
      this.$axios
        .get(APILIST[this.slotName].url, {
          params: s
        })
        .then(res => {
          if (res.success) {
            this.partTableData = res.result.items;
            s.total = res.result.totalCount;
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
    },
    //  todo 获取部分离线数据
    getOffline(item) {
      if (arguments.length) {
        this.slotValue = item;
        this.offlinePage.FireUnitId = item.fireUnitId;
      }
      this.$axios
        .get(this.$api.GET_FIRE_UNIT_GATEWAYS_STATUS, {
          params: this.offlinePage
        })
        .then(res => {
          if (res.success) {
            this.$refs.getOfflineList.title = "OFFLINE_TABLE";
            this.$refs.getOfflineList.show = true;
            this.OfflineList = res.result.items;
            this.offlinePage.total = res.result.totalCount;
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
    & > :first-child {
      form {
        & > :first-child {
          .el-form-item__content {
            margin-top: 5px;
          }
        }
      }
    }
    & > :last-child {
      float: right;
      display: flex;
      img {
        width: 20px;
      }
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

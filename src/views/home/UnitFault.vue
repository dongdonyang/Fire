<template>
  <div class="unit-fault">
    <!--    todo 筛选-->
    <div class="unit-fault-header">
      <div>
        <el-form class="unit-fault-form" :inline="true" :model="page">
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
          <!--          <el-form-item label="类型">-->
          <!--            <el-select-->
          <!--              clearable-->
          <!--              size="small"-->
          <!--              v-model="page.FireUnitTypeId"-->
          <!--              placeholder="全部"-->
          <!--              @change="getList"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="item in alarmTypeOpt"-->
          <!--                :key="item.typeName"-->
          <!--                :label="item.typeName"-->
          <!--                :value="item.typeId"-->
          <!--              >-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="网关状态">-->
          <!--            <el-select-->
          <!--              clearable-->
          <!--              size="small"-->
          <!--              v-model="page.GetwayStatusValue"-->
          <!--              placeholder="全部"-->
          <!--              @change="getList"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="item in alarmStatusOpt"-->
          <!--                :key="item.gatewayStatusName"-->
          <!--                :label="item.gatewayStatusName"-->
          <!--                :value="item.gatewayStatusValue"-->
          <!--              >-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
        </el-form>
      </div>
      <div>
        <el-button
          type="text"
          @click="$store.dispatch('exportFile', 'GET_FAULTLIST_EXCEL')"
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
    <base-page v-bind:prop-pag.sync="page" @currentChange="getList"></base-page>

    <!--    todo 弹窗-->
    <base-dialog :isShowFooter="false" ref="getTimeDetail" class="alarm-record">
      <div>
        <div>{{ slotVal.fireUnitName }}</div>
        <div>总数：{{ slotPage.total }}</div>
      </div>
      <base-table
        :column-list="detailTableList"
        :table-data="partTableData"
      ></base-table>
      <!--      page-->
      <base-page
        v-bind:prop-pag.sync="slotPage"
        @currentChange="slotPageDetail"
      ></base-page>
    </base-dialog>
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
  name: "UnitFault",
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
      slotVal: {},
      slotForm: [],
      alarmStatusOpt: [],
      alarmTypeOpt: [],
      tableData: [],
      partTableData: [],
      detailTableList: [
        {
          prop: "detectorTypeName",
          label: "设施类型"
        },
        {
          prop: "content",
          label: "故障描述"
        },
        {
          prop: "time",
          label: "故障时间"
        }
      ],
      tableList: [
        {
          prop: "fireUnitName",
          label: "防火单位"
        },
        {
          prop: "faultCount",
          label: "发生故障数量",
          unit: "个"
        },
        {
          prop: "processedCount",
          label: "处理故障数量",
          unit: "个"
        },
        {
          prop: "pendingCount",
          label: "待处理故障数量",
          slot: "pendingCount",
          unit: "个"
        }
      ],
      page: {
        MaxResultCount: 10, // 查询当前页面的数量
        total: 0,
        SkipCount: 0, // 跳过的查询的数量
        current: 1 // 当前页面
      },
      slotPage: {
        MaxResultCount: 5, // 查询当前页面的数量
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
    // todo 获取slot详情
    slotDetail(val) {
      this.slotVal = val;
      this.$refs.getTimeDetail.title = "FAULT_DETAIL";
      this.slotPage.id = val.fireUnitId;
      this.slotPageDetail().then(() => {
        this.$refs.getTimeDetail.show = true;
      });
    },
    // todo 分页查询slot数据
    async slotPageDetail() {
      this.slotPage.SkipCount =
        (this.slotPage.current - 1) * this.slotPage.MaxResultCount;
      await this.$axios
        .get(this.$api.GET_FIRE_UNIT_PENDING_FAULT, {
          params: this.slotPage
        })
        .then(res => {
          if (res.success) {
            this.partTableData = res.result.items;
            this.slotPage.total = res.result.totalCount;
          }
        });
    },
    //  todo 获取设施故障监控list
    getList() {
      this.$axios
        .get(this.$api.GET_FIRE_UNIT_FAULT_LIST, {
          params: this.page
        })
        .then(res => {
          if (res.success) {
            this.tableData = res.result.items;
            this.page.total = res.result.totalCount;
          }
        });
    }
  }
};
</script>

<style lang="scss">
@import "../../style/app-variables";
.unit-fault {
  display: flex;
  flex-direction: column;
  & > :nth-child(2) {
    flex: 2 0 auto;
  }
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    & > :first-child {
      display: flex;
    }
    img {
      width: 20px;
    }
    //修改text按钮样式，垂直居中
    .el-button--text {
      span {
        display: flex;
        align-items: center;
      }
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
}
</style>

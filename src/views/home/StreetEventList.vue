<template>
  <div class="event-list">
    <!--    todo 筛选-->
    <div class="event-list-header">
      <el-form :inline="true" class="event-list-form">
        <el-form-item label="事件状态">
          <el-select
            clearable
            size="small"
            v-model="page.Status"
            @change="getList"
            placeholder="全部"
          >
            <el-option
              v-for="item in eventTypeOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          type="text"
          @click="$store.dispatch('exportFile', 'GET_STREET_EVENT_EXCEL')"
          ><img src="../../assets/dowload.png" />导出</el-button
        >
      </div>
    </div>

    <!--    todo table列表-->
    <base-table
      :is-show-delete="false"
      :column-list="tableList"
      :table-data="tableData"
      @getDetail="getDetail"
    ></base-table>

    <!--      todo 分页-->
    <base-page v-bind:prop-pag.sync="page" @currentChange="getList"></base-page>

    <!--    todo 详情弹窗-->
    <base-dialog ref="BaseDialog" :is-show-footer="false">
      <el-form class="event-list-form-list" v-if="form.id">
        <el-form-item
          v-for="(item, index) in formList"
          :label="item.label"
          :key="index"
        >
          <span v-if="index === 3">{{
            eventTypeOpt[form[item.value]].label
          }}</span>
          <span v-else>{{ form[item.value] }}</span>
        </el-form-item>
      </el-form>
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
  name: "StreetEventList.vue",
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
      eventTypeOpt: [
        {
          label: "未指定",
          value: "0"
        },
        {
          label: "待处理",
          value: "1"
        },
        {
          label: "处理中",
          value: "2"
        },
        {
          label: "已办结",
          value: "3"
        }
      ],
      typeOptions: [],
      isDeit: 0, // 0-提交、1-修改、2-保存
      form: {},
      tableData: [],
      tableList: [
        {
          prop: "title",
          label: "事件标题"
        },
        {
          prop: "gridName",
          label: "所属网格"
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
          prop: "creationTime",
          label: "受理时间"
        },
        {
          prop: "status",
          label: "事件状态",
          map: "StreetStatus"
        },
        {
          width: "125px",
          label: "操作"
        }
      ],
      page: {
        MaxResultCount: 10, // 查询当前页面的数量
        total: 0,
        SkipCount: 0, // 跳过的查询的数量
        current: 1 // 当前页面
      },
      formList: [
        {
          label: "事件标题：",
          value: "title"
        },
        {
          label: "事件类型：",
          value: "eventType"
        },
        {
          label: "受理时间：",
          value: "creationTime"
        },
        {
          label: "事件状态：",
          value: "status"
        },
        {
          label: "事件描述：",
          value: "remark"
        },
        {
          label: "所属街道：",
          value: "street"
        },
        {
          label: "所属社区：",
          value: "community"
        },
        {
          label: "所属网格：",
          value: "gridName"
        },
        {
          label: "网格专员：",
          value: "gridUserName"
        },
        {
          label: "",
          value: "phone"
        }
      ]
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
    // todo 导出EXCEL
    exportFile() {
      this.$axios.get(this.$api.GET_FIRE_UNIT_LIST_EXCEL);
    },
    // todo 查看详情
    getDetail(id) {
      this.$axios
        .get(this.$api.GET_EVENT_BYID, {
          params: { id }
        })
        .then(res => {
          if (res.success) {
            this.$refs.BaseDialog.show = true;
            this.$refs.BaseDialog.title = "STREET_EVENT_DETAIL";
            this.form = res.result;
            this.isDeit = 1;
          }
        });
    },
    //  todo 获取网格事件list
    getList() {
      this.page.SkipCount = (this.page.current - 1) * this.page.MaxResultCount;
      this.$axios
        .get(this.$api.GET_GRID_EVENT_LIST, {
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
.event-list {
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
    & > :last-child {
      float: right;
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
  &-form-list {
    display: flex;
    flex-wrap: wrap;
    & > :nth-child(n) {
      min-width: 100%;
    }
    & > :nth-child(n + 6) {
      min-width: 50%;
    }
    & > :nth-child(n + 9) {
      min-width: 25%;
    }
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

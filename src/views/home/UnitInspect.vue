<template>
  <div class="unit-inspect">
    <!--    todo 筛选-->
    <div class="unit-inspect-header">
      <el-form class="unit-inspect-form" :inline="true" :model="page">
        <el-form-item>
          <el-input
            clearable
            size="small"
            placeholder="请输入防火单位"
            v-model="page.FireUnitName"
            @change="
              $store.dispatch({
                type: 'setPage',
                page: page,
                fun: getList
              })
            "
          >
            <template slot="append"
              ><i class="el-icon-search"></i
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item label="检查结论">
          <el-select
            size="small"
            clearable
            v-model="page.CheckResult"
            @change="
              $store.dispatch({
                type: 'setPage',
                page: page,
                fun: getList
              })
            "
            placeholder="全部"
          >
            <el-option
              v-for="item in checkResultOpt"
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
          @click="$store.dispatch('exportFile', 'GET_SUPERVISION_LIST_EXCEL')"
          ><img src="../../assets/dowload.png" />导出</el-button
        >
      </div>
    </div>

    <!--    todo table 列表-->
    <base-table
      :is-show-delete="false"
      @getDetail="getDetail"
      :column-list="tableList"
      :table-data="tableData"
    ></base-table>

    <!--    todo 分页-->
    <base-page v-bind:prop-pag.sync="page" @currentChange="getList"></base-page>

    <!--    todo 弹窗-->
    <base-dialog ref="BaseDialog" dia-width="800px" :is-show-footer="false">
      <el-tabs v-model="tabValue" type="card">
        <el-tab-pane label="综合信息" name="first">
          <el-form class="unit-inspect-tab-form">
            <el-form-item
              v-for="(item, index) in formList"
              :label="item.label"
              :key="index"
            >
              <!--              todo 替换中文-->
              <span v-if="index === 3">{{ getName(form[item.value]) }}</span>

              <!--              todo 文书title-->
              <template slot="label" v-else-if="index === 4">
                <span style="display: flex">
                  <img src="../../assets/book.svg" />
                  {{ item.label }}</span
                >
              </template>

              <!--              todo 照片-->
              <template v-else-if="index === 12">
                <el-form-item slot="label">
                  <span v-if="form.photoPath.length > 0">
                    <span style="display: flex">
                      <img src="../../assets/pic.svg" />
                      {{ item.label }}</span
                    >
                  </span>
                </el-form-item>
                <div>
                  <br />
                  <div
                    @click="seePic($event)"
                    v-if="form.photoPath.length > 0"
                    class="unit-inspect-tab-form-img"
                  >
                    <el-image
                      v-for="(item, index) in form.photoPath"
                      :key="index"
                      style="width: 120px; height: 120px"
                      :src="`http://47.98.179.238:5080${item}`"
                      fit="cover"
                    ></el-image>
                  </div>
                  <!--                  todo 图片弹窗-->
                  <el-dialog
                    class="unit-inspect-tab-form-dia"
                    append-to-body
                    :visible.sync="dialogPic"
                  >
                    <img width="100%" :src="dialogImageUrl" alt="" />
                  </el-dialog>
                </div>
              </template>

              <!--todo 默认展示数据-->
              <span v-else>{{ form[item.value] }}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!--        todo ----------------------------------------------------------------------项目明细-->
        <el-tab-pane label="项目明细" name="second">
          <el-form label-width="300px" label-position="left">
            <div v-for="(x, y) in formDetail" :key="y">
              <h3>{{ x.supervisionItemName }}</h3>
              <div class="unit-inspect-tab-form-detail">
                <el-form-item
                  v-for="(item, index) in x.sonList"
                  :label="item.supervisionItemName"
                  :key="index"
                >
                  <span :class="[item.isOK ? activeClass : errorClass]">{{
                    item.isOK ? "合格" : "不合格"
                  }}</span>
                  <el-popover
                    v-if="item.remark"
                    placement="bottom"
                    trigger="click"
                    >{{ item.remark }}
                    <el-button
                      :class="[item.isOK ? activeClass : errorClass]"
                      type="text"
                      slot="reference"
                      icon="el-icon-document"
                    ></el-button>
                  </el-popover>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
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
  name: "UnitInspect",
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
      dialogPic: false,
      dialogImageUrl: "",
      checkResultOpt: [
        {
          label: "未指定",
          value: 0
        },
        {
          label: "合格",
          value: 1
        },
        {
          label: "现场整改",
          value: -1
        },
        {
          label: "限期整改",
          value: -2
        },
        {
          label: "停业整顿",
          value: -3
        }
      ],
      activeClass: "activeClass",
      errorClass: "errorClass",
      form: {
        photoPath: []
      },
      formDetail: {},
      tabValue: "first",
      formList: [
        {
          label: "防火单位：",
          value: "fireUnitName"
        },
        {
          label: "检查日期：",
          value: "creationTime"
        },
        {
          label: "检查人员：",
          value: "checkUser"
        },
        {
          label: "检查结论",
          value: "checkResult"
        },
        {
          label: "下发法律文书",
          value: ""
        },
        {
          label: "",
          value: ""
        },
        {
          label: "当场：",
          value: "documentSite"
        },
        {
          label: "期限：",
          value: "documentDeadline"
        },
        {
          label: "重大：",
          value: "documentMajor"
        },
        {
          label: "复查：",
          value: "documentReview"
        },
        {
          label: "检查意见书：",
          value: "documentInspection"
        },
        {
          label: "处罚决定书：",
          value: "documentPunish"
        },
        {
          label: "现场照片",
          value: "photoPath"
        }
      ],
      alarmType: "",
      alarmTypeOpt: [],
      tableData: [],
      tableList: [
        {
          prop: "fireUnitName",
          label: "防火单位"
        },
        {
          prop: "creationTime",
          label: "最近检查日期"
        },
        {
          prop: "checkUser",
          label: "检查人员"
        },
        {
          prop: "checkResult",
          label: "检查结论",
          map: "checkResult"
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
    // todo 图片预览
    seePic(event) {
      this.dialogImageUrl = event.target.src;
      this.dialogPic = this.dialogImageUrl ? true : false;
    },
    //todo 获取检查结论中文名
    getName(val) {
      if (!val) {
        return "";
      } else {
        let name = this.checkResultOpt.find(item => {
          return item.value === val;
        });
        return name.label ? name.label : "";
      }
    },
    // todo 查看详情
    getDetail(id) {
      Promise.all([
        this.$axios.get(this.$api.Get_Supervision_Main, {
          params: { supervisionId: id }
        }),
        this.$axios.get(this.$api.Get_Supervision_Detail, {
          params: { supervisionId: id }
        })
      ]).then(([res1, res2]) => {
        if (res1.success && res2.success) {
          let b = this.$refs.BaseDialog;
          this.form = res1.result;
          this.formDetail = res2.result;
          b.title = "UNIT_INSPECT_DETAIL";
          b.show = true;
        }
      });
    },
    //  todo 获取监督检查list
    getList() {
      this.$axios
        .get(this.$api.GET_SUPERVISION_LIST, {
          params: this.page
        })
        .then(res => {
          if (res.success) {
            ({
              items: this.tableData,
              totalCount: this.page.total
            } = res.result);
          }
        });
    }
  }
};
</script>

<style lang="scss">
@import "../../style/app-variables";
/*todo 合格、不合同颜色*/
.activeClass {
  color: $status-normal;
}
.errorClass {
  color: $status-abnormal;
}
.unit-inspect {
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
      & > :first-child {
        .el-form-item__content {
          padding-top: 5px;
        }
      }
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
  &-tab-form,
  &-tab-form-detail {
    display: flex;
    flex-wrap: wrap;
    & > div {
      min-width: 50%;
      margin-bottom: 10px;
      border-bottom: 1.2px solid $input-back;
    }
  }
  &-tab-form {
    /* 法律文书单独样式*/
    & > :nth-child(5) {
      .el-form-item__label {
        font-weight: bold;
      }
    }
    /* todo 照片墙*/
    & > :nth-child(n + 13) {
      width: 100%;
      border-bottom-width: 0;
    }
    &-img {
      display: flex;
      padding: 10px 26px;
      .el-image {
        margin: 0 10px;
        cursor: Pointer;
        &:hover {
        }
      }
    }
    /* todo 照片弹窗*/
    &-dia {
      & > :first-child {
        background-color: $dialog-main;
        .el-dialog__header {
          display: none;
        }
      }
    }
  }
  &-tab-form-detail {
    & > div {
      margin-bottom: 0;
    }
  }
  h3 {
    border-radius: 0 25px;
    background-color: $table-main;
    line-height: 40px;
    margin: 0;
    padding: 0 10px;
    color: $table-header;
    text-align: center;
  }
}
</style>

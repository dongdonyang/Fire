<template>
  <div class="repair-list">
    <!--    todo 筛选-->
    <div class="repair-list-header">
      <div>
        <el-input
          clearable
          size="small"
          placeholder="请输入搜索单位"
          v-model="page.Name"
          @change="getList"
        >
          <template slot="append"
            ><i class="el-icon-search"></i
          ></template>
        </el-input>
      </div>
      <div>
        <el-button type="text" @click="addInfo"
          ><img src="../../assets/new_btn.png" />新增消防维保</el-button
        >
        <el-button
          type="text"
          @click="$store.dispatch('exportFile', 'GET_SAFE_UNITS_EXCEL')"
          ><img src="../../assets/dowload.png" />导出</el-button
        >
      </div>
    </div>

    <!--    todo table 列表-->
    <base-table
      :column-list="tableList"
      :table-data="tableData"
      @deleteInfo="deleteInfo"
      @getDetail="getDetail"
    ></base-table>

    <!--    todo 分页-->
    <base-page v-bind:prop-pag.sync="page" @currentChange="getList"></base-page>

    <!--    todo 弹窗-->
    <base-dialog
      ref="BaseDialog"
      @submit="submit"
      @editInfo="editInfo"
      :isDeit="isDeit"
    >
      <el-form
        ref="form"
        label-width="100px"
        :rules="rules"
        :model="form"
        class="repair-list-form"
      >
        <el-form-item label="单位名称：" prop="name">
          <el-input
            v-if="!isDeit"
            v-model="form.name"
            placeholder="请输入单位名称（必填）"
          ></el-input>
          <span v-else>{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="联系人：" prop="contractName">
          <el-input
            v-if="!isDeit"
            v-model="form.contractName"
            placeholder="请输入联系人姓名"
          ></el-input>
          <span v-else>{{ form.contractName }}</span>
        </el-form-item>
        <el-form-item label="联系电话：" prop="contractPhone">
          <el-input
            v-if="!isDeit"
            v-model="form.contractPhone"
            placeholder="请输入联系人电话号码"
          ></el-input>
          <span v-else>{{ form.contractPhone }}</span>
        </el-form-item>
        <el-form-item label="工程资质：" prop="level">
          <el-select
            v-if="!isDeit"
            v-model="form.level"
            placeholder="请选择工程资质（必填）"
          >
            <el-option label="一级" :value="1"></el-option>
            <el-option label="二级" :value="2"></el-option>
            <el-option label="三级" :value="3"></el-option>
          </el-select>
          <span v-else>{{ form.level }}级</span>
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
  name: "RepairList",
  // Todo: 组件注册
  components: {
    BasePage,
    BaseTable
  },
  // Todo: 特性
  props: {},
  // Todo: 双向绑定的数据
  data() {
    // todo 验证手机号
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else {
        if (/^1[34578]\d{9}$/.test(value)) {
          callback();
        } else {
          return callback(new Error("手机号格式不正确"));
        }
      }
    };
    return {
      form: {},
      isDeit: 0, // 0-提交、1-修改、2-保存
      tableData: [],
      tableList: [
        {
          prop: "name",
          label: "单位名称"
        },
        {
          prop: "contractName",
          label: "联系人"
        },
        {
          prop: "contractPhone",
          label: "联系电话"
        },
        {
          prop: "level",
          label: "工程资质",
          unit: "级"
        },
        {
          prop: "invitationCode",
          label: "邀请码"
        },
        {
          width: "140px",
          label: "操作"
        }
      ],
      page: {
        MaxResultCount: 10, // 查询当前页面的数量
        total: 0,
        SkipCount: 0, // 跳过的查询的数量
        current: 1 // 当前页面
      },
      rules: {
        name: [
          { required: true, message: "请输入单位名称", trigger: "blur" },
          { max: 50, message: "长度不能超过50个字符", trigger: "blur" }
        ],
        contractPhone: [{ required: true, validator: validatePhone }],
        level: [
          { required: true, message: "请选择工程资质", trigger: "change" }
        ]
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
    //  todo 保存、编辑消防维保
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let as = this.form.id
            ? this.$axios.post(this.$api.UPDATE_SAFE_UNITS, this.form)
            : this.$axios.post(this.$api.ADD_SAFE_UNITS, this.form);
          as.then(res => {
            if (res.success) {
              this.$message.success(
                `${this.form.id ? "修改" : "新增"}消防维保成功`
              );
              this.$refs.BaseDialog.show = false;
              this.getList();
            }
          });
        }
      });
    },
    // todo 新增消防维保
    addInfo() {
      this.$refs.BaseDialog.show = true;
      this.$refs.BaseDialog.title = "ADD_REPAIR_STATION";
      this.form = {};
      this.isDeit = 0;
    },
    // todo 查看详情
    getDetail(id) {
      this.$axios
        .get(this.$api.GET_SAFE_UNITS_INFO, {
          params: { id }
        })
        .then(res => {
          if (res.success) {
            this.$refs.BaseDialog.show = true;
            this.$refs.BaseDialog.title = "REPAIR_STATION_INFO";
            this.form = res.result;
            this.isDeit = 1;
          }
        });
    },
    //  todo 删除数据
    deleteInfo(val) {
      this.$axios
        .post(this.$api.DELETE_SAFE_UNITS, { id: val.id })
        .then(res => {
          if (res.success) {
            this.$message.success(`删除${val.name}成功`);
            this.page.SkipCount = 1;
            this.getList();
          }
        });
    },
    //  todo 获取消防维保list
    getList() {
      this.page.SkipCount = (this.page.current - 1) * this.page.MaxResultCount;
      this.$axios
        .get(this.$api.GET_SAFE_UNITS, {
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
.repair-list {
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

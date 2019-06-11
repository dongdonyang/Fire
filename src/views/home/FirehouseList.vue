<template>
  <div class="fire-house">
    <!--    todo 筛选-->
    <div class="fire-house-header">
      <div>
        <el-input
          size="small"
          clearable
          placeholder="请输入站点名称"
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
          ><img src="../../assets/new_btn.png" />新增微型消防站</el-button
        >
        <el-button
          type="text"
          @click="$store.dispatch('exportFile', 'GET_STATION_EXCEL')"
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
      @befClosed="$refs.form.clearValidate()"
      ref="BaseDialog"
      @submit="submit"
      @editInfo="editInfo"
      :isDeit="isDeit"
    >
      <el-form
        ref="form"
        :rules="rules"
        class="fire-house-form"
        label-width="100px"
        :model="form"
      >
        <el-form-item label="站点名称：" prop="name">
          <el-input
            v-if="!isDeit"
            v-model="form.name"
            placeholder="请输入站点名称（必填）"
          ></el-input>
          <span v-else>{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="等级：" prop="level">
          <el-select
            v-if="!isDeit"
            v-model="form.level"
            placeholder="请选择等级（必填）"
          >
            <el-option label="一级" :value="1"></el-option>
            <el-option label="二级" :value="2"></el-option>
            <el-option label="三级" :value="3"></el-option>
          </el-select>
          <span v-else>{{ form.level }}级</span>
        </el-form-item>
        <el-form-item label="联系人：" prop="contactName">
          <el-input
            v-if="!isDeit"
            v-model="form.contactName"
            placeholder="请输入联系人名称"
          ></el-input>
          <span v-else>{{ form.contactName }}</span>
        </el-form-item>
        <el-form-item label="联系电话：" prop="contactPhone">
          <el-input
            v-if="!isDeit"
            v-model="form.contactPhone"
            placeholder="请输入联系人电话号码"
          ></el-input>
          <span v-else>{{ form.contactPhone }}</span>
        </el-form-item>
        <el-form-item label="人员配备：" prop="personNum">
          <el-input
            v-if="!isDeit"
            type="number"
            :min="0"
            v-model.number="form.personNum"
            placeholder="请输入人员配置数量"
          >
            <span slot="suffix">人</span>
          </el-input>
          <span v-else>{{ form.personNum }}人</span>
        </el-form-item>
        <el-form-item label="地图定位：" prop="type">
          <span>{{ form.address }}</span>
          <el-button type="text" @click="openMap">
            <img alt="" src="../../assets/positioning_img.png" />
            <span v-show="!form.address">地图定位</span>
          </el-button>
        </el-form-item>
      </el-form>
    </base-dialog>

    <!--    todo 地图弹窗-->
    <base-dialog ref="MapDia" :is-show-footer="false">
      <base-map
        ref="MapDiaSlot"
        :key="key"
        @setPosition="setPosition"
      ></base-map>
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
import BaseMap from "../../components/BaseMap";
export default {
  name: "FirehouseList",
  // Todo: 组件注册
  components: {
    BasePage,
    BaseTable,
    BaseMap
  },
  // Todo: 特性
  props: {},
  // Todo: 双向绑定的数据
  data() {
    // todo 验证手机号
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        if (/^1[34578]\d{9}$/.test(value)) {
          callback();
        } else {
          return callback(new Error("手机号格式不正确"));
        }
      }
    };
    return {
      key: 0,
      isDeit: 0, // 0-提交、1-修改、2-保存
      form: {},
      tableData: [],
      tableList: [
        {
          prop: "name",
          label: "站点名称"
        },
        {
          prop: "level",
          label: "等级",
          unit: "级"
        },
        {
          prop: "contactName",
          label: "联系人"
        },
        {
          prop: "contactPhone",
          label: "联系电话"
        },
        {
          prop: "personNum",
          label: "人员配备",
          unit: "人"
        },
        {
          prop: "address",
          label: "地址"
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
          { required: true, message: "请输入站点名称", trigger: "blur" },
          { max: 50, message: "长度不能超过50个字符", trigger: "blur" }
        ],
        level: [
          { required: true, message: "请选择一个等级", trigger: "change" }
        ],
        contactPhone: [{ validator: validatePhone }]
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
    // todo 打开地图
    openMap() {
      this.key = this.key + 1;
      this.$refs.MapDia.show = true;
    },
    //  todo 设置位置信息
    setPosition(val) {
      this.$refs.MapDia.show = false;
      let addressValue = val.name
        ? `${val.pname}${val.cityname}${val.adname}${val.name}`
        : val;
      this.$set(this.form, "address", addressValue);
    },
    // todo 查看详情
    async getDetail(id) {
      let that = this;
      this.$axios
        .get(this.$api.GET_MINI_FIRE_STATION, {
          params: { id }
        })
        .then(res => {
          if (res.success) {
            this.$refs.BaseDialog.show = true;
            this.$refs.BaseDialog.title = "SITE_DETAIL";
            this.form = res.result;
            this.isDeit = 1;
            this.$store.dispatch("getPositionName", res.result).then(res => {
              console.log(res.data);
              let p = res.data.regeocode.formatted_address;
              that.form.address = p.length ? p : "";
            });
          }
        });
    },
    //  todo 删除数据
    deleteInfo(val) {
      this.$axios
        .post(this.$api.DELETE_MINI_FIRE_STATION, { id: val.id })
        .then(res => {
          if (res.success) {
            this.$message.success(`删除${val.name}成功`);
            this.page.SkipCount = 1;
            this.getList();
          }
        });
    },
    //  todo 保存、编辑微型消防站
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let as = this.form.id
            ? this.$axios.post(this.$api.UPDATE_MINI_FIRE_STATION, this.form)
            : this.$axios.post(this.$api.ADD_MINI_FIRE_STATION, this.form);
          as.then(res => {
            if (res.success) {
              this.$message.success(
                `${this.form.id ? "修改" : "新增"}微型消防站成功`
              );
              this.$refs.BaseDialog.show = false;
              this.getList();
            }
          });
        }
      });
    },
    // todo 修改
    editInfo(val) {
      this.isDeit = val;
    },
    // todo 新增微型消防站
    addInfo() {
      this.$refs.BaseDialog.show = true;
      this.$refs.BaseDialog.title = "ADD_MINI_STATION";
      this.form = {};
      this.isDeit = 0;
    },
    //  todo 获取微型消防站list
    getList() {
      this.page.SkipCount = (this.page.current - 1) * this.page.MaxResultCount;
      this.$axios
        .get(this.$api.GET_FIRE_STATION, {
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
.fire-house {
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
    /*  定图定位四个字的样式*/
    & > :last-child {
      .el-form-item__content {
        display: flex;
        align-items: center;
      }
      .el-button--text {
        & > :first-child {
          display: flex;
          align-items: center;
        }
        span {
          margin: 0 10px;
        }
      }
    }
  }
}
</style>

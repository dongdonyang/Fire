<template>
  <div class="unit-list">
    <!--    todo 筛选-->
    <div class="unit-list-header">
      <div>
        <el-input
          clearable
          size="small"
          placeholder="请输入单位名称"
          v-model="page.Name"
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
      </div>
      <div>
        <el-button type="text" @click="addInfo"
          ><img src="../../assets/new_btn.png" alt="" />新增防火单位</el-button
        >
        <el-button
          type="text"
          @click="$store.dispatch('exportFile', 'GET_FIRE_UNIT_LIST_EXCEL')"
          ><img src="../../assets/dowload.png" alt="" />导出</el-button
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

    <!--    todo 添加、编辑弹窗-->
    <base-dialog
      @befClosed="$refs.form.clearValidate()"
      ref="BaseDialog"
      @submit="submit"
      @editInfo="editInfo"
      :isDeit="isDeit"
    >
      <el-form
        label-width="120px"
        :rules="rules"
        :model="form"
        ref="form"
        class="unit-list-form"
      >
        <el-form-item label="单位名称：" prop="name">
          <el-input
            v-if="!isDeit"
            v-model="form.name"
            placeholder="请输入单位名称（必填）"
          ></el-input>
          <span v-else>{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="类型：" prop="typeId">
          <el-select
            v-if="!isDeit"
            v-model="form.typeId"
            placeholder="请选择单位类型（必填）"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            >
            </el-option>
          </el-select>
          <span v-else>{{ form.type }}</span>
        </el-form-item>
        <el-form-item label="区域：" prop="areaId">
          <div v-if="!isDeit">
            <span style="width: 150px">四川-成都-成华</span>
            <el-select
              v-model="form.areaId"
              placeholder="请选择街道地址（必填）"
            >
              <el-option
                v-for="item in areasOption"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              >
              </el-option>
            </el-select>
          </div>
          <span v-else>{{ form.area }}</span>
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
            placeholder="请联系人电话号码"
          ></el-input>
          <span v-else>{{ form.contractPhone }}</span>
        </el-form-item>
        <el-form-item label="维保单位：" prop="safeUnitId">
          <el-select
            v-if="!isDeit"
            v-model="form.safeUnitId"
            filterable
            remote
            reserve-keyword
            placeholder="关键字查询维保单位（必填）"
            :remote-method="searchUnit"
            :loading="loading"
          >
            <el-option
              v-for="item in safeUnitsOpt"
              :key="item.safeUnitId"
              :label="item.safeUnitName"
              :value="item.safeUnitId"
            >
            </el-option>
          </el-select>
          <span v-else>{{ form.safeUnit }}</span>
        </el-form-item>
        <el-form-item label="地图定位：" prop="address">
          <span>{{ form.address }}</span>
          <el-button type="text" @click="openMap">
            <img src="../../assets/positioning_img.png" />
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
  name: "UnitList",
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
      loading: false,
      key: 0,
      typeOptions: [],
      areasOption: [],
      safeUnitsOpt: [],
      isDeit: 0, // 0-提交、1-修改、2-保存
      form: {},
      tableData: [],
      tableList: [
        {
          prop: "name",
          label: "单位名称"
        },
        {
          prop: "type",
          label: "类型"
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
        contractPhone: [{ validator: validatePhone }],
        name: [
          {
            required: true,
            message: "请输入单位名称",
            trigger: "blur"
          }
        ],
        typeId: [
          { required: true, message: "请选择单位类型", trigger: "change" }
        ],
        areaId: [
          {
            required: true,
            message: "请选择街道地址",
            trigger: "change"
          }
        ],
        contractName: [
          {
            required: true,
            message: "请输入联系人姓名",
            trigger: "blur"
          }
        ],
        safeUnitId: [
          {
            required: true,
            message: "请选择维保单位",
            trigger: "change"
          }
        ],
        address: [
          {
            required: true,
            message: "请选择地图位置",
            trigger: "blur"
          }
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
  mounted: function() {
    this.getUnitType();
    this.getAreas();
  },
  // Todo: 方法
  methods: {
    //  todo 获取成华区区域
    getAreas() {
      this.$axios.get(this.$api.GET_AREAS_CHENGHUA).then(res => {
        if (res.success) {
          this.areasOption = res.result;
        }
      });
    },
    //  todo 设置位置信息
    setPosition(val) {
      this.$refs.MapDia.show = false;
      // this.form.lat = val.location.lat;
      // this.form.lng = val.location.lng;
      let addressValue = val.name
        ? `${val.pname}${val.cityname}${val.adname}${val.name}`
        : val;
      this.$set(this.form, "address", addressValue);
    },
    // todo 维保单位模糊查询
    searchUnit(Name) {
      if (Name !== "") {
        this.loading = true;
        setTimeout(() => {
          this.$axios
            .get(this.$api.GET_SAFE_KEY, {
              params: { Name }
            })
            .then(res => {
              if (res.success) {
                this.loading = false;
                this.safeUnitsOpt = res.result;
              }
            });
        }, 200);
      } else {
        this.safeUnitsOpt = [];
      }
    },
    // 查询维保单位list
    getSafeList(Name = "") {
      this.$axios
        .get(this.$api.GET_SAFE_KEY, {
          params: { Name }
        })
        .then(res => {
          if (res.success) {
            this.safeUnitsOpt = res.result;
          }
        });
    },
    // todo 打开地图
    openMap() {
      this.key += 1;
      let m = this.$refs.MapDia;
      ({ show: m.show, title: m.title } = {
        show: true,
        title: "GET_MAP_POSITION"
      });
    },
    // todo 获取防火单位类型
    getUnitType() {
      this.$axios.get(this.$api.GET_FIRE_UNIT_TYPES).then(res => {
        if (res.success) {
          this.typeOptions = res.result;
        }
      });
    },
    // todo 修改、需要查询相应的类型，街道、维保单位id
    editInfo(val) {
      let typeName, areaName;
      this.getSafeList(this.form.safeUnit);
      typeName = this.typeOptions.find(item => {
        return item.typeName === this.form.type;
      });
      areaName = this.areasOption.find(item => {
        return this.form.area.search(item.areaName) != -1;
      });
      this.form.typeId = typeName ? typeName.typeId : "";
      this.form.areaId = areaName ? areaName.areaId : "";
      this.isDeit = val;
    },
    //  todo 获取防火单位list
    getList() {
      this.$axios
        .get(this.$api.GET_FIRE_UNIT_LIST, {
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
    },
    // todo 新增防火单位
    addInfo() {
      let b = this.$refs.BaseDialog;
      b.show = true;
      b.title = "ADD_UNIT_LIST";
      this.form = {};
      this.isDeit = 0;
      this.getSafeList();
    },
    // todo 查看详情
    getDetail(id) {
      this.$axios
        .get(this.$api.GET_FIRE_UNIT_INFO, {
          params: { id }
        })
        .then(res => {
          if (res.success) {
            let b = this.$refs.BaseDialog;
            b.show = true;
            b.title = "EDIT_UNIT_LIST";
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
    },
    //  todo 保存、编辑单位信息
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let f = this.form;
          let as = f.id
            ? this.$axios.put(this.$api.UPDATE_FIRE_UNIT, f)
            : this.$axios.post(this.$api.ADD_FIRE_UNIT, f);
          as.then(res => {
            if (res.success) {
              this.$message.success(`${f.id ? "修改" : "新增"}防火单位成功`);
              this.$refs.BaseDialog.show = false;
              this.getList();
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../style/app-variables";
.unit-list {
  display: flex;
  flex-direction: column;
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
    & > :nth-child(3) {
      .el-form-item__content {
        & > :first-child {
          display: flex;
        }
      }
    }
  }
}
</style>

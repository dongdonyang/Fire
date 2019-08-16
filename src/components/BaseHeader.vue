<template>
  <div class="base-header">
    <div></div>

    <div>
      <div>城市智慧消防预警工作台</div>
      <div class="base-header-tit"></div>
    </div>

    <!--    todo 操作按钮-->
    <div class="base-header-but">
      <el-button type="text">
        <img src="../assets/top_img_03.png" alt="" />
        {{ $store.state.userInfo.deptName }}</el-button
      >
      <!--      TODO 设置-->
      <el-tooltip
        class="item"
        effect="dark"
        content="设置"
        placement="bottom-end"
      >
        <el-button @click="getFire" class="base-header-two" type="text">
          <img src="../assets/set.png" alt="" />
        </el-button>
      </el-tooltip>

      <!--      todo 链接-->
      <el-tooltip
        class="item"
        effect="dark"
        content="数据服务总线"
        placement="bottom-end"
      >
        <el-button
          type="text"
          onClick="window.open('http://fd.sctsjkj.com:6080/swagger/index.html')"
        >
          <img src="../assets/links.png" alt="" />
        </el-button>
      </el-tooltip>
      <!--      todo 退出-->
      <el-tooltip
        class="item"
        effect="dark"
        content="退出"
        placement="bottom-end"
      >
        <el-button @click="logOut" type="text">
          <img src="../assets/top_img_04.png" alt="" />
        </el-button>
      </el-tooltip>
    </div>

    <!--  todo 设置弹窗-->
    <base-dialog ref="BaseDialog" @submit="saveSetting">
      <el-form label-position="top" class="base-header-form">
        <el-form-item v-for="(item, index) in form" :key="index">
          <div slot="label">{{ formList[item.name].title }}</div>
          <!--          todo 下线-->
          <el-input
            v-if="item.minValue > -10000"
            type="number"
            step="0.01"
            max="999"
            class="set-input"
            v-model="item.minValue"
            @change="watchValue(item)"
          >
            <span slot="suffix">{{ formList[item.name].unit }}</span>
          </el-input>
          <el-input :disabled="true" v-else placeholder="无下限">
            <span slot="suffix">{{ formList[item.name].unit }}</span>
          </el-input>
          <span> — </span>
          <!--          todo 上限-->
          <el-input
            v-if="item.maxValue < 10000"
            type="number"
            step="0.01"
            min="-999"
            class="set-input"
            v-model="item.maxValue"
            @change="watchValue(item)"
          >
            <span slot="suffix">{{ formList[item.name].unit }}</span>
          </el-input>
          <el-input :disabled="true" v-else placeholder="无上限">
            <span slot="suffix">{{ formList[item.name].unit }}</span>
          </el-input>
        </el-form-item>
      </el-form>
    </base-dialog>
  </div>
</template>

<script>
// Todo VUE代码风格、拒绝硬编码！
import { isDelete } from "../plugins/commonJs";

/**
 *  作者：                                             时间：
 *  1,常量从js文件引入，不要定义魔术变量
 *  2,超过两次使用的方法定义为公共方法，import导入
 *  3,不涉及修改vuex中state中的值时候，不要在action中写方法
 *  4,css字体公用颜色，样式从文件中导入，个性化样式写在组件内
 *  5,定义全局标量来保存很多地方都要使用的值
 *  6,事先定义好基础的公共组件，全局注册
 */
export default {
  name: "BaseHeader",
  // Todo: 组件注册
  components: {},
  // Todo: 特性
  props: {},
  // Todo: 双向绑定的数据
  data() {
    return {
      form: [],
      formList: {
        CableTemperature: {
          title: "安全用电之电缆温度标准范围",
          unit: "℃"
        },
        ResidualCurrent: {
          title: "安全用电之剩余电流标准范围",
          unit: "mA"
        },
        PoolWaterPressure: {
          title: "消防水池水压标准范围",
          unit: "kPa"
        },
        PoolWaterHeight: {
          title: "消防水箱液位标准范围",
          unit: "M"
        },
        HydrantPressure: {
          title: "市政消火栓水压标准范围",
          unit: "kPa"
        },
        HydrantDumpEnergy: {
          title: "电量预警值",
          unit: "mA"
        }
      }
    };
  },
  // Todo: 计算属性
  computed: {},
  // Todo: 数据监听
  watch: {},
  // Todo: HTML 渲染前
  created: function() {},
  // Todo: HTML渲染后
  mounted: function() {},
  // Todo: 方法
  methods: {
    // todo 属性计算、范围取值的大小判定
    watchValue(val) {
      if (val.minValue - val.maxValue > 0) {
        [val.maxValue, val.minValue] = [val.minValue, val.maxValue];
      }
    },
    //  todo 获取设置
    getFire() {
      this.$axios.get(this.$api.GET_ALL_SETTING).then(res => {
        if (res.success) {
          this.form = res.result;
          this.$refs.BaseDialog.title = "FIRE_SETTING";
          this.$refs.BaseDialog.show = true;
        }
      });
    },
    // todo 保存设置
    saveSetting() {
      this.$axios.post(this.$api.SAVE_SETTING, this.form).then(res => {
        if (res.success) {
          this.$message.success("保存设置成功");
          this.$refs.BaseDialog.show = false;
        }
      });
    },
    //  todo 退出
    logOut() {
      isDelete("您确定注销当前用户登陆吗？")
        .then(() => {
          this.$axios.post(this.$api.USER_LOG_OUT).then(res => {
            if (res.success) {
              this.$message.success("退出成功！");
              this.$store.commit("setUserInfo");
              sessionStorage.clear();
              this.$cookies.remove("isLogin");
              this.$cookies.remove("userInfo");
              this.$router.push("/");
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss">
@import "../style/app-variables";
.base-header {
  box-sizing: border-box;
  border-image: url("../assets/mapBoeder.png") 32 37 fill / 1 / 0 stretch;
  border-bottom-style: solid;
  border-width: 12px 12px;
  background: none;
  height: 75px; // 为了兼容360浏览器而设置的一个固定高度、否则会被挤压
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
  /*border-bottom: 2px solid $dialog-main;*/
  i {
    font-size: 18px;
  }
  & > :nth-child(2) {
    text-align: center;
    font-size: 22px;
    padding-top: 30px;
  }
  & > :nth-child(1),// 左右两边的固定宽度，为了让中间内容居中
  &-but {
    min-width: 230px;
    text-align: center;
    /*  针对but*/
    & > :nth-child(1) {
      & > span {
        display: flex;
        align-items: center;
      }
    }
  }
  &-tit {
    width: 600px;
    height: 45px;
    opacity: 0.5;
    background-image: url("../assets/title2.gif");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center center;
  }
  &-form {
    .el-form-item__label {
      line-height: 20px;
    }
    .el-form-item {
      padding: 10px 0;
      margin-bottom: 5px;
      border-bottom: 1.2px solid $input-back;
    }
    .el-form-item__content {
      display: flex;
      span {
        margin: 0 5px;
      }
    }
  }
}
</style>

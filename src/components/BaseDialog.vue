<template>
  <el-dialog
    :title="TITLE_NAME[title]"
    class="base-dialog"
    center
    :fullscreen="isFull"
    :visible.sync="show"
    :width="diaWidth"
  >
    <slot>弹窗内容</slot>
    <!--    <el-button @click="isFull = !isFull">全屏</el-button>-->
    <span slot="footer" class="dialog-footer" v-if="isShowFooter">
      <el-button v-if="!isDeit" type="text" @click="submit"
        ><img src="../assets/save.png"
      /></el-button>

      <el-button v-else type="text" @click="editInfo"
        ><img src="../assets/xg_btn.png"
      /></el-button>
    </span>
  </el-dialog>
</template>

<script>
// Todo VUE代码风格、拒绝硬编码！
// todo 公共弹窗组件，内容使用slot插入，事件在相应的slot组件内触发，slot写在相应的页面内部，不单独使用一个vue组件，所有的弹窗title在改组件内定义
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
  name: "BaseDialog",
  // Todo: 组件注册
  components: {},
  // Todo: 特性
  props: {
    // 弹窗的宽度
    diaWidth: {
      type: String,
      default: "550px"
    },
    // 0-提交、1-修改、2-保存
    isDeit: {
      type: Number,
      default: 0
    },
    // 是否显示弹窗的footer
    isShowFooter: {
      type: Boolean,
      default: true
    }
  },
  // Todo: 双向绑定的数据
  data() {
    return {
      // todo 标题映射表
      TITLE_NAME: {
        DEFAULT: "标题",
        EDIT_UNIT_LIST: "单位详情",
        SITE_DETAIL: "站点详情",
        ADD_UNIT_LIST: "新增防火单位",
        ADD_MINI_STATION: "新增微型消防站",
        ADD_REPAIR_STATION: "新增维保单位",
        REPAIR_STATION_INFO: "维保单位详情",
        ADD_HYDRANT: "新增消火栓",
        HYDRANT_DETAIL: "消火栓详情",
        FAULT_DETAIL: "待处理故障",
        FIRE_SETTING: "消防设置",
        HIGH_FIRE_COUNT: "高频报警部件",
        ALARM_COUNT: "最近30天报警记录",
        UNIT_INSPECT_DETAIL: "监督检查详情",
        STREET_EVENT_DETAIL: "事件详情",
        GET_MAP_POSITION: "地图选点"
      },
      isFull: false,
      show: false,
      title: "DEFAULT"
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
    //  todo 提交
    submit() {
      this.$emit("submit");
    },
    //  todo 修改
    editInfo() {
      this.$emit("editInfo", 0);
    }
  }
};
</script>

<style lang="scss">
@import "../style/app-variables.scss";
.base-dialog {
  /*  todo 弹窗头部样式*/
  .el-dialog__header {
    background-color: $dialog-header;
    .el-dialog__title {
      color: $font-white;
      font-weight: bold;
      letter-spacing: 10px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: $font-white;
      font-size: 22px;
      font-weight: 600;
    }
  }
  /*todo 弹窗主要内容*/
  .el-dialog--center .el-dialog__body,
  .el-dialog--center .el-dialog__footer {
    background-color: $dialog-main;
    color: $font-white;
  }
  .el-dialog__body {
    padding: 15px 25px 5px;
  }
}
</style>

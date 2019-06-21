<template>
  <div class="base-aside">
    <el-menu
      :unique-opened="true"
      @select="handleSelect"
      :default-active="menuValue"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#167fc1"
    >
      <el-submenu
        v-for="(item, index) in asideList"
        :key="index"
        :index="item.title"
      >
        <template slot="title">
          <img alt="" :src="item.icon" />
          {{ item.title }}</template
        >
        <el-menu-item v-for="(a, b) in item.child" :key="b" :index="a.url">{{
          a.name
        }}</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="base-footer">
      <a :href="$store.state.SCREEN_URL">
        <img src="../assets/logo.png" alt="" />
      </a>
    </div>
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
export default {
  name: "BaseAside",
  // Todo: 组件注册
  components: {},
  // Todo: 特性
  props: {},
  // Todo: 双向绑定的数据
  data() {
    return {
      menuValue: "UnitList",
      asideList: [
        {
          title: "防火单位",
          icon: require("../assets/unit.svg"),
          child: [
            {
              url: "UnitMap",
              name: "地图展示"
            },
            {
              url: "UnitList",
              name: "单位列表"
            },
            {
              url: "UnitInspect",
              name: "监督检查"
            },
            {
              url: "UnitAlarm",
              name: "火灾报警监控"
            },
            {
              url: "UnitElectricity",
              name: "安全用电监控"
            },
            {
              url: "UnitFault",
              name: "设施故障监控"
            },
            {
              url: "UnitPatrol",
              name: "值班巡查监控"
            }
          ]
        },
        {
          title: "消防维保",
          icon: require("../assets/repair.svg"),
          child: [
            {
              url: "RepairList",
              name: "单位列表"
            }
          ]
        },
        {
          title: "网络街道",
          icon: require("../assets/streetGrid.svg"),
          child: [
            {
              url: "StreetGridList",
              name: "网格列表"
            },
            {
              url: "StreetEventList",
              name: "事件列表"
            }
          ]
        },
        {
          title: "微型消防站",
          icon: require("../assets/fireHouse.svg"),
          child: [
            // {
            //   url: "FirehouseMap",
            //   name: "地图展示"
            // },
            {
              url: "FirehouseList",
              name: "站点列表"
            }
          ]
        },
        {
          title: "市政消火栓",
          icon: require("../assets/hydrant.svg"),
          child: [
            {
              url: "GovernMap",
              name: "地图展示"
            },
            {
              url: "GovernHydrant",
              name: "消火栓列表"
            }
          ]
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
    this.menuValue = this.$route.name;
  },
  // Todo: HTML渲染后
  mounted: function() {},
  // Todo: 方法
  methods: {
    //  todo 菜单跳转
    handleSelect(key) {
      console.log(key);
      this.menuValue = key;
      this.$router.push({
        name: key
      });
    }
  }
};
</script>

<style lang="scss">
@import "../style/app-variables";
.base-aside {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  border-image: url("../assets/mapBoeder.png") 32 37 fill / 1 / 0 stretch;
  border-style: solid;
  border-width: 12px 12px;
  background: none;
  overflow: hidden;
}
/*二级菜单hover*/
.el-submenu .el-menu-item:hover {
  background-color: $table-header !important;
}
/*x二级菜单选中时*/
.el-submenu .el-menu-item:focus {
  color: $font-white !important;
  background-color: $table-header !important;
}
.el-menu {
  border-right: 0;
  & > li {
    margin: 3px 0 3px 0;
    /*background: linear-gradient(#006699, #000066, #006699);*/
    background-color: transparent;
  }
  /*  todo 二级菜单选中*/
  .el-menu-item.is-active {
    color: $font-white !important;
    background-color: $table-header !important;
    /*border-right: 6px solid red;*/
  }
  .el-menu-item.is-active:after {
    content: ">";
    float: right;
  }
  /*一级菜单hover*/
  .el-submenu__title:hover {
    transition: all 1s ease 0s;
    background-color: $input-back !important;
  }
  .el-menu,
  .el-menu--inline {
    background-color: transparent;
  }
  /*  todo 已打开*/
  /*
  .is-opened {
    .el-submenu__title {
      background-color: $input-back !important;
    }
  }
   */
}
</style>

<template>
  <div class="unit-map">
    <div id="container"></div>
    <div>
      <div>
        <el-form label-width="68px" class="unit-map-form">
          <el-form-item label="单位名称">{{ unitInfo.name }} </el-form-item>
          <el-form-item label="联系方式"
            >{{ unitInfo.contractName }} {{ unitInfo.contractPhone }}
          </el-form-item>
          <el-form-item label-width="0px">
            <base-table
              :column-list="tableList"
              :table-data="tableData"
            ></base-table>
          </el-form-item>
        </el-form>
      </div>
      <div id="myChart"></div>
    </div>
  </div>
</template>

<script>
// Todo VUE代码风格、拒绝硬编码！
import BaseTable from "../../components/BaseTable";
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
  name: "UnitMap",
  // Todo: 组件注册
  components: { BaseTable },
  // Todo: 特性
  props: {},
  // Todo: 双向绑定的数据
  data() {
    return {
      tableList: [
        {
          prop: "name",
          label: "数据类型"
        },
        {
          prop: "value",
          label: "最近30天记录"
        }
      ],
      tableData: [],
      unitInfo: {},
      map: Object,
      spots: []
    };
  },
  // Todo: 计算属性
  computed: {},
  // Todo: 数据监听
  watch: {},
  // Todo: HTML 渲染前
  created: function() {},
  // Todo: HTML渲染后
  mounted: function() {
    this.newMap();
    this.getSpot();
    this.getChartVal();
    // this.setChart();
  },
  // Todo: 方法
  methods: {
    // todo 初始化地图
    newMap() {
      this.map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11, //初始化地图层级
        mapStyle: "amap://styles/darkblue"
      });
    },
    // todo 获取地图点的标记
    getSpot() {
      let that = this;
      this.$axios
        .get(this.$api.GET_BREATHING_BUBBLE, {
          params: { value: 4 }
        })
        .then(res => {
          console.log(res);
          this.spots = res;
          let spotArray = [];
          this.getUnitInfo();
          for (let item of res) {
            let marker = new AMap.Marker({
              position: new AMap.LngLat(item.lng, item.lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: item.id
            });
            marker.item = item; // 自定义参数
            marker.on("click", that.getUnitInfo);
            spotArray.push(marker);
          }
          this.map.add(spotArray);
        });
    },
    // todo 获取防火单位的具体信息、标记点点击事件
    getUnitInfo(value = 0) {
      let id = value
        ? value.target.item.id
        : this.spots.length
        ? this.spots[0].id
        : "";
      this.$axios
        .get(this.$api.GET_FIRE_UNIT_INFO, {
          params: { id }
        })
        .then(res => {
          this.getTableInfo(id);
          this.unitInfo = res.result;
        });
    },
    // todo  表格统计信息
    getTableInfo(id) {
      this.tableData = [];
      this.$axios
        .get(this.$api.GET_FIRE_UNIT_DATA_GRID, {
          params: { id }
        })
        .then(res => {
          let val = res[1];
          for (let item in val) {
            this.tableData.push({
              name: item,
              value: val[item]
            });
          }
        });
    },
    // todo 获取防火单位类型柱状图
    getChartVal() {
      this.$axios.get(this.$api.GET_FIRE_UNIT_TYPE_HISTOGRAM).then(res => {
        this.setChart(res);
      });
    },
    // todo 初始化统计图
    setChart(val) {
      let yAxisData = [],
        seriesData = [];
      for (let item of val) {
        yAxisData.push(item.x);
        seriesData.push(item.y);
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      let option = {
        textStyle: {
          color: "rgba(255, 255, 255, 0.6)"
        },
        color: ["#62a5f4"],
        title: {
          text: "联网单位类型分布",
          textStyle: {
            color: "#62a5f4"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["2019年"],
          orient: "vertical", //垂直显示
          y: "top", //延Y轴居中
          x: "right" //居右显示
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: yAxisData
        },
        series: [
          {
            name: "2019年",
            type: "bar",
            data: seriesData
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss">
@import "../../style/app-variables";
.unit-map {
  display: flex;
  & > :first-child {
    flex: 1 0 auto;
    border: 2px solid $table-main;
    margin-right: 5px;
  }
  & > :last-child {
    width: 400px;
    & > :first-child,
    & > :last-child {
      border: 2px solid $table-main;
      box-sizing: border-box;
      min-height: 50%;
      padding: 15px;
    }
  }
  &-form {
    .el-form-item__label {
      color: rgba(255, 255, 255, 0.6) !important;
    }
    & > :nth-child(1) {
      .el-form-item__content {
        color: rgb(98, 165, 244);
        font-size: 26px;
      }
    }
    & > :nth-child(2) {
      .el-form-item__content {
        color: rgb(98, 165, 244);
        font-size: 16px;
      }
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>

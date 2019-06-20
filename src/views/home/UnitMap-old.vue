<template>
  <div class="unit-map">
    <!--    TODO 地图载体-->
    <div id="container"></div>
    <!--    todo 右侧信息栏-->
    <div>
      <!--      todo 基本信息框-->
      <div>
        <el-form label-width="68px" class="unit-map-form">
          <el-form-item label="单位名称">{{ unitInfo.name }} </el-form-item>
          <el-form-item label="联系方式">
            <span
              >{{ unitInfo.contractName }} {{ unitInfo.contractPhone }}</span
            >
            <div>{{ unitInfo.area }}({{ unitInfo.address }})</div>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-table
              border
              class="unit-map-table"
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column prop="name" label="数据类型"> </el-table-column>
              <el-table-column prop="value" align="center" label="最近30天记录">
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>

      <!--      todo 统计图-->
      <div>
        <div id="myChart"></div>
      </div>
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
  name: "UnitMapOld",
  // Todo: 组件注册
  components: {},
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
    this.getSpotMore();
    this.getChartVal();
    this.setarea();
    // this.diyMarker();
  },
  // Todo: 方法
  methods: {
    // todo 初始化地图
    newMap() {
      this.map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11, //初始化地图层级
        mapStyle: "amap://styles/darkblue" // 地图风格、极夜蓝
      });
    },
    // todo 获取地图点的标记、标记点
    getSpotMore() {
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
          let that = this;
          // 创建 AMap.Icon 实例：
          let icon = new AMap.Icon({
            size: new AMap.Size(40, 50), // 图标尺寸
            image:
              "//datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/32a60b3e7d599f983aa1a604fb640d7e.gif" // Icon的图像
          });
          for (let item of res) {
            let marker = new AMap.Marker({
              position: new AMap.LngLat(item.lng, item.lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: item.info,
              offset: new AMap.Pixel(-10, -10),
              icon: icon
            });
            marker.item = item; // 自定义参数
            marker.on("click", that.getUnitInfo);
            spotArray.push(marker);
          }
          this.map.add(spotArray);
          //  todo 点聚合
          let sts = [
            {
              url: "https://a.amap.com/jsapi_demos/static/images/green.png",
              size: new AMap.Size(32, 32),
              offset: new AMap.Pixel(-16, -16)
            }
          ];
          that.map.plugin(["AMap.MarkerClusterer"], function() {
            let cluster = new AMap.MarkerClusterer(
              that.map, // 地图实例
              spotArray, // 海量点组成的数组
              {
                averageCenter: true,
                styles: sts
              }
            );
          });
        });
    },
    // todo 获取地图点的标记、海量点
    getSpot() {
      let that = this;
      this.$axios
        .get(this.$api.GET_BREATHING_BUBBLE, {
          params: { value: 4 }
        })
        .then(res => {
          this.spots = res;
          let spotArray = [];
          this.getUnitInfo();
          // todo 遍历数组给点赋值
          for (let item of res) {
            spotArray.push({
              lnglat: [item.lng, item.lat], //点标记位置
              name: item.info,
              id: item.id
            });
          }
          let style = [
            {
              url:
                "//datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/32a60b3e7d599f983aa1a604fb640d7e.gif",
              anchor: new AMap.Pixel(6, 6),
              size: new AMap.Size(12, 12)
            }
          ];
          let mass = new AMap.MassMarks(spotArray, {
            opacity: 0.8,
            zIndex: 111,
            cursor: "pointer",
            style: style
          });
          let marker = new AMap.Marker({ content: "name", map: that.map }); // todo 创建一个海量图层
          // todo 点的hover
          mass.on("mouseover", function(e) {
            marker.setPosition(e.data.lnglat);
            // marker.setLabel({ content: e.data.name });
          });
          // todo 点击事件
          mass.on("click", that.getUnitInfo);
          mass.setMap(that.map);
        });
    },
    // todo 海量点标记
    offset(markers) {
      let that = this;
      this.map.plugin(["AMap.MarkerClusterer"], function() {
        let cluster = new AMap.MarkerClusterer(
          that.map, // 地图实例
          markers // 海量点组成的数组
        );
      });
    },
    // todo 自定义标记点
    diyMarker() {
      let that = this;
      AMapUI.loadUI(["overlay/SimpleMarker"], function(SimpleMarker) {
        new SimpleMarker({
          //自定义图标地址
          iconStyle: {
            src: "//webapi.amap.com/theme/v1.3/markers/b/mark_b.png",
            style: {
              width: "20px",
              height: "30px"
            }
          },
          map: that.map,
          showPositionPoint: true,
          position: [116.405285, 39.904989],
          zIndex: 100
        });
      });
    },
    // todo 行政区的划分
    setarea() {
      let that = this;
      AMap.plugin("AMap.DistrictSearch", function() {
        // 创建行政区查询对象
        let district = new AMap.DistrictSearch({
          // 返回行政区边界坐标等具体信息
          extensions: "all",
          // 设置查询行政区级别为 区
          level: "district"
        });

        district.search("成华区", function(status, result) {
          // 获取朝阳区的边界信息
          let bounds = result.districtList[0].boundaries;
          let polygons = [];
          if (bounds) {
            for (let i = 0, l = bounds.length; i < l; i++) {
              //生成行政区划polygon
              let polygon = new AMap.Polygon({
                map: that.map,
                strokeWeight: 1,
                path: bounds[i],
                fillOpacity: 0.1,
                fillColor: "#CCF3FF",
                strokeColor: "#62a5f4"
              });
              polygons.push(polygon);
            }
            // 地图自适应
            that.map.setFitView();
          }
        });
      });
    },
    // todo 获取防火单位的具体信息、标记点点击事件
    getUnitInfo(value = 0) {
      let id = value
        ? value.target.item.id
        : this.spots.length
        ? this.spots[0].id
        : "";
      // let id = value
      //   ? value.data.id
      //   : this.spots.length
      //   ? this.spots[0].id
      //   : "";
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
            itemStyle: {
              emphasis: {
                barBorderRadius: 7
              },
              normal: {
                barBorderRadius: 7, // 圆角
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#FF0066" },
                  { offset: 0.5, color: "#FF3300" },
                  { offset: 1, color: "#FF6633" }
                ]) // 渐变
              }
            },
            barWidth: 15, // 宽度
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
    background-color: $body-back !important; // 防止白屏
    flex: 1 0 auto;
    border: 2px solid $table-main;
    margin-right: 5px;
  }
  & > :last-child {
    width: 400px;
    display: flex;
    flex-direction: column;
    & > :first-child,
    & > :last-child {
      border: 2px solid $table-main;
      box-sizing: border-box;
      padding: 5px 5px 0 5px;
    }
    & > :last-child {
      flex: 2 0 auto;
      & > :first-child {
        min-height: 70%;
      }
    }
  }
  &-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    & > :nth-child(3) {
      margin-bottom: 0 !important;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  /* todo table*/
  .el-table th.is-leaf,
  .el-table td {
    border-color: $font-white;
  }
  /*todo hover*/
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
  }
  .el-table th {
    line-height: 20px;
    background-color: #000033;
    color: $font-white;
  }
  &-table {
    background-color: $table-body;
    margin: 5px 0;
    tbody {
      color: $font-white;
      & > :nth-child(2n) {
        background-color: $table-body;
      }
      & > :nth-child(2n + 1) {
        background-color: $table-main;
      }
    }
  }
}
</style>

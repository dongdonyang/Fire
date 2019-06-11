<template>
  <div class="govern-hydrant">
    <!--    todo 筛选-->
    <div class="govern-hydrant-header">
      <div>
        <el-input
          clearable
          size="small"
          placeholder="请输入设施编号"
          v-model="page.Sn"
          @change="getList"
        >
          <template slot="append"
            ><i class="el-icon-search"></i
          ></template>
        </el-input>
      </div>
      <div>
        <el-button type="text" @click="addInfo"
          ><img src="../../assets/new_btn.png" />新增消火栓</el-button
        >
        <el-button
          type="text"
          @click="$store.dispatch('exportFile', 'GET_HYDRANT_EXCEL')"
          ><img src="../../assets/dowload.png" />导出</el-button
        >
      </div>
    </div>

    <!--    todo 水压范围-->
    <div>
      <el-checkbox v-model="checked"
        >水压标准范围：>={{
          minWaterPressure
        }}MPa，当前水压低于标准的消火栓数量：{{ substanCount }}</el-checkbox
      >
    </div>

    <!--    todo table 列表-->
    <base-table
      :column-list="tableList"
      @deleteInfo="deleteInfo"
      @getDetail="getDetail"
      @slotDetail="slotDetail"
      :table-data="tableData"
    ></base-table>

    <!--    todo 分页-->
    <base-page v-bind:prop-pag.sync="page" @currentChange="getList"></base-page>

    <!--    todo 弹窗、添加编辑-->
    <base-dialog
      :is-show-footer="false"
      @befClosed="$refs.form.clearValidate()"
      ref="BaseDialog"
      @submit="submit"
      @editInfo="editInfo"
      :isDeit="isDeit"
    >
      <el-form
        label-width="100px"
        :model="form"
        :rules="rules"
        ref="form"
        class="govern-hydrant-form"
      >
        <el-form-item label="编号：" prop="sn">
          <el-input
            v-if="!isDeit"
            v-model="form.sn"
            placeholder="请输入设备编号（必填）"
          ></el-input>
          <span v-else>{{ form.sn }}</span>
        </el-form-item>
        <el-form-item label="区域：" prop="areaId">
          <div v-if="!isDeit">
            <div style="width: 150px">四川-成都-成华</div>
            <el-select v-model="form.areaId" placeholder="街道地址（必填）">
              <el-option
                v-for="item in areasOption"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              >
              </el-option>
            </el-select>
          </div>
          <span v-else>{{ form.areaName }}</span>
        </el-form-item>
        <el-form-item label="安装地址：" prop="address">
          <span>{{ form.address }}</span>
          <el-button type="text" @click="openMap">
            <img alt="" src="../../assets/positioning_img.png" />
            <span v-show="!form.address">地图定位</span>
          </el-button>
        </el-form-item>
        <el-form-item v-if="isDeit" label="当前水压：">
          <span>{{ form.pressure }} kPa</span>
        </el-form-item>
        <el-form-item v-if="isDeit" label-width="0">
          <div id="myLine" style="width: 500px; height: 300px"></div>
        </el-form-item>
      </el-form>
    </base-dialog>

    <!--      todo 最近30天报警记录-->
    <base-dialog ref="alarmRecord" :is-show-footer="false" class="alarm-record">
      <div>
        <span>[成华区服务中心]消火栓报警监控</span>
        <span>总次数：{{ recordPage.total }}</span>
      </div>
      <base-table
        :column-list="detailTableList"
        :table-data="partTableData"
      ></base-table>
      <!--        page-->
      <base-page
        v-bind:prop-pag.sync="recordPage"
        @currentChange="slotPageDetail"
      ></base-page>
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
  name: "GovernHydrant",
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
    return {
      hisPress: [],
      minWaterPressure: "0.14",
      substanCount: 0, // 低于标准水压的数量
      checked: false,
      key: 0,
      recordForm: {},
      areasOption: [],
      form: {},
      isDeit: 0, // 0-提交、1-修改、2-保存
      tableData: [],
      tableList: [
        {
          prop: "sn",
          label: "设施编号"
        },
        {
          prop: "address",
          label: "地址"
        },
        {
          prop: "pressure",
          label: "水压(kPa)"
        },
        {
          prop: "lastAlarmTime",
          label: "最近报警时间"
        },
        // {
        //   prop: "nearbyAlarmNumber",
        //   label: "最近30天报警次数",
        //   slot: "nearbyAlarmNumber",
        //   unit: "次"
        // },
        {
          prop: "status",
          label: "网关状态",
          map: "gatewayStatus"
        },
        {
          width: "140px",
          label: "操作"
        }
      ],
      detailTableList: [
        {
          prop: "creationTime",
          label: "时间"
        },
        {
          prop: "title",
          label: "事件"
        }
      ],
      partTableData: [],
      recordPage: {
        MaxResultCount: 10, // 查询当前页面的数量
        total: 0,
        SkipCount: 0, // 跳过的查询的数量
        current: 1 // 当前页面
      },
      page: {
        MaxResultCount: 10, // 查询当前页面的数量
        total: 0,
        SkipCount: 0, // 跳过的查询的数量
        current: 1 // 当前页面
      },
      rules: {
        sn: [{ required: true, message: "请输入设备编号", trigger: "change" }],
        areaId: [
          { required: true, message: "请输入安装地址", trigger: "change" }
        ],
        address: [
          { required: true, message: "请输入具体安装地址", trigger: "change" }
        ]
      }
    };
  },
  // Todo: 计算属性
  computed: {},
  // Todo: 数据监听
  watch: {
    checked: function() {
      this.page.current = 1;
      this.getList();
    }
  },
  // Todo: HTML 渲染前
  created: function() {
    this.getList();
  },
  // Todo: HTML渲染后
  mounted: function() {
    this.getAreas();
    this.getMinWaterPressure();
  },
  // Todo: 方法
  methods: {
    // todo 获取最低水压标准值
    getMinWaterPressure() {
      this.$axios
        .get(this.$api.GET_BY_NAME, {
          params: { name: "PoolWaterPressure" }
        })
        .then(res => {
          if (res.success) {
            this.minWaterPressure = res.result.minValue;
          }
        });
    },
    // todo 打开地图
    openMap() {
      this.key += 1;
      this.$refs.MapDia.show = true;
    },
    //  todo 设置位置信息
    setPosition(val) {
      console.log(val);
      this.$refs.MapDia.show = false;
      // this.form.lat = val.location.lat;
      // this.form.lng = val.location.lng;
      let addressValue = val.name
        ? `${val.pname}${val.cityname}${val.adname}${val.name}`
        : val;
      this.$set(this.form, "address", addressValue);
    },
    // todo 获取slot详情
    slotDetail(val, slotName) {
      console.log(val, slotName);
      this.recordPage.id = val.id;
      this.$refs.alarmRecord.title = "ALARM_COUNT";
      this.slotPageDetail().then(() => {
        this.$refs.alarmRecord.show = true;
      });
    },
    // todo 分页查询slot数据
    async slotPageDetail() {
      this.recordPage.SkipCount =
        (this.recordPage.current - 1) * this.recordPage.MaxResultCount;
      await this.$axios
        .get(this.$api.GET_NEARBY_ALARM_BYID, {
          params: this.recordPage
        })
        .then(res => {
          if (res.success) {
            this.partTableData = res.result.items;
            this.recordPage.total = res.result.totalCount;
          }
        });
    },
    //  todo 获取成华区区域
    getAreas() {
      this.$axios.get(this.$api.GET_AREAS_CHENGHUA).then(res => {
        if (res.success) {
          this.areasOption = res.result;
        }
      });
    },
    // todo 新增消火栓
    addInfo() {
      this.$refs.BaseDialog.show = true;
      this.$refs.BaseDialog.title = "ADD_HYDRANT";
      this.form = {};
      this.isDeit = 0;
    },
    // todo 修改
    editInfo(val) {
      let area = this.areasOption.find(item => {
        return item.areaName === this.form.areaName;
      });
      this.form.areaId = area ? area.areaId : "";
      this.isDeit = val;
    },
    //  todo 获取消火栓list
    getList() {
      this.page.SkipCount = (this.page.current - 1) * this.page.MaxResultCount;
      let url = this.checked
        ? this.$api.GET_PRESSURE_SUBSTANDARD
        : this.$api.GET_HYDRANT_LIST;
      this.$axios
        .get(url, {
          params: this.page
        })
        .then(res => {
          if (res.success) {
            ({
              items: this.tableData,
              totalCount: this.page.total
            } = res.result.pagedResultDto);
            this.substanCount = res.result.substanCount;
          }
        });
    },
    // todo 查看详情
    getDetail(id) {
      this.$axios
        .get(this.$api.GET_INFO_BYID, {
          params: { id }
        })
        .then(res => {
          if (res.success) {
            this.$nextTick(() => {
              this.getHisPress(id);
            });
            this.$refs.BaseDialog.show = true;
            this.$refs.BaseDialog.title = "HYDRANT_DETAIL";
            this.form = res.result;
            this.isDeit = 1;
          }
        });
    },
    // todo 获取历史水压统计信息
    getHisPress(id) {
      this.$axios
        .get(this.$api.GET_HYDRANT_PRESS_HISTORY, {
          params: { id }
        })
        .then(res => {
          this.hisPress = res;
          this.setChart();
        });
    },
    // todo 初始化统计图
    setChart() {
      let yAxisData = [],
        seriesData = [];
      for (let item of this.hisPress) {
        yAxisData.push(item.x.slice(5, 10));
        seriesData.push(item.y);
      }
      // 基于准备好的dom，初始化echarts实例
      let myLine = this.$echarts.init(document.getElementById("myLine"));
      let option = {
        title: {
          text: "历史水压",
          x: "center",
          textStyle: {
            color: "#62a5f4"
          }
        },
        color: ["#62a5f4"],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: yAxisData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: seriesData,
            type: "line",
            areaStyle: {}
          }
        ]
      };
      // 绘制图表
      myLine.setOption(option);
    },
    //  todo 删除数据
    deleteInfo(val) {
      this.$axios.post(this.$api.DELETE_HYDRANT, { id: val.id }).then(res => {
        if (res.success) {
          this.$message.success(`删除${val.sn}成功`);
          this.page.SkipCount = 1;
          this.getList();
        }
      });
    },
    //  todo 保存、编辑单位信息
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let as = this.form.id
            ? this.$axios.post(this.$api.UPDATE_HYDRANT, this.form)
            : this.$axios.post(this.$api.ADD_HYDRANT, this.form);
          as.then(res => {
            if (res.success) {
              this.$message.success(
                `${this.form.id ? "修改" : "新增"}消火栓成功`
              );
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
.govern-hydrant {
  display: flex;
  flex-direction: column;
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    & > :last-child {
      img {
        width: 20px;
      }
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
  & > :nth-child(2) {
    padding: 0 10px;
    text-align: right;
    color: rgb(255, 208, 75);
    a {
      color: red;
    }
  }
  & > :nth-child(3) {
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
    & > :nth-child(2) {
      .el-form-item__content :first-child {
        display: flex;
      }
    }
    /*  定图定位四个字的样式*/
    & > :nth-child(3) {
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

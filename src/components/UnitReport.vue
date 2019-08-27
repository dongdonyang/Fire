<template>
  <el-dialog id="printBox" class="unit-report" :visible.sync="show" width="30%">
    <!--startprint-->
    <div id="diaBody">
      <div>
        <div>智慧消防报告单</div>
        <img src="../assets/reportTitle.png" />
      </div>
      <div class="title">
        <img src="../assets/report_img_icon01.png" />单位基本信息
      </div>
      <div class="content">
        <el-form>
          <el-form-item
            v-for="(item, index) in formList"
            :key="index"
            :label="item.label"
            >{{ form[item.value] }}
            <div slot="label"><img :src="item.icon" />{{ item.label }}</div>
          </el-form-item>
        </el-form>
      </div>
      <div class="title">
        <img src="../assets/report_img_icon02.png" />火警报警监控
      </div>
      <div class="content">
        <ul>
          <li>已接入{{ form.firePointsCount }}台火警数据采集传输装置</li>
          <li>
            {{ form.fireFirstAlarmTime }}以来，接收火警消息{{
              form.fireAlarmCount
            }}条，已核警{{ form.fireAlarmCheckCount }}条
          </li>
          <li>
            最近报警时间：{{ form.fireLastAlarmTime }}，最近30天报警次数：{{
              form.fire30DayCount
            }}次，高频报警部件：{{ form.fireHighCount }}个
          </li>
        </ul>
      </div>
      <div class="title">
        <img src="../assets/report_img_icon03.png" />安全用电监控
      </div>
      <div class="content">
        <ul>
          <li>
            已接入{{ form.elecECount }}台剩余电流检测装置和{{
              form.elecTCount
            }}台电缆温度监测装置
          </li>
          <li>
            {{ form.elecFirstAlarmTime }}以来，接收报警消息{{
              form.elecAlarmCount
            }}条，已核警{{ form.elecAlarmCheckCount }}条
          </li>
          <li>
            最近报警时间：{{ form.elecLastAlarmTime }}，最近30天报警次数：{{
              form.elec30DayCount
            }}次，高频报警部件：{{ form.elecHighCount }}个
          </li>
        </ul>
      </div>
      <div class="title">
        <img src="../assets/report_img_icon04.png" />设施故障监控
      </div>
      <div class="content">
        <ul>
          <li>
            {{ form.firstFaultTime }}以来，共计发现设施故障{{
              form.faultCount
            }}起，已解决{{ form.faultProcessedCount }}起，目前待处理故障{{
              form.faultPendingCount
            }}起
          </li>
        </ul>
      </div>
      <div class="title">
        <img src="../assets/report_img_icon05.png" />值班巡查记录
      </div>
      <div class="content">
        <ul>
          <li>
            {{ form.firstDutyTime }}日以来，共计提交{{
              form.duty30DayCount
            }}条值班记录， 最近提交时间：{{ form.dutyLastTime }}，
            最近30天提交记录数：{{ form.duty30DayCount }}
          </li>
          <li>
            {{ form.firstPatrolTime }}日以来，共计提交{{
              form.patrolCount
            }}条巡查记录， 最近提交时间：{{ form.patrolLastTime }}，
            最近30天提交记录数：{{ form.patrol30DayCount }}
          </li>
        </ul>
      </div>
      <div class="title">
        <img src="../assets/report_img_icon06.png" />周边消防设施（1KM范围内）
      </div>
      <div class="content">
        <ul>
          <li>{{ form.nearMinistation }}</li>
          <li>智慧消火栓数量：{{ form.ministationCount }}个</li>
        </ul>
      </div>
    </div>
    <!--endprint-->
    <span slot="footer" class="dialog-footer">
      <el-button class="noprint" @click="getReports">打印</el-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 *  作者：0          时间：2019/7/10 11:51
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "UnitReport",
  components: {},
  props: {},
  data() {
    return {
      show: false,
      form: {},
      deform: {
        area: "暂无区域信息",
        address: "暂无位置信息",
        type: "暂无类型信息",
        contractName: "暂无联系人信息",
        safeUnit: "暂无维保单位信息",
        nearMinistation: "暂无周边消防站信息",
        ministationCount: "0",
        fireUnitName: "暂无防火单位名称信息",
        elecECount: "0",
        elecTCount: "0",
        elecFirstAlarmTime: "1970-1-1 00:00",
        elecAlarmCount: "0",
        elecAlarmCheckCount: "0",
        elecLastAlarmTime: "1970-1-1 00:00",
        elec30DayCount: "0",
        elecHighCount: "0",
        firePointsCount: "0",
        fireFirstAlarmTime: "1970-1-1 00:00",
        fireAlarmCount: "0",
        fireAlarmCheckCount: "0",
        fireLastAlarmTime: "1970-1-1 00:00",
        fire30DayCount: "0",
        fireHighCount: "0",
        firstFaultTime: "1970-1-1 00:00",
        faultCount: "0",
        faultProcessedCount: "0",
        faultPendingCount: "0",
        firstPatrolTime: "1970-1-1 00:00",
        patrolCount: "0",
        patrolLastTime: "1970-1-1 00:00",
        patrol30DayCount: "0",
        firstDutyTime: "1970-1-1 00:00",
        dutyCount: "0",
        dutyLastTime: "1970-1-1 00:00",
        duty30DayCount: "0"
      },
      formList: [
        {
          label: "名称：",
          icon: require("../assets/report_img_01.png"),
          value: "fireUnitName"
        },
        {
          label: "类型：",
          icon: require("../assets/report_img_02.png"),
          value: "type"
        },
        {
          label: "区域：",
          icon: require("../assets/report_img_03.png"),
          value: "area"
        },
        {
          label: "联系人：",
          icon: require("../assets/report_img_04.png"),
          value: "contractName"
        },
        {
          label: "联系方式：",
          icon: require("../assets/report_img_04.png"),
          value: "contractPhone"
        },
        {
          label: "维保单位：",
          icon: require("../assets/report_img_05.png"),
          value: "safeUnit"
        },
        {
          label: "地址：",
          icon: require("../assets/report_img_06.png"),
          value: "address"
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // todo 获取打印数据
    getInfo(FireUnitId) {
      this.$axios
        .get(this.$api.GET_FIRE_UNIT_REPORT_DATA, {
          params: { FireUnitId }
        })
        .then(res => {
          if (res.success) {
            this.form = res.result;
            // todo 过滤掉为null，“”的数据，然后和this.form合并成新的对象、这样就能使用data中定义的默认属性。
            for (let item in res.result) {
              if (res.result[item] === null) {
                delete res.result[item];
              }
            }
            let d = {};
            Object.assign(d, this.deform, res.result);
            this.form = d;
            this.show = true;
          }
        })
        .catch(() => {
          this.$message("该单位智慧消防报告暂未生成!")
          this.form = {};
          this.show = false;
        });
    },
    //    todo 打印
    getReports() {
      window.print();
    }
  }
};
</script>

<style lang="scss">
.unit-report {
  .el-dialog {
    margin: 0 auto !important;
    min-height: 100vh;
    width: 715px !important;
    display: flex;
    flex-direction: column;
    .el-dialog__body {
      flex: 2 0 auto;
      padding: 0 !important;
    }
    .el-dialog__header {
      display: none;
    }
    .el-form-item__label {
      color: #606266 !important;
    }
  }
  #diaBody {
    & > :nth-child(1) {
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 10px;
      & > :first-child {
        position: relative;
        top: 22px;
      }
    }
    & > :nth-child(3) {
      .el-form {
        padding: 0 20px;
        display: flex;
        flex-wrap: wrap;
      }
      .el-form-item__label {
        & > :first-child {
          display: flex;
        }
        /*label 图标样式*/
        img {
          margin-right: 8px;
          padding: 12px 0;
        }
      }
      .el-form-item {
        margin-bottom: 5px;
        width: 50%;
      }
    }
    .title {
      line-height: 35px;
      padding: 0 15px;
      color: #fff;
      background: linear-gradient(to right, rgb(31, 152, 255), #fff);
      display: flex;
      img {
        margin-right: 8px;
        padding: 10px 0;
      }
    }
    .content {
      li {
        padding: 5px;
      }
      padding: 0;
    }
  }
}
/* todo 打印样式、取消背景颜色*/
@media print {
  /*隐藏其他元素*/
  #app {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  /*修改遮挡找颜色*/
  .v-modal {
    background-color: #fff;
  }
  html,
  body {
    background-color: #fff;
  }
  /*隐藏打印按钮*/
  .noprint {
    display: none;
  }
}
</style>

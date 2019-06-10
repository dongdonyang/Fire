<template>
  <div class="base-table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        show-overflow-tooltip
        v-for="(item, index) in columnList"
        :width="item.width"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align ? item.align : 'center'"
      >
        <template slot-scope="scope">
          <!--            todo 操作-->
          <span v-if="!item.prop">
            <el-button
              @click="getDetail(scope.row.id, $event)"
              size="mini"
              type="text"
              icon="el-icon-tickets"
              >详情</el-button
            >
            <el-button
              v-if="isShowDelete"
              @click="deleteInfo(scope.row)"
              size="mini"
              type="text"
              icon="el-icon-delete"
              >删除</el-button
            >
          </span>
          <!--          todo 需要自定义内容slot]-->
          <span v-else-if="item.slot && scope.row[item.prop]">
            <el-button type="text" @click="getSlotDetail(scope.row, item.slot)"
              >{{ scope.row[item.prop] }}
              <span>{{ item.unit }}</span>
              <i class="el-icon-zoom-in"></i>
            </el-button>
          </span>
          <!--          todo 中文映射表map]-->
          <span
            v-else-if="item.map"
            :class="getName(scope.row[item.prop], item, 'className')"
            >{{ getName(scope.row[item.prop], item, "label") }}</span
          >
          <!--          todo 默认数据-->
          <span v-else>{{ scope.row[item.prop] | capitalize(item) }}</span>
        </template>
      </el-table-column>
      <!--      todo 无数据的展示页面-->
      <template slot="empty">
        暂无数据<i class="el-icon-brush"></i>
      </template>
    </el-table>
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

import { isDelete } from "../plugins/commonJs";
export default {
  name: "BaseTable",
  // Todo: 组件注册
  components: {},
  // Todo: 特性
  props: {
    // todo 列表的每一列、
    columnList: {
      type: Array,
      require: true
    },
    tableData: {
      type: Array,
      require: true
    },
    isShowDelete: {
      type: Boolean,
      default: true
    }
  },
  // todo 过滤器
  filters: {
    // todo 对于没有值和为0的值显示为-、unit是单位名
    capitalize: function(val, item) {
      return val ? `${val}${item.unit ? item.unit : ""}` : "—";
    }
  },
  // Todo: 双向绑定的数据
  data() {
    return {
      // 检查结果映射
      checkResult: [
        {
          label: "未指定",
          value: 0
        },
        {
          label: "合格",
          value: 1,
          className: "normal"
        },
        {
          label: "现场整改",
          value: -1,
          className: "correctNow"
        },
        {
          label: "限期整改",
          value: -2,
          className: "correct"
        },
        {
          label: "停业整顿",
          value: -3,
          className: "shutDown"
        }
      ],
      // 网格事件列表状态的映射
      StreetStatus: [
        {
          label: "未指定",
          value: 0
        },
        {
          label: "待处理",
          value: 1,
          className: "shutDown"
        },
        {
          label: "处理中",
          value: 2,
          className: "correctNow"
        },
        {
          label: "已办结",
          value: 3,
          className: "normal"
        }
      ],
      // 网关状态状态的映射、因为有部分数据存在中文的状态而不是数字
      gatewayStatus: [
        {
          label: "未指定",
          value: 0
        },
        {
          label: "在线",
          value: 1,
          className: "normal"
        },
        {
          label: "离线",
          value: -1,
          className: "correctNow"
        },
        {
          label: "异常",
          value: -2,
          className: "shutDown"
        }
      ],
      // 在线、离线样式表
      statusName: [
        {
          value: "离线",
          label: "离线",
          className: "correctNow"
        },
        {
          value: "在线",
          label: "在线",
          className: "normal"
        }
      ]
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
    // todo 获取中文 /获取样式 样式映射表，根据不同的类型和不同的值返回不同的class样式name
    getName(val, item, nature) {
      let name = this[item.map].find(i => {
        return i.value === val;
      });
      return name[nature] ? name[nature] : "";
    },
    // todo 某一列的详情
    getSlotDetail(val, slotName) {
      this.$emit("slotDetail", val, slotName);
    },
    //    todo 详情
    getDetail(id, event) {
      this.$emit("getDetail", id, event);
    },
    //    todo 删除
    deleteInfo(val) {
      isDelete()
        .then(() => {
          this.$emit("deleteInfo", val);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss">
@import "../style/app-variables.scss";
.base-table {
  .el-table th.is-leaf,
  .el-table td {
    border-bottom-width: 0;
  }
  i {
    padding: 0 4px;
  }
  background-color: $table-body;
  margin: 5px 0;
  .el-table th {
    background-color: $table-header;
    color: $font-white;
  }

  tbody {
    color: $font-white;
    & > tr:hover {
    }
    & > :nth-child(2n) {
      background-color: $table-body;
    }
    & > :nth-child(2n + 1) {
      background-color: $table-main;
    }
  }
  /*todo hover*/
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: $table-header !important;
  }
  /*  todo 数据为空*/
  .el-table__empty-block {
    background-color: $table-body;
  }
}
/*  todo 中文样式映射表、为了最大的扩展性、虽然现在只存在颜色不同、但这种情况下可以添加各种不同的样式、比单独传一个颜色值要好的多*/
.normal {
  color: #67c23a;
}
.shutDown {
  color: #f56c6c;
}
.correct {
  color: chocolate;
}
.correctNow {
  color: #e6a23c;
}
.off-line {
  color: #f56c6c;
}
</style>

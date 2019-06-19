const API = {
  //    todo 登录模块
  USER_LOGIN: "/api/services/app/FireDeptUser/UserLogin", // 用户登录(PC端)
  USER_LOG_OUT: "/api/services/app/FireDeptUser/UserLogout", // 注销用户
  GET_VERIFY_CODE: "/api/services/app/FireDeptUser/GetVerifyCode", // 获取验证码

  //todo 系统设置
  GET_ALL_SETTING: "/api/services/app/FireSetting/GetAllSetting", //获取所有设置
  GET_BY_NAME: "/api/services/app/FireSetting/GetByName", //根据设置名获取某一具体设置
  SAVE_SETTING: "/api/services/app/FireSetting/SaveSetting", //保存设置
  InitSetting: "/api/services/app/FireSetting/InitSetting", //设置初始化

  //    todo 防火单位模块
  // todo 防火单位地图
  GET_BREATHING_BUBBLE: "/api/services/app/BigScreen/GetBreathingBubble", // 首页：地图呼吸气泡层
  GET_FIRE_UNIT_DATA_GRID: "/api/services/app/BigScreen/GetFireUnitDataGrid", // 防火单位：单位数据表格
  GET_FIRE_UNIT_TYPE_HISTOGRAM:
    "/api/services/app/BigScreen/GetFireUnitTypeHistogram", // 防火单位：类型柱状图

  GET_AREAS_CHENGHUA: "/api/services/app/Area/GetAreasChenghua", //查询成华区子级区域数组
  GET_FIRE_UNIT_LIST_EXCEL: "/api/services/app/FireUnit/GetFireUnitListExcel", //（所有防火单位）导出防火单位列表excel
  GET_FIREALARM_LIST_EXCEL:
    "/api/services/app/FireUnit/GetAreas30DayFireAlarmListExcel", //（所有防火单位）火灾报警监控列表Excel导出
  GET_TEMP_ALARMLIST_EXCEL:
    "/api/services/app/FireUnit/GetAreas30DayTempAlarmListExcel", //（所有防火单位）安全用电监控列表Excel导出（电缆温度）
  GET_ELEC_ALARMLIST_EXCEL:
    "/api/services/app/FireUnit/GetAreas30DayElecAlarmListExcel", //（所有防火单位）安全用电监控列表Excel导出（剩余电流）
  GET_FAULTLIST_EXCEL: "/api/services/app/FireUnit/GetFireUnitFaultListExcel", //（所有防火单位）设备设施故障监控Excel导出
  GET_FIRE_UNIT_LIST: "/api/services/app/FireUnit/GetFireUnitList", //防火单位分页列表
  GetFireUnitListForMobile:
    "/api/services/app/FireUnit/GetFireUnitListForMobile", // 防火单位分页列表(手机端)
  ADD_FIRE_UNIT: "/api/services/app/FireUnit/Add", // 添加防火单位
  GET_FIRE_UNIT_TYPES: "/api/services/app/FireUnit/GetFireUnitTypes", // 获取防火单位类型数组
  UPDATE_FIRE_UNIT: "/api/services/app/FireUnit/Update", // 修改防火单位信息
  DELETE_FIRE_UNIT: "/api/services/app/FireUnit/Delete", // 删除防火单位
  GET_FIRE_UNIT_INFO: "/api/services/app/FireUnit/GetFireUnitInfo", //防火单位信息
  GetFireUnitAlarm: "/api/services/app/FireUnit/GetFireUnitAlarm", // 防火单位消防数据
  GetFireUnit30DayAlarmEle:
    "/api/services/app/FireUnit/GetFireUnit30DayAlarmEle", // 安全用电最近30天报警记录查询
  GET_FIRE_UNIT_30DAY_LIST:
    "/api/services/app/FireUnit/GetFireUnit30DayAlarmFire", // 火警预警最近30天报警记录查询
  GetFireUnitHighFreqAlarmEle:
    "/api/services/app/FireUnit/GetFireUnitHighFreqAlarmEle", //安全用电高频报警部件查询
  GET_HIGH_FREQ_ALARM_LIST:
    "/api/services/app/FireUnit/GetFireUnitHighFreqAlarmFire", //火警预警高频报警部件查询
  GET_GATEWAY_STATUS_TYPES: "/api/services/app/FireUnit/GetGatewayStatusTypes", //获取网关状态类型
  GET_ALARM_ELECT: "/api/services/app/FireUnit/GetFireUnitHighFreqAlarmElecT", //（单个防火单位）安全用电高频报警部件查询（电缆温度）
  GET_ALARM_ELECE: " /api/services/app/FireUnit/GetFireUnitHighFreqAlarmElecE", //（单个防火单位）安全用电高频报警部件查询（剩余电流）
  GET_AREAS30DAY_TEMPALARM_LIST:
    "/api/services/app/FireUnit/GetAreas30DayTempAlarmList", //（所有防火单位）安全用电监控列表（电缆温度）
  GET_AREAS30DAY_ELECALARM_LIST:
    "/api/services/app/FireUnit/GetAreas30DayElecAlarmList", //（所有防火单位）安全用电监控列表（剩余电流）
  Get_30Day_Alarm_ElecE:
    "/api/services/app/FireUnit/GetFireUnit30DayAlarmElecE", //（单个防火单位）安全用电最近30天(剩余电流)报警记录查询
  Get_30Day_Alarm_ElecT:
    "/api/services/app/FireUnit/GetFireUnit30DayAlarmElecT", //（单个防火单位）安全用电最近30天(电缆温度)报警记录查询
  GET_AREAS_ALARM_LIST: "/api/services/app/FireUnit/GetAreas30DayFireAlarmList", //（所有防火单位）火灾报警监控列表
  GET_FIRE_UNIT_PENDING_FAULT:
    "/api/services/app/FireUnit/GetFireUnitPendingFault", //设备设施故障待处理故障查询
  GET_FIRE_UNIT_FAULT_LIST: "/api/services/app/FireUnit/GetFireUnitFaultList", // （所有防火单位）设备设施故障监控
  GET_FIRE_UNIT_PATROL_LIST: "/api/services/app/FireUnit/GetFireUnitPatrolList", //（所有防火单位）值班巡查监控（巡查记录）
  GET_FIRE_UNIT_DUTY_LIST: "/api/services/app/FireUnit/GetFireUnitDutyList", //（所有防火单位）值班巡查监控（值班记录）
  GET_NOPATROL7DAY_LIST:
    "/api/services/app/FireUnit/GetNoPatrol7DayFireUnitList", //（所有防火单位）超过7天没有巡查记录的单位列表
  GET_NODUTY1DAY_LIST: "/api/services/app/FireUnit/GetNoDuty1DayFireUnitList", //（所有防火单位）超过1天没有值班记录的单位列表
  //  todo 监管执法模块
  GET_SUPERVISION_LIST: "/api/services/app/Supervision/GetList", //分页
  Get_Supervision_Detail:
    "/api/services/app/Supervision/GetSingleSupervisionDetail", //获取单条执法记录明细项目信息
  Get_Supervision_Main:
    "/api/services/app/Supervision/GetSingleSupervisionMain", //获取单条记录主信息
  GetSupervisionItem: "/api/services/app/Supervision/GetSupervisionItem", //获取所有监管执法项目
  GET_SUPERVISION_LIST_EXCEL:
    "/api/services/app/Supervision/GetSupervisionListExcel", //监督查询EXCEL导出

  //    todo 消防维保模块
  GET_SAFE_KEY: "/api/services/app/SafeUnit/GetSelectSafeUnits", //查询维保单位(模糊查询)新增时候使用
  ADD_SAFE_UNITS: "/api/services/app/SafeUnit/Add", //新增
  UPDATE_SAFE_UNITS: "/api/services/app/SafeUnit/Update", //修改
  DELETE_SAFE_UNITS: "/api/services/app/SafeUnit/Delete", //删除
  GET_SAFE_UNITS_INFO: "/api/services/app/SafeUnit/GetById", //获取单个实体信息
  GET_SAFE_UNITS: "/api/services/app/SafeUnit/GetList", //分页
  GET_SAFE_UNITS_EXCEL: "/api/services/app/SafeUnit/GetSafeUnitsExcel", //消防维保EXCEL导出

  //    todo 社区网络模块
  GET_USER_LIST: "/api/services/app/StreetGrid/GetUserList", //网格员分页
  GET_STREET_GRID_EXCEL: "/api/services/app/StreetGrid/GetStreetGridExcel", //街道网格Excel导出
  // todo 事件列表
  GET_EVENT_BYID: "/api/services/app/StreetGridEvent/GetEventById", //获取单个实体信息
  GET_GRID_EVENT_LIST: "/api/services/app/StreetGridEvent/GetList", //分页
  GET_STREET_EVENT_EXCEL:
    "/api/services/app/StreetGridEvent/GetStreetEventExcel", //街道事件Excel导出

  //    todo 微型消防站模块
  GET_STATION_EXCEL: "/api/services/app/MiniFireStation/GetStationExcel", //微型消防站Excel导出
  ADD_MINI_FIRE_STATION: "/api/services/app/MiniFireStation/Add", // 新增
  DELETE_MINI_FIRE_STATION: "/api/services/app/MiniFireStation/Delete", // 删除
  GET_MINI_FIRE_STATION: "/api/services/app/MiniFireStation/GetById", // 获取单个微型消防站信息
  GET_FIRE_STATION: "/api/services/app/MiniFireStation/GetList", // 分页
  GetNearbyStation: "/api/services/app/MiniFireStation/GetNearbyStation", // 根据坐标点获取附近1KM直线距离内的微型消防站
  UPDATE_MINI_FIRE_STATION: "/api/services/app/MiniFireStation/Update", // 修改
  GET_PRESSURE_SUBSTANDARD: "/api/services/app/Hydrant/GetPressureSubstandard", //查询水压低于标准值的消火栓

  //    todo 市政消火栓模块
  GET_HYDRANT_BREATHING_BUBBLE:
    "/api/services/app/BigScreen/GetHydrantBreathingBubble", //消火栓：地图呼吸气泡层
  GET_HYDRANT_PRESS_HISTORY:
    "/api/services/app/BigScreen/GetHydrantPressHistory", // 消火栓：历史水压
  GET_HYDRANT_AREA_HISTOGRAM:
    "/api/services/app/BigScreen/GetHydrantAreaHistogram", //消火栓：区域柱状图
  ADD_HYDRANT: "/api/services/app/Hydrant/Add", //   新增
  DELETE_HYDRANT: "/api/services/app/Hydrant/Delete", //     删除
  GET_INFO_BYID: "/api/services/app/Hydrant/GetInfoById", //     获取实体信息
  GET_HYDRANT_LIST: "/api/services/app/Hydrant/GetListForWeb", //     Web端分页
  GET_NEARBY_ALARM_BYID: "/api/services/app/Hydrant/GetNearbyAlarmById", //     获取最近30天报警记录
  UPDATE_HYDRANT: "/api/services/app/Hydrant/Update", //    修改
  GET_HYDRANT_EXCEL: " /api/services/app/Hydrant/GetHydrantExcel" // 消火栓Excel导出
};
export default API;

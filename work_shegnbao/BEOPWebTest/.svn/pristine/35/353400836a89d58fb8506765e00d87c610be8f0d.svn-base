class I18n(object):
    """description of class"""
    dictLang =  ''

    #params: language("en", "cn", ...)
    def __init__(self, language):
        #TODO
        #module = __import__("beopWeb.mod_iot.i18n." + language, None, None,
        #[])
        #curClass = getattr(module, 'i18n_resource_cn')

        self.dictLang = self.i18n_resource[language]


    def get(self, key):
        return self.dictLang.get(key)


    i18n_resource = {
        'cn': {
            #============== Common ==============
            'Group': "基准分组",
            'Project': "基准项目",
            'Thing': "基准物",
            'SupplyT': "供水温度",
            'ReturnT': "回水温度", 
            'OnOff': "开关",
        
        
            #============== Group ==============
            #CTS
            'CTSGroup': "冷却塔系统",
            'CWAutoOpenStatus': "自动运行开关状态",
            'CWSupplyT': "供水温度",
            'CWReturnT': "回水温度", 
            'CWOnOff': "开关",
            #GroupRoom
            'GroupRoom': "房间",
        

            #============== Thing ==============

            #ThingHVAC
            'ThingHVAC': '暖通基准物',

            #CT
            'CT': "冷却塔",
            'CTRemoteMode': "远程本地模式",
        	'CTAutoMode': "手自动模式",
        	'CTRunHour': "运行时间",
        	'CTEnable': "使能",
        	'CTErr': "报警	",
        	'CTVSDErr': "水泵变频器报警",
        	'CTOnOffSet': "启停",
        	'CTVSDFreq': "频率反馈",
        	'CTVSDFreqSet': "频率设定",
        	'CTVSDFreqPercent': "频率百分比反馈",
        	'CTVSDFreqPercentSet': "频率百分比设定",
        	'CTPower': "功率",
        	'CTElecUse': "用电量",
        	'CTRunNumber': "实际运行数量",
        	'CTRunNumberSet': "运行数量建议",
            'CTSupplyT': "供水温度",
            'CTReturnT': "回水温度", 
            'CTOnOff': "开关",

            #Ch
            'Ch': "冷机",
            "ChAmpLmtSetPointFeedback":"电流百分比限定值反馈",
            "ChAMPS":"电流百分比",
            "ChChWTempSupplySetPoint":"冷水温度设定",
            "ChChWTempSupplyActiveSetPoint":"冷水温度实际设定反馈",
            "ChLeaveEvapTemp":"蒸发器出水温度",
            "ChEnterEvapTemp":"蒸发器进水温度",
            "ChEnterCondTemp":"冷凝器进水温度",
            "ChLeaveCondTemp":"冷凝器出水温度",
            "ChEvapAppT":"冷凝器趋近温度",
            "ChCondAppT":"蒸发器趋近温度",
            "ChEvapSatuTemp":"蒸发器饱和温度",
            "ChCondSatuTemp":"冷凝器饱和温度",
            "ChWarningFaultCode":"故障代码",
            "ChCondPressure":"冷凝器冷媒压力",
            "ChEvapPressure":"蒸发器冷媒压力",
            "ChEvapTemp":"蒸发器冷媒温度",
            "ChCondTemp":"冷凝器冷媒温度",
            "ChGasExhaustTemp":"排气温度",
            "ChRunHour":"运行时间",
            "ChOILPD":"油压差",
            "ChOILT":"油温",
            "ChGearT":"轴承温度",
            "ChCoilT":"线圈温度",
            "ChInletValvePosition":"导叶开度",
            "ChPressureRiserPosition":"扩压器开度",
            "ChVoltage":"实际电压",
            "ChCurrent":"实际电流",
            "ChRunCode":"运行代码",
            "ChErr":"故障报警",
            "ChChWTempSupplySetPointEnable":"水温设定指令发送使能",
            "ChEnable":"是否可用",
            "ChAutoMode":"控制模式",
            "ChOnOff":"开关状态",
            "ChOnOffSet":"开关指令",
            "ChOnOffSetEnable":"开关指令发送使能",
            "ChPower":"功率",
            "ChElecUse":"用电量",
            "ChPowerFactor":"功率因数",
            "ChLnVoltAB":"AB线电压",
            "ChLnVolt":"实际线电压",
            "ChLnVoltPercent":"线电压百分比",
            "ChLnCurrent":"实际线电流  ",
            "ChLnCurrentL1":"L1线电流",
            "ChOILFilterP":"油过滤器压",
            "ChGasExhaustSuperhrat":"排气过热度",
            "ChMotorAmps":"马达电流比",
            "ChMotorCurrent":"马达电流",
            "ChSpoolValvePosition":"滑阀位置",
            "ChOILTankPressure":"油缸压力",
            "ChOILPumpPressure":"油泵压力",
            "ChRemoteMode":"远程控制",


            #AHU
            'AHU': "空调箱",
            "SeasonSwitch":"季节切换开关",
            "SeasonSwitchVlve":"冬夏切换阀",
            "UnitOnOff":"运行状态",
            "UnitOnOffSet":"启停控制",
            "UnitError":"故障状态",
            "UnitAutoMode":"手自动状态",
            "UnitSmokeWarning":"烟雾报警",

            #FCU
            'FCU': "风机盘管",
            "FCUOnOff":"开关状态",
            "FCUTSet":"设定温度",
            "FCUHighTempAlarm":"高温开关",
            "FCUCVM":"水阀",
            "FCUOnOffSet":"开关指令",

            #WP
            'WP': "水泵",
            "PumpRemoteMode":"远程本地模式",
            "PumpAutoMode":"手自动模式",
            "PumpRunHour":"运行时间",
            "PumpOnOff":"运行",
            "PumpEnable":"使能",
            "PumpErr":"报警",
            "PumpVSDErr":"变频器报警",
            "PumpOnOffSet":"启停",
            "PumpVSDFreq":"频率反馈",
            "PumpVSDFreqSet":"频率设定",
            "PumpPower":"功率",
            "PumpElecUse":"用电量",


            #VAVBox
            'VAVBox': "变风量系统",
            "VAVBoxAirFlow":"风量",
            "VAVBoxAutoMode":"手自动模式",
            "VAVBoxDamperPosition":"风阀开度",
            "VAVBoxAirFlowSet":"设定风量",
            "VAVBoxSeasonMode":"季节模式",
            "VAVBoxRoomTemp":"房间温度",

            #HX
            'HX': "换热器",
            "HXPriSupplyT":"一次侧供水温度",
            "HXPriReturnT":"一次侧回水温度",
            "HXSecSupplyT":"二次侧供水温度",
            "HXSecReturnT":"二次侧回水温度",
            "HXBypassValvePositionSet":"旁通阀开度设定",
            "HXBypassValvePosition":"旁通阀开度",

            #IceTank
            'IceTank': "蓄冰槽",
            'IceTankLevel': "液位",
            "IceTankRatio":"蓄冰率",

            #Vlve
            'Vlve': "阀门",
            'VlveRemoteMode': "阀门远程本地模式",
            'VlveAutoMode': "阀门手自动模式",
            'VlveOpenStatus': "阀门开关状态",
            'VlveEnable': "阀门使能",
            'VlveErr': "阀门报警",
            'VlveOpenSet': "阀门开指令",
            'VlveCloseSet': "阀门关指令",
            'VlvePosition': "阀门开度",
            "VlvePositionSet":"阀门开度指令",
            "VlveCommStatus":"阀门通信状态",


            #ThingSmartDevice
            'ThingSmartDevice': '智能硬件',

            #SensorTemp
            'SensorTemp': '温度传感器',
            "SensorT": '温度',
            "SensorH": '湿度',
            "SensorBattery": '电量',
            "SensorSignalStrength": '信号',

            #ControllerFCU
            'ControllerFCU': '控制器',
            "FCUSignalStrength": '信号',
            "FCUBattery": '电量',
            "FCUPower": '功率',
            "FCUOnOff": '启停',
            "FCUSeasonMode": '季节模式',
            "FCUValvePositionD": '水阀开度(数字量)',
            "FCUValvePositionA": '水阀开度',
            "FCUSpeedD": '风速(数字量)',
            "FCUSpeedA": '风速',

            "FCUValvePositionDSet": '水阀开度设定(数字量)',
            "FCUValvePositionASet": '水阀开度设定',
            "FCUSpeedDSet": '风速设定(数字量)',
            "FCUSpeedASet": '风速设定',
            "FCUSeasonModeSet": '季节模式设定',
            "FCUOnOffSet": '启停设定',
            "FCUAutoMode": '手自动设定',
            "FCUTSet": '温度设定',
            }
        }
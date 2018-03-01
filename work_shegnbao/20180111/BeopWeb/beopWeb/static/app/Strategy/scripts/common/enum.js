;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            namespace('beop.strategy.enumerators')
        );
    }
}(this, function(exports) {

    // 策略类型
    const strategyTypes = exports.strategyTypes = {
        DIAGNOSIS: 0,
        KPI: 1,
        CALC_POINT: 2
    };
    //策略级别
    const strategyLevels = exports.strategyLevels = {
        STRATEGY: 0,
        SYSTEM: 1
    };

    // 模块类型
    const moduleTypes = exports.moduleTypes = {
        PYTHON: 1,
        REMOTE_API: 2,
        KPI: 3,
        RULE: 4,
        DIAGNOSIS: 101,
        FOURIER_ANALYSIS: 102,
        WAVELET_ANALYSIS: 103,
        FITTED_CURVE: 104,
        FLYBACK: 105,
        FORECAST: 106,
        FUZZY_RULE: 107,
        CORRELATION_ANALYSIS: 108,
        HISTORICAL_CURVE: 201,
        TABLE: 202,
        THREE_DIMENSIONS_VIEW: 203,
        INPUT: 300,
        OUTPUT: 301,
        RULE_TEMPLATE_MODULE: 1000
    };

    // 模块输入输出参数类型
    const moduleInputOutputTypes = exports.moduleInputOutputTypes = {
        // 实时数据源
        DATA_SOURCE: 0,
        INPUT_DIAGNOSIS_FUZZYRULE: 1,
        EMAIL: 2,
        INPUT_HISTORY_DATA_SOURCE: 3,
        MESSAGE: 14,
        NUMBER: 10,
        STRING: 11,
        TIME: 12,
        JSON: 13,
        OUTPUT_DATA_SOURCE: 30,
        OUTPUT_DIAGNOSIS: 31,
        COMMON_VARIABLE: 40,
        OTHER_MODULES: 100
    };

    //模糊规则输出故障分组
    const fuzzyRuleFaultGroup = exports.fuzzyRuleFaultGroup = {
        CAPACITY: 0,
        CONTROL: 1,
        IMPROPER_BEHAVIOR: 2,
        COMFORT:3,
        SENSOR:4,
        DEVICE:5,
        OTHER:6
    };

    //模糊规则输出故障来源
    const fuzzyRuleFaultSource = exports.fuzzyRuleFaultSource = {
        DIAGNOSIS: 0,
        BA: 1
    };

    //模糊规则输入对应单位
    const fuzzyRuleUnit = exports.fuzzyRuleUnit = {
        TEMPERATURE: 0,
        TEMPERATURE_F: 1,
        WEIGHT: 2,
        ENERGY: 3,
        K_ENERGY: 4,
        M_ENERGY: 5,
        POWER: 6,
        ELECTRIC:7,
        FREQUENCY:8,
        FREQUENCY_P:9,
        FLOW_S:10,
        FLOW_H:11,
        FLOW_M:12,
        LEVEL:13,
        LEVEL_C:14,
        HIGHT:15,
        HIGHT_C:16,
        HIGHT_D:17,
        HIGHT_M:18,
        SPEED:19,
        SPEED_K:20,
        RADIATION:21,
        ILLUMINATION:22,
        WATER_LEVEL:23,
        WATER_LEVEL_C:24,
        PRESSURE:25,
        K_PRESSURE:26,
        B_PRESSURE:27,
        LOAD:28,
        LOAD_H:29,
        RATIO:30,
        RATIO_E:31,
        RATIO_O:32,
        CONCENTRATION: 33,
        REN_MIN_BI:34,
        DOLLAR:35,
        STATUS:36,
        COMMOND:37
    };
    //模糊规则输入对应单位中英文
    exports.fuzzyRuleUnitNames = Object.defineProperties({},{
        [fuzzyRuleUnit.TEMPERATURE]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '温度(℃)' : 'Temperature(℃)';
            }
        },
        [fuzzyRuleUnit.TEMPERATURE_F]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '温度(℉)' : 'Temperature(℉)';
            }
        },
        [fuzzyRuleUnit.WEIGHT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '重量(Kg)' : 'Weight(kg)';
            }
        },
        [fuzzyRuleUnit.ENERGY]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '能量(j)' : 'Energy(j)';
            }
        },
        [fuzzyRuleUnit.K_ENERGY]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '能量(kj)' : 'Energy(kj)';
            }
        },
        [fuzzyRuleUnit.M_ENERGY]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '能量(mj)' : 'Energy(mj)';
            }
        },
        [fuzzyRuleUnit.POWER]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '功率(kW)' : 'Power(kW)';
            }
        },
        [fuzzyRuleUnit.ELECTRIC]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '电量(kWh)' : 'EnergyComsuption(kWh)';
            }
        },
        [fuzzyRuleUnit.FREQUENCY]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '频率(Hz)' : 'Frequency(Hz)';
            }
        },
        [fuzzyRuleUnit.FREQUENCY_P]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '频率(%)' : 'Frequency(%)';
            }
        },
        [fuzzyRuleUnit.FLOW_S]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '流量(l/s)' : 'Flow(l/s)';
            }
        },
        [fuzzyRuleUnit.FLOW_H]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '流量(m³/h)' : 'Flow(m³/h)';
            }
        },
        [fuzzyRuleUnit.FLOW_M]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '流量(L/min)' : 'Flow(L/min)';
            }
        },
        [fuzzyRuleUnit.LEVEL]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '液位(m)' : 'Level(m)';
            }
        },
        [fuzzyRuleUnit.LEVEL_C]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '液位(cm)' : 'Level(cm)';
            }
        },
        [fuzzyRuleUnit.WATER_LEVEL]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '水位(m)' : 'Waterlevel(m)';
            }
        },
        [fuzzyRuleUnit.WATER_LEVEL_C]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '水位(cm)' : 'Waterlevel(cm)';
            }
        },
        [fuzzyRuleUnit.HIGHT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '高度(mm)' : 'Hight(mm)';
            }
        },
        [fuzzyRuleUnit.HIGHT_C]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '高度(cm)' : 'Hight(cm)';
            }
        },
        [fuzzyRuleUnit.HIGHT_D]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '高度(dm)' : 'Hight(dm)';
            }
        },
        [fuzzyRuleUnit.HIGHT_M]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '高度(m)' : 'Hight(m)';
            }
        },
        [fuzzyRuleUnit.SPEED]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '速度(m/s)' : 'Speed(m/s)';
            }
        },
        [fuzzyRuleUnit.SPEED_K]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '速度(km/h)' : 'Speed(km/h)';
            }
        },
        [fuzzyRuleUnit.RADIATION]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '日射量(W/m2)' : 'Radiation(W/m2)';
            }
        },
        [fuzzyRuleUnit.ILLUMINATION]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '照度(lux)' : 'Illumination(lux)';
            }
        },
        [fuzzyRuleUnit.PRESSURE]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '帕(Pa)' : 'Pressure(Pa)';
            }
        },
        [fuzzyRuleUnit.K_PRESSURE]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '千帕(kPa)' : 'Pressure(kPa)';
            }
        },
        [fuzzyRuleUnit.B_PRESSURE]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '压力(bar)' : 'Pressure(bar)';
            }
        },
        [fuzzyRuleUnit.LOAD]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '冷量(RT)' : 'Load(RT)';
            }
        },
        [fuzzyRuleUnit.LOAD_H]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '冷量(RTH)' : 'Load(RTH)';
            }
        },
        [fuzzyRuleUnit.RATIO]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '比例(%)' : 'Ratio(%)';
            }
        },
        [fuzzyRuleUnit.RATIO_E]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '电流百分比(%)' : 'AmperRatio(%)';
            }
        },
        [fuzzyRuleUnit.RATIO_O]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '开度(%)' : 'OpenRatio(%)';
            }
        },
        [fuzzyRuleUnit.CONCENTRATION]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '浓度(ppm)' : 'Concentration(ppm)';
            }
        },
        [fuzzyRuleUnit.REN_MIN_BI]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '人民币(RMB)' : 'Money(RMB)';
            }
        },
        [fuzzyRuleUnit.DOLLAR]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '美元($)' : 'Dollar($)';
            }
        },
        [fuzzyRuleUnit.STATUS]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '状态' : 'Status';
            }
        },
        [fuzzyRuleUnit.COMMOND]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '控制指令' : 'Commond';
            }
        }
    })

    //模糊规则输出故障分组对应中文
    exports.fuzzyRuleFaultGroupNames = Object.defineProperties({}, {
        [fuzzyRuleFaultGroup.CAPACITY]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '容量' : 'Capacity';
            }
        },
        [fuzzyRuleFaultGroup.CONTROL]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '控制' : 'Control';
            }
        },
        [fuzzyRuleFaultGroup.IMPROPER_BEHAVIOR]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '不恰当操作' : 'Improper Behavior';
            }
        },
        [fuzzyRuleFaultGroup.COMFORT]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '舒适性' : 'Comfort';
            }
        },
        [fuzzyRuleFaultGroup.SENSOR]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '传感器' : 'Sensor';
            }
        },
        [fuzzyRuleFaultGroup.DEVICE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '设备' : 'Device';
            }
        },
        [fuzzyRuleFaultGroup.OTHER]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '其他' : 'Other';
            }
        }
    })

    //模糊规则输出故障分组对应中文
    exports.fuzzyRuleFaultSourceNames = Object.defineProperties({}, {
        [fuzzyRuleFaultSource.DIAGNOSIS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '诊断' : 'Diagnosis';
            }
        },
        [fuzzyRuleFaultSource.BA]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? 'BA' : 'BA';
            }
        }
    })

    //模糊规则输出故障影响
    const fuzzyRuleFaultEffect = exports.fuzzyRuleFaultEffect = {
        ENERGY_WASTE: 0,
        COMFORT_ISSUE: 1,
        EQUIPMENT_HEALTH: 2,
        OTHER: 3
    };

    //模糊规则输出故障类型分组对应中文
    exports.fuzzyRuleFaultEffectNames = Object.defineProperties({}, {
        [fuzzyRuleFaultEffect.ENERGY_WASTE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '能耗浪费' : 'Energy Waste';
            }
        },
        [fuzzyRuleFaultEffect.COMFORT_ISSUE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '舒适性' : 'Comfort Issue';
            }
        },
        [fuzzyRuleFaultEffect.EQUIPMENT_HEALTH]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '设备健康' : 'Equipment Health';
            }
        },
        [fuzzyRuleFaultEffect.OTHER]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '其他' : 'Other';
            }
        }
    });

    //
    exports.strategyTypesNames = Object.defineProperties({}, {
        [strategyTypes.DIAGNOSIS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '诊断' : 'Diagnosis';
            }
        },
        [strategyTypes.KPI]: {
            enumerable: true,
            get() {
                return 'KPI';
            }
        },
        [strategyTypes.CALC_POINT]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '计算点' : 'Calculate Point';
            }
        }
    });

    exports.strategyLevelsNames = Object.defineProperties({}, {
        [strategyLevels.STRATEGY]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '策略' : 'Strategy';
            }
        },
        [strategyLevels.SYSTEM]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '系统' : 'System';
            }
        }
    });

    // 模块类型对应中文
    exports.moduleTypeNames = Object.defineProperties({}, {
        [moduleTypes.PYTHON]: {
            enumerable: true,
            get() {
                return 'Python';
            }
        },
        [moduleTypes.REMOTE_API]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '远程API' : 'Remote API';
            }
        },
        [moduleTypes.KPI]: {
            enumerable: true,
            get() {
                return 'KPI';
            }
        },
        [moduleTypes.RULE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '规则' : 'Rules';
            }
        },
        [moduleTypes.DIAGNOSIS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '诊断' : 'Diagnosis';
            }
        },
        [moduleTypes.FOURIER_ANALYSIS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '傅里叶分析' : 'Fourier';
            }
        },
        [moduleTypes.WAVELET_ANALYSIS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '小波分析' : 'Wavelet';
            }
        },
        [moduleTypes.FITTED_CURVE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '拟合曲线' : 'Curve Fitting';
            }
        },
        [moduleTypes.FLYBACK]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '回归' : 'Regression';
            }
        },
        [moduleTypes.CORRELATION_ANALYSIS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '相关性分析' : 'Correlation';
            }
        },
        [moduleTypes.FORECAST]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '预测' : 'Forecast';
            }
        },
        [moduleTypes.FUZZY_RULE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '模糊规则' : 'Fuzzy Rules';
            }
        },
        [moduleTypes.HISTORICAL_CURVE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '历史曲线' : 'Curve';
            }
        },
        [moduleTypes.TABLE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '表格' : 'Table';
            }
        },
        [moduleTypes.THREE_DIMENSIONS_VIEW]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '3D视图' : '3D Chart';
            }
        },
        [moduleTypes.RULE_TEMPLATE_MODULE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '外部规则' : 'Other Rule';
            }
        }
    });

    // 模块输入输出参数对应图标
    exports.moduleInputOutputTypeIcons = {
        [moduleInputOutputTypes.DATA_SOURCE]: 'cloud',
        [moduleInputOutputTypes.NUMBER]: 'edit',
        [moduleInputOutputTypes.STRING]: 'file-text',
        [moduleInputOutputTypes.OTHER_MODULES]: 'link',
        [moduleInputOutputTypes.INPUT_DIAGNOSIS_FUZZYRULE]: 'menu-fold',
        [moduleInputOutputTypes.OUTPUT_DIAGNOSIS]: 'menu-unfold',
        [moduleInputOutputTypes.OUTPUT_DATA_SOURCE]: 'cloud-download',
        [moduleInputOutputTypes.COMMON_VARIABLE]: 'appstore-o'
    };

    // 模块输入输出类型对应中文
    exports.moduleInputOutputTypeNames = Object.defineProperties({}, {
        [moduleInputOutputTypes.DATA_SOURCE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '实时数据源' : 'Realtime Data Source';
            }
        },
        [moduleInputOutputTypes.INPUT_HISTORY_DATA_SOURCE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '历史数据源' : 'History Data Source';
            }
        },
        [moduleInputOutputTypes.NUMBER]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '数字' : 'Number';
            }
        },
        [moduleInputOutputTypes.STRING]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '字符串' : 'String';
            }
        },
        [moduleInputOutputTypes.OTHER_MODULES]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '引用其他模块输出源' : 'Reference Other Module';
            }
        },
        [moduleInputOutputTypes.INPUT_DIAGNOSIS_FUZZYRULE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '诊断输入-模糊规则' : 'Diagnosis Input - Fuzzy Rule';
            }
        },
        [moduleInputOutputTypes.OUTPUT_DIAGNOSIS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '诊断输出' : 'Diagnosis Output';
            }
        },
        [moduleInputOutputTypes.OUTPUT_DATA_SOURCE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '数据源' : 'Output Data Source';
            }
        },
        [moduleInputOutputTypes.COMMON_VARIABLE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '通用变量' : 'Common Variable';
            }
        }
    });

    // 模态框类型
    exports.modalTypes = {
        PARAMS_CONFIG_MODAL: 0
    };

    // 模糊规则图形类型
    const fuzzyRuleShapeTypes = exports.fuzzyRuleShapeTypes = {
        TRIANGLE: 0,
        RECTANGLE: 1,
        TRAPEZOID: 2,
        GAUSSIAN: 3,
        ZSHAPE: 4,
        SSHAPE: 5
    };

    // 模糊规则图形类型对应中文
    exports.fuzzyRuleShapeTypeNames = Object.defineProperties({}, {
        [fuzzyRuleShapeTypes.TRIANGLE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '三角形' : 'Triangle';
            }
        },
        [fuzzyRuleShapeTypes.RECTANGLE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '矩形' : 'Rectangle';
            }
        },
        [fuzzyRuleShapeTypes.TRAPEZOID]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '梯形' : 'Trapezoid';
            }
        },
        [fuzzyRuleShapeTypes.GAUSSIAN]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '高斯曲线' : 'Gaussian';
            }
        },
        [fuzzyRuleShapeTypes.ZSHAPE]: {
            enumerable: true,
            get() {
                return 'ZShape';
            }
        },
        [fuzzyRuleShapeTypes.SSHAPE]: {
            enumerable: true,
            get() {
                return 'SShape';
            }
        }
    });

    // 模糊规则输入输出对应类型
    const fuzzyRuleInputOutputTypes = exports.fuzzyRuleInputOutputTypes = {
        UNDEFINED: 0,
        CONTINUOUS: 1,
        BOOL: 2,
        SETPOINT: 3,
        FORMULA: 4,
        CONTINUOUSWITHSETPOINT: 5,
        SERIESANALYSISCODE: 6,
        CUSTORMIZEDCONTINUOUS: 7
    };

    // 模糊规则输入输出类型对应中文
    exports.fuzzyRuleInputOutputTypeNames = Object.defineProperties({}, {
        [fuzzyRuleInputOutputTypes.UNDEFINED]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '未定义的变量' : 'Undefined Variable';
            }
        },
        [fuzzyRuleInputOutputTypes.CONTINUOUS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '连续变量' : 'Continuous Variable';
            }
        },
        [fuzzyRuleInputOutputTypes.BOOL]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '布尔变量' : 'Boolean';
            }
        },
        [fuzzyRuleInputOutputTypes.SETPOINT]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '设定值' : 'Set-point';
            }
        },
        [fuzzyRuleInputOutputTypes.FORMULA]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '公式' : 'Formula';
            }
        },
        [fuzzyRuleInputOutputTypes.CONTINUOUSWITHSETPOINT]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '有设定值的连续变量' : 'Continuous Variable With Set-point';
            }
        },
        [fuzzyRuleInputOutputTypes.SERIESANALYSISCODE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '序列点' : 'Sequence Point';
            }
        },
        [fuzzyRuleInputOutputTypes.CUSTORMIZEDCONTINUOUS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '不检查deadvalue的连续变量' : 'Continuous Variable Without Checking Dead Value';
            }
        }
    })
    const faultGrade = exports.faultGrade = {
        'NOTE': 0,
        'ABNORMAL': 1,
        'FAULT': 2
    };

    exports.faultGradeName = Object.defineProperties({}, {
        [faultGrade.NOTE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '提示' : 'Note';
            }
        },
        [faultGrade.ABNORMAL]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '异常' : 'Exception';
            }
        },
        [faultGrade.FAULT]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '故障' : 'Fault';
            }
        }
    });

}));
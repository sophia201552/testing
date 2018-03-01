;(function (exports) {
    const faultGrade = exports.faultGrade = {
        'EXCEPTION': 1,
        'FAULT': 2
    };

    exports.faultGradeName = Object.defineProperties({}, {
        [faultGrade.EXCEPTION]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '异常' : 'Alert';
            }
        },
        [faultGrade.FAULT]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '故障' : 'Fault';
            }
        }
    });

    const enableStatus = exports.enableStatus = {
        'DISABLE': 0,
        'ENABLE': 1
    };

    exports.enableStatusName = Object.defineProperties({}, {
        [enableStatus.DISABLE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '禁用' : 'Disable';
            }
        },
        [enableStatus.ENABLE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '启用' : 'Enable';
            }
        }
    });

    const faultStatus = exports.faultStatus = {
        'HAPPEN': 1,
        'END': 10
    };

    exports.faultStatusName = Object.defineProperties({}, {
        [faultStatus.HAPPEN]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '发生' : 'Open';
            }
        },
        [faultStatus.END]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '结束' : 'Closed';
            }
        }
    });

    const faultConsequence = exports.faultConsequence = {
        // 能耗浪费
        'ENERGY_WASTE': 'Energy waste',
        // 舒适度
        'COMFORT': 'Comfort issue',
        // 设备健康
        'EQUIPMENT_HEALTH': 'Equipment Health',
        // 操作中断
        // 'OPERATION_INTERRUPT': 3,
        // 空气质量
        // 'AIR_QUALITY': 4,
        // 其他
        'OTHER': 'Other'
    }

    exports.faultConsequenceName = Object.defineProperties({}, {
        [faultConsequence.ENERGY_WASTE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '能耗浪费' : 'Energy Waste';
            }
        },
        [faultConsequence.COMFORT]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '舒适度' : 'Comfort';
            }
        },
        [faultConsequence.EQUIPMENT_HEALTH]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '设备健康' : 'Equipment Health';
            }
        },
        [faultConsequence.OTHER]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '其他' : 'Other';
            }
        }
    });

    const faultType = exports.faultType = {
        //一级故障
        'FIRST_FAULT': 'FIRST_FAULT',
        //二级故障
        'SECOND_FAULT': 'SECOND_FAULT',
        //三级故障
        'THIRD_FAULT': 'THIRD_FAULT',
        //传感器故障
        'SENSOR_FAULT': 'SENSOR_FAULT',
    }

    exports.faultTypeValue = Object.defineProperties({},{
        [faultType.FIRST_FAULT]:{
            enumerable: true,
            get() {
                return 0.3;
            }
        },
        [faultType.SECOND_FAULT]:{
            enumerable: true,
            get() {
                return 0.6;
            }
        },
        [faultType.THIRD_FAULT]:{
            enumerable: true,
            get() {
                return 1;
            }
        },
        [faultType.SENSOR_FAULT]:{
            enumerable: true,
            get() {
                return 2;
            }
        }
    })

    exports.faultTypeName = Object.defineProperties({},{
        [faultType.FIRST_FAULT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '一级故障' : 'First fault';
            }
        },
        [faultType.SECOND_FAULT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '二级故障' : 'Second fault';
            }
        },
        [faultType.THIRD_FAULT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '三级故障' : 'Third fault';
            }
        },
        [faultType.SENSOR_FAULT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '传感器故障' : 'Sensor fault';
            }
        }
    })

     exports.faultTypeDes = Object.defineProperties({},{
        [faultType.FIRST_FAULT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '运行策略或控制不当' : 'Improper running or control';
            }
        },
        [faultType.SECOND_FAULT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '严重影响设备运行效率' : 'Serious impact on equipment operation efficiency';
            }
        },
        [faultType.THIRD_FAULT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '缩短设备运行寿命，或直接造成设备损坏' : 'Shorten the operating life of the equipment, or directly cause damage to the equipment';
            }
        },
        [faultType.SENSOR_FAULT]:{
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '传感器故障' : 'Sensor fault';
            }
        }
    })
} (
    namespace('diagnosis.enum')
))
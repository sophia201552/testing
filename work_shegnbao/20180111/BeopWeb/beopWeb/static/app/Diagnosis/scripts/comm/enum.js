;(function (exports) {
    const faultGrade = exports.faultGrade = {
        'NOTE': 0,
        'EXCEPTION': 1,
        'FAULT': 2
    };
    
    exports.faultGradeName = Object.defineProperties({}, {
        [faultGrade.NOTE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '提示' : 'Note';
            }
        },
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
    const taskStatus = exports.taskStatus = {
        'UNDER_ACTION': 1,
        'ACTION': 2,
        'RESCINDED': 3,
        'CLOSED': 10,
        'NULL':null,
        // 'DElETED':20
    };

    exports.taskStatusName = Object.defineProperties({}, {
        [taskStatus.UNDER_ACTION]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '待处理' : 'To-do';
            }
        },
        [taskStatus.ACTION]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '处理中' : 'WIP';
            }
        },
        [taskStatus.RESCINDED]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '已撤销' : 'Rescinded';
            }
        },
        [taskStatus.CLOSED]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '已处理' : 'Solved';
            }
        },
        [taskStatus.NULL]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '未加入任务' : 'New';
            }
        },
/*         [taskStatus.DElETED]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '已删除' : 'Deleted';
            }
        } */
    });

    const faultLevel = exports.faultLevel = {
        'immediately': 0,
        'urgent': 1,
        'high': 2,
        'ordinary': 3,
        'low': 4
    };

    exports.faultLevelName = Object.defineProperties({}, {
        [faultLevel.immediately]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '立刻' : 'Immediately';
            }
        },
        [faultLevel.urgent]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '紧急' : 'Urgent';
            }
        },
        [faultLevel.high]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '高' : 'High';
            }
        },
        [faultLevel.ordinary]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '普通' : 'Ordinary';
            }
        },
        [faultLevel.low]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '低' : 'Low';
            }
        }
    });

    const faultMaintainable = exports.faultMaintainable = {
        'ACTION': 1,
        'NOTES': 0
    };
//     0：可操作性低：中文描述：建议记录，英文描述：Notes
//     1：可操作性高：中文描述：建议处理，英文描述：Action

    exports.faultMaintainableName = Object.defineProperties({}, {
        [faultMaintainable.ACTION]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '建议处理' : 'Action';
            }
        },
        [faultMaintainable.NOTES]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '建议记录' : 'Notes';
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
    const feedbackStatus = exports.feedbackStatus = {
        'PROCESSED': 1,
        'UNTREATED': 0
    };

    exports.feedbackStatusName = Object.defineProperties({}, {
        [feedbackStatus.PROCESSED]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '已处理' : 'Processed';
            }
        },
        [feedbackStatus.UNTREATED]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '未处理' : 'Untreated';
            }
        }
    });
    const taskHandleType = exports.taskHandleType = {
        'CREATE_WORKTASK': 'CREATE_WORKTASK',
        'CHANGE_PRIORITY': 'CHANGE_PRIORITY',
        'CHANGE_STATUS': 'CHANGE_STATUS',
        'CHANGE_NOTE': 'CHANGE_NOTE',
        'CREATE': 'CREATE'
    };

    exports.taskHandleTypeName = Object.defineProperties({}, {
        [taskHandleType.CREATE_WORKTASK]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '{operator} 创建了一个工单' : '{operator} created a work order';
            }
        },
        [taskHandleType.CHANGE_PRIORITY]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '将紧急程度从 {from} 改成 {to}' : 'Change the priopiy from {from} to {to}';
            }
        },
        [taskHandleType.CHANGE_STATUS]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '将状态从 {from} 改成 {to}' : 'Change the status from {from} to {to}';
            }
        },
        [taskHandleType.CHANGE_NOTE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '将备注从 {from} 改成 {to}' : 'Change the note from {from} to {to}';
            }
        },
        [taskHandleType.CREATE]: {
            enumerable: true,
            get() {
                return I18n && I18n.type === 'zh' ? '{operator2} 创建了一个任务' : '{operator2} created a task';
            }
        }
    });
} (
    namespace('diagnosis.enum')
))
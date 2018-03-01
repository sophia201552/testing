import mysql.connector
from beopWeb import app
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_task
from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer

db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')


# bug 流程，休假流程，开发流程，默认流程


class Process:
    BUG_PROCESS = {"type": 2, "name": "BUG流程", "template_id": "56f13216e153db0248d3fb91", "nodes": [
        {
            "arch_type": {
                "name": "全体成员",
                "type": ""
            },
            "arch_id": "0",
            "behaviour": "2",
            "members": [1, 114, 65, 68, 67, 81, 82, 114, 451, 1063, 448, 1334, 65, 285, 68, 73, 70, 101, 215, 262, 405,
                        408, 1101, 1560, 1589, 1743, 1760, 72, 402, 75, 404, 67, 456, 1608, 1218, 1165, 76, 74, 77, 379,
                        527, 1413, 1688, 1609, 78, 364, 139, 83, 85, 1509, 1442, 1502, 1508, 173, 383, 80, 218, 255,
                        203, 382, 1708, 1630, 366, 194, 1495, 162, 222, 282, 458, 1402, 1758, 84, 1318, 1239, 369, 449,
                        1759, 463, 1335, 1725, 1755, 1756, 1331, 1332, 1333]
        }, {
            "arch_type": {
                "name": "研发部-开发组",
                "type": ""
            },
            "arch_id": "14652643684260011b94a252",
            "behaviour": "2",
            "members": []
        }, {
            "arch_type": {
                "name": "研发部-测试组",
                "type": ""
            },
            "arch_id": "146526483375300178ee8173",
            "behaviour": "1",
            "members": []
        }]}
    VACATION_PROCESS = {
        "nodes": [
            {
                "arch_type": {
                    "name": "全体成员",
                    "type": ""
                },
                "arch_id": "0",
                "behaviour": "2",
                "members": [1, 114, 65, 68, 67, 81, 82, 114, 451, 1063, 448, 1334, 65, 285, 68, 73, 70, 101, 215, 262,
                            405, 408, 1101, 1560, 1589, 1743, 1760, 72, 402, 75, 404, 67, 456, 1608, 1218, 1165, 76, 74,
                            77, 379, 527, 1413, 1688, 1609, 78, 364, 139, 83, 85, 1509, 1442, 1502, 1508, 173, 383, 80,
                            218, 255, 203, 382, 1708, 1630, 366, 194, 1495, 162, 222, 282, 458, 1402, 1758, 84, 1318,
                            1239, 369, 449, 1759, 463, 1335, 1725, 1755, 1756, 1331, 1332, 1333]
            }, {
                "arch_type": {
                    "name": "全体成员",
                    "type": ""
                },
                "arch_id": "0",
                "behaviour": "1",
                "members": [1, 114, 65, 68, 67, 81, 82, 114, 451, 1063, 448, 1334, 65, 285, 68, 73, 70, 101, 215, 262,
                            405, 408, 1101, 1560, 1589, 1743, 1760, 72, 402, 75, 404, 67, 456, 1608, 1218, 1165, 76, 74,
                            77, 379, 527, 1413, 1688, 1609, 78, 364, 139, 83, 85, 1509, 1442, 1502, 1508, 173, 383, 80,
                            218, 255, 203, 382, 1708, 1630, 366, 194, 1495, 162, 222, 282, 458, 1402, 1758, 84, 1318,
                            1239, 369, 449, 1759, 463, 1335, 1725, 1755, 1756, 1331, 1332, 1333]
            }, {
                "arch_type": {
                    "name": "全体成员",
                    "type": ""
                },
                "arch_id": "0",
                "behaviour": "1",
                "members": [1, 114, 65, 68, 67, 81, 82, 114, 451, 1063, 448, 1334, 65, 285, 68, 73, 70, 101, 215, 262,
                            405, 408, 1101, 1560, 1589, 1743, 1760, 72, 402, 75, 404, 67, 456, 1608, 1218, 1165, 76, 74,
                            77, 379, 527, 1413, 1688, 1609, 78, 364, 139, 83, 85, 1509, 1442, 1502, 1508, 173, 383, 80,
                            218, 255, 203, 382, 1708, 1630, 366, 194, 1495, 162, 222, 282, 458, 1402, 1758, 84, 1318,
                            1239, 369, 449, 1759, 463, 1335, 1725, 1755, 1756, 1331, 1332, 1333]
            }, {
                "arch_type": {
                    "name": "行政部",
                    "type": ""
                },
                "arch_id": "1465266511323001aebcb536",
                "behaviour": "1",
                "members": [1331]
            }, {
                "arch_type": {
                    "name": "行政经理",
                    "type": ""
                },
                "arch_id": "1465263219910001e56a9859",
                "behaviour": "1",
                "members": [448]
            }],
        "template_id": "56f13216e153db0248d3fb91",
        "name": "请假流程",
        "type": 2
    }
    DEVELOPER_PROCESS = {"nodes": [
        {
            "arch_type": {
                "name": "研发部-产品组",
                "type": ""
            },
            "arch_id": "146526386273800107df7b80",
            "behaviour": "2",
            "members": []
        }, {
            "arch_type": {
                "name": "研发总监",
                "type": ""
            },
            "arch_id": "1465263075754001d7037987",
            "behaviour": "1",
            "members": [114]
        }, {
            "arch_type": {
                "name": "研发部-设计组",
                "type": ""
            },
            "arch_id": "1465265444249001939cb624",
            "behaviour": "2",
            "members": []
        }, {
            "arch_type": {
                "name": "研发部-产品组",
                "type": ""
            },
            "arch_id": "146526386273800107df7b80",
            "behaviour": "1",
            "members": []
        }, {
            "arch_type": {
                "name": "研发部-开发组",
                "type": ""
            },
            "arch_id": "14652643684260011b94a252",
            "behaviour": "2",
            "members": []
        }, {
            "arch_type": {
                "name": "研发部-测试组",
                "type": ""
            },
            "arch_id": "146526483375300178ee8173",
            "behaviour": "2",
            "members": []
        }, {
            "arch_type": {
                "name": "研发部-产品组",
                "type": ""
            },
            "arch_id": "146526386273800107df7b80",
            "behaviour": "1",
            "members": []
        }],
        "template_id": "56f13216e153db0248d3fb91",
        "name": "开发流程",
        "type": 2
    }
    DEFAULT_PROCESS = {
        "nodes": [
            {
                "arch_type": {
                    "name": "全体成员",
                    "type": ""
                },
                "arch_id": "0",
                "behaviour": "2",
                "members": [1, 114, 65, 68, 67, 81, 82, 114, 451, 1063, 448, 1334, 65, 285, 68, 73, 70, 101, 215, 262,
                            405, 408, 1101, 1560, 1589, 1743, 1760, 72, 402, 75, 404, 67, 456, 1608, 1218, 1165, 76, 74,
                            77, 379, 527, 1413, 1688, 1609, 78, 364, 139, 83, 85, 1509, 1442, 1502, 1508, 173, 383, 80,
                            218, 255, 203, 382, 1708, 1630, 366, 194, 1495, 162, 222, 282, 458, 1402, 1758, 84, 1318,
                            1239, 369, 449, 1759, 463, 1335, 1725, 1755, 1756, 1331, 1332, 1333]
            }, {
                "arch_type": {
                    "name": "全体成员",
                    "type": ""
                },
                "arch_id": "0",
                "behaviour": "2",
                "members": [1, 114, 65, 68, 67, 81, 82, 114, 451, 1063, 448, 1334, 65, 285, 68, 73, 70, 101, 215, 262,
                            405, 408, 1101, 1560, 1589, 1743, 1760, 72, 402, 75, 404, 67, 456, 1608, 1218, 1165, 76, 74,
                            77, 379, 527, 1413, 1688, 1609, 78, 364, 139, 83, 85, 1509, 1442, 1502, 1508, 173, 383, 80,
                            218, 255, 203, 382, 1708, 1630, 366, 194, 1495, 162, 222, 282, 458, 1402, 1758, 84, 1318,
                            1239, 369, 449, 1759, 463, 1335, 1725, 1755, 1756, 1331, 1332, 1333]
            }, {
                "arch_type": {
                    "name": "全体成员",
                    "type": ""
                },
                "arch_id": "0",
                "behaviour": "1",
                "members": [1, 114, 65, 68, 67, 81, 82, 114, 451, 1063, 448, 1334, 65, 285, 68, 73, 70, 101, 215, 262,
                            405, 408, 1101, 1560, 1589, 1743, 1760, 72, 402, 75, 404, 67, 456, 1608, 1218, 1165, 76, 74,
                            77, 379, 527, 1413, 1688, 1609, 78, 364, 139, 83, 85, 1509, 1442, 1502, 1508, 173, 383, 80,
                            218, 255, 203, 382, 1708, 1630, 366, 194, 1495, 162, 222, 282, 458, 1402, 1758, 84, 1318,
                            1239, 369, 449, 1759, 463, 1335, 1725, 1755, 1756, 1331, 1332, 1333]
            }],
        "template_id": "56f13216e153db0248d3fb91",
        "name": "默认流程",
        "type": 2
    }


def get_mysql_data(start, end):
    mysql_data = BEOPMySqlDBContainer().op_db_query(db_name,
                                                    "SELECT * FROM `transaction` LIMIT %s,%s" % (start, end))

    fields = (
        'id', 'title', 'detail', 'dueDate', 'creatorID', 'executorID', 'statusId', 'groupid', 'assignTime',
        'completeTime',
        'priority', 'dbName', 'chartPointList', 'chartQueryCircle', 'chartStartTime', 'chartEndTime',
        'createTime', 'critical', 'lastUpdateTime', 'isRead')

    return [{key: value for key, value in zip(fields, mysql_data_item)} for mysql_data_item in
            mysql_data] if mysql_data else []

mongo_task_fields = {
    "creator": None,
    "executor": [],
    "node_index": None,
    "template": {},
    "createTime": None,
    "fields": {},
    "taskGroupId": None,
    "status": None,

    "process": {
        "name": "",  # 默认流程名称
        "type": 1,  # 默认流程
        "template_id": "",
        "nodes": [
            {
                "members": "",
                "note": "",  # 用户记录
                "behavior": "",  # 用户行为
                "datetime": "",  # 时间
                "arch_type": "",  # 团队里面 人物组的类型
                "arch_id": "",  # 团队里面 人物组的id
                "action": ""  # 动作类型
            }
        ]
    },
    # default
    "comment": [],
    "tags": [],
    "attachment": [],
    "_oldTask": True,
    "_oldTaskId": None
}

mysql_data_count = BEOPMySqlDBContainer().op_db_query(db_name, "SELECT COUNT(*) FROM `transaction` ")
mysql_data_count = mysql_data_count[0][0]

# TODO 测试的时候用一个比较小的数值
mysql_data_count = 10

step = 2
page = 1
while (mysql_data_count > 0):

    mysql_data = get_mysql_data((page - 1) * step, step)

    for task_item in mysql_data:
        model = mongo_task_fields.copy()

        # creator
        creator = task_item.get("creatorID", None)
        model.update({"creator": creator})

        # executor
        executor = task_item.get("executorID", None)
        model.update({"executor": [executor]})

        # fields
        title = task_item.get("title", None)
        due_data = task_item.get("dueDate", None)
        detail = task_item.get("detail", None)
        critical = task_item.get("critical", None)
        model.update({"fields": {
            "title": title,
            "dueDate": due_data,
            "detail": detail,
            "critical": critical,
            "tags": [],
            "template_id": None,
            "type": 1
        }})

        # create time
        create_time = task_item.get("createTime", None)
        model.update({"createTime": create_time})

        # status id
        status_id = task_item.get("statusId", None)
        model.update({"status": status_id})

        # process
        # 都是默认的process
        model.update({
            "process": Process.DEFAULT_PROCESS
        })

        # 设置老工单独有的内容
        model.update({
            "_oldTask": True,
            "_oldTaskId": task_item.get("id")
        })

        MongoConnManager.getConfigConn().mdbBb["WorkflowTaskImport_TEST"].save(model)

    print((page - 1) * step, page * step)
    mysql_data_count -= step
    page += 1

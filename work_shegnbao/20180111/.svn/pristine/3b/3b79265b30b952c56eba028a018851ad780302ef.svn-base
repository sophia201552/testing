__author__ = 'may'

from flask import request
from datetime import timedelta
from beopWeb.mod_platform import bp_platform
from beopWeb.mod_platform.platform import Platform
from beopWeb.mod_common.Utils import *


# 平台化动态信息
@bp_platform.route('/get/allProjDynamicInfo/<userId>', methods=['GET'])
def getAllProjDynamicInfo(userId):
    '''
    :param userId:
    :return:{
    "msg": "",
    "success": true,
    "data": {
            "projects": [
                1,
                4,
                19,
                28,
                72
            ],
            "energy": {
                "co2_emission": 0,
                "energe_use": 0,
                "cost": 0
            },
            "total_online_points": {
                "calc": 6944,
                "raw": 307918
            },
            "total_online_projects": 26,
            "disgnosis": {
                "total_fault_notices": 5500,
                "current_fault_notices": 93
            }
        },
        "code": "1"
    }
    '''
    try:
        if not userId:
            raise Exception('userId is necessary')
        platform = Platform(userId)
        return Utils.beop_response_success(data=platform.getProjDynamicInfo())
    except Exception as e:
        logging.error('getAllProjDynamicInfo error:' + e.__str__())
        print('getAllProjDynamicInfo error:' + e.__str__())
        return Utils.beop_response_error(msg=e.__str__())


@bp_platform.route('/update/allProjDynamicInfo/<userId>', methods=['post'])
def updateAllProjDynamicInfo(userId):
    try:
        data = request.get_json()
        platform = Platform(userId)
        startTime = None
        endTime = None
        if data:
            startTime = data.get('startTime')
            endTime = data.get('endTime')
        if platform.updateProjectsDynamicInfo(startTime, endTime):
            return Utils.beop_response_success()
        return Utils.beop_response_error(msg='update error')
    except Exception as e:
        logging.error('updateAllProjDynamicInfo error:' + e.__str__())
        print('updateAllProjDynamicInfo error:' + e.__str__())
        return Utils.beop_response_error(msg=e.__str__())


# 平台化静态信息
@bp_platform.route('/get/allProjStaticInfo/<userId>', methods=['GET'])
def getAllProjStaticInfo(userId):
    '''
    readmine: 1021 设计并添加接口获取当前平台用户所有项目的静态统计信息
    :return:
    {
        "data": {
            "projects": [
                1,
                4
            ],
            "diagnosis": {
                "total_reports": 12
            },
            "tag": {
                "total_points_with_tags": 162425
            },
            "storage": {
                "total_disk_usage": 1097285378048
            },
            "project_category": {
                "office_building": 0,
                "market": 0,
                "factory": 0,
                "hotel": 0
            },
            "data_density": {
                "total_area": 0,
                "total_devices": {
                    "CHWP": 4,
                    "Chiller": 3,
                    "MWP": 8,
                    "VAV": 9,
                    "CWP": 6,
                    "AHU": 14,
                    "Plant": 8,
                    "FCU": 1,
                    "CoolingTower": 3
                }
                "table_points": {
                    "raw": 368030,
                    "calc": 8456,
                    "virtual": 12410,
                    "site": 482431
                }
            }
        },
        "success": true,
        "msg": "",
        "code": "1"
    }
    '''
    try:
        platform = Platform(userId)
        return Utils.beop_response_success(data=platform.getProjectsStaticInfo())
    except Exception as e:
        logging.error('getAllProjStaticInfo error:' + e.__str__())
        print('getAllProjStaticInfo error:' + e.__str__())
        return Utils.beop_response_error(msg=e.__str__())


@bp_platform.route('/update/allProjStaticInfo/<userId>', methods=['get'])
def updateAllProjStaticInfo(userId):
    try:
        platform = Platform(userId)
        if platform.updateProjectsStaticInfo():
            return Utils.beop_response_success()
        return Utils.beop_response_error(msg='update error')
    except Exception as e:
        logging.error('updateAllProjStaticInfo error:' + e.__str__())
        print('updateAllProjStaticInfo error:' + e.__str__())
        return Utils.beop_response_error(msg=e.__str__())

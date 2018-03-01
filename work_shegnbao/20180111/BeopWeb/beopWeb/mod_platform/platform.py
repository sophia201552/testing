'''
平台化
'''

__author__ = 'may'

import logging
from datetime import datetime, timedelta
from beopWeb.mod_admin.Project import Project
from beopWeb.mod_cxTool.PointTable import PointTable
from beopWeb.mod_admin.RealTimeData import RealTimeData
from beopWeb.mod_memcache.RedisManager import RedisManager
from beopWeb.MongoConnManager import *
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_tag.pointTag import pointTag
from beopWeb.mod_cxTool import get_terminal_list_by_userId


class Platform:
    def __init__(self, userId=None):
        self.userId = userId

    def getProjDynamicInfo(self):
        DynamicInfo = RedisManager.get_Dynamic_info_by_userId(self.userId)
        if not DynamicInfo:
            self.updateProjectsDynamicInfo()
            DynamicInfo = RedisManager.get_Dynamic_info_by_userId(self.userId)
        if DynamicInfo:
            last_update_time_str = DynamicInfo.get('update_time')
            if datetime.now() - timedelta(hours=1) > datetime.strptime(last_update_time_str, '%Y-%m-%d %H:%M:%S'):
                self.updateProjectsDynamicInfo()
                DynamicInfo = RedisManager.get_Dynamic_info_by_userId(self.userId)
            del DynamicInfo['update_time']
            return DynamicInfo
        return None

    def updateProjectsDynamicInfo(self, startTime=None, endTime=None):
        try:
            if not startTime or not endTime:
                startTime = datetime.strftime(datetime.now() - timedelta(days=30), '%Y-%m-%d %H:%M:%S')
                endTime = datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S')
            dbAccess = BEOPDataAccess.getInstance()
            userId = self.userId
            projects = Project.get_projects_by_user_id(userId, 'id')
            projectList = [item.get('id') for item in projects]
            total_online_projects = 0
            projects_status = BEOPDataAccess.getInstance().get_project_status(userId)
            if projects_status:
                total_online_projects = len([project[0] for project in projects_status if project[1] == 'Online'])
            dtu_list = get_terminal_list_by_userId(str(userId))
            on_line_count = 0
            for dtu in dtu_list:
                if dtu.get('online') == 'Online':
                    on_line_count += 1
            pt = PointTable()
            realTime = RealTimeData()
            total_raw = realTime.get_projects_real_count(projectList)
            total_online_points = {}.fromkeys(('raw', 'calc'), (0))
            if total_raw and len(dtu_list):
                total_online_points['raw'] = int(total_raw * on_line_count / len(dtu_list))
            total_calc = pt.get_calc_count(projectList)
            if total_calc and len(dtu_list):
                total_online_points['calc'] = int(total_calc * on_line_count / len(dtu_list))
            current_fault_notices, total_fault_notices = dbAccess.getFaultNoticeByProjIdList(
                projectList, startTime, endTime)
            newNoticeIds, oldNoticeIds = dbAccess.getProjectIdsWithNotice()
            # 使用新诊断的项目ids
            newIds = list(set(projectList).intersection(set(newNoticeIds)))
            oldIds = list(set(projectList).intersection(set(oldNoticeIds)) - set(newNoticeIds))
            energy_use = dbAccess.getEnergyByIds(newIds, oldIds, startTime, endTime)
            co2_emission = round(energy_use * 0.823, 2) if energy_use else 0
            cost = round(energy_use * 0.7, 2) if energy_use else 0
            data = {"update_time": datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S'),
                    "projects": projectList, "total_online_projects": total_online_projects,
                    "total_online_points": total_online_points,
                    "diagnosis": {"current_fault_notices": current_fault_notices,
                                  "total_fault_notices": total_fault_notices},
                    "energy": {"energy_use": energy_use, "cost": cost, "co2_emission": co2_emission}}
            RedisManager.set_Dynamic_info_by_userId(self.userId, data)
            return True
        except Exception as e:
            logging.error('updateProjectsDynamicInfo error:' + e.__str__())
            print('updateProjectsDynamicInfo error:' + e.__str__())
            return False

    def getProjectsStaticInfo(self):
        staticInfo = RedisManager.get_static_info_by_userId(self.userId)
        if not staticInfo:
            self.updateProjectsStaticInfo()
            staticInfo = RedisManager.get_static_info_by_userId(self.userId)
        if staticInfo:
            last_update_time_str = staticInfo.get('update_time')
            if datetime.now() - timedelta(days=1) > datetime.strptime(last_update_time_str, '%Y-%m-%d %H:%M:%S'):
                self.updateProjectsStaticInfo()
                staticInfo = RedisManager.get_static_info_by_userId(self.userId)
            del staticInfo['update_time']
            return staticInfo
        return None

    def updateProjectsStaticInfo(self):
        try:
            if not self.userId:
                raise Exception('userId is necessary')
            time_start = datetime.now().timestamp()
            projects = Project.get_projects_by_user_id(self.userId, 'id')
            time_2 = datetime.now().timestamp() - time_start
            print('time_2:' + str(time_2))
            projectList = [item.get('id') for item in projects]
            project_category = Project.get_project_category_count_by_projIds(projectList)
            time_3 = datetime.now().timestamp() - time_start
            print('time_3:' + str(time_3))
            total_area = Project.get_projects_total_area(projectList)
            time_4 = datetime.now().timestamp() - time_start
            print('time_4:' + str(time_4))
            pt = PointTable()
            realTime = RealTimeData()
            total_points = {}.fromkeys(("raw", "site", "calc", "virtual"), (0))
            total_points['site'] = pt.get_site_count(projectList)
            total_points['calc'] = pt.get_calc_count(projectList)
            total_points['virtual'] = pt.get_virtual_count(projectList)
            total_points['raw'] = realTime.get_projects_real_count(projectList)
            time_5 = datetime.now().timestamp() - time_start
            print('time_5:' + str(time_5))
            total_reports = MongoConnManager.getConfigConn().get_report_count(projectList)
            total_disk_usage = BEOPDataAccess.getStorageByProjIdList(projectList)
            time_6 = datetime.now().timestamp() - time_start
            print('time_6:' + str(time_6))
            total_devices = pointTag.get_equipment_info_by_projId(projectList)
            total_points_with_tags = pointTag.get_hasTag_num(projectList)
            time_7 = datetime.now().timestamp() - time_start
            print('time_7:' + str(time_7))
            data = {"update_time": datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S'),
                    "projects": projectList, "project_category": project_category,
                    "data_density": {"total_area": total_area,
                                     "table_points": total_points,
                                     "total_devices": total_devices
                                     },
                    "diagnosis": {"total_reports": total_reports},
                    "storage": {"total_disk_usage": total_disk_usage},
                    "tag": {
                        "total_points_with_tags": total_points_with_tags
                    }
                    }
            RedisManager.set_static_info_by_userId(self.userId, data)
            return True
        except Exception as e:
            logging.error('getAllProjStaticInfo error:' + e.__str__())
            print('getAllProjStaticInfo error:' + e.__str__())
            return False
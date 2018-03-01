# -*- encoding=utf-8 -*-
__author__ = 'golding'
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.api.ArchiveManager import ArchiveManager
from math import ceil,floor
from ExpertContainer.calculation.repairHistoryTimer import RepairHistoryTimer

from ExpertContainer.api.DependAnalyst import DependAnalyst


class CalPointManager:

    _Logger = LogOperator()

    def getPointDependency(self,projId):
        rt = False
        full_path=''
        format_s=''

        try:
            query_result = mongo_operator.get_one_project_calc_point_from_projects(int(projId))
            if not query_result:
                return True,full_path,format_s
            project_id = int(projId)
            if project_id in query_result:
                info = query_result.get(project_id)
                for format in info:
                    format_s=format
                    if format != 'm5':
                        continue
                    rely_dict = {}
                    module_name_list = [x.get('name') for x in info.get(format)]

                    arr = info.get(format, [])
                    for item in arr:
                        content = item.get('content')
                        point_name = item.get('name')
                        if "calcpoint_" in point_name:
                            point_name = point_name.replace("calcpoint_", "")
                        final_point_list = []
                        mongo_operator.order_points_calc(content, project_id, arr, module_name_list, final_point_list)
                        point_name = point_name[point_name.find("_")+1:]
                        rely_dict[point_name] = final_point_list
            rt = True
        except Exception as e:
            strErr = '%s:'%(get_current_func_name())+e.__str__()
            return {"error":strErr}
        return rely_dict

    @classmethod
    def make_calcpoint_py_file_by_projId(cls, name, projId):
        rt = False
        full_path = ''
        format_s = ''

        try:
            query_result = mongo_operator.get_one_project_calc_point_from_projects(int(projId))
            if not query_result:
                return True, full_path, format_s
            if projId in query_result:
                project_id = int(projId)
                info = query_result.get(projId)
                for format in info:
                    format_s = format
                    if format != 'm5':
                        continue
                    rely_dict = {}
                    module_name_list = [x.get('name') for x in info.get(format)]
                    file_name = name + "_calcpoint_" + str(project_id) + ".py"
                    path = get_calcpoint_path_real(format)
                    full_path = path + "/" + file_name
                    print(full_path)
                    add_head(full_path, project_id)
                    arr = info.get(format, [])
                    for item in arr:
                        content = item.get('content')
                        point_name = item.get('name')
                        if content is None or point_name is None:
                            continue
                        if "calcpoint_" in point_name:
                            point_name = point_name.replace("calcpoint_", "")
                        final_point_list = []
                        mongo_operator.order_points_calc(content, projId, arr, module_name_list, final_point_list,
                                                         item.get('name'))
                        point_name = point_name[point_name.find("_") + 1:]
                        rely_dict[point_name] = final_point_list
                        add_body(full_path, project_id, content, point_name)

                    depAna = DependAnalyst(rely_dict)
                    add_action2(full_path, project_id, depAna.analysis(), rely_dict)
            rt = True
        except Exception as e:
            CalPointManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            return False, full_path, format_s
        return rt, full_path, format_s


    @classmethod
    def make_diagnosis_py_file_by_projId(cls,projId):
        rt = False
        try:
            query_result = mongo_operator.get_diagnosis_point_by_id(projId)
            if not query_result:
                return False
            for projId in query_result:
                project_id = int(projId)
                info = query_result.get(projId)
                for format in info:
                    if format == 'm5':
                        rely_dict = {}
                        file_name = "diagnosis_"+str(projId)+".py"
                        path = get_diagnosis_path_real()
                        full_path = path+"/"+file_name
                        add_head(full_path, project_id)
                        arr = info.get(format, [])
                        for item in arr:
                            content = item.get('content')
                            point_name = item.get('name')
                            final_point_list = []
                            rely_dict[point_name] = final_point_list
                            add_body(full_path, project_id, content, point_name,'diag')
                        add_action_diagnosis(full_path, project_id, rely_dict)
            rt = True
        except Exception as e:
            CalPointManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

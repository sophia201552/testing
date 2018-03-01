# coding=utf-8

from beopWeb.BEOPDataAccess import BEOPDataAccess
import json
from beopWeb import observer
from beopWeb import views
from beopWeb.mod_admin import *



class TestSpecific:
    CONTEXT_NAME = 'BEOPWEB'

    class GetHistoryDataPadded:
        NO_HISTORY_DATA = 'no history data'
        INVALID_TIME_STRING = 'invalid time string'
        M5_DAYS_RANGE = 14
        H1_DAYS_RANGE = 60
        D1_DAYS_RANGE = 365
        START_TIME_GT_END_TIME = 'startTime > endTime'

        @staticmethod
        def run(arguments):
            return BEOPDataAccess.getInstance().get_history_data_padded(
                arguments.get("projectId"),
                arguments.get("pointList"),
                arguments.get("timeStart"),
                arguments.get("timeEnd"),
                arguments.get("timeFormat"))

        @staticmethod
        def get_error_from_response(response_json):
            if response_json is None:
                return None
            if not isinstance(response_json, dict):
                return None
            if response_json.get("error") != "historyData":
                return None
            return response_json.get('msg')

    class GetHistoryDataPaddedReduce():
        NO_HISTORY_DATA = 'no history data'
        INVALID_TIME_STRING = 'invalid time string'
        M5_DAYS_RANGE = 14
        H1_DAYS_RANGE = 60
        D1_DAYS_RANGE = 365
        START_TIME_GT_END_TIME = 'startTime > endTime'

        @staticmethod
        def run(arguments):
            return BEOPDataAccess.getInstance().get_history_data_padded_reduce(
                arguments.get("projectId"),
                arguments.get("pointList"),
                arguments.get("timeStart"),
                arguments.get("timeEnd"),
                arguments.get("timeFormat"))

        @staticmethod
        def get_error_from_response(response_json):
            if response_json is None:
                return None
            if not isinstance(response_json, dict):
                return None
            if response_json.get("error") != "historyData":
                return None
            return response_json.get('msg')


    #added by sophia 2017/10/10
    class AnalysisStartWorkspaceDataGenPieChart:
        NO_HISTORY_DATA = 'no history data'
        INVALID_DSITEMID_STRING = 'EquationCalculationNotSupoorted'

        @staticmethod
        def run(arguments):
            return json.loads(observer.do_startWorkspaceDataGenPieChart(arguments))

        @staticmethod
        def get_error_from_response(response_json):
            if response_json is None:
                return None
            if not isinstance(response_json, dict):
                return None
            if not isinstance(response_json, dict):
                return None
            error = response_json.get('error')
            if error=="historyData":
                return response_json.get('msg')
            return error

    # added by may 2018/01/06
    class ProjectStatus:
        @staticmethod
        def run(arguments):
            return BEOPDataAccess.getInstance().getProjectDTUById(
                arguments.get("projectId"),
                arguments.get("dtu"),
                arguments.get("startTime"),
                arguments.get("endTime"))

    # added by may 2018/01/09
    class ProjectStatusHistory:
        @staticmethod
        def run(arguments):
            return BEOPDataAccess.getInstance().getDTUHistory(
                arguments.get("projectId"),
                arguments.get("dtu"),
                arguments.get("startTime"),
                arguments.get("endTime")
            )

    # added by sophia 2017/10/12
    class AnalysisStartWorkspaceDataGenHistogram:
        NO_HISTORY_DATA = 'no history data'
        INVALID_DSITEMID_STRING = 'EquationCalculationNotSupoorted'
        INVAILD_TIME_STRING='invalid time string'
        START_TIME_GT_END_TIME = 'startTime > endTime'
        M5_DAYS_RANGE='time range too long for m5 period data query'
        H1_DAYS_RANGE='time range too long for h1 period data query'
        D1_DAYS_RANGE='time range too long for d1 period data query'
        TIME_FORMAT='time period format not supported'
        @staticmethod
        def run(arguments):
            return json.loads(observer.do_startWorkspaceDataGenHistogram(arguments))

        @staticmethod
        def get_error_from_response(response_json):
            if response_json is None:
                return None
            if not isinstance(response_json, dict):
                return None
            if not isinstance(response_json, dict):
                return None
            error = response_json.get('error')
            if error=="historyData":
                return response_json.get('msg')
            return error


    class UpdateProjectInfo:
        @staticmethod
        def run():
            return json.loads(views.updateProjectInfo())

    class UpdateProjectLocateMap:
        @staticmethod
        def run():
            return json.loads(observer.updateProjectLocateMap())

    class GetAllMemValue:
        @staticmethod
        def run():
            return json.loads(views.getAllMemValue())

    # added by sophia 2017/10/19
    class ProjectClusterMapUpdate:
        @staticmethod
        def run():
            return views.do_update_project_cluster_map()


    # added by sophia 2017/10/19
    class ProjectClusterMapGet:
        @staticmethod
        def run():
            return views.do_get_proj_cluster_map()

    class StartWorkspaceDataGenHistogramIncrement_v2:
        NO_HISTORY_DATA = 'no history data'

        @staticmethod
        def run(arguments):
            return json.loads(observer.do_startWorkspaceDataGenHistogramIncrement_v2(arguments))

    class LoadUsersSetting:

        @staticmethod
        def run(arguments):
            return do_load_users_setting(arguments)

    class LoadUsersTree:
        @staticmethod
        def run(arguments):
            return do_load_user_tree(arguments)

    class IsRcsAdmin:
        @staticmethod
        def run(arguments):
            rt = is_rcs_admin(arguments).data.decode()
            return json.loads(rt)

    class GetProjectPermissionByUserId:
        @staticmethod
        def run(arguments):
            rt = do_get_project_permission_by_user_id(arguments)
            return rt

    class LoadManagersByUserId:
        @staticmethod
        def run(arguments):
            return do_load_managers_by_user_id(arguments)

    class UpdateUsersSetting:
        @staticmethod
        def run(arguments):
            rt = do_update_users_setting(arguments).data.decode()
            return json.loads(rt)

    class LoadProjectPermission:
        @staticmethod
        def run(arguments):
            return do_load_project_permission(arguments)
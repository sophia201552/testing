# coding=utf-8

from mainService import DataServer
from mainService import Views
import json
from mod_DTU import dtuserver

class TestSpecific:
    CONTEXT_NAME = 'BEOPSERVICE'
    class GetHistoryDataPadded:
        NO_HISTORY_DATA = 'no data history'
        INVALID_TIME_STRING = 'invalid time string'
        UNSUPPORTED_TIMEFORMAT = 'time period format not supported'
        M5_DAYS_RANGE = 30
        H1_DAYS_RANGE = 60
        D1_DAYS_RANGE = 365
        START_TIME_GT_END_TIME = 'error: startTime > endTime'

        @staticmethod
        def run(arguments):
            return DataServer.do_get_history_data_padded(arguments)

        @staticmethod
        def get_error_from_response(response_json):
            if response_json is None:
                return None
            if not isinstance(response_json, list):
                return None
            inner_json = response_json[0]
            if not isinstance(inner_json, dict):
                return None
            error = inner_json.get('error')
            if error == 'historyData':
                return inner_json.get('msg')
            return error



    class GetRealtimeData:
        @staticmethod
        def run(arguments):
            return DataServer.do_get_realtimedata(arguments)

        @staticmethod
        def get_error_from_response(response_json):
            if response_json is None:
                return None
            if not isinstance(response_json, list):
                return None
            inner_json = response_json[0]
            if not isinstance(inner_json, dict):
                return None
            error = inner_json.get('error')
            if error == 'historyData':
                return inner_json.get('msg')
            return error


    class GetRealtimeDataWithTime:
        @staticmethod
        def run(arguments):
            return DataServer.do_get_realtimedata_with_time(arguments)
        
        @staticmethod
        def run_of_raw(arguments):
            return DataServer.do_get_realtimedata_with_time_raw(arguments)

        @staticmethod
        def get_error_from_response(response_json):
            if response_json is None:
                return None
            if not isinstance(response_json, list):
                return None
            inner_json = response_json[0]
            if not isinstance(inner_json, dict):
                return None
            error = inner_json.get('error')
            if error == 'historyData':
                return inner_json.get('msg')
            return error

    class SaveDataToMongoDB:
        @staticmethod
        def run(arguments):
            return DataServer.do_saveDataToMongodb(arguments)

    class GetHistoryAtTime:
        @staticmethod
        def run(arguments):
            return Views.do_get_history_at_time(arguments)


    class CopyRealtimedataBetweenProject:
        @staticmethod
        def run(arguments):
            return DataServer.do_copy_realtimedata_between_project(arguments)


    class SyncDataToMongodb:
        INSERT_CORRECT="insert into collection m5_data_beopdata_myTest, length is %d"
        TIMEFORMAT_ERROR="timeformat must in ['m1','m5','h1','d1','month']"
        OUT_TIME_ERROR="projId = 49, mongo conn is none, check locate_map table"
        DBNAME_WITH_NUMBER_ERROR="interface /sync_data_to_mongodb failed:'int' object has no attribute 'lower'"
        DBNAME_WITH_NULL="dbname is none"
        TIME_ERROR="time data '{0}' does not match format '%Y-%m-%d %H:%M:%S'"
        HISTORY_TIME_ERROR="interface /sync_data_to_mongodb failed:time data '{0}' does not match format '%Y-%m-%d %H:%M:%S'"
        NO_HISTORY="hisdata is none"
        OUT_LIST_RANGE="interface /sync_data_to_mongodb failed:list index out of range"
        @staticmethod
        def run(arguments):
            return json.loads(DataServer.do_sync_data_to_mongodb(arguments))

        @staticmethod
        def get_error_from_response(response_json):
            if response_json is None:
                return None
            if not isinstance(response_json, dict):
                return None
            error = response_json.get('error')
            if error:
                return response_json.get('msg')
            else:
                return None

    class SetRealtimedataByProjname:
        DB_NULL_ERROR="set_realtimedata_by_projname error:projId=None"
        NULL_POINT_ERROR={'error': 1, 'msg': 'pointList is array but every item content is all empty.'}
        @staticmethod
        def run(arguments):
            return DataServer.do_set_realtimedata_by_projname(arguments)

        @staticmethod
        def get_error_from_response(response_json):
            if response_json is None:
                return None
            if not isinstance(response_json, list):
                return None
            inner_json = response_json[0]
            if not isinstance(inner_json, dict):
                return None
            error = inner_json.get('error')
            if error == 'historyData':
                return inner_json.get('msg')
            return error

    class SetRealtimeDataByProjid:
        POINTNAME_ERROR = "failed: pointName is not string"

        @staticmethod
        def run(arguments):
            return DataServer.do_set_realtimedata_by_projid(arguments)

        @staticmethod
        def get_error_from_response(response):
            if response is None:
                return None
            if not isinstance(response, str):
                return None
            error = response
            return error

    class GetSaveSvrProjIdList:
        @staticmethod
        def run():
            return json.loads(Views.getSaveSvrProjIdList())

    class UpdateThirdData:
        CORRECT={"message": "ok", "error": 0}
        @staticmethod
        def run(arguments):
            return dtuserver.do_updateThirdData(arguments)


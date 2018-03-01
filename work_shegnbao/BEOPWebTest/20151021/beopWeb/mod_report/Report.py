__author__ = 'win7'
from datetime import datetime

from bson import ObjectId

from beopWeb.BEOPDataAccess import MongoConnManager, g_reportData, g_tableCustomNavItem
from beopWeb.mod_common.Utils import Utils


class Report:
    REPORT_BASE_PATH = '/static/projectReports/reports/'

    @property
    def mongodb(self):
        return MongoConnManager.getMongoConnByName()

    def get_report_by_menu_id(self, menu_id):
        collection = self.mongodb.mdbBb[g_tableCustomNavItem]
        return collection.find_one({'_id': ObjectId(menu_id)})

    def insert_or_update_report_data(self, project_id, folder, data):
        collection = self.mongodb.mdbBb[g_reportData]
        stored_project = collection.find_one({'projectId': project_id})
        if not stored_project:
            collection.insert_one({'projectId': project_id, 'reports': []})
        stored_report = collection.find_one({'projectId': project_id, 'reports.folder': folder})
        if not stored_report:
            return collection.update_one({'projectId': project_id},
                                         {'$push': {
                                             'reports': {'folder': folder, 'data': data,
                                                         'updateTime': datetime.now()}}})

        return collection.update_one({'projectId': project_id, 'reports.folder': folder},
                                     {'$set': {'reports.$.data': data, 'reports.$.updateTime': datetime.now()}},
                                     upsert=True)

    def get_report_structure(self, project_id, folder):
        collection = self.mongodb.mdbBb[g_reportData]
        if folder:
            stored_report = collection.find_one({'projectId': str(project_id), 'reports.folder': folder})
        else:
            stored_report = collection.find_one({'projectId': str(project_id)})
        if stored_report and isinstance(stored_report.get('reports'), list):
            return stored_report.get('reports')[0]
        return None

    def get_report_data(self, project_id, menu_id, chapter=None, unit=None):
        report = self.get_report_by_menu_id(menu_id)
        report_structure = self.get_report_structure(project_id, report.get('reportFolder'))
        if report_structure:
            report_json_data = report_structure.get('data')
        else:
            report_json_data = None
        if not report_json_data:
            return None
        if not chapter:
            return report_json_data
        result = []
        for report_data_item in report_json_data:
            if report_data_item.get('name') == chapter:
                chapter_result = {'name': chapter, 'units': []}
                if not unit:
                    chapter_result = report_data_item
                else:
                    for unit_item in report_data_item.get('units'):
                        if unit_item.get('unitName') == unit:
                            chapter_result['units'].append(unit_item)
                result.append(chapter_result)
        return result

"""Factory 数据处理层"""
import logging
from datetime import datetime
from beopWeb.MongoConnManager import MongoConnManager
from bson.objectid import ObjectId
import os
import time

#define table names
g_table_fac_project = 'Fac_Project'
g_table_fac_user_project = 'Fac_User_Project'
g_table_fac_page = 'Fac_Page'
g_table_fac_sprite = 'Fac_Sprite'
g_table_fac_layer = 'Fac_Layer'
g_table_fac_widget = 'Fac_Widget'
g_table_fac_historyshot = 'Fac_HistoryShot'
g_table_fac_template = 'Fac_Template'
g_table_fac_log = 'Fac_Log'
g_table_fac_pagebak = 'Fac_PageBak'
g_table_fac_configuration = 'Fac_Configuration'
g_table_fac_proj_sprite = 'Fac_ProjSprite'
g_table_fac_navigation = 'Fac_Navigation'
g_table_fac_material = 'Fac_Material'
g_table_fac_spring_layout = 'Fac_SpringLayout'
g_table_fac_report_wrap = 'Fac_ReportWrap'
g_table_fac_report_data = 'Fac_ReportData'

class FactoryService:
    @classmethod
    def recover_page_list(cls, proj_id):
        ''' 恢复意外丢失的页面列表 '''
        result = None
        cursor = None
        old_page_list = None
        new_page_list = None
        conn = MongoConnManager.getConfigConn()

        try:
            result = conn.mdbBb[g_table_fac_navigation]\
                        .find_one({'_id': ObjectId(proj_id)})
            old_page_list = [] if result is None else result.get('list', [])

            cursor = conn.mdbBb[g_table_fac_page]\
                        .find({'projId': proj_id, '$or': [{'status': 0}, {'status': {'$exists': False}}]}, {'_id': 1})
            result = list(cursor)

            new_page_list = []
            for item in result:
                new_page_list.append(str(item.get('_id')))
            
            index_dict = {k: i for i, k in enumerate(old_page_list)}
            new_page_list = sorted(new_page_list, key=lambda x: index_dict.get(x, -1))
            
            result = conn.mdbBb[g_table_fac_navigation].update_one({'_id': ObjectId(proj_id)}, {'$set': {'list': new_page_list}})
            result = True
        except Exception as expt:
            print('recover_page_list error:' + expt.__str__())
            logging.error('recover_page_list error:' + expt.__str__())
            result = False
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def factoryPageSave(cls, projId, data):
        rt = False
        conn = MongoConnManager.getConfigConn()
        try:
            if ObjectId.is_valid(projId):
                result = conn.mdbBb[g_table_fac_navigation]\
                        .find_one({'_id': ObjectId(projId)})
                old_page_list = [] if result is None else result.get('list', [])
                page = data.get('page')
                list = data.get('list')
                if page and list:
                    id = page.get('id')
                    #合并新老list
                    index = list.index(id)
                    if index == 0:
                        old_page_list.insert( 0, id )
                    else:
                        prevId = list[ index - 1]
                        if prevId in old_page_list:
                            prevIdIndex = old_page_list.index(prevId)
                            old_page_list.insert( prevIdIndex + 1, id )
                        else:
                            old_page_list.insert( 0, id )
                    list = old_page_list
                    if ObjectId.is_valid(id):
                        query = dict()
                        query['_id'] = ObjectId(id)
                        set_content = dict()
                        for subkey in page.keys():
                            if subkey == 'id':
                                continue
                            set_content[subkey] = page.get(subkey)
                        if set_content:
                            conn.mdbBb[g_table_fac_page].update(query, {'$set': set_content}, True)
                            conn.mdbBb[g_table_fac_navigation].update({'_id': ObjectId(projId)},{'$set': {'list': list}})
                        # extra insert
                        cls.AddProjAndPages(projId, id)
                rt = True
        except Exception as e:
            rt = False
            print('factoryPageSave failed:%s' % (e.__str__(),))
            logging.error('factoryPageSave failed:%s' % (e.__str__(),))
        return rt
    
    @classmethod
    def factoryPageDelete(cls, projId, data):
        rt = False
        conn = MongoConnManager.getConfigConn()
        try:
            result = conn.mdbBb[g_table_fac_navigation]\
                    .find_one({'_id': ObjectId(projId)})
            old_page_list = [] if result is None else result.get('list', [])
            if ObjectId.is_valid(projId):
                page = data.get('page')
                # list = data.get('list')
                if page and len(old_page_list) > 0:
                    for pageId in page:
                        if ObjectId.is_valid(pageId):
                            query = dict()
                            query['_id'] = ObjectId(pageId)
                            conn.mdbBb[g_table_fac_page].update(query, {'$set': {'status':1}}, True)
                            if pageId in old_page_list:
                                old_page_list.pop(old_page_list.index(pageId))
                        else:
                            return False
                    conn.mdbBb[g_table_fac_navigation].update({'_id': ObjectId(projId)}, {'$set': {'list': old_page_list}})
                rt = True
        except Exception as e:
            rt = False
            print('factoryPageDelete failed:%s' % (e.__str__(),))
            logging.error('factoryPageDelete failed:%s' % (e.__str__(),))
        return rt
    
    @classmethod
    def ModifyPageList(cls, projId, pageList, pages=[], pageListInfo=[]):
        rt = False
        conn = MongoConnManager.getConfigConn()
        try:
            if ObjectId.is_valid(projId):
                result = conn.mdbBb[g_table_fac_navigation]\
                        .find_one({'_id': ObjectId(projId)})
                old_page_list = [] if result is None else result.get('list', [])
                for pageId in pages:
                    index = pageList.index(pageId)
                    if pageId in old_page_list:
                        old_page_list.pop(old_page_list.index(pageId))
                    if index == 0:
                        old_page_list.insert( 0, pageId )
                    else:
                        prevId = pageList[ index - 1]
                        if prevId in old_page_list:
                            for sigleInfo in pageListInfo:
                                if sigleInfo['_id'] == prevId:
                                    prevInfo = sigleInfo
                                elif sigleInfo['_id'] == pageId:
                                    pageInfo = sigleInfo
                            if pageInfo['parent'] == prevInfo['parent']:
                                prevIdIndex = old_page_list.index(prevId)
                                old_page_list.insert( prevIdIndex + 1, pageId )
                            else:
                                prevIdIndex = old_page_list.index(prevInfo['parent'])
                                old_page_list.insert( prevIdIndex + 1, pageId )
                        else:
                            old_page_list.insert( 0, pageId )
                conn.mdbBb[g_table_fac_navigation].update({'_id':ObjectId(projId)}, {'$set':{'list': old_page_list}})
                rt = True
        except Exception as e:
            print('ModifyPageList failed:%s'%(e.__str__(),))
            logging.error('ModifyPageList failed:%s'%(e.__str__(),))
        return rt

    @classmethod
    def AddProjAndPages(cls, projId, pageId):
        rt = False
        conn = MongoConnManager.getConfigConn()
        try:
            if ObjectId.is_valid(projId):
                conn.mdbBb[g_table_fac_navigation].update({'_id':ObjectId(projId)}, {'$addToSet':{'list':pageId}}, True)
                rt = True
        except Exception as e:
            print('AddProjAndPages failed:%s'%(e.__str__(),))
            logging.error('AddProjAndPages failed:%s'%(e.__str__(),))
        return rt
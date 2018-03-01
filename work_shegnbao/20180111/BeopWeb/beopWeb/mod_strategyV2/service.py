"""策略组态 数据处理层"""
import logging
from datetime import datetime
from beopWeb.MongoConnManager import MongoConnManager
from bson.objectid import ObjectId
from beopWeb.mod_dqd.dqd import DQD
import os
import time
import xlwt
import xlrd

#define table names
TABLE_STRATEGY_ITEM = 'StrategyV2_Item'
TABLE_STRATEGY_MODULE = 'StrategyV2_Module'
TABLE_STRATEGY_TEMPALTE = 'StrategyV2_Template'
TABLE_STRATEGY_TEMPLATE_MODULE = 'StrategyV2_Template_Module'
TABLE_STRATEGY_LOG = 'StrategyV2_Log'
TABLE_STRATEGY_PROJECT_CONFIG = 'StrategyV2_ProjectConfig'
TABLE_STRATEGY_ITEM_ONLINE = 'StrategyV2_Item_OnLine'
TABLE_STRATEGY_MODULE_ONLINE = 'StrategyV2_Module_OnLine'
TABLE_STRATEGY_TEMPLATE_ITEM = 'StrategyV2_Template_Item'
TABLE_STRATEGY_TEMPLATE_MODULE = 'StrategyV2_Template_Module'

class StrategyService:
    ''' 策略组态 数据处理类 '''

    @classmethod
    def str_to_objectid(cls, item):
        ''' str 转换成 object id '''
        if item is None:
            return

        if isinstance(item, list):
            for key, value in enumerate(item):
                if ObjectId.is_valid(value):
                    item[key] = ObjectId(value)
                else:
                    cls.str_to_objectid(value)
        elif isinstance(item, dict):
            for key, value in item.items():
                if ObjectId.is_valid(value):
                    item.update({key: ObjectId(value)})
                else:
                    cls.str_to_objectid(value)

    @classmethod
    def log(cls, user_id, op_type, data):
        ''' 写入日志 '''
        result = None
        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_LOG].insert_one({
                'userId': user_id,
                'type': op_type.value,
                'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'data': str(data)
            })
            if not result.inserted_id is None:
                result = result.inserted_id
        except Exception as expt:
            print('strategy log error:' + expt.__str__())
            logging.error('strategy log error:' + expt.__str__())
            return None
        return result

    @classmethod
    def get_items_by_parent_id(cls, proj_id, parent_id):
        ''' 根据 parent id 获取策略列表 '''
        result = None
        cursor = None
        query = {
            'projId': int(proj_id)
        }

        if ObjectId.is_valid(parent_id):
            query['parentId'] = ObjectId(parent_id)
        else:
            query['parentId'] = ''

        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .find(query)
            result = list(cursor)
        except Exception as expt:
            print('get_items_by_parent_id error:' + expt.__str__())
            logging.error('get_items_by_parent_id error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def get_item_by_id(cls, item_id):
        ''' 根据策略 id 获取策略信息 '''
        result = None
        modules = None
        item_obj_id = ObjectId(item_id)
        cursor = None
        try:
            conn = MongoConnManager.getConfigConn()
            result = conn.mdbBb[TABLE_STRATEGY_ITEM]\
                        .find_one({'_id': item_obj_id})

            if result is None:
                return None

            cursor = conn.mdbBb[TABLE_STRATEGY_MODULE]\
                        .find({'strategyId': item_obj_id})
            modules = list(cursor)
        except Exception as expt:
            print('get_item_by_id error:' + expt.__str__())
            logging.error('get_item_by_id error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return {'strategy': result, 'modules': modules}

    @classmethod
    def add_items(cls, data):
        ''' 新增策略数据 '''
        result = None

        if not isinstance(data, list):
            data = [data]

        try:
            cls.str_to_objectid(data)
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .insert_many(data)
            result = [str(x) for x in result.inserted_ids]
            result = result[0] if len(result) == 0 else result
        except Exception as expt:
            print('add_items error:' + expt.__str__())
            logging.error('add_items error:' + expt.__str__())
            return None
        return result

    @classmethod
    def update_items_by_ids(cls, ids, data):
        ''' 更新策略数据 '''
        result = None
        if not isinstance(ids, list):
            ids = [ids]

        try:
            cls.str_to_objectid(data)
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .update_many({'_id': {'$in': [ObjectId(x) for x in ids]}},\
                         {'$set': data}, True)
            if result.modified_count > 0:
                result = result.modified_count
            elif not result.upserted_id is None:
                result = str(result.upserted_id)
            else:
                result = 'no_items_modified'
        except Exception as expt:
            print('update_items_by_ids error:' + expt.__str__())
            logging.error('update_items_by_ids error:' + expt.__str__())
            return None
        return result

    @classmethod
    def del_items_by_ids(cls, ids):
        ''' 删除策略数据 '''
        result = None
        if not isinstance(ids, list):
            ids = [ids]

        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .delete_many({'_id': {'$in': [ObjectId(x) for x in ids]}})
            if result.deleted_count > 0:
                result = result.deleted_count
            else:
                result = 'no_items_deleted'
        except Exception as expt:
            print('del_items_by_ids error:' + expt.__str__())
            logging.error('del_items_by_ids error:' + expt.__str__())
            return None
        return result


    @classmethod
    def search_items_by_name(cls, proj_id, search_text=''):
        result = None
        cursor = None
        query = {
            'projId': int(proj_id),
            'name': {'$regex': '.*%s.*' % search_text, '$options': 'i'}
        }
        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .find(query)
            result = list(cursor)
        except Exception as expt:
            print('del_items_by_ids error:' + expt.__str__())
            logging.error('del_items_by_ids error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def add_modules(cls, data):
        ''' 批量新增模块数据 '''
        result = None

        if not isinstance(data, list):
            data = [data]

        try:
            cls.str_to_objectid(data)
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE]\
                        .insert_many(data)
            result = [str(x) for x in result.inserted_ids]
            result = result[0] if len(result) == 0 else result
        except Exception as expt:
            print('add_modules error:' + expt.__str__())
            logging.error('add_modules error:' + expt.__str__())
            return None
        return result

    @classmethod
    def update_module_by_id(cls, module_id, data):
        ''' 根据 id 修改策略的模块数据 '''
        result = None
        try:
            cls.str_to_objectid(data)
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE]\
                        .update_one({'_id': ObjectId(module_id)}, {'$set': data}, True)
            if result.modified_count > 0:
                result = result.modified_count
            elif not result.upserted_id is None:
                result = str(result.upserted_id)
            else:
                result = 'no_items_modified'
        except Exception as expt:
            print('update_module_by_id error:' + expt.__str__())
            logging.error('update_module_by_id error:' + expt.__str__())
            return None
        return result

    @classmethod
    def del_modules_by_ids(cls, ids):
        ''' 删除策略的模块数据 '''
        result = None
        if not isinstance(ids, list):
            ids = [ids]

        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE]\
                        .delete_many({'_id': {'$in': [ObjectId(x) for x in ids]}})
            if result.deleted_count > 0:
                result = result.deleted_count
            else:
                result = 'no_items_deleted'
        except Exception as expt:
            print('del_modules_by_ids error:' + expt.__str__())
            logging.error('del_modules_by_ids error:' + expt.__str__())
            return None
        return result
    @classmethod
    def get_item_by_ids(cls, ids):
        ''' 根据策略 id 获取策略信息 '''
        result = None
        modules = None
        cursor = None
        
        try:
            conn = MongoConnManager.getConfigConn()
            result = conn.mdbBb[TABLE_STRATEGY_ITEM]\
                        .find({'_id': {'$in': [ObjectId(x) for x in ids]}})
            result = list(result)
            if result is None:
                return None

            cursor = conn.mdbBb[TABLE_STRATEGY_MODULE]\
                        .find({'strategyId': {'$in': [ObjectId(x) for x in ids]}})
            modules = list(cursor)
        except Exception as expt:
            print('get_item_by_id error:' + expt.__str__())
            logging.error('get_item_by_id error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return {'strategy': result, 'modules': modules}

    @classmethod
    def publish_items_by_ids(cls, data, modules):
        # '''发布策略'''
        modified_count = 0
        upserted_count = 0
        no_matched_count = 0

        try:
            cls.str_to_objectid(data)
            for index,value in enumerate(data):
                result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM_ONLINE]\
                    .update_one({'_id': ObjectId(value.get('_id')) },\
                        {'$set': value}, True)
                if result.modified_count > 0:
                    modified_count += result.modified_count
                elif not result.upserted_id is None:
                    upserted_count += 1
                else:
                    no_matched_count += 1

            cls.str_to_objectid(modules)
            for index, item in enumerate(modules):
                result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE_ONLINE]\
                    .update_one({'_id':  item['_id']},\
                        {'$set': item}, True)
                if result.modified_count > 0:
                    modified_count += result.modified_count
                elif not result.upserted_id is None:
                    upserted_count += 1
                else:
                    no_matched_count += 1
           
        except Exception as expt:
            print('publish_items_by_ids error:' + expt.__str__())
            logging.error('publish_items_by_ids error:' + expt.__str__())
            return None
        return modified_count, upserted_count, no_matched_count
    @classmethod
    def add_new_file(cls,data):
        '''新增模板的文件'''
        result = None
        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_ITEM]\
                        .insert(data)
        except Exception as expt:
            print('add_new_file error:' + expt.__str__())
            logging.error('add_new_file error:' + expt.__str__())
            return None
        return result
    @classmethod
    def get_template_tree(cls):
        '''获取模板树'''
        result = None
        cursor = None
        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_ITEM]\
                        .find({'isParent':1})
            result = list(cursor)
        except Exception as expt:
            print('get_template_tree error:' + expt.__str__())
            logging.error('get_template_tree error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result
    @classmethod
    def get_templates(cls,selectedIds,grade,source,tags,key,user):
        '''筛选模板'''
        result = None
        cursor = None
        query = {}
        rs=[]
        try:
            modules = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_MODULE]\
                    .find()
            modulesArr = list(modules)
            if selectedIds and grade =='' and source == '' and len(tags)==0 and key=='':
                query['parent'] = {'$in': selectedIds}
                cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_ITEM]\
                    .find(query)
                result = list(cursor)
            else:
                res = cls.recursion_templates(selectedIds,grade,source,tags,key,user)
                while res:
                    parent_id = []
                    for i in res:
                        if i['isParent'] == 1:
                            parent_id.append(i['id'])
                        else:
                            if grade and grade== i['grade']:
                                rs.append(i)
                            elif source:
                                condition=None
                                if source == 'official':
                                    condition = i['creatorId'] == 1
                                elif source =='share':
                                    condition = i['creatorId'] != user
                                elif source == 'owen':
                                    condition = i['creatorId'] == user
                                if condition:
                                    rs.append(i)
                            elif tags and len(list(set(i['tagArr']).intersection(set(tags)))) != 0:
                                 rs.append(i)
                            elif key and key in i['tagArr']:
                                rs.append(i)
                    if len(parent_id) == 0 :
                        res = []
                    else:
                        res = cls.recursion_templates(parent_id, grade, source, tags, key, user)
                result = rs
            for strategy in result:
                strategy['modules'] = []
                for module in modulesArr:
                    if strategy['id'] == module['strategyId']:
                        strategy['modules'].append(module)
        except Exception as expt:
            print('get_template_tree error:' + expt.__str__())
            logging.error('get_template_tree error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result
    @classmethod
    def recursion_templates(cls,selectedIds,grade,source,tags,key,user):
        '''递归 拿到所有的策略模板'''
        query = {}
        if selectedIds:
            query['parent'] = {'$in': selectedIds}
        cursor =  MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_ITEM]\
            .find(query)
        result = list(cursor)
        return result
    @classmethod
    def delete_template(cls, templateId):
        '''删除模板'''
        result = None
        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_ITEM]\
                        .delete_many({'id': templateId})
            resultTwo = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_MODULE]\
                        .delete_many({'strategyId': templateId})           
        except Exception as expt:
            print('delete_template error:' + expt.__str__())
            logging.error('delete_template error:' + expt.__str__())
            return None
        return result
    @classmethod
    def export_template(cls, modules,strategyInfo):
        '''导出模板'''
        resultOne = None
        resultTwo = None
        try:
            resultOne = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_ITEM]\
                        .insert_one(strategyInfo)
            resultTwo = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_MODULE]\
                        .insert_many(modules)
        except Exception as expt:
            print('export_template error:' + expt.__str__())
            logging.error('export_template error:' + expt.__str__())
            return None
        return resultOne
    @classmethod
    def update_template(cls, templateId,info):
        '''编辑模板'''
        result = None
        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_ITEM]\
                        .update_one({"id":templateId},{'$set':info},True)
        except Exception as expt:
            print('export_template error:' + expt.__str__())
            logging.error('export_template error:' + expt.__str__())
            return None
        return result
    @classmethod
    def copy_template_add_new(cls, data, modules):
        '''根据模板生成新的策略'''
        resultOne = None
        resultTwo = None
        try:
            cls.str_to_objectid(data)
            cls.str_to_objectid(modules)
            resultOne = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .insert_one(data)
            resultTwo = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE]\
                        .insert_many(modules)
        except Exception as expt:
            print('copy_template_add_new error:' + expt.__str__())
            logging.error('copy_template_add_new error:' + expt.__str__())
            return None
        return resultOne
    @classmethod
    def temp_save_excel(cls, post_file):
        '''存在临时文件下'''
        data = None
        try:
            if post_file:
                dirPath = os.path.abspath('.') + '/temp'
                if not os.path.exists(dirPath):
                    os.makedirs(dirPath)
                for file in post_file:
                    suffix = file.filename.split('.')[-1]
                    if suffix == 'xls' or suffix == 'xlsx' or suffix == 'csv':
                        filefullpath = dirPath + '/' + ObjectId().__str__() + '.' + suffix
                        file.save(filefullpath)
                        data = cls.read_excel(filefullpath)
                        if data:
                            rt = data
        except Exception as expt:
            print('temp_save_excel error:' + expt.__str__())
            logging.error('temp_save_excel error:' + expt.__str__())
            return None
        return data

    @classmethod
    def read_excel(cls, filepath):
        '''解析excel文件''' 
        result = {
            'data': [],
            'value': []
        } 
        try:
            # open excel
            datafile = xlrd.open_workbook(filepath)
            # get sheets
            nsheets = datafile.nsheets
            for sheetIndex in range(nsheets):
                sheet = datafile.sheet_by_index(sheetIndex)
                #行数
                nrows = sheet.nrows
                names = []
                times = []
                datas = []
                if nrows > 1:
                    ncols = sheet.ncols #列数
                    for x in range(0, nrows):
                        row_data = sheet.row_values(x)
                        if x == 0:
                            row_data.pop(0)
                            names = row_data
                        if x > 0:
                            time = row_data[0]
                            times.append(time)
                            row_data.pop(0)
                            datas.append(row_data)
                    result['time'] = times
                    for index,name in enumerate(names):
                        newData = []
                        for singleData in datas:
                            newData.append(singleData[index])
                        result['data'].append({
                            'name': name,
                            'value': newData
                        })
        except Exception as expt:
            print('read_excel error:' + expt.__str__())
            logging.error('read_excel error:' + expt.__str__())
            return None
        return result

    @classmethod
    def whrite_error_log(cls, params):
        data = params.get('data')
        projName = params.get('path')
        userId = params.get('userId')
        navigatorInfo = params.get('navigatorInfo')
        filepath = None
        filename = None
        errorId = None
        rt = None
        try:
            path = os.getcwd()
            filepath = path + '/beopWeb/static/errorLog/'+projName
            if not os.path.exists(filepath):
                os.makedirs(filepath)
            filename = time.strftime('%Y-%m-%d',time.localtime(time.time()))+'.txt'
            filepath = filepath + '/' + filename
            errorId = ObjectId().__str__()
            fp = open(filepath,'a')
            fp.write('id: '+errorId+'\n')
            fp.write('用户信息'+'\n')
            fp.write('userId: '+str(userId)+'\n')
            fp.write('浏览器信息'+'\n')
            for key in navigatorInfo:
                fp.write(key+': '+str(navigatorInfo[key])+'\n')
            for item in data:
                fp.write('错误信息'+'\n')
                for key in item:
                    fp.write(key+': '+str(item[key])+'\n')
                fp.write('\n')
            fp.write('End'+'\n'+'\n')
            fp.close()
            rt = '/static/errorLog/'+projName+'/' + filename
        except Exception:
            rt = None
            errorId = None
            log.unhandled_exception(locals())
        return {"errorId":errorId,"path":rt}
    @classmethod
    def read_error_log(cls, params):
        projName = params.get('path')
        filepath = None
        filename = None
        rt = None
        try:
            path = os.getcwd()
            filepath = path + '/beopWeb/static/errorLog/'+projName
            if not os.path.exists(filepath):
                return rt
            filename = params.get('time')+'.txt'
            filepath = filepath + '/' + filename
            fp = open(filepath,'r')
            rt = fp.read()
            fp.close()
        except Exception:
            log.unhandled_exception(locals())
        return rt

    @classmethod
    def write_excel_type1(cls, rowNameList, valueList):
        rt = None
        try:
            path = os.getcwd()
            filepath = path + '/beopWeb/static/projectReports/reports'
            if not os.path.exists(filepath):
                os.makedirs(filepath)
            filename = ObjectId().__str__() + '.xls'
            filepath = filepath + '/' + filename.__str__()

            f = xlwt.Workbook(encoding='utf-8')
            sheet1 = f.add_sheet(u'sheet1', cell_overwrite_ok=True)
            for i, name in enumerate(rowNameList):
                sheet1.write(0,i,name)
            for i, vArr in enumerate(valueList):
                for l, value in enumerate(vArr):
                    sheet1.write(i+1,l,value)
            f.save(filepath)  # 保存文件
            rt = filename
        except Exception:
            rt = None
        return rt
    
    @classmethod
    def read_excel_dataMonitoring(cls, filepath):
        '''解析excel文件''' 
        data = {}
        try:
            # open excel
            datafile = xlrd.open_workbook(filepath,formatting_info=True)
            # get sheets
            nsheets = datafile.nsheets
            for sheetIndex in range(nsheets):
                sheet = datafile.sheet_by_index(sheetIndex)
                #行数
                nrows = sheet.nrows
                if nrows > 1:
                    ncols = sheet.ncols #列数
                    header = sheet.row_values(0)
                    for x in range(1, nrows):
                        row_data = sheet.row_values(x)
                        item = {}
                        for i in range(0, ncols):
                            key = header[i]
                            v = row_data[i]       
                            item[key] = v
                        name = item[header[0]]
                        del item[header[0]]
                        data[name] = item
                        
        except Exception as expt:
            print('read_excel_dataMonitoring error:' + expt.__str__())
            logging.error('read_excel_dataMonitoring error:' + expt.__str__())
            return None
        return data
    
    

    @classmethod
    def save_excel_dataMonitoring(cls, projId, post_file):
        data = None
        try:
            if post_file:
                dirPath = os.path.abspath('.') + '/temp'
                if not os.path.exists(dirPath):
                    os.makedirs(dirPath)
                file = post_file[0]
                suffix = file.filename.split('.')[-1]
                if suffix == 'xls' or suffix == 'xlsx':
                    filefullpath = dirPath + '/' + ObjectId().__str__() + '.' + suffix
                    file.save(filefullpath)
                    data = cls.read_excel_dataMonitoring(filefullpath)
                    if data:
                        dqd = DQD(projId)
                        rs = dqd.config_post(data)
                        if rs:
                            # error_code = 'ERROR_UPDATE_FAILURE'
                            data = None
        except Exception as expt:
            print('save_excel_dataMonitoring error:' + expt.__str__())
            logging.error('save_excel_dataMonitoring error:' + expt.__str__())
            return None
        return data
    
    @classmethod
    def read_excel_dataSource(cls, post_file):
        '''解析excel文件''' 
        data = None
        try:
            if post_file:
                dirPath = os.path.abspath('.') + '/temp'
                if not os.path.exists(dirPath):
                    os.makedirs(dirPath)
                file = post_file[0]
                suffix = file.filename.split('.')[-1]
                if suffix == 'xls' or suffix == 'xlsx':
                    filepath = dirPath + '/' + ObjectId().__str__() + '.' + suffix
                    file.save(filepath)
                    data = {}
                    # open excel
                    datafile = xlrd.open_workbook(filepath,formatting_info=True)
                    # get sheets
                    nsheets = datafile.nsheets
                    for sheetIndex in range(nsheets):
                        sheet = datafile.sheet_by_index(sheetIndex)
                        #行数
                        nrows = sheet.nrows
                        if nrows > 1:
                            ncols = sheet.ncols #列数
                            header = sheet.row_values(0)
                            for x in range(1, nrows):
                                row_data = sheet.row_values(x)
                                item = {}
                                for i in range(0, ncols):
                                    key = header[i]
                                    v = row_data[i]       
                                    item[key] = v
                                name = item[header[0]]
                                del item[header[0]]
                                data[name] = item
        except Exception as expt:
            print('read_excel_dataSource error:' + expt.__str__())
            logging.error('read_excel_dataSource error:' + expt.__str__())
            return None
        return data

    
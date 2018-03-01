__author__ = 'liqian'

from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess, g_tableCustomNav, g_tableCustomNavItem, g_tableBenchmark
from bson.objectid import ObjectId
from uuid import uuid4
import logging
from beopWeb.MongoConnManager import MongoConnManager


class MenuConfigure:
    db = MongoConnManager.getMongoConnByName()

    class MenuType:
        ObserverScreen = 'ObserverScreen'
        DiagnosisScreen = 'DiagnosisScreen'
        AnalysisScreen = 'AnalysisScreen'
        ReportScreen = 'ReportScreen'
        DropDownList = 'DropDownList'
        EnergyScreen = 'EnergyScreen'

    def _get_item_parent(self, parent_list, child):
        for item in parent_list:
            if child.get('parent') and str(item.get('_id')) == child.get('parent'):
                return item
            if item.get('children'):
                sub_child_parent = self._get_item_parent(item.get('children'), child)
                if sub_child_parent:
                    return sub_child_parent
        return None

    def handle_nav_item_object(self, item):
        item['_id'] = str(item.get('_id'))
        return item

    def handle_nav_item_to_db(self, items):
        for item in items:
            if 'children' in item:
                del item['children']
            if 'parent' in item and isinstance(item.get('parent'), ObjectId):
                item['parent'] = str(item.get('parent'))

    def get_project_nav_list(self, project_id, nav_type):
        nav = self.get_custom_nav(project_id)
        if nav:
            nav_item_list = nav.get('list')
        else:
            return []
        if not nav_item_list:
            return []
        if nav_item_list:
            cursor = self.db.mdbBb[g_tableCustomNavItem].find(
                {'_id': {'$in': [ObjectId(x) for x in nav_item_list if ObjectId.is_valid(x)]}, 'type': nav_type})
            return [x for x in cursor]
        else:
            return []

    def get_all_custom_nav_item(self, table, nav_item_list=[]):
        if not table:
            return None
        if nav_item_list:
            cursor = self.db.mdbBb[table].find(
                {'_id': {'$in': [ObjectId(x) for x in nav_item_list if ObjectId.is_valid(x)]}})
        else:
            cursor = self.db.mdbBb[table].find()
        all_items = [x for x in cursor]
        indexed_all_items = all_items
        if nav_item_list:
            indexed_all_items = []
            for old_indexed_nav_item in nav_item_list:
                for item in all_items:
                    if str(item.get('_id')) == str(old_indexed_nav_item):
                        indexed_all_items.append(item)

        nav = [self.handle_nav_item_object(x) for x in indexed_all_items if not x.get('parent')]
        for item in indexed_all_items:
            if item.get('parent'):
                parent = self._get_item_parent(nav, item)
                if parent:
                    children = parent.get('children')
                    if children is None:
                        parent['children'] = [self.handle_nav_item_object(item)]
                    else:
                        children.append(self.handle_nav_item_object(item))
        return nav

    def get_project_nav(self, project_id):
        nav = self.get_custom_nav(project_id)

        if nav:
            nav_item_list = nav.get('list')
        else:
            return []

        if not nav_item_list:
            return []
        else:
            nav_tree = self.get_all_custom_nav_item(g_tableCustomNavItem, nav_item_list)
            return nav_tree

    def get_benchmark_nav(self):
        return self.get_all_custom_nav_item(g_tableBenchmark)

    def get_menu_model(self, project_id):
        model = {
            'type': {
                "ObserverScreen": {
                    "text": '组态文件'
                },
                "DiagnosisScreen": {
                    "text": '系统诊断'
                },
                "AnalysisScreen": {
                    "text": '数据分析'
                },
                "ReportScreen": {
                    "text": '运营报表'
                },
                "DropDownList": {
                    "text": '下拉菜单'
                },
                "EnergyScreen": {
                    "text": '能耗统计'
                }
            },
            'nav': self.get_project_nav(project_id)
        }
        return model

    def get_benchmark_model(self):
        model = {
            'type': {
                "ObserverScreen": {
                    "text": '组态文件'
                },
                "DiagnosisScreen": {
                    "text": '系统诊断'
                },
                "AnalysisScreen": {
                    "text": '数据分析'
                },
                "EnergyScreen": {
                    "text": '能耗统计'
                }
            },
            'nav': self.get_benchmark_nav()
        }
        return model

    def get_custom_nav(self, project_id):
        try:
            project_id = int(project_id)
        except ValueError:
            logging.error('benchmark项目配置错误,项目ID为空')
            return {}
        nav = self.db.mdbBb[g_tableCustomNav].find_one({'projectId': project_id})
        return nav

    def detect_change(self, old, new):
        delete = []
        modify = []
        add = []

        new_ids = [x.get('_id') for x in new]
        for new_item in new:
            new_item_id = new_item.get('_id')
            if not new_item_id:
                add.append(new_item)
                continue
            elif new_item_id.startswith('new_'):
                add.append(new_item)
                continue
            for old_item in old:
                is_modified = False
                if new_item_id == old_item.get('_id'):
                    if new_item.get('text') != old_item.get('text'):
                        is_modified = True
                    elif new_item.get('type') != old_item.get('type'):
                        is_modified = True
                    elif new_item.get('name') != old_item.get('name'):
                        is_modified = True
                    elif new_item.get('title') != old_item.get('title'):
                        is_modified = True
                    elif new_item.get('points') != old_item.get('points'):
                        is_modified = True
                    elif new_item.get('description') != old_item.get('description'):
                        is_modified = True
                    elif new_item.get('unit') != old_item.get('unit'):
                        is_modified = True
                    elif new_item.get('desc') != old_item.get('desc'):
                        is_modified = True
                    elif new_item.get('pointType') != old_item.get('pointType'):
                        is_modified = True
                    elif new_item.get('type') == 'ReportScreen':
                        if new_item.get('reportType') != old_item.get('reportType'):
                            is_modified = True
                        elif new_item.get('reportFolder') != old_item.get('reportFolder'):
                            is_modified = True
                if is_modified:
                    modify.append(self.id_str_to_objectid(new_item))
        for old_item in old:
            if old_item.get('_id') not in new_ids:
                delete.append(self.id_str_to_objectid(old_item))

        return add, modify, delete

    def id_str_to_objectid(self, item):
        _id = item.get('_id')
        item['_id'] = ObjectId(_id) if ObjectId.is_valid(_id) else _id
        return item

    def get_all_children(self, model, children_result=[]):
        if not children_result:
            children_result = []

        for item in model:
            children = item.get('children')
            if children and isinstance(children, list):
                for child in children:
                    child['parent'] = item.get('_id')
                children_result = children_result + children
                children_result = self.get_all_children(children, children_result)

        return children_result

    def _set_child_parent_id(self, parent_old_id, parent_new_id, items):
        for item in items:
            if item.get('parent') == parent_old_id:
                item['parent'] = str(parent_new_id)

    def get_custom_nav_item_by_ids(self, ids):
        mongo_client_CustomNavItem = self.db.mdbBb[g_tableCustomNavItem]
        cursor = mongo_client_CustomNavItem.find({'_id': {'$in': ids}})
        return [x for x in cursor]

    def save_indexed_menu_list(self, project_id, id_list):
        if not project_id or not id_list:
            return False
        mongo_client_CustomNavItem = self.db.mdbBb[g_tableCustomNav]
        id_list = [ObjectId(x) if ObjectId.is_valid(x) else x for x in id_list]
        return mongo_client_CustomNavItem.update({'projectId': int(project_id)}, {'$set': {'list': id_list}})

    def save_menu_model(self, project_id, new_model, indexed_ids=None):
        old_model = self.get_project_nav(project_id)
        add, modify, delete = self.detect_change(old_model, new_model)
        all_new_children = self.get_all_children(new_model)
        all_old_children = self.get_all_children(old_model)
        children_add, children_modify, children_delete = self.detect_change(all_old_children, all_new_children)
        all_add = add + children_add
        all_modify = modify + children_modify
        all_delete = delete + children_delete

        if not self.get_custom_nav(project_id):
            self.add_custom_nav(project_id)

        mongo_client_CustomNavItem = self.db.mdbBb[g_tableCustomNavItem]
        success = True
        if all_add:
            self.handle_nav_item_to_db(all_add)
            try:
                for item in all_add:
                    old_id = item.get('_id')
                    del item['_id']
                    new_id = mongo_client_CustomNavItem.insert(item)
                    if indexed_ids:
                        indexed_ids = [new_id if x == old_id else x for x in indexed_ids]
                    self._set_child_parent_id(old_id, new_id, all_add)
                    self.add_to_custom_nav_list(project_id, item)
            except Exception as e:
                success = False

        saved_ids = []
        removed_ids = []
        if all_modify:
            self.handle_nav_item_to_db(all_modify)
            try:
                for item in all_modify:
                    saved_ids.append(mongo_client_CustomNavItem.save(item))
            except Exception:
                success = False

        if all_delete:
            self.handle_nav_item_to_db(all_delete)
            try:
                for item in all_delete:
                    item_id = item.get('_id')
                    if not item_id:
                        continue
                    if ObjectId.is_valid(item_id):
                        removed_ids.append(mongo_client_CustomNavItem.remove({'_id': ObjectId(item_id)}))
                        self.remove_from_custom_nav_list(project_id, item)
            except Exception:
                success = False
        return success, self.get_menu_model(project_id), indexed_ids

    def save_benchmark_model(self, new_model):
        old_model = self.get_benchmark_nav()
        add, modify, delete = self.detect_change(old_model, new_model)
        all_new_children = self.get_all_children(new_model)
        all_old_children = self.get_all_children(old_model)
        children_add, children_modify, children_delete = self.detect_change(all_old_children, all_new_children)
        all_add = add + children_add
        all_modify = modify + children_modify
        all_delete = delete + children_delete

        table_benchmark = self.db.mdbBb[g_tableBenchmark]
        success = True
        if all_add:
            self.handle_nav_item_to_db(all_add)
            try:
                for item in all_add:
                    old_id = item.get('_id')
                    del item['_id']
                    item['menuId'] = str(ObjectId())
                    new_id = table_benchmark.insert(item)
                    self._set_child_parent_id(old_id, new_id, all_add)
            except Exception as e:
                success = False

        saved_ids = []
        removed_ids = []
        if all_modify:
            self.handle_nav_item_to_db(all_modify)
            try:
                for item in all_modify:
                    if not item.get('menuId'):
                        item['menuId'] = str(uuid4())
                    saved_ids.append(table_benchmark.save(item))
            except Exception:
                success = False

        if all_delete:
            self.handle_nav_item_to_db(all_delete)
            try:
                for item in all_delete:
                    item_id = item.get('_id')
                    if not item_id:
                        continue
                    if ObjectId.is_valid(item_id):
                        removed_ids.append(table_benchmark.remove({'_id': ObjectId(item_id)}))
            except Exception:
                success = False
        return success, self.get_benchmark_model()

    def add_to_custom_nav_list(self, project_id, list_item):
        mongo_client_CustomNav = self.db.mdbBb[g_tableCustomNav]
        mongo_client_CustomNav.update({'projectId': project_id}, {'$addToSet': {'list': list_item.get('_id')}})

    def add_custom_nav(self, project_id):
        mongo_client_CustomNav = self.db.mdbBb[g_tableCustomNav]
        mongo_client_CustomNav.insert({'projectId': project_id, 'list': [], 'roleNav': {}})

    def remove_from_custom_nav_list(self, project_id, list_item):
        mongo_client_CustomNav = self.db.mdbBb[g_tableCustomNav]
        try:
            mongo_client_CustomNav.update({'projectId': project_id, 'list': list_item.get('_id')},
                                          {'$pull': {'list': list_item.get('_id')}})
        except Exception as e:
            print(e)

    def remove_custom_nav_role_nav(self, project_id, role_id):
        mongo_client_CustomNav = self.db.mdbBb[g_tableCustomNav]
        try:
            mongo_client_CustomNav.update({'projectId': int(project_id)},
                                          {'$unset': {'roleNav.' + role_id: ''}})
        except Exception as e:
            print(e)

    def _set_menu_model_selected(self, menu_model, configured_top_nav=[], configured_func_nav=[],
                                 configured_benchmark=[]):
        if 'nav' in menu_model:
            nav = menu_model.get('nav')
        else:
            nav = menu_model
        configured_top_nav = configured_top_nav if configured_top_nav else []
        configured_func_nav = configured_func_nav if configured_func_nav else []
        configured_benchmark = configured_benchmark if configured_benchmark else []
        for item in nav:
            for config_nav_item in configured_top_nav:
                if str(config_nav_item) == item.get('_id'):
                    item['topNavChecked'] = True
            for config_nav_item in configured_func_nav:
                if str(config_nav_item) == item.get('_id'):
                    item['funcNavChecked'] = True
            for configured_benchmark_item in configured_benchmark:
                if str(configured_benchmark_item) == item.get('_id'):
                    item['benchmarkChecked'] = True

            if 'children' in item:
                self._set_menu_model_selected(item.get('children'), configured_top_nav, configured_func_nav,
                                              configured_benchmark)

    def check_nav_item_exists(self, _id=None, text=None, item_type=None):
        if not _id and not text and not item_type:
            raise Exception('check_nav_item_exists needs arguments.')
        query = {}
        if _id:
            query['_id'] = _id
        if text:
            query['text'] = text
        if item_type:
            query['type'] = item_type
        item = self.db.mdbBb[g_tableCustomNavItem].find(query)
        return item.get('_id')

    def add_item_to_custom_nav_item(self, item_obj):
        return self.db.mdbBb[g_tableCustomNavItem].insert(item_obj)

    def get_menu_page_edit_model(self, project_id, role_id):
        workflow_item = self.db.mdbBb[g_tableCustomNavItem].find_one({'type': 'WorkflowMine'})
        if not workflow_item:
            workflow_id = self.add_item_to_custom_nav_item({'parent': '', 'text': '工单管理', 'type': 'WorkflowMine'})
            workflow_item = self.db.mdbBb[g_tableCustomNavItem].find_one({'_id': workflow_id})
        workflow_item['_id'] = str(workflow_item.get('_id'))

        custom_nav = self.get_custom_nav(project_id)
        if not custom_nav:
            role_nav = []
        else:
            role_nav = custom_nav.get('roleNav')
        # 将工单置入菜单中,可以配置工单管理选项
        menu_model = self.get_menu_model(project_id)
        menu_model_nav = menu_model.get('nav', [])
        menu_model_nav.append(workflow_item)
        menu_model['nav'] = menu_model_nav
        if not role_nav:
            configured_top_nav = []
            configured_func_nav = []
        else:
            role_nav_by_id = role_nav.get(str(role_id))
            if role_nav_by_id:
                configured_top_nav = role_nav_by_id.get('nav')
                configured_func_nav = role_nav_by_id.get('funcNav')
            else:
                configured_top_nav = []
                configured_func_nav = []
        self._set_menu_model_selected(menu_model, configured_top_nav, configured_func_nav)
        return menu_model

    def get_benchmark_menu_edit_model(self, project_id):
        benchmark_model = self.get_benchmark_model()
        custom_nav = self.get_custom_nav(project_id)
        if not custom_nav:
            configured_nav = []
        else:
            configured_nav = custom_nav.get('benchmark')
        self._set_menu_model_selected(benchmark_model, None, None, configured_nav)
        return benchmark_model

    def update_page_menu(self, project_id, role_id, top_nav_list, func_nav_list, benchmark_list):
        table_custom_nav = self.db.mdbBb[g_tableCustomNav]
        try:
            set_obj = {}
            if top_nav_list is not None:
                set_obj['roleNav.' + role_id + '.nav'] = [ObjectId(x) for x in top_nav_list if ObjectId.is_valid(x)]
            if func_nav_list is not None:
                set_obj['roleNav.' + role_id + '.funcNav'] = [ObjectId(x) for x in func_nav_list if
                                                              ObjectId.is_valid(x)]
            if benchmark_list is not None:
                set_obj['benchmark'] = [ObjectId(x) for x in benchmark_list if ObjectId.is_valid(x)]

            table_custom_nav.update({'projectId': int(project_id)}, {'$set': set_obj})
            return True
        except Exception as e:
            logging.error(e)

    def get_menu_texts_by_ids(self, id_list):
        result = []
        menu_names = {}
        if id_list is None:
            return []
        if len(id_list) > 0:
            object_id_list = [ObjectId(x) for x in id_list if ObjectId.is_valid(x)]
            try:
                cur = self.db.mdbBb[g_tableCustomNavItem].find({'_id': {'$in': object_id_list}})
                if cur is not None:
                    for item in cur:
                        menu_names[str(item.get('_id'))] = item.get('text')
            except Exception as e:
                logging.error(e)
        for menu_id in id_list:
            result.append(menu_names.get(menu_id))
        return result

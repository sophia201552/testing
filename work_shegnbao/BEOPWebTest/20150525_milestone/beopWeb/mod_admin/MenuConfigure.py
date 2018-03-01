__author__ = 'liqian'

from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess, g_tableCustomNav, g_tableCustomNavItem
from bson.objectid import ObjectId


class MenuConfigure:
    db = BEOPMongoDataAccess()

    class MenuType:
        ObserverScreen = 'ObserverScreen'
        DiagnosisScreen = 'DiagnosisScreen'
        AnalysisScreen = 'AnalysisScreen'
        ReportScreen = 'ReportScreen'
        DropDownList = 'DropDownList'
        EnergyScreen = 'EnergyScreen'

    def _get_item_parent(self, parent_list, child):
        for item in parent_list:
            if child.get('parent') and item.get('_id').__str__() == child.get('parent'):
                return item
        return None

    def handle_nav_item_object(self, item):
        item['_id'] = item.get('_id').__str__()
        return item

    def handle_nav_item_to_db(self, items):
        for item in items:
            if 'children' in item:
                del item['children']
            if 'parent' in item and isinstance(item.get('parent'), ObjectId):
                item['parent'] = item.get('parent').__str__()

    def get_all_custom_nav_item(self, nav_item_list=[]):
        cursor = self.db.mdbBb[g_tableCustomNavItem].find(
            {'_id': {'$in': [ObjectId(x) for x in nav_item_list if ObjectId.is_valid(x)]}})
        all_items = [x for x in cursor]

        nav = [self.handle_nav_item_object(x) for x in all_items if not x.get('parent')]
        for item in all_items:
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
            nav_tree = self.get_all_custom_nav_item(nav_item_list)
            return nav_tree

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

    def get_custom_nav(self, project_id):
        try:
            project_id = int(project_id)
        except ValueError:
            raise Exception('the project id is not numeral')
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
                if new_item_id == old_item.get('_id'):
                    if new_item.get('text') != old_item.get('text'):
                        modify.append(self.id_str_to_objectid(new_item))
                    elif new_item.get('type') != old_item.get('type'):
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
                self.get_all_children(children, children_result)

        return children_result

    def _set_child_parent_id(self, parent_old_id, parent_new_id, items):
        for item in items:
            if item.get('parent') == parent_old_id:
                item['parent'] = parent_new_id.__str__()

    def get_custom_nav_item_by_ids(self, ids):
        mongo_client_CustomNavItem = self.db.mdbBb[g_tableCustomNavItem]
        cursor = mongo_client_CustomNavItem.find({'_id': {'$in': ids}})
        return [x for x in cursor]


    def save_menu_model(self, project_id, new_model):
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
                    self._set_child_parent_id(old_id, new_id, all_add)
                    self.add_to_custom_nav_list(project_id, item)
            except Exception:
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
        return success, self.get_menu_model(project_id)

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

    def _set_menu_model_selected(self, menu_model, configured_top_nav=[], configured_func_nav=[]):
        if 'nav' in menu_model:
            nav = menu_model.get('nav')
        else:
            nav = menu_model
        configured_top_nav = configured_top_nav if configured_top_nav else []
        configured_func_nav = configured_func_nav if configured_func_nav else []
        for item in nav:
            for config_nav_item in configured_top_nav:
                if config_nav_item.__str__() == item.get('_id'):
                    item['topNavChecked'] = True
            for config_nav_item in configured_func_nav:
                if config_nav_item.__str__() == item.get('_id'):
                    item['funcNavChecked'] = True

            if 'children' in item:
                self._set_menu_model_selected(item.get('children'), configured_top_nav, configured_func_nav)

    def get_menu_page_edit_model(self, project_id, role_id):
        menu_model = self.get_menu_model(project_id)
        custom_nav = self.get_custom_nav(project_id)
        if not custom_nav:
            role_nav = []
        else:
            role_nav = custom_nav.get('roleNav')
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

    def update_page_menu(self, project_id, role_id, top_nav_list, func_nav_list):
        mongo_client_CustomNav = self.db.mdbBb[g_tableCustomNav]
        top_nav_obj_id_list = [ObjectId(x) for x in top_nav_list if ObjectId.is_valid(x)]
        func_nav_obj_id_list = [ObjectId(x) for x in func_nav_list if ObjectId.is_valid(x)]

        try:
            mongo_client_CustomNav.update({'projectId': int(project_id)},
                                          {'$set': {'roleNav.' + role_id + '.nav': top_nav_obj_id_list,
                                                    'roleNav.' + role_id + '.funcNav': func_nav_obj_id_list}})
            return True
        except Exception as e:
            print(e)

































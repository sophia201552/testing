__author__ = 'liqian'

from uuid import uuid4
import logging

from bson.objectid import ObjectId

from beopWeb.BEOPMongoDataAccess import g_tableCustomNav, g_tableCustomNavItem, g_tableBenchmark
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_oss.ossapi import OssAPI
from beopWeb.mod_oss.oss import GetBucketXml
from beopWeb.mod_common.Utils import Utils


class MenuConfigure:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn()
        self.navItemDb = self.db.mdbBb[g_tableCustomNavItem]
        self.navDb = self.db.mdbBb[g_tableCustomNav]

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
            cursor = self.navItemDb.find(
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
                    "text": '组态文件',
                    "enText": "S3db files"
                },
                "DiagnosisScreen": {
                    "text": '系统诊断',
                    "enText": "Diagnostic"
                },
                "AnalysisScreen": {
                    "text": '数据分析',
                    "enText": "Data analysis"
                },
                "ReportScreen": {
                    "text": '运营报表',
                    "enText": "Report"
                },
                "DropDownList": {
                    "text": '下拉菜单',
                    "enText": "Dropdown"
                },
                "EnergyScreen": {
                    "text": '能耗统计',
                    "enText": "Dashboard"
                },
                "EnergyScreen_M": {
                    "text": '移动端首页',
                    "enText": "Mobile page"
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
        nav = self.navDb.find_one({'projectId': project_id})
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
                        elif new_item.get('pic') != old_item.get('pic'):
                            is_modified = True
                    elif new_item.get('pic') != old_item.get('pic'):
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
        cursor = self.navItemDb.find({'_id': {'$in': ids}})
        return [x for x in cursor]

    def save_indexed_menu_list(self, project_id, id_list):
        if not project_id or not id_list:
            return False
        id_list = [ObjectId(x) if ObjectId.is_valid(x) else x for x in id_list]
        return self.navDb.update({'projectId': int(project_id)}, {'$set': {'list': id_list}})

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

        success = True
        if all_add:
            self.handle_nav_item_to_db(all_add)
            try:
                for item in all_add:
                    old_id = item.get('_id')
                    del item['_id']
                    new_id = self.navItemDb.insert(item)
                    if indexed_ids:
                        indexed_ids = [new_id if x == old_id else x for x in indexed_ids]
                    self._set_child_parent_id(old_id, new_id, all_add)
                    self.add_to_custom_nav_list(project_id, item)
                    self.navDb.update({'projectId': project_id}, {'$addToSet': {'nav': new_id}})
            except Exception as e:
                success = False

        saved_ids = []
        removed_ids = []
        if all_modify:
            self.handle_nav_item_to_db(all_modify)
            try:
                for item in all_modify:
                    saved_ids.append(self.navItemDb.save(item))
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
                        removed_ids.append(self.navItemDb.remove({'_id': ObjectId(item_id)}))
                        self.remove_from_custom_nav_list(project_id, item)
                        # 删除当前所有的roleNav中符合条件的nav
                        self.navDb.update({'projectId': int(project_id)},
                                          {"$pull": {"nav": item_id}})
                        self.navItemDb.update({"$pull": {"_id": ObjectId(item_id)}})
            except Exception as e:
                success = False

        # 更新当前所有的roleNav
        current_customNav = self.navDb.find_one({'projectId': project_id})
        try:
            # 父级的list列表
            parent_customNav_list = current_customNav.get("list")
            # 子级roleNav
            child_customNav_role = current_customNav.get("roleNav")

            # 更新所有的子级列表
            for child_item_nav in child_customNav_role:
                child_item_nav_list = child_customNav_role[child_item_nav].get("nav")
                # 查找另外一个集合中是否存在该列表
                for child_item_nav_list_id in child_item_nav_list:
                    try:
                        result = self.navItemDb.find_one({"_id": ObjectId(child_item_nav_list_id)})
                        if result:
                            continue
                        else:
                            child_item_nav_list.remove(child_item_nav_list_id)
                    except Exception as e:
                        continue
                try:
                    modify_result = list(set(parent_customNav_list).difference(set(child_item_nav_list)))
                    # for parent_item_nav in parent_customNav_list:
                    #  if not parent_item_nav in child_item_nav_list:
                    #    modify_result.append(parent_item_nav)
                    # 直接把父级拿过来
                    parent_customNav_list_clone = parent_customNav_list.copty()
                    if modify_result:
                        for diff in modify_result:
                            parent_customNav_list_clone.remove(diff)
                        child_customNav_role[child_item_nav]["nav"] = parent_customNav_list_clone
                    else:
                        child_customNav_role[child_item_nav]["nav"] = child_item_nav_list
                except Exception:
                    continue
            # 重新设置所有的roleNav
            self.navDb.update({'projectId': int(project_id)},
                              {"$set": {"roleNav": child_customNav_role}})
        except Exception as e:
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
        self.navDb.update({'projectId': project_id}, {'$addToSet': {'list': list_item.get('_id')}})

    def get_project_roles(self, project_id):
        nav = self.navDb.find_one({'projectId': project_id})
        roleNav = nav.get('roleNav', {}) if nav else {}
        return [k for k, v in roleNav.items()]

    def add_custom_nav(self, project_id):
        self.navDb.insert({'projectId': project_id, 'list': [], 'roleNav': {}})

    def remove_from_custom_nav_list(self, project_id, list_item):
        try:
            self.navDb.update({'projectId': project_id, 'list': list_item.get('_id')},
                              {'$pull': {'list': list_item.get('_id')}})
        except Exception as e:
            print(e)

    def remove_custom_nav_role_nav(self, project_id, role_id):
        try:
            self.navDb.update({'projectId': int(project_id)},
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
        item = self.navItemDb.find(query)
        return item.get('_id')

    def add_item_to_custom_nav_item(self, item_obj):
        return self.navItemDb.insert(item_obj)

    def get_menu_page_edit_model(self, project_id, role_id):
        custom_nav = self.get_custom_nav(project_id)
        if not custom_nav:
            role_nav = []
        else:
            role_nav = custom_nav.get('roleNav')
        menu_model = self.get_menu_model(project_id)
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

    def update_page_menu(self, project_id, role_ids, top_nav_list=None, func_nav_list=None, benchmark_list=None):
        try:
            set_obj = {}
            if type(role_ids) != list:
                role_ids = [role_ids]
            for role_id in role_ids:
                if top_nav_list is not None:
                    set_obj['roleNav.' + str(role_id) + '.nav'] = [ObjectId(x) for x in top_nav_list if
                                                                   ObjectId.is_valid(x)]
                if func_nav_list is not None:
                    set_obj['roleNav.' + str(role_id) + '.funcNav'] = [ObjectId(x) for x in func_nav_list if
                                                                       ObjectId.is_valid(x)]
                if benchmark_list is not None:
                    set_obj['benchmark'] = [ObjectId(x) for x in benchmark_list if ObjectId.is_valid(x)]
            if set_obj:
                self.navDb.update({'projectId': int(project_id)}, {'$set': set_obj})
            return True
        except Exception as e:
            logging.error(e)

    def merge_page_menu(self, project_id, role_ids, top_nav_list=None, func_nav_list=None, benchmark_list=None):
        try:
            merge_obj = {}
            if type(role_ids) != list:
                role_ids = [role_ids]
            for role_id in role_ids:
                if top_nav_list is not None:
                    merge_obj['roleNav.' + str(role_id) + '.nav'] = {'$each': [ObjectId(x) for x in top_nav_list if
                                                                   ObjectId.is_valid(x)]}
                if func_nav_list is not None:
                    merge_obj['roleNav.' + str(role_id) + '.funcNav'] = {'$each': [ObjectId(x) for x in func_nav_list if
                                                                       ObjectId.is_valid(x)]}
                if benchmark_list is not None:
                    merge_obj['benchmark'] = {'$each': [ObjectId(x) for x in benchmark_list if ObjectId.is_valid(x)]}
            if merge_obj:
                self.navDb.update({'projectId': int(project_id)}, {'$addToSet': merge_obj})
            return True
        except Exception as e:
            logging.error(e)

    def update_all_page_menu(self, project_id, top_nav_list):
        try:
            page_menu = self.navDb.find_one({'projectId': int(project_id)})
            role_nav = page_menu.get('roleNav', {})
            new_role_nav = {}
            new_nav = [ObjectId(x) for x in top_nav_list if ObjectId.is_valid(x)]
            for role, nav in role_nav.items():
                new_role_nav[role] = new_nav

            self.navDb.update_one({'projectId': int(project_id)}, {'$set': {'roleNav': new_role_nav}})
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
                cur = self.navItemDb.find({'_id': {'$in': object_id_list}})
                if cur is not None:
                    for item in cur:
                        menu_names[str(item.get('_id'))] = item.get('text')
            except Exception as e:
                logging.error(e)
        for menu_id in id_list:
            result.append(menu_names.get(menu_id))
        return result

    def get_oss_menu_pic_list(self):
        bucket = 'beopweb'
        prefix = 'static/images/menu/'
        file_list = {}
        try:
            oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
            res = oss.list_bucket(bucket, prefix=prefix, delimiter='/')
            objectlist = GetBucketXml(res.read())
        except Exception as e:
            print(e.__str__())
            logging.error(e)

        # prefix for file name
        default_skin_prefix = '-default'
        dark_skin_prefix = '-dark'
        # 如果没有按照格式命名文件就会归为others
        # 比如这样 Report.svg命名就会归为others
        # 需要写成 Report-default.svg 或者 Report-dark.svg
        others_prefix = 'others'
        # skin name
        default = 'default'
        dark = 'dark'
        file_list[default] = []
        file_list[dark] = []
        file_list[others_prefix] = []
        for f in objectlist.content_list:
            filename = self.get_oos_filename(f.key)
            if filename != None:
                if default_skin_prefix in filename:
                    file_list.get(default).append({'name': filename, 'path': f.key})
                elif dark_skin_prefix in filename:
                    file_list.get(dark).append({'name': filename, 'path': f.key})
                else:
                    file_list.get(others_prefix).append({'name': filename, 'path': f.key})
        return file_list

    def get_oos_filename(self, content):
        rv = None
        if content[-1] != '/':
            post = content.rfind('/')
            rv = content[post + 1:]
        return rv

    def create_project_nav(self, project_id, role_id):
        if not project_id:
            return False
        return self.navDb.insert({
            'roleNav': {
                str(role_id): {
                    'nav': []
                }
            },
            'list': [],
            'projectId': int(project_id)
        })

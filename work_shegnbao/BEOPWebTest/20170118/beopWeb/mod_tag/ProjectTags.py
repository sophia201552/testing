__author__ = 'win7'
from beopWeb.BEOPMongoDataAccess import g_table_project_tags
from beopWeb.MongoConnManager import MongoConnManager
from pymongo import ReturnDocument



class TagTreeNode:
    tag_id = None
    parent_id = None

    def __init__(self, tag_id, parent_id=None):
        self.tag_id = tag_id
        self.parent_id = parent_id

    def make_model(self):
        return {'tag_id': self.tag_id, 'parent_id': self.parent_id}


class ProjectTags:
    tags_tree = []
    project_id = None

    def __init__(self, project_id):
        if project_id:
            self.project_id = int(project_id)
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_project_tags]
        self.tags_tree = self.get_project_tags()

    def is_exists(self, tag_id, parent_id):
        for tag_node in self.tags_tree:
            if isinstance(tag_node, TagTreeNode):
                if tag_node.tag_id == tag_id and tag_node.parent_id == parent_id:
                    return True
            elif tag_node.get('tag_id') == tag_id and tag_node.get('parent_id') == parent_id:
                return True
        return False

    def add_tag_node(self, tag_tree_node):
        if isinstance(tag_tree_node, TagTreeNode) and not self.is_exists(tag_tree_node.tag_id, tag_tree_node.parent_id):
            self.tags_tree.append(tag_tree_node)

    def remove_tag_node(self, tag_id):
        for tag_node in self.tags_tree:
            if tag_node.tag_id == tag_id:
                self.tags_tree.remove(tag_node)

    def make_model(self):
        return {'projId': self.project_id,
                'tags': [item.make_model() if isinstance(item, TagTreeNode) else item for item in self.tags_tree]}

    def get_project_tags(self):
        pt = self.db.find_one({'projId': self.project_id})
        return pt.get('tags') if pt else []

    def save(self):
        return self.db.find_one_and_update({'projId': self.project_id}, {'$set': self.make_model()}, upsert=True,
                                           return_document=ReturnDocument.AFTER)

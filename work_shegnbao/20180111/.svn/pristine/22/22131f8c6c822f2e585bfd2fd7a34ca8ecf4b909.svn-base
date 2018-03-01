from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_common.Utils import Utils


class Tag:
    def __init__(self):
        self.cloud_point_collection = MongoConnManager.getConfigConn().mdbBb[
            'cloudPoint']
        self.data_source_collection = MongoConnManager.getConfigConn().mdbBb[
            'DataSourceAdditional']

    def set_tag(self, projId, idList, tagList, inheritable=True):
        if inheritable:
            self._set_tag_with_inherit(projId, idList, tagList)
        else:
            self._set_tag_without_inherit(projId, idList, tagList)

    def _set_tag_without_inherit(self, projId, idList, tagList):
        id_list = [
            Utils.object_id_wrapper(a_id) for a_id in idList
        ]
        self.cloud_point_collection.update_many({
            '_id': {
                '$in': id_list
            }
        }, {
            '$addToSet': {
                'tag': {'$each': tagList}
            }
        })

    def _set_tag_with_inherit(self, projId, parentIdList, tagList):
        parent_id_list = [
            Utils.object_id_wrapper(parent_id) for parent_id in parentIdList
        ]
        mongo_id_rv = list(self.cloud_point_collection.aggregate([{
            '$match': {
                'projId': projId,
                '_id': {
                    '$in': parent_id_list
                }
            }
        }, {
            '$graphLookup': {
                'from': 'cloudPoint',
                'startWith': '$_id',
                'connectFromField': '_id',
                'connectToField': 'prt',
                'as': 'children'
            }
        }, {
            '$project': {
                'children._id': 1,
                '_id': 0
            }
        }]))
        if mongo_id_rv:
            id_list = parent_id_list + [
                child['_id'] for child in mongo_id_rv[0].get('children')
            ]
            self.cloud_point_collection.update_many({
                '_id': {
                    '$in': id_list
                }
            }, {
                '$addToSet': {
                    'tag': {'$each': tagList}
                }
            })

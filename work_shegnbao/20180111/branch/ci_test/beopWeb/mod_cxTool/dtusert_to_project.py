'''
DTU-项目映射关系
'''
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class DtusertToProject(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'dtusert_to_project'
    fields = ('dtuprojectid', 'projectid')

    def get_all(self):
        '''
        获取所有的DTU-项目映射关系
        :return: 映射关系列表
        '''
        return self.query(self.fields)

    def get_map(self):
        '''
        获取所有的DTU-项目映射关系字典, key为dtuprojectid
        :return: DTU-项目映射关系字典
        '''
        all_result = self.query_one(self.fields)
        return {item.get('dtuprojectid'): item for item in all_result}

    def get_by_dtu(self, dtu):
        '''
        根据dtu id 获取DTU-项目映射关系
        :param dtu: dtu ID
        :return: DTU-项目映射关系
        '''
        return self.query_one(self.fields, where=('dtuprojectid=%s', (dtu,)))

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class DtuServerProject(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'dtuserver_prj'
    fields = ('id', 'dtuname', 'dbip', 'dbuser', 'dbname', 'dbpsw', 'dtuRemark', 'bSendData', 'nSendType',
              'nSendDataInterval', 'bSendEmail', 'nLastSendHour', 'nReSendType', 'synRealTable', 'bDTUProject')

    def __init__(self, dtu_id=None):
        super().__init__()
        self.id = dtu_id

    def get_dtu_server_by_project_id(self, project_id):
        '''
        获取项目的DTU server信息
        :param project_id: 项目ID
        :return: DTU server信息
        '''
        dtu = self.get_cache(project_id)
        if not dtu:
            dtu = self.query_one(self.fields,
                                 where=('id=(select dtuprojectid from dtusert_to_project where projectid=%s)',
                                        (project_id,)))
            self.set_cache(project_id, dtu)
        return dtu

    def get_by_dtu_name(self, dtu_name):
        '''
        通过dtu名获取DTU server信息
        :param dtu_name: dtu名称
        :return: DTU server信息
        '''
        return self.query_one(self.fields, where=('dtuname=%s', (dtu_name,)))

    def get_by_db_name(self, dbname):
        '''
        通过实时数数据的数据库名称来获取DTU server信息
        :param dbname: 实时数据数据库名
        :return: DTU server信息
        '''
        return self.query_one(self.fields, where=('dbname=%s', (dbname,)))

    def set_dtu_remark(self, remark):
        '''
        设置dtu注释
        :param remark: 注释
        :return: True 设置成功; False 设置失败
        '''
        if not self.id:
            raise Exception('dtu id 不能为空')
        return self.update({'dtuRemark': remark}, where=('id = %s', (self.id,)))

from datetime import datetime
from beopWeb.mod_modbus.getpinyin import getPinyin
from beopWeb.mod_admin.Project import Project
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_modbus.modbusPointTable import modbuspointtable
from beopWeb import app

class cdtuname(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'dtuserver_prj'
    fields = ('id', 'dtuname', 'dbip', 'dbuser', 'dbname', 'dbpsw', 'dtuRemark', 'bSendData', 'nSendType',
              'nSendDataInterval', 'bSendEmail', 'nLastSendHour', 'nReSendType', 'synRealTable', 'bDTUProject')

    def getDtuName(self,projID):
        projectdb = Project()
        dbdatadict = projectdb.get_project_by_id(int(projID))  #获取项目中文名，数据库名
        if dbdatadict['name_cn']:
            pro_name = self.getDtuNameKeyWord(dbdatadict.get('name_cn'))
            dtuname = pro_name + datetime.strftime(datetime.now(), "%Y%m%d%H%M%S")[2:-6]
            if len(dtuname) == 10:
                rdtuname = self.getNewCreateDtuNameByAbbrName(dtuname)
                if rdtuname:
                    dtuname = ("%s%02d") % (rdtuname[:-2],int(rdtuname[-2:]) + 1)  #如果存在，则编号+1，生成新dtuname。
                else:
                    dtuname += "01"
            else:
                return None
        else:
            return None
        return dtuname

    #通过项目名的中文缩写获取最新创建的dtuname，
    def getNewCreateDtuNameByAbbrName(self,dtu_name):
        dtu_name = '%' + dtu_name + '%'
        strQuery = "select dtuname from dtuserver_prj where dtuname like '%s' order by dtuname desc limit 0,1;" % (dtu_name)
        rv = self.db_helper.db.op_db_query_one(self.db_name, strQuery)
        if rv:
            return rv[0] if rv[0] else None         #如果存在返回
        return None

    #插入新建dtu的数据
    def insertNewCreateDtuData(self,dtuname,projID,prefix):
        if prefix:
            exist = self.query_one(self.fields ,where=('dbuser = %s ',(prefix,)))
            if exist:
                return -1
        data = {}
        projectdb = Project()
        dbdatadict = projectdb.get_project_by_id(int(projID), ('mysqlname'))  # 获取项目中文名，数据库名
        data["dtuname"] = dtuname
        data["dbuser"] = prefix if prefix else dtuname
        data["dbname"] =  dbdatadict["mysqlname"]
        data["synRealTable"] = "rtdata_beopdata_" + dtuname
        data["serverCode"] = 3
        data["dtuRemark"] =  "Auto Create"
        self.insert(data)
        rv = self.query_one(self.fields,where=('dtuname = %s' , (dtuname,)))
        return rv.get('id')

    #删除dtuId
    def deleteDtuByDtuId(self,dtuId):
        dtuId = dtuId if(isinstance(dtuId,str)) else str(dtuId)
        where = ('id = %s', (dtuId,))
        return  self.delete(where)

    #通过dtuID获取获取前缀
    def getDtuPrefixByDtuId(self,dtuId):
        dtuId = dtuId if isinstance(dtuId,str) else str(dtuId)
        rv = self.query_one(self.fields,where=('id =%s', (dtuId,)))
        prefix = rv.get('dbuser')
        return prefix

    #更新dtu数据
    def updataDtuData(self,data,dtuId):
        where = ('id = %s', (dtuId,))
        return self.update(data,where)

    #获取项目标识，和dtu列表
    def getDbNmaeAndDtunameListByProId(self,projId):
        name = ''
        rd = {}
        dtuList = []
        try:
            mgdb = modbuspointtable(projId)
            strQuery = "SELECT d.id,d.dtuname,d.dbname,d.dbuser FROM  project p,dtuserver_prj d where p.mysqlname = d.dbname and p.id = %d;" % (int(projId))
            rv = self.db_helper.db.op_db_query(self.db_name, strQuery)
            if rv:
                for item in rv:
                    if len(item) >= 4:
                        dtudata = {}
                        dtu_id = item[0]  # dtuid
                        dtudata['name'] = item[1]  # dtu名
                        dtudata['id'] = dtu_id
                        dtudata['prefix'] = item[3]  #
                        dtudata['flag'] = mgdb.checkEmptyDtuByDtuId(dtu_id)
                        dtuList.append(dtudata)
                name = rv[0][2]
            else:
                strQuery = "SELECT p.mysqlname FROM  project p where  p.id = %d;" % (int(projId))
                rv = self.db_helper.db.op_db_query_one(self.db_name, strQuery)
                name = rv[0][0]
            rd['name'] = name
            rd['id'] = projId
            rd['dtulist'] = dtuList
            return rd if rd else None  # 如果存在返回
        except Exception as e:
            return {}

    #生成dtu，关键字段
    def getDtuNameKeyWord(self,strName):
        namelist = list(strName)
        other = ''
        dtuanme = ''
        for item in namelist:
            if item >= '\u4e00' and item <= '\u9fa5': #获取中文首字母
                dtuanme += getPinyin(item)
            elif ord(item) >= 65 and ord(item) <= 90: #获取命名驼峰格式的首字母
                dtuanme += chr(ord(item) + 32)
            else:
                other += item
        if dtuanme:
            if len(dtuanme) >= 4:
                dtuanme = dtuanme[:4]
        else:
            if len(other) >= 4:
                dtuanme = other[:4]
            else:
                dtuanme = other
        return dtuanme






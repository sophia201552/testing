__author__ = 'woody'

import requests
from Methods.BeopTools import *
import unittest
from setting import serverip
from datetime import datetime
import json
import pymysql
import time

host = "rds8961fe732pz9uw7jso.mysql.rds.aliyuncs.com"
port = 3306
user = "beopweb"
passwd = "rnbtechrd"
db = "beopdoengine"
proj = {25:'上海华为特灵系统',28:'上海华为华源系统',30:'上海华为霍尼网络1',34:'上海华为霍尼网络2',57:'上海华为霍尼网络4',
       58:'上海华为霍尼网络5',59:'上海华为霍尼网络6',60:'上海华为霍尼网络7',61:'上海华为霍尼网络9',62:'上海华为霍尼网络8',
       63:'上海华为霍尼网络10',64:'上海华为霍尼网络3',
       54:'深圳星河',17:'深圳华为',48:'深圳华为G区',65:'世纪商贸',47:'静安嘉里',16:'香港华润',67:'常州顺丰',
       52:'玉兰大剧院',72:'扬州高露洁',73:'江阴常电',44:'安亭上汽',49:'成都时代1号',51:'成都时代8号',
       70:'杭州妇产科医院',71:'杭州妇产科医院冷机房',97:'嘉民',105:'天弘(苏州)科技有限公司',99:'常州职业建设学院',
       103:'上海印钞厂',96:'国家会展中心',108:'天津武清商业区国际企业区'
        }





class CaseP039(unittest.TestCase):
    testCaseID = 'CaseP039'
    projectName = "all"
    buzName = 'getProjectInfo'
    start = 0.0
    errors = []


    def setUp(self):
        self.start = datetime.now()
        

    def Test(self):
        #errors = []
        offProj = []
        #连接国服数据库
        try:
            conn = pymysql.connect(host=host,port=port,user=user,passwd=passwd,db=db,charset='utf8')
        except Exception:
            assert 0,"连接国服阿里云实时数据库失败!"
        #建立游标
        cur = conn.cursor()
        sqlStr = "select id,online from dtuserver_prj_info"
        cur.execute(sqlStr)
        state = cur.fetchall()
        for i in state:
            if i[1] != "Online":
                if i[0] in proj:
                    offProj.append(i[0])
                    print(proj[int(i[0])]+"项目不在线!")
        offline = '(' + ",".join(str(i) for i in offProj) + ')'
        cur.execute("select id,LastOnlineTime from dtuserver_prj_info where id IN %s" % offline)
        lastTime = cur.fetchall()
        for i in lastTime:
            t = time.strptime(i[1],'%Y-%m-%d %H:%M:%S')
            his_time = time.mktime(t)
            cur_time = time.time()
            offTime = ( cur_time - his_time ) / 60
            if offTime >= 30.0:
                error = "DTU掉线项目: " + proj[int(i[0])] + ' ' + "最后在线时间: " + i[1] + ' ' + "掉线时间: " + '%.2f分钟 ' % offTime
                self.errors.append(error)
                errors = '\n'.join(self.errors)
                #errors = self.errors
                print(errors)
        if errors is not None:
            self.errors = []
            #assert 0,errors
            

        conn.close()
        




        


    def tearDown(self):
        use1 = str((datetime.now() - self.start).seconds)
        use = use1 + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        errors = []


if __name__ == "__main__":
    a = CaseP039()
    a.Test()

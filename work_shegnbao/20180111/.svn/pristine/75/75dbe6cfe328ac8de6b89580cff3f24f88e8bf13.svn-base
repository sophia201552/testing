from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import *
from datetime import timedelta, datetime
from datetime import date
from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
import logging
from beopWeb.BEOPDataAccess import BEOPDataAccess
import mysql.connector
import xlrd
import xlwt
Point = dict(
    T = 'temp',
    H = 'humidity',
    S = 'online',
    A = 'alarm',
    LAT = 'LAT',
    LNG = 'LNG',
    SP = 'speed',
    ST = 'status',
    MIL = 'mileage',
    AREA = 'area',
    DIR = 'dir',
)




class BEOPGmryDataAccess(BEOPMySqlDBContainer):
    host = '118.178.93.236'
    port = 3306
    user = 'root'
    pwd = 'RNBtech1103'
    pool_name = 'beop_gmry'
    pool_size = 2

    @classmethod
    def get_db(cls, dbname):
        db = None


        try:
            db = mysql.connector.connect(
                user=cls.user,
                password=cls.pwd,
                host=cls.host,
                port=cls.port,
                pool_name=cls.pool_name,
                pool_size=cls.pool_size,
                )
        except mysql.connector.Error as e:
            print(e)
            logging.error(e)
            if db is not None:
                db.close()
            return None

        try:
            setResult = db.set_database(dbname)
            return db
        except mysql.connector.Error as e:
            logging.error(e)
            if db is not None:
                db.set_database(app.config['DATABASE'])
                db.close()
            return None

    @classmethod
    def op_db_query(cls, dbName, strQuery, parameter=(), one=False):
        #print(dbName + ' :  ' + strQuery)
        #print(parameter)
        db = None
        cur = None
        rv = []
        try:
            db = cls.get_db(dbName)
            if db is None:
                print('beoplog: op_db_query self._db is None: %s, %s', dbName, strQuery)
                logging.error('beoplog: op_db_query self._db is None: %s, %s', dbName, strQuery)
                return rv

            cur = db.cursor()
            if len(parameter) > 0:
                cur.execute(strQuery, parameter)
            else:
                cur.execute(strQuery)
            rv = cur.fetchall()
            db.commit()
        except mysql.connector.Error as e:
            strError = 'mysql error occured when query: %s.' % strQuery
            print(strError)
            logging.error(strError)
            print(e)
            logging.error(e)
        except Exception as e:
            print(e)
            logging.error(e)
        finally:
            cls.release_db(db, cur)
            return (rv[0] if rv else []) if one else rv

    @classmethod
    def op_db_update(cls, dbName, strQuery, parameter=()):
        #print(dbName + ' :  ' + strQuery)
        #print(parameter)
        db = None
        cur = None
        rv = False
        try:
            db = cls.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                print(strError)
                logging.error(strError)
            else:
                cur = db.cursor()
                if len(parameter) > 0:
                    cur.execute(strQuery, parameter)
                else:
                    cur.execute(strQuery)
                db.commit()
                rv = True
        except mysql.connector.Error as e:
            strError = 'mysql error occured when execute: %s.' % strQuery
            print(strError)
            logging.error(strError)
            print(e)
            logging.error(e)
        finally:
            cls.release_db(db, cur)
            return rv




    @classmethod
    def release_db(cls, db, cur):
        if cur is not None:
            cur.close()
        if db is not None:
            db.close()

class Logistics(object):
    dbName = 'bdtm2'
    virtualPoint = 'GmryUserRights'
    userPoint = 'AdminUser'
    projId = 425


    @classmethod
    def getFixedListByParent(cls, parentList):
        params = [str(x) for x in parentList]
        strQuery = 'select * from t_beop_point where isfixed=1 and parentid in (' + ','.join(params) + ')'
        return BEOPGmryDataAccess.op_db_query(cls.dbName, strQuery)


    @classmethod
    def getVehicleListByParent(cls, parentList):
        params = [str(x).strip() for x in parentList]
        strQuery = 'select * from t_beop_point where isfixed=0 and parentid in (' + ','.join(params) + ')'
        return BEOPGmryDataAccess.op_db_query(cls.dbName, strQuery)


    @classmethod
    def getFixedPoints(cls,pointId=''):
        strQuery = "select id, identifying, temperature, humidity, alarmtype, state, gpstime, updateTime, doorstatus, " \
                   "comstatus, workhours from t_data_realtime_fixed"
        #strQuery = 'select * from t_data_realtime_fixed ORDER BY identifying'
        if len(pointId) > 0:
            strQuery = "select id, identifying, temperature, humidity, alarmtype, state, gpstime, updateTime, doorstatus, " \
                       "comstatus, workhours from t_data_realtime_fixed where id="+pointId+" ORDER BY identifying"
        return BEOPGmryDataAccess.op_db_query(cls.dbName, strQuery)


    @classmethod
    def getVehiclePoints(cls,pointId=''):
        strQuery = "select id, identifying, temperature, lat, lng, speed, status, mileage, area, gpstime, " \
                   "syndate, direction from t_data_realtime_veh ORDER BY identifying"
        #strQuery = "select * from t_data_realtime_veh ORDER BY identifying"
        if len(pointId) > 0:
            strQuery = "select id, identifying, temperature, lat, lng, speed, status, mileage, area, gpstime, " \
                       "syndate, direction  from t_data_realtime_veh where id="+pointId+" ORDER BY identifying"
        return BEOPGmryDataAccess.op_db_query(cls.dbName, strQuery)


    @classmethod
    def getRealTime(cls, pointList):
        return BEOPDataAccess().get_realtime_data(cls.projId, pointList)


    @classmethod
    def user_sublist(cls, userId):
        try:
            vir = BEOPDataAccess().get_realtime_data(cls.projId, [cls.userPoint])
            rv = json.loads(vir[0]['value'])
            for user in rv[0]['childlist']:
                if int(userId) == int(user.get('userid')):
                    return True
        except Exception as e:
            logging.error("user_sublist error: " % e.__str__())
        return False


    @classmethod
    def getParentListByVirtualPoints(cls, userId):
        rt_fixed, rt_veh = {}, {}
        try:
            vir = BEOPDataAccess().get_realtime_data(cls.projId, [cls.virtualPoint])
            rv = json.loads(vir[0]['value'])
            for item in rv:
                if str(item.get('userid')) == str(userId):
                    tp = item.get('type')
                    group = item[tp]['group']
                    groups_fixed = [g.get('id') if not g.get('sharedid') else g.get('sharedid') for g in group]
                    groups_veh = [g.get('id') for g in group]
                    rt_veh.update(
                        {
                            'name': item[tp]['name'],
                            'groups': groups_veh,
                            'userId': userId
                        }
                    )
                    rt_fixed.update(
                        {
                            'name': item[tp]['name'],
                            'groups': groups_fixed,
                            'userId': userId
                        }
                    )
                    break
        except Exception as e:
            logging.error("getParentListByVirtualPoints error: " % e.__str__())
        return rt_fixed, rt_veh


    @classmethod
    def getFixedPointsInfo(cls, parentList):
        params = [str(x).strip() for x in parentList]
        strQuery = 'select id, identifying, toplimit, downlimit, parentid, syndate, begtime, endtime from t_info_fixedpoint where parentid in (' + ','.join(params) + ')' + "ORDER BY identifying"
        return BEOPGmryDataAccess.op_db_query(cls.dbName, strQuery)


    @classmethod
    def getVehiclePointsInfo(cls, parentList):
        params = [str(x).strip() for x in parentList]
        strQuery = 'select id, identifying, parentid, syndate, toplimit, downlimit, begtime, endtime from t_info_vehiclepoint where parentid in (' + ','.join(params) + ')' + "ORDER BY identifying"
        return BEOPGmryDataAccess.op_db_query(cls.dbName, strQuery)


    @classmethod
    def updateVehInfo(cls, _id, lowerTemp, upperTemp, endTime, startTime):
        table = 't_info_vehiclepoint'
        return cls.updatePointsInfo(_id, lowerTemp, upperTemp, endTime, startTime, table)


    @classmethod
    def updateFixedInfo(cls, _id, lowerTemp, upperTemp, endTime, startTime):
        table = 't_info_fixedpoint'
        return cls.updatePointsInfo(_id, lowerTemp, upperTemp, endTime, startTime, table)



    @classmethod
    def updatePointsInfo(cls,  _id, lowerTemp, upperTemp, endTime, startTime, table):
        strQuery = 'update %s set toplimit=%s,downlimit=%s,begtime="%s",endtime="%s" where id=%s' % (table, upperTemp, lowerTemp, startTime, endTime, _id)
        return BEOPGmryDataAccess.op_db_update(cls.dbName, strQuery)


    @classmethod
    def getHisData(cls,projId,pointlist,startTime,endTime,pointtype):
        rv = BEOPDataAccess.getInstance().get_history_data_padded(projId, pointlist, startTime, endTime, 'm1')

    @classmethod
    def getHisRate(cls, projId, fixedPointsList, vehiclePointsList, startTime, endTime):
        stTime = datetime.strptime(startTime, "%Y-%m-%d %H:%M:%S").replace(hour=0, minute=0, second=0)
        etTime = datetime.strptime(endTime, "%Y-%m-%d %H:%M:%S").replace(hour=0, minute=0, second=0)
        delay = (etTime - stTime).days
        timeList = []
        for i in range(int(delay)+1):
            timeList.append(str(stTime+timedelta(days=i)))
        # 获取移动/固定点的历史数据
        fix_new, veh_new = [], []
        try:
            rv_fixed_temp, rv_vech_temp = [], []
            rv_fixed, rv_vech = [], []
            fix_new, veh_new = [], []
            if fixedPointsList:
                rv_fixed_temp = BEOPDataAccess.getInstance().get_history_data_padded(projId, fixedPointsList, str(stTime), str(etTime), 'd1')
            if vehiclePointsList:
                rv_vech_temp = BEOPDataAccess.getInstance().get_history_data_padded(projId, vehiclePointsList, str(stTime), str(etTime), 'd1')

            # 筛选时间范围内0点的固定点数据
            if isinstance(rv_fixed_temp, list):
                for item in rv_fixed_temp:
                    name = item.get('name')
                    history = item.get('history')
                    for l in history:
                        if l.get('time') in timeList:
                            rv_fixed.append([name, l.get('value') if l.get('value') else {}])

                # 取出固定点合格率数据
                rv_fixdata = []
                for fix in rv_fixed:
                    num = fix[1].get('id')
                    area = fix[1].get('area')
                    caltime = fix[1].get('caltime')
                    groups = fix[1].get('groups')
                    identifying = fix[1].get('identifying')
                    quacount = fix[1].get('quacount')
                    quarate = "%.2f" % (float(fix[1].get('quarate')) * 100) + '%' if fix[1].get('quarate') else None
                    totalcount = fix[1].get('totalcount')
                    if num:
                        rv_fixdata.append([num, area, groups, identifying, totalcount, quacount, quarate, caltime])

                # 去掉重复数据
                for fx in rv_fixdata:
                    if fx not in fix_new:
                        fix_new.append(fx)
                fix_new = sorted(fix_new)

            if isinstance(rv_vech_temp, list):
            # 筛选时间范围内0点的移动点数据
                for item in rv_vech_temp:
                    name = item.get('name')
                    history = item.get('history')
                    for l in history:
                        if l.get('time') in timeList:
                            rv_vech.append([name, l.get('value') if l.get('value') else {}])

                # 取出移动点合格率数据
                rv_vehdata = []
                for fix in rv_vech:
                    num = fix[1].get('id')
                    area = fix[1].get('area')
                    caltime = fix[1].get('caltime')
                    groups = fix[1].get('groups')
                    identifying = fix[1].get('identifying')
                    quacount = fix[1].get('quacount')
                    quarate = "%.2f" % (float(fix[1].get('quarate')) * 100) + '%' if fix[1].get('quarate') else None
                    totalcount = fix[1].get('totalcount')
                    if num:
                        rv_vehdata.append([num, area, groups, identifying, totalcount, quacount, quarate, caltime])
                for ve in rv_vehdata:
                    if ve not in veh_new:
                        veh_new.append(ve)
                veh_new = sorted(veh_new)
        except Exception as e:
            print('getHisRate error: %s' % e.__str__())
            logging.error('getHisRate error: %s' % e.__str__())

        # 写入固定点dict
        warehouse = {
            "head": ['序号', '设备区域', '块信息', '设备标识', '采集总次数', '温度合格次数', '工作合格率', '采集时间'],
            "data": fix_new
        }
        # 写入移动点表
        transporter = {
            "head": ['序号', '设备区域', '块信息', '设备标识', '采集总次数', '温度合格次数', '工作合格率', '采集时间'],
            "data": veh_new
        }

        return warehouse, transporter

class ExcleFileEx:
    @classmethod
    def set_style(cls,name,height,bold=False,isCenter=False):  
        style = xlwt.XFStyle() # 初始化样式  
        font = xlwt.Font() # 为样式创建字体  
        font.name = name # 'Times New Roman'  
        font.bold = bold  
        font.color_index = 4  
        font.height = height  
        # borders= xlwt.Borders()  
        # borders.left= 6  
        # borders.right= 6  
        # borders.top= 6  
        # borders.bottom= 6  
        style.font = font
        if isCenter:
            alignment = xlwt.Alignment() # Create Alignment
            alignment.horz = xlwt.Alignment.HORZ_CENTER # May be: HORZ_GENERAL, HORZ_LEFT, HORZ_CENTER, HORZ_RIGHT, HORZ_FILLED, HORZ_JUSTIFIED, HORZ_CENTER_ACROSS_SEL, HORZ_DISTRIBUTED
            alignment.vert = xlwt.Alignment.VERT_CENTER # May be: VERT_TOP, VERT_CENTER, VERT_BOTTOM, VERT_JUSTIFIED, VERT_DISTRIBUTED
            style.alignment = alignment # Add Alignment to Style
        # style.borders = borders  
        return style 
    
    @classmethod
    def write_excel(cls,rowNameList,valueList,filepath):  
        f = xlwt.Workbook(encoding='utf-8') #创建工作簿    
        ''''' 
                    创建第一个sheet: 
        '''  
        sheet1 = f.add_sheet(u'合格率汇总',cell_overwrite_ok=True) #创建sheet  
        row0 = rowNameList
        #生成第一行  
        for i in range(0,len(row0)):  
            sheet1.write(0,i,row0[i],cls.set_style('Times New Roman',220,True))  
        
        for j in range(0,len(valueList)):
            item = valueList[j]
            for i in range(0,len(item)):
                sheet1.write(j+1,i,item[i])  
        f.save(filepath) #保存文件   
        return f
        
        
    @classmethod
    def write_excel_new(cls,rowNameList,valueList,filepath):  
        f = xlwt.Workbook(encoding='utf-8') #创建工作簿    
        ''''' 
                    创建第一个sheet: 
        '''  
        sheet1 = f.add_sheet(u'sheet1',cell_overwrite_ok=True) #创建sheet  
        row0 = rowNameList
        #生成第一行  
        for i in range(0,len(row0)):  
            sheet1.write(0,i,row0[i],cls.set_style('Times New Roman',220,True))  
        
        for j in range(0,len(valueList)):
            item = valueList[j]
            for i in range(0,len(item)):
                sheet1.write(j+1,i,item[i])  
        f.save(filepath) #保存文件   
        return f
        
        
    @classmethod
    def write_excel_detail(cls,projId,rowNameList,valueList,fileName,type,startTime,endTime):  
        f = xlwt.Workbook() #创建工作簿    
        ''''' 
                    创建第一个sheet: 
        '''  
        sheet1 = f.add_sheet(u'合格率汇总',cell_overwrite_ok=True) #创建sheet  
        row0 = rowNameList
        #生成第一行  
        for i in range(0,len(row0)):  
            sheet1.write(0,i,row0[i],cls.set_style('Times New Roman',220,True))  
        
        for j in range(0,len(valueList)):
            item = valueList[j]
            canwrite = 1
            if j > 0:
                item_temp = valueList[j-1]
                if str(item[3]) == str(item_temp[3]):
                    canwrite = 0
            if canwrite == 1:
                for i in range(0,len(item)):
                    sheet1.write(j+1,i,item[i])   
                id = str(item[0])    
                if type == 0:
                    point_list = [id+"_T",id+"_H",id+"_S",id+"_A"]
                    sheet = f.add_sheet(str(item[3]),cell_overwrite_ok=True)
                    sheet.write(0,0,u'温度',cls.set_style('Times New Roman',220,True))  
                    sheet.write(0,1,u'湿度',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,2,u'报警状态',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,3,u'联机状态',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,4,u'采集时间',cls.set_style('Times New Roman',220,True))
                    rv_fixed = BEOPDataAccess.getInstance().get_history_data_padded(projId, point_list, startTime, endTime, 'm5')
                    if isinstance(rv_fixed,list):
                        for itemdata in rv_fixed:
                            if itemdata.get('history') is not None:
                                name = str(itemdata.get('name'))
                                data = itemdata.get('history')
                                if '_T' in name:
                                    for con in range(0,len(data)):
                                        sheet.write(con+1,0,str(data[con].get('value')))
                                        sheet.write(con+1,4,str(data[con].get('time')))
                                elif '_H' in name:
                                    for con in range(0,len(data)):
                                        sheet.write(con+1,1,str(data[con].get('value')))
                                elif '_A' in name:
                                    for con in range(0,len(data)):
                                        #sheet.write(con+1,2,str(data[con].get('value')))
                                        if str(data[con].get('value')) == '0.0':
                                            sheet.write(con+1,2,u'无报警')
                                        if str(data[con].get('value')) == '1.0':
                                            sheet.write(con+1,2,u'硬件报警')
                                        if str(data[con].get('value')) == '2.0':
                                            sheet.write(con+1,2,u'上限报警')
                                elif '_S' in name:
                                    for con in range(0,len(data)):
                                        sheet.write(con+1,3,str(data[con].get('value')))
                elif type == 1:
                    point_list = [id+"_T",id+"_LAT",id+"_LNG",id+"_SP",id+"_ST",id+"_MIL",id+"_AREA",id+"_DIR"]
                    sheet = f.add_sheet(str(item[3]),cell_overwrite_ok=True)
                    sheet.write(0,0,u'温度',cls.set_style('Times New Roman',220,True))  
                    sheet.write(0,1,u'纬度',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,2,u'经度',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,3,u'速度',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,4,u'行驶状态',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,5,u'里程',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,6,u'所在位置',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,7,u'车头方向',cls.set_style('Times New Roman',220,True))
                    sheet.write(0,8,u'采集时间',cls.set_style('Times New Roman',220,True))
                    rv_veh = BEOPDataAccess.getInstance().get_history_data_padded(projId, point_list, startTime, endTime, 'm5')
                    for itemdata in rv_veh:
                        if itemdata.get('history') is not None:
                            name = str(itemdata.get('name'))
                            data = itemdata.get('history')
                            if '_T' in name:
                                for con in range(0,len(data)):
                                    sheet.write(con+1,0,str(data[con].get('value')))
                                    sheet.write(con+1,8,str(data[con].get('time')))
                            elif '_LAT' in name:
                                for con in range(0,len(data)):
                                    sheet.write(con+1,1,str(data[con].get('value')))
                            elif '_LNG' in name:
                                for con in range(0,len(data)):
                                    sheet.write(con+1,2,str(data[con].get('value')))
                            elif '_SP' in name:
                                for con in range(0,len(data)):
                                    sheet.write(con+1,3,str(data[con].get('value')))
                            elif '_ST' in name:
                                for con in range(0,len(data)):
                                    sheet.write(con+1,4,str(data[con].get('value')))
                            elif '_MIL' in name:
                                for con in range(0,len(data)):
                                    sheet.write(con+1,5,str(data[con].get('value')))
                            elif '_AREA' in name:
                                for con in range(0,len(data)):
                                    sheet.write(con+1,6,str(data[con].get('value')))    
                            elif '_DIR' in name:
                                for con in range(0,len(data)):
                                    sheet.write(con+1,7,str(data[con].get('value')))                                                                                                                
        f.save(fileName) #保存文件 


    @classmethod
    def write_excel_strategyValue(cls,rowNameList,valueList,filepath):  
        f = xlwt.Workbook(encoding='utf-8') #创建工作簿    
        ''''' 
                    创建第一个sheet: 
        '''  
        sheet1 = f.add_sheet(u'sheet1',cell_overwrite_ok=True) #创建sheet  
        row0 = rowNameList
        column0 = []
        column0Num = 1
        column1 = {}
        valueMap = {}
        for j in range(0, len(valueList)):
            item = valueList[j]
            
            if item[0] in column0:
                if item[0] == column0[0]:
                    column0Num += 1
            else :
                column0.append(item[0])

            if item[1] in column1:
                column1.update({item[1] : column1.get(item[1]) + 1})
            else :
                column1.update({item[1] : 1})

            mapName = item[0]+'_'+item[1]
            if mapName in valueMap:
                valueMap.get(mapName).append({'name':item[2],'value':item[3]})
            else :
                valueMap.update({mapName:[{'name':item[2],'value':item[3]}]})
            
        for k in column1:
            column1.update({k : int(column1.get(k)/len(column0))})

        #生成第一行  
        for i in range(0,len(row0)):  
            sheet1.write(0,i,row0[i],cls.set_style('Times New Roman',220,True))

        #生成第一列
        a, j = 0, 0
        while a < column0Num * len(column0) and j < len(column0):
            i = a+1
            sheet1.write_merge(i,i+column0Num-1,0,0,column0[j],cls.set_style('Times New Roman',220,False,True))
            #生成第二列
            o = 0
            for key in column1:
                sheet1.write_merge(o+i,o+i+column1.get(key)-1,1,1,key,cls.set_style('Times New Roman',220,False,True))
                #生成第三列第四列
                rows = valueMap.get(column0[j]+'_'+key)
                p = 0
                for row in rows:
                    sheet1.write(o+i+p,2,row.get('name'))
                    sheet1.write(o+i+p,3,row.get('value'))
                    p += 1
                o += column1.get(key)
            a += column0Num
            j += 1
        
        f.save(filepath) #保存文件   
        return f
"""
Routes and views for the flask application.
"""


from beopWeb import app
from flask import g, json
from math import floor, ceil
import os, sys
import mysql.connector
from math import floor, ceil
from datetime import datetime,timedelta
import time
import logging
import sqlite3
from os import environ, listdir, path, unlink, remove, makedirs, stat
import traceback

class BEOPSqliteAccess:

    __instance = None

    _heat_map_type = {
        '0': 'temperature',
        '1': 'CO',
        '2': 'custom'
    }

    def __init__(self):
        pass

    @classmethod
    def getInstance(self):
        if(self.__instance == None):
            self.__instance = BEOPSqliteAccess()
        return self.__instance

    @classmethod
    def get_db(self, dbname):
        db = None
        return db

    def release_db(self, db, cur):
        if cur is not None:
            cur.close()
        if db is not None:
            db.close()

    def getPointListFromS3db(self, s3dbname):
        rt = []
        if s3dbname != None:
            cur = None
            con = None
            try:
                dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbname)
                dbfileDec = '{}.dec'.format(dbfile)

                if not os.path.exists(dbfileDec):
                    print(dbfileDec + ' file not existing!')
                    return None
                con = sqlite3.connect(dbfileDec)
                con.text_factory = bytes
                cur = con.cursor()
                cur.execute('select name, ch_description from list_point')
                data = cur.fetchall()
                rt = [{'name': x[0].decode('gbk'), 'description': x[1].decode('gbk')} for x in data]
            except Exception as e:
                print(e.__str__())
            finally:
                if cur is not None:
                    cur.close()
                if con is not None:
                    con.close()
        return rt

    def getPointListFromS3dbEx(self, s3dbname, offset, num):
        rt = []
        ptList = []
        if s3dbname != None:
            cur = None
            con = None
            try:
                dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbname)
                dbfileDec = '{}.dec'.format(dbfile)

                if not os.path.exists(dbfileDec):
                    print(dbfileDec + ' file not existing!')
                    return None
                con = sqlite3.connect(dbfileDec)
                con.text_factory = bytes
                cur = con.cursor()
                if num == -1:
                    sql = 'select name, ch_description, Param15, Param16, Param17, Param18 from list_point;'
                else:
                    sql = 'select name, ch_description, Param15, Param16, Param17, Param18 from list_point limit %d, %d;' % (offset, num)
                cur.execute(sql)
                data = cur.fetchall()
                flag = '\'" "\''
                for item in data:
                    custom = item[2].decode('gbk')
                    if flag == custom:
                        custom = ''
                    system = item[3].decode('gbk')
                    if flag == system or '' == system:
                        system = '0'
                    device = item[4].decode('gbk')
                    if flag == device or '' == device:
                        device = '0'
                    type = item[5].decode('gbk')
                    if flag == type or '' == type:
                        type = '0'
                    rt.append({'name':item[0].decode('gbk'), 'description':item[1].decode('gbk'), 'custom':custom, 'system':int(system), 'device':int(device), 'type':int(type)})
                    ptList.append(item[0].decode('gbk'))
            except Exception as e:
                print(e.__str__())
            finally:
                if cur is not None:
                    cur.close()
                if con is not None:
                    con.close()
        return rt,ptList

    def getCustomNameInPtListFromS3dbEx(self, s3dbname):
        rt = []
        if s3dbname != None:
            cur = None
            con = None
            try:
                dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbname)
                dbfileDec = '{}.dec'.format(dbfile)

                if not os.path.exists(dbfileDec):
                    print(dbfileDec + ' file not existing!')
                    return None
                con = sqlite3.connect(dbfileDec)
                con.text_factory = bytes
                cur = con.cursor()
                cur.execute('select distinct Param15 from list_point')
                data = cur.fetchall()
                flag = '\'" "\''
                for item in data:
                    custom = item[0].decode('gbk')
                    if flag == custom:
                        custom = ''
                    rt.append(custom)
            except Exception as e:
                print(e.__str__())
            finally:
                if cur is not None:
                    cur.close()
                if con is not None:
                    con.close()
        return rt

    def getLengthInPtListFromS3dbEx(self, s3dbname):
        rtLen = 0
        if s3dbname != None:
            cur = None
            con = None
            try:
                dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbname)
                dbfileDec = '{}.dec'.format(dbfile)

                if not os.path.exists(dbfileDec):
                    print(dbfileDec + ' file not existing!')
                    return None
                con = sqlite3.connect(dbfileDec)
                con.text_factory = bytes
                cur = con.cursor()
                cur.execute('select count(*) from list_point')
                rtLen = (cur.fetchall())[0][0]
            except Exception as e:
                print(e.__str__())
            finally:
                if cur is not None:
                    cur.close()
                if con is not None:
                    con.close()
        return rtLen

    def getPointMapsFromS3db(self, s3dbname):
        rt = {}
        if s3dbname is None:
            return None

        con = None
        cu = None
        try:
            dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbname)
            dbfileDec = '{}.dec'.format(dbfile)

            if not os.path.exists(dbfileDec):
                print(dbfileDec + ' file not existing!')
                return None
            con = sqlite3.connect(dbfileDec)
            con.text_factory = bytes
            cu = con.cursor()
            cu.execute('select name, ch_description from list_point')
            data = cu.fetchall()
            allPoints = {}
            for x in data:
                allPoints[x[0].decode('gbk')] = x[1].decode('gbk')
            rt = allPoints
        except Exception as e:
            print(e.__str__())
        finally:
            if cu is not None:
                cu.close()
            if con is not None:
                con.close()
        return rt
    #mango modified 2014-11-27
    def prepareResouceFromS3db(self, name, s3db, updatetime, clean):
        rtnInfo = dict(success = False, info = None)
        print('prepareResouceFromS3db: ' + name)
        configDb = path.join(app.config.get('S3DB_DIR_CLOUD'), s3db)
        dbfileDec = '{}.dec'.format(configDb)
        if os.path.exists(dbfileDec):
            statinfo = os.stat(dbfileDec)
            imageDir = path.join('beopWeb/static/images/plant/',name)  #upload oss , delete this function
            bNeedUpdate = (statinfo.st_mtime>updatetime) or (updatetime==None) or (not os.path.exists(imageDir))
            bNeedUpdate = True #force to update
            if bNeedUpdate:
                if not os.path.exists(imageDir):
                    os.mkdir(imageDir)

                if clean:
                    print('remove existing image')
                    for f in listdir(imageDir):
                        f_path = path.join(imageDir,f)
                        try:
                            if path.isfile(f_path):
                                unlink(f_path)
                        except Exception as e:
                            logging.error(e)
                            print(e)

                if not os.path.exists(dbfileDec):
                    rtnInfo['success'] = False
                    strInfo = "%s is not exist!" % (dbfileDec)
                    rtnInfo['info'] = strInfo
                    print(strInfo)
                    logging.error(strInfo)
                    return rtnInfo

                try:
                    con = sqlite3.connect(dbfileDec)
                    cur = con.cursor()
                    cur.execute('select id, imagebinary from lib_image')
                    for id,img in cur.fetchall():
                        if img:
                            print('{0}/{1}.png'.format(imageDir,id),'wb')
                            imageFile = open('{0}/{1}.png'.format(imageDir,id),'wb')
                            imageFile.write(img)
                            imageFile.close()
                    cur.execute('select id, imagebinary from lib_image_animation')
                    for id,img in cur.fetchall():
                        if img:
                            imageFile = open('{0}/animation_{1}.png'.format(imageDir,id),'wb')
                            imageFile.write(img)
                            imageFile.close()
                except Exception as e:
                    logging.error(e.__str__())
                    logging.exception(e)
                    print(e.__str__())
                finally:
                    if cur is not None:
                        cur.close()
                    if con is not None:
                        con.close()
                rtnInfo['success'] = True
                return rtnInfo
        else:
            rtnInfo['success'] = False
            strInfo = "%s is not exist!" % (dbfileDec)
            rtnInfo['info'] = strInfo
            print(strInfo)
            logging.error(strInfo)
            return rtnInfo


    def getPlantPageDetails(self, s3dbname, isOnlyStickPage = True):
        cu = None
        con = None
        data = []
        try:
            dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbname)
            dbfileDec = '{}.dec'.format(dbfile)

            if not os.path.exists(dbfileDec):
                print(dbfileDec + ' file not existing!')
                return []
            con = sqlite3.connect(dbfileDec)
            con.text_factory = bytes
            cu = con.cursor()
            if isOnlyStickPage:
                cu.execute("SELECT id, name, pagetype, width, hight, unitproperty02 FROM list_page WHERE pagetype = 'fullscreen' AND unitproperty01 = '1' ORDER BY showOrder")
            else:
                cu.execute("SELECT id, name, pagetype, width, hight, unitproperty02 FROM list_page ORDER BY showOrder")
            for x in cu.fetchall():
                url = ''
                if x[5] is not None: url = x[5].decode('gbk')
                data.append({ 'id': x[0], 'name': x[1].decode('gbk'), 'type': x[2].decode('gbk'), 'width': x[3], 'height': x[4], 'url': url })
        finally:
            if cu is not None:
                cu.close()
            if con is not None:
                con.close()
        return data

    def getPlant(self, s3dbname, pageid):
        con = None
        cu = None

        dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbname)
        dbfileDec = '{}.dec'.format(dbfile)
        pageId = pageid

        if not os.path.exists(dbfileDec):
            print(dbfileDec + ' file not existing!')
            return None

        dataPage = {}
        dataImages = []
        dataAnimationImages = []
        dataAnimationList = {}
        dataPipeLines = []
        dataEquipments = []
        dataCharts = []
        dataGages = []
        dataButtons = []
        dataRulers = []
        dataCheckboxs = []
        dataTexts = []
        dataRects = []
        dataTempDistributions = {}

        con = sqlite3.connect(dbfileDec)
        con.text_factory = bytes
        cu = con.cursor()

        if con != None and cu != None:
            try:
                #Page
                cu.execute("SELECT width, hight, pagetype FROM list_page WHERE id = %s" % (pageId))
                item = cu.fetchall()

                if len(item)>0:
                    dataPage = { 'id': pageId, 'width': item[0][0], 'height': item[0][1], 'type': item[0][2].decode('gbk') }

                #Pipeline
                cu.execute("SELECT id, PointList, pipeWidth, style, idlist, layer, unitproperty01, innerColor FROM list_line WHERE pageid = %s" % (pageId))
                for item in cu.fetchall():
                    strs = item[1].decode('gbk').replace('(', '').replace(')', '').replace(',', ';').split(';') if item[1] != None else ['0','0','0','0']
                    color = int(item[7]) if item[7] != None else 0
                    dataPipeLines.append({ 'id': item[0] if item[0] != None else 0,
                                           'width': item[2] if item[2] != None else 0,
                                           'direction': item[3] if item[3] != None else 0,
                                           'idCom': item[4].decode('gbk') if item[4] != None else '',
                                          'startX': strs[0], 'startY': strs[1], 'endX': strs[2], 'endY': strs[3],
                                           'layer': item[5] if item[5] != None else 0,
                                           'waterType': item[6].decode('gbk') if item[6] != None else '',
                                          'color': {'r': color // 256 // 256 % 256, "g": color // 256 % 256, 'b': color % 256} })

                #Equipment
                cu.execute("SELECT elementid, x, y, width, hight, DataComId, pictureid, rotateAngle, bind_content, event_content, layer, page_contain_elements.unitproperty02 \
                FROM page_contain_elements LEFT JOIN event ON event.id = page_contain_elements.elementid WHERE page_contain_elements.pageid = %s" % (pageId))
                listAnimationIds = [] #distinct animation ids
                for item in cu.fetchall():
                    animationStatus = {}
                    str_item = item[8].decode('gbk') if item[8] != None else ''
                    if(str_item != ''):
                        temp = str_item.split('|')
                        for strStatus in temp:
                            tempStatus = strStatus.split(',')
                            if len(tempStatus) == 4:
                                animationStatus.update({tempStatus[0]: { 'animationId': tempStatus[1], 'frameCount': tempStatus[2], 'interval': tempStatus[3]}})
                                if(tempStatus[1] not in listAnimationIds):
                                    listAnimationIds.append(tempStatus[1])
                                if(int(tempStatus[2]) == 1 and tempStatus[1] not in dataImages):
                                    dataImages.append(tempStatus[1])

                    strItem5 = ''
                    strItem9 = ''
                    strItem11 = ''
                    if item[5] != None:
                        strItem5 = item[5].decode('gbk')
                    if item[9] != None:
                        strItem9 = item[9].decode('gbk').split(',')[4]
                    if item[11] != None:
                        strItem11 = item[11].decode('gbk')

                    dataEquipments.append({ 'id': item[0] if item[0] != None else 0,
                                            'x': item[1] if item[1] != None else 0,
                                            'y': item[2] if item[2] != None else 0,
                                            'width': item[3] if item[3] != None else 0,
                                            'height': item[4] if item[4] != None else 0,
                                            "idCom": strItem5,
                                            'idPicture': item[6] if item[6] != None else 0,
                                           'rotate': item[7] if item[7] != None else 0,
                                            'link': strItem9 ,
                                            'layer': item[10] if item[10] != None else 0,
                                            'isFromAnimation': strItem11 == '0', 'animation': animationStatus })

                #cu.execute("SELECT ID FROM lib_image WHERE ID in (SELECT DISTINCT pictureid FROM page_contain_elements WHERE pageid = %s)" % (pageId))
                cu.execute("SELECT DISTINCT pictureid FROM page_contain_elements WHERE pageid = %s" % (pageId))
                for item in cu.fetchall():
                    if item[0] != None:
                        if(item[0] not in dataImages):
                            dataImages.append(item[0])

                cu.execute("SELECT id, animationlist FROM lib_animation WHERE id IN (%s)" % (','.join(listAnimationIds)))
                #distinct animation image ids
                for item in cu.fetchall():
                    arrImageIds = item[1].decode('gbk').split(',') if item[1] != None else []
                    dataAnimationList.update({ item[0]: arrImageIds })
                    for arrImageId in arrImageIds:
                        if(arrImageId not in dataAnimationImages):
                            dataAnimationImages.append(arrImageId)

                #Chart
                cu.execute("SELECT id, x, y, width, height, update_interval, elementType FROM list_chart WHERE pageid = %s" % (pageId))
                for item in cu.fetchall():
                    dataCharts.append({ 'id': item[0] if item[0] != None else 0,
                                        'x': item[1] if item[1] != None else 0,
                                        'y': item[2] if item[2] != None else 0,
                                        'width': item[3] if item[3] != None else 0,
                                        'height': item[4] if item[4] != None else 0,
                                        'interval': item[5] if item[5] != None else 0,
                                        'data': [],
                                        'elementType':item[6] if item[6] != None else 0 })
                cu.execute("SELECT id, color1, title, pointname FROM detail_chart WHERE pageid = %s" % (pageId))
                for item in cu.fetchall():
                    for chart in dataCharts:
                        if item[0] != None:
                            if(chart["id"] == item[0]):
                                intColor = int(item[1]) if item[1] != None else 0
                                chart["data"].append({ 'color': {'r': intColor // 256 // 256 % 256,
                                                                 "g": intColor // 256 % 256,
                                                                 'b': intColor % 256}, 'title': item[2].decode('gbk') if item[2] != None else '',
                                                      'pointName': item[3].decode('gbk') if item[3] != None else ''})
                                break

                #Button
                cu.execute("SELECT id, x, y, width, height, comm, over, down, disable, textcontent, link, settingpoint, settingvalue, description, layer, textsize, textcolor \
                FROM list_button WHERE pageid = %s" % (pageId))
                for item in cu.fetchall():
                    textColor = int(item[16]) if item[16] != None else 0
                    dataButtons.append({ 'id': item[0] if item[0] != None else 0,
                                         'x': item[1] if item[1] != None else 0,
                                         'y': item[2] if item[2] != None else 0,
                                         'width': item[3] if item[3] != None else 0,
                                         'height': item[4] if item[4] != None else 0,
                                         'comm': item[5] if item[5] != None else 0,
                                         'over': item[6] if item[6] != None else 0,
                                         'down': item[7] if item[7] != None else 0,
                                         'disable': item[8] if item[8] != None else 0,
                                         'text': item[9].decode('gbk') if item[9] != None else '',
                                         'link': item[10] if item[10] != None else 0,
                                         'idCom': item[11].decode('gbk') if item[11] != None else '',
                                         'setValue': item[12] if item[12] != None else 0,
                                         'description': item[13].decode('gbk') if item[13] != None else '',
                                         'layer': item[14] if item[14] != None else 0,
                                         'fontSize': item[15] if item[15] != None else 0,
                                         'fontColor': {'b': textColor // 256 // 256 % 256, "g": textColor // 256 % 256, 'r': textColor % 256}})
                    if(item[5]!=None and item[5] not in dataImages):
                        dataImages.append(item[5])
                    if(item[6]!=None and item[6] not in dataImages):
                        dataImages.append(item[6])
                    if(item[7]!=None and item[7] not in dataImages):
                        dataImages.append(item[7])
                    if(item[8]!=None and item[8] not in dataImages):
                        dataImages.append(item[8])

                # Text
                cu.execute(
                    "SELECT t.id, t.xpos, t.ypos, t.width, t.height, t.dataComId, t.initialValue, t.size, t.font, t.color, "
                    "t.decimalplace, t.bindstring, t.showMode, p.R_W, layer, t.align "
                    "FROM list_text t left join list_point p on t.dataComId = p.name WHERE pageid = %s" % (pageId))
                for item in cu.fetchall():
                    textColor = int(item[9]) if item[9] != None else 0
                    dataTexts.append({'id': item[0] if item[0] != None else 0,
                                      'x': item[1] if item[1] != None else 0,
                                      'y': item[2] if item[2] != None else 0,
                                      'width': item[3] if item[3] != None else 0,
                                      'height': item[4] if item[4] != None else 0,
                                      'idCom': item[5].decode('gbk') if item[5] != None else '',
                                      'text': item[6].decode('gbk') if item[6] != None else '',
                                      'fontSize': item[7] if item[7] != None else 0,
                                      'font': item[8].decode("gbk") if item[8] != None else '',
                                      'color': {'r': textColor // 256 // 256 % 256, "g": textColor // 256 % 256,
                                                'b': textColor % 256}, 'decimalplace': item[10],
                                      'bindString': item[11].decode("gbk") if item[11] != None else '',
                                      'showMode': item[12] if item[12] != None else 0,
                                      'rw': item[13] if item[13] != None else 0,
                                      'layer': item[14] if item[0] != None else 0,
                                      'align': item[15] if item[15] !=None else 0})
                #Gage
                cu.execute("SELECT ld.id, ld.x, ld.y, ld.width, ld.height, ld.pointname, ld.max, ld.min, lp.pagetype, lp.xposition, lp.yposition FROM list_dashboard ld left join list_page lp on ld.pageid = lp.id WHERE ld.pageid = %s" % (pageId))
                for item in cu.fetchall():
                    dataGages.append({ 'id': item[0] if item[0] != None else 0,
                                       'x': item[1] if item[1] != None else 0,
                                       'y': item[2] if item[2] != None else 0,
                                       'width': item[3] if item[3] != None else 0,
                                       'height': item[4] if item[4] != None else 0,
                                       'idCom': item[5].decode('gbk') if item[5] != None else '',
                                       'max': item[6] if item[6] != None else 0,
                                       'min': item[7] if item[7] != None else 0,
                                       'pagetype':item[8].decode('gbk') if item[8] != None else '',
                                       'xposition':item[9] if item[9] != None else 0,
                                       'yposition': item[10] if item[10] != None else 0 })

                #Ruler
                    #---referrences
                cu.execute("SELECT id, unitproperty02, unitproperty03, unitproperty04, unitproperty05 , unitproperty07 \
                FROM list_unit18 \
                WHERE unitproperty01 = 0 and id in (SELECT id FROM list_unit17 WHERE pageid = %s)" % (pageId))
                dataRulerItems = []
                for item in cu.fetchall():
                    dataRulerItems.append({ 'id': item[0] if item[0] != None else 0,
                                            'name': item[1].decode('gbk') if item[1] != None else '',
                                            'value': item[2].decode('gbk') if item[2] != None else '',
                                            'idCom': item[3].decode('gbk') if item[3] != None else '',
                                            'link': item[4].decode('gbk') if item[4] != None else '',
                                            'isInUp': item[5].decode('gbk') if item[5] != None else ''})

                    #---level
                cu.execute("SELECT id, unitproperty02, unitproperty03, unitproperty04 \
                FROM list_unit18 \
                WHERE unitproperty01 = 1 and id in (SELECT id FROM list_unit17 WHERE pageid == %s)" % (pageId))
                levelsItem = []
                levels = []
                colorList = ['#7dbfe0', '#94c84c', '#f0bc7d', '#d17965']
                for item in cu.fetchall():
                    levelsItem.append({ 'id': item[0] if item[0] != None else 0,
                                        'text': item[1].decode('gbk') if item[1] != None else '',
                                        'max': item[2].decode('gbk') if item[2] != None else '',
                                        'min': item[3].decode('gbk') if item[3] != None else ''})
                if len(levelsItem) != 0:
                    levelsItem.sort(key=lambda x: x['max'])
                    for index in range(len(levelsItem)):
                        l_item = levelsItem[index]
                        levels.append({ 'color': colorList[index], 'text': l_item['text'], 'min': l_item['min'], 'max': l_item['max'] })
                cu.execute("SELECT id, x, y, width, height, unitproperty01, unitproperty02, unitproperty03, unitproperty04, unitproperty05, unitproperty06 FROM list_unit17 WHERE pageid = %s" % (pageId))
                for item in cu.fetchall():
                    dataTempArrs = []
                    for temp in dataRulerItems:
                        if item[0] != None:
                            if(temp['id'] == item[0]):
                                dataTempArrs.append(temp)
                    dataRulers.append({ 'id': item[0] if item[0] != None else 0,
                                        'x': item[1] if item[1] != None else 0,
                                        'y': item[2] if item[2] != None else 0,
                                        'width': item[3] if item[3] != None else 0,
                                        'height': item[4] if item[4] != None else 0,
                                        'levels': levels,
                                        'name': item[5].decode('gbk') if item[5] != None else '',
                                        'min': item[7].decode('gbk') if item[7] != None else 0,
                                        'max': item[6].decode('gbk') if item[6] != None else 0,
                                        'mainScale': item[8].decode('gbk') if item[8] != None else '',
                                        'minorScale': item[9].decode('gbk') if item[9] != None else '',
                                        'decimal': item[10].decode('gbk') if item[10] != None else '',
                                        'references': dataTempArrs
                    })


                #Temp Distribution

                cu.execute("select lt.id,lt.initialvalue,lt.xpos,lt.ypos,lt.dataComId "
                           "from list_text lt "
                           "where lt.unitproperty02 = 1 and lt.pageid = '%s';" % pageId)
                dataTempDistributions['pageid'] = pageId
                temp_data = []
                temp_point_result = cu.fetchall()
                for item in temp_point_result:
                    temp_data.append({'id': item[0] if item[0] != None else 0,
                                      'value': item[1].decode('gbk') if item[1] != None else '',
                                      'x': item[2] if item[2] != None else 0,
                                      'y': item[3] if item[3] != None else 0,
                                      'idCom': item[4].decode('gbk') if item[4] != None else ''})
                dataTempDistributions['data'] = temp_data
                cu.execute("select x, y, width, height, layer, unitproperty04 from list_unit19 where pageid = '%s'" % pageId)
                temp_page_result = cu.fetchone()
                if temp_page_result is not None:
                    dataTempDistributions['x'] = temp_page_result[0]
                    dataTempDistributions['y'] = temp_page_result[1]
                    dataTempDistributions['width'] = temp_page_result[2]
                    dataTempDistributions['height'] = temp_page_result[3]
                    dataTempDistributions['layer'] = temp_page_result[4]
                    dataTempDistributions['heatType'] = self._heat_map_type.get(
                        temp_page_result[5].decode() if temp_page_result[5] else '0')


                #Checkbox
                cu.execute("SELECT id,x,y,width,height,layer,unitproperty01,unitproperty02,unitproperty03,unitproperty04,unitproperty05,unitproperty06,unitproperty07,unitproperty08,unitproperty09 \
                FROM list_unit07 WHERE pageid = %s" % (pageId))
                for item in cu.fetchall():
                    dataCheckboxs.append({ 'id': item[0] if item[0] != None else 0,
                                           'x': item[1] if item[1] != None else 0,
                                           'y': item[2] if item[2] != None else 0,
                                           'width': item[3] if item[3] != None else 0,
                                           'height': item[4] if item[4] != None else 0,
                                           'layer': item[5] if item[5] != None else 0,
                                           'idCom': item[11].decode('gbk') if item[11] != None else '',
                                           'type': item[6].decode('gbk') if item[6] != None else '',
                                           'fontColor': item[7].decode('gbk') if item[7] != None else '',
                                           'fontSize': item[8].decode('gbk') if item[8] != None else '',
                                           'setValue': item[9].decode('gbk') if item[9] != None else '',
                                           'unsetValue': item[10].decode('gbk') if item[10] != None else '',
                                           'text': item[12].decode('gbk') if item[12] != None else '',
                                           'idGroup': item[13].decode('gbk') if item[13] != None else '',
                                           'expression': item[14].decode('gbk') if item[14] != None else ''})

                # import pdb;pdb.set_trace()
                # dottedLine
                cu.execute("SELECT id,x,y,width,height,layer \
                FROM list_unit19 WHERE pageid = %s and unitproperty01='dottedLineFrame'" % (pageId))
                for item in cu.fetchall():
                    dataRects.append({ 'id': item[0] if item[0] != None else 0,
                                           'x': item[1] if item[1] != None else 0,
                                           'y': item[2] if item[2] != None else 0,
                                           'width': item[3] if item[3] != None else 0,
                                           'height': item[4] if item[4] != None else 0,
                                           'layer': item[5] if item[5] != None else 0})

            except Exception as e:
                print(e.__str__())
            finally:
                if cu is not None:
                    cu.close()
                if con is not None:
                    con.close()
        return {
            'page': dataPage,
            'images': dataImages,
            'animationImages': dataAnimationImages,
            'animationList': dataAnimationList,
            'pipelines': dataPipeLines,
            'equipments': dataEquipments,
            'charts': dataCharts,
            'gages': dataGages,
            'buttons': dataButtons,
            'rulers': dataRulers,
            'checkboxs': dataCheckboxs,
            'texts': dataTexts,
            'rects': dataRects,
            'tempDistributions': dataTempDistributions}

    def createUserS3db(self, pointList, dbName):
        cu = None
        con = None
        try:
            dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),dbName)
            dbfileDec = '{}.dec'.format(dbfile)
            if os.path.exists(dbfileDec):
                os.remove(dbfileDec)
            con = sqlite3.connect(dbfileDec)
            con.text_factory = bytes
            cu = con.cursor()
            createTableSQL = 'create table list_point(name TEXT(256) primary key, ch_description TEXT(256))'
            cu.execute(createTableSQL)
            insertSQL = 'insert into list_point(name, ch_description) values'
            for index in range(len(pointList)):
                data = '(\'{0}\',\'{1}\')'.format(pointList[index][0], pointList[index][1])
                insertSQL += data
                if index != len(pointList)-1:
                    insertSQL += ','
            cu.execute(insertSQL)
            con.commit()
            createTableSQL = 'CREATE TABLE list_page(id INTEGER NOT NULL, name TEXT(256), bgcolor1 INTEGER, bgcolor2 INTEGER,\
                                bgimg INTEGER, groupid INTEGER, pagestyle INTEGER, width  INTEGER, \
                                hight INTEGER, Author TEXT(256), pagetype VARCHAR(50), showOrder INTEGER, xposition INTEGER, \
                                yposition INTEGER, unitproperty01 TEXT, unitproperty02 TEXT, unitproperty03 TEXT,\
                                unitproperty04 TEXT, unitproperty05 TEXT);'
            cu.execute(createTableSQL)
        except Exception as e:
            print(e.__str__())
        finally:
            if cu is not None:
                cu.close()
            if con is not None:
                con.close()

    def checkResoueceFroms3db(self, s3dbName):
        result = {'error':False}
        dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbName)
        dbfileDec = '{}.dec'.format(dbfile)

        if not os.path.exists(dbfileDec):
            result['error'] = dbfileDec + ' file not existing!'
            return result
        con = sqlite3.connect(dbfileDec)
        con.text_factory = bytes
        cu = con.cursor()

        imageIdList = []
        imageAnimationIdList = []
        animationIdList = []
        eventList = []
        try:
            #load lib_image
            strSQL = "select distinct id from lib_image where imagebinary is not null"
            cu.execute(strSQL)
            rv =  cu.fetchall()
            for item in rv:
                imageIdList.append(item[0])
            #load lib_image_animation
            strSQL = "select distinct id from lib_image_animation where imagebinary is not null"
            cu.execute(strSQL)
            rv =  cu.fetchall()
            for item in rv:
                imageAnimationIdList.append(item[0])
            #load lib_animation
            strSQL = "select id,animationlist from lib_animation  where animationlist is not null"
            cu.execute(strSQL)
            rv =  cu.fetchall()
            for item in rv:
                animationIdList.append({'id':item[0], 'animationlist':[int(x) for x in item[1].decode('gbk').split(',')]})
            #local event
            strSQL = "select pageid,id,bind_content from event where LENGTH(bind_content) > 0"
            cu.execute(strSQL)
            rv =  cu.fetchall()
            for item in rv:
                eventList.append({'pageid':item[0], 'elementid':item[1], 'bind_content':[[int(z) for z in y.split(',')] for y in [x for x in item[2].decode('gbk').split('|')]]})
            #check list_button
            strSQL = "select pageid,id,comm,over,down,disable from list_button"
            cu.execute(strSQL)
            rv =  cu.fetchall()
            list_button_lost = []
            for item in rv:
                commLost = False
                overLost = False
                downLost = False
                disableLost = False
                if item[2] not in imageIdList:
                    commLost = True
                if item[3] not in imageIdList:
                    overLost = True
                if item[4] not in imageIdList:
                    downLost = True
                if item[5] not in imageIdList:
                    disableLost = True
                if commLost or overLost or downLost or disableLost:
                    strTemp = "pageid:%d,elementid:%d," % (item[0], item[1])
                    if commLost:
                        strTemp += "comm lost:%d" % (item[2],)
                        strTemp += ","
                    if overLost:
                        strTemp += "over lost:%d" % (item[3],)
                        strTemp += ","
                    if downLost:
                        strTemp += "down lost:%d" % (item[4],)
                        strTemp += ","
                    if disableLost:
                        strTemp += "disable lost:%d" % (item[5],)
                    list_button_lost.append(strTemp)
            if len(list_button_lost) > 0:
                result['list_button'] = list_button_lost
                result.update({'error':True})
            #check page_contain_elements
            strSQL = "select pageid,elementid,pictureid from page_contain_elements"
            cu.execute(strSQL)
            rv =  cu.fetchall()
            list_metafile_lost = []
            for item in rv:
                strTemp = "pageid:%d,elementid:%d," % (item[0], item[1])
                if item[2] not in imageIdList:
                    strTemp += "picture lost:%d" % (item[2],)
                    list_metafile_lost.append(strTemp)
            if len(list_metafile_lost) > 0:
                result['page_contain_elements'] = list_metafile_lost
                result.update({'error':True})
            #check event
            list_event_lost = []
            for item in eventList:
                bind_content = item.get('bind_content')
                for sub in bind_content:
                    if len(sub) == 4:
                        strTemp = "pageid:%d,elementid:%d," % (item.get('pageid'), item.get('elementid'))
                        if sub[2] == 1:
                            if sub[1] not in imageIdList:
                                strTemp += "lost pic:%d" % (sub[1],)
                                list_event_lost.append(strTemp)
                        else:
                            for ai in animationIdList:
                                if ai.get('id') == sub[1]:
                                    idList = ai.get('animationlist')
                                    for id in idList:
                                        if id not in imageAnimationIdList:
                                            strTemp += "lost animation_pic:%d" % (id,)
                                            list_event_lost.append(strTemp)
            if len(list_event_lost) > 0:
                result['event'] = list_event_lost
                result.update({'error':True})
        except Exception as e:
            result['error'] = e.__str__()
        finally:
            if cu is not None:
                cu.close()
            if con is not None:
                con.close()
        result = {'%s' % (s3dbName,):result}
        return result

    def get_pagename_by_pageid(self, s3dbname, pageid):
        if s3dbname != None:
            cur = None
            con = None
            try:
                dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbname)
                dbfileDec = '{}.dec'.format(dbfile)

                if not os.path.exists(dbfileDec):
                    print(dbfileDec + ' file not existing!')
                    return None
                con = sqlite3.connect(dbfileDec)
                con.text_factory = bytes
                cur = con.cursor()
                cur.execute('select name from list_page where id=%s' % pageid)
                data = cur.fetchall()
                
            except Exception as e:
                print(e.__str__())
                traceback.print_exc()
            finally:
                if cur is not None:
                    cur.close()
                if con is not None:
                    con.close()
            return data[0][0]
        return None
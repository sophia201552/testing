"""
Routes and views for the flask application.
"""


from beopWeb import app
from flask import g
import sys, logging
import mysql.connector
from time import time
from datetime import datetime,timedelta
from beopWeb.mod_memcache.RedisManager import RedisManager
import csv, tablib
import xlrd, numpy
import os.path
import base64
#from pandas import Series, DataFrame
#import pandas as pd

_mysqldb = dict()
_dbConnectTimestamp = dict()

g_month_name_list = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
g_cvs_line_one_key_words = ['Key', 'Suffix', 'Name', 'Trend', 'Definitions', 'Used']
g_type_key_value = ['key_value', 'column_one', 'default']

def isAllCloudPointName(itemVarIdList):
    cps = {}
    projId = None
    for item in itemVarIdList:
        if item[0] == '@':
            arrs = item[1:].rsplit('|', 1)
            if len(arrs) == 2:
                projId = arrs[0]
                ptName = arrs[1]
                if cps.get(projId) is None:
                    cps[projId] = [ptName]
                else:
                    cps[projId].append(ptName)
        else:
            return None
    if len(cps.keys()) == 1:
        return (projId, cps[projId])

    return None

def decrypt_base64(input_str):
    if input_str:
        input_str_bytes = input_str.encode()
        input_str_bytes = base64.b64decode(input_str_bytes)
        arr = input_str_bytes.split(b'    ')
        if len(arr) == 2:
            username_bytes = arr[0]
            projname_bytes = arr[1]
            username_str = username_bytes.decode()
            projname_str = projname_bytes.decode()
            return username_str, projname_str
    return "", ""

def getCsvType(headerList):
    count = 0
    if len(headerList) == 3:
        return 'tuple'
    for item in headerList:
        for subItem in g_cvs_line_one_key_words:
            if subItem in item:
                count += 1
                if count > 3:
                    return 'key_value'
    return 'default'

def isStrInRowData(strKey, rowData):
    for item in rowData:
        if strKey in item:
            return True
    return False

def make_db_query_insert(data):
    field_str = list()
    value_str = list()
    for key, val in data.items():
        if val:
            field_str.append(key) 
            value_str.append(val) 
    rv = '({0}) values ({1})'.format(','.join(field_str),','.join('"{0}"'.format(x) for x in value_str))
    return rv


def make_db_query_update(cond,data):  
    cond_str = ' and '.join('{0}="{1}"'.format(key,val) for key,val in cond.items() if val)
    value_str = ','.join('{0}="{1}"'.format(key,val) for key,val in data.items() if val)
    assert value_str
    rv = 'set {0}{1}'.format(value_str, ' where {0}'.format(cond_str) if cond_str else '')
    return rv

def readEXCEL_old(filePath):
    record = []
    pointSet = set()
    result = {'error':'failed'}
    datafile = None
    minDatetime = None
    maxDatetime = None
    try:
        datafile = xlrd.open_workbook(filePath)
        if datafile != None:
            nSheets = datafile.nsheets
            for sheetIndex in range(nSheets):
                sh = datafile.sheet_by_index(sheetIndex)
                nrows = sh.nrows
                ncols = sh.ncols
                row_list = []
                point_list = []
                if nrows > 1:
                    leftBlankCol = 0
                    centerBlankCol = 0
                    headerFloatNum = 0
                    datetimeInRowOneColOne = False
                    row0_data = sh.row_values(0)
                    if len(row0_data) > 2 and ncols == len(row0_data):
                        for row0Index,row0Content in enumerate(row0_data):
                            if isinstance(row0Content, float):
                                headerFloatNum += 1
                            if row0Index <=1 and row0Content == '':
                                leftBlankCol += 1
                            if row0Index == 0 and ('date' in row0Content.lower() or 'time' in row0Content.lower()):
                                datetimeInRowOneColOne = True
                            if row0Index > 1 and row0Index < len(row0_data)-2 and row0Content == '':
                                if len(str(row0_data[row0Index-1])) > 0 and len(str(row0_data[row0Index-2])) > 0 and \
                                    len(str(row0_data[row0Index+1])) > 0 and len(str(row0_data[row0Index+2])) > 0:
                                    centerBlankCol += 1
                            if len(str(row0Content)) > 0 and 'date' != str(row0Content).lower():
                                pos = str(row0Content).find('(')
                                if pos != -1:
                                    row0Content = str(row0Content)[0:pos].rstrip()
                                point_list.append(row0Content)
                    if leftBlankCol == 2:
                        for rowIndex in range(1,nrows):
                            row_data = sh.row_values(rowIndex)
                            if len(row_data) > 2 and ncols == len(row_data):
                                t0 = xlrd.xldate_as_tuple(row_data[0], 0)
                                t1 = xlrd.xldate_as_tuple(row_data[1], 0)
                                assert(len(t0) == 6)
                                assert(len(t1) == 6)
                                datetime0 = datetime(year=t0[0], month=t0[1], day=t0[2], hour=t0[3], minute=t0[4], second=t0[5])
                                datedelta0 = timedelta(hours=t1[3],minutes=t1[4],seconds=t1[5])
                                datetimeall = datetime0 + datedelta0
                            row_list.append((datetimeall,row_data[2:]))
                        for rowItem in row_list:
                            if len(rowItem) == 2:
                                if len(rowItem[1]) == len(point_list):
                                    for colIndex in range(len(point_list)):
                                        pointSet.add(point_list[colIndex])
                                        if minDatetime == None:
                                            minDatetime = rowItem[0]
                                        if maxDatetime == None:
                                            maxDatetime = rowItem[0]
                                        if rowItem[0] < minDatetime:
                                            minDatetime = rowItem[0]
                                        if rowItem[0] > maxDatetime:
                                            maxDatetime = rowItem[0]
                                        try:
                                            value = float(rowItem[1][colIndex])
                                            record.append((rowItem[0], point_list[colIndex], value))
                                        except Exception as e:
                                            record.append((rowItem[0], point_list[colIndex], -1))
                    elif centerBlankCol > 0:
                        for rowIndex in range(1,nrows):
                            row_data = sh.row_values(rowIndex)
                            if len(row_data) > 2 and ncols == len(row_data):
                                dt = None
                                val = None
                                count = 0
                                for item in row_data:
                                    temp = getDatetimeByStr(item)
                                    if temp == None:
                                        try:
                                            val = float(item)
                                        except Exception as e:
                                            val = -1
                                    else:
                                        dt = temp
                                    if dt!=None and val!=None:
                                        if count < len(point_list):
                                            pointSet.add(point_list[count])
                                            if minDatetime == None:
                                                minDatetime = dt
                                            if maxDatetime == None:
                                                maxDatetime = dt
                                            if dt < minDatetime:
                                                minDatetime = dt
                                            if dt > maxDatetime:
                                                maxDatetime = dt
                                            record.append((dt, point_list[count], val))
                                            dt = None
                                            val = None
                                            count += 1
                    elif headerFloatNum > 0:
                        row1_data = sh.row_values(1)
                        indexLast = 0
                        point_list_array = []
                        delimiterList = []
                        for i,item in enumerate(row1_data):
                            if len(str(item)) == 0:
                                delimiterList.append(i)
                                pointlist = row1_data[indexLast+1:i]
                                indexLast = i+1
                                point_list_array.append(pointlist)
                        if indexLast < len(row1_data):
                            pointlist = row1_data[indexLast+1:len(row1_data)]
                            point_list_array.append(pointlist)
                        blockList = []
                        timeList = []
                        for rowIndex in range(2,nrows):
                            row_data = sh.row_values(rowIndex)
                            indexLast = 0
                            temp = []
                            tempTime = []
                            for j in delimiterList:
                                temp.append(row_data[indexLast+1:j])
                                t = xlrd.xldate_as_tuple(row_data[indexLast], 0)
                                assert(len(t) == 6)
                                dt = datetime(year=t[0], month=t[1], day=t[2], hour=t[3], minute=t[4], second=t[5])
                                tempTime.append(dt)
                                indexLast = j+1
                            if indexLast < len(row_data):
                                temp.append(row_data[indexLast+1:len(row_data)])
                                t = xlrd.xldate_as_tuple(row_data[indexLast], 0)
                                assert(len(t) == 6)
                                dt = datetime(year=t[0], month=t[1], day=t[2], hour=t[3], minute=t[4], second=t[5])
                                tempTime.append(dt)
                            blockList.append(temp)
                            timeList.append(tempTime)
                        if len(blockList) == len(timeList):
                            for i in range(len(blockList)):
                                for j in range(len(blockList[i])):
                                    if len(point_list_array[j]) == len(blockList[i][j]):
                                        for k in range(len(blockList[i][j])):
                                            pointSet.add(point_list_array[j][k])
                                            if minDatetime == None:
                                                minDatetime = timeList[i][j]
                                            if maxDatetime == None:
                                                maxDatetime = timeList[i][j]
                                            if timeList[i][j] < minDatetime:
                                                minDatetime = timeList[i][j]
                                            if timeList[i][j] > maxDatetime:
                                                maxDatetime = timeList[i][j]
                                            bNum = True
                                            convert = 0.0
                                            try:
                                                convert = float(blockList[i][j][k])
                                            except Exception as e:
                                                bNum = False
                                            if bNum:
                                                record.append((timeList[i][j], point_list_array[j][k], convert))
                                            else:
                                                record.append((timeList[i][j], point_list_array[j][k], -1))
                    elif leftBlankCol == 1:
                        for rowIndex in range(1,nrows):
                            row_data = sh.row_values(rowIndex)
                            if len(row_data) > 1:
                                if len(str(row_data[0])) > 0:
                                    t0 = None
                                    if ncols == len(row_data):
                                        t0 = getDatetimeByStr(row_data[0])
                                    row_list.append((t0,row_data[1:]))
                        for i, rowItem in enumerate(row_list):
                            if len(rowItem) == 2:
                                if len(rowItem[1]) == len(point_list):
                                    for colIndex in range(len(point_list)):
                                        pointSet.add(point_list[colIndex])
                                        if minDatetime == None:
                                            minDatetime = rowItem[0]
                                        if maxDatetime == None:
                                            maxDatetime = rowItem[0]
                                        if rowItem[0] < minDatetime:
                                            minDatetime = rowItem[0]
                                        if rowItem[0] > maxDatetime:
                                            maxDatetime = rowItem[0]
                                        try:
                                            value = float(rowItem[1][colIndex])
                                            record.append((rowItem[0], point_list[colIndex], value))
                                        except Exception as e:
                                            record.append((rowItem[0], point_list[colIndex], -1))
                    elif datetimeInRowOneColOne:
                        temp_list = []
                        for item in point_list:
                            if ',' in item:
                                temp = item.split(',')
                                if len(temp) == 2:
                                    temp_list.append(temp[0])
                            else:
                                temp = item.split(' ')
                                if len(temp) == 2:
                                    temp_list.append(temp[0])
                        for rowIndex in range(1,nrows):
                            row_data = sh.row_values(rowIndex)
                            if len(row_data) > 1:
                                if len(str(row_data[0])) > 0:
                                    datetime0 = None
                                    t0 = None
                                    if ncols == len(row_data):
                                        try:
                                            t0 = xlrd.xldate_as_tuple(row_data[0], 0)
                                            assert(len(t0) == 6)
                                            datetime0 = datetime(year=t0[0], month=t0[1], day=t0[2], hour=t0[3], minute=t0[4], second=t0[5])
                                        except Exception as e:
                                            datetime0 = getDatetimeByStr(row_data[0])
                                    row_list.append((datetime0, row_data[1:]))
                        for rowItem in row_list:
                            if len(rowItem) == 2:
                                if len(rowItem[1]) == len(point_list):
                                    for colIndex in range(len(point_list)):
                                        pointSet.add(point_list[colIndex])
                                        if minDatetime == None:
                                            minDatetime = rowItem[0]
                                        if maxDatetime == None:
                                            maxDatetime = rowItem[0]
                                        if rowItem[0] < minDatetime:
                                            minDatetime = rowItem[0]
                                        if rowItem[0] > maxDatetime:
                                            maxDatetime = rowItem[0]
                                        try:
                                            value = float(rowItem[1][colIndex])
                                            record.append((rowItem[0], point_list[colIndex], value))
                                        except Exception as e:
                                            record.append((rowItem[0], point_list[colIndex], -1))
            result = {'error':'successful'}
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        result = {'error':'unsupported format'}
    return result,record,list(pointSet),(minDatetime, maxDatetime)

def readEXCEL(filePath):
    record = []
    pointSet = set()
    result = {'error':'failed'}
    datafile = None
    minDatetime = None
    maxDatetime = None
    try:
        #打开文件
        datafile = xlrd.open_workbook(filePath)
        #获取工作簿
        nsheets = datafile.nsheets
        row_list = []
        for sheetIndex in range(nsheets):
            sh = datafile.sheet_by_index(sheetIndex)
            #行数
            nrows = sh.nrows
            #列数
            ncols = sh.ncols
            if nrows > 1:
                row0_data = sh.row_values(0)
                point_list = row0_data[1:]
                for rowIndex in range(1,nrows):
                    row_data = sh.row_values(rowIndex)
                    if len(row_data) > 1:
                        if len(str(row_data[0])) > 0:
                            datetime0 = None
                            if ncols == len(row_data):
                                try:
                                    t0 = xlrd.xldate_as_tuple(row_data[0], 0)
                                    assert(len(t0) == 6)
                                    datetime0 = datetime(year=t0[0], month=t0[1], day=t0[2], hour=t0[3], minute=t0[4], second=t0[5])
                                except Exception as e:
                                    datetime0 = getDatetimeByStr(row_data[0])
                            row_list.append((datetime0, row_data[1:]))
                for rowItem in row_list:
                    if len(rowItem) == 2:
                        if len(rowItem[1]) == len(point_list):
                            for colIndex in range(len(point_list)):
                                pointSet.add(point_list[colIndex])
                                if minDatetime == None:
                                    minDatetime = rowItem[0]
                                if maxDatetime == None:
                                    maxDatetime = rowItem[0]
                                if rowItem[0] < minDatetime:
                                    minDatetime = rowItem[0]
                                if rowItem[0] > maxDatetime:
                                    maxDatetime = rowItem[0]
                                try:
                                    value = float(rowItem[1][colIndex])
                                    record.append((rowItem[0].strftime('%Y-%m-%d %H:%M:%S'), point_list[colIndex], value))
                                except Exception as e:
                                    record.append((rowItem[0].strftime('%Y-%m-%d %H:%M:%S'), point_list[colIndex], -1))
        result = {'error':'successful'}
    except Exception as e:
        print('readEXCEL error:' + e.__str__())
        logging.error('readEXCEL error:' + e.__str__())
    return result,record,list(pointSet),(minDatetime, maxDatetime)

def readCSV(filePath):
    record = []
    pointSet = set()
    result = {'error':'successful'}
    dataFile = None
    fp = None
    rowInfoList = []
    strType = 'default'
    minDatetime = None
    maxDatetime = None
    try:
        fp = open(filePath, 'rt', encoding='utf-8')
        dataFile = csv.reader(fp)
        lastRowItemCount = 0
        col_one_num = 0
        total_row_num = 0
        for index, item in enumerate(dataFile):
            if index == 0:
                strType = getCsvType(item)
            delimiterNo = -1
            colnum = len(item)
            if colnum == 1:
                col_one_num += 1
            if colnum != lastRowItemCount:
                delimiterNo = index
                lastRowItemCount = colnum
            rowInfoList.append({'colnum':colnum, 'rowdata':item, 'delimiterno':delimiterNo})
            total_row_num = index + 1
        if strType == 'default' and total_row_num == col_one_num:
            strType = g_type_key_value[1]
        if strType == g_type_key_value[0]:
            key_map = dict()
            key_list = []
            data_array = []
            for row in rowInfoList:
                rowdata = row.get('rowdata')
                rowlen = row.get('colnum')
                delimiterno = row.get('delimiterno')
                if (not isDataInvalid(rowdata)):
                    if rowlen == 4:
                        key_map[rowdata[0][0:len(rowdata[0])-1]] = rowdata[1]
                    else:
                        if rowlen >= len(key_map):
                            if isStrInRowData('Date', rowdata) and isStrInRowData('Time', rowdata):
                                key_list = rowdata[2:]
                            else:
                                nYear = 0
                                nMonth = 0
                                nDay = 0
                                nHour = 0
                                nMinute = 0
                                nSecond = 0
                                tempdate = None
                                if '/' in rowdata[0]:
                                    tempdate = rowdata[0].split('/')
                                elif '-' in rowdata[0]:
                                    tempdate = rowdata[0].split('-')
                                if tempdate != None:
                                    if len(tempdate) == 3:
                                        nYear = int(tempdate[2])
                                        nMonth = int(tempdate[1])
                                        nDay = int(tempdate[0])
                                temptime = rowdata[1].split(':')
                                if len(temptime) == 3:
                                    nHour = int(temptime[0])
                                    nMinute = int(temptime[1])
                                    nSecond = int(temptime[2])
                                insertTime = datetime(year=nYear, month=nMonth, day=nDay, hour=nHour, minute=nMinute, second=nSecond)
                                data_array.append((insertTime, rowdata[2:]))
            for item in data_array:
                for index, key in enumerate(key_map):
                    pointSet.add(key_map[key])
                    if minDatetime == None:
                        minDatetime = item[0]
                    if maxDatetime == None:
                        maxDatetime = item[0]
                    if item[0] < minDatetime:
                        minDatetime = item[0]
                    if item[0] > maxDatetime:
                        maxDatetime = item[0]
                    record.append((item[0], key_map[key], item[1][index]))
        elif strType == g_type_key_value[1]:
            name_list = []
            for index, row in enumerate(rowInfoList):
                rowdata = row.get('rowdata')
                if len(rowdata) == 1:
                    if index == 0:
                        rowValueList = rowdata[0].replace('"', '').split(';')
                        name_list = rowValueList[1::2]
                    else:
                        rowValueList = rowdata[0].split(';')
                        for i, name in enumerate(name_list):
                            dt = datetime.now()
                            val = 0.0
                            if i*2 < len(rowValueList):
                                dt = getDatetimeByStr(rowValueList[i*2])
                                if dt == None:
                                    dt = datetime.now()
                            if i*2+1 < len(rowValueList):
                                try:
                                    val = float(rowValueList[i*2+1])
                                except Exception as e:
                                    val = str(rowValueList[i*2+1])
                            pointSet.add(name)
                            if minDatetime == None:
                                minDatetime = dt
                            if maxDatetime == None:
                                maxDatetime = dt
                            if dt < minDatetime:
                                minDatetime = dt
                            if dt > maxDatetime:
                                maxDatetime = dt
                            record.append((dt, name, val))
        elif strType == 'tuple':
            for rowInfo in rowInfoList:
                dt = datetime.strptime(rowInfo.get('rowdata')[0], '%Y-%m-%d %H:%M:%S')
                if minDatetime == None:
                    minDatetime = dt
                if maxDatetime == None:
                    maxDatetime = dt
                if dt < minDatetime:
                    minDatetime = dt
                if dt > maxDatetime:
                    maxDatetime = dt
                record.append((dt.strftime('%Y-%m-%d %H:%M:%S'), rowInfo.get('rowdata')[1], rowInfo.get('rowdata')[2]))
                pointSet.add(rowInfo.get('rowdata')[1])
        else:
            name_list = []
            for index, row in enumerate(rowInfoList):
                rowdata = row.get('rowdata')
                if index == 0:
                    name_list = rowdata[1:]
                else:
                    for i, name in enumerate(name_list):
                        if len(rowdata[0]) == 0:
                            continue
                        dt = getDatetimeByStr(rowdata[0])
                        val = rowdata[i+1]
                        bNum = True
                        try:
                            val = float(val)
                        except Exception as e:
                            val = 0.0
                        pointSet.add(name)
                        if minDatetime == None:
                            minDatetime = dt
                        if maxDatetime == None:
                            maxDatetime = dt
                        if dt < minDatetime:
                            minDatetime = dt
                        if dt > maxDatetime:
                            maxDatetime = dt
                        record.append((dt, name, val))
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        result = {'error':'read csv failed'}
    finally:
        if fp != None:
            fp.close()
    return result, record, list(pointSet), (minDatetime, maxDatetime)

def isDataInvalid(itemData):
    length = len(itemData)
    if (len(itemData) == 0) or (len(itemData) == 1):
        return True
    for item in itemData:
        if ('*' in item) or ('End of Report' in item) or isStrInRowData('Time Interval', item)\
                or isStrInRowData('Date Range', item) or isStrInRowData('Report Timings', item):
            return True
    return False

def checkUploadFile(fileFullPath):
    assert(len(fileFullPath) > 0)
    assert(os.path.exists(fileFullPath))

    record = []
    pointList = []
    timeSpan = []
    result = {'error':'successful'}
    fileName = os.path.basename(fileFullPath)
    fileExtent = fileName.split('.')[-1]
    if fileExtent.lower() == 'csv':
        resCSV, recCSV, pointList, timeSpan = readCSV(fileFullPath)
        if resCSV.get('error') != 'successful':
            result = {'error':'read csv failed'}
        else:
            record = recCSV
    else:
        resEXCEL, recEXCEL, pointList, timeSpan = readEXCEL(fileFullPath)
        if resEXCEL.get('error') != 'successful':
            result = {'error':'read excel failed'}
        else:
            record = recEXCEL
    return result, record, pointList, timeSpan

def getDatetimeByStr(strDatetime):
    strDatetime = str(strDatetime)

    result = None
    nYear = 0
    nMonth = 0
    nDay = 0
    nHour = 0
    nMinute = 0
    nSecond = 0

    dateList = []
    timeList = []
    isPM = False
    itemList = strDatetime.split(' ')
    if strDatetime not in itemList:
        for item in itemList:
            if isDigitalInStr(item):
                if '/' in item:
                    dateList = item.split('/')
                elif '-' in item:
                    dateList = item.split('-')
                elif ':' in item:
                    timeList = item.split(':')
                else:
                    if 'pm' == item.lower():
                        isPM = True
        if len(dateList) == 3:
            nYear = int(dateList[2])
            bGreaterThan1000 = False
            for index, kk in enumerate(dateList):
                if index % 2 != 1:
                    if int(kk) > 1000:
                        bGreaterThan1000 = True
                        break
            if not bGreaterThan1000:
                if nYear>0 and nYear<100:
                    dn = datetime.now()
                    nYear += dn.year//100*100
            try:
                nMonth = int(dateList[1])
            except Exception as e:
                for i,m in enumerate(g_month_name_list):
                    if m.lower() == str(dateList[1]).lower():
                        nMonth = i + 1
                        break
            nDay = int(dateList[0])
            if nDay > 1000:
                nYear, nDay = nDay, nYear
            if nMonth > 12:
                nMonth, nDay = nDay, nMonth
        if len(timeList) == 3:
            nHour = int(timeList[0])
            nMinute = int(timeList[1])
            try:
                nSecond = int(timeList[2])
            except Exception as e:
                if 'pm' in str(timeList[2]).lower():
                    isPM = True
                nSecond = int(removeABCFromStr(str(timeList[2])))
        if len(timeList) == 2:
            nHour = int(timeList[0])
            nMinute = int(timeList[1])
        if isPM and nHour>=1 and nHour<=11:
            nHour += 12
        if (not isPM) and nHour==12:
            nHour -= 12
        try:
            result = datetime(year=nYear, month=nMonth, day=nDay, hour=nHour, minute=nMinute, second=nSecond)
        except Exception as e:
            result = None
            logging.error(e.__str__())
    return result

def isDigitalInStr(str):
    rt = False
    for i in str:
        if i.isdigit():
            rt = True
    return rt

def removeABCFromStr(str):
    rt = ''
    for i in str:
        if i.isdigit():
            rt += i
    return rt

def effect_num(d,n):
    import math
    if isinstance(d, float) and math.isnan(d):
        d = 0
    i = int(d)
    t = d - i
    try:
        n = n + int(numpy.log10(1.0/abs(t)))
    except:
        return i
    rt = round(d,n)
    return rt

def getValueByPointName(pointname, importDataList):
    assert(isinstance(pointname, str))
    result = 0.0
    if len(importDataList) > 0:
        for item in importDataList:
            if len(item) == 3:
                if pointname == item[1]:
                    try:
                        result = float(item[2])
                    except Exception as e:
                        result = str(item[2])
                    break
    return result

def getweatherinfo(projId):
    rt = None
    try:
        update_permit = RedisManager.get_weather_updatetime_by_pid(projId)
        if update_permit is not None or isinstance(update_permit, int) or isinstance(update_permit, float):
            if time() - update_permit <= 60*60*1:
                rt = RedisManager.get_weather_info_by_pid(projId)
        else:
            RedisManager.set_weather_updatetime_by_pid(projId, 0)
    except Exception as e:
        print('getweatherinfo error:' + e.__str__())
        logging.error('getweatherinfo error:' + e.__str__())
    return rt

def get_weather_info_by_cityname(city):
    rt = None
    try:
        memkey = 'weatherinfo' + str(city)
        update_permit = RedisManager.get_weather_updatetime_by_cityname(city)
        if update_permit is not None or isinstance(update_permit, int) or isinstance(update_permit, float):
            if time() - update_permit <= 60*60*1:
                rt = RedisManager.get_weather_info_by_cityname(city)
        else:
            RedisManager.set_weather_updatetime_by_cityname(city, 0)
    except Exception as e:
        print('get_weather_info_by_cityname error:' + e.__str__())
        logging.error('get_weather_info_by_cityname error:' + e.__str__())
    return rt

def updateweatherinfo(projId, info):
    rt = False
    try:
        if RedisManager.set_weather_info_by_pid(projId, info):
            RedisManager.set_weather_updatetime_by_pid(projId, time())
            rt = True
    except Exception as e:
        print('updateweatherinfo error:' + e.__str__())
        logging.error('updateweatherinfo error:' + e.__str__())
    return rt

def update_weather_info_by_cityname(city, info):
    rt = False
    try:
        if RedisManager.set_weather_info_by_cityname(city, info):
            RedisManager.set_weather_updatetime_by_cityname(city, time())
            rt = True
    except Exception as e:
        print('update_weather_info_by_cityname error:' + e.__str__())
        logging.error('update_weather_info_by_cityname error:' + e.__str__())
    return rt

#def checkPassword(userName, pwd, oldPwd=''):
#    try:
#        userName = str(userName)
#        pwd = str(pwd)
#        oldPwd = str(oldPwd)
#        pwdLen = len(pwd)
#        if pwdLen < 8:
#            return 1101
#
#        bHasAlpha = False
#        bHasNoAlpha = False
#        dictChar = {}
#
#        for i in range(pwdLen):
#            if pwd[i].isalpha():
#                bHasAlpha = True
#            else:
#                bHasNoAlpha = True
#            if dictChar.get(pwd[i]) is None:
#                dictChar[pwd[i]] = 1
#            else:
#                dictChar[pwd[i]] += 1
#
#        if not bHasAlpha or not bHasNoAlpha:
#            return 1102
#
#        # if pwd[0].isdigit() or pwd[pwdLen-1].isdigit():
#        if pwd[0].isdigit():
#            return 1103
#
#        for key in dictChar:
#            if dictChar[key] > 2:
#                temp = key + key + key
#                if pwd.find(temp) != -1:
#                    return 1104
#
#        if len(userName) > 0:
#            if pwd.find(userName) >= 0:
#                return 1106
#
#        # if len(oldPwd) > 0:
#        #     i = 0
#        #     while i < pwdLen - 3:
#        #         if oldPwd.find(pwd[i:i+4]) != -1:
#        #             return 1105
#        #         i += 1
#    except Exception as e:
#        print('checkPassword error:' + e.__str__())
#        logging.error('checkPassword error:' + e.__str__())
#
#    return 0

def checkPassword(userName, pwd, oldPwd=''):
    try:
        pwd = str(pwd)
        pwdLen = len(pwd)
        if pwdLen < 8:
            return 1101

        bHasAlpha = False
        bHasDigit = False
        for i in range(pwdLen):
            if pwd[i].isalpha():
                bHasAlpha = True
            if pwd[i].isdigit():
                bHasDigit = True

        if not bHasAlpha or not bHasDigit:
            return 1107
    except Exception as e:
        print('checkPassword error:' + e.__str__())
        logging.error('checkPassword error:' + e.__str__())

    return 0

class ExcelFile:

    def __init__(self, *headers):
        self.headers = headers
        self.data = tablib.Dataset(headers = headers)

    def append_row(self, row):
        return self.data.append(row)
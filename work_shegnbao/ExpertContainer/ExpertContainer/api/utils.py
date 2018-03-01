﻿# -*- encoding=utf-8 -*-
__author__ = 'yan'
import os, sys, imp, time, inspect, re, glob
import pdfkit
from flask import render_template, current_app
from datetime import datetime, timedelta, date
import calendar as cal
from subprocess import Popen, PIPE

from ExpertContainer.api.globalMapping import mapping_list
from ExpertContainer.api.LogOperator import LogOperator
import pika
from ExpertContainer import app
import logging
import json
import paho.mqtt.client as mqtt
import zipfile


interval_map = {'m1':60,'m5':300,'h1':3600,'d1':86400}
alarm_interval = {1:1,2:4,3:8,4:24}#间隔单位 小时
standard_time_format = '%Y-%m-%d %H:%M:%S'
mem_module_format = {}
_logger = LogOperator()

class SysMsgType:
    REGISTER = 0 #注册网站消息
    FAULT=1 #诊断通知
    ALARM=2 #报警通知
    WEBREPORT=3 #web报表通知
    WORKORDER=4 #工单通知


class SysMsgWayType:
    EMAIL = 0 #发邮件
    SMS = 1 #发短信
    APP = 2 #发app推送
    WEB = 3 #发网站消息

class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)


def is_file(path):
    return os.path.isfile(path)

def get_current_directory():
    if sys.path:
        work_path = sys.path[0]
        return work_path
    return ''

def get_sys_path_list():
    return sys.path

def add_path_to_sys(path):
    if path not in sys.path:
        sys.path.append(path)

def add_dir_to_path(path, dir_name):
    return path + "/" + dir_name

def get_dir_by_path(path):
    return os.listdir(path)

def get_full_dir_by_path(path):
    l = os.listdir(path)
    return [path+'/'+x for x in l]

def load_module_dynamic(module_name, path):
    find_result = imp.find_module(module_name, [path,])
    return imp.load_module(module_name, find_result[0], find_result[1], find_result[2])

def get_current_func_name():
    return inspect.stack()[1][3]

def get_file_modify_time(path):
    mt = None
    try:
        if os.path.isfile(path):
            statinfo = os.stat(path)
            lt = time.localtime(statinfo.st_mtime)
            mt = datetime(year=lt.tm_year, month=lt.tm_mon, day=lt.tm_mday, hour=lt.tm_hour, minute=lt.tm_min, second=lt.tm_sec)
    except Exception as e:
        pass
    return mt

def get_file_name(fullPath):
    return os.path.basename(fullPath)

def get_timeformat_by_act_time(actTime):
    timeformat = 'm1'
    actTime = actTime.replace(second=0)
    actTimeStr = actTime.strftime(standard_time_format)
    if actTime.minute == 0:
        if actTime.hour == 0:
            timeformat = 'd1'
        else:
            timeformat = 'h1'
    else:
        if actTime.minute%5 == 0:
            timeformat = 'm5'
    return timeformat, actTimeStr

def get_time_previoushour_start(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmObj = tmObj - timedelta(hours=1)
            tmObj = tmObj.replace(minute=0, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_time_thishour_start(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmObj = tmObj.replace(minute=0, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_time_previousday_start(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmObj = tmObj - timedelta(days=1)
            tmObj = tmObj.replace(hour=0, minute=0, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_time_thisday_start(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmObj = tmObj.replace(hour=0, minute=0, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_time_previousweek_start(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmObj = tmObj - timedelta(days=7)
            tmFind = tmObj
            while(True):
                if tmFind.isoweekday() == 1:
                    tmObj = tmFind
                    break
                tmFind -= timedelta(days=1)
            tmObj = tmObj.replace(hour=0, minute=0, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_time_thisyear_start(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmObj = tmObj.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr


def get_time_thisweek_start(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmFind = tmObj
            while(True):
                if tmFind.isoweekday() == 1:
                    tmObj = tmFind
                    break
                tmFind -= timedelta(days=1)
            tmObj = tmObj.replace(hour=0, minute=0, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_time_thisweek_end(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmFind = tmObj
            while(True):
                if tmFind.isoweekday() == 7:
                    tmObj = tmFind
                    break
                tmFind += timedelta(days=1)
            tmObj = tmObj.replace(hour=23, minute=59, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_time_previousmonth_start(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            mon = tmObj.month
            yea = tmObj.year
            if mon > 1:
                mon -= 1
            else:
                mon = 12
                yea -= 1
            tmObj = datetime(year=yea, month=mon, day=1, hour=0, minute=0, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_time_thismonth_start(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmObj = tmObj.replace(day=1, hour=0, minute=0, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_time_thismonth_end(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            intY=tmObj.year
            intM=tmObj.month
            intD=cal.monthrange(intY, intM)[1]
            tmObj = tmObj.replace(day=intD,hour=23, minute=59, second=0, microsecond = 0)
            tmStr = tmObj.strftime(standard_time_format)
    except:
        pass
    return tmObj, tmStr

def get_path_by_format(format):
    try:
        if format in ['m1','m5','h1','d1']:
            cur_dir = get_current_directory()
            cur_dir += '/experts/'+format
            return cur_dir
    except:
        pass
    return None

def get_onlinetest_path():
    try:
        cur_dir = get_current_directory()
        cur_dir += '/calctemp/calcpointOnlinetest'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        return cur_dir
    except:
        pass
    return None

def get_diagnosistest_path():
    try:
        cur_dir = get_current_directory()
        cur_dir += '/diagnosistemp'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        cur_dir += '/diagnosistest'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        return cur_dir
    except:
        pass
    return None

def get_strategy_file_path():
    try:
        cur_dir = get_current_directory()
        cur_dir += '/strategy_execute_file'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        return cur_dir
    except:
        pass
    return None

def get_temp_path():
    try:
        cur_dir = get_current_directory()
        cur_dir += '/calctemp/temp'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        return cur_dir
    except:
        pass
    return None

def get_repairhistory_path():
    try:
        cur_dir = get_current_directory()
        cur_dir += '/calctemp'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        cur_dir += '/repairhistory'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        return cur_dir
    except:
        pass
    return None

def get_diagnosis_path(format):
    try:
        cur_dir = get_current_directory()
        cur_dir += '/diagnosistemp/diagnosis'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        cur_dir += '/%s'%(format,)
        return cur_dir
    except:
        pass
    return None

def get_calcpoint_path_real(format):
    try:
        cur_dir = get_current_directory()
        cur_dir += '/calctemp/calcpointReal'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        cur_dir += '/%s'%(format,)
        return cur_dir
    except:
        pass
    return None

def get_diagnosis_path_real():
    try:
        cur_dir = get_current_directory()
        cur_dir += '/diagnosistemp'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        cur_dir += '/real'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        return cur_dir
    except:
        pass
    return None

def get_calcpoint_path(format):
    try:
        cur_dir = get_current_directory()
        cur_dir += '/calctemp/calcpoint'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        cur_dir += '/%s'%(format,)
        return cur_dir
    except:
        pass
    return None

def get_calcpoint_output_path():
    try:
        cur_dir = get_current_directory()
        cur_dir += '/calctemp/calcpoint_output'
        if not os.path.exists(cur_dir):
            os.mkdir(cur_dir)
        return cur_dir
    except:
        pass
    return None

def add_projId_to_api_func(content, project_id):
    output = ""
    try:
        if content:
            match_l = []
            matched_list = re.findall(r"'''(.+?)'''", content, re.S)
            for m in matched_list:
                match_l.extend(m.splitlines())
            lineList = content.splitlines()
            for l in lineList:
                l += '\n'
                temp_l = l.replace('"', "'")
                matched = True
                for item in mapping_list:
                    if item.get('add_id') == 1:
                        name = item.get('name')
                        name = name.strip()
                        bFunctionInWord = (name+"(" in temp_l) or (name+" (" in temp_l)
                        if bFunctionInWord:
                            q = re.findall(name+"\([ ]*['\[A-Za-z]", temp_l)
                            matched = True if l[:-1] not in match_l else False
                            if q and matched:
                                for item in q:
                                    temp = item.replace(name+'(', name+'(%s,'%(project_id))
                                    temp_l = temp_l.replace(item, temp)
                # 此处为马逸平的代码， 不替换里头的引号
                output += temp_l if matched else l
    except:
        pass
    return output

def add_self_to_api_func(content):
    output = ""
    try:
        if content:
            match_l = []
            matched_list = re.findall(r"'''(.+?)'''", content, re.S)
            for m in matched_list:
                match_l.extend(m.splitlines())
            lineList = content.splitlines()
            for l in lineList:
                l += '\n'
                temp_l = l.replace('"', "'")
                matched = True
                for item in mapping_list:
                    name = item.get('name')
                    name = name.strip()
                    bFunctionInWord = (name+"(" in temp_l) or (name+" (" in temp_l)
                    matched = True if l[:-1] not in match_l else False
                    if bFunctionInWord and 'self.'+name not in temp_l and matched:
                        temp_l = temp_l.replace(name, 'self.'+name)
                output += temp_l if matched else l
    except:
        pass
    return output

def process_main_func(content):
    output = ""
    content_list=[]
    try:
        if content:
            def_list = get_def_list(content)
            pos_list = []
            content_list = []
            for def_content in def_list:
                pos = content.find(def_content)
                pos_list.append(pos)
            for i in range(len(pos_list)):
                start = pos_list[i]
                if i == len(pos_list) - 1:
                    content_list.append(content[start:])
                else:
                    content_list.append(content[start:pos_list[i+1]])
            for c in content_list:
                content = content.replace(c, "")
            if "def" in content and "main():" in content:
                output = content
            else:
                output = "def main():\n"
                lineList = content.splitlines()
                for l in lineList:
                    space4 = "    "
                    l = space4+l+"\n"
                    output += l
        else:#空的计算代码
            output = "def main():\n"
            output+= " "*4 + "return None"

    except:
        pass
    return output, content_list

def is_point_group_a(content):
    rt = True
    try:
        if content:
            lineList = content.splitlines()
            for l in lineList:
                for item in mapping_list:
                    if item.get('add_id') == 1:
                        name = item.get('name')
                        if name in l:
                            return False
    except:
        pass
    return rt

def process_return_func(content):
    output = ""
    try:
        if content:
            lineList = content.splitlines()
            if len(lineList) == 1:
                if "return" in lineList[0]:
                    output = lineList[0] + '\n'
                else:
                    output = "return " + lineList[0] + '\n'
            else:
                output = content
    except:
        pass
    return output

def process_exception_debug(content, def_list, project_id,point_name='',type=''):
    output = ""
    try:
        if content:
            lineList = content.splitlines()
            for l in lineList:
                if "main():" in l and "\"def main()" not in l and "'def main()" not in l:
                    output += l+"\n"
                    output += "    try:\n"
                else:
                    if "#python" not in l:
                        if l.startswith("import") or l.startswith("from"):
                            output += l+"\n"
                        else:
                            output += "    "+l+"\n"
            output += "    except Exception as e:\n"
            if type=='diag':
                output += "        errorLog.writeLog(%d"%(project_id,)+",'"+point_name+":'+e.__str__(),True,'"+point_name+"','"+type+"')\n"
            else:
                output += "        errorLog.writeLog(%d"%(project_id,)+",'"+point_name+":'+e.__str__(),True,'"+point_name+"')\n"
            output += "        self.log_str('%s'%(e.__str__(),))\n"
            output += "        return None, e.__str__()\n"
            if def_list:
                for c in def_list:
                    output += c + '\n'
    except:
        pass
    return output

def process_exception(content, def_list, project_id,point_name=''):
    output = ""
    try:
        if content:
            lineList = content.splitlines()
            for l in lineList:
                if "main():" in l:
                    output += l+"\n"
                    output += "    try:\n"
                else:
                    if "#python" not in l:
                        if l.startswith("import") or l.startswith("from"):
                            output += l+"\n"
                        else:
                            output += "    "+l+"\n"
            output += "    except Exception as e:\n"
            output += "        errorLog.writeLog(%d"%(project_id,)+",'"+point_name+":'+e.__str__(),True,'"+point_name+"')\n"
            output += "        return None\n"
            if def_list:
                for c in def_list:
                    output += c + '\n'
    except:
        pass
    return output

def process_exception_strategy(content, def_list):
    output = ""
    try:
        if content:
            lineList = content.splitlines()
            for l in lineList:
                if "main():" in l:
                    output += l+"\n"
                    output += "    try:\n"
                else:
                    if "#python" not in l:
                        if l.startswith("import") or l.startswith("from"):
                            output += l+"\n"
                        else:
                            output += "    "+l+"\n"
            output += "    except Exception as e:\n"
            output += "        _logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)\n"
            output += "        return {'msg':e.__str__(), 'error':1}\n"
            if def_list:
                for c in def_list:
                    output += c + '\n'
    except:
        pass
    return output

def add_head(full_path, project_id):
    try:
        f_content = '# -*- encoding=utf-8 -*-\n'
        f_content += 'from ExpertContainer.logic.LogicBase import *\n'
        f_content += 'from ExpertContainer.api.ArchiveManager import ArchiveManager\n'
        f_content += 'from ExpertContainer.api.globalMapping import *\n'
        f_content += 'from ExpertContainer.api.cacheProfile import DataManager\n'
        f_content += 'from ExpertContainer.api.errorLog import errorLog\n'
        f_content += '_logger = LogOperator()\n\n'
        f_content += 'class LogicAct(LogicBase):\n\n'
        f_content += '    def actlogic(self):\n'
        f_content += '        rt = None\n'
        f_content += '        try:\n'
        f_content += '            rt = self.action()\n'
        f_content += '        except Exception as e:\n'
        f_content += "            errorLog.writeLog(%d"%(project_id,)+",'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)\n"
        f_content += '            rt = None\n\n'
        f_content += '        return rt\n\n'
        with open(file=full_path, mode="w", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except:
        pass
    return False

def add_head_strategy(full_path):
    try:
        f_content = '# -*- encoding=utf-8 -*-\n'
        f_content += 'from ExpertContainer.logic.StrategyBase import *\n'
        f_content += 'from ExpertContainer.api.ArchiveManager import ArchiveManager\n'
        f_content += 'from ExpertContainer.api.globalMapping import *\n'
        f_content += 'from ExpertContainer.api.cacheProfile import DataManager\n'
        f_content += 'from ExpertContainer.api.LogOperator import LogOperatorStrategy\n'
        f_content += '_logger = LogOperatorStrategy()\n\n'
        f_content += 'class LogicAct(StrategyBase):\n\n'
        f_content += '    def actlogic(self):\n'
        f_content += '        rt = None\n'
        f_content += '        try:\n'
        f_content += '            rt = self.action()\n'
        f_content += '        except Exception as e:\n'
        f_content += "            _logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)\n"
        f_content += '            rt = None\n'
        f_content += '        return rt\n\n'
        with open(file=full_path, mode="w", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except:
        pass
    return False

def add_head_repairhistory(full_path, project_id):
    try:
        f_content = '# -*- encoding=utf-8 -*-\n'
        f_content += 'from ExpertContainer.logic.LogicBase import *\n'
        f_content += 'from ExpertContainer.api.ArchiveManager import ArchiveManager\n'
        f_content += 'from ExpertContainer.api.globalMapping import *\n'
        f_content += 'from ExpertContainer.api.errorLog import errorLog\n'
        f_content += '\n\n'
        f_content += '_logger = LogOperator()\n'
        f_content += 'class LogicAct(LogicBase):\n\n'
        f_content += '    def actlogic(self):\n'
        f_content += '        rt = None\n'
        f_content += '        try:\n'
        f_content += '            rt = self.action()\n'
        f_content += '        except Exception as e:\n'
        f_content += "            errorLog.writeLog(%d"%(project_id,)+",'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)\n"
        f_content += '            rt = None\n\n'
        f_content += '        return rt\n\n'
        with open(file=full_path, mode="w", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except:
        pass
    return False

def add_body(full_path, project_id, content, module_name,type=''):
    try:
        f_content = " "*4 + "def %s(self):\n"%(module_name,)
        content = process_return_func(content)
        content, def_list = process_main_func(content)
        if type=='diag':
            content = process_exception_debug(content, def_list, project_id, module_name,type)#process_exception(content, def_list, project_id,module_name)
        else:
            content = process_exception_debug(content, def_list, project_id, module_name) 
        content = add_projId_to_api_func(content, project_id)
        content = add_self_to_api_func(content)
        lineList = content.splitlines()
        for line in lineList:
            if ('os.' in line) or ('sys.' in line) or ('import os' in line) or ('import sys' in line):
                return False
                #raise Exception('system operation is not allowed')
            line = " "*8 + line + "\n"
            f_content += line
        f_content += " "*8 + "return main()\n\n"
        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except Exception as e:
        raise Exception(e)
    return False

def add_body_strategy(full_path, content, module_name, project_id):
    try:
        f_content = " "*4 + "def %s(self):\n"%(module_name,)
        content = process_return_func(content)
        content, def_list = process_main_func(content)
        content = process_exception_strategy(content, def_list)#process_exception(content, def_list, project_id,module_name)
        content = add_projId_to_api_func(content, project_id)
        content = add_self_to_api_func(content)
        lineList = content.splitlines()
        for line in lineList:
            if ('os.' in line) or ('sys.' in line) or ('import os' in line) or ('import sys' in line):
                return False
                #raise Exception('system operation is not allowed')
            line = " "*8 + line + "\n"
            f_content += line
        f_content += " "*8 + "return main()\n\n"
        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except Exception as e:
        raise Exception(e)
    return False

def add_body_run(full_path, project_id, content, module_name):
    try:
        f_content = " "*4 + "def %s(self):\n"%(module_name,)
        content = process_return_func(content)
        content, def_list = process_main_func(content)
        content = process_exception(content, def_list, project_id,module_name)
        content = add_projId_to_api_func(content, project_id)
        content = add_self_to_api_func(content)
        lineList = content.splitlines()
        for line in lineList:
            if ('os.' in line) or ('sys.' in line) or ('import os' in line) or ('import sys' in line):
                raise Exception('system operation is not allowed')
            line = " "*8 + line + "\n"
            f_content += line
        f_content += " "*8 + "return main()\n\n"
        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except Exception as e:
        raise Exception(e)
    return False

def add_body_onlinetest(full_path, project_id, content, module_name):
    try:
        f_content = " "*4 + "def %s(self):\n"%(module_name,)
        content = process_return_func(content)
        content, def_list = process_main_func(content)
        content = process_exception_debug(content, def_list, project_id)
        content = add_projId_to_api_func(content, project_id)
        content = add_self_to_api_func(content)
        lineList = content.splitlines()
        for line in lineList:
            if ('os.' in line) or ('sys.' in line) or ('import os' in line) or ('import sys' in line):
                raise Exception('system operation is not allowed')
            line = " "*8 + line + "\n"
            f_content += line
        f_content += " "*8 + "return main()\n\n"
        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except Exception as e:
        raise Exception(e)
    return False

def add_action2(full_path, project_id, point_list, rely_dict):
    try:
        f_content = " "*4 + "def action(self):\n"
        f_content += " "*8 + "rt = None\n"
        f_content += " "*8 + "name_list = []\n"
        f_content += " "*8 + "value_list = []\n"
        f_content += " "*8 + "try:\n"

        for key in point_list:
            f_content += " "*12 + "tStart = time.time()\n"
            f_content += " "*12 + "self.curCalName = '%s'\n"%(key,)
            f_content += " "*12 + "temp = self.%s()\n"%(key,)
            f_content += " "*12 + "if temp is None:\n"
            f_content += " "*16 + "temp = 'None'\n"
            f_content += " "*12 + "name_list.append('%s')\n"%(key,)
            f_content += " "*12 + "value_list.append(temp[0] if isinstance(temp,tuple) else temp)\n"
            f_content += " "*12 + "self.cacheManager.write_cache( self.get_act_time()." \
                             "strftime(standard_time_format), '%s', temp)\n"%( key, )
            f_content += " "*12 + "tCostSeconds = time.time()-tStart\n"
            f_content += " "*12 + "if tCostSeconds>2.0:\n"
            f_content += " "*16 + "errorLog.writeLog(%d"%(project_id,)+",'%s in %s cost seconds:%.1f'%(self.curCalName, __name__[__name__.rfind('/')+1:], tCostSeconds),True)\n"
        f_content += " "*12 + "if name_list and value_list:\n"
        f_content += " "*16 + "tStart = time.time()\n"
        f_content += " "*16 + "tCostList = []\n"
        f_content += " "*16 + "self.set_data_calcpoint(%d, name_list, value_list)\n"%(project_id,)
        f_content += " "*16 + "self.alarm_data_realvalues(%d)\n"%(project_id,)
        f_content += " "*16 + "if len(tCostList)>0:\n"
        f_content += " "*20 + "errorLog.writeLog(%d"%(project_id,)+",'log save data and alarm cost seconds:%s'%(str(tCostList)),True)\n"

        f_content += " "*8 + "except Exception as e:\n"
        f_content += " "*12 + "errorLog.writeLog(%d"%(project_id,)+",'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)\n"
        f_content += " "*12 + "rt = False\n"
        f_content += " "*8 + "return rt\n\n"

        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except:
        pass
    return False


def add_action_output2(full_path, project_id, point_list, rely_dict):
    try:
        f_content = " "*4 + "def action(self):\n"
        f_content += " "*8 + "name_list = []\n"
        f_content += " "*8 + "value_list = []\n"
        f_content += " "*8 + "try:\n"
        for key in point_list:
            f_content += " "*12 + "self.curCalName = '%s'\n"%(key,)
            f_content += " "*12 + "temp = self.%s()\n"%(key,)
            f_content += " "*12 + "name_list.append('%s')\n"%(key,)
            f_content += " "*12 + "value_list.append(temp[0] if isinstance(temp,tuple) else temp)\n"
            f_content += " "*12 + "self.cacheManager.write_cache( self.get_act_time()." \
                         "strftime(standard_time_format), '%s', temp)\n"%( key, )

        f_content += " "*12 + "if name_list and value_list:\n"
        f_content += " "*16 + "self.set_data_calcpoint(%d, name_list, value_list)\n"%(project_id,)

        f_content += " "*8 + "except Exception as e:\n"
        f_content += " "*12 + "errorLog.writeLog(%d"%(project_id,)+",'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)\n"
        f_content += " "*8 + "return name_list, value_list\n\n"
        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except:
        pass
    return False

def add_action_diagnosis(full_path, project_id, rely_dict):
    try:
        func_set = set()
        f_content = " "*4 + "def action(self):\n"
        f_content += " "*8 + "rt = True\n"
        f_content += " "*8 + "try:\n"
        f_content += " "*12 + "name_list=[]\n"
        f_content += " "*12 + "value_list=[]\n"
        f_content += " "*12 + "timeCost_list=[]\n"
        f_content += " "*12 + "timeAct_list=[]\n"
        for key in rely_dict:
            arr = rely_dict.get(key, [])
            f_content += " "*12 + "tStart = time.time()\n"
            f_content += " "*12 + "tTimeAct = datetime.now()\n"
            f_content += " "*12 + "self.curCalName = '%s'\n"%(key,)
            f_content += " "*12 + "_logger.writeLog(self.curCalName + ' start', True)\n"
            f_content += " "*12 + "temp = self.%s()\n"%(key,)
            f_content += " "*12 + "if isinstance(temp, tuple):\n"
            f_content += " "*16 + "self.log_str(temp[1])\n"
            f_content += " "*12 + "name_list.append('%s')\n"%(key,)
            f_content += " "*12 + "value_list.append(temp[0] if isinstance(temp,tuple) else temp)\n"
            f_content += " "*12 + "timeCost_list.append(round(time.time()-tStart,1))\n"
            f_content += " "*12 + "timeAct_list.append(tTimeAct)\n"

        f_content += " "*12 + "if name_list and value_list:\n"
        f_content += " "*16 + "self.save_fault_result(%d, name_list, value_list, timeAct_list, timeCost_list)\n"%(project_id,)
        f_content += " "*8 + "except Exception as e:\n"
        f_content += " "*12 + "errorLog.writeLog(%d"%(project_id,)+",'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)\n"
        f_content += " "*12 + "self.log_str('%s'%(e.__str__(),))\n"
        f_content += " "*12 + "rt = False\n"
        f_content += " "*8 + "return rt, self.debugInfo\n\n"

        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except:
        pass
    return False

def add_action_diagnosis2(full_path, project_id, point_list, rely_dict):
    try:
        f_content = " "*4 + "def action(self):\n"
        f_content += " "*8 + "rt = True\n"
        f_content += " "*8 + "try:\n"
        f_content += " "*12 + "name_list=[]\n"
        f_content += " "*12 + "value_list=[]\n"
        f_content += " "*12 + "timeAct_list=[]\n"
        f_content += " "*12 + "timeCost_list=[]\n"
        for key in point_list:
            arr = rely_dict.get(key, [])
            f_content += " "*12 + "tStart = time.time()\n"
            f_content += " "*12 + "tTimeAct = datetime.now()\n"
            f_content += " "*12 + "self.curCalName = '%s'\n"%(key,)
            f_content += " "*12 + "temp = self.%s()\n"%(key,)
            f_content += " "*12 + "if isinstance(temp, tuple):\n"
            f_content += " "*16 + "self.log_str(temp[1])\n"
            f_content += " "*12 + "name_list.append('%s')\n"%(key,)
            f_content += " "*12 + "value_list.append(temp[0] if isinstance(temp,tuple) else temp)\n"
            f_content += " "*12 + "timeCost_list.append(round(time.time()-tStart,1))\n"
            f_content += " "*12 + "timeAct_list.append(tTimeAct)\n"
        f_content += " "*12 + "if name_list and value_list:\n"
        f_content += " "*16 + "self.save_fault_result(%d, name_list, value_list,timeAct_list, timeCost_list)\n"%(project_id,)
        f_content += " "*8 + "except Exception as e:\n"
        f_content += " "*12 + "errorLog.writeLog(%d"%(project_id,)+",'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)\n"
        f_content += " "*12 + "self.log_str('%s'%(e.__str__(),))\n"
        f_content += " "*12 + "rt = False\n"
        f_content += " "*8 + "return rt, self.debugInfo\n\n"

        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except Exception as e:
        print(e)
    return False

def add_action_strategy(full_path, point_list):
    try:
        f_content = " "*4 + "def action(self):\n"
        f_content += " "*8 + "rt = True\n"
        f_content += " "*8 + "try:\n"
        for key in point_list:
            f_content += " "*12 + "rt = self.%s()\n"%(key,)
        f_content += " "*8 + "except Exception as e:\n"
        f_content += " "*12 + "_logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)\n"
        f_content += " "*12 + "rt = {'msg':e.__str__(), 'error':1}\n"
        f_content += " "*8 + "return rt\n"

        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except Exception as e:
        print(e)
    return False

def add_action_repairhistory_batch(full_path, str_obid, project_id, point_list, rely_dict):
    try:
        f_content = " "*4 + "def action(self):\n"
        f_content += " "*8 + "rt = None\n"
        f_content += " "*8 + "name_list = []\n"
        f_content += " "*8 + "value_list = []\n"
        f_content += " "*8 + "try:\n"
        for key in point_list:
            f_content += " "*12 + "self.curCalName = '%s'\n"%(key,)
            f_content += " "*12 + "temp = self.%s()\n"%(key,)
            f_content += " "*12 + "name_list.append('%s')\n"%(key,)
            f_content += " "*12 + "value_list.append(temp[0] if isinstance(temp,tuple) else temp)\n"
            f_content += " "*12 + "self.cacheManager.write_cache( self.get_act_time()." \
                         "strftime(standard_time_format), '%s', temp)\n"%( key, )
        f_content += " "*12 + "if name_list and value_list:\n"
        f_content += " "*16 + "self.set_data_calcpoint(%d, name_list, value_list)\n"%(project_id,)
        f_content += " "*8 + "except Exception as e:\n"
        f_content += " "*12 + "errorLog.writeLog(%d"%(project_id,)+",'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)\n"
        f_content += " "*12 + "rt = False\n"
        f_content += " "*8 + "return rt\n\n"

        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except:
        pass
    return False

def add_action_onlinetest(full_path, project_id, rely_dict):
    try:
        func_set = set()
        f_content = " "*4 + "def action(self):\n"
        f_content += " "*8 + "rt = None\n"
        f_content += " "*8 + "try:\n"
        for key in rely_dict:
            arr = rely_dict.get(key)
            for point in arr:
                if point not in func_set:
                    f_content += " "*12 + "self.curCalName = '%s'\n"%(key,)
                    f_content += " "*12 + "temp = self.%s()\n"%(point,)
                    f_content += " "*12 + "if temp is not None:\n"
                    f_content += " "*16 + "self.set_data_calcpoint(%d, ['%s'], [temp])\n"%(project_id, point)
                    func_set.add(point)
            if key not in func_set:
                f_content += " "*12 + "self.curCalName = '%s'\n"%(key,)
                f_content += " "*12 + "temp = self.%s()\n"%(key,)
                f_content += " "*12 + "if temp is not None:\n"
                f_content += " "*16 + "self.set_data_calcpoint(%d, ['%s'], [temp])\n"%(project_id, key)
                func_set.add(key)
            f_content += " "*12 + "return temp\n"
        f_content += " "*8 + "except Exception as e:\n"
        f_content += " "*12 + "errorLog.writeLog(%d"%(project_id,)+",'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)\n"
        f_content += " "*12 + "rt = False\n"
        f_content += " "*8 + "return rt\n\n"

        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except:
        pass
    return False

def add_action_onlinetest2(full_path, project_id, point_list, rely_dict, point_name):
    try:
        f_content = " "*4 + "def action(self):\n"
        f_content += " "*8 + "rt = None\n"
        #f_content += " "*8 + "debugInfo = []\n"
        f_content += " "*8 + "try:\n"
        for key in point_list:
            f_content += " "*12 + "self.curCalName = '%s'\n"%(key,)
            f_content += " "*12 + "temp = self.%s()\n"%(key,)
            f_content += " "*12 + "if temp is not None and not isinstance(temp, tuple):\n"
            f_content += " "*16 + "rt = temp\n"
            f_content += " "*16 + "self.cacheManager.write_cache( self.get_act_time()." \
                             "strftime(standard_time_format), '%s', temp)\n"%( key, )
            f_content += " "*12 + "elif isinstance(temp, tuple):\n"
            f_content += " "*16 + "rt = None \n"
            f_content += " "*16 + "self.debugInfo.append('ERROR when calculating %s ' + temp[1])\n"%(key)
            if key==point_name:
                f_content += " "*12 + "self.log_str('finally calculate point " +"%s, got result: "%(key,) + "%s'%(str(temp)))\n"
                f_content += " "*12 + "return rt, self.debugInfo\n"
        f_content += " "*8 + "except Exception as e:\n"
        f_content += " "*12 + "errorLog.writeLog(%d"%(project_id,)+",'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)\n"
        f_content += " "*12 + "self.log_str('%s'%(e.__str__(),))\n"
        f_content += " "*12 + "rt = False\n"
        f_content += " "*8 + "return rt, self.debugInfo\n\n"

        with open(file=full_path, mode="a+", encoding='utf-8') as f:
            r = f.write(f_content)
            return True if r>0 else False
    except:
        pass
    return False


def get_count_by_time_range(timeFrom, timeTo, format):
    rt = None
    try:
        if isinstance(timeFrom, str):
            timeFrom = datetime.strptime(timeFrom, standard_time_format)
        if isinstance(timeTo, str):
            timeTo = datetime.strptime(timeTo, standard_time_format)
        assert isinstance(timeFrom, datetime) and isinstance(timeTo, datetime)
        span = (timeTo-timeFrom).total_seconds()
        secs = interval_map.get(format)
        rt = int(span/secs+1)
    except:
        pass
    return rt

def get_timelist_by_time_range(timeFrom, timeTo, format):
    rt = []
    try:
        if isinstance(timeFrom, str):
            timeFrom = datetime.strptime(timeFrom, standard_time_format)
        if isinstance(timeTo, str):
            timeTo = datetime.strptime(timeTo, standard_time_format)
        assert isinstance(timeFrom, datetime) and isinstance(timeTo, datetime)
        secs = interval_map.get(format)
        curtime = timeFrom
        while(curtime <= timeTo):
            rt.append(curtime)
            curtime += timedelta(seconds=secs)
    except:
        pass
    return rt

def get_point_name_list_from_content(content):
    output = set()
    try:
        if content:
            lineList = content.splitlines()
            for l in lineList:
                for i in mapping_list:
                    name = i.get('name')+'('
                    namewithspace = i.get('name')+' ('
                    addid = i.get('add_id')
                    if (name in l or namewithspace in l) and addid:
                        l = l.replace('"', "'")
                        q = re.findall("\'([^\',\[\]\(\)]*)\'",l)
                        for item in q:
                            output.add(item)
    except:
        pass
    return list(output)

def get_def_list(content):
    output = []
    try:
        if content:
            lineList = content.splitlines()
            for l in lineList:
                if l.endswith(":") and "main" not in l and "def" in l:
                    if l not in output:
                        output.append(l)
    except:
        pass
    return output

def point_file_path(point_name, projId, format):
    rt = None
    try:
        full_name = 'calcpoint_%s_%s'%(projId, point_name)
        path = get_path_by_format(format)
        rt = glob.glob("%s/%s.py"%(path, full_name,))
        rt = rt[0] if rt else None
    except:
        pass
    return rt

def get_files_by_format(format):
    rt = None
    try:
        path = get_path_by_format(format)
        rt = glob.glob("%s/*.py"%(path, ))
    except:
        pass
    return rt

def get_calcpoint_files_by_format(format):
    rt = None
    try:
        path = get_calcpoint_path(format)
        rt = glob.glob("%s/*.py"%(path, ))
    except:
        pass
    return rt

def get_diagnosis_files_by_format(format):
    rt = None
    try:
        path = get_diagnosis_path(format)
        rt = glob.glob("%s/*.py"%(path, ))
    except:
        pass
    return rt

def get_point_name_list_from_py(file_path):
    rt = None
    try:
        if os.path.exists(file_path):
            with open(file_path, encoding='utf-8') as f:
                content = f.read()
                p = content.find('def main():')
                rt = content[p:]
    except:
        pass
    return rt


def get_content_from_db(name, db_content):
    try:
        for item in db_content:
            if item.get('name') == name:
                return item.get('content')
    except:
        pass
    return None



def init_module_format():
    try:
        for format in ['m1','m5','h1','d1']:
            path = get_path_by_format(format)
            ret = glob.glob("%s/*.py"%(path,))
            ret = [x[x.rfind('\\')+1:].replace('.py','') for x in ret]
            mem_module_format.update({format:ret})
    except:
        pass

def get_format_by_module_name(module_name):
    rt = None
    try:
        if mem_module_format:
            for format in mem_module_format:
                arr = mem_module_format.get(format, [])
                if module_name in arr:
                    rt = format
                    break
    except:
        pass
    return rt


def get_history_date_of_sum_SomePointName(his):
    import math
    rt=None
    try:
        if his:
            for item in his:
                data=[]
                if 'error' in item:
                    rt = None
                else:
                    v =item.get('name')
                    if 'history' in item:
                        h = item.get('history', [])
                        if h:
                            for i in h:
                                try:
                                    value = i.get('value')
                                    if value == 'NaN' or isinstance(value, float) and math.isnan(value):
                                        value = 0
                                    data.append(float(value))
                                except:
                                    data.append(0.0)
                            rt=sum(data)
                        else:
                            rt = None
    except Exception as e:
        pass
    return rt

def get_history_date_of_max_SomePointName(his):
    rt=None
    try:
        if his:
            for item in his:
                data=[]
                if 'error' in item:
                    rt = None
                else:
                    v =item.get('name')
                    if 'history' in item:
                        h = item.get('history', [])
                        if h:
                            for i in h:
                                try:
                                    data.append(float(i.get('value')))
                                except:
                                    data.append(0.0)
                            rt=max(data)
                        else:
                            rt = None
    except Exception as e:
        pass
    return rt

def get_history_date_of_count_SomePointName(his):
    rt=0
    try:
        if his:
            for item in his:
                data=[]
                if 'error' in item:
                    rt = 0
                else:
                    v =item.get('name')
                    if 'history' in item:
                        h = item.get('history', [])
                        if h:
                            for i in h:
                                try:
                                    data.append(int(float(i.get('value'))))
                                except:
                                    data.append(0)
                            rt=str(data).count('0, 1')
                        else:
                            rt = 0
    except Exception as e:
        pass
    return rt


def get_srv_last_uptime(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            tmObj=tmObj- timedelta(minutes=5)
            tmFind = tmObj
            while(True):
                if tmFind.minute%5==0:
                    break
                tmFind -= timedelta(minutes=1)
            tmObj =tmFind.replace(second=0) 
            tmStr =tmObj.strftime(standard_time_format) 
    except Exception as e:
        pass
    return tmObj, tmStr

def get_srv_last_uptime_A(actTime):
    tmObj = None
    tmStr = None
    try:
        if isinstance(actTime, str):
            tmObj = datetime.strptime(actTime, standard_time_format)
        elif isinstance(actTime, datetime):
            tmObj = actTime
        if isinstance(tmObj, datetime):
            
            tmFind = tmObj
            while(True):
                if tmFind.minute%5==0:
                    break
                tmFind -= timedelta(minutes=1)
            tmObj =tmFind.replace(second=0) 
            tmStr =tmObj.strftime(standard_time_format) 
    except Exception as e:
        pass
    return tmObj, tmStr     

def write_file(projId, strTimeAt, timeFormat, pointList,groupS,t):
    try:
        with open(get_current_directory()+'/%s_test_%s.txt'%(groupS,timeFormat),'a') as f:
            f.write("项目ID=%s , 数据插入时间=%s ,当前时间=%s,点名=%s \n"%(projId,strTimeAt,datetime.now().strftime(standard_time_format),pointList))
    except:
        pass
    

def get_query_day_time_list(start, end, format):
    rt = []
    try:
        delta = None
        if format == 'm1':
            delta = timedelta(minutes=1)
        elif format == 'm5':
            delta = timedelta(minutes=5)
        elif format == 'h1':
            delta = timedelta(hours=1)
        elif format == 'd1':
            delta = timedelta(days=1)
        elif format == 'M1':
            pass
        if delta:
            cur = start
            while cur <= end:
                rt.append(cur.strftime('%Y-%m-%d %H:%M:%S'))
                cur += delta
    except Exception as e:
        pass
    return rt


def getPointNameInLogicFileByLine(strFileName, nLineNo):
    try:
        with open(file=strFileName, encoding='utf-8') as f:
            r = f.readlines()
            if nLineNo >= len(r):
                return None

            nCur = nLineNo
            bFoundPoint = False
            while not bFoundPoint:
                nCur -= 1
                strLineCode = r[nCur]  # found first line like this :def woody(self):
                nFIndex1 = strLineCode.find('def ')
                nFIndex2 = strLineCode.find('(self)')
                if nFIndex1 >= 0 and nFIndex2 >= 0:
                    bFoundPoint = True
                    strPointName = strLineCode[nFIndex1 + 4:nFIndex2]

            return strPointName
    except:
        logging.error('Failed to get point name! strFileName=%s, nLineNo=%s', strFileName, nLineNo)
    return 'Unknown'


def getContentFromFactoryPreview(url, projectId):
    """
    David 20160912
    David 20170511
    python34/Scripts/phantomjs.exe  20160912
    修改到Ubuntu系统下 20170511
    :param pageId:
    :param projectId:
    :return:
    """
    rt = None
    error = None
    try:
        pwd = os.getcwd()
        jspath = pwd + '/servertools/headless.js'
        jspath = os.path.normpath(jspath)
        if (isinstance(url, str)):
            cmd = ['node', jspath, 'http://beop.rnbtech.com.hk/factory/preview/reportWrap/' + url]
            content = Popen(cmd, stdout = PIPE, stderr = PIPE)
            #content.wait(endtime=60)
            #print(content.returncode)
            rt = content.stdout.read().decode()
    except Exception as e:
        error = e.__str__()
    return rt, error

def makeEmailContentbyHTML(content, option, countryConfig, url, isContent=False):
    """
    David 20160912
    :param content:
    :return:
    """
    rt = None
    try:
        if isinstance(content, str):
            if not current_app:
                app_ctx = app.app_context()
                app_ctx.push()
            lang = option.get('lang', 'zh')
            tradeMark = countryConfig.get('tradeMark')
            tradeMark = 'BeOP' if tradeMark is None else tradeMark
            logoFileName = countryConfig.get('logoFileName')
            logoFileName = 'logo_beop.png' if logoFileName is None else logoFileName
            domainName = countryConfig.get('domainName')
            domainName = 'beop.rnbtech.com.hk' if domainName is None else domainName
            url = 'http://%s/factory/preview/reportWrap/%s' % (domainName, url)

            report_data = {'isContent': isContent, 'logo': option.get('logo', logoFileName),
                           'datetime': option.get('time', time.strftime("%Y-%m-%d", time.localtime())),
                           'title': option.get('title', ''), 'company': option.get('project', tradeMark),
                           'name': option.get('title', ''), 'content': content, 'url': url}
            if isContent:
                rt = render_template('email/reportEmail_pdfAttach.html', report = report_data)
            else:
                if lang == 'zh':
                    rt = render_template('email/reportEmail_theme_default.html', report = report_data)
                elif lang == 'en':
                    rt = render_template('email/reportEmail_theme_default_en.html', report = report_data)
        else:
            raise Exception('content is not str')
    except Exception:
        logging.error('Unhandled exception! option=%s, isContent=%s', option, isContent, exc_info=True, stack_info=True)
    return rt


def generatePdfAttachment(html):
    option = {
        'no-outline': '',
        'no-background':'',
        'footer-line':'',
        'header-line':''
    }
    try:
        # if cover_html:
        #     temp_cover_file_path = Utils.get_pdf_cover_temp_path()
        #     with open(temp_cover_file_path, 'w', encoding='utf-8') as f:
        #         f.write(cover_html)
        #     output = pdfkit.from_string(html, False, css=css, cover=temp_cover_file_path)
        #     os.remove(temp_cover_file_path)
        # else:
        output = pdfkit.from_string(html, False, options = option)
        return output
    except Exception as e:
        print('generatePdfAttachment error:' + e.__str__())
        return False



def on_publish(mqttc, obj, mid):
    #_logger.writeLog("MQTT OnPublish, mid: "+str(mid), True)
    print("MQTT OnPublish, mid: "+str(mid))

def sendDataToMQTT( userName, userPwd, topicName, projName, ptInfoList):
    try:
        mqttc = mqtt.Client()
        mqttc.on_publish = on_publish
        #设置用户名与密码
        mqttc.username_pw_set(userName, userPwd)

        #connect(self, host, port=1883, keepalive=60, bind_address="")
        #host 是你的代理的hostname或者IP
        #port 是你的MQTT服务的端口. 默认是 1883.
        #注意，使用SSL/TLS的默认端口是 8883
        #
        bRv = mqttc.connect(app.config['MQ_ADDRESS'], 1883, 60)
        #mqttc.subscribe(topicName, 0)

        jsonMessage={"error":0, "msg":"", "projId":projName, "pointList":ptInfoList}
        strMessage=json.dumps(jsonMessage, ensure_ascii=False)
        """
        publish(topic, payload=None, qos=0, retain=False)
        topic:你的消息将被发送到的所在的主题
        payload:实际的要发送的消息
        qos:设置服务级别。
        retain:if set to True, the message will be set as the “last known good”/retained message for the topic.
        """
        rv = mqttc.publish(topicName,strMessage, 0, False)
        #_logger.writeLog('mqtt publish return :' + str(rv), True)
        mqttc.disconnect()
        return True
    except Exception as e:
        _logger.writeLog('mqtt send ERROR:' + e.__str__(), True)
        return False
    return True

def zipFile(fullFilePath):
    try:
        compression = zipfile.ZIP_DEFLATED
    except:
        compression = zipfile.ZIP_STORED
    if os.path.exists(fullFilePath) and \
        os.path.isfile(fullFilePath):
        last_dot_pos = fullFilePath.rfind('.')
        if last_dot_pos > 0:
            zipFileFullPath = fullFilePath[:last_dot_pos+1]+'zip'
            z = zipfile.ZipFile(zipFileFullPath, mode="w", compression=compression, allowZip64=True)
            try:
                z.write(fullFilePath, arcname=os.path.basename(fullFilePath))
            except Exception as e:
                _logger.writeLog('zip file %s:'%(zipFileFullPath,) + e.__str__(), True)
            finally:
                if z:
                    z.close()
            return True
    return False


def zipFileList(filePathList, zipName):
    try:
        compression = zipfile.ZIP_DEFLATED
    except:
        compression = zipfile.ZIP_STORED
    z = zipfile.ZipFile(zipName, mode="w", compression=compression, allowZip64=True)
    try:
        for fullFilePath in filePathList:
            if os.path.exists(fullFilePath) and \
                    os.path.isfile(fullFilePath):
                z.write(fullFilePath, arcname=os.path.basename(fullFilePath))
    except Exception as e:
        _logger.writeLog('zip file %s:'%(zipName,) + e.__str__(), True)
        return False
    finally:
        if z:
            z.close()
    return True



def writeHisTupleCSV(fullFilePath, data):
    try:
        if data:
            with open(fullFilePath, 'a+', encoding='utf-8') as csvfile:
                colnum = len(data)
                content = ""
                for i in range(colnum):
                    content += data[i]
                    if i == colnum-1:
                        content += '\n'
                    else:
                        content += ','
                csvfile.write(content)
                return True
    except Exception as e:
        _logger.writeLog('writeHisTupleCSV failed:%s' + e.__str__(), True)
    return False

def getTimeType(tTime):
    if tTime is None:
        return -1
    if isinstance(tTime, datetime):
        if tTime.month==1 and tTime.day==1 and tTime.hour==0 and tTime.minute==0 and tTime.second==0:
            return 5 #month
        elif tTime.day==1 and tTime.hour==0 and tTime.minute==0 and tTime.second==0:
            return 4
        elif tTime.hour==0 and tTime.minute==0 and tTime.second==0:
            return 3
        elif tTime.minute==0 and tTime.second==0:
            return 2
        elif tTime.second==0:
            return 1

def diagnosis_get_workHours(selectstarttime, selectendtime, startHour, endhour):
    rt = []
    startTime = datetime.strptime(selectstarttime, '%Y-%m-%d %H:%M:%S')
    endTime = datetime.strptime(selectendtime, '%Y-%m-%d %H:%M:%S')
    bdate = startTime.date()
    strbdate = bdate.strftime('%Y-%m-%d')
    btime = datetime.strptime(strbdate + ' ' + startHour, '%Y-%m-%d %H:%M:%S')
    etime = datetime.strptime(strbdate + ' ' + endhour, '%Y-%m-%d %H:%M:%S')
    if btime<= startTime:
        btime = startTime
    while etime <= endTime:
        rt.append((btime, etime))
        bdate = bdate + timedelta(days = 1)
        strbdate = bdate.strftime('%Y-%m-%d')
        btime = datetime.strptime(strbdate + ' ' + startHour, '%Y-%m-%d %H:%M:%S')
        etime = datetime.strptime(strbdate + ' ' + endhour, '%Y-%m-%d %H:%M:%S')
    if btime <= endTime:
        rt.append((btime, endTime))
    return rt

def isAllCloudPointName(itemVarIdList):
    cps = {}
    projId = None
    for item in itemVarIdList:
        if item[0] == '@':
            arrs = item[1:].rsplit('|', 1)
            if len(arrs)==2:
                projId = arrs[0]
                ptName = arrs[1]
                if cps.get(projId) is None:
                    cps[projId] = [ptName]
                else:
                    cps[projId].append(ptName)
        else:
            return None
    if len(cps.keys())==1:
        return (projId, cps[projId])
    return None
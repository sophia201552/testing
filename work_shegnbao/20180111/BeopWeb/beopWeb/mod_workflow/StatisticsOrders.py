from bson.objectid import ObjectId
__author__ = 'Eric'

import logging
import datetime
from dateutil.parser import parse
from beopWeb.BEOPDataAccess import BEOPDataAccess

class StatisticsOrders():
    def overview(self, taskData, totalCount):
        overrt = {}
        delay = 0  # 延误
        incomplete = 0  # 待处理
        hascomplete = 0  # 完成
        rate = 0.0  # 完成率
        avgTime = 0.0  # 平均小时数
        _hours = 0
        # 5923dfbf833c97729535a62f
        for task in taskData:
            # 状态为1,0的是待处理工单
            if task.get('status') == 1 or task.get('status') == 0:
                dueDate = task.get('fields').get('dueDate')
                # 如果有截止日期，判断是否小于当前日期,没有截止日期的工单是垃圾数据，跳开
                if dueDate:
                    incomplete = incomplete + 1
                    dt = parse(dueDate)
#                     if len(dueDate) < 13:
#                         dueDate = dueDate + ' 23:59:59'
                    _dueDate = datetime.datetime.strptime(str(dt), '%Y-%m-%d %H:%M:%S')  # 2017-03-26 20:39:27
                    if _dueDate < datetime.datetime.now():
                        delay = delay + 1
                else:
                    totalCount = totalCount - 1
                    continue
            # 状态为2,3的是已处理工单
            elif task.get('status') == 2 or task.get('status') == 3:
                if task.get('process'):
                    nodesList = task.get('process').get('nodes')
                    # 如果没有process.nodes属性，或者属性内容为空，是垃圾数据，跳开
                    if nodesList:
                        if len(nodesList) > 0:
                            dateList = []
                            # 如果有处理日期，以最后一个日期为完成日期，计算与创建日期的间隔小时数
                            dateList = [ _node.get('datetime')  for _node in nodesList  if (_node and isinstance(_node.get('datetime'), datetime.datetime))  ]

#                             for _node in task.get('process').get('nodes'):
#                                 datetimeStr = _node.get('datetime')
#                                 if datetimeStr:
#                                     dateList.append(datetimeStr)
                            if len(dateList) > 0:
                                hascomplete = hascomplete + 1
                                dateList.sort(reverse=True)
                                finalDate = dateList[0]
                                createTime = task.get('createTime')
                                _hours = _hours + float((finalDate - createTime).total_seconds() / 3600)
                            else:
                                totalCount = totalCount - 1
                                continue
                        else:
                            totalCount = totalCount - 1
                            continue  
                    else:
                        totalCount = totalCount - 1
                        continue 
                else:
                    totalCount = totalCount - 1
                    continue
            else:
                totalCount = totalCount - 1
                continue
        if totalCount > 0 and hascomplete > 0:
            rate = round(float(hascomplete / totalCount), 2)
            avgTime = round(float(_hours / hascomplete), 2)
        overrt = {'total':totalCount, 'delay':delay, 'incomplete':incomplete, 'completeRate':rate, 'completeTime':avgTime}
        return overrt

    # 各用户完成率
    def detail(self, userTasks):
        detailRt = []
        for key in userTasks:
            totalCount = len(userTasks[key])
            userName = BEOPDataAccess.getInstance().getUserNameById(int(key))
            completeRate = 0.0
            completeCount = 0
            avgTime = 0.0
            hascomplete = 0
            _hours = 0.0
            detail = {'id':int(key), 'name':userName, 'completeRate':completeRate, 'completeTime':avgTime}
            for task in userTasks[key]:
                if task.get('status') == 2 or task.get('status') == 3:
                    if task.get('process'):
                        nodesList = task.get('process').get('nodes')
                        # 如果没有process.nodes属性，或者属性内容为空，是垃圾数据，跳开
                        if nodesList:
                            if len(nodesList) > 0:
                                dateList = []
                                # 如果有处理日期，以最后一个日期为完成日期，计算与创建日期的间隔小时数
                                dateList = [ _node.get('datetime')  for _node in nodesList  if (_node and isinstance(_node.get('datetime'), datetime.datetime))  ]
#                                 for _node in task.get('process').get('nodes'):
#                                     datetimeStr = _node.get('datetime')
#                                     if datetimeStr:
#                                         dateList.append(datetimeStr)
                                if len(dateList) > 0:
                                    hascomplete = hascomplete + 1
                                    dateList.sort(reverse=True)
                                    finalDate = dateList[0]
                                    createTime = task.get('createTime')
                                    _hours = _hours + float((finalDate - createTime).total_seconds() / 3600)
                                else:
                                    totalCount = totalCount - 1
                                    continue
                            else:
                                totalCount = totalCount - 1
                                continue  
                        else:
                            totalCount = totalCount - 1
                            continue 
            if totalCount > 0 and hascomplete > 0:
                rate = round(float(hascomplete / totalCount), 2)
                avgTime = round(float(_hours / hascomplete), 2)
                detail['completeRate'] = rate
                detail['completeTime'] = avgTime
            detailRt.append(detail)
        return detailRt
            
    # 各工单归属的用户  
    def findUserOfOrder(self, taskData, userIdList):  
        rt = {}
        # 初始化key为userid
        for userId in userIdList:
            rt[str(userId)] = []
        for task in taskData:
            nodesList = None
            dueDate = None   
            nodesList = task.get('process').get('nodes')
            dueDate = task.get('fields').get('dueDate')
            if nodesList and dueDate:
                if len(nodesList) > 0:
                    hasPerform = False
                    userOfOrder = None
                    # 循环nodes，找出执行人userid
                    for node in nodesList:
                        members = node.get('members')
                        behaviour = node.get('behaviour')
                        if behaviour == 2:
                            hasPerform = True
                            userOfOrder = members[0]
                            break
                    # 如果没有执行人，记录第一个审核人userid
                    if not hasPerform:
                        userOfOrder = nodesList[0].get('members')[0]
                # 添加task对象到列表
                if userOfOrder is not None:
                    if userOfOrder in userIdList:
                        rt[str(userOfOrder)].append(task)
        return rt
    
    # 把 team_arch 人物 详情对象 数组 转化为 人物 id 数组
    def formatArchMembers(self, team_arch, teamId):
        rt = []
        if teamId is not None:
            for arch_item in team_arch:
                if arch_item.get('members') and arch_item.get('id') == teamId:
                    temp = [member.get('id') for member in arch_item.get('members')]
                    rt.extend(temp)
                    break
        else:
            for arch_item in team_arch:
                if arch_item.get('members'):
                    temp = [member.get('id') for member in arch_item.get('members')]
                else:
                    temp = []
                rt.extend(temp)
        rt = list(set(rt))
        return rt    
            
    # 按日期用户分割工单列表
    def formatOrdersByUserTimes(self, taskData, userIdList, timeShaft, timeFormat):
        rt = {}        
        taskByTime = {}
        for userId in userIdList:
            rt[str(userId)] = {}
            if timeFormat == 'd1': 
                rt[str(userId)] = {timeStr:[] for timeStr in timeShaft}
            elif timeFormat == 'M1':
                timeShaft = [timeStr[0:7] for timeStr in timeShaft]
                rt[str(userId)] = {timeStr:[] for timeStr in timeShaft}
        for task in taskData:
            nodesList = None
            dueDate = None   
            nodesList = task.get('process').get('nodes')
            dueDate = task.get('fields').get('dueDate')
            if nodesList and dueDate:
                if len(nodesList) > 0:
                    hasPerform = False
                    userOfOrder = None
                    # 循环nodes，找出执行人userid
                    for node in nodesList:
                        members = node.get('members')
                        behaviour = node.get('behaviour')
                        if behaviour == 2:
                            hasPerform = True
                            userOfOrder = members[0]
                            break
                    # 如果没有执行人，记录第一个审核人userid
                    if not hasPerform:
                        userOfOrder = nodesList[0].get('members')[0]
                # 添加task对象到列表
                if userOfOrder is not None :
                    if timeFormat == 'd1':
                        if userOfOrder in userIdList and dueDate in timeShaft:
                            rt[str(userOfOrder)][dueDate].append(task) 
                    elif timeFormat == 'M1':
                        if userOfOrder in userIdList:
                            dueDate = dueDate[0:7] 
                            if dueDate in timeShaft: 
                                rt[str(userOfOrder)][dueDate].append(task)      
        return rt   
            
            
    def userOrderDetail(self, userDelayTasks, userId):
        detail = {'id':int(userId), 'data':{'completeRate':[], 'completeTime':[]}, 'timeShaft':[]}
        keys = sorted(userDelayTasks.keys())
        for key in keys:
            udts = userDelayTasks[key]      
            totalCount = len(udts)
            completeRate = 0.0
            completeCount = 0
            rate = 0.0
            avgTime = 0.0
            hascomplete = 0
            _hours = 0
            for task in udts:
                if task.get('status') == 2 or task.get('status') == 3:
                    if task.get('process'):
                        nodesList = task.get('process').get('nodes')
                        # 如果没有process.nodes属性，或者属性内容为空，是垃圾数据，跳开
                        if nodesList:
                            if len(nodesList) > 0:
                                hascomplete = hascomplete + 1
                                dateList = []
                                # 如果有处理日期，以最后一个日期为完成日期，计算与创建日期的间隔小时数
                                dateList = [ _node.get('datetime')  for _node in nodesList  if (_node and isinstance(_node.get('datetime'), datetime.datetime))  ]
#                                 for _node in task.get('process').get('nodes'):
#                                     datetimeStr = _node.get('datetime')
#                                     if datetimeStr:
#                                         dateList.append(datetimeStr)
                                if len(dateList) > 0:
                                    dateList.sort(reverse=True)
                                    finalDate = dateList[0]
                                    createTime = task.get('createTime')
                                    _hours = _hours + float((finalDate - createTime).total_seconds() / 3600)
                                else:
                                    totalCount = totalCount - 1
                                    continue
                            else:
                                totalCount = totalCount - 1
                                continue  
                        else:
                            totalCount = totalCount - 1
                            continue 
            if totalCount > 0 and hascomplete > 0:
                rate = round(float(hascomplete / totalCount), 2)
                avgTime = round(float(_hours / hascomplete), 2)
            detail['data']['completeRate'].append(rate)
            detail['data']['completeTime'].append(avgTime)
            detail['timeShaft'].append(key)
        return detail

#-*- encoding=utf-8 -*-

__author__ = 'huafy'

import re
from collections import defaultdict

class CStringMatch:
    def __init__(self):
        self.dataSdPoint = []
        self.rangeSdPoint = {}
        self.dataNotSdPoint = []
        self.sort = []
        self.sortDict = {}
        self.datastoretempEquivalence = {}
        self.HistoryData = {}
        self.HistoryDataList = []
        self.PointList = []
        self.Gradient = {}
        self.LastRelation = {}
        self.LastGradient = {}
        self.LastRange = {}
        self.Lastscore = 0
        self.LastSel = []

        self.strMatchDict = {}
        self.rsortDict = {}
        self.lastMatch = {}
        self.matchScoreLimit = 0.75
        self.LastGroup = {}
        self.EquipmentGroupList = {
            'AHU':['AHU','airhandlingunit'],
            'PAU':['PAU','FAU','MAU','OAU','makeupairunit'],
            'Ch':['Chiller','ChGroup','ChillerGroup','basechiller'],
            'PriP':['PChWP','ChWP','PriChWP','PChWPump','PriPump','PriP','ChillPump','primarychilledwaterpump','pri@@@@pump','chw@@@@pump'],
            'SecP':['SecP','SecPump','secchwp','schwp','secwpump','Sec@@@@pump'],
            'CWP':['CWP','CWPump','CoolPump','CoolingPump','CTPump','coolingwaterpump','CW@@@@Pump'],
            'CT':['Tower','CoolingTower','Ctower','CT@@@@fan'],
            'Valve':['valve','Vlve'],
            'HX':['hx','HeatX','Heatxchanger','HExchanger'],
            'WSHP':['WSHP','watersourceheatpump'],
            'GSHP':['GSHP','groundsourceheatpump'],
            'FPTU':['FPTU'],
            'CAVBox':['CAVBox'],
            'VAVBox':['VAVBox'],
            'PCW':['PCW'],
            'GWP':['GWP','glycolwaterpump'],
            'VacP':['VacP','vacuumpump'],
            'HWP':['HWP','hotwaterpump','hw@@@@Pump'],
            'MKP':['MKP','MUP','makeuppump'],
            'AirCPR':['AirCPR','aircompressor'],
            'ACleaner':['ACleaner','aircleaner','airFilter','airfresher'],
            'Filter':['Filter'],
            'Boiler':['Boiler','waterheater'],
            'Tank':['Tank','watertank'],
            'FCU':['FCU','fancoilunit'],
            'Damper':['Damper','Damp','airdamper'],
            'Fan':['fan'],
            'OtherPump':['pump','tank@@@@pump','ice@@@@pump']
        }
        self.EquipmentName = {
                            'AHU':'空调箱',
                            'PAU':'新风箱',
                            'Chiller':'冷机',
                            'PriP':'冷冻泵',
                            'SecP':'二次泵',
                            'CWP':'冷却泵',
                            'CT':'冷却塔',
                            'Valve':'阀门',
                            'HX':'板换',
                            'WSHP':'水源热泵',
                            'GSHP':'地源热泵',
                            'FPTU':'地台风机',
                            'CAVBox':'定风量风箱',
                            'VAVBox':'变风量风箱',
                            'PCW':'工艺冷却水',
                            'GWP':'溶液泵',
                            'VacP':'真空泵',
                            'HWP':'热水泵',
                            'MKP':'补水泵',
                            'AirCPR':'空压机',
                            'ACleaner':'空气净化器',
                            'Filter':'过滤器',
                            'Boiler':'锅炉',
                            'Tank':'水箱',
                            'FCU':'风机盘管',
                            'Damper':'风阀',
                            'Fan':'风机',
                            'OtherPump':'其他水泵'
        }
        self.AllgroupName = []

    def ReadAllGroupPointExcel(self,SourceName):
        data = xlrd.open_workbook(filename=SourceName)
        table = data.sheets()[0]
        #RealTimeTT_svr = SetValueClass.getRealTimeData(self.ProjectID,None,str(self.ProjectID)+'.CStringMatch')
        #获取所有键值
        #pointList = list(RealTimeTT_svr.keys())
        nrows = table.nrows
        for i in range(0, nrows):
            datastoretemp = table.row_values(i)
            self.AllgroupName.append([datastoretemp[0],1])
        return  self.AllgroupName

    def ReadAllGroupPointFromList(self,pointList):
        for i in pointList:
            self.AllgroupName.append([i,1])

    def ReadEquipmentStandardPoint(self, Etype, SourceName):
        # 读取转换规则信息
        # try:
        # 设备名称对应表
        data = xlrd.open_workbook(filename=SourceName)
        table = data.sheets()[0]
        nrows = table.nrows
        for i in range(0, nrows):
            datastoretemp = table.row_values(i)
            self.dataSdPoint.append(datastoretemp[0])
            self.rangeSdPoint[datastoretemp[0]] = datastoretemp[1].split(",")
            temList = []
            for tem in datastoretemp[2:]:
                if tem != '':
                    temList.append(tem)
            self.datastoretempEquivalence[datastoretemp[0]] = temList
            ################################################################################################################
        # 设备属性名称对应表
        table = data.sheets()[1]
        nrows = table.nrows
        for i in range(0, nrows):
            datastoretemp = table.row_values(i)
            self.dataNotSdPoint.append(datastoretemp[0])

        return 0

    def ReadHistoryData(self, HisDataSourceName):
        # 设备名称对应表
        data = xlrd.open_workbook(filename=HisDataSourceName)
        table = data.sheets()[0]
        nrows = table.nrows
        HistoryDataTemp = []
        for i in range(0, nrows):
            datastoretemp = table.row_values(i)
            if i == 0:
                for iit in datastoretemp:
                    HistoryDataTemp.append([iit])
                    self.PointList.append([iit])
            else:
                for k in range(len(datastoretemp)):
                    HistoryDataTemp[k].append(float(datastoretemp[k]))

        for His in HistoryDataTemp:
            self.HistoryData[His[0]] = His[1:]
            self.HistoryDataList.append(His[1:])
        return 0

    # 计算各族数据间的相关关系

    # 计算梯度
    def GroupEquipment(self):
        equiptype = self.EquipmentGroupList.keys()
        length =[]
        lengthLast = []
        for i in range(100):
            length.append([])
        for ty in equiptype:
            value = self.EquipmentGroupList.get(ty)
            for equ in value:
                LL = len(equ)
                length[LL].append((ty,equ.lower()))
        length.reverse()
        for i in range(100):
            if length[i] != []:
                lengthLast.append(length[i])
        #加入最后匹配字符
        lengthLast = lengthLast+[('CAVBox','CAV'),('VAVBox','VAV'),[('CT','ct'),('Ch','ch')]]
        SortList = []
        for oen in lengthLast:
            for ig in oen:
                SortList.append(ig)
        tempAllName = []
        tempAllNameIni = []
        for  oneName in self.AllgroupName:
             nm = oneName[0].lower()
             strname = ''
             for ch in nm:
                tch = re.findall('[0-9a-zA-Z]',ch)
                if tch != []:
                     strname = strname+tch[0]
             tempAllName.append([strname,1])
             tempAllNameIni.append(nm)
        reGroupDict = defaultdict(list)
        for n in range(len(tempAllName)):
            oneName = tempAllName[n]
            if oneName[1] ==0:
                continue
            for Kp in SortList:
                splitRe = Kp[1].split('@@@@')
                if len(splitRe)>1:
                    if oneName[0].find(splitRe[0])>-1 and oneName[0].find(splitRe[1])>-1:
                        reGroupDict[Kp[0]].append(self.AllgroupName[n][0])
                        tempAllName[n][1] =0
                        break

                else:
                    ind = oneName[0].find(splitRe[0])
                    if ind>-1:
                        if splitRe[0] =='ch' or splitRe[0] =='ahu' or splitRe[0] =='fan' or splitRe[0] =='ct':
                            indini = tempAllNameIni[n].find(splitRe[0])
                            if indini ==0:
                                reGroupDict[Kp[0]].append(self.AllgroupName[n][0])
                                tempAllName[n][1] =0
                                break
                            elif indini >0:
                                c = tempAllNameIni[n][indini-1:indini]
                                if not c.isalpha(): #str.isdigit
                                    reGroupDict[Kp[0]].append(self.AllgroupName[n][0])
                                    tempAllName[n][1] =0
                                    break
                        else:
                            reGroupDict[Kp[0]].append(self.AllgroupName[n][0])
                            tempAllName[n][1] =0
                            break
        #依据分类结果
        for Oneequi in reGroupDict:
            AllPoint = reGroupDict.get(Oneequi)
            pointTemp = []
            for op in AllPoint:
                strname = ''
                for ch in op:
                    tch = re.findall('[0-9]',ch)
                    if tch == []:
                         strname = strname+ch
                pointTemp.append(strname)
            #统计点的个数，选择10个点，以重复数量最多的为最终数量
            if len(pointTemp)>10:
                checkpint  = pointTemp[0:10]
                checkCount = [0]*10
            else:
                CCount = len(pointTemp)
                checkpint  = pointTemp
                checkCount = [0]*CCount
            for i in range(len(checkpint)):
                checkValue = checkpint[i]
                K = 0
                for incheck in pointTemp:
                    if checkValue == incheck:
                        K = K+1
                checkCount[i] = K
            #统计checkCount
            Lastmax = 0
            lastdict1 = []
            lastdict2 = []
            if len(checkCount)==1:
                Lastmax = checkCount[0]
            elif len(checkCount)>1:
                for i in range(len(checkCount)-1):
                    num = checkCount[i]
                    coun =0
                    if num <0:
                        continue
                    for j in range(i,len(checkCount)):
                        if num == checkCount[j]:
                            coun = coun+1
                            checkCount[j] = -1
                    lastdict1.append(num)
                    lastdict2.append(coun)
                index = 0
                vv = -1
                for i in range(len(lastdict2)):
                    if lastdict2[i]>vv:
                        index = i
                        vv = lastdict2[i]
                Lastmax = lastdict1[index]
            self.LastGroup[Oneequi] = Lastmax

        return self.LastGroup, reGroupDict

# if __name__ == '__main__':
#
#
#     CSMatch = CStringMatch()
#     a = CSMatch.ReadAllGroupPointFromList()
#     b, c = CSMatch.GroupEquipment()
#
#     print(1)

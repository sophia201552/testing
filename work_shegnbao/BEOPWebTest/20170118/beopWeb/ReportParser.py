#-*- coding: UTF-8 -*-
__author__ = 'Matthew'

from numpy import *
from configobj import ConfigObj
import json
from datetime import datetime, timedelta
import requests

from collections import OrderedDict


class HistoryData:
    def getHistoryData(self, projId, pointList, timeStart, timeEnd, timeFormat):
        # print('get_history_data')

        data = dict(projectId=projId, pointList=pointList, timeStart=timeStart, timeEnd=timeEnd, timeFormat=timeFormat)

        headers = {'content-type': 'application/json'}
        r = requests.post('http://beop.rnbtech.com.hk/get_history_data_padded', data=json.dumps(data), headers=headers)
        # r = requests.post('http://192.168.1.8/get_history_data_padded', data=json.dumps(data), headers=headers)
        strJson = r.text
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None

    def getWorkflowData(self, tranId):
        # print('get_history_data')

        headers = {'content-type': 'application/json'}
        r = requests.get('http://beop.rnbtech.com.hk/workflow/transaction/get/' + str(tranId), headers=headers)
        strJson = r.text
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None

    def getDiagnosisAll(self, projId):

        headers = {'content-type': 'application/json'}
        r = requests.get('http://beop.rnbtech.com.hk/diagnosis/getAll/' + projId, headers=headers)
        strJson = r.text
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None

    def getDiagnosisNotice(self, projId):

        headers = {'content-type': 'application/json'}
        r = requests.get('http://beop.rnbtech.com.hk/diagnosis/notice/get/' + projId, headers=headers)
        strJson = r.text
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None

    def getDiagnosisFault(self, projId):

        headers = {'content-type': 'application/json'}
        r = requests.get('http://beop.rnbtech.com.hk/diagnosis/fault/get/' + projId, headers=headers)
        strJson = r.text
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None

    def getDiagnosisEquipment(self, projId):

        headers = {'content-type': 'application/json'}
        r = requests.get('http://beop.rnbtech.com.hk/diagnosis/equipment/get/' + projId, headers=headers)
        strJson = r.text
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None

    def getDiagnosisZone(self, projId):

        headers = {'content-type': 'application/json'}
        r = requests.get('http://beop.rnbtech.com.hk/diagnosis/zone/get/' + projId, headers=headers)
        strJson = r.text
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None


class ReportConfgJson:
    def GetReportJson(self, nthWeek, ProjID, configFilePath):
        ReportTest = ReportParser()

        ProjReportSet = ReportSet()

        if ReportTest.ParsingReportFile(configFilePath):
            ProjReportSet = ReportTest.ReportSetFromParser

        # [StartTime, EndTime] = self.ReportDateFromNthWeek(nthWeek)
        [StartTime, EndTime] = ['2015-02-01 00:00:00', '2015-03-01 00:00:00']
        DataRetriver = HistoryData()
        HisData = DataRetriver.getHistoryData(int(ProjID), list(ProjReportSet.SetPointsDict.keys()), StartTime, EndTime,
                                              'h1')
        Data_Diagnosis = DataRetriver.getDiagnosisAll('huarunHK')
        DiagDataList = self.DataTransaction(Data_Diagnosis)

        for i in range(0, len(HisData)):
            keys = HisData[i]['name']
            ProjReportSet.SetPointsDict[keys] = []
            for HisDataPair in HisData[i]['history']:
                ProjReportSet.SetPointsDict[keys].append(float('%0.2f' % float(HisDataPair['value'])))

        ProjReportSet.SetPointsDict.update({'HistoryTime': []})
        # Converting GMT time to y-m-d h:m:s
        for HisDataPair in HisData[0]['history']:
            ProjReportSet.SetPointsDict['HistoryTime'].append(self.GMTimeToNomal(HisDataPair['time']))

        ProjReportSet.PointReadingStatus = True

        return ProjReportSet.GenerateReportJson(DiagDataList)

    def DataTransaction(self, Data_Diagnosis):
        DiagDataList = Data_Diagnosis['notices']
        DataRetriver = HistoryData()
        for i in range(len(DiagDataList)):
            FaultIdTemp = DiagDataList[i]['faultId']
            GradeTemp = DiagDataList[i]['grade']
            DiagDataList[i]['noticesId'] = DiagDataList[i]['id']

            if GradeTemp != 0:
                Workflow = DataRetriver.getWorkflowData(GradeTemp)
                DiagDataList[i]['WorkflowStatus'] = Workflow['statusId']
            else:
                DiagDataList[i]['WorkflowStatus'] = -1

            for j in range(len(Data_Diagnosis['faults'])):
                if Data_Diagnosis['faults'][j]['id'] == FaultIdTemp:
                    DiagDataList[i].update(Data_Diagnosis['faults'][j])
                    DiagDataList[i]['Fault'] = DiagDataList[i]['name']
                    EquipmentIdTemp = Data_Diagnosis['faults'][j]['equipmentId']
                    DiagDataList[i]['EquipmentId'] = EquipmentIdTemp
                    for k in range(len(Data_Diagnosis['equipments'])):
                        if Data_Diagnosis['equipments'][k]['id'] == EquipmentIdTemp:
                            DiagDataList[i].update(Data_Diagnosis['equipments'][k])
                            DiagDataList[i]['EquipName'] = Data_Diagnosis['equipments'][k]['name']
                            DiagDataList[i]['Equip'] = DiagDataList[i]['EquipName'][
                                                       0:len(DiagDataList[i]['EquipName']) - 2]
                            DiagDataList[i]['System'] = Data_Diagnosis['equipments'][k]['systemName']
                            ZoneIdTemp = Data_Diagnosis['equipments'][k]['zoneId']
                            DiagDataList[i]['ZoneId'] = ZoneIdTemp
                            for h in range(len(Data_Diagnosis['zones'])):
                                if Data_Diagnosis['zones'][h]['id'] == ZoneIdTemp:
                                    DiagDataList[i].update(Data_Diagnosis['zones'][h])
                                    DiagDataList[i]['Floor'] = Data_Diagnosis['zones'][h]['subBuildingName']
        return DiagDataList

    def GMTimeToNomal(self, GMTime):
        # timeArray = datetime.strptime(GMTime, '%a, %d %b %Y %H:%M:%S %Z')
        #return timeArray.strftime("%Y-%m-%d %H:%M:%S")
        return GMTime

    def ReportDateFromNthWeek(self, NthWeek):
        YearWeekTemp = NthWeek.split('-', 2)
        yearStartDay = YearWeekTemp[0] + '-01-01'
        timeArray = datetime.strptime(yearStartDay, '%Y-%m-%d')
        nthforSelectedWeek = int(YearWeekTemp[1])
        NthWeekDate = []
        for i in range(53):
            weekStartDate = timeArray
            weekDelta = timedelta(days=7 - timeArray.weekday())
            timeArray += weekDelta
            if i == (nthforSelectedWeek - 1):
                NthWeekDate.append(weekStartDate.strftime('%Y-%m-%d %H:%M:%S'))
                NthWeekDate.append(timeArray.strftime('%Y-%m-%d %H:%M:%S'))
                return NthWeekDate


class ReportAlgorithms:
    def __init__(self):
        self.ChartType = 'line'
        self.AlgorithmProperty = {}

    def RunningAlgorithm(self, AlgorithmName, AlgorithmInput, AlgorithmTimeLabel, TitleName, Settinglist):

        self.AlgorithmProperty['name'] = AlgorithmName
        if Settinglist != '':
            self.AlgorithmProperty['setting'] = Settinglist

        if self.AlgorithmProperty['name'] == 'Histogram':
            return self.Histogram(AlgorithmInput)
        elif self.AlgorithmProperty['name'] == 'HistogramArea':
            return self.HistogramArea(AlgorithmInput, AlgorithmTimeLabel, TitleName)
        elif self.AlgorithmProperty['name'] == 'daily':
            return self.DailyDecompose(AlgorithmInput, AlgorithmTimeLabel)
        elif self.AlgorithmProperty['name'] == 'scatter':
            return self.Scatter(AlgorithmInput, AlgorithmTimeLabel)
        elif self.AlgorithmProperty['name'] == 'LastValue':
            return self.LastValue(AlgorithmInput, AlgorithmTimeLabel, TitleName)
        elif self.AlgorithmProperty['name'] == 'LastFirstValueDiff':
            return self.LastFirstValueDiff(AlgorithmInput, AlgorithmTimeLabel)
        elif self.AlgorithmProperty['name'] == 'OnCount':
            return self.ObjectCount(AlgorithmInput, AlgorithmTimeLabel, TitleName)
        elif self.AlgorithmProperty['name'] == 'OffCount':
            return self.ObjectoffCount(AlgorithmInput, AlgorithmTimeLabel, TitleName)
        elif self.AlgorithmProperty['name'] == 'OnOffCount':
            return self.ObjectOnoffCount(AlgorithmInput, AlgorithmTimeLabel)
        elif self.AlgorithmProperty['name'] == 'StackedArea':
            return self.StackedArea(AlgorithmInput, AlgorithmTimeLabel, TitleName)
        elif self.AlgorithmProperty['name'] == 'PartLine':
            return self.PartLine(AlgorithmInput, AlgorithmTimeLabel)
        else:
            self.ChartType = 'line'
            AlgorithmOutput = {'x': [], 'y': {}}
            AlgorithmOutput['x'] = AlgorithmTimeLabel
            AlgorithmOutput['y'] = dict(AlgorithmInput)
            return AlgorithmOutput

    # Generate histogram data using numpy
    def Histogram(self, InputData):
        # for now ,only the first data will be input for histogram
        self.ChartType = 'bar'
        AlgorithmOutput = {'x': [], 'y': {}}
        HistogramOutput = {}
        InputNamelist = list(InputData.keys())
        InputLabel = []
        if 'setting' in self.AlgorithmProperty.keys():
            setting = []
            for i in range(len(self.AlgorithmProperty['setting'])):
                setting.append(eval(self.AlgorithmProperty['setting'][i]))
            setting.sort()
            InputLabel = self.histogramLabel(setting)

            for key in InputData:
                valueTemp, labelTemp = histogram(InputData[key], setting)
                HistogramOutput[key] = valueTemp.tolist()
        else:
            value, label = histogram(InputData[InputNamelist[0]])
            HistogramOutput[InputNamelist[0]] = value.tolist()
            InputLabel = self.histogramLabel(label)

        AlgorithmOutput['x'] = InputLabel
        AlgorithmOutput['y'] = HistogramOutput

        return AlgorithmOutput

    def HistogramArea(self, InputData, InputTime, Name):
        HistogramOutput = OrderedDict()
        InputNamelist = list(InputData.keys())
        InputLabel = []
        if 'setting' in self.AlgorithmProperty.keys():
            setting = []
            for i in range(len(self.AlgorithmProperty['setting'])):
                setting.append(eval(self.AlgorithmProperty['setting'][i]))
            setting.sort()
            InputVariableName = self.histogramLabel(setting)
            InputLabel = InputNamelist
            HistogramOutputTemp = OrderedDict()
            for key in InputNamelist:
                valueTemp, labelTemp = histogram(InputData[key], setting)
                HistogramOutputTemp[key] = valueTemp.tolist()

            hisvalue = (array(list(HistogramOutputTemp.values()))).transpose()

            for i in range(len(InputVariableName)):
                HistogramOutput[InputVariableName[i]] = hisvalue[i].tolist()

        else:

            valueTemp, label = histogram(InputData[InputNamelist[0]])
            HistogramOutput[InputNamelist[0]] = valueTemp.tolist()
            InputLabel = self.histogramLabel(label)

        return self.StackedArea(HistogramOutput, InputLabel, Name)

    def histogramLabel(self, x):
        key = []
        for i in range(0, len(x) - 1):
            key.append(str(x[i]) + '-' + str(x[i + 1]))
        return key

    # Generate Daily time screen data
    def DailyDecompose(self, InputData, InputTime):
        # for now, only pass input to output, no processing
        self.ChartType = 'line'
        AlgorithmOutput = {'x': [], 'y': {}}
        AlgorithmOutput['x'] = InputTime
        AlgorithmOutput['y'] = InputData
        return AlgorithmOutput

    # Generate Daily time screen data
    def Scatter(self, InputData, InputTime):
        # for now, the first variable will be x-variable, others are y-variables
        self.ChartType = 'scatter'
        AlgorithmOutput = {'x': [], 'y': {}}
        InputNamelist = list(InputData.keys())
        for i in range(1, len(InputNamelist)):
            AlgorithmOutput['y'][InputNamelist[i]] = vstack(
                (InputData[InputNamelist[0]], InputData[InputNamelist[i]])).transpose().tolist()
        return AlgorithmOutput

    # Generate a chart value using latest value from specified time range
    def LastValue(self, InputData, InputTime, Name):
        self.ChartType = 'bar'
        AlgorithmOutput = {'x': [], 'y': {Name: []}}
        InputNamelist = list(InputData.keys())
        AlgorithmOutput['x'] = InputNamelist
        for i in range(0, len(InputNamelist)):
            AlgorithmOutput['y'][Name].append(InputData[InputNamelist[i]][-1])
        return AlgorithmOutput

    # Generate a chart value using latest value minus oldest value from specified time range
    def LastFirstValueDiff(self, InputData, InputTime):
        self.ChartType = 'pie'
        AlgorithmOutput = {'x': [], 'y': {}}
        InputNamelist = list(InputData.keys())
        AlgorithmOutput['x'] = InputNamelist
        for i in range(0, len(InputNamelist)):
            AlgorithmOutput['y'][InputNamelist[i]] = [
                float('%0.1f' % (InputData[InputNamelist[i]][-1] - InputData[InputNamelist[i]][0]))]
        return AlgorithmOutput

    # Generate a chart value by counting a specified string '' from each variable
    def ObjectCount(self, InputData, InputTime, Name):
        self.ChartType = 'bar'
        AlgorithmOutput = {'x': [], 'y': {Name: []}}
        InputNamelist = list(InputData.keys())
        AlgorithmOutput['x'] = InputNamelist
        for i in range(0, len(InputNamelist)):
            NormlizedIntList = [int(j) for j in InputData[InputNamelist[i]]]
            AlgorithmOutput['y'][Name].append(str(NormlizedIntList).count('0, 1'))
        return AlgorithmOutput

    def ObjectoffCount(self, InputData, InputTime, Name):
        self.ChartType = 'bar'
        AlgorithmOutput = {'x': [], 'y': {Name: []}}
        InputNamelist = list(InputData.keys())
        AlgorithmOutput['x'] = InputNamelist
        for i in range(0, len(InputNamelist)):
            NormlizedIntList = [int(j) for j in InputData[InputNamelist[i]]]
            AlgorithmOutput['y'][Name].append(str(NormlizedIntList).count('1, 0'))
        return AlgorithmOutput

    def ObjectOnoffCount(self, InputData, InputTime):
        if 'setting' in self.AlgorithmProperty.keys():
            if len(self.AlgorithmProperty['setting']) == 2:
                KeylistTemp = self.AlgorithmProperty['setting']
            else:
                print("ChartSetting error")
        else:
            KeylistTemp = ["关", "开"]
        self.ChartType = 'bar'
        AlgorithmOutput = {'x': [], 'y': {}}
        AlgorithmOutput['y'][KeylistTemp[0]] = []
        AlgorithmOutput['y'][KeylistTemp[1]] = []
        InputNamelist = list(InputData.keys())
        AlgorithmOutput['x'] = InputNamelist
        for i in range(0, len(InputNamelist)):
            NormlizedIntList = [int(j) for j in InputData[InputNamelist[i]]]
            AlgorithmOutput['y'][KeylistTemp[0]].append(str(NormlizedIntList).count('1, 0'))
            AlgorithmOutput['y'][KeylistTemp[1]].append(str(NormlizedIntList).count('0, 1'))

        return AlgorithmOutput

    # Generate a chart value to from a stacked area chart
    def StackedArea(self, InputData, InputLabel, Name):
        self.ChartType = 'area'
        AlgorithmOutput = {'x': [], 'y': {}}
        AlgorithmOutput['x'] = InputLabel
        AlgorithmOutput['y'] = dict(InputData)
        return AlgorithmOutput

    def PartLine(self, InputData, InputLabel):
        self.ChartType = 'line'
        AlgorithmOutput = {'x': [], 'y': {}}
        temp = InputData.copy()
        for k in InputData.keys():
            temp[k] = []
        if 'setting' in self.AlgorithmProperty.keys():
            if len(self.AlgorithmProperty['setting']) == 2:
                for i in range(len(InputLabel)):
                    if (InputLabel[i] >= self.AlgorithmProperty['setting'][0]) and (
                        InputLabel[i] <= self.AlgorithmProperty['setting'][1]):
                        AlgorithmOutput['x'].append(InputLabel[i])
                        for k in InputData.keys():
                            temp[k].append(InputData[k][i])
                AlgorithmOutput['y'] = dict(temp)
            else:
                print("ChartSetting error")
        else:
            AlgorithmOutput['x'] = InputLabel
            AlgorithmOutput['y'] = dict(InputData)

        return AlgorithmOutput


class DiagAlgorithms:
    def __init__(self):
        self.ChartType = ''
        self.DiagData = {}
        self.FaultGrade = [0, 1, 2]
        self.WorkflowStatus = [0, 1, 2, 3, 4, 5]
        self.FaultGradeName = ['警告', '报警', '故障']
        # self.WorkflowStatusName = ['new','assigned','start','pause','completed','deleted']
        self.WorkflowStatusName = ['新建', '分配', '开始', '暂停', '完成', '删除']

    def CalcAlgorithm(self, DiagStaticObjectName, DiagStaticContentName, DiagDataList, Settinglist):
        TempName = []
        for i in range(len(DiagDataList)):
            if DiagDataList[i][DiagStaticObjectName] not in TempName:
                TempName.append(DiagDataList[i][DiagStaticObjectName])
        return self.GetChartValue(TempName, DiagStaticObjectName, DiagStaticContentName, DiagDataList, Settinglist)

    def GetChartValue(self, TempName, DiagStaticObjectName, DiagStaticContentName, DiagDataList, Settinglist):

        if DiagStaticContentName == 'Fault':
            self.ChartType = 'bar'
            AlgorithmOutput = {'x': [], 'y': {}}
            DiagDatadictTemp = {}
            for k in TempName:
                Temp = []
                DiagDatadictTemp[k] = []
                for i in range(len(DiagDataList)):
                    if DiagDataList[i][DiagStaticObjectName] == k:
                        Temp.append(DiagDataList[i]['userFaultGrade'])
                for item in self.FaultGrade:
                    DiagDatadictTemp[k].append(Temp.count(item))
            if Settinglist != '':
                self.FaultGradeName = Settinglist
            AlgorithmOutput['x'] = self.FaultGradeName
            AlgorithmOutput['y'] = DiagDatadictTemp
            return AlgorithmOutput
        elif DiagStaticContentName == 'EnergySaving':
            self.ChartType = 'pie'
            AlgorithmOutput = {'x': [], 'y': {}}
            DiagDatadictTemp = {}
            for k in TempName:
                DiagDatadictTemp[k] = []
                for i in range(len(DiagDataList)):
                    if DiagDataList[i][DiagStaticObjectName] == k:
                        StatusTemp = DiagDataList[i]['status']
                        StatusTemp = StatusTemp.replace(' kWh/Day', '')
                        DiagDatadictTemp[k].append(float(StatusTemp))
                DiagDatadictTemp[k] = [sum(DiagDatadictTemp[k])]
            AlgorithmOutput['x'] = TempName
            AlgorithmOutput['y'] = DiagDatadictTemp
            return AlgorithmOutput
        elif DiagStaticContentName == 'WorkOrder':
            self.ChartType = 'bar'
            AlgorithmOutput = {'x': [], 'y': {}}
            DiagDatadictTemp = {}
            for k in TempName:
                Temp = []
                DiagDatadictTemp[k] = []
                for i in range(len(DiagDataList)):
                    if (DiagDataList[i][DiagStaticObjectName] == k) & (DiagDataList[i]['WorkflowStatus'] != -1):
                        Temp.append(DiagDataList[i]['WorkflowStatus'])
                for item in self.WorkflowStatus:
                    DiagDatadictTemp[k].append(Temp.count(item))
            if Settinglist != '':
                self.WorkflowStatusName = Settinglist
            AlgorithmOutput['x'] = self.WorkflowStatusName
            AlgorithmOutput['y'] = DiagDatadictTemp
            return AlgorithmOutput
        else:
            print("error")


# define a unit class for report
class ReportUnit:
    def __init__(self):
        self.UnitProperty = {'Unitname': '', 'Description': '', 'ChartTitle': '', 'ChartType': '', 'ChartXAxisName': '',
                             'ChartYAxisName': '', 'ChartPoints': [], 'ChartPointsName': [], 'ChartAlgorithm': '',
                             'ChartTimeScreen': '', 'DiagStaticObject': '', 'DiagStaticContent': '', 'ChartSetting': ''}
        self.UnitValue = OrderedDict()
        self.UnitChartValue = OrderedDict()
        self.UnitTimeLabel = []

    def ProcessingDescription(self):
        UnitnameTemp = self.UnitProperty['Unitname']
        if UnitnameTemp != "":
            UnitnameTemp = '<span style=font-size:20px;font-weight:bold>' + UnitnameTemp + '</span><br><br>'
        # formula
        DescriptionTemp = self.UnitProperty['Description']
        DescriptionList = DescriptionTemp.split('%', DescriptionTemp.count('%'))
        FormulaList = DescriptionList[1::2]
        FormulaValueList = []
        FormulaValue = self.UnitValue.copy()
        for FormulaString in FormulaList:
            FormulaValueList.append(eval(FormulaString, globals(), FormulaValue))
        DescriptList = DescriptionList[0::2]
        Description = ''
        for i in range(0, len(FormulaValueList)):
            Description += DescriptList[i]
            if type(FormulaValueList[i]) != []:
                if type(FormulaValueList[i]) == type(float64(1.0)):
                    Description += str(float('%.2f' % FormulaValueList[i]))
                else:
                    Description += str(FormulaValueList[i])
            else:
                Description += 'Error:List is added!'
        Description += DescriptList[-1]
        # 格式
        DescriptionTempList = Description.split('[', Description.count(']'))
        Description = ""
        for i in range(len(DescriptionTempList)):
            Templist = DescriptionTempList[i]
            if DescriptionTempList[i].count("::") > 0:
                Templist = Templist.split("::", 1)
                StyleTemplist = (Templist[0]).split('|', Templist[0].count('|'))
                StyleTempstring = '<span style= '
                for j in range(len(StyleTemplist)):
                    if j == 0:
                        StyleTempstring = self.SetDescriptionStyle(StyleTempstring, StyleTemplist, j)
                    else:
                        StyleTempstring += ";"
                        StyleTempstring = self.SetDescriptionStyle(StyleTempstring, StyleTemplist, j)
                StyleTempstring += ">"
                Templist = StyleTempstring + "".join(Templist[1])
            Description += "".join(Templist)

        Description = Description.replace(']', '</span>')
        Description = Description.replace('\n\t', '<br>')
        Description = Description.replace('\\n', '<br>')
        Description = UnitnameTemp + Description
        self.UnitProperty['Description'] = Description

    def SetDescriptionStyle(self, StyleTempstring, StyleTemplist, j):
        if StyleTemplist[j] == 'bold':
            StyleTempstring += "font-weight:bold"
        elif 'px' in StyleTemplist[j]:
            StyleTempstring += "font-size:" + StyleTemplist[j]
        else:
            StyleTempstring += "color:" + StyleTemplist[j]

        return StyleTempstring

    def SetUnitValue(self, ReportPointsDict):
        ChartPointsTemp = self.UnitProperty['ChartPoints']
        self.UnitTimeLabel = ReportPointsDict['HistoryTime']
        for keys in ChartPointsTemp:
            self.UnitValue[keys] = array(ReportPointsDict[keys])
            if self.UnitProperty['ChartPointsName']:
                self.UnitChartValue[self.UnitProperty['ChartPointsName'][ChartPointsTemp.index(keys)]] = \
                    ReportPointsDict[keys]

    def GetChartItems(self):
        AlgorithmName = self.UnitProperty['ChartAlgorithm']
        TitleName = self.UnitProperty['ChartTitle']
        Settinglist = self.UnitProperty['ChartSetting']
        AlgorithmLib = ReportAlgorithms()
        AlgorithmOutput = AlgorithmLib.RunningAlgorithm(AlgorithmName, self.UnitChartValue, self.UnitTimeLabel,
                                                        TitleName, Settinglist)
        self.UnitProperty['ChartType'] = AlgorithmLib.ChartType
        return AlgorithmOutput

    def GetDiagChartItems(self, DiagDataList):
        DiagStaticObjectName = self.UnitProperty['DiagStaticObject']
        DiagStaticContentName = self.UnitProperty['DiagStaticContent']
        Settinglist = self.UnitProperty['ChartSetting']
        AlgorithmLib = DiagAlgorithms()
        AlgorithmOutput = AlgorithmLib.CalcAlgorithm(DiagStaticObjectName, DiagStaticContentName, DiagDataList,
                                                     Settinglist)
        self.UnitProperty['ChartType'] = AlgorithmLib.ChartType
        return AlgorithmOutput

    def GenerateReportJson(self, ReportPointsDict, DiagDataList):
        if self.UnitProperty['DiagStaticObject']:
            ReportJson = {}
            self.ProcessingDescription()
            ReportJson['chartItems'] = self.GetDiagChartItems(DiagDataList)
            ReportJson['summary'] = self.UnitProperty['Description']
            ReportJson['title'] = self.UnitProperty['ChartTitle']
            ReportJson['type'] = self.UnitProperty['ChartType']
            ReportJson['Options'] = {'x': self.UnitProperty['ChartXAxisName'], 'y': self.UnitProperty['ChartYAxisName']}
            return ReportJson
        else:
            ReportJson = {}
            self.SetUnitValue(ReportPointsDict)
            self.ProcessingDescription()
            ReportJson['chartItems'] = self.GetChartItems()
            ReportJson['summary'] = self.UnitProperty['Description']
            ReportJson['title'] = self.UnitProperty['ChartTitle']
            ReportJson['type'] = self.UnitProperty['ChartType']
            ReportJson['Options'] = {'x': self.UnitProperty['ChartXAxisName'], 'y': self.UnitProperty['ChartYAxisName']}
            return ReportJson


# A class defining a lists of unit report like a chapter
class ReportLists:
    ListName = ''

    def __init__(self):
        self.ReportUnitList = []

    def GenerateReportJson(self, ReportPointsDict, DiagDataList):
        ReportUnitListJson = {}
        UnitJsonListTemp = []
        for unittemp in self.ReportUnitList:
            UnitJsonListTemp.append(unittemp.GenerateReportJson(ReportPointsDict, DiagDataList))
        ReportUnitListJson['name'] = self.ListName
        ReportUnitListJson['units'] = UnitJsonListTemp
        return ReportUnitListJson


# A class defining a set of report lists like a report
class ReportSet:
    DBName = ''
    PointReadingStatus = False

    def __init__(self):
        self.ReportList = []
        self.SetPointsDict = {}
        self.ReportJsonList = []
        self.FormulaList = FormulaLists()

    def GenerateReportJson(self, DiagDataList):
        if self.PointReadingStatus:
            self.SetPointsDict.update(self.FormulaList.GenerateFormulaOutput(self.SetPointsDict))
            for i in range(0, len(self.ReportList)):
                self.ReportJsonList.append(self.ReportList[i].GenerateReportJson(self.SetPointsDict, DiagDataList))
            return self.ReportJsonList
        else:
            return False


# A class defining report set from config file
class ReportParser():
    ReportConfigFile = ''
    ReportSetFromParser = ''

    def __init__(self):
        pass

    def ParsingReportFile(self, filename):
        if filename:
            self.ReportConfigFile = filename
            self.ConfigFileParser()
            return True
        else:
            return False

    def ConfigFileParser(self):
        CFParser = ConfigObj(self.ReportConfigFile)
        self.ReportSetFromParser = ReportSet()

        if 'ProjConfig' in CFParser.keys():
            self.ReportSetFromParser.DBName = CFParser['ProjConfig']

        if 'Report' in CFParser.keys():
            for keys in CFParser['Report'].keys():
                ReportListTemp = ReportLists()
                if 'ChapterName' in CFParser['Report'][keys].keys():
                    ReportListTemp.ListName = CFParser['Report'][keys]['ChapterName']
                for Subkeys in CFParser['Report'][keys]:
                    if type(CFParser['Report'][keys][Subkeys]) != type(''):
                        ReportUnitTemp = ReportUnit()
                        for propertyname in ReportUnitTemp.UnitProperty.keys():
                            if propertyname in CFParser['Report'][keys][Subkeys].keys():
                                if type(ReportUnitTemp.UnitProperty[propertyname]) == type([]):
                                    propertytemp = CFParser['Report'][keys][Subkeys][propertyname]
                                    ReportUnitTemp.UnitProperty[propertyname] = propertytemp.split('|',
                                                                                                   propertytemp.count(
                                                                                                       '|'))
                                else:
                                    ReportUnitTemp.UnitProperty[propertyname] = CFParser['Report'][keys][Subkeys][
                                        propertyname]
                        ReportListTemp.ReportUnitList.append(ReportUnitTemp)
                        PointNameTemp = ReportUnitTemp.UnitProperty['ChartPoints']
                        self.ReportSetFromParser.SetPointsDict.update(
                            dict(zip(PointNameTemp, zeros((len(PointNameTemp), len(PointNameTemp))))))
                self.ReportSetFromParser.ReportList.append(ReportListTemp)

        if 'Formula' in CFParser.keys():
            FormulaListTemp = FormulaLists()
            for Subkeys in CFParser['Formula']:
                if type(CFParser['Formula'][Subkeys]) != type(''):
                    FormulaUnitTemp = FormulaUnit()
                    for propertyname in FormulaUnitTemp.FormulaProperty.keys():
                        if propertyname in CFParser['Formula'][Subkeys].keys():
                            if type(FormulaUnitTemp.FormulaProperty[propertyname]) == type([]):
                                propertytemp = CFParser['Formula'][Subkeys][propertyname]
                                FormulaUnitTemp.FormulaProperty[propertyname] = propertytemp.split('|',
                                                                                                   propertytemp.count(
                                                                                                       '|'))
                            else:
                                FormulaUnitTemp.FormulaProperty[propertyname] = CFParser['Formula'][Subkeys][
                                    propertyname]
                    FormulaListTemp.FormulaUnitList.append(FormulaUnitTemp)
                    PointNameTemp = FormulaUnitTemp.FormulaProperty['FormulaPoints']
                    self.ReportSetFromParser.SetPointsDict.update(
                        dict(zip(PointNameTemp, zeros((len(PointNameTemp), len(PointNameTemp))))))
                    PointNameTemp = FormulaUnitTemp.FormulaProperty['IfPointlist']
                    self.ReportSetFromParser.SetPointsDict.update(
                        dict(zip(PointNameTemp, zeros((len(PointNameTemp), len(PointNameTemp))))))

            self.ReportSetFromParser.FormulaList = FormulaListTemp


class FormulaUnit:
    def __init__(self):
        self.FormulaProperty = {'FormulaOutput': '', 'FormulaPoints': [], 'Method': '', 'Formula': '',
                                'IfPointlist': [], 'IfSetting': ''}
        self.UnitValue = {}
        self.FormulaValue = {}

    def SetUnitValue(self, HisDataFormulaPointsDict):
        FormulaPointsTemp = (self.FormulaProperty['FormulaPoints']).copy()
        if self.FormulaProperty['IfPointlist'] != []:
            for k in self.FormulaProperty['IfPointlist']:
                FormulaPointsTemp.append(k)
        for keys in FormulaPointsTemp:
            self.UnitValue[keys] = array(HisDataFormulaPointsDict[keys])

    def GenerateFormulaOutput(self, HisDataFormulaPointsDict):
        OutputValueDict = {}
        FormulaCalculator = FormulaAlgorithm()

        self.SetUnitValue(HisDataFormulaPointsDict)

        if self.FormulaProperty['Method']:
            OutputValueDict[self.FormulaProperty['FormulaOutput']] = (FormulaCalculator.Calc(
                self.FormulaProperty['Method'], self.FormulaProperty['FormulaPoints'], self.UnitValue,
                self.FormulaProperty['IfPointlist'], self.FormulaProperty['IfSetting'])).tolist()
        elif self.FormulaProperty['Formula']:
            self.FormulaParser()
            OutputValueDict[self.FormulaProperty['FormulaOutput']] = (eval(self.FormulaProperty['Formula'], globals(),
                                                                           self.FormulaValue)).tolist()
        return OutputValueDict

    def FormulaParser(self):
        i = 1
        formulaTemp = self.FormulaProperty['Formula']

        variableNameList = sorted(list(self.UnitValue.keys()), key=lambda name: len(name), reverse=True)

        for key in variableNameList:
            if key in self.FormulaProperty['Formula']:
                formulaValuename = 'x' + str(i)
                formulaTemp = formulaTemp.replace(key, formulaValuename)
                self.FormulaValue[formulaValuename] = self.UnitValue[key]
                i += 1
        self.FormulaProperty['Formula'] = formulaTemp


class FormulaLists:
    ListName = ''

    def __init__(self):
        self.FormulaUnitList = []
        self.FormulaPointsDict = {}

    def GenerateFormulaOutput(self, HisDataFormulaPointsDict):
        self.FormulaPointsDict = HisDataFormulaPointsDict
        for i in range(len(self.FormulaUnitList)):
            self.FormulaPointsDict.update(self.FormulaUnitList[i].GenerateFormulaOutput(self.FormulaPointsDict))
        return self.FormulaPointsDict


class FormulaAlgorithm:
    def Calc(self, FormulaMethod, FormulaPoints, PointDict, ifPoints, ifsetting):
        if FormulaMethod == 'sum':
            return self.GetSum(FormulaPoints, PointDict)
        elif FormulaMethod == 'minus':
            return self.Getminus(FormulaPoints, PointDict)
        elif FormulaMethod == 'Averageif':
            return self.GetAverageif(FormulaPoints, PointDict, ifPoints, ifsetting)
        elif FormulaMethod == 'Average':
            return self.GetAverageif(FormulaPoints, PointDict)

    def GetSum(self, FormulaPoints, PointDict):
        # for now ,only the first data will be input for histogram


        PointValueArray = array(list(PointDict.values()))

        AlgorithmOutputValue = sum(PointValueArray, 0)

        return AlgorithmOutputValue

    def Getminus(self, FormulaPoints, PointDict):
        # for now ,only the first data will be input for histogram
        AlgorithmOutputValue = PointDict[FormulaPoints[1]] - PointDict[FormulaPoints[0]]
        return AlgorithmOutputValue

    def GetAverage(self, FormulaPoints, PointDict):
        # for now ,only the first data will be input for histogram
        AlgorithmOutputValue = []
        for k in FormulaPoints:
            AlgorithmOutputValue += PointDict[k]
        AlgorithmOutputValue = AlgorithmOutputValue / len(FormulaPoints)
        return AlgorithmOutputValue

    def GetAverageif(self, FormulaPoints, PointDict, ifPoints, ifsetting):
        # for now ,only the first data will be input for histogram
        AlgorithmOutputValue = []
        Number = []
        if ifPoints == []:
            ifPoints = FormulaPoints
        CompareresultDict = self.Getifresult(PointDict, ifPoints, ifsetting)

        for i in range(len(FormulaPoints)):
            if AlgorithmOutputValue != []:
                AlgorithmOutputValue += PointDict[FormulaPoints[i]] * CompareresultDict[ifPoints[i]]
                Number += ( CompareresultDict[ifPoints[i]] * 1.0)
            else:
                AlgorithmOutputValue = PointDict[FormulaPoints[i]] * CompareresultDict[ifPoints[i]]
                Number = ( CompareresultDict[ifPoints[i]] * 1.0)
        for i in range(len(Number)):
            if Number[i] == 0:
                AlgorithmOutputValue[i] = 0
            else:
                AlgorithmOutputValue[i] = AlgorithmOutputValue[i] / Number[i]

        return AlgorithmOutputValue

    def Getifresult(self, PointDict, ifPoints, ifsetting):
        CompareresultDict = {}
        for j in range(len(ifPoints)):
            if ifsetting[0] == 'gt':
                CompareresultDict[ifPoints[j]] = PointDict[ifPoints[j]] > eval(ifsetting[1])
            elif ifsetting[0] == 'ge':
                CompareresultDict[ifPoints[j]] = PointDict[ifPoints[j]] >= eval(ifsetting[1])
            elif ifsetting[0] == 'e':
                CompareresultDict[ifPoints[j]] = PointDict[ifPoints[j]] == eval(ifsetting[1])
            elif ifsetting[0] == 'lt':
                CompareresultDict[ifPoints[j]] = PointDict[ifPoints[j]] < eval(ifsetting[1])
            elif ifsetting[0] == 'le':
                CompareresultDict[ifPoints[j]] = PointDict[ifPoints[j]] <= eval(ifsetting[1])
            elif ifsetting[0] == 'ne':
                CompareresultDict[ifPoints[j]] = PointDict[ifPoints[j]] != eval(ifsetting[1])

        return CompareresultDict








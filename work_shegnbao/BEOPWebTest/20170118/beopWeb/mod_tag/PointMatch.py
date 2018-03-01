__author__ = 'huafy'

import random

import xlrd



class CStringMatch:
    def __init__(self, ch_list=None, ahu_list=None):

        self.sort = []
        self.splitChar = ''
        # CH
        self.dataSdPoint_CH = []
        self.dataNotSdPoint_CH = ch_list
        self.dataNotSdpointShort_CH = []
        self.datastoretempEquivalencetag_CH = {}
        self.datastoretempEquivalence_CH = {}
        # AHU
        self.dataSdPoint_AHU = []
        self.dataNotSdPoint_AHU = ahu_list
        self.dataNotSdpointShort_AHU = []
        self.datastoretempEquivalencetag_AHU = {}
        self.datastoretempEquivalence_AHU = {}

    def ReadEquipmentStandardPoint(self, Etype, SourceName):
        # 读取转换规则信息
        # try:
        # 设备名称对应表
        if Etype == 'CH':
            self.dataSdPoint_CH, self.dataNotSdPoint_CH, self.dataNotSdpointShort_CH, self.datastoretempEquivalencetag_CH, self.datastoretempEquivalence_CH = self.ReadExcelsdData(
                Etype, SourceName)
        elif Etype == 'AHU':
            self.dataSdPoint_AHU, self.dataNotSdPoint_AHU, self.dataNotSdpointShort_AHU, self.datastoretempEquivalencetag_AHU, self.datastoretempEquivalence_AHU = self.ReadExcelsdData(
                Etype, SourceName)

        return

    def ReadExcelsdData(self, Etype, SourceName):
        if Etype == 'CH':
            index1 = 0
            index2 = 1
            index3 = 2
        elif Etype == 'AHU':
            index1 = 3
            index2 = 4
            index3 = 5

        dataSdPoint_CH = []
        datastoretempEquivalencetag_CH = {}
        datastoretempEquivalence_CH = {}
        dataNotSdPoint_CH = self.dataNotSdPoint_CH
        data = xlrd.open_workbook(filename=SourceName)
        table = data.sheets()[index1]
        nrows = table.nrows
        for i in range(0, nrows):
            datastoretemp = table.row_values(i)
            dataSdPoint_CH.append(datastoretemp[2])
            temList = []
            for tem in datastoretemp[3:]:
                if tem != '':
                    temList.append(tem)
            datastoretempEquivalencetag_CH[datastoretemp[2]] = temList
        ###################################################################################################################
        # 等价点名
        table = data.sheets()[index2]
        nrows = table.nrows
        for i in range(0, nrows):
            datastoretemp = table.row_values(i)
            # self.dataSdPoint.append(datastoretemp[1])
            temList = []
            for tem in datastoretemp[3:]:
                if tem != '':
                    temList.append(tem)
            datastoretempEquivalence_CH[datastoretemp[1]] = temList
        ################################################################################################################
        ##########读取要疲惫的点
        #################################################################################################################
        # 设备属性名称对应表  self.dataNotSdPoint
        # 统计重复部分
        index1 = random.randint(0, len(dataNotSdPoint_CH) - 1)
        index2 = random.randint(0, len(dataNotSdPoint_CH) - 1)
        repe = CStringMatch.Find_Lcsubstr(dataNotSdPoint_CH[index1], dataNotSdPoint_CH[index2])[0]
        for i in range(1, len(dataNotSdPoint_CH)):
            new_repe = CStringMatch.Find_Lcsubstr(repe, dataNotSdPoint_CH[i])[0]
            repe = new_repe

        # 去除重叠部分
        dataNotSdpointShort_CH = []
        ll = len(repe)
        for i in range(1, len(dataNotSdPoint_CH)):
            inde = dataNotSdPoint_CH[i].find(repe)
            tenmpshort = dataNotSdPoint_CH[i][:inde] + dataNotSdPoint_CH[i][(inde + ll):]

            # 去掉点名中的数字
            noichar = ''
            for ch in tenmpshort:
                if (not ch.isdigit()) and ch != '_' and ch != '.' and ch != ' ':
                    noichar = noichar + ch
            dataNotSdpointShort_CH.append(noichar)

        return dataSdPoint_CH, dataNotSdPoint_CH, dataNotSdpointShort_CH, datastoretempEquivalencetag_CH, datastoretempEquivalence_CH

    def Match(self, Etype):
        from fuzzywuzzy import fuzz
        if Etype == 'CH':
            SdPointName = self.dataSdPoint_CH[:]
            NotSdPoint = self.dataNotSdpointShort_CH[:]
            NotSdPointLong = self.dataNotSdPoint_CH[1:]
            datastoretempEquivalence_CH = self.datastoretempEquivalence_CH
            datastoretempEquivalencetag_CH = self.datastoretempEquivalencetag_CH
        elif Etype == 'AHU':
            SdPointName = self.dataSdPoint_AHU[:]
            NotSdPoint = self.dataNotSdpointShort_AHU[:]
            NotSdPointLong = self.dataNotSdPoint_AHU[1:]
            datastoretempEquivalence_CH = self.datastoretempEquivalence_AHU
            datastoretempEquivalencetag_CH = self.datastoretempEquivalencetag_AHU

        sdLen = len(SdPointName)
        notsdLne = len(NotSdPoint)
        maxLen = max(sdLen, notsdLne)
        valueKey = {}
        AllResult = []
        Weight2 = [0.5, 0.5]
        Weight3 = [0.33, 0.33, 0.33]
        # Weight4=  [1,1,1,1]
        allstdPointList = []
        for k in range(notsdLne):
            if NotSdPoint[k] == '':
                continue
            for onep in SdPointName:  # 集合所有待匹配的标准点
                ten = [onep] + datastoretempEquivalence_CH.get(onep)
                for j in range(len(ten)):
                    valueKey[ten[j]] = onep
                allstdPointList = allstdPointList + ten
            MatchDict = []
            ratiolist = []
            for Kequip in allstdPointList:
                # for k in range(notsdLne):
                mratio = fuzz.ratio(Kequip.lower(), NotSdPoint[k].lower())
                ratiolist.append((NotSdPointLong[k], valueKey[Kequip], mratio))

            sortedname = sorted(ratiolist, key=lambda ratiolist: ratiolist[2], reverse=True)

            MatchDict = [sortedname[0], sortedname[1], sortedname[2]]
            itemtag = datastoretempEquivalencetag_CH[MatchDict[0][1]]
            AllResult.append((list(MatchDict[0]), itemtag))
            # sortedname = sorted(MatchDict,  key=lambda X : X[3], reverse=True)
            # self.sort.append([onep, sortedname[0][0], sortedname[1][0],sortedname[2][0], sortedname[0][1], sortedname[1][1], sortedname[2][1]])
        # self.WriteDateExcel(self.sort, 'matchResult.xlsx')
        for oit in AllResult:
            print(oit)
        return AllResult

    def Find_Lcsubstr(s1, s2):
        m = [[0 for i in range(len(s2) + 1)] for j in range(len(s1) + 1)]  # 生成0矩阵，为方便后续计算，比字符串长度多了一列
        mmax = 0  # 最长匹配的长度
        p = 0  # 最长匹配对应在s1中的最后一位
        for i in range(len(s1)):
            for j in range(len(s2)):
                if s1[i] == s2[j]:
                    m[i + 1][j + 1] = m[i][j] + 1
                    if m[i + 1][j + 1] > mmax:
                        mmax = m[i + 1][j + 1]
                        p = i + 1
        return s1[p - mmax:p], mmax  # 返回最长子串及其长度

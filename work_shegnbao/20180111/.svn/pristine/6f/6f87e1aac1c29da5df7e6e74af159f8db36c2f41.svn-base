__author__ = 'huafy'
#遗传算法
import pandas as pd
#import xlrd
import numpy as np
from beopWeb.mod_tag.Sim_Distance import *
import datetime

ObjClassDis = Simdistance()
class CGA:
    def __init__(self):
        self.taglib=[]
        self.matchstring = 'ChillerAMP01'
        self.seedsize = 2
        self.maxgen = 1

    def readtaglib(self):
        data = pd.read_excel('taglib.xlsx','Sheet1')
        values = list(data._values)
        for i in range(len(values)):
            self.taglib.append(values[i][1])
        #self.selgroup(10)
        return
    #选择群体
    def selgroup(self,codelen):
        codelen = codelen-1
        SelG = []
        countall = int(self.seedsize*codelen)
        for i in range(countall):
            temp = list(np.random.rand(codelen))
            for j in range(len(temp)):
                if temp[j]>0.80:
                    temp[j] =1
                else:
                    temp[j] = 0
            SelG.append(temp)
        return SelG
    #计算各组编码的适应度
    def calfitness(self,codelist):
        fitness = []
        px =[]
        allsplitstr = []
        allMatchstr = []
        if codelist ==[]:
            return fitness,px,allsplitstr,allMatchstr,codelist

        clen = len(codelist)
        for i in range(clen):
            per_codelist = codelist[i]
            splitindex = []
            for j in range(len(per_codelist)):
                if per_codelist[j] >0:
                    splitindex.append(j+1)
            splitindex.append(len(per_codelist)+1)

            strsplit = []
            for k in range(len(splitindex)):
                ends = splitindex[k]
                if k ==0:
                    substr = self.matchstring[0:ends]
                else:
                    start = splitindex[k-1]
                    substr = self.matchstring[start:ends]

                strsplit.append(substr)
            allsplitstr.append(strsplit)
            #计算适应函数值
            Allfn = 0
            Matchstr = []
            for  nonestr in strsplit:
                #fn1 = ObjClassDis.getNeighbors(['Control','Cooling'],'Cool')
                if nonestr.lower() == 'ch':
                    nonestr = 'Chiller'
                fn = ObjClassDis.getNeighbors(self.taglib,nonestr)
                if fn ==[]:
                    continue
                else:
                    num = fn[0][1]
                    Allfn = Allfn + num*len(nonestr)
                    Matchstr.append(fn[0][0])
            fitness.append(Allfn)
            allMatchstr.append(Matchstr)
        #针对适应度为0的组，全部删掉
        fitness_temp = []
        allsplitstr_temp = []
        allMatchstr_temp = []
        codelist_temp =[]
        for i in range(len(fitness)):
            if fitness[i]>0.01:
                fitness_temp.append(fitness[i])
                allsplitstr_temp.append(allsplitstr[i])
                allMatchstr_temp.append(allMatchstr[i])
                codelist_temp.append(codelist[i])
        fitness = fitness_temp
        allsplitstr = allsplitstr_temp
        allMatchstr = allMatchstr_temp
        codelist = codelist_temp

        #计算概率分布
        px = []
        asum = sum(fitness)
        for i in range(len(fitness)):
            p = fitness[i]/asum
            px.append(p)

        #按fitness大小排序
        #array = fitness
        n= len(fitness)
        for i in range(1,n):
            j=i-1
            temp=fitness[i];
            cc = codelist[i]
            slitstr = allsplitstr[i]
            matstr = allMatchstr[i]
            pp = px[i]
            while (j>=0 and fitness[j]<temp):
                fitness[j+1]=fitness[j];
                codelist[j+1]=codelist[j];
                allsplitstr[j+1]=allsplitstr[j];
                allMatchstr[j+1]=allMatchstr[j];
                px[j+1]=px[j];
                j=j-1
            fitness[j+1]=temp;
            codelist[j+1] = cc
            allsplitstr[j+1]=slitstr;
            allMatchstr[j+1] = matstr
            px[j+1]=pp

        return fitness,px,allsplitstr,allMatchstr,codelist
    #选择种群
    def selseed(self,codelist,px):

        #以轮盘赌方式选择种群
        #px = array
        for i in range(1,len(px)):
            px[i] = px[i-1]+px[i]

        lastselseed = []
        for i in range(len(codelist)):
            index = -1
            randnum = np.random.rand()
            for j in range(len(px)):
                if j == 0 and randnum <px[0]:
                    index = 0
                    break
                else:
                    if randnum> px[j-1] and randnum <=px[j]:
                        index = j
                        break

            if index >=0:
                lastselseed.append(codelist[index])

        return lastselseed  #返回按适应度排序的codelist及新选的种群
    #种群交配函数
    def recombin(self,lastselseeds):
        #基因片段分成三份
        if lastselseeds==[]:
            return []
        oneseed = lastselseeds[0]
        length = len(oneseed)

        if length >=10: #分三段
            split1index = int(length/3)
            split2index = int(length*2/3)
            seedcount = len(lastselseeds)
            n = int(seedcount/2)
            for i in range(n):
                seed1 = lastselseeds[2*i]
                seed2 = lastselseeds[2*i+1]
                tindex = np.random.randint(0,3)
                if tindex ==0:
                    tstart = 0
                    tend  = split1index
                if tindex == 1:
                    tstart = split1index
                    tend  = split2index
                if tindex == 2:
                    tstart = split2index
                    tend  = length

                #替换
                seed1temp = seed1[tstart:tend]
                seed2temp = seed2[tstart:tend]

                lastselseeds[2*i][tstart:tend] = seed2temp
                lastselseeds[2*i+1][tstart:tend] = seed1temp
        else:
            split1index = int(length/2)
            seedcount = len(lastselseeds)
            n = int(seedcount/2)
            for i in range(n):
                seed1 = lastselseeds[2*i]
                seed2 = lastselseeds[2*i+1]
                tindex = np.random.randint(0,2)
                if tindex ==0:
                    tstart = 0
                    tend  = split1index
                if tindex == 1:
                    tstart = split1index
                    tend  = length
                #替换
                seed1temp = seed1[tstart:tend]
                seed2temp = seed2[tstart:tend]

                lastselseeds[2*i][tstart:tend] = seed2temp
                lastselseeds[2*i+1][tstart:tend] = seed1temp


        return  lastselseeds
    #变异
    def mutate(self,recombinseeds,rate):
        if recombinseeds==[]:
            return []
        n = len(recombinseeds[0])
        for i in range(len(recombinseeds)):
            randnum = np.random.rand()
            if randnum<rate: #发生变异
                rindex = np.random.randint(0,n)
                if recombinseeds[i][rindex] ==0:
                    recombinseeds[i][rindex] = 0
                else:
                    recombinseeds[i][rindex] = 0
        return recombinseeds

    def strmatchGA(self,str,Retain ='',splitchar=[]):

        #保留Retain部分不进行匹配
        if Retain != '':
            index = str.find(Retain)
            if index !=-1:
                str = str[0:index]+str[index+len(Retain):]
        #把被'-._'包围的单字符去掉
        for i in range(len(str)):
            if i==0 and str[i].isalpha() and (str[i+1] == '_' or str[i+1] == ' ' or str[i+1] == '.'):
                str = str[0:i]+'_'+str[i+1:]
            else:
                if i==len(str)-1 and str[i].isalpha() and (str[i-1] == '_' or str[i-1] == ' ' or str[i-1] == '.'):
                    str = str[0:i]+'_'+str[i+1:]
                else:
                    if str[i].isalpha() and (str[i-1] == '_' or str[i-1] == ' ' or str[i-1] == '.') and (str[i+1] == '_' or str[i+1] == ' ' or str[i+1] == '.'):
                        str = str[0:i]+'_'+str[i+1:]

        #后程序修改添加,去掉splitchar的内容
        if splitchar != []:
            strList = list(str)
            for i in range(len(strList)):
                for j in range(len(splitchar)):
                    if strList[i] == splitchar[j]:
                        strList[j] ='_'
                        break;
            for i in range(len(splitchar)):
                if len(splitchar[i])==2:
                    strs = ''.join(strList)
                    k = strs.find(splitchar[i])
                    while k>-1:
                        strList[k] ='_'
                        strList[k+1] ='_'
                        strs = ''.join(strList)
                        k = strs.find(splitchar[i])

            #str = ''.join(strList)
            #如果字母从小写变成大写，则加入拆分符
            splitindex = []
            new_strList = []
            for i in range(len(strList)-1):
                new_strList.append(strList[i])
                if strList[i].islower() and strList[i+1].isupper():
                   #splitindex.append(i+1)
                    new_strList.append('_')
            new_strList.append(strList[len(strList)-1])

        #0依据字符串原始"-. _",构成一个分组加入到种群中，然后剔除串中的"-. _"

        #如果连续三个以上大写字母接着小写字母，在最后一个大写字母之前分开
            strList = []
            for i in range(len(new_strList)-1):
                if i<2:
                    strList.append(new_strList[i])
                    continue
                if new_strList[i+1].islower() and new_strList[i].isupper() and new_strList[i-1].isupper() and new_strList[i-2].isupper():
                    strList.append('_')

                strList.append(new_strList[i])
            strList.append(new_strList[len(new_strList)-1])
        str = ''.join(strList)
        if str == '':
            pass
        clist = [0]*len(str)
        noichar = ''
        index = 0
        for i in range(len(str)):
            ch = str[i]
            if  ch != '_'and ch != '.'and ch != ' ':
                noichar = noichar+ch
                index= index+1
            else:
                if i == 0:
                    continue
                clist[index-1] = 1
        clist = clist[0:len(noichar)-1]

        str = noichar
        self.matchstring = str
        rate = 0.1 #变异概率
        maxgen = self.maxgen #最大遗传代数
        gen = 0

        #1、原始族群
        iniGroup = []#self.selgroup(len(str))
        iniGroup.append(clist)
        codelen = len(str)
        goupCount = len(iniGroup)
        #2、优化
        #lastbettercodelist = []
        bestfitness = 0
        bestallsplitstr =[]
        bestallMatchstr = []
        while gen <maxgen:
            #iniGroup.append(clist)
            fitness,px,allsplitstr,allMatchstr,sortiniGroup = self.calfitness(iniGroup)
            #lastbettercodelist = sortiniGroup[0:int(len(iniGroup)/3)]
            #选择种群
            #返回按适应度排序的原始族群及依据适应度所选择的种群
            lastselseeds = self.selseed(iniGroup,px)
            #交配后的族群
            recombincodelist = self.recombin(lastselseeds)
            #编译后的族群
            mutatecodelist = self.mutate(recombincodelist,rate)
            # newfitness,newpx,newallsplitstr,newallMatchstr,newsortiniGroup = self.calfitness(mutatecodelist)
            #
            # index = int(goupCount/3)
            # newsortiniGroup.reverse()
            # iniGroup = sortiniGroup[0:index]+newsortiniGroup[index:]  #原族群中最好的1/3与新族群中最好的2/3，组成新的族群
            iniGroup = mutatecodelist
            gen =gen+1
            if fitness != []:
                if bestfitness < fitness[0]:
                    bestfitness = fitness[0]
                    bestallsplitstr = allsplitstr[0]
                    bestallMatchstr = allMatchstr[0]
            else:
                break

        #最后结果


        return bestfitness,bestallsplitstr,bestallMatchstr

    def DeleteSpecialChar(self,tenmpshort):
        #去掉点名中的数字
        noichar = ''
        for ch in tenmpshort:
            # if (not ch.isdigit()) and ch != '_'and ch != '.'and ch != ' ':
            if (not ch.isdigit()):
                noichar = noichar+ch
            else:
                noichar = noichar+'_'

        return noichar

    def Find_Lcsubstr(self,s1, s2,type):
        m=[[0 for i in range(len(s2)+1)]  for j in range(len(s1)+1)]  #生成0矩阵，为方便后续计算，比字符串长度多了一列
        mmax=0   #最长匹配的长度
        p=0  #最长匹配对应在s1中的最后一位
        for i in range(len(s1)):
            for j in range(len(s2)):
                if s1[i]==s2[j]:
                    m[i+1][j+1]=m[i][j]+1
                    if m[i+1][j+1]>mmax:
                        mmax=m[i+1][j+1]
                        p=i+1
        return s1[p-mmax:p],mmax   #返回最长子串及其长度

    def Findrepeat(self,dataNotSdPoint_CH,Type):
        index1 = random.randint(0,len(dataNotSdPoint_CH)-1)
        index2 = random.randint(0,len(dataNotSdPoint_CH)-1)
        repe = self.Find_Lcsubstr(dataNotSdPoint_CH[index1],dataNotSdPoint_CH[index2],type)[0]
        for i in range(1,len(dataNotSdPoint_CH)):
            new_repe = self.Find_Lcsubstr(repe,dataNotSdPoint_CH[i],type)[0]
            repe = new_repe

        #去除重叠部分
        dataNotSdpointShort_CH =[]
        ll = len(repe)
        for i in range(1,len(dataNotSdPoint_CH)):
            inde = dataNotSdPoint_CH[i].find(repe)
            tenmpshort = dataNotSdPoint_CH[i][:inde] + dataNotSdPoint_CH[i][(inde+ll):]
            dataNotSdpointShort_CH.append(tenmpshort)

    def MatchString(self,MatchStr,Remian):

        STR1 = self.DeleteSpecialChar(MatchStr)
        Retain1 = self.DeleteSpecialChar(Remian)
        A,B,C = self.strmatchGA(STR1,Retain1)
        return A,B,C

    def MatchStringList(self,MatchStrList,Remian,splitchar,tagLib):

        AList = []
        BList = []
        CList = []
        if tagLib ==[]:
            return AList,BList,CList
        if tagLib ==None:
            pass
        else:
            self.taglib = tagLib
        if MatchStrList ==[]:
            return AList,BList,CList
        for i in range(len(MatchStrList)):
            STR1 = self.DeleteSpecialChar(MatchStrList[i]) #去掉数字
            Retain1 = self.DeleteSpecialChar(Remian)       #去掉数字
            A,B,C = self.strmatchGA(STR1,Retain1,splitchar)          #匹配
            AList.append(A)
            BList.append(B)
            CList.append(C)
        return AList,BList,CList


if __name__ == '__main__':

    CSMatch = CGA()
    CSMatch.readtaglib()

    STRList = []
    ####################################
    data = pd.read_excel('tagtest.xlsx','Sheet1')
    values = list(data._values)
    for i in range(len(values)):
        STRList.append(values[i][1])

    #####################################


    Retain1 = 'Roof'
    begin = datetime.datetime.now()
    # STRList = ['L1S1_VAVC1_HEAT_COOL_L','L10S1_VAVC1_airVolume',
    #            'L10S1_VAVC1_CtlStpt','L10S1_VAVC1_DAY.NGT',
    #            'L10S1_VAVC2_ClgFlowMax','A11AHU_A_21_TempSaOut',
    #            'A11AHU_A_21_VFPos','A11AHU_A_11_Season',
    #           'A12FCU_A_12_Temp',
    #            'L10S1_VAVC1_CtlTmp','L10S1_VAVC1_DmprComd']

    # STRList = ['PODL02M_CHW001_Valve_AutoMode',
    # 'PODL02M_CHW001_Valve_CloseStatus',
    # 'PODL02M_CHW001_Valve_OpenStatus--CTS--Pump']

    # STRList = ['PODL02M_CW001_Valve_AutoMode',
    # 'PODL02M_CW001_Valve_CloseStatus',
    # 'PODL02M_CW001_Valve_OpenStatus',
    # 'PODL02M_Ch001_OnOffSet']

    #STRList = ['L1S1_VAVC1_HEAT_COOL']

    #STRList = ['L10S1_VAVC1_CtlTmp','L10S1_VAVC1_airVolume']
    #CLlist 为最终的tag结果
    Alist,BList,Clist = CSMatch.MatchStringList(STRList,Retain1,['_','-','--','++'],['ct','ch'])
    end = datetime.datetime.now()
    print ((end-begin).seconds)

    df = pd.DataFrame(list(Clist))
    df['pointname'] = pd.DataFrame(STRList)
    df.to_excel('matchResult.xlsx', sheet_name='res')

    for i in range(len(Alist)):
        print(STRList[i], '    ',Clist[i])

    print('over')


CSMatch = CGA()

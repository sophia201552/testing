# -*- encoding=utf-8 -*-
__author__ = 'golding'
from ExpertContainer.api import *
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.api.utils import *
import pika,json

class DependAnalyst:
    def __init__(self, rely_dict):
        self.rely_dict = rely_dict
        self.nondepList = []
        self.depList = []
        self.gradePoint = {}
        self.pointAffect = {}

        for key in rely_dict:
            arr = rely_dict.get(key, [])
            if len(arr)<=0:
                self.nondepList.append(key)
                self.gradePoint[key] = 0
            else:
                self.depList.append(key)
                self.gradePoint[key] = 0
                for pt in arr:
                    if self.pointAffect.get(pt):
                        self.pointAffect[pt].append(key)
                    else:
                        self.pointAffect[pt] = [key]

    def analysis(self):
        for pointName in self.depList:
            arr = self.rely_dict.get(pointName, [])
            self.increaseGrade(pointName)

        for i in range(0, len(self.depList)-1):
            for j in range(i+1, len(self.depList)):
                if self.gradePoint.get(self.depList[i]) > self.gradePoint.get(self.depList[j]):
                    strTemp = self.depList[i]
                    self.depList[i] = self.depList[j]
                    self.depList[j] = strTemp

        #insert related points
        for i in range(len(self.depList)):
            pointName = self.depList[i]
            arr = self.rely_dict.get(pointName)
            if arr is None:
                continue
            for ptbb in arr:
                if ptbb not in self.depList and ptbb not in self.nondepList:
                    nIndex = self.depList.index(pointName)
                    self.depList.insert(nIndex, ptbb)

        rvList = self.nondepList
        rvList.extend(self.depList)
        return rvList



    def increaseGrade(self, ptName):
        nCurGrade = self.gradePoint.get(ptName)
        if nCurGrade is None:
            nCurGrade = 0

        self.gradePoint[ptName] = nCurGrade+1

        ptAffects =  self.pointAffect.get(ptName)
        if ptAffects:
            for ptAF in ptAffects:
                self.increaseGrade(ptAF)

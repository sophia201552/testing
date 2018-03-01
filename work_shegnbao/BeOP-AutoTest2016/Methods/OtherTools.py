__author__ = 'woody'
import time, string, random, unittest, sys, os
from Methods.Log import Log
from xlrd import open_workbook
from config import app
from datetime import datetime
import base64
from Methods.BEOPMongoDataAccess import BEOPMongoDataAccess
import requests
class OtherTools:
    logName = app.config['OTHERTOOLS_LOG']

    def __init__(self):
        pass

    #给OtherTools创建一个实例并返回
    def getInstance(self):
        if(self.__instance == None):
            self.__instance = OtherTools()
        return self.__instance

    @classmethod
    def setBrowser(self, lg, browser):
        lg.browser = browser

    @classmethod
    def raiseError(self, errors):
        if isinstance(errors, list) and errors:
            assert 0, "<br/>".join(errors)


    # 获取当前时间字符串
    @classmethod
    def getStrTime(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


    # 获取随机字母字符串(randomlength为字符串长度, 其中字母不重复)
    @classmethod
    def random_str(self, randomlength=8):
        a = list(string.ascii_letters)
        random.shuffle(a)
        return ''.join(a[:randomlength])

    @classmethod
    def getExcelFile(self, page):
        try:
            data = open_workbook(os.path.join(app.config['CSS_PAGE'], page+'.xlsx'))
            #选取sheet1
            sheet = data.sheet_by_index(0)
            if sheet.nrows > 1:
                return [sheet.row_values(i) for i in range(1, sheet.nrows)]
        except Exception as e:
            Log.writeLogError(self.logName, 'funcname: getExcelFile error: %s' % e.__str__())
            return []
        return []

    @classmethod
    def getCss(self, page, eleName):
        data = self.getExcelFile(page)
        for line in data:
            if eleName == line[0]:
                return line[1]
        return None

    @classmethod
    def generateImg(self, caseID, startTime, endTime):
        #获取case文件夹的错误截图 base64
        index = 0
        b64pic = None
        dir = os.path.join(app.config['BASE_DIR'], 'ErrorPicture\%s' % caseID)
        if not os.path.exists(dir):
            return None
        try:
            files = os.listdir(dir)
            filenameList = [f[:-4].split(' ')[0]+" "+f[:-4].split(' ')[1].replace("-", ":") for f in files]
            stStr = datetime.now().strftime("%Y-%m-%d %H:%M:%S").split(' ')[0] + ' ' + startTime
            etStr = datetime.now().strftime("%Y-%m-%d %H:%M:%S").split(' ')[0] + ' ' + endTime
            st = datetime.strptime(stStr, '%Y-%m-%d %H:%M:%S')
            et = datetime.strptime(etStr, '%Y-%m-%d %H:%M:%S')
            for f in filenameList:
                if st <= datetime.strptime(f, '%Y-%m-%d %H:%M:%S') <= et:
                    index = filenameList.index(f)
                    break
            with open(os.path.join(dir, files[index]), 'rb') as fileobj:
                btContent = fileobj.read()
            b64pic = base64.b64encode(btContent).decode()
        except Exception as e:
            pass
        return b64pic




    @classmethod
    def generateFile(self, caseID, startTime, endTime):
        #获取case文件夹的错误截图 base64
        index = 0
        file = None
        dir = os.path.join(app.config['BASE_DIR'], 'ErrorPicture\%s' % caseID)
        if not os.path.exists(dir):
            return None, None
        try:
            files = os.listdir(dir)
            filenameList = [f[:-4].split(' ')[0]+" "+f[:-4].split(' ')[1].replace("-", ":") for f in files]
            stStr = datetime.now().strftime("%Y-%m-%d %H:%M:%S").split(' ')[0] + ' ' + startTime
            etStr = datetime.now().strftime("%Y-%m-%d %H:%M:%S").split(' ')[0] + ' ' + endTime
            st = datetime.strptime(stStr, '%Y-%m-%d %H:%M:%S')
            et = datetime.strptime(etStr, '%Y-%m-%d %H:%M:%S')
            for f in filenameList:
                if st <= datetime.strptime(f, '%Y-%m-%d %H:%M:%S') <= et:
                    index = filenameList.index(f)
                    break
            file = files[index]
        except Exception as e:
            pass
        objId = self.generateBs64(caseID, file)
        return file, objId

    @classmethod
    def generateBs64(self, caseId, file):
        filepath = os.path.join(app.config['BASE_DIR'], 'ErrorPicture\%s\%s' % (caseId, file))
        with open(filepath, 'rb') as fileobj:
            btContent = fileobj.read()
        b64pic = base64.b64encode(btContent).decode()
        r = requests.post(url='http://140.207.49.230:5008/savePic', json={'caseId': caseId, 'filename': file, 'machine': app.config['USER'], 'bsPic': b64pic})
        return r.text

    @classmethod
    def getBs64(self, caseId, file):
        a = requests.get('http://140.207.49.230:5008/{}/{}/{}'.format(caseId, file, app.config['USER']))
        return a.text
        #a = BEOPMongoDataAccess(app.config['MONGO_ADDR'])
        #a.mdbBb.find_one({'caseId': caseId, 'filename': file, 'machine' : app.config['MACHINE']})
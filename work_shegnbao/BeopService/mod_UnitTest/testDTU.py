__author__ = 'rdg'

from mod_DataAccess.BEOPDataAccess import BEOPDataAccess

class testDTU():
    def testWarningRecord(self):
        rvPost = {
           "dtuName" : "dajin345678",
           "warningList" : [
              {
                 "bUpdate" : 0,
                 "nConfirmed" : 0,
                 "nLevel" : 0,
                 "strHappenTime" : "2016-02-03 00:00:00",
                 "strInfo" : "testpoin1",
                 "strPointName" : "testpoin1",
                 "strConfirmedUser":"user1",
                 "strTime" : "2016-02-03 00:00:00"
              },
              {
                 "bUpdate" : 0,
                 "nConfirmed" : 0,
                 "nLevel" : 0,
                 "strHappenTime" : "2016-02-02 00:00:00",
                 "strInfo" : "testpoin2",
                 "strPointName" : "testpoin2",
                 "strConfirmedUser":"user2",
                 "strTime" : "2016-02-03 00:00:00"
              }
           ]
        }

        BEOPDataAccess.getInstance().saveWarningRecord(rvPost['dtuName'], rvPost['warningList'])

    def testOperation(self):
        rvPost = {
           "dtuName" : "dajin345678",
           "operationList" : [
              {
                 "strTime" : "2016-02-03 00:00:00",
                 "strUser" : "Operator",
                 "strOperation" : "登录软件"
              },
              {
                 "strTime" : "2016-02-03 11:00:00",
                 "strUser" : "Operator",
                 "strOperation" : "退出软件成功"
              }
           ]
        }
        BEOPDataAccess.getInstance().saveOperationList(rvPost['dtuName'],rvPost['operationList'])


    def testConfig(self):
        rvPost = {
           "dtuName" : "dajin345678",
           "configList" : [
              {
                 "strparamname" : "myparam1",
                 "strparamvalue" : "666.66",
              },
              {
                 "strparamname" : "myparam2",
                 "strparamvalue" : "888.8888",
              }
           ]
        }
        BEOPDataAccess.getInstance().saveConfigList(rvPost['dtuName'],rvPost['configList'])

    def testOutputToSiteTable(self):
        BEOPDataAccess.getInstance().getOutputToSiteTable(['dajin345678', 'panda345678'])

if __name__=='__main__':
    testObj = testDTU()
    testObj.testConfig()
    testObj.testOperation()
    testObj.testWarningRecord()
    testObj.testOutputToSiteTable()

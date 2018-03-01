#coding=utf-8
__author__ = 'sophia'
from ExpertContainer.logic.LogicBase import LogicBase
import datetime
import pytest
import random
from ExpertContainer.api.api import  HistoryDataMethods
import string
from ExpertContainer.dbAccess.BEOPMongoDataAccess import BEOPMongoDataAccess
from tests.utils import *
pointname=['testp1','testp2','testp3','testp4','testp5','testp6','testp7']
proj=49
test_time=[
    datetime.datetime(year=2017, month=11, day=11, hour=12),
    datetime.datetime(year=2017,month=8,day=2,hour=12),
        ]
@pytest.mark.p0
@pytest.mark.usefixtures('deletePointFromMongo')
@pytest.mark.parametrize(('projId','strPointName', 'strTime','strValue','mode'),[
    (proj,pointname[0],test_time[0],'1',0),
    (proj,pointname[1],test_time[1],'1',1),
    (proj,pointname[2],test_time[0],'1',2),
    (proj,pointname[3],test_time[1],'1',3),
    (proj,pointname[4],test_time[0],1,0),
    (proj,pointname[5],test_time[0].strftime('%Y-%m-%d %H:%M:%S'),1,0),
    (proj,pointname[6],test_time[0],1.0,0),
])
def test_correct(projId,strPointName, strTime,strValue,mode):
    lb = LogicBase(projId, strTime, nMode = mode)
    assert lb, "create instance failed"
    rt = lb.set_data_history(strPointName, strTime,strValue)
    assert rt,'set_data_history: return value is False'

    if isinstance(strTime,str):
        strTime=datetime.datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
    actual=lb.get_data_at_time(projId, [strPointName], strTime.strftime("%Y-%m-%d %H:%M:%S"))
    assert actual,'actual is none'
    assert None not in actual,'actual is none'
    for index, item in enumerate(actual):
        if isinstance(item, str):
            assert item == str(strValue), "index = %s, expected value is %s, actual value is %s" % (
            index, strValue, item)
        elif isinstance(item, float):
            assert almost_equals(item, float(strValue)), "index = %s, expected value is %s, actual value is %s" % (
            index, strValue, item)

@pytest.mark.p0
@pytest.mark.parametrize(('projId','strPointName', 'strTime','strValue'),[
    (None,None,None,None),
    (-1, pointname[0], test_time[0],1),
])
def test_wrong(projId,strPointName, strTime,strValue):
    lb = LogicBase(projId, strTime)
    assert lb, "create instance failed"
    rt = lb.set_data_history(strPointName, strTime, strValue)
    assert not rt, 'set_data_history: return value is not False'






@pytest.fixture(scope='function')
def deletePointFromMongo(request):
    def fin():
        iter_time=(t for t in test_time)
        for point in pointname:
            iter_time_one=next(iter_time,None)
            if iter_time_one is None:
                continue
            lb=LogicBase(proj, iter_time_one)
            lb.delete_one_record(proj, point,iter_time_one.strftime("%Y-%m-%d %H:%M:%S")), "failed to delete history test data"
    request.addfinalizer(fin)





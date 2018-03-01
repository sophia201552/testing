#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
import random
@pytest.mark.parametrize(('prjId', 'pointList','valueList'),[
    (49,['test20171111'],[str(random.randint(1,300))]),
    (49,['test20171111','test20171102'],[str(random.randint(1,300)),str(random.randint(1,300))])
])
@pytest.mark.p0
def test_correct(prjId,pointList,valueList):
    test_time = datetime.datetime.now().replace(second=0,minute=0)
    lb = LogicBase(prjId, test_time)
    assert lb, "create instance LogicBase failed"
    actual=lb.set_clear_data_from_site(prjId, pointList,valueList)
    assert actual, 'set clear data from site:return False'
    actual_of_time=BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProj(prjId, pointList)
    now = datetime.datetime.now()
    for index,point in enumerate(pointList):
        actual_value=actual_of_time.get(point)[1]
        assert actual_value==valueList[index],'expected value is %s,actual data of %s is not update,'%(pointList[0],valueList[index],actual_value)
    #delete test data
    assert BEOPDataAccess.getInstance().deletePointFromBufferData(prjId,pointList), "failed to delete real test data"
    assert BEOPDataAccess.getInstance().deletePointFromMysql(prjId, pointList),"failed to delete real test data"

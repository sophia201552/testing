# coding=utf-8
from ExpertContainer.api.views import *
import pytest
import json
from ExpertContainer.logic.LogicBase import LogicBase
import datetime
projId=194

@pytest.mark.p0
@pytest.mark.parametrize(('data','flag'), [
    ({'projId':projId},True),
    ({},False),
])
def test_calcpoint_calcAllReal(data,flag):
    if flag:
        rt = json.loads(do_calc_project_calcpoint(data))
        assert isinstance(rt, dict), 'actual is not dict'
        assert len(rt), 'actual length is 0'
        realtime_data=BEOPDataAccess.getInstance().getAllPointTimeValueList(projId)
        valueList=[]
        nameList=[]
        timeList=[]
        for index,item in enumerate(realtime_data.get('flagList')):
            if item==2:
                valueList.append(realtime_data.get('valueList')[index])
                nameList.append(realtime_data.get('nameList')[index])
                timeList.append(realtime_data.get('timeList')[index])
        assert  len(rt)==len(nameList),'project id ={0} flag=2 point expected length is{1},actual is {2}'.format(projId,len(nameList),len(rt))

        for index,name in enumerate(nameList):
            assert name in str(rt.keys()) ,'actual data does not exist point {0}'.format(name)
            assert str(rt.get(name))==str(valueList[index]),'acutal point {0} value is {1},which differs from expected={2}'.format(name,rt.get(name),valueList[index])
            realtime=datetime.datetime.strptime(timeList[index], '%Y-%m-%d %H:%M:%S')
            assert (datetime.datetime.now()-realtime).seconds<=300,'point {0} time is not update ,acutal is {1}'.format(name,timeList[index])

    else:
        rt = json.loads(do_delete_export_files(data))
        assert rt.get('success')==False and rt.get('msg')=='','acutal is not False,acutal is {0}'.format(rt)



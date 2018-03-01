#coding=utf-8
from ExpertContainer.api.views import *
import pytest
import json
from ExpertContainer.dbAccess import mongo_operator

newName='calc_api_test_1'
proId=49
@pytest.mark.p0
@pytest.mark.usefixtures("resetName")
@pytest.mark.parametrize(('data'),[
    ({"apiName":"calc_api_test","newName":newName,}),

])
def test_correct(data):
    rt = json.loads(do_reNameApiInCalc(data))
    assert rt,'do_reNameApiInCalc return value is null'
    assert not rt.get('error'),'do_reNameApiInCalc error is nor 0'
    assert rt.get('data')[0].get('name')==data.get('apiName'),'do_reNameApiInCalc updata is fail ,expected api name is {0},acutal api name is   {1}'.format(newName,rt.get('data')[0].get('name'))
    find_update_api_name=mongo_operator.find_api_in_calc_module([proId],newName)
    assert newName in find_update_api_name[0].get('code')[0],'mongo database update fail,expected api name is {0},actual api name is            {1}'.format( newName,find_update_api_name[0].get('moduleName'))



@pytest.mark.p0
@pytest.mark.parametrize(('data','expected'),[
    ({"apiName":"calc_api_test_2","newName":'calc_api_test_2'},"api 'calc_api_test_2' not found in mongoDB"),
    ({},"api 'None' not found in mongoDB")
])
def test_wrong(data,expected):
    rt = json.loads(do_reNameApiInCalc(data))
    assert rt,'do_reNameApiInCalc return value is null'
    assert not rt.get('error'),'do_reNameApiInCalc error is nor 0'
    assert rt.get('msg')==expected,'error message is not equal expected,actual is {0},expected is {1}'.format(rt.get('msg'),expected)


@pytest.fixture(scope='function')
def resetName(request):
    def fin():
        do_reNameApiInCalc({"apiName":newName,"newName":"calc_api_test"})
    request.addfinalizer(fin)


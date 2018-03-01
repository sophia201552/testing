#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *
from ExpertContainer.api.views import *

#这个批量的功能，没有说明文档的话，一般人还真的不会用，也不知道怎么使用
@pytest.mark.p0
@pytest.mark.parametrize(("projId", "logic_content"), [(49, "def main_t1():\n    return 1\ndef main_t2():\n    return 2\ndef main_t3():\n    return 3")])
def test_cloudpoint_onlinetest_batch(projId, logic_content):
    rt = {}
    error_count = do_batch_encapsule(projId, logic_content, rt)
    assert error_count == 0, "error occurs"
    expected_values = {'t1':1, 't2':2, 't3':3}
    for name in expected_values:
        assert name in rt, "calcpoint %s is not in result"%(name,)
        assert len(rt.get(name).get('process')) > 0, "process list must be more than 1"
        assert rt.get(name).get('error') == 0, "error must be 0"
        assert rt.get(name).get('value') == expected_values.get(name), "calc result is not equal of %s"%(name,)


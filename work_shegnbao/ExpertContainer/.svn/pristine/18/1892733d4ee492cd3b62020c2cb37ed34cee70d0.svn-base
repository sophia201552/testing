#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
def test_time_to_string():
    datetime_string = '2013-10-11 00:12:00'
    datetime_obj = datetime.strptime(datetime_string, '%Y-%m-%d %H:%M:%S')
    lb = LogicBase(49, datetime.now())
    assert lb.time_to_string(datetime_obj) == datetime_string, "time_to_string error:can not get corrent timestamp string from datetime object"

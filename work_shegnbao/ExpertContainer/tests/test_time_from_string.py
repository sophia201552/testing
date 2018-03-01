#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
def test_time_from_string():
    datetime_string = '2013-10-11 00:12:00'
    lb = LogicBase(49, datetime.now())
    datetime_obj = datetime.strptime(datetime_string, '%Y-%m-%d %H:%M:%S')
    assert lb.time_from_string(datetime_string) == datetime_obj, "time_from_string error:can not get corrent datetime object from timestamp string"


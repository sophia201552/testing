#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest


@pytest.mark.p0
@pytest.mark.parametrize(('projId'),[
    (49),
    (72),
])
def test_correct(projId):
    lb = LogicBase(projId, datetime.now())
    assert lb, "create instance failed"
    rt = lb.get_storage_by_projId()

    assert rt>0,'actual={0}'.format(rt)


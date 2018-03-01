#-*- coding: utf-8 -*-

import pytest
from datetime import datetime, timedelta
from tests.utils import TestCommon
import time
from functools import reduce

@pytest.mark.p0
def test_copy_realtimedata_between_project():
    sourceProjId = 72
    destinationProjId = 74
    arguments = {
        "projIdCopyFrom":sourceProjId,
        "projIdCopyTo":destinationProjId
    }
    real_point_list = ["H14AHU_H_14_TempSaIn", "H14AHU_H_14_VlvColdReg"]
    expected_value = TestCommon.getRealtimeData_with_time.run({
        'projId': sourceProjId,
        'pointList': real_point_list
    })
    rt = TestCommon.CopyRealtimedataBetweenProject.run(arguments)
    actual_value = TestCommon.getRealtimeData_with_time.run_of_raw({
        'projId': destinationProjId,
        'pointList': real_point_list
    })
    TestCommon.CopyRealtimedataBetweenProject.assert_result(expected_value, actual_value, rt)
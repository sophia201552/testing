#coding=utf-8
__author__ = 'angelia'

import pytest
from ExpertContainer.api.views import *
from ExpertContainer.dbAccess.RedisManager import RedisManager

@pytest.mark.p2
@pytest.mark.parametrize(('projId', 'nameList', 'userId', 'timeFrom', 'timeTo', 'format', 'all', 'expected'),[
    (49, ['test_alarm', 'test_alarm01'], 456, '2017-12-04 00:00:00', '2017-12-05 00:00:00', 'm5', '',''),
    (49, ['test_alarm', 'test_alarm01'], 456, '2017-12-04 00:00:00', '2017-12-05 00:00:00', 'm5', 'true',
     [
            "airtest",
            "test",
            "weather_syndey",
            "test02",
            "test01210a",
            "web_outdoorTemp",
            "web_outdoorHumidity",
            "web_outdoorWetTemp",
            "outdoorAirH",
            "undefined",
            "Point20170224175740_01",
            "Point20170224175740_02",
            "Point20170224175740_03",
            "Point20170224175740_04",
            "Point20170224175740_05",
            "Point20170224175740_06",
            "Point20170224175740_07",
            "Point20170224175740_08",
            "Point20170224175740_09",
            "Point20170224175740_10",
            "Point20170224175740_11",
            "Point20170224175740_12",
            "Point20170224175740_13",
            "Point20170224175740_14",
            "Point20170224175740_15",
            "Point20170224175740_16",
            "Point20170224175740_17",
            "Point20170224175740_18",
            "Point20170224175740_19",
            "Point20170224175740_20",
            "Point20170224175859_01",
            "Point20170224175859_02",
            "Point20170224175859_03",
            "Point20170224175859_04",
            "Point20170224175859_05",
            "Point20170224175859_06",
            "Point20170224175859_07",
            "Point20170224175859_08",
            "Point20170224175859_09",
            "Point20170224175859_10",
            "Point20170224175859_11",
            "Point20170224175859_12",
            "Point20170224175859_13",
            "Point20170224175859_14",
            "Point20170224175859_15",
            "Point20170224175859_16",
            "Point20170224175859_17",
            "Point20170224175859_18",
            "Point20170224175859_19",
            "Point20170224175859_20",
            "Point20170224204335_01",
            "Point20170224204335_02",
            "Point20170224204335_03",
            "Point20170224204335_04",
            "Point20170224204335_05",
            "Point20170224204335_06",
            "Point20170224204335_07",
            "Point20170224204335_08",
            "Point20170224204335_09",
            "Point20170224204335_10",
            "Point20170224204335_11",
            "Point20170224204335_12",
            "Point20170224204335_13",
            "Point20170224204335_14",
            "Point20170224204335_15",
            "Point20170224204335_16",
            "Point20170224204335_17",
            "Point20170224204335_18",
            "Point20170224204335_19",
            "Point20170224204335_20",
            "Point20170225084419_01",
            "Point20170225084419_02",
            "Point20170225084419_03",
            "Point20170225084419_04",
            "Point20170225084419_05",
            "Point20170225084419_06",
            "Point20170225084419_07",
            "Point20170225084419_08",
            "Point20170225084419_09",
            "Point20170225084419_10",
            "Point20170225084419_11",
            "Point20170225084419_12",
            "Point20170225084419_13",
            "Point20170225084419_14",
            "Point20170225084419_15",
            "Point20170225084419_16",
            "Point20170225084419_17",
            "Point20170225084419_18",
            "Point20170225084419_19",
            "Point20170225084419_20",
            "Point20170225204455_01",
            "Point20170225204455_02",
            "Point20170225204455_03",
            "Point20170225204455_04",
            "Point20170225204455_05",
            "Point20170225204455_06",
            "Point20170225204455_07",
            "Point20170225204455_08",
            "Point20170225204455_09",
            "Point20170225204455_10",
            "Point20170225204455_11",
            "Point20170225204455_12",
            "Point20170225204455_13",
            "Point20170225204455_14",
            "Point20170225204455_15",
            "Point20170225204455_16",
            "Point20170225204455_17",
            "Point20170225204455_18",
            "Point20170225204455_19",
            "Point20170225204455_20",
            "Point20170226084453_01",
            "Point20170226084453_02",
            "Point20170226084453_03",
            "Point20170226084453_04",
            "Point20170226084453_05",
            "Point20170226084453_06",
            "Point20170226084453_07",
            "Point20170226084453_08",
            "Point20170226084453_09",
            "Point20170226084453_10",
            "Point20170226084453_11",
            "Point20170226084453_12",
            "Point20170226084453_13",
            "Point20170226084453_14",
            "Point20170226084453_15",
            "Point20170226084453_16",
            "Point20170226084453_17",
            "Point20170226084453_18",
            "Point20170226084453_19",
            "Point20170226084453_20",
            "Point20170226204457_01",
            "Point20170226204457_02",
            "Point20170226204457_03",
            "Point20170226204457_04",
            "Point20170226204457_05",
            "Point20170226204457_06",
            "Point20170226204457_07",
            "Point20170226204457_08",
            "Point20170226204457_09",
            "Point20170226204457_10",
            "Point20170226204457_11",
            "Point20170226204457_12",
            "Point20170226204457_13",
            "Point20170226204457_14",
            "Point20170226204457_15",
            "Point20170226204457_16",
            "Point20170226204457_17",
            "Point20170226204457_18",
            "Point20170226204457_19",
            "Point20170226204457_20",
            "Point20170227084720_01",
            "Point20170227084720_02",
            "Point20170227084720_03",
            "Point20170227084720_04",
            "Point20170227084720_05",
            "Point20170227084720_06",
            "Point20170227084720_07",
            "Point20170227084720_08",
            "Point20170227084720_09",
            "Point20170227084720_10",
            "Point20170227084720_11",
            "Point20170227084720_12",
            "Point20170227084720_13",
            "Point20170227084720_14",
            "Point20170227084720_15",
            "Point20170227084720_16",
            "Point20170227084720_17",
            "Point20170227084720_18",
            "Point20170227084720_19",
            "Point20170227084720_20",
            "Point20170227204448_01",
            "Point20170227204448_02",
            "Point20170227204448_03",
            "Point20170227204448_04",
            "Point20170227204448_05",
            "Point20170227204448_06",
            "Point20170227204448_07",
            "Point20170227204448_08",
            "Point20170227204448_09",
            "Point20170227204448_10",
            "Point20170227204448_11",
            "Point20170227204448_12",
            "Point20170227204448_13",
            "Point20170227204448_14",
            "Point20170227204448_15",
            "Point20170227204448_16",
            "Point20170227204448_17",
            "Point20170227204448_18",
            "Point20170227204448_19",
            "Point20170227204448_20",
            "Point20170228084248_01",
            "Point20170228084248_02",
            "Point20170228084248_03",
            "Point20170228084248_04",
            "Point20170228084248_05",
            "Point20170228084248_06",
            "Point20170228084248_07",
            "Point20170228084248_08",
            "Point20170228084248_09",
            "Point20170228084248_10",
            "Point20170228084248_11",
            "Point20170228084248_12",
            "Point20170228084248_13",
            "Point20170228084248_14",
            "Point20170228084248_15",
            "Point20170228084248_16",
            "Point20170228084248_17",
            "Point20170228084248_18",
            "Point20170228084248_19",
            "Point20170228084248_20",
            "Point20170228204334_01",
            "Point20170228204334_02",
            "Point20170228204334_03",
            "Point20170228204334_04",
            "Point20170228204334_05",
            "Point20170228204334_06",
            "Point20170228204334_07",
            "Point20170228204334_08",
            "Point20170228204334_09",
            "Point20170228204334_10",
            "Point20170228204334_11",
            "Point20170228204334_12",
            "Point20170228204334_13",
            "Point20170228204334_14",
            "Point20170228204334_15",
            "Point20170228204334_16",
            "Point20170228204334_17",
            "Point20170228204334_18",
            "Point20170228204334_19",
            "Point20170228204334_20",
            "Point20170301084933_01",
            "Point20170301084933_02",
            "Point20170301084933_03",
            "Point20170301084933_04",
            "Point20170301084933_05",
            "Point20170301084933_06",
            "Point20170301084933_07",
            "Point20170301084933_08",
            "Point20170301084933_09",
            "Point20170301084933_10",
            "Point20170301084933_11",
            "Point20170301084933_12",
            "Point20170301084933_13",
            "Point20170301084933_14",
            "Point20170301084933_15",
            "Point20170301084933_16",
            "Point20170301084933_17",
            "Point20170301084933_18",
            "Point20170301084933_19",
            "Point20170301084933_20",
            "Point20170301110303_01",
            "Point20170301110303_02",
            "Point20170301110303_03",
            "Point20170301110303_04",
            "Point20170301110303_05",
            "Point20170301110303_06",
            "Point20170301110303_07",
            "Point20170301110303_08",
            "Point20170301110303_09",
            "Point20170301110303_10",
            "Point20170301110303_11",
            "Point20170301110303_12",
            "Point20170301110303_13",
            "Point20170301110303_14",
            "Point20170301110303_15",
            "Point20170301110303_16",
            "Point20170301110303_17",
            "Point20170301110303_18",
            "Point20170301110303_19",
            "Point20170301110303_20",
            "Point20170301155134_01",
            "Point20170301155134_02",
            "Point20170301155134_03",
            "Point20170301155134_04",
            "Point20170301155134_05",
            "Point20170301155134_06",
            "Point20170301155134_07",
            "Point20170301155134_08",
            "Point20170301155134_09",
            "Point20170301155134_10",
            "Point20170301155134_11",
            "Point20170301155134_12",
            "Point20170301155134_13",
            "Point20170301155134_14",
            "Point20170301155134_15",
            "Point20170301155134_16",
            "Point20170301155134_17",
            "Point20170301155134_18",
            "Point20170301155134_19",
            "Point20170301155134_20",
            "Point20170301205208_01",
            "Point20170301205208_02",
            "Point20170301205208_03",
            "Point20170301205208_04",
            "Point20170301205208_05",
            "Point20170301205208_06",
            "Point20170301205208_07",
            "Point20170301205208_08",
            "Point20170301205208_09",
            "Point20170301205208_10",
            "Point20170301205208_11",
            "Point20170301205208_12",
            "Point20170301205208_13",
            "Point20170301205208_14",
            "Point20170301205208_15",
            "Point20170301205208_16",
            "Point20170301205208_17",
            "Point20170301205208_18",
            "Point20170301205208_19",
            "Point20170301205208_20",
            "Point20170302075424_01",
            "Point20170302075424_02",
            "Point20170302075424_03",
            "Point20170302075424_04",
            "Point20170302075424_05",
            "Point20170302075424_06",
            "Point20170302075424_07",
            "Point20170302075424_08",
            "Point20170302075424_09",
            "Point20170302075424_10",
            "Point20170302075424_11",
            "Point20170302075424_12",
            "Point20170302075424_13",
            "Point20170302075424_14",
            "Point20170302075424_15",
            "Point20170302075424_16",
            "Point20170302075424_17",
            "Point20170302075424_18",
            "Point20170302075424_19",
            "Point20170302075424_20",
            "Point20170302134516_01",
            "Point20170302134516_02",
            "Point20170302134516_03",
            "Point20170302134516_04",
            "Point20170302134516_05",
            "Point20170302134516_06",
            "Point20170302134516_07",
            "Point20170302134516_08",
            "Point20170302134516_09",
            "Point20170302134516_10",
            "Point20170302134516_11",
            "Point20170302134516_12",
            "Point20170302134516_13",
            "Point20170302134516_14",
            "Point20170302134516_15",
            "Point20170302134516_16",
            "Point20170302134516_17",
            "Point20170302134516_18",
            "Point20170302134516_19",
            "Point20170302134516_20",
            "Point20170302203227_01",
            "Point20170302203227_02",
            "Point20170302203227_03",
            "Point20170302203227_04",
            "Point20170302203227_05",
            "Point20170302203227_06",
            "Point20170302203227_07",
            "Point20170302203227_08",
            "Point20170302203227_09",
            "Point20170302203227_10",
            "Point20170302203227_11",
            "Point20170302203227_12",
            "Point20170302203227_13",
            "Point20170302203227_14",
            "Point20170302203227_15",
            "Point20170302203227_16",
            "Point20170302203227_17",
            "Point20170302203227_18",
            "Point20170302203227_19",
            "Point20170302203227_20",
            "Point20170303080343_01",
            "Point20170303080343_02",
            "Point20170303080343_03",
            "Point20170303080343_04",
            "Point20170303080343_05",
            "Point20170303080343_06",
            "Point20170303080343_07",
            "Point20170303080343_08",
            "Point20170303080343_09",
            "Point20170303080343_10",
            "Point20170303080343_11",
            "Point20170303080343_12",
            "Point20170303080343_13",
            "Point20170303080343_14",
            "Point20170303080343_15",
            "Point20170303080343_16",
            "Point20170303080343_17",
            "Point20170303080343_18",
            "Point20170303080343_19",
            "Point20170303080343_20",
            "Point20170303200327_01",
            "Point20170303200327_02",
            "Point20170303200327_03",
            "Point20170303200327_04",
            "Point20170303200327_05",
            "Point20170303200327_06",
            "Point20170303200327_07",
            "Point20170303200327_08",
            "Point20170303200327_09",
            "Point20170303200327_10",
            "Point20170303200327_11",
            "Point20170303200327_12",
            "Point20170303200327_13",
            "Point20170303200327_14",
            "Point20170303200327_15",
            "Point20170303200327_16",
            "Point20170303200327_17",
            "Point20170303200327_18",
            "Point20170303200327_19",
            "Point20170303200327_20",
            "xiaolei_test",
            "test_1",
            "test_2",
            "test_3",
            "test_4",
            "test_5",
            "test_6",
            "test_7",
            "test_8",
            "test_9",
            "test_10",
            "test_11",
            "test_12",
            "rrr",
            "woooody_eidtttt",
            "AnnualPowerConsumption",
            "test_calcPoint",
            "copy_realdata_test",
            "copy_realdata_test1",
            "calc_api_test",
            "testautoRepairData"
            ]
     ),
])
def test_repairData_clearRecord(projId, nameList, userId, timeFrom, timeTo, format, all, expected):
    record = do_repairDataBatch(projId, nameList, userId, timeFrom, timeTo, format, all)
    rt = do_repairdata_clear_record(projId)
    if rt:
        str_id = record.get('data')
        idList = []
        for item in rt:
            idList.append(list(item.keys()))
        assert [str_id] in idList, 'failed to get record of repair data'
        ind = idList.index([str_id])
        data = rt[ind][str_id]
        actual_id = data['project_id']
        actual_pList = data['point_list']
        actual_user = data['user_id']
        actual_from = data['time_from']
        actual_to = data['time_to']
        name = 'expertrepairInfo_%s_%s' %(projId, str_id)
        assert RedisManager.get(name) is None, 'Failed to clear record of repair data'
        assert actual_id == projId, 'actual project id is %s, which differs from expected %s' %(actual_id, projId)
        assert actual_user == userId, 'actual user is %s, which differs from expected %s' %(actual_user, userId)
        assert actual_from == timeFrom, 'actual start time is %s, which differs from expected %s' %(actual_from, timeFrom)
        assert actual_to == timeTo, 'actual end time is %s, which differs from expected %s' %(actual_to, timeTo)
        if not expected:
            assert actual_pList == nameList, 'actual point is %s, which differs from expected %s' %(actual_pList, nameList)
        else:
            expected.sort()
            actual_pList.sort()
            assert actual_pList == expected, 'actual point is %s, which differs from expected %s' %(actual_pList, expected)
    else:
        assert False,'Failed to set record of repair data'
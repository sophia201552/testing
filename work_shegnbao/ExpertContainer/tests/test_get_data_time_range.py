#coding=utf-8
__author__ = 'angelia'

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from tests.utils import *


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'timeStart', 'timeEnd', 'timePeriod','expected'),[
    (72,['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-08-01 00:00:00','2017-08-01 00:10:00','m5',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 90.1
            },
            {
                "error": False,
                "time": "2017-08-01 00:05:00",
                "value": 89.7
            },
            {
                "error": False,
                "time": "2017-08-01 00:10:00",
                "value": 89.1
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 42.14
            },
            {
                "error": False,
                "time": "2017-08-01 00:05:00",
                "value": 42.1
            },
            {
                "error": False,
                "time": "2017-08-01 00:10:00",
                "value": 42.29
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72,['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-07-01 00:00:00','2017-07-01 00:10:00','m5',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 80.8
            },
            {
                "error": False,
                "time": "2017-07-01 00:05:00",
                "value": 80.8
            },
            {
                "error": False,
                "time": "2017-07-01 00:10:00",
                "value": 80.2
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 40.26
            },
            {
                "error": False,
                "time": "2017-07-01 00:05:00",
                "value": 40.16
            },
            {
                "error": False,
                "time": "2017-07-01 00:10:00",
                "value": 40.24
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72,['ChAMPS01', 'VAV_J_54_13_Air Flow'],'2017-07-20 17:00:00','2017-07-20 19:00:00','m5',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": 93.6
            },
            {
                "error": False,
                "time": "2017-07-20 17:05:00",
                "value": 94.0
            },
            {
                "error": False,
                "time": "2017-07-20 17:10:00",
                "value": 93.8
            },
            {
                "error": False,
                "time": "2017-07-20 17:15:00",
                "value": 93.4
            },
            {
                "error": False,
                "time": "2017-07-20 17:20:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-20 17:25:00",
                "value": 93.9
            },
            {
                "error": False,
                "time": "2017-07-20 17:30:00",
                "value": 93.1
            },
            {
                "error": False,
                "time": "2017-07-20 17:35:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-20 17:40:00",
                "value": 93.8
            },
            {
                "error": False,
                "time": "2017-07-20 17:45:00",
                "value": "86.5"
            },
            {
                "error": False,
                "time": "2017-07-20 17:50:00",
                "value": 80.4
            },
            {
                "error": True,
                "time": "2017-07-20 17:55:00",
                "value": 80.4
            },
            {
                "error": True,
                "time": "2017-07-20 18:00:00",
                "value": 80.4
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:25:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:30:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:35:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:40:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:45:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:50:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:55:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 0
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": 53.24
            },
            {
                "error": False,
                "time": "2017-07-20 17:05:00",
                "value": 53.29
            },
            {
                "error": False,
                "time": "2017-07-20 17:10:00",
                "value": 53.25
            },
            {
                "error": False,
                "time": "2017-07-20 17:15:00",
                "value": 53.36
            },
            {
                "error": False,
                "time": "2017-07-20 17:20:00",
                "value": 53.29
            },
            {
                "error": False,
                "time": "2017-07-20 17:25:00",
                "value": 53.37
            },
            {
                "error": False,
                "time": "2017-07-20 17:30:00",
                "value": 53.02
            },
            {
                "error": False,
                "time": "2017-07-20 17:35:00",
                "value": 53.2
            },
            {
                "error": False,
                "time": "2017-07-20 17:40:00",
                "value": 52.99
            },
            {
                "error": False,
                "time": "2017-07-20 17:45:00",
                "value": 53.17
            },
            {
                "error": False,
                "time": "2017-07-20 17:50:00",
                "value": 52.99
            },
            {
                "error": False,
                "time": "2017-07-20 17:55:00",
                "value": 52.74
            },
            {
                "error": True,
                "time": "2017-07-20 18:00:00",
                "value": 52.74
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 52.92
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 52.78
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 52.97
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 52.98
            },
            {
                "error": False,
                "time": "2017-07-20 18:25:00",
                "value": 52.86
            },
            {
                "error": False,
                "time": "2017-07-20 18:30:00",
                "value": 52.93
            },
            {
                "error": False,
                "time": "2017-07-20 18:35:00",
                "value": 52.66
            },
            {
                "error": False,
                "time": "2017-07-20 18:40:00",
                "value": 52.77
            },
            {
                "error": False,
                "time": "2017-07-20 18:45:00",
                "value": 52.72
            },
            {
                "error": False,
                "time": "2017-07-20 18:50:00",
                "value": 52.85
            },
            {
                "error": False,
                "time": "2017-07-20 18:55:00",
                "value": 52.49
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 52.45
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72,['ChAMPS01', 'VAV_J_54_13_Air Flow'],'2017-08-01 00:00:00', '2017-08-01 5:00:00', 'h1',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 90.1
            },
            {
                "error": False,
                "time": "2017-08-01 01:00:00",
                "value": 85.1
            },
            {
                "error": False,
                "time": "2017-08-01 02:00:00",
                "value": 83.6
            },
            {
                "error": False,
                "time": "2017-08-01 03:00:00",
                "value": 81.8
            },
            {
                "error": False,
                "time": "2017-08-01 04:00:00",
                "value": 80.3
            },
            {
                "error": False,
                "time": "2017-08-01 05:00:00",
                "value": 78.6
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 42.14
            },
            {
                "error": False,
                "time": "2017-08-01 01:00:00",
                "value": 42.59
            },
            {
                "error": False,
                "time": "2017-08-01 02:00:00",
                "value": 42.61
            },
            {
                "error": False,
                "time": "2017-08-01 03:00:00",
                "value": 42.55
            },
            {
                "error": False,
                "time": "2017-08-01 04:00:00",
                "value": 42.72
            },
            {
                "error": False,
                "time": "2017-08-01 05:00:00",
                "value": 42.62
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72,['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-08-01 03:00:00', '2017-08-05 05:00:00', 'd1',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-08-01 03:00:00",
                "value": 81.8
            },
            {
                "error": False,
                "time": "2017-08-02 03:00:00",
                "value": 80.4
            },
            {
                "error": False,
                "time": "2017-08-03 03:00:00",
                "value": 78.1
            },
            {
                "error": False,
                "time": "2017-08-04 03:00:00",
                "value": 76.6
            },
            {
                "error": False,
                "time": "2017-08-05 03:00:00",
                "value": 77.6
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-08-01 03:00:00",
                "value": 42.55
            },
            {
                "error": False,
                "time": "2017-08-02 03:00:00",
                "value": 42.2
            },
            {
                "error": False,
                "time": "2017-08-03 03:00:00",
                "value": 41.92
            },
            {
                "error": False,
                "time": "2017-08-04 03:00:00",
                "value": 42.96
            },
            {
                "error": False,
                "time": "2017-08-05 03:00:00",
                "value": 42.52
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72, ['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-08-01 00:00:00', '2017-09-01 00:00:00', 'M1',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 90.1
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 78.2
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 42.14
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 40.7
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72, ['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-07-01 00:00:00', '2017-07-01 05:00:00', 'h1',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 80.8
            },
            {
                "error": False,
                "time": "2017-07-01 01:00:00",
                "value": 79.4
            },
            {
                "error": False,
                "time": "2017-07-01 02:00:00",
                "value": 76.9
            },
            {
                "error": False,
                "time": "2017-07-01 03:00:00",
                "value": 75.0
            },
            {
                "error": False,
                "time": "2017-07-01 04:00:00",
                "value": 74.4
            },
            {
                "error": False,
                "time": "2017-07-01 05:00:00",
                "value": 73.3
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 40.26
            },
            {
                "error": False,
                "time": "2017-07-01 01:00:00",
                "value": 40.39
            },
            {
                "error": False,
                "time": "2017-07-01 02:00:00",
                "value": 40.36
            },
            {
                "error": False,
                "time": "2017-07-01 03:00:00",
                "value": 40.31
            },
            {
                "error": False,
                "time": "2017-07-01 04:00:00",
                "value": "40.53"
            },
            {
                "error": False,
                "time": "2017-07-01 05:00:00",
                "value": 40.48
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72, ['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-07-01 02:00:00', '2017-07-05 02:00:00', 'd1',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-07-01 02:00:00",
                "value": 76.9
            },
            {
                "error": False,
                "time": "2017-07-02 02:00:00",
                "value": 76.8
            },
            {
                "error": False,
                "time": "2017-07-03 02:00:00",
                "value": 77.3
            },
            {
                "error": False,
                "time": "2017-07-04 02:00:00",
                "value": 79.9
            },
            {
                "error": False,
                "time": "2017-07-05 02:00:00",
                "value": 74.7
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-01 02:00:00",
                "value": 40.36
            },
            {
                "error": False,
                "time": "2017-07-02 02:00:00",
                "value": 40.66
            },
            {
                "error": False,
                "time": "2017-07-03 02:00:00",
                "value": 41.58
            },
            {
                "error": False,
                "time": "2017-07-04 02:00:00",
                "value": 42.02
            },
            {
                "error": False,
                "time": "2017-07-05 02:00:00",
                "value": 42.07
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72, ['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-05-01 00:00:00', '2017-07-01 00:00:00', 'M1',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 84.3
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": 82.8
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 80.8
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 38.28
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": 39.24
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 40.26
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72, ['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-07-16 01:00:00', '2017-07-19 01:00:00', 'h1',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-07-16 01:00:00",
                "value": 84.3
            },
            {
                "error": False,
                "time": "2017-07-16 02:00:00",
                "value": 82.9
            },
            {
                "error": False,
                "time": "2017-07-16 03:00:00",
                "value": 81.2
            },
            {
                "error": False,
                "time": "2017-07-16 04:00:00",
                "value": 79.2
            },
            {
                "error": False,
                "time": "2017-07-16 05:00:00",
                "value": 78.0
            },
            {
                "error": False,
                "time": "2017-07-16 06:00:00",
                "value": 76.6
            },
            {
                "error": False,
                "time": "2017-07-16 07:00:00",
                "value": 60.4
            },
            {
                "error": False,
                "time": "2017-07-16 08:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 09:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 10:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 11:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 12:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 13:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 14:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 15:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 16:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 17:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 18:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 19:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 20:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 21:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 22:00:00",
                "value": 92.9
            },
            {
                "error": False,
                "time": "2017-07-16 23:00:00",
                "value": 87.3
            },
            {
                "error": False,
                "time": "2017-07-17 00:00:00",
                "value": 85.0
            },
            {
                "error": False,
                "time": "2017-07-17 01:00:00",
                "value": 82.4
            },
            {
                "error": False,
                "time": "2017-07-17 02:00:00",
                "value": 79.3
            },
            {
                "error": False,
                "time": "2017-07-17 03:00:00",
                "value": 78.3
            },
            {
                "error": False,
                "time": "2017-07-17 04:00:00",
                "value": 76.7
            },
            {
                "error": False,
                "time": "2017-07-17 05:00:00",
                "value": 76.1
            },
            {
                "error": False,
                "time": "2017-07-17 06:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 07:00:00",
                "value": 93.9
            },
            {
                "error": False,
                "time": "2017-07-17 08:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 09:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 10:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 11:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 12:00:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-17 13:00:00",
                "value": 93.4
            },
            {
                "error": False,
                "time": "2017-07-17 14:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 15:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 16:00:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-17 17:00:00",
                "value": 94.0
            },
            {
                "error": False,
                "time": "2017-07-17 18:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 19:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 20:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 21:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 22:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 23:00:00",
                "value": 93.1
            },
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": 88.5
            },
            {
                "error": False,
                "time": "2017-07-18 01:00:00",
                "value": 85.9
            },
            {
                "error": False,
                "time": "2017-07-18 02:00:00",
                "value": 83.3
            },
            {
                "error": False,
                "time": "2017-07-18 03:00:00",
                "value": 81.5
            },
            {
                "error": False,
                "time": "2017-07-18 04:00:00",
                "value": 80.7
            },
            {
                "error": False,
                "time": "2017-07-18 05:00:00",
                "value": 77.9
            },
            {
                "error": False,
                "time": "2017-07-18 06:00:00",
                "value": 77.0
            },
            {
                "error": False,
                "time": "2017-07-18 07:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-18 08:00:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-18 09:00:00",
                "value": 93.6
            },
            {
                "error": False,
                "time": "2017-07-18 10:00:00",
                "value": 92.9
            },
            {
                "error": False,
                "time": "2017-07-18 11:00:00",
                "value": 92.6
            },
            {
                "error": False,
                "time": "2017-07-18 12:00:00",
                "value": 93.9
            },
            {
                "error": False,
                "time": "2017-07-18 13:00:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-18 14:00:00",
                "value": 88.3
            },
            {
                "error": False,
                "time": "2017-07-18 15:00:00",
                "value": 84.1
            },
            {
                "error": False,
                "time": "2017-07-18 16:00:00",
                "value": 94.0
            },
            {
                "error": False,
                "time": "2017-07-18 17:00:00",
                "value": 83.4
            },
            {
                "error": False,
                "time": "2017-07-18 18:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-18 19:00:00",
                "value": 90.5
            },
            {
                "error": False,
                "time": "2017-07-18 20:00:00",
                "value": 81.8
            },
            {
                "error": False,
                "time": "2017-07-18 21:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-18 22:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-18 23:00:00",
                "value": 93.6
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": 91.0
            },
            {
                "error": False,
                "time": "2017-07-19 01:00:00",
                "value": 86.4
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": True,
                "time": "2017-07-16 01:00:00",
                "value": 40.84
            },
            {
                "error": False,
                "time": "2017-07-16 02:00:00",
                "value": 40.84
            },
            {
                "error": False,
                "time": "2017-07-16 03:00:00",
                "value": 40.73
            },
            {
                "error": False,
                "time": "2017-07-16 04:00:00",
                "value": 40.94
            },
            {
                "error": True,
                "time": "2017-07-16 05:00:00",
                "value": 40.94
            },
            {
                "error": False,
                "time": "2017-07-16 06:00:00",
                "value": 40.91
            },
            {
                "error": False,
                "time": "2017-07-16 07:00:00",
                "value": 41.04
            },
            {
                "error": False,
                "time": "2017-07-16 08:00:00",
                "value": 41.0
            },
            {
                "error": False,
                "time": "2017-07-16 09:00:00",
                "value": 41.07
            },
            {
                "error": False,
                "time": "2017-07-16 10:00:00",
                "value": 41.09
            },
            {
                "error": False,
                "time": "2017-07-16 11:00:00",
                "value": 41.1
            },
            {
                "error": False,
                "time": "2017-07-16 12:00:00",
                "value": 40.98
            },
            {
                "error": False,
                "time": "2017-07-16 13:00:00",
                "value": 41.13
            },
            {
                "error": False,
                "time": "2017-07-16 14:00:00",
                "value": 41.26
            },
            {
                "error": False,
                "time": "2017-07-16 15:00:00",
                "value": 41.27
            },
            {
                "error": False,
                "time": "2017-07-16 16:00:00",
                "value": 41.17
            },
            {
                "error": False,
                "time": "2017-07-16 17:00:00",
                "value": 41.43
            },
            {
                "error": False,
                "time": "2017-07-16 18:00:00",
                "value": 41.4
            },
            {
                "error": False,
                "time": "2017-07-16 19:00:00",
                "value": 41.5
            },
            {
                "error": False,
                "time": "2017-07-16 20:00:00",
                "value": 41.4
            },
            {
                "error": False,
                "time": "2017-07-16 21:00:00",
                "value": 41.31
            },
            {
                "error": False,
                "time": "2017-07-16 22:00:00",
                "value": 41.3
            },
            {
                "error": False,
                "time": "2017-07-16 23:00:00",
                "value": 41.33
            },
            {
                "error": False,
                "time": "2017-07-17 00:00:00",
                "value": 41.33
            },
            {
                "error": False,
                "time": "2017-07-17 01:00:00",
                "value": 41.17
            },
            {
                "error": False,
                "time": "2017-07-17 02:00:00",
                "value": 41.23
            },
            {
                "error": False,
                "time": "2017-07-17 03:00:00",
                "value": 41.33
            },
            {
                "error": False,
                "time": "2017-07-17 04:00:00",
                "value": 41.36
            },
            {
                "error": False,
                "time": "2017-07-17 05:00:00",
                "value": 41.3
            },
            {
                "error": False,
                "time": "2017-07-17 06:00:00",
                "value": 41.31
            },
            {
                "error": False,
                "time": "2017-07-17 07:00:00",
                "value": 55.35
            },
            {
                "error": False,
                "time": "2017-07-17 08:00:00",
                "value": 54.49
            },
            {
                "error": False,
                "time": "2017-07-17 09:00:00",
                "value": 51.9
            },
            {
                "error": False,
                "time": "2017-07-17 10:00:00",
                "value": 51.95
            },
            {
                "error": False,
                "time": "2017-07-17 11:00:00",
                "value": 51.51
            },
            {
                "error": False,
                "time": "2017-07-17 12:00:00",
                "value": 51.78
            },
            {
                "error": False,
                "time": "2017-07-17 13:00:00",
                "value": 52.1
            },
            {
                "error": False,
                "time": "2017-07-17 14:00:00",
                "value": 51.98
            },
            {
                "error": False,
                "time": "2017-07-17 15:00:00",
                "value": 52.09
            },
            {
                "error": False,
                "time": "2017-07-17 16:00:00",
                "value": 52.06
            },
            {
                "error": False,
                "time": "2017-07-17 17:00:00",
                "value": 52.35
            },
            {
                "error": False,
                "time": "2017-07-17 18:00:00",
                "value": 52.29
            },
            {
                "error": False,
                "time": "2017-07-17 19:00:00",
                "value": 52.76
            },
            {
                "error": False,
                "time": "2017-07-17 20:00:00",
                "value": 38.68
            },
            {
                "error": False,
                "time": "2017-07-17 21:00:00",
                "value": 40.76
            },
            {
                "error": False,
                "time": "2017-07-17 22:00:00",
                "value": 41.84
            },
            {
                "error": False,
                "time": "2017-07-17 23:00:00",
                "value": 42.08
            },
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": 41.87
            },
            {
                "error": False,
                "time": "2017-07-18 01:00:00",
                "value": 41.46
            },
            {
                "error": False,
                "time": "2017-07-18 02:00:00",
                "value": 41.5
            },
            {
                "error": False,
                "time": "2017-07-18 03:00:00",
                "value": 41.45
            },
            {
                "error": False,
                "time": "2017-07-18 04:00:00",
                "value": 41.41
            },
            {
                "error": False,
                "time": "2017-07-18 05:00:00",
                "value": 41.39
            },
            {
                "error": False,
                "time": "2017-07-18 06:00:00",
                "value": 41.64
            },
            {
                "error": False,
                "time": "2017-07-18 07:00:00",
                "value": 41.7
            },
            {
                "error": False,
                "time": "2017-07-18 08:00:00",
                "value": 54.42
            },
            {
                "error": False,
                "time": "2017-07-18 09:00:00",
                "value": 53.59
            },
            {
                "error": False,
                "time": "2017-07-18 10:00:00",
                "value": 52.93
            },
            {
                "error": False,
                "time": "2017-07-18 11:00:00",
                "value": 53.34
            },
            {
                "error": False,
                "time": "2017-07-18 12:00:00",
                "value": 53.06
            },
            {
                "error": False,
                "time": "2017-07-18 13:00:00",
                "value": 53.26
            },
            {
                "error": False,
                "time": "2017-07-18 14:00:00",
                "value": 53.08
            },
            {
                "error": False,
                "time": "2017-07-18 15:00:00",
                "value": 52.87
            },
            {
                "error": False,
                "time": "2017-07-18 16:00:00",
                "value": 52.93
            },
            {
                "error": False,
                "time": "2017-07-18 17:00:00",
                "value": 53.13
            },
            {
                "error": False,
                "time": "2017-07-18 18:00:00",
                "value": 53.58
            },
            {
                "error": False,
                "time": "2017-07-18 19:00:00",
                "value": 53.85
            },
            {
                "error": False,
                "time": "2017-07-18 20:00:00",
                "value": 53.59
            },
            {
                "error": False,
                "time": "2017-07-18 21:00:00",
                "value": 39.36
            },
            {
                "error": False,
                "time": "2017-07-18 22:00:00",
                "value": 41.3
            },
            {
                "error": False,
                "time": "2017-07-18 23:00:00",
                "value": 42.04
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": 42.05
            },
            {
                "error": False,
                "time": "2017-07-19 01:00:00",
                "value": 41.72
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72, ['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-07-16 01:00:00', '2017-07-19 01:00:00', 'd1',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-07-16 01:00:00",
                "value": 84.3
            },
            {
                "error": False,
                "time": "2017-07-17 01:00:00",
                "value": 82.4
            },
            {
                "error": False,
                "time": "2017-07-18 01:00:00",
                "value": 85.9
            },
            {
                "error": False,
                "time": "2017-07-19 01:00:00",
                "value": 86.4
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": True,
                "time": "2017-07-16 01:00:00",
                "value": 41.17
            },
            {
                "error": False,
                "time": "2017-07-17 01:00:00",
                "value": 41.17
            },
            {
                "error": False,
                "time": "2017-07-18 01:00:00",
                "value": 41.46
            },
            {
                "error": False,
                "time": "2017-07-19 01:00:00",
                "value": 41.72
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72, ['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-07-01 00:00:00', '2017-09-01 00:00:00', 'M1',
     [{
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 80.8
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 90.1
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 78.2
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 40.26
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 42.14
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 40.7
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-07-20 00:00:00', '2017-07-20 00:20:33', 'm5',
     [{
        "avg": 5.4,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 00:05:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 00:10:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 00:15:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 00:20:00",
                "value": "5.4"
            }
        ],
        "max": 5.4,
        "median": 5.4,
        "min": 5.4,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-07-20 00:00:00', '2017-07-20 04:20:33', 'h1',
     [{
        "avg": 5.462000000000001,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 01:00:00",
                "value": "5.5"
            },
            {
                "error": False,
                "time": "2017-07-20 02:00:00",
                "value": "5.36"
            },
            {
                "error": False,
                "time": "2017-07-20 03:00:00",
                "value": "5.51"
            },
            {
                "error": False,
                "time": "2017-07-20 04:00:00",
                "value": "5.54"
            }
        ],
        "max": 5.54,
        "median": 5.5,
        "min": 5.36,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.06939740629158972
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-07-16 00:00:00', '2017-07-20 04:20:33', 'd1',
     [{
        "avg": 5.438,
        "history": [
            {
                "error": False,
                "time": "2017-07-16 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-17 00:00:00",
                "value": "5.27"
            },
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "5.69"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            }
        ],
        "max": 5.69,
        "median": 5.4,
        "min": 5.27,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.13760813929415677
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-03-01 00:00:00', '2017-07-20 04:20:33', 'M1',
     [{
        "avg": 5.67,
        "history": [
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "5.82"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "5.83"
            },
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": "5.51"
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": "5.73"
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": "5.46"
            }
        ],
        "max": 5.83,
        "median": 5.73,
        "min": 5.46,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.1558204094462598
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-07-20 18:00:00', '2017-07-20 18:20:33', 'm5',
     [{
        "avg": 5.31,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 5.35
            }
        ],
        "max": 5.35,
        "median": 5.3,
        "min": 5.3,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.019999999999999928
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-07-20 18:00:00', '2017-07-20 22:20:33', 'h1',
     [{
        "avg": 5.24,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 5.38
            },
            {
                "error": False,
                "time": "2017-07-20 20:00:00",
                "value": 5.32
            },
            {
                "error": False,
                "time": "2017-07-20 21:00:00",
                "value": 4.78
            },
            {
                "error": False,
                "time": "2017-07-20 22:00:00",
                "value": 5.42
            }
        ],
        "max": 5.42,
        "median": 5.32,
        "min": 4.78,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.23392306427541504
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-07-21 00:00:00', '2017-07-25 22:20:33', 'd1',
     [{
        "avg": 5.426,
        "history": [
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 5.25
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 5.33
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 5.52
            },
            {
                "error": False,
                "time": "2017-07-24 00:00:00",
                "value": 5.32
            },
            {
                "error": False,
                "time": "2017-07-25 00:00:00",
                "value": 5.71
            }
        ],
        "max": 5.71,
        "median": 5.33,
        "min": 5.25,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.1678809101714664
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-08-01 00:00:00', '2017-09-01 22:20:33', 'M1',
     [{
        "avg": 5.195,
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 5.72
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 4.67
            }
        ],
        "max": 5.72,
        "median": 5.195,
        "min": 4.67,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.5249999999999999
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-07-20 17:00:00', '2017-07-20 19:00:33', 'm5',
     [{
        "avg": 5.3452,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": "5.17"
            },
            {
                "error": False,
                "time": "2017-07-20 17:05:00",
                "value": "5.17"
            },
            {
                "error": False,
                "time": "2017-07-20 17:10:00",
                "value": "5.17"
            },
            {
                "error": False,
                "time": "2017-07-20 17:15:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:20:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:25:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:30:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:35:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:40:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:45:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:50:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:55:00",
                "value": "5.3"
            },
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:25:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:30:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:35:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:40:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:45:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:50:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:55:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 5.38
            }
        ],
        "max": 5.43,
        "median": 5.35,
        "min": 5.17,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.08030541700283979
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-07-20 15:00:00', '2017-07-20 20:00:33', 'h1',
     [{
        "avg": 5.306666666666667,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 15:00:00",
                "value": "5.26"
            },
            {
                "error": False,
                "time": "2017-07-20 16:00:00",
                "value": "5.41"
            },
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": "5.17"
            },
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 5.38
            },
            {
                "error": False,
                "time": "2017-07-20 20:00:00",
                "value": 5.32
            }
        ],
        "max": 5.41,
        "median": 5.3100000000000005,
        "min": 5.17,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.07866949147470638
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-07-18 00:00:00', '2017-07-23 20:00:33', 'd1',
     [{
        "avg": 5.436666666666667,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "5.69"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 5.25
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 5.33
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 5.52
            }
        ],
        "max": 5.69,
        "median": 5.415,
        "min": 5.25,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.14067298564006137
    }]
     ),
    (72, ['BaseChillerSysCOP_sec_svr'], '2017-05-01 00:00:00', '2017-09-20 20:00:33', 'M1',
     [{
        "avg": 5.417999999999999,
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": "5.51"
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": "5.73"
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": "5.46"
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 5.72
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 4.67
            }
        ],
        "max": 5.73,
        "median": 5.51,
        "min": 4.67,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.38943035320837543
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-20 00:00:00', '2017-07-20 00:20:33', 'm5',
     [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:05:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:10:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:15:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:20:00",
                "value": "54.48"
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-20 00:00:00', '2017-07-20 04:20:33', 'h1',
     [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 01:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 02:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 03:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 04:00:00",
                "value": "54.48"
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-16 00:00:00', '2017-07-20 04:20:33', 'd1',
     [{
        "avg": 54.452,
        "history": [
            {
                "error": False,
                "time": "2017-07-16 00:00:00",
                "value": "54.34"
            },
            {
                "error": False,
                "time": "2017-07-17 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.34,
        "name": "Max_OUTDOORTemp_W",
        "std": 0.055999999999997385
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-03-01 00:00:00', '2017-07-20 04:20:33', 'M1',
     [{
        "avg": 48.052,
        "history": [
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "43.86"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "43.83"
            },
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": "44.15"
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": "54.31"
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": "54.11"
            }
        ],
        "max": 54.31,
        "median": 44.15,
        "min": 43.83,
        "name": "Max_OUTDOORTemp_W",
        "std": 5.029625831013676
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-20 18:00:00', '2017-07-20 18:20:33', 'm5',
     [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-20 18:00:00', '2017-07-20 22:20:33', 'h1',
     [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 20:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 21:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 22:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-21 00:00:00', '2017-07-25 22:20:33', 'd1',
     [{
        "avg": 54.492,
        "history": [
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-24 00:00:00",
                "value": 54.51
            },
            {
                "error": False,
                "time": "2017-07-25 00:00:00",
                "value": 54.51
            }
        ],
        "max": 54.51,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0.014696938456699626
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-08-01 00:00:00', '2017-09-01 22:20:33', 'M1',
     [{
        "avg": 54.39,
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 54.43
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 54.35
            }
        ],
        "max": 54.43,
        "median": 54.39,
        "min": 54.35,
        "name": "Max_OUTDOORTemp_W",
        "std": 0.03999999999999915
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-20 17:00:00', '2017-07-20 19:00:33', 'm5',
     [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:05:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:10:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:15:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:20:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:25:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:30:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:35:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:40:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:45:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:50:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:55:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:25:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:30:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:35:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:40:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:45:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:50:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:55:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-20 15:00:00', '2017-07-20 20:00:33', 'h1',
     [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 15:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 16:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 20:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-18 00:00:00', '2017-07-23 20:00:33', 'd1',
     [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-05-01 00:00:00', '2017-09-20 20:00:33', 'M1',
     [{
        "avg": 52.27,
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": "44.15"
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": "54.31"
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": "54.11"
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 54.43
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 54.35
            }
        ],
        "max": 54.43,
        "median": 54.31,
        "min": 44.15,
        "name": "Max_OUTDOORTemp_W",
        "std": 4.061369227243444
    }]
     ),
    (1233, ['Max_OUTDOORTemp_W'], '2017-05-01 00:00:00', '2017-09-20 20:00:33', 'M1',
     [{'error':'no data history'}]
     ),
    ('72', ['Max_OUTDOORTemp_W'], '2017-07-18 00:00:00', '2017-07-23 20:00:33', 'd1',
     [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-18 00:00', '2017-07-23 20:00:33', 'd1',
     [{'error': 'invalid time string'}]
     ),
    (72, ['Max_OUTDOORTemp_W'], '1505800454.558458', '2017-07-23 20:00:33', 'd1',
     [{'error': 'invalid time string'}]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-18 00:00:23', '2017-07-23 :20:00', 'd1',
     [{'error': 'invalid time string'}]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-23 00:00:23', '2017-07-14 :20:00', 'd1',
     [{'error': 'invalid time string'}]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-09-19 00:00:23', '1505802730.722475', 'd1',
     [{'error': 'invalid time string'}]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-18 00:00', '2017-07-23 :20:00', 'd1',
     [{'error': 'invalid time string'}]
     ),
    (72, ['Max_OUTDOORTemp_W'], '1505800454.558458', '1505802730.722475', 'm5',
     [{'error': 'invalid time string'}]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-01-11 17:00:23', '2017-08-11 19:20:00', 'm1',
     {'error': 'historyData', 'msg': 'time range is 7 days for m1'}
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-01-11 17:00:23', '2017-08-11 19:20:00', 'm5',
     {'error': 'historyData', 'msg': 'time range is 14 days for m5'}
     ),
    (72, ['Max_OUTDOORTemp_W'], '2016-08-11 17:00:23', '2017-08-11 19:20:00', 'h1',
     {'error': 'historyData', 'msg': 'time range is 60 days for h1'}
     ),
    (72, ['Max_OUTDOORTemp_W'], '2015-10-11 17:00:23', '2017-11-10 19:20:00', 'd1',
     {'error': 'historyData', 'msg': 'time range is 365*2 days for d1'}
     ),
    (72, ['Max_OUTDOORTemp_W'], '2013-10-11 17:00:23', '2017-11-10 19:20:00', 'd1',
     {'error': 'historyData', 'msg': 'time range is 365*2 days for d1'}
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-18 00:00:00', '2017-07-23 20:00:33', 'D1',
     [{'error': 'time period format not supported'}]
     ),
    (72, ['Max_OUTDOORTemp_W'], '2017-07-18 00:00:00', '2017-07-23 20:00:33', 'bgf',
     [{'error': 'time period format not supported'}]
     ),
    (72, [], '2017-07-18 00:00:00', '2017-07-23 20:00:33', 'd1',
     [{'error': 'no data history'}]
     ),
    (72, ['Max_OUTDOORTemp_W1'], '2017-07-18 00:00:00', '2017-07-23 20:00:33', 'd1',
     []
     ),
    (72, ['BaseChillerSysCOP_sec_svr', 'Max_OUTDOORTemp_W1'], '2017-07-18 00:00:00', '2017-07-23 20:00:33', 'd1',
     [{
        "avg": 5.436666666666667,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "5.69"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 5.25
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 5.33
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 5.52
            }
        ],
        "max": 5.69,
        "median": 5.415,
        "min": 5.25,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.14067298564006137
    }]
     ),
    (72, [''], '2017-07-18 00:00:00', '2017-07-18 00:10:33', 'm5',
     []
     ),
    (-2, ['Max_OUTDOORTemp_W1'], '2017-07-18 26:68:70', '2017-07-23 10:65:63', 'd1',
     [{'error': 'no data history'}]
     ),
])
def test_get_data_time_range(projId, pointList, timeStart, timeEnd, timePeriod, expected):
    lb = LogicBase(projId, datetime.now(), nMode = LogicBase.REPAIR_HISTORY)
    if lb:
        rt = lb.get_data_time_range(projId, pointList, timeStart, timeEnd, timePeriod)
        equal_result_getDataTimeRange(expected, rt)
    else:
        assert False, "create instance failed"
#encoding=utf-8
from datetime import datetime

project_list = \
[
    {"id":72, "name":"上海华为", "grade":"高", "checkday":[1,3], "switch":"on"},
    {"id":120, "name":"梅赛德斯奔驰文化中心", "grade":"高", "checkday":[2], "switch":"on"},
    {"id":15, "name":"华东电网调度中心大楼", "grade":"高", "checkday":[4], "switch":"on"},
    {"id": 293, "name": "liverpool", "grade": "高", "checkday": [5], "switch":"off"},
    {"id": 374, "name": "和黄药业", "grade": "高", "checkday": [1], "switch":"on"},
    {"id": 396, "name": "开能", "grade": "高", "checkday": [2], "switch":"on"},
    {"id": 674, "name": "MiamiRCC", "grade": "高", "checkday": [3,5], "switch":"on"},
    {"id": 528, "name": "RCS", "grade": "高", "checkday": [1, 4], "switch":"on"},
    {"id": 540, "name": "RCH", "grade": "高", "checkday": [2, 5], "switch":"on"},
    {"id": 539, "name": "RCCN", "grade": "高", "checkday": [1, 3], "switch":"on"},
    {"id": 542, "name": "CSS", "grade": "高", "checkday": [2, 4], "switch":"on"},
    {"id": 717, "name": "杭州华为", "grade": "高", "checkday": [3, 5], "switch":"on"},
    {"id": 179, "name": "Goodman嘉民", "grade": "中", "checkday": [1], "switch":"on"},
    {"id": 194, "name": "上海印钞厂", "grade": "中", "checkday": [2], "switch":"on"},
    {"id": 318, "name": "金钟广场", "grade": "中", "checkday": [3], "switch":"on"},
    {"id": 128, "name": "苏州天弘科技有限公司", "grade": "中", "checkday": [4], "switch":"on"},
    {"id": 190, "name": "新濠天地", "grade": "中", "checkday": [5], "switch":"on"},
    {"id": 421, "name": "Greenslopes", "grade": "中", "checkday": [1], "switch":"off"},
    {"id": 457, "name": "TWS(慈云山)", "grade": "中", "checkday": [2], "switch":"on"},
    {"id": 126, "name": "Church Street Parramatta", "grade": "中", "checkday": [], "switch":"off"},
    {"id": 510, "name": "117Clarence Street", "grade": "中", "checkday": [3], "switch":"on"},
    {"id": 645, "name": "WentWorthStreet", "grade": "中", "checkday": [4], "switch":"on"},
    {"id": 646, "name": "Canberra Ave", "grade": "中", "checkday": [4], "switch":"on"},
    {"id": 647, "name": "西安宜家", "grade": "中", "checkday": [1], "switch":"on"},
    {"id": 83, "name": "成都时代8号", "grade": "中", "checkday": [2], "switch":"on"},
    {"id": 203, "name": "天津武清", "grade": "中", "checkday": [3], "switch":"on"},
    {"id": 649, "name": "中电深水埗", "grade": "中", "checkday": [4], "switch":"on"},
    {"id": 538, "name": "埃顿", "grade": "中", "checkday": [5], "switch":"on"},
    {"id": 19, "name": "上汽工业", "grade": "低", "checkday": [1], "switch":"on"},
    {"id": 373, "name": "中电熊猫云平台", "grade": "低", "checkday": [2], "switch":"on"},
    {"id": 18, "name": "香港华润", "grade": "低", "checkday": [4], "switch":"on"},
]

def _cmpfunc(x):
    t_now = datetime.now()
    weekday = t_now.isoweekday()
    return weekday in x.get("checkday") and x.get("switch") == "on"

def get_schedule_check_project_list():
    check_list = map(lambda x:x.get("id"), filter(_cmpfunc, project_list))
    return list(check_list)

def get_all_check_project_list():
    return [x.get("id") for x in project_list if x.get("switch") == "on"]

def get_high_grade_project_list():
    return [x.get("id") for x in project_list if x.get("grade") == "高" and x.get("switch") == "on"]

def get_middle_grade_project_list():
    return [x.get("id") for x in project_list if x.get("grade") == "中" and x.get("switch") == "on"]

def get_low_grade_project_list():
    return [x.get("id") for x in project_list if x.get("grade") == "低" and x.get("switch") == "on"]


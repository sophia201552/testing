import json
from urllib.parse import quote, unquote
from subprocess import Popen, PIPE

NODE_EXEC = "engine %(command)s %(options)s"
# 文件名请改成随机不重复的，这里仅做测试
TEMP_SRC_FILE = 'temp.src.json'
TEMP_DIST_FILE = 'temp.dist.json'

ds_module_info = {
    'module': {"_id":"5a1d3218fbd53cd03eb04a53","name":"数据源","options":{"activedGroup":"5a1d30dcf002e8ddeb780541","groups":[{"_id":"5a1d30dcf002e8ddeb780541","data":{"x1":"@72|Ti7_dr","x2":"@72|Ti13_dr","x3":"@72|Ti9_dr","y":"@72|Accum_RealTimePower_svr"},"name":"Default"}],"params":[{"description":"暂无描述","name":"y","sample":"@projectId|name","tags":[]},{"description":"暂无描述","name":"x1","sample":"@projectId|name","tags":[]},{"description":"暂无描述","name":"x2","sample":"@projectId|name","tags":[]},{"description":"暂无描述","name":"x3","sample":"@projectId|name","tags":[]}],"timeConfig":{"timeEnd":"2017-11-28 17:48:00","timeFormat":"m5","timeStart":"2017-11-27 17:48:00"},"type":"history"},"outputs":[{"_id":"5a1fa3292164e2640d44f670"}],"strategyId":"5a1d3214759d18bd7cd0f6dd","type":101,"x":120,"y":163},
    'moduleInputData': [],
    'moduleOutputData': [],
    'query': [],
    'response': [{"data":{"data":[{"value":[31915002.74,31916634.44,31918338.68,31920067.1,31921743.19,31924134.9,31926910.59,31929686.28,31932532.75,31935591.57,31938574.84,31941520.34,31944379.39,31947221.15,31948888.068,31949967.56,31950240.89,31950441.19,31950642.059,31950876.017,31951319.12,31951774.35,31952242.19,31952730.2,31952730.2],"name":"y","dsId":"@72|Accum_RealTimePower_svr"},{"value":[67.59,67.59,67.59,67.59,67.59,67.59,67.59,86.21,86.21,86.21,86.21,86.21,85.52,85.52,85.52,85.52,85.52,85.52,85.52,85.52,85.52,85.52,85.52,85.52,85.52],"name":"x1","dsId":"@72|Ti7_dr"},{"value":[89.66,89.66,89.66,89.66,89.66,89.66,89.66,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93,97.93],"name":"x2","dsId":"@72|Ti13_dr"},{"value":[67.59,67.59,67.59,67.59,67.59,67.59,67.59,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86,35.86],"name":"x3","dsId":"@72|Ti9_dr"}],"time":["2017-11-27 17:50:00","2017-11-27 18:50:00","2017-11-27 19:50:00","2017-11-27 20:50:00","2017-11-27 21:50:00","2017-11-27 22:50:00","2017-11-27 23:50:00","2017-11-28 00:50:00","2017-11-28 01:50:00","2017-11-28 02:50:00","2017-11-28 03:50:00","2017-11-28 04:50:00","2017-11-28 05:50:00","2017-11-28 06:50:00","2017-11-28 07:50:00","2017-11-28 08:50:00","2017-11-28 09:50:00","2017-11-28 10:50:00","2017-11-28 11:50:00","2017-11-28 12:50:00","2017-11-28 13:50:00","2017-11-28 14:50:00","2017-11-28 15:50:00","2017-11-28 16:50:00","2017-11-28 17:50:00"]},"dataType":"DS_HIS_OUTPUT"},{"data":[{"name":"y","dsId":"@72|Accum_RealTimePower_svr"},{"name":"x1","dsId":"@72|Ti7_dr"},{"name":"x2","dsId":"@72|Ti13_dr"},{"name":"x3","dsId":"@72|Ti9_dr"}],"dataType":"DS_OPT"}]
}

# 拼 moduleInputData
# 由于是顶级输入模块，故不用调命令行，直接写值
ds_module_info['moduleInputData'] = []

# 拼 query
with open(TEMP_DIST_FILE, 'w') as f:
    f.write(json.dumps(ds_module_info))
command = NODE_EXEC % {
    'command': 'sv2:get_query',
    'options': "-t \"%s\"" % TEMP_DIST_FILE
}
prc = Popen(command, shell=True, stdout=PIPE)
prc.wait()
ds_module_info['query'] = unquote(prc.stdout.read().decode('utf-8'))
print('query:', ds_module_info['query'])

# 拼 moduleOutputData
with open(TEMP_DIST_FILE, 'w') as f:
    f.write(json.dumps(ds_module_info))
command = NODE_EXEC % {
    'command': 'sv2:get_output',
    'options': "-t \"%s\"" % TEMP_DIST_FILE
}
prc = Popen(command, shell=True, stdout=PIPE)
prc.wait()
ds_module_info['moduleOutputData'] = json.loads(unquote(prc.stdout.read().decode('utf-8')))
print('moduleOutputData:', ds_module_info['moduleOutputData'])

# 数据去重 模块
deduplicate_module_info = {
    'module': {"_id":"5a1fa3292164e2640d44f670","name":"数据去重","options":{"methods":{"toleranceLimits":3,"type":"SIMPLE"}},"outputs":[],"strategyId":"5a1d3214759d18bd7cd0f6dd","type":202,"x":363,"y":176},
    'moduleInputData': [],
    'moduleOutputData': [],
    'query': [],
    'response': []
}
# 拼 moduleInputData
with open(TEMP_SRC_FILE, 'w') as f:
    f.write(json.dumps([
        ds_module_info
        # 如果上级模块是多个模块的话，在后面追加
    ]))
with open(TEMP_DIST_FILE, 'w') as f:
    f.write(json.dumps(deduplicate_module_info))
command = NODE_EXEC % {
    'command': 'sv2:get_input',
    'options': "-s \"%s\" -t \"%s\"" % (
        TEMP_SRC_FILE,
        TEMP_DIST_FILE
    )
}
prc = Popen(command, shell=True, stdout=PIPE)
prc.wait()
deduplicate_module_info['moduleInputData'] = unquote(prc.stdout.read().decode('utf-8'))
print('moduleInputData:', deduplicate_module_info['moduleInputData'])

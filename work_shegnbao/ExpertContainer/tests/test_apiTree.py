#coding=utf-8
__author__ = 'angelia'

import pytest
from ExpertContainer.api.views import *

@pytest.mark.p0
@pytest.mark.parametrize(('language','expected'),[
    ('zh',
     [
    {
        "dis_cription": "获取当前时间",
        "api_type": "时间函数",
        "sample": "get_act_time()",
        "add_id": 0,
        "name": "get_act_time"
    },
    {
        "dis_cription": "获取服务器执行的时间",
        "api_type": "时间函数",
        "sample": "get_server_time()",
        "add_id": 0,
        "name": "get_server_time"
    },
    {
        "dis_cription": "获取当天的开始时间",
        "api_type": "时间函数",
        "sample": "time_get_day_begin()",
        "add_id": 0,
        "name": "time_get_day_begin"
    },
    {
        "dis_cription": "获取本周的开始时间",
        "api_type": "时间函数",
        "sample": "time_get_week_begin()",
        "add_id": 0,
        "name": "time_get_week_begin"
    },
    {
        "dis_cription": "获取本小时的开始时间",
        "api_type": "时间函数",
        "sample": "time_get_hour_begin()",
        "add_id": 0,
        "name": "time_get_hour_begin"
    },
    {
        "dis_cription": "获取本月的开始时间",
        "api_type": "时间函数",
        "sample": "time_get_month_begin()",
        "add_id": 0,
        "name": "time_get_month_begin"
    },
    {
        "dis_cription": "获取本年的开始时间",
        "api_type": "时间函数",
        "sample": "time_get_year_begin()",
        "add_id": 0,
        "name": "time_get_year_begin"
    },
    {
        "dis_cription": "时间对象转日期字符串",
        "api_type": "时间函数",
        "sample": "time_to_string(get_act_time())",
        "add_id": 0,
        "name": "time_to_string"
    },
    {
        "dis_cription": "日期字符串转时间对象",
        "api_type": "时间函数",
        "sample": "time_from_string('2016-1-1 10:00:00')",
        "add_id": 0,
        "name": "time_from_string"
    },
    {
        "dis_cription": "冷机诊断",
        "api_type": "诊断",
        "sample": "equipTag = 'Chiller' \npointMap = {'ChOnOff':'Ch001_ChOnOff'        ,'ChLeaveEvapTemp':'Ch001_ChLeaveEvapTemp','AmperRatio': 'Ch001_CurrentPercentage'        ,'ModeOnOff':'Ch001_AutoMode',} \ndiagnosis_equipment_chiller('冷热源','冷水系统', '1#冷水机组',equipTag, pointMap)",
        "add_id": 1,
        "name": "diagnosis_equipment_chiller"
    },
    {
        "dis_cription": "传感器诊断",
        "api_type": "诊断",
        "sample": "equipTag = 'singleSensor' \npointMap = {'point': 'ZL_F9_FAU001_RH'}\ndiagnosis_equipment_sensor_common('末端',sensor['page'], sensor['label'],equipTag, pointMap,1, 99)",
        "add_id": 1,
        "name": "diagnosis_equipment_sensor_common"
    },
    {
        "dis_cription": "当天的诊断统计",
        "api_type": "诊断",
        "sample": "diagnosis_rank_this_day(projId)",
        "add_id": 1,
        "name": "diagnosis_rank_this_day"
    },
    {
        "dis_cription": "本周的诊断统计",
        "api_type": "诊断",
        "sample": "diagnosis_rank_this_week(projId)",
        "add_id": 1,
        "name": "diagnosis_rank_this_week"
    },
    {
        "dis_cription": "范围时间内的诊断统计",
        "api_type": "诊断",
        "sample": "diagnosis_rank_in_time_range(projId,'2016-09-06 00:00:00','2016-09-06 11:00:00')",
        "add_id": 1,
        "name": "diagnosis_rank_in_time_range"
    },
    {
        "dis_cription": "本月初到当天的故障个数及故障发生时长的统计",
        "api_type": "诊断",
        "sample": "stat_fault_by_faultname(projId)",
        "add_id": 1,
        "name": "stat_fault_by_faultname"
    },
    {
        "dis_cription": "根据给定时间统计的故障个数及故障发生时长",
        "api_type": "诊断",
        "sample": "stat_fault_worktime_by_faultname(projId,'2016-09-06 00:00:00','2016-09-06 11:00:00')",
        "add_id": 1,
        "name": "stat_fault_worktime_by_faultname"
    },
    {
        "dis_cription": "本月初到当天每个组的故障个数及故障发生时长的统计",
        "api_type": "诊断",
        "sample": "stat_fault_by_buildingId(projId)",
        "add_id": 1,
        "name": "stat_fault_by_buildingId"
    },
    {
        "dis_cription": "本月初到当天每个页面的故障个数及故障发生时长的统计",
        "api_type": "诊断",
        "sample": "stat_fault_by_zoneId(projId)",
        "add_id": 1,
        "name": "stat_fault_by_zoneId"
    },
    {
        "dis_cription": "本月初到当天的工作时间故障个数及故障发生时长的统计",
        "api_type": "诊断",
        "sample": "stat_fault_by_faultname_time(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00','08:00:00','17:00:00')",
        "add_id": 1,
        "name": "stat_fault_by_faultname_time"
    },
    {
        "dis_cription": "故障所对应的能耗",
        "api_type": "诊断",
        "sample": "get_energy_by_faultNames(projId,['风阀过大'],'2016-09-06 00:00:00','2016-09-08 11:00:00','08:00:00','Day')",
        "add_id": 1,
        "name": "get_energy_by_faultNames"
    },
    {
        "dis_cription": "统计给定时间段内 故障总条数 、能耗浪费",
        "api_type": "诊断",
        "sample": "get_energy_all_by_time(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_energy_all_by_time"
    },
    {
        "dis_cription": "统计给定时间段内 故障总条数 、能耗浪费",
        "api_type": "诊断",
        "sample": "get_energy_all_by_time_v2(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_energy_all_by_time_v2"
    },
    {
        "dis_cription": "统计给定时间段内 按systemname统计的故障条数、能耗浪费",
        "api_type": "诊断",
        "sample": "get_energy_by_systemName(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_energy_by_systemName"
    },
    {
        "dis_cription": "统计给定时间段内 按systemname统计的故障条数、能耗浪费",
        "api_type": "诊断",
        "sample": "get_energy_by_systemName_v2(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_energy_by_systemName_v2"
    },
    {
        "dis_cription": "按节能量降序排列的能耗浪费信息",
        "api_type": "诊断",
        "sample": "get_energylist_by_faultName_order_by_energy(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_energylist_by_faultName_order_by_energy"
    },
    {
        "dis_cription": "按节能量降序排列的能耗浪费信息(新版诊断)",
        "api_type": "诊断",
        "sample": "get_energylist_by_faultName_order_by_energy_v2(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_energylist_by_faultName_order_by_energy_v2"
    },
    {
        "dis_cription": "新增工单的数量",
        "api_type": "诊断",
        "sample": "get_new_order_num(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_new_order_num"
    },
    {
        "dis_cription": "新增工单的数量",
        "api_type": "诊断",
        "sample": "get_new_order_num_v2(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_new_order_num_v2"
    },
    {
        "dis_cription": "完成工单的数量",
        "api_type": "诊断",
        "sample": "get_finished_order_num(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_finished_order_num"
    },
    {
        "dis_cription": "完成工单的数量",
        "api_type": "诊断",
        "sample": "get_finished_order_num_v2(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_finished_order_num_v2"
    },
    {
        "dis_cription": "平均响应时间",
        "api_type": "诊断",
        "sample": "get_response_time_avg(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_response_time_avg"
    },
    {
        "dis_cription": "平均响应时间(新版诊断)",
        "api_type": "诊断",
        "sample": "get_response_time_avg_v2(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_response_time_avg_v2"
    },
    {
        "dis_cription": "获取点的实时值,默认为浮点数格式",
        "api_type": "数据获取",
        "sample": "get_data('pointName')",
        "add_id": 1,
        "name": "get_data"
    },
    {
        "dis_cription": "获取点的实时值整形格式",
        "api_type": "数据获取",
        "sample": "get_data_int('pointName')",
        "add_id": 1,
        "name": "get_data_int"
    },
    {
        "dis_cription": "获取点的实时值字符串格式",
        "api_type": "数据获取",
        "sample": "get_data_string('pointName')",
        "add_id": 1,
        "name": "get_data_string"
    },
    {
        "dis_cription": "获取点的实时值json字典格式",
        "api_type": "数据获取",
        "sample": "get_data_json('pointName')",
        "add_id": 1,
        "name": "get_data_json"
    },
    {
        "dis_cription": "获取点的某一时刻的值",
        "api_type": "数据获取",
        "sample": "get_data_at_time(['pointName'],'2016-1-1 10:00:00')",
        "add_id": 1,
        "name": "get_data_at_time"
    },
    {
        "dis_cription": "获取点的某段时间的历史值",
        "api_type": "数据获取",
        "sample": "get_his_data_time_range(['pointName'],'2016-1-1 10:00:00','2016-1-1 11:00:00','m5')",
        "add_id": 1,
        "name": "get_his_data_time_range"
    },
    {
        "dis_cription": "获取点的上一小时的平均值",
        "api_type": "数据获取",
        "sample": "get_avg_data_of_last_hour('pointName')",
        "add_id": 1,
        "name": "get_avg_data_of_last_hour"
    },
    {
        "dis_cription": "获取点的上一小时的历史值",
        "api_type": "数据获取",
        "sample": "get_history_data_of_last_hour('pointName')",
        "add_id": 1,
        "name": "get_history_data_of_last_hour"
    },
    {
        "dis_cription": "计算上一个小时的状态比",
        "api_type": "数据获取",
        "sample": "get_status_timeratio_of_last_hour('pointName', nStatus)",
        "add_id": 1,
        "name": "get_status_timeratio_of_last_hour"
    },
    {
        "dis_cription": "获取最近一次的更新时间和值",
        "api_type": "数据获取",
        "sample": "get_last_update_time_value('pointName')",
        "add_id": 1,
        "name": "get_last_update_time_value"
    },
    {
        "dis_cription": "获取当前这个点多久（返回分钟数）没有更新",
        "api_type": "数据获取",
        "sample": "get_last_update_delta_minutes_of_this_point()",
        "add_id": 0,
        "name": "get_last_update_delta_minutes_of_this_point"
    },
    {
        "dis_cription": "获取如电表高低位数据的10进制值",
        "api_type": "数据获取",
        "sample": "num_join_int64(0,0,15139,4268) 返回结果为992153772",
        "add_id": 0,
        "name": "num_join_int64"
    },
    {
        "dis_cription": "获取项目设备完好率",
        "api_type": "数据获取",
        "sample": "statistics_equipment_intact_rate_pandect(72, 'en')",
        "add_id": 0,
        "name": "statistics_equipment_intact_rate_pandect"
    },
    {
        "dis_cription": "获取项目设备完好率(新版诊断)",
        "api_type": "数据获取",
        "sample": "statistics_equipment_intact_rate_pandect_v2(293)",
        "add_id": 0,
        "name": "statistics_equipment_intact_rate_pandect_v2"
    },
    {
        "dis_cription": "通过巡更项目id获取巡更的完成率",
        "api_type": "数据获取",
        "sample": "patrol_complete_rate(144)",
        "add_id": 0,
        "name": "patrol_complete_rate"
    },
    {
        "dis_cription": "获取该项目存储空间",
        "api_type": "数据获取",
        "sample": "get_storage_by_projId()",
        "add_id": 1,
        "name": "get_storage_by_projId"
    },
    {
        "dis_cription": "获取当前notice数量",
        "api_type": "数据获取",
        "sample": "get_fault_notice_count()",
        "add_id": 1,
        "name": "get_fault_notice_count"
    },
    {
        "dis_cription": "计算多个值最近1小时内到现在为止连续非零平均数",
        "api_type": "能耗计算",
        "sample": "calc_avg_if_run(['point_name1','point_name2'],'your condition',['run_point_name1','run_point_name2'])",
        "add_id": 1,
        "name": "calc_avg_of_last_hour_nozero"
    },
    {
        "dis_cription": "计算多个值在运行状态下的平均值,比如计算电流百分比的有效平均值",
        "api_type": "能耗计算",
        "sample": "calc_avg_if_run(['point_name1','point_name2'],'your condition',['run_point_name1','run_point_name2'])",
        "add_id": 1,
        "name": "calc_avg_if_run"
    },
    {
        "dis_cription": "计算一天的开关次数,时间间隔为1小时",
        "api_type": "能耗计算",
        "sample": "calc_count_in_day('pointName','m5',-1)",
        "add_id": 1,
        "name": "calc_count_in_day"
    },
    {
        "dis_cription": "计算上一小时的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_hour('pointName',1/12.0,'m5')",
        "add_id": 1,
        "name": "calc_sum_hour"
    },
    {
        "dis_cription": "计算当日的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_day('pointName',1/12.0,'m5')",
        "add_id": 1,
        "name": "calc_sum_day"
    },
    {
        "dis_cription": "计算昨日的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_last_day('pointName',1/12.0,'m5')",
        "add_id": 1,
        "name": "calc_sum_last_day"
    },
    {
        "dis_cription": "计算某一日的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_one_day('pointName',1/12.0,'m5','2016-1-1 10:00:00')",
        "add_id": 1,
        "name": "calc_sum_one_day"
    },
    {
        "dis_cription": "计算本周的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_this_week('pointName',1/12.0,'m5')",
        "add_id": 1,
        "name": "calc_sum_this_week"
    },
    {
        "dis_cription": "计算某一周的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_one_week('pointName',1/12.0,'m5',-1)",
        "add_id": 1,
        "name": "calc_sum_one_week"
    },
    {
        "dis_cription": "计算本月的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_this_month('pointName',1.0,'h1')",
        "add_id": 1,
        "name": "calc_sum_this_month"
    },
    {
        "dis_cription": "计算某月的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_one_month('pointName',1.0,'h1',6)",
        "add_id": 1,
        "name": "calc_sum_one_month"
    },
    {
        "dis_cription": "计算今年的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_this_year('pointName',1.0)",
        "add_id": 1,
        "name": "calc_sum_this_year"
    },
    {
        "dis_cription": "计算去年的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_last_year('pointName',1.0)",
        "add_id": 1,
        "name": "calc_sum_last_year"
    },
    {
        "dis_cription": "计算某一年的该点的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_year('pointName',1.0,2016)",
        "add_id": 1,
        "name": "calc_sum_year"
    },
    {
        "dis_cription": "计算多个点的实时值的和",
        "api_type": "能耗计算",
        "sample": "calc_sum_in_points(['pointName1','pointName2'])",
        "add_id": 1,
        "name": "calc_sum_in_points"
    },
    {
        "dis_cription": "计算水泵功率",
        "api_type": "能耗计算",
        "sample": "calc_power_by_run('point_name',A float number)",
        "add_id": 1,
        "name": "calc_power_by_run"
    },
    {
        "dis_cription": "计算冷机功率",
        "api_type": "能耗计算",
        "sample": "calc_power_by_amp('point_name',A float number)",
        "add_id": 1,
        "name": "calc_power_by_amp"
    },
    {
        "dis_cription": "计算变频泵功率",
        "api_type": "能耗计算",
        "sample": "calc_power_by_vsd_run('point_name',A float number,A float number)",
        "add_id": 1,
        "name": "calc_power_by_vsd_run"
    },
    {
        "dis_cription": "计算差值,比如趋近温度",
        "api_type": "能耗计算",
        "sample": "calc_delta_if_run('a_point_name', 'b_point_name', 'run_point_name')",
        "add_id": 1,
        "name": "calc_delta_if_run"
    },
    {
        "dis_cription": "计算多个值的最大值",
        "api_type": "能耗计算",
        "sample": "calc_max_in_points(['pointname1','pointname2','pointname3'])",
        "add_id": 1,
        "name": "calc_max_in_points"
    },
    {
        "dis_cription": "计算多个值的最小值",
        "api_type": "能耗计算",
        "sample": "calc_min_in_points(['pointname1','pointname2','pointname3'])",
        "add_id": 1,
        "name": "calc_min_in_points"
    },
    {
        "dis_cription": "求一天中的最大值",
        "api_type": "能耗计算",
        "sample": "calc_max_in_day('pointname','m5')",
        "add_id": 1,
        "name": "calc_max_in_day"
    },
    {
        "dis_cription": "计算冷机冷量",
        "api_type": "能耗计算",
        "sample": "calc_load_wo_flow('EnterEvapPointName', 'LeaveEvapPointName', A float number, 'OnOffPointName')",
        "add_id": 1,
        "name": "calc_load_wo_flow"
    },
    {
        "dis_cription": "计算冷机冷量",
        "api_type": "能耗计算",
        "sample": "calc_load_w_flow('EnterEvapPointName', 'LeaveEvapPointName', 'flowPointName', 'OnOffPointName')",
        "add_id": 1,
        "name": "calc_load_w_flow"
    },
    {
        "dis_cription": "计算效率",
        "api_type": "能耗计算",
        "sample": "calc_eff_smooth('LoadPointName', 'powerPointName')",
        "add_id": 1,
        "name": "calc_eff_smooth"
    },
    {
        "dis_cription": "同时刻数据对比",
        "api_type": "能耗计算",
        "sample": "calc_compare_same_time_diff_day('pointName','m5')",
        "add_id": 1,
        "name": "calc_compare_same_time_diff_day"
    },
    {
        "dis_cription": "计算该点的实时值与给定时间的值之间的差",
        "api_type": "能耗计算",
        "sample": "calc_subtraction_for_given_time('pointName','2016-7-1 10:00:00')",
        "add_id": 1,
        "name": "calc_subtraction_for_given_time"
    },
    {
        "dis_cription": "pointName每五分钟累加一次,从birthTime开始累加,累加到strAccumPointName上,成为一个永久累积量",
        "api_type": "能耗计算",
        "sample": "calc_accumulate(strAccumPointName, pointName, strBirthTime, 'm5', 1.0)",
        "add_id": 1,
        "name": "calc_accumulate"
    },
    {
        "dis_cription": "输出自定义log信息",
        "api_type": "系统功能",
        "sample": "log_str('我的测试点:%s'%(get_data('test'))",
        "add_id": 0,
        "name": "log_str"
    },
    {
        "dis_cription": "补一个项目制定时刻的历史数据",
        "api_type": "系统功能",
        "sample": "patch_data_sharp_clock(4, None, '2016-10-09 11:05:00')",
        "add_id": 1,
        "name": "patch_data_sharp_clock"
    },
    {
        "dis_cription": "获取气象数据",
        "api_type": "系统功能",
        "sample": "weather_get_by_cityname('shanghai')",
        "add_id": 0,
        "name": "weather_get_by_cityname"
    },
    {
        "dis_cription": "获取气象数据",
        "api_type": "系统功能",
        "sample": "weather_get_by_cityid('AU2147714')",
        "add_id": 0,
        "name": "weather_get_by_cityid"
    },
    {
        "dis_cription": "获取工单状态",
        "api_type": "系统功能",
        "sample": "",
        "add_id": 0,
        "name": "get_work_order_status"
    },
    {
        "dis_cription": "发送工单",
        "api_type": "系统功能",
        "sample": "",
        "add_id": 0,
        "name": "send_work_order"
    },
    {
        "dis_cription": "发送邮件消息",
        "api_type": "系统功能",
        "sample": "send_message_by_email(userIdList, strSubject, strContent)",
        "add_id": 0,
        "name": "send_message_by_email"
    },
    {
        "dis_cription": "发送app推送消息",
        "api_type": "系统功能",
        "sample": "send_message_by_app(userIdList, strSubject, strContent)",
        "add_id": 0,
        "name": "send_message_by_app"
    },
    {
        "dis_cription": "发送手机短信消息",
        "api_type": "系统功能",
        "sample": "send_message_by_mobile( userIdList, strContent)",
        "add_id": 0,
        "name": "send_message_by_mobile"
    },
    {
        "dis_cription": "获取工单ID",
        "api_type": "系统功能",
        "sample": "get_work_order_id('问题通知222222222', 'golding.gu@rnbtech.com.hk')",
        "add_id": 0,
        "name": "get_work_order_id"
    },
    {
        "dis_cription": "关闭工单",
        "api_type": "系统功能",
        "sample": "close_work_order(10243)",
        "add_id": 0,
        "name": "close_work_order"
    },
    {
        "dis_cription": "获取诊断fault最新的状态",
        "api_type": "系统功能",
        "sample": "get_fault_last_update_time_status()",
        "add_id": 0,
        "name": "get_fault_last_update_time_status"
    },
    {
        "dis_cription": "获取国际城市天气，湿度等",
        "api_type": "系统功能",
        "sample": "weather_get_from_weather_com('CHXX0116:1:CH')",
        "name": "weather_get_from_weather_com"
    },
    {
        "dis_cription": "计算本项目某个点本小时（相对于小时初）的增量",
        "api_type": "能耗计算",
        "sample": "calc_hourly_delta_of_accum('pointName')",
        "add_id": 0,
        "name": "calc_hourly_delta_of_accum"
    },
    {
        "dis_cription": "计算本项目某个点本日（相对于今日零点零分）的增量",
        "api_type": "能耗计算",
        "sample": "calc_daily_delta_of_accum('pointName')",
        "add_id": 0,
        "name": "calc_daily_delta_of_accum"
    },
    {
        "dis_cription": "计算本项目某个点本周（相对于本周一零点零分）的增量",
        "api_type": "能耗计算",
        "sample": "calc_weekly_delta_of_accum('pointName')",
        "add_id": 0,
        "name": "calc_weekly_delta_of_accum"
    },
    {
        "dis_cription": "计算本项目某个点本月（相对于本月一日零点零分）的增量",
        "api_type": "能耗计算",
        "sample": "calc_monthly_delta_of_accum('pointName')",
        "add_id": 0,
        "name": "calc_monthly_delta_of_accum"
    },
    {
        "dis_cription": "计算累积量在本周内的增量",
        "api_type": "系统功能",
        "sample": "calc_weekly_delta_of_accum('accumPointName')",
        "add_id": 0,
        "name": "calc_weekly_delta_of_accum"
    },
    {
        "dis_cription": "计算累积量在本日内的增量",
        "api_type": "系统功能",
        "sample": "calc_daily_delta_of_accum('accumPointName')",
        "add_id": 0,
        "name": "calc_daily_delta_of_accum"
    },
    {
        "dis_cription": "计算累积量在本小时内的增量",
        "api_type": "系统功能",
        "sample": "calc_hourly_delta_of_accum('accumPointName')",
        "add_id": 0,
        "name": "calc_hourly_delta_of_accum"
    },
    {
        "dis_cription": "计算累积量在本月内的增量",
        "api_type": "系统功能",
        "sample": "calc_monthly_delta_of_accum('accumPointName')",
        "add_id": 0,
        "name": "calc_monthly_delta_of_accum"
    },
    {
        "dis_cription": "Post json数据至url",
        "api_type": "系统功能",
        "sample": " http_post_json(url, data,t=30)",
        "add_id": 0,
        "name": "http_post_json"
    },
    {
        "dis_cription": "从url获取json数据",
        "api_type": "系统功能",
        "sample": " http_get_json(url, timeout=10)",
        "add_id": 0,
        "name": "http_get_json"
    },
    {
        "dis_cription": "Post form数据至url",
        "api_type": "系统功能",
        "sample": "http_post_form(url, data,t=30)",
        "add_id": 0,
        "name": "http_post_form"
    },
    {
        "dis_cription": "Post带cookie的json数据至url",
        "api_type": "系统功能",
        "sample": "http_post_json_with_cookie(url, data,t=30)",
        "add_id": 0,
        "name": "http_post_json_with_cookie"
    },
    {
        "dis_cription": "从url获取json数据其中获取时发送cookie信息",
        "api_type": "系统功能",
        "sample": "http_get_with_cookie(url,timeout=10)",
        "add_id": 0,
        "name": "http_get_with_cookie"
    },
    {
        "dis_cription": "从url获取str数据",
        "api_type": "系统功能",
        "sample": "http_get_data_text(url,timeout=10)",
        "add_id": 0,
        "name": "http_get_data_text"
    },
    {
        "dis_cription": "post文件至url",
        "api_type": "系统功能",
        "sample": "http_post_data_files(url,files,timeout=10)",
        "add_id": 0,
        "name": "http_post_data_files"
    },
    {
        "dis_cription": "发送工单",
        "api_type": "系统功能",
        "sample": "send_work_order_smart(strWorkOrderName, fn, executeNameList, nDelayLimitMinutes, nSolveMinutes)",
        "add_id": 0,
        "name": "send_work_order_smart"
    },
    {
        "dis_cription": "获取pm等天气数据",
        "api_type": "系统功能",
        "sample": "get_pm25_from_web(\"shanghai\")",
        "add_id": 0,
        "name": "get_pm25_from_web"
    },
    {
        "dis_cription": "获取pm等天气数据后面可接具体区域",
        "api_type": "系统功能",
        "sample": "get_pm25_from_web_v2(\"shanghai\",\"浦东川沙\")",
        "add_id": 0,
        "name": "get_pm25_from_web_v2"
    },
    {
        "dis_cription": "自动每小时补数",
        "api_type": "系统功能",
        "sample": "patch_data_sharp_clock_every_hour(projId, pointList,5)",
        "add_id": 0,
        "name": "patch_data_sharp_clock_every_hour"
    },
    {
        "dis_cription": "获取Case是否最近是否发送过",
        "api_type": "系统功能",
        "sample": "checkCaseStatus(\"Base001\",30)",
        "add_id": 0,
        "name": "checkCaseStatus"
    },
    {
        "dis_cription": "报警之前填入时间至数据库",
        "api_type": "系统功能",
        "sample": "setCaseNoticeTime(\"Base001\")",
        "add_id": 0,
        "name": "setCaseNoticeTime"
    },
    {
        "dis_cription": "自动每天补数",
        "api_type": "系统功能",
        "sample": "patch_data_sharp_clock_every_day(projId, pointList, 0,15)",
        "add_id": 0,
        "name": "patch_data_sharp_clock_in_time_range"
    },
    {
        "dis_cription": "过滤突降的数据错点",
        "api_type": "数据获取",
        "sample": "filter_point_only_increase('pointName')",
        "add_id": 1,
        "name": "filter_point_only_increase"
    },
    {
        "dis_cription": "过滤不大于零的数据错点",
        "api_type": "数据获取",
        "sample": "filter_point_gt_zero('pointName')",
        "add_id": 1,
        "name": "filter_point_gt_zero"
    },
    {
        "dis_cription": "过滤超过波动范围的值",
        "api_type": "数据获取",
        "sample": "filter_point_change_limit_ratio('pointName',2)",
        "add_id": 1,
        "name": "filter_point_change_limit_ratio"
    },
    {
        "dis_cription": "调用webservice",
        "api_type": "系统功能",
        "sample": "invoke_web_service(url,method,params)",
        "add_id": 3,
        "name": "invoke_web_service"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "sys_get_mq_count()",
        "name": "sys_get_mq_count",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "time_get_last_week_begin()",
        "name": "time_get_last_week_begin",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "time_get_last_day_begin()",
        "name": "time_get_last_day_begin",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "time_get_last_month_begin()",
        "name": "time_get_last_month_begin",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "send_beopmsg()",
        "name": "send_beopmsg",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "send_alarm_simple()",
        "name": "send_alarm_simple",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "create_all_energy_standard_point_by_tag()",
        "name": "create_all_energy_standard_point_by_tag",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_hours_ago_fault_sent_user()",
        "name": "get_hours_ago_fault_sent_user",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "send_fault_notice_by_email()",
        "name": "send_fault_notice_by_email",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "send_message_by_phonenum()",
        "name": "send_message_by_phonenum",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_hours_ago_web_report_sent_user()",
        "name": "get_hours_ago_web_report_sent_user",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "send_web_report()",
        "name": "send_web_report",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_data()",
        "name": "set_data",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_data_algorithm()",
        "name": "set_data_algorithm",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_data_virtual()",
        "name": "set_data_virtual",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_data_calcpoint()",
        "name": "set_data_calcpoint",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_data_time_range()",
        "name": "set_data_time_range",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_data_history_of_this_point()",
        "name": "set_data_history_of_this_point",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_data_history()",
        "name": "set_data_history",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_third_party_data()",
        "name": "get_third_party_data",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_data_time_range()",
        "name": "get_data_time_range",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_his_data_with_time()",
        "name": "get_his_data_with_time",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_data_float()",
        "name": "get_data_float",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_status_change_of_last_hour()",
        "name": "get_status_change_of_last_hour",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_last_value()",
        "name": "get_last_value",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_data_all_of_project()",
        "name": "get_data_all_of_project",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_clear_data_from_site()",
        "name": "set_clear_data_from_site",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_data_from_site()",
        "name": "set_data_from_site",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "copy_data_to_other_project()",
        "name": "copy_data_to_other_project",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_lost_time_ratio_of_today()",
        "name": "get_lost_time_ratio_of_today",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_history_data_of_today()",
        "name": "get_history_data_of_today",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "filter_point_energy_consumption()",
        "name": "filter_point_energy_consumption",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "patch_data_sharp_clock_every_day()",
        "name": "patch_data_sharp_clock_every_day",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "json_to_data()",
        "name": "json_to_data",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "json_from_data()",
        "name": "json_from_data",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_weather_data()",
        "name": "get_weather_data",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "weather_get_by_id()",
        "name": "weather_get_by_id",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "aq_get_by_cityname()",
        "name": "aq_get_by_cityname",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_work_order_create_time()",
        "name": "get_work_order_create_time",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "finish_work_order()",
        "name": "finish_work_order",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "reset_work_order_if_open()",
        "name": "reset_work_order_if_open",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "send_diagnosis_notice()",
        "name": "send_diagnosis_notice",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "send_diagnosis_notice_by_object()",
        "name": "send_diagnosis_notice_by_object",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "diagnosis_equipment_valve()",
        "name": "diagnosis_equipment_valve",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "diagnosis_equipment_ahu()",
        "name": "diagnosis_equipment_ahu",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "diagnosis_equipment_sensor_t()",
        "name": "diagnosis_equipment_sensor_t",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "diagnosis_equipment_sensor_p()",
        "name": "diagnosis_equipment_sensor_p",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_failure_number_and_failure_time_of_statistics()",
        "name": "get_failure_number_and_failure_time_of_statistics",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "statistics_realtime_fault_algorithm()",
        "name": "statistics_realtime_fault_algorithm",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "fault_need_check()",
        "name": "fault_need_check",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_fault_data()",
        "name": "get_fault_data",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "kpi_calc_from_fault()",
        "name": "kpi_calc_from_fault",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "kpi_sum()",
        "name": "kpi_sum",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "kpi_sum_root()",
        "name": "kpi_sum_root",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "send_data_to_mqtt()",
        "name": "send_data_to_mqtt",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "send_points_to_mqtt()",
        "name": "send_points_to_mqtt",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "http_get_directly_text()",
        "name": "http_get_directly_text",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "air_calc_ts_by_t_rh()",
        "name": "air_calc_ts_by_t_rh",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "air_calc_tl_by_t_rh()",
        "name": "air_calc_tl_by_t_rh",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "air_calc_h()",
        "name": "air_calc_h",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "air_calc_x()",
        "name": "air_calc_x",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "calibration_by_baseline()",
        "name": "calibration_by_baseline",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_data_to_site()",
        "name": "set_data_to_site",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_global_storage()",
        "name": "get_global_storage",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "set_global_storage()",
        "name": "set_global_storage",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "cloudpoint_exist()",
        "name": "cloudpoint_exist",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "cloudpoint_create_virtual()",
        "name": "cloudpoint_create_virtual",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_latest_time()",
        "name": "get_latest_time",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "hisdata_op_remove_history_data()",
        "name": "hisdata_op_remove_history_data",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "hisdata_op_remove_history_data_in_timerange()",
        "name": "hisdata_op_remove_history_data_in_timerange",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "remove_mutation_data()",
        "name": "remove_mutation_data",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "hisdata_op_remove_data_by_value()",
        "name": "hisdata_op_remove_data_by_value",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "update_history_data_replace_value()",
        "name": "update_history_data_replace_value",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "hisdata_op_replace_pointname()",
        "name": "hisdata_op_replace_pointname",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_cloudpoints_list()",
        "name": "get_cloudpoints_list",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_rawpoints_list()",
        "name": "get_rawpoints_list",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "autotest_check_name_conflict()",
        "name": "autotest_check_name_conflict",
        "add_id": 0,
        "api_type": "未分类"
    },
    {
        "dis_cription": "no documents till now",
        "sample": "get_web_service_info()",
        "name": "get_web_service_info",
        "add_id": 0,
        "api_type": "未分类"
    }
]
     ),
    ('en',
    [
    {
        "dis_cription": "get the current system time",
        "api_type": "time function",
        "sample": "get_act_time()",
        "add_id": 0,
        "name": "get_act_time"
    },
    {
        "dis_cription": "get time format for today's zero hour",
        "api_type": "time function",
        "sample": "time_get_day_begin()",
        "add_id": 0,
        "name": "time_get_day_begin"
    },
    {
        "dis_cription": "get zero hour for this week's monday ",
        "api_type": "time function",
        "sample": "time_get_week_begin()",
        "add_id": 0,
        "name": "time_get_week_begin"
    },
    {
        "dis_cription": "get time format for this hour and the minute is 0",
        "api_type": "time function",
        "sample": "time_get_hour_begin()",
        "add_id": 0,
        "name": "time_get_hour_begin"
    },
    {
        "dis_cription": "get time format for this month at the first day",
        "api_type": "time function",
        "sample": "time_get_month_begin()",
        "add_id": 0,
        "name": "time_get_month_begin"
    },
    {
        "dis_cription": "get the frist day of this year",
        "api_type": "time function",
        "sample": "time_get_year_begin()",
        "add_id": 0,
        "name": "time_get_year_begin"
    },
    {
        "dis_cription": "format time object to string",
        "api_type": "time function",
        "sample": "time_to_string(get_act_time())",
        "add_id": 0,
        "name": "time_to_string"
    },
    {
        "dis_cription": "format date string to time object",
        "api_type": "time function",
        "sample": "time_from_string('2016-1-1 10:00:00')",
        "add_id": 0,
        "name": "time_from_string"
    },
    {
        "dis_cription": "diagnosis chiller",
        "api_type": "diagnosis function",
        "sample": "equipTag = 'Chiller' \npointMap = {'ChOnOff':'Ch001_ChOnOff'        ,'ChLeaveEvapTemp':'Ch001_ChLeaveEvapTemp','AmperRatio': 'Ch001_CurrentPercentage'        ,'ModeOnOff':'Ch001_AutoMode',} \ndiagnosis_equipment_chiller('冷热源','冷水系统', '1#冷水机组',equipTag, pointMap)",
        "add_id": 1,
        "name": "diagnosis_equipment_chiller"
    },
    {
        "dis_cription": "diagnosis sensor",
        "api_type": "diagnosis function",
        "sample": "equipTag = 'singleSensor' \npointMap = {'point': 'ZL_F9_FAU001_RH'}\ndiagnosis_equipment_sensor_common('末端',sensor['page'], sensor['label'],equipTag, pointMap,1, 99)",
        "add_id": 1,
        "name": "diagnosis_equipment_sensor_common"
    },
    {
        "dis_cription": "Statistical diagnosis of today",
        "api_type": "diagnosis function",
        "sample": "diagnosis_rank_this_day(projId)",
        "add_id": 1,
        "name": "diagnosis_rank_this_day"
    },
    {
        "dis_cription": "Statistical diagnosis of this week",
        "api_type": "diagnosis function",
        "sample": "diagnosis_rank_this_week(projId)",
        "add_id": 1,
        "name": "diagnosis_rank_this_week"
    },
    {
        "dis_cription": "Statistical diagnosis of the given time",
        "api_type": "diagnosis function",
        "sample": "diagnosis_rank_in_time_range(projId,'2016-09-06 00:00:00','2016-09-06 11:00:00')",
        "add_id": 1,
        "name": "diagnosis_rank_in_time_range"
    },
    {
        "dis_cription": "Failure number and failure long statistics of earlier this month",
        "api_type": "诊断",
        "sample": "stat_fault_by_faultname(projId)",
        "add_id": 1,
        "name": "stat_fault_by_faultname"
    },
    {
        "dis_cription": "Failure number and failure long statistics",
        "api_type": "诊断",
        "sample": "stat_fault_worktime_by_faultname(projId,'2016-09-06 00:00:00','2016-09-06 11:00:00')",
        "add_id": 1,
        "name": "stat_fault_worktime_by_faultname"
    },
    {
        "dis_cription": "Failure number and failure long statistics of each building of earlier this month",
        "api_type": "诊断",
        "sample": "stat_fault_by_buildingId(projId)",
        "add_id": 1,
        "name": "stat_fault_by_buildingId"
    },
    {
        "dis_cription": "Failure number and failure long statistics of each zone of earlier this month",
        "api_type": "诊断",
        "sample": "stat_fault_by_zoneId(projId)",
        "add_id": 1,
        "name": "stat_fault_by_zoneId"
    },
    {
        "dis_cription": "Failure number and failure long statistics of earlier this month in work time",
        "api_type": "诊断",
        "sample": "stat_fault_by_faultname_time(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00','08:00:00','17:00:00')",
        "add_id": 1,
        "name": "stat_fault_by_faultname_time"
    },
    {
        "dis_cription": "For the fault of the energy consumption",
        "api_type": "诊断",
        "sample": "get_energy_by_faultNames(projId,['Zone air temperature setpoint too cold'],'2016-09-06 00:00:00','2016-09-08 11:00:00','08:00:00','Day')",
        "add_id": 1,
        "name": "get_energy_by_faultNames"
    },
    {
        "dis_cription": "Statistics total number of article, waste of energy consumption",
        "api_type": "诊断",
        "sample": "get_energy_all_by_time(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_energy_all_by_time"
    },
    {
        "dis_cription": "Statistics total number of article, waste of energy consumption group by system name",
        "api_type": "诊断",
        "sample": "get_energy_by_systemName(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_energy_by_systemName"
    },
    {
        "dis_cription": "In descending order section energy waste of energy consumption information",
        "api_type": "诊断",
        "sample": "get_energylist_by_faultName_order_by_energy(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_energylist_by_faultName_order_by_energy"
    },
    {
        "dis_cription": "The number of new work order",
        "api_type": "诊断",
        "sample": "get_new_order_num(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_new_order_num"
    },
    {
        "dis_cription": "The number of finished work order",
        "api_type": "诊断",
        "sample": "get_finished_order_num(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_finished_order_num"
    },
    {
        "dis_cription": "The average response time",
        "api_type": "诊断",
        "sample": "get_response_time_avg(projId,'2016-09-06 00:00:00','2016-09-08 11:00:00')",
        "add_id": 1,
        "name": "get_response_time_avg"
    },
    {
        "dis_cription": "get the real data",
        "api_type": "data get",
        "sample": "get_data('pointName')",
        "add_id": 1,
        "name": "get_data"
    },
    {
        "dis_cription": "get the data of the given time",
        "api_type": "data get",
        "sample": "get_data_at_time('pointName','2016-1-1 10:00:00')",
        "add_id": 1,
        "name": "get_data_at_time"
    },
    {
        "dis_cription": "get the history data which time between two given times",
        "api_type": "data get",
        "sample": "get_his_data_time_range(['pointName'],'2016-1-1 10:00:00','2016-1-1 11:00:00','m5')",
        "add_id": 1,
        "name": "get_his_data_time_range"
    },
    {
        "dis_cription": "get average value of last hour",
        "api_type": "data get",
        "sample": "get_avg_data_of_last_hour('pointName')",
        "add_id": 1,
        "name": "get_avg_data_of_last_hour"
    },
    {
        "dis_cription": "get the history data of last hour",
        "api_type": "data get",
        "sample": "get_history_data_of_last_hour('pointName')",
        "add_id": 1,
        "name": "get_history_data_of_last_hour"
    },
    {
        "dis_cription": "get the percentage of two status of last hour",
        "api_type": "data get",
        "sample": "get_status_timeratio_of_last_hour('pointName', nStatus)",
        "add_id": 1,
        "name": "get_status_timeratio_of_last_hour"
    },
    {
        "dis_cription": "get storage",
        "api_type": "数据获取",
        "sample": "get_storage_by_projId()",
        "add_id": 1,
        "name": "get_storage_by_projId"
    },
    {
        "dis_cription": "get notice count",
        "api_type": "数据获取",
        "sample": "get_fault_notice_count()",
        "add_id": 1,
        "name": "get_fault_notice_count"
    },
    {
        "dis_cription": "get average value of some points at running status,for example,effective average value of current",
        "api_type": "energy calculation",
        "sample": "calc_avg_if_run(['point_name1','point_name2'],'your condition',['run_point_name1','run_point_name2'])",
        "add_id": 1,
        "name": "calc_avg_if_run"
    },
    {
        "dis_cription": "get count of open and close",
        "api_type": "energy calculation",
        "sample": "calc_count_in_day('pointName','m5',-1)",
        "add_id": 1,
        "name": "calc_count_in_day"
    },
    {
        "dis_cription": "get sum value of the data in last hour",
        "api_type": "energy calculation",
        "sample": "calc_sum_hour('pointName',1/12.0,'m5')",
        "add_id": 1,
        "name": "calc_sum_hour"
    },
    {
        "dis_cription": "get sum value of the data in today",
        "api_type": "energy calculation",
        "sample": "calc_sum_day('pointName',1/12.0,'m5')",
        "add_id": 1,
        "name": "calc_sum_day"
    },
    {
        "dis_cription": "get sum value of the data in yesterday",
        "api_type": "energy calculation",
        "sample": "calc_sum_last_day('pointName',1/12.0,'m5')",
        "add_id": 1,
        "name": "calc_sum_last_day"
    },
    {
        "dis_cription": "get sum value of the data in one day",
        "api_type": "energy calculation",
        "sample": "calc_sum_one_day('pointName',1/12.0,'m5','2016-1-1 10:00:00')",
        "add_id": 1,
        "name": "calc_sum_one_day"
    },
    {
        "dis_cription": "get sum value of the data in this week",
        "api_type": "energy calculation",
        "sample": "calc_sum_this_week('pointName',1/12.0,'m5')",
        "add_id": 1,
        "name": "calc_sum_this_week"
    },
    {
        "dis_cription": "get sum value of the data in a week which is a few weeks ago",
        "api_type": "energy calculation",
        "sample": "calc_sum_one_week('pointName',1/12.0,'m5',-1)",
        "add_id": 1,
        "name": "calc_sum_one_week"
    },
    {
        "dis_cription": "get sum value of the data in this month",
        "api_type": "energy calculation",
        "sample": "calc_sum_this_month('pointName',1.0,'h1')",
        "add_id": 1,
        "name": "calc_sum_this_month"
    },
    {
        "dis_cription": "get sum value of the data in one month",
        "api_type": "energy calculation",
        "sample": "calc_sum_one_month('pointName',1.0,'h1',6)",
        "add_id": 1,
        "name": "calc_sum_one_month"
    },
    {
        "dis_cription": "get sum value of the data in this year",
        "api_type": "energy calculation",
        "sample": "calc_sum_this_year('pointName',1.0)",
        "add_id": 1,
        "name": "calc_sum_this_year"
    },
    {
        "dis_cription": "get sum value of the data in last year",
        "api_type": "energy calculation",
        "sample": "calc_sum_last_year('pointName',1.0)",
        "add_id": 1,
        "name": "calc_sum_last_year"
    },
    {
        "dis_cription": "get sum value of the data in one year",
        "api_type": "energy calculation",
        "sample": "calc_sum_year('pointName',1.0,2016)",
        "add_id": 1,
        "name": "calc_sum_year"
    },
    {
        "dis_cription": "get sum value of some real data",
        "api_type": "energy calculation",
        "sample": "calc_sum_in_points(['pointName1','pointName2'])",
        "add_id": 1,
        "name": "calc_sum_in_points"
    },
    {
        "dis_cription": "get pump power",
        "api_type": "energy calculation",
        "sample": "calc_power_by_run('point_name',A float number)",
        "add_id": 1,
        "name": "calc_power_by_run"
    },
    {
        "dis_cription": "get cooling machine power",
        "api_type": "energy calculation",
        "sample": "calc_power_by_amp('point_name',A float number)",
        "add_id": 1,
        "name": "calc_power_by_amp"
    },
    {
        "dis_cription": "get variable frequency pump power",
        "api_type": "energy calculation",
        "sample": "calc_power_by_vsd_run('point_name',A float number,A float number)",
        "add_id": 1,
        "name": "calc_power_by_vsd_run"
    },
    {
        "dis_cription": "Calculate the difference, such as reaching the temperature",
        "api_type": "energy calculation",
        "sample": "calc_delta_if_run('a_point_name', 'b_point_name', 'run_point_name')",
        "add_id": 1,
        "name": "calc_delta_if_run"
    },
    {
        "dis_cription": "get max value of some data",
        "api_type": "energy calculation",
        "sample": "calc_max_in_points(['pointname1','pointname2','pointname3'])",
        "add_id": 1,
        "name": "calc_max_in_points"
    },
    {
        "dis_cription": "get min value of some data",
        "api_type": "energy calculation",
        "sample": "calc_min_in_points(['pointname1','pointname2','pointname3'])",
        "add_id": 1,
        "name": "calc_min_in_points"
    },
    {
        "dis_cription": "get max value of the data in this day",
        "api_type": "energy calculation",
        "sample": "calc_max_in_day('pointname','m5')",
        "add_id": 1,
        "name": "calc_max_in_day"
    },
    {
        "dis_cription": "get chiller load",
        "api_type": "energy calculation",
        "sample": "calc_load_wo_flow('EnterEvapPointName', 'LeaveEvapPointName', A float number, 'OnOffPointName')",
        "add_id": 1,
        "name": "calc_load_wo_flow"
    },
    {
        "dis_cription": "get chiller load",
        "api_type": "energy calculation",
        "sample": "calc_load_w_flow('EnterEvapPointName', 'LeaveEvapPointName', 'flowPointName', 'OnOffPointName')",
        "add_id": 1,
        "name": "calc_load_w_flow"
    },
    {
        "dis_cription": "get the efficiency of some point",
        "api_type": "energy calculation",
        "sample": "calc_eff_smooth('LoadPointName', 'powerPointName')",
        "add_id": 1,
        "name": "calc_eff_smooth"
    },
    {
        "dis_cription": "compared with the same time in yesterday",
        "api_type": "energy calculation",
        "sample": "calc_compare_same_time_diff_day('pointName','m5')",
        "add_id": 1,
        "name": "calc_compare_same_time_diff_day"
    },
    {
        "dis_cription": "Calculates the difference between the value of the current time and the value of a given time",
        "api_type": "energy calculation",
        "sample": "calc_subtraction_for_given_time('pointName','2016-7-1 10:00:00')",
        "add_id": 1,
        "name": "calc_subtraction_for_given_time"
    },
    {
        "dis_cription": "From the beginning of the 'birthTime', the value of the 'pointName' added to the 'strAccumPointName', every five minutes accumulated once",
        "api_type": "energy calculation",
        "sample": "calc_accumulate(strAccumPointName, pointName, strBirthTime, 'm5', 1.0)",
        "add_id": 1,
        "name": "calc_accumulate"
    },
    {
        "dis_cription": "output your log information",
        "api_type": "time function",
        "sample": "log_str('my test point is:%s'%(get_data('test'))",
        "add_id": 0,
        "name": "log_str"
    },
    {
        "dis_cription": "fix data at moment",
        "api_type": "time function",
        "sample": "patch_data_sharp_clock(4, None, '2016-10-09 11:05:00')",
        "add_id": 1,
        "name": "patch_data_sharp_clock"
    },
    {
        "dis_cription": "get order status",
        "api_type": "time function",
        "sample": "",
        "add_id": 0,
        "name": "get_work_order_status"
    },
    {
        "dis_cription": "send order",
        "api_type": "time function",
        "sample": "",
        "add_id": 0,
        "name": "send_work_order"
    },
    {
        "dis_cription": "get order ID",
        "api_type": "time function",
        "sample": "get_work_order_id('问题通知222222222', 'golding.gu@rnbtech.com.hk')",
        "add_id": 0,
        "name": "get_work_order_id"
    },
    {
        "dis_cription": "close order",
        "api_type": "time function",
        "sample": "close_work_order(10243)",
        "add_id": 0,
        "name": "close_work_order"
    },
    {
        "dis_cription": "get diagnosis fault latest status",
        "api_type": "time function",
        "sample": "get_fault_last_update_time_status()",
        "add_id": 0,
        "name": "get_fault_last_update_time_status"
    },
    {
        "dis_cription": "计算累积量在本月内的增量",
        "api_type": "time function",
        "sample": "calc_monthly_delta_of_accum('accumPointName')",
        "add_id": 0,
        "name": "calc_monthly_delta_of_accum"
    },
    {
        "dis_cription": "Post json数据至url",
        "api_type": "time function",
        "sample": " http_post_json(url, data,t=30)",
        "add_id": 0,
        "name": "http_post_json"
    },
    {
        "dis_cription": "从url获取json数据",
        "api_type": "time function",
        "sample": " http_get_json(url, timeout=10)",
        "add_id": 0,
        "name": "http_get_json"
    },
    {
        "dis_cription": "Post form数据至url",
        "api_type": "time function",
        "sample": "http_post_form(url, data,t=30)",
        "add_id": 0,
        "name": "http_post_form"
    },
    {
        "dis_cription": "Post带cookie的json数据至url",
        "api_type": "time function",
        "sample": "http_post_json_with_cookie(url, data,t=30)",
        "add_id": 0,
        "name": "http_post_json_with_cookie"
    },
    {
        "dis_cription": "从url获取json数据其中获取时发送cookie信息",
        "api_type": "time function",
        "sample": "http_get_with_cookie(url,timeout=10)",
        "add_id": 0,
        "name": "http_get_with_cookie"
    },
    {
        "dis_cription": "从url获取str数据",
        "api_type": "time function",
        "sample": "http_get_data_text(url,timeout=10)",
        "add_id": 0,
        "name": "http_get_data_text"
    },
    {
        "dis_cription": "post文件至url",
        "api_type": "time function",
        "sample": "http_post_data_files(url,files,timeout=10)",
        "add_id": 0,
        "name": "http_post_data_files"
    },
    {
        "dis_cription": "send order",
        "api_type": "time function",
        "sample": "",
        "add_id": 0,
        "name": "send_work_order"
    },
    {
        "dis_cription": "send order",
        "api_type": "time function",
        "sample": "send_work_order_smart(strWorkOrderName, fn, executeNameList, nDelayLimitMinutes, nSolveMinutes)",
        "add_id": 0,
        "name": "send_work_order_smart"
    },
    {
        "dis_cription": "计算本项目某个点本小时（相对于小时初）的增量",
        "api_type": "energy calculation",
        "sample": "calc_hourly_delta_of_accum('pointName')",
        "add_id": 0,
        "name": "calc_hourly_delta_of_accum"
    },
    {
        "dis_cription": "计算本项目某个点本日（相对于今日零点零分）的增量",
        "api_type": "energy calculation",
        "sample": "calc_daily_delta_of_accum('pointName')",
        "add_id": 0,
        "name": "calc_daily_delta_of_accum"
    },
    {
        "dis_cription": "计算本项目某个点本周（相对于本周一零点零分）的增量",
        "api_type": "energy calculation",
        "sample": "calc_weekly_delta_of_accum('pointName')",
        "add_id": 0,
        "name": "calc_weekly_delta_of_accum"
    },
    {
        "dis_cription": "计算本项目某个点本月（相对于本月一日零点零分）的增量",
        "api_type": "energy calculation",
        "sample": "calc_monthly_delta_of_accum('pointName')",
        "add_id": 0,
        "name": "calc_monthly_delta_of_accum"
    },
    {
        "dis_cription": "过滤突降的数据错点",
        "api_type": "data get",
        "sample": "filter_point_only_increase('pointName')",
        "add_id": 1,
        "name": "filter_point_only_increase"
    },
    {
        "dis_cription": "过滤不大于灵的数据错点",
        "api_type": "data get",
        "sample": "filter_point_gt_zero('pointName')",
        "add_id": 1,
        "name": "filter_point_gt_zero"
    }
]
     ),
    ('ah', {})
])
def test_apiTree(language, expected):
    rt = json.loads(do_getAPITreeList(language))
    if rt:
        assert len(rt) >= len(expected), 'actual result differs from expected result'
        nameList = []
        nameList_actual = []
        for item in expected:
            assert item in rt, 'expected api is %s,which does not match actual' % item
    else:
        if len(expected) == 0 and len(rt) == 0:
            return
        else:
            assert False, 'get api tree failed'




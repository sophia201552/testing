import sys
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from datetime import datetime
import logging


def run_wash_data(projId):
    # TODO 获取Redis中写入的信息, 并开始写数据
    try:
        data = ArchiveManager.get_wash_data(projId)
        obj = BEOPDataAccess.getInstance()
        points = data.get('points')
        methods = data.get('methods')
        filter_method = data.get('filter')
        pulse = data.get('pulse')
        pulse = float(pulse) if pulse else None
        # 初始化完成数以及endTime
        ArchiveManager.write_complete_num(projId, -1)
        obj.wash_data(projId, points, methods, filter_method, pulse)
        now = datetime.now()
        ArchiveManager.write_complete_num(projId, com=0, endTime=now)
    except Exception as err:
        logging.error("run_wash_data error: {}".format(str(err)))
        ArchiveManager.set_wash_status(projId, 3)


if __name__ == '__main__':
    if sys.argv[1]:
        run_wash_data(sys.argv[1])








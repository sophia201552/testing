import threading
import time 
import math
from time import ctime
import concurrent
from concurrent.futures import ThreadPoolExecutor, wait
# from concurrent.futures._base import wait
import logging
from flask_assets import Environment, Bundle
from beopWeb import app, bNeedPacking
from webassets.script import CommandLineEnvironment

THREAD_NUMBERS = 10
cmdenv = None
bundle_len = None
progress = 0
def loop(nloop, asec):
    global progress
    startTime = time.time()
    cmdenv.build([nloop])
    endtime = time.time()
    durationTime = round(endtime - startTime, 3)
    progress += 1
    print(
        'thread {0} finish one bundle at time {1}s, building progress: {2}%'.format(
            asec % THREAD_NUMBERS,
            durationTime,
            round(progress/bundle_len * 100)
        )
    )
def run(loops):
    print('starting at:', ctime())

    pool = ThreadPoolExecutor(max_workers=THREAD_NUMBERS)
    futures = []

    for i in range(bundle_len):   
       futures.append((pool.submit(loop, loops[i], i)))

    wait(futures)
    print('all done at:', ctime())

    
def build(assets):
    global cmdenv
    global bundle_len
    log = logging.getLogger('webassets')
    log.addHandler(logging.StreamHandler())
    log.setLevel(logging.DEBUG)
    cmdenv = CommandLineEnvironment(assets, log)

    # 获取 bundles 列表
    bundle_name_list = list(cmdenv.environment._named_bundles.keys())
    bundle_len = len(bundle_name_list)
    run(bundle_name_list)  
   

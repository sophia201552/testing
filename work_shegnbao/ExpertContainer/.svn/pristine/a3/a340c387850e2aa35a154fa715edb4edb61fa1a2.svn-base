#coding=utf-8
__author__ = 'angelia'

import pytest
from ExpertContainer.api.views import *

url = ['150175011421744293e0103e#response=2',
       '1470895703745442ba8f4d5f#response=9'
       ]

@pytest.mark.p2
@pytest.mark.parametrize(('projId', 'emailList', 'title', 'url'),[
    (293,['angelia.chen@rnbtech.com.hk'], 'Weekly Diagnosis Report_unittest', url[0]),
    (293,['angelia.chen@rnbtech.com.hk'], 'daily_priority_fault_unittest', url[1]),
])
def test_sendEmailReport(projId, emailList, title, url):
    rt = do_sendEmailReport(projId, emailList, title, url)
    if rt:
        assert rt,'send email report failed'
    else:
        assert False,'send email report failed'
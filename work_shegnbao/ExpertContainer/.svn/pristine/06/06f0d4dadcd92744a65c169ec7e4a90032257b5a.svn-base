# coding=utf-8
from ExpertContainer.api.views import *
import pytest
import json
import os
import shutil
projId=49
taskId = "5a1ca3dafa9a16594a704d2d"
folderName='ExportData'
fileName="fileDelete_49_test.txt"
@pytest.mark.p0
@pytest.mark.parametrize(('data','expected','flag'), [
    ({'projId':projId,'fileName':'["fileDelete_49_test.txt"]'},'ok',True),
    ({},"",False),
    ({'projId':projId,'fileName':"_49_"},"Expecting value: line 1 column 1 (char 0)",False),
    ({'projId':None,'fileName':None},"the JSON object must be str, not 'NoneType'",False),
])
def test_dataManage_exportData_file_delete(data,expected,flag):
    if flag:
        #creat folder and file
        os.makedirs(folderName)
        path=os.path.join(folderName, fileName)
        f=open(path,'w')
        f.close()
        rt = json.loads(do_delete_export_files(data))
        #remove folder and file
        if os.path.exists(folderName):
            shutil.rmtree(folderName)
        assert isinstance(rt,dict),'actual is not dict'
        assert rt.get('success')==True and rt.get('msg')==expected,'acutal is not True,acutal is {0}'.format(rt)
    else:
        rt = json.loads(do_delete_export_files(data))
        assert rt.get('success')==False and rt.get('msg')==expected,'acutal is not False,acutal is {0}'.format(rt)



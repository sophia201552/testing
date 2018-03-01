import unittest
from beopWeb.mod_workflow.TransactionAttachment import TransactionAttachment
from datetime import datetime

task = TransactionAttachment()

user_id = 1
test_task_id = "56f24cd86455142c10ebdcce"
uid = "666666666666666"
file_name = "test-file"


class UtilsCase(unittest.TestCase):
    def test(self):
        attachment = task.get_attachment_by_task_id(test_task_id)
        length = len(attachment)
        print("得到附件成功")

        task.add_upload_new_file(test_task_id, user_id, file_name, uid, datetime.now())
        length += 1

        print("添加附件成功")

        attachment = task.get_attachment_by_task_id(test_task_id)
        assert len(attachment) == length
        print("得到附件成功")

        assert task.is_user_hasOwn_file(user_id, test_task_id, file_name, uid)
        print("验证用户有这个附件成功")

        length -= 1
        assert len(task.delete_attachment(test_task_id, uid, file_name).get("attachment")) == length
        print("删除附件成功")

        assert len(task.is_user_hasOwn_file(user_id, test_task_id, file_name, uid)) == 0
        print("验证用户没有这个附件成功")

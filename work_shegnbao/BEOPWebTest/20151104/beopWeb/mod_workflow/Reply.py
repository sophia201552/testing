from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_common.Utils import Utils
from beopWeb import app
import os
import re
import base64
from datetime import datetime
from beopWeb.mod_oss.ossapi import OssAPI


class Reply(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'transaction_reply'

    def get_by_trans_id(self, trans_id):
        return self.query(('id', 'replyUserId', 'replyTime', 'detail', 'ofTransactionId'),
                          where=('ofTransactionId=%s', [trans_id]),
                          order=["replyTime DESC"])

    def get_by_trans_ids(self, trans_ids):
        return self.query(('id', 'replyUserId', 'replyTime', 'detail'),
                          where=('ofTransactionId in (%s)' % ','.join(map(lambda x: '%s', trans_ids)), trans_ids),
                          order=["replyTime DESC"])

    def get_by_trans_ids_after(self, trans_ids, date):
        if not trans_ids:
            return []
        param = list(trans_ids)
        param.append(date)
        return self.query(('id', 'ofTransactionId', 'replyUserId', 'replyTime', 'detail'),
                          where=('ofTransactionId in (%s) and replyTime>=%s' % (
                              ','.join(map(lambda x: '%s', trans_ids)), '%s'), param),
                          order=["replyTime DESC"])

    def get_reply_after(self, date):
        return self.query(('id', 'ofTransactionId', 'replyUserId', 'replyTime', 'detail', 'replyToId'),
                          where=('replyTime>%s', [date]),
                          order=["replyTime DESC"])

    def replace_base64_with_img(self, detail, trans_id):
        if not detail:
            return ''
        result = re.findall('src="data:[^,]+,([^\"]+)">', detail, re.S)
        convert_list = []
        user_reply_path = "beopWeb/static/images/reply_images/"
        if not os.path.exists(user_reply_path):
            os.mkdir(user_reply_path)
        convert_reply_path = "/static/images/reply_images/"

        def gen_image_name(img_index):
            return str(trans_id) + '_' + str(datetime.now().strftime('%Y.%m.%d_%H.%M.%S')) + '_' + str(
                img_index) + '.png'

        for index, item in enumerate(result):
            img_name = gen_image_name(index)
            with open(user_reply_path + img_name, 'wb') as file:
                file.write(base64.b64decode(item))  # upload to oss
            oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
            res = oss.put_object_from_file('beopweb', 'static/images/reply_images/' + img_name,
                                           "./beopWeb/static/images/reply_images/" + img_name)
            if res.status != 200:
                raise Exception('无法保存图片到服务器')
            convert_list.append(convert_reply_path + img_name)
        for j in convert_list:
            detail, number = re.subn('src="(data:.*?)">', 'src="' + Utils.IMG_SERVER_DOMAIN + j + '" />', detail, 1)
        return detail

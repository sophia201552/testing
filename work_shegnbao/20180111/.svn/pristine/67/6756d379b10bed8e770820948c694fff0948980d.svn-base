'''
上传文件
'''
__author__ = 'liqian'
import os
from werkzeug.utils import secure_filename
from beopWeb.mod_oss.ossapi import OssAPI
from beopWeb.mod_common.Utils import Utils
import logging


class Upload:
    @staticmethod
    def allowed_file(filename, allowed_extensions):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

    @staticmethod
    def upload_file(upload_file, folder, allowed_extensions, new_filename=None):
        '''
        上传到文件到服务器

        :param upload_file: 上传的文件
        :param folder: 上传到服务器的目录
        :param allowed_extensions: 许可的文件扩展名
        :param new_filename: 新文件名
        :return: 文件在服务器上的地址
        '''
        if upload_file and upload_file.filename.rsplit('.', 1)[1].lower() in allowed_extensions:
            saved_filename = upload_filename = upload_file.filename
            if new_filename:
                filename_list = upload_filename.split('.')
                saved_filename = new_filename + '.' + '.'.join(filename_list[1:])
            saved_filename = secure_filename(saved_filename)
            if folder[0] == '/':
                folder = folder[1:]
            file_path = os.path.join(os.getcwd(), folder, saved_filename)
            upload_file.save(file_path)
            return file_path
        else:
            return None

    @staticmethod
    def upload_file_to_oss(path, file_name, stream, bucket='beopweb'):
        '''
        上传文件到OSS

        :param path: OSS路径
        :param file_name: 文件名
        :param stream: 文件流
        :param bucket: OSS bucket
        :return: OSS上传响应
        '''
        if not path:
            raise Exception('upload file failed:path is none')
        if not path.endswith('/'):
            path += '/'
        if not file_name:
            raise Exception('upload file failed:file_name is none')
        file_name = file_name.replace('/', '')
        full_path = path + file_name
        try:
            oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
            return oss.put_object_from_fp(bucket, full_path, stream)
        except Exception as e:
            logging.debug('upload file failed' + str(e))
            raise Exception('upload file failed')

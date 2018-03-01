__author__ = 'liqian'
import os
from werkzeug.utils import secure_filename


class Upload:
    @staticmethod
    def allowed_file(filename, allowed_extensions):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

    @staticmethod
    def upload_file(upload_file, folder, allowed_extensions, new_filename=None):
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









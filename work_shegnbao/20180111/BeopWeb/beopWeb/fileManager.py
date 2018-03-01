from flask import jsonify
from flask import make_response
from flask import send_file
from beopWeb.BEOPDataAccess import *
from beopWeb.mod_oss.ossapi import OssAPI
import mimetypes
import zipfile

'''
table: fileManager
id	    编号	int
projId	项目id	int
name	文件名/文件夹名	varchar(20)
size	文件大小，单位b，文件夹没有该属性	int
path	路径，文件夹没有该属性	varchar(20)
parent	所属文件夹id	int
userId	上传人id	int
time	上传时间	datetime
type	文件扩展名，文件夹没有该属性	varchar(10)
'''


class FileEnum(object):
    # File type
    PHOTO = ['jpg', 'png', 'bmp']
    DOCUMENT = ['doc', 'docx', 'pdf']
    TABLE = ['xls', 'xlsx', 'csv']
    DRAWING = ['dwg']
    TYPE = {
        0: '',
        1: PHOTO,
        2: DOCUMENT,
        3: TABLE,
        4: DRAWING,
        5: PHOTO + DOCUMENT + TABLE + DRAWING
    }
    # MysqlDB table name
    TABLE = "filemanager"
    # MysqlDB name
    DBNAME = app.config.get('DATABASE', 'beopdoengine')
    URL = "https://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/uploadFileManager"


def uploadFile(projId, id, fileFullPath):
    '''
    yan add
    :param projId:项目的id号
    :param id:mysql中fileManager表中对应的id号
    :param fileFullPath:是用户上传文件的全路径
    :return:成功返回文件的大小，失败返回0
    '''
    rt = 0
    ossPath = None
    try:
        if os.path.exists(fileFullPath):
            oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
            fileFullPath = os.path.normpath(fileFullPath)
            fileName = os.path.basename(fileFullPath)
            fileNameWithoutSuffix = fileName[0:fileName.rfind('.')] if fileName.rfind('.') > 0 else fileName
            fileName = fileName.replace(fileNameWithoutSuffix, str(id))
            ossPath = "custom/uploadFileManager/%s/%s"%(projId, fileName)
            res, size = oss.put_object_from_file_with_size('beopweb', ossPath, fileFullPath)
            if res and res.status == 200:
                rt = size
    except Exception as e:
        print(e)
    return rt, ossPath


def deleteFile(projId, id, Suffix):
    '''
    yan add
    :param projId:项目的id
    :param id: mysql中fileManager对应的id
    :param Suffix: 文件的后缀
    :return: true or false
    '''
    rt = False
    try:
        oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
        fileName = str(id)+'.'+Suffix
        res = oss.delete_object('beopweb', 'custom/uploadFileManager/%s/%s'%(projId, fileName))
        if res.status == 204:
            rt = True
    except Exception as e:
        print(e)
    return rt

# 获取文件列表，带过滤功能
# postData = {
#     "keyword": '', # 搜索关键字 name字段，
#     "type": 0,    # 0：全部，1:图片jpg，png，bmp， 2:文档doc，docx，pdf 3:表格xls，xlsx，csv 4:图纸dwg
#     "id": '',      # 为空则显示根目录，有值显示parent字段为此的数据
#     "projectId": ''
# }
# return_ = {
#     "data": [{
#         "id": 0,
#         "name": "111",
#         "size": 10000,
#         "path": "/download/file",
#         "userId": 12,
#         "user": "222",    #用户名
#         "time": "2017-07-01 19:00:00",
#         "type": "jpg",
#     }]
# }


@app.route('/fileManager/filter', methods=['POST'])
def fileManagerFilter():
    rt = []
    try:
        data = request.get_json()
        keyword = data.get('keyword')
        _type = int(data.get('type'))
        _id = int(data.get('id', 0))
        projectId = data.get('projectId')
        sql = " and parent={}".format(_id)
        # if keyword is "", judge it by it's length.
        if len(keyword):
            sql += " and  upper(name) like '%{}%' ".format(keyword.upper())
        if FileEnum.TYPE[_type]:
            # get data where it's type is in (1, 2, 3, 4)
            if _type != 5:
                sql += " and type in ({})".format(", ".join(list(map(lambda x: repr(x), FileEnum.TYPE[_type]))))
            else:
                sql += " and type not in ({}) and type is not null".format(", ".join(list(map(lambda x: repr(x), FileEnum.TYPE[_type]))))
        SQL = "select id, name, size, path, parent, userId, time, type from {} " \
              "where projId={}".format(FileEnum.TABLE, projectId)
        SQL += sql
        rv = BEOPMySqlDBContainer().op_db_query(FileEnum.DBNAME, SQL)
        for item in rv:
            if item[7] is not None:
                fileName = item[1] if item[1].endswith(item[7]) else "{}.{}".format(item[1], item[7])
            else:
                fileName = item[1]
            rt.append(
                {
                    'id': item[0],
                    'name': fileName,
                    'size': item[2],
                    'path': item[3],
                    'userId': item[5],
                    'parent': item[4],
                    'user': BEOPDataAccess.getInstance().getUserNameById(item[5]),
                    'time': item[6].strftime("%Y-%m-%d %H:%M:%S") if isinstance(item[6], datetime) else item[6],
                    'type': item[7]
                }
            )
        # sorted data followed file type, if type is null, let it be 'aaaaaaa' in order to be the front of total data.
        rt = sorted(rt, key=lambda x: x['type'] if x['type'] else 'aaaaaaaa')
        '''
            rt = {
                "data": [{
                    "id": 0,
                    "name": "111",
                    "size": 10000,
                    "path": "/download/file",
                    "userId": 12,
                    "user": "222",    #用户名
                    "time": "2017-07-01 19:00:00",
                    "type": "jpg",
                }]
            }
        '''
    except Exception as e:
        print('fileManagerFilter error:' + e.__str__())
        logging.exception(e)
    return jsonify(data = rt)


# 获取当前项目容量使用情况
# return_ = {
#     'all': 1000000,     #总容量，单位b
#     'available': 9000   #可用容量， 总容量 - 该项目下所有文件的size字段之和
# }
@app.route('/fileManager/info/<projectId>')
def fileManagerGetInfo(projectId):
    rt = None
    total = 1024 **2 * 500
    try:
        sql = "select sum(size) from {} where projId={}".format(FileEnum.TABLE, int(projectId))
        rv = BEOPMySqlDBContainer().op_db_query(FileEnum.DBNAME, sql)
        if rv and rv[0][0]:    # if db is not found, rv will be an empty list, so judge rv first.
            used = int(rv[0][0])
        else:
            used = 0
        rt = {
            'all': total,
            'available': total - used
        }
    except Exception as e:
        print('fileManagergetInfo error:' + e.__str__())
        logging.exception(e)
    return jsonify(data = rt)


# 创建文件夹
# postData = {
#     "name": "111",
#     "userId": 12,
#     "user": "222",    #用户名
#     "time": "2017-07-01 19:00:00",
#     "parent": 11,
#     "projectId": 2
# }
# rt = {
#     'id': 1011 #文件夹id，失败返回False
# }
@app.route('/fileManager/createFolder', methods=['POST'])
def fileManagerCreateFolder():
    rt = None
    try:
        data = request.get_json()
        name = data.get('name')
        userId = data.get('userId')
        t = data.get('time')
        dtTime = t.strftime("%Y-%m-%d %H:%M:%S") if isinstance(t, datetime) else t
        # if data can't get parent, put it into the root directory.
        parent = int(data.get('parent', 0))
        projectId = data.get('projectId')
        insert_sql = "insert into {} (name, userId, projId, time, parent) values('{}', {}, {}, '{}', " \
              "{})".format(FileEnum.TABLE, name, userId, projectId, dtTime, parent)
        _id = BEOPMySqlDBContainer().op_db_update_with_id(FileEnum.DBNAME, insert_sql)
        rt = {'id': None}
        if _id:
            _id = int(_id)
            rt.update({'id': _id})
    except Exception as e:
        print('fileManagerCreateFolder error:' + e.__str__())
        logging.exception(e)
    return jsonify(data = rt)


# 上传文件
# return_ = {
#     "id": 111  #新建文件的id，失败返回False
# }
@app.route('/fileManager/uploadFile/<projectId>/<userId>/<fileName>/<parent>', methods=['POST'])
def fileManagerUploadFile(projectId, userId, fileName, parent):
    rt = None
    try:
        file = request.files.get('file')
        if file:
            local_path = os.getcwd() + os.sep + 'temp' + os.sep + projectId
            if not os.path.exists(local_path):
                os.mkdir(local_path)
            local_path += os.sep + userId
            if not os.path.exists(local_path):
                os.mkdir(local_path)
            local_path += os.sep + fileName
            file.save(local_path)
            _type = "null"
            if '.' in fileName:
                # 为带扩展名的文件名
                index = fileName.rfind(".")
                file_name = fileName if index < 0 else fileName[0:index]
                _type = fileName[index+1:]
            parent = int(parent)
            insert_sql = "insert into {} (name, userId, projId, time, parent, type) values('{}', {}, {}, now(), " \
                  "{}, '{}')".format(FileEnum.TABLE, file_name, int(userId), int(projectId), parent, _type)
            _id = BEOPMySqlDBContainer().op_db_update_with_id(FileEnum.DBNAME, insert_sql)
            rt = {'id': None}
            if _id != -1:
                _id = int(_id)
                rt.update({'id': _id})
                size, ossPath = uploadFile(int(projectId), _id, local_path)
                try:
                    os.remove(local_path)
                except:
                    pass
                if ossPath and size > 0:
                    query = "update {} set path='{}', size='{}' where id={}".format(FileEnum.TABLE, ossPath, int(size), _id)
                    status = BEOPMySqlDBContainer().op_db_update(FileEnum.DBNAME, query)
                    if not status:
                        rt.update({'id': None})
                else:
                    rt.update({'id': None})
    except Exception as e:
        print('fileManagerUploadFile error:' + e.__str__())
        logging.exception(e)
    return jsonify(data = rt)


# 删除文件
# postData = {
#     'arrId': [1,2,55]
# }
# rt = True
@app.route('/fileManager/removeFiles', methods=['POST'])
def fileManagerRemoveFiles():
    rt = False
    try:
        data = request.get_json()
        if data:
            arrId = data.get('arrId')
            dbrv_total = []
            if arrId:
                count = 0
                while True:
                    sql = "select id, projId, name, type from fileManager where id in %s or parent " \
                          "in %s"%(str(arrId).replace('[','(').replace(']',')'), str(arrId).replace('[','(').replace(']',')'))
                    # 第一遍循环找到arrId的文件以及以其为父类的文件
                    dbrv = BEOPDataAccess._mysqlDBContainerReadOnly.op_db_query(FileEnum.DBNAME, sql, ())
                    if len(dbrv) != len(dbrv_total):
                        if not dbrv_total:
                            # 第一次直接extend
                            dbrv_total.extend(dbrv)
                        else:
                            # 不是第一次开始比较是否有新增，有新增说明还有son
                            for item in dbrv:
                                # 排除重复元素
                                if item not in dbrv_total:
                                    dbrv_total.append(item)
                        # 将这些父文件子文件全部拿出来
                        arrId.extend([x[0] for x in dbrv])
                    else:
                        # 说明以及没有子文件了
                        break
                if dbrv_total is not None:
                    for item in dbrv_total:
                        if item[3] is not None:
                            if deleteFile(item[1], item[0], item[3]):
                                count += 1
                arrId = list(set(arrId))
                sql = "delete from fileManager where id in %s"%(str(arrId).replace('[','(').replace(']',')'),)
                res = BEOPDataAccess._mysqlDBContainer.op_db_update(FileEnum.DBNAME, sql, ())
                if res:
                    rt = True
    except Exception as e:
        print('fileManagerRemoveFile error:' + e.__str__())
        logging.exception(e)
    return jsonify(data = rt)

# 重命名文件
# postData = {
#     'id': 1,    # 被重命名文件ID
#     'name': 'xxxx' # 新文件名
# }
# return_ = {
#     "id": 111  #新建文件的id，失败返回False
# }
@app.route('/fileManager/renameFile', methods=['POST'])
def fileManagerRenameFile():
    rt = False
    try:
        data = request.get_json()
        if data:
            id = data.get('id')
            name = data.get('name')
            if id is not None and name:
                sql = "update fileManager set name = %s where id = %s"
                rt = BEOPDataAccess._mysqlDBContainer.op_db_update(FileEnum.DBNAME, sql, (name, int(id)))
    except Exception as e:
        print('fileManagerRenameFile error:' + e.__str__())
        logging.exception(e)
    return jsonify(data = rt)


# 移动文件
# postData = {
#     'id': 1,    # 被移动文件ID
#     'parent': 12 # 移动的到的目标文件夹id
# }
# return_ = {
#     "id": 111  #新建文件的id，失败返回False
# }
@app.route('/fileManager/moveFile', methods=['POST'])
def fileManagerMoveFile():
    rt = None
    try:
        data = request.get_json()
        if data:
            idList = data.get('id')
            parent = data.get('parent')
            if idList and parent:
                sql = "update fileManager set parent = %s where id " \
                      "in ({idList})".format(idList=",".join(list(map(lambda x: str(x), idList))))
                rt = BEOPDataAccess._mysqlDBContainer.op_db_update(FileEnum.DBNAME, sql, (int(parent),))
                # rt = {
                #     "id": 111  #新建文件的id，失败返回False
                # }
    except Exception as e:
        print('fileManagerMoveFile error:' + e.__str__())
        logging.exception(e)
        rt = str(e)
    return jsonify(data = rt)



'''
{"data": [{"name": filename, 'path': filepath}]}
'''
@app.route('/fileManager/download/<projId>/<id>/')
def download_file(projId, id):
    try:
        sql = 'select name, type from filemanager where id=%d' % int(id)
        rv = BEOPMySqlDBContainer().op_db_query(FileEnum.DBNAME, sql)
        name, _type = rv[0][0], rv[0][1]
        filename = "{}.{}".format(name, _type)
        url = "https://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/uploadFileManager/{}/{}.{}".format(projId, id, _type)
        r = requests.get(url, timeout=3000)
        if r.status_code != 200:
            raise Exception("Cannot connect with oss server or file is not exists")
        response = make_response(r.content)
        mime_type = mimetypes.guess_type(filename)[0]
        response.headers['Content-Type'] = mime_type
        response.headers['Content-Disposition'] = 'attachment; filename={}'.format(filename)
        return response
    except Exception as err:
        print('download_file error: {}'.format(str(err)))
        logging.exception(err)
        return Utils.beop_response_error(msg='Download oss files failed!')


'''{
    "projId": int,  # 项目id
    "idList": [],   # 文件id列表
    "nameList": [], # 文件名列表
    "typeList": []      # 文件的类型
}
'''
@app.route('/fileManager/downloadFiles/', methods=['POST'])
def download_zip():
    name_list = []
    try:
        file_data = request.get_json()
        name_list = file_data.get('nameList')
        idList = file_data.get('idList')
        type_list = file_data.get('typeList')
        projId = file_data.get('projId')
        if name_list and idList and type_list and projId is not None:
            # 开始下载
            for _id, _type, name in zip(idList, type_list, name_list):
                url = FileEnum.URL + "/{}/{}.{}".format(projId, _id, _type)
                r = requests.get(url, timeout=3000)
                if r.status_code == 200:
                    with open(name, 'wb') as file:
                        file.write(r.content)
                else:
                    raise Exception("file not exists")
            with zipfile.ZipFile('{}.zip'.format(projId), 'w', zipfile.zlib.DEFLATED) as f:
                for file in name_list:
                    f.write(file)
            return send_file(os.path.join(os.getcwd(), "{}.zip").format(projId))
    except Exception as err:
        print('download_zip error: {}'.format(str(err)))
        logging.exception(err)
        return Utils.beop_response_error(msg='Download multiple files failed!')
    finally:
        for file in name_list:
            try:
                os.remove(file)
            except:
                pass


@app.route('/fileManager/clean/<int:projId>', methods=['GET'])
def clear_zip(projId):
    rt = {'error': 1, 'msg': ""}
    try:
        os.remove("{}.zip".format(projId))
        rt.update(dict(error=0))
    except Exception as err:
        print('clear_zip failed: {}'.format(str(err)))
        logging.exception(err)
        # return Utils.beop_response_error(msg='Download multiple files failed!')
    return json.dumps(rt)
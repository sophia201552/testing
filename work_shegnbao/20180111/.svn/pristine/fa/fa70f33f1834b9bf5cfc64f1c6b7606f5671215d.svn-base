__author__ = 'David'

import http.client
import platform
from beopWeb.mod_oss.oss import *
import io
import time, sys, os

class OssAPI:
    '''
    A simple OSS API
    '''
    DefaultContentType = 'application/octet-stream'
    provider = PROVIDER
    __version__ = '0.4.0'
    Version = __version__
    AGENT = '%s/%s/%s;%s' % (platform.system(), platform.release(), platform.machine(), platform.python_version())

    def __init__(self, host='oss.aliyuncs.com', access_id='', secret_access_key='', port=80, is_security=False, sts_token=None):
        self.SendBufferSize = 8192
        self.RecvBufferSize = 1024*1024*10
        self.host = get_host_from_list(host)
        self.port = port
        self.access_id = access_id
        self.secret_access_key = secret_access_key
        self.show_bar = False
        self.is_security = is_security
        self.retry_times = 5
        self.agent = self.AGENT
        self.debug = False
        self.timeout = 60
        self.is_oss_domain = False
        self.sts_token = sts_token

    def get_connection(self, tmp_host=None):
        host = ''
        port = 80
        if not tmp_host:
            tmp_host = self.host
        host_port_list = tmp_host.split(":")
        if len(host_port_list) == 1:
            host = host_port_list[0].strip()
        elif len(host_port_list) == 2:
            host = host_port_list[0].strip()
            port = int(host_port_list[1].strip())
        if self.is_security or port == 443:
            self.is_security = True
            if sys.version_info >= (2, 6):
                return http.client.HTTPSConnection(host=host, port=port, timeout=self.timeout)
            else:
                return http.client.HTTPSConnection(host=host, port=port)
        else:
            if sys.version_info >= (2, 6):
                return http.client.HTTPConnection(host=host, port=port, timeout=self.timeout)
            else:
                return http.client.HTTPConnection(host=host, port=port)

    def http_request(self, method, bucket, object, headers=None, body='', params=None):
        retry = 5
        res = None
        while retry > 0:
            retry -= 1
            tmp_bucket = bucket
            tmp_object = object
            tmp_headers = {}
            if headers and isinstance(headers, dict):
                tmp_headers = headers.copy()
            tmp_params = {}
            if params and isinstance(params, dict):
                tmp_params = params.copy()

            res = self.http_request_with_redirect(method, tmp_bucket, tmp_object, tmp_headers, body, tmp_params)
            if check_redirect(res):
                self.host = helper_get_host_from_resp(res, bucket)
            else:
                return res
        return res

    def http_request_with_redirect(self, method, bucket, object, headers=None, body='', params=None):
        if not params:
            params = {}
        if not headers:
            headers = {}
        if self.sts_token:
            headers['x-oss-security-token'] = self.sts_token
        if not bucket:
            resource = "/"
            headers['Host'] = self.host
        else:
            headers['Host'] = "%s.%s" % (bucket, self.host)
            if not is_oss_host(self.host, self.is_oss_domain):
                headers['Host'] = self.host
            resource = "/%s/" % bucket
        resource = "%s%s%s" % (resource, object, get_resource(params))
        object = oss_quote(object)
        url = "/%s" % object
        if is_ip(self.host):
            url = "/%s/%s" % (bucket, object)
            if not bucket:
                url = "/%s" % object
            headers['Host'] = self.host
        url = append_param(url, params)
        date = time.strftime("%a, %d %b %Y %H:%M:%S GMT", time.gmtime())
        headers['Date'] = date
        headers['Authorization'] = self._create_sign_for_normal_auth(method, headers, resource)
        headers['User-Agent'] = self.agent
        if check_bucket_valid(bucket) and not is_ip(self.host):
            conn = self.get_connection(headers['Host'])
        else:
            conn = self.get_connection()
        conn.request(method, url, body, headers)
        return conn.getresponse()

    def _create_sign_for_normal_auth(self, method, headers=None, resource="/"):
        auth_value = "%s %s:%s" % (self.provider, self.access_id, get_assign(self.secret_access_key, method, headers, resource, None, self.debug))
        return auth_value

    def create_bucket(self, bucket, acl='', headers=None):
        if not headers:
            headers = {}
        if acl != '':
            if "AWS" == self.provider:
                headers['x-amz-acl'] = acl
            else:
                headers['x-oss-acl'] = acl
        method = 'PUT'
        object = ''
        body = ''
        params = {}
        return self.http_request(method, bucket, object, headers, body, params)

    def copy_object(self, bucket, source, headers=None):
        if not headers:
            headers = {}
        headers['x-oss-copy-source'] = '/beopweb/' + source
        method = 'PUT /custom/uploadFileManager/73/1.txt HTTP/1.1'
        object = ''
        body = ''
        params = {}
        return self.http_request(method, bucket, object, headers, body, params)

    def delete_bucket(self, bucket, headers=None):
        method = 'DELETE'
        object = ''
        body = ''
        params = {}
        return self.http_request(method, bucket, object, headers, body, params)

    def list_all_my_buckets(self, headers=None, prefix='', marker='', maxKeys=''):
        method = 'GET'
        bucket = ''
        object = ''
        body = ''
        params = {}
        if prefix != '':
            params['prefix'] = prefix
        if marker != '':
            params['marker'] = marker
        if maxKeys != '':
            params['max-keys'] = maxKeys
        return self.http_request(method, bucket, object, headers, body, params)

    def get_service(self, headers=None, prefix='', marker='', maxKeys=''):
        return self.list_all_my_buckets(headers, prefix, marker, maxKeys)

    def put_object_from_file(self, bucket, object, filename, content_type='', headers=None, params=None):
        fp = open(filename, 'rb')
        if not content_type:
            content_type = get_content_type_by_filename(filename)
        res = self.put_object_from_fp(bucket, object, fp, content_type, headers, params)
        fp.close()
        return res

    def put_object_from_file_with_size(self, bucket, object, filename, content_type='', headers=None, params=None):
        size = 0
        fp = None
        res = None
        try:
            fp = open(filename, 'rb')
            if not content_type:
                content_type = get_content_type_by_filename(filename)

            res = self.put_object_from_fp(bucket, object, fp, content_type, headers, params)
            fp.seek(0, os.SEEK_END)
            size = fp.tell()
        except Exception as e:
            print(e)
        finally:
            if fp:
                fp.close()
        return res, size

    def put_object_from_fp(self, bucket, object, fp, content_type=DefaultContentType, headers=None, params=None):
        method = 'PUT'
        return self._put_or_post_object_from_fp(method, bucket, object, fp, content_type, headers, params)

    def _put_or_post_object_from_fp(self, method, bucket, object, fp, content_type=DefaultContentType, headers=None, params=None):
        tmp_object = object
        tmp_headers = {}
        tmp_params = {}
        if headers and isinstance(headers, dict):
            tmp_headers = headers.copy()
        if params and isinstance(params, dict):
            tmp_params = params.copy()
        fp.seek(os.SEEK_SET, os.SEEK_END)
        filesize = fp.tell()
        fp.seek(os.SEEK_SET)
        conn = self._open_conn_to_put_object(method, bucket, object, filesize, content_type, headers, params)
        totallen = 0
        l = fp.read(self.SendBufferSize)
        retry_times = 0
        while len(l) > 0:
            if retry_times > 100:
                print("reach max retry times: %s" % retry_times)
            if isinstance(l, str):
                l = l.encode()
            try:
                conn.send(l)
                retry_times = 0
            except:
                retry_times += 1
                continue
            totallen += len(l)
            if self.show_bar:
                self.view_bar(totallen, filesize)
            l = fp.read(self.SendBufferSize)
        res = conn.getresponse()
        if check_redirect(res):
            self.host = helper_get_host_from_resp(res, bucket)
            return self.put_object_from_fp(bucket, tmp_object, fp, content_type, tmp_headers, tmp_params)
        return res

    def _open_conn_to_put_object(self, method, bucket, object, filesize, content_type=DefaultContentType, headers=None, params=None):
        if not params:
            params = {}
        if not headers:
            headers = {}
        if self.sts_token:
            headers['x-oss-security-token'] = self.sts_token
        resource = "/%s/" % bucket
        if not bucket:
            resource = "/"
        resource = "%s%s%s" % (resource, object, get_resource(params))

        object = oss_quote(object)
        url = "/%s" % object
        if bucket:
            headers['Host'] = "%s.%s" % (bucket, self.host)
            if not is_oss_host(self.host, self.is_oss_domain):
                headers['Host'] = self.host
        else:
            headers['Host'] = self.host
        if is_ip(self.host):
            url = "/%s/%s" % (bucket, object)
            headers['Host'] = self.host
        url = append_param(url, params)
        date = time.strftime("%a, %d %b %Y %H:%M:%S GMT", time.gmtime())

        if check_bucket_valid(bucket) and not is_ip(self.host):
            conn = self.get_connection(headers['Host'])
        else:
            conn = self.get_connection()
        conn.putrequest(method, url)
        if 'Content-Type' not in headers and 'content-type' not in headers:
            headers['Content-Type'] = content_type
        headers["Content-Length"] = filesize
        headers["Date"] = date
        headers["Expect"] = "100-Continue"
        headers['User-Agent'] = self.agent
        for k in headers.keys():
            conn.putheader(str(k), str(headers[k]))
        if '' != self.secret_access_key and '' != self.access_id:
            auth = self._create_sign_for_normal_auth(method, headers, resource)
            conn.putheader("Authorization", auth)
        conn.endheaders()
        return conn

    def view_bar(self, num=1, sum=100):
        if sum != 0:
            rate = float(num) / float(sum)
            rate_num = int(rate * 100)
            print('\r%d%% ' % (rate_num),sys.stdout.flush())

    def put_object_from_string(self, bucket, object, input_content, content_type='', headers=None, params=None):
        method = "PUT"
        return self._put_or_post_object_from_string(method, bucket, object, input_content, content_type, headers, params)

    def _put_or_post_object_from_string(self, method, bucket, object, input_content, content_type, headers, params):
        if not headers:
            headers = {}
        if not content_type:
            content_type = get_content_type_by_filename(object)
        if 'Content-Type' not in headers and 'content-type' not in headers:
            headers['Content-Type'] = content_type
        headers['Content-Length'] = str(len(input_content))
        fp = io.StringIO(input_content)
        if "POST" == method:
            res = self.post_object_from_fp(bucket, object, fp, content_type, headers, params)
        else:
            res = self.put_object_from_fp(bucket, object, fp, content_type, headers, params)
        fp.close()
        return res

    def post_object_from_fp(self, bucket, object, fp, content_type=DefaultContentType, headers=None, params=None):
        method = 'POST'
        return self._put_or_post_object_from_fp(method, bucket, object, fp, content_type, headers, params)

    def get_bucket(self, bucket, prefix='', marker='', delimiter='', maxkeys='', headers=None):
        return self.list_bucket(bucket, prefix, marker, delimiter, maxkeys, headers)

    def list_bucket(self, bucket, prefix='', marker='', delimiter='', maxkeys='', headers=None):
        method = 'GET'
        object = ''
        body = ''
        params = {}
        params['prefix'] = prefix
        params['marker'] = marker
        params['delimiter'] = delimiter
        params['max-keys'] = maxkeys
        return self.http_request(method, bucket, object, headers, body, params)

    def delete_object(self, bucket, object, headers=None):
        method = 'DELETE'
        body = ''
        params = {}
        return self.http_request(method, bucket, object, headers, body, params)

    def get_object_to_file(self, bucket, object, filename, headers=None):
        res = self.get_object(bucket, object, headers)
        totalread = 0
        if res.status / 100 == 2:
            header = {}
            header = convert_header2map(res.getheaders())
            filesize = safe_get_element("content-length", header)
            f = open(filename, 'wb')
            data = ''
            while True:
                data = res.read(self.RecvBufferSize)
                if data:
                    f.write(data)
                    totalread += len(data)
                    if self.show_bar:
                        self.view_bar(totalread, filesize)
                else:
                    break
            f.close()
        return res

    def get_object(self, bucket, object, headers=None, params=None):
        method = 'GET'
        body = ''
        return self.http_request(method, bucket, object, headers, body, params)

    def init_multi_upload(self, bucket, object, headers=None, params=None):
        '''
        Init multi upload
        '''
        if not params:
            params = {}
        if not headers:
            headers = {}
        method = 'POST'
        body = ''
        params['uploads'] = ''
        if isinstance(headers, dict) and 'Content-Type' not in headers:
            content_type = get_content_type_by_filename(object)
            headers['Content-Type'] = content_type
        return self.http_request(method, bucket, object, headers, body, params)

    def get_all_parts(self, bucket, object, upload_id, max_parts=None, part_number_marker=None, headers=None):
        '''
        List all upload parts of given upload_id
        '''
        method = 'GET'
        if not headers:
            headers = {}
        body = ''
        params = {}
        params['uploadId'] = upload_id
        if max_parts:
            params['max-parts'] = max_parts
        if part_number_marker:
            params['part-number-marker'] = part_number_marker
        return self.http_request(method, bucket, object, headers, body, params)

    def get_all_multipart_uploads(self, bucket, delimiter=None, max_uploads=None, key_marker=None, prefix=None, upload_id_marker=None, headers=None):
        '''
        List all upload_ids and their parts
        '''
        method = 'GET'
        object = ''
        body = ''
        params = {}
        params['uploads'] = ''
        if delimiter:
            params['delimiter'] = delimiter
        if max_uploads:
            params['max-uploads'] = max_uploads
        if key_marker:
            params['key-marker'] = key_marker
        if prefix:
            params['prefix'] = prefix
        if upload_id_marker:
            params['upload-id-marker'] = upload_id_marker
        return self.http_request(method, bucket, object, headers, body, params)


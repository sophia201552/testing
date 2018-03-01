__author__ = 'David'

import hmac
import base64
import socket
import urllib.parse
import os
import io
import sys
import time
from hashlib import sha1 as sha
from xml.dom import minidom
from xml.sax.saxutils import unescape

OSS_HOST_LIST = ["aliyun-inc.com", "aliyuncs.com", "alibaba.net", "s3.amazonaws.com"]
SELF_DEFINE_HEADER_PREFIX = "x-oss-"
PROVIDER = "OSS"
DEBUG = False
BUFFER_SIZE = 10 * 1024 * 1024
XML_UNESCAPE_TABLE = {
    "&#26;": ''
}


def check_redirect(res):
    is_redirect = False
    try:
        if res.status == 301 or res.status == 302:
            is_redirect = True
    except:
        pass
    return is_redirect


def get_host_from_list(hosts):
    tmp_list = hosts.split(",")
    if len(tmp_list) <= 1:
        return hosts
    for tmp_host in tmp_list:
        tmp_host = tmp_host.strip()
        host = tmp_host
        port = 80
        try:
            host_port_list = tmp_host.split(":")
            if len(host_port_list) == 1:
                host = host_port_list[0].strip()
            elif len(host_port_list) == 2:
                host = host_port_list[0].strip()
                port = int(host_port_list[1].strip())
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.connect((host, port))
            return host
        except:
            pass
    return tmp_list[0].strip()


def helper_get_host_from_resp(res, bucket):
    host = helper_get_host_from_headers(res.getheaders(), bucket)
    if not host:
        xml = res.read()
        host = RedirectXml(xml).Endpoint().strip()
        host = helper_get_host_from_endpoint(host, bucket)
    return host


def helper_get_host_from_headers(headers, bucket):
    mp = convert_header2map(headers)
    location = safe_get_element('location', mp).strip()
    # https://bucket.oss.aliyuncs.com or http://oss.aliyuncs.com/bucket
    location = location.replace("https://", "").replace("http://", "")
    if location.startswith("%s." % bucket):
        location = location[len(bucket) + 1:]
    index = location.find('/')
    if index == -1:
        return location
    return location[:index]


def helper_get_host_from_endpoint(host, bucket):
    index = host.find('/')
    if index != -1:
        host = host[:index]
    index = host.find('\\')
    if index != -1:
        host = host[:index]
    index = host.find(bucket)
    if index == 0:
        host = host[len(bucket) + 1:]
    return host


def convert_header2map(header_list):
    header_map = {}
    for (a, b) in header_list:
        header_map[a] = b
    return header_map


def safe_get_element(name, container):
    for k, v in container.items():
        if k.strip().lower() == name.strip().lower():
            return v
    return ""


def is_oss_host(host, is_oss_host=False):
    if is_oss_host:
        return True
    for i in OSS_HOST_LIST:
        if host.find(i) != -1:
            return True
    return False


def get_resource(params=None):
    if not params:
        return ""
    tmp_headers = {}
    for k, v in params.items():
        tmp_k = k.lower().strip()
        tmp_headers[tmp_k] = v
    override_response_list = ['response-content-type', 'response-content-language',
                              'response-cache-control', 'logging', 'response-content-encoding',
                              'acl', 'uploadId', 'uploads', 'partNumber', 'group', 'link',
                              'delete', 'website', 'location', 'objectInfo',
                              'response-expires', 'response-content-disposition', 'cors', 'lifecycle',
                              'restore', 'qos', 'referer']
    override_response_list.sort()
    resource = ""
    separator = "?"
    for i in override_response_list:
        if i.lower in tmp_headers:
            resource += separator
            resource += i
            tmp_key = str(tmp_headers[i.lower()])
            if len(tmp_key) != 0:
                resource += "="
                resource += tmp_key
            separator = '&'
    return resource


def oss_quote(in_str):
    if not isinstance(in_str, str):
        in_str = str(in_str)
    return urllib.parse.quote(in_str, '')


def is_ip(s):
    try:
        tmp_list = s.split(':')
        s = tmp_list[0]
        if s == 'localhost':
            return True
        tmp_list = s.split('.')
        if len(tmp_list) != 4:
            return False
        else:
            for i in tmp_list:
                if int(i) < 0 or int(i) > 255:
                    return False
    except:
        return False
    return True


def append_param(url, params):
    l = []
    for k, v in params.items():
        k = k.replace('_', '-')
        if k == 'maxkeys':
            k = 'max-keys'
        if v is not None and v != '':
            l.append('%s=%s' % (oss_quote(k), oss_quote(v)))
        elif k == 'acl':
            l.append('%s' % (oss_quote(k)))
        elif v is None or v == '':
            l.append('%s' % (oss_quote(k)))
    if len(l):
        url = url + '?' + '&'.join(l)
    return url


def check_bucket_valid(bucket):
    alphabeta = "abcdefghijklmnopqrstuvwxyz0123456789-"
    if len(bucket) < 3 or len(bucket) > 63:
        return False
    if bucket[-1] == "-" or bucket[-1] == "_":
        return False
    if not ((bucket[0] >= 'a' and bucket[0] <= 'z') or (bucket[0] >= '0' and bucket[0] <= '9')):
        return False
    for i in bucket:
        if not i in alphabeta:
            return False
    return True


def get_assign(secret_access_key, method, headers=None, resource="/", result=None, debug=DEBUG):
    if not headers:
        headers = {}
    if not result:
        result = []
    content_md5 = ""
    content_type = ""
    date = ""
    canonicalized_oss_headers = ""
    content_md5 = safe_get_element('Content-MD5', headers)
    content_type = safe_get_element('Content-Type', headers)
    date = safe_get_element('Date', headers)
    canonicalized_resource = resource
    tmp_headers = _format_header(headers)
    if len(tmp_headers) > 0:
        x_header_list = list(tmp_headers.keys())
        x_header_list.sort()
        for k in x_header_list:
            if k.startswith(SELF_DEFINE_HEADER_PREFIX):
                canonicalized_oss_headers += "%s:%s\n" % (k, tmp_headers[k])
    string_to_sign = method + "\n" + content_md5.strip() + "\n" + content_type + "\n" + date + "\n" + canonicalized_oss_headers + canonicalized_resource
    result.append(string_to_sign)
    h = hmac.new(secret_access_key.encode(), string_to_sign.encode(), sha)
    sign_result = base64.encodestring(h.digest()).strip()
    sign_result = sign_result.decode()
    return sign_result


def _format_header(headers=None):
    if not headers:
        headers = {}
    tmp_headers = {}
    for k in headers.keys():
        if k.lower().startswith(SELF_DEFINE_HEADER_PREFIX):
            k_lower = k.lower().strip()
            tmp_headers[k_lower] = headers[k]
        else:
            tmp_headers[k.strip()] = headers[k]
    return tmp_headers


class RedirectXml:
    def __init__(self, xml_string):
        self.xml = minidom.parseString(xml_string)
        self.endpoint = get_tag_text(self.xml, 'Endpoint')

    def Endpoint(self):
        return self.endpoint


def get_tag_text(element, tag, convert_to_bool=True):
    nodes = element.getElementsByTagName(tag)
    if len(nodes) == 0:
        return ""
    else:
        node = nodes[0]
    rc = ""
    for node in node.childNodes:
        if node.nodeType in (node.TEXT_NODE, node.CDATA_SECTION_NODE):
            rc = rc + node.data
    if convert_to_bool:
        if rc == "true":
            return True
        elif rc == "false":
            return False
    return rc


def get_content_type_by_filename(file_name):
    mime_type = ""
    mime_map = {}
    mime_map["js"] = "application/javascript"
    mime_map["xlsx"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    mime_map["xltx"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.template"
    mime_map["potx"] = "application/vnd.openxmlformats-officedocument.presentationml.template"
    mime_map["ppsx"] = "application/vnd.openxmlformats-officedocument.presentationml.slideshow"
    mime_map["pptx"] = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    mime_map["sldx"] = "application/vnd.openxmlformats-officedocument.presentationml.slide"
    mime_map["docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    mime_map["dotx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.template"
    mime_map["xlam"] = "application/vnd.ms-excel.addin.macroEnabled.12"
    mime_map["xlsb"] = "application/vnd.ms-excel.sheet.binary.macroEnabled.12"
    mime_map["apk"] = "application/vnd.android.package-archive"
    try:
        suffix = ""
        name = os.path.basename(file_name)
        suffix = name.split('.')[-1]
        if suffix in list(mime_map.keys()):
            mime_type = mime_map[suffix]
        else:
            import mimetypes
            mimetypes.init()
            mime_type = mimetypes.types_map["." + suffix]
    except Exception:
        mime_type = 'application/octet-stream'
    if not mime_type:
        mime_type = 'application/octet-stream'
    return mime_type


def get_string_base64_md5(string):
    fd = io.StringIO(string)
    base64md5 = get_fp_base64_md5(fd)
    fd.close()
    return base64md5


def get_fp_base64_md5(fd):
    m = get_md5()
    while True:
        d = fd.read(BUFFER_SIZE)
        if not d:
            break
        m.update(d)
    base64md5 = base64.encodestring(m.digest()).strip()
    return base64md5


def get_md5():
    if sys.version_info >= (2, 6):
        import hashlib
        hash = hashlib.md5()
    else:
        import md5
        hash = md5.new()
    return hash


class GetInitUploadIdXml:
    def __init__(self, xml_string):
        self.xml_unescape_table = {}
        self.xml_map = {}
        try:
            self.xml = minidom.parseString(xml_string)
        except:
            print(xml_string)
            self.xml_unescape_tabl = get_xml_unescape_table()
            self.xml_map = get_xml_unescape_map()
            for k, v in list(self.xml_map.items()):
                xml_string = xml_string.replace(k, v)
            self.xml = minidom.parseString(xml_string)
        self.bucket = get_tag_text(self.xml, 'Bucket', convert_to_bool=False)
        self.object = get_tag_text(self.xml, 'Key', convert_to_bool=False)
        if self.xml_map:
            for k, v in list(self.xml_map.items()):
                self.object = self.object.replace(v, k)
            self.object = unescape(self.object, self.xml_unescape_table)
        self.key = get_tag_text(self.xml, 'Key', convert_to_bool=False)
        self.upload_id = get_tag_text(self.xml, 'UploadId')
        self.marker = get_tag_text(self.xml, 'Marker', convert_to_bool=False)

    def show(self):
        print(" ")


def get_xml_unescape_table():
    return XML_UNESCAPE_TABLE


def get_xml_unescape_map():
    xml_map = {}
    for k, v in list(XML_UNESCAPE_TABLE.items()):
        m = get_md5()
        m.update(k)
        md5_k = m.hexdigest()
        xml_map[k] = md5_k + str(time.time())
    return xml_map


class ErrorXml:
    def __init__(self, xml_string):
        self.xml = minidom.parseString(xml_string)
        self.code = get_tag_text(self.xml, 'Code')
        self.msg = get_tag_text(self.xml, 'Message')
        self.resource = get_tag_text(self.xml, 'Resource')
        self.request_id = get_tag_text(self.xml, 'RequestId')
        self.host_id = get_tag_text(self.xml, 'HostId')

    def show(self):
        print("Code: %s\nMessage: %s\nResource: %s\nRequestId: %s \nHostId: %s" % (
        self.code, self.msg, self.resource, self.request_id, self.host_id))


class GetBucketXml:
    def __init__(self, xml_string):
        self.xml_unescape_table = {}
        self.xml_map = {}
        try:
            self.xml = minidom.parseString(xml_string)
        except:
            print(xml_string)
            self.xml_unescape_tabl = get_xml_unescape_table()
            self.xml_map = get_xml_unescape_map()
            for k, v in self.xml_map.items():
                xml_string = xml_string.replace(k, v)
            self.xml = minidom.parseString(xml_string)

        self.name = get_tag_text(self.xml, 'Name', convert_to_bool=False)
        self.prefix = get_tag_text(self.xml, 'Prefix', convert_to_bool=False)
        self.marker = get_tag_text(self.xml, 'Marker', convert_to_bool=False)
        self.nextmarker = get_tag_text(self.xml, 'NextMarker', convert_to_bool=False)
        self.maxkeys = get_tag_text(self.xml, 'MaxKeys')
        self.delimiter = get_tag_text(self.xml, 'Delimiter', convert_to_bool=False)
        self.is_truncated = get_tag_text(self.xml, 'IsTruncated')

        self.prefix_list = []
        prefixes = self.xml.getElementsByTagName('CommonPrefixes')
        for p in prefixes:
            tag_txt = get_tag_text(p, "Prefix")
            self.prefix_list.append(tag_txt)

        self.content_list = []
        contents = self.xml.getElementsByTagName('Contents')
        for c in contents:
            self.content_list.append(Content(c))

    def show(self):
        print("Name: %s\nPrefix: %s\nMarker: %s\nNextMarker: %s\nMaxKeys: %s\nDelimiter: %s\nIsTruncated: %s" % (
        self.name, self.prefix, self.marker, self.nextmarker, self.maxkeys, self.delimiter, self.is_truncated))
        print("\nPrefix list:")
        for p in self.prefix_list:
            print(p)
        print("\nContent list:")
        for c in self.content_list:
            c.show()
            print("")

    def list(self):
        cl = []
        pl = []
        for c in self.content_list:
            key = c.key
            if self.xml_map:
                for k, v in self.xml_map.items():
                    key = key.replace(v, k)
                key = unescape(key, self.xml_unescape_table)
            cl.append((key, c.last_modified, c.etag, c.size, c.owner.id, c.owner.display_name, c.storage_class))
        for p in self.prefix_list:
            pl.append(p)

        return (cl, pl)


class Content:
    def __init__(self, xml_element):
        self.element = xml_element
        self.key = get_tag_text(self.element, "Key", convert_to_bool=False)
        self.last_modified = get_tag_text(self.element, "LastModified")
        self.etag = get_tag_text(self.element, "ETag")
        self.size = get_tag_text(self.element, "Size")
        self.owner = Owner(self.element.getElementsByTagName('Owner')[0])
        self.storage_class = get_tag_text(self.element, "StorageClass")

    def show(self):
        print("Key: %s\nLastModified: %s\nETag: %s\nSize: %s\nStorageClass: %s" % (
        self.key, self.last_modified, self.etag, self.size, self.storage_class))
        self.owner.show()


class Owner:
    def __init__(self, xml_element):
        self.element = xml_element
        self.id = get_tag_text(self.element, "ID")
        self.display_name = get_tag_text(self.element, "DisplayName")

    def show(self):
        print("ID: %s\nDisplayName: %s" % (self.id, self.display_name))


class GetServiceXml:
    def __init__(self, xml_string):
        self.xml = minidom.parseString(xml_string)
        self.owner = Owner(self.xml.getElementsByTagName('Owner')[0])
        self.buckets = self.xml.getElementsByTagName('Bucket')
        self.bucket_list = []
        self.prefix = get_tag_text(self.xml, 'Prefix', convert_to_bool=False)
        self.marker = get_tag_text(self.xml, 'Marker', convert_to_bool=False)
        self.maxkeys = get_tag_text(self.xml, 'MaxKeys')
        self.is_truncated = get_tag_text(self.xml, 'IsTruncated')
        self.nextmarker = get_tag_text(self.xml, 'NextMarker')

        for b in self.buckets:
            self.bucket_list.append(Bucket(b))

    def show(self):
        print("Owner:")
        self.owner.show()
        print("\nBucket list:")
        for b in self.bucket_list:
            b.show()
            print("")

    def list(self):
        bl = []
        for b in self.bucket_list:
            bl.append((b.name, b.creation_date, b.location))
        return bl

    def get_prefix(self):
        return self.prefix

    def get_marker(self):
        return self.marker

    def get_maxkeys(self):
        return self.maxkeys

    def get_istruncated(self):
        return self.is_truncated

    def get_nextmarker(self):
        return self.nextmarker


class Bucket:
    def __init__(self, xml_element):
        self.element = xml_element
        self.location = get_tag_text(self.element, "Location")
        self.name = get_tag_text(self.element, "Name", convert_to_bool=False)
        self.creation_date = get_tag_text(self.element, "CreationDate")

    def show(self):
        print("Name: %s\nCreationDate: %s\nLocation: %s" % (self.name, self.creation_date, self.location))

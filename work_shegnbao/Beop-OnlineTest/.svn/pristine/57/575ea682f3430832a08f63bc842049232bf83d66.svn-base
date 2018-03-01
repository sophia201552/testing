__author__ = 'woody'
import time, string, random
import email.mime.multipart
from email.header import Header
from interfaceTest import app
from email.utils import formatdate
from email.mime.text import MIMEText
import smtplib
import poplib
from email.parser import Parser
from email.header import decode_header
from email.utils import parseaddr
poplib._MAXLINE = 20480000
class MailTools:

    def __init__(self):
        pass


    def getInstance(self):
        if(self.__instance == None):
            self.__instance = MailTools()
        return self.__instance

    @classmethod
    def send_mail(self, reciepents, title, cost, body=None):
        msg = email.mime.multipart.MIMEMultipart()
        MAIL_SERVER = app.config['MAIL_SERVER']
        MAIL_USERNAME = app.config['PROJECTTEST_ACCOUNT']
        MAIL_PASSWORD = "Rnbtech1103"
        DEFAULT_MAIL_SENDER = '%s<projecttest@rnbtech.com.hk>' % (Header('BeOP-接口自动化测试', 'utf-8'))
        MAIL_DEFAULT_SENDER = 'projecttest@rnbtech.com.hk'
        msg['from'] = DEFAULT_MAIL_SENDER
        msg['to'] = ';'.join(reciepents)
        msg['subject'] = title
        msg['Date'] = formatdate(localtime=True)
        content = '''

        '''
        content = content + body

        content = content + '''

           R&B RD
        ''' + """
           '\n'""" + str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(
            time.time()))) + """'\n'""" + '<br/><h2>本次测试耗时%.2f分钟！</h2>' % cost

        msg.attach(MIMEText(content, 'html'))

        #smtp = smtplib
        smtp = smtplib.SMTP(timeout=90)
        smtp.connect(MAIL_SERVER, 25)
        smtp.login(MAIL_USERNAME, MAIL_PASSWORD)
        smtp.sendmail(DEFAULT_MAIL_SENDER, reciepents, msg.as_string())
        smtp.quit()

    def loginEmail(self, Email, pwd):
        pop3_server = app.config['POP3_SERVER']
        server = poplib.POP3(pop3_server)
        server.set_debuglevel(1)
        print(server.welcome.decode('utf-8'))
        server.user(Email)
        server.pass_(pwd)
        print('Messages: %s. Size: %s' % server.stat())
        return server

    def guess_charset(self, msg):
        charset = msg.get_charset()
        if charset is None:
            content_type = msg.get('Content-Type', '').lower()
            pos = content_type.find('charset=')
            if pos >= 0:
                charset = content_type[pos + 8:].strip()
        return charset

    def decode_str(self, s):
        value, charset = decode_header(s)[0]
        if charset:
            value = value.decode(charset)
        return value

    def print_info(self, msg, indent=0):
        if indent == 0:
            for header in ['From', 'To', 'Subject']:
                value = msg.get(header, '')
                if value:
                    if header == 'Subject':
                        value = self.decode_str(value)
                        return value
                    else:
                        hdr, addr = parseaddr(value)
                        name = self.decode_str(hdr)
                        value = u'%s <%s>' % (name, addr)
                print('%s%s: %s' % ('  ' * indent, header, value))
        '''
        if (msg.is_multipart()):
            parts = msg.get_payload()
            for n, part in enumerate(parts):
                print('%spart %s' % ('  ' * indent, n))
                print('%s--------------------' % ('  ' * indent))
                self.print_info(part, indent + 1)
        else:
            content_type = msg.get_content_type()
            if content_type == 'text/plain' or content_type == 'text/html':
                content = msg.get_payload(decode=True)
                charset = self.guess_charset(msg)
                if charset:
                    content = content.decode(charset)
                print('%sText: %s' % ('  ' * indent, content + '...'))
            else:
                print('%sAttachment: %s' % ('  ' * indent, content_type))'''


    def checkEmail(self, server, subject):
        resp, mails, octets = server.list()
        print(mails)

        #获取最新一封邮件，注意索引号从1开始:
        index = len(mails)
        resp, lines, octets = server.retr(index)

        # lines存储了邮件的原始文本的每一行,
        # 可以获得整个邮件的原始文本:
        msg_content = b'\r\n'.join(lines).decode('utf-8', errors='ignore')

        #稍后解析出邮件：
        msg = Parser().parsestr(msg_content)
        title = self.print_info(msg)
        server.quit()

        if subject in title:
            return True
        else:
            return False

if __name__ == '__main__':
    m = MailTools()
    server = m.loginEmail('projecttest@rnbtech.com.hk', 'h=Lp4U8+Lp')
    rv = m.checkEmail(server, '算法')
    print(rv)
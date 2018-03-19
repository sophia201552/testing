import unittest,time
from HTMLTestRunner import HTMLTestRunner
from Methods.MailTools import MailTools
from jinja2 import Environment,PackageLoader
from config import app
from email.utils import formatdate
from email.mime.text import MIMEText
import smtplib
import email
from Methods.TestResultTools import MyTestResult
def send_mail(reciepents, title,body=None):
    msg = email.mime.multipart.MIMEMultipart()
    MAIL_SERVER = app.config['MAIL_SERVER']
    MAIL_USERNAME = app.config['PROJECTTEST_ACCOUNT']
    MAIL_PASSWORD = app.config['PROJECTTEST_PWD']
    DEFAULT_MAIL_SENDER = '<projecttest@rnbtech.com.hk>'
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
    '''

    msg.attach(MIMEText(content, 'html'))

    # smtp = smtplib
    smtp = smtplib.SMTP(timeout=90)
    smtp.connect(MAIL_SERVER, 25)
    smtp.login(MAIL_USERNAME, MAIL_PASSWORD)
    smtp.sendmail(DEFAULT_MAIL_SENDER, reciepents, msg.as_string())
    smtp.quit()

def addCaseResult(testReuslt):
    reportResult=[]
    for item in testResult.successes:
        reportResult.append({'success_count': 0,
                                                 'success_list': [],
                                                 'fail_str': '',
                                                 'testCaseID': item[0].testCaseID,
                                                 'projectName': item[0].projectName,
                                                 'buzName': item[0].buzName,
                                                 'startTime': item[0].startTime,
                                                 'now': item[0].now,
                                                 'usetime': item[0].start,
                                                 })
    for item in testResult.failures:
        reportResult.append({'fail_count': 0,
                                            'fail_list': [],
                                            'fail_str': str(item[1]),
                                            'testCaseID': item[0].testCaseID,
                                            'projectName': item[0].projectName,
                                            'buzName': item[0].buzName,
                                            'startTime': item[0].startTime,
                                            'now': item[0].now,
                                            'usetime': item[0].start,

                                            })
    return reportResult

if __name__=='__main__':
    test_dir='./UICase'
    discover=unittest.defaultTestLoader.discover(test_dir,pattern='test*.py')
    reportPath = app.config['BASE_DIR']

    test_report='./TestReport'
    now_time=str(time.time())+'zidonghua'
    file_name=test_report+'/'+now_time+'自动化测试报告.html'
    # fp=open(file_name,'wb')
    #
    # runner=HTMLTestRunner(stream=fp,title='test result')  #HTMLTestRunner
    #testResult=runner.run(discover)
    runner = unittest.TextTestRunner(resultclass=MyTestResult)
    testResult = runner.run(discover)
    # fp.close()
    reportResult=addCaseResult(testResult)

    env = Environment(loader=PackageLoader(__name__, 'templates', encoding='utf-8'))
    template = env.get_template('template.html')
    resultHTML = template.render(reportStruct=reportResult)
    nowtime = time.strftime("%Y-%m-%d %H.%M.%S", time.localtime())
    with open('%s\TestReport\自动化测试报告%s.html' % (reportPath, nowtime), 'wb') as file:
        file.write(resultHTML.encode())
    # f = open(file_name, 'rb')
    # mail_body = f.read()
    # f.close()
    send_mail(["sophia.zhao@rnbtech.com.hk"],"UI测试", resultHTML)


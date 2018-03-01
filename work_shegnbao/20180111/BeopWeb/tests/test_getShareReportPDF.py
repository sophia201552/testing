import pytestfrom beopWeb.mod_admin import reportControllersfrom flask import current_appfrom beopWeb.mod_oss.ossapi import *from beopWeb.mod_common.Utils import *import ospdf_name='test.html'@pytest.mark.p0@pytest.mark.usefixtures("removeReport")@pytest.mark.parametrize(('html','skin'), [    (pdf_name,'dark'),])def test_getShareReportPDF(html,skin):    f = open(html, 'w')    message ="""<!DOCTYPE html><html><head>    <meta name="pdfkit-encoding" content="UTF-8" />    <meta http-equiv="content-type" content="text/html;charset=utf-8" /></head><body id="reportBody" class="container"><div id="hc_151719524210160891bd9a2c">本日干球温度变化范围为-1.0~1.0℃，相对湿度变化范围为79.0~97.0%。/div></body></html>    """    f.write(message)    f.close()    rt = reportControllers.do_get_share_report_pdf(html,skin)    assert rt.status_code==200,'get_share_report_pdf fail,return result={0}'.format(rt)    assert isinstance(rt.data,bytes) and 'PDF' in str(rt.data),'actual data is not bytes, html is not changed to pdf'@pytest.fixture(scope='function')def removeReport(request):    def fin():        os.remove(pdf_name)    request.addfinalizer(fin)
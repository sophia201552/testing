import pdfkit
# pdfkit.from_url('http://www.taobao.com', 'out.pdf')
# pdfkit.from_file('test.html', 'out.pdf')
config=pdfkit.configuration(wkhtmltopdf=r"D:\htmlpdf\wkhtmltopdf\bin\wkhtmltopdf.exe")
pdfkit.from_string('Hello!', 'out.pdf',configuration=config)
print("OK")  # 用来表明程序运行结束

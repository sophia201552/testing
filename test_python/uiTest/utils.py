from selenium.webdriver.chrome.options import Options
import platform
from selenium import webdriver

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')

if platform.system() == "Windows":
    chrome_options.binary_location = r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
    chrome_options.binary_location = r'C:\Program Files\Google\Chrome\Application\chromedriver.exe'
else:
    chrome_options.binary_location = '/opt/google/chrome/chrome'

def chrome_option():
    global chrome_options
    return chrome_options

def getChrome():
    try:
        driver=None
        driver=webdriver.Chrome()#chrome_options=chrome_option()
    except Exception as e:
        print(e.__str__())
    return driver

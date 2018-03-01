#edcoding=utf-8

#from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import platform
from tests.uitest.userkey import *

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')

if platform.system() == "Windows":
    chrome_options.binary_location = r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
else:
    chrome_options.binary_location = '/opt/google/chrome/chrome'

driver = webdriver.Chrome(chrome_options=chrome_options)

def get_element_by_name(name):
    if name:
        return driver.find_element_by_id(name)
    else:
        raise Exception('name is invalid')

def assign_value(element, value):
    if element:
        element.send_keys(value)
    else:
        raise Exception("element is None")

def click(name):
    element = get_element_by_name(name)
    if element:
        element.click()
    else:
        raise Exception("element is None")

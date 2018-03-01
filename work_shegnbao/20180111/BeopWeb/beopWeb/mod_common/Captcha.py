'''
验证码工具
根据Pillow库创建验证码图片
'''
__author__ = 'win7'

import random
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
from PIL import ImageFilter
import string
import base64
from io import BytesIO


def gen_captcha(text=None, fnt="arial.ttf", fnt_sz=50):
    '''
    获取验证码

    :param text: 验证码字符串
    :param fnt: 字体
    :param fnt_sz: 字体大小
    :return: 验证码的base64
    '''
    if not text:
        text = __gen_rand_letters()
    fgcolor = random.randint(0, 0xff0000)
    font = ImageFont.truetype(fnt, fnt_sz)
    dim = font.getsize(text)
    im = Image.new('RGB', (dim[0] + 5, dim[1] + 5))
    d = ImageDraw.Draw(im)
    x, y = im.size
    r = random.randint
    for num in range(10):
        d.rectangle((r(0, x), r(0, y), r(0, x), r(0, y)), fill=r(0, 0xffff00))
    d.text((3, 3), text, font=font, fill=fgcolor)
    im = im.filter(ImageFilter.EDGE_ENHANCE_MORE)
    buffer = BytesIO()
    im.save(buffer, format="JPEG")
    return 'data:image/jpeg;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii'), text


def __gen_rand_letters(num=4):
    '''
    获取固定长度的字符串

    :param num: 字符串长度
    :return: 固定长度的字符串
    '''
    letters = ''
    for i in range(num):
        letters += random.choice(string.ascii_letters)
    return letters


if __name__ == '__main__':
    print(gen_captcha(__gen_rand_letters()))

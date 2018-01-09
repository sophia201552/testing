import os
from PIL import Image

text = u"这是一段测试文本，test 123。"

im = Image.new("RGB", (300, 50), (255, 0, 0))
im.show()
im.save("testAvatar.png")
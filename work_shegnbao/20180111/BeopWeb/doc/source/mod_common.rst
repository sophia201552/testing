.. toctree::
       :maxdepth: 2

mod_common 模块
**************************

BrowserUtils
------
       浏览器相关帮助类

.. automodule:: beopWeb.mod_common
.. autoclass:: BrowserUtils
       :members:

Captcha
------
       验证码生成

       依赖Pillow包实现可定义长度的取值范围为[0-9a-zA-Z]的验证码生成功能

.. automodule:: beopWeb.mod_common
       :members:

DbEntity
------
       数据库操作实体

.. autoclass:: DbEntity
       :members:

I18n
------
       后台国际化

       加载国际化资源ini来加载国际化配置

       国际化资源文件在mod_common.locale中

.. autoclass:: I18n
       :members:

PyChecker
------
       检查python代码语法

       通过编译python文件,但是不执行, 获得编译期语法错误

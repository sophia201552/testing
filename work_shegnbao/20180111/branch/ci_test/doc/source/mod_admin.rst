.. toctree::
    :maxdepth: 2

mod_admin 模块
**************************

BeOPPermission
------

    BeOPPermission用于检查用户当前权限信息

权限说明
+++++

    权限标识定义一个最小权限. 页面应用只使用权限标识. 例如 DAnalysis 权限表示 "数据分析"功能的权限

    权限组包含一个或多个权限标识, 权限组可以包含其他权限组.

    角色包含多个权限组. 角色可以授权给用户. 既该用户将具有该角色包含的所有的权限标识.

    后台接口会返回一个用户所有的授权的权限标识数组, 用于实现页面控制功能.

    如数据分析功能
.. code-block:: html

    <li class="iconWrap" id="btnDataAnalys" permission="DAnalysis">

..

    如果登录用户AppConfig.permission字典中含有DAnalysis:true 将显示数据分析功能, 否则数据分析功能将被在页面中删除.



相关文件
+++++
    :download:`权限组定义<../files/权限管理.xlsx>`

数据库相关
+++++

    - p_role_group              角色--权限组对应表
    - p_role_group_user         用户--权限组表
    - p_role_permission         权限组定义表

具体类
+++++

.. automodule:: beopWeb.mod_admin
.. autoclass:: BeOPPermission
    :members:

FavoriteProject
------
    设置用户进入首页的默认项目. 如果设置项目A, 用户在登录后会直接进入项目A的第一个菜单.
    一个用户只能设置一个默认项目.

.. autoclass:: FavoriteProject
    :members:


DataManager
------
    数据管理功能中原始数据页面. 用户进行点的收藏功能. 用户收藏点根据不同项目进行保存.

.. autoclass:: DataManager
    :members:

Project
------
.. autoclass:: Project
    :members:

OperationLog
------
.. autoclass:: OperationLog
    :members:

OperationLogType
------
.. autoclass:: OperationLogType
    :members:

ProjectPermission
------
    项目中用户的分组设置

    一个项目可有多个分组, 一个用户可属于多个分组. 分组可以单独设置项目配置如菜单显示等.

    涉及数据库表:

    role_project 项目的分组信息

    user_role    用户-分组对应关系

.. autoclass:: ProjectPermission
    :members:

RealTimeData
------
    项目实时数据信息.

    目前每个项目实时数据放置在项目表project中mysqlname字段对应的表中.

    同时放置beopDataBuffer库中以项目ID为命名的表中当缓存

.. autoclass:: RealTimeData
    :members:


Records
------
    用户操作记录

.. autoclass:: Records
    :members:


RoleGroup
------
    角色组

.. autoclass:: RoleGroup
    :members:


RoleGroupUser
------
    用户-权限组表

.. autoclass:: RoleGroupUser
    :members:

RolePermission
------
    权限标识表

.. autoclass:: RolePermission
    :members:

Token
------
    帐号相关Token

.. autoclass:: Token
    :members:

Upload
------
    上传

.. autoclass:: Upload
    :members:

User
------
    用户信息

.. autoclass:: User
    :members:
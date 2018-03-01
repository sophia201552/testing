import logging
from flask import Flask
from flask.ext.compress import Compress
from webassets.script import CommandLineEnvironment

app = Flask(__name__, static_folder='static')

app.config.from_object(__name__)
app.config.update(dict(

    Condition='2015-11-04',  # 0: Development；  1: Test；  2: Online-Test； 3: Demo； 年-月-日：Product
    DATABASE='beopdoengine',
    PROJECT_DATABASE='beopdata',
    WORKFLOW_DATABASE='workflow',
    TABLE_OP='operation_record',
    DB_POOL_NAME='BEOPDBPool',
    MAIL_SERVER='smtp.rnbtech.com.hk',
    MAIL_USERNAME='beop.cloud@rnbtech.com.hk',
    MAIL_PASSWORD='beop123456',
    MAIL_DEFAULT_SENDER=("BeOP数据诊断优化平台", "beop.cloud@rnbtech.com.hk"),
    MAIL_DEBUG=0,
    FTP_PATH='d:/FTP/beopsoft-release',
    S3DB_DIR_CLOUD='s3db/',
    DLL_CONFIG_PATH='beopWeb/lib/config',

    GZIP_ENABLE=True,
    SITE_DOMAIN='beop.rnbtech.com.hk',
    DEV_ENVIRONMENT=False,

    ASSETS_JS_FILTER='rjsmin',
    ASSETS_CSS_FILTER='cssmin',

    MONGO_SERVER_HOST='beop.rnbtech.com.hk',
    DLLSERVER_ADDRESS = 'http://114.215.172.232:5000',

    ASSETS_DEBUG=False,
    LOCAL_ALLOWED = False,#为true的话，使用外网的地址，否则使用内网地址
    URL_CHECK = True,#是否启动url的token校验
    TOKEN_EXPIRATION = 10800, #3小时： 60 * 60 * 3
    MEMCACHE_HOSTLIST = ['beop.rnbtech.com.hk:11211'],
    OS_TYPE=0
))

if isinstance(app.config.get('Condition'), str):
        app.config.update(dict(
        SITE_DOMAIN='beop.rnbtech.com.hk',
        USERNAME='beopweb',
        PASSWORD='rnbtechrd',
        INIT_CONNECTIONS_POOL=10,
        HOST='10.162.105.118',
        MYSQL_SERVER_READ='121.41.33.198',
        MYSQL_SERVER_READ_USERNAME='beopweb',
        MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
        MYSQL_SERVER_READ_CONNECTIONS_POOL=20,
        MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
        DLLSERVER_ADDRESS = 'http://10.162.105.118:5000',

        OS_TYPE=1
    ))
else:
    # Dev
    if app.config['Condition'] == 0:
        app.config.update(dict(
            DEV_ENVIRONMENT=True,

            USERNAME='',
            PASSWORD='',

            INIT_CONNECTIONS_POOL=2,
            HOST='192.168.1.208',
            # HOST='114.215.172.232',

            # MYSQL_SERVER_READ='114.215.172.232',
            MYSQL_SERVER_READ='192.168.1.208',

            MYSQL_SERVER_READ_USERNAME='',
            MYSQL_SERVER_READ_PASSWORD='',

            MYSQL_SERVER_READ_CONNECTIONS_POOL=2,
            MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
            MONGO_SERVER_HOST='192.168.1.208',

            ASSETS_DEBUG=True,
            LOCAL_ALLOWED = True,
            URL_CHECK = False,
            DLLSERVER_ADDRESS = 'http://114.215.172.232:5000',
            MEMCACHE_HOSTLIST = ['beopdemo.rnbtech.com.hk:11211'],
        ))

    # Test
    if app.config['Condition'] == 1:
        app.config.update(dict(
            USERNAME='beopweb',
            PASSWORD='rnbtechrd',
            INIT_CONNECTIONS_POOL=3,
            HOST='192.168.1.208',

            MYSQL_SERVER_READ='192.168.1.208',
            MYSQL_SERVER_READ_USERNAME='beopweb',
            MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
            MYSQL_SERVER_READ_CONNECTIONS_POOL=7,
            MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
            MONGO_SERVER_HOST='192.168.1.208',
            MEMCACHE_HOSTLIST = ['beopdemo.rnbtech.com.hk:11211'],
        ))

    # Online Test
    if app.config['Condition'] == 2:
        app.config.update(dict(
            SITE_DOMAIN='beop.rnbtech.com.hk',
            USERNAME='beopweb',
            PASSWORD='rnbtechrd',
            INIT_CONNECTIONS_POOL=5,
            # HOST='rds7n4949y4dwgh0q88y.mysql.rds.aliyuncs.com',
            HOST='121.41.33.198',
            # MYSQL_SERVER_READ='rdsdxu3bb6q36ks8iu58.mysql.rds.aliyuncs.com',
            MYSQL_SERVER_READ='121.41.33.198',
            MYSQL_SERVER_READ_USERNAME='beopweb',
            MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
            MYSQL_SERVER_READ_CONNECTIONS_POOL=5,
            MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
            DLLSERVER_ADDRESS = 'http://10.162.105.118:5000',

            ASSETS_DEBUG=True,
            LOCAL_ALLOWED = True,
            URL_CHECK = False,
        ))

    #Demo
    if app.config['Condition'] == 3:
        app.config.update(dict(
            SITE_DOMAIN='beop.rnbtech.com.hk',
            USERNAME='beopweb2',
            PASSWORD='rnbtechrd',
            INIT_CONNECTIONS_POOL=2,
            # HOST='rds7n4949y4dwgh0q88y.mysql.rds.aliyuncs.com',
            HOST='10.162.105.118',

            # MYSQL_SERVER_READ='rdsdxu3bb6q36ks8iu58.mysql.rds.aliyuncs.com',
            MYSQL_SERVER_READ='121.41.33.198',
            MYSQL_SERVER_READ_USERNAME='beopweb2',
            MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
            MYSQL_SERVER_READ_CONNECTIONS_POOL=2,
            MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
        ))

    # Online beop6 of HK
    if app.config['Condition'] == 4:
        app.config.update(dict(
            SITE_DOMAIN='beop6.rnbtech.com.hk',
            USERNAME='beopweb',
            PASSWORD='rnbtechrd',
            INIT_CONNECTIONS_POOL=5,
            HOST='localhost',
            # HOST = '10.162.105.118',

            # MYSQL_SERVER_READ='rdsdxu3bb6q36ks8iu58.mysql.rds.aliyuncs.com',
            MYSQL_SERVER_READ='localhost',
            MYSQL_SERVER_READ_USERNAME='beopweb',
            MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
            MYSQL_SERVER_READ_CONNECTIONS_POOL=5,
            MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
            LOCAL_ALLOWED = True,
        ))

    # Online Japan
    if app.config['Condition'] == 5:
        app.config.update(dict(
            SITE_DOMAIN='beop.rnbtech.com.hk',
            USERNAME='beopweb',
            PASSWORD='rnbtechrd',
            INIT_CONNECTIONS_POOL=2,
            HOST='rds7n4949y4dwgh0q88y.mysql.rds.aliyuncs.com',
            # HOST = '10.162.105.118',

            # MYSQL_SERVER_READ='rdsdxu3bb6q36ks8iu58.mysql.rds.aliyuncs.com',
            MYSQL_SERVER_READ='121.41.33.198',
            MYSQL_SERVER_READ_USERNAME='beopweb',
            MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
            MYSQL_SERVER_READ_CONNECTIONS_POOL=2,
            MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
        ))

app.config.from_envvar('FLASKR_SETTINGS', silent=True)

if app.config.get('GZIP_ENABLE'): Compress(app)

import beopWeb.views
import beopWeb.appTemp
import beopWeb.spring
import beopWeb.factory
import beopWeb.observer
import beopWeb.diagnosis
import beopWeb.workflow
import beopWeb.sqlite_op

from flask.ext.assets import Environment, Bundle

assets = Environment(app)
assets.debug = app.config.get('ASSETS_DEBUG')
assets.manifest = False
assets.cache = False
assets.auto_build = False
assets.init_app(app)

# js assets
assets.register('js_tool', Bundle(
    # min
    "scripts/lib/jquery-1.11.1.min.js",
    "scripts/lib/bootstrap/responsive-nav/responsive-nav.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/rangeSlider/js/ion.rangeSlider.js",
    #"scripts/lib/effects/three.min.js",
    "scripts/lib/mathquill/mathquill.min.js",

    "scripts/lib/echart/echarts-all.js",
    "scripts/lib/ueditor/ueditor.config.js",
    "scripts/lib/ueditor/ueditor.all.js",
    output='gen/js_tool.js'))

assets.register('js_index', Bundle(
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap-wysiwyg.js",
    "scripts/lib/effects/cloud/Detector.js",

    "scripts/spring/factoryIoC.js",
    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/cache/dsCache.js",
    "scripts/core/cache/imgCache.js",
    "scripts/core/cache/bufferCache.js",
    "scripts/i18n/i18n.js",
    "scripts/admin/paneProjectSelector.js",
    "scripts/admin/versionHistory.js",
    "scripts/index.js",
    "scripts/core/beopMap.js",
    "scripts/core/baseMap.js",
    "scripts/admin/benchmark/dataRange.js",
    "scripts/core/eventAdapter.js",

    # widgets
    "scripts/lib/widgets/table.js",
    "scripts/lib/widgets/validator.js",

    # entrance
    "scripts/observer/widgets/operatingPane.js",
    "scripts/observer/widgets/operatingRecord.js",
    "scripts/observer/widgets/historyChart.js",
    "scripts/observer/widgets/uploadFile.js",
    # "scripts/observer/widgets/dataWatch.js",
    "scripts/observer/widgets/pointManager.js",
    "scripts/observer/widgets/alarmLogging.js",
    "scripts/observer/widgets/dataSourceAdd.js",
    "scripts/observer/widgets/dataSource.js",
    "scripts/observer/widgets/modalConfigurePane.js",
    "scripts/observer/widgets/shareLogging.js",
    "scripts/observer/diagnosis/diagnosisConfig.js",
    "scripts/observer/widgets/temperatureSetting.js",
	"scripts/observer/widgets/dataCalcFilter.js",
	"scripts/observer/widgets/modalAppendPointToDs.js",

    "scripts/observer/observerScreen.js",
    "scripts/observer/analysisScreen.js",
    "scripts/observer/analysis/analysisModel.js",
    "scripts/observer/analysis/analysisTemplate.js",
    "scripts/observer/analysis/centerSliderPanel.js",
    "scripts/observer/analysis/leftSliderPanel.js",
    "scripts/observer/analysis/workspacePanel.js",
    "scripts/observer/analysis/templatePanel.js",

    "scripts/observer/energyScreen.js",
    "scripts/observer/reportScreen.js",
    "scripts/observer/diagnosisScreen.js",
    "scripts/dataCenter3D/DataCenter3D.js",

    # admin
    "scripts/admin/productDownload.js",
    "scripts/admin/userManager/userManagerController.js",
    "scripts/admin/userManager/accountManager.js",
    "scripts/admin/userManager/memberManager.js",
    "scripts/admin/userManager/projectPermissionManager.js",
    "scripts/admin/paneProjectCreator.js",
    "scripts/admin/paneProjectConfigure.js",
    "scripts/admin/menuConfigure.js",
    "scripts/admin/benchmark/benchmarkConfigure.js",
    "scripts/admin/benchmark/benchMark.js",
    "views/theme/dark.js",
    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_index.js'))

assets.register('js_screen', Bundle(
    # observer
    "scripts/core/timer.js",
    "scripts/core/sprites.js",
    "scripts/core/commonCanvas.js",
    "scripts/lib/Chart.js",
    "scripts/observer/widgets/timeShaft.js",
    "scripts/observer/widgets/modalWiki.js",

    "scripts/observer/entities/modelPipeline.js",
    "scripts/observer/entities/modelEquipment.js",
    "scripts/observer/entities/modelButton.js",
    "scripts/observer/entities/modelText.js",
    "scripts/observer/entities/modelChart.js",
    "scripts/observer/entities/modelGage.js",
    "scripts/observer/entities/modelRuler.js",
    "scripts/observer/entities/modelCheckbox.js",
    "scripts/observer/entities/modelTempDistribution.js",

    # analysis
    "scripts/observer/analysis/sharpViewScreen.js",

    "scripts/observer/analysis/enerties/anlzBase.js",
    "scripts/observer/analysis/enerties/anlzChart.js",
    "scripts/observer/analysis/enerties/anlzHistoryCompare.js",
    "scripts/observer/analysis/enerties/anlzScatter.js",
    "scripts/observer/analysis/enerties/anlzSpectrum.js",
    "scripts/observer/analysis/enerties/anlzTendency.js",
    "scripts/observer/analysis/enerties/anlzStack.js",
    "scripts/observer/analysis/enerties/anlzCluster.js",
    "scripts/observer/analysis/enerties/anlzEnergy.js",

    # dashboard
    "scripts/spring/core/base.js",
    "scripts/spring/core/modalNone.js",
    "scripts/spring/core/modalAnalysis.js",
    "scripts/spring/entities/modalConfig.js",
    "scripts/spring/entities/modalChart.js",
    "scripts/spring/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalCarbonFootprint.js",
    "scripts/spring/entities/modalWeather.js",
    "scripts/spring/entities/modalEnergySaveRate.js",
    "scripts/spring/entities/modalCoalSaveTotal.js",
    "scripts/spring/entities/modalCo2SaveTotal.js",
    "scripts/spring/entities/modalKPIChart.js",
    "scripts/spring/entities/modalObserver.js",
    "scripts/spring/entities/modalMultiple.js",
    "scripts/spring/entities/modalPredictPointLine.js",
    "scripts/spring/entities/modalNote.js",
    "scripts/spring/entities/modalRank.js",
    "scripts/spring/entities/modalRankNormal.js",
    "scripts/spring/entities/modalMix.js",
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalChartCustom.js",
    "scripts/spring/entities/modalPointKPI.js",
    "scripts/spring/entities/modalPointKpiGrid.js",
    "scripts/spring/entities/modalReportChapter.js",

    # workflow
    "scripts/workflow2.0/workflowInsert.js",
    "scripts/workflow2.0/wf.apiMap.js",
    "scripts/workflow2.0/wf.data.js",
    "scripts/workflow2.0/wf.fake.js",
    "scripts/workflow2.0/wf.debug.js",
    "scripts/workflow2.0/wf.eventPubsub.js",
    "scripts/workflow2.0/wf.util.js",
    "scripts/workflow2.0/wf.model.js",
    "scripts/workflow2.0/wf.view.menu.js",
    "scripts/workflow2.0/wf.view.memberSelected.js",
    "scripts/workflow2.0/wf.view.activities.js",
    "scripts/workflow2.0/wf.view.taskList.js",
    "scripts/workflow2.0/wf.view.groupShow.js",
    "scripts/workflow2.0/wf.view.groupAdd.js",
    "scripts/workflow2.0/wf.view.groupDelete.js",
    "scripts/workflow2.0/wf.view.taskDetail.js",
    "scripts/workflow2.0/wf.view.faultCurve.js",
    "scripts/workflow2.0/wf.view.replyList.js",
    "scripts/workflow2.0/wf.view.progress.js",
    "scripts/workflow2.0/wf.view.groupEdit.js",
    "scripts/workflow2.0/wf.view.menu.groupList.js",
    "scripts/workflow2.0/wf.view.menu.labelList.js",
    "scripts/workflow/workflowCalendar.js",
    "scripts/workflow2.0/wf.main.js",
    "scripts/workflow/taskPool.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_screen.js'))

assets.register('js_share-dashboard', Bundle(
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap-wysiwyg.js",
	"views/theme/dark.js",

    "scripts/lib/widgets/validator.js",

    "scripts/spring/factoryIoC.js",
    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/cache/dsCache.js",
    "scripts/i18n/i18n.js",

    "scripts/observer/energyScreen.js",

    "views/share/dashboard/index.js",
    "scripts/spring/entities/modalConfig.js",
    "scripts/observer/widgets/modalConfigurePane.js",

    "scripts/spring/core/base.js",
    "scripts/spring/core/modalNone.js",
    "scripts/spring/core/modalAnalysis.js",
    "scripts/spring/entities/modalChart.js",
    "scripts/spring/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalCarbonFootprint.js",
    "scripts/spring/entities/modalWeather.js",
    "scripts/spring/entities/modalEnergySaveRate.js",
    "scripts/spring/entities/modalCoalSaveTotal.js",
    "scripts/spring/entities/modalCo2SaveTotal.js",
    "scripts/spring/entities/modalKPIChart.js",
    "scripts/spring/entities/modalObserver.js",
    "scripts/spring/entities/modalMultiple.js",
    "scripts/spring/entities/modalPredictPointLine.js",
    "scripts/spring/entities/modalNote.js",
    "scripts/spring/entities/modalRank.js",
    "scripts/spring/entities/modalRankNormal.js",
    "scripts/spring/entities/modalMix.js",
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalChartCustom.js",
    "scripts/spring/entities/modalPointKpiGrid.js",
    "scripts/spring/entities/modalPointKPI.js",
    "scripts/spring/entities/modalReportChapter.js",

    "scripts/observer/analysis/enerties/anlzBase.js",
    "scripts/observer/analysis/enerties/anlzChart.js",
    "scripts/observer/analysis/enerties/anlzHistoryCompare.js",
    "scripts/observer/analysis/enerties/anlzScatter.js",
    "scripts/observer/analysis/enerties/anlzSpectrum.js",
    "scripts/observer/analysis/enerties/anlzTendency.js",
    "scripts/observer/analysis/enerties/anlzStack.js",
    "scripts/observer/analysis/enerties/anlzCluster.js",
    "scripts/observer/analysis/enerties/anlzEnergy.js",
    "scripts/observer/widgets/dataSource.js",
    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_share-dashboard.js'))

assets.register('js_temperature_tools', Bundle(
    "scripts/lib/jquery-1.11.1.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/rangeSlider/js/ion.rangeSlider.js",
    "scripts/lib/hammer/hammer.min.js",
    "scripts/lib/hammer/jquery.hammer.js",

    output='gen/js_temperature_tools.js'))

assets.register('js_temperature', Bundle(
    "scripts/lib/spin.js",

    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/i18n/i18n.js",
    "scripts/core/eventAdapter.js",

    "app/temperatureControl/scripts/index.js",
    "app/temperatureControl/scripts/admin/adminConfigure.js",
    "app/temperatureControl/scripts/admin/projectSel.js",
    "app/temperatureControl/scripts/observer/observerScreen.js",
    "app/temperatureControl/scripts/observer/widgets/observerMap.js",
    "app/temperatureControl/scripts/observer/widgets/observerEquip.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_temperature.js'))

assets.register('js_temperature_admin', Bundle(
    "scripts/lib/spin.js",

    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/i18n/i18n.js",
    "scripts/core/eventAdapter.js",

    "app/temperatureControl/admin/index.js",
    "app/temperatureControl/admin/scripts/configure/configScreen.js",
    "app/temperatureControl/admin/scripts/configure/widgets/configTool.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_temperature.js'))

assets.register('js_mobile_tool', Bundle(
    "scripts/lib/jquery-1.11.1.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/rangeSlider/js/ion.rangeSlider.js",
    "scripts/lib/echart/echarts-all.js",
    "scripts/lib/hammer/hammer.min.js",
    "scripts/lib/hammer/jquery.hammer.js",
    "scripts/lib/spin.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_mobile_tool.js'))

assets.register('js_dashboard', Bundle(
    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/eventAdapter.js",
    "scripts/i18n/i18n.js",
    "scripts/observer/reportScreen.js",

    "app/dashboard/scripts/index.js",
    "app/dashboard/scripts/core/toggle.js",
    "app/dashboard/scripts/core/mobileCommon.js",
    "app/dashboard/scripts/core/router.js",
    "app/dashboard/scripts/core/baseMap.js",
    "app/dashboard/scripts/core/beopMap.js",
    "app/dashboard/scripts/project/projectSummary.js",
    "app/dashboard/scripts/project/projectReport.js",
    "app/dashboard/scripts/project/projectList.js",
    "app/dashboard/scripts/project/projectMap.js",
    "app/dashboard/scripts/message/messageIndex.js",
    "app/dashboard/scripts/message/messageWorkflow.js",
    "app/dashboard/scripts/workflow/workflowList.js",
    "app/dashboard/scripts/workflow/workflowAdd.js",
    "app/dashboard/scripts/workflow/workflowDetail.js",
    "app/dashboard/scripts/admin/adminConfig.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_dashboard.js'))

assets.register('js_report_detail', Bundle(
    "scripts/lib/jquery-1.11.1.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/echart/echarts-all.js",
    "scripts/i18n/i18n.js",
    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/index.js",
    "scripts/observer/reportScreen.js",

    output='gen/js_report.js'))

assets.register('js_cx_tool_point_table', Bundle(
    "app/CxTool/scripts/lib/jquery.min.js",
    "app/CxTool/scripts/lib/bootstrap.min.js",
    "app/CxTool/scripts/lib/chosen.jquery.min.js",
    "app/CxTool/scripts/lib/pikaday.js",
    "app/CxTool/scripts/lib/moment.js",
    "app/CxTool/scripts/lib/ZeroClipboard.js",
    "app/CxTool/scripts/lib/handsontable.js",
    "app/CxTool/scripts/lib/path.min.js",
    "scripts/core/webAPI.js",
    "scripts/lib/spin.js",

    "app/CxTool/scripts/apiMap.js",
    "scripts/workflow2.0/wf.data.js",
    "scripts/workflow2.0/wf.debug.js",
    "scripts/workflow2.0/wf.eventPubsub.js",
    "scripts/workflow2.0/wf.util.js",

    "app/CxTool/scripts/pointTable/model.js",
    "app/CxTool/scripts/pointTable/pt_view_sheet.js",
    "app/CxTool/scripts/main.js",
    "app/CxTool/scripts/util.js",

    output='gen/js_cx_tool_point_table.js'))

# web factory bundled js
assets.register('web_factory_js_bundle', Bundle(
    "scripts/lib/jquery-1.11.1.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "app/WebFactory/scripts/lib/dockspawn/js/dockspawn.js",
    "app/WebFactory/scripts/lib/konva/konva.js",

    # core
    "app/WebFactory/scripts/core/log.js",
    "app/WebFactory/scripts/core/comm.js",
    "app/WebFactory/scripts/core/event.js",

    # model
    "app/WebFactory/scripts/model/model.js",

    # panels
    "app/WebFactory/scripts/panels/pagePanel.js",
    "app/WebFactory/scripts/panels/layerPanel.js",
    "app/WebFactory/scripts/panels/propertyPanel.js",

    # toolbar
    "app/WebFactory/scripts/toolbar/toolbar.js",
    "app/WebFactory/scripts/toolbar/tBase.js",
    "app/WebFactory/scripts/toolbar/tPointer.js",
    "app/WebFactory/scripts/toolbar/tHand.js",
    "app/WebFactory/scripts/toolbar/tText.js",
    "app/WebFactory/scripts/toolbar/tHtml.js",
    "app/WebFactory/scripts/toolbar/tImage.js",
    "app/WebFactory/scripts/toolbar/tButton.js",
    "app/WebFactory/scripts/toolbar/tRect.js",
    "app/WebFactory/scripts/toolbar/tZoomSelect.js",

    # painter
    "app/WebFactory/scripts/painter/gPainter.js",
    "app/WebFactory/scripts/pageScreen.js",


    # enterance
    "app/WebFactory/scripts/index.js",

    output='gen/web_factory_js_index.js'))

# css assets
assets.register('css_index', Bundle(
    "scripts/lib/rangeSlider/css/ion.rangeSlider.css",
    "scripts/lib/rangeSlider/css/ion.rangeSlider.skinNice.css",
    'content/font-awesome.css',
    'scripts/lib/bootstrap/responsive-nav/responsive-nav.css',
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

    'scripts/lib/mathquill/mathquill.css',
    "content/index.css",
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/index.css'))

assets.register('css_temperature', Bundle(
    "scripts/lib/rangeSlider/css/ion.rangeSlider.css",
    "scripts/lib/rangeSlider/css/ion.rangeSlider.skinNice.css",
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_temperature.css'))

assets.register('css_temperature_admin', Bundle(
    "scripts/lib/rangeSlider/css/ion.rangeSlider.css",
    "scripts/lib/rangeSlider/css/ion.rangeSlider.skinNice.css",
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_temperature.css'))

assets.register('css_dashboard', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_dashboard.css'))

assets.register('css_report_detail', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    "content/index.css",
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_report.css'))

assets.register('css_cx_tool_point_table', Bundle(
    'app/CxTool/css/lib/bootstrap.min.css',
    'app/CxTool/css/lib/chosen.css',
    'app/CxTool/css/lib/handsontable.css',
    'app/CxTool/css/lib/pikaday.css',
    'app/CxTool/css/common.css',
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_cx_tool_point_table.css'))

# web factory bundled css
assets.register('web_factory_css_bundle', Bundle(
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',

    'app/WebFactory/scripts/lib/dockspawn/css/font-awesome.css',
    'app/WebFactory/scripts/lib/dockspawn/css/dock-manager.css',
    'app/WebFactory/themes/default/css/main.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/web_factory_css_bundle.css'))

from beopWeb.mod_admin import bp_admin
from beopWeb.mod_workflow import bp_workflow
from beopWeb.mod_report import bp_report
from beopWeb.mod_cxTool import bp_pointTool

app.register_blueprint(bp_admin)
app.register_blueprint(bp_workflow)
app.register_blueprint(bp_report)
app.register_blueprint(bp_pointTool)

if assets.debug == False:
    print('start packing')
    log = logging.getLogger('webassets')
    log.addHandler(logging.StreamHandler())
    log.setLevel(logging.DEBUG)
    cmdenv = CommandLineEnvironment(assets, log)
    cmdenv.build()
    print('generate package sucessful!')
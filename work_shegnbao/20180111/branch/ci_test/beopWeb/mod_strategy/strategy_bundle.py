"""
js/css bundle
"""

from beopWeb import app
from beopWeb.bundle import assets, filter_with_babel
from flask_assets import Bundle

# strategy thirdparty lib bundled js
assets.register('strategy_thirdparty_lib_js_bundle', Bundle(
    # third-party library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",

    "app/Strategy/scripts/lib/classnames/classnames.js",

    "app/Strategy/scripts/lib/react/react-custom.min.js",
    "app/Strategy/scripts/lib/react/react-dom.min.js",
    "app/Strategy/scripts/lib/react-hyperscript/react-hyperscript.js",
    "app/Strategy/scripts/lib/react-linkevent/react-linkevent.js",

    "app/Strategy/scripts/lib/redux/redux.min.js",
    "app/Strategy/scripts/lib/redux-thunk/redux-thunk.min.js",
    "app/Strategy/scripts/lib/react-redux/react-redux.min.js",
    "app/Strategy/scripts/lib/redux-enhancers/redux-multiple-actions-enhancer.js",

    # code mirror
    "scripts/lib/codemirror/lib/codemirror.js",
    "app/Strategy/scripts/lib/react-codemirror/react-codemirror.js",

    # echarts
    "scripts/lib/echart/echarts-new.js",
    "scripts/lib/echart/echarts-gl.min.js",
    "app/Strategy/scripts/lib/react-echarts/echarts-for-react.js",

    "app/Strategy/scripts/lib/Konva/Konva-custom.min.js",
    "app/Strategy/scripts/lib/react-konva/react-konva.js",

    "app/Strategy/scripts/lib/antd/antd.min.js",

    "app/Strategy/scripts/lib/moment/moment.min.js",

    output='gen/strategy_thirdparty_lib_js_bundle.js'))

# strategy beop lib bundled js
assets.register('strategy_beop_lib_js_bundle', Bundle(
    # beop library
    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/EventAdapter.js",
    "app/WebFactory/scripts/core/diff.js",

    #filters=app.config['ASSETS_JS_FILTER'],
    output='gen/strategy_beop_lib_js_bundle.js'))

# component strategy data source bundled js
assets.register('strategy_component_strategy_data_Source_js_bundle', Bundle(
    "scripts/dataManage/dm.utils.js",
    "scripts/dataManage/dm.tag.panel.js",
    "scripts/dataManage/dm.model.js",
    "scripts/dataManage/dm.tag.external.tree.js",
    "scripts/observer/widgets/dataSource.js",
    "scripts/iot/hierFilter.js",

    "app/Strategy/scripts/pages/painter/components/dataSourcePanelView.js",

    output='gen/strategy_component_strategy_data_Source_js_bundle.js'))

# strategy bundled js
assets.register('strategy_js_bundle', Bundle(
    # beop lib
    assets['strategy_beop_lib_js_bundle'],

    # util
    "app/Strategy/scripts/util/mergeDiff.js",

    # common
    "app/Strategy/scripts/common/common.js",
    "app/Strategy/scripts/common/enum.js",
    "app/Strategy/scripts/common/fuzzyRuleParser.js",
    "app/Strategy/scripts/common/tagMatcher.js",

    # app config
    "app/Strategy/scripts/appConfig.js",

    # common components
    "app/Strategy/scripts/common/components/fuzzyRuleChartView.js",
    "app/Strategy/scripts/common/components/codeEditor.js",
    "app/Strategy/scripts/common/components/strategyConfigModalView.js",
    "app/Strategy/scripts/common/components/strategySupplementModalView.js",
    "app/Strategy/scripts/common/components/strategyTriggerModalView.js",

    # modals
    "app/Strategy/scripts/pages/painter/components/modals/inputParamModalView.js",
    "app/Strategy/scripts/pages/painter/components/modals/outputParamModalView.js",
    "app/Strategy/scripts/pages/painter/components/modals/dataSourceModalView.js",
    "app/Strategy/scripts/pages/painter/components/modals/historicalTableModalView.js",
    "app/Strategy/scripts/pages/painter/components/modals/importParametersModalView.js",
    "app/Strategy/scripts/pages/painter/components/modals/showTextModalView.js",
    "app/Strategy/scripts/pages/painter/components/modals/showChartsModalView.js",
    "app/Strategy/scripts/pages/painter/components/modals/threeDimensionsViewModalView.js",
    "app/Strategy/scripts/pages/painter/components/modals/showTagsTableModalView.js",


    # strategy components
    "app/Strategy/scripts/pages/painter/components/spinView.js",
    "app/Strategy/scripts/pages/app/components/equipTreeView.js",
    "app/Strategy/scripts/pages/app/components/strategyTableView.js",
    "app/Strategy/scripts/pages/app/components/propPanelView.js",
    "app/Strategy/scripts/pages/painter/components/paramsTreeView.js",
    "app/Strategy/scripts/pages/painter/components/sketchpadToolbarView.js",
    "app/Strategy/scripts/pages/painter/components/sketchpad/Graphics/gShape.js",
    "app/Strategy/scripts/pages/painter/components/sketchpad/Graphics/gStrategyShape.js",
    "app/Strategy/scripts/pages/painter/components/sketchpad/Graphics/gOutputGroupShape.js",
    "app/Strategy/scripts/pages/painter/components/sketchpad/Graphics/gInputShape.js",
    "app/Strategy/scripts/pages/painter/components/sketchpad/Graphics/gOutputShape.js",
    "app/Strategy/scripts/pages/painter/components/sketchpad/Graphics/gArrow.js",
    "app/Strategy/scripts/pages/painter/components/sketchpad/calculation.js",
    "app/Strategy/scripts/pages/painter/components/sketchpad/sketchpadView.js",
    assets['strategy_component_strategy_data_Source_js_bundle'],
    "app/Strategy/scripts/pages/painter/components/rulePanelView.js",
    "scripts/lib/codemirror/mode/python/python.js",
    "app/Strategy/scripts/pages/painter/components/debugParamsPanelView.js",
    "app/Strategy/scripts/pages/painter/components/modulePropPanelView.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/fuzzyRuleConfigPanel/" +
    "fuzzyRuleInputModalView.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/fuzzyRuleConfigPanel/" +
    "fuzzyRuleOutputModalView.js",
    "app/Strategy/scripts/pages/painter/components/inputOutputParamConfigPanelView.js",

    "app/Strategy/scripts/pages/app/modules/equipTreeModule.js",
    "app/Strategy/scripts/pages/app/modules/strategyTableModule.js",
    "app/Strategy/scripts/pages/app/modules/propPanelModule.js",
    "app/Strategy/scripts/pages/painter/modules/sketchpadModule.js",
    "app/Strategy/scripts/pages/painter/modules/debugParamsPanelModule.js",
    "app/Strategy/scripts/pages/painter/modules/modulePropPanelModule.js",

    "app/Strategy/scripts/pages/app/containers/equipTreeContainer.js",
    "app/Strategy/scripts/pages/app/containers/strategyTableContainer.js",
    "app/Strategy/scripts/pages/app/containers/propPanelContainer.js",
    "app/Strategy/scripts/pages/painter/containers/sketchpadContainer.js",

    "app/Strategy/scripts/pages/painter/containers/debugParamsPanelContainer.js",
    "app/Strategy/scripts/pages/painter/containers/modulePropPanelContainer.js",

    
    "app/Strategy/scripts/pages/faultManage/components/faultInfoView.js",
    "app/Strategy/scripts/pages/faultManage/containers/faultInfoContainer.js",
    "app/Strategy/scripts/pages/faultManage/modules/faultInfoModule.js",

    # 监视面板
    "app/Strategy/scripts/pages/painter/components/debugWatchPanelView.js",
    "app/Strategy/scripts/pages/painter/modules/debugWatchPanelModule.js",
    "app/Strategy/scripts/pages/painter/containers/debugWatchPanelContainer.js",

    # 参数配置模态框
    "app/Strategy/scripts/pages/painter/components/modals/paramsConfigModalView.js",
    "app/Strategy/scripts/pages/painter/modules/modals/paramsConfigModalModule.js",
    "app/Strategy/scripts/pages/painter/containers/modals/paramsConfigModalContainer.js",

    # 调试控制台
    "app/Strategy/scripts/pages/painter/components/debugConsolePanelView.js",

    # 调试页面 sketchpad
    "app/Strategy/scripts/pages/painter/components/debugSketchpadPanelView.js",

    # 调试页面
    "app/Strategy/scripts/pages/painter/components/debugView.js",
    "app/Strategy/scripts/pages/painter/modules/debugModule.js",
    "app/Strategy/scripts/pages/painter/containers/debugContainer.js",

    # 模块配置面板
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/correlationAnalysisConfigPanelView.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/forecastConfigPanelView.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/historicalCurveConfigPanelView.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/tableConfigPanelView.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/threeDimensionsViewConfigPanelView.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/pythonConfigPanelView.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/fuzzyRuleConfigPanel/" +
    "fuzzyRuleContentView.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanels/fuzzyRuleConfigPanelView.js",
    "app/Strategy/scripts/pages/painter/modules/moduleConfigPanelModule.js",
    "app/Strategy/scripts/pages/painter/components/moduleConfigPanelView.js",
    "app/Strategy/scripts/pages/painter/containers/moduleConfigPanelContainer.js",

    # pages
    "app/Strategy/scripts/pages/app/components/appView.js",
    "app/Strategy/scripts/pages/painter/components/painterView.js",
    "app/Strategy/scripts/pages/painter/modules/painterModule.js",
    "app/Strategy/scripts/pages/painter/containers/painterContainer.js",
    "app/Strategy/scripts/pages/faultManage/components/faultManageView.js",

    # strategy core
    "app/Strategy/scripts/core/history.js",
    "app/Strategy/scripts/core/store.js",

    "app/Strategy/scripts/index.js",

    filters=filter_with_babel,
    output='gen/strategy_js_bundle.js'))

# strategy bundled css
assets.register('strategy_css_bundle', Bundle(
    # third-party library
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',
    'app/Strategy/scripts/lib/antd/antd.min.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',
    'fonts/beopIconFont/iconfont.css',
    "scripts/lib/codemirror/lib/codemirror.css",
    "scripts/lib/codemirror/lib/blackboard.css",

    # our web styles
    'app/Strategy/themes/default/css/components.css',
    'app/Strategy/themes/default/css/main.css',
    'app/Strategy/themes/default/css/antd-dark.css',
    'scripts/dataManage/contents/dm.tag.tree.css',
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/strategy_css_bundle.css'))

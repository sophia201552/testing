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
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/spin.js",

    "app/WebFactory/scripts/lib/dockspawn/js/dockspawn.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",

    "app/Strategy2/scripts/lib/Konva/Konva-custom.min.js",
    "app/Strategy2/scripts/lib/react/react-custom.min.js",
    "app/Strategy2/scripts/lib/react/react-dom.min.js",
    "app/Strategy2/scripts/lib/react-hyperscript/react-hyperscript.js",
    "app/Strategy2/scripts/lib/react-linkevent/react-linkevent.js",
    "app/Strategy2/scripts/lib/react-konva/react-konva.js",
    "app/Strategy2/scripts/lib/classnames/classnames.js",
    "scripts/lib/codemirror/lib/codemirror.js",
    "app/Strategy2/scripts/lib/react-codemirror/react-codemirror.js",

    output='gen/strategy_thirdparty_lib_js_bundle.js'))

# strategy beop lib bundled js
assets.register('strategy_beop_lib_js_bundle', Bundle(
    # beop library
    "scripts/lib/widgets/validator.js",
    "scripts/i18n/i18n.js",
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/EventAdapter.js",
    "app/WebFactory/scripts/core/diff.js",
    "app/Strategy2/scripts/util/mergeDiff.js",

    #filters=app.config['ASSETS_JS_FILTER'],
    output='gen/strategy_beop_lib_js_bundle.js'))

# component VariablePanel bundled js
assets.register('strategy_component_variable_panel_js_bundle', Bundle(
    "app/Strategy2/scripts/components/VariablePanel/variablePanel.js",

    output='gen/strategy_component_variable_panel_js_bundle.js'))

# component strategy data source bundled js
assets.register('strategy_component_strategy_data_Source_js_bundle', Bundle(
    "scripts/observer/widgets/dataSource.js",
    "scripts/iot/hierFilter.js",

    "app/Strategy2/scripts/components/DataSourcePanel/dataSourcePanel.js",

    output='gen/strategy_component_strategy_data_Source_js_bundle.js'))


# component painter sketchpad graphics bundled js
assets.register('strategy_component_painter_sketchpad_graphics_js_bundle', Bundle(
    "app/Strategy2/scripts/components/Painter/Sketchpad/Graphics/gShape.js",
    "app/Strategy2/scripts/components/Painter/Sketchpad/Graphics/gArrow.js",
    "app/Strategy2/scripts/components/Painter/Sketchpad/Graphics/gStrategyShape.js",
    "app/Strategy2/scripts/components/Painter/Sketchpad/Graphics/gInputShape.js",
    "app/Strategy2/scripts/components/Painter/Sketchpad/Graphics/gOutputShape.js",

    #filters=app.config['ASSETS_JS_FILTER'],
    output='gen/strategy_component_painter_sketchpad_graphics_js_bundle.js'))

# component painter sketchpad bundled js
assets.register('strategy_component_painter_sketchpad_js_bundle', Bundle(
    assets['strategy_component_painter_sketchpad_graphics_js_bundle'],
    "app/Strategy2/scripts/components/Painter/Sketchpad/calculation.js",
    "app/Strategy2/scripts/components/Painter/Sketchpad/sketchpad.js",

    #filters=app.config['ASSETS_JS_FILTER'],
    output='gen/strategy_component_painter_sketchpad_js_bundle.js'))

# component sketchpad bundled js
assets.register('strategy_component_painter_js_bundle', Bundle(
    "app/Strategy2/scripts/components/Painter/Toolbar/toolbar.js",
    assets['strategy_component_painter_sketchpad_js_bundle'],

    "app/Strategy2/scripts/components/Painter/painterContainer.js",
    "app/Strategy2/scripts/components/Painter/painterReducer.js",
    "app/Strategy2/scripts/components/Painter/painter.js",

    output='gen/strategy_component_painter_js_bundle.js'))

# component strategy config panel bundled js
assets.register('strategy_component_config_panel_js_bundle', Bundle(
    "scripts/lib/codemirror/mode/python/python.js",

    "app/Strategy2/scripts/components/ModuleConfigPanel/Python/python.js",
    "app/Strategy2/scripts/components/ModuleConfigPanel/moduleConfigPanel.js",

    output='gen/strategy_component_config_panel_js_bundle.js'))

# strategy bundled js
assets.register('strategy_js_bundle', Bundle(
    # thirdparty lib
    assets['strategy_thirdparty_lib_js_bundle'],
    # beop lib
    assets['strategy_beop_lib_js_bundle'],

    # strategy core
    "app/Strategy2/scripts/core/createModel.js",
    "app/Strategy2/scripts/core/event.js",
    "app/Strategy2/scripts/core/container.js",
    "app/Strategy2/scripts/core/constants.js",
    "app/Strategy2/scripts/core/createDispatch.js",

    # public components
    "app/Strategy2/scripts/components/Layout/layout.js",

    # app config
    "app/Strategy2/scripts/appConfig.js",

    # strategy modals
    "app/Strategy2/scripts/components/Painter/Toolbar/batchConfigModal.js",
    "app/Strategy2/scripts/components/Painter/Toolbar/debugModal.js",

    # strategy components
    assets['strategy_component_variable_panel_js_bundle'],
    "app/Strategy2/scripts/components/EquipTree/equipTree.js",
    "app/Strategy2/scripts/components/StrategyTable/strategyTable.js",
    "app/Strategy2/scripts/components/PropPanel/propPanel.js",
    "app/Strategy2/scripts/components/RulePanel/RulePanel.js",
    "app/Strategy2/scripts/components/ModulePropPanel/modulePropPanel.js",
    assets['strategy_component_strategy_data_Source_js_bundle'],
    assets['strategy_component_config_panel_js_bundle'],
    assets['strategy_component_painter_js_bundle'],

    # pages
    "app/Strategy2/scripts/components/App/appContainer.js",
    "app/Strategy2/scripts/components/App/appReducer.js",
    "app/Strategy2/scripts/components/App/app.js",

    "app/Strategy2/scripts/index.js",

    filters=filter_with_babel,
    output='gen/strategy_js_bundle.js'))

# strategy bundled css
assets.register('strategy_css_bundle', Bundle(
    # third-party library
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',
    'app/WebFactory/scripts/lib/dockspawn/css/dock-manager.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',
    "scripts/lib/codemirror/lib/codemirror.css",
    'scripts/lib/beopNotification/infoBox.css',

    # our web styles
    'app/Strategy2/themes/default/css/login.css',
    'app/Strategy2/themes/default/css/main.css',
    'app/Strategy2/themes/default/css/components.css',
    'app/Strategy2/themes/default/css/monokai.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/strategy_css_bundle.css'))

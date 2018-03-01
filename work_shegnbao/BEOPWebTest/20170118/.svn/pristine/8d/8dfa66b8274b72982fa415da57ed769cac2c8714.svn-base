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

    "app/Strategy/scripts/lib/Konva/Konva-custom.min.js",
    "app/Strategy/scripts/lib/inferno/inferno.js",
    "app/Strategy/scripts/lib/inferno/inferno-hyperscript.min.js",

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
    "app/Strategy/scripts/util/mergeDiff.js",

    #filters=app.config['ASSETS_JS_FILTER'],
    output='gen/strategy_beop_lib_js_bundle.js'))

# component EquipTree bundled js
assets.register('strategy_component_equip_tree_js_bundle', Bundle(
    "app/Strategy/scripts/components/EquipTree/equipTree.js",

    output='gen/strategy_component_equip_tree_js_bundle.js'))

# component VariablePanel bundled js
assets.register('strategy_component_variable_panel_js_bundle', Bundle(
    "app/Strategy/scripts/components/VariablePanel/variablePanel.js",

    output='gen/strategy_component_variable_panel_js_bundle.js'))

# component StrategyTable bundled js
assets.register('strategy_component_strategy_table_js_bundle', Bundle(
    "app/Strategy/scripts/components/StrategyTable/strategyTable.js",

    output='gen/strategy_component_strategy_table_js_bundle.js'))

# component PropPanel bundled js
assets.register('strategy_component_prop_panel_js_bundle', Bundle(
    "app/Strategy/scripts/components/PropPanel/actions.js",
    "app/Strategy/scripts/components/PropPanel/view.js",
    "app/Strategy/scripts/components/PropPanel/state.js",
    "app/Strategy/scripts/components/PropPanel/index.js",

    output='gen/strategy_component_prop_panel_js_bundle.js'))

# component strategy tpl tree bundled js
assets.register('strategy_component_strategy_tpl_Tree_js_bundle', Bundle(
    "app/Strategy/scripts/components/StrategyTplTree/actions.js",
    "app/Strategy/scripts/components/StrategyTplTree/view.js",
    "app/Strategy/scripts/components/StrategyTplTree/state.js",
    "app/Strategy/scripts/components/StrategyTplTree/index.js",

    output='gen/strategy_component_strategy_tpl_Tree_js_bundle.js'))

# component strategy data source bundled js
assets.register('strategy_component_strategy_data_Source_js_bundle', Bundle(
    "scripts/observer/widgets/dataSource.js",
    "scripts/iot/hierFilter.js",

    "app/Strategy/scripts/components/DataSourcePanel/actions.js",
    "app/Strategy/scripts/components/DataSourcePanel/view.js",
    "app/Strategy/scripts/components/DataSourcePanel/state.js",
    "app/Strategy/scripts/components/DataSourcePanel/index.js",

    output='gen/strategy_component_strategy_data_Source_js_bundle.js'))


# component painter toolbar bundled js
assets.register('strategy_component_painter_toolbar_js_bundle', Bundle(
    "app/Strategy/scripts/components/Painter/Toolbar/state.js",
    "app/Strategy/scripts/components/Painter/Toolbar/view.js",
    "app/Strategy/scripts/components/Painter/Toolbar/actions.js",
    "app/Strategy/scripts/components/Painter/Toolbar/index.js",

    #filters=app.config['ASSETS_JS_FILTER'],
    output='gen/strategy_component_painter_toolbar_js_bundle.js'))

# component painter sketchpad graphics bundled js
assets.register('strategy_component_painter_sketchpad_graphics_js_bundle', Bundle(
    "app/Strategy/scripts/components/Painter/Sketchpad/Graphics/gShape.js",
    "app/Strategy/scripts/components/Painter/Sketchpad/Graphics/gArrow.js",
    "app/Strategy/scripts/components/Painter/Sketchpad/Graphics/gStrategyShape.js",
    "app/Strategy/scripts/components/Painter/Sketchpad/Graphics/gInputShape.js",
    "app/Strategy/scripts/components/Painter/Sketchpad/Graphics/gOutputShape.js",

    #filters=app.config['ASSETS_JS_FILTER'],
    output='gen/strategy_component_painter_sketchpad_graphics_js_bundle.js'))

# component painter sketchpad bundled js
assets.register('strategy_component_painter_sketchpad_js_bundle', Bundle(
    assets['strategy_component_painter_sketchpad_graphics_js_bundle'],
    "app/Strategy/scripts/components/Painter/Sketchpad/sketchpad.js",
    "app/Strategy/scripts/components/Painter/Sketchpad/state.js",
    "app/Strategy/scripts/components/Painter/Sketchpad/view.js",
    "app/Strategy/scripts/components/Painter/Sketchpad/actions.js",
    "app/Strategy/scripts/components/Painter/Sketchpad/index.js",

    #filters=app.config['ASSETS_JS_FILTER'],
    output='gen/strategy_component_painter_sketchpad_js_bundle.js'))

# component sketchpad bundled js
assets.register('strategy_component_painter_js_bundle', Bundle(
    assets['strategy_component_painter_toolbar_js_bundle'],
    assets['strategy_component_painter_sketchpad_js_bundle'],
    "app/Strategy/scripts/components/Painter/index.js",

    output='gen/strategy_component_painter_js_bundle.js'))

# component app bundled js
assets.register('strategy_component_app_js_bundle', Bundle(
    "app/Strategy/scripts/components/App/actions.js",
    "app/Strategy/scripts/components/App/index.js",

    output='gen/strategy_component_app_js_bundle.js'))

# component strategy config panel bundled js
assets.register('strategy_component_config_panel_js_bundle', Bundle(
    "scripts/lib/codemirror/lib/codemirror.js",
    "scripts/lib/codemirror/mode/python/python.js",

    "app/Strategy/scripts/components/ModuleConfigPanel/Python/python.js",
    "app/Strategy/scripts/components/ModuleConfigPanel/moduleConfigPanel.js",

    output='gen/strategy_component_config_panel_js_bundle.js'))

# strategy bundled js
assets.register('strategy_js_bundle', Bundle(
    # thirdparty lib
    assets['strategy_thirdparty_lib_js_bundle'],
    # beop lib
    assets['strategy_beop_lib_js_bundle'],

    # strategy core
    "app/Strategy/scripts/core/model.js",
    "app/Strategy/scripts/core/event.js",

    # strategy util
    "app/Strategy/scripts/util/layoutBuilder.js",

    # app config
    "app/Strategy/scripts/appConfig.js",

    # strategy components
    assets['strategy_component_variable_panel_js_bundle'],
    assets['strategy_component_equip_tree_js_bundle'],
    assets['strategy_component_strategy_table_js_bundle'],
    assets['strategy_component_prop_panel_js_bundle'],
    assets['strategy_component_strategy_tpl_Tree_js_bundle'],
    assets['strategy_component_strategy_data_Source_js_bundle'],
    assets['strategy_component_painter_js_bundle'],
    assets['strategy_component_config_panel_js_bundle'],
    assets['strategy_component_app_js_bundle'],

    "app/Strategy/scripts/index.js",

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
    'app/Strategy/themes/default/css/login.css',
    'app/Strategy/themes/default/css/main.css',
    'app/Strategy/themes/default/css/monokai.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/strategy_css_bundle.css'))

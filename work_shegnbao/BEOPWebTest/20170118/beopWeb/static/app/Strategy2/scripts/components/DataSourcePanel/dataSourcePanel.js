;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../core/model.js',
            '../core/Event.js',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../core/model.js'),
            require('../core/Event.js'),
            require('React')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.core.Event'),
            namespace('React'),
            namespace('beop.strategy.core.constants')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    Model,
    Event,
    React,
    constants
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    var actions = {
        dispatch: null
    };

    // dataSource 组件包裹类
    class Datasource extends React.Component {

        refDefine(name) {
            var refs = this.refs = this.refs || {};

            return function (dom) {
                refs[name] = dom;
            };
        }

        componentDidMount() {
            var _this = this;
            this.store = {};
            window.ElScreenContainer = this.refs.domWrap;
            this.arrColor = ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700", "#6699FF", "#ff6666", "#3cb371", "#b8860b", "#30e0e0"];
            var promise = $.Deferred();
            if (!AppConfig.datasource) {
            // 如果没有预加载，则先去加载数据，再做显示
                Spinner.spin(this.refs.domWrap);
                WebAPI.get('/analysis/datasource/getDsItemInfo/' + AppConfig.userId + '/null').done(function (result) {
                    AppConfig.datasource = new DataSource({
                        store: {
                            group: result
                        }
                    });
                    promise.resolve();
                });
            } else {
                promise.resolve();
            }
            promise.done(function(){
                _this.store.group = AppConfig.datasource.m_parent.store.group;
                _this.paneDatasource = AppConfig.datasource = new DataSource(_this);
                _this.paneDatasource.show();
            })
        }

        shouldComponentUpdate() {
            // 交由 jQuery 控件处理内部状态更新
            return false;
        }

        render() {
            return(
                h('#dataSrcContain', {
                    className: "gray-scrollbar white-skin",
                    style: {
                        height: '100%'
                    },
                    ref: this.refDefine('domWrap')
                })
            )
        }
    }

    // 视图辅助方法
    var theme = {

    };
    
    function DataSourcePanel(props, context) {
        actions.dispatch = context.dispatch;

        return (
            h('#dataSourcePanel', {
                style: {
                    width: '100%',
                    height: '100%'
                }
            },[
                h(Datasource)
            ])
        );
    }

    exports.DataSourcePanel = DataSourcePanel;
}));
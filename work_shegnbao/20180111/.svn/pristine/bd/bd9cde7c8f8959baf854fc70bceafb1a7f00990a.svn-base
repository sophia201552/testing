;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React')
        );
    } else {
        factory(
            root,
            namespace('React')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React
) {

    var h = React.h;
    var linkEvent = React.linkEvent;
    var $dom = undefined;
    var lastDomId = undefined;
    // dataSource 组件包裹类
    class Datasource extends React.Component {

        refDefine(name) {
            var elements = this.elements = this.elements || {};
            return function (dom) {
                elements[name] = dom;
            };
        }

        componentDidMount() {
            var _this = this;
            this.store = {};
            window.ElScreenContainer = this.elements.domWrap;
            this.arrColor = ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700", "#6699FF", "#ff6666", "#3cb371", "#b8860b", "#30e0e0"];
            if (!AppConfig.datasource) {
            // 如果没有预加载，则先去加载数据，再做显示
                Spinner.spin(this.elements.domWrap);
                WebAPI.get('/analysis/datasource/getDsItemInfo/' + AppConfig.userId + '/null').done(function (result) {
                    AppConfig.datasource = new DataSource({
                        store: {
                            group: result
                        }
                    });
                    _this.store.group = AppConfig.datasource.m_parent.store.group;
                    _this.paneDatasource = AppConfig.datasource = new DataSource(_this);
                    _this.paneDatasource.show();
                    $dom = $(_this.elements.domWrap);
                    lastDomId = $dom.closest('.painterViewActive')[0] && $dom.closest('.painterViewActive')[0].id || '';
                });
            }else{
                $(this.elements.domWrap).append($dom.children().detach());
                $dom = $(this.elements.domWrap);
                lastDomId = $dom.closest('.painterViewActive')[0] && $dom.closest('.painterViewActive')[0].id || '';
            }
        }

        componentWillReceiveProps(nextProps) {
            let $domWrap = $(this.elements.domWrap);
            let $painterViewActive = $domWrap.closest('.painterViewActive');
            if(nextProps.isDetach && $painterViewActive.length>0 && (lastDomId != $painterViewActive[0].id)){
                $domWrap.append($dom.children().detach());
                $dom = $domWrap;
                lastDomId = $painterViewActive[0].id;
            }
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
    
    function DataSourcePanel(props, context) {
        const {isDetach} = props;
        return (
            h('#dataSourcePanel', {
                style: {
                    width: '100%',
                    height: '100%'
                }
            },[
                h(Datasource,{isDetach})
            ])
        );
    }

    exports.DataSourcePanel = DataSourcePanel;
}));
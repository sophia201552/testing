;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd'),
            namespace('beop.strategy.containers.StrategyNav'),
            namespace('beop.strategy.containers.StrategyTable'),
            namespace('beop.strategy.containers.EquipTree'),
            namespace('beop.strategy.containers.PropPanel')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    StrategyNav,
    StrategyTable,
    EquipTree,
    PropPanel
) {

    var h = React.h;

    const Layout = antd.Layout;
    const Tabs = antd.Tabs;
    const { TabPane } = Tabs;
    const { Header, Sider, Content } = Layout; 

    exports.App = function () {
        return (
            h(Layout, {
                id: 'container'
            }, [
                h(Header,{
                    id: 'headerNav'
                },[
                    h(StrategyNav)
                ]),
                h(Layout,{
                    id: 'layoutContainer'
                },[
                    h(Sider, {
                        id: 'leftSider',
                        width: 300,
                        children: [
                            h(EquipTree)
                        ]
                    }),
                    h(Content, {
                        style: {
                            padding: '0 5px'
                        },
                    }, [
                        h(StrategyTable)
                    ]),
                    h(Sider, {
                        id: 'rightSider',
                        width: 350,
                        children: [
                            h(Tabs, {
                                type: 'card',
                                tabPosition: 'bottom',
                                animated: false
                            }, [
                                h(TabPane, {
                                    tab: I18n.resource.app.PROPERTY,
                                    key: '1'
                                }, [h(PropPanel)])
                            ])
                        ]
                    })
                ])
            ])
        ); // end of return
    };
}));
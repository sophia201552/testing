;(function(root, factory) {
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
            namespace('beop.strategy.containers.FaultInfo')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    FaultInfo
) {

    var h = React.h;

    const Layout = antd.Layout;
    const Tabs = antd.Tabs;
    const { TabPane } = Tabs;
    const { Sider, Content } = Layout; 

    exports.FaultManage = function () {
        return (
            h(Layout, {
                id: 'container',
                style: {width: '100%', height: '100%'}
            }, [
                h(FaultInfo)
            ])
        ); 
    };
}));
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
            namespace('React'),
            namespace('antd'),
            namespace('beop.strategy.components.TemplateTree')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    TemplateTree
) {
    var h = React.h;
    function RulePanel(props, context) {
        return (
            h('div', {
                id: 'RulePanel',
                style: { width: '100%', height: '100%' }
            },[
                h('div',{
                    className: "strategyTplTreeContent"
                },[
                    h(TemplateTree,{
                        draggable: true,
                        onlyGroup: false,
                        isSearchInput: true,
                        defaultSelected: false
                    })
                ])
            ])
        );
    }

    exports.RulePanel = RulePanel;
}));
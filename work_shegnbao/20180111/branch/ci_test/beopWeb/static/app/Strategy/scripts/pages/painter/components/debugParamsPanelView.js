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
            namespace('beop.strategy.common'),
            namespace('beop.strategy.enumerators'),
            namespace('beop.strategy.components.ParamsTree')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    commonUtil,
    enumerators,
    ParamsTree
) {
    var h = React.h;

    const { Layout } = antd;
    const { Content } = Layout;

    exports.DebugParamsPanel = function(props) {
        const {
            value,
            modules,
            selectedIds,
            selectedValueId,
            handleSelect,
            selectedId,
        } = props;
        let id = selectedId?selectedId:selectedValueId;
        return (
            h('div',{
                id: 'paramsTreeWrap',
                className:'gray-scrollbar',
                style:{
                    overflowY:'auto',
                    height:'100%'
                }
            },[
                h(ParamsTree, {
                    value: value,
                    modules: modules,
                    selectedValueId:id,
                    handleSelect: handleSelect
                })
            ])
        );
    };
}));
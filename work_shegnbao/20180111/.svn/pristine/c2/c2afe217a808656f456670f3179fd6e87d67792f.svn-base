;
(function(root, factory) {
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
            namespace('ReactRedux'),
            namespace('beop.strategy.components.modals.ParamsConfigModal')
        );
    }
}(namespace('beop.strategy.containers.modals'), function(
    exports,
    ReactRedux,
    ParamsConfigModal
) {
    var mapDispatchToProps = function(dispatch) {
        var actions = namespace('beop.strategy.modules.modals.ParamsConfigModal.actions');

        return {
            onCancel: function () {
                return dispatch(actions.hideModal());
            },
            save: function (data) {
                return dispatch(actions.save(data))
            },
            downloadExcel: function(dataObj){
                const {name,nameMap,values} = dataObj;
                let data = [];
                values.forEach(v=>{
                    let vName = v.name;
                    let modules = v.list;
                    for(let moduleId in modules){
                        let mName = nameMap[moduleId];
                        let inputs = modules[moduleId];
                        for(let inputId in inputs){
                            let iName = nameMap[inputId];
                            data.push([vName,mName,iName,inputs[inputId]]);
                        }
                    }
                });
                let postData = {
                    "head": ["参数组名称", "模块名称"],
                    "data": data,
                    'projId': AppConfig.projectId,
                    'type': 1
                };
                WebAPI.post('/logistics/export/excel/3', postData).done(result=>{
                    var aTag = document.createElement('a');
                    aTag.download = `${name}参数配置.xls`
                    aTag.href = result;
                    document.body.appendChild(aTag);
                    aTag.onclick = function() {
                        document.body.removeChild(aTag)
                    }
                    aTag.click();
                }); 
            }
        };
    };

    var mapStateToProps = function(state) {
        return Object.assign({
            visible: state.modal.paramsConfigModal.visible,
            strategy: state.sketchpad.strategy,
            modules: state.sketchpad.modules,
        }, state.modal.paramsConfigModal.props);
    };

    exports.ParamsConfigModal = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ParamsConfigModal);
}));
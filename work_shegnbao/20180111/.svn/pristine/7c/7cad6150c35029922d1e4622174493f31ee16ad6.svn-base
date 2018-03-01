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
            namespace('ReactRedux'),
            namespace('beop.strategy.common'),
            namespace('beop.strategy.components.FaultInfo')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    commonUtil,
    FaultInfo
) {
    var mapDispatchToProps  = function (dispatch) {
        var actions = namespace('beop.strategy.modules.FaultInfo.actions');

        return {
            updateTable: function (obj={}) {
                dispatch(actions.updateTable(obj));
            },
            updateSelected: function(obj={}){
                dispatch(actions.updateSelected(obj));
                dispatch(actions.updateTable({
                    pageNum: 1
                }));
            }
        };
    }

    var mapStateToProps = function (state) {
        return {
            searchKey: state.faultInfo.searchKey,
            classNameArr: state.faultInfo.classNameArr,
            consequencesNameArr: state.faultInfo.consequencesNameArr,
            gradeNameArr: state.faultInfo.gradeNameArr,
            classNameCount: state.faultInfo.classNameCount,
            consequencesCount: state.faultInfo.consequencesCount,
            gradeCount: state.faultInfo.gradeCount,
            selectedClassName: state.faultInfo.selectedClassName,
            selectedGrade: state.faultInfo.selectedGrade,
            selectedConsequence: state.faultInfo.selectedConsequence,
            items: state.faultInfo.items,
            page: state.faultInfo.page,
            totalNum: state.faultInfo.totalNum,
            isFromPainter: state.faultInfo.isFromPainter
        };
    }

    exports.FaultInfo = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FaultInfo);
}));
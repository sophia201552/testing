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
             selectItem: function(data, e) {
                dispatch(actions.selectItem(data.selectName, data.categoryName, data.checkedStatus));
            },
            changeSearchKey: function(evt) {
                dispatch(actions.changeSearchKey(evt.currentTarget.value));
             },
            changePageNum: function(val) {
                dispatch(actions.changePageNum(val));
            },
            showMore: function () {
                dispatch(actions.showMore());
            }
        };
    }

    var mapStateToProps = function (state) {
        return {
            searchKey: state.faultInfo.searchKey,
            classNameArr: state.faultInfo.classNameArr,
            selectedClassName: state.faultInfo.selectedClassName,
            selectedGrade: state.faultInfo.selectedGrade,
            selectedConsequence: state.faultInfo.selectedConsequence,
            items: state.faultInfo.items,
            page: state.faultInfo.page,
            totalNum: state.faultInfo.totalNum,
            isShowMore: state.faultInfo.isShowMore
        };
    }

    exports.FaultInfo = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FaultInfo);
}));
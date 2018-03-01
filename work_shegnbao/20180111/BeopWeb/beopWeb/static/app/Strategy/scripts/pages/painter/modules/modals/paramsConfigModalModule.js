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
            namespace('antd'),
            namespace('ReactRedux'),
            namespace('beop.strategy.common')
        );
    }
}(namespace('beop.strategy.modules.modals.ParamsConfigModal'), function(
    exports,
    antd,
    ReactRedux,
    commonUtil
) {

    const deepClone = $.extend.bind($, true);
    const { message } = antd;

    // ------------------------------------
    // Constants
    // ------------------------------------
    const SHOW_MODAL = 'ParamsConfigModal.SHOW_MODAL';
    const HIDE_MODAL = 'ParamsConfigModal.HIDE_MODAL';

    // ------------------------------------
    // Actions
    // ------------------------------------
    // 显示模态框
    const showModal = function(props) {
        return {
            type: SHOW_MODAL,
            modal: {
                visible: true,
                props: props || initialState.props
            }
        };
    };

    // 隐藏模态框
    const hideModal = function() {
        return {
            type: HIDE_MODAL
        };
    };

    const save = function (data) {
        return function (dispatch, getState) {
            var state = getState().sketchpad;
            var selectedValueId = getState().equipTree.selectedValueId;
            data = commonUtil.getSyncValue(state.modules, data);

            return WebAPI.post('/strategy/item/save', {
                userId: AppConfig.userId,
                ids: [state.strategy['_id']],
                data: {
                    'value': data,
                    'option.needSyncFaultTable': 1
                },
                projId: AppConfig.projectId
            }).done(
                (rs) => {
                    if (rs.status === 'OK') {
                        message.success(I18n.resource.message.PARAMETER_CONFIGURATION_SUCCESS, 2.5);
                        dispatch( namespace('beop.strategy.modules.Sketchpad.actions').saveValue(data) );
                        let equipTreeActions = namespace('beop.strategy.modules.EquipTree.actions');
                        if(data.length === 0){//清空selectedValueId
                            dispatch( equipTreeActions.changeSelectedValueId(undefined) );
                        }else if(data.map(o=>o._id).indexOf(selectedValueId)<0){
                            dispatch( equipTreeActions.changeSelectedValueId(data[0]._id) );
                        }
                        dispatch( equipTreeActions.updateItems([state.strategy['_id']], { //同步equipTree
                            value:data
                        }) );
                        dispatch( hideModal() );
                    } else {
                        message.error(rs.msg, 2.5);
                    }
                }
            );
        };
    };

    // 需要暴露给外部调用的 action
    exports.actions = {
        showModal,
        hideModal,
        save
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [SHOW_MODAL]: (state, action) => {
            return Object.assign({}, state, action.modal);
        },
        [HIDE_MODAL]: () => {
            return initialState;
        }
    }

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        visible: false,
        props: {}
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.constants'),
            namespace('React')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports,constants, React) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    var actions = {
        dispatch: null,
        saveConfig:function(id){
            var data = {'value':[]};
            var tables = $('#batchConfigModal').find('.modal-body').find('table');
            tables.each(function(){
                var trs = $(this).find('tbody tr');
                var obj = {};
                trs.each(function(){
                    var key = $(this).find('.name').text();
                    var val = $(this).find('.value').val();
                    obj[key] = val;
                });
                data.value.push(obj)
            });
            actions.dispatch({
                type: constants.modal.CHANGE_STRATEGY_VALUE,
                modalType: 'BatchConfigModal',
                props: data.value
            });
        },
        closeModal: function () {
            actions.dispatch({
                type: constants.modal.HIDE_MODAL,
                modalType: null,
                props: {}
            });
        }
    };

    var theme = {
        render:function(data){
            var _this = this;
            if(data){
                return (
                    h('div',{
                        className:"gray-scrollbar",
                        style:{
                            'max-height':'300px',
                            overflow:'auto'
                        }
                    },  data.map(function(item){
                            if(!$.isEmptyObject(item)){
                                return theme.createTable.call(_this,item);
                            }
                        })
                    )
                )
            }
        },
        createTable:function (data){
            var _this = this;
            return (
                h('table.configTable',{},[
                    h('thead',{},[
                        h('tr',{},[
                            h('th', {
                                style:{
                                    width:"25%"
                                }
                            }, ['参数名']),
                            h('th', {}, ['参数值']),
                            h('th.addMinusBtn', {}, [
                                h('span.tableAddMinusBtn.add', {
                                    className:"glyphicon glyphicon-plus"
                                }),
                                h('span', {},['/']),
                                h('span.tableAddMinusBtn.minus', {
                                    className:"glyphicon glyphicon-minus"
                                })
                            ])
                        ])
                    ]),
                    h('tbody',{}, Object.keys(data).map(function(key){
                            return theme.createTr.call(_this,key,data[key]);
                        })
                    )
                ])
            )
        },
        createTr:function(name,val) {
            return (
                h('tr', {}, [
                    h('td', {}, [
                        h('label', {
                            className:"name"
                        },[name])
                    ]),
                    h('td', {}, [
                        h('input', {
                            className:"form-control value",
                            value: val,
                            onChange: linkEvent(name, this.onChangeHandler)
                        })
                    ])
                ])
            )
        }
    };

    class BatchConfigModal extends React.Component{
        constructor(props, context) {
            super(props, context);

            actions.dispatch = this.context.dispatch;

            this.state = {
                values: this.props.children
            };
            this.onChangeHandler = this.onChangeHandler.bind(this);
        }

        onChangeHandler(key, e) {
            var items = this.state.values;
            var value = e.currentTarget.value;

            items.forEach(function (row) {
                if (key in row) {
                    row[key] = value;
                }
            });

            this.setState({
                items: items
            });
        }

        componentDidMount(){
            var content = $('#batchConfigModal').find('.modal-body');
            content.on('click','table .tableAddMinusBtn',this.tableAddMinusBtn);
        }
        tableAddMinusBtn(e){
            var curDom = $(e.target);
            var curTable = curDom.closest('table');
            if(curDom.hasClass('add')){
                var cloneTable = curTable.clone();
                cloneTable.find('tbody tr input').each(function(){
                    $(this).val('')
                });
                curTable.after(cloneTable);
            } else {
                curTable.remove();
            }
        }
        componentWillUpdate() {
            return false;
        }

        render() {
            return (
                h('div',{
                    className:"modal",
                    id:"batchConfigModal"
                },[
                    h('div.modal-dialog',{},[
                        h('div.modal-content',{},[
                            h('div.modal-header',{},[
                                h('button',{
                                    className:"close",
                                    onClick: actions.closeModal
                                },[
                                    h('span',["×"])
                                ]),
                                h('h4.modal-title',[
                                    "批量配置参数"
                                ])
                            ]),
                            h('div.modal-body',{},[
                                theme.render.call(this,this.state.values)
                            ]),
                            h('div.modal-footer',{},[
                                h('button',{
                                    className:"btn btn-default defHover",
                                    onClick: actions.closeModal
                                },["关闭"]),
                                h('button',{
                                    className:"btn btn-primary defHover",
                                    onClick: React.linkEvent(this.state._id, actions.saveConfig)
                                },["保存"])
                            ])
                        ])
                    ])
                ])
            );
        }
    }

    exports.BatchConfigModal = BatchConfigModal;
}));
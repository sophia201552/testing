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
            namespace('ReactCodeMirror'),
            namespace('beop.strategy.components.modals.InputParamModal'),
            namespace('beop.strategy.components.modals.OutputParamModal'),
            namespace('beop.strategy.enumerators'),
            namespace('beop.common.components.CodeEditor')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    ReactCodeMirror,
    InputParamModal,
    OutputParamModal,
    enums,
    CodeEditor
) {
    var h = React.h;
    var linkEvent = React.linkEvent;

    const { Layout, Form, Tag, Button, Table,Modal } = antd;
    const { Content, Header } = Layout;

    class HistoricalTableModal extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        componentDidMount() {
            this.setState({
                visible: this.props.visible
            });
        }
        //onCancel(){
        //    this.setState({
        //        visible: false
        //    })
        //}

        render() {
            
            const {
                data,
                visible,
                onCancel
            } = this.props;
            let dataObj = {
                list: [],
                timeShaft: []
            };
            if(data){
                try{
                    dataObj = JSON.parse(data);
                }catch(e){
                    console.log(e);
                }
            }

            const columns = (function (data) {
                var arr = [{
                    title: I18n.resource.modal.TIME,
                    dataIndex: 'time',
                    key: 'time',
                    width: 140,
                    fixed: 'left'
                }];
                var len = data.list.length;
                data.list.forEach(function(row,i){
                    var title = row.dsItemId.split("|");
                    var item = {
                        title: title.length > 1 ? title[1] : title[0],
                        dataIndex: 'point'+i,
                        key: 'point'+i,
                        //width: 140
                    };
                    if(i < len - 1){
                        item["width"] = 140
                    }
                    arr.push(item);
                });
                return arr;
            } (dataObj));

            const max_scrollX = (function(data) {
                return 140 + data.list.length * 140
            } (dataObj));

            const dataSource = (function (data) {
                var arr = [];
                data.timeShaft.forEach(function(row,i){
                    arr.push({
                        key:(i+1).toString(),
                        time: timeFormat(row,'yyyy-mm-dd hh:ii')
                    })
                });
                data.list.forEach(function(row,i){
                    row.data.forEach(function (item,j){
                        arr[j]["point" + i] = item.toFixed(2);
                    })
                });
                return arr;
            } (dataObj));

            return (
                h(Modal,{
                    visible: visible,
                    maskClosable:false,
                    width: '90%',
                    title: I18n.resource.modal.HISTORICAL_VALUE,
                    footer:null,
                    onCancel:onCancel,
                    wrapClassName: "vertical-center-modal"
                },[
                    h(Table,{
                        pagination:false,
                        bordered:true,
                        scroll:{
                            x:max_scrollX,
                            y:550
                        },
                        size:"small",
                        dataSource:dataSource,
                        columns:columns
                    })
                ])
            );
        }
    }

    exports.HistoricalTableModal = HistoricalTableModal;
}));
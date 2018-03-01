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
            namespace('React'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    enumerators
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    const { Form, Row, Col, Button, Input, Select, InputNumber, Slider, Icon, Modal, Switch, DatePicker } = antd;
    const FormItem = Form.Item;
    const InputGroup = Input.Group;
    const Option = Select.Option;

    var children = [];
    var theme = {
        propView: function(props) {
            const {data, changeProp, tagList, changeTagList} = props;
            if (data && !$.isEmptyObject(data)) {
                children = [];
                //公共
                if ('name' in data) {
                    children.push(
                        theme.createRow(I18n.resource.moduleProp.NAME, h(Input, {
                            type: 'text',
                            name: 'name',
                            value: data.name,
                            onChange: linkEvent('name', changeProp)
                        }))
                    );
                };
                var type = data.type;
                //不同类型的属性面板显示也不同
                switch (type) {
                    case enumerators.moduleTypes.PYTHON:
                        theme.configTag(data,changeProp, tagList, changeTagList);
                        theme.configTime(data, changeProp);
                        break;
                    case enumerators.moduleTypes.REMOTE_API:
                        children.push(
                            theme.createRow('Url:', h(Input, {
                                type: 'text',
                                name: 'url',
                                value: data.option.content.url === undefined ? '' : data.option.content.url,
                                onChange: linkEvent('option.content.url', changeProp)
                            }))
                        );
                        break;
                    case enumerators.moduleTypes.FORECAST:
                        theme.configTime(data, changeProp);
                        break;
                    case enumerators.moduleTypes.FUZZY_RULE:
                        theme.configTag(data,changeProp, tagList, changeTagList);
                        theme.configTime(data, changeProp);
                        theme.configHide(data, changeProp);
                        break;
                    case enumerators.moduleTypes.CORRELATION_ANALYSIS:
                        theme.configTime(data, changeProp);
                        break;
                    case enumerators.moduleTypes.INPUT://输入值的tag更新
                        theme.configTag(data,changeProp, tagList, changeTagList);
                        break;
                    case enumerators.moduleTypes.OUTPUT://输出值的tag更新
                        theme.configTag(data,changeProp, tagList, changeTagList);
                        break;
                    default:
                        break;
                }
                return h(Form, { style: { padding: '15px' } }, children);
            }
        },
        configTag: function(data, changeProp, tagList, changeTagList){
            if(data.option){
                let tags = [];
                tagList.forEach(group => {
                    tags = tags.concat(group.tags);
                });
                let tagNames = (()=>{
                    let t = tags.map(v=>v.name);
                    return t.sort((a, b)=>{
                        if (/^\d/.test(a) ^ /^\D/.test(b)) return a>b?1:(a==b?0:-1);
                        return a>b?-1:(a==b?0:1);
                    })
                })()
                let options = tagNames.map(tag=>(h(Option,{
                        value:tag
                    },[tag])));
                class DropSelect extends React.Component{
                    constructor(props, content) {
                        super(props, content);
                        this.state ={
                            tags:data.option.tags||[]
                        }
                    }
                    render() {
                        let tags = this.state.tags;
                        return h('div',{
                            className:'',
                            onDrop:(e)=>{
                                let tag = [];
                                let tagItemId = e.dataTransfer.getData('tagItemId'),
                                    tagGroupId = e.dataTransfer.getData('tagGroupId');
                                if(tagItemId){
                                    tag = JSON.parse(tagItemId).tag;
                                }
                                if(tagGroupId){
                                    tag = JSON.parse(tagGroupId).data[0].tag;
                                }
                                let shouldAddTags = [];
                                tag.forEach(v=>{
                                    if(tags.indexOf(v)<0){
                                        shouldAddTags.push(v);
                                    }
                                });
                                if(shouldAddTags.length>0){
                                    tagList.push({
                                        groupNm:'customAdd',
                                        tags: shouldAddTags.map(v=>({name:v}))
                                    });
                                    changeTagList(tagList);
                                }
                                let tempArr = tags.concat(tag);
                                tempArr = Array.from(new Set(tempArr));
                                this.setState({
                                    tags: tempArr
                                });
                                changeProp('option.tags', tempArr);
                            },
                            onDragOver:(e)=>{e.preventDefault()}
                        },[h(Select,{
                            // getPopupContainer:triggerNode => triggerNode.parentNode,
                            placeholder: I18n.resource.placeholder.SELECT_FILL_LABEL,
                            mode:"tags",
                            style:{ width: '100%', maxHeight:'100px' },
                            value: tags,
                            onChange: linkEvent('option.tags', changeProp),
                            dropdownClassName:'tagSelect'
                        },options)])
                    }
                } 
                children.push(
                    theme.createRow(I18n.resource.moduleProp.LABEL,h(DropSelect))
                );
            }
        },
        createRow: function(text, input) {
            return h(FormItem, {
                style: {
                    marginBottom: 0
                },
                label: text,
                labelCol: { span: 5 },
                wrapperCol: { span: 15 }
            }, [input]);
        },
        configTime: function(data, changeProp) {
            if (!data.option.timeRange) {
                data.option.timeRange = {
                    type: '',
                    option: {}
                }
            }
            var configTimeMode = data.option.timeRange.type,
                configTimeOption = data.option.timeRange.option,
                cycleDom, rangeDom, numberOfUnitDom, timeUnitDom, periodDom;
            children.push(
                theme.createRow(I18n.resource.moduleProp.PATTERN, h(Select, {
                    value: configTimeMode.toString(),
                    onChange: linkEvent('option.timeRange.type', changeProp)
                }, [
                    h(Option, { value: '' }, [I18n.resource.moduleProp.NULL]),
                    h(Option, { value: '0' }, [I18n.resource.moduleProp.RAPID_CONFIGURATION]),
                    h(Option, { value: '1' }, [I18n.resource.moduleProp.FIXED_CYCLE]),
                    h(Option, { value: '2' }, [I18n.resource.moduleProp.RECENT_CYCLE])
                ]))
            );
            switch (configTimeMode) {
                case '':
                    break;
                case 1:
                    if (configTimeOption === undefined) {
                        data.option.timeRange.option = {
                            "timeStart": "2017-01-01 00:00:00",
                            "timeEnd": "2017-01-02 00:00:00",
                            "timeFormat": 'm5',
                        }
                    }
                    cycleDom = theme.createRow(I18n.resource.moduleProp.SAMPLING_PERIOD, h(Select, {
                        name: 'timeFormat',
                        value: data.option.timeRange.option.timeFormat === undefined ? 'm5' : data.option.timeRange.option.timeFormat,
                        onChange: linkEvent('option.timeRange.option.timeFormat', changeProp)
                    }, [
                        h(Option, { value: 'm1' }, I18n.resource.moduleProp.ONE_MINUTE),
                        h(Option, { value: 'm5' }, I18n.resource.moduleProp.FIVE_MINUTES),
                        h(Option, { value: 'h1' }, I18n.resource.moduleProp.ONE_HOUR),
                        h(Option, { value: 'd1' }, I18n.resource.moduleProp.ONE_DAY),
                        h(Option, { value: 'M1' }, I18n.resource.moduleProp.ONE_MONTH)
                    ]));
                    timeStartDom = theme.createRow(I18n.resource.moduleProp.START_TIME,
                        h(DatePicker, {
                            placeholder: data.option.timeRange.option.timeStart === undefined ? moment().subtract('hours', 1).format('YYYY-MM-DD HH:mm:ss') : data.option.timeRange.option.timeStart,
                            showTime: true,
                            format: "YYYY-MM-DD HH:mm:00",
                            onChange: (date, dateStr) => changeProp('option.timeRange.option.timeStart', dateStr)
                        })
                    );
                    timeEndDom = theme.createRow(I18n.resource.moduleProp.END_TIME,
                        h(DatePicker, {
                            placeholder: data.option.timeRange.option.timeEnd === undefined ? moment().format('YYYY-MM-DD HH:mm:ss') : data.option.timeRange.option.timeEnd,
                            showTime: true,
                            format: "YYYY-MM-DD HH:mm:00",
                            onChange: (date, dateStr) => changeProp('option.timeRange.option.timeEnd', dateStr)
                        })
                    );
                    children.push(cycleDom);
                    children.push(timeStartDom);
                    children.push(timeEndDom);
                    break;
                case 2:
                    if (configTimeOption === undefined) {
                        data.option.timeRange.option = {
                            "timeFormat": 'm5',
                            "timeUnit": "hour",
                            "numberOfUnit": 1
                        }
                    }
                    cycleDom = theme.createRow(I18n.resource.moduleProp.SAMPLING_PERIOD, h(Select, {
                        name: 'timeFormat',
                        value: data.option.timeRange.option.timeFormat === undefined ? 'm5' : data.option.timeRange.option.timeFormat,
                        onChange: linkEvent('option.timeRange.option.timeFormat', changeProp)
                    }, [
                        h(Option, { value: 'm1' }, I18n.resource.moduleProp.ONE_MINUTE),
                        h(Option, { value: 'm5' }, I18n.resource.moduleProp.FIVE_MINUTES),
                        h(Option, { value: 'h1' }, I18n.resource.moduleProp.ONE_HOUR),
                        h(Option, { value: 'd1' }, I18n.resource.moduleProp.ONE_DAY),
                        h(Option, { value: 'M1' }, I18n.resource.moduleProp.ONE_MONTH)
                    ]));
                    numberOfUnitDom = theme.createRow(I18n.resource.moduleProp.NUMBER, h(Input, {
                        type: 'text',
                        name: 'numberOfUnit',
                        value: data.option.timeRange.option.numberOfUnit === undefined ? 1 : data.option.timeRange.option.numberOfUnit,
                        onChange: linkEvent('option.timeRange.option.numberOfUnit', changeProp)
                    }));
                    timeUnitDom = theme.createRow(I18n.resource.moduleProp.TIME_UNIT, h(Select, {
                        name: 'timeUnit',
                        value: data.option.timeRange.option.timeUnit === undefined ? '小时' : data.option.timeRange.option.timeUnit,
                        onChange: linkEvent('option.timeRange.option.timeUnit', changeProp)
                    }, [
                        h(Option, { value: 'hour' }, I18n.resource.moduleProp.HOUR),
                        h(Option, { value: 'day' }, I18n.resource.moduleProp.DAY),
                        h(Option, { value: 'month' }, I18n.resource.moduleProp.MONTH)
                    ]));
                    children.push(cycleDom);
                    children.push(numberOfUnitDom);
                    children.push(timeUnitDom);
                    break;
                default:
                    if (configTimeOption === undefined) {
                        data.option.timeRange.option = {
                            "period": "yesterday",
                        }
                    }
                    periodDom = theme.createRow(I18n.resource.moduleProp.TIME_PERIOD, h(Select, {
                        name: 'period',
                        value: data.option.timeRange.option.period === undefined ? 'yesterday' : data.option.timeRange.option.period,
                        onChange: linkEvent('option.timeRange.option.period', changeProp)
                    }, [
                        h(Option, { value: 'last24hours' }, I18n.resource.moduleProp.THE_PAST_24_HOURS),
                        h(Option, { value: 'yesterday' }, I18n.resource.moduleProp.YESTERDAY),
                        h(Option, { value: 'last7days' }, I18n.resource.moduleProp.THE_PAST_7_DAYS),
                        h(Option, { value: 'lastweek' }, I18n.resource.moduleProp.LAST_WEEK),
                        h(Option, { value: 'last12months' }, I18n.resource.moduleProp.THE_PAST_12_MONTHS)
                    ]));
                    children.push(periodDom);
                    break;
            }
        },
        configHide(data, changeProp) {
            if(data.option){
                let isHideFormula = data.option.isHideFormula==undefined?'show':data.option.isHideFormula;
                children.push(
                    theme.createRow(I18n.resource.moduleProp.FORMULA_OF_INPUT,h(Select,{
                        value: isHideFormula,
                        onChange: linkEvent('option.isHideFormula', changeProp)
                    },[
                        h(Option,{
                            value:"hide"
                        },[I18n.resource.moduleProp.HIDDEN]),
                        h(Option,{
                            value:"show"
                        },[I18n.resource.moduleProp.SHOW]),
                        
                    ]))
                );
            }
        }
    };

    function ModulePropPanel(props) {
        return props.data && !$.isEmptyObject(props.data) ?
            (
                h('div', {
                    id: 'modulePropPanel',
                    style: { width: '100%', height: '100%' }
                }, [
                    theme.propView(props)
                ])
            ) : null

    }

    exports.ModulePropPanel = ModulePropPanel;
}));
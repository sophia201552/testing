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
            namespace('antd'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel'), function(
    exports,
    React,
    antd,
    enums
) {

    const { Layout, Button, Input, Select, Row, Col, AutoComplete, Pagination } = antd;
    const { Content, Header, Footer, Sider } = Layout;
    const { Option } = Select;
    const InputGroup = Input.Group;
    var h = React.h;
    var linkEvent = React.linkEvent;

    const deepClone = $.extend.bind($, true);

    class RuleItemItem extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.names = this.props.names;
            this.terms = this.props.terms;
            this.index = this.props.index;
            this.state = {
                terms: this.terms[this.props.name] || [],
                continuity: this.props.continuity,
                name: this.props.name,
                judge: this.props.judge,
                term: this.props.term,
            }

            this.onContinuityChange = this.onContinuityChange.bind(this);
            this.onNameChange = this.onNameChange.bind(this);
            this.onJudgeChange = this.onJudgeChange.bind(this);
            this.onTermChange = this.onTermChange.bind(this);
            this.onContinuityBlur = this.onContinuityBlur.bind(this);
            this.onNameBlur = this.onNameBlur.bind(this);
            this.onJudgeBlur = this.onJudgeBlur.bind(this);
            this.onTermBlur = this.onTermBlur.bind(this);
            this.onRemove = this.onRemove.bind(this);
        }
        componentWillReceiveProps(props) {
            this.names = props.names;
            this.terms = props.terms;
            this.index = props.index;
            this.setState({
                terms: props.terms[props.name] || [],
                continuity: props.continuity,
                name: props.name,
                judge: props.judge,
                term: props.term,
            });
        }
        onContinuityChange(value) {
            let isNeed = true;
            if(value !== undefined){
                ['and','or'].forEach(it=>{
                    if(it.toUpperCase().indexOf(value.toUpperCase()) > -1){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 'continuity', value);
        }
        onNameChange(value) {
            let isNeed = true;
            if(value !== undefined){
                this.names.forEach(it=>{
                    if(it.toUpperCase().indexOf(value.toUpperCase()) > -1){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 'name', value);
            this.props.updateItem(this.index, 'term', value == undefined ? value : this.terms[value]?this.terms[value][0]:undefined);
        }
        onJudgeChange(value) {
            let isNeed = true;
            if(value !== undefined){
                ['is','is not'].forEach(it=>{
                    if(it.toUpperCase().indexOf(value.toUpperCase()) > -1){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 'judge', value);
        }
        onTermChange(value) {
            let isNeed = true;
            if(value !== undefined){
                this.state.terms.forEach(it=>{
                    if(it.toUpperCase().indexOf(value.toUpperCase()) > -1){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 'term', value);
        }
        onContinuityBlur(value) {
            let isNeed = true;
            if(value !== undefined){
                ['and','or'].forEach(it=>{
                    if(it.toUpperCase() == value.toUpperCase()){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 'continuity', value);
        }
        onNameBlur(value) {
            let isNeed = true;
            if(value !== undefined){
                this.names.forEach(it=>{
                    if(it.toUpperCase() == value.toUpperCase()){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 'name', value);
            // this.props.updateItem(this.index, 'term', value == undefined ? value : this.terms[value][0]);
        }
        onJudgeBlur(value) {
            let isNeed = true;
            if(value !== undefined){
                ['is','is not'].forEach(it=>{
                    if(it.toUpperCase() == value.toUpperCase()){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 'judge', value);
        }
        onTermBlur(value) {
            let isNeed = true;
            if(value !== undefined){
                this.state.terms.forEach(it=>{
                    if(it.toUpperCase() == value.toUpperCase()){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 'term', value);
        }
        onRemove() {
            this.props.removeItem(this.index);
        }
        createNameOptions() {
            let result = this.names.map((name) => (h(Option, {
                value: name
            }, [name])));
            if(result.length == 0){
                result = [h(Option, {value: 'Not Found', disabled:true}, ['Not Found'])];
            }
            return result;
        }
        createItemOptions() {
            let result = [];
            result = this.state.terms.map((term) => (h(Option, {
                value: term
            }, [term])));
            if(result.length == 0){
                result = [h(Option, {value: 'Not Found', disabled:true}, ['Not Found'])];
            }
            return result;
        }
        filterOption(inputValue, option){
            return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
        }
        componentDidUpdate() {
            let { continuity, name, judge, term } = this.state;
            let str = [continuity, name, judge, term].join(' ');
            this.props.update(this.index, str);
        }
        render() {
            var span = this.props.span;
            return (
                h(Col, { span: span, style: { margin: '4px 0' } }, [
                    h(Row, {}, [
                        h(Col, { offset: '1', span: '5' }, [
                            h(Select, { className: 'ruleAndOrSelect', defaultValue: this.state.continuity, value: this.state.continuity, onChange: this.onContinuityChange, style: { width: '100%', height: '56px' } }, [
                                h(Option, { value: 'and' }, ['And']),
                                h(Option, { value: 'or' }, ['Or'])
                            ])
                        ]),
                        h(Col, { span: '16', className: 'removeBtnWrap' }, [
                            h('div',{
                                className:'removeBtn glyphicon glyphicon-remove-sign',
                                style: {
                                    cursor: 'pointer',
                                    color: 'rgb(245, 106, 0)',
                                    fontSize: '12px'
                                },
                                onClick: this.onRemove
                            }),
                            h(AutoComplete, {className:'pointSelectItem', dataSource:{dataSource:this.state.terms}, value: this.state.name, allowClear:true, filterOption: this.filterOption, onChange: this.onNameChange, onBlur:this.onNameBlur, style: { width: '100%' } }, this.createNameOptions()),
                            h(Select, {className:'judgeSelectItem', defaultValue: this.state.judge, value: this.state.judge, onChange: this.onJudgeChange, style: { width: '35%' } }, [
                                h(Option, { value: 'is' }, ['Is']),
                                h(Option, { value: 'is not' }, ['Is not'])
                            ]),
                            h(AutoComplete, {className:'termSelectItem', dataSource:{dataSource:this.state.terms}, value: this.state.term, allowClear:true, filterOption: this.filterOption, onChange: this.onTermChange, onBlur:this.onTermBlur, style: { width: '65%' } }, this.createItemOptions())
                        ])
                    ])
                ])
            )
        }
    }

    class RuleItem extends React.Component {
        constructor(props, context) {
            super(props, context);
            var items = this.props.items,
                other = this.props.other;
            this.index = this.props.index,
                this.names = this.props.names;
            this.terms = this.props.terms;
            this.listName = this.props.listName;
            this.state = {
                items: items,
                terms: items[0]&&this.terms[items[0].name] || [],
                continuity: items[0]&&items[0].continuity,
                name: items[0]&&items[0].name,
                judge: items[0]&&items[0].judge,
                term: items[0]&&items[0].term,
                strArr: (function(items) {
                    var arr = [];
                    items.forEach((item) => {
                        let { continuity, name, judge, term } = item;
                        arr.push([continuity, name, judge, term].join(' '));
                    })
                    return arr;
                })(items),
                strArr2: (function(other) {
                    var arr = [];
                    other.forEach((item) => {
                        let { continuity, name, judge, term } = item;
                        arr.push([continuity, name, judge, term].join(' '));
                    })
                    return arr;
                })(other)
            }
            this.update = this.update.bind(this);
            this.addItem = this.addItem.bind(this);
            this.updateItem = this.updateItem.bind(this);
            this.removeItem = this.removeItem.bind(this);
            this.remove = this.remove.bind(this);
            this.onNameChange = this.onNameChange.bind(this);
            this.onJudgeChange = this.onJudgeChange.bind(this);
            this.onTermChange = this.onTermChange.bind(this);
            this.onNameBlur = this.onNameBlur.bind(this);
            this.onJudgeBlur = this.onJudgeBlur.bind(this);
            this.onTermBlur = this.onTermBlur.bind(this);
        }
        componentWillReceiveProps(props) {
            this.index = props.index;
            this.names = props.names;
            this.terms = props.terms;
            this.listName = props.listName;
            this.setState({
                items: props.items,
                terms: props.items[0]&&props.terms[props.items[0].name] || [],
                continuity: props.items[0]&&props.items[0].continuity,
                name: props.items[0]&&props.items[0].name,
                judge: props.items[0]&&props.items[0].judge,
                term: props.items[0]&&props.items[0].term,
                strArr: (function(items) {
                    var arr = [];
                    items.forEach((item) => {
                        let { continuity, name, judge, term } = item;
                        arr.push([continuity, name, judge, term].join(' '));
                    })
                    return arr;
                })(props.items),
                strArr2: (function(other) {
                    var arr = [];
                    other.forEach((item) => {
                        let { continuity, name, judge, term } = item;
                        arr.push([continuity, name, judge, term].join(' '));
                    })
                    return arr;
                })(props.other)
            });
        }
        addItem() {
            this.props.addItem(this.index, this.listName);
        }
        updateItem(index, name, value) {
            this.props.updateItem(this.index, index, name, value, this.listName);
        }
        removeItem(index) {
            this.props.removeItem(this.index, index, this.listName);
        }
        remove() {
            this.props.remove(this.index);
        }
        onNameChange(value) {
            let isNeed = true;
            if(value !== undefined){
                this.names.forEach(it=>{
                    if(it.toUpperCase().indexOf(value.toUpperCase()) > -1){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 0, 'name', value, this.listName);
            this.props.updateItem(this.index, 0, 'term', value == undefined ? value : this.terms[value]?this.terms[value][0]:undefined, this.listName);
        }
        onJudgeChange(value) {
            let isNeed = true;
            if(value !== undefined){
                ['is','is not'].forEach(it=>{
                    if(it.toUpperCase().indexOf(value.toUpperCase()) > -1){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 0, 'judge', value, this.listName);
        }
        onTermChange(value) {
            let isNeed = true;
            if(value !== undefined){
                this.state.terms.forEach(it=>{
                    if(it.toUpperCase().indexOf(value.toUpperCase()) > -1){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 0, 'term', value, this.listName);
        }
        onNameBlur(value) {
            let isNeed = true;
            if(value !== undefined){
                this.names.forEach(it=>{
                    if(it.toUpperCase() == value.toUpperCase()){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 0, 'name', value, this.listName);
            // this.props.updateItem(this.index, 0, 'term', value == undefined ? value : this.terms[value][0], this.listName);
        }
        onJudgeBlur(value) {
            let isNeed = true;
            if(value !== undefined){
                ['is','is not'].forEach(it=>{
                    if(it.toUpperCase() == value.toUpperCase()){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 0, 'judge', value, this.listName);
        }
        onTermBlur(value) {
            let isNeed = true;
            if(value !== undefined){
                this.state.terms.forEach(it=>{
                    if(it.toUpperCase() == value.toUpperCase()){
                        isNeed = false;
                    }
                });
            }
            
            if(isNeed){
                value = undefined;
            }
            this.props.updateItem(this.index, 0, 'term', value, this.listName);
        }
        createNameOptions() {
            let result = this.names.map((name) => (h(Option, {
                value: name
            }, [name])));
            if(result.length == 0){
                result = [h(Option, {value: 'Not Found', disabled:true}, ['Not Found'])];
            }
            return result;
        }
        createItemOptions() {
            let result = [];
            result = this.state.terms.map((term) => (h(Option, {
                value: term
            }, [term])));
            if(result.length == 0){
                result = [h(Option, {value: 'Not Found', disabled:true}, ['Not Found'])];
            }
            return result;
        }
        createItem() {
            let result = [];
            this.state.items.forEach((item, index) => {
                if (index == 0) return;
                result.push(
                    h(RuleItemItem, {
                        names: this.names,
                        terms: this.terms,
                        index: index,
                        continuity: item.continuity,
                        name: item.name,
                        judge: item.judge,
                        term: item.term,
                        updateItem: this.updateItem,
                        removeItem: this.removeItem,
                        update: this.update,
                        span: this.props.span
                    }, [])
                );
            });
            return result;
        }
        update(index, str) {
            if (this.state.strArr[index] == str) {

            } else {
                this.state.strArr[index] = str;

                this.setState({
                    strArr: this.state.strArr
                });
            }
        }
        filterOption(inputValue, option){
            return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
        }
        componentDidUpdate() {
            let { continuity, name, judge, term } = this.state;
            let str = [continuity, name, judge, term].join(' ');
            this.update(0, str);
        }
        render() {
            return (h(Content, {
                className: 'ruleItem',
                style: {
                    width: 'auto',
                    height: 'auto',
                    paddingBottom: '10px',
                    paddingTop: '10px',
                    overflowX: 'hidden'
                }
            }, [
                h(Row, { type: "flex", align: "middle", justify: 'start' }, [
                    h(Col, { span: this.props.span, style: { margin: '4px 0' } }, [
                        h(Row, {}, [
                            h(Col, { className: 'removeBtnWrap', offset: '1', span: '21' }, [
                                h('div',{
                                    className:`removeBtn glyphicon glyphicon-remove-sign${this.props.isLastItem(this.index, this.listName)?' isLast':''}`,
                                    style: {
                                        cursor: 'pointer',
                                        color: 'rgb(245, 106, 0)',
                                        fontSize: '12px'
                                    },
                                    onClick: ()=>{
                                        this.removeItem(0);
                                    }
                                }),
                                h(AutoComplete, {className:'pointSelect', dataSource:{dataSource:this.state.terms}, value: this.state.name, allowClear:true, filterOption: this.filterOption, onChange: this.onNameChange, onBlur: this.onNameBlur, style: { width: '100%'} }, this.createNameOptions()),
                                h(Select, {className:'judgeSelect', defaultValue:this.state.judge, value: this.state.judge, onChange: this.onJudgeChange, style: { width: '35%' } }, [
                                    h(Option, { value: 'is' }, ['Is']),
                                    h(Option, { value: 'is not' }, ['Is not'])
                                ]),
                                h(AutoComplete, {className:'termSelect', dataSource:{dataSource:this.state.terms}, value: this.state.term, allowClear:true, filterOption: this.filterOption, onChange: this.onTermChange, onBlur: this.onTermBlur, style: { width: '65%' } }, this.createItemOptions())
                            ])
                        ]),

                    ]),
                    ...this.createItem(),
                    h(Col, { span: this.props.span, style: { margin: '4px 0' } }, [
                        h(Row, {}, [
                            h(Col, { offset: '1', span: '22' }, [
                                h(Button, {
                                    shape: 'circle',
                                    onClick: this.addItem
                                }, [
                                    '+'
                                ])
                            ])
                        ])
                    ])
                ])
            ]))
        }
    }

    class RuleThen extends RuleItem {
        constructor(props, context) {
            super(props, context);
        }
        render() {
            return (h(Content, {
                    className: 'ruleItem',
                    style: {
                        width: 'auto',
                        height: 'auto',
                        paddingBottom: '10px',
                        overflowX: 'hidden'
                    }
                }, [
                    h(Row, { type: "flex", align: "middle" }, [
                        h(Col, { span: this.props.span, style: { margin: '4px 0' } }, [
                            h(Row, {}, [
                                h(Col, { className: 'removeBtnWrap', offset: '1', span: '21' }, [
                                    h('div',{
                                        className:`removeBtn glyphicon glyphicon-remove-sign${this.props.isLastItem(this.index, this.listName)?' isLast':''}`,
                                        style: {
                                            cursor: 'pointer',
                                            color: 'rgb(245, 106, 0)',
                                            fontSize: '12px'
                                        },
                                        onClick: ()=>{
                                            this.removeItem(0);
                                        }
                                    }),
                                    h(AutoComplete, {className:'pointSelect', dataSource:{dataSource:this.state.terms}, value: this.state.name, allowClear:true, filterOption: this.filterOption, onChange: this.onNameChange, onBlur: this.onNameBlur, style: { width: '100%' } }, this.createNameOptions()),
                                    h(Select, {className:'judgeSelect',defaultValue: this.state.judge, value: this.state.judge, onChange: this.onJudgeChange, style: { width: '35%' } }, [
                                        h(Option, { value: 'is' }, ['Is']),
                                        h(Option, { value: 'is not' }, ['Is not'])
                                    ]),
                                    h(AutoComplete, {className:'termSelect', dataSource:{dataSource:this.state.terms}, value: this.state.term, allowClear:true, filterOption: this.filterOption, onChange: this.onTermChange, onBlur: this.onTermBlur, style: { width: '65%' } }, this.createItemOptions())
                                ])
                            ])
                        ]),
                        ...this.createItem(),
                        h(Col, { span: this.props.span, style: { margin: '4px 0' } }, [
                            h(Row, {}, [
                                h(Col, { offset: '1', span: '22' }, [
                                    h(Button, {
                                        shape: 'circle',
                                        onClick: this.addItem
                                    }, [
                                        '+'
                                    ])
                                ])
                            ])
                        ])
                    ])
                ])
            )
        }
    }

    class FuzzyRuleContent extends React.Component {
        constructor(props, context) {
            super(props, context);

            this.toBottom = false;
            this.textArr = [];
            this.span = '6';
            this.size = 10;
            this.list = [];
            this.sizeArr = [];
            const {
                module,
                names,
                outputNames,
                terms,
                list,
                newList
            } = this.getInfo(this.props);
            
            this.list = list;
            this.sizeArr = [newList.length];

            this.state = {
                list: newList,
                total: Math.ceil(this.list.length/this.size),
                current: 1,
                module,
                names,
                outputNames,
                terms
            }
            this.add = this.add.bind(this);
            this.remove = this.remove.bind(this);
            this.addItem = this.addItem.bind(this);
            this.removeItem = this.removeItem.bind(this);
            this.updateItem = this.updateItem.bind(this);
            this.updateText = this.updateText.bind(this);
            this.getList = this.getList.bind(this);
            this.getRule = this.getRule.bind(this);
            this.pageChange = this.pageChange.bind(this);
            this.getInfo = this.getInfo.bind(this);
            this.isLastItem = this.isLastItem.bind(this);
        }

        getInfo(props) {
            const {module} = props;
            let names = module.option.input.map(input => input.name).concat(module.option.output.map(output => output.name));
            let outputNames = module.option.output.map(output => output.name);
            let terms = (function(module) {
                let res = {};
                module.option.input.forEach(input => {
                    res[input.name] = input.option.terms && input.option.terms.map(point => point.name) || [];
                });
                module.option.output.forEach(output => {
                    res[output.name] = ['Big', 'Small'];
                });
                return res;
            })(module);
            
            let list = module.option.content.ruleBlock && module.option.content.ruleBlock.concat() || [{items:[],results:[]}];
            if(list&&list[0]&&list[0].items.length==0){
                list[0].items.push({
                    continuity: 'if',
                    name: undefined,
                    judge: 'is',
                    term: undefined,
                });
            }
            if(list&&list[0]&&list[0].results.length==0){
                list[0].results.push({
                    continuity: 'then',
                    name: undefined,
                    judge: 'is',
                    term: undefined,
                });
            }
            list.forEach(l=>{
                if(l.items.length==0){
                    l.items.push({
                        continuity: 'if',
                        name: undefined,
                        judge: 'is',
                        term: undefined,
                    });
                }
                if(l.results.length==0){
                    l.results.push({
                        continuity: 'then',
                        name: undefined,
                        judge: 'is',
                        term: undefined,
                    });
                }
            });
            
            let newList = list.slice(0,this.size);
            return {
                module,
                names,
                outputNames,
                terms,
                list,
                newList
            } 
        }

        componentWillReceiveProps(props){
            this.textArr = [];
            this.list = [];
            this.sizeArr = [];
            const {
                module,
                names,
                outputNames,
                terms,
                list,
                newList
            } = this.getInfo(props);
            
            this.list = list;
            this.sizeArr = [newList.length];
            this.setState({
                list: this.list.slice(0,this.size),
                total: Math.ceil(this.list.length/this.size),
                current: 1,
                module,
                names,
                outputNames,
                terms,
            });
            
        }
        createItem() {
            let result1 = [];
            const {names, outputNames, terms, list} = this.state; 
            list.forEach((item, index) => {
                result1.push(h(Row, {
                    type: 'flex',
                    style: {
                        marginTop: '8px',
                        borderTop: '1px solid #999',
                        borderBottom: '1px solid #999'
                    }
                }, [
                    h(Col, { span: '2' }, [
                        h('span', {
                            style: {
                                display: 'block',
                                height: '12px',
                                fontSize: '12px',
                                lineHeight: '12px',
                                width: '100%',
                                textAlign: 'center',
                                position: 'absolute',
                                top: '50%',
                                marginTop: '-6px',
                            }
                        }, [I18n.resource.moduleContent.CONDITION]),
                        h('div',{
                            className:'glyphicon glyphicon-remove-sign',
                            style: {
                                position:'absolute',
                                left: '0',
                                top: '3px',
                                cursor: 'pointer',
                                color: 'rgb(245, 106, 0)',
                                fontSize: '16px'
                            },
                            onClick: linkEvent(index,this.remove)
                        })
                    ]),
                    h(Col, {
                        span: '22',
                        style: {
                            borderLeft: '1px solid #999'
                        }
                    }, h(RuleItem, {
                        listName: 'items',
                        names: names,
                        terms: terms,
                        items: item.items,
                        other: item.results,
                        index: index,
                        updateText: this.updateText,
                        addItem: this.addItem,
                        removeItem: this.removeItem,
                        updateItem: this.updateItem,
                        remove: this.remove,
                        span: this.span,
                        isLastItem: this.isLastItem,
                    }, []))
                ]));
                result1.push(
                    h(Row, {
                        type: 'flex',
                        style: {
                            marginBottom: '8px',
                            borderBottom: '1px solid #999'
                        }
                    }, [
                        h(Col, { span: '2' }, [
                            h('span', {
                                style: {
                                    display: 'block',
                                    height: '12px',
                                    fontSize: '12px',
                                    lineHeight: '12px',
                                    width: '100%',
                                    textAlign: 'center',
                                    position: 'absolute',
                                    top: '50%',
                                    marginTop: '-6px',
                                }
                            }, [I18n.resource.moduleContent.CONCLUSION])
                        ]),
                        h(Col, {
                            span: '22',
                            style: {
                                paddingTop: '8px',
                                borderLeft: '1px solid #999'
                            }
                        }, h(RuleThen, {
                            listName: 'results',
                            names: outputNames,
                            terms: terms,
                            items: item.results,
                            other: item.items,
                            index: index,
                            updateText: this.updateText,
                            addItem: this.addItem,
                            removeItem: this.removeItem,
                            updateItem: this.updateItem,
                            remove: this.remove,
                            span: this.span,
                            isLastItem: this.isLastItem,
                        }, []))
                    ])
                );
            });
            return result1;
        }
        add() {
            this.state.list.push({
                items: [{
                    continuity: 'if',
                    name: undefined,
                    judge: 'is',
                    term: undefined,
                }],
                results: [{
                    continuity: 'then',
                    name: undefined,
                    judge: 'is',
                    term: undefined,
                }]
            });
            this.toBottom = true;
            this.setState(
                this.state
            );
        }
        remove(index) {
            this.state.list.splice(index, 1);
            this.textArr.splice(index, 1);
            this.setState(
                this.state
            );
        }
        addItem(index, listName) {
            this.state.list[index][listName].push({
                continuity: 'and',
                name: undefined,
                judge: 'is',
                term: undefined,
            });
            this.setState(
                this.state
            );
        }
        isLastItem(index, listName){
            if(this.state.list[index][listName].length == 1){
                return true;
            }
            return false;
        }
        removeItem(index, index2, listName) {
            if(this.state.list[index][listName].length == 1){
                return;
            }
            this.state.list[index][listName].splice(index2, 1);
            if(index2 == 0){
                let continuity;
                switch(listName){
                    case 'items':
                        continuity = 'if';
                        break;
                    case 'results':
                        continuity = 'then';
                        break;
                }
                this.state.list[index][listName][index2]['continuity'] = continuity;
            }
            // this.state.list[index].strArr.splice(index,1);
            this.setState(
                this.state
            );
        }
        updateItem(index, index2, name, value, listName) {
            if(this.state.list[index][listName][index2] == undefined){
                this.state.list[index][listName][index2] = {
                    continuity: 'if',
                    name: undefined,
                    judge: 'is',
                    term: undefined,
                }
            }
            this.state.list[index][listName][index2][name] = value;
            this.setState(
                this.state
            );
        }
        getList() {
            return this.list;
        }
        getRule(data, list){
            let parser = namespace('beop.strategy.common.fuzzyRuleParser');
            let module;
            if(data){
                module = deepClone({},data);
            }else{
                module = deepClone({},this.props.module);
            }
            module.option.content.ruleBlock = list || this.list.concat();
            return parser.stringify(module);
        }
        pageChange(current) {
            let startIndex = ((current)=>{
                let r = 0;
                let n = current-2;
                while(n>=0){
                    r += (this.sizeArr[n]==undefined?this.size:this.sizeArr[n]);
                    n--;
                }
                return r;
            })(current);
            let newList = this.list.slice(startIndex,startIndex+(this.sizeArr[current-1]==undefined?this.size:this.sizeArr[current-1]));
            this.sizeArr[current-1] = newList.length;
            this.setState({
                list: newList,
                current: current,
            })
        }
        updateText(index, txt) {
            this.textArr[index] = txt;
        }
        componentDidMount() {
        }
        componentDidUpdate() {
            if(this.toBottom){
                this.refs.items.scrollTop = this.refs.items.scrollHeight;
                this.toBottom = false;
            }
        }
        render() {
            //更新list
            let {list,total,current} = this.state;
            let startIndex = ((current)=>{
                let r = 0;
                let n = current-2;
                while(n>=0){
                    r += (this.sizeArr[n]==undefined?this.size:this.sizeArr[n]);
                    n--;
                }
                return r;
            })(current);
            this.list.splice(startIndex,this.sizeArr[current-1],...list);
            this.sizeArr[current-1] = list.length;
            return (h(Content, {
                id: 'fuzzyRuleContentView',
                style: {
                    width: '100%',
                    height: '100%',
                }
            }, [
                h('div',{
                    ref:'items',
                    className:'gray-scrollbar',
                    style:{
                        height: 'calc( 100% - 60px)',
                        overflow: 'auto'
                    }
                },[
                    ...this.createItem(),
                    h(Row, { type: 'flex', justify: "center" }, [
                        h(Col, { span: '24' }, [
                            h(Button, {
                                shape: 'circle',
                                style: {
                                    display: 'block',
                                    margin: '5px auto'
                                },
                                onClick: this.add
                            }, [
                                '+'
                            ])
                        ])
                    ]),
                    h('div',{style:{
                        position:'absolute',
                        width: '100%',
                        height: '60px',
                        bottom: 0,
                        left: 0
                    }},[h('div',{style:{
                            width: 'auto',
                            height: 'auto',
                            margin:'10px auto'
                        }},[
                            h(Pagination, {defaultCurrent:1,total:total*10,current:current,onChange:this.pageChange})
                        ])
                    ])
                ]),
            ]))
        }
    }

    exports.FuzzyRuleContent = FuzzyRuleContent;
}));
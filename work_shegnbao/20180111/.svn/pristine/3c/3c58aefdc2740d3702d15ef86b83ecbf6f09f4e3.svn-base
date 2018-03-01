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
            namespace('beop.common.components.CodeEditor'),
            namespace('beop.common.components.FuzzyRuleChart'),
            namespace('beop.strategy.enumerators'),
            namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel.FuzzyRuleInputModal'),
            namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel.FuzzyRuleOutputModal'),
            namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel.FuzzyRuleContent')
        );
    }
}(namespace('beop.strategy.components.moduleConfigPanels'), function(
    exports,
    React,
    antd,
    CodeEditor,
    FuzzyRuleChart,
    enums,
    FuzzyRuleInputModal,
    FuzzyRuleOutputModal,
    FuzzyRuleContent
) {
    var h = React.h;
    var linkEvent = React.linkEvent;

    const deepClone = $.extend.bind(true);

    const { Layout, Form,Row , Col, Button ,Tag, Input, Select,InputNumber, Slider ,Card ,Table ,Checkbox ,Modal,Icon, Tabs} = antd;
    const TabPane = Tabs.TabPane;
    const { Content, Header } = Layout;
    const FormItem = Form.Item;
    const Search = Input.Search;

    class FuzzyRuleConfigPanel extends React.Component {
        constructor(props) {
            super(props);
            this.tab = 'view';
            this.state = {
                rule:''
            };
            this.searchListOther = [];
            this.onOk = this.onOk.bind(this);
            this.saveRuleContent = this.saveRuleContent.bind(this);
            this.saveRuleCode = this.saveRuleCode.bind(this);
        }
        componentWillReceiveProps(props){

        }
        onOk() {
            var _this = this;
            const { modules,moduleId,doOk } = this.props;
            const module = (function (modules = []) {
                var module = {option:{content:{},input:[],output:[]}};
                modules.some(function (row) {
                    if (row._id === moduleId) {
                        module = row;
                        return true;
                    }
                });
                return module;
            } (modules));
            let ruleListTemp = this.content.getList();
            module.option.content.ruleBlock = ruleListTemp.concat(this.searchListOther);
            this.searchListOther = [];
            let rule =  this.content.getRule(module, module.option.content.ruleBlock);
            doOk(
                moduleId,
                Object.assign({}, module.option, {
                    content: {
                        rule: rule,
                        ruleBlock: module.option.content.ruleBlock,
                        projId:AppConfig.projectId
                    }
                })
            );

        }

        saveRuleContent(content) {
            this.content = content;
        }
        saveRuleCode(contentCode){
            this.contentCode = contentCode;
        }
        render() {
            const {
                moduleId,
                modules,
            } = this.props;
            const module = (function (modules = []) {
                var module = {option:{content:{},input:[],output:[]}};
                modules.some(function (row) {
                    if (row._id === moduleId) {
                        module = row;
                        return true;
                    }
                });
                return module;
            } (modules));
            let ruleListTemp = [];
            return (
                h(Content, {
                    id: 'fuzzyRuleModuleConfigPanel',
                    className: 'module-config-panel',
                    style: {
                        height: '100%'
                    }
                }, [
                    h(Header, {
                        className: 'config-panel-header clearfix'
                    }, [
                        h('div.config-panel-title', [
                            I18n.resource.moduleContent.FUZZY_RULE_MODULE_TO_EDIT + ` - ${module.name}`
                        ]),
                        h('div.config-panel-header-right', [
                            h(Button, {
                                onClick: this.onOk
                            }, [I18n.resource.moduleContent.RETURN])
                        ])
                    ]),
                    h(Content, {
                        className: 'config-panel-content gray-scrollbar',
                        style:{
                            height: "calc(100% - 65px)",
                            overflow: "auto"
                        }
                    }, [
                        h(Tabs,{
                            defaultActiveKey: 'view',
                            style: {
                                height: '100%'
                            },
                            tabBarExtraContent:this.tab == 'view'?h(Search,{
                                placeholder:"Search",
                                style:{ 

                                },
                                onSearch:(searchValue)=>{
                                    //还原完整的list
                                    ruleListTemp = this.content.getList();
                                    module.option.content.ruleBlock = ruleListTemp.concat(this.searchListOther);
                                    if(searchValue){//search筛选
                                        searchValue = searchValue.toLocaleLowerCase();
                                        let searchList = [],
                                            searchListOther = [];
                                        module.option.content.ruleBlock.forEach(l=>{
                                            let a,b;
                                            a = l.items.some(v=>((v.name&&v.name.toLocaleLowerCase().indexOf(searchValue)>-1)||(v.term&&v.term.toLocaleLowerCase().indexOf(searchValue)>-1)));
                                            b = l.results.some(v=>((v.name&&v.name.toLocaleLowerCase().indexOf(searchValue)>-1)||(v.term&&v.term.toLocaleLowerCase().indexOf(searchValue)>-1)));
                                            if(a||b){
                                                searchList.push(l);
                                            }else{
                                                searchListOther.push(l);
                                            }
                                        });
                                        this.searchListOther = searchListOther;
                                        module.option.content.ruleBlock = searchList;
                                    }else{
                                        module.option.content.ruleBlock = ruleListTemp.concat(this.searchListOther);
                                    }
                                    
                                    this.setState({
                                        
                                    });
                                }
                            }):null,
                            animated: false,
                            onChange: (type) => {
                                this.tab = type;
                                switch(type){
                                    case 'view':
                                        let parser = namespace('beop.strategy.common.fuzzyRuleParser');
                                        if(this.contentCode&&this.contentCode.state.code){
                                            let obj = parser.parse(this.contentCode.state.code);
                                            //ruleBlock检测
                                            let inputIermsMap = {};
                                            let outputIermsMap = {};
                                            obj.option.input.forEach((input)=>{
                                                inputIermsMap[input.name] = input.option.terms.map(term=>term.name);
                                            });
                                            obj.option.output.forEach((output)=>{
                                                outputIermsMap[output.name] = ['Big','Small'];
                                            });
                                            obj.option.content.ruleBlock.forEach(block=>{
                                                block.items.forEach(item=>{
                                                    if(item.name){
                                                        if(outputIermsMap[item.name] && outputIermsMap[item.name].indexOf(item.term)<0){
                                                            item.term = undefined;
                                                        }else if(inputIermsMap[item.name] && inputIermsMap[item.name].indexOf(item.term)<0){
                                                            item.term = undefined;
                                                        }
                                                    }else{
                                                        item.name = undefined;
                                                    }
                                                });
                                                block.results.forEach(result=>{
                                                    if(result.name){
                                                        if(outputIermsMap[result.name] && outputIermsMap[result.name].indexOf(result.term)<0){
                                                            result.term = undefined;
                                                        }
                                                    }else{
                                                        result.name = undefined;
                                                    }
                                                });
                                            });
                                            //ruleBlock检测end
                                            if(obj.option.content.ruleBlock.length==0){
                                                obj.option.content.ruleBlock = [{
                                                    items: [{
                                                        continuity:"if",
                                                        judge:"is",
                                                        name:"",
                                                        term:""
                                                    }],
                                                    results:[{
                                                        continuity:"then",
                                                        judge:"is",
                                                        name:"",
                                                        term:""
                                                    }]
                                                }]
                                            }
                                            module.option.content.ruleBlock = obj.option.content.ruleBlock;
                                            this.setState(this.state);
                                        }
                                        break;
                                    case 'code':
                                        //还原完整的list
                                        ruleListTemp = this.content.getList();
                                        module.option.content.ruleBlock = ruleListTemp.concat(this.searchListOther);
                                        this.searchListOther = [];
                                        this.setState({
                                            rule:this.content&&this.content.getRule(module, module.option.content.ruleBlock)||''
                                        });
                                        break;
                                }
                            }
                        },[
                            h(TabPane, {
                                key:'view',
                                style: {
                                    height: '100%'
                                },
                                tab:I18n.resource.moduleContent.GRAPH
                            }, [
                                h(FuzzyRuleContent, {
                                    module: module,
                                    ref: this.saveRuleContent
                                })
                            ]),
                            h(TabPane,{
                                key:'code',
                                tab:I18n.resource.moduleContent.CODE,
                                style: {
                                    height: '100%'
                                },
                                className: 'ruleCodeEditorWrap'
                            },[
                                h(CodeEditor,{
                                    value: this.state.rule,
                                    onChange:(code)=>{this.contentCode.setState({code:code});},
                                    ref: this.saveRuleCode,
                                    style: {
                                        height: '100%'
                                    }
                                })
                            ])
                        ])
                    ])
                ])
            );
        }
    }

    exports.FuzzyRuleConfigPanel = FuzzyRuleConfigPanel;
}));
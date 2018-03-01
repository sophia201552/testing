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
            namespace('beop.strategy.common'),
            namespace('antd')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    common,
    antd
) {

    var h = React.h;
    var linkEvent = React.linkEvent;
    const {Tree, Input, Icon, Select, Dropdown,Menu } = antd; 
    const Option = Select.Option;
    const Item = Menu.Item;
    const SubMenu = Menu.SubMenu;
    const MenuItemGroup = Menu.ItemGroup;

    class StrategyNav extends React.Component {
        constructor(props) {
            super(props);

        }       
        
        
        componentDidMount() {
            
        }
        
        render() {
            const{user} = this.props;
            return (
                h('#nav', {
                    style: {
                        width: '100%',
                        height: '100%',
                    }
                }, [
                    h('#navLeft',[
                        h("a",{
                            className:"navBrand",
                            href:"javascript:;",
                            onClick: this.props.backHome
                        },["Strategy"])
                    ]),
                    h("#navRight",[
                        h(Dropdown,{
                            overlay: h(Menu,{
                                mode:"inline",
                            },[
                                h(Item,{
                                    key:"1"
                                },[
                                    h('a',{
                                        href:"javascript:;",
                                        onClick:this.props.logout
                                    },[I18n.resource.app.LOGOUT])
                                ]),
                                h(SubMenu,{
                                    title:I18n.resource.app.LANGUAGE,
                                    key:"2"
                                },[
                                    h(Item,{
                                        key:"3",
                                        className:"languageType",
                                        style:{
                                            textAlign:"center"
                                        }
                                    },[
                                        h('a',{
                                            href:"javascript:;",
                                            style:{
                                                color: this.props.language === "zh"? "#f6a405" : "#cadee5"
                                            },
                                            onClick:function(e){
                                                this.props.changeLanguage("zh")
                                            }.bind(this)
                                        },["中文"])
                                    ]),
                                    h(Item,{
                                        key:"4",
                                        className:"languageType",
                                        style:{
                                            textAlign:"center"
                                        }
                                    },[
                                        h('a',{
                                            href:"javascript:;",
                                            style:{
                                                color: this.props.language === "en"? "#f6a405" : "#cadee5"
                                            },
                                            onClick:function(e){
                                                this.props.changeLanguage("en")
                                            }.bind(this)
                                        },["English"])
                                    ])
                                ])
                            ]),
                            trigger: "click"
                        },[
                            h("a",{
                                className:"ant-dropdown-link userAccount",
                                href:"javascript:;",                                
                            },[
                                h("img",{
                                    className:"userPic",
                                    src: this.props.user.avatarSrc,
                                    alt: this.props.user.name,
                                    onError:function(e){
                                        e.target.src = "/static/images/avatar/default/7.png"
                                    }
                                })
                            ])
                        ])
                    ])    
                ])
            );
        }
    }

    exports.StrategyNav = StrategyNav;
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd'),
            namespace('beop.strategy.common'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    commonUtil,
    enumerators
) {
    var h = React.h;

    const { Menu, Icon } = antd;
    const SubMenu = Menu.SubMenu;

    const ParamsTree = exports.ParamsTree = React.createClass({
        getInitialState() {
            return {
                openKeys: [this.props.selectedValueId]
            };
        },
        getParams(paramMap, valueId, moduleId) {
            let map = this.inputIdToNameMap,
                map2 = this.inputIdToTypeMap;
            return (
                Object.keys(paramMap).map(
                    (paramId) => {
                        return (
                            h(Menu.Item, {
                                key: `${valueId}-${moduleId}-${paramId}`
                            }, [
                                h(Icon,{
                                    type:enumerators.moduleInputOutputTypeIcons[map2[paramId]],
                                    // style:{
                                    //     color:'red'
                                    // }
                                }),
                                `${map[paramId]}: `,
                                `${paramMap[paramId]}`
                            ])
                        )
                    }
                )
            );
        },
        getModules(map, valueId) {
            var moduleIdToNameMap = {};
            this.props.modules.forEach(
                (row) => {
                    moduleIdToNameMap[row._id] = row.name
                }
            );
            return (
                Object.keys(map).map(
                    (moduleId) => {
                        return (
                            h(Menu.ItemGroup, {
                                key: `${valueId}-${moduleId}`,
                                title: I18n.resource.title.MODULE + ` - ${moduleIdToNameMap[moduleId]}`
                            }, this.getParams(map[moduleId], valueId, moduleId))
                        );
                    }
                )
            );
        },
        getTree() {
            var value = [...this.props.value];
            var list = [];

            value.forEach(
                (v) => {
                    list.push(
                        h(SubMenu, {
                            key: v._id,
                            title: v.name
                        }, this.getModules(v.list, v._id))
                    )
                }
            );

            return (
                h(Menu, {
                    openKeys: this.state.openKeys,
                    onOpenChange: this.onOpenChange,
                    mode: "inline"
                }, list)
            );
        },
        onOpenChange(openKeys) {
            const state = this.state;
            const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));

            this.setState({ openKeys: [latestOpenKey] });

            if (latestOpenKey) {
                this.props.handleSelect(latestOpenKey);
            }
        },
        updateVariables() {
            let modules = this.props.modules;
            let map = {},
                map2 = {};

            modules.forEach(
                (m) => {
                    m.option.input.forEach(
                        (ipt) => {
                            map[ipt._id] = ipt.name;
                            map2[ipt._id] = ipt.type;
                        }
                    )
                }
            );

            this.inputIdToNameMap = map;
            this.inputIdToTypeMap = map2;
        },
        componentWillMount() {
            this.updateVariables();
        },
        componentWillReceiveProps(nextProps) {
            this.updateVariables();
            this.setState({
                openKeys: [nextProps.selectedValueId]
            });
        },
        render() {
            return (
                this.getTree()
            );
        }
    });

    const PropTypes = React.PropTypes;

    ParamsTree.propTypes = {
        value: PropTypes.array.isRequired,
        modules: PropTypes.array.isRequired,
        handleSelect: PropTypes.func
    };
}));
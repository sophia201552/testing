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
    const {Tree, Input, Icon, Select} = antd;
    const Search = Input.Search;
    const TreeNode = Tree.TreeNode
    const Option = Select.Option;

    let timer = null;

    class CustomTreeNode extends TreeNode{
        constructor(props){
            super(props)
        }
        renderSwitcher(props, expandedState) {
            let className = props.prefixCls+'-switcher';
            let type = 'file-text';
            // switch(expandedState){
            //     case 'open':
            //         type = 'folder-open';
            //         break;
            //     case 'close':
            //         type = 'folder';
            //         break;
            // }
            if(props.isValue){
                type = 'minus';
            }
            return h('span',{className,onClick: this.onExpand},[h(Icon,{type})])
	  };
    }

    class EquipTree extends React.Component {
        constructor(props) {
            super(props);

            this.projChange = this.projChange.bind(this);
            this.searchChange = this.searchChange.bind(this);
            this.onExpand = this.onExpand.bind(this);
            this.onSelect = this.onSelect.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
            this.getTreeNodes = this.getTreeNodes.bind(this);
            this.getTreeNodeTitle = this.getTreeNodeTitle.bind(this);
            this.getSelectedKeys = this.getSelectedKeys.bind(this);
        }
        projChange(value, label, extra) {
            const {items} = this.props;
            this.props.changeProjName(value);
            let node = items.find(item=>value == item.name + item.projId);
            if (node && node.nodeId === '-1' && !node.isLoaded) {
                this.props.loadTreeData(node._id);
            }
            if(value) {
                AppConfig.projectId = node.projId;
                this.props.onSelectTreeNode(this.props.selectedNodeId, node._id);
            } else {
                this.props.onSelectTreeNode(null, null);
            }
        }
        searchChange(e) {
            this.props.onSearch(e.target.value);
        }
        onExpand(expandedKeys, event) {
            let expanded = event.expanded;
            let node = event.node;

            if (expanded && node.props.parent === '-1' && !node.props.isLoaded) {
                this.props.loadTreeData(node.props.eventKey);
            }
            if (expanded && node.props.isStrategy) {
                this.props.onSelectTreeNode(node.props.eventKey, node.props.parent);
                this.props.doOpen(node.props.eventKey);
            }
            this.props.handleExpand(expandedKeys);
        }
        onSelect(keys, event) {
            let node = event.node;
            let selected = event.selected;

            // 不处理 loading 节点
            if (node.props.eventKey.indexOf('loading') > -1) {
                return;
            }

            if (!timer) {
                timer = window.setTimeout(() => {
                    window.clearTimeout(timer);
                    timer = null;
                }, 500);
            } else {
                if (node.props.isStrategy) {
                    let keys = this.props.expandedKeys.concat(node.props.eventKey);
                    this.props.handleExpand(keys);
                    this.props.onSelectTreeNode(node.props.eventKey, node.props.parent);
                    this.props.doOpen(node.props.eventKey);
                    return;
                } else if(node.props.isValue){
                    this.props.onSelectTreeNode(node.props.parent, node.props.groundParent);
                    this.props.changeSelectedValueId(node.props.eventKey);
                    this.props.doOpen(node.props.parent);
                    return;
                }
            }
            if(selected) {
                AppConfig.projectId = node.props.projId;
                if (node.props.isStrategy) {
                    this.props.onSelectTreeNode(node.props.eventKey, node.props.parent);
                }else if(node.props.isValue){
                    this.props.onSelectTreeNode(node.props.parent, node.props.groundParent);
                } else {
                    this.props.onSelectTreeNode(null, node.props.eventKey);
                }
            } else {
                this.props.onSelectTreeNode(null, null);
            }
        }
        onDragStart(e) {
            let evt = e.event;
            let dataTransfer = evt.dataTransfer;
            let key = e.node.props.eventKey;
            if(e.node.props.isValue){
                key = e.node.props.parent;
            }
            let info = {
                dataId: key,
                data: common.toFlatArray(this.props.items).find(item=>item._id==key)
            };
            dataTransfer.setData('projDragInfo', JSON.stringify(info));
        }
        getTreeNodeTitle(item) {
            let searchKey = this.props.searchKey;
            let index = item.name.search(searchKey);

            return index > -1 ? (
                h('span', [
                    item.name.substr(0, index),
                    h('span', {style:{ color: '#f50' }}, [searchKey]),
                    item.name.substr(index + searchKey.length)
                ])
            ) : (h('span',[item.name]));
        }
        getTreeNodes(items, parentNode, projId) {
            let nodes = [];
            let getValueNodes = (values, parentId, groundParentId, projId)=>{
                return values.map(
                    value=>h(CustomTreeNode, {
                        isLeaf: false,
                        isValue: true,
                        key: value._id,
                        parent: parentId,
                        groundParent: groundParentId, 
                        isLoaded: false,
                        title: this.getTreeNodeTitle(value),
                        projId: projId
                    }, [])
                );
            };
            if (!items || items.length === 0) {
                if (parentNode && parentNode.projId && parentNode.nodeId === '-1' && !parentNode.isLoaded) {
                    return h(TreeNode, {
                        isLeaf: true,
                        key: 'loading',
                        title: I18n.resource.title.LOADING
                    })
                }
                return null;
            }

            return items.map(item => {
                let pId = projId||item.projId||'';
                if(item.value){
                    return (
                        h(CustomTreeNode, {
                            isLeaf: false,
                            isStrategy: true,
                            key: item._id,
                            parent: item.nodeId,
                            isLoaded: item.isLoaded,
                            title: this.getTreeNodeTitle(item),
                            projId: pId,
                        }, getValueNodes(item.value, item._id,item.nodeId, pId))
                    );
                }else{
                    return (
                        h(TreeNode, {
                            isLeaf: !item.isParent,
                            key: item._id,
                            parent: item.nodeId,
                            isLoaded: item.isLoaded,
                            title: this.getTreeNodeTitle(item),
                            projId: pId
                        }, this.getTreeNodes(item.children, item, pId))
                    );
                }
                
            });
        }
        componentDidMount() {
            const { items, tagList } = this.props;
            const projId = AppConfig.projectId.toString();

            let node = items.find(
                row => row._id === projId
            );
            if (!node.isLoaded) {
                this.props.loadTreeData(node._id);
            }
            if(tagList.length==0){
                this.props.loadTagList();
            }
        }
        getSelectedKeys() {
            const { selectedNodeId, selectedGroupId } = this.props;
            if (selectedNodeId) {
                return [selectedNodeId];
            } else if (selectedGroupId) {
                return [selectedGroupId];
            }
            return [];
        }
        render() {
            const {
                selectedGroupId, selectedNodeId, items, expandedKeys, autoExpandParent, searchKey, projName,
                bShowChildStrategies, onToggleShowAllStrategiesBtnHandler,
                onSelectTreeNode, doOpen
            } = this.props;

            let treeData = [],
                options = [],
                treeDataMap = {};
            items.forEach(item=>{
                options.push(h(Option,{value:item.name + item.projId},[item.name+' #'+item.projId]));
                treeDataMap[item.name + item.projId] = item;
            });
            let selectItem = treeDataMap[projName] || {};

            return (
                h('#equipTree', {
                    style: {
                        width: '100%',
                        height: '100%'
                    }
                }, [
                    h('div.equipTreeBox', [
                        h('.equipTreeContent.gray-scrollbar', [
                            h('div', {
                                style: {
                                    width: 'auto',
                                    padding: '18px 5%'
                                }
                            }, [
                                h(Select,{
                                    showSearch: true,
                                    style: {width: '100%'},
                                    placeholder: "Select a project",
                                    optionFilterProp: "children",
                                    onChange: this.projChange,
                                    filterOption: (input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                                    value: projName,
                                },options),
                            ]),
                            h('div.gray-scrollbar', {
                                style: {
                                    borderTop:'1px solid #495252',
                                    padding: '0 5%',
                                    height: "calc(100% - 64px)",
                                    overflow: "auto"
                                }
                            },[
                                h(Search, {
                                    style: {marginTop:'10px'},
                                    defaultValue: searchKey,
                                    placeholder: I18n.resource.equipTree.SEARCH,
                                    onChange: this.searchChange
                                }),
                                h(Tree, {
                                    expandedKeys: expandedKeys,
                                    selectedKeys: this.getSelectedKeys(),
                                    autoExpandParent: autoExpandParent,
                                    loadData: () => Promise.resolve(),
                                    onExpand: this.onExpand,
                                    draggable: true,
                                    onDragStart: this.onDragStart,
                                    onSelect: this.onSelect
                                }, this.getTreeNodes(selectItem.children, selectItem, selectItem.projId||''))
                            ]),
                            h('.bottomBox', [
                                h('div', {
                                    className:  'showAllStrategy' + (bShowChildStrategies ? ' active' : ''),
                                    onClick: onToggleShowAllStrategiesBtnHandler
                                }, I18n.resource.equipTree.SHOW_ALL_STRATEGIES)
                            ])
                        ])
                    ])
                ])
            );
        }
    }

    exports.EquipTree = EquipTree;
}));
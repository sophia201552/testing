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
            namespace('antd')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd
) {
    var h = React.h;
    const {Tree, Input, Modal, Button, Spin, notification} = antd;
    const Search = Input.Search;
    const TreeNode = Tree.TreeNode;
    const confirm = Modal.confirm;
    // {
    //     draggable: true||false, //拖拽
    //     onlyGroup: true||false, //只显示文件夹
    //     isSearchInput: true||false, //搜索框
    //     defaultSelected: true||false, //默认选中
    //     isToolBar: true||false, //工具栏
    //     isMultiple: true||false, //多选
    //     excludeIds: [] //不显示的模板或文件夹
    // }
    const searchInputHeight = 65,
        toolBarHeight = 30;
    const addBodyClass = (isAdd)=>{
        if(isAdd){
            document.body.classList.add('templateTreeModal');
        }else{
            document.body.classList.remove('templateTreeModal');
        }
    }
    class MoveToModal extends React.Component{
        constructor(props, context) {
            super(props,context);
            this.async = null;
            this.state = {
                loading: false,
                visible: false,
                excludeIds: [],
            }
            this.showModal = this.showModal.bind(this);
            this.handleOk = this.handleOk.bind(this);
            this.updateSelect = this.updateSelect.bind(this);
            this.updateTree = this.updateTree.bind(this);
        }
        render() {
            const {child} = this.props;
            const {visible, loading, excludeIds} = this.state;
            return (
                h(Modal, {
                    wrapClassName: "vertical-center-modal scrollable-modal",
                    title: '模板移动',
                    visible: visible,
                    onOk: this.handleOk,
                    onCancel: ()=>{this.showModal(false)},
                    footer: [h(Button, { key: 'close', onClick: ()=>{this.showModal(false)} }, [I18n.resource.modal.CANCEL]), h(Button, { key: 'save', onClick: this.handleOk, loading: loading }, [I18n.resource.modal.SAVE])]
                }, [
                    h(child,{
                        ref: 'TemplateTree',
                        draggable: false,
                        onlyGroup: true,
                        isSearchInput: false,
                        defaultSelected: false,
                        isToolBar: false,
                        isMultiple: false,
                        excludeIds: excludeIds
                    })
                ])
            );
        }
        showModal(isShow = true, keys) {
            const {root} = this.props;
            let {selectedIds, tree} = root.state;
            selectedIds = keys || selectedIds;
            let excludeIds = selectedIds.filter(id=>{
                let info = tree.get(id);
                if(info.isGroup == 0){
                    return false;
                }
                return true;
            });
            this.setState({
                visible: isShow,
                excludeIds: excludeIds,
                loading: false,
            });
            if(this.async){
                this.async.abort();
                this.async = null;
            }
            addBodyClass(isShow);
        }
        updateSelect(keys) {
            let isShow = this.state.visible;
            this.showModal(isShow, keys);
        }
        updateTree(tree) {
            this.refs.TemplateTree && this.refs.TemplateTree.setState({tree});
        }
        handleOk() {
            const {root} = this.props;
            const {selectedIds, tree} = root.state;
            if(selectedIds.length){

            }
            let group = this.refs.TemplateTree.getSelectedIds();
            group = group[0]||'';
            this.setState({
                loading: true
            });
            this.async = WebAPI.post('/strategy/template/changeGroup',{
                ids:selectedIds,
                group
            }).done((rs)=>{
                if(rs.status == 'OK'){
                    selectedIds.forEach(id=>{
                        let selectInfo = tree.get(id);
                        selectInfo.group = group;
                    });
                    root.setState({});
                    root.updateParentMap(tree);
                    this.showModal(false);
                }
            }).always(()=>{
                this.async = null;
            });
        }
    }
    class RenameTreeNode extends TreeNode{
        constructor(props,context) {
            super(props,context);
            this.data = this.props.data;
            this.dbClickTimer = undefined;
            this.renameClickTimer = undefined;
            this.state = {
                showRename: false
            }
            if(this.props.refId){
                this.props.parent.refs[this.props.refId] = this;
            }
            
            this.showRename = this.showRename.bind(this);
        }
        onSelect() {
            if(!this.renameClickTimer){
                super.onSelect();
                this.renameClickTimer = setTimeout(()=>{
                    this.renameClickTimer = undefined;
                },800);
                this.dbClickTimer = setTimeout(()=>{
                    this.dbClickTimer = undefined;
                },400);
            }else if(this.dbClickTimer){
                //dbclick
                clearTimeout(this.renameClickTimer);
                clearTimeout(this.dbClickTimer);
                this.renameClickTimer = undefined;
                this.dbClickTimer = undefined;
            }else{
                //rename
                this.refs.treeNodeRenameIpt.value = this.data.name;
                this.showRename(true);
                clearTimeout(this.renameClickTimer);
                this.renameClickTimer = undefined;
            }
        }
        componentDidUpdate() {
            const {showRename} = this.state;
            if(showRename){
                $(this.refs.treeNodeRenameIpt).focus();
            }
        }
        render(){
            const {showRename} = this.state;
            const {doRename} = this.props;
            let treeNode = super.render();
            return h('div',{
                className:'treeNodeWrap',
                style:{
                    position: 'relative',
                }
            },[h('input',{
                ref: 'treeNodeRenameIpt',
                className:'treeNodeRenameIpt',
                style:{
                    position:'absolute',
                    top:'4px',
                    left:'15px',
                    background: '#34393c',
                    outline: 'none',
                    border: '1px solid',
                    paddingLeft:'2px',
                    display: showRename?'block':'none'
                },
                onBlur: ()=>{
                    let value = this.refs.treeNodeRenameIpt.value;
                    if(value != ''){
                        doRename(this.data._id, value, ()=>{this.showRename(false);});
                    }else{
                        this.showRename(false);
                    }
                    
                },
            }),treeNode]);
        }
        showRename(isShow) {
            this.setState({
                showRename:isShow
            });
        }
    }
    class TemplateTree extends React.Component{
        constructor(props,context) {
            super(props,context);
            this.renameSet = new Set();
            this.parentsMap = {};
            this.async = undefined;
            this.beforeSearchData = {};
            this.isSearch = false;
            this.state = {
                tree:new Map(),
                expandedKeys:[],
                oldExpandedKeys:[],
                selectedIds: [],
                searchValue:'',
                autoExpandParent: true,
                checkable: false,
                isSpin: true,
            }
            
            
            this.searchChange = this.searchChange.bind(this);
            this.onSearch = this.onSearch.bind(this);
            this.onExpand = this.onExpand.bind(this);
            this.onLoadData = this.onLoadData.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
            this.onDragEnter = this.onDragEnter.bind(this);
            this.onDrop = this.onDrop.bind(this);
            this.onSelect = this.onSelect.bind(this);
            this.loop = this.loop.bind(this);
            this.getSearchInput = this.getSearchInput.bind(this);
            this.getSelectedIds = this.getSelectedIds.bind(this);
            this.doRename = this.doRename.bind(this);
            this.onDelete = this.onDelete.bind(this);
            this.onMoveto = this.onMoveto.bind(this);
            this.updateParentMap = this.updateParentMap.bind(this);
            this.onAdd = this.onAdd.bind(this);
        }
        componentDidMount(){
            const {defaultSelected = true} = this.props;
            let selectedIds = [];
            this.async = WebAPI.get('/strategy/template/group').done(rs=>{
                if(rs.status == 'OK'){
                    this.parentsMap[''] = rs.data.data.map(v=>v._id);
                    rs.data.data.forEach(v=>{
                        this.state.tree.set(v._id,v);
                    });
                    if(rs.data.data[0]){
                        defaultSelected && (selectedIds = [rs.data.data[0]._id]);
                        this.async = WebAPI.get("/strategy/template/group/"+rs.data.data[0]._id).done(rs2=>{
                            if(rs2.status == 'OK'){
                                this.parentsMap[rs.data.data[0]._id] = rs2.data.data.map(v=>v._id);
                                rs2.data.data.forEach(v=>{
                                    this.state.tree.set(v._id,v);
                                });
                            }
                        }).always(()=>{
                            this.async = undefined;
                            this.setState({
                                tree: this.state.tree,
                                expandedKeys: [rs.data.data[0]._id],
                                oldExpandedKeys: [rs.data.data[0]._id],
                                selectedIds,
                                searchValue:'',
                                autoExpandParent: true,
                                isSpin: false
                            })
                        });
                    }
                }
            }).always(()=>{
                this.async = undefined;
            });
        }
        componentWillUnmount(){
            if(this.async){
                this.async.abort();
                this.async = undefined;
            }
        }
        componentDidUpdate() {
            let isShow = false;
            this.renameSet.forEach(id=>{
                if(this.refs['node'+id]){
                    this.refs['node'+id].showRename(true);
                    isShow = true;
                }
            });
            isShow && this.renameSet.clear();
            this.refs.MoveToModal && this.refs.MoveToModal.updateTree(new Map(this.state.tree));
        }
        render() {
            const {searchValue, expandedKeys, autoExpandParent, selectedIds, tree, isSpin} = this.state;
            const {draggable = true, isSearchInput = true, isToolBar = true, isMultiple = true, excludeIds = []} = this.props;

            let otherHeight = 0;
            if(isSearchInput){
                otherHeight+=searchInputHeight;
            }
            if(isToolBar){
                otherHeight+=toolBarHeight;
            }
            let height = `calc(100% - ${otherHeight+1}px)`;
            return(h('div',{
                style: {
                    height: '100%'
                }
            },[
                this.getSearchInput(),
                h('div',{
                    className:'gray-scrollbar',
                    style:{
                        padding: '0 5%',
                        height: height,
                        overflow: 'auto',
                        minHeight: '300px',
                        position: 'relative'
                    }
                },[
                    h('div',{
                        style:{
                            display: isSpin?'block':'none',
                            position: 'absolute',
                            textAlign: 'center',
                            width: '32px',
                            height: '32px',
                            top: '0',
                            left: '0',
                            bottom: '0',
                            right: '0',
                            margin: 'auto'
                        }
                    },isSpin?h(Spin,{size:"large"}):[]),
                    h(Tree,{
                        multiple: isMultiple,
                        expandedKeys:expandedKeys,
                        selectedKeys:selectedIds,
                        autoExpandParent:autoExpandParent,
                        onExpand:this.onExpand,
                        loadData:this.onLoadData,
                        draggable:draggable,
                        onDragStart:this.onDragStart,
                        onDragEnter:this.onDragEnter,
                        onDrop:this.onDrop,
                        onSelect: this.onSelect
                    },this.loop(tree)),
                ]),
                this.getToolBar()
            ]));
        }
        onLoadData(treeNode){
            this.async = WebAPI.get("/strategy/template/group/"+treeNode.props.eventKey).done(rs=>{
                if(rs.status == 'OK'){
                    this.parentsMap[treeNode.props.eventKey] = rs.data.data.map(v=>v._id);
                    rs.data.data.forEach(v=>{
                        this.state.tree.set(v._id,v);
                    });
                    this.setState({
                        tree:this.state.tree
                    })
                }
            }).always(()=>{
                this.async = undefined;
            });
            return this.async;
        }
        getSearchInput() {
            const {isSearchInput = true} = this.props;
            if(isSearchInput){
                return h('div',{style:{
                    width:'auto',
                    height:searchInputHeight+'px',
                    padding: '18px 5%',
                    borderBottom:'1px solid #495252',
                }},[
                    h(Search,{
                        placeholder:I18n.resource.equipTree.SEARCH,
                        onChange:this.searchChange,
                        onSearch: this.onSearch
                    },[])
                ]);
            }else{
                return;
            }
        }
        getToolBar() {
            const {isToolBar = true} = this.props;
            if(isToolBar){
                return h('div',{style:{
                    width:'100%',
                    height:toolBarHeight+'px',
                    padding: '0 5%',
                    borderTop:'1px solid #495252',
                }},[
                    h('span',{
                        className:'iconfont icon-shanchu',
                        title: '删除',
                        style:{
                            display:'inline-block',
                            float: 'right',
                            width:'20px',
                            lineHeight:toolBarHeight+'px',
                            cursor:'pointer'
                        },
                        onClick: this.onDelete
                    }),
                    h('span',{
                        className:'iconfont icon-zuozhankai',
                        title: '移动',
                        style:{
                            display:'inline-block',
                            float: 'right',
                            width:'20px',
                            lineHeight:toolBarHeight+'px',
                            cursor:'pointer'
                        },
                        onClick: this.onMoveto
                    }),
                    h('span',{
                        className:'iconfont icon-tianjia1',
                        title: '添加',
                        style:{
                            display:'inline-block',
                            float: 'right',
                            width:'20px',
                            lineHeight:toolBarHeight+'px',
                            cursor:'pointer'
                        },
                        onClick: this.onAdd
                    }),
                    h(MoveToModal,{
                        ref: 'MoveToModal',
                        child: TemplateTree,
                        root: this
                    })
                ]);
            }else{
                return;
            }
        }
        searchChange(e){
            const value = e.target.value;
            const {oldExpandedKeys} = this.state;
            let expandedKeys = [];
            if(value!=''){
                this.state.tree.forEach(item=>{
                    if(item.name.toLowerCase().indexOf(value.toLowerCase()) > -1&&item.group){
                        expandedKeys.push(item.group);
                    }
                });
            }else{
                expandedKeys = oldExpandedKeys;
            }
            this.setState({
                expandedKeys,
                searchValue: value,
                autoExpandParent: true,
            });
        }
        onSearch(value) {
            if(this.async){
                this.async.abort();
            }
            if(value){
                this.async = WebAPI.get("/strategy/template/groupsearch/"+value).done(rs=>{
                    if(rs.status == 'OK'){
                        this.isSearch = true;
                        this.beforeSearchData.tree = this.beforeSearchData.tree||this.state.tree;
                        this.beforeSearchData.selectedIds = this.beforeSearchData.selectedIds||this.state.selectedIds;
                        let newTree = new Map();
                        rs.data.data.forEach(v=>{
                            newTree.set(v._id,v);
                        });
                        this.setState({
                            tree:newTree
                        })
                    }
                }).always(()=>{
                    this.async = undefined;
                });
            }else{
                this.setState({
                    tree: this.beforeSearchData.tree,
                    selectedIds: this.beforeSearchData.selectedIds
                });
                this.isSearch = false;
                this.beforeSearchData.tree = undefined;
                this.beforeSearchData.selectedIds = undefined;
            }
        }
        getSelectedIds() {
            return this.state.selectedIds;
        }
        onSelect(keys) {
            this.setState({
                selectedIds: keys
            });
            this.refs.MoveToModal && this.refs.MoveToModal.updateSelect(keys);
        }
        onExpand(expandedKeys){
            this.setState({
                expandedKeys,
                autoExpandParent: false,
                oldExpandedKeys: expandedKeys
            });
        }
        onDragStart(e){
            let evt = e.event;
            let $this = $(evt.target);
            let dataTransfer = evt.dataTransfer;
            let offset = $this.offset();
            let info = {
                x: evt.clientX - offset.left,
                y: evt.clientY - offset.top,
                w: $this.width(),
                h: $this.height(),
                dataId: e.node.props.eventKey
            };
            dataTransfer.setData('info', JSON.stringify(info));
        }
        onDragEnter(info) {
            // console.log(info);
            // console.log(this.tree.get(info.node.props.eventKey));
            // expandedKeys 需要受控时设置
            // this.setState({
            //   expandedKeys: info.expandedKeys,
            // });
        }
        onDrop({event, node, dragNode, dragNodesKeys}) {
            // let dragNodeInfo = this.state.tree.get(dragNode.props.eventKey),
            //     nodeInfo = this.state.tree.get(node.props.eventKey);
            // if(nodeInfo.isGroup == 1){
            //     //todo 接口调用
            //     dragNodeInfo.group = nodeInfo._id;
            //     this.onLoadData(node).done((rs)=>{
            //         if(rs.status == 'OK'){
            //             if(this.state.expandedKeys.indexOf(node.props.eventKey)<0){
            //                 this.state.expandedKeys.push(node.props.eventKey);
            //                 this.onExpand(this.state.expandedKeys);
            //             }
            //         }
            //     });
            // }else{
            //     dragNodeInfo.group = nodeInfo.group;
            //     this.setState({});
            // }
        }
        onDelete() {
            let {selectedIds, tree} = this.state;
            let hasGroupTitle = '{name}规则将被删除，删除后不可恢复，是否确认删除？';
            let loopChildren = (parentIds)=>{
                let rs = [].concat(parentIds);
                parentIds.forEach(parentId=>{
                    let children = this.parentsMap[parentId];
                    if(children){
                        hasGroupTitle = '将删除选中文件夹{name}下所有文件，删除后不可恢复，是否确认删除？';
                        rs = rs.concat(loopChildren(children));
                    }
                });
                return rs;
            };
            let deleteIdsSet = new Set(loopChildren(selectedIds));
            if(!deleteIdsSet.size){
                return;
            }
            let isTransformedFromFiles = false;
            deleteIdsSet.forEach(v=>{
                if(tree.get(v).isTransformedFromFiles == 1){
                    isTransformedFromFiles = true;
                }
            });
            if(isTransformedFromFiles){
                notification['warning']({
                    message: '删除失败',
                    description: '不能删除由文件导入的目标',
                });
                return;
            }
            addBodyClass(true);
            confirm({
                title: '',
                content: hasGroupTitle.formatEL({
                    name:selectedIds.map(id=>tree.get(id).name).join(',')
                }),
                onOk: ()=>{
                    this.async = WebAPI.post('/strategy/template/removeByids',{
                        ids: selectedIds
                    }).done((rs)=>{
                        if(rs.status == 'OK'){
                            deleteIdsSet.forEach(deleteId=>{
                                tree.delete(deleteId);
                            });
                            this.setState({
                                tree,
                                selectedIds: []
                            });
                            this.updateParentMap(tree);
                        }else if(rs.msg == 'TransformedFromFiles'){
                            notification['warning']({
                                message: '删除失败',
                                description: '不能删除由文件导入的目标',
                            });
                        }
                    }).always(()=>{
                        this.async = undefined;
                        addBodyClass(false);
                    });
                },
                onCancel() {
                    addBodyClass(false);
                },
            });
        }
        onMoveto() {
            let {selectedIds} = this.state;
            if(selectedIds.length == 0){
                notification['warning']({
                    message: '移动失败',
                    description: '请选择要移动的文件',
                });
                return;
            }
            this.refs.MoveToModal.showModal(true);
        }
        onAdd() {
            const {selectedIds, tree, expandedKeys} = this.state;
            let group = selectedIds[0] || '';
            
            this.async = WebAPI.post("/strategy/template/addGroup", {
                name: '未命名',
                userId: AppConfig.userId,
                group,
            }).done(rs=>{
                if(rs.status == 'OK'){
                    this.renameSet.add(rs.data._id);
                    this.parentsMap[group] = this.parentsMap[group] || [];
                    this.parentsMap[group].push(rs.data._id);
                    tree.set(rs.data._id,rs.data);
                    if(group!=''){
                        this.onLoadData({
                            props:{
                                eventKey: group
                            }
                        }).done((rs)=>{
                            if(rs.status == 'OK'){
                                if(expandedKeys.indexOf(group)<0){
                                    expandedKeys.push(group);
                                    this.onExpand(expandedKeys);
                                }
                            }
                        });
                    }else{
                        this.setState({
                            tree,
                        })
                    }
                }
            }).always(()=>{
                this.async = undefined;
            });
        }
        loop(data) {
            const searchValue = this.state.searchValue;
            const {onlyGroup = true, excludeIds = []} = this.props;
            data = data || this.state.tree;
            let result = [];
            let children = {};
            let parents = {};
            data.forEach(item=>{
                if(item.group==''){
                    parents[item._id] = item;
                }else{
                    children[item.group] = children[item.group]||new Map();
                    children[item.group].set(item._id,item);
                }
            });
            const getTtile = (item)=>{
                const index = item.name.toLowerCase().search(searchValue.toLowerCase());
                const beforeStr = item.name.substr(0, index);
                const content = item.name.substr(index, searchValue.length);
                const afterStr = item.name.substr(index + searchValue.length);
                const title = index > -1 ? (
                    h('span',{},[
                        beforeStr,
                        h('span',{style:{ color: '#f50' }},[content]),
                        afterStr
                    ])
                ) : (h('span',{},[item.name]));
                return title;
            };
            const createChildren = (id)=>{
                let result = [];
                if(children[id]){
                    children[id].forEach(item=>{
                        if((onlyGroup && item.isGroup==0) || excludeIds.indexOf(item._id)>=0){

                        }else{
                            let props = {data: item,doRename: this.doRename,isLeaf:item.isGroup==0?true:false,key:item._id,title:getTtile(item)};
                            props.parent = this;
                            if(this.renameSet.has(item._id)){
                                let refId = 'node'+item._id;
                                props.refId = refId;
                            }
                            result.push(h(RenameTreeNode,props,createChildren(item._id)));
                        }
                    });
                }
                return result;
            };
            if(this.isSearch){
                data.forEach(item=>{
                    if((onlyGroup && item.isGroup==0) || excludeIds.indexOf(item._id)>=0){
                        
                    }else{
                        let props = {data: item,doRename: this.doRename,isLeaf:item.isGroup==0?true:false,key:item._id,title:getTtile(item)};
                        props.parent = this;
                        if(this.renameSet.has(item._id)){
                            let refId = 'node'+item._id;
                            props.refId = refId;
                        }
                        result.push(h(RenameTreeNode,props,createChildren(item._id)));
                    }
                });
            }else{
                data.forEach(item=>{
                    if(item.group==''){
                        if((onlyGroup && item.isGroup==0) || excludeIds.indexOf(item._id)>=0){
    
                        }else{
                            let props = {data: item,doRename: this.doRename,isLeaf:item.isGroup==0?true:false,key:item._id,title:getTtile(item)};
                            props.parent = this;
                            if(this.renameSet.has(item._id)){
                                let refId = 'node'+item._id;
                                props.refId = refId;
                            }
                            result.push(h(RenameTreeNode,props,createChildren(item._id)));
                        }
                    }
                });
            }
            
            return result;
        }
        doRename(id, name, afterFn) {
            //todo 接口调用
            this.async = WebAPI.post('/strategy/template/renameByid',{
                id,
                name
            }).done((rs)=>{
                if(rs.status == 'OK'){
                    let newTree = this.state.tree;
                    let node = newTree.get(id);
                    node.name = name;
                    this.setState({
                        tree: newTree
                    })
                }
            }).always(()=>{
                this.async = undefined;
                afterFn();
            });
        }
        updateParentMap(tree) {
            tree = tree || this.state.tree;
            this.parentsMap = {};
            tree.forEach(v=>{
                this.parentsMap[v.group] = this.parentsMap[v.group] || [];
                this.parentsMap[v.group].push(v.id);
            });
        }
    }

    exports.TemplateTree = TemplateTree;
}));
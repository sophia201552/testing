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
            namespace('antd')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd
) {
    var h = React.h;
    const {Tree, Input} = antd;
    const Search = Input.Search;
    const TreeNode = Tree.TreeNode;

    class RuleTree extends React.Component{
        constructor(props,context){
            super(props, context);
            this.children = {};
            this.parents = {};
            this.async = undefined;
            this.state = {
                tree:new Map(),
                expandedKeys:[],
                oldExpandedKeys:[],
                searchValue:'',
                autoExpandParent: true
            }
            
            this.searchChange = this.searchChange.bind(this);
            this.onExpand = this.onExpand.bind(this);
            this.onLoadData = this.onLoadData.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
            this.loop = this.loop.bind(this);
        }
        componentDidMount(){
            this.async = WebAPI.get("/strategy/template/group").done(rs=>{
                this.async = undefined;
                if(rs.status == 'OK'){
                    rs.data.data.forEach(v=>{
                        this.state.tree.set(v._id,v);
                    });
                    if(rs.data.data[0]){
                        this.async = WebAPI.get("/strategy/template/group/"+rs.data.data[0]._id).done(rs2=>{
                            if(rs2.status == 'OK'){
                                rs2.data.data.forEach(v=>{
                                    this.state.tree.set(v._id,v);
                                });
                            }
                        }).always(()=>{
                            this.async = undefined;
                            this.setState({
                                tree: this.state.tree,
                                expandedKeys: [rs.data.data[0]._id],
                                oldExpandedKeys: [rs.data.data[0]._id]
                            })
                        });
                    }
                }
            });
        }
        onLoadData(treeNode){
            this.async = WebAPI.get("/strategy/template/group/"+treeNode.props.eventKey).done(rs=>{
                if(rs.status == 'OK'){
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
        searchChange(e){
            const value = e.target.value;
            const {oldExpandedKeys} = this.state;
            let expandedKeys = [];
            if(value!=''){
                this.state.tree.forEach(item=>{
                    if(item.name.indexOf(value) > -1&&item.group){
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
        loop(data) {
            const searchValue = this.state.searchValue;
            let result = [];
            let children = this.children = {};
            let parents = this.parents = {};
            data.forEach(item=>{
                if(item.group==''){
                    parents[item._id] = item;
                }else{
                    children[item.group] = children[item.group]||new Map();
                    children[item.group].set(item._id,item);
                }
            });
            const getTtile = (item)=>{
                const index = item.name.search(searchValue);
                const beforeStr = item.name.substr(0, index);
                const afterStr = item.name.substr(index + searchValue.length);
                const title = index > -1 ? (
                    h('span',{},[
                        beforeStr,
                        h('span',{style:{ color: '#f50' }},[searchValue]),
                        afterStr
                    ])
                ) : (h('span',{},[item.name]));
                return title;
            };
            const createChildren = (id)=>{
                let result = [];
                if(children[id]){
                    children[id].forEach(item=>{
                        result.push(h(TreeNode,{isLeaf:item.isGroup==0?true:false,key:item._id,title:getTtile(item)},createChildren(item._id)));
                    });
                }
                return result;
            };
            data.forEach(item=>{
                if(item.group==''){
                    result.push(h(TreeNode,{isLeaf:item.isGroup==0?true:false,key:item._id,title:getTtile(item)},createChildren(item._id)));
                }
            });
            return result;
        }
        componentWillUnmount(){
            if(this.async){
                this.async.abort();
                this.async = undefined;
            }
        }
        render(){
            const {searchValue, expandedKeys, autoExpandParent} = this.state;
            return(h('div',{
                style: {
                    height: '100%'
                }
            },[
                h('div',{style:{
                    width:'auto',
                    padding: '18px 5%'
                }},[
                    h(Search,{
                        placeholder:I18n.resource.equipTree.SEARCH,
                        onChange:this.searchChange
                    },[])
                ]),
                h('div',{
                    className:'gray-scrollbar',
                    style:{
                        borderTop:'1px solid #495252',
                        padding: '0 5%',
                        height: 'calc(100% - 64px)',
                        overflow: 'auto'
                    }
                },[
                    h(Tree,{
                        expandedKeys:expandedKeys,
                        autoExpandParent:autoExpandParent,
                        onExpand:this.onExpand,
                        loadData:this.onLoadData,
                        draggable:true,
                        onDragStart:this.onDragStart
                    },this.loop(this.state.tree))
                ])
            ]));
        }
    }

    var theme = {};

    function RulePanel(props, context) {
        return (
            h('div', {
                id: 'RulePanel',
                style: { width: '100%', height: '100%' }
            },[
                h('div',{
                    className: "strategyTplTreeContent"
                },[
                    h(RuleTree)
                ])
            ])
        );
    }

    exports.RulePanel = RulePanel;
}));
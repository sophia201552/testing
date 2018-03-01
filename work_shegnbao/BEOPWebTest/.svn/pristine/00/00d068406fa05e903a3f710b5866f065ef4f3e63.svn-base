/**
 * Created by vicky on 2016/1/28.
 */
var Spinner = new LoadingSpinner({color: '#00FFFF'});
(function(){
    var _this;
    function PageScreen(){
        _this = this;
        this.layout = {
            filterPanel: undefined,
            listPanel: undefined,
            infoPanel: undefined
        }
        this.$assetFilterPanel = $('#paneAssetFilter');
        this.$assetListPanel = $('#paneAssetList');
        this.$assetInfoPanel = $('#paneAssetInfo');

        /*this.layout.filterPanel = new IOTFilter(this.$assetFilterPanel);
        this.layout.listPanel = new AssetListPanel(this,this.$assetListPanel);
        this.layout.infoPanel = new AssetInfoPanel(this,this.$assetInfoPanel);*/

        this.show();
    }

    PageScreen.prototype.show = function(){

        this.initLayout();
        this.initPanels()

    }

    PageScreen.prototype.close = function(){

    }

    PageScreen.prototype.initLayout = function(){
        var divDockManager = document.getElementById('paneDock');
        this.dockManager = new dockspawn.DockManager(divDockManager);

        //为了在加载页面的时候不出现不美观的页面,先隐藏,然后在此显示
        $('#paneAssetList').show();
        $('#tabBaseInfo').show();

        var onResized = function(e) {
            _this.dockManager.resize(window.innerWidth);
        };

        this.dockManager.initialize();
        var documentNode = this.dockManager.context.model.documentManagerNode;
        // 自适应
        window.onresize = onResized;
        onResized(null);

        this.layout.filterPanel = new dockspawn.PanelContainer(this.$assetFilterPanel[0], this.dockManager, '导航');
        this.layout.listPanel = new dockspawn.PanelContainer(this.$assetListPanel[0], this.dockManager, '设备列表');
        this.tabBaseInfo = new dockspawn.PanelContainer($('#tabBaseInfo')[0], this.dockManager, '基本信息');
        this.hisData = new dockspawn.PanelContainer($('#paneHisData')[0], this.dockManager, '历史数据');


        var dockFilter = this.dockManager.dockLeft(documentNode, this.layout.filterPanel,300);
        this.dockList = this.dockManager.dockFill(documentNode, this.layout.listPanel);
        var dockInfo = this.dockManager.dockRight(documentNode, this.tabBaseInfo,350);

        //var dockHisData = dockManager.dockDown(dockList, this.hisData);

        this.tabNameplate = new dockspawn.PanelContainer($('#tabNameplate')[0], this.dockManager, '铭牌');
        this.tabRealtimeData = new dockspawn.PanelContainer($('#tabRealtimeData')[0], this.dockManager, '实时数据');
        this.tabMaintenance = new dockspawn.PanelContainer($('#tabMaintenance')[0], this.dockManager, '维修保养');
        this.tabDiagnosis = new dockspawn.PanelContainer($('#tabDiagnosis')[0], this.dockManager, '诊断');
        //this.tabFileManage = new dockspawn.PanelContainer($('#fileManage')[0], dockManager, '文件管理');
        this.tabPaneWorkflow = new dockspawn.PanelContainer($('#tabWorkflow')[0], this.dockManager, '发布工单');

        //_dockManager.dockFill(dockInfo, _this.tabBaseInfo, .16);
        this.dockManager.dockFill(dockInfo, this.tabNameplate);
        this.dockManager.dockFill(dockInfo, this.tabRealtimeData);
        this.dockManager.dockFill(dockInfo, this.tabMaintenance);
        this.dockManager.dockFill(dockInfo, this.tabDiagnosis);
        //dockManager.dockFill(dockInfo, this.tabFileManage);
        this.dockManager.dockFill(dockInfo, this.tabPaneWorkflow);
    }


    PageScreen.prototype.initPanels = function(){
        this.initPanelFilter();
        this.initPanelList();
        this.initPanelInfo();
    }

    PageScreen.prototype.initPanelFilter = function(){
        this.filterPanel = new HierFilter(this.$assetFilterPanel,null,_this);
        this.filterPanel.init();
        this.$tbAsset = $('#tbAsset');
        var option = {
            class:{
                'projects':{
                    showNone:true
                },
                'groups':{
                    class:['Group']
                }
            },
            tree:{
                show:true,
                event:{
                    click:[
                        {
                            act:onNodeClick,
                            tar:['groups','projects']
                        },
                        {
                            act:function(){
                                console.log('click things')
                            },
                            tar:'things'
                        }
                    ]
                },
                drag:{
                    enable:true,
                    dragstart:[
                        {
                            act:function(e,treeNode){
                                console.log('dragstart things')
                            },
                            tar:'things'
                        },
                        {
                            act:function(e,treeNode){
                                console.log('dragstart groups')
                            },
                            tar:'groups'
                        }

                    ],
                    drop:function(e,treeNode){
                        console.log('drop');
                    }
                },
                tool: {
                    delete: deleteNode,
                    add: {
                        act:addNode,
                        default:true
                    },
                    edit: editNode
                }
            }
        };

        this.filterPanel.setOption(option);
        //this.filterPanel = new IOTFilter(this.$assetFilterPanel);
        //this.filterPanel.show();
        function onNodeClick(event, treeId, treeNode ){
            Spinner.spin($('#paneAssetList')[0]);
            if(treeNode.baseType != 'things'){
                _this.getThingInfoList(treeNode);
            }else{
                //默认选中该tr
                $('[data-id="'+ treeNode._id +'"]').show().click().siblings('tr').hide();
                Spinner.stop();
            }
        }
        function onNodeDblClick(event, treeId, treeNode, widget){
        }

        function deleteNode(treeNode){
            if(treeNode.baseType == 'things'){
                _this.$tbAsset.find('[data-id="'+ treeNode._id +'"]').remove();
            }else if(treeNode.baseType == 'groups'){
                _this.getThingInfoList(treeNode.getParentNode());
            }
        }

        function addNode(arrParent){
            if(arrParent.baseType == 'things'){
                _this.getThingInfoList(arrParent[0]);
            }
        }

        function editNode(treeNode){
            if(treeNode.baseType == 'things'){
                _this.getThingInfoList(treeNode.getParentNode());
            }
        }
    };

    PageScreen.prototype.initPanelList = function(){
        this.listPanel = new AssetListPanel(this,this.$assetListPanel);
        this.listPanel.show()
    }

    PageScreen.prototype.initPanelInfo = function(){
        this.infoPanel = new AssetInfoPanel(this,this.$assetInfoPanel);
        this.infoPanel.show();
        //默认显示第一个:基本信息
        $('.tab-handle:eq(1)').click();
    }

    PageScreen.prototype.getThingInfoList = function(treeNode){
        WebAPI.get('/asset/getThingInfoList/'+ treeNode._id).done(function(result){
            //拼接数据
            if(result.data && result.data.length > 0 && treeNode.children && treeNode.children.length > 0){
                result.data.forEach(function(data){
                    treeNode.children.forEach(function(node){
                        if(data._id == node._id){
                            data.name = node.name;
                            data.type = node.type;
                        }
                    });
                });
            }
            //渲染到页面
            _this.listPanel.render(result.data, treeNode);
            //默认选中第一个
            if($('#tbAsset tbody tr:eq(0)').length > 0){
                $('#tbAsset tbody tr:eq(0)').click();
            }else{
                //信息面板置空
                $('.panel-base:eq(1) input').val('');
                $('.panel-base:eq(1) textarea').val('');
                $('#divAssetImg').empty();
                $('#divQRCodeImg').empty();
                $('#divNameplate label').empty();
            }

            if (_this.filterPanel.setDefault === true){
                var node = treeNode.children[0];
                _this.filterPanel.tree.selectNode(node);
                _this.filterPanel.tree.setting.callback.onClick({target:document.getElementById(node.tId)}, node['_id'], node);
                _this.filterPanel.setDefault = false
            }
        }).always(function(){
            Spinner.stop();
        });
    }
    
    new PageScreen();
}());
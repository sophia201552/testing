/**
 * Created by vicky on 2016/1/28.
 */
var Spinner = new LoadingSpinner({color: '#00FFFF'});

try {
    if (ElScreenContainer) {
    }
} catch (e) {
    ElScreenContainer = document.body;
}

try {
    if (AppConfig) {
    }
} catch (e) {
    AppConfig = {
        userId: 1
    }
}

(function () {
    var _this;

    function PageScreen() {
        _this = this;
        this.layout = {
            filterPanel: undefined,
            listPanel: undefined,
            infoPanel: undefined
        };
        this.$assetFilterPanel = $('#paneAssetFilter');
        this.$assetListPanel = $('#paneAssetList');
        this.$assetInfoPanel = $('#paneAssetInfo');
        this.$projectConfigPanel = $('#paneProjectConfig');

        this.projectConfig = undefined;
        /*this.layout.filterPanel = new IOTFilter(this.$assetFilterPanel);
         this.layout.listPanel = new AssetListPanel(this,this.$assetListPanel);
         this.layout.infoPanel = new AssetInfoPanel(this,this.$assetInfoPanel);*/
        this.displayParams = {arrKey: ['type', 'name', 'desc', 'manager', 'updateTime', 'endTime', 'status', 'model']};//
        this.show();
    }

    PageScreen.prototype.show = function () {
        var projectId = parseInt(location.href.split('projectId=')[1].split('&')[0]);//window.location.search.match(/\d+/g)
        projectId = parseInt(projectId);
        if (!isNaN(projectId)) {
            AppConfig.projectId = projectId
        }
        InitI18nResource(navigator.language.split('-')[0]).always(function (rs) {
            I18n = new Internationalization(null, rs);
            _this.initLayout();
            _this.initPanels()
        });

    };

    PageScreen.prototype.close = function () {

    };

    PageScreen.prototype.initLayout = function () {
        var divDockManager = document.getElementById('paneDock');
        this.dockManager = new dockspawn.DockManager(divDockManager);

        //为了在加载页面的时候不出现不美观的页面,先隐藏,然后在此显示
        $('#paneAssetList').show();
        $('#tabBaseInfo').show();

        var onResized = function (e) {
            _this.dockManager.resize(window.innerWidth, window.innerHeight);
        };

        this.dockManager.initialize();
        var documentNode = this.dockManager.context.model.documentManagerNode;
        // 自适应
        window.onresize = onResized;
        onResized(null);

        this.layout.filterPanel = new dockspawn.PanelContainer(this.$assetFilterPanel[0], this.dockManager, '<span>导航</span><span id="btnTabState">'+ I18n.resource.asset.navigation.BTN_STATE +'</span>');
        this.layout.listPanel = new dockspawn.PanelContainer(this.$assetListPanel[0], this.dockManager, '设备列表');
        this.tabBaseInfo = new dockspawn.PanelContainer($('#tabBaseInfo')[0], this.dockManager, '基本');
        this.hisData = new dockspawn.PanelContainer($('#paneHisData')[0], this.dockManager, '历史');


        var dockFilter = this.dockManager.dockLeft(documentNode, this.layout.filterPanel, 300);
        this.dockList = this.dockManager.dockFill(documentNode, this.layout.listPanel);
        var dockInfo = this.dockManager.dockRight(documentNode, this.tabBaseInfo, 350);

        //var dockHisData = dockManager.dockDown(dockList, this.hisData);

        this.tabNameplate = new dockspawn.PanelContainer($('#tabNameplate')[0], this.dockManager, '铭牌');
        this.tabRealtimeData = new dockspawn.PanelContainer($('#tabRealtimeData')[0], this.dockManager, '实时');
        this.tabPreventiveMaintain = new dockspawn.PanelContainer($('#tabPreventiveMaintain')[0], this.dockManager, '预防性维护');
        //this.tabDiagnosis = new dockspawn.PanelContainer($('#tabDiagnosis')[0], this.dockManager, '诊断');
        //this.tabFileManage = new dockspawn.PanelContainer($('#fileManage')[0], dockManager, '文件管理');
        this.tabMaintainRecord = new dockspawn.PanelContainer($('#tabMaintainRecord')[0], this.dockManager, '维修记录');
        this.tabPaneSpareParts = new dockspawn.PanelContainer($('#tabSpareParts')[0], this.dockManager, '零配件');
        this.tabOutOfStorageRecords = new dockspawn.PanelContainer($('#tabOutOfStorageRecords')[0], this.dockManager, '出入库记录');
       // this.tabPaneWorkflow = new dockspawn.PanelContainer($('#tabWorkflow')[0], this.dockManager, '任务');
        this.tabDiagnosticRecords = new dockspawn.PanelContainer($('#tabDiagnosticRecords')[0], this.dockManager, '诊断记录');

        //_dockManager.dockFill(dockInfo, _this.tabBaseInfo, .16);
        this.dockManager.dockFill(dockInfo, this.tabNameplate);
        this.dockManager.dockFill(dockInfo, this.tabRealtimeData);
        //this.dockManager.dockFill(dockInfo, this.tabPaneWorkflow);
        this.dockManager.dockFill(dockInfo, this.tabPreventiveMaintain);
        //this.dockManager.dockFill(dockInfo, this.tabDiagnosis);
        //dockManager.dockFill(dockInfo, this.tabFileManage);
        this.dockManager.dockFill(dockInfo, this.tabPaneSpareParts);
        this.dockManager.dockFill(dockInfo, this.tabMaintainRecord);
        this.dockManager.dockFill(dockInfo, this.tabOutOfStorageRecords);
        this.dockManager.dockFill(dockInfo, this.tabDiagnosticRecords);
    };


    PageScreen.prototype.initPanels = function () {
        this.initPanelFilter();
        this.initPanelList();
        this.initPanelInfo();
    };

    PageScreen.prototype.initPanelFilter = function () {
        this.filterPanel = new HierFilter(this.$assetFilterPanel, null, _this);
        this.filterPanel.init();
        this.$tbAsset = $('#tbAsset');
        var option = {
            class: {
                'projects': {
                    showNone: true
                },
                'groups': {
                    class: 'Group'
                }
            },
            tree: {
                show: true,
                event: {
                    click: [
                        {
                            act: onNodeClick,
                            tar: 'all'
                        },
                        {
                            act: function () {
                                console.log('click things')
                            },
                            tar: 'things'
                        }
                    ],
                    addDom: function (treeNode, $target) {
                        if (treeNode.baseType == 'projects') {
                            var btnProjEdit = document.createElement('span');
                            btnProjEdit.className = 'btnProjEdit btnTreeNode glyphicon glyphicon-cog';
                            $target.children('a').append(btnProjEdit);
                            btnProjEdit.onclick = function (e) {
                                e.stopPropagation();
                                if (!_this.projectConfig || treeNode.getPath()[0]['_id'] != _this.projectConfig['projId']) {
                                    WebAPI.get('iot/getProjectConfig/' + treeNode['_id']).done(function (result) {
                                        _this.projectConfig = result.data;
                                        _this.projectPanel.show(treeNode, _this.projectConfig);
                                    });
                                } else {
                                    _this.projectPanel.show(treeNode, _this.projectConfig);
                                }
                                return false;
                            }
                        }
                    }
                },
                drag: {
                    enable: true,
                    dragstart: [
                        {
                            act: function (e, treeNode) {
                                console.log('dragstart things')
                            },
                            tar: 'things'
                        },
                        {
                            act: function (e, treeNode) {
                                console.log('dragstart groups')
                            },
                            tar: 'groups'
                        }

                    ],
                    drop: function (e, treeNode) {
                        console.log('drop');
                    }
                },
                tool: {
                    delete: deleteNode,
                    add: {
                        act: addNode,
                        default: true
                    },
                    edit: editNode
                }
            }
        };

        this.filterPanel.setOption(option);

        var asetStatePanel = undefined;
        $('#btnTabState').off('click').on('click', function(){
            if(!asetStatePanel){
                asetStatePanel = new AssetStatePanel();
            }
            $(this).toggleClass('showPane');
            if($(this).hasClass('showPane')){
                asetStatePanel.show();
                $(this).text(I18n.resource.asset.navigation.BTN_CLOSE_STATE);
                _this.$assetFilterPanel.one('click',closePanel);
            }else{
                asetStatePanel.close();
                $(this).text(I18n.resource.asset.navigation.BTN_STATE);
            }

            function closePanel(){
                if($('#btnTabState').hasClass('showPane')){
                    $('#btnTabState').click();
                }
            }
        });
        function onNodeClick(event, treeId, treeNode) {
            Spinner.spin($('#paneAssetList')[0]);
            $('#paneProjectConfig').hide();
            if ((!_this.projectConfig || treeNode.baseType == 'projects' || treeNode.getPath()[0]['_id'] != _this.projectConfig['projId'])) {
                WebAPI.get('iot/getProjectConfig/' + treeNode['_id']).done(function (result) {
                    _this.projectConfig = result.data;
                    //temp todo
                    if (treeNode.baseType != 'things') {
                        _this.getThingInfoList(treeNode);
                    } else {
                        //默认选中该tr
                        if ($('[data-id="' + treeNode._id + '"]').length != 0) {
                            $('[data-id="' + treeNode._id + '"]')[0].scrollIntoView();
                            $('[data-id="' + treeNode._id + '"]').show().click();
                        } else {
                            var index = treeNode.getIndex();
                            _this.getThingInfoList(treeNode.getParentNode(), index)
                        }
                        Spinner.stop();
                    }
                })
            }
            if (treeNode.baseType != 'things') {
                _this.getThingInfoList(treeNode);
            } else {
                //默认选中该tr
                if ($('[data-id="' + treeNode._id + '"]').length != 0) {
                    $('[data-id="' + treeNode._id + '"]')[0].scrollIntoView();
                    $('[data-id="' + treeNode._id + '"]').show().click();
                } else {
                    var index = treeNode.getIndex();
                    _this.getThingInfoList(treeNode.getParentNode(), index);
                }
                Spinner.stop();
            }
        }

        function onNodeDblClick(event, treeId, treeNode, widget) {
        }

        function deleteNode(treeNode) {
            if (treeNode.baseType == 'things') {
                _this.$tbAsset.find('[data-id="' + treeNode._id + '"]').remove();
                var index = _this.$tbAsset.find('tr').length;
                _this.getThingInfoList(treeNode.getParentNode(), index);
            } else if (treeNode.baseType == 'groups') {
                _this.getThingInfoList(treeNode.getParentNode());
            }
        }

        function addNode(arrParent, arrNode) {
            if (arrNode[0].baseType == 'things') {
                var index = _this.$tbAsset.find('tr').length - 1;
                _this.getThingInfoList(arrParent[0], index);
            }
        }

        function editNode(treeNode) {
            if (treeNode.baseType == 'things') {
                var index = _this.$tbAsset.find('.tr').index(_this.$tbAsset.find('[data-id="' + treeNode._id + '"]'));
                _this.getThingInfoList(treeNode.getParentNode(), index);
            }
        }
    };

    PageScreen.prototype.initPanelList = function () {
        this.listPanel = new AssetListPanel(this, this.$assetListPanel);
        this.listPanel.show();

        this.projectPanel = new AssetProjConfig(this, $('#paneProjectConfig'));
    };

    PageScreen.prototype.initPanelInfo = function () {
        //默认显示第一个:基本信息
        $('.tab-handle:eq(1)')[0].click();
    };

    PageScreen.prototype.getThingInfoList = function (treeNode, index, config) {
        this.displayParams = this.projectConfig && this.projectConfig.arrStick && this.projectConfig.arrStick.length > 0 ? {arrKey: this.projectConfig.arrStick} : {arrKey: ['type', 'name', 'desc', 'manager', 'updateTime', 'endTime', 'status', 'model']};
        //WebAPI.get('/asset/getThingInfoList/'+ treeNode._id).done(function(result){
        WebAPI.post('/asset/getThingInfoList/' + treeNode._id, this.resetArrKey()).done(function (result) {
            //拼接数据
            if (result.data && result.data.length > 0 && treeNode.children && treeNode.children.length > 0) {
                result.data.forEach(function (data) {
                    treeNode.children.forEach(function (node) {
                        if (data._id == node._id) {
                            data.name = node.name;
                            data.type = node.type;
                        }
                    });
                });
            }

            //渲染到页面
            _this.listPanel.render(result.data, treeNode, _this.displayParams);

            $("#totalEquipment").html('合计：' + $("#tbAsset").find("tbody").find("tr").length + '台');
            //默认选中第一个
            if (typeof index == 'undefined') {
                index = 0;
                var firstLoad = 0;
            }
            if ($('#tbAsset tbody tr').eq(index).length > 0) {
                $('#tbAsset tbody tr').eq(index).click();
                if (firstLoad != 0 && $('[data-id="' + treeNode.children[index]._id + '"]').length != 0) {
                    $('[data-id="' + treeNode.children[index]._id + '"]')[0].scrollIntoView();
                }
            } else {
                //信息面板置空
                $('.panel-base:eq(1) input').val('');
                $('.panel-base:eq(1) textarea').val('');
                $('#divAssetImg').empty();
                $('#divQRCodeImg').empty();
                $('#divNameplate label').empty();
            }

            if (_this.filterPanel.setDefault === true) {
                if (!(treeNode.children && treeNode.children[0]))return;
                var node = treeNode.children[0];
                _this.filterPanel.tree.selectNode(node);
                _this.filterPanel.tree.setting.callback.onClick({target: document.getElementById(node.tId)}, node['_id'], node);
                _this.filterPanel.setDefault = false
            }
        }).always(function () {
            Spinner.stop();
        });
    };
    PageScreen.prototype.resetArrKey = function () {
        if (!(this.displayParams && this.displayParams.arrKey))return {};
        var arrKey = [].concat(this.displayParams.arrKey);
        var addKey = ['type', 'model'];
        var index;
        for (var i = 0; i < arrKey.length; i++) {
            if (addKey.length == 0)break;
            index = addKey.indexOf(arrKey[i]);
            if (index > 0) {
                addKey.splice(index, 1)
            }
        }
        arrKey = [].concat(this.displayParams.arrKey, addKey);
        return {arrKey: arrKey};
    };

    new PageScreen();
}());
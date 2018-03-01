;(function () {

    function MergeNavModal() {
        this.$modal = null;
        this.callback = null;
        this.operationType = 'import', //'import', 'publish'
        this.idProjectOffline = undefined;
        this.idProjectOnline = undefined;
        this.treeOnline = undefined;
        this.treeOffline = undefined;
        this.treeResultAll = undefined;
        this.store = {};
    }

    +function () {
        this.show = function (idProjectOnline, idProjectOffline, operationType) {
            var _this = this;

            if (!idProjectOnline) {
                alert('Please create an online project first!');
                return;
            }

            this.store = {
                nodesOnlineTree: [],
                nodesOfflineTree: []
            };
            this.idProjectOffline = idProjectOffline;
            this.idProjectOnline = idProjectOnline;
            this.operationType = operationType ? operationType : 'import';
            var $wrap = $(document.body);

            // 获取组件的 HTML
            WebAPI.get('/static/app/WebFactory/scripts/modals/mergeNavModal/mergeNavModal.html')
            .done(function (html) {
                _this.$modal = $(html);
                $wrap.append(_this.$modal);
                _this.init();
                _this.$modal.modal('show');

                if (_this.operationType == 'publish') {
                    $('#panePublishForm').show();
                    $('#titleResultType').text(_this.operationType.toUpperCase() + " : " + AppConfig.project.cnName);
                }
            });
        };

        this.init = function () {
            var _this = this;
            I18n.fillArea(this.$modal);

            $.when(this.requestOnlineNav(), this.requestOfflineNav()).then(function () {
                _this.initTree();
                _this.attachEvents();
            });

            $('#selProjectList', this.$modal).trigger('change');
        };

        this.initTree = function () {
            var _this = this;
            this.initTreeResultData();

            var ztreeSetting = {
                view: {
                    fontCss: function (treeId, node) { return node.font ? node.font : {}; },
                    nameIsHTML: true
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false,
                    drag: {
                        inner:false
                    }
                },
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true,
                    }
                },
                callback: {
                    onCheck: function (event, treeId, treeNode) {
                        //有一个未选中 就取消全选
                        var currentTree;
                        if(treeId === "treeNavOnline"){//线上
                            currentTree = _this.treeOnline;
                        }else{
                            currentTree = _this.treeOffline;
                        }
                        var checkNodes = currentTree.getCheckedNodes(true);
                        var outChildren = [];
                        for(var c=0,cl=checkNodes.length;c<cl;c++){
                            if(checkNodes[c].pId === null){
                                outChildren.push(checkNodes[c]);
                            }
                        }
                        if(outChildren < currentTree.getNodes(true)){
                            $("#"+treeId).prev("div").find(".allSelect").attr("checked",false);
                        }
                        //判断当前是否是选中
                        if (treeNode.checked) {
                            _this.treeResult.addNodes(_this.treeResult.getNodeByParam('id', treeNode.pId, null), -1, treeNode);
                        }
                        else {
                            var arr = _this.treeResult.getNodesByParam('id', treeNode.id, null);
                            for(var k=0,kl=arr.length;k<kl;k++){
                                if(treeNode.isOnline === arr[k].isOnline){
                                    _this.treeResult.removeNode(arr[k], false);
                                }
                            } 
                        }
                    },
                    beforeDrag: function (treeId, treeNodes) {
                        if (treeId === 'treeNavOffline' || treeId === 'treeNavOnline') {
                            return false;
                        }
                        for (var i = 0, l = treeNodes.length; i < l; i++) {
                            if (treeNodes[i].drag === false) {
                                return false;
                            }
                        }
                        return true;
                    },
                    beforeDrop: function (treeId, treeNodes, targetNode, moveType) {
                        if (treeId === 'treeNavOffline' || treeId === 'treeNavOnline') {
                            return false;
                        }
                        
                        return targetNode ? targetNode.drop !== false : true;
                    },
                    onDrop: function (e, treeId, treeNodes, targetNode, moveType) {
                        
                    }
                }
            };

            this.treeOnline = $.fn.zTree.init($('#treeNavOnline'), ztreeSetting, this.store.nodesOnlineTree);
            this.treeOffline = $.fn.zTree.init($('#treeNavOffline'), ztreeSetting, this.store.nodesOfflineTree);

            ztreeSetting.check.enable = false;
            this.treeResult = $.fn.zTree.init($('#treeNavResult'), ztreeSetting, this.store.nodesResultTree);
        };

        // 事件绑定
        this.attachEvents = function () {
            var _this = this;

            this.$modal.off();

            this.$modal.on('hidden.bs.modal', function () {
                _this.close();
            });

            $('#btnSubmit', this.$modal).off().on('click', function () {
                var url;
                switch (_this.operationType) {
                    case 'import': url = '/factory/importOnlineProjectWithMerging'; break;
                    case 'publish': url = '/factory/publishWithMerging'; break;
                    default: return;
                }
                
                var postData = _this.prepareSubmitData();
                if (!postData) return;
                Spinner.spin($('#mergeNavModalWrap')[0]);
                WebAPI.post(url, postData).done(function (result) {
                    if (result.status == 'OK') {
                        _this.close();
                        alert('Success');
                    }
                    else {
                        alert(result.msg);
                    }
                }).always(function () { Spinner.stop(); });
            });

            $('#addClose,#addCancel', this.$modal).off().on('click', function () {
                _this.close();
            });
            //全选
            $('.allSelect', this.$modal).off("click").on("click",function(){
                var $allOptionsParent = $(this).closest("div").next();
                $(this).siblings("input")[0].checked = false;
                var currentTree;
                if($allOptionsParent.hasClass("treeNavOnline")){//online
                    currentTree = _this.treeOnline;
                }else{//factory offline
                    currentTree = _this.treeOffline;
                }
                if(this.checked){
                    //清空结果中的树 重新渲染
                    var currentSelectedArr = currentTree.getCheckedNodes(true);
                    for(var r=0,rLength=currentSelectedArr.length;r<rLength;r++){
                        var arr = _this.treeResult.getNodesByParam('id', currentSelectedArr[r].id, null);
                        for(var k=0,kl=arr.length;k<kl;k++){
                            if(currentSelectedArr[r].isOnline === arr[k].isOnline){
                                _this.treeResult.removeNode(arr[k], false);
                            }
                        } 
                    }

                    currentTree.checkAllNodes(true);
                    var selectArr = currentTree.getCheckedNodes(true);
                    for(var i=0,length=selectArr.length;i<length;i++){
                        if(selectArr[i].pId === null){
                            _this.treeResult.addNodes(_this.treeResult.getNodeByParam('id', selectArr[i].pId, null), -1, selectArr[i]);
                        }
                    }
                }else{
                    var selectArr = currentTree.getCheckedNodes(true);
                    currentTree.checkAllNodes(false);
                    for(var j=0,jLength=selectArr.length;j<jLength;j++){
                        var arr = _this.treeResult.getNodesByParam('id', selectArr[j].id, null);
                        for(var k=0,kl=arr.length;k<kl;k++){
                            if(selectArr[j].isOnline === arr[k].isOnline){
                                _this.treeResult.removeNode(arr[k], false);
                            }
                        } 
                    }
                }
            });
            //反选
            $('.reverseSelect', this.$modal).off("click").on("click",function(){
                var $allOptionsParent = $(this).closest("div").next();
                $(this).siblings("input")[0].checked = false;
                var currentTree;
                if($allOptionsParent.hasClass("treeNavOnline")){//online
                    currentTree = _this.treeOnline;
                }else{
                    currentTree = _this.treeOffline;
                }
                var selectArr = currentTree.getCheckedNodes(true);//被选中的
                var noSelectArr = currentTree.getCheckedNodes(false);//未被选中的
                if (selectArr.length>0) { 
                    for(var i=0,length=selectArr.length;i<length;i++){
                        var arr = _this.treeResult.getNodesByParam('id', selectArr[i].id, null);
                        for(var k=0,kl=arr.length;k<kl;k++){
                            if(selectArr[i].isOnline === arr[k].isOnline){
                                _this.treeResult.removeNode(arr[k], false);
                            }
                        } 
                        currentTree.checkNode(selectArr[i], false, true);//取消选中
                    }
                }
                if (noSelectArr.length>0) { 
                    //清空结果中的树 重新渲染
                    // var currentSelectedArr = currentTree.getCheckedNodes(true);
                    // for(var r=0,rLength=currentSelectedArr.length;r<rLength;r++){
                    //     _this.treeResult.removeNode(_this.treeResult.getNodeByParam('id', currentSelectedArr[r].id, null), false);
                    // }
                    for(var i=0,length=noSelectArr.length;i<length;i++){
                        if(noSelectArr[i].pId === null){
                            _this.treeResult.addNodes(_this.treeResult.getNodeByParam('id', noSelectArr[i].pId, null), -1, noSelectArr[i]);
                        }
                        currentTree.checkNode(noSelectArr[i], true, true);
                    }
                }
            });
        };

        this.prepareSubmitData = function () {
            var navIdOnline = [], navIdOffline = [], navIdResult = [], nodes;

            nodes = this.treeResult.transformToArray(this.treeResult.getNodes());
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].isOnline) { navIdOnline.push(nodes[i].id); }
                else { navIdOffline.push(nodes[i].id); }
                navIdResult.push(nodes[i].id);
            }

            var data = {
                'navIdOnline': navIdOnline,
                'navIdOffline': navIdOffline,
                'navIdResult': navIdResult
            }
            if (this.operationType == 'import') {
                data.sourceId = this.idProjectOnline;
                data.targetId = this.idProjectOffline;
            }
            else if (this.operationType == 'publish') {
                var txtPwd = $('#inputPwd').val(), txtMsg = $('#inputMsg').val();
                if (!(txtPwd && txtMsg)) {
                    alert('Password and log is necessary!')
                    return undefined;
                }

                data.sourceId = this.idProjectOffline;
                data.targetId = this.idProjectOnline;
                data.userId = AppConfig.userId;
                data.password = $('#inputPwd').val();
                data.msg = $('#inputMsg').val();
            }
            return data
        };

        this.requestOnlineNav = function () {
            var deferred = $.Deferred(), _this = this;
            if (this.idProjectOnline) {
                WebAPI.get("/get_plant_pagedetails/" + this.idProjectOnline + "/all").done(function (result) {
                    _this.initTreeOnlineData(result);
                }).always(function () {
                    deferred.resolve();
                });
            } else { deferred.resolve(); }
            return deferred.promise();
        };

        this.requestOfflineNav = function () {
            var deferred = $.Deferred(), _this = this;;
            WebAPI.get('/factory/getPageList/' + this.idProjectOffline + '/1').done(function (result) {
                if (result.status === 'OK') {
                    _this.initTreeOfflineData(result.data);
                } else {
                    alert(result.msg);
                }
            }).always(function () {
                deferred.resolve();
            });
            return deferred.promise();
        };

        this.initTreeOnlineData = function (rs) {
            //s3db组态页面，暂不处理
            for (var i = 0, item; i < rs.navItems.length; i++) {
                item = rs.navItems[i];
                this.store.nodesOnlineTree.push({
                    id: item.id,
                    pId: item.parent,
                    name: item.text,
                    navItemType: item.type,
                    open: true,
                    isOnline: true, //标示是否为线上项目菜单
                    modeMerge: 1,  //标示是否需要merge， 0不需要， 1新增， 2移除
                });
            }
        };

        this.initTreeOfflineData = function (rs) {
            for (var i = 0, item; i < rs.length; i++) {
                item = rs[i];
                this.store.nodesOfflineTree.push({
                    id: item._id,
                    pId: item.parent,
                    name: item.text,
                    navItemType: item.type,
                    open: true,
                    isOnline: false, //标示是否为线上项目菜单
                    modeMerge: 1,  //标示是否需要merge， 0不需要， 1新增， 2移除
                });
            }
        };

        this.initTreeResultData = function () {
            var treeSource = [], treeTarget = [];
            this.store.nodesResultTree = [];

            switch (this.operationType) {
                case 'import': treeSource = this.store.nodesOnlineTree; treeTarget = this.store.nodesOfflineTree; break;
                case 'publish': treeSource = this.store.nodesOfflineTree; treeTarget = this.store.nodesOnlineTree; break;
                default: return;
            }
            //确定merge状态， 默认为1，新增
            for (var i = 0; i < treeSource.length; i++) {
                //不需merge的项目，标为0
                for (var j = 0; j < treeTarget.length; j++) {
                    if (treeTarget[j].id == treeSource[i].id) {
                        treeTarget[j].modeMerge = treeSource[i].modeMerge = 0;
                        break;
                    }
                }
                treeSource[i].checked = true;
                treeSource[i].font = { 'color': '#c23531' };

                if (treeSource[i].modeMerge == 1) treeSource[i].font = { 'background-color': '#32cd32', 'color': '#c23531' };
                this.store.nodesResultTree.push(treeSource[i]);
            }
            //若为source中没有项目，则单独添加
            for (var i = 0; i < treeTarget.length; i++) {
                if (treeTarget[i].modeMerge == 1) {
                    treeTarget[i].checked = true;
                    treeTarget[i].font = { 'background-color': '#87cefa' }
                    this.store.nodesResultTree.push(treeTarget[i]);
                }
            }

            switch (this.operationType) {
                case 'import': this.store.nodesOnlineTree = treeSource; this.store.nodesOfflineTree = treeTarget; break;
                case 'publish': this.store.nodesOfflineTree = treeSource; this.store.nodesOnlineTree = treeTarget; break;
                default: return;
            }
            treeSource = null, treeTarget = null;

            ////处理数据显示
            //for (var i = 0, item; i < this.store.nodesResultTree.length; i++) {
            //    item = this.store.nodesResultTree[i];
            //    //item.realName = item.name;
            //    item.name = item.name + ' - ' + item.isOnline ? 'Online' : 'Offline';
            //    this.store.nodesResultTree[i] = item;
            //}
        };

        // 重置组件状态
        this.reset = function () {
            
        };

        this.close = function () {
            this.store = {};
            this.$modal.remove();
        };

    }.call(MergeNavModal.prototype);

    window.MergeNavModal = new MergeNavModal();

}());
var TerminalDebugging = (function () {
    var _this;

    function TerminalDebugging() {
        _this = this;
        this.jqueryMap = {};
        this.stateMap = {};
        this.currentPage = 1;
        this.currentDtuName = '';
        this.page_size = 1000;
        this.dtunameCollection = [];
        this.data = null;
        this.zNodes = [];
        this.currentDtuInfo = [];
        //搜索类型
        this.filterType = {
            'name': 0,
            'value': 1,
            'range': 2,
            'time': 3,
            'explain': 4,
            'define': 5,
            'tag': 6
        };
        this.searchModel = {
            filterType: 0,
            isAdvance: false,
            text: ''
        };
        this.pointType = {
            mapping: 0 || null,
            Algorithm: 1,
            Calculation: 2
        };
    }

    TerminalDebugging.prototype.constructor = TerminalDebugging;
    TerminalDebugging.prototype = {

        show: function () {
            Spinner.spin(ElScreenContainer);
            WebAPI.get("/static/views/observer/terminalDebugging.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.stateMap.$container = $('#terminalDebugContainer');
                _this.historyStatusPopover = $('#deleteExpiredData').popover({
                    html: true,
                    placement: 'bottom',
                    content: 'clear time setting', // 必须设置content有值
                    container: $("#realTimeBtnBox"),
                    template: $('#tpl_real_time_popover').html()
                });
                _this.getDtuList();
                _this.setJqueryMap();
                _this.attachEvents();
                _this.refreshFilter(_this.filterType.name);
            });
        },

        getDtuInfoData: function () {
            for (var key in _this.dtu_list) {
                for (var i = 0; i < _this.dtu_list[key].length; i++) {
                    _this.dtunameCollection.push(_this.dtu_list[key]);
                }
            }
        },

        getDtuList: function () {
            // /terminal/list_dtu 默认全部, /terminal/list_dtu/type (非0)权限筛选
            Spinner.spin($('#debugLeftContainer')[0]);
            _this.ajaxDtuList().done(function (result) {
                if (result.success) {
                    //_this.data = result.data;
                    _this.data = _this.getSortedData(result.data);
                    _this.dtu_list = _this.sorting_data(_this.data);
                    _this.getDtuInfoData();
                    _this.searchDtuList = _this.dtu_list;
                    _this.dtuNameSelector();
                    _this.getOnlineOrOfflineDtuList(_this.data);
                    _this.dtuNameID = $('#selectType').attr('value');
                    _this.renderPage();
                    if (!_this.setRemarkedDtu) {
                        _this.jqueryMap.$dtuUl.find('li:first').addClass('active').siblings().removeClass('active');
                    } else {
                        _this.jqueryMap.$dtuUl.find('[data-dtuname = "' + _this.setRemarkedDtu.dbname + '"]').addClass('active').siblings().removeClass('active');
                        if (_this.setRemarkedDtu.online == 'Online') {
                            _this.jqueryMap.$dtuUl.find('[data-id =' + _this.setRemarkedDtu.id + ']').css('background', 'rgba(76, 174, 76, 0.6)');
                        } else {
                            _this.jqueryMap.$dtuUl.find('[data-id =' + _this.setRemarkedDtu.id + ']').css('background', 'rgba(230, 0, 0, 0.3)');
                        }
                    }
                    Spinner.stop();
                }
            })
        },
        // 排序
        getSortedData: function (data) {
            var hasBeopdata = [],
                notHasBeopdata = [];
            data.map(function (item) {
                if (item.dbname.indexOf('beopdata_') !== -1) {
                    hasBeopdata.push(item);
                } else {
                    notHasBeopdata.push(item);
                }
            });

            function sortDbName(dbNameData) {
                if (dbNameData.length) {
                    dbNameData.sort(function (a, b) {
                        return a.dbname.toLocaleLowerCase() > b.dbname.toLocaleLowerCase() ? 1 : a.dbname.toLocaleLowerCase() < b.dbname.toLocaleLowerCase() ? -1 : 0;
                    });
                }
            }

            sortDbName(hasBeopdata);
            sortDbName(notHasBeopdata);
            return hasBeopdata.concat(notHasBeopdata);
        },

        sorting_data: function (data) {
            var newResult = {};
            for (var j = 0; j < data.length; j++) {
                if (!newResult[data[j].dbname]) {
                    newResult[data[j].dbname] = [];
                }
                var newDtu = {
                    dbname: data[j].dbname,
                    dtuname: data[j].dtuname,
                    dtuRemark: data[j].dtuRemark,
                    online: data[j].online,
                    serverCode: data[j].serverCode,
                    LastOnlineTime: data[j].LastOnlineTime,
                    LastReceivedTime: data[j].LastReceivedTime,
                    ReceivePointCount: data[j].ReceivePointCount,
                    timeZone: data[j].timeZone,
                    bSendData: data[j].bSendData,
                    id: data[j].id
                };
                newResult[data[j].dbname].push(newDtu);
            }
            return newResult;
        },

        getOnlineOrOfflineDtuList: function (allList) {
            var i = allList.length - 1;
            var onlineDtuList = [],
                offlineDtuList = [];
            while (i >= 0) {
                if (allList[i].online == 'Online') {
                    onlineDtuList.unshift(allList[i]);
                } else if (allList[i].online == 'Offline') {
                    offlineDtuList.unshift(allList[i]);
                }
                i--;
            }
            _this.onlineDtuList = _this.sorting_data(onlineDtuList);
            _this.offlineDtuList = _this.sorting_data(offlineDtuList);
        },

        dtuNameSelector: function () {
            var dtuName_List = _this.data.map(function (selectName) {
                return {
                    id: selectName.id,
                    text: selectName.dtuname + ' (' + selectName.dtuRemark + ')'
                }
            });
            $("#selectType").select2({ data: dtuName_List });
        },

        refreshFilter: function (type) {
            $("#filterBox").empty().html(beopTmpl('tpl_data_manage_filter', { 'type': type }));
            I18n.fillArea($(ElScreenContainer));
        },

        loadRealDataTable: function () {
            if (!this.currentDtuName) {
                alert('请先选择一个终端');
                return;
            }
            var $table = $("#debugRealTimeDataTable");
            var pageSizeIndex,
                $pageSizeSelect = $table.find(".pageSizeSelect");
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }
            var dataTableOptions = {
                url: '/admin/dataPointManager/search/',
                post: WebAPI.post,
                postData: {
                    dbname: this.dbname,
                    dtuname: this.currentDtuName,
                    current_page: this.currentPage,
                    page_size: this.page_size,
                    text: this.searchModel.text ? this.searchModel.text : '',
                    isAdvance: this.searchModel.isAdvance ? this.searchModel.isAdvance : false,
                    order: this.searchModel.order ? this.searchModel.order : null,
                    isRemark: this.searchModel.isRemark,
                    item: this.searchModel.item ? this.searchModel.item : 'pointname',
                    flag: 0
                },
                searchOptions: {
                    pageSize: 'page_size',
                    pageNum: 'current_page',
                    searchText: 'text'
                },
                searchInput: $("#debugSearchPoint"),
                rowsNums: [100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                dataFilter: function (result) {
                    return result.list;
                },
                onBeforeRender: function () {
                    Spinner.spin($("#debugRightContainer")[0]);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                totalNumIndex: 'total',
                colNames: [
                    i18n_resource.dataManage.POINT_NAME,
                    i18n_resource.dataManage.POINT_VALUE,
                    i18n_resource.dataManage.UPDATE_TIME
                ],
                colModel: [
                    { index: 'pointname' },
                    { index: 'pointvalue' },
                    { index: 'time', type: 'time' }
                ],
                onRowClick: function (tr, data) {
                    _this.currentPointData = data;
                    $(this).toggleClass('active');
                },
                onRowDbClick: function (tr, data) {
                    _this.currentPointData = data;
                },
                filters: [
                    {
                        param: 'order',
                        element: $('#filterSort'),
                        event: 'change',
                        callback: function (sortIndex) {
                            switch (sortIndex) {
                                case '0':
                                    {
                                        return 'asc';
                                    }
                                case '1':
                                    {
                                        return 'desc';
                                    }
                                case '2':
                                    {
                                        return 'desc';
                                    }
                                case '3':
                                    {
                                        return 'asc';
                                    }
                                case '4':
                                    {
                                        return 'desc';
                                    }
                                case '5':
                                    {
                                        return 'asc';
                                    }
                                default:
                                    {
                                        return '';
                                    }
                            }
                        }
                    }
                ]
            };
            $('#debugTableWrapper').off().simpleDataTable(dataTableOptions);
        },

        //显示dtn具体信息
        showDtuInfo: function () {
            WebAPI.post('/terminal/dtu_info/get', {
                'dtuId': _this.currentDtuInfo.id
            }).done(function (result) {
                if (result.success) {
                    dtuInfo = _this.currentDtuInfo;
                    dtuInfo = result.data;
                    if (!dtuInfo.online) { dtuInfo.online = 'Offline'; }
                    if (!dtuInfo.LastOnlineTime) { dtuInfo.LastOnlineTime = '--'; }
                    if (!dtuInfo.LastReceivedTime) { dtuInfo.LastReceivedTime = '--'; }
                    if (!dtuInfo.ReceivePointCount) { dtuInfo.ReceivePointCount = 0; }
                    if (!dtuInfo.Projects) { dtuInfo.Projects = '--'; }
                    $('#dtuInfoContainer').show();
                    _this.jqueryMap.$dtuInfo.html(beopTmpl('tpl_dtu_info', dtuInfo));
                } else {
                    alert.danger(result.msg);
                }
            });
        },

        setJqueryMap: function () {
            var $container = _this.stateMap.$container;
            this.jqueryMap = $.extend(this.jqueryMap ? this.jqueryMap : {}, {
                $container: $container,
                $debugLeftContainer: $container.find('#debugLeftContainer'),
                $searchProject: $container.find('#searchProjectBox'),
                $dtuInfo: $container.find('#dtuInfo'),
                $dtuUl: $container.find('#list_dtu_ul')
            })
        },

        setSearchModel: function () {
            this.currentPage = 1;
            var value;
            this.searchModel.isRemark = false;
            if (this.searchModel.filterType == this.filterType.name) {
                value = $('#debugSearchPoint').val().trim();
                this.searchModel.text = value;
            } else if (this.searchModel.filterType == this.filterType.value) {
                value = $('#debugSearchPoint').val().trim();
                if (!value) {
                    this.searchModel.text = '1 = 1';
                } else {
                    this.searchModel.text = 'pointvalue = "' + value + '"';
                }
            } else if (this.searchModel.filterType == this.filterType.range) {
                var filterMin = $('#filterMin').val().trim(), filterMax = $('#filterMax').val().trim();

                if (filterMin === '' && filterMax !== '') {
                    this.searchModel.text = ' pointvalue <= ' + filterMax;
                } else if (filterMin !== '' && filterMax === '') {
                    this.searchModel.text = 'pointvalue >= ' + filterMin;
                } else {
                    this.searchModel.text = 'pointvalue >= ' + filterMin + ' and pointvalue <= ' + filterMax;
                }
                this.searchModel.text += ' and pointvalue REGEXP "^[0-9]+\\.?[0-9]*$" ';
            } else if (this.searchModel.filterType == this.filterType.time) {
                var pointDateStart = $('#pointDateStart').val().trim(), pointDateEnd = $('#pointDateEnd').val().trim();

                if (pointDateStart === '' && pointDateEnd !== '') {
                    this.searchModel.text = ' time <= "' + pointDateEnd + '"';
                } else if (pointDateStart !== '' && pointDateEnd === '') {
                    this.searchModel.text = 'time >= "' + pointDateStart + '"';
                } else {
                    this.searchModel.text = 'time >= "' + pointDateStart + '" and time <= "' + pointDateEnd + '"';
                }
            } else if (this.searchModel.filterType == this.filterType.explain) {
                this.searchModel.text = $('#debugSearchPoint').val().trim();
                this.searchModel.isRemark = true;
            }
        },

        destroyDatePicker: function () {
            if (this.pointDateStartInstance) {
                this.pointDateStartInstance = null;
                this.pointDateEndInstance = null;
            }
        },

        getInfoByDtuName: function (dtuname) {
            var i = _this.dtunameCollection.length - 1;
            while (i >= 0) {
                for (var k = 0; k < _this.dtunameCollection[i].length; k++) {
                    if (_this.dtunameCollection[i][k].dtuname == dtuname) {
                        var getData = [];
                        getData.push(_this.dtunameCollection[i][k]);
                        return getData[0];
                    }
                }
                i--;
            }
        },
        /***
         * 查看状态下 seach
         */
        renderPage: function () {
            if (_this.dtuNameID == 'all') {
                _this.jqueryMap.$dtuUl.html(beopTmpl('tpl_dtu_li', { "dtu_list": _this.searchDtuList })).find('li.dtuLi:first').addClass('active');
            } else if (_this.dtuNameID == 'online') {
                _this.jqueryMap.$dtuUl.html(beopTmpl('tpl_dtu_li', { "dtu_list": _this.onlineDtuList })).find('li.dtuLi:first').addClass('active');
            } else if (_this.dtuNameID == 'offline') {
                _this.jqueryMap.$dtuUl.html(beopTmpl('tpl_dtu_li', { "dtu_list": _this.offlineDtuList })).find('li.dtuLi:first').addClass('active');
            } else {
                _this.searchId(_this.dtuNameID);
                _this.jqueryMap.$dtuUl.html(beopTmpl('tpl_dtu_li', { "dtu_list": _this.selectDtuname })).find('li.dtuLi:first').addClass('active');
                _this.jqueryMap.$dtuUl.find('[data-id= ' + Number(_this.dtuNameID) + ']').click();
            }
        },

        /***
         * 编辑dbname刷新后
        */ 
        editDbnameAfterRenderPage: function(val,dbname){
            var $dtuLI,lineState;
            if (_this.dtuNameID == 'all') {
                _this.jqueryMap.$dtuUl.empty().append(beopTmpl('tpl_dtu_li', { "dtu_list": _this.searchDtuList })).find('li[data-dtuname="'+ val +'"]').click();
            } else if (_this.dtuNameID == 'online') {
                _this.jqueryMap.$dtuUl.empty().append(beopTmpl('tpl_dtu_li', { "dtu_list": _this.onlineDtuList })).find('li[data-dtuname="'+ val +'"]').click();
            } else if (_this.dtuNameID == 'offline') {
                _this.jqueryMap.$dtuUl.empty().append(beopTmpl('tpl_dtu_li', { "dtu_list": _this.offlineDtuList })).find('li[data-dtuname="'+ val +'"]').click();
            } else {
                _this.searchId(_this.dtuNameID);
                _this.jqueryMap.$dtuUl.empty().append(beopTmpl('tpl_dtu_li', { "dtu_list": _this.selectDtuname })).find('li[data-dtuname="'+ val +'"]').click();
            }
            $dtuLI = _this.jqueryMap.$dtuUl.find('li[data-dtuname="'+ val +'"]');
            lineState = $dtuLI.find('li[data-dtuname="'+ dbname +'"]').attr('data-online');
            if(lineState =='Offline'){
                $dtuLI.find('li[data-dtuname="'+ dbname +'"]').addClass('offlineBackground');
            }else if(lineState =='Online'){
                $dtuLI.find('li[data-dtuname="'+ dbname +'"]').addClass('onlineBackground');
            }
        },

        searchId: function (dtunameId) {
            for (var key in _this.dtu_list) {
                for (var i = 0, result = _this.dtu_list[key]; i < result.length; i++) {
                    if (result[i].id == Number(dtunameId)) {
                        _this.selectDtuname = _this.sorting_data(result);
                    }
                }
            }
        },

        close: function () {
            this.resetParam();
        },

        resetParam: function () {
            if (_this.$treeDomDetach) {
                _this.$treeDomDetach = null;
            }
            if (_this.zTreeInstance) {
                _this.zTreeInstance = null;
            }
            if (_this.zTreeSearchInstance) {
                _this.zTreeSearchInstance = null;
            }
        },

        loadDtuTree: function () {
            var zTreeSetting = {
                view: {
                    selectedMulti: false
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                data: {
                    keep: {
                        leaf: true,
                        parent: true
                    },
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeDrag: _this.zTreeBeforeDrag,
                    beforeDrop: _this.zTreeBeforeDrop,
                    onClick: _this.zTreeOnClick,
                    onDrop: _this.zTreeOnDrop,
                    onRename: function (event, treeId, treeNode, isCancel) {
                        treeNode.dbname = treeNode.name;
                    }
                }
            };
            _this.zTreeInstance = $.fn.zTree.init($("#ztree_dtu_ul"), zTreeSetting, _this.zNodes);
        },

        zTreeOnClick: function (e, treeId, treeNodes) {
            if (treeNodes.isParent) {
                return false;
            } else {
                _this.currentDtuInfo = treeNodes;
                _this.currentDtuId = treeNodes.id;
                _this.showDtuInfo();
                _this.dbname = treeNodes.dbname;
                _this.currentDtuName = treeNodes.dtuname;
                if (_this.setRemarkedDtu) {
                    _this.setRemarkedDtu = null;
                } else {
                    _this.loadRealDataTable();
                }
            }
        },

        zTreeBeforeDrag: function (treeId, treeNodes) {
            if (treeNodes && treeNodes[0] && treeNodes[0].isParent) {
                return false;
            }
        },
        zTreeBeforeDrop: function (treeId, treeNodes, targetNode) {
            if (!targetNode || (!targetNode.isParent && !targetNode.getParentNode())) {
                return false;
            }
            if (treeNodes[0].parentTId == targetNode.parentTId) {
                return false;
            }
        },

        zTreeOnDrop: function (e, treeId, treeNodes, targetNode) {
            var dragDate = {
                dtuIDs: [treeNodes[0].id],
                dbName: treeNodes[0].dbname
            };

            if (targetNode && targetNode.dbname) {
                if (treeNodes[0].dbname != targetNode.dbname) {
                    dragDate.dbName = targetNode.dbname;
                    Spinner.spin($("#debugLeftContainer")[0]);
                    WebAPI.post('/terminal/updateDB', dragDate).done(function (result) {
                        if (result.success) {
                            //_this.dtu_list = _this.sorting_data(result.data);
                            //_this.getNodesData();
                            //_this.loadDtuTree();
                        } else {
                            alert.danger(result.msg);
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                }
            }
        },

        /***
         * add new nodes
         */
        getParentNodeByAdd: function () {
            var nodes = _this.zTreeInstance.getSelectedNodes();
            if (!nodes.length) {
                return null;
            } else {
                if (nodes[0].isParent) {
                    return nodes[0].getParentNode();
                }
            }
        },

        //ztree 数据
        getNodesData: function () {
            _this.zNodes = [];
            for (var key in _this.dtu_list) {
                var treeList = {
                    name: key,
                    children: []
                };
                for (var i = 0, dtu_list = _this.dtu_list[key]; i < dtu_list.length; i++) {
                    var childrenData =
                        {
                            name: dtu_list[i].dtuname,
                            id: dtu_list[i].id,
                            dbname: dtu_list[i].dbname,
                            dtuname: dtu_list[i].dtuname,
                            dtuRemark: dtu_list[i].dtuRemark,
                            online: dtu_list[i].online,
                            serverCode: dtu_list[i].serverCode,
                            LastOnlineTime: dtu_list[i].LastOnlineTime,
                            LastReceivedTime: dtu_list[i].LastReceivedTime,
                            ReceivePointCount: dtu_list[i].ReceivePointCount,
                            timeZone: dtu_list[i].timeZone,
                            bSendData: dtu_list[i].bSendData
                        };
                    treeList.children.push(childrenData);
                }
                _this.zNodes.push(treeList);
            }
        },

        seeStateRequest: function () {
            if(_this.data){
                _this.dealSeeStateDtuList();
            }else{
                _this.ajaxDtuList().done(function(result){
                    if (result.success) {
                        _this.data = _this.getSortedData(result.data);
                        _this.dealSeeStateDtuList();
                    }
                })
            }   
        },

        dealSeeStateDtuList:function(){
            _this.dtu_list = _this.sorting_data(_this.data);
            _this.getDtuInfoData();
            _this.searchDtuList = _this.dtu_list;
            _this.getOnlineOrOfflineDtuList(_this.data);
            _this.dtuNameID = $('#selectType').attr('value');
            $("#ztree_dtu_ul").hide();
            _this.jqueryMap.$dtuUl.show();
            _this.renderPage();
        },

        dealEditStateDtuList: function(){
            _this.dtu_list = _this.sorting_data(_this.data);
            _this.getDtuInfoData();
            _this.jqueryMap.$dtuUl.hide();
            $("#ztree_dtu_ul").show();
            _this.getNodesData();
            _this.loadDtuTree();
        },

        editStateRequest: function () {
            if(_this.data){
               _this.dealEditStateDtuList();
            }else{
                _this.ajaxDtuList().done(function(result){
                    if (result.success) {
                        _this.data = _this.getSortedData(result.data);
                        _this.dealEditStateDtuList();
                    }
                });
            }
        },

        ajaxDtuList : function(){
            return  WebAPI.get('/terminal/list_dtu/1');
        },

        //判断字符串是否可以转变成json格式
        tryParseJSON: function (jsonString) {
            try {
                var o = JSON.parse(jsonString);
                if (o && typeof o === "object") {
                    return o;
                }
            }
            catch (e) {
            }
            return false;
        },

        attachEvents: function () {
            var _this = this;
            var $allBox = $("#terminalDebugContainer"),
                $realTimeBtnBox = $('#realTimeBtnBox'),
                $filterDefineWin = $('#filterDefineWin'),
                $setInfoValWin = $("#setInfoValWin");
            this.jqueryMap.$debugLeftContainer.on('click', 'li.dtuLi', function () {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active').siblings().removeClass('active');
                }

                $(this).siblings().find('.onlineBackground').removeClass('onlineBackground');
                $(this).siblings().find('.offlineBackground').removeClass('offlineBackground');
            });

            //点击 dtuname
            this.jqueryMap.$debugLeftContainer.on('click', 'li.dtu_subsets_li', function (event) {

                if ($(this).attr('data-online') == 'Online') {
                    $(this).addClass('onlineBackground').siblings().removeClass('onlineBackground offlineBackground');
                } else {
                    $(this).addClass('offlineBackground').siblings().removeClass('onlineBackground offlineBackground');
                }
                _this.currentDtuInfo = _this.getInfoByDtuName($(this).data("dtuname"));
                _this.dbname = _this.currentDtuInfo.dbname;
                _this.currentDtuName = $(this).data().dtuname;
                _this.currentDtuId = $(this).data().id;
                _this.showDtuInfo();
                //修改完remark,下面的table不刷新
                if (_this.setRemarkedDtu) {
                    _this.setRemarkedDtu = null;
                } else {
                    _this.loadRealDataTable();
                }
                event.stopPropagation();
            });

            this.jqueryMap.$debugLeftContainer.on('click', 'li.dtu_subsets', function () {
                $(this).addClass('active').siblings().removeClass('active');
                _this.currentDtuInfo = _this.getInfoByDtuName($(this).data("dtuname"));
                _this.dbname = _this.currentDtuInfo.dbname;
                _this.showDtuInfo();
                //修改完remark,下面的table不刷新
                if (_this.setRemarkedDtu) {
                    _this.setRemarkedDtu = null;
                } else {
                    _this.loadRealDataTable();
                }
            });

            this.jqueryMap.$debugLeftContainer.on('click', '#addNewNodes', function () {
                var parent = _this.getParentNodeByAdd();
                var newParent = _this.zTreeInstance.addNodes(parent, {
                    'isParent': true,
                    'open': false,
                    'name': 'beopdata_'
                });
                _this.zTreeInstance.selectNode(newParent[0]);
                _this.zTreeInstance.editName(newParent[0]);
            });

            //查看
            this.jqueryMap.$debugLeftContainer.on('click', '#seeState', function () {
                var  $this = $(this);
                if($this.hasClass('active')){
                    return;
                }
                $this.addClass('active').siblings().removeClass('active').closest(".dtuType").addClass('hideIcon');
                $('#dtuInfoContainer').hide();
                $('#debugTableWrapper').empty();
                $("#selectType").removeAttr('disabled');
                _this.seeStateRequest();
            });
            //编辑
            this.jqueryMap.$debugLeftContainer.on('click', '#editState', function () {
                var  $this = $(this);
                if($this.hasClass('active')){
                    return;
                }
                $this.addClass('active').siblings().removeClass('active').closest(".dtuType").removeClass('hideIcon');
                $('#dtuInfoContainer').hide();
                $('#debugTableWrapper').empty();
                $("#selectType").val('all').attr('disabled', true);
                _this.editStateRequest();
            });

            this.jqueryMap.$debugLeftContainer.find('#selectType').off().change(function () {
                $(this).attr('value', this.value);
                _this.dtuNameID = this.value;
                _this.renderPage();
            });

            _this.jqueryMap.$container.on('click', '.dtu-info-set-text', function () {
                var $this = $(this);
                _this.setInfoType = $this.attr('type');
                var dtuName =  _this.currentDtuInfo['dtuname'];  
                $this.attr('contentEditable', true);
                var updateRemark = function () {
                    var val = $this.context.innerText.trim()
                    if (val == _this.currentDtuInfo[_this.setInfoType]) {
                        return;
                    }
                    infoBox.confirm(I18n.resource.dataManage.IS_SURE_TODO_RENAME.format(_this.currentDtuInfo[_this.setInfoType], val), function () {
                        let postData = {
                            'type': _this.setInfoType,
                            "value": val,
                            "id": _this.currentDtuInfo.id
                        };
                        Spinner.spin($('#debugLeftContainer')[0]);
                        WebAPI.post('/point_tool/setDtuInfo', postData).done(function (result) {
                            if (result.success) {
                                var  $seeState = $('#seeState'),
                                $editState = $('#editState');
                                _this.ajaxDtuList().done(function(result){
                                    if(result.success){
                                        if($seeState.hasClass("active")){
                                            _this.data = _this.getSortedData(result.data);
                                            _this.dtu_list = _this.sorting_data(_this.data);
                                            _this.getDtuInfoData();
                                            _this.searchDtuList = _this.dtu_list;
                                            _this.getOnlineOrOfflineDtuList(_this.data);
                                            $('#selectType').val(_this.dtuNameID);
                                            _this.editDbnameAfterRenderPage(val,dtuName);
                                        }else if($editState.hasClass("active")){
                                            _this.data = _this.getSortedData(result.data);
                                            _this.dtu_list = _this.sorting_data(_this.data);
                                            _this.getDtuInfoData();
                                            _this.getNodesData();
                                            _this.loadDtuTree();
                                            function getNode(openNodeA){
                                                var openNodeAId = openNodeA[0].id,
                                                index = openNodeAId.indexOf('_a');
                                                var openNodeTId = openNodeAId.substr(0,index);
                                                openNode = _this.zTreeInstance.getNodeByTId(openNodeTId);
                                                return openNode;
                                            };
                                            var openNodeA = $('#ztree_dtu_ul li').find('a[title="'+ val +'"]');
                                            _this.zTreeInstance.expandNode(getNode(openNodeA),true);
                                            var selectNodeDtuName = $('#ztree_dtu_ul li').find('a[title="'+ dtuName +'"]');
                                            _this.zTreeInstance.selectNode(getNode(selectNodeDtuName),true);
                                        }
                                        Spinner.stop();
                                        _this.currentDtuInfo[_this.setInfoType] = val;
                                        _this.setRemarkedDtu = _this.currentDtuInfo;
                                        alert.success('success');
                                    }
                                });
                            } else {
                                alert(result.msg);
                            }
                        });
                    }, function () {
                        $this.text(_this.currentDtuInfo[_this.setInfoType]); 
                    })
                };
                $this.off().blur(function () {
                    updateRemark();
                });
                _this.jqueryMap.$container.off('keydown.remarkKeydown').on('keydown.remarkKeyDown', $this, function (e) {
                    if (e.keyCode == 13) {
                        updateRemark();
                    }
                });
            });

            _this.jqueryMap.$container.off('click.setInfoValue').on('click.setInfoValue', '.dtu-info-set-win', function () {
                let $this = $(this),
                    value = '',
                    $winBox = $("#setInfoValBox"),
                    html = '';
                _this.setInfoType = $this.attr('type');
                if (_this.setInfoType == 'timeZone') {
                    value = $this.text();
                    html = `
                        <select class="form-control set-info-value">
                            <option value="GMT-11">GMT-11</option>
                            <option value="GMT-10">GMT-10</option>
                            <option value="GMT-9">GMT-9</option>
                            <option value="GMT-8">GMT-8</option>
                            <option value="GMT-7">GMT-7</option>
                            <option value="GMT-6">GMT-6</option>
                            <option value="GMT-5">GMT-5</option>
                            <option value="GMT-4">GMT-4</option>
                            <option value="GMT-3">GMT-3</option>
                            <option value="GMT-2">GMT-2</option>
                            <option value="GMT-1">GMT-1</option>
                            <option value="GMT">GMT</option>
                            <option value="GMT+1">GMT+1</option>
                            <option value="GMT+2">GMT+2</option>
                            <option value="GMT+3">GMT+3</option>
                            <option value="GMT+4">GMT+4</option>
                            <option value="GMT+5">GMT+5</option>
                            <option value="GMT+6">GMT+6</option>
                            <option value="GMT+7">GMT+7</option>
                            <option value="GMT+8">GMT+8</option>
                            <option value="GMT+9">GMT+9</option>
                            <option value="GMT+10">GMT+10</option>
                            <option value="GMT+11">GMT+11</option>
                        </select>
                    `;
                } else if (_this.setInfoType == 'bSendData') {
                    value = $this.attr('thisVal');
                    html = `
                        <select class="form-control set-info-value">
                            <option value="0" i18n="dataManage.SEND_DATA_NO"></option>
                            <option value="1" i18n="dataManage.SEND_DATA_YES"></option>
                        </select>
                    `;
                }
                $winBox.html(html);
                $setInfoValWin.attr('thisValue', value);
                $setInfoValWin.find('.set-info-value').val($setInfoValWin.attr('thisValue'));
                $setInfoValWin.modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                I18n.fillArea($setInfoValWin);
            });

            $("#setInfoValConfirm").off().on('click', function () {
                let postData = {
                    'type': _this.setInfoType,
                    "value": $setInfoValWin.find('.set-info-value').val(),
                    "id": _this.currentDtuInfo.id
                };
                WebAPI.post('/point_tool/setDtuInfo', postData).done(function (result) {
                    if (result.success) {
                        _this.currentDtuInfo[_this.setInfoType] = postData.value;
                        _this.setRemarkedDtu = _this.currentDtuInfo;
                        if (_this.setInfoType == 'timeZone') {
                            $("#dtuTimeZone").text(postData.value);
                        } else if (_this.setInfoType == 'bSendData') {
                            let text = postData.value == 1 ? I18n.resource.dataManage.SEND_DATA_YES : I18n.resource.dataManage.SEND_DATA_NO;
                            $("#dtuBSendData").text(text).attr('thisVal', postData.value);
                        }
                        $setInfoValWin.modal('hide');
                        //_this.getDtuList();
                    } else {
                        alert(result.msg);
                    }
                });
            });

            $('#deleteExpiredData').click(function () {//清除过期数据
                var startTime = $("#expiredDataStartTime").datetime({
                    startView: 'month',
                    autoclose: true,
                    format: 'yyyy-mm-dd hh:ii'
                });
                var endTime = $("#expiredDataEndTime").datetime({
                    startView: 'month',
                    autoclose: true,
                    format: 'yyyy-mm-dd hh:ii'
                });
                I18n.fillArea($(".realTimePopover"));
            });

            $realTimeBtnBox.on('click', '#expiredDataConfirm', function () {
                var startTimeVal,
                    $expiredDataStartTime = $('#expiredDataStartTime'),
                    $expiredDataEndTime = $('#expiredDataEndTime');
                var endTimeVal = new Date($expiredDataEndTime.val().trim()).format('yyyy-MM-dd HH:mm:59');
                if (!$expiredDataEndTime.val().trim()) {
                    alert(I18n.resource.common.END_TIME_REQUIRED);
                    return;
                } else if (new Date() < new Date(endTimeVal)) {
                    alert(I18n.resource.debugTools.exportData.END_TIME_THAN_NOW_TIME);
                    return;
                } else if (/[a-zA-Z]/.test($expiredDataEndTime.val().trim())) {
                    alert(I18n.resource.debugTools.exportData.END_TIME_ERROR);
                    return;
                } else if (/[a-zA-Z]/.test($expiredDataStartTime.val().trim())) {
                    alert(I18n.resource.debugTools.exportData.START_TIME_ERROR);
                    return;
                }

                if ($expiredDataStartTime.val().trim()) {
                    startTimeVal = new Date($expiredDataStartTime.val().trim()).format('yyyy-MM-dd HH:mm:00');
                } else {
                    startTimeVal = new Date(new Date(endTimeVal) - 30 * 60 * 1000).format('yyyy-MM-dd HH:mm:00');
                    $expiredDataStartTime.val(new Date(startTimeVal).format('yyyy-MM-dd HH:mm'));
                }

                if (new Date(startTimeVal) > new Date(endTimeVal)) {
                    alert(I18n.resource.common.TIME_COMPARE);
                    return;
                }
                infoBox.confirm(I18n.resource.dataManage.IS_DELETE_EXPIRED_DATA + ' ' + startTimeVal + ' ' + I18n.resource.dataManage.TO + ' ' + endTimeVal + ' ' + I18n.resource.dataManage.OF_DATA, function () {
                    WebAPI.post('/sitedata/clear', {
                        'dbname': _this.dbname,
                        'startTime': startTimeVal,
                        'endTime': endTimeVal,
                        'dtuId':_this.currentDtuId
                    }).done(function (result) {
                        if (result.success) {
                            _this.loadRealDataTable().done(function () {
                                _this.historyStatusPopover.popover('hide');
                                _this.historyStatusPopover.data("bs.popover").inState.click = false;
                            });
                        } else {
                            console.log('error' + result.data);
                        }
                    })
                })
            });

            $("#joinCurve").click(function () { //点击加入曲线按钮
                var selectedPoints = $("#debugTableWrapper").simpleDataTable('getSelectedData'),
                    point_name_list,
                    alert,
                    date_start,
                    data_end,
                    structure_list = {},
                    showHistoryTable,
                    format;
                if (!selectedPoints.length) {
                    alert(i18n_resource.common.SELECT_RECORDS_REQUIRED);
                    return;
                }
                if (selectedPoints.length > 10) {
                    //点名不能超过十条
                    alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.dataManage.UP_TO_TEN_RECORDS);
                    alert.showAtTop(2000);
                    return;
                }
                var valueType = function (name, pointValue) {
                    var structure = _this.tryParseJSON(pointValue);
                    if (structure) {
                        var attrList = [];
                        for (var attr in structure) {
                            if (structure.hasOwnProperty(attr)) {
                                attrList.push(attr);
                            }
                        }
                        structure_list[name] = attrList;
                    }
                };
                //只选中一条且点值为字符串时.显示表格;
                if (selectedPoints.length == 1) {
                    showHistoryTable = isNaN(selectedPoints[0].pointvalue);
                }

                point_name_list = selectedPoints.map(function (item, index) {
                    valueType(item.pointname, item.pointvalue);
                    return item.pointname.toString();
                });
                point_name_list = point_name_list.filter(function (item, pos) {
                    return point_name_list.indexOf(item) == pos;
                });

                if (localStorage.getItem('dataManagerStartDate')) {
                    date_start = localStorage.getItem('dataManagerStartDate');
                    data_end = localStorage.getItem('dataManagerEndDate');
                    format = localStorage.getItem('dataManagerFormat') ? localStorage.getItem('dataManagerFormat') : 'm5';
                } else {
                    date_start = new Date(new Date() - 24 * 60 * 60 * 1000).format("yyyy-MM-dd HH:mm:00");
                    data_end = new Date().format("yyyy-MM-dd HH:mm:00");
                    format = 'm5';
                }
                var obj = {
                    startDate: date_start,
                    endDate: data_end,
                    format: format,
                    pointList: point_name_list,
                    isShowRepairData: false,
                    isShowTable: showHistoryTable,
                    structure_list: structure_list,
                    dtuId: _this.currentDtuId,
                    dtuName: _this.currentDtuName
                };
                new HistoryChart(obj).show();
            });

            $(document).on("click.hideExpiredTimeBox", function (e) {
                var $target = $(e.target);
                if (!$target.closest("#deleteExpiredData").length && !$target.closest(".popover").length) {
                    if (_this.historyStatusPopover.data("bs.popover")) {
                        _this.historyStatusPopover.data("bs.popover").inState.click = false;
                    }
                    _this.historyStatusPopover.popover('hide');
                }
            });

            $("#pointRefresh").click(function () { //点击刷新按钮
                _this.currentPage = 1;
                _this.loadRealDataTable();
            });

            $("#doSearch").click(function () {//删除查询关键字
                _this.currentPage = 1;
                _this.loadRealDataTable();
            });


            $('#pageSizeSelector').change(function () {
                _this.setPageSize($(this).val());
                _this.loadRealDataTable();
                _this.paginationRefresh(1);
            });

            $('#filterDefineConfirm').click(function () {
                _this.searchModel.text = $('#filterContent').val().trim();
                if (!_this.searchModel.text) {
                    return;
                }
                _this.loadRealDataTable();
                $filterDefineWin.modal('hide');
            });

            $realTimeBtnBox.on('change', '#filterType', function () {
                var val = $(this).val().trim();
                _this.refreshFilter(val);
                _this.searchModel = {
                    filterType: val,
                    isAdvance: true,
                    item: 'pointname'
                };

                switch (val) {
                    case '0':
                        _this.searchModel.item = 'pointname';
                        break;
                    case '1':
                        _this.searchModel.item = 'pointname';
                        break;
                    case '2':
                        _this.searchModel.item = 'pointvalue';
                        break;
                    case '3':
                        _this.searchModel.item = 'pointvalue';
                        break;
                    case '4':
                        _this.searchModel.item = 'time';
                        break;
                    case '5':
                        _this.searchModel.item = 'time';
                        break;
                    case '6':
                        _this.searchModel.item = 'tag';
                        break;
                }

                if (val == _this.filterType.name | val == _this.filterType.tag) {
                    _this.searchModel.isAdvance = false;
                } else if (val == _this.filterType.define) {
                    _this.destroyDatePicker();
                    $filterDefineWin.modal();
                } else if (val == _this.filterType.time) {
                    _this.pointDateStartInstance = $("#pointDateStart").datetimepicker({
                        startView: 'month',
                        autoclose: true,
                        format: 'yyyy-mm-dd hh:ii:ss'
                    });
                    _this.pointDateEndInstance = $("#pointDateEnd").datetimepicker({
                        startView: 'month',
                        autoclose: true,
                        format: 'yyyy-mm-dd hh:ii:ss'
                    });
                } else {
                    _this.destroyDatePicker();
                }
            }).on('click', '#filterConfirm', function () {
                _this.setSearchModel();
                _this.loadRealDataTable();
            }).on('click', '#defineFilterEdit', function () {
                $filterDefineWin.modal();
            });
        }
    };
    return TerminalDebugging;
})();

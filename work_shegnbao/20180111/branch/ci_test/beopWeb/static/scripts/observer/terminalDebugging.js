var TerminalDebugging = (function () {
    var _this;

    function TerminalDebugging() {
        _this = this;
        this.jqueryMap = {};
        this.stateMap = {};
        this.currentPage = 1;
        this.page_size = 1000;
        this.dtunameCollection = [];
        this.data = null;
        this.zNodes = [];
        //搜索类型
        this.filterType = {
            'name': 0,
            'value': 1,
            'range': 2,
            'time': 3,
            'explain': 4,
            'define': 5
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
            }).always(function () {
                Spinner.stop();
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
            WebAPI.get('/terminal/list_dtu/1').done(function (result) {
                if (result.success) {
                    _this.data = result.data;
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
                }
            })
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
                    onlineDtuList.push(allList[i]);
                } else if (allList[i].online == 'Offline') {
                    offlineDtuList.push(allList[i]);
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
            $("#selectType").select2({data: dtuName_List});
        },

        refreshFilter: function (type) {
            $("#filterBox").empty().html(beopTmpl('tpl_data_manage_filter', {'type': type}));
            I18n.fillArea($(ElScreenContainer));
        },

        loadRealDataTable: function () {
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
                    current_page: this.currentPage,
                    page_size: this.page_size,
                    text: this.searchModel.text ? this.searchModel.text : '',
                    isAdvance: this.searchModel.isAdvance ? this.searchModel.isAdvance : false,
                    order: this.searchModel.order ? this.searchModel.order : null,
                    isRemark: this.searchModel.isRemark,
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
                    {index: 'pointname'},
                    {index: 'pointvalue'},
                    {index: 'time', type: 'time'}
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
                                    return 'pointname asc';
                                }
                                case '1':
                                {
                                    return 'pointname desc';
                                }
                                case '2':
                                {
                                    return 'pointvalue desc';
                                }
                                case '3':
                                {
                                    return 'pointvalue asc';
                                }
                                case '4':
                                {
                                    return 'time desc';
                                }
                                case '5':
                                {
                                    return 'time asc';
                                }
                                default :
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
            if (_this.currentDtuInfo[0].serverCode != '0' && _this.currentDtuInfo[0].serverCode != '1') {
                $('#dtuInfoContainer').hide();
            } else {
                $('#dtuInfoContainer').show();
                _this.jqueryMap.$dtuInfo.html(beopTmpl('tpl_dtu_info', _this.currentDtuInfo[0]));
            }
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

        getInfoByDtuname: function (dtuname) {
            var i = _this.dtunameCollection.length - 1;
            while (i >= 0) {
                for (var k = 0; k < _this.dtunameCollection[i].length; k++) {
                    if (_this.dtunameCollection[i][k].dtuname == dtuname) {
                        var getData = [];
                        getData.push(_this.dtunameCollection[i][k]);
                        return getData;
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
                _this.jqueryMap.$dtuUl.html(beopTmpl('tpl_dtu_li', {"dtu_list": _this.searchDtuList})).find('li.dtuLi:first').addClass('active');
            } else if (_this.dtuNameID == 'online') {
                _this.jqueryMap.$dtuUl.html(beopTmpl('tpl_dtu_li', {"dtu_list": _this.onlineDtuList})).find('li.dtuLi:first').addClass('active');
            } else if (_this.dtuNameID == 'offline') {
                _this.jqueryMap.$dtuUl.html(beopTmpl('tpl_dtu_li', {"dtu_list": _this.offlineDtuList})).find('li.dtuLi:first').addClass('active');
            } else {
                _this.searchId(_this.dtuNameID);
                _this.jqueryMap.$dtuUl.html(beopTmpl('tpl_dtu_li', {"dtu_list": _this.selectDtuname})).find('li.dtuLi:first').addClass('active');
                _this.jqueryMap.$dtuUl.find('[data-id= ' + Number(_this.dtuNameID) + ']').click();
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
                _this.currentDtuInfo[0] = treeNodes;
                _this.showDtuInfo();
                _this.dbname = treeNodes.dbname;
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
            // /terminal/list_dtu 默认全部, /terminal/list_dtu/type (非0)权限筛选
            WebAPI.get('/terminal/list_dtu/1').done(function (result) {
                if (result.success) {
                    _this.data = result.data;
                    _this.dtu_list = _this.sorting_data(_this.data);
                    _this.getDtuInfoData();
                    _this.searchDtuList = _this.dtu_list;
                    _this.getOnlineOrOfflineDtuList(_this.data);
                    _this.dtuNameSelector();
                    _this.dtuNameID = $('#selectType').attr('value');
                    $("#ztree_dtu_ul").hide();
                    _this.jqueryMap.$dtuUl.show();
                    _this.renderPage();
                }
            });
        },

        editStateRequest: function () {
            // /terminal/list_dtu 默认全部, /terminal/list_dtu/type (非0)权限筛选
            WebAPI.get('/terminal/list_dtu/1').done(function (result) {
                if (result.success) {
                    _this.data = result.data;
                    _this.dtu_list = _this.sorting_data(_this.data);
                    _this.getDtuInfoData();
                    _this.dtuNameSelector();
                    _this.jqueryMap.$dtuUl.hide();
                    $("#ztree_dtu_ul").show();
                    _this.getNodesData();
                    _this.loadDtuTree();
                }
            });
        },

        attachEvents: function () {
            var _this = this;
            var $realTimeBtnBox = $('#realTimeBtnBox'),
                $filterDefineWin = $('#filterDefineWin');
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
                _this.currentDtuInfo = _this.getInfoByDtuname($(this).data("dtuname"));
                _this.dbname = _this.currentDtuInfo[0].dbname;
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
                _this.currentDtuInfo = _this.getInfoByDtuname($(this).data("dtuname"));
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
                $(this).addClass('active').siblings().removeClass('active').closest(".dtuType").addClass('hideIcon');
                $('#dtuInfoContainer').hide();
                $('#debugTableWrapper').empty();
                $("#selectType").removeAttr('disabled');
                _this.seeStateRequest();
            });
            //编辑
            this.jqueryMap.$debugLeftContainer.on('click', '#editState', function () {
                $(this).addClass('active').siblings().removeClass('active').closest(".dtuType").removeClass('hideIcon');
                $('#dtuInfoContainer').hide();
                $('#debugTableWrapper').empty();
                $("#selectType").attr('disabled', true);
                _this.editStateRequest();
            });

            this.jqueryMap.$debugLeftContainer.find('#selectType').off().change(function () {
                $(this).attr('value', this.value);
                _this.dtuNameID = this.value;
                _this.renderPage();
            });

            _this.jqueryMap.$container.on('click', '#dtuRemark', function () {
                var $this = $(this);
                $this.attr('contentEditable', true);
                var updateRemark = function () {
                    if ($this.context.innerText.trim() == _this.currentDtuInfo[0].dtuRemark) {
                        return;
                    }
                    infoBox.confirm(I18n.resource.dataManage.IS_SURE_TODO_RENAME.format(_this.currentDtuInfo[0].dtuRemark, $this.context.innerText.trim()), function () {
                        WebAPI.post('/point_tool/setDtuRemark', {
                            "remark": $this.context.innerText.trim(),
                            "id": _this.currentDtuInfo[0].id
                        }).done(function (result) {
                            if (result.success) {
                                _this.currentDtuInfo[0].dtuRemark = $this.context.innerText.trim();
                                _this.setRemarkedDtu = _this.currentDtuInfo[0];
                                _this.getDtuList();
                                alert.success('success');
                            } else {
                                alert(result.msg);
                            }
                        });
                    }, function () {
                        $("#dtuRemark").text(_this.currentDtuInfo[0].dtuRemark);
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
                        'endTime': endTimeVal
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
                // var $selectedItem = $("#debugRightContainer tr.active, #tableMonitor tr.active"),
                var selectedPoints = $('#debugTableWrapper').simpleDataTable('getSelectedData'),
                    selectedPointsName = [],
                    date_start,
                    data_end,
                    format;
                if (!selectedPoints.length) {
                    return;
                }
                if (selectedPoints.length > 10) {
                    //点名不能超过十条
                    alert.danger(I18n.resource.dataManage.UP_TO_TEN_RECORDS);
                    return;
                }

                selectedPointsName.map(function (item) {
                    return item.pointname;
                });

                //去重
                selectedPointsName = selectedPointsName.filter(function (item, pos) {
                    return selectedPointsName.indexOf(item) == pos;
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

                Spinner.spin(ElScreenContainer);
                WebAPI.post("/get_history_data_padded_reduce", {
                    projectId: _this.projectId,
                    pointList: selectedPointsName,
                    timeStart: date_start.format("yyyy-MM-dd HH:mm:00"),
                    timeEnd: data_end.format("yyyy-MM-dd HH:mm:00"),
                    timeFormat: format
                }).done(function (data) {
                    var obj = {
                        data: data,
                        startDate: date_start,
                        endDate: data_end,
                        format: format,
                        pointList: selectedPointsName,
                        projectId: _this.projectId,
                        isShowRepairData: false
                    };
                    new HistoryChart(obj).show();
                }).fail(function (e) {
                    alert.danger(I18n.resource.observer.widgets.HISTORY_CURVE_FAILED);
                }).always(function () {
                    Spinner.stop();
                });
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
                    isAdvance: true
                };

                if (val == _this.filterType.name) {
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

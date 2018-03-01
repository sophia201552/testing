var TerminalDebugging = (function () {
    var _this;

    function TerminalDebugging() {
        _this = this;
        this.jqueryMap = {};
        this.stateMap = {};
        this.currentPage = 1;
        this.page_size = 1000;
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

        getDtuList: function () {
            WebAPI.get('/terminal/list_dtu').done(function (result) {
                _this.setting = {
                    callback: {
                        onClick: _this.onTreeClick.bind(_this)
                    },
                    view: {
                        fontCss: _this.setFontCss.bind(_this)
                    }
                };
                if (result.success) {
                    var firstInit = !_this.tree;
                    for (var i = 0, iLen = result.data.length; i < iLen; i++) {
                        result.data[i].name = result.data[i].dtuname;
                        result.data[i].dtuRemark && (result.data[i].name += ' (' + result.data[i].dtuRemark + ')');
                    }
                    _this.dtu_list = result.data;
                    _this.dtu_list.map(function (item) {
                        item.iconSkin = 'iconfont icon_is_online';
                    });
                    var showFirstDtu = function () {
                        var allNodes = _this.tree.getNodes()
                        _this.currentDtuInfo = allNodes[0];
                    }
                    if (!_this.setRemarkedDtu && _this.tree) {
                        showFirstDtu();
                    }
                    _this.tree = $.fn.zTree.init($('#list_dtu_Tree'), _this.setting, _this.dtu_list);
                    //第一次初始化需要dbname获取原始点列表
                    firstInit && showFirstDtu();
                    _this.dbname = result.data[0].dbname;
                    if (_this.setRemarkedDtu) {
                        //重新初始化后的tree相同的id可能不是相同的tId了,所以要找到之前的tId
                        var treeNode = _this.tree.getNodeByParam('id', _this.currentDtuInfo.id);
                        $('#' + treeNode.tId + '_span').click();
                        _this.setRemarkedDtu = null;
                    }
                    _this.loadRealDataTable();
                    _this.showDtuInfo();
                }
            })
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
                    Spinner.spin(document.body);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                totalNumIndex: 'total',
                colNames: ['点名', '点值', '更新时间'],
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

        //左侧tree的点击事件
        onTreeClick: function (event, treeId, treeNode, clickFlag) {
            _this.dbname = treeNode.dbname;
            _this.currentDtuInfo = treeNode;
            _this.showDtuInfo();
            _this.loadRealDataTable();
        },

        //设置字体
        setFontCss: function (treeId, treeNode) {
            return treeNode.online == 'Offline' ? {color: 'red'} : {color: 'green'}
        },

        //显示dtn具体信息
        showDtuInfo: function () {
            if (_this.currentDtuInfo.serverCode != '0' && !_this.currentDtuInfo.serverCode != '1') {
                $('#dtuInfoContainer').hide();
            } else {
                $('#dtuInfoContainer').show();
                _this.jqueryMap.$dtuInfo.html(beopTmpl('tpl_dtu_info', _this.currentDtuInfo));
            }
        },

        /***
         * 搜索项目
         */
        searchProject: function () {
            var searchText = this.jqueryMap.$searchProject.find('input').val() || '';
            if (!searchText || !searchText.trim()) {
                _this.tree = $.fn.zTree.init($('#list_dtu_Tree'), _this.setting, _this.dtu_list);
            } else {
                var searchList = [];
                for (var i = 0, iLen = _this.dtu_list.length; i < iLen; i++) {
                    var keywordsArr = searchText.toLowerCase().split(' ');
                    var isMatch = true;
                    for (var j = 0, jLen = keywordsArr.length; j < jLen; j++) {
                        if (!(eval('/' + keywordsArr[j] + '/').exec(_this.dtu_list[i].dtuname.toLowerCase()))) {
                            isMatch = false;
                            break;
                        }
                    }
                    isMatch && searchList.push(_this.dtu_list[i]);
                }
                _this.tree = $.fn.zTree.init($('#list_dtu_Tree'), _this.setting, searchList);
            }
        },

        setJqueryMap: function () {
            var $container = _this.stateMap.$container;
            this.jqueryMap = $.extend(this.jqueryMap ? this.jqueryMap : {}, {
                $container: $container,
                $debugLeftContainer: $container.find('#debugLeftContainer'),
                $searchProject: $container.find('#searchProjectBox'),
                $searchProjectBtn: $container.find('#searchProjectBtn'),
                $dtuInfo: $container.find('#dtuInfo')
            })
        },

        close: function () {

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

        attachEvents: function () {
            var _this = this;
            var $realTimeBtnBox = $('#realTimeBtnBox'),
                $filterDefineWin = $('#filterDefineWin');

            this.jqueryMap.$searchProjectBtn.click(function () {
                _this.searchProject();
            });
            //左侧ztree 搜索
            this.jqueryMap.$searchProject.off('keyup.search').on('keyup.search', 'input', function (e) {
                if (e.which != 13) {
                    return;
                }
                _this.searchProject();
            });

            _this.jqueryMap.$container.on('click', '#dtuRemark', function () {
                var $this = $(this);
                $this.attr('contentEditable', true);
                $this.off().blur(function () {
                    if ($this.context.innerText.trim() == _this.currentDtuInfo.dtuRemark) {
                        return;
                    }
                    WebAPI.post('/point_tool/setDtuRemark', {
                        "remark": $this.context.innerText.trim(),
                        "id": _this.currentDtuInfo.id
                    }).done(function (result) {
                        if (result.success) {
                            _this.setRemarkedDtu = _this.currentDtuInfo;
                            _this.getDtuList();
                            alert.success('success');
                        } else {
                            alert(result.msg);
                        }
                    })
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

            $('#realTimeBtnBox').on('click', '#expiredDataConfirm', function () {
                var startTimeVal;
                var endTimeVal = new Date($('#expiredDataEndTime').val().trim()).format('yyyy-MM-dd HH:mm:59');
                if (!$('#expiredDataEndTime').val().trim()) {
                    alert('The end time can\'t be empty.');
                    return;
                } else if (new Date() < new Date(endTimeVal) || /[a-zA-Z]/.test($('#expiredDataEndTime').val().trim())) {
                    alert('End time error');
                    return;
                } else if (/[a-zA-Z]/.test($('#expiredDataStartTime').val().trim())) {
                    alert('Start time error');
                    return;
                }

                if ($('#expiredDataStartTime').val().trim()) {
                    startTimeVal = new Date($('#expiredDataStartTime').val().trim()).format('yyyy-MM-dd HH:mm:00');
                } else {
                    startTimeVal = new Date(new Date(endTimeVal) - 30 * 60 * 1000).format('yyyy-MM-dd HH:mm:00');
                    $('#expiredDataStartTime').val(new Date(startTimeVal).format('yyyy-MM-dd HH:mm'));
                }

                if (new Date(startTimeVal) > new Date(endTimeVal)) {
                    alert(I18n.resource.common.TIME_COMPARE);
                    return;
                }
                infoBox.confirm(I18n.resource.dataManage.IS_DELETE_EXPIRED_DATA + ' ' + startTimeVal + ' ' + I18n.resource.dataManage.TO + ' ' + endTimeVal + ' ' + I18n.resource.dataManage.OF_DATA, function () {
                    WebAPI.post('/sitedata/clear', {
                        'projId': AppConfig.projectId,
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
                })

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

var PointManagerRealTimeData = (function () {

    function PointManagerRealTimeData(projectId) {
        PointManager.call(this, projectId);
        this.htmlUrl = '/static/scripts/dataManage/views/dm.realTimeData.html';
        this.i18 = I18n.resource.observer.widgets;
        this.pointInfoList = [];
        this.hasMonitoredNameList = [];
        this.projectId = projectId;
        this.pointDateStartInstance = null;
        this.pointDateEndInstance = null;
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

    PointManagerRealTimeData.prototype = Object.create(PointManager.prototype);
    PointManagerRealTimeData.prototype.constructor = PointManagerRealTimeData;

    var PointManagerRealTimeDataFunc = {
        show: function () {
            var _this = this;
            this.init().done(function () {
                _this.refreshFilter(_this.filterType.name);
                $.ajax({
                    url: '/tag/dict',
                    type: 'GET',
                    contentType: 'application/json',
                    async: false
                }).done(function (result) {
                    if (result.success) {
                        var keyWordList = _this.sortTagData(result.data);
                        _this.editTagAttr = _this.markTagEditAttr(keyWordList);
                        _this.newTagAttr = [];
                        _this.tagAttrBox.map(function (item) {
                            _this.newTagAttr = _this.newTagAttr.concat(item);
                        });
                        _this.loadTable();
                        _this.attachEvents();
                    }
                });
                
            })
        },
        close: function () {
            this.detachEvents();
        },

        //
        markTagEditAttr: function (keyWordList) {
            var _this = this;
            var tagAttr = [];
            _this.tagAttrBox = [];
            for (var i = 0; i < keyWordList.length; i++) {
                var tagGroup = keyWordList[i];
                tagGroup.tags && tagGroup.tags.length && _this.tagAttrBox.push(tagGroup.tags);
                for (var j = 0; j < tagGroup.tags.length; j++) {
                    if (tagGroup.tags[j].attrInputs && tagGroup.tags[j].attrInputs.length) {
                        tagAttr.push(tagGroup.tags[j].name.trim().toUpperCase());
                    }
                }
            }
            
            return tagAttr;
        },

        //初始化页面时,获取可编辑的tag;
        sortTagData: function (keyWordList) {
            // Equipment 第一, (Component, Physical, Media, Direction) 优先; Other放在后面;
            var priorList = [], otherList = [], Other = [], sortList = ['Equipment', 'Component', 'Physical', 'Media', 'Direction'];
            var list = keyWordList.concat();
            for (var i = 0; i < list.length; i++) {
                var tag = list[i];
                if ($.inArray(tag.groupNm, sortList) !== -1) {
                    if (tag.groupNm == 'Equipment') {
                        priorList.unshift(tag);
                    } else {
                        priorList.push(tag);
                    }
                } else {
                    if (tag.groupNm == 'Other') {
                        Other.push(tag);
                    } else {
                        otherList.push(tag);
                    }
                }
            }
            return priorList.concat(otherList, Other);
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

        setSearchModel: function () {
            // this.currentPage = 1;
            var value;
            this.searchModel.isRemark = false;
            if (this.searchModel.filterType == this.filterType.name) {
                value = $('#searchPoint').val().trim();
                this.searchModel.text = value;
            } else if (this.searchModel.filterType == this.filterType.value) {
                value = $('#searchPoint').val().trim();
                if (!value) {
                    this.searchModel.text = '1 = 1';
                } else {
                    this.searchModel.text = 'pointvalue = "' + value + '"';
                }
            } else if (this.searchModel.filterType == this.filterType.range) {
                var filterMin = $('#filterMin').val().trim(), filterMax = $('#filterMax').val().trim();
                // 严工要求点值范围查询时: 最小值,最大值不能为空,最小值不能大于最大值
                if (filterMin == '') {
                    alert(I18n.resource.dataManage.MIN_REQUIRED);
                    return false;
                }
                if (filterMax == '') {
                    alert(I18n.resource.dataManage.MAX_REQUIRED);
                    return false;
                }
                if (parseInt(filterMin) > parseInt(filterMax)) {
                    alert(I18n.resource.dataManage.MIN_NOT_GREATER_THAN_MAX);
                    return false;
                }

                this.searchModel.text = 'pointvalue >= ' + parseInt(filterMin) + ' and pointvalue <= ' + parseInt(filterMax);
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
                this.searchModel.text = $('#searchPoint').val().trim();
                this.searchModel.isRemark = true;
            } else if (this.searchModel.filterType == this.filterType.tag) {
                this.searchModel.text = $('#searchPoint').val().trim();               
            }
            return true;
        },

        attachEvents: function () {
            var _this = this;
            var $divPointsList = $('#divPointsList'),
                $filterDefineWin = $('#filterDefineWin');
            var $filterDataBox = $('#filterDataBox');
            $filterDataBox.off('click.cleanRecordLog').on('click.cleanRecordLog', '#cleanRecordLog', function () {
                _this.cleanRecordLogModal();
            }).off('change.cleanDataFile').on('change.cleanDataFile', '#cleanDataFile', function () {
                _this.updateCleanFile($(this)[0].files);
            }).off('click.uploadClean').on('click.uploadClean', '#uploadClean', function () {
                $filterDataBox.find('#cleanDataFile').click();
            }).off('click.downloadCleanFile').on('click.downloadCleanFile', '#downloadCleanFile', function () {
                _this.downloadCleanFile();
            });

            $('#clean-record-log-modal').off('click.downLoadLogURL').on('click.downLoadLogURL', '.downLoadLogURL', function () {
                _this.downloadLogFile(this);
            });

            $(".pointList").on('click', 'tbody tr .data-manager-star', function (e) {
                var $this = $(this);
                var pointName = _this.rowData && _this.rowData.pointname;
                if (!pointName) {
                    alert.danger('pointName can not be empty');
                    return;
                }
                if ($this.hasClass('glyphicon-star-empty')) {
                    _this.addHasMonitoredNameList(pointName);
                } else {
                    _this.deleteHasMonitoredNameList(pointName);
                }
                WebAPI.post('/admin/dataManager/update/', {
                    userId: AppConfig.userId,
                    projectId: _this.projectId,
                    points: _this.hasMonitoredNameList.join(',')
                }).done(function (result) {
                    if (result.success == true) {
                        $this.toggleClass('glyphicon-star-empty').toggleClass('glyphicon-star');
                    }
                })
                e.stopPropagation();
            });
            //删除选中
            $('#deleteExpiredData').click(function () {
                var selectedPoints = _this.$datatable.simpleDataTable('getSelectedData');
                var selectedPointNames = selectedPoints.map(function (item, index) {
                    return item.pointname;
                });
                infoBox.confirm(I18n.resource.dataManage.CLEAR_FOLLOWDING_POINTS + '\n' + selectedPointNames.join('\n'), function () {
                    WebAPI.post('/admin/dataManager/remove/', {
                        'projectId': AppConfig.projectId,
                        'points': selectedPointNames
                    }).done(function (result) {
                        if (result.success) {
                            _this.$datatable.simpleDataTable('refreshTable');
                        }
                    });
                })
            });

            $('#realTimeBtnBox').on('click.search-rule-tip','#search-rule-tip', function (e) {
                var $ruleBox = $('#rule-tip-box');
                var $tipContainer = $ruleBox.find('.tip-container');
                if (!$tipContainer || !$tipContainer.length) {
                    $ruleBox.empty().html(beopTmpl('search_rule_tip_modal'));
                    I18n.fillArea($ruleBox);
                }
                if ($(e.target).hasClass('icon-baojingtishi')) {
                    if ($ruleBox.hasClass('dn')) {
                        $ruleBox.removeClass('dn');
                    } else {
                        $ruleBox.addClass('dn');
                    }
                } else {
                    $ruleBox.removeClass('dn');
                }
            });

            $(document).on('click', function (e) {
                if (!$(e.target).hasClass('icon-baojingtishi')) {
                    $('#rule-tip-box').addClass('dn');
                }
            });

            $("#isMonitoring").click(function () { //点击加入收藏按钮
                var $this = $(this), $span = $this.find('span');
                if ($span.hasClass("glyphicon-star-empty")) {
                    _this.loadTable(true);
                    $span.addClass("glyphicon-star").removeClass('glyphicon-star-empty');
                } else {
                    _this.loadTable(false);
                    $span.removeClass("glyphicon-star").addClass('glyphicon-star-empty');
                }
            });

            $("#hide_point_tag").click(function () {
                $('#divPointsList').find('.point_tag_control_box').hide();
                $(this).hide();
                $('#show_point_tag').show();
            });

            $('#divPointsList').on('click.editTagBtn', '.editTagBtn', function () {
                var editTagArr = [];
                var $editTag = $(this).siblings('[data-tag="edit"]');
                for (var i = 0; i < $editTag.length; i++) {
                    editTagArr.push($($editTag[i]).attr('tag'));
                }
                var equipmentDataList = [];
                for (var i = 0; i < editTagArr.length; i++) {
                    var editTagName = editTagArr[i];
                    _this.newTagAttr.map(function (item) {
                        if (item.name === editTagName) {
                            var equipmentData = [];
                            for (var i = 0; i < item.attrInputs.length; i++) {
                                var equipmentName = {
                                    en: item.attrInputs[i].name.en,
                                    zh: item.attrInputs[i].name.zh
                                };
                                equipmentData.push(equipmentName);
                            }
                           
                            equipmentDataList.push({
                                editTagName: editTagName,
                                equipmentData: equipmentData
                            })
                        }
                    });
                }
                var $pointTagEquipment = $('#pointTagEquipment');
                $pointTagEquipment.modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                $pointTagEquipment.find('#tagEquipmentContent').empty().append(beopTmpl('point_tag_equipment_modal', {data: equipmentDataList}));
                $pointTagEquipment.find('.equipmentName:first-child').addClass('active').end();
                $pointTagEquipment.find('.equipmentContainer').eq(0).removeClass('dn');
            });

            $('#pointTagEquipment').off('click.equipmentName').on('click.equipmentName', '.equipmentName', function () {
                var $this = $(this);
                if ($this.hasClass('active')) return;
                $this.siblings('.equipmentName').removeClass('active');
                $this.addClass('active');
                var tag = $this.text().toLowerCase();
                var $container = $('#tagEquipmentContent').find('.equipmentContainer');
                for (var i = 0; i < $container.length; i++) {
                    if (!$($container[i]).hasClass('dn')) {
                        $($container[i]).addClass('dn');
                    }
                }
                $('#tagEquipmentContent').find('#'+ tag + 'Container').removeClass('dn');
            });

            $("#show_point_tag").click(function () {
                $('#divPointsList').find('.point_tag_control_box').show();
                $(this).hide();
                $('#hide_point_tag').show();
            });

            $("#joinCurve").click(function () { //点击加入曲线按钮
                var selectedPoints = _this.$datatable.simpleDataTable('getSelectedData'),
                    point_name_list,
                    tag_list = [],
                    alert,
                    date_start,
                    data_end,
                    structure_list = {},
                    showHistoryTable,
                    format;
                if (!selectedPoints.length) {
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

                for (var i = 0; i < selectedPoints.length; i++) {
                    tag_list.push({
                        pointName: selectedPoints[i].pointname,
                        tagList: selectedPoints[i].tag
                    })
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
                    projectId: _this.projectId,
                    isShowRepairData: false,
                    isShowTable: showHistoryTable,
                    structure_list: structure_list,
                    tagList: tag_list
                };
                new HistoryChart(obj).show();
            });

            $("#pointRefresh").click(function () { //点击刷新按钮
                _this.currentPage = 1;
                if ($('#isMonitoring').find('span').hasClass('glyphicon-star')) {
                    _this.loadTable(true);
                } else {
                    _this.loadTable();
                }
            });

            $("#doSearch").click(function () {//删除查询关键字
                _this.currentPage = 1;
                _this.loadTable();
            });

            $('#filterDefineConfirm').click(function () {
                _this.searchModel.text = $('#filterContent').val().trim();
                if (!_this.searchModel.text) {
                    return;
                }
                _this.loadTable();
                $filterDefineWin.modal('hide');
            });

            $divPointsList.on('change', '#filterType', function () {
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
                    // _this.destroyDatePicker();
                    $filterDefineWin.modal();
                } else if (val == _this.filterType.time) {
                    var $pointDateStart = $("#pointDateStart"),
                        $pointDateEnd = $("#pointDateEnd");
                    _this.pointDateStartInstance = $pointDateStart.datetimepicker({
                        startView: 'month',
                        autoclose: true,
                        format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME),
                        forceParse: false
                    });
                    _this.pointDateEndInstance = $pointDateEnd.datetimepicker({
                        startView: 'month',
                        autoclose: true,
                        format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME),
                        forceParse: false
                    });
                    _this.pointDateStartInstance = $pointDateStart.datetime();
                    _this.pointDateEndInstance = $pointDateEnd.datetime();
                }

            }).on('click', '#filterConfirm', function () {
                if (_this.setSearchModel()) {
                    _this.loadTable();
                }
            }).on('keyup', '#searchPoint', function (e) {
                if (e.keyCode == 13 && _this.setSearchModel()) {
                    _this.loadTable();
                }
            }).on('click', '#defineFilterEdit', function () {
                $filterDefineWin.modal();
            });

            var spinSure;
            $('#sure-export-clean-modal').on('hidden.bs.modal', function () {
                if (!!spinSure) {
                    spinSure.stop();
                }
            }).off('click.sureExportClean').on('click.sureExportClean', '#sureExportClean', function () {

                spinSure = new LoadingSpinner({color: '#00FFFF'}).spin($('#sure-export-clean-modal')[0]);
                var subData = {
                    pointListFileId: _this.pointListFileId
                };

                WebAPI.post('/project/' + AppConfig.projectId + '/confirm_upload_point_list', subData).done(function (result) {
                    if (result.error == 'success') {
                        _this.loadTable();
                    }
                }).fail(function (error) {
                    alert.danger('error: ' + error.statusText);
                }).always(function () {
                    spinSure.stop();
                    $('#sure-export-clean-modal').modal('hide');
                });
            });
        },

        cleanRecordLogModal: function () {
            var _this = this;
            $("#clean-record-log-modal").modal({
                keyboard: false,
                backdrop: 'static'
            }).on('shown.bs.modal', function () {
                Spinner.spin(ElScreenContainer);
            }).on('hidden.bs.modal', function () {
                Spinner.stop();
            });

            var logList = [], curLog, fileName;
            Spinner.spin(ElScreenContainer);
            WebAPI.get('/project/' + AppConfig.projectId + '/point_list_upload_records').done(function (result) {
                if (result.data) {
                    for (var i = 0; i < result.data.length; i++) {
                        curLog = result.data[i];
                        fileName = curLog.fileUrl.split('/');
                        curLog.fileName = fileName[fileName.length - 1];
                        curLog.timeStamp = timeFormat(new Date(curLog.timeStamp), timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME));
                        logList.push(curLog);
                    }
                    $('#cleanLogListTBody').empty().html(beopTmpl('clean_record_log_container', {
                        logList: logList
                    }));
                    I18n.fillArea($("#clean-record-log-modal"));
                }
            }).fail(function (err) {
                alert.danger('error' + err);
            }).always(function () {
                Spinner.stop();
            });
        },

        downloadCleanFile: function () {
            var _this = this;
            var url = '/project/' + AppConfig.projectId + '/export_point_rtdata';
            _this.downloadFormAction(url);
        },

        //下载文件, 使用form的action属性;
        downloadFormAction: function (url) {
            var formLoad = document.createElement('FORM');
            formLoad.setAttribute('action', url);
            document.body.appendChild(formLoad);
            formLoad.submit();
            document.body.removeChild(formLoad);
        },

        downloadLogFile: function (curFile) {
            var _this = this;
            var url = $(curFile).attr('href');
            _this.downloadFormAction(url);
        },

        updateCleanFile: function (file) {
            var _this = this;
            if (!file || !file[0]) {
                return;
            }

            var formData = new FormData();
            var match;
            //防止选中文件点击取消上传时报错;
            if (file[0].name) {
                match = file[0].name.match(/\.[A-Za-z0-9]+$/);
            }
            var supportFiles = ['.xlsx', '.csv'];

            var $cleanDataFile = $('#cleanDataFile');
            if (!match || supportFiles.indexOf(match[0].toLowerCase()) < 0) {
                alert.danger(I18n.resource.dataManage.INVALID_FILE_TYPE);
                $cleanDataFile.after($cleanDataFile.clone().val(''));
                $cleanDataFile.remove();
                return;
            }

            if (!_this._checkFileSize(file[0])) {
                alert.warning(I18n.resource.dataManage.UPDATE_FILE_MAX_TEN);
                $cleanDataFile.after($cleanDataFile.clone().val(''));
                $cleanDataFile.remove();
                return false;
            }
            formData.append('config-file', file[0]);
            Spinner.spin(ElScreenContainer);
            $.ajax({
                url: '/project/' + AppConfig.projectId + '/try_upload_point_list',
                type: 'post',
                data: formData,
                dataType: 'json',
                cache: false,
                contentType: false,
                enctype: 'multipart/form-data',
                processData: false,
                success: function (data, status) {
                    if (status == 'success') {
                        _this.sureCleanData(data);
                        _this.pointListFileId = data.pointListFileId;
                    }
                },
                error: function (error) {
                    alert.danger('error: ' + JSON.parse(error.responseJSON)['error']);
                },
                complete: function () {
                    Spinner.stop();
                    var $cleanDataFile = $('#cleanDataFile');
                    $cleanDataFile.after($cleanDataFile.clone().val(''));
                    $cleanDataFile.remove();
                }
            });

        },

        _checkFileSize: function (file) {
            return file.size <= 10485760; //10485760为10MB大小文件
        },

        sureCleanData: function (data) {
            $('#sure-export-clean-modal').modal('show');
            $("#sureCleanBody").empty().html(beopTmpl('sure_clean_data_modal', {
                list: data
            }));
            I18n.fillArea($("#sureCleanBody"));
        },

        destroyDatePicker: function () {
            if (this.pointDateStartInstance) {
                this.pointDateStartInstance = null;
                this.pointDateEndInstance = null;
            }
        },
        refreshFilter: function (type) {
            $("#filterBox").empty().html(beopTmpl('tpl_data_manage_filter_search', {'type': type}));
            I18n.fillArea($(ElScreenContainer));
        },
        detachEvents: function () {
            $(document).on("click.hideExpiredTimeBox");
        },
        loadTable: function (starred) {
            var $table = $("#tableWatch"), _this = this;
            var pageSizeIndex,
                $pageSizeSelect = $table.find(".pageSizeSelect"),
                $isMonitoring = $('#isMonitoring');
            if (!starred && $isMonitoring.find('span').hasClass('glyphicon-star')) {
                $isMonitoring.find('span').removeClass('glyphicon-star').addClass('glyphicon-star-empty');
            }
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }
            var dataTableOptions = {
                url: '/admin/dataPointManager/search/',
                post: WebAPI.post,
                postData: {
                    projectId: this.projectId,
                    text: this.searchModel.text ? this.searchModel.text : '',
                    isAdvance: this.searchModel.isAdvance ? this.searchModel.isAdvance : false,
                    order: this.searchModel.order ? this.searchModel.order : null,
                    isRemark: this.searchModel.isRemark,
                    flag: 0,
                    starred: starred ? true : '',
                    item: this.searchModel.item ? this.searchModel.item : 'pointname'
                },
                searchOptions: {
                    pageSize: 'page_size',
                    pageNum: 'current_page',
                    searchText: 'text'
                },
                searchInput: $("#searchPoint"),
                rowsNums: [100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                dataFilter: function (result) {
                    _this.hasMonitoredNameList = [];
                    result.list.forEach(function (item) {
                        item.isStarred && _this.hasMonitoredNameList.push(item.pointname);
                    });
                    return result.list;
                },
                onBeforeRender: function () {
                    Spinner.spin(ElScreenContainer);
                },
                onAfterRender: function () {
                    if($('#hide_point_tag').is(":visible")){
                        $table.find('.point_tag_control_box').show();
                    }
                    if($('#show_point_tag').is(":visible")){
                        $table.find('.point_tag_control_box').hide();
                    }
                    Spinner.stop();
                },
                totalNumIndex: 'total',
                colNames: [
                    i18n_resource.dataManage.POINT_NAME,
                    i18n_resource.dataManage.POINT_VALUE,
                    i18n_resource.dataManage.UPDATE_TIME,
                    i18n_resource.dataManage.REMARK,
                    i18n_resource.dataManage.COLLECT
                ],
                colModel: [
                    {
                        index: 'pointname', 
                        highlight: this.searchModel.item == 'tag' ? false : true,
                        html: true,
                        converter: function (val, row) { 
                            if (row.tag && row.tag.length) {
                                return  beopTmpl('converter_point_tag', {
                                            pointName: val,
                                            tagArr: row.tag,
                                            editTagAttr: _this.editTagAttr
                                        });
                            } else {
                                return '<span>' + val + '</span>';
                            }
                        }
                    },
                    {index: 'pointvalue'},
                    {
                        index: 'time',
                        type: 'time',
                        width: '150px',
                        html: true,
                        converter: function (val, row) {
                            return timeFormat(val, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC))
                        }
                    },
                    {
                        index: 'alias', html: true,
                        converter: function (val, row) {
                            return val || ''
                        }
                    },
                    {
                        index: 'isStarred',
                        html: true,
                        width: '70px',
                        converter: function (val, row) {
                            if (val) {
                                return '<span class="glyphicon cp data-manager-star glyphicon-star"></span>'
                            } else {
                                return '<span class="glyphicon cp data-manager-star glyphicon-star-empty"></span>'
                            }
                        }
                    }
                ],
                onRowClick: function (tr, data) {
                    _this.rowData = data;
                    $(this).toggleClass('active');
                },
                onRowDbClick: function (tr, data) {
                },
                filters: [
                    {
                        param: 'order',
                        element: $('#filterSort'),
                        event: 'change',
                        callback: function (sortIndex) {
                            switch (sortIndex) {
                                case '0': {
                                    return 'asc';
                                }
                                case '1': {
                                    return 'desc';
                                }
                                case '2': {
                                    return 'desc';
                                }
                                case '3': {
                                    return 'asc';
                                }
                                case '4': {
                                    return 'desc';
                                }
                                case '5': {
                                    return 'asc';
                                }
                                default : {
                                    return '';
                                }
                            }
                        }
                    }, {
                        param: 'item',
                        element: $('#filterSort'),
                        event: 'change',
                        callback: function (sortIndex) {
                            switch (sortIndex) {
                                case '0': {
                                    return 'pointname';
                                }
                                case '1': {
                                    return 'pointname';
                                }
                                case '2': {
                                    return 'pointvalue';
                                }
                                case '3': {
                                    return 'pointvalue';
                                }
                                case '4': {
                                    return 'time';
                                }
                                case '5': {
                                    return 'time';
                                }
                                default : {
                                    return '';
                                }
                            }
                        }
                    }
                ]
            };
            _this.$datatable = $table.off().simpleDataTable(dataTableOptions);
        },

        //通过名字删除监视对象
        deleteHasMonitoredNameList: function (name) {
            var hasMonitoredNameList = this.hasMonitoredNameList;
            for (var i = 0, iLen = hasMonitoredNameList.length; i < iLen; i++) {
                if (hasMonitoredNameList[i] == name) {
                    hasMonitoredNameList.splice(i--, 1);
                }
            }
        },
        //通过名字增加监视对象
        addHasMonitoredNameList: function (name) {
            var hasMonitoredNameList = this.hasMonitoredNameList;
            for (var i = 0, iLen = hasMonitoredNameList.length; i < iLen; i++) {
                if (hasMonitoredNameList[i] == name) {
                    return;
                }
            }
            this.hasMonitoredNameList.push(name + '');
        }
    };
    $.extend(PointManagerRealTimeData.prototype, PointManagerRealTimeDataFunc);
    return PointManagerRealTimeData;
})();

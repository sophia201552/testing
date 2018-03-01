var DmTagMark = (function () {
    var _this;

    var markMode = {
        point: 'point',
        folder: 'folder'
    };

    var stateMap = {
        markMode: markMode.point
    };

    function DmTagMark(projectId) {
        _this = this;
        PointManager.call(_this, projectId);
        _this.htmlUrl = '/static/scripts/dataManage/views/dm.importTag.html';
        _this.projectId = projectId;
        this.pageSize = 200;
        this.currentPage = 1;
        this.html = [];
        this.markModeHtml = [];
    }

    DmTagMark.prototype = Object.create(PointManager.prototype);
    DmTagMark.prototype.constructor = DmTagMark;


    var DmTagMarkFunc = {
        show: function () {
            _this.init().done(function () {
                beop.tag.constants.viewType = 'DETAIL';
                _this.$container = $("#tagContainer");
                _this.$container.html(beopTmpl('tpl_tag_view'));
                beop.tag.panel.configModel({
                    cb_on_click: function (tag) {
                        _this.$dataTable.simpleDataTable('getSelectedRows').each(function (index, row) {
                            $(row).find('td:last').append('<span class="keyWordValue tagColor">{tag}</span>'.formatEL({tag: tag}));
                        })
                    }
                });
                beop.tag.panel.init($(".tag-right-box"));
                beop.tag.tree.configModel({
                    cb_on_click: $.noop
                });
                beop.tag.tree.init($("#tagTreeBox"));

                _this.loadTableData();
                _this.attachEvents();
            });
        },

        /***
         * 添加方法
         */


        // 绑定事件
        attachEvents: function () {

            // keyWord  点击关键字;  --要修改
            _this.$container.off('click.keyWord').on('click.keyWord', '.keyWord', _this.seeKeyword);

            // 点击  标记模式   tag模式
            _this.$container.off('click.tag-mode').on('click.tag-mode', '#tag-mode', function () {
                $(this).addClass('tabMode').siblings().removeClass('tabMode');
                $("#modeType-content").empty().append(beopTmpl('tpl_tag_mode_list'));
                _this.tagModeTree();
            }).off('click.mark-mode').on('click.mark-mode', '#mark-mode', function () {
                $(this).addClass('tabMode').siblings().removeClass('tabMode');
                if (stateMap.markMode === markMode.folder) {
                    $("#modeType-content").empty().append(beopTmpl('tpl_markMode_folder'));
                    _this.folderStateTree();
                } else if (stateMap.markMode === markMode.point) {
                    $("#modeType-content").empty().append(beopTmpl('tpl_markMode_point'));
                    _this.pointStateTree();
                }
            });

            // 标记模式  folder 情况下 --要修改
            _this.$container.off('click.folder').on('click.folder', '#folder', _this.folderState);

            // 标记模式  point 情况下 --要修改
            _this.$container.off('click.point').on('click.point', '#point', _this.pointState);

        },
        // 取消事件
        detachEvents: function () {

        },
        loadTableData: function () {
            $.getJSON('/static/scripts/dataManage/dm.tag.data.json').then(function (result) {
                if (result.success) {
                    _this.tableData = result.data;
                    _this.getSubFolderNum();
                    _this.folderState();
                }
            });
        },
        getSubFolderNum: function () {
            for (var i = 0; i < _this.tableData.length; i++) {
                var getPointData = _this.tableData[i].children,
                    length = getPointData.length;

                for (var j = 0; j < length; j++) {
                    if (getPointData[j].children) {
                        length--;
                    }
                }
                if (!_this.tableData[i].count) {
                    _this.tableData[i].count = length;
                }
            }
        },

        // keyWord  关键字
        keywordTree: function () {
            var $table = $("#keyword-list-table");
            var pageSizeIndex,
                $pageSizeSelect = $table.find(".pageSizeSelect");
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }

            var dataTableOptions = {
                url: '/point_tool/getCloudPointTable/',
                post: WebAPI.post,
                postData: {
                    projectId: AppConfig.projectId,
                    searchText: '',
                    t_time: '',
                    pageSize: _this.pageSize, // 一页多少个
                    currentPage: _this.currentPage // 当前第几页
                },
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'currentPage'
                },
                searchInput: $("#keywordSearch"),
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                dataFilter: function (result) {
                    if (result.success) {
                        return result.data.pointTable;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($("#tag-list-box")[0]);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                totalNumIndex: 'data.pointTotal',
                colNames: [
                    '点名',
                    '释义',
                    '点值'
                ],
                colModel: [
                    {index: 'value'},
                    {index: 'alias'},
                    {
                        index: 'params.flag', width: '300px'
                    }
                ]
            };
            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }
            _this.$dataTable = $table.off().simpleDataTable(dataTableOptions);
        },

        // 标记模式
        folderStateTree: function () {
            var $table = $("#markMode-folder-table");
            var pageSizeIndex,
                $pageSizeSelect = $table.find(".pageSizeSelect");
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }

            var dataTableOptions = {
                url: '/point_tool/getCloudPointTable/',
                post: WebAPI.post,
                postData: {
                    projectId: AppConfig.projectId,
                    searchText: '',
                    t_time: '',
                    pageSize: _this.pageSize, // 一页多少个
                    currentPage: _this.currentPage // 当前第几页
                },
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'currentPage'
                },
                searchInput: $("#mode-data-Search"),
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                dataFilter: function (result) {
                    if (result.success) {
                        var newResult = [];
                        for (var i = 0; i < _this.tableData.length; i++) {
                            newResult.push(_this.tableData[i]);
                            if (typeof (newResult[i].html) == 'undefined') {
                                newResult[i].html = _this.html[i];
                            }
                            if (typeof (newResult[i].folderHtml) == 'undefined') {
                                newResult[i].folderHtml = _this.markModeHtml[i];
                            }
                        }
                        return newResult;
                    }

                },
                onBeforeRender: function () {
                    Spinner.spin($("#tag-list-box")[0]);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                onRowDbClick: function (tr, data) {

                },
                totalNumIndex: function () {
                    return _this.tableData.length;
                },
                colNames: [
                    '文件夹',
                    '已有TAG'
                ],
                colModel: [
                    {
                        index: 'folderHtml', html: true,
                        converter: function (value) {
                            return value;
                        }
                    },
                    {
                        index: 'html', html: true,
                        converter: function (value) {
                            return value;
                        }
                    }
                ]
            };
            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }
            _this.$dataTable = $table.off().simpleDataTable(dataTableOptions);
        },
        // 常用 标记模式
        pointStateTree: function () {
            var $table = $("#markMode-point-table");
            var pageSizeIndex,
                $pageSizeSelect = $table.find(".pageSizeSelect");
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }

            var dataTableOptions = {
                url: '/point_tool/getCloudPointTable/',
                post: WebAPI.post,
                postData: {
                    projectId: AppConfig.projectId,
                    searchText: '',
                    t_time: '',
                    pageSize: _this.pageSize, // 一页多少个
                    currentPage: _this.currentPage // 当前第几页
                },
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'currentPage'
                },
                searchInput: $("#mode-data-Search"),
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                dataFilter: function (result) {
                    if (result.success) {
                        var newResult = [];
                        for (var i = 0; i < result.data.pointTable.length; i++) {
                            newResult.push(result.data.pointTable[i]);
                            if (typeof (newResult[i].html) == 'undefined') {
                                newResult[i].html = _this.html;
                            }
                        }
                        return newResult;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($("#tag-list-box")[0]);
                },
                onAfterRender: function () {
                    Spinner.stop();
                    _this.editContent();
                },
                totalNumIndex: 'data.pointTotal',
                colNames: [
                    '点名',
                    '释义',
                    '点值',
                    '已有TAG'
                ],
                colModel: [
                    {index: 'value', width: '240px'},
                    {index: 'alias', width: '240px'},
                    {
                        index: 'params.flag', width: '120px'
                    },
                    {
                        index: 'html', html: true,
                        converter: function (value) {
                            return value;
                        }
                    }
                ]
            };
            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }
            _this.$dataTable = $table.off().simpleDataTable(dataTableOptions);
        },

        // tag 模式
        tagModeTree: function () {
            var $table = $("#tagMode-table");
            var pageSizeIndex,
                $pageSizeSelect = $table.find(".pageSizeSelect");
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }

            var dataTableOptions = {
                url: '/point_tool/getCloudPointTable/',
                post: WebAPI.post,
                postData: {
                    projectId: AppConfig.projectId,
                    searchText: '',
                    t_time: '',
                    pageSize: _this.pageSize, // 一页多少个
                    currentPage: _this.currentPage // 当前第几页
                },
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'currentPage'
                },
                searchInput: $("#mode-data-Search"),
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                dataFilter: function (result) {
                    return result.data.pointTable;
                },
                onBeforeRender: function () {
                    Spinner.spin($("#tag-list-box")[0]);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                totalNumIndex: 'data.pointTotal',
                colNames: [
                    '点名',
                    '释义',
                    '点值'
                ],
                colModel: [
                    {index: 'value'},
                    {index: 'alias'},
                    {
                        index: 'params.flag', width: '240px'
                    }
                ]
            };
            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }
            _this.$dataTable = $table.off().simpleDataTable(dataTableOptions);
        },

        //关键字 查看
        seeKeyword: function () {
            _this.$container.find('.tag-center-box').empty().append(beopTmpl('tpl_tag_keyword_box'));
            _this.keywordTree();
        },

        pointState: function () {
            stateMap.markMode = markMode.point;
            _this.html += '<span class="icon iconfont editTag cp">&#xe710;</span>' +
                '<span class="keyWordValue tagColor">CH</span>' +
                '<span class="keyWordValue tagColor">F</span>' +
                '<span class="keyWordValue">COULD</span>' +
                '<span class="keyWordValue">COULD</span>' +
                '<span class="keyWordValue">COULD</span>';

            _this.$container.find('.tag-center-box').empty().append(beopTmpl('tpl_tag_mode_box'));
            $("#modeType-content").empty().append(beopTmpl('tpl_markMode_point'));
            _this.pointStateTree();
        },

        folderState: function () {
            stateMap.markMode = markMode.folder;
            for (var i = 0; i < _this.tableData.length; i++) {
                var html = '', folderHtml = '';
                html += '';
                _this.html.push(html);

                folderHtml += '<div title="CTW(500)"><span class="glyphicon glyphicon-folder-close"></span>' +
                    '<span style="margin-left: 8px">' +
                    '<span>' + _this.tableData[i].name + '</span>' +
                    '<span>(' + _this.tableData[i].count + ')</span>' +
                    '</span></div>';
                _this.markModeHtml.push(folderHtml);
            }
            _this.$container.find('.tag-center-box').empty().append(beopTmpl('tpl_tag_mode_box'));
            $("#modeType-content").empty().append(beopTmpl('tpl_markMode_folder'));
            _this.folderStateTree();
        },

        //  标记模式下  点击编辑
        editContent: function () {
            var $pointStateTable = _this.$container.find("#markMode-point-table");
            $pointStateTable.find('tr').off('click.editTag').on('click.editTag', '.editTag', function () {
                var $ediModal = $("#tag-markMode-edit");
                $ediModal.modal();
                $ediModal.find('#modeEditContent').empty().append(beopTmpl('tpl_tag_modeEdit'));
                I18n.fillArea($ediModal);
                var $editType = $ediModal.find('#modeEditContent').find('.editType');
                var $editContentBox = $ediModal.find("#modeEdit-content").find('.editContentBox');
                $editType.click(function () {
                    $(this).addClass('selectType').siblings().removeClass('selectType');
                    var index = $editType.index($(this));
                    $editContentBox.eq(index).show().siblings().hide();
                });
                $ediModal.find('.btn-success').click(function () {
                    $ediModal.modal('hide');
                });
            });
        }
    };
    $.extend(DmTagMark.prototype, DmTagMarkFunc);
    return DmTagMark;
})();

var DmTagTreeEdit = (function () {
    var _this;

    function DmTagTreeEdit(projectId) {
        _this = this;
        PointManager.call(_this, projectId);
        _this.htmlUrl = '/static/scripts/dataManage/views/dm.importTag.html';
        _this.projectId = projectId;
    }

    DmTagTreeEdit.prototype = Object.create(PointManager.prototype);
    DmTagTreeEdit.prototype.constructor = DmTagTreeEdit;


    var DmTagTreeEditFunc = {
        show: function () {
            _this.init().done(function () {
                _this.$container = $("#tagContainer");
                _this.$container.html(beopTmpl('tpl_tag_edit'));
                beop.tag.constants.viewType = 'EDIT';
                beop.tag.keywords.configModel({
                    cb_on_click: function (keyword) {
                        _this.$container.find('#tagEditContent').empty().append(beopTmpl('tpl_tag_keyword_box'));
                        _this.$container.find('#keywordName').text(keyword);
                        _this.refreshKeywordsSheet(keyword);
                    }
                });
                beop.tag.keywords.init($(".tag-right-box"));
                _this.attachEvents();
                beop.tag.tree.configModel(
                    {
                        cb_on_click: function (treeNode) {
                            if (treeNode.isParent) {
                                _this.$container.find('#tagEditContent').empty().append(beopTmpl('tpl_tag_rule_edit'));
                                var $ruleBox = $("#ruleBox");
                                if (treeNode.rules && treeNode.rules.length) {
                                    beop.tag.rule.init($ruleBox, {
                                        'list': treeNode.rules
                                    });
                                } else {
                                    beop.tag.rule.init($ruleBox);
                                }
                                $('#tagKeywordsUl').find('li').removeClass('active');
                            }
                        }
                    }
                );
                beop.tag.tree.init(_this.$container.find("#tagTreeBox"));
            });
        },

        /***
         * 添加方法
         */
        dmReset: function () {
            beop.tag.rule.reset();
        },
        dmRuleTest: function () {
            beop.tag.rule.getRuleList(); // 待用,,等接口
            _this.refreshSheet();
        },
        isShowSubFolderDom: function () {
            var $ruleSubFolderNameBox = _this.$container.find("#ruleSubFolderNameBox");
            if (_this.$container.find("#isCreateSubFolder").val() == '1') { // 生成子文件夹
                $ruleSubFolderNameBox.show();
            } else {// 不生成子文件夹
                $ruleSubFolderNameBox.hide();
            }
        },
        refreshKeywordsSheet: function (keyword) {
            var queryData = {
                currentPage: 1,
                pageSize: 100,
                projectId: _this.projectId
            };
            var $keywordListTable = _this.$container.find("#keyword-list-table");
            if (keyword) {
                queryData['searchText'] = keyword.trim();
            }
            var dataTableOptions = {
                url: '/point_tool/getCloudPointTable/',
                post: WebAPI.post,
                postData: queryData,
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'currentPage'
                },
                searchInput: _this.$container.find("#textSearch"),
                rowsNums: [50, 100, 200, 500, 1000],
                dataFilter: function (result) {
                    if (result.success) {
                        return result.data.pointTable;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($keywordListTable.get(0));
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                colNames: ['点名', '释义', '点值'],
                colModel: [
                    {index: 'value'},
                    {index: 'alias'},
                    {index: 'pointValue'}
                ],
                totalNumIndex: 'data.pointTotal'
            };

            if (_this.$datatable) {
                _this.$datatable.removeData();
                _this.$datatable = null;
            }

            _this.$datatable = $keywordListTable.off().simpleDataTable(dataTableOptions);
        },
        refreshSheet: function () { // testData 待修改
            var queryData = {
                currentPage: 1,
                pageSize: 100,
                projectId: _this.projectId
            };
            var $ruleTable = _this.$container.find("#ruleTable");
            var dataTableOptions = {
                url: '/point_tool/getCloudPointTable/',
                post: WebAPI.post,
                postData: queryData,
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'currentPage'
                },
                searchInput: $("#text_search"),
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: 1,
                dataFilter: function (result) {
                    if (result.success) {
                        return result.data.pointTable;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($ruleTable.get(0));
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                colNames: ['点名', '释义', '点值'],
                colModel: [
                    {index: 'value'},
                    {index: 'alias'},
                    {index: 'pointValue'}
                ],
                totalNumIndex: 'data.pointTotal'
            };

            if (_this.$datatable) {
                _this.$datatable.removeData();
                _this.$datatable = null;
            }

            _this.$datatable = $ruleTable.off().simpleDataTable(dataTableOptions);
        },
        // 绑定事件
        attachEvents: function () {
            _this.$container.off('click.dmReset').on('click.dmReset', '#dmReset', _this.dmReset);
            _this.$container.off('click.dmRuleTest').on('click.dmRuleTest', '#dmRuleTest', _this.dmRuleTest);
            _this.$container.off('change.isCreateSubFolder').on('change.isCreateSubFolder', '#isCreateSubFolder', _this.isShowSubFolderDom);
        },
        // 取消事件
        detachEvents: function () {

        }
    };
    $.extend(DmTagTreeEdit.prototype, DmTagTreeEditFunc);
    return DmTagTreeEdit;
})();

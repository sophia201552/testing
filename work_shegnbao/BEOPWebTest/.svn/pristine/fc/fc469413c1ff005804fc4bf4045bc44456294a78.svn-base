var VersionHistory = (function () {
    function VersionHistory() {
        this.configMap = {
            templateURL: "static/views/admin/versionHistory.html",
            addVersionHistoryTitleGreed: I18n.resource.admin.versionHistory.VERSION_HISTORY_TITLE,
            addVersionHistoryContentGreed: I18n.resource.admin.versionHistory.VERSION_HISTORY_CONTENT,
            versionHistoryEditBtnClass: '.version-history-edit',
            versionHistoryDeleteBtnClass: '.version-history-delete'
        };
        this.jqueryMap = {};
        this.apiMap = {
            getVersionHistory: 'workflow/versionHistory/getAll',
            addVersionHistory: 'workflow/versionHistory/add',
            updateVersionHistory: 'workflow/versionHistory/update',
            getAccurateVersionHistory: 'workflow/versionHistory/getAccurate',
            deleteVersionHistory: 'workflow/versionHistory/delete'
        };
        this.templateId = {
            setVersionPanelList: 'versionHistoryPlate_init'
        };
        this.UEeditor = null;
    }

    VersionHistory.prototype = {

        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get(this.configMap.templateURL + '?t=' + new Date().getTime()).done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init().done(function () {
                    _this.attachEvent();
                    I18n.fillArea($(ElScreenContainer));
                }).always(function () {
                    Spinner.stop();
                });

            });
        },
        init: function () {
            var _this = this;
            return WebAPI.get(this.apiMap.getVersionHistory).done(function (result) {
                var isPermission, html = '<button type="button" class="btn btn-success pull-right" id="versionHistory-add" i18n="admin.versionHistory.ADD_VERSION_HISTORY"></button>';
                AppConfig.userId == 1 ? (isPermission = true, $('.versionHistory-add-container').append(html)) : isPermission = false;
                _this.setJqueryMap();
                if (result.data !== null && result.data.length) {
                    $('#versionHistory-container').html(beopTmpl(_this.templateId.setVersionPanelList, {
                        versionList: result.data,
                        isPermission: isPermission
                    }));
                }
            })
        },
        setJqueryMap: function () {
            this.jqueryMap = {
                UEditor: $('#versionHistory-UEditor'),
                UEditorIdName: 'versionHistory-UEditor',
                modal: $('#versionHistory-modal')
            }
        },
        attachEvent: function () {
            var _this = this;
            this.jqueryMap.modal = $('#versionHistory-modal');

            var UEDITOR, verisonDescription, versionTitle, versionId;
            var $versionHistoryTitle = this.jqueryMap.modal.find('#versionHistory-modal-title'), $versionHistoryCommit = this.jqueryMap.modal.find('#versionHistory-commit'),
                $versionHistoryBody = $('#versionHistory'),
            // UPDATE  ADD DELETE
                $versionHistoryEditBtn = $(this.configMap.versionHistoryEditBtnClass), $versionHistoryAdd = $('#versionHistory-add'), $versionHistoryDeleteBtn = $(this.configMap.versionHistoryDeleteBtnClass);

            //编辑
            $versionHistoryEditBtn.off();
            $versionHistoryBody.on('click', this.configMap.versionHistoryEditBtnClass, function () {
                var $this = $(this);
                verisonDescription = $.trim($this.parent().next().html());
                versionTitle = $.trim($this.prev().text());
                $versionHistoryCommit.attr('data-type', 'edit');
                //获取 versionId
                versionId = $this.parent().parent().attr('data-version-history-id');
                //设置标题
                $versionHistoryTitle.text(versionTitle).attr('contenteditable', false);
                _this.jqueryMap.modal.modal({
                    keyboard: false,
                    backdrop: 'static'
                });
            });

            //删除
            $versionHistoryDeleteBtn.off();
            $versionHistoryBody.on('click', this.configMap.versionHistoryDeleteBtnClass, function () {
                var $this = $(this), $parent = $this.parent().parent();
                //获取 versionId
                versionId = $parent.attr('data-version-history-id');
                var isSureDelete = confirm(I18n.resource.admin.versionHistory.VERSION_HISTORY_DELETE);
                if (isSureDelete) {
                    Spinner.spin(ElScreenContainer);
                    WebAPI.post(_this.apiMap.deleteVersionHistory + '/' + AppConfig.userId + '/' + versionId).done(function () {
                        $parent.remove();
                        Alert.success(ElScreenContainer, I18n.resource.admin.versionHistory.VERSION_HISTORY_DELETE_SUCCESS).showAtTop(200);
                    }).fail(function () {
                        Alert.danger(ElScreenContainer, I18n.resource.admin.versionHistory.VERSION_HISTORY_DELETE_FAILED).showAtTop(200);
                    }).always(function () {
                        Spinner.stop();
                    })
                }
            });

            //添加
            $versionHistoryAdd.off().on('click', function () {
                verisonDescription = _this.configMap.addVersionHistoryContentGreed;
                versionTitle = _this.configMap.addVersionHistoryTitleGreed;
                $versionHistoryCommit.attr('data-type', 'new');
                //设置标题
                $versionHistoryTitle.text(versionTitle).attr('contenteditable', false);
                _this.jqueryMap.modal.modal({
                    keyboard: false,
                    backdrop: 'static'
                });
            });

            //当打开modal框的时候 生成编辑器
            _this.jqueryMap.modal.on('shown.bs.modal', function () {

                var $modalBody = _this.jqueryMap.modal.find('.modal-body'),
                    width = $modalBody.width();

                Spinner.spin($modalBody.get(0));

                //UEDITOR = UE.getEditor(_this.jqueryMap.UEditorIdName, window.UEDITOR_CONFIG.toolbars);

                UEDITOR = new UE.ui.Editor({initialFrameHeight: 400, initialFrameWidth: width});
                UEDITOR.setOpt(window.UEDITOR_CONFIG.toolbars);
                UEDITOR.render(_this.jqueryMap.UEditorIdName);
                UEDITOR.ready(function () {
                    //设置编辑器的内容
                    _this.UEeditor = UEDITOR;
                    UEDITOR.setContent(verisonDescription);
                    Spinner.stop();
                });

            });

            this.jqueryMap.modal.find('button[data-close="modal"]').off().on('click', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                var isHide = confirm(I18n.resource.admin.versionHistory.VERSION_HISTORY_ALERT);
                if (isHide) {
                    _this.jqueryMap.modal.modal('hide');
                } else {
                    return false;
                }
            });

            //当关闭modal框的时候清掉 编辑器
            this.jqueryMap.modal.on('hidden.bs.modal', function () {
                UEDITOR.destroy();
            });


            //更改标题
            $versionHistoryTitle.off().on('click', function () {
                var html = '<input type="text"/',
                    $this = $(this),
                    text = $this.text();
                $this.attr('contenteditable', true);
            });

            //确定更改
            $versionHistoryCommit.off().on('click', function () {
                var $this = $(this), attr = $this.attr('data-type');
                switch (attr) {
                    case 'new':
                        _this.addVersion();
                        break;
                    case 'edit':
                        _this.updateVersion(versionId);
                        break;
                }

            });


        },
        addVersion: function () {
            var UE = this.UEeditor, _this = this;
            var html = $.trim(UE.getContent()),
                txt = $.trim(UE.getContentTxt()),
                userId = AppConfig.userId,
            //读取标题
                title = $.trim(this.jqueryMap.modal.find('#versionHistory-modal-title').text());

            if (title == this.configMap.addVersionHistoryTitleGreed || txt == this.configMap.addVersionHistoryContentGreed) {
                Alert.danger(ElScreenContainer, I18n.resource.admin.versionHistory.TIPS).showAtTop(200);
                return false;
            }
            Spinner.spin(this.jqueryMap.modal.get(0));
            WebAPI.post(this.apiMap.addVersionHistory + '/' + userId, {
                title_version: title,
                userId: userId,
                html: html,
                txt: txt
            }).done(function (result) {

                var getNewVersion = function (id) {
                    return WebAPI.get(_this.apiMap.getAccurateVersionHistory + '/' + id).done(function (result) {
                        if (result.data) {
                            var data = result.data;
                            $('#versionHistory-container').prepend(beopTmpl('versionHistoryPlate_init', {
                                versionList: [{
                                    version: data.version,
                                    log: data.log,
                                    id: data.id,
                                    userId: userId
                                }],
                                isPermission: true
                            }));
                        }
                    })
                };

                getNewVersion(result.data.versionId).done(function () {
                    Alert.success(ElScreenContainer, I18n.resource.admin.versionHistory.ADD_SUCCESS).showAtTop(200);
                }).always(function () {
                    Spinner.stop();
                    _this.jqueryMap.modal.modal('hide');
                });


            }).always(function () {

            }).fail(function () {
                Alert.danger(ElScreenContainer, I18n.resource.admin.versionHistory.ADD_FAILED).showAtTop(200);
            })
        },
        updateVersion: function (versionId) {
            var UE = this.UEeditor, _this = this;
            var html = UE.getContent(),
                txt = UE.getContentTxt(),
                userId = AppConfig.userId,
            //读取标题
                title = $(this.jqueryMap.modal.find('#versionHistory-modal-title')).text();


            Spinner.spin(this.jqueryMap.modal.get(0));
            WebAPI.post(this.apiMap.updateVersionHistory + '/' + userId + '/' + versionId, {
                title_version: title,
                userId: userId,
                html: html,
                txt: txt,
                versionId: versionId
            }).done(function () {
                var getNewVersion = function (id) {
                    return WebAPI.get(_this.apiMap.getAccurateVersionHistory + '/' + id).done(function (result) {
                        if (result.data) {
                            var data = result.data;
                            $('#versionHistory-container').find('div').each(function () {
                                var $this = $(this), versionHistoryID = $this.attr('data-version-history-id');
                                if (versionHistoryID == versionId) {
                                    $this.replaceWith(beopTmpl('versionHistoryPlate_init', {
                                        versionList: [{
                                            version: data.version,
                                            log: data.log,
                                            id: data.id,
                                            userId: userId
                                        }],
                                        isPermission: true
                                    }))
                                }
                            });
                        }
                    })
                };

                getNewVersion(versionId).done(function () {
                    Alert.success(ElScreenContainer, I18n.resource.admin.versionHistory.UPDATE_SUCCESS).showAtTop(200);
                }).always(function () {
                    Spinner.stop();
                    _this.jqueryMap.modal.modal('hide');
                });

            }).always(function () {

                _this.jqueryMap.modal.modal('show');
            }).fail(function () {
                Alert.danger(ElScreenContainer, I18n.resource.admin.versionHistory.UPDATE_FAILED).showAtTop(200);
            })
        },
        detachEvents: function () {
            this.jqueryMap.modal.off();
        },
        close: function () {
            this.detachEvents();
        }
    };

    return VersionHistory;
})();
var VersionHistory = (function () {
    function VersionHistory() {
        this.configMap = {
            templateURL: "static/views/admin/versionHistory.html" + '?=' + new Date().getTime(),
            addVersionHistoryTitleGreed: I18n.resource.admin.versionHistory.VERSION_HISTORY_TITLE,
            addVersionHistoryContentGreed: I18n.resource.admin.versionHistory.VERSION_HISTORY_CONTENT,
            versionHistoryEditBtnClass: '.version-history-edit',
            versionHistoryDeleteBtnClass: '.version-history-delete',
            versionHistoryConfigBtnClass: '.version-history-config'
        };
        this.jqueryMap = {};
        this.apiMap = {
            getVersionHistory: 'workflow/versionHistory/getAll/',
            addVersionHistory: 'workflow/versionHistory/add',
            updateVersionHistory: 'workflow/versionHistory/update',
            getAccurateVersionHistory: 'workflow/versionHistory/getAccurate',
            deleteVersionHistory: 'workflow/versionHistory/delete'
        };
        this.templateId = {
            setVersionPanelList: 'versionHistoryPlate_item'
        };
        this.versionOwnersList = null;
        this.UEeditor = null;
        this.modalType = null;
        this.versionId = null;
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
            return WebAPI.get(this.apiMap.getVersionHistory + AppConfig.userId).done(function (result) {
                var isPermission, html = '<button type="button" class="btn btn-success pull-right" id="versionHistory-add" i18n="admin.versionHistory.ADD_VERSION_HISTORY"></button>';
                AppConfig.userId == 1 || AppConfig.userId == 67  ? (isPermission = true, $('.versionHistory-add-container').append(html)) : isPermission = false;
                _this.setJqueryMap();
                if (result.data !== null && result.data.length) {
                    var projectImgUrlList = {};
                    result.data.forEach(function (item) {
                        projectImgUrlList[item.id] = _this.getProjectInfo(item);
                    });
                    $('#versionHistory-container').html(beopTmpl(_this.templateId.setVersionPanelList, {
                        versionList: result.data,
                        isPermission: isPermission,
                        projectImgUrlList: projectImgUrlList,
                        changeProjectImg: true
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
                verisonDescription = $.trim($this.parent().next().find('.panel-project-log').html());
                versionTitle = $.trim($this.parent().find('.panel-title').text());
                _this.modalType = 'edit';
                //获取 versionId
                versionId = $this.parent().parent().attr('data-version-history-id');
                //设置标题
                $versionHistoryTitle.text(versionTitle).attr('contenteditable', false);
                var $modalBody = _this.jqueryMap.modal.find('.modal-body');
                $modalBody.empty();
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
                //TODO 测试confirm
                confirm(I18n.resource.admin.versionHistory.VERSION_HISTORY_DELETE, function () {
                    Spinner.spin(ElScreenContainer);
                    WebAPI.post(_this.apiMap.deleteVersionHistory + '/' + AppConfig.userId + '/' + versionId).done(function () {
                        $parent.remove();
                        Alert.success(ElScreenContainer, I18n.resource.admin.versionHistory.VERSION_HISTORY_DELETE_SUCCESS).showAtTop(200);
                    }).fail(function () {
                        Alert.danger(ElScreenContainer, I18n.resource.admin.versionHistory.VERSION_HISTORY_DELETE_FAILED).showAtTop(200);
                    }).always(function () {
                        Spinner.stop();
                    })
                });
            });

            //添加
            $versionHistoryAdd.off().on('click', function () {
                verisonDescription = _this.configMap.addVersionHistoryContentGreed;
                versionTitle = _this.configMap.addVersionHistoryTitleGreed;
                _this.modalType = 'new';
                //设置标题
                $versionHistoryTitle.text(versionTitle).attr('contenteditable', false);
                var $modalBody = _this.jqueryMap.modal.find('.modal-body');
                $modalBody.empty();
                _this.jqueryMap.modal.modal({
                    keyboard: false,
                    backdrop: 'static'
                });
            });

            //配置
            _this.attachConfigOwnersEvent();
            //当打开modal框的时候 生成编辑器
            _this.jqueryMap.modal.on('shown.bs.modal', function () {
                var $modalBody = _this.jqueryMap.modal.find('.modal-body'),
                    width = $modalBody.width();
                Spinner.spin($modalBody.get(0));
                if (_this.modalType == 'config') {
                    Spinner.stop();
                } else {
                    $modalBody.append('<script id="versionHistory-UEditor" name="content" type="text/plain"></script>');
                    UEDITOR = new UE.ui.Editor({initialFrameHeight: 400, initialFrameWidth: width});
                    UEDITOR.setOpt(window.UEDITOR_CONFIG.toolbars);
                    UEDITOR.render(_this.jqueryMap.UEditorIdName);
                    UEDITOR.ready(function () {
                        //设置编辑器的内容
                        _this.UEeditor = UEDITOR;
                        UEDITOR.setContent(verisonDescription);
                        Spinner.stop();
                    });
                }
            });

            this.jqueryMap.modal.find('button[data-close="modal"]').off().on('click', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                if (_this.modalType == 'config') {
                    _this.jqueryMap.modal.modal('hide');
                } else {
                    //TODO 测试confirm
                    confirm(I18n.resource.admin.versionHistory.VERSION_HISTORY_ALERT, function () {
                        _this.jqueryMap.modal.modal('hide');
                    });
                }
            });

            //当关闭modal框的时候清掉 编辑器
            this.jqueryMap.modal.on('hidden.bs.modal', function () {
                if (_this.modalType == 'config') {

                } else {
                    UEDITOR.destroy();
                }
            });


            //更改标题
            $versionHistoryTitle.off().on('click', function () {
                if (_this.modalType == 'config') {
                    return false;
                } else {
                    var html = '<input type="text"/',
                        $this = $(this),
                        text = $this.text();
                    $this.attr('contenteditable', true);
                }
            });

            //确定更改
            $versionHistoryCommit.off().on('click', function () {
                switch (_this.modalType) {
                    case 'new':
                        _this.addVersion();
                        break;
                    case 'edit':
                        _this.updateVersion(versionId);
                        break;
                    case 'config':
                        _this.updateOwners(_this.versionId);
                        break;
                }
            });
        },
        getProjectInfo: function (item, isJson) {
            var ownerList;
            if (item.owners) {
                try {
                    if (!isJson) {
                        ownerList = JSON.parse(item.owners);
                    } else {
                        ownerList = item.owners;
                    }
                    var list = [];
                    ownerList.forEach(function (id) {
                        AppConfig.projectList.forEach(function (project) {
                            if (project.id == id) {
                                list.push({
                                    pic: project.pic,
                                    name: project.name_cn
                                });
                            }
                        })
                    });
                    return list;
                } catch (ex) {
                    console.error(ex);
                }
            } else {
                return null;
            }
        },
        attachConfigOwnersEvent: function () {
            var $versionHistoryBody = $('#versionHistory'), _this = this;
            $versionHistoryBody.find(this.configMap.versionHistoryConfigBtnClass).off().on('click', function (ev) {
                _this.jqueryMap.modal.find('#versionHistory-modal-title').text($.trim($(this).parent().find('.panel-title').text())).attr('contenteditable', false);
                _this.modalType = 'config';
                var $this = $(this);
                //获取 versionId
                _this.versionId = $this.parent().parent().attr('data-version-history-id');
                var $modalBody = _this.jqueryMap.modal.find('.modal-body');
                $modalBody.empty();
                Spinner.spin(ElScreenContainer);
                WebAPI.post(_this.apiMap.getAccurateVersionHistory + '/' + _this.versionId, {userId: AppConfig.userId}).done(function (result) {
                    if (result.data) {
                        var versionOwners = result.data.owners;
                        if (!(!!versionOwners) || versionOwners === 'undefined' || versionOwners == []) {
                            versionOwners = [];
                        } else {
                            versionOwners = JSON.parse(versionOwners);
                        }
                        _this.versionOwnersList = versionOwners;
                        $modalBody.off().html(beopTmpl('versionHistory_config_proj_item', {
                            isEN: false,
                            versionId: _this.versionId,
                            versionOwners: versionOwners
                        }));
                        //_this.jqueryMap.modal.find('.version-history-config .project-item').off().click(function (ev) {
                        _this.jqueryMap.modal.off('.project-item').on('click.project-item', '.project-item', function (ev) {
                            var $this = $(this), projectId = $this.attr('data-project-id');
                            $this.toggleClass('checked');
                            if ($this.hasClass('checked')) {
                                _this.setOwners(projectId);
                            } else {
                                _this.removeOwners(projectId);
                            }
                            ev.stopPropagation();
                            ev.preventDefault();
                        });
                        _this.jqueryMap.modal.modal({
                            keyboard: false,
                            backdrop: 'static'
                        });
                    }
                }).fail(function () {

                }).always(function () {
                    Spinner.stop();
                });
            });
        },
        setOwners: function (projectId) {
            if (this.versionOwnersList.indexOf(projectId) == -1) {
                this.versionOwnersList.push(projectId);
            }
        },
        removeOwners: function (projectId) {
            var index = this.versionOwnersList.indexOf(projectId);
            if (index !== -1) {
                this.versionOwnersList.splice(index, 1);
            }
        },
        updateOwners: function (versionId) {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.post('workflow/versionHistory/setOwners', {
                versionId: versionId,
                userId: AppConfig.userId,
                owners: this.versionOwnersList
            }).done(function () {
                $('#versionHistory-container').find('.panel').each(function () {
                        var $this = $(this);
                        if ($this.attr('data-version-history-id') == versionId) {
                            $this.find('.panel-project-img').remove().end().find('.panel-body').prepend(beopTmpl('versionHistory_config_proj_img', {
                                    projectImgUrlList: _this.getProjectInfo({owners: _this.versionOwnersList}, true)
                                }
                            ))
                        }
                    }
                );
                alert('保存配置成功！');
                _this.jqueryMap.modal.modal('hide');
            }).fail(function () {
                alert('保存配置失败！')
            }).always(function () {
                Spinner.stop();
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
                    return WebAPI.post(_this.apiMap.getAccurateVersionHistory + '/' + id, {userId: AppConfig.userId}).done(function (result) {
                        if (result.data) {
                            var data = result.data;
                            _this.versionOwnersList = result.data.owners;
                            var projectImgUrlList = {};
                            projectImgUrlList[result.data.id] = _this.getProjectInfo({owners: _this.versionOwnersList}, true);
                            $('#versionHistory-container').prepend(beopTmpl(_this.templateId.setVersionPanelList, {
                                versionList: [{
                                    version: data.version,
                                    log: data.log,
                                    id: data.id,
                                    userId: userId
                                }],
                                isPermission: true,
                                projectImgUrlList: projectImgUrlList,
                                changeProjectImg: true
                            }));
                        }
                    })
                };

                getNewVersion(result.data.versionId).done(function () {
                    Alert.success(ElScreenContainer, I18n.resource.admin.versionHistory.ADD_SUCCESS).showAtTop(200);
                }).always(function () {
                    Spinner.stop();
                    _this.jqueryMap.modal.modal('hide');
                    _this.attachConfigOwnersEvent();
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
                    return WebAPI.post(_this.apiMap.getAccurateVersionHistory + '/' + id, {userId: AppConfig.userId}).done(function (result) {
                        if (result.data) {
                            var data = result.data;
                            $('#versionHistory-container').find('div').each(function () {
                                var $this = $(this), versionHistoryID = $this.attr('data-version-history-id');
                                if (versionHistoryID == versionId) {
                                    $this.replaceWith(beopTmpl(_this.templateId.setVersionPanelList, {
                                        versionList: [{
                                            version: data.version,
                                            log: data.log,
                                            id: data.id,
                                            userId: userId
                                        }],
                                        isPermission: true,
                                        changeProjectImg: false
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
                    _this.attachConfigOwnersEvent();
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
            this.versionOwnersList = null;
            this.UEeditor = null;
            this.modalType = null;
            this.versionId = null;
        }
    };
    return VersionHistory;
})
();
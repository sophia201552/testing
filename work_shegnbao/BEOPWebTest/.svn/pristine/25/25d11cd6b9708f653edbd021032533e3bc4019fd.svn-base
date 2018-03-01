(function (beop) {
    var configMap = {
            htmlURL: '/point_tool/html/pointTemplate',
            algorithmUrl: '/algorithm/'
        },
        stateMap = {
            option: null,
            editor: null,
            logic: '',
            zTreeInstance: null,
            treeData: null,
            zTreeNodeList: [],
            currentTreeNode: null,
            importStatus: 'show',
            importData: null
        },
        jqueryMap = {},
        setJqueryMap, init, destroy, bindEvents,
        refreshEditor, zTreeOnClick, getInstance, addFolder, loadAllTree, refreshTree, changeToZTreeNodes,
        getLogic, templateSearch, refreshImportTemplateInfo, importTemplateEdit, importTemplateSave,
        saveAsTemplateConfirm, templateImportConfirm,
        zTreeBeforeRemove, zTreeOnRemove, zTreeShowRemoveBtn;


    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $editorBox: $container.find('#editorBox'),
            $codeEditorTextarea: $container.find('#codeEditorTextarea'),
            $templateTreeMenu: $container.find('#templateTreeMenu'),
            $templateRight: $container.find('#templateRight'),
            $addFolder: $container.find('#addFolder'),
            $addFolderInput: $container.find('#addFolderInput'),
            $templateWinBox: $container.find('#templateWinBox'),
            $saveAsTemplateConfirm: $container.find('#saveAsTemplateConfirm'),
            $templateImportConfirm: $container.find('#templateImportConfirm'),
            $templateName: $container.find('#templateName'),
            $templateMessage: $container.find('#templateMessage'),
            $templateImportWin: $container.find('#templateImportWin'),
            $saveAsTemplateWin: $container.find('#saveAsTemplateWin'),
            $templateSearch: $container.find('#templateSearch')
        };
    };

    init = function (option) {
        stateMap.option = option;
        stateMap.$container = option.container;

        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            if (option.opType === 'save') {
                jqueryMap.$templateWinBox.empty().append(beopTmpl('tpl_save_as_template'));
            } else if (option.opType === 'import') {
                jqueryMap.$templateWinBox.empty().append(beopTmpl('tpl_import_template'));
                refreshImportTemplateInfo();
            }
            stateMap.$container.find('.templateWin').modal({
                keyboard: false,
                backdrop: 'static'
            });
            if (option.opType == 'save') {
                if (option.logic) {
                    stateMap.logic = option.logic;
                }
            }
            loadAllTree();
            stateMap.$container.show();
            bindEvents();
        });
    };

    destroy = function () {
        stateMap.zTreeInstance && stateMap.zTreeInstance.destroy();
        jqueryMap.$container.empty();
        stateMap = {
            option: null,
            editor: null,
            logic: '',
            zTreeInstance: null,
            treeData: null,
            zTreeNodeList: [],
            currentTreeNode: null
        };
    };

    bindEvents = function () {
        setJqueryMap();
        jqueryMap.$container.off('click.addFolder').on('click.addFolder', '#addFolder', addFolder);
        jqueryMap.$container.off('click.saveAsTemplateConfirm').on('click.saveAsTemplateConfirm', '#saveAsTemplateConfirm', saveAsTemplateConfirm);
        jqueryMap.$container.off('click.templateImportConfirm').on('click.templateImportConfirm', '#templateImportConfirm', templateImportConfirm);
        jqueryMap.$container.off('click.importTemplateEdit').on('click.importTemplateEdit', '#importTemplateEdit', importTemplateEdit);
        jqueryMap.$container.off('click.importTemplateSave').on('click.importTemplateSave', '#importTemplateSave', importTemplateSave);
        jqueryMap.$templateImportWin.off('hide.bs.modal').on('hide.bs.modal', destroy);
        jqueryMap.$saveAsTemplateWin.off('hide.bs.modal').on('hide.bs.modal', destroy);
        jqueryMap.$templateImportWin.off('shown.bs.modal').on('shown.bs.modal', refreshEditor);
        jqueryMap.$saveAsTemplateWin.off('shown.bs.modal').on('shown.bs.modal', refreshEditor);
        jqueryMap.$templateSearch.off().on('keydown', templateSearch);
    };

    function getTreeNodeUrl(treeId, treeNode) {
        return configMap.algorithmUrl + 'folder/' + treeNode.id;
    }

    refreshTree = function (result) {
        var zTreeSetting = {
            view: {
                selectedMulti: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: zTreeOnClick,
                beforeRemove: zTreeBeforeRemove,
                onRemove: zTreeOnRemove
            },
            async: {
                enable: true,
                url: getTreeNodeUrl
            },
            edit: {
                enable: true,
                showRemoveBtn: zTreeShowRemoveBtn,
                showRenameBtn: false
            }
        };
        stateMap.treeData = result;
        stateMap.zTreeNodeList = [];
        changeToZTreeNodes();
        stateMap.zTreeInstance = $.fn.zTree.init(jqueryMap.$templateTreeMenu, zTreeSetting, stateMap.zTreeNodeList);

    };

    loadAllTree = function () {
        WebAPI.get(configMap.algorithmUrl + 'folder/null').done(function (result) {
            if (result.length) {
                refreshTree(result);
            }
        });
    };

    templateSearch = function (e) {
        if (e.keyCode === 13) {
            var val = jqueryMap.$templateSearch.val();
            if (val) {
                WebAPI.get(configMap.algorithmUrl + 'search/' + val).done(function (result) {
                    if (result.length) {
                        refreshTree(result);
                    }
                });
            } else {
                loadAllTree();
            }
        }
    };

    importTemplateEdit = function () {
        stateMap.importStatus = 'edit';
        refreshImportTemplateInfo();
    };

    importTemplateSave = function () {
        stateMap.importStatus = 'show';
        stateMap.importData.name = $("#import_tpl_name").val().trim();
        stateMap.importData.note = $("#import_tpl_note").val().trim();
        refreshImportTemplateInfo(); // 待改
        // to - do 调保存接口
    };

    saveAsTemplateConfirm = function () {
        var name = jqueryMap.$templateName.val().trim(),
            note = jqueryMap.$templateMessage.val().trim();
        if (!name) {
            alert(I18n.resource.debugTools.template.TEMPLATE_NAME_REQUIRED);
            return;
        }
        if (!stateMap.currentTreeNode || !stateMap.currentTreeNode.isParent) {
            alert(I18n.resource.debugTools.template.PLEASE_SELECT_A_FOLDER);
            return;
        }
        WebAPI.post(configMap.algorithmUrl + 'save/', {
            '_id': ObjectId(),
            'parent_id': stateMap.currentTreeNode.id,
            'name': name,
            'note': note,
            'isFolder': false,
            'content': stateMap.editor.doc.getValue()
        }).done(function (result) {
            if (result) {
                stateMap.zTreeInstance.addNodes(stateMap.zTreeInstance.getNodeByTId(stateMap.currentTreeNode.tId), {
                    'id': result,
                    'pId': stateMap.currentTreeNode.id,
                    'name': name
                });
                //stateMap.zTreeInstance.refresh();
                alert(I18n.resource.common.ADD_SUCCESS);
                jqueryMap.$saveAsTemplateWin.modal('hide');
            }
        });
    };

    templateImportConfirm = function () {
        stateMap.option.confirmCallBack ? stateMap.option.confirmCallBack() : '';
    };

    changeToZTreeNodes = function () {
        for (var i = 0; i < stateMap.treeData.length; i++) {
            var data = stateMap.treeData[i];
            var item = {};
            item.id = data._id;
            item.name = data.name;
            if (data.parent_id && data.parent_id.length == 24) {// 有测试的错误数据，暂用length判断
                item.pId = data.parent_id
            }
            if (data.isFolder) {
                item.isParent = true;
            }
            stateMap.zTreeNodeList.push(item);
        }
    };

    getInstance = function () {
        return stateMap.option;
    };

    refreshEditor = function () {
        var readOnlyFlag, logic = stateMap.logic ? stateMap.logic : '# code here';
        jqueryMap.$container.find('.CodeMirror').remove();
        setJqueryMap();
        stateMap.editor = null;
        jqueryMap.$codeEditorTextarea.text(logic);
        readOnlyFlag = (stateMap.option.opType == 'import');
        stateMap.editor = CodeMirror.fromTextArea(document.getElementById('codeEditorTextarea'), {
            mode: "python",
            lineNumbers: true,
            readOnly: readOnlyFlag,
            autofocus: true
        });
        stateMap.editor.refresh();
        I18n.fillArea(jqueryMap.$container);
    };

    zTreeOnClick = function (e, treeId, treeNode) { // e js event , treeId 父节点id, treeNode 当前节点信息
        // 用于（从模板导入）窗口中查看模板信息
        stateMap.currentTreeNode = treeNode;
        stateMap.importStatus = 'show';
        if (stateMap.option.opType == 'import') { // 点击显示code
            if (!treeNode.isParent) { // 模板
                Spinner.spin(jqueryMap.$templateRight.get(0));
                var nodeId = treeNode._id ? treeNode._id : treeNode.id;
                WebAPI.get(configMap.algorithmUrl + nodeId).done(function (result) {
                    if (result) {
                        stateMap.logic = result.content;
                        stateMap.importData = result;
                        refreshImportTemplateInfo();
                        jqueryMap.$templateRight.children().show();
                        refreshEditor();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            }
        }
    };

    zTreeShowRemoveBtn = function (treeId, treeNode) {
        return treeNode.creator == AppConfig.userId;
    };

    zTreeBeforeRemove = function (treeId, treeNode) {
        confirm(I18n.resource.dataManage.REMOVE_CONFIRM, function () {
            Spinner.spin(document.body);
            WebAPI.post(configMap.algorithmUrl + 'delete/', {
                id: treeNode._id
            }).done(function (result) {
                if (result.success) {
                    stateMap.zTreeInstance.removeNode(treeNode);
                    if (stateMap.option.opType == 'import') {
                        jqueryMap.$templateRight.children().hide();
                    }
                } else {
                    alert.danger('delete failed ' + result.msg ? result.msg : '');
                }
                alert(I18n.resource.common.DELETE_SUCCESS);
            }).fail(function () {
                alert.danger('delete failed, server is busy.');
            }).always(function () {
                Spinner.stop();
            })
        });
        return false;
    };

    zTreeOnRemove = function (e, treeId, treeNode) {
        return false;
    };

    refreshImportTemplateInfo = function () {
        $("#templateInfo").empty().append(beopTmpl('tpl_import_template_info', {
            status: stateMap.importStatus,
            data: stateMap.importData
        }));
        I18n.fillArea(jqueryMap.$container);
    };

    getLogic = function () {
        return stateMap.editor.doc.getValue();
    };

    addFolder = function () {
        var name = jqueryMap.$addFolderInput.val().trim();
        if (name) {
            WebAPI.post(configMap.algorithmUrl + 'folder/add/', {
                '_id': ObjectId(),
                'parent_id': 'null',
                'name': name,
                'note': '',
                'isFolder': true
            }).done(function (result) {
                if (result) {
                    if (stateMap.zTreeInstance) {
                        stateMap.zTreeInstance.addNodes(null, {
                            'name': name,
                            'id': result,
                            'pId': 0,
                            'isParent': true
                        });
                        stateMap.zTreeInstance.refresh();
                    } else {
                        refreshTree([{
                            '_id': result,
                            'isFolder': true,
                            'name': name,
                            'note': "",
                            'parent_id': "null"
                        }]);
                    }
                }
            });
        } else {
            alert(I18n.resource.debugTools.template.FOLDER_NAME_REQUIRED);
        }
    };

    //---------方法---------

    //---------DOM操作------

//---------Exports---------
    beop.template = beop.template || {};
    beop.template = {
        init: init,
        destroy: destroy,
        getInstance: getInstance,
        getLogic: getLogic
    };
}(beop || (beop = {})));

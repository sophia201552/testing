(function (beop) {
    var configMap = {
            htmlURL: '/static/scripts/dataManage/views/dm.tag.tree.html',
            cb_on_click: $.noop,
            settable_map: {
                cb_on_click: true
            }
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, attachEvents,
        loadTree, showIconForFolder, zTreeAddHoverDom, zTreeRemoveHoverDom, zTreeOnClick, getSubPointNum, dealTreeData, replaceName,
        loadTreeList, showTreeBtn;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container
        };
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container) {
        stateMap.$container = $container;
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            showTreeBtn();
            attachEvents();
            I18n.fillArea(stateMap.$container);
            setJqueryMap();

            loadTreeList();

        });

        //$.spEvent.subEvent(stateMap.$container, 'wf-task-list', loadTaskList);
    };

    //---------DOM操作------


    //---------方法---------
    loadTree = function () {
        var zTreeSetting = {
            view: {
                selectedMulti: true,
                showIcon: showIconForFolder,
                showLine: true,
                addHoverDom: zTreeAddHoverDom,
                removeHoverDom: zTreeRemoveHoverDom
            },
            callback: {
                onClick: zTreeOnClick,
                beforeEditName: function (treeId, treeNode) {
                    treeNode.name = treeNode.originName;
                },
                onRename: function (event, treeId, treeNode) {
                    var nodes = stateMap.zTreeInstance.getSelectedNodes(treeNode);
                    $.extend(nodes, replaceName(treeNode));
                    stateMap.zTreeInstance.updateNode(nodes);
                }
            },
            edit: {
                enable: true,
                showRemoveBtn: function (treeId, treeNode) {
                    return !!treeNode.isParent;
                },
                showRenameBtn: function (treeId, treeNode) {
                    return !!treeNode.isParent;
                }
            },
            data: {
                simpleData: {
                    enable: true
                }
            }/*,
             async: {
             enable: true,
             type: 'post',
             url: '/tag/getThingTree',
             otherParam: {"projId": AppConfig.projectId, onlyGroupForRoot: true},
             autoParam: ["_id=Prt"],
             dataFilter: function (treeId, parentNode, responseData) {
             return responseData.thingTree;
             }
             }*/
        };
        stateMap.zTreeInstance = $.fn.zTree.init($("#tagTreeUl"), zTreeSetting, stateMap.treeList);
        /*stateMap.tagTreePromise.done(function () {
         stateMap.zTreeInstance = $.fn.zTree.init($("#tagTreeUl"), zTreeSetting, stateMap.treeList);
         });*/
    };

    loadTreeList = function () {
        $.getJSON('/static/scripts/dataManage/dm.tag.data.json').then(function (result) {
            if (result.success) {
                stateMap.treeList = result.data;
                stateMap.subPointNum = [];
                getSubPointNum(stateMap.treeList);
                dealTreeData(stateMap.treeList);
                loadTree();
            }
        });
    };

    dealTreeData = function (result) {
        for (var i = 0; i < result.length; i++) {
            if (!result[i].originName) {
                result[i].originName = result[i].name;
            }
            if (!result[i].count) {
                result[i].count = stateMap.subPointNum[i].number;
                result[i].name = result[i].name + '(' + result[i].count + ')';
            }
        }
    };

    replaceName = function (nodeData) {
        nodeData.name = nodeData.name + '(' + nodeData.count + ')';
        return nodeData;
    };


    showIconForFolder = function (treeId, treeNode) {
        return treeNode.isParent;
    };

    zTreeAddHoverDom = function (treeId, treeNode) {
        if (treeNode.isParent) {
            var $liNode = $("#" + treeNode.tId);
            if (!$liNode.find('.addNode').length) {
                $liNode.children('a').append('<span class="cp ml5 addNode" title="添加"></span>'); // &#xe7ff;
                $liNode.find('.addNode').show();
            }
            if (!$liNode.find('.addRule').length) {
                $liNode.children('a').append('<span class="cp addRule" title="规则"></span>'); // &#xe815;
                $liNode.find('.addRule').show();
            }
        }
    };

    zTreeRemoveHoverDom = function (treeId, treeNode) {
        $("#" + treeNode.tId).find('.addNode').remove().end().find('.addRule').remove();
    };

    zTreeOnClick = function (event, treeId, treeNode) {
        if (treeNode.isParent) {
            $("#" + treeNode.tId).find('.addNode').remove().end().find('.addRule').remove();
        }
        zTreeAddHoverDom(treeId, treeNode);
        if ($(event.target).is('.addRule')) {
            configMap.cb_on_click(treeNode);
        }
    };

    getSubPointNum = function (result) {
        for (var i = 0; i < result.length; i++) {
            var getPointData = result[i].children,
                length = getPointData.length;
            var numberObj = {
                number: ''
            };
            for (var j = 0; j < length; j++) {
                if (getPointData[j].children) {
                    length--;
                }
            }
            numberObj.number = length;
            stateMap.subPointNum.push(numberObj);
        }
    };

    showTreeBtn = function () {
        if (beop.tag.constants.viewType == 'EDIT') {
            $("#editFolder").hide();
        } else {
            $("#finishFolder").hide();
            stateMap.$container.find($(".tagTreeBtnBox")).hide();
        }
    };

    //---------事件---------
    attachEvents = function () {
        stateMap.$container.off('click.finishFolder').on('click.finishFolder', '#finishFolder', function () {
            location.href = '#page=DmTagMark&projectId=' + AppConfig.projectId;
        });
        stateMap.$container.off('click.editFolder').on('click.editFolder', '#editFolder', function () {
            location.href = '#page=DmTagTreeEdit&projectId=' + AppConfig.projectId;
        });
    };


    //---------Exports---------
    beop.tag = beop.tag || {};

    beop.tag.tree = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

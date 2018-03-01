/**
 * Created by win7 on 2016/6/7.
 */
var SelectFilterTree = (function () {
    function SelectFilterTree($ctn, screen) {
        this.opt = undefined;
        this.$ctn = $ctn;
        this.screen = screen;
        this.totalTree = undefined;
        this.totalStore = undefined;
        this.totalSetting = undefined;
        this.dictTotal = undefined;
        this.$ctnTotalTree = undefined;

        this.resultTree = undefined;
        this.resultStore = undefined;
        this.resultSetting = undefined;
        this.$ctnRsTree = undefined;

        this.init();
    }
    SelectFilterTree.prototype = {

        init: function () {
            var _this = this;
            _this.$ctnTotalTree = $('<div id="' + _this.$ctn[0].id + 'Total" class="gray-scrollbar"></div>');
            _this.$ctnRsTree = $('<div id="' + _this.$ctn[0].id + 'Rs" class="gray-scrollbar"></div>');
            _this.$ctn.html('').append(_this.$ctnTotalTree).append(_this.$ctnRsTree);
            _this.opt = {
                lang: 'cn',
                result: {

                },
                total: {

                }
            };
            _this.totalSetting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: 'type',
                        pIdKey: 'parent'
                    }
                },
                keep: {
                    leaf: true,
                    parent: true
                },
                edit: {
                    enable: true,
                    drag: {
                        isCopy: false,
                        isMove: false
                    },
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                view: {
                    addDiyDom: function () { },
                    addHoverDom: function () { },
                    removeHoverDom: function () { },
                    dblClickExpand: false,
                    showIcon: true,
                    showLine: true
                },
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        var $target = $('#' + treeNode.tId);
                        _this.opt.total.beforeClick && _this.opt.total.beforeClick(treeId, treeNode)
                    },
                    onClick: function (event, treeId, treeNode) {
                        _this.opt.total.click && _this.opt.total.click(event, treeId, treeNode)
                        _this.onTotalTreeClk.apply(_this, arguments)
                    }
                }
            };
            _this.resultSetting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: 'type',
                        pIdKey: 'parent'
                    }
                },
                keep: {
                    leaf: true,
                    parent: true
                },
                edit: {
                    enable: true,
                    drag: {
                        isCopy: false,
                        isMove: false
                    },
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                view: {
                    addDiyDom: function (treeId, treeNode) {
                        var $target = $('#' + treeNode.tId);
                        _this.opt.result.beforeDomAdd && _this.opt.result.beforeDomAdd(treeId, treeNode, $target)
                    },
                    addHoverDom: function () {
                    },
                    removeHoverDom: function () {
                    },
                    dblClickExpand: false,
                    showIcon: true,
                    showLine: true
                },
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        var $target = $('#' + treeNode.tId);
                        _this.opt.result.beforeClick && _this.opt.result.beforeClick(treeId, treeNode, $target)
                    },
                    onClick: function (event, treeId, treeNode) {
                        _this.opt.result.click && _this.opt.result.click(event, treeId, treeNode)
                        _this.onRsTreeClk.apply(_this, arguments)
                    }
                }
            }
        },
        onTotalTreeClk: function (e, treeId, treeNode) {
            var _this = this;
            var parentNode = treeNode.getParentNode();
            var arrParentNode = [];
            var key = _this.totalSetting.data.simpleData.idKey;
            while (parentNode) {
                if (!_this.resultTree.getNodeByParam(key, parentNode[key])) {
                    parentNode.children = [];
                    arrParentNode.push(parentNode);
                }
                parentNode = parentNode.getParentNode()
            }
            if (!_this.resultTree.getNodeByParam(key, treeNode[key])) arrParentNode.push(treeNode);
            _this.resultStore = [].concat(_this.resultStore, arrParentNode);
            _this.setResultTree(_this.resultStore)
        },

        onRsTreeClk: function (e, treeId, treeNode) {
            var _this = this;
            var key = _this.resultSetting.data.simpleData.idKey;
            _this.resultTree.removeChildNodes(treeNode);
            _this.resultTree.removeNode(treeNode);
            _this.resultStore = _this.resultTree.transformToArray(_this.resultTree.getNodes())
        },

        setOpt: function (opt) {
            this.opt = $.extend(true, {}, this.opt, opt ? opt : {});
        },
        setTotalTree: function (store, setting) {
            var _this = this;
            if (!(store && store instanceof Array)) store = [];
            if (_this.totalTree) _this.totalTree.destroy();
            _this.totalStore = store ? store : [];
            _this.totalSetting = $.extend(true, {}, _this.totalSetting, setting ? setting : {});
            _this.totalTree = $.fn.zTree.init(_this.$ctnTotalTree, _this.totalSetting, _this.totalStore);
        },
        setResultTree: function (store, setting) {
            var _this = this;
            if (!(store && store instanceof Array)) store = [];
            if (_this.resultTree) _this.resultTree.destroy();
            _this.resultStore = store;
            _this.resultSetting = $.extend(true, {}, _this.resultSetting, setting ? setting : {});
            _this.resultTree = $.fn.zTree.init(_this.$ctnRsTree, _this.resultSetting, _this.resultStore)
        }
    };
    return SelectFilterTree;
})();/**
 * Created by win7 on 2016/6/7.
 */
var SelectFilterTree = (function () {
    function SelectFilterTree($ctn, screen) {
        this.opt = undefined;
        this.$ctn = $ctn;
        this.screen = screen;
        this.totalTree = undefined;
        this.totalStore = undefined;
        this.totalSetting = undefined;
        this.dictTotal = undefined;
        this.$ctnTotalTree = undefined;

        this.resultTree = undefined;
        this.resultStore = undefined;
        this.resultSetting = undefined;
        this.$ctnRsTree = undefined;

        this.init();
    }
    SelectFilterTree.prototype = {

        init: function () {
            var _this = this;
            _this.$ctnTotalTree = $('<div id="' + _this.$ctn[0].id + 'Total" class="gray-scrollbar"></div>');
            _this.$ctnRsTree = $('<div id="' + _this.$ctn[0].id + 'Rs" class="gray-scrollbar"></div>');
            _this.$ctn.html('').append(_this.$ctnTotalTree).append(_this.$ctnRsTree);
            _this.opt = {
                lang: 'cn',
                result: {

                },
                total: {

                }
            };
            _this.totalSetting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: 'type',
                        pIdKey: 'parent'
                    }
                },
                keep: {
                    leaf: true,
                    parent: true
                },
                edit: {
                    enable: true,
                    drag: {
                        isCopy: false,
                        isMove: false
                    },
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                view: {
                    addDiyDom: function () { },
                    addHoverDom: function () { },
                    removeHoverDom: function () { },
                    dblClickExpand: false,
                    showIcon: true,
                    showLine: true
                },
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        var $target = $('#' + treeNode.tId);
                        _this.opt.total.beforeClick && _this.opt.total.beforeClick(treeId, treeNode)
                    },
                    onClick: function (event, treeId, treeNode) {
                        _this.opt.total.click && _this.opt.total.click(event, treeId, treeNode)
                        _this.onTotalTreeClk.apply(_this, arguments)
                    }
                }
            };
            _this.resultSetting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: 'type',
                        pIdKey: 'parent'
                    }
                },
                keep: {
                    leaf: true,
                    parent: true
                },
                edit: {
                    enable: true,
                    drag: {
                        isCopy: false,
                        isMove: false
                    },
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                view: {
                    addDiyDom: function (treeId, treeNode) {
                        var $target = $('#' + treeNode.tId);
                        _this.opt.result.beforeDomAdd && _this.opt.result.beforeDomAdd(treeId, treeNode, $target)
                    },
                    addHoverDom: function () {
                    },
                    removeHoverDom: function () {
                    },
                    dblClickExpand: false,
                    showIcon: true,
                    showLine: true
                },
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        var $target = $('#' + treeNode.tId);
                        _this.opt.result.beforeClick && _this.opt.result.beforeClick(treeId, treeNode, $target)
                    },
                    onClick: function (event, treeId, treeNode) {
                        _this.opt.result.click && _this.opt.result.click(event, treeId, treeNode)
                        _this.onRsTreeClk.apply(_this, arguments)
                    }
                }
            }
        },
        onTotalTreeClk: function (e, treeId, treeNode) {
            var _this = this;
            var parentNode = treeNode.getParentNode();
            var arrParentNode = [];
            var key = _this.totalSetting.data.simpleData.idKey;
            while (parentNode) {
                if (!_this.resultTree.getNodeByParam(key, parentNode[key])) {
                    parentNode.children = [];
                    arrParentNode.push(parentNode);
                }
                parentNode = parentNode.getParentNode()
            }
            if (!_this.resultTree.getNodeByParam(key, treeNode[key])) arrParentNode.push(treeNode);
            _this.resultStore = [].concat(_this.resultStore, arrParentNode);
            _this.setResultTree(_this.resultStore)
        },

        onRsTreeClk: function (e, treeId, treeNode) {
            var _this = this;
            var key = _this.resultSetting.data.simpleData.idKey;
            _this.resultTree.removeChildNodes(treeNode);
            _this.resultTree.removeNode(treeNode);
            _this.resultStore = _this.resultTree.transformToArray(_this.resultTree.getNodes())
        },

        setOpt: function (opt) {
            this.opt = $.extend(true, {}, this.opt, opt ? opt : {});
        },
        setTotalTree: function (store, setting) {
            var _this = this;
            if (!(store && store instanceof Array)) store = [];
            if (_this.totalTree) _this.totalTree.destroy();
            _this.totalStore = store ? store : [];
            _this.totalSetting = $.extend(true, {}, _this.totalSetting, setting ? setting : {});
            _this.totalTree = $.fn.zTree.init(_this.$ctnTotalTree, _this.totalSetting, _this.totalStore);
        },
        setResultTree: function (store, setting) {
            var _this = this;
            if (!(store && store instanceof Array)) store = [];
            if (_this.resultTree) _this.resultTree.destroy();
            _this.resultStore = store;
            _this.resultSetting = $.extend(true, {}, _this.resultSetting, setting ? setting : {});
            _this.resultTree = $.fn.zTree.init(_this.$ctnRsTree, _this.resultSetting, _this.resultStore)
        }
    };
    return SelectFilterTree;
})();
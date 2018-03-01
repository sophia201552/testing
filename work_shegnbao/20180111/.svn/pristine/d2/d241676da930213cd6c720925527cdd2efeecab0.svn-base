/**
 * Created by vicky on 2016/1/29.
 */

var AssetListPanel = (function () {
    var _this;

    function AssetListPanel(screen, parentPane) {
        this.screen = screen;
        this.$parentPanel = parentPane;
        this.dictDisplayParams = {
            'activeTime': '投入使用',
            'brand': '品牌',
            'buyer': '采购人',
            'buyingTime': '购置时间',
            'desc': '描述',
            'guaranteeTime': '过保时间',
            'model': '型号',
            'other': '其他',
            'price': '购置价格',
            'sn': '序列号',
            'manager': '责任人',
            'status': '状态',
            'supplier': '供应商',
            'updateTime': '更新日期',
            'endTime': '到期时间',
            'urlImg': '图片来源',
            'productArea': '产地',
            'productTime': '出厂时间',
            'serviceLife': '使用寿命',
            'name': '名称',
            'type': '资产类型'
        };
        this.tabsList = {
            device_base: [1, 2, 3, 4, 6, 8],//设备类型,所有面板
            device_multiSelected: [4],//设备类型,多选时候显示的面板, 选择了2个及以上, 那么隐藏 基本信息/铭牌信息/实时数据
            part_base: [5, 7]//零件类型,所有面板
        };
        this.$tabs = $(".tab-handle");
        this.thingType = {
            ThingPart: 'ThingPart',
            Thing: 'Thing'
        };
        this.curTabs = [];
        _this = this;
    }

    AssetListPanel.prototype.show = function () {
        this.initPanel();
    };

    AssetListPanel.prototype.initPanel = function () {
        this.$tabs.hide();
        this.attachEvent();
    };

    AssetListPanel.prototype.render = function (data, treeNode, displayParams) {
        var pathNode = treeNode.getPath(), pathStr = '', nodeHtml = '';
        var pathLen = pathNode.length, $path = this.$parentPanel.find('#spanPath'), $tbodyAsset = this.$parentPanel.find('#tbAsset tbody');
        var dicStatus = {
            '0': '外借',
            '1': '外修',
            '2': '使用',
            '3': '仓库'
        };

        //拼接路径
        for (var i = 0; i < pathLen; i++) {
            pathStr = (pathStr + pathNode[i].name + ' / ');
        }
        $path.text(pathStr);

        //渲染表头
        var strHeadTr = '';
        displayParams.arrKey.forEach(function (th) {
            if (th == 'model') {
                return;
            }
            strHeadTr += ('<th>' + _this.dictDisplayParams[th] + '</th>');
        });
        $('#tbAsset').find('thead tr').html(strHeadTr);

        for (var i = 0, type, endTime, updateTime, status, obj, desc; i < data.length; i++) {
            obj = data[i];
            nodeHtml += ('<tr data-id="' + obj._id + '" data-name="' + obj.name + '" data-model="' + obj.model + '" data-type="' + obj.type + '">');
            for (var j = 0, item, key; j < displayParams.arrKey.length; j++) {
                item = obj[displayParams.arrKey[j]];
                key = displayParams.arrKey[j];

                switch (key) {
                    case 'endTime':
                    case 'updateTime':
                        item = item ? new Date(item).format('yyyy-MM-dd') : '--:--';
                        break;
                    case'productTime':
                        item = item ? new Date(item).format('yyyy-MM-dd') : '--:--';
                        break;
                    case 'status':
                        item = item ? dicStatus[item] : '--';
                        break;
                    case 'type':
                        item = this.screen.filterPanel.dictClass.things[obj.type] ? this.screen.filterPanel.dictClass.things[obj.type].name : "";
                        break;
                    case 'model':
                        continue;
                        break;
                    default :
                        item = item ? item : '--';
                }
                nodeHtml += ('<td>' + item + '</td>');
            }
            nodeHtml += '</tr>';
        }
        $tbodyAsset.html(nodeHtml);
    };

    AssetListPanel.prototype.close = function () {

    };
    /***
     * 监测tabs_a是否为tabs_b的子集或者全集
     * @param tabs_a
     * @param tabs_b
     * @returns {boolean}
     */
    AssetListPanel.prototype.isCompatibleTabs = function (tabs_a, tabs_b) {
        if (tabs_a.length > tabs_b.length) {
            return false;
        }
        for (var i = 0; i < tabs_a.length; i++) {
            if ($.inArray(tabs_a[i], tabs_b) === -1) {
                return false;
            }
        }
        return true;
    };

    AssetListPanel.prototype.showTab = function (tabs) {
        if (!tabs || !tabs.length) {
            console.warn('beop log: can\'t find tab index list' + tabs);
            return;
        }
        this.$tabs.hide().each(function (index) {
            if ($.inArray(index + 1, tabs) !== -1) {
                _this.$tabs.eq(index + 1).show();
            }
        })
    };

    AssetListPanel.prototype.getTabs = function (type, isMulti) {
        if (type == this.thingType.ThingPart) {
            return this.tabsList.part_base;
        } else {
            if (isMulti) {
                return this.tabsList.device_multiSelected;
            } else {
                return this.tabsList.device_base;
            }
        }
    };

    AssetListPanel.prototype.attachEvent = function () {
        var _this = this, $tbAsset = $('#tbAsset'), index = 1;
        this.infoPanel = undefined;
        this.arrAsset = [];

        //todo 获取当前面板 tab-handle
        $('.tab-handle').off('click').on('click', function () {
            index = $(".tab-handle").index($(this));

            //根据当前激活的信息面板,决定调用渲染方法
            //todo 代码有待优化, 不必每次都new 一个对象
            switch (index) {
                /*case 1:
                 _this.infoPanel = BasicInfo;//基本信息
                 break;*/
                case 2:
                    _this.infoPanel = new NameplateInfo(_this);//铭牌信息
                    break;
                case 3:
                    _this.infoPanel = new RealtimeData(_this);//实时数据
                    break;
                case 4:
                    _this.infoPanel = PreventiveMaintain;//预防性维护
                    break;

                case 5:
                    _this.infoPanel = SpareParts;//零配件
                    break;
                case 6:
                    _this.infoPanel = MaintainRecord;//维修记录
                    break;
                case 7:
                    _this.infoPanel = OutOfStorageRecords;//出入库记录
                    break;
                case 8:
                    _this.infoPanel = DiagnosisRecord;//诊断记录
                    break;
                default :
                    _this.infoPanel = new BasicInfo(_this.screen);
                    break;
            }

            //如果当前有选中的资产项
            if ($tbAsset.find('.selected').length > 0) {
                _this.infoPanel.show(_this.arrAsset, {curNodeId: $tbAsset.find('.selected')[0].dataset.id});
            }
        });

        //todo 多选还有问题
        $tbAsset.find('tbody').on('click', 'tr', function (e) {
            var tabs = [];
            $("#maintainRecordStartTime").val('');
            $("#maintainRecordEndTime").val('');
            if (e.ctrlKey) {
                $(this).addClass('selected');
                var repeatData = false;
                for (var i = 0, len = _this.arrAsset.length; i < len; i++) {
                    if (this.dataset.id === _this.arrAsset[i].id) {
                        repeatData = true;
                    }
                }
                if (!repeatData) {
                    _this.arrAsset.push({id: this.dataset.id, model: this.dataset.model, name: this.dataset.name});
                }
                tabs = _this.getTabs(this.dataset.type, true);
            } else {
                $(this).addClass('selected').siblings().removeClass('selected');
                _this.arrAsset = [];
                _this.arrAsset.push({id: this.dataset.id, model: this.dataset.model, name: this.dataset.name});
                tabs = _this.getTabs(this.dataset.type, false);
            }
            _this.showTab(tabs);
            if (!_this.isCompatibleTabs(_this.curTabs, tabs)) {//如果新的tabs和之前的不兼容,选择第一个tabs激活
                _this.infoPanel.close && _this.infoPanel.close();
                _this.$tabs.filter(':visible:first').click();
            }
            _this.curTabs = tabs;
            //选中行对应左侧的树节点高亮
            var treeNode,li;
            $('li', '#paneIotData').css({backgroundColor: 'transparent'});
            $('.curSelectedNode','#paneIotData').css({color:''});
            for(let i of _this.arrAsset){
                treeNode = _this.screen.filterPanel.tree.getNodesByParam('_id', i.id)[0];
                if(treeNode && treeNode.tId){
                    li = document.getElementById(treeNode.tId);
                    li.style.backgroundColor = 'rgb(76, 100, 148)';
                }
            }

            if ($('.tab-handle').eq(4).hasClass('tab-handle-selected')) {
                return;
            }
            _this.infoPanel.show(_this.arrAsset, {curNodeId: e.currentTarget.dataset.id});

        })
    };

    return AssetListPanel;
}());

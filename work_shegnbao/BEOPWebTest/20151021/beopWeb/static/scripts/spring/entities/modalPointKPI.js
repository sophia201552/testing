/**
 * Created by RNBtech on 2015/8/13.
 */
/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalPointKPI = (function(){
    function ModalPointKPI(screen, entityParams) {
        if (!entityParams) return;
        this.isConfigMode = false;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalPointKPI.prototype = new ModalBase();
    ModalPointKPI.prototype.optionTemplate = {
        name:'toolBox.modal.POINT_KPI',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 30,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalPointKPI'
    };

    ModalPointKPI.prototype.show = function(){
        this.init();
    }

    ModalPointKPI.prototype.init = function(){
        this.pointKPIWiki = undefined;
    }

    ModalPointKPI.prototype.renderModal = function (e) {
        var _this = this, tempHtml = '', level = 1, rootId;//节点在树的第几层,根节点是0层
        this.spinner && this.spinner.stop();
        if(!(this.entity.modal.option && this.entity.modal.option.kpiList)) return
        this.entity.modal.option.kpiList.forEach(function(kpiItem){
                traverseTree(kpiItem);
            });
        $(this.container).append(tempHtml);
        //遍历树结构,渲染每一个PointKPI
        function traverseTree(tree) {
            //渲染根节点
            new PointKPIItem(tree, _this, 0);
            rootId = tree.id;
            traverse(tree, 0);
        }
        function traverse(node, i) {//广度优先遍历
            var children = node.list;
            node.pointPassData = [];
            node.show = true;
            if (children != null && children.length > 0) {
                //渲染子节点
                if(node.parentId == rootId){
                    level = 2;//重置level
                }
                new PointKPIItem(children[i], _this, level);

                if (i == children.length - 1) {//如果孩子节点已遍历完
                    for(var j = 0; j < children.length; j++){
                        j == 0 && level++;
                        traverse(children[j], 0);//第i个孩子节点作为父节点
                    }
                } else {//遍历父节点的i+1个孩子节点
                    traverse(node, i + 1);
                }
            }
        }
    }

    ModalPointKPI.prototype.showConfigMode = function () {
    }

    ModalPointKPI.prototype.updateModal = function (points) {

    }

    ModalPointKPI.prototype.configure = function(){
        var _this = this;
        this.spinner && this.spinner.stop();
        this.isConfigMode = true;

        if (this.chart) this.chart.clear();
        this.divResizeByMouseInit();

        var divMask = document.createElement('div');
        divMask.className = 'springConfigMask';
        divMask.draggable = 'true';

        var btnHeightResize = document.createElement('div');
        var maxHeight = this.optionTemplate.maxHeight;
        var maxWidth = this.optionTemplate.maxWidth;
        var minHeight = this.optionTemplate.minHeight;
        var minWidth = this.optionTemplate.minWidth;
        btnHeightResize.className = 'divResize divHeightResize';
        btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
        '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanR + ' /6</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
        divMask.appendChild(btnHeightResize);
        var btnWidthResize = document.createElement('div');
        btnWidthResize.className = 'divResize divWidthResize';
        btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
        '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanC + ' /12</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
        divMask.appendChild(btnWidthResize);

        var divTitleAndType = document.createElement('div');
        divTitleAndType.className = 'divTitleAndType';
        divMask.appendChild(divTitleAndType);

        var $divTitle = $('<div class="divResize chartTitle">');
        var $labelTitle = $('<label for="title">').text(I18n.resource.dashboard.show.TITLE);
        var inputChartTitle = document.createElement('input');
        inputChartTitle.id = 'title';
        inputChartTitle.className = 'form-control';
        inputChartTitle.value = this.entity.modal.title;
        inputChartTitle.setAttribute('placeholder',I18n.resource.dashboard.show.TITLE_TIP);
        if(this.entity.modal.title != ''){
            inputChartTitle.style.display = 'none';
        }
        inputChartTitle.setAttribute('type','text');
        $divTitle.append($labelTitle).append($(inputChartTitle));
        divTitleAndType.appendChild($divTitle[0]);

        var $divType = $('<div class="divResize chartType">');
        var $labelType = $('<label>').text(I18n.resource.dashboard.show.TYPE);
        var chartType = document.createElement('span');
        chartType.innerHTML = I18n.findContent(this.optionTemplate.name);
        $divType.append($labelType).append($(chartType));
        divTitleAndType.appendChild($divType[0]);

        var chartTitleShow = document.createElement('p');
        chartTitleShow.innerHTML = inputChartTitle.value;
        chartTitleShow.className = 'chartTitleShow';
        $divTitle[0].appendChild(chartTitleShow);
        if(this.entity.modal.title == '' || this.entity.modal.title == undefined){
            chartTitleShow.style.display = 'none';
        }
        chartTitleShow.onclick = function(){
            chartTitleShow.style.display = 'none';
            inputChartTitle.style.display = 'inline-block';
            inputChartTitle.focus();
        };
        inputChartTitle.onblur = function(){
            if (inputChartTitle.value != ''){
                inputChartTitle.style.display = 'none';
                chartTitleShow.style.display = 'inline';
            }
            chartTitleShow.innerHTML = inputChartTitle.value;
            _this.entity.modal.title = inputChartTitle.value;
        };

        //var $btnConfig = $('<span class="glyphicon glyphicon-cog springConfigBtn"></span>');
        var $btnRemove = $('<span class="glyphicon glyphicon-remove-circle springConfigRemoveBtn"></span>');
        var $btnAdd = $('<span class="glyphicon glyphicon-remove-circle springConfigRemoveBtn addTree" style="transform: rotateZ(45deg);color: #333;right: 50px !important;"></span>');
        divMask.appendChild($btnAdd[0]);
        //divMask.appendChild($btnConfig[0]);
        divMask.appendChild($btnRemove[0]);

        this.container.parentNode.appendChild(divMask);
        this.divResizeByToolInit();


        //drag event of replacing entity
        var divContainer = $(this.container).closest('.springContainer')[0];
        divMask.ondragstart = function (e) {
            //e.preventDefault();
            e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
        };
        divMask.ondragover = function (e) {
            e.preventDefault();
        };
        divMask.ondragleave = function (e) {
            e.preventDefault();
        };
        divContainer && (divContainer.ondrop = function (e) {
            e.stopPropagation();
            var sourceId = e.dataTransfer.getData("id");
            var $sourceParent, $targetParent;
            if (sourceId) {
                var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                if(sourceId == targetId) return;
                $sourceParent = $('#divContainer_' + sourceId).parent();
                $targetParent = $('#divContainer_' + targetId).parent();
                //外部chart拖入组合图
                if(!$sourceParent[0].classList.contains('chartsCt') && $targetParent[0].classList.contains('chartsCt')){
                    _this.screen.insertChartIntoMix(sourceId, $(e.target).closest('.chartsCt')[0])
                }else{//平级之间交换
                    if(_this.screen.screen){//组合图内部交换
                        _this.screen.screen.replaceEntity(sourceId, targetId, _this.screen.entity.id);
                    }else{
                        _this.screen.replaceEntity(sourceId, targetId);
                    }
                }
            }
            _this.screen.isScreenChange = true;
        })
         //选择周期
        var $select = '<div class="form-group" style="position: absolute;top: 5px;left: 5px;">\
            <label for="inputEmail3" class="col-sm-2 control-label" style="height: 34px;line-height: 34px;">Cycle</label>\
            <div class="col-sm-8" style="display:inline-block;">\
                <select id="selectCycle" class="form-control" style="width: 100px;padding: 0;"> \
                    <option value="month">'+ I18n.resource.dashboard.modalPointKPI.MONTH +'</option> \
                    <option value="season">'+ I18n.resource.dashboard.modalPointKPI.QUARTER +'</option> \
                    </select>\
            </div>\
            </div>';
        $(this.container).append($select);
        var $selectCycle = $(this.container).find('#selectCycle');
        if(_this.entity.modal.option && _this.entity.modal.option.dateCycle && _this.entity.modal.option.dateCycle == 'season'){
            $selectCycle.find('option:nth-of-type(2)')[0].selected = 'selected';
        }else{
            $selectCycle.find('option:nth-of-type(1)')[0].selected = 'selected';
        }
        $selectCycle[0].onchange = function(){
            _this.entity.modal.option.dateCycle = $selectCycle[0].value;
        }
        var $chartCt = $('<div class="divResize chartsCt gray-scrollbar" style="overflow:auto;">');
        $chartCt.append($(this.container));
        divMask.appendChild($chartCt[0]);

        //如果domTree的宽度超出显示范围的宽度,
        if($('.level_2').width() > ($chartCt.width() - 320)){
            $('.domTree', $chartCt).width($('.level_2').width() + 40);
        }
        //如果存在根节点,则$btnAdd disabled
        if($(this.container).find('.domTree').length == 1){
           $btnAdd.attr('title','Already exists a root').addClass('btnDisabled');
        }

        this.executeConfigMode();

        $btnRemove.off('click').on('click',function(){
            if (_this.chart) _this.chart.clear();
            if(_this.screen.screen){//兼容ModalMix
                _this.screen.screen.removeEntity(_this.entity.id);
            }else{
                _this.screen.removeEntity(_this.entity.id);
            }

            $('#divContainer_' + _this.entity.id).remove();
            _this = null;
        });
        $btnAdd.off('click').on('click',function(){
            if($(_this.container).find('.domTree').length == 0){
                new PointKPIItem({parentId: ''}, _this, 0);
                $('#divContainer_'+ _this.entity.id).find('.addTree').attr('title','Already exists a root').addClass('btnDisabled');
                _this.screen.isScreenChange = true;
            }
        });
    }

    ModalPointKPI.prototype.initContainer = function(replacedElementId){
        var _this = this;
        var divParent = document.getElementById('divContainer_' + this.entity.id);
        var isNeedCreateDivParent = false;
        var scrollClass = ' gray-scrollbar';

        if ((!divParent) || replacedElementId) {
            isNeedCreateDivParent = true;
        }

        if (isNeedCreateDivParent) {
            divParent = document.createElement('div');
            divParent.id = 'divContainer_' + this.entity.id;
        }
        //get container
        if (replacedElementId) {
            var $old = $('#divContainer_' + replacedElementId);
            $(divParent).insertAfter($old);
            $old.remove();
        }
        else {
            isNeedCreateDivParent && this.screen.container.appendChild(divParent);
        }

        divParent.className = 'springContainer';
        //adapt ipad 1024px
        if (AppConfig.isMobile) {
            divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR * 2 + '%';
            divParent.style.width = this.UNIT_WIDTH * this.entity.spanC * 2 + '%';
        } else {
            divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR + '%';
            divParent.style.width = this.UNIT_WIDTH * this.entity.spanC + '%';
        }

        if (this.entity.modal.title && this.entity.modal.title != '' && (!this.entity.isNotRender)) {
            divParent.innerHTML = '<div class="panel panel-default">\
                <div class="panel-heading springHead">\
                    <h3 class="panel-title" style="font-weight: bold;">' + this.entity.modal.title + '</h3>\
                </div>\
                <div class="panel-body springContent' + scrollClass + '" style="overflow:auto;"></div>\
            </div>';
        } else {
            divParent.innerHTML = '<div class="panel panel-default" style="background: none;">\
                <div class="panel-body springContent' + scrollClass + '" style="height:100%;overflow:auto;"></div>\
            </div>';
        }

        //按钮容器:锚链接,历史数据,wiki
        var divBtnCtn = document.createElement('div');
        divBtnCtn.className = 'springLinkBtnCtn';

        var domPanel = divParent.getElementsByClassName('panel')[0];
        //show history start

        var lkHistory = document.createElement('a');
        lkHistory.className = 'springLinkBtn';
        lkHistory.title = 'Show History';
        lkHistory.href = 'javascript:;';
        lkHistory.innerHTML = '<span class="glyphicon glyphicon-stats"></span>';
        divBtnCtn.appendChild(lkHistory);

        lkHistory.onclick = function(){
            var dataTree = _this.entity.modal.option.kpiList[0];
            var dateCycle = !_this.entity.modal.option.dateCycle ? 'month' : _this.entity.modal.option.dateCycle;
            if (Boolean(dataTree)) {
                new ModalPointKpiGrid(dataTree, dateCycle).show();
            }
        };

        //show history end

        domPanel.appendChild(divBtnCtn);

        this.initToolTips(divParent.getElementsByClassName('springHead'));
        this.container = divParent.getElementsByClassName('springContent')[0];
    }

    ModalPointKPI.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    }

    return ModalPointKPI;
})();

var PointKPIItem = (function(){
    function PointKPIItem(item, entity, i){//i 树结构的第i层, 从0开始,0代表根节点
        this.parentArgt = entity;
        this.entity = entity.entity;
        this.container = entity.container;

        this.kpiItem = {
            id: !item.id ? new Date().getTime() : item.id,
            parentId: !item.parentId ? '': item.parentId,
            name: !item.name ? 'Unaming': item.name,
            pointKPI: !item.pointKPI ? '': item.pointKPI,
            pointGrade: !item.pointGrade ? '': item.pointGrade,
            pointPass: !item.pointPass ? '': item.pointPass,
            rule: !item.rule ? '': item.rule,
            weight: !item.weight ? '': item.weight,
            wikiId: !item.wikiId ? '': item.wikiId,
            list: !item.list ? []: item.list
        };
        if(i === 0 && !item.id && item.parentId == ''){
            !this.entity.modal.option && (this.entity.modal.option = {});
            !this.entity.modal.option.kpiList && (this.entity.modal.option.kpiList = []);
            this.entity.modal.option.kpiList.push(this.kpiItem);
        }
        this.addItemDom(this.kpiItem, i)
        this.attachEventsItem(this.kpiItem);
    }

    PointKPIItem.prototype.addItem = function(id){//id-->该id节点下降增加子节点
        var _this = this;
        var level = 1;
        var pointKPIItem;

        this.entity.modal.option.kpiList.forEach(function(kpiItem){
            traverseTree(kpiItem);
        });
        function traverseTree(tree) {
            traverse(tree, 0);
        }
        function traverse(node, i) {
            var children = node.list;
            if(id == node.id){
                pointKPIItem = new PointKPIItem({parentId: id}, _this.parentArgt, level);
                node.list.push(pointKPIItem.kpiItem);
                return;
            }
            if (children != null && children.length > 0) {
                if (i == children.length - 1) {
                    for(var j = 0; j < children.length; j++){
                        j == 0 && level++;
                        traverse(children[j], 0);
                    }
                } else {
                    traverse(node, i + 1);
                }
            }
        }
    }

    var btn_tpl =  '\
            <div class="btnGroup">\
                <span class="glyphicon glyphicon-remove-circle btnAddItem" style="transform: rotateZ(45deg);"></span>\
                <span class="glyphicon glyphicon-cog btnConfigItem"></span>\
                <span class="glyphicon glyphicon-info-sign btnConfigWiki"></span>\
                <span class="glyphicon glyphicon-remove-circle btnRemoveItem"></span>\
                <span class="glyphicon glyphicon-info-sign btnViewWiki{isShow}" wikiId="{wikiId}"></span>\
            </div>';

    PointKPIItem.prototype.tpl = {
        treeWrap: '<div class="domTree"></div>',
        level_1_Tpl: '\
            <div class="totalLevel">\
                <div class="itemWrap" id="kpi_{id}">\
                    <div class="hrLine"></div>\
                    <span class="pointName">{name}</span>\
                    <span class="glyphicon glyphicon-pencil"></span>\
                    <div class="circle {bgColor}">\
                        <div class="active-border active-border_{bgColor}" data-value=""></div>\
                        <span>{pointPassVal}</span>\
                    </div>'+ btn_tpl +
                '</div>\
            </div>',
        level_2_Ctn: '\
            <div class="level_2">\
                <div class="hrLine1"></div>\
                <ul></ul>\
            </div>',
        level_2_Tpl: '<li class="level_3" parentId="{parentId}" id="item_{id}">\
            	<div class="thirdCon1">\
                	<div class="itemWrap" id="kpi_{id}">\
                	    <div class="circle {bgColor}">\
                	        <div class="active-border active-border_{bgColor}" data-value=""></div>\
                	        <span>{pointPassVal}</span>\
                	    </div>\
                	    <span class="pointName">{name}</span><span class="glyphicon glyphicon-pencil"></span><br class="clear"><div class="hrLine2"></div>'+ btn_tpl +'</div>\
                </div>\
                <ul class="childLevel">\
                </ul>\
            </li>',
        level_3_Tpl: '<li parentId="{parentId}" id="item_{id}">\
                <div class="hrLine3"></div>\
                <div class="itemWrap" id="kpi_{id}">\
                    <div class="smCircle {bgColor}">\
                        <div class="active-border active-border_{bgColor}" data-value=""></div>\
                        <span>{pointPassVal}</span>\
                    </div>\
                    <span class="pointName">{name}</span>\
                    <span class="glyphicon glyphicon-pencil"></span><br class="clear">\
                    <div class="hrLine4"></div>'+ btn_tpl +
                '</div>\
                <ul class="childLevel">\
                </ul>\
            </li>'
    }

    PointKPIItem.prototype.addItemDom = function(kpiItem, i){
        var kpiItemForEl = {
            id: kpiItem.id,
            parentId: kpiItem.parentId,
            name: kpiItem.name,
            isShow: kpiItem.wikiId != '' ? ' showWiki': '',
            pointPassVal: kpiItem.pointPass != '' ? I18n.resource.dashboard.modalPointKPI.UNPASS : I18n.resource.dashboard.modalPointKPI.PASS,
            bgColor: kpiItem.pointPass != '' ? 'unpass': 'pass'
        }
        //根节点
        var $domTree = $(this.container).children('.domTree'), $level_2_ul, $level_3_ul;
        $domTree && ($level_2_ul = $domTree.find('.level_2>ul'));
        $level_2_ul && ($level_3_ul = $level_2_ul.find('#item_' + kpiItem.parentId + ' > .childLevel'));

        if(kpiItem.parentId == ''){//level 0
            $(this.container).append(this.tpl.treeWrap);
            $domTree = $(this.container).children('.domTree');
            $domTree.html(this.tpl.level_1_Tpl.formatEL(kpiItemForEl));
        }else if(i == 1 && $domTree){//level 1
            if($level_2_ul.length == 0){
                $domTree.append(this.tpl.level_2_Ctn);
                $level_2_ul = $domTree.find('.level_2>ul');
            }
            //当二级KPI长度超出显示区域后增加domTree的长度,显示滚动条
            if($domTree.parent().width() - $level_2_ul.width() < 270){
                $domTree.width($domTree.width() + 255);
            }
            $level_2_ul.append(this.tpl.level_2_Tpl.formatEL(kpiItemForEl))

        }else if($level_2_ul){//
            $level_3_ul.append(this.tpl.level_3_Tpl.formatEL(kpiItemForEl));
            if($level_3_ul.find('.itemWrap').width() < 140){//隐藏添加下级item功能
                $level_3_ul.find('.btnAddItem').hide();
            }
        }
    }

    PointKPIItem.prototype.removeItem = function(id){
        var _this = this;
        this.entity.modal.option.kpiList.forEach(function(kpiItem, index){
            if(kpiItem.id == id && kpiItem.parentId == ''){//如果是根节点直接删除
                _this.entity.modal.option.kpiList.splice(index, 1);
                $('#kpi_' + id).closest('.domTree').remove();
                $('#divContainer_'+ _this.entity.id).find('.addTree').removeClass('btnDisabled').attr('title','');
            }else{
                traverseTree(kpiItem);
            }
        });
        function traverseTree(tree) {
            traverse(tree, 0);
        }
        function traverse(node, i) {
            var children = node.list;
            if (children != null && children.length > 0) {
                if(id == children[i].id){
                    node.list.splice(i, 1);
                    $('#kpi_' + id).closest('li').remove();
                    return;
                }else{
                    if (i == children.length - 1) {
                        for(var j = 0; j < children.length; j++){
                            traverse(children[j], 0);
                        }
                    } else {
                        traverse(node, i + 1);
                    }
                }
            }
        }
    }

    PointKPIItem.prototype.showConfigModal = function(){
        var _this = this, $modalConfig = $('#modalConfig');
        var tempHtml = '\
            <div class="modal-body" id="pointKPI">\
                <div class="form-horizontal">\
                    <div class="form-group">\
                        <label class="col-md-3 control-label" for="divKPI">KPI</label>\
                        <div class="col-md-4">\
                            <div class="drop-area" id="divKPI">\
                                <span class="glyphicon glyphicon-plus"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-group">\
                        <label class="col-md-3 control-label" for="divGrade">Grade</label>\
                        <div class="col-md-4">\
                            <div class="drop-area" id="divGrade">\
                                <span class="glyphicon glyphicon-plus"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-group">\
                        <label class="col-md-3 control-label" for="divIsPass">Is pass</label>\
                        <div class="col-md-4">\
                            <div class="drop-area" id="divIsPass">\
                                <span class="glyphicon glyphicon-plus"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-group">\
                        <label class="col-md-3 control-label" for="divDashboard">Config dashboard</label>\
                        <div class="col-md-4">\
                            <button type="button" id="btnDashboard" class="btn btn-default">Config</button>\
                        </div>\
                    </div>\
                </div>\
            </div>';

        $modalConfig.off('show.bs.modal').on('show.bs.modal', function (e) {
            var pointKPIAlias = AppConfig.datasource.getDSItemById(_this.kpiItem.pointKPI).alias;
            var pointGradeAlias = AppConfig.datasource.getDSItemById(_this.kpiItem.pointGrade).alias;
            var pointPassAlias = AppConfig.datasource.getDSItemById(_this.kpiItem.pointPass).alias;
            $modalConfig.find('.modal-body').hide();
            $modalConfig.find('.modal-footer').before(tempHtml);
            $modalConfig.find('#divKPI').attr('data-value', _this.kpiItem.pointKPI).attr('title',pointKPIAlias).html(pointKPIAlias);
            $modalConfig.find('#divGrade').attr('data-value', _this.kpiItem.pointGrade).attr('title',pointKPIAlias).html(pointGradeAlias);
            $modalConfig.find('#divIsPass').attr('data-value', _this.kpiItem.pointPass).attr('title',pointKPIAlias).html(pointPassAlias);
            if(pointPassAlias){
                $modalConfig.find('#startConfig').removeClass('disabled');
            }
            _this.parentArgt.screen.modalConfigPane.toggleDataSource(true);
            _this.attachEventsConfig($modalConfig)
        });
        $modalConfig.off('hidden.bs.modal').on('hidden.bs.modal', function () {
            $modalConfig.find('#pointKPI').remove();
            _this.parentArgt.screen.modalConfigPane.toggleDataSource(false);
        });
        $modalConfig.modal('show');
    }

    PointKPIItem.prototype.viewDetail = function(){
        var $dialog = $('#dialogModal');
        var energyScreen = new EnergyScreen();
        var $dialogContent = $dialog.find('#dialogContent').css({height: '90%', width: '90%', margin: 'auto', marginTop: '2.5%', backgroundColor: '#fff'});
        $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
            $dialogContent.removeAttr('style').html('');
            energyScreen.workerUpdate && energyScreen.workerUpdate.terminate();
        }).modal({});

        energyScreen.id = this.kpiItem.id + '_' + AppConfig.userId;
        energyScreen.container = $dialogContent[0];
        energyScreen.isForBencMark = true;
        energyScreen.init();
    }

    PointKPIItem.prototype.attachEventsItem = function(kpiItem){
        var $kpiWrap = $('#kpi_' + kpiItem.id), _this = this;

        $('.btnAddItem', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            _this.addItem(_this.kpiItem.id);
            _this.parentArgt.screen.isScreenChange = true;
        });
        $('.btnRemoveItem', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            _this.removeItem(_this.kpiItem.id);
            //第一层子节点remove时判断是否需要重置宽度
            var $domTree = $('.domTree');
            if($(this).closest('.thirdCon1').length == 1 && $domTree.width() - $('.level_2').width() > 260){
                $domTree.width($domTree.width() - 255);
            }
            _this.parentArgt.screen.isScreenChange = true;
        });
        $('.btnConfigItem', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            _this.showConfigModal();
        });
        $('.btnConfigWiki', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            //if exist wiki,show wiki editor page
            if(_this.kpiItem.wikiId){
                _this.showWikiEditModal();
            }else{
                _this.showWikiSearchModal();
            }
        });
        $('.btnViewWiki', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            _this.viewWikiInfoModal();
        });
        $('.glyphicon-pencil', $kpiWrap).off().on('click', function(e){
             e.stopPropagation();
            if(_this.parentArgt.isConfigMode == true){
                _this.editPointKPIName();
            }
        });
        $kpiWrap.off().on('click', function(e){
            e.stopPropagation();
            if(_this.parentArgt.isConfigMode == false){
                _this.viewDetail(_this.kpiItem.id);
            }
        });

    }

    PointKPIItem.prototype.attachEventsConfig = function($modalConfig){
        var _this = this;
        var $dropArea = $modalConfig.find('.drop-area');
        var $btnConfig = $modalConfig.find('#startConfig');
        var $btnDashboard = $modalConfig.find('#btnDashboard');
        $dropArea.off('dragover').on('dragover', function (e) {
            e.preventDefault();
        });
        $dropArea.off('dragenter').on('dragenter', function (e) {
            $(e.target).addClass('on');
            e.preventDefault();
            e.stopPropagation();
        });
        $dropArea.off('dragleave').on('dragleave', function (e) {
            $(e.target).removeClass('on');
            e.stopPropagation();
        });
        $dropArea.off('drop').on('drop', function (e) {
            var transfer = e.originalEvent.dataTransfer;
            var itemId = transfer.getData('dsItemId');
            var $target = $(e.target);
            var name;
            if(!itemId) return;
            $target.removeClass('on');
            name = AppConfig.datasource.getDSItemById(itemId).alias;
            $target.attr({'data-value': itemId, 'title': name});
            $target.html('<span>'+name+'</span>');
            e.stopPropagation();

            if($target.attr('id') == 'divIsPass'){
                $btnConfig.removeClass('disabled');
            }
            _this.parentArgt.screen.isScreenChange = true;
        });

        $btnConfig.off().on('click', function(){
            var KPI = $('#divKPI').attr('data-value');
            var grade = $('#divGrade').attr('data-value');
            var pass = $('#divIsPass').attr('data-value');
            _this.kpiItem.pointKPI = !KPI ? '': KPI;
            _this.kpiItem.pointGrade = !grade ? '': grade;
            _this.kpiItem.pointPass = !pass ? '': pass;

            _this.entity.modal.option.kpiList.forEach(function(kpiItem){
                traverseTree(kpiItem);
            });
            function traverseTree(tree) {
                traverse(tree, 0);
            }
            function traverse(node, i) {
                var children = node.list;
                if(node.id == _this.kpiItem.id){
                    node.pointKPI = _this.kpiItem.pointKPI;
                    node.pointGrade = _this.kpiItem.pointGrade;
                    node.pointPass = _this.kpiItem.pointPass;
                    return;
                }
                if (children != null && children.length > 0) {
                    if (i == children.length - 1) {
                        for(var j = 0; j < children.length; j++){
                            traverse(children[j], 0);
                        }
                    } else {
                        traverse(node, i + 1);
                    }
                }
            }
            $('#modalConfig').modal('hide');
        });

        $btnDashboard.off('click').on('click', function(){
            ScreenManager.show(EnergyScreen, _this.kpiItem.id + '_' + AppConfig.userId);
        });
    }

    PointKPIItem.prototype.showWikiSearchModal = function(){
        if(!(this.pointKPIWiki && this.pointKPIWiki.parent.kpiItem.id == this.kpiItem.id)){
            this.pointKPIWiki = new ModalWiki(this);
        }
        this.pointKPIWiki.showWikiSearch();
    }

    PointKPIItem.prototype.showWikiEditModal = function(){
        if(!(this.pointKPIWiki && this.pointKPIWiki.parent.kpiItem.id == this.kpiItem.id)){
            this.pointKPIWiki = new ModalWiki(this);
        }
        this.pointKPIWiki.getWikiById();
    }

    PointKPIItem.prototype.viewWikiInfoModal = function(){
        if(!(this.pointKPIWiki && this.pointKPIWiki.parent.kpiItem.id == this.kpiItem.id)){
            this.pointKPIWiki = new ModalWiki(this);
        }
        this.pointKPIWiki.viewWikiInfo(this.kpiItem.wikiId);
    }

    PointKPIItem.prototype.editPointKPIName = function(){
        var _this = this, $divKPI = $('#kpi_' + this.kpiItem.id), $input = $divKPI.find('.pointNameInput'),$springConfigMask;
        if($input.length == 0){
            var $input = $('<input type="text" class="form-control pointNameInput"/>').val(_this.kpiItem.name);
            var $spanName = $('.pointName','#kpi_' + this.kpiItem.id).hide().after($input);
            $springConfigMask = $divKPI.closest('.springConfigMask[draggable="true"]').attr('draggable',false);
            $input.blur(function(){
                savePointName(this);
            }).keyup(function(e){
                if(e.keyCode == 13){
                    savePointName(this);
                }
            });

        }else{
            savePointName($input[0]);
        }

        function savePointName(divInput){
            _this.kpiItem.name = $(divInput).val();
            $(divInput).remove();
            $spanName.html(_this.kpiItem.name).show();
            $springConfigMask.attr('draggable',true);
            _this.parentArgt.entity.modal.option.kpiList.forEach(function(kpiItem){
                traverseTree(kpiItem);
            });
            _this.parentArgt.screen.isScreenChange = true;
            function traverseTree(tree) {
                traverse(tree, 0);
            }
            function traverse(node, i) {
                var children = node.list;
                if(node.id == _this.kpiItem.id){
                    node.name = _this.kpiItem.name;
                    return;
                }
                if (children != null && children.length > 0) {
                    if (i == children.length - 1) {
                        for(var j = 0; j < children.length; j++){
                            traverse(children[j], 0);
                        }
                    } else {
                        traverse(node, i + 1);
                    }
                }
            }
        }
    }

    return PointKPIItem;
})();
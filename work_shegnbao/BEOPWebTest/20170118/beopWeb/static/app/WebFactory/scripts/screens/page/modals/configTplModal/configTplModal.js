/**
 * Created by vicky on 2016/8/18.
 */
(function(win){
    var _this = undefined;
    function ConfigTplModal(){
        _this = this;
        this.$configTplModal = undefined;
        //this.screen = undefined;
        this.configPlugin = undefined;
        this.store = [];
        this.onFocus = false;
    }
    ConfigTplModal.prototype.trigger = function(){
        if(this.onFocus){
            this.hide();
            this.onFocus = false;
        }else{
            this.show();
            this.onFocus = true;
        }
    };
    ConfigTplModal.prototype.show = function () {
        //this.screen = screen;
        if($('#configTplModal').length === 0){
            WebAPI.get('/static/app/WebFactory/scripts/screens/page/modals/configTplModal/configTplModal.html').done(function (resultHTML) {
                $('#mainframe').parent().append(resultHTML);
                _this.init();
            })
        }else{
            $('#configTplModalWrap').show();
        }
    };
    ConfigTplModal.prototype.hide = function(){
        $('#configTplModalWrap').hide();
    };
    ConfigTplModal.prototype.init = function () {
        _this.$wrap = $('#configTplModalWrap');
        I18n.fillArea(_this.$wrap);
        _this.$configTplModal = $('#configTplModal', _this.$wrap);
        this.initConfigPlugin();
        this.initWidgetList();
        this.attachEvent();
    };
    ConfigTplModal.prototype.initConfigPlugin = function() {
        this.configPlugin = new ConfigModal({},document.getElementById('windows'));
    };
    ConfigTplModal.prototype.initWidgetList =function(){
        WebAPI.get('/factory/material/group/widget').done(function(result){
            if (result.status != 'OK')return;
            var widgetList = result.data.filter(function(widget){return widget.isModelTpl || widget.tplJs});
            if (!(widgetList instanceof Array))return;
            for (var i = 0; i < widgetList.length ;i++){
                _this.$configTplModal[0].appendChild(_this.createWidgetTplDom(widgetList[i]))
            }
            _this.store = widgetList;
        })
    };
    ConfigTplModal.prototype.initDashboardWidgetList = function (container) {
        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalRealtimeWeather',
            name: I18n.resource.toolBox.modal.REALTIME_WEATHER,
            isFolder: 0,
            isDashboardWidget: 1
        }));
        /*container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalReportFactory',
            name: I18n.resource.toolBox.modal.REPORT_CHAPTER,
            isFolder: 0,
            isDashboardWidget: 1
        }));*/
        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalKpiOverview',
            name: I18n.resource.toolBox.modal.KPI_OVERVIEW,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalAppDiagRanking',
            name: I18n.resource.toolBox.modal.APP_DIAGNOSTIC_RANKING,
            isFolder: 0,
            isDashboardWidget: 1
        }));
        /*container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalMix',
            name: I18n.resource.toolBox.modal.MIX,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalAppBlind',
            name: I18n.resource.toolBox.modal.APP_BLIND,
            isFolder: 0,
            isDashboardWidget: 1
        }));*/

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalHistoryChartNormal',
            name: I18n.resource.toolBox.modal.HIS_CHART_ENERGY_LINE,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalHistoryChartEnergyConsume',
            name: I18n.resource.toolBox.modal.HIS_CHART_ENERGY_BAR,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalHistoryChartYearOnYearLine',
            name: I18n.resource.toolBox.modal.HIS_CHART_YEAR_LINE,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalHistoryChartYearOnYearBar',
            name: I18n.resource.toolBox.modal.HIS_CHART_YEAR_BAR,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalRealtimeLineOutdoor',
            name: I18n.resource.toolBox.modal.REAL_TIME_CHART_LINE_OUTDOOR,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalEquipmentPerfectRate',
            name: I18n.resource.toolBox.modal.EQUIPMENT_PERFECT_RATE,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalColdHotAreaSummary',
            name: I18n.resource.toolBox.modal.COLD_HOT_AREA_SUMMARY,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalWorkOrderStatistics',
            name: I18n.resource.toolBox.modal.WORK_ORDER_STATISTICS,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalPriorityHandlingFaultList',
            name: I18n.resource.toolBox.modal.PRIORITY_HAADLING_FAULT_LIST,
            isFolder: 0,
            isDashboardWidget: 1
        }));

        container.appendChild(this.createWidgetTplDom({
            _id: '',
            type: 'ModalEnergyTrendAnalysis',
            name: I18n.resource.toolBox.modal.ENERGY_TREND_ANALYSIS,
            isFolder: 0,
            isDashboardWidget: 1
        }));
    };

    ConfigTplModal.prototype.createWidgetTplDom = function(widgetTpl){
        var divWidgetTpl,spTplIcon,spTplName;
        divWidgetTpl = document.createElement('div');
        divWidgetTpl.className = 'divWidgetTpl';
        divWidgetTpl.dataset.id = widgetTpl['_id'];
        if (widgetTpl.isDashboardWidget === 1) {
            divWidgetTpl.dataset.type = widgetTpl.type;
        }

        spTplIcon = document.createElement('span');
        spTplIcon.className = 'spTplIcon';

        spTplName = document.createElement('span');
        spTplName.className = 'spTplName';
        spTplName.textContent = widgetTpl.name;

        if (widgetTpl.isFolder == 1){
            var divFolderOuter = document.createElement('div');
            divFolderOuter.className = 'divFolderOuter';
            divWidgetTpl.className += ' divWidgetTplGrp';

            var divFolderInner = document.createElement('div');
            divFolderInner.className = 'divFolderInner';

            spTplIcon.className += ' glyphicon glyphicon-menu-right';

            divFolderOuter.appendChild(spTplIcon);
            divFolderOuter.appendChild(spTplName);

            divWidgetTpl.appendChild(divFolderOuter);
            divWidgetTpl.appendChild(divFolderInner);
        } else {
            divWidgetTpl.setAttribute('draggable','true');
            spTplIcon.className += ' glyphicon glyphicon-file';
            divWidgetTpl.appendChild(spTplIcon);
            divWidgetTpl.appendChild(spTplName);
        }
        return divWidgetTpl;
    };

    ConfigTplModal.prototype.attachEvent = function () {
        var $dropArea = $('#windows>.window');
        _this.$configTplModal.off('click').on('click','.divFolderOuter',function(e){
            var $target = $(e.currentTarget);
            var $parent = $target.parent();
            var $icon = $target.children('.spTplIcon');
            if ($parent.hasClass('open')){
                $parent.removeClass('open');
                $target.next().html('');
                _this.deleteChildStore($parent[0].dataset.id);
                $icon.removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right')
            }else{
                _this.initFolderChildren($parent[0].dataset.id,$target.next());
                $parent.addClass('open');
                $icon.removeClass('glyphicon-menu-right').addClass('glyphicon-menu-down')
            }
        });

        _this.$configTplModal.off('dragstart').on('dragstart','.divWidgetTpl',function(e){
            var target = e.target;

            if (target.dataset.type) {
                EventAdapter.setData({type: target.dataset.type});
            } else {
                EventAdapter.setData({tplId:e.currentTarget.dataset.id});
            }

            e.stopPropagation();
        });

        $dropArea.on('dragleave',function(e){
            e.stopPropagation();
            e.preventDefault();
        });

        $dropArea.on('dragover',function(e){
            e.stopPropagation();
            e.preventDefault();
        });

        //$dropArea.on('drop',function(e){
        //    e.preventDefault();
        //    var tplId = EventAdapter.getData().tplId;
        //    if(!tplId)return;
        //    var tplConfig = _this.getTplParamById(tplId).config;
        //    if (!tplConfig)tplConfig = {};
        //    _this.configPlugin.setOption(tplConfig).init().show();
        //});
    };

    ConfigTplModal.prototype.dropWidgetTpl = function(e,painter){
        e.preventDefault();
        var tplId = EventAdapter.getData().tplId;
        if(!tplId)return;
        var tpl = _this.getTplParamById(tplId);
        var baseTplInfo = $.extend(true,{},tpl);
        var tplConfig = $.extend(true,{},tpl.config);
        if (!tplConfig)tplConfig = {};
        tplConfig.data = {event:e,painter:painter,tpl:baseTplInfo};
        _this.configPlugin.setOption(tplConfig).init().show();
    };

    ConfigTplModal.prototype.getTplParamById = function(tplId){
        for (var i = 0; i < this.store.length ;i++){
            if (this.store[i]['_id'] == tplId){
                return this.store[i];
            }
        }
    };
    //ConfigTplModal.prototype.transferStoreToArray = function(widget){
    //    if (!widget)widget = this.store;
    //    var arr = [];
    //    for (var i = 0; i < widget.length ;i++){
    //        arr.push(widget[i]);
    //        if (widget[i].children  instanceof Array&& widget[i].children.length > 0){
    //            arr.concat(_this.transferStoreToArray(widget[i].children))
    //        }
    //    }
    //    return arr;
    //};
    ConfigTplModal.prototype.initFolderChildren = function(folderId,$ctn){
        WebAPI.get('/factory/material/group/widget/' + folderId).done(function(result){
            if (result.status != 'OK' )return;
            var widgetList = result.data.filter(function(child){return child.isModelTpl || child.tplJs});
            if (!(widgetList instanceof Array))return;
            for (var i = 0; i < widgetList.length ;i++){
                $ctn[0].appendChild(_this.createWidgetTplDom(widgetList[i]))
            }
            _this.insertChildStore(folderId,widgetList);
            _this.initDashboardWidgetList($ctn[0]);
        })
    };
    ConfigTplModal.prototype.insertChildStore = function(pId,children) {
        var arrChildrenId = [];
        children.forEach(function(child){
            arrChildrenId.push(child['_id']);
        });
        for (var i= 0 ; i< this.store.length ;i++){
            if (this.store[i]['_id'] == pId){
               this.store[i].children = arrChildrenId;
                break;
            }
        }
        this.store = this.store.concat(children)
    };

    ConfigTplModal.prototype.deleteChildStore = function(pId) {
        var children = [];
        for (var i= 0 ; i< this.store.length ;i++){
            if (this.store[i]['_id'] == pId){
                children = this.store[i].children;
                delete this.store[i].children;
                break;
            }
        }
        if(!children[0])return;
        for (var i = 0; i < this.store.length ;i++){
            if (children[0] == this.store[i]['_id']){
                this.store.splice(i,children.length);
                break;
            }
        }
    };

    ConfigTplModal.prototype.close = function(){
        $('#configTplModalWrap').remove();
    };
    win.ConfigTplModal = new ConfigTplModal();
}(window));
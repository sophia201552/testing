﻿/**
 * 能耗分析执行过程:
 * 1.
 */
class BenchmarkEnergyAnalysis{
    constructor(ctn,screen,opt){
        this.ctn = ctn;
        this.screen = screen;
        this.opt = opt;
        this.ptConfig = undefined;
        this.dsIdList = [];
        this.isYear = false;
        this.chartMix = {};//存放model对应的图表
        this.dictRegression = {};//存放分析回归的数据
    }
    show () {
        $(this.ctn).empty();
        WebAPI.get('/static/views/observer/benchmark/energyAnalysis.html').done(html =>{
            $(this.ctn).append(html);
            I18n.fillArea($('.panelBmModule'));
            //默认显示第一个节点的信息
            this.onNodeClick();
        });
    }

    init () {
        $('.paneParams .divAnalysis', this.ctn).remove();
        $('.tips', this.ctn).show();
        $('.paneResult', this.ctn).hide();
        $('.paneModelInfo', this.ctn).hide();


        if(!this.ptConfig || !this.ptConfig.energy) return;

        this.pointIdBase = this.ptConfig.energy;
        this.dictPairFactor = {};
        this.dictPairFactor[this.pointIdBase] = {};
    }

    attachEvents(){
        var _this = this;
        var $iptTime = $('.divTop input.form-control', this.ctn);

        $(this.ctn).off('change').on('change', '.selCycle', e => this.resetDateTime(e));

        $iptTime.datetime();

        $(this.ctn).off('click').on('click', '.btnAnalysis', e => this.getAnalysisData(e));

        $(this.ctn).on('click', '.btnConfig', e => this.eventBtnConfigOnClick(e));

        $(this.ctn).on('click', '.btnDelete', e => this.eventBtnDeleteOnClick(e));

        $(this.ctn).on('click', '.iconAdd', e => {
            e.stopPropagation();
            createTab(e);
        });

        $('#modelTabList').off('click').on('click', '.iconEdit', e => this.eventRename(e));

        $('#modelTabList').off('shown.bs.tab').on('shown.bs.tab', 'li', function(e){
            var  href = $(e.target).attr('href');
            e.stopPropagation();
            if($(e.target).find('.iconEdit').length === 1){
                _this.activeModelId = $(e.target).attr('href').split('#')[1];
                _this.$activeTabCtn = $('#' + _this.activeModelId);
                _this.model = _this.models[_this.getModelById(_this.activeModelId)];
                _this.model && _this.getAnalysisData();
            }else{
                createTab(e);
            }
        });

        function createTab(e){
            var now = new Date();
            var yesterday = new Date(now.getTime()-66400000);
            var $target  = (e.target.tagName === 'LI' || e.target.tagName === 'A') ? $(e.target).find('span') : $(e.target);
            var modelId = 'newModel_' + now.getTime();
            var strLi = $target.closest('li')[0].outerHTML;
            var strTabCtn = $('#newTab')[0].outerHTML;

            $('#modelTabList li').removeClass('active');
            $('#modelTabContent .tab-pane').removeClass('active');
            strLi = strLi.replace('javascript:void(0)', '#' + modelId).replace('<span class="glyphicon glyphicon-plus-sign iconAdd"></span>', '<span class="modelName">New</span><span class="cycle" i18n="benchmark.energyAnalysis.BDAY"></span><span class="glyphicon glyphicon-edit iconEdit"></span>');
            strTabCtn = strTabCtn.replace('newTab', modelId).replace('disabled','');
            $('#modelTabList li:last').before(strLi);
            $('#modelTabContent .tab-pane:last').before(strTabCtn);

            _this.activeModelId = modelId;
            _this.$activeTabCtn = $('#' + _this.activeModelId);

            $('[href="#'+ modelId +'"]').click();


            $('input.form-control', _this.$activeTabCtn).datetime();
            $('.iptEndTime', _this.$activeTabCtn).val(yesterday.format('yyyy-MM-dd'));//当前时间前一天
            now.setMonth(now.getMonth()-1);
            $('.iptStartTime', _this.$activeTabCtn).val(now.format('yyyy-MM-dd'));//上个月的今天
            I18n.fillArea($('#modelTabList'));
        }
    }

    resetDateTime(e, interval){
        var $iptTime = $('.divTop input.form-control', this.$activeTabCtn);
        var val = e ? e.target.value : interval;
        var $activeTab = $('li.active .cycle', '#modelTabList');
        if(val === 'M1'){//月
            $activeTab.text(I18n.resource.benchmark.energyAnalysis.BMONTH);
            $iptTime.datetimepicker('remove');
            $iptTime.attr('data-format','yyyy-mm');
        }else if(val === 'M12'){//年
            $activeTab.text(I18n.resource.benchmark.energyAnalysis.BYEAR);
            $iptTime.datetime('remove');
            $iptTime.attr('data-format','yyyy');
        }else if(val === 'h1'){//时
            $activeTab.text(I18n.resource.benchmark.energyAnalysis.BHOUR);
            $iptTime.datetime('remove');
            $iptTime.attr('data-format','yyyy-mm-dd hh');
        }else{//天
            $activeTab.text(I18n.resource.benchmark.energyAnalysis.BDAY);
            $iptTime.datetime('remove');
            $iptTime.attr('data-format','yyyy-mm-dd');
        }
        $iptTime.datetime();
    }


    getAnalysisData(e) {
        if(e){
            this.isRelative = true;//手动点击"分析"按钮
            if(!this.model || !this.model.params || this.model.params.length === 0){
                alert(I18n.resource.benchmark.energyAnalysis.CONFIG_RELATIVE);
                return false;
            }
        }else{
            this.isRelative = false;//自动触发"分析"按钮
        }
        this.dsIdList.length = 0;
        this.dsIdList.push(this.ptConfig.energy);

        var startTime = new Date($(".iptStartTime", this.$activeTabCtn).val());
        var endTime = new Date($(".iptEndTime", this.$activeTabCtn).val());
        var timeFormat = $('.selCycle', this.$activeTabCtn).val();
        var timeEnd = new Date(new Date(endTime).getTime() + 86400000);//输入框时间的后一天

        if(this.model && this.model.params && this.model.params.length > 0){
            this.resetDateTime(null, $('.selCycle',this.$activeTabCtn).val());
            for(var i = 0, len = this.model.params.length; i < len; i++){
                this.dictPairFactor[this.pointIdBase][this.model.params[i].point] = {value: 0, order: 0};
            }
        }

        for (var keyBase in this.dictPairFactor) {
            if (this.dsIdList.indexOf(keyBase) < 0) this.dsIdList.push(keyBase);
            for (var keyFactor in this.dictPairFactor[keyBase]) {
                if (this.dsIdList.indexOf(keyFactor) < 0 && keyFactor) this.dsIdList.push(keyFactor);
            }
        }

        var postData = {
            dsItemIds: this.dsIdList,
            timeStart: startTime.format('yyyy-MM-dd 00:00:00'),//startTime.format("yyyy-MM-dd 00:00:00"),
            timeEnd: timeEnd.format("yyyy-MM-dd 00:00:00"),
            timeFormat: timeFormat
        }

        if(timeFormat === 'h1'){
            postData.timeStart = startTime.format("yyyy-MM-dd HH:00:00");//输入框时间的前一个小时
            postData.timeEnd = new Date(endTime.getTime() + 3600000).format("yyyy-MM-dd HH:00:00");
        }else if(timeFormat === 'M12'){//周期是年
            postData.timeFormat = 'M1';
            postData.timeEnd = new Date(endTime.getFullYear()+ 1, endTime.getMonth(),1).format("yyyy-MM-dd 00:00:00");
            this.isYear = true;
        }

        //验证postData
        if(!postData.timeStart){
            alert(I18n.resource.benchmark.energyAnalysis.INPUT_START_TIME);
            return;
        }
        if(!postData.timeStart){
            alert(I18n.resource.benchmark.energyAnalysis.INPUT_END_TIME);
            return;
        }
        if(this.dsIdList.length === 0){
            alert(I18n.resource.benchmark.energyAnalysis.DATA_POINTS_IS_NULL);
            return;
        }

        Spinner.spin(this.ctn);
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(dataSrc => {
            if (!(dataSrc && dataSrc.list && dataSrc.list.length > 0)) {alert('data error');return;}

            this.dictStore = {};
            for (var i = 0; i < dataSrc.list.length; i++) {
                this.dictStore[dataSrc.list[i].dsItemId] = dataSrc.list[i];
            }
            this.arrTimeShaft = dataSrc.timeShaft;
            this.dictStore[this.ptConfig.energy] && (this.dictStore[this.ptConfig.energy].dsName = I18n.resource.benchmark.energyQuery.ENERGY_CONSUMP);

            this.model.params.forEach((param) =>{
                this.dictStore[param.point] && (this.dictStore[param.point].dsName = param.name);
            });

            this.fillChart();
        }).always(function(){
            //Spinner.stop();
        });
    }

    eventBtnConfigOnClick(){
        var _this = this;
        var $modelConfigModal = $('#modelConfigModal');
        var $divRelate = $('#divRelate').empty();
        var tpl = '<div class="row"><label class="col-sm-3 control-label"><input class="form-control name" value="{name}" placeholder="因子名称" i18n="placeholder=benchmark.energyAnalysis.FACTOR_NAME"/></label>\
            <div class="col-sm-5"><span class="form-control point" dsId="{point}">{pName}</span></div>\
            <div class="col-sm-4"><span class="glyphicon glyphicon-remove-circle btnDelRelate"></span></div></div>';
        var strHtml = '';

        if(this.model && this.model.params && this.model.params.length > 0){
            for(var j = 0, len = this.model.params.length; j < len; j++){
                strHtml += (tpl.formatEL({
                    name: this.model.params[j].name,
                    point: this.model.params[j].point,
                    pName: this.screen.dataSource.getDSItemById(this.model.params[j].point).alias
                }));
            }
        }else{
            strHtml += (tpl.formatEL({name: '', point: '', pName: ''}));
        }

        $divRelate.append(strHtml);
        $modelConfigModal.off('click').on('click', '.btnSaveRelate', function(e){
            var isHide = true;
            e.stopPropagation();
            if(_this.model){
                //先清空数组
                _this.model.params.length = 0;
            }else{
                _this.model = {
                    "idNode": _this.node._id,
                    'projectId': _this.screen.iotFilter.tree.getNodes()[0]['_id'],
                    "interval": 'd',
                    "params": []
                }
            }

            $divRelate.children('.row').each(function(index){
                var point = $(this).find('span.point').attr('dsId');
                var name = $(this).find('input.name').val();
                if(point){
                    if(name.trim().length === 0){
                        alert(I18n.resource.benchmark.energyAnalysis.FACTOR_NOWRITE);
                        isHide = false;
                    }
                    _this.model.params.push({
                        'name': name,
                        'point': point,
                        'pName': 'x' + (index + 1)
                    });
                    //防止出现重复
                    if($.inArray(point, _this.dsIdList) < 0){
                        _this.dsIdList.push(point);
                    }
                }
            });
            isHide && $modelConfigModal.modal('hide');
        });
        $modelConfigModal.modal('show');
        $modelConfigModal.on('hidden.bs.modal',() =>{
            this.screen.hideDataSource();
        })

        this.screen.showDataSource();

        $('#btnAddRelate').off('click').on('click', function(){
            $divRelate.append(tpl.formatEL({name: '', point: '', pName: ''}));
        });
        $divRelate.off('click').on('click', '.btnDelRelate', function(){
            $(this).closest('.row').remove();
        });
        $divRelate.on('click','.btnEditRelate', function(){

        });

        $divRelate.off('dragover').on('dragover','.point',e=>{
            e.preventDefault();
        });
        $divRelate.off('dragleave').on('dragleave','.point',e=>{
            e.preventDefault();
        });
        $divRelate.off('drop').on('drop','.point',e=>{
            e.stopPropagation();
            e.preventDefault();
            var id = EventAdapter.getData().dsItemId
            $(e.currentTarget).attr('dsId', id).text(this.screen.dataSource.getDSItemById(id).alias);
        });
    }

    eventBtnDeleteOnClick(){
        var _this = this;
        var $modelTabList = $('#modelTabList');
        infoBox.confirm('Confirm to delete?', okCallback);

        function okCallback(){
            if(_this.model && _this.model._id){
                WebAPI.get('/benchmark/config/removeModel/' + _this.model._id).done(rs => {
                    if(rs){
                        //this.models删除
                        var index = _this.getModelById(_this.model._id);
                        if(index){
                            _this.models.splice(index, 1);
                        }
                        _this.$activeTabCtn.remove();
                        $modelTabList.children('li.active').remove();
                        if($modelTabList.children('li').length === 1){
                            $('#modelTabList li:eq(0) a .iconAdd').click();
                        }else{
                            $('#modelTabList li:eq(0) a').click();
                        }

                    }else{
                        alert('Delete failed!');
                    }
                });
            }else{
                _this.$activeTabCtn.remove();
                $modelTabList.children('li.active').remove();
                if($modelTabList.children('li').length === 1){
                    $('#modelTabList li:eq(0) a .iconAdd').click();
                }else{
                    $('#modelTabList li:eq(0) a').click();
                }
            }
        }
    }

    eventRename(e){
        e.stopPropagation();
        var _this = this;
        var $target = $(e.target);
        var $modelName = $target.siblings('.modelName');
        var $cycle = $target.siblings('.cycle');

        var $input = $('<input class="form-control" type="text" style="width:120px;" value="'+ $modelName.text() +'"/>').blur(function(e){
            saveModelName(this);
        }).keyup(function(e){
            if(e.keyCode === 13){
                saveModelName(this)
            }
        });
        $target.addClass('hidden').after($input);
        $modelName.addClass('hidden');
        $cycle.addClass('hidden');
        $target.closest('a').css({padding: '3px 5px'});
        e.stopPropagation();
        e.preventDefault();

        function saveModelName(obj){
            $modelName.text($(obj).val());
            $(obj).remove();
            $modelName.removeClass('hidden');
            $cycle.removeClass('hidden');
            $target.removeClass('hidden');
            $target.closest('a').removeAttr('style');

            _this.saveModel({name: $(obj).val()})
        }
    }

    getModelById(modelId){
        if(this.models && this.models.length > 0){
            for(var i = 0, len = this.models.length; i < len; i++){
                if(this.models[i]._id === modelId){
                    return i;
                }
            }
        }
    }

    fillChart(){
        var _this = this;
        var period = $('.selCycle', this.$activeTabCtn).val();
        var optionChartMix = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: false,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            grid: {
                top: 100,
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: function () {
                        var list = [], year = '',key = '', format;
                        if(_this.isYear){
                            _this.arrValIndex = [];//存储要取值的下标
                            for (var i = 1; i < _this.arrTimeShaft.length; i++) {
                                key = _this.arrTimeShaft[i].split('-')[0];
                                if(key !== year){
                                    year = key;
                                    list.push(year);
                                    _this.arrValIndex.push(i);
                                }
                            }
                        }else{
                            if(period == 'd1'){
                                format = "MM-dd";
                            }else if(period == 'h1'){
                                format = "HH:00";
                            }else{
                                format = "yyyy-MM";
                            }
                            for (var i = 0; i < _this.arrTimeShaft.length-1; i++) {
                                list.push(new Date(_this.arrTimeShaft[i]).format(format));
                            }
                        }
                        return list;
                    }()
                },
                {
                    type: 'value',
                    scale: false,
                    axisLabel: { show: false },
                    splitLine: { show: false }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    axisLabel:{
                        formatter: function(value){
                            if(value >= 1000 || value <= -1000){
                                return value/1000 + 'k';
                            }else{
                                return value;
                            }
                        }
                    }
                },
                {
                    type: 'value',
                    scale: true,
                    splitLine: { show: false },
                    axisLabel:{
                        formatter: function(value){
                            if(value >= 1000){
                                return value/1000 + 'k';
                            }else{
                                return value;
                            }
                        }
                    }
                }
            ],
            animation: false,
            legend: {
                x: 'left',
                data: [I18n.resource.benchmark.energyQuery.ENERGY_CONSUMP,I18n.resource.benchmark.energyAnalysis.SUMMARY_REGRESSION]//基准选项,和弦图选择项,相关度
            },
            series: [
                _this.createSeriesBar(_this.pointIdBase)
            ]
        };

        if(this.chartMix[this.activeModelId]){
            this.chartMix[this.activeModelId].clear();
        }else{
            this.chartMix[this.activeModelId] = echarts.init($('.divChartMix', this.$activeTabCtn)[0], theme.Dark);
        }

        this.chartMix[this.activeModelId].setOption(optionChartMix);

        if(this.isRelative || (this.model && this.model.params.length > 0)){
            this.fillPaneParams();
        }
    }

    /**
     * 渲染分析右侧面板: 相关性排名及模型信息
     */
    fillPaneParams () {
        this.$getModel = $.Deferred();
        var _this = this;
        var $ctn = $('.paneParams').children('.divAnalysis').remove().end();
        var postData = {};
        this.dictX = {};

        if(this.isYear){
            postData = {
                y: getArrByIndexs(this.dictStore[this.ptConfig.energy].data),
                x: {}
            };
            for(var i = 0, key, len = this.model.params.length; i < len; i++){
                key = model.params[i].point;
                if(this.dictStore[key].data && this.dictStore[key].data.length > 0){
                    postData.x['x'+ (i+1)] = getArrByIndexs(this.dictStore[key].data);
                }
                this.dictX['x'+ (i+1)] = key;
            }
            function getArrByIndexs(data){
                var arr = [];
                if(!data) return;
                for(var i = 1, l = _this.arrValIndex.length; i < l; i++){
                    arr.push(data[_this.arrValIndex[i]] - data[_this.arrValIndex[i-1]]);
                }
                return arr;
            }
        }else{
            var arr = this.chartMix[this.activeModelId].getOption().series[0].data;
            postData = {
                y: arr,
                x: {}
            };
            for(var i = 0, key, len = this.model.params.length; i < len; i++){
                key = this.model.params[i].point;
                if(this.dictStore[key].data && this.dictStore[key].data.length > 0){
                    arr = this.dictStore[key].data;
                    arr.pop();
                    postData.x['x'+ (i+1)] = arr;
                }
                this.dictX['x'+ (i+1)] = key;
            }
        }

        //TODO 验证postData
        Spinner.spin($ctn[0]);
        var $paneResult = $('.paneResult', this.$activeTabCtn).hide();
        var $paneModelInfo = $('.paneModelInfo', this.$activeTabCtn).hide();
        var $tips = $('.tips', this.$activeTabCtn).show();

        //验证postData
        if($.isEmptyObject(postData.x)){
            alert(I18n.resource.benchmark.energyAnalysis.PARAMS_ERROR);
            return;
        }else{
            for(var i in postData.x){
                if(!postData.x[i] || postData.x[i].length === 0){
                    alert(I18n.resource.benchmark.energyAnalysis.PARAMS_ERROR);
                    return;
                }
            }
        }
        if(!arr || arr.length === 0){
            alert(I18n.resource.benchmark.energyAnalysis.PARAMS_ERROR);
            return;
        }
        if(!postData.y || postData.y.length < 10){
            alert(I18n.resource.benchmark.energyAnalysis.PARAMS_LENGTH);
            return;
        }

        Spinner.spin($tips[0]);

        this.$execRelationAnalysis = WebAPI.post('/analysis/model/execRelationAnalysis', postData).done(rs => {
            try{
                rs = JSON.parse(rs);
                $tips.hide();
                $paneModelInfo.show();
                $paneResult.children('.divAnalysis').remove().end().show();
                if(!rs || $.isEmptyObject(rs)) {
                    alert(I18n.resource.benchmark.energyAnalysis.FAIL_ANALYSIS);
                    return;
                }

                var divRow,divRank,divVar,divCorRelate;
                var arrData = [];

                for(var i in rs.R){
                    arrData.push({pt: this.dictX[i], rs: rs.R[i]});
                }

                arrData.sort(function(a,b){
                    return b.rs - a.rs;
                });
                for (var i = 0; i < arrData.length; i++) {
                    divRow = document.createElement('div');
                    divRow.className = 'divRow divAnalysis';

                    divRank = document.createElement('div');
                    divRank.className = 'divUnit divRank';
                    divRank.textContent = (i + 1).toString();

                    divVar = document.createElement('div');
                    divVar.className = 'divUnit divVar';
                    divVar.textContent = this.dictStore[arrData[i].pt] ? this.dictStore[arrData[i].pt].dsName : '';

                    divCorRelate = document.createElement('div');
                    divCorRelate.className = 'divUnit divCorRelate';
                    divCorRelate.textContent = arrData[i].rs.toFixed(3);

                    divRow.appendChild(divRank);
                    divRow.appendChild(divVar);
                    divRow.appendChild(divCorRelate);

                    divRow.index = i;
                    var isFixed = {};//保存选择的点是否固定
                    //hover时显示因子及因子的回归线
                    divRow.onmouseover = function(){
                        if(!isFixed[_this.pointIdSelected]){
                            _this.pointIdSelected = arrData[this.index].pt;
                            postData.x = {};//清空原来的数据
                            postData.x['x1'] = _this.dictStore[_this.pointIdSelected].data
                            _this.renderRegression(postData,_this.pointIdSelected);
                        }
                    }
                    //如果没有固定,鼠标移开时,显示总的回归线
                    divRow.onmouseout = function(){
                        if(!isFixed[_this.pointIdSelected]){
                            _this.pointIdSelected = undefined;
                            _this.renderRegression(null, 'all');
                        }
                    }
                    //固定/取消固定选中因子
                    divRow.onclick = function(){
                        $(this).toggleClass('selected');
                        _this.pointIdSelected = arrData[this.index].pt;

                        if($(this).siblings().hasClass('selected')){//清空其他因子
                            $(this).siblings().removeClass('selected');
                            for(var i in isFixed){
                                isFixed[i] = false;
                            }
                            isFixed[_this.pointIdSelected] = true;
                            //刷新图表
                            postData.x = {};//清空原来的数据
                            postData.x['x1'] = _this.dictStore[_this.pointIdSelected].data
                            _this.renderRegression(postData,_this.pointIdSelected);
                        }else{
                            isFixed[_this.pointIdSelected] = !isFixed[_this.pointIdSelected];
                        }
                    }
                    $paneResult.append(divRow);
                }
            }catch (e){
                console.log(e.toString());
                $tips.text(I18n.resource.benchmark.energyAnalysis.FAIL_ANALYSIS);
            }
            //TODO render model info
        }).always(() => {
            Spinner.stop();
        }).fail(() => {
            $tips.text(I18n.resource.benchmark.energyAnalysis.FAIL_ANALYSIS);
        });

        if(this.isRelative || (this.model && this.model.params.length > 0)){
            this.renderRegression(postData, 'all');
        }

        $.when(this.$execRelationAnalysis).done(function(){
            _this.$getModel = WebAPI.post('/analysis/model/get', postData).done(function(rs){
                try{
                    rs = JSON.parse(rs);
                    if(rs && !$.isEmptyObject(rs)){
                        _this.model = $.extend(true, _this.model, rs);
                        _this.renderModelInfo(_this.model);
                    }else{
                        alert(I18n.resource.benchmark.energyAnalysis.FAIL_GET_MODEL);
                    }
                }catch (e){
                    alert(I18n.resource.benchmark.energyAnalysis.FAIL_GET_MODEL);
                }

            }).fail(function(){
                alert(I18n.resource.benchmark.energyAnalysis.FAIL_GET_MODEL);
            }).always(function(){

            });

            $.when(_this.$getModel).done(function(){
                if(_this.isRelative){
                    var period = $('.selCycle', _this.$activeTabCtn).val();
                    var interval = '';
                    if(period === 'h1'){
                        interval = 'h';
                    }else if(period === 'd1'){
                        interval = 'd';
                    }else if(period === 'M1'){
                        interval = 'M';
                    }else if(period === 'M12'){
                        interval = 'y';
                    }
                    _this.saveModel({
                        "interval": interval,
                        "name": $('#modelTabList li.active a .modelName').text(),//
                        "creatorId": AppConfig.userId,
                        "startTime": $('.iptStartTime', _this.$activeTabCtn).val(),
                        "endTime": $('.iptEndTime', _this.$activeTabCtn).val()
                    });
                }
            });
        });
    }

    renderModelInfo(model){
        var strParams = '';
        var $paneModelInfo = $('.paneModelInfo', this.$activeTabCtn);
        var $projectName = $('#projectName', $paneModelInfo).text(this.screen.iotFilter.tree.getNodes()[0].name);
        var $timeRange = $('#timeRange', $paneModelInfo);
        var $fittingObj = $('#fittingObj', $paneModelInfo);
        var $relativeParams = $('#relativeParams', $paneModelInfo);
        var $relativeVal = $('#relativeVal', $paneModelInfo);
        var $modelInfo = $('#modelInfo', $paneModelInfo);

        $projectName.text(this.screen.iotFilter.tree.getNodes()[0].name);
        $timeRange.text((model.startTime ? model.startTime : $('.iptStartTime',this.$activeTabCtn).val()) + ' ~ ' + (model.endTime ? model.endTime : $('.iptEndTime',this.$activeTabCtn).val()));
        $fittingObj.text(this.screen.iotFilter.tree.getSelectedNodes()[0].name + I18n.resource.benchmark.energyQuery.ENERGY_CONSUMP);

        $relativeParams.html(strParams);
        $relativeVal.html(model.info.R2 ? kIntSeparate(model.info.R2, 3) : '');//保留3位小数
        $modelInfo.text(model.info.desc ? model.info.desc : '');
    }

    onNodeClick(e, node){
        this.model = undefined;
        this.node = node ? node : this.screen.iotFilter.tree.getSelectedNodes()[0];
        if(!this.node) return;
        if (this.screen.opt.point && this.screen.opt.point[this.node['_id']]){
            this.ptConfig = this.screen.opt.point[this.node['_id']];
            Spinner.spin(this.ctn);
            this.screen.getModel(this.node._id).done((rs)=>{
                this.models = rs;
                this.renderModelList();
            }).always(rs => {
                Spinner.stop();
            });
        }else {
            this.ptConfig = {};//power功率, energy用电量
        }
        this.dsIdList.length = 0;
        this.init();
    }

    saveModel(opt){
        if(!this.model || $.isEmptyObject(this.model)) return;
        this.model = $.extend(true, this.model, opt);

        WebAPI.post('/analysis/model/save', this.model).done((rs) => {
            if(!rs) alert('Save failed');
            if(!this.model._id){
                this.model._id = rs.id;
                this.models.push(this.model);
                //更新id
                this.$activeTabCtn.attr('id', this.model._id);
                $('#modelTabList li.active a').attr('href', '#' + this.model._id);
            }
            $('#' + this.node.tId).addClass('hasModel');// 更改图标
        });
    }

    //基准:能耗
    createSeriesBar(pointIdBase) {
        var _this = this;
        return {
            name: this.dictStore[pointIdBase].dsName,
            type: 'line',
            yAxisIndex: 0,
            itemStyle: {
                normal: {
                    color: 'rgba(250,216,96,1)',//黄
                    lineStyle: {
                        width: 4
                    }
                }
            },
            data: (function(d){//做减法
                var arr = [];
                if(_this.isYear){
                    for(var i = 1, l = _this.arrValIndex.length, diff; i < l; i++){
                        diff = d[_this.arrValIndex[i]] - d[_this.arrValIndex[i]-1];
                        arr.push(diff > 0 ? diff : 0);
                    }
                }else{
                    for(var i = 1, l = d.length, diff; i < l; i++){
                        diff = d[i] - d[i-1];
                        arr.push(diff > 0 ? diff : 0);
                    }
                }

                return arr;
            }(this.dictStore[pointIdBase].data))
        }
    }
    //鼠标hover选中项或者默认项(相关系数最大的项):折线图
    createSeriesLine(pointIdSelected) {
        var _this = this;
        return {
            name: this.dictStore[pointIdSelected].dsName,
            type: 'bar',
            yAxisIndex: 1,
            smooth: true,
            symbolSize: 0,
            itemStyle: {
                normal: {
                    color: 'rgba(66, 139, 202, 0.5)',//蓝
                    barBorderRadius: [5,5,0,0]
                }
            },
            data: (function(d){//做减法
                var arr = [];
                if(_this.isYear){
                    for(var i = 1, l = _this.arrValIndex.length, diff; i < l; i++){
                        diff = d[_this.arrValIndex[i]] - d[_this.arrValIndex[i]-1];
                        arr.push(diff > 0 ? diff : 0);
                    }
                }else{
                    for(var i = 1, l = d.length; i < l; i++){
                        arr.push(d[i]);
                    }
                }

                return arr;
            }(this.dictStore[pointIdSelected].data))
        }
    }

    /**
     * 线性回归曲线
     */
    createSeriesRegression(key) {
        var name, color;
        if(key == 'all'){
            name = I18n.resource.benchmark.energyAnalysis.SUMMARY_REGRESSION;
            color = 'rgba(254,132,99,1)';//红
        }else{
            name = this.dictStore[this.pointIdSelected].dsName + I18n.resource.benchmark.energyAnalysis.REGRESSION;
            color = 'rgba(20,201,18,0.8)';//绿
        }
        return {
            name: name,
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            symbolSize: 0,
            itemStyle: {
                normal: {
                    color: color,
                    lineStyle: {
                        width: 4
                    }
                }
            },
            data: (function(arrR){
                var arr = [];
                if(arrR && arrR instanceof Array){
                    arrR.forEach(function(i){
                        arr.push(i.toFixed(0));
                    });
                }
                return arr;
            })(this.dictRegression[key])
        }
    }

    /**
     * 渲染分析回归线
     */
    renderRegression(postData, key){
        var _this = this;
        if(this.dictRegression[key]) {
            rerenderChart();
        }else if(postData){
            WebAPI.post('/analysis/model/analysisRegression', postData).done(rs => {
                try{
                    this.dictRegression[key] = JSON.parse(rs);
                    rerenderChart();
                }catch(e){
                    alert(I18n.resource.benchmark.energyAnalysis.MSG_FAIL_REGRESSION);
                }

            }).fail(rs => {
                alert(I18n.resource.benchmark.energyAnalysis.MSG_FAIL_REGRESSION);
            }).always(rs => {

            });
        }

        function rerenderChart(){
            var opt = _this.chartMix[_this.activeModelId].getOption();
            if(_this.pointIdSelected){
                opt.legend[0].selected[I18n.resource.benchmark.energyAnalysis.SUMMARY_REGRESSION] = false;
                opt.legend[0].data[2] = _this.dictStore[_this.pointIdSelected].dsName;
                opt.legend[0].data[3] = _this.dictStore[_this.pointIdSelected].dsName + I18n.resource.benchmark.energyAnalysis.REGRESSION;
                opt.series = [_this.createSeriesBar(_this.pointIdBase), _this.createSeriesRegression('all'), _this.createSeriesLine(_this.pointIdSelected), _this.createSeriesRegression(_this.pointIdSelected)];
            }else{
                opt.legend[0].selected[I18n.resource.benchmark.energyAnalysis.SUMMARY_REGRESSION] = true
                opt.legend[0].data.lenth = 2;
                opt.series = [_this.createSeriesBar(_this.pointIdBase), _this.createSeriesRegression('all')];
            }
            _this.chartMix[_this.activeModelId].clear();
            _this.chartMix[_this.activeModelId].setOption(opt);
        }
    }

    /**
     * 渲染某个节点对应的所有的model
     */
    renderModelList(){
        var $modelTabList = $('#modelTabList').empty();
        var $modelTabContent = $('#modelTabContent').empty();
        var $modelTemplate = $('#modelTemplate');
        var $content, content, cycle, interval;
        if(this.models && this.models.length > 0){
            this.models.forEach((model) =>{

                if(model.interval === 'y'){
                    cycle = I18n.resource.benchmark.energyQuery.YEAR;
                }else if(model.interval === 'M'){
                    cycle = I18n.resource.benchmark.energyQuery.MONTH;
                }else if(model.interval === 'd'){
                    cycle = I18n.resource.benchmark.energyQuery.DAY;
                }else if(model.interval === 'h'){
                    cycle = I18n.resource.benchmark.energyQuery.HOUR;
                }

                !model.name && (model.name = "Untitled");
                $content = $modelTemplate.clone(true).attr('id',model._id);
                $content.find('.btnDelete').removeAttr('disabled');
                //tab
                $modelTabList.append('<li role="presentation" class=""><a href="#'+ model._id +'" aria-controls="'+ model._id +'" role="tab" data-toggle="tab"><span class="modelName">'+ model.name  +'</span><span class="cycle">('+ cycle +')</span><span class="glyphicon glyphicon-edit iconEdit"></span></a></li>');
                //content
                $modelTabContent.append('<div role="tabpanel" class="tab-pane" id="'+ model._id +'">'+ $content.html() +'</div>');
                //form 数据
                content = document.getElementById(model._id);
                interval = model.interval === 'y' ? 'M12' : model.interval + '1';
                $('.selCycle', content).val(interval);
                $('.iptStartTime', content).val(model.startTime);
                $('.iptEndTime', content).val(model.endTime);
            });
            this.model = this.models[0];
        }

        //新建的tab
        $modelTabList.append('<li role="presentation"><a href="javascript:void(0)" aria-controls="newTab" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-plus-sign iconAdd"></span></a></li>');
        $modelTabContent.append('<div role="tabpanel" class="tab-pane" id="newTab">'+ $modelTemplate.clone().attr('id',"").html() +'</div>');

        //默认第一个tab是active状态
        $modelTabList.children('li:eq(0)').addClass('active');
        this.$activeTabCtn = $modelTabContent.children('div:eq(0)').addClass('active');
        this.activeModelId = this.$activeTabCtn.attr('id');
        this.chartMix[this.activeModelId] = echarts.init($('.divChartMix', this.$activeTabCtn)[0], theme.Dark);

        this.attachEvents();
        if(this.model){
            this.getAnalysisData();
        }else{
            $('#modelTabList li.active .iconAdd').click();
        }
    }

    destroy(){
        this.model = null;
        this.models = null;
        this.$activeTabCtn = null;
        this.activeModelId = null;
        this.ctn = null;
        this.screen = null;
        this.opt = null;
        this.ptConfig = null;
        this.dsIdList = null;
        this.isYear = null;
        this.chartMix = null;
        this.isRelative = null;
        this.dsIdList = null;
        this.pointIdBase = null;
        this.dictPairFactor = null;
        this.chartOption = null;
    }
}
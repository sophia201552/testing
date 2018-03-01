var ModalInteractConfig = (function ($, window, undefined) {
    var _this;
    function ModalInteractConfig(options) {
        _this = this;
        ModalConfig.call(_this, options);
    }

    ModalInteractConfig.prototype = Object.create(ModalConfig.prototype);
    ModalInteractConfig.prototype.constructor = ModalInteractConfig;

    ModalInteractConfig.prototype.DEFAULTS = {
        htmlUrl: '/static/views/observer/widgets/modalInteract.html'
    };

    ModalInteractConfig.prototype.init = function () {
        this.$contain = $('#modalInteract', this.$wrap);
        this.$btnSubmit = $('.btn-submit', this.$wrap);
        this.$divCfgData = $('.divConfigData', this.$wrap);
        this.$divDataGrid = $('#divDataGrid', this.$wrap);
        this.$divDataTip = $('.dataDragTip', this.$wrap);
        I18n.fillArea(this.$contain);
        this.attachEvents();
    };

    ModalInteractConfig.prototype.recoverForm = function (modal) {
        // clear first
        var item = _this.$divDataGrid.children('.item');
        if (item.length > 0) {
            item.remove();
        }
        if (modal.points) {
            // insert second
            var dictPtStat = modal.option.dictPtStatus;
            if (dictPtStat) {
                var num = 1;
                for (var id in dictPtStat) {
                    this.insertItem(id, dictPtStat[id].unit, num, dictPtStat[id].name, dictPtStat[id].projName);
                    num++;
                }
            }
        }
    };

    ModalInteractConfig.prototype.reset = function () {
    };

    ModalInteractConfig.prototype.attachEvents = function () {
        // init drag
        this.$divCfgData.on('dragover', function (e) {
            e.preventDefault();
            $(e.currentTarget).find('.dataDragTip').addClass('addData');
        });
        this.$divCfgData.on('dragleave', function (e) {
            e.preventDefault();
            $(e.currentTarget).find('.dataDragTip').removeClass('addData');
        });
        this.$divCfgData.on('drop', function(e, arg) {
            $('.addData').removeClass('addData');

            var dragItemId = EventAdapter.getData().dsItemId;
            if (!dragItemId) {
                return;
            }
            var item = _this.$divDataGrid.find('.divDsGridItem');
            var len = item.length;
            if (Object.prototype.toString.call(dragItemId) === '[object Array]') {
                var lens = dragItemId.length;
                for (var j = 0; j < lens; j++) {
                    var isExist = false;
                    for (var i = 0; i < len; i++) {
                        if (dragItemId[j] == item.eq(i).attr('dsid')) {
                            dragItemId.splice(j, 1);
                            lens = lens - 1;
                            j = j - 1;
                            isExist = true;
                            continue;
                        } 
                    }
                    if (!isExist) { 
                        dotAdd(dragItemId[j], 'array');
                    }
                }
                if (lens < 1) { return;}
            } else {
                // check if repeat
                var bFind = false;
                for (var i = 0; i < len; i++) {
                    if (dragItemId == item.eq(i).attr('dsid')) {
                        bFind = true;
                        break;
                    } 
                }
                if (bFind) {
                    return;
                }
                dotAdd(dragItemId);
            }
            function dotAdd(dragItemId, isArray) {
                // num less equal than 20
                if (len >= 20) {
                    return;
                }
                
                if (dragItemId) {
                    var item = AppConfig.datasource.getDSItemById(dragItemId);
                    if (item && item.alias) {
                        var parent = _this.options.modalIns;
                        var prjName;
                        if (parent) {
                            var temp = parent.getProjectNameFromId(item.projId, parent.m_langFlag);
                            if (0 == parent.m_langFlag) {
                                prjName = '项目名：' + temp;
                            }
                            else {
                                prjName = 'Project Name:' + temp;
                            }
                        }
                        _this.insertItem(dragItemId, '', len + 1, item.alias, prjName);
                        len = _this.$divDataGrid.find('.divDsGridItem').length;
                    }
                }
            }
        });

        // submit EVENTS
        this.$btnSubmit.off().click(function (e) {
            var modalIns = _this.options.modalIns;
            var modal = modalIns.entity.modal;

            // save to modal
            modal.points = [];
            if (!modal.option) {
                modal.option = {}
                modal.option.dictPtStatus = {};
            }
            if (modal.option) {
                modal.option.dictPtStatus = {};
            }
            var arrGrid = _this.$divDataGrid.find('.grow');
            for (var i = 0, len = arrGrid.length; i < len; i++) {
                var item = arrGrid.eq(i);
                var id = item.attr('dsid');
                var name = item.find('input').val();
                var proName = item.find('.contentDS').attr('title');
                modal.points.push(id);
                modal.option.dictPtStatus[id] = {show:((0 == i) ? true : false), count:i, unit:'', name:name, projName:proName};
            }
            if (!modal.option.timeMode) {
                // set default values
                var tmEnd = new Date();
                tmEnd.setHours(23);
                tmEnd.setMinutes(59);
                var tmStart = new Date();
                tmStart.setTime(tmEnd.getTime() - 172800000);
                tmStart.setHours(0);
                tmStart.setMinutes(0);
                modal.option.timeMode = 'recent';
                modal.option.interval = 'h1';
                modal.option.timeStart = tmStart.format('yyyy-MM-dd HH:mm:00');
                modal.option.timeEnd = tmEnd.format('yyyy-MM-dd HH:mm:00');
                modal.option.periodVal = 3;
                modal.option.periodUnit = 'day';
                modal.interval = 3;
            }

            // close modal
            _this.$modal.modal('hide');
            e.preventDefault();
        });
    };

    ModalInteractConfig.prototype.insertItem = function(id, unit, num, name, projName) {
        if (name == undefined) {
            name = AppConfig.datasource.getDSItemById(id).alias;
        }
        if (!projName) {
            projName = '';
        }
        var $item = $('<div class="col-lg-3 col-xs-4 divDsGrid item">\
            <span class="divDsGridNum">' + num + '</span>\
            <span class="divDsGridItem grow" dsid="' + id + '">\
                <span class="contentDS" title="' + projName + '">' + name + '</span>\
                <input type="text" value="' + name + '" style="display:none">\
                <span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true"></span>\
            </span></div>');
                //<input type="text" class="form-control dsUnit" value="' + unit + '">
        $item.click(function (e) {
            var $tar = $(e.currentTarget);
            var $name = $tar.find('.contentDS');
            var $input = $tar.find('input');
            $name.hide();
            $input.show();
            $input.focus();
            $input.select();
            $input.keyup(function (e) {
                if (13 == e.keyCode) {
                    var newVal = $input.val();
                    $name.text(newVal);
                    $input.blur();
                }
            });
            $input.blur(function (e) {
                $input.val($name.text());
                $name.show();
                $input.hide();
            });
        })
        _this.$divDataTip.before($item);

        _this.$divDataGrid.find('.btnRemoveDS').last().click(function (e) {
            var $dsGrid = $(e.currentTarget).closest('.divDsGrid');
            if ($dsGrid) {
                $dsGrid.remove();
            }
            var gridNum = _this.$divDataGrid.find('.divDsGridNum');
            if (gridNum) {
                for (var i = 0; i < gridNum.length; i++) {
                    gridNum.eq(i).text(i+1);
                }
            }
        });
        _this.$divDataGrid.find('.contentDS').last().dblclick(function (e) {
            var $spanTar = $(e.currentTarget);
            var name = $spanTar.text();
            var $inputName = $spanTar.next('input');
            $inputName.keydown(function (e) {
                if (13 == e.keyCode) {
                    var $inputTar = $(e.currentTarget);
                    var newName = $inputTar.val();
                    $inputTar.hide();
                    $spanTar.text(newName);
                    $spanTar.show();
                }
            });
            $inputName.blur(function (e) {
                var $inputTar = $(e.currentTarget);
                var newName = $inputTar.val();
                $inputTar.hide();
                $spanTar.text(newName);
                $spanTar.show();
            });
            $spanTar.hide();
            $inputName.show();
            $inputName.focus();
            $inputName.select();
        });
    };

    ModalInteractConfig.prototype.destroy = function () {
        this.detachEvents();
        this.$wrap.remove();
    };

    return ModalInteractConfig;
} (jQuery, window));


var ModalInteract = (function(){
    var _this;
    var g_dictChart = {};
    function ModalInteract(screen, entityParams) {
        _this = this;
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this._showConfig);
        this.modal = entityParams.modal;
        this.modalId = entityParams.id;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.m_lang = I18n.resource.dataSource;
        this.screen = screen;
        this.init();
        this.arrColor = echarts.config.color;
        //this.arrColor = ['#03d5c6', '#288add', '#95f31c', '#fbef31', '#fbbf05', '#d06e0f', '#f34704', '#d60609', '#f903d9', '#a505d9', '#c088f9', '#6421cb', '#7575fa', '#2609d1', '#1671fb', '#18a0a3', '#5bbcd2', '#00bdfb', '#00fd44', '#00febe'];
        this.timeFlag = undefined;
        this.arrModal = screen.store.layout[0];
        g_dictChart[this.modalId] = {chart:this.chart, contain:this.container};
        this.spinner.spin(this.container);
    };
    ModalInteract.prototype = new ModalBase();
    ModalInteract.prototype.optionTemplate = {
        name:'toolBox.modal.INTERACT_CHART',
        parent:0,
        mode:'custom',
        maxNum: 10,
        title:'',
        minHeight:3,
        minWidth:9,
        maxHeight:12,
        maxWidth:12,
        type:'ModalInteract'
    };

    ModalInteract.prototype.defaultOptions = {
        title : {
            text: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        toolbox: {
            show : false,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        dataZoom: {
            show: true
        },
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    textStyle: {
                        color: '#777'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#777',
                        width: 1,
                        type: 'dashed'
                    }
                }
            }
        ],
        animation: false,
        grid: [{
             bottom: 70
         }]
    };

    ModalInteract.prototype.init = function() {
        var containWidth = $(this.container).width();
        var containHeight = $(this.container).height();
        var $divLeftPart = $('<div style="display:inline-block;height:100%"></div>');
        $divLeftPart.css('width', containWidth-220 + 'px');
        var $divChartCtrl = $('<div id="chartShow"></div>');
        $divChartCtrl.css('height', containHeight-10 + 'px');

        //var $divTimeCtrl = $('<div style="height:100px;margin:20px 0 0 20px;"></div>');
        //this.initInteractTime($divTimeCtrl);
        $divLeftPart.append($divChartCtrl);
        //$divLeftPart.append($divTimeCtrl);

        var $divDataCtrl = $('<div id="dataList" style="display:inline-block;position:absolute;top:10px;right:0;width:220px;height:100%;overflow-y:auto"><div class="form-group"></div></div>');
        if (this.modal.points && this.modal.option.dictPtStatus) {
            var arrId = []
            for (var id in this.modal.option.dictPtStatus) {
                arrId.push(id);
            }
            var arrItem = AppConfig.datasource.getDSItemById(arrId);
            for (var id in this.modal.option.dictPtStatus) {
                for (var m = 0; m < arrItem.length; m++) {
                    if (id == arrItem[m].id) {
                        var name = this.modal.option.dictPtStatus[id].name;     // arrItem[m].alias;
                        var unit = this.modal.option.dictPtStatus[id].unit;
                        this.insertInteractData($divDataCtrl, id, name, unit);

                        //var prjName = _this.getProjectNameFromId(arrItem[m].projId, _this.m_langFlag);
                        var target = $divDataCtrl.find('.form-inline').last();
                        if (0 == arrItem[m].type) {
                            //this.setToolTips(target, name, prjName, arrItem[m].value, arrItem[m].note);
                        }
                        else if (1 == arrItem[m].type) {
                            var showFormula = AppConfig.datasource.getShowNameFromFormula(arrItem[m].value);
                            this.setFormulaToolTips(target, name, showFormula, arrItem[m].note);
                        }
                        break;
                    }
                }
                //var name = AppConfig.datasource.getDSItemById(id).alias;
                //var unit = this.modal.option.dictPtStatus[id].unit;
                //this.insertInteractData($divDataCtrl, id, name, unit);
            }
        }

        $(this.container).empty();
        $(this.container).append($divLeftPart);
        $(this.container).append($divDataCtrl);
    }

    ModalInteract.prototype.renderModal = function (e) {
        this.drawCharts();
        this.spinner.stop();
    }

    ModalInteract.prototype.updateModal = function (e) {
        // update chart
        var dsId = e[0].dsItemId;
        var modeName;
        for (var i = 0; i < _this.arrModal.length; i++) {
            var arrPt = _this.arrModal[i].modal.points;
            for (var j = 0; j < arrPt.length; j++) {
                if (dsId == arrPt[j]) {
                    modeName = _this.arrModal[i].modal.option.timeMode;
                    break;
                }
            }
            if (modeName) {
                break;
            }
        }
        if ('recent' == modeName) {
            var newOption = _this.chart.getOption();
            //var newOption = (g_dictChart[modeId].chart).getOption();
            var newSeries = newOption.series;
            var arrId = [];
            for (var i = 0, len = e.length; i < len; i++) {
                arrId.push(e[i].dsItemId);
            }
            var arrItem = AppConfig.datasource.getDSItemById(arrId);
            for (var i = 0, len = e.length; i < len; i++) {
                var id = e[i].dsItemId;
                for (var m = 0; m < arrItem.length; m++) {
                    if (id == arrItem[m].id) {
                        var name = arrItem[m].alias;
                        var bFind = false;
                        var j = 0;
                        for (var len2 = newSeries.length; j < len2; j++) {
                            if (name == newSeries[j].name) {
                                bFind = true;
                                break;
                            }
                        }
                        if (bFind) {    // append new data
                            var flag = false;
                            for (var k = 0; k < newSeries[j].data.length; k++) {
                                if (undefined == newSeries[j].data[k]) {
                                    newSeries[j].data[k] = e[i].data;
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                newSeries[j].data.push(e[i].data);
                            }
                        }
                        break;
                    }
                }
            }
            _this.chart.setOption(newOption);
            _this.chart.refresh();
        }

        // update data list
        var spanReal = $('#dataList').find('.frontCtrl');
        if (spanReal) {
            for (var j = 0, len2 = e.length; j < len2; j++) {
                var id = e[j].dsItemId;
                for (var k = 0, len3 = spanReal.length; k < len3; k++) {
                    if (id == spanReal.eq(k).attr('pId')) {
                        spanReal.eq(k).find('.interactRealVal').text(e[j].data);
                        break;
                    }
                }
            }
        }
    }

    ModalInteract.prototype.showConfigModal = function () {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    }
    ModalInteract.prototype._showConfig = function () {};

    ModalInteract.prototype.setModalOption = function (option) {
    }

    ModalInteract.prototype.drawCharts = function (parmOption, parmChart, parmContain) {
        if (!parmOption) {
            parmOption = _this.modal.option;
        }
        if (!parmChart) {
            parmChart = _this.chart;
        }
        if (!parmContain) {
            parmContain = _this.container;
        }
        if (parmOption) {
            // filter points
            var arrPoints = [];
            for (var itemId in parmOption.dictPtStatus) {
                if (parmOption.dictPtStatus[itemId].show) {
                    arrPoints.push(itemId);
                }
            }
            if (0 == arrPoints.length) {
                parmChart.clear();
                _this.setDataListColor();
                return;
            }
            if ('recent' == parmOption.timeMode) {
                var tmEnd = new Date();
                tmEnd.setHours(23);
                tmEnd.setMinutes(59);
                var tmTemp = tmEnd.getTime() - 86400000 * (parmOption.periodVal - 1);
                var tmStart = new Date();
                tmStart.setTime(tmTemp);
                tmStart.setHours(0);
                tmStart.setMinutes(0);
                parmOption.timeStart = tmStart.format('yyyy-MM-dd HH:mm:00');
                parmOption.timeEnd = tmEnd.format('yyyy-MM-dd HH:mm:00');
            }

            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: arrPoints,
                timeStart: new Date(parmOption.timeStart).format('yyyy-MM-dd HH:mm:00'),
                timeEnd: new Date(parmOption.timeEnd).format('yyyy-MM-dd HH:mm:00'),
                timeFormat: parmOption.interval
            }).done(function (result) {
                if (result.timeShaft.length <= 0) {
                    parmChart = echarts.init($(parmContain, AppConfig.chartTheme).find('#chartShow')[0]).clear();
                    return;
                }
                var arrName = [];
                var series = [];
                var arrId = [];
                var arrItem = [];
                for (var i = 0, len = result.list.length; i < len; i++) {
                    arrId.push(result.list[i].dsItemId);
                }
                arrItem = AppConfig.datasource.getDSItemById(arrId);
                var cntNow = (new Date()).getTime();
                var dictLastData = {};
                for (var i = 0, len = result.list.length; i < len; i++) {
                    var id = result.list[i].dsItemId;
                    for (var m = 0; m < arrItem.length; m++) {
                        if (id == arrItem[m].id) {
                            var showData = [];
                            var lastData;
                            var flag = false;
                            if ('recent' == parmOption.timeMode) {  // recent cycle
                                var n = 0;
                                for (; n < result.timeShaft.length; n++) {
                                    if (Date.parse(result.timeShaft[n]) > cntNow) {
                                        //break;
                                        if (!flag) {
                                            lastData = result.list[i].data[n];
                                            flag = true;
                                        }
                                        showData.push(undefined);
                                    }
                                    else {
                                        showData.push(result.list[i].data[n]);
                                    }
                                }
                                //showData = (result.list[i].data).slice(0, n);
                                dictLastData[id] = lastData;
                            }
                            else {  // fixed cycle
                                showData = result.list[i].data;
                            }
                            var name = arrItem[m].alias;
                            arrName.push(name);
                            var count = parmOption.dictPtStatus[id].count;
                            var color = _this.arrColor[count];
                            series.push({
                                name: name,
                                type: 'line',
                                data: showData,
                                itemStyle: {
                                    normal: {
                                        color: color
                                    }
                                }
                            });
                            break;
                        }
                    }
                }
                //for (var i = 0, len = arrItem.length; i < len; i++) {
                //    var item = arrItem[i];
                //    var name = item.alias;
                //    arrName.push(name);
                //    var count = _this.modal.option.dictPtStatus[id].count;
                //    var color = _this.arrColor[count];
                //    series.push({
                //        name: name,
                //        type: 'line',
                //        data: result.list[i].data,
                //        itemStyle: {
                //            normal : {
                //                color: color
                //            }
                //        }
                //    });
                //}
                var options = {
                    legend: {
                        show: false,
                        data: arrName
                    },
                    xAxis: [{
                        type : 'category',
                        boundaryGap : false,
                        data : result.timeShaft,
                        axisLabel: {
                            textStyle: {
                                color: '#777'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#777',
                                width: 1,
                                type: 'dashed'
                            }
                        }
                    }],
                    series : series
                }
                var drawOptions = {}
                jQuery.extend(drawOptions, ModalInteract.prototype.defaultOptions, options);
                parmChart = echarts.init($(parmContain).find('#chartShow')[0], AppConfig.chartTheme);
                parmChart.setOption(drawOptions);
                _this.chart = parmChart;
                _this.setDataListColor(parmContain);

                // set last data in recent mode
                if ('recent' == parmOption.timeMode) {
                    var spanReal = $(parmContain).find('.frontCtrl');
                    if (spanReal) {
                        for (var p = 0; p < spanReal.length; p++) {
                            var $item = spanReal.eq(p);
                            var id = $item.attr('pid');
                            $item.find('.interactRealVal').text(dictLastData[id]);
                        }
                    }
                }
                else {
                    var spanReal = $(parmContain).find('.frontCtrl');
                    if (spanReal) {
                        for (var p = 0; p < spanReal.length; p++) {
                            var $item = spanReal.eq(p);
                            var id = $item.attr('pid');
                            $item.find('.interactRealVal').text('');
                        }
                    }
                }
            });
        }
    }

    ModalInteract.prototype.drawChartsEx = function (parmOption, modalId) {
        _this.drawCharts(parmOption, g_dictChart[modalId].chart, g_dictChart[modalId].contain);
    }

    ModalInteract.prototype.insertInteractData = function ($divDst, ptId, ptName, ptUnit) {
        $divDst.append('\
            <form class="form-inline">\
                <span class="form-control frontCtrl interactDsFrame" pId="' + ptId + '" style="cursor:pointer;width:200px;border-radius: 0em 0em 0em 0em;margin-right: -4px;border-width: 0;color: #ccc;border-bottom:1px solid #465b85;">\
                    <span class="interactSpanDsName" style="display:inline-block;width:100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;vertical-align: bottom;">' + ptName + '</span>\
                    <span class="interactRealVal" style="display:inline-block;width:70px;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:bottom;"></span>\
                </span>\
            </form>\
        ');
        //<input type="text" class="form-control" value="' + ptUnit + '" style="cursor:pointer;width:40px;border-radius: 0 0.5em 0.5em 0;background-color:#465b85;color: #ccc;border:1px solid #465b85;" readonly>\
        var $front = $divDst.find('.frontCtrl');
        $front.off().click(function (e) {
            if (_this.modal.option && _this.modal.option.dictPtStatus) {
                var $tar = $(e.currentTarget);
                var id = $tar.attr('pId');

                var $contain = $tar.closest('.springContainer');
                var modalId;
                if ($contain) {
                    var temp = $contain.attr('id');
                    modalId = temp.split('_')[1];
                    for (var i = 0; i < _this.arrModal.length; i++) {
                        var item = _this.arrModal[i];
                        if (modalId == item.id) {
                            item.modal.option.dictPtStatus[id].show = !item.modal.option.dictPtStatus[id].show;
                            break;
                        }
                    }
                }
                //_this.modal.option.dictPtStatus[id].show = !_this.modal.option.dictPtStatus[id].show;
                _this.screen.saveLayoutOnly();
                _this.drawCharts(item.modal.option, g_dictChart[modalId].chart, g_dictChart[modalId].contain);
            }
        })
    }

    ModalInteract.prototype.initInteractTime = function ($divDst) {
        $divDst.append('\
            <form class="form-inline" style="margin-top: 3px;font-family:Microsoft YaHei;font-size:14px">\
                <div class="form-group" style="width:140px">\
                    <label for="selMode" style="display:block;color:#fafcfd">' + I18n.resource.modalConfig.option.LABEL_MODE + '</label>\
                    <select class="form-control" id="selMode" style="background-color:#f4f6f8;border:1px solid #465b85;color:#646464;width:inherit">\
                        <option value="fixed">' + I18n.resource.modalConfig.option.MODE_FIXED + '</option>\
                        <option value="recent">' + I18n.resource.modalConfig.option.MODE_RECENT + '</option>\
                    </select>\
                </div>\
                <div class="form-group" style="width:120px">\
                    <label for="selInterval" style="display:block;color:#fafcfd">' + I18n.resource.modalConfig.option.LABEL_INTERVAL + '</label>\
                    <select class="form-control" id="selInterval" style="background-color:#f4f6f8;border:1px solid #465b85;color:#646464;width:inherit">\
                        <option value="m1">' + I18n.resource.modalConfig.option.INTERVAL_MIN1 + '</option>\
                        <option value="m5">' + I18n.resource.modalConfig.option.INTERVAL_MIN5 + '</option>\
                        <option value="h1">' + I18n.resource.modalConfig.option.INTERVAL_HOUR1 + '</option>\
                        <option value="d1">' + I18n.resource.modalConfig.option.INTERVAL_DAY1 + '</option>\
                        <option value="M1">' + I18n.resource.modalConfig.option.INTERVAL_MON1 + '</option>\
                    </select>\
                </div>\
                <div class="form-group" id="divTmRange" style="width:380px">\
                    <label for="divRange" style="display:block;color:#fafcfd">' + I18n.resource.modalConfig.option.LABEL_TIME_RANGE + '</label>\
                    <div id="divRange" style="display:inline">\
                        <input class="form-control" type="text" id="tmStart" style="width:165px;cursor:pointer;text-align:center" readonly>\
                        <span class="input-group-addon" style="display: inline;padding-top:6px;padding-bottom:7px;text-align:center;border:1px solid rgb(39, 51, 75);color:#646464;margin-right:-6px;background-color:#f4f6f8;">' + I18n.resource.modalConfig.option.TIP_RANGE_TO + '</span>\
                        <input class="form-control" type="text" id="tmEnd" style="width:165px;cursor:pointer;text-align:center" readonly>\
                    </div>\
                </div>\
                <div class="form-group" id="divTmLast" style="width:340px;display:none">\
                    <label for="divLast" style="display:block;color:#fafcfd">' + I18n.resource.modalConfig.option.LABEL_PERIOD + '</label>\
                    <div id="divLast">\
                        <input class="form-control" type="text" id="inputPeriodValue" style="width:165px;background-color:#f4f6f8;border:1px solid #27334b;border-radius:0.5em 0 0 0.5em;margin-right:-5px;color:#646464">\
                        <select class="form-control" id="selPeriodUnit" style="width:165px;background-color:#f4f6f8;border:1px solid #27334b;border-radius:0 0.5em 0.5em 0;color:#646464">\
                            <option value="hour">' + I18n.resource.modalConfig.option.PERIOD_UNIT_HOUR + '</option>\
                            <option value="day">' + I18n.resource.modalConfig.option.PERIOD_UNIT_DAY + '</option>\
                            <option value="month">' + I18n.resource.modalConfig.option.PERIOD_UNIT_MON + '</option>\
                        </select>\
                    </div>\
                </div>\
                <button class="btn" type="button" id="btnOk" modalId="' + _this.modalId + '" style="width:70px;vertical-align:bottom;color:#f4f6f8;background-color:#288add;">' + I18n.resource.observer.widgets.YES + '</button>\
            </form>\
        ');

        var $selMode = $divDst.find('#selMode');
        var $selInter = $divDst.find('#selInterval');
        var $divTmRange = $divDst.find('#divTmRange');
        var $divTmLast = $divDst.find('#divTmLast');
        $selMode.change(function (e) {
            var $opt = $selInter.children('option');
            var flag = $(e.currentTarget).val();
            switch(flag) {
                case 'fixed':
                    $opt.eq(0).css('display', 'block');
                    $opt.eq(1).css('display', 'block');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'block');
                    $divTmRange.css('display', 'inline-block');//
                    $divTmLast.css('display', 'none');
                    break;
                case 'recent':
                    $opt.eq(0).css('display', 'block');
                    $opt.eq(1).css('display', 'block');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'none');
                    $divTmRange.css('display', 'none');
                    $divTmLast.css('display', 'inline-block');//
                    break;
                default:
                    break;
            }
        });

        var tmNow = new Date();
        var tmStart = new Date();
        tmStart.setFullYear(tmNow.getFullYear() - 10);
        var $inputStart = $divDst.find('#tmStart');
        $inputStart.val(tmNow.format('yyyy-MM-dd HH:mm:00'));
        $inputStart.css('background-color', '#f4f6f8');
        $inputStart.css('border', '1px solid #27334b');
        $inputStart.css('color', '#646464');
        $inputStart.css('border-radius', '0.5em 0 0 0.5em');
        $inputStart.css('margin-right', '-5px');
        $inputStart.datetimepicker({
            format: 'yyyy-mm-dd hh:mm:00',
            startView: 'month',
            minView: 'hour',
            autoclose: true,
            todayBtn: false,
            pickerPosition: 'top-right',
            initialDate: tmNow,
            startDate: tmStart,
            endDate: tmNow,
            keyboardNavigation: false
        }).off('changeDate').on('changeDate',function(ev){
        });
        var $inputEnd = $divDst.find('#tmEnd');
        $inputEnd.val(tmNow.format('yyyy-MM-dd HH:mm:00'));
        $inputEnd.css('background-color', '#f4f6f8');
        $inputEnd.css('border', '1px solid #27334b');
        $inputEnd.css('color', '#646464');
        $inputEnd.css('border-radius', '0 0.5em 0.5em 0');
        $inputEnd.datetimepicker({
            format: 'yyyy-mm-dd hh:mm:00',
            startView: 'month',
            minView: 'hour',
            autoclose: true,
            todayBtn: false,
            pickerPosition: 'top-right',
            initialDate: tmNow,
            startDate: tmStart,
            endDate: tmNow,
            keyboardNavigation: false
        }).off('changeDate').on('changeDate',function(ev){
        });

        var $inputPerVal = $divDst.find('#inputPeriodValue');
        var $selPerUnit = $divDst.find('#selPeriodUnit');
        var $btnOk = $divDst.find('#btnOk');
        $btnOk.off().click(function (e) {
            var tmMode = $selMode.val();
            var strStart, strEnd;
            if ('fixed' == tmMode) {
                strStart = $inputStart.val();
                strEnd = $inputEnd.val();
            }
            else if ('recent' == tmMode) {
                var tmStart = new Date();
                var periodVal = parseInt($inputPerVal.val());
                if (!periodVal) {
                    alert('Please input time !');
                    return;
                }
                var periodUnit = $selPerUnit.val();
                switch (periodUnit) {
                    case 'hour':
                        var time = tmNow.getTime() - 3600000 * periodVal;
                        tmStart.setTime(time);
                        break;
                    case 'day':
                        var time = tmNow.getTime() - 86400000 * periodVal;
                        tmStart.setTime(time);
                        break;
                    case 'month':
                        var month = tmNow.getMonth();
                        if (0 == month) {
                            tmStart.setFullYear(tmNow.getFullYear() - 1);
                            tmStart.setMonth(11);
                        }
                        else {
                            tmStart.setMonth(month - 1);
                        }
                        break;
                    default :
                        break;
                }
                strStart = tmStart.format('yyyy-MM-dd HH:mm:00');
                strEnd = tmNow.format('yyyy-MM-dd HH:mm:00');
            }
            else {
                alert('Please select mode !');
                return;
            }

            var modalId = $(e.currentTarget).attr('modalId');
            if (modalId) {
                for (var i = 0; i < _this.arrModal.length; i++) {
                    var item = _this.arrModal[i];
                    if (item) {
                        if (modalId == item.id) {
                            if (!item.modal.option) {
                                item.modal.option = {};
                                item.modal.option.dictPtStatus = {};
                            }
                            item.modal.option.timeMode = tmMode;
                            item.modal.option.interval = $selInter.val();
                            item.modal.option.timeStart = strStart;
                            item.modal.option.timeEnd = strEnd;
                            item.modal.option.periodVal = periodVal;
                            item.modal.option.periodUnit = periodUnit;
                            if ('recent' == tmMode) {
                                item.interval = 1000;
                            }
                            else {
                                item.interval = null;
                            }
                            break;
                        }
                    }
                }
            }
            _this.screen.saveLayoutOnly();
            _this.drawCharts(item.modal.option, g_dictChart[modalId].chart, g_dictChart[modalId].contain);
        });

        if (_this.modal.option) {
            $selMode.val(_this.modal.option.timeMode);
            $selInter.val(_this.modal.option.interval);
            $inputStart.val(_this.modal.option.timeStart);
            $inputEnd.val(_this.modal.option.timeEnd);
            $inputPerVal.val(_this.modal.option.periodVal);
            $selPerUnit.val(_this.modal.option.periodUnit);
            if ('recent' == _this.modal.option.timeMode) {
                $selMode.change();
            }
        }
    }

    ModalInteract.prototype.setDataListColor = function (contain) {
        var dataListName;
        if (!contain) {
            dataListName = $('#dataList').find('.frontCtrl');
        }
        else {
            dataListName = $(contain).find('.frontCtrl');
        }
        if (dataListName) {
            for (var j = 0, len = dataListName.length; j < len; j++) {
                var $item = dataListName.eq(j);
                var id = $item.attr('pId');

                var $contain = $item.closest('.springContainer');
                var modalId;
                if ($contain) {
                    var temp = $contain.attr('id');
                    modalId = temp.split('_')[1];
                    for (var i = 0; i < _this.arrModal.length; i++) {
                        var item = _this.arrModal[i];
                        if (modalId == item.id) {
                            //item.modal.option.dictPtStatus[id].show = !item.modal.option.dictPtStatus[id].show;
                            var count = item.modal.option.dictPtStatus[id].count;
                            var bShow = item.modal.option.dictPtStatus[id].show;
                            var $spanDsName = $item.find('.interactSpanDsName');
                            if ($spanDsName) {
                                if (bShow) {
                                    $spanDsName.css('color', _this.arrColor[count]);
                                }
                                else {
                                    $spanDsName.css('color', '');
                                }
                            }
                            //$item.attr('class', 'form-control frontCtrl interactDsFrame');
                            break;
                        }
                    }
                }
            }
        }
    }

    ModalInteract.prototype.setToolTips = function (target, customName, projectName, pointName, pointDesc) {
        var show = new StringBuilder();
        show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px">');
        show.append('    <div class="tooltipContent interactTipsBackground">');
        show.append('        <p class="customName interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.CUSTOM_NAME).append('</span>: ').append(customName).append('</p>');
        show.append('        <p class="projectName interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.PROJECT_NAME).append('</span>: ').append(projectName).append('</p> ');
        show.append('        <p class="pointName interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.POINT_NAME).append('</span>: ').append(pointName).append('</p> ');
        show.append('        <p class="pointDesc interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.POINT_DESC).append('</span>: ').append(pointDesc).append('</p> ');
        show.append('    </div>');
        show.append('    <div class="tooltip-arrow"></div>');
        show.append('</div>');
        var options = {
            placement: 'left',
            title: _this.m_lang.PARAM,
            template: show.toString()
        };
        target.tooltip(options);
    }

    ModalInteract.prototype.setFormulaToolTips = function (target, customName, formula, desc) {
        var show = new StringBuilder();
        show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:400px;">');
        show.append('    <div class="tooltipContent interactTipsBackground">');
        show.append('        <p class="customName interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.CUSTOM_NAME).append('</span>: ').append(customName).append('</p>');
        show.append('        <p class="formula interactTipsStyle" style="word-break:normal;"><span class="interactTipsTitleStyle">').append(_this.m_lang.FORMULA_NAME).append('</span>: ').append('</p>');
        show.append('        <p class="pointDesc interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.POINT_DESC).append('</span>: ').append(desc).append('</p>');
        show.append('    </div>');
        show.append('    <div class="tooltip-arrow"></div>');
        show.append('</div>');

        var showFormula = $('<span>' + formula + '</span>');
        var showObj = $(show.toString());
        showFormula.appendTo(showObj.find('.formula')).mathquill();

        var options = {
            placement: 'left',
            title: _this.m_lang.PARAM,
            template: showObj
        };
        target.tooltip(options);
    }

    ModalInteract.prototype.getProjectNameFromId = function (id, langFlag) {
       var name;
       var len = AppConfig.projectList.length;
       var item;
       for (var i = 0; i < len; i++) {
           item = AppConfig.projectList[i];
           if (id == item.id) {
               if (0 == langFlag) {
                   name = item.name_cn;
               }
               else {
                   name = item.name_en;
               }
               break;
           }
       }

       return name;
    }

    ModalInteract.prototype.configModal = new ModalInteractConfig();

    return ModalInteract;
})();
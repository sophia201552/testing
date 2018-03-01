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
        if (modal.points) {
            // clear first
            var grow = _this.$divDataGrid.children('.grow');
            if (grow) {
                grow.remove();
            }

            // insert second
            var dictPtStat = modal.option.dictPtStatus;
            if (dictPtStat) {
                var num = 1;
                for (var id in dictPtStat) {
                    this.insertItem(id, dictPtStat[id].unit, num);
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
            // num less equal than 20
            var item = _this.$divDataGrid.find('.divDsGridItem');
            var len = item.length;
            if (len >= 20) {
                return;
            }
            // check if repeat
            var bFind = false;
            for (var i = 0; i <len; i++) {
                if (dragItemId == item.eq(i).attr('dsid')) {
                    bFind = true;
                    break;
                }
            }
            if (bFind) {
                return;
            }
            _this.insertItem(dragItemId, '', len+1);
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
                var unitVal = item.find('input').val();
                modal.points.push(id);
                modal.option.dictPtStatus[id] = {show:false, count:i, unit:unitVal};
            }

            // close modal
            _this.$modal.modal('hide');
            e.preventDefault();
        });
    };

    ModalInteractConfig.prototype.insertItem = function(id, unit, num) {
        var name = AppConfig.datasource.getDSItemById(id).alias;
        var item = '<div class="col-lg-3 col-xs-4 divDsGrid">\
            <span class="divDsGridNum">' + num + '</span>\
            <span class="divDsGridItem grow" dsid="' + id + '">\
                <span class="contentDS" title="AverageLoad2">' + name + '</span>\
                <span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true"></span>\
                <input type="text" class="form-control dsUnit" value="' + unit + '">\
            </span></div>';
        _this.$divDataTip.before(item);

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
    };

    ModalInteractConfig.prototype.destroy = function () {
        this.detachEvents();
        this.$wrap.remove();
    };

    return ModalInteractConfig;
} (jQuery, window));


var ModalInteract = (function(){
    var _this;
    function ModalInteract(screen, entityParams) {
        _this = this;
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this._showConfig);
        this.modal = entityParams.modal;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.screen = screen;
        this.init();
        this.arrColor = echarts.config.color;
        this.timeFlag = undefined;
        this.spinner.spin(this.container);
    };
    ModalInteract.prototype = new ModalBase();
    ModalInteract.prototype.optionTemplate = {
        name:'toolBox.modal.INTERACT_CHART',
        parent:0,
        mode:'custom',
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
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
                        color: '#ccc'
                    }
                }
            }
        ]
    };

    ModalInteract.prototype.init = function() {
        var containWidth = $(this.container).width();
        var containHeight = $(this.container).height();
        var $divLeftPart = $('<div style="display:inline-block;height:100%"></div>');
        $divLeftPart.css('width', containWidth-220 + 'px');
        var $divChartCtrl = $('<div id="chartShow"></div>');
        $divChartCtrl.css('height', containHeight-100 + 'px');

        var $divTimeCtrl = $('<div style="height:100px;margin:20px 0 0 20px;"></div>');
        this.initInteractTime($divTimeCtrl);
        $divLeftPart.append($divChartCtrl);
        $divLeftPart.append($divTimeCtrl);

        var $divDataCtrl = $('<div id="dataList" style="display:inline-block;position:absolute;top:10px;right:0;width:220px;height:100%"><div class="form-group"></div></div>');
        if (this.modal.points && this.modal.option.dictPtStatus) {
            for (var id in this.modal.option.dictPtStatus) {
                var name = AppConfig.datasource.getDSItemById(id).alias;
                var unit = this.modal.option.dictPtStatus[id].unit;
                this.insertInteractData($divDataCtrl, id, name, unit);
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
        if ('recent' == _this.modal.option.timeMode) {
            var setInt = _this.modal.option.interval;
            var interval;
            if ('h1' == setInt) {
                interval = 3600000;
            }
            else if ('d1' == setInt) {
                interval = 86400000;
            }
            else {
                return;
            }

            var timeNow = (new Date()).getTime();
            if (!_this.timeFlag) {
                _this.timeFlag = timeNow;
            }
            else {
                if (timeNow - _this.timeFlag > interval) {
                    _this.timeFlag = timeNow;   // and update chart
                }
                else {
                    return;
                }
            }
            var newOption = _this.chart.getOption();
            var newSeries = newOption.series;
            for (var i = 0, len = e.length; i < len; i++) {
                var id = e[i].dsItemId;
                var name = AppConfig.datasource.getDSItemById(id).alias;
                var bFind = false;
                var j = 0;
                for (var len2 = newSeries.length; j < len2; j++) {
                    if (name == newSeries[j].name) {
                        bFind = true;
                        break;
                    }
                }
                if (bFind) {    // append new data
                    newSeries[j].data.push(e[i].data);
                }
            }
            var time = new Date();
            newOption.xAxis[0].data.push(time.format('yyyy-MM-dd HH:mm:00'));
            _this.chart.setOption(newOption);
        }

        // update data list
        var spanReal = $('#dataList').find('.frontCtrl');
        if (spanReal) {
            for (var j = 0, len2 = e.length; j < len2; j++) {
                var id = e[j].dsItemId;
                for (var k = 0, len3 = spanReal.length; k < len3; k++) {
                    if (id == spanReal.eq(k).attr('pId')) {
                        spanReal.eq(k).find('.spanRealVal').text(e[j].data);
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

    ModalInteract.prototype.drawCharts = function () {
        if (_this.modal.option) {
            // filter points
            var arrPoints = [];
            for (var itemId in _this.modal.option.dictPtStatus) {
                if (_this.modal.option.dictPtStatus[itemId].show) {
                    arrPoints.push(itemId);
                }
            }
            if (0 == arrPoints.length) {
                _this.chart.clear();
                _this.setDataListColor();
                return;
            }

            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: arrPoints,
                timeStart: _this.modal.option.timeStart,
                timeEnd: _this.modal.option.timeEnd,
                timeFormat: _this.modal.option.interval
            }).done(function (result) {
                if (result.timeShaft.length <= 0) {
                    return;
                }
                var arrName = [];
                var series = [];
                for (var i = 0, len = result.list.length; i < len; i++) {
                    var id = result.list[i].dsItemId;
                    var name = AppConfig.datasource.getDSItemById(id).alias;
                    arrName.push(name);
                    var count = _this.modal.option.dictPtStatus[id].count;
                    var color = _this.arrColor[count];
                    series.push({
                        name: name,
                        type: 'line',
                        data: result.list[i].data,
                        itemStyle: {
                            normal : {
                                color: color
                            }
                        }
                    });
                }
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
                                color: '#ccc'
                            }
                        }
                    }],
                    series : series
                }
                var drawOptions = {}
                jQuery.extend(drawOptions, ModalInteract.prototype.defaultOptions, options);
                _this.chart = echarts.init($(_this.container).find('#chartShow')[0]).setOption(drawOptions);

                _this.setDataListColor();
            });
        }
    }

    ModalInteract.prototype.insertInteractData = function ($divDst, ptId, ptName, ptUnit) {
        $divDst.append('\
            <form class="form-inline" style="margin-top: 3px;">\
                <span class="form-control frontCtrl" pId="' + ptId + '" style="cursor:pointer;width:160px;border-radius: 0.5em 0 0 0.5em;margin-right: -4px;border-right-width: 0;color: #ccc;border:1px solid #465b85;">\
                    <span style="display:inline-block;width:100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;vertical-align: bottom;">' + ptName + '</span>\
                    <span class="spanRealVal" style="display:inline-block;width:20px;"></span>\
                </span>\
              <input type="text" class="form-control" value="' + ptUnit + '" style="cursor:pointer;width:40px;border-radius: 0 0.5em 0.5em 0;background-color:#465b85;color: #ccc;border:1px solid #465b85;" readonly>\
            </form>\
        ');
        var $front = $divDst.find('.frontCtrl');
        $front.off().click(function (e) {
            if (_this.modal.option && _this.modal.option.dictPtStatus) {
                var $tar = $(e.currentTarget);
                var id = $tar.attr('pId');
                _this.modal.option.dictPtStatus[id].show = !_this.modal.option.dictPtStatus[id].show;
                _this.screen.saveLayoutOnly();
                _this.drawCharts();
            }
        })
    }

    ModalInteract.prototype.initInteractTime = function ($divDst) {
        $divDst.append('\
            <form class="form-inline" style="margin-top: 3px;">\
                <select class="form-control" id="selMode" style="background-color:#465b85;border:1px solid #465b85;color:#ccc">\
                    <option value="fixed">' + I18n.resource.modalConfig.option.MODE_FIXED + '</option>\
                    <option value="recent">' + I18n.resource.modalConfig.option.MODE_RECENT + '</option>\
                </select>\
                <select class="form-control" id="selInterval" style="background-color:#465b85;border:1px solid #465b85;color:#ccc">\
                    <option value="m1">' + I18n.resource.modalConfig.option.INTERVAL_MIN1 + '</option>\
                    <option value="m5">' + I18n.resource.modalConfig.option.INTERVAL_MIN5 + '</option>\
                    <option value="h1">' + I18n.resource.modalConfig.option.INTERVAL_HOUR1 + '</option>\
                    <option value="d1">' + I18n.resource.modalConfig.option.INTERVAL_DAY1 + '</option>\
                    <option value="M1">' + I18n.resource.modalConfig.option.INTERVAL_MON1 + '</option>\
                </select>\
                <div id="divTmRange" style="display:inline">\
                    <input class="form-control" type="text" id="tmStart" style="width:165px;cursor:pointer;text-align:center" readonly>\
                    <input class="form-control" type="text" id="tmEnd" style="width:165px;cursor:pointer;text-align:center" readonly>\
                </div>\
                <div id="divTmLast" style="display:none">\
                    <input class="form-control" type="text" id="inputPeriodValue" style="width:165px;background-color:#465b85;border:1px solid #27334b;color:#ccc;border-radius:0.5em 0 0 0.5em;margin-right:-5px">\
                    <select class="form-control" id="selPeriodUnit" style="width:165px;background-color:#465b85;border:1px solid #27334b;color:#ccc;border-radius:0 0.5em 0.5em 0">\
                        <option value="hour">' + I18n.resource.modalConfig.option.PERIOD_UNIT_HOUR + '</option>\
                        <option value="day">' + I18n.resource.modalConfig.option.PERIOD_UNIT_DAY + '</option>\
                        <option value="month">' + I18n.resource.modalConfig.option.PERIOD_UNIT_MON + '</option>\
                    </select>\
                </div>\
                <button class="btn btn-success" type="button" id="btnOk" style="width:70px">' + I18n.resource.observer.widgets.YES + '</button>\
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
                    $divTmRange.css('display', 'inline');
                    $divTmLast.css('display', 'none');
                    break;
                case 'recent':
                    $opt.eq(0).css('display', 'none');
                    $opt.eq(1).css('display', 'none');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'none');
                    $divTmRange.css('display', 'none');
                    $divTmLast.css('display', 'inline');
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
        $inputStart.css('background-color', '#465b85');
        $inputStart.css('border', '1px solid #27334b');
        $inputStart.css('color', '#ccc');
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
        $inputEnd.css('background-color', '#465b85');
        $inputEnd.css('border', '1px solid #27334b');
        $inputEnd.css('color', '#ccc');
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

            if (!_this.modal.option) {
                _this.modal.option = {};
                _this.modal.option.dictPtStatus = {};
            }
            _this.modal.option.timeMode = tmMode;
            _this.modal.option.interval = $selInter.val();
            _this.modal.option.timeStart = strStart;
            _this.modal.option.timeEnd = strEnd;
            _this.modal.option.periodVal = periodVal;
            _this.modal.option.periodUnit = periodUnit;
            if ('recent' == tmMode) {
                _this.modal.interval = 1000;
            }
            else {
                _this.modal.interval = null;
            }

            _this.screen.saveLayoutOnly();
            _this.drawCharts();
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

    ModalInteract.prototype.setDataListColor = function () {
        var dataListName = $('#dataList').find('.frontCtrl');
        var color;
        var defaultColor = '#27334b';
        if (dataListName) {
            for (var i = 0, len = dataListName.length; i < len; i++) {
                var id = dataListName.eq(i).attr('pId');
                var count = _this.modal.option.dictPtStatus[id].count;
                var bShow = _this.modal.option.dictPtStatus[id].show;
                color = bShow ? _this.arrColor[count] : defaultColor;
                dataListName.eq(i).css('background-color', color);
            }
        }
    }

    ModalInteract.prototype.configModal = new ModalInteractConfig();

    return ModalInteract;
})();
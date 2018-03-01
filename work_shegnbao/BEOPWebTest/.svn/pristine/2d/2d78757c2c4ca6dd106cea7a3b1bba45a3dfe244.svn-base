var ModalChartCustomConfig = (function ($, window, undefined) {

    function ModalChartCustomConfig(options) {
        ModalConfig.call(this, options);
        this.m_bIsRealTime = true;
        this.m_bIsHisFixCycle = true;
    }

    ModalChartCustomConfig.prototype = Object.create(ModalConfig.prototype);
    ModalChartCustomConfig.prototype.constructor = ModalChartCustomConfig;

    ModalChartCustomConfig.prototype.DEFAULTS = {
        htmlUrl: '/static/views/observer/widgets/modalChartCustom.html'
    };

    ModalChartCustomConfig.prototype.init = function () {
        var _this = this;
        _this.$btnSubmit = $('#btnSubmit', _this.$wrap);
        _this.$editor = $('#editor', _this.$wrap);
        _this.$selectMode = $('#inputMode', _this.$wrap);
        _this.$selRealInterval = $('#selRealInterval', _this.$wrap);
        _this.$tmStart = $('#timeStart', _this.$wrap);
        _this.$tmEnd = $('#timeEnd', _this.$wrap);
        _this.$tmGroup = $('#rangeSel', _this.$wrap);

        _this.$divRealtmCycle = $('#divRealTimeCycle', _this.$wrap);
        _this.$selectHisCycleMode = $('#hisCycleMode', _this.$wrap);
        _this.$selectHisInterval = $('#selHisInterval', _this.$wrap);
        _this.$divHisTmRange = $('#historyTmRange', _this.$wrap);
        _this.$divHisTmCycle = $('#historyTmCycle', _this.$wrap);
        _this.$inputPeriodVal = $('#inputPeriodValue', _this.$wrap);
        _this.$selPeriUnit = $('#inputPeriodUnit', _this.$wrap);

        var modal = _this.options.modalIns.entity.modal;

        EventAdapter.on($(_this.$editor[0]), 'drop', function(e) {
            e.preventDefault();
            this.focus();
            var itemId = EventAdapter.getData().dsItemId;
            if (Boolean(itemId)) {
                var itemName = AppConfig.datasource.getDSItemById(itemId).alias;
                var spanCtl = $('<span id="' + itemId + '" title="' + itemName + '" class="pointValue"></span>');
                spanCtl.text('"<%' + itemName + '%>"');

                var sel, range;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();

                        var insertDiv = $('<div>');
                        insertDiv.append('&nbsp;');
                        insertDiv.append(spanCtl);
                        insertDiv.append('&nbsp;');
                        var el = insertDiv[0];
                        var frag = document.createDocumentFragment(), node, lastNode;
                        while ((node = el.firstChild)) {
                            lastNode = frag.appendChild(node);
                        }
                        range.insertNode(frag);
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                }
                _this.$editor.append('&nbsp;');
            }
        });
        EventAdapter.on($(_this.$editor[0]), 'dragover', function (e) {
            e.preventDefault();
        });

        if (Boolean(modal.option)) {
            if (!modal.option.isRealTime) {
                _this.m_bIsRealTime = false;
                _this.$selectMode.val('history');
                _this.$tmGroup.css('display', 'block');
                _this.$divRealtmCycle.css('display', 'none');
            }
            else {
                _this.m_bIsRealTime = true;
                _this.$selectMode.val('realTime');
                _this.$tmGroup.css('display', 'none');
                _this.$divRealtmCycle.css('display', 'block');
            }

            if (!modal.option.isHisFixCycle) {
                _this.m_bIsHisFixCycle = false;
                _this.$selectHisCycleMode.val('recent');
                _this.$divHisTmRange.css('display', 'none');
                _this.$divHisTmCycle.css('display', 'block');
            }
            else {
                _this.m_bIsHisFixCycle = true;
                _this.$selectHisCycleMode.val('fixed');
                _this.$divHisTmRange.css('display', 'block');
                _this.$divHisTmCycle.css('display', 'none');
            }

            switch (modal.interval) {
                case 'm1':
                case 'm5':
                case 'h1':
                case 'd1':
                case 'M1':
                    _this.$selRealInterval.val(modal.interval);
                    _this.$selectHisInterval.val(modal.interval);
                    break;
                default :
                    _this.$selRealInterval.val('h1');
                    _this.$selectHisInterval.val('h1');
                    break;
            }

            _this.$tmStart.val(modal.option.timeStart);
            _this.$tmEnd.val(modal.option.timeEnd);
            _this.$inputPeriodVal.val(modal.option.timeCycleValue);
            if (!modal.option.timeCycleUnit) {
                _this.$selPeriUnit.val(modal.option.timeCycleUnit);
            }
            else {
                _this.$selPeriUnit.val('hour');
            }
        }
        else {
            _this.$selectMode.val('realTime');
            _this.$tmGroup.css('display', 'none');
        }
        _this.$selectMode.change(function (e) {
            var flag = $(e.currentTarget).val();
            if ('history' == flag) {
                _this.$tmGroup.css('display', 'block');
                _this.m_bIsRealTime = false;
                _this.$divRealtmCycle.css('display', 'none');
            }
            else {
                _this.m_bIsRealTime = true;
                _this.$tmGroup.css('display', 'none');
                _this.$divRealtmCycle.css('display', 'block');
            }
        });
        _this.$selectHisCycleMode.change(function (e) {
            var $opt = _this.$selectHisInterval.children('option');
            var flag = $(e.currentTarget).val();
            if ('fixed' == flag) {  // fixed cycle
                _this.m_bIsHisFixCycle = true;
                $opt.eq(0).css('display', 'block');
                $opt.eq(1).css('display', 'block');
                $opt.eq(2).css('display', 'block');
                $opt.eq(3).css('display', 'block');
                $opt.eq(4).css('display', 'block');
                _this.$divHisTmRange.css('display', 'block');
                _this.$divHisTmCycle.css('display', 'none');
            }
            else {  // recent cycle
                _this.m_bIsHisFixCycle = false;
                _this.$selPeriUnit.change();
                _this.$divHisTmRange.css('display', 'none');
                _this.$divHisTmCycle.css('display', 'block');
            }
        });
        _this.$selPeriUnit.change(function (e) {
            var $opt = _this.$selectHisInterval.children('option');
            $opt.eq(0).css('display', 'none');
            var flag = $(e.currentTarget).val();
            switch (flag) {
                case 'hour':
                    $opt.eq(1).css('display', 'block');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'none');
                    $opt.eq(4).css('display', 'none');
                    _this.$selectHisInterval.val('m5');
                    break;
                case 'day':
                    $opt.eq(1).css('display', 'none');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'none');
                    _this.$selectHisInterval.val('h1');
                    break;
                case 'month':
                    $opt.eq(1).css('display', 'none');
                    $opt.eq(2).css('display', 'none');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'block');
                    _this.$selectHisInterval.val('d1');
                    break;
                default :
                    break;
            }
        });
        if (!_this.m_bIsHisFixCycle) {
            _this.$selPeriUnit.change();
        }

        $(".form_datetime").datetimepicker({
            format: "yyyy-mm-dd HH:mm:ss",
            minView: "hour",
            autoclose: true,
            todayBtn: false,
            pickerPosition: "bottom-right",
            initialDate: new Date()
        }).off('changeDate').on('changeDate',function(ev){
            var selectTime = (ev.date.valueOf().toDate().toUTCString().replace(' GMT', '')).toDate().getTime();
            var time = selectTime- selectTime%(5*60*1000).toDate().format('yyyy-MM-dd HH:mm:ss');
            $('#tabFrames .td-frame[title="'+ time +'"]').click();
        });

        _this.attachEvents();
        I18n.fillArea($('#modalCustom'));
    };

    ModalChartCustomConfig.prototype.recoverForm = function (modal) {
        if (Boolean(modal.modalText)) {
            this.$editor.html(modal.modalText);
        }
    };

    ModalChartCustomConfig.prototype.reset = function () {
    };

    ModalChartCustomConfig.prototype.attachEvents = function () {
        var _this = this;

        _this.$btnSubmit.off().click( function (e) {
            var modal = _this.options.modalIns.entity.modal;

            var customOption = $('#modalCustom').find('#editor');
            modal.modalText = customOption.html();
            modal.modalTextUrl = customOption.text();
            modal.option = new Object();
            modal.option.list = [];
            modal.points = [];
            var arraySpan = customOption.find('.pointValue');
            for (var i = 0, len = arraySpan.length; i < len; i++) {
                modal.option.list.push({dsItemId:arraySpan[i].id, name:arraySpan[i].title, data:0});
                modal.points.push(arraySpan[i].id);
            }
            modal.interval = _this.m_bIsRealTime ? _this.$selRealInterval.val() : _this.$selectHisInterval.val();
            modal.option.isRealTime = _this.m_bIsRealTime;
            modal.option.isHisFixCycle = _this.m_bIsHisFixCycle;
            if (_this.m_bIsHisFixCycle) {
                modal.option.timeStart = _this.$tmStart.val();
                modal.option.timeEnd = _this.$tmEnd.val();
            }
            else {
                var tmStart = new Date();
                var tmEnd = new Date();
                var periodVal = parseInt(_this.$inputPeriodVal.val());
                var periodUnit = _this.$selPeriUnit.val();
                switch (periodUnit) {
                    case 'hour':
                        var time = tmEnd.getTime() - 3600000 * periodVal;
                        tmStart.setTime(time);
                        break;
                    case 'day':
                        var time = tmEnd.getTime() - 86400000 * periodVal;
                        tmStart.setTime(time);
                        break;
                    case 'month':
                        var month = tmEnd.getMonth();
                        if (0 == month) {
                            tmStart.setFullYear(tmEnd.getFullYear() - 1);
                            tmStart.setMonth(11);
                        }
                        else {
                            tmStart.setMonth(month - 1);
                        }
                        break;
                    default :
                        break;
                }
                modal.option.timeStart = tmStart.format('yyyy-MM-dd HH:mm:ss');
                modal.option.timeEnd = tmEnd.format('yyyy-MM-dd HH:mm:ss');
                modal.option.timeCycleValue = _this.$inputPeriodVal.val();
                modal.option.timeCycleUnit = _this.$selPeriUnit.val();
            }

            // close modal
            _this.$modal.modal('hide');
            e.preventDefault();
        } );
    };

    return ModalChartCustomConfig;
} (jQuery, window));


var ModalChartCustom = (function(){
    function ModalChartCustom(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this._showConfig);
        this.modal = entityParams.modal;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.spinner.spin(this.container);
    };
    ModalChartCustom.prototype = new ModalBase();
    ModalChartCustom.prototype.optionTemplate = {
        name:'toolBox.modal.CUSTOM_CHART',
        parent:0,
        mode:'custom',
        maxNum:10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalChartCustom'
    };

    ModalChartCustom.prototype.show = function() {
        this.init();
    }

    ModalChartCustom.prototype.init = function() {
    }

    ModalChartCustom.prototype.renderModal = function (e) {
        var _this = this;
        var optList = _this.modal.option.list;
        if (!optList) {
            _this.spinner.stop();
            return;
        }
        var len = optList.length;
        if (len > 0) {
            if (_this.modal.option.isRealTime) {
                var postData = {'dataSourceId': 0, 'dsItemIds': _this.modal.points};
                WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData).done(function (res) {
                    var data = res.dsItemList;
                    if (!data) {
                        return;
                    }
                    if (data.length > 0) {
                        for (var i = 0, len = data.length; i < len; i++) {
                            for (var j = 0, len2 = optList.length; j < len2; j++) {
                                if (optList[j].dsItemId == data[i].dsItemId) {
                                    optList[j].data = parseFloat(parseFloat(data[i].data).toFixed(2));
                                    break;
                                }
                            }
                        }
                        _this.updateModal(data);
                    }
                }).always(function (e) {
                    _this.spinner.stop();
                });
            }
            else {
                WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                    dsItemIds: _this.modal.points,
                    timeStart: _this.modal.option.timeStart,
                    timeEnd: _this.modal.option.timeEnd,
                    timeFormat: 'm5'
                }).done(function (dataSrc) {
                    if (!dataSrc || dataSrc.timeShaft.length <= 0) {
                        return;
                    }
                    _this.updateHistoryChart(dataSrc.list, dataSrc.timeShaft);
                }).error(function (e) {
                }).always(function (e) {
                    _this.spinner.stop();
                });
            }
        }
        else {
            try {
                var showOption = eval('({' + _this.modal.modalTextUrl + '})');
                _this.drawChart(showOption);
                _this.spinner.stop();
            }
            catch (e) {
                _this.spinner.stop();
                return;
            }
        }
    }

    ModalChartCustom.prototype.updateModal = function (src) {
        if (this.modal.option.isRealTime) {
            this.updateRealTimeChart(src);
        }
    }
    ModalChartCustom.prototype.showConfigModal = function () {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    }
    ModalChartCustom.prototype._showConfig = function () {
    }
    ModalChartCustom.prototype.setModalOption = function (option) {
    }
    ModalChartCustom.prototype.drawChart = function (chartOption) {
        this.chart.setOption(chartOption);
    }
    ModalChartCustom.prototype.close = function () {
    }
    ModalChartCustom.prototype.updateRealTimeChart = function (src) {
        var _this = this;
        if (!src) {
            return;
        }
        if (src.length > 0) {
            var optList = _this.modal.option.list;
            for (var m= 0, lenM=optList.length; m<lenM; m++) {
                for (var n= 0, lenN=src.length; n<lenN; n++) {
                    if (optList[m].dsItemId == src[n].dsItemId) {
                        optList[m].data = src[n].data;
                        break;
                    }
                }
            }

            var showOption = _this.modal.modalTextUrl;
            var arr = showOption.split('<%');
            for (var j = 1, len2 = arr.length; j < len2; j++) {
                var name = arr[j].split('%>')[0];
                if ('' == name) {
                    continue;
                }
                var data = -1;
                for (var k = 0, len3 = optList.length; k < len3; k++) {
                    if (optList[k].name == name) {
                        data = optList[k].data;
                        break;
                    }
                }
                if (-1 != data && Boolean(data)) {
                    if ('object' == typeof(data)) {
                        var temp;
                        for (var p= 0, lenP=data.length; p<lenP; p++) {
                            temp += data[p] + ',';
                        }
                        showOption = showOption.replace(name, temp);
                    }
                    else {
                        showOption = showOption.replace(name, data);
                    }
                }
            }
            showOption = showOption.replace(/"<%/g, '');
            showOption = showOption.replace(/%>"/g, '');
            try {
                showOption = eval('({' + showOption + '})');
                _this.drawChart(showOption);
            }
            catch (e) {
                _this.spinner.stop();
                return;
            }
        }
    }
    ModalChartCustom.prototype.updateHistoryChart = function (list, timeShaft) {
        var _this = this;
        if (!list) {
            return;
        }
        if (list.length > 0) {
            var infoList = [];

            var arrId = [];
            for (var i= 0, len=list.length; i<len; i++) {
                arrId.push(list[i].dsItemId);
            }
            var arrItem = AppConfig.datasource.getDSItemById(arrId);
            for (var i= 0, len=list.length; i<len; i++) {
                var id = list[i].dsItemId;
                for (var m = 0; m < arrItem.length; m++) {
                    if (id == arrItem[m].id) {
                        var itemName = arrItem[m].alias;
                        var item = {id:id, name:itemName, data:list[i].data};
                        infoList.push(item);
                        break;
                    }
                }
            }
            //for (var i= 0, len=list.length; i<len; i++) {
            //    var itemId = list[i].dsItemId;
            //    var itemName = AppConfig.datasource.getDSItemById(itemId).alias;
            //    var item = {id:itemId, name:itemName, data:list[i].data};
            //    infoList.push(item);
            //}

            var showOption = _this.modal.modalTextUrl;
            var arr = showOption.split('<%');
            for (var j = 1, len2 = arr.length; j < len2; j++) {
                var name = arr[j].split('%>')[0];
                if ('' == name) {
                    continue;
                }
                var data;
                for (var k = 0, len3 = infoList.length; k < len3; k++) {
                    if (infoList[k].name == name) {
                        data = infoList[k].data;
                        break;
                    }
                }
                if (Boolean(data)) {
                    if ('object' == typeof(data)) {
                        var temp = '';
                        for (var p= 0, lenP=data.length-1; p<lenP; p++) {
                            temp += data[p] + ',';
                        }
                        temp += data[lenP - 1];
                        showOption = showOption.replace(name, temp);
                    }
                    else {
                        showOption = showOption.replace(name, data);
                    }
                }
            }
            showOption = showOption.replace(/"<%/g, '');
            showOption = showOption.replace(/%>"/g, '');
            try {
                showOption = eval('({' + showOption + '})');
                if (!showOption.xAxis || 0 == showOption.xAxis.length) {
                    var arrAxis = [{
                        type : 'category',
                        boundaryGap : false,
                        data : timeShaft
                    }];
                    showOption.xAxis = arrAxis;
                }
                else if (!showOption.xAxis[0].data || 0 == showOption.xAxis[0].data.length) {
                    showOption.xAxis[0].data = timeShaft;
                }
                _this.drawChart(showOption);
            }
            catch (e) {
                _this.spinner.stop();
                return;
            }
        }
    }

    ModalChartCustom.prototype.configModal = new ModalChartCustomConfig();

    return ModalChartCustom;
})();
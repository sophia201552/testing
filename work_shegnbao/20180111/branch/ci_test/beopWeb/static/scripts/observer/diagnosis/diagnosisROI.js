var DiagnosisROI = (function() {
    function DiagnosisROI(option) {
        this.parent = option.parent;
        this.table = undefined;
        this.powerPrice = 0; //默认电费单价
        this.selCycle = 'year'; //默认周期为年
        this.faultName = '';
        this.filter = option.filter; //过滤条件
        this.ROIQulatyData = undefined; //ROI查询数据
        this.dragText = undefined;
        this.dragIndex = undefined;
        this.powerPriceModify = [];
        if (option && option.filter && option.filter.length > 0) {
            for (let i of option.filter) {
                if (i.type = 'fault') {
                    this.faultName = i.value;
                    break;
                }
            }
        }
    }
    DiagnosisROI.prototype = {
        init: function() {
            var now = new Date();
            var endTime = new Date();
            this.container = $('div.ROI')[0];
            $('.ROI').show().siblings(':not(.ROI)').hide();
            this.table = $('#tbodyROI')[0];
            //初始化时间输入框
            //开始时间为月初,如2017-03-01 00:00 结束为当前时间精确到5分钟 16:25 16:30
            now.setDate(1);
            endTime.setMinutes(endTime.getMinutes() - endTime.getMinutes() % 5);
            $('#startTimeCog', this.container).val(now.timeFormat(timeFormatChange('yyyy-mm-dd')) + ' 00:00');
            $('#endTimeCog', this.container).val(endTime.timeFormat(timeFormatChange('yyyy-mm-dd hh:ii')));
            //国际化
            I18n.fillArea($(this.container));
            //货币单位替换
            $('.thKWh', this.container).text($('.thKWh', this.container).text().replace(/{m}/g, AppConfig.unit_currency));
            $('.thHrPrice', this.container).text($('.thHrPrice', this.container).text().replace(/{m}/g, AppConfig.unit_currency));
            $('.thLaborCost', this.container).text($('.thLaborCost', this.container).text().replace(/{m}/g, AppConfig.unit_currency));
            $('.thSaveMoney', this.container).text($('.thSaveMoney', this.container).text().replace(/{m}/g, AppConfig.unit_currency));
            this.getElectricPrice();
            this.attachEvent();
        },

        show: function() {
            var _this = this;
            if ($('div.ROI').length > 0) {
                this.init();
            } else {
                WebAPI.get('/static/views/observer/diagnosis/diagnosisROI.html').done(function(rsHtml) {
                    $('.modal-dialog', _this.parent).append(rsHtml);
                    _this.init();
                });
            }
        },

        close: function() {
            $('.ROI').hide().siblings(':not(.ROI)').show();
            $('.ROI').remove();
        },

        getElectricPrice: function() {
            var _this = this;
            var promise = $.Deferred();
            Spinner.spin(this.table);
            promise = WebAPI.post('/iot/search', { "parent": [], "projId": [AppConfig.projectId] }).done(function(result) { //AppConfig.projectId
                _this._id = result.projects[0]._id;
            });
            promise.then(function() {
                WebAPI.get('/benchmark/config/get/' + _this._id).done(function(result) {
                    // 计算平均电价
                    _this.powerPrice = 0;
                    if (!result || !result.cost || result.cost.length === 0) {
                        alert('Please config electricity price first!');
                        Spinner.stop();
                        return;
                    }
                    for (var i = 0, l = result.cost.length, cost, weight; i < l; i++) {
                        cost = Number(result.cost[i].cost);
                        weight = result.cost[i].weight ? Number(result.cost[i].weight) : 1;
                        if (!isNaN(cost) && !isNaN(weight)) {
                            _this.powerPrice += (cost * weight);
                        }
                    }
                    _this.powerPrice = Number((_this.powerPrice/result.cost.length).toFixed(3));
                    _this.getData();


                });
            });
        },

        attachEvent: function() {
            var _this = this;
            //初始化日历
            var timeFormatStr = timeFormatChange('yyyy-mm-dd hh:ii');
            $('.timeSelectBox input.form-control', this.container).datetimepicker({
                autoclose: true,
                minView: 'hour',
                format: timeFormatStr
            });

            //编辑
            $('#btnEdit', this.container).off('click').on('click', function(e) {
                var $btn = $(e.target);
                $btn.toggleClass('mdEdit');
                if ($btn.hasClass('mdEdit')) {
                    $btn.text(i18n_resource.diagnosis.diagnosisROI.SAVE);
                    $('.mdshow', _this.table).addClass('hidden');
                    $('.mdEdit', _this.table).removeClass('hidden');
                    $('.btnPainter', _this.container).show();
                } else {
                    $btn.text(i18n_resource.diagnosis.diagnosisROI.EDIT);
                    $('.mdshow', _this.table).removeClass('hidden');
                    $('.mdEdit', _this.table).addClass('hidden');
                    $('.btnPainter', _this.container).hide();
                    //当没有格式刷按钮时不能拖拽
                    var $dragActive = $('.dragActive');
                    $dragActive.find('.contentModify').attr('draggable', false);
                    $dragActive.removeClass('dragActive');
                    _this.saveData();
                }
            });

            //查询
            $('#btnQuery', this.container).off('click').on('click', function(e) {
                _this.getData();
            });

            //编辑单元输入事件
            $(this.table).on('focus', '[contenteditable]', function() {
                var $this = $(this);
                if ($this.html().indexOf('--') > -1) {
                    $this.data('before', '');
                    $this.text('');
                }
            }).on('blur keyup paste input', '[contenteditable]', function(e) {
                var $this = $(e.target);
                var val = $this.html();
                var hrPrice = Number($this.parent().siblings('.hrPrice').find('.mdshow').text()),
                    hr = Number($this.parent().siblings('.hr').find('.mdshow').text()),
                    laborCost = Number($this.parent().siblings('.laborCost').find('.mdshow').text()),
                    ROI = '--',
                    tr = $this.closest('tr')[0];
                var runtime = Number(tr.dataset['runtimeyear']),
                    energy = Number(tr.dataset['energy']),
                    factor = Number(tr.dataset['factor']);
                var saveMoney = runtime * energy * factor * _this.powerPrice;
                if ($this.data('before') !== val) {
                    $this.data('before', val);
                    $this.prev().text(val);
                    $this.trigger('change');
                }

                if ($this.parent().hasClass('hrPrice') || $this.parent().hasClass('hr')) {
                    if ($this.parent().hasClass('hrPrice')) {
                        hrPrice = val;
                        hr = $this.parent().next().find('.mdEdit').text();
                    } else if ($this.parent().hasClass('hr')) {
                        hr = val;
                        hrPrice = $this.parent().prev().find('.mdEdit').text();
                    }
                    hrPrice = Number(hrPrice);
                    hr = Number(hr);
                    if (!isNaN(hrPrice) && !isNaN(hr)) {
                        laborCost = hrPrice * hr;
                        $this.parent().siblings('.laborCost').find('.mdshow, .mdEdit').text(laborCost);
                    }
                } else if ($this.parent().hasClass('laborCost')) {
                    laborCost = Number(val);
                }

                ROI = _this.calculateROI(saveMoney, laborCost, hrPrice, hr);
                $this.parent().siblings('.tdROI').text(ROI);
            });

            //存储数据方法
            function saveEditData($dom,thisObj,isInput){
                var $this = $dom;
                var thisObj = thisObj;
                var isLaborCost = false;
                var $parent,thisHtml;
                if(isInput){
                    thisHtml = $this.find('.mdEdit').text();
                    $parent = $this;
                }else{
                    thisHtml = $this.text();
                    $parent = $this.parent();
                }
                var val ;//= Number($this.html()) || Number($this.html()) == 0 ? Number($this.html()) : 'NULL';
                if(thisHtml.trim()==''){
                    val = '--'
                }else{
                    val = Number(thisHtml) || Number(thisHtml) == 0 ? Number(thisHtml) : 'NULL';
                }
                var hrPrice = Number($parent.siblings('.hrPrice').find('.mdshow').text()),
                    hr = Number($parent.siblings('.hr').find('.mdshow').text()),
                    laborCost = Number($parent.siblings('.laborCost').find('.mdshow').text()),
                    powerPrice = Number($parent.siblings('.tdPowerPrice').find('.mdshow').text()),
                    ROI = '--',
                    tr = $this.closest('tr')[0];
                var runtime = Number(tr.dataset['runtimeyear']),
                    energy = Number(tr.dataset['energy']),
                    factor = Number(tr.dataset['factor']);
                var saveMoney = runtime * energy * factor * thisObj.powerPrice;
                var trId = tr.id.split('_')[1];
                var name = $parent.siblings('.faultName').text();
                var powerPriceObj = {};
                powerPriceObj['faultId'] = trId;
                powerPriceObj['faultName'] = name;
                if(isInput){
                    $this.find('.mdEdit').text(val);
                    $this.find('.mdshow').text(val);
                }else{
                    if ($this.data('before') !== val) {
                        $this.data('before', val);
                        $this.prev().text(val);
                        $this.trigger('change');
                    }
                }

                if ($parent.hasClass('hrPrice') || $parent.hasClass('hr')) {
                    if ($parent.hasClass('hrPrice')) {
                        hrPrice = val;
                        hr = $parent.next().find('.mdEdit').text();
                    } else if ($parent.hasClass('hr')) {
                        hr = val;
                        hrPrice = $parent.prev().find('.mdEdit').text();
                    }
                    hrPrice = Number(hrPrice);
                    hr = Number(hr);
                    if (!isNaN(hrPrice) && !isNaN(hr)) {
                        laborCost = hrPrice * hr;
                        $parent.siblings('.laborCost').find('.mdshow, .mdEdit').text(laborCost);
                    }
                } else if ($parent.hasClass('laborCost')) {
                    isLaborCost = true;
                    laborCost = Number(val);
                } else if ($parent.hasClass('tdPowerPrice')) {
                    saveMoney = runtime * energy * factor * Number(val);
                    saveMoney = saveMoney ? saveMoney.toFixed(2) : '--';
                    $parent.siblings('.saveMoney').text(saveMoney);
                    powerPrice = Number(val);
                }

                hrPrice = hrPrice || hrPrice == 0 ? hrPrice : 'Null';
                hr = hr || hr == 0 ? hr : 'Null';
                powerPrice = powerPrice || powerPrice == 0 ? powerPrice : 'Null';
                ROI = saveMoney == '--' ? '--' : thisObj.calculateROI(saveMoney, laborCost, hrPrice, hr);
                //保存时以手动修改的数据为主
                if (!isLaborCost) {
                    laborCost = Number($parent.siblings('.laborCost').find('.mdshow').text());
                }
                laborCost = laborCost || laborCost == 0 ? laborCost : 'Null';

                $parent.siblings('.tdROI').text(ROI);

                powerPriceObj['powerPrice'] = powerPrice;
                powerPriceObj['hrPrice'] = hrPrice;
                powerPriceObj['hr'] = hr;
                powerPriceObj['laborCost'] = laborCost;
                if (thisObj.powerPriceModify.length == 0) {
                    thisObj.powerPriceModify.push(powerPriceObj);
                } else {
                    var isExist = false
                    for (var i = 0, len = thisObj.powerPriceModify.length; i < len; i++) {
                        if (thisObj.powerPriceModify[i].faultId == trId) {
                            isExist = true;
                            thisObj.powerPriceModify[i].powerPrice = powerPrice;
                            thisObj.powerPriceModify[i].hrPrice = hrPrice;
                            thisObj.powerPriceModify[i].hr = hr;
                            thisObj.powerPriceModify[i].laborCost = laborCost;
                        }
                    }
                    if (!isExist) {
                        thisObj.powerPriceModify.push(powerPriceObj);
                    }
                }
            }
            //编辑单元输入事件
            $(this.table).on('focus', '[contenteditable]', function() {
                var $this = $(this);
                if ($this.html().indexOf('--') > -1) {
                    $this.data('before', '');
                    $this.text('');
                }
            }).on('blur keyup paste input', '[contenteditable]', (e) => {
                var $this = $(e.target);
                saveEditData($this,this);
            });
            //返回
            $('#btnBack', this.container).off('click').on('click', e => {
                this.close();
            });

            //下拉框选择周期
            $('#selCycle').on('change', e => {
                var selVal = e.target.value;
                var type = 'runtimeyear';
                switch (selVal) {
                    case 'day':
                        type = 'runtimeday';
                        break;
                    case 'week':
                        type = 'runtimeweek';
                        break;
                    case 'month':
                        type = 'runtimemonth';
                        break;
                    default:
                        type = 'runtimeyear';
                        break;
                }
                this.selCycle = selVal;
                $('tr', this.table).each((index, elem) => {
                    var time = elem.dataset[type];
                    var energy = elem.dataset['energy'];
                    var factor = elem.dataset['factor'];
                    var saving = 0;
                    if (isNaN(Number(time)) || isNaN(Number(energy)) || isNaN(Number(factor))) return;
                    saving = Number(time) * Number(energy) * Number(factor);
                    $('.saving', elem).text(Number(saving).toFixed(2));
                    $('.saveMoney', elem).text((saving * this.powerPrice).toFixed(2));
                });
            });

            //下载表格
            $('#btndownLoad', this.container).off('click').on('click', e => {
                this.downloadTable();
            });
            //根据ROI排序
            $('.thROI', this.container).off('click').on('click', function(e) {
                var data;
                if (!e.currentTarget.dataset.sort || e.currentTarget.dataset.sort == 'descend') {
                    e.currentTarget.dataset.sort = 'ascend';
                    data = _this.ROIQulatyData.sort(function(a, b) { return b.ROINum - a.ROINum });
                } else {
                    e.currentTarget.dataset.sort = 'descend';
                    data = _this.ROIQulatyData.sort(function(a, b) { return a.ROINum - b.ROINum });
                }
                _this.renderData(data);
            })

            //根据节能量排序
            $('.thSave', this.container).off('click').on('click', function(e) {
                var data;
                if (!e.currentTarget.dataset.sort || e.currentTarget.dataset.sort == 'descend') {
                    e.currentTarget.dataset.sort = 'ascend';
                    data = _this.ROIQulatyData.sort(function(a, b) { return b.savingNum - a.savingNum });
                } else {
                    e.currentTarget.dataset.sort = 'descend';
                    data = _this.ROIQulatyData.sort(function(a, b) { return a.savingNum - b.savingNum });
                }
                _this.renderData(data);
            })

            //输入格式刷
            $('.trROI', this.container).off('click').on('click', function(e) {
                var $this = $(e.currentTarget);
                if (!$this.hasClass('dragActive') && $('.btnPainter')[0].style.display && $('.btnPainter')[0].style.display != 'none') {
                    $('.dragActive').find('.contentModify').attr('draggable', false);
                    $this.siblings().removeClass('dragActive');
                    $this.addClass('dragActive');
                    $this.find('.contentModify').attr('draggable', true);
                }
            })
            $('#btnPainter').off('click').on('click', function(e) {
                var $this = $(e.currentTarget);
                if ($('.dragActive').length == 0) {
                    infoBox.alert(I18n.resource.diagnosis.diagnosisROI.PAINTER_ERROR1);
                    return;
                }
                $this.addClass('btn-primary');
            })
            var $contentModify = $('.contentModify', this.container);
            for(var i = 0;i<$contentModify.length;i++){
                var item = $contentModify[i];
                item.ondragstart = function(e) {
                    //e.stopPropagation();
                    e = e||event;
                    e.dataTransfer.effectAllowed = "copy";
                    var $this = $(e.currentTarget);
                    var currentText = $this.find('.mdshow').text();
                    var currentIndex = $this.index();
                    if (!$('#btnPainter').hasClass('btn-primary')) {
                        infoBox.alert(I18n.resource.diagnosis.diagnosisROI.PAINTER_ERROR2);
                        return;
                    }
                    //e.currentTarget.classList.add('dragActive');
                    //e.originalEvent.dataTransfer.setData('dragText',currentText);
                    //e.originalEvent.dataTransfer.setData('dragIndex',currentIndex);
                    _this.dragText = currentText;
                    _this.dragIndex = currentIndex;
                    return true
                }
                item.ondragenter = function(e) {
                    e = e||event;
                    var $this = $(e.currentTarget);
                    e.dataTransfer.dropEffect = "move";
                    //var dragText = e.originalEvent.dataTransfer.getData('dragText');
                    if ($this.index() != _this.dragIndex) {
                        return;
                    } else {
                        $this.find('.mdshow').text(_this.dragText);
                        $this.find('.mdEdit').text(_this.dragText);
                        saveEditData($this,_this,true);
                    }
                    return true;
                }
                item.ondragover = function(e){
                    e.preventDefault();
                    return true;
                }
                item.ondrop = function(e) {
                    e = e||event;
                    //e.stopPropagation();
                    $('.dragActive').removeClass('dragActive');
                    $('#btnPainter').removeClass('btn-primary');
                    e.dataTransfer.effectAllowed = "all";
                    return false;
                }
            }
        },
        ROISort: function(e, sortStr) {
            var data;
            var $this = $(e.currentTarget);
            var $sortBtn = $this.find('.sortBtn');
            var $siblingSortBtn = $this.siblings('th').find('.sortBtn');
            if ($('#btnEdit').hasClass('mdEdit')) {
                infoBox.alert(n.resource.diagnosis.diagnosisROI.PAINTER_ERROR3);
                return;
            }
            if (!e.currentTarget.dataset.sort || e.currentTarget.dataset.sort == 'descend') {
                e.currentTarget.dataset.sort = 'ascend';
                data = this.ROIQulatyData.sort(function(a, b) { return b[sortStr] - a[sortStr] });
                $sortBtn.removeClass('glyphicon-sort-by-attributes');
                $sortBtn.removeClass('glyphicon-sort');
                $sortBtn.addClass('glyphicon-sort-by-attributes-alt');
            } else {
                e.currentTarget.dataset.sort = 'descend';
                data = this.ROIQulatyData.sort(function(a, b) { return a[sortStr] - b[sortStr] });
                $sortBtn.removeClass('glyphicon-sort-by-attributes-alt');
                $sortBtn.removeClass('glyphicon-sort');
                $sortBtn.addClass('glyphicon-sort-by-attributes');
            }
            $siblingSortBtn.removeClass('glyphicon-sort-by-attributes-alt');
            $siblingSortBtn.removeClass('glyphicon-sort-by-attributes');
            $siblingSortBtn.addClass('glyphicon-sort');
            this.renderData(data);
        },
        getData: function() {
            var startTime = new Date($('#startTimeCog', this.container).val());
            var endTime = new Date($('#endTimeCog', this.container).val());
            if (isNaN(startTime.getFullYear()) || isNaN(endTime.getFullYear())) { //无效日期时,给默认日期,默认为月初至当前时间
                startTime = new Date();
                endTime = new Date();
                startTime.setDate(1);
                endTime.setMinutes(endTime.getMinutes() - endTime.getMinutes() % 5);
                startTime = startTime.format('yyyy-MM-dd HH:mm:00');
                endTime = endTime.format('yyyy-MM-dd HH:mm:00');
            } else {
                startTime = startTime.format('yyyy-MM-dd HH:mm:00');
                endTime = endTime.format('yyyy-MM-dd HH:mm:00');
            }

            if (startTime > endTime) {
                alert(I18n.resource.diagnosis.diagnosisROI.MSG_CHECK_TIME);
                return;
            }

            var postData = {
                faultName: this.faultName,
                startTime: startTime,
                endTime: endTime,
                projId: AppConfig.projectId
            }
            WebAPI.post('/diagnosis/getFaultROIbyFaultName', postData).done((data) => {
                this.renderData(data.data);
                Spinner.stop();
                this.attachEvent();
            })
        },
        renderData: function(data) {
            var unitMoney = AppConfig.unit_currency ? AppConfig.unit_currency : (I18n.type == 'zh' ? '¥' : '$');
            $(this.table).empty();
            var grade_dict = { 1: i18n_resource.diagnosis.diagnosisROI.ALERT, 2: i18n_resource.diagnosis.diagnosisROI.FAULT };
            var strHtml = '',
                unit = 'kWh',
                count = 0;
            var tpl = '<tr class="trROI" id="fault_{faultid}" data-runtimeday="{RuntimeDay}" data-runtimeweek="{RuntimeWeek}" data-runtimemonth="{RuntimeMonth}" data-runtimeyear="{RuntimeYear}" data-factor="{Factor}" data-energy="{Energy}"><td>{ol}</td><td>{time}</td><td>{group}</td><td class="faultName">{fault}</td><td>{equipment}</td><td class="tdROI">{ROI}</td><td class="tdSave saving tdStrongP">{saving}</td><td class="tdStrongP tdPowerPrice contentModify" ><span class="mdshow">{powerPrice}</span><div class="mdEdit hidden" contentEditable="true">{powerPrice}</div></td><td class="saveMoney tdStrongP">{saveMoney}</td><td class="tdEneditable hrPrice tdStrongH contentModify"><span class="mdshow">{hrPrice}</span><div class="mdEdit hidden" contentEditable="true">{hrPrice}</div></td><td class="tdEneditable hr tdStrongH contentModify"><span class="mdshow">{hr}</span><div class="mdEdit hidden" contentEditable="true">{hr}</div></td><td class="tdEneditable laborCost tdStrongH contentModify"><span class="mdshow">{laborCost}</span><div class="mdEdit hidden" contentEditable="true">{laborCost}</div></td></tr>'
            this.ROIQulatyData = [];
            for (var i = 0, l = data.length, saving, item, saveMoney, ROI, itemNew = {}, isMatch = false; i < l; i++) {
                item = data[i];
                //筛选数据
                if (this.filter && this.filter.length > 0) {
                    for (var j of this.filter) {
                        if (j.type == 'fault') {
                            if (item.FaultName == j.value) {
                                isMatch = true;
                            } else {
                                isMatch = false;
                            }
                        } else if (j.type == 'zone') {
                            if (item.SubBuildingName == j.value) {
                                isMatch = true;
                            } else {
                                isMatch = false;
                            }
                        } else if (j.type == 'equipment') {
                            if (item.EquipmentName == j.value) {
                                isMatch = true;
                            } else {
                                isMatch = false;
                            }
                        }
                    }
                    if (!isMatch) {
                        continue;
                    }
                }
                count++;
                var currentPowerPrice = item.ElecPrice?item.ElecPrice:this.powerPrice;
                saving = (Number(item.RuntimeYear) * Number(item.Factor) * Number(item.Energy)).toFixed(2); //默认显示周期为年的数据,节能量=RuntimeYear*Factor*Energy
                saving = (saving && saving != 0) ? saving : '--';
                saveMoney = saving=='--'?'--':(saving * currentPowerPrice).toFixed(2);
                ROI = saveMoney == '--' ? '--' : this.calculateROI(saveMoney, item.LaborCost, item.HrPrice, item.Hr);
                itemNew = $.extend(true, {}, item);
                itemNew['ROINum'] = Number(ROI) ? ROI : 0;
                itemNew['savingNum'] = Number(saving) ? Number(saving) : 0;
                this.ROIQulatyData.push(itemNew);
                strHtml += (tpl.formatEL({
                    ol: count,
                    faultid: item.FaultId,
                    time: item.Time ? timeFormat(new Date(item.Time), timeFormatChange('mm-dd hh:ii')) : '--',
                    //grade: grade_dict[item.Grade],
                    group: item.Group,
                    fault: item.FaultName,
                    //zone: item.SubBuildingName,
                    equipment: item.EquipmentName,
                    saving: saving,
                    saveMoney: saveMoney,
                    powerPrice: currentPowerPrice,
                    hrPrice: item.HrPrice ? item.HrPrice : '--',
                    hr: item.Hr ? item.Hr : '--',
                    laborCost: (item.LaborCost == 0 || item.LaborCost) ? item.LaborCost : ((item.Hr == 0 || item.Hr) && (item.HrPrice == 0 || item.HrPrice) ? item.Hr * item.HrPrice : '--'),
                    ROI: ROI,
                    RuntimeDay: item.RuntimeDay,
                    RuntimeWeek: item.RuntimeWeek,
                    RuntimeMonth: item.RuntimeMonth,
                    RuntimeYear: item.RuntimeYear,
                    Factor: item.Factor,
                    Energy: item.Energy
                }));
            }

            //能耗单位放表头
            data.length > 0 && (unit = data[0].Unit);
            $('.unit', this.container).text(unit);

            $(this.table).html(strHtml);
            this.attachEvent();
        },

        saveData: function() {
            if (this.powerPriceModify.length == 0) return;
            var postData = {
                projId: AppConfig.projectId,
                arrData: this.powerPriceModify
            }
            WebAPI.post('/diagnosis/saveFaultROIbyFaultName', postData).done(result => {
                if (result.data) {
                    this.getData();
                }
            });
        },

        calculateROI: function(saveMoney, laborCost, hrPrice, hr) {
            var ROI = '--';
            saveMoney = Number(saveMoney);
            laborCost = Number(laborCost);
            hrPrice = Number(hrPrice);
            hr = Number(hr);
            if (!laborCost || isNaN(laborCost)) {
                laborCost = hrPrice * hr;
            }
            if (laborCost && laborCost > 0) {
                //ROI
                if (saveMoney == 0) {
                    ROI = '--'
                } else if (laborCost === 0) {
                    ROI = 0;
                } else if (!laborCost) {
                    ROI = '--';
                } else {
                    ROI = (laborCost / saveMoney).toFixed(2);
                }
            }
            return ROI;
        },

        downloadTable: function() {
            //如果没有历史记录,不可以下载
            if ($('tr', this.table).length === 0) {
                alert('There is no downloadable content');
                return;
            }
            var startTime = new Date($('#startTimeCog', this.container).val()).format('yyyy-MM-dd HH:mm:ss'),
                endTime = new Date($('#endTimeCog', this.container).val()).format('yyyy-MM-dd HH:mm:ss'),
                projId = AppConfig.projectId;
            window.open('/diagnosis/downloadFaultROI/' + projId + '/' + startTime + '/' + endTime + '/' + this.faultName + '/' + this.selCycle + '/' + this.powerPrice + '/' + I18n.type + '/' + AppConfig.unit_currency);
        }
    }
    return DiagnosisROI
})()
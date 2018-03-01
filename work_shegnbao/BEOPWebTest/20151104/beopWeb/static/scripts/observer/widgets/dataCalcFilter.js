var DataCalcFilter = (function () {
    function DataCalcFilter(base) {
        this.m_base = base;
        this.m_screen = base.screen;
        this.m_curModal = base.screen.curModal;
        if (!this.m_curModal.arrFilter) {
            this.m_curModal.arrFilter = [];
        }
        if (base.chart) {
            this.m_chartOption = base.chart.getOption();
        }
        this.m_dictShowData = this.m_curModal.dictShowData;

        this.m_arrDsItem = [];
        this.m_arrDsId = this.m_curModal.itemDS[0].arrId;
        for (var i = 0, len=this.m_arrDsId.length; i<len; i++) {
            var itemTemp = AppConfig.datasource.getDSItemById(this.m_arrDsId[i]);
            itemTemp.alphabet = this.getAlphabetByNum(i);
            this.m_arrDsItem.push(itemTemp);
        }

        this.m_nInterval = 0;
        var format = this.m_curModal.format;
        switch (format) {
            case 'm1': this.m_nInterval = 60000; break;
            case 'm5': this.m_nInterval = 300000; break;
            case 'h1': this.m_nInterval = 3600000; break;
            case 'd1': this.m_nInterval = 86400000; break;
            default:  this.m_nInterval = 3600000; break;
        }

        this.$parentContain = $('#paneContent');
        this.$anlsPaneContain = $('#anlsPaneContain');
        this.$wrap;
        this.m_tmStart;
        this.m_tmEnd;
        this.m_tmCycle;
    };
    DataCalcFilter.prototype = {
        show: function() {
            var _this = this;
            WebAPI.get('/static/views/observer/widgets/dataCalcFilter.html').done(function(resultHTML) {
                _this.$wrap = $('<div class="modal-db-history-wrap" id="wrapDataFilter">').html(resultHTML);
                _this.$parentContain.append(_this.$wrap);
                _this.$anlsPaneContain.css('display', 'none');
                _this.$page = _this.$wrap.children('#pageDataFilter');
                I18n.fillArea($('#pageDataFilter'));
                _this.init();
            });
        },
        init: function() {
            this.$btnFilter = $('#btnFilter', this.$page);
            this.$btnCancel = $('#btnCancel', this.$page);
            this.$iconCancel = $('#iconCancel', this.$page);
            this.$selPtList = $('#selectPtList', this.$page);
            this.$chkPtList = $('#checkPtList', this.$page);
            this.$filterCodition = $('#filterCondition', this.$page);
            this.$mathCfgData = $('#varConfigData', this.$page);
            this.$radioFilTp1 = $('#radioFilterType1', this.$page);
            this.$radioFilTp2 = $('#radioFilterType2', this.$page);
            this.$tmStart = $('#timeStart', this.$page);
            this.$inputValLen = $('#inputValLen', this.$page);
            this.$inputCycleLen = $('#inputCycleLen', this.$page);
            this.$tmEnd = $('#timeEnd', this.$page);
            this.$tmCycle = $('#timeCycle', this.$page);
            this.$divInputValLen = $('#divValLen', this.$page);     // input type 1
            this.$divInputCycleLen = $('#divCycleLen', this.$page);// input type 1
            this.$divTmEnd = $('#divTmEnd', this.$page);             // input type 2
            this.$divTmCycle = $('#divTmCycle', this.$page);        // input type 2
            this.$radioShowNone = $('#radioShowNone', this.$page);
            this.$radioShowColor = $('#radioShowColor', this.$page);
            this.$btnLogicAnd = $('#btnLogicAnd', this.$page);
            this.$btnLogicOr = $('#btnLogicOr', this.$page);
            this.$btnLogicNot = $('#btnLogicNot', this.$page);
            this.initCloseControl();
            //this.initComboBox();
            this.initCheckButton();
            this.initFilterCondition();
            this.initVarGrid();
            this.initRadioControl();
            this.initTimeControl();
            this.initLogicButton();

            //this.$selPtList.change();
        },
        initCloseControl: function() {
            var _this = this;
            this.$btnFilter.off().click(function (e) {
                _this.filterOperationCheckButton();
            });
            this.$btnCancel.off().click(function (e) {
                _this.close();
            });
            this.$iconCancel.off().click(function (e) {
                _this.close();
            });
        },
        close: function() {
            this.$wrap.remove();
            this.$anlsPaneContain.css('display', 'block');
        },
        initComboBox: function() {
            var _this = this;
            this.$selPtList.empty();
            var item;
            for (var i= 0,len=this.m_arrDsItem.length; i<len; i++) {
                item = $('<option value="' + this.m_arrDsItem[i].id + '">' + this.m_arrDsItem[i].alias + '</option>');
                this.$selPtList.append(item);
            }
            this.$selPtList.change(function (e) {
                var selPtId = _this.$selPtList.val();
                for (var i = 0, len = _this.m_curModal.arrFilter.length; i < len; i++) {
                    var item = _this.m_curModal.arrFilter[i];
                    if (selPtId == item.pointId) {
                        _this.$filterCodition.val(item.filterCondition);
                        _this.$tmStart.val(item.timeStart);
                        _this.$inputValLen.val(item.valLen);
                        _this.$inputCycleLen.val(item.cycleLen);
                        _this.$tmEnd.val(item.timeEnd);
                        _this.$tmCycle.val(item.timeCycle);
                        (0 == item.showType) ? (_this.$radioShowNone.click()) : (_this.$radioShowColor.click());
                        (0 == item.filterType) ? (_this.$radioFilTp1.click()) : (_this.$radioFilTp2.click());
                        break;
                    }
                }
            });
        },
        initCheckButton: function() {
            this.$chkPtList.empty();
            var item;
            for (var i= 0,len=this.m_arrDsItem.length; i<len; i++) {
                item = '<div class="checkbox"><label><input type="checkbox" value="' + this.m_arrDsItem[i].id + '">' + this.m_arrDsItem[i].alias + '</label></div>';
                this.$chkPtList.append(item);
            }
        },
        initFilterCondition: function() {
            this.$filterCodition.mathquill('editable');

            //var selectPtId = this.$selPtList.val();
            var arrFilter = this.m_curModal.arrFilter;
            var codition;
            for (var i= 0,len=arrFilter.length; i<len; i++) {
                //if (selectPtId == arrFilter[i].pointId) {
                if (true) {
                    codition = arrFilter[i].filterCondition;
                    break;
                }
            }
            if (codition) {
                //this.$filterCodition.val(codition);
                this.$filterCodition.mathquill('latex', codition);
            }
        },
        initVarGrid: function() {
            this.$mathCfgData.empty();
            var item;
            for (var i= 0,len=this.m_arrDsItem.length; i<len; i++) {
                item = $('<div class="row">\
                                <div class="col-xs-12 varRow">\
                                    <div class="col-xs-4 formulaVarName"><input type="text" name="inputVarValue" class="varNameChange">' + this.m_arrDsItem[i].alphabet + '</div>\
                                    <div class="col-xs-6 divVarValue" varid="' + this.m_arrDsItem[i].id + '">' + this.m_arrDsItem[i].alias + '</div>\
                                </div>\
                            </div>');
                this.$mathCfgData.append(item);
            }
            //var $divName = $('.formulaVarName', this.$page);
            //$divName.click(function() {
            //    var $input = $(this).children('input');
            //    $input.css('display','inline');
            //    $input.val(this.childNodes[1].textContent);
            //    $input.focus();
            //    $input.select();
            //});
            //var $inputNameChange = $('.varNameChange', this.$page);
            //$inputNameChange.blur(function() {
            //    this.style.display = 'none';
            //    if(this.value != '') {
            //        this.parentNode.childNodes[1].textContent = this.value;
            //    }
            //    $(this).next('span').css('display','inline');
            //});
            //$inputNameChange.keyup(function (e) {
            //    if (13 == e.keyCode) {
            //        $inputNameChange.blur();
            //    }
            //});
        },
        initRadioControl: function() {
            var _this = this;
            this.$radioFilTp1.next().text(I18n.resource.analysis.dataFilter.COUNT_SELECT);
            this.$radioFilTp2.next().text(I18n.resource.analysis.dataFilter.TIME_SELECT);
            this.$radioShowNone.next().text(I18n.resource.analysis.dataFilter.SHOW_NONE);
            this.$radioShowColor.next().text(I18n.resource.analysis.dataFilter.SHOW_DOT);

            this.$radioFilTp1.click();
            this.setFilterTypeControl(true);
            this.$radioFilTp1.click(function(e) {
                _this.setFilterTypeControl(true);
            });
            this.$radioFilTp2.click(function(e) {
                _this.setFilterTypeControl(false);
            });

            this.$radioShowNone.click();
            this.$radioShowNone.click(function(e) {});
            this.$radioShowColor.click(function(e) {});
        },
        initTimeControl: function() {
            var _this = this;
            var tmStart = new Date(this.m_chartOption.xAxis[0].data[0]);
            var xLen = this.m_chartOption.xAxis[0].data.length;
            var tmEnd = new Date(this.m_chartOption.xAxis[0].data[xLen-1]);

            this.m_tmStart = tmStart;
            this.$tmStart.val(tmStart.format('yyyy-MM-dd HH:00'));
            this.$tmStart.datetimepicker({
                format: 'yyyy-mm-dd hh:00',
                startView: 'month',
                minView: 'day',
                autoclose: true,
                todayBtn: false,
                pickerPosition: 'top-right',
                initialDate: tmStart,
                startDate: tmStart,
                endDate: tmEnd,
                keyboardNavigation: false
            }).off('changeDate').on('changeDate', function(e) {
                var timeVal = _this.$tmStart.val();
                _this.m_tmStart = new Date(timeVal.replace(/-/, '/'));
            });

            this.m_tmEnd = tmEnd;
            this.$tmEnd.val(tmEnd.format('yyyy-MM-dd HH:00'));
            this.$tmEnd.datetimepicker({
                format: 'yyyy-mm-dd hh:00',
                startView: 'month',
                minView: 'day',
                autoclose: true,
                todayBtn: false,
                pickerPosition: 'top-right',
                initialDate: tmStart,
                startDate: tmStart,
                endDate: tmEnd,
                keyboardNavigation: false
            }).off('changeDate').on('changeDate', function(e) {
                var timeVal = _this.$tmEnd.val();
                _this.m_tmEnd = new Date(timeVal.replace(/-/, '/'));
            });

            this.m_tmCycle = tmStart;
            this.$tmCycle.val(tmStart.format('yyyy-MM-dd HH:00'));
            this.$tmCycle.datetimepicker({
                format: 'yyyy-mm-dd hh:00',
                startView: 'month',
                minView: 'day',
                autoclose: true,
                todayBtn: false,
                pickerPosition: 'top-right',
                initialDate: tmStart,
                startDate: tmStart,
                endDate: tmEnd,
                keyboardNavigation: false
            }).off('changeDate').on('changeDate', function(e) {
                var timeVal = _this.$tmCycle.val();
                _this.m_tmCycle = new Date(timeVal.replace(/-/, '/'));
            });
        },
        initLogicButton: function() {
            var _this = this;
            this.$btnLogicAnd.click(function (e) {
                _this.$filterCodition.mathquill('write', '&');
            });
            this.$btnLogicOr.click(function (e) {
                _this.$filterCodition.mathquill('write', '\\mid');
            });
            this.$btnLogicNot.click(function (e) {
                _this.$filterCodition.mathquill('write', '!');
            });
        },
        getAlphabetByNum: function(num) {
            var alphabet;
            num = num % 26;
            switch (num) {
                case 0: alphabet = 'a'; break;
                case 1: alphabet = 'b'; break;
                case 2: alphabet = 'c'; break;
                case 3: alphabet = 'd'; break;
                case 4: alphabet = 'e'; break;
                case 5: alphabet = 'f'; break;
                case 6: alphabet = 'g'; break;
                case 7: alphabet = 'h'; break;
                case 8: alphabet = 'i'; break;
                case 9: alphabet = 'j'; break;
                case 10: alphabet = 'k'; break;
                case 11: alphabet = 'l'; break;
                case 12: alphabet = 'm'; break;
                case 13: alphabet = 'n'; break;
                case 14: alphabet = 'o'; break;
                case 15: alphabet = 'p'; break;
                case 16: alphabet = 'q'; break;
                case 17: alphabet = 'r'; break;
                case 18: alphabet = 's'; break;
                case 19: alphabet = 't'; break;
                case 20: alphabet = 'u'; break;
                case 21: alphabet = 'v'; break;
                case 22: alphabet = 'w'; break;
                case 23: alphabet = 'x'; break;
                case 24: alphabet = 'y'; break;
                case 25: alphabet = 'z'; break;
                default: alphabet = 'a'; break;
            }
            return alphabet;
        },
        setFilterTypeControl: function(bIsType1) {
            if (bIsType1) {
                this.$divInputValLen.css('display', 'block');
                this.$divInputCycleLen.css('display', 'block');
                this.$divTmEnd.css('display', 'none');
                this.$divTmCycle.css('display', 'none');
            }
            else {
                this.$divInputValLen.css('display', 'none');
                this.$divInputCycleLen.css('display', 'none');
                this.$divTmEnd.css('display', 'block');
                this.$divTmCycle.css('display', 'block');
            }
        },
        getFormula: function() {
            var $varRow = $('#varConfig .varRow');
            var latexMathValue = this.$filterCodition.mathquill('latex');
            var varNum = $varRow.length;
            var varId,varName;
            var searchReg;
            var varError = new Array;
            $('.varLack').remove();
            for (var i = 0; i < varNum; i++) {
                varName = $($varRow.find('.formulaVarName').get(i));
                varId = $varRow.children('.divVarValue').eq(i).attr('varid');
                searchReg = new RegExp('\\b'+varName.text()+'\\b', 'g');
                if (searchReg.test(latexMathValue)){
                    if (varId){
                        latexMathValue = latexMathValue.replace(searchReg, '<%' + varId + '%>');
                    }else{
                        varError.push(varName);
                    }
                }
            }
            if (varError.length > 0){
                for (var ele = 0; ele < varError.length; ++ele) {
                    varError[ele].append($('<span class="varLack">Unassigned!<span>'));
                }
                alert('Lack Variable in Formula');
                return 'error';
            }
            return latexMathValue;
        },
        filterDataByInput: function(nCnt, nStartCnt, nValLen, nCycleLen, fmtType) {
            var oneUnit = 0;// 每个周期所包含的数据个数
            switch (fmtType) {
                case 'm1':
                    oneUnit = 1440;
                    break;
                case 'm5':
                    oneUnit = 288;
                    break;
                case 'h1':
                    oneUnit = 24;
                    break;
                case 'd1':
                    oneUnit = 30;    //
                    break;
                case 'M1':
                    oneUnit = 12;
                    break;
                default :
                    oneUnit = 24;
            }
            if (nCnt < nStartCnt || nCnt > nStartCnt + nCycleLen) {// out
                return 2;
            }
            else {
                if (nValLen < nCycleLen) {
                    var bFind = false;
                    var loopCnt = Math.ceil(nCycleLen / oneUnit);
                    for (var i = 0; i < loopCnt; i++) {
                        var begin = nStartCnt + oneUnit * i;
                        if (nCnt >= begin && nCnt <= begin + nValLen) {
                            bFind = true;
                            break;
                        }
                    }
                    if (bFind) {// fit
                        return 0;
                    }
                    else {// not fit
                        return 1;
                    }
                }
                else {// fit
                    return 0;
                }
            }
        },
        filterOperationCombox: function() {
            var _this = this;
            var filterCondition = this.$filterCodition.mathquill('latex');     //_this.$filterCodition.val();
            if (!filterCondition) {
                alert('Please input filter condition !');
                this.$filterCodition.select();
                return;
            }

            var strPtId = this.$selPtList.val();
            var radioFilterVal = this.$page.find('input:radio[name=radioFilterType]:checked').val();
            var radioShowVal = this.$page.find('input:radio[name=radioShowType]:checked').val();
            var nFilterType = ('optionFilterType1' == radioFilterVal) ? 0 : 1;
            var nShowType = ('optionShowType1' == radioShowVal) ? 0 : 1;
            var item = {
                'pointId': strPtId,
                'filterCondition': filterCondition,//_this.getFormula(),
                'filterType' : nFilterType,
                'timeStart' : _this.$tmStart.val().format("yyyy-MM-dd HH:mm:ss"),
                'valLen' : parseInt(_this.$inputValLen.val()),
                'cycleLen' : parseInt(_this.$inputCycleLen.val()),
                'timeEnd' : _this.$tmEnd.val().format("yyyy-MM-dd HH:mm:ss"),
                'timeCycle' : _this.$tmCycle.val().format("yyyy-MM-dd HH:mm:ss"),
                'showType' : nShowType,
                'filterDrawObj' : {},
                'appendData' : []
            };

/*
                // 定位开始时间的位数
                var nStartVal = Date.parse(item.timeStart);
                var nStartCnt = 0;
                var xLen = _this.m_chartOption.xAxis[0].data.length;
                if (nStartVal < Date.parse(_this.m_chartOption.xAxis[0].data[0]) || nStartVal > Date.parse(_this.m_chartOption.xAxis[0].data[xLen-1])) {
                    alert('Out of range!');
                    return;
                }
                for (var i = 0; i < xLen; i++) {
                    if (Date.parse(_this.m_chartOption.xAxis[0].data[i]) >= nStartVal) {
                        nStartCnt = i;
                        break;
                    }
                }

                // 对每个周期的前有效数个值，做循环取值 item.valLen
                // 当取值位数大于循环长度时，结束循环 item.cycleLen
                var filterVal = {};
                for (var i = 0, len1 = _this.m_arrDsItem.length; i < len1; i++) {
                    for (var j = 0, len2 = _this.m_chartOption.series.length; j < len2; j++) {
                        if (_this.m_arrDsItem[i].id == _this.m_chartOption.series[j].id) {
                            var alph = _this.m_arrDsItem[i].alphabet;
                            filterVal[alph] = [];
                            for (var k = nStartCnt, len3 = _this.m_chartOption.series[j].data.length; k < len3; k++) {
                                var flag = _this.filterDataByInput(k, nStartCnt, item.valLen, item.cycleLen, _this.m_curModal.format);
                                var bIsOut = false;
                                switch (flag) {
                                    case 0:
                                        filterVal[alph].push(_this.m_chartOption.series[j].data[k]);
                                        break;
                                    case 1:
                                        filterVal[alph].push(null);
                                        break;
                                    case 2:
                                        bIsOut = true;
                                        break;
                                    default :
                                        bIsOut = true;
                                        break;
                                }
                                if (bIsOut) {
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
*/

            // post
            var condition = this.$filterCodition.mathquill('latex');
            //var condition = _this.$filterCodition.val();

            var dataObj = {};
            for (var i = 0, len1 = this.m_arrDsItem.length; i < len1; i++) {
                var alph = this.m_arrDsItem[i].alphabet;
                if (-1 != condition.indexOf(alph)) {
                    var id = this.m_arrDsItem[i].id;
                    dataObj[alph] = this.m_dictShowData[id];
                }
            }

            var dataTarget;
            for (var i = 0, len = this.m_arrDsItem.length; i < len; i++) {
                if (strPtId == this.m_arrDsItem[i].id) {
                    dataTarget = this.m_arrDsItem[i].alphabet;
                    break;
                }
            }

            // check
            if (-1 == condition.indexOf(dataTarget)) {
                alert(I18n.resource.analysis.dataFilter.ERR2);
                return;
            }
            var postData = {
                'express': condition,
                'params': dataObj,
                'target': dataTarget};
            WebAPI.post('/expressAnalysis/calc', postData).done(function (result) {
                var res = JSON.parse(result);
                if (res.error) {
                    return;
                }

                for (var i = 0, len = res.data.length; i < len; i++) {
                    if (!res.data[i]) {
                        res.data[i] = undefined;
                    }
                }

                var id = '';//(+new Date()).toString();
                for (var i = 0, len = _this.m_arrDsItem.length; i < len; i++) {
                    if (res.name == _this.m_arrDsItem[i].alphabet) {
                        id = _this.m_arrDsItem[i].id;
                        break;
                    }
                }

                // 定位开始时间的位数
                var nStartVal = Date.parse(item.timeStart);
                var nStartCnt = 0;
                var xLen = _this.m_chartOption.xAxis[0].data.length;
                if (nStartVal > Date.parse(_this.m_chartOption.xAxis[0].data[xLen-1])) {
                    alert('Out of range!');
                    return;
                }
                if (nStartVal < Date.parse(_this.m_chartOption.xAxis[0].data[0])) {
                    nStartVal = Date.parse(_this.m_chartOption.xAxis[0].data[0]);
                }
                for (var i = 0; i < xLen; i++) {
                    if (Date.parse(_this.m_chartOption.xAxis[0].data[i]) >= nStartVal) {
                        nStartCnt = i;
                        break;
                    }
                }

                var nValidateLen = 0;
                var nCycleLen = 0;
                if (1 == item.filterType) {
                    var nStart = Date.parse(item.timeStart);
                    var nEnd = Date.parse(item.timeEnd);
                    var nCycle = Date.parse(item.timeCycle);
                    var unit = 0;
                    switch (_this.m_curModal.format) {
                        case 'm1':
                            unit = 60000;
                            break;
                        case 'm5':
                            unit = 300000;
                            break;
                        case 'h1':
                            unit = 3600000;
                            break;
                        case 'd1':
                            unit = 86400000;
                            break;
                        default :
                            unit = 3600000;
                            break;
                    }
                    nValidateLen = Math.floor((nEnd - nStart) / unit);
                    nCycleLen = Math.floor((nCycle - nStart) / unit);
                }
                else {
                    nValidateLen = item.valLen;
                    nCycleLen = item.cycleLen;
                }
                // 对每个周期的前有效数个值，做循环取值 nValidateLen
                // 当取值位数大于循环长度时，结束循环 nCycleLen
                var filterVal = [];
                for (var i = 0, len = res.data.length; i < len; i++) {
                    var flag = _this.filterDataByInput(i, nStartCnt,nValidateLen , nCycleLen, _this.m_curModal.format);
                    switch (flag) {
                        case 0:
                            filterVal.push(res.data[i]);
                            break;
                        case 1:
                        case 2:
                            filterVal.push(undefined);
                            break;
                        default :
                            filterVal.push(undefined);
                            break;
                    }
                }

                var redrawObj = {list:[], timeShaft:[]};
                redrawObj.list.push({'dsItemId':id, 'data':filterVal});
                redrawObj.timeShaft = _this.m_chartOption.xAxis[0].data;
                item.filterDrawObj = redrawObj;

                var dataLen = res.data.length;
                for (var j = 0; j < dataLen; j++) {
                    var arrOrigData = dataObj[res.name];
                    if (Boolean(arrOrigData) && Boolean(arrOrigData[j]) && !filterVal[j]) {
                        item.appendData.push(arrOrigData[j]);
                    }
                    else {
                        item.appendData.push(undefined);
                    }
                }
                var tempCnt = [];
                for (var k = 0; k < dataLen; k++) {
                    if (0 == k) {
                        if (!item.appendData[k] && item.appendData[k + 1] && filterVal[k]) {
                            tempCnt.push(k);
                        }
                        if (item.appendData[k] && !item.appendData[k + 1] && filterVal[k + 1]) {
                            tempCnt.push(k + 1);
                        }
                    }
                    else {
                        if (!item.appendData[k - 1] && item.appendData[k] && filterVal[k - 1]) {
                            tempCnt.push(k - 1);
                        }
                        if (item.appendData[k - 1] && !item.appendData[k] && filterVal[k]) {
                            tempCnt.push(k);
                        }
                    }
                }
                for (var m = 0, lenM = tempCnt.length; m < lenM; m++) {
                    item.appendData[tempCnt[m]] = filterVal[tempCnt[m]];
                }

                var bFind = false;
                for (var i= 0,len=_this.m_curModal.arrFilter.length; i<len; i++) {
                    if (id == _this.m_curModal.arrFilter[i].pointId) {
                        bFind = true;
                        break;
                    }
                }
                if (bFind) {
                    _this.m_curModal.arrFilter[i] = item;
                }
                else {
                    _this.m_curModal.arrFilter.push(item);
                }

                _this.m_base.showFilterCharts();
                _this.m_screen.saveModal();
                _this.m_screen.saveModalJudge.resolveWith(_this.m_screen, [_this.m_screen, 1,null,$('#divWSPane .selected'),_this.m_screen.curModal,false]);
                _this.close();
            }).always(function (e) {
            });
        },
        filterOperationCheckButton: function() {
            var _this = this;
            var condition = this.$filterCodition.mathquill('latex');     //_this.$filterCodition.val();
            if (!condition) {
                alert('Please input filter condition !');
                this.$filterCodition.select();
                return;
            }

            var arrChk = this.$chkPtList.find('input');
            var arrPtId = [];
            for (var i = 0, len = arrChk.length; i < len; i++) {
                if (this.$chkPtList.find('input')[i].checked) {
                    arrPtId.push(this.$chkPtList.find('input')[i].value);
                }
            }
            if (arrPtId.length <= 0) {
                alert(I18n.resource.analysis.dataFilter.ERR1);
                return;
            }

            var nCnt = 0;
            var arrTargetId = [];
            var bCheckOk = false;
            for (var n = 0, lenN = arrPtId.length; n < lenN; n++) {
                for (var i = 0, len = this.m_arrDsItem.length; i < len; i++) {
                    if (this.m_arrDsItem[i].id == arrPtId[n]) {
                        if (-1 != condition.indexOf(this.m_arrDsItem[i].alphabet)) {
                            bCheckOk = true;
                            break;
                        }
                    }
                }
                if (bCheckOk) {
                    break;
                }
            }
            if (!bCheckOk) {
                alert(I18n.resource.analysis.dataFilter.ERR2);
                return;
            }

            for (var n = 0, lenN = arrPtId.length; n < lenN; n++) {
                var strPtId = arrPtId[n];
                var radioFilterVal = this.$page.find('input:radio[name=radioFilterType]:checked').val();
                var radioShowVal = this.$page.find('input:radio[name=radioShowType]:checked').val();
                var nFilterType = ('optionFilterType1' == radioFilterVal) ? 0 : 1;
                var nShowType = ('optionShowType1' == radioShowVal) ? 0 : 1;
                var tmStart = _this.$tmStart.val().format("yyyy-MM-dd HH:mm:ss");
                var nValLen = parseInt(_this.$inputValLen.val());
                var nCycLen = parseInt(_this.$inputCycleLen.val());
                var tmEnd = _this.$tmEnd.val().format("yyyy-MM-dd HH:mm:ss");
                var tmCyc = _this.$tmCycle.val().format("yyyy-MM-dd HH:mm:ss");

                // post

                var dataObj = {};
                for (var i = 0, len1 = this.m_arrDsItem.length; i < len1; i++) {
                    var alph = this.m_arrDsItem[i].alphabet;
                    if (-1 != condition.indexOf(alph)) {
                        var id = this.m_arrDsItem[i].id;
                        dataObj[alph] = this.m_dictShowData[id];
                    }
                }

                var dataTarget;
                for (var i = 0, len = this.m_arrDsItem.length; i < len; i++) {
                    if (strPtId == this.m_arrDsItem[i].id) {
                        dataTarget = this.m_arrDsItem[i].alphabet;
                        break;
                    }
                }

                var postData = {
                    'express': condition,
                    'params': dataObj,
                    'target': dataTarget};
                WebAPI.post('/expressAnalysis/calc', postData).done(function (result) {
                    var res = JSON.parse(result);
                    if (res.error) {
                        _this.close();
                        return;
                    }

                    for (var i = 0, len = res.data.length; i < len; i++) {
                        if (!res.data[i]) {
                            res.data[i] = undefined;
                        }
                    }

                    var id = '';//(+new Date()).toString();
                    for (var i = 0, len = _this.m_arrDsItem.length; i < len; i++) {
                        if (res.name == _this.m_arrDsItem[i].alphabet) {
                            id = _this.m_arrDsItem[i].id;
                            arrTargetId.push(id);
                            break;
                        }
                    }

                    var item = {
                        'pointId': id,
                        'filterCondition': condition,//_this.getFormula(),
                        'filterType' : nFilterType,
                        'timeStart' : tmStart,
                        'valLen' : nValLen,
                        'cycleLen' : nCycLen,
                        'timeEnd' : tmEnd,
                        'timeCycle' : tmCyc,
                        'showType' : nShowType,
                        'filterDrawObj' : {},
                        'appendData' : []
                    };

                    // 定位开始时间的位数
                    var nStartVal = Date.parse(item.timeStart);
                    var nStartCnt = 0;
                    var xLen = _this.m_chartOption.xAxis[0].data.length;
                    if (nStartVal > Date.parse(_this.m_chartOption.xAxis[0].data[xLen-1])) {
                        alert('Out of range!');
                        return;
                    }
                    if (nStartVal < Date.parse(_this.m_chartOption.xAxis[0].data[0])) {
                        nStartVal = Date.parse(_this.m_chartOption.xAxis[0].data[0]);
                    }
                    for (var i = 0; i < xLen; i++) {
                        if (Date.parse(_this.m_chartOption.xAxis[0].data[i]) >= nStartVal) {
                            nStartCnt = i;
                            break;
                        }
                    }

                    var nValidateLen = 0;
                    var nCycleLen = 0;
                    if (1 == item.filterType) {
                        var nStart = Date.parse(item.timeStart);
                        var nEnd = Date.parse(item.timeEnd);
                        var nCycle = Date.parse(item.timeCycle);
                        var unit = 0;
                        switch (_this.m_curModal.format) {
                            case 'm1':
                                unit = 60000;
                                break;
                            case 'm5':
                                unit = 300000;
                                break;
                            case 'h1':
                                unit = 3600000;
                                break;
                            case 'd1':
                                unit = 86400000;
                                break;
                            default :
                                unit = 3600000;
                                break;
                        }
                        nValidateLen = Math.floor((nEnd - nStart) / unit);
                        nCycleLen = Math.floor((nCycle - nStart) / unit);
                    }
                    else {
                        nValidateLen = item.valLen;
                        nCycleLen = item.cycleLen;
                    }
                    // 对每个周期的前有效数个值，做循环取值 nValidateLen
                    // 当取值位数大于循环长度时，结束循环 nCycleLen
                    var filterVal = [];
                    for (var i = 0, len = res.data.length; i < len; i++) {
                        var flag = _this.filterDataByInput(i, nStartCnt,nValidateLen , nCycleLen, _this.m_curModal.format);
                        switch (flag) {
                            case 0:
                                filterVal.push(res.data[i]);
                                break;
                            case 1:
                            case 2:
                                filterVal.push(undefined);
                                break;
                            default :
                                filterVal.push(undefined);
                                break;
                        }
                    }

                    var redrawObj = {list:[], timeShaft:[]};
                    redrawObj.list.push({'dsItemId':id, 'data':filterVal});
                    redrawObj.timeShaft = _this.m_chartOption.xAxis[0].data;
                    item.filterDrawObj = redrawObj;

                    var dataLen = res.data.length;
                    for (var j = 0; j < dataLen; j++) {
                        var arrOrigData = dataObj[res.name];
                        if (Boolean(arrOrigData) && Boolean(arrOrigData[j]) && !filterVal[j]) {
                            item.appendData.push(arrOrigData[j]);
                        }
                        else {
                            item.appendData.push(undefined);
                        }
                    }
                    var tempCnt = [];
                    for (var k = 0; k < dataLen; k++) {
                        if (0 == k) {
                            if (!item.appendData[k] && item.appendData[k + 1] && filterVal[k]) {
                                tempCnt.push(k);
                            }
                            if (item.appendData[k] && !item.appendData[k + 1] && filterVal[k + 1]) {
                                tempCnt.push(k + 1);
                            }
                        }
                        else {
                            if (!item.appendData[k - 1] && item.appendData[k] && filterVal[k - 1]) {
                                tempCnt.push(k - 1);
                            }
                            if (item.appendData[k - 1] && !item.appendData[k] && filterVal[k]) {
                                tempCnt.push(k);
                            }
                        }
                    }
                    for (var m = 0, lenM = tempCnt.length; m < lenM; m++) {
                        item.appendData[tempCnt[m]] = filterVal[tempCnt[m]];
                    }

                    var bFind = false;
                    for (var i= 0,len=_this.m_curModal.arrFilter.length; i<len; i++) {
                        if (id == _this.m_curModal.arrFilter[i].pointId) {
                            bFind = true;
                            break;
                        }
                    }
                    item.pointId = id;
                    if (bFind) {
                        _this.m_curModal.arrFilter[i] = item;
                    }
                    else {
                        _this.m_curModal.arrFilter.push(item);
                    }

                    nCnt++;
                    if (nCnt >= lenN) {
                        for (var p = 0, lenP = arrTargetId.length; p < lenP; p++) {
                            _this.m_screen.curModal.dictShowFlag[arrTargetId[p]] = false;
                            _this.m_screen.curModal.dictShowFlag[arrTargetId[p] + '_filter'] = true;
                        }

                        _this.m_base.showFilterCharts(_this.m_chartOption.series);
                        for (var p = 0, lenP = _this.m_curModal.arrFilter.length; p < lenP; p++) {
                            var itemTemp = _this.m_curModal.arrFilter[p];
                            _this.m_base.resetShowData(itemTemp.filterDrawObj, 1);  // filter data
                            _this.m_base.resetShowData({list:[{'dsItemId':item.pointId, 'data':itemTemp.appendData}], timeShaft:item.filterDrawObj.timeShaft}, 2);  // append data
                        }

                        for (var p = 0, lenP = arrTargetId.length; p < lenP; p++) {
                            for (var q = 0, lenQ = _this.m_chartOption.series.length; q < lenQ; q++) {
                                if (arrTargetId[p] == _this.m_chartOption.series[q].id) {
                                    _this.m_chartOption.series[q].data = [];
                                    break;
                                }
                            }
                        }
                        _this.m_base.resetIcon(arrTargetId);
                        _this.m_base.setTendencyOption(_this.m_chartOption.series);

                        _this.m_screen.saveModal();
                        _this.m_screen.saveModalJudge.resolveWith(_this.m_screen, [_this.m_screen, 1,null,$('#divWSPane .selected'),_this.m_screen.curModal,false]);
                        _this.close();
                    }
                }).always(function (e) {
                });
            }
        }
    };
    return DataCalcFilter;
})();
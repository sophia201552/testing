var DataCalcFilterContain = (function () {
    function DataCalcFilterContain(base) {
        this.base = base;
        this.$parentContain = $('#paneContent');
        this.$anlsPaneContain = $('#anlsPaneContain');
    };
    DataCalcFilterContain.prototype = {
        show: function () {
            var _this = this;
            WebAPI.get('/static/views/observer/widgets/dataCalcFilter.html').done(function(resultHTML) {
                _this.$wrap = $('<div class="modal-db-history-wrap" id="wrapDataFilter" style="height: 100%">').html(resultHTML);
                _this.$anlsPaneContain.before(_this.$wrap);
                //_this.$parentContain.append(_this.$wrap);
                //_this.$anlsPaneContain.css('display', 'none');
                _this.$pageFilter = _this.$wrap.find('#pageDataFilter');
                _this.$pageFilterCustom = _this.$wrap.find('#pageDataFilterCustom');
                _this.$pageFilterEd3 = _this.$wrap.find('#pageDataFilterEd3');
                I18n.fillArea($('#dataFilterContain'));
                _this.init();

                //new DataCalcFilter(_this, _this.base).show(_this.$pageFilter);
                //new DataCalcFilterCustom(_this, _this.base).show(_this.$pageFilterCustom);
                new DataCalcFilterEd3(_this, _this.base).show(_this.$pageFilterEd3);
            });
        },

        init: function () {
            this.$iconCancel = $('#iconCancel', this.$page);
            this.$tabFilterNormal = $('#tabFilterNormal', this.$page);
            this.$tabFilterCustom = $('#tabFilterCustom', this.$page);
            this.$tabFilterEd3 = $('#pageDataFilterEd3', this.$page);
            this.initCloseControl();
            this.initTabs();
        },
        initCloseControl: function() {
            var _this = this;
            this.$iconCancel.off().click(function (e) {
                _this.close();
            });
        },
        close: function () {
            this.$wrap.remove();
            //this.$anlsPaneContain.css('display', 'block');
        },
        initTabs: function() {
            var _this = this;
            _this.tabControl(2);
            this.$tabFilterNormal.off().click(function (e) {
                _this.tabControl(0);
            });
            this.$tabFilterCustom.off().click(function (e) {
                _this.tabControl(1);
            });
        },
        tabControl: function (nFlag) {
            if (0 == nFlag) {
                this.$tabFilterNormal.attr('class', 'active');
                this.$pageFilter.show();
                this.$tabFilterCustom.removeAttr('class');
                this.$pageFilterCustom.hide();
                this.$tabFilterEd3.removeAttr('class');
                this.$pageFilterEd3.hide();
            }
            else if (1 == nFlag) {
                this.$tabFilterNormal.removeAttr('class');
                this.$pageFilter.hide();
                this.$tabFilterCustom.attr('class', 'active');
                this.$pageFilterCustom.show();
                this.$tabFilterEd3.removeAttr('class');
                this.$pageFilterEd3.hide();
            }
            else if (2 == nFlag) {
                this.$tabFilterNormal.removeAttr('class');
                this.$pageFilter.hide();
                this.$tabFilterCustom.removeAttr('class');
                this.$pageFilterCustom.hide();
                this.$tabFilterEd3.attr('class', 'active');
                this.$pageFilterEd3.show();
            }
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
        }
    };
    return DataCalcFilterContain;
})();

var DataCalcFilter = (function () {
    function DataCalcFilter(parent, base) {
        this.m_parent = parent;
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

        var arrId = this.m_arrDsId;
        var arrItem = [];
        arrItem = AppConfig.datasource.getDSItemById(arrId);
        for (var i = 0, len=this.m_arrDsId.length; i<len; i++) {
            var id = this.m_arrDsId[i];
            for (var m = 0; m < arrItem.length; m++) {
                if (id == arrItem[m].id) {
                    var itemTemp = arrItem[m];
                    itemTemp.alphabet = this.m_parent.getAlphabetByNum(i);
                    this.m_arrDsItem.push(itemTemp);
                    break;
                }
            }
            //var itemTemp = AppConfig.datasource.getDSItemById(this.m_arrDsId[i]);
            //itemTemp.alphabet = this.m_parent.getAlphabetByNum(i);
            //this.m_arrDsItem.push(itemTemp);
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

        //this.$parentContain = $('#paneContent');
        //this.$anlsPaneContain = $('#anlsPaneContain');
        this.$wrap;
        this.$page;
        this.m_tmStart;
        this.m_tmEnd;
        this.m_tmCycle;
    };
    DataCalcFilter.prototype = {
        show: function($page) {
            this.$page = $page;
            this.init();
            return;

            WebAPI.get('/static/views/observer/widgets/dataCalcFilter.html').done(function(resultHTML) {
                _this.$wrap = $('<div class="modal-db-history-wrap" id="wrapDataFilter">').html(resultHTML);
                //_this.$parentContain.append(_this.$wrap);
                //_this.$anlsPaneContain.css('display', 'none');
                _this.$page = _this.$wrap.children('#pageDataFilter');
                //I18n.fillArea($('#pageDataFilter'));
                _this.init();
            });
        },
        init: function() {
            this.$btnFilter = $('#btnFilter', this.$page);
            this.$btnCancel = $('#btnCancel', this.$page);
            //this.$iconCancel = $('#iconCancel', this.$page);
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
        close: function() {
            this.m_parent.close();
            //this.$wrap.remove();
            //this.$anlsPaneContain.css('display', 'block');
        },
        initCloseControl: function() {
            var _this = this;
            this.$btnFilter.off().click(function (e) {
                _this.filterOperationCheckButton();
            });
            this.$btnCancel.off().click(function (e) {
                _this.close();
            });
            //this.$iconCancel.off().click(function (e) {
            //    _this.close();
            //});
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
                if (0 == i) {
                    item = '<div class="checkbox"><label><input type="checkbox" value="' + this.m_arrDsItem[i].id + '" checked>' + this.m_arrDsItem[i].alias + '</label></div>';
                }
                else {
                    item = '<div class="checkbox"><label><input type="checkbox" value="' + this.m_arrDsItem[i].id + '">' + this.m_arrDsItem[i].alias + '</label></div>';
                }
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
            WebAPI.post('/expressAnalysis/calc', postData).done(function (res) {
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
                WebAPI.post('/expressAnalysis/calc', postData).done(function (res) {
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

var DataCalcFilterCustom = (function () {
    function DataCalcFilterCustom(parent, base) {
        this.m_parent = parent;
        this.m_base = base;
        this.m_screen = base.screen;
        this.m_curModal = base.screen.curModal;
        if (!this.m_curModal.arrFilter) {
            this.m_curModal.arrFilter = [];
        }

        if (base.chart) {
            this.m_chartOption = base.chart.getOption();
            if (this.m_chartOption && this.m_chartOption.xAxis[0]) {
                this.m_arrTimeStr = this.m_chartOption.xAxis[0].data;
                //this.m_arrTime = [];
                //for (var i = 0, len = this.m_arrTimeStr.length; i < len; i++) {
                //    this.m_arrTime.push(new Date(this.m_arrTimeStr[i]));
                //}
            }
        }

        this.m_arrDsItem = [];
        this.m_arrDsId = this.m_curModal.itemDS[0].arrId;
        var arrId = this.m_arrDsId;
        var arrItem = [];
        arrItem = AppConfig.datasource.getDSItemById(arrId);
        for (var i = 0, len=this.m_arrDsId.length; i<len; i++) {
            var id = this.m_arrDsId[i];
            for (var m = 0; m < arrItem.length; m++) {
                if (id == arrItem[m].id) {
                    var itemTemp = arrItem[m];
                    itemTemp.alphabet = this.m_parent.getAlphabetByNum(i);
                    itemTemp.arrData = this.m_curModal.dictShowData[id];
                    this.m_arrDsItem.push(itemTemp);
                    break;
                }
            }
            //var itemTemp = AppConfig.datasource.getDSItemById(id);
            //itemTemp.alphabet = this.m_parent.getAlphabetByNum(i);
            //itemTemp.arrData = this.m_curModal.dictShowData[id];
            //this.m_arrDsItem.push(itemTemp);
        }
        this.m_bShowData = (this.m_curModal.bShowData || undefined == this.m_curModal.bShowData) ? true : false;

        this.$wrap;
        this.$page;
        this.m_arrFlag = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'Y', 'W', 'X', 'Y', 'Z'];
    };
    DataCalcFilterCustom.prototype = {
        show: function ($page) {
            this.$page = $page;
            this.init();
        },
        init: function () {
            this.$btnFilterCust = $('#btnFilterCustom', this.$page);
            this.$btnCancelCust = $('#btnCancelCustom', this.$page);
            this.$chkPtListCust = $('#checkPtListCust', this.$page);
            this.$mathCfgDataCust = $('#varConfigDataCust', this.$page);
            this.$divShow = $('#divShowData', this.$page);
            this.$divEdit = $('#divEdit', this.$page);
            this.$btnDataShow = $('#btnDataShow', this.$page);
            this.initCloseControl();
            this.initCheckButton();
            this.initVarGrid();
            this.initShowData();
        },
        close: function() {
            this.m_parent.close();
        },
        initCloseControl: function() {
            var _this = this;
            this.$btnFilterCust.off().click(function (e) {
                var arrFilterRes = _this.doFilterOperationEx();//_this.doFilterOperation();
                if (arrFilterRes) {
                    _this.m_curModal.arrFilter = arrFilterRes;
                    var arrPointId = [];
                    for (var i = 0, len = arrFilterRes.length; i < len; i++) {
                        var pointId = arrFilterRes[i].pointId;
                        arrPointId.push(pointId);
                        _this.m_screen.curModal.dictShowFlag[pointId] = false;
                        _this.m_screen.curModal.dictShowFlag[pointId + '_filter'] = true;
                        _this.m_base.resetShowData(arrFilterRes[i], 1);  // filter data

                        for (var q = 0, lenQ = _this.m_chartOption.series.length; q < lenQ; q++) {
                            if (pointId == _this.m_chartOption.series[q].id) {
                                _this.m_chartOption.series[q].data = [];
                                break;
                            }
                        }
                    }
                    _this.m_curModal.bShowData = _this.m_bShowData;
                    _this.m_curModal.customRule = _this.$divEdit.html();
                    _this.m_base.showFilterCharts(_this.m_chartOption.series);
                    _this.m_base.resetIcon(arrPointId);
                    _this.m_base.setTendencyOption(_this.m_chartOption.series);

                    _this.m_screen.saveModal();
                    _this.m_screen.saveModalJudge.resolveWith(_this.m_screen, [_this.m_screen, 1,null,$('#divWSPane .selected'),_this.m_screen.curModal,false]);
                    _this.close();
                }
            });
            this.$btnCancelCust.off().click(function (e) {
                _this.close();
            });
        },
        initCheckButton: function() {
            this.$chkPtListCust.empty();
            var item;
            for (var i= 0,len=this.m_arrDsItem.length; i<len; i++) {
                if (0 == i) {
                    item = '<div class="checkbox"><label><input type="checkbox" value="' + this.m_arrDsItem[i].id + '" checked>' + this.m_arrDsItem[i].alias + '</label></div>';
                }
                else {
                    item = '<div class="checkbox"><label><input type="checkbox" value="' + this.m_arrDsItem[i].id + '">' + this.m_arrDsItem[i].alias + '</label></div>';
                }
                this.$chkPtListCust.append(item);
            }
        },
        initVarGrid: function() {
            this.$mathCfgDataCust.empty();
            var item;
            for (var i= 0,len=this.m_arrDsItem.length; i<len; i++) {
                item = $('<div class="row">\
                                <div class="col-xs-12 varRow">\
                                    <div class="col-xs-4 formulaVarName"><input type="text" name="inputVarValue" class="varNameChange">' + this.m_arrDsItem[i].alphabet + '</div>\
                                    <div class="col-xs-6 divVarValue" varid="' + this.m_arrDsItem[i].id + '">' + this.m_arrDsItem[i].alias + '</div>\
                                </div>\
                            </div>');
                this.$mathCfgDataCust.append(item);
            }
        },
        initShowData: function() {
            var _this = this;
            this.showDataInCustomFilter(_this.m_bShowData);
            this.$btnDataShow.off().click(function (e) {
                _this.m_bShowData = !_this.m_bShowData;
                _this.showDataInCustomFilter(_this.m_bShowData);
            });

            for (var i = 0, len = this.m_arrDsItem.length; i < len; i++) {
                var setVal = 'var ' + this.m_arrDsItem[i].alphabet + ' = [';
                for (var j = 0, len2 = this.m_arrDsItem[i].arrData.length; j < len2 - 1; j++) {
                    setVal += this.m_arrDsItem[i].arrData[j] + ', ';
                }
                setVal += this.m_arrDsItem[i].arrData[len2 - 1] + '];';
                var divSet = $('<div>' + setVal + '</div>');
                this.$divShow.append(divSet);
            }

            var rule = this.m_curModal.customRule;
            if (rule) {
                this.$divEdit.html(rule);
            }
        },
        doFilterOperation: function() {
            var conditionCust = this.$divEdit.text();
            var funcLogic = null;
            var funcTime = null;

            if (!conditionCust) {
                return;
            }
            var arr = conditionCust.split(';');
            //var strRet = 'return {';
            var arrLen = arr.length;
            var arrRet = [];
            var arrTimeCnt = [];
            var arrSub = [];

            // parse time first
            for (var i = 0; i < arrLen; i++) {  // i : semicolon
                var arrTimeTemp = [];
                if (-1 != arr[i].indexOf('time')) { // find
                    arr[i] = arr[i].replace('&&', '&');
                    if (-1 != arr[i].indexOf('&')) {
                        arrSub = arr[i].split('&');
                        for (var k = 0, len3 = arrSub.length; k < len3; k++) {  // k : &&
                            funcTime = new Function('v', 'return ' + arrSub[k].replace('time', 'v'));
                            for (var j = 0, len2 = this.m_arrTimeStr.length; j < len2; j++) {  // j : time array
                                if (funcTime(this.m_arrTimeStr[j])) {
                                    if (0 == k) {
                                        arrTimeTemp.push(true);
                                    }
                                    else {
                                        arrTimeTemp[j] = (arrTimeTemp[j] && true) ? true : false;
                                    }
                                }
                                else {
                                    if (0 == k) {
                                        arrTimeTemp.push(false);
                                    }
                                    else {
                                        arrTimeTemp[j] = false;
                                    }
                                }
                            }
                        }
                    }
                    else {
                        funcTime = new Function('v', 'return ' + arr[i].replace('time', 'v'));
                        for (var j = 0, len2 = this.m_arrTimeStr.length; j < len2; j++) {
                            if (funcTime(this.m_arrTimeStr[j])) {
                                arrTimeCnt.push(true);
                            }
                            else {
                                arrTimeCnt.push(false);
                            }
                        }
                    }

                    if (0 == arrTimeCnt.length) {
                        arrTimeCnt = arrTimeTemp;
                    }
                    else {
                        for (var m = 0, len4 = arrTimeTemp.length; m < len4; m++) {
                            arrTimeCnt[m] = (arrTimeCnt[m] | arrTimeTemp[m]) ? true : false;
                        }
                    }
                }
            }

            for (var i = 0; i < arrLen; i++) {
                if (-1 != arr[i].indexOf('time')) { // time部分不显示
                    continue;
                }
                var alphabet = this.getAlphabet(arr[i]);
                if (alphabet) {
                    var arrData = [];
                    var pointId;
                    for (var j = 0, len2 = this.m_arrDsItem.length; j < len2; j++) {
                        if (alphabet == this.m_arrDsItem[j].alphabet) {
                            arrData = this.m_arrDsItem[j].arrData;
                            pointId = this.m_arrDsItem[j].id;
                            break;
                        }
                    }
                    var arrFilter = [];
                    funcLogic = new Function('v', 'return ' + arr[i].replace(alphabet, 'v'));
                    for (var k = 0, len3 = arrData.length; k < len3; k++) {
                        //var temp = arr[i].replace(alphabet, arrData[k]);
                        //if (eval(temp)) {
                        if(funcLogic(arrData[k])) {
                            arrFilter.push(arrData[k]);
                        }
                        else {
                            arrFilter.push(undefined);
                        }
                    }
                    if (arrTimeCnt.length > 0) {
                        for (var k = 0, len3 = arrData.length; k < len3; k++) {
                            if (!arrTimeCnt[k]) {
                                arrFilter[k] = undefined;
                            }
                        }
                    }
                    var obj = {'list':[{'data':arrFilter, 'dsItemId':pointId}], 'timeShaft':this.m_arrTimeStr}
                    var item = {
                        appendData: [],
                        cycleLen: undefined,
                        filterCondition: arr[i],
                        filterDrawObj: obj,
                        filterType: 0,
                        pointId: pointId,
                        showType: 0,
                        timeCycle: '',
                        timeEnd: '',
                        timeStart: '',
                        valLen: undefined
                    };
                    arrRet.push(item);

                    this.m_curModal.dictShowData[pointId + '_filter'] = arrFilter;
                }
            }
            return arrRet;

            //for (var i = 0; i < len; i++) {
            //    var alphabet = this.getAlphabet(arr[i]);
            //    if (alphabet) {
            //        showData += this.parseCondition(alphabet, arr[i]);
            //        strRet += this.parseReturn(alphabet);
            //    }
            //}
            //strRet = strRet.substr(0, strRet.length - 1);
            //strRet += '}';
            //showData += strRet;
            //return new Function('', showData)();
        },
        getAlphabet: function(src) {
            var ret;
            for (var i = 0, len = this.m_arrFlag.length; i < len; i++) {
                if (-1 != src.indexOf(this.m_arrFlag[i])) {
                    ret = this.m_arrFlag[i];
                    break;
                }
            }
            if (ret) {
                return ret.toLowerCase();
            }
            else {
                return null;
            }
        },
        parseCondition: function (alphabet, src) {
            return alphabet + ' = ' + alphabet + '.filter(function (' + alphabet + ') { return ' + src + '; });';
        },
        parseReturn: function(alphabet) {
            var id, ret;
            for (var i = 0, len = this.m_arrDsItem.length; i < len; i++) {
                if (alphabet == this.m_arrDsItem[i].alphabet) {
                    id = this.m_arrDsItem[i].id;
                    break;
                }
            }
            if (id) {
                ret = '"' + id + '":' + alphabet + ',';
            }
            return ret;
        },
        doFilterOperationEx: function() {
            var text = this.$divEdit.text();
            if (!text) {
                return null;
            }
            //for (var i = 0, len = this.m_arrDsItem.length; i < len; i++) {
            //    eval('var ' + this.m_arrDsItem[i].alphabet + ' = [' + this.m_arrDsItem[i].arrData + '];');
            //}

            var arrChk = this.$chkPtListCust.find('input');
            var arrPtId = [];
            for (var i = 0, len = arrChk.length; i < len; i++) {
                if (this.$chkPtListCust.find('input')[i].checked) {
                    arrPtId.push(this.$chkPtListCust.find('input')[i].value);
                }
            }
            if (arrPtId.length <= 0) {
                alert(I18n.resource.analysis.dataFilter.ERR1);
                return;
            }

            text = text.replace(/.year/g, '.getFullYear()');
            text = text.replace(/.month/g, '.getMonth() + 1');
            text = text.replace(/.weekday/g, '.getDay() + 1');
            text = text.replace(/.day/g, '.getDate()');
            text = text.replace(/.hour/g, '.getHours() + 1');
            text = text.replace(/.minute/g, '.getMinutes() + 1');
            text = text.replace(/.second/g, '.getSeconds() + 1');
            text = text.replace(/TIME/g, 'new Date(arrTime[i])');

            var content;
            content = 'function fn() {'
            for (var i = 0, len = this.m_arrDsItem.length; i < len; i++) {
                content += 'var ' + this.m_arrDsItem[i].alphabet + '=[' + this.m_arrDsItem[i].arrData + '];';
            }
            content += 'var arrTime=[';// + this.m_arrTimeStr + '];';
            for (var i = 0, len = this.m_arrTimeStr.length; i < len-1; i++) {
                content += '"' + this.m_arrTimeStr[i] + '",';
            }
            content += '"' + this.m_arrTimeStr[len-1] + '"];';
            content += 'var OUT=[];for(var i=0,len=a.length; i<len; i++){';
            content += text;
            content += '}return OUT;}';
            eval(content);
            var arrFilter = fn();
            for (var i = 0, len = arrFilter.length; i < len; i++) {
                if (!arrFilter[i] && 0 != arrFilter[i]) {
                    arrFilter[i] = undefined;
                }
            }

            var arrRet = [];
            for (var i = 0, len = arrPtId.length; i < len; i++) {
                var obj = {'list':[{'data':arrFilter, 'dsItemId':arrPtId[i]}], 'timeShaft':this.m_arrTimeStr}
                var item = {
                    appendData: [],
                    cycleLen: undefined,
                    //filterCondition: text,
                    filterDrawObj: obj,
                    filterType: 0,
                    pointId: arrPtId[i],
                    showType: 0,
                    timeCycle: '',
                    timeEnd: '',
                    timeStart: '',
                    valLen: undefined
                };
                arrRet.push(item);

                this.m_curModal.dictShowData[arrPtId[i] + '_filter'] = arrFilter;
            }
            return arrRet;
        },
        showDataInCustomFilter: function(bIsShow) {
            if (bIsShow) {
                this.$btnDataShow.text(I18n.resource.analysis.dataFilter.DATA_HIDE);
                this.$divShow.show();
            }
            else {
                this.$btnDataShow.text(I18n.resource.analysis.dataFilter.DATA_SHOW);
                this.$divShow.hide();
            }
        }
    };
    return DataCalcFilterCustom;
})();

var DataCalcFilterEd3 = (function () {
    function DataCalcFilterEd3(parent, base) {
        this.m_parent = parent;
        this.m_base = base;
        this.m_screen = base.screen;
        this.m_curModal = base.screen.curModal;
        if (!this.m_curModal.arrFilter) {
            this.m_curModal.arrFilter = [];
        }

        if (base.chart) {
            this.m_chartOption = base.chart.getOption();
            if (this.m_chartOption && this.m_chartOption.xAxis && this.m_chartOption.xAxis[0]) {
                this.m_arrTimeStr = this.m_chartOption.xAxis[0].data;
            }
        }

        this.m_filterAttr = this.m_curModal.filterAttr;
        if (!this.m_filterAttr) {
            this.m_filterAttr = 0;
        }
        this.m_arrSelPtId = this.m_curModal.arrSelectPointsId;
        if (!this.m_arrSelPtId) {
            this.m_arrSelPtId = [];
        }
        this.m_nShowType = this.m_curModal.nShowType;
        if (!this.m_nShowType) {
            this.m_nShowType = 0;
        }

        this.m_arrDsItem = [];
        this.m_arrDsId = this.m_curModal.itemDS[0].arrId;
        var arrId = this.m_arrDsId;
        var arrItem = [];
        arrItem = AppConfig.datasource.getDSItemById(arrId);
        for (var i = 0,  len = this.m_arrDsId.length; i < len; i++) {
            var id = this.m_arrDsId[i];
            for (var m = 0; m < arrItem.length; m++) {
                if (id == arrItem[m].id) {
                    var itemTemp = arrItem[m];
                    itemTemp.alphabet = this.m_parent.getAlphabetByNum(i);
                    itemTemp.arrData = this.m_curModal.dictShowData[id];
                    itemTemp.bSelected = ((1 == len) ? (this.m_arrSelPtId.splice(0, 1, id), true) : this.findIdInSelectedArray(id));
                    this.m_arrDsItem.push(itemTemp);
                    break;
                }
            }
            //var itemTemp = AppConfig.datasource.getDSItemById(id);
            //itemTemp.alphabet = this.m_parent.getAlphabetByNum(i);
            //itemTemp.arrData = this.m_curModal.dictShowData[id];
            //itemTemp.bSelected = ((1 == len) ? (this.m_arrSelPtId.splice(0, 1, id), true) : this.findIdInSelectedArray(id));
            //this.m_arrDsItem.push(itemTemp);
        }
        this.m_bShowData = (this.m_curModal.bShowData || undefined == this.m_curModal.bShowData) ? true : false;

        this.$wrap;
        this.$page;
        this.m_arrFlag = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'Y', 'W', 'X', 'Y', 'Z'];

        this.m_dictShowData = this.m_curModal.dictShowData;
    };
    DataCalcFilterEd3.prototype = {
        show: function ($page) {
            this.$page = $page;
            this.init();
        },
        init: function () {
            this.$btnFilterEd3 = $('#btnFilterEd3', this.$page);
            this.$btnCancelEd3 = $('#btnCancelEd3', this.$page);
            this.$mathCfgDataEd3 = $('#varConfigDataEd3', this.$page);
            this.$divShow = $('#divShowDataEd3', this.$page);
            this.$divEdit = $('#divEditEd3', this.$page);
            this.$btnDataShow = $('#btnDataShowEd3', this.$page);
            this.$btnFilterCond = $('#btnFilterCondition', this.$page);
            this.$btnCustRule = $('#btnCustomRule', this.$page);
            this.$divFilterCond = $('#divFilterCondition', this.$page);
            this.$divCustRule = $('#divCustomRule', this.$page);
            this.$filterCodition =  $('#filterConditionEd3', this.$page);
            this.$btnLogicAnd =  $('#btnLogicAndEd3', this.$page);
            this.$btnLogicOr =  $('#btnLogicOrEd3', this.$page);
            this.$btnLogicNot =  $('#btnLogicNotEd3', this.$page);
            this.$radioShowNone = $('#radioShowNoneEd3', this.$page);
            this.$radioShowColor = $('#radioShowColorEd3', this.$page);
            this.initCloseControl();
            this.initVarGrid();
            this.initShowData();
            this.initFilterCondition();
            this.initConfigButton();
            this.initRadioShowType();
        },
        close: function() {
            this.m_parent.close();
        },
        initCloseControl: function() {
            var _this = this;
            this.$btnFilterEd3.off().click(function (e) {
                if (_this.m_arrSelPtId.length <= 0) {
                    alert('Please select point.');
                    return;
                }

                _this.m_curModal.filterAttr = _this.m_filterAttr;
                _this.m_curModal.arrSelectPointsId = _this.m_arrSelPtId;
                _this.m_curModal.nShowType = _this.m_nShowType;
                if (0 == _this.m_filterAttr) {
                    _this.filterOperationCheckButton();
                }
                else if (1 == _this.m_filterAttr) {
                    var arrFilterRes = _this.doFilterOperationEx();
                    if (!arrFilterRes) {
                        return;
                    }

                    _this.m_curModal.arrFilter = arrFilterRes;
                    var arrPointId = [];
                    for (var i = 0, len = arrFilterRes.length; i < len; i++) {
                        var pointId = arrFilterRes[i].pointId;
                        arrPointId.push(pointId);
                        _this.m_screen.curModal.dictShowFlag[pointId] = false;
                        _this.m_screen.curModal.dictShowFlag[pointId + '_filter'] = true;
                        _this.m_base.resetShowData(arrFilterRes[i], 1);  // filter data

                        for (var q = 0, lenQ = _this.m_chartOption.series.length; q < lenQ; q++) {
                            if (pointId == _this.m_chartOption.series[q].id) {
                                _this.m_chartOption.series[q].data = [];
                                break;
                            }
                        }
                    }
                    _this.m_curModal.bShowData = _this.m_bShowData;
                    _this.m_curModal.customRule = _this.$divEdit.html();
                    _this.m_base.showFilterCharts(_this.m_chartOption.series);
                    _this.m_base.resetIcon(arrPointId);
                    _this.m_base.setTendencyOption(_this.m_chartOption.series);

                    _this.m_screen.saveModal();
                    _this.m_screen.saveModalJudge.resolveWith(_this.m_screen, [_this.m_screen, 1,null,$('#divWSPane .selected'),_this.m_screen.curModal,false]);
                    _this.close();
                }
                else {
                    return;
                }
            });
            this.$btnCancelEd3.off().click(function (e) {
                _this.close();
            });
        },
        initVarGrid: function() {
            var _this = this;
            var $item;
            this.$mathCfgDataEd3.empty();
            for (var i= 0,len=this.m_arrDsItem.length; i<len; i++) {
                $item = $('<tr varId="' + this.m_arrDsItem[i].id + '">\
                            <td>' + this.m_arrDsItem[i].alias + '</td>\
                            <td>' + this.m_arrDsItem[i].alphabet + '</td>\
                            <td><span class="glyphicon glyphicon-ok" aria-hidden="true" style="display:none"></span></td>\
                        </tr> ');
                if (this.m_arrDsItem[i].bSelected) {
                    $item.addClass('gridSelectRow');
                    $item.find('.glyphicon').css('display', 'inline');
                }
                $item.off().click(function(e) {
                    // set and clear
                    var $tarRow = $(e.currentTarget);
                    if ($tarRow) {
                        var id = $tarRow.attr('varId');
                        var bFind = false;
                        var i = 0;
                        for (var len = _this.m_arrSelPtId.length; i < len; i++) {
                            if (id == _this.m_arrSelPtId[i]) {
                                bFind = true;
                                break;
                            }
                        }
                        if (bFind) {    // remove
                            _this.m_arrSelPtId.splice(i, 1);
                            $tarRow.removeClass('gridSelectRow');
                            $tarRow.find('.glyphicon').css('display', 'none');
                        }
                        else {  // add
                            _this.m_arrSelPtId.push(id);
                            $tarRow.addClass('gridSelectRow');
                            $tarRow.find('.glyphicon').css('display', 'inline');
                        }
                    }
                });
                this.$mathCfgDataEd3.append($item);
            }
        },
        initShowData: function() {
            var _this = this;
            this.showDataInCustomFilter(_this.m_bShowData);
            this.$btnDataShow.off().click(function (e) {
                _this.m_bShowData = !_this.m_bShowData;
                _this.showDataInCustomFilter(_this.m_bShowData);
            });

            for (var i = 0, len = this.m_arrDsItem.length; i < len; i++) {
                var setVal = 'var ' + this.m_arrDsItem[i].alphabet + ' = [';
                for (var j = 0, len2 = this.m_arrDsItem[i].arrData.length; j < len2 - 1; j++) {
                    setVal += this.m_arrDsItem[i].arrData[j] + ', ';
                }
                setVal += this.m_arrDsItem[i].arrData[len2 - 1] + '];';
                var divSet = $('<div>' + setVal + '</div>');
                this.$divShow.append(divSet);
            }

            var rule = this.m_curModal.customRule;
            if (rule) {
                this.$divEdit.html(rule);
            }
        },
        initFilterCondition: function() {
            this.$filterCodition.mathquill('editable');

            var arrFilter = this.m_curModal.arrFilter;
            var codition;
            for (var i= 0,len=arrFilter.length; i<len; i++) {
                if (true) {
                    codition = arrFilter[i].filterCondition;
                    break;
                }
            }
            if (codition) {
                this.$filterCodition.mathquill('latex', codition);
            }
        },
        initConfigButton: function() {
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

            this.setFilterAttribute(this.m_filterAttr);
            this.$btnFilterCond.click(function (e) {
                _this.setFilterAttribute(0);
            });
            this.$btnCustRule.click(function (e) {
                _this.setFilterAttribute(1);
            });
        },
        initRadioShowType: function() {
            this.$radioShowNone.next().text(I18n.resource.analysis.dataFilter.SHOW_NONE);
            this.$radioShowColor.next().text(I18n.resource.analysis.dataFilter.SHOW_DOT);
            if (0 == this.m_nShowType) {
                this.$radioShowNone.click();
            }
            else {
                this.$radioShowColor.click();
            }

            var _this = this;
            this.$radioShowNone.click(function(e) {
                _this.m_nShowType = 0;
            });
            this.$radioShowColor.click(function(e) {
                _this.m_nShowType = 1;
            });
        },
        setFilterAttribute: function(val) {
            if (!val && 0 != val) {
                return;
            }
            this.m_filterAttr = val;
            if (0 == val) {
                this.$btnFilterCond.removeClass('btnFilterCfgDisable');
                this.$btnCustRule.addClass('btnFilterCfgDisable');
                this.$divFilterCond.css('display', 'block');
                this.$divCustRule.css('display', 'none');
            }
            else if (1 == val) {
                this.$btnFilterCond.addClass('btnFilterCfgDisable');
                this.$btnCustRule.removeClass('btnFilterCfgDisable');
                this.$divFilterCond.css('display', 'none');
                this.$divCustRule.css('display', 'block');
            }
            else {}
        },
        findIdInSelectedArray: function(id) {
            var bFind = false;
            for (var i = 0, len = this.m_arrSelPtId.length; i < len; i++) {
                if (id == this.m_arrSelPtId[i]) {
                    bFind = true;
                    break;
                }
            }
            return bFind;
        },
        doFilterOperationEx: function() {
            var text = this.$divEdit.text();
            if (!text) {
                return null;
            }

            text = text.replace(/.year/g, '.getFullYear()');
            text = text.replace(/.month/g, '.getMonth() + 1');
            text = text.replace(/.weekday/g, '.getDay() + 1');
            text = text.replace(/.day/g, '.getDate()');
            text = text.replace(/.hour/g, '.getHours() + 1');
            text = text.replace(/.minute/g, '.getMinutes() + 1');
            text = text.replace(/.second/g, '.getSeconds() + 1');
            text = text.replace(/TIME/g, 'new Date(arrTime[i])');

            var content;
            content = 'function fn() {'
            for (var i = 0, len = this.m_arrDsItem.length; i < len; i++) {
                content += 'var ' + this.m_arrDsItem[i].alphabet + '=[' + this.m_arrDsItem[i].arrData + '];';
            }
            content += 'var arrTime=[';// + this.m_arrTimeStr + '];';
            for (var i = 0, len = this.m_arrTimeStr.length; i < len-1; i++) {
                content += '"' + this.m_arrTimeStr[i] + '",';
            }
            content += '"' + this.m_arrTimeStr[len-1] + '"];';
            //content += 'var OUT=[];for(var i=0,len=a.length; i<len; i++){';
            content += text;
            content += 'return OUT;}';
            eval(content);
            var arrFilter = fn();
            for (var i = 0, len = arrFilter.length; i < len; i++) {
                if (!arrFilter[i] && 0 != arrFilter[i]) {
                    arrFilter[i] = undefined;
                }
            }

            var arrPtId = this.m_arrSelPtId;
            var arrRet = [];
            for (var i = 0, len = arrPtId.length; i < len; i++) {
                var obj = {'list':[{'data':arrFilter, 'dsItemId':arrPtId[i]}], 'timeShaft':this.m_arrTimeStr}
                var item = {
                    appendData: [],
                    cycleLen: undefined,
                    //filterCondition: text,
                    filterDrawObj: obj,
                    filterType: 0,
                    pointId: arrPtId[i],
                    showType: 0,
                    timeCycle: '',
                    timeEnd: '',
                    timeStart: '',
                    valLen: undefined
                };
                arrRet.push(item);

                this.m_curModal.dictShowData[arrPtId[i] + '_filter'] = arrFilter;
            }
            return arrRet;
        },
        showDataInCustomFilter: function(bIsShow) {
            if (bIsShow) {
                this.$btnDataShow.text(I18n.resource.analysis.dataFilter.DATA_HIDE);
                this.$divShow.show();
            }
            else {
                this.$btnDataShow.text(I18n.resource.analysis.dataFilter.DATA_SHOW);
                this.$divShow.hide();
            }
        },
        filterOperationCheckButton: function() {
            var _this = this;
            var condition = this.$filterCodition.mathquill('latex');
            if (!condition) {
                alert('Please input filter condition !');
                this.$filterCodition.select();
                return;
            }
            // simple check
            var arrFlag = ['+', '-', '*', '/', '<', '>', '=', '&', '|', '!'];
            var bFind = false;
            for (var i = 0, len = arrFlag.length; i < len; i++) {
                if (-1 != condition.indexOf(arrFlag[i])) {
                    bFind = true;
                    break;
                }
            }
            if (!bFind) {
                alert('Please input correct filter condition !');
                return;
            }

            var arrPtId = this.m_arrSelPtId;
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
                WebAPI.post('/expressAnalysis/calc', postData).done(function (res) {
                    if (res.error) {
                        _this.close();
                        return;
                    }

                    for (var i = 0, len = res.data.length; i < len; i++) {
                        if (!res.data[i]) {
                            res.data[i] = undefined;
                        }
                    }

                    var id = '';
                    for (var i = 0, len = _this.m_arrDsItem.length; i < len; i++) {
                        if (res.name == _this.m_arrDsItem[i].alphabet) {
                            id = _this.m_arrDsItem[i].id;
                            arrTargetId.push(id);
                            break;
                        }
                    }

                    var item = {
                        'pointId': id,
                        'filterCondition': condition,
                        'filterType' : '',
                        'timeStart' : '',
                        'valLen' : 0,
                        'cycleLen' : 0,
                        'timeEnd' : '',
                        'timeCycle' : 0,
                        'showType' : _this.m_nShowType,
                        'filterDrawObj' : {},
                        'appendData' : []
                    };

                    var filterVal = res.data;
                    var redrawObj = {list:[], timeShaft:[]};
                    redrawObj.list.push({'dsItemId':id, 'data':filterVal});
                    redrawObj.timeShaft = _this.m_arrTimeStr;
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
    return DataCalcFilterEd3;
})();
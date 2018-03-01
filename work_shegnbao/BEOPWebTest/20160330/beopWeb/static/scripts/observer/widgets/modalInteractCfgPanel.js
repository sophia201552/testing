var ModalInteractCfgPanel = (function () {
    var _this;
    function ModalInteractCfgPanel(parent) {
        _this = this;
        _this.$modalParent = parent;
        _this.modalId = parent.modalId;
        _this.option = parent.modal.option;
    }
    ModalInteractCfgPanel.prototype.show = function () {
        var domPanelContent = document.getElementById('paneCenter');
        if (domPanelContent) {
            Spinner.spin(domPanelContent);
        }
        WebAPI.get('/static/views/observer/widgets/modalInteractCfgPanel.html').done(function (html) {
            _this.$wrap = $('<div class="modal-db-history-wrap" id="modalInteractCfgPanelWrap">').appendTo(domPanelContent).html(html);
            _this.$modal = _this.$wrap.children('.modal');
            _this.$modal.modal('show');
            _this.init();
        }).always(function(e) {
            Spinner.stop();
        });
    };
    ModalInteractCfgPanel.prototype.init = function () {
        I18n.fillArea(_this.$modal);
        _this.$selMode = $('#selMode', this.$modal);
        _this.$selInter = $('#selInterval', this.$modal);
        _this.$divTmRange = $('#divTmRange', this.$modal);
        _this.$inputStart = $('#tmStart', this.$modal);
        _this.$inputEnd = $('#tmEnd', this.$modal);
        _this.$divTmLast = $('#divTmLast', this.$modal);
        _this.$inputPerVal = $('#inputPeriodValue', this.$modal);
        _this.$selPerUnit = $('#selPeriodUnit', this.$modal);
        _this.$btnOk = $('#btnOk', this.$modal);

        // 添加事件
        _this.attachEvents();
    };
    ModalInteractCfgPanel.prototype.attachEvents = function () {
        _this.$selMode.change(function (e) {
            var $opt = _this.$selInter.children('option');
            var flag = $(e.currentTarget).val();
            switch(flag) {
                case 'fixed':
                    $opt.eq(0).css('display', 'block');
                    $opt.eq(1).css('display', 'block');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'block');
                    _this.$divTmRange.css('display', 'inline-block');//
                    _this.$divTmLast.css('display', 'none');
                    break;
                case 'recent':
                    $opt.eq(0).css('display', 'block');
                    $opt.eq(1).css('display', 'block');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'none');
                    $opt.eq(4).css('display', 'none');
                    _this.$divTmRange.css('display', 'none');
                    _this.$divTmLast.css('display', 'inline-block');//
                    var temp = _this.$selInter.val();
                    if ('d1' == temp || 'M1' == temp) {
                        _this.$selInter.val('h1');
                    }
                    break;
                default:
                    break;
            }
        });

        var tmNow = new Date();
        var tmStart = new Date();
        tmStart.setFullYear(tmNow.getFullYear() - 10);
        _this.$inputStart.val(tmNow.format('yyyy-MM-dd HH:mm:00'));
        _this.$inputStart.css('background-color', '#f4f6f8');
        _this.$inputStart.css('border', '1px solid #27334b');
        _this.$inputStart.css('color', '#646464');
        _this.$inputStart.css('border-radius', '0.5em 0 0 0.5em');
        _this.$inputStart.css('margin-right', '-5px');
        _this.$inputStart.datetimepicker({
            format: 'yyyy-mm-dd hh:mm:00',
            startView: 'month',
            minView: 'hour',
            autoclose: true,
            todayBtn: false,
            pickerPosition: 'bottom-right',
            initialDate: tmNow,
            startDate: tmStart,
            endDate: tmNow,
            keyboardNavigation: false
        }).off('changeDate').on('changeDate',function(ev){
        });
        _this.$inputEnd.val(tmNow.format('yyyy-MM-dd HH:mm:00'));
        _this.$inputEnd.css('background-color', '#f4f6f8');
        _this.$inputEnd.css('border', '1px solid #27334b');
        _this.$inputEnd.css('color', '#646464');
        _this.$inputEnd.css('border-radius', '0 0.5em 0.5em 0');
        _this.$inputEnd.datetimepicker({
            format: 'yyyy-mm-dd hh:mm:00',
            startView: 'month',
            minView: 'hour',
            autoclose: true,
            todayBtn: false,
            pickerPosition: 'bottom-right',
            initialDate: tmNow,
            startDate: tmStart,
            endDate: tmNow,
            keyboardNavigation: false
        }).off('changeDate').on('changeDate',function(ev){
        });

        _this.$btnOk.off().click(function (e) {
            var tmMode = _this.$selMode.val();
            var strStart, strEnd;
            if ('fixed' == tmMode) {
                strStart = _this.$inputStart.val();
                strEnd = _this.$inputEnd.val();
            }
            else if ('recent' == tmMode) {
                var tmStart = new Date();
                var periodVal = parseInt(_this.$inputPerVal.val());
                if (!periodVal) {
                    alert('Please input time !');
                    return;
                }
                var periodUnit = _this.$selPerUnit.val();
                switch (periodUnit) {
                    case 'hour':
                        var time = tmNow.getTime() - 3600000 * periodVal;
                        tmStart.setTime(time);
                        break;
                    case 'day': // only be used now
                        var time = tmNow.getTime() - 86400000 * (periodVal - 1);
                        tmStart.setTime(time);
                        tmStart.setHours(0);
                        tmStart.setMinutes(0);
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
                tmNow.setHours(23);
                tmNow.setMinutes(59);
                strEnd = tmNow.format('yyyy-MM-dd HH:mm:00');
            }
            else {
                alert('Please select mode !');
                return;
            }

            if (_this.modalId) {
                for (var i = 0; i < _this.$modalParent.arrModal.length; i++) {
                    var item = _this.$modalParent.arrModal[i];
                    if (item) {
                        if (_this.modalId == item.id) {
                            if (!item.modal.option) {
                                item.modal.option = {};
                                item.modal.option.dictPtStatus = {};
                            }
                            item.modal.option.timeMode = tmMode;
                            item.modal.option.interval = _this.$selInter.val();
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
            _this.$modalParent.screen.saveLayoutOnly();
            _this.$modalParent.drawChartsEx(item.modal.option, _this.modalId);
        });

        if (_this.option) {
            _this.$selMode.val(_this.option.timeMode);
            _this.$selInter.val(_this.option.interval);
            _this.$inputStart.val(_this.option.timeStart);
            _this.$inputEnd.val(_this.option.timeEnd);
            _this.$inputPerVal.val(_this.option.periodVal);
            _this.$selPerUnit.val('day'/*_this.option.periodUnit*/);
            if ('recent' == _this.option.timeMode) {
                _this.$selMode.change();
            }
        }
    };

    return ModalInteractCfgPanel;
})();
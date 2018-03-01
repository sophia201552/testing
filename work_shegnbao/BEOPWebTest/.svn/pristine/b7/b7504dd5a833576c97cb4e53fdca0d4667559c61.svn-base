var AlarmLogging = (function () {
    var _this = this;

    var ALARM_RULE_NAME = 'alarm_rules';

    // enums
    var alarmMode = {
        LIMIT_VALUE: 0,
        LIMIT_VALUE_TITLE: 'Limit-Value Alarm Mode',
        BOOL: 1,
        BOOL_TITLE: 'Bool Alarm Mode',
        DIAGNOSIS: 2,
        DIAGNOSIS_TITLE: 'Diagnosis Alarm Mode'
    };

    var util = {
        date: {
            // format Date object to string
            // yyyy-mm-dd HH:MM:SS
            formatString: function (d) {
                var year     = d.getFullYear();
                var month    = d.getMonth();
                var dayMonth = d.getDate();
                var hours    = d.getHours();
                var minutes  = d.getMinutes();
                var seconds  = d.getSeconds();

                month    = month < 10 ? '0'+(month+1) : month+1;
                dayMonth = dayMonth < 10 ? '0'+dayMonth : dayMonth;
                hours    = hours < 10 ? '0'+hours : hours;
                minutes  = minutes < 10 ? '0'+minutes : minutes;
                seconds  = seconds < 10 ? '0'+seconds : seconds;

                return [year, month, dayMonth].join('-') + ' ' + [hours, minutes, seconds].join(':');
            }
        },
        checkbox: {
            // select all
            selectAll: function ($eles) {
                $eles.each(function () {
                    var $this = $(this);
                    if(!$this.is(':checked')) $this.prop('checked', true);
                });
            },
            // select inverse
            selectInverse: function ($eles) {
                $eles.each(function (i) {
                    var $this = $(this);
                    $this.prop('checked', $this.is(':checked') ? false : true);
                });
            },
            // cancel select
            unSelectAll: function ($eles) {
                $eles.each(function (i) {
                    var $this = $(this);
                    if($this.is(':checked')) $this.prop('checked', false);
                });
            },
            isAllChecked: function ($eles) {
                return $eles.not(':checked').length <= 0;
            },
            // if there only one checkbox checked, forbidden that checkbox
            keepOneCheckbox: function ($cbs) {
                var $checkedCb = $cbs.filter(':checked');
                if($checkedCb.length <= 1) {
                    $checkedCb.prop('disabled', true);
                } else {
                    $cbs.prop('disabled', false);
                }
            }
        }
    };

    function AlarmLogging() {
        _this = this;
        this.timer = null;
        this.onmessage_global = BackgroundWorkers.alarmReporter.onmessage;
    }

    AlarmLogging.prototype = {
        show: function () {
            Spinner.spin(ElScreenContainer);
            $("#ulPages li").removeClass("active");
            $("#page-DataWatch").parent().addClass("active");

            $.get("/static/views/observer/widgets/alarmLogging.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();
            }).always(function () {
                Spinner.stop();
            });
        },
        init: function () {
            this.$alarmLoggingPane = $('#alarmLoggingPane');
            this.$btnClose         = $('#btnClose');
            // alarm list page
            this.$iptStartTime     = $('#iptStartTime');
            this.$iptEndTime       = $('#iptEndTime');
            this.$panelLog         = $('#panelLog');
            this.$tbAlarm          = $('#tbAlarm');
            this.$btnAlarmSrch     = $('#btnAlarmSrch');
            this.$btnReload        = $('#btnReload');
            this.$spLoading        = this.$btnReload.children('span');
            this.$btnCog           = $('#btnConfig');
            
            // alarm rule config page
            this.$btnAddRule       = $('#btnAddRule');
            this.$btnDelRule       = $('#btnDelRule');
            this.$tbRule           = $('#tbRule');
            this.$panelCog         = $('#panelCog');
            this.$btnRuleSrch      = $('#btnRuleSrch');
            this.$iptRuleSrch      = $('#iptRuleSrch');
            this.$btnLogList       = $('#btnLogList');
            this.$btnSelectAll     = $('#btnSelectAll');
            this.$cbSelectAll      = this.$btnSelectAll.children('input');
            this.$lkSelectAll      = $('#lkSelectAll');
            this.$lkSelectInverse  = $('#lkSelectInverse');
            this.$lkUnSelectAll    = $('#lkUnSelectAll');
            
            // add/edit config rule pop modal
            this.$ruleModal        = $('#ruleModal');
            this.$divRuleForm      = $('#divRuleForm');
            this.$divAlarmInfo     = $('#divAlarmInfo');
            this.$divRuleEnable    = $('#divRuleEnable');
            this.$divRuleValue     = $('#divRuleValue');
            this.$divAlarmLevel    = $('#divAlarmLevel');
            this.$cbLL             = $('#cbLL');
            this.$cbL              = $('#cbL');
            this.$cbH              = $('#cbH');
            this.$cbHH             = $('#cbHH');
            this.$iptLL            = $('#iptLL');
            this.$iptL             = $('#iptL');
            this.$iptH             = $('#iptH');
            this.$iptHH            = $('#iptHH');
            this.$iptLLInfo        = $('#iptLLInfo');
            this.$iptLInfo         = $('#iptLInfo');
            this.$iptHInfo         = $('#iptHInfo');
            this.$iptHHInfo        = $('#iptHHInfo');
            this.$iptPointName     = $('#iptPointName');
            this.$iptAlarmInfo     = $('#iptAlarmInfo');
            this.$iptAlarmLevel    = $('#iptAlarmLevel');
            this.$btnRuleSubmit    = $('#btnRuleSubmit');
            this.$divFormTip       = $('#divFormTip');
            // alarm mode dropdown
            this.$ddAlarmMode      = $('#ddAlarmMode');
            this.$btnAlarmMode     = this.$ddAlarmMode.find('button');
            this.$spAlarmModeTitle = this.$btnAlarmMode.find('span').eq(0);
            this.$lkAlarmModeItems = this.$ddAlarmMode.find('ul>li>a');

            // initialize the datetimepicker
            // Deprecate
            $(".form-datetime").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss',
                autoclose: true,
                todayBtn: true,
                minuteStep: 20
            });
            this.attachEvents();
            this.initTable();
            // resize the page according to the client height
            this.resize();
            // default datetime is now
            // Deprecate
            this.$iptEndTime.val(util.date.formatString(new Date())).datetimepicker('update');
            // start auto load
            this.startAutoload();
            // initialize the rule config modal validator
            this.initFormValidation();
        },
        startAutoload: function (runAtStart) {
            runAtStart = (runAtStart === undefined || runAtStart === null) ? true : runAtStart;
            // load the table manual
            runAtStart && this.$btnReload.trigger('click');
            // modify the BackgroundWorkers.alarmReporter.onmessage
            BackgroundWorkers.alarmReporter.onmessage = function (e) {
                var rs = e.data;
                if(rs.status === 'LOADING') {
                    _this.$tbAlarm.table('loading');
                    _this.$spLoading.addClass('loading');
                    return;
                }
                _this.reloadRecord(rs.data);
                _this.onmessage_global(e);
            };
            // this.timer = window.setInterval(function () {
            //     _this.$btnReload.trigger('click');
            // }, 10000);
        },
        stopAutoload: function () {
            BackgroundWorkers.alarmReporter.onmessage = this.onmessage_global;
        },
        initTable: function () {
            this.$tbAlarm.table({
                columns: [{
                    name: 'no',
                    title: 'No',
                    formatter: function (i, row) {
                        return i+1;
                    }
                }, {
                    name: 'time',
                    title: 'Time',
                    formatter: '{time}'
                }, {
                    name: 'bindpointname',
                    title: 'Point Name',
                    formatter: '{bindpointname}'
                }, {
                    name: 'info',
                    title: 'Info',
                    formatter: '{info}'
                }, {
                    name: 'level',
                    title: 'Level',
                    formatter: function (i, row) {
                        switch(row['level']) {
                            case 1:
                            case 2:
                                return '<span class="label label-warning">Warning</span>';
                            case 3:
                            case 4:
                            default:
                                return '<span class="label label-danger">Danger</span>';
                        }
                    }
                }, {
                    name: 'operations',
                    title: 'Operations',
                    formatter: '\
                    <div class="dropdown">\
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">\
                            Delay this alarm <span class="caret"></span>\
                        </button>\
                        <ul class="dropdown-menu" role="menu">\
                            <li data-value="30"><a href="javascript:">Delay 30 minutes</a></li>\
                            <li data-value="60"><a href="javascript:">Delay 1 hour</a></li>\
                            <li data-value="180"><a href="javascript:">Delay 3 hours</a></li>\
                            <li data-value="360"><a href="javascript:">Delay 6 hours</a></li>\
                            <li data-value="1440"><a href="javascript:">Delay 1 day</a></li>\
                        </ul>\
                    </div>'
                }]
            });

            this.$tbRule.table({
                columns: [{
                    name: 'cb',
                    title: '',
                    formatter: function (i, row) {
                        return '<input type="checkbox" data-rowindex="'+i+'" />'
                    }
                }, {
                    name: 'pointname',
                    title: 'Point',
                    formatter: '{pointname}'
                }, {
                    name: 'warningtype',
                    title: 'Warning Type',
                    formatter: function (i, row) {
                        switch(row['boolwarning']) {
                            // Limit-Value Alarm Mode
                            case alarmMode.LIMIT_VALUE:
                                return alarmMode.LIMIT_VALUE_TITLE;                               
                            // Bool Alarm Mode
                            case alarmMode.BOOL:
                                return alarmMode.BOOL_TITLE;
                            default: 
                                return 'Unknow';
                        }
                    }
                }, {
                    name: 'warninglevel',
                    title: 'Warning Level',
                    formatter: '{boolwarninglevel}'
                }, {
                    name: 'warningvalue',
                    title: 'Warning Value',
                    formatter: function (i, row) {
                        var arrHtml = [];
                        switch(row['boolwarning']) {
                            // Limit-Value Alarm Mode
                            case alarmMode.LIMIT_VALUE:
                                arrHtml.push( 'LL: ' + (row['LLEnable'] === 1 ? row['LLLimit'] : 'disabled') );
                                arrHtml.push( 'L: ' + (row['LEnable'] === 1 ? row['LLimit'] : 'disabled') );
                                arrHtml.push( 'H: ' + (row['HEnable'] === 1 ? row['HLimit'] : 'disabled'));
                                arrHtml.push( 'HH: ' + (row['HHEnable'] === 1 ? row['HHLimit'] : 'disabled'));
                                return arrHtml.join('<br/>');
                            // Bool Alarm Mode
                            case alarmMode.BOOL:
                                return '/';
                            default: 
                                return '/';
                        }
                    }
                }, {
                    name: 'warninginfo',
                    title: 'Warning Info',
                    formatter: function (i, row) {
                        var arrHtml = [];
                        switch(row['boolwarning']) {
                            // Limit-Value Alarm Mode
                            case alarmMode.LIMIT_VALUE:
                                arrHtml.push( 'LL: ' + (row['LLEnable'] === 1 ? row['LLwarninginfo'] : 'disabled') );
                                arrHtml.push( 'L: ' + (row['LEnable'] === 1 ? row['Lwarninginfo'] : 'disabled') );
                                arrHtml.push( 'H: ' + (row['HEnable'] === 1 ? row['Hwarninginfo'] : 'disabled'));
                                arrHtml.push( 'HH: ' + (row['HHEnable'] === 1 ? row['HHwarninginfo'] : 'disabled'));
                                return arrHtml.join('<br/>');
                            // Bool Alarm Mode
                            case alarmMode.BOOL:
                                return row['boolwarninginfo'];
                            default: 
                                return '/';
                        }
                    }
                }, {
                    name: 'operations',
                    title: 'Operations',
                    formatter: function (i, row) {
                        var htmlTpl = '\
                        <button class="btn btn-primary btn-rule-edit" type="button" title="edit this rule">\
                            <span class="glyphicon glyphicon-pencil"></span>\
                        </button>\
                        <button class="btn btn-primary btn-rule-del" type="button" title="delete this rule">\
                            <span class="glyphicon glyphicon-trash"></span>\
                        </button>';
                        return htmlTpl;
                    }
                }]
            });
        },
        initFormValidation: function () {
            this.$divRuleForm.validator({
                elements: [{
                    name: 'pointName',
                    selector: this.$iptPointName,
                    rules: [{
                        valid: /^.+$/,
                        msg: '"Point Name" cannot be empty!'
                    }] 
                }, {
                    name: 'alarmInfo',
                    selector: this.$iptAlarmInfo,
                    rules: [{
                        valid: /^.+$/,
                        msg: '"Alarm Info" cannot be empty!'
                    }]
                }, {
                    name: 'limitValueInfo',
                    selector: '#divRuleValue :text:enabled',
                    rules: [{
                        valid: /^.+$/,
                        msg: 'This field cannot be empty!'
                    }]
                }, {
                    name: 'alarmLevel',
                    selector: this.$iptAlarmLevel,
                    rules: [{
                        valid: /^.+$/,
                        msg: '"Alarm Level" cannot be empty!'
                    }]
                }]
            });
        },
        attachEvents: function () {
            // "close" button
            this.$btnClose.click(function (e) {
                ScreenManager.show(PaneProjectSelector);
            });

            // "go to alarm rule config page" button
            this.$btnCog.click(function (e) {
                // stop the autoload timer when the "alarm list" panel was hiden
                _this.stopAutoload();
                // switch to config panel
                _this.$panelLog.hide();
                _this.$panelCog.show();
                _this.$tbRule.table('loading');

                $.getJSON('/warning/getConfig/'+AppConfig.projectId, function (rs) {
                    _this.$tbRule.table('load', rs);
                });

                e.preventDefault();
            });

            // "go to alarm list page" button
            this.$btnLogList.click(function (e) {
                _this.$panelCog.hide();
                _this.$panelLog.show();
                // start the autoload timer when the "alarm list" panel was shown again
                _this.startAutoload();
            });

            // alarm list reload button
            this.$btnReload.click(function () {
                _this.reloadRecord();
            });

            // alarm table events
            this.$tbAlarm.on('click', '.dropdown-menu>li', function (e) {
                var $this = $(this);
                var rowIndex = parseInt($this.parents('tr').attr('data-rowindex'));
                var rowData = _this.$tbAlarm.table('getData')[rowIndex];
                var minutes = parseInt($this.attr('data-value'));
                var deadline = util.date.formatString(new Date(new Date().valueOf()+minutes*60*1000));
                var msg = 'You have chosen "{0}", this alarm will not be shown until the time below:\n{1}\nAre you sure to do this?'
                    .format($this.children('a').text(), deadline);
                // stop the autoload timer when user click the "Delay this rule" button
                _this.stopAutoload();

                if(confirm(msg)) {
                    _this.setDelayTime(rowData, deadline);
                    _this.startAutoload();
                } else {
                    _this.startAutoload(false);
                }

                e.stopPropagation();
            });

            // alarm list search button
            // Deprecate
            this.$btnAlarmSrch.click(function (e) {
                var startTime = _this.$iptStartTime.val() || '1970-01-01 00:00:00';
                var endTime = _this.$iptEndTime.val() || util.date.formatString(new Date());
                _this.$tbAlarm.table('loading');

                // get data from server
                $.getJSON('/warning/getRecord/'+AppConfig.projectId, {
                    startTime: startTime,
                    endTime: endTime
                }, function (rs) {
                    _this.$tbAlarm.table('load', rs);
                });
                e.preventDefault();
            });

            // rule search button
            this.$btnRuleSrch.click(function (e) {
                var key = _this.$iptRuleSrch.val().trim();
                // reset "Select All" checkbox
                _this.$cbSelectAll.prop('checked', false);

                if(!key) {
                    _this.$tbRule.table('filter');
                } else {
                    _this.$tbRule.table('filter', {pointname: key});
                }
                e.preventDefault();
            });

            // "add a rule" button event
            this.$btnAddRule.click(function () {
                // modify modal title
                _this.$ruleModal.find('.modal-title').text('Add Rule');
                // make "confirm button" do add stuff
                _this.$btnRuleSubmit.attr('data-action', 'add');
                _this.setModal();
                _this.$ruleModal.modal('show');
            });
            // "delete rules" button event
            this.$btnDelRule.click(function () {
                var $chosen = $('.ui-tbl-col-cb>input:checked');
                var names = [];
                var data = _this.$tbRule.table('getData');
                var index = null;
                // if there are no rows to be chosen, just return
                if($chosen.length === 0) {
                    alert('You should choose one row at least!');
                    return
                }
                $chosen.each(function (i, item) {
                    index = parseInt($(item).attr('data-rowindex'));
                    names.push(data[index]['pointname']);
                });
                _this.delRule('Are you sure to delete these rules?', names);
            });

            // select events
            // outter select all checkbox wrap button
            this.$btnSelectAll.click(function (e) {
                _this.$cbSelectAll.trigger('click');
                e.preventDefault();
            });
            // outter select all checkbox
            this.$cbSelectAll.click(function (e){
                var $ckbs = $('.ui-tbl-col-cb').children('input');
                if($(this).is(':checked')) {
                    util.checkbox.selectAll($ckbs);
                } else {
                    util.checkbox.unSelectAll($ckbs);
                }
                // prevent the click event bubble to $btnSelectAll
                e.stopPropagation();
            });
            // select all link button
            this.$lkSelectAll.click(function (e) {
                var $ckbs = $('.ui-tbl-col-cb').children('input');
                util.checkbox.selectAll($ckbs);
                _this.$cbSelectAll.prop('checked', true);
            });
            // select inverse link button
            this.$lkSelectInverse.click(function (e) {
                var $ckbs = $('.ui-tbl-col-cb').children('input');
                util.checkbox.selectInverse($ckbs);
                _this.$cbSelectAll.prop('checked', 
                    util.checkbox.isAllChecked($ckbs));
            });
            // cancel select link button
            this.$lkUnSelectAll.click(function (e) {
                var $ckbs = $('.ui-tbl-col-cb').children('input');
                util.checkbox.unSelectAll($ckbs);
                _this.$cbSelectAll.prop('checked', false);
            });
            // checkbox on every table row
            this.$tbRule.on('click', '.ui-tbl-col-cb', function () {
                var $this = $(this);
                var $ckbs = $('.ui-tbl-col-cb').children('input');
                _this.$cbSelectAll.prop('checked', 
                    util.checkbox.isAllChecked($ckbs));
            });
            
            // modal events
            // modal pop window
            this.$cbLL.click(function () {
                _this.$iptLL.add(_this.$iptLLInfo).prop('disabled', !$(this).is(':checked'));
                util.checkbox.keepOneCheckbox( _this.$divRuleEnable.find(':checkbox') );
            });
            this.$cbL.click(function () {
                _this.$iptL.add(_this.$iptLInfo).prop('disabled', !$(this).is(':checked'));
                util.checkbox.keepOneCheckbox( _this.$divRuleEnable.find(':checkbox') );
            });
            this.$cbH.click(function () {
                _this.$iptH.add(_this.$iptHInfo).prop('disabled', !$(this).is(':checked'));
                util.checkbox.keepOneCheckbox( _this.$divRuleEnable.find(':checkbox') );
            });
            this.$cbHH.click(function () {
                _this.$iptHH.add(_this.$iptHHInfo).prop('disabled', !$(this).is(':checked'));
                util.checkbox.keepOneCheckbox( _this.$divRuleEnable.find(':checkbox') );
            });

            // edit/delete rule event on every row
            this.$tbRule.on('click', '.btn-rule-edit', function () {
                var $this = $(this);
                // get row index
                var index = $this.parents('tr').attr('data-rowindex');
                // get row data
                var rowData = _this.$tbRule.table('getData')[index];
                // make "confirm button" do edit stuff
                _this.$btnRuleSubmit.attr('data-action', 'edit');

                _this.$ruleModal.find('.modal-title').text('Edit Rule');
                _this.setModal(rowData);
                _this.$ruleModal.modal('show');
            });
            this.$tbRule.on('click', '.btn-rule-del', function () {
                var $this = $(this);
                // get row index
                var index = $this.parents('tr').attr('data-rowindex');
                // get point name
                var pointName = _this.$tbRule.table('getData')[index]['pointname'];

                _this.delRule('Are you sure to delete this rule?', [pointName]);
            });

            this.$lkAlarmModeItems.click(function (e) {
                var $this = $(this);
                var value = parseInt($this.attr('data-value'));
                var title =  $this.text();
                _this.$spAlarmModeTitle.attr('data-value', value).text(title);

                switch(value) {
                    case alarmMode.LIMIT_VALUE:
                        _this.$divAlarmInfo.hide();
                        _this.$divRuleEnable.show();
                        _this.$divRuleValue.show();
                        break;
                    case alarmMode.BOOL:
                    default:
                        _this.$divAlarmInfo.show();
                        _this.$divRuleEnable.hide();
                        _this.$divRuleValue.hide();
                        break;
                }
            });
            // add/edit submit button
            this.$btnRuleSubmit.click(function () {
                var p = {}, valid;
                var url = $(this).attr('data-action') === 'add' ? '/warning/addWarningConfig/' : '/warning/modifyWarningConfig/';
                p.pointname = _this.$iptPointName.val();
                p.unitproperty01 = 0;
                p.warninglevel = _this.$iptAlarmLevel.val();
                p.warningtype = parseInt(_this.$spAlarmModeTitle.attr('data-value'));
                if(p.warningtype !== alarmMode.LIMIT_VALUE) {
                    p.HHEnable = 0;
                    p.HEnable = 0;
                    p.LEnable = 0;
                    p.LLEnable = 0;
                    p.HHLimit = 0;
                    p.HLimit = 0;
                    p.LLimit = 0;
                    p.LLLimit = 0;
                    p.HHwarninginfo = '';
                    p.Hwarninginfo = '';
                    p.Lwarninginfo = '';
                    p.LLwarninginfo = '';

                    p.boolwarninginfo = _this.$iptAlarmInfo.val();
                    // valid it
                    valid = _this.$divRuleForm.validator('not', 'limitValueInfo').valid()
                } else {
                    p.HHEnable = _this.$cbHH.is(':checked') ? 1 : 0;
                    p.HEnable = _this.$cbH.is(':checked') ? 1 : 0;
                    p.LEnable = _this.$cbL.is(':checked') ? 1 : 0;
                    p.LLEnable = _this.$cbLL.is(':checked') ? 1 : 0;
                    p.HHLimit = p.HHEnable === 1 ? parseInt(_this.$iptHH.val()) : 0;
                    p.HLimit = p.HEnable === 1 ? parseInt(_this.$iptH.val()) : 0;
                    p.LLimit = p.LEnable === 1 ? parseInt(_this.$iptL.val()) : 0;
                    p.LLLimit = p.LLEnable === 1 ? parseInt(_this.$iptLL.val()) : 0;
                    p.HHwarninginfo = p.HHEnable === 1 ? _this.$iptHHInfo.val() : '';
                    p.Hwarninginfo = p.HEnable === 1 ? _this.$iptHInfo.val() : '';
                    p.Lwarninginfo = p.LEnable === 1 ? _this.$iptLInfo.val() : '';
                    p.LLwarninginfo = p.LLEnable === 1 ? _this.$iptLLInfo.val() : '';

                    p.boolwarninginfo = '';
                    // valid it
                    valid = _this.$divRuleForm.validator('not', 'alarmInfo').valid()
                }

                if(!valid.status) return;

                Spinner.spin(_this.$ruleModal[0]);
                $.post(url+AppConfig.projectId, p)
                    .done(function (rs) {
                        rs = JSON.parse(rs);
                        if(rs.status !== 0) {
                            alert('Sorry, operation faild, we will fix this as soom as possible.');
                            return;
                        }
                        // reload table
                        _this.$tbRule.table('loading');

                        $.getJSON('/warning/getConfig/'+AppConfig.projectId, function (rs) {
                            _this.$tbRule.table('load', rs);
                        });
                    })
                    .always(function () {
                        // hide modal
                        _this.$ruleModal.modal('hide');
                        Spinner.stop();
                    });
            });

            // resize
            $(window).resize(this.resize);
        },
        // add/modify an alarm delay to localStorage
        setDelayTime: function (row, delayTime) {
            var rules = JSON.parse(localStorage.getItem(ALARM_RULE_NAME)) || {};
            var key = window.encodeURIComponent(row['bindpointname']+'_'+row['time']);
            var projectId = AppConfig.projectId;
            var datetimeNow = util.date.formatString(new Date());
            rules[projectId] = rules[projectId] || {};
            // delete overtime rules
            for (var i in rules[projectId]) {
                if (rules[projectId].hasOwnProperty(i)) {
                    if(rules[projectId][i] <= datetimeNow) delete rules[projectId][i];
                }
            }
            rules[AppConfig.projectId][key] = delayTime;
            localStorage.setItem(ALARM_RULE_NAME, JSON.stringify(rules));
        },
        // filter alarm list by custom's alarm rules
        filterByDelayRule: function (data) {
            var result = [];
            var rules = JSON.parse(localStorage.getItem(ALARM_RULE_NAME));
            var row = deadline = key = null;
            if(!rules || !(rules = rules[AppConfig.projectId])) return data;

            for (var i = 0, len = data.length; i < len; i++) {
                row = data[i];
                key = window.encodeURIComponent(row['bindpointname']+'_'+row['time']);
                if(!(deadline = rules[key])) {
                    result.push(row);
                    continue;
                }
                if(data[i]['endtime'] >= deadline) {
                    result.push(row);
                }
            }
            return result;
        },
        setModal: function (data) {
            // reset status
            this.$divRuleForm.validator('resetStatus');
            // reset value
            this.$iptPointName.val('');
            this.$iptAlarmLevel.val('');
            this.$iptAlarmInfo.val('');

            this.$iptLL.val('').prop('disabled', false);
            this.$iptL.val('').prop('disabled', true);
            this.$iptH.val('').prop('disabled', true);
            this.$iptHH.val('').prop('disabled', true);

            this.$cbLL.prop('checked', true);
            this.$cbL.prop('checked', false);
            this.$cbH.prop('checked', false);
            this.$cbHH.prop('checked', false);

            this.$iptLLInfo.val('').prop('disabled', false);
            this.$iptLInfo.val('').prop('disabled', true);
            this.$iptHInfo.val('').prop('disabled', true);
            this.$iptHHInfo.val('').prop('disabled', true);

            if(!data) {
                // make "pointname textbox" and "rule type button" abled
                this.$iptPointName.prop('disabled', false);
                this.$btnAlarmMode.prop('disabled', false);
                // default is "bool alarm type"
                this.$lkAlarmModeItems.eq(0).trigger('click');

            } else {
                // make "pointname textbox" and "rule type button" disabled
                this.$iptPointName.val(data['pointname']).prop('disabled', true);
                this.$btnAlarmMode.prop('disabled', true);

                this.$iptAlarmLevel.val(data['boolwarninglevel']);

                switch(data['boolwarning']) {
                    // Limit-Value Alarm Mode
                    case alarmMode.LIMIT_VALUE:
                        this.$lkAlarmModeItems.eq(1).trigger('click');

                        this.$iptLL.val(data['LLLimit']).prop('disabled', data['LLEnable'] === 0 ? true : false);
                        this.$iptL.val(data['LLimit']).prop('disabled', data['LEnable'] === 0 ? true : false);
                        this.$iptH.val(data['HLimit']).prop('disabled', data['HEnable'] === 0 ? true : false);
                        this.$iptHH.val(data['HHLimit']).prop('disabled', data['HHEnable'] === 0 ? true : false);
                        
                        this.$cbLL.prop('checked', data['LLEnable'] === 0 ? false : true);
                        this.$cbL.prop('checked', data['LEnable'] === 0 ? false : true);
                        this.$cbH.prop('checked', data['HEnable'] === 0 ? false : true);
                        this.$cbHH.prop('checked', data['HHEnable'] === 0 ? false : true);
                        util.checkbox.keepOneCheckbox( _this.$divRuleEnable.find(':checkbox') );

                        this.$iptLLInfo.val(data['LLwarninginfo']).prop('disabled', data['LLEnable'] === 0 ? true : false);
                        this.$iptLInfo.val(data['Lwarninginfo']).prop('disabled', data['LEnable'] === 0 ? true : false);
                        this.$iptHInfo.val(data['Hwarninginfo']).prop('disabled', data['HEnable'] === 0 ? true : false);
                        this.$iptHHInfo.val(data['HHwarninginfo']).prop('disabled', data['HHEnable'] === 0 ? true : false);
                        break;
                    // Bool Alarm Mode
                    case alarmMode.BOOL:
                        this.$iptAlarmInfo.val(data['boolwarninginfo']);
                        this.$lkAlarmModeItems.eq(0).trigger('click');
                        break;
                    default: 
                        return 'Unknow';
                }
            }
        },
        reloadRecord: function (data) {
            var startTime, endTime;

            // the button loading
            if(!data) {
                // don not break any loading, including the button loading self
                if(_this.$spLoading.hasClass('loading')) return;
                // reset the global alarm reporter
                window.BackgroundWorkers.alarmReporter.postMessage({type: 'dataAlarmRealtime', projectId: AppConfig.projectId});
            } 
            // the global loading will enter this
            else {
                // if user is loading the table now, do not do global loading
                _this.$tbAlarm.table('load', _this.filterByDelayRule(data));
                _this.$spLoading.removeClass('loading');
            }
        },
        delRule: function (msg, names) {
            msg = msg || 'Are you sure to do this operation?';
            if(confirm(msg)) {
                Spinner.spin(_this.$alarmLoggingPane[0]);
                $.post('/warning/deleteWarningConfig/'+AppConfig.projectId, {
                    pointNames: names.join('\',\'')
                })
                .done(function (rs) {
                    rs = JSON.parse(rs);
                    if(rs.status !== 0) {
                        alert('Sorry, operation faild, we will fix this as soom as possible.');
                        return;
                    }
                    // reload the rule config table
                    _this.$tbRule.table('loading');
                    $.getJSON('/warning/getConfig/'+AppConfig.projectId, function (rs) {
                        _this.$tbRule.table('load', rs);
                    });
                })
                .always(function () {
                    Spinner.stop();
                });
            }
        },
        // page resize event
        resize: function () {
            var totalHeight = $(window).height();
            // panel_1: 260
            var height = totalHeight - 278;
            if(height < 100) return;
            _this.$tbAlarm.table('setStretchHeight', height);
            _this.$tbRule.table('setStretchHeight', height);
        },
        close: function () {
            this.stopAutoload();
        }
    }

    return AlarmLogging;
})();
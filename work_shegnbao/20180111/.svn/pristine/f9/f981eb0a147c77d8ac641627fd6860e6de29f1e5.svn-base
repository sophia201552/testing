/**
 * Created by win7 on 2016/7/7.
 */
class BaseOptionWidget extends BaseConfigWidget {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
    }
}
class SelectOption extends BaseOptionWidget {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'select',
            opt: {
                attr: {
                    class: 'col-xs-12'
                }
            }
        }
    }

    setWidget() {
        //this.area.dom.className += ' row';
        this.widget.dom = document.createElement('div');
        this.widget.dom.className = 'cfgWidget cfgOptionWidget div' + this.upperCaseText(this.widget.type);
        this.widget.dom.setAttribute('type', this.widget.type);
        this.initWidgetLabel();
        this.widget.dom.appendChild(this.createWidgetDom(this.widget.opt));
        this.initWidgetAttr();
        this.initWidgetStyle();
        this.initWidgetId();
        this.area.dom.appendChild(this.widget.dom);
    }

    createWidgetDom(opt) {
        var select = document.createElement('select');
        select.className = 'form-control';
        var option;
        //if (!opt.option)return;
        for (let i = 0; i < opt.option.length; i++) {
            option = new Option();
            option.value = opt.option[i].val;
            option.text = opt.option[i].name;
            if (this.store.val == opt.option[i].val) {
                option.selected = true;
            }
            select.options.add(option);
        }
        if (!this.store.val) select.options[0].selected = true;
        return select
    }

    attachEvent() {
        $(this.widget.dom).find('select').off('change').on('change', e => {
            this.store = {
                val: e.currentTarget.value,
                name: e.currentTarget.querySelector('[value="' + e.currentTarget.value + '"]').textContent
            };
            this.setSubWidget();
            var $currentParent = $(e.currentTarget.parentNode.parentNode);
            var valueJudge = 'hour';
            if(e.currentTarget.value=='d1'){
                valueJudge = 'day';
            }else if(e.currentTarget.value=='M1'){
                valueJudge='month';
            }
            if($currentParent.attr('data-type')=='ModalHistoryChartYearOnYearLine'&&$currentParent.index()==2){
                $currentParent.siblings('.divOption').find('.divRecentTimeCustom select').val(valueJudge).trigger('change');
            }
            if($currentParent.attr('data-type')=='ModalHistoryChartYearOnYearLine'&&e.currentTarget.value==0){
                var $currentRecentTime = $currentParent.find('.divRecentTime');
                $currentRecentTime.find('[value="threeDay"]').hide();
                $currentRecentTime.find('[value="thisWeek"]').hide();
                $currentRecentTime.find('[value="lastWeek"]').hide();
                $currentRecentTime.find('[value="thisYear"]').hide();
            }
            if($currentParent.attr('data-type')=='ModalHistoryChartYearOnYearLine'&&e.currentTarget.value==1){
                var startVal = $currentParent.find('input[role="timeStart"]').val();
                var newxValMain = new Date(startVal).getTime()+86400000;
                var now = new Date();
                $currentParent.find('input[role="timeEnd"]').datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii:ss',
                    startDate: startVal,
                    todayBtn: 'linked',
                    endDate: newxValMain > now.getTime() ? now : new Date(newxValMain),
                    autoclose: true
                })
            }
        })
    }
    initData() {
        /*if(this.widget.store){
            for (let i= 0 ; i< this.widget.opt.option.length; i++){
                if (this.widget.opt.option[i].val == this.widget.store){
                    this.store = {
                        val:this.widget.opt.option[i].val,
                        name:this.widget.opt.option[i].name
                    };
                    break;
                }
            }
        }else */
        if (this.widget.data && this.widget.data.val) {
            for (let i = 0; i < this.widget.opt.option.length; i++) {
                if (this.widget.opt.option[i].val == this.widget.data.val) {
                    this.store = {
                        val: this.widget.opt.option[i].val,
                        name: this.widget.opt.option[i].name
                    };
                    return;
                }
            }
        }
        this.store = {
            val: this.widget.opt.option[0].val,
            name: this.widget.opt.option[0].name
        };
    }
}

class IntervalOption extends SelectOption {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'interval',
            opt: {
                option: [
                    { val: 'm1', name: I18n.resource.modalConfig.option.INTERVAL_MIN1 },
                    { val: 'm5', name: I18n.resource.modalConfig.option.INTERVAL_MIN5 },
                    { val: 'h1', name: I18n.resource.modalConfig.option.INTERVAL_HOUR1 },
                    { val: 'd1', name: I18n.resource.modalConfig.option.INTERVAL_DAY1 },
                    { val: 'M1', name: I18n.resource.modalConfig.option.INTERVAL_MON1 }
                ],
                attr: {
                    class: 'col-xs-3'
                }
            },
            name: I18n.resource.modalConfig.option.LABEL_INTERVAL
        }
    }
    initData() {
        if (this.widget.data && this.widget.data.val) {
            for (let i = 0; i < this.widget.opt.option.length; i++) {
                if (this.widget.opt.option[i].val == this.widget.data.val) {
                    this.store = {
                        val: this.widget.opt.option[i].val,
                        name: this.widget.opt.option[i].name
                    };
                    return;
                }
            }
        }
        this.store = {
            val: this.widget.opt.option[0].val,
            name: this.widget.opt.option[0].name
        };
    }
}
class RefreshIntervalOption extends SelectOption {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'refreshInterval',
            opt: {
                option: [

                    { val: '30s', name: I18n.resource.modalConfig.option.REAL_TIME_INTERVAL_30_SEC },
                    { val: 'm1', name: I18n.resource.modalConfig.option.REAL_TIME_INTERVAL_1_MIN },
                    { val: 'm5', name: I18n.resource.modalConfig.option.REAL_TIME_INTERVAL_5_MIN },
                    { val: '10m', name: I18n.resource.modalConfig.option.REAL_TIME_INTERVAL_10_MIN },
                    { val: '30m', name: I18n.resource.modalConfig.option.REAL_TIME_INTERVAL_30_MIN },
                    { val: 'h1', name: I18n.resource.modalConfig.option.REAL_TIME_INTERVAL_1_HOUR },
                    { val: 'd1', name: I18n.resource.modalConfig.option.REAL_TIME_INTERVAL_1_DAY },
                    { val: 'M1', name: I18n.resource.modalConfig.option.REAL_TIME_INTERVAL_1_MON }
                ],
                attr: {
                    class: 'col-xs-3'
                }
            },
            name: I18n.resource.modalConfig.option.LABEL_REAL_TIME_INTERVAL_ONE
        }
    }
}
class ModeOption extends SelectOption {
    constructor(objModal, widget, area, opt = {}) {
        super(objModal, widget, area, opt);
        this.defaultOpt = {
            type: 'mode',
            opt: {
                option: [
                    { val: '0', name: I18n.resource.modalConfig.option.MODE_CURRENT },
                    { val: '1', name: I18n.resource.modalConfig.option.MODE_FIXED },
                    { val: '2', name: I18n.resource.modalConfig.option.MODE_RECENT }
                ],
                attr: {
                    class: 'col-xs-3'
                }
            },
            name: I18n.resource.modalConfig.option.LABEL_MODE
        }
    }

}

class RecentTimeOption extends SelectOption {
    constructor(objModal, widget, area, opt = {}) {
        super(objModal, widget, area, opt);
        this.defaultOpt = {
            type: 'recentTime',
            opt: {
                option: [
                    { val: 'today', name: I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_TODAY },
                    { val: 'threeDay', name: I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THREE_DAY },
                    { val: 'yesterday', name: I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_YESTERDAY },
                    { val: 'thisWeek', name: I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THIS_WEEK },
                    { val: 'lastWeek', name: I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_LAST_WEEK },
                    { val: 'thisYear', name: I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THIS_YEAR }
                ],
                attr: {
                    class: 'col-xs-6'
                }
            },
            name: I18n.resource.modalConfig.option.LABEL_PERIOD
        }
    }
    getData() {
        var startTime, endTime, format;
        var now = new Date();
        switch (this.store.val) {
            case 'today':
                endTime = now.format('yyyy-MM-dd HH:00:00');
                startTime = new Date(now - 86400000).format('yyyy-MM-dd HH:00:00');
                format = 'h1';
                break;
            case 'threeDay':
                endTime = now.format('yyyy-MM-dd HH:00:00');
                startTime = new Date(now - 259200000).format('yyyy-MM-dd HH:00:00');
                format = 'h1';
                break;
            case 'yesterday':
                endTime = new Date(new Date().setDate(now.getDate() - 1)).format('yyyy-MM-dd 00:00:00');
                startTime = new Date(new Date().setDate(now.getDate() - 1)).format('yyyy-MM-dd 00:00:00');
                format = 'h1';
                break;
            case 'thisWeek':
                endTime = now.format('yyyy-MM-dd 00:00:00');
                startTime = new Date(now - 604800000).format('yyyy-MM-dd 00:00:00');
                format = 'd1';
                break;
            case 'lastWeek':
                endTime = new Date(now - now.getDay() * 86400000).format('yyyy-MM-dd 00:00:00');
                startTime = new Date(now - (now.getDay() + 7) * 86400000).format('yyyy-MM-dd 00:00:00');
                format = 'd1';
                break;
            case 'thisYear':
                endTime = now.format('yyyy-MM-dd 00:00:00');
                startTime = new Date(now - 31536000000).format('yyyy-MM-dd 00:00:00');
                format = 'M1';
                break;
        }
        return {
            startTime: startTime,
            endTime: endTime,
            recentTime: this.store.val,
            format: format
        }
    }

    initData() {
        if (this.widget.data) {
            for (let i = 0; i < this.widget.opt.option.length; i++) {
                if (this.widget.opt.option[i].val == this.widget.data) {
                    this.store = {
                        val: this.widget.opt.option[i].val,
                        name: this.widget.opt.option[i].name
                    };
                    break;
                }
            }
        } else {
            this.store = {
                val: this.widget.opt.option[0].val,
                name: this.widget.opt.option[0].name
            };
        }
    }
}
class TextWithSelectOption extends BaseOptionWidget {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'textWithSelect',
            opt: {
                attr: {
                    class: 'col-xs-6'
                }
            }
        }
    }
    createWidgetDom(opt) {
        var divIptGrp = document.createElement('div');
        divIptGrp.className = 'input-group';
        divIptGrp.style.width = '100%';
        var iptText = document.createElement('input');
        iptText.className = 'form-control';
        iptText.setAttribute('type', 'text');
        iptText.style.width = '50%';
        var select = document.createElement('select');
        select.className = 'form-control';
        select.style.width = '50%';
        var option;
        for (let ele in opt.option) {
            option = new Option();
            option.value = opt.option[ele].val;
            option.text = opt.option[ele].name;
            select.options.add(option);
        }
        divIptGrp.appendChild(iptText);
        divIptGrp.appendChild(select);

        return divIptGrp;
    }

    initData() {
        this.store = {};
        /*if (this.widget.store && this.widget.store.val){
            this.store.val = this.widget.store.val;
        }
        if (this.widget.store && this.widget.store.unit){
            this.store.unit = this.widget.store.unit
        }*/

        if (this.widget.data && this.widget.data.val) {
            this.store.val = this.widget.data.val;
        }
        if (this.widget.data && this.widget.data.unit) {
            this.store.unit = this.widget.data.unit;
        } else {
            this.store.unit = this.widget.opt.option[0].val
        }
    }

    attachEvent() {
        var _this = this;
        this.widget.dom.querySelector('select').onchange = function(e) {
            var currentDom = e.currentTarget?e.currentTarget:e.target;
            _this.store.unit = currentDom.value;
            _this.setSubWidget();
        };
        this.widget.dom.querySelector('input').onchange = function(e) {
            if(e.currentTarget.value>24){
                infoBox.alert('请填写不大于24的数字！');
                e.currentTarget.value = _this.store.val?_this.store.val:24;
                return;
            }
            _this.store.val = e.currentTarget.value;
        }
    }
}

class recentTimeCustomOption extends TextWithSelectOption {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'recentTimeCustom',
            opt: {
                option: [
                    { val: 'hour', name: I18n.resource.modalConfig.option.PERIOD_UNIT_HOUR },
                    { val: 'day', name: I18n.resource.modalConfig.option.PERIOD_UNIT_DAY },
                    { val: 'month', name: I18n.resource.modalConfig.option.PERIOD_UNIT_MON }
                ],
                attr: {
                    class: 'col-xs-6'
                }
            },
            name: I18n.resource.modalConfig.option.LABEL_PERIOD
        }
    }
    getData() {
        return this.store;
    }
    createWidgetDom(opt) {
        var divIptGrp = document.createElement('div');
        divIptGrp.className = 'input-group';
        divIptGrp.style.width = '100%';
        var iptText = document.createElement('input');
        iptText.className = 'form-control';
        iptText.setAttribute('type', 'text');
        iptText.style.width = '50%';
        if (this.store && this.store.val) {
            iptText.value = this.store.val;
        }
        var select = document.createElement('select');
        select.className = 'form-control';
        select.style.width = '50%';
        var option;
        for (let ele in opt.option) {
            option = new Option();
            option.value = opt.option[ele].val;
            option.text = opt.option[ele].name;
            select.options.add(option);
            if (this.store && this.store.unit === option.value) {
                option.selected = true;
            }
        }
        divIptGrp.appendChild(iptText);
        divIptGrp.appendChild(select);

        return divIptGrp;
    }
}
class DateOption extends BaseOptionWidget {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'date',
            opt: {
                input: [
                    { val: new Date(), role: 'timeStart', suffix: 'To' },
                    { val: new Date(), role: 'timeEnd' }
                ],
                attr: {
                    class: 'col-xs-12'
                }
            },

            name: I18n.resource.modalConfig.option.LABEL_TIME_RANGE
        }
    }
    initData() {
        this.store = {};
        if (this.widget.data) { //固定周期
            this.store.timeStart = this.widget.data.timeStart;
            this.store.timeEnd = this.widget.data.timeEnd;
            return;
        }

        for (let i = 0; i < this.widget.opt.input.length; i++) {
            var date = new Date(this.widget.opt.input[i].val);
            if (!date || date == 'Invalid Date') date = new Date();
            this.store[this.widget.opt.input[i].role] = date.format('yyyy-MM-dd HH:mm:ss')
        }
    }
    createWidgetDom(opt) {
        var divIptDateGrp = document.createElement('div');
        divIptDateGrp.className = 'input-group';

        var iptDate, spDateSuffix;
        if (opt.input instanceof Array && opt.input.length > 0) {
            for (let i = 0; i < opt.input.length; i++) {
                iptDate = document.createElement('input');
                iptDate.className = 'form-control';
                iptDate.setAttribute('type', 'text');
                iptDate.setAttribute('role', opt.input[i].role);
                if (this.store[opt.input[i].role]) {
                    iptDate.value = this.store[opt.input[i].role];
                }
                divIptDateGrp.appendChild(iptDate);
                if (opt.input[i].suffix) {
                    spDateSuffix = document.createElement('span');
                    spDateSuffix.textContent = opt.input[i].suffix;
                    spDateSuffix.className = 'input-group-addon';
                    divIptDateGrp.appendChild(spDateSuffix);
                }
                $(iptDate).datetimepicker({
                    initialDate: this.store[opt.input[i].role] ? new Date(this.store[opt.input[i].role]) : new Date(),
                    format: 'yyyy-mm-dd hh:ii:ss',
                    todayBtn: 'linked',
                    autoclose: true
                })
            }
        }
        return divIptDateGrp
    }

    onMainWidgetChange(data) {

    }
    attachEvent() {
        var $iptDate = $(this.widget.dom).find('input');
        this.store = {};
        $iptDate.off('change').on('change', e => {
            var $currentTarget = $(e.currentTarget);
            if($iptDate.parents('.divOption').attr('data-type')=='ModalHistoryChartYearOnYearLine'&&$currentTarget.attr('role')=='timeStart'){
                var nextVal = $currentTarget.siblings('input').val();
                var newxValMain = new Date($(e.currentTarget).val()).getTime()+86400000;
                var now = new Date();
                if(new Date(nextVal).getTime()>newxValMain){
                    $currentTarget.siblings('input').val(new Date(newxValMain).format('yyyy-MM-dd HH:mm:ss'));
                }
                $currentTarget.siblings('input').datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii:ss',
                    startDate: $currentTarget.val(),
                    todayBtn: 'linked',
                    endDate: newxValMain > now.getTime() ? now : new Date(newxValMain),
                    autoclose: true
                })
            }
            for (let i = 0; i < $iptDate.length; i++) {
                this.store[e.currentTarget.getAttribute('role')] = e.currentTarget.value;
            }
        })
    }
    getData() {
        var $iptDate = $(this.widget.dom).find('input');
        this.store = {};
        $iptDate.each((index, obj) => {
            this.store[obj.getAttribute('role')] = obj.value;
        });
        return this.store;
    }
}

class TextOption extends BaseOptionWidget {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'text',
            opt: {
                data: '',
                attr: {
                    class: 'col-xs-6'
                }
            }
        }
    }
    initData() {
        this.store = { val: this.widget.opt.data }
    }
    createWidgetDom(opt) {
        var ipt = document.createElement('input');
        ipt.className = 'form-control';
        ipt.setAttribute('type', 'text');
        ipt.value = opt.data ? opt.data : '';
        if (opt.attr.placeholder) ipt.setAttribute('placeholder', opt.attr.placeholder);
        return ipt;
    }
    attachEvent() {
        $(this.widget.dom).find('input').off('change').on('change', e => {
            this.store = { val: e.currentTarget.value }
            this.setSubWidget()
        })
        $(this.widget.dom).find('input').off('input').on('input', e => {
            this.store = { val: e.currentTarget.value }
            this.setSubWidget()
        })
    }
}
class RangeOption extends BaseOptionWidget {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'range',
            opt: {
                attr: {
                    class: 'col-xs-12'
                }
            }
        }
    }
    createWidgetDom(opt) {
        var divIptDateGrp = document.createElement('div');
        divIptDateGrp.className = 'input-group';

        var iptRange, spDateSuffix;
        if (opt.input instanceof Array && opt.input.length > 0) {
            for (let i = 0; i < opt.input.length; i++) {
                iptRange = document.createElement('input');
                iptRange.className = 'form-control';
                opt.input[i].cls && (iptRange.className += ' ' + opt.input[i].cls);
                iptRange.setAttribute('type', 'text');
                iptRange.value = opt.input[i].val ? opt.input[i].val : '';
                iptRange.setAttribute('role', opt.input[i].role ? opt.input[i].role : '');
                divIptDateGrp.appendChild(iptRange);
                if (opt.input[i].suffix) {
                    spDateSuffix = document.createElement('span');
                    spDateSuffix.className = 'input-group-addon';
                    opt.input[i].suffix.cls && (spDateSuffix.className += ' ' + opt.input[i].suffix.cls);
                    opt.input[i].suffix.text && (spDateSuffix.textContent = opt.input[i].suffix.text);
                    opt.input[i].suffix.style && ($.extend(spDateSuffix.style, opt.input[i].suffix.style));
                    divIptDateGrp.appendChild(spDateSuffix);
                }
            }
        }
        return divIptDateGrp
    }
    initData() {
        if (this.widget.opt.input instanceof Array && this.widget.opt.input.length > 0) {
            this.store = this.widget.opt.input.map(item => {
                return {
                    val: !isNaN(item.value) ? parseFloat(item.value) : 0,
                    role: item.role ? item.role : ''
                }
            })
        } else {
            this.store = [];
        }
    }
    attachEvent() {
        var $iptRange = $(this.widget.dom).find('input');
        $iptRange.off('change').on('change', e => {
            this.getIptVal($iptRange)
        });
    }
    getIptVal($iptRange) {
        var arrRange = [];
        for (let i = 0; i < $iptRange.length; i++) {
            arrRange.push({
                val: !isNaN($iptRange[i].value) ? parseFloat($iptRange[i].value) : 0,
                role: $iptRange[i].getAttribute('role')
            })
        }
        this.store = arrRange;
    }
}

class LinkOption extends BaseOptionWidget {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'linkSelect',
            name: '链接',
            opt: {
                data: '',
                attr: {
                    class: 'col-xs-6'
                },
                option: {

                }
            }
        }
    }
    createWidgetDom(opt) {
        var divSelect = document.createElement('div');
        divSelect.className = 'divLinkSel';


        var selLinkType = document.createElement('select');
        selLinkType.className = 'form-control selLinkType';
        var typeOpt, typeIndex;
        typeIndex = 0;
        for (var i = 0; i < opt.option.length; i++) {
            typeOpt = new Option();
            typeOpt.value = typeOpt.option[i].type;
            typeOpt.name = typeOpt.option[i].name;
            if (this.store.type == typeOpt.option[i].val) {
                typeOpt.selected = true;
                typeIndex = i;
            }
            selLinkType.options.add(typeOpt);
        }

        var selLinkTar = document.createElement('select');
        selLinkTar.className = 'form-control selLinkTar';
        var linkOpt
        for (var i = 0; i < opt.option[typeIndex].link.length; i++) {
            linkOpt = new Option();
            linkOpt.value = opt.option[typeIndex].link[i].val;
            linkOpt.name = opt.option[typeIndex].link[i].name;
            if (this.store.link == opt.option[typeIndex].link[i].val) {
                linkOpt.selected = true;
            }
            selLinkTar.options.add(linkOpt);
        }
        return divSelect;
    }

    setChartSelTar($dom) {
        $dom.innerHTML = '';
        if (!this.opt.option || !this.opt.option.chart) return;
        var opt;
        var arrOpt = this.opt.option.page;
        for (var i = 0; i < arrOpt.length; i++) {
            opt = new Option();
            opt.value = arrOpt[i].val;
            opt.text = arrOpt[i].name;
            if (this.store.val == arrOpt[i].val) {
                opt.selected = true;
            }
            $dom[0].options.add(opt);
        }
    }
    setPageSelTar($dom) {
        $dom.innerHTML = '';
        if (!this.opt.option || !this.opt.option.page) return;
        var opt;
        var arrOpt = this.opt.option.page;
        for (var i = 0; i < arrOpt.length; i++) {
            opt = new Option();
            opt.value = arrOpt[i].val;
            opt.text = arrOpt[i].name;
            if (this.store.val == arrOpt[i].val) {
                opt.selected = true;
            }
            $dom[0].options.add(opt);
        }
    }
    attachEvent() {
        var $selLinkTar = $(this.widget.dom).find('.selLinkTar');
        $(this.widget.dom).find('.selLinkType').off('change').on('change', e => {
            if (e.currentTarget.value == 'chart') {
                this.setChartSelTar($selLinkTar)
            } else {
                this.setPageSelTar($selLinkTar)
            }
        })
    }
}

class CheckBoxOption extends BaseOptionWidget {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'checkbox',
            name: '选择',
            opt: {
                data: '',
                option: {

                }
            }
        }
    }
    createWidgetDom(opt) {
        var iptChkBox = document.createElement('input');
        iptChkBox.className = 'iptCheckBox';
        iptChkBox.style.top = '2px';
        iptChkBox.style.left = '10px';
        iptChkBox.style.position = 'relative';
        iptChkBox.setAttribute('type', 'checkbox');
        if (this.store == true) iptChkBox.checked = true;
        return iptChkBox;
    }

    initData() {
        if (this.widget.data) {
            this.store = this.widget.data
        }
    }
    getData() {
        var val = this.widget.dom.querySelector('.iptCheckBox').checked;
        this.store = val;
        return this.store;
    }
}

class InputColorOption extends BaseOptionWidget {
    constructor(objModal, widget, area) {
        super(objModal, widget, area);
        this.defaultOpt = {
            type: 'color',
            opt: {
                data: '',
                attr: {
                    class: 'col-xs-2'
                }
            }
        }
    }
    initData() {
        this.store = { val: this.widget.opt.data }
    }
    createWidgetDom(opt) {
        var ipt = document.createElement('input');
        ipt.setAttribute('type', 'color');
        ipt.className = 'form-control';
        ipt.value = opt.data ? opt.data : '';
        return ipt;
    }
    attachEvent() {
        $(this.widget.dom).find('input').off('change').on('change', e => {
            this.store = { val: e.currentTarget.value }
        })
    }
}
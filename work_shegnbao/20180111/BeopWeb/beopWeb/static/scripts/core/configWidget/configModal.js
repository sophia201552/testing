/**
/**
 * Created by win7 on 2016/7/6.
 */
class ConfigModal {
    constructor(opt, modal) {
        this.modal = modal instanceof jQuery ? modal[0] : modal;
        this.modalContent = undefined;
        this.modalBody = undefined;
        this.modalStyle = undefined;
        this.opt = $.extend(true, {}, opt);
        this.initOpt = $.extend(true, {}, opt);
        this.mapWidget = [];
        this.mapWidgetCls = {};
        this.mapModuleCls = {};
        this.store = {};
    }

    //JSON of opt
    //{
    //    area:[],
    //    event:{},
    //    header:{},
    //    result:{
    //      func:{}}
    //}
    setOption(opt = {}) {
        //this.opt = Object.assign({}, opt);
        this.opt = $.extend(true, {}, opt);
        this.initOpt = $.extend(true, {}, opt);
        return this;
    }
    init() {
        this.destroy();
        this.initContainer();
        this.initClassMap();
        this.initModule();
        this.initResult();
        //this.searChWidget();
        //this.initWidgetByDom();
        this.initWidgetMap();
        this.initWidgetByJSON();
        this.i18n();
        this.attachEvent();
        return this;
    }

    initContainer() {
        if (!this.modal || !$(this.modal).hasClass('cfgModal')) {
            let container = this.modal;
            this.modal = $('body>.cfgModal')[0];
            //this.modal = null;
            if (!this.modal) {
                this.modal = document.createElement('div');
                this.modal.className = 'modal fade cfgModal';
                this.modal.innerHTML = '\
                    <div class="modal-dialog">\
                        <style class="modal-style"></style>\
                        <div class="modal-content">\
                            <div class="modal-body"></div>\
                        </div>\
                    </div>\
                ';
                container ? container.appendChild(this.modal) : document.getElementsByTagName('body')[0].appendChild(this.modal);
            }
        }
        var modalDialog = this.modal.querySelector('.modal-dialog');
        this.modalContent = this.modal.querySelector('.modal-content');
        this.modalStyle = this.modal.querySelector('.modal-style');
        if (!this.modalContent) {
            this.modalContent = document.createElement('div');
            this.modalContent.className = 'modal-content';
            this.modalContent.innerHTML = '<div class="modal-body"></div>';
            if (!modalDialog) {
                modalDialog = document.createElement('div');
                modalDialog.className = 'modal-dialog';
                this.modal.appendChild(modalDialog);
            }
            modalDialog.appendChild(this.modalContent)
        }
        this.modalBody = this.modal.querySelector('.modal-body');
        this.modalBody.style.height = window.innerHeight * 0.5 + 'px';

        this.clearDom();

        if (this.opt.header) this.modalContent.insertBefore(this.initModalHeader(), this.modalBody);

    }
    initModalHeader() {
        if (!this.opt.header) return;
        var divHeader = document.createElement('div');
        divHeader.className = 'modal-header';
        if (this.opt.header.needBtnClose !== false) {
            var btnClose = document.createElement('button');
            btnClose.className = 'close';
            btnClose.setAttribute('type', 'button');
            btnClose.dataset.dismiss = 'modal';
            btnClose.setAttribute('aria-label', 'close');
            btnClose.innerHTML = '<span aria-hidden="true">&times;</span>';
            divHeader.appendChild(btnClose);
        }
        var divTitle = document.createElement('h4');
        divTitle.className = 'modal-title';
        if (this.opt.header.title) divTitle.textContent = this.opt.header.title;
        divHeader.appendChild(divTitle);

        if (this.opt.header.attr) {
            Object.keys(this.opt.header.attr).forEach(attr => {
                let $dom, value;
                if (typeof this.opt.header.attr[attr] == 'object') {
                    Object.keys(this.opt.header.attr[attr]).forEach(selector => {
                        $dom = $(divHeader).find(selector.replace(/&/g, '.'));
                        value = this.opt.header.attr[attr][selector]
                        if ($dom.length == 0) return;
                        if (attr == 'class') {
                            $dom.addClass(value);
                        } else {
                            $dom[0].setAttribute(attr, value)
                        }
                    })
                } else {
                    $dom = $(divHeader);
                    value = this.opt.header.attr[attr]
                    if (attr == 'class') {
                        $dom.addClass(value);
                    } else if (attr == 'i18n') {
                        divTitle.setAttribute('i18n', this.opt.header.attr[attr])
                    } else {
                        $dom[0].setAttribute(attr, value)
                    }
                }
            })
        }

        return divHeader;
    };

    searChWidget() {
        var widgetDom = this.modal.querySelectorAll('.cfgWidget');
        var type, arrWidgetDom;
        for (let i = 0; i < widgetDom.length; i++) {
            type = widgetDom.getAttribute('type');
            if (type) {
                arrWidgetDom = this.mapWidget.get(type);
                arrWidgetDom instanceof Array ? this.mapWidget.set(type, [widgetDom]) : arrWidgetDom.push(widgetDom)
            }
        }
    }
    i18n() {
        I18n.fillArea($(this.modal))
    };

    initWidgetByDom() {
        this.mapWidget.forEach((val, key) => {
            let widgetCls = this.mapWidgetCls(key);
            new widgetCls(this, val).init()
        })
    }
    setModalData(data) {
        this.opt.data = data;
    }

    show() {
        $(this.modal).modal('show');
        return this;
    }

    hide() {
        $(this.modal).modal('hide');
        return this;
    }
    attachEvent() {
        var $modal = $(this.modal);
        if (this.opt && this.opt.event) {
            if (typeof this.opt.event.beforeShow == 'function') {
                $modal.off('show.bs.modal').on('show.bs.modal', e => {
                    this.opt.event.beforeShow();
                })
            }

            if (typeof this.opt.event.afterShow == 'function') {
                $modal.off('shown.bs.modal').on('shown.bs.modal', e => {
                    this.opt.event.afterShow();
                })
            }

            if (typeof this.opt.event.beforeHide == 'function') {
                $modal.off('hide.bs.modal').on('hide.bs.modal', e => {
                    this.opt.event.beforeHide();
                })
            }

            if (typeof this.opt.event.afterHide == 'function') {
                $modal.off('hidden.bs.modal').on('hidden.bs.modal', e => {
                    this.opt.event.afterHide();
                })
            } else {
                $modal.off('hidden.bs.modal').on('hidden.bs.modal', e => {
                    //this.modalBody.innerHTML = '';
                })
            }
        }
    }

    initWidgetMap() {
        if (!(this.opt.area instanceof Array)) this.opt.area = [];
        this.mapWidget = [];
        this.opt.area.forEach((val, index) => {
            if (!(val.widget instanceof Array)) return;
            if (!val.dom) {
                val.dom = document.createElement('div');
                val.dom.className = 'cfgArea div' + this.upperCaseText(val.name ? val.name : val.type, 0);
                val.dom.setAttribute('type', val.type);
                val.id = ObjectId();
                if (val.type == 'footer') {
                    val.dom.className += ' modal-footer';
                    this.modalContent.appendChild(val.dom)
                } else {
                    val.dom.className += ' row';
                    this.modalBody.appendChild(val.dom);
                }
            }
            for (let i = 0; i < val.widget.length; i++) {
                val.widget[i].cls = this.mapWidgetCls[val.widget[i].type];
                if (!val.widget[i].cls) continue;
                if (!val.widget[i].opt) val.widget[i].opt = {};
                val.widget[i].instantiation = new val.widget[i].cls(this, val.widget[i], val);
            }
            this.mapWidget.push(val)
        })
    }

    initClassMap() {
        //json格式
        this.mapWidgetCls = {
            select: SelectOption,
            interval: IntervalOption,
            refreshInterval: RefreshIntervalOption,
            recentTime: RecentTimeOption,
            recentTimeCustom: recentTimeCustomOption,
            mode: ModeOption,
            date: DateOption,
            range: RangeOption,
            text: TextOption,
            color: InputColorOption,
            checkbox: CheckBoxOption,
            linkSelect: LinkOption,

            datasource: DataSourceData,
            dataInfoList: DataInfoListData,
            multiDataConfig: MultiDataConfigData,

            confirm: ConfirmFooter,
            cancel: CancelFooter
        };
        this.mapModuleCls = {
            timeConfig: TimeConfigModule,

            dsDrag: DataSourceDragModule,
            dataInfoList: DataInfoListModule,
            multiDataConfig: MultiDataConfigModule,

            realTime: RealTimeConfigModule,
            gauge: GaugeConfigModule,

            factoryTplFooter: FactoryTplFooterModule,
            colorConfig: ColorConfigModule
        }
    }

    initModule() {
        if (!(this.opt.area instanceof Array)) this.opt.area = [];
        this.opt.area.forEach((val, index) => {
            if (!val.module || !this.mapModuleCls[val.module]) return;
            val.cls = this.mapModuleCls[val.module];
            val.instantiation = new val.cls(this, val);
            val.instantiation.init()
        })
    }
    initWidgetByJSON() {
        this.mapWidget.forEach((val) => {
            if (val.widget instanceof Array) {
                for (let i = 0; i < val.widget.length; i++) {
                    val.widget[i].instantiation.init();
                }
            }
        });
        this.mapWidget.forEach((val) => {
            if (val.widget instanceof Array) {
                for (let i = 0; i < val.widget.length; i++) {
                    val.widget[i].instantiation.setSubWidget();
                }
            }
        })
    }
    initResult() {
        if (!this.opt.result) return;
        if (typeof this.opt.result.func == 'function') {
            var areaFooter, widgetConfirm;
            for (let i = this.opt.area.length - 1; i >= 0; i--) {
                if (!this.opt.area[i].widget) continue;
                for (let j = 0; j < this.opt.area[i].widget.length; j++) {
                    if (this.opt.area[i].widget[j].type == 'confirm') widgetConfirm = this.opt.area[i].widget[j];
                    break;
                }
                if (widgetConfirm) {
                    areaFooter = this.opt.area[i];
                    break;
                }
            }
            var _this = this;
            if (!widgetConfirm) {
                widgetConfirm = {
                    type: 'confirm',
                    func: function(e) {
                        _this.store = _this.getResult();
                        _this.opt.result.func(_this.store);
                        if (this.opt.needClose !== false) _this.hide();
                    }
                };
                areaFooter = { type: 'footer', widget: [widgetConfirm] };
                this.opt.area.push(areaFooter);
            } else {
                widgetConfirm.func = function() {
                    _this.store = _this.getResult();
                    _this.opt.result.func(_this.store);
                    if (this.opt.needClose !== false) _this.hide();
                }
            }
        }
    }
    getResult() {
        var store = {},
            widgetStore;
        var storeGroup;
        var data;
        var id;
        for (let i = 0; i < this.opt.area.length; i++) {
            if (this.opt.area[i].instantiation) {
                data = this.opt.area[i].instantiation.getData();
                if($(this.modal).find('.divOption ').attr('data-type')&&$(this.modal).find('.divOption ').attr('data-type')=='ModalHistoryChartYearOnYearLine'){
                    if(i ==0){
                        store.modal1 = data;
                        continue;
                    }else if(i==1){
                        store.modal2 = data;
                        continue;
                    }else if(i==2){
                        store.interval = data.interval;
                        continue;
                    }
                }
                if (data) Object.assign(store, data);
                continue;
            }
            for (let j = 0; j < this.opt.area[i].widget.length; j++) {
                if (this.opt.area[i].widget[j].id) {
                    id = this.opt.area[i].widget[j].id;
                } else {
                    id = this.opt.area[i].widget[j].type;
                }

                //storeGroup = store[id];
                //storeGroup?storeGroup.push(this.opt.area[i].widget[j].instantiation.getData()):storeGroup = [this.opt.area[i].widget[j].instantiation.getData()];
                widgetStore = this.opt.area[i].widget[j].instantiation.getData();
                widgetStore && (store[id] = widgetStore);
            }
        }
        return store;
    }
    upperCaseText(text, index) {
        if (!text[0]) return '';
        return text[index].toUpperCase() + text.slice(index + 1)
    }
    clearDom() {
        if (this.modalContent) {
            this.modalContent.querySelector('.modal-body').innerHTML = '';
            var modalHeader = this.modalContent.querySelector('.modal-header');
            modalHeader && this.modalContent.removeChild(modalHeader);
            var arrModalFooter = this.modalContent.querySelectorAll('.modal-footer');
            for (let i = 0; i < arrModalFooter.length; i++) {
                this.modalContent.removeChild(arrModalFooter[i])
            }
        }
        this.modal && ($(this.modal).find('.modal-style').html(''));
        this.modalBody && (this.modalBody.innerHTML = '');
    }
    transDomToJSON() {

    }
    extendWidget() {

    }
    setData(data) {
        if (!(data instanceof Array && data.length > 0)) return;
        data.forEach(val => {
            if (!val.type) return;
            var moduleEntity;
            if (val.module) {
                moduleEntity = this.getModuleByType(val.module)
            }
            this.getWidgetByType(val.type, moduleEntity).forEach(widget => {
                widget.instantiation.setData(val.data);
            });
        });
        return this;
    }
    getModuleByType(module) {
        if (!module) return;
        var arrModule = [];
        for (let i = 0; i < this.opt.area.length; i++) {
            if (this.opt.area[i].module == module) {
                arrModule.push(this.opt.area[i])
            }
        }
        return arrModule
    }
    getWidgetByType(type, area) {
            var arrWidget = [];
            if (area) {
                if (area instanceof Array) {
                    area.forEach(val => {
                        for (let i = 0; i < val.widget.length; i++) {
                            if (val.widget[i].type == type) {
                                arrWidget.push(val.widget[i])
                            }
                        }
                    })
                } else {
                    for (let i = 0; i < area.widget.length; i++) {
                        if (area.widget[i].type == type) {
                            arrWidget.push(area.widget[i])
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.opt.widget.length; i++) {
                    if (this.opt.widget[i].type == type) {
                        arrWidget.push(this.opt.widget[i]);
                    }
                }
            }
            return arrWidget;
        }
        //
    destroy() {
        this.clearDom();
        if (!(this.opt.area instanceof Array)) return;
        for (let i = 0; i < this.opt.area.length; i++) {
            if (this.opt.area[i].instantiation) {
                this.opt.area[i].instantiation.destroy();
                this.opt.area[i].instantiation = null;
            } else {
                if (!this.opt.area[i].widget) continue;
                for (let j = 0; j < this.opt.area[i].widget.length; j++) {
                    if (!this.opt.area[i].widget[j].instantiation) continue;
                    this.opt.area[i].widget[j].instantiation.destroy();
                    this.opt.area[i].widget[j].instantiation = null;
                }
            }
        }
    }
}
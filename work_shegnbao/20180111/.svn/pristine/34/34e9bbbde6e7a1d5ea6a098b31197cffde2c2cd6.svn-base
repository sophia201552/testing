/**
 * Created by win7 on 2016/7/14.
 */
class BaseConfigWidget {
    constructor(objModal, widget, area) {
        this.objModal = objModal;
        this.widget = widget;
        this.area = area;
        this.store = undefined;
        this.mainWidgetOpt = {};
    }
    init() {
        this.initOption();
        this.initData();
        this.setWidget();
        this.attachEvent();
        this.widget.completeInit && this.widget.completeInit.call(this)
    }
    setWidget() {
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
    initOption() {
        if (this.defaultOpt) {
            //Object.assign(this.defaultOpt,this.widget)
            this.widget = $.extend(true, {}, this.defaultOpt, this.widget)
        }
    }
    setSubWidget() {
        if (!(this.widget.subWidget instanceof Array)) return;
        this.widget.subWidget.forEach(val => {
            var obj;
            for (var i = 0; i < this.area.widget.length; i++) {
                if (this.area.widget[i].type == val.type) {
                    obj = this.area.widget[i].instantiation;
                }
            }
            if (!obj) return;
            if (typeof val.callback == 'function') {
                val.callback.call(obj, this.widget.type, this.store);
                obj.setSubWidget();
            } else {
                obj.onMainWidgetChange(this.widget.type, this.store)
            }
        })
    }

    onMainWidgetChange(type, val) {}
    initWidgetLabel() {
        if (this.widget.name && this.widget.opt.needLabel !== false) {
            var label = document.createElement('label');
            label.className = 'cfgLabel';
            label.textContent = this.widget.name;
            this.widget.dom.appendChild(label);
        }
    }
    initWidgetAttr() {
        if (this.widget.opt.attr) {
            for (let attr in this.widget.opt.attr) {
                let $dom, value;
                if (typeof this.widget.opt.attr[attr] == 'object') {
                    Object.keys(this.widget.opt.attr[attr]).forEach(selector => {
                        $dom = $(this.widget.dom).find(selector.replace(/&/g, '.'));
                        value = this.widget.opt.attr[attr][selector]
                        if ($dom.length == 0) return;
                        if (attr == 'class') {
                            $dom.addClass(value);
                        } else {
                            $dom[0].setAttribute(attr, value)
                        }
                    })
                } else {
                    $dom = $(this.widget.dom);
                    value = this.widget.opt.attr[attr]
                    if (attr == 'class') {
                        $dom.addClass(value);
                    } else {
                        $dom[0].setAttribute(attr, value)
                    }
                }
            }
        }
    }
    initWidgetStyle() {
        if (this.widget.opt.style) {
            $(this.widget.dom).css(this.widget.opt.style);
        }
    }
    initWidgetId() {
        if (this.widget.id) {
            this.widget.dom.id = this.widget.id;
        }
    }
    attachEvent() {}

    initData() {
        this.store = this.widget.store;
    }

    createWidgetDom(opt) {

    }
    setData(data) {
        this.store = data;
    }
    getData() {
        return this.store;
    }
    upperCaseText(text, index) {
        if (!index) index = 0;
        return text[index].toUpperCase() + text.slice(index + 1)
    }

    destroy() {
        this.objModal = null;
        this.widget = null;
        this.area = null;
        this.store = null;
        this.mainWidgetOpt = null;
    }
}

class baseModuleOperateBtn {
    constructor(module) {
        this.module = module;
        this.btn = undefined;
    }
    init() {
        this.createButton();
        this.attachEvent();
    }
    createButton() {}
    attachEvent() {}
}

class btnModuleAdd extends baseModuleOperateBtn {
    constructor(module) {
        super(module);
    }
    createButton() {
        this.btn = document.createElement('span');
        this.btn.className = 'glyphicon glyphicon-plus btnModuleAdd btnModuleOperate';
        this.module.dom.appendChild(this.btn, this.module.dom.children[0])
    }

    attachEvent() {
        var _this = this;
        this.btn.onclick = function() {
            $(_this.module.dom).after('')
        }
    }
}

class btnModuleDel extends baseModuleOperateBtn {
    constructor(module) {
        super(module);
    }
    createButton() {
        this.btn = document.createElement('span');
        this.btn.className = 'glyphicon glyphicon-plus btnModuleDel btnModuleOperate';
        this.module.dom.appendChild(this.btn, this.module.dom.children[0])
    }

    attachEvent() {
        var _this = this;
        this.btn.onclick = function() {
            $(_this.module.dom).after('')
        }
    }
}
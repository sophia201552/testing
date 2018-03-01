/** 
 * factory 控件属性基类
 */

(function () {

    function WidgetProp(panel, propCtn, model) {
        this.panel = panel;

        this.store = {};
        this.store.model = model;

        this.shape = null;
        this.$propertyList = propCtn;

        this.init();
    }

    WidgetProp.prototype.init = function () {
        //this.bindModelOb();
    };

    WidgetProp.prototype.tplProp = '<li><ul class="list-inline"><li id="prop_x"><label class="property-name">X:</label><span class="property-value p_span">{x}</span><input class="property-value p_input" type="text" value="{x}"/>px</li>\
        <li id="prop_y"><label class="property-name">Y:</label><span class="property-value p_span">{y}</span><input class="property-value p_input" type="text" value="{y}"/>px</li>\
        <li id="prop_w"><label class="property-name">W:</label><span class="property-value p_span">{w}</span><input class="property-value p_input" type="text" value="{w}"/>px</li>\
        <li id="prop_h"><label class="property-name">H:</label><span class="property-value p_span">{h}</span><input class="property-value p_input" type="text" value="{h}"/>px</li></ul></li>';

    WidgetProp.prototype.update = function (e) {};

    WidgetProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model;
        var option = {
            x: model.x() || '-',
            y: model.y() || '-',
            w: model.w() || '-',
            h: model.h() || '-'
        };
        this.$propertyList.html(this.tplProp.formatEL(option));
        this.attachPubEvent(this.store.model);
    };

    WidgetProp.prototype.close = function () {};

    WidgetProp.prototype.attachPubEvent = function (model) {
        $('.property-value.p_span', this.$propertyList).off('click').click(function(){
            var $input = $(this).hide().next('.p_input');
            $input.show().focus().val($input.val());
        });
        $('.property-value.p_input', this.$propertyList).off('blur').blur(function(){
            var changeVal = this.value;
            var $span = $(this).prev('.p_span');
            $(this).hide().prev('.p_span').show();//.html(changeVal)
            if(!isNaN(changeVal)){
                changeVal = parseFloat(this.value);
                var curtLiId = $(this).closest('li').attr('id');
                if(curtLiId == 'prop_x'){
                    model.x(changeVal);
                }else if(curtLiId == 'prop_y'){
                    model.y(changeVal);
                }else if(curtLiId == 'prop_w'){
                    model.w(changeVal);
                }else if(curtLiId == 'prop_h'){
                    model.h(changeVal);
                }else if(curtLiId == 'prop_bgw'){
                    model.models[0].w(changeVal);
                    $span.html(changeVal);
                }else if(curtLiId == 'prop_bgh'){
                    model.models[0].h(changeVal);
                    $span.html(changeVal);
                }
            }
        });
        $('.property-value.p_input', this.$propertyList).off('keydown.shape.position').on('keydown.shape.position', function(event){
            if(event.keyCode == 13){
                $(this).trigger("blur");
            } 
        }); 
        
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.WidgetProp = WidgetProp;
} ());

/** prop model */
(function () {

    var class2type = Object.prototype.toString;

    function PropModel(models) {
        this.models = models;
    }

    PropModel.prototype.update = function (k) {
        this.models.forEach(function (model) {
            model.update(k);
        });
    };

    PropModel.prototype._setProperty = function (k, v) {
        this.models.forEach(function (model) {
            model.property(k, v);
        });
    };

    PropModel.prototype._isPropertyValueSame = function (k) {
        var ov = this.models[0].property(k);
        var isSame = true;
        for(var i = 1, model, len = this.models.length; i < len; i ++) {
            model = this.models[i];
            // 值不同，或者为对象类型，返回 false
            if (model.property(k) !== ov || class2type.call(ov) === '[object Object]') {
                var modalproperty = model.property(k);
                ////判断ov和modalproperty都为数组并且内容相同，顺序可不同
                //if ((ov instanceof Array) && (modalproperty instanceof Array) && modalproperty.length === ov.length) {
                //    if (ov.sort().toString() === modalproperty.sort().toString()) {
                //        return ov;
                //    }
                //}
                var returnValue = window.diff(ov, modalproperty);
                if (returnValue) {
                    return false;
                } else {
                    return ov;
                }
            }
        }
        return ov;
    };

    ['x', 'y', 'w', 'h'].forEach(function (name) {
        this[name] = function (val) {
            var v;
            if( !isNaN(val) ) {
                val = parseFloat(val);
                this._setProperty(name, val);
                return true;
            }

            if( (v = this._isPropertyValueSame(name) ) !== false ) {
                if(typeof v == "string"){
                    v = parseFloat(v);
                }
                if(typeof v == "number"){
                    v = parseFloat(v.toFixed(1));
                    return v;
                }
                return v;
            } else {
                return '';
            }
        };

    }, PropModel.prototype);

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.PropModel = PropModel;
} ());
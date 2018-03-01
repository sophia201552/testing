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
        <li id="prop_h"><label class="property-name">H:</label><span class="property-value p_span">{h}</span><input class="property-value p_input" type="text" value="{h}"/>px</li></ul></li>\
        <li id="dashboardChangeBg" style="display:none">\
            <span style="padding-right:10px;">皮肤：</span>\
            <select id="prop_bg" value="{bg}">\
              <option value ="blackBg">黑色</option>\
              <option value ="whiteBg">白色</option>\
            </select>\
        </li>\
        <li id="dashboardStyle" style="display:none">\
            <ul>\
                <li>\
                    <label style="padding-right:10px;">标题：</label>\
                    <input type="text" placeholder="请输入标题" value="{titleName}" class="titleName blurVal" style="padding-left:4px;">\
                </li>\
                <li>\
                    <label>标题样式:</label></br>\
                    <textarea style="margin-left:50px;min-height:60px;" class="titleCss blurVal">{titleCss}</textarea>\
                </li>\
                <li>\
                    <label>容器样式:</label></br>\
                    <textarea style="margin-left:50px;min-height:70px;" class="containerCss blurVal">{containerCss}</textarea>\
                </li>\
            </ul>\
        </li>';

    WidgetProp.prototype.update = function (e) {};

    WidgetProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model;
        var option = {
            x: model.x() || '-',
            y: model.y() || '-',
            w: model.w() || '-',
            h: model.h() || '-',
            bg: model.models[0].option().bg || 'blackBg',
            titleName: model.models[0].option().titleName || '',
            titleCss: model.models[0].option().titleCss || 'width:100%;height:50px;color:#111111;font-size:25px;',
            containerCss: model.models[0].option().containerCss || 'background:rgba(255,255,255,.7);border-radius:5px;padding:10px 14px;'
        };
        this.$propertyList.html(this.tplProp.formatEL(option));
        //htmlDashboard 控件 显示切换皮肤的
        if(model.models[0].type() === "HtmlDashboard"){
            this.$propertyList.find("#dashboardChangeBg").css("display","block");
            var modelType = this.store.model.models[0].option().type;
            if(modelType === 'ModalColdHotAreaSummary' || modelType === 'ModalEquipmentPerfectRate' || modelType === 'ModalWorkOrderStatistics'  || modelType === 'ModalPriorityHandlingFaultList'  || modelType === 'ModalEnergyTrendAnalysis'){
                this.$propertyList.find("#dashboardStyle").css("display","block");
            }
        }
        $(this.$propertyList).find('option').attr("selected",false);
        $(this.$propertyList).find('option').each(function(){
            if(option.bg === $(this).val()){
                $(this).attr("selected",true);
            }
        })
        this.attachPubEvent(this.store.model);
    };

    WidgetProp.prototype.close = function () {};

    WidgetProp.prototype.attachPubEvent = function (model) {
        var _this = this;
        $('.property-value.p_span', this.$propertyList).off('click').click(function(){
            var $input = $(this).hide().next('.p_input');
            $input.show().focus().val($input.val());
        });
        $('.property-value.p_input', this.$propertyList).off('blur').blur(function(){
            var changeVal = this.value;
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
                }
            }
        });
        $('.property-value.p_input', this.$propertyList).off('keydown.shape.position').on('keydown.shape.position', function(event){
            if(event.keyCode == 13){
                $(this).trigger("blur");
            } 
        }); 
        //htmlDashboard皮肤切换
        $('#prop_bg', this.$propertyList).off('change').on('change', function(event){
            var selectVal = $(this).val();
            model.models[0].option().bg = selectVal;
            $("#"+model.models[0]._id()).removeClass().addClass('html-widget html-container '+selectVal);
        }); 
        //htmlDashboard 五个控件 修改标题 背景
        $('.blurVal',this.$propertyList).off('blur').blur(function(){
            var $currentCtn = $('#'+_this.store.model.models[0]._id());
            var info = $(this).val();
            if($(this).hasClass('titleName')){
                _this.store.model.update({
                    'option.titleName': info
                })
                if($currentCtn.find('.dashboardCtn').length === 0 ){
                    $currentCtn.attr('style',$currentCtn.attr('style')+_this.store.model.models[0].option().containerCss);
                    var dashboardTitle = '<div class="dashboardTitle" style="'+_this.store.model.models[0].option().titleCss+'">'+_this.store.model.models[0].option().titleName+'</div>';
                    var dashboardCtn = '<div class="dashboardCtn" style="width:100%;height:calc(100% - 40px);"></div>';
                    var previousHTml = $currentCtn.html();
                    $currentCtn.html(dashboardTitle + dashboardCtn);
                    $currentCtn.find('.dashboardCtn').html(previousHTml);
                }else{ 
                    $currentCtn.attr('style',$currentCtn.attr('style')+_this.store.model.models[0].option().containerCss);
                    $currentCtn.find('.dashboardTitle').html(_this.store.model.models[0].option().titleName).attr('style',_this.store.model.models[0].option().titleCss);
                }
            }else if($(this).hasClass('titleCss')){
                _this.store.model.update({
                    'option.titleCss': info
                })
                if(_this.store.model.models[0].option().titleName !== ''){
                    $currentCtn.find('.dashboardTitle').attr('style',_this.store.model.models[0].option().titleCss);
                }
            }else{
                _this.store.model.update({
                    'option.containerCss': info
                })
                $currentCtn.attr('style',$currentCtn.attr('style')+_this.store.model.models[0].option().containerCss);
            }
            
        })
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
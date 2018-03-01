(function (WidgetProp) {
    var _this = undefined;
    function HtmlContainerProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        _this = this;
    }

    HtmlContainerProp.prototype = Object.create(WidgetProp.prototype);
    HtmlContainerProp.prototype.constructor = HtmlContainerProp;

    HtmlContainerProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li class="txtShow">\
                    <label class="">show:</label>\
                    <span class="p_span" style="display:none;">{html}</span>\
                    <span class="btnEditTxt glyphicon glyphicon-edit"></span>\
                </li>\
            </ul>\
        </li>';

    /** override */
    HtmlContainerProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model;
        var defaultOpt = {
            x: model.x(),
            y: model.y(),
            w: model.w(),
            h: model.h()
        };
        var option = {
            html: model.option().html//.replace(/[<>]/ig, function ($0) { switch($0) {case '<': return '&lt;';case '>': return '&gt;';} })
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    /** override */
    HtmlContainerProp.prototype.close = function () {

    };

    /** override */
    HtmlContainerProp.prototype.update = function () {

    };

    HtmlContainerProp.prototype.attachEvent = function () {
        //修改文本显示内容
        $('.btnEditTxt', this.$propertyList).off('click').click(function(){
            function saveContent(html){
                var opt = _this.store.model.option();
                opt.html = html;
                _this.store.model.option(opt);
            }
            EditorModal.show(_this.store.model.option().html, saveContent);
        });
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.HtmlContainerProp = HtmlContainerProp;

} (window.widgets.factory.WidgetProp));

/** Html Container Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function HtmlContainerPropModel() {
        PropModel.apply(this, arguments);
    }

    HtmlContainerPropModel.prototype = Object.create(PropModel.prototype);
    HtmlContainerPropModel.prototype.constructor = HtmlContainerPropModel;

    HtmlContainerPropModel.prototype.option = function (params) {
        if(class2type.call(params) === '[object Object]') {
            this._setProperty('option', params);
            return true;
        }
        var opt = $.extend(true, {}, this.models[0].option());
        for(var i = 1, len = this.models.length, modelOpt; i < len; i ++){
            modelOpt = this.models[i].option();
            for(var i in modelOpt){
                if(opt[i] != modelOpt[i]){
                    opt[i] = '';
                }
            }
        }
        return opt;
    };

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.HtmlContainerPropModel = HtmlContainerPropModel;

} (window.widgets.propModels.PropModel));
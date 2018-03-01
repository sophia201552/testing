(function (WidgetProp) {
    var _this = undefined;
    function HtmlScreenContainerProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        _this = this;
    }

    HtmlScreenContainerProp.prototype = Object.create(WidgetProp.prototype);
    HtmlScreenContainerProp.prototype.constructor = HtmlScreenContainerProp;

    HtmlScreenContainerProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li class="txtShow">\
                    <label class="">page:</label>\
                    <select class="" id="pageList">\
                      {selectHTML}\
                    </select>\
                </li>\
            </ul>\
        </li>';

    /** override */
    HtmlScreenContainerProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model;
        var defaultOpt = {
            x: model.x(),
            y: model.y(),
            w: model.w(),
            h: model.h()
        };
        var option = {
            selectHTML: (function(){
                var tempHTML = '', tpl = '<option value="{id}">{text}</option>';
                var pages = _this.panel.screen.factoryScreen.pagePanel.getPagesData();
                if(!pages || !pages.models || pages.models.length < 1) return;
                pages.forEach(function(page){
                    if(page.type() !== 'Folder'){
                        tempHTML += (tpl.formatEL({id: page._id(), text: page.text()}));
                    }
                });
                return tempHTML;
            }())
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));

        //设置默认选中项
        if(model.option().pageId){
            $('#pageList').val(model.option().pageId);
        }else{
            $('#pageList').prepend('<option id="unchoose" selected="selected">选择Screen</option>');
        }

        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    /** override */
    HtmlScreenContainerProp.prototype.close = function () {

    };

    /** override */
    HtmlScreenContainerProp.prototype.update = function () {

    };

    HtmlScreenContainerProp.prototype.attachEvent = function () {
        //修改文本显示内容
        $('#pageList', this.$propertyList).off('change').change(function(){
            $('#unchoose').remove();
            var opt = _this.store.model.option();
            opt.pageId = this.value;
            _this.store.model.option(opt);
        });
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.HtmlScreenContainerProp = HtmlScreenContainerProp;

} (window.widgets.factory.WidgetProp));

/** Html Container Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function HtmlScreenContainerPropModel() {
        PropModel.apply(this, arguments);
    }

    HtmlScreenContainerPropModel.prototype = Object.create(PropModel.prototype);
    HtmlScreenContainerPropModel.prototype.constructor = HtmlScreenContainerPropModel;

    HtmlScreenContainerPropModel.prototype.option = function (params) {
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
    window.widgets.propModels.HtmlScreenContainerPropModel = HtmlScreenContainerPropModel;

} (window.widgets.propModels.PropModel));
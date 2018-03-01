(function (WidgetProp) {
    var _this = undefined;
    var _gTplContent = null;

    function HtmlContainerProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        _this = this;
    }

    HtmlContainerProp.prototype = Object.create(WidgetProp.prototype);
    HtmlContainerProp.prototype.constructor = HtmlContainerProp;

    HtmlContainerProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li class="txtShow" style="width: 100%;">\
                    <label class="text-content">Content:</label>\
                    <span class="btnEditTxt glyphicon glyphicon-edit"></span>\
                </li>\
                <li class="txtShow" id="htmlContainerDisplay">\
                    <label>不拉伸内容:</label>\
                    <input type="checkbox" style="vertical-align: middle;margin: 2px 0 5px 1px;"/>\
                </li>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline">\
                <li><span class="glyphicon glyphicon-export" id="exportHtmlCtTemplet"></span></li>\
                <li><span class="glyphicon glyphicon-import" id="importHtmlCtTemplet"></span></li>\
            </ul>\
        </li>';

    /** override */
    HtmlContainerProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model;
        var defaultOpt = {
            x: typeof model.x() === 'number' ? model.x() : '-',// model.x() || '-',
            y: typeof model.y() === 'number' ? model.y() : '-',//model.y() || '-',
            w: typeof model.w() === 'number' ? model.w() : '-',//model.w() || '-',
            h: typeof model.h() === 'number' ? model.h() : '-'//model.h() || '-'
        };
        var option = {
            html: model.option().html//.replace(/[<>]/ig, function ($0) { switch($0) {case '<': return '&lt;';case '>': return '&gt;';} })
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));
        //国际化
        $('.text-content').html(I18n.resource.mainPanel.attrPanel.attrRepeat.CONTENT);
        $('.txtShow').find('.btnEditTxt').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.EDIT_CONTENT_TITLE);
        $('#exportHtmlCtTemplet').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.EXPORT_STYLE_TITLE);
        $('#importHtmlCtTemplet').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.IMPORT_STYLE_TITLE);

        //拉伸
        if(model.option() && typeof model.option().display === 'number'){
            if(model.option().display === 0){
                $('#htmlContainerDisplay input', this.$propertyList).prop('checked',false);
            }else{
                $('#htmlContainerDisplay input', this.$propertyList).prop('checked',true);
            }
        }

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
            CodeEditorModal.show(_this.store.model.option(), function (code) {
                _this.store.model.update({
                    'option.html': code.html,
                    'option.css': code.css,
                    'option.js': code.js
                });
            });
        });

        $('#importHtmlCtTemplet')[0].onclick = this.importTemplate;
        $('#exportHtmlCtTemplet')[0].onclick = this.exportTemplate;

        //拉伸
        $('#htmlContainerDisplay input',this.$propertyList).off('change').on('change',function(){
            var opt = _this.store.model.option();
            if($(this).is(':checked')){
                opt.display = 1;
            }else{
                opt.display = 0;
            }
            _this.store.model.update({
                'option.display': opt.display
            });
        })
    };

    // 报表模板参数接口 - 开始
    // 获取模板中的模板参数
    HtmlContainerProp.prototype.getTplParams = function () {
        //_gTplContent
        var options = _gTplContent;
        var str = options.html +  options.css + options.js;
        var pattern = /<#\s*(\w*?)\s*#>/mg;
        var match = null;
        var params = [];

        while( match = pattern.exec(str) ) {
            params.push({
                name: match[1],
                value: ''
            });
        }

        return params;
    };

    // 应用
    HtmlContainerProp.prototype.applyTplParams = function (params) {
        try{
            for(var i in params){
                var reg = new RegExp('<#' + i + '#>','mg');
                var strNew = params[i];
                _gTplContent.html = _gTplContent.html.replace(reg, strNew);
                _gTplContent.css = _gTplContent.css.replace(reg, strNew);
                _gTplContent.js = _gTplContent.js.replace(reg, strNew);
            }
            this.store.model.models.forEach(function(model){
                model.option(_gTplContent);
            });
        }catch (e){
            console.log('应用模板失败')
        }

    };

    HtmlContainerProp.prototype.render = function () {};
    HtmlContainerProp.prototype.entity = {modal: {}};

    // 报表模板参数接口 - 结束

    HtmlContainerProp.prototype.importTemplate = function () {
        MaterialModal.show([{'title':'Template',data:['Widget.HtmlContainer']}], function (data, isCopy) {
            var ReportTplParamsConfigModal = namespace('factory.report.components.ReportTplParamsConfigModal');

            _gTplContent = data.content;

            ReportTplParamsConfigModal.setOptions({
                modalIns: _this,
                container: 'panels'
            });
            ReportTplParamsConfigModal.show();
        });
    };

    HtmlContainerProp.prototype.exportTemplate = function () {
        var options = _this.store.model.option();
        var templateName, data;

        templateName = prompt(I18n.resource.mainPanel.exportModal.EXPORT_INFO);
        if(!templateName) return;

        data = {
            _id: ObjectId(),
            name: templateName,
            creator: AppConfig.userProfile.fullname,
            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
            'public': 1,
            group: '',
            isFolder:0,
            type: 'widget.HtmlContainer',
            content: {
                html: options.html || '',
                css: options.css || '',
                js: options.js || ''
            }
        };
        WebAPI.post('/factory/material/save', data
        ).done(function(result){

        }).always(function(){

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

    ['option,templateId','option.display'].forEach(function(type){
        HtmlContainerPropModel.prototype[type] = function (params) {
            var v;
            if(params) {
                this._setProperty(type, params);
                return true;
            }
            if((v = this._isPropertyValueSame(type) ) !== false ) {
                return v;
            }
        };
    })
    HtmlContainerPropModel.prototype.templateId = function (params) {
        var v;
        if (class2type.call(params) === '[object String]') {
            this._setProperty('templateId', params);
            return true;
        }
        if ( (v = this._isPropertyValueSame('templateId')) !== false ) {
            return v;
        }
    };

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
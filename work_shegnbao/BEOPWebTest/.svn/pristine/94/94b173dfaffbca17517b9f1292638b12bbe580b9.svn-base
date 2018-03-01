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
                    <label class="text-content">Content:</label>\
                    <span class="btnEditTxt glyphicon glyphicon-edit"></span>\
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
                var opt = _this.store.model.option();
                opt.html = code.html;
                opt.css = code.css;
                opt.js = code.js;
                _this.store.model.option(opt);
            });
        });

        $('#importHtmlCtTemplet')[0].onclick = this.importTemplate;
        $('#exportHtmlCtTemplet')[0].onclick = this.exportTemplate;
    };

    HtmlContainerProp.prototype.importTemplate = function () {
        MaterialModal.show(['widget.HtmlContainer'], function (data, isCopy) {
            var content = data.content;
            var opt = _this.store.model.option();
            opt.html = content.html;
            //_this.store.model.option(opt);
            if (!isCopy) {
                //_this.store.model.templateId(data._id);
                _this.store.model.update({
                'option': opt,
                'templateId': data._id
            });
            } else {
                //_this.store.model.templateId('');
                _this.store.model.update({
                'option': opt,
                'templateId': ''
            });
            }

        });
    };

    HtmlContainerProp.prototype.getTemplateFromCode = function (html) {
        var pattern = /<%([\sA-Za-z0-9])*?%>/mg;
        var tmp = [];
        var count = 0;
        var tplValueNamePrefix = 'VALUE_';

        html = html.replace(pattern, function ($0, $1) {
            // $0 为包含 <%、%> 的匹配
            // $1 为 $0 中去除 <%、%> 的结果
            $1 = $1.trim();
            if (tmp.indexOf($1) === -1) {
                tmp.push($1);
                count ++;
            }
            return ['<%', tplValueNamePrefix + tmp.indexOf($1), '%>'].join('');
        });

        return {
            html: html,
            tplValueCount: count
        }
    };

    HtmlContainerProp.prototype.exportTemplate = function () {
        var options = _this.store.model.option();
        var templateName, data;

        templateName = prompt(I18n.resource.mainPanel.exportModal.EXPORT_INFO);
        if(!templateName) return;

        data = {
            _id: ObjectId(),
            name: templateName,
            creator: AppConfig.account,
            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
            'public': 1,
            group: '',
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

    ['option,templateId'].forEach(function(type){
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
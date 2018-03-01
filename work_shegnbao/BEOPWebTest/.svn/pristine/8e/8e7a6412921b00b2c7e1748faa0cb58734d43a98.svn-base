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
                    <label class="screen-page">Page:</label>\
                    <select class="" id="pageList">\
                      {selectHTML}\
                    </select>\
                </li>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline" style="position:realtive">\
                <li class="divPorpertyBase" id="liTempltConfigWrap">\
                    <div class="propertyTemplt">\
                        <label for="ckbpropertyTemplt">Customstyle:</label>\
                        <input id="ckbpropertyTemplt" type="checkbox" />\
                    </div>\
                    <div class="divTool">\
                        <span id="btnPropTempltApply" class="glyphicon glyphicon-check"></span>\
                        <span id="btnPropTempltExport" class="glyphicon glyphicon-export"></span>\
                        <span id="btnPropTempltImport" class="glyphicon glyphicon-import"></span>\
                    </div>\
                </li>\
                <div id="templtConfigWrap">\
                    <ul class="list-unstyled">\
                        <li class="tplStyle">\
                            <label class="sr-only" for="inputNormalTemplt"></label>\
                            <textarea class="form-control gray-scrollbar" id="inputTplStyle" rows="3"></textarea>\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>';

    HtmlScreenContainerProp.prototype.tplStyle = '' +
        '.Normal{\n' +
        '    /* Please input text normal style */\n' +
        '}\n' +
        '';

    /** override */
    HtmlScreenContainerProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model;
        var defaultOpt = {
            x: typeof model.x() === 'number' ? model.x() : '-',// model.x() || '-',
            y: typeof model.y() === 'number' ? model.y() : '-',//model.y() || '-',
            w: typeof model.w() === 'number' ? model.w() : '-',//model.w() || '-',
            h: typeof model.h() === 'number' ? model.h() : '-'//model.h() || '-'
        };
        var option = {
            selectHTML: (function(){
                var tempHTML = '', tpl = '<option value="{id}-{type}">{text}</option>';
                var pages = _this.panel.screen.screen.pagePanel.getPagesData();
                if(!pages || !pages.models || pages.models.length < 1) return;
                pages.forEach(function(page){
                    if(page.type() !== 'DropDownList' && page._id() != _this.panel.screen.page.id){
                        tempHTML += (tpl.formatEL({id: page._id(), text: page.text(), type: page.type()}));
                    }
                });
                return tempHTML;
            }())
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));
        //国际化
        $('.screen-page').html(I18n.resource.mainPanel.attrPanel.attrRepeat.PAGE);
        $('.propertyTemplt').find('label').html(I18n.resource.mainPanel.attrPanel.attrRepeat.CUSTOMSTYLE);
        $('#btnPropTempltApply').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.SAVE_STYLE_TITLE);
        $('#btnPropTempltExport').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.EXPORT_STYLE_TITLE);
        $('#btnPropTempltImport').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.IMPORT_STYLE_TITLE);


        //设置默认选中项
        if(model.option().pageId){
            $('#pageList').val([model.option().pageId, model.option().pageType].join('-'));
        }else{
            $('#pageList').prepend('<option id="unchoose" selected="selected" value="">Choose Screen</option>');
        }

        $('#unchoose').html(I18n.resource.mainPanel.attrPanel.attrRepeat.SELECT_SCREEN);

        if (model.option().style) {
            this.$propertyList.find('#inputTplStyle').val(model.option().style).prop('disabled', false);
            this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
            $('#templtConfigWrap').show();
        } else if (model.models.length > 1) {
            if (!model.option().style) {
                this.$propertyList.find('#inputTplStyle').val(this.tplStyle).prop('disabled', false);
                this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
                $('#templtConfigWrap').show();
            }
        } else {
            this.$propertyList.find('#inputTplStyle').val(this.tplStyle).prop('disabled', true);
            $('#liTempltConfigWrap .divTool').hide();
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
        var _this = this;
        var templateId = null;
        //修改文本显示内容
        $('#pageList', this.$propertyList).off('change').change(function() {
            var opt = _this.store.model.option();
            var arr;

            if (!this.value) {
                opt.pageId = opt.pageType = '';
            } else {
                arr = this.value.split('-');
                opt.pageId = arr[0];
                opt.pageType = arr[1];
            }
            _this.store.model.update({
                'option.pageId': opt.pageId,
                'option.pageType': opt.pageType
            });
            //_this.store.model['option.pageId'](opt.pageId);
            //_this.store.model.option().pageType = opt.pageType;
            //_this.store.model.option(opt);
        });

        //启用样式模板编辑
        var tpltConfigWrap = $('#templtConfigWrap');
        var divCustom = $('#liTempltConfigWrap .divTool');
        $('#ckbpropertyTemplt')[0].onclick = function () {
            if ($(this).is(':checked')) {
                $('#inputTplStyle').prop('disabled', false);
                tpltConfigWrap.slideDown();
                divCustom.show();
            } else {
                $('#inputTplStyle').prop('disabled', true);
                tpltConfigWrap.slideUp();
                divCustom.hide();
            }
        };

        //应用模板
        $('#btnPropTempltApply')[0].onclick = function () {
            var tempOpt = _this.store.model.option();
            if ($('#ckbpropertyTemplt').is(':checked')) {
                tempOpt.style = $('#inputTplStyle').val();
                // 如果有模板 id，则说明是不保留副本的模板应用
                if (templateId) {
                    _this.store.model.templateId(templateId);
                    // 这里需要将 templateId 置为空，以免和保留副本的模版应用混合到一起
                    templateId = null;
                } else {
                    _this.store.model.templateId('');
                }
            } else {
                tempOpt.style = null;
            }
            _this.store.model.option(tempOpt, 'style');
        };
        //取消样式
        $('#ckbpropertyTemplt').off('click').click(function () {
            if (!$(this).is(':checked')) {
                _this.store.model.templateId('');
                var tempOpt = _this.store.model.option();
                tempOpt.style = '';
                $('#inputTplStyle').val(_this.tplStyle);
                _this.store.model.option(tempOpt, 'style');
            }
        });
        //导入模板
        $('#btnPropTempltImport')[0].onclick = function () {
            MaterialModal.show(['widget.HtmlScreenContainer'], function (data, isCopy) {
                // 根据判断，确定是否是保留副本的引用
                if (isCopy === false) {
                    templateId = data._id;
                }
                $('#inputTplStyle').val(data.content.style).prop('disabled', false);
                _this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
                tpltConfigWrap.slideDown();
            });
        };

        //导出模板
        $('#btnPropTempltExport')[0].onclick = function () {
            var templateName = prompt(I18n.resource.mainPanel.exportModal.EXPORT_INFO);
            if (!templateName) return;
            var tplStyle = $('#inputTplStyle').val();
            var data = {
                _id: ObjectId(),
                name: templateName,
                creator: AppConfig.userId,
                time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                "public": 1,
                group: '',
                type: 'widget.HtmlScreenContainer',
                content: {
                    style: tplStyle
                }
            };
            WebAPI.post('/factory/material/save', data).done(function (result) {
                if (result && result._id) {
                    data._id = result._id;
                }
            }).always(function () {

            });
        };
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

    HtmlScreenContainerPropModel.prototype.option = function (params, attr) {
        if (class2type.call(params) === '[object Object]') {
            if (arguments.length == 1) {
                this._setProperty('option', params);
            } else if (arguments.length == 2) {//只设置option的指定属性:attr
                this._setProperty('option.' + arguments[1], params[arguments[1]]);
            }
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

    ['option.pageId,option.pageType','templateId',].forEach(function(type){
        HtmlScreenContainerPropModel.prototype[type] = function (params) {
             var v;
            if (class2type.call(params) === '[object String]') {
                this._setProperty(type, params);
                return true;
            }
            if ((v = this._isPropertyValueSame(type)) !== false) {
                return v;
            }
        };
    })
    //HtmlScreenContainerPropModel.prototype.templateId = function (params) {
    //    var v;
    //    if (class2type.call(params) === '[object String]') {
    //        this._setProperty('templateId', params);
    //        return true;
    //    }
    //    if ((v = this._isPropertyValueSame('templateId')) !== false) {
    //        return v;
    //    }
    //};
    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.HtmlScreenContainerPropModel = HtmlScreenContainerPropModel;

} (window.widgets.propModels.PropModel));
(function (WidgetProp) {

    function HtmlTextProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
    }

    HtmlTextProp.prototype = Object.create(WidgetProp.prototype);
    HtmlTextProp.prototype.constructor = HtmlTextProp;

    WidgetProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li>\
                    <span class="span-bold">Style:</span>\
                    <div class="btn-group">\
                      <button id="btnTxtStyle" type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                        {class} <span class="caret"></span>\
                      </button>\
                      <ul class="dropdown-menu" id="txtStyle">\
                        <li data-class="txtStyle1"><a href="#" class="txtStyle1">正文1</a></li>\
                        <li data-class="txtStyle8"><a href="#" class="txtStyle1">正文2</a></li>\
                        <li data-class="txtStyle2"><a href="#" class="txtStyle2">标题1</a></li>\
                        <li data-class="txtStyle3"><a href="#" class="txtStyle3">标题2</a></li>\
                        <li data-class="txtStyle4"><a href="#" class="txtStyle4">标题3</a></li>\
                        <li data-class="txtStyle5"><a href="#" class="txtStyle5">标题4</a></li>\
                        <li data-class="txtStyle6"><a href="#" class="txtStyle6">标题5</a></li>\
                        <li data-class="txtStyle7"><a href="#" class="txtStyle7">副标题</a></li>\
                      </ul>\
                    </div>\
                </li>\
            </ul>\
            <ul class="list-inline" style="padding-top: 10px;">\
                <li class="txtShow">\
                    <label class="text-content">Content:</label>\
                    <span class="p_span" style="display:none;">{text}</span>\
                    <span class="btnEditTxt glyphicon glyphicon-edit" style="padding-left: 10px;"></span>\
                </li>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline" style="position: relative;">\
                <li class="divPorpertyBase">\
                    <div class="dataSource">\
                        <span class="span-bold">Datasource:</span>\
                        <span class="spanDs" ds-id="{dsId}" style="display:{isShowDsName}">\
                            <span class="dsText">{dsName}</span>\
                            <span class="btnRemoveDs glyphicon glyphicon-remove"></span>\
                        </span>\
                        <span class="dropArea" style="display:{isShowDropArea}">\
                            <span class="glyphicon glyphicon-plus"></span>\
                        </span>\
                    </div>\
                </li>\
                <li id="liFloat" style="padding-top: 10px;">\
                        <label class="property-name" style="width: 52px;">精确位数:</label>\
                        <span class="property-value p_span"></span>\
                        <input class="property-value p_input" type="text" value="">\
                </li>\
                <li id="liEnumerateWrap" style="padding-top: 10px;display:{isShowEnumerate}">\
                    <div class="divTool">\
                        <div class="enumerateCtn{isDisabled}">\
                            <label for="ckbEnumerate">Enumerate:</label>\
                            <input id="ckbEnumerate" type="checkbox" style="margin-left:10px;" {isDisabled}/>\
                        </div>\
                        <span id="btnAddEnumerate" class="glyphicon glyphicon-plus-sign btnEnumerate"></span>\
                        <span id="btnSaveEnumerate" class="glyphicon glyphicon-ok-circle btnEnumerate"></span>\
                    </div>\
                </li>\
                <div id="enumerateWrap">\
                    <ul class="list-unstyled">\
                        <li class="enumerateItem">\
                            <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey"></div>\
                            <div class="enumeratePart divEnumerateVal"><label class="enumerateLabel">Value:</label><input class="enumerateVal"></div>\
                            <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate">\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline" style="position:realtive">\
                <li class="divPorpertyBase" id="liTempltConfigWrap">\
                    <div class="propertyTemplt">\
                        <label for="ckbpropertyTemplt">Customstyle:</label>\
                        <input id="ckbpropertyTemplt" type="checkbox"/>\
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
    HtmlTextProp.prototype.tplStyle = '' +
        '.Normal{\n' +
        '    /* Please input text normal style */\n' +
        '}\n' +
        '.Normal:hover{\n' +
        '    /* Please enter a state of suspension style text */\n'+
        '}' +
        '';
    /** override */
    HtmlTextProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model, isShowDsName = 'none', isShowEnumerate = 'none', isShowDropArea = 'inline-block', isDisabled = ' disabled';
        var defaultOpt = {
            x: typeof model.x() === 'number' ? model.x() : '-',// model.x() || '-',
            y: typeof model.y() === 'number' ? model.y() : '-',//model.y() || '-',
            w: typeof model.w() === 'number' ? model.w() : '-',//model.w() || '-',
            h: typeof model.h() === 'number' ? model.h() : '-'//model.h() || '-'
        };
        var option = {
            text: model.option().text,
            class: model.option().class ? model.option().class: '---',
            dsId: model.idDs(),
            dsName: (function(ids){
                var idsName = [];
                if(!ids || !(ids instanceof Array) || ids.length == 0) return;
                isShowDsName = 'inline-block';
                isShowDropArea = 'none';
                isShowEnumerate = 'block';
                isDisabled = '';

                var arrItem = [];
                arrItem = AppConfig.datasource.getDSItemById(ids);
                ids.forEach(function(id){
                    for (var m = 0; m < arrItem.length; m++) {
                        if (id == arrItem[m].id) {
                            idsName = arrItem[m].alias;
                            break;
                        }
                    }
                    //idsName = AppConfig.datasource.getDSItemById(id).alias
                });
                return idsName;
            }(model.idDs())),
            isShowDsName: isShowDsName,
            isShowEnumerate: isShowEnumerate,
            isShowDropArea: isShowDropArea,
            isDisabled: isDisabled
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));
        //国际化
        $('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.STYLE); 
        $('.text-content').html(I18n.resource.mainPanel.attrPanel.attrRepeat.CONTENT);
        $('.dataSource').find('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.DATA_SOURCE);
        $('.propertyTemplt').find('label').html(I18n.resource.mainPanel.attrPanel.attrRepeat.CUSTOMSTYLE);
        $('.txtShow').find('.btnEditTxt').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.EDIT_CONTENT_TITLE);
        $('#btnPropTempltApply').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.SAVE_STYLE_TITLE);
        $('#btnPropTempltExport').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.EXPORT_STYLE_TITLE);
        $('#btnPropTempltImport').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.IMPORT_STYLE_TITLE);
        var styleArr = [I18n.resource.mainPanel.attrPanel.attrText.TEXT_ONE, I18n.resource.mainPanel.attrPanel.attrText.TEXT_TWO, I18n.resource.mainPanel.attrPanel.attrText.TITLE_ONE, I18n.resource.mainPanel.attrPanel.attrText.TITLE_TWO,
                        I18n.resource.mainPanel.attrPanel.attrText.TITLE_THREE, I18n.resource.mainPanel.attrPanel.attrText.TITLE_FOUR, I18n.resource.mainPanel.attrPanel.attrText.TITLE_FIVE, I18n.resource.mainPanel.attrPanel.attrText.SUBTITLE];
        for (var m = 0; m < styleArr.length; m++) {
            $('#txtStyle').find('a').eq(m).html(styleArr[m]);
        }


        //文本预置样式的文本
        var btnTxt = option.class == '---' ? '---' : $('[data-class="' + option.class + '"] a').text();
        $('#btnTxtStyle').html(btnTxt + '<span class="caret"></span>');

        //数字精确位数
        var $liFloat = $('#liFloat');
        var float = model['option.precision']();
        if(!float){
            model.models.forEach(function(e,index){
                model.models[index]._values.option.precision = 5;
            })
            float = model['option.precision']();
        }
        $liFloat.children('span').text(float);
        $liFloat.children('input').val(float);

        //枚举初始化
        var $enumerateWrap = $('#enumerateWrap');
        var trigger = model.models[0].option().trigger;
        var triggerEptCount = 0;
        if(!$.isEmptyObject(trigger)) {
            $('.enumerateItem').remove();
            for (var row in trigger) {
                addEnumerate(row, trigger[row]);
            }
            $('#liEnumerateWrap .divTool .btnEnumerate').show();
            var models =model.models;
            for (var i = 0; i < models.length; i++) {
                if($.isEmptyObject(models[i].option().trigger)) {
                    triggerEptCount += 1;
                }
            }
            if (triggerEptCount === 0) {
            this.$propertyList.find('#ckbEnumerate')[0].checked = true;
            $enumerateWrap.show();
            } else {
                $enumerateWrap.find('ul').children().remove();
                addEnumerate('', '');
        }
        }
        function addEnumerate(key, value){
            var html =  '<li class="enumerateItem">\
                <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey" value={key}></div>\
                <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal" value={value}></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ';
            var $li = $(html.formatEL({
                key: key,
                value: value
            }));
            $enumerateWrap.find('ul').append($li);
        };
        if(model.option().style) {
            this.$propertyList.find('#inputTplStyle').val(model.option().style).prop('disabled', false);
            this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
            $('#templtConfigWrap').show();

        }else if(model.models.length>1){
            if (!model.option().style) {
                this.$propertyList.find('#inputTplStyle').val(this.tplStyle).prop('disabled', false);
                this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
                $('#templtConfigWrap').show();
            }
        }else {
            this.$propertyList.find('#inputTplStyle').val(this.tplStyle).prop('disabled',true);
            $('#liTempltConfigWrap .divTool').hide();
        }
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    /** override */
    HtmlTextProp.prototype.close = function () {

    };

    /** override */
    HtmlTextProp.prototype.update = function () {

    };

    HtmlTextProp.prototype.attachEvent = function () {
        var _this = this;
        var tempStyle = '';
        var templateId = null;

        //选择文本样式
        $('#txtStyle li', this.$propertyList).off('click').click(function(){
            var htmlClass = this.dataset.class;
            _this.store.model['option.class'](htmlClass);
        });
        //预览文本样式
        $('#txtStyle li', this.$propertyList).hover(function(){
            tempStyle = this.dataset.class;
            for(var i = 0, model; i < _this.store.model.models.length; i++){
                model = _this.store.model.models[i];
                $('#' + model._id()).removeClass(model.option().class).addClass(tempStyle);
            }
        }, function(){
            for(var i = 0, model; i < _this.store.model.models.length; i++){
                model = _this.store.model.models[i];
                $('#' + model._id()).removeClass(tempStyle).addClass(model.option().class);
            }
        });

        $('.btnEditTxt', this.$propertyList).off('click').click(function(){
            EditorModal.show(_this.store.model.option().text, true, function (newContent) {
                var opt = _this.store.model.option();
                opt.text = newContent;
                _this.store.model.option(opt,'text');
            });
        });

        //数字精确位数
        var $liFloat = $('#liFloat');
        var currentVal = $liFloat.children('input').val();
        $liFloat.children('input').on('focus',function(){
            $liFloat.children('input').val(currentVal);
        });
        $liFloat.children('input').on('blur',function(){
            var blurVal = $liFloat.children('input').val();
            $liFloat.children('span').text(blurVal);
            _this.store.model['option.precision'](blurVal);
        });

        //数据源接收
        var $dataSource = $('.dataSource');
        $dataSource[0].ondrop = function(e){
            e.preventDefault();
            var id = EventAdapter.getData().dsItemId;
            _this.store.model.update({
                'idDs': new Array(id),
                 'option.text': AppConfig.datasource.getDSItemById(id).alias
            });
            //_this.store.model.idDs(new Array(id));
        };
        $dataSource[0].ondragenter = function(e){
            e.preventDefault();
        };
        $dataSource[0].ondragover = function(e){
            e.preventDefault();
        };
        $dataSource[0].ondragleave = function(e){
            e.preventDefault();
        };
        $dataSource.off('click').on('click','.btnRemoveDs',function(e){
            //数据源删除后,枚举也同时删除
            //var opt = _this.store.model.option();
            //_this.store.model.idDs([]);
            //opt.trigger = {};
            //_this.store.model.option(opt,'trigger');
            var triggerAll = _this.store.model.models[0].option().trigger;
            var triggerDefault = {};
            triggerDefault = triggerAll.default ? { 'default': triggerAll.default } : {};
            _this.store.model.update({
                'idDs': [],
                'option.trigger': triggerDefault,
                'option.text': '请此处输入文本'
            })
        });
        $('.dropArea', this.$propertyList)[0].ondragover = function(e){
            e.preventDefault();
            $(e.currentTarget).addClass('dragover');
            console.log('drag over');
        };
        $('.dropArea', this.$propertyList)[0].ondragleave = function(e){
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover');
            console.log('drag over');
        };

        //是否启用枚举
        var $btnEnumerate = $('#liEnumerateWrap .divTool #btnAddEnumerate');
        var $btnSaveEnumerate = $('#liEnumerateWrap .divTool #btnSaveEnumerate');
        $('#ckbEnumerate')[0].onclick = function(){
            if($(this).is(':checked')){
                $('#enumerateWrap').slideDown();
                $btnEnumerate.show();
                $btnSaveEnumerate.show();
            }else{
                $('#enumerateWrap').slideUp();
                $btnEnumerate.hide();
                $btnSaveEnumerate.hide();
            }
        };
        if (!$('#ckbEnumerate').is(':checked')) {
            $btnEnumerate.hide();
            $btnSaveEnumerate.hide();
        }
        var $enumerateWrap = $('#enumerateWrap');
        var $ulEnumerate= $enumerateWrap.find('ul');
        //添加枚举
        $('#btnAddEnumerate')[0].onclick = function(){
            var $li = $('' +
                '<li class="enumerateItem">\
                <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey"></div>\
                <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal"></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ');
            $ulEnumerate.append($li);
        };

        //删除枚举
        $enumerateWrap.off('click').on('click', '.btnRemove',function(){
            $(this).parents('#enumerateWrap').hide();
            var enumerateKey= $(this).siblings().find('input.enumerateKey').val();
            if(enumerateKey){
                delete _this.store.model['option.trigger']()[enumerateKey];
                _this.store.model.update({
                    'option.trigger': _this.store.model['option.trigger']()
                })
            }
            $(this).parent().remove();
            _this.$propertyList.find('#ckbEnumerate').prop('checked', false);
        });

        //保存枚举
        $('#btnSaveEnumerate')[0].onclick = function(e){
            var $arrKey = $('.enumerateKey'),$arrVal = $('.enumerateVal');
            var tempOpt = _this.store.model.option();
            tempOpt.trigger = {};
            for (var i = 0; i < $arrKey.length; i++) {
                var parseFloatKey = parseFloat($arrKey.eq(i).val()).toFixed(0);
                if(isNaN(parseFloatKey))continue;
                tempOpt.trigger[parseFloatKey] = $arrVal.eq(i).val();
                //_this.store.model.option().trigger[$arrKey.eq(i).val()] = $arrVal.eq(i).val();
            }
            _this.store.model.option(tempOpt, 'trigger');
            //$('#enumerateWrap').slideUp();
        };

        //启用样式模板编辑
        var tpltConfigWrap = $('#templtConfigWrap');
        var divCustom = $('#liTempltConfigWrap .divTool');
        $('#ckbpropertyTemplt')[0].onclick = function(){
            if($(this).is(':checked')){
                $('#inputTplStyle').prop('disabled',false);
                tpltConfigWrap.slideDown();
                divCustom.show();
            }else{
                $('#inputTplStyle').prop('disabled',true);
                tpltConfigWrap.slideUp();
                divCustom.hide();
                _this.store.model.templateId('');
                var tempOpt = _this.store.model.option();
                tempOpt.style = '';
                $('#inputTplStyle').val(_this.tplStyle);
                _this.store.model.option(tempOpt,'style');
            }
        };
        //应用模板
        $('#btnPropTempltApply')[0].onclick = function(){
            var tempOpt = _this.store.model.option();
            if($('#ckbpropertyTemplt').is(':checked')) {
                tempOpt.style = $('#inputTplStyle').val();
                // 如果有模板 id，则说明是不保留副本的模板应用
                if (templateId) {
                    _this.store.model.templateId(templateId);
                    // 这里需要将 templateId 置为空，以免和保留副本的模版应用混合到一起
                    templateId = null;
                } else {
                    _this.store.model.templateId('');
                }
            }else{
                tempOpt.style = null;
            }
            _this.store.model.option(tempOpt,'style');
        };
        //导入模板
        $('#btnPropTempltImport')[0].onclick = function(){
            MaterialModal.show(['widget.HtmlText'], function (data, isCopy) {
                // 根据判断，确定是否是保留副本的引用
                if (isCopy === false) {
                    templateId = data._id;
                }
                $('#inputTplStyle').val(data.content.style).prop('disabled',false);
                _this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
                tpltConfigWrap.slideDown();
            });
        };

        //导出模板
        $('#btnPropTempltExport')[0].onclick = function(){
            var templateName = prompt(I18n.resource.mainPanel.exportModal.EXPORT_INFO);
            if(!templateName) return;
            var tplStyle = $('#inputTplStyle').val();
            var data = {
                _id: ObjectId(),
                name: templateName,
                creator: AppConfig.userId,
                time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                "public": 1,
                group: '',
                type: 'widget.HtmlText',
                content: {
                    style:tplStyle
                }
            };
            WebAPI.post('/factory/material/save', data
            ).done(function(result){
                if(result && result._id){
                    data._id = result._id;
                }
            }).always(function(){

            });
        };
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.HtmlTextProp = HtmlTextProp;

} (window.widgets.factory.WidgetProp));

/** Html Text Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function HtmlTextPropModel() {
        PropModel.apply(this, arguments);
    }

    HtmlTextPropModel.prototype = Object.create(PropModel.prototype);
    HtmlTextPropModel.prototype.constructor = HtmlTextPropModel;

    HtmlTextPropModel.prototype.option = function (params,attr) {
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
                    if (i === 'trigger') {
                        opt[i] = {};
                    } else {
                    opt[i] = '';
                }
            }
        }
        }
        return opt;
    };
    ['idDs','idDs,option.text','option.class','templateId','option.precision','option.trigger'].forEach(function(type){
        HtmlTextPropModel.prototype[type] = function (params) {
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
    //HtmlTextPropModel.prototype.idDs = function (params) {
    //    var v;
    //    if(params) {
    //        this._setProperty('idDs', params);
    //        return true;
    //    }
    //    if((v = this._isPropertyValueSame('idDs') ) !== false ) {
    //        return v;
    //    }
    //};
    //
    //HtmlTextPropModel.prototype.templateId = function (params) {
    //    var v;
    //    if (class2type.call(params) === '[object String]') {
    //        this._setProperty('templateId', params);
    //        return true;
    //    }
    //    if ( (v = this._isPropertyValueSame('templateId')) !== false ) {
    //        return v;
    //    }
    //};

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.HtmlTextPropModel = HtmlTextPropModel;

} (window.widgets.propModels.PropModel));
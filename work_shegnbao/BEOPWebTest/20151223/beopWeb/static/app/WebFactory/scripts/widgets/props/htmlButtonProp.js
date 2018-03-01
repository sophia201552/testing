(function (WidgetProp) {

    function HtmlButtonProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
    }

    HtmlButtonProp.prototype = Object.create(WidgetProp.prototype);
    HtmlButtonProp.prototype.constructor = HtmlButtonProp;

    HtmlButtonProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li>\
                    <span>style:</span>\
                    <div class="btn-group">\
                      <button id="btnTxtStyle" type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                        {class}<span class="caret"></span>\
                      </button>\
                      <ul class="dropdown-menu" id="btnTxtStyle">\
                        <li data-class="default"><a href="#">Default</a></li>\
                        <li data-class="primary"><a href="#">Primary</a></li>\
                        <li data-class="success"><a href="#">Success</a></li>\
                        <li data-class="info"><a href="#">Info</a></li>\
                        <li data-class="warning"><a href="#">Warning</a></li>\
                        <li data-class="danger"><a href="#">Danger</a></li>\
                        <li data-class="link"><a href="#">Link</a></li>\
                      </ul>\
                    </div>\
                </li>\
                <li class="txtShow">\
                    <label class="">show:</label>\
                    <span class="p_span">{text}</span><input class="p_input" type="text" value="{text}"/>\
                    <span class="btnEditTxt glyphicon glyphicon-edit"></span>\
                </li>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline" style="position: relative;">\
                <li class="property-base" id="liEnumerateWrap">\
                    <div class="dataSource">\
                        <span>数据源:</span>\
                        <span class="spanDs" ds-id="{dsId}" style="display:{isShowDsName}">\
                            <span class="dsText">{dsName}</span>\
                            <span class="btnRemoveDs glyphicon glyphicon-remove"></span>\
                        </span>\
                        <span class="dropArea" style="display:{isShowDropArea}">\
                            <span class="glyphicon glyphicon-plus"></span>\
                        </span>\
                    </div>\
                    <div class="btnTool">\
                    <div class="enumerateCtn{isAddOpacity}">\
                        <span>枚举:</span>\
                        <input id="ckbEnumerate" type="checkbox" style="vertical-align: bottom;"/>\
                    </div>\
                        <span id="btnAddEnumerate" class="glyphicon glyphicon-plus-sign btnEnumerate"></span>\
                        <span id="btnSaveEnumerate" class="glyphicon glyphicon-ok-circle btnEnumerate"></span>\
                    </div>\
                </li>\
                <div id="enumerateWrap">\
                    <ul class="list-unstyled">\
                        <li class="enumerateItem">\
                            <div class="enumeratePart"><label class="enumerateLabel">key:</label><input class="enumerateKey"></div>\
                            <div class="enumeratePart divEnumerateVal"><label class="enumerateLabel">value:</label><input class="enumerateVal"></div>\
                            <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate">\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline" style="position:realtive">\
                <li class="property-base" id="liTempltConfigWrap">\
                    <div class="propertyTemplt">\
                        <span>自定义样式:</span>\
                        <input id="ckbpropertyTemplt" type="checkbox" style="vertical-align: bottom;"/>\
                        <span class="tempLtStatus"></span>\
                    </div>\
                    <div class="btnTool">\
                        <span id="btnPropTempltApply" class="glyphicon glyphicon-check"></span>\
                        <span id="btnPropTempltExport" class="glyphicon glyphicon-export"></span>\
                        <span id="btnPropTempltImport" class="glyphicon glyphicon-import"></span>\
                    </div>\
                </li>\
                <div id="templtConfigWrap">\
                    <ul class="list-unstyled">\
                        <li class="tplStyle">\
                            <label class="sr-only" for="inputNormalTemplt"></label>\
                            <textarea class="form-control" id="inputTplStyle" rows="3"></textarea>\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>';
        HtmlButtonProp.prototype.tplStyle = '' +
        '.Normal{\n' +
        '    /* 请输入按钮正常状态样式 */\n' +
        '}\n' +
        '.Normal:hover{\n' +
        '    /* 请输入按钮悬浮状态样式 */\n'+
        '}' +
        '';
    /** override */
    HtmlButtonProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model, isShowDsName = 'none', isShowDropArea = 'inline-block', enumerateOpacity = ' disabled';
        var defaultOpt = {
            x: model.x(),
            y: model.y(),
            w: model.w(),
            h: model.h()
        };
        var option = {
            text: model.option().text,
            class: model.option().class ? model.option().class: 'style1',
            dsId: model.idDs(),
            dsName: (function(ids){
                var idsName = [];
                if(!ids || !(ids instanceof Array) || ids.length == 0) return;
                isShowDsName = 'inline-block';
                isShowDropArea = 'none';
                enumerateOpacity = '';
                ids.forEach(function(id){
                    idsName = AppConfig.datasource.getDSItemById(id).alias
                });
                return idsName;
            }(model.idDs())),
            isShowDsName: isShowDsName,
            isShowDropArea: isShowDropArea,
            isAddOpacity: enumerateOpacity
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));
        //枚举初始化
        var $enumerateWrap = $('#enumerateWrap');
        var trigger = model.models[0].option().trigger;
        function isEmpty(obj) {
            for (var key in obj) {
                return false;
            }
        return true;
        };
        if(!isEmpty(trigger)){
            $('.enumerateItem').remove();
            for (var row in trigger){
                addEnumerate(row, trigger[row]);
            }
            $('#liEnumerateWrap .btnTool .btnEnumerate').show();
            this.$propertyList.find('#ckbEnumerate')[0].checked = true;
            $enumerateWrap.show();
        }
        function addEnumerate(key, value){
            var html =  '<li class="enumerateItem">\
                <div class="enumeratePart"><label class="enumerateLabel">key:</label><input class="enumerateKey" value={key}></div>\
                <div class="enumeratePart"><label class="enumerateLabel">value:</label><input class="enumerateVal" value={value}></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ';
            var $li = $(html.formatEL({
                key: key,
                value: value
            }));
            $enumerateWrap.find('ul').append($li)
        };
        if(model.option().style) {
            this.$propertyList.find('#inputTplStyle').val(model.option().style).prop('disabled', false);
            this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
            $('#templtConfigWrap').show();
        }else {
            this.$propertyList.find('#inputTplStyle').val(this.tplStyle).prop('disabled',true);
        }
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    /** override */
    HtmlButtonProp.prototype.close = function () {

    };

    /** override */
    HtmlButtonProp.prototype.update = function () {

    };

    HtmlButtonProp.prototype.attachEvent = function () {
        var _this = this;
        var tempStyle = '';

        //选择按钮样式
        $('#btnTxtStyle li', this.$propertyList).off('click').click(function(){
            var opt = _this.store.model.option();
            opt.class = this.dataset.class;
            _this.store.model.option(opt);
        });
        //预览按钮样式
        $('#btnTxtStyle li', this.$propertyList).hover(function(){
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
        //选择按钮类型
        $('#txtType li', this.$propertyList).off('click').click(function(){
            var opt = _this.store.model.option();
            opt.type = this.dataset.type;
            _this.store.model.option(opt);
        });
        //修改按钮显示内容
        $('.btnEditTxt', this.prototype).off('click').click(function(){
            //todo
            var $li = $(this).parent('li').addClass('showInput');
            $(this).prev('.p_input').focus().one('blur',function(){
                $li.removeClass('showInput');
                var opt = _this.store.model.option();
                opt.text = this.value;
                _this.store.model.option(opt);
            });
        });

        var $dataSource = $('.dataSource');
        $dataSource[0].ondrop = function(e){
            e.preventDefault();
            var id = EventAdapter.getData().dsItemId;
            _this.store.model.idDs(new Array(id));
        };

        $dataSource.off('click').on('click','.btnRemoveDs',function(e){
            _this.store.model.idDs([]);
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
        var $btnEnumerate = $('#liEnumerateWrap .btnTool #btnAddEnumerate');
        $('#ckbEnumerate')[0].onclick = function(){
            if($(this).is(':checked')){
                $('#enumerateWrap').slideDown();
                $btnEnumerate.show();
            }else{
                $('#enumerateWrap').slideUp();
                $btnEnumerate.hide();
            }
        };
        var $enumerateWrap = $('#enumerateWrap');
        var $ulEnumerate= $enumerateWrap.find('ul');
        //添加枚举
        $('#btnAddEnumerate')[0].onclick = function(){
            var $li = $('' +
                '<li class="enumerateItem">\
                <div class="enumeratePart"><label class="enumerateLabel">key:</label><input class="enumerateKey"></div>\
                <div class="enumeratePart"><label class="enumerateLabel">value:</label><input class="enumerateVal"></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ');
            $ulEnumerate.append($li);
        };

        //删除枚举
        $enumerateWrap.off('click').on('click', '.btnRemove',function(){
            $(this).parent().remove();
        });

        //保存枚举
        $('#btnSaveEnumerate')[0].onclick = function(e){
            var $arrKey = $('.enumerateKey'),$arrVal = $('.enumerateVal');
            var tempOpt;
            for (var i = 0 ; i < $arrKey.length; i++) {
                tempOpt = _this.store.model.option();
                tempOpt.trigger[parseFloat($arrKey.eq(i).val()).toFixed(0)] = $arrVal.eq(i).val();
                _this.store.model.option(tempOpt);
                //_this.store.model.option().trigger[$arrKey.eq(i).val()] = $arrVal.eq(i).val();
            }
            $('#enumerateWrap').slideUp();
        };

        //启用样式模板编辑
        var tpltConfigWrap = $('#templtConfigWrap');
        $('#ckbpropertyTemplt')[0].onclick = function(){
            if($(this).is(':checked')){
                $('#inputTplStyle').prop('disabled',false);
                tpltConfigWrap.slideDown();
            }else{
                $('#inputTplStyle').prop('disabled',true);
                tpltConfigWrap.slideUp();
            }
        };
        //应用模板
        $('#btnPropTempltApply')[0].onclick = function(){
            var tempOpt = _this.store.model.option();
            if($('#ckbpropertyTemplt').is(':checked')) {
                tempOpt.style = $('#inputTplStyle').val();
            }else{
                tempOpt.style = null;
            }
            _this.store.model.option(tempOpt);
        };
        //导入模板
        $('#btnPropTempltImport')[0].onclick = function(){
            MaterialModal.show(['widget'],function(data){
                var style = data.content.style;
                $('#inputTplStyle').val(style).prop('disabled',false);
                _this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
                tpltConfigWrap.slideDown();
            });
        };

        //导出模板
        $('#btnPropTempltExport')[0].onclick = function(){
            var templateName = prompt('输入模板名称');
            var widgets = (function(models){
                var arr = [];
                if(!models || models.length ==0) {
                    alert('要至少选择一个控件哦');
                   return;
                }
                for(var i = 0; i < models.length; i++){
                    arr.push(models[i].serialize());
                }
                return arr;
            }(_this.store.model.models));
            var tplStyle = $('#inputTplStyle').val();
            var data = {
                _id: ObjectId(),
                name: templateName,
                creator: AppConfig.userId,
                time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                "public": 1,
                group: '',
                type: 'widget',
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
    window.widgets.props.HtmlButtonProp = HtmlButtonProp;

} (window.widgets.factory.WidgetProp));

/** Html Button Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function HtmlButtonPropModel() {
        PropModel.apply(this, arguments);
    }

    HtmlButtonPropModel.prototype = Object.create(PropModel.prototype);
    HtmlButtonPropModel.prototype.constructor = HtmlButtonPropModel;

    HtmlButtonPropModel.prototype.option = function (params) {
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

    HtmlButtonPropModel.prototype.idDs = function (params) {
        var v;
        if(params) {
            this._setProperty('idDs', params);
            return true;
        }
        if((v = this._isPropertyValueSame('idDs') ) !== false ) {
            return v;
        }
    };

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.HtmlButtonPropModel = HtmlButtonPropModel;

} (window.widgets.propModels.PropModel));
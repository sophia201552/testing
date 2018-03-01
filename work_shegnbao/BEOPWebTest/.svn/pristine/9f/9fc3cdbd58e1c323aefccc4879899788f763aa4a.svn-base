(function (WidgetProp) {

    function CanvasPipeProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
    }

    CanvasPipeProp.prototype = Object.create(WidgetProp.prototype);
    CanvasPipeProp.prototype.constructor = CanvasPipeProp;

    CanvasPipeProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li id="pipeWidth"><label class="pipe-width">Pipewidth:</label><span class="property-value"> {width}</span><input class="property-value" type="text" value="{width}" style="display:none;border-color: #aaa;border-radius: 2px;width: 40px;"/>px</li>\
                <li id="pipeColor"><label class="pipe-color">Color:</label></span><input class="property-value" type="color" value="{color}"/></li>\
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
                    <li id="liEnumerateWrap" style="padding-top: 10px;display:{isShowEnumerate}">\
                    <div class="divTool">\
                        <div class="enumerateCtn{isDisabled}">\
                            <span class="span-bold">Enumerate:</span>\
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
        </li>';

    /** override */
    CanvasPipeProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model, isShowDsName = 'none',isShowEnumerate = 'none', isShowDropArea = 'inline-block', isDisabled = ' disabled';
        var opt = model.option();
        var defaultOpt = {
            x: typeof model.x() === 'number' ? model.x() : '-',// model.x() || '-',
            y: typeof model.y() === 'number' ? model.y() : '-',//model.y() || '-',
            w: typeof model.w() === 'number' ? model.w() : '-',//model.w() || '-',
            h: typeof model.h() === 'number' ? model.h() : '-'//model.h() || '-'
        };
        var option = {
            html: opt.html,
            width: opt.width,
            color: opt.color,
            dsId: model.idDs(),
            dsName: (function(ids){//获取点名
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
                            idsName = arrItem[m].alias
                            break;
                        }
                    }
                    //idsName = AppConfig.datasource.getDSItemById(id).alias
                });
                return idsName;
            }(model.idDs())),
            //enumerateHTML: (function(trigger){//显示枚举列表
            //    var tpl = '<li class="enumerateItem"><label class="enumerateLabel">key:</label><input class="enumerateKey" value="{i}"><label class="enumerateLabel">value:</label><input class="enumerateVal" value="{val}"><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></span></li>';
            //    var temp = '';
            //    if(!trigger || $.isEmptyObject(trigger)) return tpl.formatEL({i: '', val: ''});
            //    for(var i in trigger){
            //        temp += tpl.formatEL({i: i, val: trigger[i]})
            //    }
            //    return temp;
            //}(opt.trigger)),
            isShowDsName: isShowDsName,
            isShowEnumerate: isShowEnumerate,
            isShowDropArea: isShowDropArea,
            isDisabled: isDisabled
        }
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));

        //国际化
        $('.dataSource').find('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.DATA_SOURCE); 
        $('.pipe-width').html(I18n.resource.mainPanel.attrPanel.attrPipe.PIPE_WIDTH);
        $('.pipe-color').html(I18n.resource.mainPanel.attrPanel.attrPipe.PIPE_COLOR);

        //枚举初始化
        var $enumerateWrap = $('#enumerateWrap');
        var trigger = model.models[0].option().trigger;
		var strEnumerate='';
        var triggerEptCount = 0;
        if(!$.isEmptyObject(trigger)) {
            $('.enumerateItem').remove();
            for (var row in trigger) {
                strEnumerate += addEnumerate(row, trigger[row]);
				
            }
			$enumerateWrap.find('ul').append(strEnumerate);
            $('#liEnumerateWrap .divTool .btnEnumerate').show();
            var models = model.models;
            //判断选中的按钮的trigger是否有为空的，如果有则枚举不显示
            for (var i = 0; i < models.length; i++) {
                if ($.isEmptyObject(models[i].option().trigger)) {
                    triggerEptCount += 1;
                }
            }
            if (triggerEptCount===0) {
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
            var li = html.formatEL({
                key: key,
                value: value
            });
            return li;
        };
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    CanvasPipeProp.prototype.loadImage = function (value, callback) {

    }

    /** override */
    CanvasPipeProp.prototype.close = function () {

    };

    /** override */
    CanvasPipeProp.prototype.update = function () {
        console.log('pipe is update');
    };

    CanvasPipeProp.prototype.attachEvent = function () {
        var _this = this;
        //管道宽度输入框
        $('#pipeWidth input', this.$propertyList).off('change').change(function(){
            var opt = _this.store.model.option();
            opt.width = this.value;
            _this.store.model.option(opt,'width');
        });

        $('#pipeWidth span', this.$propertyList).off('click').click(function(){
            var $input = $(this).hide().next('input');
            $input.show().focus().val($input.val());
        });
        $('#pipeWidth input', this.$propertyList).off('blur').blur(function(){
            var $span = $(this).hide().prev('span');
            $span.show().focus().val($span.val());
        });

        //管道颜色选择
        $('#pipeColor input', this.$propertyList).off('change').change(function () {
            var opt = _this.store.model.option();
            opt.color = this.value;
            _this.store.model.option(opt, 'color');
        });

        //数据源接收
        var $dataSource = $('.dataSource');
        $dataSource[0].ondrop = function(e){
            e.preventDefault();
            var id = EventAdapter.getData().dsItemId;
            _this.store.model.idDs(new Array(id));
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
            //_this.store.model.option(opt, 'trigger');
            _this.store.model.update({
                'idDs': [],
                //'option.trigger': {}
            })
        });
        $('.dropArea', this.$propertyList)[0].ondragover = function(e){
            e.preventDefault();
            $(e.currentTarget).addClass('dragover');
        };
        $('.dropArea', this.$propertyList)[0].ondragleave = function(e){
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover');
        };

        //是否启用枚举
        var $btnEnumerate = $('#liEnumerateWrap .divTool #btnAddEnumerate');
        var $btnSaveEnumerate = $('#liEnumerateWrap .divTool #btnSaveEnumerate');
        $('#ckbEnumerate')[0].onclick = function(){
            if($(this).is(':checked')){
                $('#enumerateWrap').slideDown();
                $btnEnumerate.show();
                $btnSaveEnumerate.show();
            }else {
                $('#enumerateWrap').slideUp();
                $btnEnumerate.hide();
                $btnSaveEnumerate.hide();
            }
        }
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
                <div class="enumeratePart"><label class="enumerateLabel">key:</label><input class="enumerateKey"></div>\
                <div class="enumeratePart"><label class="enumerateLabel">value:</label><input class="enumerateVal"></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ');
            $ulEnumerate.append($li);
        };

        //删除枚举
        $('#enumerateWrap').off('click').on('click', '.btnRemove',function(){
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
            for (var i = 0 ; i < $arrKey.length; i++) {
                var parseFloatKey = parseFloat($arrKey.eq(i).val()).toFixed(0);
                if(isNaN(parseFloatKey))continue;
                tempOpt.trigger[parseFloatKey] = $arrVal.eq(i).val();
            }
            _this.store.model.option(tempOpt, 'trigger');
            //$('#enumerateWrap').slideUp();
        };
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.CanvasPipeProp = CanvasPipeProp;

} (window.widgets.factory.WidgetProp));

/** Canvas Image Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function CanvasPipePropModel() {
        PropModel.apply(this, arguments);
    }

    CanvasPipePropModel.prototype = Object.create(PropModel.prototype);
    CanvasPipePropModel.prototype.constructor = CanvasPipePropModel;

    CanvasPipePropModel.prototype.option = function (params, attr) {//attr可以为空
        if(class2type.call(params) === '[object Object]') {
            if(arguments.length == 1){
                this._setProperty('option', params);
            }else if(arguments.length == 2){//只设置option的指定属性:attr
                this._setProperty('option.' + arguments[1], params[arguments[1]]);
            }
            return true;
        }
        var opt = $.extend(true, {}, this.models[0].option());
        for(var i = 1, len = this.models.length, modelOpt; i < len; i ++){
            modelOpt = this.models[i].option();
            for(var j in modelOpt){
                if(opt[j] != modelOpt[j]){
                    opt[j] = '';
                }
            }
        }
        return opt;
    };
    ['idDs','option.trigger'].forEach(function(type){
        CanvasPipePropModel.prototype[type] = function (params) {
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
    //CanvasPipePropModel.prototype.idDs = function (params) {
    //    var v;
    //    if(params) {
    //        this._setProperty('idDs', params);
    //        return true;
    //    }
    //    if((v = this._isPropertyValueSame('idDs') ) !== false ) {
    //        return v;
    //    }
    //};

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.CanvasPipePropModel = CanvasPipePropModel;

} (window.widgets.propModels.PropModel));
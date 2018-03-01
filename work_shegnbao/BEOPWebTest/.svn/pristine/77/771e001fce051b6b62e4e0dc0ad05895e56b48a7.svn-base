(function (WidgetProp) {

    function CanvasImageProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
    }

    CanvasImageProp.prototype = Object.create(WidgetProp.prototype);
    CanvasImageProp.prototype.constructor = CanvasImageProp;

    CanvasImageProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li>\
                    <label class="img-canvas">Image: </label><button id="btnChooseImg" type="button" class="btn btn-xs btn-default">Choose</button>\
                    <label class="rotate-canvas">Rotate: </label><input id="inputRotate" class="p_input" value="{rotate}"/>°\
                </li>\
            </ul>\
        </ii>\
        <li>\
            <ul class="list-inline" style="position: relative;">\
                <li class="divPorpertyBase">\
                    <div class="dataSource">\
                        <span class="span-bold">Datasource:</span>\
                        <span class="spanDs" ds-id="{dsId}" style="display:{isShowDsName}">\
                            <span class=="dsText">{dsName}</span>\
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
                            <div class="enumeratePart divEnumerateVal"><label class="enumerateLabel">Value:</label><input class="enumerateVal"><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span></div>\
                            <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate">\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>';

    /** override */
    CanvasImageProp.prototype.show = function () {
        var _this = this;
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
            rotate: opt.rotate ,
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
            //    var tpl = '<li class="enumerateItem"><label class="enumerateLabel">key:</label><input class="enumerateKey" value="{i}"><label class="enumerateLabel">value:</label><input class="enumerateVal" value="{val}"><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></span></li>';
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
        $('.img-canvas').html(I18n.resource.mainPanel.attrPanel.attrImg.IMAGE);
        $('.rotate-canvas').html(I18n.resource.mainPanel.attrPanel.attrImg.ROTATE);
        $('#btnChooseImg').html(I18n.resource.mainPanel.attrPanel.attrImg.CHOOSE);

         //枚举初始化
        var $enumerateWrap = $('#enumerateWrap');
        var trigger = model.models[0].option().trigger;
		var strEnumerate='';
        if ( !$.isEmptyObject(trigger) ) {
            $('.enumerateItem').remove();
            var triggerConCount = 0;
            for (var row in trigger) {
                if (row === 'default') continue;
                triggerConCount += 1;
                strEnumerate += _this.addEnumerate(row, trigger[row]);
            }
            if (triggerConCount === 0) {
                strEnumerate += _this.addEnumerate('', '');
                $enumerateWrap.find('ul').append(strEnumerate);
                $enumerateWrap.hide();
                this.$propertyList.find('#ckbEnumerate').prop('checked', false);
            } else {
                $enumerateWrap.find('ul').append(strEnumerate);
                $enumerateWrap.show();
                this.$propertyList.find('#ckbEnumerate').prop('checked', true);
            }
            //if (!strEnumerate) {
                //$enumerateWrap.hide();
            //} else {
                //$enumerateWrap.find('ul').append(strEnumerate);
                //$('#liEnumerateWrap .divTool .btnEnumerate').show();
                //this.$propertyList.find('#ckbEnumerate').prop('checked', false);
                //$enumerateWrap.show();
            //}
        }
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };


    /** override */
    CanvasImageProp.prototype.close = function () {

    };

    CanvasImageProp.prototype.addEnumerate=function(key, value) {
        var html = '<li class="enumerateItem">\
                <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey" value={key}></div>\
                <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal" value={value}><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ';
        var li = html.formatEL({
            key: key,
            value: value
        });
        return li;
    };
    /** override */
    CanvasImageProp.prototype.update = function () { };

    CanvasImageProp.prototype.attachEvent = function () {
        var _this = this;

        $('#btnChooseImg', this.$propertyList).off('click').click(function(){
            MaterialModal.show(['pic','img'], function (data) {
                var model = _this.store.model;
                //var options = model.option();
                var w = model.w();
                var h = model.h();
                //model['option.trigger.default'](data._id);
                //options.trigger.default = data._id;
                _this.panel.screen.store.imageModelSet.append( new Model(data) );

                //w = (data.pw || data.w || w);
                //h = (data.h || h);
                //model.w(data.pw || data.w || w);
                //model.h(data.h || h);
                //model.option(options);
                //model['option'](options);
                model.update({
                    'w': data.pw || data.w || w,
                    'h': data.h || h,
                    'option.trigger.default': data._id
                });
            });
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
            var triggerAll = _this.store.model.models[0].option().trigger;
            var triggerDefault = {};
            triggerDefault = triggerAll.default ? { 'default': triggerAll.default } : {};
            _this.store.model.update({
                'idDs': [],
                'option.trigger': triggerDefault
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
            if ($(this).is(':checked')) {
                //当删除没提交时，ul的内容为空需要重新载入子元素
                if ($('#enumerateWrap').find('.list-unstyled').children().length===0) {
                    $('#enumerateWrap').find('ul').append(_this.addEnumerate('',''));
                }
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
                <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey"></div>\
                <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal"><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ');
            $ulEnumerate.append($li);
        };

        $('#enumerateWrap').off('click').on('click', '.btnRemove',function(){
            //删除枚举
            $(this).parents('#enumerateWrap').hide();
            $(this).parent().remove() ;
            var enumerateKey= $(this).siblings().find('input.enumerateKey').val();
            if(enumerateKey){
                delete _this.store.model['option.trigger']()[enumerateKey];
                _this.store.model.update({
                    'option.trigger': _this.store.model['option.trigger']()
                })
            }
            _this.$propertyList.find('#ckbEnumerate').prop('checked', false);
        }).on('click', '.btnChoosePic',function(){
            //枚举:选择图片
            var key = $.trim($(this).closest('.enumerateItem').find('.enumerateKey').val());
            var _btn = this;
            if(!key){
                //todo
                alert(I18n.resource.mainPanel.attrPanel.attrImg.ENUMER_INFO);
            }else{
                MaterialModal.show(['pic','img'], function (data) {
                    var options = _this.store.model.option();
                    options.trigger[key] = data._id;
                    $(_btn).siblings('.enumerateVal').val(data._id);
                });
            }
        });

        //枚举:选择图片
        //$('#enumerateWrap').off('click').on('click', '.btnChoosePic',function(){
        //    var key = $.trim($(this).siblings('.enumerateKey').val());
        //    var _btn = this;
        //    if(!key){
        //        //todo
        //        alert('先输入key值,谢谢!');
        //    }else{
        //        MaterialModal.show(['pic','img'], function (data) {
        //            var options = _this.store.model.option();
        //            options.trigger[key] = data._id;
        //            $(_btn).siblings('.enumerateVal').val(data._id);
        //        });
        //    }
        //});

        //保存枚举
        $('#btnSaveEnumerate')[0].onclick = function(e){
            var $arrKey = $('.enumerateKey'),$arrVal = $('.enumerateVal');
            var tempOpt = _this.store.model.option();
            tempOpt.trigger = {default: tempOpt.trigger.default};
            for (var i = 0 ; i < $arrKey.length; i++) {
                //var parseFloatKey = parseFloat($arrKey.eq(i).val()).toFixed(0);
                //if(isNaN(parseFloatKey))continue;
                tempOpt.trigger[$arrKey.eq(i).val()] = $arrVal.eq(i).val();
            }
            _this.store.model.option(tempOpt, 'trigger');
            //$('#enumerateWrap').slideUp();
        };

        $('#inputRotate', this.$propertyList).off('change').on('change', function(){
            if(isNaN(this.value)) return;
            var opt = _this.store.model.option();
            opt.rotate = Number(this.value);
            _this.store.model.option(opt,'rotate');
        });
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.CanvasImageProp = CanvasImageProp;

} (window.widgets.factory.WidgetProp));

/** Canvas Image Prop Model */
(function (PropModel) {

    var _this;
    var class2type = Object.prototype.toString;

    function CanvasImagePropModel() {
        _this = this;
        PropModel.apply(this, arguments);
    }

    CanvasImagePropModel.prototype = Object.create(PropModel.prototype);
    CanvasImagePropModel.prototype.constructor = CanvasImagePropModel;

    CanvasImagePropModel.prototype.option = function (params) {
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
            for(var i in modelOpt){
                if(opt[i] != modelOpt[i]){
                    opt[i] = {};
                }
            }
        }
        return opt;
    };
    ['idDs','option.trigger.default','option.trigger'].forEach(function(type){
        CanvasImagePropModel.prototype[type] = function (params) {
            var v;
            if(params) {
                this._setProperty(type, params);
                return true;
            }
            if((v = this._isPropertyValueSame(type) ) !== false ) {
                return v;
            }
        };
    });
    //CanvasImagePropModel.prototype.idDs = function (params) {
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
    window.widgets.propModels.CanvasImagePropModel = CanvasImagePropModel;

} (window.widgets.propModels.PropModel));
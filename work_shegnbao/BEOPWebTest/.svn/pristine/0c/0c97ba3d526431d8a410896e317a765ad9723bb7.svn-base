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
                    <button id="btnChooseImg" type="button" class="btn btn-xs btn-default">选择图片</button>\
                </li>\
                <li>\
                    <div class="dataSource">\
                        <span>数据源:</span>\
                        <span class="spanDs" ds-id="{dsId}" style="display:{isShowDsName}">\
                            <span class=="dsText">{dsName}</span>\
                            <span class="btnRemoveDs glyphicon glyphicon-remove"></span>\
                        </span>\
                        <span class="dropArea" style="display:{isShowDropArea}">\
                            <span class="glyphicon glyphicon-plus"></span>\
                        </span>\
                    </div>\
                </li>\
                <li>\
                    <div class="enumerateCtn{isAddOpacity}">\
                        <span>枚举:</span>\
                        <input id="ckbEnumerate" type="checkbox" style="vertical-align: bottom;"/>\
                    </div>\
                </li>\
                <div id="enumerateWrap">\
                    <ul class="list-unstyled">\
                        {enumerateHTML}\
                        <li>\
                            <span id="btnAddEnumerate" class="glyphicon glyphicon-plus-sign btnEnumerate"></span>\
                            <span id="btnSaveEnumerate" class="glyphicon glyphicon-ok-circle btnEnumerate"></span>\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>';

    /** override */
    CanvasImageProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model, isShowDsName = 'none', isShowDropArea = 'inline-block', enumerateOpacity = ' disabled';
        var opt = model.option();
        var defaultOpt = {
            x: model.x(),
            y: model.y(),
            w: model.w(),
            h: model.h()
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
                enumerateOpacity = '';
                ids.forEach(function(id){
                    idsName = AppConfig.datasource.getDSItemById(id).alias
                });
                return idsName;
            }(model.idDs())),
            enumerateHTML: (function(trigger){//显示枚举列表
                var tpl = '<li class="enumerateItem"><label class="enumerateLabel">key:</label><input class="enumerateKey" value="{i}"><label class="enumerateLabel">value:</label><input class="enumerateVal" value="{val}"><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></span></li>';
                var temp = '';
                if(!trigger || $.isEmptyObject(trigger)) return tpl.formatEL({i: '', val: ''});
                for(var i in trigger){
                    temp += tpl.formatEL({i: i, val: trigger[i]})
                }
                return temp;
            }(opt.trigger)),
            isShowDsName: isShowDsName,
            isShowDropArea: isShowDropArea,
            isAddOpacity: enumerateOpacity
        }
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));

        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    /** override */
    CanvasImageProp.prototype.close = function () {

    };

    /** override */
    CanvasImageProp.prototype.update = function () { };

    CanvasImageProp.prototype.attachEvent = function () {
        var _this = this;

        $('#btnChooseImg', this.$propertyList).off('click').click(function(){
            MaterialModal.show(['pic'], function (data) {
                var options = _this.store.model.option();
                options.trigger.default = data._id;
                _this.panel.screen.store.imageModelSet.append( new Model(data) );
                _this.store.model.option(options);
            });
        });

        //数据源接收
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
        $('#ckbEnumerate')[0].onclick = function(){
            if($(this).is(':checked')){
                $('#enumerateWrap').slideDown();
            }else{
                $('#enumerateWrap').slideUp();
            }
        }

        //添加枚举
        $('#btnAddEnumerate')[0].onclick = function(){
            var $li = $('<li class="enumerateItem"><label class="enumerateLabel">key:</label><input class="enumerateKey"><label class="enumerateLabel">value:</label><input class="enumerateVal"><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></span></li>');
            $(this).parent().before($li);
        };

        //删除枚举
        $('#enumerateWrap').off('click').on('click', '.btnRemove',function(){
            $(this).parent().remove();
        });

        //枚举:选择图片
        $('#enumerateWrap').off('click').on('click', '.btnChoosePic',function(){
            var key = $.trim($(this).siblings('.enumerateKey').val());
            var _btn = this;
            if(!key){
                //todo
                alert('先输入key值,谢谢!');
            }else{
                MaterialModal.show(['pic'], function (data) {
                    var options = _this.store.model.option();
                    options.trigger[key] = data._id;
                    $(_btn).siblings('.enumerateVal').val(data._id);
                });
            }
        });

        //保存枚举
        $('#btnSaveEnumerate')[0].onclick = function(e){
            var $arrKey = $('.enumerateKey'),$arrVal = $('.enumerateVal');
            var tempOpt;
            for (var i = 0 ; i < $arrKey.length; i++) {
                tempOpt = _this.store.model.option();
                if(!tempOpt.trigger){
                    tempOpt.trigger = {}
                }
                tempOpt.trigger[parseFloat($arrKey.eq(i).val()).toFixed(0)] = $arrVal.eq(i).val();
                //_this.store.model.option().trigger[$arrKey.eq(i).val()] = $arrVal.eq(i).val();
            }
            _this.store.model.option(tempOpt);
            $('#enumerateWrap').slideUp();
        };
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

    //CanvasImagePropModel.prototype.option = {
    //    'trigger.default': function (params) {
    //        if(class2type.call(params) === '[object String]') {
    //            _this._setProperty('option.trigger.default', params);
    //            return true;
    //        }
    //        return '';
    //    }
    //};

    CanvasImagePropModel.prototype.option = function (params) {
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

    CanvasImagePropModel.prototype.idDs = function (params) {
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
    window.widgets.propModels.CanvasImagePropModel = CanvasImagePropModel;

} (window.widgets.propModels.PropModel));
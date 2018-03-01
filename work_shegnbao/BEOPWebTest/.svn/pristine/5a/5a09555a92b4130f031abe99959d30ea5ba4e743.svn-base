(function (WidgetProp) {

    function CanvasPipeProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
    }

    CanvasPipeProp.prototype = Object.create(WidgetProp.prototype);
    CanvasPipeProp.prototype.constructor = CanvasPipeProp;

    CanvasPipeProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li id="pipeWidth"><label class="">pipe width:</label><span class="property-value">{width}</span><input class="property-value" type="text" value="{width}" style="display:none;border-color: #aaa;border-radius: 2px;width: 40px;"/>px</li>\
                <li id="pipeColor"><label class="">color:</label></span><input class="property-value" type="color" value="{color}"/></li>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline" style="position: relative;">\
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
    CanvasPipeProp.prototype.show = function () {
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
                var tpl = '<li class="enumerateItem"><label class="enumerateLabel">key:</label><input class="enumerateKey" value="{i}"><label class="enumerateLabel">value:</label><input class="enumerateVal" value="{val}"><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></span></li>';
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
            _this.store.model.option(opt);
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
        $('#pipeColor input', this.$propertyList).off('change').change(function(){
            var opt = _this.store.model.option();
            opt.color = this.value;
            _this.store.model.option(opt);
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
            var $li = $('<li class="enumerateItem"><label class="enumerateLabel">key:</label><input class="enumerateKey"><label class="enumerateLabel">value:</label><input class="enumerateVal"><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></span></li>');
            $(this).parent().before($li);
        };

        //删除枚举
        $('#enumerateWrap').off('click').on('click', '.btnRemove',function(){
            $(this).parent().remove();
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

    CanvasPipePropModel.prototype.option = function (params) {
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

    CanvasPipePropModel.prototype.idDs = function (params) {
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
    window.widgets.propModels.CanvasPipePropModel = CanvasPipePropModel;

} (window.widgets.propModels.PropModel));
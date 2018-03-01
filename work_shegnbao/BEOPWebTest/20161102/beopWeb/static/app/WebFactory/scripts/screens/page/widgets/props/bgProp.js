
(function (WidgetProp) {

    function BgProp(propCtn, model) {
        WidgetProp.apply(this, arguments);

    }

    BgProp.prototype = Object.create(WidgetProp.prototype);
    BgProp.prototype.constructor = BgProp;

    BgProp.prototype.tplPrivateProp = '\
                    <li>\
                        <ul class="list-inline">\
                            <li>\
                            <span style="vertical-align: middle;">Background Selection：</span>\
                            <div class="btn-group">\
                                <button type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span></span><span class="caret"></span>\
                                </button>\
                                <ul class="dropdown-menu" id="ulBg">\
                                <li><a href="#" data-view="color" class="aColor">Pure</a></li>\
                                <li><a href="#" data-view="image" class="aImage">Image</a></li>\
                                <li><a href="#" data-view="html" class="aHtml">Html</a></li>\
                                </ul>\
                                <input type="color" style="display: none;margin-left: 20px;height: 22px;" value="{colorVal}">\
                            </div>\
                            </li>\
                        </ul>\
                        <ul class="list-inline">\
                            <li class="txtShow" style="display:none;">\
                                <label class="">Content:</label>\
                                <span class="p_span" style="display:none;">{text}</span>\
                                <span class="btnEditTxt glyphicon glyphicon-edit"></span>\
                            </li>\
                            <li id="btnImg" style="display: none;">\
                                <div style="margin-top: 10px;">\
                                    <button type="button" class="btn btn-xs btn-default" id="btnBg">Choose Image</button>\
                                    <div class="btn-group" style="margin-left: 42px;">\
                                    <button type="button" style="width:65px;" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span>Stretch</span><span class="caret"></span>\
                                    </button>\
                                    <ul class="dropdown-menu selectItem" id="ulStyle">\
                                    <li><a href="#" id="bgStretch" data-view="stretch">Stretch</a></li>\
                                    <li><a href="#" id="bgCenter" data-view="contain">Cotain</a></li>\
                                    </ul>\
                                    </div>\
                                </div>\
                            </li>\
                        </ul>\
                    </li>';
     /** override */
    BgProp.prototype.show = function () {
        var model = this.store.model.models[0], isShowDsName = 'none', isShowDropArea = 'inline-block', enumerateOpacity = ' disabled';
        var modelOptions = model.option();
        var type = modelOptions.type;
        var option = {
            text: model.option().text,
            colorVal:model.option().color,
            isShowDsName: isShowDsName,
            isShowDropArea: isShowDropArea,
            isAddOpacity: enumerateOpacity
        };
        this.$propertyList.empty().append(this.tplPrivateProp.formatEL(option));
        this.attachPubEvent(this.store.model);
        this.attachEvent();
        this.bgChange($('#ulBg').find('[data-view="'+type+'"]'),model,true);
        //$('#ulBg').find('[data-view="'+type+'"]').trigger('click');
        if (type === 'image') {
            if (modelOptions.display === '') {
                modelOptions.display = 'stretch';
            }
            $('#ulStyle').find('[data-view="'+modelOptions.display+'"]').trigger('click');
        }
    };
    BgProp.prototype.attachEvent = function () {
        var model = this.store.model.models[0];
        var _this= this;
        $('#ulBg').off('click').on('click', 'a', function () {
            var $current = $(this);
            _this.bgChange($current,model);
	    });

        $('#btnBg').click(function() {
            MaterialModal.show(['Image'],function(data) {
                model['option.type']('image');
                model['option.url'](data.url);
            });
        });

        $('#ulStyle').off('click').on('click', 'a', function () {
            var $current = $(this);
            var $button = $current.closest('ul').siblings('.btn').children();
            $button.eq(0).html( $current.html() );
            model['option.display'](this.dataset.view);
        });
        //修改按钮显示内容
        $('.btnEditTxt', this.prototype).off('click').click(function(){
            function saveContent(content){
                var opt = _this.store.model.option();
                opt.html = content;
                _this.store.model.option(opt);
            }
            EditorModal.show(_this.store.model.option().html, false, saveContent);
        });
    };

    BgProp.prototype.bgChange = function ($current,model,firstLoad) {
        var $ul = $current.closest('ul');
        var $button = $ul.siblings('.btn').children();
        var $input = $ul.siblings('input');
        var $btnImg = $('#btnImg');
        var $liTxtshow = $btnImg.prev('.txtShow');
        var type = $current[0].dataset.view;
        $button.eq(0).html( $current.html() );
        if ( type === 'color' ) {
            $input.off().change(function() {
                model['option.color'](this.value.trim());
            });
            if(!firstLoad){
                model['option.color']('#ffffff');
                $input.val('#ffffff');
            }
            model['option.type']('color');
            $input.show();
            $btnImg.hide();
            $liTxtshow.hide();
        } else if ( type === 'image' ) {
            if(!firstLoad){
                model['option.url']('');
            }
            model['option.type']('image');
            $input.hide();
            $btnImg.show();
            $liTxtshow.hide();
        }else if(type === 'html'){
            model['option.type']('html');
            $liTxtshow.show();
            $input.hide();
            $btnImg.hide();
        }
    }

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.BgProp = BgProp;
}(window.widgets.factory.WidgetProp));

(function (PropModel) {

    var class2type = Object.prototype.toString;

    function BgPropModel() {
        PropModel.apply(this, arguments);
    }

    BgPropModel.prototype = Object.create(PropModel.prototype);
    BgPropModel.prototype.constructor = BgPropModel;

    BgPropModel.prototype.option = function (params) {
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

    BgPropModel.prototype.idDs = function (params) {
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
    window.widgets.propModels.BgPropModel = BgPropModel;

} (window.widgets.propModels.PropModel));
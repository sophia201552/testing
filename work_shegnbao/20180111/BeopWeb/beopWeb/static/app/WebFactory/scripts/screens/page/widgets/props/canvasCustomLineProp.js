(function (WidgetProp) {
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    function CanvasCustomLineProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
    }

    CanvasCustomLineProp.prototype = Object.create(WidgetProp.prototype);
    CanvasCustomLineProp.prototype.constructor = CanvasCustomLineProp;

    CanvasCustomLineProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li id="lineWidth"><label class="line-width">Pipewidth:</label><span class="property-value"> {width}</span><input class="property-value" type="text" value="{width}" style="display:none;border-color: #aaa;border-radius: 2px;width: 40px;"/>px</li>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline">\
                <li id="lineColor"><label class="line-color">Color:</label>\
                    <div class="dropdown">\
                      <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                        <span class="colorSpan" style="background-color:{color}"></span>\
                      </button>\
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">\
                        <li><a href="#"><span class="colorSpan" style="background-color:#ff6f4f"></span></a></li>\
                        <li><a href="#"><span class="colorSpan" style="background-color:#5eb44f"></span></a></li>\
                        <li><a href="#"><span class="colorSpan" style="background-color:#3396ec"></span></a></li>\
                        <li><a href="#"><span class="colorSpan" style="background-color:#ed3434"></span></a></li>\
                        <li><a href="#" class = "custom">自定义</a></li>\
                      </ul>\
                    </div>\
                    <input class="property-value" type="color" value="{color}"/></li>\
                <li id="lineStyle"><label class="line-style">线段样式:</label>\
                    <div class="dropdown">\
                      <button class="btn btn-default dropdown-toggle" type="button" id="dropdownStyle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                        <span class="styleSpan">{style}</span>\
                      </button>\
                      <ul class="dropdown-menu" aria-labelledby="dropdownStyle">\
                        <li><a href="#"><span class="styleSpan" data-index="0">实线</span></a></li>\
                        <li><a href="#"><span class="styleSpan" data-index="1">虚线</span></a></li>\
                      </ul>\
                    </div>\
            </ul>\
        </li>';

    /** override */
    CanvasCustomLineProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model;
        var opt = model.option();
        var option = {
            width: opt.width,
            color: opt.color,
            style: (function (style) {
                var rs;
                switch (style) {
                    case 0:
                        rs = AppConfig.language === "zh"?'实线':I18n.resource.mainPanel.attrPanel.attrPipe.FULL_LINE;
                        break;
                    case 1:
                        rs = AppConfig.language === "zh"?'虚线':I18n.resource.mainPanel.attrPanel.attrPipe.IMAGINARY_LINE;
                        break;
                    default:
                        rs = AppConfig.language === "zh"?'未知':I18n.resource.mainPanel.attrPanel.attrPipe.UNKNOWN;
                }
                return rs;
            })(opt.style)
        };
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));

        //国际化
        $('.line-width').html(I18n.resource.mainPanel.attrPanel.attrLine.LINE_WIDTH);
        $('.line-color').html(I18n.resource.mainPanel.attrPanel.attrLine.LINE_COLOR);
        $('.custom').html(I18n.resource.mainPanel.attrPanel.attrLine.CUSTOM_COLOR);
        $('.line-style').html(I18n.resource.mainPanel.attrPanel.attrLine.LINE_STYLE);
        $('#lineStyle').find("span[data-index = '0']").text(I18n.resource.mainPanel.attrPanel.attrPipe.FULL_LINE);
        $('#lineStyle').find("span[data-index = '1']").text(I18n.resource.mainPanel.attrPanel.attrPipe.IMAGINARY_LINE);

        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    /** override */
    CanvasCustomLineProp.prototype.close = function () {

    };

    /** override */
    CanvasCustomLineProp.prototype.update = function () {
        console.log('line is update');
    };

    CanvasCustomLineProp.prototype.attachEvent = function () {
        var _this = this;
        //线段宽度输入框
        $('#lineWidth input', this.$propertyList).off('change').change(function(){
            var opt = _this.store.model.option();
            opt.width = this.value;
            _this.store.model.option(opt,'width');
        });

        $('#lineWidth span', this.$propertyList).off('click').click(function(){
            var $input = $(this).hide().next('input');
            $input.show().focus().val($input.val());
        });
        $('#lineWidth input', this.$propertyList).off('blur').blur(function(){
            var $span = $(this).hide().prev('span');
            $span.show().focus().val($span.val());
        });

        //线段颜色选择
        $('#lineColor .dropdown', this.$propertyList).off('click').on('click', 'li a', function () {
            if ($(this).hasClass('custom')) {
                $('#lineColor input', this.$propertyList).trigger('click');
            } else {
                var opt = _this.store.model.option();
                opt.color = $(this).find('.colorSpan').css('backgroundColor');
                _this.store.model.option(opt, 'color');
            }
        });
        $('#lineColor input', this.$propertyList).off('change').change(function () {
            var opt = _this.store.model.option();
            opt.color = this.value;
            _this.store.model.option(opt, 'color');
        });

        //线段样式选择
        $('#lineStyle .dropdown', this.$propertyList).off('click').on('click', 'li a', function () {
            var opt = _this.store.model.option();
            opt.style = Number($(this).find('.styleSpan').data('index'));
            _this.store.model.option(opt, 'style');
        });
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.CanvasCustomLineProp = CanvasCustomLineProp;

} (window.widgets.factory.WidgetProp));

/** Canvas Image Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function CanvasCustomLinePropModel() {
        PropModel.apply(this, arguments);
    }

    CanvasCustomLinePropModel.prototype = Object.create(PropModel.prototype);
    CanvasCustomLinePropModel.prototype.constructor = CanvasCustomLinePropModel;

    CanvasCustomLinePropModel.prototype.option = function (params, attr) {//attr可以为空
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
                if(Array.isArray(modelOpt[j])){
                    var item = modelOpt[j].slice().toString();
                    if (opt[j].slice().toString() != item) {
                        opt[j] = [];
                    }
                }else{
                    if (opt[j] != modelOpt[j]) {
                        if (j === 'trigger') {
                            opt[j] = {};
                        } else {
                            opt[j] = '';
                        }
                    }
                }
            }
        }
        return opt;
    };
    ['idDs','option.trigger','option.points','option.direction','option.preview','option.logic'].forEach(function(type){
        CanvasCustomLinePropModel.prototype[type] = function (params) {
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

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.CanvasCustomLinePropModel = CanvasCustomLinePropModel;

} (window.widgets.propModels.PropModel));
(function (exports, SuperClass, HtmlWidgetMixin) {

    function HtmlText(layer, model) {
        SuperClass.apply(this, arguments);
    }

    HtmlText.prototype = Object.create(SuperClass.prototype);
    HtmlText.prototype.constructor = HtmlText;

    HtmlText.prototype.tpl = '<p class="html-widget html-text"></p>';

    HtmlText.prototype.init = function () {
        //兼容一下老数据格式
        this._format();

        SuperClass.prototype.init.apply(this, arguments);
    };

    //兼容老数据
    HtmlText.prototype._format = function () {
        var model = this.store.model;
        var options = model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if(options.pageId == undefined) {
            options.pageId = '';
        }
        if(options.pageType == undefined) {
            options.pageType = '';
        }
        if(!options.float) {
            options.float = 0;
        }
        if(!options.preview){
            options.preview = [];
        }
        if(typeof options.precision === 'string'){
            options.precision = parseInt(options.precision);
        }
        if(!options.equipments){
            options.equipments = [];
        }
        this.store.model.option(options);
    };

    /** override */
    HtmlText.prototype.show = function () {
        var model = this.store.model;

        SuperClass.prototype.show.apply(this, arguments);

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.update();

        this.layer.add(this.shape);

        this.fixZoom();
    };

    /** override */
    HtmlText.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();
        var value;

        if (!propName || propName.indexOf('update.idDs') > -1) {
            if ($.fn.zTree) {
                var treeObj = $.fn.zTree.getZTreeObj('parentTree');
            }
        
            if (treeObj) {
                var node = treeObj.getNodeByParam('modelId', model._id());
                if (node && model.idDs) {
                    var idDs = model.idDs();
                    var name;
                    if (idDs.length > 0) {
                        name = idDs[0];
                        name !== node.name && (node.name = name, treeObj.updateNode(node));
                    } else {
                        node.name = I18n.resource.mainPanel.layerName.TEXT;
                        treeObj.updateNode(node);
                    }
                }
            }
        }
        
        if (!propName || propName.indexOf('update.x') > -1 || propName.indexOf('update.y') > -1) {
            this.shape.style.left = model.x() + 'px';
            this.shape.style.top = model.y() + 'px';
        }

        if (!propName || propName.indexOf('update.w') > -1 || propName.indexOf('update.h') > -1) {
            this.shape.style.width = model.w() + 'px';
            this.shape.style.height = model.h() + 'px';
        }

        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        // options.text 为 string 类型，说明是在编辑 模式下
        if (typeof options.text === 'string') {
            this.shape.innerHTML = options.text;
        }
        // options.text 为 object 类型，说明是在预览模式下
        else if (typeof options.text === 'object') {
            if (options.text.value !== '' && !isNaN(options.text.value)) {
                value = parseFloat(options.text.value).toFixed(options.precision == undefined?2:options.precision);
            } else {
                value = options.text.value;
            }
            // 判断是否有 <%value%> 占位符，如果没有，则整体替换
            if (options.text.content.indexOf('<%value%>') === -1) {
                this.shape.innerHTML = value;
            } else {
                this.shape.innerHTML = options.text.content.replace('<%value%>', value);
            }
        }
        var _this = this;
        this.shape.classList.forEach(function(row,i){
            if(i > 1){
                _this.shape.classList.remove(row);
            }
        });
        this.shape.classList.add(options.class === '' ? undefined : options.class);

        if(options.style) {
            var initStyle = options.style;
            var normalStyle = initStyle.replace(/.Normal/g, '#' + model._id().toHexString());
            var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.id = 'style-' + model._id();
            if (style.stylesheet) {
                style.stylesheet.cssText = normalStyle;
            } else {
                style.appendChild(document.createTextNode(normalStyle))
            }
            if (document.getElementById(style.id)) {
                $('#' + style.id).remove();
            }
            head.appendChild(style);
        } else {
            $('#style-' + model._id()).remove();
        }

        SuperClass.prototype.update.apply(this, arguments);
        Log.info('html text widget has been updated.');
    };
    // 获取模板中的模板参数
    HtmlText.prototype.getTplParams = function (data){
        if(data){
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match = null;
            var params = [];
            var str = data.option.text;
            while( match = pattern.exec(str) ) {
                params.push({
                    name: match[1],
                    value: ''
                });
            }
            return params;
        }
    };
    // 应用
    HtmlText.prototype.applyTplParams = function (data){
        if(data){
            var reg = data.reg;
            var strNew = data.strNew;
            var widget = data.widget;
            widget.option.text = widget.option.text.replace(reg, strNew);
            return widget;
        }
    };

    HtmlText.prototype = Mixin(HtmlText.prototype, HtmlWidgetMixin);

    HtmlText.prototype.type = 'HtmlText';

    exports.HtmlText = HtmlText;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));
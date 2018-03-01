(function (exports, SuperClass, HtmlWidgetMixin) {

    function HtmlContainer(layer, model) {
        SuperClass.apply(this, arguments);
    }

    HtmlContainer.prototype = Object.create(SuperClass.prototype);
    HtmlContainer.prototype.constructor = HtmlContainer;

    HtmlContainer.prototype.tpl = '<div class="html-widget html-container"></div>';

    HtmlContainer.prototype.CSS_FORMAT_PATTERN = /([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg;

    HtmlContainer.prototype.JS_FORMAT_PATTERN = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/img;

    HtmlContainer.prototype.init = function () {
        //兼容一下老数据格式
        this._format();
        SuperClass.prototype.init.apply(this, arguments);
    };

    HtmlContainer.prototype._format = function () {
        var options = this.store.model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if(!options.css) {
            options.css = '';
        }
        if(!options.js) {
            options.js = '';
        }
        if(!options.display){
            options.display = 0;
        }

        this.store.model.option(options);
    };

    /** override */
    HtmlContainer.prototype.show =  function  () {
        var model = this.store.model;
        var options = model.option();
        if(AppConfig.projectCurrent&&AppConfig.projectCurrent.i18n==1){
            if(AppConfig.isFactory==0||AppConfig.userId==''){
                options.html=I18n.trans(options.html);
                options.js=I18n.trans(options.js);
              }
          }
          
        SuperClass.prototype.show.apply(this, arguments);

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.shape.style.border = '1px dashed #aaa';
        this.update();

        this.layer.add(this.shape);
    };

    /** override */
    HtmlContainer.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();
        if (!propName || propName.indexOf('update.x') > -1 || propName.indexOf('update.y') > -1) {
            this.shape.style.left = model.x() + 'px';
            this.shape.style.top = model.y() + 'px';
        }

        if (!propName || propName.indexOf('update.w') > -1 || propName.indexOf('update') > -1) {
            this.shape.style.width = model.w() + 'px';
            this.shape.style.height = model.h() + 'px';
        }

        if (!propName || propName.indexOf('update.option') > -1) {
            this.preview();
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

        SuperClass.prototype.update.apply(this, arguments);

        Log.info('html container widget has been updated.');
    };

    HtmlContainer.prototype.preview = function () {
        var options = this.store.model.option();
        var formatCss, guid;
        
        if (options.html || options.css) {
            guid = ObjectId();
            this.shape.style.background = 'none';
            formatCss = (options.css || '').replace(this.CSS_FORMAT_PATTERN, function ($0, $1, $2) {
                return '#hc_' + guid + ' ' + $0;
            }).replace('__container__', '');
            this.shape.innerHTML = ['<div class="ps-w-html-contaienr" id="hc_' + guid + '">', (options.html) || '', '</div>',
                 '<style>', formatCss, '</style>'].join('');
        } else {
            this.shape.innerHTML = '';
            this.shape.style.backgroundImage = 'url("/static/app/WebFactory/themes/default/images/demo/htmlContainer.png")';
            this.shape.style.backgroundSize = '100% 100%';
            this.shape.style.backgroundColor = 'rgba(243, 219, 202, 0.35)';
        }
    };
    // 获取模板中的模板参数
    HtmlContainer.prototype.getTplParams = function (data){
        if(data){
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match = null;
            var params = [];
            var str = data.option.html +  data.option.css + data.option.js;
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
    HtmlContainer.prototype.applyTplParams = function (data){
        if(data){
            var reg = data.reg;
            var strNew = data.strNew;
            var widget = data.widget;
            widget.option.html = widget.option.html.replace(reg, strNew);
            widget.option.css = widget.option.css.replace(reg, strNew);
            widget.option.js = widget.option.js.replace(reg, strNew);
            return widget;
        }
    };

    /** 适配工作 */
    HtmlContainer.prototype = Mixin(HtmlContainer.prototype, HtmlWidgetMixin);
    HtmlContainer.prototype.type = 'HtmlContainer';

    exports.HtmlContainer = HtmlContainer;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));
(function (exports, SuperClass) {

    function GHtmlStage() {
        SuperClass.apply(this, arguments);

        this.store = {};
        this.store.background = null;
    }

    GHtmlStage.prototype = Object.create(SuperClass.prototype);
    GHtmlStage.prototype.constructor = GHtmlStage;

    /** override */
    GHtmlStage.prototype.init = function () {
        var w = this.painter.stage.width();
        var h = this.painter.stage.height();
        var pageWidth = this.painter.pageWidth;
        var pageHeight = this.painter.pageHeight;
        
        this.shape = document.createElement('div');
        this.shape.className = 'html-layer';
        this.shape.style.width = pageWidth + 'px';
        this.shape.style.height = pageHeight + 'px';
        this.shape.style.left = (w - pageWidth) / 2 + 'px';
        this.shape.style.top = (h - pageHeight) / 2 + 'px';
        this.shape.style.zIndex = 3;

        this.painter.stage.getContent().appendChild(this.shape);
    };

    GHtmlStage.prototype.setZIndex = function (zIndex) {
        this.shape.style.zIndex = zIndex;
    };
    GHtmlStage.prototype.setBackground = function (background) {
        var $bgShape = $(this.shape);
        var $userBgShape = $bgShape.find(".html-inner-bg");

        this.store.background = background;

        if($userBgShape.length === 0) {
            this.shape.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAChJREFUeNpiPHPmDAMMGBsbw9lMDDgA6RKM%2F%2F%2F%2Fh3POnj1LCzsAAgwAQtYIcFfEyzkAAAAASUVORK5CYII%3D)';
            
            $bgShape.html('<div style="width:100%;height:100%" class="html-inner-bg" id="innerBg"></div>');
            $userBgShape = $bgShape.find(".html-inner-bg");
        }

        // 添加默认值
        if (!background) {
            background = {
                type: 'color',
                color: '#e1e3e5'
            };
        }

        if (background.type == "image") {
            if(background.display == "tile") {
                $userBgShape.css({
                    'background-image':'url('+background.url+')',
                    "background-repeat":"repeat",
                    "background-size":"contain"
                });
            }else{
                $userBgShape.css({
                    'background-image':'url('+background.url+')',
                    "background-repeat":"no-repeat",
                    "background-size":"100% 100%"
                });
            }
        } else {
            $userBgShape.css("background-color", background.color);
        }
    };


    GHtmlStage.prototype.getBackground = function () {
        return this.store.background;
    };

    GHtmlStage.prototype.getChildren = function () {
        return this.children;
    };

    GHtmlStage.prototype.add = function (shape) {
        this.shape.appendChild(shape);
    };

    GHtmlStage.prototype.draw = function () { /** 不需要做任何事 */ };

    GHtmlStage.prototype.position = function (params) {
        if(typeof params !== 'undefined') {
            this.x(params.x);
            this.y(params.y);
            return true;
        }

        return {
            x: this.x(),
            y: this.y()
        };
    };

    GHtmlStage.prototype.x = function (val) {
        if(Object.prototype.toString.call(val) === '[object Number]') {
            return this.shape.style.left = val + 'px';
        }
        return parseFloat(this.shape.style.left || 0);
    };

    GHtmlStage.prototype.y = function (val) {
        if(Object.prototype.toString.call(val) === '[object Number]') {
            return this.shape.style.top = val + 'px';
        }
        return parseFloat(this.shape.style.top || 0);
    };

    GHtmlStage.prototype.offsetX = function (v) {
        var style;
        if(v !== undefined) {
            return this.shape.style.left = v + 'px';
        }
        style = window.getComputedStyle(this.shape);
        return parseFloat(style.left);
    };

    GHtmlStage.prototype.offsetY = function (v) {
        var style;
        if(v !== undefined) {
            return this.shape.style.top = v + 'px';
        }
        style = window.getComputedStyle(this.shape);
        return parseFloat(style.top);
    };

    GHtmlStage.prototype.width = function () {};

    GHtmlStage.prototype.height = function () {};

    GHtmlStage.prototype.getType = function () {
        return 'Stage';
    };

    GHtmlStage.prototype.scale = function (scaleX, scaleY) {
        var tW = this.painter.stage.width();
        var tH = this.painter.stage.height();
        var w = parseFloat(this.painter.pageWidth);
        var h = parseFloat(this.painter.pageHeight);

        if (typeof scaleY === 'undefined') {
            scaleY = scaleX;
        }

        this.shape.style.transform = 'scale('+scaleX+', '+scaleY+')';
        this.shape.style.width = w + 'px';
        this.shape.style.height = h + 'px';
        this.shape.style.left = (tW - w*scaleX)/2 + 'px';
        this.shape.style.top = (tH - h*scaleY)/2 + 'px';
    };

    GHtmlStage.prototype.scaleBound = function (scaleX, scaleY) {
        var tW = this.painter.stage.width();
        var tH = this.painter.stage.height();
        var w = parseFloat(this.painter.pageWidth)*scaleX;
        var h = parseFloat(this.painter.pageHeight)*scaleY;

        this.shape.style.width = w + 'px';
        this.shape.style.height = h + 'px';
        this.shape.style.left = (tW - w)/2 + 'px';
        this.shape.style.top = (tH - h)/2 + 'px';

        this.painter.getRootLayer().findByCondition(function (row) {
            var model = row.store.model;
            if (model.type() === 'HtmlDashboard' && model['option.display'] !== 0) {
                row.update();
            }
        });
    };

    GHtmlStage.prototype.fixZoom = function () {
        var types = ['HtmlButton', 'HtmlText'];
        var widgets = this.painter.getAllWidgets();

        widgets.forEach(function (row) {
            if (types.indexOf( row.store.model.type() ) > -1) {
                row.fixZoom();
            }
        });
    };

    GHtmlStage.prototype.close = function () {
        SuperClass.prototype.close.call(this);
        this.shape.parentNode.removeChild(this.shape);
    };

    exports.GHtmlStage = GHtmlStage;

} (
    window,
    namespace('GStage')
));
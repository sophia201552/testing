(function () {

    function GHtmlStage(painter) {
        this.painter = painter;

        this.shape = null;
        this.children = [];

        this.init();
    }

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

    GHtmlStage.prototype.getChildren = function () {
        return this.children;
    };

    GHtmlStage.prototype.findOne = function (selector) {
        var id = selector.substr(1).trim();
        var rs = [];
        rs = this.children.filter(function (row) {
            return row.store.model._id() === id;
        });
        return rs.length > 0 ? rs[0] : null;
    };

    GHtmlStage.prototype.add = function (layer) {
        this.children.push(layer);
        this.shape.appendChild(layer.shape);
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

    GHtmlStage.prototype.scale = function (scale) {
        var tW = this.painter.stage.width();
        var tH = this.painter.stage.height();
        var w = parseFloat(this.painter.pageWidth);
        var h = parseFloat(this.painter.pageHeight);

        this.shape.style.transform = 'scale('+scale+')';
        this.shape.style.width = w + 'px';
        this.shape.style.height = h + 'px';
        this.shape.style.left = (tW - w*scale)/2 + 'px';
        this.shape.style.top = (tH - h*scale)/2 + 'px';
    };

    GHtmlStage.prototype.viewScale = function (scaleX, scaleY) {
        var tW = this.painter.stage.width();
        var tH = this.painter.stage.height();
        var w = parseFloat(this.painter.pageWidth)*scaleX;
        var h = parseFloat(this.painter.pageHeight)*scaleY;

        this.shape.style.width = w + 'px';
        this.shape.style.height = h + 'px';
        this.shape.style.left = (tW - w)/2 + 'px';
        this.shape.style.top = (tH - h)/2 + 'px';
    };

    window.GHtmlStage = GHtmlStage;

} ())
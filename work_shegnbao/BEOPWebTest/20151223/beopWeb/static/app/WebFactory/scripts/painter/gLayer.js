/** 
 * 图层基类
 */

(function () {

    function GLayer(painter, model) {
        this.painter = painter;
        this.store = {};
        this.store.model = model;

        this.shape = null;
        this.children = [];

        this.init();
    }

    GLayer.prototype.init = function () {
        this.bindModelOb();
    };
    
    GLayer.prototype.bindModelOb = function () {
        this.store.model.addEventListener('update', this.update, this);
    };

    GLayer.prototype.update = function (e) {
        var isHide = this.store.model.isHide();

        if(isHide === 1) {
            this.hideLayer();
        } else {
            this.showLayer();
        }
        this.painter.setActiveWidgets();
        this.draw();
    };

    GLayer.prototype.add = function (e) {  };

    GLayer.prototype.show = function () {
    };

    GLayer.prototype.showLayer = function () {

    };

    GLayer.prototype.hideLayer = function () {

    };

    GLayer.prototype.getPainter = function () {
        return this.painter;
    };

    GLayer.prototype.find = function (selector) {
        var type = selector[0];
        var rs;

        selector = selector.substr(1);
        rs = this.children.filter(function (row) {
            switch(type) {
                case '#':
                    if(row.store.model._id() === selector) {
                        return true;
                    }
                    break;
                case '.':
                    if( row.shape.hasName(selector) ) {
                        return true;
                    }
                    break;
            }
            return false;
        });

        return rs;
    };

    GLayer.prototype.draw = function () {
        this.shape.getLayer().draw();
    };

    GLayer.prototype.close = function () { };

    window.layers = window.layers || {};
    window.layers.GLayer = GLayer;
} ())
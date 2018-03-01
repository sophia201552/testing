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

    GLayer.prototype.add = function (e) {};

    GLayer.prototype.show = function () {};

    GLayer.prototype.showLayer = function () {};

    GLayer.prototype.hideLayer = function () {};

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

    GLayer.prototype.removeChild = function (id) {
        var children = this.children;
        var removed = [];
        var idx, list;

        for (var i = 0, len = children.length; i < len; i++) {
            if( children[i].id() === id ) {
                removed = children.splice(i, 1);
                // 删除 model.list 字段中对该 id 的引用
                if ( (idx = this.store.model.list().indexOf(id)) > -1 ) {
                    // 修改属性，不触发 update 事件
                    this.store.model.list().splice(idx, 1);
                }
                break;
            }
        }

        if(removed.length === 0) return false;
        return true;
    };

    GLayer.prototype.close = function () {
        // 将 layer 中包含的 widget 全部销毁
        this.children.forEach(function (row) {
            row.close();
        });

        // 将父容器的 list 字段中的 id 引用清空
        this.stage.removeChild(this.store.model._id());
    };

    window.layers = window.layers || {};
    window.layers.GLayer = GLayer;
} ());
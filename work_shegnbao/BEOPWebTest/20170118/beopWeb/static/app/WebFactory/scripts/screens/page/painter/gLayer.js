/** 
 * 图层基类
 */

(function (exports) {

    function GLayer(painter, parent, model) {
        this.painter = painter;
        this.store = {};
        this.store.model = model;

        this.parent = parent;
        this.shape = null;
        this.children = [];

        this.init();
    }

    GLayer.prototype.init = function () {
        this._format();
        if (this.parent) {
            this.parent.children.push(this);
        }
        this.bindModelOb();
    };

    /**
     * 兼容老数据
     */
    GLayer.prototype._format = function () {
        // 为了处理图层合并而做的，对老数据的兼容
        this.store.model.property('type', 'layer');
    };

    GLayer.prototype.show = function () {
        if (this.store.model.isHide() === 1) {
            this.update(null, 'update.isHide');
        }
    };

    GLayer.prototype.bindModelOb = function () {
        this.store.model.addEventListener('update', this.update, this);
    };

    GLayer.prototype.update = function (e, propName) {
        var model = this.store.model;

        if (propName && propName.indexOf('isHide') > -1) {
            if (model.isHide() === 1) {
                this.hideLayer();
            } else {
                this.showLayer();
            }
        }

        if (propName && propName.indexOf('list') > -1) {
            // 更新 this.children
            this.children = this.painter.findByIds(model.list());

            this.painter.updateLayerOrder();
        }

        if (propName && propName.indexOf('parentId') > -1) {
            // 更新 this.parent
            var parent = this.painter.findByIds([model.parentId()]);
            if(parent.length>0){
                this.parent = parent[0];
            }
        }
    };

    GLayer.prototype.add = function () {};

    GLayer.prototype.isVisible = function () {
        var isParentVisible = this.parent ? this.parent.isVisible() : true;

        return isParentVisible && this.store.model.isHide() === 0;
    };

    GLayer.prototype.displayLayer = function (isRoot) {
        var _this= this;
        this.getChildren().forEach(function (row) {
            // 若是图层的话，则继续递归
            if (row.getType() === 'Layer') {
                row.displayLayer();
            }
            // 若是控件的话，则做实事
            else {
                var action = !this.isVisible() || row.store.model.isHide() === 1 ? 'detach' : 'attach';
                row[action]();
            }
        }, this);

        if (isRoot) {
            this.draw();
        }
    };

    GLayer.prototype.showLayer = function () {
        this.getChildren(true).forEach(function (row) {
            // 若是图层的话，则继续递归
            if (row.getType() === 'Layer') {
                row.store.model.isHide(0);
            }
            // 若是控件的话，则做实事
            else {
                row.attach();
            }
        });

        this.draw();
    };

    GLayer.prototype.hideLayer = function () {
        this.getChildren(true).forEach(function (row) {
            // 若是图层的话，则继续递归
            if (row.getType() === 'Layer') {
                row.store.model.isHide(1);
            }
            // 若是控件的话，则做实事
            else {
                row.detach();
            }
        });

        // TODO: 从 activeWidgets 中剔除隐藏控件

        this.draw();
    };

    GLayer.prototype.getPainter = function () {
        return this.painter;
    };

    GLayer.prototype.getShape = function () {
        return this.shape;
    };

    GLayer.prototype.getChildren = function (deep) {
        var rs;
        if (!deep) {
            return this.children;
        }

        // 深度搜索
        rs = [];
        this.children.forEach(function (row) {
            rs.push(row);
            if (row.getType() === 'Layer') {
                rs = rs.concat(row.getChildren(deep));
            }
        });

        return rs;
    };

    GLayer.prototype.getWidgets = function (deep) {
        var children = this.getChildren(deep);

        return children.filter(function (row) {
            return row.getType() !== 'Layer';
        });
    };

    GLayer.prototype.getLayers = function (deep) {
        var children = this.getChildren(deep);

        return children.filter(function (row) {
            return row.getType() === 'Layer';
        });
    };

    GLayer.prototype.findByCondition = function (cond) {
        var ids, type;
        var argsType = typeof cond;

        if (argsType === 'function') {
            return this.getChildren(true).filter(cond);
        } else {
            cond = cond || {};
            ids = cond['ids'];
            type = cond['type'];

            return this.getChildren(true).filter(function (row) {
                var model = row.store.model;
                var flag = true;

                if (type) {
                    if (type === 'Layer') {
                        flag = row.getType() === 'Layer';
                    } else {
                        falg = row.getType() !== 'Layer';
                    }
                }
                if (flag && ids) {
                    flag = ids.indexOf( row.store.model._id() ) > -1;
                }
                return flag;
            });
        }
    };

    GLayer.prototype.find = function (selector) {
        var type = selector[0];
        var rs;

        selector = selector.substr(1);
        rs = this.getChildren(true).filter(function (row) {
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
                case '*':
                    return true;
            }
            return false;
        });

        return rs;
    };

    GLayer.prototype.hasName = function (name) {
        return this.store.model.name().indexOf(name) > -1;
    };

    GLayer.prototype.getType = function () {
        return 'Layer';
    };

    GLayer.prototype.draw = function () {
        this.painter.getCanvasLayer().draw();
    };

    GLayer.prototype.setZIndex = function (zIndex) {
        // do nothing
    };

    GLayer.prototype.removeChild = function (id) {
        var children = this.children;
        var removed = [];
        var idx, list;

        for (var i = 0, len = children.length; i < len; i++) {
            if( children[i].id() === id ) {
                removed = children.splice(i, 1);
                break;
            }
        }

        if(removed.length === 0) return false;
        return true;
    };

    GLayer.prototype.destroy = function () {
        var children = this.parent.children;
        var removed = [];
        var id = this.store.model._id();

        for (var i = 0, len = children.length; i < len; i++) {
            if( children[i].id && children[i].id() === id ) {
                removed = children.splice(i, 1);
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

        if (this.parent) {
            this.destroy();
        }
    };

    exports.GLayer = GLayer;
} (
    namespace('layers')
));
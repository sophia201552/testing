/** 
 * factory 控件基类
 */

(function (exports) {

    function Widget(parent, layer, model) {
        this.parent = parent;
        this.layer = layer;
        this.painter = this.getPainter();
        this.page = this.getPage();

        this.store = {};
        this.store.model = model;
        this.store.imageModelSet = this.layer.painter.screen.store.imageModelSet;

        this.shape = null;

        this.init();
    }

    Widget.prototype.init = function () {
        this.parent.children.push(this);
        this.bindModelOb();
    };
    
    Widget.prototype.bindModelOb = function () {
        this.store.model.addEventListener('update', this.update, this);
    };

    Widget.prototype.unbindModelOb = function () {
        this.store.model.removeEventListener('update', this.update);
    };

    Widget.prototype.update = function () {};

    Widget.prototype.attach = function () {};
    
    Widget.prototype.detach = function () {};

    Widget.prototype.show = function () {};

    Widget.prototype.getShape = function () {
        return this.shape;
    };

    Widget.prototype.getPage = function () {
        return this.getPainter().getPage();
    };

    Widget.prototype.getPainter = function () {
        return this.layer.painter;
    };

    Widget.prototype.getParent = function () {
        return this.parent;
    };

    Widget.prototype.setParent = function (id) {
        if (id === '') {
            this.parent = this.painter.getRootLayer();
        } else {
            var parent = this.painter.find('#' + id);
            if (parent&&parent.length>0) {
                this.parent = parent[0];
            }
        } 
    };
    Widget.prototype.getTplParams = function(){};
    Widget.prototype.applyTplParams = function(){};

    Widget.prototype.close = function () {
        var groupId;

        // 如果是存在于某个控件组内的，则需要将其从这个控件组内删除掉
        if (typeof this.store.model.groupId === 'function') {
            groupId = this.store.model.groupId();
            if (groupId) {
                group = this.layer.painter.find('#'+groupId)[0];
                if (group) {
                    group.remove(this.store.model);
                }
            }
        }

        this.destroy();
    };
    Widget.prototype.refresh = function () {
        this._refresh && this._refresh();
        this.children && this.children.forEach(function(child){
            child._refresh && child._refresh();
        });
    };
    Widget.prototype._refresh = function () {
        //重写
    };

    exports.Widget = Widget;
} (
    namespace('widgets.factory')
));
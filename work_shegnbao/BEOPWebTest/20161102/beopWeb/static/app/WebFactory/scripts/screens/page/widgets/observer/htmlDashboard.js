// dashboard 控件适配基类
;(function (exports, SuperClass) {

    function HtmlDashboard(layer, model) {
        SuperClass.apply(this, arguments);
    }

    HtmlDashboard.prototype = Object.create(SuperClass.prototype);
    HtmlDashboard.prototype.constructor = HtmlDashboard;

    HtmlDashboard.prototype.update = function (e, propName) {
        var model = this.store.model;
        var scale;
        var dataMap;

        SuperClass.prototype.update.apply(this, arguments);

        if (!propName || propName.indexOf('update.option.display') > -1) {
            if (model['option.display']() === 1) {
                scale = this.painter.getScale();
                this.shape.style.left = model.x() * scale.x + 'px';
                this.shape.style.top = model.y() * scale.y + 'px';
                this.shape.style.width = model.w() * scale.x + 'px';
                this.shape.style.height = model.h() * scale.y + 'px';
            }
        }

        // 更新时候的图片变化
        if ( propName && propName.indexOf('update.option.text') > -1 ) {
            dataMap = model['option.text.value']();
            this.ins.update(Object.keys(dataMap).map(function(dsId) {
                return {
                    dsItemId: dsId,
                    data: dataMap[dsId]
                };
            }));
        }
    };

    exports.HtmlDashboard = HtmlDashboard;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlDashboard')
));
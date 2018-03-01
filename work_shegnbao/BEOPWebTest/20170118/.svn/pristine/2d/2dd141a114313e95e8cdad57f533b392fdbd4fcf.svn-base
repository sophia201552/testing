(function (CanvasPipe) {

    ////////////////////////////
    /// CanvasPipeWithAnimation DEFINITION //
    ////////////////////////////
    function CanvasPipeWithAnimation(layer, model) {
        CanvasPipe.apply(this, arguments);
    }

    CanvasPipeWithAnimation.prototype = Object.create(CanvasPipe.prototype);
    CanvasPipeWithAnimation.prototype.constructor = CanvasPipeWithAnimation;

    /** override */
    CanvasPipeWithAnimation.prototype.update = function () {
        var model = this.store.model;
        var options = model.option();
        var isActive = 0;     
        if (options.text && options.text.value) {
            for (var k in options.text.value) {
                if (parseInt(options.text.value[k]) === 1) {
                    isActive = 1;
                }
            }
            
        }
        // 根据 isActive,判断是否需要动画
        // 0: 无动画,1: 有动画
        this.shape.paint(isActive === 1);

        this.layer.draw();
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasPipe = CanvasPipeWithAnimation;

} (window.widgets.factory.CanvasPipe));
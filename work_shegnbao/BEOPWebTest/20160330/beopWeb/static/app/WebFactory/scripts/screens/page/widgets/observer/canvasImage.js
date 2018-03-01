(function (fcCanvasImage) {

    function CanvasImage(layer, model) {
        fcCanvasImage.apply(this, arguments);
    }

    CanvasImage.prototype = Object.create(fcCanvasImage.prototype);
    CanvasImage.prototype.constructor = CanvasImage;

    CanvasImage.prototype.defaultColor = 'transparent';

    /** override */
    CanvasImage.prototype.startAnimation = function (imageModel) {
        this.shape.animations({
            main: imageModel.list()
        });
        this.shape.animation('main');
        this.shape.frameRate( Math.round(1000/imageModel.interval()) );
        this.shape.start();
    };

    /** override */
    CanvasImage.prototype.stopAnimation = function () {
        this.shape.stop();
    };

    //覆盖window.widgets.factory.CanvasImage
    window.widgets.factory.CanvasImage = CanvasImage;

} (window.widgets.factory.CanvasImage));
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'Konva'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('Konva'));
    } else {
        factory(
            root,
            namespace('Konva'),
            namespace('beop.strategy.components.Sketchpad.Graphics.GShape')
        );
    }
}(namespace('beop.strategy.components.Sketchpad.Graphics'), function (exports, Konva, GShape) {

    function GStrategyShape(config) {
        this.___init(config);
    };

    Konva.Util.addMethods(GStrategyShape, {
        ___init: function(config) {
            GShape.call(this, config);

            this.nodeType = 'GStrategyShape';
            this.__createShapes();
        },
        __createShapes: function () {
            this.__wrapEvents();
        },
        __wrapEvents: function () {
        }
    });
    Konva.Util.extend(GStrategyShape, GShape);

    exports.GStrategyShape = GStrategyShape;
}));
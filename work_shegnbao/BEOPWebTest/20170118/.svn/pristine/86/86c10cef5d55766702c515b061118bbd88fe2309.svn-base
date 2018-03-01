;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'Konva'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('Konva'));
    } else {
        factory(
            root,
            namespace('Konva')
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad.Graphics'), function(exports, Konva) {

    function GShape(config) {
        this.___init(config);
    };


    Konva.Util.addMethods(GShape, {
        ___init: function(config) {
            Konva.Group.prototype.___init.call(this, config);

            this.__createShapes();
        },
        __createShapes: function() {

            this.__wrapEvents();
        },
        __wrapEvents: function() {

        }
    });
    Konva.Util.extend(GShape, Konva.Group);

    exports.GShape = GShape;
}));
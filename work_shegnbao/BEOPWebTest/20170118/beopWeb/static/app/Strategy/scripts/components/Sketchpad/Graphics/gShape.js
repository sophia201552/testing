;(function (root, factory) {
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
}(namespace('beop.strategy.components.Sketchpad.Graphics'), function (exports, Konva) {

    function GShape(config) {
        this.___init(config);
    };

    Konva.Util.addMethods(GShape, {
        ___init: function(config) {
            Konva.Group.call(this, config);
            this.nodeType = 'GShape';

            this.__createShapes();
        },
        __createShapes: function () {
            var attrs = this.attrs;
            this.add(new Konva.Rect({
                x: 100,
                y: 100,
                width: 100,
                height: 100
            }));

            this.__wrapEvents();
        },
        __wrapEvents: function () {
            var _this = this;
            var children = this.getChildren();

            children[0].on('click', function (e) {
                _this._fire('close');
            });
        }
    });
    Konva.Util.extend(GShape, Konva.Group);

    exports.GShape = GShape;
}));
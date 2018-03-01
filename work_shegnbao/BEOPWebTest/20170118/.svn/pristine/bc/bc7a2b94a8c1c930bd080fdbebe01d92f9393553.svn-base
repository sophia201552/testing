;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad'), function(exports) {

    function State() {
        this.model = null;
        this.view = null;

        this.init();
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = State;

        this.init = function(view) {
            this.view = view;
        };

        this.bindModel = function(model) {
            this.model = model;
            return this;
        };

        this.ready = function() {
            return this.model.update == null;
        };

        this.add = function() {
            return (this.model.update != null) && (this.model.update['destroyId'] == undefined) && (this.model.update['add'] != undefined);
        };

        this.update = function() {
            return (this.model.update != null) && (this.model.update['destroyId'] == undefined) && (this.model.update['add'] == undefined) && (Object.keys(this.model.update).length > 0);
        };

        this.destroy = function() {
            return (this.model.update != null) && (this.model.update['destroyId'] != undefined);
        }

        this.nap = function() {
            return function() {
                return undefined;
            }
        };

        // 渲染页面
        this.render = function(model) {
            this.representation(model);
        };

        this.representation = function(model) {
            var representation = 'something was wrong!';
            if (this.ready()) {
                this.view.ready(model);
            }
            if (this.destroy()) {
                this.view.destroy(model);
            }
            if (this.update()) {
                this.view.update(model);
            }
            if (this.add()) {
                this.view.add(model);
            }
        };

    }.call(State.prototype);

    exports.State = State;
}));
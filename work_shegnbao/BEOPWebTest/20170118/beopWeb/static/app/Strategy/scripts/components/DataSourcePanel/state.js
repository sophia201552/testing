;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.DataSourcePanel'), function (exports) {

    function State() {
        this.model = null;
        this.view = null;

        this.init();
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = State;

        this.init = function (view) {
            this.view = view;
        };

        this.bindModel = function (model) {
            this.model = model;
            return this;
        };

        this.ready = function () {
            return true;
        };

        this.nap = function () {};

        // 渲染页面
        this.render = function (model) {
            this.representation(model);
        };

        this.representation = function (model) {
            var representation = 'something was wrong!';
            if (this.ready()) {
                representation = '<div id="dataSrcContain" class="gray-scrollbar white-skin" style="height: 100%;"></div>';
            }
            this.view.display(representation) ;
        };

    }.call(State.prototype);

    exports.State = State;
}));
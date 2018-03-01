;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.core'), function(exports) {

    var nop = function() { return function() { return undefined; }; };

    function Model(container, state, initialStore, nap) {
        this.nap = nap || nop;
        this.container = container;
        this.store = initialStore;
        this.state = state.bindModel(this.store);

        this.listeners = [];
    }

    // PROTOTYPES
    +function() {
        /**
         * Constructor
         */
        this.constructor = Model;

        this.getState = function() {
            return this.state;
        };

        this.getStore = function() {
            return this.store;
        };

        this.updateState = function(store) {
            var state = this.state = this.state.bindModel(store);

            this.listeners.forEach(function(listener) {
                listener(state);
            });

            this.nap(state)(this.present);
        };

        this.present = function(dataset) {
            var rs;
            dataset = dataset || {};
            rs = this.container(this.store, dataset);
            if (rs) {
                this.store = rs;
                this.updateState(rs);
            } else {
                // do nothing
                return;
            }
        };

        this.subscribe = function(listener) {
            this.listeners.push(listener);

            return function unsubscribe() {
                var index = this.listeners.indexOf(listener);
                this.listeners.splice(index, 1);
            }.bind(this);
        };

        this.replaceContainer = function(container) {
            this.container = container;
            this.updateState();
        };

        this.replaceStore = function(store) {
            this.store = store;
            this.updateState();
        };

        this.replaceNap = function(nap) {
            this.nap = nap;
            this.updateState();
        };

    }.call(Model.prototype);

    exports.Model = Model;
}));
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.core'), function (exports) {
    var nop = function () { return undefined };

    var deepCopy = $.extend.bind($, true, {});

    exports.createModel = function (container, state, initialStore, nap, enhancer) {
        var listeners, store, currentState, currentContainer, currentNap;

        if (typeof enhancer !== 'undefined') {
            return enhancer(createModel)(container, state, nap, initialStore)
        }
        nap = nap || nop;
        listeners = [];
        store = initialStore;
        currentState = state(store);
        currentContainer = container;
        currentNap = nap;

        function updateState() {
            currentState = state(store);
            Log.info('New state:', currentState);

            listeners.forEach(function(listener) {
                listener(currentState);
            });

            currentNap(currentState)(present);
        }

        function getState() {
            return currentState;
        }

        function subscribe(listener) {
            listeners.push(listener);

            return function unsubscribe() {
                var index = listeners.indexOf(listener);
                listeners.splice(index, 1);
            }
        }

        function present(dataset = {}) {
            Log.info('Present:', dataset)
            store = currentContainer(deepCopy(store), dataset);
            Log.info('Store after BLC: ', store);
            updateState()
        }

        function replaceStore(nextStore) {
            Log.info('replaceStore', nextStore)
            store = deepCopy(nextStore);
            updateState();
        }

        function replaceContainer(nextContainer) {
            Log.info('replaceContainer')
            currentContainer = nextContainer;
            updateState();
        }

        function replaceNap(nextNap) {
            Log.log('replaceNap');
            currentNap = nextNap;
            updateState();
        }

        return {
            present,
            subscribe,
            getState,
            replaceStore,
            replaceContainer,
            replaceNap,
        }

    };

}));

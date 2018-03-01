var baseWfView = (function () {

    function inherits(clazz, base) {
        var clazzPrototype = clazz.prototype, prop;

        function F() {
        }

        F.prototype = base.prototype;
        clazz.prototype = new F();
        for (prop in clazzPrototype) {
            if (clazzPrototype.hasOwnProperty(prop)) {
                clazz.prototype[prop] = clazzPrototype[prop];
            }
        }
        clazz.constructor = clazz;
    }

    baseWfView = function (opts) {
        this.opts = opts;
    };

    baseWfView.prototype = {
        init: function () {

        }


    };

    baseWfView.extends = function (opts) {
        return inherits(baseWfView, opts)
    };


    return baseWfView;
})();

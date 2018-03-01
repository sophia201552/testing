(function (exports) {

    function Model(values) {
        this._values = values || {};
    }

    Model.prototype = Object.create(Events);

    void function () {
        this.constructor = Model;

        this.property = function (name, value) {
            // 若没有这个属性，则创建
            if(!(name in this)) {
                this[name] = Model.makeProperty(name);
            }
            return arguments.length === 1 ? this[name]() : this[name](value);
        };

        this.emit = function (event) {
            Events.emit.apply(this, arguments);
        };

        // 等所有的属性都赋值完毕，再触发 update 事件
        this.delayUpdate = function (fn) {
            var pending = false;

            try {
                this.emit = function (event) {
                    if (event === 'update') {
                        pending = true;
                    } else {
                        this.__proto__.emit.apply(this, arguments);
                    }
                };
                fn.call(this);
            } finally {
                delete this.emit;
                if(pending) {
                    this.emit('update');
                }
            }
        };

        this.update = function (props) {
            var _this = this;
            
            this.delayUpdate(function () {
                for (var prop in props) {
                    if(!(prop in this)) {
                        throw new Error('没有找到这个属性：'+prop);
                    }
                    _this[prop](props[prop]);
                }
            });
        };

        this.serialize = function () {
            return this._values;
        };

    }.call(Model.prototype);

    // statics
    Model.makeProperty = function (prop) {
        var body = 'var ov = this._values.{p};if(arguments.length && v !== ov) {this._values.{p}=v; this.emit("update.{p}"); this.emit("update"); } return ov;'
        return new Function('v', body.replace(/\{p\}/g, prop) );
    };

    exports.Model = Model;
    
} (window));
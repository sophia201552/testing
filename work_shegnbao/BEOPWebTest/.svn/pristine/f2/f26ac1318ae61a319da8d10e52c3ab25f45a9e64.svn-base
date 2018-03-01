/*
    core.js
 */
(function (exports) {

    var Events = {
        /**
         * 添加事件订阅
         * @param {string}   events  需要订阅的事件，多个事件之间用' '隔开
         * @param {Function} fn      事件处理函数
         * @param {object}   context fn执行时的上下文环境
         */
        addEventListener: function (events, fn, context) {
            var _this = this;
            var e = this.__info || (this.__info = {});

            events = events.split(' ');
            events.forEach(function (event) {
                var evt;
                event = 'event:' + event;
                evt = e[event] || (e[event] = []);
                // (fn, context) 为一组
                evt.push(fn, context);
            });
        },
        /**
         * addEventListener 方法的别名
         */
        on: function (events, fn, context) {
            return this.addEventListener(events, fn, context);
        },
        /**
         * 添加一个一次性的事件订阅
         */
        once: function (event, fn, context) {
            var _this = this;
            this.addEventListener(event, function ofn() {
                _this.removeEventListener(event, ofn);
                fn.apply(context, arguments);
            }, context);
        },
        /**
         * 删除事件订阅
         */
        removeEventListener: function (events, fn) {
            var e = this.__info;
            var rs = null;

            if(e) {
                events = events.split(' ');
                events.forEach(function (event) {
                    var i;
                    event = e['event:'+event];
                    if(event) {
                        i = event.indexOf(fn);
                        if(i > -1) {
                            rs = event.splice(i, 2)[0] || null;
                        }
                    }
                });
            }

            return rs;
        },
        /**
         * 删除某个事件的所有处理方法
         */
        removeAllListeners: function (event) {
            var e = this.__info;
            if(e) {
                delete e['event:' + event];
            }
        },
        /** 
         * 获取某个事件的所有处理方法
         */
        listeners: function (event) {
            var e = this.__info;
            if(e) {
                return e['event:' + event] || [];
            }
            return [];
        },
        /**
         * 发布某个事件
         * @param  {string} event 需要发布的事件名称
         */
        emit: function (event /*, arguments ... */) {
            var e = this.__info;
            if(e) {
                e = e['event:'+event];
                if(e && e.length) {
                    for(var i = 0, len = e.length; i < len; i += 2) {
                        try {
                            e[i].apply(e[i+1], arguments);
                        } catch(_) {
                            Log.exception('emit', _);
                        }
                    }
                    return true;
                }
            }
            return false;
        }
    };

    exports.Events = Events;

} (window));

/** 数据模型 - 单个对象 */
(function (exports) {

    function Model(values) {
        this._values = values || {};

        this.initialize(this._values);
    }

    Model.prototype = Object.create(Events);

    void function () {
        this.constructor = Model;

        this.initialize = function (o) {
            for (var p in o) {
                if (o.hasOwnProperty(p)) {
                    this.property(p);
                }
            }
        };

        this.property = function (name, value) {
            // 若没有这个属性，则创建
            if (!(name in this)) {
                this[name] = this._makeProperty(name);
            }
            return arguments.length === 1 ? this[name]() : this[name](value);
        };

        this.removeProperty = function (name) {
            var arr, obj, p, lp;

            if (!(name in this)) {
                return false;
            }
            delete this[name];

            // 删除对应的值
            arr = name.split('.');
            lp = arr.pop();
            obj = this._values;
            while(p = arr.shift()) obj = obj[p];
            delete obj[lp];

            // 如果父对象被删除了，子对象应该相应的被删除
            for (var p in this) {
                if (!this.hasOwnProperty(p) || p.indexOf(name) !== 0) continue;
                delete this[p];
            }

            return true;
        };

        this.emit = function (event) {
            Events.emit.apply(this, arguments);
        };

        // 等所有的属性都赋值完毕，再触发 update 事件
        this.delayUpdate = function (fn) {
            var pending = false;
            var propsPathArr = [];

            try {
                this.emit = function (event) {
                    if (event === 'update') {
                        pending = true;
                    } else {
                        this.__proto__.emit.apply(this, arguments);
                    }
                };
                propsPathArr = fn.call(this);
            } finally {
                delete this.emit;
                if(pending) {
                    this.emit('update', propsPathArr.join(','));
                }
            }
        };

        this.update = function (props) {
            var _this = this;
            
            this.delayUpdate(function () {
                var propsPathArr = [];
                for (var prop in props) {
                    if(!(prop in this)) {
                        throw new Error('没有找到这个属性：'+prop);
                    }
                    _this[prop](props[prop]);
                    propsPathArr.push('update.'+prop);
                }
                return propsPathArr;
            });
        };

        this.serialize = function () {
            return this._values;
        };

        this._makeProperty = function (prop) {
            var body = 'var ov = this._values.{p};if(arguments.length && (v !== ov || Object.prototype.toString.call(v) === "[object Object]") ) {this._values.{p}=v; this.emit("update.{p}"); this.emit("update", \'update.{p}\'); } return ov;'
            return new Function('v', body.replace(/\{p\}/g, prop) );
        };

    }.call(Model.prototype);

    exports.Model = Model;
    
} (window));

(function (exports, Model) {
    var class2type = {};
    ['Boolean', 'Number', 'String', 'Array', 'Function', 'Object', 'Date', 'RegExp', 'Error'].forEach(function (type) {
        class2type['[object ' + type + ']'] = type.toLowerCase();
    });

    function getType(o) {
        // 处理 null 和 undefined
        if(o == null) {
            return o + '';
        }

        var type = Object.prototype.toString.call(o);
        return class2type[type] || 'object';
    }

    function NestedModel() {
        Model.apply(this, arguments);
    }

    NestedModel.prototype = Object.create(Model.prototype);

    void function () {
        this.constructor = NestedModel;

        this.initialize = function (o, path, k) {
            var keys, currentPath;
            
            path = path || [];
            // 复制一份
            currentPath = path.slice(0);

            if (typeof k !== 'undefined') {
                currentPath.push(k);
            }

            if (currentPath.length > 0) {
                this.property(currentPath.join('.'));
            }

            // 如果是 object，则进入下次循环
            if (getType(o) === 'object') {
                keys = Object.keys(o);
                keys.forEach(function (p) {
                    this.initialize(o[p], currentPath, p);
                }, this);
            }
        };

        this._makeProperty = function (prop) {
            var body = 'var o = this._values, isObj = Object.prototype.toString.call(v) === \'[object Object]\', arr = \'{p}\'.split(\'.\'), n = arr.splice(arr.length-1, 1)[0], path = arr.length ? arr.slice(0) : [], row, ov; while(row = arr.shift()) { o = o[row]; }; ov = o[n]; if(arguments.length && (v !== ov || isObj )) {o[n]=v; if(isObj){this.initialize(v,path,n)};this.emit("update.{p}"); this.emit("update", \'update.{p}\'); } return ov;';
            return new Function('v', body.replace(/\{p\}/g, prop) );
        };
    }.call(NestedModel.prototype);

    exports.NestedModel = NestedModel;
}(window, window.Model));

/** 数据模型 - 对象列表 */
(function (exports) {

    function ModelSet(models) {
        this.models = models || [];
    }

    ModelSet.prototype = Object.create(Model.prototype);

    void function () {
        this.constructor = ModelSet;

        this.length = function () {
            return this.models.length;
        };

        this.get = function (index) {
            return this.models[index];
        };

        this.forEach = function (fn, ctx) {
            return this.models.forEach(fn, ctx);
        };

        this.indexOf = function (model) {
            return this.models.indexOf(model);
        };

        this.findByProperty = function (name, value) {
            var models = this.models;
            for (var i = 0, len = models.length; i < len; i++) {
                if( models[i][name]() === value ) {
                    return models[i];
                }
            }
            return null;
        };

        this.findListByProperty = function (name, value) {
            var models = this.models;
            var rs;

            rs = models.filter(function (row) {
                if(row[name]() === value) {
                    return true;
                }
                return false;
            });

            return rs;
        };

        this.insertAt = function (idx, model) {
            var count;
            // 小于0，则从后向前计算
            if(idx < 0) {
                idx += this.models.length + 1;
            }
            if(Array.isArray(model)) {
                this.models.splice.apply( this.models, [idx, 0].concat(model) );
                count = model.length;
            } else {
                this.models.splice(idx, 0, model);
                count = 1;
                model = [model];
            }
             this.emit('insert', {
                index: idx,
                count: count,
                models: model
            });
            return count;
        };

        this.emit = function (evt) {
            Model.prototype.emit.apply(this, arguments);
        };

        /** 列表前插 */
        this.prepend = function (model) {
            return this.insertAt(0, model);
        };

        /** 列表追加 */
        this.append = function (model) {
            return this.insertAt(-1, model);
        };

        this.remove = function (model) {
            var fidx = -1;
            var count = 0;
            var total = 0;
            var removed = [];

            if(Array.isArray(model)) {
                model.forEach(function (m) {
                    var idx = this.indexOf(m);

                    if(idx === -1) return;

                    total ++;
                    if(fidx === -1) {
                        fidx = idx;
                        count ++;
                    } else if(idx === fidx + count) {
                        count ++;
                    } else {
                        removed = removed.concat(this.models.splice(fidx, count));
                        fidx = idx < fidx ? idx : idx - count;
                        count = 1;
                    }
                }, this);
                if(count) {
                    removed = removed.concat(this.models.splice(fidx, count));
                    this.emit('remove', {
                        count: count,
                        models: removed
                    });
                }
            } else {
                var idx = this.indexOf(model);
                if(idx !== -1) {
                    this.models.splice(idx, 1);
                    this.emit('remove', {
                        count: 1,
                        models: [model]
                    });
                    total = 1;
                }
            }
            return total;
        };


        /** 删除所有元素 */
        this.removeAll = function () {
            var len = this.models.length;
            var removed;
            if(len) {
                removed = this.models.splice(0, len);
                this.emit('remove', {
                    count: len,
                    models: removed
                });
                return true;
            } else {
                return false;
            }
        };

        /** 将数组中的某个元素从下标 'from' 位置移动到下标 'to' 位置 */
        this.move = function (from, to) {
            var len = this.models.length;
            var moved = null;
            // 对负数的兼容
            while (from < 0) {
                from += len;
            }
            while (to < 0) {
                from += len;
            }

            // 如果 to 大于数组的长度，这里我们用 undefined 来填充空缺的部分
            if (to >= len) {
                while ( (len++) <= to ) {
                    this.models.push(undefined);
                }
            }

            // 开始元素移动逻辑
            moved = this.models.splice(from, 1);
            this.models.splice(to, 0, moved[0]);

            this.emit('move', {
                from: from,
                to: to,
                // 数组
                models: moved
            });

            return true;
        };

        this.serialize = function () {
            var ms = [];
            this.forEach(function (row) {
                ms.push( row.serialize() );
            });
            return ms;
        };

        /**
         * 针对于对象数组，根据数组中每个对象中的 key 属性，生成一个 Map
         * @param  {string} key 指定的对象数组中的 key 属性
         * @return {object} 最终生成的 Map
         */
        this.toMap = function (key) {
            var map = {};
            for (var i = 0, len = this.models.length; i < len; i++) {
                map[this.models[i][key]()] = this.models[i].serialize();
            }
            return map;
        };

    }.call(ModelSet.prototype);

    exports.ModelSet = ModelSet;
    
} (window));
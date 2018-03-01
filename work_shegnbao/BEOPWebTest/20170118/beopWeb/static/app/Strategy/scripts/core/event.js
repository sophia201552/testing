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
}(namespace('beop.strategy.core'), function (exports) {
    
    exports.Event = {
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
         * 删除事件的所有处理方法
         */
        removeAllListeners: function (events) {
            var _this = this;
            var e = this.__info;
            if(e) {
                events = events.split(' ');
                events.forEach(function (event) {
                    if (event.indexOf('.') === 0) {
                        _this.removeListenersByNs(event);
                    } else {
                        delete e['event:' + event];
                    }
                });
            }
        },

        /**
         * 删除指定命名空间的所有监听函数
         * 
         * @param {String} ns 命名空间字符串
         */
        removeListenersByNs: function (ns) {
            var e = this.__info;
            
            if (e) {
                Object.keys(e).forEach(function (name) {
                    if (name.indexOf(ns) > -1) {
                        delete e['event:' + name];
                    }
                });
            }
        },
        /**
         * removeEventListener/removeAllListeners 方法的别名
         */
        off: function (events, fn) {
            if (typeof fn !== 'undefined') {
                return this.removeEventListener(events, fn);
            } else {
                return this.removeAllListeners(events);
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
            var h = [];

            if(e) {
                event = 'event:'+event;
                Object.keys(e).forEach(function (name) {
                    if (name === event || name.indexOf(event + '.') === 0) {
                        if (e[name] && e[name].length) {
                            h = h.concat(e[name]);
                        }
                    }
                });
                if(h && h.length) {
                    for(var i = 0, len = h.length; i < len; i += 2) {
                        try {
                            h[i].apply(h[i+1], arguments);
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
}));
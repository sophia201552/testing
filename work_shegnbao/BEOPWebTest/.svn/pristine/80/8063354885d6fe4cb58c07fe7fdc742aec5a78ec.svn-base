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
        removeEventListener: function (event, fn) {
            var e = this.__info;
            var i;

            if(e) {
                event = e['event:'+event];
                if(event) {
                    i = event.indexOf(fn);
                    if(i > -1) {
                        return e.splice(i, 2)[0] || null;
                    }
                }
            }
            return null;
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
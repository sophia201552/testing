(function () {
    var ENUM_LEVEL = {
        LOG: 1,
        INFO: 2,
        DEBUG: 3,
        WARN: 4,
        ERROR: 5,
        EXCEPTION: 6
    };

    window.Log = {
        level: ENUM_LEVEL.LOG,
        log: function () {
            if(this.level > ENUM_LEVEL.LOG) return;
            Log._out('log', arguments);
        },
        info: function () {
            if(this.level > ENUM_LEVEL.INFO) return;
            Log._out('info', arguments);
        },
        debug: function () {
            if(this.level > ENUM_LEVEL.DEBUG) return;
            Log._out('debug', arguments);
        },
        warn: function () {
            if(this.level > ENUM_LEVEL.WARN) return;
            Log._out('warn', arguments);
        },
        error: function () {
            if(this.level > ENUM_LEVEL.ERROR) return;
            Log._out('error', arguments);
        },
        exception: function (message, exception) {
            if(this.level > ENUM_LEVEL.EXCEPTION) return;
            if(exception) {
                Log.error('Exception: ', message, exception.stack || exception);
            } else {
                Log.error('Exception: ', message);
            }
        },
        _out: function (type, args) {
            console[type].apply(console, args)
        }
    };
}());
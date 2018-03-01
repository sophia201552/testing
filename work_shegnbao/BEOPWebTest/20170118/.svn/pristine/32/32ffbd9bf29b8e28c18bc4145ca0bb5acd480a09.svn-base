// js asynchronous loader
(function ($) {

    // a simple promise implements
    // e.g. when().then()
    var when = (function () {
        function when() {
            var _this = this;
            // code for usage "when()"
            if(!(this instanceof when)) return new when(arguments);
            this.pendings = Array.prototype.slice.call(arguments[0]); // turn "arguments" to "array"
            this.pendingsLen = this.pendings.length;
            this.results = {length: 0};

            // define pass() by using closure here, so that _this can be found in the user's anync fn.
            _this._pass = function () {
                arguments.length > 1 && (_this.results[arguments[0]] = arguments[1]);
                _this.results.length ++;
                _this.results.length === _this.pendingsLen && _this.then.call(_this, _this.results);
            };

        };
        when.prototype.then = function () {
            var pending = null;
            // ensure "then" called only once in each when-then call
            this.then = arguments[0];
            while(this.pendings[0]) {
                pending = this.pendings.shift();
                (function (pass) {
                    require(pending, function () {
                        pass();
                    });
                }).call(this, this._pass);
            }
        };

        return when;
    } ());

    var util = {
        loadJS: function (url, cb) {
            var script = document.createElement('script'),
                done = false;
            script.type = 'text/javascript';
            script.language = 'javascript';
            script.src = url;
            script.onload = script.onreadystatechange = function() {
                if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
                    done = true;
                    script.onload = script.onreadystatechange = null;

                    typeof cb === 'function' && cb.call(script);
                }
            }
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        excJS: function (url, cb) {
            // use jquery :P
            return $.getScript(url, cb);
        },
        merge: function (obj1, obj2) {
            var toString = Object.prototype.toString;
            for (var i in obj2) {
                if (obj2.hasOwnProperty(i)) {
                    switch(toString.call(obj2[i])) {
                        case '[object array]':
                            obj1[i] = obj2[i].concat();
                            break;
                        case '[object object]':
                            // skip at this time
                            break;
                        default:
                            obj1[i] = obj2[i];
                            break;
                    }
                }
            }
        }
    };

    function AsynLoader(options) {
        this.options = options;
        this.queue = {};
        this.packages = {};

        this.suppLogs = ['info', 'warn', 'error'];
    }

    AsynLoader.prototype.log = function (level, msg) {
        if(this.options.log === false) return;
        var pos = this.suppLogs.indexOf(level);
        var opPos = this.suppLogs.indexOf(this.options.log || 'error');

        pos !== -1 && pos >= opPos && console[level](msg);
    };

    // get config object of the specific package
    AsynLoader.prototype.getPackageConfig = function (name) {
        var packages = this.options.packages;
        var baseUrl = this.options.baseUrl;
        var dep = null;
        var list = [];
        for (var i = 0, len = packages.length; i < len; i++) {
            if(packages[i].name === name) {
                dep = packages[i]['dependencies'] || [];
                for (var t = 0, len = dep.length; t < len; t++) {
                    list = list.concat(this.getPackageConfig(dep[t]));
                }
                list = list.concat(packages[i].include);
                break;
            }
        }
        return list;
    }

    // get the true path that according to baseUrl
    AsynLoader.prototype.getTruePath = function (path) {
        var baseUrl = this.options.baseUrl.replace(/^\s+|\s+$/g, '');
        if(!baseUrl) return path;
        if(!path.match(/\.js$/i)) path += '.js';
        return baseUrl + path;
    };

    // load a js module by specific name
    // when it loaded, call callback(the second argument) function if exists
    AsynLoader.prototype.loadModule = function (name, mode, cb) {
        var _this = this;
        var match = null;

        if(typeof mode === 'function') {
            cb = mode;
            mode = null;
        }
        mode = mode || this.options.mode || 'exc';

        if(this.queue[name] === 'loaded') {
            this.onModuleLoadSuccess(name);
            typeof cb === 'function' && cb();
            return false;   
        }
        this.onModuleLoadStart(name);

        return util[mode+'JS'](this.getTruePath(name), function () {
            _this.onModuleLoadSuccess(name);
            typeof cb === 'function' && cb();
        });
    };

    // load a package(a group of js modules) by specific name
    // when the package loaded, call callback(the second argument) function if exists
    AsynLoader.prototype.loadPackage = function (name, mode, cb) {
        var _this = this;
        var packages = null;
        var time = 0;
        var loadRecursive = null;
        var error = 0;
        var queue = this.queue;

        if(typeof mode === 'function') {
            cb = mode;
            mode = null;
        }
        mode = mode || this.options.mode || 'exc';

        if(this.packages[name] === 'loaded') {
            this.onPackageLoadSuccess(name);
            typeof cb === 'function' && cb();
            return false;   
        }
        this.onPackageLoadStart(name);

        packages = this.getPackageConfig(name);
        if(!packages) {
            this.log('error', 'package "'+name+'" config information not found!');
            return false;
        }

        loadRecursive = function () {
            var m;
            // if finished
            if(!packages.length) {
                typeof cb === 'function' && cb(name);
                if(error === 0) {
                    this.onPackageLoadSuccess(name);
                    return true;
                }
                for (var i in queue) {
                    if (queue.hasOwnProperty(i)) {
                        queue[i] === 'failed' && this.log('error', 'module "'+i+'" load failed!');   
                    }
                }
                this.onPackageLoadFail(name);
                return false;
            }
            m = packages[0];
            // begin to load
            if(!queue[m]) {
                this.loadModule(m, mode, function () {
                    packages.shift();
                    loadRecursive.call(_this);
                });
            } 
            // if the current module already loaded, skip it
            else if(queue[m] === 'loaded') {
                packages.shift();
                loadRecursive.call(_this);
            } else {
                if(time < this.options.timeout) {
                    time += 10;
                    window.setTimeout(function () {
                        loadRecursive.call(_this);
                    }, 10);
                } else {
                    // if timeout, let error++, then skip the error
                    error ++;
                    this.onModuleLoadFail(m);
                    packages.shift();
                    loadRecursive.call(this);
                }
            }
        };
        // load it!
        loadRecursive.call(this);
    };

    // load a js file
    AsynLoader.prototype.loadJS = function (url, mode, cb) {
        var _this = this;

        if(typeof mode === 'function') {
            cb = mode;
            mode = null;
        }
        mode = mode || this.options.mode || 'exc';

        return util[mode+'JS'](url, function () {
            typeof cb === 'function' && cb();
        });
    };

    AsynLoader.prototype.onModuleLoadStart = function (name) {
        this.queue[name] = 'loading';
        this.log('info', 'module "'+name+'" load start!');
        // custom onModuleLoadSuccess handler
        typeof this.options.onModuleLoadStart === 'function' 
            && this.options.onModuleLoadStart(name);
    };

    AsynLoader.prototype.onModuleLoadSuccess = function (name) {
        this.queue[name] = 'loaded';
        this.log('info', 'module "'+name+'" load success!');
        // custom onModuleLoadSuccess handler
        typeof this.options.onModuleLoadSuccess === 'function' 
            && this.options.onModuleLoadSuccess(name);
        this.onModuleLoadComplete(name);
    };

    AsynLoader.prototype.onModuleLoadFail = function (name) {
        this.queue[name] = 'failed';
        this.log('error', 'module "'+name+'" load fail!');
        // custom onModuleLoadFail handler
        typeof this.options.onModuleLoadFail === 'function' 
            && this.options.onModuleLoadFail(name);
        this.onModuleLoadComplete(name);
    };

    AsynLoader.prototype.onModuleLoadComplete = function (name) {
        this.log('info', 'module "'+name+'" load complete!');
        // custom onModuleLoadComplete handler
        typeof this.options.onModuleLoadComplete === 'function' 
            && this.options.onModuleLoadComplete(name);
    };

    AsynLoader.prototype.onPackageLoadStart = function (name) {
        this.packages[name] = 'loading';
        this.log('info', 'package "'+name+'" load start!');
        typeof this.options.onPackageLoadStart === 'function' 
            && this.options.onPackageLoadStart(name);
    };

    AsynLoader.prototype.onPackageLoadSuccess = function (name) {
        this.packages[name] = 'loaded';
        this.log('info', 'package "'+name+'" load success!');
        
        // custom onPackageLoadSuccess handler
        typeof this.options.onPackageLoadSuccess === 'function' 
            && this.options.onPackageLoadSuccess(name);
        this.onPackageLoadComplete(name);
    };

    AsynLoader.prototype.onPackageLoadFail = function (name) {
        this.packages[name] = 'failed';
        this.log('error', 'package "'+name+'" load fail!');
        // custom onPackageLoadFail handler
        typeof this.options.onPackageLoadFail === 'function' 
            && this.options.onPackageLoadFail(name);
        this.onPackageLoadComplete(name);
    };

    AsynLoader.prototype.onPackageLoadComplete = function (name) {
        this.log('info', 'package "'+name+'" load complete!');
        // custom onPackageLoadComplete handler
        typeof this.options.onPackageLoadComplete === 'function' 
            && this.options.onPackageLoadComplete(name);
    };

    AsynLoader.prototype.config = function (options) {
        util.merge(this.options, options);
        return this;
    };

    // default options
    var defaults = {
        log: 'error',
        debug: false,
        timeout: 3000,
        mode: 'exc'
    };

    // let the default baseUrl be the path where file asynloader.js at
    // (function () {
    //     var scripts = document.getElementsByTagName('script');
    //     var m;
    //     for(var i = 0, len = scripts.length; i < len; i += 1) {
    //         var src = scripts[i].src;
    //         if(!src) continue;
    //         m = src.match(/asynloader.js(\W|$)/i);
    //         if(m) {
    //             defaults.baseUrl = src.substring(0, m.index);
    //         }
    //     }
    // } ());

    // window.asynloader = window.AL = new AsynLoader(defaults);
    var loader = new AsynLoader(defaults);
    var require = function () {
        var path = arguments[0];

        // if baseUrl is not indecated, use the loadJS
        if(!loader.options.baseUrl) {
            loader.loadJS.apply(loader, arguments);
            return;
        } 
        // if path name end by '.js', use the loadModule
        else if(/\.js$/i.test(path)){
            loader.loadModule.apply(loader, arguments);
            return;
        }

        if(loader.options.debug) {
            loader.loadPackage.apply(loader, arguments);
        } else {
            loader.options.baseUrl = loader.options.compileUrl + loader.options.compileDir;
            loader.loadModule.apply(loader, arguments);                    
        }
    };

    window.AL = {
        config: function (options) { loader.config(options); },
        require: require,
        when: when
    }

} (jQuery));
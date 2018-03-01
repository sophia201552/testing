// dependencies: Bootstrap
var Validator = (function ($, undefined) {
    var push = [].push;

    /////////////////////////////
    // Valid Rules DEFINITIONS //
    /////////////////////////////
    var rulesMap = {};

    ////////////////////////////////
    // RuleWrap CLASS DEFINITIONS //
    ////////////////////////////////
    function RuleWrap (ele, name, rule) {
        this.$ele = $(ele);
        this.name = name;
        this.rule = rule;
        this.defer = $.Deferred();
        this.value = this.$ele.val();
    };

    RuleWrap.prototype.valid = function () {
        var handler = this.rule.valid;
        var _this = this;
        var type = $.type(handler);

        // 如果 type 是 function，表明这是个自定义的规则
        // 非法格式都忽略
        if(type !== 'function' && type !== 'string') {
            console.warn('rule is illigal!');
            return;
        } 
        // 使用不存在的内置规则，将被忽略
        else if(type === 'string' && rulesMap[handler] === undefined) {
            console.warn('rule is not exists!');
            return;
        } 
        // 如果是内置规则，则取出
        else if(type === 'string') {
            handler = rulesMap[handler];
        }

        return handler;
    };

    RuleWrap.prototype.success = function () {
        this.defer.resolveWith(this);
    };

    RuleWrap.prototype.fail = function () {
        this.defer.rejectWith(this);
    };

    ////////////////////////////////
    // Validator CLASS DEFINITION //
    ////////////////////////////////
    function Validator (ele, options) {
        if(arguments.length === 0) return this;
        if(arguments.length === 1) {
            options = ele;
            ele = 'body';
        }

        this.$ele = $.type(ele) === 'object' ? ele : $(ele);
        this.options = $.extend({}, Validator.DEFAULTS, options);
        this.__merge(this, this.options.elements || []);
        this.__init();
        return this;
    }

    Validator.prototype.__init = function () {
        var $selectors;
        var html = '<span class="glyphicon'+
            (this.options.icon ? ' glyphicon-pencil' : '') +
            ' form-control-feedback"></span>';
        for (var i = 0, row, len = this.length; i < len; i++) {
            row = this[i];
            $selectors = $.type(row['selector']) === 'object' ? 
                row['selector'] : $(row['selector'], this.$ele);

            $selectors.each(function (i, ele) {
                var $ele = $(ele), $formGroup;
                $formGroup = $ele.closest('.form-group');
                $formGroup.addClass('has-feedback');
                if($formGroup.children('form-control-feedback').length === 0) {
                    $(html).insertAfter($ele);
                }
            });
        }
    };

    Validator.prototype.valid = function (callback) {
        var self = this;
        var row, results = [];
        var $selectors;
        var deferGroups = [];

        // 重置各个 DOM 状态
        this.resetStatus();

        for (var i = 0, len = this.length; i < len; i++) {
            row = this[i];
            $selectors = $.type(row['selector']) === 'object' ? 
                row['selector'] : $(row['selector'], this.$ele);

            if($selectors.length === 0) continue;

            $selectors.each(function (i, ele) {
                var $ele = $(ele);
                var val = $ele.val();
                var defers = [];
                var obj;
                for (var t = 0, len2 = row.rules.length; t < len2; t++) {
                    obj = new RuleWrap(ele, row.name, row.rules[t]);
                    defers.push( obj );
                }

                // 同一个 DOM 元素的所有规则链式调用
                defers[0].valid().call( defers[0], defers[0].value );
                defers = defers.map(function (row, i, arr) {
                    if(i+1 < len2) {
                        // 只有前一个规则验证成功了，才验证下一个
                        row.defer.done(function () {
                            arr[i+1].valid().call( arr[i+1], defers[0].value );
                        });
                    }
                    return row.defer;
                });

                deferGroups.push(defers);
            });
        }

        // deal with defer groups
        deferGroups = deferGroups.map(function (deferGrp, i) {
            var newDefer = $.Deferred();
            $.when.apply($, deferGrp)
            // 一个 DOM 的所有规则都验证通过，则属于判定成功
            .done(function () {
                // 当存在多个 resolveWith 时，this 会将他们的context 组合成一个数组，
                // 所以在这里需要处理一下
                var $ele, $formGroup;
                var _this, obj = {};
                if( this.length ) _this = this[0];
                else _this = this;

                $ele = _this.$ele;
                // 新增成功状态
                self.setStatus($ele, 'success');
                
                // 本次提交验证成功
                // 将 DOM 的值添加进表单
                obj[_this.name] = _this.value;
                newDefer.resolve(obj);
            })
            // 每个元素中的所有规则只要有一条验证失败，就停止这个元素剩余规则的验证，
            // 并显示错误的 tooltip
            .fail(function () {
                var $ele = this.$ele, ele = $ele[0];
                // 添加失败状态
                self.setStatus($ele, 'error');

                if(ele.timer !== null) {
                    window.clearTimeout(ele.timer);
                    ele.timer = null;
                }
                // 显示 tooltip
                $ele.tooltip({
                    placement: 'top',
                    trigger: 'manual'
                }).attr('data-original-title', this.rule['msg']).tooltip('show');
                
                // hide error tip delay
                ele.timer = window.setTimeout((function ($ele) {
                    return function () {
                        $ele.tooltip('hide');
                        $ele[0].timer = null;
                    }
                }($ele)), 2000);

                // 本次提交验证失败
                newDefer.reject();
            });
            
            return newDefer;
        });
            
        return $.when.apply($, deferGroups).then(function (rs) {
            // 在返回给外界之前，先处理成 key <=> value 的形式
            return $.extend.apply($, ([]).slice.call(arguments) );
        });
    };

    Validator.prototype.setStatus = function ($ele, type) {
        if(!this.options.icon) return;

        if(type === 'error') {
            $ele.closest('.form-group').addClass('has-error')
                .children('.form-control-feedback').removeClass([
                    'glyphicon-ok',
                    'glyphicon-pencil'
                ].join(' ')).addClass('glyphicon-remove');
        } else if(type === 'success') {
            // 新增成功状态
            $ele.closest('.form-group').addClass('has-success')
                .children('.form-control-feedback').removeClass([
                    'glyphicon-pencil',
                    'glyphicon-remove'
                ].join(' ')).addClass('glyphicon-ok');
        }
    };

    Validator.prototype.resetStatus = function () {
        var $selectors, row, $ele, ele, data;
        for (var i = 0, len = this.length; i < len; i++) {
            row = this[i];
            $selectors = typeof row['selector'] === 'object' ? 
                row['selector'] : $(row['selector'], this.$ele);
            for(var t = 0, len2 = $selectors.length; t < len2; t++) {
                $ele = $selectors.eq(t);
                ele = $selectors[t];
                $ele.parents('.form-group').removeClass('has-error has-success');
                if(ele.timer) {
                    window.clearTimeout(ele.timer);
                    ele.timer = null;
                }
                // 这里调用 hide 和 destroy 都会有问题
                // 所以采用这种折衷的方法
                if( data = $ele.data('bs.tooltip') ) {
                    data.$tip.detach();
                }
            }
        }
    };

    Validator.prototype.filter = function (selector) {
        return this.__seek(selector, true);
    };

    Validator.prototype.not = function (selector) {
        return this.__seek(selector, false);
    };

    Validator.prototype.__seek = function (selector, isNeed) {
        var results = [], ret;
        var eles = this.options.elements;
        var regx = $.type(selector) === 'string' ? 
            new RegExp('^'+selector+'$') : regx;
        if ($.type(regx) !== 'regexp') {
            throw 'selector is not a RegExp object or a string!';
        }

        isNeed = isNeed || false;
        for (var i = 0, len = eles.length; i < len; i++) {
            if(!!regx.test(eles[i]['name']) === isNeed) results.push(eles[i]);
        }

        ret = this.__merge(new this.constructor(), results);
        ret.prevObj = this;
        ret.$ele = this.$ele;
        ret.options = this.options;

        return ret;
    }

    Validator.prototype.__merge = function (newObj, arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            push.call(newObj, arr[i]);
        }
        return newObj;
    };

    // make a array-like object
    Validator.prototype.length = 0;
    Validator.prototype.splice = [].splice;

    // Static Method
    Validator.extendRules = function (name, handler) {
        var rules = {}, fn;
        if ($.type(name) === 'string') rules[name] = handler;
        else if ($.type(name) === 'object') rules = name;
        else return;

        for (var i in rules) {
            if (!rules.hasOwnProperty(i)) continue;
            fn = rules[i]
            if ($.type(fn) !== 'function') continue;
            rulesMap[i] = fn;
        }
    };

    // Default Rules
    Validator.extendRules({
        'require': function (val) {
            if(val.trim() === '') this.fail();
            else this.success();
        },
        'word': function (val) {
            if( /^\w+$/.test(val) ) this.success();
            else this.fail();
        },
        'wordWithSpace': function (val) {
            if (val.trim() !== val) {
                this.fail();
            } else {
                if (/^[\w\s]+$/.test(val)) this.success();
                else this.fail();
            }
        }
    });

    Validator.DEFAULTS = {
        tooltipDelay: 2000,
        icon: true
    };

    return Validator;

} (jQuery))
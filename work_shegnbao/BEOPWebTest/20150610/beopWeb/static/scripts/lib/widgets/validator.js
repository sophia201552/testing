// dependencies: jQuery, bootstrap
(function ($, undefined) {

    var push = [].push;
    var oString = Object.prototype.toString;

    function Validator (ele, options) {
        if(!ele) {
            return this;
        }
        this.$ele = $(ele);
        this.options = $.extend({}, Validator.DEFAULTS, options);
        Validator.merge(this, this.options.elements || []);
        return this;
    }

    Validator.prototype.valid = function () {
        var row, rule, results = [];
        var $selectors, ele, $ele, $formGroup;
        this.resetStatus();
        for (var i = 0, len = this.length; i < len; i++) {
            row = this[i];
            $selectors = typeof row['selector'] === 'object' ? 
                row['selector'] : $(row['selector'], this.$ele);
            for (var t = 0, len2 = row.rules.length; t < len2; t++) {
                rule = row.rules[t];
                for (var m = 0, len3 = $selectors.length; m < len3; m++) {
                    $ele = $selectors.eq(m);
                    ele = $selectors[m];
                    if ( !rule['valid'].test($ele.val()) ) {
                        results.push({
                            target: $ele,
                            msg: rule['msg']
                        });
                        // add error statu
                        $ele.parents('.form-group').addClass('has-error');
                        if(ele.timer !== null) {
                            window.clearTimeout(ele.timer);
                            ele.timer = null;
                        }
                        // show error info tooltip
                        $ele.tooltip({
                            placement: 'top',
                            trigger: 'manual'
                        }).attr('data-original-title', rule['msg']).tooltip('show');
                        
                        // hide error tip delay
                        ele.timer = window.setTimeout((function ($ele) {
                            return function () {
                                $ele.tooltip('hide');    
                            }
                        }($ele)), 3000);

                        if (this.options.interruptWhenError) return {status: false, result: results};
                    }
                }
            }
        }
        return results.length === 0 ? {status: true} : {status: false, result: results};
    };

    Validator.prototype.resetStatus = function () {
        var $selectors, row, $ele, ele;
        for (var i = 0, len = this.length; i < len; i++) {
            row = this[i];
            $selectors = typeof row['selector'] === 'object' ? 
                row['selector'] : $(row['selector'], this.$ele);
            for(var t = 0, len2 = $selectors.length; t < len2; t++) {
                $ele = $selectors.eq(t);
                ele = $selectors[t];
                $ele.parents('.form-group').removeClass('has-error has-success');
                $ele.tooltip('destroy');
                if(ele.timer !== null) {
                    window.clearTimeout(ele.timer);
                    ele.timer = null;
                }
            }
        }
    };

    Validator.prototype.filter = function (selector) {
        return this._seek(selector, false);
    };

    Validator.prototype.not = function (selector) {
        return this._seek(selector, true);
    };

    Validator.prototype._seek = function (selector, not) {
        var results = [], ret;
        var eles = this.options.elements;
        var regx = typeof selector === 'string' ? 
            new RegExp('^'+selector+'$') : regx;
        if (oString.call(regx) !== '[object RegExp]') {
            throw 'selector is not a RegExp object or a string!';
        }

        for (var i = 0, len = eles.length; i < len; i++) {
            if(!!regx.test(eles[i]['name']) !== not) results.push(eles[i]);
        }

        ret = Validator.merge(new this.constructor(), results);
        ret.prevObj = this;
        ret.$ele = this.$ele;
        ret.options = this.options;

        return ret;
    }

    // make a array-like object
    Validator.prototype.length = 0;
    Validator.prototype.splice = [].splice;

    Validator.merge = function (results, arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            push.call(results, arr[i]);
        }
        return results;
    }

    Validator.DEFAULTS = {
        interruptWhenError: true
    };

    // VALIDATOR PLUGIN DEFINITION
    // =========================
    function Plugin(option, args) {
        var $this    = this;
        var data     = $this.data('ui.w.validator');
        var options  = typeof option == 'object' && option;

        if (!data && option == 'destroy') return;
        if (!data) $this.data('ui.w.validator', (data = new Validator(this, options)));
        if (typeof option == 'string') return data[option](args);
    }

    $.fn.validator = Plugin;
} (jQuery))
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
﻿/// <reference path="../lib/jquery-2.1.4.js" />

var Internationalization = (function () {
    function Internationalization(lang, resource) {
        this.type = lang || localStorage["language"];
        this.resource = resource || {};
    }

    Internationalization.prototype = {
        getResource: function () {
            return this.resource;
        },

        //Internationalizate whole page
        fillPage: function () {
            this.fill2($('[i18n]'));
        },

        //Internationalizate the children of this special 'JQuery element'
        fillArea: function (element) {
            //this.fill(element.find('[i18n]'));原来i18n方法
            this.fill2(element.find('[i18n]'));
            try {
                Permission.check(element);
            } catch (e) {
                console.log('check permission failed:' + e);
            }
        },

        fillAreaAttribute: function (element, attributeName) {
            this.fill(element.find('[i18n][' + attributeName + ']'), attributeName);
        },

        fill: function (arrElement, attributeName) {
            for (var i = 0, arrPath, text, len = arrElement.length; i < len; i++) {
                arrPath = arrElement[i].attributes["i18n"].value.split('.');

                text = this.resource;
                for (var j = 0; j < arrPath.length; j++) {
                    text = text && text[arrPath[j]];
                }

                if (!attributeName) {
                    arrElement[i].innerHTML = text;
                }
                else {
                    arrElement[i].setAttribute(attributeName, text);
                }
            }
        },
        getI18nValue: function (i18nKey) {
            if (!i18nKey) {
                return '';
            }
            var arrPath = i18nKey.split('.');

            var text = this.resource;
            for (var j = 0; j < arrPath.length; j++) {
                text = text && text[arrPath[j]];
            }
            return text;
        },

        fill2: function (arrElement) {
            for (var i = 0, len = arrElement.length; i < len; i++) {
                var i18nValue = arrElement[i].attributes["i18n"];
                var items = i18nValue.value.split(';'), item, attrMap;
                for (var j = 0; j < items.length; j++) {
                    item = items[j];
                    if (!item) {
                        continue;
                    }
                    if (item.indexOf('=') === -1) {
                        i18nValue = this.getI18nValue(item);
                        arrElement[i].innerHTML = i18nValue;
                    } else {
                        attrMap = item.split('=');
                        if (!attrMap[0]) {
                            continue;
                        }
                        arrElement[i].setAttribute(attrMap[0], this.getI18nValue(attrMap[1]));
                    }
                }
            }
        },

        //params: strPath: ex, observerScreen.menu.NAV_OBSERVER_TITLE. return: value
        findContent: function (strPath) {
            var arrPath = strPath.split('.');
            var text = this.resource;
            for (var i = 0, len = arrPath.length; i < len; i++) {
                text = text && text[arrPath[i]];
            }
            return text;
        }
    };

    return Internationalization;
})();

//load language
function InitI18nResource(strLanguage, isForce, filePath) {
    if (!strLanguage) {
        strLanguage = localStorage["isUserSelectedLanguage"] || navigator.language.split('-')[0];
    }
    if (isForce) {
        localStorage["isUserSelectedLanguage"] = strLanguage;
    } else if (localStorage["isUserSelectedLanguage"]) {
        strLanguage = localStorage["isUserSelectedLanguage"];
    }
    // 默认为主网页的 i18n 路径
    filePath = filePath || '/static/views/js/i18n/';
    return $.ajax({
        async: false,
        url: filePath + strLanguage + ".js",
        dataType: "script"
    }).then(function () {
        // 加载成功，将数据递出
        localStorage["language"] = strLanguage;
        return i18n_resource;
    }, function () {
        // 加载失败，则再去请求一次 en.js
        return $.ajax({
            async: false,
            url: filePath + "en.js",
            dataType: 'script'
        }).then(function () {
            localStorage["language"] = "en";
            return i18n_resource;
        }, function () {
            // 再失败，直接返回 {}
            console.warn('i18n files loading failed!');
            return {};
        });
    });
}

var infoBox = infoBox || {};

(function ($) {
    var infoBoxBase = {
        $el: null,
        options: {
            position: 'center'
        },
        _init: function () {
            this._removeAll();
            this._createBox();
            if (this.options.movable) {
                this._makeMovable();
            }

        },
        _createBox: function () {
            var me = this, $box;

            $('.infoBox-unique.' + me.options.boxType).remove();

            $box = $('<div class="infoBox infoBox-unique ' + me.options.boxType + '"></div>');

            this.$el = $box;
            if (me.options.position) {
                $box.addClass(me.options.position)
            }
            if (me.options.hasHeader) {
                var $header = $('<div class="infoBox-header"></div>');

                if (me.options.movable) {
                    $header.addClass('movable');
                }
                if (me.options.title) {
                    $header.append('<div class="ellipsis infoBox-title">' + me.options.title + '</div>');
                }

                if (me.options.hasClose) {
                    var $close = $('<div class="infoBox-close"></div>');
                    $header.append($close);
                    $close.click(function () {
                        me._destroy();
                    })
                }
                if (me.options.hasResize) {
                    var $zoomIn = $('<div class="infoBox-resize"><span class="glyphicon glyphicon-resize-full" aria-hidden="true"></span></div>');
                    $header.append($zoomIn);
                    $zoomIn.off('click.resizeFull').on('click.resizeFull', '.glyphicon-resize-full', function () {
                        me._resizeFull();
                    });
                    $zoomIn.off('click.resizeSmall').on('click.resizeSmall', '.glyphicon-resize-small', function () {
                        me._resizeSmall();
                    })
                }
                $box.append($header);
            }

            var $body = $('<div class="infoBox-body scrollbar"></div>');

            if (me.options.icon) {
                $body.append('<div class="infoBox-icon"><img src="/static/scripts/lib/beopNotification/image/' + me.options.icon + '"></div>');
            }
            if (typeof me.options.msg === typeof 1) {
                me.options.msg = String(me.options.msg);
            }
            if (!me.options.msg) {
                me.options.msg = '';
            }

            me.options.msg = me.options.msg.replace(/\n/g, '<br/>');
            var infoBoxMsgBox = $('<div class="infoBox-msg">').appendTo($body);
            infoBoxMsgBox.append('<div style="margin-top: 10px;">' + me.options.msg + '</div>');
            if (me.options.input) {
                infoBoxMsgBox.append('<input class="form-control" style="width:250px;margin-top:10px;display:inline-block" />')
            }
            $box.append($body);
            if (me.options.buttons) {
                var $footer = $('<div class="infoBox-footer"></div>');
                $box.append($footer);
                for (var btnKey in me.options.buttons) {
                    if (me.options.buttons.hasOwnProperty(btnKey)) {
                        $footer.append(me._createBtn(me.options.buttons[btnKey]));
                    }
                }
            }

            if (me.options.delay) {
                var $progress = $('<div class="progress progress-bar-success"><div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:0%"><span class="sr-only"</span></div></div>');

                $progress.insertBefore($body);
                $progress.animate({
                    width: "100%"
                }, +me.options.delay ? +me.options.delay : 20000, function () {
                    me._destroy();
                });
            }

            if (me.options.modal && $('#infoBoxModal').length == 0) {
                var modalHtml = '<div id="infoBoxModal"></div>';
                $('body').append(modalHtml);
                //$box.addClass('modal');
            }
            $box.appendTo(document.body);
            return $box;
        },
        _processInput: function (options) {
            options.boxType = this.constructor.name ? this.constructor.name : '';
            return options;
        },
        _show: function () {
            this.$el.fadeIn('fast');
            I18n.fillArea(this.$el);
            var $btn = this.$el.find('[i18n]');
            //兼容没做国际化的页面
            $btn.each(function (i, item) {
                var arr = ['OK', 'Cancel'];
                var $item = $(item);
                if (I18n.getI18nValue($item.attr('i18n')) === undefined) {
                    $item.html(arr[i]);
                }
            });
        },
        _hide: function () {
            this.$el.hide();
        },
        _click: function () {
            var _this = this;
            this.$el.click(function () {
                _this._destroy();
            });
        },
        _destroy: function () {
            var me = this;
            me.$el.fadeOut('fast', function () {
                me.$el.remove();
            });
            if (me.options.modal) {
                $('#infoBoxModal').remove();
            }
        },
        _resizeFull: function () {
            this.$el.addClass('full-size');
            this.$el.find('.infoBox-resize>.glyphicon').removeClass('glyphicon-resize-full').addClass('glyphicon-resize-small');
        },
        _resizeSmall: function () {
            this.$el.removeClass('full-size');
            this.$el.find('.infoBox-resize>.glyphicon').removeClass('glyphicon-resize-small').addClass('glyphicon-resize-full');
        },
        _makeMovable: function () {
            var me = this;
            me.$el.mousedown(function () {
                me.$el.mousemove(function (e) {

                    var thisX = event.pageX - $(this).width() / 2,
                        thisY = event.pageY - $(this).height() / 2;

                    me.$el.offset({
                        left: thisX,
                        top: thisY
                    });
                })
            }).mouseup(function () {
                me.$el.off('mousemove');
            })
        },
        _removeAll: function () {
            if (this.options.boxType) {
                if (this.options.boxType == 'remind') {
                    $(document.body).children('.remind').remove();
                } else {

                }
            } else {
                $(document.body).children('.infoBox-unique').remove();
            }

        },

        _createBtn: function (option) {
            var me = this;
            var $button = $('<button class="btn btn-info alert-button"></button>');
            $button.attr('i18n', option.i18n);
            $button.text(option.text);
            $button.click(function () {
                me._destroy();
                option.callback && option.callback();
            });
            $button.addClass(option.css);
            this.$el.find('.infoBox-footer').append($button);
        },
        close: function () {
            this._destroy();
        }
    };

    function infoBoxTip(msg, options) {
        var _this = this;
        this.type = ((options && options.type) || infoBox.tip.base.type);
        if (!options) {
            options = {msg: msg}
        } else {
            options = $.extend(options, {msg: msg});
        }

        this.options = this._processInput(options);

        this._init();
        this._show();
        this._click();
        if (!options.delay) {
            options.delay = 2000;
        }
        setTimeout(function () {
            _this._destroy();
        }, options.delay);
    }

    infoBoxTip.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxTip,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.tip.base, infoBox.tip.options[this.type], mergedOptions);

            return options;
        },
        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.tip = function (msg, options) {
        return new infoBoxTip(msg, options);
    };

    infoBox.tip.base = {
        position: 'center',
        type: 'info',
        modal: true,
        movable: false
    };

    infoBox.tip.options = {
        success: {
            icon: 'alert-success.png'
        },
        warning: {
            icon: 'alert-warning.png'
        },
        danger: {
            icon: 'alert-danger.png'
        },
        info: {
            icon: 'alert-info.png'
        }
    };

    function infoBoxPrompt(msg, callback, cancelCallback, options) {
        var _this = this;
        this.type = (options && options.type) || infoBox.prompt.base.type;
        if (!options) {
            options = {msg: msg}
        } else {
            options = $.extend(options, {msg: msg});
        }
        options = $.extend(true, options, {
            buttons: {
                ok: {
                    callback: function () {
                        callback(_this.$el.find('input').val());
                    }
                },
                cancel: {
                    callback: cancelCallback
                }
            }
        });
        this.options = this._processInput(options);
        this._init();
        this._show();

        if (options.delay && !isNaN(options.delay)) {
            var timeout = setTimeout(function () {
                _this._destroy();
                timeout = null;
            }, option.delay)
        }
    }

    infoBoxPrompt.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxPrompt,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.prompt.base, infoBox.prompt.options[this.type], mergedOptions);

            return options;
        },
        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.prompt = function (msg, callback, cancelCallback, options) {
        return new infoBoxPrompt(msg, callback, cancelCallback, options);
    };

    infoBox.prompt.base = {
        type: 'info',
        buttons: {
            ok: {
                text: 'OK',
                i18n: 'common.CONFIRM',
                class: 'alert-button',
                callback: function () {
                    return true;
                }
            },
            cancel: {
                text: 'Cancel',
                i18n: 'common.CANCEL',
                class: 'alert-button',
                callback: function () {
                    return false;
                }
            }
        },
        input: {},
        modal: true,
        hasHeader: true,
        hasClose: true,
        movable: false
    };

    infoBox.prompt.options = {
        success: {
            icon: 'alert-success.png'
        },
        warning: {
            icon: 'alert-warning.png'
        },
        danger: {
            icon: 'alert-danger.png'
        },
        info: {
            icon: 'alert-info.png'
        }
    };

    function infoBoxAlert(msg, options) {
        var _this = this;
        this.type = (options && options.type) || infoBox.alert.base.type;
        if (!options) {
            options = {msg: msg}
        } else {
            options = $.extend(options, {msg: msg});
        }

        this.options = this._processInput(options);

        this._init();
        this._show();

        if (options.delay && !isNaN(options.delay)) {
            var timeout = setTimeout(function () {
                _this._destroy();
                timeout = null;
            }, options.delay)
        }
    }

    infoBoxAlert.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxAlert,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.alert.base, infoBox.alert.options[this.type], mergedOptions);

            return options;
        },
        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.alert = function (msg, options) {
        if (!options) {
            options = {};
        }
        options['type'] = 'info';
        return new infoBoxAlert(msg, options);
    };

    infoBox.alert.warning = function (msg, options) {
        if (!options) {
            options = {};
        }
        options['type'] = 'warning';
        return new infoBoxAlert(msg, options);
    };

    infoBox.alert.success = function (msg, options) {
        if (!options) {
            options = {};
        }
        options['type'] = 'success';
        return new infoBoxAlert(msg, options);
    };

    infoBox.alert.danger = function (msg, options) {
        if (!options) {
            options = {};
        }
        options['type'] = 'danger';
        return new infoBoxAlert(msg, options);
    };


    infoBox.alert.base = {
        type: 'info',
        buttons: {
            ok: {
                text: 'OK',
                i18n: 'common.CONFIRM',
                class: 'alert-button',
                callback: ''
            }
        },
        modal: true,
        hasHeader: true,
        hasClose: true,
        movable: false
    };

    infoBox.alert.options = {
        success: {
            icon: 'alert-success.png'
        },
        warning: {
            icon: 'alert-warning.png'
        },
        danger: {
            icon: 'alert-danger.png'
        },
        info: {
            icon: 'alert-info.png'
        }
    };


    function infoBoxConfirm(msg, okCallback, cancelCallback, options) {
        this.type = (options && options.type) || infoBox.confirm.base.type;

        if (!okCallback && !cancelCallback) {
            okCallback = function () {
            };
            cancelCallback = function () {
            };
            this.type = 'danger';
            msg = 'warning:you not pass the callback to confirm function';
        }
        options = $.extend(options, {
            msg: msg,
            buttons: {
                ok: {
                    callback: okCallback
                },
                cancel: {
                    callback: cancelCallback
                }
            }
        });
        this.options = this._processInput(options);
        this._init();
        this._show();
    }

    infoBoxConfirm.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxConfirm,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.confirm.base, infoBox.confirm.options[this.type], mergedOptions);

            return options;
        },
        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.confirm = function (msg, okCallback, cancelCallback, options) {
        return new infoBoxConfirm(msg, okCallback, cancelCallback, options);
    };

    infoBox.confirm.danger = function (msg, okCallback, cancelCallback, options) {
        if (!options) {
            options = {};
        }
        options['type'] = 'danger';
        return new infoBoxConfirm(msg, okCallback, cancelCallback, options)
    };

    infoBox.confirm.warn = function (msg, okCallback, cancelCallback, options) {
        if (!options) {
            options = {};
        }
        options['type'] = 'warn';
        return new infoBoxConfirm(msg, okCallback, cancelCallback, options);
    };

    infoBox.confirm.base = {
        type: 'info',
        buttons: {
            ok: {
                text: 'OK',
                i18n: 'common.CONFIRM',
                class: 'alert-button',
                callback: function () {
                    return true;
                }
            },
            cancel: {
                text: 'Cancel',
                i18n: 'common.CANCEL',
                class: 'alert-button',
                callback: function () {
                    return false;
                }
            }
        },
        modal: true,
        hasHeader: true,
        hasClose: true,
        movable: false
    };

    infoBox.confirm.options = {
        success: {
            icon: 'alert-success.png'
        },
        warning: {
            icon: 'alert-warning.png'
        },
        danger: {
            icon: 'alert-danger.png'
        },
        info: {
            icon: 'alert-info.png'
        }
    };

    // remind
    function infoBoxRemind(typeOrMsg, options) {
        if (!options) {
            this.type = infoBox.remind.base.type;
            options = {msg: typeOrMsg}
        }

        if (!typeOrMsg) {
            this.type = infoBox.remind.base.type;
        } else if (infoBox.remind.options[typeOrMsg]) {
            this.type = typeOrMsg;
        } else {
            options = $.extend(options, {msg: typeOrMsg});
        }

        this.options = this._processInput(options);

        this._init();
        this.$el.slideDown(1000);
    }

    infoBoxRemind.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxRemind,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.remind.base, infoBox.remind.options[this.type], mergedOptions);

            return options;
        },
        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.remind = function (type, options) {
        return new infoBoxRemind(type, options);
    };

    infoBox.remind.base = {
        type: 'info',
        modal: false,
        hasHeader: true,
        hasClose: true
    };

    infoBox.remind.options = {};

    // version
    function infoBoxVersion(title, content) {
        this.options = this._processInput({'msg': content});

        this._init();

        var $versionTitle = '<div class="ellipsis infoBoxVersion-title" title="' + title + '">' +
            '<span class="dib mr5">版本号：</span><span>' + title + '</span></div>';
        this.$el.find('.infoBox-header').append($versionTitle);
        this.$el.slideDown(1000);
    }

    infoBoxVersion.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxVersion,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.version.base, infoBox.version.options[this.type], mergedOptions);

            return options;
        },

        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.version = function (title, content) {
        return new infoBoxVersion(title, content);
    };

    infoBox.version.base = {
        modal: false,
        hasHeader: true,
        hasClose: true,
        delay: 10000
    };

    infoBox.version.options = {};


    // message
    function infoBoxMessage(content, options) {
        this.options = this._processInput({'msg': content});
        this._init();
        var $messageTitle = '<div style="position: relative; top: -10px;"><span class="fl">' + i18n_resource.workflow.message.MESSAGE + '</span>' +
            '<span class="fr header-right" style="cursor: pointer;"><span class="mr5 markAsAllRead">' + i18n_resource.workflow.message.ALL_READ + '</span><span class="glyphicon glyphicon-envelope"></span></span></div>';
        this.$el.find('.infoBox-header').append($messageTitle);
        options.initCb && options.initCb.call(this);
        this.$el.slideDown(300);
    }

    infoBoxMessage.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxMessage,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.message.base, infoBox.message.options[this.type], mergedOptions);

            return options;
        },

        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.message = function (content, options) {
        return new infoBoxMessage(content, options);
    };

    infoBox.message.base = {
        modal: false,
        hasHeader: true
    };

    infoBox.message.options = {};


})(jQuery);

try {
    if (infoBox) {
        alert = infoBox.alert;
        //prompt = infoBox.prompt;
        tip = infoBox.tip;
        confirm = infoBox.confirm;
        remindInfoBox = infoBox.remind;
        versionInfoBox = infoBox.version;
        messageInfoBox = infoBox.message;
    }
} catch (e) {
    console.warn('弹框初始化失败' + e);
}
﻿/// <reference path="../../lib/jquery-1.8.3.js" />

var beop = beop || {};
beop.constant = {
    project_img_path: '/static/images/project_img/',
    project_default_img: 'default.jpg',
    BEOP_IMG_HOST: 'http://images.rnbtech.com.hk',
    OSS_PROJECT_IMG_PATH: '/custom/project_img/'
};

// 生成 object id - 24 位
var ObjectId = function () {
    // 前 13 位，unix 时间戳
    var timestamp = new Date().valueOf();
    // 中间 3 位，用户id，不足补 0，超过从前面截断
    var userId = ( '000' + ((window.AppConfig && window.AppConfig.userId) || '000') ).slice(-3);
    // 最后 8 位，随机十六进制数
    var hex8 = ('00000000' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16)).slice(-8);

    return timestamp + userId + hex8;
};

(function (exports) {
    exports.namespace = function (path) {
        var obj = window;
        path = path.split('.');

        path.forEach(function (p, i) {
            p = p.trim();
            if (i === 0 && p === 'window') return;
            obj = obj[p] = obj[p] || {};
        });

        return obj;
    };
}(window));

(function (exports) {

    /**
     * 对象混合
     * Mixin([, mixins[, mixins[, ...]]])
     * 示例：
     * Mixin({a:1}, {a:2, b:2}, {c:3})，返回 {a:2, b:2, c:3}
     */
    exports.Mixin = function (/* mixins ... */) {
        var prototype = {};
        var methods;

        for (var i = 0, len = arguments.length; i < len; i++) {
            methods = arguments[i];
            for (var m in methods) {
                prototype[m] = methods[m];
            }
        }
        return prototype;
    };

}(window));

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
        level: ENUM_LEVEL.WARN,
        log: function () {
            if (this.level > ENUM_LEVEL.LOG) return;
            Log._out('log', arguments);
        },
        info: function () {
            if (this.level > ENUM_LEVEL.INFO) return;
            Log._out('info', arguments);
        },
        debug: function () {
            if (this.level > ENUM_LEVEL.DEBUG) return;
            Log._out('debug', arguments);
        },
        warn: function () {
            if (this.level > ENUM_LEVEL.WARN) return;
            Log._out('warn', arguments);
        },
        error: function () {
            if (this.level > ENUM_LEVEL.ERROR) return;
            Log._out('error', arguments);
        },
        exception: function (message, exception) {
            if (this.level > ENUM_LEVEL.EXCEPTION) return;
            if (exception) {
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

if (!Array.toMap) {
    Array.toMap = function (arr, key) {
        var map = {};
        arr.forEach(function (row, i) {
            map[row[key]] = row;
        });
        return map;
    };
}

var FullScreenManager = (function () {
    var manager = Object.create({
        init: function () {
            var _this = this;

            $(document).off('webkitfullscreenchange');
            $(document).on('webkitfullscreenchange', function () {
                var isFullScreen = !!document.webkitFullscreenElement;
                if (isFullScreen) {
                    _this.onFullScreenEnter();
                } else {
                    _this.onFullScreenOut();
                }
            });
            $(document).off('mozfullscreenchange');
            $(document).on('mozfullscreenchange', function () {
                var isFullScreen = !!document.webkitFullscreenElement;
                if (isFullScreen) {
                    _this.onFullScreenEnter();
                } else {
                    _this.onFullScreenOut();
                }
            });
            $(document).off('msfullscreenchange');
            $(document).on('msfullscreenchange', function () {
                var isFullScreen = !!document.webkitFullscreenElement;
                if (isFullScreen) {
                    _this.onFullScreenEnter();
                } else {
                    _this.onFullScreenOut();
                }
            });

            if (typeof onError === 'function') {
                $(document).off('webkitfullscreenerror');
                $(document).on('webkitfullscreenerror', this.onFullScreenError);
                $(document).off('mozfullscreenerror');
                $(document).on('mozfullscreenerror', this.onFullScreenError);
                $(document).off('msfullscreenerror');
                $(document).on('msfullscreenerror', this.onFullScreenError);
            }
        },
        onFullScreenEnter: function () {
        },
        onFullScreenOut: function () {
        },
        onFullScreenError: function () {
        },
        // open/close full screen mode
        // note: for security concerns, this api an only works in user actions
        toggle: function () {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }
    });

    manager.init();

    return manager;
}());


function StringBuilder() {
    this.data = Array("");
}
StringBuilder.prototype.append = function () {
    this.data.push(arguments[0]);
    return this;
};
StringBuilder.prototype.toString = function () {
    return this.data.join("");
};
StringBuilder.prototype.getLength = function () {
    return this.data.length;
};


//string 的format方法
//usage 1: '{0} {1} {2} {3}'.format('this', 'is', 'a', 'test') -> this is a test
//usage 2: '{0} {1} {2} {3}'.format(['this', 'is', 'a', 'test']) -> this is a test
if (!String.prototype.format) {
    String.prototype.format = function () {
        if (arguments[0] === undefined) {
            return '';
        }
        if (arguments[0].constructor === Array) {
            var args = arguments[0];
        } else {
            var args = arguments;
        }

        // var i = 0;
        // var str = this.toString();
        // while (args[i]) str = str.replace('{'+i+'}', args[i++]);
        // return str;

        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

// input: '<td>{name}</td><td>{gender}</td>'.formatEL({name: 'zhangsan', gender: 'male'});
// output: '<td>zhangsan</td><td>male</td>'
// input: '{name},{age},{address}'.formatEL({name: 'zhangsan', age: 20, address: 'shanghai', other: 'other'});
// output: 'zhangsan,20,shanghai'
// input: '{}'.formatEL({foo: 1});
// output: '{}'
// input: '{{name}}'.formatEL({name: 'zhangsan'});
// output: '{zhangsan}'
if (!String.prototype.formatEL) {
    String.prototype.formatEL = function (o, defaultVal) {
        var str = this.toString();
        if (!str || !o) return '';

        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                str = str.replace(new RegExp('{' + p + '}', 'g'), o[p]);
            }
        }

        if (typeof defaultVal !== 'undefined') {
            str = str.replace(/{[^{}]*?}/g, defaultVal);
        }

        return str;
    };
}

//parse String to Date
//ex:parse '2015-02-02 08:00:00' / '2015/02/02 08:00:00' to Date type
String.prototype.toDate = function () {
    var str = this;
    if (str.indexOf('-') > -1)
    //this = this.replace(/-/g, '/')
        str = str.replace('-', '/').replace('-', '/');
    return new Date(str);
};

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (word) {
        return new RegExp('^' + word).test(this);
    }
}

//parse timestamp to Date
Number.prototype.toDate = function () {
    return new Date(this);
};

function Alert(targetElement, type, msg) {
    this.element = targetElement;
    this.str = new StringBuilder();
    this.str.append('<div style="display:none;" class="alert beop-alert alert-')
        .append(type)
        .append(' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>')
        .append('<div class="alert-msg">' + msg + '</div>')
        .append('</div>');
    this.$alert = $(this.str.toString());
}

Alert.danger = function (targetElement, msg) {
    return new Alert(targetElement, Alert.type.danger, msg);
};

Alert.warning = function (targetElement, msg) {
    return new Alert(targetElement, Alert.type.warning, msg);
};

Alert.success = function (targetElement, msg) {
    return new Alert(targetElement, Alert.type.success, msg);
};

Alert.info = function (targetElement, msg) {
    return new Alert(targetElement, Alert.type.info, msg);
};

Alert.closeAll = function () {
    $('.beop-alert').remove();
};

Alert.type = {
    danger: 'danger',
    warning: 'warning',
    success: 'success',
    info: 'info'
};

Alert.prototype.show = function (duration) {
    Alert.closeAll();
    if (duration) {
        var _this = this;
        setTimeout(function () {
            _this.close();
        }, duration);
    }
    $(this.element).append(this.$alert);
    this.$alert.slideDown(500);
    return this;
};
Alert.prototype.close = function () {
    var _this = this;
    this.$alert.slideUp(500, function () {
        _this.$alert.remove();
        _this = null;
    });
};

Alert.prototype.setMessage = function (msg) {
    if (!msg) {
        return false
    }
    this.$alert.find('.alert-msg').text(msg);

};

Alert.prototype.setStyle = function (style) {
    if (style && typeof style !== 'string') {
        this.$alert.css(style);
    }
    return this;
};

Alert.prototype.showAtTop = function (duration) {
    this.setStyle({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        width: '30%',
        textAlign: 'center',
        zIndex: 10000
    });
    if (!duration) {
        duration = 2000;
    }
    this.show(duration);
};

function showDialog(url) {
    return WebAPI.get(url).done(function (resultHtml) {
        $("#dialogContent").html(resultHtml);
        $('#dialogModal').modal({});
    });
}


function clone(obj) {
    if (obj == null || typeof (obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = clone(obj[key]);
        }
    }
    return temp;
}

//对Date的扩展，将 Date 转化为指定格式的String       
//月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
//eg:       
//(new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
//(new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
//(new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
//(new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
//(new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份           
        "d+": this.getDate(), //日           
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(), //分           
        "s+": this.getSeconds(), //秒           
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
        "S": this.getMilliseconds() //毫秒           
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

Date.prototype.timeFormat = function (format, type, language, option) {
    var date = this;
    if (format && (typeof format == 'string' || typeof format == 'object')) {
        if (typeof format == 'object' && (!format.separators || !format.parts)) {
            format = 'yyyy-mm-dd hh:ii:ss';
        }
    } else {
        format = 'yyyy-mm-dd hh:ii:ss';
    }
    if (arguments.length >= 2) {
        var paramArr = (function (arrayish) {
            return [].slice.call(arrayish);
        })(arguments);
        paramArr.shift();
        type = language = option = null;
        paramArr.forEach(function (it, i) {
            if (typeof it == 'string') {
                language = it;
            } else if (typeof it == 'number') {
                type = it;
            } else if (typeof it == 'object') {
                option = it;
            }
        });
    }
    var isReturnNull = false;
    if (option) {
        for (var k in option) {
            if (k == 'isReturnNull') {
                isReturnNull = option[k];
            }
        }
    }
    if (date == 'Invalid Date') {
        console.warn("Invalid date.");
        if (isReturnNull) {
            return '';
        } else {
            return date.toString();
        }
    }
    var DATES = {
        en: {
            "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "daysShort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "daysMin": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "monthsShort": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "meridiem": ["am", "pm"]
        }
    };
    language = language ? (DATES[language] ? language : 'en') : 'en';
    var formatObj = (function (formatStr) {
        if (typeof formatStr == 'object') {
            return formatStr;
        }
        if (type) {
            formatStr = timeFormatChange(formatStr, type);
        }
        var reg = /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
        var separators = formatStr.replace(reg, '\0').split('\0');
        var parts = formatStr.match(reg);
        if (!separators || !separators.length || !parts || parts.length == 0) {
            throw new Error("Invalid date format.");
        }
        return {separators: separators, parts: parts};
    })(format);

    var val = {
        // year
        yy: date.getFullYear().toString().substring(2),
        yyyy: date.getFullYear(),
        // month
        m: date.getMonth() + 1,
        M: DATES[language].monthsShort[date.getMonth()],
        MM: DATES[language].months[date.getMonth()],
        // day
        d: date.getDate(),
        D: DATES[language].daysShort[date.getDay()],
        DD: DATES[language].days[date.getDay()],
        p: (DATES[language].meridiem.length == 2 ? DATES[language].meridiem[date.getHours() < 12 ? 0 : 1] : ''),
        // hour
        h: date.getHours(),
        // minute
        i: date.getMinutes(),
        // second
        s: date.getSeconds()
    };

    if (DATES[language].meridiem.length == 2) {
        val.H = (val.h % 12 == 0 ? 12 : val.h % 12);
    }
    else {
        val.H = val.h;
    }
    val.HH = (val.H < 10 ? '0' : '') + val.H;
    val.P = val.p.toUpperCase();
    val.hh = (val.h < 10 ? '0' : '') + val.h;
    val.ii = (val.i < 10 ? '0' : '') + val.i;
    val.ss = (val.s < 10 ? '0' : '') + val.s;
    val.dd = (val.d < 10 ? '0' : '') + val.d;
    val.mm = (val.m < 10 ? '0' : '') + val.m;

    var finTime = '';
    for (var i = 0, len = formatObj.separators.length; i < len; i++) {
        finTime += formatObj.separators[i] + (formatObj.parts[i] ? val[formatObj.parts[i]] : '');
    }
    return finTime;
};

var DateUtil = (function () {
    var dateLocale = {
        month: {
            en: {
                month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            zh: {
                month_names: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                month_names_short: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }
        }
    };

    function getWeekNumber(d) {
        d = new Date(+d);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7);
        return [d.getFullYear(), weekNo];
    }

    function getLastWeekNumberOf(y, w) {
        w -= 1;
        if (w === 0) {
            y = y - 1;
            w = 52;
        }
        return [y, w];
    }

    function getNextWeekNumberOf(y, w) {
        w += 1;
        if (w === 53) {
            y += 1;
            w = 1;
        }
        return [y, w];
    }

    function isLeapYear(y) {
        if (Object.prototype.toString.call(y) === '[object Date]') {
            y = y.getFullYear();
        }
        return (( y % 4 === 0 ) && ( y % 100 !== 0 )) || ( y % 400 === 0 );
    }

    function daysInMonth(dt) {
        var m = dt.getMonth();
        if (m === 1) {
            return isLeapYear(dt) ? 29 : 28;
        }
        return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
    }

    function getFirstDayOfWeek(year, week) {
        var d = new Date(year, 0, 1),
            offset = d.getTimezoneOffset();
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));

        d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000
            * (week + (year == d.getFullYear() ? -1 : 0 )));

        d.setTime(d.getTime()
            + (d.getTimezoneOffset() - offset) * 60 * 1000);

        d.setDate(d.getDate() - 3);

        return d;
    }

    function getDateRangeOnWeekNumber(year, week) {
        if (!year || !week) {
            return;
        }
        var firstDay = getFirstDayOfWeek(year, week), lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        return [firstDay, lastDay];
    }

    function getMonthName(index, language) {
        var monthList = language && language in dateLocale.month ? dateLocale.month[language].month_names : dateLocale.month['en'].month_names;
        return monthList[index];
    }

    function getMonthNameShort(index, language) {
        var monthList = language && language in dateLocale.month ? dateLocale.month[language].month_names_short : dateLocale.month['en'].month_names_short;
        return monthList[index];
    }

    function getLastMonth(currentMonth) {
        if (!currentMonth) {
            currentMonth = new Date().getMonth() + 1;
        }
        if (currentMonth === 1) {
            return 12;
        } else {
            return currentMonth - 1;
        }
    }

    function getNextMonth(currentMonth) {
        if (!currentMonth) {
            currentMonth = new Date().getMonth() + 1;
        }
        if (currentMonth === 12) {
            return 1;
        } else {
            return currentMonth + 1;
        }
    }

    /**
     * get the relative date info from date2 according to date1
     * TESTS:
     * TEST_1
     * DateUtil.getRelativeDateInfo(new Date('2015-05-08 16:03:25'), new Date('2015-05-04 14:41:57'))
     * output: "4 days ago"
     * TEST_2
     * DateUtil.getRelativeDateInfo(new Date('2015-05-08 16:03:25'), new Date('2015-05-08 15:41:57'))
     * output: "21 minutes ago"
     * TEST_3
     * DateUtil.getRelativeDateInfo(new Date('2015-05-08 16:03:25'), new Date('2015-04-04 14:41:57'))
     * output: "34 days ago"
     * TEST_4
     * DateUtil.getRelativeDateInfo(new Date('2015-05-08 16:03:25'), new Date('2014-05-04 14:41:57'))
     * output: "1 year ago"
     */
    function getRelativeDateInfo(date1, date2) {
        var now = new Date();
        var lang = I18n.type;
        var value1, value2, ts, info;

        // deal with all empty
        if (!date1 && !date2) return '';

        value1 = (date1 || now).valueOf();
        value2 = (date2 || now).valueOf();

        // do Math.abs, and turn millisecond to second
        ts = Math.floor(Math.abs(value1 - value2) / 1000);

        switch (true) {
            // seconds level
            // will show "n second(s) ago/later"
            case ts < 60:
                info = ts + (ts === 1 ? ' second' : ' seconds');
                break;
            // minutes level
            // will show "n minute(s) ago/later"
            case ts < 3600/*60 * 60*/
            :
                ts = Math.floor(ts / 60);
                info = ts + (ts === 1 ? ' minute' : ' minutes');
                break;
            // hours level
            // will show "n hour(s) ago/later"
            case ts < 86400/*60 * 60 * 24*/
            :
                ts = Math.floor(ts / (3600/*60 * 60*/));
                info = ts + (ts === 1 ? ' hour' : ' hours');
                break;
            // days level
            // will show "n day(s) ago/later"
            case ts < 31536000/*60 * 60 * 24 * 365*/
            :
                ts = Math.floor(ts / (86400/*60 * 60 * 24*/));
                info = ts + (ts === 1 ? ' day' : ' days');
                break;
            // years level
            // will show "n year(s) ago/later"
            default:
                ts = Math.floor(ts / (31536000/*60 * 60 * 24 * 365*/));
                info = ts + (ts === 1 ? ' year' : ' years');
                break;
        }
        info += value1 > value2 ? ' ago' : ' later';
        if (lang === 'zh') {
            info = info.replace(/\s(seconds?|minutes?|hours?|days?|years?)\s(ago|later)$/, function ($0, $1, $2) {
                var rs = '';
                if ($1.indexOf('second') > -1) rs += '秒';
                if ($1.indexOf('minute') > -1) rs += '分钟';
                if ($1.indexOf('hour') > -1) rs += '小时';
                if ($1.indexOf('day') > -1) rs += '天';
                if ($1.indexOf('year') > -1) rs += '年';
                if ($2 === 'ago') rs += '前';
                if ($2 === 'later') rs += '后';
                return rs;
            });
        }
        return info;
    }

    return {
        getWeekNumber: getWeekNumber,
        isLeapYear: isLeapYear,
        daysInMonth: daysInMonth,
        getLastWeekNumberOf: getLastWeekNumberOf,
        getNextWeekNumberOf: getNextWeekNumberOf,
        getDateRangeOnWeekNumber: getDateRangeOnWeekNumber,
        getFirstDayOfWeek: getFirstDayOfWeek,
        getMonthName: getMonthName,
        getMonthNameShort: getMonthNameShort,
        getLastMonth: getLastMonth,
        getNextMonth: getNextMonth,
        getRelativeDateInfo: getRelativeDateInfo,
        DATA_FORMAT: {
            FULL_DATETIME: 'yyyy-mm-dd hh:ii:ss',
            FULL_DATETIME_CHANGE: 'yyyy-MM-dd HH:mm:ss',
            FULL_DATETIME_ALL_SEC_CHANGE: 'yyyy-MM-dd 00:00:00',
            FULL_DATETIME_ZERO_SEC_CHANGE: 'yyyy-MM-dd HH:mm:00',
            FULL_DATETIME_NO_SEC_CHANGE: 'yyyy-MM-dd HH:mm',
            FULL_DATETIME_ZERO_SEC: 'yyyy-mm-dd hh:ii:00',
            FULL_DATETIME_HH_00_00: 'yyyy-mm-dd hh:00:00',
            FULL_DATETIME_00_00_00: 'yyyy-mm-dd 00:00:00',
            FULL_DATETIME_NO_SEC: 'yyyy-mm-dd hh:ii',
            FULL_DATETIME_HH_00: 'yyyy-mm-dd hh:00',
            FULL_DATETIME_00_00: 'yyyy-mm-dd 00:00',
            FULL_DATE: 'yyyy-mm-dd',
            TIME: 'hh:ii:ss',
            TIME_HOUR_MINUTE: 'hh:ii',
            TIME_ZERO_SEC: 'hh:ii:00'
        }
    }
})();
var StringUtil = (function () {
    var HTML_ENTITIES = {
        '&': '&amp;',
        '>': '&gt;',
        '<': '&lt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;'
    }, HTML_ENTITIES_INVERT = invert(HTML_ENTITIES);

    function invert(obj) {
        var result = {}, keys = Object.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    }

    function padLeft(oldStr, padNum, padStr) {
        if (!padStr) {
            return oldStr;
        }
        return new Array(padNum - String(oldStr).length + 1).join(padStr) + oldStr;
    }

    function htmlEscape(text) {
        if (!text) {
            return text;
        }
        var source = '(?:' + Object.keys(HTML_ENTITIES).join('|') + ')',
            replaceRegexp = new RegExp(source, 'g');
        return text.replace(replaceRegexp, function (character) {
            return HTML_ENTITIES[character];
        });
    }

    function htmlUnEscape(text) {
        if (!text) {
            return text;
        }
        var source = '(?:' + Object.keys(HTML_ENTITIES_INVERT).join('|') + ')',
            replaceRegexp = new RegExp(source, 'g');
        return text.replace(replaceRegexp, function (character) {
            return HTML_ENTITIES_INVERT[character];
        });
    }

    var getI18nProjectName = function (project) {
        if (!I18n || !project) {
            return '';
        }
        var result = '';
        switch (I18n.type) {
            case 'en':
            {
                result = project.name_english;
                break;
            }
            case 'zh':
            {
                result = project.name_cn;
                break;
            }
            default :
            {
                result = project.name_english;
            }
        }
        return result || '';
    };

    return {
        padLeft: padLeft,
        htmlEscape: htmlEscape,
        htmlUnEscape: htmlUnEscape,
        getI18nProjectName: getI18nProjectName
    }
})();
var BEOPUtil = (function () {

    var jsType = {
        function: typeof $.noop,
        number: typeof 0,
        string: typeof '',
        undefined: typeof undefined
    };

    var projectImgPath = beop.constant.project_img_path;
    var setRelativePosition = function ($obj, $target, topOffset, leftOffset) {//$obj为比较对象，$target为浮动窗口对象
        $target.css({
            "left": $obj.offset().left + $obj.width() + (leftOffset || 5),
            "top": $obj.offset().top + (topOffset || 10)
        });
    };

    var projectDefaultImgPath = projectImgPath + beop.constant.project_default_img;
    var getProjectImgPath = function (project) {
        if (project) {
            return project.pic ? projectImgPath + project.pic : projectDefaultImgPath;
        }
    };
    var getProjectFromAppConfig = function (projectId) {
        for (var m = 0, len = AppConfig.projectList.length; m < len; m++) {
            if (AppConfig.projectList[m].id == projectId) {
                return AppConfig.projectList[m];
            }
        }
    };

    function getFunctionName(func) {
        if (!func || typeof func != jsType.function) {
            return '';
        }
        var ret = func.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    }

    function isUndefined(obj) {
        return typeof obj === jsType.undefined;
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    /***
     * 处理计算点的代码内容
     * @param content
     */
    function logicContentHandle(content) {
        if (content) {
            //将tab换成4个空格,防止代码中tab和空格混用的情况
            content = content.replace(/\t/g, '    ')
        }
        return content;
    }


    function copyToClipboard(text, valueContainer) {
        var valueContainer = valueContainer ? valueContainer : document.body;
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            valueContainer.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                valueContainer.removeChild(textarea);
            }
        }
    }

    var projectImgType = {
        logo: 'logo.png',
        pdfCover: 'pdf_cover.jpg'
    };

    /**
     * 获取项目图片
     * @param projectId
     * @param name
     * @param extension
     * @returns {string}
     */
    function getProjectImgByType(projectId, name, extension) {
        var img = '';
        if (projectId) {
            img += projectId + '_';
        }
        img += name;
        if (extension) {
            img += '.' + extension;
        }
        return beop.constant.BEOP_IMG_HOST + beop.constant.OSS_PROJECT_IMG_PATH + img;
    }

    /**
     * 根据项目id获取项目
     * @param id
     * @returns {*}
     */
    function getProjectById(id) {
        if (!id || !AppConfig.projectList) {
            return null;
        }
        for (var i = 0; i < AppConfig.projectList.length; i++) {
            var project = AppConfig.projectList[i];
            if (project.id == id) {
                return project;
            }
        }
        return null;
    }

    return {
        setRelativePosition: setRelativePosition,
        getProjectImgPath: getProjectImgPath,
        getFunctionName: getFunctionName,
        isUndefined: isUndefined,
        getCookie: getCookie,
        getProjectFromAppConfig: getProjectFromAppConfig,
        logicContentHandle: logicContentHandle,
        copyToClipboard: copyToClipboard,
        getProjectImgByType: getProjectImgByType,
        getProjectById: getProjectById,
        projectImgType: projectImgType
    }
})();


(function () {
    var beop_tmpl_cache = {};

    this.beopTmpl = function tmpl(str, data, htmlStr) {
        var fn = !/\W/.test(str) ?
            beop_tmpl_cache[str] = beop_tmpl_cache[str] ||
                tmpl(htmlStr ? htmlStr : document.getElementById(str).innerHTML) :

            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                "with(obj){p.push('" +

                str
                    .replace(/[\r\t\n]/g, " ")
                    .split(/<!/).join("\t")
                    .replace(/((^|!>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)!>/g, "',$1,'")
                    .split("\t").join("');")
                    .split(/!>/).join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        return data ? fn(data) : fn;
    };
})();


/* 页面折叠效果 start */
var SidebarMenuEffect = (function () {
    function SidebarMenuEffect() {
    }

    SidebarMenuEffect.prototype.init = function (center, left, right) {
        var _this = this;
        this.$paneCt = $(center);
        this.$leftBtn = $(center).find('#leftCt');
        this.$rightBtn = $(center).find('#rightCt');

        var container = document.getElementById('st-container'),
            buttons = Array.prototype.slice.call(document.querySelectorAll('.sideTrans')),
            refresh = function () {
                var leftCol = 0, rightCol = 0, centerCol = 0;
                var leftArrow = '<span class="glyphicon glyphicon-chevron-left"></span>';
                var rightArrow = '<span class="glyphicon glyphicon-chevron-right"></span>';
                if (_this.$leftBtn.length > 0) {
                    if (container.className.indexOf('st-effect-7') > 0) {
                        var prev = _this.$paneCt.prev('div')[0];
                        if (prev && prev.className.indexOf('col-') > -1) {
                            leftCol = parseInt(prev.classList[0].split('-')[2]);
                        } else {
                            leftCol = 0;
                        }
                        _this.$leftBtn.removeClass('leftCtClose').addClass('leftCtOpen').html(leftArrow);
                    } else {
                        leftCol = 0;
                        _this.$leftBtn.removeClass('leftCtOpen').addClass('leftCtClose').html(rightArrow);
                    }
                }
                if (_this.$rightBtn.length > 0) {
                    if (container.className.indexOf('st-effect-1') > 0) {
                        var next = _this.$paneCt.next('div')[0];
                        if (next && next.className.indexOf('col-') > -1) {
                            rightCol = parseInt(next.classList[0].split('-')[2]);
                        } else {
                            rightCol = 0;
                        }
                        _this.$rightBtn.removeClass('rightCtClose').addClass('rightCtOpen').html(rightArrow);
                    } else {
                        rightCol = 0;
                        _this.$rightBtn.removeClass('rightCtOpen').addClass('rightCtClose').html(leftArrow);
                    }
                }

                centerCol = 12 - leftCol - rightCol;
                _this.$paneCt.removeClass().addClass('col-sm-' + centerCol + ' st-content');
            };

        buttons.forEach(function (el, i) {
            var effect = el.getAttribute('data-effect');

            el.addEventListener('click', function (ev) {
                var target = ev.target.getAttribute('data-effect') != null ? ev.target.getAttribute('data-effect') : ev.target.parentNode.getAttribute('data-effect');
                var stCtClass = document.getElementById('st-container').className;
                if (stCtClass.indexOf(target) < 0) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    container.classList.add(effect);
                    setTimeout(function () {
                        if ($(container.children[0]).children('div').length == 3) {
                            container.classList.add('st-menu-open');
                        }
                        refresh();
                    }, 250);
                } else {
                    container.classList.remove(target);
                    refresh();
                }
            });
        });
    };
    return SidebarMenuEffect;
})();
/* 页面折叠效果 end */

/* 检测浏览器及系统信息 start*/
(function (window) {
    {
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen.width) {
            var width = (screen.width) ? screen.width : '';
            var height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        //browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // core version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            {s: 'Windows 3.11', r: /Win16/},
            {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
            {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
            {s: 'Windows 98', r: /(Windows 98|Win98)/},
            {s: 'Windows CE', r: /Windows CE/},
            {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
            {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
            {s: 'Windows Server 2003', r: /Windows NT 5.2/},
            {s: 'Windows Vista', r: /Windows NT 6.0/},
            {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
            {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
            {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
            {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s: 'Windows ME', r: /Windows ME/},
            {s: 'Android', r: /Android/},
            {s: 'Open BSD', r: /OpenBSD/},
            {s: 'Sun OS', r: /SunOS/},
            {s: 'Linux', r: /(Linux|X11)/},
            {s: 'iOS', r: /(iPhone|iPad|iPod)/},
            {s: 'Mac OS X', r: /Mac OS X/},
            {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s: 'QNX', r: /QNX/},
            {s: 'UNIX', r: /UNIX/},
            {s: 'BeOS', r: /BeOS/},
            {s: 'OS/2', r: /OS\/2/},
            {s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }
    }

    window.jscd = {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled
    };
}(this));

/* 检测浏览器及系统信息 end*/

/* 获取 URL 参数 */
var getUrlParams = function () {
    var search = window.location.search.substring(1);
    var kvArr = search.split('&');
    var rs = {};

    kvArr.forEach(function (kv) {
        var arr = kv.split('=');
        if (typeof arr[1] !== 'undefined') {
            rs[arr[0]] = arr[1];
        }
    });

    return rs;
};

/**
 * 将表单内容提出成Object
 * @returns {{}}
 */
$.fn.serializeObject = function () {
    var obj = {};
    this.serializeArray().map(function (item) {
        if (/\[\]$/.test(item.name)) {
            if (obj[item.name]) {
                obj[item.name].push(item.value);
            } else {
                obj[item.name] = [item.value];
            }
        } else {
            obj[item.name] = item.value;
        }

    });
    return obj;
};

/**
 * 数字分隔符
 * num: 被分隔的数据
 * n: 保留小数位数的个数, n可选, 缺省时默认为0
 * 如: kIntSeparate(2000,2) ==> 2000.00
 */
function kIntSeparate(num, n) {
    var number = num.toFixed(n ? n : 0);
    var source = String(number).split(".");
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
    return source.join(".");
}

/*
 * 时间格式转换
 */
function timeFormatChange(format, type) {
    var lastStr = '';
    //处理'yyyy-mm-dd hh:ii:00' start
    var formatObj = (function (formatStr) {
        if (!formatStr || typeof formatStr == 'object') {
            return;
        }
        var reg = /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
        var separators = formatStr.replace(reg, '\0').split('\0');
        var parts = formatStr.match(reg);
        if (!separators || !separators.length || !parts || parts.length == 0) {
            return;
        }
        return {separators: separators, parts: parts};
    })(format);
    if (formatObj) {
        format = '';
        for (var i = 0, len = formatObj.separators.length - 1; i < len; i++) {
            format += formatObj.separators[i] + formatObj.parts[i];
        }
        lastStr = formatObj.separators[len];
    }
    //处理'yyyy-mm-dd hh:ii:00' end;

    var formatArr = ['yyyy-mm-dd hh:ii:ss', 'yyyy-mm-dd hh:ii', 'yyyy-mm-dd hh', 'yyyy-mm-dd', 'yyyy-mm', 'mm-dd hh:ii:ss', 'mm-dd hh:ii', 'mm-dd hh', 'mm-dd'];
    var formatChangeArr = [
        ['yyyy-mm-dd hh:ii:ss', 'yyyy-mm-dd hh:ii', 'yyyy-mm-dd hh', 'yyyy-mm-dd', 'yyyy-mm', 'mm-dd hh:ii:ss', 'mm-dd hh:ii', 'mm-dd hh', 'mm-dd'],
        ['M d, yyyy hh:ii:ss', 'M d, yyyy hh:ii', 'M d, yyyy hh', 'M d, yyyy', 'M, yyyy', 'M d hh:ii:ss', 'M d hh:ii', 'M d hh', 'M d'],
        ['dd/mm/yyyy hh:ii:ss', 'dd/mm/yyyy hh:ii', 'dd/mm/yyyy hh', 'dd/mm/yyyy', 'mm/yyyy', 'dd/mm hh:ii:ss', 'dd/mm hh:ii', 'dd/mm hh', 'dd/mm']
    ];
    if (formatArr.findIndex) {
        var index = formatArr.findIndex(function (v) {
            return v === format;
        });
    } else {
        for (var i = 0; i < formatArr.length; i++) {
            if (formatArr[i] === format) {
                var index = i;
                break;
            }
        }
    }
    type = Number(type);
    type && (type >= formatChangeArr.length) && (type = formatChangeArr.length - 1);
    if (index == -1) {
        console.log('format is not defined');
        return format + lastStr;
    } else {
        if (type === 0) {
            return formatChangeArr[0][index] + lastStr;
        }
        return formatChangeArr[type || AppConfig.projectTimeFormat || 0][index] + lastStr;
    }
}
/*
 * 时间格式化
 */
function timeFormat(time, format, language, option) {
    var date, arr, arr2;
    var sort = function (year, month, day, time) {
        year = year == undefined ? '2001' : year;
        month = month == undefined ? '01' : month;
        day = day == undefined ? '01' : day;
        time = time == undefined ? '' : (' ' + time);
        return new Date(year + '/' + month + '/' + day + time);
    }
    if (time instanceof Date) {
        date = time;
    } else if (typeof (time) == 'string') {
        if (/^\d{1,2}-\d{1,2}/.test(time)) {
            arr = time.split(' ');
            arr2 = arr[0].split('-');
            time = arr2[1] + '-' + arr2[0] + (arr2[2] == undefined ? '' : ('-' + arr2[2])) + (arr[1] == undefined ? '' : (' ' + arr[1]));
        }

        time = time.replace(/-/g, "/");
        arr = time.split(' ');
        arr2 = arr[0].split('/');

        if (/^\d{4}/.test(time)) {
            date = sort(arr2[0], arr2[1], arr2[2], arr[1]);
        } else if (/^\d{1,2}\/\d{4}/.test(time)) {
            date = sort(arr2[1], arr2[0], '01', arr[1]);
        } else if (/^\d{1,2}\/\d{1,2}/.test(time)) {
            date = sort(arr2[2], arr2[1], arr2[0], arr[1]);
        } else {
            date = new Date(time);
        }
    } else {
        date = new Date(time);
    }
    return date.timeFormat(format, language, option);
}

/**
 * 根据时间数组，返回格式化后的时间数组
 * @param  {Array} timeShaft 原时间数组
 * @return {Array} 格式化后的时间数组
 */
(function (exports) {
    var MINITE_1 = 60000; // 60*1000
    var MINITE_5 = 300000; // 5*60*1000
    var HOUR_1 = 3600000; // 60*60*1000
    var DAY_1 = 86400000; // 24*60*60*1000
    var DAY_365 = 31536000000; // 365*24*60*60*1000

    function _formatTimeStr(str, format) {
        var arr = str.split(' ');
        var date = arr[0].split('-');
        var time = arr[1].split(':');

        return format.replace('yyyy', date[0])
            .replace('MM', date[1])
            .replace('dd', date[2])
            .replace('HH', time[0])
            .replace('mm', time[1])
            .replace('ss', time[2]);
    }

    function _explainPattern(timeShaft) {
        // 开始时间
        var startTime = new Date(timeShaft[0]);
        // 结束时间
        var endTime = new Date(timeShaft[timeShaft.length - 1]);
        // 时间跨度
        var timeRange = endTime.valueOf() - startTime.valueOf();
        // 相邻时间的间隔
        var timeInterval = timeRange / (timeShaft.length - 1);
        // 默认的时间格式
        var pattern = 'MM-dd HH:mm';

        // m1 m5
        if (timeInterval <= MINITE_5) {
            if (timeRange <= HOUR_1) {
                pattern = 'HH:mm';
            } else if (timeRange <= DAY_1) {
                pattern = 'HH:mm';
            }
        }
        // h1
        else if (timeInterval <= HOUR_1) {
            if (timeRange <= DAY_1) {
                pattern = 'HH:mm';
            } else {
                pattern = 'MM-dd HH:mm';
            }
        }
        // d1
        else if (timeInterval <= DAY_1) {
            if (timeRange <= DAY_365) {
                pattern = 'MM-dd';
            } else {
                pattern = 'yyyy-MM-dd';
            }
        }
        // M1
        else {
            pattern = 'yyyy-MM';
        }

        return pattern;
    }

    function _explain(timeShaft) {
        pattern = getPattern(timeShaft);

        if (pattern) {
            timeShaft = timeShaft.map(function (row) {
                return _formatTimeStr(row, pattern);
            });
        }

        return timeShaft;
    }

    function _valid(params) {
        var flag = Object.prototype.toString.call(params) === '[object Array]';

        return flag && /^[\d-]{10} [\d:]{8}$/.test(params[0]);
    }

    var _getTimePattern = function (timeShaft) {
        if (!_valid(timeShaft)) {
            return;
        }

        // 如果为空或只有 1 个时间，则直接返回，不做处理
        if (timeShaft.length <= 1) {
            return;
        }

        return _explainPattern(timeShaft);
    };

    var formatTimeShaft = exports.formatTimeShaft = function (timeShaft) {
        if (!_valid(timeShaft)) {
            console.warn('function arguments is not a valid time shaft array!');
            return timeShaft;
        }

        // 如果为空或只有 1 个时间，则直接返回，不做处理
        if (timeShaft.length <= 1) {
            return timeShaft;
        }

        return _explain(timeShaft);
    };

    function _formatTimeStrByAppConfig(data) {
        var formatArr, formatStr, regularArr, language, formatObj;
        switch (AppConfig.projectTimeFormat || 0) {
            case 0:
                formatArr = ['yyyy-mm-dd'];
                regularArr = [/^[\d-]{10}$/];
                language = 'en';
                break;
            case 1:
                formatArr = ['M d, yyyy', 'M d hh:ii', 'M, yyyy', 'M, yyyy', 'M d'];
                regularArr = [/^[\d-]{10}$/, /^[\d-]{5} [\d:]{5}$/, /^[\d-]{7}$/, /^[\d-]{6}$/, /^[\d-]{5}$/];
                language = 'en';
                break;
            case 2:
                formatArr = ['dd/mm/yyyy', 'dd/mm hh:ii', 'mm/yyyy', 'mm/yyyy', 'dd/mm'];
                regularArr = [/^[\d-]{10}$/, /^[\d-]{5} [\d:]{5}$/, /^[\d-]{7}$/, /^[\d-]{6}$/, /^[\d-]{5}$/];
                language = 'en';
                break;
            default:
                formatArr = ['yyyy-mm-dd'];
                regularArr = [/^[\d-]{10}$/];
                language = 'en';
        }

        for (var i = 0, len = regularArr.length; i < len; i++) {
            if (regularArr[i].test(data)) {
                formatStr = formatArr[i];
                break;
            }
        }
        if (formatStr) {
            formatObj = (function _parseFormat(formatStr) {
                var reg = /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
                var separators = formatStr.replace(reg, '\0').split('\0');
                var parts = formatStr.match(reg);
                if (!separators || !separators.length || !parts || parts.length == 0) {
                    throw new Error("Invalid date format.");
                }
                return {separators: separators, parts: parts};
            })(formatStr);
            return {
                formatStr: formatStr,
                language: language,
                formatObj: formatObj
            };
        } else {
            return;
        }
    }

    // echarts 扩展
    if (window.echarts) {
        echarts.registerPreprocessor(function (option) {
            var pattern;
            var formatInfo, firstValue;

            if (option.formatTime === false) {
                pattern = _getTimePattern(option.xAxis[0].data);
                echarts.formatTimePattern = pattern;
                return;
            }

            if (option.xAxis && option.xAxis.length) {
                option.xAxis.forEach(function (row) {
                    if (row.data && row.data.length) {
                        pattern = _getTimePattern(row.data);
                        formatInfo = _formatTimeStrByAppConfig(row.data[0]);
                        //row.axisLabel = row.axisLabel || {};
                        if (pattern) {
                            row.data = row.data.map(function (row) {
                                return row.substr(0, 16);
                            });
                            firstValue = _formatTimeStr(row.data[0], pattern);
                            formatInfo = _formatTimeStrByAppConfig(firstValue);
                            if (formatInfo) {
                                //row.axisLabel.formatter = function (value) {
                                //    return timeFormat(value, formatInfo.formatObj, formatInfo.language);
                                //};
                                row.data = row.data.map(function (it, i) {
                                    return timeFormat(it, formatInfo.formatObj, formatInfo.language);
                                });
                            } else {
                                //row.axisLabel.formatter = function (value) {
                                //    return _formatTimeStr(value, pattern);
                                //};
                                row.data = row.data.map(function (it, i) {
                                    return _formatTimeStr(it, pattern);
                                });
                            }
                        } else if (formatInfo) {
                            //row.axisLabel.formatter = function (value) {
                            //    return timeFormat(value, formatInfo.formatObj, formatInfo.language);
                            //};
                            row.data = row.data.map(function (it, i) {
                                return timeFormat(it, formatInfo.formatObj, formatInfo.language);
                            });
                        }
                    }
                });
            }
        });
    }

}(window));

var generateTimeOption = function (option) {
    var timeConfig = clone(option);
    (!timeConfig.timeStart) && (timeConfig.timeStart = timeConfig.startTime);
    (!timeConfig.timeEnd) && (timeConfig.timeEnd = timeConfig.endTime);
    (!timeConfig.timeFormat) && (timeConfig.timeFormat = timeConfig.format);
    var recentTime = {};
    var now = new Date();
    if (typeof option == 'string') {
        recentTime = generateRecentTime(option)
    } else if (option && option.timeRecent) {
        if (typeof option.timeRecent == 'string') {
            recentTime = generateRecentTime(option.timeRecent)
        } else if (option.timeRecent.hasOwnProperty('unit') && option.timeRecent.hasOwnProperty('val')) {
            recentTime = generateRecentTimeCustom(option.timeRecent)
        }
    }
    if (recentTime && Object.keys(recentTime).length > 0) {
        timeConfig.timeStart = recentTime.timeStart;
        timeConfig.timeEnd = recentTime.timeEnd;
        if (recentTime.format) {
            timeConfig.timeFormat = recentTime.format;
        }
        switch (timeConfig.timeFormat) {
            case 'h1':
                timeConfig.timeEnd = new Date(recentTime.timeEnd).format('yyyy-MM-dd HH:00:00');
                timeConfig.timeStart = new Date(recentTime.timeStart).format('yyyy-MM-dd HH:00:00');
                break;
            case 'd1':
                timeConfig.timeEnd = new Date(recentTime.timeEnd).format('yyyy-MM-dd 00:00:00');
                timeConfig.timeStart = new Date(recentTime.timeStart).format('yyyy-MM-dd 00:00:00');
                break;
            case 'M1':
                timeConfig.timeEnd = new Date(recentTime.timeEnd).format('yyyy-MM-01 00:00:00');
                timeConfig.timeStart = new Date(recentTime.timeStart).format('yyyy-MM-01 00:00:00');
                break;
        }
    }

    timeConfig.startTime = timeConfig.timeStart;
    timeConfig.endTime = timeConfig.timeEnd;
    timeConfig.format = timeConfig.timeFormat;
    return timeConfig;


    function generateRecentTime(time) {
        var startTime, endTime, format;
        switch (time) {
            case 'today':
                endTime = now.format('yyyy-MM-dd HH:mm:ss');
                startTime = new Date(now - 86400000).format('yyyy-MM-dd HH:mm:ss');
                format = 'h1';
                break;
            case 'threeDay':
                endTime = now.format('yyyy-MM-dd HH:00:00');
                startTime = new Date(now - 259200000).format('yyyy-MM-dd HH:mm:ss');
                format = 'h1';
                break;
            case 'yesterday':
                endTime = new Date(new Date().setDate(now.getDate() - 1)).format('yyyy-MM-dd HH:mm:ss');
                startTime = new Date(new Date().setDate(now.getDate() - 2)).format('yyyy-MM-dd HH:mm:ss');
                format = 'h1';
                break;
            case 'thisWeek':
                endTime = now.format('yyyy-MM-dd 00:00:00');
                startTime = new Date(now - 604800000).format('yyyy-MM-dd HH:mm:ss');
                format = 'd1';
                break;
            case 'lastWeek':
                endTime = new Date(now - (now.getDay() + 1) * 86400000).format('yyyy-MM-dd HH:mm:ss');
                startTime = new Date(now - (now.getDay() + 7) * 86400000).format('yyyy-MM-dd HH:mm:ss');
                format = 'd1';
                break;
            case 'thisYear':
                endTime = new Date(now - (now.getDay() + 1) * 86400000).format('yyyy-MM-dd HH:mm:ss');
                startTime = new Date(now - (now.getDay() + 7) * 86400000).format('yyyy-MM-dd HH:mm:ss');
                format = 'M1';
                break;
        }
        return {
            timeStart: startTime,
            timeEnd: endTime,
            format: format
        }
    }

    function generateRecentTimeCustom(time) {
        var startTime, endTime, format;
        switch (time.unit) {
            case 'hour':
                endTime = now.format('yyyy-MM-dd HH:mm:ss');
                startTime = new Date(now - 3600000 * time.val).format('yyyy-MM-dd HH:mm:ss');
                break;
            case 'day':
                endTime = now.format('yyyy-MM-dd HH:00:00');
                startTime = new Date(now - 86400000 * time.val).format('yyyy-MM-dd HH:00:00');
                break;
            case 'month':
                endTime = now.format('yyyy-MM-dd HH:00:00');
                startTime = new Date(now - 2592000000 * time.val).format('yyyy-MM-dd HH:00:00');
                break;
        }
        return {
            timeStart: startTime,
            timeEnd: endTime
        }
    }
};
﻿var WebAPI = (function () {
    //百度统计 置入代码
    var siteId;
    switch (window.location.hostname) {
        case 'beop.rnbtech.com.hk':
            siteId = 'b79c068f77198848e22fe79758836e53';
            break;
        case 'beop6.rnbtech.com.hk':
            siteId = 'f1f6b2b9e6b64592c0b4cb5e9b8bd79e';
            break;
        case 'beopdemo.rnbtech.com.hk':
            siteId = 'ac0df98f274d9a5980a571297248d80b';
            break;
        default:
            break;
    }

    (function () {
        if (siteId) {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?" + siteId;
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        }
    })();


    var mockList = {
        // /analysis/workspace/saveLayout/<userId>/<isTemplate>
        '/static/mock/analysis_workspace_saveLayout.json': /\/analysis\/workspace\/saveLayout\/\d+\/[01]/i,
        // /analysis/template/get/<userId>
        '/static/mock/analysis_template_get.json': /\/analysis\/template\/get\/\d+/i
    };

    function mock(url) {
        var match = null;
        for (var i in mockList) {
            match = url.match(mockList[i]);
            if (match !== null) return i;
        }
        return url;
    }

    function requestFailHandle(result) {
        if (result && result.status == 401) {
            alert(i18n_resource.error.noPermission);
        }
    }

    function WebAPI() {
    }

    WebAPI.isMock = false;

    $.ajaxSetup({
        converters: {"text json": true}, //防止JQuery自动转换JSON格式
        dataFilter: function (result, type) {
            var data = result;

            if (type === 'script') {
                return data;
            } else if (typeof data === 'string') {
                if (/^\s*</.test(data)) {
                    //请求为HTML，直接返回
                    return data;
                }

                try {
                    data = JSON.parse(result);
                } catch (e) {
                    console.log('request error: ' + e + ', the data is :' + data);
                    return data;
                }
            }

            if (data) {
                if (data.error) {
                    switch (data.error) {
                        case 'token_invalid':
                        {
                            console.log(this.url + ' (' + data.error + ': code"' + data.msg + '")');
                            if(typeof LoginValidate != 'undefined'){
                                var validate = new LoginValidate();
                                validate.show();
                                return;
                            }
                            ////TODO 测试confirm
                            confirm(i18n_resource.error.token[data.msg] + '. ' + i18n_resource.error.relogin + '.', function () {
                                if(AppConfig.isMobile){
                                    location.reload();
                                }else {
                                    location.href = '/';
                                }
                            });
                            break;
                        }
                        case 'historyData':
                        {
                            console.log(this.url + ' (' + data.error + ': code"' + data.msg + '")');
                            alert(data.msg);
                            return {};
                        }
                        default:
                            break;
                    }
                }

                if (data.code == 403) {
                    console.log(this.url + ' (' + data.msg + '")');
                    alert(I18n.resource.error.noPermission);
                    return {};
                }
            }
            return data;
        }
    });

    WebAPI.post = function (url, data, isMock) {
        var mockUrl;
        isMock = isMock === undefined ? WebAPI.isMock : isMock;
        if (isMock) {
            mockUrl = mock(url);
            if (url !== mockUrl) return this.get(mockUrl, false);
        }
        if (typeof cordova != 'undefined' && AppConfig.host){
            if (url.indexOf('.html') == -1) {
                url = AppConfig.host + url;
            }else if(url[0] == '/'){
                url = url.slice(1)
            }
        }
        return $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).fail(requestFailHandle);
    };

    WebAPI.get = function (url, isMock) {
        isMock = isMock === undefined ? WebAPI.isMock : isMock;
        url = isMock ? mock(url) : url;

        if (window._hmt && url.indexOf('.html') > 0) window._hmt.push(['_trackPageview', url]);    //百度PV信息收集

        if (typeof cordova != 'undefined' && AppConfig.host){
            if (url.indexOf('.html') == -1) {
                url = AppConfig.host + url;
            }else if(url[0] == '/'){
                url = url.slice(1)
            }
        }
        return $.ajax({url: url, type: 'Get', contentType: 'application/json'}).fail(requestFailHandle);
    };

    WebAPI.getHistoryDS = function (callback) {

    };

    WebAPI.getHistory = function (callback) {

    };

    return WebAPI;
})();
/**
 * Created by win7 on 2015/7/21.
 */
    //绑定事件函数封装有2种形式
    //1.EventAdapter.on()/EventAdapter.off()
    //2.$(dom).eventOn()/$(dom).eventOff();
    //具体参数设置见以下内容

var EventAdapter = (function() {
    var eventData, eventStatus;

    function EventAdapter($) {
    }

    //兼容性事件绑定
    EventAdapter.on = function () {
        var eventTarget, eventType, eventFunction, eventSelector, eventHmt, finalFunction;
        if (arguments.length < 3 || arguments.length > 5) {
            console.log('EventAdapter.on arguments.length error');
            return;
        }
        //判断参数类型，有两个类型
        //1.（事件对象，   事件种类，事件执行函数，站长统计推送消息（可选））/
        //   (Dom Object, str,     Function，   array/str)
        //2.（事件对象，   事件种类，事件委托选择器，事件执行函数，站长统计推送消息（可选））/
        //   (Dom Object, str,     str,          Function，    array/str)
        /////////////////////////////////////////////////////////////////
        //站长统计推送消息（可选）参数设置
        //1.false/undefined/null
        //默认状态不推送统计消息
        //2.true
        //推送默认统计消息，默认推送消息信息优先级如下：
        //(1).id
        //(2).i18n
        //(3).title
        //3.string
        //可输入任意字符串或者输入，如果字符串为‘id’，‘title’等值，会尝试获取对象的这些属性值，如果获取不到，则返回这个字符串
        //如果输入字符串为‘text’，则会尝试获取对象的innerText
        //4.function
        //可输入任意函数，如
        // function(e){
        //    return $(e.currentTarget).attr(value)可以推送对象的value信息
        //}
        //5.数组
        //数组至少包含一个元素，数组第一个元素将作为粗略分类依据推送。
        //如果有的话，后面的几个元素将用‘-’相连，作为精确分裂依据推送。
        //数组元素种类和以上非数组参数种类相似
        //如['navBar']将把触发的事件标记为navBar推送
        //对于一个元素<div id='test',value="12345">南京熊猫<span>KPI统计</span></div>
        //如果绑定方式如下的话：
        //EventAdapter.on($('#test'),'click',['projSel','btnProjSel',‘南京熊猫’,'value','function(e){return $(e.currentTarget).find('span').text()}'])
        //每次点击事件后将推送信息为
        //粗分类标签：projSel
        //细分类标签：btnProjSel-南京熊猫-12345-KPI统计
        //如输出参数非以上任何一种，则和true的情况一致
        //为了一个好的分类效果，请将粗分类设置为对象所属种类，比如说ds表示数据源数据点，或者是navBar表示导航条
        //而细分类需要包裹对象进行时的project信息以及对象id等等。
        if (typeof arguments[0] != 'object') {
            console.log('EventAdapter.on arguments[0] type error');
            return;
        } else {
            //原生对象和JQ对象兼容
            if (!(arguments[0] instanceof jQuery)) {
                eventTarget = jQuery(arguments[0]);
            } else {
                eventTarget = arguments[0];
            }

        }
        if (typeof arguments[1] != 'string') {
            console.log('EventAdapter.on arguments[1] type error');
            return;
        } else {
            eventType = arguments[1];
        }
        if (typeof arguments[2] == 'function') {
            eventFunction = arguments[2];
            eventSelector = null;
            eventHmt = arguments[3]
        } else if (typeof arguments[2] == 'string') {
            if (arguments[3] && typeof arguments[3] == 'function') {
                eventSelector = arguments[2];
                eventFunction = arguments[3];
                eventHmt = arguments[4]
            } else {
                console.log('EventAdapter.on arguments[2 or 3] type error');
                return;
            }
        }
        //站长统计绑定
        finalFunction = function(e){
            if (!(eventHmt === false)) {
                EventAdapter.analyse(e,eventType, eventHmt);
            }
            eventFunction.call(this,e);
        };
        //兼容性绑定事件
        if (!AppConfig.isMobile) {
            eventTarget.on(eventType, eventSelector, finalFunction)
        } else {
            switch (eventType) {
                case 'click':
                    eventTarget.on('touchstart', eventSelector, finalFunction);
                    break;
                case 'dragstart':
                    eventTarget.on('touchstart',eventSelector,function(e){mobileDragStart.call(this,e,eventTarget,finalFunction)});
                    break;
                case 'dragover' :
                    $(document).on('touchmove.drag',eventSelector,function(e){mobileDragOver.call(this,e,eventTarget,finalFunction)});
                    break;
                case 'dragleave' :
                    $(document).on('touchmove.drag',eventSelector,function(e){mobileDragLeave.call(this,e,eventTarget,finalFunction)});
                    break;
                //case 'dragend' :
                //    mobileDragEnd(eventTarget,eventFunction);
                //    break;
                case 'drop' :
                    $(document).on('touchend.drop',eventSelector,function(e){mobileDrop.call(this,e,eventTarget,finalFunction)});
                    break;
                default :
                    eventTarget.on(eventType, eventSelector, finalFunction);
                    break;
            }
        }
        return eventTarget;
    };
    //兼容性事件解绑
    EventAdapter.off = function () {
        //参数类型
        //1.(事件对象，事件种类)/(Dom object,str)
        //2.(事件对象，事件种类，事件委托选择器)/(Dom object,str,str)
        //3.(事件对象)/(Dom Object)
        if ((arguments.length > 3 || arguments.length < 1) || (arguments[0] && typeof arguments[1] != 'string')) {
            console.log('EventAdapter.off arguments error');
            return;
        }
        var eventTarget, eventType, eventSelector;
        //原生对象和JQ对象兼容
        if (!(arguments[0] instanceof jQuery)) {
            eventTarget = jQuery(arguments[0]);
        } else {
            eventTarget = arguments[0];
        }
        if (arguments.length == 1) {
            eventTarget.off();
            return eventTarget;
        }
        if (typeof arguments[1] == 'string') {
            eventType = arguments[1]
        } else {
            console.log('EventAdapter.off eventType Error');
            return
        }
        if (typeof arguments[2] == 'string') {
            eventSelector = arguments[2];
        } else {
            eventSelector = null;
        }
        if (!AppConfig.isMobile) {
            eventTarget.off(eventType, eventSelector)
        } else {
            switch (eventType) {
                case 'click' :
                    eventTarget.off('touchstart', eventSelector);
                    break;
                case 'dragstart':
                    eventTarget.draggable('destroy');
                    break;
                case 'dragover':
                    eventTarget.droppable('destroy');
                    break;
                case 'dragleave':
                    eventTarget.droppable('destroy');
                    break;
                case 'drop':
                    eventTarget.droppable('destroy');
                    break;
                default:
                    eventTarget.off(eventType, eventSelector);
                    break;
            }
        }
        return eventTarget;
    };
    //jQuery 拓展方式事件绑定
    $.fn.extend({
        //兼容性绑定事件
        'eventOn': function () {
            var eventTarget, eventType, eventFunction, eventSelector,eventHmt,finalFunction;
            if (arguments.length < 2 || arguments.length > 4) {
                console.log('EventAdapter.on arguments.length error');
                return;
            }
            //判断参数类型，有两个类型
            //1.（事件种类，事件执行函数，站长统计推送消息（可选））/
            //   (str,     Function，   array/str)
            //2.（事件种类，事件委托选择器，事件执行函数，站长统计推送消息（可选））/
            //   (str,     str,           Function，  array/str)
            /////////////////////////////////////////////////////////////////
            //站长统计推送消息（可选）参数设置
            //1.false/undefined/null
            //默认状态不推送统计消息
            //2.true
            //推送默认统计消息，默认推送消息信息优先级如下：
            //(1).id
            //(2).i18n
            //(3).title
            //3.string
            //可输入任意字符串或者输入，如果字符串为‘id’，‘title’等值，会尝试获取对象的这些属性值，如果获取不到，则返回这个字符串
            //如果输入字符串为‘text’，则会尝试获取对象的innerText
            //4.function
            //可输入任意函数，如
            // function(e){
            //    return $(e.currentTarget).attr(value)可以推送对象的value信息
            //}
            //5.数组
            //数组至少包含一个元素，数组第一个元素将作为粗略分类依据推送。
            //如果有的话，后面的几个元素将用‘-’相连，作为精确分裂依据推送。
            //数组元素种类和以上非数组参数种类相似
            //如['navBar']将把触发的事件标记为navBar推送
            //对于一个元素<div id='test',value="12345">南京熊猫<span>KPI统计</span></div>
            //如果绑定方式如下的话：
            //$('#test').on('click',['projSel','btnProjSel',‘南京熊猫’,'value','function(e){return $(e.currentTarget).find('span').text()}'])
            //每次点击事件后将推送信息为
            //粗分类标签：projSel
            //细分类标签：btnProjSel-南京熊猫-12345-KPI统计
            //如输出参数非以上任何一种，则和true的情况一致
            //为了一个好的分类效果，请将粗分类设置为对象所属种类，比如说ds表示数据源数据点，或者是navBar表示导航条
            //而细分类需要包裹对象进行时的project信息以及对象id等等。
            if (typeof this != 'object') {
                console.log('EventAdapter.on arguments[0] type error');
                return;
            } else {
                //原生对象和JQ对象兼容
                if (!(this instanceof jQuery)) {
                    eventTarget = jQuery(arguments[0]);
                } else {
                    eventTarget = this;
                }

            }
            if (typeof arguments[0] != 'string') {
                console.log('EventAdapter.on arguments[1] type error');
                return;
            } else {
                eventType = arguments[0];
            }
            if (typeof arguments[1] == 'function') {
                eventFunction = arguments[1];
                eventSelector = null;
                eventHmt = arguments[2]
            } else if (typeof arguments[1] == 'string') {
                if (arguments[2] && typeof arguments[2] == 'function') {
                    eventSelector = arguments[1];
                    eventFunction = arguments[2];
                    eventHmt = arguments[3]
                } else {
                    console.log('EventAdapter.on arguments[2 or 3] type error');
                    return;
                }
            }
            finalFunction = function(e){
                if (!(eventHmt === false)) {
                    EventAdapter.analyse(e, eventType,eventHmt);
                }
                eventFunction.call(this,e);
            };
            //兼容性绑定事件
            if (!AppConfig.isMobile) {
                eventTarget.on(eventType, eventSelector, finalFunction)
            } else {
                switch (eventType) {
                    case 'click':
                        eventTarget.on('touchstart', eventSelector, finalFunction);
                        break;
                    case 'dragstart':
                        mobileDragStart(eventTarget, eventSelector, finalFunction);
                        break;
                    case 'dragover' :
                        mobileDragOver(eventTarget, eventSelector, finalFunction);
                        break;
                    case 'dragleave' :
                        mobileDragLeave(eventTarget, eventSelector, finalFunction);
                        break;
                    //case 'dragend' :
                    //    mobileDragEnd(eventTarget,eventFunction);
                    //    break;
                    case 'drop' :
                        mobileDrop(eventTarget, eventSelector, finalFunction);
                        break;
                    default :
                        eventTarget.on(eventType, eventSelector, finalFunction);
                        break;
                }
            }
            return eventTarget;
        },
        //兼容性解绑事件
        'eventOff': function () {
            //参数类型
            //1.(事件对象，事件种类)/(Dom object,str)
            //2.(事件对象，事件种类，事件委托选择器)/(Dom object,str,str)
            //3.无参数
            if ((arguments.length > 2) || (arguments[0] && typeof arguments[0] != 'string')) {
                console.log('EventAdapter.off arguments error');
                return;
            }
            var eventTarget, eventType, eventSelector;
            //原生对象和JQ对象兼容
            if (!(this instanceof jQuery)) {
                eventTarget = jQuery(this);
            } else {
                eventTarget = this;
            }
            if (arguments.length == 0) {
                eventTarget.off();
                return eventTarget;
            }
            if (typeof arguments[0] == 'string') {
                eventType = arguments[0];
            } else {
                console.log('EventAdapter.off eventType Error');
                return
            }
            if (typeof arguments[1] == 'string') {
                eventSelector = arguments[1];
            } else {
                eventSelector = null;
            }
            if (!AppConfig.isMobile) {
                eventTarget.off(eventType, eventSelector)
            } else {
                switch (eventType) {
                    case 'click' :
                        eventTarget.off('touchstart', eventSelector,mobileDragStart);
                        break;
                    case 'dragstart':
                        eventTarget.draggable('destroy');
                        break;
                    case 'dragover':
                        eventTarget.droppable('destroy');
                        break;
                    case 'dragleave':
                        eventTarget.droppable('destroy');
                        break;
                    case 'drop':
                        eventTarget.droppable('destroy');
                        break;
                    default:
                        eventTarget.off(eventType, eventSelector);
                        break;
                }
            }
            return eventTarget;
        }

    });

    //drag事件参数保存
    EventAdapter.setData = function (date) {
        if (date == undefined)return;
        eventData = date;
    };
    //drag事件参数获取
    EventAdapter.getData = function () {
        return eventData;
    };
    //drop事件发生后自动清空传递数据
    document.addEventListener('drop', function () {
        eventData = null;
    }, false);

    document.addEventListener('touchend', function () {
        eventData = null;
    }, false);
    //清除drag事件以免内存溢出
    EventAdapter.clearEvent = function(){
        $(document).off('touchmove.copy');
        $(document).off('touchmove.drag');
        $(document).off('touchend.drop');
    };
    //各事件触发次数站长统计
    EventAdapter.analyse = function (e,eventType, hmtInfo) {
        var mainInfo = '', initArrTag , finalArrTag, tag, unitTag;
        var target = $(e.currentTarget);

        if (hmtInfo instanceof Array && hmtInfo[0]){
            mainInfo = judgeWay(hmtInfo[0]);
            initArrTag = hmtInfo.filter(function(ele,index){
                return index > 0 && ele != '';
            });
            finalArrTag = [];
            for (var i = 0 ; i < initArrTag.length;i++){
                unitTag = judgeWay(initArrTag[i]);
                if (unitTag == '' )continue;
                finalArrTag.push(unitTag)
            }
            tag = finalArrTag.join('-');
        }else {
            if(hmtInfo != undefined) {
                mainInfo = judgeWay(hmtInfo);
            }else{
                mainInfo = getInfo(target);
            }
            mainInfo = mainInfo ? mainInfo : '';
            tag = mainInfo;
        }
        _hmt.push(['_trackEvent', mainInfo.substr(0,30), eventType,'user-' + (AppConfig.userId?AppConfig.userId:0) +'/project-'+(AppConfig.projectId?AppConfig.projectId:0)]);
        //console.log('mainInfo:'+mainInfo);
        //console.log('tag:'+tag);
        function getInfo(tar){
            if (tar.length == 0)return;
            var tarInfo;
            if (tar.attr('id')){
                tarInfo = tar.attr('id');
            }else if (tar.attr('i18n')){
                tarInfo = tar.attr('i18n');
            }else if(tar.attr('title')){
                tarInfo = tar.attr('title');
            }else{
                tarInfo = tar[0].innerText.replace(/^\s\s*/, '').replace(/\s\s*$/, '').substr(0,30);
            }
            return tarInfo;
        }
        function judgeWay(arg){
            if (typeof arg == 'undefined'){
                return '';
            }
            if (arg instanceof Function){
                return arg.call(this,e)
            }else if(typeof arg == 'string'){
                if(arg == 'text'){
                    return e.currentTarget.innerText.replace(/^\s\s*/, '').replace(/\s\s*$/, '').substr(0,30)
                }else{
                    return $(e.currentTarget).attr(arg)?$(e.currentTarget).attr(arg):arg;
                }
            }else if(typeof arg == 'number'){
                return arg;
            }
        }
    };

    ////移动端事件绑定
    //var mobileDragStart = function(source,eventSelector,eventFunction){
    //    //事件委托判断
    //    var handle = eventSelector?$(eventSelector):false;
    //    var mouseLeft = source[0].offsetWidth / 2;
    //    var mouseTop = source[0].offsetHeight / 2;
    //    source.draggable({
    //        start:eventFunction,
    //        addClasses:false,
    //        helper:'clone',
    //        appendTo:'body',
    //        zIndex:210000,
    //        revert:true,
    //        opacity:0.5,
    //        cursorAt: {
    //            left: mouseLeft,
    //            top: mouseTop
    //        },
    //        handle:handle
    //    })
    //};
    //
    //var mobileDragOver = function(target,eventSelector,eventFunction){
    //    target.droppable({
    //        over:eventFunction
    //    })
    //};
    //
    //var mobileDragLeave = function(target,eventSelector,eventFunction){
    //    target.droppable({
    //        out:eventFunction
    //    })
    //};
    //
    //var mobileDrop = function(target,eventSelector,eventFunction){
    //    target.droppable({
    //        greedy:true,
    //        drop:eventFunction
    //    });
    //    eventData = null;
    //};
    var mobileDragStart = function(e,target,eventFunction){
        //e.preventDefault();
        var originalTarget = $(e.target).closest('[draggable="true"]')[0];
        var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
        startPos = {
            left: $(originalTarget).css('left'),
            top: $(originalTarget).css('top'),
            zIndex: $(originalTarget).css('z-index')
        },
        disX = originalTarget.offsetWidth / 2,
        disY = originalTarget.offsetHeight / 2;
        var $copyTarget = $(originalTarget).clone();
        $copyTarget.data('startPos', startPos);
        $copyTarget.css('z-index',10000);
        $copyTarget.css('position','absolute');
        $copyTarget.css('opacity','0.5');
        $copyTarget.css('pointer-events','none');
        var $container = $('body');
        $container.append($copyTarget);
        var sPos = $(originalTarget)[0].getBoundingClientRect();
        $copyTarget.css('left',sPos.left - $container[0].offsetLeft + 'px');
        $copyTarget.css('top',sPos.top - $container[0].offsetTop + 'px');
        $copyTarget[0].cssText = originalTarget.cssText;
        $copyTarget.css('width',originalTarget.offsetWidth);
        $copyTarget.css('height',originalTarget.offsetHeight);
        //originalTarget.parentNode.appendChild($copyTarget[0]);
        eventStatus = 'dragStart';
        eventFunction.call(this, ev);
        $(document).off('touchend.copy').on('touchend.copy',function(e){
            $copyTarget.remove();
            eventStatus = 'dragEnd';
        });
        $(document).on('touchmove.copy',function(e) {
            //e.preventDefault();
            eventStatus = 'dragMove';
            var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
            var $parent = $copyTarget.offsetParent();
            $parent = $parent.is(':root') ? $(window) : $parent;
            //var pPos = $parent.offset();
            //pPos = pPos ? pPos:{left:0,top:0};
            var targetLeft = ev.pageX - disX;
            var targetTop = ev.pageY - disY;
            //r = $parent.width() - $this.outerWidth(true);
            //d = $parent.height() - $this.outerHeight(true);

            //targetLeft = targetLeft < 0 ? 0 : targetLeft > r ? r : targetLeft;
            //targetTop = targetTop < 0 ? 0 : targetTop > d ? d : targetTop;

            $copyTarget.css({
                left: targetLeft + 'px',
                top: targetTop + 'px',
                'z-index': 10000
            });
        })

    };

    var mobileDragOver = function(e,target,eventFunction){
        if (eventStatus !='dragMove' && eventStatus !='dragMoveIn' && eventStatus !='dragMoveOut') return;
        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
        var targetWidth,targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if ((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY)) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventStatus ='dragMoveIn';
                eventFunction.call(this, e);
                break;
            }
        }
    };

    var mobileDragLeave = function(e,target,eventFunction){
        if (eventStatus !='dragMoveIn') return;
        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
        var targetWidth,targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if (!((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY))) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventStatus ='dragMoveOut';
                eventFunction.call(this, e);
            }
        }
    };

    var mobileDragEnd = function(e,target,eventFunction){
        eventFunction.call(this, e);
    };

    var mobileDrop = function(e,target,eventFunction){
        if (eventStatus !='dragMove' && eventStatus !='dragMoveIn')return;
        //e.stopImmediatePropagation();
        //var ev = e.originalEvent.changedTouches[0];
        var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
        var eventTarget = target;
        var targetWidth,targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if ((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY)) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventFunction.call(this, e);
                break;
            }
        }
    };
    //var mobileDropLocate = function(e,target,eventFunction){
    //    dropTarget = e.originalEvent.relatedTarget;
    //};

    return EventAdapter;
})(jQuery);
/** 对象 diff 方法 */
/**
 * 四种差异类型：
 * 新增 - N
 * 删除 - D
 * 修改 - E
 * 数组变动 - A
 */
(function () {

    var class2type = {};
    ['Boolean', 'Number', 'String', 'Array', 'Function', 'Object', 'Date', 'RegExp', 'Error'].forEach(function (type) {
        class2type['[object ' + type + ']'] = type.toLowerCase();
    });

    function Diff(kind, path) {
        this.kind = kind;
        this.path = path || [];
    };

    /** 差异类型 - 新增 */
    function DiffNew(path, value) {
        Diff.call(this, 'N', path);
        this.rhs = value;
    };

    /** 差异类型 - 删除 */
    function DiffDelete(path, value) {
        Diff.call(this, 'D', path);
        this.lhs = value;
    };

    /** 差异类型 - 修改 */
    function DiffEdit(path, origin, value) {
        Diff.call(this, 'E', path);
        this.lhs = origin;
        this.rhs = value;
    };

    /** 差异类型 - 数组变动 */
    function DiffArray(path, index, item) {
        Diff.call(this, 'A', path);
        this.index = index;
        this.item = item;
    };

    function realTypeOf(subject) {
        // 处理 null 和 undefined
        if(subject == null) {
            return subject + '';
        }

        var type = Object.prototype.toString.call(subject);
        return class2type[type] || 'object';
    }

    function deepDiff(lhs, rhs, changes, process, path, key) {
        var currentPath;
        var ltype, rtype;
        var lkeys, rkeys;
        var rs;

        path = path || [];
        currentPath = path.slice(0);
        if (typeof key !== 'undefined') {
            currentPath.push(key);
        }

        if (typeof process === 'function') {
            rs = process(lhs, rhs, currentPath);
            if (rs === true) {
                changes(new DiffEdit(currentPath, lhs, rhs));
                return;
            } else if (rs === false) {
                return;
            }
        }

        ltype = realTypeOf(lhs);
        rtype = realTypeOf(rhs);
        if (ltype === 'undefined') {
            if (rtype !== 'undefined') {
                changes(new DiffNew(currentPath, rhs));
            }
        } else if (rtype === 'undefined') {
            changes(new DiffDelete(currentPath, lhs));
        } else if (ltype !== rtype){
            changes(new DiffEdit(currentPath, lhs, rhs));
        } else if (ltype === 'object') {
            lkeys = Object.keys(lhs);
            rkeys = Object.keys(rhs);

            lkeys.forEach(function (k) {
                var other = rkeys.indexOf(k);
                if (other >= 0) {
                    deepDiff(lhs[k], rhs[k], changes, process, currentPath, k);
                    rkeys.splice(rkeys.indexOf(k), 1);
                } else {
                    deepDiff(lhs[k], undefined, changes, process, currentPath, k);
                }
            });

            rkeys.forEach(function (k) {
                deepDiff(undefined, rhs[k], changes, process, currentPath, k);
            });
        } else if (ltype === 'array') {
            for (var i = 0, len = lhs.length; i < len; i++) {
                if (i >= rhs.length) {
                    changes(new DiffArray(currentPath, i, new DiffDelete(undefined, lhs[i])));
                } else {
                    deepDiff(lhs[i], rhs[i], changes, process, currentPath, i);
                }
            }

            while(i < rhs.length) {
                changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i++])));
            }

        } else if (lhs !== rhs) {
            changes(new DiffEdit(currentPath, lhs, rhs));
        }
    };

    function diff(lhs, rhs, process, format, accum) {
        var accum = accum || [];
        deepDiff(lhs, rhs, function (d) {
            if (d) {
                typeof format === 'function' && format(d);
                accum.push(d);
            }
        }, process);
        return accum.length ? accum : null;
    };

    window.diff = diff;
}.call(this));
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
}(namespace('beop.util'), function (exports) {

    exports.MergeDiff = (function () {

        /** 将最终输出结果格式化成想要的方式 */
        function mergeGroup(id, group) {
            var rs = {
                _id: id,
                v: {},
                k: 'E'
            };
            var newDiff = null;

            // 合并所有编辑类的操作
            group.forEach(function (d) {
                var len = d.path.length;
                var kv = {};

                // 如果在这里发现有对象级别的操作，则说明随着业务逻辑的扩展，有一些新的情况没有被考虑到
                if (d.length === 1) {
                    Log.warn('root object \"' + d.path[0] + '" has an unexpected operation that has not been considered, we will ignore it.');
                    return;
                }

                // 属性的新增操作
                if (d.kind === 'N') {
                    // 将此新增操作合并到编辑操作中
                    if (len === 2) {
                        rs.v[d.path[1]] = d.rhs;
                    } else {
                        Log.warn('property "' + d.path.join('.') + '" is a object, expect not a object, will ignore it and do not upload to the server.');
                    }
                }
                // 编辑操作
                else if (d.kind === 'E') {
                    // 合并编辑操作
                    if (len === 2) {
                        rs._id = d.path[0];
                        kv[d.path[1]] = d.rhs;
                        rs.v = $.extend(false, rs.v, kv);
                    } else {
                        Log.warn('property "' + d.path.join('.') + '" is a object, expect not a object, will ignore it and do not upload to the server.');
                    }
                }
                // 删除操作
                else if (d.kind === 'D') {
                    // 将此删除操作合并到编辑操作中
                    if (len === 2) {
                        if (rs.v.hasOwnProperty(d.path[1])) {
                            delete rs.v[d.path[1]];
                        }
                    } else {
                        Log.warn('property "' + d.path.join('.') + '" is a object, expect not a object, will ignore it and do not upload to the server.');
                    }
                } else {
                    Log.warn('there shouldn\'t have any type except \'N\', \'E\' or \'D\' in the group diffs, unusual type: ' + d.kind);
                }
            });

            return rs;
        }

        return function (diffs) {
            // 先按照 _id 进行分类
            var map = {};
            var rs = [];

            // 转换成 map
            diffs.forEach(function (d) {
                var id = d.path[0];
                map[id] = map[id] || [];

                // 若操作为对象层级的操作，则后续所有操作均被忽略
                if (map[id].length === 1 && map[id][0].path.length === 1) return;
                
                // 若为对象层级的操作，则覆盖所有其他操作
                if (d.path.length === 1) {
                    map[id] = [d];
                    return;
                }

                map[id].push(d);
            }, this);

            // 格式化和合并
            for (var id in map) {
                if (!map.hasOwnProperty(id)) continue;

                // 若为对象层级的操作，则跳过进一步的合并操作
                if (map[id].length === 1 && map[id][0].path.length === 1) {
                    // 格式化对象
                    if (map[id][0].kind === 'D') {
                        rs.push({
                            k: 'D',
                            _id: map[id][0].lhs['_id']
                        });
                    } else if (map[id][0].kind === 'N') {
                        rs.push({
                            k: 'N',
                            v: map[id][0].rhs
                        });
                    }
                    continue;   
                }
                // 能走到这一步的，说明都是属性级别的操作，对象层级的操作在这之前已经全部过滤掉了
                rs.push( mergeGroup(id, map[id]) );
            }

            return rs;
        }
    } ());
}));
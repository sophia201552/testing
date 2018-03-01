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
            if (!options.boxType){
                try{
                    options.boxType = (this.constructor.toString().match(/function (.+?)\(/)||[,''])[1];
                }catch(e){
                    options.boxType = '';
                }
            }
            return options;
        },
        _show: function () {
            this.$el.fadeIn('fast');
            I18n.fillArea && I18n.fillArea(this.$el);
            var $btn = this.$el.find('[i18n]');
            //兼容没做国际化的页面
            $btn.each(function (i, item) {
                var arr = ['OK', 'Cancel'];
                var $item = $(item);
                if (I18n.getI18nValue && I18n.getI18nValue($item.attr('i18n')) === undefined) {
                    $item.html(arr[i]);
                }
            });
            console.trace && console.trace();
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
                callback: ''
            },
            cancel: {
                text: 'Cancel',
                i18n: 'common.CANCEL',
                class: 'alert-button',
                callback: ''
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
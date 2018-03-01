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
            $box = $('<div class="infoBox infoBox-unique ' + me.options.boxType + '"></div>');

            this.$el = $box;

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
                $box.append($header);
            }

            var $body = $('<div class="infoBox-body scrollbar"></div>');

            if (me.options.icon) {
                $body.append('<div class="infoBox-icon"><img src="/static/scripts/lib/beopNotification/image/' + me.options.icon + '"></div>');
            }

            if (me.options.msg) {
                $body.append('<div class="infoBox-msg">' + me.options.msg + '</div>');
            }
            $box.append($body);
            if (me.options.buttons) {
                var $footer = $('<div class="infoBox-footer"></div>');
                $box.append($footer);
                for (var btnKey in me.options.buttons) {
                    $footer.append(me._createBtn(me.options.buttons[btnKey]));
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

            if (me.options.modal) {
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
        },
        _hide: function () {
            this.$el.hide();
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
            $button.text(option.text);
            $button.click(function () {
                me._destroy();
                option.callback && option.callback();
            });
            $button.addClass(option.css);
            this.$el.find('.infoBox-footer').append($button);
        }
    };

    function infoBoxAlert(typeOrMsg, options) {
        var _this = this;
        if (!options) {
            this.type = infoBox.alert.base.type;
            options = {msg: typeOrMsg}
        }

        if (!typeOrMsg) {
            this.type = infoBox.alert.base.type;
        } else if (infoBox.alert.options[typeOrMsg]) {
            this.type = typeOrMsg;
        } else {
            options = $.extend(options, {msg: typeOrMsg});
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

    infoBox.alert = function (type, options) {
        return new infoBoxAlert(type, options);
    };

    infoBox.alert.base = {
        type: 'info',
        buttons: {
            ok: {
                text: 'OK',
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
        this.type = infoBox.confirm.base.type;
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

    infoBox.confirm.base = {
        type: 'info',
        buttons: {
            ok: {
                text: 'OK',
                class: 'alert-button',
                callback: function () {
                    return true;
                }
            },
            cancel: {
                text: 'Cancel',
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
        delay: 20000
    };

    infoBox.version.options = {};


    // message
    function infoBoxMessage(content) {
        this.options = this._processInput({'msg': content});
        this._init();
        var $messageTitle = '<div style="position: relative; top: -10px;"><span class="fl">消息</span>' +
            '<span class="fr header-right"><span class="mr5">全部已读</span><span class="glyphicon glyphicon-envelope"></span></span></div>';
        this.$el.find('.infoBox-header').append($messageTitle);
        this.$el.slideDown(1000);
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

    infoBox.message = function (content) {
        return new infoBoxMessage(content);
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
        confirm = infoBox.confirm;
        remindInfoBox = infoBox.remind;
        versionInfoBox = infoBox.version;
        messageInfoBox = infoBox.message;
    }
} catch (e) {
    console.warn('弹框初始化失败' + e);
}
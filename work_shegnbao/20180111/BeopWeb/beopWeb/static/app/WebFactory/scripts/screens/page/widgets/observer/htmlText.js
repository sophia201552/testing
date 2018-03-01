(function (exports, FacHtmlText, TooltipMixin) {

    ///////////////
    // ERROR TIP //
    ///////////////
    var ERRTIP_DELAY = 1000;
    var $errTip = null;
    var errTipTimer = null;
    var errTip = {
        show: function () {
            $errTip && $errTip.css({
                'display': '',
                'opacity': 1
            });
            if (errTipTimer) { window.clearTimeout(errTipTimer); errTipTimer = null; }
        },
        hide: function () {
            if (!errTipTimer) {
                errTipTimer = window.setTimeout(function () {
                    $errTip && $errTip.css('opacity', 0);
                    errTipTimer = null;
                }, ERRTIP_DELAY);
            }
        }
    };
    var errTipTemplate = '<div class="gray-scrollbar" id="errTip"></div>';

    function HtmlText(layer, model) {
        FacHtmlText.apply(this, arguments);
    }

    HtmlText.prototype = Object.create(FacHtmlText.prototype);
    HtmlText.prototype.constructor = HtmlText;

    /** override */
    HtmlText.prototype.show = function () {
        var _this = this;
        var model = this.store.model;
        var screens = namespace('observer.screens');
        var options = model.option();
        var pageId = options.pageId;
        var pageType = options.pageType;
        var tpl = '<div class="modal fade" id="buttonModal" style="display:none;">\
            <div class="modal-dialog" style="width: 80%; height: calc(100% - 60px);">\
                <div class="modal-content" style="width: 100%;height: 100%;border: none;">\
                    <div class="modal-header" style="border-bottom:0;height:0;min-height: 0;padding:0;">\
                        <button type="button" class="close" data-dismiss="modal" style="position:absolute;top:7px;\
                        right:5px;z-index:2;width:25px;height:25px;border-radius:12.5px;background:#fff;padding-bottom:2px;">\
                        <span aria-hidden="true">&times;</span></button>\
                    </div>\
                    <div class="modal-body" style="padding:0;width: 100%;height: 100%;overflow:hidden;z-index:1;"></div>\
                </div>\
            </div>\
        </div>';

        // 初始化所有绑定事件
        $(this.shape).off();

        FacHtmlText.prototype.show.apply(this, arguments);

        if (model.idDs().length) {
            this.enableTooltip && this.initTooltip({
                clickable: AppConfig.isFactory === 0
            });
        }

        if (pageId && pageId != '') {
            this.shape.style.cursor = 'pointer';
        }
        $(this.shape).on('click',function() {
            var $modal;
            var floatScreen;

            if (!pageId) {
                return;
            }

            if (options.float === 1) {
                $modal = $(tpl);
                $modal.appendTo(document.body);

                $modal.one('shown.bs.modal',function () {
                    floatScreen = new screens[pageType || 'PageScreen']({
                        id: pageId,
                        isFactory: AppConfig.isFactory
                    }, $('.modal-body', $modal)[0]);

                    floatScreen.show();
                });
                $modal.one('hidden.bs.modal',function () {
                    floatScreen && floatScreen.close();
                    $modal.remove();
                });

                WebAPI.get('/factory/page/'+pageId).done(function (rs) {
                    var $modalDialog = $modal.find('.modal-dialog');
                    var page;
                    if (rs.status !== 'OK') {
                        return;
                    }
                    page = rs.data;
                    if (page.display === 1) {
                        $modalDialog.width(page.width);
                        $modalDialog.height(page.height+30);
                    }
                    $modal.modal('show');
                });
                
            } else {
                floatScreen = new screens[pageType || 'PageScreen']({
                    id: pageId,
                    isFactory: AppConfig.isFactory
                }, _this.page.painterCtn);

                // 重置一下鼠标，因为页面切换的时候，可能图片的 mouseout 事件不会被触发，导致鼠标未还原
                _this.page.painterCtn.style.cursor = 'default';

                // 辞旧迎新
                _this.page.close();
                floatScreen.show();
            }
        });
    };

    /**
     * @override
     */
    HtmlText.prototype.update = function (e, propName) {
        var model = this.store.model;
        var faults;
        var maxGrade;

        if (propName && propName.indexOf('update.option.faults') > -1) {
            faults = model['option.faults']();
            this.shape.classList.remove('level-normal');
            this.shape.classList.remove('level-warn');
            this.shape.classList.remove('level-danger');
            if (faults.length) {
                faults.forEach(function (row) {
                    if (typeof maxGrade === 'undefined' || row.grade > maxGrade) {
                        maxGrade = row.grade;
                    }
                });
                if (maxGrade > 1) {
                    // danger
                    this.shape.classList.add('level-danger');
                } else if (maxGrade > 0) {
                    this.shape.classList.add('level-warn');
                } else {
                    this.shape.classList.add('level-normal');
                }
            }
            this._attachHoverEvents();
        }

        FacHtmlText.prototype.update.apply(this, arguments);
    };

    // 绑定鼠标 hover 事件
    HtmlText.prototype._attachHoverEvents = function () {
        var _this = this;
        // 获取最新的 faults 信息
        var faults = this.store.model['option.faults']();
        var $shape = $(this.shape);

        $shape.off('hover');

        if (!faults.length) {
            errTip.hide();
            return;
        }

        // fault tip 的显示隐藏
        $shape.hover(function (e) {
            var container = _this.painter.domContainer;
            var offset = $(container).offset();
            _this._createErrTip();
            _this.checkPopoverBoundary(container, $errTip, e.pageX - offset.left, e.pageY - offset.top);
            errTip.show();
            e.stopPropagation();
        }, function (e) {
            errTip.hide();
            e.stopPropagation();
        });
    };

    HtmlText.prototype._returnToMoment = function (date) {
        this.painter.getPage().enterReplayMode(new Date(date));
    };

    HtmlText.prototype._createErrTip = function () {
        var $find = $(), $each, _this = this;
        var faults = this.store.model['option.faults']();

        if (!$errTip || $errTip.length === 0) {
            $errTip = $(errTipTemplate);
            $errTip.on('mouseenter', function (e) {
                errTip.show();
                e.stopPropagation();
            }).on('mouseleave', function (e) {
                errTip.hide();
                e.stopPropagation();
            }).on('transitionend', function (e) {
                e = e.originalEvent;
                if (e.propertyName === 'opacity' && e.target.style.opacity === '0') {
                    e.target.style.display = 'none';
                }
                e.stopPropagation();
            }).on('click', '.err-replay', function () {
                var $this = $(this);
                var date = $this.siblings('span[data-time]')[0].dataset.time;

                _this._returnToMoment(date);
            });
        }

        if (!$.contains(this.painter.domContainer, errTip[0])) {
            $(this.painter.domContainer).append($errTip);
        }

        for (var i = 0, len = faults.length; i < len; i++) {
            $each = $('#divPaneNotice').find('[faultid="' + faults[i].faultId + '"]').clone(true);
            // 去除 mouseenter 和 mouseleave 事件
            $each.each(function () {
                this.onmouseenter = null;
                this.onmouseleave = null;
            });
            $('<span class="glyphicon glyphicon-play span-hover-pointer grow err-replay"></span>').appendTo($each.children('div')[0]);
            $find = $find.add($each);
        }

        $errTip.html($find);

        return $errTip;
    };

    HtmlText.prototype._checkPopoverBoundary = function (container, $popover, pageX, pageY) {
        var $container = $(container),
            offsetX = 10,
            offsetY = 0,
            popoverWidth = $popover.width(),
            popoverHeight = $popover.height(),
            rightX = Math.min(pageX + popoverWidth + offsetX, $container.width() - 5),
            rightY = Math.min(pageY + popoverHeight + offsetY, $container.height() - 5);

        $popover.css({
            left: rightX - popoverWidth + offsetX,
            top: rightY - popoverHeight + offsetY
        })
    };

    HtmlText.prototype = Mixin(HtmlText.prototype, TooltipMixin);

    //覆盖
    exports.HtmlText = HtmlText;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlText'),
    namespace('mixins.TooltipMixin')
));
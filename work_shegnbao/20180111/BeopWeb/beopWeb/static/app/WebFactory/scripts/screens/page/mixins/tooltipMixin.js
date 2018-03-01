/**
 * tooltip 扩展模块
 */
(function (exports) {
    /////////////
    // TOOLTIP //
    /////////////
    var configMap = {
        // delay to load
        textTooltipTemplate: '<div class="tooltip observer-text-tooltip observer-text-editor" draggable="true" data-h5-draggable-node="true" data-ds-id="">\
        <div class="tooltip-inner">\
        <div>\
        <span id="pointName"></span>\
        <span class="label" style="font-weight:500;margin-left:5px;padding:1px 3px;color:#000;background-color:#c7c7c7;">Copy</span>\
        </div>\
        <div id="pointAlias">12312312</div><div><a class="lkAddToDS" href="javascript:;">\
        {interAnalysis}</a></div></div></div>',
        textEditorZIndex: 2200,
        textEditorOpacity: 0.8,
        textTooltipBackgroundColor: '#1A1A1A',
        textEditorIdPrefix: 'observer-text-editor-'
    };
    var TOOLTIP_DELAY = 1000;
    var $tooltip = null;
    var tooltipTimer = null;
    var tooltip = {
        show: function () {
            $tooltip.css('display', '');
            $tooltip.css('opacity', configMap.textEditorOpacity);
            if (tooltipTimer) { window.clearTimeout(tooltipTimer); tooltipTimer = null; }
        },
        hide: function () {
            if (!tooltipTimer) {
                tooltipTimer = window.setTimeout(function () {
                    $tooltip !== null && $tooltip.css('opacity', 0);
                    tooltipTimer = null;
                }, TOOLTIP_DELAY);
            }
        }
    };
    var dsLoadPromise = null;
    // 记录一下上一次加载的数据源，用于连续两次查询相同数据源的优化
    var lastQueryDs = null;

    var TooltipMixin = {
        enableTooltip: true,
        isInMouseOver: false,
        initTooltip: function (opt) {
            var _this, shape, ds, clickable;
            var container, shapeItem;
            // 容器的偏移量
            var offset;

            opt = $.extend(false, {}, opt);
            _this = this;
            shape = opt.shape || this.shape;
            ds = opt.ds || this.store.model.idDs()[0];
            clickable = typeof opt.clickable === 'undefined' ? false : opt.clickable;
            container = opt.container || this.page.painterCtn;

            if (shape.nodeType === 'Shape'){
                shapeItem = shape;
            } else {
                shapeItem = $(shape);
            }

            offset = $(container).offset();
            shapeItem.on('mouseenter',function(event){
                if (_this.isInMouseOver) return;
                $tooltip = _this.createTooltip(container, {
                    ds: ds,
                    clickable: clickable
                });
                tooltip.show();
                if (event.evt) {
                    container.style.cursor = 'pointer';
                    _this.checkPopoverBoundary(container, $tooltip, event.evt.pageX - offset.left, event.evt.pageY - offset.top);
                } else {
                    this.style.cursor = 'pointer';
                    _this.checkPopoverBoundary(container, $tooltip, event.pageX - offset.left, event.pageY - offset.top);
                }
                _this.isInMouseOver = true;
            });
            shapeItem.on('mouseleave ',function(e){
                if (e.evt) {
                    container.style.cursor = 'auto';
                } else {
                    this.style.cursor = 'auto';
                }
                tooltip.hide();
                _this.isInMouseOver = false;
            });
        },
        createTooltip: function (container, params) {
            var _this = this;
            var template, $template = $tooltip;
            var ds = params.ds;
            var clickable = params.clickable;
            var $pointName;
            // 是否是老式的数据源使用格式，即：纯数据源ID 的格式
            var isOldDsFormat = false;

            if (!$template || !$template.length) {
                template = configMap.textTooltipTemplate.formatEL({
                    interAnalysis:I18n.resource.observer.observerScreen.TEXT_ADD_TO_DATASOURCE
                });
                $template = $(template);
                $template.on('mouseenter', function () {
                    tooltip.show();
                }).on('mouseleave', function () {
                    tooltip.hide();
                }).on('transitionend', function (e) {
                    e = e.originalEvent;
                    if (e.propertyName === 'opacity' && e.target.style.opacity === '0') {
                        e.target.style.display = 'none';
                    }
                    e.stopPropagation();
                }).css({
                    'display': 'block',
                    'max-width': 'none',
                    'opacity': configMap.textEditorOpacity,
                    'z-index': configMap.textEditorZIndex - 1
                }).find('.tooltip-inner').css({
                    'background-color': configMap.textTooltipBackgroundColor,
                    'opacity': configMap.textEditorOpacity,
                    'max-width': 'none'
                });

                // 点名复制逻辑
                $template.find('.label').click(function (e) {
                    var input = document.createElement('textarea');

                    document.body.appendChild(input);
                    input.value = $template.find('#pointName').text();
                    input.focus();
                    input.select();
                    document.execCommand('Copy');
                    input.parentNode.removeChild(input);
                    e.preventDefault();
                    e.stopPropagation();
                });

                if (clickable) {
                    $template.find('.lkAddToDS').click(function (e) {
                        var pointName = $(this).parents('.tooltip-inner').find('#pointName').text();
                        new ModalAppendPointToDs(false, null, [pointName]).show();
                        e.preventDefault();
                    });
                }
            }

            if (!$.contains(container, $template[0])) {
                $(container).append($template);
            }

            $template[0].dataset.dsId = ds;
            
            // 如果本次请求的数据源信息和上一次一致，则沿用上一次查询的结果
            if (lastQueryDs === ds) {
                return $template;
            }

            if (dsLoadPromise && dsLoadPromise.state() === 'pending') {
                // 中止上一次的请求
                dsLoadPromise.abort();
            }
            dsLoadPromise = WebAPI.post('/analysis/datasource/getDsItemsById', [ds]);
            lastQueryDs = ds;

            if (ds.indexOf('|') > -1) {
                ds = ds.split('|')[1];
            } else {
                isOldDsFormat = true;
            }
            $template.find('#pointName').text(ds);
            $template.find('#pointAlias').text('loading');

            dsLoadPromise.done(function (rs) {
                var alias;
                if (rs && rs.length) {
                    alias = rs[0].alias;
                }

                if (isOldDsFormat) {
                    $template.find('#pointName').text(rs[0].value);
                }

                if (alias && alias !== rs[0].value) {
                    $template.find('#pointAlias').text(rs[0].alias).show();
                }
                // 如果 alias 不存在 或 alias 和 value 一致，则隐藏 alias
                else {
                    $template.find('#pointAlias').text('').hide();
                }
            });

            return $template;
        },
        checkPopoverBoundary: function (container, $popover, pageX, pageY) {
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
        }
    };


    exports.TooltipMixin = TooltipMixin;
} (
    namespace('mixins')
));
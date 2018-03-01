﻿/// <reference path="../../core/sprites.js" />
/// <reference path="../../core/commonCanvas.js" />

var ModelText = (function () {
    var textEditorTemplate = '<div class="popover observer-text-editor" style="padding: 10px;"><button type="button" class="close"><span>×</span></button>' +
        '<div class="popover-content">' +
        '<div class="form-horizontal">' +
        '<div class="form-group">' +
        '<div class="col-sm-9" id="pointName"></div>' +
        '</div>' +
        '<button class="btn btn-default btn-sm pull-right text-editor-btn-ok"></button>' +
        '</div>' +
        '</div>' +
        '</div>';
    var textTooltipTemplate = '<div class="tooltip observer-text-tooltip observer-text-editor"><div class="tooltip-inner"><div id="pointName"></div><div><a class="lkAddToDS" href="javascript:;">' +
        '{0}</a></div></div></div>';
    var errTipTemplate = '<div id="errTip">\
    </div>';

    /////////////
    // TOOLTIP //
    /////////////
    var TOOLTIP_DELAY = 1000;
    var $tooltip = null;
    var tooltipTimer = null;
    var tooltip = {
        show: function () {
            $tooltip.css('display', '');
            $tooltip.css('opacity', configMap.textEditorOpacity);
            if(tooltipTimer) {window.clearTimeout(tooltipTimer);tooltipTimer = null;}
        },
        hide: function () {
            if(!tooltipTimer) {
                tooltipTimer = window.setTimeout(function () {
                    $tooltip !== null && $tooltip.css('opacity', 0);
                    tooltipTimer = null;
                }, TOOLTIP_DELAY);
            }
        }
    };

    ///////////////
    // ERROR TIP //
    ///////////////
    var ERRTIP_DELAY = 1000;
    var $errTip = null;
    var errTipTimer = null;
    var errTip = {
        show: function () {
            $errTip.css('display', '');
            $errTip.css('opacity', 1);
            if(errTipTimer) {window.clearTimeout(errTipTimer);errTipTimer = null;}
        },
        hide: function () {
            if(!errTipTimer) {
                errTipTimer = window.setTimeout(function () {
                    $errTip !== null && $errTip.css('opacity', 0);
                    errTipTimer = null;
                }, ERRTIP_DELAY);
            }
        }
    }

    var configMap = {
        // delay to load
        textTooltipTemplate: null,
        textErrTipTemplate: errTipTemplate,
        textEditorTemplate: textEditorTemplate,
        textEditorZIndex: 2200,
        textEditorOpacity: 0.8,
        textTooltipBackgroundColor: '#1A1A1A',
        textEditorIdPrefix: 'observer-text-editor-'
    }

    function ModelText(id, painter, behaviors) {
        Sprite.call(this, id, painter, behaviors);
        if (!(this.painter && this.painter.print)) this.painter = {paint: this.paint};
        if (!(this.behaviors && this.behaviors[0] && this.behaviors[0].execute)) this.behaviors = [{execute: this.executeAnimation}];

        this.value = undefined;
        this.isDiffValue = undefined;
        this.font = undefined;
        this.color = undefined;
        this.fontSize = undefined;
        this.decimalplace = undefined;
        this.idCom = undefined;
        this.dictBindString = [];
        this.showMode = undefined;
        this.tooltipTemplate = configMap.textTooltipTemplate;
        this.editorTemplate = configMap.textEditorTemplate;
        this.enableTooltip = true;
        this.isInMouserOver = false;

        if( !configMap.textTooltipTemplate ) {
            configMap.textTooltipTemplate = textTooltipTemplate.format(I18n.resource.observer.observerScreen.TEXT_ADD_TO_DATASOURCE);
        }
    };

    ModelText.prototype = new Sprite();

    ModelText.prototype.isTextEditorOpen = function () {
        return $(ElScreenContainer).find('#' + configMap.textEditorIdPrefix + this.id).length > 0;
    }

    ModelText.prototype.clearTextTooltip = function () {
        $(ElScreenContainer).find('.observer-text-tooltip').remove();
    }

    ModelText.prototype.paint = function (ctx) {
        var _this = this;
        if (!this.isDiffValue) {
            paintText(this.fontSize, this.color, false);
        } else {
            paintText(this.fontSize, "#ff7200", true);
            setTimeout(function () {
                paintText(_this.fontSize, _this.color, false);
            }, 200);
        }

        function paintText(size, color, isBold) {
            ctx.save();
            var strFont;
            if (size) strFont = (isBold ? 'bold ' : '') + size + "px ";
            strFont += _this.font ? _this.font : "Arial";
            ctx.font = strFont;
            ctx.textBaseline = "middle";

            if (color) ctx.fillStyle = color;

            var str;
            if (!isNaN(_this.value) && _this.decimalplace != undefined) {
                str = parseFloat(_this.value).toFixed(_this.decimalplace);
                if (str == "NaN") str = "--";
            }
            else {
                str = _this.value;
            }

            var index = parseInt(_this.value);
            if (_this.dictBindString[index]) str = _this.dictBindString[index];

            if (_this.width && ctx.measureText(str).width < _this.width) {
                ctx.fillText(str, _this.x, _this.y);
            } else {
                StringTools.wordWrap(ctx, _this.x, _this.y - _this.height / 2 + 15, _this.width, str, null);
            }

            ctx.restore();
        }
    }

    ModelText.prototype.update = function (value) {
        this.isDiffValue = !(this.value == value);
        if (this.value == '--') this.isDiffValue = false;
        this.value = value;
    }

    ModelText.prototype.createTooltip = function () {
        var _this = this;
        var template, $template = $tooltip;

        if(!$template || !$template.length) {
            template = this.tooltipTemplate;
            $template = $(template);
            $template.on('mouseenter', function () {
                tooltip.show();
            }).on('mouseleave', function () {
                tooltip.hide();
            }).on('transitionend', function (e) {
                e = e.originalEvent;
                if( e.propertyName === 'opacity' && e.target.style.opacity === '0' ) { 
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
            $template.find('.lkAddToDS').click(function (e) {
                var pointName = $(this).parents('.tooltip-inner').find('#pointName').text();
                // add to data source

                Spinner.spin(ElScreenContainer);
                WebAPI.post('/analysis/datasource/saveMulti/'+AppConfig.userId, {
                    itemList: [{
                        alias: pointName,
                        groupId: 'groupEmpty',
                        note: '',
                        projId: AppConfig.projectId,
                        type: 0,
                        value: pointName
                    }]
                })
                .done(function (rs) {
                })
                .always(function (rs) {
                    Spinner.stop();
                });

                e.preventDefault();
            });
            $(ElScreenContainer).append($template);
        } 
        $template.find('#pointName').text(this.idCom);
        return $template;
    }

    ModelText.prototype.createTextEditor = function () {
        var $template = $(this.editorTemplate),
            _this = this,
            $operation,
            $select;
        if (this.dictBindString && this.dictBindString.length > 0) {
            $operation = $('<div class="form-group"><input type="hidden" id="pointValue"></input><select class="form-control" style="width: 150px;margin: 0 auto;"></select></div>'),
                $select = $operation.find('select');
            for (var m = 0, len = this.dictBindString.length; m < len; m++) {
                var selected = parseInt(this.value) === m ? 'selected' : '';
                $select.append('<option value="' + m + '" ' + selected + '>' + this.dictBindString[m] + '</option>');
            }
            $select.change(function () {
                $operation.find('#pointValue').val($(this).val());
            })
        } else {
            $operation = $('<div class="form-group">' +
            '<input type="text" class="form-control" id="pointValue" placeholder="' + this.value + '" style="width: 150px;margin: 0 auto;">' +
            '</div>');
        }
        $template.css({
            'display': 'block',
            'min-width': '230px',
            'z-index': configMap.textEditorZIndex
        }).attr('id', configMap.textEditorIdPrefix + this.id)
            .find('.text-editor-btn-ok')
            .text(I18n.resource.observer.observerScreen.TEXT_EDITOR_CONFIRM)
            .before($operation);

        $template.on('click', '.close', function () {
            $(this).closest('.popover').remove();
        }).on('click', '.text-editor-btn-ok', function () {
            var value = $template.find('#pointValue').val(),
                projectId = AppConfig.projectId,
                idCom = _this.idCom,
                alert;
            if (!value || !projectId || !idCom
                || parseInt(_this.value) === value
                || isNaN(parseInt(_this.value))) {
                return;
            }
            var data = {
                db: projectId,
                point: idCom,
                value: $template.find('#pointValue').val()
            }
            Spinner.spin($template[0]);
            WebAPI.post('/set_realtimedata', data).pipe(function (result) {
                if (result.indexOf('succeeded') != -1) {
                    return WebAPI.post("/get_realtimedata", {
                        proj: AppConfig.projectId,
                        pointList: [_this.idCom]
                    }).done(function (result) {
                        var resultJson, resultItem, latestValue;
                        try {
                            resultJson = JSON.parse(result);
                        } catch (e) {
                            resultJson = [];
                        }
                        resultItem = resultJson[0];
                        if (!resultItem) {
                            latestValue = null;
                        }
                        latestValue = resultItem.value;
                        if (latestValue === _this.value) {
                            alert = new Alert($template[0], Alert.type.danger, I18n.resource.observer.observerScreen.TEXT_EDITOR_SEND_FAIL);
                        } else {
                            alert = new Alert($template[0], Alert.type.success, I18n.resource.observer.observerScreen.TEXT_EDITOR_SEND_SUCCESS);
                        }
                    });
                } else {
                    alert = new Alert($template[0], Alert.type.danger, I18n.resource.observer.observerScreen.TEXT_EDITOR_SEND_FAIL);
                }
            }).fail(function () {
                alert = new Alert($template[0], Alert.type.danger, I18n.resource.observer.observerScreen.TEXT_EDITOR_SEND_FAIL);
            }).always(function () {
                alert.setStyle({width: '70%', fontSize: '10px'});
                alert.show(1000);
                Spinner.stop();
            });
        });

        $template.find('#pointName').text(this.idCom);
        return $template;
    };

    ModelText.prototype.createErrTip = function (data) {
        var $find = $(), $each, _this = this;
        if( !$errTip || $errTip.length === 0 ) {
            $(ElScreenContainer).append($errTip = $(configMap.textErrTipTemplate));
            $errTip.on('mouseenter', function (e) {
                errTip.show();
                e.stopPropagation();
            }).on('mouseleave', function (e) {
                errTip.hide();
                e.stopPropagation();
            }).on('transitionend', function (e) {
                e = e.originalEvent;
                if( e.propertyName === 'opacity' && e.target.style.opacity === '0' ) { 
                    e.target.style.display = 'none';
                }
                e.stopPropagation();
            }).on('click', '.err-replay', function () {
                var $this = $(this);
                var date = $this.siblings('span[data-time]').attr('data-time');

                _this.retrunToMoment(date);
            });
        }

        for (var i = 0, len = data.length; i < len; i++) {
            $each = $('#divPaneNotice').find('[faultid="'+data[i]+'"]').clone(true);
            // 去除 mouseenter 和 mouseleave 事件
            $each.each( function () {
                this.onmouseenter = null;
                this.onmouseleave = null;
            } );
            $('<span class="glyphicon glyphicon-play span-hover-pointer grow err-replay"></span>').insertBefore( $each.children('p') );
            $find = $find.add($each);
        }

        $errTip.html($find);
        return $errTip;
    };

    ModelText.prototype.checkPopoverBoundary = function ($popover, pageX, pageY) {
        if (!pageX) {
            pageX = this.x;
        }
        if (!pageY) {
            pageY = this.y;
        }
        var documentWidth = $(document).width(),
            documentHeight = $(document).height(),
            popoverWidth = $popover.width(),
            popoverHeight = $popover.height(),
            popoverX = this.width + pageX + popoverWidth,
            popoverY = this.height + pageY + popoverHeight,
            popoverXOffset,
            popoverYOffset;
        popoverXOffset = popoverX > documentWidth ? pageX - popoverWidth : pageX + 15;
        popoverYOffset = popoverY > documentHeight ? pageY - popoverHeight : pageY - 45;

        $popover.css({left: popoverXOffset, top: popoverYOffset})
    }

    ModelText.prototype.mouseEnter = function (event) {
        var data;
        if (this.enableTooltip) {
            // prevent inner elements bubble events
            if( this.isInMouserOver ) return;
            if( this.isErrTip ) {
                data = this.getErrData(this.id);
                if( !data || data.length === 0 ) return;
                $errTip = this.createErrTip(data);
                errTip.show();
                this.checkPopoverBoundary($errTip, event.pageX, event.pageY);
            } else {
                if (this.isTextEditorOpen()) return;

                $tooltip = this.createTooltip();
                tooltip.show();
                this.checkPopoverBoundary($tooltip, event.pageX, event.pageY);
            }
            this.isInMouserOver = true;
        }
    }

    ModelText.prototype.mouseOut = function (event) {
        var _this = this;
        if (this.enableTooltip) {
            if( this.isErrTip ) {
                errTip.hide();
            } else {
                tooltip.hide();
            }
            this.isInMouserOver = false;
        }
    }

    ModelText.prototype.mouseDown = function (event) {
        this.clearTextTooltip();
        if (!this.readWrite) {
            return;
        }
        $('#' + configMap.textEditorIdPrefix + this.id).remove();
        var $popover = this.createTextEditor();
        $(ElScreenContainer).append($popover);
        this.checkPopoverBoundary($popover);
    }

    // static
    ModelText.destroy = function () {
        if(tooltipTimer) {
            window.clearTimeout(tooltipTimer);
            tooltipTimer = null;
        }
        if($tooltip !== null) {
            $tooltip.remove();
            $tooltip = null;
        }

        if(errTipTimer) {
            window.clearTimeout(errTipTimer);
            errTipTimer = null;
        }
        if($errTip !== null) {
            $errTip.remove();
            $errTip = null;
        }
    };

    return ModelText;
})();
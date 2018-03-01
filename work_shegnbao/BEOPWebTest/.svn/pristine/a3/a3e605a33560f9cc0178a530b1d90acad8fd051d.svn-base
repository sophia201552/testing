/// <reference path="../../core/sprites.js" />
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
    //80 Id下显示的vav模板和fptu模板数据框
    //if (AppConfig.projectId==80){
    var errTipTpNew = '<div id="errTipNew">\
        <div class="errTipHeader"></div>\
        <div class="vavBox"><div class="airVolume">实际风量：  <span></span></div>\
        <div class="floStptVol">设定风量：  <span></span></div>\
        <div class="dmprPos">风阀开度：  <span></span></div>\
        <div class="roomTemp">房间温度：  <span></span></div>\
        </div>\
        <div class="fptuBox"><div class="spaceTemp">空间温度：  <span></span></div>\
        <div class="tempSetpoint">温度设定：  <span></span></div>\
        <div class="fanOnOff">风机状态：  <span></span></div>\
        <div class="fanErr">风机故障：  <span></span></div>\
        <div class="boxFlowDP">流量开关：  <span></span></div>\
        <div class="fanSpeedSet">风速设定：  <span></span></div>\
        <div class="fanSpeed">风速：  <span></span></div>\
        </div>\
        </div>';
    //}

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
            if (errTipTimer) { window.clearTimeout(errTipTimer); errTipTimer = null; }
        },
        hide: function () {
            if (!errTipTimer) {
                errTipTimer = window.setTimeout(function () {
                    $errTip !== null && $errTip.css('opacity', 0);
                    errTipTimer = null;
                }, ERRTIP_DELAY);
            }
        }
    }
    //if (AppConfig.projectId==80){
        var ERRTIPNEW_DELAY = 1000;
        var $errTipNew = null;
        var errTipNewTimer = null;
        var errTipNew = {
            show: function () {
                $errTipNew.css('display', '');
                $errTipNew.css('opacity', 1);
                if (errTipNewTimer) { window.clearTimeout(errTipNewTimer); errTipNewTimer = null; }
            },
            hide: function () {
                if (!errTipNewTimer) {
                    errTipNewTimer = window.setTimeout(function () {
                        $errTipNew !== null && $errTipNew.css('opacity', 0);
                        errTipNewTimer = null;
                    }, ERRTIPNEW_DELAY);
                }
            }
        }
    //}

    var configMap = {
        // delay to load
        textTooltipTemplate: null,
        textErrTipTemplate: errTipTemplate,
        textErrTipTpNew: errTipTpNew,
        textEditorTemplate: textEditorTemplate,
        textEditorZIndex: 2200,
        textEditorOpacity: 0.8,
        textTooltipBackgroundColor: '#1A1A1A',
        textEditorIdPrefix: 'observer-text-editor-'
    }

    function ModelText(id, painter, behaviors) {
        Sprite.call(this, id, painter, behaviors);
        if (!(this.painter && this.painter.print)) this.painter = { paint: this.paint };
        if (!(this.behaviors && this.behaviors[0] && this.behaviors[0].execute)) this.behaviors = [{ execute: this.executeAnimation }];

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
        this.errTipTimerout = null;

        if (!configMap.textTooltipTemplate) {
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
        ctx.save();

        var curColor = this.color;
        var strFont;
        if (this.fontSize) strFont = this.fontSize + "px ";
        strFont += _this.font ? _this.font : "Arial";
        ctx.font = strFont;

        if (this.bgColor) {
            curColor = "#ffffff";
            paintDiagNoticeBg();
        }

        if (!this.isDiffValue) {
            paintText(curColor);
        } else {
            strFont = 'bold ' + strFont;
            paintText("#ff7200");
            setTimeout(function () {
                paintText(curColor);
            }, 200);
        }

        ctx.restore();

        function paintText(color) {
            ctx.save();

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

        function paintDiagNoticeBg() {
            if (!_this.alphaBg) _this.alphaBg = 1;

            if (!(_this.grade == 0 || _this.grade == undefined)) {
                if (_this.alphaBg < 0.3 || _this.alphaBg > 1) {
                    _this.isFade = !_this.isFade;
                }
                _this.alphaBg = _this.isFade ? _this.alphaBg + 0.02 : _this.alphaBg - 0.02;
            }

            ctx.save();
            ctx.fillStyle = _this.bgColor;
            ctx.globalAlpha = _this.alphaBg.toFixed(2);
            CanvasGeometry.fillRadiusRect(ctx, _this.x - 5, _this.y - _this.height / 2, ctx.measureText(_this.value).width + 12, _this.height, 3)
            ctx.fill();
            ctx.restore();
        }
    }

    ModelText.prototype.update = function (value) {
        this.isDiffValue = !(this.value == value);
        if (this.value == '--') this.isDiffValue = false;
        this.value = value;
    }

    ModelText.prototype.updateDiagnosisGrade = function (grade) {
        this.grade = grade;
        switch (grade) {
            case 0: this.bgColor = '#5bc0de'; break;
            case 1: this.bgColor = '#f0ad4e'; break;
            case 2: this.bgColor = '#d9534f'; break;
            default: this.bgColor = '#d9534f'; break;
        }
    }

    ModelText.prototype.createTooltip = function () {
        var _this = this;
        var template, $template = $tooltip;

        if (!$template || !$template.length) {
            template = this.tooltipTemplate;
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
            $template.find('.lkAddToDS').click(function (e) {
                var pointName = $(this).parents('.tooltip-inner').find('#pointName').text();
                new ModalAppendPointToDs(false, null, [pointName]).show();
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
                alert.setStyle({ width: '70%', fontSize: '10px' });
                alert.show(1000);
                Spinner.stop();
            });
        });

        $template.find('#pointName').text(this.idCom);
        return $template;
    };

    ModelText.prototype.createErrTip = function (data) {
        var $find = $(), $each, _this = this;
        if (!$errTip || $errTip.length === 0) {
            $(ElScreenContainer).append($errTip = $(configMap.textErrTipTemplate));
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
                var date = $this.siblings('span[data-time]').attr('data-time');

                _this.retrunToMoment(date);
            });
        }

        for (var i = 0, len = data.length; i < len; i++) {
            $each = $('#divPaneNotice').find('[faultid="' + data[i] + '"]').clone(true);
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
    ModelText.prototype.createErrTipNew = function (modelType, errTipNewRe) {
        if (!$errTipNew || $errTipNew.length === 0) {
            $(ElScreenContainer).append($errTipNew = $(configMap.textErrTipTpNew));
        }
        $errTipNew.on('mouseenter', function (e) {
            errTipNew.show();
            e.stopPropagation();
        }).on('mouseleave', function (e) {
            errTipNew.hide();
            e.stopPropagation();
        }).on('transitionend', function (e) {
            e = e.originalEvent;
            if (e.propertyName === 'opacity' && e.target.style.opacity === '0') {
                e.target.style.display = 'none';
            }
            e.stopPropagation();
        })
        //}
        return $errTipNew;
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

        $popover.css({ left: popoverXOffset, top: popoverYOffset })
    }

    ModelText.prototype.mouseEnter = function (event) {
        var _this = this;
        var data, dataNew, modelType;
        var requestDataNew = [];
        if (this.enableTooltip) {
            // prevent inner elements bubble events
            if (this.isInMouserOver) return;
            if (this.isErrTip) {
                if (AppConfig.projectId == 80) {
                    dataNew = this.getErrDataNew(this.id);
                    modelType = dataNew[0].split('_')[0];
                    if (!dataNew) return;
                    //if (this.grade === 0) return;
                    _this.errTipTimerout = window.setTimeout(function (e) {
                        if (!_this.errTipTimerout) return;
                        if (modelType == 'VAV') {
                            requestDataNew.push(dataNew[0] + '_AirVolume');
                            requestDataNew.push(dataNew[0] + '_FloStptVol');
                            requestDataNew.push(dataNew[0] + '_DmprPos');
                            requestDataNew.push(dataNew[0] + '_RoomTemp');
                        } else if (modelType == 'FTPU') {
                            requestDataNew.push(dataNew[0] + '_SpaceTemp');
                            requestDataNew.push(dataNew[0] + '_TempSetpoint');
                            requestDataNew.push(dataNew[0] + '_FanOnOff');
                            requestDataNew.push(dataNew[0] + '_FanErr');
                            requestDataNew.push(dataNew[0] + '_BoxFlowDP');
                            requestDataNew.push(dataNew[0] + '_FanSpeedSet');
                            requestDataNew.push(dataNew[0] + '_FanSpeed');
                        }
                        WebAPI.post('/get_realtimedata', { pointList: requestDataNew, proj: AppConfig.projectId }).done(function (result) {
                            var errTipNewRe = JSON.parse(result);
                            var vavPara, vavValue, ftpuPara, ftpuValue, getValue, getPara, getDataLen,getParaClass;
                            $errTipNew = _this.createErrTipNew(modelType, errTipNewRe);
                            getDataLen = errTipNewRe.length;
                            if (modelType == 'VAV') {
                                $errTipNew.find('.errTipHeader').html('VAV');
                                $errTipNew.find('.vavBox').show();
                                $errTipNew.find('.fptuBox').hide();
                            } else {
                                $errTipNew.find('.errTipHeader').html('FPTU');
                                $errTipNew.find('.vavBox').hide();
                                $errTipNew.find('.fptuBox').show();
                            }
                            for (var i = 0; i < errTipNewRe.length; i++) {
                                getValue = errTipNewRe[i].value;
                                getPara = (errTipNewRe[i].name).split('_')[2];
                                getParaClass = (getPara.substring(0, 1)).toLowerCase() + getPara.substring(1, getPara.length);
                                if (getValue == null) {
                                    getValue = 'N / A';
                                } else {
                                    getValue = getValue;
                                }
                                $('#errTipNew .' + getParaClass).find('span').html(getValue);
                            }
                            //if (modelType == 'VAV') {
                            //    $('.errTipHeader').html('VAV');
                            //    for (var i = 0 ; i < errTipNewRe.length; i++) {
                            //        vavPara = (errTipNewRe[i].name).split('_')[2];
                            //        vavValue = errTipNewRe[i].value;
                            //        if (vavValue == null) {
                            //            vavValue = 'N / A';
                            //        } else {
                            //            vavValue = vavValue;
                            //        }
                            //        if (vavPara == 'AirVolume') {
                            //            $('.vavBox').find('.airVolume').find('span').html(vavValue)//.html('实际风量: ' + vavValue);
                            //        } else if (vavPara == 'FloStptVol') {
                            //            $('.vavBox').find('.floStptVol').find('span').html(vavValue)//.html('设定风量: ' + vavValue);
                            //        } else if (vavPara == 'DmprPos') {
                            //            $('.vavBox').find('.dmprPos').find('span').html(vavValue)//.html('风阀开度: ' + vavValue);
                            //        } else if (vavPara == 'RoomTemp') {
                            //            $('.vavBox').find('.roomTemp').find('span').html(vavValue)//.html('房间温度: ' + vavValue);
                            //        }
                            //    }
                            //    $('.vavBox').show();
                            //    $('.fptuBox').hide();
                            //} else if (modelType == 'FPTU') {
                            //    $('.errTipHeader').html('FPTU');
                            //    for (var j = 0; j < errTipNewRe[j].length; j++) {
                            //        ftpuPara = (errTipNewRe[j].name).split('_')[2];
                            //        ftpuValue = errTipNewRe[j].value;
                            //        if (ftpuValue == null) {
                            //            ftpuValue = 'N / A';
                            //        } else {
                            //            ftpuValue = ftpuValue;
                            //        }
                            //        if (ftpuPara == 'SpaceTemp') {
                            //            $('.fptuBox').find('.spaceTemp').find('span').html(vavValue)//.html('空间温度: ' + ftpuValue);
                            //        } else if (ftpuPara == 'TempSetpoint') {
                            //            $('.fptuBox').find('.tempSetpoint').find('span').html(vavValue)//.html('温度设定: ' + ftpuValue);
                            //        } else if (ftpuPara == 'FanOnOff') {
                            //            $('.fptuBox').find('.fanOnOff').find('span').html(vavValue)//.html('风机状态: ' + ftpuValue);
                            //        } else if (ftpuPara == 'FanErr') {
                            //            $('.fptuBox').find('.fanErr').find('span').html(vavValue)//.html('风机故障: ' + ftpuValue);
                            //        } else if (ftpuPara == 'BoxFlowDP') {
                            //            $('.fptuBox').find('.boxFlowDP').find('span').html(vavValue)//.html('流量开关: ' + ftpuValue);
                            //        } else if (ftpuPara == 'FanSpeedSet') {
                            //            $('.fptuBox').find('.fanSpeedSet').find('span').html(vavValue)//.html('风速设定: ' + ftpuValue);
                            //        } else if (ftpuPara == 'FanSpeed') {
                            //            $('.fptuBox').find('.fanSpeed').find('span').html(vavValue)//.html('风速: ' + ftpuValue);
                            //        }
                            //    }
                            //    $('.vavBox').hide();
                            //    $('.fptuBox').show();
                            //}
                            errTipNew.show();
                            _this.checkPopoverBoundary($errTipNew, event.pageX, event.pageY);
                        });
                        window.clearTimeout(_this.errTipTimerout);
                    }, 1000);

                } else {
                    data = this.getErrData(this.id);
                    if (!data || data.length === 0) return;
                    if (this.grade === 0) return;
                    $errTip = this.createErrTip(data);
                    errTip.show();
                    this.checkPopoverBoundary($errTip, event.pageX, event.pageY);
                }
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
        this.errTipTimerout = null;
        if (this.enableTooltip) {
            if (this.isErrTip) {
                if (AppConfig.projectId == 80) {
                    errTipNew.hide();
                } else {
                    errTip.hide();
                }
            } else {
                tooltip.hide();
            }
            this.isInMouserOver = false;
        }
    }

    ModelText.prototype.mouseDown = function (event) {
        // this.clearTextTooltip();
        // if (!this.readWrite) {
        //     return;
        // }
        // $('#' + configMap.textEditorIdPrefix + this.id).remove();
        // var $popover = this.createTextEditor();
        // $(ElScreenContainer).append($popover);
        // this.checkPopoverBoundary($popover);
    }

    // static
    ModelText.destroy = function () {
        if (tooltipTimer) {
            window.clearTimeout(tooltipTimer);
            tooltipTimer = null;
        }
        if ($tooltip !== null) {
            $tooltip.remove();
            $tooltip = null;
        }

        if (errTipTimer) {
            window.clearTimeout(errTipTimer);
            errTipTimer = null;
        }
        if ($errTip !== null) {
            $errTip.remove();
            $errTip = null;
        }
    };

    return ModelText;
})();
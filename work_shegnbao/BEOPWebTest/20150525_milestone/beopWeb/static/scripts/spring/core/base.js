var ModalBase = (function () {

    function ModalBase(parent, entity, _funcRender, _funcUpdate,_funcConfigMode) {
        if (!parent) return;
        this.screen = parent;
        this.entity = entity;

        this.container = undefined;
        this.chart = undefined; //chart or other
        this.spinner = undefined;

        this.executeRender = _funcRender;
        this.executeConfigMode = _funcConfigMode;
        this.executeUpdate = _funcUpdate;
        this.initContainer();
    };

    ModalBase.prototype = {
        UNIT_WIDTH: 8.3,   // 100/12 = 8.3 一行均分为12列
        UNIT_HEIGHT: 16.5,    // 100/6 = 16.5   一屏均分为6行

        initContainer: function (replacedElementId) {
            var divParent = document.getElementById('divContainer_' + this.entity.id);
            var isNeedCreateDivParent = false;

            if ((!divParent) || replacedElementId) {
                var isNeedCreateDivParent = true;
            }

            if (isNeedCreateDivParent) {
                divParent = document.createElement('div');
                divParent.id = 'divContainer_' + this.entity.id;
            }

            //get container
            if (replacedElementId) {
                var $old = $('#divContainer_' + replacedElementId);
                $(divParent).insertAfter($old);
                $old.remove();
            }
            else {
                isNeedCreateDivParent && this.screen.container.appendChild(divParent);
            }
            
            divParent.className = 'springContainer';
            //adapt ipad 1024px
            if (AppConfig.isMobile) {
                divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR * 2 + '%';
                divParent.style.width = this.UNIT_WIDTH * this.entity.spanC * 2 + '%';
            } else {
                divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR + '%';
                divParent.style.width = this.UNIT_WIDTH * this.entity.spanC + '%';
            }

            if (this.entity.modal.title) {
                divParent.innerHTML = '<div class="panel panel-default">\
                    <div class="panel-heading springHead">\
                        <h3 class="panel-title" style="font-weight: bold;">' + this.entity.modal.title + '</h3>\
                    </div>\
                    <div class="panel-body springContent"></div>\
                </div>';
            } else {
                divParent.innerHTML = '<div class="panel panel-default" style="background: none;">\
                    <div class="panel-body springContent" style="height:100%;"></div>\
                </div>';
            }
            

            this.container = divParent.getElementsByClassName('springContent')[0];
            this.spinner = new LoadingSpinner({color: '#00FFFF'});
            this.spinner.spin(this.container);

            return this;
        },

        render: function () {
            this.executeRender();
            if (this.chart) {
                this.chart.on('resize', function (param) {
                    this.resize();
                });
            }
        },

        update: function (options) {
            if ((!options) || options.length == 0) return;
            this.executeUpdate(options);
            if (this.spinner) this.spinner.stop();
        },

        configure: function () {
            this.spinner.stop();
            var _this = this;

            if (this.chart) this.chart.resize();

            this.divResizeByMouseInit();

            var divMask = document.createElement('div');
            divMask.className = 'springConfigMask';

            if (!this.screen.isForReport) {
                var btnConfig = document.createElement('span');
                btnConfig.className = 'glyphicon glyphicon-cog springConfigBtn grow';
                btnConfig.title = 'Options';
                btnConfig.onclick = btnConfig_clickEvent;
                divMask.appendChild(btnConfig);
            }

            var btnRemove = document.createElement('span');
            btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
            btnRemove.title = 'Remove';
            btnRemove.onclick = function (e) {
                if (_this.chart) _this.chart.clear();
                _this.screen.removeEntity(_this.entity.id);
                $('#divContainer_' + _this.entity.id).remove();
                _this = null;
            };
            divMask.appendChild(btnRemove);

            var btnHeightResize = document.createElement('div');
            var maxHeight = this.optionTemplate.maxHeight;
            var maxWidth = this.optionTemplate.maxWidth;
            var minHeight = this.optionTemplate.minHeight;
            var minWidth = this.optionTemplate.minWidth;
            btnHeightResize.className = 'divResize divHeightResize';
            btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
            '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
            '<h5 class="rangeVal">' + _this.entity.spanR + ' /6</h5>' +
            '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
            divMask.appendChild(btnHeightResize);
            var btnWidthResize = document.createElement('div');
            btnWidthResize.className = 'divResize divWidthResize';
            btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
            '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
            '<h5 class="rangeVal">' + _this.entity.spanC + ' /12</h5>' +
            '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
            divMask.appendChild(btnWidthResize);

            var inputChartTitle = document.createElement('input');
            inputChartTitle.style.display = 'none';
            inputChartTitle.className = 'form-control chartTitle';
            inputChartTitle.value = this.entity.modal.title;
            inputChartTitle.setAttribute('type','text');

            divMask.appendChild(inputChartTitle);

            var chartTitleShow = document.createElement('p');
            chartTitleShow.innerHTML = inputChartTitle.value;
            chartTitleShow.className = 'chartTitleShow';
            divMask.appendChild(chartTitleShow);
            chartTitleShow.onclick = function(){
                chartTitleShow.style.display = 'none';
                inputChartTitle.style.display = 'block';
                inputChartTitle.focus();
            };
            inputChartTitle.onblur = function(){
                inputChartTitle.style.display = 'none';
                chartTitleShow.innerHTML = inputChartTitle.value;
                _this.entity.modal.title = inputChartTitle.value;
                chartTitleShow.style.display = 'block';
            }

            this.container.parentNode.appendChild(divMask);
            this.divResizeByToolInit();
            function btnConfig_clickEvent(e) {
                $('.springSel').removeClass('springSel');
                $(e.target).parents('.springContainer').addClass('springSel');
                _this.modalInit();
                //$('#energyModal').modal('show');
            }


            //drag event of replacing entity
            var divContainer = $(this.container).closest('.springContainer')[0];
            divMask.ondragstart = function (e) {
                e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
            };
            divMask.ondragover = function (e) {
                e.preventDefault();
            };
            divMask.ondragleave = function (e) {
                e.preventDefault();
            };
            divContainer.ondrop = function (e) {
                e.preventDefault();
                var sourceId = e.dataTransfer.getData("id");
                if (sourceId) {
                    var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                    _this.screen.replaceEntity(sourceId, targetId);
                }
            }

            this.executeConfigMode();
        },

        //interface
        setModalOption: function (option) { },

        modalInit: function() {
            var _this = this;
            var dataItem = [{dsId: [], dsType: '', dsName: []}], option;
            var modalConfig = null;
            if (_this.entity.modal.points != undefined){
                for(var i = 0;i < _this.entity.modal.points.length;i++){
                    dataItem[0].dsId.push(_this.entity.modal.points[i]);
                    dataItem[0].dsName.push(AppConfig.datasource.getDSItemById(_this.entity.modal.points[i]).alias);
                }
            }

            // deal with 'custom' mode
            if(_this.optionTemplate.mode === 'custom') {
                _this.showConfigModal();
                return;
            }
            var tempOptionPara;
            _this.entity.modal.option ? tempOptionPara = _this.entity.modal.option:tempOptionPara = {};
            tempOptionPara.dataItem = dataItem;
            option = {
                modeUsable: _this.optionTemplate.mode,
                allDataNeed: true,
                rowDataType: [I18n.resource.analysis.paneConfig.DATA_TYPE_DEFAULT],
                dataTypeMaxNum:[_this.optionTemplate.maxNum],
                templateType: _this.optionTemplate.type,
                optionPara: tempOptionPara
            };
            if (dataItem[0].dsId.length == 0){
                _this.screen.modalConfigPane.showModalInit(true, option, _this);
            }else{
                _this.screen.modalConfigPane.showModalInit(false, option, _this);
            }
        },

        divResizeByToolInit: function(){ 
            var _this = this;
            var $divContainer = $('#divContainer_' +  _this.entity.id);
            var $divResize = $('.divResize');
            var $inputResize = $('.inputResize');
            $divContainer.find('#heightResize').mousedown(function(e){
                $(e.target).mousemove(function(e){
                    $(e.target).parents('.springContainer').css('height',$(e.target).val() * _this.UNIT_HEIGHT + '%');
                    _this.entity.spanR = Number($(e.target).val());
                    $(e.target).next().text($(e.target).val() + ' /6');

                    _this.screen.setEntity(_this.entity);
                });
            }).mouseup(function(e){
                $(e.target).off('mousemove');
               if(_this.chart) _this.chart.resize();
            });
            $divContainer.find('#widthResize').mousedown(function(e){
                $(e.target).mousemove(function(e){
                    $(e.target).parents('.springContainer').css('width',$(e.target).val() * _this.UNIT_WIDTH + '%');
                    _this.entity.spanC = Number($(e.target).val());
                    $(e.target).next().text($(e.target).val() + ' /12');

                    _this.screen.setEntity(_this.entity);
                });
            }).mouseup(function(e){
                $(e.target).off('mousemove');
                if(_this.chart) _this.chart.resize();
            });
            $divContainer.find('.rangeVal').click(function(e){
                e.stopPropagation();
                var valueCurrent = Number($(e.target).prev().val());
                var valuePre = $(e.target).prev().val();
                var valueMax = Number($(e.target).prevAll('.inputResize').attr('max'));
                var valueMin = Number($(e.target).prevAll('.inputResize').attr('min'));
                $(e.target).nextAll('.rangeChange').css('display','inline-block').focus().off('blur').blur(function(e){
                    valueCurrent = Number($(e.target).val());
                    if(valueCurrent <= valueMax && valueCurrent >= valueMin) {
                        $(e.target).prevAll('.inputResize').val(valueCurrent.toString());
                        if ($(e.target).prevAll('.inputResize').attr('id') == 'widthResize') {
                            $(e.target).parents('.springContainer').css('width',$(e.target).val() * _this.UNIT_WIDTH + '%');
                            _this.entity.spanC = Number($(e.target).val());
                            _this.screen.setEntity(_this.entity);
                            $(e.target).prev().text($(e.target).val() + ' /12');
                            if(_this.chart) _this.chart.resize();
                        } else{
                            $(e.target).parents('.springContainer').css('height',$(e.target).val() * _this.UNIT_HEIGHT + '%');
                            _this.entity.spanR = Number($(e.target).val());
                            _this.screen.setEntity(_this.entity);
                            $(e.target).prev().text($(e.target).val() + ' /6');
                            if(_this.chart) _this.chart.resize();
                        }
                        $(e.target).css('display', 'none');
                    }else if(valueCurrent > valueMax){
                        new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR1 + "</strong>").show().close();
                        $(e.target).val(valuePre).css('display', 'none');
                    }else if(valueCurrent < valueMin){
                        new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR2 + "</strong>").show().close();
                        $(e.target).val(valuePre).css('display', 'none');
                    }else{
                        if($(e.target).val() != ""){
                                new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR3 + "</strong>").show().close();
                            }
                        $(e.target).val(valuePre).css('display', 'none');
                    }
                })
            });
        },
        divResizeByMouseInit: function() {
            var _this = this;
            var $widthResize;
            var $heightResize;
            var divContainer = $('#divContainer_' +  _this.entity.id).get(0);
            var resizeOnRight = document.createElement('div');
            resizeOnRight.className = 'resizeOnRight';
            divContainer.appendChild(resizeOnRight);
            var resizeOnBottom = document.createElement('div');
            resizeOnBottom.className = 'resizeOnBottom';
            divContainer.appendChild(resizeOnBottom);
            var resizeOnCorner = document.createElement('div');
            resizeOnCorner.className = 'resizeOnCorner';
            divContainer.appendChild(resizeOnCorner);
            var mouseStart = {};
            var divStart = {};
            var rightStart = {};
            var bottomStart = {};
            var w, h,tempSpanR,tempSpanC;
            resizeOnRight.onmousedown =  function(e){
                $widthResize = $(e.target).parent().find('#widthResize');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                rightStart.x = resizeOnRight.offsetLeft;
                doResizeOnRight(e);
                if(resizeOnRight.setCapture){
                    resizeOnRight.onmousemove = doResizeOnRight;
                    resizeOnRight.onmouseup = stopResizeOnRight;
                    resizeOnRight.setCapture();
                }else{
                    document.addEventListener("mousemove",doResizeOnRight,true);
                    document.addEventListener("mouseup",stopResizeOnRight,true);
                }
            };
            function doResizeOnRight(e){
                var oEvent = e || event;
                var l = oEvent.clientX - mouseStart.x + rightStart.x;
                w = l + resizeOnCorner.offsetWidth;
                if(w < resizeOnCorner.offsetWidth){
                    w = resizeOnCorner.offsetWidth;
                }
                else if( w > document.documentElement.clientWidth - divContainer.offsetLeft){
                    w = document.documentElement.clientWidth - divContainer.offsetLeft - 2;
                }
                //w = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH)) * _this.UNIT_WIDTH;
                divContainer.style.width = w + "px";
            }
            function stopResizeOnRight(e){
                if (resizeOnRight.releaseCapture) {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /12');
                    $widthResize.next().next().val(tempSpanC.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    _this.entity.spanC = tempSpanC;
                    resizeOnRight.onmousemove = null;
                    resizeOnRight.onmouseup = null;
                    resizeOnRight.releaseCapture();
                    if (_this.chart) _this.chart.resize();
                } else {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /12');
                    $widthResize.next().next().val(tempSpanC.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    _this.entity.spanC = tempSpanC;
                    document.removeEventListener("mousemove", doResizeOnRight, true);
                    document.removeEventListener("mouseup", stopResizeOnRight, true);
                    if (_this.chart) _this.chart.resize();
                }
            }
            resizeOnBottom.onmousedown = function(e){
                $heightResize = $(e.target).parent().find('#heightResize');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                bottomStart.y = resizeOnBottom.offsetTop;
                doResizeOnBottom(e);
                if(resizeOnBottom.setCapture){
                    resizeOnBottom.onmousemove = doResizeOnBottom;
                    resizeOnBottom.onmouseup = stopResizeOnBottom;
                    resizeOnBottom.setCapture();
                }else{
                    document.addEventListener("mousemove",doResizeOnBottom,true);
                    document.addEventListener("mouseup",stopResizeOnBottom,true);
                }
            };
            function doResizeOnBottom(e){
                var oEvent = e || event;
                var t = oEvent.clientY - mouseStart.y + bottomStart.y;
                h = t + resizeOnCorner.offsetHeight;
                if(h < resizeOnCorner.offsetHeight){
                    h = resizeOnCorner.offsetHeight;
                }else if(h > document.documentElement.clientHeight - divContainer.offsetTop){
                    h = document.documentElement.clientHeight - divContainer.offsetTop - 2;
                }
                //h = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT)) * _this.UNIT_HEIGHT;
                divContainer.style.height = h + "px";
            }
            function stopResizeOnBottom(e){
                if (resizeOnBottom.releaseCapture) {
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $heightResize.val(tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /6');
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanR = tempSpanR;
                    resizeOnBottom.onmousemove = null;
                    resizeOnBottom.onmouseup = null;
                    resizeOnBottom.releaseCapture();
                    if (_this.chart) _this.chart.resize();
                } else {
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $heightResize.val(tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /6');
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanR = tempSpanR;
                    document.removeEventListener("mousemove", doResizeOnBottom, true);
                    document.removeEventListener("mouseup", stopResizeOnBottom, true);
                    if (_this.chart) _this.chart.resize();
                }
            }
            resizeOnCorner.onmousedown = function(e){
                $widthResize = $(e.target).parent().find('#widthResize');
                $heightResize = $(e.target).parent().find('#heightResize');
                var oEvent = e||event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                divStart.x = resizeOnCorner.offsetLeft;
                divStart.y = resizeOnCorner.offsetTop;
                doResizeOnCorner(e);
                if(resizeOnCorner.setCapture){
                    resizeOnCorner.onmousemove = doResizeOnCorner;
                    resizeOnCorner.onmouseup = stopResizeOnCorner;
                    resizeOnCorner.setCapture();
                }else{
                    document.addEventListener("mousemove",doResizeOnCorner,true);
                    document.addEventListener("mouseup",stopResizeOnCorner,true);
                }
                //zhezhao.style.display='block';
            };
            function doResizeOnCorner(e){
                var oEvent = e||event;
                var l = oEvent.clientX - mouseStart.x + divStart.x;
                var t = oEvent.clientY - mouseStart.y + divStart.y;
                w = l + resizeOnCorner.offsetWidth;
                h = t + resizeOnCorner.offsetHeight;
                if(w < resizeOnCorner.offsetWidth){
                    w = resizeOnCorner.offsetWidth;
                }
                else if(w > document.documentElement.clientWidth - divContainer.offsetLeft){
                    w=document.documentElement.clientWidth - divContainer.offsetLeft - 2;
                }
                if(h < resizeOnCorner.offsetHeight){
                    h = resizeOnCorner.offsetHeight;
                }else if(h > document.documentElement.clientHeight - divContainer.offsetTop){
                    h = document.documentElement.clientHeight - divContainer.offsetTop - 2;
                }
                //w = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH)) * _this.UNIT_WIDTH;
                divContainer.style.width = w + "px";
                //h = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT)) * _this.UNIT_HEIGHT;
                divContainer.style.height = h + "px";
            }
             function stopResizeOnCorner(e){
                 if (resizeOnCorner.releaseCapture) {
                     tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                     tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                     rangeJudge();
                     $widthResize.val(tempSpanC.toString()).get(0).setAttribute('value', tempSpanC.toString());
                     $widthResize.next().text(tempSpanC.toString() + ' /12');
                     $widthResize.next().next().val(tempSpanC.toString());
                     $heightResize.val(tempSpanR.toString()).get(0).setAttribute('value', tempSpanR.toString());
                     $heightResize.next().text(tempSpanR.toString() + ' /6');
                     $heightResize.next().next().val(tempSpanR.toString());
                     divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                     divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                     _this.entity.spanC = tempSpanC;
                     _this.entity.spanR = tempSpanR;
                     resizeOnCorner.onmousemove = null;
                     resizeOnCorner.onmouseup = null;
                     resizeOnCorner.releaseCapture();
                     if (_this.chart) _this.chart.resize();
                 } else {
                     tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                     tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                     rangeJudge();
                     $widthResize.val(tempSpanC.toString());
                     $widthResize.next().text(tempSpanC.toString() + ' /12');
                     $widthResize.next().next().val(tempSpanC.toString());
                     $heightResize.val(tempSpanR.toString());
                     $heightResize.next().text(tempSpanR.toString() + ' /6');
                     $heightResize.next().next().val(tempSpanR.toString());
                     divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                     divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                     _this.entity.spanC = tempSpanC;
                     _this.entity.spanR = tempSpanR;
                     document.removeEventListener("mousemove", doResizeOnCorner, true);
                     document.removeEventListener("mouseup", stopResizeOnCorner, true);
                     if (_this.chart) _this.chart.resize();
                 }
             //zhezhao.style.display='none';
             }
            function rangeJudge(){
                if (tempSpanC > _this.optionTemplate.maxWidth){
                    tempSpanC = _this.optionTemplate.maxWidth
                }else if(tempSpanC < _this.optionTemplate.minWidth){
                    tempSpanC = _this.optionTemplate.minWidth
                }
                if (tempSpanR > _this.optionTemplate.maxHeight){
                    tempSpanR = _this.optionTemplate.maxHeight
                }else if(tempSpanR < _this.optionTemplate.minHeight){
                    tempSpanR = _this.optionTemplate.minHeight
                }
            }
        }

    };
    return ModalBase;
})();
var ModalBase = (function () {

    function ModalBase(parent, entity, _funcRender, _funcUpdate, _funcConfigMode) {
        if (!parent) return;
        this.screen = parent;
        this.entity = entity;
        this.wikis = {};

        this.container = undefined;
        this.chart = undefined; //chart or other
        this.spinner = undefined;

        this.executeRender = _funcRender;
        this.executeConfigMode = _funcConfigMode;
        this.executeUpdate = _funcUpdate;

        // this.modalWikiCtr = undefined;
        this.hasEdit = false;
        this.spanRange = {};

        if (this.configModalOptDefault) this.configModalOpt = $.extend(true, {}, this.configModalOptDefault);
        this.initContainer();
    };

    ModalBase.prototype = {
        UNIT_WIDTH: 100 / 12,   // 100/12 = 8.3 一行均分为12列,为了精确,保留3位小数
        UNIT_HEIGHT: 100 / 6,    // 100/6 = 16.5   一屏均分为6行
        initContainer: function (replacedElementId) {
            var divParent = document.getElementById('divContainer_' + this.entity.id);
            var isNeedCreateDivParent = false;
            var scrollClass = '';

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
            if (this.screen.isForMobile) {
                this.spanRange = {
                    minWidth: 1,
                    maxWidth: 3,
                    minHeight: 1,
                    maxHeight: 4.5
                };
            } else {
                this.spanRange = {
                    minWidth: this.optionTemplate.minWidth,
                    maxWidth: this.optionTemplate.maxWidth,
                    minHeight: this.optionTemplate.minHeight,
                    maxHeight: this.optionTemplate.maxHeight
                };
            }
            //adapt ipad 1024px
            if (AppConfig.isMobile) {
                if (this.optionTemplate.scroll === false || this.entity.scroll === false) {
                    divParent.className += ' noScroll';
                } else {
                    divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR * 4 / 3 + '%';
                }
                divParent.style.width = this.UNIT_WIDTH * this.entity.spanC * 4 + '%';
                if (this.UNIT_WIDTH * this.entity.spanC * 4 > 100) {
                    divParent.style.width = '100%';
                }
            } else {
                divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR + '%';
                divParent.style.width = this.UNIT_WIDTH * this.entity.spanC + '%';
            }
            //便签和组合图高度超出部分要加滚动条样式
            if (['ModalNote', 'ModalMix'].indexOf(this.entity.modal.type) > -1) {
                scrollClass = ' gray-scrollbar scrollY'
            }
            if (this.entity.modal.title && this.entity.modal.title != '' && (!this.entity.isNotRender)) {
                divParent.innerHTML = '<div class="panel panel-default">\
                    <div class="panel-heading springHead">\
                        <h3 class="panel-title" style="font-weight: bold;">' + this.entity.modal.title + '</h3>\
                    </div>\
                    <div class="panel-body springContent' + scrollClass + '" style="position: relative;"></div>\
                </div>';
            } else {//为组合图里的小图添加标题
                divParent.innerHTML = '<div class="panel panel-default">\
                    <span class="springSeHead fontTemp6">' + this.entity.modal.title + '</span>\
                    <div class="panel-body springContent' + scrollClass + '" style="position: relative;height:100%;"></div>\
                </div>';
            }

            this.container = divParent.getElementsByClassName('springContent')[0];

            if (this.entity.modal.type !== 'ModalMix' && this.entity.modal.type !== 'ModalAppBlind' && this.entity.modal.type !== 'ModalAppPie') {
                this.spinner = new LoadingSpinner({ color: '#00FFFF' });
                this.spinner.spin(this.container);
            }
            return this;
        },

        initToolTips: function (parent) {
            var _this = this;
            if (!parent) return;
            var descTip = new StringBuilder();
            descTip.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px;">');
            descTip.append('    <div class="tooltipTitle tooltip-inner" style="display:none">GeneralRegressor</div>');
            descTip.append('    <div class="tooltipContent" style="border:1px solid black">');
            descTip.append('        <p class="containerDesc" style="word-break:break-all;"><span style="font-weight:bold">').append(_this.entity.modal.desc).append('</span> ').append('</p>');
            descTip.append('    </div>');
            descTip.append('    <div class="tooltip-arrow"></div>');
            descTip.append('</div>');
            var options = {
                placement: 'bottom',
                title: _this.entity.modal.title,
                template: descTip.toString()
            };
            if (_this.entity.modal.desc && _this.entity.modal.desc != '') {
                $(parent).tooltip(options);
            }
        },

        render: function () {
            try {
                this.executeRender();
            } catch (e) {
                console.warn(e);
            }

            if (this.chart) {
                this.chart.on('resize', function (param) {
                    this.resize();
                });
            }
        },

        update: function (options) {
            var modal, dsChartConfig, accuracy;
            var num, specialCond;
            if ((!options) || options.length == 0) return;

            // 新增精度处理逻辑
            modal = this.entity.modal;
            dsChartConfig = modal.dsChartCog && modal.dsChartCog.length ? modal.dsChartCog[0] : {};
            accuracy = dsChartConfig.accuracy;

            // 将字符串转换成数字的方法: +str
            // +'12'      = 12
            // +'12.'     = 12
            // +'12..'    = NaN
            // +'.12'     = 0.12
            // +'..12'    = NaN
            // +'今天天气不错' = NaN
            // +'12号闸有问题' = NaN
            // 特殊情况需注意
            // +''        = 0
            // +null      = 0
            // +undefined = 0

            // 如果精度不为空，且为数字
            if (accuracy !== '' && !isNaN(accuracy)) {
                specialCond = ['', null, undefined];
                options = options.map(function (row, i) {
                    // 排除特殊情况 ('', null, undefined)
                    // 和字符串文本的情况 ('今天天气不错'、'12号闸有问题'等)
                    if (specialCond.indexOf(row.data) > -1 || isNaN(row.data)) {
                        // 特殊情况不做处理
                        return row;
                    } else {
                        // 如果不是，做进制转换
                        // 首先转换成数字，若本身就是数字，则不受影响
                        num = +row.data;
                        // 这边将数据统一返回成字符串格式，可能有风险
                        row.data = num.toFixed(accuracy);
                        return row;
                    }
                });
            }

            try {
                this.executeUpdate(options);
            } catch (e) {
                console.warn(e);
            }
        },

        configure: function () {
            this.spinner && this.spinner.stop();
            var _this = this;

            if (this.chart) this.chart.clear();
            this.divResizeByMouseInit();

            var divMask = document.createElement('div');
            divMask.className = 'springConfigMask';
            divMask.draggable = 'true';
            if (this.entity.modal.type != 'ModalAnalysis' || !this.screen.isForReport) {
                var btnConfig = document.createElement('span');
                btnConfig.className = 'glyphicon glyphicon-cog springConfigBtn grow';
                btnConfig.title = 'Options';
                btnConfig.onclick = btnConfig_clickEvent;
                divMask.appendChild(btnConfig);
            }
            var btnRemove = document.createElement('span');
            btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
            btnRemove.title = 'Remove';
            btnRemove.onclick = function (e, callback) {
                //TODO 测试confirm
                confirm('Are you sure you want to delete it ?', function () {
                    if (_this.chart) _this.chart.clear();
                    if (_this.screen.screen) {//兼容ModalMix
                        _this.screen.screen.removeEntity(_this.entity.id);
                    } else {
                        _this.screen.removeEntity(_this.entity.id);
                    }

                    $('#divContainer_' + _this.entity.id).remove();
                    _this.screen.isScreenChange = true;
                    _this = null;
                    callback && callback(true);
                })
            };
            divMask.appendChild(btnRemove);

            var btnHeightResize = document.createElement('div');
            var maxHeight = this.spanRange.maxHeight;
            var maxWidth = this.spanRange.maxWidth;
            var minHeight = this.spanRange.minHeight;
            var minWidth = this.spanRange.minWidth;
            btnHeightResize.className = 'divResize divHeightResize';
            btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
            '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
            '<h5 class="rangeVal">' + _this.entity.spanR + ' /' + _this.spanRange.maxHeight + '</h5>' +
            '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
            divMask.appendChild(btnHeightResize);
            var btnWidthResize = document.createElement('div');
            btnWidthResize.className = 'divResize divWidthResize';
            btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
            '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
            '<h5 class="rangeVal">' + _this.entity.spanC + ' /' + _this.spanRange.maxWidth + '</h5>' +
            '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
            divMask.appendChild(btnWidthResize);
            var divTitleAndType = document.createElement('div');
            divTitleAndType.className = 'divTitleAndType';
            divMask.appendChild(divTitleAndType);


            var $divTitle = $('<div class="divResize chartTitle">');
            var $labelTitle = $('<label for="title">').text(I18n.resource.dashboard.show.TITLE);
            var inputChartTitle = document.createElement('input');
            inputChartTitle.id = 'title';
            inputChartTitle.className = 'form-control';
            inputChartTitle.value = this.entity.modal.title;
            inputChartTitle.setAttribute('placeholder', I18n.resource.dashboard.show.TITLE_TIP);
            if (this.entity.modal.title != '') {
                inputChartTitle.style.display = 'none';
            }
            inputChartTitle.setAttribute('type', 'text');
            $divTitle.append($labelTitle).append($(inputChartTitle));
            divTitleAndType.appendChild($divTitle[0]);

            var $divType = $('<div class="divResize chartType">');
            var $labelType = $('<label>').text(I18n.resource.dashboard.show.TYPE);
            var chartType = document.createElement('span');
            chartType.innerHTML = I18n.findContent(this.optionTemplate.name);
            $divType.append($labelType).append($(chartType));
            divTitleAndType.appendChild($divType[0]);

            //ModalAnalysis类型(来自数据分析)不需要link wiki pop功能
            if (!(this instanceof ModalAnalysis)) {
                //link
                var $divLink = $('<div class="divResize chartLink">');
                var $labelLink = $('<label>').text(I18n.resource.dashboard.show.LINK_TO);
                var chartLink = document.createElement('select');
                chartLink.className = 'form-control';
                chartLink.options.add(new Option(I18n.resource.dashboard.show.SELECT_LINK, ''));
                for (var i in AppConfig.menu) {
                    var option = new Option(AppConfig.menu[i], i);
                    if (this.entity.modal.link == i) {
                        option.selected = 'selected';
                    }
                    chartLink.options.add(option);
                }
                chartLink.onchange = function () {
                    _this.entity.modal.link = chartLink.value;
                    _this.screen.isScreenChange = true;
                };
                $divLink.append($labelLink).append($(chartLink));
                divMask.appendChild($divLink[0]);

                //2016.09.13 在factory dashboard发布项目时 会偶发性的将账户名自动填充到iki id,pop id中 无法稳定性重现 先注释掉

                //wiki ID
                // var $divWiki = $('<div class="divResize chartId chartWiki">');
                // var $labelWiki = $('<label for="title">').text(I18n.resource.dashboard.show.WIKI_ID);
                // var inputChartWiki = document.createElement('input');
                // inputChartWiki.id = 'wikiId';
                // inputChartWiki.className = 'form-control';
                // inputChartWiki.value = this.entity.modal.wikiId?this.entity.modal.wikiId:'';
                // //inputChartPop.setAttribute('placeholder',I18n.resource.dashboard.show.DESC_TIP);
                // if(this.entity.modal.wikiId != ''  && this.entity.modal.wikiId != undefined){
                //     inputChartWiki.style.display = 'none';
                // }

                // $divWiki.append($labelWiki).append($(inputChartWiki));
                // divMask.appendChild($divWiki[0]);


                // var chartWikiShow = document.createElement('p');
                // chartWikiShow.innerHTML = inputChartWiki.value;
                // chartWikiShow.className = 'chartTitleShow';
                // $divWiki[0].appendChild(chartWikiShow);
                // if(this.entity.modal.wikiId == '' || this.entity.modal.wikiId == undefined){
                //     chartWikiShow.style.display = 'none';
                // }
                // chartWikiShow.onclick = function(){
                //     chartWikiShow.style.display = 'none';
                //     inputChartWiki.style.display = 'inline-block';
                //     inputChartWiki.focus();
                // };
                // inputChartWiki.onchange = function(){
                //     if (inputChartWiki.value != ''){
                //         inputChartWiki.style.display = 'none';
                //         chartWikiShow.style.display = 'inline';
                //     }
                //     chartWikiShow.innerHTML = inputChartWiki.value;
                //     _this.entity.modal.wikiId = inputChartWiki.value;
                //     _this.screen.isScreenChange = true;
                // };

                // var $btnCreateWiki = $('<button  type="button" class="btn btn-primary" style="padding: 3px;line-height: 1.2;">Wiki</button>');
                // $btnCreateWiki.click(function (){
                //     var modalWiki = _this.getInstanceOfModalWiki();
                //     if(_this.entity.modal.wikiId != ''){
                //         if(_this.wikis[_this.entity.modal.wikiId]){
                //             modalWiki.showWikiEdit(_this.wikis[_this.entity.modal.wikiId]);
                //         }else{
                //             WebAPI.get('/getWikiById/'+ _this.entity.modal.wikiId)
                //             .done(function (result) {
                //                 if(result.id){
                //                     _this.wikis[result.id] = result
                //                     modalWiki.showWikiEdit(result);
                //                 }else{
                //                     modalWiki.showWikiSearch();
                //                 }
                //             })
                //             .fail(function(result){
                //                 alert(result)
                //             });
                //         }
                //     }else{
                //         var modalWiki = _this.getInstanceOfModalWiki();
                //         modalWiki.showWikiSearch();
                //     }
                // });
                // $divWiki[0].appendChild($btnCreateWiki[0]);

                //Pop dataSourceId
                // var $divPop = $('<div class="divResize chartId chartPop">');
                // var $labelPop = $('<label for="title">').text(I18n.resource.dashboard.show.POP_ID);
                // var inputChartPop = document.createElement('input');
                // inputChartPop.id = 'popId';
                // inputChartPop.className = 'form-control';
                // inputChartPop.value = this.entity.modal.popId?this.entity.modal.popId:'';
                // //inputChartPop.setAttribute('placeholder',I18n.resource.dashboard.show.DESC_TIP);
                // if(this.entity.modal.popId != ''  && this.entity.modal.popId != undefined){
                //     inputChartPop.style.display = 'none';
                // }
                // $divPop.append($labelPop).append($(inputChartPop));
                // divMask.appendChild($divPop[0]);


                // var chartPopShow = document.createElement('p');
                // chartPopShow.innerHTML = inputChartPop.value;
                // chartPopShow.className = 'chartTitleShow';
                // $divPop[0].appendChild(chartPopShow);
                // if(this.entity.modal.popId == '' || this.entity.modal.popId == undefined){
                //     chartPopShow.style.display = 'none';
                // }
                // chartPopShow.onclick = function(){
                //     chartPopShow.style.display = 'none';
                //     inputChartPop.style.display = 'inline-block';
                //     inputChartPop.focus();
                // };
                // inputChartPop.onchange = function(){
                //     if (inputChartPop.value != ''){
                //         inputChartPop.style.display = 'none';
                //         chartPopShow.style.display = 'inline';
                //     }
                //     chartPopShow.innerHTML = inputChartPop.value;
                //     _this.entity.modal.popId = inputChartPop.value;
                //     _this.screen.isScreenChange = true;
                // };
            }


            ////description
            //var $divDesc = $('<div class="divResize chartDesc">');
            //var $labelDesc = $('<label for="title">').text(I18n.resource.dashboard.show.DESC);
            //var inputChartDesc = document.createElement('textarea');
            //inputChartDesc.id = 'description';
            //inputChartDesc.className = 'form-control';
            //inputChartDesc.value = this.entity.modal.desc?this.entity.modal.desc:'';
            //inputChartDesc.setAttribute('placeholder',I18n.resource.dashboard.show.DESC_TIP);
            //if(this.entity.modal.desc != ''  && this.entity.modal.desc != undefined){
            //    inputChartDesc.style.display = 'none';
            //}
            //$divDesc.append($labelDesc).append($(inputChartDesc));
            //divMask.appendChild($divDesc[0]);

            var chartTitleShow = document.createElement('p');
            chartTitleShow.innerHTML = inputChartTitle.value;
            chartTitleShow.className = 'chartTitleShow';
            $divTitle[0].appendChild(chartTitleShow);
            if (this.entity.modal.title == '' || this.entity.modal.title == undefined) {
                chartTitleShow.style.display = 'none';
            }
            chartTitleShow.onclick = function () {
                chartTitleShow.style.display = 'none';
                inputChartTitle.style.display = 'inline-block';
                inputChartTitle.focus();
            };
            inputChartTitle.onchange = function () {
                if (inputChartTitle.value != '') {
                    inputChartTitle.style.display = 'none';
                    chartTitleShow.style.display = 'inline';
                }
                chartTitleShow.innerHTML = inputChartTitle.value;
                _this.entity.modal.title = inputChartTitle.value;
                _this.screen.isScreenChange = true;
            };

            //var chartDescShow = document.createElement('p');
            //chartDescShow.innerHTML = inputChartDesc.value;
            //chartDescShow.className = 'chartDescShow';
            //$divDesc[0].appendChild(chartDescShow);
            //if(this.entity.modal.desc == ''){
            //    chartDescShow.style.display = 'none';
            //}
            //chartDescShow.onclick = function(){
            //    chartDescShow.style.display = 'none';
            //    inputChartDesc.style.display = 'block';
            //    inputChartDesc.focus();
            //};
            //inputChartDesc.onblur = function(){
            //    if (inputChartDesc.value != ''){
            //        inputChartDesc.style.display = 'none';
            //        chartDescShow.style.display = 'block';
            //    }
            //    chartDescShow.innerHTML = inputChartDesc.value;
            //    _this.entity.modal.desc = inputChartDesc.value;
            //};

            //如果entity的isRender为false,添加到chartsCt中
            this.container.parentNode.appendChild(divMask);
            if (this.entity.isNotRender) {//兼容ModalMix
                var parentId = undefined, subChartIds;
                if (this.screen.entity && this.screen.entity.id) {//observer
                    parentId = this.screen.entity.id;
                }
                if (this.screen.store && this.screen.store.layout[0]) {//factory
                    for (var i = 0, len = this.screen.store.layout[0].length, entity; i < len; i++) {
                        entity = this.screen.store.layout[0][i];
                        if (entity.modal.type == 'ModalMix' && entity.modal.option.subChartIds && entity.modal.option.subChartIds.length > 0) {
                            subChartIds = entity.modal.option.subChartIds;
                            for (var j = 0, l = subChartIds.length; j < l; j++) {
                                if (subChartIds[j].id == this.entity.id) {
                                    parentId = entity.id;
                                    break;
                                }
                            }
                        }
                        if (entity.modal.type == 'ModalAppBlind') {
                            if (!entity.modal.option) break;
                            if (entity.modal.option.length > 0 && entity.modal.option[0].subChartIds.length > 0) {
                                var opts = entity.modal.option;
                                for (var m = 0; m < opts.length; m++) {
                                    if (opts[m].subChartIds[0].id === this.entity.id) {
                                        parentId = entity.id;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (parentId) {
                    if (this.container.parentNode.parentNode.parentNode.className.indexOf('chartsCt') >= 0) return;
                    $(document.getElementById('divContainer_' + parentId)).find('.chartsCt')[0].appendChild(this.container.parentNode.parentNode);
                }
            }

            this.divResizeByToolInit();
            function btnConfig_clickEvent(e) {
                $('.springSel').removeClass('springSel');
                $(e.target).closest('.springContainer').addClass('springSel');
                _this.modalInit();
            }

            //drag event of replacing entity
            var divContainer = $(this.container).closest('.springContainer')[0];
            divMask.ondragstart = function (e) {
                //e.preventDefault();
                e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
            };
            divMask.ondragover = function (e) {
                e.preventDefault();
            };
            divMask.ondragleave = function (e) {
                e.preventDefault();
            };
            divContainer.ondrop = function (e) {
                e.stopPropagation();
                var sourceId = e.dataTransfer.getData("id");
                var $sourceParent, $targetParent;
                if (sourceId) {
                    var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                    $sourceParent = $('#divContainer_' + sourceId).parent();
                    $targetParent = $('#divContainer_' + targetId).parent();
                    //外部chart拖入组合图
                    if (!$sourceParent[0].classList.contains('chartsCt') && $targetParent[0].classList.contains('chartsCt')) {
                        _this.screen.insertChartIntoMix(sourceId, $(e.target).closest('.chartsCt')[0])
                    } else {//平级之间交换
                        if (_this.screen.screen) {//组合图内部交换
                            _this.screen.screen.replaceEntity(sourceId, targetId, _this.screen.entity.id);
                        } else {
                            _this.screen.replaceEntity(sourceId, targetId);
                        }
                    }
                }
                _this.screen.isScreenChange = true;
            }

            this.executeConfigMode();
        },

        //interface
        modalInit: function () {
            var _this = this;
            var dataItem = [], option;
            var dataTypeUnit;
            var type = false;
            if (_this.entity.modal.points != undefined) {
                if (_this.entity.modal.option && _this.entity.modal.option.paraType) {
                    for (var i = 0; i < _this.entity.modal.option.paraType.length; i++) {
                        dataTypeUnit = { dsId: [], dsType: '', dsName: [] };
                        dataTypeUnit.type = _this.entity.modal.option.paraType[i].type;

                        var arrId = [];
                        var arrItem = [];
                        for (var j = 0; j < _this.entity.modal.option.paraType[i].arrId.length; j++) {
                            arrId.push(_this.entity.modal.option.paraType[i].arrId[j]);
                        }
                        arrItem = AppConfig.datasource.getDSItemById(arrId);
                        for (var j = 0; j < _this.entity.modal.option.paraType[i].arrId.length; j++) {
                            var id = _this.entity.modal.option.paraType[i].arrId[j];
                            for (var m = 0; m < arrItem.length; m++) {
                                if (id == arrItem[m].id) {
                                    dataTypeUnit.dsId.push(id);
                                    dataTypeUnit.dsName.push(arrItem[m].alias);
                                    break;
                                }
                            }
                        }
                        dataItem.push(dataTypeUnit);
                    }
                } else {
                    dataTypeUnit = { dsId: [], dsType: '', dsName: [] };
                    var arrId = [];
                    var arrItem = [];
                    for (var i = 0; i < _this.entity.modal.points.length; i++) {
                        arrId.push(_this.entity.modal.points[i]);
                    }
                    arrItem = AppConfig.datasource.getDSItemById(arrId);
                    for (var i = 0; i < _this.entity.modal.points.length; i++) {
                        var id = _this.entity.modal.points[i];
                        for (var m = 0; m < arrItem.length; m++) {
                            if (id == arrItem[m].id) {
                                dataTypeUnit.dsId.push(id);
                                dataTypeUnit.dsName.push(arrItem[m].alias === "" ? arrItem[m].value : arrItem[m].alias);
                                break;
                            }
                        }
                    }
                    dataItem.push(dataTypeUnit);
                }
            }
            // deal with 'custom' mode
            if (_this.optionTemplate.mode === 'custom') {
                _this.showConfigModal && _this.showConfigModal();
                return;
            }
            //deal with 图元 报表章节
            if (_this.optionTemplate.type === 'ModalReportChapter') {
                _this.showConfigModal();
                return;
            }
            // Monitor页面
            if (_this.optionTemplate.type === 'ModalMonitor') {
                _this.showConfigModal();
                return;
            }
            //APP button页面
            if (_this.optionTemplate.type === 'ModalAppButton') {
                _this.showConfigModal();
                return;
            }
            //APP KPI监视页面
            if (_this.optionTemplate.type === 'ModalAppKPICollect') {
                _this.showConfigModal();
                return;
            }
            //Factory的报表章节
            if (_this.optionTemplate.type === 'ModalReportFactory') {
                _this.showConfigModal();
                return;
            }
            var tempOptionPara;
            _this.entity.modal.option ? tempOptionPara = _this.entity.modal.option : tempOptionPara = {};
            tempOptionPara.dataItem = dataItem;
            //if(_this.entity.modal.option && _this.entity.modal.option.dsChartCog){
            //    tempDsChartCog = _this.entity.modal.option.dsChartCog;
            //}else{
            //    tempDsChartCog = null;
            //}
            option = {
                modeUsable: _this.optionTemplate.mode,
                allDataNeed: _this.optionTemplate.modelParams ? _this.optionTemplate.modelParams.paraAnlysMode : true,
                rowDataType: _this.optionTemplate.modelParams ? _this.optionTemplate.modelParams.paraName : [I18n.resource.analysis.paneConfig.DATA_TYPE_DEFAULT],
                rowDataTypeShowName: _this.optionTemplate.modelParams ? _this.optionTemplate.modelParams.paraShowName : undefined,
                dataTypeMaxNum: [_this.optionTemplate.maxNum],
                templateType: _this.optionTemplate.type,
                dsChartCog: _this.entity.modal.dsChartCog ? _this.entity.modal.dsChartCog : null,
                optionPara: tempOptionPara
            };

            if (dataItem.length == 0) {
                type = true;
            }
            if (_this.screen.screen) {
                _this.screen.screen.modalConfigPane.showModalInit(type, option, _this);
            } else {
                _this.screen.modalConfigPane.showModalInit(type, option, _this);
            }
            _this.screen.isScreenChange = true;
        },

        showConfigModal: function () {
            this.initConfigModalOpt();
            //if(!this.configModal) {
            var ctn = this.screen.container.querySelector('.cfgModal');
            this.configModal = new ConfigModal(this.configModalOpt, ctn ? ctn : this.screen.container);
            this.configModal.init();
            //}
            this.configModal.show();
        },
        initConfigModalOpt: function () {
            var _this = this;
            this.configModalOpt.result.func = function (option) {
                _this.setModalOption(option);
                _this.render();
            }
        },
        setModalOption: function (option) {

        },
        divResizeByToolInit: function () {
            var _this = this;
            var $divContainer = $('#divContainer_' + _this.entity.id);
            var $divResize = $('.divResize');
            var $inputResize = $('.inputResize');
            $divContainer.find('#heightResize').mousedown(function (e) {
                $('.springConfigMask').attr('draggable', 'false');
                $('.springContent').attr('draggable', 'false');
                $(e.target).mousemove(function (e) {
                    $(e.target).closest('.springContainer').css('height', $(e.target).val() * _this.UNIT_HEIGHT + '%');
                    _this.entity.spanR = Number($(e.target).val());
                    $(e.target).next().text($(e.target).val() + ' /' + _this.spanRange.maxHeight);
                    if (_this.screen.screen) {//兼容ModalMix
                        _this.screen.screen.setEntity(_this.entity);
                    } else {
                        _this.screen.setEntity(_this.entity);
                    }
                });
            }).mouseup(function (e) {
                $('.springConfigMask').attr('draggable', 'true');
                $('.springContent').attr('draggable', 'true');
                $(e.target).off('mousemove');
                if (_this.chart) _this.chart.resize();
                _this.screen.isScreenChange = true;
                _this.hasEdit = true;
            });
            $divContainer.find('#widthResize').mousedown(function (e) {
                $('.springConfigMask').attr('draggable', 'false');
                $('.springContent').attr('draggable', 'false');
                $(e.target).mousemove(function (e) {
                    $(e.target).closest('.springContainer').css('width', $(e.target).val() * _this.UNIT_WIDTH + '%');
                    _this.entity.spanC = Number($(e.target).val());
                    $(e.target).next().text($(e.target).val() + ' /' + _this.spanRange.maxWidth);
                    if (_this.screen.screen) {//兼容ModalMix
                        _this.screen.screen.setEntity(_this.entity);
                    } else {
                        _this.screen.setEntity(_this.entity);
                    }
                });
            }).mouseup(function (e) {
                $('.springConfigMask').attr('draggable', 'true');
                $('.springContent').attr('draggable', 'true');
                $(e.target).off('mousemove');
                if (_this.chart) _this.chart.resize();
                _this.screen.isScreenChange = true;
                _this.hasEdit = true;
            });
            $divContainer.find('.rangeVal').click(function (e) {
                e.stopPropagation();
                var valueCurrent = Number($(e.target).prev().val());
                var valuePre = $(e.target).prev().val();
                var valueMax = Number($(e.target).prevAll('.inputResize').attr('max'));
                var valueMin = Number($(e.target).prevAll('.inputResize').attr('min'));
                $(e.target).nextAll('.rangeChange').css('display', 'inline-block').focus().off('blur').blur(function (e) {
                    valueCurrent = Number($(e.target).val());
                    if (valueCurrent <= valueMax && valueCurrent >= valueMin) {
                        $(e.target).prevAll('.inputResize').val(valueCurrent.toString());
                        if ($(e.target).prevAll('.inputResize').attr('id') == 'widthResize') {
                            $(e.target).closest('.springContainer').css('width', $(e.target).val() * _this.UNIT_WIDTH + '%');
                            _this.entity.spanC = Number($(e.target).val());
                            _this.screen.setEntity(_this.entity);
                            $(e.target).prev().text($(e.target).val() + ' /' + _this.spanRange.maxWidth);
                            if (_this.chart) _this.chart.resize();
                            _this.hasEdit = true;
                        } else {
                            $(e.target).closest('.springContainer').css('height', $(e.target).val() * _this.UNIT_HEIGHT + '%');
                            _this.entity.spanR = Number($(e.target).val());
                            _this.screen.setEntity(_this.entity);
                            $(e.target).prev().text($(e.target).val() + ' /' + _this.spanRange.maxHeight);
                            if (_this.chart) _this.chart.resize();
                            _this.hasEdit = true;
                        }
                        $(e.target).css('display', 'none');
                    } else if (valueCurrent > valueMax) {
                        new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR1 + "</strong>").show().close();
                        $(e.target).val(valuePre).css('display', 'none');
                    } else if (valueCurrent < valueMin) {
                        new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR2 + "</strong>").show().close();
                        $(e.target).val(valuePre).css('display', 'none');
                    } else {
                        if ($(e.target).val() != "") {
                            new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR3 + "</strong>").show().close();
                        }
                        $(e.target).val(valuePre).css('display', 'none');
                    }
                    _this.hasEdit && (_this.screen.isScreenChange = true);
                })
            });
        },
        divResizeByMouseInit: function () {
            var _this = this;
            var $widthResize;
            var $heightResize;
            var divContainer = $('#divContainer_' + _this.entity.id).get(0);
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
            var w, h, tempSpanR, tempSpanC;
            resizeOnRight.onmousedown = function (e) {
                e.stopPropagation();
                if (e.button != 0) return;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0) {
                    $possibleParent.attr('draggable', false)
                }
                $(e.target).prev().children(':last-child').attr('draggable', false);
                $widthResize = $(e.target).parent().find('#widthResize');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                rightStart.x = resizeOnRight.offsetLeft;
                doResizeOnRight(e);
                if (resizeOnRight.setCapture) {
                    resizeOnRight.onmousemove = doResizeOnRight;
                    resizeOnRight.onmouseup = stopResizeOnRight;
                    resizeOnRight.setCapture();
                } else {
                    document.addEventListener("mousemove", doResizeOnRight, false);
                    document.addEventListener("mouseup", stopResizeOnRight, false);
                }
            };
            function doResizeOnRight(e) {
                var oEvent = e || event;
                var l = oEvent.clientX - mouseStart.x + rightStart.x;
                w = l + resizeOnCorner.offsetWidth;
                if (w < resizeOnCorner.offsetWidth) {
                    w = resizeOnCorner.offsetWidth;
                }
                else if (w > document.documentElement.clientWidth - divContainer.offsetLeft) {
                    w = document.documentElement.clientWidth - divContainer.offsetLeft - 2;
                }
                //w = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH)) * _this.UNIT_WIDTH;
                divContainer.style.width = w + "px";
            }
            function stopResizeOnRight(e) {
                if (resizeOnRight.releaseCapture) {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /' + _this.spanRange.maxWidth);
                    $widthResize.next().next().val(tempSpanC.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    _this.entity.spanC = tempSpanC;
                    resizeOnRight.onmousemove = null;
                    resizeOnRight.onmouseup = null;
                    resizeOnRight.releaseCapture();
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                } else {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /' + _this.spanRange.maxWidth);
                    $widthResize.next().next().val(tempSpanC.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    _this.entity.spanC = tempSpanC;
                    document.removeEventListener("mousemove", doResizeOnRight, false);
                    document.removeEventListener("mouseup", stopResizeOnRight, false);
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                }
                _this.screen.isScreenChange = true;
                $(e.target).prev().children(':last-child').attr('draggable', true);
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0) {
                    $possibleParent.attr('draggable', true)
                }
            }
            resizeOnBottom.onmousedown = function (e) {
                e.stopPropagation();
                if (e.button != 0) return;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0) {
                    $possibleParent.attr('draggable', false)
                }
                $(e.target).prev().children(':last-child').attr('draggable', false);
                $heightResize = $(e.target).parent().find('#heightResize');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                bottomStart.y = resizeOnBottom.offsetTop;
                doResizeOnBottom(e);
                if (resizeOnBottom.setCapture) {
                    resizeOnBottom.onmousemove = doResizeOnBottom;
                    resizeOnBottom.onmouseup = stopResizeOnBottom;
                    resizeOnBottom.setCapture();
                } else {
                    document.addEventListener("mousemove", doResizeOnBottom, false);
                    document.addEventListener("mouseup", stopResizeOnBottom, false);
                }
            };
            function doResizeOnBottom(e) {
                var oEvent = e || event;
                var t = oEvent.clientY - mouseStart.y + bottomStart.y;
                h = t + resizeOnCorner.offsetHeight;
                if (h < resizeOnCorner.offsetHeight) {
                    h = resizeOnCorner.offsetHeight;
                } else if (h > document.documentElement.clientHeight - divContainer.offsetTop) {
                    h = document.documentElement.clientHeight - divContainer.offsetTop - 2;
                }
                //h = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT)) * _this.UNIT_HEIGHT;
                divContainer.style.height = h + "px";
            }
            function stopResizeOnBottom(e) {
                if (resizeOnBottom.releaseCapture) {
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $heightResize.val(tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /' + _this.spanRange.maxHeight);
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanR = tempSpanR;
                    resizeOnBottom.onmousemove = null;
                    resizeOnBottom.onmouseup = null;
                    resizeOnBottom.releaseCapture();
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                } else {
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $heightResize.val(tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /' + _this.spanRange.maxHeight);
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanR = tempSpanR;
                    document.removeEventListener("mousemove", doResizeOnBottom, false);
                    document.removeEventListener("mouseup", stopResizeOnBottom, false);
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                }
                _this.screen.isScreenChange = true;
                $(e.target).prev().children(':last-child').attr('draggable', true);
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0) {
                    $possibleParent.attr('draggable', true)
                }
            }
            resizeOnCorner.onmousedown = function (e) {
                e.stopPropagation();
                if (e.button != 0) return;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0) {
                    $possibleParent.attr('draggable', false)
                }
                $(e.target).prev().children(':last-child').attr('draggable', false);
                $widthResize = $(e.target).parent().find('#widthResize');
                $heightResize = $(e.target).parent().find('#heightResize');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                divStart.x = resizeOnCorner.offsetLeft;
                divStart.y = resizeOnCorner.offsetTop;
                doResizeOnCorner(e);
                if (resizeOnCorner.setCapture) {
                    resizeOnCorner.onmousemove = doResizeOnCorner;
                    resizeOnCorner.onmouseup = stopResizeOnCorner;
                    resizeOnCorner.setCapture();
                } else {
                    document.addEventListener("mousemove", doResizeOnCorner, false);
                    document.addEventListener("mouseup", stopResizeOnCorner, false);
                }
                //zhezhao.style.display='block';
            };
            function doResizeOnCorner(e) {
                var oEvent = e || event;
                var l = oEvent.clientX - mouseStart.x + divStart.x;
                var t = oEvent.clientY - mouseStart.y + divStart.y;
                w = l + resizeOnCorner.offsetWidth;
                h = t + resizeOnCorner.offsetHeight;
                if (w < resizeOnCorner.offsetWidth) {
                    w = resizeOnCorner.offsetWidth;
                }
                else if (w > document.documentElement.clientWidth - divContainer.offsetLeft) {
                    w = document.documentElement.clientWidth - divContainer.offsetLeft - 2;
                }
                if (h < resizeOnCorner.offsetHeight) {
                    h = resizeOnCorner.offsetHeight;
                } else if (h > document.documentElement.clientHeight - divContainer.offsetTop) {
                    h = document.documentElement.clientHeight - divContainer.offsetTop - 2;
                }
                //w = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH)) * _this.UNIT_WIDTH;
                divContainer.style.width = w + "px";
                //h = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT)) * _this.UNIT_HEIGHT;
                divContainer.style.height = h + "px";
            }
            function stopResizeOnCorner(e) {
                if (resizeOnCorner.releaseCapture) {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString()).get(0).setAttribute('value', tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /' + _this.spanRange.maxWidth);
                    $widthResize.next().next().val(tempSpanC.toString());
                    $heightResize.val(tempSpanR.toString()).get(0).setAttribute('value', tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /' + _this.spanRange.maxHeight);
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanC = tempSpanC;
                    _this.entity.spanR = tempSpanR;
                    resizeOnCorner.onmousemove = null;
                    resizeOnCorner.onmouseup = null;
                    resizeOnCorner.releaseCapture();
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                } else {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /' + _this.spanRange.maxWidth);
                    $widthResize.next().next().val(tempSpanC.toString());
                    $heightResize.val(tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /' + _this.spanRange.maxHeight);
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanC = tempSpanC;
                    _this.entity.spanR = tempSpanR;
                    document.removeEventListener("mousemove", doResizeOnCorner, false);
                    document.removeEventListener("mouseup", stopResizeOnCorner, false);
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                }
                _this.screen.isScreenChange = true;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0) {
                    $possibleParent.attr('draggable', true)
                }
                $(e.target).prev().children(':last-child').attr('draggable', true);
                //zhezhao.style.display='none';
            }
            function rangeJudge() {
                if (tempSpanC > _this.spanRange.maxWidth) {
                    tempSpanC = _this.spanRange.maxWidth
                } else if (tempSpanC < _this.spanRange.minWidth) {
                    tempSpanC = _this.spanRange.minWidth
                }
                if (tempSpanR > _this.spanRange.maxHeight) {
                    tempSpanR = _this.spanRange.maxHeight
                } else if (tempSpanR < _this.spanRange.minHeight) {
                    tempSpanR = _this.spanRange.minHeight
                }
            }
        },

        initPointAlias: function (arrPoints) {
            var arrPointsAlias = [];
            var lastRepeatIndex = -1;
            var tempAlias;
            var repeatNum = 0;
            var tempIndex;

            var arrId = [];
            var arrItem = [];
            for (var i = 0; i < arrPoints.length; ++i) {
                arrId.push(arrPoints[i].dsItemId);
            }
            arrItem = AppConfig.datasource.getDSItemById(arrId);
            for (var i = 0; i < arrPoints.length; ++i) {
                for (var m = 0; m < arrItem.length; m++) {
                    if (arrPoints[i].dsItemId == arrItem[m].id) {
                        arrPointsAlias.push(arrItem[m].alias);
                        break;
                    }
                }
                //arrPointsAlias.push(AppConfig.datasource.getDSItemById(arrPoints[i].dsItemId).alias);
            }
            for (var i = 0 ; i < arrPoints.length; ++i) {
                lastRepeatIndex = arrPointsAlias.lastIndexOf(arrPointsAlias[i]);
                if (lastRepeatIndex > i) {
                    repeatNum = 1;
                    tempAlias = arrPointsAlias[i];
                    arrPointsAlias[i] = tempAlias + '_No1';
                    tempIndex = i;
                    for (var j = tempIndex + 1; j < lastRepeatIndex + 1 ; j++) {
                        repeatNum += 1;
                        tempIndex = arrPointsAlias.indexOf(tempAlias);
                        if (tempIndex == -1) break;
                        arrPointsAlias[tempIndex] = tempAlias + '_No' + repeatNum;
                    }
                }
            }
            return arrPointsAlias;
        },

        // close
        close: function () {
            if (this.chart) {
                //this.chart.clear();
                this.chart.dispose();
            }
            this.container = null;
            this.entity = null;
            this.executeConfigMode = null;
            this.executeRender = null;
            this.executeUpdate = null;
            // this.modalWikiCtr = null;
            this.screen = null;
            this.isConfigMode = null;
            this.reportScreen = null;
            typeof this._close === 'function' && this._close();
        },

        //pop
        renderPop: function (pop) {
            if (!pop) return;
            var $target = $('#divContainer_' + this.entity.id).find('.panel');
            var $panePop = $target.find('.panePop');
            var tpl = '<div class="divMove"><span>{popMsg}</span></div>\
                <span class="glyphicon glyphicon-remove-circle btnClosePop" title="Close"></span>';
            if (!$panePop[0]) {
                $panePop = $('<div class="panel-body panePop"></div>');
                $target.append($panePop);
            }
            $panePop.html(tpl.formatEL({
                popMsg: pop.data
            }));//pop.data
            var spanWidth = $panePop.find('span').width();
            var $divMove = $panePop.find('.divMove');
            if (spanWidth > $divMove.width()) {
                var $marquee = $('<marquee direction="left" onmouseover="this.stop()" onmouseout="this.start()" scrollAmount="3" style="height: 40px; width: calc(100% - 28px);"></marquee>');
                $marquee.html($panePop.find('span').html());
                $marquee.appendTo($panePop);
                $divMove.remove();
            }

            //events
            $panePop.find('.btnClosePop').off().click(function () {
                $panePop.hide();
            });
        },

        // getInstanceOfModalWiki: function(){
        //     if(!this.modalWikiCtr){
        //         this.modalWikiCtr = new ModalWiki(this);
        //     }
        //     return this.modalWikiCtr;
        // }
    };
    return ModalBase;
})();

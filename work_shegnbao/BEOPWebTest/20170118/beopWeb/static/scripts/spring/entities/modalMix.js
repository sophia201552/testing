/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalMix = (function(){
    function ModalMix(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        !this.entity.modal.option && (this.entity.modal.option = {});
        !this.entity.modal.option.subChartIds && (this.entity.modal.option.subChartIds = []);
        !this.entity.modal.option.displayInterval && (this.entity.modal.option.displayInterval = 20);
    };
    ModalMix.prototype = new ModalBase();
    ModalMix.prototype.optionTemplate = {
        name:'toolBox.modal.MIX',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalMix',
        tooltip: {
            'imgPC': true,
            'imgMobile': true,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalMix.prototype.show = function(){
        this.init();
    }

    ModalMix.prototype.init = function(){
        this.container.style.overflowX = 'hidden';
        this.container.style.overflowY = 'auto';
    }

    ModalMix.prototype.initContainer = function (replacedElementId) {
        var divParent = document.getElementById('divContainer_' + this.entity.id);
        var isNeedCreateDivParent = false;
        var scrollClass = ' gray-scrollbar scrollY';

        if ((!divParent) || replacedElementId) {
            isNeedCreateDivParent = true;
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
        }else {
            isNeedCreateDivParent && this.screen.container.appendChild(divParent);
        }

        $(divParent).addClass('springContainer');
        if(AppConfig.isMobile || this.screen.isForMobile || (this.screen.options && this.screen.options.isForMobile) || (this.screen.screen && this.screen.screen.options && this.screen.screen.options.isForMobile)) {
            this.spanRange = {
                minWidth: 1,
                maxWidth: 3,
                minHeight: 1,
                maxHeight: 4.5,
                yScale : 4/3,
                xScale : 4
            };
        }else{
            this.spanRange = {
                minWidth: this.optionTemplate.minWidth,
                maxWidth: this.optionTemplate.maxWidth,
                minHeight: this.optionTemplate.minHeight,
                maxHeight: this.optionTemplate.maxHeight,
                yScale : 1,
                xScale : 1
            };
        }
        //adapt ipad 1024px
        //var styleHeight = '';
        //if(!this.entity.modal.title){
        //    styleHeight = 'height:100%;';
        //}else{
        //    styleHeight = 'height:calc(100% - 38px);';
        //}
        if (AppConfig.isMobile || (this.screen.options && this.screen.options.isForMobile) || (this.screen.screen && this.screen.screen.options && this.screen.screen.options.isForMobile)) {
            var height = 100;
            //if((this.optionTemplate.scroll === false || this.entity.scroll === false) && !(this.screen.options && this.screen.options.isConfig)){
            //    divParent.className += ' noScroll';
            //} else {
                height = this.UNIT_HEIGHT * this.entity.spanR * this.spanRange.yScale;
                height > 100 && (height = 100);
                divParent.style.height = height + '%';
            //}
            divParent.style.width = this.UNIT_WIDTH * this.entity.spanC * this.spanRange.xScale + '%';
            if (this.UNIT_WIDTH * this.entity.spanC * this.spanRange.xScale > 100){
                divParent.style.width = '100%';
            }
            if (this.UNIT_HEIGHT * this.entity.spanR * this.spanRange.yScale > 100){
                divParent.style.height = '100%';
            }
        } else {
            divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR + '%';
            divParent.style.width = this.UNIT_WIDTH * this.entity.spanC + '%';
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
                <span class="springSeHead fontTemp6">' + (this.entity.modal.title ? this.entity.modal.title : '') + '</span>\
                <div class="panel-body springContent' + scrollClass + '" style="position: relative;height:100%;"></div>\
            </div>';
        }
        //如果是移动端,背景设置为透明
        if (AppConfig.isMobile || (this.screen.options && this.screen.options.isForMobile) || (this.screen.screen && this.screen.screen.options && this.screen.screen.options.isForMobile)) {
            divParent.children[0].classList.add('transparent');
        }

        //按钮容器:锚链接,历史数据,wiki
        if(!(this instanceof ModalAnalysis)){
            var divBtnCtn = document.createElement('div');
            divBtnCtn.className = 'springLinkBtnCtn';

            var domPanel = divParent.getElementsByClassName('panel')[0];

            // jump button
            if (this.entity.modal.points && this.entity.modal.points.length > 0) {
                var lkJump;
                lkJump = document.createElement('a');
                lkJump.className = 'springLinkBtn';
                lkJump.title = 'Add to datasource';
                lkJump.href = 'javascript:;';
                lkJump.innerHTML = '<span class="glyphicon glyphicon-export"></span>';
                divBtnCtn.appendChild(lkJump);
                lkJump.onclick = function() {
                    new ModalAppendPointToDs(true, _this.entity.modal.points, null).show();
                }
           }

            //锚链接 start
            var link = this.entity.modal.link;
            var _this = this;
            if(link && AppConfig.menu[link]){
                var linkBtn = document.createElement('a');
                linkBtn.className = 'springLinkBtn';
                linkBtn.innerHTML = '<span class="glyphicon glyphicon-link"></span>';
                linkBtn.setAttribute('pageid',link);
                linkBtn.title = 'Link to ' + AppConfig.menu[link];
                divBtnCtn.appendChild(linkBtn);
                linkBtn.onclick = function(e){
                    var $ev =  $('#ulPages [pageid="'+ link +'"]');
                    if($ev[0].className != 'nav-btn-a'){
                        $ev = $ev.children('a');
                        $ev.closest('.dropdown').children('a').trigger('click');
                    }
                    $ev.trigger('click');
                }
            }

            domPanel.appendChild(divBtnCtn);
        }

        this.container = divParent.getElementsByClassName('springContent')[0];

        return this;
    }

    ModalMix.prototype.renderModal = function (e) {
        var _this = this;
        var $sliderCont;
        var $sliderDiv = $('.sliderDiv');
        //是否以slider形式显示判断字段
        //兼容老数据,默认播放间隔为5s
        if(_this.entity.modal.option.displaySlider && !_this.entity.modal.option.displayInterval){
            _this.entity.modal.option.displayInterval = 5;
        }
        var displaySlider = _this.entity.modal.option.displayInterval;
        var carouselTime = new Date();

        this.container.classList.add('modalMix');
        if (displaySlider && displaySlider != '0') {
            $sliderDiv = $('\
                                <div id="carousel_' + carouselTime.getTime() + '" class="carousel slide sliderDiv" data-ride="carousel">' +
                                 '<ol class="carousel-indicators" style="bottom:-6px;">' +
                                 '</ol><div class="carousel-inner" role="listbox">' +
                                 '</div>' +
                                 '<a class="left carousel-control" href="#carousel_' + carouselTime.getTime() + '" role="button" data-slide="prev">' +
                                 '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true" style="transform: scale(1,1.3)"></span><span class="sr-only">Previous</span></a>' +
                                 '<a class="right carousel-control" href="#carousel_' + carouselTime.getTime() + '" role="button" data-slide="next">' +
                                 '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true" style="transform: scale(1,1.3)"></span><span class="sr-only">Next</span></a>' +
                                 '</div>');
            $(_this.container).append($sliderDiv);
            if(AppConfig.isMobile){
                $(_this.container).append('<style>.carousel-indicators .active{background-color: rgb(242,199,83);border: none;width: 12px;height: 3px;border-radius: 0;}.carousel-indicators li{background-color: rgba(228, 228, 228,0.5);border-width: 0;width: 12px;height: 3px;margin:1.5px!important;}</style>');
                $('.carousel-control', _this.container).addClass('hidden');
                //绑定左右滑动事件
                this.attachEventSlider();
            }
        }
        if (!this.entity.modal.option || !this.entity.modal.option.subChartIds) return;
        var index = 0;
        this.entity.modal.option.subChartIds.forEach(function (obj) {
            for (var i = 0, item; i < _this.screen.store.layout.length; i++) {
                if (displaySlider && displaySlider != '0') {
                    $(_this.container).css({ 'display': 'block', 'overflow-y': 'hidden' });
                    for (var z = 0; z < _this.screen.store.layout[i].length; z++) {
                        item = _this.screen.store.layout[i][z];
                        if (obj.id != item.id) continue;
                        var modelClass, entity;
                        _this.screen.store.layout[i][z].spanC = 12;
                        
                        var $sliderIner = $('<div class="item sliderIner"><div class="carousel-caption" style="height:100%;width:100%;right:0;left:0;padding-bottom:0;bottom:0px;padding-top:0px;"></div></div>');
                        var $sliderDot = $('<li data-target="#carousel_' + carouselTime.getTime() + '" data-slide-to="' + index + '" style="border-color:#aaa;margin:1.5px 3px;"></li>')
                        if (item.modal.type && item.modal.type != 'ModalNone') {
                            //regist IoC
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            if (!modelClass) continue;
                            if (item.isNotRender && _this.entity.modal.type == 'ModalMix') {
                                //_this.screen.container = document.getElementById('divContainer_' + _this.entity.id);
                                entity = new modelClass(_this, item);
                                _this.screen.listEntity[item.id] = entity;
                                if(item.modal.type==='ModalAppButton'){
                                    if (entity) {
                                        $(entity.container).height($(_this.container).height() - 30);
                                        $(entity.container).width($(_this.container).width());
                                    }
                                    entity.render();
                                    $sliderCont = $(_this.container).children('.springContainer');
                                    $sliderIner.children('.carousel-caption').append($sliderCont);
                                    $sliderIner.height($(_this.container).height());
                                    $sliderDiv.children('.carousel-inner').append($sliderIner);
                                    $sliderDiv.children('.carousel-indicators').append($sliderDot);
                                    ++index;
                                    continue;
                                }
                                if ($.inArray(item.id, _this.screen.arrEntityOrder) < 0) {
                                    _this.screen.arrEntityOrder.push(item.id);
                                }
                                if (item.modal.interval && item.modal.interval >= 0) {
                                    for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                                        point = item.modal.points[k];
                                        if (_this.screen.requestPoints.indexOf(point) < 0) {
                                            _this.screen.requestPoints.push(point);
                                        }
                                    }
                                }
                                if (item.modal.popId) {
                                    if (!_this.screen.dictPopToEntity[item.modal.popId]) _this.screen.dictPopToEntity[item.modal.popId] = [];
                                    _this.screen.dictPopToEntity[item.modal.popId].push(item.id);
                                    if (_this.screen.requestPoints.indexOf(item.modal.popId) < 0) {
                                        _this.screen.requestPoints.push(item.modal.popId);
                                    }
                                }

                                if (entity) {
                                    if(AppConfig.isMobile ||( _this.screen.options && _this.screen.options.isForMobile)){
                                        $(entity.container).height($(_this.container).height()-40);//App上slider点在图下面
                                    }else{
                                        if(entity.entity.modal.title!==''){
                                            $(entity.container).height($(_this.container).height()-60);
                                        }else{
                                            $(entity.container).height($(_this.container).height()-30);
                                        }
                                    }
                                    $(entity.container).width($(_this.container).width());
                                }
                                entity.render();
                            }
                        } else if (item.modal.type == 'ModalNone') {
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            entity = new modelClass(_this, item);
                            _this.screen.listEntity[item.id] = entity;
                            _this.screen.arrEntityOrder.push(item.id);
                            if (entity) {
                                $(entity.container).height($(_this.container).height() - 30);
                                $(entity.container).width($(_this.container).width());
                            }
                            entity.render();
                            _this.screen.isForReport && entity.configure();
                        }
                        $sliderCont = $(_this.container).children('.springContainer'); 
                        $sliderIner.children('.carousel-caption').append($sliderCont);
                        $sliderIner.height($(_this.container).height()-6);
                        $sliderDiv.children('.carousel-inner').append($sliderIner);
                        $sliderDiv.children('.carousel-indicators').append($sliderDot);
                        ++index;
                    }
                } else {
                    $(_this.container).css({ 'display': 'flex', 'overflow-y': 'auto', 'flex-flow': 'wrap' });
                    for (var j = 0; j < _this.screen.store.layout[i].length; j++) {
                        item = _this.screen.store.layout[i][j];
                        if (obj.id != item.id) continue;
                       // _this.screen.store.layout[i][j].spanC = 6;
                        var modelClass, entity;
                        if (item.modal.type && item.modal.type != 'ModalNone') {
                            //regist IoC
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            if (!modelClass) continue;
                            if (item.isNotRender && _this.entity.modal.type == 'ModalMix') {
                                //_this.screen.container = document.getElementById('divContainer_' + _this.entity.id);
                                entity = new modelClass(_this, item);
                                _this.screen.listEntity[item.id] = entity;
                                if(item.modal.type==='ModalAppButton'){
                                    entity.render();
                                    continue;
                                }
                                if ($.inArray(item.id, _this.screen.arrEntityOrder) < 0) {
                                    _this.screen.arrEntityOrder.push(item.id);
                                }
                                if (item.modal.interval && item.modal.interval >= 0) {
                                    for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                                        point = item.modal.points[k];
                                        if (_this.screen.requestPoints.indexOf(point) < 0) {
                                            _this.screen.requestPoints.push(point);
                                        }
                                    }
                                }
                                if (item.modal.popId) {
                                    if (!_this.screen.dictPopToEntity[item.modal.popId]) _this.screen.dictPopToEntity[item.modal.popId] = [];
                                    _this.screen.dictPopToEntity[item.modal.popId].push(item.id);
                                    if (_this.screen.requestPoints.indexOf(item.modal.popId) < 0) {
                                        _this.screen.requestPoints.push(item.modal.popId);
                                    }
                                }
                                entity.render();
                            }
                        } else if (item.modal.type == 'ModalNone') {
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            entity = new modelClass(_this, item);
                            _this.screen.listEntity[item.id] = entity;
                            _this.screen.arrEntityOrder.push(item.id);
                            entity.render();
                            _this.screen.isForReport && entity.configure();
                        }
                    }
                }
            }
        });
        if (displaySlider) {
            if ($(_this.container).find('.item:first')) {
                $(_this.container).find('.item:first').addClass('active');
            }
            if ($(_this.container).find('.carousel-indicators').children(':first')) {
                $(_this.container).find('.carousel-indicators').children(':first').addClass('active');
            }
            $(_this.container).find('.sliderDiv').carousel({interval: this.entity.modal.option.displayInterval * 1000});
        }
        if(this.entity.modal.option.bgColor){//背景颜色
            this.container.style.backgroundColor = this.entity.modal.option.bgColor;
            $(this.container).find('.panel.panel-default').css('cssText', 'background-color:transparent !important')
        }
    }

    ModalMix.prototype.showConfigMode = function () {}

    ModalMix.prototype.updateModal = function (points) {
        for(var i in points){
            var data = points[i].data;
            if(!isNaN(data)){
                data = parseFloat(data).toFixed(2);
            }
            $('#'+points[i].dsItemId).html(data);
        }
    }

    ModalMix.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    }

    ModalMix.prototype.configure = function () {
        if(this.spinner) this.spinner.stop();
        var _this = this;
        if (this.chart) this.chart.clear();
        this.divResizeByMouseInit();

        var divMask = document.createElement('div');
        divMask.className = 'springConfigMask';
        divMask.draggable = 'true';

        var btnRemove = document.createElement('span');
        btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
        btnRemove.title = 'Remove';
        btnRemove.onclick = function (e) {
            confirm('Are you sure you want to delete it ?', function () {
                if (_this.chart) _this.chart.clear();
                if(_this.entity.modal.option.subChartIds.length>0){
                    var subChartsIdsMix = _this.entity.modal.option.subChartIds;
                    for(var i = 0;i<subChartsIdsMix.length;i++){
                        var item = subChartsIdsMix[i];
                        for(var j = 0;j<_this.screen.arrEntityOrder.length;j++){
                            if(item.id===_this.screen.arrEntityOrder[j]){
                                _this.screen.removeEntity(_this.screen.arrEntityOrder[j]);
                            }
                        }
                    }
                   _this.entity.modal.option.subChartIds = [];
                }
                var oldIndex = _this.screen.arrEntityOrder.indexOf(_this.entity.id);
                _this.screen.removeEntity(_this.entity.id);

                //重新生成窗口
                var entity = new ModalNone(_this.screen, {
                    id: _this.entity.id,
                    spanC: _this.entity.spanC,
                    spanR: _this.entity.spanR,
                    modal: {type:"ModalNone"}
                }, _this.entity.id);
                _this.screen.arrEntityOrder.splice(oldIndex,0,entity.entity.id);
                _this.screen.listEntity[entity.entity.id] = entity;
                entity.render();
                entity.configure();
                entity.hasEdit = true;
                _this = null;
            })
        };
        divMask.appendChild(btnRemove);

        //add button for mix
        var btnAdd = document.createElement('span');
        btnAdd.className = 'glyphicon glyphicon-plus-sign springConfigAddBtn grow';
        btnAdd.title = 'Add';
        btnAdd.onclick = function (e) {
            //创建一个modalNone
            var spanC = 6, spanR = 6;
            //height width 和最后一个节点一样
            var $chartsCt =_this.container.classList.contains('chartsCt') ? $(_this.container) : $(_this.container).siblings().find('.chartsCt');
            if($chartsCt.children().length > 0){
                var lastDiv = $chartsCt.children()[$chartsCt.children().length - 1];
                spanR = Number(lastDiv.querySelector('#heightResize').value);
                spanC = Number(lastDiv.querySelector('#widthResize').value);
            }

            if(!_this.container.classList.contains('chartsCt')){
                //_this.container = _this.container.nextElementSibling.children[6];
                _this.container = _this.container.parentElement.getElementsByClassName('chartsCt')[0];
            }
            var entity = new ModalNone(_this, {
                    id: (+new Date()).toString(),
                    spanC: spanC,
                    spanR: spanR,
                    modal: { type: "ModalNone" },
                    isNotRender: true
                });
                _this.screen.arrEntityOrder.push(entity.entity.id);
                _this.screen.listEntity[entity.entity.id] = entity;

                if(!_this.entity.modal.option){
                    _this.entity.modal.option = {};
                    _this.entity.modal.option.subChartIds = new Array();
                }
                _this.entity.modal.option.subChartIds.push({ id: entity.entity.id });
                entity.render();
                entity.configure();
        };
        divMask.appendChild(btnAdd);
        //install button for mix
        var btnInstall = document.createElement('span');
        btnInstall.className = 'glyphicon glyphicon-cog springConfigInstallBtn grow';
        btnInstall.title = 'config';

        btnInstall.onclick = function (e) {
            _this.showConfigModal();
        }
        divMask.appendChild(btnInstall);

        var btnHeightResize = document.createElement('div');

        if(AppConfig.isMobile || this.screen.isForMobile || (this.screen.options && this.screen.options.isForMobile)){
            this.entity.spanC = this.optionTemplate.maxWidth = this.optionTemplate.minWidth = 3;//宽度固定
            this.optionTemplate.maxHeight = 4.5;//最大高度修改
            (this.entity.spanR > this.optionTemplate.maxHeight) && (this.entity.spanR = this.optionTemplate.maxHeight);
        }
        var maxHeight = this.optionTemplate.maxHeight;
        var maxWidth = this.optionTemplate.maxWidth;
        var minHeight = this.optionTemplate.minHeight;
        var minWidth = this.optionTemplate.minWidth;
        btnHeightResize.className = 'divResize divHeightResize';
        btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
        '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanR + ' /'+ maxHeight + '</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
        divMask.appendChild(btnHeightResize);
        var btnWidthResize = document.createElement('div');
        btnWidthResize.className = 'divResize divWidthResize';
        btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
        '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanC + ' /'+ maxWidth +'</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
        divMask.appendChild(btnWidthResize);
        var divTitleAndType = document.createElement('div');
        divTitleAndType.className = 'divTitleAndType';
        divMask.appendChild(divTitleAndType);

        //chartCt
        var $chartCt = $('<div class="divResize chartsCt gray-scrollbar">');
        divMask.appendChild($chartCt[0]);


        var $divTitle = $('<div class="divResize chartTitle">');
        var $labelTitle = $('<label for="title">').text(I18n.resource.dashboard.show.TITLE);
        var inputChartTitle = document.createElement('input');
        inputChartTitle.id = 'title';
        inputChartTitle.className = 'form-control';
        inputChartTitle.value = this.entity.modal.title;
        inputChartTitle.setAttribute('placeholder',I18n.resource.dashboard.show.TITLE_TIP);
        if(this.entity.modal.title != ''){
            inputChartTitle.style.display = 'none';
        }
        inputChartTitle.setAttribute('type','text');
        $divTitle.append($labelTitle).append($(inputChartTitle));
        divTitleAndType.appendChild($divTitle[0]);

        var $divType = $('<div class="divResize chartType">');
        var $labelType = $('<label>').text(I18n.resource.dashboard.show.TYPE);
        var chartType = document.createElement('span');
        chartType.innerHTML = I18n.findContent(this.optionTemplate.name);
        $divType.append($labelType).append($(chartType));
        divTitleAndType.appendChild($divType[0]);



        var chartTitleShow = document.createElement('p');
        chartTitleShow.innerHTML = inputChartTitle.value;
        chartTitleShow.className = 'chartTitleShow';
        $divTitle[0].appendChild(chartTitleShow);
        if(this.entity.modal.title == '' || this.entity.modal.title == undefined){
            chartTitleShow.style.display = 'none';
        }
        chartTitleShow.onclick = function(){
            chartTitleShow.style.display = 'none';
            inputChartTitle.style.display = 'inline-block';
            inputChartTitle.focus();
        };
        inputChartTitle.onblur = function(){
            if (inputChartTitle.value != ''){
                inputChartTitle.style.display = 'none';
                chartTitleShow.style.display = 'inline';
            }
            chartTitleShow.innerHTML = inputChartTitle.value;
            _this.entity.modal.title = inputChartTitle.value;
        };


        this.container.parentNode.appendChild(divMask);
        this.divResizeByToolInit();


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
            var $sourceParent, $targetParent, $chartsCt;
            if (sourceId) {
                var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                $sourceParent = $('#divContainer_' + sourceId).parent();
                $targetParent = $('#divContainer_' + targetId).parent();
                $chartsCt = e.target.classList.contains('chartsCt') ? $(e.target) : $(e.target).closest('.chartsCt');
                //外部非组合图拖入组合图
                // 1.非组合图：!$sourceParent[0].classList.contains('chartsCt')
                // 2.source Chart可能ondrop在target chart的chartsCt,也可能是ondrop在chartsCt里面的某个chart,所以
                if(!$sourceParent[0].classList.contains('chartsCt') && ($targetParent[0].classList.contains('chartsCt') || $chartsCt.length == 1)){
                    if($targetParent[0].classList.contains('chartsCt')){
                        _this.insertChartIntoMix(sourceId, $targetParent[0])
                    }else if($chartsCt.length == 1){
                        _this.insertChartIntoMix(sourceId, $chartsCt[0])
                    }
                }else{//平级之间交换
                    if(_this.screen.screen){//组合图内部交换
                        _this.screen.screen.replaceEntity(sourceId, targetId, _this.screen.entity.id);
                    }else{
                        _this.screen.replaceEntity(sourceId, targetId);
                    }
                }
            }
        }
        this.executeConfigMode();
    },

    ModalMix.prototype.insertChartIntoMix = function(sourceId, container){
        if (sourceId) {
            if(this.screen.listEntity[sourceId].entity.modal.type == 'ModalMix'){
                alert(I18n.resource.toolBox.modal.MSG_MIX_NOT_ALLOW_TO_MIX);
                return false;
            }
            var modelClass, item, entity = this.screen.listEntity[sourceId].entity;
            $('#divContainer_'+ sourceId).remove();
            entity.isNotRender = true;
            if(!this.entity.modal.option){
                this.entity.modal.option = {};
            }
            if(!this.entity.modal.option.subChartIds){
                this.entity.modal.option.subChartIds = [];
            }
            modelClass = this.screen.factoryIoC.getModel(entity.modal.type);
            this.screen.container = container;
            if(container.children.length > 0){
                var lastDiv = container.children[container.children.length - 1];
                entity.spanC = Math.round(parseInt(lastDiv.style.width.split('%')[0])/10) * 12/ 10;
                entity.spanR = Math.round(parseInt(lastDiv.style.height.split('%')[0])/10) * 6/ 10;
            }else{
                entity.spanC = 6;
                entity.spanR = 6;
            }
            item = new modelClass(this.screen, entity);
            item.configure()
            this.entity.modal.option.subChartIds.push({id: entity.id});
        }
    }

    ModalMix.prototype.showConfigModal = function(){
        var _this = this;
        var $mixChartShow = $('#mixChartShow');
        if ($mixChartShow.length===0) {
            $mixChartShow = $('\
                            <style>.mixChartShow .row{margin-top: 15px;margin-bottom: 15px;}</style>\
                            <div id="mixChartShow" class="mixChartShow"><div class="modal fade"  style="position:absolute;"><div class="modal-dialog"><div class="modal-content">\
                            <div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                            <h4 class="modal-title">组合图显示模式</h4></div>\
                            <div class="modal-body">\
                            <div class="row">\
                            <div class="col-xs-3">组合图轮播</div>\
                            <div class="col-xs-6"><input type="number" id="iptInterval" placeholder="时间间隔" style="width:100px"/>s(0或者不填写表示不轮播)</div>\
                            </div>\
                            <div class="row">\
                            <div class="col-xs-3">背景颜色</div>\
                            <div class="col-xs-2">\
                            <select id="selBgColor">\
                            <option value="transparent">无</option>\
                            <option value="#ffffff">白</option>\
                            <option value="#000000">黑</option>\
                            <option value="#337ab7">蓝</option>\
                            <option value="#5cb85c">绿</option>\
                            <option value="custom">自定义</option>\
                            </select>\
                            </div>\
                            <div class="col-xs-2"><input type="input" id="iptBgColor" placeholder="#ffffff" style="width:60px"/></div>\
                            <div class="col-xs-2"><input type="color" class="" id="bgColorView"/></div>\
                            </div>\
                            <div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" id="btnSaveConfig">确定</button></div>\
                            </div></div></div></div>');
        }
        var $paneContent = $('#paneContent');
        var $konvajsContent = $('.konvajs-content');
        if($paneContent.length === 1){
            $paneContent.append($mixChartShow);
        }else if($konvajsContent.length === 1){
            $konvajsContent.append($mixChartShow);
        }

        var $iptBgColor = $('#iptBgColor', $mixChartShow);
        var $bgColorView = $('#bgColorView', $mixChartShow);
        var $selBgColor = $('#selBgColor', $mixChartShow);
        var $iptInterval = $('#iptInterval', $mixChartShow);


        $iptInterval.val(_this.entity.modal.option.displayInterval ? _this.entity.modal.option.displayInterval : 20);
        setShow(_this.entity.modal.option.bgColor ? _this.entity.modal.option.bgColor : 'transparent');


        $selBgColor.off('change').on('change', function(e){
            setShow(this.value,e);
        });

        $iptBgColor.off('input').on('input', function(){
            $bgColorView.val(this.value);
        });

        $bgColorView.off('change').on('change', function(e){
            $iptBgColor.val(this.value);
        });

        $('#btnSaveConfig', $mixChartShow).off('click').click(function () {
            _this.entity.modal.option.displayInterval = $iptInterval.val();//轮播时间间隔
            _this.entity.modal.option.bgColor = $iptBgColor.val();//背景颜色
        });

        $mixChartShow.children('.modal').modal();

        function setShow(selected, event){
            if(selected === 'transparent'){
                $bgColorView.hide();
            }else{
                $bgColorView.val(selected);
                $bgColorView.show();
            }

            if(selected === 'custom'){
                $iptBgColor.show();
                $iptBgColor.val('').focus();
            }else{
                $iptBgColor.hide();
                $iptBgColor.val(selected);
            }

            if(!event){
                $selBgColor.val(selected);
                if(!$selBgColor.val()){
                    $selBgColor.val('custom');
                    $iptBgColor.val(selected).show().focus();
                }
            }
        }
    }

    ModalMix.prototype.attachEventSlider = function(){
        var startPos, isScrolling, endPos, _this = this;
        this.container.addEventListener('touchstart',function(e){
            e.preventDefault();
            //touches数组对象获得屏幕上所有的touch，取第一个touch
            var touch = event.targetTouches[0];
            //取第一个touch的坐标值
            startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};
            //这个参数判断是垂直滚动还是水平滚动
            isScrolling = 0;
            _this.container.addEventListener('touchmove',move,false);
            _this.container.addEventListener('touchend',end,false);
        },false);
        function move(){
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
            var touch = event.targetTouches[0];
            endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
            //isScrolling为1时，表示纵向滑动，0为横向滑动
            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;
            if(isScrolling === 1){
             //阻止触摸事件的默认行为，即阻止滚屏
             event.preventDefault();
            }
        }
        function end(){
            //滑动的持续时间
            var duration = +new Date - startPos.time;
            var i = 0;
            if(Number(duration) > 10){
                if(isScrolling === 1){
                    //判断是上移还是下移，当偏移量大于10时执行
                    if(endPos.y < -10){
                     i = 1;
                    }else if(endPos.y > 10){
                     i = 3;
                    }
                }else if(isScrolling === 0){
                    //判断是左移还是右移，当偏移量大于10时执行
                    if(endPos.x > 10){
                        i = 2;
                    }else if(endPos.x < -10){
                        i = 4;
                    }
                }
                callback(i);
                startPos = endPos = null;
                return false;
            }
            //解绑事件
            _this.container.removeEventListener('touchmove',this,false);
            _this.container.removeEventListener('touchend',this,false);
        }
        function callback(direction){
            switch(direction){
                case 1://上
                    break;
                case 2://右
                    $('.left.carousel-control',_this.container).click();
                    break;
                case 3://下
                    break;
                case 4://左
                    $('.right.carousel-control',_this.container).click()
                    break;
                default:
                    break;
            };
        }
    }

    /*
    ModalMix.prototype.modalInit = function(){
        var configModalOpt = {
                "header" : {
                "needBtnClose" : true,
                "title" : "配置"
            },
            "area" : [
                {
                    "type": 'option',
                    "widget":[{type:'text',name:'组合图轮播(s)', opt:{data: this.entity.modal.option.displayInterval, attr:{class:'inlineBlock iptInterval',placeholder:'时间间隔'}}}]
                },{
                    "module" : "colorConfig",
                    "data": [{color: this.entity.modal.option.bgColor}]
                },
                {
                    'type':'footer',
                    "widget":[{type:'confirm',opt:{needClose:true}},{type:'cancel'}]
                }
            ],
            result:{func: data => {
                this.entity.modal.option.displayInterval = data.text.val;//轮播时间间隔
                this.entity.modal.option.bgColor = data.color;//背景颜色
                this.renderModal();
            }}
        }
        this.configModal = new ConfigModal(configModalOpt, this.screen.container ? this.screen.container : this.screen.page.painterCtn);
        this.configModal.init();
        this.configModal.show();
    }*/

    return ModalMix;
})();
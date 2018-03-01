/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalMix = (function(){
    function ModalMix(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
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
        type: 'ModalMix'
    };

    ModalMix.prototype.show = function(){
        this.init();
    }

    ModalMix.prototype.init = function(){
        this.container.style.overflowX = 'hidden';
        this.container.style.overflowY = 'auto';
    }

    ModalMix.prototype.renderModal = function (e) {
        var _this = this;
        var $sliderCont;
        var $sliderDiv = $('.sliderDiv');
        //是否以slider形式显示判断字段
        var displaySlider = _this.entity.modal.option.displaySlider;
        displaySlider = displaySlider === undefined ? false : displaySlider;
        var carouselTime = new Date();
        if (displaySlider) {
            $sliderDiv = $('<div id="carousel_' + carouselTime.getTime() + '" class="carousel slide sliderDiv" data-ride="carousel">' +
                                 '<ol class="carousel-indicators" style="bottom:0px;">' +
                                 '</ol><div class="carousel-inner" role="listbox">' +
                                 '</div>' +
                                 '<a class="left carousel-control" href="#carousel_' + carouselTime.getTime() + '" role="button" data-slide="prev"  style="background-image:none;color:rgba(91,91,91,0.6);width:60px;height:40%;top:30%;">' +
                                 '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true" style="transform: scale(1,1.3)"></span><span class="sr-only">Previous</span></a>' +
                                 '<a class="right carousel-control" href="#carousel_' + carouselTime.getTime() + '" role="button" data-slide="next" style="background-image:none;color:rgba(91,91,91,0.6);width:60px;height:40%;top:30%;">' +
                                 '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true" style="transform: scale(1,1.3)"></span><span class="sr-only">Next</span></a>' +
                                 '</div>');
            $sliderDiv.find('.carousel-control').hover(function () {
                $(this).css('color', 'rgba(0,0,0,.1)');
            }, function () {
                $(this).css('color', 'rgba(51,51,51,.3)');
            })
            $(_this.container).append($sliderDiv);
        }
        if (!this.entity.modal.option || !this.entity.modal.option.subChartIds) return;
            var index = 0;
        this.entity.modal.option.subChartIds.forEach(function (obj) {
            for (var i = 0, item; i < _this.screen.store.layout.length; i++) {
                if (displaySlider) {
                    $(_this.container).css({ 'display': 'block', 'overflow-y': 'hidden' });
                    for (var z = 0; z < _this.screen.store.layout[i].length; z++) {
                        item = _this.screen.store.layout[i][z];
                        if (obj.id != item.id) continue;
                        var modelClass, entity;
                        _this.screen.store.layout[i][z].spanC = 12;
                        
                        var $sliderIner = $('<div class="item sliderIner"><div class="carousel-caption" style="height:100%;width:100%;right:0;left:0;padding-bottom:0;bottom:0px;padding-top:0px;"></div></div>');
                        var $sliderDot = $('<li data-target="#carousel_' + carouselTime.getTime() + '" data-slide-to="' + index + '" style="border-color:#333;box-shadow:1px rgba(0,0,0,.05);margin:1.5px 3px"></li>')
                        if (item.modal.type && item.modal.type != 'ModalNone') {
                            //regist IoC
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            if (!modelClass) continue;
                            if (item.isNotRender && _this.entity.modal.type == 'ModalMix') {
                                //_this.screen.container = document.getElementById('divContainer_' + _this.entity.id);
                                entity = new modelClass(_this, item);
                                _this.screen.listEntity[item.id] = entity;
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
                                //$(_this.screen.listEntity[item.id].container.parentNode.parentNode).addClass('active');
                                //if (_this.screen.listEntity) { 
                                //    $(_this.screen.listEntity[item.id].container).height($(_this.container).height()-30);
                                //    $(_this.screen.listEntity[item.id].container).width($(_this.container).width());
                                //}
                                if (entity) {
                                    $(entity.container).height($(_this.container).height() - 30);
                                    $(entity.container).width($(_this.container).width());
                                }
                                entity.render();
                            }
                        } else if (item.modal.type == 'ModalNone') {
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            //_this.screen.container = $('#divContainer_' + _this.entity.id).find('.springContent')[0];
                            entity = new modelClass(_this, item);
                            _this.screen.listEntity[item.id] = entity;
                            _this.screen.arrEntityOrder.push(item.id);
                            //$(_this.screen.listEntity[item.id].container.parentNode.parentNode).addClass('active');
                            if (entity) {
                                $(entity.container).height($(_this.container).height() - 30);
                                $(entity.container).width($(_this.container).width());
                            }
                            entity.render();
                            _this.screen.isForReport && entity.configure();
                        }
                        $sliderCont = $(_this.container).children('.springContainer'); 
                        $sliderIner.children('.carousel-caption').append($sliderCont);
                        $sliderIner.height($(_this.container).height());
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
                            //_this.screen.container = $('#divContainer_' + _this.entity.id).find('.springContent')[0];
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
            $(_this.container).find('.sliderDiv').carousel();
        }
    }
    //滚动显示组合图
    //ModalMix.prototype.renderSliderModal = function (e) {
    //    var _this = this;
    //}
    ModalMix.prototype.showConfigMode = function () {
    }

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
        var _this = this;
        if(this.spinner) this.spinner.stop();
        var _this = this;
        if (this.chart) this.chart.clear();
        this.divResizeByMouseInit();

        var divMask = document.createElement('div');
        divMask.className = 'springConfigMask';
        divMask.draggable = 'true';
        /*if (!this.screen.isForReport) {
            var btnConfig = document.createElement('span');
            btnConfig.className = 'glyphicon glyphicon-cog springConfigBtn grow';
            btnConfig.title = 'Options';
            btnConfig.onclick = btnConfig_clickEvent;
            divMask.appendChild(btnConfig);
        }*/

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
                spanC = Math.round(parseInt(lastDiv.style.width.split('%')[0])/10) * 12/ 10;
                spanR = Math.round(parseInt(lastDiv.style.height.split('%')[0])/10) * 6/ 10;
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
                    isNotRender: true,
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
        var btnInstallParId ;
        btnInstall.className = 'glyphicon glyphicon-cog springConfigInstallBtn grow';
        btnInstall.title = 'Install';
        //选择是否滚动显示
        var $mixChartShow = $('#mixChartShow');
        if ($mixChartShow.length===0) {
            $mixChartShow = $('<div id="mixChartShow"><div class="modal fade"  style="position:absolute;"><div class="modal-dialog"><div class="modal-content">' +
                            '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title">组合图显示模式</h4></div>' +
                            '<div class="modal-body">' +
                            '<input type="checkbox" class="isSlider"/>是否滚动显示组合图'+
                            '</div>' +
                            '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" id="transSlider">确定</button></div>' +
                            '</div></div></div></div>');
        }
        $('#paneContent').append($mixChartShow);
        btnInstall.onclick = function (e) {
            $mixChartShow.children('.modal').modal();
            //当前对象
            btnInstallParId = $(this).parents('.springContainer').attr('id').split('_')[1];
            _this.screen.btnInstallParId = btnInstallParId;
            if (_this.screen.listEntity[_this.screen.btnInstallParId].entity.modal.option.displaySlider) {
                $('#mixChartShow .isSlider')[0].checked=true;
            } else {
                $('#mixChartShow .isSlider')[0].checked=false ;
                //return;
            }
        }
        divMask.appendChild(btnInstall);
        $('#transSlider').off('click').click(function () {
            if ($('#mixChartShow .isSlider').is(":checked")) {
                _this.screen.listEntity[_this.screen.btnInstallParId].entity.modal.option.displaySlider = true;
            } else {
                _this.screen.listEntity[_this.screen.btnInstallParId].entity.modal.option.displaySlider = false;
            }
        });


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
        function btnConfig_clickEvent(e) {
            $('.springSel').removeClass('springSel');
            $(e.target).parents('.springContainer').addClass('springSel');
            _this.modalInit();
            //$('#energyModal').modal('show');
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
                //new Alert(document.getElementById('paneCenter'), Alert.type.danger, '组合图');
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

    return ModalMix;
})();
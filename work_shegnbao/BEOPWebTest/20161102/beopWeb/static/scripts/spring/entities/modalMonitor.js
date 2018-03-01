/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalMonitor = (function(){
    var _this;
    function ModalMonitor(screen, entityParams) {
        _this = this;
        _this.$configModal = undefined;
        _this.$modal = undefined;
        _this.tempOpt = undefined;
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }
    ModalMonitor.prototype = new ModalBase();
    ModalMonitor.prototype.optionTemplate = {
        name:'toolBox.modal.Monitor',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        defaultHeight:4.5,
        defaultWidth:3,
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalMonitor'
    };

    ModalMonitor.prototype.show = function(){
        this.init();
    };

    ModalMonitor.prototype.init = function(){
        this.container.style.overflowX = 'hidden';
        this.container.style.overflowY = 'auto';
    };

    ModalMonitor.prototype.configure = function(){
        this.spinner && this.spinner.stop();
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
            })
        };
        divMask.appendChild(btnRemove);

        if (this.entity.modal.type !='ModalAnalysis' || !this.screen.isForReport) {
            var btnConfig = document.createElement('span');
            btnConfig.className = 'glyphicon glyphicon-cog springConfigBtn grow';
            btnConfig.title = 'Options';
            btnConfig.onclick = btnConfig_clickEvent;
            divMask.appendChild(btnConfig);
        }
        function btnConfig_clickEvent(e) {
            $('.springSel').removeClass('springSel');
            $(e.target).closest('.springContainer').addClass('springSel');
            _this.modalInit();
            //$('#energyModal').modal('show');
        }

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
        inputChartTitle.onchange = function(){
            if (inputChartTitle.value != ''){
                inputChartTitle.style.display = 'none';
                chartTitleShow.style.display = 'inline';
            }
            chartTitleShow.innerHTML = inputChartTitle.value;
            _this.entity.modal.title = inputChartTitle.value;

            _this.screen.isScreenChange = true;
        };

        _this.entity.modal.interval = '300000';//设置请求间隔

        //如果entity的isRender为false,添加到chartsCt中
        this.container.parentNode.appendChild(divMask);
        if (this.entity.isNotRender && this.screen.entity) {//兼容ModalMix
            $(document.getElementById('divContainer_' + this.screen.entity.id)).find('.chartsCt')[0].appendChild(this.container.parentNode.parentNode);
        }
        if (this.entity.isNotRender && this.screen.listEntity) {//兼容ModalMix
            var parentId = undefined, subChartIds;
                if(this.entity && this.entity.id){//observer
                    parentId = this.entity.id;
                }
                if(this.screen.store && this.screen.store.layout[0]){//factory
                    for(var i = 0, len = this.screen.store.layout[0].length, entity; i < len; i++){
                        entity = this.screen.store.layout[0][i];
                        if(entity.modal.type == 'ModalMix' && entity.modal.option.subChartIds &&  entity.modal.option.subChartIds.length > 0){
                            subChartIds = entity.modal.option.subChartIds;
                            for(var j = 0, l = subChartIds.length; j < l; j++){
                                if(subChartIds[j].id == this.entity.id){
                                    parentId = entity.id;
                                    break;
                                }
                            }
                        }
                        if(entity.modal.type == 'ModalAppBlind'&&entity.modal.option&&entity.modal.option.length>0&&entity.modal.option[0].subChartIds.length>0){
                            var opts = entity.modal.option;
                            for(var m = 0;m<opts.length;m++){
                                if(opts[m].subChartIds[0].id===this.entity.id){
                                    parentId = entity.id;
                                    break;
                                }
                            }
                        }
                    }
                }
                if(parentId){
                    $(document.getElementById('divContainer_' + parentId)).find('.chartsCt')[0].appendChild(this.container.parentNode.parentNode);
                }
        }

        this.divResizeByToolInit();

        //drag event of replacing entity

        this.executeConfigMode();
    };
    ModalMonitor.prototype.renderModal = function (e) {
        this.spinner && this.spinner.stop();
        var divMonitor,divIcon,divDetail,spName,spValue,spUnit;
        var isSemi = false;
        $(_this.container).addClass('clearfix');
        $(".springContent").css("overflow","auto");
        for (var i = 0 ; i < _this.entity.modal.option.length; i++){
            divMonitor = document.createElement('div');
            divMonitor.className = 'divMonitor';
            isSemi = false;
            (_this.entity.modal.option[i].col == '1') && (isSemi = true);
            isSemi && (divMonitor.className += ' semiCol');
            divMonitor.setAttribute("type",_this.entity.modal.option[i].type);

            divIcon = document.createElement('div');
            divIcon.className = 'divIcon';
            divIcon.innerHTML = '<span class="' + _this.entity.modal.option[i].icon + '"></span>';
            if (_this.entity.modal.option[i].icon){
                divIcon.style.color = _this.entity.modal.option[i].iconColor;
                if(isSemi) {
                    divIcon.querySelector('span').style.border = '2px solid ' + _this.entity.modal.option[i].iconColor;
                }
            }

            divDetail = document.createElement('div');
            divDetail.className = 'divMonitorInfo';

            spName = document.createElement('span');
            spName.className = 'spName';
            spName.textContent = _this.entity.modal.option[i].name;

            spValue = document.createElement('span');
            spValue.dataset.dsId = _this.entity.modal.option[i].dsId;
            spValue.className = 'spValue';

            spUnit = document.createElement('span');
            spUnit.className = 'spUnit';
            spUnit.textContent = _this.entity.modal.option[i].unit;

            if(_this.entity.modal.option[i].backColor == ""){
                //!isSemi && (divMonitor.style.background = "-webkit-gradient(radial, 184 -25, 161, 220 -257, 465, from(#fabd3e), to(#f4ae32))");
            }else{
                divMonitor.style.background = _this.entity.modal.option[i].backColor;
            }

            //if(_this.entity.modal.option[i].col == '1'){
                divDetail.appendChild(spValue);
                divDetail.appendChild(spUnit);
                divDetail.appendChild(spName);
            //}else {
            //    divDetail.appendChild(spName);
            //    divDetail.appendChild(spValue);
            //    divDetail.appendChild(spUnit);
            //}

            divMonitor.appendChild(divIcon);
            divMonitor.appendChild(divDetail);

            (!isSemi) && (divMonitor.style.height = 100 / Math.ceil(_this.entity.spanR) + '%');
            _this.container.appendChild(divMonitor);

        }
    };
    ModalMonitor.prototype.showConfigMode = function () {
    };

    ModalMonitor.prototype.showConfigModal = function () {
        _this.tempOpt = $.extend(true,{},_this.entity.modal);
        var configModalTpl = '\
                <div id="modalMonitorConfig" class="modal fade"  role="dialog" aria-labelledby="ttlNodeTool">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <span id="btnMonitorAdd" class="glyphicon glyphicon-plus-sign btnMonitorAdd grow"></span>\
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title" id="ttlNodeTool">Diagnosis Edit</h4>\
                            </div>\
                            <div class="modal-body gray-scrollbar" id="ctnMonitor">\
                            </div>\
                            <div class="modal-footer">\
                                <input type ="color">\
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                                <button type="button" class="btn btnSure btn-primary">Save</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>';
        _this.$configModal = $('#modalMonitorConfig') ;
        if(_this.$configModal.length == 0){
            _this.$configModal = $(configModalTpl);
        }else{
            _this.$configModal.modal('show');
            return;
        }
        _this.$configModal.appendTo($(_this.container).parentsUntil('.springContainer').parent().parent());
        var $ctnMonitor = _this.$configModal.find('#ctnMonitor').html('');

        var btnAdd = _this.$configModal.find('#btnMonitorAdd')[0];
        btnAdd.title = 'Monitor Type Add';
        btnAdd.onclick = function(){
            $ctnMonitor.append(_this.createDivMonitor())
        };
        if (_this.entity.modal.option && _this.entity.modal.option.length > 0){
            for (var i = 0; i < _this.entity.modal.option.length ;i++){
                $ctnMonitor[0].appendChild(_this.createDivMonitor(_this.entity.modal.option[i]));
            }
        }else {
            $ctnMonitor[0].appendChild(_this.createDivMonitor());
        }
        _this.$configModal.modal('show');
        _this.$configModal.find('.btnSure').off('click').on('click',function(){

            _this.entity.modal = $.extend(true,{},_this.tempOpt);
            _this.$configModal.modal('hide');
        });
        
        _this.attachMonitorEvent();
    };


    ModalMonitor.prototype.updateModal = function (points) {
        this.spinner && this.spinner.stop();
        var MonitorInfoS = $(_this.container).find('.divMonitor');
        var arrSpVal = $(_this.container).find('.spValue');

        for (var i = 0 ; i < arrSpVal.length; i++){
            for(var j in points){
                var data = points[j].data;
                if(!isNaN(data)){
                    data = parseFloat(data).toFixed(2);
                }
                if(points[j].dsItemId == arrSpVal[i].dataset.dsId){
                    
                    if(MonitorInfoS[i].getAttribute("type") == "数值型"){
                        arrSpVal[i].textContent = data;
                    }else{//报警型
                        if(!data == "" || !data == 0){
                            arrSpVal[i].textContent = data;
                        }else{
                            $(MonitorInfoS[i]).css("background","-webkit-gradient(radial, 184 -25, 161, 220 -257, 465, from(#D31212), to(#FC1B1B))");
                            arrSpVal[i].textContent = data;
                        }
                    }
                    break;
                }
            }

        }
    };

    ModalMonitor.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };

    ModalMonitor.prototype.createDivMonitor = function(opt){
        var divMonitor = document.createElement('div');
        divMonitor.className ='divMonitor';
        var $divMonitor = $(divMonitor);
        divMonitor.innerHTML =
            '\
            <div class="divIcon"></div>\
            <div class="divMonitorInfo">\
                <div class="divName">\
                    <label>name:</label>\
                    <span class="spName"></span>\
                    <input class="iptName form-control" ></input>\
                </div>\
                <div class="divValue">\
                    <label>value:</label>\
                    <span class="spValueTip glyphicon glyphicon-plus"></span>\
                    <span class="spValue"></span>\
                </div>\
                <div class="divUnit">\
                    <label>unit:</label>\
                    <span class="spUnit"></span>\
                    <input class="iptUnit form-control"></input>\
                </div>\
                <div class="divType">\
                    <label>type:</label>\
                    <span class="spTypeShow"></span>\
                    <select class="spType">\
                        <option>数值型</option>\
                        <option>报警型</option>\
                    </select>\
                </div>\
                <div class="divCol">\
                    <label>col:</label>\
                    <select class="iptCol form-control" value="1">\
                        <option value="0">一行</option>\
                        <option value="1">半行</option>\
                    </select>\
                </div>\
            </div>\
            <div class="divMonitorDel glyphicon glyphicon-remove-circle"></div>';

        if(opt && opt.icon){
            $divMonitor.find('.divIcon').addClass(opt.icon);
            if(opt.iconColor)$divMonitor.find('.divIcon').css({
                'color':opt.iconColor,
                'box-shadow':'0 0 15px '+ opt.iconColor
            })
        }else{
            $divMonitor.find('.divIcon').addClass('glyphicon glyphicon-plus').css('color','#f6c700');
        }

        if(opt && opt.name){
            $divMonitor.find('.spName').show().text(opt.name);
            $divMonitor.find('.iptName').hide().val(opt.name)
        }else{
            $divMonitor.find('.spName').hide();
            $divMonitor.find('.iptName').show();
        }

        if(opt && opt.dsId){
            $divMonitor.find('.spValue').show().text(AppConfig.datasource.getDSItemById(opt.dsId).alias)[0]
            $divMonitor.find('.divValue')[0].dataset.dsId = opt.dsId;
            $divMonitor.find('.spValueTip').hide()
        }else{
            $divMonitor.find('.spValue').hide();
            $divMonitor.find('.spValueTip').show()
        }

        if(opt && opt.unit){
            $divMonitor.find('.spUnit').show().text(opt.unit);
            $divMonitor.find('.iptUnit').hide().val(opt.unit)
        }else{
            $divMonitor.find('.spUnit').hide();
            $divMonitor.find('.iptUnit').show();
        }

        if(opt && opt.type){
            $divMonitor.find('.spTypeShow').show().text(opt.type);
            $divMonitor.find('.spType').hide();
        }else{
            $divMonitor.find('.spTypeShow').hide();
            $divMonitor.find('.spType').show();
        }
        if(opt && opt.col){
            $divMonitor.find('.iptCol').val(opt.col);
        }

        if(opt && opt.backColor){
            $divMonitor.css("background",opt.backColor);
        }else{
            $divMonitor.css("background","#fff");
        }

        if(!opt ){
            if(!_this.tempOpt.option) {
                _this.tempOpt.option = [];
            }
            _this.tempOpt.option.push(
                {
                    icon: 'glyphicon glyphicon-plus',
                    iconColor:'#f6c700',
                    name: '',
                    unit: '',
                    dsId: '',
                    type: '',
                    backColor: '',
                    col:'6'
                })
        }
        return divMonitor
    };

    ModalMonitor.prototype.attachMonitorEvent = function(){
        var $ctnMonitor = _this.$configModal.find('#ctnMonitor');
        var $iptColor;
        //选中状态
        var indexDivMonitor;
        $ctnMonitor.off('click').on('click','.divMonitor',function(){
            $ctnMonitor.find(".divMonitor").css("border","1px dotted");

            indexDivMonitor = $ctnMonitor.find(".divMonitor").index($(this));

            $(this).css("border","1px solid black");
        })

        $(".modal-footer").find("input").off("change").on("change",function(){
            var colorVal = $(this).val();

            var rgb = colorVal.colorRgb().split("(")[1].split(")")[0];

            var r = rgb.split(",")[0];
            var g = rgb.split(",")[1];
            var b = rgb.split(",")[2];
            var hsl = rgbToHsl(r, g, b);
            var hslEndL = hsl[2]+0.05;

           

            var rgbStartColor = hslToRgb(hsl[0],hsl[1],hsl[2]);
            var rgbEndColor = hslToRgb(hsl[0],hsl[1],hslEndL);

            var backColor = '-webkit-gradient(radial, 184 -25, 161, 220 -257, 465, from(rgb('+rgbStartColor[0]+','+rgbStartColor[1]+','+rgbStartColor[2]+')), to(rgb('+rgbEndColor[0]+','+rgbEndColor[1]+','+rgbEndColor[2]+'))';
            _this.tempOpt.option[indexDivMonitor].backColor = backColor;
            $ctnMonitor.find(".divMonitor").eq(indexDivMonitor).css("background",backColor);
        })
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        String.prototype.colorRgb = function(){
            var sColor = this.toLowerCase();
            if(sColor && reg.test(sColor)){
                if(sColor.length === 4){
                    var sColorNew = "#";
                    for(var i=1; i<4; i+=1){
                        sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));   
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                var sColorChange = [];
                for(var i=1; i<7; i+=2){
                    sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));  
                }
                return "RGB(" + sColorChange.join(",") + ")";
            }else{
                return sColor;  
            }
        };
        function rgbToHsl(r, g, b){
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if(max == min){
                h = s = 0; // achromatic
            }else{
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max){
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            return [h, s, l];
        }
        function hslToRgb(h, s, l){
            var r, g, b;

            if(s == 0){
                r = g = b = l; // achromatic
            }else{
                var hue2rgb = function hue2rgb(p, q, t){
                    if(t < 0) t += 1;
                    if(t > 1) t -= 1;
                    if(t < 1/6) return p + (q - p) * 6 * t;
                    if(t < 1/2) return q;
                    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        //选择icon
        $ctnMonitor.on('click','.divIcon',function(e){
            e.stopPropagation();
            $('#ctnMonitor .divMonitor.selected').removeClass('selected');
            var $divMonitor = $(e.currentTarget).parentsUntil('.ctnMonitor','.divMonitor').addClass('selected');
            var index = $ctnMonitor.children().index($divMonitor);
            if(_this.$modal){
                _this.$modal.modal('show');
                $iptColor = _this.$modal.find('#iptColorSel');
                if(_this.tempOpt.option[index].iconColor) {
                    $iptColor.val(_this.tempOpt.option[index].iconColor);
                }
                if (_this.tempOpt.option[index].icon) {
                    _this.$modal.find('.bs-glyphicons-list .' + _this.tempOpt.option[index].icon.split(' ')[1]).parent().addClass('selected');
                }
            }else{
                WebAPI.get('static/scripts/spring/entities/modalMonitor.html').done(function(resultHTML){
                    _this.$modal = $(resultHTML);
                    $iptColor = _this.$modal.find('#iptColorSel');
                    _this.$modal.modal('show');
                    if(_this.tempOpt.option[index].iconColor) {
                        _this.$modal.find('#iptColorSel').val(_this.tempOpt.option[index].iconColor);
                    }
                    if (_this.tempOpt.option[index].icon) {
                        _this.$modal.find('.bs-glyphicons-list .' + _this.tempOpt.option[index].icon.split(' ')[1]).parent().addClass('selected');
                    }
                    _this.$modal.find('.bs-glyphicons-list>li').click(function(e){
                        if($(e.currentTarget).hasClass('selected'))return;
                        $('.bs-glyphicons-list>li.selected').removeClass('selected');
                        $(e.currentTarget).addClass('selected');
                    });
                    //icon里面的确认button
                    _this.$modal.find('.btnSure').click(function(e){
                        var $divMonitor = $('#ctnMonitor .divMonitor.selected');
                        var index = $ctnMonitor.children().index($divMonitor);
                        var icon = $('.bs-glyphicons-list>li.selected>.glyphicon-class').text();
                        _this.tempOpt.option[index].icon = icon;
                        _this.tempOpt.option[index].iconColor = $iptColor.val();
                        $divMonitor.find('.divIcon')[0].className = 'divIcon '+ icon;
                        $divMonitor.find('.divIcon').css({
                            'color':$iptColor.val(),
                            'box-shadow':'0 0 15px ' + $iptColor.val()
                        });
                        _this.$modal.modal('hide');
                    })
                })
            }
        });
        //删除
         $ctnMonitor.on('click','.divMonitorDel',function(e){
             e.stopPropagation();
            var index = $ctnMonitor.children().index($(e.currentTarget).parentsUntil('.ctnMonitor','.divMonitor'));
            $ctnMonitor.children().eq(index).remove();
            _this.tempOpt.option.splice(index,1);
            _this.tempOpt.points = [];
            for (var i= 0 ;i < $ctnMonitor.find('.divValue').length; i++){
                _this.tempOpt.points.push($ctnMonitor.find('.divValue')[i].dataset.dsId);
            }
         });

         $ctnMonitor.on('click','.spName',function(e){
             e.stopPropagation();
            $(e.currentTarget).hide();
            $(e.currentTarget).parentsUntil('.ctnMonitor','.divMonitor').find('.iptName').show().focus();
         });

        $ctnMonitor.on('click','.spUnit',function(e){
            e.stopPropagation();
            $(e.currentTarget).hide();
            $(e.currentTarget).parentsUntil('.ctnMonitor','.divMonitor').find('.iptUnit').show().focus();
        });
        $ctnMonitor.off('blur').on('blur','input',function(e){
            var $divMonitor = $(e.currentTarget).parentsUntil('.ctnMonitor','.divMonitor');
            var index = $ctnMonitor.children().index($divMonitor);
            var value = $(e.currentTarget).val();
            if($(e.currentTarget).hasClass('iptName')){
                _this.tempOpt.option[index].name = value;
                if(!value)return;
                $(e.currentTarget).hide();
                $divMonitor.find('.spName').text(value).show();
            }else if($(e.currentTarget).hasClass('iptUnit')){
                _this.tempOpt.option[index].unit = value;
                if(!value)return;
                $(e.currentTarget).hide();
                $divMonitor.find('.spUnit').text(value).show();
            }
        });
        //类型判断
        $ctnMonitor.off('blur').on('blur','select',function(e){
            var $divMonitor = $(e.currentTarget).parentsUntil('.ctnMonitor','.divMonitor');
            var index = $ctnMonitor.children().index($divMonitor);
            var type = this.value;

            if($(e.currentTarget).hasClass('iptCol')){
                if(!type)return;
                _this.tempOpt.option[index].col = type;
            }else {
                _this.tempOpt.option[index].type = type;
                $(this).hide();
                $divMonitor.find(".spTypeShow").show().html(type);
            }
        });
        $ctnMonitor.on('click','.spTypeShow',function(e){
            var $divMonitor = $(this).parentsUntil('.ctnMonitor','.divMonitor');
            $(this).hide();
            $divMonitor.find(".spType").show();
        })
       

        $ctnMonitor[0].ondragenter = function(e){
            e.preventDefault();
        };
        $ctnMonitor[0].ondragover = function(e){
            e.preventDefault();
        };
        $ctnMonitor[0].ondragleave= function(e){
            e.preventDefault();
        };
        $ctnMonitor[0].ondrop= function(e){
            e.preventDefault();
            var dsItemId = EventAdapter.getData().dsItemId;
            if(!dsItemId)return;
            var $divValue = $(e.target).parentsUntil('.ctnMonitor','.divValue');
            if($divValue.length > 0){
                var index = $ctnMonitor.children().index($divValue.parentsUntil('.ctnMonitor','.divMonitor'));
                _this.tempOpt.option[index].dsId = dsItemId;
                $divValue[0].dataset.dsId = dsItemId;
                $divValue.find('.spValue').text(AppConfig.datasource.getDSItemById(dsItemId).alias).show();
                $divValue.find('.spValueTip').hide();
                _this.tempOpt.points = [];
                for (var i= 0 ;i < $ctnMonitor.find('.divValue').length; i++){
                    _this.tempOpt.points.push($ctnMonitor.find('.divValue')[i].dataset.dsId);
                }
            }
        };
    };

    return ModalMonitor;
})();



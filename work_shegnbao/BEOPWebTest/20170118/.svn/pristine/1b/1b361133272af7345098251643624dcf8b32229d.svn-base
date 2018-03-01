//   2016/9/28  kpi总览
var ModalKpiOverview = (function(){
    function ModalKpiOverview(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.lastFiveMinutes = undefined;
        this.option = undefined;
    };
    ModalKpiOverview.prototype = new ModalBase();

    ModalKpiOverview.prototype.optionTemplate = {
        name: 'toolBox.modal.KPI_OVERVIEW',
        parent:0,
        mode: 'custom',
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:6,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalKpiOverview',
        scroll:false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalKpiOverview.prototype.configModalOptDefault= {
        "header" : {
            "needBtnClose" : true,
            "title" : "配置"
        },
        "area" : [
            {
                "module" : "dsDrag",
                "data":[{
                    type:'point',name:'KPI总览',data:[],forChart:false
                }]
            },{
                'type':'footer',
                "widget":[{type:'confirm',opt:{needClose:false}},{type:'cancel'}]
            }
        ],
        result:{}
    };

    ModalKpiOverview.prototype.initConfigModalOpt = function(){
        var _this = this;
        
        if(this.entity.modal.option){
            if(this.entity.modal.option.structPoint)this.configModalOpt.area[0].data[0].data = _this.entity.modal.points;
        }
        this.configModalOpt.result.func = function(option){
            _this.setModalOption(option); 
            _this.configModal.hide();
            _this.renderModal();
        }
    };

    ModalKpiOverview.prototype.setModalOption = function(option){
        this.entity.modal.interval = 5;
        this.entity.modal.option = {
            structPoint:option.points[0],
            needDetail:option.needDetail
        };
        this.entity.modal.points = option.points[0];
    };

    ModalKpiOverview.prototype.updateModal = function (points) {
        this.getDsItemsById(points);
    };

    ModalKpiOverview.prototype.renderModal = function () {
        var _this = this;
        var dsItemIds = _this.entity.modal.points;
        if(dsItemIds !== undefined){
            WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds: dsItemIds}).done(function(result){
                _this.getDsItemsById(result.dsItemList);
            })
        }
    };

    ModalKpiOverview.prototype.getDsItemsById = function (data) {
        var _this = this;
        var remarks=[],ids=[],scores=[];
        for(var i=0,length=data.length;i<length;i++){
            ids.push(data[i].dsItemId);
            scores.push(Number(data[i].data).toFixed(2));
        }
        WebAPI.post('/analysis/datasource/getDsItemsById',ids).done(function(result){
            for(var i=0,length=result.length;i<length;i++){
                var name = result[i].alias !== ''?result[i].alias:result[i].value;
                remarks.push(name);
            }
            _this.spinner && _this.spinner.stop();
            if($(_this.container).html() === "" || $(_this.container).find(".kpiInfoBox>div").length !== remarks.length){//第一次渲染
                _this.firstRenderModal(remarks,scores,ids);
            }else{
                _this.laterRenderModal(remarks,scores,ids);
            }
        })
    };

    ModalKpiOverview.prototype.firstRenderModal = function (names,values,ids) {
        var $container = $(this.container);
        $container.html("");

        var kpiOverviewCtn = '<div class="kpiOverviewCtn"></div>';
        $container.html(kpiOverviewCtn);
        var colorClass,num=0,noIncluded=0;
        var topTitle = '';
        var leftContainer = '<div class="leftKpiOverview">\
                                <div class="circleContainer">\
                                    <canvas id="myCanvas" width="180px" height="180px"></canvas>\
                                    <div class="smallCircleContainer">\
                                        <div class="smallWhite"></div>\
                                    </div>\
                                    <span class="percentageNum">91%</span>\
                                </div>\
                            </div>';
        var rightContainer = '<div class="rightKpiOverview gray-scrollbar container">\
                                <h3>KPI</h3>\
                                <div class="kpiInfoBox row"></div>\
                            </div>';
        $container.find(".kpiOverviewCtn").append($(leftContainer));
        $container.find(".kpiOverviewCtn").append($(rightContainer));
        $(rightContainer).html(topTitle);

        for(var i=0,length=names.length;i<length;i++){
            if(values[i] >= 60){
                colorClass = 'passGreen';
                num+=1;
            }else{
                if(values[i] < 0){
                    noIncluded+=1;
                }
                colorClass = 'noPassGreen';
            }
            var str = '<div class="col-xs-6">\
                            <div class="kpiInfo '+colorClass+'" data-id="'+ids[i]+'">\
                                <div>\
                                    <span title="'+names[i]+'">'+names[i]+' </span>\
                                    <span title="'+values[i]+'"> '+values[i]+'</span>\
                                    <span></span>\
                                </div>\
                            </div>\
                        </div>';
            $(this.container).find(".kpiInfoBox").append($(str));
        }

        this.resize();
        var option = this.option;
        //大圆
        var c=$container.find("#myCanvas")[0];
        var ctx=c.getContext("2d");
        ctx.beginPath();
        var gradient=ctx.createLinearGradient(0,0,170,0);
        gradient.addColorStop("0","#63b15b");
        gradient.addColorStop("1.0","#f1b23e");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = option.divWidth*9/180;
        ctx.arc(option.divWidth/2,option.divWidth/2,option.divWidth/2-ctx.lineWidth/2,0,2*Math.PI);
        ctx.stroke();

        //百分比
        var percentage = (num/(names.length-noIncluded)*100).toFixed(0);
        $container.find(".percentageNum").html(percentage+'%');
        
        //小圆的定位
        option.r = option.divWidth/2 - (option.divWidth*8/180)/2;
        this.smallCircle(Number(percentage),option);
    };

    ModalKpiOverview.prototype.resize = function () {
        var option = {};
        var $container = $(this.container);
        //自适应
        var height = $(this.container).height(),
            width = $(this.container).width();
        //左边的
        var leftHeight, leftWidth;
        leftHeight = leftWidth = Math.min(height, width) * 0.6;
        $('.leftKpiOverview',$container).css({
            'height': leftHeight + 'px',
            'width': leftWidth + 'px',
            'margin-top': '-'+leftHeight/2+'px'
        }); 
        $('.percentageNum',$container).css("fontSize",leftWidth/4+'px');
        $('#myCanvas',$container).attr("width",leftWidth + 'px');
        $('#myCanvas',$container).attr("height",leftHeight + 'px');

        var smallBoxWidth = leftWidth*16/180;
        $('.smallCircleContainer',$container).css({
            'height': smallBoxWidth + 'px',
            'width': smallBoxWidth +'px'
        });
        //右边的
        $('.rightKpiOverview',$container).css({
            'height': leftHeight + 'px',
            'width': 'calc(100% - '+(leftWidth+20)+'px)',
            'margin-top': '-'+leftHeight/2+'px'
        });
        $('.rightKpiOverview h3',$container).css({
            'fontSize': leftWidth*24/180+'px'
        })
        $('.rightKpiOverview .kpiInfo>div span',$container).css({
            'fontSize': leftWidth*12/180+'px'
        })
        $('.rightKpiOverview .kpiInfo:before',$container).css({
            'width': leftWidth*12/180+'px',
            'height': leftWidth*12/180+'px'
        })
        option.divWidth = leftWidth;
        option.smallBoxWidth = smallBoxWidth;
        this.option = option;

        if($container.html() !== "" && window.location.href.indexOf("preview/page") === -1){
            var percentage = $container.find(".percentageNum").html().split("%")[0];
            //大圆
            var c=$container.find("#myCanvas")[0];
            var ctx=c.getContext("2d");
            ctx.beginPath();
            var gradient=ctx.createLinearGradient(0,0,170,0);
            gradient.addColorStop("0","#63b15b");
            gradient.addColorStop("1.0","#f1b23e");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = option.divWidth*9/180;
            ctx.arc(option.divWidth/2,option.divWidth/2,option.divWidth/2-ctx.lineWidth/2,0,2*Math.PI);
            ctx.stroke();
            //小圆的定位
            option.r = option.divWidth/2 - (option.divWidth*8/180)/2;
            this.smallCircle(Number(percentage),option);
        }
    };

    ModalKpiOverview.prototype.smallCircle = function (percentage,option) {
        var $container = $(this.container);
        var deg = percentage/100*360;
        var top,left;
        var param = Math.PI/180;
        
        if(0<percentage && percentage<25){
            deg = deg-270;
            y = Math.sin(deg*param)*option.r;
            x = Math.cos(deg*param)*option.r;
            top = option.divWidth/2 - y ;
            left = option.divWidth/2- x ;
        }else if(25<=percentage&&percentage<50){
            if(percentage === 25){
                top = option.divWidth/2;
                left = option.divWidth-(option.divWidth*9/180)/2;
            }else{
                deg = deg-180;
                x = Math.sin(deg*param)*option.r;
                y = Math.cos(deg*param)*option.r;
                top = option.divWidth/2 + y;
                left = option.divWidth/2 - x; 
            }
        }else if(50<=percentage&&percentage<75){
            if(percentage === 50){
                top = option.divWidth - (option.divWidth*9/180)/2;
                left = option.divWidth/2; 
            }else{
                deg = deg-90;
                y = Math.sin(deg*param)*option.r;
                x = Math.cos(deg*param)*option.r;
                top = option.divWidth/2 + y;
                left = option.divWidth/2 + x; 
            }
        }else if(75<=percentage&&percentage<100){
            if(percentage === 75){
                top = option.divWidth/2;
                left = (option.divWidth*9/180)/2;
            }else{
                deg = deg;
                x = Math.sin(deg*param)*option.r;
                y = Math.cos(deg*param)*option.r;
                top = option.divWidth/2 - y;
                left = option.divWidth/2 + x;
            }
        }else if(percentage === 0 || percentage === 100){
            top = (option.divWidth*9/180)/2;
            left = option.divWidth/2; 
        }
        $container.find(".smallCircleContainer").css({'top':(top-option.smallBoxWidth/2)+'px','left':(left-option.smallBoxWidth/2)+'px'});
    };

    ModalKpiOverview.prototype.laterRenderModal = function (names,values,ids) {
        var colorClass,fontColor,num=0,noIncluded=0;
        $(this.container).find(".kpiInfoBox>div").each(function(){
            var $kpiInfo = $(this).find(".kpiInfo");
            var $infos = $(this).find(".kpiInfo span");
            for(var i=0,length=ids.length;i<length;i++){
                if(ids[i] === $kpiInfo.attr("data-id")){
                    //  根据是否达标显示背景色
                    if(values[i] >= 60){
                        colorClass = 'passGreen';
                        num+=1;
                    }else{
                        if(values[i] < 0){
                            noIncluded+=1;
                        }
                        colorClass = 'noPassGreen';
                    }
                    $kpiInfo.removeClass().addClass("kpiInfo "+colorClass);
                    //和上次的对比  是否升降
                    var value = Number($infos.eq(1).html());
                    var arrowClass; 
                    if( values[i] > value ){
                        arrowClass = "glyphicon glyphicon-arrow-up";
                        fontColor = "#63b15b";
                    }else if( values[i] < value ){
                        arrowClass = "glyphicon glyphicon-arrow-down";
                        fontColor = "#f1b23e";
                    }else if( values[i] == value ){
                        arrowClass = "";
                    }
                    $kpiInfo.find("span").eq(2).removeClass().addClass(arrowClass).css("color",fontColor);
                    $infos.eq(1).html(values[i]);
                }
            }
        })
        //百分比
        var percentage = (num/(names.length-noIncluded)*100).toFixed(0);
        $(this.container).find(".percentageNum").html(percentage+'%');
        //小圆的定位
        this.smallCircle(Number(percentage),this.option)
    };

    ModalKpiOverview.prototype.attachEvent = function () {
       
    };

    ModalKpiOverview.prototype.showConfigMode = function () {

    };

    return ModalKpiOverview;
})()
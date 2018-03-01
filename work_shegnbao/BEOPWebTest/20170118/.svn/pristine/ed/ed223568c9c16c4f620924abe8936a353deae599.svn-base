/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalKPIStruct = (function(){
    function ModalKPIStruct(screen, entityParams) {
        this.$configModal = undefined;
        this.$modal = undefined;
        this.tempOpt = undefined;
        this.subEntity = undefined;
        this.isInit = false;
        this.store = {};
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }
    ModalKPIStruct.prototype = new ModalBase();
    ModalKPIStruct.prototype.optionTemplate = {
        name:'toolBox.modal.KPI_STRUCT',
        parent:3,
        mode:'custom',
        maxNum: 10,
        title:'',
        defaultHeight:4.5,
        defaultWidth:3,
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalKPIStruct',
        scroll:false,
        tooltip: {
            'imgPC': true,
            'imgMobile': true,
            'isSpecData':true,
            'desc': '#KPIStruct'
        }
    };
    ModalKPIStruct.prototype.configModalOptDefault= {
        "header" : {
            "needBtnClose" : true,
            "title" : "配置"
        },
        "area" : [
            {
                "type": 'option',
                "widget":[{id:'needDetail',type:'checkbox',name:'是否显示细节'}]
            },
            {
                "module" : "dsDrag",
                "data":[{
                    type:'point',name:'KPI分项统计来源',data:[],forChart:false
                }]
            },
            {
                'type':'footer',
                "widget":[{type:'confirm',opt:{needClose:false}},{type:'cancel'}]
            }
        ],
        result:{}
    };

    ModalKPIStruct.prototype.show = function(){
        this.init();
    };
    ModalKPIStruct.prototype.initConfigModalOpt = function(){
        var _this = this;
        //this.configModalOpt.area[0].widget[0].option = [];
        //this.configModalOpt.area[0].widget[0].option.push({
        //    type:'chart',
        //    name:'图表',
        //    link:this.getSiblingChart()
        //});
        if(this.entity.modal.option){
            if(this.entity.modal.option.needDetail)this.configModalOpt.area[0].widget[0].data = this.entity.modal.option.needDetail;
            if(this.entity.modal.option.structPoint)this.configModalOpt.area[1].data[0].data = this.entity.modal.option.structPoint;
        }
        this.configModalOpt.result.func = function(option){
            _this.setModalOption(option); //.done(function(resultData){
            //    _this.entity.modal.points = [];
            //    if(!(resultData.dsItemList && resultData.dsItemList[0] && resultData.dsItemList[0].data))return;
            //    var structList;
            //    try{
            //        structList = JSON.parse(resultData.dsItemList[0].data).KPIList;
            //    }catch(e){
            //        return;
            //    }
            //    _this.getRealTimePoint(structList,_this.entity.modal.points)
            //}).always(function(){
                _this.configModal.hide();
            //});
        }
    };
    ModalKPIStruct.prototype.getRealTimePoint = function(list,arr){
        var _this = this;
        if(!arr)arr = [];
        list.forEach(function(item){
            if(item.point) {
                arr.push(_this.entity.modal.option.prefix + item.point);
            }
            if(item.pointRoot) {
                arr.push(_this.entity.modal.option.prefix + item.pointRoot +'_va');
                arr.push(_this.entity.modal.option.prefix + item.pointRoot +'_st');
                arr.push(_this.entity.modal.option.prefix + item.pointRoot +'_state');
            }
            if(item.children instanceof Array && item.children.length > 0){
                _this.getRealTimePoint(item.children,arr)
            }
        });
        return arr;
    };
    ModalKPIStruct.prototype.init = function(){
    };

    ModalKPIStruct.prototype.renderModal = function (e) {
        $(this.container).addClass('widgetKPIItemEval');
        var _this = this;
        //var postData = {'dsItemIds': this.entity.modal.option.structPoint};
        //WebAPI.post('/analysis/startWorkspaceDataGenPieChart',postData).done(function(resultData){
        //    if(!(resultData.dsItemList && resultData.dsItemList[0] && resultData.dsItemList[0].data))return;
        //    var structList;
        //    try{
        //        structList = JSON.parse(resultData.dsItemList[0].data).KPIList;
        //    }catch(e){
        //        return;
        //    }
        //    structList.forEach(function(struct){
        //        _this.initStruct(struct);
        //    });
        //    _this.attachEvent();
        //});
        if(AppConfig.isMobile){
            this.container.innerHTML = '<div class="divKPIIndex gray-scrollbar"></div>';
        }else {
            this.container.innerHTML = '<div class="divKPIIndex gray-scrollbar"></div><div class="divKPIDetail"></div>';
            if (this.entity.modal.option.needDetail) {
                _this.renderDetailContainer();
                $(_this.container).addClass('showSubContainer');
            }
        }
        this.indexSpinner = new LoadingSpinner({ color: '#00FFFF' });
        this.indexSpinner.spin(this.container.querySelector('.divKPIIndex'));
        _this.attachEvent();
    };
    ModalKPIStruct.prototype.renderDetailContainer = function(){
        var containerDetail = this.container.querySelector('.divKPIDetail');
        var item = {
            modal:{
                type:'ModalHtml',
                interval:60000,
                option:{
                    html:this.setSubEntityHTML()
                },
                points:[],
                title:''
            },
            spanC:9,
            spanR:6
        };
        this.initSubEntity(containerDetail,item)
    };
    ModalKPIStruct.prototype.setSubEntityHTML =  function(){
        var html = '\
        <style>\
            .divChart{position:relative}\
            .divChart_1_1 {\n\
                display:block;\n\
                height:70%;\n\
            }\n\
            .divChart_2_1,.divChart_2_2,.divChart_2_3 {\n\
                display:inline-block;\n\
                height:30%;\n\
                width:33.33%;\n\
                float:left;\n\
            }\n\
        </style>\n\
        <div class="divChart divChart_1_1" data-default-chart="line"></div>\n\
        <div class="divChart divChart_2_1" data-default-chart="gauge"></div>\n\
        <div class="divChart divChart_2_2" data-default-chart="gauge"></div>\n\
        <div class="divChart divChart_2_3" data-default-chart="gauge"></div>\n\
        <script>\n\
            var _this = this;\n\
            var defaultChartOpt = {\n\
                title:{textStyle:{color:"#eee"}},\n\
                legend:{textStyle:{color:"#eee"}},\n\
                tooltip : {\n\
                    trigger: "axis"\n\
                },\n\
                xAxis:{\n\
                    type:"category",\n\
                    axisLine:{show:false,lineStyle:{color:"#eee"}},\n\
                    axisLabel:{textStyle:{color:"#eee"}},\n\
                    axisTick:{show:false}\n\
                },\n\
                yAxis:{\n\
                    type:"value",\n\
                    axisLine:{show:false,lineStyle:{color:"#eee"}},\n\
                    axisLabel:{textStyle:{color:"#eee"}},\n\
                    splitLine:{show:false},\n\
                    axisTick:{show:false}\n\
                }\n\
            };\n\
            var realTimeData = {};\n\
            var promiseRealtime;\n\
            //debugger;\n\
            this.onRenderComplete = function(){\n\
                promiseRealtime = $.Deferred();\n\
                getRealTimeData();\n\
                initChart(_this._wrapContainer.querySelector(".divChart_1_1"),_this.widgetModal.focusDetail["chart-1-1"]);\n\
                initChart(_this._wrapContainer.querySelector(".divChart_2_1"),_this.widgetModal.focusDetail["chart-2-1"]);\n\
                initChart(_this._wrapContainer.querySelector(".divChart_2_2"),_this.widgetModal.focusDetail["chart-2-2"]);\n\
                initChart(_this._wrapContainer.querySelector(".divChart_2_3"),_this.widgetModal.focusDetail["chart-2-3"]);\n\
            }\n\
            function getRealTimeData(){\n\
                var points = [].concat(\n\
                    _this.widgetModal.focusDetail["chart-2-1"].point,\n\
                    _this.widgetModal.focusDetail["chart-2-2"].point,\n\
                    _this.widgetModal.focusDetail["chart-2-3"].point\n\
                )\n\
                if(points.length == 0){promiseRealtime.reject();return;}\
                WebAPI.post("/analysis/startWorkspaceDataGenPieChart", {\n\
                    dsItemIds: points\n\
                }).done(function(result){\n\
                    if(!(result.dsItemList instanceof Array))return\n\
                    result.dsItemList.forEach(function(pt){realTimeData[pt.dsItemId] = pt.data})\n\
                    promiseRealtime.resolve();\n\
                }).fail(function(){promiseRealtime.reject()})\n\
            }\n\
            function initChart(container,option){\n\
                var type = container.dataset.defaultChart;\n\
                if(option.type){\n\
                    type = option.type;\n\
                }\n\
                var chartOption = {}\n\
                switch(type){\n\
                    case "line":\n\
                        chartOption = initLineChart(container,option);\n\
                        break;\n\
                    case "bar":\n\
                        chartOption = initBarChart(container,option);\n\
                        break;\n\
                    case "gauge":\n\
                        chartOption = initGaugeChart(container,option);\n\
                        break;\n\
                    default:\n\
                        return;\n\
                }\n\
            }\n\
            function initLineChart(container,option){\n\
                if(!(option.point instanceof Array && option.point.length > 0))return\n\
                var spinner = new LoadingSpinner({ color: "#00FFFF" })\n\
                spinner.spin(container)\n\
                var opt = {}\n\
                var series = [];\n\
                var timeShaft,startTime,endTime,interval\n\
                var now = new Date();\n\
                switch(option.time){\n\
                    case "today":\n\
                        startTime = new Date(now - 86400000).format("yyyy-MM-dd HH:00:00");\n\
                        endTime = now.format("yyyy-MM-dd HH:00:00");\n\
                        interval = "h1";\n\
                        break;\n\
                    case "today":\n\
                        startTime = new Date(now - 86400000).format("yyyy-MM-dd HH:00:00");\n\
                        endTime = now.format("yyyy-MM-dd HH:00:00");\n\
                        interval = "h1";\n\
                        break;\n\
                    case "today":\n\
                        startTime = new Date(now - 86400000).format("yyyy-MM-dd HH:00:00");\n\
                        endTime = now.format("yyyy-MM-dd HH:00:00");\n\
                        interval = "h1";\n\
                        break;\n\
                    default:\n\
                        startTime = new Date(now - 86400000).format("yyyy-MM-dd HH:00:00");\n\
                        endTime = now.format("yyyy-MM-dd HH:00:00");\n\
                        interval = "h1";\n\
                        break;\n\
                };\n\
                WebAPI.post("/analysis/startWorkspaceDataGenHistogram", {\n\
                    dsItemIds: option.point.map(function(pt){return pt.point}),\n\
                    timeStart: startTime,\n\
                    timeEnd: endTime,\n\
                    timeFormat: interval\n\
                }).done(function(result){\n\
                    if(!(result.list && (result.list instanceof Array)))return;\n\
                    for (var i = 0; i < result.list.length;i++){\n\
                        series.push({\n\
                            type:"line",\n\
                            data:result.list[i].data,\n\
                            name:option.point[i].name\n\
                        })\n\
                    }\n\
                    opt = {\n\
                        title:{text:option.name?option.name:""},\n\
                        legend:{data:option.point.map(function(pt){return pt.name})},\n\
                        xAxis:{\n\
                            data:result.timeShaft\n\
                        },\n\
                        series:series\n\
                    }\n\
                    var chart = echarts.init(container);\n\
                    chart.setOption($.extend(true,{},defaultChartOpt,opt));\n\
                }).always(function(){spinner.stop()})\n\
            }\n\
            function initBarChart(container,option){\n\
                if(!(option.point instanceof Array && option.point.length > 0))return\n\
                var spinner = new LoadingSpinner({ color: "#00FFFF" })\n\
                spinner.spin(container)\n\
                var opt = {}\n\
                var series = [];\n\
                var timeShaft,startTime,endTime,interval\n\
                var now = new Date();\n\
                switch(option.time){\n\
                    case "today":\n\
                        startTime = new Date(now - 86400000).format("yyyy-MM-dd HH:00:00");\n\
                        endTime = now.format("yyyy-MM-dd HH:00:00");\n\
                        interval = "h1";\n\
                        break;\n\
                    case "today":\n\
                        startTime = new Date(now - 86400000).format("yyyy-MM-dd HH:00:00");\n\
                        endTime = now.format("yyyy-MM-dd HH:00:00");\n\
                        interval = "h1";\n\
                        break;\n\
                    case "today":\n\
                        startTime = new Date(now - 86400000).format("yyyy-MM-dd HH:00:00");\n\
                        endTime = now.format("yyyy-MM-dd HH:00:00");\n\
                        interval = "h1";\n\
                        break;\n\
                    default:\n\
                        startTime = new Date(now - 86400000).format("yyyy-MM-dd HH:00:00");\n\
                        endTime = now.format("yyyy-MM-dd HH:00:00");\n\
                        interval = "h1";\n\
                        break;\n\
                };\n\
                WebAPI.post("/analysis/startWorkspaceDataGenHistogram", {\n\
                    dsItemIds: option.point.map(function(pt){return pt.point}),\n\
                    timeStart: startTime,\n\
                    timeEnd: endTime,\n\
                    timeFormat: interval\n\
                }).done(function(result){\n\
                    if(!(result.list && (result.list instanceof Array)))return;\n\
                    for (var i = 0; i < result.list.length;i++){\n\
                        series.push({\n\
                            type:"bar",\n\
                            data:result.list[i].data,\n\
                            name:option.point[i].name\n\
                        })\n\
                    }\n\
                    opt = {\n\
                        title:{text:option.name?option.name:""},\n\
                        legend:{data:option.point.map(function(pt){return pt.name})},\n\
                        xAxis:{\n\
                            data:result.timeShaft\n\
                        },\n\
                        series:series\n\
                    }\n\
                    var chart = echarts.init(container);\n\
                    chart.setOption($.extend(true,{},defaultChartOpt,opt));\n\
                }).always(function(){spinner.stop()})\n\
            }\n\
            function initGaugeChart(container,option){\n\
                if(!(option.point instanceof Array && option.point.length > 0))return\n\
                var spinner = new LoadingSpinner({ color: "#00FFFF" })\n\
                spinner.spin(container)\n\
                var opt = {}\n\
                var series = [];\n\
                var timeShaft,startTime,endTime,interval\n\
                promiseRealtime.done(function(){\n\
                    if(typeof realTimeData[option.point[0]] == null)return;\n\
                    series=[{\n\
                        type:"gauge",\n\
                        data:realTimeData[option.point[0]],\n\
                        radius:"100%",\n\
                        center:["50%","75%"],\n\
                        max:option.max?option.max:10,\n\
                        name:option.point[0],\n\
                        startAngle:"180",\n\
                        endAngle:"0",\n\
                        axisLine:{lineStyle:{width:10,color:[[1, "#4488bb"]]}},\
                        splitLine:{length:15},\n\
                        detail:{offsetCenter:[0,"20%"]}\n\
                    }]\n\
                    opt = {\n\
                        title:{text:option.name?option.name:""},\n\
                        legend:{show:false,data:[option.point[0]]},\n\
                        xAxis:"",\n\
                        yAxis:"",\n\
                        series:series\n\
                    }\n\
                    var chart = echarts.init(container);\n\
                    chart.setOption($.extend(true,{},defaultChartOpt,opt));\n\
                }).always(function(){spinner.stop()})\n\
            }\n\
        </script>';
        return html
    };
    ModalKPIStruct.prototype.attachEvent = function(){
        var _this = this;
        var clickEvent = AppConfig.isMobile?'tap':'click';
        $(this.container).off(clickEvent).on(clickEvent,'.divStructTtl',function(e){
            $(e.currentTarget).parent().toggleClass('focus');
        });
        $(this.container).on(clickEvent,'.divStructItem',function(e){
            var $target = $(e.currentTarget);
            $target.siblings().removeClass('focus');
            $target.toggleClass('focus');
            if($target.children('.pointDetail').length == 0 || !$target.hasClass('focus'))return;
            _this.subEntity && _this.refreshSubEntity($target)
        });
    };
    ModalKPIStruct.prototype.refreshSubEntity = function($target){
        if(!this.store.KPIList)return;
        var parents = $target.parentsUntil('.divKPIIndex','.divStructCtn');
        var childIndex = $target[0].dataset.itemChildIndex;
        var arrPoint = [];
        var store = this.store.KPIList[parents[0].dataset.itemIndex];
        var level = 1;
        while (level != parents.length){
            store = store.children[parents[level].dataset.itemIndex];
            level++;
        }
        store = store.children[childIndex].param;
        var _this = this;
        Object.keys(store).forEach(function(chart){
            arrPoint = arrPoint.concat(store[chart].point)
        });
        this.subEntity.entity.modal.points = arrPoint.map(function(point){return (_this.entity.modal.option.prefix + point.id)});
        var clone = $.extend(true,{},store);
        Object.keys(clone).forEach(function(key){
            if(clone[key].point instanceof Array){
                clone[key].point.forEach(function(pt,index,self){
                    if(typeof pt == 'string'){
                        self[index] = _this.entity.modal.option.prefix + pt;
                    }else {
                        pt.point = _this.entity.modal.option.prefix + pt.point;
                    }
                })
            }
        });
        this.subEntity.entity.modal.focusDetail = clone;
        this.updateSubEntity();
    };
    ModalKPIStruct.prototype.initPointMap = function(points){
        var _this = this;
        var $dom;
        points.forEach(function(point){
            _this.initPointDetail(point.dsItemId,point.data)
        })
    };
    ModalKPIStruct.prototype.initPointDetail = function(id,data){
        var $dom = $('[data-point="' + id +'"]');
        if ($dom.length == 0)return;

        if($dom.hasClass('spItemKPIRs')){
            var status = '';
            switch (parseInt(data)){
                case 0:
                    status = 'success';
                    break;
                case 1:
                    status = 'danger';
                    break;
                case 5:
                    status = 'default';
                    break;
                default :
                    status = 'none';
                    break;
            }
            $dom.removeClass('success danger default none').addClass(status);
        }else{
            if(isNaN(Number(data))){
                $dom.text(data);
            }else {
                var arrPt = id.split('_');
                if(arrPt[arrPt.length - 1] == 'Score'){
                    $dom.text(parseFloat(data).toFixed(2) +'%');
                }else {
                    $dom.text(parseFloat(data).toFixed(2));
                }
            }
        }
    };
    ModalKPIStruct.prototype.initStruct = function(parent,index,container){
        var _this = this;
        var struct = parent[index];
        var itemName;
        if(!parent){
            itemName = struct.name;
        }else{
            itemName = parent.name + '-' + struct.name
        }
        var structDom = this.container.querySelector('[data-item="' + struct.name +'"]');
        var kpiIndexDom = this.container.querySelector('.divKPIIndex');
        if(!structDom) {
            structDom = document.createElement('div');
            structDom.className = 'divStructCtn focus divStructCtnCover';
            structDom.dataset.item = struct.name;
            structDom.dataset.itemIndex = index;

            var defaultSvg = '<svg version="1.1" id="图形" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                    <path class="svgpath" data-index="path_0" fill="#272636" d="M1002.496 414.208c-5.44-28.672-22.592-47.04-43.456-46.528l-4.352 0c-71.808 0-130.24-58.432-130.24-130.24 0-23.68 11.264-49.6 11.328-49.792 11.072-24.96 2.56-55.616-19.84-71.232l-1.216-0.832-125.248-69.568-1.28-0.576c-7.424-3.2-15.552-4.864-24.192-4.864-17.856 0-35.328 7.104-46.784 19.008-15.296 15.808-63.488 56.768-102.4 56.768-39.296 0-87.808-41.792-103.168-57.856-11.52-12.16-29.12-19.392-47.168-19.392-8.448 0-16.448 1.6-23.744 4.672L339.2 44.224 209.536 115.456l-1.28 0.896C185.792 131.968 177.216 162.56 188.288 187.52c0.128 0.256 11.328 26.24 11.328 49.856 0 71.808-58.432 130.24-130.24 130.24L65.024 367.616c-20.928-0.512-38.08 17.92-43.456 46.528C21.12 416.448 11.072 470.144 11.072 512.384c0 42.304 10.048 95.936 10.496 98.176 5.376 28.288 22.08 46.592 42.688 46.592 0.256 0 0.512 0 0.768 0l4.352 0c71.808 0 130.24 58.432 130.24 130.24 0 23.68-11.264 49.6-11.328 49.792-11.072 24.96-2.56 55.616 19.776 71.232l1.216 0.832 122.88 68.736 1.28 0.576c7.424 3.264 15.488 4.928 24.128 4.928 18.048 0 35.648-7.424 47.04-19.84 14.4-15.68 64.576-60.352 104.704-60.352 40.448 0 89.792 44.416 105.408 61.504 11.456 12.608 29.184 20.16 47.36 20.16l0 0 0 0c8.448 0 16.384-1.6 23.68-4.736l1.344-0.576 127.36-70.4 1.28-0.896c22.4-15.616 30.976-46.272 19.904-71.168-0.128-0.256-11.328-26.24-11.328-49.856 0-71.808 58.432-130.24 130.24-130.24l4.352 0c20.928 0.448 38.08-17.92 43.456-46.528 0.448-2.24 10.496-55.936 10.496-98.176C1012.928 470.144 1002.88 416.448 1002.496 414.208L1002.496 414.208zM509.824 685.248c-95.68 0-173.504-77.824-173.504-173.504 0-95.68 77.824-173.504 173.504-173.504 95.68 0 173.504 77.824 173.504 173.504C683.264 607.424 605.44 685.248 509.824 685.248L509.824 685.248zM509.824 685.248"></path>\
                    <path class="svgpath" data-index="path_1" fill="#272636" d="M509.824 397.248 509.824 397.248c-63.104 0-114.496 51.328-114.496 114.496 0 63.104 51.328 114.496 114.496 114.496 63.104 0 114.496-51.328 114.496-114.496C624.256 448.64 572.928 397.248 509.824 397.248L509.824 397.248zM509.824 397.248"></path>\
                </svg>';

            var structTtl = document.createElement('div');
            structTtl.className = 'divStructTtl divStructCover';
            if(container)structTtl.className += ' forSubIndex';
            structTtl.innerHTML = '\
            <!--<span class="spStructIcon">' + defaultSvg + '</span>-->\
            <span class="spStructName spStructNameCover">' + struct.name + '</span>\
            <span class="spStructValue spStructValueCover">综合达标率：<span class="spStructPt" data-point="' + (struct.point ? _this.entity.modal.option.prefix + struct.point : '') + '">Loading</span></span>\
            <!--<span class="pointDetail" data-detail="' + (struct.point ? _this.entity.modal.option.prefix + struct.point : '') + '">Loading</span>-->';
            var structBody = document.createElement('div');
            structBody.className = 'divStructBody divStuctBodyCover';
            var structItemTtl = this.createStructItemTtl();

            //var structItemList = document.createElement('div');
            //structItemList.className = 'divStructItemList';
            //
            //structBody.appendChild(structItemList);
            if ((struct.children instanceof Array) && struct.children.length > 0) {
                struct.children.forEach(function (item, index) {
                    if(item.children instanceof Array && item.children.length > 0){
                        _this.initStruct(struct.children,index,structBody);
                    }else {
                        structBody.appendChild(_this.createStructItem(item, index));
                        //structBody.appendChild(_this.createPointDetail(item))
                    }
                })
            }
            var firstItem = $(structBody).find('>.divStructItem')[0];
            if(firstItem)structBody.insertBefore(structItemTtl,firstItem);

            structDom.appendChild(structTtl);
            //structBody.appendChild(_this.createPointDetail(struct));
            structDom.appendChild(structBody);
            if(!container){
                kpiIndexDom.appendChild(structDom);
            }else{
                container.appendChild(structDom);
            }
        }else{
            var structBody = $(structDom).children('.structBody')[0];
            if ((struct.children instanceof Array) && struct.children.length > 0) {
                struct.children.forEach(function (item, index) {
                    if(item.children instanceof Array && item.children.length > 0){
                        _this.initStruct(struct.children,index,structBody);
                    }
                })
            }
        }
    };
    ModalKPIStruct.prototype.createStructItemTtl = function(){
        var structItemTtl = document.createElement('div');
        structItemTtl.className = 'divStructItemTtl clearfix divStructItemTtlCover';
        structItemTtl.innerHTML = '\
            <span class="spStructItemTtl spStructItemTtlCover">考核项</span>\
            <span class="spStructItemTtl">当前值</span>\
            <span class="spStructItemTtl">标准</span>\
            <span class="spStructItemTtl">考核结果</span>\
            ';
        return structItemTtl
    };
    ModalKPIStruct.prototype.createPointDetail = function(item){
        var structDetail = document.createElement('tr');
        structDetail.className = 'rowPointDetail';
        if(item.desc){
            structDetail.innerHTML = '<td class="divPointDetail" colspan="5"><span class="pointDetail" data-detail="' + (item.point?this.entity.modal.option.prefix + item.point:'') +'">' + item.desc + '</span></td>'
        }else{
            structDetail.innerHTML = '<td class="divPointDetail" colspan="5"><span class="pointDetail" data-detail="' + (item.point?this.entity.modal.option.prefix + item.point:'') +'">'+I18n.resource.dashboard.modalKPIStruct.NO_DATA_TEMP+'</span></td>';
        }
        return structDetail;
    };
    ModalKPIStruct.prototype.createStructItem = function(item,index){
        var _this = this;
        var structItem = document.createElement('div');
        structItem.dataset.itemChildIndex = index;
        structItem.className = 'divStructItem divStructItemCover';

        var name = document.createElement('span');
        name.className = 'spItemInfo spItemInfoCover';
        name.dataset.type = 'name';
        name.innerHTML =  item.name?item.name:'';
        structItem.appendChild(name);

        var info,itemAttr = ['va','st'];
        itemAttr.forEach(function(attr){
            info = document.createElement('span');
            info.className = 'spItemInfo';
            info.dataset.type = attr;
            info.dataset.point = _this.entity.modal.option.prefix + item.pointRoot + '_' + attr;
            structItem.appendChild(info);
        });

        var resultInfo = document.createElement('span');
        resultInfo.className = 'spItemInfo spItemKPIRs';
        resultInfo.dataset.point = _this.entity.modal.option.prefix + item.pointRoot + '_state';
        resultInfo.innerHTML = '\
                <span class="label label-success">达&nbsp;&nbsp;&nbsp;标</span>\
                <span class="label label-danger">不达标</span>\
                <span class="label label-default">未开启</span>\
                <span class="label label-none">无数据</span>';
        structItem.appendChild(resultInfo);

        //structItem.innerHTML = '\
        //    <span class="spItemInfo">' + (item.name?item.name:'') + '</span>\
        //    <span class="spItemInfo" data-point="'+ (item.point?this.entity.modal.option.prefix + item.point:'') +'">Loading</span>\
        //    <span class="spItemInfo spItemKPIRs">\
        //        <span class="label label-success">达&nbsp;&nbsp;&nbsp;标</span>\
        //        <span class="label label-danger">不达标</span>\
        //        <span class="label label-default">未开启</span>\
        //    </span>';
        if(item.desc){
            var detail = document.createElement('span');
            detail.className = 'pointDetail';
            detail.innerHTML = item.desc;
            structItem.appendChild(detail);
        }
        //else{
        //    structItem.innerHTML += '<span class="pointDetail" data-detail="' + (item.point?this.entity.modal.option.prefix + item.point:'') +'">'+I18n.resource.dashboard.modalKPIStruct.NO_DATA_TEMP+'</span>';
        //}
        return structItem;
    };
    ModalKPIStruct.prototype.setPointItem = function(dom,item){
        var itemDom = document.createElement('span');
        itemDom.className = 'spItemInfo';
        itemDom.dataset.type = item;
        itemDom.dataset.point = this.entity.modal.option.prefix + item;
        dom.appendChild(itemDom);
    };

    ModalKPIStruct.prototype.updateModal = function (points) {
        if(!(points[0] && points[0].data))return;
        var structList;
        var _this = this;
        try{
            structList = JSON.parse(points[0].data).KPIList;
        }catch(e){
            return;
        }
        this.store.KPIList = structList;
        structList.forEach(function(struct,index,self){
            _this.initStruct(self,index);
        });
        if(!this.isInit)this.afterInitStruct();
        this.isInit = true;
        var arrPoint = this.getRealTimePoint(structList);
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds:arrPoint}).done(function(result){
            if(!result.dsItemList)return;
            _this.initPointMap(result.dsItemList);
        }).always(function(){
            _this.indexSpinner.stop();
        });
    };
    ModalKPIStruct.prototype.afterInitStruct = function(){
        var $ptDetail = $('.pointDetail');
        if($ptDetail.length > 0 ){
            $ptDetail.eq(0).parent().addClass('focus');
            this.subEntity && this.refreshSubEntity($ptDetail.eq(0).parent())
        }
    };
    ModalKPIStruct.prototype.showConfigMode = function () {

    };
    ModalKPIStruct.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
        this.entity.modal.option = {
            structPoint:option.points[0],
            needDetail:option.needDetail
        };
        this.entity.modal.points = option.points[0];
        var projectId = 1;
        if(AppConfig.project && AppConfig.project.bindId){
            projectId = AppConfig.project.bindId;
        }else{
            projectId = AppConfig.projectId
        }
        this.entity.modal.option.prefix = '@' + projectId + '|';
        //this.entity.modal.option.prefix = '@72|';
        //return WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds:this.entity.modal.option.structPoint})
    };


    return ModalKPIStruct;
})();


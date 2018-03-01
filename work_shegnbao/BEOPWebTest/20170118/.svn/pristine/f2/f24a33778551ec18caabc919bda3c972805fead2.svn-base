var MapScreen = (function() {

    function MapScreen(container) {
        this.warehouseData = [];
        this.transporterData = [];
        this.allData = [];
        this.container = container;
        this.element = undefined;
        this.map = undefined;
        this.marker = undefined;
        //trace back
        this.historicalPath = undefined;
        this.canvasAnimation = undefined;
        this.ctxAnimation = undefined;
        this.isAnimationRunning = undefined;
        this.listSprite = [];

        this.$timeQueryDom = undefined;
    }

    MapScreen.prototype = {

        show: function() {
            this.init();
            return this;
        },

        close: function() {
            var _this = this;
            _this.map.destroy();
            _this.historicalPath = null;
            _this.canvasAnimation = null;
            _this.isAnimationRunning = null;
        },

        init: function() {
            this.initMap();
            this.initTimeQuery();
        },
        initTimeQuery:function(){
            this.$timeQueryDom = $('#divTimeQuery');
            this.$timeQueryDom.find('.iptDateTime').datetimepicker({
                todayBtn:'linked',
                endTime:new Date(),
                format:'yyyy-mm-dd hh:ii:ss',
                autoclose:true,
                initialDate:new Date()
            })
        },
        hideTimeQuery:function(){
            this.$timeQueryDom.hide();
            this.$timeQueryDom.find('.iptDateTime').datetimepicker('hide')
        },
        initMap: function() {
            var _this = this;
            $.getScript('http://webapi.amap.com/maps?v=1.3&key=9cc89c68a4bd6f3f5f65589f85ad7685&callback=init').done(function() {
                _this.map = new AMap.Map('divMap', {
                    zoom: 9,
                    center: [119.632171, 31.669173],
                    features: ['bg', 'road', 'building']
                });
                 _this.map.on('complete',function() {
                    _this.eventOnSelectedItem();
                    alert('地图加载完毕');
                });
                var result = fakeData;
                for (var key in result) {
                    if (key == "Warehouse") {
                        _this.warehouseData = result[key];
                        _this.renderTooltip(_this.warehouseData, key);
                    } else if (key == "Transporter") {
                        _this.transporterData = result[key];
                        _this.renderTooltip(_this.transporterData, key);
                    }
                }
/*                $('#divMap').off('click').on('click',function(e) {
                    $('.amap-marker').find('.dataContainer').empty();
                    $('#echartContainer').empty();
                    _this.hideTimeQuery();
                });*/
            });
        },

        appMapMark: function() {},

        refresh: function(data) {

        },

        render: function() {},

        eventOnSelectedItem: function() {
            var _this = this;
            var $dataMarker = $('.amap-marker');
            var status = {
                '0': '停止',
                '1': '行驶'
            };
            var allData = fakeData.Warehouse.concat(fakeData.Transporter);
            $dataMarker.off('click').on('click',
            function(e) {
                e.stopPropagation();
                var id = $(this).find('.markerDot').attr('id');
                var node = AppConfig.nav.filter.indexTree.getNodeByParam('_id',id)
                _this.selectMarker(node);
                $('#btnHisReview').off('click').on('click',function(e) {
                    $('#closeTranDetail').remove();
                    _this.switchToTracebackView();                
                    e.stopPropagation();
                });
                $('#btnDetailShow').off('click').on('click',function(e) {
                    $('#iotFilterIndexTree').find('[data-id="' + e.currentTarget.dataset.id + '"] .spLink').addClass('onLink');
                    AppConfig.nav.updateIframe(e.currentTarget.dataset.link);
                    $('#divMap').append('<div id="closeTranDetail"><span class="glyphicon glyphicon-remove"></span></div>');
                    e.stopPropagation();
                });

            });

        },
        switchToRealtimeView: function() {},
        switchToTracebackView: function() {
            this.showHistoricalPath();
        },
        selectMarker:function(node){
            if(!this.marker[node._id])return;
            this.map.setZoomAndCenter(14,node.params.gps);
            var _this = this;
            var status = {
                '0': '停止',
                '1': '行驶'
            };
            var $dataMarker = $('.amap-marker');
            $dataMarker.find('.dataContainer').empty();
            $dataMarker.css({
                'zIndex': '100'
            });
            $('#echartContainer').empty();
            var $marker=$('[id='+node._id+']');
            $marker.parent().parent().css({
                'zIndex': '150'
            });
            var $allMarker=$('.amap-marker').find('.markerDot');
            var dataContent;
            $allMarker.removeClass('active animated flash');
            this.hideTransporterPlane();
            if (node.type == "Transporter") {
                _this.$timeQueryDom.show();
                dataContent = '<ul class="dataDetail"><li><span>名称:</span><span>' + node.name + '</span></li><li><span>速度:</span><span>' + node.params.speed + 'km/h</span></li><li><span>状态:</span><span>' + status[node.params.status] + '</span></li><li><span>位置:</span><span>' + node.params.gps + '</span></li><li class="btnTool"><button class="btnHisReview" id="btnHisReview">历史回放</button></li></ul>';
                $('#echartContainer').html('<div class="echartDisplay" id="velocityAnalysis"></div><div class="echartDisplay" id="mileageAnalysis"></div>');
                $('#divMap').append('<div id="closeTranDetail"><span class="glyphicon glyphicon-remove"></span></div>');
                $('#divMap').addClass('fadeInUp');
                displayChart();

            } else {
                _this.hideTimeQuery();
                $('#echartContainer').empty();
                dataContent = '<ul class="dataDetail"><div id="closeWarehouseDetail"><span class="glyphicon glyphicon-remove"></span></div><li><span>名称:</span><span>' + node.name + '</span></li><li><span>温度:</span><span>' + node.params.temp + '℃</span></li><li class="btnTool"><button id="btnDetailShow" data-id="'+ node._id +'" data-link="' + node.link +'" class="btnHisReview">查看详情</button></li></ul>';

            }
            $('.divTabBox[data-type="' + node.type + '"]').trigger('click');
            $marker.find('.dataContainer').html(dataContent);
            $marker.addClass('active animated flash');


            var $treeDom = $('#iotFilterIndexTree');
            var $nodeDom = $treeDom.find('#' + node.tId +'>a');
            // $nodeDom.removeClass('curSelectDom');
            if(!$nodeDom.hasClass('curSelectedNode')){
                $nodeDom.parent().siblings().removeClass('focus');
                $nodeDom.parent().addClass('focus');
                AppConfig.nav.filter.indexTree.selectNode(node);
            }

            $('#closeWarehouseDetail').off('click').on('click',function(e){
                e.stopPropagation();
                $dataMarker.find('.dataContainer').empty();
            });
            $('#closeTranDetail').off('click').on('click',function(e){
                e.stopPropagation();
                _this.hideTransporterPlane();
            });
        },
        showHistoricalPath: function() {
            var _this=this;
            var data = fakeData.path,
            lineArr = [];
            for (var i = 0,
            item; i < data.length; i++) {
                item = data[i];
                lineArr.push([item.lng, item.lat]);
            }
            this.historicalPath = new AMap.Polyline({
                map: this.map,
                path: lineArr,
                strokeColor: "#333",
                //strokeColor: "#cc33cc",
                strokeOpacity: 0.4,
                strokeWeight: 3,
                strokeStyle: "solid"
            });
           var animMarker= new AMap.Marker({
                map: this.map,
                content: '<div class="cycleMarker"></div>',
                position: [119.916724, 31.812998],
                autoRotation:true  
            });
            this.map.setFitView([this.historicalPath]);
            this.startAnimation();
            var $btnClose='<div class="toolHisReview"><div id="btnPlay"><span class="glyphicon glyphicon-play"></span></div><div id="btnPause"><span class="glyphicon glyphicon-pause"></span></div><div id="btnCloseHis"><span class="glyphicon glyphicon-remove"></span></div></div>';
            $('.amap-layers').append($btnClose);
            $('#btnCloseHis').off('click').on('click',function(){
                _this.hideHistoricalPath();
            });
            $('#btnPlay').off('click').on('click',function(){
                //animMarker.moveAlong(lineArr,800);
            });
            $('#btnPause').off('click').on('click',function(){
                animMarker.stopMove();
            });
        },

        startAnimation: function () {
            var _this = this;

            //init canvas
            this.canvasAnimation = document.createElement('canvas');
            this.canvasAnimation.width = this.map.getSize().width;
            this.canvasAnimation.height = this.map.getSize().height;
            this.canvasAnimation.style.backgroundColor = 'rgba(30,30,30,0.4)';
            this.ctxAnimation = this.canvasAnimation.getContext('2d');

            //init sprite
            this.listSprite = {};
            var id = +new Date();
            var sprite = new SpritePoint(id);
            sprite.width = 10;
            sprite.height = 10
            this.listSprite[id] = sprite;


            //init layer of map
            this.pathLayer = new AMap.CustomLayer(this.canvasAnimation, {
                map: this.map,
                zIndex: 120,
            })

            this.pathLayer.render = function () {
                _this.isAnimationRunning = true;
                function renderAnimation() {
                    _this.paintFrame();
                    //if (_this.isAnimationRunning) requestAnimationFrame(renderAnimation);
                };
                renderAnimation();
            };
        },

        paintFrame: function () {
            var ctx = this.ctxAnimation;
            ctx.clearRect(0, 0, this.canvasAnimation.width, this.canvasAnimation.height);

            var data = fakeData.path, lineArr = [];
            ctx.beginPath();
            for (var i = 0, item; i < data.length; i++) {
                item = data[i];
                var position = this.map.lngLatToContainer(new AMap.LngLat(item.lng, item.lat));
                if (i > 0) {
                    ctx.lineTo(position.x, position.y);
                } else {
                    ctx.moveTo(position.x, position.y);
                }
            };
            ctx.closePath();

            var gradient = ctx.createLinearGradient(0, 0, 1700, 0);
            gradient.addColorStop("0", "magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 5;
            ctx.stroke();


            //var sprite;
            //for (var id in this.listSprite) {
            //    sprite = this.listSprite[id];
            //    //this.listSprite[id].paint(ctx);
            //}

            //var data = fakeData.path, lineArr = [];
            //ctx.beginPath();
            //var item = data[0];
            //var posOrg = this.map.lngLatToContainer(new AMap.LngLat(item.lng, item.lat));
            //item = data[1];
            //var posNow = this.map.lngLatToContainer(new AMap.LngLat(item.lng, item.lat));
            //var pos = math(posNow, posOrg);
            //sprite.x = pos.x; sprite.y = pos.y;
            //sprite.paint(ctx);

            //function math(now, org) {
            //    var speed = 1;
            //    var wid = Math.abs(now.x - org.x);
            //    var hei = Math.abs(now.y - org.y);
            //    var newxy = { x: 0, y: 0 };
            //    var length = Math.pow(Math.pow(wid, 2) + Math.pow(hei, 2), 1 / 2);
            //    if (speed < length) {
            //        newxy.x = org.x < now.x ? org.x + wid / length * speed : org.x - wid / length * speed;
            //        newxy.y = org.y < now.y ? org.y + hei / length * speed : org.y - hei / length * speed;
            //    }
            //    return newxy;
            //}
        },
        hideHistoricalPath: function () {
            this.historicalPath.hide();
            this.pathLayer.hide();
            this.isAnimationRunning = false;
            $('.toolHisReview').remove();
        },
        hideTransporterPlane:function(){
            $('.amap-marker').find('.dataContainer').empty();
            $('#echartContainer').empty();
            this.hideTimeQuery();
            $('#closeTranDetail').remove();
            $('#divMap').removeClass('fadeInUp');
        },

        renderTooltip: function(data, type) {
            var marker;
            var content;
            if(!this.marker)this.marker = {};
            for (var i = 0,
            len = data.length; i < len; i++) {
                if (type == "Warehouse") {
                    content = '<div class="markerDot markerWarehouse" id="' + data[i]._id + '"><div class="warehouse"><p>' + data[i].name + '</p><span class="iconfont icon-cangku" style="font-size:30px;display: block;margin-left: 10px;text-align:center;" ></span></div><div class="dataContainer" data-type="' + type + '"></div></div>';
                } else {
                    content = '<div class="markerDot markerTransporter" id="' + data[i]._id + '" style="color:red;"><div class="transporter"><span class="iconfont icon-jiantou" style="font-size:30px;display:block;transform:rotateZ(' + data[i].params.dir + 'deg);margin-left: 10px;text-align:center;"></span></div><div class="dataContainer" data-type="' + type + '"></div></div>';
                }
                marker = new AMap.Marker({
                    map: this.map,
                    content: content,
                    position: data[i].params.gps,
                    autoRotation:true  
                });
                this.marker[data[i]._id] = marker;
            }

        },

        renderDataDisplayPane: function() {},

    };
    function displayChart() {
        var velocityEchart = echarts.init(document.getElementById('velocityAnalysis'));
        var velocityOtion = getVelocityChartOption();
        velocityEchart.setOption(velocityOtion);

        var mileageEchart=echarts.init(document.getElementById('mileageAnalysis'));
        var mileageOption=getMileageOption();
        mileageEchart.setOption(mileageOption);

        window.onresize = mileageEchart.resize;
        window.onresize=velocityEchart.resize;
        $(window).resize(function() {
            $(velocityEchart).resize();
            $(mileageEchart).resize();
        });
    }
    function getMileageOption(){
        var chartData = fakeData.path.sort(function(a,b){return new Date(a.createTime) - new Date(b.createTime)});
        var option={
        baseOption:{
            title:{
                text:'里程与温度关联分析('+ new Date(chartData[0].createTime).format('yyyy-MM-dd') + ')',
                top:'10px',
                textStyle:{
                    color:'#11110F'
                }

            },
            legend:{
                top:'10px',
                data:['里程','温度'],
                right:35
            },
            grid:{
                bottom:35,
                top:70
            },
            xAxis:{
                position:'bottom',
                data:chartData.map(function(path){return path.createTime}),
                axisLabel:{
                    formatter: function (value, index) {
                        // 格式化成月/日，只在第一个刻度显示年份
                        return new Date(value).format('HH:mm');
                    }
                },
                type: 'category',
                boundaryGap: false
            },
            yAxis:[
                {
                    name:'里程/km',
                    left:'10px',
                    scale:false,
                    axisLine:{
                        show:false
                    },
                    offset:20,
                    axisTick:{
                        show:false
                    },
                    splitArea: {
                        show: false
                    }
                },
                {
                    name:'温度/℃',
                    scale:false,
                    axisLine:{
                        show:false
                    },
                    offset:20,
                    axisTick:{
                        show:false
                    },
                    splitArea: {
                        show: false
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            tooltip:{
                show:true,
                formatter:'{b}<br />{a}:{c}',
                trigger: 'axis'
            },
            series:[{
                name:'里程',
                type:'line',
                data:chartData.map(function(path,index){
                    if(index == 0){
                        return 0
                    }else {
                        return (chartData[index].mileage - chartData[index - 1].mileage)
                    }
                }),
                itemStyle : {
                    normal : {
                        lineStyle:{
                            color:'#1CBD9A'
                        }
                    }
                },
                axisLabel:{
                    formatter: function (value, index) {
                        // 格式化成月/日，只在第一个刻度显示年份
                        return new Date(value).format('HH:mm');
                    }
                }
            },{
                name:'温度',
                type:'line',
                yAxisIndex:1,
                data:chartData.map(function(path){return path.temperature}),
                itemStyle : {
                    normal : {
                        lineStyle:{
                            color:'#3698DB'
                        }
                    }
                }
            }]
        }
    };
    return option;
    }
    function getVelocityChartOption() {
        var chartData = fakeData.path.sort(function(a,b){return new Date(a.createTime) - new Date(b.createTime)});
        var lineChartOption = {
            title: {
                text: '车速频谱分析('+ new Date(chartData[0].createTime).format('yyyy-MM-dd') + ')',
                top:'10px',
                textStyle:{
                    color:'#11110F'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            grid:{
                left:80,
                bottom:35,
                top:70
            },
            legend: {
                top:'10px',
                data: ['车速'],
                show:false
            },
            toolbox: {
                show: true,
                feature: {
                    mark: true,
                    magicType: ['line', 'bar'],
                    restore: true,
                    saveAsImage: true
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: chartData.map(function(path){return path.createTime}),
                splitLine: {
                    show: false
                },
                axisLabel:{
                    formatter: function (value, index) {
                        return new Date(value).format('HH:mm');
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                name:'车速/kmh',
                axisLabel: {
                    formatter: '{value}'
                },
                axisLine:{
                    show:false
                },
                offset:20,
                axisTick:{
                    show:false
                },
                splitArea: {
                    show: false
                }
            }],
            series: [{
                name: '车速',
                type: 'line',
                barWidth:'20px',
                itemStyle: {
                    normal: {
                        color:'#19BD9B',
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: chartData.map(function(path){return path.speed})
            }]
        };
        return lineChartOption;
    }
    return MapScreen;
})();

var SpritePoint = function (id) {
    if (id !== undefined) this.id = id;
    return this;
};

SpritePoint.prototype = {
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    visible: true,
    animating: false,
    speed: 0,
    indexOfLastSection: 0,
    behaviors: [],

    paint: function (context) {
        context.fillRect(this.x, this.y, this.width, this.height);
    },

    update: function (context, time) {
        for (var i = this.behaviors.length; i > 0; --i) {
            this.behaviors[i - 1].execute(this, context, time);
        }
    }
};
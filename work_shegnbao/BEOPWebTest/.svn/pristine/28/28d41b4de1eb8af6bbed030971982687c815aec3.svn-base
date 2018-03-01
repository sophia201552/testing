/**
 * Created by vicky on 2016/1/28.
 */

var RealtimeData = (function(){
    var _this;
    function RealtimeData(screen){
        _this = this;
        this.screenData = screen;
        this.curIndex = 0;
        this.divEchart = $('#divEchart')[0];
        this.postData = {
            dsItemIds: [],
            timeFormat: "h1"
        }
    }

    RealtimeData.prototype.show = function(datas){
        var item = _this.screenData.screen.filterPanel.tree.getNodeByParam('_id', datas[0].id);
        var cls = {}, eqpName = $('[data-id="'+ datas[0].id +'"]')[0].dataset.name;
        this.dataRealtime = {}
        if(!item){return;}

        for (var type in _this.screenData.screen.filterPanel.dictClass) {
            var dictClass = _this.screenData.screen.filterPanel.dictClass[type];
            if (dictClass) {
                for (var keyCls in dictClass) {
                    if (keyCls == item.type) {
                        cls = dictClass[keyCls];
                        break;
                    }
                }
            }
        }

        for (var attr in cls.attrs) {
            this.dataRealtime[cls.attrs[attr].name] = item.arrP[attr];
        }

        var name, value, dsItemIds = [], $equipType = $('#equipType'), $divRealtimeAttrs = $('#divRealtimeAttrs').empty();
        $equipType.text(cls.name);

        //显示实时数据的label及input
        for(var i in this.dataRealtime){
            name = i;
            value = this.dataRealtime[i];
            $divRealtimeAttrs.append('<div class="form-group">\
                <label class="labelDs" draggable="true" data-dsid = "' + value + '" data-eqpName="'+ eqpName +'">' + name + '</label>\
                <input type="text" class="form-control divValue" style="width: 46%;" data-dsId = "' + value + '">');//<button class="btn btn-default viewHisData">历史数据</button></div>
            if(value){
                dsItemIds.push(value);
            }
        }

        //获取实时数据
        if(dsItemIds.length == 0) return;
        Spinner.spin($('#tabRealtimeData')[0]);
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {dsItemIds: dsItemIds}).done(function(result) {
            if(!result || !result.dsItemList || !(result.dsItemList instanceof Array)) return;
            result.dsItemList.forEach(function(index){
                $('[data-dsId="'+ index.dsItemId +'"]').val(index.data);
            });

        }).always(function(){
            Spinner.stop();
        });

        //绑定事件
        this.attachEvent();
    }

    RealtimeData.prototype.attachEvent = function(){

        var screen = this.screenData.screen;
        //显示历史数据
        $('#btnHistory').off('click').on('click', function(){
            var $paneHisData = $('#paneHisData');
            //生成dock
            if(!_this.dock){
                _this.dock = screen.dockManager.dockDown(screen.dockList, screen.hisData,.5);
            }

            //显示历史数据面板关闭按钮
            var $btnRemove = $paneHisData.parent().prev('.panel-titlebar').find('.glyphicon-remove').show();

            //为了填 dockspawn的坑, 只好每次关闭历史数据面板时重新生成历史面板的dom及重新加入dockManager
            $btnRemove[0].onclick = function(){
                $paneHisData.closest('.panel-base').remove();
                $('#wrapper').append('<div id="paneHisData">\
                    <div id="divEchart" style="width: 80%;height: 100%;float: left;"></div>\
                    <div id="divLegendWrap" style="width: 20%;height: 100%;float: left;"></div>\
                    <div style="clear: both"></div>\
                </div>');
                screen.hisData = new dockspawn.PanelContainer($('#paneHisData')[0], screen.dockManager, '历史数据');
                //重置数据
                _this.divEchart = $('#divEchart')[0];
                _this.chart = null;
                _this.dock = null;
                _this.postData.dsItemIds.length = 0;
                _this.curIndex = 0;
            }
            if(!_this.chart){
                _this.chart = echarts.init(_this.divEchart, 'macarons');
            }

            $paneHisData[0].ondrop = function(e){
                e.preventDefault();
                //var dsId =e.dataTransfer.getData("dsid");
                _this.getHisData();
            }

            $paneHisData[0].ondragover = function(e){
                e.preventDefault();
            }
        });

        $('.labelDs').each(function(){
            this.ondragstart = function(e){
                //e.dataTransfer.setData("dsId",this.dataset.dsid);
                _this.dragData = {
                    id: this.dataset.dsid,
                    name: this.dataset.eqpname + '_' + $(this).text()
                }
            }
        });
    }

    RealtimeData.prototype.close = function(){}

    RealtimeData.prototype.getHisData = function(){
        var dsId = this.dragData.id;
        if(dsId){
            //判断拖入的数据点是否已存在
            if($.inArray(dsId, this.postData.dsItemIds) < 0){
                this.postData.dsItemIds.push(dsId);
            }else{
                return;
            }

        }else{
            return;
        }

        if(this.postData.dsItemIds.length == 0){
            return;
        }
        var color = echarts.config.color[this.curIndex % echarts.config.color.length];
        var now = new Date();
        this.curIndex ++;
        this.renderLegend(dsId, this.dragData.name , 0, color);//id, name, type, color

        Spinner.spin($('#paneHisData')[0]);

        //postData参照dashboard的历史折线图
        this.postData.timeEnd = now.format('yyyy-MM-dd HH:mm:ss');//当前时间
        this.postData.timeStart = new Date(now.getTime() - 86400000).format('yyyy-MM-dd 00:00:00');//前一天的零点
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', this.postData).done(function(result){
            var option = _this.initOption( result.list, result.timeShaft);
            _this.chart.clear();
            _this.chart.setOption(option);
        }).always(function(){
            Spinner.stop();
        });
    }

    RealtimeData.prototype.initOption = function (arrSeries,timeShaft) {
        var series = [];
        for(var i = 0; i < arrSeries.length; i++){
            series.push({
                id: arrSeries[i].dsItemId,
                type:'line',
                data: arrSeries[i].data
            });
        }
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                x: 60, x2: 20, y: 60, borderColor: '#eee'
            },
            toolbox: {
                show: false
            },
            calculable: true,
            dataZoom: {
                show: false, start: 0, end: 100
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: timeShaft,
                    axisLabel: {
                        show: true,
                        formatter: '{value} ',
                        textStyle: {
                            color: '#eee'
                        }
                    },
                    splitLine:{
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value', scale: true,
                    axisLabel: {
                        formatter: function (value) {
                            var ret;
                            if (value < 1000) {
                                ret = value;
                            }
                            else if (value < 1000000) {
                                ret = value / 1000 + 'k';
                            }
                            else {
                                ret = value / 1000000 + 'M';
                            }
                            return ret;
                        }
                    },
                    splitLine:{
                        show: true,
                        lineStyle: {
                            color: '#666'
                        }
                    },
                    axisLine: {
                        show: false
                    }
                }
            ],//改变刻度（max-min）/yMark
            series: series,
            animation: this.animation,
            animationDuration: this.chartAnimationDuration,
            animationDurationUpdate: this.chartAnimationDuration / 4
        };
        return option;
    };


    RealtimeData.prototype.renderLegend = function (id, name, type, color) {
        var _this = this;

        var name = name;
        var div = document.createElement("div");
        var closeBtn = '<button type="button" class="close" style=><span>&times;</span></button>';
        var btnShow = '';//暂时不显示

        this.paneLegend = $('#divLegendWrap')[0];
        this.legendType = { NORMAL: 0, Prediction: 1, Regression: 2 };
        /*if (this.dictShowFlag[id]) {
            btnShow = '<span class="glyphicon glyphicon-eye-open btnShow" aria-hidden="true"></span>';
        }
        else {*/
            //btnShow = '<span class="glyphicon glyphicon-eye-close btnShow" aria-hidden="true"></span>';
        //}

        div.id = 'lg_'+id;
        div.dataset.id = id;
        div.className = "divLegend";
        div.draggable = true;
        div.style.backgroundColor = color;

        div.setAttribute('ty', type);
        switch (0) {//type
            case this.legendType.Regression: {
                div.innerHTML = "<div class='divTxtWrap'><span class='glyphicon glyphicon-retweet' style='margin-right: 10px;'></span>" + name.split('_Regression_')[0] + "_Regression</div>" + btnShow + closeBtn;
                this.initGeneralRegressorTooltip(id, div);
            }; break;
            case this.legendType.Prediction: {
                div.innerHTML = "<div class='divTxtWrap'><span class='glyphicon glyphicon-retweet' style='margin-right: 10px;'></span>" + name.split('_Prediction_')[0] + "_Prediction</div>" + btnShow + closeBtn;
                this.initGeneralPredictorTooltip(id, div);
            }; break;
            default: {
                div.innerHTML = "<div class='divTxtWrap'><span class='glyphicon glyphicon-stats' style='margin-right: 10px;'></span>" + name + '</div>'+ btnShow + closeBtn;
            }; break
        }

        div.getElementsByClassName('close')[0].onclick = function (e) {
            var $ele = $(e.currentTarget).parent();
            var id = $ele[0].dataset.id;
            if ($('.divLegend').length > 1) {
                var option = _this.chart.getOption();
                if (option) {
                    var arrSeries = option.series;
                    if (arrSeries) {
                        var cnt = 0;
                        for (var i = 0; i < arrSeries.length; i++) {
                            if (arrSeries[i].data.length > 0) {
                                cnt++;
                            }
                        }
                        if (cnt <= 1) {
                            alert('The only parameters can\'t be removed');
                            return;
                        }
                    }
                }

                $ele.tooltip('destroy');
                _this.removeSeries(id);

                var cnt = id.indexOf('_filter');
                if (-1 != cnt) {
                    var preId = id.substr(0, cnt);
                    if (preId) {
                        _this.removeSeries(preId + '_append');
                    }
                }
            } else {
                alert('The only parameters can\'t be removed');
            }
            e.stopPropagation();
        };
        /*div.getElementsByClassName('btnShow')[0].onclick = function (e) {
            var $ele = $(e.currentTarget).parent();
            var id = $ele[0].dataset.id;
            _this.switchSeries(id);// switch for show or hide
            e.stopPropagation();
        };*/

        div.ondragstart = function (e) {
            $(_this.paneLegend).addClass('dis');
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("id", e.currentTarget.dataset.id);
            e.dataTransfer.setData("source", "legend");
        };
        div.ondragenter = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        div.ondragover = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        this.paneLegend.appendChild(div);
        return div;
    };

    RealtimeData.prototype.removeSeries = function (id) {
        $('#lg_' + id).remove();

        var option = this.chart.getOption();
        var arrSeries = option.series;
        for (var i = 0; i < arrSeries.length; i++) {
            if (arrSeries[i].id == id) {
                arrSeries.splice(i, 1);
                break;
            }
        }

        var arrIds = this.postData.dsItemIds;
        for (var i = 0; i < arrIds.length; i++) {
            if (arrIds[i] == id) {
                arrIds.splice(i, 1);
            }
        }
        this.postData.dsItemIds = arrIds;

        this.chart = echarts.init(this.divEchart, 'macarons').setOption(this.initOption(arrSeries, option.xAxis[0].data));
    };

    return RealtimeData;

}());
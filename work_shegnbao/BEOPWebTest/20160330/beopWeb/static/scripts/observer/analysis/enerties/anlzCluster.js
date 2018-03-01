var AnlzCluster = (function () {
    function AnlzCluster(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
        this.m_panelTrend = undefined;
        this.m_panelScatter = undefined;
    }

    AnlzCluster.prototype = new AnlzBase();

    AnlzCluster.prototype.optionTemplate = {
        imgName: 'anlsPattern.png',
        imgIndex: 6,
        imgColor: '65,131,189',
        templateName: 'analysis.modalType.CLUSTER',
        templateParams: {
            paraName:['X'],
            paraAnlysMode:'part'
        },
        chartConfig: ['easy','fixed','recent'],
        type: ''
    };

    AnlzCluster.prototype.show = function () {
        var _this = this;
        this.initTools();
        this.container.innerHTML = '';
        
        // 初始化便签
        this.$paneNotes = $('<div style="position: relative; width: 100%; height: 100%;">');
        this.paneNotes = this.$paneNotes[0];
        // 初始化 docker
        this.$parentContainer = $(this.container).parent();
        this.$parentContainer.append($('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">').append(this.paneNotes));
        this.initDock();

        //显示图形 遍历
            if (!this.screen.curModal.graphList) {
                this.screen.curModal.graphList = [];
                } else {
                var graphList = this.screen.curModal.graphList;
                var graph = undefined;
                for (var i = 0; i < graphList.length; i++) {
                    if (graphList[i].type == 'arrow') {
                        graph = new DrawArrow(_this.screen, graphList[i], this.container, '');
                        } else if (graphList[i].type == 'rect') {
                        graph = new DrawRect(_this.screen, graphList[i], this.container, '');
                        } else if (graphList[i].type == 'circle') {
                        graph = new DrawCircle(_this.screen, graphList[i], this.container, '');
                    }
                    graph.show();
                    }
                    }

        if (!this.options.noteList) {
            this.options.noteList = [];
        } else {
            this.initNotes(this.options.noteList);
        }
        $('.itemTools .glyphicon-bookmark').off('click').click(function () {
            _this.createNote();
        });

        $(this.container).append(
            $('<div style="width: 100%; height: 450px;">\
                <ul class="nav nav-tabs" role="tablist" id="myTab">\
                    <li role="presentation" class="active">\
                        <a id="aTendency" href="#tabTendency" role="tab" data-toggle="tab" style="cursor:pointer;"><span i18n="analysis.paneConfig.TREND_DISTRIBUTE"></span></a>\
                    </li>\
                    <li role="presentation">\
                        <a id="aScatter" href="#tabScatter" role="tab" data-toggle="tab" style="cursor:pointer;"><span i18n="analysis.paneConfig.TYPE_POINT"></span></a>\
                    </li>\
                </ul>\
                <div class="tab-content">\
                    <div role="tabpanel" class="tab-pane fade in active" id="tabTendency" style="height: 400px;"></div>\
                    <div role="tabpanel" class="tab-pane fade" id="tabScatter" style="height: 400px;"></div>\
                </div>\
             </div>\
             <div class="panel panel-default" style="position: absolute; height: calc(100% - 450px); top: 450px; left: 0; right: 0;">\
                 <div class="panel-heading"><span i18n="analysis.paneConfig.TYPICAL_CONDITION"></span></div>\
                 <div class="panel-body" style="padding: 0; height: calc(100% - 40px); overflow-y: auto;">\
                     <table class="table" id="tableGroup" style="overflow-x: auto;"></table>\
                 </div>\
             </div>'));
        I18n.fillArea($(this.container));
        _this.spinnerRender.spin(this.container.parentElement);
        this.init();
    }
    AnlzCluster.prototype.close = function () {
        this.spinnerRender.stop();
        
        this.$paneNotes.parent().remove();
        this.$paneNotes = null;
        this.paneNotes = null;
        $('.svgBox').remove();
        $('#graphBox').hide();
    }
    AnlzCluster.prototype.init = function () {
        var _this = this;

        var arrIds = [];
        var arrType = [];

        var arrDSItems = this.options.itemDS;
        for (var i = 0; i < arrDSItems.length; i++) {
            var arrTemp = arrDSItems[i].arrId;
            if (arrTemp && arrTemp.length > 0) {
                arrIds = arrIds.concat(arrTemp);
                arrType.push(this.optionTemplate.templateParams.paraName[i]);
            }
        }

        var postData = {
            dsItemIds: arrIds,
            timeStart: this.options.startTime.format('yyyy-MM-dd HH:mm:ss'),
            timeEnd: this.options.endTime.format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: this.options.format,

            pointType: arrType,
            systemType: this.optionTemplate.type
        };
        WebAPI.post('/analysis/startWorkspaceDataGenCluster', postData).done(function (data) {
            if(data.error && data.error.length > 0) {
                _this.errAlert(data.error);
                _this.spinnerStop();
                return;
            }
            _this.renderModal(data);
        }).error(function (e) {
            _this.screen.alertNoData();
            _this.spinnerStop();
        });
    },

    AnlzCluster.prototype.render = function (data) {
        var _this = this;

        this.initTable(data);
        this.initTendency(data);

        $('#aScatter').on('shown.bs.tab', function (e) {
            if ($("#tabScatter div").length == 0) {
                _this.initScatter(data);
            }
        });
        _this.spinnerStop();
        $('#btnDownLoadExcel').hide();
    };

    AnlzCluster.prototype.initTable = function (data) {
        var table = $("#tableGroup");
        table.html("");
        $('#btnDownLoadExcel').hide();

        var tbody = document.createElement("tbody");
        var tr, td, divLegend, details;

        if (!data.dataAnalysisResult.Pattern) return;

        for (var i = 0; i < data.dataAnalysisResult.Pattern.length; i++) {
            details = data.dataAnalysisResult.Pattern[i].Diagnosis;
            tr = document.createElement("tr");
            td = document.createElement("td");
            td.rowSpan = details ? details.length : 1;
            //init legend
            divLegend = document.createElement("span");
            divLegend.textContent = "Group " + data.dataAnalysisResult.Pattern[i].name;
            divLegend.className = 'label label-warning';
            divLegend.style.padding = '3px';
            divLegend.style.backgroundColor = echarts.config.color[i];

            td.appendChild(divLegend);
            tr.appendChild(td);
            td = document.createElement('td');
            if (details) td.innerHTML = '<span class="label label-warning" style="margin-right: 8px;">' + details[0].name + '</span>' + details[0].detail;
            tr.appendChild(td);
            tbody.appendChild(tr);

            if (details && details.length > 1) {
                for (var j = 1; j < details.length; j++) {
                    tr = document.createElement("tr");
                    td = document.createElement("td");
                    td.innerHTML = '<span class="label label-warning" style="margin-right: 8px;">' + details[j].name + '</span>' + details[j].detail;
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                }
            }
        }

        $("#tableGroup").append(tbody);
    };

    AnlzCluster.prototype.initTendency = function (data) {
        var arrSeries = new Array();
        var arrLegend = new Array();

        for (var i = 0; i < data.dataAnalysisResult.Pattern.length; i++) {
            var item = data.dataAnalysisResult.Pattern[i]
            arrLegend.push(item.name);
            arrSeries.push({
                name: item.name,
                type: 'line',
                stack: '总量',
                itemStyle: { normal: { areaStyle: { type: 'default' } } },
                data: item.TrendValue
            });
        }

        var i18nEcharts = I18n.resource.echarts;
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: arrLegend
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['line', 'bar', 'stack', 'tiled'],
                        title : {
                            line : i18nEcharts.LINE,
                            bar : i18nEcharts.BAR,
                            stack : i18nEcharts.STACK,
                            tiled : i18nEcharts.TILED
                        }
                    },
                    restore: {
                        show: true,
                        title: i18nEcharts.REDUCTION
                    },
                    saveAsImage: {
                        show: true,
                        title: i18nEcharts.SAVE_AS_PICTURE,
                        lang : i18nEcharts.SAVE
                    }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: data.dataAnalysisResult.Pattern[0].TrendLabel
                }
            ],
            yAxis: [
                {
                    min: 0,
                    max: 100,
                    type: 'value'
                }
            ],
            series: arrSeries,
            animationDuration: this.chartAnimationDuration
        };

        this.m_panelTrend = echarts.init(document.getElementById("tabTendency"), AppConfig.chartTheme);
        this.m_panelTrend.setOption(option);
        this.chart = this.m_panelTrend;
    };

    AnlzCluster.prototype.initScatter = function (data) {
        var series = new Array();
        var seriesNames = new Array();

        for (var i = 0, item, name, arrData, len = data.dataAnalysisResult.ScatterChart.length; i < len; i++) {
            item = data.dataAnalysisResult.ScatterChart[i];
            name = item.name[0];
            arrData = new Array();
            for (var j = 0, itemPoint; j < item.data.length; j++) {
                itemPoint = item.data[j];
                arrData.push(itemPoint.split(','));
            }

            seriesNames.push(name);

            series.push({
                name: name,
                type: 'scatter',
                symbolSize: 5,
                data: arrData
            });
        }

        var i18nEcharts = I18n.resource.echarts;
        var option = {
            title: {
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.seriesName + '<br/>'
                           + params.value[0] + ', ' + params.value[1];
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        show: true,
                        title : {
                            dataZoom : i18nEcharts.DATAZOOM,
                            dataZoomReset : i18nEcharts.DATAZOOMRESET
                        }
                    },
                    restore: {
                        show: true,
                        title: i18nEcharts.REDUCTION
                    },
                    saveAsImage: {
                        show: true,
                        title: i18nEcharts.SAVE_AS_PICTURE,
                        lang : i18nEcharts.SAVE
                    }
                }
            },
            legend: {
                data: seriesNames
            },
            xAxis: [
                {
                    type: 'value',
                    scale: true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true
                }
            ],
            animation: true,
            series: series,
            animationDuration: this.chartAnimationDuration
        };


        var myChart = echarts.init(document.getElementById("tabScatter"), AppConfig.chartTheme);
        myChart.setOption(option);
    };
    return AnlzCluster;
})();

var AnlzCluster_AHU = (function () {
    function AnlzCluster_AHU(container, option, screen) {
        AnlzCluster.call(this, container, option, screen);
    }

    AnlzCluster_AHU.prototype = new AnlzCluster();

    AnlzCluster_AHU.prototype.optionTemplate = {
        imgName: 'anlsClusterAhu.png',
        imgIndex: 7,
        imgColor: '148,193,142',
        templateName: 'analysis.modalType.CLUSTER_AHU',
        templateParams: {
            paraName: ['MATemp', 'SATemp', 'RACO2', 'OATemp', 'RATemp', 'RATempSetting', 'SATempSetting',
                'RACO2Setting', 'HWTemp', 'CWTemp', 'OperationMode', 'OADamperRatio', 'HCDamperRatio', 'CCDamperRatio',
                'SAStaticPressure', 'SAStaticPressureSetting', 'FanVSDFrequency', 'CWRetrunTemp'],
            paraAnlysMode: 'part'
        },
        chartConfig: ['easy','fixed','recent'],
        type: 'AHU'
    };

    return AnlzCluster_AHU;
})();

var AnlzCluster_Chiller = (function () {
    function AnlzCluster_Chiller(container, option, screen) {
        AnlzCluster.call(this, container, option, screen);
    }

    AnlzCluster_Chiller.prototype = new AnlzCluster();

    AnlzCluster_Chiller.prototype.optionTemplate = {
        imgName: 'anlsClusterChiller.png',
        imgIndex: 8,
        imgColor: '211,97,78',
        templateName: 'analysis.modalType.CLUSTER_CHILLER',
        templateParams: {
            paraName:['OADryTemp', 'OAWetBulbTemp', 'AmperRatio', 'ChwSupplyTemp', 'ChwReturnTemp', 'CwReturnTemp', 'CwSupplyTemp', 'EvpTemp', 'CondTemp'],
            paraAnlysMode:'part'
        },
        chartConfig: ['easy','fixed','recent'],
        type: 'Chiller'
    };

    return AnlzCluster_Chiller;
})();
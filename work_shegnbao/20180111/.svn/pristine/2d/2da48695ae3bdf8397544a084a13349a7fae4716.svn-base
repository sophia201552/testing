/**
 * Created by vivian on 2017/7/13.
 */
class GroupProjectOverview {
    constructor(id) {
        this.id = id;
        // constructor(app,opt) {
        //     this.app = app;
        this.opt = undefined;
        // this.app = AppDriver;
        this.ctn = undefined;
        this.requestOnHandle = [];
        this.deleteRequestOnHandle = function(id) {
            for (var i = 0; i < this.requestOnHandle.length; i++) {
                if (this.requestOnHandle[i].id == id) {
                    this.requestOnHandle[i].res.abort && this.requestOnHandle[i].res.abort();
                    this.requestOnHandle.splice(i, 1);
                }
            }
        }
    }
    show() {
        this.init();
    }
    init() {
        var _this = this;
        WebAPI.get('/static/app/Platform/views/module/groupProjectOverview.html').done(function(result) {
            document.getElementById('indexMain').innerHTML = result;
            I18n.fillArea($('#indexMain'));
            this.ctn = document.getElementById('ctnGroupProjectOverview')

            var SpinnerLine = new LoadingSpinner({
                color: '#00FFFF'
            });
            SpinnerLine.spin($('#ctnGroupProjectOverview')[0]);
            var pointList = AppConfig.groupProjectCurrent.projectList.map(function(ele) {
                return '@' + ele.id + '|proj_IndInfoStatis'
            });
            var request = WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {
                "dsItemIds": pointList,
            });
            var requestId = ObjectId();
            this.requestOnHandle.push({
                res: request,
                id: requestId
            });
            request.done(rs => {
                _this.pointList = rs;
                _this.setEntity();
                _this.attachEvent();
                // console.log(this.pointList)
            }).always(() => {
                SpinnerLine.stop();
            });

        }.bind(this)).always(function() {
            I18n.fillArea($('#containerDisplayboard'));
        });
    }
    onGroupToggle() {
        this.close();
        this.show();
    }
    deleteRequestOnHandle(id) {
        for (var i = 0; i < this.requestOnHandle.length; i++) {
            this.requestOnHandle[i].id == id ? this.requestOnHandle.splice(i, 1) : 1;
        }
    }
    initQueryTime() {
        var $iptSelectTime = $('.iptSelectTime');
        $iptSelectTime.val(new Date().format('yyyy-MM-dd'));
        $('#spanSelectTime').datetimepicker({
            Format: 'yyyy-mm-dd',
            autoclose: true,
            startView: 2,
            minView: 2,
            todayHighlight: true
        });
        $('#spanSelectTime').datetimepicker().on('changeDay', function(ev) {
            $iptSelectTime.val(new Date(ev.date).format('yyyy-MM-dd'));
        });
    }
    attachEvent() {
        this.resizeEchart();
    }
    setEntity() {
        var container;
        var moduleOpt = ModuleIOC.getModuleByMultiParam({ module: 'summary', 'option.projectGrpId': this.id }, 'base')[0]
        var option;
        if (moduleOpt) option = moduleOpt.option;
        // var option = this.opt;
        this.opt = $.extend(true,{},option);
        for (var i = 0; i < option.option.length; i++) {
            var entityCls = GroupProjectOverview[option.option[i].type];
            if (entityCls) {
                var entityIns = new entityCls(this, option.option[i])
                entityIns.init()
            }
        }
    }

    resizeEchart(options, dom) {
        window.onresize = function() {
            $('[_echarts_instance_]').each(function(i, dom) {
                echarts.getInstanceById(dom.getAttribute('_echarts_instance_')).resize();
            });
        }
    }

    getUnit(num) {
            if (num == null || num === "") return '-';
            if (num == 0) return 0;
            if (num >= 1000) {
                return parseFloat(num / 1000).toFixed(0) + ' MWh';
            } else {
                return parseFloat(num).toFixed(0) + ' kWh';
            }
        }
        //获取千分位
    getThousandsBit(num) {
        if (num == null || num === "") return '-';
        if (num == 0) return 0;
        num = num.toFixed(0);　　
        var re = /\d{1,3}(?=(\d{3})+$)/g;　　
        var n1 = num.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
            return s1.replace(re, "$&,") + s2;
        });　　
        return n1 + ' kWh';
    }

    close() {
        this.requestOnHandle.forEach(function(item) {
            item.res.abort && item.res.abort();
        })
    }
}
window.GroupProjectOverview = GroupProjectOverview;
(function(exports) {
    function Base(screen, option) {
        this.screen = screen;
        this.container = undefined;
        this.option = option;
    }
    Base.prototype = {
        setting: {
            height: 5,
            width: 5
        },
        viewer: '',
        createContainer: function() {
            var container = document.createElement('div');
            container.className = 'ctnEntity';
            container.dataset.type = this.option.type;
            var html = this.viewer;
            container.innerHTML = html;
            container.style.height = this.setting.height * 10 + '%';
            container.style.width = this.setting.width * 10 + '%';
            this.container = container;
            this.screen.ctn.appendChild(this.container);
        },
        init: function() {
            this.createContainer();
            this.render();
            I18n.fillArea($('#containerDisplayboard'));

        },
        render: function() {},
        update: function() {},
        destory: function() {},
        getDataUrl: function(pointData, time,option) {
            var $promise = $.Deferred();
            var queryTime = toDate(time).format('yyyy-MM-dd HH:mm:ss');
            var toDay = toDate().format('yyyy-MM-01 00:00:00');
            var round = '';
            var _this = this;
            if (queryTime == toDay) {
                var postDataOne = {
                    dsItemIds: pointData,
                }
                round = 'startWorkspaceDataGenPieChart'
            } else {
                var postDataOne = {
                    dsItemIds: pointData,
                    timeStart: toDate(queryTime).format('yyyy-MM-' + DateUtil.daysInMonth(toDate(queryTime)) + '  23:55:00'),
                    timeEnd: toDate(queryTime).format('yyyy-MM-' + DateUtil.daysInMonth(toDate(queryTime)) + '  23:55:00'),
                    timeFormat: 'm5',
                    readCache:true
                }
                round = 'startWorkspaceDataGenHistogram'
            }
            var url = '/analysis/' + round;
            if(option){
                postDataOne = Object.assign({},postDataOne,option)
            }
            var request = WebAPI.post(url, postDataOne);


            var requestId = ObjectId();
            this.screen.requestOnHandle.push({
                res: request,
                id: requestId
            });
            request.done(function(result) {
                if (result) {
                    $promise.resolveWith(this, [result, round]);
                } else {
                    $promise.reject();
                }
            }).always(function() {
                _this.screen.deleteRequestOnHandle(requestId);
            }).fail(function() {

            })
            return $promise.promise();
        },
        getPoint: function(pointList) {
            var $promise = $.Deferred();
            var _this = this;

            var request = WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {
                "dsItemIds": pointList,
            });

            var requestId = ObjectId();
            this.screen.requestOnHandle.push({
                res: request,
                id: requestId
            });


            request.done(function(result) {
                if (result) {
                    $promise.resolveWith(this, [result]);
                } else {
                    $promise.reject();
                }
            }).always(function() {
                _this.screen.deleteRequestOnHandle(requestId);
            }).fail(function() {

            })
            return $promise.promise();
        },

    }
    exports.base = Base
}(GroupProjectOverview))


;
(function(exports, base) {
    function Anlysis(container, option) {
        base.apply(this, arguments);
    }
    Anlysis.prototype = Object.create(base.prototype); +
    function() {
        this.setting = {
                height: 4,
                width: 7
            },
            this.viewer = `<div class="panelCtn">
                            <div class="panelContainer">
                                <div class="topCtn">
                                    <div class="title"><span  class="showTitleLine"i18n="platform_app.group.TOTAL">用能统计</span>
                                        <div class="panelContainerTabTool">
                                            <div class="panelTabOne" data-typeId="1" i18n="platform_app.group.MTD" >月累计</div>
                                            <div class="panelTabOne" data-typeId="2" i18n="platform_app.group.SQUARE">单项目均方均值</div>
                                        </div>
                                        <div class="statisTime" style="display:flex"><input type="text" id="queryAnlysisTimIpt" class="form-control" readonly/></div>
                                    </div>
                                </div>
                                <div class="chartCtn chartAQIa" style="padding-top:10px;">
                                    <div class="echartMiddle" style="display:none;">
                                    </div>
                                    <div class="chartMain">
                                        
                                        
                                        
                                        
                                    </div>
                                </div>
                            </div>
                        </div>`,
            this.render = function() {
                $('.panelTabOne').css({ "pointer-events": "none" })
                $('.panelTabOne').off('click.clickTabColor').on('click.clickTabColor', function() {
                    $(this).removeClass('activedTab').siblings().removeClass('activedTab');
                    $(this).addClass('activedTab');
                })
                $('#queryAnlysisTimIpt').val(toDate().format('yyyy-MM')).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm',
                    autoclose: true,
                    minView: 3,
                    startView: 3,
                    endDate: toDate().format('yyyy-MM')
                });
                var _this = this;
                var pointData = [];
                var arrPromise = [];
                var nameArr = [];
                var SpinnerLine = new LoadingSpinner({
                    color: '#00FFFF'
                });
                SpinnerLine.spin($('.chartAQIa')[0]);
                var pointList = AppConfig.groupProjectCurrent.projectList.map(function(ele) {
                    return '@' + ele.id + '|proj_IndInfoStatis'
                });
                var pointArr = [];
                var pointRealArr = [];
                this.option.item.forEach(item => {
                    pointArr.push({key:item.ptKey,real:item.real?true:false})
                })
                    // _this.getPoint(pointList).done(function (result) {
                var result = this.screen.pointList
                var rsData = '';
                pointArr.forEach(item => {
                    for (var i = 0; i < result.dsItemList.length; i++) {
                        if (result.dsItemList[i].data == 'Null') {
                            rsData = 'Null'
                                // SpinnerLine.stop();
                                // return
                            continue
                        }
                        var value = JSON.parse(result.dsItemList[i].data);
                        if(!value[item.key])continue;
                        var idd = result.dsItemList[i].dsItemId.split('|')[0]
                        if(!item.real)pointData.push(idd + '|' + value[item.key].point);
                        nameArr.push({
                            real:item.real,
                            name: item.key,
                            nameZh: value[item.key].name,
                            pointName: value[item.key].point,
                            id: result.dsItemList[i].dsItemId.split('|')[0].split('@')[1],
                            unit: value[item.key].unit?value[item.key].unit:'',
                            point:idd + '|' + value[item.key].point
                        })
                    }

                })
                if (rsData == 'Null') {
                    if (nameArr.length == 0) {
                        $('.echartMiddle').html('<p class="text-muted" i18n="platform_app.group.WARN">没有配置点名!</p>');
                        I18n.fillArea($('.echartMiddle'));
                        SpinnerLine.stop();
                        return;
                    }

                }
                var sortnameArr = nameArr;
                var dic = _this.option.item;

                _this.option.valid = Number(Number(nameArr.length) / Number(_this.option.item.length)).toFixed(0);
                $('.panelTabOne').off('click.clickTab').on('click.clickTab', function() {
                    var _thisType = Number($(this).attr('data-typeId'));
                    $('.chartMain').empty();
                    dic.filter((item)=>{return item.group == _thisType}).forEach((rcs, k) => {
                        _this.createNewDom(rcs, k, _thisType, _this.timeShaft)
                    })
                });
                SpinnerLine.spin($('.chartAQIa')[0]);
                getData(sortnameArr, pointData, dic, 1);
                $('.panelTabOne').eq(0).addClass('activedTab');
                // })
                function renderLineChart(classCt, i, timeShaft, data) {
                    timeShaft.pop();
                    let name=[];
                    let dataArr=[];
                    data.forEach(item=>{
                        name.push(item.name);
                        dataArr.push(parseInt(item.data));
                    });
                    var colorArr = [
                        ['#f4b653', '#f3df5e'],
                        ['#65f2fb', '#75b4fd'],
                        ['#66ccff', '#aaaaff'],
                        ['#fc84d3', '#d581fc']
                    ];
                    var colorAreaArr = ['244,182,83', '101,242,251', '102,204,255', '252,132,211'] //rgba
                    var option = {
                        backgroundColor: 'transport',
                        tooltip: {
                            trigger: 'axis',
                        },
                        legend: {
                            show: false,
                        },
                        grid: {
                            left: 0,
                            top: '25px',
                            right: 10,
                            bottom: '25px',
                        },
                        xAxis: [{
                            type: 'category',
                            show: true,
                            nameGap: 0,
                            splitLine: {
                                show: true,
                                interval: 'auto',
                                lineStyle: {
                                    color: ['rgba(238,242,249,0.3)']
                                }
                            },
                            boundaryGap: false,
                            axisLabel: {
                                show: false,
                            },
                            axisLine: {
                                show: false,
                            },
                            axisTick: {
                                show: false,
                            },
                            data: name
                        }],
                        yAxis: [{
                            type: 'value',
                            show: true,
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                interval: 'auto',
                                show: true,
                                lineStyle: {
                                    color: ['rgba(238,242,249,0.3)']
                                }
                            },

                            axisLine: {
                                show: false,

                            },
                            axisLabel: {
                                margin: 10,
                                show: false,
                                textStyle: {
                                    fontSize: 14
                                }
                            },

                        }],
                        series: {
                            name: '',
                            type: 'bar',
                            smooth: true,
                            symbol: 'none',
                            symbolSize: 5,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                            offset: 0,
                                            color: colorArr[i][0]
                                        }, {
                                            offset: 1,
                                            color: colorArr[i][1]
                                        }])
                                    },
                                    width: 4,
                                    shadowColor: 'rgba(175, 88, 231, 0.36)',
                                    shadowBlur: 4,
                                    shadowOffsetY: 2,
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(' + colorAreaArr[i] + ', 0.5)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(' + colorAreaArr[i] + ', 0)'
                                    }], false),
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                        offset: 0,
                                        color: colorArr[i][0]
                                    }, {
                                        offset: 1,
                                        color: colorArr[i][1]
                                    }])
                                },
                                emphasis: {
                                    borderWidth: 0
                                }
                            },
                            data: dataArr
                        }

                    };
                    var chart = echarts.init(classCt); //,this.opt.chartTheme
                    chart.setOption(option);

                }

                function getData(sortnameArr, pointData, dic, isAll) {
                    var queryAnlysisTimIpt = $('#queryAnlysisTimIpt').val();
                    //初始化时间操作
                    var nowYear = toDate(queryAnlysisTimIpt).getFullYear();
                    var nowMonth = toDate(queryAnlysisTimIpt).getMonth();
                    var nowDay = toDate(queryAnlysisTimIpt).getDate();
                    var currentYear = toDate().getFullYear();
                    var currentBeforMonth = toDate().getMonth() - 1;
                    var currentDate = toDate().getDate();
                    if (toDate(queryAnlysisTimIpt).format('yyyy-MM') == (toDate().format('yyyy-MM'))) {
                        LastDateForCurMon = toDate();
                    } else {
                        LastDateForCurMon = toDate(toDate(queryAnlysisTimIpt).setDate(DateUtil.daysInMonth(toDate(queryAnlysisTimIpt))))
                    }
                    var time = {
                        dsItemIds: pointData,
                        timeStart: toDate(+toDate(LastDateForCurMon)).format('yyyy-MM-01 00:00:00'),
                        timeEnd: toDate(+toDate(LastDateForCurMon)).format('yyyy-MM-dd 23:59:59'),
                        timeFormat: 'd1',
                        autoFix:false,
                        readCache:true
                    }
                    var nowdays = toDate(LastDateForCurMon);
                    var year = nowdays.getFullYear();
                    var month = nowdays.getMonth();
                    var lastMonth = toDate(year, month, 0)
                    if (toDate(LastDateForCurMon).getDate() > DateUtil.daysInMonth(lastMonth)) {
                        var timeBefore = {
                            dsItemIds: pointData,
                            timeStart: toDate(lastMonth).format('yyyy-MM-01 00:00:00'),
                            // timeEnd: toDate(toDate(year, month, 0).setDate(toDate(LastDateForCurMon).getDate() - DateUtil.daysInMonth(lastMonth))).format('yyyy-MM-dd 23:59:59'),
                            timeEnd: toDate(toDate(year, month, 0).setDate(toDate(LastDateForCurMon).getDate())).format('yyyy-MM-dd 23:59:59'),

                            timeFormat: 'd1',
                            autoFix:false,
                            readCache:true
                        }
                    } else {
                        var timeBefore = {
                            dsItemIds: pointData,
                            timeStart: toDate(lastMonth).format('yyyy-MM-01 00:00:00'),
                            timeEnd: toDate(lastMonth).format('yyyy-MM-' + toDate(LastDateForCurMon).format('dd') + ' 23:59:59'),
                            timeFormat: 'd1',
                            autoFix:false,
                            readCache:true
                        }
                    }
                    time.timeEnd = toDate(toDate(time.timeEnd).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
                    timeBefore.timeEnd = toDate(toDate(timeBefore.timeEnd).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
                    var timeMore = {
                            dsItemIds: pointData,
                            timeStart: toDate(toDate(time.timeEnd).valueOf() - 86400000 * 7).format('yyyy-MM-dd HH:mm:ss'),
                            timeEnd: toDate(time.timeEnd).format('yyyy-MM-dd HH:mm:ss'),
                            timeFormat: 'd1',
                            autoFix:false,
                            readCache:true
                        }
                        //初始化时间end Time
                    
                    var realPoint = sortnameArr.filter(item=>{return item.real;}).map(item=>{return item.point});
                    var realPointMore = {
                            dsItemIds: realPoint,
                            timeStart: toDate(toDate(time.timeEnd).valueOf() - 86400000 * 7).format('yyyy-MM-dd HH:mm:ss'),
                            timeEnd: toDate(time.timeEnd).format('yyyy-MM-dd HH:mm:ss'),
                            timeFormat: 'd1',
                            readCache:true
                    }
                    var promiseArrs = [WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', time), WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', timeBefore), WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', timeMore),
                        _this.getDataUrl(realPoint,queryAnlysisTimIpt,{timeFOrmat:'d1'})
                        ,_this.getDataUrl(realPoint,moment('2018-02').subtract(1,'month').format('YYYY-MM'),{timeFormat:'d1'})
                        ,WebAPI.post('/analysis/startWorkspaceDataGenHistogram', realPointMore)
                    ]



                    promiseArrs.forEach(item => {
                        var requestId = ObjectId();
                        _this.screen.requestOnHandle.push({
                            res: item,
                            id: requestId
                        });
                    })
                    $.when(...promiseArrs).done((rs, rs1, rs2, rs4, rs5, rs6) => {
                        // var rs={"list": [{"data": [1003.2, 3841, 2718.4, 0, 0, 0, 0, 0, 0, 0, 1828.1, 1891.4, 1921.8, 1921.9], "dsItemId": "@645|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]}, {"data": [107.3, 11084.1, 9682.8, 0, 0, 0, 0, 0, 12404.5, 9856.2, 10701.6, 12849.8, 10198.9, 5533.3], "dsItemId": "@646|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@647|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_Elec_Consumption", "errorFlag": [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@533|proj_Elec_Consumption"}, {"data": [99154, 99680, 103292, 105186, 107922, 103804, 99720, 110732, 111596, 115090, 116690, 117462, 105848, 99258], "dsItemId": "@539|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@540|proj_Elec_Consumption"}, {"data": [18700.91, 22127.25, 22161.51, 22749.34, 22679.5, 18692.79, 18362.04, 22260.7, 22616.24, 22544.47, 22609.25, 22089.73, 0, 0], "dsItemId": "@542|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]}, {"data": [28815.1, 29781.89, 27796.99, 26255.23, 27353.86, 26618.11, 27100.93, 28745.73, 29810.048, 30518.91, 32144.38, 33185.92, 29953.024, 28058.75], "dsItemId": "@674|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@675|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@676|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@677|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@678|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@679|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@680|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@681|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@682|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@683|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@684|proj_Elec_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@671|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]}, {"data": [0, 0, 11078.33, 11040, 11078.33, 0, 0, 0, 11583.83, 11148.58, 11421.67, 0, 5883751.3, 11078.33], "dsItemId": "@575|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0]}, {"data": [13.87, 16935.94, 20929.39, 22411.84, 37347.84, 0, 0, 37786.77, 30217.45, 23716.53, 38278.93, 36837.69, 36671.3, 33044.73], "dsItemId": "@71|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [13.87, 16935.94, 20929.39, 22411.84, 37347.84, 0, 0, 37786.77, 30217.45, 23716.53, 38278.93, 36837.69, 36671.3, 33044.73], "dsItemId": "@72|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@76|proj_Elec_Consumption"}, {"data": [13.87, 16935.94, 20929.39, 22411.84, 37347.84, 0, 0, 37786.77, 30217.45, 23716.53, 38278.93, 36837.69, 36671.3, 33044.73], "dsItemId": "@466|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 11078.33, 11040, 11078.33, 0, 0, 0, 11583.83, 11148.58, 11421.67, 0, 5883751.3, 11078.33], "dsItemId": "@293|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0]}, {"data": [665.3, 1770.8, 1188, 962.3, 1233.9, 636.4, 0, 0, 1882.8, 1136.9, 1127.2, 0, 0, 383.7], "dsItemId": "@491|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0]}, {"data": [33720, 22550, 23150, 22890, 31120, 34470, 24860, 25350, 28640, 30760, 30670, 36820, 38520, 36180], "dsItemId": "@120|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [264.9, 12923.1, 9224.9, 4694.8, 7404.3, 1403, 0, 0, 0, 0, 9300.6, 11352.8, 1719.8, 264.9], "dsItemId": "@510|proj_Elec_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@645|proj_Water_Consumption", "errorFlag": [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]}, {"data": [55, 17425, 15155, 0, 0, 0, 0, 0, 17405, 16990, 15490, 17025, 15205, 30520], "dsItemId": "@646|proj_Water_Consumption", "errorFlag": [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@647|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_Water_Consumption", "errorFlag": [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@533|proj_Water_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@539|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@540|proj_Water_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@542|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [9.87, 10.41, 10.19, 10.095, 10.53, 10.33, 9.68, 9.88, 10.13, 10.22, 10.45, 10.43, 10.72, 10.77], "dsItemId": "@674|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@675|proj_Water_Consumption"}, {"data": [], "dsItemId": "@676|proj_Water_Consumption"}, {"data": [], "dsItemId": "@677|proj_Water_Consumption"}, {"data": [], "dsItemId": "@678|proj_Water_Consumption"}, {"data": [], "dsItemId": "@679|proj_Water_Consumption"}, {"data": [], "dsItemId": "@680|proj_Water_Consumption"}, {"data": [], "dsItemId": "@681|proj_Water_Consumption"}, {"data": [], "dsItemId": "@682|proj_Water_Consumption"}, {"data": [], "dsItemId": "@683|proj_Water_Consumption"}, {"data": [], "dsItemId": "@684|proj_Water_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@671|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@575|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@71|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@72|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@76|proj_Water_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@466|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@293|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@491|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@120|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@510|proj_Water_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@645|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]}, {"data": [0, 83.46, 85.8, 0, 0, 0, 0, 0, 70.8, 78.15, 74.66, 75.69, 96.68, 83.26], "dsItemId": "@646|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@647|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_Gas_Consumption", "errorFlag": [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@533|proj_Gas_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@539|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@540|proj_Gas_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@542|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@674|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@675|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@676|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@677|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@678|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@679|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@680|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@681|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@682|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@683|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@684|proj_Gas_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@671|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@575|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@71|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@72|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@76|proj_Gas_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@466|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@293|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@491|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@120|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@510|proj_Gas_Consumption", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@645|proj_CO2_Emission", "errorFlag": [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]}, {"data": [0.1, 8.7, 7.6, 0, 0, 0, 0, 0, 9.7, 7.7, 8.4, 10.1, 8.0, 4.4], "dsItemId": "@646|proj_CO2_Emission", "errorFlag": [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@647|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_CO2_Emission", "errorFlag": [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@533|proj_CO2_Emission"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@539|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@540|proj_CO2_Emission"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@542|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@674|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@675|proj_CO2_Emission"}, {"data": [], "dsItemId": "@676|proj_CO2_Emission"}, {"data": [], "dsItemId": "@677|proj_CO2_Emission"}, {"data": [], "dsItemId": "@678|proj_CO2_Emission"}, {"data": [], "dsItemId": "@679|proj_CO2_Emission"}, {"data": [], "dsItemId": "@680|proj_CO2_Emission"}, {"data": [], "dsItemId": "@681|proj_CO2_Emission"}, {"data": [], "dsItemId": "@682|proj_CO2_Emission"}, {"data": [], "dsItemId": "@683|proj_CO2_Emission"}, {"data": [], "dsItemId": "@684|proj_CO2_Emission"}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@671|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 7.2, 0, 0, 0, 0, 0, 28.5, 0, 0], "dsItemId": "@575|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0]}, {"data": [0.0056, 6.84, 8.46, 9.054, 15.089, 0, 0, 15.27, 12.21, 9.58, 15.46, 14.88, 14.82, 13.35], "dsItemId": "@71|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0.0056, 6.84, 8.46, 9.054, 15.089, 0, 0, 15.27, 12.21, 9.58, 15.46, 14.88, 14.82, 13.35], "dsItemId": "@72|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@76|proj_CO2_Emission"}, {"data": [0.0056, 6.84, 8.46, 9.054, 15.089, 0, 0, 15.27, 12.21, 9.58, 15.46, 14.88, 14.82, 13.35], "dsItemId": "@466|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 7.2, 0, 0, 0, 0, 0, 28.5, 0, 0], "dsItemId": "@293|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@491|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@120|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@510|proj_CO2_Emission", "errorFlag": [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]}], "timeShaft": ["2018-01-01 00:00:00", "2018-01-02 00:00:00", "2018-01-03 00:00:00", "2018-01-04 00:00:00", "2018-01-05 00:00:00", "2018-01-06 00:00:00", "2018-01-07 00:00:00", "2018-01-08 00:00:00", "2018-01-09 00:00:00", "2018-01-10 00:00:00", "2018-01-11 00:00:00", "2018-01-12 00:00:00", "2018-01-13 00:00:00", "2018-01-14 00:00:00", "2018-01-15 00:00:00"]}
                        // console.log(rs[0]=rs);
                        // var rs1={"timeShaft": ["2017-12-01 00:00:00", "2017-12-02 00:00:00", "2017-12-03 00:00:00", "2017-12-04 00:00:00", "2017-12-05 00:00:00", "2017-12-06 00:00:00", "2017-12-07 00:00:00", "2017-12-08 00:00:00", "2017-12-09 00:00:00", "2017-12-10 00:00:00", "2017-12-11 00:00:00", "2017-12-12 00:00:00", "2017-12-13 00:00:00", "2017-12-14 00:00:00", "2017-12-15 00:00:00"], "list": [{"errorFlag": [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@645|proj_Elec_Consumption", "data": [3731, 0, 0, 0, 2628.7, 3074.4, 4196.1, 4183.4, 4206.6, 4183.4, 4087.5, 3830.4, 3971.6, 4244.2]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], "dsItemId": "@646|proj_Elec_Consumption", "data": [11260.5, 4613, 6851.9, 9478.8, 8530.8, 7697.2, 11876.3, 7834.5, 10035.3, 10124.9, 10347.1, 11012.9, 10983.4, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@647|proj_Elec_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_Elec_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@533|proj_Elec_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@539|proj_Elec_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@540|proj_Elec_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@542|proj_Elec_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@674|proj_Elec_Consumption", "data": [30205.31, 29649.79, 29543.94, 29979.39, 30497.79, 30752.9, 32408.064, 34729.98, 31587.2, 27158.91, 26770.94, 26386.94, 26325.25, 27072.64]}, {"data": [], "dsItemId": "@675|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@676|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@677|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@678|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@679|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@680|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@681|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@682|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@683|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@684|proj_Elec_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@671|proj_Elec_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@575|proj_Elec_Consumption", "data": [11078.33, 11040, 11116.67, 11078.33, 11171.23, 11078.33, 11092.19, 11078.33, 11078.33, 11078.33, 11078.33, 11078.33, 11078.33, 11040]}, {"errorFlag": [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@71|proj_Elec_Consumption", "data": [111483.93, 129152.69, 73950.21, 0, 37816.33, 35922.8, 36527.77, 42957.99, 39198.7, 36126.0092, 36152.28, 37088.79, 38206.27, 40196.52]}, {"errorFlag": [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@72|proj_Elec_Consumption", "data": [111483.93, 129152.69, 73950.21, 0, 37816.33, 35922.8, 36527.77, 42957.99, 39198.7, 36126.0092, 36152.28, 37088.79, 38206.27, 40196.52]}, {"data": [], "dsItemId": "@76|proj_Elec_Consumption"}, {"errorFlag": [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@466|proj_Elec_Consumption", "data": [111483.93, 129152.69, 73950.21, 0, 37816.33, 35922.8, 36527.77, 42957.99, 39198.7, 36126.0092, 36152.28, 37088.79, 38206.27, 40196.52]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@293|proj_Elec_Consumption", "data": [11078.33, 11040, 11116.67, 11078.33, 11171.23, 11078.33, 11092.19, 11078.33, 11078.33, 11078.33, 11078.33, 11078.33, 11078.33, 11040]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@491|proj_Elec_Consumption", "data": [6071.7, 1604.2, 1677.5, 947.8, 821.5, 830.5, 959.5, 1195.8, 464.7, 442.3, 1332.2, 1434.5, 1575.6, 1598.3]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@120|proj_Elec_Consumption", "data": [31430, 37960, 30200, 20370, 21240, 21730, 20260, 24640, 24150, 22890, 21150, 22310, 23480, 27190]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], "dsItemId": "@510|proj_Elec_Consumption", "data": [11300.3, 2700.5, 2039.1, 3640.3, 3691.5, 4518.4, 8344.3, 0, 0, 1899.3, 11349.1, 10627.3, 10827.4, 11726]}, {"errorFlag": [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@645|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], "dsItemId": "@646|proj_Water_Consumption", "data": [41625, 32450, 41585, 16230, 13960, 15215, 13260, 13630, 13560, 33255, 42345, 16185, 15610, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@647|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@533|proj_Water_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@539|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@540|proj_Water_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@542|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@674|proj_Water_Consumption", "data": [0, 660.17, 640.21, 638.93, 612.034, 628.69, 634.023, 654.11, 632.26, 628.036, 626.98, 645.46, 678.45, 707.79]}, {"data": [], "dsItemId": "@675|proj_Water_Consumption"}, {"data": [], "dsItemId": "@676|proj_Water_Consumption"}, {"data": [], "dsItemId": "@677|proj_Water_Consumption"}, {"data": [], "dsItemId": "@678|proj_Water_Consumption"}, {"data": [], "dsItemId": "@679|proj_Water_Consumption"}, {"data": [], "dsItemId": "@680|proj_Water_Consumption"}, {"data": [], "dsItemId": "@681|proj_Water_Consumption"}, {"data": [], "dsItemId": "@682|proj_Water_Consumption"}, {"data": [], "dsItemId": "@683|proj_Water_Consumption"}, {"data": [], "dsItemId": "@684|proj_Water_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@671|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@575|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@71|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@72|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@76|proj_Water_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@466|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@293|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@491|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@120|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], "dsItemId": "@510|proj_Water_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@645|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], "dsItemId": "@646|proj_Gas_Consumption", "data": [72.11, 98.18, 90.16, 85.34, 64.68, 76.54, 71.46, 73.93, 93.55, 99.79, 73.24, 66.38, 80.62, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@647|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@533|proj_Gas_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@539|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@540|proj_Gas_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@542|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@674|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@675|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@676|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@677|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@678|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@679|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@680|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@681|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@682|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@683|proj_Gas_Consumption"}, {"data": [], "dsItemId": "@684|proj_Gas_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@671|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@575|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@71|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@72|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@76|proj_Gas_Consumption"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@466|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@293|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@491|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@120|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], "dsItemId": "@510|proj_Gas_Consumption", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@645|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], "dsItemId": "@646|proj_CO2_Emission", "data": [8.8, 3.6, 5.4, 7.4, 6.7, 6.1, 9.3, 6.1, 7.9, 8, 8.1, 8.6, 8.7, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@647|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@533|proj_CO2_Emission"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@539|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@540|proj_CO2_Emission"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@542|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@674|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"data": [], "dsItemId": "@675|proj_CO2_Emission"}, {"data": [], "dsItemId": "@676|proj_CO2_Emission"}, {"data": [], "dsItemId": "@677|proj_CO2_Emission"}, {"data": [], "dsItemId": "@678|proj_CO2_Emission"}, {"data": [], "dsItemId": "@679|proj_CO2_Emission"}, {"data": [], "dsItemId": "@680|proj_CO2_Emission"}, {"data": [], "dsItemId": "@681|proj_CO2_Emission"}, {"data": [], "dsItemId": "@682|proj_CO2_Emission"}, {"data": [], "dsItemId": "@683|proj_CO2_Emission"}, {"data": [], "dsItemId": "@684|proj_CO2_Emission"}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@671|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@575|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@71|proj_CO2_Emission", "data": [45.04, 52.18, 29.88, 0, 15.28, 14.51, 14.76, 17.36, 15.84, 14.59, 14.61, 14.98, 15.44, 16.24]}, {"errorFlag": [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@72|proj_CO2_Emission", "data": [45.04, 52.18, 29.88, 0, 15.28, 14.51, 14.76, 17.36, 15.84, 14.59, 14.61, 14.98, 15.44, 16.24]}, {"data": [], "dsItemId": "@76|proj_CO2_Emission"}, {"errorFlag": [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@466|proj_CO2_Emission", "data": [45.04, 52.18, 29.88, 0, 15.28, 14.51, 14.76, 17.36, 15.84, 14.59, 14.61, 14.98, 15.44, 16.24]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@293|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@491|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "dsItemId": "@120|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"errorFlag": [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], "dsItemId": "@510|proj_CO2_Emission", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}]}
                        // var rs2={"list": [{"data": [0, 0, 1828.1, 1891.4, 1921.8, 1921.9, 1688.8], "errorFlag": [1, 1, 0, 0, 0, 0, 0], "dsItemId": "@645|proj_Elec_Consumption"}, {"data": [12404.5, 9856.2, 10701.6, 12849.8, 10198.9, 5533.3, 10952.4], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@646|proj_Elec_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [1, 1, 1, 0, 0, 0, 0], "dsItemId": "@647|proj_Elec_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@533|proj_Elec_Consumption"}, {"data": [111596, 115090, 116690, 117462, 105848, 99258, 74096], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@539|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@540|proj_Elec_Consumption"}, {"data": [22616.24, 22544.47, 22609.25, 22089.73, 0, 0, 15963.31], "errorFlag": [0, 0, 0, 0, 1, 1, 0], "dsItemId": "@542|proj_Elec_Consumption"}, {"data": [29810.048, 30518.91, 32144.38, 33185.92, 29953.024, 28058.75, 5468.16], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@674|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@675|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@676|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@677|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@678|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@679|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@680|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@681|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@682|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@683|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@684|proj_Elec_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [1, 1, 1, 0, 0, 0, 0], "dsItemId": "@671|proj_Elec_Consumption"}, {"data": [11583.83, 11148.58, 11421.67, 0, 5883751.3, 11078.33, 8356.67], "errorFlag": [0, 0, 0, 1, 0, 0, 0], "dsItemId": "@575|proj_Elec_Consumption"}, {"data": [30217.45, 23716.53, 38278.93, 36837.69, 36671.3, 33044.73, 17643.91], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@71|proj_Elec_Consumption"}, {"data": [30217.45, 23716.53, 38278.93, 36837.69, 36671.3, 33044.73, 17643.91], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@72|proj_Elec_Consumption"}, {"data": [], "dsItemId": "@76|proj_Elec_Consumption"}, {"data": [30217.45, 23716.53, 38278.93, 36837.69, 36671.3, 33044.73, 17643.91], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@466|proj_Elec_Consumption"}, {"data": [11583.83, 11148.58, 11421.67, 0, 5883751.3, 11078.33, 0], "errorFlag": [0, 0, 0, 1, 0, 0, 1], "dsItemId": "@293|proj_Elec_Consumption"}, {"data": [1882.8, 1136.9, 1127.2, 0, 0, 383.7, 1094.5], "errorFlag": [0, 0, 0, 1, 1, 0, 0], "dsItemId": "@491|proj_Elec_Consumption"}, {"data": [28640, 30760, 30670, 36820, 38520, 36180, 25000], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@120|proj_Elec_Consumption"}, {"data": [0, 0, 9300.6, 11352.8, 1719.8, 264.9, 6752.2], "errorFlag": [1, 1, 0, 0, 0, 0, 0], "dsItemId": "@510|proj_Elec_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [1, 1, 0, 0, 0, 0, 0], "dsItemId": "@645|proj_Water_Consumption"}, {"data": [17405, 16990, 15490, 17025, 15205, 30520, 42245], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@646|proj_Water_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [1, 1, 1, 0, 0, 0, 0], "dsItemId": "@647|proj_Water_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@528|proj_Water_Consumption"}, {"data": [], "dsItemId": "@533|proj_Water_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@539|proj_Water_Consumption"}, {"data": [], "dsItemId": "@540|proj_Water_Consumption"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@542|proj_Water_Consumption"}, {"data": [10.13, 10.22, 10.45, 10.43, 10.72, 10.77, 1.85], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@674|proj_Water_Consumption"}, {"data": [], "dsItemId": "@675|proj_Water_Consumption"}, {"data": [0, 0, 0, 28.5, 0, 0, 32.9], "errorFlag": [0, 0, 0, 0, 1, 0, 0], "dsItemId": "@293|proj_CO2_Emission"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [0, 0, 0, 1, 1, 0, 0], "dsItemId": "@491|proj_CO2_Emission"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [0, 0, 0, 0, 0, 0, 0], "dsItemId": "@120|proj_CO2_Emission"}, {"data": [0, 0, 0, 0, 0, 0, 0], "errorFlag": [1, 1, 0, 0, 0, 0, 0], "dsItemId": "@510|proj_CO2_Emission"}], "timeShaft": ["2018-01-09 00:00:00", "2018-01-10 00:00:00", "2018-01-11 00:00:00", "2018-01-12 00:00:00", "2018-01-13 00:00:00", "2018-01-14 00:00:00", "2018-01-15 00:00:00", "2018-01-16 00:00:00"]}
                        // rs[0]=rs;
                        // rs1[0]=rs1;
                        // rs2[0]=rs2;
                        $('.panelTabOne').css({ "pointer-events": "auto" })
                        SpinnerLine.stop();
                        _this.timeShaft = rs2[0].timeShaft;
                        var listArr = [];
                        var listArrBefore = [],
                            listArrMore = [],
                            listEleArr = {},
                            listUnitArr = [],
                            listUnitArrBefore = [];
                            listUnitArrMore = [];
                        if (rs[0].list.length == 0) {
                            return;
                        }
                        
                        if (rs4 && rs4[1] == 'startWorkspaceDataGenPieChart') {
                            if (rs4[0] && rs4[0].dsItemList && rs4[0].dsItemList.length > 0) {
                                rs4[0].dsItemList.forEach(item => {
                                    listUnitArr.push(item);
                                })
                            }
                        } else {
                            if (rs4 && rs4[1] && rs4[1].length > 0) {
                                rs4[0].list.forEach(item => {
                                    listUnitArr.push({
                                        data: item.data[0],
                                        dsItemId: item.dsItemId
                                    });
                                })
                            }
                        }

                        if (rs5 && rs5[0] && rs5[0].list&& rs5[0].list.length > 0) {
                            rs5[0].list.forEach(item => {
                                listUnitArrBefore.push({
                                    data: item.data,
                                    dsItemId: item.dsItemId
                                });
                            })
                        }

                        rs[0].list.forEach(item => {
                            var data = 0;
                            item.data.forEach(it => {
                                data += it;
                            })
                            listArr.push({
                                data: data,
                                dsItemId: item.dsItemId
                            });
                        });
                        //上月Start
                        rs1[0].list.forEach(item => {
                            var data = 0;
                            item.data.forEach(it => {
                                data += it;
                            })
                            listArrBefore.push({
                                data: data,
                                dsItemId: item.dsItemId
                            });
                        });
                        //上月end
                        //7天累计量
                        rs2[0].list.forEach(item => {
                            var data = 0;
                            item.data.length == 0 ? item.data = [0, 0, 0, 0, 0, 0, 0] : 1;
                            listArrMore.push({
                                data: item.data,
                                dsItemId: item.dsItemId
                            });
                        });
                        //7天累计量end

                        rs6 && rs6[0].list.forEach(item => {
                            var data = 0;
                            item.data.length == 0 ? item.data = [0, 0, 0, 0, 0, 0, 0] : 1;
                            listUnitArrMore.push({
                                data: item.data,
                                dsItemId: item.dsItemId
                            });
                        });
                        //7天累计量end


                        //初始化数据
                        dic.forEach(ii => {
                            ii.data = 0;//这个月
                            ii.dataBefore = 0;//上月
                            ii.dataMoreAll = [0, 0, 0, 0, 0, 0, 0];//最近7天一天总量
                            ii.dataMore = [];//最近7天单项目总量
                            ii.dataUnit = [];
                            ii.dataUnitBefore = [];
                        })
                        listArrMore.forEach((list, i) => {
                            var pts = list.dsItemId.split('|')[1]; //点名
                            var pid = list.dsItemId.split('|')[0].split('@')[1]; //项目ID
                            //所有点名对应的单位和名字
                            sortnameArr.forEach(sn => {
                                if (Number(pid) == Number(sn.id)) {
                                    if (pts == sn.pointName) {
                                        for (var i = 0; i <= dic.length - 1; i++) {
                                            if (dic[i].ptKey == sn.name) {
                                                dic[i].unit = sn.unit;
                                                var value=0;
                                                for (var j = 0; j <= 6; j++) {
                                                    value += list.data[j];
                                                    j==6?dic[i].dataMore.push({id:pid,data:value}):'';
                                                    dic[i].dataMoreAll[j] += list.data[j];
                                                }
                                            }
                                        }
                                    }
                                }
                            })

                        })

                        listUnitArrMore.forEach((list, i) => {
                            var pts = list.dsItemId.split('|')[1]; //点名
                            var pid = list.dsItemId.split('|')[0].split('@')[1]; //项目ID
                            //所有点名对应的单位和名字
                            sortnameArr.forEach(sn => {
                                if (Number(pid) == Number(sn.id)) {
                                    if (pts == sn.pointName) {
                                        for (var i = 0; i <= dic.length - 1; i++) {
                                            if (dic[i].ptKey == sn.name) {
                                                dic[i].unit = sn.unit;
                                                var value=0;
                                                for (var j = 0; j <= 6; j++) {
                                                    value += list.data[j];
                                                    j==6?dic[i].dataMore.push({id:pid,data:value}):'';
                                                    dic[i].dataMoreAll[j] += list.data[j];
                                                }
                                            }
                                        }
                                    }
                                }
                            })

                        })

                        listArrBefore.forEach((list, i) => {
                            var pts = list.dsItemId.split('|')[1]; //点名
                            var pid = list.dsItemId.split('|')[0].split('@')[1]; //项目ID
                            //所有点名对应的单位和名字
                            sortnameArr.forEach(sn => {
                                if (Number(pid) == Number(sn.id)) {
                                    if (pts == sn.pointName) {
                                        for (var i = 0; i <= dic.length - 1; i++) {
                                            if (dic[i].ptKey == sn.name) {
                                                dic[i].unit = sn.unit;
                                                dic[i].dataBefore == undefined ? dic[i].dataBefore = 0 : 1;
                                                dic[i].dataBefore += Number(list.data);
                                            }
                                        }
                                    }
                                }
                            })
                        })

                        listUnitArr.forEach((list)=>{
                            var pts = list.dsItemId.split('|')[1]; //点名
                            var pid = list.dsItemId.split('|')[0].split('@')[1]; //项目ID
                            //所有点名对应的单位和名字
                            sortnameArr.forEach(sn => {
                                if (Number(pid) == Number(sn.id)) {
                                    if (pts == sn.pointName) {
                                        for (var i = 0; i <= dic.length - 1; i++) {
                                            if (dic[i].ptKey == sn.name) {
                                                dic[i].unit = sn.unit;
                                                if(!dic[i].dataUnit){
                                                    dic[i].dataUnit = [{data:list.data,id:pid}]
                                                }else {
                                                    dic[i].dataUnit.push({data:list.data,id:pid})
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                        })
                        listUnitArrBefore.forEach((list)=>{
                            var pts = list.dsItemId.split('|')[1]; //点名
                            var pid = list.dsItemId.split('|')[0].split('@')[1]; //项目ID
                            //所有点名对应的单位和名字
                            sortnameArr.forEach(sn => {
                                if (Number(pid) == Number(sn.id)) {
                                    if (pts == sn.pointName) {
                                        for (var i = 0; i <= dic.length - 1; i++) {
                                            if (dic[i].ptKey == sn.name) {
                                                dic[i].unit = sn.unit;
                                                if(!dic[i].dataUnitBefore){
                                                    dic[i].dataUnitBefore = [{data:list.data[0]?list.data[0]:0,id:pid}]
                                                }else {
                                                    dic[i].dataUnitBefore.push({data:list.data[0]?list.data[0]:0,id:pid})
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                        })
                        listArr.forEach((list, i) => {
                            var pts = list.dsItemId.split('|')[1]; //点名
                            var pid = list.dsItemId.split('|')[0].split('@')[1]; //项目ID
                            //所有点名对应的单位和名字
                            sortnameArr.forEach(sn => {
                                if (Number(pid) == Number(sn.id)) {
                                    if (pts == sn.pointName) {
                                        for (var i = 0; i <= dic.length - 1; i++) {
                                            if (dic[i].ptKey == sn.name) {
                                                dic[i].unit = sn.unit;
                                                dic[i].data == undefined ? dic[i].data = 0 : 1;
                                                dic[i].data += Number(list.data);
                                                pts == 'proj_Elec_Consumption' ? listEleArr[pid] = parseInt(list.data) + sn.unit : '';
                                            }
                                        }
                                    }
                                }
                            })
                            if (i == listArr.length - 1) {
                                $('.chartMain').empty();
                                dic.filter(item=>{return item.group == isAll}).forEach((rcs, k) => {
                                    _this.createNewDom(rcs, k, isAll, rs2[0].timeShaft)
                                })
                                I18n.fillArea($('.panelCtn'));
                                // AppConfig.projectList.forEach(item=>{
                                //     listEleArr[item.id]?item.power=listEleArr[item.id]:'';
                                // });//存当前电量;
                                // var $projectPowerWindow =$('#ctnGroupProjectOverview .chartMap').find('.projectPowerWindow')
                                // if($projectPowerWindow.length){
                                //     var $mapProjectIdSpan=$projectPowerWindow.find('span').eq(1);
                                //     var mapProjectId=$mapProjectIdSpan.attr('powerid');
                                //     if(mapProjectId&&listEleArr[mapProjectId]){
                                //         $mapProjectIdSpan.text(listEleArr[mapProjectId])
                                //     }
                                // }
                            }
                        })
                    })//end



                    // function createNewDom(item, i, isAll, timeShaft) {
                    //     //遍历项目加上项目名
                    //     AppConfig.groupProjectCurrent.projectList.forEach(items=>{
                    //         for(var index=0,len=item.dataMore.length;index<=len-1;index++){
                    //             if(items.id==item.dataMore[index].id){
                    //                 item.dataMore[index].name=AppConfig.language=='zh'?items.name_cn:items.name_english;
                    //             }
                    //         }
                    //     })
                    //     var numAll = Number(_this.option.valid);
                    //     var num = 7;//天数
                    //     var name = getI18n(item.name);
                    //     var per = parseInt((Number(item.data) - Number(item.dataBefore)) / Number(item.data) * 100);
                    //     var dataMoreArr = [];
                    //     var dataMoreAllArr = [];
                    //     var showData = 0;
                    //     showData = isAll != 1 ? item.data / num : item.data;
                    //     for (var j = 0; j <= item.dataMore.length - 1; j++) {
                    //         dataMoreArr.push({data:parseInt(item.dataMore[j].data / num),id:item.dataMore[j].id,name:item.dataMore[j].name});
                    //     }
                    //     for (var j = 0; j <= item.dataMoreAll.length - 1; j++) {
                    //         dataMoreAllArr.push(item.dataMoreAll[j] / numAll)
                    //     }
                    //     isNaN(per) ? per = 0 : 0;
                    //     per > 0 ? per = '+' + per + '%' : per = per + '%';
                    //     var doms = ``;
                    //     doms = `<div class="chartMainOne ${i%2!=0?'':'chartMainOneAfter'}">
                    //                 <div class="chartMainleft">
                    //                     <div class="chartMainLeftCenter">
                    //                     <div class="chartMainLeftLineOne"><div class="chartMainLeftOneIcon" style="color:rgb(${name.color});background:rgba(${name.color},0.15)"><span class="iconfont  ${name.icon} iconTotal"></span></div></div>
                    //                     <div class="chartMainLeftLineTwo"><span>${parseInt(showData).toLocaleString()}</span> <span class="energyUnit">${item.unit}</span></div>
                    //                     <div class="chartMainLeftLineThree"><span class="" i18n="${name.i18n}"></span><span class="chartMainLeftLineThreeNum" style="color:${(Number(item.data)-Number(item.dataBefore))>0?'#fb6565':'#76df48'};">${per}</span><span class="chartMainLeftLineThreeIcon iconfont icon-xiajiang" style="display: inline-block;color:${(Number(item.data)-Number(item.dataBefore))>0?'#fb6565':'#76df48'}; ${(Number(item.data)-Number(item.dataBefore))>0?'transform: rotate(180deg);':'transform: rotate(0deg);'}"></span></div>
                    //                     </div>
                    //                 </div>
                    //                 <div class="chartMainRight chartMainRight${i}"></div>
                    //                 <div class="chartMainRightLine chartMainRightLine${i}"></div>
                                    
                    //             </div>`
                    //     $('.chartMain').append(doms);
                    //     I18n.fillArea($('.panelCtn'));
                    //     _this.renderLineChart($('.chartMainRight' + i)[0], i, timeShaft, isAll != 1 ? dataMoreArr : item.dataMore,isAll != 1 ? dataMoreAllArr : item.dataMoreAll);
                    //     _this.renderEchart($('.chartMainRightLine' + i)[0], i, timeShaft, isAll != 1 ? dataMoreArr : item.dataMore,isAll != 1 ? dataMoreAllArr : item.dataMoreAll);

                    // }

                }

             
                function getI18n(index) {
                    var all = {};
                    switch (index) {
                        case '用电量':
                            all = {
                                i18n: 'platform_app.group.ENERGY',
                                icon: 'icon-dian3',
                                color: '244,182,83'
                            }
                            return all
                        case '用水量':
                            all = {
                                i18n: 'platform_app.group.WATER',
                                icon: 'icon-shui2',
                                color: '87,178,245'
                            }
                            return all
                        case '用气量':
                            all = {
                                i18n: 'platform_app.group.GAS',
                                icon: 'icon-mei',
                                color: '170,170,255'
                            }
                            return all
                        case '碳排放':
                            all = {
                                i18n: 'platform_app.group.CARBON',
                                icon: 'icon-jitan',
                                color: '153,223,145'
                            }
                            return all
                        default:
                            return
                    }
                }
                $('#queryAnlysisTimIpt').off('change').on('change', (e) => {
                    var sortnameArr = nameArr;
                    //过滤相同的名字 只要一样的一组
                    _this.option.item.forEach(itema => {
                        itema.data = 0;
                    })
                    var dic = _this.option.item;
                    var currentTime = $(e.currentTarget).val();
                    var currentMonth = currentTime.split('-')[1];

                    SpinnerLine.spin($('.chartAQIa')[0]);
                    // SpinnerLine.spin($('.chartAQIa')[0]);
                    var _thisType = Number($('.panelTabOne.activedTab').attr('data-typeId'));
                    $('.panelTabOne').css({ "pointer-events": "none" })
                    getData(sortnameArr, pointData, dic, _thisType);
                });
                $(window).off('resize').on('resize', function() {
                    //echarts重绘
                    $('[_echarts_instance_]').each(function(i, dom) {
                        var img = echarts.getInstanceById(dom.getAttribute('_echarts_instance_')).resize()
                    });

                })
            },
            //切换月累计、单项目时用的echart //柱图
            this.renderLineChart = function(classCt, i, timeShaft, data,dataAll) {
                if (timeShaft.length == 8) {
                    timeShaft.pop();
                }
                var timeShaftArr=[];
                timeShaft.map(item=>{
                    timeShaftArr.push(item.split(' ')[0].split('-')[1]+'-'+item.split(' ')[0].split('-')[2]);
                })
                let name=[];
                let dataArr=[];
                let seriesArr=[];
                let bigData=0;
                let bigDataArr=[];
                if(data.length>13){
                    data.sort((a,b)=>{
                        return Number(a.data)>Number(b.data)?-1:Number(a.data)<Number(b.data)?1:0;
                    });
                    data.splice(13);//超过13个降序显示
                }
                data.forEach(item=>{
                    name.push(item.name);
                    dataArr.push(parseInt(item.data));
                })
                dataArr.forEach((item)=>{bigData-item<0?bigData=item:'';});
                bigData==0?bigData=1:1;
                dataArr.forEach((item)=>{
                    bigDataArr.push(bigData)
                });
                var colorArr = [
                    ['#f4b653', '#f3df5e'],
                    ['#65f2fb', '#75b4fd'],
                    ['#66ccff', '#aaaaff'],
                    ['#fc84d3', '#d581fc']
                ];
                var colorLineArr=['221,163,70,0.36', '70,118,174,0.36', '84,84,181,0.36', '175,88,231,0.36'];
                var colorAreaArr = ['244,182,83', '117,180,253', '102,204,255', '213,129,252'] //rgba
                //柱图
                var realBar={
                    name: '',
                    type: 'bar',
                    z:5,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 1,
                                color: 'rgba(' + colorAreaArr[i] + ', 0.0)'
                            }, {
                                offset: 0,
                                color: 'rgba(' + colorAreaArr[i] + ', 0.5)'
                            }])
                        },
                    },
                    data: dataArr
                }
                //背景柱图
                var backBar={
                    name: '',
                    type: 'bar',
                    barGap:'-100%',
                    lineStyle: {
                        normal: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: colorArr[i][0]
                                }, {
                                    offset: 1,
                                    color: colorArr[i][0]
                                }])
                            },
                            width: 4,
                            shadowColor: 'rgba(175, 88, 231, 0.36)',
                            shadowBlur: 4,
                            shadowOffsetY: 2,
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(' + colorAreaArr[i] + ', 0.5)'
                            }, {
                                offset: 1,
                                color: 'rgba(' + colorAreaArr[i] + ', 0)'
                            }], false),
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 1,
                                color: 'rgba(' + colorAreaArr[i] + ', 0.1)'
                            }, {
                                offset: 0,
                                color: 'rgba(' + colorAreaArr[i] + ', 0)'
                            }])
                        },
                        emphasis: {
                            borderWidth: 0
                        }
                    },
                    z:2,
                    data: bigDataArr
                }
                if(dataArr.length==1){
                    realBar.barWidth='15%';
                    backBar.barWidth='15%';
                    seriesArr.push(realBar);
                    seriesArr.push(backBar);
                   
                }else if(dataArr.length==2){
                    realBar.barWidth='25%';
                    backBar.barWidth='25%';
                    seriesArr.push(realBar);
                    seriesArr.push(backBar);
                    
                }else if(dataArr.length==3){
                    realBar.barWidth='35%';
                    backBar.barWidth='35%';
                    seriesArr.push(realBar);
                    seriesArr.push(backBar);
                    
                }else if(dataArr.length==4){
                    realBar.barWidth='45%';
                    backBar.barWidth='45%';
                    seriesArr.push(realBar);
                    seriesArr.push(backBar);
                   
                }else{
                    seriesArr.push(realBar);
                    seriesArr.push(backBar);
                }
                
                $('.chartMainRight').mousemove(function(item){
                    var width=$(this).find('canvas').width();
                    sessionStorage.groupWidth=width;
                    sessionStorage.groupOffsetX=item.offsetX;
                })
                var option = {
                    backgroundColor: 'transport',
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params, ticket, callback) {
                            var per=Number(sessionStorage.groupOffsetX)/Number(sessionStorage.groupWidth);
                            var len=dataAll.length;
                            var lenArr=[];
                            var lenSort=0;
                            var lenKey=0;
                            dataAll.forEach((item,i)=>{
                                lenArr.push(i+1);
                            });
                            lenArr.forEach((item,i)=>{
                                if(i==0||(lenSort-Math.abs(item-per*len))>0){
                                    lenSort = Math.abs(item-per*len);
                                    lenKey=i;
                                }
                            })
                            var dom=`<div>${params[0].name} : ${params[0].data.toLocaleString()}</div><div>${timeShaftArr[lenKey]} : ${dataAll[lenKey].toLocaleString()}</div>`;
                            return dom;
                        }
                    },
                    legend: {
                        show: false,
                    },
                    grid: {
                        left: '10',
                        top: '10px',
                        right: 10,
                        bottom: '10px',
                    },
                    xAxis: [{
                        type: 'category',
                        show: true,
                        nameGap: 0,
                        splitLine: {
                            show: true,
                            interval: 'auto',
                            lineStyle: {
                                color: ['rgba(238,242,249,0.3)']
                            }
                        },
                        boundaryGap: true,
                        axisLabel: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        data: name,
                        zlevel:2,
                        },
            
                    ],
                    yAxis: [{
                        type: 'value',
                        show: true,
                        max:bigData,
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            interval: 'auto',
                            show: true,
                            lineStyle: {
                                color: ['rgba(238,242,249,0.3)']
                            }
                        },
                        axisLine: {
                            show: false,

                        },
                        axisLabel: {
                            margin: 10,
                            show: false,
                            textStyle: {
                                fontSize: 14
                                 }
                            },
                        },
                    ],
                    series: seriesArr
                };
                var chart = echarts.init(classCt); //,this.opt.chartTheme
                chart.setOption(option);
            },
            //折线图
            this.renderEchart = function(classCt, i, timeShaft, data,dataAll){
                if (timeShaft.length == 8) {
                    timeShaft.pop();
                }
                let name=[];
                let dataArr=[];
                let seriesArr=[];
                let bigData=0;
                let bigDataArr=[];
                data.forEach(item=>{
                    name.push(item.name);
                    dataArr.push(parseInt(item.data));
                })
                dataArr.forEach((item)=>{
                    bigData-item<0?bigData=item:'';
                        
                });
                // if(i==2){
                //     dataArr=[1000,2000,3000];
                //     name=['x','xx','xxx'];
                //     bigData=3000;
                //     dataAll=[500,600,400,650,410,900,460]
                // }
                dataArr.forEach((item)=>{
                    bigDataArr.push(bigData)
                });
                var colorArr = [
                    ['#f4b653', '#f3df5e'],
                    ['#65f2fb', '#75b4fd'],
                    ['#66ccff', '#aaaaff'],
                    ['#fc84d3', '#d581fc']
                ];
                var colorLineArr=['221,163,70,0.36', '70,118,174,0.36', '84,84,181,0.36', '175,88,231,0.36'];
                var colorAreaArr = ['244,182,83', '117,180,253', '102,204,255', '213,129,252'] //rgba
                var colorAreaArrs = [];
                //折线
                seriesArr.push( {
                    name: '',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    symbolSize: 5,
                    z:6,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: colorArr[i][0]
                                }, {
                                    offset: 1,
                                    color: colorArr[i][1]
                                }])
                            },
                            width: 4,
                            shadowColor: 'rgba('+colorLineArr[i]+')',//'rgba(175, 88, 231, 0.36)',
                            shadowBlur: 6,
                            shadowOffsetY: 4,
                        }
                    },
                  
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: colorArr[i][0]
                            }, {
                                offset: 1,
                                color: colorArr[i][1]
                            }])
                        },
                        emphasis: {
                            borderWidth: 0
                        }
                    },
                    data: dataAll
                })
               
                var option = {
                    backgroundColor: 'transport',
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        show: false,
                    },
                    grid: {
                        left: 0,
                        top: '10px',
                        right: 0,
                        bottom: '10px',
                    },
                    xAxis: [{
                        type: 'category',
                        show: true,
                        nameGap: 0,
                        splitLine: {
                            show: false,
                            interval: 'auto',
                            lineStyle: {
                                color: ['rgba(238,242,249,0.3)']
                            }
                        },
                        boundaryGap: false,
                        axisLabel: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        data: timeShaft,
                        zlevel:2,
                        }
                    ],
                    yAxis: [{
                        type: 'value',
                        show: true,
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            interval: 'auto',
                            show: false,
                            lineStyle: {
                                color: ['rgba(238,242,249,0.3)']
                            }
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            margin: 10,
                            show: false,
                            textStyle: {
                                fontSize: 14
                                 }
                            },
                        }
                    ],
                    series: seriesArr

                };
                var chart = echarts.init(classCt); //,this.opt.chartTheme
                chart.on('click', function (params) {
                    console.log(params)
                });
                
                chart.setOption(option);
                
                
            }
            //切换月累计、单项目时用的dom
            this.createNewDom = function(item, i, isAll, timeShaft) {
                 //遍历项目加上项目名
                 AppConfig.groupProjectCurrent.projectList.forEach(items=>{
                    for(var index=0,len=item.dataMore.length;index<=len-1;index++){
                        if(item.real){
                            if(items.id==item.dataUnit[index].id){
                                item.dataUnit[index].name=AppConfig.language=='zh'?items.name_cn:items.name_english;
                                item.dataUnit[index].area = !isNaN(parseInt(items.area))?parseInt(items.area):0;
                            }
                            if(items.id==item.dataUnitBefore[index].id){
                                item.dataUnitBefore[index].name=AppConfig.language=='zh'?items.name_cn:items.name_english;
                                item.dataUnitBefore[index].area = !isNaN(parseInt(items.area))?parseInt(items.area):0;
                            }
                        }
                        if(items.id==item.dataMore[index].id){
                            item.dataMore[index].name=AppConfig.language=='zh'?items.name_cn:items.name_english;
                            item.dataMore[index].area = !isNaN(parseInt(items.area))?parseInt(items.area):0;
                        }
                        
                    }
                })
                var _this = this;
                var numAll = Number(_this.option.valid);
                var num = 7;//天数
                var name = _this.getI18n(item.name);
                var per = parseInt((Number(item.data) - Number(item.dataBefore)) / Number(item.data) * 100);
                var dataMoreArr = [];
                var dataMoreAllArr = [];
                // showData = isAll != 1 ? item.data / num : item.data;
                var showData = 0;
                var per = 0;
                if(isAll != 1){
                    var totalData = 0;
                    var totalArea = 0;
                    var dataNow = 0;
                    item.dataUnit.forEach((item)=>{
                        if(item.area&& !isNaN(parseFloat(item.data))){
                            totalData += item.data * item.area;
                            totalArea += item.area;
                        }
                    })
                    if(totalArea != 0)dataNow = totalData / totalArea;
                    showData = dataNow;

                    var totalDataBefore = 0;
                    var totalAreaBefore = 0;
                    var dataBefore = 0;
                    item.dataUnitBefore.forEach((item)=>{
                        if(item.area && !isNaN(parseFloat(item.data))){
                            totalDataBefore += item.data * item.area;
                            totalAreaBefore += item.area;
                        }
                    })
                    if(totalAreaBefore != 0)dataBefore = totalDataBefore / totalAreaBefore;

                    var per = parseInt((Number(dataNow) - Number(dataBefore)) / Number(dataNow) * 100);
                }else{
                    showData = item.data;
                    var per = parseInt((Number(item.data) - Number(item.dataBefore)) / Number(item.data) * 100);
                }
                for (var j = 0; j <= item.dataMore.length - 1; j++) {
                    dataMoreArr.push({data:parseInt(item.dataMore[j].data / num),id:item.dataMore[j].id,name:item.dataMore[j].name});
                }
                for (var j = 0; j <= item.dataMoreAll.length - 1; j++) {
                    dataMoreAllArr.push(item.dataMoreAll[j] / numAll)
                }
                isNaN(per) ? per = 0 : 0;
                per > 0 ? per = '+' + per + '%' : per = per + '%';
                if(Math.abs(showData) < 1){
                    showData = parseFloat(showData.toFixed(5))
                }else{
                    showData = parseInt(showData);
                }
                var doms = ``;
                doms = `<div class="chartMainOne ${i%2!=0?'':'chartMainOneAfter'}">
                            <div class="chartMainleft">
                                <div class="chartMainLeftCenter">
                                <div class="chartMainLeftLineOne"><div class="chartMainLeftOneIcon" style="color:rgb(${name.color});background:rgba(${name.color},0.15)"><span class="iconfont  ${name.icon} iconTotal"></span></div></div>
                                <div class="chartMainLeftLineTwo"><span>${showData.toLocaleString()}</span> <span class="energyUnit">${item.unit?item.unit:''}</span></div>
                                <div class="chartMainLeftLineThree"><span class="" i18n="${name.i18n}"></span><span class="chartMainLeftLineThreeNum" style="color:${(Number(item.data)-Number(item.dataBefore))>0?'#fb6565':'#76df48'};">${per}</span><span class="chartMainLeftLineThreeIcon iconfont icon-xiajiang" style="display: inline-block;color:${(Number(item.data)-Number(item.dataBefore))>0?'#fb6565':'#76df48'}; ${(Number(item.data)-Number(item.dataBefore))>0?'transform: rotate(180deg);':'transform: rotate(0deg);'}"></span></div>
                                </div>
                            </div>
                            <div class="chartMainRight chartMainRight${i}"></div>
                            <div class="chartMainRightLine chartMainRightLine${i}"></div>
                        </div>`
                $('.chartMain').append(doms);
                I18n.fillArea($('.panelCtn'));
                _this.renderLineChart($('.chartMainRight' + i)[0], i, timeShaft, isAll != 1 ? dataMoreArr : item.dataMore,isAll != 1 ? dataMoreAllArr : item.dataMoreAll);
                _this.renderEchart($('.chartMainRightLine' + i)[0], i, timeShaft, isAll != 1 ? dataMoreArr : item.dataMore,isAll != 1 ? dataMoreAllArr : item.dataMoreAll);
            },
            //切换月累计、单项目时用的i18n
            this.getI18n = function(index) {
                var all = {};
                switch (index) {
                    case '用电量':
                    case '单方用电量':
                        all = {
                            i18n: 'platform_app.group.ENERGY',
                            icon: 'icon-dian3',
                            color: '244,182,83'
                        }
                        return all
                    case '用水量':
                    case '单方用水量':
                        all = {
                            i18n: 'platform_app.group.WATER',
                            icon: 'icon-shui2',
                            color: '87,178,245'
                        }
                        return all
                    case '用气量':
                    case '单方用气量':
                        all = {
                            i18n: 'platform_app.group.GAS',
                            icon: 'icon-mei',
                            color: '170,170,255'
                        }
                        return all
                    case '碳排放':
                    case '单方碳排放':
                        all = {
                            i18n: 'platform_app.group.CARBON',
                            icon: 'icon-jitan',
                            color: '153,223,145'
                        }
                        return all
                    default:
                        return
                }
            },
            this.update = function() {},
            this.destory = function() {}
    }.call(Anlysis.prototype)
    exports.analysis = Anlysis
}(GroupProjectOverview, GroupProjectOverview.base))

;
(function(exports, base) {
    function Radar(container, option) {
        base.apply(this, arguments)
    }
    Radar.prototype = Object.create(base.prototype); +
    function() {
        this.setting = {
                height: 4,
                width: 3
            },
            this.viewer = '<div class="panelCtn panelContainerNoPadding"> <div class="panelContainer"><div class="topCtn" ><div class="title" > <span class="showTitleLine" i18n="platform_app.group.HEALTH">设备健康率</span> <div class="statisTime" style="display:flex"><input type="text" id="queryHealthTimIpt" class="form-control" readonly/></div></div></div><div class="chartCtn chartAQI" style="position:relative;height:calc(100% - 40px);width:100%;"></div></div></div>',
            this.render = function() {
                I18n.fillArea($('.panelContainer'));
                $('#queryHealthTimIpt').val(toDate().format('yyyy-MM')).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm',
                    autoclose: true,
                    minView: 3,
                    startView: 3,
                    endDate: toDate().format('yyyy-MM')
                });

                var _this = this;
                var pointData = [];
                var arrPromise = [];
                var nameArr = [];
                var SpinnerLineA = new LoadingSpinner({
                    color: '#00FFFF'
                });
                SpinnerLineA.spin($('.chartAQI')[0]);
                var pointList = AppConfig.groupProjectCurrent.projectList.map(function(ele) {
                    return '@' + ele.id + '|proj_IndInfoStatis'
                });
                var pointArr = [];
                this.option.item.forEach(item => {
                    pointArr.push(item.ptKey)
                });
                // _this.getPoint(pointList).done(function (result) {
                var result = this.screen.pointList;
                var rsData = '';
                pointArr.forEach(item => {
                    for (var i = 0; i < result.dsItemList.length; i++) {
                        if (result.dsItemList[i].data == 'Null') {
                            rsData = 'Null';
                            // SpinnerLineA.stop();
                            // return
                            continue
                        }
                        var value = JSON.parse(result.dsItemList[i].data)
                        if(!value[item])continue;
                        nameArr.push({
                            name: item,
                            nameZh: value[item].name,
                            pointName: value[item].point,
                            id: result.dsItemList[i].dsItemId.split('|')[0].split('@')[1],
                            unit: value[item].unit
                        })
                        var idd = result.dsItemList[i].dsItemId.split('|')[0]
                        pointData.push(idd + '|' + value[item].point);
                    }

                })
                if (rsData == 'Null') {
                    if (nameArr.length == 0) {
                        $('.chartAQI').html('<p class="text-muted" i18n="platform_app.group.WARN">没有配置点名!</p>')
                        I18n.fillArea($('.chartAQI'));
                        SpinnerLineA.stop();
                        return;
                    }
                }
                var sortnameArr = nameArr;
                var dic = _this.option.item;
                _this.option.valid = Number(Number(nameArr.length) / Number(_this.option.item.length)).toFixed(0)
                getData(sortnameArr, pointData, dic)


                function getData(sortnameArr, pointData, dic) {
                    var queryAnlysisTimIpt = $('#queryHealthTimIpt').val()

                    _this.getDataUrl(pointData, queryAnlysisTimIpt).done(function(result, round) {
                        var listArr = [];

                        if (round == 'startWorkspaceDataGenPieChart') {
                            if (result.dsItemList.length == 0) {
                                return;
                            }
                            result.dsItemList.forEach(item => {
                                var data = 0;
                                item.data == 'Null' ? item.data = 0 : 1
                                data = item.data;
                                listArr.push({
                                    data: data,
                                    dsItemId: item.dsItemId
                                });
                            })
                        } else {
                            if (result.list.length == 0) {
                                return;
                            }
                            result.list.forEach(item => {
                                var data = 0;
                                item.data.forEach(it => {
                                    data += it;
                                })
                                listArr.push({
                                    data: data,
                                    dsItemId: item.dsItemId
                                });
                            })
                        }
                        dic.forEach(ii => {
                            ii.data = 0;
                        })
                        listArr.forEach((list, i) => {
                            var pts = list.dsItemId.split('|')[1]; //点名
                            var pid = list.dsItemId.split('|')[0].split('@')[1]; //项目ID
                            //所有点名对应的单位和名字
                            sortnameArr.forEach(sn => {
                                if (Number(pid) == Number(sn.id)) {
                                    if (pts == sn.pointName) {
                                        for (var i = 0; i <= dic.length - 1; i++) {
                                            if (dic[i].ptKey == sn.name) {
                                                dic[i].unit = sn.unit;
                                                dic[i].data == undefined ? dic[i].data = 0 : 1;
                                                dic[i].data += (isNaN(Number(list.data))?0:Number(list.data));
                                            }
                                        }
                                    }
                                }
                            })
                            if (i == listArr.length - 1) {
                                $('.chartAQI').empty();

                                renderEchart(dic);
                                I18n.fillArea($('.panelCtn'));
                            }
                        })

                    }).always(() => {
                        SpinnerLineA.stop();

                    })
                }

                function renderEchart(data) {
                    var num = Number(_this.option.valid);
                    var indicatorArr = [];
                    var dataArr = [];
                    data.forEach(itm => {
                        itm.data = (itm.data / num).toFixed(0);
                        indicatorArr.push({
                            name: itm.data + itm.unit + ' ' + i18n_resource.platform_app.group[itm.name_i18n], //i18n_resource.platform_app.group[itm.name_i18n] + ' ' + itm.data + itm.unit,
                            max: 100
                        });
                        dataArr.push(itm.data)
                    })


                    var echartsCtn = document.querySelector('.chartAQI')
                    var lineStyle = {
                        normal: {
                            width: 1,
                            opacity: 0.5
                        }
                    };
                    var option = {
                        backgroundColor: 'rgb(253,253,254)',
                        title: {
                            show: false,
                            text: 'AQI - 雷达图',
                            left: 'center',
                            textStyle: {
                                color: '#eee'
                            }
                        },
                        tooltip: {
                            formatter: function(value) {
                                var dom = ``;
                                data.forEach(it => {
                                    dom += `<span>${i18n_resource.platform_app.group[it.name_i18n]}:${it.data}${it.unit}</span><br>`
                                })
                                return dom
                            }
                        },
                        legend: {
                            show: false,
                            bottom: 5,
                            data: [''],
                            itemGap: 20,
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            },
                            selectedMode: 'single'
                        },

                        radar: {
                            nameGap: 5,
                            indicator: indicatorArr,
                            radius: '62%',
                            //shape: 'circle',
                            splitNumber: 5,
                            name: {
                                textStyle: {
                                    color: '#333'
                                },
                                formatter: function(value, indicator) {
                                    var currentValue = parseFloat(value.split(' ')[0]);
                                    var color = currentValue < 100 ? '#fb6565' : '#666666';
                                    var labelFlag = currentValue < 100 ? 'a' : 'b';
                                    var richText = [
                                        '{' + labelFlag + '|' + value.split(' ')[0] + '}',
                                        '{c|' + value.split(' ')[1] + '}'
                                    ].join('\n');
                                    return richText;
                                },
                                rich: {
                                    a: {
                                        color: '#fb6565',
                                        align: 'center',
                                        lineHeight: 18
                                    },
                                    b: {
                                        color: '#666666',
                                        align: 'center',
                                        lineHeight: 18
                                    },
                                    c: {
                                        color: '#666666'
                                    }
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(227,227,227,0.5)' //'#e3e3e3'
                                }
                            },
                            splitArea: {
                                show: true,
                                areaStyle: {
                                    color: [
                                        'rgb(245,249,250)', 'rgba(241,245,249, 0)',
                                        'rgba(241,245,249, 0)', 'rgba(241,245,249, 0)',
                                        'rgba(241,245,249, 0)', 'rgba(241,245,249, 0)'
                                    ].reverse()
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'rgba(227,227,227,0.5)' //'#e3e3e3'
                                }
                            },
                            axisLabel: {
                                formatter: function(value, index) {}
                            }

                        },
                        series: [{
                            name: '',
                            type: 'radar',
                            lineStyle: lineStyle,
                            data: [{
                                value: dataArr
                            }],
                            symbol: 'none',
                            itemStyle: {
                                normal: {
                                    width: 2,
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 1,
                                            color: '#63a7f5'
                                        }, {
                                            offset: 0,
                                            color: '#53e7f0'
                                        }],
                                        globalCoord: false
                                    }, //'#7ccff9'
                                    label: {
                                        show: false,
                                        position: ['50%', '50%'],
                                        formatter: function(p) {
                                            var data = [];
                                            data = p.data.value;
                                            var key = data.indexOf(p.value);
                                            var max = [300, 250, 300, 5, 200, 100];
                                            var now = max[key];
                                            return ((Number(p.value / now)) * 100).toFixed(1) + '%';
                                        }
                                    }
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 1,
                                            color: 'rgba(117,180,253,0.56)' //'rgba(131,199,54,0.8)'
                                        }, {
                                            offset: 0,
                                            color: 'rgba(119,247,255,0.56)' //'rgba(141,218,248,0.3)'
                                        }],
                                        globalCoord: false
                                    }
                                }
                            }
                        }]
                    };
                    $(echartsCtn).removeAttr('_echarts_instance_');
                    var echart = echarts.init(echartsCtn);
                    echart.setOption(option, true);
                    window.onresize = echart.resize;
                }
                $('#queryHealthTimIpt').off('change').on('change', (e) => {
                    var sortnameArr = nameArr;
                    _this.option.item.forEach(itema => {
                        itema.data = 0;
                    })
                    var dic = _this.option.item;
                    var currentTime = $(e.currentTarget).val();
                    var currentMonth = currentTime.split('-')[1];
                    if (!Number(currentMonth) || Number(currentMonth) > 12) {
                        alert(i18n_resource.platform_app.overview.TIME_ERROR);
                        return;
                    }
                    SpinnerLineA.spin($('.chartAQI')[0]);
                    getData(sortnameArr, pointData, dic)
                });


            },
            this.update = function() {},
            this.destory = function() {}
    }.call(Radar.prototype)
    exports.radar = Radar
}(GroupProjectOverview, GroupProjectOverview.base))

;
(function(exports, base) {
    function Map(container, option) {
        base.apply(this, arguments)
    }
    Map.prototype = Object.create(base.prototype); +
    function() {
        this.setting = {
                height: 6,
                width: 3
            },
            this.viewer = '<div class="panelCtn panelContainerMap panelContainerNoPadding"> <div class="panelContainer"><div class="topCtn" ><div class="title"><div class="statisTime" style="display:flex"><input type="text" id="queryRankTimIpt" class="form-control" readonly/></div></div></div><div class="chartCtn chartMap" id="chartMap" style="height:calc(100% - 40px);width:100%;"></div></div></div><script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=9cc89c68a4bd6f3f5f65589f85ad7685"></script>',
            this.render = function() {
                var _this = this;
                $('#queryRankTimIpt').val(toDate().format('yyyy-MM')).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm',
                    autoclose: true,
                    minView: 3,
                    startView: 3,
                    endDate: toDate().format('yyyy-MM')
                });
                var SpinnerLine = new LoadingSpinner({
                    color: '#00FFFF'
                });
                var map = new beop.getMapInstance();
                map.load();
                window.mapPlatformCallBack = function() {
                        var mapIns;
                        try {
                            if (BMap && BMap.Map) {
                                mapIns = new beop.BaiduMap();
                            }
                        } catch (e) {
                            mapIns = new beop.GoogleMap()
                        }
                        mapIns.init();
                        if (AppConfig.userId == 1) {
                            mapIns.addUpdateProjectControl();
                        }
                        mapIns.groupProjectList(AppConfig.groupProjectCurrent.projectList);
                        //mapIns.addMarkers(AppConfig.groupProjectCurrent.projectList, true);
                        mapIns.initWorkerForUpdating();
                        mapIns.setFitView();
                    }
                    //SpinnerLine.spin($('.chartMap')[0]);
                    // I18n.fillArea($('.panelCtn'));
                    //     var center = [];
                    //     var latlng = _this.screen.opt.projectGrp.projectList[0].latlng.split(',').reverse()
                    //     latlng.forEach(item => {
                    //         center.push(item)
                    //     })

                //     var proArr = []
                //     _this.screen.opt.projectGrp.projectList.forEach((item, i) => {
                //         var centerArr = [];
                //         centerArr = item.latlng.split(',').reverse().join(',');
                //         var iid = AppConfig.language == 'zh' ? item.name_cn : item.name_en;
                //         proArr.push({
                //             name: iid,
                //             pid: item.id,
                //             center: centerArr
                //         })
                //     })                   
                //$.when($.get(location.protocol + '//webapi.amap.com/maps/main?v=1.3&key=9cc89c68a4bd6f3f5f65589f85ad7685')).done(function () {
                // $.get(location.protocol + '//webapi.amap.com/maps?v=1.3&callback=mapPlatformCallBack&key=9cc89c68a4bd6f3f5f65589f85ad7685', ).always(() => {
                //     SpinnerLine.stop()
                // })
                // window.mapPlatformCallBack = function () {
                //     if (typeof AMap == 'undefined' || typeof AMap.Map == 'undefined') return;
                //     var center = [];
                //     var latlng = _this.screen.opt.projectGrp.projectList[0].latlng.split(',').reverse()
                //     latlng.forEach(item => {
                //         center.push(item)
                //     })
                //     var map = new AMap.Map('chartMap', {
                //         resizeEnable: true,
                //         zoom: 1,
                //         center: center,
                //     });
                //     var proArr = []
                //     _this.screen.opt.projectGrp.projectList.forEach((item, i) => {
                //         var centerArr = [];
                //         centerArr = item.latlng.split(',').reverse().join(',');
                //         var iid = AppConfig.language == 'zh' ? item.name_cn : item.name_en;
                //         proArr.push({
                //             name: iid,
                //             pid: item.id,
                //             center: centerArr
                //         })
                //     })


                //     for (var i = 0; i < proArr.length; i++) {
                //         var marker;
                //         var content = `<div class ='yijia' data-projectId="${i}"></div>`;
                //         marker = new AMap.Marker({
                //             content: content,
                //             position: proArr[i].center.split(','),
                //             title: proArr[i].name,
                //             map: map
                //         });

                //         var clickModal;
                //         AMap.event.addListener(marker, "click", function () {
                //             $('.yijia').off('click').on('click', function () {
                //                 var index = $(this).attr('data-projectid');
                //                 map.setCenter(proArr[index].center.split(','));
                //                 map.setZoom(15);
                //                 var info = [];
                //                 info.push(`<div class="media" data-pid="${proArr[index].pid}">${proArr[index].name}</div>`);
                //                 infoWindow = new AMap.InfoWindow({
                //                     content: info.join("<br>"),
                //                     offset: new AMap.Pixel(0, -26)
                //                 });
                //                 infoWindow.open(map, proArr[index].center.split(','));
                //                 clickModal = setTimeout(function () {
                //                     $('.amap-info-content').on('click', function () {
                //                         var SpinnerLineA = new LoadingSpinner({
                //                             color: '#00FFFF'
                //                         });
                //                         SpinnerLineA.spin($('.chartMap')[0]);
                //                         var pid = $(this).find('.media').attr('data-pid');
                //                         WebAPI.get('/get/projectDetail/' + pid).done(function (result) {
                //                             var dom = ``;
                //                             dom = `
                //                                 <div class="mapTitle">
                //                                     <span class="mapTitleTag"i18n="platform_app.group.PHOTO">项目照片</span>
                //                                     <span class="mapTitleLine"></span>
                //                                 </div>
                //                                 <div class="mapBody">
                //                                     <div class="mapImg">
                //                                     <img class="img-responsive" src="/static/images/project_img/${result.pic}" onerror="javascript:this.style.height='200px';">
                //                                     </div>
                //                                 </div>

                //                                     <div class="mapTitle">
                //                                     <span class="mapTitleTag"i18n="platform_app.group.INFO">基本信息</span>
                //                                     <span class="mapTitleLine"></span>
                //                             </div>
                //                             <div class="mapBody">
                //                                     <div class="mapRow">
                //                                         <div class="mapRowLeft"i18n="platform_app.group.NAME">项目名称：</div>
                //                                         <div class="mapRowRight">${AppConfig.language=='zh'?result.name_cn:result.name_en}</div>       
                //                                     </div>
                //                                     <div class="mapRow">
                //                                             <div class="mapRowLeft"i18n="platform_app.group.ADDRESS">地址:</div>
                //                                             <div class="mapRowRight">${result.address!=''?result.address:'-'}</div>       
                //                                     </div> 
                //                                     <div class="mapRow">
                //                                             <div class="mapRowLeft"i18n="platform_app.group.TYPE">类型：</div>
                //                                             <div class="mapRowRight">${result.type!=''?result.type:'-'}</div>       
                //                                     </div>  
                //                                     <div class="mapRow">
                //                                             <div class="mapRowLeft"i18n="platform_app.group.SYSTEM">接入系统:</div>
                //                                             <div class="mapRowRight">${result.system!=''?result.system:'-'}</div>       
                //                                     </div>  
                //                                     <div class="mapRow">
                //                                             <div class="mapRowLeft"i18n="platform_app.group.TIME">接入时间:</div>
                //                                             <div class="mapRowRight">${result.insertTime!=''?result.insertTime:'-'}</div>       
                //                                     </div>  
                //                                     <div class="mapRow">
                //                                             <div class="mapRowLeft" i18n="platform_app.group.ROW_POINT">接入点位：</div>
                //                                             <div class="mapRowRight">${result.raw_count!=''?result.raw_count:'-'}</div>       
                //                                     </div>  
                //                                     <div class="mapRow">
                //                                             <div class="mapRowLeft"i18n="platform_app.group.SOURCE">数据来源：</div>
                //                                             <div class="mapRowRight">${result.source!=''?result.source:'-'}</div>       
                //                                     </div>
                //                                     <div class="mapRow">
                //                                             <div class="mapRowLeft mapRowWarn"i18n="platform_app.group.EQUIPMENT">接入设备</div>
                //                                             <div class="mapRowRight mapRowWarn">${result.equipment_count!=''?result.equipment_count:'-'}</div>       
                //                                     </div>
                //                                     <div class="mapRow">
                //                                             <div class="mapRowLeft mapRowWarn" i18n="platform_app.group.AREA">建筑面积：</div>
                //                                             <div class="mapRowRight mapRowWarn">${result.area!=''?result.area:'-'}</div>       
                //                                     </div>       
                //                             </div>`
                //                             $('#modal_map').html(dom)
                //                             I18n.fillArea($('#modal_map'));
                //                             $('#mapModal').modal('show');
                //                             SpinnerLineA.stop();
                //                             $('#mapModal').on('hidden.bs.modal', function (e) {
                //                                 $('#modal_map').html('')
                //                             })
                //                         })

                //                         clearTimeout(clickModal);
                //                     })
                //                 }, 800)
                //             });
                //         })
                //     }
                //     $('.amap-marker-content').each(function (dom) {
                //         dom.dataset.toggle = 'tooltip';
                //         dom.dataset.placeholder = 'right';
                //     })
                // }
                // }).always(() => {
                //     SpinnerLine.stop()
                // })

            },
            this.update = function() {},
            this.destory = function() {}
    }.call(Map.prototype)
    exports.map = Map
}(GroupProjectOverview, GroupProjectOverview.base))

;
(function(exports, base) {
    function Rank(container, option) {
        base.apply(this, arguments)
    }
    Rank.prototype = Object.create(base.prototype); +
    function() {
        this.setting = {
                height: 6,
                width: 7
            },
            this.viewer = `<div class="rankBoxShadow"><div class="topCtn topCtnRank">
                            <div class="title titleRank"><span class="showTitleLine" i18n="platform_app.group.INDICATORS">重要指标</span>
                            </div>
                        </div>
                        <div class="chartCtn RankWrap">
                        
                        </div></div>`

        this.render = function() {
                // $('#queryRankTimIpt').val(toDate().format('yyyy-MM')).datetimepicker('remove').datetimepicker({
                //     format: 'yyyy-mm',
                //     autoclose: true,
                //     minView: 3,
                //     startView: 3,
                //     endDate: toDate().format('yyyy-MM')
                // });
                var _this = this;
                var pointData = [];
                var arrPromise = [];
                var nameArr = [];
                var SpinnerLineA = new LoadingSpinner({
                    color: '#00FFFF'
                });
                SpinnerLineA.spin($('.RankWrap')[0]);
                var pointList = AppConfig.groupProjectCurrent.projectList.map(function(ele) {
                    return '@' + ele.id + '|proj_IndInfoStatis'
                });
                var pointArr = [];
                _this.showNameProject =[];
                this.option.item.forEach(item => {
                        pointArr.push(item.ptKey)
                    })
                    // _this.getPoint(pointList).done(function (result) {
                var result = this.screen.pointList
                var rsData = '';
                pointArr.forEach(item => {
                    for (var i = 0; i < result.dsItemList.length; i++) {
                        if (result.dsItemList[i].data == 'Null') {
                            rsData = 'Null';
                            // SpinnerLineA.stop();
                            continue
                        }
                        var value = JSON.parse(result.dsItemList[i].data);
                        if(!value[item].point){
                            _this.showNameProject.push(result.dsItemList[i].dsItemId.split('|')[0].split('@')[1]);
                            continue
                        }
                        nameArr.push({
                            name: item,
                            nameZh: value[item].name,
                            pointName: value[item].point,
                            id: result.dsItemList[i].dsItemId.split('|')[0].split('@')[1],
                            unit: value[item].unit
                        })
                        var idd = result.dsItemList[i].dsItemId.split('|')[0]
                        pointData.push(idd + '|' + value[item].point);
                    }

                })
                if (rsData == 'Null') {
                    if (nameArr.length == 0) {
                        $('.RankWrap').html('<p class="text-muted" i18n="platform_app.group.WARN">没有配置点名!</p>')
                        I18n.fillArea($('.RankWrap'));
                        SpinnerLineA.stop();
                        return;
                    }
                }
                var sortnameArr = nameArr;
                var dic = _this.option.item;
                _this.showNameProject=_this.uniqueName(_this.showNameProject);
                getData(sortnameArr, pointData, dic)

                // })
                ///---------
                // this.screen.opt.projectGrp.projectList.forEach((items, i) => {
                //     var promise = $.Deferred();
                //     var pointArr = [];
                //     this.option.item.forEach(item => {
                //         pointArr.push(item.ptKey)
                //     })
                //     var postData = {
                //         pointList: ['proj_IndInfoStatis'],
                //         projectId: items.id,
                //         prop: {
                //             proj_IndInfoStatis: {
                //                 pointArr
                //             }
                //         },
                //         timeStart: toDate().format('yyyy-MM-dd 00:00:00'),
                //         timeEnd: toDate().format('yyyy-MM-dd 00:00:00'),
                //         timeFormat: 'd1'
                //     }
                //     WebAPI.post('/get_history_data_padded', postData).done(function (result) {
                //         if(result[0]==undefined){
                //             return;
                //         }
                //         pointArr.forEach(item => {
                //             var value = JSON.parse(result[0].history[0].value)
                //             // console.log(value[item].point);
                //             nameArr.push({
                //                 name: item,
                //                 nameZh: value[item].name,
                //                 pointName: value[item].point,
                //                 id: items.id,
                //                 unit: value[item].unit
                //             })
                //             pointData.push('@' + items.id + '|' + value[item].point);
                //         })
                //     }).always(function () {
                //         promise.resolveWith(null, [pointData, nameArr])
                //     })
                //     arrPromise.push(promise)
                // })
                // $.when.apply(this, arrPromise).done(function () {
                //     var sortnameArr = nameArr;
                //     var dic = [];
                //     dic = _this.option.item
                //     if(sortnameArr.length==0||pointData.length==0){
                //         SpinnerLineA.stop();
                //         return;
                //     }
                //     getData(sortnameArr, pointData, dic);
                // });

                function getData(sortnameArr, pointData, dic) {
                    var queryAnlysisTimIpt = $('#queryRankTimIpt').val()
                    queryAnlysisTimIpt ? queryAnlysisTimIpt : queryAnlysisTimIpt = toDate().format('yyyy-MM-01 00:00:00'); //若为初始化时间空。默认当月一号
                    _this.getDataUrl(pointData, queryAnlysisTimIpt).done(function(result, round) {
                        var listArr = [];
                        if (round == 'startWorkspaceDataGenPieChart') {
                            if (result.dsItemList.length == 0) {
                                return;
                            }
                            result.dsItemList.forEach(item => {
                                var data = 0;
                                item.data == '' ||item.data =='Null'? item.data = '-' : 1;
                                let pName=item.dsItemId.split('|')[1];
                                data = pName=='proj_Power_Factor'||pName=='proj_ChilledPlant_COP'?Number(item.data).toFixed(2):Number(item.data).toFixed(0);
                                isNaN(Number(data))?data = '--' :data=Number(data);
                                listArr.push({
                                    data: data,
                                    dsItemId: item.dsItemId
                                });
                            })
                        } else {
                            if (result.list.length == 0) {
                                SpinnerLineA.stop();
                                return;
                            }
                            
                            result.list.forEach(item => {
                                var data = 0;
                                let pName=item.dsItemId.split('|')[1];
                                data = item.data[0] == '' || item.data[0] == undefined ||item.data =='Null'? '-' : item.data[0];
                                data = pName=='proj_Power_Factor'||pName=='proj_ChilledPlant_COP'?Number(item.data).toFixed(2):Number(item.data).toFixed(0);
                                isNaN(Number(data))?data = '--' :data=Number(data);
                                listArr.push({
                                    data: data,
                                    dsItemId: item.dsItemId
                                });
                            })
                        }
                        for (var i = 0; i <= dic.length - 1; i++) {
                            dic[i].data == undefined ? dic[i].data = [] : dic[i].data = [];
                        }
                        listArr.forEach((list, i) => {
                            var pts = list.dsItemId.split('|')[1]; //点名
                            var pid = list.dsItemId.split('|')[0].split('@')[1]; //项目ID
                            //所有点名对应的单位和名字
                            sortnameArr.forEach(sn => {
                                if (Number(pid) == Number(sn.id)) {
                                    if (pts == sn.pointName) {
                                        for (var i = 0; i <= dic.length - 1; i++) {

                                            if (dic[i].ptKey == sn.name) {
                                                dic[i].unit = sn.unit;
                                                var iid = '';
                                                AppConfig.groupProjectCurrent.projectList.forEach(items => {
                                                    if (Number(items.id) == Number(pid)) {
                                                        iid = AppConfig.language == 'zh' ? items.name_cn : items.name_english
                                                    }
                                                })
                                                dic[i].data == undefined ? dic[i].data = [] : 1;
                                                if(pts==''){list.data='--'}
                                                dic[i].data.push({
                                                    value: list.data,
                                                    name: iid,
                                                    id:pid
                                                })
                                            }
                                        }
                                    }
                                }
                            })
                            if (i == listArr.length - 1) {
                                getOtherData(dic);
                                I18n.fillArea($('.panelCtn'));
                            }
                        })



                    }).always(() => {
                        SpinnerLineA.stop();

                    })
                }
                I18n.fillArea($('.topCtn'));

                function createDom(dic) {
                    var dom = ``;
                    var dicCount = 0;
                    var $ctnGroupProjectOverview = $('.ctnGroupProjectOverview');
                    dic.forEach(item => {
                        var html = ``;
                        var paddingBNoPadding = dicCount < 3 ? 'rankPanelNoPadding' : '';
                        var paddingBNoPaddingC = 'rankPanelNoPadding' + dicCount;
                        dom = `    <div class="rankPanel ${paddingBNoPadding} ${paddingBNoPaddingC}">
                                    <div class="rankPanelBox">
                                        <div class="rankPanelBoxTop">
                                            <div class="rankTopRight">
                                                <div class="rankTopRightTitle">${i18n_resource.platform_app.group[item.name_i18n]}
                                                    <span class="iconfont icon-nav_help  rankTopQuestion" data-toggle="tooltip" data-placement="right" title="${i18n_resource.platform_app.group[item.desc_i18n]}"></span>
                                                    <div class="rankIconLeft1" data-index="after" data-rank="${item.sort}"> <span class="iconfont icon-daopaixu"></span></div>
                                                </div>
                                               
                                            </div>
                                        </div>
                                        
                                        <div class="rankPanelBottom gray-scrollbar" data-sort="${item.sort}">
                                        
                                        </div>
                                    </div>
                                </div>`
                        var forLength = item.data.length > 3 ? 3 : item.data.length;
                        for (var i = 0; i < forLength; i++) {
                            var width = 100;
                            if (item.unit != '%') {
                                width = Number(item.data[0].value);
                            }
                            var num = Number(isNaN(item.data[i].value)?0:item.data[i].value) / width * 100 < 60 ? 2 : 0
                            Number(item.data[0].value) == 0 ? width = 1 : 0;
                            html += `<div class="rankLine" data-pid="${item.data[i].id}">
                                        <div class="rankLineTitle clearfix"><span class="rankTitle" title="${item.data[i].name}">${item.data[i].name}</span><span class="rankLineNum" title="${item.data[i].value+item.unit}">${item.data[i].value}${item.unit}</span></div>
                                        <div class="rankLineBox"> 
                                        <div class="progress1">
                                        <span class="progressBar linear-color-${num}" style="width: ${Number(isNaN(item.data[i].value)?0:item.data[i].value)/width*100}%"></span>
                                        </div>
                                        </div>
                                    </diV>`
                        }

                        $('.RankWrap').append(dom);
                        $('.RankWrap').find('[data-toggle="tooltip"]').tooltip();
                        $('.RankWrap').find('[data-sort|=' + item.sort + ']').empty();
                        $('.RankWrap').find('[data-sort|=' + item.sort + ']').append(html);
                        dicCount++;
                    })

                    attEvent(dic);
                    I18n.fillArea($('.RankWrap'));
                }

                function getOtherData(dic) {
                    
                    for(let j=0;j<=dic.length-1;j++){
                        var arr=[];
                        for(let k=0;k<=dic[j].data.length-1;k++){
                            arr.push(dic[j].data[k].id);
                            if(k==dic[j].data.length-1){
                                for(let h=0;h<=_this.showNameProject.length-1;h++){
                                    if(arr.indexOf(_this.showNameProject[h])==-1){
                                        var name;
                                        AppConfig.groupProjectCurrent.projectList.forEach(itema => {
                                            if (Number(itema.id) == Number(_this.showNameProject[h])) {
                                                name = AppConfig.language == 'zh' ? itema.name_cn : itema.name_english
                                            }
                                        })
                                        dic[j].data.push({id:_this.showNameProject[h],value:'--',name:name})
                                    }
                                }
                            }
                            
                        }
                    }//未配置点名但有其他点有配置，补数据--
                   
                    dic.forEach(item => {
                        var data = {};
                        var raw=[];
                        var block=[];
                        data = getIcon(item.ptKey);
                        item.icon = data.icon;
                        item.color = data.color;
                        item.sort = item.ptKey.split('.')[0];
                        item.data.forEach(items=>{
                            isNaN(items.value)?block.push(items):raw.push(items);
                        })
                        raw.sort(function(a, b) {
                            return a.value>b.value?-1:a.value<b.value?1:0
                        });
                        item.data=raw.concat(block);
                       
                    })
                    createDom(dic);
                }

                function getIcon(index) {
                    var all = {};
                    switch (index) {
                        case 'Overcool_Rate':
                            all = {
                                icon: 'icon-leng',
                                color: '#89E3FE,#66A6FF'
                            }
                            return all
                        case 'Overheat_Rate':
                            all = {
                                icon: 'icon-taiyang',
                                color: '#F7CE68,#EE905C'
                            }
                            return all
                        case 'Equipment_Health_Rate':
                            all = {
                                icon: 'icon-jiankang',
                                color: '#9BEE3D,#85C839'
                            }
                            return all
                        case 'ChilledPlant_COP':
                            all = {
                                icon: 'icon-kongtiaolengyuanCOP',
                                color: '#4FF5E0,#00CBDE'
                            }
                            return all
                        case 'Power_Factor':
                            all = {
                                icon: 'icon-gongshuaiyinshu',
                                color: '#6FC2FF,#4C8AE3'
                            }
                            return all
                        case 'PM2.5_Overproof_Number':
                            all = {
                                icon: 'icon-PM',
                                color: '#A29AFF,#4E72D4'
                            }
                            return all
                        default:
                            return
                    }
                }

                function attEvent(dic) {
                    $('.rankIconLeft1').off('click').on('click', function() {
                        var rank = $(this).attr('data-rank');
                        var index = $(this).attr('data-index');
                        var item = {}
                        dic.forEach(items => {
                            if (rank == items.sort) {
                                item = items
                            }
                        })
                        if (index == "before") {
                            var html = '';
                            var forLength, newItemData;
                            if (item.data.length > 3) {
                                forLength = 3;
                                newItemData = item.data.slice(0, 3);
                            } else {
                                forLength = item.data.length;
                                newItemData = item.data;
                            }
                            newItemData.sort(function(a, b) { return b.value - a.value });
                            for (var i = 0; i < forLength; i++) {
                                var width = 100;
                                if (item.unit != '%') {
                                    width = Number(item.data[0].value);
                                }
                                var num = Number(isNaN(newItemData[i].value)?0:newItemData[i].value) / width * 100 < 60 ? 2 : 0
                                html += `<div class="rankLine" data-pid="${item.data[i].id}">
                                    <div class="rankLineTitle clearfix"><span class="rankTitle" title="${newItemData[i].name}">${newItemData[i].name}</span><span class="rankLineNum" title="${isNaN(newItemData[i].value)?0:newItemData[i].value+item.unit}">${isNaN(newItemData[i].value)?'--':newItemData[i].value}${item.unit}</span></div>
                                    <div class="rankLineBox"> 
                                    <div class="progress1">
                                    <span class="progressBar linear-color-${num}" style="width: ${Number(isNaN(newItemData[i].value)?0:newItemData[i].value)/width*100}%"></span>
                                    </div>
                                    </div>
                                    </diV>`
                            }
                            $(this).attr('data-index', 'after')
                            $(this).find('span').removeClass('icon-zhengxu');
                            $(this).find('span').addClass('icon-daopaixu');
                            $(this).parent().parent().parent().parent().find('.rankPanelBottom').find('.rankLine').remove();
                            $(this).parent().parent().parent().parent().find('.rankPanelBottom').append(html)
                            // $(this).parent().parent().parent().parent().find('.rankPanelBottomNav').find('.rankNav').removeClass('rankActive');
                            // $(this).parent().parent().parent().parent().find('.rankPanelBottomNav').find('[data-index|=' + index + ']').addClass('rankActive');
                        } else {
                            var html = '';
                            var forLength; newItemData=[];
                            if (item.data.length > 3) {
                                forLength = 3;
                                for(let l=item.data.length-1;l>=item.data.length-4;l--){
                                    newItemData.push(item.data[l])
                                }
                            } else {
                                forLength = item.data.length;
                                for(let l=item.data.length-1;l>=0;l--){
                                    newItemData.push(item.data[l])
                                }
                            }
                            // newItemData.sort(function(a, b) {
                            //     if (isNaN(a.value)) {return -1;} 
                            //          else if (isNaN(b.value) ) {return 1;} 
                            //              else {
                            //                 return a.value >b.value? -1: a.value <b.value ? 1 : 0;}
                            //   });                            
                              for (var k = 0; k < forLength; k++) {
                                var width = 100;
                                if (item.unit != '%') {
                                    width = Number(item.data[0].value);
                                }
                                var num = Number(isNaN(newItemData[k].value)?0:newItemData[k].value) / width * 100 < 60 ? 2 : 0
                                html += `<div class="rankLine">
                                        <div class="rankLineTitle clearfix"><span class="rankTitle" title="${newItemData[k].name}">${newItemData[k].name}</span><span class="rankLineNum" title="${isNaN(newItemData[k].value)?0:newItemData[k].value+item.unit}">${isNaN(newItemData[k].value)?'--':newItemData[k].value}${item.unit}</span></div>
                                        <div class="rankLineBox"> 
                                        <div class="progress1">
                                        <span class="progressBar linear-color-${num}" style="width: ${Number(isNaN(newItemData[k].value)?0:newItemData[k].value)/width*100}%"></span>
                                        </div>
                                        </div>
                                        </diV>`
                            }
                            $(this).attr('data-index', 'before')
                            $(this).find('span').removeClass('icon-daopaixu');
                            $(this).find('span').addClass('icon-zhengxu');
                            $(this).parent().parent().parent().parent().find('.rankPanelBottom').find('.rankLine').remove();
                            $(this).parent().parent().parent().parent().find('.rankPanelBottom').append(html);
                            // $(this).parent().parent().parent().parent().find('.rankPanelBottomNav').find('.rankNav').removeClass('rankActive');
                            // $(this).parent().parent().parent().parent().find('.rankPanelBottomNav').find('[data-index|=' + index + ']').addClass('rankActive');
                        }
                    })
                   
                    $('#queryRankTimIpt').off('change').on('change', (e) => {
                        var sortnameArr = nameArr;
                        _this.option.item.forEach(itema => {
                            itema.data = [];
                        })
                        var dic = _this.option.item;
                        $('.RankWrap').empty();
                        SpinnerLineA.spin($('.RankWrap')[0]);
                        getData(sortnameArr, pointData, dic)
                    });
                }





            },
            this.uniqueName = function(array){
                var r = []; 
                for(var i = 0, l = array.length; i < l; i++) { 
                    for(var j = i + 1; j < l; j++) 
                        if (array[i] === array[j]) j = ++i; 
                        r.push(array[i]); 
                    } 
                return r; 
            },
            this.update = function() {},
            this.destory = function() {}
    }.call(Rank.prototype)
    exports.rank = Rank
}(GroupProjectOverview, GroupProjectOverview.base))
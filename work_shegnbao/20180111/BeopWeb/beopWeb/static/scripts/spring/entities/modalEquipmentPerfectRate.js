//   2016/12/22  设备完好率
var ModalEquipmentPerfectRate = (function () {
    function ModalEquipmentPerfectRate(screen, entityParams, _renderModal) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        ModalBase.call(this, screen, entityParams, renderModal);
    };
    ModalEquipmentPerfectRate.prototype = new ModalBase();

    ModalEquipmentPerfectRate.prototype.optionTemplate = {
        name: 'toolBox.modal.EQUIPMENT_PERFECT_RATE',
        parent: 0,
        mode: 'noConfigModal',
        maxNum: 1,
        title: '',
        minHeight: 2,
        minWidth: 4,
        maxHeight: 3,
        maxWidth: 6,
        type: 'ModalEquipmentPerfectRate',
        scroll: false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };
    ModalEquipmentPerfectRate.prototype.renderModal = function () {
        $(this.container).attr('title', I18n.resource.toolBox.modal.EQUIPMENT_PERFECT_RATE);
        var _this = this;
        var equipmentIntactRate = '<div class="equipmentIntactRate gray-scrollbar"></div>';
        if ($(this.container).find('.dashboardCtn').length !== 0) {
            $(this.container).find('.dashboardCtn').html($(equipmentIntactRate));
        } else {
            $(this.container).html($(equipmentIntactRate));
        }

        //判断点还是接口获得数据
        if (_this.entity.modal.isDataSource) {
            var dataSource = _this.entity.modal.pointName[0];
            WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: [dataSource] }).done(function (result) {
                var resultData = result.dsItemList[0].data;
                if (resultData && resultData !== 'Null') {
                    var data = JSON.parse(resultData.replace(/\'/g, "\""));
                    _this.renderModalDom(data);
                } else {
                    _this.renderModalDom([]);;
                }
            })
        } else {
            if (AppConfig.project === undefined) {
                var projectId = AppConfig.projectId;
            } else {
                var projectId = AppConfig.project.bindId;
            }
            WebAPI.get('/appDashboard/EquipmentIntactRate/pandect/' + projectId + '/' + I18n.type).done(function (result) {
                var dataList = result.data;
                _this.renderModalDom(dataList);
            })
        }
    };
    ModalEquipmentPerfectRate.prototype.renderModalDom = function (dataList) {
        var _this = this;
        if (dataList.length === 0) {
            $(_this.container).find('.equipmentIntactRate').html("<div class='noData' i18n='toolBox.modal_public.NO_DATA'></div>");
        } else {
            $(_this.container).find('.equipmentIntactRate').empty();
            var colorArr = ['#fac824', '#e6c322', '#d2be20', '#bebe1e', '#aab41c', '#94bb1a', '#80b918', '#6eb716', '#5fb615', '#50af12', '#50af12'];
            for (var i = 0, len = dataList.length; i < len; i++) {
                var num = parseInt(dataList[i].IntactRate.split("%")[0]);
                var topPercent = 100 - num;
                var goodNum = dataList[i].GoodNum;
                var totalNum = dataList[i].TotalNum;
                var faultNum = Number(totalNum - goodNum).toFixed(0);

                if (I18n.type === 'zh') {
                    var title = dataList[i].SubSystemName+'的设备健康率是 ' + num + '%，&#10该指标主要体现故障严重程度对于设备整体可靠性的影响。';
                } else {
                    var title = 'The equipment health of '+dataList[i].SubSystemName+' is ' + num + '%,&#10;which indicates the reliability of CHILLERS considering different impacts of faults detected.';
                }
                var str = '<div class="divCtn" data-toggle="tooltip" data-placement="bottom" title="' + title + '">\
                            <div class="pBar">\
                            <div class="circleCtn">\
                              <div class="circleBorder"></div>\
                              <div class="circleBg" style="background:' + colorArr[parseInt(num / 10)] + ';"></div>\
                              <span class="perNum">' + num + '</span>\
                            </div>\
                          </div>\
                          <div class="name" title="' + dataList[i].SubSystemName + '">\
                            <span data-link-to="1480510791302405326379ab">' + dataList[i].SubSystemName + '</span>\
                          </div>\
                          </div>';
                $(str).appendTo($(_this.container).find('.equipmentIntactRate'));
                $(".circleBg").eq(i).animate({ top: topPercent + '%' }, 2000);
            }
        }
        I18n.fillArea($(_this.container));
        _this.attatchEvents();
    };
    ModalEquipmentPerfectRate.prototype.attatchEvents = function () {
        var _this = this;
        $(this.container).off('click.divCtn').on('click.divCtn', '.divCtn', function (e) {
            e.stopPropagation();
            var name = $(this).find('.name').attr('title');
            if (AppConfig.isFactory === 0) {
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: _this.screen.store.model.option().router_id ? _this.screen.store.model.option().router_id : '1486950498276101fee0fcab',
                        type: 'equipment',
                        name: name
                    },
                    container: 'indexMain'
                });

            }
        });
        $(this.container).off('click.ctn').on('click.ctn', function () {
            if (AppConfig.isFactory === 0) {
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: _this.screen.store.model.option().router_id ? _this.screen.store.model.option().router_id : '1486950498276101fee0fcab',
                        type: 'equipment'
                    },
                    container: 'indexMain'
                });

            }
        })
    };
    return ModalEquipmentPerfectRate;
})();
var ModalEquipmentPerfectRateCoolSkin = (function () { 
    function ModalEquipmentPerfectRateCoolSkin(screen,entityParams) {
        ModalEquipmentPerfectRate.call(this,screen,entityParams);
    }
    ModalEquipmentPerfectRateCoolSkin.prototype = new ModalEquipmentPerfectRate();
    ModalEquipmentPerfectRateCoolSkin.prototype.resize = function() {
        this.chart && this.chart.resize();
    };
    ModalEquipmentPerfectRateCoolSkin.prototype.renderModal = function () {
        var _this = this;
        var equipmentIntactRate = '<div class="equipmentIntactRate gray-scrollbar"></div>';
        if ($(this.container).find('.dashboardCtn').length !== 0) {
            $(this.container).find('.dashboardCtn').html($(equipmentIntactRate));
        } else {
            $(this.container).html($(equipmentIntactRate));
        }
        var option = this.screen.store.model.option();
        //判断点还是接口获得数据
        if (option.isDataSource) {
            var dataSource = option.pointName[0];
            WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: [dataSource] }).done(function (result) {
                var resultData = result.dsItemList[0].data;
                if (resultData && resultData !== 'Null') {
                    var data = JSON.parse(resultData.replace(/\'/g, "\""));
                    _this.renderModalDom(data);
                } else {
                    _this.renderModalDom([]);;
                }
            })
        } else {
            if (AppConfig.project === undefined) {
                var projectId = AppConfig.projectId;
            } else {
                var projectId = AppConfig.project.bindId;
            }
            WebAPI.get('/appDashboard/EquipmentIntactRate/pandect/' + projectId + '/' + I18n.type).done(function (result) {
                var dataList = result.data;
                _this.renderModalDom(dataList);
            })
        }
    };
    ModalEquipmentPerfectRateCoolSkin.prototype.renderModalDom = function (dataList) {
        var $equipmentIntactRate = $(this.container).find('.equipmentIntactRate');
        if (dataList.length === 0) {
            $equipmentIntactRate.html("<div class='noData' i18n='toolBox.modal_public.NO_DATA'></div>");
        } else {
            $equipmentIntactRate.html(`<div class="pieEchartsCtn col-xs-4"></div>
                                        <div class="pieLegendCtn col-xs-8">
                                            <table>
                                                <tbody></tbody>
                                            </table>
                                        </div>`);
            // var colorArr = ['#23355C', '#55989A', '#6A728D', '#E7888E', '#F0F190', '#91D477', '#A1BDDC','#F5F2D6'];
            // var colorArr = ['#005562', '#0e8174', '#6eba8c', '#b9f2a1', '#b5c863'];
            var colorArr =  ['#d02e2e', '#ef5d49', '#8ed57f', '#f7cb5d', '#28b4fc', '#13d8e3'];
            var data = [];
            var tdDom = '';
            var trDom = '';
            for (var i = 0, len = dataList.length; i < len; i++){
                var percentNum = Number(Number(dataList[i].IntactRate.split('%')[0]).toFixed(0));
                var name = dataList[i].SubSystemName;
                data.push({
                    value: percentNum,
                    name: name
                });
                var index = i;
                if (i > 4){
                    index = i % 4 - 1;
                }
                var tdRightBorder = "tdRightBorder";
                if (i % 2 !== 0) { 
                    tdRightBorder = '';
                }
                tdDom += `<td class="tdName">
                            <div class="legendColorCtn" style="background-color:${colorArr[index]};"></div>
                            <span>${name}</span>
                        </td>
                        <td class="tdValue ${tdRightBorder}">${percentNum}%</td>`;
                if (i % 2 !== 0){
                    trDom += `<tr>${tdDom}</tr>`;
                    tdDom = '';
                }
            }
            this.renderEcharts(data);
            $(this.container).find('.pieLegendCtn tbody').html(trDom);
        }
        this.attatchEvents();
    };
    ModalEquipmentPerfectRateCoolSkin.prototype.renderEcharts = function (data) {
        var option = {
            tooltip: {
                trigger: 'item',
                textStyle: {
                    color: 'yellow',
                    fontWeight: 'bold'
                },
                formatter: function (a) {
                    return a.name + ': ' + a.value + '%';
                }
            },
            series: [{
                    name: '',
                    type: 'pie',
                    radius: ['76.5%', '78%'],
                    roseType: 'area',
                    color: ['rgba(130,156,191,.4)'],
                    data: [100],
                    animation: false,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    silent: true,
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgb(13, 228, 234)',
                            opacity: 0.86
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgb(13, 228, 234)',
                            opacity: 1
                        }
                    }
                },{
                name: '',
                type: 'pie',
                radius: ['0%', '76%'],
                roseType: 'area',
                color:  ['#d02e2e', '#ef5d49', '#8ed57f', '#f7cb5d', '#28b4fc', '#13d8e3'], 
                // color: ['#d7655e', '#d8b548','#4a998f','#75beda','#b5c863'],
                      
                data: data,
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        show: false
                    }
                },
            }]
        };
        this.chart = echarts.init($(this.container).find('.pieEchartsCtn')[0]);
        this.chart.setOption(option);
    };
    return ModalEquipmentPerfectRateCoolSkin;
})()
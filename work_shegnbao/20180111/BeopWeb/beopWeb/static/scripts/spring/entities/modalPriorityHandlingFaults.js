var ModalPriorityHandlingFaults = (function() {
    function ModalPriorityHandlingFaults(screen, entityParams, _renderModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal);
    };
    ModalPriorityHandlingFaults.prototype = new ModalBase();
    ModalPriorityHandlingFaults.prototype.optionTemplate = {
        name: 'toolBox.modal.PRIORITY_HAADLING_FAULTS',
        parent: 0,
        mode: 'custom',
        maxNum: 1,
        title: '',
        minHeight: 2,
        minWidth: 4,
        maxHeight: 3,
        maxWidth: 6,
        type: 'ModalPriorityHandlingFaults',
        scroll: false,
        tooltip: {
            'imgPC': false,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };
    ModalPriorityHandlingFaults.prototype.renderModal = function() {
        this.layout();
        var _this = this;
        var projectId = AppConfig.projectId;
        var consequenceType = _this.entity.modal.consequenceProp;
        var consquenceNameArr = [];
        for (var c = 0, clength = consequenceType.length; c < clength; c++){
            if (consequenceType[c].status === 1){
                consquenceNameArr.push(consequenceType[c].type);
            }
        } 
        var postData = {
            "arrConsquence": consquenceNameArr,
            "startTime": new Date(new Date().getTime() - 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00'),
            "endTime": new Date(new Date().getTime() - 24 * 60 * 60 * 1000).format('yyyy-MM-dd 23:59:59')
        }
        WebAPI.post('/diagnosis/notice/getRank/' + projectId, postData).done(function(rs) {
            if ($.isEmptyObject(rs.data)) {
                $(_this.container).find('.faultsCtn').html('<div style="width:100%;height:100%;display:flex;justify-content: center;align-items: center;font-size:14px;" i18n="toolBox.modal_public.NO_FAULT"></div>');
            } else {
                var result = rs.data;
                var dom = '';
                var data = {};
                for (var key in result){
                    var singleData = result[key];
                    data[key] = [];
                    for (var i = 0, length = singleData.length; i < length;i++){
                        var index = data[key].findIndex(function (val) {
                            return val.Fault === singleData[i].Fault;
                        })
                        if (index === -1){
                            data[key].push(singleData[i]);
                        } else {
                            data[key][index].Energy += singleData[i].Energy;
                        }
                    }
                    if (key === 'Energy waste') { 
                        data[key] = data[key].filter(function (a) {
                            return a.Energy > 0;
                        })
                    }
                    data[key].sort(function (a,b) {
                        return b.Energy - a.Energy;
                    })
                }
                for (var key in data) {
                    var faultList = '';
                    var jLength = data[key].length;
                    var resultData = [];
                    var faultName = [];
                    for (var i = 0, len = jLength; i < len; i++){
                        if (resultData.length !== 5 && faultName.indexOf(data[key][i].Fault) === -1) {
                            faultName.push(data[key][i].Fault);
                            resultData.push(data[key][i]);
                        }   
                    }
                    jLength = resultData.length;
                    for (var j = 0; j < 5; j++) {
                        var background = '', fault;
                        if (j < jLength - 1 || j === jLength - 1) {
                            fault = resultData[j].Fault;
                            if (j % 2 === 0) {
                                background = 'background: linear-gradient(90deg, rgba(15, 15, 15, 0.1) 50%, rgba(15, 15, 15, 0) 100%);';
                            }
                            var background = '';
                            if (j % 2 === 0) {
                                background = 'background:-webkit-linear-gradient(left, rgba(200, 214, 238, 0.3), rgb(200, 214, 238), rgba(200, 214, 238, 0.3))';
                            }
                            faultList += `<div class="faultSingle" style="${background}">
                                            <span class="faultName" title="${fault}">${fault}</span>
                                            <span class="icon iconfont icon-daochu"></span>
                                        </div>
                                        <div class="line"></div>`;
                        }
                    }
                    var index = consquenceNameArr.indexOf(key);
                    key = consequenceType[index].title === '' ? key : consequenceType[index].title;
                    var colXs;
                    if (consquenceNameArr.length === 1){
                        colXs = 'col-xs-12';
                    } else {
                        colXs = 'col-xs-6';
                    }
                    dom += `<div class="consquenceSingle ${colXs}">
                                <div class="consquenceName">
                                    ${key}
                                    <div class="iconCtn">
                                        <span class="glyphicon glyphicon-list-alt detail" title="${i18n_resource.toolBox.modal_PRIORITY_HAADLING_FAULTS.DETAIL}"></span>
                                        <span class="glyphicon glyphicon-briefcase showAllFaults" title="${i18n_resource.toolBox.modal_PRIORITY_HAADLING_FAULTS.ALL_FAULTS}"></span>
                                    </div>
                                </div>
                                <div class="faultList">
                                    <div class="line"></div>
                                    ${faultList}
                                </div>
                            </div>`
                }
                $(_this.container).find('.faultsCtn').html(dom);
                $(_this.container).find('.faultsCtn .verticalLine:even').hide();
            }
            I18n.fillArea($(_this.container));
            _this.attatchEvents();
        });
    };
    ModalPriorityHandlingFaults.prototype.layout = function() {
        var $container = $(this.container);
        var faultsDom = `<div class="faultsCtn gray-scrollbar"></div>`;
        if ($container.find('.dashboardCtn').length !== 0) {
            $container.find('.dashboardCtn').html(faultsDom);
        } else {
            $container.html(faultsDom);
        }
        this.$faultsDom = $('.faultsCtn', $container);
    };
    ModalPriorityHandlingFaults.prototype.attatchEvents = function(points) {
        var _this = this;
        $(_this.container).off('click.faultSingle').on('click.faultSingle', '.faultSingle', function(e) {
            var e = e || window.event;
            e.stopPropagation();
            var faultName = $(this).find('.faultName').text();
            var faultInfos = {};
            var postData = {
                value: faultName,
                type: 'fault',
                startTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'),
                endTime: new Date().format('yyyy-MM-dd HH:mm:ss'),
                projId: AppConfig.projectId
            }
            Spinner.spin($(_this.container)[0]);
            var containerScreen = $(_this.container).closest('#indexMain');
            WebAPI.post('/diagnosis/getFaultDetails', postData).done(function(faultDetail) {
                var faultDetailData = faultDetail.data;
                faultInfos['faultName'] = faultName;
                faultInfos['faultDetailData'] = faultDetailData;
                faultInfos['containerScreen'] = containerScreen;
                faultInfos['diagType'] = 'fault';
                new DiagnosisInfo().show(faultInfos);
            })
        });
        $(this.container).off('click.showAllFaults').on('click.showAllFaults', '.showAllFaults', function(e) {
            var e = e || window.event;
            e.stopPropagation();
            if (AppConfig.isFactory === 0) {
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: _this.screen.store.model.option().router_id ? _this.screen.store.model.option().router_id : '1486950498276101fee0fcab',
                        type: 'fault'
                    },
                    container: 'indexMain'
                });
            }
        });
        $(this.container).off('click.detail').on('click.detail', '.detail', function(e) {
            var e = e || window.event;
            e.stopPropagation();
            if (AppConfig.isFactory === 0) {
                ScreenManager.goTo({
                    page: 'observer.screens.FacReportWrapScreen',
                    options: {
                        id: _this.screen.store.model.option().report_link ? _this.screen.store.model.option().report_link : '14925855233475115f8526a0',
                        type: 'fault'
                    },
                    response: _this.screen.store.model.option().chapter,
                    container: 'indexMain'
                });
            }
        })
    };
    return ModalPriorityHandlingFaults;
})()
var ModalPriorityHandlingFaultsCoolSkin = (function () {
    function ModalPriorityHandlingFaultsCoolSkin(screen, entityParams) {
        ModalPriorityHandlingFaults.call(this, screen, entityParams);
    }
    ModalPriorityHandlingFaultsCoolSkin.prototype = new ModalPriorityHandlingFaults();
    ModalPriorityHandlingFaultsCoolSkin.prototype.renderModal = function() {
        this.layout();
        var _this = this;
        var projectId = AppConfig.projectId;
        var option = _this.entity.modal.option;
        var consequenceType = _this.entity.modal.consequenceProp;
        var consquenceNameArr = [];
        for (var c = 0, clength = consequenceType.length; c < clength;c++){
            if (consequenceType[c].status === 1){
                consquenceNameArr.push(consequenceType[c].type);
            }
        } 
        var postData = {
            "arrConsquence": consquenceNameArr,
            "startTime": new Date(new Date().getTime() - 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00'),
            "endTime": new Date().format('yyyy-MM-dd 00:00:00'),
        }
        WebAPI.post('/diagnosis/notice/getRank/' + projectId, postData).done(function(rs) {
            if ($.isEmptyObject(rs.data)) {
                $(_this.container).find('.faultsDeatilCtn').html('<div style="width:100%;height:100%;display:flex;justify-content: center;align-items: center;font-size:14px;" i18n="toolBox.modal_public.NO_FAULT"></div>');
            } else {
                var result = rs.data;
                var jsonLength = 0;
                var dom = '';
                var data = {};
                for (var key in result){
                    var singleData = result[key];
                    data[key] = [];
                    for (var i = 0, length = singleData.length; i < length;i++){
                        var index = data[key].findIndex(function (val) {
                            return val.Fault === singleData[i].Fault;
                        })
                        if (index === -1){
                            data[key].push(singleData[i]);
                        } else {
                            data[key][index].Energy += singleData[i].Energy;
                        }
                    }
                    if (key === 'Energy waste') { 
                        data[key] = data[key].filter(function (a) {
                            return a.Energy > 0;
                        })
                    }
                    data[key].sort(function (a,b) {
                        return b.Energy - a.Energy;
                    })
                }
                for (var key in data) {
                    var dom = '';
                    var faultList = '';
                    var jLength = data[key].length;
                    var resultData = [];
                    var faultName = [];
                    for (var i = 0, len = jLength; i < len; i++){
                        if (resultData.length !== 5 && faultName.indexOf(data[key][i].Fault) === -1) {
                            faultName.push(data[key][i].Fault);
                            resultData.push(data[key][i]);
                        }   
                    }
                    jLength = resultData.length;
                    for (var j = 0; j < 5; j++) {
                        var background = '', fault;
                        if (j > jLength - 1) {
                            fault = 'transparent';
                            background = 'transparent';
                            style = "color: transparent;";
                        }else {
                            fault = resultData[j].Fault;
                            if (j % 2 === 0) {
                                background = 'background: linear-gradient(90deg, rgba(15, 15, 15, 0.1) 50%, rgba(15, 15, 15, 0) 100%);';
                            }
                            style = '';
                        }
                        faultList += `<div style="${background}" class="faultSingle">
                                        <span title="${fault}" style="${style}" class="faultName">${fault}</span>
                                    </div>`;
                    }
                    var index = consquenceNameArr.indexOf(key);
                    key = consequenceType[index].title === '' ? key : consequenceType[index].title;
                    dom = `<div class="col-xs-12" style="height: 260px;"><div class="faultsInfo">
                                <div class="consquenceName">
                                    ${key}
                                    <div class="iconCtn">
                                        <span class="glyphicon glyphicon-list-alt detail" title="${i18n_resource.toolBox.modal_PRIORITY_HAADLING_FAULTS.DETAIL}"></span>
                                        <span class="glyphicon glyphicon-briefcase showAllFaults" title="${i18n_resource.toolBox.modal_PRIORITY_HAADLING_FAULTS.ALL_FAULTS}"></span>
                                        <span class="glyphicon glyphicon-info-sign" title="info"></span>
                                    </div>
                                </div>
                                <div class="consequenceFaults">
                                    ${faultList}
                                </div>
                            </div>
                            <div class="barEchartsctn">
                                <div class="legendCtn"></div>
                                <div class="barEcharts"></div>
                            </div></div>`;
                    $(_this.container).find('.faultsDeatilCtn').append($(dom));
                    _this.renderRightPie($(_this.container).find('.barEchartsctn')[jsonLength]);
                    jsonLength = jsonLength+1;
                }
            }
            
            I18n.fillArea($(_this.container));
            _this.attatchEvents();
        });
    };
    ModalPriorityHandlingFaultsCoolSkin.prototype.layout = function() {
        var $container = $(this.container);
        var faultsDom = `<div class="faultsDeatilCtn"></div>`;
        if ($container.find('.dashboardCtn').length !== 0) {
            $container.find('.dashboardCtn').html(faultsDom);
        } else {
            $container.html(faultsDom);
        }
    };
    ModalPriorityHandlingFaultsCoolSkin.prototype.renderRightPie = function (ctn) { 
        var legendDom = `<div>
                            <div style="background:#f7cb5d"></div>
                            故障
                        </div>
                        <div>
                            <div style="background:#28b4fc"></div>
                            异常
                        </div>`;
        $(ctn).find('.legendCtn').html(legendDom);
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            series: [{
                type: 'pie',
                radius: [70, 77],
                data: [{
                    value: 20,
                    name: '故障',
                    itemStyle: {
                        normal: {
                            color: '#f7cb5d',
                            label:{
                                show:false
                            },
                            labelLine:{
                                show:false
                            }
                        },
                        emphasis: {
                            color: '#f7cb5d',
                            label:{
                                show:false
                            },
                            labelLine:{
                                show:false
                            }
                        }
                    },
                    hoverAnimation: false
                }, {
                    value: 80,
                    tooltip: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: ['rgba(130,156,191,.4)'],
                            label:{
                                show:false
                            },
                            labelLine:{
                                show:false
                            }
                        },
                        emphasis: {
                            color: ['rgba(130,156,191,.4)'],
                            label:{
                                show:false
                            },
                            labelLine:{
                                show:false
                            }
                        }
                    },
                    hoverAnimation: false
                }]
            }, {
                type: 'pie',
                radius: [50, 57],
                data: [{
                    value: 20,
                    name: '异常',
                    itemStyle: {
                        normal: {
                            color: '#28b4fc',
                            label:{
                                show:false
                            },
                            labelLine:{
                                show:false
                            }
                        },
                        emphasis: {
                            color: '#28b4fc',
                            label:{
                                show:false
                            },
                            labelLine:{
                                show:false
                            }
                        }
                    },
                    hoverAnimation: false
                }, {
                    value: 80,
                    name: '占位',
                    tooltip: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: ['rgba(130,156,191,.4)'],
                            label:{
                                show:false
                            },
                            labelLine:{
                                show:false
                            }
                        },
                        emphasis: {
                            color: ['rgba(130,156,191,.4)'],
                            label:{
                                show:false
                            },
                            labelLine:{
                                show:false
                            }
                        }
                    },
                    hoverAnimation: false
                }]
            }]
        };
        this.chart = echarts.init($(ctn).find('.barEcharts')[0]);
        this.chart.setOption(option);
    }
    return ModalPriorityHandlingFaultsCoolSkin;
})()
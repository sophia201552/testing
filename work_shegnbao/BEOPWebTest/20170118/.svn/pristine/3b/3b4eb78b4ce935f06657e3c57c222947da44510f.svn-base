var ModalMobile = (function () {
    function ModalMobile(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        ModalChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
    };

    ModalMobile.prototype = new ModalChart();
    ModalMobile.prototype.optionTemplate = {
        name:'toolBox.modal.MOBILE_CHART',//'ModalHistoryChart',        parent:1,
        parent:1,
        mode:['easyHistory'],
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalMobile'
    };

    ModalMobile.prototype.optionDefault = {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            feature: {
                dataView : {show: false, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable: false,
        dataZoom: {
            show: true
        },
        grid: (function(){//统一配置grid
            var grid = {
                    borderWidth: 0,
                    borderColor: '#eee',
                    left:50,
                    bottom:40,
                    right:40,
                    top:40
                }
            if(AppConfig.isMobile){
                grid.x = 40;
            }
            return grid;
        }()),
        xAxis: [
            {
                type: 'time',
                splitLine: {show : false}
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show : false},
                splitLine: {
                    show:(function(){
                        if(AppConfig.isMobile){
                            return false;
                        }else{
                            return true;
                        }
                    }())
                },
                axisLabel : {
                    formatter: function (value){
                        if(AppConfig.isMobile && value/1000 >= 1){
                            return value/1000 + 'k';
                        }else{
                            return value;
                        }
                    }
                }
            }
        ],
        animation: true
    };

    ModalMobile.prototype.renderModal = function () {

    },

    ModalMobile.prototype.updateModal = function (options) {
    },

    ModalMobile.prototype.showConfigMode = function () {
    },

    ModalMobile.prototype.goBackTrace = function (data) {

    }

    return ModalMobile;
})();



// var ModalMobileWorkDiagnosis = (function () {
//     function ModalMobileWorkDiagnosis(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
//         if (!screen) return;
//         var renderModal = _renderModal ? _renderModal : this.renderModal;
//         var updateModal = _updateModal ? _updateModal : this.updateModal;
//         var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
//         this.m_bIsGoBackTrace = false;
//         this.m_traceData = undefined;
//         ModalMobile.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
//     };

//     ModalMobileWorkDiagnosis.prototype = new ModalChart();
//     ModalMobileWorkDiagnosis.prototype.optionTemplate = {
//         name:'toolBox.modal.MOBILE_CHART',//'ModalHistoryChart',        parent:1,
//         parent:3,
//         mode:['easyHistory'],
//         maxNum: 5,
//         title:'',
//         minHeight:2,
//         minWidth:3,
//         maxHeight:6,
//         maxWidth:12,
//         type:'ModalMobileWorkDiagnosis'
//     };

//     ModalMobileWorkDiagnosis.prototype.optionDefault = {
//         tooltip: {
//             trigger: 'axis'
//         },
//         toolbox: {
//             show: false,
//             feature: {
//                 dataView : {show: false, readOnly: true},
//                 magicType : {show: true, type: ['line', 'bar']},
//                 restore : {show: true},
//                 saveAsImage : {show: true}
//             }
//         },
//         calculable: false,
//         dataZoom: {
//             show: true
//         },
//         grid: (function(){//统一配置grid
//             var grid = {
//                     borderWidth: 0,
//                     borderColor: '#eee',
//                     left:50,
//                     bottom:40,
//                     right:40,
//                     top:40
//                 }
//             if(AppConfig.isMobile){
//                 grid.x = 40;
//             }
//             return grid;
//         }()),
//         xAxis: [
//             {
//                 type: 'time',
//                 splitLine: {show : false}
//             }
//         ],
//         yAxis: [
//             {
//                 type: 'value',
//                 splitArea: {show : false},
//                 splitLine: {
//                     show:(function(){
//                         if(AppConfig.isMobile){
//                             return false;
//                         }else{
//                             return true;
//                         }
//                     }())
//                 },
//                 axisLabel : {
//                     formatter: function (value){
//                         if(AppConfig.isMobile && value/1000 >= 1){
//                             return value/1000 + 'k';
//                         }else{
//                             return value;
//                         }
//                     }
//                 }
//             }
//         ],
//         animation: true
//     };

//     ModalMobileWorkDiagnosis.prototype.renderModal = function () {
//         this.container.innerHTML = `
//         <div class="panel-heading springHead" style="padding-top:12px;border-bottom-color:#ddd;"><h3 class="panel-title" style="font-weight: bold;">运行诊断概况</h3></div>
//             <div class="operationGuideZone">
//                     <div class="runDiaDetail">
//                         <div class="panel-group" id="accordions">
//                             <div class="panel panel-default">
//                                 <div class="panel-heading zepto-ev active" data-toggle="collapse" data-parent="#accordions" href="#collapseOne">
//                                     <h4 class="panel-title">
//                                         <div>主机系统</div>
//                                     </h4>
//                                 </div>
//                                 <div id="collapseOne" class="panel-collapse collapse in">
//                                     <div class="panel-body collapseTab borderColorTemp4">
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">主机效率</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr01'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr02'></div>
//                                         </div>
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">负载率</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr11'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr12'></div>
//                                         </div>
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">趋近温差</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr21'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr22'></div>
//                                         </div>
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">主机传感器</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr31'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr32'></div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div class="panel panel-default">
//                                 <div class="panel-heading zepto-ev" data-toggle="collapse" data-parent="#accordions" href="#collapseTwo">
//                                     <h4 class="panel-title">
//                                         <div>冷冻/冷却水系统</div>
//                                     </h4>
//                                 </div>
//                                 <div id="collapseTwo" class="panel-collapse collapse">
//                                     <div class="panel-body collapseTab borderColorTemp4">
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">板换温差</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr41'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr42'></div>
//                                         </div>
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">冷冻供回水温差</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr51'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr52'></div>
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">VAV</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr61'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr62'></div>
//                                         </div>
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">传感器</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr71'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr72'></div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div class="panel panel-default">
//                                 <div class="panel-heading zepto-ev" data-toggle="collapse" data-parent="#accordions" href="#collapseThree">
//                                     <h4 class="panel-title">
//                                         <div>冰蓄冷/冰槽系统</div>
//                                     </h4>
//                                 </div>
//                                 <div id="collapseThree" class="panel-collapse collapse" style="font-size:16px">
//                                     <div class="panel-body collapseTab borderColorTemp4">
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">制冰效率</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr81'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr82'></div>
//                                         </div>
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">融冰策略</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr91'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr92'></div>
//                                         </div>
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">设备状态</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr101'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr102'></div>
//                                         </div>
//                                         <div class="collapseCells borderColorTemp3">
//                                             <div class="fDD-Detail" style="width:20%;">融释冰传感器</div>
//                                             <div class="fDD-Detail" style="width:15%;" id='fddStr111'></div>
//                                             <div class="fDD-Detail fDD-DetailThr" id='fddStr112'></div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 `;
//         var $fDD_Detail = $(".fDD-Detail");
//         var $fDD_DetailThr = $(".fDD-DetailThr");
//         var $fDDB = $(".fDDB");
//         var $titleText = $(".titleText");
//         var $collapseTab = $(".collapseTab");
//         var $collapseCells = $(".collapseCells");
//         var $runDiaDetail = $(".runDiaDetail");
//         $fDD_Detail.css({
//             "display": "inline-block",
//             "width": "20%",
//             "margin": "5px",
//             "font-size": "14px",
//             "text-align": "left",
//             "vertical-align": "middle"
//             });
//         $fDD_DetailThr.css("width","50%");
//         $fDDB.css({
//             "display":"none"
//         });
//         $titleText.css({
//             "height":"30px",
//             "font-size":"18px",
//             "width":"98%",
//             "left":"16px"
//         });
//         $collapseTab.css("background","#f0f0f0");
//         $collapseCells.css({
//             "width":"100%",
//             "margin":"5px",
//             "margin-top":"0",
//             "color":"#646464"
//             // "border-bottom":"1px #646464 solid"
//         });
        
//         $runDiaDetail.css({
//             "width":"100%",
//             "overflow-y":"auto"
//         });

//         // 获取历史数据API;
//         // WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
//         //     //dataSourceId: '',  //_this.screen.store.datasources[0].id,
//         //     dsItemIds: optPtName,//[id1,id2]
//         //     timeStart: startTime,//'2013-11-11 11:11:11'
//         //     timeEnd: endTime,//'2013-11-11 11:11:11'
//         //     timeFormat: timeType//h1:m1:m5:d1:M1
//         // }).done(function (dataSrc) {
//         //     //TODO
//         // }),
//         // this.container.innerHTML = '<div>1111s</div>';
//     },
//     ModalMobileWorkDiagnosis.prototype.updateModal = function (options) {
//         // if(options.length < 1) return;
//         var diagList = [];
//         for(var i = 0;i<options.length;i++){
//             diagList.push(options[i].data);
//         };
//         console.log(diagList);

//         for (var j = 0;j<diagList.length;j++) {
//             if(!diagList[j]) continue;
//             var diagStr= diagList[j].split(']');
//             for (var n = 1;n<diagStr.length;n++) {
//             $('#fddStr'+j+n).text(diagStr[n]);
//             };
//             if (diagStr[0]==1) {
//                 $('#fddStr'+j+'1').css('color', '#EB4F3B');
//             }else {$('#fddStr'+j+'1').css('color', '#11CD6E');
//                 };    
//         };              
//     },

//     ModalMobileWorkDiagnosis.prototype.showConfigModal = function () { 
//         var _this = this;
//         var option = {
//             header:{
//                 'title':'配置',
//                 'needBtnClose':true
//             },
//             area:[{
//                 'module':'multiDataConfig'
//             }],
//             result:{
//                 'func':function(data){
//                     _this.saveData(data);
//                 }
//             }
//         }
//         new ConfigModal(option,document.getElementById('paneCenter')).init().show();
//     },
//     ModalMobileWorkDiagnosis.prototype.saveData = function(data){
//         for(var i = 0;i<data.dataInfoList.length;i++){
//             this.entity.modal.points = [data.dataInfoList[i].param.data];
//         }
        
//         this.entity.modal.interval = 5;
//     },
//     ModalMobileWorkDiagnosis.prototype.goBackTrace = function (data) {

//     }
//     return ModalMobileWorkDiagnosis;
// })();
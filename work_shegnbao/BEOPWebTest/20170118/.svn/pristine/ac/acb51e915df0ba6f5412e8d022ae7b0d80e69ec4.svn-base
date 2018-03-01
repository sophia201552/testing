//   2016/12/22  设备完好率
var ModalEquipmentPerfectRate = (function(){
    function ModalEquipmentPerfectRate(screen, entityParams, _renderModal ) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        ModalBase.call(this, screen, entityParams, renderModal);
        
    };
    ModalEquipmentPerfectRate.prototype = new ModalBase();

    ModalEquipmentPerfectRate.prototype.optionTemplate = {
        name: 'toolBox.modal.EQUIPMENT_PERFECT_RATE',
        parent:0,
        mode: 'noConfigModal',
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:4,
        maxHeight:3,
        maxWidth:6,
        type: 'ModalEquipmentPerfectRate',
        scroll:false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalEquipmentPerfectRate.prototype.resize = function () {
        var width = $(this.container).width();
        var circleWidth = width*0.33*0.5*0.85;
        $(this.container).find('.circleCtn').css({width:circleWidth+'px',height:circleWidth+'px'});
    }
    ModalEquipmentPerfectRate.prototype.renderModal = function () {
        $(this.container).attr('title',I18n.resource.toolBox.modal.EQUIPMENT_PERFECT_RATE);
        var _this = this;
        var equipmentIntactRate = '<div class="equipmentIntactRate gray-scrollbar"></div>';
        if($(this.container).find('.dashboardCtn').length !== 0){
            $(this.container).find('.dashboardCtn').html($(equipmentIntactRate));
        }else{
           $(this.container).html($(equipmentIntactRate));
        }
        
        if(AppConfig.project === undefined){
            var projectId = AppConfig.projectId;
        }else{
            var projectId = AppConfig.project.bindId;
        }
        WebAPI.get('/appDashboard/EquipmentIntactRate/pandect/'+projectId+'/'+I18n.type).done(function(result){
            var dataList = result.data;
            if(dataList.length === 0){
                $(_this.container).find('.equipmentIntactRate').html("<div class='noData' i18n='toolBox.modal_public.NO_DATA'></div>");
            }else{
                var colorArr = ['#fac824','#e6c322','#d2be20','#bebe1e','#aab41c','#94bb1a','#80b918','#6eb716','#5fb615','#50af12','#50af12'];
                for(var i=0,len=dataList.length;i<len;i++){
                    var num = Number(dataList[i].IntactRate.split("%")[0]).toFixed(0);
                    var topPercent = 100-num;
                    var goodNum = dataList[i].GoodNum;
                    var totalNum = dataList[i].TotalNum;
                    var faultNum = totalNum-goodNum;

                    if(I18n.type === 'zh'){
                        var title = '本项目共有'+dataList[i].SubSystemName+' '+totalNum+' 个&#10;BeOP本月为本项目累计检测出 '+faultNum+' 个故障';
                    }else{
                        var title = totalNum+' '+dataList[i].SubSystemName+' total.&#10; BeOP detected '+faultNum+' faults in this month.';
                    }
                    var str = '<div class="divCtn col-xs-4" data-toggle="tooltip" data-placement="bottom" title="'+title+'">\
                                <div class="pBar">\
                                <div class="circleCtn">\
                                  <div class="circleBorder"></div>\
                                  <div class="circleBg" style="background:'+colorArr[parseInt(num/10)]+';"></div>\
                                  <span class="perNum">'+num+'</span>\
                                </div>\
                              </div>\
                              <div class="name" title="'+dataList[i].SubSystemName+'">\
                                <span data-link-to="1480510791302405326379ab">'+dataList[i].SubSystemName+'</span>\
                              </div>\
                              </div>';
                    $(str).appendTo($(_this.container).find('.equipmentIntactRate'));
                    $(".circleBg").eq(i).animate({top:topPercent+'%'},2000);
                }
            } 
            I18n.fillArea($(_this.container));
            _this.attatchEvents();
            _this.resize();
        })
    };

    ModalEquipmentPerfectRate.prototype.attatchEvents = function (points) {
        $(this.container).off('click').on('click',function(){
            if(AppConfig.isFactory === 0){
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: '148404189964451192095bee'
                    },
                    container: 'indexMain'
                });
            }
        })
    };
    return ModalEquipmentPerfectRate;
})()
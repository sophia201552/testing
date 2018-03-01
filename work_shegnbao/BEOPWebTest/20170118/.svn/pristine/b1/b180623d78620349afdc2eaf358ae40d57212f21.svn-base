//   2016/12/22  工单统计
var ModalWorkOrderStatistics = (function(){
    function ModalWorkOrderStatistics(screen, entityParams, _renderModal) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        ModalBase.call(this, screen, entityParams, renderModal);
        
    };
    ModalWorkOrderStatistics.prototype = new ModalBase();

    ModalWorkOrderStatistics.prototype.optionTemplate = {
        name: 'toolBox.modal.WORK_ORDER_STATISTICS',
        parent:0,
        mode: 'noConfigModal',
        maxNum: 1,
        title:'',
        minHeight:3,
        minWidth:3,
        maxHeight:2,
        maxWidth:4,
        type: 'ModalWorkOrderStatistics',
        scroll:false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalWorkOrderStatistics.prototype.renderModal = function () {
      $(this.container).attr('title',I18n.resource.toolBox.modal.WORK_ORDER_STATISTICS);
      var _this = this;
      if($(this.container).find('.dashboardCtn').length !== 0){
          $(this.container).find('.dashboardCtn').html(_this.layoutPage());
      }else{
          $(this.container).html(_this.layoutPage());
      }
      
      I18n.fillArea($(this.container));
      var $workOrderStatistics = $(this.container).find(".workOrderStatistics");
      if(AppConfig.project === undefined){
        var projectId = AppConfig.projectId;
      }else{
        var projectId = AppConfig.project.bindId;
      }
      WebAPI.get('/Dashboard/workOrderStatistics/'+ projectId).done(function(result){
        function isEmptyObject(e) {  
          var t;  
          for (t in e)  
              return !1;  
          return !0  
        }  
        if( isEmptyObject(result.data) ){
          var newOrder = I18n.resource.toolBox.modal_public.NO_DATA;
          var averSendTime = I18n.resource.toolBox.modal_public.NO_DATA;
          var percentage = 0;
        }else{
          var data = result.data;
          var newOrderAll=0,finishOrder=0,responseTime=0;
          var timesNum=0;
          for(var k in data){
            var item = data[k];
            for(var i in item){
              if(k==='FinishingOrder'){
                finishOrder += item[i];
              }else if(k==='NewOrder'){
                newOrderAll += item[i];
              }else{
                responseTime += item[i];
                timesNum ++;
              }
            }
          }
          var newOrder = newOrderAll;
          // var averSendTime = (responseTime+28800).toFixed(0) + ' min';
          var averSendTime = 31+'min';
          var percentage = newOrder === 0? 0 :(finishOrder/newOrder*100).toFixed(0);
        }
        $workOrderStatistics.find('.newOrderNum').html(newOrder);
        $workOrderStatistics.find('.averSendTime').html(averSendTime);
        $workOrderStatistics.find('.percentageDetail').html(percentage+'%');
        $workOrderStatistics.find('.percentageBar').css('width',percentage+'%');
        if(Number(percentage) === 100){
          $workOrderStatistics.find('.percentageBar').css('border-radius','.5em');
        }
      })
      this.attatchEvents();
    };

    ModalWorkOrderStatistics.prototype.layoutPage = function () {
        return (
                '<div class="workOrderStatistics">\
                    <div>\
                      <div class="billInfo">\
                        <span class="name" i18n="toolBox.WORK_ORDER_STATISTICS.NEW_WORK"></span>\
                      </div>\
                      <div class="state">\
                        <span class="newOrderNum">loading</span>\
                      </div>\
                    </div>\
                    <div>\
                      <div class="billInfo">\
                        <span class="name" i18n="toolBox.WORK_ORDER_STATISTICS.REPONSE_TIME"></span>\
                      </div>\
                      <div class="state">\
                        <span class="averSendTime">loading</span>\
                      </div>\
                    </div>\
                    <div class="completionRate">\
                      <div class="billInfo">\
                        <span class="name" i18n="toolBox.WORK_ORDER_STATISTICS.COMPLETE"></span>\
                      </div>\
                      <div class="percentageCtn">\
                        <div class="progressBar">\
                          <div class="percentageBar barThree">\
                            <span class="percentageDetail">loading</span>\
                          </div>\
                        </div>\
                      </div>\
                    </div>\
                </div>'
            );
    };

     ModalWorkOrderStatistics.prototype.attatchEvents = function (points) {
        $(this.container).off('click').on('click',function(){
            if(AppConfig.isFactory === 0){
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: '148404186778151121ad8982'
                    },
                    container: 'indexMain'
                });
            }
        })
    };
    
    return ModalWorkOrderStatistics;
})()
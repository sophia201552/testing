//   2016/12/22  优先处理故障列表
var ModalPriorityHandlingFaultList = (function(){
    function ModalPriorityHandlingFaultList(screen, entityParams, _renderModal) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        ModalBase.call(this, screen, entityParams, renderModal);
        this.lastFiveMinutes = undefined;
        this.option = undefined;
    };
    ModalPriorityHandlingFaultList.prototype = new ModalBase();

    ModalPriorityHandlingFaultList.prototype.optionTemplate = {
        name: 'toolBox.modal.PRIORITY_HAADLING_FAULT_LIST',
        parent:0,
        mode: 'noConfigModal',
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:4,
        maxHeight:3,
        maxWidth:6,
        type: 'ModalPriorityHandlingFaultList',
        scroll:false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalPriorityHandlingFaultList.prototype.renderModal = function () {
        $(this.container).attr('title',I18n.resource.toolBox.modal.PRIORITY_HAADLING_FAULT_LIST);
        var _this = this;
        var priorityHandlingFaultList = '<div class="priorityHandlingFaultList"></div>';
        
        if($(this.container).find('.dashboardCtn').length !== 0){
            $(this.container).find('.dashboardCtn').html($(priorityHandlingFaultList));
        }else{
            $(this.container).html($(priorityHandlingFaultList));
        }
        var store = [];

        if(AppConfig.project === undefined){
            var projectId = AppConfig.projectId;
        }else{
            var projectId = AppConfig.project.bindId;
        }
        $.get('/diagnosis/notice/getTop5/'+projectId).done(function(rv) {
            if (!rv.data) return;
            store = rv.data;
            if(store.length === 0){
                $(_this.container).find('.priorityHandlingFaultList').html('<div style="width:100%;height:calc(100% - 30px);display:flex;justify-content: center;align-items: center;font-size:14px;" i18n="toolBox.modal_public.NO_FAULT"></div><div class="bottomDiv"><button class="showInfoBtn" i18n="toolBox.modal_public.DETAILS"></button></div>');
            }else{
                var html = '<div class="faultList">';
                for (var i = 0; i < rv.data.length; i++) {
                    var item = rv.data[i];
                    if(I18n.type === 'zh'){
                        var InProcess = '未处理';
                        var Completed = '已完成';
                    }else{
                        var InProcess = 'In Process';
                        var Completed = 'Completed';
                    }
                    var status = InProcess;
                    if (item.Status != 1 || item.CheckTime != null) status = Completed;
                    html += '<div data-index=' + i + ' class="rowList">\
                            <span style="width:20%;">' + item.Time.substr(5) + '</span>\
                            <span title="'+item.Fault+'" style="width:calc(50% - 85px);">' + item.Fault + '</span>\
                            <span title="'+item.Equipment+'" style="width:calc(50% - 85px)">' + item.Equipment + '</span>\
                            <span style="width:120px;">' + status + '</span>\
                            </div>';
                }
                html += '</div><div class="bottomDiv"><button class="showInfoBtn" i18n="toolBox.modal_public.DETAILS"></button></div>';
                $(_this.container).find('.priorityHandlingFaultList').html(html);
            }
            I18n.fillArea($(_this.container));
            $(_this.container).off('click.rowList').on('click.rowList','.rowList',function(e){
                var e = e || window.event;
                e.stopPropagation();
                var faultName = $(this).find('span').eq(1).text();
                var faultInfos ={};
                var postData = {
                   value:faultName,
                   type:'fault',
                   startTime: new Date(new Date().valueOf()-86400000*7).format('yyyy-MM-dd ')+'00:00:00',
                   endTime: new Date().format('yyyy-MM-dd HH:mm:ss'),
                   projId: projectId
                 }
                Spinner.spin($(_this.container).find('.priorityHandlingFaultList')[0]);
                var containerScreen = $(_this.container).closest('#indexMain');
                WebAPI.post('/diagnosis/getFaultDetails',postData).done(function(faultDetail){
                    var faultDetailData = faultDetail.data;
                    faultInfos['faultName'] = faultName;
                    faultInfos['faultDetailData'] = faultDetailData;
                    faultInfos['containerScreen'] = containerScreen;
                    faultInfos['diagType'] = 'fault';
                    new DiagnosisInfo().show(faultInfos);
                 })
            });
        })
        this.attatchEvents();
    };

    ModalPriorityHandlingFaultList.prototype.attatchEvents = function (points) {
        $(this.container).off('click.showInfoBtn').on('click.showInfoBtn','.showInfoBtn',function(e){
            var e = e || window.event;
            e.stopPropagation();
            if(AppConfig.isFactory === 0){
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: '1484041883476511bc54d206'
                    },
                    container: 'indexMain'
                });
            }
        })
    };

    return ModalPriorityHandlingFaultList;
})()
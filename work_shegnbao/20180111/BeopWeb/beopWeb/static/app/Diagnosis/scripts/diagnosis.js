// diagnosis.js - disgnosis 入口

;(function (exports, Pages, Nav, FeedBackModal, WorkOrderModal) {
    class DiagnosisHistory {
        constructor(diagnosis){
            this.diagnosis = diagnosis;
            this.conditionModel = diagnosis.conditionModel;
            this._list = [];
            this._keys = ['time','activeEntities','activeAllEntities','activeCategories','activeFaults'];
            this.length = 0;
        }
        push(pageName) {
            let state = {
                _pageName: pageName
            };
            this._keys.forEach(key=>{
                state[key] = this.conditionModel[key]();
            });
            this._list.push(state);
            this.length++;
        }
        back() {
            let state = this._list.pop();
            if(state){
                this.length--;
                this.diagnosis.changePage(document.querySelector(`#diagnosisV2Detail [data-class="${state._pageName}"]`), false);
                this.conditionModel.update({ 'activeEntities': state['activeEntities'], 'activeAllEntities': state['activeAllEntities'],'activeFaults': state['activeFaults'],'activeCategories': state['activeCategories']});
                this.diagnosis.page.show();
            }
        }
        clear() {
            this._list = [];
            this.length = 0;
        }
    }
    class Diagnosis {
        constructor(container) {
            if (typeof container === 'string') {
                this.container = document.querySelector('#'+container);
            } else {
                this.container = container;
            }
            this.page = null;
            this.nav = null;
            this.feedBackModal = null;
            this.WorkOrderModal = null;
            this.conditionModel = new Model({
                time:{
                    startTime: undefined,
                    endTime: undefined,
                },
                activeEntities: [],
                activeAllEntities: [],
                activeFaults:[],
                activeCategories: [],
                searchKey: ''
            });
            this.history = null;
            this.init();
                      
        }
        init() {
            this.initLayout().done(
                () => {
                    this.initNav();
                    this.initLayoutDOM();
                    this.initPageNav();
                    this.initPage();
                    this.initFeedBackModal();
                    this.attachEvents();
                    this.initHistory();
                }
            );
        }
        initLayout() {
            let _this = this;
            let promiseCSS = $.when(WebAPI.get('/static/app/Diagnosis/themes/default/css/inline.css'),WebAPI.get('/static/app/Diagnosis/themes/default/css/overview.css')).done((r1,r2)=>{
                var style = document.createElement("style");
                style.id = "diagnosisInlineStyles";
                if (window.parent.AppConfig.diagnosisFontSize) {
                    var fontSize = window.parent.AppConfig.diagnosisFontSize + 'px';
                    r1[0] = r1[0].replace('font-size: 12px', 'font-size: '+fontSize);
                }
                style.innerHTML = (r1[0]+r2[0]);
                document.head.appendChild(style);
            });
            let promiseHTML =  WebAPI.get('/static/app/Diagnosis/views/diagnosis.html').done(
                result => {
                    _this.container.innerHTML = result;
                }
            );
            return $.when(promiseCSS, promiseHTML);
        }
        initHistory() {
            this.history = new DiagnosisHistory(this);
        }
        initLayoutDOM() {
            this.pageNavCtn = document.querySelector('.pageNavContainer');
            this.pageContainer = document.querySelector('#diagnosisV2PageContainer');
        }
        initNav() {
            let sliderWrap = document.querySelector('#diagnosisV2Sider');
            this.nav = new Nav(sliderWrap,this);
            this.nav.show();
        }
        initPageNav() {
            let pageNav = `<div class="toolBox">
                <style>
                .toolBox .dropdownMenuFeedBack ul{
                    position: absolute;
                    right: auto;
                    top: 30px;
                    margin: auto;
                }
                .diagnosis-v2-header .toolBox .dropdownMenuFeedBack ul li{
                    float: none;
                    padding:auto;
                }
                #dropdownMenuFeedBack{
                    display: flex;
                    align-items: center;
                }
                #dropdownMenuFeedBack .feedbackTool:hover .toolName,#dropdownMenuFeedBack .feedbackTool:hover .iconfont{
                    color: #eee;
                }
                #dropdownMenuFeedBack .feedbackTool{
                    color: #eee;
                    display: flex;
                    align-items: center;
                }
                
                .dropdownMenuFeedBack .dropdownMenuFeedBackLi{
                    line-height: 30px;
                    height: 30px;
                    padding-left: 14px;
                    color: #555;
                    display: flex;
                    align-items: center;
                }
                .dropdownMenuFeedBack .dropdownMenuFeedBackLi:hover{
                    background: #eee;
                }
                </style>
                <div class="dropdown dropdownMenuFeedBack">
                    <div class=" dropdown-toggle" type="button" id="dropdownMenuFeedBack" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        <div class="feedbackTool">
                        <span class="iconfont icon-feedback" style="padding: 0;"></span>
                        <span class="toolName">${I18n.resource.topNav.FEEDBACK}</span>
                        </div>
                    </div>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuFeedBack">
                    <div class="feedBackModalBtn dropdownMenuFeedBackLi feedBackNewBtn">
                        <span class="iconfont icon-tianjia2" style="padding: 0;"></span>
                        <span class="">${I18n.resource.feedbackModal.ADD}</span>
                     </div>
                     <div class="feedBackModalBtn dropdownMenuFeedBackLi feedBackHistoryBtn">
                        <span class="iconfont icon-lishichaxun" style="padding: 0;"></span>
                        <span class="">${I18n.resource.feedbackModal.HISTORY}</span>
                    </div>
                    
                    </ul>
                </div>
               
                <div id="divWorkOrder">
                    <span class="iconfont icon-workorder"></span>
                    <span class="toolName">${I18n.resource.topNav.WORKORDER}</span>
                </div>
                <div id="divAddWork" style="display: none;">
                    <span class="iconfont icon-add"></span>
                    <span class="toolName">${I18n.resource.topNav.ADDTASK}</span>
                </div>
                <div id="divOpt" permission="DiagnosisSet">
                    <span class="iconfont icon-setting"></span>
                    <span class="toolName" style="border: none;">${I18n.resource.topNav.OPTIONS}</span>
                </div>
                <div id="divAction" class="taskButton" style="display: none;">
                    <span class="iconfont icon-peizhi"></span>
                    <span class="toolName">${I18n.resource.topNav.ACTION}</span>
                </div>
                <div id="divSwitchTimeZone" style="display: none">
                    <span class="iconfont .icon-weibiaoti--4"></span>
                    <span class="toolName current_zone" style="border: none;padding-right: 8px; ">${localStorage.getItem('timeZone') === 'projectTimeZone' ?I18n.resource.topNav.PROJECTTIMEZONE : I18n.resource.topNav.LOCALTIMEZONE}</span>
                    <span class="switch_zone" style=" color:#fff;">${'[' + I18n.resource.topNav.SWITCHTIMEZONE + ']'}</span>                      
                </div>
            </div>
            <ul>
                <li class="active" data-class="OverviewPage">${I18n.resource.topNav.OVERVIEW}</li>
                <li data-class="CaseRecord">${I18n.resource.topNav.ARCHIVES}</li>
                <li data-class="HistoryPage">${I18n.resource.topNav.HISTORY}</li>
                <li data-class="Task">${I18n.resource.topNav.TASK}</li>
                <li data-class="Spectrum">${I18n.resource.topNav.SPECTRUM}</li>
                <li data-class="Roi">${I18n.resource.topNav.ROI}</li>
            </ul>`;
            this.pageNavCtn.innerHTML = pageNav;
            I18n.fillArea($(this.pageNavCtn));
        }
       
        initPage() {
            if (sessionStorage.getItem('diagnosisCondition') && sessionStorage.getItem('diagnosisCondition') !== '') {
                var jsonData = JSON.parse(sessionStorage.getItem('diagnosisCondition'));
                $('.diagnosis-v2-header li').removeClass('active');
                $('[data-class="'+jsonData.page+'"]').addClass('active');
                this.page = new Pages[jsonData.page](this.pageContainer, this.conditionModel, this);
                this.page.show();
            } else {
                this.page = new Pages['OverviewPage'](this.pageContainer, this.conditionModel, this);
                this.page.show();
            }
        }
        initFeedBackModal() {
            this.feedBackModal = new FeedBackModal(this);
        }
        show() {

        }
        attachEvents() {
            var _this = this;
            //右侧导航
            $(this.pageNavCtn).off('click').on('click', 'li', function () {
                _this.changePage(this);
                _this.page.show();
            });

            $('#divOpt').off('click').on('click', function () {
                
            });
    
            $('#divSwitchTimeZone .switch_zone').off('click').on('click', function () {
                var timeZone = AppConfig.userConfig.zone||window.localStorage.getItem('timeZone')
                var currentZone;
                
                if( timeZone !== 'localTimeZone' ) {
                    currentZone = 'localTimeZone';
                } else {
                    currentZone = 'projectTimeZone';
                }
                WebAPI.post('/setUserConfig',{
                    userId:AppConfig.userId,
                    option:{
                        'zone':currentZone
                    }
                }).done(function(rs){
                    if(rs.state){
                        AppConfig.userConfig.zone = currentZone;
                        window.localStorage.setItem('timeZone', currentZone);
                        location.reload();
                    }
                });
            });

            $('#divWorkOrder').off('click').on('click', function () {
                if (typeof _this.page.getWorkOrderData !== 'function') {
                    // 跳转到主网站工单页面的“新版诊断工单组”
                    window.open('/observer#page=workflow&type=transaction&subType=taskGroup&id=5982f19c833c970a75e7a6da&taskPage=1');
                    return;
                }
                var data = _this.page.getWorkOrderData();
                if (!data ||  data.length === 0) {
                    // 跳转到主网站工单页面的“新版诊断工单组”
                    window.open('/observer#page=workflow&type=transaction&subType=taskGroup&id=5982f19c833c970a75e7a6da&taskPage=1');
                    return;
                }
                Spinner.spin(_this.container);
                data.lang = I18n.type;
                WebAPI.post("/diagnosis_v2/getWorkOrderInfo", data).done(function(result){
                    if(result.status === "OK"){
                        var data = result.data;                       
                        _this.WorkOrderModal = new WorkOrderModal(data);
                        _this.WorkOrderModal.show();
                    } else {
                        alert("The failure information is incorrect!");
                    }                    
                }).always(function(){
                    Spinner.stop();
                })              
            });

            //左侧导航
            $('.feedBackNewBtn').off('click').on('click',function(e){
                let workOrderType = window.CAPTURE_INSTANCES.length>0?window.CAPTURE_INSTANCES[0].captureType:'blank';
                _this.feedBackModal.show('workOrder', true, workOrderType);
            });
            $('.feedBackHistoryBtn').off('click').on('click',function(e){
                let workOrderType = window.CAPTURE_INSTANCES.length>0?window.CAPTURE_INSTANCES[0].captureType:'overview';
                _this.feedBackModal.show('history', true, 'overview');
            })
            // $('.feedBackModalBtn').off('click').on('click',function(e){
            //     let type = window.CAPTURE_INSTANCES.length>0?'workOrder':'history';
            //     let workOrderType = window.CAPTURE_INSTANCES.length>0?window.CAPTURE_INSTANCES[0].captureType:'overview';
            //     _this.feedBackModal.show(type, true, workOrderType);
            // });
            // options 按钮 点击事件
            $('#divOpt').off('click').on('click', function () {
                $('#diagnosisV2Sider .allBtn').trigger('click');
            })
        }
        close() {
            // 清除 css
            let styleNode = document.querySelector('#diagnosisInlineStyles');
            styleNode.parentNode.removeChild(styleNode);

            this.container.innerHTML = '';
        }
        changePage(dom, isNeedUpdate = true) {
            $(this.pageNavCtn).find('li').removeClass('active');
            $(dom).addClass('active');
            $(this.pageContainer).html('');
            this.page && this.page.close();
            //清掉上个页面的筛选条件
            if (isNeedUpdate) {
                if (!AppConfig.fromHomeJump){
                    this.conditionModel.update({ 'activeEntities': [], 'activeAllEntities': [],'activeFaults': [],'activeCategories': [],'searchKey': ''});
                }
            }
            AppConfig['fromHomeJump'] = false;
            if($(dom).attr('data-class') == 'OverviewPage'){
                this.history.clear();
                $('.diagnosis-v2-header ul li.backBtn').remove();
            }
            if($(dom).attr('data-class') == 'HistoryPage'){
                $('#fault').hide();
                $('#structure').height('100%');
            }else{
                $('#structure').height('60%');
                $('#fault').show();
            }                

            this.page = new Pages[$(dom).attr('data-class')](this.pageContainer, this.conditionModel, this);
        }
        setBack() {
            let _this = this;
            this.history.push(document.querySelector('.diagnosis-v2-header ul .active').dataset.class);
            if($('.diagnosis-v2-header ul li.backBtn').length == 0){
                let $back = $(`<li class="backBtn">${I18n.resource.topNav.BACK}</li>`);
                $back.off('click').on('click',function(e){
                    e.stopPropagation()
                    _this.history.back();
                    $(this).remove();
                });
                $('.diagnosis-v2-header ul').prepend($back);
            }
        }
        gotoHistory(newValues = {}, fn = ()=>{}) {
            if(this.page instanceof Pages['OverviewPage']){
                this.changePage(document.querySelector('#diagnosisV2Detail [data-class="HistoryPage"]'), false);
                let activeEntities = this.conditionModel.activeEntities(),
                    activeAllEntities = this.conditionModel.activeAllEntities(),
                    activeFaults = this.conditionModel.activeFaults(),
                    activeCategories = this.conditionModel.activeCategories();
                let values = {activeEntities, activeAllEntities,activeFaults,activeCategories};
                $.extend(values, newValues, fn());
                this.conditionModel.update(values);
                this.page.show();
            }else{
                for(let key in newValues){
                    this.conditionModel[key](newValues[key]);
                }
            }
        }
     

    }

    exports.Diagnosis = Diagnosis;
} ( namespace('diagnosis'), namespace('diagnosis.Pages'), namespace('diagnosis.Pages.nav.Nav'), namespace('diagnosis.components.FeedBackModal'), namespace('diagnosis.components.WorkOrderModal') ));


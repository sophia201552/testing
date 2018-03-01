// diagnosis.js - disgnosis 入口

;(function (exports, Pages, Nav, FeedBackModal) {

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
                }
            );
        }
        initLayout() {
            let _this = this;
            let promiseCSS = $.when(WebAPI.get('/static/app/Diagnosis/themes/default/css/inline.css'),WebAPI.get('/static/app/Diagnosis/themes/default/css/overview.css')).done((r1,r2)=>{
                var style = document.createElement("style");
                    style.id="diagnosisInlineStyles";
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
                <div class="feedBackModalBtn">
                    <span class="iconfont icon-feedback" style="padding: 0;"></span>
                    <span class="toolName">${I18n.resource.topNav.FEEDBACK}</span>
                </div>
                <div id="divWorkOrder">
                    <span class="iconfont icon-workorder"></span>
                    <span class="toolName">${I18n.resource.topNav.WORKORDER}</span>
                </div>
                <div id="divOpt">
                    <span class="iconfont icon-setting"></span>
                    <span class="toolName" style="border: none;">${I18n.resource.topNav.OPTIONS}</span>
                </div>
            </div>
            <ul>
                <li class="active" data-class="OverviewPage">${I18n.resource.topNav.OVERVIEW}</li>
                <li data-class="HistoryPage">${I18n.resource.topNav.HISTORY}</li>
                <li data-class="Spectrum">${I18n.resource.topNav.SPECTRUM}</li>
                <li data-class="Roi">${I18n.resource.topNav.ROI}</li>
            </ul>`;
            this.pageNavCtn.innerHTML = pageNav;
        }
        initPage() {
            this.page = new Pages['OverviewPage'](this.pageContainer, this.conditionModel, this);
            this.page.show();
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

            $('#divWorkOrder').off('click').on('click', function () {
                if (typeof _this.page.getWorkOrderData !== 'function') {
                    // 跳转到主网站工单页面的“新版诊断工单组”
                    window.open('/observer#page=workflow&type=transaction&subType=taskGroup&id=5982f19c833c970a75e7a6da&taskPage=1');
                    return;
                }
                var data = _this.page.getWorkOrderData();
                if (!data) {
                    // 跳转到主网站工单页面的“新版诊断工单组”
                    window.open('/observer#page=workflow&type=transaction&subType=taskGroup&id=5982f19c833c970a75e7a6da&taskPage=1');
                    return;
                }
                WebAPI.post("/diagnosis_v2/getWorkOrderInfo", data).done(function(result){
                    if(result.status === "OK"){
                        var data = result.data[0];
                        var time = new Date(data.time);
                        var wiInstance = new WorkflowInsert({
                            zone: data.entityParentName,
                            equipmentName: data.entityName,
                            noticeId: '',
                            title: data.faultName,
                            detail: data.description,
                            dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'), //结束时间为两天后
                            critical: 2,
                            projectId: AppConfig.projectId,
                            chartPointList: data.points.map(function (row) { return row.name+','+row.description; }).join('|'),
                            chartQueryCircle: 'm5',
                            description: data.entityName + ' ' + data.entityParentName + ':' + data.description,
                            arrayEquipment: null,
                            name: data.faultName + '(' + data.description + ')',
                            time: time.format('yyyy-MM-dd HH:mm:ss'),
                            chartStartTime: new Date(time.getTime() - 43200000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天12 * 60 * 60 * 1000
                            chartEndTime: new Date(time.getTime() + 43200000).format('yyyy-MM-dd HH:mm:ss') //报警发生后半天12 * 60 * 60 * 1000
                        });
                        wiInstance.show().submitSuccess(function(taskModelInfo, uploadFiles) {
                            this.close();
                        }).cancel(function() {

                        }).fail(function() {
                        
                        });
                    } else {
                        alert("The failure information is incorrect!");
                    }                    
                })                
            });

            //左侧导航
            $('.feedBackModalBtn').off('click').on('click',function(e){
                let type = window.CAPTURE_INSTANCES.length>0?'workOrder':'history';
                let workOrderType = window.CAPTURE_INSTANCES.length>0?window.CAPTURE_INSTANCES[0].captureType:'overview';
                _this.feedBackModal.show(type, true, workOrderType);
            });
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
        changePage(dom) {
            $(this.pageNavCtn).find('li').removeClass('active');
            $(dom).addClass('active');
            $(this.pageContainer).html('');
            this.page && this.page.close();
            //清掉上个页面的筛选条件
            this.conditionModel.update({ 'activeEntities': [], 'activeAllEntities': [],'activeFaults': [],'activeCategories': [],'searchKey': ''});
            this.page = new Pages[$(dom).attr('data-class')](this.pageContainer, this.conditionModel, this);
        }
    }

    exports.Diagnosis = Diagnosis;
} ( namespace('diagnosis'), namespace('diagnosis.Pages'), namespace('diagnosis.Pages.nav.Nav'), namespace('diagnosis.components.FeedBackModal') ));

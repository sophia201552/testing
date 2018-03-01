class PlatformGuide {
    constructor() {
        this.projectId = AppConfig.projectId;
        this.opt = AppDriver;
        this.container = undefined;

    }
    show() {
        WebAPI.get('/static/app/Platform/views/module/platformGuide.html').done(rsHtml => {
            this.container = $('#indexMain');
            this.container.html('').append(rsHtml);
            I18n.fillArea(this.container);
            this.init();
            this.attachEvent();
        }).always(function () {
            I18n.fillArea($('.flatPanel'));
        });

    };
    init() {

    };

    attachEvent() {
        var _this = this;
        var target_link = {
            0: "/observer#page=ModBusInterface&projectId=",
            1: "/observer#page=PointManagerCloudPoint&pointType=0&projectId=",
            2: "/strategyV2?projectId=",
            3: "/factory",
            4: "/diagnosis_v2?projectId=",
            5: "/observer#page=AnalysisScreen",
            6: "/observer#page=PointManagerRealTimeData&projectId=",
            7: "/observer#page=workflow&type=%22team%22&projectId="
        }
        var factory=AppConfig.permission.CPage?AppConfig.permission.DPage?AppConfig.permission.Epage?1:0:0:0;
        if(factory!=1){
            $('.checkboxRow').each(function(e){
                var tran_num = $(this).attr('data-type');
                if(tran_num==3){
                    $(this).addClass('removeClick');
                    $(this).find('.checkboxPanel').addClass('removeClick');
                    $(this).find('.introduction').addClass('removeClick');
                    $(this).find('.projectTitleSpan').addClass('removeClickColor')
                }
            })
        }
        $('.checkboxRow,.panelNameTitleContainer').off('click').on('click', function (e) {
            // let href = $(this).attr('href');
            // let projectId = $(this).attr('data-project');
            // localStorage.setItem('indexToFactoryId',projectId);
            // window.open(href);
            var projectId = _this.projectId ? _this.projectId : '';
            var tran_num = e.currentTarget.dataset.type;
            var target_url = window.location.origin + target_link[tran_num];
            if(!projectId){
                return;
            }
            if (tran_num != 3&&tran_num !=5) {
                target_url += projectId;
            }
            if(tran_num==3&&AppConfig.permission){
                var factory=AppConfig.permission.CPage?AppConfig.permission.DPage?AppConfig.permission.Epage?1:0:0:0;
                if(factory!=1){
                    // alert(i18n_resource.platform_app.extend_tip.PERMISSION_FACTORY)
                  return
                }
            }
            if(tran_num == 3||tran_num == 2){
                localStorage.setItem('indexToFactoryId', projectId);
            }
            window.open(target_url, '_blank');            
            return false;
        });
        
    }

    destory() {
        this.opt = null;
        this.container = null;
    }
}
window.PlatformGuide = PlatformGuide;
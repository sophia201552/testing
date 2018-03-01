/**
 * Created by win7 on 2015/10/20.
 */
var ProjectSummary = (function () {
    var _this;
    function ProjectSummary(option) {
        _this = this;
        this.isFromProjLs = false;
        if(option) {
            if (option.id) {
                ProjectConfig.projectId = option.id;
                for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                    if (ProjectConfig.projectList[i].id == option.id) {
                        ProjectConfig.projectInfo = ProjectConfig.projectList[i];
                        ProjectConfig.projectIndex = i;
                        break;
                    }
                }
            }
            if (option.index > -1) {
                ProjectConfig.projectId = ProjectConfig.projectList[option.index].id;
                ProjectConfig.projectInfo = ProjectConfig.projectList[option.index];
                ProjectConfig.projectIndex = option.index;
            }
            this.isFromProjLs = option.isFromProjLs?option.isFromProjLs:false;
        }

    }
    ProjectSummary.navOptions = {
        top:
        '<span id="btnProjectMap" class="topNavLeft topTool" aria-hidden="true"><span id="iconMap" class="btnIcon"></span>' +
        '<span id="projName" class="topTip"></span></span>'+
        '<span id="dashboardName" class="topNavTitle"></span>',
        bottom: true,
        backDisable: true,
        module: 'project'
    };
    ProjectSummary.prototype = {
        show: function () {
            $('.navTool .selected').removeClass('selected');
            $('#btnProject').addClass('selected');
            _this.init();
            _this.initNav();
            localStorage.setItem('defaultProjectId', ProjectConfig.projectId);
            localStorage.setItem('module', 'project');
        },
        init:function(){
            if(ProjectConfig.dashboardList && ProjectConfig.dashboardList[0] && !_this.isFromProjLs){
                ScreenManager.show(ProjectDashboard,
                    {
                        screen: _this,
                        menuId: ProjectConfig.dashboardList[0].id,
                        name: ProjectConfig.dashboardList[0].text,
                        isIndex: true
                    }
                )
            }else {
                SpinnerControl.show();
                WebAPI.get("/get_plant_pagedetails/" + ProjectConfig.projectId + "/" + AppConfig.userId).done(function (resultData) {
                    if (resultData.navItems && resultData.navItems.length > 0) {
                        ProjectConfig.dashboardList = resultData.navItems.filter(function (ele) {
                            return ele.type === "EnergyScreen_M"
                        });
                        if (ProjectConfig.dashboardList.length == 0) {
                            //new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.project.DASHBOARD_ERR).show().close();
                            window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.DASHBOARD_ERR, 'short', 'center');
                            SpinnerControl.hide();
                            router.to({
                                typeClass: ProjectList
                            });
                            return;
                        }
                        ProjectConfig.dashboardId = ProjectConfig.dashboardList[0].id;
                        //router.to({
                        //    typeClass:ProjectDashboard,
                        //    data:{
                        //        screen:_this,
                        //        menuId:ProjectConfig.dashboardList[0].id,
                        //        name:ProjectConfig.dashboardList[0].text,
                        //        isIndex:true
                        //    }
                        //});
                        ScreenManager.show(ProjectDashboard,
                            {
                                screen: _this,
                                menuId: ProjectConfig.dashboardList[0].id,
                                name: ProjectConfig.dashboardList[0].text,
                                isIndex: true
                            }
                        )
                    } else {
                        //new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.project.DASHBOARD_ERR).show().close();
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.DASHBOARD_ERR, 'short', 'center');
                        SpinnerControl.hide();
                    }
                }).fail(function () {
                    SpinnerControl.hide();
                });
            }
        },
        initNav:function(){
            $('#btnProjectMap').off('touchstart').on('touchstart', function () {
                router.to({
                    typeClass: ProjectList,
                    data: {}
                })
            })
        },
        close: function () {
        }
    };
    return ProjectSummary;
})();
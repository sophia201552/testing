/**
 * Created by win7 on 2015/10/20.
 */
var ProjectSummary = (function() {
    var _this;

    function ProjectSummary(option) {
        _this = this;
        this.isFromProjLs = false;
        if (option) {
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
            this.isFromProjLs = option.isFromProjLs ? option.isFromProjLs : false;
        }

    }
    ProjectSummary.navOptions = {
        top: '<span id="btnProjectMap" class="navTopItem left icon iconfont icon-gengduo" aria-hidden="true"></span>' +
            '<div class="navTopItem middle title"><span id="dashboardName" style="display:none;"></span><span id="projName" style="display:block;"></span></span></div>' +
            '<span id="btnAdminConfig"></span>',
        bottom: true,
        backDisable: true,
        module: 'project'
    };
    ProjectSummary.prototype = {
        show: function() {
            localStorage.setItem('defaultProject', JSON.stringify(ProjectConfig.projectInfo));
            localStorage.setItem('defaultProjectId', ProjectConfig.projectId);
            _this.init();
            _this.initNav();
        },
        init: function() {
            var msg = [];
            try {
                msg = JSON.parse(localStorage.getItem('pushReport')).filter(function(item) { return item.projectId == ProjectConfig.projectId });
                if (!msg) msg = [];
            } catch (e) {
                msg = [];
            }
            if (msg.length == 0) {
                $('#btnReport .pushTip').text(0).hide();
            } else {
                $('#btnReport .pushTip').text(msg.length > 99 ? '99+' : msg.length).show();
            }
            if (ProjectConfig.dashboardList && ProjectConfig.dashboardList[0] && !_this.isFromProjLs) {
                ScreenManager.show(ProjectDashboard, {
                    screen: _this,
                    menuId: ProjectConfig.dashboardList[0].id,
                    name: ProjectConfig.dashboardList[0].text,
                    isIndex: true
                })
            } else {

                SpinnerControl.show();
                WebAPI.get("/get_plant_pagedetails/" + ProjectConfig.projectId + "/" + AppConfig.userId + "/" + AppConfig.language).done(function(resultData) {
                    if (resultData.navItems && resultData.navItems.length > 0) {
                        ProjectConfig.dashboardList = resultData.navItems.filter(function(ele) {
                            return ele.type === "EnergyScreen_M"
                        });
                        if (ProjectConfig.dashboardList.length == 0) {
                            //new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.project.DASHBOARD_ERR).show().close();
                            //window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.DASHBOARD_ERR, 'short', 'center');
                            SpinnerControl.hide();
                            // router.to({
                            //     typeClass: ProjectList
                            // });
                            $('#btnAdminConfig').html('<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com' + AppConfig.userProfile.picture + '">');
                            var language = localStorage.getItem('language');
                            if (language == 'en') {
                                document.getElementById('projName').innerHTML = ProjectConfig.projectInfo.name_english;
                            } else if (language = 'zh') {
                                document.getElementById('projName').innerHTML = ProjectConfig.projectInfo.name_cn;
                            } else {
                                if (navigator && navigator.language && navigator.language.split('-')[0] == 'en') {
                                    document.getElementById('projName').innerHTML = ProjectConfig.projectInfo.name_english;
                                } else {
                                    document.getElementById('projName').innerHTML = ProjectConfig.projectInfo.name_cn;
                                }
                            }
                            ElScreenContainer.innerHTML = '<span style="display:inline-block;margin-top:10px;padding:0.75rem;font-size:1.4rem;color:white">' + I18n.resource.appDashboard.project.NO_DASHBOARD_TIP + '</span>'
                            $('#btnAdminConfig').off('touchstart').on('touchstart', function(e) {
                                var adminConfigNew = new AdminConfigNew();
                                adminConfigNew.show();
                            });
                            return;
                        }
                        //为了避免dashboardList.length == 0的时候, 头部会出现 btnProjectMap和头像
                        // $('#btnProjectMap').css({display: 'inline-flex'});
                        $('#btnAdminConfig').html('<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com' + AppConfig.userProfile.picture + '">');

                        ProjectConfig.dashboardId = ProjectConfig.dashboardList[0].id;
                        ScreenManager.show(ProjectDashboard, {
                            screen: _this,
                            menuId: ProjectConfig.dashboardList[0].id,
                            name: ProjectConfig.dashboardList[0].text,
                            isIndex: true
                        })
                    } else {
                        //new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.project.DASHBOARD_ERR).show().close();
                        //window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.DASHBOARD_ERR, 'short', 'center');
                        $('#btnAdminConfig').html('<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com' + AppConfig.userProfile.picture + '">');
                        var language = AppConfig.language;
                        if (language == 'en') {
                            document.getElementById('projName').innerHTML = ProjectConfig.projectInfo.name_english;
                        } else if (language = 'zh') {
                            document.getElementById('projName').innerHTML = ProjectConfig.projectInfo.name_cn;
                        } else {
                            if (navigator && navigator.language && navigator.language.split('-')[0] == 'en') {
                                document.getElementById('projName').innerHTML = ProjectConfig.projectInfo.name_english;
                            } else {
                                document.getElementById('projName').innerHTML = ProjectConfig.projectInfo.name_cn;
                            }
                        }
                        ElScreenContainer.innerHTML = '<span style="display:inline-block;margin-top:10px;padding:0.75rem;font-size:1.4rem;color:white">' + I18n.resource.appDashboard.project.NO_DASHBOARD_TIP + '</span>'
                        $('#btnAdminConfig').off('touchstart').on('touchstart', function(e) {
                            var adminConfigNew = new AdminConfigNew();
                            adminConfigNew.show();
                        });
                        SpinnerControl.hide();
                    }
                }).fail(function() {
                    SpinnerControl.hide();
                });
            }
        },
        initNav: function() {
            $('#btnProjectMap').off('touchstart').on('touchstart', function() {
                router.to({
                    typeClass: ProjectList,
                    data: {}
                })
            });
        },
        close: function() {}
    };
    return ProjectSummary;
})();
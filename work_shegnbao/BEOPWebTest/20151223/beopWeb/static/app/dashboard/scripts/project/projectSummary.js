/**
 * Created by win7 on 2015/10/20.
 */
var ProjectSummary = (function () {
    var _this;
    function ProjectSummary(data) {
        _this = this;
        if (data && data.id) {
            ProjectConfig.projectId = data.id;
            for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                if (ProjectConfig.projectList[i].id == data.id) {
                    ProjectConfig.projectInfo = ProjectConfig.projectList[i];
                    ProjectConfig.projectIndex = i;
                    break;
                }
            }
        }
        if (data && data.index > -1) {
            ProjectConfig.projectId = ProjectConfig.projectList[data.index].id;
            ProjectConfig.projectInfo = ProjectConfig.projectList[data.index];
            ProjectConfig.projectIndex = data.index;
        }
    }
    ProjectSummary.navOptions = {
        top: '',
        bottom: true,
        backDisable: true,
        module: 'project'
    };
    ProjectSummary.prototype = {
        show: function () {
            $('.navTool .selected').removeClass('selected');
            $('#btnProject').addClass('selected');
            _this.init();
            localStorage.setItem('defaultProjectId', ProjectConfig.projectId);
            localStorage.setItem('module', 'project');
        },
        init:function(){
            SpinnerControl.show();
            WebAPI.get("/get_plant_pagedetails/" + ProjectConfig.projectId + "/" + AppConfig.userId).done(function(resultData){
                if (resultData.navItems && resultData.navItems.length > 0) {
                    ProjectConfig.dashboardList = resultData.navItems.filter(function(ele){
                        return ele.type === "EnergyScreen_M"
                    });
                    ProjectConfig.dashboardId = ProjectConfig.dashboardList[0].id;
                    router.to({
                        typeClass:ProjectDashboard,
                        data:{
                            screen:_this,
                            menuId:ProjectConfig.dashboardList[0].id,
                            name:ProjectConfig.dashboardList[0].text
                        }
                    });
                }else{
                    new Alert($(AlertContainer), "danger", '未搜索到Dashboard，请重新选择项目！').show().close();
                    SpinnerControl.hide();
                }
            }).fail(function(){
                SpinnerControl.hide();
            });
        },

        initTopNav: function () {
            $('#btnProjectMap').off('touchstart').on('touchstart', function () {
                router.to({
                    typeClass: ProjectMap,
                    data: {}
                })
            })
        },
        close: function () {
        }
    };
    return ProjectSummary;
})();
/**
 * Created by win7 on 2015/10/20.
 */
var ProjectList = (function(){
    var _this;
    function ProjectList(){
        _this = this;
    }
    ProjectList.navOptions = {
        top: '<span id="btnProjectMap" class="topNavLeft topTool zepto-ev" aria-hidden="true"><span id="iconMap" class="btnIcon"></span></span>',
        bottom:true,
        backDisable:false,
        module:'project'
    };
    ProjectList.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/project/projectList.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                $('.navTool .selected').removeClass('selected');
                $('#btnProject').addClass('selected');
                _this.init();
                _this.initProjectDisplay();

            });
        },
        init:function(){
            _this.initTopNav();
            var $ulProjectList = $('#ulProjectList');
            var strLiProject = new StringBuilder();
            for (var i = 0; i < ProjectConfig.projectList.length; ++i){
                strLiProject = new StringBuilder();
                strLiProject.append('<div class="liProject zepto-ev" id="proj_' + ProjectConfig.projectList[i].id +'">');
                strLiProject.append('   <div class="projectIcon"><img src="http://images.rnbtech.com.hk/static/images/project_img/'+ ProjectConfig.projectList[i].pic +'"></div>');
                if (ProjectConfig.projectList[i].id == ProjectConfig.projectId){
                    strLiProject.append('   <div class="iconSelect"><span class="glyphicon glyphicon-ok-circle"></span></div>');
                }
                strLiProject.append('   <div class="projectName">' + ProjectConfig.projectList[i].name_cn + '</div>');
                strLiProject.append('   <div class="projectInfo">' + ProjectConfig.projectList[i].address + '</div>');
                strLiProject.append('</div>');
                $ulProjectList.append(strLiProject.toString());
            }
        },
        initProjectDisplay:function(){
            $('.liProject').off('tap').on('tap',function(e){
                ProjectConfig.projectId = $(e.currentTarget).attr('id').match(/\d+/)[0];
                for (var i = 0;i < ProjectConfig.projectList.length;i++){
                    if (ProjectConfig.projectId == ProjectConfig.projectList[i].id){
                        ProjectConfig.projectInfo = ProjectConfig.projectList[i];
                        ProjectConfig.projectIndex = i;
                    }
                }
                router.to({
                    typeClass:ProjectSummary
                })
            })
        },
        initTopNav: function () {
            $('#btnProjectMap').off('touchstart').on('touchstart', function () {
                router.to({
                    typeClass: ProjectMap,
                    data: {}
                })
            })
        },
        close:function(){
        }
    };
    return ProjectList;
})();
/**
 * Created by win7 on 2015/10/20.
 */
var ProjectMap = (function(){
    var _this;
    function ProjectMap(){
        _this = this;
    }
    ProjectMap.navOptions = {
        top: '<div class="topNavInput" ><input id="projectSearch" type="text"></div>' +
        '<div id="btnProjectList" class="topNavRight glyphicon glyphicon-list"></div>',
        bottom:true,
        backDisable:false,
        module:'project'
    };
    ProjectMap.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/project/projectMap.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                var map = new beop.getMapInstance();
                map.load();
                _this.init()
            })
        },
        init:function(){
            _this.initTopNav();
        },
        initTopNav:function(){
            $('#btnProjectList').off('touchstart').on('touchstart',function(e){
                router.to({
                    typeClass:ProjectList,
                    data:{}
                })
            });
        },
        close:function(){

        }
    };

    return ProjectMap;
})();
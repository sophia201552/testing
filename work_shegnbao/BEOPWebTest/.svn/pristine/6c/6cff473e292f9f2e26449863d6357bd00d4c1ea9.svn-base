/**
 * Created by win7 on 2015/10/27.
 */
var WorkflowAdd = (function(){
    var _this;
    function WorkflowAdd(){
        _this = this;
    }
    WorkflowAdd.navOptions = {
        top: '<div class="topNavTitle">新建工单</div>',
        bottom:false,
        backDisable:false,
        module:'workflow'
    };
    WorkflowAdd.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/workflow/workflowAdd.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                _this.init();
            });
        },
        init:function(){
            _this.initUploadImg();
            _this.initTransactor();
            _this.initTeam();
        },
        initUploadImg:function(){
            var $inputWkImg = $('#inputWkImg');
            $('#spanWkImg').hammer().off('tap').on('tap',function(e){
                e.stopPropagation();
                $inputWkImg.trigger('click');
            });
            var file,fileType,reader,strDivWkImg;
            fileType = /image*/;
            $inputWkImg.off('change').on('change',function(e){
                file = e.currentTarget.files[0];
                if (!file.type.match(fileType)) {
                    return;
                }
                reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    strDivWkImg = new StringBuilder();
                    strDivWkImg.append('<div class="divWkImg">');
                    strDivWkImg.append('    <img class="imgWkImg" src=" + e.target.result + ">');
                    strDivWkImg.append('    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
                    strDivWkImg.append('</div>')
                };
            });
            $('wkImg').off('touchstart').on('touchstart','.imgWkImg',function(){
                $(e.currentTarget).parent().remove();
            });
        },
        initTransactor:function(){

        },
        initTeam:function(){

        },
        close:function(){

        }
    };
    return WorkflowAdd;
})();
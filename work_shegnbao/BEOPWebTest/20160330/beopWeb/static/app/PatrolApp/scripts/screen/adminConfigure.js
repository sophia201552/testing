/**
 * Created by win7 on 2016/3/3.
 */
var AdminConfigure = (function(){
    var _this;
    function AdminConfigure(){
        _this = this;
    }
    AdminConfigure.navOptions = {
        top:
        '<span class="topNavTitle">配置</span>',
        bottom: true,
        backDisable: true,
        module: 'project'
    };
    AdminConfigure.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/adminConfigure.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initBtnToggle();
        },
        initBtnToggle:function(){
            $('.btnToggle').on('tap',function(e){
                if ($(e.currentTarget).hasClass('off')){
                    $(e.currentTarget).removeClass('off').addClass('on')
                }else{
                    $(e.currentTarget).removeClass('on').addClass('off')
                }
            })
        }
    };
    return AdminConfigure;
})();
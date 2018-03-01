/**
 * Created by win7 on 2015/11/4.
 */
var AdminConfig = (function(){
    var _this;
    function AdminConfig(){
        _this = this;
    }
    AdminConfig.navOptions = {
        top:
        '<div class="topNavTitle">消息中心</div>',
        bottom:true,
        backDisable:true,
        module:'admin'
    };
    AdminConfig.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/admin/adminConfig.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                _this.init();
                _this.initLogout();
            });
        },
        init:function(){
            _this.initToggle();
        },
        initToggle:function(){
            $('.btnToggle').hammer().off('tap').on('tap',function(e){
                if ($(e.currentTarget).hasClass('btnOn')){
                    $(e.currentTarget).removeClass('btnOn');
                }else{
                    $(e.currentTarget).addClass('btnOn');
                }
            });
        },
        initLogout:function(){
            localStorage.clear('userInfo');
            router.empty.to({
                typeClass:IndexScreen
            })
        },
        close:function(){

        }
    };
    return AdminConfig;
})();
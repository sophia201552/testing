/**
 * Created by win7 on 2015/11/22.
 */
var AdminConfigNew = (function(){
    var _this;
    function AdminConfigNew(){
        _this = this;
    }
    AdminConfigNew.prototype = {
        show:function(){
            if($('.adminConfig').length === 0){
               var adminConfig = '<div class="adminConfig configHide"></div><div class="adminConfigMask"></div>';
                $("body").append(adminConfig);
            }
            this.init();
            $('.adminConfigMask').fadeIn(200);
            var timer = setTimeout(function(){
                $('.configHide').removeClass('configHide');
                timer = null;
            }, 160);
        },
        init:function(){
            var _this = this;
            $.ajax({url:'static/app/dashboard/views/admin/adminConfigNew.html'}).done(function(resultHTML){
                $(".adminConfig").html(resultHTML);
                var unserInfo = '<div>\
                                    <div class="headPic">\
                                        <img src="http://images.rnbtech.com.hk'+AppConfig.userProfile.picture+'" width="100%" height="100%">\
                                    </div>\
                                </div>\
                                <span>'+AppConfig.userProfile.fullname+'</span>\
                                <span>'+AppConfig.userProfile.name+'</span>';
                $(".adminConfigContainer .userInfo").html(unserInfo);
               
                var configLis = '<li class="messageCenter">\
                                    <span i18n="appDashboard.message.MESSAGE_CENTER"></span>\
                                </li>\
                                <li class="changeLanguage">\
                                    <span i18n="appDashboard.apply.LANG"></span>\
                                    <span class="activeInfo lang"></span>\
                                </li>\
                                <li>\
                                    <span i18n="appDashboard.apply.EDITION_CHECK"></span>\
                                    <span class="activeInfo">'+AppConfig.version+'</span>\
                                </li>';
                $(".config ul").append(configLis);

                _this.initLanguage();
                _this.initMessage();
                _this.initLogout();
                _this.attachEvent();

                I18n.fillArea($('#navTop'));
                I18n.fillArea($('.adminConfigContainer'));
            });
        },
        initLanguage:function(){
            var lang = AppConfig.language?AppConfig.language:'zh';
            $('.lang').text(_this.setLangShow(lang));
            $('.changeLanguage').off('touchstart').on('touchstart',function(){
                AppConfig.language = ('zh' == AppConfig.language) ? 'en' : 'zh';
                localStorage["language"] = AppConfig.language;
                $('.lang').text(_this.setLangShow(AppConfig.language));

                InitI18nResource(AppConfig.language,true).always(function (rs) {
                    I18n = new Internationalization(null, rs);
                    _this.setLangConfig(lang)
                });
            });
        },
        setLangConfig:function(lang){
            localStorage["language"] = AppConfig.language;
            localStorage["i18n"] = JSON.stringify(i18n_resource);

            I18n.fillArea($("#navBottom"));
            I18n.fillArea($("#navTop"));
            I18n.fillArea($('.adminConfigContainer'));
            //切换项目列表的中英文
            var projectList = new ProjectList();
            projectList.show();
        },
        setLangShow:function(flag){
            return ('zh' == flag) ? '中文' : 'English';
        },
        initMessage:function(){
            $('.messageCenter').off('touchstart').on('touchstart', function(e) {
                _this.close();
                var msg;
                try {
                    msg = JSON.parse(localStorage.getItem('pushMsg'));
                    msg = msg.filter(function(item){
                        return item.type=='message'
                    });
                }catch(e){
                    msg = [];
                }
                router.to({
                    typeClass:MessagePush,
                    data:msg
                })
                e.preventDefault();
                e.stopPropagation();
            });
        },
        initLogout:function(){
            var _this = this;
            $('#btnLogout').off('touchstart').on('touchstart',function(e){
                infoBox.confirm(I18n.resource.appDashboard.apply.CONFIRM_LOGOUT,function(){
                    localStorage.clear();
                    AppConfig.isMobile = true;
                    $('.messageNum').text(0).hide();
                    Push.setAlias();
                    router.empty().to({
                        typeClass:IndexScreen
                    })
                })
                _this.close();
                e.preventDefault();
                e.stopPropagation();
            });
        },
        close:function(){
            $(".adminConfig").remove();
            $(".adminConfigMask").remove();
        },
        attachEvent: function(){
            $('.adminConfig .headPic, .adminConfigMask').on('touchstart', function(e){
                var adminConfig = $('.adminConfig');
                var adminConfigMask = $('.adminConfigMask');
                $(adminConfig).addClass('configHide');
                $(adminConfigMask).fadeOut(300);
                var timer = setTimeout(function(){
                    $(adminConfig).remove();
                    $(adminConfigMask).remove();
                    timer = null;
                }, 400);
                e.preventDefault();
                e.stopPropagation();
            });
        }
    };
    return AdminConfigNew;
})();
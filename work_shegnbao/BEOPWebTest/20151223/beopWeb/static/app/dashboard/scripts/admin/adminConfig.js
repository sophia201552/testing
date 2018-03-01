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
        '<div class="topNavTitle" i18n="appDashboard.apply.APPLY_CONFIG"></div>',
        bottom:true,
        backDisable:true,
        module:'admin'
    };
    AdminConfig.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/admin/adminConfig.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                _this.init();
                _this.initLang();
                _this.initLogout();
                _this.initAdmin();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('.divAdminConfig'));
            });
        },
        init:function(){
            _this.initToggle();
        },
        initToggle:function(){
            $('.btnToggle').off('tap').on('tap',function(e){
                if ($(e.currentTarget).hasClass('btnOn')){
                    $(e.currentTarget).removeClass('btnOn').addClass('btnOff');
                }else{
                    $(e.currentTarget).removeClass('btnOff').addClass('btnOn');
                }
            });
        },
        initLang:function(){
                   var lang = localStorage["language"]?localStorage["language"]:'zh';
            $('#spanLangShow').text(_this.setLangShow(lang));
            $('#btnLang').off('tap').on('tap',function(){
                var tapThis = this;
                var lang = localStorage["isUserSelectedLanguage"];
                lang = ('zh' == lang) ? 'en' : 'zh';
                localStorage["isUserSelectedLanguage"] = lang;

                $.getScript("static/views/js/i18n/" + lang + ".js")
                    .done(function (e) {
                        _this.setLangConfig(lang);
                    })
                    .error(function (e) {
                        if (!localStorage["i18n"]) {
                            $.getScript("static/views/js/i18n/zh.js").done(function (e) {
                                _this.setLangConfig('zh');
                            })
                        }
                    });
            });
        },
        setLangConfig:function(lang){
            localStorage["language"] = lang;
            localStorage["i18n"] = JSON.stringify(i18n_resource);
            I18n = new Internationalization();
            router.to({
                typeClass: AdminConfig
            });
        },
        setLangShow:function(flag){
            return ('zh' == flag) ? '中文' : 'English';
        },
        initLogout:function(){
            $('#btnLogout').off('tap').on('tap',function(){
                localStorage.clear('userInfo');
                router.empty().to({
                    typeClass:IndexScreen
                })
            });
        },
        initAdmin: function () {
            var $adminInfo = $('#divAdmin');
                   $adminInfo.hide();
            var strAdmin = new StringBuilder();
            strAdmin.append('<div class="adminPhoto"><img src="http://images.rnbtech.com.hk/static/images/avatar/user/47150161.jpg"></div>');
            strAdmin.append('<div class="adminInfo">');
            strAdmin.append('     <div class="adminName">李华</div>');
            strAdmin.append('     <div class="adminDetail">项目负责人</div>');
            strAdmin.append('</div>');
            strAdmin.append('<div class="adminConnect">');
            strAdmin.append('     <span class="adminTel"><a href="tel:13501989945"><span class="glyphicon glyphicon-earphone" aria-hidden="true"></span></a></span>');
            strAdmin.append('     <span class="adminMessage"><a href="sms:13501989945"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></a></span>');
            strAdmin.append('</div>');
            $adminInfo.append(strAdmin.toString())
        },
        close:function(){

        }
    };
    return AdminConfig;
})();
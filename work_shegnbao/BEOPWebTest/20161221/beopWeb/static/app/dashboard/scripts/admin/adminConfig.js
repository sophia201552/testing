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
                _this.initVersion();
                _this.initHost();
                _this.initNav();
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
            var lang = AppConfig.language?AppConfig.language:'zh';
            $('#spanLangShow').text(_this.setLangShow(lang));
            $('#btnLang').off('tap').on('tap',function(){
                var tapThis = this;
                //var lang = localStorage["isUserSelectedLanguage"];
                AppConfig.language = ('zh' == AppConfig.language) ? 'en' : 'zh';
                //localStorage["isUserSelectedLanguage"] = lang;
                localStorage["language"] = AppConfig.language;

                InitI18nResource(AppConfig.language,true).always(function (rs) {
                    I18n = new Internationalization(null, rs);
                    _this.setLangConfig(lang)
                });
            });
        },
        setLangConfig:function(lang){
            localStorage["language"] = AppConfig.language;
            localStorage["i18n"] = JSON.stringify(i18n_resource);
            //I18n = new Internationalization(null, rs);
            I18n.fillArea($("#navBottom"));
            router.to({
                typeClass: AdminConfig
            });
        },
        setLangShow:function(flag){
            return ('zh' == flag) ? '中文' : 'English';
        },
        initHost:function(){
            $('#forHelp').off('longTap').on('longTap',function(){
                $('#setHost').parent().show();
                _this.setHost();
            })
        },
        setHost:function(){
            var $liHost = $('#setHost').find('li').not(':last');
            $liHost.on('tap',function(e){
                localStorage.clear('userInfo');
                localStorage.setItem('beopHost',$(e.target).attr('value'));
                router.empty().to({
                    typeClass:IndexScreen
                })
            });
            $('.iptHost').on('change',function(e){
                localStorage.clear('userInfo');
                localStorage.setItem('beopHost','http://' + $(e.target).val());
                router.empty().to({
                    typeClass:IndexScreen
                })
            });
        },
        initLogout:function(){
            $('#btnLogout').off('tap').on('tap',function(){
                infoBox.confirm(I18n.resource.appDashboard.apply.CONFIRM_LOGOUT,function(){
                    localStorage.clear();
                    AppConfig = {
                        isMobile:true
                    };
                    $('.messageNum').text(0).hide();
                    Push.setAlias();
                    router.empty().to({
                        typeClass:IndexScreen
                    })
                })
            });
        },
        initVersion: function(){
            var lastVersion = localStorage.getItem('ignoreVersion');
            $('#spanVersion').text(AppConfig.version);
            $('#checkVersion').off('tap').on('tap',function(){
                VersionManage.getLastVersion();
            });
            //如果有新版本未更新,提示
            //if(lastVersion){
            //    lastVersion = JSON.parse(localStorage.getItem('ignoreVersion'));
            //    if(lastVersion && !$.isEmptyObject(lastVersion)){
            //        $('#divTipNewVs').text(I18n.resource.admin.navTitle.LAST_VERSION + lastVersion.dashboard.version);
            //    }
            //}
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

        },
        initNav: function(){
            $('#btnBack').off('touchstart').on('touchstart', function(e) {
                switch (localStorage.getItem('module')) {
                    case 'project':
                        router.empty().to({
                                typeClass: ProjectList,
                                data: {}
                        });
                        break;
                    case 'message':
                        router.empty().to({
                                typeClass: MessageIndex,
                                data: {}
                        });
                        break;
                    case 'workflow':
                        router.empty().to({
                                typeClass: WorkflowList,
                                data: {}
                        });
                        break;
                    default :
                        router.empty().to({
                                typeClass: ProjectList,
                                data: {}
                        });
                        break;
                }
            });
        }
    };
    return AdminConfig;
})();
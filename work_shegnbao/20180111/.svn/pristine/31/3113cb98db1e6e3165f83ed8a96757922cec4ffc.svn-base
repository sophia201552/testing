/**
 * Created by win7 on 2015/11/22.
 */
var AdminConfigNew = (function() {
    var _this;

    function AdminConfigNew() {
        _this = this;
    }
    AdminConfigNew.prototype = {
        show: function() {
            if ($('.adminConfig').length === 0) {
                var adminConfig = '<div class="adminConfig configHide"></div><div class="adminConfigMask"></div>';
                $("body").append(adminConfig);
            }
            this.init();
            $('.adminConfigMask').fadeIn(200);
            var timer = setTimeout(function() {
                $('.configHide').removeClass('configHide');
                timer = null;
            }, 160);
        },
        init: function() {
            var _this = this;
            $.ajax({ url: 'static/app/dashboard/views/admin/adminConfigNew.html' }).done(function(resultHTML) {
                $(".adminConfig").html(resultHTML);
                var unserInfo = '<div>\
                                    <div class="headPic">\
                                        <img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com' + AppConfig.userProfile.picture + '" width="100%" height="100%">\
                                    </div>\
                                </div>\
                                <span>' + AppConfig.userProfile.fullname + '</span>\
                                <span>' + AppConfig.userProfile.name + '</span>';
                $(".adminConfigContainer .userInfo").html(unserInfo);

                var configLis = '<li class="messageCenter">\
                                    <span i18n="appDashboard.message.MESSAGE_CENTER"></span>\
                                    <span class="newMessageNum activeInfo"></span>\
                                </li>\
                                <li class="toggleProject">\
                                    <span i18n="appDashboard.project.TOGGLE_PROJECT"></span>\
                                </li>\
                                <li class="changeLanguage">\
                                    <span i18n="appDashboard.apply.LANG"></span>\
                                    <span class="activeInfo lang"></span>\
                                </li>\
                                <li class="checkVersion">\
                                    <span i18n="appDashboard.apply.EDITION_CHECK"></span>\
                                    <span class="activeInfo">' + AppConfig.version + '</span>\
                                </li>';
                $(".config ul").append(configLis);

                _this.messageNumber();
                _this.initLanguage();
                _this.initMessage();
                _this.initVersion();
                _this.initToggleProject();
                _this.initLogout();
                _this.attachEvent();

                I18n.fillArea($('#navTop'));
                I18n.fillArea($('.adminConfigContainer'));
            });
        },
        messageNumber:function(){
            //获取消息数量
            if(AppConfig.newMessageNumber) {
                $('.newMessageNum').addClass('active').html(AppConfig.newMessageNumber);
            }
        },
        initToggleProject: function() {
            $('.toggleProject').off('touchstart').on('touchstart', function() {
                _this.close();
                router.to({
                    typeClass: ProjectList
                })
            });
        },
        initVersion: function() {
            $('.checkVersion').off('touchstart').on('touchstart', function(e) {
                VersionManage.getLastVersion()
            })
        },
        initLanguage: function() {
            var lang = AppConfig.language ? AppConfig.language : 'zh';
            $('.lang').text(_this.setLangShow(lang));
            $('.changeLanguage').off('touchstart').on('touchstart', function() {
                AppConfig.language = ('zh' == AppConfig.language) ? 'en' : 'zh';
                localStorage["language"] = AppConfig.language;
                $('.lang').text(_this.setLangShow(AppConfig.language));

                InitI18nResource(AppConfig.language, true , 'static/views/js/i18n/').always(function(rs) {
                    I18n = new Internationalization(null, rs);
                    _this.setLangConfig(lang)
                });
            });
        },
        setLangConfig: function(lang) {
            localStorage["language"] = AppConfig.language;
            localStorage["i18n"] = JSON.stringify(i18n_resource);

            I18n.fillArea($("#navBottom"));
            I18n.fillArea($("#navTop"));
            I18n.fillArea($('.adminConfigContainer'));
            //切换项目列表的中英文
            this.previewProjectList();
            ScreenCurrent && ScreenCurrent.close && ScreenCurrent.close();
            router.to(router.path.pop());
        },
        previewProjectList:function(){
            var list = [];
            if (AppConfig.permission && AppConfig.permission.DemoAccount){
                ProjectConfig.projectList.filter(function(item){
                    if (item.mobileSupported){
                        if(item.type){
                            item.name_en = I18n.resource.project_config.PAGE_NAME_ALT[item.type]
                            item.name_cn = I18n.resource.project_config.PAGE_NAME_ALT[item.type]
                            item.name_english = I18n.resource.project_config.PAGE_NAME_ALT[item.type]
                        }
                        list.push(item)
                    }
                })
            }else{
                ProjectConfig.projectList.filter(function(item){
                    if (item.mobileSupported){
                        list.push(item)
                    }
                })
            }
            AppConfig.projectList = ProjectConfig.projectList = list
        },
        setLangShow: function(flag) {
            return ('zh' == flag) ? '中文' : 'English';
        },
        initMessage: function() {
            $('.messageCenter').off('touchstart').on('touchstart', function(e) {
                _this.close();
                var msg;
                try {
                    msg = JSON.parse(localStorage.getItem('pushMsg'));
                    msg = msg.filter(function(item) {
                        return item.type == 'message'
                    });
                } catch (e) {
                    msg = [];
                }
                router.to({
                    typeClass: MessageIndex,
                    data: msg
                })
                e.preventDefault();
                e.stopPropagation();
            });
        },
        initLogout: function() {
            var _this = this;
            $('#btnLogout').off('touchstart').on('touchstart', function(e) {
                infoBox.confirm(I18n.resource.appDashboard.apply.CONFIRM_LOGOUT, function() {
                    $('#navBottom .pushTip').text(0).hide();
                    localStorage.clear();
                    localStorage.setItem('language', AppConfig.language);
                    AppConfig.userId = undefined;
                    AppConfig.account = undefined;
                    AppConfig.isMobile = true;
                    AppConfig.chartTheme = theme.Burgeen;
                    AppConfig.newMessageNumber = null;
                    ProjectConfig = {
                        projectId: undefined,
                        projectIndex: undefined,
                        projectList: undefined,
                        projectInfo: undefined,
                        dashboardList: undefined,
                        reportList: undefined,
                        refreshTime: undefined,
                        refreshInterval: 7200000
                    }; //报表配置文件
                    $('.messageNum').text(0).hide();
                    $('#btnProject').removeClass('hide')
                    $('#btnReport').addClass('hide')
                        //Push.setAlias();
                    router.empty().to({
                        typeClass: IndexScreen
                    })
                })
                _this.close();
                e.preventDefault();
                e.stopPropagation();
            });
        },
        close: function() {
            $(".adminConfig").remove();
            $(".adminConfigMask").remove();
        },
        attachEvent: function() {
            $('.adminConfig .headPic, .adminConfigMask').on('touchstart', function(e) {
                var adminConfig = $('.adminConfig');
                var adminConfigMask = $('.adminConfigMask');
                $(adminConfig).addClass('configHide');
                $(adminConfigMask).fadeOut(300);
                var timer = setTimeout(function() {
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
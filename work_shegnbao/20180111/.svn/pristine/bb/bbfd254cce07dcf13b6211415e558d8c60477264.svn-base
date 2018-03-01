var PlaformUserConfig = (function() {
    var _this;
    function PlaformUserConfig() {
        _this = this;
    }

    PlaformUserConfig.prototype = {
        show: function() {
            WebAPI.get('/static/app/Platform/views/core/config.html').done(function (resultHtml) {
                $('#indexMain').append(resultHtml);
                var $skinManege = $('#skinManege');
                I18n.fillArea($skinManege);
                $skinManege.modal('show');
                _this.init();
                _this.attevent();
            })
        },

        init:function(){
            var $btnChangeSkin = $('#btnChangeSkin');
            var systemSkin = AppConfig.userConfig.skin;
            if (systemSkin) {
                $btnChangeSkin.val('platform');
            } else {
                $btnChangeSkin.val('platform');
            }
            var $btnChangeReportSkin = $('#btnChangeReportSkin')
            var reportSkin = localStorage.getItem('reportSkin_' + AppConfig.userId);
            if (reportSkin) {
                $btnChangeReportSkin.val(reportSkin);
            } else {
                $btnChangeReportSkin.val('default');
            }

            //报表下载字体大小
            if (!AppConfig.reportFontSize){
                AppConfig.reportFontSize = 12;
            }
            var fontValue = AppConfig.reportFontSize;
            $('#changeReportFont').val(fontValue).attr('title', fontValue);
            //诊断字体大小
            if (!AppConfig.diagnosisFontSize){
                AppConfig.diagnosisFontSize = 12;
            }
            var diagnosisFontValue = AppConfig.diagnosisFontSize;
            $('#changeDiagnosisFont').val(diagnosisFontValue).attr('title', diagnosisFontValue);
            if (!($('#paneCenter').find('iframe').length !== 0 && $('#paneCenter').find('iframe').attr('src').indexOf('diagnosis') > -1)) { 
                $('#changeDiagnosisFont').attr('disabled', true);
            }
        },

        attevent:function(){
            //var skinTimeout = null;
            //处理menu pic

            $('#btnLanguage').val(AppConfig.language).off('change').on('change',function(){
                localStorage.setItem('language',this.value);
                var Spinner = new LoadingSpinner({
                    color: '#00FFFF'
                });
                let value  = this.value;
                WebAPI.post('/setUserConfig',{
                    userId:AppConfig.userId,
                    option:{
                        'language':value
                    }
                });
                Spinner.spin($('#mainContainer')[0]);
                // localStorage.setItem('isUserSelectedLanguage',this.value)
                location.reload();
            });

            var updateMenuPic = function(currentSkin) {
                var $navBar = $('#ulPages'),
                    navIconsList = $navBar.find('li').find('img.nav-icon-svg'),
                    current;
                navIconsList.each(function() {
                    var $this = $(this);
                    current = $this.attr('src').split('-');
                    $this.replaceWith('<img class="nav-icon-svg" src=" ' + current[0] + '-' + currentSkin + '.' + current[1].split('.')[1] + ' " onerror="this.style.display=\'none\'"> ')
                })
            };

            //主界面颜色选择
            $("#btnChangeSkin").eventOff('change').eventOn('change', function(e) {
                var systemSkin = AppConfig.userConfig.skin;

                var currentSkin = this.value;
                if (currentSkin != 'platform') {
                    WebAPI.post('/setUserConfig',{
                        userId:AppConfig.userId,
                        option:{
                            'skin':currentSkin
                        }
                    }).done(function(rs){
                        if(rs.state){
                            if (currentSkin == 'dark') {
                                AppConfig.userConfig.skin = currentSkin;
                                _this.setLogo();
                                _this.loadDarkSkin();
                                updateMenuPic(currentSkin);
                                window.location.href='/observer';
                                var Spinner = new LoadingSpinner({
                                    color: '#00FFFF'
                                });
                                Spinner.spin($('#mainContainer')[0]);
                            }else{
                                window.location.href='/platform#fromOb=1'
                            }
                            
                            // if (currentSkin == 'dark') {
                            //     _this.loadDarkSkin();
                            // } else {
                            //     var cssDark = document.querySelector('#darkSkin');
                            //     if (cssDark) {
                            //         cssDark.parentNode.removeChild(cssDark);
                            //     }
                            //     AppConfig.chartTheme = 'macarons';
                            // }
                            // _this.setLogo();
                            // updateMenuPic(currentSkin);
                            // AppConfig.userConfig.skin = currentSkin;
                        }
                    });
                }
                //skinTimeout = setTimeout(function() {
                //    $btnChangeSkin.fadeOut(1000);
                //}, 5000);
                trackEvent('顶部导航切换皮肤', 'TopNav.ChangeSkin' + currentSkin);
            }, 'navTool-skinLabel');

            //报表颜色选择
            $('#btnChangeReportSkin').off('change').on('change', function () {
                var systemSkin = $('#reportDarkSkin').length == 0 ? 'default' : 'dcolor';
                var currentSkin = this.value;
                if (systemSkin != this.value) {
                    if (this.value == 'dcolor') {
                        _this.loadReportDarkSkin();
                    } else {
                        var cssDark = document.querySelector('#reportDarkSkin');
                        if (cssDark) {
                            cssDark.parentNode.removeChild(cssDark);
                        }
                    }
                    localStorage.setItem('reportSkin_' + AppConfig.userId, this.value);
                }
                //trackEvent('顶部导航切换皮肤', 'TopNav.ChangeSkin' + currentSkin);
            });

            //改变报表下载字体大小
            $('#changeReportFont').off('change').on('change', function () {
                var value = $(this).val();
                AppConfig.reportFontSize = Number(value);
                $(this).attr('title', value);
            });
            //改变诊断字体大小
            $('#changeDiagnosisFont').off('change').on('change', function () {
                var value = $(this).val();
                if ($('#paneCenter').find('iframe').length!==0 && $('#paneCenter').find('iframe').attr('src').indexOf('diagnosis') > -1){
                    AppConfig.diagnosisFontSize = Number(value);
                    $(this).attr('title', value);
                    $('#skinManege').modal('hide');
                    $('#paneCenter').find('iframe')[0].contentWindow.location.reload();
                }
            });
        },

        loadReportDarkSkin:function(){
            var head = document.querySelector('head');
            var $reportDarkSkin = $('#reportDarkSkin');
            if ($reportDarkSkin.length == 0) {
                var $cssDark = $('<link id="reportDarkSkin" rel="stylesheet" type="text/css" href="/static/content/report-black.css?' + new Date().getTime() + '">');
                head.appendChild($cssDark[0]);
                $cssDark[0].onload = function() {
                    localStorage.setItem('reportSkin_' + AppConfig.userId, 'dcolor');
                }
            }
        },

        loadDarkSkin:function() {
                var head = document.querySelector('head');
                var $darkSkin = $('#darkSkin');
                if ($darkSkin.length == 0) {
                    var $cssDark = $('<link id="darkSkin" rel="stylesheet" type="text/css" href="/static/content/index-black.css?' + new Date().getTime() + '">');
                    head.appendChild($cssDark[0]);
                }
                //设置echart主题
                AppConfig.chartTheme = theme.Dark;
            },

        /**
         * 根据主题切换logo, 如果是自定义的logo不进行改变
         * @returns {boolean}
         */
        setLogo: function() {
            var logoImgBEOP = $('#navHomeLogo').find('img');
            if (logoImgBEOP.attr('company')) {
                return false;
            }
            if (!AppConfig.userConfig.skin) {
                logoImgBEOP.attr('src', '/static/images/logo_in_white.png');
            } else if (AppConfig.userConfig.skin == 'dark') {
                logoImgBEOP.attr('src', '/static/images/logo_in_dark.png');
            } else {
                logoImgBEOP.attr('src', '/static/images/logo_in_white.png');
            }
        },

        close: function() {
        }
    };
    return PlaformUserConfig;
})();
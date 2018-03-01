/**
/**
 * Created by win7 on 2015/9/14.
 */
var AdminConfigure = (function(){
    var _this;

    AdminConfigure.navOptions = {
        top: '<span class="navTopItem title middle" i18n="admin.setUp.CONFIG"></span>'
    };

    function AdminConfigure(container){
        _this = this;
        if(!container){
            this.container = document.getElementById('indexMain');
        }else{
            this.container = container;
        }
    }

    AdminConfigure.prototype = {
        show: function () {
            WebAPI.get('static/app/temperatureControl/views/admin/adminConfigure.html').done(function(resultHTML){
                $(_this.container).html(resultHTML);
                I18n.fillArea($(_this.container));
                I18n.fillArea($('#navTop'));
                _this.init();
            });
        },
        init: function () {
            this.$container = $('#appConfig');
            this.$swGps = $('#swGps', this.$container);
            _this.initShowOption();
            _this.initNav();
            _this.initList();
            _this.initConfigStatus();
            _this.attachEvents();
            _this.initConfig();
            _this.initLanguage();
            _this.initLogout();
            _this.initVersion();
        },
        initNav: function () {
            var $navTitle = $('.nav-title', '#navTop');
            var $linkToInfoCenter = $('#linkToInfoCenter');
            $navTitle.text('配置').show();

            //点击头像进入个人中心页面
            if(AppConfig.userProfile && AppConfig.userProfile.picture){
                $('.imgUser', $linkToInfoCenter).attr('src', 'http://images.rnbtech.com.hk' + AppConfig.userProfile.picture);
            }
            $linkToInfoCenter.off('touchend').on('touchend', function(e){
                if(AppConfig.landscape){
                    new PersonalCenter(_this.container).show();
                }else {
                    router.to({
                        typeClass: PersonalCenter
                    });
                }
                e.preventDefault();
            });
        },
        initList: function () {
            //设置管理密码
            //0 是访客 10 是管理员 20是物业 
            var $setPwd = $('#mSetPwd', this.$container);
            if (curRoom && curRoom.grade != '0' && AppConfig.isOnline) {
                $setPwd.show();
            } else {
                $setPwd.hide();
            }
            //显示隐藏传感器
            var mSensorSH = document.getElementById('mSensorSH');
            if (window.customVariable.isHideSensor) {
                mSensorSH.classList.remove('hide_sensor');
                mSensorSH.classList.add('show_sensor');
            } else {
                mSensorSH.classList.add('hide_sensor');
            }
        },
        // 初始化各类配置的状态
        initConfigStatus: function () {
            var options = appConfigManager.get();
            // switch 类按钮
            options.gps === 1 && this.$swGps.addClass('on');
        },

        // 初始化要显示选项
        initShowOption: function(){
            var $listBorder = $('.listBorder');
            var $mSchedule = $('#mSchedule');
            var $mMode = $('#mMode');
            var $mSetPwd = $('#mSetPwd');
            var $mSensorSH = $('#mSensorSH');
            var $mNews = $('#mNews');
            var $mHostname = $('#mHostname');
            var $mIP = $('#mIP');
            var $mLang = $('#mLang');
            var $mVersion = $('#mVersion');
            var $mOnline = $('#mSwitchToOnline');
            var $mLocal = $('#mSwitchToLocal');
            if(!AppConfig.isLocalMode){
                $listBorder.show();
                $mHostname.hide();
                $mIP.hide();
                $mLocal.show();
                $mOnline.hide();
            }else{
                $listBorder.hide();
                $mHostname.show();
                $mIP.show();
                $mLang.show();
                $mVersion.show();
                $mLocal.hide();
                $mOnline.show();
            }
        },

        attachEvents: function () {
            var windowHeight = $(window).height();
            // switch 类按钮事件处理
            $('.btn-switch', this.$container).hammer().off('tap').on('tap', function (e) {
                var $this = $(this);
                var options = appConfigManager.get();
                var config = {};
                $(this).toggleClass('on');
                if( $this.hasClass('on') ) {
                    config[$this[0].dataset['key']] = 1;
                } else {
                    config[$this[0].dataset['key']] = 0;
                }
                options = $.extend( false, options, config );
                // 保存新的配置
                appConfigManager.set(options);
                e.stopPropagation();
                e.preventDefault();
            });
            $(window).resize(function () {
                var newHeight = $(window).height();
                if (newHeight < windowHeight) {
                    $('#btnLogout').addClass('down');
                } else {
                    $('#btnLogout').removeClass('down');
                }
                
            });
        },

        initLanguage: function () {
            $('#mLang').hammer().off('tap').on('tap', function(){
                if (AppConfig.language == 'zh'){
                    AppConfig.language = 'en'
                }else{
                    AppConfig.language = 'zh'
                }
                InitI18nResource(AppConfig.language,true, 'static/app/temperatureControl/views/i18n/').always(function (rs) {
                    I18n = new Internationalization(null, rs);
                    localStorage.setItem('language', AppConfig.language);
                });
                _this.show();
            });
        },


        initLogout:function(){
            $('#btnLogout').off('touchstart').on('touchstart',function(e){
                localStorage.clear('userInfo');
                roomAll = null ;
                curRoom = null;
                sensorAll = null;
                ctrAll = null;
                mapConfig = null;
                AppConfig.userId = null;
                AppConfig.account = null;
                AppConfig.roomId = null;
                AppConfig.roomInit = true;
                AppConfig.isEdit = false;
                delete window.customVariable;
                router.empty().to({
                    typeClass:IndexScreen
                })
            });
        },
        initVersion:function(){
            var lastVersion = localStorage.getItem('ignoreVersion');
            $('#selVersion').text(AppConfig.version);
            $('#mVersion').off('tap').on('tap',function(){
                VersionManage.getLastVersion();
            });
            //如果有新版本未更新,提示
            if(lastVersion){
                lastVersion = JSON.parse(localStorage.getItem('ignoreVersion'));
                if(lastVersion && !$.isEmptyObject(lastVersion) && lastVersion.temperature && lastVersion.temperature.version){
                    $('#divTipNewVs').text(I18n.resource.admin.navTitle.LAST_VERSION + lastVersion.temperature.version);
                }
            }
        },
        close:function(){

        },
        initConfig: function(){
            var $listBorder = $('.listBorder');
            var $mSchedule = $('#mSchedule');
            var $mMode = $('#mMode');
            var $mSetPwd = $('#mSetPwd');
            var $mSensorSH = $('#mSensorSH');
            var $mNews = $('#mNews');
            var $mHostname = $('#mHostname');
            var $mIP = $('#mIP');
            var $mLang = $('#mLang');
            var $mVersion = $('#mVersion');
            var $mOnline = $('#mSwitchToOnline');
            var $mLocal = $('#mSwitchToLocal');

            //日程
            $('#mSchedule', this.$container).hammer().off('tap').on('tap', function (e) {
                if(AppConfig.landscape){
                    new Schedule(_this.container).show();
                }else {
                    router.to({
                        typeClass: Schedule
                    });
                }
                e.preventDefault();
            });

            //模式
            if(curRoom && curRoom.grade !== 0){
                $('#mMode', this.$container).removeClass('hidden').hammer().off('tap').on('tap', function (e) {
                    if(AppConfig.landscape){
                        new Mode(_this.container).show();
                    }else {
                        router.to({
                            typeClass: Mode
                        });
                    }
                    e.preventDefault();
                });
            }

            //设置密码
            if(curRoom && curRoom.grade !== 0){
                $('#mSetPwd', this.$container).hammer().off('touchstart').on('touchstart', function (e) {
                    e.preventDefault();
                    var setPwdTpl = '\
                    <div id="setPwdBox"><div>\
                        <div class="form-group">\
                            <label>{yourpwd}:</label>\
                            <input id="loginPassword" type="password" class="form-control userSelect">\
                            <label>{roompwd}:</label>\
                            <input id="managePassword" type="password" class="form-control userSelect">\
                        </div>\
                        <button id = "saveSetPwd" class="btn btn-default" i18n="admin.schedule.SAVE">保存</button>\
                        <button id = "cancelSetPwd" class="btn btn-default" i18n="admin.roomPage.CANCEL">取消</button>\
                    </div></div>'
                    _this.$container.append(setPwdTpl.formatEL({
                        yourpwd: i18n_resource.admin.setUp.YOUR_PASSWORD,
                        roompwd: i18n_resource.admin.setUp.SET_ROOM_PASSWORD
                    }));
                    I18n.fillArea($('#setPwdBox'));
                    var $setPwdBox = $('#setPwdBox', _this.$container),
                        $loginPassword = $('#loginPassword', _this.$container),
                        $managePassword = $('#managePassword', _this.$container);
                    var loginPassword, managePassword;

                    $('#cancelSetPwd', $setPwdBox).off('touchstart').on('touchstart', function () {
                        $setPwdBox.remove();
                    });

                    $('#saveSetPwd', $setPwdBox).off('touchstart').on('touchstart', function () {
                        loginPassword = $loginPassword.val();
                        managePassword = $managePassword.val();
                        var rs = (function (pwd) {
                            //验证密码完整性
                            var msg,isOK = true;
                            if (pwd === '') {
                                msg = I18n.resource.admin.index.NUM_ELEVEN;
                                isOK = false;
                            } else if (pwd.length < 6) {
                                msg = I18n.resource.admin.index.PASS_INFO;
                                isOK = false;
                            }
                            return {
                                msg: msg,
                                isOK: isOK
                            }
                        })(managePassword);
                        var savePwd = function (data) {
                            // TODO 反馈
                            WebAPI.post('/appTemperature/room/setRoomPassword/'+curRoom['_id'], data).done(function (result) {
                                if (result) {
                                    curRoom.params.password = managePassword;
                                } else {

                                }
                            }).always(function () {
                                $setPwdBox.remove();
                            });
                        };
                        
                        //验证登录密码
                        if (localStorage.userInfo && JSON.parse(localStorage.userInfo).pwd === loginPassword) {

                            if (rs.isOK) {
                                savePwd({password:managePassword});
                            } else {
                                $setPwdBox.remove();
                                window.plugins && window.plugins.toast.show(rs.msg, 'short', 'center');
                                console.log(rs.msg);
                            }
                        } else {
                            $setPwdBox.remove();
                            window.plugins && window.plugins.toast.show(I18n.resource.admin.index.USER_PASSWORD_INFO, 'short', 'center');
                            console.log(I18n.resource.admin.index.USER_PASSWORD_INFO);
                        }
                        
                    });
                });
            }

            $('#mSensorSH', this.$container).hammer().off('tap').on('tap', function (e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass('show_sensor')) {
                    $this.removeClass('show_sensor').addClass('hide_sensor');
                    //显示传感器
                    window.customVariable.isHideSensor = false;
                } else {
                    $this.removeClass('hide_sensor').addClass('show_sensor');
                    //隐藏传感器
                    window.customVariable.isHideSensor = true;
                }

            });

             //消息中心
            $('#mNews', this.$container).hammer().off('tap').on('tap', function (e) {
                //todo
                router.to({
                    typeClass: NewsCenter
                });
                e.preventDefault();
            });
            newsList();
            function newsList(){
                var newPushMsg = localStorage.getItem('newPushMsg');
                var oldPushMsg = localStorage.getItem('oldPushMsg');
                if (newPushMsg && oldPushMsg != newPushMsg) {
                    $('#mNews .opt-title').append('<span class="badge" style="float:right;background-color: #f3b145;" id="newsCount">new</span>');
                }
                var data = newPushMsg ? JSON.parse(newPushMsg) : [];
                router.newsList = data;
            }

            //设置网络
            if(!AppConfig.isOnline){
                $('#mHostname', this.$container).hammer().off('touchstart').on('touchstart', function (e) {
                    e.preventDefault();
                    var setPwdTpl = '\
                    <div id="setHostname"><div>\
                        <div class="form-group">\
                            <select class="form-control" id="hostType">\
                                <option value="hostname">Hostname</option>\
                                <option value="ip">IP</option>\
                            </select>\
                            <input id="iptHostname" type="text" class="form-control userSelect" placeholder="beop.rnbtech.com.hk" style="margin-top: 10px;">\
                        </div>\
                        <button id = "btnSaveHost" class="btn btn-default" i18n="admin.schedule.SAVE">保存</button>\
                        <button id = "btnCancel" class="btn btn-default" i18n="admin.roomPage.CANCEL">取消</button>\
                    </div></div>';
                    _this.$container.append(setPwdTpl.formatEL({
                        Hostname: i18n_resource.admin.setUp.HOSTNAME,
                        IP: i18n_resource.admin.setUp.IP
                    }));
                    I18n.fillArea($('#mHostname'));
                    var $setHostname = $('#setHostname', _this.$container),
                        $iptHostname = $('#iptHostname', $setHostname),
                        $hostType = $('#hostType', $setHostname);
                    var hostName, IP, type, netAddr;

                    $hostType.off('change').on('change', function(){
                        type = $hostType.val();
                        if(type == 'hostname'){
                            $iptHostname.attr('placeholder', 'beop.rnbtech.com.hk');
                        }else{
                            $iptHostname.attr('placeholder', '192.168.1.204');
                        }
                    });

                    $('#btnCancel', $setHostname).off('touchstart').on('touchstart', function (e) {
                        e.stopPropagation();
                        $setHostname.remove();
                    });

                    $('#btnSaveHost', $setHostname).off('touchstart').on('touchstart', function (e) {
                        e.stopPropagation();
                        hostName = $iptHostname.val();
                        type = $hostType.val();

                        if(type == 'ip'){
                            //TODO 验证
                            netAddr = hostName + ':8181';
                        }else{
                            //TODO 验证
                            netAddr = hostName;
                        }

                        var mqttCurrent = mqtt.connect("ws://" + netAddr, {});
                        mqttCurrent.on('connect', function(topic, juageConnected) {
                            alert('success');
                            setIotInfo(netAddr);
                            $setHostname.remove();
                        })
                        mqttCurrent.on('error', function(topic, juageConnected) {
                            alert('fail');
                        })

                        //保存到数据库
                        
                        function setIotInfo(netAddr){
                            if(!curRoom) return;
                            !curRoom.params && (curRoom.params={});
                            curRoom.params.netAddr = netAddr;
                            curRoom.baseType = 'groups';
                            WebAPI.post('/iot/setIotInfo', [curRoom]).done(function(result){
                                if(result && result.data && result.data.length > 0){
                                    console.log('netAddr save success');
                                }else{
                                    console.log('netAddr save fail');
                                }
                            });
                        }
                    });
                });
            }

            //下载房间信息
            $('#mDownloadRoom', this.$container).hammer().off('tap').on('tap', function (e) {
                //todo

                e.preventDefault();
            });

            //切换到本地
            $('#mSwitchToLocal', this.$container).hammer().off('tap').on('tap', function (e) {
                //todo
                $listBorder.hide();
                $mHostname.show();
                $mIP.show();
                $mLang.show();
                $mVersion.show();
                $mLocal.hide();
                $mOnline.show();
                //AppConfig.isLocalMode = true;
                if(AppConfig.landscape){
                    ScreenCurrent.observerInstance && ScreenCurrent.observerInstance.close();
                    ScreenCurrent.observerInstance=new ObserverLocalScreen(document.getElementById('containerObserver'),{roomInfo:curRoom});
                    ScreenCurrent.observerInstance.show();
            }else{
                    router.to({
                        typeClass:ObserverLocalScreen,
                        param:[null,{roomInfo:curRoom}]
                    })
                }
                e.preventDefault();
            });
            $('#mSwitchToOnline', this.$container).hammer().off('tap').on('tap', function (e) {
                //todo
                //AppConfig.isLocalMode = false;
                $listBorder.show();
                $mHostname.hide();
                $mIP.hide();
                $mLocal.show();
                $mOnline.hide();

                if(AppConfig.landscape){
                    ScreenCurrent.observerInstance && ScreenCurrent.observerInstance.close();
                    ScreenCurrent.observerInstance = new ObserverScreen(document.getElementById('containerObserver'),{roomInfo:curRoom});
                    ScreenCurrent.observerInstance.show();
                }else{
                    router.to({
                        typeClass:ObserverScreen,
                        param:[null,{roomInfo:curRoom}]
                    })
                }
                e.preventDefault();
            });
        }
    };

    return AdminConfigure;
})();

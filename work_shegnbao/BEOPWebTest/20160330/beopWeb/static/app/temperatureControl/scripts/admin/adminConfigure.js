/**
 * Created by win7 on 2015/9/14.
 */
var AdminConfigure = (function(){
    var _this;

    AdminConfigure.navOptions = {
        top: '<span class="topNavTitle">设置</span>'
    };

    function AdminConfigure(){
        _this = this;
    }

    AdminConfigure.prototype = {
        show: function () {
            WebAPI.get('/static/app/temperatureControl/views/admin/adminConfigure.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        },
        init: function () {
            this.$container = $('#appConfig');
            this.$swGps = $('#swGps', this.$container);
            this.$optChkUpdate = $('#optChkUpdate', this.$container);

            _this.initNav();

            _this.initConfigStatus();
            _this.attachEvents();
            _this.initConfig();
            _this.initLogout();
        },
        initNav: function () {
            var $navTitle = $('.nav-title', '#navTop');
            $navTitle.text('配置').show();
        },
        // 初始化各类配置的状态
        initConfigStatus: function () {
            var options = appConfigManager.get();
            var action;

            // switch 类按钮
            options.gps === 1 && this.$swGps.addClass('on');
        },
        attachEvents: function () {
            var _this = this;
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

            //后退
            /*$('#btnBack').off('tap').on('tap', function (e) {
                //todo
                router.back();
                e.preventDefault();
            });*/
        },

        initLogout:function(){
            $('#btnLogout').off('touchstart').on('touchstart',function(e){
                localStorage.clear('userInfo');
                router.empty().to({
                    typeClass:IndexScreen
                })
            });
        },
        close:function(){

        },
        initConfig: function(){
            var $appConfig = $('#appConfig');

            //日程
            $('#mSchedule', $appConfig).hammer().off('tap').on('tap', function (e) {
                router.to({
                    typeClass: Schedule
                });
                e.preventDefault();
            });

            //模式
            if(curRoom && curRoom.grade !== 0){
                $('#mMode', $appConfig).removeClass('hidden').hammer().off('tap').on('tap', function (e) {
                    router.to({
                        typeClass: Mode
                    });
                    e.preventDefault();
                });
            }


            /*//开机
            $('#mBoot', $appConfig).hammer().off('tap').on('tap', function (e) {
                router.to({
                    typeClass: Boot
                });
                e.preventDefault();
            });

            //关机
            $('#mShutdown', $appConfig).hammer().off('tap').on('tap', function (e) {
                //todo
                router.to({
                    typeClass: Shutdown
                });
                e.preventDefault();
            });*/

            //关联房间
            /*$('#mBindRoom', $appConfig).hammer().off('tap').on('tap', function (e) {
                //todo
                router.to({
                    typeClass: BundleRoom
                });
                e.preventDefault();
            });*/

             //消息中心
            $('#mNews', $appConfig).hammer().off('tap').on('tap', function (e) {
                //todo
                router.to({
                    typeClass: NewsCenter
                });
                e.preventDefault();
            });
            newsList();
            function newsList(){
                var $newsCount = $('#newsCount');
                var data = [];//[{_id: '1',text: '室内温度过高'},{_id: '2',text: '室内温度过低'}]

                if(data && data.length > 0){
                    $newsCount.text(data.length)
                }else{
                    $newsCount.text('');
                }
                router.newsList = data;
            }
        }
    };

    return AdminConfigure;
})();

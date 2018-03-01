/**
 * Created by win7 on 2015/9/14.
 */
var AdminConfigure = (function(){
    var _this;

    AdminConfigure.navOptions = {
        top: true
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

            // 打开 类按钮事件处理
            
        },

        initLogout:function(){
            $('#btnLogout').off('touchstart').on('touchstart',function(e){
                localStorage.removeItem('userInfo');
                ScreenManager.show(IndexScreen);
            });
        },
        close:function(){

        }
    };

    return AdminConfigure;
})();

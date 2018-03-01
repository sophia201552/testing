/**
 * Created by vicky on 2016/3/14.
 */
var Mode = (function(){
    var _this;

    Mode.navOptions = {
        top: '<span class="topNavTitle">模式</span>'
    };

    function Mode(){
        _this = this;
    }

    Mode.prototype = {
        show: function () {
            WebAPI.get('/static/app/temperatureControl/views/config/mode.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        },
        init: function () {

            _this.attachEvents();

        },
        attachEvents: function () {
            var $ulMode = $('#ulMode');
            $('.itemMode', $ulMode).hammer().off('tap').on('tap', function (e) {
                $(this).addClass('selected').siblings().removeClass('selected');
                //todo save
                e.stopPropagation();
                e.preventDefault();
            });
            // 后退按钮
            /*$('#btnBack').hammer().off('tap').on('tap', function (e) {
                router.back();
            });*/
        },
        close:function(){

        }
    };

    return Mode;
})();

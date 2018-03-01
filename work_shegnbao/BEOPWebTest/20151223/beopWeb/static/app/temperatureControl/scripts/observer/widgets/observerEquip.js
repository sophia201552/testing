/**
 * Created by win7 on 2015/9/17.
 */
var ObserverEquip = (function(){
    var _this;
    function observerEquip(screen){
        _this = this;
        this.screen = screen;
        this.equipList = screen.equipList
    }
    observerEquip.prototype = {
        show:function(){
            WebAPI.get('/static/app/temperatureControl/views/observer/widgets/equipmentConfig.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        },
        init:function(){
            var strEquipImg = '<img id="imgMap" src="static/app/temperatureControl/img/2.jpg"/>';
            $('#divEquipImg').append(strEquipImg);
            _this.initConfigure();
        },
        initConfigure:function(){
            var $spanBtnCfg = $('.spanCfgBtn');
            $spanBtnCfg.off('touchstart').on('touchstart',function(e){
                var ev = e.originalEvent?e.originalEvent:e;
                var $btnCfg = $(ev.currentTarget).find('.btnCfg');
                if ($btnCfg.hasClass('btnCfgOn')){
                    $btnCfg.removeClass('btnCfgOn').addClass('btnCfgOff');
                }else{
                    $btnCfg.removeClass('btnCfgOff').addClass('btnCfgOn');
                }
            })
        },
    };

    return observerEquip;
})();

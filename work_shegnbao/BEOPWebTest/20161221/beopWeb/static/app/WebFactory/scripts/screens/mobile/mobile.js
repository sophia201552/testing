/**
 * Created by win7 on 2016/5/28.
 */
(function(){
    function EnergyScreen_M(page,screen){
        var opt = {isForMobile:true};
        namespace('factory.screens').EnergyScreen.call(this,page,screen,opt)
    }
    EnergyScreen_M.prototype = Object.create(namespace('factory.screens.EnergyScreen').prototype);
    namespace('factory.screens').EnergyScreen_M = EnergyScreen_M;
})();
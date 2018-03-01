/**
 * Created by win7 on 2016/5/28.
 */
(function () {
    function EnergyScreen_M(options, container) {
        if(options){
            options.isForMobile = true;
        }else{
            options = {
                isForMobile:true
            }
        }
        namespace('observer.screens').EnergyScreen.call(this,options,container)
    }
    EnergyScreen_M.prototype = Object.create(namespace('observer.screens.EnergyScreen').prototype);
    namespace('observer.screens').EnergyScreen_M = EnergyScreen_M;
})();
/**
 * Created by win7 on 2016/12/20.
 */
var LandscapeObserverScreen = (function(){
    function LandscapeObserverScreen(){
        this.listInstance = undefined;
        this.observerInstance = undefined;
    }
    LandscapeObserverScreen.navOptions = {
        top: false,
        bottom: false,
        backDisable:true
    };
    LandscapeObserverScreen.prototype = {
        show:function(){
            var _this = this;
            WebAPI.get('static/app/temperatureControl/views/observer/landscapeObserverScreen.html').done(function(resultHTML){
                ElScreenContainer.innerHTML = resultHTML;
                _this.setScreen();
            })
        },
        setScreen:function(){
            var containerAddition = document.getElementById('wrapAddition');
            var containerObserver = document.getElementById('containerObserver');
            this.listInstance = new ProjectSel(containerAddition);
            if(!AppConfig.isLocalMode) {
                this.observerInstance = new ObserverScreen(containerObserver, {roomInfo: curRoom});
            }else{
                this.observerInstance = new ObserverLocalScreen(containerObserver, {roomInfo: curRoom});
            }
            this.listInstance.show();
            this.observerInstance.show();
            this.attachEvent();
        },
        attachEvent:function(){
            var _this = this;
            var flag=true;
            $('#btnRoomList').off('tap').on('tap',function(){
                if(flag){
                    $('#wrapAddition').toggleClass('hide');
                    $('#warpObserverScreen').toggleClass('fullPage');
                }else {
                    flag=true;
                }
            });
            $('#btnConfig').off('tap').on('tap',function(){
                $('#wrapAddition').removeClass('hide');
                $('#warpObserverScreen').removeClass('fullPage'); 
                flag=false;
            });
        },
        close:function(){

        }
    };
    return LandscapeObserverScreen
})();
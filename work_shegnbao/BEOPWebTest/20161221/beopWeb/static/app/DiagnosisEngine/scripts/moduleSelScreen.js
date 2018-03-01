/**
 * Created by win7 on 2016/5/19.
 */
var ModuleSelScreen = (function(){
    var _this;
    function ModuleSelScreen() {
        _this = this;
    }

    ModuleSelScreen.prototype = {
        show:function(){
            WebAPI.get('/static/app/DiagnosisEngine/views/moduleSelScreen.html').done(function(resultHTML){
                PanelToggle.panelCenter.innerHTML = resultHTML;
                PanelToggle.toggle({
                    center:{
                        show:true
                    }
                });
                _this.init();
            })
        },
        init:function(){
            _this.initEntrance();
        },
        initEntrance:function(){
            document.getElementById('divPtRecognize').onclick = function(){
                ScreenManager.show(PtRecognizeScreen);
            };
            document.getElementById('divDiagnosisConfig').onclick = function(){
                ScreenManager.show(DiagnosisConfig);
            };
            document.getElementById('divDiagnosisCustom').onclick = function(){
                ScreenManager.show(DnCstmScreen, AppConfig.projectId);
            };
        },
        onresize:function(){
            PanelToggle.onresize();
        },
        close:function(){

        }
    };
    return ModuleSelScreen;
})();
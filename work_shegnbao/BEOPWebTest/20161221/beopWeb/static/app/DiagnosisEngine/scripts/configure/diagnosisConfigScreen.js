/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         佛祖保佑       永无BUG
*/
/**
 * Created by win7 on 2016/5/20.
 */
var DiagnosisConfig = (function(){
    var _this;
    function DiagnosisConfig(){
        _this = this;
        AppConfig.module = 'configure'
    }
    DiagnosisConfig.prototype = {
        show:function(){
            WebAPI.get('/static/app/DiagnosisEngine/views/configure/diagnosisConfigScreen.html').done(function(resultHTML){
                PanelToggle.panelCenter.innerHTML = resultHTML;
                PanelToggle.toggle({
                    left: {
                        show:true
                    },
                    center:{
                        show:true
                    },
                    right:{
                        show:true
                    }
                });
                if (!AppConfig.datasource) {
                    // 如果没有预加载，则先去加载数据，再做显示
                    Spinner.spin(PanelToggle.panelRight);
                    WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
                        _this.store.group = result.group;
                        AppConfig.datasource = new DataSource(_this);
                        AppConfig.datasource.iotOpt = {
                            tree:{
                                event:{
                                    addDom:function(treeNode,$target){
                                        if($target.hasClass('projects')){
                                            $target.find('#' + treeNode.tId + '_span').on('dragstart',function(e){
                                                EventAdapter.setData(treeNode);
                                            })
                                        }
                                    }
                                }
                            }};
                        AppConfig.datasource.show();

                    }).always(function (e) {
                        Spinner.stop();
                    });
                } else {
                    AppConfig.datasource.show();
                }

                _this.init();
            })
        },
        init:function(){
            TemplateTree.setOpt({
                click:{
                    'configure':function(e,treeNode){
                        if (treeNode.srcPageId){
                            //有模板 TODO
                            var diagnosisScreen = new DiagnosisConfigScreen({
                                name: treeNode.name,
                                projId: treeNode.projId,
                                thingId: treeNode._id,
                                srcPageId: treeNode.srcPageId,
                                type: treeNode.type,
                                dictVariable: treeNode.dictVariable
                            });
                            diagnosisScreen.show();
                            //ScreenManager.show(DiagnosisConfigScreen);
                        }else{
                            //无模板 TODO
                            WebAPI.get('/diagnosisEngine/getTemplateList').done(function(result){
                                var tabs = [];
                                var isRepeated;
                                for(var i = 0,iLen=result.data.length;i<iLen;i++){
                                    isRepeated = false;
                                    for(var j = 0,jLen = tabs.length;j<jLen;j++){
                                        if(tabs[j]==result.data[i].type){
                                            isRepeated = true;
                                            break;
                                        }
                                    }
                                    if(!isRepeated){
                                        tabs.push(result.data[i].type);
                                    }
                                }
                                var Template = namespace('factory.components.template.Template');
                                this.template = new Template(PanelToggle.panelCenter);
                                this.template.show(tabs,treeNode);
                            });
                        }
                    }
                }
            });
        },
        onresize:function(){
            PanelToggle.onresize();
        },
        attachEvent:function(){
        },
        close:function(){

        }
    };
    return DiagnosisConfig;
})();
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
var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenModal = undefined;                                   //共用弹出框中，加载对象的引用。若模块有私有弹出框，无需赋值。
var ScreenPrevious = undefined;                                //前一页面对象的引用
var ToolCurrent = undefined;
var Spinner = new LoadingSpinner({color: '#00FFFF'});        //等待加载时的转圈圈
var AppConfig = AppConfig || {
        userId: 101,
        projectId: 72,
        projectList: [{
            "address": "上海市浦东新区金桥镇新金桥路2222",
            "id": 72,
            "lastReceivedTime": "2016-05-20 15:52:09",
            "latlng": "31.260944,121.629994",
            "name_cn": "上海华为",
            "name_en": "shhuawei",
            "name_english": "shhuawei",
            "online": "Online",
            "pic": "shhuawei.jpg",
            "updateMarker": false
        }], //临时数据
        module:'',
        "isFactory": 1
    }; //配置文件
var I18n = I18n ? I18n : undefined;                                          //国际化对象的引用
echarts.config = echarts.config || { color: ['#E2583A','#FD9F08','#FEC500','#1D74A9','#04A0D6','#689C0F','#109d83'] };

$(document).ready(function () {
    InitI18nResource().always(function(rs){
        I18n = new Internationalization(null, rs);
        ScreenManager.show(IndexScreen);
    })
});


var IndexScreen = (function () {
    var _this;
    function IndexScreen() {
        _this = this;
        this.arrColor = ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700", "#6699FF", "#ff6666", "#3cb371", "#b8860b", "#30e0e0"];
    }

    IndexScreen.prototype = {
        show: function () {
            this.init();
        },

        close: function () {
        },

        init: function () {
            PanelToggle.init();
            this.initNav();
            ScreenManager.show(ModuleSelScreen);
            //预加载数据
            WebAPI.get('/analysis/datasource/getDsItemInfo/' + AppConfig.userId + '/null').done(function (result) {
                AppConfig.datasource = new DataSource({
                    store: {
                        group: result
                    },
                    arrColor: _this.arrColor
                });
                AppConfig.datasource.iotOpt = {
                    base:{
                        divideByProject:true
                    },
                    tree:{
                        event:{
                            addDom:function(treeNode,$target){
                                if($target.hasClass('projects')){
                                    $target.find('#' + treeNode.tId + '_span').attr('draggable',true).on('dragstart',function(e){
                                        var ptId = e.currentTarget.parentNode.parentNode.dataset.ptId;
                                        EventAdapter.setData(treeNode)
                                    })
                                }
                            }
                        }
                    }};
                $(PanelToggle.panelRight).append('<div id="dataSrcContain" class="gray-scrollbar" style="height: 100%;overflow-y: auto;"></div>')
            });
            //生成树
            WebAPI.get('/diagnosisEngine/getThingListByProjId/' + AppConfig.projectId).done(function(result){
                if (!result || result.data.length == 0)return;
                var dictGrp = {};
                var arrGrp= [];
                WebAPI.get('/iot/getClassFamily/thing/cn').done(function(dictCls){
                    for (var i = 0; i < result.data.length ;i++){
                        if (!dictGrp[result.data[i].type]){
                            dictGrp[result.data[i].type] = {
                                '_id':ObjectId(),
                                'type':result.data[i].type,
                                'projId':AppConfig.projectId,
                                'open':true
                            };
                            if(dictCls[result.data[i].type] && dictCls[result.data[i].type].name){
                                dictGrp[result.data[i].type].name = dictCls[result.data[i].type].name;
                            }else{
                                dictGrp[result.data[i].type].name = result.data[i].type;
                            }
                            arrGrp.push(dictGrp[result.data[i].type])
                        }
                        result.data[i].tempGrpId = dictGrp[result.data[i].type]['_id'];
                    }
                    TemplateTree && TemplateTree.setData([].concat(arrGrp,result.data));
                    //TemplateTree && TemplateTree.setData([].concat(result.data,result.data));
                })
            })
        },

        initNav:function(){
            document.getElementById('divBrand').onclick = function(){
                ScreenManager.show(IndexScreen);
            };
            document.getElementById('divScreenTtl').onclick = function(){
                ScreenManager.show(IndexScreen);
            }
        }
    };

    return IndexScreen;
})();

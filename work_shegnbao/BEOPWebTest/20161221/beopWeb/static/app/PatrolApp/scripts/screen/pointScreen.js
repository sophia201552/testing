/**
 * Created by win7 on 2016/3/2.
 */
var PointScreen = (function(){
    var _this;
    function PointScreen(data){
        _this = this;
        _this.opt = data?data:{};
        _this.isDel = false;
        _this.gpsOpt = {
            timeout:AppConfig.gpsTime
        };
        _this.curSet = {};
    }
    PointScreen.navOptions = {
        top:
        '<span class="topNavTitle">检查节点中</span>\
        <span id="btnPhoto" class="topNavRight zepto-ev glyphicon glyphicon-earphone"></span>\
        <span id="btnPtList" class="topNavRight zepto-ev glyphicon glyphicon-th-list"></span>',
        bottom: false,
        backDisable: true,
        module: 'project'
    };
    PointScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/pointScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            localStorage.setItem('curSet',JSON.stringify(curSet));
            _this.initNav();
            _this.initContent();
            _this.initPoint();
            _this.initScan();
            _this.initSkip();
            _this.initJudge();
            steps.start();   
        },
        initContent:function(){
            if (typeof _this.opt.ptIndex != 'undefined' && _this.opt.ptIndex != 'null')curSet.ptIndex = _this.opt.ptIndex;
            if (!(curSet.path && curSet.path.path[curSet.ptIndex])){
                curSet.ptCompleteIndex = curSet.path.path.length -1 ;
                router.to({
                    typeClass: MissionResultScreen
                });
                return
            }
            var isFind = false;
            for(var i = 0 ;i < pointAll.length ;i++){
                if (pointAll[i]['_id'] == curSet.path.path[curSet.ptIndex]['_id']){
                    curSet.point = $.extend({},pointAll[i]);
                    isFind = true;
                    break;
                }
            }
            if (!isFind){
                _this.isDel = true;
                var id = ObjectId();
                curSet.point = {
                    '_id':id,
                    'content':'该节点已删除',
                    'isDel':true
                };
            }

        },
        initPoint:function(){
            var $ctnPoint = $('#boxPoint');
            var guideLine,statusTip,point,content;
            if (curSet.path.path[curSet.ptIndex - 1]){
                guideLine = document.createElement('span');
                guideLine.className = 'spGuideLine';
                var prePoint = document.createElement('div');
                prePoint.className = 'divPtTip divPrePt';
                if(!curSet.path.path[curSet.ptIndex - 1].name){
                    prePoint.textContent = '该节点已删除';
                }else {
                    prePoint.textContent = '上一节点：' + curSet.path.path[curSet.ptIndex - 1].name;
                    statusTip = document.createElement('span');
                    switch (curSet.path.path[curSet.ptIndex - 1].error) {
                        case 0:
                            statusTip.className = 'glyphicon glyphicon-ok spStatusTip';
                            prePoint.className += ' statusOk';
                            break;
                        case 1:
                            statusTip.className = 'glyphicon glyphicon-remove spStatusTip';
                            prePoint.className += ' statusErr';
                            break;
                        case 2:
                            statusTip.className = 'glyphicon glyphicon-forward spStatusTip';
                            prePoint.className += ' statusSkip';
                            break;
                    }
                    prePoint.appendChild(statusTip);
                }
                    $ctnPoint.append(prePoint);
                    $ctnPoint.append(guideLine);
            }
            point = document.createElement('div');
            if(_this.isDel){
                point.textContent = '该节点已删除！';
                $ctnPoint.append(point);
                content = document.createElement('div');
                content.className = 'divContent';
                content.textContent = '请跳过该节点！';
                $ctnPoint.append(content);

            }else {
                point.textContent = '请到' + curSet.path.path[curSet.ptIndex].name;
                $ctnPoint.append(point);
                content = document.createElement('div');
                content.className = 'divContent';
                content.textContent = '要求：' + curSet.point.content;
                $ctnPoint.append(content);
            }
            if (curSet.path.path[curSet.ptIndex + 1]){
                guideLine = document.createElement('span');
                guideLine.className = 'spGuideLine';
                $ctnPoint.append(guideLine);
                var nextPoint = document.createElement('div');
                nextPoint.className = 'divPtTip divNextPt';
                if(!curSet.path.path[curSet.ptIndex + 1].name){
                    nextPoint.textContent = '该节点已删除！';
                }else {
                    nextPoint.textContent = '下一节点：' + curSet.path.path[curSet.ptIndex + 1].name;
                }
                $ctnPoint.append(nextPoint);
            }
        },
        initScan:function(){
            if (curSet.path.path[curSet.ptIndex].isScannad == true){
                $('#ctnScan').hide();
                $('#ctnJudge').show();
                return;
            }
            if (_this.isDel){
                $('#btnBarCode').hide();
                return
            }
            $('#btnBarCode').on('tap',function(){
                if (typeof cordova != 'undefined') {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            console.log("We got a barcode\n" +
                                "Result: " + result.text + "\n" +
                                "Format: " + result.format + "\n" +
                                "Cancelled: " + result.cancelled);
                            if(curSet.point.codeQR == result.text) {
                                curSet.path.path[curSet.ptIndex].isScannad = true;
                                localStorage.setItem('curSet',JSON.stringify(curSet));
                                window.plugins.toast.show('二维码校对成功', 'short', 'center');
                            }else{
                                window.plugins.toast.show('二维码校对失败，请重新扫描', 'short', 'center');
                                return;
                            }
                            $('#ctnScan').hide();
                            $('#ctnJudge').show();
                        },
                        function (error) {
                            console.log("Scanning failed: " + error);
                        }
                    );
                }else {
                    curSet.path.path[curSet.ptIndex].isScannad = true;
                    localStorage.setItem('curSet',JSON.stringify(curSet));
                    $('#ctnScan').hide();
                    $('#ctnJudge').show();
                }
            })
        },
        initSkip:function(){
            $('#btnSkip').on('tap',function() {
                router.to({
                    typeClass: PointInfoScreen,
                    data: {state:2}
                });
            });
        },
        initJudge:function(){
            var _this = this;
            $('#btnPtRight').on('tap',function(){
                router.to({
                    typeClass:PointInfoScreen,
                    data:{state:0}
                })
            });
            $('#btnPtError').on('tap',function(){
                router.to({
                    typeClass:PointInfoScreen,
                    data:{state:1}
                })
            });
        },
        //saveGpsInfo:function(pos){
        //    var _this = this;
        //    if (pos){
        //        patrolLog[_this.curSet.patrolIndex].path[_this.curSet.ptIndex].gps = [pos.longitude,pos.latitude];
        //    }else{
        //        patrolLog[_this.curSet.patrolIndex].path[_this.curSet.ptIndex].gps = [];
        //    }
        //},
        //savePtLog:function(state){
        //    if(_this.isDel){
        //        patrolLog[curSet.patrolIndex].path[curSet.ptIndex] = {
        //            '_id': curSet.point['_id'],
        //            'time': new Date().format('yyyy-MM-dd HH:mm:ss'),
        //            'name': '已删除',
        //            'msg': '',
        //            'error': -1,
        //            'arrPic': [],
        //            'isDel': true,
        //            'step':steps.show()
        //        };
        //    }else {
        //        patrolLog[curSet.patrolIndex].path[curSet.ptIndex] = {
        //            '_id': curSet.point['_id'],
        //            'time': new Date().format('yyyy-MM-dd HH:mm:ss'),
        //            'name': curSet.point['name'],
        //            'msg': '',
        //            'error': state,
        //            'arrPic': [],
        //            'step': steps.show()
        //        };
        //    }
        //    if (curSet.ptIndex > curSet.ptCompleteIndex) {
        //        curSet.ptCompleteIndex++;
        //    }
        //    curSet.ptIndex = curSet.ptCompleteIndex + 1;
        //    router.to({
        //        typeClass: PointInfoScreen,
        //        data:{
        //
        //        }
        //    });
        //    SpinnerControl.hide();
        //},
        //getGpsFail:function(state){
        //    window.plugins && window.plugins.toast.show('GPS信息获取失败', 'short', 'center');
        //    _this.savePtLog(state);
        //},
        //getState:function(){
        //    var state = 0;
        //    switch (parseInt(curSet.missionState)) {
        //        case 0:
        //            state = 0;
        //            break;
        //        case 1:
        //            state = 1;
        //            break;
        //        case 2:
        //            state = 2;
        //            break;
        //        case 3:
        //            state = 1;
        //            break;
        //        default :
        //            state = 0;
        //            break;
        //    }
        //    return state;
        //},
        initNav:function(){
            $('#btnPtList').off('touchstart').on('touchstart',function(){
                router.to({
                    typeClass:MissionResultScreen,
                    data:{
                        isToggle:true
                    }
                })
            })
        },
        close:function(){

        }
    };
    return PointScreen
})();
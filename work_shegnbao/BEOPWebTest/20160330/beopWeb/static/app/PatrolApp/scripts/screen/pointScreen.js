/**
 * Created by win7 on 2016/3/2.
 */
var PointScreen = (function(){
    var _this;
    function PointScreen(data){
        _this = this;
    }
    PointScreen.navOptions = {
        top:
        '<span class="topNavTitle">检查节点中</span>\
        <span id="btnPhoto" class="topNavRight zepto-ev glyphicon glyphicon-earphone"></span>',
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
            _this.initContent();
            _this.initPoint();
            _this.initScan();
            _this.initSkip();
            _this.initJudge();
        },
        initContent:function(){
            for(var i = 0 ;i < pointAll.length ;i++){
                if (pointAll[i]['_id'] == curSet.path.path[curSet.ptIndex]['_id']){
                    curSet.point = pointAll[i];
                    break;
                }
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
                prePoint.textContent = '上一节点：' + curSet.path.path[curSet.ptIndex - 1].name;
                statusTip = document.createElement('span');
                switch (curSet.path.path[curSet.ptIndex - 1].error){
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
                $ctnPoint.append(prePoint);
                $ctnPoint.append(guideLine);
            }
            point = document.createElement('div');
            point.textContent = '请到' + curSet.path.path[curSet.ptIndex].name ;
            $ctnPoint.append(point);
            content = document.createElement('div');
            content.className = 'divContent';
            content.textContent = '要求：' + curSet.point.content;
            $ctnPoint.append(content);
            if (curSet.path.path[curSet.ptIndex + 1]){
                guideLine = document.createElement('span');
                guideLine.className = 'spGuideLine';
                $ctnPoint.append(guideLine);
                var nextPoint = document.createElement('div');
                nextPoint.className = 'divPtTip divNextPt';
                nextPoint.textContent = '下一节点：' + curSet.path.path[curSet.ptIndex + 1].name;
                $ctnPoint.append(nextPoint);
            }
        },
        initScan:function(){
            $('#btnBarCode').on('tap',function(){
                if (typeof cordova != 'undefined') {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            console.log("We got a barcode\n" +
                                "Result: " + result.text + "\n" +
                                "Format: " + result.format + "\n" +
                                "Cancelled: " + result.cancelled);
                            if(curSet.point.codeQR == result.text) {
                                window.plugins.toast.show('二维码校对成功', 'short', 'center');
                            }else{
                                window.plugins.toast.show('二维码校对失败，请重现扫描', 'short', 'center');
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
                    $('#ctnScan').hide();
                    $('#ctnJudge').show();
                }
            })
        },
        initSkip:function(){
            $('#btnSkip').on('tap',function(){
                patrolLog[curSet.patrolIndex].path.push({
                    '_id':curSet.point['_id'],
                    'time':new Date().format('yyyy-MM-dd HH:mm:ss'),
                    'name':curSet.point['name'],
                    'msg':'',
                    'error':2,
                    'arrPic':[]
                });
                if (curSet.ptIndex == curSet.path.path.length - 1){
                    patrolLog[curSet.patrolIndex].endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    patrolLog[curSet.patrolIndex].state = _this.getState();
                    router.to({
                        typeClass:MissionResultScreen
                    })
                }else {
                    curSet.ptIndex++;
                    router.to({
                        typeClass: PointScreen
                    })
                }
            })
        },
        initJudge:function(){
            $('#btnPtRight').on('tap',function(){
                patrolLog[curSet.patrolIndex].path.push({
                    '_id':curSet.point['_id'],
                    'time':new Date().format('yyyy-MM-dd HH:mm:ss'),
                    'name':curSet.point['name'],
                    'msg':'',
                    'error':0,
                    'arrPic':[]
                });
                if (curSet.ptIndex == curSet.path.path.length - 1){
                    patrolLog[curSet.patrolIndex].endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    patrolLog[curSet.patrolIndex].state = _this.getState();
                    router.to({
                        typeClass:MissionResultScreen
                    })
                }else {
                    curSet.ptIndex++;
                    router.to({
                        typeClass: PointScreen
                    })
                }
            });
            $('#btnPtError').on('tap',function(){
                router.to({
                    typeClass:PointErrScreen
                })
            })
        },
        getState:function(){
            var state = 1;
            for (var i = 0 ; i < curSet.mission[curSet.path['_id']].length; i++){
                if(curSet.mission[curSet.path['_id']][i] == patrolLog[curSet.patrolIndex].planTime){
                    if (curSet.mission[curSet.path['_id']][i + 1]){
                        if (curSet.mission[curSet.path['_id']][i + 1]){
                            if (new Date(new Date().format('yyyy/MM/dd ') + curSet.mission[curSet.path['_id']][i + 1]) > new Date()){
                                state = 1
                            }else{
                                state = 2
                            }
                        }
                    }
                    if (new Date() - new Date(new Date().format('yyyy/MM/dd ') + curSet.mission[curSet.path['_id']][i]) > 10800000){
                        state = 2
                    }
                }

            }
            return state;
        },
        close:function(){

        }
    };
    return PointScreen
})();
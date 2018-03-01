/**
 * Created by win7 on 2016/3/2.
 */
var PointInfoScreen = (function(){
    var _this;
    function PointInfoScreen(data){
        _this = this;
        _this.opt = data?data:{};
        _this.gpsOpt = {
            timeout:AppConfig.gpsTime
        };
        _this.curSet = {};
    }
    PointInfoScreen.navOptions = {
        top:
        '<span class="topNavTitle">上传信息</span>\
        <span id="btnSure" class="topNavRight zepto-ev">确认</span>\
        <span id="btnPtList" class="topNavRight zepto-ev glyphicon glyphicon-th-list"></span>',
        bottom: false,
        backDisable: false,
        module: 'project'
    };
    PointInfoScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/pointInfoScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initHis();
            _this.initNav();
            _this.initPhoto();
            _this.initPhotoEdit();
            _this.initComment();
            _this.initSure();
        },
        initHis:function(){
            if(curSet.log.path[curSet.ptIndex].msg) {
                $('#iptComment').val(curSet.log.path[curSet.ptIndex].msg);
            }
            for (var i = 0 ; i < curSet.log.path[curSet.ptIndex].arrPic.length;i++){
                var divPhoto = document.createElement('div');
                var imgPhoto = document.createElement('img');
                imgPhoto.src = curSet.log.path[curSet.ptIndex].arrPic[i];
                imgPhoto.className = "imgPhoto zepto-ev";
                divPhoto.className = "divPhoto col-xs-4";
                divPhoto.appendChild(imgPhoto);
                $('#btnPhoto').before(divPhoto)
            }

        },
        initPhoto:function(){
            $('#btnPhoto').on('tap',function(e){
                if(navigator && navigator.camera) {
                    var cameraOpt = {
                        destinationType:Camera.DestinationType.DATA_URL,
                        targetHeight:$(window).height(),
                        targetWidth:$(window).width(),
                        quality:50
                    };
                    navigator.camera.getPicture(
                        function (imgData){
                            console.log('camera Success');
                            var divPhoto = document.createElement('div');
                            var imgPhoto = document.createElement('img');
                            imgPhoto.src = 'data:image/jpeg;base64,' + imgData;
                            imgPhoto.className = "imgPhoto zepto-ev";
                            divPhoto.className = "divPhoto col-xs-4";
                            divPhoto.appendChild(imgPhoto);
                            $(e.currentTarget).before(divPhoto)
                        },
                        function () {
                            console.log('camera Error')
                        },
                        cameraOpt
                    )
                }else {
                    var divPhoto = document.createElement('div');
                    var imgPhoto = document.createElement('img');
                    imgPhoto.className = "imgPhoto zepto-ev";
                    divPhoto.className = "divPhoto col-xs-4";
                    divPhoto.appendChild(imgPhoto);
                    $(e.currentTarget).before(divPhoto)
                }
            })
        },
        initPhotoEdit:function(){
            $('#ctnPhoto').on('tap','img',function(e){
                $(e.currentTarget).parent().remove();
            })
        },
        getPhoto:function(){
            var $img = $('.divPhoto img');
            var arrImg = [];
            for (var i = 0 ; i < $img.length; i++) {
                arrImg.push($img[i].src)
            }
            return arrImg;
        },
        initComment:function(){

        },
        initSure:function(){
            var _this = this;
            $('#btnSure').on('tap',function(){
                _this.curSet = {
                    ptIndex:curSet.ptIndex,
                    path:curSet.path,
                    planTime:curSet.planTime
                };
                if (navigator.geolocation) {
                    //SpinnerControl.show();
                    navigator.geolocation.getCurrentPosition(onGpsSuccess,onGpsFail,_this.gpsOpt);
                }else {
                    onGpsSuccess();
                }
                _this.savePtLog(_this.opt.state);
            });
            function onGpsSuccess(pos){
                if (!pos)pos = {};
                _this.saveGpsInfo(pos.coords);
            }
            function onGpsFail(){
                _this.saveGpsInfo();
            }
        },
        saveGpsInfo:function(pos){
            var _this = this;
            if(!(curSet && curSet.path && curSet.path._id == _this.curSet.path._id && curSet.planTime == _this.curSet.planTime))return;
            if (pos){
                curSet.log.path[_this.curSet.ptIndex].gps = [pos.longitude,pos.latitude];
            }else{
                curSet.log.path[_this.curSet.ptIndex].gps = [];
            }
        },
        savePtLog:function(state){
            if(curSet.point.isDel){
                curSet.log.path[curSet.ptIndex] = {
                    '_id': curSet.point['_id'],
                    'time': new Date().format('yyyy-MM-dd HH:mm:ss'),
                    'name': '已删除',
                    'msg': '',
                    'error': -1,
                    'arrPic': [],
                    'isDel': true,
                    'step': steps.show()
                };
            }else {
                curSet.log.path[curSet.ptIndex] = {
                    '_id':curSet.point['_id'],
                    'time':new Date().format('yyyy-MM-dd HH:mm:ss'),
                    'name':curSet.point['name'],
                    'msg':$('#iptComment').val(),
                    'error':state,
                    'arrPic': _this.getPhoto(),
                    'step': steps.show()
                };
            }
            if (curSet.ptIndex == curSet.ptCompleteIndex + 1) {
                curSet.ptCompleteIndex++;
            }
            curSet.path.path[curSet.ptIndex].isChecked = true;
            curSet.ptIndex = curSet.ptCompleteIndex + 1;
            while(curSet.path.path[curSet.ptIndex] && curSet.path.path[curSet.ptIndex].isChecked){
                curSet.ptCompleteIndex = curSet.ptIndex;
                curSet.ptIndex++;
            }
            if (curSet.ptCompleteIndex + 1 == curSet.path.path.length) {
                router.to({
                    typeClass: MissionResultScreen
                })
            } else {
                router.to({
                    typeClass: PointScreen
                })
            }
            SpinnerControl.hide();
        },
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
    return PointInfoScreen
})();
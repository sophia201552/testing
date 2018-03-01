/**
 * Created by win7 on 2016/3/2.
 */
var PointErrScreen = (function(){
    var _this;
    function PointErrScreen(data){
        _this = this;
        _this.opt = data?data:{};
    }
    PointErrScreen.navOptions = {
        top:
        '<span class="topNavTitle">上传错误信息</span>\
        <span id="btnSure" class="topNavRight zepto-ev">确认</span>',
        bottom: false,
        backDisable: false,
        module: 'project'
    };
    PointErrScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/pointErrScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initPhoto();
            _this.initPhotoEdit();
            _this.initComment();
            _this.initSure();
        },
        initPhoto:function(){
            $('#btnPhoto').on('tap',function(e){
                if(navigator && navigator.camera) {
                    var cameraOpt = {
                        destinationType:Camera.DestinationType.DATA_URL
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
            $('#btnSure').on('tap',function(){
                patrolLog[curSet.patrolIndex].path.push({
                    '_id':curSet.point['_id'],
                    'time':new Date().format('yyyy-MM-dd HH:mm:ss'),
                    'name':curSet.point['name'],
                    'msg':$('#iptComment').val(),
                    'error':1,
                    'arrPic':_this.getPhoto()
                });
                if (curSet.ptIndex == curSet.path.path.length - 1){
                    patrolLog[curSet.patrolIndex].endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    patrolLog[curSet.patrolIndex].state = _this.getState();
                    patrolLog[curSet.patrolIndex].state = 0;
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
    return PointErrScreen
})();
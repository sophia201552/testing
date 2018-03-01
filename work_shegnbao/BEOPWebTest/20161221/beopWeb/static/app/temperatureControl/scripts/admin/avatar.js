/**
 * Created by vicky on 2016/9/2.
 */
var Avatar = (function(){

    Avatar.navOptions = {
        top: '<span class="topNavTitle" i18n="admin.avatar.MY_AVATAR"></span><span class="glyphicon glyphicon-option-horizontal" id="btnChangeAvatar"></span>'
    };

    function Avatar(){

    }

    Avatar.prototype = {
        show: function () {
            var _this = this;
            WebAPI.get('static/app/temperatureControl/views/admin/avatar.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                I18n.fillArea($('#indexMain'));
                I18n.fillArea($('#navTop'));
                _this.init();
                _this.attachEvent();
            });
        },
        init: function(){
            this.$main = $('#divAvatar');
            if(AppConfig.userProfile){
                AppConfig.userProfile.picture && $('#bigAvatar', this.$main).attr('src', 'http://images.rnbtech.com.hk' + AppConfig.userProfile.picture);
            }
        },
        close: function(){

        },
        attachEvent: function(){
            var _this = this;
            var $bigAvatar = $('#bigAvatar', this.$main);
            var $wrapImgCut = $('#wrapImgCut', this.$main);
            var $divButtons = $('#divButtons', this.$main);
            var $clipArea = $('#clipArea', this.$main);
            var $file = $('#file', this.$main);

            //弹出选择的按钮
            $('#btnChangeAvatar,#bigAvatar').off('touchend').on('touchend', function(){
                $divButtons.toggle();
            });

            //从相册选择
            $('#btnSelectFromAlbum', this.$main).off('touchend').on('touchend', function(){
                $divButtons.hide();
                return  $file.click();
            });

            //取消
             $('#btnCancelChange', this.$main).off('touchend').on('touchend', function(){
                $divButtons.hide();
            });

            //空白处
            $('#divAvatar', this.$main).off('touchend').on('touchend', function(e){
                e.stopPropagation();
                $divButtons.hide();
            });

            $clipArea.photoClip({
                width: 200,
                height: 200,
                file: "#file",
                view: "#view",
                ok: "#clipBtn",
                loadStart: function() {
                    console.log("照片读取中");
                    Spinner.spin(_this.$main[0])
                },
                loadComplete: function() {
                    console.log("照片读取完成");
                    Spinner.stop();
                    $bigAvatar.hide();
                    $wrapImgCut.show();
                },
                clipFinish: function(dataURL) {
                    upload(dataURL);
                }
            });

            function upload(dataURL){
                WebAPI.post('/admin/base64ToImg', {'userId': AppConfig.userId, base64: dataURL.split('base64,')[1]}).done(function(result){
                    if (result.success) {
                        AppConfig.userProfile.picture = result.data;
                        $wrapImgCut.hide();
                        $bigAvatar.attr('src', 'http://images.rnbtech.com.hk' + result.data).show();
                    } else {
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.avatar.FAIL_CHANGE, 'short', 'center');
                    }
                }).always(function(){

                });
            }
        }
    }

    return Avatar;
})();
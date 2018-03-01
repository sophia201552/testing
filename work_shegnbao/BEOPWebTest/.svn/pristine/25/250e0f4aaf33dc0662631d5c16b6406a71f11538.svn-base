/**
 * Created by vicky on 2016/9/1.
 */
var PersonalCenter = (function(){

    PersonalCenter.navOptions = {
        top: '<span class="topNavTitle" i18n="admin.setUp.PERSONAL_CENTER"></span>'
    };

    function PersonalCenter(){

    }

    PersonalCenter.prototype = {
        show: function(){
            var _this = this;
            WebAPI.get('static/app/temperatureControl/views/admin/personalCenter.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                I18n.fillArea($('#indexMain'));
                I18n.fillArea($('#navTop'));
                _this.init();
            });
        },

        init: function(){
            this.$main = $('#personalCenter');

            if(AppConfig.userProfile){
                AppConfig.userProfile.picture && $('.imgUser', this.$main).attr('src', 'http://images.rnbtech.com.hk' + AppConfig.userProfile.picture);
                AppConfig.userProfile.email && $('#iptEmail', this.$main).val(AppConfig.userProfile.email);
                AppConfig.userProfile.sex.toString() && ($('#divSex div[data-value="'+ AppConfig.userProfile.sex +'"]', this.$main).addClass('selected'),$('.sex').html($('#divSex div[data-value="'+ AppConfig.userProfile.sex +'"] span').eq(1).html()));
                AppConfig.userProfile.core && $('#iptPhoneNum', this.$main).val(AppConfig.userProfile.core);// 为什么手机号是core
            }
            if (window.customVariable.isEdit) {
                //添加编辑状态样式
                var $btnEdit = $('#btnEdit');
                $('.info-edit').removeClass('noEdit');
                $btnEdit.removeClass('edit');
                $btnEdit.find('button').html(I18n.resource.admin.personalCenter.FINISH);
            }
            this.attachEvent();
        },

        close: function(){

        },

        attachEvent: function(){
            var _this = this;
            var windowHeight = $(window).height();
            $(window).resize(function () {
                var newHeight = $(window).height();
                var $btn = $('#btnEdit');
                if (newHeight < windowHeight) {
                    $btn.addClass('down');
                } else {
                    $btn.removeClass('down');
                }
            });
            //编辑
            $('#btnEdit',this.$main).off('touchend').on('touchend', function(e){
                var $this = $(this);
                if ($this.hasClass('edit')) {
                    $('.info-edit').removeClass('noEdit');
                    $this.removeClass('edit');
                    $this.find('button').html(I18n.resource.admin.personalCenter.FINISH);
                    window.customVariable.isEdit = true;
                } else {
                    var $emailRemove = $('.glyphicon-remove', this.$main);
                    if(!$emailRemove.hasClass('hidden')){
                        $emailRemove.trigger('touchend');
                    }
                    $('.info-edit').addClass('noEdit');
                    $this.addClass('edit');
                    $this.find('button').html(I18n.resource.admin.personalCenter.EDIT);
                    window.customVariable.isEdit = false;
                }
                e.preventDefault();
            });
            //点击头像跳转到可更换头像页面,
            $('.divUserPic', this.$main).off('touchend').on('touchend', function (e) {
                if ($(this).hasClass('noEdit')) return;
                router.to({
                    typeClass: Avatar
                });
                e.preventDefault();
            });

            // 编辑电话
            $('#btnEditPhone', this.$main).off('touchend').on('touchend', function(e){
                router.to({
                    typeClass: PhoneNumber
                });
                e.preventDefault();
            });

            // 编辑email
            $('.btnEdit', this.$main).off('touchend').on('touchend', function(){
                var btnEdit = this;
                var $input = $('#iptEmail', _this.$main);
                var formData, email;
                var regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                //变成可编辑输入框
                if($input.attr('disabled')){
                    $input.removeAttr('disabled');
                    $(btnEdit).removeClass('glyphicon-edit').addClass('glyphicon-ok');
                    $('.glyphicon-remove').removeClass('hidden');
                    $input.val('');
                    setTimeout(function () {$input[0].focus();},100)
                    
                }else{//发送邮件
                    email = $input.val();
                    //check email
                    if(!regEmail.test(email)){
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.personalCenter.EMAIL_FORMAT_ERROR, 'short', 'center');
                        return;
                    }
                    formData = new FormData();
                    formData.append('reciepent', email);
                    formData.append('title', 'Email from Beop temperature');
                    formData.append('body', 'Bind email success!');
                    $.ajax({
                        url: 'http://beop.rnbtech.com.hk/mail',//beop.rnbtech.com.hk
                        type: 'POST',
                        data: formData,
                        cache: false,
                        processData: false,
                        contentType: false,
                        success: function (result) {
                            if(result && JSON.parse(result) == 'success'){
                                window.plugins && window.plugins.toast.show(I18n.resource.admin.personalCenter.EMAIL_SEND_SUCCESS, 'short', 'center');
                                $input.attr('disabled', true);
                                $(btnEdit).removeClass('glyphicon-ok').addClass('glyphicon-edit');

                                WebAPI.post('/user/updateinfo',{useremail: email, userId: AppConfig.userId}).done(function(result){//http://beop.rnbtech.com.hk
                                    if(result){
                                        window.plugins && window.plugins.toast.show(I18n.resource.admin.personalCenter.EMAIL_CHANGED_SUCCESS, 'short', 'center');
                                        AppConfig.userProfile.email = email;
                                        $('.glyphicon-remove').trigger('touchend');
                                    }
                                });
                            }else{
                                window.plugins && window.plugins.toast.show(I18n.resource.admin.personalCenter.EMAIL_SEND_FAIL, 'short', 'center');
                                $('.glyphicon-remove').trigger('touchend');
                            }
                        }
                    });
                }

            });

            $('.glyphicon-remove', this.$main).off('touchend').on('touchend', function () {
                var $input = $('#iptEmail', _this.$main);
                $input.val(AppConfig.userProfile.email);
                $input.attr('disabled','disabled');
                $('.btnEdit').addClass('glyphicon-edit').removeClass('glyphicon-ok');
                $('.glyphicon-remove').addClass('hidden');
            });

            //性别选择按钮
            $('.divSexItem', this.$main).off('touchend').on('touchend', function(){
                var sex = parseInt(this.dataset.value);
                $(this).addClass('selected').siblings('.divSexItem').removeClass('selected');
                WebAPI.post('/user/updateinfo',{usersex: sex, userId: AppConfig.userId}).done(function(result){//http://beop.rnbtech.com.hk
                    if(result){
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.personalCenter.SEX_CHANGED_SUCCESS, 'short', 'center');
                        AppConfig.userProfile.sex = sex;
                        $('.sex').html($('#divSex div[data-value="' + AppConfig.userProfile.sex + '"] span').eq(1).html());
                    }else{
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.personalCenter.SEX_CHANGED_FAILED, 'short', 'center');
                    }
                });
            });
        }
    }

    return PersonalCenter;
})();
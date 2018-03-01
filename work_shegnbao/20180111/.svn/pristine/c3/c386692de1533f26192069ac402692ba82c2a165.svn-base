/**
 * Created by vicky on 2016/9/8.
 */

var PhoneNumber = (function(){

    PhoneNumber.navOptions = {
        top: '<span class="topNavTitle" i18n="admin.phoneNumber.TITLE"></span>'
    };

    function PhoneNumber(){

    }

    PhoneNumber.prototype = {
        show: function(){
            var _this = this;
            WebAPI.get('static/app/temperatureControl/views/admin/phoneNumber.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                I18n.fillArea($('#indexMain'));
                I18n.fillArea($('#navTop'));
                _this.init();
                _this.attachEvent();
            });
        },
        init: function(){
            this.$main = $('#phoneNumber');
            this.$iptPhoneNum = $('#iptPhoneNum', this.$main);
            AppConfig.userProfile.core && this.$iptPhoneNum.val(AppConfig.userProfile.core);
        },
        close: function(){

        },
        attachEvent: function(){
            var _this = this;
            var $btnBind = $('#btnBind', this.$main);
            var $btnCheckCode = $('#btnCheckCode', this.$main);
            var $btnGetCode = $('#btnGetCode', this.$main);
            var $spanClear = $('.spanClear', this.$main);
            var regPhoneNum = /^1[3|4|5|7|8]\d{9}$/;

            //获取验证码
            $btnBind.off('touchend').on('touchend', function(e){
                var phoneNum = _this.$iptPhoneNum.val();
                //check phone number
                if(!regPhoneNum.test(phoneNum)){
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.phoneNumber.INPUT_VALID_PHONE_NUM, 'short', 'center');
                    return;
                }

                //判断输入的号码是否和原来的一致
                if(phoneNum == AppConfig.userProfile.core){
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.phoneNumber.PHONE_NUM_IS_SAME, 'short', 'center');
                    return;
                }

                $('#divCheckCode,#btnGetCode', _this.$main).removeClass('hidden');
                $(this).parent().hide();

                //获取验证码
                getCheckCode(phoneNum)
            });

            //发送验证码
            $btnCheckCode.off('touchend').on('touchend', function(e){
                var phoneNum = _this.$iptPhoneNum.val();
                var code = $('#iptCode', _this.$main).val();
                WebAPI.post('/user/bindingphone',{userId: AppConfig.userId, phone: phoneNum, code: code}).done(function(result){//http://beop.rnbtech.com.hk
                    if(result.data){//绑定成功
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.phoneNumber.BIND_PHONE_SUCCESS, 'short', 'center');
                        $('#divCheckCode,#btnGetCode', _this.$main).addClass('hidden');
                        $btnBind.parent().show();
                        AppConfig.userProfile.core = phoneNum;
                    }else{
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.phoneNumber.SMS_CODE_ERROR, 'short', 'center');
                    }
                });
            });

            $btnGetCode.off('touchend').on('touchend', function(e){
                if(!this.disabled){
                    getCheckCode(_this.$iptPhoneNum.val())
                }
            });

            //清除手机号
            $spanClear.off('touchend').on('touchend', function(e){
                _this.$iptPhoneNum.val('');
            });

            function getCheckCode(phoneNum){
                var count = 60;
                var interval = setInterval(function(){
                    $('#timeCount', this.$main).text(count + 's');
                    if(count > 1){
                        count--;
                    }else{
                        $btnGetCode.removeAttr('disabled');
                        $('#timeCount', this.$main).text('');
                        clearInterval(interval);
                    }
                },1000);
                $btnGetCode.attr('disabled', true);
                WebAPI.post('/user/sendverifymessage',{userId: AppConfig.userId, phone: phoneNum}).done(function(result){//http://beop.rnbtech.com.hk
                    if(result.data){
                        if(result.data == 2){
                            window.plugins && window.plugins.toast.show(I18n.resource.admin.phoneNumber.SEND_SMS_CODE_FAIL, 'short', 'center');
                        }else if(result.data == 1){
                            window.plugins && window.plugins.toast.show(I18n.resource.admin.phoneNumber.PHONE_NUM_EXIST, 'short', 'center');
                        }
                        $btnGetCode.removeAttr('disabled');
                        clearInterval(interval);
                        $('#timeCount', this.$main).text('');
                    }
                });
            }
        }
    }

    return PhoneNumber;
})();
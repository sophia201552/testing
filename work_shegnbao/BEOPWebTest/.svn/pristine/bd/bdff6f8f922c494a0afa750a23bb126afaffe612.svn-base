/**
 * Created by win7 on 2015/11/3.
 */
var MessagePush = (function(){
    var _this = this;
    function MessagePush(messageDate){
        _this = this;
        this.messageDate = messageDate;
    }
    MessagePush.navOptions = {
        top: '<div class="topNavTitle" i18n="appDashboard.message.MESSAGE_CENTER"></div>',
        bottom:true,
        backDisable:false,
        module:'message'
    };
    MessagePush.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/message/messagePush.html'}).done(function(resultHTML){
                $('#btnMessage .messageNum').hide();
                $(ElScreenContainer).html(resultHTML);
                _this.init();
                I18n.fillArea($('#navTop'));
            });
        },
        init:function(){
            _this.initHistoryList();
            _this.initMessageList();
            _this.clearCache();
            _this.resetHistory();
        },
        initMessageList:function(){
            var str = '<ul id="messagePushList">';
            for(var i=0,len=this.messageDate.length;i<len;i++){
                str += '<li class="' + (this.messageDate[i].isHistory?'isHistory':'isNew') + '">\
                            <span href="">\
                                <h3>'+this.messageDate[i].title+'</h3>\
                                <span class="time">'+this.messageDate[i].time+'</span>\
                                <p class="content">'+this.messageDate[i].content+'</p>\
                            </span>\
                            <span class="btnRemove glyphicon glyphicon-remove zepto-ev"</span>\
                        </li>'
            }
            str+="</ul>";
            $(".containerMessagePush").html(str);
        },
        initHistoryList:function(){
            var his;
            try {
                his = JSON.parse(localStorage.getItem('reportHistory'));
            }catch(e){

            }
            if (his instanceof Array && his.length > 0){

                this.messageDate = this.messageDate.concat(his);
            }
        },
        clearCache:function(){
            var msg;
            try {
                msg = JSON.parse(localStorage.getItem('pushMsg'));
                msg = msg.filter(function(item){
                    return item.type!='message'
                });
                localStorage.setItem('pushMsg',JSON.stringify(msg));
            }catch(e){
                msg = null;
                localStorage.removeItem('pushMsg');
            }
        },
        resetHistory:function(){
            var index;
            var liPushList = $('#messagePushList').children('li');
            this.messageDate.forEach(function(val){
                val.isHistory = true;
            });
            localStorage.setItem('reportHistory',JSON.stringify(_this.messageDate));
            liPushList.find('.btnRemove').off('tap').on('tap',function(e){
                liPushList = $('#messagePushList').children('li');
                index = liPushList.index($(e.currentTarget).parent());
                $(e.currentTarget).parent().remove();
                _this.messageDate.splice(index,1);
                localStorage.setItem('reportHistory',JSON.stringify(_this.messageDate));
            })
        },
        close:function(){

        }
    };
    return MessagePush;
})();
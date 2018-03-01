/**
 * Created by vicky on 2016/3/14.
 */
var NewsCenter = (function(){
    var _this;

    NewsCenter.navOptions = {
        top: '<span class="topNavTitle">消息</span>'
    };

    function NewsCenter(){
        _this = this;
    }

    NewsCenter.prototype = {
        show: function () {
            var strHtml = '\
                <style>\
                    .list-unstyled .item{\
                        border-top: 1px solid #eee;\
                        padding: 10px 20px;\
                    }\
                </style>\
                <ul class="list-unstyled">';
            for(var i = 0, news; i < router.newsList.length; i ++){
                news = router.newsList[i];
                strHtml += ('<li class="item" data-id="'+ news._id +'">'+ news.text +'</li>');
            }
            strHtml += '</ul>';
            $('#indexMain').html(strHtml);

            this.attachEvents();
        },
        attachEvents: function () {
            // 后退按钮
            /*$('#btnBack').hammer().off('tap').on('tap', function (e) {
                router.back();
            });*/
        },
        close:function(){

        }
    };

    return NewsCenter;
})();

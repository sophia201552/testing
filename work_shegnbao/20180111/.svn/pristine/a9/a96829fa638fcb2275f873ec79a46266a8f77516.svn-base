/**
 * Created by vicky on 2016/3/14.
 */
var NewsCenter = (function() {
    var _this;

    NewsCenter.navOptions = {
        top: '<span class="navTopItem title middle" i18n="admin.navTitle.INFO"></span>'
    };

    function NewsCenter() {
        _this = this;
    }

    NewsCenter.prototype = {
        show: function() {
            var strHtml = '\
                <style>\
                    .list-unstyled .item{\
                        width: 100%;\
                        height: auto;\
                        min-height: 4rem;\
                    }\
                    .list-unstyled .titleBox{\
                        height: 4rem;\
                        line-height: 4rem;\
                        padding: 0 20px;\
                    }\
                    .list-unstyled .time{\
                        text-align: right;\
                        width: 20%;\
                        float: right;\
                    }\
                    .list-unstyled .ellipsis{\
                        overflow: hidden;\
                        white-space: nowrap;\
                        text-overflow: ellipsis;\
                    }\
                    .list-unstyled .title{\
                        float: left;\
                        width: 80%;\
                        color: #eee;\
                    }\
                    .list-unstyled .msg{\
                        height: 0px;\
                        overflow:hidden;\
                        width: 100%;\
                        text-indent: 2rem;\
                        word-wrap:break-word;\
                        padding: 0 20px;\
                    }\
                    .list-unstyled .msg.show{\
                        height: auto;\
                    }\
                    .list-unstyled .msg h4{\
                        text-align:center;\
                    }\
                </style>\
                <ul id="newsList" class="list-unstyled">';

            for (var i = 0, news; i < router.newsList.length; i++) {
                news = router.newsList[i];
                strHtml += ('<li class="item listBorder">\
                            <div class="titleBox">\
                                <div class="title ellipsis">' + news.title + '</div>\
                                <div class="time">' + news.time + '</div>\
                            </div>\
                            <div class="msg"><h4>' + news.title + '</h4><p>' + news.content + '</p></div>\
                        </li>');
            }
            strHtml += '</ul>';
            $('#indexMain').html(strHtml);
            I18n.fillArea($('#navTop'));
            this.attachEvents();
            localStorage.setItem('oldPushMsg', JSON.stringify(router.newsList));
        },
        attachEvents: function() {
            //显示内容
            $('li').hammer().off('tap').on('tap', function(e) {
                $(this).find('.msg').toggleClass('show');
            });
        },
        close: function() {

        }
    };

    return NewsCenter;
})();
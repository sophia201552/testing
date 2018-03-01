(function () {
    /*移动端适配*/
    var isMobile = false
    function setBrowerEnv(){
        var mobileAgent = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        var flag = true;  
        for (var v = 0; v < mobileAgent.length; v++) {  
            if (navigator.userAgent.indexOf(mobileAgent[v]) > 0) { flag = false; break; }  
        }  
        isMobile = !flag

        if(isMobile){
            $(document.getElementsByTagName('html')[0]).addClass('isMobile').css('opacity',1)
        }else{
            $(document.getElementsByTagName('html')[0]).addClass('isPc').css('opacity',1)
        }
        // var style=document.createElement('link')
        // style.setAttribute('rel','stylesheet')
        // if (isMobile){
        //     style.setAttribute('href','./css/main_m.css')
        //     $(document.getElementsByTagName('html')[0]).addClass('isMobile')
        // }else{
        //     style.setAttribute('href','./css/main.css')
        // }
        // document.getElementsByTagName('head')[0].appendChild(style)
        // style.onload = function(){
        //     document.getElementsByTagName('html')[0].style.display="block"
        // }
    }

    setBrowerEnv()

    window.scrollReveal = new scrollReveal({
        reset: true
    });
    $(function () {
        var a = $('#menu'),
            b = a.offset();
        $(document).on('scroll', function () {
            var c = $(document).scrollTop();
            if (b.top < c) {
                a.addClass('scroll-bg');
            } else {
                a.removeClass('scroll-bg');
            }
        })
    });
    
    InitI18nResource(localStorage['language'], true, 'js/i18n/').always(function (rs) {
        I18n = new Internationalization(null, rs);
        I18n.fillPage();
    });
    //语言切换
    $("#language").off('click').on('click','a',function (e) {
        var lan = $(e.currentTarget).attr('lang');
        InitI18nResource(lan, true, 'js/i18n/').always(function (rs) {
            I18n = new Internationalization(null, rs);
            I18n.fillPage();
            //Session.setAttribute('I18n', new Internationalization(null, rs));
            window.onLanguageChange && window.onLanguageChange();
        });
        // I18n.fillPage();
        e.preventDefault();
    });

    if (localStorage['language'] && localStorage['language'] === 'zh') {
        if (window.screen.width < 1200) {
            $('.timeline').find('.timeline-item').eq(5).css('margin-top', '1.0rem');
        }
    }
    //链接定位
    var navDom = document.getElementById('menu');
    var pageDom = document.getElementById('pageCtn');
    function hrefRouter(){
        var promise = $.Deferred();
        var src = '';
        var hash = '';
        var archor = '';
        if (!location.hash || !location.hash.split('#')[1]){
            hash = 'homepage';
        }else{
            hash = location.hash.split('#')[1]
        }
        archor = hash.split('.')[1]
        src = './'+ hash.split('.')[0]
        window.onLanguageChange = null;
        $.get(src + (isMobile?'_m':'') + '.html').done(function(html){
            $(pageDom).html(html);
            scrollReveal.init();
            if (archor){
                var archorDom = document.getElementById(archor)
                if (archorDom){
                    window.scrollTo(0,$(archorDom).offset().top)
                }else{
                    window.scrollTo(0,0)
                }
            }else{
                window.scrollTo(0,0)
            }
            otherAttevents();            
            promise.resolve();
        }).fail(function(){
            $.get(src + '.html').done(function(html){
                $(pageDom).html(html);
                scrollReveal.init();
                if (archor){
                    var archorDom = document.getElementById(archor)
                    if (archorDom){
                        window.scrollTo(0,$(archorDom).offset().top)
                    }else{
                        window.scrollTo(0,0)
                    }
                }else{
                    window.scrollTo(0,0)
                }
                otherAttevents();            
                promise.resolve();
            })
        })
        return promise.promise()
    }

    hrefRouter();
    attachEvent();
    //页面刷新时国际化不加载
    // window.onload = function(){
    //     otherAttevents();
    // }
    function attachEvent(){
        $(navDom).on('mouseover','.navItem',function(e){
            var target = e.currentTarget;
            $(target).siblings().removeClass('focus')
            $(target).addClass('focus');
            // location.hash=target.dataset.page;
        })
        $(navDom).on('mouseleave','.navItem',function(e){
            var target = e.currentTarget;
            $(target).removeClass('focus');
            // location.hash=target.dataset.page;
        })
        window.onhashchange = function(){
            hrefRouter();
        }
    }
    function otherAttevents(){
        //其他页面的一些事件
        if (typeof I18n != 'undefined'){ 
            I18n.fillArea($('body'));
        }
        $('.newsImg').hover(function(){
            $(this).addClass('active');
        },function(){
            $(this).removeClass('active');
        });
    }

    var htmlDom = document.getElementsByTagName('html')[0]
    function setRootFontSize(){
        var size = 10 + Math.floor((window.innerWidth - 1000) / 200) 
        htmlDom.style.fontSize =  size + 'px'
    }
    setRootFontSize();
    window.onresize = setRootFontSize
}());


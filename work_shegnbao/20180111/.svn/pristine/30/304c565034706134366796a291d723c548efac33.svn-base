(function () {
    /*移动端适配*/
    var isMobile = false
    function setBrowerEnv(){
        var mobileAgent = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        var flag = true;  
        for (var v = 0; v < mobileAgent.length; v++) {  
            if (navigator.userAgent.indexOf(mobileAgent[v]) > 0) { flag = false; break; }  
        }  
        var isIpad = false;
        if (navigator.userAgent.indexOf('iPad') >= 0){
            isIpad = true
        }
        isMobile = !flag
        if(location.search==='?isMobile=0'){
            isMobile=false;
        }
        if (isIpad){
            $(document.getElementsByTagName('html')[0]).addClass('isIpad');
        }
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
        var winHeight=window.innerHeight/3;
        $(window).off('resize').on('resize', function () {
            winHeight=window.innerHeight/3;
            b=winHeight;
        })
        b=winHeight;
        
        $(document).on('scroll', function () {
            var c = $(document).scrollTop();
            if (b < c) {
                a.addClass('scroll-bg');
            } else {
                a.removeClass('scroll-bg');
            }
        })
    });
    
    InitI18nResource(localStorage['language'], true, 'js/i18n/').always(function (rs) {
        I18n = new Internationalization(null, rs);
        I18n.fillPage();
        if(localStorage.language){
            $('#language').find('[lang|='+localStorage.language+']').addClass('selected');
            if(isMobile){
                $('#language').find('a').addClass('languageColorDefault')
                $('#language').find('[lang|='+localStorage.language+']').addClass('languageColor')
                $('#language').find('[lang|='+localStorage.language+']').before('<span class=" iconfont  icon-zhongyingwenqiehuan languageIcon"></span>')
            }else{
                $('.languageIcon').remove();
                $('.languageColor').removeClass('languageColor');
            }
          
        }else{
            
        }
        // $('#language').find("[data-lang]"=localStorage['language']).before('<span class=" iconfont  icon-zhongyingwenqiehuan languageIcon"></span>')
    });
    //语言切换
    $("#language").off('click').on('click','a',function (e) {
        var lan = $(e.currentTarget).attr('lang');
        if(isMobile){
            $('.languageIcon').remove();
            $('.languageColorDefault').removeClass('languageColor');
            $(this).addClass('languageColor')
            $(this).before('<span class=" iconfont  icon-zhongyingwenqiehuan languageIcon"></span>')
        }
        $('#language').find('[lang]').removeClass('selected');
        $('#language').find('[lang|='+lan+']').addClass('selected');
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
        if (!isMobile){
            $(navDom).on('mouseover','.navItem',function(e){
                var target = e.currentTarget;
                $(target).siblings().removeClass('focus')
                $(target).addClass('focus expand');
                // location.hash=target.dataset.page;
            })
            $(navDom).on('mouseleave','.navItem',function(e){
                var target = e.currentTarget;
                $(target).removeClass('focus expand');
                // location.hash=target.dataset.page;
            })
            
           
        }else{
            $(navDom).on('click','.navTag>a',function(e){
                var target = e.currentTarget;
                var parent = target.parentNode;
                if (target.href){
                    if ($(parent).hasClass('level1') || $(parent).hasClass('level2')){
                        if (!$(parent).hasClass('focus')){
                            $(navDom).find('.navTag').removeClass('focus')
                            $(parent).parent().parent().addClass('focus')
                            $(parent).addClass('focus')
                            $(document.getElementById('menu')).removeClass('expand')
                        }
                    }else{
                        if (!$(parent).hasClass('focus')){
                            $(navDom).find('.navTag').removeClass('focus')
                            $(parent).addClass('focus expand')
                            $(document.getElementById('menu')).removeClass('expand')
                        }
                    }
                }else{
                    $(parent).toggleClass('expand')
                }
                // if ($(parent).hasClass('level1') || $(parent).hasClass('level2')){
                //     if ($(parent).hasClass('focus')){
                //         $(parent).removeClass('focus')
                //     }else {
                //         $(parent).siblings().removeClass('focus')
                //         $(parent).addClass('focus');
                //         if (target.href)$(document.getElementById('menu')).removeClass('expand')
                //     }
                // }else{
                //     if ($(parent).hasClass('focus')){
                //         $(parent).removeClass('focus')
                //     }else {
                //         $(parent).siblings().removeClass('focus')
                //         $(parent).addClass('focus');
                //         if (target.href)$(document.getElementById('menu')).removeClass('expand')
                //     }
                // }
                // if ($(parent).find('.subMenu').length > 0){
                //     $(parent).toggleClass('expand')
                // }
            })
            $(navDom).on('click','.navItem .btnSubExpand',function(e){
                e.stopPropagation();
                e.preventDefault();
                var target = e.currentTarget.parentNode;
                if ($(target).find('.subMenu').length > 0){
                    $(target).toggleClass('expand')
                }
            });

        }
        window.onhashchange = function(){
            hrefRouter();
        }
        attachMobileEvents();
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

    function attachMobileEvents(){
        var navCtn = document.getElementById('menu')
        document.querySelector('.btnNavExpand').onclick = function(){
            $(navCtn).addClass('expand')
        }
         document.querySelector('.weixinModal').onclick=function(){
            $('#weixinModal').show();
        }
        document.querySelector('.mobileToTop').onclick=function(){
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        document.querySelector('.navbar-backdrop').onclick = function(){
            $(navCtn).removeClass('expand')
        }
        document.querySelector('.mobileToPC').onclick=function(){
            isMobile=false;
            location=location.pathname+'?isMobile=0'+location.hash
           
        }
    }
    var htmlDom = document.getElementsByTagName('html')[0]
    function setRootFontSize(){
        var size = 10 + Math.floor((window.innerWidth - 1000) / 200);
        if(window.innerWidth < 768) {
            size = 10;
        } 
        htmlDom.style.fontSize =  size + 'px'
    }
    setRootFontSize();
    window.onresize = setRootFontSize
}());


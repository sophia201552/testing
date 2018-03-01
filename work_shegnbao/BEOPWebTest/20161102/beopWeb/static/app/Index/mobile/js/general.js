(function () {
    InitI18nResource(localStorage['language'], true, 'js/i18n/').always(function (rs) {
        I18n = new Internationalization(null, rs);
    });
    I18n.fillPage();
    //for resizing the window 
    var rs;
    $(window).resize(function () {
        clearTimeout(rs);
        rs = setTimeout(resizeEnd, 200);
    });

    function resizeEnd() {
        var innerHeight = $(window).innerHeight(),
            innerWidth = $(window).width(),
            headerHeight = $(".reg-hd").height();
        //hide navigation bar and show btn when the window is smaller than a set width
        var $ul = $(".hd-bar");

        if (headerHeight - innerHeight <= 660) {
            $(".sub-wrap").css("height", "660");
        } else {
            $(".sub-wrap").css("height", innerHeight - headerHeight);
        }
    }

    // window.addEventListener("scroll", function(){
    //     var top = $(window).scrollTop();
    //     var $header = $(".reg-hd"),
    //         $wrap = $(".main-wrap");
    //         if(top !== 0){
    //             if($header.hasClass("sticky")){
    //                 return;
    //             }else{
    //                 $header.addClass("sticky");
    //                 // $wrap.addClass("sticky");
    //             }
    //         }else{
    //          	if($header.hasClass("sticky")){
    //                 $header.removeClass("sticky");
    //                 // $wrap.removeClass("sticky");
    //             }else{
    //                 return;
    //             }
    //         }              
    //     },false);
    $(".mobile-nav-toggle").hover(function(){
        $(this).find("ul").show();
    }, function () {
        $(this).find("ul").hide();
    });
    // var mobileNavUl = $(".mobile-nav-toggle").find("ul");
    // mobileNavUl.on("click","li",function(){
    //     mobileNavUl.find("a").removeClass("glyphicon glyphicon-menu-right");
    //     $(this).css({"border":"none","padding":"0"});
    //     $(this).find("a").eq(0).addClass("glyphicon glyphicon-menu-right");
    // });
    $(".sld-toggle").on("click", function () {
        var sldId = $(this).attr("data-id");
        var num = $(this).attr("data-item");
        console.log(num);
        console.log(sldId);
        toggleSlider(sldId, num);
    });

    $('.sevice-wrap-con').find('div.serviceDict').off('click').click(function () {
        var photoName = $(this).attr('photo-type');
        $('#photoBox').find('img').attr('src', './img/img/' + photoName + '.png');
        $('.main-wrap').addClass('main-wrap-blur');
        $('#photoshow').modal('show');
    });
    $('#photoshow').off('click').click(function () {
        $('.main-wrap').removeClass('main-wrap-blur');
        $('#photoshow').modal('hide');
    })
    $('.list-contact-one').hover(function () {
        var $this = $(this);
        var imgSrc = $this.attr('img-src');
        $this.addClass('list-contact-only').find('.list-left>img').attr('src', './img/icon/'+ imgSrc + '.svg');
    }, function () {
        var $this = $(this);
        var imgSrc = $this.attr('imgsrc');
        $this.removeClass('list-contact-only').find('.list-left>img').attr('src', './img/icon/'+imgSrc+'.svg');
    });

    $('.navigate-contact').hover(function () {
        $('.ht-contact-img').attr('src', './img/img/contact-header-show.png');
    }, function () {
        $('.ht-contact-img').attr('src', './img/img/contact-header.png');
    });

    $("#divLanguage").hover(function(){
        $(this).find("ul").show();
    },function(){
        $(this).find("ul").hide();
    });
    //语言切换
    $("#selectLanguage a").off('click').click(function (e) {
        InitI18nResource(e.currentTarget.attributes.value.value, true, 'js/i18n/').always(function (rs) {
            I18n = new Internationalization(null, rs);
            //Session.setAttribute('I18n', new Internationalization(null, rs));
        });
        I18n.fillPage();
        e.preventDefault();
    });

    if (localStorage['language'] && localStorage['language'] === 'zh') {
        if (window.screen.width < 1200) {
            $('.timeline').find('.timeline-item').eq(5).css('margin-top', '1.0rem');
        }
    }

    function toggleSlider(id, num) {
    	var $sld = $(id);
    	$sld.carousel(parseInt(num, 10));
    }
    /*services*/
    $(".service-title").find("span").off("click").on("click",function(){
        if($(this).hasClass("glyphicon-chevron-down")){
            $(this).removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
            $(this).parent().next().hide();
        }else{
            $(this).removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
            $(this).parent().next().show();
        }
    })
    $(".severce-infor-box").off("click").on("click",function(){
        $(".mask").hide();
        $(".mask").find("img").hide();
        $(this).css({"background":"#2083f2","opacity":"0.7"});
        var index = $(".severce-infor-box").index($(this));
        $(".mask").show();
        $(".mask").find("img").eq(index).show();
    })
    $(".services-img-box").click(function(){
        $(".mask").hide();
        $(".severce-infor-box").css({"background":"transparent","opacity":"inherit"});
    })
    /*smart service 轮播效果*/
    var index;
    var $sdSix = $(".smart-devices-six");
    $("#beop-sld").on('slide.bs.carousel', function (e) {
        index = $(e.relatedTarget).index();
        $sdSix.find("a").removeClass("active");
        $sdSix.find("a").eq(index).addClass("active");
    });
    $sdSix.find("a").click(function(){
        var index = $sdSix.find("a").index($(this));
        $("#beop-sld .item").removeClass("active");
        $("#beop-sld  .item").eq(index).addClass("active");

        $sdSix.find("a").removeClass("active");
        $(this).addClass("active");
    });
    /*aboutUs*/
    $(".team-member").hover(function(){
        var index = $(".team-member").index($(this));

        $(".hover-shadow").eq(index).css("box-shadow","0 0 20px #003b3f");
        $(".triangle").eq(index).css("display","block");
        $(".team-name").eq(index).show();
        $(".member-introduce").show();
        $(".team-text").eq(index).show();
    },function(){
        $(".member-introduce").hide();
        $(".team-name").hide();
        $(".hover-shadow").css("box-shadow","none");
        $(".triangle").css("display","none");
        $(".team-text").hide();
    })
}());

//app Download相关;
$(window).scroll(function () {
    var $scrollTop = $(document).scrollTop();
    var $winHeight=$(window).height();
    var $docHeight = $(document).height();
    if ($scrollTop + $winHeight >= $docHeight) {
        $('.divDownload').fadeIn();
    }
});

//导航相关
$('#totalMenu').on('click',function(){
    var scrollTop = $(window).scrollTop();
    $('html,body').animate({ scrollTop: 0+"px" },100);
    // $('.navWrap').slideDown();
})
$('#totalMenu').off('touchend').on('touchstart', function(){
    var lang = localStorage['language'];
    if($('.navWrap').length === 1){
        $('.navWrap').slideDown();
        if(lang === 'zh'){
            $('#switchLang').addClass('btn-switch-off').removeClass('btn-switch-on');
        }else{
            $('#switchLang').addClass('btn-switch-on').removeClass('btn-switch-off');
        }
        I18n.fillPage();
    }else{
        $.get('navigation.html').done(function(rs){
            $('body').append(rs);
            I18n.fillPage();
            if(lang === 'zh'){
                $('#switchLang').addClass('btn-switch-off').removeClass('btn-switch-on');
            }else{
                $('#switchLang').addClass('btn-switch-on').removeClass('btn-switch-off');
            }
            //addClass active
            var pageName = window.location.href.split('/');
            pageName = pageName[pageName.length-1];
            $('.active', '#navList').removeClass('active');
            $('#navList li a[href="' + pageName + '"]').parent().addClass('active');

            $('#switchLang').off('touchend').on('touchstart', function() {
                lang = 'en';
                if($(this).hasClass('btn-switch-off')){
                    $(this).removeClass('btn-switch-off').addClass('btn-switch-on');
                    lang = 'en';
                }else{
                    $(this).removeClass('btn-switch-on').addClass('btn-switch-off');
                    lang = 'zh';
                }

                InitI18nResource(lang, true, 'js/i18n/').always(function (rs) {
                    I18n = new Internationalization(null, rs);
                    //Session.setAttribute('I18n', new Internationalization(null, rs));
                });
                I18n.fillPage();
            });

            $('#navList li').off('touchend').on('touchstart', function() {
                $(this).addClass('active').siblings().removeClass('active');
            });

            $('#btnSlideUpMenu').off('touchend').on('touchstart', function() {
                $('.navWrap').slideUp();
            });
        });
    }
});
//人员布局相关;
$('.imgArrowup').on('click',function(){
    var index = $(".imgArrowup").index($(this));
    $('.leaderIntroText').eq(index).toggle();
    $('.imgArrowup').eq(index).hide();
    $('.leaderIntroArrowdown').eq(index).show();  
})
$('.leaderIntroArrowdown').on('click',function(){
    var index = $(".leaderIntroArrowdown").index($(this));
    $('.leaderIntroText').eq(index).toggle();
    $('.leaderIntroArrowdown').eq(index).hide();
    $('.imgArrowup').eq(index).show();
})




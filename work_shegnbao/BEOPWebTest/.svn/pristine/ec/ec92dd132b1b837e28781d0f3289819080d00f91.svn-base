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
    //service页面platform端切换选择
    $('.platform-select').off('click').click(function () {
        var $this = $(this);
        var imgSrc = $this.attr('dict-img');
        var contentClass = $this.attr('dict-url');
        var $contentBox = $('.' + contentClass);
        if ($this.hasClass('active')) {
            return;
            //$this.removeClass('active');
            //$this.find('.platformSin>img').attr('src', './img/icon/' + imgSrc + '.svg');
            //$contentBox.show();
            //$contentBox.siblings(':not(".service-one-title")').hide();
        } else {
            var siblings = $this.siblings();
            $this.addClass('active');
            $this.find('.platformSin>img').attr('src', './img/icon/' + imgSrc + '-white.svg');
            siblings.removeClass('active');
            for (var i = 0, len = siblings.length; i < len; i++) {
                var siImgSrc = $(siblings[i]).attr('dict-img');
                $(siblings[i]).find('.platformSin>img').attr('src', './img/icon/' + siImgSrc + '.svg');
            }
            //$this.siblings().find('.platformSin>img').attr('src', './img/icon/' + imgSrc + '.svg');
            $contentBox.show();
            $contentBox.siblings(':not(".service-one-title")').hide();
        }
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
        /*initial wow animation*/
     var animation = new WOW({
             boxClass: 'rnb-animate',
             animateClass: 'animated',
             offset: 280,
             mobile: false,
             live: true
     });
      animation.init();
     /*services click btn (endUser platformUser)*/
     $(".endUser-btn").click(function(){
         endUserLayout();
         jumpToPpt();
     });

    $(".platformUser-btn").click(function(){
        platformUserLayout();
        var index;
        var $lis=$(".platformUser-icon");
        // 轮播执行完之后执行
        $(".service-section-two>.carousel").on('slide.bs.carousel', function (e) {
            index = $(e.relatedTarget).index();
            $lis.removeClass("on");
            $lis.eq(index).addClass("on");
        });
        // 点击platformUser 头部的icon
        $lis.click(function(){
            var index = $lis.index($(this));
            $(".service-section-two .item").removeClass("active");
            $(".service-section-two .item").eq(index).addClass("active");

            $(".carousel-indicators li").removeClass("active");
            $(".carousel-indicators li").eq(index).addClass("active");

            $lis.removeClass("on");
            $lis.eq(index).addClass("on");
            
        })
    });
    /*滚轮事件*/
    // $(window).scroll( function() { 
    //     if($(window).scrollTop()<1108){
    //         $(".hd-services").show();
    //         endUserLayout();
    //          $(".endUser-btn").trigger("click");
    //     }else if($(window).scrollTop()<1226){
    //         $(".hd-services").show();
    //         platformUserLayout();
    //         $(".platformUser-btn").trigger("click");
    //     }else{
    //         $(".services-options").html("").hide();
    //         $(".hd-services").hide();
    //     }
    // });
    // function getBack(){
    //     $(".services-options").find("img").click(function(){
    //         $(".services-options").hide();
    //         $(".services-options").html("");
    //      });
    // }
    /*点击导航里的endUser  跳转到对应的ppt*/
    // function jumpToPpt(){
    //     $(".services-options").find("li").off("click").click(function(){
    //         var index = $(".services-options").find("li").index($(this));
    //         var currentText = $(this).find("a").text();
    //         var text = $(".serviceDict").eq(index).find("h2").text().split(".")[1];
    //         if(currentText == text){
    //             $(".serviceDict").eq(index).trigger("click");
    //         }
    //     });
    // }
     /*smart service 轮播效果*/
    var index;
    $(".left>.carousel").on('slide.bs.carousel', function (e) {
        index = $(e.relatedTarget).index();
        var $right = $(".fr-banner .right");
        $right.find("a").removeClass("different-style");
        $(".md-abtn").find("a").removeClass("different-style");
        $right.find("a").eq(index).addClass("different-style");
        $(".md-abtn").find("a").eq(index).addClass("different-style");
    });
    $(".right a").click(function(){
        var index = $(".right a").index($(this));
        $(".left .item").removeClass("active");
        $(".left .item").eq(index).addClass("active");

        $(".carousel-indicators li").removeClass("active");
        $(".carousel-indicators li").eq(index).addClass("active");

        $(".right a").removeClass("different-style");
        $(this).addClass("different-style");
    });
    $(".md-abtn a").click(function(){
        var index = $(".md-abtn a").index($(this));
        $(".left .item").removeClass("active");
        $(".left .item").eq(index).addClass("active");

        $(".carousel-indicators li").removeClass("active");
        $(".carousel-indicators li").eq(index).addClass("active");

        $(".md-abtn a").removeClass("different-style");
        $(this).addClass("different-style");
    })
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

$(function () { $("[data-toggle='tooltip']").tooltip(); });
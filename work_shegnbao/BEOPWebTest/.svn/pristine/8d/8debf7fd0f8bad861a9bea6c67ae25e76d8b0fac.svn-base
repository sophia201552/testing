(function () {
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
    $(".menu-trigger").on("click", function () {
        var $bar = $(".hd-bar");
        $bar.toggleClass("active");
    });

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
}());
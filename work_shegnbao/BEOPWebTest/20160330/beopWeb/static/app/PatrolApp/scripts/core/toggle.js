/**
 * Created by win7 on 2015/10/23.
 */
var toggle = (function(){
    var _this = this;
    function toggle(){
        _this = this;
    }

    //$(document).hammer().off('swipeleft','.carousel').on('swipeleft','.carousel',function(e){
    //    $(e.currentTarget).carousel('next');
    //});
    //$(document).hammer().off('swiperight','.carousel').on('swiperight','.carousel',function(e){
    //    $(e.currentTarget).carousel('prev');
    //});

    toggle.pageLeft = function(target,data){
        $(ElScreenContainer).off('swipeleft').on('swipeleft',function(e){
            router.to({
                typeClass:target,
                data:data
            })
        })
    };
    toggle.pageRight=function(target,data){
        $(ElScreenContainer).off('swiperight').on('swiperight',function(e){
            router.to({
                typeClass:target,
                data:data
            })
        })
    };
    toggle.configLeft = function(target,func,data){
        $(ElScreenContainer).off('swipeleft.left').on('swipeleft.left',function(e){
            target.hide();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        });
        $(ElScreenContainer).off('swiperight.left').on('swiperight.left',function(e){
            target.show();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        })
    };
    toggle.configRight = function(target,func,data){
        $(ElScreenContainer).off('swiperight.right').on('swiperight.right',function(e){
            target.hide();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        });
        $(ElScreenContainer).off('swipeleft.right').on('swipeleft.right',function(e){
            target.show();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        })
    };
    toggle.configBottom = function(target,func,data){
        $(ElScreenContainer).off('swipedown.bottom').on('swipedown.bottom',function(e){
            target.hide();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        });
        $(ElScreenContainer).off('swipeup.bottom').on('swipeup.bottom',function(e){
            target.show();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        })
    };
    //var carouselHammer;
    toggle.carousel = function(container){
        //carouselHammer =  new Hammer(container[0]);
        //carouselHammer.get('swipe').set({ threshold:0,velocity:0});
        container.off('swipeLeft').on('swipeLeft',function(e){
            $(e.currentTarget).carousel('next');
        });
        container.off('swipeRight').on('swipeRight',function(e){
            $(e.currentTarget).carousel('prev');
        });
    };
    return toggle;
})();
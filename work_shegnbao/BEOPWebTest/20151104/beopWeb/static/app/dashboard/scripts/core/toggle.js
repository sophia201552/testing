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
        $(ElScreenContainer).hammer().off('swipeleft').on('swipeleft',function(e){
            router.to({
                typeClass:target,
                data:data
            })
        })
    };
    toggle.pageRight=function(target,data){
        $(ElScreenContainer).hammer().off('swiperight').on('swiperight',function(e){
            router.to({
                typeClass:target,
                data:data
            })
        })
    };
    toggle.configLeft = function(target,func,data){
        $(ElScreenContainer).hammer().off('swipeleft.left').on('swipeleft.left',function(e){
            target.hide();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        });
        $(ElScreenContainer).hammer().off('swiperight.left').on('swiperight.left',function(e){
            target.show();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        })
    };
    toggle.configRight = function(target,func,data){
        $(ElScreenContainer).hammer().off('swiperight.right').on('swiperight.right',function(e){
            target.hide();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        });
        $(ElScreenContainer).hammer().off('swipeleft.right').on('swipeleft.right',function(e){
            target.show();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        })
    };
    toggle.configBottom = function(target,func,data){
        $(ElScreenContainer).hammer().off('swipedown.bottom').on('swipedown.bottom',function(e){
            target.hide();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        });
        $(ElScreenContainer).hammer().off('swipeup.bottom').on('swipeup.bottom',function(e){
            target.show();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        })
    };
    toggle.carousel = function(container){
        container.hammer().off('swipeleft').on('swipeleft',function(e){
            $(e.currentTarget).carousel('next');
        });
        container.hammer().off('swiperight').on('swiperight',function(e){
            $(e.currentTarget).carousel('prev');
        });
    };
    return toggle;
})();
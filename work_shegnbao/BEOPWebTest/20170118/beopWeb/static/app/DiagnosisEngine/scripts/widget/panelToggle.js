/**
 * Created by win7 on 2016/5/20.
 */
(function(){
    var _this;
    function PanelToggle(){
        _this = this;
        _this.panelLeft = undefined;
        _this.panelCenter = undefined;
        _this.panelRight = undefined;
        _this.opt = {
            left:{
                show:false,
                width:'15%'
            },
            center:{
                show:false,
                width:'70%'
            },
            right:{
                show:false,
                width:'15%'
            }
        }
    }
    PanelToggle.prototype = {
        init:function(){
            _this.panelLeft = document.getElementById('panelLeft');
            _this.panelCenter = document.getElementById('panelCenter');
            _this.panelRight = document.getElementById('panelRight');
            _this.toggle({
                left:{
                    show:false,
                    width:'15%'
                },
                center:{
                    show:false,
                    width:'70%'
                },
                right:{
                    show:false,
                    width:'15%'
                }
            })
        },
        toggle:function(opt){
            _this.opt = $.extend(true, {}, _this.opt, opt);
            if (_this.opt.left.show === true){
                _this.panelLeft.style.display = 'inline-block';
            }else if(_this.opt.left.show === false){
                _this.panelLeft.style.display = 'none';
            }
            if (_this.opt.center.show === true){
                _this.panelCenter.style.display = 'inline-block';
            }else if(_this.opt.center.show === false){
                _this.panelCenter.style.display = 'none';
            }
            if (_this.opt.right.show === true){
                _this.panelRight.style.display = 'inline-block';
            }else if(_this.opt.right.show === false){
                _this.panelRight.style.display = 'none';
            }
            _this.styleAdjust();
        },
        onresize:function(){
            _this.styleAdjust();
        },
        styleAdjust:function(){
            _this.panelLeft.style.width = _this.opt.left.width;
            _this.panelRight.style.width = _this.opt.right.width;
            _this.panelCenter.style.width = ElScreenContainer.clientWidth - _this.panelLeft.offsetWidth - _this.panelRight.offsetWidth - 1 + 'px';
        }
    };

    window.PanelToggle = new PanelToggle();
})(window);
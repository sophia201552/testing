;(function (exports, Capture) {
    const DEFAULT_OPTIONS = {
        showTitle: true
    }
    class Base extends Capture() {
        constructor(container, options=DEFAULT_OPTIONS, overview) {
            super();
            if (options !== DEFAULT_OPTIONS) {
                options = $.extend({}, DEFAULT_OPTIONS, options);
            }
            this.container = container;
            this.options = options;
            this.overview = overview;
            this.data = undefined;
            this.init();
        }
        init() {
            if (this.options.showTitle) {
                this.initHeader();
            }
            this.enableCapture(this.container);
        }
        initHeader() {
            // TODO
        }
        show() {
            throw new Error('Class Base\'s "show" method must to be implemented.');
        }
        update() {
            throw new Error('Class Base\'s "update" method must to be implemented.');
        }
        //id,position,location,msg,container
        setHelpTppltip(optArr){
            optArr.forEach(function(opt,i){
                var dom = `<div class="popover ${opt.location}" data-id = "${opt.id}">
                    <div class="arrow"></div>
                    <div class="popover-content" style="font-size: 12px;color: #69779f;">
                        ${opt.msg}
                    </div>
                </div>`
                var $curContainer;
                if(opt.container){
                    $curContainer = $(opt.container);
                }else{
                    $curContainer = $(document.body);
                }
                if($curContainer.find(".popover[data-id='"+ opt.id +"']").length > 0){
                    if($curContainer.find(".popover[data-id='"+ opt.id +"']").css("display") === "block"){
                        $curContainer.find(".popover[data-id='"+ opt.id +"']").hide();
                    }else{
                        $curContainer.find(".popover[data-id='"+ opt.id +"']").remove();
                        $curContainer.append(dom); 
                        $curContainer.find(".popover[data-id='"+ opt.id +"']").css(opt.position).show();
                    }
                }else{
                    $curContainer.css("position","relative").append(dom); 
                    var $curItem = $curContainer.find(".popover[data-id='"+ opt.id +"']");
                    $curItem.css(opt.position).show();
                }                
            })
            $(document.body).on("click.tooltip",function(e){
                if($(e.target).hasClass("popover") || $(e.target).hasClass("helpInfo")){
                    return;
                }else{
                    $(".popover").hide();
                    $(document.body).off("click.tooltip");
                }                
            })           
        }
        destroyHelpTooltip(container){
            var $curContainer;
            if(container){
                $curContainer = $(container);
            }else{
                $curContainer = $(document.body);
            }
            $curContainer.find(".helpInfo").remove();
        }
        showLoading() {
            // TODO
        }
        hideLoading() {
            // TODO
        }
        close() {
            throw new Error('Class Base\'s "close" method must to be implemented.');
        }
        //重写
        capture() {
            let promiseArr = [];
            let promise = $.Deferred();
            this.captureDoms.forEach((dom,index)=>{
                let style = window.getComputedStyle(dom);
                let oldHeight = style.height;
                let realHeight = this._getHeightWithoutOverflow(dom)+'px';
                let oldOverflowYParent;
                if(oldHeight!=realHeight && dom.parentNode){
                    oldOverflowYParent = window.getComputedStyle(dom.parentNode).overflowY;
                    dom.parentNode.style['overflow-y'] = 'hidden';
                }
                dom.style.height = realHeight;
                let promise = $.Deferred();
                domtoimage.toJpeg(dom,{quality: 0.92}).then(function (src) {
                    dom.style.height = oldHeight;
                    if(oldHeight!=realHeight && dom.parentNode){
                        dom.parentNode.style['overflow-y'] = oldOverflowYParent;
                    }
                    promise.resolve(src);
                });
                promiseArr.push(promise);
            });
            $.when(...promiseArr).done((...rs)=>{
                promise.resolve(rs);
            });
            return promise;
        }
        //重写
        _attachEvents() {
            this.captureType = 'overview';
            let _this = this;
            let $captureDom = $(this._captureDom);
            $captureDom.off('click.captureDom').on('click.captureDom','.clickShadow',function(e){
                if(e.ctrlKey == false){
                    $('.clickShadow').not(this).removeClass('selected');
                    window.CAPTURE_INSTANCES.forEach(ins=>{
                        if(ins != _this){
                            ins.captureDoms = [];
                        }else{
                            ins.captureDoms = ins.captureDoms.filter(v=>v==this);
                        }
                    });
                    window.CAPTURE_INSTANCES = [_this];
                }
                let captureDomsIndex = _this.captureDoms.findIndex(dom=>dom==this),
                    instancesIndex = window.CAPTURE_INSTANCES.findIndex(ins=>ins==_this);
                if(captureDomsIndex==-1){
                    _this.captureDoms.push(this);
                }else{
                    _this.captureDoms.splice(captureDomsIndex,1);
                }
                if(instancesIndex==-1){
                    window.CAPTURE_INSTANCES.push(_this);
                }else{
                    if(_this.captureDoms.length==0){
                        window.CAPTURE_INSTANCES.splice(instancesIndex,1);
                    }
                }
                
                $(this).toggleClass('selected');
                if(window.CAPTURE_INSTANCES.length>0){
                    $('.feedBackModalBtn').addClass('highLight');
                }else{
                    $('.feedBackModalBtn').removeClass('highLight');
                }
            });
        }
        //重写
        _detachEvents() {
            let $captureDom = $(this._captureDom);
            $captureDom.off('click.captureDom');
        }
    }

    exports.Base = Base;
} (
    namespace('diagnosis.components'),
    namespace('diagnosis.mixins.Capture')
));

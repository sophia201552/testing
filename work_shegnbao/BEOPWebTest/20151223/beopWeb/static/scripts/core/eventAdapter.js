/**
 * Created by win7 on 2015/7/21.
 */

//var EventAdapter = (function(jQuery){
//    var _this = this;
//    //var eventTarget,eventSelector,eventType,eventFunction,eventStatus;
//    var eventStatus;
//    var eventData;
//    var dropTarget;
//    function EventAdapter(){
//    }
//
//    var mobileDragStart = function(e,eventTarget,eventFunction){
//        //e.preventDefault();
//        var originalTarget = e.currentTarget;
//        var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
//        startPos = {
//            left: $(originalTarget).css('left'),
//            top: $(originalTarget).css('top'),
//            zIndex: $(originalTarget).css('z-index')
//        },
//        disX = ev.pageX,
//        disY = ev.pageY;
//        var $copyTarget = $(originalTarget).clone();
//        $copyTarget.data('startPos', startPos);
//        $copyTarget.css('z-index',10000);
//        $copyTarget.css('position','absolute');
//        $copyTarget.css('opacity','0.5');
//        $copyTarget.css('pointer-events','none');
//        var container = $('body');
//        //container.append($copyTarget);
//        var sPos = $(originalTarget)[0].getBoundingClientRect();
//        $copyTarget.css('left',sPos.left - container[0].offsetLeft + 'px');
//        $copyTarget.css('top',sPos.top - container[0].offsetTop + 'px');
//        $copyTarget[0].cssText = originalTarget.cssText;
//        $copyTarget.css('width',originalTarget.offsetWidth);
//        $copyTarget.css('height',originalTarget.offsetHeight);
//        //originalTarget.parentNode.appendChild($copyTarget[0]);
//        eventStatus = 'dragStart';
//        eventFunction.call(this, e);
//        $(document).off('touchend.copy').on('touchend.copy',function(e){
//            $copyTarget.remove();
//            eventStatus = 'dragEnd';
//            $(document).off('touchmove.copy');
//        });
//        $(document).on('touchmove.copy',function(e) {
//            //e.preventDefault();
//            eventStatus = 'dragMove';
//            var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
//            var $parent = $copyTarget.offsetParent();
//            $parent = $parent.is(':root') ? $(window) : $parent;
//            //var pPos = $parent.offset();
//            //pPos = pPos ? pPos:{left:0,top:0};
//            var targetLeft = ev.pageX - originalTarget.offsetWidth / 2;
//            var targetTop = ev.pageY - originalTarget.offsetHeight / 2;
//            //r = $parent.width() - $this.outerWidth(true);
//            //d = $parent.height() - $this.outerHeight(true);
//
//            //targetLeft = targetLeft < 0 ? 0 : targetLeft > r ? r : targetLeft;
//            //targetTop = targetTop < 0 ? 0 : targetTop > d ? d : targetTop;
//
//            $copyTarget.css({
//                left: targetLeft + 'px',
//                top: targetTop + 'px',
//                'z-index': 10000
//            });
//        })
//
//    };
//
//    var mobileDragOver = function(e,target,eventFunction){
//        if (eventStatus !='dragMove') return;
//        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
//        var targetWidth,targetHeight;
//        for (var i = 0; i < target.length; i++) {
//            targetWidth = target[i].offsetWidth;
//            targetHeight = target[i].offsetHeight;
//            if ((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY)) {
//                e.target = target[i];
//                e.currentTarget = target[i];
//                eventFunction.call(this, e);
//                break;
//            }
//        }
//    };
//
//    var mobileDragLeave = function(e,target,eventFunction){
//        if (eventStatus !='dragMove') return;
//        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
//        var targetWidth,targetHeight;
//        for (var i = 0; i < target.length; i++) {
//            targetWidth = target[i].offsetWidth;
//            targetHeight = target[i].offsetHeight;
//            if (!((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY))) {
//                e.target = target[i];
//                e.currentTarget = target[i];
//                eventFunction.call(this, e);
//            }
//        }
//    };
//
//    var mobileDragEnd = function(e,target,eventFunction){
//        if (eventStatus != 'dragMove')return;
//        eventFunction.call(this, e);
//    };
//
//    var mobileDrop = function(e,target,eventFunction){
//        if (eventStatus != 'dragMove')return;
//        //e.stopImmediatePropagation();
//        //var ev = e.originalEvent.changedTouches[0];
//        var ev = e;
//        var eventTarget = dropTarget;
//        var targetWidth,targetHeight;
//        for (var i = 0; i < target.length; i++) {
//            targetWidth = target[i].offsetWidth;
//            targetHeight = target[i].offsetHeight;
//            if ((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY)) {
//                e.target = target[i];
//                e.currentTarget = target[i];
//                eventFunction.call(this, e);
//                break;
//            }
//        }
//    };
//    var mobileDropLocate = function(e,target,eventFunction){
//        dropTarget = e.originalEvent.relatedTarget;
//    };
//
//    EventAdapter.on = function(){
//        var eventTarget,eventType,eventFunction,eventDate;
//        if(arguments.length == 0)return;
//        if(typeof arguments[0] != 'object'){
//            return;
//        } else{
//            if(!(arguments[0] instanceof jQuery)){
//                eventTarget = jQuery(arguments[0]);
//            }else {
//                eventTarget = arguments[0];
//            }
//
//        }
//        if (typeof arguments[1] != 'string'){
//            return;
//        }else{
//            eventType = arguments[1];
//        }
//        if (typeof arguments[2] != 'function' && typeof arguments[2] != 'object'){
//            return;
//        }else{
//            eventFunction = arguments[2];
//        }
//        if (typeof arguments[3] != 'undefined'){
//            eventDate = arguments[3]
//        }
//        if(!AppConfig.isMobile){
//            eventTarget.on(eventType, eventFunction)
//        }else{
//            switch (eventType) {
//                case 'click':
//                    eventTarget.on('touchstart',eventFunction);
//                    break;
//                case 'dragstart':
//                    //eventTarget.on('touchstart',function(e){mobileDragStart.call(this,e,eventTarget,eventFunction)});
//                    eventTarget.on(eventType, eventFunction);
//                    eventTarget.on('touchstart',function(e){simulateMouseEvent.call(this,e,'dragstart')});
//                    break;
//                case 'dragover' :
//                    $(document).on('touchmove',function(e){mobileDragOver.call(this,e,eventTarget,eventFunction)});
//                    break;
//                case 'dragleave' :
//                    $(document).on('touchmove',function(e){mobileDragLeave.call(this,e,eventTarget,eventFunction)});
//                    break;
//                case 'dragend' :
//                    $(document).on('touchend',function(e){mobileDragEnd.call(this,e,eventTarget,eventFunction)});
//                    break;
//                case 'drop' :
//                    $(document).on('touchend.target',function(e){mobileDrop.call(this,e,eventTarget,eventFunction)});
//                    //eventTarget.on('mouseover',function(e){mobileDropLocate.call(this,e,eventTarget,eventFunction)});
//                    //eventTarget.on('mouseup',function(e){mobileDrop.call(this,e,eventTarget,eventFunction)});
//                    eventTarget.on(eventType, eventFunction);
//                    eventTarget.on('touchend',function(e){simulateMouseEvent.call(this,e,'drop')});
//                    break;
//                default :
//                    eventTarget.on(eventType, eventFunction);
//                    break;
//            }
//        }
//    };
//    EventAdapter.targetClone = function(originalTarget){
//        var $copyTarget = $(originalTarget).clone();
//        $copyTarget.css('z-index',10000);
//        $copyTarget.css('position','absolute');
//        $copyTarget.css('opacity','0.5');
//        $copyTarget.css('pointer-events','none');
//        var container = $('body');
//        //container.append($copyTarget);
//        var sPos = $(originalTarget)[0].getBoundingClientRect();
//        $copyTarget.css('left',sPos.left - container[0].offsetLeft + 'px');
//        $copyTarget.css('top',sPos.top - container[0].offsetTop + 'px');
//        $copyTarget[0].cssText = originalTarget.cssText;
//        $copyTarget.css('width',originalTarget.offsetWidth);
//        $copyTarget.css('height',originalTarget.offsetHeight);
//        return $copyTarget;
//    };
//    EventAdapter.setData = function(date){
//        if (eventData = undefined)return;
//        eventData = date;
//    };
//    EventAdapter.getData = function(){
//        return eventData;
//    };
//    return EventAdapter;
//})();

// (function ($) {

//   // Detect touch support
//   $.support.touch = 'ontouchend' in document;

//   // Ignore browsers without touch support
//   if (!$.support.touch) {
//     return;
//   }

//   var mouseProto = $.ui.mouse.prototype,
//       _mouseInit = mouseProto._mouseInit,
//       _mouseDestroy = mouseProto._mouseDestroy,
//       touchHandled;

//   /**
//    * Simulate a mouse event based on a corresponding touch event
//    * @param {Object} event A touch event
//    * @param {String} simulatedType The corresponding mouse event
//    */
//   function simulateMouseEvent (event, simulatedType) {

//     // Ignore multi-touch events
//     if (event.originalEvent.touches.length > 1) {
//       return;
//     }

//     event.preventDefault();

//     var touch = event.originalEvent.changedTouches[0],
//         simulatedEvent = document.createEvent('MouseEvents');

//     // Initialize the simulated mouse event using the touch event's coordinates
//     simulatedEvent.initMouseEvent(
//       simulatedType,    // type
//       true,             // bubbles
//       true,             // cancelable
//       window,           // view
//       1,                // detail
//       touch.screenX,    // screenX
//       touch.screenY,    // screenY
//       touch.clientX,    // clientX
//       touch.clientY,    // clientY
//       false,            // ctrlKey
//       false,            // altKey
//       false,            // shiftKey
//       false,            // metaKey
//       0,                // button
//       null              // relatedTarget
//     );

//     // Dispatch the simulated event to the target element
//     event.target.dispatchEvent(simulatedEvent);
//   }

//   /**
//    * Handle the jQuery UI widget's touchstart events
//    * @param {Object} event The widget element's touchstart event
//    */
//   mouseProto._touchStart = function (event) {

//     var self = this;

//     // Ignore the event if another widget is already being handled
//     if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
//       return;
//     }

//     // Set the flag to prevent other widgets from inheriting the touch event
//     touchHandled = true;

//     // Track movement to determine if interaction was a click
//     self._touchMoved = false;

//     // Simulate the mouseover event
//     simulateMouseEvent(event, 'mouseover');

//     // Simulate the mousemove event
//     simulateMouseEvent(event, 'mousemove');

//     // Simulate the mousedown event
//     simulateMouseEvent(event, 'mousedown');
//   };

//   /**
//    * Handle the jQuery UI widget's touchmove events
//    * @param {Object} event The document's touchmove event
//    */
//   mouseProto._touchMove = function (event) {

//     // Ignore event if not handled
//     if (!touchHandled) {
//       return;
//     }

//     // Interaction was not a click
//     this._touchMoved = true;

//     // Simulate the mousemove event
//     simulateMouseEvent(event, 'mousemove');
//   };

//   /**
//    * Handle the jQuery UI widget's touchend events
//    * @param {Object} event The document's touchend event
//    */
//   mouseProto._touchEnd = function (event) {

//     // Ignore event if not handled
//     if (!touchHandled) {
//       return;
//     }

//     // Simulate the mouseup event
//     simulateMouseEvent(event, 'mouseup');

//     // Simulate the mouseout event
//     simulateMouseEvent(event, 'mouseout');

//     // If the touch interaction did not move, it should trigger a click
//     if (!this._touchMoved) {

//       // Simulate the click event
//       simulateMouseEvent(event, 'click');
//     }

//     // Unset the flag to allow other widgets to inherit the touch event
//     touchHandled = false;
//   };

//   /**
//    * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
//    * This method extends the widget with bound touch event handlers that
//    * translate touch events to mouse events and pass them to the widget's
//    * original mouse event handling methods.
//    */
//   mouseProto._mouseInit = function () {

//     var self = this;

//     // Delegate the touch handlers to the widget's element
//     self.element.bind({
//       touchstart: $.proxy(self, '_touchStart'),
//       touchmove: $.proxy(self, '_touchMove'),
//       touchend: $.proxy(self, '_touchEnd')
//     });

//     // Call the original $.ui.mouse init method
//     _mouseInit.call(self);
//   };

//   /**
//    * Remove the touch event handlers
//    */
//   mouseProto._mouseDestroy = function () {

//     var self = this;

//     // Delegate the touch handlers to the widget's element
//     self.element.unbind({
//       touchstart: $.proxy(self, '_touchStart'),
//       touchmove: $.proxy(self, '_touchMove'),
//       touchend: $.proxy(self, '_touchEnd')
//     });

//     // Call the original $.ui.mouse destroy method
//     _mouseDestroy.call(self);
//   };

// })(jQuery);

var EventAdapter = (function() {
    var eventData, eventStatus;

    function EventAdapter($) {
    }

    //兼容性事件绑定
    EventAdapter.on = function () {
        var eventTarget, eventType, eventFunction, eventSelector,eventHmt,finalFunction;
        eventHmt = true;
        if (arguments.length < 3 || arguments.length > 5) {
            console.log('EventAdapter.on arguments.length error');
            return;
        }
        //判断参数类型，有三个类型
        //1.（事件对象，事件种类，事件执行函数，是否上传站长统计）/(Dom Object, str, Function，bool)
        //2.（事件对象，事件种类，事件委托选择器，事件执行函数，是否上传站长统计）/(Dom Object, str, str, Function，bool)
        if (typeof arguments[0] != 'object') {
            console.log('EventAdapter.on arguments[0] type error');
            return;
        } else {
            //原生对象和JQ对象兼容
            if (!(arguments[0] instanceof jQuery)) {
                eventTarget = jQuery(arguments[0]);
            } else {
                eventTarget = arguments[0];
            }

        }
        if (typeof arguments[1] != 'string') {
            console.log('EventAdapter.on arguments[1] type error');
            return;
        } else {
            eventType = arguments[1];
        }
        if (typeof arguments[2] == 'function') {
            eventFunction = arguments[2];
            eventSelector = null;
            if(typeof arguments[3] == 'boolean'){
                eventHmt = arguments[3]
            }
        } else if (typeof arguments[2] == 'string') {
            if (arguments[3] && typeof arguments[3] == 'function') {
                eventSelector = arguments[2];
                eventFunction = arguments[3];
                if(typeof arguments[4] == 'boolean'){
                    eventHmt = arguments[4]
                }
            } else {
                console.log('EventAdapter.on arguments[2 or 3] type error');
                return;
            }
        }
        //站长统计绑定
        finalFunction = function(e){
            if (eventHmt) {
                EventAdapter.analyse(eventTarget, eventType);
            }
            eventFunction.call(this,e);
        };
        //兼容性绑定事件
        if (!AppConfig.isMobile) {
            eventTarget.on(eventType, eventSelector, finalFunction)
        } else {
            switch (eventType) {
                case 'click':
                    eventTarget.on('touchstart', eventSelector, finalFunction);
                    break;
                case 'dragstart':
                    eventTarget.on('touchstart',eventSelector,function(e){mobileDragStart.call(this,e,eventTarget,finalFunction)});
                    break;
                case 'dragover' :
                    $(document).on('touchmove.drag',eventSelector,function(e){mobileDragOver.call(this,e,eventTarget,finalFunction)});
                    break;
                case 'dragleave' :
                    $(document).on('touchmove.drag',eventSelector,function(e){mobileDragLeave.call(this,e,eventTarget,finalFunction)});
                    break;
                //case 'dragend' :
                //    mobileDragEnd(eventTarget,eventFunction);
                //    break;
                case 'drop' :
                    $(document).on('touchend.drop',eventSelector,function(e){mobileDrop.call(this,e,eventTarget,finalFunction)});
                    break;
                default :
                    eventTarget.on(eventType, eventSelector, finalFunction);
                    break;
            }
        }
        return eventTarget;
    };
    //兼容性事件解绑
    EventAdapter.off = function () {
        //参数类型
        //1.(事件对象，事件种类)/(Dom object,str)
        //2.(事件对象，事件种类，事件委托选择器)/(Dom object,str,str)
        //3.(事件对象)/(Dom Object)
        if ((arguments.length > 3 || arguments.length < 1) || (arguments[0] && typeof arguments[1] != 'string')) {
            console.log('EventAdapter.off arguments error');
            return;
        }
        var eventTarget, eventType, eventSelector;
        //原生对象和JQ对象兼容
        if (!(arguments[0] instanceof jQuery)) {
            eventTarget = jQuery(arguments[0]);
        } else {
            eventTarget = arguments[0];
        }
        if (arguments.length == 1) {
            eventTarget.off();
            return eventTarget;
        }
        if (typeof arguments[1] == 'string') {
            eventType = arguments[1]
        } else {
            console.log('EventAdapter.off eventType Error');
            return
        }
        if (typeof arguments[2] == 'string') {
            eventSelector = arguments[2];
        } else {
            eventSelector = null;
        }
        if (!AppConfig.isMobile) {
            eventTarget.off(eventType, eventSelector)
        } else {
            switch (eventType) {
                case 'click' :
                    eventTarget.off('touchstart', eventSelector);
                    break;
                case 'dragstart':
                    eventTarget.draggable('destroy');
                    break;
                case 'dragover':
                    eventTarget.droppable('destroy');
                    break;
                case 'dragleave':
                    eventTarget.droppable('destroy');
                    break;
                case 'drop':
                    eventTarget.droppable('destroy');
                    break;
                default:
                    eventTarget.off(eventType, eventSelector);
                    break;
            }
        }
        return eventTarget;
    };
    //jQuery 拓展方式事件绑定
    $.fn.extend({
        //兼容性绑定事件
        'eventOn': function () {
            var eventTarget, eventType, eventFunction, eventSelector,eventHmt,finalFunction;
            eventHmt = true;
            if (arguments.length < 2 || arguments.length > 4) {
                console.log('EventAdapter.on arguments.length error');
                return;
            }
            //判断参数类型，有两个类型
            //1.（事件对象，事件种类，事件执行函数，是否上传站长统计）/(Dom Object, str, Function，bool)
            //2.（事件对象，事件种类，事件委托选择器，事件执行函数，是否上传站长统计）/(Dom Object, str, str, Function，bool)
            if (typeof this != 'object') {
                console.log('EventAdapter.on arguments[0] type error');
                return;
            } else {
                //原生对象和JQ对象兼容
                if (!(this instanceof jQuery)) {
                    eventTarget = jQuery(arguments[0]);
                } else {
                    eventTarget = this;
                }

            }
            if (typeof arguments[0] != 'string') {
                console.log('EventAdapter.on arguments[1] type error');
                return;
            } else {
                eventType = arguments[0];
            }
            if (typeof arguments[1] == 'function') {
                eventFunction = arguments[1];
                eventSelector = null;
                if(typeof arguments[2] == 'boolean'){
                    eventHmt = arguments[2]
                }
            } else if (typeof arguments[1] == 'string') {
                if (arguments[2] && typeof arguments[2] == 'function') {
                    eventSelector = arguments[1];
                    eventFunction = arguments[2];
                    if(typeof arguments[3] == 'boolean'){
                        eventHmt = arguments[3]
                    }
                } else {
                    console.log('EventAdapter.on arguments[2 or 3] type error');
                    return;
                }
            }
            finalFunction = function(e){
                if (eventHmt) {
                    EventAdapter.analyse(eventTarget, eventType);
                }
                eventFunction.call(this,e);
            };
            //兼容性绑定事件
            if (!AppConfig.isMobile) {
                eventTarget.on(eventType, eventSelector, finalFunction)
            } else {
                switch (eventType) {
                    case 'click':
                        eventTarget.on('touchstart', eventSelector, finalFunction);
                        break;
                    case 'dragstart':
                        mobileDragStart(eventTarget, eventSelector, finalFunction);
                        break;
                    case 'dragover' :
                        mobileDragOver(eventTarget, eventSelector, finalFunction);
                        break;
                    case 'dragleave' :
                        mobileDragLeave(eventTarget, eventSelector, finalFunction);
                        break;
                    //case 'dragend' :
                    //    mobileDragEnd(eventTarget,eventFunction);
                    //    break;
                    case 'drop' :
                        mobileDrop(eventTarget, eventSelector, finalFunction);
                        break;
                    default :
                        eventTarget.on(eventType, eventSelector, finalFunction);
                        break;
                }
            }
            return eventTarget;
        },
        //兼容性解绑事件
        'eventOff': function () {
            //参数类型
            //1.(事件对象，事件种类)/(Dom object,str)
            //2.(事件对象，事件种类，事件委托选择器)/(Dom object,str,str)
            //3.无参数
            if ((arguments.length > 2) || (arguments[0] && typeof arguments[0] != 'string')) {
                console.log('EventAdapter.off arguments error');
                return;
            }
            var eventTarget, eventType, eventSelector;
            //原生对象和JQ对象兼容
            if (!(this instanceof jQuery)) {
                eventTarget = jQuery(this);
            } else {
                eventTarget = this;
            }
            if (arguments.length == 0) {
                eventTarget.off();
                return eventTarget;
            }
            if (typeof arguments[0] == 'string') {
                eventType = arguments[0];
            } else {
                console.log('EventAdapter.off eventType Error');
                return
            }
            if (typeof arguments[1] == 'string') {
                eventSelector = arguments[1];
            } else {
                eventSelector = null;
            }
            if (!AppConfig.isMobile) {
                eventTarget.off(eventType, eventSelector)
            } else {
                switch (eventType) {
                    case 'click' :
                        eventTarget.off('touchstart', eventSelector,mobileDragStart);
                        break;
                    case 'dragstart':
                        eventTarget.draggable('destroy');
                        break;
                    case 'dragover':
                        eventTarget.droppable('destroy');
                        break;
                    case 'dragleave':
                        eventTarget.droppable('destroy');
                        break;
                    case 'drop':
                        eventTarget.droppable('destroy');
                        break;
                    default:
                        eventTarget.off(eventType, eventSelector);
                        break;
                }
            }
            return eventTarget;
        }

    });

    //drag事件参数保存
    EventAdapter.setData = function (date) {
        if (date == undefined)return;
        eventData = date;
    };
    //drag事件参数获取
    EventAdapter.getData = function () {
        return eventData;
    };
    //drop事件发生后自动清空传递数据
    document.addEventListener('drop', function () {
        eventData = null;
    }, false);

    document.addEventListener('touchend', function () {
        eventData = null;
    }, false);
    //清除drag事件以免内存溢出
    EventAdapter.clearEvent = function(){
        $(document).off('touchmove.copy');
        $(document).off('touchmove.drag');
        $(document).off('touchend.drop');
    };
    //各事件触发次数站长统计
    EventAdapter.analyse = function (eventTarget,eventType) {
        if (eventTarget.length == 0)return;
        var eventTargetName;
        if (eventTarget.attr('id')){
            eventTargetName = eventTarget.attr('id');
        }else if (eventTarget.attr('i18n')){
            eventTargetName = eventTarget.attr('i18n');
        }else if(eventTarget.attr('title')){
            eventTargetName = eventTarget.attr('title');
        }else{
            eventTargetName = eventTarget[0].textContent.substr(0,30);
        }
        if (!eventTargetName) return;
        _hmt.push(['_trackEvent', eventTargetName, eventType, '']);
    };

    ////移动端事件绑定
    //var mobileDragStart = function(source,eventSelector,eventFunction){
    //    //事件委托判断
    //    var handle = eventSelector?$(eventSelector):false;
    //    var mouseLeft = source[0].offsetWidth / 2;
    //    var mouseTop = source[0].offsetHeight / 2;
    //    source.draggable({
    //        start:eventFunction,
    //        addClasses:false,
    //        helper:'clone',
    //        appendTo:'body',
    //        zIndex:210000,
    //        revert:true,
    //        opacity:0.5,
    //        cursorAt: {
    //            left: mouseLeft,
    //            top: mouseTop
    //        },
    //        handle:handle
    //    })
    //};
    //
    //var mobileDragOver = function(target,eventSelector,eventFunction){
    //    target.droppable({
    //        over:eventFunction
    //    })
    //};
    //
    //var mobileDragLeave = function(target,eventSelector,eventFunction){
    //    target.droppable({
    //        out:eventFunction
    //    })
    //};
    //
    //var mobileDrop = function(target,eventSelector,eventFunction){
    //    target.droppable({
    //        greedy:true,
    //        drop:eventFunction
    //    });
    //    eventData = null;
    //};
    var mobileDragStart = function(e,target,eventFunction){
        //e.preventDefault();
        var originalTarget = $(e.target).closest('[draggable="true"]')[0];
        var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
        startPos = {
            left: $(originalTarget).css('left'),
            top: $(originalTarget).css('top'),
            zIndex: $(originalTarget).css('z-index')
        },
        disX = originalTarget.offsetWidth / 2,
        disY = originalTarget.offsetHeight / 2;
        var $copyTarget = $(originalTarget).clone();
        $copyTarget.data('startPos', startPos);
        $copyTarget.css('z-index',10000);
        $copyTarget.css('position','absolute');
        $copyTarget.css('opacity','0.5');
        $copyTarget.css('pointer-events','none');
        var $container = $('body');
        $container.append($copyTarget);
        var sPos = $(originalTarget)[0].getBoundingClientRect();
        $copyTarget.css('left',sPos.left - $container[0].offsetLeft + 'px');
        $copyTarget.css('top',sPos.top - $container[0].offsetTop + 'px');
        $copyTarget[0].cssText = originalTarget.cssText;
        $copyTarget.css('width',originalTarget.offsetWidth);
        $copyTarget.css('height',originalTarget.offsetHeight);
        //originalTarget.parentNode.appendChild($copyTarget[0]);
        eventStatus = 'dragStart';
        eventFunction.call(this, ev);
        $(document).off('touchend.copy').on('touchend.copy',function(e){
            $copyTarget.remove();
            eventStatus = 'dragEnd';
        });
        $(document).on('touchmove.copy',function(e) {
            //e.preventDefault();
            eventStatus = 'dragMove';
            var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
            var $parent = $copyTarget.offsetParent();
            $parent = $parent.is(':root') ? $(window) : $parent;
            //var pPos = $parent.offset();
            //pPos = pPos ? pPos:{left:0,top:0};
            var targetLeft = ev.pageX - disX;
            var targetTop = ev.pageY - disY;
            //r = $parent.width() - $this.outerWidth(true);
            //d = $parent.height() - $this.outerHeight(true);

            //targetLeft = targetLeft < 0 ? 0 : targetLeft > r ? r : targetLeft;
            //targetTop = targetTop < 0 ? 0 : targetTop > d ? d : targetTop;

            $copyTarget.css({
                left: targetLeft + 'px',
                top: targetTop + 'px',
                'z-index': 10000
            });
        })

    };

    var mobileDragOver = function(e,target,eventFunction){
        if (eventStatus !='dragMove' && eventStatus !='dragMoveIn' && eventStatus !='dragMoveOut') return;
        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
        var targetWidth,targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if ((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY)) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventStatus ='dragMoveIn';
                eventFunction.call(this, e);
                break;
            }
        }
    };

    var mobileDragLeave = function(e,target,eventFunction){
        if (eventStatus !='dragMoveIn') return;
        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
        var targetWidth,targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if (!((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY))) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventStatus ='dragMoveOut';
                eventFunction.call(this, e);
            }
        }
    };

    var mobileDragEnd = function(e,target,eventFunction){
        eventFunction.call(this, e);
    };

    var mobileDrop = function(e,target,eventFunction){
        if (eventStatus !='dragMove' && eventStatus !='dragMoveIn')return;
        //e.stopImmediatePropagation();
        //var ev = e.originalEvent.changedTouches[0];
        var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
        var eventTarget = target;
        var targetWidth,targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if ((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY)) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventFunction.call(this, e);
                break;
            }
        }
    };
    //var mobileDropLocate = function(e,target,eventFunction){
    //    dropTarget = e.originalEvent.relatedTarget;
    //};

    return EventAdapter;
})(jQuery);
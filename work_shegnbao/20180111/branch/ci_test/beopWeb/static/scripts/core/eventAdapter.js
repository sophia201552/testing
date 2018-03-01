/**
 * Created by win7 on 2015/7/21.
 */
//绑定事件函数封装有2种形式
//1.EventAdapter.on()/EventAdapter.off()
//2.$(dom).eventOn()/$(dom).eventOff();
//具体参数设置见以下内容

var EventAdapter = (function() {
    var eventData, eventStatus;

    function EventAdapter($) {}

    //兼容性事件绑定
    EventAdapter.on = function() {
        var eventTarget, eventType, eventFunction, eventSelector, eventHmt, finalFunction;
        if (arguments.length < 3 || arguments.length > 5) {
            console.log('EventAdapter.on arguments.length error');
            return;
        }
        //判断参数类型，有两个类型
        //1.（事件对象，   事件种类，事件执行函数，站长统计推送消息（可选））/
        //   (Dom Object, str,     Function，   array/str)
        //2.（事件对象，   事件种类，事件委托选择器，事件执行函数，站长统计推送消息（可选））/
        //   (Dom Object, str,     str,          Function，    array/str)
        /////////////////////////////////////////////////////////////////
        //站长统计推送消息（可选）参数设置
        //1.false/undefined/null
        //默认状态不推送统计消息
        //2.true
        //推送默认统计消息，默认推送消息信息优先级如下：
        //(1).id
        //(2).i18n
        //(3).title
        //3.string
        //可输入任意字符串或者输入，如果字符串为‘id’，‘title’等值，会尝试获取对象的这些属性值，如果获取不到，则返回这个字符串
        //如果输入字符串为‘text’，则会尝试获取对象的innerText
        //4.function
        //可输入任意函数，如
        // function(e){
        //    return $(e.currentTarget).attr(value)可以推送对象的value信息
        //}
        //5.数组
        //数组至少包含一个元素，数组第一个元素将作为粗略分类依据推送。
        //如果有的话，后面的几个元素将用‘-’相连，作为精确分裂依据推送。
        //数组元素种类和以上非数组参数种类相似
        //如['navBar']将把触发的事件标记为navBar推送
        //对于一个元素<div id='test',value="12345">南京熊猫<span>KPI统计</span></div>
        //如果绑定方式如下的话：
        //EventAdapter.on($('#test'),'click',['projSel','btnProjSel',‘南京熊猫’,'value','function(e){return $(e.currentTarget).find('span').text()}'])
        //每次点击事件后将推送信息为
        //粗分类标签：projSel
        //细分类标签：btnProjSel-南京熊猫-12345-KPI统计
        //如输出参数非以上任何一种，则和true的情况一致
        //为了一个好的分类效果，请将粗分类设置为对象所属种类，比如说ds表示数据源数据点，或者是navBar表示导航条
        //而细分类需要包裹对象进行时的project信息以及对象id等等。
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
            eventHmt = arguments[3]
        } else if (typeof arguments[2] == 'string') {
            if (arguments[3] && typeof arguments[3] == 'function') {
                eventSelector = arguments[2];
                eventFunction = arguments[3];
                eventHmt = arguments[4]
            } else {
                console.log('EventAdapter.on arguments[2 or 3] type error');
                return;
            }
        }
        //站长统计绑定
        finalFunction = function(e) {
            if (!(eventHmt === false)) {
                EventAdapter.analyse(e, eventType, eventHmt);
            }
            eventFunction.call(this, e);
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
                    eventTarget.on('touchstart', eventSelector, function(e) { mobileDragStart.call(this, e, eventTarget, finalFunction) });
                    break;
                case 'dragover':
                    $(document).on('touchmove.drag', eventSelector, function(e) { mobileDragOver.call(this, e, eventTarget, finalFunction) });
                    break;
                case 'dragleave':
                    $(document).on('touchmove.drag', eventSelector, function(e) { mobileDragLeave.call(this, e, eventTarget, finalFunction) });
                    break;
                    //case 'dragend' :
                    //    mobileDragEnd(eventTarget,eventFunction);
                    //    break;
                case 'drop':
                    $(document).on('touchend.drop', eventSelector, function(e) { mobileDrop.call(this, e, eventTarget, finalFunction) });
                    break;
                default:
                    eventTarget.on(eventType, eventSelector, finalFunction);
                    break;
            }
        }
        return eventTarget;
    };
    //兼容性事件解绑
    EventAdapter.off = function() {
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
                case 'click':
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
        'eventOn': function() {
            var eventTarget, eventType, eventFunction, eventSelector, eventHmt, finalFunction;
            if (arguments.length < 2 || arguments.length > 4) {
                console.log('EventAdapter.on arguments.length error');
                return;
            }
            //判断参数类型，有两个类型
            //1.（事件种类，事件执行函数，站长统计推送消息（可选））/
            //   (str,     Function，   array/str)
            //2.（事件种类，事件委托选择器，事件执行函数，站长统计推送消息（可选））/
            //   (str,     str,           Function，  array/str)
            /////////////////////////////////////////////////////////////////
            //站长统计推送消息（可选）参数设置
            //1.false/undefined/null
            //默认状态不推送统计消息
            //2.true
            //推送默认统计消息，默认推送消息信息优先级如下：
            //(1).id
            //(2).i18n
            //(3).title
            //3.string
            //可输入任意字符串或者输入，如果字符串为‘id’，‘title’等值，会尝试获取对象的这些属性值，如果获取不到，则返回这个字符串
            //如果输入字符串为‘text’，则会尝试获取对象的innerText
            //4.function
            //可输入任意函数，如
            // function(e){
            //    return $(e.currentTarget).attr(value)可以推送对象的value信息
            //}
            //5.数组
            //数组至少包含一个元素，数组第一个元素将作为粗略分类依据推送。
            //如果有的话，后面的几个元素将用‘-’相连，作为精确分裂依据推送。
            //数组元素种类和以上非数组参数种类相似
            //如['navBar']将把触发的事件标记为navBar推送
            //对于一个元素<div id='test',value="12345">南京熊猫<span>KPI统计</span></div>
            //如果绑定方式如下的话：
            //$('#test').on('click',['projSel','btnProjSel',‘南京熊猫’,'value','function(e){return $(e.currentTarget).find('span').text()}'])
            //每次点击事件后将推送信息为
            //粗分类标签：projSel
            //细分类标签：btnProjSel-南京熊猫-12345-KPI统计
            //如输出参数非以上任何一种，则和true的情况一致
            //为了一个好的分类效果，请将粗分类设置为对象所属种类，比如说ds表示数据源数据点，或者是navBar表示导航条
            //而细分类需要包裹对象进行时的project信息以及对象id等等。
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
                eventHmt = arguments[2]
            } else if (typeof arguments[1] == 'string') {
                if (arguments[2] && typeof arguments[2] == 'function') {
                    eventSelector = arguments[1];
                    eventFunction = arguments[2];
                    eventHmt = arguments[3]
                } else {
                    console.log('EventAdapter.on arguments[2 or 3] type error');
                    return;
                }
            }
            finalFunction = function(e) {
                if (!(eventHmt === false)) {
                    EventAdapter.analyse(e, eventHmt);
                }
                eventFunction.call(this, e);
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
                    case 'dragover':
                        mobileDragOver(eventTarget, eventSelector, finalFunction);
                        break;
                    case 'dragleave':
                        mobileDragLeave(eventTarget, eventSelector, finalFunction);
                        break;
                        //case 'dragend' :
                        //    mobileDragEnd(eventTarget,eventFunction);
                        //    break;
                    case 'drop':
                        mobileDrop(eventTarget, eventSelector, finalFunction);
                        break;
                    default:
                        eventTarget.on(eventType, eventSelector, finalFunction);
                        break;
                }
            }
            return eventTarget;
        },
        //兼容性解绑事件
        'eventOff': function() {
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
                    case 'click':
                        eventTarget.off('touchstart', eventSelector, mobileDragStart);
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
    EventAdapter.setData = function(date) {
        if (date == undefined) return;
        eventData = date;
    };
    //drag事件参数获取
    EventAdapter.getData = function() {
        return eventData;
    };
    //drop事件发生后自动清空传递数据
    document.addEventListener('drop', function() {
        eventData = null;
    }, false);

    document.addEventListener('touchend', function() {
        eventData = null;
    }, false);
    //清除drag事件以免内存溢出
    EventAdapter.clearEvent = function() {
        $(document).off('touchmove.copy');
        $(document).off('touchmove.drag');
        $(document).off('touchend.drop');
    };
    //各事件触发次数站长统计
    EventAdapter.analyse = function(e, hmtInfo) {
        var category = '',
            action = '',
            param = {},
            value = 0;
        var target = e.currentTarget;
        if (hmtInfo && hmtInfo.type) {
            category = hmtInfo.type
        } else {
            target.dataset && target.dataset.hmt && target.dataset.hmt.type && (category = target.dataset.hmt.type)
        }
        if (hmtInfo && hmtInfo.action) {
            action = hmtInfo.action
        } else {
            target.dataset && target.dataset.hmt && target.dataset.hmt.action && (action = target.dataset.hmt.action)

        }
        if (target.attributes) {
            for (var i = 0; i < target.attributes.length; i++) {
                var keyIndex = target.attributes[i].name.search('data-hmt-param-');
                if (keyIndex) {
                    param[target.attributes[i].name.slice(keyIndex + 15)] = target.attributes[i].value
                }
            }
        }
        if (hmtInfo && hmtInfo.param) {
            Object.keys(hmtInfo.param).forEach(function(key) {
                param[key] = hmtInfo.param[key];
            })

        }
        if (hmtInfo && hmtInfo.value) {
            value = hmtInfo.value
        } else {
            target.dataset && target.dataset.hmt && target.dataset.hmt.value && (value = target.dataset.hmt.value)
        }
        if (!category || !action) return;
        trackEvent(category, action, param, value)
    }

    // EventAdapter.analyse = function(e, eventType, hmtInfo) {
    //     return;
    //     var mainInfo = '',
    //         initArrTag, finalArrTag, tag, unitTag;
    //     var target = $(e.currentTarget);

    //     if (hmtInfo instanceof Array && hmtInfo[0]) {
    //         mainInfo = judgeWay(hmtInfo[0]);
    //         initArrTag = hmtInfo.filter(function(ele, index) {
    //             return index > 0 && ele != '';
    //         });
    //         finalArrTag = [];
    //         for (var i = 0; i < initArrTag.length; i++) {
    //             unitTag = judgeWay(initArrTag[i]);
    //             if (unitTag == '') continue;
    //             finalArrTag.push(unitTag)
    //         }
    //         tag = finalArrTag.join('-');
    //     } else {
    //         if (hmtInfo != undefined) {
    //             mainInfo = judgeWay(hmtInfo);
    //         } else {
    //             mainInfo = getInfo(target);
    //         }
    //         mainInfo = mainInfo ? mainInfo : '';
    //         tag = mainInfo;
    //     }
    //     _hmt.push(['_trackEvent', mainInfo.substr(0, 30), eventType, 'user-' + (AppConfig.userId ? AppConfig.userId : 0) + '/project-' + (AppConfig.projectId ? AppConfig.projectId : 0)]);
    //     //console.log('mainInfo:'+mainInfo);
    //     //console.log('tag:'+tag);
    //     function getInfo(tar) {
    //         if (tar.length == 0) return;
    //         var tarInfo;
    //         if (tar.attr('id')) {
    //             tarInfo = tar.attr('id');
    //         } else if (tar.attr('i18n')) {
    //             tarInfo = tar.attr('i18n');
    //         } else if (tar.attr('title')) {
    //             tarInfo = tar.attr('title');
    //         } else {
    //             tarInfo = tar[0].innerText.replace(/^\s\s*/, '').replace(/\s\s*$/, '').substr(0, 30);
    //         }
    //         return tarInfo;
    //     }

    //     function judgeWay(arg) {
    //         if (typeof arg == 'undefined') {
    //             return '';
    //         }
    //         if (arg instanceof Function) {
    //             return arg.call(this, e)
    //         } else if (typeof arg == 'string') {
    //             if (arg == 'text') {
    //                 return e.currentTarget.innerText.replace(/^\s\s*/, '').replace(/\s\s*$/, '').substr(0, 30)
    //             } else {
    //                 return $(e.currentTarget).attr(arg) ? $(e.currentTarget).attr(arg) : arg;
    //             }
    //         } else if (typeof arg == 'number') {
    //             return arg;
    //         }
    //     }
    // };

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
    var mobileDragStart = function(e, target, eventFunction) {
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
        $copyTarget.css('z-index', 10000);
        $copyTarget.css('position', 'absolute');
        $copyTarget.css('opacity', '0.5');
        $copyTarget.css('pointer-events', 'none');
        var $container = $('body');
        $container.append($copyTarget);
        var sPos = $(originalTarget)[0].getBoundingClientRect();
        $copyTarget.css('left', sPos.left - $container[0].offsetLeft + 'px');
        $copyTarget.css('top', sPos.top - $container[0].offsetTop + 'px');
        $copyTarget[0].cssText = originalTarget.cssText;
        $copyTarget.css('width', originalTarget.offsetWidth);
        $copyTarget.css('height', originalTarget.offsetHeight);
        //originalTarget.parentNode.appendChild($copyTarget[0]);
        eventStatus = 'dragStart';
        eventFunction.call(this, ev);
        $(document).off('touchend.copy').on('touchend.copy', function(e) {
            $copyTarget.remove();
            eventStatus = 'dragEnd';
        });
        $(document).on('touchmove.copy', function(e) {
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

    var mobileDragOver = function(e, target, eventFunction) {
        if (eventStatus != 'dragMove' && eventStatus != 'dragMoveIn' && eventStatus != 'dragMoveOut') return;
        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
        var targetWidth, targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if ((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY)) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventStatus = 'dragMoveIn';
                eventFunction.call(this, e);
                break;
            }
        }
    };

    var mobileDragLeave = function(e, target, eventFunction) {
        if (eventStatus != 'dragMoveIn') return;
        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
        var targetWidth, targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if (!((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY))) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventStatus = 'dragMoveOut';
                eventFunction.call(this, e);
            }
        }
    };

    var mobileDragEnd = function(e, target, eventFunction) {
        eventFunction.call(this, e);
    };

    var mobileDrop = function(e, target, eventFunction) {
        if (eventStatus != 'dragMove' && eventStatus != 'dragMoveIn') return;
        //e.stopImmediatePropagation();
        //var ev = e.originalEvent.changedTouches[0];
        var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
        var eventTarget = target;
        var targetWidth, targetHeight;
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
/**
 * Created by win7 on 2015/10/28.
 */
//禁止弹出警告
(function(){
    window.alert = function(str){
        return;
    }
})();
//根元素font-size大小调整
//(function(){
//    var device = 'iPhone6';
//    var rootSize;
//    switch (device) {
//        case 'iPhone6s':
//            rootSize = '20px';
//            break;
//        default:
//            rootSize = '20px';
//            break;
//    }
//    document.getElementsByTagName('html')[0].style.fontSize = rootSize;
//})();

//状态栏高度修改
var CssAdapter = (function(){
    var _this;
    var device;
    var css;
    function CssAdapter(){
        _this = this;
    }
    CssAdapter.adapter = function(mode){
        device='Nexus 5';
        switch (device) {
            case 'iPhone6s':
                css = {
                    'indexMainTop': 'calc(3.6% + 60px)',
                    'navTop':'44px',
                    'navStatus':'30px',
                    'navBottom': '49px'
                };
                break;
            case 'iPhone6':
            case 'iPhone5':
            case 'iPhone5s':
            case 'iPhone5c':
            case 'iPhone4':
            case 'iPhone4s':
                css = {
                    'indexMainTop': 'calc(3.6% + 40px)',
                    'navTop':'44px',
                    'navStatus':'20px',
                    'navBottom': '49px'
                };
                break;
            default :
                css = {
                    'indexMainTop': '3.6rem',
                    'navTop':'44px',
                    'navBottom': '49px',
                    'navStatus':'0px'
                };
                break;
        }
        if (mode) {
            if (mode.bottom === false) {
                css.navBottom = '0px'
            }
        }
        BomConfig.mainHeight = '-webkit-calc(' + BomConfig.height +' - ' + css.navStatus + ' - ' + css.navTop + ' - ' + css.navBottom + ')';
        BomConfig.statusHeight = css.navStatus;
        BomConfig.topHeight = css.navTop;
        BomConfig.bottomHeight = css.navBottom;
        BomConfig.wrapHeight = '-webkit-calc(' + BomConfig.height +' - ' + css.navStatus +')';
        $(ElScreenContainer).css({
            'height':BomConfig.mainHeight
        });
        //$('#navStatus').css({
        //    'height':BomConfig.statusHeight
        //});
        $('#navTop').css({
            'height':'-webkit-calc(' + BomConfig.topHeight + ' + '+ BomConfig.statusHeight + ')'
        });
        $('#topBlank').css({
            'height':BomConfig.topHeight
        });
        $('#navBottom').css({
            'bottom':0,
            'height':BomConfig.bottomHeight
        });
        $('#bottomBlank').css({
            'height':BomConfig.bottomHeight
        });
        $('#outerContainer').css({
            'height':BomConfig.wrapHeight
        });
        $(SpinnerContainer).css({
            'top':'-webkit-calc(' + css.navStatus +' + ' + css.navTop + ')',
            'height':'-webkit-calc('+ BomConfig.height +' - ' + css.navStatus + ' - ' + css.navTop + ' - '+ css.navBottom + ')'
        });
    };
    CssAdapter.addBlank = function(){
        $(ElScreenContainer).children().first().before('<div id="statusBlank"></div><div id="topBlank"></div>');
        $(ElScreenContainer).children().last().after('<div id="bottomBlank"></div>');
        $('#statusBlank').css({
            'height':css.navStatus
        });
        $('#topBlank').css({
            'height':css.navTop
        });
        $('#bottomBlank').css({
            'height':css.navBottom
        });
    };
    CssAdapter.setIndexMain = function(){
            //$(ElScreenContainer).css({
            //    'height':'calc(100% - ' + css.navBottom + ')'
            //});
            $(ElScreenContainer).css({
                'height':'-webkit-calc(100% - ' + css.navBottom + ')'
            })
        };
    CssAdapter.clearIndexMain = function() {
        $(ElScreenContainer).css({
            'height': 'inherit'
        })
    };
    CssAdapter.setOuterContainer = function(){
            //$('#outerContainer').css({
            //    'height':'calc('+ BomConfig.height +'px - ' + css.navStatus +')'
            //});
            $('#outerContainer').css({
                'height':'-webkit-calc('+ BomConfig.height +' - ' + css.navStatus +')'
            })
        };
    CssAdapter.clearOuterContainer = function(){
        //$('#outerContainer').css({
        //    'height':'calc('+ BomConfig.height +'px - ' + css.navStatus + ' - ' + css.navTop  + ')'
        //});
        $('#outerContainer').css({
            'height':'-webkit-calc('+ BomConfig.height +' - ' + css.navStatus + ' - ' + css.navTop  + ')'
        })
    };
    return CssAdapter;
})();
//加载动画适应
var SpinnerControl = (function(){
    var _this;
    function SpinnerControl(){
        _this = this;
    }
    SpinnerControl.show= function(){
        $(SpinnerContainer).show();
        Spinner.spin(SpinnerContainer);
    };
    SpinnerControl.hide = function(){
        $(SpinnerContainer).hide();
        Spinner.stop();
    };
    return SpinnerControl;
})();
//字符串处理
var StringUtil = (function () {
    var HTML_ENTITIES = {
        '&': '&amp;',
        '>': '&gt;',
        '<': '&lt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;'
    }, HTML_ENTITIES_INVERT = invert(HTML_ENTITIES);

    function invert(obj) {
        var result = {}, keys = Object.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    function padLeft(oldStr, padNum, padStr) {
        if (!padStr) {
            return oldStr;
        }
        return Array(padNum - String(oldStr).length + 1).join(padStr) + oldStr;
    }

    function htmlEscape(text) {
        if (!text) {
            return text
        }
        var source = '(?:' + Object.keys(HTML_ENTITIES).join('|') + ')',
            replaceRegexp = RegExp(source, 'g');
        return text.replace(replaceRegexp, function (character) {
            return HTML_ENTITIES[character];
        });
    }

    function htmlUnEscape(text) {
        if (!text) {
            return text
        }
        var source = '(?:' + Object.keys(HTML_ENTITIES_INVERT).join('|') + ')',
            replaceRegexp = RegExp(source, 'g');
        return text.replace(replaceRegexp, function (character) {
            return HTML_ENTITIES_INVERT[character];
        });
    }

    var getI18nProjectName = function (project) {
        if (!I18n || !project) {
            return '';
        }
        var result = '';
        switch (I18n.type) {
            case 'en':
            {
                result = project.name_english;
                break;
            }
            case 'zh':
            {
                result = project.name_cn;
                break;
            }
            default :
            {
                result = project.name_english;
            }
        }
        return result || '';
    };

    return {
        padLeft: padLeft,
        htmlEscape: htmlEscape,
        htmlUnEscape: htmlUnEscape,
        getI18nProjectName: getI18nProjectName
    }
})();
//缩放目录条
var IndexBar = function(){
    var _this;
    function IndexBar(arrIndex,option){
        _this = this;
        _this.dom = undefined;
        _this.arrIndex = arrIndex;
        _this.option = option;
    }
    IndexBar.prototype = {
        create:function(){
            var indexUl = document.createElement('div');
            indexUl.classList = ['index-ul'];
            indexUl.id = _this.option.id?_this.option.id:null;
            var serIndexLi;
            if (_this.arrIndex == 0){

            }else{
                indexUl.appendChild('<div class="index-control glyphicon glyphicon-menu-right"></div>')
            }
            for (var i = 0; i < _this.arrIndex.length; i++){
                serIndexLi = new StringBuilder();
                serIndexLi = '\
                <div class="index-li" id="link-' + _this.arrIndex[i].id + '">\
                    <a href="#' + _this.arrIndex[i].id + '"> ' + _this.arrIndex[i].name +'</a>\
                </div>';
                indexUl.innerHTML += serIndexLi.toString();
            }
            _this.option.container.appendChild(indexUl);
            _this.dom = indexUl;
            _this.initEvent();
        },
        initEvent:function(){
            $(_this.dom).find(' .index-control').off('tap').on('tap',function(e){
                if ($(e.target).hasClass('glyphicon-menu-right')){
                    $(e.target).removeClass('glyphicon-menu-right').addClass('glyphicon-menu-left');
                    _this.show();
                }else{
                    $(e.target).removeClass('glyphicon-menu-left').addClass('glyphicon-menu-right');
                    _this.hide();
                }
            })
        },
        show:function(){
            $(_this.dom).addClass('index-ev-show');
        },
        hide:function(){
            $(_this.dom).addClass('index-ev-hide');
        },
        destroy:function(){
            $(_this.dom).remove();
        }
    };
    return IndexBar;
};
//textarea高度自适应
// * 文本框根据输入内容自适应高度
// * @param                {HTMLElement}        输入框元素
// * @param                {Number}                设置光标与输入框保持的距离(默认0)
// * @param                {Number}                设置最大高度(可选)
// */
var autoTextarea = function (elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera');
        var addEvent = function (type, callback) {
                        elem.addEventListener ?
                                elem.addEventListener(type, callback, false) :
                                elem.attachEvent('on' + type, callback);
                };
        var getStyle = elem.currentStyle ? function (name) {
                        var val = elem.currentStyle[name];

                        if (name === 'height' && val.search(/px/i) !== 1) {
                                var rect = elem.getBoundingClientRect();
                                return rect.bottom - rect.top -
                                        parseFloat(getStyle('paddingTop')) -
                                        parseFloat(getStyle('paddingBottom')) + 'px';
                        };

                        return val;
                } : function (name) {
                                return getComputedStyle(elem, null)[name];
                };
        var minHeight = parseFloat(getStyle('height'));
        //var minHeight = 22;
        elem.style.resize = 'none';

        var change = function () {
                var scrollTop, height,
                        padding = 0,
                        style = elem.style;

                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;

                if (!isFirefox && !isOpera) {
                        padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                        if (maxHeight && elem.scrollHeight > maxHeight) {
                                height = maxHeight - padding;
                                style.overflowY = 'auto';
                        } else {
                                height = elem.scrollHeight;
                                style.overflowY = 'hidden';
                        };
                        style.height = height + extra + 'px';
                        scrollTop += parseInt(style.height) - elem.currHeight;
                        document.body.scrollTop = scrollTop;
                        document.documentElement.scrollTop = scrollTop;
                        elem.currHeight = parseInt(style.height);
                };
        };

        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
};
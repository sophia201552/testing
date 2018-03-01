/**
 * Created by win7 on 2015/10/28.
 */
//禁止弹出警告
(function(){
    window.alert = function(str){
        return;
    }
})();

//状态栏高度修改
var CssAdapter = (function(){
    var _this;
    var device;
    var css;
    function CssAdapter(){
        _this = this;
    }
    CssAdapter.adapter = function(){
        device='iPhone6';
        switch (device) {
            case 'iPhone6s':
                css = {
                    'indexMainTop': 'calc(3.6% + 60px)',
                    'navTop':'3.6rem',
                    'navStatus':'3rem',
                    'navBottom': '4rem'
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
                    'navTop':'3.6rem',
                    'navStatus':'2rem',
                    'navBottom': '4rem'
                };
                break;
            default :
                css = {
                    'indexMainTop': '3.6rem',
                    'navTop':'3.6rem',
                    'navBottom': '4rem',
                    'navStatus':'0px'
                };
                break;
        }
        //$('#indexContainer').css({
        //   'height':'auto'
        //});
        $(ElScreenContainer).removeClass('homePage');
        //$(ElScreenContainer).css({
        //    'height':'calc('+ $(window).height() +'px - ' + css.navStatus + ' - ' + css.navTop + ' - '+ css.navBottom + ')'
        //});
        //$(ElScreenContainer).css({
        //    'padding-top': 'calc(' + css.navStatus + ' + ' + css.navTop+')',
        //    'padding-bottom':css.navBottom
        //});
        $('#outerContainer').css({
            'height':'calc(' + $(window).height() +'px - ' + css.navStatus + ' - ' + css.navTop +')',
            'top':css.navStatus
        });
        $(SpinnerContainer).css({
            'top':'calc(' + css.navStatus +' + ' + css.navTop + ')',
            'height':'calc('+ $(window).height() +'px - ' + css.navStatus + ' - ' + css.navTop + ' - '+ css.navBottom + ')'
        });
        $('#bottomBlank').css({
            'height':css.navBottom
        });
        $('#navTop').css({
            'top':css.navStatus
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
            $(ElScreenContainer).css({
                'height':'calc(100% - ' + css.navBottom + ')'
            })
        };
    CssAdapter.clearIndexMain = function() {
        $(ElScreenContainer).css({
            'height': 'auto'
        })
    }
    CssAdapter.setOuterContainer = function(){
            $('#outerContainer').css({
                'height':'calc('+ $(window).height() +'px - ' + css.navStatus +')'
            })
        };
    CssAdapter.clearOuterContainer = function(){
        $('#outerContainer').css({
            'height':'calc('+ $(window).height() +'px - ' + css.navStatus + ' - ' + css.navTop  + ')'
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
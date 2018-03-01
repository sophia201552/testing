(function (root, factory) {
    
/* CommonJS */
if (typeof exports == 'object') module.exports = factory()

/* AMD module */
else if (typeof define == 'function' && define.amd) define(factory)

/* Browser global */
else root.LoadingSpinner = factory()
}
(this, function () {
"use strict";

var loader = $.Deferred();

/**
* 创建标签，默认div，并给标签添加属性，返回标签
*/
function createEl(tag, prop) {
var el = document.createElement(tag || 'div')
, n;

for (n in prop) el[n] = prop[n];
return el;
}

/**
* 添加子元素并且返回父元素
*/
function ins(parent /* child1, child2, ...*/) {
for (var i = 1, n = arguments.length; i < n; i++)
    parent.appendChild(arguments[i])

return parent;
}

/**
* 设置多个样式并且返回元素
*/
function css(el, prop) {
for (var n in prop)
    el.style[n] = prop[n];

return el;
}

/*创建 link 标签加载 CSS 样式*/ 
(function loadCSS () {
if(document.head.querySelector('.__spinCSS')) {
    return;
}
var link = createEl('link', { className: '__spinCSS', rel: 'stylesheet', href: '/static/scripts/lib/spin/spin.css' });
ins(document.getElementsByTagName('head')[0], link);
var interval_id = setInterval(function() {                       // start checking whether the style sheet has successfully loaded
    try {
        if ( link['sheet'] ) {                                  // SUCCESS! our style sheet has loaded
            clearInterval( interval_id );                      // clear the counters
            loader.resolve();
        }
    } catch( e ) {} finally {}

 }, 100 );
 return;
}()) 

/**
* Fills in default values.
*/
function merge(obj) {
for (var i = 1; i < arguments.length; i++) {
    var def = arguments[i];
    for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n];
}
return obj;
}

/** The constructor */
function LoadingSpinner(o) {
this.opts = merge(o || {}, this.defaults);
this.lines = 4;
this.shouldRecoverPosition = false;
}

/* 设置默认参数 */
LoadingSpinner.prototype.defaults = {
lineWidth: 3       /* 线宽*/
, radius: 20       /* 圆的半径 */      
, color: '#57c9ff' /* 颜色 */
, speed: 'normal' /* 速度: normal, slowly, fast */
};

/* 给构造函数原型添加方法 */
merge(LoadingSpinner.prototype, {
spin: function (target) {   
    this.stop();
    var _this = this;
    loader.done(function () {
        if(target){
            if($(target).css('position') === 'static') {
                css(target, {position: 'relative', left: 0, top: 0});
                _this.shouldRecoverPosition = true;
                _this.target = target; 
            }
            
            ins(target, _this.loading = ins(createEl('div', {className: 'loading'}), _this.loadingMask = createEl('div', {className: 'loadingMask'})) );
            
            var $target = $(target);
            css(_this.loading, {
                top: '-' + parseInt($target.css('border-top-width')) + 'px'
                ,left:'-' +  parseInt($target.css('border-left-width')) + 'px'
                ,right:'-' +  parseInt($target.css('border-right-width')) + 'px'
                ,bottom:'-' +  parseInt($target.css('border-bottom-width')) + 'px'
            });
        }
        _this.render(_this.loadingMask, _this.opts);
        return _this;
    });
},

/**
 * Stops and removes the LoadingSpinner.
 */
stop: function () {
        if(this.shouldRecoverPosition) {
            css(this.target, {position: 'static', top: '', left: ''});
            this.shouldRecoverPosition = false;
        }
        var loading = this.loading; 
        loading && loading.parentNode && loading.parentNode.removeChild(loading);
        this.loading = undefined;
        return this;
},

/* 创建线条 */
render: function (el, opts) {
    var loadingCenterAbsolute
    , loadingSpeed;
                
    loadingCenterAbsolute = createEl('div', {className: 'loading-center-absolute'});

    for( var i = 0; i < this.lines; i++) {
            loadingSpeed = css(createEl('div', {className: 'loading-speed-' + opts.speed}), {
                borderRadius: '50%'
                , position: 'absolute'
                , border: ( opts.lineWidth + 'px solid ' + opts.color)
                , borderRightColor: 'transparent'
                , borderBottomColor: 'transparent'
                , width: (opts.radius + i * 20) + 'px'
                , height: (opts.radius + i * 20) + 'px'
                , left: (75 - i * 10) + 'px'
                , top: (75 - i * 10) + 'px'
            }
        );
        
        ins(loadingCenterAbsolute, loadingSpeed);
    }  

    ins(el, ins(createEl('div', {className: 'loading-center'}), loadingCenterAbsolute ) );

    return el;
},
})

return LoadingSpinner;
}));
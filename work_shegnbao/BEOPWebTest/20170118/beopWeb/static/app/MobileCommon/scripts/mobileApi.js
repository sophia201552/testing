/**
 * Created by win7 on 2016/11/14.
 */
/*app基本信息*/
;(function(window){
    var app = {
        /*base*/
        host:'http://beop.rnbtech.com.hk',
        language:'zh',
        appVersion:'0.0.0',
        serviceVersion:'',

        /*frame*/
        frame:undefined,
        frameIOC:undefined,

        /*device*/
        platform:undefined,
        platformVersion:undefined,
        manufacturer:undefined,
        uuid:undefined,

        /*network*/
        network:'offline',
        isOnline:false,

        /*user_custom*/
        user:{}
    };

    function init(){
        initFrame();
        initDevice();
        initNavigator();
        initNetwork();
    }
    function initFrame(){
        if(window.cordova){
            app.frame = 'cordova';
            app.frameIOC = window.plugins;
        }else{
            app.frame = 'pc';
            app.frameIOC = navigator.plugins;
        }
    }

    function initDevice(){
        switch (app.frame){
            case 'cordova':
                if(!window.device){
                    console.log('Device plugin is not ready.');
                    return;
                }
                app.platform = window.device.platform;
                app.platformVersion = window.device.version;
                app.manufacturer = window.device.manufacturer;
                app.uuid = window.device.uuid;
                app.cordova = window.device.cordova;
                break;
            case 'pc':
                app.platform = navigator.platform;
                break;
            default :
                break;
        }
    }
    function initNavigator(){
        app.language = navigator.language?navigator.language.split()[0]:'zh'
    }
    function initNetwork(){
        switch (app.frame){
            case 'cordova':
                if(!navigator.connection){
                    console.log('Network plugin is not ready.');
                    return;
                }
                app.network = navigator.connection.type;
                app.isOnline = (app.network != 'none');
                break;
            case 'pc':
                app.network = 'line';
                app.isOnline = navigator.onLine;
        }
    }

    init();

    window.app = app;
})(window)

/*app视图信息*/
;(function(app){
    var screen = {
        orientation:window.screen.orientation,
        height:window.screen.height,
        width:window.screen.width,

        navTop:undefined,
        navTopHeight:undefined,
        navBottom:undefined,
        navBottomHeight:undefined,
        main:undefined,
        mainHeight:'',

        calcHeight:{
            navTop:undefined,
            navBottom:undefined,
            main:undefined
        },

        navContent:{
            top:{},
            bottom:{}
        },

        dictNavTool:{},

        resize:resize,
        setHeight:setHeight,
        initNavDom:initNavDom,
        toggleNav:toggleNav,
        setNavTool:setNavTool,
        setNavTopTool:setNavTopTool,
        setNavBottomTool:setNavBottomTool,
        registerNavTool:registerNavTool
    };
    function init(){
        initNavDom();
        var $body = $('body');
        if(app.platform == 'iOS'){
            if (screen.height <= 480) {
                $body.addClass('ios-1');
            } else if (screen.height < 1000) {
                $body.addClass('ios-2');
            }else {
                $body.addClass('ios-3');
            }
        }else if(app.platform == 'android'){
            $body.addClass('android-1');
        }else {
            $body.addClass('default-1');
        }

        attachEvent();
        resize();
    }
    function attachEvent(){
        $(screen.navTop).off('touchstart').on('touchstart','#btnPageBack',function(){
            Router.back();
        });
        $(screen.navBottom).off('touchstart').on('touchstart','.divNavBottomTool',function(e){
            if(e.currentTarget.dataset.target){
                router.to(window[e.currentTarget.dataset.target]);
            }else{
                if(content.bottom[e.currentTarget.id] && content.bottom[e.currentTarget.id].event instanceof Function){
                    content.bottom[e.currentTarget.id].event();
                }
            }
        });
        $(screen.navTop).off('touchstart').on('touchstart','.divNavTopTool',function(e){
            if(e.currentTarget.dataset.target){
                router.to(window[e.currentTarget.dataset.target]);
            }else{
                if(content.top[e.currentTarget.id] && content.bottom[e.currentTarget.id].event instanceof Function){
                    content.bottom[e.currentTarget.id].event();
                }
            }
        });
    }
    function initNavDom(){
        screen.navTop = document.getElementById('navTop');
        screen.navBottom = document.getElementById('navTop');
        screen.main = document.getElementById('mainContainer');
    }
    function resize(){
        screen.navTop.style.height = screen.navTopHeight;
        screen.navBottom.style.height = screen.navBottomHeight;
        screen.calcHeight.navTop = screen.navTop.offsetHeight;
        screen.calcHeight.navBottom = screen.navBottom.offsetHeight;
        computeMainSize();
    }

    function computeMainSize(){
        screen.calcHeight.main = window.height - screen.calcHeight.navTop - screen.calcHeight.navBottom;
        screen.mainHeight = screen.calcHeight.main + 'px'
    }
    function toggleNav(opt){
        var $body = $(document.getElementsByTagName('body')[0]);
        if(opt.top === true){
            $body.removeClass('hideNavTop');
        }else if(opt.top === false){
            $body.addClass('hideNavTop');
        }else if(opt.top == 'overlap'){
            $body.addClass('overlapNavTop');
        }
        if(opt.bottom === true){
            $body.removeClass('hideNavBottom');
        }else if(opt.bottom === false){
            $body.addClass('hideNavBottom');
        }else if(opt.bottom && opt.bottom == 'overlap'){

            $body.addClass('overlapNavBottom');
        }
        computeMainSize();
    }
    function setHeight(opt){
        Object.keys(opt).forEach(function(prop){
            if (screen.hasOwnProperty(prop)){
                screen[prop] = opt[prop]
            }
        });
        resize();
    }
    function setNavTool(opt){
        setNavTopTool(opt.top);
        setNavBottomTool(opt.bottom);
    }
    function setNavTopTool(opt){
        if(!(opt instanceof Array))return;
        var tool,content,option;
        opt.forEach(function(ele,i){
            if(typeof ele == 'string' && screen.dictNavTool[ele]){
                option = screen.dictNavTool[ele]
            }else{
                option = ele;
            }
            tool = document.createElement('div');
            tool.className = 'divNavTopTool';
            tool.id = option.id;
            if(option.cls)tool.className += ' ' + option.cls;
            if(option.position)tool.className += ' ' + option.position;
            if(option.target)tool.dataset.target = option.target;

            content = document.createElement('span');
            content.className = 'spContent';
            if(option.content)content.innerHTML = option.content;

            tool.appendChild(content);

            screen.navTop.appendChild(tool);

            screen.navContent.bottom[option.id] = {
                dom:tool,
                id:option.id,
                event:ele.event
            }
        });
    }
    function setNavBottomTool(opt){
        if(!(opt instanceof Array))return;
        var tool,icon,content,option;
        opt.forEach(function(ele,i){
            if(typeof ele == 'string' && screen.dictNavTool[ele]){
                option = screen.dictNavTool[ele]
            }else{
                option = ele;
            }
            tool = document.createElement('div');
            tool.className = 'divNavBottomTool';
            tool.id = option.id;
            if(option.cls)tool.className += ' ' + ele.cls;
            if(option.target)tool.dataset.target = option.target;

            icon = document.createElement('span');
            icon.className = 'spIcon';
            if(option.icon)icon.className += ' ' + option.icon;

            content = document.createElement('span');
            content.className = 'spContent';
            if(option.content)content.innerHTML = option.content;

            tool.appendChild(icon);
            tool.appendChild(content);

            screen.navBottom.appendChild(tool);

            screen.navContent.bottom[option.id] = {
                dom:tool,
                id:option.id,
                event:ele.event
            }
        })
    }
    function registerNavTool(opt){
        if(opt instanceof Array){
            opt.forEach(function(ele,i){
                screen.dictNavTool[ele.id] = ele;
            })
        }else{
            screen.dictNavTool[opt.id] = opt;
        }
    }

    init();

    app.screen = screen;
})(window.app)

/*--------------控件部分----------*/
/*路径控件*/
;(function (window){
    var router = {
        path : [],

        empty:empty,
        to:to,
        back:back
    };
    var curPage = undefined;
    function empty(){
        router.path = [];
    }
    function to(page,opt){
        if(page.pageOption.virtual){
            new page().show();
        }else {
            router.path.push({
                page: page,
                opt: opt
            });
            display();
        }
    }
    function display(){
        var cls = router.path[router.path.length -1];
        app.screen.setNavTool(cls.pageOption);
        curPage && curPage.close && curPage.close();
        curPage = new cls.page(cls.opt);
        curPage.show();
    }
    function back(){
        if(router.path[router.path.length -1].page.pageOption.back == false){
            return;
        }
        display();
    }
    window.Router = router
})(window)

/*事件控件*/
;(function (window){
    var event = {
        ready:undefined,
        pause:undefined,
        resume:undefined,
        online:undefined,
        offline:undefined,
        btnBack:undefined,
        btnMenu:undefined,
        btnVolumeDown:undefined,
        btnVolumeUp:undefined,

        cancelBackDefault:false,

        on:on,
        off:off
    };

    var dictEventForPc = {
        'ready':'DOMContentLoaded'
    };

    var dictEventForCordova = {
        'ready':'deviceready',
        'pause':'pause',
        'resume':'resume',
        'online':'online',
        'offline':'offline',
        'btnBack':'backbutton',
        'btnMenu':'menubutton',
        'btnVolumeDown':'volumedownbutton',
        'btnVolumeUp':'volumeupbutton'
    };
    var dict = {};
    switch  (app.frame){
        case 'cordova':
            dict = dictEventForCordova;
            break;
        case 'pc':
            dict = dictEventForPc;
    }
    function init(){
        document.addEventListener(dict['btnBack']?dict['btnBack']:'btnBack',
            function(){
                if(Router.cancelBackDefault)return;
                Router.back();
            },false);
        document.addEventListener(dict['online']?dict['online']:'online',
            function(){
                app.network = navigator.connection.type;
                app.isOnline = true;
            },false);
        document.addEventListener(dict['offline']?dict['offline']:'offline',
            function(){
                app.network = navigator.connection.type;
                app.isOnline = false;
            },false)
    }
    function on(ev,callback){
        if(event.hasOwnProperty(ev) && callback instanceof Function){
            event[ev] = callback
        }else{
            return;
        }
        document.addEventListener(dict[ev]?dict[ev]:ev,callback,false)
    }
    function off(ev){
        if(event.hasOwnProperty(ev)){
            event[ev] = undefined
        }
        document.removeEventListener(dict[ev]?dict[ev]:ev,event[ev],false)
    }

    init();

    window.Event = event;
})(window)

/*toast控件*/
;(function (window){
    var toast;

    var toast_cordova = {
        alert:function(msg,opt){
            var duration = opt.duration?opt.duration:'short';
            var location = opt.location?opt.location:'center';
            app.frameIOC.show('msg',duration,location)
        }
    };
    switch (app.frame){
        case 'cordova':
            toast = toast_cordova;
            break;
    }

    window.Toast = toast;
})(window)

/*spinner控件*/
;(function (window){
    var spinner = {
        spin:spin,
        stop:stop
    };
    function spin(container,option){
        if(container.querySelector('>.spinner'))return;
        var spinner = document.createElement('div');
        spinner.className = 'spinner';
        container.append(spinner)
    }
    function stop(container){
        var spinner = container.querySelector('>.spinner');
        if(!spinner)return;
        container.removeChild(spinner);
    }
    window.Spinner = spinner;
})(window)

/*spinner控件*/
;(function (window){
    var spinner = {
        spin:spin,
        stop:stop
    };
    function spin(container,option){
        if(container.querySelector('>.spinner'))return;
        var spinner = document.createElement('div');
        spinner.className = 'spinner';
        container.append(spinner)
    }
    function stop(container){
        var spinner = container.querySelector('>.spinner');
        if(!spinner)return;
        container.removeChild(spinner);
    }
    window.DataSource = spinner;
})(window);
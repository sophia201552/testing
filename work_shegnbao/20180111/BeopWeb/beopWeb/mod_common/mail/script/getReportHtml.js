var system = require('system');
var fs = require('fs');
var webPage = require('webpage');
var page = webPage.create();
var settings = {
    operation: "GET",
    encoding: "utf8",
    headers: {
        "Content-Type": "text/html; charset=utf-8",
        "token": "eyJhbGciOiJIUzI1NiIsImV4cCI6MT"
    }
};
// 日志
// var stream = fs.open('debug_'+ (+new Date()) +'.log', 'w');
// var result = fs.open('result_' + (+new Date()) + '.log', 'w');
// var test = fs.open('test.log', 'w');
var stream = fs.open('debug.log', 'w');
var result = fs.open('result.log', 'w');
var test = fs.open('test.log', 'w');
// 计时器
var timer = null;
// 控制台参数
var args = system.args;
// 每英寸点数
var dpi = 100;
// 厘米->英寸
var cmToInchFactor = 0.393701;
// A4（单位：英寸）
var widthInInches = 8.27;
var heightInInches = 11.69;
// 页边距（单位：厘米）
var margin = 1;
// 即将打开的页面
var url;

var host = 'http://beop.rnbtech.com.hk';

var arrRequest = [];
var arrResponse = [];
// page.viewportSize = {
//     width: dpi * (widthInInches - 2 * margin * cmToInchFactor),
//     height: dpi * (heightInInches - 2 * margin * cmToInchFactor)
// };


page.viewportSize = {
    width: 1920,
    height: 1080
};

page.paperSize = {
    format: 'A4',
    orientation: 'portrait',
    margin: margin + 'cm'
};
renderComplete = false;
page.onConsoleMessage = function(msg) {
    if (msg === 'phantom - render summary complete') {
        if (renderComplete) {
            return;
        } else {
            renderComplete = true;
        }
        page.evaluate(function(arrRequests, arrResponses) {
            var beginEnable = false;
            var beginTime = new Date();
            var delayStart = false;
            var completeInDelay = false;
            var requestWatcher = window.setInterval(function() {
                if ((new Date() - beginTime) > 30000) {
                    console.log('start in force');
                    window.clearInterval(requestWatcher);
                    startDealPage();
                    return;
                }
                var isComplete = true;
                for (var i = 0; i < arrRequests.length; i++) {
                    if (arrResponses.indexOf(arrRequests[i]).length == -1) {
                        isComplete = false;
                        break;
                    }
                }
                if (isComplete) {
                    // console.log('watcher:complete');
                    if (!delayStart){
                        completeInDelay = true;
                        beginEnable = true;
                        delayStart = true;
                        requestJudgeDelay()
                    }else{
                        if(completeInDelay)beginEnable = true;
                    }
                } else {
                    // console.log('watcher:incomplete');
                    if(delayStart)completeInDelay = false;
                    beginEnable = false
                }
            }, 100);

            function requestJudgeDelay() {
                var delayTimer = window.setTimeout(function() {
                    console.log('request delay start')
                    if (beginEnable) {
                        console.log('start in nature')
                        window.clearTimeout(delayTimer);
                        window.clearInterval(requestWatcher);
                        startDealPage()
                    } else {
                        delayStart = false
                    }
                }, 10000)
            }
            // window.setTimeout(function(){
            //     console.log(new Date() - beginTime)
            //     startDealPage();
            // },10000)
            //startDealPage();
            function startDealPage() {
                window.setTimeout(function() {
                    var pageContainer = document.getElementById('pageContainer');
                    pageContainer.style.position = 'relative';
                    pageContainer.style.top = 0;
                    console.log('convert echarts start');
                    $('[_echarts_instance_]').each(function(i, dom) {
                        console.log('convert echarts');
                        var img = echarts.getInstanceById(dom.getAttribute('_echarts_instance_')).getDataURL({
                                type: 'jpeg',
                                backgroundColor: 'white',
                                excludeComponents: ['toolbox']
                            })
                            // console.log('1: ' + img);
                        dom.innerHTML = '<img style="width:100%;height:100%" src="' + img + '">'
                    });
                    $(document.body).children('.nav').remove();
                    console.log('convert echarts end');
                    $('head style').each(function(i, dom) {
                        if (dom.innerHTML) {
                            document.body.appendChild(dom)
                        }
                    })
                    var $style = $('link[type="text/css"]');
                    var arrHref = [];
                    $style.each(function(i, dom) {
                        if (!dom.getAttribute('href')) return;
                        arrHref.push(dom.getAttribute('href'))
                    })
                    var arrRequest = [];
                    for (var i = 0; i < arrHref.length; i++) {
                        arrRequest.push($.get(arrHref[i]))
                    }
                    $.when.apply(this, arrRequest).always(function() {
                        var style = document.createElement('style')
                        style.setAttribute('type', 'text/css')
                        if (arrRequest.length > 1) {
                            for (var i = 0; i < arguments.length; i++) {
                                style.innerHTML += arguments[i][0]
                            }
                        } else {
                            style.innerHTML += arguments[0]
                        }
                        document.body.insertBefore(style, document.body.children[0]);
                        console.log('style render complete')
                    });
                }, 5000)
            }
        }, arrRequest, arrResponse)
    } else if (msg === 'style render complete') {
        timer = setTimeout(function() {
            var ua = page.evaluate(function() {
                $('script').remove()
                return document.body.innerHTML
            });
            console.log(ua);
            result.flush();
            result.writeLine(ua);
            clearTimeout(timer);
            timer = null;

            phantom.exit();
        }, 5000);
    }
    // else if (msg.length <= 50 || msg.indexOf('console') >= 0) {
    //     test.writeLine('ontest= '+ msg);
    //     console.log(msg);
    // }
};
// __run();

page.onResourceRequested = function(request) {
    stream.writeLine('= onResourceRequested()');
    stream.writeLine('  request: ' + JSON.stringify(request, undefined, 4));
    arrRequest.push(request.id);
};

page.onResourceReceived = function(response) {
    stream.writeLine('= onResourceReceived()');
    stream.writeLine('  receive: ' + JSON.stringify(response, undefined, 4));
    arrResponse.push(response.id);
};

page.onLoadStarted = function() {
    stream.writeLine('= onLoadStarted()');
    stream.writeLine('  leaving url: ' + JSON.stringify(arguments));

};

page.onLoadFinished = function(status) {
    stream.writeLine('= onLoadFinished()');
    stream.writeLine('  status: ' + status);
};

page.onNavigationRequested = function(url, type, willNavigate, main) {
    stream.writeLine('= onNavigationRequested');
    stream.writeLine('  destination_url: ' + url);
    stream.writeLine('  type (cause): ' + type);
    stream.writeLine('  will navigate: ' + willNavigate);
    stream.writeLine('  from page\'s main frame: ' + main);
};

page.onResourceError = function(resourceError) {
    stream.writeLine('= onResourceError()');
    stream.writeLine('  - unable to load url: "' + resourceError.url + '"');
    stream.writeLine('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString);
};

page.onError = function(msg, trace) {
    stream.writeLine('= onError()');
    var msgStack = ['  ERROR: ' + msg];
    if (trace) {
        msgStack.push('  TRACE:');
        trace.forEach(function(t) {
            msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
        });
    }
    stream.writeLine(msgStack.join('\n'));
};

// http://beop.rnbtech.com.hk/factory/preview/report/
// url = 'http://beop.rnbtech.com.hk/factory/preview/report/' + (args[1] ) +'/1';
//url = 'https://beopdemo.smartbeop.com/factory/preview/report/148913143072607354c98715/1'
url = host + '/factory/preview/report/' + (args[1] ) +  '/1?projectId=' + args[2];

var settings_login = {
    operation: "POST",
    encoding: "utf8",
    headers: {
        "Content-Type": "application/json"
    },
    data: JSON.stringify({
        name: 'projecttest@rnbtech.com.hk',
        pwd: 'Rnbtech1103'
    })
};
page.open(host + '/login', settings_login, function(status) {
    if (status == 'success') {
        page.open(url, settings, function(status) {
            stream.flush();
            result.flush();
            var delay = setTimeout(function() {
                if (!renderComplete) {
                    var ua = page.evaluate(function() {
                        return document.body.innerHTML
                    });
                    console.log(ua);
                    result.flush();
                    result.writeLine(ua);
                    clearTimeout(delay);
                    delay = null;

                    phantom.exit();
                } else {
                    clearTimeout(delay);
                    delay = null;
                }
            }, 120000);
        });
    }
});
//page.open(url, settings, function(status) {
//    stream.flush();
//    result.flush();
//    var delay = setTimeout(function() {
//        if(!renderComplete) {
//            var ua = page.evaluate(function () {
//                return document.body.innerHTML
//            });
//            console.log(ua);
//            result.flush();
//            result.writeLine(ua);
//            clearTimeout(delay);
//            delay = null;
//
//            phantom.exit();
//        }else{
//            clearTimeout(delay);
//            delay = null;
//        }
//    }, 120000);
//    //page.evaluate(function(){
//    //
//    //});
//    //  var cookies = page.cookies;
//    //
//    //  console.log('Listing cookies:');
//    //  for(var i in cookies) {
//    //    console.log(cookies[i].name + '=' + cookies[i].value);
//    //  }
//
//});
// __run();
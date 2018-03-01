var system = require('system');
var fs = require('fs');
var webPage = require('webpage');
var page = webPage.create();
var settings = {
  operation: "GET",
  encoding: "utf8",
  headers: {
    "Content-Type": "text/html; charset=utf-8",
    "token":"eyJhbGciOiJIUzI1NiIsImV4cCI6MT"
  }
};
// 日志
var stream = fs.open('debug.log', 'w');
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

page.viewportSize = {
	width: dpi * (widthInInches - 2*margin*cmToInchFactor),
	height: dpi * (heightInInches - 2*margin*cmToInchFactor)
};

page.paperSize = {  
	format: 'A4',
	orientation: 'portrait',
	margin: margin + 'cm'
};

page.onConsoleMessage = function(msg) {
	if (msg === 'phantom - render summary complete') {
		console.log('complete in 5 seconds.');
		stream.flush();
		timer = setTimeout(function () {
            // page.render('testreport.pdf');
            var ua = page.evaluate(function() {
                return document.getElementById('reportWrap').innerHTML;
            });
			// console.log(ua)
            console.log(page.content)
			clearTimeout(timer);
			timer = null;
			
			phantom.exit();
		}, 5000);
	}
};
// __run();

page.onResourceRequested = function (request) {
    stream.writeLine('= onResourceRequested()');
    stream.writeLine('  request: ' + JSON.stringify(request, undefined, 4));
};

page.onResourceReceived = function(response) {
    stream.writeLine('= onResourceReceived()' );
    stream.writeLine('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
	
	if (response.url.indexOf('/startWorkspaceDataGenHistogramMulti') > -1) {
		if (response.stage === 'end') {
			console.log('get data success.');
		}
		stream.flush();
	}
};

page.onLoadStarted = function() {
    stream.writeLine('= onLoadStarted()');
    stream.writeLine('  leaving url: ' + arguments);
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
    stream.writeLine('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString );
};

page.onError = function(msg, trace) {
    stream.writeLine('= onError()');
    var msgStack = ['  ERROR: ' + msg];
    if (trace) {
        msgStack.push('  TRACE:');
        trace.forEach(function(t) {
            msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    stream.writeLine(msgStack.join('\n'));
};

// http://beop.rnbtech.com.hk/factory/preview/report/
console.log('open url: ' + (url = 'https://beopdemo.smartbeop.com/factory/preview/report/' + (args[1] || '') + '/1'));
page.open(url, settings, function(status) {	
	console.log(status);
});

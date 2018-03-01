try {
    var system = require('system');
    var args = system.args;

    args.forEach(function(arg, i) {
        console.log('[' + i + '] ' + arg);
    });

    if (args.length < 2 || !args[1]) {
        console.error("Output file path is not provided!");
        phantom.exit(1);
    }

    if (args.length < 3 || !args[2]) {
        console.error("Echart option is not provided!");
        phantom.exit(1);
    }

    if (args.length < 4 || !args[3]) {
        console.error("Other option is not provided!");
        phantom.exit(1);
    }

    var outputFilePath = args[1];
    var echartOption = JSON.parse(args[2]);
    var otherOption = JSON.parse(args[3]);
    console.log('width = ' + otherOption.width);
    var page = require('webpage').create();
    page.viewportSize = { width: 800, height: 800 };
    page.onConsoleMessage = function(msg) {
        console.log(msg);
        if (msg === '##PHANTOM## DONE') {
            // 通过在页面上执行脚本获取页面的渲染高度
            var bb = page.evaluate(function () {
                return document.getElementById('chartarea').getBoundingClientRect();
            });
            console.log('bb.top = ' + bb.top + '; bb.left = ' + bb.left + '; bb.height = ' + bb.height + '; bb.width = ' + bb.width);
            // 按照实际页面的高度，设定渲染的宽高
            page.clipRect = {
                top:    bb.top,
                left:   bb.left,
                width:  bb.width,
                height: bb.height
            };
            window.setTimeout(function() {
                page.render(outputFilePath);
                page.close();
                phantom.exit();
            }, 1000);
        } else if (msg === '##PHANTOM## FAILED') {
            phantom.exit(1);
        }
    };

    page.open('echart.html', function() {
        console.log("Page loaded.");
        page.evaluate(function(echartOption, otherOption) {
            try {
                var chartArea = window.document.getElementById('chartarea');

                if (!chartArea) {
                    throw "Cannot find chart area!";
                }
                //otherOption = otherOption || {};
                chartArea.style.width = (otherOption.width || 700) + 'px';
                chartArea.style.height = (otherOption.height || 300) + 'px';
                var chart = echarts.init(chartArea);
                chart.setOption(echartOption);
                console.log("##PHANTOM## DONE");
            } catch (e) {
                console.error(e);
                console.log("##PHANTOM## FAILED");
            }
        }, echartOption, otherOption);
        console.log("##PHANTOM## DONE");
    });
} catch (e) {
    console.error(e);
    phantom.exit(4);
}
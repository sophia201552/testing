'use strict';

var pathFn = require('path');
var fsFn = require('fs-extra');
var childProcessFn = require('child_process');

var DEST_PATH = 'beopWeb/static/build';

module.exports = function (args) {
    var baseDir = this.baseDir;
    var rootDir = this.rootDir;
    var input = args._.shift();
    var branchDir, buildPath;
    var log = console.log;
    var info = this.log.info, warn = this.log.warn, error = this.log.error;
    var version = formatDate(new Date());
    var fileInput;

    if( !input ) {
        log( error('没有指定源目录!') );
        return false;
    }

    if( pathFn.isAbsolute(input) ) branchDir = input; 
    else branchDir = pathFn.join(baseDir, input);

    if( !fsFn.existsSync(branchDir) ) {
        log( error('指定的源目录不存在！\n'+branchDir) );
        return false;
    }

    buildPath = pathFn.join(branchDir, DEST_PATH);

    // 更改 config.js 中的两个配置( debug, compileDir )
    fileInput = fsFn.readFileSync(buildPath+'/config.js', {
        encoding: 'utf8',
        flag: 'r'
    });

    if( !fileInput ) {
        log( error( '读取 config.js 出错！\n'+(buildPath+'/config.js') ) );
        return false;
    }

    // 修改 debug 的值
    fileInput = fileInput.replace(/(debug[\s|:]+).*(?=,)/, function ($0, $1) {
        return $1 + 'false';
    });

    // 修改 compileDir 的值
    fileInput = fileInput.replace(/(compileDir[^'"]*).*(?=,)/, function ($0, $1) {
        return $1 + '"pkgs/'+version+'/"';
    });

    fsFn.writeFileSync(buildPath+'/config.js', fileInput, {
        encoding: 'utf8',
        flag: 'w'
    });

    // 复制 js 压缩脚本到打包目录
    fsFn.copySync( rootDir+'src/build', buildPath );

    childProcessFn.execFileSync(buildPath+'/build.bat', {
        cwd: buildPath, // 这行的效果和 bat 脚本开头使用 cd "%~sdp0" 是一样的
        stdio: ['pipe', process.stdout]
    });

    log( info('压缩 js 成功！') );

    return true;
};

function formatDate(d) {
    var year     = d.getFullYear();
    var month    = d.getMonth();
    var dayMonth = d.getDate();
    var hours    = d.getHours();
    var minutes  = d.getMinutes();
    var seconds  = d.getSeconds();

    month    = month < 9 ? '0'+(month+1) : month%12+1;
    dayMonth = dayMonth < 10 ? '0'+dayMonth : dayMonth;
    hours    = hours < 10 ? '0'+hours : hours;
    minutes  = minutes < 10 ? '0'+minutes : minutes;
    seconds  = seconds < 10 ? '0'+seconds : seconds;

    return [year, month, dayMonth, hours, minutes, seconds].join('');
};
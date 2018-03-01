'use strict';

var pathFn = require('path');
var fsFn = require('fs-extra');

var ONLINE_OPTIONS = "#ONLINE OPTIONS BEGIN\r\n\
    GZIP_ENABLE=True,\r\n\
    SITE_DOMAIN='beop.rnbtech.com.hk',\r\n\
    DEV_ENVIRONMENT=False,\r\n\
    USERNAME='beopweb',\r\n\
    PASSWORD='rnbtechrd',\r\n\
    INIT_CONNECTIONS_POOL=10,\r\n\
    HOST='114.215.172.232',\r\n\
    MONGO_SERVER_HOST='beop.rnbtech.com.hk'\r\n\
    #ONLINE OPTIONS END";
var PATTERN = /#ONLINE OPTIONS BEGIN[^]*#ONLINE OPTIONS END/m;

module.exports = function (args) {
	var baseDir = this.baseDir, branchDir;
	var input = args._.shift(), inputPath;
	var log = console.log;
    var info = this.log.info, warn = this.log.warn, error = this.log.error;
    var fileInput;

	if( !input ) {
        log( error('没有指定源目录!') );
        return false;
    }

    if( pathFn.isAbsolute(input) ) branchDir = input; 
    else branchDir = pathFn.join(baseDir, input);

    inputPath = pathFn.join(branchDir, '/beopWeb/__init__.py');
    if( !fsFn.existsSync(inputPath) ) {
        log( error('未找到 __init__.py 文件！\n'+inputPath) );
        return false;
    }

    fileInput = fsFn.readFileSync(inputPath, {
        encoding: 'utf8',
        flag: 'r'
    });

    // 修改 debug 的值
    fileInput = fileInput.replace(PATTERN, ONLINE_OPTIONS);

    fsFn.writeFileSync( inputPath, fileInput, {
        encoding: 'utf8',
        flag: 'w'
    } );

    log( info('配置修改工作完成！') );

    return true;
};
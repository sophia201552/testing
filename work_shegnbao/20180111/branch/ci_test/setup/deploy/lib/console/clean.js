'use strict';

var pathFn = require('path');
var fsFn = require('fs-extra');

module.exports = function (args) {
	var baseDir = this.baseDir, branchDir;
	var input = args._.shift();
	var log = console.log;
    var info = this.log.info, warn = this.log.warn, error = this.log.error;
    var plant_path, build_path;
    var build_path_filter = ['pkgs', 'config.js'];

	if( !input ) {
        log( error('没有指定源目录!') );
        return false;
    }

    if( pathFn.isAbsolute(input) ) branchDir = input; 
    else branchDir = pathFn.join(baseDir, input);

    plant_path = pathFn.join(branchDir, '/beopWeb/static/images/plant');
    build_path = pathFn.join(branchDir, '/beopWeb/static/build');

    if( !fsFn.existsSync(plant_path) ) {
    	log( error('未找到 plant 文件夹！\n'+plant_path) );
    	return false;
    }

    if( !fsFn.existsSync(build_path) ) {
    	log( error('未找到 build 文件夹！\n'+build_path) );
    	return false;
    }

    // 清除 /static/images/plant 目录下的所有文件
    if( fsFn.emptyDirSync(plant_path) ) {
    	log( error('清除 plant 目录下文件失败！') );
    	return false;
    }
    // 清除 /static/build 目录下除了 pkgs 和 config.js 之外的所有文件/文件夹
    fsFn.readdirSync(build_path).forEach( function (file, index) {
    	var curPath = build_path + '/' + file;
    	if( build_path_filter.indexOf(file) === -1 ) {
    		if( fsFn.removeSync(curPath) ) {
    			log( warn('删除文件（夹）失败！由于不影响正常流程，将跳过该错误。\n'+curPath) );
    		}
    	}
    } );

    log( info('清除工作完成！') );

    return true;
};
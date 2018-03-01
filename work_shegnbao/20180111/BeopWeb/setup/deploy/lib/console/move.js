'use strict';

var DEFAULT_INPUT = '../../Temp';
var pathFn = require('path');
var fsFn = require('fs-extra');

module.exports = function (args) {
    var input = args._.shift();
    var inPath, outPath;
    var baseDir = this.baseDir;
    var rootDir = this.rootDir;
    var log = console.log;
    var info = this.log.info, warn = this.log.warn, error = this.log.error;

    if(!input) {
        input = DEFAULT_INPUT;
        log(warn('没有设置源路径，将使用默认路径'));
    }
    outPath = pathFn.join(baseDir, '../'+formatDate(new Date()));

    inPath = pathFn.join(baseDir, input);
    log(info('当前的源路径：'+inPath));

    if( !fsFn.existsSync(inPath) ) {
        log(error('源路径不存在！'));
        return false;
    }

    // 在 BeopWebTest 目录下创建新的文件夹，文件夹名称为当前日期
    // 在创建之前，先确保不存在
    if( fsFn.existsSync(outPath) ) {
        log(error('目标路径已经存在，继续操作会有风险，请删除路径后再次执行：\n'+outPath));
        return false;
    }

    // 创建并复制
    if( fsFn.copySync(inPath, outPath+'/beopWeb') ) {
        log(error('复制文件失败！'));
        return false;
    } else {
        // 复制 ./src 下的文件到 outPath
        if( fsFn.copySync(rootDir+'/src/enter', outPath) ) {
            log(error('复制 src 下文件(夹)失败！'));
            return false;
        }
    }

    log(info('复制文件(夹)成功！'));
    return {
        out: outPath
    };
};

function formatDate(d) {
    var year     = d.getFullYear();
    var month    = d.getMonth();
    var dayMonth = d.getDate();

    month    = month < 9 ? '0'+(month+1) : month%12+1;
    dayMonth = dayMonth < 10 ? '0'+dayMonth : dayMonth;

    return [year, month, dayMonth].join('');
}
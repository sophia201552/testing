'use strict';

var commands = {
    move: require('./move'),
    optimize: require('./optimize'),
    publish: require('./publish'),
    clean: require('./clean'),
    auto: require('./auto')
};

module.exports = function (args) {
    var baseDir = this.baseDir;
    var rootDir = this.rootDir;
    var log = console.log;
    var info = this.log.info, warn = this.log.warn, error = this.log.error;
    var rs;
    var flow = 

    // 执行 move 命令
    rs = commands.move.call({
        baseDir: baseDir,
        rootDir: rootDir,
        log: {
            info: info,
            warn: warn,
            error: error
        }
    }, args);

    if(rs === false) return false;

    rs = ['optimize', 'clean', 'publish'].every( function (cmd) {
        var isSuccss;
        isSuccss = commands[cmd].call({
            baseDir: baseDir,
            rootDir: rootDir,
            log: {
                info: info,
                warn: warn,
                error: error
            }
        }, {_: [rs.out]} );

        if(!isSuccss) {
            log( error(cmd+' 命令执行失败！') );
            return false;
        }
        return true;
    } );

    if(!!rs) {
        log( info('一键部署成功！') );
        return true;
    }

    return false;
};
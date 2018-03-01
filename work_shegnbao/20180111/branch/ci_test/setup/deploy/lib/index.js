'use strict'

var commands = require('./console');
var args = require('minimist')(process.argv.slice(2));
var cwd = process.cwd();
var dirname = __dirname;
//////////////////////
// chalk DEFINITION //
//////////////////////
var chalk = require('chalk');
var info = function (msg) { return chalk.bgBlue('INFO')+' '+chalk.blue(msg); };
var warn = function (msg) { return chalk.bgYellow('WARN')+' '+chalk.yellow(msg); };
var error = function (msg) { return chalk.bgRed('ERROR')+' '+chalk.red(msg); };

// libraries
var pathFn = require('path');

// 更改控制台标题
process.title = 'Beop Auto Deploy Prograss';

exports = module.exports = function () {
    runCommand(args);
};

function runCommand(args) {
    var cmd = args._.shift();
    if(!cmd || !commands[cmd]) {
        console.log(error('没有找到这个命令！'));
        cmd = 'help';
    }

    return commands[cmd].call({
        // 当前工作的目录
        baseDir: cwd,
        // package 安装的根目录
        rootDir: pathFn.join(dirname, '../'),
        log: {
            info: info,
            warn: warn,
            error: error
        }
    }, args);
};
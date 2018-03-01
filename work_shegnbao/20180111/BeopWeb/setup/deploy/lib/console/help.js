'use strict';

var chalk = require('chalk');
var toString = Object.prototype.toString;
var class2type = (function () {
    var o = {};
    'Boolean Number String Function Array Date RegExp Object Error'.split(' ').forEach(function (row, i) {
        o['[object ' + row + ']'] = row.toLowerCase();
    });
    return o;
} ());

module.exports = function (args) {
    var cmd = args._.shift();
    var content;
    if(!cmd || !CONTENT[cmd.toUpperCase()]) {
        content = CONTENT.OVERVIEW;
    } else {
        content = CONTENT[cmd.toUpperCase()];
    }

    print(content);
};

function print(content) {
    var usage, blocks, remarks;
    var type;

    if(content.usage) {
        type = getType(content.usage);
        if(type === 'string') {
            usage = [content.usage];
        } else if(type === 'array') {
            usage = content.usage;
        }
    }

    if(content.blocks && getType(content.blocks) === 'array') {
        blocks = content.blocks;
    }

    if(content.remarks) {
        type = getType(content.remarks);
        if(type === 'string') {
            remarks = [content.remarks];
        } else if(type === 'array') {
            remarks = content.remarks;
        }
    }

    console.log('');
    if(usage) console.log(usage.join('\n')+'\n');
    if(blocks) {
        blocks.forEach(function (b) {
            printBlock(b);
        });
    }
    if(remarks) console.log(remarks.join('\n'))
};

function printBlock(block) {
    var maxNameLen = 0, str = '';
    var title, list;

    if(block.title) title = block.title;
    if(block.list && getType(block.list) === 'array') list = block.list;

    if(title) str = title + ':\n';

    if(list) {
        if(list.length > 1) {
            list = list.sort(function (a, b) {
                var nameA = a.name;
                var nameB = b.name;
                var lenA = nameA.length;
                var lenB = nameB.length;

                maxNameLen = Math.max(lenA, lenB, maxNameLen);

                if(nameA === nameB) return 0;
                return nameA > nameB;
            });
        } else maxNameLen = list[0].name.length;

        list.forEach(function (row, i) {
            str += [
                '  ', 
                chalk.bold(row.name),
                new Array(maxNameLen-row.name.length+3).join(' '),
                row.description || row.desc,
                '\n'
            ].join('');
        });
    }
    console.log(str);
};

function getType(obj) {
    return class2type[toString.call(obj)];
};

var CONTENT = {
    OVERVIEW: {
        usage: 'Usage: deploy [command]',
        blocks: [{
            title: 'Commands',
            list: [
                {name: 'move', desc: '复制临时项目文件夹到 BeopWebTest 目录中'},
                {name: 'optimize', desc: '压缩合并 js 文件'},
                {name: 'clean', desc: '清楚不需要的文件(s3db 解压的图片，压缩过程代码等)'},
                {name: 'publish', desc: '修改配置文件(__init__.py)为线上版的配置'},
                {name: 'auto', desc: '一键化部署，会依次执行 move->optimize->clean->publish 操作'},
                {name: 'help', desc: '显示帮助文档'}
            ]
        }],
        remarks: [
            '输入 deploy help [command]，查看 [command] 的详细帮助内容',
            '获取更多帮助信息，你可以查看本地文档: .../BeopWebTest/Deploy/帮助文档.html'
        ]
    },
    MOVE: {
        usage: 'Usage: deploy move <[temp folder]>',
        blocks: [{
            title: '<[temp folder]>',
            list: [
                {name: '', desc: '可选，代码临时目录的相对路径，缺省时将使用当前脚本运行的目录'}
            ]
        }]
    },
    OPTIMIZE: {
        usage: 'Usage: deploy optimize [source folder]',
        blocks: [{
            title: '[source folder]',
            list: [
                {name: '', desc: '必填，BeopWebTest 文件夹中的项目目录的相对路径，如："../20150617"'}
            ]
        }]
    },
    CLEAN: {
        usage: 'Usage: deploy clear [source folder]',
        blocks: [{
            title: '[source folder]',
            list: [
                {name: '', desc: '必填，BeopWebTest 文件夹中的项目目录的相对路径，如："../20150617"'}
            ]
        }]
    },
    PUBLISH: {
        usage: 'Usage: deploy publish [source folder]',
        blocks: [{
            title: '[source folder]',
            list: [
                {name: '', desc: '必填，BeopWebTest 文件夹中的项目目录的相对路径，如："../20150617"'}
            ]
        }]
    },
    AUTO: {
        usage: 'Usage: deploy auto [source folder]',
        blocks: [{
            title: '[source folder]',
            list: [
                {name: '', desc: '必填，BeopWebTest 文件夹中的项目目录的相对路径，如："../20150617"'}
            ]
        }]
    }
}
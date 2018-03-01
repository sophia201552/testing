// build.js
(function () {
    'use strict';
    // consts
    var JSON_FILE_PATH = './build.json';
    // external libraries
    var uglifyjs = require('uglify-js');
    var fse = require('fs-extra');
    // config file
    var options = require('./config.js');

    // variables
    var baseUrl = '../scripts/';
    var cacheSuffix = options.cacheSuffix || '';
    var compileDir = options.compileDir;
    var packages = options.packages;
    var formatPkgs = null;

    // uglifyjs options
    var options = {
        // outSourceMap: 'built.min.js.map',
        // sourceRoot: 'http://192.168.1.38/observer',
        warnings: false,
        fromString: false,
        mangle: false,
        output: null,
        compress: {}
    };
    var rs = null;

    // format packages
    function formatPackages(pkgs) {
        var scripts = {};
        for (var i = 0, len = pkgs.length; i < len; i++) {
            scripts[pkgs[i].name] = formatTruePath(pkgs[i].include);
        };
        return scripts;
    }

    // format url according to baseUrl
    function formatTruePath(modules) {
        var arr = []
        var match = null;
        for (var i = 0, len = modules.length; i < len; i++) {
            arr[i] = baseUrl + modules[i];
            // add .js if there is not one
            match = arr[i].match(/\.[^\.]+$/);
            if(!match || match[0] !== '.js') {
                arr[i] = arr[i]+'.js';
            }
        }
        return arr;
    }

    // append some code to each package code
    function formatSuffix(name) {
        return '';
        // return ';(function(){AL.onPackageLoadSuccess.call(AL, "'+name+'");}());'
    }

    function printArr(arr) {
        if(!arr) return;
        for (var i = 0, len = arr.length; i < len; i++) {
            console.log(arr[i]);
        }
    }

    formatPkgs = formatPackages(packages);

    console.log('=========== loading tree ===========');
    console.log(formatPkgs);

    for (var i in formatPkgs) {
        if (formatPkgs.hasOwnProperty(i)) {
            console.log('\n=========== minify package - '+i+' ===========');
            printArr(formatPkgs[i]);
            // optimize
            rs = uglifyjs.minify(formatPkgs[i], options);
            // save result to file
            fse.outputFileSync(compileDir+i+'.js', rs.code+formatSuffix(i), {
                encoding: 'utf8'
            }, function (err) {
                if(err) throw err;
            });
        }
    }
    
} ());

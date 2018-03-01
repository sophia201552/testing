#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const pkg = require('./package.json');
const tasks = require('./task');
const program = require('commander');

function checkFileExistsSync(filepath) {
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

program.version(pkg.version);

program
  .command('sv2:get_query')
  .description('获取模块的 query 数据')
  .option('-t, --target <target>', '目标模块的数据')
  .action(function(options) {
    try {
      if (!checkFileExistsSync(options.target)) {
        console.log('文件不存在：' + options.target);
        return;
      }
      let content = fs.readFileSync(options.target, {
        flag: 'r',
        encoding: 'utf8'
      });
      console.log(
        encodeURIComponent(
          JSON.stringify(tasks.get('sv2:get_query')(JSON.parse(content)))
        )
      );
    } catch (err) {
      console.log(err);
    }
  });

program
  .command('sv2:get_input')
  .description('获取模块的 moduleInputData 数据')
  .option('-s, --source <source>', '上级模块的数据')
  .option('-t, --target <target>', '目标模块的数据')
  .action(function(options) {
    try {
      if (!checkFileExistsSync(options.source)) {
        console.log('文件不存在：' + options.source);
        return;
      }
      let sourceContent = fs.readFileSync(options.source, {
        flag: 'r',
        encoding: 'utf8'
      });
      if (!checkFileExistsSync(options.target)) {
        console.log('文件不存在：' + options.target);
        return;
      }
      let targetContent = fs.readFileSync(options.target, {
        flag: 'r',
        encoding: 'utf8'
      });
      console.log(
        encodeURIComponent(
          JSON.stringify(
            tasks.get('sv2:get_input')(
              JSON.parse(sourceContent),
              JSON.parse(targetContent)
            )
          )
        )
      );
    } catch (err) {
      console.log(err);
    }
  });

program
  .command('sv2:get_output')
  .description('获取模块的 moduleOutputData 数据')
  .option('-t, --target <target>', '目标模块的数据')
  .action(function(options) {
    try {
      if (!checkFileExistsSync(options.target)) {
        console.log('文件不存在：' + options.target);
        return;
      }
      let content = fs.readFileSync(options.target, {
        flag: 'r',
        encoding: 'utf8'
      });
      console.log(
        encodeURIComponent(
          JSON.stringify(tasks.get('sv2:get_output')(JSON.parse(content)))
        )
      );
    } catch (err) {
      console.log(err);
    }
  });

program.parse(process.argv);

if (!program.args.length) program.help();

process.exit();

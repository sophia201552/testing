/** 老版诊断 excel+fll 文件转换成新版数据结构 */
const fs = require('fs');
const fsExtra = require('fs-extra');
const util = require('util');
const path = require('path');
const XLSX = require('xlsx');

const { getObjectId, array2map, formatWorkbook } = require('./util');
const { fuzzyRuleParser } = require('../../scripts/common/fuzzyRuleParser.js');
const enums = require('../../scripts/common/enum.js');
const { ObjectId } = require('./comm.js');

const UNDEFINED = undefined;

const srcDir = __dirname + '/src';
const distDir = __dirname + '/rules';

const strategiesAll = [];
const templatesAll = [];
const modulesAll = [];

const INT32_MAX_VALUE = Math.pow(2, 31) - 1;

// 区域语言设置
let lang = 'zh';

/////////////////// Log ////////////////////
const logFile = fs.createWriteStream(__dirname + '/debug_rules.log', {flags : 'w'});
const log = msg => {
    logFile.write(util.format(msg) + '\n');
    console.info(util.format(msg));
};

//////////////// 功能函数 /////////////////
const getTagContent = tagpath => {
    let tagContent = fsExtra.readJsonSync(tagpath);
    return tagContent;
}

const getFllContent = fllpath => {
    let fllContent = fsExtra.readFileSync(fllpath, 'utf8');
    return smoothContent(fllContent);
}

const smoothContent = content => {
    // 空格格式转换成 *NIX 格式
    content = content.replace(/\r\n/g, '\n');
    // 去除注释
    content = content.replace(/#.*?\n/g, '\n');
    // 去除空白行
    content = content.replace(/\n\s*?\n/g, '\n');
    // 修改一些怪异的格式
    content = content.replace(/\n\s*InputVariable/g, '\nInputVariable');
    content = content.replace(/\n\s*OutputVariable/g, '\nOutputVariable');
    content = content.replace(/\n\s*RuleBlock/g, '\nRuleBlock');
    content = content.replace(/\n\s*rule/g, '\n  rule');
    content = content.replace(/\nterm/g, '\n  term');

    return content;
}

const correctPointRecord = (name, record) => {
    if (isNaN(record.Type)) {
        log(`Warning Input Field "type": ${name} 的 "type" 字段对应 Excel 中值为 "${record.Type}"，无法转换成一个合法的数字，将使用 0 作为缺省值`);
        record.Type = 0;
    }
    record.Type = parseInt(record.Type);

    return record;
}

const correctFaultRecord = (name, record) => {
    if (isNaN(record.FaultType)) {
        log(`Warning Output Field "faultType": ${name} 的 "faultType" 字段对应 Excel 中值为 "${record.FaultType}"，无法转换成一个合法的数字，将使用 0 作为缺省值`);
        record.FaultType = 0;
    }
    record.FaultType = parseInt(record.FaultType);

    if (isNaN(record.Grade)) {
        log(`Warning Output Field "grade": ${name} 的 "grade" 字段对应 Excel 中值为 "${record.Grade}"，无法转换成一个合法的数字，将使用 0 作为缺省值`);
        record.Grade = 0;
    }
    record.Grade = parseInt(record.Grade);

    return record;
}

const getI18nName = (name, needSubfix) => {
    return name + (
        lang === 'zh' ? 'Ch' : (
            needSubfix ? 'En' : ''
        )
    );
}

/**
 * 创建一个策略
 */
const createStrategy = name => {
    return {
        _id: getObjectId(),
        nodeId: '',
        projId: 1,
        name: name,
        desc: '',
        userId: 262,
        lastTime: '2017-04-25 17:37:25',
        keywords: [],
        type: 0,
        trigger: [],
        lastRuntime: '2017-04-25 17:37:25',
        status: 0,
        isTransformedFromFiles: 1,
        option: {
            config: {
                timeBetweenFDDCycles: 300,
                timeBetweenDataCycles: 300,
                EnableSensorCheck: 1,
                RunCommand: 1,
                Language: 1,
                WarningRatio: 0.6,
                RelativeId: 0,
                SensorSequenceNum: 12,
                DeadSequenceNum: 60,
                server_tz: 'Asia/Shanghai',
                proj_tz: 'Asia/Shanghai',
                FaultCheckNum: 6
            }
        },
        preTasks: [],
        value: []
    };
};

createTemplate = name => {
    return { 
        "_id" : null, 
        "group" : getObjectId("590087ef8746ce7e384e21bd"),
        "name" : name, 
        "desc" : "", 
        "userId" : 262, 
        "lastTime" : "2017-04-26 19:00:00", 
        "isGroup" : 0,
        "isTransformedFromFiles": 1
    }
};

const createModule = (xlspath, fllpath, tagpath) => {
    let sheetsMap = formatWorkbook(xlspath);
    let fllContent = getFllContent(fllpath);
    let sModule = fuzzyRuleParser.parse(fllContent);

    let faultInfoMap = array2map(sheetsMap['FaultInformation'], 'Name');
    let pointInfoMap = array2map(sheetsMap['PointInformation'], 'Name');
    let sysFormulaMap = array2map(sheetsMap['SystemFormula'], 'Name');
    let sysChartMap = array2map(sheetsMap['SysChart'], 'FaultName');

    // 填充 module
    sModule._id = getObjectId();
    sModule.strategyId = null;
    sModule.type = enums.moduleTypes.FUZZY_RULE;
    sModule.desc = `${sModule.name} - 来自算法组诊断文件导入`;
    sModule.isTransformedFromFiles = 1;
    // 填充 module.option
    sModule.option.timeRange = null;
    // 填充 module.option.input
    sModule.option.input.forEach(ipt => {
        ipt._id = getObjectId();
        ipt.refModuleId = null;
        ipt.refOutputId = null;
        ipt.desc = ipt.name;
        ipt.type = enums.moduleInputOutputTypes.INPUT_DIAGNOSIS_FUZZYRULE;
        ipt.default = null;

        // fill input.option
        let option = ipt.option = ipt.option || {};
        let foreignPointRecord = pointInfoMap[ipt.name];

        if (!foreignPointRecord) {
            log(`Warning Input: ${ipt.name} 未在 Excel 中找到与之对应的记录，将跳过此项`);
            return;
        }

        log(`Process Input: ${ipt.name}`);

        // 对一些非法数据尝试进行纠正
        correctPointRecord(ipt.name, foreignPointRecord);

        option.status = 1;
        option.alias = foreignPointRecord.FullName;
        option.unit = foreignPointRecord.Unit || '';
        option.check = foreignPointRecord.Type === 1 ? 1 : 0;
        option.precision = foreignPointRecord.Precision || 999;
        option.type = foreignPointRecord.Type;

        if (foreignPointRecord.Type === enums.fuzzyRuleInputOutputTypes.FORMULA) {
            let foreignFormulaRecord = sysFormulaMap[ipt.name];
            if (!foreignFormulaRecord) {
                log(`Error Input: ${ipt.name} Excel 中缺少公式配置`);
            } else {
                // fill formula
                option['formulaConfig'] = {
                    formula: foreignFormulaRecord.Equation,
                    parameters: foreignFormulaRecord.Point.split(',').map(row => row.trim())
                }
            }
        }
    });
    // 填充 module.option.output
    sModule.option.output.forEach(output => {
        output._id = getObjectId();
        output.desc = output.name;
        output.type = enums.moduleInputOutputTypes.OUTPUT_DIAGNOSIS;
        
        // fill output.option
        let option = output.option = output.option || {};
        let foreignFaultRecord = faultInfoMap[output.name];

        if (!foreignFaultRecord) {
            log(`Warning Output: ${output.name} 未在 Excel 中找到与之对应的记录，将跳过此项`);
            return;
        }
        log(`Process Output: ${output.name}`);

        // 对一些非法数据尝试进行纠正
        correctFaultRecord(output.name, foreignFaultRecord);

        option.status = 1;
        option.fullName = foreignFaultRecord[getI18nName('FullName')];
        option.faultType = foreignFaultRecord.FaultType;
        option.faultTypeGroup = foreignFaultRecord.Category.split(',').map(row => row.trim());
        option.grade = foreignFaultRecord.Grade;
        option.group = 0; // TODO
        option.consequence = 0; // TODO
        option.targetGroup = '77'; // TODO
        option.targetExecutor = 262; // TODO
        option.runMode = foreignFaultRecord.Runmode;
        option.runTimeDay = 12; // TODO
        option.runTimeWeek = 60; // TODO
        option.runTimeMonth = 240; // TODO
        option.runTimeYear = 2400; // TODO
        option.unit = 'kWh'; // TODO
        option.energyConfig = null; // TODO
        option.desc = foreignFaultRecord[getI18nName('Detail')];
        option.advise = foreignFaultRecord[getI18nName('Suggestion')];

        let foreignChartRecord = sysChartMap[foreignFaultRecord.Name];
        if (!foreignChartRecord) {
            log(`Error Output: ${output.name} Excel 中缺少图表配置`);
        } else {
            option.title = foreignChartRecord[getI18nName('Title')];
            option.chart = (function () {
                let points = foreignChartRecord.Points.toString().split(',');
                let axis = foreignChartRecord.Axis.toString().split(',');
                let pointNames = foreignChartRecord[getI18nName('PointsName', true)].toString().split(',');
                let axisNames = foreignChartRecord[getI18nName('AxisName')].toString().split(',');

                return points.map((row, i) => {
                    return {
                        'name': row,
                        'type': parseInt(axis[i])
                    }
                })
            } ());
        }
    });

    // 填充 module.option.content
    log('Process Content');
    let content = sModule.option.content;
    content.projId = 512; // TODO
    content.rule = fllContent;

    if (tagpath) {
        log('Process Tag');
        let tagContent = getTagContent(tagpath);
        log('Module Tags: ' + JSON.stringify(tagContent.tags))
        sModule.option.tags = tagContent.tags;
        let iptTagMap = {};
        tagContent.input.forEach(row => {
            iptTagMap[row.name] = row.tags;
        });
        sModule.option.input.forEach(row => {
            if (!!iptTagMap[row.name]) {
                // validator tag
                let hasError = false;
                iptTagMap[row.name].some(
                    tag => {
                        if (!tag) {
                            log(`Error Input ${row.name}: 配置的 Tags 中包含有非法格式，将会跳过此项`);
                            return hasError = true;
                        }
                    }
                );
                if (!hasError) {
                    log(`Input ${row.name} Tags: ${JSON.stringify(iptTagMap[row.name])}`);
                    row.option.tags = iptTagMap[row.name];
                }
            }
        });
    }

    log('Module create complete')
    return sModule;
}

const isObjectId = val => {
    return typeof val === 'string' && val.indexOf('ObjectId(') === 0;
}

const isInt = val => {
    return typeof val === 'number' && parseInt(val) === val;
}

const jsonToBson = (data, isInRecursive) => {
    if (!data) {
        return JSON.stringify(data);
    }
    if (Array.isArray(data)) {
        data.forEach((row, i, arr) => {
            if (isInt(row)) {
                arr[i] = row > INT32_MAX_VALUE ? `NumberLong(${row})` : `NumberInt(${row})`;
            } else if (typeof row === 'object') {
                jsonToBson(row, true);
            }
        });
    } else if (typeof data === 'object') {
        Object.keys(data).forEach(
            key => {
                let row = data[key];
                if (isInt(row)) {
                    data[key] = row > INT32_MAX_VALUE ? `NumberLong(${row})` : `NumberInt(${row})`;
                } else if (typeof row === 'object') {
                    jsonToBson(row, true);
                }
            }
        );
    }
    if (!isInRecursive) {
        return JSON.stringify(data, ' ', 2).replace(/"((?:ObjectId|NumberLong|NumberInt).*?)"/g, '$1');
    }
};

/////////////////// Tasks ///////////////////
let tasks = {};

tasks['clean-rules'] = () => {
    fsExtra.removeSync(distDir);
}

tasks['generate-rules'] = () => {
    run('clean-rules');
    if (!fsExtra.existsSync(srcDir)) {
        log('未发现诊断文件');
        return;
    }
    let files = fsExtra.readdirSync(srcDir);
    let file;
    while (file = files.shift()) {
        let extname = path.extname(file);
        let basename = path.basename(file, extname);
        let xlsname = basename + '.xls';
        let fllname = basename + '.fll';
        let tagname = basename + '.json';
        let xlspath = srcDir + '/' + xlsname;
        let fllpath = srcDir + '/' + fllname;
        let tagpath;
        
        // 文件检查
        if (['.xls', '.fll', '.json'].indexOf(extname) === -1) {
            log(`Warning: 发现非 .xls, .fll 或 .json 文件：${file}`);
            continue;
        }
        if (file !== xlsname && files.indexOf(xlsname) === -1) {
            log(`缺少文件：${xlspath}`);
            continue;
        } else if (file !== xlsname) {
            files.splice(files.indexOf(xlsname), 1);
        }

        if (file !== fllname && files.indexOf(fllname) === -1) {
            log(`缺少文件：${fllpath}`);
            continue;
        } else if (file !== fllname) {
            files.splice(files.indexOf(fllname), 1);
        }

        if (file === tagname || files.indexOf(tagname) > -1) {
            if (file !== tagname) {
                files.splice(files.indexOf(tagname), 1);
            }
            tagpath = srcDir + '/' + tagname;
        }
        
        let distPath = distDir + '/' + basename;
        fsExtra.ensureDirSync(distPath);

        // 解析
        log(`\n============= 解析策略：${basename} =============`);
        let strategy = createStrategy(basename);
        let sTemplate = createTemplate(basename);
        let sModule = createModule(xlspath, fllpath, tagpath);
        sTemplate._id = strategy._id;
        sModule.strategyId = strategy._id;

        // 导出至文件
        fsExtra.outputFileSync(`${distPath}/strategy.json`, jsonToBson(strategy));
        fsExtra.outputFileSync(`${distPath}/template.json`, jsonToBson(sTemplate));
        fsExtra.outputFileSync(`${distPath}/module.json`, jsonToBson(sModule));

        strategiesAll.push(strategy);
        templatesAll.push(sTemplate);
        modulesAll.push(sModule);
    }

    // 导出汇总 json 文件
    fsExtra.outputFileSync(`${distDir}/strategies.all.json`, jsonToBson(strategiesAll));
    fsExtra.outputFileSync(`${distDir}/templates.all.json`, jsonToBson(templatesAll));
    fsExtra.outputFileSync(`${distDir}/modules.all.json`, jsonToBson(modulesAll));
}

tasks['generate-rules-zh'] = () => {
    lang = 'zh';
    return tasks['generate-rules']();
}

tasks['generate-rules-en'] = () => {
    lang = 'en';
    return tasks['generate-rules']();
}

const run = (task) => {
    tasks[task]();
}

console.time('run');
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'generate-rules-zh' /* default */);
console.timeEnd('run');
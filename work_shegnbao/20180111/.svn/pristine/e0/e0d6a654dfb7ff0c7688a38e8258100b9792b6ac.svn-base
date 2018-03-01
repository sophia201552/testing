/** 从老版诊断 excel 文件中提取出 fault 信息 */
const fs = require('fs');
const fsExtra = require('fs-extra');
const util = require('util');
const path = require('path');

const { array2map, formatWorkbook } = require('./util');
const UNDEFINED = undefined;

const srcDir = __dirname + '/src';
const distDir = __dirname + '/faults';

const TABLE_NAME_EN = 'diagnosis_fault_0808';
const TABLE_NAME_ZH = 'diagnosis_fault_0808_zh';

let lastInsertedId = 1;
let globalFaultMap = {};

const generateFault = function (data, lang='en') {
    let isEn = lang === 'en';
    return {
        "id": lastInsertedId,
        "name": isEn ? data.FullName : data.FullNameCh,
        "description": isEn ? `${data.Detail}. ` : `${data.DetailCh}。`,
        "suggestion": isEn ? `${data.Suggestion || ''}.` : `${data.SuggestionCh || ''}。`,
        "grade": data.Grade,
        "faultType": data.FaultType,
        "faultGroup": isEn ? data.FaultGroup || 'Other' : data.FaultGroupCh || '其他',
        "runMode": data.Runmode,
        "consequence": isEn ? data.Consequence || 'Ohter' : data.ConsequenceCh || '其他',
        "runDay": 12,
        "runWeek": 60,
        "runMonth": 240,
        "runYear": 2400,
        "chartTitle": isEn ? data.Title : data.TitleCh,
        "lastModifyUser": 1,
        "lastModifyTime": "2017-06-20 00:00:00",
        "maintainable": 0,
        "className": data.ClassName,
        'isPublic': 1,
        "engineRuleName": data.EngineRuleName
    }
}

const obj2Sql = (obj, lang='en') => {
    let isEn = lang === 'en';
    return `\
INSERT INTO ${isEn ? TABLE_NAME_EN : TABLE_NAME_ZH} VALUES ('${obj.id}', \
'${obj.name.replace(/'/g, '\\\'')}', '${obj.description.replace(/'/g, '\\\'')}', \
'${obj.suggestion.replace(/'/g, '\\\'')}', '${obj.grade}', '${obj.faultType}', \
'${obj.faultGroup}', '${obj.runMode}', '${obj.consequence}', '${obj.chartTitle}', \
'${obj.lastModifyUser}', '${obj.lastModifyTime}', ${obj.maintainable}, '${obj.className}', '${obj.isPublic}', '${obj.engineRuleName}');`
}

const generateDeleteSql = (lang='en') => {
    let isEn = lang === 'en';
    return `TRUNCATE ${isEn ? TABLE_NAME_EN : TABLE_NAME_ZH};`;
}

const zhFaults = [];
const enFaults = [];

/////////////////// Log ////////////////////
const logFile = fs.createWriteStream(__dirname + '/debug_faults.log', {flags : 'w'});
const log = msg => {
    logFile.write(util.format(msg) + '\n');
    console.info(util.format(msg));
};

//////////////// 主要逻辑 /////////////////
const createFaults = (xlspath) => {
    let sheetsMap = formatWorkbook(xlspath);

    let engineRuleList  = sheetsMap['EngineRule'];
    let faultInfoList = sheetsMap['FaultInformation'];
    let sysChartMap = array2map(sheetsMap['SysChart'], 'FaultName');

    let engineRuleName = engineRuleList[0]['Name'];
    let className = engineRuleList[0]['NameEn'];
    
    faultInfoList.forEach(
        (row, i) => {
            let chartInfo;
            if (!row['Name']) {
                log(`Warning Fault: FaultInformation Sheet 第${i+2}行 Fault 缺少 Name 字段，chartTitle 字段将会置空`);
            } else {
                chartInfo = sysChartMap[row['Name']];
                if (!chartInfo) {
                    log(`Warning Fault: ${row['Name']} 未在 SysChart Sheet 中找到，chartTitle 字段将会置空`)
                } else {
                    let unique = row['Name'] + row['FullName'] + row['Detail'] + row['Suggestion'] + className;
                    if (globalFaultMap.hasOwnProperty(unique)) {
                        log(`Info Fault: ${row['Name']} 重复，将会跳过此项`);
                        return;
                    } else {
                        log(`Process Fault: ${row['Name']} - ${row['FullNameCh']}`);
                        globalFaultMap[unique] = 1;
                    }
                }
            }
            
            if (!chartInfo) {
                chartInfo = {
                    'Title': '',
                    'TitleCh': ''
                };
            }
            row = Object.assign({}, row, {
                'Title': chartInfo['Title'],
                'TitleCh': chartInfo['TitleCh'],
                'ClassName': className,
                'EngineRuleName': engineRuleName
            });
            
            zhFaults.push(generateFault(row, 'zh'));
            enFaults.push(generateFault(row));
            lastInsertedId += 1;
        }
    );
}

/////////////////// Tasks ///////////////////
let tasks = {};

tasks['clean-faults'] = () => {
    fsExtra.removeSync(distDir);
}

tasks['generate-faults'] = () => {
    run('clean-faults');
    if (!fsExtra.existsSync(srcDir)) {
        log('未发现原始数据文件');
        return;
    }
    let files = fsExtra.readdirSync(srcDir);
    let file;
    while (file = files.shift()) {
        let extname = path.extname(file);
        let basename = path.basename(file, extname);
        let xlsname = basename + '.xls';
        let xlspath = srcDir + '/' + xlsname;
        
        // 文件检查
        if ('.xls' !== extname) {
            continue;
        }
        
        // 解析
        log(`\n============= 解析文件：${basename} =============`);
        createFaults(xlspath);
    }
    fsExtra.ensureDirSync(distDir);
    // 导出至文件
    //json
    log(`\n导出中文 json 数据至文件 ${distDir}/faults_zh.json`);
    fsExtra.outputFileSync(`${distDir}/faults_zh.json`, JSON.stringify(zhFaults, ' ', 2));
    log(`导出英文 json 数据至文件 ${distDir}/faults_en.json`);
    fsExtra.outputFileSync(`${distDir}/faults_en.json`, JSON.stringify(enFaults, ' ', 2));
    // sql
    log(`导出中文 sql 语句至文件 ${distDir}/faults_zh.sql`);
    fsExtra.outputFileSync(`${distDir}/faults_zh.sql`, 
        [generateDeleteSql('zh')].concat(
            zhFaults.map(row => obj2Sql(row, 'zh'))
        ).join('\n')
    );
    log(`导出英文 sql 语句至文件 ${distDir}/faults_en.sql\n`);
    fsExtra.outputFileSync(`${distDir}/faults_en.sql`, 
        [generateDeleteSql()].concat(
            enFaults.map(row => obj2Sql(row))
        ).join('\n')
    );
}

const run = (task) => {
    tasks[task]();
}

console.time('run');
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'generate-faults' /* default */);
console.timeEnd('run');
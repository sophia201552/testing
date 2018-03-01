const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const {MongoClient, ObjectId} = require('mongodb');

const version = 0;
let projectArr = undefined;
let projectMap = {};
const mapPath = './maps/map.json';
const oldMapPath = './maps/oldmap.json';
const extname = '.html';
let FILEPATH = path.resolve("./reports");
const isNeedDelete = true;
const creatorArr = [1743,17432,17433];
const DB_CONN_STR = 'mongodb://beopweb:RNB.beop-2013@120.55.113.116:27018/beopdata?connectTimeoutMS=30000&authMechanism=SCRAM-SHA-1';
// report_path = 'projectReports/reports/' + project_code + '/' + report_folder + '/' + report_name + '.html'
let oldMap;
const Deferred = function(fn = ()=>{}){
    let obj = {status:0};
    let p = new Promise((resolve, reject)=>{
        fn(resolve, reject);
        obj.resolve = (...arg)=>{
            p.status = 1;
            resolve(...arg);
        };
        obj.reject = (...arg)=>{
            p.status = 2;
            reject(...arg);
        };
    })
    return Object.assign(p, obj)
}
let dataIdMap = {};
let pathMap = {};
let loopFindPromiseArr = [];
let loopFindPromise = Deferred();

let loopFindPromiseCheck = ()=>{
    let isOK = true;
    let temp = loopFindPromiseArr.map(v=>v.status);
    if(temp.indexOf(0)>-1 || temp.indexOf(2)>-1){
        isOK = false;
    }
    if(isOK){
        loopFindPromise.resolve();
    }
}
const loopFind = (filePath) => {
    let promise = Deferred();
    promise.then(()=>{loopFindPromiseCheck()});
    loopFindPromiseArr.push(promise);
    fs.readdir(filePath, (err, fils) => {
        if (err) throw err;
        let count = fils.length;
        fils.forEach((fileName, index) => {
            let promise2 = Deferred();
            promise2.then(()=>{loopFindPromiseCheck()});
            loopFindPromiseArr.push(promise2);
            let pathNow = path.join(filePath,fileName);
            fs.stat(pathNow, (err, stats) => {
                if (err) throw err;
                if(stats.isFile() && path.extname(pathNow) == extname){//文件
                    if(pathMap[filePath]!=undefined){
                        pathMap[filePath].push(pathNow);
                    }else{
                        pathMap[filePath] = [pathNow];
                    }
                    //todo 可以在此异步
                    
                }else if(stats.isDirectory()){//文件夹
                    loopFind(pathNow);
                }
                promise2.resolve();
            });
        });
        promise.resolve();
    });
}
console.log('正在加载oldMap···');
fs.readFile(oldMapPath, 'utf-8', (err, data) => {
    if (err) throw err;
    console.log('oldMap加载完毕');
    oldMap = JSON.parse(data);
    console.log('正在检索文件···');
    loopFind(FILEPATH);
});


let handleFilePromiseArr = [];

const dateFctory = (date)=>{
    let tempArr = date.split('-'),
        len = tempArr.length;
    let padStart = (num)=>{
        if(num<10){
            return '0'+num;
        }
        return num;
    }
    if(len==1){
        return {
            date: tempArr[0]+'-01-01',
            type: 'year'
        };
    }
    if(len==2){
        return {
            date: tempArr[0]+'-'+tempArr[1]+'-01',
            type: 'month'
        };
    }
    if(len==3){
        if(tempArr[2]=='w'){
            return {
                date:((year, week, day)=>{
                    let date1 = new Date(year,0,1), 
                        dayMS = 24*60*60*1000,
                        firstDay = (7-date1.getDay())*dayMS,
                        weekMS = (week-2)*7*dayMS, 
                        result = date1.getTime()+firstDay+weekMS+day*dayMS;
                    let date = new Date(result);
                
                    return date.getFullYear()+'-'+padStart(date.getMonth()+1)+'-'+padStart(date.getDate()); 
                })(tempArr[0], tempArr[1], 1),
                type: 'week'
            };
        }else{
            return {
                date:date,
                type: 'day'
            };
        }
    }
}
const dataFactory = (data, filePath)=>{
    let isFailed = false;
    if(data!=''){
        let $ = cheerio.load(data, {decodeEntities: false});
        data = Array.from($('.page-header')).map(v=>{
            let $v = $(v);
            let isSummary = $v.html()=='Diagnosis Summary' || $v.html()=='诊断汇总';
            return {
                name: $v.html(),
                type: isSummary?'summary':'chapter',
                units: Array.from($('.report-unit', $v.parent())).map(v2=>{
                    let $v2 = $(v2);
                    return {
                        unitName: $('.well.well-sm h3',$v2).html(),
                        subUnits: Array.from($('.summary', $v2)).map(v3=>{
                            let $v3 = $(v3);
                            if($('.canvas-container', $v2).length>0){
                                let after = undefined;
                                try{
                                    // .replace(/''/g,'\'')
                                    after = JSON.parse($('.chart-param', $v2).html().replace(/\\'" "\\'/g,'').replace(/\\'"/g,'').replace(/"\\'/g,'').replace(/'"/g,'\'').replace(/"'/g,'\'').replace(/"/g,'`').replace(/'/g,'"').replace(/\\n/g,'').replace(/\n/g,'').replace(/\\t/g,'    ').replace(/`/g,'\'').replace(/\\/g,''));
                                }catch(error){
                                    isFailed = true;
                                }finally{
                                    return after;
                                }
                                
                            }else{
                                return {
                                    summary: $v3.html(),
                                    Options: {
                                        x:[],
                                        y:[]
                                    },
                                    chartItems:{
                                        x:[],
                                        y:[]
                                    },
                                    commonChartOptions:{},
                                    title:'',
                                    type:'line',
                                    unitName:'',
                                    yMin:[],
                                    yMax:[]
                                }
                            }
                        })
                    }
                })
            }
        })
    }
    let pathArr = filePath.replace(extname,'').split('\\'),
        pathArrLen = pathArr.length,
        date = pathArr[pathArrLen-1],
        name = pathArr[pathArrLen-3] + pathArr[pathArrLen-2];
    let dateObj = dateFctory(date),
        dataId = ObjectId();
    dataIdMap[pathArr[pathArrLen-3]] = dataIdMap[pathArr[pathArrLen-3]] || {};
    dataIdMap[pathArr[pathArrLen-3]][pathArr[pathArrLen-2]] = dataIdMap[pathArr[pathArrLen-3]][pathArr[pathArrLen-2]] || {
        'year':{},
        'month':{},
        'week':{},
        'day':{}
    };
    let tempObj = dataIdMap[pathArr[pathArrLen-3]][pathArr[pathArrLen-2]][dateObj.type],
        oldDates = Object.keys(tempObj);
    if(oldDates.length>0){
        dataId = ObjectId(tempObj[oldDates[0]]);
    }
    if(oldMap && oldMap[pathArr[pathArrLen-3]] && oldMap[pathArr[pathArrLen-3]][pathArr[pathArrLen-2]] && oldMap[pathArr[pathArrLen-3]][pathArr[pathArrLen-2]][dateObj.type] && oldMap[pathArr[pathArrLen-3]][pathArr[pathArrLen-2]][dateObj.type][dateObj.date]){
        dataId = ObjectId(oldMap[pathArr[pathArrLen-3]][pathArr[pathArrLen-2]][dateObj.type][dateObj.date].replace('  failed',''));
    }
    tempObj[dateObj.date]=isFailed?dataId.toString()+'  failed':dataId.toString();
    data = {
        dataId: dataId,
        content: JSON.stringify(data),
        type: 'DiagnosisReport',
        createTime: '2017-09-07',
        date: dateObj.date,
        name: name,
        creator: creatorArr[version],
    }
    
    return data;
    // return JSON.stringify(data)+',\n';
}
const readFile = (filePath, afterRead) => {
    let promise = Deferred();
    handleFilePromiseArr.push(promise);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        let match = data.match(/<link rel=\"stylesheet\" href=\"\/static\/projectReports\/report.css\"\/>([\s\S]*)<!--右边导航-->/);
        if(match[1]){
            data = match[1].trim();
        }else{
            data = '';
        }
        data = dataFactory(data, filePath);
        afterRead(data,()=>{
            promise.resolve();
        });
    });
}

var loop = (save, finishedFn)=>{
    let projectName;
    if(!projectArr){
        projectArr = Array.from(new Set(Object.keys(pathMap).map(v=>v.replace(FILEPATH,'').split('\\')[1])));
        projectArr.forEach(pName=>{
            let projectChildren = Object.keys(pathMap).filter(v=>v.replace(FILEPATH,'').split('\\')[1]==pName);
            projectMap[pName] = [];
            projectChildren.forEach(c=>{
                projectMap[pName] = projectMap[pName].concat(pathMap[c]);
            });
        });
        projectName = projectArr[0];
        FILEPATH = path.resolve("./reports/"+projectName);
    }else{
        let ex = FILEPATH.split('\\');
        projectName = ex[ex.length-1];
        let index = projectArr.findIndex(v=>v==projectName);
        if(index==projectArr.length-1){
            console.log('全部项目构建完毕');
            finishedFn();
            return 
        }
        projectName = projectArr[index+1];
        FILEPATH = path.resolve("./reports/"+projectName);
    }
    
    console.log('正在构建'+projectName+'···');
    let oneProjectList = projectMap[projectName];
    oneProjectList.forEach(fileName=>{
        console.log('正在读取'+fileName+'文件···');
        readFile(fileName, (data, afterSave)=>{
            console.log('读取'+fileName+'文件成功');
            //写入数据库
            save(data,()=>{
                //写入数据库成功
                afterSave();
            });
        });
    });
    
    Promise.all(handleFilePromiseArr).then(()=>{
        console.log('构建'+projectName+'成功');
        loop(save, finishedFn);
    });
    
}
loopFindPromise.then(()=>{
    console.log('文件检索完成');
    console.log('开始连接数据库···');
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if (err) throw err;
        console.log('数据库已连接');
        let collection = db.collection('Fac_ReportData');
        let realFn = ()=>{
            loop((data, callback)=>{
                collection.insert(data, (err, rs)=>{
                    if (err) throw err;
                    callback();
                });
            },()=>{
                db.close();
                console.log('数据库已关闭');
                console.log('正在生成map文件···');
                fs.appendFile(mapPath, JSON.stringify(dataIdMap,null,4), (err) => {
                    if (err) throw err;
                    console.log('生成'+mapPath+'文件成功');
                });
            });
        };
        if(isNeedDelete){
            console.log('正在删除导入数据···');
            collection.remove({creator:creatorArr[version]},(error, rs)=>{
                if(err) throw err;
                console.log('成功删除'+rs.result.n+'条数据');
                console.log('正在删除'+mapPath+'文件···');
                fs.unlink(mapPath,(err)=>{
                    console.log(mapPath+'文件删除成功');
                    realFn();
                });
            });
        }else{
            realFn();
        }
        
    });
});


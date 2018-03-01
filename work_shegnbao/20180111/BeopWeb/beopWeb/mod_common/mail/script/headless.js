const chromeLauncher = require('chrome-launcher');
const chromeRemoteInterface = require('chrome-remote-interface');
const fs = require('fs');
var exec = require('child_process').exec
var arguments = process.argv.splice(2);
var isDownload=0;
var killArr=[]
function searchKillProcess(){
    var cmdStr=`netstat -ano|findstr "9222"` 
    var killArr=[]
    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
            // console.log('get chrome api error:'+stderr);
        } else {
            var stdoutNew=stdout.toString().split(' ').filter(item=>{
                return item!=''
            })
            // console.log(stdoutNew)
            for(var i=0;i<stdoutNew.length;i++){
                if(stdoutNew[i]=='TCP'){
                    if(stdoutNew[i+1].split(':')[1]=='9222'){
                        killArr.push(stdoutNew[i+4].split('\r\n')[0])
                    }
                }
            }
            killProcess(killArr);
           
        }
    });
}

function killProcess(killArr){
    killArr.forEach(item=>{
        var cmdStrNew=`tskill ${item}`
        exec(cmdStrNew, function(err,stdout,stderr){
            if(err) {
                // console.log('error kill chrome'+stderr);
            } else {
            //    console.log(stdout)
            }
        });
    })
}
searchKillProcess();
const prepareAPI = (config = {}) => {
    const {host = 'localhost', port = 9222, autoSelectChrome = false, headless = true} = config;
    const wrapperEntry = chromeLauncher.launch({
        host,
        port,
        chromeFlags: [
            '--disable-gpu',
           '--headless' 
        ]
    }).then(chromeInstance => {
        const remoteInterface = chromeRemoteInterface(config).then(chromeAPI => chromeAPI).catch(err => {
            throw err;
        });
        return Promise.all([chromeInstance, remoteInterface])
    }).catch(err => {
        throw err
    });

    return wrapperEntry
};



const buttonClick = function () {
    this.click();
};

const setInputValue = () => {
    var input = document.getElementById('loginUserName');
    input.value = 'beopcloud@126.com';
    
};
const setInputValue1 = () => {
    var input = document.getElementById('loginUserPass');
    input.value = 'beop99';
};


prepareAPI({
    // headless: false  //加上这行代码可以查看浏览器的变化
}).then(( [chromeInstance, remoteInterface]) => {
    const {Runtime, DOM, Page, Network,Emulation,Browser} = remoteInterface;
    let framePointer;
    Promise.all([Page.enable(), Network.enable(), DOM.enable()]).then(() => {
        var rountPage=0;
        // outTimeKill(chromeInstance,remoteInterface)//超时退出
        var killTime=setInterval(()=>{
            if(!isDownload){
                console.log('get report time out')
                chromeInstance.kill();
                searchKillProcess();
            }
            clearInterval(killTime);
        },300000)
        const viewport = [1920, 1080];
        var device = {
            width: viewport[0],
            height: viewport[1],
            deviceScaleFactor: 0,
            mobile: false,
            fitWindow: false
        };
        Emulation.setDeviceMetricsOverride(device);
        Page.loadEventFired(() => {
            DOM.getDocument().then(({root}) => {
                DOM.querySelector({
                    nodeId: root.nodeId,
                    selector: '#loginValidateModal'
                }).then(({nodeId}) => {
                    rountPage+=1;
                    if(nodeId==0){
                        if(rountPage==1){
                            console.log('login fail')
                            chromeInstance.kill();
                            searchKillProcess();
                        }//登录失败退出
                        
                        return;
                    }
                    try {
                        Promise.all([
                            DOM.querySelector({
                                nodeId: nodeId,
                                selector: '#loginUserName'
                            }).then((inputNode) => {
                                Runtime.evaluate({
                                    expression: `(${setInputValue})()`
                                });
                                
    
                            }),
                            DOM.querySelector({
                                nodeId: nodeId,
                                selector: '#loginUserPass'
                            }).then((inputNode) => {
                                Runtime.evaluate({
                                    expression: `(${setInputValue1})()`
                                });
                            })
                            , DOM.querySelector({
                                nodeId,
                                selector: '#confirmLogin'
                            }),
                        ]).then(([inputNode,inputNode1, buttonNode]) => {
                            return DOM.resolveNode({
                                nodeId: buttonNode.nodeId
                            }).then(({object}) => {
                                const {objectId} = object;
                                return Runtime.callFunctionOn({
                                    objectId,
                                    functionDeclaration: `${buttonClick}`
                                })
                            });
                        }).then(() => {
                            Page.loadEventFired(async()=>{
                                var begin=0;
                                Runtime.evaluate({
                                    expression: `AppConfig.isHeadless=1;`,
                                    returnByValue:true
                                });
                                await Network.responseReceived(async(params)=>{
                                    begin+=1;
                                        if(params.response.url=="http://beop.rnbtech.com.hk/admin/getShareReportWrapPDF"){
                                            setTimeout(()=>{
                                                 Network.getResponseBody({requestId:params.requestId}).then((rs,rss)=>{
                                                    console.log(`${rs.body}`);
                                                    isDownload=1;
                                                    clearTimeout(killTime);
                                                    // console.log('end!')
                                                    chromeInstance.kill()
                                                    searchKillProcess();
                                                });
                                            },5000)
                                            
                                        }
                                })
                                var end=begin;
                                var s=setInterval(()=>{
                                    if(end==begin){
                                        clearInterval(s)
                                        DOM.getDocument().then((root)=>{
                                            DOM.querySelector({
                                                nodeId: root.root.nodeId,
                                                selector: '.pdfDownCtn'
                                            }).then((ra)=>{
                                                return DOM.resolveNode({
                                                    nodeId: ra.nodeId
                                                }).then(({object}) => {
                                                    const {objectId} = object;
                                                    return Runtime.callFunctionOn({
                                                        objectId,
                                                        functionDeclaration: `${buttonClick}`
                                                    })
                                                });
    
                                            })
                                        })
                                    }
                                    end=begin
                                },8000)
                                
                            });
    
                            
                        });
                    } catch (err) {
                        console.error(err);
                    }
                   
                })

            });
        });
        Page.navigate({
            url:arguments[0]
        }).then((frameObj) => {
            framePointer = frameObj
        });
    })

});

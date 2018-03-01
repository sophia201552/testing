/**
 * Created by vicky on 2016/11/3.
 */
class KaideScreen{
    constructor(opt) {
        InitI18nResource().always(function (rs) {
            I18n = new Internationalization(null, rs);
        });
        this.opt = opt;
        this.moduleList = {
            'energyManage': {name: '能源管理', cls: EnergyManage, icon: '&#xe827;'},
            'tempComfort': {name: '热舒适', cls: TempComfort, icon: '&#xe829;'},
            'inCondition': {name: '设备完好率', cls: InCondition, icon: '&#xe828;'},
            'energySave': {name: '节能潜力', cls: EnergySave, icon: '&#xe606;'},
            'workOrderFinish': {name: '工单完成率', cls: WorkOrderFinish, icon: '&#xe810;'},
            'dataQuality': {name: '数据质量', cls: DataQuality, icon: '&#xe826;'}
        };

        this.dataBranch =
        {
            'xxx12312': {
                id: 'xxx12312',
                name: '长宁来福士广场',
                elec: 1445,
                gas: 1037,
                water: 1581,
                tooCold:50,
                tooHot:20,
                AHU:100,
                VAV:80,
                sensor:96,
                coolingTower:100,
                refrigerator:100,
                waterPump:100,
                savingPotential:289,
                workOrder:100,
                Integrity:100,
                Validity:100,
                Relevance:100
            },
            'xxx12313': {
                id: 'xxx12313',
                name: '上海来福士广场',
                elec: 993,
                gas: 713,
                water: 1087,
                tooCold:35,
                tooHot:14,
                AHU:100,
                VAV:56,
                sensor:66,
                coolingTower:69,
                refrigerator:100,
                waterPump:100,
                savingPotential:199,
                workOrder:95,
                Integrity:99,
                Validity:98,
                Relevance:97
            },
            'xxx12314': {
                id: 'xxx12314',
                name: '杭州来福士中心',
                elec: 1043,
                gas: 752,
                water: 1142,
                tooCold:36,
                tooHot:14,
                AHU:100,
                VAV:58,
                sensor:69,
                coolingTower:72,
                refrigerator:69,
                waterPump:100,
                savingPotential:209,
                workOrder:95,
                Integrity:99,
                Validity:69,
                Relevance:96
            },
            'xxx12315': {
                id: 'xxx12315',
                name: '宁波来福士广场',
                tooCold:37,
                tooHot:15,
                water: 1142,
                elec: 1043,
                gas: 771,
                AHU:100,
                VAV:60,
                sensor:71,
                coolingTower:75,
                refrigerator:71,
                waterPump:74,
                savingPotential:214,
                workOrder:94,
                Integrity:99,
                Validity:71,
                Relevance:75
            },
            'xxx12316': {
                id: 'xxx12316',
                name: '北京来福士中心',
                tooCold:33,
                tooHot:13,
                water: 1050,
                elec: 957,
                gas: 985,
                AHU:66,
                VAV:53,
                sensor:63,
                coolingTower:66,
                refrigerator:63,
                waterPump:67,
                savingPotential:191,
                workOrder:93,
                Integrity:99,
                Validity:63,
                Relevance:66
            },
            'xxx12317': {
                id: 'xxx12317',
                name: '成都来福士广场',
                tooCold:37,
                tooHot:15,
                water: 1159,
                elec: 1045,
                gas: 756,
                AHU:73,
                VAV:58,
                sensor:69,
                coolingTower:73,
                refrigerator:69,
                waterPump:73,
                savingPotential:209,
                workOrder:82,
                Integrity:58,
                Validity:69,
                Relevance:73
            },
            'xxx12318': {
                id: 'xxx12318',
                name: '重庆来福士广场',
                tooCold:32,
                tooHot:13,
                water: 1017,
                elec: 927,
                gas: 667,
                AHU:64,
                VAV:52,
                sensor:61,
                coolingTower:64,
                refrigerator:61,
                waterPump:64,
                savingPotential:185,
                workOrder:74,
                Integrity:52,
                Validity:61,
                Relevance:64
            },
            'xxx12319': {
                id: 'xxx12319',
                name: '深圳来福士广场',
                tooCold:34,
                tooHot:13,
                water: 1055,
                elec: 956,
                gas: 697,
                AHU:67,
                VAV:53,
                sensor:64,
                coolingTower:67,
                refrigerator:64,
                waterPump:67,
                savingPotential:191,
                workOrder:64,
                Integrity:53,
                Validity:64,
                Relevance:67
            },
            'xxx12320': {
                id: 'xxx12320',
                name: '天津国际贸易中心',
                tooCold:34,
                tooHot:14,
                water: 1062,
                elec: 969,
                gas: 694,
                AHU:67,
                VAV:54,
                sensor:64,
                coolingTower:67,
                refrigerator:64,
                waterPump:67,
                savingPotential:194,
                workOrder:54,
                Integrity:54,
                Validity:64,
                Relevance:67
            },
            'xxx12321': {
                id: 'xxx12321',
                name: '凯德公园1号',
                tooCold:37,
                tooHot:15,
                water: 1148,
                elec: 1048,
                gas: 755,
                AHU:72,
                VAV:58,
                sensor:69,
                coolingTower:73,
                refrigerator:69,
                waterPump:73,
                savingPotential:210,
                workOrder:31,
                Integrity:58,
                Validity:69,
                Relevance:73
            },
            'xxx12322': {
                id: 'xxx12322',
                name: '大坦沙岛地区更新改造项目',
                tooCold:37,
                tooHot:15,
                water: 1149,
                elec: 1044,
                gas: 757,
                AHU:73,
                VAV:59,
                sensor:69,
                coolingTower:73,
                refrigerator:70,
                waterPump:73,
                savingPotential:209,
                workOrder:20,
                Integrity:59,
                Validity:69,
                Relevance:73
            },
            'xxx12323': {
                id: 'xxx12323',
                name: '凯德龙之梦虹口',
                tooCold:34,
                tooHot:14,
                water: 1073,
                elec: 984,
                gas: 709,
                AHU:69,
                VAV:55,
                sensor:65,
                coolingTower:69,
                refrigerator:65,
                waterPump:68,
                savingPotential:197,
                workOrder:19,
                Integrity:55,
                Validity:65,
                Relevance:69
            },
            'xxx12324': {
                id: 'xxx12324',
                name: '凯德龙之梦闵行',
                tooCold:37,
                tooHot:15,
                water: 1157,
                elec: 1054,
                gas: 763,
                AHU:73,
                VAV:59,
                sensor:70,
                coolingTower:73,
                refrigerator:70,
                waterPump:74,
                savingPotential:211,
                workOrder:17,
                Integrity:59,
                Validity:70,
                Relevance:73
            },
            'xxx12325': {
                id: 'xxx12325',
                name: '凯德晶萃广场',
                tooCold:37,
                tooHot:14,
                water: 1152,
                elec: 1053,
                gas: 750,
                AHU:73,
                VAV:58,
                sensor:69,
                coolingTower:73,
                refrigerator:69,
                waterPump:73,
                savingPotential:211,
                workOrder:17,
                Integrity:58,
                Validity:69,
                Relevance:73
            },
            'xxx12326': {
                id: 'xxx12326',
                name: '凯德天府',
                tooCold:32,
                tooHot:13,
                water: 1011,
                elec: 927,
                gas: 661,
                AHU:64,
                VAV:51,
                sensor:61,
                coolingTower:64,
                refrigerator:61,
                waterPump:65,
                savingPotential:185,
                workOrder:15,
                Integrity:51,
                Validity:61,
                Relevance:64
            },
            'xxx12327': {
                id: 'xxx12327',
                name: '苏州中心',
                tooCold:34,
                tooHot:14,
                water: 1080,
                elec: 976,
                gas: 704,
                AHU:68,
                VAV:54,
                sensor:65,
                coolingTower:68,
                refrigerator:65,
                waterPump:67,
                savingPotential:195,
                workOrder:14,
                Integrity:54,
                Validity:65,
                Relevance:68
            },
            'xxx12328': {
                id: 'xxx12328',
                name: '凯德广场新地城',
                tooCold:35,
                tooHot:14,
                water: 1108,
                elec: 1009,
                gas: 720,
                AHU:70,
                VAV:56,
                sensor:66,
                coolingTower:70,
                refrigerator:66,
                waterPump:69,
                savingPotential:202,
                workOrder:12,
                Integrity:56,
                Validity:66,
                Relevance:70
            },
            'xxx12329': {
                id: 'xxx12329',
                name: '凯德西城',
                tooCold:33,
                tooHot:13,
                water: 1040,
                elec: 946,
                gas: 686,
                AHU:66,
                VAV:53,
                sensor:63,
                coolingTower:66,
                refrigerator:63,
                waterPump:66,
                savingPotential:189,
                workOrder:0,
                Integrity:53,
                Validity:63,
                Relevance:66
            },
            'xxx12330': {
                id: 'xxx12330',
                name: '凯德星贸中心',
                tooCold:32,
                tooHot:13,
                water: 1018,
                elec: 932,
                gas: 663,
                AHU:65,
                VAV:52,
                sensor:61,
                coolingTower:65,
                refrigerator:61,
                waterPump:64,
                savingPotential:186,
                workOrder:0,
                Integrity:52,
                Validity:61,
                Relevance:65
            }
        };
    }

    show(){
        this.ctn = document.querySelector('#containerKaide');
        this.init();
        this.attachEvent();
    }

    init(){
        this.initModule();
        this.initFiltor();
        this.initDetailPanel();

        //默认显示第一个
        var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, true);
        document.querySelector('.panelModules .btnBmModule').dispatchEvent(e)
    }

    initModule(){
        let container = this.ctn.querySelector('.panelModules');
        
        Object.keys(this.moduleList).forEach(val=> {
            let divBtn = document.createElement('div');
            divBtn.className = 'btnBmModule';
            divBtn.innerHTML = '<i class="iconfont">'+ this.moduleList[val].icon +'</i><div class="moduleName">' + this.moduleList[val].name + '</div>';
            divBtn.dataset.type = val;
            container.appendChild(divBtn)
        });
        
        $(container).off('click').on('click', '.btnBmModule', e=> {
            $(container).children().removeClass('selected');
            $(e.currentTarget).addClass('selected');
            if (!this.moduleList[e.currentTarget.dataset.type].cls)return;
            this.curModule && this.curModule.destroy && this.curModule.destroy();
            this.curModule = new this.moduleList[e.currentTarget.dataset.type].cls(this);
            this.curModule.type = e.currentTarget.dataset.type;
            
            let allId=[];
            $('#ulFilterResult li').each(function(){
                if($(this).hasClass('selected')){
                    allId.push($(this).attr('data-id'));
                }
            });
            this.curModule.show(allId);
            return;
        });
    }

    initFiltor(){
        let container = this.ctn.querySelector('#ulFilterResult');
        if(!this.dataBranch) return;
        for(var data in this.dataBranch){
            let li = document.createElement('li');
            li.className = 'liBranch';
            li.textContent = this.dataBranch[data].name;
            li.dataset.id = this.dataBranch[data].id;
            li.onclick = (e) => {
                this.showSelected(e.target, e);
            }
            if(['xxx12312', 'xxx12313'].indexOf(li.dataset.id) > -1){
                li.classList.add('active');
            }
            container.appendChild(li);
        }
        $('li', container).addClass('selected');
    }

    initDetailPanel(){

    }

    attachEvent(){
        let iptSearch = this.ctn.querySelector('.iptSearch');
        let lis = Array.from(this.ctn.querySelectorAll('#ulFilterResult li'));
        //搜索和输入字符匹配的项目
        iptSearch.oninput = e => {
            let inputVal = e.target.value;
            lis.forEach(li => {
                if(li.textContent.toLowerCase().indexOf(inputVal.toLowerCase()) < 0){
                    li.classList.add('hidden');
                }else{
                    li.classList.remove('hidden');
                }
            });
        }
    }

    showSelected(li, e){
        let arrId = [], arrLi;
        let container = this.ctn.querySelector('#ulFilterResult');
        if(this.curModule.type === 'billManage'){//单选
            $(li).addClass('selected').siblings().removeClass('selected');
        }
        else if(this.curModule.type === 'analysisQuery'){
            if(e){
                if(e.ctrlKey==1){
                    $(li).toggleClass('selected');
                }else{
                    $(li).addClass('selected').siblings().removeClass('selected');
                }
            }
            else{
                $(li).addClass('selected').siblings().removeClass('selected');
            }

        }
        else{//多选
            if(e){//手动点击
                $(li).toggleClass('selected');
            }
            if(!container.querySelector('.selected')){//如果一个选中的也没有,选中点击的该项
                $(li).addClass('selected')
            }
        }
        arrLi = Array.from(container.querySelectorAll('li.selected'));
        arrLi.forEach(l => {
            arrId.push(l.dataset.id);
        });
        this.curModule.show(arrId);
    }
}

InitI18nResource().always(function (rs) {
    I18n = new Internationalization(null, rs);
});
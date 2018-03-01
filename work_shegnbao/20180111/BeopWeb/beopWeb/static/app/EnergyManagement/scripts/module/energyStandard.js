/**
 * Created by vivian on 2017/6/23.
 */
class EnergyStandard {
    constructor(opt) {
        this.opt = opt;
        this.moduleList = {
            'EnergyProjectStandard': {
                name: '项目对标',
                cls: EnergyProjectStandard,
                icon: '&#xe827;'
            },
        };

        this.dataBranch = {
            'xxx12312': {
                id: 'xxx12312',
                name: 'SEVENTH AVENUE Branch',
                elec: 1045,
                gas: 1037,
                water: 1281,
                tooCold: 50,
                tooHot: 20,
                AHU: 100,
                VAV: 80,
                sensor: 96,
                coolingTower: 100,
                refrigerator: 100,
                waterPump: 100,
                savingPotential: 289,
                workOrder: 100,
                Integrity: 100,
                Validity: 100,
                Relevance: 100
            },
            'xxx12313': {
                id: 'xxx12313',
                name: 'FRESH POND ROAD Branch',
                elec: 993,
                gas: 713,
                water: 1087,
                tooCold: 35,
                tooHot: 14,
                AHU: 100,
                VAV: 56,
                sensor: 66,
                coolingTower: 69,
                refrigerator: 100,
                waterPump: 100,
                savingPotential: 199,
                workOrder: 95,
                Integrity: 99,
                Validity: 98,
                Relevance: 97
            },
            'xxx12314': {
                id: 'xxx12314',
                name: '14TH ST Branch',
                elec: 1043,
                gas: 752,
                water: 1142,
                tooCold: 36,
                tooHot: 14,
                AHU: 100,
                VAV: 58,
                sensor: 69,
                coolingTower: 72,
                refrigerator: 69,
                waterPump: 100,
                savingPotential: 209,
                workOrder: 95,
                Integrity: 99,
                Validity: 69,
                Relevance: 96
            },
            'xxx12315': {
                id: 'xxx12315',
                name: '18TH ST Branch',
                tooCold: 37,
                tooHot: 15,
                water: 1142,
                elec: 1043,
                gas: 771,
                AHU: 100,
                VAV: 60,
                sensor: 71,
                coolingTower: 75,
                refrigerator: 71,
                waterPump: 74,
                savingPotential: 214,
                workOrder: 94,
                Integrity: 99,
                Validity: 71,
                Relevance: 75
            },
            'xxx12316': {
                id: 'xxx12316',
                name: 'THIRD AVENUE Branch',
                tooCold: 33,
                tooHot: 13,
                water: 1050,
                elec: 957,
                gas: 985,
                AHU: 66,
                VAV: 53,
                sensor: 63,
                coolingTower: 66,
                refrigerator: 63,
                waterPump: 67,
                savingPotential: 191,
                workOrder: 93,
                Integrity: 99,
                Validity: 63,
                Relevance: 66
            },
            'xxx12317': {
                id: 'xxx12317',
                name: 'BROADWAY Branch',
                tooCold: 37,
                tooHot: 15,
                water: 1159,
                elec: 1045,
                gas: 756,
                AHU: 73,
                VAV: 58,
                sensor: 69,
                coolingTower: 73,
                refrigerator: 69,
                waterPump: 73,
                savingPotential: 209,
                workOrder: 82,
                Integrity: 58,
                Validity: 69,
                Relevance: 73
            },
            'xxx12318': {
                id: 'xxx12318',
                name: 'STEINWAY STREET Branch',
                tooCold: 32,
                tooHot: 13,
                water: 1017,
                elec: 927,
                gas: 667,
                AHU: 64,
                VAV: 52,
                sensor: 61,
                coolingTower: 64,
                refrigerator: 61,
                waterPump: 64,
                savingPotential: 185,
                workOrder: 74,
                Integrity: 52,
                Validity: 61,
                Relevance: 64
            },
            'xxx12319': {
                id: 'xxx12319',
                name: 'PATERSON PLANK RD Branch',
                tooCold: 34,
                tooHot: 13,
                water: 1055,
                elec: 956,
                gas: 697,
                AHU: 67,
                VAV: 53,
                sensor: 64,
                coolingTower: 67,
                refrigerator: 64,
                waterPump: 67,
                savingPotential: 191,
                workOrder: 64,
                Integrity: 53,
                Validity: 64,
                Relevance: 67
            },
            'xxx12320': {
                id: 'xxx12320',
                name: 'QUEENS BLVD Branch',
                tooCold: 34,
                tooHot: 14,
                water: 1062,
                elec: 969,
                gas: 694,
                AHU: 67,
                VAV: 54,
                sensor: 64,
                coolingTower: 67,
                refrigerator: 64,
                waterPump: 67,
                savingPotential: 194,
                workOrder: 54,
                Integrity: 54,
                Validity: 64,
                Relevance: 67
            },
            'xxx12321': {
                id: 'xxx12321',
                name: 'PLAZA CENTER Branch',
                tooCold: 37,
                tooHot: 15,
                water: 1148,
                elec: 1048,
                gas: 755,
                AHU: 72,
                VAV: 58,
                sensor: 69,
                coolingTower: 73,
                refrigerator: 69,
                waterPump: 73,
                savingPotential: 210,
                workOrder: 31,
                Integrity: 58,
                Validity: 69,
                Relevance: 73
            },
            'xxx12322': {
                id: 'xxx12322',
                name: 'LENOX AVE. Branch',
                tooCold: 37,
                tooHot: 15,
                water: 1149,
                elec: 1044,
                gas: 757,
                AHU: 73,
                VAV: 59,
                sensor: 69,
                coolingTower: 73,
                refrigerator: 70,
                waterPump: 73,
                savingPotential: 209,
                workOrder: 20,
                Integrity: 59,
                Validity: 69,
                Relevance: 73
            },
            'xxx12323': {
                id: 'xxx12323',
                name: '149TH STREET Branch',
                tooCold: 34,
                tooHot: 14,
                water: 1073,
                elec: 984,
                gas: 709,
                AHU: 69,
                VAV: 55,
                sensor: 65,
                coolingTower: 69,
                refrigerator: 65,
                waterPump: 68,
                savingPotential: 197,
                workOrder: 19,
                Integrity: 55,
                Validity: 65,
                Relevance: 69
            },
            'xxx12324': {
                id: 'xxx12324',
                name: 'BEDFORD AVENUE Branch',
                tooCold: 37,
                tooHot: 15,
                water: 1157,
                elec: 1054,
                gas: 763,
                AHU: 73,
                VAV: 59,
                sensor: 70,
                coolingTower: 73,
                refrigerator: 70,
                waterPump: 74,
                savingPotential: 211,
                workOrder: 17,
                Integrity: 59,
                Validity: 70,
                Relevance: 73
            },
            'xxx12325': {
                id: 'xxx12325',
                name: 'NORTHERN BLVD Branch',
                tooCold: 37,
                tooHot: 14,
                water: 1152,
                elec: 1053,
                gas: 750,
                AHU: 73,
                VAV: 58,
                sensor: 69,
                coolingTower: 73,
                refrigerator: 69,
                waterPump: 73,
                savingPotential: 211,
                workOrder: 17,
                Integrity: 58,
                Validity: 69,
                Relevance: 73
            },
            'xxx12326': {
                id: 'xxx12326',
                name: 'BRUCKNER BLVD Branch',
                tooCold: 32,
                tooHot: 13,
                water: 1011,
                elec: 927,
                gas: 661,
                AHU: 64,
                VAV: 51,
                sensor: 61,
                coolingTower: 64,
                refrigerator: 61,
                waterPump: 65,
                savingPotential: 185,
                workOrder: 15,
                Integrity: 51,
                Validity: 61,
                Relevance: 64
            },
            'xxx12327': {
                id: 'xxx12327',
                name: 'UNION TURNPIKE Branch',
                tooCold: 34,
                tooHot: 14,
                water: 1080,
                elec: 976,
                gas: 704,
                AHU: 68,
                VAV: 54,
                sensor: 65,
                coolingTower: 68,
                refrigerator: 65,
                waterPump: 67,
                savingPotential: 195,
                workOrder: 14,
                Integrity: 54,
                Validity: 65,
                Relevance: 68
            },
            'xxx12328': {
                id: 'xxx12328',
                name: 'HILLSIDE AVE Branch',
                tooCold: 35,
                tooHot: 14,
                water: 1108,
                elec: 1009,
                gas: 720,
                AHU: 70,
                VAV: 56,
                sensor: 66,
                coolingTower: 70,
                refrigerator: 66,
                waterPump: 69,
                savingPotential: 202,
                workOrder: 12,
                Integrity: 56,
                Validity: 66,
                Relevance: 70
            },
            'xxx12329': {
                id: 'xxx12329',
                name: 'QUEENS BOULEVARD Branch',
                tooCold: 33,
                tooHot: 13,
                water: 1040,
                elec: 946,
                gas: 686,
                AHU: 66,
                VAV: 53,
                sensor: 63,
                coolingTower: 66,
                refrigerator: 63,
                waterPump: 66,
                savingPotential: 189,
                workOrder: 0,
                Integrity: 53,
                Validity: 63,
                Relevance: 66
            },
            'xxx12330': {
                id: 'xxx12330',
                name: 'WEBSTER AVENUE Branch',
                tooCold: 32,
                tooHot: 13,
                water: 1018,
                elec: 932,
                gas: 663,
                AHU: 65,
                VAV: 52,
                sensor: 61,
                coolingTower: 65,
                refrigerator: 61,
                waterPump: 64,
                savingPotential: 186,
                workOrder: 0,
                Integrity: 52,
                Validity: 61,
                Relevance: 65
            }
        };
        this.container = undefined;
    }

    show() {
        this.init();
    }

    init() {
        var _this = this;
        _this.container = document.getElementById('containerDisplayboard')
        WebAPI.get('/static/app/EnergyManagement/views/module/energyStandard.html').done(function (result) {
            _this.container.innerHTML = result;
            _this.initFiltor();
            _this.initModule();
            _this.attachEvent();            
            _this.initDetailPanel();
        }).always(function(){
            I18n.fillArea($('#containerDisplayboard'));
        });
    }

    initModule() {
        let allId = [];
        $('#ulFilterResult li').each(function () {
            if ($(this).hasClass('selected')) {
                allId.push($(this).attr('data-id'));
            }
        });        
        this.curModule && this.curModule.destroy && this.curModule.destroy();
        this.curModule = new this.moduleList['EnergyProjectStandard'].cls(this);
        this.curModule.type = 'EnergyProjectStandard';
        this.curModule.show(allId);
    }

    initFiltor() {
        let container = this.container.querySelector('#ulFilterResult');
        if (!this.dataBranch) return;
        for (var data in this.dataBranch) {
            let li = document.createElement('li');
            li.className = 'liBranch';
            li.textContent = this.dataBranch[data].name;
            li.dataset.id = this.dataBranch[data].id;
            li.onclick = (e) => {
                this.showSelected(e.target, e);
            }
            if (['xxx12312', 'xxx12313'].indexOf(li.dataset.id) > -1) {
                li.classList.add('active');
            }
            container.appendChild(li);
        }
        $('li', container).addClass('selected');
    }

    initDetailPanel() {

    }

    attachEvent() {
        let iptSearch = this.container.querySelector('.iptSearch');
        let lis = Array.from(this.container.querySelectorAll('#ulFilterResult li'));
        //搜索和输入字符匹配的项目
        iptSearch.oninput = e => {
            let inputVal = e.target.value;
            lis.forEach(li => {
                if (li.textContent.toLowerCase().indexOf(inputVal.toLowerCase()) < 0) {
                    li.classList.add('hidden');
                } else {
                    li.classList.remove('hidden');
                }
            });
        }
        iptSearch.onpropertychange = e => {
            let inputVal = e.target.value;
            lis.forEach(li => {
                if (li.textContent.toLowerCase().indexOf(inputVal.toLowerCase()) < 0) {
                    li.classList.add('hidden');
                } else {
                    li.classList.remove('hidden');
                }
            });
        }
    }

    showSelected(li, e) {
        let arrId = [],
            arrLi;
        let container = this.container.querySelector('#ulFilterResult');
        if (this.curModule.type === 'billManage') { //单选
            $(li).addClass('selected').siblings().removeClass('selected');
        } else if (this.curModule.type === 'analysisQuery') {
            if (e) {
                if (e.ctrlKey == 1) {
                    $(li).toggleClass('selected');
                } else {
                    $(li).addClass('selected').siblings().removeClass('selected');
                }
            } else {
                $(li).addClass('selected').siblings().removeClass('selected');
            }

        } else { //多选
            if (e) { //手动点击
                $(li).toggleClass('selected');
            }
            if (!container.querySelector('.selected')) { //如果一个选中的也没有,选中点击的该项
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

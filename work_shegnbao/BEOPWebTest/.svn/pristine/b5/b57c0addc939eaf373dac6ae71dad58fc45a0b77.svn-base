/**
 * Created by vicky on 2016/11/3.
 */
class BillScreen{
    constructor(opt) {
        InitI18nResource().always(function (rs) {
            I18n = new Internationalization(null, rs);
        });
        this.opt = opt;
        this.moduleList = {
            'billManage': {name: 'Bills', cls: BillManageScreen, icon: '&#xe716;'},
            'analysisQuery': {name: 'Analysis', cls: analysisQueryScreen, icon: '&#xe600;'},
            'crosswise': {name: 'Benchmark', cls: crosswiseScreen, icon: '&#xe704;'}
        };

        this.dataBranch =
        {
            'xxx12312': {
                id: 'xxx12312',
                name: 'SEVENTH AVENUE Branch',
                elec: 775.27,
                gas: 852.18,
                water: 757.27
            },
            'xxx12313': {
                id: 'xxx12313',
                name: 'PENN PLAZA AMTRAK LEVEL Branch',
                elec: 1508.52,
                gas: 1437.53,
                water: 1033.89
            },
            'xxx12314': {
                id: 'xxx12314',
                name: '14TH ST Branch',
                elec: 1143.393663,
                gas: 888.6951873,
                water: 509.5879622
            },
            'xxx12315': {
                id: 'xxx12315',
                name: 'MCGUINNESS BOULEVARD Branch',
                elec: 1094.463895,
                gas: 844.4909646,
                water: 558.949706
            },
            'xxx12316': {
                id: 'xxx12316',
                name: 'THIRD AVENUE Branch',
                elec: 1035.727588,
                gas: 811.289035,
                water: 645.7456339
            },
            'xxx12317': {
                id: 'xxx12317',
                name: 'BROADWAY Branch',
                elec: 1147.642811,
                gas: 935.1119446,
                water: 538.827091
            },
            'xxx12318': {
                id: 'xxx12318',
                name: 'STEINWAY STREET Branch',
                elec: 1008.818703,
                gas: 938.694177,
                water: 673.2293741
            },
            'xxx12319': {
                id: 'xxx12319',
                name: 'PATERSON PLANK RD Branch',
                elec: 1141.962274,
                gas: 863.7496122,
                water: 578.4603306
            },
            'xxx12320': {
                id: 'xxx12320',
                name: 'QUEENS BLVD Branch',
                elec: 1072.931382,
                gas: 995.8210023,
                water: 502.6768671
            },
            'xxx12321': {
                id: 'xxx12321',
                name: 'PLAZA CENTER Branch',
                elec: 1043.687946,
                gas: 966.8599103,
                water: 631.4957037
            },
            'xxx12322': {
                id: 'xxx12322',
                name: 'LENOX AVE. Branch',
                elec: 1135.709762,
                gas: 915.5239184,
                water: 699.2491368
            },
            'xxx12323': {
                id: 'xxx12323',
                name: '149TH STREET Branch',
                elec: 1007.226487,
                gas: 805.0357542,
                water: 695.3286743
            },
            'xxx12324': {
                id: 'xxx12324',
                name: 'BEDFORD AVENUE Branch',
                elec: 1053.312581,
                gas: 936.8664591,
                water: 626.233145
            },
            'xxx12325': {
                id: 'xxx12325',
                name: 'NORTHERN BLVD Branch',
                elec: 1147.61835,
                gas: 846.1286998,
                water: 583.7444887
            },
            'xxx12326': {
                id: 'xxx12326',
                name: 'BRUCKNER BLVD Branch',
                elec: 1156.010522,
                gas: 878.1226981,
                water: 518.424581
            },
            'xxx12327': {
                id: 'xxx12327',
                name: 'UNION TURNPIKE Branch',
                elec: 1086.685528,
                gas: 999.9814599,
                water: 692.3998459
            },
            'xxx12328': {
                id: 'xxx12328',
                name: 'HILLSIDE AVE Branch',
                elec: 1066.42693,
                gas: 848.5446746,
                water: 591.15653
            },
            'xxx12329': {
                id: 'xxx12329',
                name: 'QUEENS BOULEVARD Branch',
                elec: 1050.832182,
                gas: 903.9853453,
                water: 662.4569968
            },
            'xxx12330': {
                id: 'xxx12330',
                name: 'WEBSTER AVENUE Branch',
                elec: 1010.060934,
                gas: 866.648962,
                water: 589.0583839
            },
            'xxx12331': {
                id: 'xxx12331',
                name: 'FRESH POND ROAD Branch',
                elec: 1170.860938,
                gas: 948.9612621,
                water: 546.990219
            }
        };
    }

    show(){
        this.ctn = document.querySelector('#containerBill');
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
            let fisrtLi = document.querySelector('#ulFilterResult li');
            $(container).children().removeClass('selected');
            $(e.currentTarget).addClass('selected');
            if (!this.moduleList[e.currentTarget.dataset.type].cls)return;
            this.curModule && this.curModule.destroy && this.curModule.destroy();
            this.curModule = new this.moduleList[e.currentTarget.dataset.type].cls(this);
            this.curModule.type = e.currentTarget.dataset.type;
            if(this.curModule.type==='crosswise'){
                var allId=[];
                $('#ulFilterResult li').each(function(){
                    $(this).addClass('selected');
                    allId.push($(this).attr('data-id'));
                });
                this.curModule.show(allId);
                return;
            }
            if(this.curModule.type==='analysisQuery'){
                $('#ulFilterResult li').removeClass('selected');

            }
            this.showSelected(fisrtLi);
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
            container.appendChild(li)
        }
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
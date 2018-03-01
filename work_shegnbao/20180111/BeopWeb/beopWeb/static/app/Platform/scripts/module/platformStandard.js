/**
 * Created by vivian on 2017/8/31.
 */
class PlatformStandard {
    constructor(id,template) {
        this.id = id;
        this.template = template;
        this.opt = undefined;
        this.moduleList = {
            'PlatformStandardModule': {
                name: '项目对标',
                cls: PlatformStandardModule,
                icon: '&#xe827;'
            },
        };
/*        this.dataBranch = {
            'xxx12312': {
                id: 'xxx12312',
                name_cn: 'SEVENTH AVENUE Branch',
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
            }
        };*/
        this.dataBranch = {};
        this.projectList = [];
        this.container = undefined;
    }

    show() {
        this.opt = ModuleIOC.getModuleByMultiParam({template:this.template,module:'standard','option.projectGrpId':this.id},'base')[0].option;
        this.projectList = AppConfig.groupProjectCurrent.projectList;
        this.init();
    }

    init() {
        // this.projectList.forEach(function (element) {
        //     this.dataBranch[element.id] = element;
        // }.bind(this));
        WebAPI.get('/static/app/Platform/views/module/platformStandard.html').done(function (result) {
            this.container = ElScreenContainer;
            this.container.innerHTML = result;
            this.initPoint();
            this.initTimeQuery();
        }.bind(this)).always(function () {
            I18n.fillArea($('.rightContainer'));
        });
    }
    initPoint() {
        Spinner.spin($('#indexMain')[0]);
        var pointList = AppConfig.groupProjectCurrent.projectList.map(function (ele) {
            return '@' + ele.id + '|proj_IndInfoStatis'
        });
        var _this=this;
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {"dsItemIds": pointList,}).done(function (result) {
            //result中可能有Null
            var rsData = [];
            for (var i = 0; i < result.dsItemList.length; i++) {
                var realPointJson = result.dsItemList[i].data != 'Null' ? JSON.parse(result.dsItemList[i].data) : '';
                for (var j = 0; j < this.opt.option.point.length; j++) {
                    var pointKey = this.opt.option.point[j];
                    var realPointName = realPointJson[pointKey.ptkey];
                    if (!realPointName)continue;
                    realPointName.id = result.dsItemList[i].dsItemId.replace('@', '').split('|')[0];
                    realPointName.dataName = pointKey.name
                    rsData.push(realPointName);
                }
            }
            if (rsData.length == 0){
                    Spinner.stop();return;
                }
            this.initPointData(rsData);
        }.bind(this)).fail(function(){
            Spinner.stop();
        })
    }
    initPointData(psPoint) {
        var sltTime = $('.selectTime').html();
        var nowTime = new Date().getTime();
        var startTime = new Date(new Date(sltTime).getTime()).format('yyyy-MM-01 00:00:00');
        var endTime = new Date(new Date(sltTime.split('-')[0], Number(sltTime.split('-')[1]), 1).getTime() - 60 * 60 * 1000 * 24).getTime();
        var pointList = psPoint.map(function (element) {
            return '@' + element.id + '|' + element.point;
        })
        var psUrl = '',isHistory = false;
        var psData = {
            dsItemIds: pointList,
            timeEnd: new Date(endTime).format('yyyy-MM-dd 23:55:00'),
            timeFormat: "M1",
            timeStart: startTime
        }
        if (endTime > nowTime) {
            psUrl = '/analysis/startWorkspaceDataGenPieChart';
        } else {
            isHistory = true;
            //psUrl = '/get_history_data_padded';
            psUrl = '/analysis/startWorkspaceDataGenHistogram';
            endTime = new Date(endTime).format('yyyy-MM-dd 23:55:00');
            //endTime = '2017-09-28 23:55:00'
            psData = {
                "dsItemIds": pointList,
                "timeStart": endTime,
                "timeEnd": endTime,
                "timeFormat": "d1",
            }
        }  
        var noDataHtml =
            ` <div class="noDataMask">
                        <div class="noDataBox">
                            <div calss="noDataImg"><img src="/static/images/error/noData.png" alt="无数据"></div>
                            <div class="noDataText">
                                <p>本月暂无数据</p>
                                <p>请您查看其它月份历史数据</p>
                            </div>
                        </div>
                    </div>`;              
        WebAPI.post(psUrl, psData).done(function (result) {
            if(!(result.dsItemList || (result.list && result.list.length != 0))){
                $('.echartModule').html(noDataHtml);
                return;
            }
            var rsList = result.list || result.dsItemList;
            rsList=rsList.filter(item=>{
                if(!isNaN(Number(item.data))){
                  if(Number(item.data)!='' || Number(item.data) == 0){
                      return item
                  }
                }
            })
            rsList.forEach(function (element) {
                
                var pointId = element.dsItemId.replace('@', '').slice(0, 3);
                var pointIdNew= element.dsItemId.replace('@', '').split('|')[0]
                this.projectList.forEach(function (element) {
                    if(element.id==pointIdNew){
                        this.dataBranch[element.id] = element;
                    }
                    
                }.bind(this));
                var valueName = '',valueJson = {},psPointInfo = '';
                psPoint.forEach(function(element){
                    if(element.id == pointIdNew){
                        valueName = element.dataName;
                        psPointInfo = element;
                    }
                })
                for (var key in this.dataBranch) {
                    if (key == pointIdNew) {
                        valueJson[valueName] = Number(element.data);
                        this.dataBranch[key].data = valueJson;
                        this.dataBranch[key].info = psPointInfo;
                    }
                }
            }.bind(this))
            this.initFiltor();
            this.initModule();
            this.attachEvent();
            this.initDetailPanel();
        }.bind(this)).always(function(){
            Spinner.stop();
        })
    }
    initModule() {
        let allId = [];
        $('#ulFilterResult li').each(function () {
            if ($(this).hasClass('selected')) {
                allId.push($(this).attr('data-id'));
            }
        });
        this.curModule && this.curModule.destroy && this.curModule.destroy();
        this.curModule = new this.moduleList['PlatformStandardModule'].cls(this);
        this.curModule.type = 'PlatformStandardModule';
        this.curModule.show(allId);
    }

    initFiltor() {
        let container = this.container.querySelector('#ulFilterResult');
        container.innerHTML = '';
        if (!this.dataBranch) return;
        for (var data in this.dataBranch) {
            let li = document.createElement('li');
            li.className = 'liBranch';
            li.textContent = AppConfig.language == 'en' ? this.dataBranch[data].name_en : this.dataBranch[data].name_cn;
            li.dataset.id = this.dataBranch[data].id;
            li.onclick = (e) => {
                this.showSelected(e.target, e);
            }
            /*            if (['0', '1'].indexOf(li.dataset.id) > -1) {
                            li.classList.add('active');
                        }*/
            //li.classList.add('active');
            container.appendChild(li);
        }
        $('li', container).addClass('selected');
    }

    initDetailPanel() {

    }
    onGroupToggle() {
        this.close();
        this.show();
    }
    initTimeQuery() {
        var now = toDate();
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $('#iptTime').val(month[now.getMonth()] + ' ' + now.getFullYear());
        $('.selectTime').datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            startView: 3,
            minView: 3,
            todayHighlight: true,
            endDate:new Date()
        }).on('changeMonth', function (ev) {
            $('#iptTime').val(month[ev.date.getMonth()] + ' ' + ev.date.getFullYear());
            $('.selectTime').html(new Date(ev.date.getFullYear(), ev.date.getMonth()).format("yyyy-MM"));
            this.initPoint();
        }.bind(this));
        $('.selectTime').html(new Date().format("yyyy-MM"));
    }
    attachEvent() {
        let iptSearch = this.container.querySelector('.iptSearch');
        var liList = this.container.querySelectorAll('#ulFilterResult li');
        var lis = this.getArrayDom(liList);
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
    }
    getArrayDom(liList) {
        var arrayLi = []
        for (var i = 0; i < liList.length; i++) {
            arrayLi.push(liList[i]);
        }
        return arrayLi;
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
        arrLi = this.getArrayDom(container.querySelectorAll('li.selected'));
        arrLi.forEach(l => {
            arrId.push(l.dataset.id);
        });
        this.curModule.show(arrId);
    }
    close(){
        this.dataBranch = {};
        this.projectList = [];
        this.container = undefined;
    }
}
window.PlatformStandard = PlatformStandard;
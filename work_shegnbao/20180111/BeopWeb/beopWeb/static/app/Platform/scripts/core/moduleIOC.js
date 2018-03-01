class moduleIOC{
    constructor (app){
        this.app = app;
        this.list = []
        this.init()

        this.curModuleOpt = undefined;
        this.curModule = undefined;
    }
    init(){
        this.initFunctionList();
        this.initProjectList();
        this.initBaseList();
    }
    //初始化功能条目
    initFunctionList(){
        this.add({
                module: 'operationRecord',
                icon: 'iconfont  icon-icon-caozuojilu',
                title: i18n_resource.platform_app.project_func.OPERATION_RECORD,
                block: 'function',
            init:function(){new OperatingRecord().show();},
            needProject:true
        })
        this.add({module:'taceback',icon:'glyphicon glyphicon-play-circle',title:i18n_resource.platform_app.function.REPLAY,block:'function',needProject:true})
            this.add({
                module: 'historyPanel',
                icon: 'glyphicon glyphicon-tasks',
                title: i18n_resource.platform_app.function.PANEL,
                block: 'function',
                needProject: true,
                init: function() {
            DragPanel.show();
                }
            })
            this.add({
                module: 'dbConfig',
                icon: 'glyphicon glyphicon-edit',
                title: i18n_resource.platform_app.function.EDIT,
                block: 'function',
                needProject: true,
                for: 'EnergyScreen',
                init: function() {
            if (!ModuleIOC.curModule instanceof EnergyScreen)return;
            if(!(AppConfig.permission && AppConfig.permission.DBWrite))return;
          
            var ins = ModuleIOC.curModule;
            if(ins.isConfigMode == false){
                ins.isConfigMode = true;
                ModuleIOC.curModuleOpt=ModuleIOC.copyOpt;//改变当前dbConfig的moduleopt
                //e.currentTarget.classList.add('toolbar-btn-selected');
                $('.springLinkBtn').hide();
                ins.showConfigMode();

                $('.sideTrans').fadeIn();
                document.querySelector('#leftCt').click();
                $($('.nav-header')[0]).click();
                document.querySelector('#wrapFunction .navItem[data-module="dbConfig"] .text').innerHTML = '保存'
            }else{
               
                ins.isConfigMode = false;
                ins.saveLayout();
                $('.springLinkBtn').removeAttr('style');
                document.querySelector('#wrapFunction .navItem[data-module="dbConfig"] .text').innerHTML = i18n_resource.platform_app.function.EDIT
            }
                }
            })
            this.add({
                module: 'appConfig',
                icon: 'glyphicon glyphicon-cog',
                title: i18n_resource.platform_app.function.OPTION,
                block: 'function',
                init: function() {
            // new AppConfig.show();
            new PlaformUserConfig().show();
            ModuleIOC.curModuleOpt=ModuleIOC.copyOpt;
            ModuleIOC.copyOpt=null;
                }
            })
            this.add({
                module: 'fullscreen',
                icon: 'iconfont  icon-quanping',
                title: i18n_resource.platform_app.function.FULLSCREEN,
                block: 'function',
                init: function() {
            function launchFullscreen(element) { //全屏
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }

            function exitFullscreen() { //退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

            if (window.innerHeight !== screen.height) {
                launchFullscreen(document.documentElement);
            } else {
                exitFullscreen();
            }
                }
            })
            this.add({
                module: 'logout',
                icon: 'iconfont icon-kaiguan',
                title: i18n_resource.admin.ddlUser.MENU_LOGOUT,
                block: 'function',
                init: function() {
            WebAPI.get('/logout/' + AppConfig.userId).done(function() {
                AppConfig = {};
                window.onhashchange = null;
                localStorage.removeItem("userInfo");
                try {
                    if (CompanyConfig && CompanyConfig.code) {
                        location.href = '/platform/company/' + CompanyConfig.code;
                        return;
                    }
                } catch (e) {}
                location.href = '/platform';
    
            });
                }
            })
            this.add({
                module: 'modbus',
                icon: 'glyphicon glyphicon-link',
                title: i18n_resource.platform_app.function.DATA_TER,
                block: 'project-function',
                init: function() {
            Router.goTo({
                    page: 'ModBusInterface',
                    projectId: AppConfig.projectId                
            })
                }
            })
            this.add({
                module: 'dataManagement',
                icon: 'iconfont  icon-Code',
                title: i18n_resource.platform_app.project_func.DATA_MANAGE,
                block: 'project-function',
                init: function() {
                    Router.goTo({
                    page: 'PointManagerRealTimeData',
                    projectId: AppConfig.projectId
                    })
                }
            })
            this.add({
                module: 'algorithmDeveloper',
                icon: 'iconfont  icon-kaifazhepingtai',
                title: i18n_resource.platform_app.project_func.ALGORITHM,
                block: 'project-function',
                init: function() {
            ModuleIOC.toggleIframe({option:{src:'/diagnosis_v2?projectId=' + AppConfig.projectId}})
                }
            })
        this.add({module:'factory',icon:'iconfont  icon-wangyepeizhi',title:i18n_resource.platform_app.project_func.FACTORY,block:'project-function',href:"/factory"})

        this.add({module:'analysis',icon:'iconfont  icon-fenxi',title:i18n_resource.platform_app.function.DATA_ANALYZ,block:'project-function',cls:AnalysisScreen})
        this.add({module:'workorder',icon:'iconfont  icon-gongdan1',title:i18n_resource.platform_app.function.WORKFLOW,block:'project-function',href:'#page=workflow&type=transaction&subType=workingTask'})
            this.add({
                module: 'system',
                icon: 'iconfont  icon-houtaiguanli',
                title: i18n_resource.platform_app.function.SYSTEM,
                block: 'project-function',
                init: function() {
            Router.goTo({
                    page: 'UserManagerController',
                    manager: 'MemberManager'                
            })
                }
            });
        this.add({module:'terminal',icon:'iconfont  icon-zhongduan',title:i18n_resource.platform_app.function.TERMINAL,block:'project-function',cls:TerminalDebugging})
    }
    //初始化导航条目
    initBaseList_bak() {
        // if (!AppConfig.permission.DemoAccount) {
        //     this.add({cls:ProjectCreate,module:'create',title:I18n.resource.platform_app.base.NEW_PROJECT,block:'base',icon:'iconfont icon-tianjia4',attr:{'id':'btnNewProject','i18n':'platform_app.base.NEW_PROJECT'}})
        // }
        
        this.add({cls:ProjectCreate,module:'create',title:I18n.resource.platform_app.base.NEW_PROJECT,block:'base',icon:'iconfont icon-tianjia4',attr:{'id':'btnNewProject','i18n':'platform_app.base.NEW_PROJECT'}})
        this.add({cls:PlatformOverview,module:'overview',title:I18n.resource.platform_app.base.OVERVIEW,block:'base',icon:'iconfont icon-icon-test7',attr:{i18n:'platform_app.base.OVERVIEW', permission: 'PlatformUser'}})
    }

    initBaseList(list) {
        var _this = this;
        this.delete('overview','base');
        var benchmarkOpt;
        var id = 1;
        var tempId = id;

        benchmarkOpt = [{
                name: I18n.resource.platform_app.benchmark.ENERGY_COST, //'能耗及费用'
                children: [
                    { template: 'Elec_Consumption', name: I18n.resource.platform_app.benchmark.ELECTRICITY_CONSUMPTION, point: [{ ptkey: 'Elec_Consumption', name: I18n.resource.platform_app.benchmark.ELECTRICITY_CONSUMPTION }] }, //'电耗'
                    { template: 'Water_Consumption', name: I18n.resource.platform_app.benchmark.WATER_CONSUMPTION, point: [{ ptkey: 'Water_Consumption', name: I18n.resource.platform_app.benchmark.WATER_CONSUMPTION }] }, //'水耗'
                    { template: 'Gas_Consumption', name: I18n.resource.platform_app.benchmark.GAS_CONSUMPTION, point: [{ ptkey: 'Gas_Consumption', name: I18n.resource.platform_app.benchmark.GAS_CONSUMPTION }] }, //'气耗'
                    { template: 'Elec_Consumption_UnitArea', name: I18n.resource.platform_app.benchmark.ELECTRICITY_METER, point: [{ ptkey: 'Elec_Consumption_UnitArea', name: I18n.resource.platform_app.benchmark.ELECTRICITY_METER }] }, //'单方电耗'
                    { template: 'Water_Consumption_UnitArea', name: I18n.resource.platform_app.benchmark.WATER_METER, point: [{ ptkey: 'Water_Consumption_UnitArea', name: I18n.resource.platform_app.benchmark.WATER_METER }] }, //'单方水耗'
                    { template: 'Gas_Consumption_UnitArea', name: I18n.resource.platform_app.benchmark.GAS_METER, point: [{ ptkey: 'Gas_Consumption_UnitArea', name: I18n.resource.platform_app.benchmark.GAS_METER }] }, //'单方气耗'
                    /*                        {name:'能源费用',point:[{ptkey:'',name:'电费'},{ptkey:'',name:'水费'},{ptkey:'',name:'气费'}]},
                                            {name:'单方能源费用',point:[{ptkey:'',name:'单方电费'},{ptkey:'',name:'单方水费'},{ptkey:'',name:'单方气费'}]}*/
                ]
            },
                {
                name: I18n.resource.platform_app.benchmark.EQUIPMENT_HEALTH, //'设备健康'
                template: 'entityHealth',
                children: [
                    // {name:'VAV健康率'},
                    { template: 'AHU_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.VAV, point: [{ ptkey: 'AHU_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.VAV }] }, //'AHU健康率'
                    { template: 'Chiller_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.CHILLER, point: [{ ptkey: 'Chiller_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.CHILLER }] }, //'冷机健康率'
                    { template: 'CHWP_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.CHWP, point: [{ ptkey: 'CHWP_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.CHWP }] }, //'冷冻泵健康率'
                    { template: 'CWP_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.CWP, point: [{ ptkey: 'CWP_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.CWP }] }, //'冷却泵健康率'
                    { template: 'CT_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.COOLING_TOWER, point: [{ ptkey: 'CT_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.COOLING_TOWER }] }, //'冷却塔健康率'
                    { template: 'Sensor_AHU_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.SENSOR, point: [{ ptkey: 'Sensor_AHU_Equipment_Health_Rate', name: I18n.resource.platform_app.benchmark.SENSOR }] } //'传感器健康率'
                ]
            },
            {
                name: I18n.resource.platform_app.benchmark.THERMAL_COMFORT, //'热舒适'
                children: [
                    { template: 'Overcool_Rate', name: I18n.resource.platform_app.benchmark.OVERCOOLING_RATE, point: [{ ptkey: 'Overcool_Rate', name: I18n.resource.platform_app.benchmark.OVERCOOLING_RATE }] }, //'过冷率'
                    { template: 'Overheat_Rate', name: I18n.resource.platform_app.benchmark.OVERHEATING_RATE, point: [{ ptkey: 'Overheat_Rate', name: I18n.resource.platform_app.benchmark.OVERHEATING_RATE }] } //'过热率'
                ]
            },
            {
                name: I18n.resource.platform_app.benchmark.OPERATION, //'设备参数'
                children: [
                    { template: 'ChilledPlant_COP', name: I18n.resource.platform_app.benchmark.CHILLER, point: [{ ptkey: 'ChilledPlant_COP', name: I18n.resource.platform_app.benchmark.CHILLER }] } //'空调冷热源COP均值'
                ]
            },
        ]
        this.add({
            id: id++,
            cls: GroupProjectOverview,
            icon: 'iconfont icon-overview',
            module: 'summary',
            attr: { permission: 'GroupUser' },
            title: I18n.resource.platform_app.base.GROUP_OVERVIEW,
            block: 'base',
            option: {
                option: [{
                        'type': 'analysis',
                        size: '',
                        'item': [
                            { name: '用电量', ptKey: 'Elec_Consumption',group:1 }, { name: '用水量', ptKey: 'Water_Consumption',group:1  }, { name: '用气量', ptKey: 'Gas_Consumption' ,group:1 }, { name: '碳排放', ptKey: 'CO2_Emission',group:1  },
                            { name: '单方用电量', ptKey: 'Elec_Consumption_UnitArea',group:2 ,real:true}, { name: '单方用水量', ptKey: 'Water_Consumption_UnitArea' ,group:2,real:true}, { name: '单方用气量', ptKey: 'Gas_Consumption_UnitArea' ,group:2,real:true}, { name: '单方碳排放', ptKey: 'CO2_Emission_UnitArea' ,group:2,real:true}
                        ]
                    },
                    {
                        'type': 'radar',
                        item: [
                            // {name:'VAV',ptKey:'Overcool_Rate'},
                            { name: '冷却塔', ptKey: 'CT_Equipment_Health_Rate', name_i18n: 'COOLING_TOWER' },
                            { name: '冷机', ptKey: 'Chiller_Equipment_Health_Rate', name_i18n: 'CHILLER' },
                            { name: '冷冻泵', ptKey: 'CHWP_Equipment_Health_Rate', name_i18n: 'CHWP' },
                            { name: '冷却泵', ptKey: 'CWP_Equipment_Health_Rate', name_i18n: 'COOLING_PUMP' },
                            { name: '传感器', ptKey: 'Sensor_AHU_Equipment_Health_Rate', name_i18n: 'SENSOR' },
                            { name: 'AHU', ptKey: 'AHU_Equipment_Health_Rate', name_i18n: 'AHU' },


                        ]
                    },
                    {
                        'type': 'rank',
                        'item': [
                            { name: '过冷率', ptKey: 'Overcool_Rate', desc: '根据安装传感器统计有多少节点温度低于设定值', name_i18n: 'OVERCOOLING', desc_i18n: 'OVERCOOLING_DETAIL' },
                            { name: '过热率', ptKey: 'Overheat_Rate', desc: '根据安装传感器统计有多少节点温度高于设定值', name_i18n: 'OVERHEAT', desc_i18n: 'OVERHEAT_DETAIL' },
                            { name: '设备健康率', ptKey: 'Equipment_Health_Rate', desc: '根据检测到故障来判断统计传感器、AHU、VAV等各项设备', name_i18n: 'EQUIOMENT', desc_i18n: 'EQUIOMENT_DETAIL' },
                            { name: '空调COP', ptKey: 'ChilledPlant_COP', desc: '根据项目机房的月制冷量和月耗电量计算出项目冷源月平均COP', name_i18n: 'PLANT_COP', desc_i18n: 'PLANT_COP_DETAIL' },
                            { name: '功率因数', ptKey: 'Power_Factor', desc: '项目月平均功率因数', name_i18n: 'POWER_FACTOR', desc_i18n: 'POWER_FACTOR_DETAIL' },
                            { name: 'PM2.5超标次数', ptKey: 'PM2.5_Overproof_Number', desc: '统计室内PM2.5的超标次数', name_i18n: 'PM25', desc_i18n: 'PM25_DETAIL' }
                        ]
                    },
                    { 'type': 'map' }
                ]
            }
        })

        tempId = id++;
        this.add({ id: tempId, isParent: true, icon: 'iconfont icon-zuoduiqi', title: I18n.resource.platform_app.benchmark.BENCHMARKING, block: 'base', attr: { i18n: 'platform_app.base.OVERVIEW', permission: 'GroupUser' } })
        setBenchmarkForEachManagement(benchmarkOpt, tempId)

        function setBenchmarkForEachManagement(opt, parent) {
            opt.forEach(function(item) {
                setBenchmarkModule(item, parent)
            }.bind(this))
        }

        function setBenchmarkModule(module, parent) {
            var moduleOpt = {};
            if (!module.children || module.children.length == 0) {
                moduleOpt = { id: id++, module: 'standard', cls: PlatformStandard, title: module.name, block: 'base', template: module.template, option: { option: module } }
                if (parent) moduleOpt.parent = parent;
                _this.add(moduleOpt)
            } else {
                moduleOpt = { id: id++, module: 'standard_parent', title: module.name, block: 'base' }
                if (parent) moduleOpt.parent = parent;
                _this.add(moduleOpt)
                module.children.forEach(function(item) {
                    setBenchmarkModule(item, moduleOpt.id)
                })
            }
        }
        this.add({ cls: PlatformOverview, module: 'overview', title: I18n.resource.platform_app.base.OVERVIEW, block: 'base', icon: 'iconfont icon-icon-test7', attr: { i18n: 'platform_app.base.OVERVIEW', permission: 'PlatformUser' } })
    }

    initGroupProjectList_bak(list) {
        var _this = this;
        this.delete('overview', 'base');
        var benchmarkOpt;
        var id = 1;
        var tempId = id;

        benchmarkOpt = [{
                    name:I18n.resource.platform_app.benchmark.ENERGY_COST,//'能耗及费用'
                    children:[
                        {template:'Elec_Consumption',name:I18n.resource.platform_app.benchmark.ELECTRICITY_CONSUMPTION,point:[{ptkey:'Elec_Consumption',name:I18n.resource.platform_app.benchmark.ELECTRICITY_CONSUMPTION}]},//'电耗'
                        {template:'Water_Consumption',name:I18n.resource.platform_app.benchmark.WATER_CONSUMPTION,point:[{ptkey:'Water_Consumption',name:I18n.resource.platform_app.benchmark.WATER_CONSUMPTION}]},//'水耗'
                        {template:'Gas_Consumption',name:I18n.resource.platform_app.benchmark.GAS_CONSUMPTION,point:[{ptkey:'Gas_Consumption',name:I18n.resource.platform_app.benchmark.GAS_CONSUMPTION}]},//'气耗'
                        {template:'Elec_Consumption_UnitArea',name:I18n.resource.platform_app.benchmark.ELECTRICITY_METER,point:[{ptkey:'Elec_Consumption_UnitArea',name:I18n.resource.platform_app.benchmark.ELECTRICITY_METER}]},//'单方电耗'
                        {template:'Water_Consumption_UnitArea',name:I18n.resource.platform_app.benchmark.WATER_METER,point:[{ptkey:'Water_Consumption_UnitArea',name:I18n.resource.platform_app.benchmark.WATER_METER}]},//'单方水耗'
                        {template:'Gas_Consumption_UnitArea',name:I18n.resource.platform_app.benchmark.GAS_METER,point:[{ptkey:'Gas_Consumption_UnitArea',name:I18n.resource.platform_app.benchmark.GAS_METER}]},//'单方气耗'
        /*                        {name:'能源费用',point:[{ptkey:'',name:'电费'},{ptkey:'',name:'水费'},{ptkey:'',name:'气费'}]},
                                {name:'单方能源费用',point:[{ptkey:'',name:'单方电费'},{ptkey:'',name:'单方水费'},{ptkey:'',name:'单方气费'}]}*/
                            ]
                },
                {
                    name:I18n.resource.platform_app.benchmark.EQUIPMENT_HEALTH,//'设备健康'
                    template:'entityHealth',
                    children:[
                        // {name:'VAV健康率'},
                        {template:'AHU_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.VAV,point:[{ptkey:'AHU_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.VAV}]},//'AHU健康率'
                        {template:'Chiller_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.CHILLER,point:[{ptkey:'Chiller_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.CHILLER}]},//'冷机健康率'
                        {template:'CHWP_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.CHWP,point:[{ptkey:'CHWP_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.CHWP}]},//'冷冻泵健康率'
                        {template:'CWP_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.CWP,point:[{ptkey:'CWP_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.CWP}]},//'冷却泵健康率'
                        {template:'CT_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.COOLING_TOWER,point:[{ptkey:'CT_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.COOLING_TOWER}]},//'冷却塔健康率'
                        {template:'Sensor_AHU_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.SENSOR,point:[{ptkey:'Sensor_AHU_Equipment_Health_Rate',name:I18n.resource.platform_app.benchmark.SENSOR}]}//'传感器健康率'
                    ]
                },
                {
                    name:I18n.resource.platform_app.benchmark.THERMAL_COMFORT,//'热舒适'
                    children:[
                        {template:'Overcool_Rate',name:I18n.resource.platform_app.benchmark.OVERCOOLING_RATE,point:[{ptkey:'Overcool_Rate',name:I18n.resource.platform_app.benchmark.OVERCOOLING_RATE}]},//'过冷率'
                        {template:'Overheat_Rate',name:I18n.resource.platform_app.benchmark.OVERHEATING_RATE,point:[{ptkey:'Overheat_Rate',name:I18n.resource.platform_app.benchmark.OVERHEATING_RATE}]}//'过热率'
                    ]
                },
                {
                    name:I18n.resource.platform_app.benchmark.OPERATION,//'设备参数'
                    children:[
                        {template:'ChilledPlant_COP',name:I18n.resource.platform_app.benchmark.CHILLER,point:[{ptkey:'ChilledPlant_COP',name:I18n.resource.platform_app.benchmark.CHILLER}]}//'空调冷热源COP均值'
                    ]
                },
            ]
        if (list.length > 1){
            tempId = id++;
            this.add({icon:'iconfont icon-overview',id:tempId,module:'summary_parent',title:I18n.resource.platform_app.base.GROUP_OVERVIEW, attr:{permission: 'GroupUser'}, block:'base',option:{}})
            var tempId2 = id++;
            this.add({id:tempId2,isParent:true,parent:'',icon:'iconfont icon-zuoduiqi',title:I18n.resource.platform_app.benchmark.BENCHMARKING,block:'base',attr:{i18n:'platform_app.base.OVERVIEW', permission: 'GroupUser'}})
            list.forEach(function(item,index){
                this.add({
                    cls: GroupProjectOverview,
                    parent: tempId,
                    icon: 'iconfont icon-overview',
                    module: 'summary',
                    id: id++,
                    title: (AppConfig.language == 'zh' ? item.name_cn : item.name_en),
                    block: 'base',
                option:{
                        option: [{
                                'type': 'analysis',
                                size: '',
                                'item': [
                                    {name:'用电量',ptKey:'Elec_Consumption'},{name:'用水量',ptKey:'Water_Consumption'},{name:'用气量',ptKey:'Gas_Consumption'},{name:'碳排放',ptKey:'CO2_Emission'}
                            ]
                            },
                            {
                                'type': 'radar',
                                item: [
                                    // {name:'VAV',ptKey:'Overcool_Rate'},
                                    {name:'冷却塔',ptKey:'CT_Equipment_Health_Rate',name_i18n:'COOLING_TOWER'},
                                    {name:'冷机',ptKey:'Chiller_Equipment_Health_Rate',name_i18n:'CHILLER'},
                                    {name:'冷冻泵',ptKey:'CHWP_Equipment_Health_Rate',name_i18n:'CHWP'},
                                    {name:'冷却泵',ptKey:'CWP_Equipment_Health_Rate',name_i18n:'COOLING_PUMP'},
                                    {name:'传感器',ptKey:'Sensor_AHU_Equipment_Health_Rate',name_i18n:'SENSOR'},
                                    {name:'AHU',ptKey:'AHU_Equipment_Health_Rate',name_i18n:'AHU'},
                                    
                                    
                                ]
                            },
                            
                            {
                                'type': 'rank',
                                'item': [
                                {name:'过冷率',ptKey:'Overcool_Rate',desc:'根据安装传感器统计有多少节点温度低于设定值',name_i18n:'OVERCOOLING',desc_i18n:'OVERCOOLING_DETAIL'},
                                {name:'过热率',ptKey:'Overheat_Rate',desc:'根据安装传感器统计有多少节点温度高于设定值',name_i18n:'OVERHEAT',desc_i18n:'OVERHEAT_DETAIL'},
                                {name:'设备健康率',ptKey:'Equipment_Health_Rate',desc:'根据检测到故障来判断统计传感器、AHU、VAV等各项设备',name_i18n:'EQUIOMENT',desc_i18n:'EQUIOMENT_DETAIL'},
                                {name:'空调COP',ptKey:'ChilledPlant_COP',desc:'根据项目机房的月制冷量和月耗电量计算出项目冷源月平均COP',name_i18n:'PLANT_COP',desc_i18n:'PLANT_COP_DETAIL'},
                                {name:'功率因数',ptKey:'Power_Factor',desc:'项目月平均功率因数',name_i18n:'POWER_FACTOR',desc_i18n:'POWER_FACTOR_DETAIL'},
                                {name:'PM2.5超标次数',ptKey:'PM2.5_Overproof_Number',desc:'统计室内PM2.5的超标次数',name_i18n:'PM25',desc_i18n:'PM25_DETAIL'}]},
							{'type':'map'}                        ],
                        projectGrpId: item.id,
                        projectGrp: item
                    }
                })
                this.add({id:id++,isParent:true,parent:tempId2,icon:'iconfont icon-zuoduiqi',title:(AppConfig.language == 'zh'?item.name_cn:item.name_en),block:'base',attr:{i18n:'platform_app.base.OVERVIEW', permission: 'GroupUser'}})
                setBenchmarkForEachManagement(benchmarkOpt,item,id-1)
            }.bind(this))
        }else{
            this.add({
                id: id++,
                cls: GroupProjectOverview,
                icon: 'iconfont icon-overview',
                module: 'summary',
                attr: { permission: 'GroupUser' },
                title: I18n.resource.platform_app.base.GROUP_OVERVIEW,
                block: 'base',
                option: {
                    option: [{
                            'type': 'analysis',
                            size: '',
                            'item': [
                                    {name:'用电量',ptKey:'Elec_Consumption'},{name:'用水量',ptKey:'Water_Consumption'},{name:'用气量',ptKey:'Gas_Consumption'},{name:'碳排放',ptKey:'CO2_Emission'}
                            ]
                            },
                        {
                            'type': 'radar',
                            item: [
                                    // {name:'VAV',ptKey:'Overcool_Rate'},
                                    {name:'冷却塔',ptKey:'CT_Equipment_Health_Rate',name_i18n:'COOLING_TOWER'},
                                    {name:'冷机',ptKey:'Chiller_Equipment_Health_Rate',name_i18n:'CHILLER'},
                                    {name:'冷冻泵',ptKey:'CHWP_Equipment_Health_Rate',name_i18n:'CHWP'},
                                    {name:'冷却泵',ptKey:'CWP_Equipment_Health_Rate',name_i18n:'COOLING_PUMP'},
                                    {name:'传感器',ptKey:'Sensor_AHU_Equipment_Health_Rate',name_i18n:'SENSOR'},
                                    {name:'AHU',ptKey:'AHU_Equipment_Health_Rate',name_i18n:'AHU'},
                                    
                                    
                                ]
                            },
                            {'type':'map'},
                        {
                            'type': 'rank',
                            'item': [
                                {name:'过冷率',ptKey:'Overcool_Rate',desc:'根据安装传感器统计有多少节点温度低于设定值',name_i18n:'OVERCOOLING',desc_i18n:'OVERCOOLING_DETAIL'},
                                {name:'过热率',ptKey:'Overheat_Rate',desc:'根据安装传感器统计有多少节点温度高于设定值',name_i18n:'OVERHEAT',desc_i18n:'OVERHEAT_DETAIL'},
                                {name:'设备健康率',ptKey:'Equipment_Health_Rate',desc:'根据检测到故障来判断统计传感器、AHU、VAV等各项设备',name_i18n:'EQUIOMENT',desc_i18n:'EQUIOMENT_DETAIL'},
                                {name:'空调COP',ptKey:'ChilledPlant_COP',desc:'根据项目机房的月制冷量和月耗电量计算出项目冷源月平均COP',name_i18n:'PLANT_COP',desc_i18n:'PLANT_COP_DETAIL'},
                                {name:'功率因数',ptKey:'Power_Factor',desc:'项目月平均功率因数',name_i18n:'POWER_FACTOR',desc_i18n:'POWER_FACTOR_DETAIL'},
                                { name: 'PM2.5超标次数', ptKey: 'PM2.5_Overproof_Number', desc: '统计室内PM2.5的超标次数', name_i18n: 'PM25', desc_i18n: 'PM25_DETAIL' }
                            ]
                        }
                        ],
                    projectGrpId: list[0].id,
                    projectGrp: list[0]
            }
        })
            
            tempId = id++;
            this.add({id:tempId,isParent:true,icon:'iconfont icon-zuoduiqi',title:I18n.resource.platform_app.benchmark.BENCHMARKING,block:'base',attr:{i18n:'platform_app.base.OVERVIEW', permission: 'GroupUser'}})
            setBenchmarkForEachManagement(benchmarkOpt,list[0],tempId)
        }

        function setBenchmarkForEachManagement(opt,management,parent){
            opt.forEach(function(item){
                setBenchmarkModule(item,parent,management)
            }.bind(this))
        }

        function setBenchmarkModule(module,parent,option){
            var moduleOpt = {};
            if (!module.children || module.children.length == 0){
                moduleOpt = {id:id++,module:'standard',cls:PlatformStandard,title:module.name,block:'base',template:module.template,option:{option:module,projectGrpId:option.id,projectGrp:option}}
                if(parent)moduleOpt.parent = parent;
                _this.add(moduleOpt)
            }else{
                moduleOpt = {id:id++,module:'standard_parent',title:module.name,block:'base',option:option}
                if(parent)moduleOpt.parent = parent;
                _this.add(moduleOpt)
                module.children.forEach(function(item){
                    setBenchmarkModule(item,moduleOpt.id,option)
                })
            }
        }  
        this.add({cls:PlatformOverview,module:'overview',title:I18n.resource.platform_app.base.OVERVIEW,block:'base',icon:'iconfont icon-icon-test7',attr:{i18n:'platform_app.base.OVERVIEW', permission: 'PlatformUser'}})     
    }
    //初始化项目列表
    initProjectList(){

    }
    //初始化菜单条目
    initMenuList(){
        var _this = this;
        var userId = AppConfig.userId;
        var projectId = AppConfig.projectId;
        var observerId;
        return WebAPI.get('/get_plant_pagedetails/'+ projectId +'/' + userId +'/' +AppConfig.language).done((list)=>{
            var menuList = list.navItems;
            AppConfig.navItems = menuList;
            this.list = this.list.filter(function(item){
                return item.block != 'menu';
            })
            // this.add({
            //     cls:PlatformGuide,
            //     module:'config',
            //     title:'Config',
            //     block:'menu',
            //     option:{}
            // })
            // this.add({
            //     cls:PlatformCopy,
            //     module:'maintain',
            //     title:'Maintain',
            //     block:'menu',
            //     option:{}
            // })
            AppConfig.menu = {};
            list.navItems.map(function(item){
                var moduleOption = {
                    cls:_this.getMenuListCls(item.type),
                    icon:_this.getMenuListIcon(item),
                    module:item.type,
                    title:item.text,
                    block:'menu',
                    id:item.id,
                    option:item
                }
                if(item.type == 'ObserverScreen'){
                    moduleOption.module = 'dropDownList';
                    observerId = item.id;
                    moduleOption.cls = undefined;
                }
                if(item.parent){
                    moduleOption.parent = item.parent;
                }
                if (['ReportScreen','EnergyScreen','EnergyScreen_M'].indexOf(item.type) > -1){
                    AppConfig.menu[item.id] = item.text;
                }
                if (['FacReportScreen','FacReportWrapScreen'].indexOf(item.type)> -1){
                    moduleOption.embed = 'iframe',
                    moduleOption.option.src='/factory/preview/reportWrap/'+ item.id +'/1'
                }
                if (!moduleOption.cls)delete moduleOption.cls
                return moduleOption
            }).forEach((item)=>{
                this.add(item)
            });
            //list.observerPages = [{"groupid":1,"height":955,"id":0,"name":"双工况冰蓄冷系统","type":"fullscreen","url":"report","width":1920},{"groupid":1,"height":955,"id":10000001,"name":"江水源及锅炉系统","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001016,"name":"PAU-6JF-1","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001017,"name":"PAU-6JF-2","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001018,"name":"PAU-6JF-3","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001019,"name":"PAU-6JF-4","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001020,"name":"PAU-6JF-5","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001021,"name":"PAU-6JF-6","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001022,"name":"PAU-5F-1","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001023,"name":"PAU-5F-2","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001024,"name":"PAU-5F-3","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001025,"name":"PAU-5F-4","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001026,"name":"PAU-5F-5","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001027,"name":"PAU-5F-6","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001028,"name":"PAU-5F-7","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":70000020,"name":"PAU-5F-8","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001029,"name":"PAU-3F-1","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001030,"name":"PAU-3F-2","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001031,"name":"PAU-3F-3","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001032,"name":"PAU-3F-4","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001033,"name":"PAU-3F-5","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001034,"name":"PAU-3F-6","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001035,"name":"PAU-3F-7","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001036,"name":"PAU-3F-8","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001037,"name":"PAU-3F-9","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001038,"name":"PAU-3F-10","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001039,"name":"PAU-3F-11","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001040,"name":"PAU-3F-12","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001041,"name":"PAU-3F-13","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001042,"name":"PAU-3F-14","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001043,"name":"PAU-3F-15","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001044,"name":"PAU-3F-16","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001045,"name":"PAU-1F-1","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001046,"name":"PAU-1F-2","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001047,"name":"PAU-1F-3","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001048,"name":"PAU-1F-4","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001049,"name":"PAU-1F-5","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001050,"name":"PAU-1F-6","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001051,"name":"PAU-1F-7","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001052,"name":"PAU-1F-8","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001053,"name":"PAU-1F-9","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001054,"name":"PAU-B1F-1","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001055,"name":"PAU-B1F-2","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001056,"name":"PAU-B1F-3","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001057,"name":"PAU-B1F-4","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001058,"name":"PAU-B1F-5","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001059,"name":"PAU-B1F-6","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001061,"name":"PAU-B1F-7","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001062,"name":"PAU-B1F-8","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001063,"name":"PAU-B1F-9","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001060,"name":"PAU-B1F-10","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001064,"name":"PAU-B2F-1","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001069,"name":"PAU-B2F-2","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001070,"name":"PAU-B2F-3","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001067,"name":"PAU-B2F-4","type":"fullscreen","url":"report","width":1920},{"groupid":3,"height":955,"id":1560001068,"name":"PAU-B2F-5","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":450000280,"name":"AHU-6JF-1","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000975,"name":"AHU-6JF-2","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000976,"name":"AHU-6JF-3","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000977,"name":"AHU-6JF-4","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000978,"name":"AHU-6JF-5","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000979,"name":"AHU-6JF-6","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000993,"name":"AHU-6JF-6-2","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000980,"name":"AHU-6JF-7","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001000,"name":"AHU-6JF-8","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000981,"name":"AHU-6JF-9","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000982,"name":"AHU-6JF-10","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000983,"name":"AHU-6JF-11","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000984,"name":"AHU-6JF-12","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000985,"name":"AHU-6JF-13","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000986,"name":"AHU-6JF-14","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000987,"name":"AHU-6JF-15","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000988,"name":"AHU-6JF-16","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000989,"name":"AHU-6JF-17","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000990,"name":"AHU-6JF-18","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000991,"name":"AHU-6JF-19","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560000992,"name":"AHU-6JF-20","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1100000693,"name":"AHU-2F-1","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1515036433,"name":"AHU-2F-2","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":-1209929851,"name":"AHU-2F-3","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":-54964579,"name":"AHU-2F-4","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001012,"name":"AHU-2F-5","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":-1624965591,"name":"AHU-2F-6","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001013,"name":"AHU-2F-7","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":470000287,"name":"AHU-B1F-1","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001001,"name":"AHU-B1F-2","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001002,"name":"AHU-B1F-3","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001003,"name":"AHU-B1F-4","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001004,"name":"AHU-B1F-5","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001005,"name":"AHU-B1F-6","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":140000117,"name":"AHU-B1F-7","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001015,"name":"AHU-B1F-8","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001006,"name":"AHU-B1F-9","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001007,"name":"AHU-B1F-10-1","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001008,"name":"AHU-B1F-11","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001009,"name":"AHU-B1F-12","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001010,"name":"AHU-B1F-13","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":1560001011,"name":"AHU-B1F-14","type":"fullscreen","url":"report","width":1920},{"groupid":4,"height":955,"id":160000124,"name":"AHU-B1F-15","type":"fullscreen","url":"report","width":1920},{"groupid":10,"height":955,"id":1560001091,"name":"地下二层平面图","type":"fullscreen","url":"report","width":1920},{"groupid":10,"height":955,"id":1560001092,"name":"地下一层平面图","type":"fullscreen","url":"report","width":1920},{"groupid":10,"height":955,"id":1560001093,"name":"一层平面图","type":"fullscreen","url":"report","width":1920},{"groupid":10,"height":955,"id":1560001094,"name":"二层平面图","type":"fullscreen","url":"report","width":1920},{"groupid":10,"height":955,"id":1560001095,"name":"三层平面图","type":"fullscreen","url":"report","width":1920},{"groupid":10,"height":955,"id":1560001096,"name":"五层平面图","type":"fullscreen","url":"report","width":1920},{"groupid":10,"height":955,"id":1560001098,"name":"六层机房平面图","type":"fullscreen","url":"report","width":1920}]
            //list.groupInfo= [{"id":1,"name":"系统概况","u1":"1"},{"id":2,"name":"江水源泵操作界面","u1":"2"},{"id":3,"name":"PAU","u1":"7"},{"id":4,"name":"AHU","u1":"8"},{"id":6,"name":"江水源主机操作界面","u1":"3"},{"id":7,"name":"双工况主机操作界面","u1":"4"},{"id":8,"name":"乙二醇泵操作界面","u1":"5"},{"id":9,"name":"冷冻泵操作界面","u1":"6"},{"id":10,"name":"平面图","u1":"9"}];            
            if(list.groupInfo.length > 0 && observerId){
                list.groupInfo.map(item =>{
                    var groupOption = {
                        cls: _this.getMenuListCls('dropDownList'),
                        module: 'dropDownList',
                        title: item.name,
                        block: 'menu',
                        id: 'obGrpPage_' + item.id,
                        option: item,
                        parent: observerId
                    }
                    return groupOption;
                }).forEach((item)=>{
                    this.add(item);
                });
            }            
            if(list.observerPages.length > 0 && observerId){
                list.observerPages.map(item =>{
                    var observerOption = {
                        cls: _this.getMenuListCls('observer'),
                        module: 'ObserverScreen',
                        title: item.name,
                        block: 'menu',
                        id: item.id,
                        option: item
                    }
                    if(item.groupid){
                        observerOption.parent = 'obGrpPage_' + item.groupid;
                    }
                    return observerOption
                }).forEach((item)=>{
                    this.add(item)
                });
            }


            // this.add({
            //     cls: PlatformGuide,
            //     module: 'config',
            //     attr: { permission: 'PlatformUser' },
            //     title: I18n.resource.platform_app.menu.CONFIG,
            //     block: 'menu',
            //     icon: 'iconfont icon-icon-test7',
            //     option: {
            //         i18n: 'platform_app.menu.CONFIG'
            //     }
            // })
            this.add({
                cls:PlatformOverview,
                module:'maintain',
                attr: {permission: 'PlatformUser'},
                title:I18n.resource.platform_app.menu.MAINTAIN,
                block:'menu',
                icon:'iconfont icon-portal-icon-gailan',
                option:{
                    i18n:'platform_app.menu.MAINTAIN'
                }
            })
            if(AppConfig.projectCurrent && AppConfig.projectCurrent.i18n){
                this.add({
                    cls:PlatformLanguageConfig,
                    module:'language',
                    title:I18n.resource.platform_app.menu.LANGUAGE,
                    block:'menu',
                    icon:'iconfont icon-zidongshibie',
                    option:{
                        i18n:'platform_app.menu.MAINTAIN'
                    }
                }) 
            }
            // this.add({
            //     cls:ProjectCreate,
            //     module:'edit',
            //     //attr: {permission: 'PlatformUser'},
            //     title:I18n.resource.platform_app.menu.EDIT_PROJECT,
            //     block:'menu',
            //     icon:'iconfont icon-bianji1'
            // })
        })
    }
    add(module){
        this.list.push(module)
    }
    delete(module,block){
        for (var i = 0; i < this.list.length ;i++){
            if ((this.list[i].block == block || !block) && (this.list[i].module == module || this.list[i].id == module)){
                this.list.splice(i,1)
            }
        }
    }
    getModuleList(block){
        return this.list.filter(function(item){return item.block == block})
    }
    getMenuListCls(moduleType){
        var screen;
        switch (moduleType){
            case 'ObserverScreen':
            case 'observer':
                screen = ObserverScreen;
                break;
            case 'DiagnosisScreen':
            case 'diagnosis':
                screen = DiagnosisScreen;
                break;
            case 'AnalysisScreen':
            case 'analysis':
                screen = AnalysisScreen;
                break;
            case 'ReportScreen':
            case 'report':
                screen = ReportScreen;
                break;
            case 'WorkflowMine':
            case 'workFlow':
                screen = WorkflowMine;
                break;
            case 'EnergyScreen':
            case 'EnergyScreen_M':
            case 'energy':
                screen = EnergyScreen;
                break;
            case 'DataCenter3D':
                screen = DataCenter3D;
                break;
            case 'DropDownList':
            case 'dropDownList':
                screen = undefined;
                break;
            case 'PageScreen':
                screen = namespace('observer.screens.PageScreen');
                break;
            // case 'FacReportScreen':
            //     screen = namespace('observer.screens.FacReportScreen');
            //     break;
            // case 'FacReportWrapScreen':
            //     screen = namespace('observer.screens.FacReportWrapScreen');
            //     break;
            case 'BenchmarkScreen':
                screen = BenchmarkScreen;
                break;
            // case 'fullscreen':
            //     screen = namespace('observer.screens.ObserverScreen');
            default:
                break;
        }
        return screen;
    }
    toggle(moduleOption){
        this.curModuleOpt = moduleOption;
        if (moduleOption.embed == 'iframe'){
            this.toggleMenuModule(moduleOption)
        // }else if(!moduleOption.isParent){
        }else {
            switch (moduleOption.block){
                case 'menu':
                    this.toggleMenuModule(moduleOption);
                    break;
                case 'function':
                case 'project-function':
                    this.toggleFunctionModule(moduleOption);
                    break;
                case 'base':
                    this.toggleBaseModule(moduleOption);
                    break;
            }
        }
    }
    toggleMenuModule(moduleOption){
        var pageId = moduleOption.id;
        if (moduleOption.module === 'ReportScreen') {
            Router.goTo({
                page: 'ReportScreen',
                reportId: pageId,
                reportType: moduleOption.option.reportType,
                reportFolder: moduleOption.option.reportFolder,
                reportText: moduleOption.option.text
            });
        } else if (moduleOption.module == 'EnergyScreen_M') {
            Router.show(moduleOption.cls, pageId, null, null, null, true);
        } else if ([namespace('observer.screens.PageScreen'),
                namespace('observer.screens.FacReportScreen'),
                namespace('observer.screens.FacReportWrapScreen')
            ].indexOf(moduleOption.cls) > -1) {
            Router.show(moduleOption.cls, {
                id: pageId
            }, 'indexMain');
        } else if (pageId){
            // Router.goTo({
            //     page: moduleOption.module,
            //     id: pageId
            // });
            if(moduleOption.module == 'FacReportWrapScreen'){
                Router.show(namespace('observer.screens.FacReportWrapScreen'),{id: pageId},'indexMain')
            } else { Router.show(moduleOption.cls, pageId) };
        }else{
            // ScreenCurrent = new moduleOption.cls(AppConfig.projectId)
            // ScreenCurrent.show();
            Router.show( moduleOption.cls,AppConfig.projectId);
        }
        if(pageId){
            this.saveSessionStorage(pageId);
        }
    }
    saveSessionStorage(pageId) {
        if (AppConfig.projectCurrent.i18n == 1) {
            for (var i = 0; i < AppConfig.navItems.length; i++) {
                if (AppConfig.navItems[i].id == pageId) {
                    sessionStorage.setItem("nav_i18n_name", AppConfig.navItems[i].text);
                    break;
                }
            }
        }
    }
    toggleFunctionModule(moduleOption){
        if (moduleOption.hash){
            // location.hash = moduleOption.hash;
            Router.pageHash = moduleOption.hash;
            Router.screenChange();
        }
        if (moduleOption.href){
            window.open(location.origin + moduleOption.href);
        }
        moduleOption.init && moduleOption.init();
        moduleOption.cls && Router.show(moduleOption.cls);

        this.app.nav.hideFunctionNav();
    }
    toggleBaseModule(moduleOption){
        if(['summary','standard'].indexOf(moduleOption.module) > - 1){
            let args = [moduleOption.cls,moduleOption.option.projectGrpId]
            if (moduleOption.module == 'standard')args.push(moduleOption.template)
            Router.show(...args)
        }else{
            Router.show(moduleOption.cls,moduleOption.id?moduleOption.id:moduleOption.module)
        }
        // Router.show(moduleOption.cls,this.app,moduleOption.option)
        // ScreenCurrent = new moduleOption.cls(this.app,moduleOption.option)
        // ScreenCurrent.show(this.app,moduleOption.option);
    }
    toggleIframe(moduleOption){
        var iframe = document.createElement('iframe');
        iframe.src = moduleOption.option.src;
        iframe.style.height="100%";
        iframe.style.width="100%";
        iframe.style.border='none';
        ElScreenContainer.innerHTML = '';
        ElScreenContainer.appendChild(iframe)
        if (moduleOption.option && moduleOption.option.type == 'FacReportWrapScreen' || moduleOption.option.type == 'FacReportScreen'){
            iframe.onload = function(){
                var style = document.createElement('style');
                style.innerHTML = `
                    body>.nav{
                        display:none;
                    }
                    #pageContainer {
                        top:0 !important;
                    }
                `
                iframe.contentDocument.body.appendChild(style)
            }
        }
    }
    getModule(target,block){
        var moduleOption = ModuleIOC.getModuleById(target,block)
        if (!moduleOption)moduleOption = ModuleIOC.getModuleByName(target,block)
        if(!moduleOption)return false;
        return moduleOption;
    }
    getModuleByName(name,block){
        return this.getModuleByParam('module',name,block);
    }
    getModuleById(id,block){
        return this.getModuleByParam('id',id,block);
    }
    getModuleByParam(key,value,block){
        var list = [];
        if (!block){
            list = this.list;
        }else{
            list = this.list.filter(function(item){
                return item.block == block
            })
        }
        var arrKey = key.split('.')
        for (var i = 0; i < list.length; i++){
            let level = 0;
            let obj = list[i][arrKey[level]]
            while (obj && level < arrKey.length-1){
                obj = obj[arrKey[++level]]
            }
            if (obj == value){
                return list[i]
            }
        }
        return false;
    }
    getModuleByMultiParam(param,block){
        var list = [];
        param = param || {};
        // if (block){
        //     param.block = block;
        // }
        list = this.list.filter(function(item){
            if (block && item.block != block)return false;
            let keys = Object.keys(param);
            for (let i = 0; i < keys.length ;i++){
                let arrKey = keys[i].split('.')
                let level = 0;
                let obj = item[arrKey[level]]
                while (obj && level < arrKey.length-1){
                    obj = obj[arrKey[++level]]
                }
                if (obj != param[keys[i]]){
                    return false;
                }
            }
            return true;
        })

        return list;
    }
    getProjectById(id){
        for (var i = 0; i < AppConfig.projectList.length ;i++){
            if (AppConfig.projectList[i].id == id){
                return AppConfig.projectList[i]
            }
        }
        return false;
    }
    getMenuListIcon(navItem){
        var strIconTpl = '<span class="icon"><%icon%></span>';
        // var svgTpl  = '<img class="icon fromSvg" src="<%icon%>" onerror="this.style.display=\'none\'"/>'
        var svgTpl ='<span class="icon fromFont  iconfont <%icon%>"></span>'
        var fontTpl = '<img class="icon fromSvg" src="<%icon%>" onerror="this.style.display=\'none\'"/><span class="icon fromFont glyphicon glyphicon-<%icon%>"></span>'

        var dropDownItems = [];
        AppConfig.menu = {};

        if (!navItem) return;
        var systemSkin = AppConfig.userConfig.skin;
        if (!systemSkin || systemSkin == null || systemSkin == undefined) {
            systemSkin = 'default';
        }
        // var imgMenuPicDefault = {
        //     ObserverScreen: '/static/images/menu/Observer-' + systemSkin + '.svg',
        //     DiagnosisScreen: '/static/images/menu/Diagnosis-' + systemSkin + '.svg',
        //     AnalysisScreen: '/static/images/menu/Analysis-' + systemSkin + '.svg',
        //     ReportScreen: '/static/images/menu/Report-' + systemSkin + '.svg',
        //     EnergyScreen: '/static/images/menu/Energy-' + systemSkin + '.svg',
        //     DropDownList: '/static/images/menu/Energy-' + systemSkin + '.svg',
        //     WorkflowMine: '/static/images/menu/Report- ' + systemSkin + '.svg',
        //     defaultMenuPic: '/static/images/menu/Analysis-' + systemSkin + '.svg',
        //     PageScreen: '/static/images/menu/Energy-' + systemSkin + '.svg',
        //     FacReportScreen: '/static/images/menu/Energy-' + systemSkin + '.svg',
        //     FacReportWrapScreen: '/static/images/menu/Energy-' + systemSkin + '.svg',
        //     BenchmarkScreen: '/static/images/menu/Energy-' + systemSkin + '.svg',
        //     default:'/static/images/menu/Observer-' + systemSkin + '.svg'
        // };
        // var imgMenuPicDefault = {
        //     ObserverScreen: 'iconfont icon-ObserverScreen1',
        //     DiagnosisScreen: 'iconfont icon-DiagnosisScreen1',
        //     AnalysisScreen: 'iconfont icon-AnalysisScreen1',
        //     ReportScreen: 'iconfont icon-ReportScreen2',
        //     EnergyScreen: 'iconfont icon-EnergyScreen1',
        //     EnergyScreen_M: 'iconfont icon-EnergyScreen1',
        //     DropDownList: 'iconfont icon-DropDownList1',
        //     WorkflowMine: 'iconfont icon-WorkflowMine1',
        //     defaultMenuPic: 'iconfont icon-default1',
        //     PageScreen: 'iconfont icon-ObserverScreen1',
        //     FacReportScreen: 'iconfont icon-ReportScreen2',
        //     FacReportWrapScreen: 'iconfont icon-ReportScreen2',
        //     BenchmarkScreen: 'iconfont icon-BenchmarkScreen1',
        //     default:'iconfont icon-default1'
        // };
        var imgMenuPicDefault = {
            ObserverScreen: 'iconfont icon-nav_monitor',
            DiagnosisScreen: 'iconfont icon-nav_diagnosis',
            AnalysisScreen: 'iconfont icon-nav_data_analysis',
            ReportScreen: 'iconfont icon-nav_report',
            EnergyScreen: 'iconfont icon-nav_dashboard',
            EnergyScreen_M: 'iconfont icon-nav_dashboard',
            DropDownList: 'iconfont icon-nav_other',
            WorkflowMine: 'iconfont icon-nav_work_order',
            defaultMenuPic: 'iconfont icon-nav_other',
            PageScreen: 'iconfont icon-nav_dashboard',
            FacReportScreen: 'iconfont icon-nav_report',
            FacReportWrapScreen: 'iconfont icon-nav_report',
            BenchmarkScreen: 'iconfont icon-BenchmarkScreen1',
            default:'iconfont icon-nav_other'
        };

        function replaceClass(icon,html){
            if(icon && icon.indexOf('iconfont')>=0){
                if(icon.indexOf('industryTech6') > -1){
                    icon = 'iconfont icon-icon-test6'
                }
                html = html.replace('glyphicon glyphicon-<%icon%>', icon);
            }else{
                html = html.replace(/<%icon%>/g, icon);
            }
            return html;
        }
        //if (navItems.isHide == 1)continue;
        var strIcon = '';
        // if (!navItem.parent ) {
            var navItemPic;
            if (navItem.pic) {
                // if (navItem.pic.split('-').length > 1 || navItem.pic.indexOf('iconfont')>=0){
                    strIcon = replaceClass(navItem.pic,fontTpl);
                // }else{
                //     navItemPic = navItem.pic.split('-')[0] + '-' + systemSkin + '.svg';
                //     strIcon = svgTpl.replace('<%icon%>', navItemPic);
                // }
            } else {
                strIcon = svgTpl.replace('<%icon%>', imgMenuPicDefault[navItem.type]);
            }
            // strIcon = strIconTpl.replace('<%icon%>',strIcon)
        // }
        return strIcon;
    }
    checkPermission(dom){
        window.parent.Permission.check(dom);
    }
    initList(){
        var _this = this;
        var userId = AppConfig.userId;
        var projectId = AppConfig.projectId;

      return this.platformList
    }
    getProjectDefaultModule(){
        function getLeafModule(tar){
            var leafModule ;
            if (tar.module == 'dropDownList'){
                var moduleList = ModuleIOC.getModuleByMultiParam({'parent':tar.id},'menu');
                for(var i = 0 ; i< moduleList.length ;i++){
                    leafModule = getLeafModule(moduleList[i]);
                    if(leafModule)break;
                }
            }else{
                leafModule = tar;
            }
            return leafModule;
        }
        var moduleList = ModuleIOC.getModuleList('menu');
        var targetModule;
        for (var i = 0 ; i < moduleList.length ;i++){
            targetModule  = getLeafModule(moduleList[i]);
            if(targetModule)break;
        }
        targetModule = targetModule || {};
        return targetModule;
    }
}
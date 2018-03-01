var EnergyManagementScreen = (function(){
    function EnergyManagementScreen(){
        this.tree = undefined;
        this.module = undefined;
        this.prevModule = undefined;
        this.selectNode = undefined;
        this.store = [];
        this.moduleList = [];
        this.timePicker = undefined;
        // this.timeConfig = {
        //     startTime: new Date(+new Date() - 604800000).format('yyyy-MM-dd HH:mm:ss'),
        //     endTime: new Date().format('yyyy-MM-dd HH:mm:ss'),
        // }
        this.timeConfig = new Date().format('yyyy-MM-dd HH:mm:ss')

        this.moduleCtn = undefined;
        //能源类型
        // this.selectEnergyId = undefined;

    }
    EnergyManagementScreen.prototype = {
        show:function(){
            this.setGlobalVariable();
            $.when(this.getLayout()).done(function(html){
                this.init();
            }.bind(this))
        },
        init:function(){
            var currentProjectId = parseInt(window.location.href.split('=')[1]);
            if (!(window.AppConfig&&window.AppConfig.userId && window.AppConfig.projectId)){
                if (window.parent.AppConfig){
                    window.AppConfig = $.extend({},window.parent.AppConfig)
                }else {
                    window.AppConfig = {
                        userId:73,
                        projectId:currentProjectId
                    }
                }
            }
            window.AppConfig.projectId = currentProjectId;
            var args = [];
            if (!AppConfig.projectList && AppConfig.userId){
                args.push(this.getProjectList())
            }
            if (AppConfig.projectId){
                args.push(I18n.getProjectI18n())
            }
            this.initEnergyType();
            if(!AppConfig.energyList||AppConfig.energyList.length == 0 || AppConfig.energyList.length == 1)args.push(this.initTagTree());
            $.when.apply(null,args).always(function(){
                if (typeof AppConfig.unit_currentcy == 'undefined'){
                    var projectInfo  = BEOPUtil.getProjectById(AppConfig.projectId)
                    if (projectInfo)AppConfig.unit_currency = this.getCostUnit(projectInfo.unit_currency)
                }
                this.registerModule();
                this.initModuleNav();
                this.setInitModule();
                this.initTimeConfig();
                this.attachEvent();
            }.bind(this))
        },
        setGlobalVariable:function(){
            // window.toDate = function(){
            //     // return new (Function.prototype.bind.apply(Date,Array.prototype.concat.apply([null],arguments)))()
            //     if (arguments[0]){
            //         if (arguments.length == 1){
            //             return arguments[0].toDate();
            //         }else{
            //             return new (Function.prototype.bind.apply(Date,Array.prototype.concat.apply([null],arguments)))()
            //         }
            //     }else{
            //         return new Date();
            //     }
            // }
        },
        initEnergyType:function(){
            var energyType;
            try{
                // if(location.hash && location.hash.indexOf('energyType=')> - 1){
                    var reg = /energyType=(\w|\-)+/g
                    energyType = location.hash.match(reg)[0].split('energyType=')[1].split('-')
                // }
            }catch(err){
                energyType = [];
                console.log(err);
            }
            //AppConfig.energyList = [1,2,3,4];
            AppConfig.energyList = energyType.map(item=>{return parseInt(item)});
            if (AppConfig.energyList && AppConfig.energyList.length > 0) {
                // AppConfig.energyCurrent = AppConfig.energyList[0];
                if(AppConfig.energyList.length > 1 ){
                    var $wrapEnergyType = $('.wrapEnergyType');
                    $('.wrapEnergyType').show();
                    AppConfig.energyList.forEach(element => {
                        $('[data-type='+element+']',$wrapEnergyType).show();
                    })
                //     $('[data-type='+AppConfig.energyCurrent+']',$wrapEnergyType).addClass('active');
                }
            }
            // else{
            //     AppConfig.energyCurrent = 0;
            // }
            if (AppConfig.energyList && AppConfig.energyList.length == 1) {
                AppConfig.energyCurrent = AppConfig.energyList[0];
            }else{
                AppConfig.energyCurrent = 0;
            }
            window.CONSTANT = {
                energy:{
                    type:
                        {
                        '0':{
                            unit:{
                                name:'kWh',
                                name_power:'kW',
                                level:1
                            }
                        },
                        '1':{
                            unit:{
                                name:'kWh',
                                name_power:'kW',
                                level:1
                            }
                        },
                        '2':{
                            unit:{
                                name:'m³',
                                name_power:'m³/h',
                                level:1
                            }
                        },
                        '3':{
                            unit:{
                                name:'m³',
                                name_power:'m³/h',
                                level:1
                            }
                        },
                        '4':{
                            unit:{
                                name:'m³',
                                name_power:'m³/h',
                                level:1
                            }
                        },
                        '5':{
                            unit:{
                                name:'m³',
                                name_power:'m³/h',
                                level:1
                            }
                        },  
                        '6':{
                            unit:{
                                name:'m³',
                                name_power:'m³/h',
                                level:1
                            }
                        }                                             
                    }
                }
            }
            AppConfig.energyUnit = CONSTANT.energy.type[AppConfig.energyCurrent].unit
        },
        setEnergyType:function(id){
            if (id == AppConfig.energyCurrent)return $.Deferred().resolve();
            AppConfig.energyCurrent = parseInt(id);
            AppConfig.energyUnit = CONSTANT.energy.type[AppConfig.energyCurrent].unit
            $('.btnEnergyType').removeClass('active')
            $('.btnEnergyType[data-type="'+ AppConfig.energyCurrent +'"]').addClass('active')
            return this.initTagTree()
        },
        initTimeConfig:function(){
            let container = document.getElementById('containerNav').querySelector('.timeConfig');
            this.timePicker = new TimePicker(this,container);
        },
        getProjectList:function(){
            return WebAPI.get('/getProjectByUserId/' + AppConfig.userId).done(function(rs){
                AppConfig.projectList = rs
            })
        },
        getCostUnit:function(unit_type){
            var unit;
            switch(unit_type)
            {
                case 0:
                    unit = '¥';
                    break;
                case 2:
                    unit = '€';
                    break;
                case 3:
                    unit = '¥';
                    break;
                case 4:
                    unit = '￡';
                    break;
                case null:
                    unit = '¥';
                    break;
                default:
                    unit = '$';
            }
            return unit;
        },
        checkPermission:function(){
            Permission.check($('.wrapNavToggle'))
        },
        getLayout:function(){
            var _this = this;
            var promise = $.Deferred();
            WebAPI.get('/static/app/EnergyManagement/views/core/frame.html').done(function(html){
                window.ElScreenContainer = document.getElementById('indexMain')
                ElScreenContainer.innerHTML = html;
                _this.moduleCtn = document.getElementById('containerDisplayboard')
                promise.resolve()
            }).fail(function(){
                promise.reject()
            }).always(function(){
                I18n.fillArea($('#containerNav'));
            })
            return promise.promise();
        },
        initTagTree:function(){
            var option = {
                projectId:AppConfig.projectId
            }
            this.tree && this.tree.destroy();
            this.tree = new TagTree(this,document.getElementById('containerNav').querySelector('.tagTree'),option)
            this.store = [];
            return this.tree.$initPromise.done(()=>{
                var nodes = this.tree.instance.transformToArray(this.tree.instance.getNodes())
                var parent = nodes[0]
                this.tree.instance.selectNode(parent)
                this.tree.instance.expandNode(parent)
                this.store.push(parent)
            });

            // this.tree = new TagTree(this,document.getElementById('containerNav').querySelector('.tagTree'),option)
            // var promise = $.Deferred();
            // $.when(this.getNodeConfig(),this.tree.$initPromise).done((nodesConfig)=>{
            //     var nodes = this.tree.instance.transformToArray(this.tree.instance.getNodes())
            //     var parent = nodes[0]
            //     var children = [];
            //     this.tree.instance.selectNode(parent)
            //     this.tree.instance.expandNode(parent)
            //     var keys = ['name','id','className','pageId','parent','projectId','type','isParent'];
            //     var point = parent;

            //     for (var i = 0 ; i < nodes.length ;i++){
            //         for (var j = 0 ; j < nodesConfig.length ;j++){
            //             if (nodesConfig[j].entityId == nodes[i].id){
            //                 nodes[i].config = nodesConfig[j]
            //                 break;
            //             }
            //         }
            //     }
            //     this.store.push(point)
            //     promise.resolve()

            // }).fail(function(){
            //     promise.reject()
            // });
            // return promise.promise()
        },
        attachEvent:function(){
            var _this = this;
            var  $btnShrink = $(".btnShrink");
            var $navModule = $(document.getElementById('containerNav').querySelector('.module'))
            $navModule.off('click').on('click','.moduleItem',function(e){
                var moduleCls = _this.getModuleByName(e.currentTarget.dataset.module);
                if (!moduleCls)return;
                _this.toggleModule(moduleCls.module)
            })
            // document.getElementById('btnBackToMain').onclick = function(){
            //     _this.backBtnToggle();
            // }
            document.getElementById('btnPanelNavToggle').onclick = function(){
                _this.navExpandToggle()
            }
            var $btnEnergyType = $('.btnEnergyType');
            $btnEnergyType.off('click').on('click', e => {
                var $target = $(e.currentTarget);
                var $dataModule = $('.moduleItem.active').attr('data-module');
                var moduleCls = _this.getModuleByName($dataModule);
                if (!moduleCls)return;
                // $target.addClass('active').siblings().removeClass('active');
                // AppConfig.energyCurrent = parseInt(e.currentTarget.dataset.type);
                // _this.toggleModule(moduleCls.module);
                // this.module.show();
                var spinner = new LoadingSpinner({
                    color: '#00FFFF'
                });
                spinner.spin(document.getElementById('containerDisplayboard'));
                _this.setEnergyType(parseInt(e.currentTarget.dataset.type)).done(function(){
                    _this.resetModule(moduleCls.module);
                }).always(()=>{
                    spinner.stop();
                })
            })
            var $iptTagSearch = $('.wrapTagTree .iptTagSearch');
            $iptTagSearch.off('input propertychange').on('input propertychange',function(e){
                if (e.currentTarget.value == ''){
                    _this.tree.instance.showNodes(_this.tree.instance.getNodesByParam("isHidden", true))
                }else{
                    var selectNodes = _this.tree.instance.getSelectedNodes();
                    var targetNodes = _this.tree.instance.getNodesByParamFuzzy("name", e.currentTarget.value , null);
                    var parentNodes = [];
                    var path = [];
                    var isExist = false;
                    for (var i = 0 ; i < targetNodes.length ;i++){
                        path = targetNodes[i].getPath();
                        path.slice(0,-1).forEach(function(parent){
                            isExist = false;
                            for (var j = 0; j < parentNodes.length ;j++){
                                if (parentNodes[j].tId == parent.tId){
                                    isExist = true;
                                    break;
                                }
                            }
                            if (!isExist){
                                parentNodes.push(parent)
                            }  
                        })
                    }
                    _this.tree.instance.hideNodes(_this.tree.instance.transformToArray(_this.tree.instance.getNodes()));
                    _this.tree.instance.showNodes(parentNodes)
                    _this.tree.instance.showNodes(targetNodes)
                }
            })
            window.onresize = function(){
                document.getElementById('containerNav').querySelector('.wrapTagTree').style.height= "calc(100% - " + 
                document.getElementById('containerNav').querySelector('.wrapNavToggle').offsetHeight + "px - " +
                // document.getElementById('containerNav').querySelector('.timeConfig').offsetHeight + "px)"
                document.getElementById('containerNav').querySelector('.wrapEnergyType').offsetHeight + "px - " +
                52 + "px)"

                $('[_echarts_instance_]').each(function(i, dom) {
                    echarts.getInstanceById(dom.getAttribute('_echarts_instance_')).resize()
                });
            };

            $btnShrink.click(function(e){
                var  $this = $(this);
                if($this.hasClass('open')){
                    $this.removeClass('open').addClass('shrink');
                    $this.find('.icon').removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
                    $this.closest('.areaLabel').siblings('.shrinkContent').slideUp(300,function(){
                        _this.setTagTreeHeight();
                    });
                }else{
                    $this.removeClass('shrink').addClass('open');
                    $this.find('.icon').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
                    $this.closest('.areaLabel').siblings('.shrinkContent').slideDown(300,function(){
                        _this.setTagTreeHeight();
                    });
                }
            });
        },
        initModuleNav:function(){
            var container = document.getElementById('containerNav').querySelector('.module')
            var navDom;
            this.moduleList.forEach(function(item){
                navDom = document.createElement('div');
                navDom.innerHTML = `<span class="icon ${item.icon}"></span><span class="text">${item.title}</span>`;
                navDom.dataset.module = item.name;
                navDom.className = 'moduleItem'
                if (item.permission && item.permission.length > 0 ){
                    navDom.setAttribute('permission',item.permission.join(';'))
                }
                container.appendChild(navDom)
            })
            var numInView = 0
            $('#containerNav .module').each(function(dom){
                if(dom.offsetHeight != 0)numInView++;
            })
            this.checkPermission();
            this.setTagTreeHeight();
        },
        setTagTreeHeight:function(){
            // document.getElementById('containerNav').dataset.module = numInView;
            // document.querySelector('.wrapNavToggle').dataset.height = container.offsetHeight + 82;
            //document.getElementById('containerNav').querySelector('.tagTree').style.height= "calc(100% - "+ container.offsetHeight + "px - 110px)"
            document.getElementById('containerNav').querySelector('.wrapTagTree').style.height= "calc(100% - " + 
            document.getElementById('containerNav').querySelector('.wrapNavToggle').offsetHeight + "px - " +
            document.getElementById('containerNav').querySelector('.wrapEnergyType').offsetHeight + "px - " +
            // document.getElementById('containerNav').querySelector('.timeConfig').offsetHeight + "px)"
            52 + "px)"
        },
        registerModule:function(){
            this.moduleList.push({name: 'overview','needTagTree':false, module:EnergyOverview,title: I18n.resource.energyManagement.overview.ENERGY_OVERVIEW,'icon':'iconfont icon-gailan','energyToggle':true})
            this.moduleList.push({name: 'history', module:EnergyHistoryQuery,title: I18n.resource.energyManagement.history.HISTROY_QUERY,'icon':'iconfont icon-lishichaxun','energyToggle':true})
            this.moduleList.push({name: 'param',module:EnergyParameter,title: I18n.resource.energyManagement.subTable.METER_QUERY, module:EnergyParameter,'icon':'iconfont icon-fenbiaochaxun'})
            this.moduleList.push({name: 'standard',module:EnergyStandard,title:I18n.resource.energyManagement.projectBenchmark.PROJECT_STANDARD,'icon':'iconfont icon-xiangmuduibiao'})
            this.moduleList.push({name: 'analysis',module:EnergyAnalysis,title:I18n.resource.energyManagement.energyAnalysis.ENERGY_ANALYSIS,'icon':'iconfont icon-shujufenxi'})
            this.moduleList.push({name: 'MD',module:EnergyMD,title:I18n.resource.energyManagement.md.MD,'icon':'iconfont icon-roi-1'})
            this.moduleList.push({name:'report',module:EnergyReport,title:I18n.resource.energyManagement.reports.REPORT,'icon':'iconfont icon-baobiao1'})
            this.moduleList.push({permission:['WFUser','WFManger','WFAdmin'],name:'config',module:EnergyParamConfig,title:I18n.resource.energyManagement.param_config.PARAM_CONFIG,'icon':'iconfont icon-peizhi'})
        },
        setInitModule:function(){
            var strModule = location.hash;
            var moduleCls = undefined;
            if (strModule){
                moduleCls = this.getModuleByName(strModule)
            }
            if (!moduleCls)moduleCls = this.getModuleByName('overview')
            this.toggleModule(moduleCls.module);
        },
        toggleModule:function(moduleCls){
            if (!moduleCls)return;
            var moduleInfo = this.getModuleByConstructor(moduleCls);
            $('.moduleItem').removeClass('active');
            $('.moduleItem[data-module="'+ moduleInfo.name +'"]').addClass('active');
            this.module && this.module.close && this.module.close()

            var container = document.getElementById('containerNav')
            if (moduleCls.option && moduleCls.option.needTime === true){
                container.querySelector('.timeConfig').classList.remove('hide')
                container.querySelector('.brand').classList.add('hide')
            }else{

                container.querySelector('.timeConfig').classList.add('hide')
                container.querySelector('.brand').classList.remove('hide')
            }
            if (moduleCls.option && moduleCls.option.needTagTree == false){
                $('.wrapTagTree').hide();
            }else{
                $('.wrapTagTree').show();
            }
            var energyType = AppConfig.energyCurrent || 0;
            if(moduleInfo.energyToggle){
                if(!AppConfig.energyCurrent && AppConfig.energyList.length >= 1){
                    energyType = AppConfig.energyList[0];
                }
                container.querySelector('.wrapEnergyType').classList.remove('hide');
                
            }else {
                if(AppConfig.energyList.length == 1){
                    energyType = AppConfig.energyList[0];
                }else{
                    energyType = 0;
                }
                container.querySelector('.wrapEnergyType').classList.add('hide');
            }
            var spinner = new LoadingSpinner({
                color: '#00FFFF'
            });
            spinner.spin(document.getElementById('containerDisplayboard'));
            this.setEnergyType(energyType).always(()=>{
                spinner.stop();
                this.setTagTreeHeight();
                this.module = new moduleCls(this,document.getElementById('containerDisplayboard'))
                this.module.show();
            });
        },
        resetModule:function(moduleCls){
            if (!moduleCls)return;
            var moduleInfo = this.getModuleByConstructor(moduleCls);
            this.module && this.module.close && this.module.close()
            this.module = new moduleCls(this,document.getElementById('containerDisplayboard'))
            this.module.show();
        },
        getModuleByName:function(name){
            for (var i = 0; i < this.moduleList.length; i++){
                if (this.moduleList[i].name == name){
                    return this.moduleList[i]
                }
            }
            return false;
        },
        getModuleByConstructor:function(constructor){
            for (var i = 0; i < this.moduleList.length; i++){
                if (this.moduleList[i].module == constructor){
                    return this.moduleList[i]
                }
            }
            return false;
        },
        onNodeClick:function(nodes){
            if (nodes[0].isParent && !nodes[0].open)return;
            this.store = [];
            var keys = ['name','id','className','pageId','parent','projectId','type','isParent'];
            var point = {};
            // this.getNodeConfig(nodes.map(function(node){return node.id})).done(function(arrConfig){
                nodes.forEach((node,index) =>{

                    // point = {};
                    // point.config = arrConfig[index];
                    // keys.forEach((key)=>{
                    //     point[key] = node[key]
                    // })
                    point = node;
                    // point.config = arrConfig[index];
                    this.store.push(point)
                })
                this.module && this.module.onNodeClick && this.module.onNodeClick(this.store)
            // })
        },
        getNodeConfig:function(){
            // var postData = {
            //     projectId:AppConfig.projectId,
            //     entityId:entityId
            // }
            // var promise = $.Deferred();
            // WebAPI.post('/energy/getConfigInfo',postData).done(result=>{
            //     if(result.success){
            //         promise.resolveWith(this,[result.data]);
            //     }else{
            //         promise.reject();
            //     }
            // }).fail(()=>{
            //     promise.reject();
            // })
            // return promise.promise();
            var promise = $.Deferred();
            WebAPI.get('/tag/energyConfig/' + AppConfig.projectId + (AppConfig.energyCurrent?'/' + AppConfig.energyCurrent:'')).done(result=>{
                if(result.success){
                    promise.resolveWith(this,[result.data]);
                }else{
                    promise.reject();
                }
            }).fail(()=>{
                promise.reject();
            })
            return promise;
        },
        onTimeChange:function(time){
            this.timeConfig = time
            this.module && this.module.onTimeChange && this.module.onTimeChange(time)
        },
        // backBtnToggle:function(){
        //     var btnBack = document.getElementById('btnBackToMain');
        //     var wrapNav = document.querySelector('.wrapNavToggle');
        //     var navCtn = document.getElementById('containerNav')
        //     if (navCtn.classList.contains('slaveMode')){
        //         wrapNav.style.height = wrapNav.dataset.height + 'px';
        //     }else{
        //         wrapNav.style.height = 0;
        //     }
        //     navCtn.classList.toggle('slaveMode')
        //     // wrapNav.ontransitionend = function(){
        //     //     $(wrapNav).hide()
        //     // }
        // }
        navExpandToggle:function(){
            ElScreenContainer.classList.toggle('hideNav');
        }
    }
    return EnergyManagementScreen
})()
/**
 * Created by win7 on 2016/7/22.
 */
var BenchmarkScreen = (function(){
    function BenchmarkScreen(){
        this.ctn = undefined;
        this.iotFilter = undefined;
        this.curModule = undefined;
        this.prevModuleType = undefined;
        this.moduleCtn = undefined;
        this.moduleList = {
            'overview':{name:I18n.resource.benchmark.conmmenTree.ENERGY_OVERVIEW,cls:BenchmarkEnergyOverView},
            'diagnosis':{name:I18n.resource.benchmark.conmmenTree.ENERGY_DIAGNOSIS,cls:BenchmarkEnergyDiagnosis},
            'inquire':{name:I18n.resource.benchmark.conmmenTree.ENERGY_QUERY,cls:BenchmarkEnergyQuery},
            'analyze':{name:I18n.resource.benchmark.conmmenTree.ENERGY_ANALYSIS,cls:BenchmarkEnergyAnalysis},
            'datum':{name:I18n.resource.benchmark.conmmenTree.ENERGY_BENCH,cls: BenchmarkEnergyBenchmark},
            'predict':{name:I18n.resource.benchmark.conmmenTree.ENERGY_FORCAST,cls:BenchmarkEnergyForecast},
            'benchmark':{name:I18n.resource.benchmark.conmmenTree.ENERGY_BENCHMARKING,cls:BenchmarkEnergyBenchmarking},
            'config':{name:I18n.resource.benchmark.conmmenTree.PARAMS_CONFIG,cls:BenchmarkConfig}
        };
        this.dataSource = undefined;
        this.store = {};
        this.opt = undefined;
        this.dataSourceCtn = undefined;
    }
    BenchmarkScreen.prototype = {
        show:function(){
            WebAPI.get('/static/views/observer/benchmark/benchmarkScreen.html').done(html=> {
                ElScreenContainer.innerHTML = html;
                this.ctn = ElScreenContainer.querySelector('.ctnBenchmark');
                this.moduleCtn = this.ctn.querySelector('.panelBmModule');
                this.dataSourceCtn = this.ctn.querySelector('.panelDataSource');
                this.init();
            })
        },
        init:function(){
            this.initBtnList();
            this.initIotFilter();
            this.initDataSource();
        },
        initDataSource(){
            this.dataSource =  new DataSource(this,{disableIot:true});
            this.dataSource.show();
        },
        showDataSource(){
            $(this.dataSourceCtn).addClass('focus');
            $(this.moduleCtn).addClass('onDataSource');
        },
        hideDataSource(){
            $(this.dataSourceCtn).removeClass('focus');
            $(this.moduleCtn).removeClass('onDataSource');
        },
        initBtnList:function(){
            var container = this.ctn.querySelector('.panelModuleList');
            Object.keys(this.moduleList).forEach(val=> {
                let divBtn = document.createElement('div');
                divBtn.className = 'btnBmModule';
                divBtn.textContent = this.moduleList[val].name;
                divBtn.dataset.type = val;
                container.appendChild(divBtn)
            });
            $(container).off('click').on('click', '.btnBmModule', e=> {
                $(container).children().removeClass('selected');
                $(e.currentTarget).addClass('selected');
                if (!this.moduleList[e.currentTarget.dataset.type].cls)return;
                this.prevModuleType = this.curModule?this.curModule.type:null;
                this.curModule && this.curModule.destroy && this.curModule.destroy();
                this.curModule = new this.moduleList[e.currentTarget.dataset.type].cls(this.moduleCtn,this,{});
                this.curModule.type = e.currentTarget.dataset.type;
                this.curModule.show();
            });
        },
        setInitModule:function(){
            var iotProjId = this.iotFilter.tree.getNodes()[0]['_id'];
            if (!iotProjId)return;
            WebAPI.get('/benchmark/config/get/' + iotProjId).done(param => {
                if (!param || $.isEmptyObject(param)){
                    this.opt = {};
                    $('.panelModuleList .btnBmModule[data-type="config"]').trigger('click');
                }else{
                    this.opt = param;
                    $('.panelModuleList .btnBmModule').first().trigger('click');
                    this.setNodeConfigStatus();
                }
            })
        },
        setNodeConfigStatus:function(){
            if (!this.iotFilter.tree)return;
            if (!(this.opt && this.opt.point) || $.isEmptyObject(this.opt.point))return;
            this.iotFilter.$ctn.find('.completeConfig').removeClass('completeConfig');
            var len = Object.keys(this.opt.point);
            var num = 0;
            var arrNode = this.iotFilter.tree.transformToArray(this.iotFilter.tree.getNodes());
            var $target ;
            for (var i=0; i < arrNode.length ;i++){
                if(num >= len)return;
                var ptConfig = this.opt.point[arrNode[i]['_id']];
                if (ptConfig ){
                    if(ptConfig.power && ptConfig.energy) {
                        arrNode[i].completeConfig = true;
                        $target = $(document.getElementById(arrNode[i].tId));
                        $target.addClass('completeConfig');
                    }
                    if (ptConfig.model && ptConfig.model instanceof Array && ptConfig.model.length > 0)$target.addClass('hasModel');
                    num++
                }
            }
            arrNode.forEach(function(node){
            })
        },
        initIotFilter:function(projId){
            var _this = this;
            if(this.iotFilter){
                this.iotFilter.tree.destroy();
                this.iotFilter.$ctn.html('');
                this.iotFilter = null;
            }
            this.iotFilter = new HierFilter($('.ctnBenchmark .panelIotFilter'), projId, this);
            var option = {
                class:{
                    'projects':{
                        showNone:true
                    },
                    'groups':{
                        class:'Group'
                    }
                },
                tree:{
                    show:true,
                    extend:{
                        view:{
                            addHoverDom:function(treeId,treeNode){
                                var $target = $('#' + treeNode.tId);
                                $target.addClass('focus');
                            },
                            removeHoverDom:function(treeId,treeNode){
                                var $target = $('#' + treeNode.tId);
                                $target.removeClass('focus');
                            }
                        }
                    },
                    event:{
                        afterInit:function(){
                            var rootNode = _this.iotFilter.tree.getNodes()[0];
                            if (rootNode) {
                                _this.iotFilter.childAppend(rootNode,function(){});
                            }
                            if(!projId)_this.setInitModule();
                        },
                        click:{
                            isDefault:false,
                            act:function(event, treeId, treeNode){
                                _this.onNodeClick(event,treeNode);
                            }
                        },
                        dblClick:function(event, treeId, treeNode){
                            this.childAppend(treeNode,function(){});
                        },
                        addDom:function(treeNode,$target){
                            _this.onNodeAdd(treeNode,$target);
                        }
                    },
                    drag:{
                        enable:true,
                        dragStart:function(e,node){
                            EventAdapter.setData({dsItemId:node['_id']})
                        }
                    },
                    tool: {
                        delete: deleteNode,
                        add: {
                            act:addNode,
                            default:true
                        },
                        edit: editNode
                    }
                }
            };

            function onNodeClick(event, treeId, treeNode) {
                _this.onNodeClick(event, treeNode);
            }

            function onNodeDblClick(event, treeId, treeNode, widget) {
            }

            function deleteNode(treeNode) {

            }

            function addNode(arrParent, arrNode) {

            }

            function editNode(treeNode) {

            }
            this.iotFilter.init();
            this.iotFilter.setOption(option)
        },
        onNodeClick:function(e,node){
            this.curModule && this.curModule.onNodeClick && this.curModule.onNodeClick(e,node);
        },
        onNodeAdd:function(node,$target){
            $target.find('>a>#' + node.tId + '_span').addClass('node_name');
            if (this.opt && this.opt.point){
                var pointConfig = this.opt.point[node['_id']];
                if(pointConfig) {
                    if (pointConfig.power && pointConfig.energy) {
                        node.completeConfig = true;
                        $target.addClass('completeConfig');
                    }
                    if (pointConfig.model && pointConfig.model instanceof Array && pointConfig.model.length > 0)$target.addClass('hasModel');
                }
            }
            var $btnShowModel = $('<span class="btnShowModel btnTreeNode glyphicon glyphicon-bookmark"></span>');
            $btnShowModel[0].onclick = this.showModelInfo(node);
            $target.find('>a').append($btnShowModel);
            this.curModule && this.curModule.onNodeAdd && this.curModule.onNodeAdd(node,$target)
        },
        fullScreenModuleCtn:function(){

        },
        showModelInfo:function(node){

        },
        getModel:function(ptId){
            if (!this.opt.point)return;
            var pointId;
            if (!ptId) {
                pointId = this.iotFilter.tree.getSelectedNodes().map(node =>{
                    return node['_id'];
                });
            }else{
                if (!(ptId instanceof Array))pointId = [ptId]
            }
            if (!pointId[0])return;
            //var arrPt = Object.keys(this.opt.point);
            //var arrModelId = [];
            //for (var i = 0 ; i < arrPt.length ;i++){
            //    for (var j = 0 ; j< pointId.length ;j++){
            //        if (arrPt[i] == pointId[j] && (arrPt[i].model instanceof Array)){
            //            arrModelId.concat(arrPt[i].model);
            //            break;
            //        }
            //    }
            //}
            return WebAPI.get('/benchmark/config/getModelsByNodeId/' + pointId[0])
        },
        close:function(){
            this.ctn = null;
            this.iotFilter = null;
            this.curModule.destroy && this.curModule.destroy();
            this.curModule = null;
            this.moduleList = null;
        }
    };
    return BenchmarkScreen
})();
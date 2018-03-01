/**
 * Created by win7 on 2016/7/22.
 */
class BenchmarkConfig{
    constructor(ctn,screen,opt){
        this.ctn = ctn;
        this.screen = screen;
        this.store = $.extend(true,{point:{},cost:[],relate:[]},this.screen.opt);
        this.selectNode = undefined;
    }
    show(){
        Spinner.spin(ElScreenContainer);
        WebAPI.get('/static/views/observer/benchmark/benchmarkConfig.html').done(html=>{
            this.ctn.innerHTML = html;
            I18n.fillArea($(this.ctn));
            this.init();
            Spinner.stop(ElScreenContainer);
        })
    }
    init(){
        if (this.screen.iotFilter.projectId != AppConfig.projectId)this.screen.initIotFilter(AppConfig.projectId);
        this.initConfigNav();
        this.initDataSource();
        this.initPointConfig();
        this.initCostConfig();
        //this.initLinkConfig();
        this.initParamConfirm();
    }
    initConfigNav(){
        var nav = this.ctn.querySelector('.navConfig');
        $(nav).off('click').on('click','.navItem', e=>{
            $('.ctnBenchmarkCfg').removeClass('focus');
            var type = e.currentTarget.dataset.type;
            $('.ctn' + type[0].toUpperCase() + type.slice(1) + 'Config').addClass('focus');
            $(nav).children().removeClass('selected');
            $(e.currentTarget).addClass('selected');
            if(type == 'cost') this.initChart(this.store.cost);
        });
        $(nav).children().first().trigger('click')
    }
    initPointConfig(){
        var ctn = this.ctn.querySelector('.ctnBenchmarkCfg');
        $(ctn).off('dragover').on('dragover','.divPtCfg',e=>{
            e.preventDefault();
        });
        $(ctn).off('dragleave').on('dragleave','.divPtCfg',e=>{
            e.preventDefault();
        });
        $(ctn).off('drop').on('drop','.divPtCfg',e=>{
            e.preventDefault();
            if (!this.selectNode){
                infoBox.alert(I18n.resource.benchmark.paramsConfig.SELECT_NODE,'danger');
                return;
            }
            let id = EventAdapter.getData().dsItemId;
            $(e.currentTarget).addClass('hasDs');
            var point = this.screen.dataSource.getDSItemById(id);
            $(e.currentTarget).find('.spPtVal').text(point.alias?point.alias:point.value);
            e.currentTarget.dataset.id = id;
            if(!this.store.point[this.selectNode['_id']])this.store.point[this.selectNode['_id']] = {'model':[]};
            this.store.point[this.selectNode['_id']][e.currentTarget.dataset.type] = id;
            this.setSelectNodeConfigStatus();
        });

        $(ctn).find('.btnPtDel').off('click').on('click', e =>{
            $(e.currentTarget).prev().text('');
            var $divPtCfg = $(e.currentTarget).parent().parent();
            $divPtCfg.removeClass('hasDs');
            if(!this.store.point[this.selectNode['_id']])this.store.point[this.selectNode['_id']] = {'model':[]};
            this.store.point[this.selectNode['_id']][$divPtCfg[0].dataset.type] = '';
            this.setSelectNodeConfigStatus();
        });

        this.selectNode = this.screen.iotFilter.tree.getSelectedNodes()[0];
        if(!this.selectNode) {
            var rootNode = this.screen.iotFilter.tree.getNodes()[0];
            if (rootNode && rootNode.children[0])this.selectNode = rootNode.children[0];
        }
        this.setPointConfigVal();
    }
    setPointConfigVal(){
        if (!this.selectNode){
            $('.divPointName').text(I18n.resource.benchmark.paramsConfig.SELECT_NODE);
        }else{
            $('.divPointName').text(I18n.resource.benchmark.paramsConfig.CURRENT_NODE + this.selectNode.name);
            let nodeConfig = this.store.point[this.selectNode['_id']];
            let power='',energy='';
            if (nodeConfig){
                power = nodeConfig.power ? nodeConfig.power:'';
                energy = nodeConfig.energy ? nodeConfig.energy:'';
            }
            var $divPowerPt = $('.divPowerPt');
            var $divConsumePt = $('.divConsumePt');
            var point;
            if(power) {
                $divPowerPt[0].dataset.id= power;
                point = this.screen.dataSource.getDSItemById(power);
                $divPowerPt.addClass('hasDs').find('.spPtVal').text(point.alias?point.alias:point.value);
            }else{
                $divPowerPt.removeClass('hasDs').find('.spPtVal').text('');
            }
            if (energy) {
                $divConsumePt[0].dataset.id= energy;
                point = this.screen.dataSource.getDSItemById(energy);
                $divConsumePt.addClass('hasDs').find('.spPtVal').text(point.alias?point.alias:point.value)
            }else{
                $divConsumePt.removeClass('hasDs').find('.spPtVal').text('');
            }
        }
    };
    initCostConfig(){
        var ctn = this.ctn.querySelector('.divCtnCostConfig');
        if(this.store.cost instanceof Array){
            this.store.cost.sort(function(a,b){
                var dateA,dateB;
                if (!a.time){
                    dateA = ''
                }else{
                    dateA = new Date(new Date().format('yyyy/MM/dd '+ a.time));
                }
                if (!a.time){
                    dateB = ''
                }else{
                    dateB = new Date(new Date().format('yyyy/MM/dd '+ b.time));
                }
                if (dateA == 'Invalid Date')dateA = 0;
                if (dateB == 'Invalid Date')dateB = 0;
                return dateA - dateB
            });
            for (let i= 0 ;i < this.store.cost.length ;i++){
                ctn.appendChild(this.createCostDom(this.store.cost[i]));
            }
        }else {
            ctn.appendChild(this.createCostDom());
        }
        $(ctn).off('click').on('click','.btnCost',e=>{
            let $target = $(e.currentTarget);
            if($target.hasClass('btnCostAdd')){
                ctn.appendChild(this.createCostDom());
            }else if($target.hasClass('btnCostEdit')){
                $target.parent().find('.spCost').hide();
                $target.parent().find('.iptCost').show();
            }else if ($target.hasClass('btnCostDel')){
                $target.parent().remove();
            }
        });
        $(ctn).off('blur').on('blur','.iptCost',e=>{
            let $target = $(e.currentTarget);
            $target.prev().text($target.val());
            if ($target.val()){
                $target.hide();
                $target.prev().show()
            }else{
                $target.show();
                $target.prev().hide()
            }
            var $brotherIpt = $target.siblings('input');
            if ($brotherIpt.val()){
                $brotherIpt.hide();
                $brotherIpt.prev().show();
            }
            //this.setCostConfigStore();
            //$target.parent().find('.spCost').hide();
            //$target.parent().find('.iptCost').show();
        });
    }

    initChart(arrCostItem) {
        var arrData = [], arrTime = [];
        for (var i = 0; i < arrCostItem.length; i++) {
            arrData.push(arrCostItem[i].cost);
            arrTime.push(arrCostItem[i].time);
        }

        var option = {
            xAxis: [
                {
                    type: 'value'
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: arrTime
                }
            ],
            series : [{
                name:'收入',
                type:'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true
                    }
                },
                data: arrData
            }]
        }
        echarts.init(document.getElementById('divCostChart'), AppConfig.chartTheme).setOption(option);
    }

    setCostConfigStore(){
        var $divCost = $('.divCtnCostConfig .divCost');
        this.store.cost = [];
        var time,cost;
        for (let i = 0; i < $divCost.length ;i++){
            time = $divCost.eq(i).find('.iptCostTime').val();
            cost = $divCost.eq(i).find('.iptCostVal').val();
            this.store.cost.push({
                time:time?time:'',
                cost:cost?cost:''
            })
        }
        this.store.cost.sort(function(a,b){
            var dateA,dateB;
            if (!a.time){
                dateA = ''
            }else{
                dateA = new Date(new Date().format('yyyy/MM/dd '+ a.time));
            }
            if (!a.time){
                dateB = ''
            }else{
                dateB = new Date(new Date().format('yyyy/MM/dd '+ b.time));
            }
            if (dateA == 'Invalid Date')dateA = 0;
            if (dateB == 'Invalid Date')dateB = 0;
            return dateA - dateB
        });
    }
    createCostDom(content){
        var divCost = document.createElement('div');
        var cost = content && content.cost?content.cost:'';
        var time = content && content.time?content.time:'';
        divCost.className = 'divCost';
        divCost.innerHTML = `
        <span class='spCost spCostTime'>${time}</span>
        <input class='iptCost form-control iptCostTime' value='${time}'>
        <span class='spCost spCostVal'>${cost}</span>
        <input class='iptCost form-control iptCostVal' value='${cost}'>
        <span class='btnCostEdit btnCost glyphicon glyphicon-edit'></span>
        <span class='btnCostDel btnCost glyphicon glyphicon-remove'></span>
        `;
        var arrIpt = divCost.querySelectorAll('.iptCost');
        for (var i = 0; i < arrIpt.length ;i++){
            if (arrIpt[i].value){
                arrIpt[i].previousElementSibling.style.display = 'inline-block';
                $(arrIpt[i]).hide();
            }else{
                arrIpt[i].style.display = 'inline-block';
                $(arrIpt[i].previousElementSibling).hide();
            }
        }
        return divCost
    }
    initLinkConfig(){
        var ctn = this.ctn.querySelector('.ctnLinkConfig');
        if (!this.store.relate || this.store.relate.length == 0){
            ctn.appendChild(this.createLinkDom());
        }else{
            for (let i =0; i < this.store.relate.length ;i++){
                ctn.appendChild(this.createLinkDom(this.store.relate[i]));
            }
        }
        $(ctn).off('dragover').on('dragover','.divLinkContent',e=>{
            e.preventDefault();
        });
        $(ctn).off('dragleave').on('dragleave','.divLinkContent',e=>{
            e.preventDefault();
        });
        $(ctn).off('drop').on('drop','.divLinkContent',e=>{
            e.preventDefault();
            let id = EventAdapter.getData().dsItemId;
            $(e.currentTarget).addClass('hasDs');
            e.currentTarget.dataset.id = id;
            var point = this.screen.dataSource.getDSItemById(id);
            e.currentTarget.querySelector('.spLinkVal').textContent = point.alias?point.alias:point.value;
        });
        $(ctn).off('click').on('click','.divLinkTtl .btnLink',e=>{
            $(e.currentTarget).parent().addClass('showIpt');
            $(e.currentTarget).prev().focus();
        });
        $(ctn).on('click','.btnLinkDel',e=>{
            let divNode = e.currentTarget.parentNode;
            divNode.parentNode.removeChild(divNode);
        });
        var _this = this;
        ctn.querySelector('.btnLinkAdd').onclick = function(){
            ctn.appendChild(_this.createLinkDom());
            I18n.fillArea($(ctn));
        };
        $(ctn).off('blur').on('blur','.iptLinkTtl',e => {
            let val = e.currentTarget.value;
            let $target = $(e.currentTarget);
            if (val){
                $target.parent().removeClass('showIpt');
            }else{
                $target.parent().addClass('showIpt');
            }
        });
        $(ctn).on('click','.btnLinkDsDel',e=>{
            let $target = $(e.currentTarget);
            let $divLink = $target.parentsUntil('.divLink','.divLinkContent');
            $divLink.removeClass('hasDs');
            delete $divLink[0].dataset.id ;
        })
    }
    createLinkDom(content){
        if (!content)content = {name:'',point:''};
        var divLink = document.createElement('div');
        divLink.className = 'divLink';
        divLink.innerHTML = `
        <div class="divLinkTtl">
            <span class="spLinkTtl">${content.name}</span>
            <input class="iptLinkTtl form-control" value=${content.name}>
            <span class="btnLink btnLinkEdit glyphicon glyphicon-edit"></span>
        </div>
        <div class="divLinkContent divDsBox">
            <div class="divDsTip"><span class="glyphicon glyphicon-plus"></span><span class="spDsTipText" i18n="benchmark.paramsConfig.DRAGE_THERE">请拖拽至此</span></div>
            <div class="divLinkDs divDsContent">
                <span class="spLinkVal spDsVal"></span>
                <span class="btnLinkDsDel spDsDel glyphicon glyphicon-remove"></span>
            </div>
        </div>
        <span class="btnLink btnLinkDel glyphicon glyphicon-remove"></span>`;
        if (!(content && content.name)){
            $(divLink).addClass('showIpt');
        }
        var divLinkContent = divLink.querySelector('.divLinkContent');
        if (content && content.point) {
            $(divLinkContent).addClass('hasDs');
            divLinkContent.dataset.id = content.point;
            var point  = this.screen.dataSource.getDSItemById(content.point);
            divLinkContent.querySelector('.spLinkVal').textContent = point.alias?point.alias:point.value;
        }
        return divLink;
    }
    setLinkConfigStore(){
        var $divLink = $('.divLink');
        this.store.relate = [];
        var ttl,ds;
        for (let i = 0; i < $divLink.length ;i++){
            ttl = $divLink.eq(i).find('.iptLinkTtl').val();
            ds = $divLink.eq(i).find('.divLinkContent')[0].dataset.id;
            this.store.relate.push({
                name:ttl?ttl:'',
                point:ds?ds:''
            })
        }
    }
    //createLinkDsDom(id){
    //    var divLinkDom = document.createElement('div');
    //    divLinkDom.dataset.id = id;
    //    divLinkDom.className = 'divLinkDs divLinkUnit';
    //    var spLinkVal = document.createElement('span');
    //    spLinkVal.className = 'spLinkVal';
    //    spLinkVal.textContent = this.screen.dataSource.getDSItemById(id).alias;
    //    var spLinkDeL = document.createElement('span');
    //    spLinkDeL.className= ' spLinkDel glyphicon glyphicon-remove';
    //    divLinkDom.appendChild(spLinkVal);
    //    divLinkDom.appendChild(spLinkDeL);
    //    return divLinkDom;
    //}
    initDataSource(){
        this.screen.showDataSource();
    }
    initParamConfirm(){
        var _this = this;
        this.ctn.querySelector('.btnBmCfgCancel').onclick = function(){
            _this.screen.setNodeConfigStatus();
            _this.transformToLastModule();
        };
        this.ctn.querySelector('.btnBmCfgConfirm').onclick = function(){
            _this.setCostConfigStore();
            _this.setLinkConfigStore();
            _this.screen.opt = _this.store;
            _this.store['_id'] = _this.screen.iotFilter.tree.getNodes()[0]['_id'];
            WebAPI.post('/benchmark/config/save',_this.store).done(result=>{
                if (result == true) {
                    infoBox.alert(I18n.resource.benchmark.paramsConfig.SAVE_SUCCESS);
                    _this.setTotalNodeConfigStatus();
                    _this.transformToLastModule();
                }
            }).fail(function(){
                infoBox.alert(I18n.resource.benchmark.paramsConfig.SAVE_FAIL)
            })
        }
    }
    setSelectNodeConfigStatus(targetConfig){
        var $target = $(document.getElementById(this.selectNode.tId));
        var ptConfig = this.store.point[this.selectNode['_id']];
        if (!ptConfig)return;
        if (ptConfig.power && ptConfig.energy){
            $target.addClass('completeConfig')
        }else{
            $target.removeClass('completeConfig')
        }
    }
    setTotalNodeConfigStatus(){

    }
    transformToLastModule(){
        if (this.screen.prevModuleType && this.screen.prevModuleType != 'config'){
            $('.panelModuleList .btnBmModule[data-type="' + this.screen.prevModuleType + '"]').trigger('click');
        }else{
            this.setNodeConfigStatus();
            $('.panelModuleList .btnBmModule').first().trigger('click');
        }
    }
    destroy(){
        this.screen.hideDataSource();
        this.ctn.innerHTML = '';
    }
    onNodeClick(e,node){
        this.selectNode = node;
        this.setPointConfigVal();
    }
}
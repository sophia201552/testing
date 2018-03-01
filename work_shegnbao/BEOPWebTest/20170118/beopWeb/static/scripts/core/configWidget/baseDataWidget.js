/**
 * Created by win7 on 2016/7/7.
 */

class BaseDataWidget extends BaseConfigWidget{
    constructor (objModal,widget,area){
        super(objModal,widget,area);
    }
    setWidget(){
        this.widget.dom = document.createElement('div');
        this.widget.dom.className = 'cfgWidget cfgDataWidget div' + this.upperCaseText(this.widget.type);
        this.widget.dom.setAttribute('type',this.widget.type);
        this.initWidgetLabel();
        this.initWidgetAttr();
        this.initWidgetStyle();
        this.initWidgetId();
        this.widget.dom.appendChild(this.createWidgetDom(this.widget.opt));
        this.area.dom.appendChild(this.widget.dom);
    }
}
class DataSourceData extends BaseDataWidget{
    constructor (objModal,widget,area,opt = {}){
        super(objModal,widget,area,opt);
        this.chartCogDom = undefined;
    }
    initData(){
        this.store = {};
        for (let i = 0 ;i < this.widget.opt.variable.length; i++){
            this.store[this.widget.opt.variable[i].type] = this.widget.opt.variable[i];
            if (!this.store[this.widget.opt.variable[i].type].cog){
                this.store[this.widget.opt.variable[i].type].cog = {upper:'',lower:'',unit:'',accuracy:'',markLine:[]}
            }
        }
    }
    createWidgetDom(opt){
        var divDataWorkspace = document.createElement('div');
        divDataWorkspace.className = 'divDsWorkspace';

        var divVar,spLabel,divTip,divVarData;
        for (let ele in opt.variable){
            divVar = document.createElement('div');
            divVar.className = 'divVar row divVar' + this.upperCaseText(opt.variable[ele].type);
            divVar.dataset.type = opt.variable[ele].type;

            spLabel = document.createElement('span');
            spLabel.className = 'spVarLabel';
            spLabel.textContent = opt.variable[ele].name;

            divVar.appendChild(spLabel);
            divVarData = document.createElement('div');
            divVarData.className = 'divVarData';
            for (let i= 0 ; i < opt.variable[ele].data.length;i++){
                divVarData.appendChild(this.createDataUnitDom(opt.variable[ele].data[i]));
            }
            divTip = this.createDataTipDom();
            divVarData.appendChild(divTip);

            divVar.appendChild(divVarData);
            if (opt.variable[ele].forChart !== false){
                divVar.appendChild(this.createChartCogBtnDom());
            }
            divDataWorkspace.appendChild(divVar)
        }
        divDataWorkspace.appendChild(this.createChartCogDom());
        return divDataWorkspace;
    }

    createDataUnitDom(id){
        var divDs = document.createElement('div');
        divDs.className = 'divDs grow col-xs-4 col-lg-3';
        divDs.dataset.id = id;
        var spDs = document.createElement('span');
        spDs.className = 'spDs';
        var datasource = AppConfig.datasource.getDSItemById(id);
        spDs.textContent = datasource.alias===""?datasource.value:datasource.alias;
        spDs.title = spDs.textContent;
        divDs.appendChild(spDs);

        var spBtnDel = document.createElement('span');
        spBtnDel.className = 'glyphicon glyphicon-remove btnDsDel';
        divDs.appendChild(spBtnDel);
        $(divDs).tooltip({
            placement: 'bottom',
            title: datasource.value,
            template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div><div class="tooltipContent"><div>'+datasource.alias+'</div></div></div>'
        });
        return divDs;
    }

    createDataTipDom(){
        var divDsTip = document.createElement('div');
        divDsTip.className = 'divDs divDsTip col-xs-4 col-lg-3';

        var spDsTip = document.createElement('span');
        spDsTip.className = 'glyphicon glyphicon-plus';

        divDsTip.appendChild(spDsTip);
        return divDsTip;
    }

    createChartCogBtnDom(){
        var divChartCog = document.createElement('div');
        divChartCog.className = 'grow btnChartCog glyphicon glyphicon-cog';

        var _this = this;
        divChartCog.onclick = function(e){
            let type = e.currentTarget.parentNode.dataset.type;
            _this.initChartCogData(type);
            _this.chartCogDom && $(_this.chartCogDom).show();
        };
        return divChartCog;
    }
    createChartCogDom(){
        var panelCog = document.createElement('div');
        panelCog.className = 'panelChartCog form-horizontal';

        panelCog.innerHTML =
            `
                <div class="form-group">
                    <label for="inputPtValUpper" class="col-xs-4 control-label" i18n="modalConfig.data.PT_UPPER">坐标轴上限</label>
                    <div class="col-xs-6">
                        <input type="text" class="form-control upper" data-role="upper" placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputPtValLower" class="col-xs-4 control-label" i18n="modalConfig.data.PT_LOWER">坐标轴下限</label>
                    <div class="col-xs-6">
                        <input type="text" class="form-control lower" data-role="lower" placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputPtUnit" class="col-xs-4 control-label" i18n="modalConfig.data.PT_UNIT">坐标轴单位</label>
                    <div class="col-xs-6">
                        <input type="text" class="form-control unit" data-role="unit" placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputPtAccuracy" class="col-xs-4 control-label" i18n="modalConfig.data.PT_ACCURACY">小数点位数</label>
                    <div class="col-xs-6">
                        <input type="text" class="form-control accuracy" data-role="accuracy" placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputLineName1" class="col-xs-4 control-label" i18n="modalConfig.data.PT_LINE_1">基线1</label>
                    <div class="col-xs-3">
                        <input type="text" class="form-control inputLineName markLine-0" data-role="mkName" placeholder="TiTle">
                    </div>
                    <label for="inputLineVal1" class="sr-only control-label"></label>
                    <div class="col-xs-3">
                        <input type="text" class="form-control inputLineVal markLine-0" data-role="mkVal" placeholder="Value">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputLineName2" class="col-xs-4 control-label" i18n="modalConfig.data.PT_LINE_2">基线2</label>
                    <div class="col-xs-3">
                        <input type="text" class="form-control inputLineName markLine-1" data-role="mkName" placeholder="">
                    </div>
                    <label for="inputLineVal2" class="sr-only control-label"></label>
                    <div class="col-xs-3">
                        <input type="text" class="form-control inputLineVal markLine-1" data-role="mkVal"  placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputLineName3" class="col-xs-4 control-label" i18n="modalConfig.data.PT_LINE_3">基线3</label>
                    <div class="col-xs-3">
                        <input type="text" class="form-control inputLineName markLine-2" data-role="mkName" placeholder="">
                    </div>
                    <label for="inputLineVal3" class="sr-only control-label"></label>
                    <div class="col-xs-3">
                        <input type="text" class="form-control inputLineVal markLine-2" data-role="mkVal" placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputLineName4" class="col-xs-4 control-label" i18n="modalConfig.data.PT_LINE_4">基线4</label>
                    <div class="col-xs-3">
                        <input type="text" class="form-control inputLineName markLine-3" data-role="mkName" placeholder="">
                    </div>
                    <label for="inputLineVal4" class="sr-only control-label"></label>
                    <div class="col-xs-3">
                        <input type="text" class="form-control inputLineVal markLine-3" data-role="mkVal" placeholder="">
                    </div>
                </div>
                <span class="glyphicon glyphicon-remove btnPanelCogHide" aria-hidden="true"></span>
                <div class="divBtnCogGrp">
                    <button type="button" class="btn btn-primary btnCogConfirm" i18n="modalConfig.data.PT_COG_SURE">确认</button>
                    <button type="button" class="btn btn-primary btnCogCancel" i18n="modalConfig.data.PT_COG_CANCEL">取消</button>
                </div>
            `;
        panelCog.style.display = 'none';
        var _this = this;
        panelCog.querySelector('.btnCogConfirm').onclick = function(){
            _this.setChartCogData();
            $(panelCog).hide();
        };
        panelCog.querySelector('.btnCogCancel').onclick = function(){
            $(panelCog).hide();
        };
        panelCog.querySelector('.btnPanelCogHide').onclick = function(){
            $(panelCog).hide();
        };
        this.chartCogDom = panelCog;
        return panelCog;
    }
    setChartCogData(){
        var iptGrp = this.chartCogDom.querySelectorAll('input');
        for (let i = 0; i < iptGrp.length ;i++){
            if (iptGrp.dataset.role != 'mkVal' && iptGrp.dataset.role != 'mkName'){
                this.store[this.chartCogDom.dataset.type].cog[iptGrp.dataset.role] = iptGrp;
            }
        }
        this.store[this.chartCogDom.dataset.type].cog.markLine = [];
        for (let i=0; i< 4;i++){
            this.store[this.chartCogDom.dataset.type].cog.markLine.push({
                name:this.chartCogDom.querySelector('inputLineName markLine-'+ (i+1)),
                value:this.chartCogDom.querySelector('inputLineVal markLine-'+ (i+1))
            })
        }
    }
    initChartCogData(type){
        this.chartCogDom.dataset.type = type;
        Object.keys(this.store[type].cog).forEach(val=>{
            if (val != 'markLine') {
                this.chartCogDom.querySelector('.' + val).value = this.store[type].cog[val]
            }else{
                for (let i = 0; i < this.store[type].cog[val].length;i++){
                    this.chartCogDom.querySelector('.inputLineName ' + val + '-' + i).value = this.store[type].cog[val][i].name;
                    this.chartCogDom.querySelector('.inputLineVal ' + val + '-' + i).value = this.store[type].cog[val][i].value;
                }
            }
        });
    }

    attachEvent(){
        $(this.widget.dom).find('.divVar').off('dragover').on('dragover',e=>{
            e.preventDefault();
            $(e.currentTarget).find('.divDsTip').addClass('dragover')
        });
        $(this.widget.dom).find('.divVar').off('dragleave').on('dragleave',e=>{
            e.preventDefault();
            $(e.currentTarget).find('.divDsTip').removeClass('dragover')
        }) ;
        $(this.widget.dom).find('.divVar').off('drop').on('drop',e=>{
            e.preventDefault();
            let id = EventAdapter.getData().dsItemId;
            let datasource = AppConfig.datasource.getDSItemById(id);
            let textContent = datasource.alias===""?datasource.value:datasource.alias;
            //同名数据源 提示
            let $allShowDatasource = $(e.currentTarget.querySelector('.divVarData')).find(".spDs");
            var num = 0;
            $allShowDatasource.each(function(){
                let $thisName = $(this).text();
                if($thisName === textContent){
                    num +=1;
                }
            })  
            let divTip = e.currentTarget.querySelector('.divDsTip');
            $(divTip).removeClass('dragover');
            if(num <= 0){
                e.currentTarget.querySelector('.divVarData').insertBefore(this.createDataUnitDom(id),divTip);
                this.setStore();
            }else{
                alert(I18n.resource.modalConfig.err.TYPE2);
            }  
        });
        $(this.widget.dom).off('click').on('click','.btnDsDel',e=>{
            $(e.currentTarget).parent().next('.tooltip').remove().end().remove();
            this.setStore();
        });
        //$(this.widget.dom).find('.btnChartCog').off('click').on('click',e=>{
        //    this.initChartCogData(e.currentTarget.parentNode.getAttribute('type'));
        //});
    }

    setStore(){
        var $divParam = $(this.widget.dom).find('.divVar');
        var $divDs;
        this.store = {};
        for (let i = 0; i < $divParam.length ;i++){
            $divDs = $divParam.eq(i).find('.divDs');
            if(!this.store[$divParam[i].dataset.type]) {
                this.store[$divParam[i].dataset.type] = {data:[],cog:{}};
            }
            for (let j = 0; j < $divDs.length ;j++){
                if (!$divDs[j].dataset.id)continue;
                this.store[$divParam[i].dataset.type].data.push($divDs[j].dataset.id)
            }
        }
    }
}

class DataInfoListData extends BaseDataWidget{
    constructor (objModal,widget,area,opt = {}){
        super(objModal,widget,area,opt);
    }

    initData(){
        this.store = [];
        for (let i = 0 ;i < this.widget.opt.variable.length; i++){
            this.store.push(this.widget.opt.variable[i]);
        }
    }

    createWidgetDom(opt){
        var divDataBindList = document.createElement('div');
        divDataBindList.className = 'divDataBindList';

        var divParamAdd = document.createElement('div');
        divParamAdd.className = 'divBtnAddParam glyphicon glyphicon-plus';
        var _this = this;
        divParamAdd.onclick = function(){
            divDataBindList.appendChild(_this.createLiData({}));
        };
        divDataBindList.appendChild(divParamAdd);


        divDataBindList.appendChild(this.createDataListTtl());
        for (let i = 0; i< opt.variable.length ;i++){
            divDataBindList.appendChild(this.createLiData(opt.variable[i]));
        }
        return divDataBindList;
    }

    createDataListTtl(){
        var divTtl = document.createElement('div');
        divTtl.className = 'divDataListTtl flexCenter';
        divTtl.innerHTML = '\
        <span class="spDataListTtl spDataListNameTtl">数据名称</span>\
        <span class="spDataListTtl spDataListDsTtl">数据源</span>\
        <span class="spDataListTtl spDataListUnitTtl">数据单位</span>\
        <span class="spDataListTtl spDataListScaleTtl">小数点位</span>\
        ';
        return divTtl
    }

    createLiData(variable){
        var divLiDataBind = document.createElement('div');
        divLiDataBind.className = 'divDataParam form-inline flexCenter';

        var iptName = document.createElement('input');
        iptName.setAttribute('type','input');
        iptName.className = 'form-control iptName';
        variable.name && (iptName.value =  variable.name);

        var iptUnit = document.createElement('input');
        iptUnit.setAttribute('type','input');
        iptUnit.className = 'form-control iptUnit';
        variable.unit && (iptUnit.value = variable.unit);

        var iptScale = document.createElement('input');
        iptScale.setAttribute('type','input');
        iptScale.className = 'form-control iptScale';
        variable.unit &&(iptScale.value = variable.Scale);

        var id = variable.data instanceof Array?variable.data[0]:null;
        var divDs = this.createDataUnitDom(id);

        var divParamDel = document.createElement('div');
        divParamDel.className = 'btnParamDel glyphicon glyphicon-remove';

        divLiDataBind.appendChild(iptName);
        divLiDataBind.appendChild(divDs);
        divLiDataBind.appendChild(iptUnit);
        divLiDataBind.appendChild(iptScale);
        divLiDataBind.appendChild(divParamDel);
        return divLiDataBind
    }

    createDataUnitDom(id){
        var divDs = document.createElement('div');
        divDs.className = 'divDs grow';
        var spDs = document.createElement('span');
        spDs.className = 'spDs';
        if(id){
            divDs.className += ' hasDs';
            divDs.dataset.id = id;
            spDs.textContent = AppConfig.datasource.getDSItemById(id).alias===""?AppConfig.datasource.getDSItemById(id).value:AppConfig.datasource.getDSItemById(id).alias;
        }
        divDs.appendChild(spDs);

        var spTip = document.createElement('span');
        spTip.className = 'spDsTip';
        spTip.innerHTML = `
            <span class='spNormalTip glyphicon glyphicon-plus'></span>
            <span class='spHoverTip'>请拖拽数据源至此</span>
        `;
        divDs.appendChild(spTip);


        var spBtnDel = document.createElement('span');
        spBtnDel.className = 'glyphicon glyphicon-remove btnDsDel';
        divDs.appendChild(spBtnDel);
        return divDs;
    }
    // createColDom(){
    //     var divCol = document.createElement('div');
    // }
    attachEvent(){
        $(this.widget.dom).off('dragover').on('dragover','.divDs',e=>{
            e.preventDefault();
            $(e.currentTarget).addClass('dragover')
        });
        $(this.widget.dom).off('dragleave').on('dragleave','.divDs',e=>{
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover')
        });
        $(this.widget.dom).off('drop').on('drop','.divDs',e=>{
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover').addClass('hasDs');
            let id = EventAdapter.getData().dsItemId;
            e.currentTarget.dataset.id = id;
            $(e.currentTarget).find('.spDs').text(AppConfig.datasource.getDSItemById(id).alias===""?AppConfig.datasource.getDSItemById(id).value:AppConfig.datasource.getDSItemById(id).alias);
        });
        $(this.widget.dom).off('click').on('click','.btnDsDel',e=>{
            $(e.currentTarget).parent().removeClass('hasDs');
            delete e.currentTarget.dataset.id;
            $(e.currentTarget).find('.spDs').text('');
        });
        $(this.widget.dom).on('click','.btnParamDel',e=>{
            $(e.currentTarget).parent().remove();
        });
    }
    getData(){
        var arrParamDom = this.widget.dom.querySelectorAll('.divDataParam');
        this.store = [];
        var name,unit,id,scale;
        var nameDom,unitDom,dsDom,scaleDom;
        for (let i= 0 ; i< arrParamDom.length ;i++){
            nameDom = arrParamDom[i].querySelector('.iptName');
            unitDom = arrParamDom[i].querySelector('.iptUnit');
            dsDom = arrParamDom[i].querySelector('.divDs');
            scaleDom = arrParamDom[i].querySelector('.iptScale');
            name = nameDom.value?nameDom.value:'';
            unit = unitDom.value?unitDom.value:'';
            scale = scaleDom.value?scaleDom.value:'';
            id = dsDom.dataset.id?dsDom.dataset.id:'';
            this.store.push({
                name:name,
                unit:unit,
                data:id,
                scale:scale
            })
        }
        return this.store
    }
}


class MultiDataConfigData extends BaseDataWidget{
    constructor (objModal,widget,area,opt = {}){
        super(objModal,widget,area,opt);
    }

    initData(){
        this.store = [];
        for (let i = 0 ;i < this.widget.opt.variable.length; i++){
            this.store.push(this.widget.opt.variable[i]);
        }
    }
     createTitleDom(title){
         var opt = title?title:{};
         var divTitle = document.createElement('div');
         divTitle.className = 'divRoleConfigTtl clearfix';

         var label = document.createElement('label');
         label.className = 'divTitleLabel';
         label.innerHTML = '标题：';

         var dataTitleName = document.createElement('div');
         dataTitleName.className = 'divDataTitleName';
         dataTitleName.innerHTML = '标题数据：';

         var iptTtl = document.createElement('input');
         iptTtl.className = 'iptRoleTtl form-control';
         iptTtl.setAttribute('type','text');
         iptTtl.setAttribute('placeholder','请输入标题名称……');
         if(opt.text)iptTtl.value = opt.text;

         var dataSource = this.createDataUnitDom(opt.data);

         var iptUnit = document.createElement('input');
         iptUnit.className = 'iptRoleTtlUnit form-control';
         iptUnit.setAttribute('placeholder','单位');
         if(opt.unit)iptUnit.value = opt.unit;

         var iptScale = document.createElement('input');
         iptScale.className = 'iptRoleTtlScale form-control';
         iptScale.setAttribute('placeholder','小数点位');
         if(opt.scale)iptScale.value = opt.scale;

         divTitle.appendChild(label);
         divTitle.appendChild(iptTtl);
         divTitle.appendChild(dataTitleName);
         divTitle.appendChild(dataSource);
         divTitle.appendChild(iptUnit);
         divTitle.appendChild(iptScale);
         return divTitle;
     }

    // createTitleDom(){
    //     var divTitle = document.createElement('div');
    //     divTitle.appendChild(this.createDataListTtl());
    //     divTitle.appendChild(this.createLiData({}));
    //     // divTitle.appendChild(this.createDataUnitDom());
    //     return divTitle;
    // }
    
    createWidgetDom(opt){
        var divMultiRoleWorkSpace = document.createElement('div');
        divMultiRoleWorkSpace.className = 'divMultiDataWorkSpace';
        // var divRoleAdd = document.createElement('div');
        // divRoleAdd.className = 'divBtnAddRole glyphicon glyphicon-plus';
        // var _this = this;
        // // divMultiRoleWorkSpace.appendChild(_this.createTitleDom());
        // divRoleAdd.onclick = function(){
        //     divMultiRoleWorkSpace.appendChild(_this.createRoleList({}));
        // };
        // divMultiRoleWorkSpace.appendChild(divRoleAdd);

        for (let i = 0; i< opt.variable.length ;i++){
            divMultiRoleWorkSpace.appendChild(this.createRoleList(opt.variable[i]));
        }
        if(opt.variable.length == 0)divMultiRoleWorkSpace.appendChild(this.createRoleList());
        return divMultiRoleWorkSpace;
    }

    createRoleList(opt={}){
        var divRoleList = document.createElement('div');
        divRoleList.className = 'divRoleConfig';

        divRoleList.appendChild(this.createTitleDom(opt.title));
        divRoleList.appendChild(this.createDataList(opt.param));
        return divRoleList;
    }
    createDataList(opt){
        var divDataBindList = document.createElement('div');
        divDataBindList.className = 'divDataBindList';

        var divParamAdd = document.createElement('div');
        divParamAdd.className = 'divBtnAddParam glyphicon glyphicon-plus glyphiconPlus';
        var _this = this;
        // divDataBindList.appendChild(this.createTitleDom());
        divDataBindList.appendChild(this.createDataListTtl());
        divParamAdd.onclick = function(){
            divDataBindList.appendChild(_this.createLiData({}));
        };
        divDataBindList.appendChild(divParamAdd);

        
        if(opt instanceof Array && opt.length > 0){
            for (var i = 0 ; i < opt.length ;i++){
                divDataBindList.appendChild(this.createLiData(opt[i]));
            }
        }else{
            divDataBindList.appendChild(_this.createLiData({}));
        }
        return divDataBindList;
    }

    createDataListTtl(){
        var divTtl = document.createElement('div');
        divTtl.className = 'divDataListTtl flexCenter';
        var type;
        for (var i = 0; i < this.widget.opt.param.length; i++){
            type = this.widget.opt.param[i].type;
            type = type[0].toUpperCase() + type.slice(1);
            divTtl.innerHTML += `
                <span class="spDataListTtl spDataList${type}Ttl">${this.widget.opt.param[i].name}</span>
            `
        }
        return divTtl
    }

    createLiData(variable = {}){
        var divLiDataBind = document.createElement('div');
        divLiDataBind.className = 'divDataParam form-inline flexCenter';

        var paramDom,param;
        for (var i = 0; i < this.widget.opt.param.length; i++){
            param = this.widget.opt.param[i].type;
            if (param == 'data'){
                var id = typeof(variable.data)=="string"?variable.data:null;
                divLiDataBind.appendChild(this.createDataUnitDom(id));
                continue;
            }
            paramDom = document.createElement('input');
            paramDom.setAttribute('type','input');
            paramDom.dataset.param = param;
            paramDom.className = 'form-control iptParam ipt' + param[0].toUpperCase() + param.slice(1);
            variable[param] && (paramDom.value =  variable[param]);
            divLiDataBind.appendChild(paramDom);
        }


        var divParamDel = document.createElement('div');
        divParamDel.className = 'btnParamDel glyphicon glyphicon-remove';

        divLiDataBind.appendChild(divParamDel);
        return divLiDataBind
    }

    createDataUnitDom(id){
        var divDs = document.createElement('div');
        divDs.className = 'divDs grow';
        var spDs = document.createElement('span');
        spDs.className = 'spDs';
        if(id){
            divDs.className += ' hasDs';
            divDs.dataset.id = id;
            spDs.textContent = AppConfig.datasource.getDSItemById(id).alias===""?AppConfig.datasource.getDSItemById(id).value:AppConfig.datasource.getDSItemById(id).alias;
        }
        divDs.appendChild(spDs);

        var spTip = document.createElement('span');
        spTip.className = 'spDsTip';
        spTip.innerHTML = `
            <span class='spNormalTip glyphicon glyphicon-plus'></span>
            <span class='spHoverTip'>请拖拽数据源至此</span>
        `;
        divDs.appendChild(spTip);


        var spBtnDel = document.createElement('span');
        spBtnDel.className = 'glyphicon glyphicon-remove btnDsDel';
        divDs.appendChild(spBtnDel);
        return divDs;
    }

    attachEvent(){
        $(this.widget.dom).off('dragover').on('dragover','.divDs',e=>{
            e.preventDefault();
            $(e.currentTarget).addClass('dragover')
        });
        $(this.widget.dom).off('dragleave').on('dragleave','.divDs',e=>{
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover')
        });
        $(this.widget.dom).off('drop').on('drop','.divDs',e=>{
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover').addClass('hasDs');
            let id = EventAdapter.getData().dsItemId;
            e.currentTarget.dataset.id = id;
            $(e.currentTarget).find('.spDs').text(AppConfig.datasource.getDSItemById(id).alias===""?AppConfig.datasource.getDSItemById(id).value:AppConfig.datasource.getDSItemById(id).alias);
        });
        $(this.widget.dom).off('click').on('click','.btnDsDel',e=>{
            $(e.currentTarget).parent().removeClass('hasDs');
            delete e.currentTarget.parentNode.dataset.id;
            $(e.currentTarget).parent().find('.spDs').text('');
        });
        $(this.widget.dom).on('click','.btnParamDel',e=>{
            $(e.currentTarget).parent().remove();
        });
    }
    getData(){
        var arrRoleDom = this.widget.dom.querySelectorAll('.divRoleConfig');
        this.store = [];
        var arrDivParamDom,dsDom,arrParamDom,divRoleTtl;
        var dictParam = [];
        var roleConfig = {title:{},param:[]};
        var id;
        for (let i = 0; i < arrRoleDom.length ;i++){
            roleConfig = {title:{},param:[]};
            divRoleTtl = arrRoleDom[i].querySelector('.divRoleConfigTtl');
            roleConfig.title.text = divRoleTtl.querySelector('.iptRoleTtl').value;
            roleConfig.title.data = divRoleTtl.querySelector('.divDs').dataset.id;
            roleConfig.title.unit = divRoleTtl.querySelector('.iptRoleTtlUnit').value;
            roleConfig.title.scale = divRoleTtl.querySelector('.iptRoleTtlScale').value;
            if(!roleConfig.title.data)roleConfig.title.data = '';
            arrDivParamDom = arrRoleDom[i].querySelectorAll('.divDataParam');
            for (let j= 0 ; j< arrDivParamDom.length ;j++){
                dictParam = {};
                dsDom = arrDivParamDom[j].querySelector('.divDs');
                arrParamDom = arrDivParamDom[j].querySelectorAll('.iptParam');
                for (let k = 0; k < arrParamDom.length ;k++){
                    dictParam[arrParamDom[k].dataset.param] = arrParamDom[k].value;
                }
                id = dsDom.dataset.id?dsDom.dataset.id:'';
                dictParam.data = id;
                roleConfig.param.push(dictParam);
            }
            this.store.push(roleConfig);
        }
        return this.store
    }
}


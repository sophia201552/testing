/**
 * Created by vicky
 */
var ModalDiagnosisStruct = (function(){
    function ModalDiagnosisStruct(screen, entityParams) {
        this.$configModal = undefined;
        this.$modal = undefined;
        this.tempOpt = undefined;
        this.store = {};
        this.subEntity = undefined;
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }
    ModalDiagnosisStruct.prototype = new ModalBase();
    ModalDiagnosisStruct.prototype.optionTemplate = {
        name:'toolBox.modal.DIAGNOSIS_SUMMARY',
        parent:3,
        mode:'custom',
        maxNum: 10,
        title:'',
        defaultHeight:4.5,
        defaultWidth:3,
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalDiagnosisStruct',
        scroll:false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':true,
            'desc': '#DiagSummary'
        }
    };
    ModalDiagnosisStruct.prototype.configModalOptDefault= {
        "header" : {
            "needBtnClose" : true,
            "title" : "配置"
        },
        "area" : [
            {
                "type": 'option',
                "widget":[{id:'needDetail',type:'checkbox',name:'是否显示细节'}]
            },
            {
                "module" : "dsDrag",
                "data":[{
                    type:'point',name:'KPI分项统计来源',data:[],forChart:false
                }]
            },{
                'type':'footer',
                "widget":[{type:'confirm',opt:{needClose:false}},{type:'cancel'}]
            }
        ],
        result:{}
    };

    ModalDiagnosisStruct.prototype.show = function(){
        this.init();
    };
    ModalDiagnosisStruct.prototype.initConfigModalOpt = function(){
        var _this = this;

        if(this.entity.modal.option){
            if(this.entity.modal.option.needDetail)this.configModalOpt.area[0].widget[0].data = this.entity.modal.option.needDetail;
            if(this.entity.modal.option.structPoint)this.configModalOpt.area[1].data[0].data = this.entity.modal.option.structPoint;
        }
        this.configModalOpt.result.func = function(option){
            _this.setModalOption(option); 
            _this.configModal.hide();
        }
    };
    ModalDiagnosisStruct.prototype.getRealTimePoint = function(list,arr){
        var _this = this;
        if(!arr)arr = [];
        list.forEach(function(item){
            if(item.point) {
                arr.push(_this.entity.modal.option.prefix + item.point);
            }
            if(item.children instanceof Array && item.children.length > 0){
                _this.getRealTimePoint(item.children,arr)
            }
        });
        return arr;
    };
    ModalDiagnosisStruct.prototype.init = function(){
    };

    ModalDiagnosisStruct.prototype.renderModal = function (e) {
        $(this.container).addClass('widgetKPIItemEval');
        this.container.innerHTML = '<div class="divKPIIndex diagnosisCtn"></div><div class="divKPIDetail"></div>';
        if(this.entity.modal.option.needDetail){
            this.renderDetailContainer();
            $(this.container).addClass('showSubContainer');
        }
        this.attachEvent();
    };
    ModalDiagnosisStruct.prototype.renderDetailContainer = function(){
        var containerDetail = this.container.querySelector('.divKPIDetail');
        var item = {
            modal:{
                type:'ModalHtml',
                interval:60000,
                option:{
                    html:'<div>开发中</div>'
                },
                points:[],
                title:''
            },
            spanC:9,
            spanR:6
        };
        this.initSubEntity(containerDetail,item)
    };
    ModalDiagnosisStruct.prototype.attachEvent = function(){
        var _this = this;
        var clickEvent = AppConfig.isMobile?'tap':'click';
        $(this.container).off(clickEvent).on(clickEvent,'.divStructTtl',function(e){
            $(e.currentTarget).parent().toggleClass('focus');
        });
        $(this.container).on(clickEvent,'.divStructItem',function(e){
            var $target = $(e.currentTarget);
            if($target.hasClass('focus')){
                $target.removeClass('focus');
                $target.next().hasClass('rowPointDetail') && $target.next().removeClass('focus')
            }else {
                $(_this.container).find('.rowPointDetail.focus').removeClass('focus');
                $(_this.container).find('.divStructItem.focus').removeClass('focus');
                $target.addClass('focus');
                $target.next().hasClass('rowPointDetail') && $target.next().addClass('focus');
                _this.refreshSubEntity($target);
            }
        });
    };
    ModalDiagnosisStruct.prototype.refreshSubEntity = function($target){
        //var itemIndex = $target.parentsUntil('.divKPIIndex','.divStructCtn')[0].dataset.itemIndex;
        //var childIndex = $target[0].dataset.itemChildIndex;
        //if(!this.store.structList)return;
        var arrPoint = [],strPoint;
        try{
            //arrPoint = this.store.structList[itemIndex].children[childIndex].relatedPoints;
            arrPoint = $target.data('bindPoints');
            strPoint = arrPoint.map(function(point){return point.pointname}).toString();

        }catch(e){
            strPoint = '数据格式不符合'
        }
        var _this = this;
        this.subEntity.entity.modal.points = arrPoint.map(function(point){return (_this.entity.modal.option.prefix + point.point)});
        this.subEntity.entity.modal.option.html = '<div>' + strPoint + '</div><script>this.onUpdateComplete=function(data){console.log(data)}</script>';
        this.updateSubEntity();
    };
    ModalDiagnosisStruct.prototype.updateSubEntity = function($target){
        //todo
        this.subEntity.render();
    };
    ModalDiagnosisStruct.prototype.initPointMap = function(points){
        var _this = this;
        var $dom;
        points.forEach(function(point){
            _this.initPointDetail(point.dsItemId,point.data)
        })
    };
    ModalDiagnosisStruct.prototype.initPointDetail = function(id,strData){
        var $dom = $('[data-point="' + id +'"]');
        if ($dom.length == 0)return;
        var data;
        if (!isNaN(Number(strData))){
            data = {
                score:Number(strData)
            }
        }else {
            try {
                data = JSON.parse(strData)
            } catch (e) {
                $dom.text('No Data');
                $('.pointDetail[data-detail="' + id + '"]').text('No Data');
                return;
            }
        }

        var status = '';
        if(parseFloat(data.score) >= 60){
            status = 'success';
            $dom.text(parseFloat(data.score) + '%');
        }else if(parseInt(data.score) >= 0){
            status = 'danger';
            $dom.text(parseFloat(data.score) + '%');
        }else{
            status = 'default';
            $dom.text('--');
        }
        $dom.removeClass('success danger default').addClass(status);

        var $detail = $('.pointDetail[data-detail="' + id +'"]');
        if($detail.length > 0) {
            $detail.removeClass('success danger default').addClass(status);
            $detail.text(data.detail);
        }

        if($dom.hasClass('spItemInfo')){
            $dom.next().removeClass('success danger default').addClass(status)
        }
    };
    ModalDiagnosisStruct.prototype.initStruct = function(struct){
        var _this = this;
        var structDom = this.container.querySelector('[data-item="' + struct.name +'"]');
        if(!structDom) {
            structDom = document.createElement('div');
            structDom.className = 'divStructCtn focus';
            structDom.dataset.item = struct.name;


            var structTtl = document.createElement('div');
            structTtl.className = 'divStructTtl';
            structTtl.innerHTML = '\
            <span class="spStructIcon glyphicon glyphicon-dashboard"></span>\
            <span class="spStructName">' + struct.name + '</span>\
            <!--<span class="pointDetail" data-detail="' + (struct.point ? _this.entity.modal.option.prefix + struct.point : '') + '"></span>-->';

            var structBody = document.createElement('div');
            structBody.className = 'divStuctBody';

            if ((struct.items instanceof Array) && struct.items.length > 0) {
                struct.items.forEach(function (item, index) {
                    structBody.appendChild(_this.createStructItem(item));
                    //structBody.appendChild(_this.createPointDetail(item))
                })
            }
            structDom.appendChild(structTtl);
            //structBody.appendChild(_this.createPointDetail(struct));
            structDom.appendChild(structBody);
            this.container.querySelector('.diagnosisCtn').appendChild(structDom);
        }
        //item

    };

    ModalDiagnosisStruct.prototype.createStructItem = function(item){
        var structItem = document.createElement('div');
        structItem.className = 'divStructItem';
        structItem.innerHTML = '\
            <span class="spItemInfo">' + (item.name?item.name:'') + '</span>\
            <span class="spItemInfo">' + (item.result?item.result:'') + '</span>\
            <span class="spItemInfo spItemKPIRs">' + (item.description?item.description:'') + '</span>';
        $(structItem).data('bindPoints', item.bindPoints);
        return structItem;
    };

    ModalDiagnosisStruct.prototype.updateModal = function (points) {
        this.spinner.stop();
        if(!(points[0] && points[0].dsItemId))return;
        var structList;
        var _this = this;
        try{
            structList = JSON.parse(points[0].data).content;
        }catch(e){
            return;
        }
        structList.forEach(function(struct){
            _this.initStruct(struct);
        });
        this.store.structList = structList;
    };
    ModalDiagnosisStruct.prototype.showConfigMode = function () {

    };
    ModalDiagnosisStruct.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
        this.entity.modal.option = {
            structPoint:option.points[0],
            needDetail:option.needDetail
        };
        this.entity.modal.points = option.points[0];
        this.entity.modal.option.prefix = '@' + AppConfig.project.bindId + '|';
        //this.entity.modal.option.prefix = '@72|';
        //return WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds:this.entity.modal.option.structPoint})
    };


    return ModalDiagnosisStruct;
})();



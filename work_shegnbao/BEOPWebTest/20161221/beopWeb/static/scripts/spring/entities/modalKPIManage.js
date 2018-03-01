/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalKPIManage = (function(){
    function ModalKPIManage(screen, entityParams) {
        this.$configModal = undefined;
        this.$modal = undefined;
        this.tempOpt = undefined;
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }
    ModalKPIManage.prototype = new ModalBase();
    ModalKPIManage.prototype.optionTemplate = {
        name:'toolBox.modal.KPI_STRUCT',
        parent:0,
        mode:'custom',
        maxNum: 10,
        title:'',
        defaultHeight:4.5,
        defaultWidth:3,
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalKPIManage',
        scroll:false
    };
    ModalKPIManage.prototype.configModalOptDefault= {
        "header" : {
            "needBtnClose" : true,
            "title" : "配置"
        },
        "area" : [
            {
                "module" : "dsDrag",
                "data":[{
                    type:'point',name:'KPI分项统计来源',data:[],forChart:false
                }]
            },{
                'type':'footer',
                "widget":[{type:'confirm',opt:{needClose:false}},{
                    type:'cancel'
                }]
            }
        ],
        result:{}
    };

    ModalKPIManage.prototype.show = function(){
        this.init();
    };
    ModalKPIManage.prototype.initConfigModalOpt = function(){
        var _this = this;
        if(this.entity.modal.points)this.configModalOpt.area[0].data[0].data = this.entity.modal.option.structPoint;
        this.configModalOpt.result.func = function(option){
            _this.setModalOption(option).done(function(resultData){
                _this.entity.modal.points = [];
                if(!(resultData.dsItemList && resultData.dsItemList[0] && resultData.dsItemList[0].data))return;
                var structList;
                try{
                    structList = JSON.parse(resultData.dsItemList[0].data).KPIList;
                }catch(e){
                    return;
                }
                _this.getRealTimePoint(structList,_this.entity.modal.points)
            }).always(function(){
                _this.configModal.hide();
                _this.toggleDataSource(false)
            });
        }
    };
    ModalKPIManage.prototype.getRealTimePoint = function(list,arr){
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
    ModalKPIManage.prototype.init = function(){
    };

    ModalKPIManage.prototype.renderModal = function (e) {
        this.spinner.stop();
        $(this.container).addClass('widgetKPIItemEval');
        var _this = this;
        var postData = {'dsItemIds': this.entity.modal.option.structPoint};
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart',postData).done(function(resultData){
            if(!(resultData.dsItemList && resultData.dsItemList[0] && resultData.dsItemList[0].data))return;
            var structList;
            try{
                structList = JSON.parse(resultData.dsItemList[0].data).KPIList;
            }catch(e){
                return;
            }
            structList.forEach(function(struct){
                _this.initStruct(struct);
            });
            _this.attachEvent();
        })
    };
    ModalKPIManage.prototype.attachEvent = function(){
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
                $target.addClass('focus');
                $target.next().hasClass('rowPointDetail') && $target.next().addClass('focus')
            }
        });
    };
    ModalKPIManage.prototype.initPointMap = function(points){
        var _this = this;
        var $dom;
        points.forEach(function(point){
            _this.initPointDetail(point.dsItemId,point.data)
        })
    };
    ModalKPIManage.prototype.initPointDetail = function(id,strData){
        var $dom = $('[data-point="' + id +'"]');
        if ($dom.length == 0)return;
        var data;
        try{
            data = JSON.parse(strData)
        }catch(e){
            $dom.text('No Data');
            $('.pointDetail[data-detail="' + id +'"]').text('No Data');
            return;
        }
        $dom.text(parseFloat(data.score) + '%');

        var status = '';
        if(parseFloat(data.score) >= 60){
            status = 'success';
        }else if(parseInt(data.score) >= 0){
            status = 'danger';
        }else{
            status = 'default';
        }
        $dom.removeClass('success danger default').addClass(status);

        var $detail = $('.pointDetail[data-detail="' + id +'"]');
        if($detail.length > 0) {
            $detail.removeClass('success danger default').addClass(status);
            $detail.text(data.detail);
        }

        if($dom.hasClass('spItemInfo')){
            $dom.prev().removeClass('success danger default').addClass(status)
        }
    };
    ModalKPIManage.prototype.initStruct = function(struct){
        var _this = this;
        var structDom = document.createElement('div');
        structDom.className = 'divStructCtn focus';

        var defaultSvg = '<svg version="1.1" id="图形" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                    <path class="svgpath" data-index="path_0" fill="#272636" d="M1002.496 414.208c-5.44-28.672-22.592-47.04-43.456-46.528l-4.352 0c-71.808 0-130.24-58.432-130.24-130.24 0-23.68 11.264-49.6 11.328-49.792 11.072-24.96 2.56-55.616-19.84-71.232l-1.216-0.832-125.248-69.568-1.28-0.576c-7.424-3.2-15.552-4.864-24.192-4.864-17.856 0-35.328 7.104-46.784 19.008-15.296 15.808-63.488 56.768-102.4 56.768-39.296 0-87.808-41.792-103.168-57.856-11.52-12.16-29.12-19.392-47.168-19.392-8.448 0-16.448 1.6-23.744 4.672L339.2 44.224 209.536 115.456l-1.28 0.896C185.792 131.968 177.216 162.56 188.288 187.52c0.128 0.256 11.328 26.24 11.328 49.856 0 71.808-58.432 130.24-130.24 130.24L65.024 367.616c-20.928-0.512-38.08 17.92-43.456 46.528C21.12 416.448 11.072 470.144 11.072 512.384c0 42.304 10.048 95.936 10.496 98.176 5.376 28.288 22.08 46.592 42.688 46.592 0.256 0 0.512 0 0.768 0l4.352 0c71.808 0 130.24 58.432 130.24 130.24 0 23.68-11.264 49.6-11.328 49.792-11.072 24.96-2.56 55.616 19.776 71.232l1.216 0.832 122.88 68.736 1.28 0.576c7.424 3.264 15.488 4.928 24.128 4.928 18.048 0 35.648-7.424 47.04-19.84 14.4-15.68 64.576-60.352 104.704-60.352 40.448 0 89.792 44.416 105.408 61.504 11.456 12.608 29.184 20.16 47.36 20.16l0 0 0 0c8.448 0 16.384-1.6 23.68-4.736l1.344-0.576 127.36-70.4 1.28-0.896c22.4-15.616 30.976-46.272 19.904-71.168-0.128-0.256-11.328-26.24-11.328-49.856 0-71.808 58.432-130.24 130.24-130.24l4.352 0c20.928 0.448 38.08-17.92 43.456-46.528 0.448-2.24 10.496-55.936 10.496-98.176C1012.928 470.144 1002.88 416.448 1002.496 414.208L1002.496 414.208zM509.824 685.248c-95.68 0-173.504-77.824-173.504-173.504 0-95.68 77.824-173.504 173.504-173.504 95.68 0 173.504 77.824 173.504 173.504C683.264 607.424 605.44 685.248 509.824 685.248L509.824 685.248zM509.824 685.248"></path>\
                    <path class="svgpath" data-index="path_1" fill="#272636" d="M509.824 397.248 509.824 397.248c-63.104 0-114.496 51.328-114.496 114.496 0 63.104 51.328 114.496 114.496 114.496 63.104 0 114.496-51.328 114.496-114.496C624.256 448.64 572.928 397.248 509.824 397.248L509.824 397.248zM509.824 397.248"></path>\
                </svg>';

        var structTtl = document.createElement('div');
        structTtl.className = 'divStructTtl';
        structTtl.innerHTML = '\
            <span class="spStructIcon">'+ defaultSvg +'</span>\
            <span class="spStructName">' + struct.name + '</span>\
            <span class="spStructValue">综合达标率：<span class="spStructPt" data-point="'+ (struct.point?_this.entity.modal.option.prefix + struct.point:'') +'">Loading</span></span>\
            <!--<span class="pointDetail" data-detail="' + (struct.point?_this.entity.modal.option.prefix + struct.point:'') +'">Loading</span>-->';

        var structBody = document.createElement('div');
        structBody.className = 'divStuctBody';

        structBody.appendChild(this.createStructItemTtl(struct.children));

        //var structItemList = document.createElement('div');
        //structItemList.className = 'divStructItemList';
        //
        //structBody.appendChild(structItemList);
        if((struct.children instanceof Array) && struct.children.length > 0){
            struct.children.forEach(function(item,index){
                structBody.appendChild(_this.createStructItem(item));
                structBody.appendChild(_this.createPointDetail(item))
            })
        }
        structDom.appendChild(structTtl);
        structBody.appendChild(_this.createPointDetail(struct));
        structDom.appendChild(structBody);
        this.container.appendChild(structDom);
    };
    ModalKPIManage.prototype.createStructItemTtl = function(){
        var structItemTtl = document.createElement('div');
        structItemTtl.className = 'divStructItemTtl';
        structItemTtl.innerHTML = '\
            <span class="spStructItemTtl">考核项</span>\
            <span class="spStructItemTtl">考核结果</span>\
            <span class="spStructItemTtl">月达标率</span>\
            ';
        return structItemTtl
    };
    ModalKPIManage.prototype.createPointDetail = function(item){
        var structDetail = document.createElement('tr');
        structDetail.className = 'rowPointDetail';
        structDetail.innerHTML = '<td class="divPointDetail" colspan="5"><span class="pointDetail" data-detail="' + (item.point?this.entity.modal.option.prefix + item.point:'') +'">Loading</span></td>';
        return structDetail;
    };
    ModalKPIManage.prototype.createStructItem = function(item){
        var structItem = document.createElement('div');
        structItem.className = 'divStructItem';
        structItem.innerHTML = '\
            <span class="spItemInfo">' + (item.name?item.name:'') + '</span>\
            <span class="spItemInfo spItemKPIRs">\
                <span class="label label-success">达&nbsp;&nbsp;&nbsp;标</span>\
                <span class="label label-danger">不达标</span>\
                <span class="label label-default">未开启</span>\
            </span>\
            <span class="spItemInfo" data-point="'+ (item.point?this.entity.modal.option.prefix + item.point:'') +'">Loading</span>\
            <!--<span class="pointDetail" data-detail="' + (item.point?this.entity.modal.option.prefix + item.point:'') +'">Loading</span>-->';
        return structItem;
    };

    ModalKPIManage.prototype.updateModal = function (points) {
        this.initPointMap(points);
    };
    ModalKPIManage.prototype.showConfigMode = function () {

    };
    ModalKPIManage.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
        this.entity.modal.option = {structPoint:option.points[0]};
        this.entity.modal.option.prefix = '@' + AppConfig.datasource.getDSItemById(option.points[0]).projId + '|';
        //this.entity.modal.option.prefix = '@4|';
        return WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds:this.entity.modal.option.structPoint})
    };


    return ModalKPIManage;
})();



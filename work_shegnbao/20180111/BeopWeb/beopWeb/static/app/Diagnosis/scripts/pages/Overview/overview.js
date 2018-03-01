// overview.js
;
(function(exports, components) {

    class OverviewPage {
        constructor(container, conditionModel, diagnosis) {
            this.container = container;
            this.conditionModel = conditionModel;
            this.diagnosis = diagnosis;
            this.components = [];
            this.init();
        }
        init() {
            this.initLayout();
            this.initComponents();
            this.unbindOb();
            this.bindOb();
            this.attachEvents();
        }
        initLayout() {
            let $thisContainer = $(this.container);
            let domArr;
            if (AppConfig.projectId === 647){
                domArr = [{
                    domName: 'faultRatioContainer',
                    width: 14.5,
                    height: '130px'
                }, {
                    domName: 'influenceRatioContainer',
                    width: 9.5,
                    height: '130px'
                }, {
                    domName: 'ChartContainer',
                    width: 14.5,
                    height: 12
                }, {
                    domName: 'pieWithLineContainer',
                    width: 9.5,
                    height: 7.5
                },
                {
                    domName: 'tableContainer',
                    width: 9.5,
                    height: 4.5
                }];
            } else if (AppConfig.projectId === 528 || AppConfig.projectId === 540 || AppConfig.projectId === 542 || AppConfig.projectId === 539){
                domArr = [{
                    domName: 'faultRatioContainer',
                    width: 14.5,
                    height: '130px'
                }, {
                    domName: 'influenceRatioContainer',
                    width: 9.5,
                    height: '130px'
                }, {
                    domName: 'ChartContainer',
                    width: 14.5,
                    height: 12
                },
                {
                    domName: 'tableContainer',
                    width: 9.5,
                    height: 12
                }];
            } else if (AppConfig.projectId === 510) { 
                domArr = [{
                    domName: 'faultRatioContainer',
                    width: 14.5,
                    height: '130px'
                }, {
                    domName: 'influenceRatioContainer',
                    width: 9.5,
                    height: '130px'
                }, {
                    domName: 'ChartContainer',
                    width: 14.5,
                    height: 12
                    },
                //     {
                //     domName: 'pieWithLineContainer',
                //     width: 9.5,
                //     height: 7.5
                // },
                {
                    domName: 'tableContainer',
                    width: 9.5,
                    height: 12
                }];
            } else {
                domArr = [{
                    domName: 'faultRatioContainer',
                    width: 14.5,
                    height: '130px'
                }, {
                    domName: 'influenceRatioContainer',
                    width: 9.5,
                    height: '130px'
                }, {
                    domName: 'ChartContainer',
                    width: 14.5,
                    height: 6
                }, {
                    domName: 'pieWithLineContainer',
                    width: 9.5,
                    height: 6
                },
                {
                    domName: 'summaryContainer',
                    width: 7.25,
                    height: 6
                },
                {
                    domName: 'pieWidthBarContainer',
                    width: 7.25,
                    height: 6
                },
                {
                    domName: 'tableContainer',
                    width: 9.5,
                    height: 6
                }];
            }
            // 支持一下固定宽高的情况

            let domStr = this.domLocation(domArr);
            $thisContainer.html(`<div class="overviewScreen">${domStr}</div>`);
        }
        domLocation(domArr) {
            let domStr = '';
            let $thisContainer = $(this.container);
            let width = $thisContainer.width();
            let height = $thisContainer.height();

            // 这里先写死
            width = width - 10;
            height = height - 130;

            for (let i = 0, length = domArr.length; i < length; i++){
                let row = domArr[i];
                let w = row.width, h = row.height;
                if (typeof w === 'number') {
                    w = (domArr[i].width / 24) * width - 1 + 'px';
                }
                if (typeof h === 'number') {
                    h = (domArr[i].height / 12) * height + 'px';
                }
                domStr += `<div class="${domArr[i].domName}" style="width: ${w};height: ${h}"></div>`;
            }
            return domStr;
        }
        initComponents() {
            var $container = $(this.container);
            if (!(AppConfig.projectId === 528 || AppConfig.projectId === 539 || AppConfig.projectId === 540 || AppConfig.projectId === 542 || AppConfig.projectId === 510 )){
                let proportionPieWithLine = new components.ProportionPieWithLine($container.find('.pieWithLineContainer')[0], this.conditionModel, this);
                proportionPieWithLine.show();
                if(AppConfig.projectId !== 647){
                    let proportionPieWithBar = new components.ProportionPieWithBar($container.find('.pieWidthBarContainer')[0], this.conditionModel);
                    proportionPieWithBar.show();
                    let summary = new components.Summary($container.find('.summaryContainer')[0], this.conditionModel);
                    summary.show();
                }
            }
            this.chart3D = new components.Chart3D($container.find('.ChartContainer')[0], this.conditionModel);
            this.chart3D.show();
            let equipmentHealth = new components.EquipmentHealth($container.find('.faultRatioContainer')[0], this.conditionModel, this);
            equipmentHealth.show();
            let consequenceFaults = new components.ConsequenceFaults($container.find('.influenceRatioContainer')[0], this.conditionModel, this);
            consequenceFaults.show();
            let table = new components.Table($container.find('.tableContainer')[0], this.conditionModel, this);
            table.show();
        }
        attachEvents(){
            var _this = this;
            var $container = $(this.container)
            let $thisContainer = $container.find('.overviewScreen')
            let resizeTimer = null;
            $(window).off('resize.overview').on('resize.overview',function(){ 
                if(resizeTimer){
                    clearTimeout(resizeTimer);
                    resizeTimer = null;
                }
                resizeTimer = setTimeout(()=>{
                    _this.init();
                    resizeTimer = null;
                },300);
            })
            $(this.container).off("change",".chart3D_select").on("change",".chart3D_select",function(){
                var type = $(this).attr("data-type");
                if(type === "y"){
                    _this.chart3D.show($(this).val(),$container.find("#chart3D_Z_Selected").val());
                }else{
                    _this.chart3D.show($container.find("#chart3D_Y_Selected").val(),$(this).val())
                }              
            })  
        }
        detachEvent() {
            $(window).off('resize.overview');
        }
        show() {    

        }
        bindOb() {
            this.conditionModel.addEventListener('update', this.update, this);
        }
        unbindOb() {
            this.conditionModel.removeEventListener('update', this.update);
        }
        update(e,propName) {
            let forbiddenArr  = ['update.activeEntities', 'update.time'];
            if(forbiddenArr.indexOf(propName)>-1){
                return;
            }
            // TODO 数据请求
            this.components && this.components.forEach(
                component => {
                    component.update(this.conditionModel.serialize());
                }
            );
            this.initComponents();
            
        }
        close() {
            this.unbindOb();
            this.components.forEach(
                component => {
                    component.close();
                }
            );
            this.components.length = 0;
            this.components = null;
            this.detachEvent();
            window.CAPTURE_INSTANCES.forEach(ins=>{
                ins.captureDoms = [];
            });
            window.CAPTURE_INSTANCES = [];
            $('.feedBackModalBtn').removeClass('highLight');
        }
    }

    exports.OverviewPage = OverviewPage;
}(namespace('diagnosis.Pages'), namespace('diagnosis.components')));
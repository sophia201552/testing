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
            var domArr = [{
                domName: 'faultRatioContainer',
                width: '14.5',
                height: '1.8'
            }, {
                domName: 'influenceRatioContainer',
                width: '9.5',
                height: '1.8'
            }, {
                domName: 'ChartContainer',
                width: '14.5',
                height: '5.5'
            }, {
                domName: 'pieWithLineContainer',
                width: '9.5',
                height: '5.5'
            }, {
                domName: 'summaryContainer',
                width: '7.25',
                height: '4.7'
            }, {
                domName: 'pieWidthBarContainer',
                width: '7.25',
                height: '4.7'
            }, {
                domName: 'tableContainer',
                width: '9.5',
                height: '4.7'
            }];
            let domStr = this.domLocation(domArr);
            $thisContainer.html(`<div class="overviewScreen">${domStr}</div>`);
        }
        domLocation(domArr) {
            let domStr = '';
            for (let i = 0, length = domArr.length; i < length; i++){
                let width = (domArr[i].width / 24)*100 ;
                let height = (domArr[i].height / 12)*100;
                domStr += `<div class="${domArr[i].domName}" style="width: ${width}%;height: ${height}%"></div>`;
            }
            return domStr;
        }
        initComponents() {
            var $container = $(this.container);
            let proportionPieWithBar = new components.ProportionPieWithBar($container.find('.pieWidthBarContainer')[0], this.conditionModel);
            proportionPieWithBar.show();
            let proportionPieWithLine = new components.ProportionPieWithLine($container.find('.pieWithLineContainer')[0], this.conditionModel, this);
            proportionPieWithLine.show();
            this.chart3D = new components.Chart3D($container.find('.ChartContainer')[0], this.conditionModel);
            this.chart3D.show();
            let equipmentHealth = new components.EquipmentHealth($container.find('.faultRatioContainer')[0], this.conditionModel, this);
            equipmentHealth.show();
            let consequenceFaults = new components.ConsequenceFaults($container.find('.influenceRatioContainer')[0], this.conditionModel, this);
            consequenceFaults.show();
            let summary = new components.Summary($container.find('.summaryContainer')[0], this.conditionModel);
            summary.show();
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
// consequence.js
;(function (exports, enums) {
    class Consequence {
        constructor(container, diagnosis, nav) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.nav = nav;
            this.faultModal = null;
            this.selectedIds = new Set();
            this.data = [];
            this.init();
        }
        init() {
            const headHtml = `<div class="itemHead"><span class="headIcon"><span class="out"></span><span class="in"></span></span><span class="headText">${I18n.resource.faultModal.CONSEQUENCE}</span></div><div class="itemList"></div>`;
            this.container.innerHTML = headHtml;
            this.createItem();
            this.attachEvent();
            this.unbindStateOb();
            this.bindStateOb();
        }
        show() {

        }
        close() {
            if(this.async){
                this.async.abort();
                this.async = null;
            }
        }
        attachEvent() {
            const _this = this;
            let $container = $(this.container),
                $itemList = $container.find('.itemList'),
                $allBtn = $container.find('.allBtn');
            $allBtn.off('click').on('click',(e)=>{
                if(!this.faultModal){
                    this.initFaultModal();
                }
                this.faultModal.show();
            });
            $itemList.off('click').on('click','.item',function(e){
                let id = this.dataset.id;
                if(_this.selectedIds.has(id)){
                    _this.selectedIds.delete(id);
                }else{
                    _this.selectedIds.add(id);
                }
                let activeConsequences = [];
                let data = enums.faultConsequenceName;
                let keys = Object.keys(data);
                keys.forEach((k)=>{
                    if(_this.selectedIds.has(k+'')){
                        activeConsequences.push(k);
                    }
                });
                // _this.diagnosis.conditionModel.activeConsequences(activeConsequences);
                _this.diagnosis.gotoHistory({
                    activeConsequences: activeConsequences
                });
            });
        }
        bindStateOb() {
            this.diagnosis.conditionModel.addEventListener('update.activeConsequences',this.updateActiveConsequences,this);
        }
        unbindStateOb() {
            this.diagnosis.conditionModel.removeEventListener('update.activeConsequences',this.updateActiveConsequences,this);
        }
        updateActiveConsequences() {
            $('.itemList .item',this.container).removeClass('selected');
            this.selectedIds.clear();
            this.diagnosis.conditionModel.activeConsequences().forEach(v=>{
                this.selectedIds.add(v+'');
                $(`.item[data-id='${v}']`).addClass('selected');
            });
        }
        createItem() {
            let data = enums.faultConsequenceName;
            let keys = Object.keys(data);
            let domHtml = '';
            keys.forEach((k)=>{
                let name = data[k];
                domHtml+=`<div class="item" title="${name}" data-id="${k}"><span class="itemIcon iconfont icon-xiangmusucai"></span><span class="itemText">${name}</span></div>`;
            });
            this.container.querySelector('.itemList').innerHTML = domHtml;
        }
    }
    exports.Consequence = Consequence;
} ( namespace('diagnosis.Pages.nav'),namespace('diagnosis.enum')));
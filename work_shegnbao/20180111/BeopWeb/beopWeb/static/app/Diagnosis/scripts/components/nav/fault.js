// fault.js
;(function (exports) {
    class Fault {
        constructor(container, diagnosis, nav) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.nav = nav;
            this.faultModal = null;
            this.async = null;
            this.selectedIds = new Set();
            this.data = [];
            this.init();
        }
        init() {
            const headHtml = `<div class="itemHead"><span class="headIcon"><span class="out"></span><span class="in"></span></span><span class="headText">${I18n.resource.nav.FAULTS}</span><span class="allBtn glyphicon glyphicon-plus"></span><span class="clearBtn glyphicon glyphicon-repeat"></span></div><div class="itemList"></div>`;
            this.container.innerHTML = headHtml;
            this.attachEvent();
            this.unbindStateOb();
            this.bindStateOb();
            this.async = this.getData().always(()=>{
                this.async = null;
            });
        }
        show() {

        }
        close() {
            if(this.async){
                this.async.abort();
                this.async = null;
            }
            if (this.faultModal){
                this.faultModal.close();
                this.faultModal = null;
            }
            this.unbindStateOb();
        }
        initFaultModal() {
            let FaultModal = namespace('diagnosis.components.FaultModal');
            this.faultModal = new FaultModal(this.diagnosis,this.SavefaultModal.bind(this));
        }
        attachEvent() {
            const _this = this;
            let $container = $(this.container),
                $itemList = $container.find('.itemList'),
                $allBtn = $container.find('.allBtn'),
                $clearBtn = $container.find('.clearBtn'),
                $removeBtn = $container.find('.removeBtn');
            
            $allBtn.off('click').on('click',(e)=>{
                this.initFaultModal();
                this.faultModal.show();
            });
            $clearBtn.off('click').on('click',(e)=>{
                // this.data = [];
                this.diagnosis.gotoHistory({
                    activeFaults: []
                });
                this.createItem(this.data);
            });
            $itemList.off('click').on('click','.item',function(e){
                let id = this.dataset.faultid;
                if(_this.selectedIds.has(id)){
                    _this.selectedIds.delete(id);
                }else{
                    _this.selectedIds.add(id);
                }
                let faults = [];
                _this.data.forEach(v=>{
                    if(_this.selectedIds.has(v.faultId+'')){
                        faults.push(v);
                    }
                });
                // _this.diagnosis.conditionModel.activeFaults(faults);
                _this.diagnosis.gotoHistory({
                    activeFaults: faults
                });
            }).on('click','.removeBtn',function(e){
                e.stopImmediatePropagation();
                let $parent = $(this).parent(),
                    id = $parent.data('faultid')+'';
                if(_this.selectedIds.has(id)){
                    _this.selectedIds.delete(id);
                    let faults = [];
                    _this.data.forEach(v=>{
                        if(_this.selectedIds.has(v.faultId+'')){
                            faults.push(v);
                        }
                    });
                    // _this.diagnosis.conditionModel.activeFaults(faults);
                    _this.diagnosis.gotoHistory({
                        activeFaults: faults
                    });
                }
                let index = _this.data.findIndex(v=>v.faultId+''==id);
                _this.data.splice(index,1);
                $parent.remove();
            });
            
            
            //hover事件 处理滚动条出现 删除键的位置
            $itemList.off('mouseover.item').on('mouseover.item', '.item', function () {
                let $this = $(this),
                    $removeBtn = $this.find('.removeBtn'),
                    scrollWidth = 0;
                if ($itemList[0].scrollHeight > $itemList.height()){//有滚动条出现
                    scrollWidth = $this.parent().width() - this.offsetWidth;
                }
                $removeBtn.css('margin-right', `-${scrollWidth}px`);
            });
        }
        SavefaultModal(data){
            //add
            this.data = this.data.concat(data);
            this.addItem(data);
        }
        bindStateOb() {
            this.diagnosis.conditionModel.addEventListener('update.activeFaults',this.updateActiveFaults,this);
        }
        unbindStateOb() {
            this.diagnosis.conditionModel.removeEventListener('update.activeFaults',this.updateActiveFaults,this);
        }
        updateActiveFaults() {
            $('.itemList .item',this.container).removeClass('selected');
            this.selectedIds.clear();
            this.diagnosis.conditionModel.activeFaults().forEach(v=>{
                this.selectedIds.add(v.faultId+'');
                $(`.item[data-faultId='${v.faultId}']`).addClass('selected');
            });
        }
        getData(entityIdArr) {
            if(this.diagnosis.conditionModel.activeFaults().length>0){
                this.diagnosis.conditionModel.activeFaults([]);
            }
            let {startTime,endTime} = this.nav.state.time();
            if(this.async){
                this.async.abort();
                this.async = undefined;
            }
            let argData;
            if(entityIdArr){
                let entityIds = entityIdArr.join(',');
                argData = {startTime,endTime,entityIds,"projectId":AppConfig.projectId, lan: I18n.type};
            }else{
                argData = {startTime,endTime,"projectId":AppConfig.projectId, lan: I18n.type}
            }
            return $.get('/diagnosis_v2/getLastestFaults',argData).done((rs)=>{
                if(rs&&rs.status=='OK'){
                    let $wrap = $(this.container).find('.itemList').html('');
                    this.createItem(rs.data);
                    this.data = rs.data;
                    this.updateActiveFaults();
                }
            });
        }
        createHtml(data) {
            let faultIdSet = new Set();
            let domHtml = '';
            data.forEach((v)=>{
                if(faultIdSet.has(v.faultId)){
                    return;
                }
                faultIdSet.add(v.faultId);
                domHtml+=`<div class="item" title="${v.name}" data-faultId="${v.faultId}"><span class="itemIcon iconfont icon-xiangmusucai"></span><span class="itemText">${v.name}</span><span class="removeBtn glyphicon glyphicon-remove"></span></div>`;
            });
            return domHtml;
        }
        createItem(data = []) {
            this.container.querySelector('.itemList').innerHTML = this.createHtml(data);
        }
        addItem(data = []) {
            $('.itemList',this.container).append(this.createHtml(data));
        }
        findByIds(ids) {
            let idsSet = new Set(ids);
            return this.data.filter(v=>idsSet.has(v.faultId));
        }
    }
    exports.Fault = Fault;
} ( namespace('diagnosis.Pages.nav') ));
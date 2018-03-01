// structure.js
;(function (exports) {
    class Structure {
        constructor(container, diagnosis, nav) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.nav = nav;
            this.zTreeObj = null;
            this.ztreeSetting = null;
            this.async = [];
            this.data = [];
            this.intactRateData = [];
            this.init();
        }
        init() {
            this.ztreeSetting = {
                view:{
                    addDiyDom: null,
                    showLine: false,
                    dblClickExpand: true,
                    autoCancelSelected: true,
                    showIcon: true,
                },
                data:{
                    keep:{
                        leaf: true,
                        parent: true
                    },
                    simpleData:{
                        enable: true,
                        pIdKey: 'parent'
                    }
                },
                edit:{
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false,
                },
                callback:{
                    onNodeCreated: this.zTreeOnNodeCreated.bind(this),
                    onClick: this.zTreeOnClick.bind(this),
                    beforeClick: this.zTreeBeforeClick.bind(this)
                }
            };
            const headHtml = `<div class="itemHead"><span class="headIcon"><span class="out"></span><span class="in"></span></span><span class="headText">${I18n.resource.nav.STRUCTURE}</span></div><ul id="${+moment().format('YYYY-MM-DD HH:mm:ss').toDate()}" class="itemList ztree"></ul>`;
            this.container.innerHTML = headHtml;
            this.unbindStateOb();
            this.bindStateOb();
            this.async.push(this.getData().always(()=>{
                this.async.push(this.getIntactRate());
                $.when(...this.async).always(()=>{
                    this.async = [];
                });
            }));
        }
        show() {

        }
        close() {
            if(this.async.length>0){
                this.async.forEach(v=>{
                    v.abort();
                    this.async = [];
                });
            }
        }
        bindStateOb() {
            this.diagnosis.conditionModel.addEventListener('update.activeEntities',this.updateActiveEntities,this);
        }
        unbindStateOb() {
            this.diagnosis.conditionModel.removeEventListener('update.activeEntities',this.updateActiveEntities,this);
        }
        updateActiveEntities() {
            let selectedNodes = this.zTreeObj.getSelectedNodes();
            let activeEntitiesOld = this.getActiveEntities(selectedNodes);
            let activeEntities = this.diagnosis.conditionModel.activeEntities();
            if(activeEntitiesOld.length>activeEntities.length){//外部删除触发
                let newIds = activeEntities.map(v=>v.id);
                let diff = activeEntitiesOld.filter(v=>(newIds.indexOf(v.id)<0));
                diff.forEach(v=>{
                    this.cancelGroup(v);
                    this.zTreeObj.cancelSelectedNode(v);
                    this.cancleGroupLeft(v);
                })
            }else if(activeEntitiesOld.length<activeEntities.length) {//外部增加触发
                let oldIds = activeEntitiesOld.map(v=>v.id);
                let diff = activeEntities.filter(v=>(oldIds.indexOf(v.id)<0));
                diff.forEach(v=>{
                    let node = this.zTreeObj.getNodeByParam('id',v.id);
                    this.openGroup(node);
                })
            }
            // 更新 activeAllEntities 字段
            selectedNodes = this.zTreeObj.getSelectedNodes();
            let activeAllEntities = this.getActiveAllEntities(selectedNodes);
            let activeAllEntitiesOld = this.diagnosis.conditionModel.activeAllEntities && this.diagnosis.conditionModel.activeAllEntities() || [];
            let differenceIds = this.getDiff(activeAllEntities, activeAllEntitiesOld);
            if(differenceIds.length>0){
                this.diagnosis.conditionModel.activeAllEntities && this.diagnosis.conditionModel.activeAllEntities(activeAllEntities);
            }
        }
        getIntactRate() {
            let {startTime,endTime} = this.diagnosis.conditionModel.time();
            return $.get('/diagnosis_v2/getEntitiesWrongQuantity', {
                "projectId": AppConfig.projectId,
                "startTime":startTime,
                "endTime":endTime,
                "lang": I18n.type
            }).done((rs)=>{
                if(rs&&rs.status=='OK'){
                    this.intactRateData = rs.data;
                    if(rs.data.length==0){
                        $(`span.intactRate.itemEnd`,this.container).html('');
                    }
                    rs.data.forEach((v)=>{
                        let num = v.wrongQuantity == undefined?'':v.wrongQuantity;
                        $(`span[data-id=${v.id}]`,this.container).html(num);
                    });
                }
            }); 
        }
        getData() {
            return $.get('/diagnosis_v2/getEntities', {
                "projectId": AppConfig.projectId,
                "lang": I18n.type
            }).done((rs)=>{
                if(rs&&rs.status=='OK'){
                    let $wrap = $(this.container).find('.itemList').html('');
                    let parentIdSet = new Set();
                    this.data = rs.data;
                    rs.data.forEach((v)=>{
                        parentIdSet.add(v.parent);
                    });
                    rs.data.forEach((v)=>{
                        if(parentIdSet.has(v.id)){
                            v.iconSkin = `id_${v.id} iconfont icon-xiangmusucai none`;
                        }else{
                            v.iconSkin = `id_${v.id} iconfont icon-xiangmusucai none`;
                        }
                    });
                    this.zTreeObj = $.fn.zTree.init($wrap, this.ztreeSetting, rs.data);
                }
            });
        }
        zTreeOnNodeCreated(e, treeId, treeNode) {
            let span = document.createElement('SPAN');
            span.dataset.id = treeNode.id;
            let intactRate = this.intactRateData&&this.intactRateData.find(v=>v.id==treeNode.id);
            intactRate = intactRate&&intactRate.wrongQuantity;
            intactRate = intactRate==undefined?'':intactRate;
            span.innerHTML = intactRate;
            span.classList.add('intactRate');
            span.classList.add('itemEnd');
            e.target.querySelector(`.id_${treeNode.id}`).parentNode.appendChild(span);
        }
        zTreeBeforeClick(treeId, treeNode, flag) {
            if(flag == 1){
                let selectedNodes = this.zTreeObj.getSelectedNodes();
                if(selectedNodes.length == 1 && selectedNodes[0].id == treeNode.id){
                    this.zTreeOnClick(null, treeId, treeNode, 0);
                    return false;
                }else{
                    selectedNodes.forEach(node=>{
                        let childNode = this.zTreeObj.getNodeByParam('id',treeNode.id,node);
                        if(treeNode!=node && !childNode){
                            this.cancelGroup(node);
                            this.cancleGroupLeft(node, treeNode);
                        }
                    });
                }
            }
            return true;
        }
        zTreeOnClick(event, treeId, treeNode, flag) {
            if(flag == 0){
                this.cancelGroup(treeNode);
                this.cancleGroupLeft(treeNode);
            }else{
                this.openGroup(treeNode);
            }
            let selectedNodes = this.zTreeObj.getSelectedNodes();
            let activeEntities = this.getActiveEntities(selectedNodes);
            let activeEntitiesOld = this.diagnosis.conditionModel.activeEntities();
            if(this.getDiff(activeEntities, activeEntitiesOld).length>0){
                // this.diagnosis.conditionModel.activeEntities(activeEntities);
                this.diagnosis.gotoHistory({
                    activeEntities: activeEntities
                }, ()=>{
                    let selectedNodes = this.zTreeObj.getSelectedNodes();
                    let activeAllEntities = this.getActiveAllEntities(selectedNodes);
                    return {
                        activeAllEntities
                    }
                });
            }
            let entityIdArr = [];
            this.diagnosis.conditionModel.activeAllEntities().forEach(v => {
                entityIdArr.push(v.id);
            });
            this.diagnosis.nav.fault.getData(entityIdArr);
        }
        getActiveAllEntities(selectedNodes, idSet = new Set()) {
            let activeAllEntities = [];
            selectedNodes.forEach(node=>{
                if(!idSet.has(node.id)){
                    idSet.add(node.id);
                    activeAllEntities.push(node);
                }
                if(node.isParent && node.children){
                    activeAllEntities = activeAllEntities.concat(this.getActiveAllEntities(node.children, idSet));
                }
            });
            return activeAllEntities;
        }
        getActiveEntities(selectedNodes) {
            let hideIdSet = new Set();
            this.addHideIdSet(selectedNodes, hideIdSet);
            let activeEntities = this.selectGroup(selectedNodes,hideIdSet);
            return activeEntities;
        }
        cancelGroup(treeNode) {
            if(!treeNode.isParent){
                return;
            }
            treeNode.children.forEach(node=>{
                this.zTreeObj.cancelSelectedNode(node);
                this.cancelGroup(node);
            });
            this.zTreeObj.expandNode(treeNode, false, true, false);
        }
        cancleGroupLeft(treeNode, afterNode) {
            this.zTreeObj.cancelSelectedNode(treeNode);
            let parentNode = treeNode.getParentNode();
            let selectedNodes = this.zTreeObj.getSelectedNodes();
            if(afterNode){
                selectedNodes.push(afterNode);
            }
            if(parentNode){
                let isInclude = false;
                selectedNodes.forEach(node=>{
                    if(isInclude){
                        return;
                    }
                    let findNode = this.zTreeObj.getNodeByParam('id', node.id, parentNode);
                    let findNode2 = this.zTreeObj.getNodeByParam('id', node.id);
                    if(findNode || findNode2 == parentNode){
                        isInclude = true;
                    }
                });
                if(!isInclude){
                    this.zTreeObj.expandNode(parentNode, false, true, false);
                    this.cancleGroupLeft(parentNode, afterNode);
                }
            }
        }
        openGroup(treeNode) {
            this.zTreeObj.selectNode(treeNode, true, true);
            this.zTreeObj.expandNode(treeNode, true);
        }
        addHideIdSet(children,idSet,isNeedAdd=false) {
            children.forEach(c=>{
                if(isNeedAdd){
                    idSet.add(c.id);
                }
                if(c.isParent && c.children){
                    this.addHideIdSet(c.children, idSet, true);
                }
            });
        }
        selectGroup(treeNodes, idSet) {
            let activeEntities = [];
            treeNodes.forEach(node=>{
                if(!idSet.has(node.id)){
                    activeEntities.push(node);
                }
            });
            return activeEntities;
        }
        getDiff(a, b, prop = 'id') {
            let oldIds = [],
            newIds = [],
            differenceIds = [];
            a.forEach(v=>{
                if(oldIds.indexOf(v[prop])<0){
                    oldIds.push(v[prop]);
                }
            });
            b.forEach(v=>{
                if(newIds.indexOf(v[prop])<0){
                    newIds.push(v[prop]);
                }
            });
            oldIds.forEach(v=>{
                if(newIds.indexOf(v)<0){
                    differenceIds.push(v);
                }
            });
            newIds.forEach(v=>{
                if(oldIds.indexOf(v)<0 && differenceIds.indexOf(v)<0){
                    differenceIds.push(v);
                }
            });
            return differenceIds;
        }
        findByIds(ids) {
            let idsSet = new Set(ids);
            return this.data.filter(v=>idsSet.has(v.id));
        }
    }
    exports.Structure = Structure;
} ( namespace('diagnosis.Pages.nav') ));
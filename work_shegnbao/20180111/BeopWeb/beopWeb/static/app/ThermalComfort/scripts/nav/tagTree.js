;(function (exports) {
    class TagTree {
        constructor(container, diagnosis, nav) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.nav = nav;
            this.zTreeObj = null;
            this.ztreeSetting = null;
            this.async = [];
            this.data = [];
            this.intactRateData = [];
            this.projectId = AppConfig.projectId;
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
                    showTitle: true
                },
                data:{
                    keep:{
                        leaf: true,
                        parent: true
                    },
                    simpleData:{
                        enable: true,
                        pIdKey: 'parent'
                    },
                    key: {
                        title: 'titleName'
                    }
                },
                edit:{
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                callback:{
                    onNodeCreated: this.zTreeOnNodeCreated.bind(this),
                    onClick: this.zTreeOnClick.bind(this)
                }
            };
            const headHtml = `<div class="itemHead">
                                    <span style="color: #4C8BE4;">${i18n_resource.tagTree.structure}</span>
                                    <div class="iconCtn">
                                        <span class="iconfont icon-huo"></span>
                                        <span class="iconfont icon-xue"></span>
                                    </div>
                                </div>
                                <ul id="${+new Date()}" class="itemList ztree">
                                </ul>`;
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
            if(activeEntitiesOld.length!=activeEntities.length){//外部删除触发
                let newIds = activeEntities.map(v=>v.id);
                let diff = activeEntitiesOld.filter(v=>(newIds.indexOf(v.id)<0));
                diff.forEach(v=>{
                    if(v.isParent){
                        this.cancelGroup(v);
                    }
                    this.zTreeObj.cancelSelectedNode(v);
                })
            }
            // 更新 activeAllEntities 字段
            selectedNodes = this.zTreeObj.getSelectedNodes();
            let activeAllEntities = this.getActiveAllEntities(selectedNodes);
            let activeAllEntitiesOld = this.diagnosis.conditionModel.activeAllEntities && this.diagnosis.conditionModel.activeAllEntities() || [];
            let differenceIds = this.getDiff(activeAllEntities, activeAllEntitiesOld);
            if (differenceIds.length > 0) {
                this.diagnosis.conditionModel.activeAllEntities && this.diagnosis.conditionModel.activeAllEntities(activeAllEntities);
            }
        }
        getIntactRate() {
            let _this = this;
            let pointsArr = [];
            this.data.forEach((v)=>{
                pointsArr.push('@'+this.projectId+'|'+v.realName + '_overHot');
                pointsArr.push('@'+this.projectId+'|'+v.realName+'_underCold');
            });
            let postData = {
                "dsItemIds": pointsArr
            }
            return WebAPI.post("/analysis/startWorkspaceDataGenPieChart", postData).done(function(data) {
                data = data.dsItemList;
                for (let i = 0, length = data.length; i < length; i++){
                    let point = data[i].dsItemId.split('|')[1];
                    let zoneName;
                    if (point.indexOf('underCold') !== -1){
                        zoneName = point.substring(0,point.length-10);
                    } else {
                        zoneName = point.substring(0,point.length-8);
                    }
                    let type = point.split('_')[point.split('_').length-1];
                    if (i === 0){
                        let json = {
                            name: '',
                            overHot: '',
                            underCold: ''
                        };
                        json.name = zoneName;
                        json[type] = data[i].data === 'Null' ? 0 : data[i].data;
                        _this.intactRateData.push(json);
                    } else {
                        let flag = true;
                        for (let j = 0, jlength = _this.intactRateData.length; j < jlength; j++){
                            if (zoneName === _this.intactRateData[j].name){
                                _this.intactRateData[j][type] = data[i].data === 'Null' ? 0 : data[i].data;
                                flag = false;
                            }
                        }
                        if (flag){
                            let json = {
                                name: '',
                                overHot: '',
                                underCold: ''
                            };
                            json.name = zoneName;
                            json[type] = data[i].data === 'Null' ? 0 : data[i].data;
                            _this.intactRateData.push(json);
                        }
                    }
                }
                _this.intactRateData.forEach((v) => {
                    let coldNum = v.underCold == 0 ? '-' : v.underCold;
                    let hotNum = v.overHot == 0 ? '-' : v.overHot;
                    $(`span[data-name=${v.name}]`, _this.container).eq(1).html(coldNum);
                    $(`span[data-name=${v.name}]`,_this.container).eq(0).html(hotNum);
                });
            });
        }
        getData() {
            let _this = this;
            var getUrlParam = function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }
            if (getUrlParam('tagTree')){
                return WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: ['@'+_this.projectId+'|thermalComfortTag_svr'] }).done( (rs)=> {
                    if (rs.dsItemList && rs.dsItemList.length !== 0 && rs.dsItemList[0].data !== ''){
                        var data = $.parseJSON(rs.dsItemList[0].data);
                        this.tagTreeData(data.data);
                    }
                })
            } else {
                return $.get('/diagnosis_v2/getEntities',{"projectId": _this.projectId}).done((rs)=>{
                    if (rs && rs.status == 'OK') {
                        this.tagTreeData(rs.data);
                    }
                });
            }
        }
        tagTreeData(data) {
            let $wrap = $(this.container).find('.itemList').html('');
            let parentIdSet = new Set();
            data.forEach((v) => {
                parentIdSet.add(v.parent);
            });
            data.forEach((v) => {
                if (parentIdSet.has(v.id)) {
                    v.iconSkin = `id_${v.id} iconfont icon-gailan none`;
                    v.titleName = "Zone Name: " + v.name;
                } else {
                    v.iconSkin = `id_${v.id} iconfont icon-xiayiji none`;
                    v.titleName = "Room Name: " + v.name;
                }
                v.realName = v.name.replace(/\s/g,'_') + '_'+v.id;
            });
            
            this.zTreeObj = $.fn.zTree.init($wrap, this.ztreeSetting, data);
            this.data = data;
            var parent = this.zTreeObj.getNodes()[0];
            this.zTreeObj.selectNode(parent);
            this.zTreeObj.expandNode(parent);
            this.diagnosis.conditionModel.activeEntities && this.diagnosis.conditionModel.activeEntities([parent]);
            this.updatePoints([parent]);
        }
        zTreeOnNodeCreated(e, treeId, treeNode) {
            var realName = treeNode.realName;
            let intactRate = this.intactRateData && this.intactRateData.find(v => v.name == realName);
            if (intactRate) {
                for (let key in intactRate) {
                    if (key !== 'name') {
                        let color;
                        if (key === 'underCold'){
                            color = 'rgb(54, 117, 246)';
                        } else if(key === 'overHot'){
                            color = 'rgb(201, 75, 48)';
                        }
                        let span = document.createElement('SPAN');
                        span.dataset.id = treeNode.id;
                        span.dataset.name = realName;
                        let num = (intactRate && intactRate[key]) == '0' ? '-' : intactRate[key];
                        span.innerHTML = num;
                        span.classList.add('intactRate');
                        span.classList.add('itemEnd');
                        span.style.color = color;
                        e.target.querySelector(`.id_${treeNode.id}`).parentNode.appendChild(span);
                    }
                }
            } else {
                let colorArr = ['rgb(201, 75, 48)','rgb(54, 117, 246)'];
                for (let i = 0; i < 2; i++) {
                    let span = document.createElement('SPAN');
                    span.dataset.id = treeNode.id;
                    span.dataset.name = realName;
                    span.innerHTML = '-';
                    span.classList.add('intactRate');
                    span.classList.add('itemEnd');
                    span.style.color = colorArr[i];
                    e.target.querySelector(`.id_${treeNode.id}`).parentNode.appendChild(span);
                }
            }
        }
        zTreeOnClick(event, treeId, treeNode, flag) {
            var _this = this;
            if (!event.ctrlKey) { 
                let oldActiveEntities = this.diagnosis.conditionModel.activeEntities();
                let isCancel = false,index;
                for (let i = 0, length = oldActiveEntities.length; i < length;i++){
                    if (treeNode.id === oldActiveEntities[i].id){
                        isCancel = true;
                        index = i;
                    }
                }
                if (!isCancel){
                    if (treeNode.isParent) {
                        this.zTreeObj.expandNode(treeNode, true);
                    }
                    oldActiveEntities.forEach((v) => {
                        var treeNodeParents = _this.getAllParents(treeNode),
                            vParents = _this.getAllParents(v);
                        if (treeNodeParents.indexOf(v.id) === -1) {
                            if (vParents.indexOf(treeNode.id) !== -1){
                                
                            } else {
                                if (v.isParent){
                                    _this.zTreeObj.expandNode(v, false);
                                }
                                _this.getRootNode(v,false,treeNodeParents); 
                            }
                        }
                        
                    })
                } else {
                    if (treeNode.isParent){
                        this.zTreeObj.expandNode(treeNode, true);
                    }
                }
            }
            let selectedNodes = this.zTreeObj.getSelectedNodes();
            this.diagnosis.conditionModel.activeEntities(selectedNodes);
            this.updatePoints(selectedNodes);
        }
        getAllParents(treeNode) {
            var _this = this;
            var treeNodeParents = [];
            getAllParent(treeNode);
            function getAllParent(node) {
                if (node.level === 0){
                    return;
                }
                treeNodeParents.push(node.parent);
                var parent = _this.zTreeObj.getNodesByParam('id', node.parent, null);
                getAllParent(parent[0]);
            }
            return treeNodeParents;
        }
        getRootNode(node, isExpand, treeNodeParents) {
            if (node.level === 0){
                return;
            }
            var parentNode = this.zTreeObj.getNodesByParam('id', node.parent, null);
            if (parentNode[0].level === 0){
                return;
            }
            if (treeNodeParents.indexOf(parentNode[0].id) === -1){
                this.zTreeObj.expandNode(parentNode[0], isExpand);
                this.getRootNode(parentNode[0],isExpand,treeNodeParents);
            }
        }
        updatePoints(activeEntities) {
            let pointsArr = [];
            for (let i = 0, length = activeEntities.length; i < length; i++){
                var name = activeEntities[i].realName;
                pointsArr.push({
                    underCool: name + '_underCold',
                    overHot: name + '_overHot'
                });
            }
            this.diagnosis.conditionModel.activePoints && this.diagnosis.conditionModel.activePoints(pointsArr);
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
            let oldIds = a.map(v=>v[prop]),
                newIds = b.map(v=>v[prop]),
                oldIdsSet = new Set(oldIds),
                newIdsSet = new Set(newIds);
            let differenceIds = Array.from(new Set(oldIds.concat(newIds).filter(v => !oldIdsSet.has(v) || !newIdsSet.has(v))));
            return differenceIds;
        }
        getChildNode(node){
            var point = node
            if (typeof point == 'undefined'){
                point = this.screen.store[0]
            }
            if(point && point.hasOwnProperty('id')){
                return this.instance.getNodesByParam('parent',point['id'])
            }else{
                return [];
            }
        }
    }
    exports.TagTree = TagTree;
}(namespace('thermalComfort.Nav')));
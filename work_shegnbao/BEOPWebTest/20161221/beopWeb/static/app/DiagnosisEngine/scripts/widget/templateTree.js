/**
 * Created by win7 on 2016/5/20.
 */
(function(window){
    var _this;
    function TemplateTree(){
        _this=  this;
        _this.store = undefined;
        _this.ctn = undefined;
        _this.$modal = undefined;
        _this.tree = undefined;

        _this.opt = {
            click:function(){}
        };
    }
    TemplateTree.prototype = {
        modalCtnTpl:'\
                <div id="modalNodeTool" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="ttlNodeTool">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title" id="ttlNodeTool">Diagnosis Edit</h4>\
                            </div>\
                            <div class="modal-body">\
                            </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                                <button type="button" class="btn btnSure btn-primary">Save</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>',

        modalEditTpl:'\
                <div id="divAddModeSel" class="divSetPart">\
                    <label id="labelAddModeSel" class="labelSet">Add Mode:</label>\
                    <input type="radio" name="iptAddModeSel" id="iptAddSingle" class="iptAddModeSel" value="0" checked></input>\
                    Single\
                    <input type="radio" name="iptAddModeSel" id="iptAddMulti" class="iptAddModeSel" value="1"></input>\
                    Multiple\
                </div>\
                <div id="divDiagnosisNameEdit" class="form-group divSetPart">\
                    <label id="labelDiagnosisNameEdit" class="labelSet">Diagnosis Name:</label>\
                    <input class="form-control" type="text" id="iptDiagnosisNameEdit" value="<%name%>" \
                    placeholder = "set value like this: name<%x%> for batch"></input>\
                </div>\
                <div id="divBatchSet" class="form-group divSetPart">\
                    <label id="labelBatchSet" class="labelSet">Batch Configure:</label>\
                    <input class="form-control"type="text" id="iptBatchSet" disabled value=\'{\"x\":[\"1\",\"2\"]}\' \
                    placeholder =\'{\"x\":[\"1\",\"2\"]}\'></input>\
                </div>',
        initOpt:function(){
            _this.defaultOpt = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: '_id',
                        pIdKey:'tempGrpId'
                    }
                },
                keep: {
                    leaf: true,
                    parent: true
                },
                edit: {
                    enable: true,
                    drag: {
                        isCopy: false,
                        isMove: false
                    },
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                view: {
                    addDiyDom: _this.beforeDomAdd,
                    addHoverDom: function () {
                    },
                    removeHoverDom: function () {
                    },
                    dblClickExpand: false,
                    showIcon: true,
                    showLine: true
                },
                callback: {
                    onClick:_this.onDomClk
                }
            }
        },
        beforeDomAdd:function(treeId,treeNode){
            var target = document.getElementById(treeNode['tId'] + '_a');

            if(!treeNode.tempGrpId) {
                var btnAdd = document.createElement('span');
                btnAdd.className = 'btnAdd btnNodeTool glyphicon glyphicon-plus';
                target.appendChild(btnAdd);
            }

            if(treeNode.tempGrpId) {
                var btnEdit = document.createElement('span');
                btnEdit.className = 'btnEdit btnNodeTool glyphicon glyphicon-pencil';
                target.appendChild(btnEdit);

                var btnDel = document.createElement('span');
                btnDel.className = 'btnDel btnNodeTool glyphicon glyphicon-remove';
                target.appendChild(btnDel);
            }

            if(!treeNode.tempGrpId){
                target.className += ' group'
            }
        },

        onDomClk:function(e,treeId,treeNode){
            var $target = $(e.target);
            if ($target.hasClass('btnAdd')){
                _this.editDiagnosis(treeNode,true);
            }else if ($target.hasClass('btnEdit')){
                _this.editDiagnosis(treeNode);
            }else if ($target.hasClass('btnDel') && treeNode.getParentNode()){
                    infoBox.confirm('Are you sure to delete diagnosis:' + treeNode.name +' ? The operation cannot recover.',okCallback);
                    function okCallback(){
                        var postData = [treeNode['_id']];
                        WebAPI.post('/diagnosisEngine/removeThing',postData ).done(function(e){
                            _this.tree.removeNode(treeNode);
                        }).error(function(){
                            alert('Delete fail！')
                        });
                    }
            }else{
                _this.opt.click[AppConfig.module] && _this.opt.click[AppConfig.module](e,treeNode)
            }
        },


        editDiagnosis:function(treeNode,isAdd){
            if(!_this.$modal) {
                _this.$modal = $(_this.modalCtnTpl);
            }

            var divBatchSet;
            var divAddModeSel;
            if (!isAdd){
                _this.$modal.find('.modal-body').html(_this.modalEditTpl.replace('<%name%>', treeNode.name));
                divBatchSet = _this.$modal.find('#divBatchSet')[0];
                divAddModeSel = _this.$modal.find('#divAddModeSel')[0];
                divBatchSet.style.display = 'none';
                divAddModeSel.style.display = 'none';
            }else{
                _this.$modal.find('.modal-body').html(_this.modalEditTpl.replace('<%name%>', treeNode.name));
                divBatchSet = _this.$modal.find('#divBatchSet')[0];
                divAddModeSel = _this.$modal.find('#divAddModeSel')[0];
                divBatchSet.style.display = 'block';
                divAddModeSel.style.display = 'block';
            }

            var iptBatchSet = _this.$modal.find('#iptBatchSet')[0];
            _this.$modal.find('.iptAddModeSel').off('click').on('click',function(e){
                var name = document.getElementById('iptDiagnosisNameEdit').value;
                if (e.target.id == 'iptAddMulti'){
                    iptBatchSet.disabled = false;
                    if (name.indexOf('<%x%>') < 0){
                        name += '<%x%>';
                    }
                }else{
                    name = name.replace(/<%x%>/g,'');
                    iptBatchSet.disabled = true;
                }
                document.getElementById('iptDiagnosisNameEdit').value = name;
            });


            _this.$modal.find('.btnSure').off('click').on('click',function(){
                var postData ;
                if (isAdd) {
                    if (document.getElementById('iptAddMulti').checked) {
                        postData = _this.getThingBatch(treeNode);
                    } else {
                        postData = [{
                            'name': document.getElementById('iptDiagnosisNameEdit').value,
                            'type': treeNode.type,
                            'projId': treeNode.projId,
                            'srcPageId': '',            //对应Factory中pageScreen的ID，用于加载诊断底图
                            'dictVariable': {},         //变量字典，标识诊断中用到的变量
                                                        //变量名: 数据源ID， 若数据源ID为空，则表示配对失败
                            'dictAlgorithm': {}         //诊断字典，记录该诊断对象中所应用的策略
                        }]
                    }
                }else{
                    postData = [{
                        '_id': treeNode['_id'],
                        'name': document.getElementById('iptDiagnosisNameEdit').value,
                        'type': treeNode.type,
                        'projId': treeNode.projId,
                        'srcPageId': treeNode.srcPageId,        //对应Factory中pageScreen的ID，用于加载诊断底图
                        'dictVariable': treeNode.dictVariable, //变量字典，标识诊断中用到的变量
                                                               //变量名: 数据源ID， 若数据源ID为空，则表示配对失败
                        'dictAlgorithm': treeNode.dictAlgorithm    //诊断字典，记录该诊断对象中所应用的策略
                    }]
                }
                if (!postData)return;
                WebAPI.post('/diagnosisEngine/saveThings',postData).done(function(result){
                    if (isAdd) {
                        for (var i = 0 ; i < postData.length; i++) {
                            postData[i]['_id'] = result.data[i];
                            postData[i].tempGrpId = treeNode['_id'];
                        }
                        _this.tree.addNodes(treeNode, postData);
                    }else{
                        treeNode.name = document.getElementById('iptDiagnosisNameEdit').value;
                        _this.tree.updateNode(treeNode);
                    }
                    _this.store = _this.tree.transformToArray(_this.tree.getNodes());
                    if(isAdd) {
                        alert('Add success！')
                    }else{
                        alert('Edit success！')
                    }
                    _this.$modal.modal('hide');
                }).error(function(){
                    if(isAdd) {
                        alert('Add fail！')
                    }else{
                        alert('Edit fail！')
                    }
                });
            });
            _this.$modal.modal('show');
        },

        getThingBatch:function(treeNode){
            var arrThing = [];
            var batchSet = document.getElementById('iptBatchSet').value;
            var name = document.getElementById('iptDiagnosisNameEdit').value.replace(/'/g,'"');
            var newNode = '';
            try {
                var dictBatch = JSON.parse(batchSet);
                for (var ele in dictBatch){
                    for (var i = 0; i < dictBatch[ele].length ;i++) {
                        arrThing.push({
                            'name':name.replace(new RegExp('<%' + ele + '%>' ,'g'),dictBatch[ele][i]),
                            'type':treeNode.type,
                            'projId':treeNode.projId,
                            'srcPageId': '',            //对应Factory中pageScreen的ID，用于加载诊断底图
                            'dictVariable': {},         //变量字典，标识诊断中用到的变量
                                                        //变量名: 数据源ID， 若数据源ID为空，则表示配对失败
                            'dictAlgorithm': {}        //诊断字典，记录该诊断对象中所应用的策略
                        })
                    }
                }
            }catch(e){
                infoBox.alert('The batch set format is not json,please check!');
                return false;
            }
            return arrThing;
        },

        setData:function(store,opt){
            _this.store = store;
            _this.initOpt();
            _this.setOpt(opt)
            _this.initTree();
        },

        setOpt:function(opt){
            if(opt)_this.opt = $.extend(true, {}, _this.opt, opt);
        },

        initTree:function(){
            if(!_this.ctn){
                if(_this.PanelToggle && _this.PanelToggle.panelLeft){
                    _this.ctn = _this.PanelToggle.panelLeft;
                }else{
                    _this.ctn = document.getElementById('panelLeft')
                }
            }

            if (_this.tree && _this.tree.destroy)_this.tree.destroy();
            _this.tree = $.fn.zTree.init($(_this.ctn), _this.defaultOpt, _this.store);

        },

        refresh:function(){
            WebAPI.get('/diagnosisEngine/getThingListByProjId/' + AppConfig.projectId).done(function(result){
                if (!result || result.data.length == 0)return;
                var dictGrp = {};
                var arrGrp= [];
                WebAPI.get('/iot/getClassFamily/thing/cn').done(function(dictCls){
                    for (var i = 0; i < result.data.length ;i++){
                        if (!dictGrp[result.data[i].type]){
                            dictGrp[result.data[i].type] = {
                                '_id':ObjectId(),
                                'type':result.data[i].type,
                                'projId':AppConfig.projectId,
                                'open':true
                            };
                            if(dictCls[result.data[i].type] && dictCls[result.data[i].type].name){
                                dictGrp[result.data[i].type].name = dictCls[result.data[i].type].name;
                            }else{
                                dictGrp[result.data[i].type].name = result.data[i].type;
                            }
                            arrGrp.push(dictGrp[result.data[i].type])
                        }
                        result.data[i].tempGrpId = dictGrp[result.data[i].type]['_id'];
                    }
                    _this.store =[].concat(arrGrp,result.data);
                    _this.initTree();
                })
            })
        }
    };
    window.TemplateTree = new TemplateTree();
    window.TemplateTree.initOpt();
})(window);
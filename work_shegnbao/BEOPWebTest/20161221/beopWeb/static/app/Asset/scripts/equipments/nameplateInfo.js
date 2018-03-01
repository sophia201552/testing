/**
 * Created by vicky on 2016/1/28.
 */
var NameplateInfo =(function(){
    var _this;
    function NameplateInfo(screen, $parentPane){
        _this = this;
        this.screen = screen;
        this.$panel = $parentPane;
    }

    NameplateInfo.prototype.show = function(data) {
        var $btnEditNameplate = $('#btnEditNameplate');
        var $btnSaveNameplate = $('#btnSaveNameplate');
        var $btnCancelNameplate = $('#btnCancelNameplate');
        var $btnAddNameplate = $('#btnAddNameplate');
        var $nameplateInfo = $('#divNameplate');
        var postDataId = data[0].id;
        //var $nameplateType = $('#nameplateType');
        var nameplateAttr;
        var nameplateName;
        var nameplateId, nameplateNId;
        var $defaultNameplateType;
        var $selectNameplateType;
        if (data[0].model) {
            WebAPI.get('/asset/getModel/' + data[0].model).done(function (result) {
                var $tabCtn = $nameplateInfo.empty();
                var $nameplateType = $('#nameplateType').empty();
                var nameplateApl = '';
                $defaultNameplateType = $('#defaultNameplatetype');
                $selectNameplateType = $('#selectNameplatetype');
                $btnEditNameplate.show();
                $btnAddNameplate.hide();
                $btnSaveNameplate.hide();
                $btnCancelNameplate.hide();

                if (!result.data) {
                    nameplateApl += '<div class="form-group"><label for="nameplateSortinfo" style="width: 30%"></label><input type="text" class="form-control divValue" id="nameplateSortinfo" style="width: 65%;" placeholder="" disabled value=""></div>'
                    $nameplateType.append('<div class="form-group" id="defaultNameplatetype"><label for="nameplateType">型号</label><input type="text" class="form-control divValue" id="nameplateType" disabled  placeholder="" value="未分配"></div>' +
                    '<div class="form-group" id="selectNameplatetype" style="display:none;"><label for="nameplateType">型号</label>' +
                    '<select class="form-control" style="width:65%;" id="selectVal"><option>未分配</option><option id="liNewbuild">新建</option></select></div>')
                    $tabCtn.append(nameplateApl);
                } else {
                    nameplateAttr = result.data.attr;
                    if (result.data.name) {
                        nameplateName = result.data.name;
                    } else {
                        nameplateName = '未分配';
                    }
                    nameplateId = result.data._id;
                    nameplateNId = result.data._id;
                    for (var i in nameplateAttr) {
                        nameplateApl += '<div class="form-group"><label for="nameplateSortinfo" style="width: 30%">' + i + '</label><input type="text" class="form-control divValue" id="nameplateSortinfo" style="width: 65%;" placeholder="" disabled value="' + nameplateAttr[i] + '"></div>'
                    }
                    $nameplateType.append('<div class="form-group" id="defaultNameplatetype"><label for="nameplateType">型号</label><input type="text" class="form-control divValue" id="nameplateType" disabled  placeholder="" value="' + nameplateName + '"></div>' +
                        '<div class="form-group" id="selectNameplatetype" style="display:none;"><label for="nameplateType">型号</label>' +
                        '<select class="form-control" style="width:65%;" id="selectVal"><option>' + nameplateName + '</option><option id="liNewbuild">新建</option></select></div>')
                    $tabCtn.append(nameplateApl);
                }
                var getNode = _this.screen.screen.filterPanel.tree.getNodesByParam('_id', data[0].id)[0];
                WebAPI.get('/asset/getModelList/' + getNode.getPath()[0]['_id'] + '/' + getNode.type).done(function (result) {
                    var allModal = '';
                    for (var i in result.data) {
                        allModal += '<option id="' + i + '">' + result.data[i] + '</option>';
                    }
                    $('#selectVal').append(allModal);
                });
                //新建铭牌
                $('#selectVal').change(function () {
                    var curDomId = $("#selectVal option:selected").attr('id');
                    if(!curDomId){
                        return;
                    }
                    var currentId = $("#selectVal option:selected").attr('id').substr(0);
                    nameplateId = currentId;
                    $('#divNewtype').remove();
                    if (currentId && currentId.length === 24) {
                        var slectnameplateApl = '';
                        WebAPI.get('/asset/getModel/' + currentId).done(function (result) {
                            var slectnameplateAttr = result.data.attr;
                            for (var b in slectnameplateAttr) {
                                slectnameplateApl += '<div class="form-group"><label for="nameplateSortinfo" style="width: 30%">' +
                                    '<input type="text" class="form-control divValue" style="width: 100%;margin:0 0 3px;margin:  -6px 0;" value="' + b + '"></label>' +
                                    '<input type="text" class="form-control divValue" id="nameplateSortinfo" style="width: 65%;" placeholder="" value="' + slectnameplateAttr[b] + '"></div>'
                            }
                            $tabCtn.empty().append(slectnameplateApl);
                        });
                    }
                    if ($('#selectVal').val() == $('#liNewbuild').val()) {
                        nameplateId = null;
                        $selectNameplateType = $('#selectNameplatetype');
                        $defaultNameplateType = $('#defaultNameplatetype');
                        var $form = $nameplateInfo.empty();
                        var $nameplateType = $('#nameplateType');
                        $btnSaveNameplate.show();
                        $btnCancelNameplate.show();
                        $btnAddNameplate.show();
                        $defaultNameplateType.hide();
                        $selectNameplateType.show();
                        //for (var i in nameplateAttr) {
                            $form.append('<div class="form-group"><label for="nameplateSortinfo" style="width: 30%"><input type="text" class="form-control divValue" style="width: 100%;margin:0 0 3px;margin:  -6px 0;"></label><input type="text" class="form-control divValue" id="nameplateSortinfo" style="width: 65%;" placeholder="" value=""></div>')
                        //}
                        $('#divNewtype').remove();
                        $nameplateType.append('<div class="form-group" id="divNewtype"><label for="nameplateType" style="width: 30%">Name</label>' +
                            '<input type="text" class="form-control divValue" id="nameplateSortinfo" placeholder="" style="width: 65%;"></div>')
                    }
                });
            }).fail(function(){
                var $tabCtn = $nameplateInfo.empty();
                var $nameplateType = $('#nameplateType').empty();
                var nameplateApl = '';
                nameplateApl += '<div class="form-group"><label for="nameplateSortinfo" style="width: 30%"></label><input type="text" class="form-control divValue" id="nameplateSortinfo" style="width: 65%;" placeholder="" disabled value=""></div>';
                $nameplateType.append('<div class="form-group" id="defaultNameplatetype"><label for="nameplateType">型号</label><input type="text" class="form-control divValue" id="nameplateType" disabled  placeholder="" value="未分配"></div>' +
                '<div class="form-group" id="selectNameplatetype" style="display:none;"><label for="nameplateType">型号</label>' +
                '<select class="form-control" style="width:65%;" id="selectVal"><option>未分配</option><option id="liNewbuild">新建</option></select></div>')
                $tabCtn.append(nameplateApl);
                _this.nameSelect(nameplateId,data);
            });
        }else{
            var $tabCtn = $nameplateInfo.empty();
            var $nameplateType = $('#nameplateType').empty();
            var nameplateApl = '';
            nameplateApl += '<div class="form-group"><label for="nameplateSortinfo" style="width: 30%"></label><input type="text" class="form-control divValue" id="nameplateSortinfo" style="width: 65%;" placeholder="" disabled value=""></div>';
            $nameplateType.append('<div class="form-group" id="defaultNameplatetype"><label for="nameplateType">型号</label><input type="text" class="form-control divValue" id="nameplateType" disabled  placeholder="" value="未分配"></div>' +
            '<div class="form-group" id="selectNameplatetype" style="display:none;"><label for="nameplateType">型号</label>' +
            '<select class="form-control" style="width:65%;" id="selectVal"><option>未分配</option><option id="liNewbuild">新建</option></select></div>')
            $tabCtn.append(nameplateApl);
            _this.nameSelect(nameplateId,data);
        }
        

        //编辑铭牌
        $('#btnEditNameplate').off('click').on('click', function () {
            //var $form = $nameplateInfo.empty();
            $defaultNameplateType = $('#defaultNameplatetype');
            $selectNameplateType = $('#selectNameplatetype');
            $btnSaveNameplate.show();
            $btnCancelNameplate.show();
            $btnAddNameplate.show();
            $btnEditNameplate.hide();
            //nameplateId = nameplateNId;
            $defaultNameplateType.hide();
            $selectNameplateType.show();
            if ($('#divNewtype')) {
                $('#divNewtype input').attr('disabled', false);
            }
            $nameplateInfo.find('.form-group input').prop('disabled', false);
            var $label = $nameplateInfo.find('.form-group label');
            var len = $label.length;
            for (var i = 0; i < len; i++) {
                var $labelVal = $label[i].innerHTML;
                $label[i].innerHTML = '<input type="text" class="form-control divValue" style="width: 100%;margin:0 0 3px;margin:  -6px 0;" value="' + $labelVal + '">'
            }
            $('#selectVal').val($('#defaultNameplatetype input').val());
        });
        //添加铭牌信息
        $btnAddNameplate.off('click').on('click', function () {
            $nameplateInfo.append('<div class="form-group"><label for="nameplateSortinfo" style="width: 30%"><input type="text" class="form-control divValue" style="width: 100%;margin:0 0 3px;margin:  -6px 0;"></label><input type="text" class="form-control divValue" id="nameplateSortinfo" style="width: 65%;" placeholder="" value=""></div>');
        });

        //保存铭牌信息
        $btnSaveNameplate.off('click').on('click',function(){
            var $formGroup = $nameplateInfo.find('.form-group');
            var $labelInput = $nameplateInfo.find('.form-group label input');
            var $input = $nameplateInfo.find('.form-group>input');
            var $label = $nameplateInfo.find('.form-group label');
            var dictAttr = {};
            var data, projectId = (function(arr){
                for(var i = 0; i < arr.length; i++){
                    if(arr[i]._id == _this.screen.arrAsset[0].id){
                        return arr[i].projId;
                    }
                }
            }(_this.screen.screen.filterPanel.store.things));

            for(var i=0;i<$formGroup.length;i++){
                if($labelInput[i].value == ''){
                    $($label[i]).remove();
                }
                if ($input[i].value == ''){
                    $($input[i]).remove();
                }
                if($labelInput[i].value == '' && $input[i].value == ''){
                    $($formGroup[i]).remove();
                }
                if(!$labelInput[i].value || !$input[i].value){

                }else{
                    var k = $labelInput[i].value;
                    var v = $input[i].value.toString();
                    dictAttr[k] = v;
                }

            };

            data= {
                _id: nameplateId,
                name: $('#selectVal').val(),
                attr: dictAttr
            };

            var len = $labelInput.length;
            $selectNameplateType = $('#selectNameplatetype');
            $defaultNameplateType = $('#defaultNameplatetype');
            $nameplateInfo.find('.form-group input').prop('disabled',true);
            for(var i=0;i<len;i++){
                var $inputVal = $labelInput[i].value;
                $label[i].innerHTML = $inputVal;
            }
            $btnSaveNameplate.hide();
            $btnCancelNameplate.hide();
            $btnAddNameplate.hide();
            $btnEditNameplate.show();
            $('#divNewtype input').attr('disabled',true);
            $selectNameplateType.hide();

            if($('#divNewtype input').val() || $('#divNewtype input').val() == ""){
                $('#divNewtype input').val($('#divNewtype input').val());
                data.name = $('#divNewtype input').val();
            }else{
                $defaultNameplateType.show();
                $('#defaultNameplatetype input').val($('#selectVal').val());
            }
            //var getNode = _this.screen.screen.filterPanel.tree.getSelectedNodes()[0];
            var getNode = _this.screen.screen.filterPanel.tree.getNodeByParam('_id',_this.screen.screen.$tbAsset.find('.selected').attr('data-id'));
            data.class = getNode.type;
            WebAPI.post('/asset/saveModel/' + getNode.getPath()[0]['_id'], data).done(function (result) {
                if(result.data != 'None'){
                    data._id = result.data;
                }
                var postData = {
                    _id: postDataId,
                    model: data._id,
                    projId: AppConfig.projectId
                };
                $('#tbAsset tr[data-id ='+postDataId+']').attr('data-model',data._id);
                WebAPI.post('/asset/saveThing', postData).done(function(result){
                    if(result.data){
                        $('#selectVal').append("<option id="+ data._id +">"+ data.name +"</option>");
                    }
                }).always(function(){

                });
            }).always(function(){

            });
        });
        //取消铭牌信息
        $btnCancelNameplate.off('click').on('click', function () {
            var $form = $nameplateInfo.empty();
            $selectNameplateType = $('#selectNameplatetype');
            $defaultNameplateType = $('#defaultNameplatetype');
            nameplateId = nameplateNId;
            for (var i in nameplateAttr) {
                $form.append('<div class="form-group"><label for="nameplateSortinfo" style="width: 30%">' + i + '</label><input type="text" class="form-control divValue" id="nameplateSortinfo" style="width:65%;" placeholder="" value="' + nameplateAttr[i] + '"></div>')
            }
            $nameplateInfo.find('.form-group input').prop('disabled', true);
            $btnSaveNameplate.hide();
            $btnCancelNameplate.hide();
            $btnAddNameplate.hide();
            $btnEditNameplate.show();
            $selectNameplateType.hide();
            $defaultNameplateType.show();
            $defaultNameplateType.children('input').val(nameplateName);
            $('#divNewtype').remove();
        })

    };
    NameplateInfo.prototype.nameSelect = function(nameplateId,data){
        var $selectNameplateType,$defaultNameplateType;
        var nameplateAttr = {};
        var $btnSaveNameplate = $('#btnSaveNameplate');
        var $btnCancelNameplate = $('#btnCancelNameplate');
        var $btnAddNameplate = $('#btnAddNameplate');
        var $nameplateInfo = $('#divNameplate');
        var $tabCtn = $nameplateInfo.empty();
        var getNode = _this.screen.screen.filterPanel.tree.getNodesByParam('_id', data[0].id)[0];
        WebAPI.get('/asset/getModelList/' + getNode.getPath()[0]['_id'] + '/' + getNode.type).done(function (result) {
            var allModal = '';
            for (var i in result.data) {
                allModal += '<option id="' + i + '">' + result.data[i] + '</option>';
            }
            $('#selectVal').append(allModal);
        });
        //新建铭牌
        $('#selectVal').change(function () {
            var curDomId = $("#selectVal option:selected").attr('id');
            if(!curDomId){
                return;
            }
            var currentId = $("#selectVal option:selected").attr('id').substr(0);
            nameplateId  = currentId;
            $('#divNewtype').remove();
            if (currentId && currentId.length === 24) {
                var slectnameplateApl = '';
                WebAPI.get('/asset/getModel/' + currentId).done(function (result) {
                    var slectnameplateAttr = result.data.attr;
                    for (var b in slectnameplateAttr) {
                        slectnameplateApl += '<div class="form-group"><label for="nameplateSortinfo" style="width: 30%">' +
                            '<input type="text" class="form-control divValue" style="width: 100%;margin:0 0 3px;margin:  -6px 0;" value="' + b + '"></label>' +
                            '<input type="text" class="form-control divValue" id="nameplateSortinfo" style="width: 65%;" placeholder="" value="' + slectnameplateAttr[b] + '"></div>'
                    }
                    $tabCtn.empty().append(slectnameplateApl);
                });
            }
            if ($('#selectVal').val() == $('#liNewbuild').val()) {
                nameplateId = null;
                $selectNameplateType = $('#selectNameplatetype');
                $defaultNameplateType = $('#defaultNameplatetype');
                var $form = $nameplateInfo.empty();
                var $nameplateType = $('#nameplateType');
                $btnSaveNameplate.show();
                $btnCancelNameplate.show();
                $btnAddNameplate.show();
                $defaultNameplateType.hide();
                $selectNameplateType.show();
                //for (var i in nameplateAttr) {
                    $form.append('<div class="form-group"><label for="nameplateSortinfo" style="width: 30%"><input type="text" class="form-control divValue" style="width: 100%;margin:0 0 3px;margin:  -6px 0;"></label><input type="text" class="form-control divValue" id="nameplateSortinfo" style="width: 65%;" placeholder="" value=""></div>')
                //}
                $('#divNewtype').remove();
                $nameplateType.append('<div class="form-group" id="divNewtype"><label for="nameplateType" style="width: 30%">Name</label>' +
                    '<input type="text" class="form-control divValue" id="nameplateSortinfo" placeholder="" style="width: 65%;"></div>')
            }
        });
    };
    NameplateInfo.prototype.close = function(){};

    return NameplateInfo;

}());

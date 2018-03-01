/**
 * Created by vicky on 2015/9/21.
 */
var ModalReportChapter = (function(){
    function ModalReportChapter(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalReportChapter.prototype = new ModalBase();
    ModalReportChapter.prototype.optionTemplate = {
        name:'toolBox.modal.REPORT_CHAPTER',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 30,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalReportChapter'
    };

    ModalReportChapter.prototype.show = function(){
        this.init();
    }

    ModalReportChapter.prototype.init = function(){

    }

    ModalReportChapter.prototype.renderModal = function (e) {
        var _this = this;
        var postData = {
            projectId: AppConfig.projectId,
            menuId: this.entity.modal.option.menuId,
            chapter: this.entity.modal.option.chapter,
            unit: this.entity.modal.option.unit
        };
        WebAPI.post('/report/getReportHtml/', postData).done(function(result){
            if(result.success){
                _this.spinner && _this.spinner.stop();
                _this.container.innerHTML = result.data;
                _this.reportScreen = new ReportScreen();
                _this.reportScreen.renderCharts($('#beopReport .report-unit'))
            }else{
                alert(result.msg);
            }
        }).always(function(){
            _this.spinner && _this.spinner.stop();
        });
    }

    ModalReportChapter.prototype.showConfigMode = function () {

    }
    ModalReportChapter.prototype.updateModal = function (points) {

    }
    ModalReportChapter.prototype.setModalOption = function (option) {

    }
    ModalReportChapter.prototype.modalDialog = '\
        <div class="modal-content">\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>\
                <h4 class="modal-title" id="">Config</h4>\
            </div>\
            <div class="modal-body">\
                <div class="row" style="margin-bottom: 15px;">\
                    <div class="col-xs-4">\
                        <label>Type</label>\
                    </div>\
                    <div class="col-xs-4">\
                        <select id="typeList" class="form-control type"></select>\
                    </div>\
                </div>\
                <div class="row" style="margin-bottom: 15px;">\
                    <div class="col-xs-4">\
                        <label>Chapter</label>\
                    </div>\
                    <div class="col-xs-4" id="chapterList">\
                    </div>\
                </div>\
                <div class="row" style="margin-bottom: 15px;">\
                    <div class="col-xs-4">\
                        <label>Section</label>\
                    </div>\
                    <div class="col-xs-4" id="unitList">\
                    </div>\
                </div>\
            </div>\
            <div class="modal-footer">\
                <div id="configAlert"></div>\
                <button type="button" class="btn btn-primary" id="confirm">Confirm</button>\
            </div>\
        </div>';

    ModalReportChapter.prototype.showConfigModal = function () {
        var _this = this;
        var $dialogModal = $('#dialogModal');
        var $dialogContent = $dialogModal.find('#dialogContent').html(this.modalDialog);
        var $modalBody = $dialogContent.find('.modal-body');
        var $confirm = $dialogContent.find('#confirm');
        $dialogModal.modal('show');
        Spinner.spin($dialogContent.find('.modal-content')[0]);
        WebAPI.get('/report/getReportMenu/' + AppConfig.projectId)
            .done(function(result){
                var $typeList = $modalBody.find('#typeList').empty();
                var $chapterList = $modalBody.find('#chapterList').empty();
                var $unitList = $modalBody.find('#unitList').empty();
                //把数据处理成下拉框
                var typeTemp = '', $firstUnitSelect, $firstChapterSelect;

                if(result.data && result.data.length > 0){
                    for(var i = 0; i < result.data.length; i++){
                        var type = result.data[i];
                        typeTemp += ('<option value="'+ type._id +'" id="'+ i +'">'+ type.text +'</option>');
                        var $selectChapter = $('<select id="chapter_'+ i +'" class="form-control chapter" style="display: none;"></select>');
                        if(type.structure && type.structure.data && type.structure.data.length > 0){
                            $selectChapter.append('<option value="all" class="type">All Chapter</option>')
                            for(var j = 0; j < type.structure.data.length; j++){
                                var chapter = type.structure.data[j];
                                $selectChapter.append('<option value="'+ chapter.name +'" id="'+ j +'" parentId="'+ i +'">'+ chapter.name +'</option>');
                                var $selectUnit = $('<select id="unit_'+ i + '_' + j +'" class="form-control unit" style="display: none;"></select>');
                                if(chapter.units && chapter.units.length > 0){
                                    $selectUnit.append('<option value="all">All Section</option>');
                                    for(var k = 0; k < chapter.units.length; k++){
                                        var unit = chapter.units[k];
                                        $selectUnit.append('<option value="'+ unit.unitName +'" id="'+ k +'" parentId="'+ j +'">'+ unit.unitName +'</option>');
                                    }
                                }else{
                                    $selectUnit.append('<option value="no">No Section</option>');
                                }
                                $unitList.append($selectUnit);
                            }
                        }else{
                           $selectChapter.append('<option value="no" class="type">No Chapter</option>')
                        }
                         $chapterList.append($selectChapter);
                    }
                }else{
                    typeTemp += '<option value="no" class="type">No type</option>';
                }

                $typeList.html(typeTemp);
                $firstChapterSelect = $chapterList.find('select:eq(0)').show();
                $firstUnitSelect = $unitList.find('select:eq(0)').show();
                if($firstChapterSelect.length == 0){
                    $chapterList.append('<select class="form-control chapter no"><option value="no" class="type">No Section</option></select>');
                }
                if($firstUnitSelect.length == 0){
                    $unitList.append('<select class="form-control unit no"><option value="no" class="type">No Section</option></select>');
                }

                //如果是编辑模式,显示已选择选项
                if(_this.entity.modal.option && result.data && result.data.length > 0){
                    var $selectedChapter = undefined;//编辑状态时选择的章对应的下拉框
                    var $selectedUnit = undefined;
                    var $typeOption = undefined;
                    var $chapterOption = undefined;
                    if(_this.entity.modal.option.menuId){
                        $typeList.val(_this.entity.modal.option.menuId);
                        $typeOption = $typeList.find('option[value="'+ _this.entity.modal.option.menuId +'"]');
                    }
                    if(_this.entity.modal.option.chapter != undefined){
                        $chapterList.children().hide();
                        $selectedChapter = $chapterList.find('#chapter_' + $typeOption.attr('id'));
                        $selectedChapter.show()
                        if(_this.entity.modal.option.chapter != ''){//all
                            $selectedChapter.val(_this.entity.modal.option.chapter);
                            $chapterOption = $selectedChapter.find('option[value="'+ _this.entity.modal.option.chapter +'"]');
                        }
                    }
                    if(_this.entity.modal.option.unit != undefined && $chapterOption != undefined && $chapterOption.length > 0){
                        $unitList.children().hide();
                        $selectedUnit = $unitList.find('#unit_'+ $chapterOption.attr('parentId') +'_'+ $chapterOption.attr('id'));
                        $selectedUnit.show()
                        if(_this.entity.modal.option.unit != ''){//all
                            $selectedUnit.val(_this.entity.modal.option.unit)
                        }
                    }
                }


                //attach event
                $modalBody.off('change').on('change','select',function(){
                    //删除累赘dom
                    $modalBody.find('select.no').remove();
                   //如果有下一级选项,显示下一级选项,隐藏不相干选项
                    if($(this).hasClass('type')){//第一级下拉框发生change
                        //第二级下拉框
                        var typeId = $(this).find('option[value="'+ this.value +'"]')[0].id;
                        var $chapterSelect = $('#chapter_'+ typeId);
                        $chapterList.children().hide();
                        $chapterSelect.show();
                        //第三级下拉框
                        var chapterId = $chapterSelect.find('option[value="'+ $chapterSelect[0].value +'"]').attr('id');
                        $unitList.children().hide();
                        if(chapterId){
                             var $unitSelect = $('#unit_' + typeId + '_' + chapterId);
                            $unitSelect.show();
                        }else if($chapterSelect[0].value == 'all'){
                            $unitList.append('<select class="form-control unit no"><option value="all">All Section</option></select>');
                        }else{
                            $unitList.append('<select class="form-control unit no"><option value="no" class="type">No Section</option></select>');
                        }
                    }
                    if($(this).hasClass('chapter')){
                        var $typeList = $('#typeList');
                        var typeId = $typeList.find('option[value="'+ $typeList[0].value +'"]')[0].id;
                        var $chapterSelect = $('#chapter_'+ typeId);
                        var chapterId = $chapterSelect.find('option[value="'+ this.value +'"]').attr('id');
                        $unitList.children().hide();
                        if(chapterId){
                             var $unitSelect = $('#unit_' + typeId + '_' + chapterId);
                            $unitSelect.show();
                        }else if($chapterSelect[0].value == 'all'){
                            $unitList.append('<select class="form-control unit no"><option value="all">All Section</option></select>');
                        }else{
                            $unitList.append('<select class="form-control unit no"><option value="no">No Section</option></select>');
                        }
                    }
                });
                $dialogModal.off('shown.bs.modal').on('shown.bs.modal', function () {

                });
                $dialogModal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                    $dialogContent.empty();
                });
                $confirm.off('click').on('click', function(){
                    var chapterVal = $chapterList.find('select:not(:hidden)')[0].value;
                    var unitVal = $unitList.find('select:not(:hidden)')[0].value;
                    var menuId = $typeList[0].value;
                    !_this.entity.modal.option && (_this.entity.modal.option = {});
                    _this.entity.modal.option.menuId = menuId == 'no' ? '' : menuId;
                    _this.entity.modal.option.chapter = (chapterVal == 'no' || chapterVal == 'all') ? '' : chapterVal;
                    _this.entity.modal.option.unit = (unitVal == 'no' || unitVal == 'all') ? '' : unitVal;
                    $dialogModal.modal('hide');
                    if(_this.entity.modal.option.menuId && _this.entity.modal.option.menuId != ''){
                        _this.screen.isScreenChange = true;
                    }
                });

            }).fail(function(){

            }).always(function(){
                 Spinner.stop();
            });
    };
    return ModalReportChapter;
})();

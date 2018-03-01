/// <reference path="../../lib/jquery-1.11.1.min.js" />
/// <reference path="../core/common.js" />
/// <reference path="analysis/analysisTendency.js" />
/// <reference path="analysis/analysisSpectrum.js" />
/// <reference path="analysis/analysisGroup.js" />

var AnlsWorkspace = (function () {
    var _this;

    var util = {
        checkbox: {
            // select all
            selectAll: function ($eles) {
                $eles.each(function () {
                    var $this = $(this);
                    if(!$this.hasClass('checked')) $this.addClass('checked');
                });
            },
            // select inverse
            selectInverse: function ($eles) {
                $eles.each(function () {
                    var $this = $(this);
                    $this[$this.hasClass('checked') ? 'removeClass' : 'addClass']('checked');
                });
            },
            // cancel select
            unSelectAll: function ($eles) {
                $eles.each(function (i) {
                    var $this = $(this);
                    if($this.hasClass('checked')) $this.removeClass('checked');
                });
            },
            isAllChecked: function ($eles) {
                return $eles.not('.checked').length <= 0;
            }
        }
    };

    function AnlsWorkspace(screen) {
        this.divWSPane = document.getElementById("divWSPane");
        this.screen = screen;
        this.sharpViewScreen = null;
        this.workspace = this.screen.store.workspaces;
        _this = this;
    }

    var $wsPane = $('#wsPane');

    AnlsWorkspace.prototype = {
        show: function () {
            this.init();
        },

        close: function () {
        },

        init: function () {
            $wsPane.html('');
            _this.setToolsBtnStatus();
            if (this.screen.store.workspaces && this.screen.store.workspaces.length > 0) {
                var $ddlWorkspace = $('.dropdownWS');
                var $ddlWorkspaceUl = $ddlWorkspace.next('ul');
                for (var i in this.screen.store.workspaces) {
                    var temp = this.screen.store.workspaces[i];
                    var $li = $('<li role="presentation">');
                    var $a = $('<a role="menuitem" tabindex="-1">')
                        .attr('project-id', temp.id)
                        .click(function () {
                            _this.selectWorkspace(this);
                        })
                        .text(temp.name);
                    $li.append($a);
                    $ddlWorkspaceUl.append($li);
                    //divPageCtList
                    var $divPageCt = $('<div class="divPageCt">').attr('id', 'divPageCt_' + temp.id).attr('ws-id', temp.id);
                    if (i == 0) {
                        $a.attr('selected', 'selected');
                        $ddlWorkspace.html($a.text() + '<span class="caret"></span>');
                        $divPageCt.show();
                    } else {
                        $divPageCt.hide();
                    }
                    if (temp.modalList && temp.modalList.length > 0) {
                        for (var j in temp.modalList) {
                            var tempData = temp.modalList[j];

                            //if(!tempData.option.itemDS) continue;
                            var $divPage = $('<div class="divPage slider-item">')
                                .attr('id', tempData.id).attr('modal-id', tempData.id);
                            if(tempData.imagebin){
                                $divPage.css({'background-image':'url('+ tempData.imagebin +')'});
                            }else{
                                $divPage.css({'background-image':'url('+ localStorage.getItem('img_' + tempData.id) +')'});
                            }
                                
                            var $input = _this.modalNameInput();
                            var $modalNameSp = $('<div class="modalNameSp"></div>').text(tempData.name).click(function (e) {
                                var text = $(this).hide().text();
                                $(this).next().text(text).show().focus();
                                e.stopPropagation();
                            });

                            if ($input.is(':hidden')) {
                                $modalNameSp.show();
                                $input.hide();
                            } else {
                                $modalNameSp.hide();
                            }
                            var $divPageTitle = $('<h4 class="divPageTitle">').append($modalNameSp).append($input);
                            var $btnRemove = $('<span class="btnRemove glyphicon glyphicon-remove-sign" title="Remove" aria-hidden="true"></span>')
                                .click(function (e) {
                                    _this.deleteDivPage(this);
                                    _this.synchronizeToSliderMatrix($wsPane);
                                    e.stopPropagation();
                                });
                            var $effectLayer = $('<div class="effect">');

                            // checkbox
                            var $cbSlider = $('<span class="slider-cb-wrap"><i class="slider-cb"></i></span>').click(function (e) {
                                $(this).parents('.slider-item').toggleClass('checked');
                                e.stopPropagation();
                            });

                            $divPage.append($divPageTitle).append($btnRemove).append($effectLayer).append($cbSlider);
                            $divPageCt.append($divPage);
                            $divPage.click(function (e) {
                                var modalId;
                                var isSelected = $(this).hasClass('selected');
                                // prevent repeat click
                                if(isSelected) return;

                                if(_this.screen.paneCenter.spinnerStop){
                                    _this.screen.paneCenter.spinnerStop();
                                }
                                $('.divPage').removeClass('selected');
                                $(this).addClass('selected');
                                modalId = $(this).attr('modal-id');
                                if (modalId) {
                                    _this.screen.renderModalById(modalId);
                                } else {
                                    _this.screen.refreshPaneCenter(new AnalysisTemplate(_this.screen));
                                }
                                _this.setToolsBtnStatus($(this));
                            });
                            $divPageCt.append($divPage);
                        }
                    }
                    $(this.divWSPane).append($divPageCt);

                    //_this.initDrag(temp.id);
                }
            } else {
                if ($('.dropdownWS').next('ul').children('li').length == 0) {
                    _this.workspaceAdd(0);
                }
            }

            _this.setSliderMarginTop();

            $('#btnPageAdd').click(_this.pageAdd);
            $('#btnPageUp').click(_this.pageUp);
            $('#btnPageDown').click(_this.pageDown);
            $('#btnPageAll').click(function(){
                var pointPanel = $('#addPointPanelContain');
                if (pointPanel.length > 0) {
                    pointPanel.remove();
                }
                _this.viewSliderMatrix();
                _this.toggleDataSource(false);
            });

            $('#btnWSAdd').click(_this.workspaceAdd);
            $('#btnWSDelete').click(_this.deleteWorkspace);
            $('#btnWSRename').click(_this.renameWorkspace);

            I18n.fillAreaAttribute($('#workspacePane'), 'title');
            I18n.fillAreaAttribute($('#divWSPane'), 'placeholder');
        },

        setSliderMarginTop: function(){
            $('.modalNameSp').each(function(){
                this.style.marginTop = -this.offsetHeight/2 + 10 + 'px';
                this.style.marginLeft = -this.offsetWidth/2 + 'px';
            });
        },

        //增加divPage
        pageAdd: function (isExternalCall) {
            var WSId = _this.getWorkspaceId();
            if ($('#divPageCt_' + WSId).find('#divPageTemp').length > 0) {
                alert('There has been a new page.');
            } else {
                _this.addSliderDom(isExternalCall);
                isExternalCall == true || _this.screen.refreshPaneCenter(new AnalysisTemplate(_this.screen));
                //_this.initDrag(WSId);
            }
        },
        //divPage上移
        pageUp: function () {
            var $thisPage = $('.divPage.selected');
            $($thisPage).insertBefore($thisPage.prev('.divPage'));
            _this.saveLayout($thisPage);
            _this.setToolsBtnStatus($thisPage);
        },
        //divPage下移
        pageDown: function () {
            var $thisPage = $('.divPage.selected');
            $($thisPage).insertAfter($thisPage.next('.divPage'));
            _this.saveLayout($thisPage);
            _this.setToolsBtnStatus($thisPage)
        },
        //保存layout
        saveLayout: function ($thisPage) {
            var $WS = $thisPage.closest('.divPageCt');
            var divPageList = $WS.children('.divPage');
            var modalList = [];
            for (var i = 0; i < divPageList.length; i++) {
                modalList.push($(divPageList[i]).attr('modal-id'))
            }
            WebAPI.post('/analysis/workspace/saveLayout/' + AppConfig.userId, {
                workspaceId: $WS.attr('ws-id'),
                modalList: modalList
            }).done(function () {

            }).error(function () {
                alert(I18n.resource.observer.analysis.SORT_FAILED)
            });
        },

        addSliderDom: function (isExternalCall) {
            var wsPane = document.getElementById('wsPane');
            var $divPageCt = $('.divPageCt').not(':hidden');
            $('.divPage').removeClass('selected');
            var $divPage = $('<div class="divPage selected slider-item" style="background-image:url(\'/static/images/analysis/blank.jpg\')">').attr('id', 'divPageTemp');
            var $divPageTitle = $('<h4 class="divPageTitle">');
            var $input = _this.modalNameInput();
            var $modalNameSp = $('<div class="modalNameSp">New </div>').hide().click(function (e) {
                var text = $(this).hide().text();
                $(this).next().text(text).show().focus();
                e.stopPropagation();
            });
            $divPageTitle.append($modalNameSp).append($input);
            var $btnRemove = $('<span class="btnRemove glyphicon glyphicon-remove-sign" title="Remove" aria-hidden="true"></span>')
                .click(function () {
                    _this.deleteDivPage(this);
                });
            var $effectLayer = $('<div class="effect">');
            // checkbox
            var $cbSlider = $('<span class="slider-cb-wrap"><i class="slider-cb"></i></span>').click(function (e) {
                $(this).parents('.slider-item').toggleClass('checked');
                e.stopPropagation();
            });
            $divPage.append($divPageTitle).append($btnRemove).append($effectLayer).append($cbSlider);
            $divPageCt.append($divPage);
            $divPage.click(function (e) {
                var modalId;
                var isSelected = $(this).hasClass('selected');
                // prevent repeat click
                if (isSelected) return;
                
                $('.divPage').removeClass('selected');
                $(this).addClass('selected')
                _this.setToolsBtnStatus($(this));
                modalId = e.currentTarget.id;
                if (modalId == 'divPageTemp') {
                    isExternalCall == true || _this.screen.refreshPaneCenter(new AnalysisTemplate(_this.screen));
                } else {
                    _this.screen.renderModalById(modalId);
                }
            });
            $input.focus();

            I18n.fillAreaAttribute($('#divWSPane'), 'placeholder');
            _this.synchronizeToSliderMatrix($(wsPane));

            //_this.screen.spinnerSave.spin($divPage[0]);
            //var data = {
            //    workspaceId: _this.getWorkspaceId(),
            //    workspaceName: $('#ddlWorkspace').text(),
            //    modal: {
            //        name: '',
            //        type: '',
            //        note: '',
            //        imagebin: '',
            //        option: {}
            //    }
            //};
            //WebAPI.post('/analysis/modal/save/' + AppConfig.userId, data).done(function (result) {
            //    if (result && result != null) {
            //        var result = JSON.parse(result);
            //        data = JSON.stringify(data);
            //        _this.replaceNewModal(result.workspaceId, result.modalId, data);
            //        _this.screen.spinnerSave.stop();
            //    }
            //})

            /*_this.screen.saveModal();
            _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, _this.chart]);*/
        },
        //删除divPage
        deleteDivPage: function (obj) {
            if (confirm(I18n.resource.analysis.workspace.CONFIRM_PAGE_DELETE)) {
                var $thisDivPage = $(obj).closest('.divPage');
                var WSId = $(obj).closest('.divPageCt').attr('ws-id');
                if (!WSId) {
                    WSId = $('.divPageCt').not(':hidden').attr('ws-id');
                }
                var modalId = $(obj).closest('.divPage').attr('modal-id');
                if (modalId) {
                    WebAPI.get('/analysis/modal/remove/' + AppConfig.userId + '/' + WSId + '/' + modalId).done(function (result) {
                        var thisClosest = $(obj).closest('#divWSPane').length > 0 ? 1 : ($(obj).closest('#wsPane').length > 0 ? 2 : 0);
                        $thisDivPage.remove();
                        if(_this.screen.paneCenter.spinnerStop)_this.screen.paneCenter.spinnerStop();
                        var $wsPane = $('#anlsWSPaneContain');
                        if($wsPane.length == 0 || $wsPane.is(':hidden')){//slider删除后,原来的图表删除
                            new AnalysisTemplate(_this.screen).show();
                        }else{
                            _this.synchronize(thisClosest);
                        }
                    }).always(function (e) {
                        Spinner.stop();
                    });
                    localStorage.removeItem('img_' + modalId);
                } else {
                    $('[id="divPageTemp"]').remove();
                }
            }
        },
        //拖拽初始化
        initDrag: function (WSId) {
            var columns,column,dragTarget;
            if(WSId){
                dragTarget = 'divPageCt_' + WSId;
            }else{
                dragTarget = 'wsPane';
            }
            columns = document.querySelectorAll('#'+ dragTarget + ' .divPage');
            column = document.getElementById(dragTarget);
            var dragEl = null;

            for (var i = 0; i < columns.length; i++) {
                columns[i].index = i;
                columns[i].draggable = true;
                columns[i].style.cursor = 'move';
            }

            [].forEach.call(columns, function (column) {
                column.addEventListener("dragstart", domdrugstart, false);
                column.addEventListener('dragenter', domdrugenter, false);
                column.addEventListener('dragover', domdrugover, false);
                column.addEventListener('dragleave', domdrugleave, false);
                column.addEventListener('drop', domdrop, false);
                column.addEventListener('dragend', domdrapend, false);
            });

            function domdrugstart(e) {
                var target = getReal(e.srcElement, "className", "divPage");
                if (target.classList.contains('divPage')) {
                    target.style.opacity = '0.5';
                    dragEl = this;
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/html", this.innerHTML);
                }
            }
            function domdrugenter(e) {
                var target = getReal(e.srcElement, "className", "divPage");
                if (target.classList.contains('divPage')) {
                    target.classList.add('dragHover');
                }
            }
            function domdrugover(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.dataTransfer.dropEffect = 'move';
                return false;
            }
            function domdrugleave(e) {
                e.target.classList.remove('dragHover');
            }
            function domdrop(e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                //重新排序
                var modalList = [];
                if (dragEl != this) {
                    var newIndex = parseInt(this.index);
                    var locIndex = parseInt(dragEl.index);
                    var node = column.children[locIndex];
                    column.insertBefore(node, column.children[newIndex]);
                    var newColumns = document.querySelectorAll('#' + dragTarget + ' .divPage');
                    for (var i = 0; i < newColumns.length; i++) {
                        newColumns[i].index = i;
                        modalList.push(newColumns[i].id);
                    }

                    WebAPI.post('/analysis/workspace/saveLayout/' + AppConfig.userId, {
                        workspaceId: _this.getWorkspaceId(),
                        modalList: modalList
                    }).done(function () {
                        var wsId = _this.getWorkspaceId();
                        var newWsModalList = [];
                        for (var i = 0, len = _this.screen.store.workspaces.length; i < len; i++) {
                            if(_this.screen.store.workspaces[i]['id'] === wsId) {
                                var wsModalList = _this.screen.store.workspaces[i]['modalList'];
                                for(var j = 0; j < modalList.length; j++){
                                    for(var k = 0; k < wsModalList.length; k++){
                                        if(modalList[j] == wsModalList[k].id){
                                            newWsModalList.push(wsModalList[k])
                                        }
                                    }
                                }
                                _this.screen.store.workspaces[i]['modalList'] = newWsModalList;
                            }
                        }
                    });
                }
                return false;
            }
            function domdrapend(e) {
                [].forEach.call(columns, function (column) {
                    column.classList.remove('dragHover');
                    column.style.opacity = '1';
                });
                _this.synchronizeToSliderList();
            }
            function getReal(el, type, value) {
                var temp = el;
                while ((temp != null) && (temp.tagName != "BODY")) {
                     if (eval("temp." + type) == value) {
                          el = temp;
                          return el;
                     }
                     temp = temp.parentElement;
                 }
                 return el;
            }
        },
        //新增工作空间
        workspaceAdd: function (len) {
            var WSName = undefined;
            if (len == 0) {
                WSName = I18n.resource.analysis.workspace.WORKSPACE_NAME;
            } else {
                WSName = prompt(I18n.resource.analysis.workspace.PROMPT_WORKSPACE_NAME);
            }
            if (WSName && WSName != '') {
                WebAPI.post('/analysis/modal/save/' + AppConfig.userId,
                    {
                        workspaceName: WSName,
                        modal: {
                            name: 'New',
                            type: '',
                            note: '',
                            imagebin: '',
                            option: {}
                        }
                    }
                ).done(function (result) {
                    var result = JSON.parse(result);
                    if (result.workspaceId && result.workspaceId != '') {
                        var $dropdownUl = $('.dropdownWS').next('ul');

                        var $li = $('<li role="presentation">');
                        var $a = $('<a role="menuitem" tabindex="-1">')
                            .attr('project-id', result.workspaceId)
                            .click(function () {
                                _this.selectWorkspace(this);
                            })
                            .text(WSName);
                        $li.append($a);
                        $dropdownUl.append($li);
                        var $divPageCt = $('<div class="divPageCt">').attr('id', 'divPageCt_' + result.workspaceId).attr('ws-id', result.workspaceId);
                        $('#divWSPane').append($divPageCt);
                        _this.selectWorkspace($a);
                        _this.addSliderDom(result);
                    }
                });
            }
        },
        //选择工作空间
        selectWorkspace: function (obj) {
            var $dropdownWS = $('.dropdownWS');
            $dropdownWS.html($(obj).text() + '<span class="caret"></span>');
            var thisPjctId = $(obj).attr('project-id');
            $($(obj).parent()).siblings().children('a').removeAttr('selected');
            $(obj).attr('selected', 'selected');

            if (thisPjctId && thisPjctId != '') {
                $('#divPageCt_' + thisPjctId).show().siblings('.divPageCt').hide();
                if ($(obj).closest('#anlsWSPaneContain').length > 0) {
                    var proj = $('#ddlWorkspace').next('ul').find('a[project-id="' + thisPjctId + '"]');
                    $($(proj).parent()).siblings().children('a').removeAttr('selected');
                    proj.attr('selected', 'selected');
                }
            } else {
                $('.divPageCt').hide();
            }
            if($('#anlsWSPaneContain').is(':hidden')) {
                $('#btnCancelWS').click();
                new AnalysisTemplate(_this.screen).show();
            }else{
                _this.synchronize(1);
            }

        },
        // 删除工作空间
        deleteWorkspace: function () {
            if (confirm(I18n.resource.analysis.workspace.CONFIRM_WORKSPACE_DELETE)) {
                var WSId = _this.getWorkspaceId();
                WebAPI.get('/analysis/workspace/remove/' + WSId).success(function () {
                    $('a[project-id="' + WSId + '"]').parent('li').remove();
                    $('#divPageCt_' + WSId).remove();
                    var $firstWS = $('#ddlWorkspace').next('ul').children();
                    if ($firstWS.length > 0) {
                        var $firstWSA = $($firstWS[0]).children()
                        $firstWSA.attr('selected', 'selected').trigger('click');
                        $('.dropdownWS').html($firstWSA.text() + '<span class="caret"></span>');
                    } else {
                        $('.dropdownWS').html('Workspace' + '<span class="caret"></span>');
                        _this.workspaceAdd(0);
                    }
                    _this.screen.refreshPaneCenter(new AnalysisTemplate(_this.screen));
                });
            }
        },
        //工作空间重命名
        renameWorkspace: function () {
            var WSId = _this.getWorkspaceId();
            var $ddl = $('#ddlWorkspace');
            var $thisA = $ddl.next('ul').find('a[selected="selected"]');
            var orgName = $.trim($thisA.text());
            var WSName = prompt(I18n.resource.analysis.workspace.PROMPT_WORKSPACE_RENAME);
            WSName = $.trim(WSName);
            if (WSName != '' && orgName != WSName) {
                $thisA.text(WSName);
                $ddl.html(WSName + '<span class="caret"></span>');
                _this.screen.saveModal();
                _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, _this.chart]);
            }
        },
        //获取当前workspaceId
        getWorkspaceId: function () {
            return $('#ddlWorkspace').next('ul').find('a[selected="selected"]').attr('project-id');
        },
        //取消保存工作空间
        workspaceCancel: function () {
            $('#anlsWSPaneContain').fadeOut('fast');
            $('#anlsPaneContain').fadeIn(1000);
            var $paneContent = $('#paneContent');
            _this.toggleDataSource(true);
        },
        //modal name 输入框
        modalNameInput: function (value) {
            var modalName = value;
            var valueTemp;
            var $input = $('<textarea class="newDivPageTitle" value="" i18n="placeholder=analysis.workspace.INPUT_PLACEHOLDER_PAGE_NAME"/>')
                .blur(function () {
                    $(this).closest('.divPage').attr('draggable',true);
                    _this.screen.targetSlide = $(this).closest('.divPage');
                    saveName(this);
                })
                .keypress(function(e){
                    if(e.keyCode == 13){
                        _this.screen.targetSlide = $(this).closest('.divPage');
                        saveName(this)
                    }
                })
                .focus(function(){
                    $(this).closest('.divPage').attr('draggable',false);
                    $(this).select();
                    valueTemp = $(this).prev().text();
                    var height = $(this).prev('.modalNameSp').height();
                    this.style.height = height + 6 + 'px';
                    this.style.marginTop = -height/2 + 10 + 'px';
                })
                .bind('input propertychange',function(){
                    var height;
                    if(this.scrollHeight > 150){
                        height = 150;
                    }else{
                        height = this.scrollHeight;
                    }
                    this.style.height = height + 'px';
                    this.style.marginTop = -height/2 + 10 + 'px';

                });
            if (value) {
                $input.val(value).hide();
            } else {
                $input.show();
            }
            return $input;

            function saveName(obj){
                var thisInput = obj;
                var $modalNameSp = $(thisInput).prev('div');
                var id = $(thisInput).closest('.divPage').attr('id');
                if ($(obj).val() == valueTemp){
                    refresh();
                    return;
                }
                if(!_this.screen.curModal.option && $.trim($(obj).val()).length == 0){
                    refresh();
                    return;
                }

                var selectTemp = $('.selected');
                selectTemp.addClass('selectTemp');
                var inputVal = $(thisInput).val() != '' ? $(thisInput).val() : ((modalName && modalName != '') ? modalName : 'New');
                if(id == selectTemp.closest('.divPage').attr('id') && id != 'divPageTemp'){
                     $('#anlsPaneContain .panel-heading').get(0).childNodes[0].textContent = inputVal;
                }
                $('.divPage').removeClass('selected');
                $(obj).closest('.divPage').addClass('selected');

                for (var i = 0, workspace; i < _this.screen.store.workspaces.length; i++) {
                    workspace = _this.screen.store.workspaces[i];
                    for (var j = 0; j < workspace.modalList.length; j++) {
                        if (workspace.modalList[j]['id'] == id) {
                            _this.screen.curModal = workspace.modalList[j].option;
                        }
                    }
                }

                refresh();
                if (id != 'divPageTemp') {
                    modalName = inputVal;
                    $(thisInput).val(inputVal);
                    _this.screen.saveModal();
                    _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, _this.chart]);
                } else {
                    modalName = inputVal;
                    $(thisInput).val(inputVal);
                }

                function refresh() {
                    var thisClosest = $(thisInput).closest('#divWSPane').length > 0 ? 1 : ($(thisInput).closest('#anlsWSPaneContain').length > 0 ? 2 : 0);
                    $(thisInput).hide();
                    $modalNameSp.show().html($(thisInput).val()).css({'margin-top':$(thisInput)[0].style.marginTop, 'margin-left': -$modalNameSp[0].offsetWidth/2});
                    _this.synchronize(thisClosest);
                }
            }
        },

        replaceNewModal: function (workspaceId, modalId, data) {
            var $divPage = $('#divPageTemp');
            $divPage.attr('id', modalId).attr('modal-id', modalId);
            if(this.screen.chartImageBin){
                $('.divPage.selected').css({'background-image': 'url('+ this.screen.chartImageBin +')'});
            }
            data = JSON.parse(data);
            var newWSId = true;
            for (var i = 0, workspace; i < this.screen.store.workspaces.length; i++) {
                workspace = this.screen.store.workspaces[i];
                if (workspace.id == workspaceId) {
                    data.modal.id = modalId;
                    var modalList = this.screen.store.workspaces[i].modalList;
                    var isModalIdExisted = true;
                    for(var j = 0; j < modalList.length; j++){
                        if(modalList[j].id == modalId){
                            this.screen.store.workspaces[i].modalList[j] = data.modal;
                            isModalIdExisted = false;
                            break;
                        }
                    }
                    if(isModalIdExisted){
                        this.screen.store.workspaces[i].modalList.push(data.modal);
                    }
                    newWSId = false;
                    break;
                }
            }
            if (newWSId) {
                data.modal.id = modalId;
                var obj = {
                    id: data.workspaceId,
                    name: data.workspaceName,
                    modalList: [data.modal]
                }
                this.screen.store.workspaces.push(obj);
            }
        },
        //选择page后,工具栏按钮
        setToolsBtnStatus: function ($thisPage) {
            var $btnUp = $('#btnPageUp');
            var $btnDown = $('#btnPageDown');
            if ($thisPage) {
                if ($thisPage.next().length == 0) {
                    $btnDown.addClass('disabled');
                } else {
                    $btnDown.removeClass('disabled');
                }
                if ($thisPage.prev().length == 0) {
                    $btnUp.addClass('disabled');
                } else {
                    $btnUp.removeClass('disabled');
                }
            } else {
                $btnDown.addClass('disabled');
                $btnUp.addClass('disabled');
            }
        },

        viewSliderMatrix: function(){
            var $WSPaneCt = $('#anlsWSPaneContain');
            var $panelHead = $('<div class="panel-heading" style="height: 41px;">');
            var $panelBody = $('<div class="panel-body" id="wsPane" style="height: calc(100% - 95px); overflow-y: auto;">');
            var $panelFoot = $('<div class="modal-footer" style="height: 54px;">');
            //如果是首次初始化
            if($WSPaneCt.length < 1){
                $WSPaneCt = $('<div class="panel panel-default" id="anlsWSPaneContain">');
                var $dropdown = $('<div class="dropdown">');
                var $editWorkspace = $('<div class="dropdownWS" id="editWorkspace" data-toggle="dropdown" aria-expanded="true" style="float: left;">Workspace<span class="caret"></span></div>');
                var $dropdownUl = $('<ul class="dropdown-menu" role="menu" aria-labelledby="ddlWorkspace">');
                var $ftCancel = $('<span class="glyphicon glyphicon-log-out panel-heading-btn" id="btnCancelWS" title="Go Back"></span>').click(_this.workspaceCancel);
                
                var $divToolbar = $('<div class="btn-toolbar" style="margin-right: 20px; float:right; display:inline-block;">');

                // include "Select All", "Select Inverse" buttons
                var $divBtnGroup1 = $('<div class="btn-group btn-group-xs"></div>');
                // include "Export Selected" button
                var $divBtnGroup2 = $('<div class="btn-group btn-group-xs"></div>');
                // include "Play" button
                var $divBtnGroup3 = $('<div class="btn-group btn-group-xs"></div>');

                // "Select All" button event
                var $btnSelectAll = $('<button type="button" class="btn btn-default" id="btnSelectAll">Select All</button>').click(function () {
                    // "Select All" logic start
                    util.checkbox.selectAll($panelBody.find('.slider-item'));
                });
                // "Select Inverse" button event
                var $btnSelectInverse = $('<button type="button" class="btn btn-default" id="btnSelectInverse">Select Inverse</button>').click(function () {
                    var $this = $(this);
                    // "Select Inverse" logic start
                    util.checkbox.selectInverse($panelBody.find('.slider-item'));
                });

                var $btnExport = $('<button type="button" class="btn btn-default btn-xs">\
                    <span class="glyphicon glyphicon-share" aria-hidden="true"></span> Share\
                </button>').click(function () {
                    var selectedIds = $.makeArray($panelBody.find('.slider-item.checked').map(function () {
                        return $(this).attr('id');
                    }));
                    var wsId, modalList, data = [];
                    if(selectedIds.length <= 0) {
                        alert('You should choose one slider at least!');
                        return;
                    }
                    // get workspace id
                    wsId = _this.getWorkspaceId();
                    // find modalList data in _this.screen.store.workspaces by matching the wsId
                    for (var i = 0, len = _this.screen.store.workspaces.length; i < len; i++) {
                        if(_this.screen.store.workspaces[i]['id'] === wsId) {
                            modalList = _this.screen.store.workspaces[i]['modalList'];
                            break;
                        }
                    }
                    // if no matches, data error, don't deal with it
                    if(!modalList || !modalList.length) return false;

                    // get selected data from modalList
                    for (var i = 0, item, arrPoints, len = modalList.length; i < len; i++) {
                        if(selectedIds.indexOf(modalList[i]['id']) > -1) {
                            item = modalList[i];
                            item.imagebin = '';
                            arrPoints = [];

                            for (var j = 0, arrId; j < item.option.itemDS.length; j++) {
                                arrPoints = arrPoints.concat(item.option.itemDS[j].arrId);
                            }

                            data.push({
                                "id": (+new Date()).toString() + i.toString(),
                                "spanC": 6,
                                "spanR": 4,
                                "modal": {
                                    "interval": 0,
                                    "option": item,
                                    "title": item.name,
                                    "points": arrPoints,
                                    "type": "ModalAnalysis"
                                }
                            });
                        }
                    }

                    var strShare = 'SHARE' + AppConfig.userId.toString() + (+new Date()).toString();

                    postData = {
                        projectId: '',
                        menuItemId: strShare,
                        layout: [data]
                    };
                    ScreenManager.show(EnergyScreen, strShare, postData);
                });
                
                FullScreenManager.init(function (e) {
                    var wsId, sliders;
                    if(e.isFullScreen) {
                        // get workspace id
                        wsId = $('#ddlWorkspace + ul').find('a[selected]').attr('project-id');
                        // find slider sets
                        // find sliders data in _this.screen.store.workspaces by matching the wsId
                        for (var i = 0, len = _this.screen.store.workspaces.length; i < len; i++) {
                            if(_this.screen.store.workspaces[i]['id'] === wsId) {
                                sliders = _this.screen.store.workspaces[i]['modalList'];
                                break;
                            }
                        }
                        if(!sliders || !sliders.length) {
                            alert('There is no slider!');
                            return;
                        }

                        _this.sharpViewScreen = new SharpViewScreen(sliders, _this.screen.store);
                        _this.sharpViewScreen.show();
                        
                    } else {
                        $('html').removeClass('sharpview-mode');
                        _this.sharpViewScreen.destroy();
                    }
                    
                });

                // "Play" Button
                var $btnPlay = $('<button type="button" class="btn btn-default btn-xs">\
                    <span class="glyphicon glyphicon-play" aria-hidden="true"></span> Play\
                </button>').click(function () {
                    $('html').addClass('sharpview-mode');
                    FullScreenManager.toggle();
                });

                $dropdown.append($editWorkspace).append($dropdownUl);
                $divToolbar.append($divBtnGroup3.append($btnPlay)).append($divBtnGroup1.append($btnSelectAll).append($btnSelectInverse))
                    .append($divBtnGroup2.append($btnExport));
                $panelHead.append($dropdown).append($ftCancel).append($divToolbar);
                $WSPaneCt.append($panelHead).append($panelBody).append($panelFoot);
                $('#paneContent').append($WSPaneCt);
            }else{
                $('#wsPane').html('');
            }
            var $ddlWS = $('#ddlWorkspace');
            $('#editWorkspace').html($ddlWS.html()).next('ul').html($ddlWS.next('ul').children().clone(true));
            $('#anlsPaneContain').hide();
            $WSPaneCt.show();
            var $showDivPageCt = $('.divPageCt').not(':hidden');

            
            $('#wsPane').append($showDivPageCt.children().clone(true));

            _this.initDrag();
            I18n.fillArea($('#anlsWSPaneContain'));
        },
        // 左边管理面板同步到中间配置面板
        synchronizeToSliderMatrix: function ($obj){
             if($obj.length > 0 && $obj.not(':hidden')){
                _this.viewSliderMatrix();
            }
        },
        // 中间配置面板同步到左边管理面板
        synchronizeToSliderList: function (){
            var $targetDivPageCt = $('.divPageCt').not(':hidden');
            var configDivPageList = $('#wsPane').children('.divPage');
            if(configDivPageList && configDivPageList.length > 0){
                configDivPageList = configDivPageList.clone(true);
                $targetDivPageCt.html('');
                $targetDivPageCt.append(configDivPageList);
                $targetDivPageCt.find('.divPage').each(function(){
                    this.draggable = false;
                })
            }
        },

        synchronize: function (thisClosest){
            if(thisClosest == 1){
                _this.synchronizeToSliderMatrix($('#wsPane'));
            }else if(thisClosest == 2 && !$('#anlsWSPaneContain').is(':hidden')){
                _this.synchronizeToSliderList();
            }
        },

        toggleDataSource: function(bool){
            var colCount = $('#paneContent').prop('class').indexOf('col-sm-10');
            if(bool && colCount > -1){
                document.getElementById('rightCt').click();
            }
            if(!bool && colCount < 0){
                document.getElementById('rightCt').click();
            }
        }
    }
    return AnlsWorkspace;
})();
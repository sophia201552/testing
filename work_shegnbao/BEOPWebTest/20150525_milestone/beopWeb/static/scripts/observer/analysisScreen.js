/// <reference path="../lib/jquery-1.11.1.js" />
/// <reference path="../core/common.js" />
/// <reference path="analysis/analysisTendency.js" />
/// <reference path="analysis/analysisSpectrum.js" />
/// <reference path="analysis/analysisGroup.js" />
/// <reference path="analysis/analysisData.js" />
/// <reference path="../core/common.js" />
/// <reference path="../lib/jquery-1.8.3.js" />


var AnalysisScreen = (function () {
    function AnalysisScreen() {
        this.store = undefined;
        this.factoryIoC = undefined;
        this.container = undefined;
        this.arrColor = echarts.config.color;
        this.paneDatasource = undefined;
        this.paneWorkspace = undefined;
        this.paneCenter = undefined;
        this.chartImageBin = undefined;
        this.saveModalJudge = undefined;
        this.modalConfig = undefined;
        this.targetSlide = undefined;

        this.curModal = {
            startTime: undefined,
            endTime: undefined,
            format: undefined,
            mode: undefined,
            itemDS: [] //datasource item ids.
        };
        this.spinnerSave = undefined;
    }

    AnalysisScreen.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            $.get("/static/views/observer/analysisScreen.html").done(function (resultHtml) {
                Spinner.stop();
                $(ElScreenContainer).html(resultHtml);
                _this.init();
                var side = new SidebarMenuEffect('#paneContent', '#leftCt', '#rightCt');
                document.querySelector('#leftCt').click();
	            document.querySelector('#rightCt').click();
            });
        },

        close: function () {
            this.store = null;
            this.factoryIoC = null;
            this.container = null;
            this.curModal = null;
            this.modalConfig && this.modalConfig.close && this.modalConfig.close();
            AppConfig.datasource = null;

            this.paneDatasource && this.paneDatasource.close && this.paneDatasource.close();
            this.paneWorkspace && this.paneWorkspace.close && this.paneWorkspace.close();
            this.paneCenter && this.paneCenter.close && this.paneCenter.close();
        },

        init: function () {
            this.spinnerSave = new LoadingSpinner({ color: '#00FFFF' });
            var _this = this;
            Spinner.spin(ElScreenContainer);
            var localStorageFlag;
            localStorage.getItem('workSpacePicStorageEnable')?localStorageFlag = 0:localStorageFlag = 1;
            WebAPI.get('/analysis/getAll/' + AppConfig.userId + '/' + localStorageFlag).done(function (result) {
                _this.store = JSON.parse(result);
                localStorage.setItem('workSpacePicStorageEnable',true);
                _this.container = document.getElementById('anlsPane');
                _this.initIoc();

                _this.paneDatasource = new DataSource(_this);
                AppConfig.datasource = _this.paneDatasource;
                _this.paneWorkspace = new AnlsWorkspace(_this);
                _this.paneDatasource.show();
                _this.paneWorkspace.show();

                _this.refreshPaneCenter(new AnalysisTemplate(_this));
                _this.modalConfig = new modalConfigurePane(document.getElementById('modalConfigContainer'),_this,'dataAnalysis');
                _this.modalConfig.show();
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            });
        },

        refreshPaneCenter: function (entity) {
            if (this.paneCenter && this.paneCenter.close) this.paneCenter.close();
            this.paneCenter = entity;
            this.paneCenter.show();
        },

        hideAnlsPane: function () {
            $('#anlsPaneContain').hide();
            $('#anlsWSPaneContain').hide();
        },

        showAnlsPane: function () {
            $('#anlsPaneContain').show();
            $('#anlsWSPaneContain').show();
        },

        initIoc: function () {
            this.factoryIoC = new FactoryIoC('analysis');
        },


        renderModal: function () {
            var option = this.curModal;
            //this.saveModalJudge = $.Deferred();
            this.targetSlide = $('#divWSPane .selected');
            var modalClass = this.factoryIoC.getModel(option.type);
            if (modalClass) {
                this.refreshPaneCenter(new modalClass(this.container, null, this));
            }
            else this.refreshPaneCenter(new AnalysisTemplate(this));
            $('#anlsPaneContain .panel-heading').get(0).childNodes[0].textContent = $('#divWSPane .selected').find('.modalNameSp').text();
            this.saveModal();
        },

        renderModalById: function (modalId) {
            for (var i = 0, workspace; i < this.store.workspaces.length; i++) {
                workspace = this.store.workspaces[i];
                for (var j = 0; j < workspace.modalList.length; j++) {
                    if (workspace.modalList[j]['id'] == modalId) {
                        this.curModal = workspace.modalList[j].option;
                        this.renderModal();
                        var _this = this;
                        this.saveModalJudge.rejectWith(_this,[_this]);
                        return;
                    }
                }
            }
        },

        saveModal: function () {
            //if(!this.renderByIdFlag) {
            //$('#anlsPaneContain .panel-heading').get(0).childNodes[0].textContent = $('#divWSPane .selected').parent().find('.modalNameSp').text();
            this.saveModalJudge = $.Deferred();
            $.when(this.saveModalJudge).done(function (_this, _chart) {

                if (_this.targetSlide.length == 0) {
                    _this.paneWorkspace.pageAdd(true);
                    _this.targetSlide = $('.divPage').last();
                }
                var $selModalImg = _this.targetSlide;
                var selectTemp = $('.selectTemp');
                if(_chart == undefined){
                    _this.chartImageBin = $selModalImg[0].style.backgroundImage.replace('url(','').replace(')','');
                }
                else {
                    var imageSm = _chart.getImage('jpeg');
                    var canvas = document.createElement("canvas");
                    canvas.width = imageSm.width / 2;
                    canvas.height = imageSm.height / 2;
                    canvas.getContext("2d").drawImage(imageSm, 0, 0, imageSm.width / 2, imageSm.height / 2);
                    canvas.getContext("2d").fillStyle = 'white';
                    canvas.getContext("2d").fillRect(imageSm.width * 3 / 8, 0, imageSm.width / 8, imageSm.height / 60);
                    _this.chartImageBin = canvas.toDataURL("image/jpeg");
                    $selModalImg.css({'background-image':'url('+ _this.chartImageBin +')'});
                }

                var option = _this.curModal;
                for (var key in option) {
                    if (option[key] instanceof Date)
                        option[key] = option[key].format('yyyy-MM-dd HH:mm:ss');
                }
                //if (_this.chartImageBin == undefined) {
                //    _this.chartImageBin = '';
                //}
                var data = {
                    workspaceId: $('.divPageCt').not(':hidden').attr('ws-id'),
                    workspaceName: $('#ddlWorkspace').text(),
                    modal: {
                        name: $selModalImg.find('.modalNameSp').text(),
                        type: _this.curModal.type ? _this.curModal.type : '',
                        note: '',
                        imagebin: _this.chartImageBin,
                        option: _this.curModal
                    }
                };
                _this.spinnerSave.spin($selModalImg.get(0));
                var modalId = $('.divPage.selected').attr('id');
                if (modalId && modalId != 'divPageTemp') {
                    data.modal.id = modalId;
                    //sessionStorage.setItem('img_'+ modalId,_this.chartImageBin);
                }

                WebAPI.post('/analysis/modal/save/' + AppConfig.userId, data).done(function (result) {
                    if (result && result != null) {
                        var result = JSON.parse(result);
                        data = JSON.stringify(data);
                        if (!_this.curModal.id) {
                            _this.paneWorkspace.replaceNewModal(result.workspaceId, result.modalId, data);
                            localStorage.setItem('img_'+ result.modalId,_this.chartImageBin);
                        }
                    }
                    if (selectTemp.length > 0){
                        $selModalImg.removeClass('selected');
                        selectTemp.removeClass('selectTemp').addClass('selected');
                    }
                    _this.chartImageBin = undefined;
                    _this.spinnerSave.stop();
                })
            }).fail(function(_this) {
                var selModalImg = $('#divWSPane .selected');
                var selectTemp = $('.selectTemp');
                setTimeout(function(){
                    if (selectTemp.length > 0){
                        selModalImg.removeClass('selected');
                        selectTemp.removeClass('selectTemp').addClass('selected');
                    }
                    }, 1000);
            });
        },

        updateDataSources: function (updateData) {
            this.store.group = updateData;
        },

        alertNoData: function(){
            var _this = this;
            var $dataAlert = $("#dataAlert");
            new Alert($dataAlert, "danger", "<strong>" + I18n.resource.analysis.paneConfig.ERR11 + "</strong>").show().close();
            setTimeout(function () {
                _this.refreshPaneCenter(new AnalysisTemplate(_this));
                $('.selected').removeClass('selected');
            }, 2000);
        }

    }

    return AnalysisScreen;
})();

var AnalysisTemplate = (function () {
    function AnalysisTemplate(screen) {
        this.screen = screen;
    }

    AnalysisTemplate.prototype = {
        show: function () {
            this.initAnlysTemplate();
            this.initDrag();
        },
        initAnlysTemplate: function () {
            $('#anlsPaneContain .panel-heading').get(0).childNodes[0].textContent = I18n.resource.analysis.TITLE;
            var paneAnalysis = document.getElementById('anlsPane');
            var imgOnloadNum = 0;
            var _this = this;

            paneAnalysis.innerHTML = '';

            var list, option, strAnlysPara, strTemplateImg, strAnlysTemplate, strTemplateImgColor, template;
            list = this.screen.factoryIoC.getList();
            Spinner.spin(ElScreenContainer);
            for (var ele = 0; ele < list.length; ele++) {
                template = list[ele];
                option = template.prototype.optionTemplate;
                strAnlysPara = '';
                option = this.screen.factoryIoC.getModel(template.name).prototype.optionTemplate;

                strTemplateImg = '/static/images/analysis/templateImg/' + (option.imgName ? option.imgName : 'anlsDefault.png');
                strTemplateImgColor = (option.imgColor ? option.imgColor : '65,131,189');

                for (var i = 0; i < option.templateParams.paraName.length; i++) {
                    strAnlysPara += '<p dataType="' + option.templateParams.paraName[i] + '">' + option.templateParams.paraName[i] + '</p>';
                }
                var numOfPara = (option.templateParams.paraName.length > 5)?'long':option.templateParams.paraName.length;
                strAnlysTemplate = '<div class="anlsTemplate" anlysParaMode="' + option.templateParams.paraAnlysMode + '" templateType="' + template.name + '" style="background-color:rgba('+ strTemplateImgColor +',0.1)">\
                                    <img src="' + strTemplateImg + '" style="background-color:rgba('+ strTemplateImgColor +',1)">\
                                            <h3>' + I18n.findContent(option.templateName) + '</h3>\
                                        <p>' + I18n.resource.analysis.paneConfig.DATA_DRAG_TIP + '</p>\
                                        <div class = "templatePara numOfPara-' + numOfPara + '">' + strAnlysPara + '</div>\
                                    </div>';
                paneAnalysis.innerHTML += strAnlysTemplate;
            }

            $('.anlsTemplate img').on('load',function(){
                imgOnloadNum = imgOnloadNum +1;
                if (imgOnloadNum == list.length)Spinner.stop();
            });
            var $anlsConfigModal = $('#anlsConfigModal');
            $('.anlsTemplate').on('click', function (e) {
                var option = {};
                var optionTemplate = _this.screen.factoryIoC.getModel($(e.currentTarget).attr('templateType')).prototype.optionTemplate;
                option.modeUsable = optionTemplate.chartConfig;
                option.dataTypeMaxNum = [];
                option.dataTypeMaxNum = optionTemplate.templateParams.dataTypeMaxNum;
                option.rowDataType = [];
                option.templateType = $(e.currentTarget).attr('templateType');
                for (var i = 0; i < e.currentTarget.children[3].children.length; ++i) {
                    option.rowDataType.push(e.currentTarget.children[3].children[i].getAttribute('dataType'))
                }
                option.optionPara = {};
                option.optionPara.dataItem = {};
                var allDataNeed = $(e.currentTarget).attr('anlysParaMode');
                if (allDataNeed == 'all'){
                    allDataNeed = true;
                }else{
                    allDataNeed = false;
                }
                option.allDataNeed = allDataNeed;
                _this.screen.modalConfig.showModalInit(true,option);
            })
        },
        initDrag: function () {
            var _this = this;
            var templateParaPane = $('.templatePara');
            var $tempPara = templateParaPane.children();
            var $anlysConfigModal = $('#anlsConfigModal');
            var $rowAnlysPara, strAnlysModalBody, targetId, targetContent;
            var $startAnlys = $('#startAnlys');
            $tempPara.on('dragenter', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            $tempPara.on('dragleave', function (e) {
                e.preventDefault();
                $(e.target).removeClass('paraSel');
                $(e.target).closest('.anlsTemplate').removeClass('templateSel');
            });
            $tempPara.on('dragover', function (e) {
                e.preventDefault();
                $(e.target).addClass('paraSel');
                $(e.target).closest('.anlsTemplate').addClass('templateSel');
            });
            $tempPara.on('drop',function (e) {
                e.preventDefault();
                e.stopPropagation();
                var option = {};
                var optionTemplate = _this.screen.factoryIoC.getModel($(e.currentTarget).closest('.anlsTemplate').attr('templateType')).prototype.optionTemplate;
                option.modeUsable = optionTemplate.chartConfig;
                option.templateType = $(e.currentTarget).closest('.anlsTemplate').attr('templateType');
                option.dataTypeMaxNum = [];
                option.dataTypeMaxNum = optionTemplate.templateParams.dataTypeMaxNum;
                option.rowDataType = [];
                for (var i = 0; i < $(e.currentTarget).parent().children().length; ++i) {
                    option.rowDataType.push($(e.currentTarget).parent().children().get(i).getAttribute('dataType'))
                }
                option.optionPara = {};
                targetId = e.originalEvent.dataTransfer.getData("dsItemId");
                option.optionPara.dataItem = [{
                    dsId: [targetId],
                    dsName:[AppConfig.datasource.getDSItemById(targetId).alias],
                    dsType: e.currentTarget.getAttribute('dataType')
                }];
                var allDataNeed = $(e.currentTarget).closest('.anlsTemplate').attr('anlysParaMode');
                allDataNeed == 'all'? allDataNeed = true:allDataNeed = false;
                option.allDataNeed = allDataNeed;
                _this.screen.modalConfig.showModalInit(true, option);
            });
            $('#dataSrcPanel').on('dragend', function (e) {
                e.preventDefault();
                $('.templateSel').removeClass('templateSel');
                $('.paraSel').removeClass('paraSel');
                $('.paraRowSel').removeClass('paraRowSel');
                $('.templatePara').css('display','none');

            })
        },
        close: function () {
        }
    }
    return AnalysisTemplate;
})();


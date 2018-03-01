window.analysis = window.analysis || {};
window.analysis.panels = window.analysis.panels || {};

window.analysis.panels.AnalysisTemplate = (function () {
    function AnalysisTemplate(screen) {
        this.screen = screen;
    }

    AnalysisTemplate.prototype = {
        show: function () {
            this.initAnlysTemplate();
            this.initDrag();
            //$('#graphBox').hide();
            $('#graphSelsect').click(function () {
                $('#graphBox').hide();
                return;
            });
            $('#chartModify').hide();
            $('#btnDataFilter').hide();
        },
        initAnlysTemplate: function () {
            var paneAnalysis = document.getElementById('anlsPane');
            var _this = this;

            paneAnalysis.innerHTML = '';

            var list, option, strAnlysPara, strTemplateImg, strAnlysTemplate, strTemplateImgColor, template,strImgIndex;
            list = this.screen.factoryIoC.getList();
            //Spinner.spin(ElScreenContainer);
            for (var ele = 0; ele < list.length; ele++) {
                template = list[ele];
                option = template.prototype.optionTemplate;
                strAnlysPara = '';
                option = this.screen.factoryIoC.getModel(template.name).prototype.optionTemplate;

                strTemplateImg = '/static/images/analysis/templateImg/templateImg.png';
                strTemplateImgColor = (option.imgColor ? option.imgColor : '65,131,189');
                strImgIndex = option.imgIndex?- (option.imgIndex * 59):0;
                for (var i = 0; i < option.templateParams.paraName.length; i++) {
                    strAnlysPara += '<p dataType="' + option.templateParams.paraName[i] + '">' + option.templateParams.paraName[i] + '</p>';
                }
                var numOfPara = (option.templateParams.paraName.length > 5)?'long':option.templateParams.paraName.length;
                strAnlysTemplate = '<div class="anlsTemplate" anlysParaMode="' + option.templateParams.paraAnlysMode + '" templateType="' + template.name + '" style="background-color:rgba('+ strTemplateImgColor +',0.1)">\
                                    <div class="templateImgBg" style="background-color:rgba('+ strTemplateImgColor +',1)"></div>\
                                        <div class="templateImg" style="background-image:url(' + strTemplateImg + '); background-repeat:no-repeat; background-position:' + strImgIndex + 'px 0"></div>\
                                            <h3>' + I18n.findContent(option.templateName) + '</h3>\
                                        <p>' + I18n.resource.analysis.paneConfig.DATA_DRAG_TIP + '</p>\
                                        <div class = "templatePara numOfPara-' + numOfPara + '">' + strAnlysPara + '</div>\
                                    </div>';
                paneAnalysis.innerHTML += strAnlysTemplate;
            }

            //$('.anlsTemplate img').on('load',function(){
            //    Spinner.stop();
            //});
            var $anlsConfigModal = $('#anlsConfigModal');
            EventAdapter.on($('.anlsTemplate'), 'click', function (e) {
            //$('.anlsTemplate').on('click', function (e) {
                var option = {};
                var optionTemplate = _this.screen.factoryIoC.getModel($(e.currentTarget).attr('templateType')).prototype.optionTemplate;
                option.modeUsable = optionTemplate.chartConfig;
                option.dataTypeMaxNum = [];
                option.dataTypeMaxNum = optionTemplate.templateParams.dataTypeMaxNum;
                option.rowDataType = [];
                option.templateType = $(e.currentTarget).attr('templateType');
                for (var i = 0; i < e.currentTarget.children[4].children.length; ++i) {
                    option.rowDataType.push(e.currentTarget.children[4].children[i].getAttribute('dataType'))
                }
                option.optionPara = {};
                option.optionPara.dataItem = [];
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
                var option = {},targetIdEnd = undefined,dsNameEnd = [];
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
                targetId = EventAdapter.getData().dsItemId;
                if (!targetId) return;
                if (Object.prototype.toString.call(targetId) === '[object Array]') {
                    targetIdEnd = targetId;
                    for (var i = 0, len = targetId.length; i < len; i++) {
                        dsNameEnd.push(AppConfig.datasource.getDSItemById(targetId[i]).alias);
                    }
                } else {
                    targetIdEnd = [targetId];
                    dsNameEnd = [AppConfig.datasource.getDSItemById(targetId).alias];
                }
                option.optionPara.dataItem = [{
                    dsId: targetIdEnd,
                    dsName: dsNameEnd,
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
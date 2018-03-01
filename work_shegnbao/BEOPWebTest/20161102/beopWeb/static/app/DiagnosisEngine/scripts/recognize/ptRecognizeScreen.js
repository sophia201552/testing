/**
 * Created by win7 on 2016/5/20.
 */
var PtRecognizeScreen = (function(){
    var _this;
    function PtRecognizeScreen(){
        _this = this;
        _this.$divSpinner = undefined;
        _this.$imgSpinner = undefined;
        _this.divResultGrp = undefined;

        _this.spinnerPos = undefined;

        this.diagnosisScreen = undefined;

        AppConfig.module = 'recognize';
    }
    PtRecognizeScreen.prototype = {
        //临时国际化映射
        dictI18n:{
            'AHU':'空调箱',
            'PAU':'新风箱',
            'Chiller':'冷机',
            'PriP':'冷冻泵',
            'SecP':'二次泵',
            'CWP':'冷却泵',
            'CT':'冷却塔',
            'Valve':'阀门',
            'HX':'板换',
            'WSHP':'水源热泵',
            'GSHP':'地源热泵',
            'FPTU':'地台风机',
            'CAVBox':'定风量风箱',
            'VAVBox':'变风量风箱',
            'PCW':'工艺冷却水',
            'GWP':'乙二醇泵',
            'VacP':'真空泵',
            'HWP':'热水泵',
            'MKP':'补水泵',
            'AirCPR':'空压机',
            'ACleaner':'空气净化器',
            'Filter':'过滤器',
            'Boiler':'锅炉',
            'Tank':'水箱',
            'FCU':'风机盘管',
            'Damper':'风阀',
            'Fan':'风机',
            'OtherPump':'其他水泵'
        },
        show:function(){
            WebAPI.get('/static/app/DiagnosisEngine/views/recognize/ptRecognizeScreen.html').done(function(resultHTML){
                PanelToggle.panelCenter.innerHTML = resultHTML;
                PanelToggle.toggle({
                    left: {
                        show:true
                    },
                    center:{
                        show:true
                    },
                    right:{
                        show:true
                    }
                });
                if (!AppConfig.datasource) {
                    // 如果没有预加载，则先去加载数据，再做显示
                    Spinner.spin(PanelToggle.panelRight);
                    WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
                        _this.store.group = result.group;
                        AppConfig.datasource = new DataSource(_this);
                        AppConfig.datasource.iotOpt = {
                            base:{
                                divideByProject:true
                            },
                            tree:{
                                event:{
                                    addDom:function(treeNode,$target){
                                        if($target.hasClass('projects')){
                                            $target.find('#' + treeNode.tId + '_span').on('dragstart',function(e){
                                                EventAdapter.setData(treeNode);
                                            })
                                        }
                                    }
                                }
                            }};
                        AppConfig.datasource.show();

                    }).always(function (e) {
                        Spinner.stop();
                    });
                } else {
                    AppConfig.datasource.show();
                }

                _this.$divSpinner = $(document.getElementById('divRecognizeSpinner'));
                _this.$imgSpinner = $('.imgRecognizeSpinner');

                _this.divResultGrp = document.getElementById('divRecognizeResultGrp');
                _this.init();
            })
        },
        init:function(){
            TemplateTree.setOpt({
                click:{
                    'recognize':function(e,treeNode){
                        PanelToggle.panelCenter.innerHTML = '';

                        if (this.diagnosisScreen) {
                            this.diagnosisScreen.close();
                        }
                        if(treeNode.srcPageId === ''){
                            WebAPI.get('/diagnosisEngine/getTemplateList').done(function(result){
                                var tabs = [];
                                var isRepeated;
                                for(var i = 0,iLen=result.data.length;i<iLen;i++){
                                    isRepeated = false;
                                    for(var j = 0,jLen = tabs.length;j<jLen;j++){
                                        if(tabs[j]==result.data[i].type){
                                            isRepeated = true;
                                            break;
                                        }
                                    }
                                    if(!isRepeated){
                                        tabs.push(result.data[i].type);
                                    }
                                }
                                var Template = namespace('factory.components.template.Template');
                                this.template = new Template(PanelToggle.panelCenter);
                                this.template.show(tabs,treeNode);
                            });
                        }else{
                            this.diagnosisScreen = new DiagnosisConfigScreen({
                                name: treeNode.name,
                                projId: treeNode.projId,
                                thingId: treeNode._id,
                                srcPageId: treeNode.srcPageId,
                                type: treeNode.type,
                                dictVariable: treeNode.dictVariable
                            });
                            this.diagnosisScreen.show();
                        }
                    }
                }
            });
            _this.initSpinner();
            _this.attachEvent();
        },
        initSpinner:function(){
            _this.$divSpinner[0].style.height = _this.$divSpinner[0].offsetWidth + 'px';
            _this.spinnerPos = {
                left:_this.$divSpinner[0].offsetLeft,
                top:_this.$divSpinner[0].offsetTop,
                height: _this.$divSpinner[0].offsetHeight,
                width:_this.$divSpinner[0].offsetWidth,
                centerX:_this.$divSpinner[0].offsetLeft + _this.$divSpinner[0].offsetWidth / 2,
                centerY:_this.$divSpinner[0].offsetTop + _this.$divSpinner[0].offsetHeight / 2
            };
            _this.$divSpinner[0].ondragenter = function(e){
                e.preventDefault();
            };
            _this.$divSpinner[0].ondragover = function(e){
                e.preventDefault();
            };
            _this.$divSpinner[0].ondragleave = function(e){
                e.preventDefault();
            };
            _this.$divSpinner[0].ondrop = function(){
                var node = EventAdapter.getData();
                if (node.baseType != 'projects')return;
                if (_this.$imgSpinner[0].src != '/static/images/diagnosisEngine/recogSpinner_color.png') {
                    _this.$imgSpinner[0].src = '/static/images/diagnosisEngine/recogSpinner_color.png';
                }
                _this.spinnerSwitch(true);
                AppConfig.projectId = node.projId;
                var arrClass = [];
                for (var ele in AppConfig.datasource.iotFilter.dictClass.groups){
                    arrClass.push(ele);
                }
                var postData = [{
                    projId:node.projId,
                    arrClass:arrClass
                }];
                WebAPI.post('/diagnosisEngine/classifyPoints',postData).done(function(result){
                    if(!result)return;
                    var dictClass = AppConfig.datasource.iotFilter.dictClass.things;
                    var arrData = [];
                    for (var ele in result){
                        arrData.push({
                            '_id':ObjectId(),
                            type:ele,
                            projId:node.projId,
                            num: result[ele],
                            open:true,
                            name:_this.dictI18n[ele]?_this.dictI18n[ele]:ele
                        });
                        if (ele == 'Other'){
                            arrData[arrData.length - 1].name = 'Other';
                            continue;
                        }
                        if(dictClass[ele] && dictClass[ele].name){
                            arrData[arrData.length - 1].name = dictClass[ele].name;
                        }
                    }
                    //setTimeout(function() {
                        if(!(TemplateTree.store instanceof Array) || TemplateTree.store.length == 0) {
                            TemplateTree.setData(arrData);
                        }else{
                            var newArrData = [];
                            var isNew;
                            for (var i = 0; i < arrData.length ;i++){
                                isNew = true;
                                for(var j = 0; j < TemplateTree.store.length ;j++){
                                    if (!TemplateTree.store[j].tempGrpId && TemplateTree.store[j].type == arrData[i].type){
                                        isNew = false;
                                        break;
                                    }
                                }
                                if(isNew){
                                    newArrData.push(arrData[i]);
                                }
                            }
                            TemplateTree.tree.addNodes(null,newArrData);
                        }
                        _this.initRecognizeGrp(arrData);
                    //},3000)
                }).always(function(){
                    //setTimeout(function(){
                        _this.spinnerSwitch(false);
                    //},3000)
                });
            }
        },
        spinnerSwitch:function(status){
            _this.$imgSpinner.find('imgRecognizeSpinnerGrey').css('display','none');
            _this.$imgSpinner.find('imgRecognizeSpinnerColor').css('display','inline-block');
            if(status === true){
                _this.$divSpinner.addClass('spin')
            }else if(status === false){
                _this.$divSpinner.removeClass('spin')
            }else{
                if(_this.$divSpinner.hasClass('spin')){
                    _this.$divSpinner.removeClass('spin')
                }else{
                    _this.$divSpinner.addClass('spin')
                }
            }
        },
        initRecognizeGrp:function(arrData){
            var divResult,spResultType,spResultNum,btnDiagnosisAdd;
            _this.divResultGrp.innerHTML = '';
            for (var i = 0 ; i< arrData.length; i++){
                divResult = document.createElement('div');
                divResult.className = 'divRecognizeRs';

                spResultType = document.createElement('span');
                spResultType.className = 'spRecognizeType';
                spResultType.textContent = arrData[i].name?arrData[i].name:arrData[i].type;

                spResultNum = document.createElement('span');
                spResultNum.className = 'spRecognizeNum';
                spResultNum.textContent = arrData[i].num;

                btnDiagnosisAdd = document.createElement('span');
                btnDiagnosisAdd.className = 'btnDiagnosisAdd';
                btnDiagnosisAdd.textContent = 'Add Diagnosis Group';

                divResult.appendChild(spResultType);
                divResult.appendChild(spResultNum);
                divResult.appendChild(btnDiagnosisAdd);

                _this.divResultGrp.appendChild(divResult);
            }
            _this.setDivideLine();
            _this.setDivRsPos();
        },
        setDivRsPos:function(){
            _this.divResultGrp.style.left = _this.spinnerPos.centerX + 'px';
            _this.divResultGrp.style.top = _this.spinnerPos.centerY + 'px';
            var $divRs = $('.divRecognizeRs');
            var angleStep = 360 / $divRs.length;
            var radius = _this.spinnerPos.height * 0.85;
            var leftFromCenter = 0;
            var topFromCenter = 0;
            for (var i = 0 ; i < $divRs.length ;i++){
                leftFromCenter = radius * Math.sin(angleStep * (i + 0.5) * Math.PI / 180);
                topFromCenter = radius * Math.cos(angleStep * (i + 0.5) * Math.PI / 180);
                $divRs[i].style.left = leftFromCenter - $divRs[i].offsetWidth / 2 + 'px';
                $divRs[i].style.top = - topFromCenter - $divRs[i].offsetHeight / 2 + 'px';
            }
        },
        setDivideLine:function(){
            $('.divGrpLine').remove();
            var line;
            var grpNum = $('.divRecognizeRs').length;
            var angleStep = 360 / grpNum;
            var radius = _this.spinnerPos.height;
            if (grpNum == 1)return;

            for (var i = 0; i < grpNum ;i++){
                line = document.createElement('div');
                line.className ='divGrpLine';
                line.style.transform = 'rotate(' + (180 + angleStep * i) + 'deg)';
                _this.$divSpinner.append(line);
            }
        },
        onresize:function(){
            PanelToggle.onresize();
            _this.$divSpinner[0].style.height = _this.$divSpinner[0].offsetWidth + 'px';
            _this.spinnerPos = {
                left:_this.$divSpinner[0].offsetLeft,
                top:_this.$divSpinner[0].offsetTop,
                height: _this.$divSpinner[0].offsetHeight,
                width:_this.$divSpinner[0].offsetWidth,
                centerX:_this.$divSpinner[0].offsetLeft + _this.$divSpinner[0].offsetWidth / 2,
                centerY:_this.$divSpinner[0].offsetTop + _this.$divSpinner[0].offsetHeight / 2
            };

            _this.setDivRsPos();
            _this.setDivideLine();
        },
        attachEvent:function(){
        },
        close:function(){

        }
    };
    return PtRecognizeScreen;
})();
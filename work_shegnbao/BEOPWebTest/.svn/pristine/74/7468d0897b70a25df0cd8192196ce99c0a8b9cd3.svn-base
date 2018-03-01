var DataSourceConfigure = (function(){
    function DataSourceConfigure(_parent, _showType, _bIsAdd, _customName, _ptName, _ptDesc, _prjId) {
        // _showType    0：只显示点；1：只显示公式；2：都点和公式显示
        // _bIsAdd      true：新增；false：配置
        // _prjId       项目id，服务于_bIsAdd == false
        this.parent = _parent;
        this.container = undefined;
        this.m_showType = _showType;
        this.m_bIsAdd = _bIsAdd;
        this.m_customName = _customName;
        this.m_pointName = _ptName;
        this.m_pointDesc = _ptDesc;
        this.m_projectId = _prjId;
    }
    DataSourceConfigure.prototype = {
        show:function(){
            var _this = this;
            _this.container = document.createElement('div');
            _this.container.className = 'panel panel-default';
            _this.container.id = 'addPointPanelContain';
            _this.container.style.height = '100%';
            _this.container.style.width = '99%';
            _this.container.style.position = 'absolute';
            _this.container.style.zIndex = '2';
            document.getElementById('dialogContent').style.height = '50%';
            $.get('/static/views/observer/DataSourceAdd.html').done(function (resultHtml) {
                _this.parent.m_parent.hideAnlsPane();
                _this.container.innerHTML = resultHtml;
                document.getElementById('paneContent').appendChild(_this.container);

                I18n.fillArea($('#divDataSourceAddPage'));
                I18n.fillArea($('#divDataSourceFormula'));
                $('#dataSrcPtSearch').attr('placeholder', I18n.resource.dataSource.PROJECT_SEARCH);

                var dsLi = $('#dataSouceConfigure li');
                if (0 === _this.m_showType) {
                    dsLi.eq(1).remove();
                    $('#divDataSourceFormula').remove();
                    new DataSourceOriginal(_this.parent, _this).show();
                }
                else if (1 === _this.m_showType) {
                    dsLi.eq(0).remove();
                    $('#divDataSourceAddPage').remove();
                    $('#divDataSourceFormula').attr('class', 'tab-pane active');
                    new DataSourceFormula(_this.parent, _this).show();
                }
                else if (2 === _this.m_showType) {
                    new DataSourceOriginal(_this.parent, _this).show();
                    new DataSourceFormula(_this.parent, _this).show();
                }
            });
        },

        close: function () {
            $(this.container).remove();
        }
    };

    return DataSourceConfigure;
})();


var DataSourceOriginal = (function () {
    function DataSourceOriginal(_parent,_dsCfg) {
        this.parent = _parent;
        this.m_strPrjName = '';
        this.m_pointList = '';
        this.m_dsCfg = _dsCfg;

        this.m_iconColor = new Array(
            '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
        );
    }

    DataSourceOriginal.prototype = {
        show: function () {
            var _this = this;
            _this.initElement();

        },

        initElement: function () {
            var _this = this;

            if (_this.m_dsCfg.m_bIsAdd) {
                $('#dsConfig').css('display', 'none');
                $('#dsPtName').css('display', 'none');
            }
            else {
                $('#divPointsBody').css('height', 'calc(100% - 194px)');
                $('#inputCustomName').attr('placeholder', _this.parent.m_lang.CUSTOM_NAME);
                $('#inputPointDesc').attr('placeholder', _this.parent.m_lang.POINT_DESC);
                $('#inputCustomName').val(_this.m_dsCfg.m_customName);
                $('#inputPointName').val(_this.m_dsCfg.m_pointName);
                $('#inputPointDesc').val(_this.m_dsCfg.m_pointDesc);
            }

            var selectPrj = $('#dataSrcPrjName');
            var prjId = 0;
            var opt;
            var nSize = AppConfig.projectList.length;
            var nColorSize = _this.m_iconColor.length;

            if (!_this.m_dsCfg.m_bIsAdd && _this.m_dsCfg.m_projectId != -1) {
                prjId = _this.m_dsCfg.m_projectId;
            }
            else {
                prjId = Number(AppConfig.projectId);
            }
            selectPrj.empty();
            for (var i = 0; i < nSize; i++) {
                var project = AppConfig.projectList[i];
                opt = document.createElement('option');
                if ('en' == localStorage['language']) {
                    opt.textContent = project.name_english;
                }
                else {
                    opt.textContent = project.name_cn;
                }
                opt.value = project.id;
                opt.setAttribute('iconColor', _this.m_iconColor[i - parseInt(i / nColorSize) * nColorSize]);
                selectPrj.append(opt);
            }
            selectPrj.val(prjId);
            _this.initNavSelect();


            selectPrj.change(function (e) {
                var prjId = $('#dataSrcPrjName').find('option:selected').val();
                if (typeof(prjId) == "undefined" || '' == prjId) {
                    $('#dataSrcPtSearch').attr('disabled', '');
                    return;
                }
                $('#dataSrcPtSearch').removeAttr('disabled');

                _this.initNavSelect();
                _this.clearSearch();

                var selectPt = $('#divPointsBody tbody');
                selectPt.html('');

                var s3dbData;
                Spinner.spin($('#divDataSourceAddPage')[0]);
                WebAPI.get('/analysis/get_pointList_from_s3db/' + prjId).done(function (result) {
                    s3dbData = JSON.parse(result);
                    //_this.m_pointList = s3dbData;
                    //_this.showPointListAll();

                    WebAPI.get('/analysis/get_pointList_from_rtTable/' + prjId).done(function (result) {
                        var rtData = JSON.parse(result);
                        if (null == s3dbData.pointList) {
                            _this.m_pointList = {'pointList' : rtData.pointList};
                        }
                        else {
                            //_this.m_pointList = {'pointList': s3dbData.pointList.concat(rtData.pointList)};
                            _this.m_pointList = {'pointList' : s3dbData.pointList};

                            // merge same name point
                            var bFind = false;
                            for (var i = 0, len = rtData.pointList.length; i < len; i++) {
                                bFind = false;
                                for (var j = 0, len2 = s3dbData.pointList.length; j < len2; j++) {
                                    if (rtData.pointList[i].name == s3dbData.pointList[j].name) {
                                        bFind = true;
                                        break;
                                    }
                                }
                                if (!bFind) {
                                    _this.m_pointList.pointList.push(rtData.pointList[i]);
                                }
                            }
                        }
                    }).always(function (e) {
                        _this.showPointListAll();
                        Spinner.stop();
                    });
                }).error(function (e) {
                    document.getElementById('dialogContent').style.height = '50%';
                }).always(function (e) {
                    //Spinner.stop();
                });
            });

            $('#btnAddDataSrc').click(function (e) {
                if (_this.selectPoint()) {
                    _this.parent.m_parent.showAnlsPane();
                    $(_this.m_dsCfg.container).remove();
                }
            });

            $('#btnCancelDataSrc').click(function (e) {
                _this.parent.m_parent.showAnlsPane();
                $(_this.m_dsCfg.container).remove();
            });

            $('#dataSrcPtSearch').keyup(function (e) {
                if (13 == e.keyCode) {
                    _this.parsePointListByInput();
                }
            });

            $('#btnSearch').click(function (e) {
                _this.parsePointListByInput();
            });

            $('#divPointsHead li').click(function (e) {
                _this.clearSearch();

                var target = $(e.currentTarget);
                var showChar = target.find('a').text();
                if ('All' == showChar) {
                    _this.initNavSelect();
                    _this.showPointListAll();
                }
                else {
                    _this.clearNavSelect();
                    target.attr('class', 'active');

                    var upChar = showChar.toUpperCase();
                    var lowChar = showChar.toLowerCase();
                    _this.parsePointListByAlphabet(upChar,lowChar);
                }
            });

            selectPrj.change(); // init point list
        },

        selectPointName: function (clickTarget) {
            if (this.m_dsCfg.m_bIsAdd) {
                var target = $(clickTarget);
                var flag = target.attr('class');
                if ('info' == flag) {
                    target.attr('class', '');
                }
                else {
                    target.attr('class', 'info');
                }
            }
            else {
                $('#tableWatch tbody tr').attr('class', '');

                var target = $(clickTarget);
                target.attr('class', 'info');

                $('#inputPointName').val(target.find('td').eq(1).text());
            }
        },

        showPointListAll: function () {
            var _this = this;
            if (null == _this.m_pointList.pointList) {
                return;
            }

            var selectPt = $('#divPointsBody tbody');
            selectPt.html('');

            var tr, td;
            var nSize = _this.m_pointList.pointList.length;
            for (var i = 0; i < nSize; i++) {
                tr = document.createElement('tr');
                tr.className = '';
                tr.onclick = function (e) {
                    var target = e.currentTarget;
                    _this.selectPointName(target);
                };

                td = document.createElement('td');
                td.textContent = i;
                tr.appendChild(td);

                td = document.createElement('td');
                td.textContent = _this.m_pointList.pointList[i].name;
                tr.appendChild(td);

                td = document.createElement('td');
                td.textContent = _this.m_pointList.pointList[i].description;
                tr.appendChild(td);

                selectPt.append(tr);
            }
        },

        parsePointListByAlphabet: function (upCharName, lowCharName) {
            var _this = this;
            if (null == _this.m_pointList.pointList) {
                return;
            }

            var selectPt = $('#divPointsBody tbody');
            selectPt.html('');

            var tr, td;
            var nSize = _this.m_pointList.pointList.length;
            for (var i = 0; i < nSize; i++) {
                var firstChar = (_this.m_pointList.pointList[i].name)[0];
                if (upCharName != firstChar && lowCharName != firstChar) {
                    continue;
                }

                tr = document.createElement('tr');
                tr.className = '';
                tr.onclick = function (e) {
                    var target = e.currentTarget;
                    _this.selectPointName(target);
                };

                td = document.createElement('td');
                td.textContent = i;
                tr.appendChild(td);

                td = document.createElement('td');
                td.textContent = _this.m_pointList.pointList[i].name;
                tr.appendChild(td);

                td = document.createElement('td');
                td.textContent = _this.m_pointList.pointList[i].description;
                tr.appendChild(td);

                selectPt.append(tr);
            }
        },

        parsePointListByInput: function () {
            var _this = this;
            if (null == _this.m_pointList.pointList) {
                var selectPt = $('#divPointsBody tbody');
                selectPt.html('');

                var tr, td;
                tr = document.createElement('tr');
                tr.style.height = '100px';

                td = document.createElement('td');
                td.colSpan = 3;
                td.style.lineHeight = '100%';
                td.style.verticalAlign = 'middle';
                td.style.fontSize = '20px';
                td.style.fontWeight = 'bold';
                td.style.color = 'darkred';
                td.textContent = _this.parent.m_lang.NO_MATCH_FOUND;
                tr.appendChild(td);

                selectPt.append(tr);

                return;
            }
            _this.initNavSelect();

            var strSearchVal;
            strSearchVal = $('#dataSrcPtSearch').val();
            if (null == strSearchVal) {
                return;
            }
            if ('' == strSearchVal) {
                _this.showPointListAll();
            }
            strSearchVal = strSearchVal.toLowerCase();

            var selectPt = $('#divPointsBody tbody');
            selectPt.html('');

            var tr, td;
            var nSize = _this.m_pointList.pointList.length;
            var strGetName, strGetDesc, nIdxName, nIdxDesc;

            // find in point name and description
            for (var i = 0; i < nSize; i++) {
                strGetName = _this.m_pointList.pointList[i].name;
                strGetName = strGetName.toLowerCase();
                strGetName.indexOf(strSearchVal, 0);
                nIdxName = strGetName.indexOf(strSearchVal, 0);

                strGetDesc = _this.m_pointList.pointList[i].description;
                strGetDesc = strGetDesc.toLowerCase();
                strGetDesc.indexOf(strSearchVal, 0);
                nIdxDesc = strGetDesc.indexOf(strSearchVal, 0);

                if (-1 == nIdxName && -1 == nIdxDesc) {
                    continue;
                }

                tr = document.createElement('tr');
                tr.onclick = function (e) {
                    var target = e.currentTarget;
                    _this.selectPointName(target);
                };

                td = document.createElement('td');
                td.textContent = i;
                tr.appendChild(td);

                td = document.createElement('td');
                td.textContent = _this.m_pointList.pointList[i].name;
                tr.appendChild(td);

                td = document.createElement('td');
                td.textContent = _this.m_pointList.pointList[i].description;
                tr.appendChild(td);

                selectPt.append(tr);
            }

            if ('' === selectPt.html()) {
                tr = document.createElement('tr');
                tr.style.height = '100px';

                td = document.createElement('td');
                td.colSpan = 3;
                td.style.lineHeight = '100%';
                td.style.verticalAlign = 'middle';
                td.style.fontSize = '20px';
                td.style.fontWeight = 'bold';
                td.style.color = 'darkred';
                td.textContent = _this.parent.m_lang.NO_MATCH_FOUND;
                tr.appendChild(td);

                selectPt.append(tr);
            }
        },

        clearNavSelect: function () {
            $('#divPointsHead').find('li').each(function () {
                $(this).attr('class', '');
            });
        },

        initNavSelect: function () {
            var _this = this;

            _this.clearNavSelect();
            $('#li_nav_all').attr('class', 'active');
        },

        selectPoint: function () {
            var _this = this;

            var ctlSelectPrj = $('#dataSrcPrjName');
            _this.m_strPrjName = ctlSelectPrj.find('option:selected').text();
            if ('' == _this.m_strPrjName) {
                alert(I18n.resource.observer.widgets.PLEASE_SELECT_PROJECT+'！');
                return false;
            }

            var newPointList = [];
            var row;

            var strUserId = AppConfig.userId;
            var strUserName = AppConfig.account;
            var strCustName = '';
            var prjId = Number(ctlSelectPrj.find('option:selected').attr('value'));
            var prjName = _this.parent.getProjectNameFromId(prjId);
            var iconColor = ctlSelectPrj.find('option:selected').attr('iconColor');
            var strPtName = '';
            var strPtDesc = '';
            var groupId = _this.parent.m_selectGroupId;

            if (_this.m_dsCfg.m_bIsAdd) {   // add
                $('#tableWatch tbody tr').each(function () {
                    if ('info' == this.className) {
                        strPtName = $(this).find('td:eq(1)').text();
                        strPtDesc = $(this).find('td:eq(2)').text();

                        row = {
                            'userId': strUserId,
                            'userName': strUserName,
                            'customName': strPtName,
                            'prjId': prjId,
                            'prjName': prjName,
                            'ptName': strPtName,
                            'ptDesc': strPtDesc,
                            'iconColor': iconColor,
                            'itemType': 0,
                            'groupId': groupId,
                            'groupName': ''
                        };
                        newPointList.push(row);
                    }
                });
            }
            else { // modify
                var custName = $('#inputCustomName').val();
                strPtName = $('#inputPointName').val();
                strPtDesc = $('#inputPointDesc').val();

                row = {
                    'itemId': _this.parent.m_selectItemId,
                    'userId': strUserId,
                    'userName': strUserName,
                    'customName': custName,
                    'prjId': prjId,
                    'prjName': prjName,
                    'ptName': strPtName,
                    'ptDesc': strPtDesc,
                    'iconColor': iconColor,
                    'itemType': 0,
                    'groupId': groupId,
                    'groupName': ''
                };
                newPointList.push(row);

                _this.parent.m_newPointList = newPointList;
                _this.parent.modifyTable();
                return true;
            }

            if (newPointList.length <= 0) {
                alert(_this.parent.m_lang.NO_SELECT_POINT);
                return;
            }
            _this.parent.m_newPointList = newPointList;
            _this.parent.renderTabel();

            //$('#dialogModal').modal('hide');
            return true;
        },

        clearSearch: function () {
            $('#dataSrcPtSearch').val('');
        }
    }

    return DataSourceOriginal;
})();
var DataSourceFormula = (function () {
    function DataSourceFormula(_parent, _dsCfg) {
        this.m_parent = _parent;
        this.m_dsCfg = _dsCfg;
    }
    DataSourceFormula.prototype={
        show: function(){
            this.init();
        },
        init: function(){
            var _this = this;
            _this.initElement();
            _this.dragInit();
            _this.varConfigInit();
            _this.varAddInit();

            $('#inputCustName').attr('placeholder', _this.m_parent.m_lang.CUSTOM_NAME);
            $('#inputFormulaDesc').attr('placeholder', _this.m_parent.m_lang.POINT_DESC);
            $('.mathquill-editable:not(.mathquill-rendered-math)').mathquill('editable');

            if (!_this.m_dsCfg.m_bIsAdd) {
                $('#inputCustName').val(_this.m_dsCfg.m_customName);
                $('#inputFormulaDesc').val(_this.m_dsCfg.m_pointDesc);
            }
        },
        initElement: function () {
            var _this = this;
            var formulaResult;
            $('#btnFormulaDataAdd').click(function (e) {
                var input = $('#inputCustName');

                var name;
                var preName = $('#inputCustName').val();
                if ('' == preName) {
                    var list = _this.m_parent.m_allPointList;
                    var count = 0;
                    for (var i = 0, len = list.length; i < len; i++) {
                        if (1 == list[i].itemType) {
                            count++;
                        }
                    }
                    name = 'Formula' + count;
                }
                else {
                    name = preName;
                }

                if (name == '') {
                    input.focus();
                    alert(_this.m_parent.m_lang.CUSTOM_NOT_NULL);
                    return;
                }
                //if (Boolean(_this.m_parent.checkRepeatWithCustomName(name))) {
                //    input.select();
                //    alert(_this.m_parent.m_lang.CUSTOM_REPEAT);
                //    return;
                //}

                var strFormulaVal = _this.formulaGet();
                if ('error' != strFormulaVal) {
                    if (_this.m_dsCfg.m_bIsAdd) {
                        _this.m_parent.renderFormula(name, strFormulaVal, $('#inputFormulaDesc').val());
                    }
                    else {
                        _this.m_parent.modifyFormula(name, strFormulaVal, $('#inputFormulaDesc').val());
                    }
                    _this.m_parent.m_parent.showAnlsPane();
                    $(_this.m_dsCfg.container).remove();
                }
            });
            $('#btnCancelFormulaData').click(function (e) {
                _this.m_parent.m_parent.showAnlsPane();
                $(_this.m_dsCfg.container).remove();
            });
        },
        dragInit: function() {
            var _this = this;
            var $formulaVarRow = $('#varConfig .varRow').not('#varConfig .row:first-child');
            $formulaVarRow.on('dragenter', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            $formulaVarRow.on('dragover', function (e) {
                e.preventDefault();
                $(e.currentTarget).addClass('varSel');
            });
            $formulaVarRow.on('dragleave', function (e) {
                e.preventDefault();
                $(e.currentTarget).removeClass('varSel');
            });
            for (var i = 0; i < $formulaVarRow.length; ++i) {
                $formulaVarRow[i].ondrop = function (e) {
                    var targetId;
                    e.preventDefault();
                    targetId = e.dataTransfer.getData("dsItemId");
                    var formulaVarValue = '<div class="col-lg-6 col-xs-8 formulaVarValue grow" varId="'+targetId+'">\
                                            <span></span>\
                                            <div>' + AppConfig.datasource.getDSItemById(targetId).alias + '</div>\
                                            <span class="glyphicon glyphicon-remove-sign grow removeVarValue" aria-hidden="true" ></span>\
                                            </div>';
                    $(e.currentTarget).find('.divVarValue').html(formulaVarValue);
                    $(e.currentTarget).find('.removeVarValue').on('click',function(){
                        $(this).parents('.formulaVarValue').remove();
                    })
                }
            }
            $('#dataSrcPanel').on('dragend',function(e){
                e.preventDefault();
                $('.varSel').removeClass('varSel')
            });
        },
        varConfigInit:function(){
            //$('#formulaCustomName').click(function(){
            //    $('#inputCustName').css('display','block').focus();
            //});
            //$('#inputCustName').blur(function(){
            //    this.style.display = 'none';
            //    if(this.value != '') {
            //        this.parentNode.childNodes[2].textContent = this.value;
            //    }
            //})
            var $varConfig = $('#varConfig');
            $('.formulaVarName').click(function(){
                $(this).children().css('display','inline');
                $(this).children().val(this.childNodes[1].textContent).focus();
                $(this).children('span').css('display','none');
            });
            $('.varNameChange').blur(function(){
                this.style.display = 'none';
                if(this.value != '') {
                    this.parentNode.childNodes[1].textContent = this.value;
                }
                $(this).next('span').css('display','inline');
            });
            $varConfig.find('.varRemove').on('click',function(){
                $(this).parents('.row').remove();
            });
        },

        varAddInit: function(){
            var $varConfig = $('#varConfig');
            var newVarName;
            var _this = this;
            $varConfig.find('.glyphicon-plus-sign').click(function(){
                newVarName = $('.formulaVarName').last().text();
                newVarName = newVarName.substr(0,newVarName.length - 1) + String.fromCharCode(newVarName.charCodeAt(newVarName.length - 1) + 1);
                if (newVarName.charCodeAt(0) == 0){
                    newVarName = 'a';
                }
                $varConfig.get(0).innerHTML += '<div class="row"><div class="col-xs-12 varRow">\
                                                    <div class="varRemove"><span class="glyphicon glyphicon-remove-sign grow" aria-hidden="true"></span></div>\
                                                    <div class="col-lg-4 col-xs-4 formulaVarName"><input type="text" name="inputVarValue" class="varNameChange">'+ newVarName +'</div>\
                                                    <div class="col-xs-6 divVarValue"></div>\
                                                </div></div>';
                _this.varAddInit();
                _this.dragInit();
                _this.varConfigInit();
            });
        },
        formulaGet:function() {
            var $editableMath = $('#editable-math');
            var $varRow = $('#varConfig .varRow');
            var latexMathValue = $editableMath.mathquill('latex');
            var varNum = $varRow.length;
            var varId,varName;
            var searchReg;
            var varError = new Array;
            $('.varLack').remove();
            //$('.varLack').removeClass('varLack');
            for (var i = 0;i < varNum;++i){
                varName = $($varRow.find('.formulaVarName').get(i));
                varId = $($varRow.find('.divVarValue').get(i)).children().attr('varId');
                searchReg = new RegExp('\\b'+varName.text()+'\\b', 'g');
                if (searchReg.test(latexMathValue)){
                    if (varId){
                        latexMathValue = latexMathValue.replace(searchReg, '<%' + varId + '%>');
                    }else{
                        varError.push(varName);
                    }
                }
            }
            //$('.varLack').removeClass('varLack');
            if (varError.length > 0){
                for (var ele = 0; ele < varError.length; ++ele) {
                    varError[ele].append($('<span class="varLack">Unassigned!<span>'));
                    //varError[ele].addClass('varLack');
                }
                alert('Lack Variable in Formula');
                return 'error';
            }
            return latexMathValue;
        }
    };
    return DataSourceFormula;
})();
var DataSourceConfigure = (function () {
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
        show: function () {
            var _this = this;
            _this.container = document.createElement('div');
            _this.container.className = 'panel panel-default';
            _this.container.id = 'addPointPanelContain';
            _this.container.style.height = '100%';
            _this.container.style.width = '99%';
            _this.container.style.position = 'absolute';
            _this.container.style.zIndex = '2';
            document.getElementById('dialogContent').style.height = '50%';
            WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (resultHtml) {
                if (_this.parent.m_parent != undefined) {
                    _this.parent.m_parent.hideAnlsPane();
                }
                _this.container.innerHTML = resultHtml;
                document.getElementById('paneContent').appendChild(_this.container);

                I18n.fillArea($('#addPointPanelContain'));

                //var dsLi = $('#dataSouceConfigure li');
                if (0 === _this.m_showType) {
                    //dsLi.eq(1).remove();
                    $('#divDataSourceFormula').css('display', 'none');
                    $('#formulaHeading').css('display', 'none');
                    $('#formulaFooter').css('display', 'none');
                    $('#divDataSourceAddPage').css('display', '');
                    $('#originalHeading').css('display', '');
                    $('#originalFooter').css('display', '');
                    new DataSourceOriginal(_this.parent, _this).show();
                }
                else if (1 === _this.m_showType) {
                    //dsLi.eq(0).remove();
                    $('#divDataSourceAddPage').css('display', 'none');
                    $('#originalHeading').css('display', 'none');
                    $('#originalFooter').css('display', 'none');
                    $('#divDataSourceFormula').css('display', '');
                    $('#formulaHeading').css('display', '');
                    $('#formulaFooter').css('display', '');
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
    function DataSourceOriginal(_parent, _dsCfg) {
        this.parent = _parent;
        this.m_strPrjName = '';
        this.m_pointList = '';
        this.m_dsCfg = _dsCfg;
        this.m_parseFmt = {'search': '', 'arrCustom': [], 'arrSystem': [], 'arrDevice': [], 'arrType': []};
        this.m_lang = I18n.resource.dataSource;

        this.m_iconColor = new Array(
            '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
        );
        this.m_rowStyle = 'rowSelStyle';
        this.m_curPageNum = 0;
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
                $('#inputCustomName').attr('placeholder', _this.m_lang.CUSTOM_NAME);
                $('#inputPointDesc').attr('placeholder', _this.m_lang.POINT_DESC);
                $('#inputCustomName').val(_this.m_dsCfg.m_customName);
                $('#inputPointName').val(_this.m_dsCfg.m_pointName);
                $('#inputPointDesc').val(_this.m_dsCfg.m_pointDesc);
            }

            // 标题国际化
            var iconTitSys = $('#dataSrcSys li');
            iconTitSys.eq(1).attr('title', _this.m_lang.ICON_SYS_HVAC);
            iconTitSys.eq(2).attr('title', _this.m_lang.ICON_SYS_POWER);
            iconTitSys.eq(3).attr('title', _this.m_lang.ICON_SYS_LIGHT);
            iconTitSys.eq(4).attr('title', _this.m_lang.ICON_SYS_CRAC);

            var iconTitDev = $('#dataSrcEquip li');
            iconTitDev.eq(1).attr('title', _this.m_lang.ICON_DEV_CHIL);
            iconTitDev.eq(2).attr('title', _this.m_lang.ICON_DEV_PUMP);
            iconTitDev.eq(3).attr('title', _this.m_lang.ICON_DEV_COOL);
            iconTitDev.eq(4).attr('title', _this.m_lang.ICON_DEV_AHU);
            iconTitDev.eq(5).attr('title', _this.m_lang.ICON_DEV_VAV);
            iconTitDev.eq(6).attr('title', _this.m_lang.ICON_DEV_SYS);

            var iconTitType = $('#dataSrcType li');
            iconTitType.eq(1).attr('title', _this.m_lang.ICON_TYPE_ELEPOWMET);
            iconTitType.eq(2).attr('title', _this.m_lang.ICON_TYPE_THER);
            iconTitType.eq(3).attr('title', _this.m_lang.ICON_TYPE_TEMP);
            iconTitType.eq(4).attr('title', _this.m_lang.ICON_TYPE_FLOW);
            iconTitType.eq(5).attr('title', _this.m_lang.ICON_TYPE_PRES);
            iconTitType.eq(6).attr('title', _this.m_lang.ICON_TYPE_CURFLOW);
            iconTitType.eq(7).attr('title', _this.m_lang.ICON_TYPE_ELEPOW);
            iconTitType.eq(8).attr('title', _this.m_lang.ICON_TYPE_FREQ);
            iconTitType.eq(9).attr('title', _this.m_lang.ICON_TYPE_ONOFF);
            iconTitType.eq(10).attr('title', _this.m_lang.ICON_TYPE_ALARM);


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
            _this.initNavControls();


            selectPrj.change(function (e) {
                var prjId = $('#dataSrcPrjName').find('option:selected').val();
                if (typeof(prjId) == "undefined" || '' == prjId) {
                    $('#dataSrcPtSearch').attr('disabled', '');
                    return;
                }
                $('#dataSrcPtSearch').removeAttr('disabled');

                _this.clearSearch();
                var ulCust = $('#dataSrcCustom .pagination');
                ulCust.empty();
                ulCust.append('<li><span class="filterCustom filterCustomSelected" id="filterCustomAll" i18n="dataSource.POINT_TYPE_CUSTOM"  style="width: 55px;">All</span></li>');

                var selectPt = $('#divPointsBody tbody');
                selectPt.html('');

                _this.initPointList();
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
                var searchVal = $('#dataSrcPtSearch').val();
                if ('' == searchVal) {
                    _this.initPointList();
                }
                if (13 == e.keyCode) {
                    _this.searchPointsEx(searchVal);
                }
            });

            $('#btnSearch').click(function (e) {
                var searchVal = $('#dataSrcPtSearch').val();
                _this.searchPointsEx(searchVal);
            });

            $('#divPointsHead li').click(function (e) {
                _this.clearSearch();

                var target = $(e.currentTarget);
                var showChar = target.find('a').text();
                if ('All' == showChar) {
                    _this.showPointListAll();
                }
                else {
                    _this.clearNavSelect();
                    target.attr('class', 'active');

                    var upChar = showChar.toUpperCase();
                    var lowChar = showChar.toLowerCase();
                    _this.parsePointListByAlphabet(upChar, lowChar);
                }
            });

            var iconSys = $('#dataSrcSys .filterIcon');
            iconSys.click(function (e) {
                var target = $(e.currentTarget);
                var id = target.attr('id');
                if ('filterSystemAll' == id) {
                    _this.m_parseFmt.arrSystem = [];
                    iconSys.removeClass('filterIconSysSelected');
                    target.addClass('filterIconSysSelected');
                }
                else {
                    if ('filterSystem1' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrSystem.push(1);
                            target.addClass('filterIconSysSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrSystem, 1);
                            target.removeClass('filterIconSysSelected');
                        }
                    }
                    else if ('filterSystem2' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrSystem.push(2);
                            target.addClass('filterIconSysSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrSystem, 2);
                            target.removeClass('filterIconSysSelected');
                        }
                    }
                    else if ('filterSystem3' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrSystem.push(3);
                            target.addClass('filterIconSysSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrSystem, 3);
                            target.removeClass('filterIconSysSelected');
                        }
                    }
                    else if ('filterSystem4' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrSystem.push(4);
                            target.addClass('filterIconSysSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrSystem, 4);
                            target.removeClass('filterIconSysSelected');
                        }
                    }
                    if (_this.m_parseFmt.arrSystem.length > 0) {
                        $('#filterSystemAll').removeClass('filterIconSysSelected');
                    }
                    else {
                        $('#filterSystemAll').addClass('filterIconSysSelected');
                    }
                }
                _this.searchPoints();
            });

            var iconDev = $('#dataSrcEquip .filterIcon');
            iconDev.click(function (e) {
                var target = $(e.currentTarget);
                var id = target.attr('id');
                if ('filterDeviceAll' == id) {
                    _this.m_parseFmt.arrDevice = [];
                    iconDev.removeClass('filterIconDevSelected');
                    target.addClass('filterIconDevSelected');
                }
                else {
                    if ('filterDevice1' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrDevice.push(1);
                            target.addClass('filterIconDevSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrDevice, 1);
                            target.removeClass('filterIconDevSelected');
                        }
                    }
                    else if ('filterDevice2' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrDevice.push(2);
                            target.addClass('filterIconDevSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrDevice, 2);
                            target.removeClass('filterIconDevSelected');
                        }
                    }
                    else if ('filterDevice3' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrDevice.push(3);
                            target.addClass('filterIconDevSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrDevice, 3);
                            target.removeClass('filterIconDevSelected');
                        }
                    }
                    else if ('filterDevice4' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrDevice.push(4);
                            target.addClass('filterIconDevSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrDevice, 4);
                            target.removeClass('filterIconDevSelected');
                        }
                    }
                    else if ('filterDevice5' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrDevice.push(5);
                            target.addClass('filterIconDevSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrDevice, 5);
                            target.removeClass('filterIconDevSelected');
                        }
                    }
                    else if ('filterDevice6' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrDevice.push(6);
                            target.addClass('filterIconDevSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrDevice, 6);
                            target.removeClass('filterIconDevSelected');
                        }
                    }
                    if (_this.m_parseFmt.arrDevice.length > 0) {
                        $('#filterDeviceAll').removeClass('filterIconDevSelected');
                    }
                    else {
                        $('#filterDeviceAll').addClass('filterIconDevSelected');
                    }
                }
                _this.searchPoints();
            });

            var iconType = $('#dataSrcType .filterIcon');
            iconType.click(function (e) {
                var target = $(e.currentTarget);
                var id = target.attr('id');
                if ('filterTypeAll' == id) {
                    _this.m_parseFmt.arrType = [];
                    iconType.removeClass('filterIconTypeSelected');
                    target.addClass('filterIconTypeSelected');
                }
                else {
                    if ('filterType1' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(1);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 1);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    else if ('filterType2' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(2);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 2);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    else if ('filterType3' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(3);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 3);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    else if ('filterType4' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(4);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 4);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    else if ('filterType5' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(5);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 5);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    else if ('filterType6' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(6);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 6);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    else if ('filterType7' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(7);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 7);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    else if ('filterType8' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(8);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 8);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    else if ('filterType9' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(9);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 9);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    else if ('filterType10' == id) {
                        if ('filterIcon' == target.eq(0).attr('class')) {
                            _this.m_parseFmt.arrType.push(10);
                            target.addClass('filterIconTypeSelected');
                        }
                        else {
                            _this.delInArray(_this.m_parseFmt.arrType, 10);
                            target.removeClass('filterIconTypeSelected');
                        }
                    }
                    if (_this.m_parseFmt.arrType.length > 0) {
                        $('#filterTypeAll').removeClass('filterIconTypeSelected');
                    }
                    else {
                        $('#filterTypeAll').addClass('filterIconTypeSelected');
                    }
                }
                _this.searchPoints();
            });

            selectPrj.change(); // init point list
        },

        selectPointName: function (clickTarget) {
            if (this.m_dsCfg.m_bIsAdd) {
                var target = $(clickTarget);
                var flag = target.attr('class');
                if (this.m_rowStyle == flag) {
                    target.attr('class', '');
                }
                else {
                    target.attr('class', this.m_rowStyle);
                }
            }
            else {
                $('#tableWatch tbody tr').attr('class', '');

                var target = $(clickTarget);
                target.attr('class', this.m_rowStyle);

                $('#inputPointName').val(target.find('td').eq(1).text());
            }
        },

        showPointListAll: function () {
            $("#divPointsBody").scrollTop(0);
            var _this = this;
            if (null == _this.m_pointList.pointList) {
                return;
            }

            var selectPt = $('#divPointsBody tbody');
            selectPt.html('');

            var tr, td, item, div;
            var nSize = _this.m_pointList.pointList.length;
            for (var i = 0; i < nSize; i++) {
                item = _this.m_pointList.pointList[i];
                tr = document.createElement('tr');
                tr.className = '';
                tr.onclick = function (e) {
                    var target = e.currentTarget;
                    _this.selectPointName(target);
                };

                td = document.createElement('td');
                td.textContent = ((parseInt(_this.m_curPageNum) * 50) + i) + '';
                tr.appendChild(td);

                td = document.createElement('td');
                td.textContent = item.name;
                td.title = item.name;
                $(td).css('max-width', '250px');
                $(td).css('overflow-x', 'hidden');
                $(td).css('text-overflow', 'ellipsis');
                tr.appendChild(td);

                td = document.createElement('td');
                td.textContent = item.description;
                td.title = item.description;
                $(td).css('max-width', '250px');
                $(td).css('overflow-x', 'hidden');
                $(td).css('text-overflow', 'ellipsis');
                tr.appendChild(td);

                if (item.system != undefined && item.device != undefined && item.type != undefined) {
                    td = document.createElement('td');
                    $(td).css('min-width', '90px');
                    // custom name
                    if ('' != item.custom) {
                        div = document.createElement('div');
                        div.textContent = item.custom;
                        $(div).css('float', 'left');
                        $(div).css('display', 'inline');
                        $(div).css('color', '#fff');
                        $(div).css('border-radius', '8px');
                        $(div).css('padding', '0 5px 0 5px');
                        $(div).css('background-color', '#428bca');
                        td.appendChild(div);
                    }

                    // icon system
                    if (0 != item.system) {
                        div = document.createElement('div');
                        div.className = 'iconComm';
                        if (1 == item.system) {
                            div.id = 'iconSys1';
                        }
                        else if (2 == item.system) {
                            div.id = 'iconSys2';
                        }
                        else if (3 == item.system) {
                            div.id = 'iconSys3';
                        }
                        else if (4 == item.system) {
                            div.id = 'iconSys4';
                        }
                        $(div).css('float', 'left');
                        $(div).css('display', 'inline');
                        $(div).css('margin-left', '3px');
                        $(div).css('border-radius', '6px');
                        td.appendChild(div);
                    }

                    // icon device
                    if (0 != item.device) {
                        div = document.createElement('div');
                        div.className = 'iconComm';
                        if (1 == item.device) {
                            div.id = 'iconDev1';
                        }
                        else if (2 == item.device) {
                            div.id = 'iconDev2';
                        }
                        else if (3 == item.device) {
                            div.id = 'iconDev3';
                        }
                        else if (4 == item.device) {
                            div.id = 'iconDev4';
                        }
                        else if (5 == item.device) {
                            div.id = 'iconDev5';
                        }
                        else if (6 == item.device) {
                            div.id = 'iconDev6';
                        }
                        $(div).css('float', 'left');
                        $(div).css('display', 'inline');
                        $(div).css('margin-left', '3px');
                        $(div).css('border-radius', '6px');
                        td.appendChild(div);
                    }

                    // icon type
                    if (0 != item.type) {
                        div = document.createElement('div');
                        div.className = 'iconComm';
                        if (1 == item.type) {
                            div.id = 'iconType1';
                        }
                        else if (2 == item.type) {
                            div.id = 'iconType2';
                        }
                        else if (3 == item.type) {
                            div.id = 'iconType3';
                        }
                        else if (4 == item.type) {
                            div.id = 'iconType4';
                        }
                        else if (5 == item.type) {
                            div.id = 'iconType5';
                        }
                        else if (6 == item.type) {
                            div.id = 'iconType6';
                        }
                        else if (7 == item.type) {
                            div.id = 'iconType7';
                        }
                        else if (8 == item.type) {
                            div.id = 'iconType8';
                        }
                        else if (9 == item.type) {
                            div.id = 'iconType9';
                        }
                        else if (10 == item.type) {
                            div.id = 'iconType10';
                        }
                        $(div).css('float', 'left');
                        $(div).css('display', 'inline');
                        $(div).css('margin-left', '3px');
                        $(div).css('border-radius', '6px');
                        td.appendChild(div);
                    }

                    tr.appendChild(td);
                }
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
                td.textContent = _this.m_lang.NO_MATCH_FOUND;
                tr.appendChild(td);

                selectPt.append(tr);

                return;
            }

            var strSearchVal;
            strSearchVal = $('#dataSrcPtSearch').val();
            if (null == strSearchVal) {
                return;
            }
            if ('' == strSearchVal) {
                _this.showPointListAll();
            }
            strSearchVal = strSearchVal.toLowerCase();
            var arrSearchVal = strSearchVal.split(' ');

            var selectPt = $('#divPointsBody tbody');
            selectPt.html('');

            var tr, td;
            var nSize = _this.m_pointList.pointList.length;
            var strGetName, strGetDesc, nIdxName, nIdxDesc, nIdxNameFlag, nIdxDescFlag;

            // find in point name and description
            for (var i = 0; i < nSize; i++) {
                nIdxNameFlag = true;
                nIdxDescFlag = true;
                for (var j = 0; j < arrSearchVal.length; ++j) {
                    if (arrSearchVal[j] == '') continue;
                    strGetName = _this.m_pointList.pointList[i].name;
                    strGetName = strGetName.toLowerCase();
                    strGetName.indexOf(arrSearchVal[j], 0);
                    nIdxName = strGetName.indexOf(arrSearchVal[j], 0);
                    strGetDesc = _this.m_pointList.pointList[i].description;
                    strGetDesc = strGetDesc.toLowerCase();
                    strGetDesc.indexOf(arrSearchVal[j], 0);
                    nIdxDesc = strGetDesc.indexOf(arrSearchVal[j], 0);
                    if (-1 == nIdxName) {
                        nIdxNameFlag = false;
                    }
                    if (-1 == nIdxDesc) {
                        nIdxDescFlag = false;
                    }
                    if (!nIdxNameFlag && !nIdxDescFlag) {
                        break;
                    }
                }

                if (!nIdxNameFlag && !nIdxDescFlag) {
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
                td.textContent = _this.m_lang.NO_MATCH_FOUND;
                tr.appendChild(td);

                selectPt.append(tr);
            }
        },

        clearNavSelect: function () {
            $('#divPointsHead').find('li').each(function () {
                $(this).attr('class', '');
            });
        },

        initNavControls: function () {
            $('#filterSystemAll').addClass('filterIconSysSelected');
            $('#filterDeviceAll').addClass('filterIconDevSelected');
            $('#filterTypeAll').addClass('filterIconTypeSelected');
        },

        initNavCustomControls: function () {
            var _this = this;
            var ulCust = $('#dataSrcCustom .pagination');
            ulCust.empty();
            ulCust.append('<li><span class="filterCustom filterCustomSelected" id="filterCustomAll" i18n="dataSource.POINT_TYPE_CUSTOM" style="width: 55px;">All</span></li>');
            for (var i = 0, len = _this.m_pointList.customName.length; i < len; i++) {
                var item = _this.m_pointList.customName[i];
                if ('' == item) {
                    continue;
                }
                var li = $('<li><span class="filterCustom">' + item + '</span></li>');
                ulCust.append(li);
            }

            var iconCust = $('#dataSrcCustom .filterCustom');
            iconCust.click(function (e) {
                var target = $(e.currentTarget);
                var showChar = target.text();
                if ('All' == showChar) {
                    _this.m_parseFmt.arrCustom = [];
                    iconCust.removeClass('filterCustomSelected');
                    target.addClass('filterCustomSelected');
                }
                else {
                    if ('filterCustom' == target.eq(0).attr('class')) {
                        _this.m_parseFmt.arrCustom.push(showChar);
                        target.addClass('filterCustomSelected');
                    }
                    else {
                        _this.delInArray(_this.m_parseFmt.arrCustom, showChar);
                        target.removeClass('filterCustomSelected');
                    }
                    if (_this.m_parseFmt.arrCustom.length > 0) {
                        $('#filterCustomAll').removeClass('filterCustomSelected');
                    }
                    else {
                        $('#filterCustomAll').addClass('filterCustomSelected');
                    }
                }
                _this.searchPoints();
            });
        },

        initNavPageNum: function (allPageNum) {
            var _this = this;
            var ul = $('<ul class="pagination">\
                <li><a class="pageFlag" value="First"><span aria-hidden="true">&laquo;</span></a></li>\
                <li><a class="pageFlag" value="Previous"><span aria-hidden="true">&lsaquo;</span></a></li>\
            </ul>');
            if (allPageNum > 5) {
                ul.append('<li class="active"><a class="pageFlag pageNum" value="1">1</a></li>\
                    <li><a class="pageFlag pageNum" value="2">2</a></li>\
                    <li><a class="pageFlag pageNum" value="3">3</a></li>\
                    <li><a class="pageFlag pageNum" value="4">4</a></li>\
                    <li><a class="pageFlag pageNum" value="5">5</a></li>');
            }
            else {
                for (var i = 0; i < allPageNum; i++) {
                    var num = i + 1;
                    ul.append('<li><a class="pageFlag pageNum" value="' + num + '">' + num + '</a></li>');
                }
            }
            ul.append('<li><a class="pageFlag" value="Next"><span aria-hidden="true">&rsaquo;</span></a></li>\
                        <li><a class="pageFlag" value="Last"><span aria-hidden="true">&raquo;</span></a></li>');

            var pageFlag = ul.find('.pageFlag');
            pageFlag.click(function (e) {
                var value = $(e.currentTarget).attr('value');
                if ('First' == value) {
                    if (_this.m_curPageNum != 0) {
                        _this.setCurrentPage(0);
                    }
                }
                else if ('Previous' == value) {
                    if (_this.m_curPageNum > 0) {
                        _this.setCurrentPage(_this.m_curPageNum - 1);
                    }
                }
                else if ('Next' == value) {
                    if (_this.m_curPageNum < allPageNum - 1) {
                        _this.setCurrentPage(_this.m_curPageNum + 1);
                    }
                }
                else if ('Last' == value) {
                    if (_this.m_curPageNum != allPageNum - 1) {
                        _this.setCurrentPage(allPageNum - 1);
                    }
                }
                else {
                    if (_this.m_curPageNum != value - 1) {
                        _this.setCurrentPage(value - 1);
                    }
                }
            });
            $('#navPageNum').empty();
            $('#navPageNum').append(ul);
        },

        setCurrentPage: function (curPageNum) {
            var _this = this;
            var prjId = $('#dataSrcPrjName').find('option:selected').val();
            Spinner.spin($('#divDataSourceAddPage')[0]);
            WebAPI.get('/analysis/get_pointList_from_s3db/' + prjId + '/' + curPageNum + '/50').done(function (result) {
                _this.m_pointList = {
                    'pointList': result.pointList,
                    'customName': result.customName,
                    'pageAllNum': result.pageAllNum
                };
                _this.m_curPageNum = curPageNum;
                var liPageNum = $('#navPageNum').find('.pageNum');
                if (curPageNum <= 2) {
                    liPageNum.eq(0).attr('value', '1');
                    liPageNum.eq(1).attr('value', '2');
                    liPageNum.eq(2).attr('value', '3');
                    liPageNum.eq(3).attr('value', '4');
                    liPageNum.eq(4).attr('value', '5');
                    liPageNum.eq(0).text('1');
                    liPageNum.eq(1).text('2');
                    liPageNum.eq(2).text('3');
                    liPageNum.eq(3).text('4');
                    liPageNum.eq(4).text('5');
                }
                else if (curPageNum >= result.pageAllNum - 3) {
                    liPageNum.eq(0).attr('value', result.pageAllNum - 4);
                    liPageNum.eq(1).attr('value', result.pageAllNum - 3);
                    liPageNum.eq(2).attr('value', result.pageAllNum - 2);
                    liPageNum.eq(3).attr('value', result.pageAllNum - 1);
                    liPageNum.eq(4).attr('value', result.pageAllNum);
                    liPageNum.eq(0).text(result.pageAllNum - 4);
                    liPageNum.eq(1).text(result.pageAllNum - 3);
                    liPageNum.eq(2).text(result.pageAllNum - 2);
                    liPageNum.eq(3).text(result.pageAllNum - 1);
                    liPageNum.eq(4).text(result.pageAllNum);
                }
                else {
                    liPageNum.eq(0).attr('value', curPageNum - 1);
                    liPageNum.eq(1).attr('value', curPageNum);
                    liPageNum.eq(2).attr('value', curPageNum + 1);
                    liPageNum.eq(3).attr('value', curPageNum + 2);
                    liPageNum.eq(4).attr('value', curPageNum + 3);
                    liPageNum.eq(0).text(curPageNum - 1);
                    liPageNum.eq(1).text(curPageNum);
                    liPageNum.eq(2).text(curPageNum + 1);
                    liPageNum.eq(3).text(curPageNum + 2);
                    liPageNum.eq(4).text(curPageNum + 3);
                }

                // set current page background-color
                for (var i = 0, len = liPageNum.length; i < len; i++) {
                    var item = liPageNum.eq(i);
                    if (item.attr('value') == curPageNum + 1) {
                        item.closest('li').attr('class', 'active');
                    }
                    else {
                        item.closest('li').removeAttr('class');
                    }
                }
                _this.showPointListAll();
            }).error(function (e) {
                document.getElementById('dialogContent').style.height = '50%';
            }).always(function (e) {
                Spinner.stop();
            });
        },

        selectPoint: function () {
            var _this = this;

            var ctlSelectPrj = $('#dataSrcPrjName');
            _this.m_strPrjName = ctlSelectPrj.find('option:selected').text();
            if ('' == _this.m_strPrjName) {
                alert(I18n.resource.observer.widgets.PLEASE_SELECT_PROJECT + '！');
                return false;
            }

            var newPointList = [];
            var row;

            var strUserId = AppConfig.userId;
            var strUserName = AppConfig.account;
            var strCustName = '';
            var prjId = Number(ctlSelectPrj.find('option:selected').attr('value'));
            var langFlag = ('zh' == localStorage['language']) ? 0 : 1;
            var prjName = _this.parent.getProjectNameFromId(prjId, langFlag);
            var iconColor = ctlSelectPrj.find('option:selected').attr('iconColor');
            var strPtName = '';
            var strPtDesc = '';
            var groupId = _this.parent.m_selectGroupId;

            if (_this.m_dsCfg.m_bIsAdd) {   // add
                $('#tableWatch tbody tr').each(function () {
                    if (_this.m_rowStyle == this.className) {
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
                $('#tableWatch tbody tr').each(function () {
                    if (_this.m_rowStyle == this.className) {
                        strPtName = $(this).find('td:eq(1)').text();
                        strPtDesc = $(this).find('td:eq(2)').text();

                        row = {
                            'itemId': _this.parent.m_selectItemId,
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
                        return false;
                    }
                });
                if (newPointList.length < 1) {
                    return true;
                }
                _this.parent.m_newPointList = newPointList;
                _this.parent.modifyTable();
                return true;
            }

            if (newPointList.length <= 0) {
                alert(_this.m_lang.NO_SELECT_POINT);
                return;
            }
            _this.parent.m_newPointList = newPointList;
            _this.parent.renderTabel();

            //$('#dialogModal').modal('hide');
            return true;
        },

        clearSearch: function () {
            $('#dataSrcPtSearch').val('');
        },

        parsePointListByFmt: function (src) {
            // 参数src格式，如下：
            // {'search':'xyz','custom':'abc','arrSystem':0,'arrDevice':1,'arrType':2}
            var _this = this;
            var item;
            var parseList = [];
            var search_regex = null;
            try {
                search_regex = src.search ? new RegExp(src.search, 'i') : null;
            } catch (e) {
                src.search = src.search.replace('.*', '*').replace('*', '.*');
                search_regex = src.search ? new RegExp(src.search, 'i') : null;
            }

            for (var i = 0, len = _this.m_pointList.pointList.length; i < len; i++) {
                item = _this.m_pointList.pointList[i];
                if ((_this.findInArray(src.arrCustom, item.custom) || 0 == src.arrCustom.length)
                    && (_this.findInArray(src.arrSystem, item.system) || 0 == src.arrSystem.length)
                    && (_this.findInArray(src.arrDevice, item.device) || 0 == src.arrDevice.length)
                    && (_this.findInArray(src.arrType, item.type) || 0 == src.arrType.length)
                ) {
                    if (search_regex) {
                        if (search_regex.test(item.name) || search_regex.test(item.description)) {
                            parseList.push(item);
                        }
                    } else {
                        parseList.push(item);
                    }
                }
            }
            return parseList;
        },

        findInArray: function (array, findVal) {
            if (0 == findVal) {
                return false;
            }

            var bFind = false;
            for (var i = 0, len = array.length; i < len; i++) {
                if (findVal == array[i]) {
                    bFind = true;
                    break;
                }
            }
            return bFind;
        },

        delInArray: function (array, delVal) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (delVal == array[i]) {
                    array.splice(i, 1);
                    break;
                }
            }
        },

        showFmtIntoList: function (showList) {
            var _this = this;
            if (null == showList) {
                return;
            }

            var selectPt = $('#divPointsBody tbody');
            selectPt.html('');

            var tr, td, item, div;
            var nSize = showList.length;
            for (var i = 0; i < nSize; i++) {
                item = showList[i];
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
                td.textContent = item.name;
                td.title = item.name;
                $(td).css('max-width', '350px');
                $(td).css('overflow-x', 'hidden');
                $(td).css('text-overflow', 'ellipsis');
                tr.appendChild(td);

                td = document.createElement('td');
                td.textContent = item.description;
                td.title = item.name;
                $(td).css('max-width', '350px');
                $(td).css('overflow-x', 'hidden');
                $(td).css('text-overflow', 'ellipsis');
                tr.appendChild(td);

                if (item.system != undefined && item.device != undefined && item.type != undefined) {
                    td = document.createElement('td');
                    $(td).css('min-width', '90px');
                    // custom name
                    if ('' != item.custom) {
                        div = document.createElement('div');
                        div.textContent = item.custom;
                        $(div).css('float', 'left');
                        $(div).css('display', 'inline');
                        $(div).css('color', '#fff');
                        $(div).css('border-radius', '8px');
                        $(div).css('padding', '0 5px 0 5px');
                        $(div).css('background-color', '#428bca');
                        td.appendChild(div);
                    }

                    // icon system
                    if (0 != item.system) {
                        div = document.createElement('div');
                        div.className = 'iconComm';
                        if (1 == item.system) {
                            div.id = 'iconSys1';
                        }
                        else if (2 == item.system) {
                            div.id = 'iconSys2';
                        }
                        else if (3 == item.system) {
                            div.id = 'iconSys3';
                        }
                        else if (4 == item.system) {
                            div.id = 'iconSys4';
                        }
                        $(div).css('float', 'left');
                        $(div).css('display', 'inline');
                        $(div).css('margin-left', '3px');
                        $(div).css('border-radius', '6px');
                        td.appendChild(div);
                    }

                    // icon device
                    if (0 != item.device) {
                        div = document.createElement('div');
                        div.className = 'iconComm';
                        if (1 == item.device) {
                            div.id = 'iconDev1';
                        }
                        else if (2 == item.device) {
                            div.id = 'iconDev2';
                        }
                        else if (3 == item.device) {
                            div.id = 'iconDev3';
                        }
                        else if (4 == item.device) {
                            div.id = 'iconDev4';
                        }
                        else if (5 == item.device) {
                            div.id = 'iconDev5';
                        }
                        else if (6 == item.device) {
                            div.id = 'iconDev6';
                        }
                        $(div).css('float', 'left');
                        $(div).css('display', 'inline');
                        $(div).css('margin-left', '3px');
                        $(div).css('border-radius', '6px');
                        td.appendChild(div);
                    }

                    // icon type
                    if (0 != item.type) {
                        div = document.createElement('div');
                        div.className = 'iconComm';
                        if (1 == item.type) {
                            div.id = 'iconType1';
                        }
                        else if (2 == item.type) {
                            div.id = 'iconType2';
                        }
                        else if (3 == item.type) {
                            div.id = 'iconType3';
                        }
                        else if (4 == item.type) {
                            div.id = 'iconType4';
                        }
                        else if (5 == item.type) {
                            div.id = 'iconType5';
                        }
                        else if (6 == item.type) {
                            div.id = 'iconType6';
                        }
                        else if (7 == item.type) {
                            div.id = 'iconType7';
                        }
                        else if (8 == item.type) {
                            div.id = 'iconType8';
                        }
                        else if (9 == item.type) {
                            div.id = 'iconType9';
                        }
                        else if (10 == item.type) {
                            div.id = 'iconType10';
                        }
                        $(div).css('float', 'left');
                        $(div).css('display', 'inline');
                        $(div).css('margin-left', '3px');
                        $(div).css('border-radius', '6px');
                        td.appendChild(div);
                    }

                    tr.appendChild(td);
                }
                selectPt.append(tr);
            }
        },

        searchPoints: function () {
            this.m_parseFmt.search = $('#dataSrcPtSearch').val();
            var show = this.parsePointListByFmt(this.m_parseFmt);
            this.showFmtIntoList(show);
        },

        searchPointsEx: function (searchVal) {
            var _this = this;
            Spinner.spin($('#divDataSourceAddPage')[0]);
            var prjId = $('#dataSrcPrjName').find('option:selected').val();
            WebAPI.get('/analysis/get_pointList_from_s3db/' + prjId + '/0/-1').done(function (result) {
                _this.m_pointList = {
                    'pointList': result.pointList,
                    'customName': result.customName,
                    'pageAllNum': result.pageAllNum
                };
                _this.m_parseFmt.search = searchVal;
                var show = _this.parsePointListByFmt(_this.m_parseFmt);
                _this.showFmtIntoList(show);
                $('#navPageNum').css('display', 'none');
            }).error(function (e) {
                document.getElementById('dialogContent').style.height = '50%';
            }).always(function (e) {
                Spinner.stop();
            });
        },

        initPointList: function () {
            var _this = this;
            _this.m_curPageNum = 0;
            Spinner.spin($('#divDataSourceAddPage')[0]);
            var prjId = $('#dataSrcPrjName').find('option:selected').val();
            WebAPI.get('/analysis/get_pointList_from_s3db/' + prjId + '/0/50').done(function (result) {
                _this.m_pointList = {
                    'pointList': result.pointList,
                    'customName': result.customName,
                    'pageAllNum': result.pageAllNum
                };
                _this.initNavCustomControls();
                _this.initNavPageNum(result.pageAllNum);
                _this.showPointListAll();
                $('#navPageNum').css('display', 'block');
            }).error(function (e) {
                document.getElementById('dialogContent').style.height = '50%';
            }).always(function (e) {
                Spinner.stop();
            });
        }
    }

    return DataSourceOriginal;
})();
var DataSourceFormula = (function () {
    function DataSourceFormula(_parent, _dsCfg) {
        this.m_parent = _parent;
        this.m_dsCfg = _dsCfg;
        this.m_lang = I18n.resource.dataSource;
    }

    DataSourceFormula.prototype = {
        show: function () {
            this.init();
        },
        init: function () {
            var _this = this;

            $('#inputCustName').attr('placeholder', _this.m_lang.CUSTOM_NAME);
            $('#inputFormulaDesc').attr('placeholder', _this.m_lang.POINT_DESC);
            $('.mathquill-editable:not(.mathquill-rendered-math)').mathquill('editable');

            if (!_this.m_dsCfg.m_bIsAdd) {
                $('#inputCustName').val(_this.m_dsCfg.m_customName);
                $('#inputFormulaDesc').val(_this.m_dsCfg.m_pointDesc);
                var strFormula = _this.m_dsCfg.m_pointName;
                var idSearchReg = /<%\w*%>/g;
                var arrPtName = strFormula.match(idSearchReg);
                var arrValName = [], arrValId = [];
                var valIdExistFlag;
                var valNameIndex = 0;
                for (var i = 0; i < arrPtName.length; ++i) {
                    valIdExistFlag = false;
                    for (var j = 0; j < arrValId.length; ++j) {
                        if (arrPtName[i].slice(2, arrPtName[i].length - 2) == arrValId[j]) {
                            valIdExistFlag = true;
                            break;
                        }
                    }
                    if (!valIdExistFlag) {
                        arrValId.push(arrPtName[i].slice(2, arrPtName[i].length - 2));
                        arrValName.push(String.fromCharCode("a".charCodeAt(0) + valNameIndex));
                        valNameIndex += 1;
                    }
                }

                $('.varRow').parent().remove();
                var strValRow, strValIdDiv;
                var $varConfig = $('#varConfig');

                var arrItem = [];
                arrItem = AppConfig.datasource.getDSItemById(arrValId);
                for (var i = 0; i < arrValId.length; ++i) {
                    for (var m = 0; m < arrItem.length; m++) {
                        if (arrValId[i] == arrItem[m].id) {
                            strValIdDiv = '<div class="col-lg-6 col-xs-8 formulaVarValue grow" varId="' + arrValId[i] + '">\
                                                    <span></span>\
                                                    <div>' + arrItem[m].alias + '</div>\
                                                    <span class="glyphicon glyphicon-remove-sign grow removeVarValue" aria-hidden="true" ></span>\
                                                    </div>';
                            strValRow = '<div class="row">\
                                            <div class="col-xs-12 varRow">\
                                                <div class="varRemove glyphicon glyphicon-remove-sign grow" aria-hidden="true"></div>\
                                                <div class="col-xs-4 formulaVarName"><input type="text" name="inputVarValue" class="varNameChange">' + arrValName[i] + '</div>\
                                                <div class="col-xs-6 divVarValue">' + strValIdDiv + '</div>\
                                            </div>\
                                        </div>';
                            $varConfig.get(0).innerHTML += strValRow;
                            strFormula = strFormula.replace(new RegExp('<%' + arrValId[i] + '%>', 'g'), arrValName[i])
                            break;
                        }
                    }
                }
                $('#editable-math').mathquill('latex', strFormula);
            }
            _this.initElement();
            _this.dragInit();
            _this.varConfigInit();
            _this.varAddInit();
            $('.removeVarValue').on('click', function () {
                $(this).parents('.formulaVarValue').remove();
            })
        },
        initElement: function () {
            var _this = this;
            var formulaResult;
            $('#btnFormulaDataAdd').click(function (e) {
                var input = $('#inputCustName');

                //var name;
                var name = $('#inputCustName').val();
                //if ('' == preName) {
                //    var list = _this.m_parent.m_allPointList;
                //    var count = 0;
                //    for (var i = 0, len = list.length; i < len; i++) {
                //        if (1 == list[i].itemType) {
                //            count++;
                //        }
                //    }
                //    name = 'Formula' + count;
                //}
                //else {
                //    name = preName;
                //}

                if ('' == name) {
                    input.focus();
                    alert(_this.m_lang.CUSTOM_NOT_NULL);
                    return;
                }
                //if (Boolean(_this.m_parent.checkRepeatWithCustomName(name))) {
                //    input.select();
                //    alert(_this.m_lang.CUSTOM_REPEAT);
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
        dragInit: function () {
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
                    targetId = EventAdapter.getData().dsItemId;
                    //targetId = e.dataTransfer.getData("dsItemId");
                    var formulaVarValue = '<div class="col-lg-6 col-xs-8 formulaVarValue grow" varId="' + targetId + '">\
                                            <span></span>\
                                            <div>' + AppConfig.datasource.getDSItemById(targetId).alias + '</div>\
                                            <span class="glyphicon glyphicon-remove-sign grow removeVarValue" aria-hidden="true" ></span>\
                                            </div>';
                    $(e.currentTarget).find('.divVarValue').html(formulaVarValue);
                    $(e.currentTarget).find('.removeVarValue').on('click', function () {
                        $(this).parents('.formulaVarValue').remove();
                    })
                }
            }
            $('#dataSrcPanel').on('dragend', function (e) {
                e.preventDefault();
                $('.varSel').removeClass('varSel')
            });
        },
        varConfigInit: function () {
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
            $('.formulaVarName').click(function () {
                $(this).children().css('display', 'inline');
                $(this).children().val(this.childNodes[1].textContent).focus();
                $(this).children('span').css('display', 'none');
            });
            $('.varNameChange').blur(function () {
                this.style.display = 'none';
                if (this.value != '') {
                    this.parentNode.childNodes[1].textContent = this.value;
                }
                $(this).next('span').css('display', 'inline');
            });
            $varConfig.find('.varRemove').on('click', function () {
                $(this).parents('.row').remove();
            });
            $varConfig.find('.removeVarValue').on('click', function () {
                $(this).parents('.formulaVarValue').remove();
            })
        },

        varAddInit: function () {
            var $varConfig = $('#varConfig');
            var newVarName;
            var _this = this;
            $varConfig.find('.glyphicon-plus-sign').click(function () {
                newVarName = $('.formulaVarName').last().text();
                newVarName = newVarName.substr(0, newVarName.length - 1) + String.fromCharCode(newVarName.charCodeAt(newVarName.length - 1) + 1);
                if (newVarName.charCodeAt(0) == 0) {
                    newVarName = 'a';
                }
                $varConfig.get(0).innerHTML += '<div class="row"><div class="col-xs-12 varRow">\
                                                    <div class="varRemove glyphicon glyphicon-remove-sign grow" aria-hidden="true"></div>\
                                                    <div class="col-lg-4 col-xs-4 formulaVarName"><input type="text" name="inputVarValue" class="varNameChange">' + newVarName + '</div>\
                                                    <div class="col-xs-6 divVarValue"></div>\
                                                </div></div>';
                _this.varAddInit();
                _this.dragInit();
                _this.varConfigInit();
            });
        },
        formulaGet: function () {
            var $editableMath = $('#editable-math');
            var $varRow = $('#varConfig .varRow');
            var latexMathValue = $editableMath.mathquill('latex');
            var varNum = $varRow.length;
            var varId, varName;
            var searchReg;
            var varError = new Array;
            $('.varLack').remove();
            //$('.varLack').removeClass('varLack');
            for (var i = 0; i < varNum; ++i) {
                varName = $($varRow.find('.formulaVarName').get(i));
                varId = $($varRow.find('.divVarValue').get(i)).children().attr('varId');
                searchReg = new RegExp('\\b' + varName.text() + '\\b', 'g');
                if (searchReg.test(latexMathValue)) {
                    if (varId) {
                        latexMathValue = latexMathValue.replace(searchReg, '<%' + varId + '%>');
                    } else {
                        varError.push(varName);
                    }
                }
            }
            //$('.varLack').removeClass('varLack');
            if (varError.length > 0) {
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
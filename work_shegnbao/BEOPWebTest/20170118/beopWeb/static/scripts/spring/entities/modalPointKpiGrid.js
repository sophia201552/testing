var ModalPointKpiGrid = (function () {
	var _this;
    function ModalPointKpiGrid(data, dateCycle) {
        if (Boolean(data)) {
            this.m_kpiDataTree = data;
            this.m_dateCycle = dateCycle;
            this.m_selectYear = 0;
            this.m_htmlPage;
            this.m_htmlTreeTemp;
            this.m_htmlGridTemp;
            this.m_bIsCurrentYear = false;
            this.m_nCurrentSeason = 0;
            this.m_nCurrentMonth = 0;
            this.m_strGood = '达标';
            this.m_strBad = '未达标';
            this.m_strCurrentGood = '当前达标';
            this.m_strCurrentBad = '当前超标';
            this.m_strCurrentWarn = '警戒';
            this.m_nStartYear = 0;
            this.m_nEndYear = 0;
            _this = this;
        }
    }

    ModalPointKpiGrid.prototype = new ModalPointKpiGrid();

    ModalPointKpiGrid.prototype.show = function() {
        this.init();
    }
    ModalPointKpiGrid.prototype.init = function () {
        WebAPI.get('/static/views/observer/widgets/modalPointKpiGrid.html').done(function (resultHtml) {
            _this.m_htmlPage = $(resultHtml);

            // time control
            var timeControl = _this.m_htmlPage.find('#timeSelect');
            var tmNow = new Date();
            var tmStart = new Date();
            tmStart.setFullYear(tmNow.getFullYear() - 10);
            _this.m_nStartYear = tmStart.getFullYear();
            _this.m_nEndYear = tmNow.getFullYear();
            timeControl.val(tmNow.format('yyyy'));
            timeControl.datetimepicker({
                format: 'yyyy',
                startView: 'decade',
                minView: 'decade',
                autoclose: true,
                todayBtn: false,
                pickerPosition: 'bottom-right',
                initialDate: tmNow,
                startDate: tmStart,
                endDate: tmNow,
                keyboardNavigation: false
            }).off('changeDate').on('changeDate',function(ev){
                //var selectTime = (ev.date.valueOf().toDate().toUTCString().replace(' GMT', '')).toDate().getTime();
                //var time = selectTime- selectTime%(5*60*1000).toDate().format('yyyy');
                //$('#tabFrames .td-frame[title="'+ time +'"]').click();

                _this.m_selectYear = timeControl.val();
                var tmNow = new Date();
                var nCurYear = tmNow.getFullYear();
                if (nCurYear == _this.m_selectYear) {
                    _this.m_nCurrentMonth = tmNow.getMonth();
                    _this.m_nCurrentSeason = Math.floor(_this.m_nCurrentMonth / 3);
                    _this.m_bIsCurrentYear = true;
                }
                else {
                    _this.m_bIsCurrentYear = false;
                }
                _this.postDataShow(false);
            });

            var yearPre = _this.m_htmlPage.find('#btnYearPre');
            if (Boolean(yearPre)) {
                yearPre.click(function (e) {
                    var year = parseInt(timeControl.val());
                    if (year <= _this.m_nStartYear) {
                        year = _this.m_nStartYear;
                        return;
                    }
                    else {
                        year -= 1;
                    }
                    timeControl.val(year);
                    _this.timeSetting(timeControl.val());
                    _this.postDataShow(false);
                });
            }

            var yearNext = _this.m_htmlPage.find('#btnYearNext');
            if (Boolean(yearNext)) {
                yearNext.click(function (e) {
                    var year = parseInt(timeControl.val());
                    if (year >= _this.m_nEndYear) {
                        year = _this.m_nEndYear;
                        return;
                    }
                    else {
                        year += 1;
                    }
                    timeControl.val(year);
                    _this.timeSetting(timeControl.val());
                    _this.postDataShow(false);
                });
            }

            var tmNow = new Date();
            _this.m_selectYear = tmNow.getFullYear();
            _this.m_nCurrentMonth = tmNow.getMonth();
            _this.m_nCurrentSeason = Math.floor(_this.m_nCurrentMonth / 3);
            _this.m_bIsCurrentYear = true;
            _this.postDataShow(true);
            //_this.m_htmlPage.modal('show');

        }).always(function () {});
    }
    ModalPointKpiGrid.prototype.postDataShow = function (bIsFirst) {
        var ptPassArray = [];   // 从树中获取id放入该数组中
        ptPassArray = _this.recursiveTreeGetPointPassId(_this.m_kpiDataTree);
        var tmStart = new Date();
        tmStart.setMonth(0);
        tmStart.setDate(1);
        tmStart.setHours(0);
        tmStart.setMinutes(0);
        tmStart.setSeconds(0);
        var tmEnd = new Date();
        if (!bIsFirst && tmStart.getFullYear() != _this.m_selectYear) {
            tmStart.setFullYear(_this.m_selectYear);
            tmEnd.setFullYear(_this.m_selectYear);
            tmEnd.setMonth(11);
            tmEnd.setDate(31);
            tmEnd.setHours(23);
            tmEnd.setMinutes(59);
            tmEnd.setSeconds(59);
        }
        var postData = {};
        postData.dataSourceId = '';
        postData.dsItemIds = ptPassArray;
        postData.timeStart = tmStart.format('yyyy-MM-dd hh:mm:ss');
        postData.timeEnd = tmEnd.format('yyyy-MM-dd hh:mm:ss');
        postData.timeFormat = 'M1';

        if (bIsFirst) {
            Spinner.spin($('#paneCenter')[0]);
        }
        else {
            Spinner.spin(_this.m_htmlPage[2]);
        }

        var tree = _this.m_htmlPage.find('#treeCtl');
        tree.html('');
        var table = _this.m_htmlPage.find('#tableCtl');
        table.html('');
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function (res) {
            if (!res || !res.list) {
                return;
            }

            for (var i= 0,len=res.list.length;i<len;i++) {
                _this.recursiveTreeSetPointPassData(_this.m_kpiDataTree, res.list[i].dsItemId, res.list[i].data);
            }

            var divContain = $('<div style="cursor:pointer"></div>');
            divContain.append('<ul class="kpiGridHeader" style="height:32px;margin-bottom:0px"></ul>');
            tree.append(divContain);

            var head = $('<thead class="kpiGridHeader"></thead>');
            var headTr = $('<tr></tr>');
            if ('season' == _this.m_dateCycle) {
                for (var i= 0; i<4; i++) {
                    var headTh = $('<th colspan="3" class="colSeason">' + (i+1) + '季度</th>');
                    headTr.append(headTh);
                }
                head.append(headTr);
            }
            else if ('month' == _this.m_dateCycle) {
                headTr = $('<tr></tr>');
                for (var i= 0; i<12; i++) {
                    var headTh = $('<th class="colMonth">' + (i+1) + '月</th>');
                    headTr.append(headTh);
                }
                head.append(headTr);
            }
            table.append(head);
            _this.showControlInfo();
            if (bIsFirst) {
                _this.m_htmlPage.modal('show');
            }
        }).always(function () {
            Spinner.stop();
        });
    }
    ModalPointKpiGrid.prototype.showControlInfo = function () {
        _this.m_htmlTreeTemp = $('<div style="cursor:pointer"></div>');
        _this.m_htmlGridTemp = $('<tbody class="kpiGridBody"></tbody>');
        _this.recursiveTreeSetting(_this.m_kpiDataTree);
        _this.m_htmlPage.find('#treeCtl').append(_this.m_htmlTreeTemp);
        _this.m_htmlPage.find('#tableCtl').append(_this.m_htmlGridTemp);
    }
    ModalPointKpiGrid.prototype.recursiveTreeSetting = function (item) {
        // draw tree
        var parentNode;
        if ('' == item.parentId) {  // root
            parentNode = _this.m_htmlTreeTemp;
        }
        else {
            parentNode = _this.m_htmlTreeTemp.find('#tree_' + item.parentId).find('.rows').eq(0);
        }
        if (parentNode.length > 0) {
            var bLeaf = (0 == item.list.length) ? true : false;
            _this.insertTreeCtrl(item.id, item.name, parentNode, bLeaf);
        }

        // draw grid
        var nLen = item.pointPassData.length;
        if (nLen < 12) {
            for (var i= nLen,len=12-nLen; i<12; i++) {
                item.pointPassData.push(-1);  // append data
            }
        }
        nLen = 12;

        var gridTr1 = $('<tr class="kpiGridRow" id="grid1_' + item.id + '"></tr>');
        var gridTd1 = '';
        var nLen = item.pointPassData.length;
        var bIsCurrent = false;
        var strShow;
        if ('season' == _this.m_dateCycle) {
            var arrSeason = [item.pointPassData[0], item.pointPassData[3], item.pointPassData[6], item.pointPassData[9]];
            for (var i= 0; i<4; i++) {
                if (_this.m_bIsCurrentYear && i==_this.m_nCurrentSeason) {
                    bIsCurrent = true;
                }
                else {
                    bIsCurrent = false;
                }

                if (-1 == arrSeason[i]) {
                    gridTd1 += '<td colspan=3></td>';
                }
                else if (Boolean(arrSeason[i])) {
                    strShow = bIsCurrent ? _this.m_strCurrentGood : _this.m_strGood;
                    gridTd1 += '<td colspan=3 class="kpiGridGood">' + strShow + '</td>';
                }
                else {
                    strShow = bIsCurrent ? _this.m_strCurrentGood : _this.m_strGood;
                    gridTd1 += '<td colspan=3 class="kpiGridBad">' + strShow + '</td>';
                }
            }
        }
        else if ('month' == _this.m_dateCycle) {
            for (var i= 0; i<nLen; i++) {
                if (_this.m_bIsCurrentYear && i==_this.m_nCurrentMonth) {
                    bIsCurrent = true;
                }
                else {
                    bIsCurrent = false;
                }

                if (-1 == item.pointPassData[i]) {
                    gridTd1 += '<td colspan=1></td>';
                }
                else if (Boolean(item.pointPassData[i])) {
                    strShow = bIsCurrent ? _this.m_strCurrentGood : _this.m_strGood;
                    gridTd1 += '<td colspan=1 class="kpiGridGood">' + strShow + '</td>';
                }
                else {
                    strShow = bIsCurrent ? _this.m_strCurrentBad : _this.m_strBad;
                    gridTd1 += '<td colspan=1 class="kpiGridBad">' + strShow + '</td>';
                }
            }
        }
        gridTr1.append($(gridTd1));
        _this.m_htmlGridTemp.append(gridTr1);

/*
        var nLen = item.pointPassData.length;
        if (nLen < 12) {
            for (var i= nLen,len=12-nLen; i<len; i++) {
                item.pointPassData.push(-1);  // append data
            }
        }
        nLen = 12;

        var monthVal = [];
        for (var i= 0; i<nLen; i++) {
            monthVal.push((item.pointPassData[i] > 0) ? 1 : 0);
        }
        var season1 = monthVal[0] + monthVal[1] + monthVal[2];
        var season2 = monthVal[3] + monthVal[4] + monthVal[5];
        var season3 = monthVal[6] + monthVal[7] + monthVal[8];
        var season4 = monthVal[9] + monthVal[10] + monthVal[11];
        var arrSeason = [];
        arrSeason.push(season1);
        arrSeason.push(season2);
        arrSeason.push(season3);
        arrSeason.push(season4);

        var gridTr1 = $('<tr class="kpiGridRow" id="grid1_' + item.id + '"></tr>');
        var gridTd1 = '';
        for (var i= 0; i<4; i++) {
            if (arrSeason[i] >= 2) {
                if (_this.m_bIsCurrentYear) {
                    if (_this.m_nCurrentSeason == i) {
                        gridTd1 += '<td colspan="3" class="kpiGridGood">' + _this.m_strCurrentGood + '</td>';
                    }
                    else if (i < _this.m_nCurrentSeason) {
                        gridTd1 += '<td colspan="3" class="kpiGridGood">' + _this.m_strGood + '</td>';
                    }
                    else {
                        gridTd1 += '<td colspan="3"></td>';
                    }
                }
                else {
                    gridTd1 += '<td colspan="3" class="kpiGridGood">' + _this.m_strGood + '</td>';
                }
            }
            else {
                if (0 == arrSeason[i] && -1 == item.pointPassData[i*3] && -1 == item.pointPassData[i*3+1] && -1 == item.pointPassData[i*3+2]) {
                    gridTd1 += '<td colspan="3"></td>';
                }
                else {
                    if (_this.m_bIsCurrentYear) {
                        if (_this.m_nCurrentSeason == i) {
                            gridTd1 += '<td colspan="3" class="kpiGridBad">' + _this.m_strCurrentBad + '</td>';
                        }
                        else if (i < _this.m_nCurrentSeason) {
                            gridTd1 += '<td colspan="3" class="kpiGridBad">' + _this.m_strBad + '</td>';
                        }
                        else {
                            gridTd1 += '<td colspan="3"></td>';
                        }
                    }
                    else {
                        gridTd1 += '<td colspan="3" class="kpiGridBad">' + _this.m_strBad + '</td>';
                    }
                }
            }
        }
        gridTr1.append($(gridTd1));
        _this.m_htmlGridTemp.append(gridTr1);

        //
        var gridTr2 = $('<tr class="kpiGridRow" id="grid2_' + item.id + '"></tr>');
        var gridTd2 = '';
        for (var i= 0; i<nLen; i++) {
            var val = item.pointPassData[i];
            if (1 == val) {
                if (_this.m_bIsCurrentYear) {
                    if (_this.m_nCurrentMonth == i) {
                        gridTd2 += '<td class="kpiGridGood">' + _this.m_strCurrentGood + '</td>';
                    }
                    else if (i < _this.m_nCurrentMonth) {
                        gridTd2 += '<td class="kpiGridGood">' + _this.m_strGood + '</td>';
                    }
                    else {
                        gridTd2 += '<td></td>';
                    }
                }
                else {
                    gridTd2 += '<td class="kpiGridGood">' + _this.m_strGood + '</td>';
                }
            }
            else if (0 == val) {
                if (_this.m_bIsCurrentYear) {
                    if (_this.m_nCurrentMonth == i) {
                        gridTd2 += '<td class="kpiGridBad">' + _this.m_strCurrentBad + '</td>';
                    }
                    else if (i < _this.m_nCurrentMonth) {
                        gridTd2 += '<td class="kpiGridBad">' + _this.m_strBad + '</td>';
                    }
                    else {
                        gridTd2 += '<td></td>';
                    }
                }
                else {
                    gridTd2 += '<td class="kpiGridBad">' + _this.m_strBad + '</td>';
                }
            }
            else if (-1 == val) {
                gridTd2 += '<td></td>';
            }
            else {}
        }
        gridTr2.append($(gridTd2));
        _this.m_htmlGridTemp.append(gridTr2);
*/
        // recursive
        var nChildNum = item.list.length;
        if (0 == nChildNum) {   // leaf
        }
        else {  // node
            for (var i= 0; i<nChildNum; i++) {
                arguments.callee(item.list[i]);
            }
        }
    }
    ModalPointKpiGrid.prototype.recursiveTreeSetShow = function (item, nFindId, bIsShow) {
        if (nFindId == item.id) {
            for (var i= 0,len=item.list.length; i<len; i++) {
                item.list[i].show = bIsShow;
            }
            return;
        }
        else {
            for (var i= 0,len=item.list.length; i<len; i++) {
                arguments.callee(item.list[i], nFindId, bIsShow);
            }
        }
    }
    ModalPointKpiGrid.prototype.recursiveTreeGetShow = function (item) {
        var arr = [];
        var nLen = item.list.length;
        if (nLen > 0) { // node
            if (item.show) {
                arr.push(item.id);
                for (var i= 0; i<nLen; i++) {
                    var temp = arguments.callee(item.list[i]);
                    arr = arr.concat(temp);
                }
            }
        }
        else {  // leaf
            if (item.show) {
                return [item.id];
            }
        }
        return arr;
    }
    ModalPointKpiGrid.prototype.recursiveTreeGetPointPassId = function (item) {
        var arr = [];
        var nLen = item.list.length;
        if (nLen > 0) { // node
            if (item.show) {
                arr.push(item.pointPass);
                for (var i= 0; i<nLen; i++) {
                    var temp = arguments.callee(item.list[i]);
                    arr = arr.concat(temp);
                }
            }
        }
        else {  // leaf
            if (item.show) {
                return [item.pointPass];
            }
        }
        return arr;
    }
    ModalPointKpiGrid.prototype.recursiveTreeSetPointPassData = function (item, nPtPassId, ptPassData) {
        if (nPtPassId == item.pointPass) {
            item.pointPassData = ptPassData;
            return;
        }
        else {
            for (var i= 0,len=item.list.length; i<len; i++) {
                arguments.callee(item.list[i], nPtPassId, ptPassData);
            }
        }
    }
    ModalPointKpiGrid.prototype.insertTreeCtrl = function (groupId, groupName, parentNode, bIsLeaf) {
        var $ul = $('<ul class="nav nav-list kpiTreeGroup" id="tree_' + groupId + '">');
        var $liHd;
        if (bIsLeaf) {
            $liHd = $('<li class="kpiTreeHeader"><span style="margin-left:40px"></span></li>');
        }
        else {
            $liHd = $('<li class="kpiTreeHeader"><img src="/static/images/dataSource/group_head_sel.png" alt="png" class="dsTreeHeaderIcon"></li>');
        }
        var spanName = $('<span class="dsGroupName">' + groupName + '</span>');
        $liHd.append(spanName);

        $liHd.click(function (e) {
            var tar = $(e.currentTarget);
            if (Boolean(tar)) {
                var treeItemId = tar.closest('.kpiTreeGroup')[0].id;
                var num = treeItemId.substring(5);

                //
                var bindRow = tar.next('.rows');
                if (Boolean(bindRow)) {
                    var bIsShow = true;
                    var showFlag = bindRow.eq(0).css('display');
                    if ('block' == showFlag) {  // set none, show = false
                        bIsShow = false;
                    }
                    else {  // set block, show = true
                        bIsShow = true;
                    }

                    _this.recursiveTreeSetShow(_this.m_kpiDataTree, num, bIsShow);
                    var arr = _this.recursiveTreeGetShow(_this.m_kpiDataTree);
                    var arrGrid = [];
                    for (var k= 0,len3=arr.length; k<len3; k++) {
                        arrGrid.push('grid1_' + arr[k]);
                        arrGrid.push('grid2_' + arr[k]);
                    }

                    // arrGrid 存放仅显示的id
                    // 右侧Grid仅显示arrGrid中的行，其余隐藏
                    var body = _this.m_htmlPage.find('#tableCtl tbody tr');
                    for (var i= 0,len=body.length; i<len; i++) {
                        var trFind = false;
                        for (var j= 0,len2=arrGrid.length; j<len2; j++) {
                            if (body[i].id == arrGrid[j]) {
                                trFind = true;
                                break;
                            }
                        }
                        if (!trFind) {
                            $(body[i]).css('display', 'none');
                        }
                        else {
                            $(body[i]).css('display', '');
                        }
                    }

                    // tree action
                    bindRow.slideToggle();
                }
            }
        });
        $ul.prepend($liHd);

        var divLiRow = $('<li class="rows"></li>');
        $ul.append(divLiRow);

        parentNode.append($ul);
    }
    ModalPointKpiGrid.prototype.timeSetting = function (selYear) {
        _this.m_selectYear = selYear;
        var tmNow = new Date();
        var nCurYear = tmNow.getFullYear();
        if (nCurYear == _this.m_selectYear) {
            _this.m_nCurrentMonth = tmNow.getMonth();
            _this.m_nCurrentSeason = Math.floor(_this.m_nCurrentMonth / 3);
            _this.m_bIsCurrentYear = true;
        }
        else {
            _this.m_bIsCurrentYear = false;
        }
    }

    return ModalPointKpiGrid;
}) ();
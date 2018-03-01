/**
 * Created by vicky on 2016/3/1.
 */
var PatrolPath = (function(){
    var _this;
    function PatrolPath(screen){
        _this = this;
        this.container = $('#paneRightCtn');
        this.$patroPathList = undefined;
        if(screen){
            screen.close();
            this.screen = screen;
        }
    }
    PatrolPath.prototype.path_tpl = '<div class="pathCon clearfix" path-id="{_id}">\
            <div class="pathInfo col-sm-2"><lable class="nameCon">{name}</lable></div>\
            <div class="pathInfo col-sm-2"><lable class="patroDictCon">{patroDict}个</lable></div>\
            <div class="pathInfo col-sm-2"><lable class="patroTime">{patroTime}</lable></div>\
            <div class="pathInfo col-sm-4 pathList" title="{title}"><ol class="breadcrumb">{pathList}</ol><span>{title}</span></div>\
            <div class="pathInfo col-sm-2"><lable class="timeCon">{time}分钟</lable></div>\
            </div>';
    PatrolPath.prototype.pathList_tpl = '<li dic-id={_id}><a href="javascript:void(0)">{pathDictName}</a></li>';
    PatrolPath.prototype.init = function(){
        var target = $('#patroPathList')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId).done(function (result) {
            var temp = '';
            var data = result.data;
            if($('#btnSort').attr('data-sort') === '0'){
                result.data.sort(function (a, b) {
                    return (a.name).localeCompare(b.name);
                });
            }else{
                result.data.sort(function (a, b) {
                    return (b.name).localeCompare(a.name);
                });
            }
            for (var i = 0, len = data.length; i < len; i++) {
                if(data[i].status === 1) {
                    var dictTemp = '';
                    var nameStr = '';
                    var dictPath = data[i].path;
                    for (var j = 0, lens = dictPath.length; j < lens; j++) {
                        dictTemp += _this.pathList_tpl.formatEL({
                            pathDictName: (dictPath[j].name ? dictPath[j].name : '该点被删除'),
                            _id: (dictPath[j]._id ? dictPath[j]._id : -1)
                        })
                        if (j === lens - 1) {
                            nameStr += (dictPath[j].name ? dictPath[j].name : '该点被删除');
                        } else {
                            nameStr += ((dictPath[j].name ? dictPath[j].name : '该点被删除') + '/');
                        }
                    }
                    temp += _this.path_tpl.formatEL({
                        _id: data[i]._id,
                        name: data[i].name,
                        patroDict: dictPath.length,
                        pathList: dictTemp,
                        patroTime: data[i].timeRange ? data[i].timeRange : '-30 +30',
                        time: data[i].elapse,
                        //paStatus: (data[i].status === 0) ? '无效' : '有效',
                        //statusNum: data[i].status,
                        title: nameStr
                    })
                }
            }
            _this.$patroPathList.append(temp);
            //绑定事件
            _this.attachEvents();
        }).always(function (){
            Spinner.stop();
        });
    }

    PatrolPath.prototype.show = function(){
        WebAPI.get('/static/app/Patrol/views/patrolPath.html').done(function (resultHTML) {
            _this.container.html('').html(resultHTML);
            _this.$patroPathList = $('#patroPathList');
            //显示所有路线
            _this.init();
        });
    }

    PatrolPath.prototype.attachEvents = function () {
        //路线被选中事件
        var $changePath = $('#changePath');
        var $deletePath = $('#deletePath');
        var addPathModal = '<div class="modal fade" id="addPathModal" data-backdrop="static">\
                <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                        <h4 class="modal-title">编辑路线</h4>\
                    </div>\
                    <div class="modal-body">\
                        <div class="form-group">\
                            <label for="pathName">名称</label>\
                            <input type="text" class="form-control" id="pathName" placeholder="请输入名称...">\
                        </div>\
                        <div class="form-group">\
                            <label for="pathTime">计划用时(分钟)</label>\
                            <input type="number" class="form-control" id="pathTime" placeholder="请输入计划用时...">\
                        </div>\
                        <div class="form-group">\
                            <label for="groomTime">巡更时间范围(分钟)</label>\
                            <input type="number" class="form-control" id="groomTime" placeholder="请输入巡更时间范围...">\
                        </div>\
                        <label>工作流</label>\
                        <div class="workCom gray-scrollbar">\
                            <div class="divRow flowFlag" style="position: relative;">\
                                <div class="label label-success">开始</div>\
                                <div id="btnAddDict" class="glyphicon glyphicon-plus-sign grow" style="position: absolute; font-size: 22px; right: 32px; top: 4px; color: #337ab7; cursor: pointer;"></div>\
                            </div>\
                            <div class="divRow dictSelectBox">\
                                <span class="indexNum">1</span>\
                                <div class="keyBox">\
                                <input type="text" class="selectCopy"/>\
                                <div class="form-control key">\
                                </div></div>\
                                <div class="btnReduceDict glyphicon glyphicon-minus-sign grow" style="position: absolute; font-size: 22px; right: 64px; top: 21px; color: #337ab7; cursor: pointer;"></div>\
                                <div class="btnAddDict glyphicon glyphicon-plus-sign grow" style="position: absolute; font-size: 22px; right: 32px; top: 21px; color: #337ab7; cursor: pointer;"></div>\
                            </div>\
                            <div id="divFlagComplate" class="divRow flowFlag"><div class="label label-success">完 成</div></div>\
                        </div>\
                        <div class="pathWrong"></div>\
                    </div>\
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                        <button type="button" class="btn btn-primary" id="pathOK">确定</button>\
                    </div>\
                </div>\
                </div>\
            </div>';
        var dict_tpl = '<div class="optionCopy" dict-id={_id} value="{dictName}">{dictName}</div>';

        _this.$patroPathList.find('.pathCon').off('click').click(function () {
            var $this = $(this);
            if ($this.hasClass('pathActive')) {
                $this.removeClass('pathActive');
                $this.removeClass('trChecked');
                $changePath.attr('disabled', 'disabled');
                $deletePath.attr('disabled', 'disabled');
            } else {
                $this.addClass('pathActive');
                $this.siblings().removeClass('trChecked');
                $this.addClass('trChecked');
                $this.siblings('.pathCon').removeClass('pathActive');
                $changePath.removeAttr('disabled');
                $deletePath.removeAttr('disabled');
            }
        });
        //排序事件
        $('#btnSort').off('click').on('click',function(){
            var $patroPathList = $('#patroPathList');
            $patroPathList.children('.pathCon').remove();
            if($('#btnSort').attr('data-sort') === '0'){
                $('#btnSort').attr('data-sort','1').children('.sortText').text('降序排序');
            }else{
                $('#btnSort').attr('data-sort','0').children('.sortText').text('升序排序');
            }
            _this.init();
        });
        //删除事件
        $deletePath.off('click').on('click keydown',function (e) {
            if (e.keyCode) {
                return false;
            }
            var $this = $(this);
            confirm('请确认是否删除！', function () {
                var $pathActive = _this.$patroPathList.find('.pathActive');
                var pathId = $pathActive.attr('path-id');
                var data = {
                    _id: pathId,
                    status: 0
                };
                WebAPI.post('/patrol/path/remove/' + AppConfig.projectId + '/' + pathId, data).done(function (result) {
                    //if (result.data && result.missionId.length === 0) {
                        $pathActive.remove();
                        $('#changePath').attr('disabled', 'disabled');
                        $this.attr('disabled', 'disabled');
                    //} else {
                    //    alert('当前排班存在此路线,不能删除！');
                    //    return;
                    //}
                });
            }, function () {
                return;
            });
        });

        //加号按钮事件
        var addIndex;
        $('#btnAddDict').off('click').click(function () {
            var $dictSelectBox = $('.dictSelectBox').eq(0);
            $('#divFlagComplate').before($dictSelectBox.clone(true));

            addIndex=$('.dictSelectBox').length;
            $('.dictSelectBox').eq(addIndex-1).find("span").text(addIndex);

            $('.btnReduceDict').show();
            $('.btnAddDict').show();
            $dictSelectBox.find('.btnReduceDict').hide();
            $dictSelectBox.find('.btnAddDict').hide();
        });

        //中间加号按钮
        $('.btnAddDict').off('click').click(function () {
            var $dictSelectBox = $('.dictSelectBox').eq(0);
            var $dictSelectBoxThis = $(this).parents('.dictSelectBox');
            var thisIndexSpan = $dictSelectBoxThis.find('span.indexNum');
            var thisIndex = parseInt(thisIndexSpan.text());
            $dictSelectBoxThis.after($dictSelectBox.clone(true));
            $dictSelectBoxThis.next().find('span.indexNum').text(thisIndex+1);
            //thisIndexSpan.text(thisIndex+1);

            addIndex = $('.dictSelectBox').length;
            for (var i = thisIndex+1 ; i < addIndex; i++) {
                $('.dictSelectBox').eq(i).find('span.indexNum').text(i + 1);
            }
            $('.dictSelectBox').eq(addIndex - 1).find("span.indexNum").text(addIndex);

            $('.btnReduceDict').show();
            $('.btnAddDict').show();
            $dictSelectBox.find('.btnReduceDict').hide();
            $dictSelectBox.find('.btnAddDict').hide();
        });
        //减号按钮事件
        $('.btnReduceDict').off('click').click(function () {
            $(this).parents('.dictSelectBox').remove();

            addIndex=$('.dictSelectBox').length;
            $('.dictSelectBox').each(function(){
                var delIndex=$('.dictSelectBox').index($(this));
                $(this).find('span').text(delIndex+1);
            })

        });
        //输入框点击事件
        $('.selectCopy').off('click').on('click',function () {
            var $this = $(this);
            var $key = $this.siblings('.key');
            if ($key.hasClass('openCopy')) {
                $key.removeClass('openCopy').hide();
            } else { 
                $key.addClass('openCopy').show();
            }
        });
        //输入框失去焦点事件
        $('.selectCopy').blur(function (e) {

            $(this).siblings('.key').removeClass('openCopy').hide();


            var $select = $(this);
            var optionCopyArr = $select.parent('.keyBox').find('.optionCopy');
            var isTrue = false;//判断输入内容是否是下拉框中内容
            if (optionCopyArr.length > 0) {
                for (var j = 0, length = optionCopyArr.length; j < length; j++) {
                    if (optionCopyArr.eq(j).attr('value').replace(/(^\s*)|(\s*$)/g, "") === $select.val().replace(/(^\s*)|(\s*$)/g, "")) {
                        isTrue = true;
                        var $curentOption = $select.parent().find(optionCopyArr.eq(j));
                        $curentOption.addClass('optionCopyActive');
                        $curentOption.siblings().removeClass('optionCopyActive');
                    }
                }
            }
            if (!isTrue) {
                new Alert($('.pathWrong'), 'danger', '巡更点不存在请选择或新建').show(1000).close();
                return;
            }
        });

        $('.selectCopy').off('keyup').keyup(function () {
            var $select = $(this);
            if ($select.val().replace(/(^\s*)|(\s*$)/g, "") === '') return;
            //var $dictSelectBoxThis = $select.parents('.dictSelectBox');
            var optionCopyArr = $select.parent('.keyBox').find('.optionCopy');
            if (optionCopyArr.length > 0) {
                for (var j = 0, length = optionCopyArr.length; j < length; j++) {
                    if (optionCopyArr.eq(j).attr('value').indexOf($select.val()) >= 0 && j !== 1 && $select.val()!=='') {
                        var $accord = optionCopyArr.eq(j);
                        optionCopyArr.eq(j).remove();
                        optionCopyArr.eq(1).before($accord);
                        _this.attachEvents();
                    }
                }
            }
            
            $select.next('.key').show();
        });
        //仿option的div点击事件
        $('.optionCopy').off('mousedown').on('mousedown', function () {
            var $this = $(this);
            var selectVal = $this.parent().siblings('.selectCopy').val();
            var $selectCopy = $this.parent().prev();
            var $selectKey = $this.parent('.key');
            var $addPathModal = $('#addPathModal');
            if ($this.attr('dict-id') === '-1') {
                var $addpointModal = $('#addpointModal');
                var $pointType = $addpointModal.find('select.pointType');
                var $pointName = $addpointModal.find('input.pointName');
                var $pointRequest = $addpointModal.find('textarea');
                //$pointType.val('');
                $pointName.val('');
                $pointRequest.val('');
                $addpointModal.on('show.bs.modal', function () {
                    $addpointModal.find('h4').text('新增巡更点');
                    $('#btnSave').text('添加');
                });
                $addpointModal.modal('show');
                $addPathModal.addClass('patrolPathBlur');
                $addpointModal.find('.close').off('click').click(function () {
                    $addPathModal.removeClass('patrolPathBlur');
                    selectVal = selectVal!==''?selectVal:''
                    $this.parent().siblings('.selectCopy').val(selectVal);
                });
                $addpointModal.find('.pointCancel').off('click').click(function () {
                    $addPathModal.removeClass('patrolPathBlur');
                    selectVal = (selectVal !== '') ? selectVal : ''
                    $this.parent().siblings('.selectCopy').val(selectVal);
                });
                $('#btnSave').off('click').click(function () {
                    if ($pointType.val() == '' || $pointName.val() == '' || $pointRequest.val() == '' || $pointName.val().replace(/(^\s*)|(\s*$)/g, "") == '' || $pointRequest.val().replace(/(^\s*)|(\s*$)/g, "") == '') {
                        alert('巡更点的信息请填写完整！');
                    } else {
                        if ($pointName.val().length > 20) {
                            alert('巡更点的名称请不要超过20字符！');
                            return;
                        }
                        if ($pointRequest.val().length > 50) {
                            alert('巡更点的要求描述请不要超过50字符！');
                            return;
                        }
                        var data = {
                            _id: null,
                            type: $pointType.val(),
                            name: $pointName.val(),
                            content: $pointRequest.val(),
                            codeQR: hex_sha1($pointName.val() + new Date().format('yyyy-MM-dd HH:mm:ss')),
                            creatorId: AppConfig.userId
                        };
                        WebAPI.post('/patrol/point/save/' + AppConfig.projectId, data).done(function (result) {
                            if (result.data) {
                                $addpointModal.modal('hide');
                                $addPathModal.removeClass('patrolPathBlur');
                                var temp = '';
                                temp += dict_tpl.formatEL({
                                    _id: result.data,
                                    dictName: $pointName.val()
                                })
                                $('.keyBox').find('.key').append(temp);
                                $this.removeClass('optionCopyActive');
                                $selectKey.find(':last-child').addClass('optionCopyActive');
                                $selectCopy.val($pointName.val());
                                _this.attachEvents();
                            } else {
                                $selectCopy.val('');
                            }
                        }).always(function () {

                        })
                    }
                });
            }
            $this.addClass('optionCopyActive').siblings('.optionCopy').removeClass('optionCopyActive');
            $this.parent().siblings('.selectCopy').val($this.text());
            $this.parent().hide(300);
        });
        //新增事件
        $('#addPath').off('click').click(function () {
            var $addPathModal = $('#addPathModal');
            if ($addPathModal.length === 0) {
                $('#patrolPath').append(addPathModal);
            }
            Spinner.spin($('#paneRightCtn')[0]);
            WebAPI.get('/patrol/point/getList/' + AppConfig.projectId).done(function (result) {
                var temp = '<div class="optionCopy" dict-id="-1" value="新增巡更点">新增巡更点</div>';
                var dictList = (result.data)?(result.data):[];
                if(_this.screen.sortData === '0'){
                    dictList.sort(function (a, b) {
                        return (a.name).localeCompare(b.name);
                    });
                }else{
                    dictList.sort(function (a, b) {
                        return (b.name).localeCompare(a.name);
                    });
                }
                if (dictList.length > 0) {
                    for (var i = 0, len = dictList.length; i < len; i++) {
                        temp += dict_tpl.formatEL({
                            _id: dictList[i]._id,
                            dictName: dictList[i].name
                        });
                    }
                    var $pathKey = $('#addPathModal').find('.key');
                    $pathKey.children('div').remove();
                    $pathKey.append(temp);
                    $('.dictSelectBox:not(:first)').remove();
                    $('#pathName').val('');
                    $('#pathTime').val('30');
                    $('#groomTime').val('60');
                    //$('.pathStatus').hide();
                    $('.dictSelectBox').find('.btnReduceDict').hide();
                    $('.dictSelectBox').find('.btnAddDict').hide();
                    $('#addPathModal').modal('show');
                    //绑定事件
                    _this.attachEvents();
                } else {
                    new Alert($("#wrongInfo"), "danger", '没有巡更点').show(1000);
                }
            }).always(function () {
                Spinner.stop();
            });
                //新增按钮事件
            $('#pathOK').off('click').click(function () {
                var pathName = $('#pathName').val();
                var pathTime = $('#pathTime').val();
                var groomTime = $('#groomTime').val();
                if (!pathTime.match(/^[\d]+$/g)) {
                    alert('计划用时(分钟)必须是数字！');
                    return;
            }
                if (!groomTime.match(/^[\d]+$/g)) {
                    alert('巡更时间范围必须是数字!')
                    return;
            }
                var namestr = '';
                var $dictSelectBox = $('.dictSelectBox');
                var pathArr =[];
                var pathPost =[];
                var selectCopyArr = $dictSelectBox.find('.selectCopy');
                var optionCopyArr = $dictSelectBox.find('.optionCopy:not([dict-id="-1"])')
                if (selectCopyArr.length > 0) {
                    for (var i = 0, len = selectCopyArr.length; i < len; i++) {
                        var isData = false;
                        var successDoct = 0;
                        var selectCopyValue = selectCopyArr.eq(i).val();
                        if (selectCopyValue === '' || selectCopyValue.replace(/(^\s*)|(\s*$)/g, "")==='') {
                            new Alert($('.pathWrong'), 'danger', '请填写完整！').show(1000).close();
                            return;
                        } else {
                            for (var j = 0, lens = optionCopyArr.length; j < lens; j++) {
                                if (selectCopyValue.replace(/(^\s*)|(\s*$)/g, "") === optionCopyArr.eq(j).attr('value').replace(/(^\s*)|(\s*$)/g, "")) {
                                    isData = true;
                                    successDoct = j;
                                    continue;
                            }
                        }
                    }
                    if (!isData) {
                        new Alert($('.pathWrong'), 'danger', '第' + (i + 1) +'个选择框巡更点不存在请新建或重新选择！').show(1000).close();
                        return;
                    } else {
                        selectCopyArr.eq(i).find('.optionCopy').eq(j + 1).addClass('optionCopyActive').siblings('.optionCopy').removeClass('optionCopyActive');
                    }
                }
                } else {
                    return;
            }
                for (var i = 0, len = $dictSelectBox.length; i < len; i++) {
                    var dictIdOn = $dictSelectBox.eq(i).find('.keyBox  .optionCopyActive').attr('dict-id');
                    var dictNameOn = $dictSelectBox.eq(i).find('.keyBox .selectCopy').val();
                    pathArr.push({ _id: dictIdOn, name: dictNameOn
                });
                    pathPost.push(dictIdOn);
            }

                if (pathName === '' || pathTime === '' || groomTime === '' || pathName.replace(/(^\s*)|(\s*$)/g, "") === '') {
                    new Alert($('.pathWrong'), 'danger', '请填写完整！').show(1000).close();
                } else {
                    var postData = {
                            name: pathName,
                            elapse: parseFloat(pathTime),
                            timeRange: '-' +parseFloat(groomTime) + ' +' +parseFloat(groomTime),
                            status: 1,
                            path: pathPost
                };
                    WebAPI.post('/patrol/path/save/' +AppConfig.projectId, postData).done(function (result) {
                        if (result.data) {
                            var dictTemp = '';
                            for (var j = 0, lens = pathArr.length; j < lens; j++) {
                                dictTemp += _this.pathList_tpl.formatEL({
                                        pathDictName: pathArr[j].name,
                                        _id: pathArr[j]._id
                            })
                                if (j === lens -1) {
                                    namestr += pathArr[j].name;
                                } else {
                                    namestr += (pathArr[j].name +'/');
                            }
                        }
                            var temp = _this.path_tpl.formatEL({
                                    _id: result.data,
                                    name: pathName,
                                    patroDict: pathArr.length,
                                    pathList: dictTemp,
                                    time: parseFloat(pathTime),
                                    patroTime: postData.timeRange,
                                //paStatus: '有效',
                                    title: namestr
                                //statusNum: 1
                        });
                            _this.$patroPathList.append(temp);

                            //绑定事件
                            _this.attachEvents();
                        } else {
                            new Alert($('.addPerFail'), 'danger', '新增失败！').show(1000).close();
                    }
                    }).always(function () {
                        $('#addPathModal').modal('hide');
                });
            }
            });
        });
        //修改按钮事件
        $('#changePath').off('click').click(function () {
            confirm('修改路线后会影响之前巡更记录的查询，请确认是否修改？', function () {
                Spinner.spin($('#paneRightCtn')[0]);
                var $pathActive = $('.pathActive');
                var $nameCon = $pathActive.find('.nameCon');
                var $patroTimeCon = $pathActive.find('.patroTime');
                var $patroDictCon = $pathActive.find('.patroDictCon');
                var $timeCon = $pathActive.find('.timeCon');
                //var $paStatusCon = $pathActive.find('.paStatusCon');
                var $breadcrumb = $pathActive.find('.breadcrumb');
                var $breadcrumbLi = $pathActive.find('.breadcrumb').find('li');
                var $addPathModal = $('#addPathModal');
                var nameCon = $nameCon.text();
                var timeCon = $timeCon.text();
                var patroTimeCon = $patroTimeCon.text();
                if ($addPathModal.length === 0) {
                    $('#patrolPath').append(addPathModal);
                }
                WebAPI.get('/patrol/point/getList/' + AppConfig.projectId).done(function (result) {
                    var temp = '<div dict-id="-1" value="新增巡更点" class="optionCopy">新增巡更点</div>';
                    var dictList = (result.data) ? (result.data) : [];
                    if (_this.screen.sortData === '0') {
                        dictList.sort(function (a, b) {
                            return (a.name).localeCompare(b.name);
                        });
                    } else {
                        dictList.sort(function (a, b) {
                            return (b.name).localeCompare(a.name);
                        });
                    }
                    for (var i = 0, len = dictList.length; i < len; i++) {
                        temp += dict_tpl.formatEL({
                            _id: dictList[i]._id,
                            dictName: dictList[i].name
                        });
                    }

                    $('#pathName').val(nameCon);
                    $('#pathTime').val(parseFloat(timeCon));
                    $('#groomTime').val(Math.abs(parseFloat(patroTimeCon)));
                    //$('#pathSta option:selected').text($paStatusCon.text());
                    $('.dictSelectBox:not(:first)').remove();
                    for (var m = 0, lens = $breadcrumbLi.length; m < lens; m++) {
                        var liCon = $breadcrumbLi.eq(m).find('a').text();
                        var liId = $breadcrumbLi.eq(m).attr('dic-id');
                        if (m > 0) {
                            var $dictSelectBox = $('.dictSelectBox').eq(0);
                            $('#divFlagComplate').before($dictSelectBox.clone(true));

                            addIndex = $('.dictSelectBox').length;
                            $('.dictSelectBox').eq(addIndex - 1).find("span").text(addIndex);


                            $('.btnReduceDict').show();
                            $('.btnAddDict').show();
                            $dictSelectBox.find('.btnReduceDict').hide();
                            $dictSelectBox.find('.btnAddDict').hide();
                        }
                        var $pathKey = $('#addPathModal').find('.key');
                        $pathKey.eq(m).children('div').remove();
                        $pathKey.eq(m).append(temp);
                        $('.pathStatus').show();
                        var optionCopyList = $('.dictSelectBox').eq(m).find('.key .optionCopy');
                        if (optionCopyList.length > 0) {
                            for (var z = 0, lent = optionCopyList.length; z < lent; z++) {
                                if (optionCopyList.eq(z).attr('dict-id') === liId) {
                                    optionCopyList.eq(z).addClass('optionCopyActive');
                                }
                            }
                        }
                        if (dictList.length > 0) {
                            for (var j = 0, leng = dictList.length; j < leng; j++) {
                                if (liCon === dictList[j].name) {
                                    $('.dictSelectBox').eq(m).find('.selectCopy').val(liCon);
                                    break;
                                }
                            }
                        }
                    }

                    //绑定事件
                    _this.attachEvents();

                    $('#addPathModal').modal('show');
                }).always(function () {
                    Spinner.stop();
                });
                //确定按钮事件
                $('#pathOK').off('click').click(function () {
                    //验证:计划用时 输入框
                    var pathTime = $('#pathTime').val();
                    if (!pathTime.match(/^[\d]+$/g)) {
                        alert('计划用时必须是数字!')
                        return;
                    }
                    var groomTime = $('#groomTime').val();
                    if (!groomTime.match(/^[\d]+$/g)) {
                        alert('巡更时间范围必须是数字!')
                        return;
                    }
                    var $dictSelectBox = $('.dictSelectBox');
                    var selectCopyArr = $dictSelectBox.find('.selectCopy');
                    var optionCopyArr = $dictSelectBox.find('.optionCopy:not([dict-id="-1"])')
                    if (selectCopyArr.length > 0) {
                        for (var i = 0, len = selectCopyArr.length; i < len; i++) {
                            var isData = false;
                            var selectCopyValue = selectCopyArr.eq(i).val();
                            if (selectCopyValue === '' || selectCopyValue.replace(/(^\s*)|(\s*$)/g, "") === '') {
                                new Alert($('.pathWrong'), 'danger', '请填写完整！').show(1000).close();
                                return;
                            } else {
                                for (var j = 0, lens = optionCopyArr.length; j < lens; j++) {
                                    if (selectCopyValue === optionCopyArr.eq(j).attr('value')) {
                                        var optionCopy = selectCopyArr.eq(i).find(optionCopyArr.eq(j + 1));
                                        if (!optionCopy.hasClass('optionCopyActive')) {
                                            optionCopy.addClass('optionCopyActive');
                                        }
                                        optionCopy.siblings().removeClass('optionCopyActive');
                                        isData = true;
                                        continue;
                                    }
                                }
                            }
                            if (!isData) {
                                new Alert($('.pathWrong'), 'danger', '第' + (i + 1) + '个选择框巡更点不存在请新建或重新选择！').show(1000).close();
                                return;
                            }
                        }
                    } else {
                        return;
                    }

                    var pathName = $('#pathName').val();
                    if (pathName === '' || pathName.replace(/(^\s*)|(\s*$)/g, "") === '') {
                        pathName = nameCon;
                    }
                    pathTime = pathTime ? pathTime : timeCon;
                    groomTime = groomTime ? groomTime : patroTimeCon;
                    var $dictSelectBoxArr = $('.dictSelectBox');
                    var pathArr = [];
                    var pathId = [];
                    var groomTimeFi = '-' + parseFloat(groomTime) + ' +' + parseFloat(groomTime);
                    for (var i = 0; i < $dictSelectBoxArr.length; i++) {
                        pathArr.push({
                            name: $dictSelectBoxArr.eq(i).find('.selectCopy').val(),
                            _id: $dictSelectBoxArr.eq(i).find('.optionCopyActive').attr('dict-id')
                        });
                        pathId.push($dictSelectBoxArr.eq(i).find('.optionCopyActive').attr('dict-id'));
                    }
                    var postData = {
                        _id: $pathActive.attr('path-id'),
                        name: pathName,
                        elapse: parseFloat(pathTime),
                        timeRange: groomTimeFi,
                        //status: ($('#pathSta').val()==='有效')?1:0,
                        path: pathId
                    };
                    WebAPI.post('/patrol/path/save/' + AppConfig.projectId, postData).done(function (result) {
                        if (result.data === $pathActive.attr('path-id')) {
                            var dictTemp = '';
                            var nameStr = '';
                            $nameCon.text(pathName);
                            $timeCon.text(pathTime + '分钟');
                            $patroTimeCon.text(groomTimeFi);
                            $patroDictCon.text(pathArr.length + '个');
                            //$paStatusCon.text($('#pathSta').val());
                            for (var j = 0, lens = pathArr.length; j < lens; j++) {
                                dictTemp += _this.pathList_tpl.formatEL({
                                    pathDictName: pathArr[j].name,
                                    _id: pathArr[j]._id
                                })
                                if (j === lens - 1) {
                                    nameStr += pathArr[j].name;
                                } else {
                                    nameStr += (pathArr[j].name + '/');
                                }
                            }
                            $breadcrumbLi.remove();
                            $breadcrumb.append(dictTemp).attr('title', nameStr);
                            $breadcrumb.siblings('span').html(nameStr);
                        } else {
                            new Alert($('.addPerFail'), 'danger', '新增失败！').show(1000).close();
                        }
                    }).always(function () {
                        $('#addPathModal').modal('hide');
                    });
                });
            }, function () {
                return;
            })
        })
    }

    PatrolPath.prototype.close = function(){
        this.container.empty();
        this.container = null;
        this.$patroPathList = null;
    }

    return PatrolPath;
}());
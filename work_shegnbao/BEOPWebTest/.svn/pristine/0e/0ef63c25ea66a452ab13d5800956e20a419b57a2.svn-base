/**
 * Created by vicky on 2016/3/1.
 */
var PatrolPath = (function(){
    var _this;
    function PatrolPath(){
        _this = this;
        this.container = $('#paneRightCtn');
        this.$patroPathList = undefined;
    }
    PatrolPath.prototype.path_tpl = '<div class="pathCon clearfix" path-id="{_id}">\
            <div class="pathInfo col-sm-2"><lable class="nameCon">{name}</lable></div>\
            <div class="pathInfo col-sm-2"><lable class="patroDictCon">{patroDict}个</lable></div>\
            <div class="pathInfo col-sm-4 pathList" title="{title}"><ol class="breadcrumb">{pathList}</ol><span>{title}</span></div>\
            <div class="pathInfo col-sm-2"><lable class="timeCon">{time}分钟</lable></div>\
            <div class="pathInfo col-sm-2"><lable class="paStatusCon" status-num="{statusNum}">{paStatus}</lable></div>\
            </div>';
    PatrolPath.prototype.pathList_tpl = '<li><a href="javascript:void(0)">{pathDictName}</a></li>';
    PatrolPath.prototype.init = function(){
        WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId).done(function (result) {
            var temp = '';
            var data = result.data;
            for (var i = 0, len = data.length; i < len; i++) {
                var dictTemp = '';
                var nameStr = '';
                var dictPath =  data[i].path;
                for (var j = 0, lens = dictPath.length; j < lens;j++ ){
                    dictTemp += _this.pathList_tpl.formatEL({
                        pathDictName: dictPath[j].name
                    })
                    if (j === lens - 1) {
                        nameStr += dictPath[j].name;
                    } else {
                        nameStr += (dictPath[j].name+'/');
                    }
                }
                temp += _this.path_tpl.formatEL({
                    _id: data[i]._id,
                    name: data[i].name,
                    patroDict: dictPath.length,
                    pathList: dictTemp,
                    time: data[i].elapse,
                    paStatus: (data[i].status === 0) ? '无效' : '有效',
                    statusNum: data[i].status,
                    title: nameStr
                })
            }
            _this.$patroPathList.append(temp);
            //绑定事件
            _this.attachEvents();
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
        var addPathModal = '<div class="modal fade" id="addPathModal">\
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
                            <input type="text" class="form-control" id="pathTime" placeholder="请输入计划用时...">\
                        </div>\
                       <div class="form-group pathStatus">\
                            <label for="pathSta">状态</label>\
                            <select class="form-control" id="pathSta"><option>有效</option><option>无效</option></select>\
                        </div>\
                        <label>工作流</label>\
                        <div class="workCom">\
                            <div class="divRow flowFlag" style="position: relative;">\
                                <div class="label label-success">开始</div>\
                                <div id="btnAddDict" class="glyphicon glyphicon-plus-sign grow" style="position: absolute; font-size: 22px; right: 32px; top: 4px; color: #337ab7; cursor: pointer;"></div>\
                            </div>\
                            <div class="divRow dictSelectBox">\
                                <span>1</span>\
                                <select class="form-control key">\
                                </select>\
                                <div class="btnReduceDict glyphicon glyphicon-minus-sign grow" style="position: absolute; font-size: 22px; right: 32px; top: 21px; color: #337ab7; cursor: pointer;"></div>\
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
        var dict_tpl = '<option dict-id={_id} value="{dictName}">{dictName}</option>';

        _this.$patroPathList.find('.pathCon').off('click').click(function () {
            var $this = $(this);
            $this.siblings().removeClass('trChecked');
            $this.addClass('trChecked');
            if ($this.hasClass('pathActive')) {
                $this.removeClass('pathActive');
                $changePath.attr('disabled', 'disabled');
                $deletePath.attr('disabled', 'disabled');
            } else {
                $this.addClass('pathActive');
                $this.siblings('.pathCon').removeClass('pathActive');
                $changePath.removeAttr('disabled');
                $deletePath.removeAttr('disabled');
            }
        });
        //删除事件
        $deletePath.off('click').click(function () {
            var $pathActive = _this.$patroPathList.find('.pathActive');
            var pathId = $pathActive.attr('path-id');
            WebAPI.get('/patrol/path/remove/' + AppConfig.projectId + '/' + pathId).done(function (result) {
                if (result.data) {
                    $pathActive.remove();
                }
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
            $dictSelectBox.find('.btnReduceDict').hide();
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
        //新增事件
        $('#addPath').off('click').click(function () {
            var $addPathModal = $('#addPathModal');
            if ($addPathModal.length === 0) {
                $('#wrapPatrol').append(addPathModal);
            }
            WebAPI.get('/patrol/point/getList/' + AppConfig.projectId).done(function (result) {
                var temp = '';
                var dictList = (result.data)?(result.data):[];
                if (dictList.length > 0) {
                    for (var i = 0, len = dictList.length; i < len; i++) {
                        temp += dict_tpl.formatEL({
                            _id: dictList[i]._id,
                            dictName: dictList[i].name
                        });
                    }
                    var $pathKey = $('#addPathModal').find('.key');
                    $pathKey.children('option').remove();
                    $pathKey.append(temp);
                    $('.dictSelectBox:not(:first)').remove();
                    $('#pathName').val('');
                    $('#pathTime').val('');
                    $('.pathStatus').hide();
                    $('.dictSelectBox').find('.btnReduceDict').hide();
                    $('#addPathModal').modal('show');
                    //绑定事件
                    _this.attachEvents();
                } else {
                    new Alert($("#wrongInfo"), "danger", '没有巡更点').show(1000);
                }
            });
            //新增按钮事件
            $('#pathOK').off('click').click(function () {
                var pathName = $('#pathName').val();
                var pathTime = $('#pathTime').val();
                var namestr = '';
                var $dictSelectBox = $('.dictSelectBox');
                var pathArr = [];
                var pathPost = [];
                for (var i = 0, len = $dictSelectBox.length; i < len; i++) {
                    var dictIdOn = $dictSelectBox.eq(i).find('.key option:selected').attr('dict-id');
                    var dictNameOn = $dictSelectBox.eq(i).find('.key option:selected').text();
                    pathArr.push({ _id: dictIdOn, name: dictNameOn });
                    pathPost.push(dictIdOn);
                }

                if (pathName === '' || pathTime === '') {
                    new Alert($('.pathWrong'), 'danger', '请填写完整！').show(1000).close();
                } else {
                    var postData = {
                        name: pathName,
                        elapse: parseFloat(pathTime),
                        status: 1,
                        path: pathPost
                    };
                    WebAPI.post('/patrol/path/save/' + AppConfig.projectId, postData).done(function (result) {
                        if (result.data) {
                            var dictTemp = '';
                            for (var j = 0, lens = pathArr.length; j < lens; j++) {
                                dictTemp += _this.pathList_tpl.formatEL({
                                    pathDictName: pathArr[j].name
                                })
                                if (j === lens - 1) {
                                    namestr += pathArr[j].name;
                                } else {
                                    namestr += (pathArr[j].name+'/');
                                }
                            }
                            var temp = _this.path_tpl.formatEL({
                                _id: result.data,
                                name: pathName,
                                patroDict: pathArr.length,
                                pathList: dictTemp,
                                time: parseFloat(pathTime),
                                paStatus: '有效',
                                title: namestr,
                                statusNum: 1
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
            var $pathActive = $('.pathActive');
            var $nameCon = $pathActive.find('.nameCon');
            var $patroDictCon = $pathActive.find('.patroDictCon');
            var $timeCon = $pathActive.find('.timeCon'); 
            var $paStatusCon = $pathActive.find('.paStatusCon');
            var $breadcrumb = $pathActive.find('.breadcrumb');
            var $breadcrumbLi = $pathActive.find('.breadcrumb').find('li');
            var $addPathModal = $('#addPathModal');
            var nameCon = $nameCon.text();
            var timeCon = $timeCon.text();
            if ($addPathModal.length === 0) {
                $('#wrapPatrol').append(addPathModal);
            }
            WebAPI.get('/patrol/point/getList/' + AppConfig.projectId).done(function (result) {

                    var temp = '';
                    var dictList = (result.data) ? (result.data) : [];
                    for (var i = 0, len = dictList.length; i < len; i++) {
                        temp += dict_tpl.formatEL({
                            _id: dictList[i]._id,
                            dictName: dictList[i].name
                        });
                    }

                    $('#pathName').val($nameCon.text());
                    $('#pathTime').val($timeCon.text())
                    $('#pathSta option:selected').text($paStatusCon.text());
                    $('.dictSelectBox:not(:first)').remove();
                    for (var m = 0, lens = $breadcrumbLi.length; m < lens; m++) {
                        var liCon = $breadcrumbLi.eq(m).find('a').text();
                        if(m>0){
                            var $dictSelectBox = $('.dictSelectBox').eq(0);
                            $('#divFlagComplate').before($dictSelectBox.clone(true));
                            
                            addIndex=$('.dictSelectBox').length;
                            $('.dictSelectBox').eq(addIndex-1).find("span").text(addIndex);


                            $('.btnReduceDict').show();
                            $dictSelectBox.find('.btnReduceDict').hide();
                        }
                        var $pathKey = $('#addPathModal').find('.key');
                        $pathKey.eq(m).children('option').remove();
                        $pathKey.eq(m).append(temp);
                        $('.pathStatus').show();
                        if (dictList.length > 0) {
                            for (var j = 0, leng = dictList.length; j < leng; j++) {
                                if (liCon === dictList[j].name) {
                                    $('.dictSelectBox').eq(m).find('.key').val(liCon);
                                    break;
                                } 
                            }
                        }
                    }

                    //绑定事件
                    _this.attachEvents();
                    
                    $('#addPathModal').modal('show');
            });
            //确定按钮事件
            $('#pathOK').off('click').click(function () {
                var pathName = $('#pathName').val() ? $('#pathName').val() : nameCon;
                var pathTime = $('#pathTime').val() ? $('#pathTime').val() : timeCon+'分钟';
                var $dictSelectBoxArr = $('.dictSelectBox').find('.key');
                var pathArr = [];
                var pathId = [];
                for (var i = 0; i < $dictSelectBoxArr.length; i++) {
                    pathArr.push({ name: $dictSelectBoxArr.eq(i).val()});
                    pathId.push($('.dictSelectBox').eq(i).find('.key option:selected').attr('dict-id'));
                }
                var postData = {
                    _id: $pathActive.attr('path-id'),
                    name: pathName,
                    elapse: parseFloat(pathTime),
                    status: ($('#pathSta').val()==='有效')?1:0,
                    path: pathId
                };
                WebAPI.post('/patrol/path/save/' + AppConfig.projectId, postData).done(function (result) {
                    if (result.data === $pathActive.attr('path-id')) {
                        var dictTemp = '';
                        var nameStr = '';
                        $nameCon.text(pathName);
                        $timeCon.text(pathTime);
                        $patroDictCon.text(pathArr.length + '个');
                        $paStatusCon.text($('#pathSta').val());
                        for (var j = 0, lens = pathArr.length; j < lens; j++) {
                            dictTemp += _this.pathList_tpl.formatEL({
                                pathDictName: pathArr[j].name
                            })
                            if (j === lens - 1) {
                                nameStr += pathArr[j].name;
                            } else {
                                nameStr += (pathArr[j].name+'/');
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
        });
    }

    PatrolPath.prototype.close = function(){
        this.container.empty();
    }

    return PatrolPath;
}());
/**
 * Created by vicky on 2016/3/1.
 */
var PatrolPerson = (function(){
    var _this;
    function PatrolPerson(screen){
        _this = this;
        this.container = $('#paneRightCtn');
        this.$patroPersonList = undefined;
        if(screen){
            screen.close();
            this.screen = screen;
        }
    }
    PatrolPerson.prototype.person_tpl = '<div class="personCon clearfix" person-id="{_id}">\
            <div class="personInfo col-sm-3"><lable class="codeCon labelCon">{code}</lable></div>\
            <div class="personInfo col-sm-3"><lable class="nameCon labelCon">{name}</lable></div>\
            <div class="personInfo col-sm-3"><lable class="sexCon labelCon">{sex}</lable></div>\
            <div class="personInfo col-sm-3"><lable class="departCon labelCon">{department}</lable></div>\
            </div>';
    PatrolPerson.prototype.init = function(){
        var target = $('#patroPersonList')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/executor/getList/' + AppConfig.projectId).done(function (result) {
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
            for (var i = 0, len = data.length; i < len;i++){
                if(data[i].status === 1){
                    temp += _this.person_tpl.formatEL({
                        _id: data[i]._id,
                        code: data[i].code,
                        name: data[i].name,
                        sex: (data[i].sex===0)?'女':'男',
                        department: data[i].department
                        //status: (data[i].status === 0) ? '注销' : '在岗',
                        //statusNum: data[i].status
                    })
                }
            }
            _this.$patroPersonList.append(temp);
            //绑定事件
            _this.attachEvents();
        }).always(function (){
            Spinner.stop();
        });
    }

    PatrolPerson.prototype.show = function () {
        WebAPI.get('/static/app/Patrol/views/patrolPerson.html').done(function (resultHTML) {
            _this.container.html('').html(resultHTML);
            _this.$patroPersonList = $('#patroPersonList');
            //显示所有人员
            _this.init();
        });
    }

    PatrolPerson.prototype.attachEvents = function () {
        //人员信息被选中事件
        //var $logout = $('#logout');
        //var $unLogout = $('#unLogout');
        var $changePerson = $('#changePerson');
        var $deletePerson = $('#deletePerson');
        var addPersonModal = '<div class="modal fade" id="addPersonModal" data-backdrop="static">\
                  <div class="modal-dialog">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                        <h4 class="modal-title">编辑员工信息</h4>\
                      </div>\
                      <div class="modal-body">\
                        <div class="perInfoList">\
                            <div class="perCode">员工编号：</div><input type="text" class="perCodeCon"/></br>\
                            <div class="perName">员工姓名：</div><input type="text" class="perNameCon"/></br>\
                            <div class="perSex">员工性别：</div><select class="perSexCon"><option value="男">男</option><option value="女">女</option></select></br>\
                            <div class="perDepart">员工部门：</div><input type="text" class="perDepartCon"/></br>\
                        </div>\
                        <div class="addPerFail"></div>\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                        <button type="button" class="btn btn-primary" id="btnAdd">确定</button>\
                      </div>\
                    </div>\
                  </div>\
                </div>';
        _this.$patroPersonList.find('.personCon').off('click').click(function () {
            var $this = $(this);

            if ($this.hasClass('personActive')) {
                $this.removeClass('personActive');
                $this.removeClass('trChecked');
                $changePerson.attr('disabled', 'disabled');
                $deletePerson.attr('disabled', 'disabled');
                //$logout.attr('disabled', 'disabled');
                //$unLogout.hide();
            } else {
                $this.addClass('personActive');
                $this.siblings().removeClass('trChecked');
                $this.addClass('trChecked');
                $this.siblings('.personCon').removeClass('personActive');
                $changePerson.removeAttr('disabled');
                $deletePerson.removeAttr('disabled');
                //if ($this.find('.statusCon').attr('status-num') === '0') {
                //    $unLogout.show();
                //    $logout.attr('disabled', 'disabled');
                //} else {
                //    $logout.removeAttr('disabled');
                //    $unLogout.hide();
                //}
            }
        });
        //注销事件
        //$logout.off('click').click(function () {
        //    var $personActive = $('.personActive');
        //    $personActive.find('.statusCon').attr('status-num', '0').html('注销');
        //    var postData = {
        //        _id: $personActive.attr('person-id'),
        //        code: $personActive.find('.codeCon').text(),
        //        name: $personActive.find('.nameCon').text(),
        //        sex: ($personActive.find('.sexCon').text()==='女')?0:1,
        //        department: $personActive.find('.departCon').text(),
        //        status:0
        //    };
        //    WebAPI.post('/patrol/executor/save/' + AppConfig.projectId,postData).done(function (result) {
        //        if (result.data === $personActive.attr('person-id')) {
        //            console.log('注销成功');
        //            $logout.attr('disabled', 'disabled');
        //            $unLogout.show();
        //        }
        //    });
        //});
        //取消注销事件
        //$unLogout.off('click').click(function () {
        //    var $personActive = $('.personActive');
        //    $personActive.find('.statusCon').attr('status-num', '1').html('在岗');
        //    var postData = {
        //        _id: $personActive.attr('person-id'),
        //        code: $personActive.find('.codeCon').text(),
        //        name: $personActive.find('.nameCon').text(),
        //        sex: ($personActive.find('.sexCon').text() === '女') ? 0 : 1,
        //        department: $personActive.find('.departCon').text(),
        //        status: 1
        //    };
        //    WebAPI.post('/patrol/executor/save/' + AppConfig.projectId, postData).done(function (result) {
        //        if (result.data === $personActive.attr('person-id')) {
        //            console.log('注销成功');
        //            $logout.removeAttr('disabled');
        //            $unLogout.hide();
        //        }
        //    });
        //});
        //排序事件
        $('#btnSort').off('click').on('click',function(){
            var $patroPersonList = $('#patroPersonList');
            $patroPersonList.children('.personCon').remove();
            if($('#btnSort').attr('data-sort') === '0'){
                $('#btnSort').attr('data-sort','1').children('.sortText').text('降序排序');
            }else{
                $('#btnSort').attr('data-sort','0').children('.sortText').text('升序排序');
            }
            _this.init();
        });
        //删除事件
        $deletePerson.off('click').on('click keydown',function (e) {
            if (e.keyCode) {
                return false;
            }
            confirm('请确认是否删除！', function () {
                var $personActive = $('.personActive');
                var personId = $personActive.attr('person-id');
                var data = {
                    _id: personId,
                    status: 0
                }
                WebAPI.post('/patrol/executor/remove/' + AppConfig.projectId + '/' + personId, data).done(function (result) {
                    //if (result.data && result.missionId.length === 0) {
                        $personActive.remove();
                        $changePerson.attr('disabled', 'disabled');
                        $deletePerson.attr('disabled', 'disabled');
                    //} else {
                    //    alert('此人员当前排班有巡更路线,不能删除！');
                    //    return;
                    //}
                })
            }, function () {
                return;
            });
        });

        //修改事件
        $changePerson.off('click').click(function () {
            var $personActive = $('.personActive');
            var $addPersonModal = $('#addPersonModal');
            if ($addPersonModal.length === 0) {
                $('#wrapPatrol').append(addPersonModal);
            }
            //$('.perStatusCon').attr('disabled', 'disabled').css('background', '#E8E8E8');
            $('#addPersonModal').modal('show');
            var codeCon = $personActive.find('.codeCon').text();
            var nameCon = $personActive.find('.nameCon').text();
            var departCon = $personActive.find('.departCon').text();
            var $perCodeCon = $('.perCodeCon');
            var $perNameCon = $('.perNameCon');
            var $perDepartCon = $('.perDepartCon');
            var $perSexCon = $('.perSexCon');
            //var $perStatusCon = $('.perStatusCon');
            $perCodeCon.val(codeCon);
            $perNameCon.val(nameCon);
            $perDepartCon.val(departCon);
            $perSexCon.val($personActive.find('.sexCon').text());
            //$perStatusCon.val($personActive.find('.statusCon').text());
            $('#btnAdd').off('click').click(function () {
                var perCode = $perCodeCon.val();
                if (perCode === '' || perCode.replace(/(^\s*)|(\s*$)/g, "") === '') {
                    perCode = codeCon;
                }
                var perName = $perNameCon.val();
                if (perName === '' || perName.replace(/(^\s*)|(\s*$)/g, "") === '') {
                    perName = nameCon;
                }
                var perSex = ($perSexCon.val() === '女') ? 0 : 1;
                var perDepart = $perDepartCon.val();
                if (perDepart === '' || perDepart.replace(/(^\s*)|(\s*$)/g, "") === '') {
                    perDepart = departCon;
                }
                //var perStatus = ($perStatusCon.val() === '在岗') ? 1 : 0;
                    var postData = {
                        _id: $personActive.attr('person-id'),
                        code: perCode,
                        name: perName,
                        sex: perSex,
                        department: perDepart
                        //status: perStatus
                    };
                    WebAPI.post('/patrol/executor/save/' + AppConfig.projectId, postData).done(function (result) {
                        if (result.data === $personActive.attr('person-id')) {
                            $personActive.find('.codeCon').text(perCode);
                            $personActive.find('.nameCon').text(perName);
                            $personActive.find('.departCon').text(perDepart); 
                            $personActive.find('.sexCon').text($perSexCon.val());
                            //$personActive.find('.statusCon').text($perStatusCon.val());

                        } else {
                            new Alert($('.addPerFail'), 'danger', '新增失败！').show(1000).close();
                        }
                    }).always(function () {
                        $('#addPersonModal').modal('hide');
                    });
            });
        });
        //新增事件
        $('#addPersons').off('click').click(function () {
            var $addPersonModal = $('#addPersonModal');
            if ($addPersonModal.length===0) {
                $('#wrapPatrol').append(addPersonModal);
            }
            //$('.perStatusCon').removeAttr('disabled').css('background', '#fff');
            $('.perInfoList').find('input').val('');
            $('#addPersonModal').modal('show');
            //点击确定时
            $('#btnAdd').off('click').click(function () {
                var perCode = $('.perCodeCon').val();
                var perName = $('.perNameCon').val();
                var perSex = ($('.perSexCon option:selected').text() === '女') ? 0 : 1;
                var perDepart = $('.perDepartCon').val();
                //var perStatus = ($('.perStatusCon option:selected').text() === '在岗') ? 1 : 0;
                if (perCode === '' || perName === '' || perDepart === '' || perCode.replace(/(^\s*)|(\s*$)/g, "") === '' || perName.replace(/(^\s*)|(\s*$)/g, "") === '' || perDepart.replace(/(^\s*)|(\s*$)/g, "")==='') {
                    new Alert($('.addPerFail'), 'danger','请填写完整！').show(1000).close();
                } else { 
                    var postData = {
                        code: perCode,
                        name: perName,
                        status: 1,
                        sex: perSex,
                        department: perDepart
                        //status: perStatus
                    };
                    WebAPI.post('/patrol/executor/save/' + AppConfig.projectId, postData).done(function (result) {
                        if (result.data) {
                            var temp = '';
                            temp = _this.person_tpl.formatEL({
                                _id: result.data,
                                code: perCode,
                                name: perName,
                                sex: $('.perSexCon option:selected').text(),
                                department: perDepart,
                                //status: $('.perStatusCon option:selected').text()
                                //statusNum: perStatus
                            })
                            _this.$patroPersonList.append(temp);
                            _this.attachEvents();
                        } else {
                            new Alert($('.addPerFail'), 'danger', '新增失败！').show(1000).close();
                        }
                    }).always(function () {
                        $('#addPersonModal').modal('hide');
                    });
                }
            });
        });

    }

    PatrolPerson.prototype.close = function(){
        this.container.empty();
        this.container = null;
        this.$patroPersonList=null;
    }

    return PatrolPerson;
}());
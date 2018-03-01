var DiagnosisConfig = (function() {
    var _this;

    function DiagnosisConfig(parent) {
        this.parent = parent;
        this.buildingMerge = undefined;
        this.$diagnosisManage = undefined;
        this.index = undefined;
        _this = this;
    }

    DiagnosisConfig.prototype = {
        show: function() {
            WebAPI.get("/static/views/observer/diagnosis/diagnosisConfig.html").done(resultHtml => {
                var $dialog = $('#dialogModal');
                $dialog.find('#dialogContent').html(resultHtml);
                I18n.fillArea($dialog);
                this.$diagnosisManage  = $dialog.find('#diagnosisManage');
                this.initLeftNav();
                this.requestUserMap();
                this.attevent();
                $dialog.modal();
                this.$diagnosisManage.find('.nav_three:first').trigger('click');
            });
        },
        attevent:function(){
            //关闭按钮点击事件
            $('#closeModal').off('click').on('click',e =>{
                $('#dialogModal').modal('hide');
            });
            //左侧导航点击显示子菜单
            this.$diagnosisManage.find('.nav_one').off('click').on('click',e =>{
                var $this = $(e.currentTarget);
                if($this.hasClass('activeOne')){
                    $this.removeClass('activeOne');
                    $this.next('.nav_two_box').hide();
                }else{
                    $('.activeOne').removeClass('activeOne');
                    $this.addClass('activeOne');
                    $this.next('.nav_two_box').show();
                }
            })
            //二级菜单点击事件
            this.$diagnosisManage.find('.nav_two').off('click').on('click',e =>{
                var $this = $(e.currentTarget);
                var id = e.currentTarget.dataset.id;
                if($this.hasClass('active')){
                    $this.removeClass('active');
                    $this.next('.nav_three_box').hide();
                    return;
                }
                var $diagnosisManage = $("#diagnosisManage");
                //$('#diagEnableDiag').removeClass('disabled');
                //$('#diagDisableDiag').removeClass('disabled');
                $this.next('.nav_three_box').show();
                $diagnosisManage.find('.active').removeClass('active');
                $this.addClass('active');
                var status = $('#displayEnableIpt').prop('checked');
                if(status){
                    var postData = {
                        type:'zone',
                        id:id,
                        //status:status,
                        keyword:'',
                        projId:AppConfig.projectId
                    }
                }else{
                    var postData = {
                        type:'zone',
                        id:id,
                        status:true,
                        keyword:'',
                        projId:AppConfig.projectId
                    }
                }
                Spinner.spin($('#dialogModal')[0]);
                WebAPI.post("/diagnosis/fault/filter",postData).done(resultData => {
                    var data = resultData.data;
                    if(data.length==0){
                        infoBox.alert('no data!');
                        return;
                    }
                    var trDoms = this.renderDiagnosis(data);
                    this.$diagnosisManage.find('.rightdiagInfo tbody').html(trDoms);
                    // this.setTrData(data);
                    this.attevent();
                }).always(e=>{
                    Spinner.stop();
                });
            });

            //三级菜单点击事件
            this.$diagnosisManage.find('.nav_three').off('click').on('click',e =>{
                var $this = $(e.currentTarget);
                var id = e.currentTarget.dataset.id;
                if($this.hasClass('active')) return;
                //$('#diagEnableDiag').addClass('disabled');
                //$('#diagDisableDiag').addClass('disabled');
                var $diagnosisManage = $("#diagnosisManage");
                $diagnosisManage.find('.active').removeClass('active');
                $this.addClass('active');
                var status = $('#displayEnableIpt').prop('checked');
                if(status){
                    var postData = {
                        type:'equipment',
                        id:id,
                        //status:false,
                        keyword:'',
                        projId:AppConfig.projectId
                    }
                }else{
                    var postData = {
                        type:'equipment',
                        id:id,
                        status:true,
                        keyword:'',
                        projId:AppConfig.projectId
                    }
                }
                Spinner.spin($('#dialogModal')[0]);
                WebAPI.post("/diagnosis/fault/filter",postData).done(resultData => {
                    var data = resultData.data;
                    if(data.length==0){
                        infoBox.alert('no data!');
                        return;
                    }
                    var trDoms = this.renderDiagnosis(data);
                    this.$diagnosisManage.find('.rightdiagInfo tbody').html(trDoms);
                    // this.setTrData(data);
                    this.attevent();
                }).always(e=>{
                    Spinner.stop();
                });
            });

            //显示禁用故障点击事件
            $('#displayEnableIpt').off('click').on('click',e =>{
                var $this = $(e.currentTarget);
                var status = $this.prop('checked');
                var $active = $('.active');
                var id = $active.attr('data-id');
                var type = $active.attr('data-type');
                if(!status) {
                    var post = {
                        type: type,
                        id: id,
                        status: true,
                        keyword: '',
                        projId: AppConfig.projectId
                    }
                }else{
                    var post = {
                        type: type,
                        id: id,
                        //status: status,
                        keyword: '',
                        projId: AppConfig.projectId
                    }
                }
                Spinner.spin($('#dialogModal')[0]);
                WebAPI.post("/diagnosis/fault/filter",post).done(resultData => {
                    var data = resultData.data;
                    if(data.length==0){
                        infoBox.alert('no data!');
                        return;
                    }
                    var trDoms = this.renderDiagnosis(data);
                    this.$diagnosisManage.find('.rightdiagInfo tbody').html(trDoms);
                    // _this.setTrData(resultData.data);
                    this.attevent();
                }).always(e=>{
                    Spinner.stop();
                });
            })
            $('#displayEnableSpan').off('click').on('click',e =>{
                var $displayEnableIpt = $('#displayEnableIpt');
                $displayEnableIpt.trigger('click');
            })
            //搜索关键字
            $('#diagSearch').off('keydown').on('keydown',e =>{
                if (event.keyCode == "13") {
                    this.searchEvent();
                }
            })
            $('#diagSearch').off('propertychange input').on('propertychange input',e =>{
                var currnetVal = $(e.currentTarget).val();
                if(currnetVal == ''){
                    this.searchRender(currnetVal);
                }
            })
            $('#searchBtn').off('click').on('click',e =>{
                this.searchEvent();
            })

            //tr点击+shift时文字被选中效果去除事件
            this.$diagnosisManage.find('tbody tr').off('selectstart').on('selectstart',e =>{
                event = window.event||event;
                event.returnValue = false;
            })
            //tr点击事件
            this.$diagnosisManage.find('tbody tr').off('click').on('click',e =>{
                //var type = !$('#diagEnableDiag').hasClass('disabled')?'zone':'equipment';
                var $this = $(e.currentTarget);
                var currentIndex = $this.index();
                //if(type=='equipment'){
                //    return
                //}else{
                if(e.shiftKey){
                    if(this.index!=0&&!this.index){
                        $this.addClass('trActive');
                    }else{
                        var startIndex = this.index,
                            lastIndex = currentIndex;
                        var trArr = this.$diagnosisManage.find('tbody tr');
                        var selTr = trArr.slice(Math.min(startIndex, lastIndex), Math.max(startIndex, lastIndex) + 1);
                        selTr.addClass('trActive');
                        trArr.not(selTr).removeClass('trActive');
                    }
                }else if(e.ctrlKey){
                    $this.hasClass('trActive')?$this.removeClass('trActive'):$this.addClass('trActive');
                    this.index = currentIndex;
                }else{
                    $('.trActive').removeClass('trActive');
                    $this.addClass('trActive');
                    this.index = currentIndex;
                }
                //}
            });
            //tr双事件 暂不用
            this.$diagnosisManage.find('tbody tr').off('dblclick').on('dblclick',e =>{
                var item = $(e.currentTarget).data('item');
                $("#diagnosisItemName").val(item.Name);
                $("#diagnosisItemGrade").val(item.Grade);
                $("#diagnosisItemEquipName").val(item.EquipName);
                $("#diagnosisItemConsequence").val(item.Consequence);
                $("#diagnosisItemForm").find('input[type=radio][value=' + item.Enable + ']').prop('checked', item.Enable);
            });

            //修改记录确定 暂不用
            $('#diagnosisItemConfirm').off('click').on('click',e =>{
                var $form = $("#diagnosisItemForm");
                var postData = $form.serializeObject();
                postData.notify = _this.pushListData();
                postData.userHasSelected = _this.getPersonnelInformation();
                console.dir(postData);
                var $tr = $("#diagnosisListInfoBox").find('.trActive');
                $tr.find('.taGrade').text($("#diagnosisItemGrade").find("option:selected").text());
                $tr.find('.tdEnable').text($form.find('[name="Enable"]:checked').attr('textValue'));
                $tr.find('.tdPush').text(_this.userHasSelected.length ? '启用':'禁用');
            });

            //点击网站推送图标选人
            $("#diagnosisMailPush").off('click').on('click', e => {
                _this.pushType = 'mail';
                _this.getSelectPerson('mail');
            });

            $("#diagnosisAppPush").off('click').on('click', e => {
                _this.pushType = 'app';
                _this.getSelectPerson('app');
            });

            // 删除某个项目的全部推送,  暂不用
            $("#diagnosisDelPush").off('click').on('click', e => {
                WebAPI.post("/diagnosis/faults/deleteAllRelated", {
                    projId: AppConfig.projectId
                }).done(result => {
                    if (result.data) {
                        alert('删除成功');
                    }
                }).fail(function () {
                    alert(I18n.resource.common.REQUEST_ERROR);
                })
            });


            //启用诊断点击事件
            $('#diagEnableDiag').off('click').on('click',e =>{
                this.disableRender(true, 'diagnosis');
            })
            //禁用诊断
            $('#diagDisableDiag').off('click').on('click',e =>{
                this.disableRender(false, 'diagnosis');
            })

            //启用推送点击事件
            $('#diagnosisEnablePush').off('click').on('click',e =>{
                this.disableRender(true, 'push');
            });
            //禁用推送
            $('#diagnosisDisablePush').off('click').on('click',e =>{
                this.disableRender(false, 'push');
            });
        },

        // 点击推送图标选人 type: mail, app
        getSelectPerson: function (type) {
            var $trActive = _this.$diagnosisManage.find('.trActive'), userHasSelected;
            if ($trActive.length == 0) {
                infoBox.alert(I18n.resource.diagnosis.config.subConfig.SELECT_FAULTS);
            } else if ($trActive.length == 1) {
                WebAPI.post("/diagnosis/faults/relatedUsers", {
                    projId: AppConfig.projectId,
                    faultIdStr: $trActive.data('faultid'),
                    type: type == 'mail' ? 0 : 1 // 0 mail, 1 app
                }).done(result => {
                    if (result.data) {
                        if (result.data.length) {
                            var usersStr = result.data[0].toString();
                            var userMapList = [], userIds = usersStr.split(',');
                            for (var i = 0; i < userIds.length; i++) {
                                for (var j = 0; j < _this.userData.length; j++) {
                                    if (userIds[i] == _this.userData[j].id) {
                                        userMapList.push(_this.userData[j]);
                                        continue;
                                    }
                                }
                            }
                            userHasSelected = userMapList;
                        } else {
                            userHasSelected = null
                        }
                        _this.openUserMapModal(userHasSelected);
                    }
                }).fail(function () {
                    alert(I18n.resource.common.REQUEST_ERROR);
                }).always(e=> {
                    Spinner.stop();
                });
            } else {
                userHasSelected = null;
                _this.openUserMapModal(userHasSelected);
            }
        },

        // 打开选择人物列表模态框
        openUserMapModal: function (userHasSelected) {
            var $trActive = _this.$diagnosisManage.find('.trActive');
            _this.userInfoPromise.done(result => {
                _this.userData = result.data;
                beop.view.memberSelected.init($(document.body), {
                    configModel: {
                        userMemberMap: _this.userData || [],
                        userHasSelected: userHasSelected || null,
                        maxSelected: null,
                        cb_dialog_hide: function (addedUserList) {
                            Spinner.spin($('#dialogModal')[0]);
                            var postMap = {
                                type: _this.pushType == 'mail' ? 0 : 1, // 0 mail, 1 app
                                projId: AppConfig.projectId,
                                UserIds: [],
                                arrFaultId: []
                            };
                            for (var i = 0; i < $trActive.length; i++) {
                                postMap.arrFaultId.push($trActive.eq(i).attr('data-faultid'));
                            }
                            for (var i = 0; i < addedUserList.length; i++) {
                                postMap.UserIds.push(addedUserList[i].id);
                            }
                            WebAPI.post("/diagnosis/faults/pushRelated", postMap).done(result => {
                                if (result.data) {
                                    alert(I18n.resource.diagnosis.config.subConfig.SET_PERSON_SUCCESS);
                                }
                            }).fail(function () {
                                alert(I18n.resource.common.REQUEST_ERROR);
                            }).always(e=> {
                                Spinner.stop();
                            });
                        }
                    }
                });
            })
        },

        // 得到任务列表
        requestUserMap: function () {
            this.userInfoPromise =  WebAPI.get('/workflow/group/user_team_dialog_list/' + window.parent.AppConfig.userId).done(function (result) {
                if (result.success) {
                    _this.userData = result.data;
                }
            }).fail(function () {
                alert(I18n.resource.common.REQUEST_ERROR);
            });
        },
        // 提交获取推送任务信息 暂不用
        getPersonnelInformation: function () {
            var addPersonnelInformation = [];
            if (_this.userHasSelected == null || !_this.userHasSelected.length) {
                return [];
            } else {
                for (var i = 0; i < _this.userHasSelected.length; i++) {
                    var personnelInformation = {
                        id: null,
                        userfullname: null,
                        useremail: null,
                        userpic: null
                    };
                    personnelInformation.id = _this.userHasSelected[i].id;
                    personnelInformation.userfullname = _this.userHasSelected[i].userfullname;
                    personnelInformation.useremail = _this.userHasSelected[i].useremail;
                    personnelInformation.userpic = _this.userHasSelected[i].userpic;
                    addPersonnelInformation.push(personnelInformation);
                }
                return addPersonnelInformation;
            }
        },
        //从推送列表中取数据 暂不用
        pushListData: function () {
            var notify = [];
            var pushListTr = $('#pushUserList').find('tbody tr');
            if (this.userHasSelected == null || !this.userHasSelected.length) {
                return [];
            } else {
                for (var i = 0; i < this.userHasSelected.length; i++) {
                    var getObject = {
                        userId: null,
                        userfullname: null,
                        useremail: null,
                        isWebSite: false,
                        isEmail: false,
                        isApp: false
                    };
                    var fetchIndex = pushListTr.eq(i);
                    if (fetchIndex.find('.isWebSite').is(':checked')) {
                        getObject.isWebSite = true;
                    }
                    if (fetchIndex.find('.isApp').is(':checked')) {
                        getObject.isApp = true;
                    }
                    if (fetchIndex.find('.isEmail').is(':checked')) {
                        getObject.isEmail = true;
                    }
                    getObject.userId = this.userHasSelected[i].id;
                    getObject.userfullname = this.userHasSelected[i].userfullname;
                    getObject.useremail = this.userHasSelected[i].useremail;
                    notify.push(getObject);
                }
                return notify;
            }
        },
        // 暂不用
        setTrData: function (data) {
            if(data.length){
                var $tr = $("#diagnosisManage").find('.rightdiagInfo tbody tr');
                for (var i = 0; i < data.length; i++) {
                    $tr.eq(i).data('item', data[i]);
                }
            }
        },
        searchEvent:function(){
            var $diagSearch = $('#diagSearch');
            var currentVal = $diagSearch.val().trim();
            if(currentVal=='') return;
            this.searchRender(currentVal);
        },
        searchRender:function(currentVal){
            var $active = $('.active');
            var id = $active.attr('data-id');
            var type = $active.attr('data-type');
            var status = $('#displayEnableIpt').prop('checked');
            if(status){
               var post = {
                    type:type,
                    id:id,
                    //status:status,
                    keyword:currentVal,
                    projId:AppConfig.projectId
                }
            }else{
                var post = {
                    type:type,
                    id:id,
                    status:true,
                    keyword:currentVal,
                    projId:AppConfig.projectId
                }
            }
            Spinner.spin($('#dialogModal')[0]);
            WebAPI.post("/diagnosis/fault/filter",post).done(resultData => {
                var data = resultData.data;
                if(data.length==0){
                    infoBox.alert('no data!');
                    return;
                }
                var trDoms = this.renderDiagnosis(data);
                this.$diagnosisManage.find('.rightdiagInfo tbody').html(trDoms);
                // this.setTrData(data);
                this.attevent();
            }).always(e=>{
                Spinner.stop();
            });
        },
        disableRender:function(disable, type){
            var $trActive = this.$diagnosisManage.find('.trActive');
            if($trActive.length==0){
                infoBox.alert(I18n.resource.diagnosis.config.subConfig.SELECT_FAULTS);
            }else{
                var arrFaultId = [];
                for(var i = 0;i<$trActive.length;i++){
                    arrFaultId.push($trActive.eq(i).attr('data-faultid'));
                }
                var postData = {
                    arrFaultId:arrFaultId,
                    projId:AppConfig.projectId
                };
                var url = '/diagnosis/faults/';
                if (type == 'diagnosis') {
                    //if($trActive.attr('data-enable') == disable.toString()) return;
                    url += 'changeStatus';
                    postData.status = disable.toString();
                } else {
                    url += 'pushStatus';
                    postData.Push = disable.toString();
                }

                var diableStr = disable?I18n.resource.diagnosis.config.subConfig.ENABLE:I18n.resource.diagnosis.config.subConfig.DISABLE;

                Spinner.spin($('#dialogModal')[0]);
                WebAPI.post(url,postData).done(result => {
                    if(result.data){
                        infoBox.alert(disable?I18n.resource.diagnosis.config.subConfig.ENA_SUCCESS:I18n.resource.diagnosis.config.subConfig.DIS_SUCCESS);
                        // _this.setTrData(result.data);
                        if (type == 'diagnosis') {
                            for(var i =0;i<$trActive.length;i++){
                                if(disable){
                                    $trActive.eq(i).removeClass('faultDisStyle');
                                }else{
                                    $trActive.eq(i).addClass('faultDisStyle');
                                }
                                if( $trActive.eq(i).find('td:last').html()!=diableStr){
                                    $trActive.eq(i).find('td:last').html(diableStr);
                                }
                            }
                        } else {
                            for(var i =0;i<$trActive.length;i++){
                                $trActive.eq(i).find('.tdPush').text(disable ?
                                I18n.resource.diagnosis.config.subConfig.ENABLE : I18n.resource.diagnosis.config.subConfig.DISABLE);
                            }
                        }

                    }
                }).fail(function () {
                    alert(I18n.resource.common.REQUEST_ERROR);
                }).always(e=> {
                    Spinner.stop();
                });
            }
        },
        renderDiagnosis:function(data){
            var trArrDom = ''
            var trDom = '<tr data-faultId="{faultId}"  data-sesc="{desc}" data-push="{push}" data-enable="{enableOri}" data-equipId="{equipId}" class="{disenableStyle}">' +
                '<td class="taGrade">{grade}</td>' +
                '<td class="leftAlign tdName">{namae}</td>' +
                '<td class="tdEquipment">{equipName}</td>' +
                '<td class="leftAlign tdConsequence">{consequence}</td>' +
                '<td class="tdPush">{push}</td>' +
                '<td class="tdEnable">{enable}</td>' +
                '</tr>'
            if(data.length!=0){
                for(var i = 0;i<data.length;i++){
                    var item = data[i];
                    trArrDom += trDom.formatEL({
                        faultId:item.FaultId,
                        desc:item.Desc,
                        equipId:item.EquipId,
                        grade:item.Grade==1?I18n.resource.diagnosis.config.LEVEL_SET.CRITICAL:I18n.resource.diagnosis.config.LEVEL_SET.URGENT,
                        namae:item.Name,
                        equipName:item.EquipName,
                        consequence:item.Consequence,
                        enable:item.Enable?I18n.resource.diagnosis.config.subConfig.ENABLE:I18n.resource.diagnosis.config.subConfig.DISABLE,
                        enableOri:item.Enable,
                        push: item.Push == 1 ? I18n.resource.diagnosis.config.subConfig.ENABLE : I18n.resource.diagnosis.config.subConfig.DISABLE,
                        disenableStyle:item.Enable?'':'faultDisStyle'
                    })
                }
            }
            return trArrDom;
        },
        initLeftNav:function(){
            this.buildingMergeFunc();
            var navDom = '';
            //三级菜单渲染
            function navThird(equipments){
                var navThirdDom = '';
                for(var i = 0;i<equipments.length;i++){
                    navThirdDom+='<div class="nav_three" data-type="equipment" data-id="'+equipments[i].equipmentId+'">'+equipments[i].equipmentName+'</div>'
                }
                return navThirdDom;
            }
            //二级菜单渲染
            function navSecond(buildingSecond){
                var navSecondDom = '';
                for(var i = 0;i<buildingSecond.length;i++){
                    var itemSecond = buildingSecond[i];
                    var equipmentsArr = itemSecond.equipments;
                    navSecondDom+='<div class="nav_two" data-type="zone" data-id="'+itemSecond.subBuildId+'">'+itemSecond.subBuildName+'</div>'+
                            '<div class="nav_three_box">' +
                            navThird(equipmentsArr)+
                            '</div>';
                }
                return navSecondDom;
            }
            for(var i = 0,len = this.buildingMerge.length;i<len;i++){
                var itemI = this.buildingMerge[i];
                navDom+='<div class="nav_one_box">'+
                    '<div class="nav_one" data-id="'+itemI.buildId+'">'+itemI.buildName+'</div>'+
                    '<div class="nav_two_box">'+
                        navSecond(itemI.subBuilds)+
                    '</div>'+
                    '</div>'
            }
            this.$diagnosisManage.find('.leftNavBox').html(navDom);
            this.$diagnosisManage.find('.nav_two_box:first').show();
            this.$diagnosisManage.find('.nav_three_box:first').show();
        },
        buildingMergeFunc:function(){
            //合并building里面的项
            var leftNavList = this.parent.buildings;
            var leftNavSort = [];
            var buildingIdArr = [];
            for(var i = 0,len = leftNavList.length;i<len;i++){
                var item = leftNavList[i];
                var itemSame = $.extend({},item,true);
                if(buildingIdArr.indexOf(item.buildId)<0){
                    buildingIdArr.push(item.buildId);
                }else{
                    continue;
                }
                var subBuildsArr = [];
                for(var j = 0,lens = leftNavList.length;j<lens;j++){
                    itemJ = leftNavList[j];
                    if(itemJ.buildId==item.buildId){
                        //itemSame = $.extend(itemSame,itemJ,true);
                        for(var m = 0;m<itemJ.subBuilds.length;m++){
                            subBuildsArr.push(itemJ.subBuilds[m]);
                        }
                    }
                }
                itemSame.subBuilds = subBuildsArr;
                leftNavSort.push(itemSame);
            }
            this.buildingMerge = leftNavSort;
        },
        close:function(){
            this.parent = null;
            this.buildingMerge = null;
            this.index = null;
        }
    }
    return DiagnosisConfig;
})();

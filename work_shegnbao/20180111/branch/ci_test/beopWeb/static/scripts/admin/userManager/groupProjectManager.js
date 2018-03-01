/**
 * Created by  on 2017/5/24.
 */
var GroupProjectManager = (function () {

    var _this;

    function GroupProjectManager() {
        _this = this;
        this.$container = $();
        this.pageViewModel = undefined;
        this.$selectProject = undefined;
        this.currentProjectId = AppConfig.projectId ? 'all' : 'all';
        this.clickProject = undefined;
        this.uploadFile = undefined; 
        //需要绑定的项目
        this.bindProject = [];               
        this.viewSource = "/static/views/admin/userManager/groupProjectManager.html";
    }

    GroupProjectManager.prototype = {
        show: function () {
            Spinner.spin(ElScreenContainer);
            WebAPI.get(this.viewSource).done(function (resultHtml) {
                _this.$container = $('#GroupManageWrapper').html(resultHtml);
                $("#manageTab li[screen='AccountManager']").remove();
                $("#manageTab").show();
                $("#panelContentWrapper").hide();
                _this.init();
                _this.attachEvent();
                I18n.fillArea($(ElScreenContainer));
            }).always(function(){
                Spinner.stop();
            });
        },
        init: function () {
            this.setPermissionManagerHeight();
            this.loadGroupPermission();
            $("#panelContentWrapper").show();
        },
        //设置容器高度
        setPermissionManagerHeight: function () {
            $("#panelContentWrapper").height($(window).height() - $(".navbar").height() - 62);
            $("#projectCon").height($(window).height() - $(".navbar").height() - 185);
        },
        //获取所有项目
        loadGroupPermission: function () {
            return WebAPI.get('/admin/getManagementList').done(function (result) {
                if (result.success) {
                    _this.pageViewModel = result.data;
                    _this.renderProjectSelector(_this.pageViewModel);
                    _this.renderSelectPage();                   
                }
            }).always(function () {
                Spinner.stop();
            })
        },
        loadProjectPermission: function () {
            _this.bindProject = [];
            return WebAPI.post('/admin/loadProjectPermission', {'userId': AppConfig.userId}).done(function (result) {
                if (result.success) {
                    var project = result.data.projectList;
                    $('.bindProjcetList').empty();
                    for (var i = 0; i < project.length; i++) {
                        $('.bindProjcetList').append('<div class="btn btn-default rowProject" projId="' + project[i].id + '"><span>' + project[i].projectName + '</span></div>')
                    }
                    $('.rowProject').off('click').on('click', function () {
                        var $this = $(this);
                        var bindId = $this.attr('projId');
                        var isExsit = _this.bindProject.indexOf(bindId);
                        $this.toggleClass('select');
                        if (isExsit > -1) {
                            _this.bindProject.splice(isExsit, 1);
                        } else {
                            _this.bindProject.push(bindId);
                        }
                    });
                }
            }).always(function () {
                Spinner.stop();
            });
        },
        renderProjectSelector: function (result) {
            var projectList = result.map(function (project) {
                return {
                    id: project.id,
                    text: project.name_cn + ' (' + project.id + ')'
                }
            });
            projectList.unshift({
                id: 'all',
                text: I18n.resource.admin.panelManagement.ALL_ITEMS
            })            
            _this.$selectProject = $("#selectProject").empty().select2({
                data: projectList
            });
            //_this.$selectProject.val(_this.currentProjectId).trigger('change');
        },
        attachEvent: function () {
            $('#selectProject').off().change(function () {
                _this.$selectProject.select2('destroy');
                _this.$selectProject.select2();
                _this.currentProjectId = this.value;
                _this.renderSelectPage();
            });
            //点击添加项目按钮弹出窗口
            $('#addProject').off('click').on('click', function () {
                var wh = $(window).height();
                var top = (wh - 700) / 2;
                $("#addGroupPage .modal-dialog").css({
                    'top': top
                });
                $('#addGroupPage').modal();
                $('#addImg').hide();
                $('#codeName,#nameEnglish,#nameCN').val('') 
                $('#saveProject').off('click').on('click', function () {
                    var postData = {};
                    postData.code_name = $('#codeName').val();
                    postData.name_en = $('#nameEnglish').val();
                    postData.name_cn = $('#nameCN').val();
                    WebAPI.post('/admin/createManagement', postData).done(function (result) {                      
                        if (result.success) {
                            var newProject = {
                                    'id': result.data,
                                    'name_cn': postData.name_cn,
                                    'name_en': postData.name_en,
                                    'projectList': []
                                };
                            $('#projectCon').append(beopTmpl('tpl_group_manage', {
                                project: newProject
                            }));
                            _this.pageViewModel.push(newProject);
                            _this.renderProjectSelector(_this.pageViewModel);
                            _this.attachEvent();
                            I18n.fillArea($(ElScreenContainer));
                            $('#addGroupPage').modal('hide');
                            var formData = new FormData();
                            var reader = new FileReader();
                            var path = window.URL.createObjectURL(_this.uploadFile);                           
                            var fileName = _this.clickProject.id + '_logo.png';
                            formData.append('name', fileName);                           
                            formData.append('file', _this.uploadFile);
                            _this.syncUpload(formData).then(function(){
                                $('#resetImg').attr('src', 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/management/' + fileName);
                            },function(){
                                alert('图片上传失败!');
                            });
                            reader.readAsBinaryString(_this.uploadFile);                            
                        }
                    });
                })
            });

            //点击配置项目按钮弹出窗口
            $('.config-btn').off('click').on('click',function(){
                var wh = $(window).height();
                var top = (wh - 700) / 2;
                $("#updateGroupPage .modal-dialog").css({'top': top});                   
                $('#updateGroupPage').modal();
                _this.clickProject = _this.getProjectById($(this).attr('data-project-id'));
                var postData = {
                    'id': _this.clickProject.id,
                    'name_en': _this.clickProject.name_en,
                    'name_cn': _this.clickProject.name_cn,
                    'code_name': _this.clickProject.code_name
                }
                $('#change_codeName').val(_this.clickProject.code_name);
                $('#change_nameEnglish').val(_this.clickProject.name_en);
                $('#change_nameCN').val(_this.clickProject.name_cn);
                var resetImage = new Image();
                var imgUrl = 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/management/' + _this.clickProject.id + '_logo.png';
                resetImage.src = imgUrl;
                resetImage.onload = function(){
                    $('#resetImg').show().attr('src',imgUrl);
                }
                resetImage.onerror = function(){
                    $('#resetImg').hide();
                }                 
                $('#updateProject').off('click').on('click',function(){
                    postData.code_name = $('#change_codeName').val();
                    postData.name_en = $('#change_nameEnglish').val();
                    postData.name_cn = $('#change_nameCN').val();
                    WebAPI.post('/admin/updateManagement', postData).done(function (result) {                       
                        if (result.success) {
                            var strHtml = beopTmpl('tpl_group_manage', {
                                project: {
                                    'id': postData.id,
                                    'name_cn': postData.name_cn,
                                    'name_en': postData.name_en,
                                    'projectList': _this.clickProject.projectList
                                }
                            });
                            $('[id='+postData.id+']').empty().html($(strHtml).children());
                            I18n.fillArea($(ElScreenContainer));
                            $('#updateGroupPage').modal('hide');
                            _this.attachEvent();                         
                        }
                    });                    
                })
            });
            //绑定项目
            $('.bindProject').off('click').on('click', function (e) {
                $bindId = $(e.currentTarget).attr('data-roleid');
                $('#bindProject').modal();
                _this.loadProjectPermission();
                $('#sucBindProject').off('click').on('click', function () {
                    WebAPI.post('/admin/bindManagement/' + $bindId, _this.bindProject).done(function (result) {
                        if (result.success) {
                            $('#bindProject').hide();
                            _this.loadGroupPermission().done(function(result){
                                _this.pageViewModel = result.data;
                                $('#projectCon').find('[id=' + $bindId + ']').remove();
                                $('#projectCon').append(beopTmpl('tpl_group_manage', {
                                    project: _this.getProjectById($bindId)
                                }));
                                _this.attachEvent();
                                I18n.fillArea($(ElScreenContainer));
                            })
                        } else {
                            alert('绑定失败!');
                        }
                    });
                });
            });

            //删除项目
            $('.delProject').off('click').on('click',function(){
                var delId = $(this).attr('data-projectid');
                infoBox.confirm('是否删除项目',function(){
                    WebAPI.post('/admin/delManagement',[delId]).done(function (result) {
                        if (result.success) {
                            $('[id = '+delId+']').remove();
                            _this.removeProjectById(delId);
                            _this.renderProjectSelector(_this.pageViewModel);
                            alert('删除成功')
                        } else {
                            alert('删除失败!');
                        }
                    }); 
                });               
            });
            $('.proUser').off('mouseover').on('mouseover',function(){
                $(this).find(".closed").show();
            }).on('mouseout',function(){
                 $(this).find(".closed").hide();
            }).on('click','.closed',function(){
                var $this = $(this);
                var psData = {};
                var deleteUserId = $this.attr('userId');
                WebAPI.post('/admin/unbindManagement', [deleteUserId]).done(function (result) {
                    console.log(result);
                    if (result.success) {
                        $this.parent().parent().remove();
                    }
                });                
            });
            //添加项目上传图片
            $('#newImg').off('click').on('click',function(){
                $('#newImgUpload').click();                
            });
            $('#newImgUpload').on('change',function(e){
                var fileList = e.target.files || e.dataTransfer.files;
                _this.uploadFile = fileList[0];
                var path = window.URL.createObjectURL(_this.uploadFile);
                $('#addImg').show().attr('src',path);                                
            })            
            //配置项目上传图片
            $('#setImg').off('click').on('click',function(){
                $('#fileUpload').click();                
            });
            $('#fileUpload').on('change',function(e){
                var fileList = e.target.files || e.dataTransfer.files;
                _this.uploadFile = fileList[0];
                var formData = new FormData();
                var reader = new FileReader();
                var fileName = _this.clickProject.id + '_logo.png';
                formData.append('name', fileName); 
                formData.append('file', fileList[0]);
                var path = window.URL.createObjectURL(_this.uploadFile);
                $('#resetImg').show().attr('src', path); 
                _this.syncUpload(formData).then(function(){                    
                },function(){
                    alert('upload failed!');
                });
                reader.readAsBinaryString(fileList[0]);                                    
            });
        },
        syncUpload: function (fromData) {
            return $.ajax({
                type: 'POST',
                url: '/admin/management/file/upload',
                data: fromData,
                cache: false,
                processData: false,
                contentType: false,
            });
        },
        getProjectById: function (projectId) {
            for (var m = 0; m < this.pageViewModel.length; m++) {
                if (this.pageViewModel[m].id == projectId) {
                    return this.pageViewModel[m];
                }
            }
        },
        removeProjectById: function(projectId){
            for (var m = 0; m < this.pageViewModel.length; m++) {
                if (this.pageViewModel[m].id == projectId) {
                    this.pageViewModel.splice(m,1);
                }
            }            
        },
        renderSelectPage: function () {
            if (!this.currentProjectId) {
                this.renderAllPage();
                this.currentProjectId = this.pageViewModel[0].id;
            } else if (this.currentProjectId == 'all') {
                this.renderAllPage();
            } else {
                this.renderPage(this.getProjectById(this.currentProjectId));
            }

            this.attachEvent();
            I18n.fillArea($(ElScreenContainer));
        },
        //渲染选中项目
        renderPage: function (project) {
            if (!project) {
                alert('can\'t find this project');
                return;
            }
            $('#projectCon').html(beopTmpl('tpl_group_manage', {
                project: project
            }));
            I18n.fillArea($('#permissionManage'));
        },
        //渲染所有项目
        renderAllPage: function () {
            var $projectContent = $('#projectCon').empty();
            for (var m = 0, mLen = this.pageViewModel.length; m < mLen; m++) {
                $projectContent.append(beopTmpl('tpl_group_manage', {
                    project: this.pageViewModel[m]
                }))
            }
            I18n.fillArea($('#permissionManage'));
        }
    }
    return GroupProjectManager;
})();
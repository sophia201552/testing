var DocumentScreen = (function () {
    var _this;

    function DocumentScreen() {
        _this = this;
        this.container = $('#divScreenContainer');
        var $documentScreenMainFiles;
        this.selectNode = [];
        this.allNode = [];
        this.level = 0;
        this.back = 0;
        this.type = 0;
        this.availableSpace = undefined;

        this.typeIcon = {
            '1': {
                "type": ['', null],
                cls: 'iconfont icon-iconfont90'
            },
            '2': {
                "type": ['jpg', 'png', 'bmp'],
                cls: 'glyphicon glyphicon-picture'
            },
            '3': {
                "type": ['doc', 'docx', 'pdf'],
                cls: 'iconfont icon-nav-1071'
            },
            '4': {
                "type": ['xls', 'xlsx', 'csv'],
                cls: 'iconfont icon-excel'
            },
            '5': {
                "type": ['dwg'],
                cls: 'iconfont icon-wanggexian'
            }
        };
    }
    DocumentScreen.prototype = {
        show: function () {
            this.init();
        },
        init: function () {
            WebAPI.get('static/app/fileManagement/views/documentScreen.html').done(function (result) {
                _this.container.html(result);
                _this.initFileList();
                _this.toolInit();
                _this.initProgress();
            });

        },
        initFileList: function (psData) {
            Spinner.spin(document.body);
            if (!psData) {
                psData = {
                    "keyword": '',
                    "type": _this.type,
                    "id": _this.level,
                    "projectId": AppConfig.projectId
                };
            }
            this.type = psData.type;
            return WebAPI.post('/fileManager/filter', psData).done(function (result) {
                if (!result.data) return;
                _this.container.find('.documentScreenMainFiles').html('');
                _this.level = psData.id;
                _this.allNode = result.data;
                _this.selectNode = [];
                for (var i = 0; i < _this.allNode.length; i++) {
                    _this.renderFiles(_this.allNode[i]);
                }

            }).always(function () {
                Spinner.stop();
            });
        },
        renderFiles: function (points) {
            var fileHtml = '',
                fileData = '';
            fileHtml = `<div class="documentScreenRow" data-id="{id}">
                <div class="fileCheckbox">
                    <label>
                <input class="selectCheck" type="checkbox" value="option1" aria-label="...">
                </label>
                </div>
                <div class="fileText" data-type="{dataType}">
                    <span class="{type}"></span>
                    <span class="spanFileName fileName">{name}</span>
                    <span class="preImg" style="display:none;"><img src={proImg}></span>
                </div>
                <div class="fileEditor">
                    <span>{user}</span>
                </div>
                <div class="fileSize">
                    <span>{size}</span>
                </div>
                <div class="fileUpdated">
                    <span>{time}</span>
                </div>
                <a></a>
            </div>`;
            var newFile = !points;
            var typeIcon = this.getTypeIcon(points.type);

            fileData += (fileHtml.formatEL({
                id: points.id,
                type: typeIcon,
                name: points.name, 
                dataType: points.type,
                proImg: 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/'+points.path,              
                user: points.user,
                size: _this.bytesToSize(points.size),
                time: points.time
            }));
            var fileListChild = $(fileData);
            this.container.find('.documentScreenMainFiles').append(fileListChild);

            // (function (points) {
            fileListChild.off('click').on('click', function () {
                $(this).find('.selectCheck').prop("checked", true);
                $(this).addClass('active');
                if (_this.selectNode.indexOf(points) > -1) {
                    for (var i = 0; i < _this.selectNode.length; i++) {
                        if (_this.selectNode[i].id == points.id) {
                            _this.selectNode.splice(i, 1);
                            $(this).find('.selectCheck').prop("checked", false);
                            $(this).removeClass('active');
                            $('#CheckboxAll').prop("checked", false);
                            break;
                        }
                    }
                } else {
                    _this.selectNode.push(points);
                    if (_this.selectNode.length == _this.allNode.length) {
                        $('#CheckboxAll').prop("checked", true);
                    }
                }

            }).on('mousemove', '.fileText', function () {
                var dataType = $(this).attr('data-type');
                if(_this.typeIcon['2'].type.indexOf(dataType) > -1){
                    $(this).find('.preImg').show().css({
                        'left': $(this).find('.spanFileName').width() + 80 + 'px'
                    });
                }
            }).on('mouseout', '.fileText', function () {
                $(this).find('.preImg').hide();
            });

            fileListChild.off('dblclick').on('dblclick', function (e) {
                var psData = {
                    "keyword": '',
                    "type": 0,
                    "id": $(e.currentTarget).attr('data-id'),
                    "projectId": AppConfig.projectId
                };
                WebAPI.post('/fileManager/filter', psData).done(function (result) {
                    if (result.data && points.type == null) {
                        _this.container.find('.documentScreenMainFiles').html('');
                        _this.container.find('.documentScreenBreadNavUl').append('<li class="text-muted" backId="' + points.id + '"><span>></span><span>' + points.name + '</span></li>');
                        _this.level = psData.id;
                        _this.allNode = result.data;
                        _this.selectNode = [];
                        for (var i = 0; i < _this.allNode.length; i++) {
                            _this.renderFiles(_this.allNode[i]);
                        }
                    }

                });
            });
            fileListChild.off('click', '.fileName').on('click', '.fileName', function (e) {
                e.stopPropagation();
                var fileName = $(this);
                var inputName = document.createElement('input');
                inputName.className = 'ipChangeName';
                fileName.hide();
                this.parentNode.appendChild(inputName);
                inputName.onfocus = function () {
                    this.value = fileName.text();
                }
                inputName.focus();
                inputName.onblur = function () {
                    var lstName;
                    var type = points.type == null ? '' : '.' + points.type;
                    if (this.value.indexOf(points.type) > -1) {
                        lstName = this.value;
                    } else {
                        lstName = this.value + type;
                    }
                    if (fileName.text() != this.value) {
                        var postData = {
                            'id': points.id,
                            'name': lstName
                        };
                        points.name = lstName;
                        fileName.text(lstName);
                        WebAPI.post('/fileManager/renameFile', postData).done(function (result) {
                            console.log(result);
                        });
                    }
                    this.parentNode.removeChild(this);
                    fileName.show();
                }
                $(this).removeClass('fileName');
            });
            fileListChild.find('.fileName').removeClass('fileName');

            //名字处于可编辑状态
            if (points.isNew) {
                fileListChild.find('.fileName').trigger('click');
            }
        },
        getTypeIcon: function (type) {
            for (var key in this.typeIcon) {
                if (this.typeIcon[key].type.indexOf(type) > -1) {
                    return this.typeIcon[key].cls;
                }
            }
            return;
        },
        toolInit: function () {
            this.container.find('#createFolder').off('click').on('click', function (e) {
                var points = {
                    "id": "",
                    "name": "New Folder",
                    "parent": null,
                    "path": null,
                    "size": "",
                    "time": new Date().format("yyyy-MM-dd HH:mm:ss"),
                    "type": null,
                    "user": AppConfig.userProfile.fullname,
                    "userId": AppConfig.userId,
                    "isNew": true
                }
                _this.createFolder(e).done(function (result) {
                    points.id = result.data.id;
                    _this.renderFiles(points);
                });
            });
            this.container.find('#btnUpload').off('click').on('click', function () {
                $('#fileUpload').click();
            });
            this.container.find('#btnDownload').off('click').on('click', function () {
                _this.downloadFile();
            });
            this.container.find('#btnDelte').off('click').on('click', function () {
                _this.deleteFile();
            });
            this.container.find('#btnRename').off('click').on('click', function () {
                _this.renameFiles();
            });
            this.container.find('#btnMoveto').off('click').on('click', function () {
                _this.moveFile();
            });
            this.container.find('#btnFilter').off('click').on('click', function () {
                _this.filterFile();
            })
            $('#fileUpload').on('change', function (e) {
                _this.upLoadFiles(e);
            });
            $('#allFiles').off('click').on('click', function () {
                _this.level = 0;
                _this.initFileList();
                $('.text-muted').remove();
            });
            $('#inputFilter').keyup(function (e) {
                if (13 === e.keyCode || 8 === e.keyCode) {
                    _this.filterFile();
                }
            });
            $('.backBtn').off('click').on('click', function () {
                var backId = $('.documentScreenBreadNavUl li').eq(-2).attr('backId');
                var psData = {
                    "keyword": '',
                    "type": _this.type,
                    "id": backId,
                    "projectId": AppConfig.projectId
                };
                _this.initFileList(psData).done(function (result) {
                    if (!result.data || result.data.length == 0) return;
                    if (backId != undefined) {
                        $('.documentScreenBreadNavUl li').eq(-1).remove();
                    }
                });
            })
            $('#CheckboxAll').off('click').on('click', function () {
                var arrId = $('.documentScreenRow');
                if (this.checked) {
                    _this.selectNode = _this.allNode;
                    arrId.find('.selectCheck').prop('checked', true);
                    $('.documentScreenRow').addClass('active');
                } else {
                    _this.selectNode = [];
                    arrId.find('.selectCheck').prop('checked', false);
                    $('.documentScreenRow').removeClass('active');
                }

                for (var i = 0; i < arrId.length; i++) {
                    var pId = $(arrId[i]).attr('data-id');
                    //_this.selectNode.push(pId);
                }
            })
        },
        renameFiles: function () {
            if (!this.selectNode.length) return;
            $('[data-id=' + _this.selectNode[_this.selectNode.length - 1].id + '] .spanFileName').addClass('fileName').trigger('click');
        },
        filterFile: function () {
            var keyword = $("#inputFilter").val();
            var psData = {
                "keyword": keyword,
                "type": 0,
                "id": 0,
                "projectId": AppConfig.projectId
            }
            this.initFileList(psData);
        },
        downloadFile: function () {
            if(_this.selectNode.length < 1){
                alert('Please select the file');
                return ;
            }else{
                for (var i = 0; i < _this.selectNode.length; i++) {
                    var element = _this.selectNode[i];
                    if (_this.selectNode[i].type == null) {
                        alert('The download folder is not supported');
                        return;
                    } 
                }

/*                if(_this.selectNode.length == 1){
                    window.open('/fileManager/download/' + AppConfig.projectId + '/' + element.id, "_blank");
                }else{*/
                var postData = {
                        "projId":AppConfig.projectId,
                        "idList":[],
                        "nameList":[],
                        "typeList":[]
                }
                _this.selectNode.forEach(function(element){
                    postData.idList.push(element.id);
                    postData.nameList.push(element.name);
                    postData.typeList.push(element.type);
                })
            
                var xhr;
/*                    var formData = new FormData();
                formData.append('projId', AppConfig.projectId);
                formData.append('nameList', postData.nameList);
                formData.append('typeList', postData.typeList);
                formData.append('idList', postData.idList);*/
                xhr = new XMLHttpRequest();                
                xhr.responseType = 'arraybuffer';
                xhr.open('POST', '/fileManager/downloadFiles/');
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = function () {
                    var blob, url;
                    if (this.status === 200) {
                        blob = new Blob([xhr.response], {type: "application/x-zip-compressed"});
                        fileName = _this.selectNode.length == 1 ? element.name.split('.')[0] : 'shared_files';
                        downFile(blob,fileName);
                        WebAPI.get('/fileManager/clean/'+AppConfig.projectId);
                    } else {
                        alert('Generate report failed, please try it again soon!');
                    }
                    Spinner.stop();
                };
                xhr.send(JSON.stringify(postData));
            }                     

            function downFile(blob,fName) {
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob);
                } else {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            }                    
             
        },
        upLoadFiles: function (e) {
            var fileList = e.target.files || e.dataTransfer.files;
            var filesName = [];
            for (var i = 0; i < fileList.length; i++) {
                var file = fileList[i];
                if (file.size > _this.availableSpace) {
                    alert('存储空间不足');
                    return;
                };
                (function (file) {
                    var reader = new FileReader();
                    var formData = new FormData();
                    formData.append('file', file);
                    $.ajax({
                        type: 'POST',
                        url: '/fileManager/uploadFile/' + AppConfig.projectId + '/' + AppConfig.userId + '/' + file.name + '/' + _this.level,
                        data: formData,
                        cache: false,
                        processData: false,
                        contentType: false,
                        success: function (result) {
                            if (!result.data) return;
                            var _id = result.data.id;
                            _this.renderFiles({
                                "id": _id,
                                "type": file.name.split('.')[1],
                                "name": file.name,
                                "size": file.size,
                                "user": AppConfig.userProfile.fullname,
                                "time": file.lastModifiedDate.format("yyyy-MM-dd HH:mm:ss")
                            });
                            _this.initProgress();
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    });
                    reader.onerror = function () {
                        alert('upload failed');
                    }
                    filesName.push(file.name);
                    reader.readAsBinaryString(file);
                })(file);
            }
        },
        createFolder: function (e) {
            var postData = {
                "name": "New Folder",
                "parent": this.level,
                "userId": AppConfig.userId,
                "user": AppConfig.userId,
                "time": new Date().format("yyyy-MM-dd HH:mm:ss"),
                "projectId": AppConfig.projectId
            }
            return WebAPI.post('/fileManager/createFolder', postData);
        },
        deleteFile: function () {
            var arr = []
            for (var i = 0; i < this.selectNode.length; i++) {
                arr.push(this.selectNode[i].id);
            }
            var postData = {
                'arrId': arr
            }
            WebAPI.post('/fileManager/removeFiles', postData).done(function (result) {
                if (result.data) {
                    _this.selectNode.forEach(function (ele) {
                        $('[data-id=' + ele.id + ']').remove();
                    });
                    _this.selectNode = [];
                    _this.initProgress();
                }
            });
        },
        moveFile: function (id) {
            var parentId, zNodes = [];
            var tpl = '<div class="modal" id="moveFiles">\
                <div class="modal-dialog">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <button type="button" class="close" id="btnCloseMove" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>\
                            <h4 class="modal-title">Move to</h4>\
                        </div>\
                        <div class="modal-body" id="formWrap">\
                            <div class="form-horizontal ztree" id="treeDemo" >\
                            </div>\
                        </div>\
                        <div class="modal-footer">\
                        <div style="float:left">\
                    </div>\
                    <div class="btn btn-default documentToolBtn" id="createTreeFolder" style="display:none">\
                <span>New folder</span> \
                     </div>\
                    <div style="float:right">\
                    <button id="btnCanel" class="btn btn-default">Cancel</button>\
                    <button id="btnOk" class="btn btn-success">Ok</button> \
                    </div>\
                        </div>\
                    </div>\
                </div>\
            </div>';
            $('body').append(tpl);
            var setting = {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: onClick
                }
            };
            var clickId, parentFlag;
            var psData = {
                "keyword": '',
                "type": 0,
                "id": 0,
                "projectId": AppConfig.projectId
            };
            WebAPI.post('/fileManager/filter', psData).done(function (result) {
                if (!result.data) return;
                var points = result.data;
                for (var i = 0; i < points.length; i++) {
                    parentFlag = points[i].type == null ? true : false;
                    if (parentFlag) {
                        zNodes.push({
                            id: points[i].id,
                            pId: points[i].parent,
                            name: points[i].name,
                            isParent: parentFlag,
                            open: false
                        });
                    }
                }
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            });

            function onClick(event, treeId, treeNode, clickFlag) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                console.log(treeNode.id);
                parentId = treeNode.id;
                psData.id = clickId = treeNode.id;
                WebAPI.post('/fileManager/filter', psData).done(function (result) {
                    nodes = zTree.getSelectedNodes();
                    treeNode = nodes[0];
                    var points = result.data;
                    for (var i = 0; i < points.length; i++) {
                        parentFlag = points[i].type == null ? true : false;
                        if (treeNode && parentFlag) {
                            zTree.addNodes(treeNode, {
                                id: points[i].id,
                                pId: treeNode.id,
                                isParent: parentFlag,
                                name: points[i].name
                            });
                        }
                    }
                });
            }
            $('#btnOk').off('click').on('click', function () {
                var moveFileId = [];
                _this.selectNode.forEach(function (ele, index) {
                    moveFileId.push(ele.id);
                });
                var postData = {
                    "id": moveFileId,
                    "parent": clickId
                }
                WebAPI.post('/fileManager/moveFile', postData).done(function (result) {
                    if (result && result.data) {
                        _this.selectNode.forEach(function (ele, index) {
                            $('[data-id=' + ele.id + ']').remove();
                        });
                        $('#btnCanel,#btnCloseMove').trigger('click');
                        alert('Move successfully');
                    } else {
                        alert('Move failed')
                    }
                });
            });
            $('#btnCanel,#btnCloseMove').off('click').on('click', {
                isParent: true
            }, function () {
                $('#moveFiles').remove();
            });
            $('#createTreeFolder').bind('click', {
                isParent: true
            }, function (e) {
                _this.createFolder().done(function (result) {
                    var points = {
                        "id": result.data.id,
                        "name": "New Folder",
                        "parent": null,
                        "path": null,
                        "size": "",
                        "time": new Date().format("yyyy-MM-dd HH:mm:ss"),
                        "type": null,
                        "user": AppConfig.userId,
                        "userId": AppConfig.userId,
                    }
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                        isParent = e.data.isParent,
                        nodes = zTree.getSelectedNodes(),
                        treeNode = nodes[0];
                    if (treeNode) {
                        treeNode = zTree.addNodes(treeNode, {
                            id: result.data.id,
                            pId: treeNode.id,
                            isParent: isParent,
                            name: "New Folder" 
                        });
                    } else {
                        treeNode = zTree.addNodes(null, {
                            id: result.data.id,
                            pId: 0,
                            isParent: isParent,
                            name: "New Folder"
                        });
                    }
                    if (treeNode) {
                        zTree.editName(treeNode[0]);
                    } else {
                        alert("叶子节点被锁定，无法增加子节点");
                    }
                    _this.initFileList();
                }).always(function(){
                    
                });
            })
        },
        bytesToSize: function (bytes) {
            if (bytes == null || bytes === "") return '-';
            if (bytes == 0) return 0;
            var k = 1024;
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        initProgress: function () {
            WebAPI.get('/fileManager/info/' + AppConfig.projectId).done(function (result) {
                if (result.data == null) return;
                var useSize;
                _this.availableSpace = result.data.available;
                if (result.data.available < 0) {
                    useSize = result.data.all;
                } else {
                    useSize = result.data.all - result.data.available;
                }
                _this.progressBar(useSize, result.data.all);
            });
        },
        progressBar: function (Size, allSize) {
            var $progressBar = $('#progressBar');
            var $progressNum = $('#progressNum');
            var barWidth = parseInt(Size / allSize * 100);
            $progressBar.animate({
                width: barWidth + "%"
            })
            $progressNum.html(_this.bytesToSize(Size) + '/' + _this.bytesToSize(allSize));
        },
        close: function () {

        }
    }
    return DocumentScreen;
})();
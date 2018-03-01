;(function (exports, SuperClass) {
    var clickTimer = null;
    var CLICK_DELAY = 500;
    function ImageTab() {
        SuperClass.apply(this, arguments);
    }

    ImageTab.prototype = Object.create(SuperClass.prototype);
    ImageTab.prototype.constructor = ImageTab;

    +function () {

        this.imgFileCellTpl = '<div class="formSingle clearfix">\
                        <div class="imgCheck col-sm-2">\
                            <div class="imgCheckBox"><img id="{id}" src="{src}"/></div>\
                        </div>\
                        <div class="imgInfos col-sm-9">\
                            <div class="form-group">\
                                <label for="inputName" class="col-sm-1 control-label">Name:</label>\
                                <div class="col-sm-11">\
                                    <input type="text" class="form-control" id="inputName_{i}" placeholder="Name" value="{name}">\
                                </div>\
                            </div><div class="form-group" type="{type}">\
                                <label class="col-sm-1 control-label">Type:</label>\
                                <label class="radio-inline radio-inline_{i}">\
                                    <input type="radio" name="inlineRadioOptions_{i}" id="inlineRadio1_{i}" value="option1" > static\
                                </label>\
                                <label class="radio-inline radio-inline_{i} ">\
                                    <input type="radio" name="inlineRadioOptions_{i}" id="inlineRadio2_{i}" class="inlineRadio" value="option2"> animation\
                                </label>\
                            </div>\
                            <div id="radioAnimation_{i}" class="clearfix radioAnimation">\
                                <div class="form-group animationInfo">\
                                    <label for="inputWidth" class="col-sm-3 control-label">Frame:</label><div class="col-sm-8">\
                                        <input type="text" class="form-control" id="inputFrame_{i}" placeholder="Frame" value="{pf}">\
                                    </div><span></span>\
                                </div>\
                                <div class="form-group animationInfo">\
                                    <label for="inputInterval" class="col-sm-3 control-label">Interval:</label><div class="col-sm-8">\
                                        <input type="text" class="form-control" id="inputInterval_{i}" placeholder="Interval" value="{interval}">\
                                    </div><span>ms</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>';
        /** @override */
        this.groupItemGroup = '<div class="tpl-item group-item pageBox groupPhotoItem" draggable="true" id="{_id}" data-id="{_id}" data-type="image" data-groupid ="{group}">\
        <div class="pageName"><span class="glyphicon glyphicon-folder-close"></span><span class="item-name">{name}</span></div>\
        <div class="pageCreator"><span class="pageText">{creator}</span></div>\
        <div class="pageTime"><span class="pageText">{time}</span></div>\
        <span class="slider-cb-wrap"><i class="slider-cb"></i></span></div>';
		this.upGroup = '<div class="tpl-item upGroup pageBox groupPhotoItem" data-type="{type}" data-id="{_id}" data-groupid ="{group}"  data-parent-group-id="{parentGroupId}"><span class="glyphicon glyphicon-chevron-left"></span>\
                    <span class="group-item-name" title="...">...</span></div>';
        this.tabOptions = {
            title:'<div class="divTab"><span class="glyphicon glyphicon-picture"></span>Image</div><ul id="treeImageTemplate" class="ztree treeTemplate" style="display: none;"></ul>',
            itemTpl:'<div class="{classAll}" id="{id}" data-id="{_id}" draggable="true" data-type="image" data-groupid ="{group}" data-creator="{creator}"><span class="animFlag"></span>\
                    <div class="thumbnail"><div draggable="false" id="inner-{id}" data_interval="{interval}" data_pf="{pf}" class="bgImg"></div>\
                    <span class="slider-cb-wrap"><i class="slider-cb"></i></span>\
                    <div class="caption"><h3 class="imgName">{title}</h3><h3 class="imgSize">{w}*{h}</h3></div></div></div>',
            toolsTpl: '<div class="paneTempButton">\
                    <div class="addTempate" title="Uploading"><span class="glyphicon glyphicon-upload"></span></div>\
                    <div class="addGroup" title="Add Folder"><span class="glyphicon glyphicon-folder-open"></span></div>\
                    <div class="divEdit" title="Edit" style="display:none;"><span class="glyphicon glyphicon-edit"></span></div>\
                    <div class="divDelete" title="Remove" style="display: none;"><span class="glyphicon glyphicon-trash"></span></div>\
                    <div class="col-sm-4 divSearch"><div class="input-group"><input type="text" class="form-control iptSearch" placeholder="Search for name!"><span class="spanSearch"><span class="glyphicon glyphicon-search" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true" style="display:none;"></span></span></div></div>\
                    <input type="file" value="Select image" class="fileUpload" id="fileUpload" multiple="multiple" style="display:none;">\
                </div>',
            dataUrl: 'factory/material/group/image'
        };

        /** @override */
        this.attachEvents = function () {
            var _this = this;
            var $tabName = $('#tabName', this.domWrap);
            var $tabContent = $('#tabContent', this.domWrap);
            var $templateLeft = $('#templateLeft', this.domWrap);
            $tabContent.off('dblclick','.group-item').on('dblclick','.group-item',function(){
                _this.slider(this);
            });
            $tabContent.off('dragstart', '.tpl-item').on('dragstart', '.tpl-item', _this.drag().start);
            $tabContent.off('dragend', '.tpl-item').on('dragend', '.tpl-item', _this.drag().end);
            $tabContent.off('dragover', '.tpl-item.group-item,.tpl-item.upGroup').on('dragover', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().over);
            $templateLeft.off('dragover','#treeImageTemplate li a').on('dragover','#treeImageTemplate li a', _this.drog().over);
            $tabContent.off('dragenter', '.tpl-item.group-item,.tpl-item.upGroup').on('dragenter', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().enter);
            $templateLeft.off('dragenter','#treeImageTemplate li a').on('dragenter','#treeImageTemplate li a', _this.drog().enter);
            $tabContent.off('dragleave', '.tpl-item').on('dragleave', '.tpl-item', _this.drag().leave);
            $templateLeft.off('dragleave','#treeImageTemplate li a').on('dragleave','#treeImageTemplate li a', _this.drog().leave);
            $tabContent.off('drop', '.tpl-item.group-item,.tpl-item.upGroup').on('drop', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().drop);
            $templateLeft.off('drop','#treeImageTemplate li a').on('drop','#treeImageTemplate li a', _this.drog().drop);
            //鼠标滑过  动画有预览的动画效果
            //var animation;
            //$tabContent.off('mouseenter', '.photoItem').on('mouseenter', '.photoItem', function (e) {
            //    var _this = this;
            //    var w = $(this).find(".bgImg").width();
            //    var interval = Number($(this).find(".bgImg").attr("data_interval"));
            //    var pf = Number($(this).find(".bgImg").attr("data_pf"));
            //
            //    if(interval!== 0){
            //        animation = setInterval(autoplay,interval);
            //        var i=0;
            //        function autoplay(){
            //            if(i===pf){
            //                i=-1;
            //            }
            //            i=i+1;
            //            var position = -w*i;
            //            if(position<-w*(pf-1)){
            //                autoplay()
            //            }else{
            //                $(_this).find(".bgImg").css("background-position",position+"px");
            //            }
            //        }
            //    }
            //});
            //$tabContent.off('mouseleave', '.photoItem').on('mouseleave', '.photoItem', function (e) {
            //    var interval = Number($(this).find(".bgImg").attr("data_interval"));
            //    if(interval!== 0){
            //        $(this).find(".bgImg").css("background-position","0");
            //        clearInterval(animation);
            //    }
            //});
            // 使用图片
            if (this.options.allowUse) {
                $tabContent.off('dblclick', '.photoItem').on('dblclick', '.photoItem', function (e) {
                    var id = this.dataset.id;
                    var data = {ids:[id]};
                    WebAPI.post('/factory/material/getByIds',data).done(function(result){
                        if(result[0].content.w<0 || result[0].content.h<0){
                            var dblImg = $('#'+result[0]._id)[0];
                            result[0].content.w = dblImg.naturalWidth;
                            result[0].content.h = dblImg.naturalHeight;
                        }
                        typeof _this.options.callback === 'function' &&
                        _this.options.callback( $.extend(false, {_id: result[0]._id}, result[0].content) );
                        _this.screen.close();
                    });
                });
            }else{
                $tabContent.off('dblclick','.photoItem').on('dblclick','.photoItem',function(){
                    editImage();
                })
            };
            //新增文件夹
            $tabName.find('.addGroup').off('click').click(function(){
                _this.addGroupItem();
            });
            $tabContent.off('click','.pageBox .pageName').on('click', '.pageBox .pageName', function (e) {
                //e.stopPropagation();
                var $this = $(this);
                var ipt;
                var $item = $this.parent('.tpl-item');

                if (!$item.hasClass('active')){
                    clickTimer = window.setTimeout(function () {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                    }, CLICK_DELAY);
                    return;
                }
                if (clickTimer) {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    if($item.hasClass('group-item')){
                        _this.slider($item[0]);
                    }
                    return;
                }

                if($item.attr('id') != ''){
                    if(typeof _this.permission($item) === 'string'){
                        alert(_this.permission($item));
                        return;
                    }
                }
                clickTimer = window.setTimeout(function () {
                    // 重命名
                    var $spName = $this.find('.item-name');
                    // rename 逻辑
                    ipt = document.createElement('input');
                    ipt.className = 'ipt-name-editor';
                    ipt.value = $spName.text();
                    ipt.onblur = function () {
                        $tabContent.on('dblclick','.group-item',function(){
                            _this.slider(this);
                        });
                        $tabContent.find('.tpl-item').prop('draggable',true);
                        var params = {};
                        // 如果名称有变动，或者是第一次新建，则进行更新
                        if (this.value !== $spName.text() ||
                            !$this.closest('.pageBox')[0].dataset.id) {
                            params = {
                                _id: $this.closest('.pageBox')[0].dataset.id,
                                name: this.value,
                                type: 'image'
                            };
                            _this.modifyGroupItem(params);
                            $this.closest('.pageBox').attr('id',params._id);
                            $this.closest('.pageBox')[0].dataset.id = params._id;
                            $this.closest('.pageBox')[0].dataset.groupid = params.group;
                        }
                        $spName.text(this.value);
                        this.parentNode.removeChild(this);
                        $spName.show();
                    };
                    ipt.onkeyup = function (e) {
                        if (e.which === 13) {
                            this.blur();
                        }
                    };
                    ipt.onclick = function (e) {
                        e.stopPropagation();
                    };

                    $spName.hide();
                    $this.append(ipt);
                    ipt.onfocus = function(){
                        $tabContent.off('dblclick','.group-item');
                        $tabContent.find('.tpl-item').prop('draggable',false);
                    };
                    ipt.focus();

                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                }, CLICK_DELAY);
            });
            $tabName.children('.paneTempButton').on('click','.addTempate',function(){
                $('#fileUpload').click();
            });
            $('#fileUpload').change(function (e) {
                var imgCheck = e.target.files || e.dataTransfer.files;
                var imgStandardArr = filterImg(imgCheck);
                var $imgFilterBox = $('#imgFilterBox',$(_this.domWrap).parent().find('#formModal'));
                $imgFilterBox.children().remove();
                //为每个图片添加索引
                for (var i = 0, file; file = imgStandardArr[i]; i++) {
                    file.index = i;
                }
                readImage(imgStandardArr);
            });
            //编辑公共素材
            $tabName.children('.paneTempButton').on('click','.divEdit',function () {
                editImage();
            });
            function editImage(){                
                var $tabContent = $('#tabContent', this.domWrap);
                var $active = $tabContent.find('.active');
                if(typeof _this.permission($active) === 'object'){
                    $("#imgFilterBox",$(_this.domWrap).parent().find('#formModal')).html("");
                    var pubMate = {'ids':[],'paths':[],'names':[],'types':[],'intervals':[],"pfs":[]};
                    for (var j = 0,len=$active.length; j < len; j++) {
                        var itemId = $active.eq(j).find(".photoLoad").attr('id').split('-')[1];
                        var itemPath = $active.eq(j).find(".photoLoad").css('background-image').slice(5,-2);
                        var itemInterval = $active.eq(j).find(".photoLoad").attr("data_interval");
                        var itemPf = $active.eq(j).find(".photoLoad").attr("data_pf");
                        var itemName = $active.eq(j).find(".imgName").html();
                        var itemType = $active.eq(j).find(".animFlag").text();
                        if(itemType != "animation"){
                            itemType = "static";
                        }
                        pubMate.ids.push(itemId);
                        pubMate.paths.push(itemPath);
                        pubMate.names.push(itemName);
                        pubMate.types.push(itemType);
                        pubMate.intervals.push(itemInterval);
                        pubMate.pfs.push(itemPf);
                    }
                    for(var i=0,len=pubMate.paths.length;i<len;i++){
                        $("#imgFilterBox",$(_this.domWrap).parent().find('#formModal')).append(_this.imgFileCellTpl.formatEL({
                            src: pubMate.paths[i],
                            i: i,
                            name: pubMate.names[i],
                            type: pubMate.types[i],
                            id: pubMate.ids[i],
                            interval: pubMate.intervals[i],
                            pf: pubMate.pfs[i]
                        }));
                    }
                    $(".formSingle",$(_this.domWrap).parent().find('#formModal')).each(function(){
                        if($(this).find(".form-group").eq(1).attr("type") == "animation"){
                            $(this).find(".radio-inline").eq(1).children("input").attr("checked","checked");
                        }else{
                            $(this).find(".radio-inline").eq(0).children("input").attr("checked","checked");
                        }
                    });
                    imgsLoadSuccess(pubMate.paths,pubMate.paths);
                }else{
                    alert(_this.permission($active));
                }
            }
            //筛选符合规则的图片
            function filterImg(files) {
                var arrFiles = [];
                for (var i = 0, len = files.length; i < len; i++) {
                    var file = files[i];
                    if (!/(gif|jpg|png|jpeg)$/i.test(file.type)) {
                        alert('Image format should be gif, jpg, png or jpeg!');
                    } else {
                        if (file.size > 614400) {
                            alert('Picture is too large!');
                        } else {
                            arrFiles.push(file);
                        }
                    }
                }
                return arrFiles;
            }
            //读取并编辑符合规则的图片
            function readImage(files) {
                var image = new Image();
                var $imgFilterBox = $('#imgFilterBox',$(_this.domWrap).parent().find('#formModal'));
                var file;
                var imgInfoArr = [];
                var count = 0,i=0;
                var len = files.length;

                //建立编辑页面
                var editImgInfo=function(){
                    var reader = new FileReader();
                    file = files[i];
                    if (file){
                        reader.readAsDataURL(file);
                        reader.onload = function (_file) {
                            image.src = _file.target.result;
                            image.onload = function () {
                                imgInfoArr.push({
                                    pw: this.width,
                                    ph: this.height
                                });
                                count += 1;
                                if (count === len) {
                                    imgsLoadSuccess(imgInfoArr, files);
                                } else if (count<len) {
                                    editImgInfo();
                                }
                            };
                            image.onerror = function () {
                                alert('Invaild file type' + file.type);
                            };
                            $imgFilterBox.append(_this.imgFileCellTpl.formatEL({
                                src: image.src,
                                i: i ,
                                id:"",
                                name:"",
                                pf:"",
                                interval:""
                            }));
                            i++;
                        };
                    }
                };
                editImgInfo();
            }
            //为成功上传的图片建立dom对象
            function imgsLoadSuccess(imgInfoArr, imgStandardArr) {
                var imgContentArr = [];
                var $formModal = $('#formModal',$(_this.domWrap).parent());//模态框
                var $fileUpload = $('#fileUpload',_this.domWrap);
                $formModal.modal('show');
                $formModal.off('hidden.bs.modal').on('hidden.bs.modal',function(e){//每次隐藏模态框，清空处理一次图片路径
                    $fileUpload.replaceWith( $fileUpload = $fileUpload.clone(true));
                    e.stopPropagation();
                });
                var $inputSelect = $formModal.find('.radio-inline');
                //动画模式被选中时
                $formModal.find(".formSingle").each(function(){
                    var $radioAnimation = $(this).find('.radioAnimation');
                    if($(this).find(".form-group").eq(1).attr("type") == "animation"){
                        $radioAnimation.show();
                    }else{
                        $radioAnimation.hide();
                    }
                });
                $inputSelect.off('click').on('click', function () {
                    var $radioAnimation = $(this).parents('.imgInfos').find('.radioAnimation');
                    if ($(this).parent().find('.inlineRadio').is(":checked")) {//animation被选中,弹出width和interval
                        $radioAnimation.show();
                    } else {
                        $radioAnimation.hide();
                    }
                });
                $formModal.off('shown.bs.modal').on('shown.bs.modal', function () {//弹出模态框
                    var currentFormModal = $(_this.domWrap).parent().find('#formModal');
                    $('#btnClose',currentFormModal).off('click').on('click',function(){
                        $formModal.modal('hide');
                    });
                    if(imgInfoArr[0].pw){
                        $formModal.find('input[value="option1"]').prop('checked',true);
                    }
                    $('#buttonOk',currentFormModal).off('click').on('click', function () {//点击OK按钮
                        var groupId;
                        var $upGroup = $(_this.domWrap).find('.upGroup');
                        if($upGroup.length === 0){
                            groupId = '';
                        }else{
                            groupId = $upGroup[0].dataset.groupid;
                        }
                        for (var j = 0, len = imgStandardArr.length; j < len; j++) {
                            /*添加*/
                            if(imgInfoArr[j].pw){
                                var imgContent = {
                                    isFolder:0,
                                    group:groupId,
                                    name: '',
                                    time: new Date().format('yyyy-MM-dd'),
                                    content:{
                                        interval: 0,
                                        list: []
                                    }
                                };
                                imgContent.content.w = imgInfoArr[j].pw;
                                imgContent.content.h = imgInfoArr[j].ph;
                            }else{//编辑
                                var imgContent = {
                                    isFolder:0,
                                    group:groupId,
                                    name: '',
                                    time: new Date().format('yyyy-MM-dd'),
                                    content:{
                                        interval: 0,
                                        url: imgStandardArr[j],
                                        list: []
                                    }
                                };
                                var img_url = imgInfoArr[j];
                                var img = new Image();
                                img.src = img_url;
                                if(img.complete){
                                    // 打印
                                    imgContent.content.w = img.width;
                                    imgContent.content.h = img.height;
                                }else{
                                    // 加载完成执行
                                    img.onload = function(){
                                        // 打印
                                        imgContent.content.w = img.width;
                                        imgContent.content.h = img.height;
                                    };
                                }
                            }
                            if(currentFormModal.find('#inputName_' + j).val()===''){
                                alert('Image name is not completed!');
                                return;
                            }
                            if ($('#inlineRadio2_' + j).is(":checked")) {//animation被选中
                                imgContent.name = currentFormModal.find('#inputName_' + j).val();//改值
                                if(currentFormModal.find('#inputFrame_' + j).val() === ''|| currentFormModal.find('#inputInterval_' + j).val()===''){
                                    alert('Animation parameters are missing! ');
                                    return;
                                }
                                imgContent.content.pf = parseInt(currentFormModal.find('#inputFrame_' + j).val());//图片的帧数
                                imgContent.content.pw = parseInt(imgContent.content.w / imgContent.content.pf);//图片的单帧宽度
                                imgContent.content.interval = parseFloat(currentFormModal.find('#inputInterval_' + j).val());//图片的每帧的毫秒数
                                imgContent.content.list = [];
                                for (var i = 0; i < imgContent.content.pf; i++) {
                                    imgContent.content.list.push(i * imgContent.content.pw, 0, imgContent.content.pw, imgContent.content.h);
                                }
                            } else {
                                imgContent.name = currentFormModal.find('#inputName_' + j).val();//改值
                            }
                            imgContentArr.push(imgContent);
                        }
                        if(!imgInfoArr[0].pw){
                            editNamePub(imgStandardArr);
                        }else{
                            submit();
                        }
                        $formModal.modal('hide');//隐藏模态框
                    });
                    function editNamePub(imgStandardArr){
                        var arr=[];
                        for(var i = 0, len = imgStandardArr.length; i < len; i++){
                            var idArr = imgStandardArr[i].split("/");
                            var id = idArr[idArr.length-1].split(".")[0];
                            var datas = {
                                _id:id,
                                name:imgContentArr[i].name,
                                content: $.extend(false, imgContentArr[i].content, {
                                    pf:imgContentArr[i].content.pf,
                                    interval:imgContentArr[i].content.interval
                                })
                            };
                            arr.push(datas);
                        }
                        WebAPI.post('/factory/material/edit',arr).done(function(result){
                            if(result.status == "OK"){
                                var $active = $tabContent.find('.active');
                                for(var i=0,len=$active.length;i<len;i++){
                                    $active.eq(i).find(".imgName").html(imgContentArr[i].name);
                                    $active.eq(i).find(".photoLoad").attr("data_interval",imgContentArr[i].content.interval);
                                    var imgUrlDom = $('#'+ arr[i]._id).find('#inner-'+ arr[i]._id);
                                    if(imgContentArr[i].content.interval === 0){
                                        $active.eq(i).find(".animFlag").css('background', '#078A98').html('image');
                                        imgUrlDom.removeClass('center');
                                    }else{
                                        $active.eq(i).find(".animFlag").css('background', '#6D3F1F').html('animation');
                                    }
                                    imgUrlDom.get(0).style = null;
                                    _this.loadImage(arr[i], _this.loadResult);
                                    $active.eq(i).find(".photoLoad").attr("data_pf",imgContentArr[i].content.pf||'');
                                }
                                arr.forEach(function(row){
                                    var treeNode = _this.treeObj.getNodeByParam('id',row._id);
                                    if(treeNode) treeNode.name = row.name;
                                    _this.treeObj.updateNode(treeNode);
                                })
                            }
                        });
                    }
                    function submit() {
                        var groupId;
                        var formData = new FormData();
                        var $upGroup = $(_this.domWrap).find('.upGroup');
                        var id;

                        if ($upGroup.length === 0) {
                            groupId = '';
                        } else {
                            groupId = $upGroup[0].dataset.groupid;
                        }

                        for (var i = 0, len = imgStandardArr.length; i < len; i++) {
                            id = ObjectId();
                            imgContentArr[i]._id = id;
                            imgContentArr[i].content._id = id;
                            formData.append('_id', id);
                            formData.append('isFolder', imgContentArr[i].isFolder);
                            formData.append('name', imgContentArr[i].name + '.' + imgStandardArr[i].type.substring(6));
                            formData.append('creator', AppConfig.userId);
                            formData.append('time', new Date().format('yyyy-MM-dd'));
                            formData.append('public', 1);
                            formData.append('group', groupId);
                            formData.append('type', 'image');
                            formData.append('content', JSON.stringify(imgContentArr[i].content));
                            formData.append('image', imgStandardArr[i]);
                        }
                        $.ajax({
                            type: 'POST',
                            url: '/factory/material/saveform',
                            data: formData,
                            cache: false,
                            processData: false,  // 告诉jQuery不要去处理发送的数据
                            contentType: false,// 告诉jQuery不要去设置Content-Type请求头
                            success: function (data) {
                                var domId = [];
                                for(var i=0,len=data.length;i<len;i++){
                                    var count = 0;
                                    var standId = data[i].split('/')[4].split('.')[0];
                                    if (count < imgStandardArr.length) {
                                        for (var j = 0, len = imgContentArr.length; j < len;j++){
                                            if (imgContentArr[j]._id === standId) {
                                                imgContentArr[j].creator =  AppConfig.userProfile['fullname'];
                                                if (imgContentArr[j]) {
                                                    imgContentArr[j].content.url = 'http://images.rnbtech.com.hk/' + data[i];
                                                }
                                                _this.photoCell(imgContentArr[j], 'tpl-item photoItem');
                                                _this.store.push(imgContentArr[j]);
                                                _this.treeObj.addNodes(_this.treeObj.getNodeByParam('id',imgContentArr[j].group),_this.generateTreeEx([imgContentArr[j]]),true);
                                                _this.loadImage(imgContentArr[j], _this.loadResult);
                                                domId.push(standId);
                                                break;
                                            }
                                        }
                                        count++;
                                    }
                                }
                                var imgLastBoxId = domId[domId.length - 1];
                                $('#' + imgLastBoxId)[0].scrollIntoView(false);
                            },
                            error: function (data) {
                                console.log(data);
                            }
                        });

                    }
                });
            }
        };
        this.renderItems = function (result) {
            //if($('#tabContent', this.domWrap).find('.upGroup').length === 0){
            //    $('#tabContent', this.domWrap).empty();
            //}
            for (var i = 0; i < result.length; i++) {
                //根据interval判断图片或动画载入到不同的容器
                if(result[i].isFolder === 1){
                    $('#tabContent', this.domWrap).append(this.groupItemGroup.formatEL(result[i]));
                }else{
                    this.photoCell(result[i], 'tpl-item photoItem');
                    this.loadImage(result[i], this.loadResult);
                }
            }
            this.store = result;
            this.initTooltip();
        };
        this.photoCell = function (result, classAll) {
            var $tabContent = $('#tabContent', this.domWrap);
            var tempHtml = [];
            var imgInterval;
            if (result.interval) {
                imgInterval = parseInt(result.interval);
            } else {
                if(result.content){
                    imgInterval = result.content.interval?result.content.interval:0;
                }else{
                    imgInterval = 0;
                }
            }
            tempHtml.push(this.tabOptions.itemTpl.formatEL({
                classAll:classAll,
                _id:result._id,
                id: result._id,
                title:result.name?result.name:'',
                interval: imgInterval,
                pf: result.content.pf ? result.content.pf : '',
                type:result.type,
                group:result.group,
                h:result.content ?result.content.h:result.h,
                w:result.content ?result.content.w:result.w,
                creator:result.creator?result.creator:'未知'
            }));
            $tabContent.append(tempHtml.join(''));
            var $caption=$tabContent.find(".caption:last");
            var text=$caption.find(".imgName").text().split(".")[0];
            $caption.find(".imgName").text(text);
            if(parseInt(imgInterval) === 0){
                $tabContent.find('.animFlag:last').css('background', '#078A98').html('image');
            }else{
                $tabContent.find('.animFlag:last').css('background', '#6D3F1F').html('animation');
            }
        };
        this.loadImage = function (result, callback) {
            var imgLoad = new window.Image();
            //当图片成功加载到浏览器缓存
            imgLoad.onload = function (e) {
                if (typeof imgLoad.readyState == 'undefined') {
                    imgLoad.readyState = 'undefined';
                }
                if ((imgLoad.readyState == 'complete' || imgLoad.readyState == 'loaded') || imgLoad.complete) {
                    callback({ 'id': result._id, 'src': result.content.url, 'msg': 'ok' , 'pw': result.content.w, 'ph': result.content.h, 'pf': result.content.pf, 'interval':result.content.interval});
                } else {
                    //imgLoad.onreadystatechange(e);ie8及以下版本会出现
                }
            };
            imgLoad.onerror = function (e) {
                callback({ 'id': result._id, 'msg': 'error' });
            };
            imgLoad.src = result.content.url;
        };
         //图片加载回调函数
        this.loadResult = function (data) {
            var currentObj = document.getElementById('inner-' + data.id);
            if(!currentObj){return;}
            if($(currentObj).css("background").indexOf("url") !== -1){
                currentObj = $('#materialModal').find('#inner-' + data.id)[0];
            }
            data = data || {};
            if (typeof (data.msg) != 'undefined') {
                if (data.msg == 'ok') {
                    if (currentObj) {
                        var boxW = $(currentObj).parent(".thumbnail").width();//136px  
                        var boxH = $(currentObj).parent(".thumbnail").height();//116px  

                        $(currentObj).addClass('photoLoad');
                        currentObj.style.backgroundImage = 'url('+data.src+')';
                        currentObj.style.backgroundRepeat= 'no-repeat';

                        if(data.interval && data.interval != 0){//动画
                            var w = Number(data.pw);
                            var h = Number(data.ph);
                            var ratio = w/h;
                            var actualW,actualH;
                            $(currentObj).addClass('center');
                            if(w/data.pf<=boxW && h<=boxH){
                                actualW = data.pw/data.pf+'px';
                                actualH = data.ph+'px';
                            }else{
                                if(w/data.pf<h){
                                    actualH = boxH+'px';
                                    actualW = (boxH*ratio)/data.pf+'px';
                                }else{
                                    var ratio = (w/data.pf)/h;
                                    actualH = boxW/ratio+'px';
                                    actualW = boxW+'px';
                                }
                            }
                            currentObj.style.height = actualH;
                            currentObj.style.width = actualW;
                            currentObj.style.backgroundSize= 'cover';
                            currentObj.style.backgroundPosition= '0';
                        }else{
                            currentObj.style.height= '100%';
                            currentObj.style.width= '100%';
                            currentObj.style.backgroundPosition = 'center';
                            if(data.pw > boxW){
                                currentObj.style.backgroundSize= 'contain';
                            }
                        }
                    }
                } else {
                    if (currentObj) {
                        currentObj.style.backgroundImage = 'url('+data.src+')';
                        currentObj.style.backgroundRepeat= 'no-repeat';
                        $(currentObj).addClass('noImg photoLoad');
                    }
                }
            }
        };
        this.addGroupItem = function (data){
            var domItemCtn = this.domWrap.querySelector('#tabContent');
            var isNew = !data;
            // 如果 data 不存在，则进行新增操作
            if (!data) {
                data = {
                    _id: '',
                    name: I18n.resource.report.REPORT_SUB_NAME,
                    type: 'image',
                    group:'',
                    creator : AppConfig.userProfile.fullname,
                    time : new Date().format('yyyy-MM-dd HH:mm:ss')
                };
            }

            var $item = $(this.groupItemGroup.formatEL(data));
            domItemCtn.appendChild($item[0]);

            if (isNew) {
                $('.tpl-item', domItemCtn).removeClass('active');
                $item.addClass('active');
                // 让名称处于可编辑状态
                $item.children('.pageName').trigger('click');
            }
        };
        this.modifyGroupItem = function (data) {
            var _this = this;
            if (!data._id) {
                data._id = ObjectId();
                data.content = {};
                data.group =  $('.upGroup', this.container).length === 0?'':$('.upGroup', this.container)[0].dataset.groupid;
                data.isFolder = 1;
                data.creator = AppConfig.userId;
                data.time = new Date().format('yyyy-MM-dd HH:mm:ss');
                data.public =1;
                return WebAPI.post('/factory/material/save', data).done(function (result) {
                    if (result.status === 'OK') {
                        _this.store.push(data);
                        _this.treeObj.addNodes(_this.treeObj.getNodeByParam('id',data.group),_this.generateTreeEx([data]),true);
                    }
                });
            }
            return WebAPI.post('/factory/material/edit', data).done(function(){
                var treeNode = _this.treeObj.getNodeByParam('id',data._id);
                treeNode && (treeNode.name = data.name);
                _this.treeObj.updateNode(treeNode);
            });
        };
        this.slider = function (current){
            var _this = this;
            var $this = $(current);
            var upGroupData = {
                _id:'...',
                group: current.dataset.id,
                parentGroupId: current.dataset.groupid,
                type:'image'
            };
            if(!$.isEmptyObject(_this.search)){
                _this.search.searchList.push($this[0].dataset.id);
            }else{
                _this.list.push($this[0].dataset.id);
            }
            WebAPI.get('/factory/material/group/'+$this[0].dataset.type+'/'+$this[0].dataset.id).done(function(result){
                 _this.downFolder(result,upGroupData);
            })
        };
        this.downFolder = function(result,upGroupData){
            var _this =this;
            var $panelBody = $('#tabContent', this.domWrap);
            var $tabName = $('#tabName', this.domWrap);
            $tabName.find('.divEdit').hide();
            $tabName.find('.divDelete').hide();
            _this.store = result.data;
            if(!result.data){
                $panelBody.empty().append(this.upGroup.formatEL(upGroupData));
            }else{
                $panelBody.empty().append(this.upGroup.formatEL(upGroupData));
                _this.renderItems(result.data);
            }
            $panelBody.find('.upGroup').off('dblclick').on('dblclick',function(){
                if(!$.isEmptyObject(_this.search)){
                    _this.search.searchList.splice(_this.search.searchList.length-1,1);
                    if(_this.search.searchList.length > 0){
                        WebAPI.get('/factory/material/group/'+$(this)[0].dataset.type+'/'+_this.search.searchList[_this.search.searchList.length-1]).done(function(result){
                            $panelBody.empty();
                            var groupId = _this.search.searchList[_this.search.searchList - 1];
                            var upGroupData = {
                                _id:'...',
                                group: groupId,
                                parentGroupId: _this.list.length > 1 ? _this.list[_this.list.length - 2] : '',
                                type:'image'
                            };
                            _this.downFolder(result,upGroupData);
                        })
                    }else{
                        $(_this.container).empty();
                        _this.renderItems(_this.search.data);
                    }
                    return;
                }
                if(!_this.list[_this.list.length-2]){
                    var $tabName = $('#tabName', this.domWrap);
                    $tabName.find('.divEdit').hide();
                    $tabName.find('.divDelete').hide();
                    _this.list.splice(_this.list.length-1,1);
                    WebAPI.get('/factory/material/group/image').done(function(result){
                        $panelBody.empty();
                        _this.renderItems(result.data);
                    });
                }else{
                    WebAPI.get('/factory/material/group/'+$(this)[0].dataset.type+'/'+_this.list[_this.list.length-2]).done(function(result){
                        $panelBody.empty();
                        _this.list.splice(_this.list.length-1,1);
                        var upGroupData = {
                            _id:'...',
                            group: _this.list[_this.list.length - 1],
                            parentGroupId: _this.list.length > 1 ? _this.list[_this.list.length - 2] : '',
                            type:'image'
                        };
                        _this.downFolder(result,upGroupData);
                    })
                }
            });
        }

    }.call(ImageTab.prototype);

    exports.ImageTab = ImageTab;

} (
    namespace('factory.components.template.tabs'),
    namespace('factory.components.template.tabs.Tab')
));
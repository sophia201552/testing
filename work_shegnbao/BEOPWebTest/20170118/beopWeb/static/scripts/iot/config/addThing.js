var CreateDeviceModal = (function () {
    var _this;

    function CreateDeviceModal(opt) {
        _this = this;
        this.devices = null;
        this.names = null;
        this.type = null;
        this.mode = opt.mode;
        this.baseType = opt.baseType?opt.baseType:undefined;
        this.filter = opt.filter?opt.filter:undefined;
        this.parentNode = opt.parentNode;
        this.treeNode = opt.treeNode;
        this.group = [];
        this.prefix = null;
        this.batch = null; //批量
        this.batchErr = {
            name:false,
            prefix:false
        };
        this.show();    }

    CreateDeviceModal.prototype = {
        show: function () {
            var _this = this;
            if(_this.mode == 'add' && _this.baseType =='things' && _this.parentNode.baseType == 'projects'){
                alert('项目下不支持直接增加设备');
                return;
            }
            WebAPI.get("/static/scripts/iot/config/addThing.html").done(function (rsHtml) {
                _this.content = rsHtml;
                _this.$createDev = $("#modalIotCfg");
                _this.$createDev.find("#ctnIotCfg").html(rsHtml);
                if(_this.mode == 'add') {
                    _this.$createDev.find('.modal-title').text('添加' + _this.baseType);
                }else{
                    _this.$createDev.find('.modal-title').text('修改' + _this.baseType);
                }
                _this.$createDev.modal({backdrop: 'static', keyboard: false }); //closing modal by 'escape' keydown and click on outside are not allowed                _this.init();
                _this.init();
            });
        },
        init: function () {
            var _this = this;
            _this.names = [];
            _this.devices = [];
            _this.prefix = [];
            _this.type = "";
            _this.batch = false;
            _this.$createDev.modal('show');
            _this.$innerSLD = $("#createModalSld");
            _this.closeBtn = document.getElementById("closeBtn"); //$("$closeBtn")
            _this.skipBtn = document.getElementById("skipBtn"); //$("#skipBtn")
            _this.nextBtn = document.getElementById("nextBtn");//$("#nextBtn")
            _this.confirmBtn = document.getElementById("confirmBtn");
            _this.nameInput = document.getElementById("nameInput");
            _this.nameConfigInput = document.getElementById("batchNameArea");
            _this.prefixInput = document.getElementById("prefixInput");
            _this.typeList = document.getElementById("typeList");
            _this.groupList = document.getElementById("addedGroup");
            _this.bindDataGroup = document.getElementById("bindDataGroup");

            _this.typeDataSource = null;
            if (_this.parentNode.baseType == 'things') {
                _this.parentNode = _this.parentNode.getParentNode();
            }
            _this.initTypeList();
            _this.initParentType();
            if (_this.mode == 'edit'){
                _this.initEditMode();
            }
            _this.attachEvent();
        },
        attachEvent: function () {
            //setup onclick or onchange events
            var _this = this;
            var btnAddParent = document.getElementById("btnAddParent");
            btnAddParent.addEventListener("click", _this.parentAdd, false);
            _this.closeBtn.onclick = function () {
                _this.closeModal(false);
            };
            _this.confirmBtn.onclick = function () {
                _this.closeModal(true);
            };
            _this.nextBtn.onclick = function () {
                var currentIndex = _this.$innerSLD.find('.active').index();
                _this.checkValid(currentIndex);
            };
            _this.$innerSLD.on('slide.bs.carousel', _this.onCarouselMove);

            $(".batchBtn").on("change", function () {
                var batch = $(this).attr("data-batch");
                if (batch === "true") {
                    $("#divNameBatch").removeClass("hide");
                    $("#divPrefixBatch").removeClass("hide");
                    _this.batch = true;
                } else {
                    $("#divNameBatch").addClass("hide");
                    $("#divPrefixBatch").addClass("hide");
                    _this.batch = false;
                }
            });
        },
        closeModal: function (flag) {
            //flag 判断是否中途退出
            var _this = this;
            if (flag) {
                if(_this.mode == 'add'){
                    _this.addModeClose();
                }else if(_this.mode == 'edit'){
                    _this.editModeClose();
                }
                //window.alert("您已成功创建设备");
                _this.devices = null;
                _this.name = null;
                _this.type = null;
                _this.group = [];
                _this.prefix = null;
                _this.batch = false; //批量

                _this.$createDev.modal('hide');
                _this.$createDev.find("#dialogContent").empty();
            } else {
                var message = "确定要中途退出吗？";
                infoBox.confirm(message, callback);
                function callback(){
                    _this.devices = null;
                    _this.names = null;
                    _this.type = null;
                    _this.group = [];
                    _this.prefix = null;
                    _this.batch = false; //批量
                    _this.$createDev.modal('hide');
                    _this.$createDev.find("#dialogContent").empty();
                }
            }
        },
        editModeClose:function(){
            var postData = [];
            var node = {};
            for (var i = 0; i < _this.devices.length; i++) {
                node = {
                    '_id':_this.treeNode['_id'],
                    name:_this.devices[i].name,
                    arrP:_this.devices[i].arrP,
                    _idProj:_this.parentNode.baseType == 'projects'?_this.parentNode['_id']:_this.parentNode['_idProj'],
                    projId:_this.parentNode.projId,
                    pId:_this.parentNode.baseType == 'projects'?undefined:_this.pId,
                    path:null,
                    prefix:_this.devices[i].prefix,
                    type:_this.type,
                    weight:0,
                    baseType:_this.baseType
                };
                if(_this.treeNode['params'])node.params = _this.treeNode['params'];
                postData.push(node)
            }
            WebAPI.post('/iot/setIotInfo', postData).done(function (result) {
                if (result.data && result.data.length == 0)return;
                $.extend(true,_this.treeNode,postData[0]);
                _this.filter.tree.updateNode(_this.treeNode);
                for (var  i = 0 ; i < _this.filter.store[_this.treeNode['baseType']].length; i++){
                    if (_this.filter.store[_this.treeNode['baseType']][i]['_id'] == _this.treeNode['_id']){
                        for (var ele in _this.filter.store[_this.treeNode['baseType']][i]){
                            _this.filter.store[_this.treeNode['baseType']][i][ele] = _this.treeNode[ele]
                        }
                        break;
                    }
                }
                var func;
                if (typeof _this.filter.opt.tree.tool.edit == 'function'){
                    func = _this.filter.opt.tree.tool.edit;
                }else if(typeof _this.filter.opt.tree.tool.edit.act == 'function'){
                    func = _this.filter.opt.tree.tool.edit.act;
                }else{
                    return;
                }
                if ( _this.mode == 'edit'){
                    func.call(_this.filter,_this.treeNode)
                }
            });
        },
        addModeClose:function(){
            var postData = [];
            for (var i = 0; i < _this.devices.length; i++) {
                postData.push({
                    name:_this.devices[i].name,
                    arrP:_this.devices[i].arrP,
                    _idProj:_this.parentNode.baseType == 'projects'?_this.parentNode['_id']:_this.parentNode['_idProj'],
                    projId:_this.parentNode.projId,
                    pId:_this.parentNode.baseType == 'projects'?undefined:_this.pId,
                    path:null,
                    prefix:_this.devices[i].prefix,
                    type:_this.type,
                    weight:0,
                    baseType:_this.baseType
                })
            }
            WebAPI.post('/iot/setIotInfo', postData).done(function (result) {
                if (result.data && result.data.length == 0)return;
                postData.forEach(function (val, index) {
                    val['_id'] = result.data[index];
                    if(_this.baseType == 'groups'){
                        val.isParent = true;
                    }
                });
                var arrParent = [];
                var arrNodes = [];
                var parent;
                if (_this.pId instanceof Array) {
                    arrParent.push(_this.parentNode);
                    _this.filter.tree.addNodes(_this.parentNode, postData);
                    for (var i = 0; i < _this.pId.length; i++) {
                        if(_this.parentNode['_id'] == _this.pId[i])continue;
                        parent = _this.filter.tree.getNodeByParam('_id', _this.pId[i]);
                        arrParent.push(parent);
                        _this.filter.tree.addNodes(parent, postData);
                    }
                } else {
                    _this.filter.tree.addNodes(_this.parentNode, postData);
                    arrParent.push(_this.parentNode);
                }
                _this.filter.store[_this.baseType] = _this.filter.store[_this.baseType].concat(postData);
                var func;
                if (typeof _this.filter.opt.tree.tool.add == 'function'){
                    func = _this.filter.opt.tree.tool.add;
                }else if(typeof _this.filter.opt.tree.tool.add.act == 'function'){
                    func = _this.filter.opt.tree.tool.add.act;
                }else{
                    return;
                }
                for (var i = 0 ;i < postData.length ;i++){
                    arrNodes.push(_this.filter.tree.getNodeByParam('_id', postData[i]['_id']))
                }
                func.call(_this.filter,arrParent,arrNodes)
            });
        },
        initEditMode:function(){
            $('#divBatch').hide();
            $('#nameInput').val(_this.treeNode.name);
            $('#prefixInput').val(_this.treeNode.prefix)
        },
        createDevice: function(){            //create objects and add values
            var _this = this;
            var typeProp;
            for (var i = 0, len = _this.names.length; i < len; i++) {
                var obj = {};
                obj.name = _this.names[i];
                obj.type = _this.type;
                if (_this.prefix && _this.prefix[i]) {
                    obj.prefix = _this.prefix[i];
                } else {
                    obj.prefix = '';
                }
                obj.attrs = []; //containing the fullName, cnName, id and value of binddata
                obj.arrP = {};
                typeProp = _this.typeDataSource[_this.type];
                for (var attr in typeProp['attrs']) {
                    if (typeProp['attrs'].hasOwnProperty(attr)) {
                        var att = {};
                        att['name'] = attr;
                        att["fullName"] = obj.prefix + attr;
                        att["cnName"] = typeProp['attrs'][attr]["name"];
                        att["value"] = '--';
                        att["id"] = null;
                        obj["attrs"].push(att);
                    }
                }
                _this.devices.push(obj);
            }
        },
        updateDevice: function () {
            var _this = this;
            //update devices' info if added
        },
        initTypeList: function () {
            var _this = this;
            var arrHtml = ["<option value='-1'>请选择</option>"];
            var $typeList = $("#typeList");
            var clsList = [];
            _this.typeDataSource = _this.filter.dictClass[_this.baseType];
            //WebAPI.get('/iot/getClassFamily/' + _this.baseType.slice(0, -1) + '/cn').done(function (result) {
            //    if (result) {
            //        _this.typeDataSource = result;
            var baseType = _this.baseType.substring(0,_this.baseType.length - 1);
            baseType = baseType?baseType:_this.treeNode.baseType.substring(0,_this.treeNode.baseType -1);
            WebAPI.get('/iot/getClassFamilyByProjId/' + _this.parentNode.getPath()[0]['_id'] +'/' + baseType + '/cn').done(function(result){
                if (!result || $.isEmptyObject(result)){
                    clsList = _this.typeDataSource;
                }else{
                    clsList = result;
                }
                for (var obj in clsList) {
                    if (clsList.hasOwnProperty(obj)) {
                        var name = clsList[obj]["name"];
                        if(obj == 'Thing' || obj == 'Group'){
                            arrHtml.push("<option selected value='" + obj + "'>" + name + "</option>");
                        }else {
                            arrHtml.push("<option value='" + obj + "'>" + name + "</option>");
                        }
                    }
                }
                $typeList.html(arrHtml.join(''));
                if (_this.mode == 'edit') {
                    $('#typeList').val(_this.treeNode.type);
                }
                    //} else {
                    //    console.log("type list is null");
                    //}
                //});
            });
        },
        initParentType: function () {
            var _this = this;
            var arrHtml = ['<option value="-1">全部</option>'];
            var $parentTypeList = $("#parentTypeList");
            var $parentList = $('.parentList');

            //init subGroupList
            if (_this.baseType == 'groups'){
                $parentList.html('<option value="'+ _this.parentNode['_id'] +'">' + _this.parentNode.name + '</option>');
                $parentList.attr("disabled","disabled");
            }else {
                $parentList.html(arrHtml.join(''));
                $('#btnAddParent').show();
            }
            //init GroupList
            //WebAPI.get('/iot/getClassFamily/' + _this.parentNode.baseType.slice(0, -1) + '/cn').done(function (result) {
            //    if (result) {
                    _this.groupDataSource = _this.filter.dictClass[_this.parentNode.baseType];
                    if (_this.baseType == "groups" && _this.groupDataSource[_this.parentNode.type]) {
                        $parentTypeList.html('<option value="' + _this.parentNode.type + '">' + _this.groupDataSource[_this.parentNode.type].name + '</option>')
                            .attr('disabled', 'disabled');
                        return;
                    }
                    for (var obj in _this.groupDataSource) {
                        if (_this.groupDataSource.hasOwnProperty(obj)) {
                            var name = _this.groupDataSource[obj]["name"];
                            arrHtml.push("<option value='" + obj + "'>" + name + "</option>");
                        }
                    }
                    var arrParentList = ['<option value="-1">请选择</option>'];
                    for (var i = 0; i < _this.filter.store.groups.length; i++) {
                        if (_this.filter.store.groups[i]['_id'] == _this.parentNode['_id']) {
                            $parentList.val(_this.parentNode['_id'])
                        }
                        arrParentList.push('<option value="' + _this.filter.store.groups[i]['_id'] + '">' + _this.filter.store.groups[i].name + '</option>')
                    }
                    $parentList.html(arrParentList.join(''));
                    $parentTypeList.html(arrHtml.join(''));
                    if(_this.mode == 'add'){
                        $parentList.val(_this.parentNode['_id']);
                    } else if(_this.mode == 'edit'){
                        if(typeof _this.treeNode.pId =='string'){
                            $('.parentList').eq(0).val(_this.treeNode.pId)
                        }else if(_this.treeNode.pId instanceof Array){
                            $('.parentList').eq(0).val(_this.treeNode.pId[0]);
                            for (var i = 1; i < _this.treeNode.pId.length; i++){
                                _this.parentAdd().val(_this.treeNode.pId[i])
                            }
                        }
                    }
                //}else {
            //        console.log("type list is null");
            //    }
            //});
            $parentTypeList.on("change", function () {
                if (_this.baseType == 'groups')return;
                var selectedOpt = $("#parentTypeList option:selected").attr("value");
                _this.getParentList(selectedOpt);
            });
        },
        getParentList: function (val) {
            var _this = this;
            var arrHtml = ["<option value='-1'>请选择</option>"];
            var $parentList = $('.parentList');
            for (var i = 0; i < _this.filter.store.groups.length; i++) {
                if (val == -1 || _this.filter.store.groups[i].type == val) {
                    if (_this.filter.store.groups[i]['_id'] == _this.parentNode['_id']) {
                        $parentList.val(_this.parentNode['_id'])
                    }
                    arrHtml.push('<option value="' + _this.filter.store.groups[i]['_id'] + '">' + _this.filter.store.groups[i].name + '</option>')
                } else {

                }
            }
            $parentList.html(arrHtml.join(""));
        },
        parentAdd: function () {
            var $divParentList = $($('.divParentList')[0].outerHTML);
            $('#boxParentList').append($divParentList);
            return $divParentList;
        },
        //getSubGroupList: function(val){
        //    var _this = this;
        //    var arrHtml = ["<option value='-1'>请选择</option>"];
        //    var $subGroupList = $("#subGroupList");
        //    if(val !== '-1'){
        //        var data = _this.groupDataSource[val]["attrs"];
        //        if(Object.keys(data).length > 0){
        //            for(var obj in data){
        //                if(data.hasOwnProperty(obj)){
        //                    var name = data[obj]["name"];
        //                    arrHtml.push("<option text='"+name+"' value='"+obj+"'>"+name+"</option>");
        //                }
        //            }
        //            $subGroupList.html(arrHtml.join(""));
        //            $subGroupList.removeAttr("disabled");
        //        }else{
        //            $subGroupList.html(arrHtml.join(""));
        //            $subGroupList.attr("disabled", "disabled");
        //        }
        //    }else{
        //        $subGroupList.html(arrHtml.join(""));
        //        $subGroupList.attr("disabled", "disabled");
        //    }
        //},
        generateName: function () {
            var _this = this;
            var input = _this.nameInput.value.trim();
            var names = [];
            if (_this.batch) {
                try {
                    var config = $("#batchNameArea").val().trim();//if the input is a valid JSON string or need to convert to a valid one
                    config = config.replace((/([\w]+)(:)/g), "\"$1\"$2"); //add "" before : if doesnt exist
                    config = config.replace((/'/g), "\"");  //replace '' with ""
                    if (config == '') {
                        alert('名称批量设置为空！');
                        return names
                    } else {
                        var nameConfig = JSON.parse(config);
                        for (var item in nameConfig) {
                            if (nameConfig.hasOwnProperty(item)) {
                                var reg = new RegExp('<#' + item + '#>', 'g');
                                if (Object.prototype.toString.call(nameConfig[item]).slice() === '[object Array]') {
                                    //confing in array
                                    for (var j = 0; j < nameConfig[item].length; j++) {
                                        if (names.length !== nameConfig[item].length) {
                                            names.push(input.replace(reg, nameConfig[item][j]));
                                        } else {
                                            names[j] = names[j].replace(reg, nameConfig[item][j]);
                                        }
                                    }
                                } else {
                                    //config in obj
                                    var min = parseInt(nameConfig[item]["min"], 10);
                                    var max = parseInt(nameConfig[item]["max"], 10);
                                    var step = parseInt(nameConfig[item]["step"], 10) || 1;
                                    for (var k = 0; k < max - min + 1; k++) {
                                        if (names.length !== max - min + 1) {
                                            names.push(input.replace(reg, k + min));
                                        } else {
                                            console.log(typeof names[k]);
                                            names[k] = names[k].replace(reg, k * step + min);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                catch(e){
                    _this.batchErr.name = true;
                }
            } else {
                names.push(input);
            }
            return names;
        },
        generatePrefix: function () {
            //generate prefix (default as names)
            var _this = this;
            var input = _this.prefixInput.value.trim();
            var prefix = [];
            if (_this.batch) {
                try {
                    if (input === '' || input.length === 0) {
                        //if the user hasn't input the prefix then the prefix will be the same as names with '_' behind
                        for (var i = 0; i < _this.names.length; i++) {
                            //var name = _this.names[i];
                            //name += (name.slice(-1) === "_") ? "" : "_";
                            prefix.push('');
                        }
                    } else {
                        //if the prefixInput is filled
                        var config = $("#batchPrefixArea").val().trim();//if the input is a valid JSON string or need to convert to a valid one
                        config = config.replace((/([\w]+)(:)/g), "\"$1\"$2"); //add "" before : if doesnt exist
                        config = config.replace((/'/g), "\"");  //replace '' with ""
                        if (config == '') {
                            alert('前缀批量设置为空！');
                            return prefix
                        }
                        var prefixConfig = JSON.parse(config);
                        for (var item in prefixConfig) {
                            if (prefixConfig.hasOwnProperty(item)) {
                                var reg = new RegExp('<#' + item + '#>', 'g');
                                if (Object.prototype.toString.call(prefixConfig[item]).slice() === '[object Array]') {
                                    //confing in array
                                    var pre;
                                    for (var j = 0; j < prefixConfig[item].length; j++) {
                                        if (prefix.length !== prefixConfig[item].length) {
                                            pre = input.replace(reg, prefixConfig[item][j]);
                                            //pre += (pre.slice(-1) === "_") ? "" : "_";
                                            prefix.push(pre);
                                        } else {
                                            pre = prefix[j].replace(reg, prefixConfig[item][j]);
                                            //pre += (pre.slice(-1) === "_") ? "" : "_";
                                            prefix[j] = pre;
                                        }
                                    }
                                } else {
                                    //config in obj
                                    var min = parseInt(prefixConfig[item]["min"], 10);
                                    var max = parseInt(prefixConfig[item]["max"], 10);
                                    //var step = parseInt(prefixConfig[item]["step"],10) || 1 ;
                                    for (var k = 0; k < max - min + 1; k++) {
                                        if (prefix.length !== max - min + 1) {
                                            prefix.push(input.replace(reg, k + min));
                                        } else {
                                            console.log(typeof prefix[k]);
                                            prefix[k] = prefix[k].replace(reg, k + min);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }catch(e){
                    _this.batchErr.prefix = true;
                }
            } else {
                if (input === '' || input.length === 0) {
                    //if the user hasn't input the prefix then the prefix will be the same as names with '_' behind
                    //    for(var i=0;i<_this.names.length;i++){
                    //        var name = _this.names[i];
                    //        name += (name.slice(-1) === "_")? "":"_";
                    //        prefix.push(name);
                    //    }
                    prefix.push('');
                } else {
                    //if the prefixInput is filled
                    //input += (input.slice(-1) === "_")? "":"_";
                    prefix.push(input);
                }
            }
            return prefix;
        },
        generatePId: function () {
            var $parentList = $('.parentList');
            var pId = {};
            var arrPId = [];
            pId[_this.parentNode['_id']] = true;
            for (var i = 0; i < $parentList.length; i++) {
                if ($parentList.eq(i).val() && $parentList.eq(i).val() != '-1') {
                    pId[$parentList.eq(i).val()] = true
                }
            }
            for (var ele in pId) {
                arrPId.push(ele)
            }
            if (arrPId.length == 1)arrPId = arrPId.toString();
            return arrPId;
        },
        addGroup: function () {
            var _this = this;
            var groupList = document.getElementById("groupList"),
                subGroupList = document.getElementById("subGroupList"),
                group = groupList.options[groupList.selectedIndex].value,
                subGroup = subGroupList.options[subGroupList.selectedIndex].value,
                subGroupName = subGroupList.options[subGroupList.selectedIndex].text;
            //not the the default option    
            if (group !== "-1" && subGroup !== "-1") {
                var addedGroup = document.getElementById("addedGroup");
                var div = document.createElement("div"),
                    name = document.createElement("span"),
                    rmBtn = document.createElement("div"),
                    icon = document.createElement("span");

                div.className = "col-sm-3 btn";
                div.setAttribute("data-group", group);
                div.setAttribute("data-subgroup", subGroup);
                div.setAttribute("data-name", subGroupName);

                name.innerHTML = subGroupName;
                icon.className = "glyphicon glyphicon-minus";

                rmBtn.appendChild(icon);
                rmBtn.style.float = "right";

                div.appendChild(name);
                div.appendChild(rmBtn);
                addedGroup.appendChild(div);

                if (addedGroup.classList.contains("hide")) {
                    addedGroup.classList.remove("hide");
                }
                rmBtn.onclick = function (e) {
                    var addedGroup = document.getElementById("addedGroup"),
                        currentRow = e.target.parentElement.parentElement;//e.target ==> <span>
                    addedGroup.removeChild(currentRow);
                    if (addedGroup.childElementCount === 0) {
                        addedGroup.classList.add("hide");
                    }
                }
            }
        },
        removeGroup: function (e) {
            //console.log("remove");
            var addedGroup = document.getElementById("addedGroup"),
                currentRow = e.parentNode;
            addedGroup.removeChild(currentRow);
            if (addedGroup.childElementCount === 0) {
                addedGroup.classList.add("hide");
            }
        },
        getAddedGroup: function () {
            //groups in obj
            var _this = this;
            var arr = [];
            var groupRow = document.getElementById("addedGroup").childNodes;
            for (var i = 0; i < groupRow.length; i++) {
                if (groupRow[i].nodeName.toLowerCase() == 'div' && groupRow[i].hasAttribute("data-group")) {
                    var g = {};
                    g.group = groupRow[i].getAttribute("data-group");
                    g.subGroup = groupRow[i].getAttribute("data-subGroup");
                    g.name = groupRow[i].getAttribute("data-name");
                    arr.push(g);
                }
            }
            return arr;
        },
        getBindDataSource: function () {
            var _this = this;

            _this.devices.forEach(function (val, index) {
                var device = val;
                var p = device.prefix;
                var attrs = device.attrs;
                var arrP = device.arrP;
                WebAPI.get("/point_tool/searchCloudPoint/" + _this.parentNode.projId + "/" + p + "/").done(function (result) {
                    if (result.success) {
                        var data = result.data["pointTable"];
                        if (data.length == 0){
                            _this.initBindData(device);
                            return;
                        }
                        var idGroup = [];
                        for (var n = 0, len = data.length; n < len; n++) {
                            idGroup.push(data[n]._id);
                        }
                        //console.log(_this.devices[i].attrs);
                        for (var j = 0; j < attrs.length; j++) {
                            for (var k = 0; k < data.length; k++) {
                                if (attrs[j]["fullName"] === data[k]["value"]) {
                                    attrs[j]["id"] = data[k]["_id"];
                                    arrP[attrs[j]["name"]] = data[k]["_id"];
                                }
                            }
                        }
                        var postData = {"dsItemIds": idGroup};
                        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData).done(function (result) {
                            if (result.dsItemList && result.dsItemList.length > 0) {
                                var d = result["dsItemList"];
                                for (var l = 0; l < attrs.length; l++) {
                                    for (var m = 0; m < d.length; m++) {
                                        if (attrs[l]["id"] === d[m]["dsItemId"]) {
                                            attrs[l]["value"] = d[m]["data"];
                                        }
                                    }
                                }
                            } else {
                                console.log("the data of bind point is not loaded");
                            }
                            _this.initBindData(device);
                        });
                    } else {
                        console.log("the data of prefix attrs is not loaded");
                    }
                }).fail(function(){
                    _this.initBindData(device);
                });
            })
        },
        initBindData: function (device) {
            var _this = this;
            var names = _this.names;
            var frag = document.createDocumentFragment();
            //for(var i=0,len=_this.devices.length;i<len;i++){
            var name = document.createElement("label"),
                wrap = document.createElement("div"),
                container = document.createElement("div");

            wrap.className = "form-group row";
            container.className = "container-fluid";
            container.setAttribute("data-name", device.name);
            name.className = "text-center col-sm-12 form-control-label";
            name.innerHTML = "名称(Name)：" + device.name;
            wrap.appendChild(name);
            container.appendChild(wrap);

            for (var k = 0, leng = device.attrs.length; k < leng; k++) {
                var div = document.createElement("div"),
                    lab = document.createElement("label"),
                    cnlab = document.createElement("label"),
                    btn = document.createElement("div");
                // span = document.createElement("span");

                div.className = "form-group row";
                lab.className = "text-center col-sm-4 form-control-label";
                cnlab.className = "text-center col-sm-4 form-control-label";
                btn.className = "btn text-center col-sm-3";
                // span.className = "glyphicon glyphicon-plus";

                div.id = device.attrs[k]["id"];
                lab.innerHTML = device.attrs[k]["fullName"];
                cnlab.innerHTML = device.attrs[k]["cnName"];
                btn.innerHTML = device.attrs[k]["value"];

                div.appendChild(lab);
                div.appendChild(cnlab);
                div.appendChild(btn);

                container.appendChild(div);
            }
            frag.appendChild(container);
            //}
            _this.bindDataGroup.appendChild(frag);
        },
        generateFullBindData: function () {
            var _this = this;
            var arr = [];
            //_this.prefix += (_this.prefix.slice(-1) === "_")? "":"_";
            for (var i = 0; i < _this.devices.length; i++) {
                for (var attr in _this.type["attrs"]) {
                    if (_this.type["attrs"].hasOwnProperty(attr)) {
                        var obj = {};
                        obj["fullName"] = _this.devices[i]["prefix"] + attr;
                        obj["cnName"] = _this.type["attrs"][attr]["name"];
                        obj["value"] = '--';
                        obj["id"] = null;
                        arr.push(obj);
                        _this.devices[i]["attrs"].push(obj);
                    }
                }
            }
            return arr;
        },
        onCarouselMove: function () {
            var _this = this;
            var currentIndex = $(this).find('.active').index() + 1;
            if (currentIndex !== 1) {
                //$("#skipBtn").removeAttr("disabled");
            } else {
                //$("#skipBtn").attr("disabled", "disabled").addClass("hide");
                $("#nextBtn").hide();
                $("#confirmBtn").removeClass("hide");
            }
        },
        checkValid: function (index) {
            var _this = this;
            var valid;
            if (index === 0) {
                _this.batchErr = {
                    name:false,
                    prefix:false
                };
                _this.names = _this.generateName();
                _this.prefix = _this.generatePrefix();
                if (_this.nameInput.value.trim() === "") {
                    alert("请输入设备名称");
                    _this.nameInput.focus();
                    valid = false;
                } else if (_this.batch && _this.nameConfigInput.value.trim() === "") {
                    alert("请输入名称批量设置");
                    _this.nameConfigInput.focus();
                } else if (_this.typeList.options[_this.typeList.selectedIndex].value === '-1') {
                    alert("请选择类型");
                    _this.typeList.focus();
                    valid = false;
                    // }else if(_this.prefixInput.value.trim() === ""){
                    //     alert("请输入前缀名称");
                    //     prefixInput.focus();
                    //     valid = false;
                } else if( _this.batchErr.name){
                    alert("名字批量设置格式错误，请检查");
                } else if( _this.batchErr.prefix){
                    alert("前缀批量设置格式错误，请检查");
                } else {
                    valid = true;
                }
                if (valid) {
                    _this.type = _this.typeList.options[_this.typeList.selectedIndex].value;
                    _this.pId = _this.generatePId();
                    _this.createDevice();
                    //if(_this.names.length == 0|| _this.prefix.length == 0)return;

                    if (_this.mode == 'edit' || _this.prefix && _this.prefix instanceof Array && _this.prefix.join('').length > 0) {
                        _this.getBindDataSource();
                        $("#createModalSld").carousel("next");
                    } else {
                        _this.closeModal(true)
                    }
                }
            }
        }
    };
    return CreateDeviceModal;
})();

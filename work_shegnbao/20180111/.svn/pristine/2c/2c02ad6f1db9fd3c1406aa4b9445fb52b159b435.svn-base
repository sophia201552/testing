var ConfigTool = (function() {
    var _this;

    function ConfigTool(screen) {
        _this = this;
        this.screen = screen;
        this.curStore = undefined;
        this.mapOffset = undefined;
        this.tempEvent = undefined;
        this.toolStatus = undefined;
        this.eventStatus = undefined;
        this.mouseUpTime = undefined;
        this.dictAttr = undefined;
        this.delete = [{ id: [], type: 'groups' }, { id: [], type: 'things' }];
        this.map = {
            offsetX: 0,
            offsetY: 0,
            imgX: 0,
            imgY: 0,
            mapX: 0,
            mapY: 0
        }
    }
    ConfigTool.prototype = {
        init: function() {
            _this.tempEvent = [];
            _this.toolStatus = 'init';
            _this.eventStatus = 'init';
            _this.curStore = _this.screen.curStore;
            _this.initOffsetSum();
            _this.initJqSvg();
            _this.initToolSel();
            _this.initMapImport();
            _this.initDirectAndScale();
            _this.initAddSpace();
            _this.initEleMoveAndClick();
            //_this.initAddOuterWall();
            _this.initAddController();
            _this.initAddSensor();
            _this.initRelate();
            _this.initUserRole();
            _this.initSaveDetail();
            _this.initDelete();
        },
        initOffsetSum: function() {
            function getOffsetSum(ele) {
                var top = 0,
                    left = 0;
                while (ele) {
                    top += ele.offsetTop;
                    left += ele.offsetLeft;
                    ele = ele.offsetParent;
                }
                return {
                    top: top,
                    left: left
                }
            }
            var $containerMap = $('#containerMap');
            var $divMap = $('#divConfigMapInfo');
            this.mapOffset = getOffsetSum($containerMap[0]);
            $divMap.off('resize').on('resize', function() {
                _this.mapOffset = getOffsetSum($containerMap[0]);
            })
        },
        initEventJudge: function() {
            var $containerMap = $('#containerMap');
            $containerMap.off('mousedown')
        },
        initToolSel: function() {
            var $btnConfigTool = $('.btnConfigTool');
            $btnConfigTool.off('click.manager').on('click.manager', function(e) {
                removeToolSel(e);
                $(e.currentTarget).addClass('selected');
                $('.divMapTool').css('display', 'none');
            });
            var $containerMap = $('#containerMap');
            $containerMap.off('contextmenu').on('contextmenu', function(e) {
                if (_this.toolStatus == 'addSpaceStart') {
                    $('.spaceAdding').remove();
                    return false;
                }
                removeToolSel(e);
                return false;
            });

            function removeToolSel(e) {
                if (e.which != 3 && !$(e.target).hasClass('btnConfigTool')) return;
                _this.toolStatus = 'init';
                _this.eventStatus = 'init';
                $('.btnConfigTool.selected').removeClass('selected');
                for (var i = 0; i < _this.tempEvent.length; i++) {
                    $containerMap.off(_this.tempEvent[i]);
                }
                $('.divMapTool').css('display', '');
                $('.main').removeClassEx('main');
                $('.relate').removeClassEx('relate');
                $containerMap.on('contextmenu', function(e) {
                    if (_this.toolStatus == 'addSpaceStart') {
                        $('.spaceAdding').remove();
                        return false;
                    }
                    removeToolSel(e);
                    return false;
                });
            }

        },
        initMapImport: function() {
            var $inputMap = $('#inputMap');
            var $imageMap = $('#imageMap');
            $('#btnMapImport').off('click.tool').on('click.tool', function(e) {
                _this.toolStatus = 'importMap';
                e.stopPropagation();
                $inputMap.trigger('click');
            });
            $inputMap.off('change').on('change', function(e) {
                //file = e.currentTarget.files;
                //if (!file[0].type.match(fileType)) {
                //    return;
                //}
                /*reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    $imageMap[0].src = e.target.result;
                    _this.screen.curStore.room.params.map.img = e.target.result;
                    _this.screen.curStore.room.params.map.height = $imageMap.height();
                    _this.screen.curStore.room.params.map.width = $imageMap.width();
                };*/
                var files, fileType = /image*/,
                    fileName, formData = new FormData();
                files = e.target.files;
                if (!files) return;
                if (!files[0].type.match(fileType)) {
                    return;
                }
                for (var i = 0, len = files.length; i < len; i++) {
                    fileName = _this.screen.curStore.room._id + '.' + files[i].name.split('.')[1];
                    formData.append('file_list[]', files[i]);
                    formData.append('name_list[]', fileName); // 此处的实际情况是只有一张图片
                }
                formData.append('path', 'custom/appTemperature/maps');
                $.ajax({
                    url: '/oss/uploadtocustom',
                    type: 'post',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(result) {
                        if (result.success) {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                var data = e.target.result;
                                //加载图片获取图片真实宽度和高度
                                // $imageMap[0].src = _this.screen.curStore.room.params.map.img = 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/' + 'custom/appTemperature/maps/' + fileName;
                                $imageMap[0].onload = function() {
                                    _this.screen.curStore.room.params.map.height = $imageMap.height();
                                    _this.screen.curStore.room.params.map.width = $imageMap.width();
                                }
                                $imageMap[0].src = data;
                                e.target.value = '';
                            };
                            reader.readAsDataURL(files[0]);
                        } else {
                            e.target.value = '';
                        }
                    },
                    error: function() {
                        e.target.value = '';
                    }
                })
            })
        },
        initDirectAndScale: function() {
            var $divDirection = $('#divDirectionTool');
            var directionStatus = 'end';
            var directionCenter, evPos, startAngle, moveAngle, endAngle;
            endAngle = 0;
            $divDirection.off('mousedown').on('mousedown', function(e) {
                e.preventDefault();
                if (directionStatus != 'end') return;
                if (isNaN(endAngle)) endAngle = 0;
                directionCenter = {
                    x: $divDirection[0].offsetLeft + $divDirection.width() / 2,
                    y: $divDirection[0].offsetTop + $divDirection.height() / 2
                };
                evPos = {
                    x: e.pageX - _this.mapOffset.left,
                    y: e.pageY - _this.mapOffset.top
                };
                startAngle = 360 * Math.atan2(-(evPos.y - directionCenter.y), (evPos.x - directionCenter.x)) / (2 * Math.PI);
                directionStatus = 'start';
                console.log('startAngle: ' + startAngle);
            });
            $divDirection.off('mousemove').on('mousemove', function(e) {
                e.preventDefault();
                if (directionStatus != 'start' && directionStatus != 'move') return;
                evPos = {
                    x: e.pageX - _this.mapOffset.left,
                    y: e.pageY - _this.mapOffset.top
                };
                moveAngle = 360 * Math.atan2(-(evPos.y - directionCenter.y), (evPos.x - directionCenter.x)) / (2 * Math.PI);
                $divDirection.css('transform', 'rotate(' + (endAngle + startAngle - moveAngle) + 'deg)');
                console.log('moveAngle: ' + moveAngle);
                console.log('endAngle: ' + endAngle);
                console.log(endAngle + startAngle - moveAngle);
                directionStatus = 'move';
            });
            $divDirection.off('mouseup').on('mouseup', function(e) {
                e.preventDefault();
                if (directionStatus != 'move') return;
                endAngle += startAngle - moveAngle;
                _this.screen.curStore.room.params.map.orientation = endAngle;
                directionStatus = 'end';
            });
            $divDirection.off('mouseleave').on('mouseleave', function(e) {
                e.preventDefault();
                endAngle += startAngle - moveAngle;
                directionStatus = 'end';
            });
            var $inputScale = $('#inputScale');
            var scale;
            $inputScale.off('input').on('input', function(e) {
                scale = Math.pow(10, $(e.currentTarget).val());
                $inputScale.prev().text(scale);
                _this.screen.curStore.room.params.map.scale = scale;
            })
        },
        //initAddSpace:function(){
        //    var $containerMap = $('#containerMap');
        //    var xStart,yStart,xEnd,yEnd,height,width,evPos;
        //    var space,topWall,rightWall,bottomWall,leftWall,rightTopCorner,rightBottomCorner,leftTopCorner,leftBottomCorner;
        //    var $mapTool = $('.divMapTool');
        //    this.tempEvent.push('mousedown.temp','mousemove.temp','mouseup.temp');
        //    $('#btnAddSpace').off('click.tool').on('click.tool',function(e){
        //        _this.toolStatus = 'addSpace';
        //        $mapTool.css('display','none');
        //        var addSpaceStatus = 'end';
        //        var id='';
        //        $containerMap.off('mousedown.temp').on('mousedown.temp',function(e){
        //            e.preventDefault();
        //            if (e.which != 1)return;
        //            if ($(e.target).hasClass('divMapEle'))return;
        //            if(addSpaceStatus != 'end')return;
        //            evPos = {
        //                x:e.pageX - _this.mapOffset.left,
        //                y:e.pageY - _this.mapOffset.top
        //            };
        //            $containerMap.css('cursor','crosshair');
        //            xStart = evPos.x;
        //            yStart = evPos.y;
        //            space = document.createElement('div');
        //            space.className = 'divSpace divMapEle selected';
        //            space.dataset.type = 'space';
        //            space.dataset.relate = 'sensor';
        //            space.dataset.sensor = '';
        //            space.style.left = xStart + 'px';
        //            space.style.top = yStart + 'px';
        //
        //            topWall = document.createElement('div');
        //            topWall.className = 'topWall wall divMapEle';
        //            topWall.dataset.orient = 'top';
        //
        //            rightWall = document.createElement('div');
        //            rightWall.className = 'rightWall wall divMapEle';
        //            rightWall.dataset.orient = 'right';
        //
        //            bottomWall = document.createElement('div');
        //            bottomWall.className = 'bottomWall wall divMapEle';
        //            bottomWall.dataset.orient = 'bottom';
        //
        //            leftWall = document.createElement('div');
        //            leftWall.className = 'leftWall wall divMapEle';
        //            leftWall.dataset.orient = 'left';
        //
        //            rightTopCorner = document.createElement('div');
        //            rightTopCorner.className = 'divCorner rightTopCorner divMapEle';
        //            rightTopCorner.dataset.orient = 'rightTop';
        //
        //            rightBottomCorner = document.createElement('div');
        //            rightBottomCorner.className = 'divCorner rightBottomCorner divMapEle';
        //            rightBottomCorner.dataset.orient = 'rightBottom';
        //
        //            leftTopCorner = document.createElement('div');
        //            leftTopCorner.className = 'divCorner leftTopCorner divMapEle';
        //            leftTopCorner.dataset.orient = 'leftTop';
        //
        //            leftBottomCorner = document.createElement('div');
        //            leftBottomCorner.className = 'divCorner leftBottomCorner divMapEle';
        //            leftBottomCorner.dataset.orient = 'leftBottom';
        //
        //            space.appendChild(topWall);
        //            space.appendChild(rightWall);
        //            space.appendChild(bottomWall);
        //            space.appendChild(leftWall);
        //
        //            space.appendChild(rightTopCorner);
        //            space.appendChild(rightBottomCorner);
        //            space.appendChild(leftTopCorner);
        //            space.appendChild(leftBottomCorner);
        //
        //            $containerMap.append(space);
        //            addSpaceStatus = 'start';
        //        });
        //        $containerMap.off('mousemove.temp').on('mousemove.temp',function(e){
        //            e.preventDefault();
        //            if(addSpaceStatus != 'start' && addSpaceStatus != 'move')return;
        //            evPos = {
        //                x:e.pageX - _this.mapOffset.left,
        //                y:e.pageY - _this.mapOffset.top
        //            };
        //            $containerMap.css('cursor','crosshair');
        //            width = evPos.x - xStart;
        //            height = evPos.y - yStart;
        //            space.style.width = width + 'px';
        //            space.style.height = height + 'px';
        //            addSpaceStatus = 'move';
        //        });
        //        $containerMap.off('mouseup.temp').on('mouseup.temp',function(e){
        //            e.preventDefault();
        //            if(addSpaceStatus != 'move')return;
        //            $(space).removeClass('selected');
        //            $containerMap.css('cursor','default');
        //            id = ObjectId();
        //            space.id = id;
        //            _this.screen.curStore.space.push({
        //                '_id':id,
        //                'name':'',
        //                '_idProj':_this.screen.curStore.room['_idProj'],
        //                'arrP':{},
        //                'pId': _this.screen.curStore.room['_id'],
        //                'prefix':'',
        //                'projId':_this.screen.curStore.room['projId'],
        //                'type':'GroupSpace',
        //                'weight':0,
        //                'params': {
        //                    'arrWallIds': [],
        //                    'path':[],
        //                    'width': space.offsetWidth,
        //                    'height': space.offsetHeight,
        //                    'x': space.offsetLeft,
        //                    'y': space.offsetTop
        //                },
        //                baseType:'groups'
        //            });
        //            addSpaceStatus = 'end';
        //        })
        //    })
        //},
        initAddSpace: function() {
            var $containerMap = $('#containerMap');
            var svgWall = document.getElementById('ctnSvgWall');
            var xStart, yStart, xEnd, yEnd, height, width, evPos;
            var pathAttr = '';
            var $mapTool = $('.divMapTool');
            var wallPath, pathNum, line, arrPath, node, status, div, id, size;
            this.tempEvent.push('click.temp', 'mousemove.temp');
            $('#btnAddSpace').off('click.tool').on('click.tool', function(e) {
                pathNum = 0;
                _this.toolStatus = 'addSpaceEnd';
                $mapTool.css('display', 'none');
                status = 'end';
                arrPath = [];
                $containerMap.off('click.temp').on('click.temp', function(e) {
                    e.preventDefault();
                    if (e.which != 1 && div) {
                        $(div).remove();
                        return;
                    };
                    if ($(e.target).attr('class') && $(e.target).attr('class').indexOf('divMapEle') > -1) return;
                    if (status != 'end' && status != 'move') return;
                    evPos = {
                        x: e.pageX - _this.mapOffset.left,
                        y: e.pageY - _this.mapOffset.top
                    };
                    if (_this.pathClose(arrPath, evPos)) {
                        status = 'end';
                        $containerMap.css('cursor', 'default');
                        arrPath[2 * pathNum] = 'L' + arrPath[0].slice(1);
                        arrPath[2 * pathNum + 1] = arrPath[1];
                        if (arrPath.length >= 8) {
                            pathAttr = arrPath.join(' ');
                            pathAttr += ' ' + 'Z';
                            wallPath.setAttribute('d', pathAttr);
                            size = wallPath.getBoundingClientRect();
                            _this.screen.curStore.space.push({
                                '_id': id,
                                'name': '',
                                '_idProj': _this.screen.curStore.room['_idProj'],
                                'arrP': {},
                                'pId': _this.screen.curStore.room['_id'],
                                'prefix': '',
                                'projId': _this.screen.curStore.room['projId'],
                                'type': 'GroupSpace',
                                'weight': 0,
                                'params': {
                                    'path': pathAttr,
                                    'width': size.width,
                                    'height': size.height,
                                    'x': size.left - _this.mapOffset.left,
                                    'y': size.top - _this.mapOffset.top
                                },
                                baseType: 'groups'
                            });
                            div.setAttribute('class', 'divSpace divMapEle');
                        } else {
                            $(div).remove();
                        }
                        _this.toolStatus = 'addSpaceEnd';
                        pathNum = 0;
                        div = null;
                        return;
                    }
                    xStart = evPos.x;
                    yStart = evPos.y;
                    if (pathNum == 0) {
                        id = ObjectId();
                        $containerMap.css('cursor', 'crosshair');
                        pathAttr = '';
                        arrPath = [];
                        wallPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        wallPath.className.baseVal = 'pathSpace pathWall divMapEle';

                        div = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                        div.className.baseVal = 'divSpace divMapEle spaceAdding';
                        div.id = id;
                        div.setAttribute('data-sensor', '');
                        div.appendChild(wallPath);
                        svgWall.appendChild(div);
                        pathAttr = 'M' + xStart + ' ' + yStart;
                        _this.toolStatus = 'addSpaceStart';
                    }
                    line = 'L' + xStart + ' ' + yStart;
                    node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    node.className.baseVal = 'divMapEle divCorner';
                    node.setAttribute('cx', evPos.x);
                    node.setAttribute('cy', evPos.y);
                    node.setAttribute('r', 5);
                    if (pathNum == 0) {
                        node.className.baseVal += ' startWallNode';
                    }
                    div.appendChild(node);


                    pathAttr += ' ' + line;
                    arrPath = pathAttr.split(' ');
                    wallPath.setAttribute('d', pathAttr);
                    console.log(pathAttr);
                    status = 'start';
                    pathNum++;
                });
                $containerMap.off('mousemove.temp').on('mousemove.temp', function(e) {
                    e.preventDefault();
                    if (status != 'start' && status != 'move') return;
                    evPos = {
                        x: e.pageX - _this.mapOffset.left,
                        y: e.pageY - _this.mapOffset.top
                    };
                    if (e.ctrlKey && _this.pathClose(arrPath, evPos, true)) {
                        line = 'L' + arrPath[0].slice(1) + ' ' + arrPath[1] + ' ';
                        arrPath[2 * pathNum] = 'L' + evPos.x;
                        arrPath[2 * pathNum + 1] = evPos.y;
                    } else {
                        line = 'L' + xStart + ' ' + yStart;
                        arrPath[2 * pathNum] = 'L' + evPos.x;
                        arrPath[2 * pathNum + 1] = evPos.y;
                    }
                    pathAttr = arrPath.join(' ');
                    wallPath.setAttribute('d', pathAttr);
                    console.log(pathAttr);
                    $containerMap.css('cursor', 'crosshair');
                    status = 'move';
                });
            })
        },
        initEleMoveAndClick: function() {
            var $containerMap = $('#containerMap');
            var $mapTool = $('.divMapTool');
            var spaceStatus = 'end';
            var xStart, yStart, evPos, initPos, $target, type, size, initD, initArrD, arrD;
            var spaceH, spaceW, spaceLeft, spaceTop;
            var targetData;
            $containerMap.off('mousedown.general').on('mousedown.general', function(e) {
                if (spaceStatus != 'end') return;
                targetData = null;
                if (!($(e.target).attr('class') && $(e.target).attr('class').indexOf('divMapEle') > -1)) {
                    $('.divMapEle.selected').removeClassEx('selected');
                    return;
                }
                if (_this.toolStatus == 'addSpaceStart') return;
                $target = $(e.target);
                type = '';
                size = null;
                initD = '';
                initArrD = [];
                if ($target[0].tagName == 'path' && $target[0].className.baseVal.indexOf('pathWall') > -1) {
                    type = 'space'
                } else if ($target[0].tagName == 'circle' && $target[0].className.baseVal.indexOf('divCorner') > -1) {
                    type = 'corner'
                }
                if (type == 'space') {
                    size = $target[0].getBoundingClientRect();
                    initPos = {
                        x: size.left,
                        y: size.top,
                        h: size.height,
                        w: size.width
                    };
                    initD = $target[0].getAttribute('d');
                    initArrD = initD.split(' ')
                } else if (type == 'corner') {
                    initPos = {
                        x: parseInt($target[0].getAttribute('cx')),
                        y: parseInt($target[0].getAttribute('cy'))
                    };
                    initD = $target[0].parentNode.firstChild.getAttribute('d');
                    initArrD = initD.split(' ')
                } else {
                    initPos = {
                        x: $(e.target)[0].offsetLeft,
                        y: $(e.target)[0].offsetTop
                    };
                }
                evPos = {
                    x: e.pageX - _this.mapOffset.left,
                    y: e.pageY - _this.mapOffset.top
                };
                xStart = evPos.x;
                yStart = evPos.y;
                spaceStatus = 'start';
                if (type == 'space') {
                    targetData = _this.searchDevice('space', $target[0].parentNode.id);
                } else if (type == 'corner') {
                    targetData = _this.searchDevice('space', $target[0].parentNode.id);
                } else if ($target[0].dataset.type) {
                    targetData = _this.searchDevice($target[0].dataset.type, $target[0].id)
                }
            });
            $containerMap.off('mousemove.general').on('mousemove.general', function(e) {
                if (spaceStatus != 'start' && spaceStatus != 'move') return;
                _this.eventStatus = 'moveSpace';
                $('.divMapEle.selected').removeClassEx('selected');
                $target.addClass('selected');
                $mapTool.css('display', 'none');
                evPos = {
                    x: e.pageX - _this.mapOffset.left,
                    y: e.pageY - _this.mapOffset.top
                };
                if (evPos.x - xStart < 20 && evPos.y - yStart < 20){
                    return;
                }
                //console.log ($(e.target)[0].className);
                if (type == 'space') {
                    arrD = initD.split(' ');
                    for (var i = 0; i < initArrD.length - 1; i++) {
                        if (initArrD[i][0] == 'M' || initArrD[i][0] == 'L') {
                            arrD[i] = initArrD[i][0] + (parseInt(initArrD[i].slice(1)) + evPos.x - xStart);
                        } else {
                            arrD[i] = parseInt(initArrD[i]) + evPos.y - yStart;
                        }
                    }
                    $target[0].setAttribute('d', arrD.join(' '));
                    //console.log(d);
                    var arrNode = $target.parent().find('circle');
                    for (var i = 0; i < arrNode.length; i++) {
                        arrNode[i].setAttribute('cx', arrD[2 * i].slice(1));
                        arrNode[i].setAttribute('cy', arrD[2 * i + 1])
                    }
                    $target.parent().addClassEx('selected')
                } else if (type == 'corner') {
                    var path = $target.parent()[0].firstChild;
                    var index = $target.parent().children().index($target) - 1;
                    $target[0].setAttribute('cx', initPos.x + evPos.x - xStart);
                    $target[0].setAttribute('cy', initPos.y + evPos.y - yStart);
                    arrD = initD.split(' ');
                    arrD[2 * index] = initArrD[2 * index][0] + (parseInt(initArrD[2 * index].slice(1)) + evPos.x - xStart);
                    arrD[2 * index + 1] = parseInt(initArrD[2 * index + 1]) + evPos.y - yStart;
                    if ($target.hasClassEx('startWallNode')) {
                        arrD[arrD.length - 3] = initArrD[arrD.length - 3][0] + (parseInt(initArrD[2 * index].slice(1)) + evPos.x - xStart);
                        arrD[arrD.length - 2] = parseInt(initArrD[arrD.length - 2]) + evPos.y - yStart;
                    }
                    path.setAttribute('d', arrD.join(' '));
                    $target.parent().addClassEx('selected')
                } else {
                    $target.css('cursor', 'default');
                    $target.css({
                        left: initPos.x + evPos.x - xStart,
                        top: initPos.y + evPos.y - yStart
                    });
                    if (targetData) {
                        _this.setRelateLine($target[0].dataset.type, $target[0].id,
                            initPos.x + evPos.x - xStart + $target.width() / 2, initPos.y + evPos.y - yStart + $target.height() / 2);
                    }
                }
                // if (spaceStatus != 'move'){
                    // window.setTimeout(function(){
                        // spaceStatus = 'move';
                    // },300)
                // }
            });
            $containerMap.off('mouseup.general').on('mouseup.general', function(e) {
                if (_this.toolStatus != 'addSensor' && _this.toolStatus != 'addController') {
                    if (spaceStatus == 'start') {
                        //$('.divMapEle.relate').removeClass('relate');
                        if (!_this.mouseUpTime) {
                            if (type == 'space' || type == 'corner') {
                                if ($target.parent().hasClassEx('selected')) {
                                    $target.parent().removeClassEx('selected');
                                } else {
                                    $('.divMapEle.selected').removeClassEx('selected');
                                    $target.parent().addClassEx('selected');
                                }
                            } else {
                                if ($target.hasClass('selected')) {
                                    $target.removeClass('selected');
                                } else {
                                    $('.divMapEle.selected').removeClassEx('selected');
                                    $target.addClass('selected');
                                }
                            }
                            _this.mouseUpTime = new Date();
                        } else {
                            if (new Date() - _this.mouseUpTime < 300) {
                                _this.showDeviceModal($target);
                            } else {
                                if (type == 'space' || type == 'corner') {
                                    if ($target.parent().hasClassEx('selected')) {
                                        $target.parent().removeClassEx('selected');
                                    } else {
                                        $('.divMapEle.selected').removeClassEx('selected');
                                        $target.parent().addClassEx('selected');
                                    }
                                } else {
                                    if ($target.hasClass('selected')) {
                                        $target.removeClass('selected');
                                    } else {
                                        $('.divMapEle.selected').removeClassEx('selected');
                                        $target.addClass('selected');
                                    }
                                }
                            }
                            _this.mouseUpTime = new Date();
                        }
                    } else if ((spaceStatus == 'move')) {
                        $mapTool.css('display', '');
                        if ($target.hasClass('divSpace')) {
                            targetData.params.x = initPos.x + evPos.x - xStart;
                            targetData.params.y = initPos.y + evPos.y - yStart;
                        } else if (type == 'space') {
                            size = $target[0].getBoundingClientRect();
                            targetData.params.x = initPos.x + evPos.x - xStart + $target.width() / 2 - _this.mapOffset.left;
                            targetData.params.y = initPos.y + evPos.y - yStart + $target.height() / 2 - _this.mapOffset.top;
                            targetData.params.path = $target[0].getAttribute('d');
                        } else if (type == 'corner') {
                            size = $target[0].parentNode.firstChild.getBoundingClientRect();
                            targetData.params.x = size.left - _this.mapOffset.left;
                            targetData.params.y = size.top - _this.mapOffset.top;
                            targetData.params.height = size.height;
                            targetData.params.width = size.width;
                            targetData.params.path = $target[0].parentNode.firstChild.getAttribute('d');
                        } else if ($target.hasClass('divController') || $target.hasClass('divSensor')) {
                            targetData.params.gps[0] = initPos.x + evPos.x - xStart + $target.width() / 2;
                            targetData.params.gps[1] = initPos.y + evPos.y - yStart + $target.height() / 2;
                        } else if ($target.hasClass('divCorner') || $target.hasClass('wall')) {
                            for (var i = 0; i < _this.screen.curStore.space.length; i++) {
                                if (_this.screen.curStore.space[i]['_id'] == $target.parent().attr('id')) {
                                    _this.screen.curStore.space[i].params.x = spaceLeft;
                                    _this.screen.curStore.space[i].params.y = spaceTop;
                                    _this.screen.curStore.space[i].params.width = spaceW;
                                    _this.screen.curStore.space[i].params.height = spaceH;
                                    break;
                                }
                            }
                        }
                    }
                }
                spaceStatus = 'end';
            });
        },
        initAddOuterWall: function() {
            var $containerMap = $('#containerMap');
            var svgWall = document.getElementById('ctnSvgWall');
            var xStart, yStart, xEnd, yEnd, height, width, evPos;
            var pathAttr = '';
            var $mapTool = $('.divMapTool');
            var wallPath, pathNum, line, arrPath, node, status, div;
            this.tempEvent.push('click.temp', 'mousemove.temp');
            $('#btnAddWall').off('click.tool').on('click.tool', function(e) {
                pathNum = 0;
                _this.toolStatus = 'addouterWall';
                $mapTool.css('display', 'none');
                status = 'end';
                arrPath = [];
                $containerMap.off('click.temp').on('click.temp', function(e) {
                    e.preventDefault();
                    if (e.which != 1) return;
                    if ($(e.target).hasClass('divMapEle')) return;
                    if (status != 'end' && status != 'move') return;
                    evPos = {
                        x: e.pageX - _this.mapOffset.left,
                        y: e.pageY - _this.mapOffset.top
                    };
                    if (_this.pathClose(arrPath, evPos)) {
                        status = 'end';
                        $containerMap.css('cursor', 'default');
                        arrPath[2 * pathNum] = 'L' + arrPath[0].slice(1);
                        arrPath[2 * pathNum + 1] = arrPath[1];
                        pathAttr = arrPath.join(' ');
                        pathNum = 0;
                        pathAttr += ' ' + 'Z';
                        wallPath.setAttribute('d', pathAttr);
                        return;
                    }
                    $containerMap.css('cursor', 'crosshair');
                    xStart = evPos.x;
                    yStart = evPos.y;
                    if (pathNum == 0) {
                        pathAttr = '';
                        arrPath = [];
                        wallPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        wallPath.className.baseVal = 'pathOuterWall pathWall';

                        div = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                        div.className.baseVal = 'divSpace';
                        div.appendChild(wallPath);
                        svgWall.appendChild(div);
                        pathAttr = 'M' + xStart + ' ' + yStart;
                    }
                    line = 'L' + xStart + ' ' + yStart;
                    node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    node.className.baseVal = 'wallNode';
                    node.setAttribute('cx', evPos.x);
                    node.setAttribute('cy', evPos.y);
                    node.setAttribute('r', 5);
                    if (pathNum == 0) {
                        node.className.baseVal += ' startWallNode';
                    }
                    div.appendChild(node);


                    pathAttr += ' ' + line;
                    arrPath = pathAttr.split(' ');
                    wallPath.setAttribute('d', pathAttr);
                    //console.log(pathAttr);
                    status = 'start';
                    pathNum++;
                });
                $containerMap.off('mousemove.temp').on('mousemove.temp', function(e) {
                    e.preventDefault();
                    if (status != 'start' && status != 'move') return;
                    evPos = {
                        x: e.pageX - _this.mapOffset.left,
                        y: e.pageY - _this.mapOffset.top
                    };
                    if (e.ctrlKey && _this.pathClose(arrPath, evPos, true)) {
                        line = 'L' + arrPath[0].slice(1) + ' ' + arrPath[1] + ' ';
                        arrPath[2 * pathNum] = 'L' + evPos.x;
                        arrPath[2 * pathNum + 1] = evPos.y;
                    } else {
                        line = 'L' + xStart + ' ' + yStart;
                        arrPath[2 * pathNum] = 'L' + evPos.x;
                        arrPath[2 * pathNum + 1] = evPos.y;
                    }
                    pathAttr = arrPath.join(' ');
                    wallPath.setAttribute('d', pathAttr);
                    console.log(pathAttr);
                    $containerMap.css('cursor', 'crosshair');
                    status = 'move';
                });
            })
        },
        pathClose: function(arrPath, cur, mode) {
            var min = 30;
            var max = 80;
            var judge = mode ? min : max;
            if (arrPath.length < 2) return;
            if (Math.abs(arrPath[0].slice(1) - cur.x) < judge && Math.abs(arrPath[1] - cur.y) < judge) {
                return true
            }
            return false;
        },
        getPathSize: function(arrPath) {

        },
        initAddController: function() {
            var strController = new StringBuilder();
            strController.append('<div class="divController divMapEle glyphicon glyphicon-cog" data-sensor="" data-type="controller" data-relate="sensor"></div>');
            var $containerMap = $('#containerMap');
            var $mapTool = $('.divMapTool');
            var evPos, $divController;
            this.tempEvent.push('click.temp');
            $('#btnAddController').on('click.tool', function(e) {
                _this.toolStatus = 'addController';
                $mapTool.css('display', 'none');
                $containerMap.off('click.temp').on('click.temp', function(e) {
                    //if(!$(e.target).hasClass('divMapEle')){
                    //    return;
                    //}
                    if (_this.eventStatus == 'moveSpace') {
                        _this.eventStatus = 'init';
                        return;
                    }
                    var id = ObjectId();
                    evPos = {
                        x: e.pageX - _this.mapOffset.left,
                        y: e.pageY - _this.mapOffset.top
                    };
                    $divController = $(strController.toString());
                    $containerMap.append($divController);
                    $divController.css({
                        left: evPos.x - $divController.width() / 2,
                        top: evPos.y - $divController.height() / 2
                    });
                    $('.divMapEle.selected').removeClassEx('selected');
                    $divController.addClass('selected');
                    $divController.attr('id', id);
                    _this.screen.curStore.controller.push({
                        '_id': id,
                        'arrP': [],
                        'name': "",
                        'pId': _this.screen.curStore.room['_id'] ? _this.screen.curStore.room['_id'] : '',
                        'path': "",
                        'prefix': "",
                        'projId': _this.screen.curStore.room['projId'],
                        'type': "ControllerFCU",
                        'params': {
                            'gatewayId': '',
                            'type': 0,
                            'gps': [evPos.x, evPos.y],
                            'mac': '',
                            'address': ''
                        },
                        baseType: 'things'
                    })
                })
            })
        },
        initAddSensor: function() {
            var strSensor = new StringBuilder();
            strSensor.append('<div class="divSensor divMapEle glyphicon glyphicon-eye-open" data-space="" data-controller="" data-type="sensor" data-relate="space controller"></div>');
            var $containerMap = $('#containerMap');
            var $mapTool = $('.divMapTool');
            var evPos, $divSensor;
            this.tempEvent.push('click.temp');
            $('#btnAddSensor').off('click.tool').on('click.tool', function(e) {
                _this.toolStatus = 'addSensor';
                $mapTool.css('display', 'none');
                $containerMap.off('click.temp').on('click.temp', function(e) {
                    //if(!$(e.target).hasClass('divMapEle')){
                    //    return;
                    //}
                    if (_this.eventStatus == 'moveSpace') {
                        _this.eventStatus = 'init';
                        return;
                    }
                    var id = ObjectId();
                    evPos = {
                        x: e.pageX - _this.mapOffset.left,
                        y: e.pageY - _this.mapOffset.top
                    };
                    $divSensor = $(strSensor.toString());
                    $containerMap.append($divSensor);
                    $divSensor.css({
                        left: evPos.x - $divSensor.width() / 2,
                        top: evPos.y - $divSensor.height() / 2
                    });
                    $('.divMapEle.selected').removeClassEx('selected');
                    $divSensor.addClass('selected');
                    $divSensor.attr('id', id);
                    var spaceRelate;
                    if ($(e.target)[0].tagName == 'path' && $(e.target).hasClassEx('pathSpace')) {
                        $divSensor[0].dataset.space = $(e.target).parent().attr('id');
                        var dataSensor = $(e.target).parent()[0].getAttribute('data-sensor');
                        if (dataSensor == null) dataSensor = '';
                        $(e.target).parent()[0].setAttribute('data-sensor', dataSensor += ' ' + id);
                        _this.screen.curStore.sensor.push({
                            '_id': id,
                            'arrP': [],
                            'name': "",
                            'pId': [$(e.target).parent().attr('id')],
                            'path': "",
                            'prefix': "",
                            'projId': _this.screen.curStore.room['projId'],
                            'type': "SensorTemp",
                            'params': {
                                'gatewayId': '',
                                'endpoint': 0,
                                'cId': '',
                                'gps': [evPos.x, evPos.y],
                                'mac': '',
                                'address': ''
                            },
                            baseType: 'things'
                        })
                    } else {
                        _this.screen.curStore.sensor.push({
                            '_id': id,
                            'arrP': [],
                            'name': "",
                            'pId': [_this.screen.curStore.room['_id']],
                            'path': "",
                            'prefix': "",
                            'projId': _this.screen.curStore.room['projId'],
                            'type': "SensorTemp",
                            'params': {
                                'gatewayId': '',
                                'endpoint': 0,
                                'cId': '',
                                'gps': [evPos.x, evPos.y],
                                'mac': '',
                                'address': ''
                            },
                            baseType: 'things'
                        })
                    }
                })
            })
        },
        initDelete: function() {
            $(document).off('keyup.general').on('keyup.general', function(e) {
                if (e.keyCode != 46 || e.target.tagName != 'BODY') return;
                var $target = $('.divMapEle.selected');
                var del;
                if ($target.length == 0) return;
                if ($target.hasClassEx('divSpace')) {
                    $target[0].dataset = {
                        type: 'space',
                        relate: 'space',
                        sensor: $target[0].getAttribute('data-sensor')
                    }
                }
                for (var i = 0; i < _this.screen.curStore[$target[0].dataset.type].length; i++) {
                    if ($target[0].id == _this.screen.curStore[$target[0].dataset.type][i]['_id']) {
                        del = _this.screen.curStore[$target[0].dataset.type].splice(i, 1)[0];
                        if ($target[0].dataset.type == 'space') {
                            _this.delete[0].id.push(del['_id']);
                        } else {
                            _this.delete[1].id.push(del['_id']);
                            _this.delRelateLine($target[0].dataset.type, del['_id'])
                        }
                        break;
                    }
                }
                _this.delRelateSensor($target);
                $target.remove();
            });
        },
        showDeviceModal: function($tar) {
            var $modal = $('#modalConfigDeviceInfo');
            var $modalContent = $('#divConfigDeviceInfo');
            var $iptName = $('#iptDeviceName');
            var $iptPrefix = $('#iptDevicePrefix');
            var $target;
            if ($tar.hasClassEx('pathSpace')) {
                $target = $tar.parent()
            } else {
                $target = $tar
            }
            var id = $target[0].id;
            if ($target.hasClassEx('divSpace')) {
                for (var i = 0; i < _this.screen.curStore.space.length; i++) {
                    if (_this.screen.curStore.space[i]['_id'] == id) {
                        $iptName.val(_this.screen.curStore.space[i].name);
                        $iptPrefix.val(_this.screen.curStore.space[i].prefix);
                        $modal.modal('show');
                        _this.saveDeviceModal(_this.screen.curStore.space[i]);
                        break;
                    }
                }
            } else if ($target.hasClassEx('divSensor')) {
                for (var i = 0; i < _this.screen.curStore.sensor.length; i++) {
                    if (_this.screen.curStore.sensor[i]['_id'] == id) {
                        $iptName.val(_this.screen.curStore.sensor[i].name);
                        $iptPrefix.val(_this.screen.curStore.sensor[i].prefix);
                        _this.showDevicePt('SensorTemp', _this.screen.curStore.sensor[i]);
                        _this.saveDeviceModal(_this.screen.curStore.sensor[i]);
                        $modal.modal('show');
                        break;
                    }
                }
            } else if ($target.hasClassEx('divController')) {
                for (var i = 0; i < _this.screen.curStore.controller.length; i++) {
                    if (_this.screen.curStore.controller[i]['_id'] == id) {
                        $iptName.val(_this.screen.curStore.controller[i].name);
                        $iptPrefix.val(_this.screen.curStore.controller[i].prefix);
                        _this.showDevicePt('ControllerFCU', _this.screen.curStore.controller[i]);
                        $modal.modal('show');
                        _this.saveDeviceModal(_this.screen.curStore.controller[i]);
                        break;
                    }
                }
            }

        },
        showDevicePt: function(device, tarData) {
            var _this = this;
            var $iptGrpDevicePt = $('#iptGrpDevicePt').html('');
            var divPt, iptPt, ipPtLabel;
            var attr = _this.screen.roomTree.dictClass.things[device].attrs;
            for (var ele in attr) {
                divPt = document.createElement('div');
                divPt.className = 'checkBox';
                divPt.dataset.attr = ele;

                ipPtLabel = document.createElement('label');
                ipPtLabel.textContent = attr[ele].name;

                iptPt = document.createElement('input');
                iptPt.setAttribute('type', 'checkbox');
                iptPt.className = 'iptAttrCheck';
                if (tarData.arrP[ele]) {
                    iptPt.checked = true;
                } else {
                    iptPt.checked = false;
                }
                iptPt.dataset.attr = ele;

                divPt.appendChild(ipPtLabel);
                divPt.appendChild(iptPt);
                $iptGrpDevicePt.append(divPt);
            }
        },
        saveDeviceModal: function(data) {
            var $modal = $('#modalConfigDeviceInfo');
            var $iptName = $('#iptDeviceName');
            var $iptPrefix = $('#iptDevicePrefix');
            //var $divPt = $('#iptGrpDevicePt div');
            $('#btnDeviceInfoConfirm').off('click').on('click', function() {
                var $iptPtCheck = $('#iptGrpDevicePt input:checked');
                var $iptPt = $('#iptGrpDevicePt input');
                for (var i = 0; i < $iptPt.length; i++) {
                    data.arrP[$iptPt[i].dataset.attr] = null;
                }
                data.name = $iptName.val();
                data.prefix = $iptPrefix.val();
                if ($iptPtCheck.length > 0 && data.prefix != '') {
                    data.arrP = {};
                    Spinner.spin()
                    WebAPI.get("/point_tool/searchCloudPoint/" + _this.screen.curStore.room.projId + "/" + data.prefix + "/").done(function(result) {
                        var rs = result.data["pointTable"];
                        for (var i = 0; i < $iptPtCheck.length; i++) {
                            for (var j = 0; j < rs.length; j++) {
                                if (data.prefix + $iptPtCheck[i].dataset.attr === rs[j]["value"]) {
                                    data.arrP[$iptPtCheck[i].dataset.attr] = rs[j]["_id"];
                                }
                            }
                        }
                    }).always(function(){
                        $modal.modal('hide');
                    });
                }else{
                    $modal.modal('hide');
                }
            });
        },
        initRelate: function() {
            var $containerMap = $('#containerMap');
            var arrSpaceId, arrSensorId, arrCtrId, relate;
            var isRelate = false;
            var $divMapEle;
            var $main;
            this.tempEvent.push('click.temp');
            $('#btnRelate').on('click.tool', function(e) {
                isRelate = false;
                $containerMap.off('click.temp').on('click.temp', function(e) {
                    $divMapEle = $('.divMapEle');
                    var $target = $(e.target);
                    if ($target[0].tagName == 'path' && $target.hasClassEx('pathSpace')) {
                        $target = $target.parent();
                        $target[0].dataset = {
                            type: 'space',
                            relate: 'sensor',
                            sensor: $target[0].getAttribute('data-sensor')
                        }
                    }
                    if ($target.hasClassEx('main')) {
                        $divMapEle.removeClassEx('relate');
                        $target.removeClassEx('main');
                        isRelate = false;
                    } else if ($target.hasClassEx('relate')) {
                        _this.setRelateData($target, 'del');
                        $target.removeClassEx('relate');
                    } else if (!isRelate) {
                        if ($target.hasClassEx('divSensor')) {
                            arrSpaceId = _this.searchDevice('sensor', $target[0].id).pId;
                            for (var i = 0; i < arrSpaceId.length; i++) {
                                relate = document.getElementById(arrSpaceId[i]);
                                if (relate) $(relate).addClassEx('relate');
                            }
                            arrCtrId = _this.searchDevice('sensor', $target[0].id).params.cId;
                            relate = document.getElementById(arrCtrId);
                            if (relate) $(relate).addClassEx('relate');
                            $target.addClassEx('main');
                            isRelate = true;
                        } else if ($target.hasClassEx('divController')) {
                            arrSensorId = $target[0].dataset.sensor;
                            relate = document.getElementById(arrSensorId);
                            if (relate) $(relate).addClassEx('relate');
                            $target.addClass('main');
                            isRelate = true;
                        } else if ($target.hasClassEx('divSpace')) {
                            arrSensorId = $target[0].dataset.sensor;
                            relate = document.getElementById(arrSensorId);
                            if (relate) $(relate).addClassEx('relate');
                            $target.addClassEx('main');
                            isRelate = true;
                        }
                    } else {
                        $main = $('.main');
                        if ($main.hasClassEx('divSpace')) {
                            $main[0].dataset = {
                                type: 'space',
                                relate: 'sensor',
                                sensor: $main[0].getAttribute('data-sensor')
                            }
                        }
                        if ($target.hasClassEx('divSpace')) {
                            $target[0].dataset = {
                                type: 'space',
                                relate: 'sensor',
                                sensor: $target[0].getAttribute('data-sensor')
                            }
                        }
                        if ($main[0].dataset.type != $target[0].dataset.type) {
                            if ($main[0].dataset.relate.indexOf($target[0].dataset.type) > -1) {
                                if ($main[0].dataset.type != 'controller') {
                                    if ($target[0].dataset.type == 'controller') {
                                        $('.divController.relate').removeClassEx('relate');
                                    } else {
                                        $('.divSpace.relate').removeClassEx('relate');
                                    }
                                }
                                _this.setRelateData($target, 'add');
                                $target.addClassEx('relate');
                            }
                        }
                    }
                })
            })
        },
        setRelateData: function($target, mode) {
            var $main = $('.main');
            var sensorData, ctrData;
            if ($main.hasClassEx('divSpace')) {
                $main[0].dataset = {
                    type: 'space',
                    relate: 'sensor',
                    sensor: $main[0].getAttribute('data-sensor')
                }
            }
            if (mode == 'add') {
                $main[0].dataset[$target[0].dataset.type].replace($target[0].id, '');
                $target[0].dataset[$main[0].dataset.type].replace($main[0].id, '');
                if ($main[0].dataset.type == 'sensor') {
                    if ($target[0].dataset.type == 'space') {
                        _this.searchDevice('sensor', $main[0].id).pId = [$target[0].id];
                    } else {
                        //_this.searchDevice('sensor',$main[0].id).params.cId = $target[0].id;
                        sensorData = _this.searchDevice('sensor', $main[0].id);
                        sensorData.params.cId = $target[0].id;
                        ctrData = _this.searchDevice('controller', $target[0].id);
                        _this.addRelateLine(sensorData, ctrData);
                    }
                } else if ($main[0].dataset.type == 'space') {
                    _this.searchDevice('sensor', $target[0].id).pId = [$main[0].id];
                } else if ($main[0].dataset.type == 'controller') {
                    //_this.searchDevice('sensor',$target[0].id).params.cId = $main[0].id;
                    sensorData = _this.searchDevice('sensor', $target[0].id);
                    sensorData.params.cId = $main[0].id;
                    ctrData = _this.searchDevice('controller', $main[0].id);
                    _this.addRelateLine(sensorData, ctrData);
                }
            } else {
                $main[0].dataset[$target[0].dataset.type] += ' ' + $target[0].id;
                $target[0].dataset[$main[0].dataset.type] += ' ' + $main[0].id;
                if ($main[0].dataset.type == 'sensor') {
                    if ($target[0].dataset.type == 'space') {
                        _this.searchDevice('sensor', $main[0].id).pId = [];
                    } else {
                        sensorData = _this.searchDevice('sensor', $main[0].id);
                        sensorData.params.cId = '';
                        ctrData = _this.searchDevice('controller', $target[0].id);
                        _this.delRelateLine('sensor', $main[0].id);
                    }
                } else if ($main[0].dataset.type == 'space') {
                    _this.searchDevice('sensor', $target[0].id).pId = [];
                } else if ($main[0].dataset.type == 'controller') {
                    sensorData = _this.searchDevice('sensor', $target[0].id);
                    sensorData.params.cId = '';
                    ctrData = _this.searchDevice('controller', $main[0].id);
                    _this.delRelateLine('sensor', $target[0].id);
                }
            }
        },
        searchDevice: function(type, id) {
            for (var i = 0; i < _this.screen.curStore[type].length; i++) {
                if (_this.screen.curStore[type][i]['_id'] == id) {
                    return _this.screen.curStore[type][i];
                }
            }
            return;
        },
        initSaveDetail: function() {
            $('#btnDetailSave').off('click').on('click', function() {
                var postData = _this.screen.curStore;
                var roomInfo = $.extend({}, postData.room)
                delete roomInfo.pId;
                var ajaxNum = 0;
                postData.space.forEach(function(val) {
                    val.baseType = 'groups'
                });
                var postGroup = [roomInfo].concat(postData.space);
                //WebAPI.post('/iot/setIotInfo', [postData.room]).done(function (result) {
                //    console.log(result.status);
                //});
                WebAPI.post('/iot/setIotInfo', postGroup).done(function(result) {
                    console.log(result.status);
                    ajaxNum++;
                    if (ajaxNum == 2) {
                        alert('保存成功');
                        WebAPI.get('/appTemperature/room/update/' + _this.curStore.room['_id'])
                    }
                });
                postData.sensor.forEach(function(val) {
                    val.baseType = 'things'
                });
                //WebAPI.post('/iot/setIotInfo', postData.sensor).done(function (result) {
                //    console.log(result.status);
                //});
                postData.controller.forEach(function(val) {
                    val.baseType = 'things'
                });
                var postThing = postData.sensor.concat(postData.controller);
                WebAPI.post('/iot/setIotInfo', postThing).done(function(result) {
                    console.log(result.status);
                    ajaxNum++;
                    if (ajaxNum == 2) {
                        alert('保存成功');
                        WebAPI.get('/appTemperature/room/update/' + _this.curStore.room['_id'])
                    }
                });
                if (_this.delete[0].id.length > 0 || _this.delete[1].id.length > 0) {
                    WebAPI.post('/iot/delIotInfo', { itemList: _this.delete }).done(function(result) {
                        console.log(result.status);
                        _this.delete[0].id = [];
                        _this.delete[1].id = [];
                    });
                }
            });
        },
        setRelateLine: function(type, id, x, y) {
            var relateLine = $('.relateLine[data-' + type + '="' + id + '"]');
            if (type == 'sensor') {
                relateLine.attr({ 'x1': x, 'y1': y })
            } else {
                relateLine.attr({ 'x2': x, 'y2': y })
            }
        },
        addRelateLine: function(sensor, ctr) {
            var ctnSvg = document.getElementById('ctnSvg');
            var relateLine;
            relateLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            relateLine.className.baseVal = 'relateLine';
            relateLine.setAttribute('x1', sensor.params.gps[0]);
            relateLine.setAttribute('y1', sensor.params.gps[1]);
            relateLine.setAttribute('x2', ctr.params.gps[0]);
            relateLine.setAttribute('y2', ctr.params.gps[1]);
            relateLine.setAttribute('data-sensor', sensor['_id']);
            relateLine.setAttribute('data-controller', ctr['_id']);
            ctnSvg.appendChild(relateLine);
        },
        delRelateLine: function(type, id) {
            var relateLine = $('.relateLine[data-' + type + '="' + id + '"]');
            relateLine.remove();
        },
        delRelateSensor: function($target) {
            if ($target[0].dataset.type == 'space') {
                for (var i = 0; i < _this.curStore.sensor.length; i++) {
                    if (_this.curStore.sensor[i].pId[0] == $target[0].id) {
                        _this.curStore.sensor[i].pId[0] = _this.curStore.room['_id'];
                        break;
                    }
                }
            } else if ($target[0].dataset.type == 'controller') {
                for (var i = 0; i < _this.curStore.sensor.length; i++) {
                    if (_this.curStore.sensor[i].params.cId == $target[0].id) {
                        _this.curStore.sensor[i].params.cId = '';
                    }
                }
            }
        },
        initUserRole: function() {
            var modalContent = document.getElementById('divUserRoleInfo');
            var $modal = $('#modalUserRoleInfo');
            $('#btnUserRole').off('click.tool').on('click.tool', function(e) {
                modalContent.innerHTML = '';
                if (_this.curStore && _this.curStore.room) {
                    WebAPI.get('/appTemperature/room/getUserList/' + _this.curStore.room['_id']).done(function(result) {
                        var list = result.list;
                        if (list.length == 0) return;
                        var user, name, photo, select, del;
                        for (var i = 0; i < list.length; i++) {
                            user = document.createElement('div');
                            user.className = 'divUserRole';
                            user.dataset.userId = list[i].userId;

                            photo = document.createElement('img');
                            photo.className = 'imgPhoto';
                            photo.src = 'https://beopweb.oss-cn-hangzhou.aliyuncs.com' + list[i].img;

                            name = document.createElement('label');
                            name.className = 'spUserName';
                            name.textContent = list[i].name;

                            if (list[i].grade == '30') {
                                select = document.createElement('span');
                                select.className = 'selUserRole';
                                select.innerHTML = '创建者';
                                select.value = list[i].grade;
                            } else {
                                select = document.createElement('select');
                                select.className = 'selUserRole';
                                select.innerHTML =
                                    '<option value="0">游客</option>\
                                    <option value="10">管理员</option>\
                                    <option value="20">物业</option>';
                                select.value = list[i].grade;
                            }

                            del = document.createElement('span');
                            del.className = 'btnUserRemove glyphicon glyphicon-remove';

                            user.appendChild(photo);
                            user.appendChild(name);
                            user.appendChild(select);
                            user.appendChild(del);
                            modalContent.appendChild(user);
                        }
                        $modal.modal('show');
                    });
                    $(modalContent).off('click').on('click', '.btnUserRemove', function(e) {
                        var roomId = _this.curStore.room['_id'];
                        var userId = $(e.currentTarget).parent()[0].dataset.userId;
                        Spinner.spin(ElScreenContainer);
                        WebAPI.get('/appTemperature/room/removeUser/' + userId + '/' + roomId).done(function() {
                            $(e.currentTarget).parent().remove();
                            alert('用户关系删除成功！')
                        }).always(function() {
                            Spinner.stop();
                        })
                    });
                    $(modalContent).off('change').on('change', '.selUserRole', function(e) {
                        var postData = {
                            roomId: _this.curStore.room['_id'],
                            userId: $(e.currentTarget).parent()[0].dataset.userId,
                            grade: $(e.currentTarget).val()
                        };
                        Spinner.spin(ElScreenContainer);
                        WebAPI.post('/appTemperature/room/setUserGrade', postData).done(function() {
                            alert('用户权限更改成功！')
                        }).always(function() {
                            Spinner.stop();
                        })
                    })
                } else {
                    alert('请选择房间！')
                }
            });
        },
        initJqSvg: function() {
            String.prototype.trim = function() {
                return this.replace(/(^\s*)|(\s*$)/g, '');
            };
            $.fn.extend({
                hasClassEx: function(arg) {
                    if (this[0] instanceof SVGElement) {
                        return this[0].getAttribute('class').indexOf(arg) > -1
                    } else {
                        return this.hasClass(arg)
                    }
                },
                addClassEx: function(arg) {
                    if (this[0] instanceof SVGElement) {
                        var className;
                        for (var i = 0; i < this.length; i++) {
                            className = this[i].getAttribute('class');
                            if (className.indexOf(arg) > -1) continue;
                            if (className.length == 0) {
                                this[i].setAttribute('class', arg)
                            } else {
                                this[i].setAttribute('class', className + ' ' + arg)
                            }
                        }
                        return this;
                    } else {
                        return this.addClass(arg)
                    }
                },
                removeClassEx: function(arg) {
                    if (this[0] instanceof SVGElement) {
                        var className;
                        for (var i = 0; i < this.length; i++) {
                            className = this[i].getAttribute('class');
                            this[i].setAttribute('class', className.replace(arg, '').trim());
                        }
                        return this;
                    } else {
                        return this.removeClass(arg)
                    }
                }
            })
        },
        offsetAdjust: function(target, x, y) {

        }
    };
    return ConfigTool;
})();
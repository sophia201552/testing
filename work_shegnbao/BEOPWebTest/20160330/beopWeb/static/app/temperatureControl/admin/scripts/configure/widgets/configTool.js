var ConfigTool = (function(){
    var _this;
    function ConfigTool(screen){
        _this = this;
        this.screen = screen;
        this.curStore = undefined;
        this.mapOffset = undefined;
        this.tempEvent = undefined;
        this.toolStatus = undefined;
        this.eventStatus = undefined;
        this.mouseUpTime = undefined;
        this.dictAttr = undefined;
        this.delete = [{id:[],type:'groups'},{id:[],type:'things'}];
        this.map = {
            offsetX:0,
            offsetY:0,
            imgX:0,
            imgY:0,
            mapX:0,
            mapY:0
        }
    }
    ConfigTool.prototype = {
        init:function(){
            _this.tempEvent = [];
            _this.toolStatus = 'init';
            _this.eventStatus = 'init';
            _this.curStore = _this.screen.curStore;
            _this.initOffsetSum();
            _this.initToolSel();
            _this.initMapImport();
            _this.initDirectAndScale();
            _this.initAddSpace();
            _this.initEleMoveAndClick();
            _this.initAddOuterWall();
            _this.initAddController();
            _this.initAddSensor();
            _this.initRelate();
            _this.initUserRole();
            _this.initSaveDetail();
            _this.initDelete();
        },
        initOffsetSum:function(){
            function getOffsetSum(ele){
                var top= 0,left=0;
                while(ele){
                    top+=ele.offsetTop;
                    left+=ele.offsetLeft;
                    ele=ele.offsetParent;
                }
                return {
                    top:top,
                    left:left
                }
            }
            var $containerMap = $('#containerMap');
            var $divMap = $('#divConfigMapInfo');
            this.mapOffset = getOffsetSum($containerMap[0]);
            $divMap.off('resize').on('resize',function(){
                _this.mapOffset = getOffsetSum($containerMap[0]);
            })
        },
        initEventJudge:function(){
            var $containerMap = $('#containerMap');
            $containerMap.off('mousedown')
        },
        initToolSel:function(){
            var $btnConfigTool = $('.btnConfigTool');
            $btnConfigTool.off('click.manager').on('click.manager',function(e){
                removeToolSel(e);
                $(e.currentTarget).addClass('selected');
                $('.divMapTool').css('display','none');
            });
            var $containerMap = $('#containerMap');
            $containerMap.off('contextmenu').on('contextmenu',function(e){
                removeToolSel(e);
                return false;
            });
            function removeToolSel(e){
                if (e.which != 3 && !$(e.target).hasClass('btnConfigTool'))return;
                _this.toolStatus = 'init';
                _this.eventStatus = 'init';
                $('.btnConfigTool.selected').removeClass('selected');
                for (var i=0;i<_this.tempEvent.length;i++){
                    $containerMap.off(_this.tempEvent[i]);
                }
                $('.divMapTool').css('display','');
                $('.main').removeClass('main');
                $('.relate').removeClass('relate');
                $containerMap.on('contextmenu',function(e){
                    removeToolSel(e);
                    return false;
                });
            }

        },
        initMapImport:function(){
            var $inputMap = $('#inputMap');
            var $imageMap = $('#imageMap');
            $('#btnMapImport').off('click.tool').on('click.tool',function(e){
                _this.toolStatus = 'importMap';
                e.stopPropagation();
                $inputMap.trigger('click');
            });
            var file,fileType,reader;
            fileType = /image*/;
            $inputMap.off('change').on('change',function(e){
                file = e.currentTarget.files[0];
                if (!file.type.match(fileType)) {
                    return;
                }
                reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    $imageMap[0].src = e.target.result;
                    _this.screen.curStore.room.params.map.img = e.target.result;
                    _this.screen.curStore.room.params.map.height = $imageMap.height();
                    _this.screen.curStore.room.params.map.width = $imageMap.width();
                };
            })
        },
        initDirectAndScale:function(){
            var $divDirection = $('#divDirectionTool');
            var directionStatus = 'end';
            var directionCenter,evPos,startAngle,moveAngle,endAngle;
            endAngle = 0;
            $divDirection.off('mousedown').on('mousedown',function(e){
                e.preventDefault();
                if(directionStatus != 'end')return;
                if (isNaN(endAngle))endAngle = 0;
                directionCenter = {
                    x:$divDirection[0].offsetLeft + $divDirection.width()/2,
                    y:$divDirection[0].offsetTop + $divDirection.height()/2
                };
                evPos = {
                    x:e.pageX - _this.mapOffset.left,
                    y:e.pageY - _this.mapOffset.top
                };
                startAngle = 360 * Math.atan2(-(evPos.y - directionCenter.y),(evPos.x - directionCenter.x))/(2*Math.PI);
                directionStatus = 'start';
                console.log('startAngle: ' + startAngle);
            });
            $divDirection.off('mousemove').on('mousemove',function(e){
                e.preventDefault();
                if(directionStatus != 'start' && directionStatus != 'move')return;
                evPos = {
                    x:e.pageX - _this.mapOffset.left,
                    y:e.pageY - _this.mapOffset.top
                };
                moveAngle = 360 * Math.atan2(-(evPos.y - directionCenter.y),(evPos.x - directionCenter.x))/(2*Math.PI);
                $divDirection.css('transform','rotate('+ (endAngle + startAngle - moveAngle) +'deg)');
                console.log('moveAngle: ' + moveAngle);
                console.log('endAngle: ' + endAngle);
                console.log(endAngle + startAngle - moveAngle);
                directionStatus = 'move';
            });
            $divDirection.off('mouseup').on('mouseup',function(e){
                e.preventDefault();
                if(directionStatus != 'move')return;
                endAngle += startAngle - moveAngle;
                _this.screen.curStore.room.params.map.orientation = endAngle;
                directionStatus = 'end';
            });
            $divDirection.off('mouseleave').on('mouseleave',function(e){
                e.preventDefault();
                endAngle += startAngle - moveAngle;
                directionStatus = 'end';
            });
            var $inputScale = $('#inputScale');
            var scale;
            $inputScale.off('input').on('input',function(e){
                scale = Math.pow(10,$(e.currentTarget).val());
                $inputScale.prev().text(scale);
                _this.screen.curStore.room.params.map.scale = scale;
            })
        },
        initAddSpace:function(){
            var $containerMap = $('#containerMap');
            var xStart,yStart,xEnd,yEnd,height,width,evPos;
            var space,topWall,rightWall,bottomWall,leftWall,rightTopCorner,rightBottomCorner,leftTopCorner,leftBottomCorner;
            var $mapTool = $('.divMapTool');
            this.tempEvent.push('mousedown.temp','mousemove.temp','mouseup.temp');
            $('#btnAddSpace').off('click.tool').on('click.tool',function(e){
                _this.toolStatus = 'addSpace';
                $mapTool.css('display','none');
                var addSpaceStatus = 'end';
                var id='';
                $containerMap.off('mousedown.temp').on('mousedown.temp',function(e){
                    e.preventDefault();
                    if (e.which != 1)return;
                    if ($(e.target).hasClass('divMapEle'))return;
                    if(addSpaceStatus != 'end')return;
                    evPos = {
                        x:e.pageX - _this.mapOffset.left,
                        y:e.pageY - _this.mapOffset.top
                    };
                    $containerMap.css('cursor','crosshair');
                    xStart = evPos.x;
                    yStart = evPos.y;
                    space = document.createElement('div');
                    space.className = 'divSpace divMapEle selected';
                    space.dataset.type = 'space';
                    space.dataset.relate = 'sensor';
                    space.dataset.sensor = '';
                    space.style.left = xStart + 'px';
                    space.style.top = yStart + 'px';

                    topWall = document.createElement('div');
                    topWall.className = 'topWall wall divMapEle';
                    topWall.dataset.orient = 'top';

                    rightWall = document.createElement('div');
                    rightWall.className = 'rightWall wall divMapEle';
                    rightWall.dataset.orient = 'right';

                    bottomWall = document.createElement('div');
                    bottomWall.className = 'bottomWall wall divMapEle';
                    bottomWall.dataset.orient = 'bottom';

                    leftWall = document.createElement('div');
                    leftWall.className = 'leftWall wall divMapEle';
                    leftWall.dataset.orient = 'left';

                    rightTopCorner = document.createElement('div');
                    rightTopCorner.className = 'divCorner rightTopCorner divMapEle';
                    rightTopCorner.dataset.orient = 'rightTop';

                    rightBottomCorner = document.createElement('div');
                    rightBottomCorner.className = 'divCorner rightBottomCorner divMapEle';
                    rightBottomCorner.dataset.orient = 'rightBottom';

                    leftTopCorner = document.createElement('div');
                    leftTopCorner.className = 'divCorner leftTopCorner divMapEle';
                    leftTopCorner.dataset.orient = 'leftTop';

                    leftBottomCorner = document.createElement('div');
                    leftBottomCorner.className = 'divCorner leftBottomCorner divMapEle';
                    leftBottomCorner.dataset.orient = 'leftBottom';

                    space.appendChild(topWall);
                    space.appendChild(rightWall);
                    space.appendChild(bottomWall);
                    space.appendChild(leftWall);

                    space.appendChild(rightTopCorner);
                    space.appendChild(rightBottomCorner);
                    space.appendChild(leftTopCorner);
                    space.appendChild(leftBottomCorner);

                    $containerMap.append(space);
                    addSpaceStatus = 'start';
                });
                $containerMap.off('mousemove.temp').on('mousemove.temp',function(e){
                    e.preventDefault();
                    if(addSpaceStatus != 'start' && addSpaceStatus != 'move')return;
                    evPos = {
                        x:e.pageX - _this.mapOffset.left,
                        y:e.pageY - _this.mapOffset.top
                    };
                    $containerMap.css('cursor','crosshair');
                    width = evPos.x - xStart;
                    height = evPos.y - yStart;
                    space.style.width = width + 'px';
                    space.style.height = height + 'px';
                    addSpaceStatus = 'move';
                });
                $containerMap.off('mouseup.temp').on('mouseup.temp',function(e){
                    e.preventDefault();
                    if(addSpaceStatus != 'move')return;
                    $(space).removeClass('selected');
                    $containerMap.css('cursor','default');
                    id = ObjectId();
                    space.id = id;
                    _this.screen.curStore.space.push({
                        '_id':id,
                        'name':'',
                        '_idProj':_this.screen.curStore.room['_idProj'],
                        'arrP':{},
                        'pId': _this.screen.curStore.room['_id'],
                        'prefix':'',
                        'projId':_this.screen.curStore.room['projId'],
                        'type':'GroupSpace',
                        'weight':0,
                        'params': {
                            'arrWallIds': [],
                            'path':[],
                            'width': space.offsetWidth,
                            'height': space.offsetHeight,
                            'x': space.offsetLeft,
                            'y': space.offsetTop
                        },
                        baseType:'groups'
                    });
                    addSpaceStatus = 'end';
                })
            })
        },
        //initAddSpace:function(){
        //    var $containerMap = $('#containerMap');
        //    var svgWall = document.getElementById('ctnSvgWall');
        //    var xStart,yStart,xEnd,yEnd,height,width,evPos;
        //    var pathAttr = '';
        //    var $mapTool = $('.divMapTool');
        //    var wallPath,pathNum,line,arrPath,node,status,div;
        //    this.tempEvent.push('click.temp','mousemove.temp');
        //    $('#btnAddSpace').off('click.tool').on('click.tool',function(e){
        //        pathNum = 0;
        //        _this.toolStatus = 'addouterWall';
        //        $mapTool.css('display','none');
        //        status = 'end';
        //        arrPath = [];
        //        $containerMap.off('click.temp').on('click.temp',function(e){
        //            e.preventDefault();
        //            if (e.which != 1)return;
        //            if ($(e.target).attr('class') && $(e.target).attr('class').indexOf('divMapEle') > -1)return;
        //            if(status != 'end' && status != 'move')return;
        //            evPos = {
        //                x:e.pageX - _this.mapOffset.left,
        //                y:e.pageY - _this.mapOffset.top
        //            };
        //            if (_this.pathClose(arrPath,evPos)){
        //                status = 'end';
        //                $containerMap.css('cursor','default');
        //                arrPath[2 * pathNum] = 'L' + arrPath[0].slice(1);
        //                arrPath[2 * pathNum + 1] = arrPath[1];
        //                pathAttr = arrPath.join(' ');
        //                pathNum = 0;
        //                pathAttr +=' ' + 'Z';
        //                wallPath.setAttribute('d',pathAttr);
        //                return;
        //            }
        //            xStart = evPos.x;
        //            yStart = evPos.y;
        //            if (pathNum == 0) {
        //                $containerMap.css('cursor','crosshair');
        //                pathAttr = '';
        //                arrPath = [];
        //                wallPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        //                wallPath.className.baseVal = 'pathSpace pathWall divMapEle';
        //
        //                div = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        //                div.className.baseVal = 'divSpace';
        //                div.appendChild(wallPath);
        //                svgWall.appendChild(div);
        //                pathAttr = 'M'+ xStart + ' ' + yStart;
        //            }
        //            line = 'L' + xStart + ' ' + yStart;
        //            node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        //            node.className.baseVal = 'divCorner';
        //            node.setAttribute('cx',evPos.x);
        //            node.setAttribute('cy',evPos.y);
        //            node.setAttribute('r',10);
        //            if (pathNum == 0){
        //                node.className.baseVal += ' startWallNode';
        //            }
        //            div.appendChild(node);
        //
        //
        //            pathAttr += ' ' + line;
        //            arrPath = pathAttr.split(' ');
        //            wallPath.setAttribute('d',pathAttr);
        //            console.log(pathAttr);
        //            status = 'start';
        //            pathNum++;
        //        });
        //        $containerMap.off('mousemove.temp').on('mousemove.temp',function(e){
        //            e.preventDefault();
        //            if(status != 'start' && status != 'move')return;
        //            evPos = {
        //                x:e.pageX - _this.mapOffset.left,
        //                y:e.pageY - _this.mapOffset.top
        //            };
        //            if (e.ctrlKey && _this.pathClose(arrPath,evPos,true)){
        //                line = 'L' + arrPath[0].slice(1) + ' ' + arrPath[1] + ' ';
        //                arrPath[2 * pathNum] = 'L' + evPos.x;
        //                arrPath[2 * pathNum + 1] = evPos.y;
        //            }else {
        //                line = 'L' + xStart + ' ' + yStart;
        //                arrPath[2 * pathNum] = 'L' + evPos.x;
        //                arrPath[2 * pathNum + 1] = evPos.y;
        //            }
        //            pathAttr = arrPath.join(' ');
        //            wallPath.setAttribute('d',pathAttr);
        //            console.log(pathAttr);
        //            $containerMap.css('cursor','crosshair');
        //            status = 'move';
        //        });
        //    })
        //},
        initEleMoveAndClick: function(){
            var $containerMap = $('#containerMap');
            var $mapTool = $('.divMapTool');
            var spaceStatus = 'end';
            var xStart,yStart,evPos,initPos,$target;
            var spaceH,spaceW,spaceLeft,spaceTop;
            var targetData;
            $containerMap.off('mousedown.general').on('mousedown.general',function(e){
                if(spaceStatus != 'end')return;
                targetData = null;
                if( !($(e.target).attr('class') && $(e.target).attr('class').indexOf('divMapEle') > -1 )){
                    $('.divMapEle.selected').removeClass('selected');
                    return;
                }
                $target = $(e.target);
                if ($target.hasClass('wall') || $target.hasClass('divCorner')){
                    spaceH = $target.parent()[0].offsetHeight;
                    spaceW = $target.parent()[0].offsetWidth;
                    spaceTop = $target.parent()[0].offsetTop;
                    spaceLeft = $target.parent()[0].offsetLeft;
                    initPos = {
                        x: $target.parent()[0].offsetLeft,
                        y: $target.parent()[0].offsetTop,
                        h:$target.parent()[0].offsetHeight,
                        w:$target.parent()[0].offsetWidth
                    };
                }else {
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
                if ($target[0].dataset.type){
                    targetData = _this.searchDevice($target[0].dataset.type,$target[0].id)
                }
            });
            $containerMap.off('mousemove.general').on('mousemove.general',function(e){
                if(spaceStatus != 'start' && spaceStatus != 'move')return;
                _this.eventStatus = 'moveSpace';
                $('.divMapEle.selected').removeClass('selected');
                $target.addClass('selected');
                $mapTool.css('display','none');
                evPos = {
                    x:e.pageX - _this.mapOffset.left,
                    y:e.pageY - _this.mapOffset.top
                };
                console.log ($(e.target)[0].className);
                if ($target.hasClass('wall') || $target.hasClass('divCorner')){
                    //switch ($target[0].dataset.orient){
                    //    case 'top':
                    //        spaceTop = initPos.y + evPos.y - yStart;
                    //        spaceH = initPos.h - evPos.y + yStart;
                    //        break;
                    //    case 'bottom':
                    //        spaceH = initPos.h + evPos.y - yStart;
                    //        break;
                    //    case 'left':
                    //        spaceLeft = initPos.x + evPos.x - xStart;
                    //        spaceW = initPos.w - evPos.x + xStart;
                    //        break;
                    //    case 'right':
                    //        spaceW = initPos.w + evPos.x - xStart;
                    //        break;
                    //    case 'leftTop':
                    //        spaceLeft = initPos.x + evPos.x - xStart;
                    //        spaceW = initPos.w - evPos.x + xStart;
                    //        spaceTop = initPos.y + evPos.y - yStart;
                    //        spaceH = initPos.h - evPos.y + yStart;
                    //        break;
                    //    case 'leftBottom':
                    //        spaceLeft = initPos.x + evPos.x - xStart;
                    //        spaceW = initPos.w - evPos.x + xStart;
                    //        spaceH = initPos.h + evPos.y - yStart;
                    //        break;
                    //    case 'rightTop':
                    //        spaceW = initPos.w + evPos.x - xStart;
                    //        spaceTop = initPos.y + evPos.y - yStart;
                    //        spaceH = initPos.h - evPos.y + yStart;
                    //        break;
                    //    case 'rightBottom':
                    //        spaceW = initPos.w + evPos.x - xStart;
                    //        spaceH = initPos.h + evPos.y - yStart;
                    //}
                    $target.parent().css({
                        height:spaceH,
                        width:spaceW,
                        left:spaceLeft,
                        top:spaceTop
                    });
                }else {
                    $target.css('cursor','default');
                    $target.css({
                        left: initPos.x + evPos.x - xStart,
                        top: initPos.y + evPos.y - yStart
                    });
                    if (targetData){
                        _this.setRelateLine($target[0].dataset.type,$target[0].id,
                                        initPos.x + evPos.x - xStart + $target.width()/2,initPos.y + evPos.y - yStart + $target.height()/2);
                    }
                }
                spaceStatus = 'move';
            });
            $containerMap.off('mouseup.general').on('mouseup.general',function(e){
                if(_this.toolStatus != 'addSensor' && _this.toolStatus != 'addController') {
                    if (spaceStatus == 'start') {
                        //$('.divMapEle.relate').removeClass('relate');
                        if (!_this.mouseUpTime) {
                            _this.mouseUpTime = new Date();
                            if ($target.hasClass('selected')) {
                                $target.removeClass('selected');
                            } else {
                                $('.divMapEle.selected').removeClass('selected');
                                //$('.divMapEle.relate').removeClass('relate');
                                $target.addClass('selected');
                                //var arrRelateId = $target.attr('data-relate').split(' ');
                                //for (var i = 0;i < arrRelateId.length;i++){
                                //    $('#'+arrRelateId[i]).addClass('relate');
                                //}
                            }
                        }else {
                            if (new Date() - _this.mouseUpTime < 300){
                                _this.showDeviceModal($target);
                            }else {
                                if ($target.hasClass('selected')) {
                                    $target.removeClass('selected');
                                } else {
                                    $('.divMapEle.selected').removeClass('selected');
                                    //$('.divMapEle.relate').removeClass('relate');
                                    $target.addClass('selected');
                                    //var arrRelateId = $target.attr('data-relate').split(' ');
                                    //for (var i = 0;i < arrRelateId.length;i++){
                                    //    $('#'+arrRelateId[i]).addClass('relate');
                                    //}
                                }
                            }
                             _this.mouseUpTime = new Date();
                        }
                    } else if ((spaceStatus == 'move')) {
                        $mapTool.css('display', '');
                        if ($target.hasClass('divSpace')) {
                            targetData.params.x = initPos.x + evPos.x - xStart;
                            targetData.params.y = initPos.y + evPos.y - yStart;
                            //for (var i = 0; i < _this.screen.curStore.space.length; i++) {
                            //    if (_this.screen.curStore.space[i]['_id'] == $target.attr('id')) {
                            //        _this.screen.curStore.space[i].params.x = initPos.x + evPos.x - xStart;
                            //        _this.screen.curStore.space[i].params.y = initPos.y + evPos.y - yStart;
                            //        break;
                            //    }
                            //}
                        }else if($target.hasClass('divSensor')){
                            targetData.params.gps[0] = initPos.x + evPos.x - xStart + $target.width()/2;
                            targetData.params.gps[1] = initPos.y + evPos.y - yStart + $target.height()/2;
                            //for (var i = 0; i < _this.screen.curStore.sensor.length; i++) {
                            //    if (_this.screen.curStore.sensor[i]['_id'] == $target.attr('id')) {
                            //        _this.screen.curStore.sensor[i].params.gps[0] = initPos.x + evPos.x - xStart + $target.width()/2;
                            //        _this.screen.curStore.sensor[i].params.gps[1] = initPos.y + evPos.y - yStart + $target.height()/2;
                            //        _this.setRelateLine('sensor',_this.screen.curStore.sensor[i]['_id'],
                            //            _this.screen.curStore.sensor[i].params.gps[0],_this.screen.curStore.sensor[i].params.gps[1]);
                            //        break;
                            //    }
                            //}
                        }else if($target.hasClass('divController')){
                            targetData.params.gps[0] = initPos.x + evPos.x - xStart + $target.width()/2;
                            targetData.params.gps[1] = initPos.y + evPos.y - yStart + $target.height()/2;
                            //for (var i = 0; i < _this.screen.curStore.controller.length; i++) {
                            //    if (_this.screen.curStore.controller[i]['_id'] == $target.attr('id')) {
                            //        _this.screen.curStore.controller[i].params.gps[0] = initPos.x + evPos.x - xStart + $target.width()/2;
                            //        _this.screen.curStore.controller[i].params.gps[1] = initPos.y + evPos.y - yStart + $target.height()/2;
                            //        _this.setRelateLine('controller',_this.screen.curStore.controller[i]['_id'],
                            //            _this.screen.curStore.controller[i].params.gps[0],_this.screen.curStore.controller[i].params.gps[1]);
                            //        break;
                            //    }
                            //}
                        }else if($target.hasClass('divCorner') || $target.hasClass('wall')){
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
        initAddOuterWall:function(){
            var $containerMap = $('#containerMap');
            var svgWall = document.getElementById('ctnSvgWall');
            var xStart,yStart,xEnd,yEnd,height,width,evPos;
            var pathAttr = '';
            var $mapTool = $('.divMapTool');
            var wallPath,pathNum,line,arrPath,node,status,div;
            this.tempEvent.push('click.temp','mousemove.temp');
            $('#btnAddWall').off('click.tool').on('click.tool',function(e){
                pathNum = 0;
                _this.toolStatus = 'addouterWall';
                $mapTool.css('display','none');
                status = 'end';
                arrPath = [];
                $containerMap.off('click.temp').on('click.temp',function(e){
                    e.preventDefault();
                    if (e.which != 1)return;
                    if ($(e.target).hasClass('divMapEle'))return;
                    if(status != 'end' && status != 'move')return;
                    evPos = {
                        x:e.pageX - _this.mapOffset.left,
                        y:e.pageY - _this.mapOffset.top
                    };
                    if (_this.pathClose(arrPath,evPos)){
                        status = 'end';
                        $containerMap.css('cursor','default');
                        arrPath[2 * pathNum] = 'L' + arrPath[0].slice(1);
                        arrPath[2 * pathNum + 1] = arrPath[1];
                        pathAttr = arrPath.join(' ');
                        pathNum = 0;
                        pathAttr +=' ' + 'Z';
                        wallPath.setAttribute('d',pathAttr);
                        return;
                    }
                    $containerMap.css('cursor','crosshair');
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
                        pathAttr = 'M'+ xStart + ' ' + yStart;
                    }
                    line = 'L' + xStart + ' ' + yStart;
                    node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    node.className.baseVal = 'wallNode';
                    node.setAttribute('cx',evPos.x);
                    node.setAttribute('cy',evPos.y);
                    node.setAttribute('r',10);
                    if (pathNum == 0){
                        node.className.baseVal += ' startWallNode';
                    }
                    div.appendChild(node);


                    pathAttr += ' ' + line;
                    arrPath = pathAttr.split(' ');
                    wallPath.setAttribute('d',pathAttr);
                    console.log(pathAttr);
                    status = 'start';
                    pathNum++;
                });
                $containerMap.off('mousemove.temp').on('mousemove.temp',function(e){
                    e.preventDefault();
                    if(status != 'start' && status != 'move')return;
                    evPos = {
                        x:e.pageX - _this.mapOffset.left,
                        y:e.pageY - _this.mapOffset.top
                    };
                    if (e.ctrlKey && _this.pathClose(arrPath,evPos,true)){
                        line = 'L' + arrPath[0].slice(1) + ' ' + arrPath[1] + ' ';
                        arrPath[2 * pathNum] = 'L' + evPos.x;
                        arrPath[2 * pathNum + 1] = evPos.y;
                    }else {
                        line = 'L' + xStart + ' ' + yStart;
                        arrPath[2 * pathNum] = 'L' + evPos.x;
                        arrPath[2 * pathNum + 1] = evPos.y;
                    }
                    pathAttr = arrPath.join(' ');
                    wallPath.setAttribute('d',pathAttr);
                    console.log(pathAttr);
                    $containerMap.css('cursor','crosshair');
                    status = 'move';
                });
            })
        },
        pathClose:function(arrPath,cur,mode){
            var min = 30;
            var max = 80;
            var judge = mode?min:max;
            if (arrPath.length < 2)return;
            if(Math.abs(arrPath[0].slice(1) - cur.x) < judge && Math.abs(arrPath[1] - cur.y) < judge){
                return true
            }
            return false;
        },
        getPathSize:function(arrPath){

        },
        initAddController:function(){
            var strController = new StringBuilder();
            strController.append('<div class="divController divMapEle glyphicon glyphicon-cog" data-sensor="" data-type="controller" data-relate="sensor"></div>');
            var $containerMap = $('#containerMap');
            var $mapTool = $('.divMapTool');
            var evPos,$divController;
            this.tempEvent.push('click.temp');
            $('#btnAddController').on('click.tool',function(e){
                _this.toolStatus = 'addController';
                $mapTool.css('display','none');
                $containerMap.off('click.temp').on('click.temp',function(e){
                    //if(!$(e.target).hasClass('divMapEle')){
                    //    return;
                    //}
                    if(_this.eventStatus == 'moveSpace'){
                        _this.eventStatus = 'init';
                        return;
                    }
                    var id= ObjectId();
                    evPos = {
                        x:e.pageX - _this.mapOffset.left,
                        y:e.pageY - _this.mapOffset.top
                    };
                    $divController = $(strController.toString());
                    $containerMap.append($divController);
                    $divController.css({
                        left:evPos.x - $divController.width()/2,
                        top:evPos.y - $divController.height()/2
                    });
                    $('.divMapEle.selected').removeClass('selected');
                    $divController.addClass('selected');
                    $divController.attr('id',id);
                    _this.screen.curStore.controller.push({
                        '_id':id,
                        'arrP': [],
                        'name': "",
                        'pId': _this.screen.curStore.room['_id']?_this.screen.curStore.room['_id']:'',
                        'path': "",
                        'prefix': "",
                        'projId': _this.screen.curStore.room['projId'],
                        'type': "ControllerFCU",
                        'params': {
                            'gatewayId': '',
                            'type': 0,
                            'gps': [evPos.x , evPos.y ],
                            'mac': '',
                            'address': ''
                        },
                        baseType:'things'
                    })
                })
            })
        },
        initAddSensor:function(){
            var strSensor = new StringBuilder();
            strSensor.append('<div class="divSensor divMapEle glyphicon glyphicon-eye-open" data-space="" data-controller="" data-type="sensor" data-relate="space controller"></div>');
            var $containerMap = $('#containerMap');
            var $mapTool = $('.divMapTool');
            var evPos,$divSensor;
            this.tempEvent.push('click.temp');
            $('#btnAddSensor').off('click.tool').on('click.tool',function(e){
                _this.toolStatus = 'addSensor';
                $mapTool.css('display','none');
                $containerMap.off('click.temp').on('click.temp',function(e){
                    //if(!$(e.target).hasClass('divMapEle')){
                    //    return;
                    //}
                    if(_this.eventStatus == 'moveSpace'){
                        _this.eventStatus = 'init';
                        return;
                    }
                    var id = ObjectId();
                    evPos = {
                        x:e.pageX - _this.mapOffset.left,
                        y:e.pageY - _this.mapOffset.top
                    };
                    $divSensor = $(strSensor.toString());
                    $containerMap.append($divSensor);
                    $divSensor.css({
                        left:evPos.x - $divSensor.width()/2,
                        top:evPos.y - $divSensor.height()/2
                    });
                    $('.divMapEle.selected').removeClass('selected');
                    $divSensor.addClass('selected');
                    $divSensor.attr('id',id);
                    var spaceRelate;
                    if ($(e.target).hasClass('divSpace')){
                        $divSensor[0].dataset.space = $(e.target).attr('id');
                        $(e.target)[0].dataset.sensor +=' '+ id;
                        _this.screen.curStore.sensor.push({
                            '_id':id,
                            'arrP': [],
                            'name': "",
                            'pId': [$(e.target).attr('id')],
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
                            baseType:'things'
                        })
                    }else{
                        _this.screen.curStore.sensor.push({
                            '_id':id,
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
                                'gps': [evPos.x , evPos.y ],
                                'mac': '',
                                'address': ''
                            },
                            baseType:'things'
                        })
                    }
                })
            })
        },
        initDelete:function(){
            $(document).off('keyup.general').on('keyup.general',function(e){
                if (e.keyCode!= 46 || e.target.tagName != 'BODY')return;
                var $target = $('.divMapEle.selected');
                var del;
                if ($target.length == 0 )return;
                for (var i = 0; i < _this.screen.curStore[$target[0].dataset.type].length; i++){
                    if ($target[0].id == _this.screen.curStore[$target[0].dataset.type][i]['_id']){
                        del = _this.screen.curStore[$target[0].dataset.type].splice(i,1)[0];
                        if ($target[0].dataset.type == 'space'){
                            _this.delete[0].id.push(del['_id']);
                        }else {
                            _this.delete[1].id.push(del['_id']);
                            _this.delRelateLine($target[0].dataset.type,del['_id'])
                        }
                        break;
                    }
                }
                _this.delRelateSensor($target);
                $target.remove();
            });
        },
        showDeviceModal:function($target){
            var $modal = $('#modalConfigDeviceInfo');
            var $modalContent = $('#divConfigDeviceInfo');
            var $iptName = $('#iptDeviceName');
            var $iptPrefix = $('#iptDevicePrefix');
            var id = $target[0].id;
            if ($target.hasClass('divSpace')){
                for (var i = 0; i < _this.screen.curStore.space.length; i++){
                    if (_this.screen.curStore.space[i]['_id'] == id){
                        $iptName.val(_this.screen.curStore.space[i].name);
                        $iptPrefix.val(_this.screen.curStore.space[i].prefix);
                        $modal.modal('show');
                        _this.saveDeviceModal(_this.screen.curStore.space[i]);
                        break;
                    }
                }
            }else if ($target.hasClass('divSensor')){
                for (var i = 0; i < _this.screen.curStore.sensor.length; i++){
                    if (_this.screen.curStore.sensor[i]['_id'] == id){
                        $iptName.val(_this.screen.curStore.sensor[i].name);
                        $iptPrefix.val(_this.screen.curStore.sensor[i].prefix);
                        _this.showDevicePt('SensorTemp',_this.screen.curStore.sensor[i]);
                        _this.saveDeviceModal(_this.screen.curStore.sensor[i]);
                        $modal.modal('show');
                        break;
                    }
                }
            }else if ($target.hasClass('divController')){
                for (var i = 0; i < _this.screen.curStore.controller.length; i++){
                    if (_this.screen.curStore.controller[i]['_id'] == id){
                        $iptName.val(_this.screen.curStore.controller[i].name);
                        $iptPrefix.val(_this.screen.curStore.controller[i].prefix);
                        _this.showDevicePt('ControllerFCU',_this.screen.curStore.controller[i]);
                        $modal.modal('show');
                        _this.saveDeviceModal(_this.screen.curStore.controller[i]);
                        break;
                    }
                }
            }

        },
        showDevicePt:function(device,tarData){
            var _this  = this;
            var $iptGrpDevicePt = $('#iptGrpDevicePt').html('');
            var divPt,iptPt,ipPtLabel;
            var attr = _this.screen.roomTree.dictClass.things[device].attrs;
            for (var ele in attr){
                divPt = document.createElement('div');
                divPt.className = 'checkBox';
                divPt.dataset.attr = ele;

                ipPtLabel = document.createElement('label');
                ipPtLabel.textContent = attr[ele].name;

                iptPt = document.createElement('input');
                iptPt.setAttribute('type','checkbox');
                iptPt.className = 'iptAttrCheck';
                if (tarData.arrP[ele]){
                    iptPt.checked = true;
                }else {
                    iptPt.checked = false;
                }
                iptPt.dataset.attr = ele;

                divPt.appendChild(ipPtLabel);
                divPt.appendChild(iptPt);
                $iptGrpDevicePt.append(divPt);
            }
        },
        saveDeviceModal:function(data){
            var $modal = $('#modalConfigDeviceInfo');
            var $iptName = $('#iptDeviceName');
            var $iptPrefix = $('#iptDevicePrefix');
            //var $divPt = $('#iptGrpDevicePt div');
            $('#btnDeviceInfoConfirm').off('click').on('click',function(){
                var $iptPtCheck = $('#iptGrpDevicePt input:checked');
                var $iptPt = $('#iptGrpDevicePt input');
                for (var i = 0; i < $iptPt.length;i++){
                    data.arrP[$iptPt[i].dataset.attr] = null;
                }
                data.name = $iptName.val();
                data.prefix = $iptPrefix.val();
                if($iptPtCheck.length > 0 && data.prefix != ''){
                    data.arrP = {};
                    WebAPI.get("/point_tool/searchCloudPoint/" + _this.screen.curStore.room.projId + "/" + data.prefix + "/").done(function (result){
                        var rs = result.data["pointTable"];
                        for (var i = 0; i < $iptPtCheck.length; i++) {
                            for (var j = 0; j < rs.length; j++) {
                                if (data.prefix + $iptPtCheck[i].dataset.attr === rs[j]["alias"]) {
                                    data.arrP[$iptPtCheck[i].dataset.attr] = rs[j]["_id"];
                                }
                            }
                        }
                    });
                }
                $modal.modal('hide');
            });
        },
        initRelate:function(){
            var $containerMap = $('#containerMap');
            var arrSpaceId,arrSensorId,arrCtrId,relate;
            var isRelate = false;
            var $divMapEle;
            var $main;
            this.tempEvent.push('click.temp');
            $('#btnRelate').on('click.tool',function(e){
                isRelate = false;
                $containerMap.off('click.temp').on('click.temp',function(e){
                    $divMapEle = $('.divMapEle');
                    var $target = $(e.target);
                    if ($target.hasClass('main')) {
                        $divMapEle.removeClass('relate');
                        $target.removeClass('main');
                        isRelate = false;
                    }else if ($target.hasClass('relate')){
                        _this.setRelateData($target,'del');
                        $target.removeClass('relate');
                    }else if(!isRelate){
                        if ($target.hasClass('divSensor')){
                            arrSpaceId = _this.searchDevice('sensor',$target[0].id).pId;
                            for (var i = 0; i < arrSpaceId.length; i++) {
                                relate = document.getElementById(arrSpaceId[i]);
                                if (relate)relate.className += ' relate'
                            }
                            arrCtrId = _this.searchDevice('sensor',$target[0].id).params.cId;
                            relate = document.getElementById(arrCtrId);
                            if (relate)relate.className += ' relate';
                            $target.addClass('main');
                            isRelate = true;
                        }else if ($target.hasClass('divController')){
                            arrSensorId = $target[0].dataset.sensor;
                            relate = document.getElementById(arrSensorId);
                            if (relate)relate.className +=' relate';
                            $target.addClass('main');
                            isRelate = true;
                        }else if ($target.hasClass('divSpace')){
                            arrSensorId = $target[0].dataset.sensor;
                            relate = document.getElementById(arrSensorId);
                            if (relate)relate.className +=' relate';
                            $target.addClass('main');
                            isRelate = true;
                        }
                    }else{
                        $main = $('.main');
                        if ($main[0].dataset.type != $target[0].dataset.type) {
                            if ($main[0].dataset.relate.indexOf($target[0].dataset.type) > -1){
                                if ($main[0].dataset.type != 'controller'){
                                    if ($target[0].dataset.type == 'controller'){
                                        $('.divController.relate').removeClass('relate');
                                    }else{
                                        $('.divSpace.relate').removeClass('relate');
                                    }
                                }
                                _this.setRelateData($target,'add');
                                $target.addClass('relate');
                            }
                        }
                    }
                })
            })
        },
        setRelateData:function($target,mode){
            var $main = $('.main');
            var sensorData,ctrData;
            if (mode == 'add') {
                $main[0].dataset[$target[0].dataset.type].replace($target[0].id,'');
                $target[0].dataset[$main[0].dataset.type].replace($main[0].id,'');
                if ($main[0].dataset.type == 'sensor'){
                    if ($target[0].dataset.type == 'space'){
                        _this.searchDevice('sensor',$main[0].id).pId = [$target[0].id];
                    }else{
                        //_this.searchDevice('sensor',$main[0].id).params.cId = $target[0].id;
                        sensorData = _this.searchDevice('sensor',$main[0].id);
                        sensorData.params.cId = $target[0].id;
                        ctrData = _this.searchDevice('controller',$target[0].id);
                        _this.addRelateLine(sensorData,ctrData);
                    }
                }else if ($main[0].dataset.type == 'space'){
                    _this.searchDevice('sensor',$target[0].id).pId = [$main[0].id];
                }else if ($main[0].dataset.type == 'controller'){
                    //_this.searchDevice('sensor',$target[0].id).params.cId = $main[0].id;
                    sensorData = _this.searchDevice('sensor',$target[0].id);
                    sensorData.params.cId = $main[0].id;
                    ctrData = _this.searchDevice('controller',$main[0].id);
                    _this.addRelateLine(sensorData,ctrData);
                }
            }else{
                $main[0].dataset[$target[0].dataset.type] += ' ' +  $target[0].id;
                $target[0].dataset[$main[0].dataset.type] += ' ' +  $main[0].id;
                if ($main[0].dataset.type == 'sensor'){
                    if ($target[0].dataset.type == 'space'){
                        _this.searchDevice('sensor',$main[0].id).pId = [];
                    }else{
                        sensorData = _this.searchDevice('sensor',$main[0].id);
                        sensorData.params.cId = '';
                        ctrData = _this.searchDevice('controller',$target[0].id);
                        _this.delRelateLine('sensor',$main[0].id);
                    }
                }else if ($main[0].dataset.type == 'space'){
                    _this.searchDevice('sensor',$target[0].id).pId = [];
                }else if ($main[0].dataset.type == 'controller'){
                    sensorData = _this.searchDevice('sensor',$target[0].id);
                    sensorData.params.cId = '';
                    ctrData = _this.searchDevice('controller',$main[0].id);
                    _this.delRelateLine('sensor',$target[0].id);
                }
            }
        },
        searchDevice:function(type,id){
            for (var i = 0; i < _this.screen.curStore[type].length;i++){
                if (_this.screen.curStore[type][i]['_id'] == id){
                    return _this.screen.curStore[type][i];
                }
            }
            return;
        },
        initSaveDetail:function(){
            $('#btnDetailSave').off('click').on('click',function() {
                var postData = _this.screen.curStore;
                postData.space.forEach(function (val) {
                    val.baseType = 'groups'
                });
                var postGroup = [postData.room].concat(postData.space);
                //WebAPI.post('/iot/setIotInfo', [postData.room]).done(function (result) {
                //    console.log(result.status);
                //});
                WebAPI.post('/iot/setIotInfo', postGroup).done(function (result) {
                    console.log(result.status);
                });
                postData.sensor.forEach(function (val) {
                    val.baseType = 'things'
                });
                //WebAPI.post('/iot/setIotInfo', postData.sensor).done(function (result) {
                //    console.log(result.status);
                //});
                postData.controller.forEach(function (val) {
                    val.baseType = 'things'
                });
                var postThing = postData.sensor.concat(postData.controller);
                WebAPI.post('/iot/setIotInfo', postThing).done(function (result) {
                    console.log(result.status);
                });
                if ( _this.delete[0].id.length > 0 || _this.delete[1].id.length > 0){
                    WebAPI.post('/iot/delIotInfo', _this.delete).done(function (result) {
                        console.log(result.status);
                        _this.delete[0].id =[];
                        _this.delete[1].id = [];
                    });
                }
            });
        },
        setRelateLine:function(type,id,x,y){
            var relateLine = $('.relateLine[data-'+ type +'="'+ id +'"]');
            if (type == 'sensor') {
                relateLine.attr({'x1': x, 'y1': y})
            }else{
                relateLine.attr({'x2': x, 'y2': y})
            }
        },
        addRelateLine:function(sensor,ctr){
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
        delRelateLine:function(type,id){
            var relateLine = $('.relateLine[data-'+ type +'="'+ id +'"]');
            relateLine.remove();
        },
        delRelateSensor:function($target){
            if ($target[0].dataset.type == 'space'){
                for (var i = 0; i < _this.curStore.sensor.length; i++){
                    if (_this.curStore.sensor[i].pId[0] == $target[0].id){
                        _this.curStore.sensor[i].pId[0] = _this.curStore.room['_id'];
                        break;
                    }
                }
            }else if ($target[0].dataset.type == 'controller'){
                for (var i = 0; i < _this.curStore.sensor.length; i++){
                    if (_this.curStore.sensor[i].params.cId == $target[0].id){
                        _this.curStore.sensor[i].params.cId = '';
                    }
                }
            }
        },
        initUserRole:function(){
            var modalContent = document.getElementById('divUserRoleInfo');
            var $modal = $('#modalUserRoleInfo');
            $('#btnUserRole').off('click.tool').on('click.tool',function(e) {
                modalContent.innerHTML = '';
                if (_this.curStore && _this.curStore.room) {
                    WebAPI.get('/appTemperature/room/getUserList/' + _this.curStore.room['_id']).done(function (result) {
                        var list = result.list;
                        if (list.length == 0)return;
                        var user,name,photo,select,del;
                        for (var i = 0; i < list.length ;i++){
                            user = document.createElement('div');
                            user.className = 'divUserRole';
                            user.dataset.userId = list[i].userId;

                            photo = document.createElement('img');
                            photo.className = 'imgPhoto';
                            photo.src = 'http://images.rnbtech.com.hk' + list[i].img;

                            name = document.createElement('label');
                            name.className = 'spUserName';
                            name.textContent = list[i].name;

                            if(list[i].grade == '30'){
                                select = document.createElement('span');
                                select.className = 'selUserRole';
                                select.innerHTML =  '创建者';
                                select.value = list[i].grade;
                            }else {
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
                    $(modalContent).off('click').on('click','.btnUserRemove',function(e){
                        var roomId = _this.curStore.room['_id'];
                        var userId = $(e.currentTarget).parent()[0].dataset.userId;
                        Spinner.spin(ElScreenContainer);
                        WebAPI.get('/appTemperature/room/removeUser/' + userId + '/' + roomId).done(function(){
                            $(e.currentTarget).parent().remove();
                            alert('用户关系删除成功！')
                        }).always(function(){
                            Spinner.stop();
                        })
                    });
                    $(modalContent).off('change').on('change','.selUserRole',function(e){
                        var postData = {
                            roomId:_this.curStore.room['_id'],
                            userId:$(e.currentTarget).parent()[0].dataset.userId,
                            grade:$(e.currentTarget).val()
                        };
                        Spinner.spin(ElScreenContainer);
                        WebAPI.post('/appTemperature/room/setUserGrade',postData).done(function(){
                            alert('用户权限更改成功！')
                        }).always(function(){
                            Spinner.stop();
                        })
                    })
                }else{
                    alert('请选择房间！')
                }
            });
        },
        offsetAdjust:function(target,x,y){

        }
    };
    return ConfigTool;
})();

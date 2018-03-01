var ConfigTool = (function(){
    var _this;
    function ConfigTool(screen){
        _this = this;
        this.screen = screen;
        this.mapOffset = undefined;
        this.tempEvent = undefined;
        this.toolStatus = undefined;
        this.eventStatus = undefined;
    }
    ConfigTool.prototype = {
        show:function(){
            _this.init();
        },
        init:function(){
            _this.tempEvent = [];
            _this.toolStatus = 'init';
            _this.eventStatus = 'init';
            _this.initOffsetSum();
            _this.initToolSel();
            _this.initMapImport();
            _this.initDirectAndScale();
            _this.initAddSpace();
            _this.initEleMoveAndClick();
            _this.initAddOuterWall();
            _this.initAddController();
            _this.initAddSensor();
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
                    _this.screen.curBase.map.img = e.target.result;
                    _this.screen.curBase.map.height = $imageMap.height();
                    _this.screen.curBase.map.width = $imageMap.width();
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
                _this.screen.curBase.map.orientation = endAngle;
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
                _this.screen.curBase.map.scale = scale;
            })
        },
        initAddSpace:function(){
            var $containerMap = $('#containerMap');
            var $space,strSpace,xStart,yStart,xEnd,yEnd,height,width,evPos;
            var $mapTool = $('.divMapTool');
            this.tempEvent.push('mousedown.temp','mousemove.temp','mouseup.temp');
            $('#btnAddSpace').off('click.tool').on('click.tool',function(e){
                _this.toolStatus = 'addSpace';
                $mapTool.css('display','none');
                var addSpaceStatus = 'end';
                $containerMap.off('mousedown.temp').on('mousedown.temp',function(e){
                    e.preventDefault();
                    if (e.which != 1)return;
                    if ($(e.target).hasClass('divSpace'))return;
                    if(addSpaceStatus != 'end')return;
                    evPos = {
                        x:e.pageX - _this.mapOffset.left,
                        y:e.pageY - _this.mapOffset.top
                    };
                    $containerMap.css('cursor','crosshair');
                    xStart = evPos.x;
                    yStart = evPos.y;
                    strSpace = new StringBuilder();
                    strSpace.append('<div class="divSpace selected divMapEle" data-relate="" style="left:'+ xStart +'px;top:' + yStart + 'px">');
                    strSpace.append('   <div class="topWall wall"></div>');
                    strSpace.append('   <div class="rightWall wall"></div>');
                    strSpace.append('   <div class="bottomWall wall"></div>');
                    strSpace.append('   <div class="leftWall wall"></div>');
                    strSpace.append('</div>');
                    $space = $(strSpace.toString());
                    $space.attr('id',ObjectId());
                    $containerMap.append($space);
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
                    $space.css({
                        'height':height,
                        'width':width
                    });
                    addSpaceStatus = 'move';
                });
                $containerMap.off('mouseup.temp').on('mouseup.temp',function(e){
                    e.preventDefault();
                    if(addSpaceStatus != 'move')return;
                    $space.removeClass('selected');
                    $containerMap.css('cursor','default');
                    _this.screen.curArrSpace.push({
                        'id': $space.attr('id'),
                        'name':'BOSS竞技场',
                        'path':'',
                        'width': $space.width(),
                        'height': $space.height(),
                        'x': $space[0].offsetLeft,
                        'y': $space[0].offsetTop,
                        'roomId': _this.screen.curBase.id,
                        'wallIds': [],
                        'sensorIds': [],
                        'controllerIds': []
                    });
                    addSpaceStatus = 'end';
                })
            })
        },
        initEleMoveAndClick: function(){
            var $containerMap = $('#containerMap');
            var $mapTool = $('.divMapTool');
            var spaceStatus = 'end';
            var xStart,yStart,evPos,initPos,$target;
            $containerMap.off('mousedown.general').on('mousedown.general',function(e){
                if(spaceStatus != 'end')return;
                if( !$(e.target).hasClass('divMapEle')){
                    $('.divMapEle.selected').removeClass('selected');
                    return;
                }
                $target = $(e.target);
                initPos = {
                    x:$(e.target)[0].offsetLeft,
                    y:$(e.target)[0].offsetTop
                };
                evPos = {
                    x:e.pageX - _this.mapOffset.left,
                    y:e.pageY - _this.mapOffset.top
                };
                xStart = evPos.x;
                yStart = evPos.y;
                spaceStatus = 'start';
            });
            $containerMap.off('mousemove.general').on('mousemove.general',function(e){
                if(spaceStatus != 'start' && spaceStatus != 'move')return;
                _this.eventStatus = 'moveSpace';
                $('.divMapEle.selected').removeClass('selected');
                $target.addClass('selected');
                $target.css('cursor','default');
                $mapTool.css('display','none');
                evPos = {
                    x:e.pageX - _this.mapOffset.left,
                    y:e.pageY - _this.mapOffset.top
                };
                $target.css({
                    left:initPos.x + evPos.x - xStart,
                    top:initPos.y + evPos.y - yStart
                });
                spaceStatus = 'move';
            });
            $containerMap.off('mouseup.general').on('mouseup.general',function(e){
                if(_this.toolStatus != 'addSensor' && _this.toolStatus != 'addController') {
                    if (spaceStatus == 'start') {
                        $('.divMapEle.relate').removeClass('relate');
                        if ($target.hasClass('selected')) {
                            $target.removeClass('selected');
                        } else {
                            $('.divMapEle.selected').removeClass('selected');
                            $('.divMapEle.relate').removeClass('relate');
                            $target.addClass('selected');
                            var arrRelateId = $target.attr('data-relate').split(' ');
                            for (var i = 0;i < arrRelateId.length;i++){
                                $('#'+arrRelateId[i]).addClass('relate');
                            }
                        }
                    } else if ((spaceStatus == 'move')) {
                        $mapTool.css('display', '');
                        if ($target.hasClass('divSpace')) {
                            for (var i = 0; i < _this.screen.curArrSpace.length; i++) {
                                if (_this.screen.curArrSpace[i].id == $target.attr('id')) {
                                    _this.screen.curArrSpace[i].x = initPos.x + evPos.x - xStart;
                                    _this.screen.curArrSpace[i].y = initPos.y + evPos.y - yStart;
                                    break;
                                }
                            }
                        }else if($target.hasClass('divSensor')){
                            for (var i = 0; i < _this.screen.curArrSensor.length; i++) {
                                if (_this.screen.curArrSensor[i].id == $target.attr('id')) {
                                    _this.screen.curArrSensor[i].x = initPos.x + evPos.x - xStart + $target.width();
                                    _this.screen.curArrSensor[i].y = initPos.y + evPos.y - yStart + $target.height();
                                    break;
                                }
                            }
                        }else if($target.hasClass('divController')){
                            for (var i = 0; i < _this.screen.curArrController.length; i++) {
                                if (_this.screen.curArrController[i].id == $target.attr('id')) {
                                    _this.screen.curArrController[i].x = initPos.x + evPos.x - xStart + $target.width();
                                    _this.screen.curArrController[i].y = initPos.y + evPos.y - yStart + $target.height();
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
            var $wall;
            if (!arguments[0]) {
                $wall = $('.wall');
            }else {
                $wall = arguments[0]
            }
            $wall.off('click.general').on('click.general',function(e){
                if (!$(e.currentTarget).hasClass('wall'))return;
                if($(e.currentTarget).hasClass('selected')){
                    $(e.currentTarget).removeClass('selected');
                    wallJudge($(e.currentTarget),0)
                }else {
                    $(e.currentTarget).addClass('selected');
                    wallJudge($(e.currentTarget),1)
                }
            });
            function wallJudge(target,mode){
                var parent = target.parent();
                var wallStyle;
                if (mode){
                    wallStyle = '2px solid black';
                }else{
                    wallStyle = '';
                }
                if(target.hasClass('topWall')){
                    parent.css('border-top',wallStyle);
                }else if(target.hasClass('leftWall')){
                    parent.css('border-left',wallStyle);
                }else if(target.hasClass('bottomWall')){
                    parent.css('border-bottom',wallStyle);
                }else if(target.hasClass('rightWall')){
                    parent.css('border-right',wallStyle);
                }
            }
        },
        initAddController:function(){
            var strController = new StringBuilder();
            strController.append('<div class="divController divMapEle glyphicon glyphicon-asterisk"></div>');
            var $containerMap = $('#containerMap');
            var $mapTool = $('.divMapTool');
            var evPos,$divController;
            this.tempEvent.push('click.temp');
            $('#btnAddController').on('click.tool',function(e){
                _this.toolStatus = 'addController';
                $mapTool.css('display','none');
                $containerMap.off('click.temp').on('click.temp',function(e){
                    if(!$(e.target).hasClass('divMapEle')){
                        return;
                    }
                    if(_this.eventStatus == 'moveSpace'){
                        _this.eventStatus = 'init';
                        return;
                    }
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
                    var controllerId = ObjectId();
                    $divController.attr('id',controllerId);
                    var spaceRelate;
                    if ($(e.target).hasClass('divSpace')){
                        $divController.attr('data-relate',$(e.target).attr('id'));
                        spaceRelate = $(e.target).attr('data-relate');
                        spaceRelate = controllerId + ' ' + spaceRelate;
                        $(e.target).attr('data-relate',spaceRelate);
                        _this.screen.curArrController.push({
                            id:controllerId,
                            spaceId:$(e.target).attr('id'),
                            name:'控制器1号',
                            x:evPos.x - $divController.width()/2,
                            y:evPos.y - $divController.height()/2,
                            mac:'10-C3-7B-4B-AA-B0',
                            network:'CMCC'
                        });
                    }else{
                        _this.screen.curArrController.push({
                            id:ObjectId(),
                            spaceId:'',
                            name:'控制器1号',
                            x:evPos.x - $divController.width()/2,
                            y:evPos.y - $divController.height()/2,
                            mac:'10-C3-7B-4B-AA-B0',
                            network:'CMCC'
                        })
                    }
                })
            })
        },
        initAddSensor:function(){
            var strSensor = new StringBuilder();
            strSensor.append('<div class="divSensor divMapEle glyphicon glyphicon-eye-open"></div>');
            var $containerMap = $('#containerMap');
            var $mapTool = $('.divMapTool');
            var evPos,$divSensor;
            this.tempEvent.push('click.temp');
            $('#btnAddSensor').off('click.tool').on('click.tool',function(e){
                _this.toolStatus = 'addSensor';
                $mapTool.css('display','none');
                $containerMap.off('click.temp').on('click.temp',function(e){
                    if(!$(e.target).hasClass('divMapEle')){
                        return;
                    }
                    if(_this.eventStatus == 'moveSpace'){
                        _this.eventStatus = 'init';
                        return;
                    }
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
                    var sensorId = ObjectId();
                    $divSensor.attr('id',sensorId);
                    var spaceRelate;
                    if ($(e.target).hasClass('divSpace')){
                        $divSensor.attr('data-relate',$(e.target).attr('id'));
                        spaceRelate = $(e.target).attr('data-relate');
                        spaceRelate = sensorId + ' ' + spaceRelate;
                        $(e.target).attr('data-relate',spaceRelate);
                        _this.screen.curArrSensor.push({
                            id:sensorId,
                            spaceId:$(e.target).attr('id'),
                            name:'传感器1号',
                            x:evPos.x - $divSensor.width()/2,
                            y:evPos.y - $divSensor.height()/2,
                            mac:'10-C3-7B-4B-AA-B0',
                            network:'CMCC'
                        });
                    }else{
                        _this.screen.curArrSensor.push({
                            id:ObjectId(),
                            spaceId:'',
                            name:'传感器1号',
                            x:evPos.x - $divSensor.width()/2,
                            y:evPos.y - $divSensor.height()/2,
                            mac:'10-C3-7B-4B-AA-B0',
                            network:'CMCC'
                        })
                    }
                })
            })
        },
        initDelete:function(){
            $('#containerMap').off('keyup.general').on('keyup.general',function(){
                $('.divMapEle.selected').remove();
            });
        },
        offsetAdjust:function(target,x,y){

        }
    };
    return ConfigTool;
})();

/**
 * Created by win7 on 2016/10/21.
 */
var NavScreen = (function() {
    function NavScreen(ctn, tempDisplay) {
        this.ctn = ctn;
        this.$ctn = $(this.ctn);
        this.tempDisplay = tempDisplay;
        this.pointInfoArr = [];

        this.spinner = new LoadingSpinner({ color: '#00FFFF' });
        this.store = [];
        this.dictStore = {
            'move': [],
            'fixed': [],
            'coolStorage': []
        }
        this.movePtStore = [];
        this.fixedPtStore = [];
        this.coolStorage = [];

        this.selectPoints = {
            'fixed': [],
            'move': [],
            'coolStorage': []
        }
        this.focusGroup = 'fixed';

        this.worker = undefined;
    }
    NavScreen.prototype = {
        pointHtmlTpl: '\
        <!--<input type="checkbox" class="checkBoxBor"/>-->\
        <div class="pointSin clearfix">\
        <div class="checkBoxBor"><span class=""></span></div>\
        <div class="checkBoxBorCopy"><span class="glyphicon glyphicon-ok"></span></div>\
            <div class="pointName">{name}</div>\
            <div class="pointTemp"></div>\
        </div>\
        ',
        init: function() {
            var _this = this;
            WebAPI.get('/static/app/LogisticsPlantform/views/navScreen.html').done(function(result) {
                _this.ctn.innerHTML = result;
                if (!_this.tempDisplay) {
                    _this.$ctn.find('.pointTemp').hide();
                } else {
                    _this.$ctn.find('.pointTemp').show();
                }
                var spinner = new LoadingSpinner({ color: '#00FFFF' });
                spinner.spin(_this.ctn.querySelector('.pointListBox'));
                _this.getPointList().done(function(result) {
                    try {
                        _this.movePtStore = result.data.transporters;
                        _this.fixedPtStore = result.data.warehouses;
                        _this.coolStorage = result.data.fridges;
                        if (!_this.movePtStore) _this.movePtStore = [];
                        if (!_this.fixedPtStore) _this.fixedPtStore = [];
                        if (!_this.coolStorage) _this.coolStorage = [];
                    } catch (e) {
                        _this.movePtStore = [];
                        _this.fixedPtStore = [];
                        _this.coolStorage = [];
                    }
                    _this.initPointList('fixed');
                    _this.initPointList('move');
                    _this.initPointList('coolStorage');
                    _this.store = _this.movePtStore.concat(_this.fixedPtStore).concat(_this.coolStorage);
                    _this.dictStore['move'] = _this.movePtStore;
                    _this.dictStore['fixed'] = _this.fixedPtStore;
                    _this.dictStore['coolStorage'] = _this.coolStorage;
                    _this.initWorkerUpdate();

                    _this.pointInfoArr = _this.selectPoints[_this.focusGroup];
                }).always(function() {
                    spinner.stop();
                })
                _this.attachEvent();
            });
        },
        show: function() {
            this.ctn.innerHTML = '';
            this.init();
            this.$ctn.show();
        },
        getPointList: function(type) {
            var url;
            if (type == 'fixed') {
                url = '/logistics/thing/getList/1';
            } else if (type == 'move') {
                url = '/logistics/thing/getList/0';
            } else if (type == 'coolStorage') {
                url = '/logistics/thing/getList/2';
            } else {
                url = '/logistics/thing/getList'
            }
            return WebAPI.get(url)
        },
        initPointList: function(type) {
            var deffer = $.Deferred();
            var container = this.$ctn.find('.pointList[data-group="' + type + '"]')[0];
            if (type == 'fixed') {
                items = this.fixedPtStore;
            } else if (type == 'move') {
                items = this.movePtStore;
            } else if (type == 'coolStorage') {
                items = this.coolStorage;
            }
            container.innerHTML = '';

            if (items instanceof Array) {
                items.forEach(function(item, index) {
                    item.index = index;
                    item.type = type;
                    item.option = {};
                    container.appendChild(this.createPointItemDom(item));
                }.bind(this))
            }
            this.tempTooltip();
        },
        tempTooltip: function() {
            //温度tooltip事件
            var tooltipTemplate = '<div class="tooltip tplItemTooltip" role="tooltip" style="border-radius:5px">' +
                '<div class="tooltip-arrow"></div>' +
                '<div class="tooltipContent tempInfo clearfix">' +
                '</div>' +
                '</div>';
            var options = {
                placement: 'auto bottom',
                title: '预览',
                delay: { show: 200, hide: 200 },
                template: tooltipTemplate
            };
            var $pointTemp = this.$ctn.find('.pointTemp');
            $pointTemp.tooltip(options);
            $pointTemp.off('shown.bs.tooltip').on('shown.bs.tooltip', function() {
                var $this = $(this);
                var time = this.dataset.time;
                var lower = this.dataset.lower;
                var upper = this.dataset.upper;
                var tooltipContent = '<div><span>起止时间：</span></div>' +
                    '<div><span>' + time + '</span></div>' +
                    '<div><span>温度上限：</span><span>' + upper + '℃</span></div>' +
                    '<div><span>温度下限：</span><span>' + lower + '℃</span></div>';
                var $tempInfo = $('.tempInfo');
                $tempInfo.html('');
                $tempInfo.html(tooltipContent);
            });
        },
        togglePointList: function(type) {
            this.$ctn.find('.pointList[data-group="' + this.focusGroup + '"] .pointStyle.hide').removeClass('hide');
            this.focusGroup = type;
            // this.selectPoints[type] = this.pointInfoArr;

            // var siblingType = (type == 'fixed' ? 'move' : 'fixed');
            this.pointInfoArr = this.selectPoints[type]

            var $target = this.$ctn.find('.pointList[data-group="' + type + '"]');
            if ($target.hasClass('hide')) {
                $target.siblings().addClass('hide');
                $target.removeClass('hide');
            }
            //this.initWorkerUpdate();

            if (Router.current && Router.current.onNavGroupToggle) Router.current.onNavGroupToggle();
        },
        createPointItemDom: function(item) {
            var dom = document.createElement('div');
            dom.className = 'pointStyle clearfix';
            dom.id = 'navPoint_' + item._id;
            dom.dataset.id = item._id;
            dom.dataset.group = item.type;
            dom.dataset.style = item.type + "Point";
            dom.dataset.index = item.index;
            dom.dataset.parentid = item.parentid;

            var innerHTML = this.pointHtmlTpl;
            innerHTML = innerHTML.replace('{name}', item.name);
            dom.innerHTML = innerHTML;

            return dom;
        },
        initWorkerUpdate: function() {
            var _this = this;
            this.worker && this.worker.terminate();
            this.worker = new Worker("/static/app/LogisticsPlantform/scripts/widget/workerUpdate.js");
            this.worker.self = this;
            this.worker.addEventListener("message", this.refreshPointDetail.bind(_this), true);
            this.worker.addEventListener("error", function(e) {
                console.log(e)
            }, true);

            this.worker.postMessage({ type: "requestPointDetail" });
        },
        refreshPointDetail: function(rt) {
            // WebAPI.get('/logistics/thing/getDataList').done(function(result) {
            var data = [], dataForFixed, dataForMove, dataForFridges;
            var result = rt.data;
            try {
                dataForFixed = result.data['warehouses'];
                dataForMove = result.data['transporters'];
                dataForFridges = result.data['fridges'];
                var dataList = [dataForFixed, dataForMove, dataForFridges];
                dataList.forEach(function (item) {
                    if (item instanceof Array) {
                        data = data.concat(item);
                    }
                });
                // if (dataForFixed instanceof Array && dataForMove instanceof Array) {
                //     data = dataForFixed.concat(dataForMove)
                // } else if (dataForFixed instanceof Array ) {
                //     data = dataForFixed
                // } else {
                //     data = dataForMove
                // }
            } catch (e) {
                data = [];
            }
            if (dataForMove instanceof Array && dataForMove.length > 0) {
                this.movePtStore.forEach(function(item) {
                    for (var i = 0; i < dataForMove.length; i++) {
                        if (item._id == dataForMove[i]._id) {
                            item.option = dataForMove[i].option
                            return;
                        }
                    }
                })
            }
            if (dataForFixed instanceof Array && dataForFixed.length > 0) {
                this.fixedPtStore.forEach(function(item) {
                    for (var i = 0; i < dataForFixed.length; i++) {
                        if (item._id == dataForFixed[i]._id) {
                            item.option = dataForFixed[i].option
                            return;
                        }
                    }
                })
            }
            if (dataForFridges instanceof Array && dataForFridges.length > 0) {
                this.coolStorage.forEach(function(item) {
                    for (var i = 0; i < dataForFridges.length; i++) {
                        if (item._id == dataForFridges[i]._id) {
                            item.option = dataForFridges[i].option;
                            item.option.gps = [dataForFridges[i].option.lat, dataForFridges[i].option.lng]
                            return;
                        }
                    }
                })
            }
            if (!data instanceof Array) return;
            this.refreshPointInNav(data);
            Router.current.refreshData && Router.current.refreshData(result)
                // }.bind(this))
        },
        refreshPointInNav: function(data) {
            data.forEach(function(item) {
                this.setNavPointTemperature(item)
            }.bind(this))
            this.attachEvent();
        },
        setNavPointTemperature: function(item) {
            var dom = document.getElementById('navPoint_' + item._id)
            if (!dom) return;
            var tempDom = dom.querySelector('.pointTemp')
            if (!tempDom) return;
            tempDom.innerHTML = ((Object.prototype.toString.call(item.option.temp)=='[object Number]'&&item.option.temp==0) || item.option.temp ? parseFloat(item.option.temp).toFixed(2) + '℃' : '--');
            //innerHTML = innerHTML.replace('{temperautre}', item.params.temp + '℃');
            tempDom.classList.remove('dangerTemp');
            tempDom.classList.remove('successTemp');
            tempDom.classList.remove('lowerTemp');
            tempDom.classList.remove('overtimeTemp');
            tempDom.classList.remove('HWALTemp');
            var lowerTemp = 0,
                upperTemp = 0;
            var startTime, endTime;
            for (var i = 0; i < this.store.length; i++) {
                if (this.store[i]._id == item._id) {
                    lowerTemp = this.store[i].lowerTemp;
                    upperTemp = this.store[i].upperTemp;
                    startTime = this.store[i].startTime;
                    endTime = this.store[i].endTime;
                    tempDom.dataset.time = this.store[i].startTime + '-' + this.store[i].endTime;
                    tempDom.dataset.lower = lowerTemp;
                    tempDom.dataset.upper = upperTemp;
                    break;
                }
            }
            if(item.option.alarm&&item.option.alarm==1){
                tempDom.classList.add('HWALTemp');
                tempDom.innerHTML = '故障';
            }else{
                if ((Object.prototype.toString.call(item.option.temp)=='[object Number]'&&item.option.temp==0) || item.option.temp) {//&&item.option.temp!=''
                    //判断时间范围内才标志警报
                    //var isLegal = false;
                    //if (startTime && endTime) {
                    //    var startDayTime, endDayTime;
                    //    var currentDay = new Date().format('yyyy-MM-dd');
                    //    if ((parseInt(startTime) == 0 && parseInt(endTime) != 0) || new Date(currentDay + ' ' + startTime).valueOf() >= new Date(currentDay + ' ' + endTime).valueOf()) {
                    //        startDayTime = currentDay + ' ' + startTime;
                    //        endDayTime = new Date(new Date().valueOf() + 86400000).format('yyyy-MM-dd') + ' ' + endTime;
                    //    } else {
                    //        startDayTime = currentDay + ' ' + startTime;
                    //        endDayTime = currentDay + ' ' + endDayTime;
                    //    }
                    //    var now = new Date(new Date().format('yyyy-MM-dd HH:mm')).valueOf();
                    //    if (now >= new Date(startDayTime).valueOf() && now <= new Date(endDayTime).valueOf()) {
                    //        isLegal = true;
                    //    }
                    //}
                    //if (isLegal) {
                    if (item.option.temp >= lowerTemp && (item.option.temp <= upperTemp + 1)) {
                        tempDom.classList.add('successTemp');
                    } else if (item.option.temp < lowerTemp) {
                        tempDom.classList.add('lowerTemp');
                    } else if (item.option.temp > upperTemp + 1) {
                        tempDom.classList.add('dangerTemp');
                    }
                    //}else{
                    //    tempDom.classList.add('overtimeTemp');
                    //}
                }
            }
        },
        attachEvent: function() {
            var _this = this;
            var start;
            //显示固定点或移动点事件
            _this.$ctn.find('.pointComen').off('click').click(function() {
                var $this = $(this);
                var dataStyle = $this.attr('data-style');
                if (!$this.hasClass('pointSelect')) {
                    $this.addClass('pointSelect');
                    $this.siblings().removeClass('pointSelect');
                    var $qualityManage = $('#qualityManage');
                    if (dataStyle == 'fixed') {
                        _this.togglePointList('fixed');
                        if ($qualityManage.length > 0) {
                            new QualityManage().initTable('fixed');
                        }
                    } else if (dataStyle == 'move') {
                        _this.togglePointList('move');
                        if ($qualityManage.length > 0) {
                            new QualityManage().initTable('move');
                        }
                    } else if (dataStyle == 'coolStorage') {
                        _this.togglePointList('coolStorage');
                        if ($qualityManage.length > 0) {
                            new QualityManage().initTable('coolStorage');
                        }
                    }
                   // _this.initWorkerUpdate();
                }
            });
            //单个点的点击事件
            _this.$ctn.find('.pointListBox').off('click').on('click', '.pointStyle', function(e) {
                e = e || event;
                var $this = $(e.currentTarget);
                var currentPoint = {};
                var currentId = this.dataset.id;
                var currentIndex = parseInt(this.dataset.index);
                if (e.shiftKey) {
                    if (_this.pointInfoArr.length == 0) {
                        _this.activePoints(_this.dictStore[_this.focusGroup].map(function(pt) { return pt._id }))
                    } else {
                        var ptDom, startIndex, endIndex, ptActive;
                        if (_this.pointInfoArr[0].index > currentIndex) {
                            ptActive = $this.nextUntil('.active').last()[0];
                            startIndex = currentIndex;
                            endIndex = _this.pointInfoArr[0].index - 1;
                        } else if (_this.pointInfoArr[_this.pointInfoArr.length - 1].index < currentIndex) {
                            ptActive = $this.nextUntil('.active').first()[0];
                            startIndex = _this.pointInfoArr[_this.pointInfoArr.length - 1].index + 1;
                            endIndex = currentIndex;
                        } else {
                            ptActive = $this.prevUntil('.active').last()[0];
                            if (ptActive && ptActive.previousElementSibling) {
                                startIndex = parseInt(ptActive.dataset.index);
                            } else {
                                startIndex = currentIndex;
                            }
                            endIndex = currentIndex;
                        }
                        for (var i = startIndex; i < endIndex + 1; i++) {
                            ptDom = document.getElementById('navPoint_' + _this.dictStore[_this.focusGroup][i]._id)
                            if (!ptDom.classList.contains('hide') && !ptDom.classList.contains('active')) {
                                _this.activePoints(_this.dictStore[_this.focusGroup][i]._id);
                            }
                        }
                    }
                } else if (e.ctrlKey) {
                    if ($this.hasClass('active')) {
                        _this.freezePoints(currentId);
                    } else {
                        _this.activePoints(currentId);
                    }
                } else {
                    if (_this.pointInfoArr.length > 1) {
                        _this.resetSelectPoint();
                        _this.activePoints(currentId);
                    } else {
                        if ($this.hasClass('active')) {
                            _this.freezePoints(currentId);
                        } else {
                            _this.resetSelectPoint();
                            _this.activePoints(currentId);
                        }
                    }
                }
                _this.event_navLeft_onClick(_this.pointInfoArr);
            });
            //温度框点击事件
            _this.$ctn.find('.pointTemp').off('click').on('click',function(e){
                e.stopPropagation();
                var $this = $(this);
                var pointName = $this.prev('.pointName').text();
                var $pointTime = $('#pointTime');
                var id = $this.parents('.pointStyle').attr('data-id');
                var lowerTemp = $this.attr('data-lower');
                var upperTemp = $this.attr('data-upper');
                if($pointTime.length!=0){
                    $pointTime.remove()
                }
                var pointTimeDoms = '';
                var pointTimeDom='\
                <div class="modal fade" role="dialog" id="pointTime">\
                  <div class="modal-dialog" role="document">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                        <h4 class="modal-title">考核时间配置</h4>\
                      </div>\
                      <div class="modal-body">\
                        <div class="modalDiv"><span class="modalSpan">名称：</span><span class="modalinput">{name}</span></div>\
                        <div class="modalDiv"><span class="modalSpan">开始时间：</span><input type="time" value="{startValue}" class="modalinput modalStart"/></div>\
                        <div class="modalDiv"><span class="modalSpan">结束时间：</span><input type="time" value="{endValue}" class="modalinput modalEnd"/></div>\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                        <button type="button" class="btn btn-primary" id="savePoint">保存</button>\
                      </div>\
                    </div>\
                  </div>\
                </div>\
                    ';
                pointTimeDoms = pointTimeDom.formatEL({
                    name:pointName,
                    startValue:$this.attr('data-time').split('-')[0],
                    endValue:$this.attr('data-time').split('-')[1]
                });
                $(ElScreenContainer).parent().append(pointTimeDoms);
                $('#pointTime').modal('show');
                //保存按钮
                $('#savePoint').off('click').on('click',function(){
                    var startTime = $('.modalStart').val();
                    var endTime = $('.modalEnd').val();
                    if(startTime==''){
                        alert('请选择开始时间！');
                        return;
                    }
                    if(endTime==''){
                        alert('请选择结束时间！');
                        return;
                    }
                    var postDate = {
                        id:id,
                        startTime:startTime,
                        endTime:endTime,
                        lowerTemp:lowerTemp,
                        upperTemp:upperTemp
                    }
                    //0固定1移动
                    var styleType = $('.pointComen.pointSelect').attr('data-style');
                    var type = styleType == 'fixed' ? 0 : (styleType == 'move' ? 1 : 2);
                    WebAPI.post('/logistics/config/save/'+type,[postDate]).done(function(result){
                        if(result.status){
                            infoBox.alert('保存成功');
                            $this.attr('data-time',startTime+'-'+endTime)
                        }else{
                            infoBox.alert('保存失败');
                        }
                        $('#pointTime').modal('hide');
                    })
                })
            });
            //搜索事件
            var $iptPtSearch = $('#pointTitleIpt')
            $('#pointSearch').off('click').click(function() {
                _this.searchPoint($iptPtSearch.val().trim())
            });
            $iptPtSearch.off('keydown').keydown(function(e) {
                if (e.keyCode == 13) {
                    _this.searchPoint($iptPtSearch.val().trim())
                }
            })
            $iptPtSearch.off('propertychange input').on('propertychange input', function(e) {
                if (e.currentTarget.value == '') {
                    _this.$ctn.find('.pointList[data-group="' + _this.focusGroup + '"] .pointStyle.hide').removeClass('hide');
                }
            })
        },
        searchPoint: function(val) {
            var _this = this;
            if (val == '') {
                infoBox.alert('请填入搜索关键字！');
                return;
            }
            var pointStyleArr = this.$ctn.find('.pointList[data-group="' + _this.focusGroup + '"] .pointStyle');
            var isExist = false;
            for (var i = 0; i < pointStyleArr.length; i++) {
                if (_this.dictStore[_this.focusGroup][parseInt(pointStyleArr[i].dataset.index)].name.search(new RegExp(val, 'i')) >= 0) {
                    isExist = true;
                    pointStyleArr[i].classList.remove('hide');
                } else {
                    pointStyleArr[i].classList.add('hide');
                }
            }
            if (!isExist) {
                infoBox.alert('没有此模块！');
            }
        },
        activePoints: function(pt) {
            var _this = this;
            if (pt == null) return;
            if (pt instanceof Array) {
                pt.forEach(function(item) {
                    active(item);
                })
            } else {
                active(pt);
            }

            function active(id) {
                var $target = $('#navPoint_' + id);
                if ($target.length == 0) return
                if ($target.hasClass('active')) return;
                $target.addClass('active');
                var index = parseInt($target[0].dataset.index);
                var type = $target[0].dataset.group;
                var point = _this.dictStore[type][index]
                    // if (_this.focusGroup == type) {
                    //     _this.pointInfoArr.push(currentPoint);
                    // } else {
                _this.selectPoints[type].push(point);
                // }
                _this.selectPoints[type].sort(function(a, b) {
                    return a.index - b.index;
                })
            }

        },
        freezePoints: function(pt) {
            var _this = this;
            if (pt == null) return;
            if (pt instanceof Array) {
                pt.forEach(function(item) {
                    freeze(item)
                })
            } else {
                freeze(pt);
            }

            function freeze(id) {
                var $target = $('#navPoint_' + id);
                if ($target.length == 0) return
                if (!$target.hasClass('active')) return;
                $target.removeClass('active');
                var index = parseInt($target[0].dataset.index);
                var type = $target[0].dataset.group;
                var point = _this.dictStore[type][index]
                for (var i = 0; i < _this.selectPoints[type].length; i++) {
                    if (_this.selectPoints[type][i]._id == point._id) {
                        _this.selectPoints[type].splice(i, 1);
                        break;
                    }
                }
                // if (_this.focusGroup == type) {
                //     _this.pointInfoArr.splice(index, 1);
                // } else {
                // }
            }
        },
        resetSelectPoint: function(type) {
            this.$ctn.find('.pointStyle.active').removeClass('active')
            if (!type) {
                // this.pointInfoArr = []
                Object.keys(this.selectPoints).forEach(function(keys) {
                    this.selectPoints[keys].splice(0, this.selectPoints[keys].length);
                }.bind(this))
            } else {
                // if (this.focusGroup == type) {
                //     (this.pointInfoArr = []);
                // } else {
                this.selectPoints[keys] && (this.selectPoints[keys].splice(0, this.selectPoints[keys].length));
                // }
            }
        },
        getPointInfoById: function(id, type) {
            if (!id) return false;
            var list = [];
            if (type == 'fixed') {
                list = this.fixedPtStore;
            } else if (type == 'move') {
                list = this.movePtStore;
            } else if (type == 'coolStorage') {
                list = this.coolStorage;
            } else {
                list = this.store;
            }
            for (var i = 0; i < list.length; i++) {
                if (list[i]._id == id) {
                    return list[i];
                }
            }
            return false;
        },
        event_navLeft_onClick: function(points) {
            Router.current && Router.current.onNavPointClick && Router.current.onNavPointClick(points)
        },

        destroy: function() {
            this.ctn.innerHTML = '';

            this.worker && this.worker.terminate();
            this.worker = null;
        }
    };
    return NavScreen
})();
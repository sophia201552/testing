var QualityManage = (function() {
    function QualityManage() {
        this.movePtStore = [];
        this.fixedPtStore = [];
        this.commitDataObj = {};
        this.type = undefined;
        this.$qualityManage = undefined;

        //this.spinner = new LoadingSpinner({ color: '#00FFFF' });
    }
    QualityManage.prototype = {
        show: function() {
            var _this = this;
            WebAPI.get('/static/app/LogisticsPlantform/views/qualityManage.html').done(function(result) {
                ElScreenContainer.innerHTML = result;
                _this.$qualityManage = $('#qualityManage');
                _this.initTable('fixed');
            });
        },
        initTable: function(type) {
            var _this = this;
            this.type = type;
            var spinner = new LoadingSpinner({ color: '#00FFFF' });
            spinner.spin($('#qualityManage')[0]);
            WebAPI.get('/logistics/thing/getList').done(function(result){
               try {
                    _this.movePtStore = result.data.transporters;
                    _this.fixedPtStore = result.data.warehouses;
                    if (!_this.movePtStore) _this.movePtStore = [];
                    if (!_this.fixedPtStore) _this.fixedPtStore = [];
                } catch (e) {
                    _this.movePtStore = [];
                    _this.fixedPtStore = [];
                }
                _this.initPointTr(type);

                _this.onPointTypeClick(type);
            }).always(function(){
                spinner.stop();
            });
        },
        initPointTr:function(type){
            var _this = this;
            var data = type=='fixed'?this.fixedPtStore:this.movePtStore;
            var trdom = '';
            var tpl = '<tr data-type="{type}" id="{id}">\
                <td>{pointName}</td>\
                <td><input type="time" class="form_datetime form-control inputComStyle startTime" id="startTime" value="{startTime}"/></td>\
                <td><input type="time" class="form_datetime form-control inputComStyle endTime" id="endTime" value="{endTime}"/></td>\
                <td class="tempTd"><input type="text" class="inputComStyle form-control tempIpt" id="upper"/><label class="tempLabel upperTemp">{upperTemp}</label></td>\
                <td class="tempTd"><input type="text" class="inputComStyle form-control tempIpt" id="lower"/><label class="tempLabel lowerTemp">{lowerTemp}</label></td>\
                    </tr>';
            for(var i = 0;i<data.length;i++){
                trdom+= (tpl.formatEL({
                                id:data[i]._id,
                                type: type,
                                pointName:data[i].name,
                                startTime:data[i].startTime,
                                endTime:data[i].endTime,
                                lowerTemp:data[i].lowerTemp,
                                upperTemp:data[i].upperTemp
                            }));
            }
            $('#qualityManage').find('.pointListTable').find('tbody').html(trdom);
            _this.attachEvent();
        },
        attachEvent: function() {
            var _this = this;
            //温度修改
             $('.tempIpt').off('focusout').focusout(function(){
                var $this = $(this);
                var tempValue = $this.val().trim();
                if(isNaN(tempValue)||tempValue==''){
                     new Alert($('#qualityManage'), "danger", "请输入数字！").show(800).close();
                    return;
                }else{
                    var $thisParentTr = $this.parents('tr');
                    var index = $thisParentTr.index();
                    var id = $thisParentTr[0].id;
                    _this.commitDataObj[index] = {
                        id:id,
                        startTime:$thisParentTr.find('.startTime').val(),
                        endTime:$thisParentTr.find('.endTime').val(),
                    }
                    var siblingsTemp = $this.parent('td').siblings().find('.tempLabel').text();
                    if(this.id=='lower'){
                        _this.commitDataObj[index]['lowerTemp'] =  parseInt(tempValue);
                        _this.commitDataObj[index]['upperTemp'] =  parseInt(siblingsTemp);
                    }else{
                        _this.commitDataObj[index]['upperTemp'] = parseInt(tempValue);
                        _this.commitDataObj[index]['lowerTemp'] =  parseInt(siblingsTemp);
                    }
                }
                $this.hide();
                $this.next('.tempLabel').show().text(tempValue);
                 console.log(_this.commitDataObj);
             });
            //时间修改
            $(".form_datetime").off('blur').blur(function(){
                var $this = $(this);
                var timeValue = $this.val().trim();
                if(isNaN(timeValue.split(':')[0])||isNaN(timeValue.split(':')[1])){
                    new Alert($('#qualityManage'), "danger", "请填入正确的时间格式！").show(800).close();
                    return;
                }else{
                    var $thisParentTr = $this.parents('tr');
                    var index = $thisParentTr.index();
                    var id = $thisParentTr[0].id;
                    _this.commitDataObj[index] = {
                        id:id,
                        lowerTemp:$thisParentTr.find('.lowerTemp').text(),
                        upperTemp:$thisParentTr.find('.upperTemp').text(),
                    }
                    var siblingsTime = $this.parent('td').siblings().find('.form_datetime').val();
                    if(this.id=='startTime'){
                        _this.commitDataObj[index]['startTime'] =  timeValue;
                        _this.commitDataObj[index]['endTime'] =  siblingsTime;
                    }else{
                        _this.commitDataObj[index]['endTime'] = timeValue;
                        _this.commitDataObj[index]['startTime'] =  siblingsTime;
                    }
                }
                console.log(_this.commitDataObj);
            });
            $('.tempLabel').off('click').on('click',function(){
                var $this = $(this);
                $this.hide();
                $this.prev('.tempIpt').show().val($this.text()).focus();
            })
            //保存按钮
            $('#poinTInfoCommit').off('click').on('click',function(){
                //0固定1移动
                if($.isEmptyObject(_this.commitDataObj)){
                    alert('保存数据为空！')
                }else{
                    var type = _this.type=='fixed'?0:1;//$('.pointListTable').find('tr').eq(1).attr('data-type')=='fixed'
                    var commitDataArr = [];
                    for(var i in _this.commitDataObj){
                        commitDataArr.push(_this.commitDataObj[i]);
                    }
                    console.log(commitDataArr);
                    console.log(type);
                    WebAPI.post('/logistics/config/save/'+type,commitDataArr).done(function(result){
                        if(result.status){
                            alert('保存成功');
                        }else{
                            alert('保存失败');
                        }
                    })
                }
            })
        },
        onNavPointClick:function(points){
            this.displayConfigTr(points);
        },
        onPointTypeClick:function(type){
            //判断导航是否有被选中的，并做筛选
            var $pointActive = $('.pointList[data-group="'+type+'"]').find('.pointStyle.active');
            var points = [];
            var currentPointArr = type=='fixed'?this.fixedPtStore:this.movePtStore;
            for(var i = 0;i<$pointActive.length;i++){
                var index = $pointActive.eq(i).index();
                points.push(currentPointArr[index]);
            }
            this.displayConfigTr(points);
        },
        displayConfigTr:function(points){
            var $pointTr = $('#qualityManage') .find('.pointListTable tbody').find('tr');
            if(points.length==0){
                $pointTr.removeClass('hide');
                return;
            }
            $pointTr.addClass('hide');
            points.forEach(function(item) {
                for (var i = 0; i < $pointTr.length; i++) {
                    if (item._id == $pointTr[i].id) {
                        $pointTr.eq(i).removeClass('hide');
                    }
                }
            })
        },
        destroy: function() {
            this.movePtStore = null;
            this.fixedPtStore = null;
            this.commitDataObj = null;
            this.type = null;
            this.$qualityManage = null;
        }
    };
    return QualityManage;
})();
/**
 * Created by win7 on 2015/9/14.
 */
var ObserverScreen = (function(){
    var _this;
    var timer;

    ObserverScreen.navOptions = {
        top: '<span id="roomName" class="topNavTitle">设备开关</span><span class="topNavRight zepto-ev" id="btnConfig">\
              <span class="iconfont icon-shezhi glyphicon glyphicon-cog" aria-hidden="true"></span>\
              <ul style="display:none;"><li id="liConfig">注销</li></ul></span>',
        bottom: true,
        backDisable:false
    };

    function ObserverScreen(){
        _this = this;
        _this.fileStorage = undefined;
    }
    ObserverScreen.prototype = {

        show: function () {
            _this.fileStorage = new FileStorage('BeopPtImport');
            WebAPI.get('static/app/inputApp/views/screen/observerScreen.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        },
        init:function(){
            var allEquipment = [{
                "name": "1#地源热泵",
                "attr": [{
                    "point": "GSHP401_GSHPOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "GSHP401_GSHPVoltage",
                    "name": "实际电压",
                    "unit": "V"
                },{
                    "point": "GSHP401_GSHPCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "GSHP401_GSHPPower",
                    "name": "功率",
                    "unit": "kW"
                },{
                    "point": "GSHP401_GSHPElecUse",
                    "name": "用电量",
                    "unit": "kWh"
                },{
                    "point": "GSHP401_GSHPEnterCondTemp",
                    "name": "冷凝器进水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP401_GSHPLeaveCondTemp",
                    "name": "冷凝器出水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP401_GSHPEnterEvapTemp",
                    "name": "蒸发器进水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP401_GSHPLeaveEvapTemp",
                    "name": "蒸发器出水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP401_GSHPChWTempSupplySetPoint",
                    "name": "冷水温度设定",
                    "unit": "℃"
                }
                ]
            },{
                "name": "2#地源热泵",
                "attr": [{
                    "point": "GSHP402_GSHPOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "GSHP402_GSHPVoltage",
                    "name": "实际电压",
                    "unit": "V"
                },{
                    "point": "GSHP402_GSHPCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "GSHP402_GSHPPower",
                    "name": "功率",
                    "unit": "kW"
                },{
                    "point": "GSHP402_GSHPElecUse",
                    "name": "用电量",
                    "unit": "kWh"
                },{
                    "point": "GSHP402_GSHPEnterCondTemp",
                    "name": "冷凝器进水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP402_GSHPLeaveCondTemp",
                    "name": "冷凝器出水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP402_GSHPEnterEvapTemp",
                    "name": "蒸发器进水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP402_GSHPLeaveEvapTemp",
                    "name": "蒸发器出水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP402_GSHPChWTempSupplySetPoint",
                    "name": "冷水温度设定",
                    "unit": "℃"
                }
                ]
            },{
                "name": "3#地源热泵",
                "attr": [{
                    "point": "GSHP403_GSHPOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "GSHP403_GSHPVoltage",
                    "name": "实际电压",
                    "unit": "V"
                },{
                    "point": "GSHP403_GSHPCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "GSHP403_GSHPPower",
                    "name": "功率",
                    "unit": "kW"
                },{
                    "point": "GSHP403_GSHPElecUse",
                    "name": "用电量",
                    "unit": "kWh"
                },{
                    "point": "GSHP403_GSHPEnterCondTemp",
                    "name": "冷凝器进水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP403_GSHPLeaveCondTemp",
                    "name": "冷凝器出水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP403_GSHPEnterEvapTemp",
                    "name": "蒸发器进水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP403_GSHPLeaveEvapTemp",
                    "name": "蒸发器出水温度",
                    "unit": "℃"
                },{
                    "point": "GSHP403_GSHPChWTempSupplySetPoint",
                    "name": "冷水温度设定",
                    "unit": "℃"
                }
                ]
            },{
                "name": "1#空调侧循环泵",
                "attr": [{
                    "point": "Pump401_PumpOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "Pump401_PumpCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "Pump401_PumpReturnP",
                    "name": "进水压力",
                    "unit": "bar"
                },{
                    "point": "Pump401_PumpSupplyP",
                    "name": "出水压力",
                    "unit": "bar"
                },{
                    "point": "Pump401_PumpReturnT",
                    "name": "进水温度",
                    "unit": "℃"
                },{
                    "point": "Pump401_PumpSupplyT",
                    "name": "出水温度",
                    "unit": "℃"
                }
                ]
            },{
                "name": "2#空调侧循环泵",
                "attr": [{
                    "point": "Pump402_PumpOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "Pump402_PumpCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "Pump402_PumpReturnP",
                    "name": "进水压力",
                    "unit": "bar"
                },{
                    "point": "Pump402_PumpSupplyP",
                    "name": "出水压力",
                    "unit": "bar"
                },{
                    "point": "Pump402_PumpReturnT",
                    "name": "进水温度",
                    "unit": "℃"
                },{
                    "point": "Pump402_PumpSupplyT",
                    "name": "出水温度",
                    "unit": "℃"
                }]
            },{
                "name": "3#空调侧循环泵",
                "attr": [{
                    "point": "Pump403_PumpOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "Pump403_PumpCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "Pump403_PumpReturnP",
                    "name": "进水压力",
                    "unit": "bar"
                },{
                    "point": "Pump403_PumpSupplyP",
                    "name": "出水压力",
                    "unit": "bar"
                },{
                    "point": "Pump403_PumpReturnT",
                    "name": "进水温度",
                    "unit": "℃"
                },{
                    "point": "Pump403_PumpSupplyT",
                    "name": "出水温度",
                    "unit": "℃"
                }
                ]
            },{
                "name": "4#空调侧循环泵",
                "attr": [{
                    "point": "Pump404_PumpOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "Pump404_PumpVSDFreq",
                    "name": "频率",
                    "unit": "Hz"
                },{
                    "point": "Pump404_PumpCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "Pump404_PumpReturnP",
                    "name": "进水压力",
                    "unit": "bar"
                },{
                    "point": "Pump404_PumpSupplyP",
                    "name": "出水压力",
                    "unit": "bar"
                },{
                    "point": "Pump404_PumpReturnT",
                    "name": "进水温度",
                    "unit": "℃"
                },{
                    "point": "Pump404_PumpSupplyT",
                    "name": "出水温度",
                    "unit": "℃"
                }
                ]
            },{
                "name": "1#地埋侧循环泵",
                "attr": [{
                    "point": "Pump405_PumpOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "Pump405_PumpCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "Pump405_PumpReturnP",
                    "name": "进水压力",
                    "unit": "bar"
                },{
                    "point": "Pump405_PumpSupplyP",
                    "name": "出水压力",
                    "unit": "bar"
                },{
                    "point": "Pump405_PumpReturnT",
                    "name": "进水温度",
                    "unit": "℃"
                },{
                    "point": "Pump405_PumpSupplyT",
                    "name": "出水温度",
                    "unit": "℃"
                }
                ]
            },{
                "name": "2#地埋侧循环泵",
                "attr": [{
                    "point": "Pump406_PumpOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "Pump406_PumpCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "Pump406_PumpReturnP",
                    "name": "进水压力",
                    "unit": "bar"
                },{
                    "point": "Pump406_PumpSupplyP",
                    "name": "出水压力",
                    "unit": "bar"
                },{
                    "point": "Pump406_PumpReturnT",
                    "name": "进水温度",
                    "unit": "℃"
                },{
                    "point": "Pump406_PumpSupplyT",
                    "name": "出水温度",
                    "unit": "℃"
                }
                ]
            },{
                "name": "3#地埋侧循环泵",
                "attr": [{
                    "point": "Pump407_PumpOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "Pump407_PumpCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "Pump407_PumpReturnP",
                    "name": "进水压力",
                    "unit": "bar"
                },{
                    "point": "Pump407_PumpSupplyP",
                    "name": "出水压力",
                    "unit": "bar"
                },{
                    "point": "Pump407_PumpReturnT",
                    "name": "进水温度",
                    "unit": "℃"
                },{
                    "point": "Pump407_PumpSupplyT",
                    "name": "出水温度",
                    "unit": "℃"
                }
                ]
            },{
                "name": "4#地埋侧循环泵",
                "attr": [{
                    "point": "Pump408_PumpOnOff",
                    "name": "运行状态",
                    "enum": {"0": "开启", "1": "关闭"},
                    "isSticked": true
                },{
                    "point": "Pump408_PumpVSDFreq",
                    "name": "频率",
                    "unit": "Hz"
                },{
                    "point": "Pump408_PumpCurrent",
                    "name": "实际电流",
                    "unit": "A"
                },{
                    "point": "Pump408_PumpReturnP",
                    "name": "进水压力",
                    "unit": "bar"
                },{
                    "point": "Pump408_PumpSupplyP",
                    "name": "出水压力",
                    "unit": "bar"
                },{
                    "point": "Pump408_PumpReturnT",
                    "name": "进水温度",
                    "unit": "℃"
                },{
                    "point": "Pump408_PumpSupplyT",
                    "name": "出水温度",
                    "unit": "℃"
                }
                ]
            },{
                "name": "空调侧分水器",
                "attr": [{
                    "point": "distributor401_SupplyT",
                    "name": "供水温度",
                    "unit": "℃"
                },{
                    "point": "distributor401_SupplyP",
                    "name": "供水压力",
                    "unit": "bar"
                }
                ]
            },{
                "name": "地埋侧分水器",
                "attr": [{
                    "point": "distributor402_SupplyT",
                    "name": "供水温度",
                    "unit": "℃"
                },{
                    "point": "distributor402_SupplyP",
                    "name": "供水压力",
                    "unit": "bar"
                }
                ]
            },{
                "name": "空调侧集水器",
                "attr": [{
                    "point": "collector401_ReturnT",
                    "name": "回水温度",
                    "unit": "℃"
                },{
                    "point": "collector401_ReturnP",
                    "name": "回水压力",
                    "unit": "bar"
                }
                ]
            },{
                "name": "地埋侧集水器",
                "attr": [{
                    "point": "collector402_ReturnT",
                    "name": "回水温度",
                    "unit": "℃"
                },{
                    "point": "collector402_ReturnP",
                    "name": "回水压力",
                    "unit": "bar"
                }
                ]
            },{
                "name": "地源回水",
                "attr": [{
                    "point": "GsReturnT401_ThermalMeterReading",
                    "name": "热计量表读数",
                    "unit": "GJ"
                }
                ]
            },{
                "name": "季节模式",
                "attr": [{
                    "point": "GSHP401_SeasonMode",
                    "name": "季节模式",
                    "enum": {"0": "冬季", "1": "夏季"},
                    "isSticked": true
                }
                ]
            }
            ];
            var tpl='';
            for(var i = 0;i<allEquipment.length;i++){
                tpl += '<li class="zepto-ev" data-name="'+ allEquipment[i].name +'"><span class="equipmentName">'+ allEquipment[i].name +'</span>';
                if(allEquipment[i].attr[0].isSticked){
                    tpl += '<button type="button" class="btn btn-xs btn-success btnSticked zepto-ev" data-point="'+ allEquipment[i].attr[0].point +'">运行状态</button><ul class="parameterList" style="display:none;">';
                    for(var j = 1;j<allEquipment[i].attr.length;j++){
                        tpl += '<li data-point='+ allEquipment[i].attr[j].point +'><span class="parameterName">'+ allEquipment[i].attr[j].name +'</span><input type="number"><span class="spanUnit" style="float:right;">'+ allEquipment[i].attr[j].unit +'</span></li>';
                    }
                    tpl += '</ul></li>';
                }else{
                    tpl += '<ul class="parameterList" style="display:none;">';
                    for(var j = 0;j<allEquipment[i].attr.length;j++){
                        tpl += '<li data-point='+ allEquipment[i].attr[j].point +'><span class="parameterName">'+ allEquipment[i].attr[j].name +'</span><input type="number"><span class="spanUnit" style="float:right;">'+ allEquipment[i].attr[j].unit +'</span></li>';
                    }
                    tpl += '</ul></li>';
                }
            }
            $('#divAllEquipment ul').append(tpl);
            $('#indexMain').height($('#indexMain').height() + $('#divSummit').height());

            $('#divAllEquipment .parameterList li input').off().focus(function () { $(this).select(); });
            _this.navBottom();
        },
        navBottom:function(){
            $('#divAllEquipment li .equipmentName').off('click').on('click',function(){
                $(this).parent().children('.parameterList').toggle();
                if($(this).parent().hasClass('liCheck')){
                    $(this).parent().removeClass('liCheck');
                    $(this).parent().siblings().show();
                    $('#indexMain').height($('#indexMain').height()+$('#divSummit').height());
                }else{
                    $(this).parent().addClass('liCheck');
                    $(this).siblings('.parameterList').children('li').find('input');
                    $(this).parent().siblings().removeClass('liCheck');
                    $(this).parent().siblings().children('.parameterList').hide();
                    $(this).parent().siblings().hide();
                    $('#indexMain').height($('#indexMain').height()-$('#divSummit').height());
                }
                if($('.liCheck').length === 0){
                    $('#divSummit').hide();
                }else{
                    $('#divSummit').show();
                }
                $('#divSummit .spanSummit').off('click').on('click',function(){
                    var $liCheck = $('.liCheck');
                    var valueList = $liCheck.find('.parameterList').children('li');
                    var pointArr=[];
                    var valueArr=[];
                    //var valArr = [{
                    //    point:$liCheck.children('button').attr('data-point'),
                    //    name:'运行状态'
                    //}];
                    //if($liCheck.children('button')){
                    //    valArr[0].isSticked=true;
                    //    valArr[0].enum= $liCheck.children('button').attr('data-enum');
                    //}
                    for(var i = 0;i<valueList.length;i++){
                        if($(valueList[i]).children('input').val() === ''){
                            //$('#divAlert').html('设备参数未填写完整！').show();
                            //timer = window.setTimeout("$('#divAlert').hide()", 1000);
                            continue;
                        }else{
                            valueArr.push($(valueList[i]).children('input').val());
                        }
                        //var val = {
                        //    point:$(valueList[i]).attr('data-point'),
                        //    name:$(valueList[i]).children('.parameterName').text(),
                        //    unit:$(valueList[i]).children('input').val()+$(valueList[i]).children('.spanUnit').text()
                        //}
                        pointArr.push($(valueList[i]).attr('data-point'));
                    }
                    var optRead = {
                        'deviceInfo': {
                            name: 'dotInputPara.json',
                            url:'tuanbo',
                        }
                    }
                    var dataFromFile = _this.fileStorage.read(optRead);
                    var data = dataFromFile ? dataFromFile : {
                        projId: 200,
                        point:pointArr,
                        value:valueArr
                    }
                    var optWrite = {
                        'deviceInfo': {
                            name: 'dotInputPara.json',
                            url:'tuanbo',
                            data: data
                        }
                    }
                    Spinner.spin($('#indexMain')[0]);
                    _this.fileStorage.write(optWrite);
                    //_this.fileStorage.read(opt);
                    WebAPI.post("/set_realtimedata_from_site",data).done(function(){
                        //$('#divAlert').html('设备参数上传成功！').show();
                        window.plugins && window.plugins.toast.show('设备参数上传成功', 'short', 'center');
                        //timer = window.setTimeout("$('#divAlert').hide()", 1000);
                    }).always(function(){
                        $liCheck.find('.parameterList').hide();
                        Spinner.stop();
                        $('#divSummit').hide();
                        $liCheck.siblings().show();
                        $liCheck.removeClass('liCheck');
                        $('#indexMain').height($('#indexMain').height()+$('#divSummit').height());
                    })
                });
                $('#divSummit .spanCancel').off('click').on('click',function(){
                    var $liCheck = $('.liCheck');
                    $liCheck.children('.parameterList').hide();
                    $liCheck.siblings().show();
                    $liCheck.removeClass('liCheck');
                    $('#divSummit').hide();
                    $('#indexMain').height($('#indexMain').height()+$('#divSummit').height());
                })
            })
            $('#btnConfig').off('click').on('click',function(){
                $('#btnConfig ul').toggle(function(){
                    $('#liConfig').off('click').on('click',function(){
                        localStorage.clear('userInfo');
                        router.empty().to({
                            typeClass:IndexScreen
                        })
                    });
                });
            })
            $('.btnSticked').off('click').on('click',function(){
                var $current = $(this);
                var pointCName = $(this).parent('li').attr('data-name');
                var pointEName = $(this).attr('data-point');
                if(pointCName === '季节模式'){
                    $('#divStickedModal .radio:first label').children('span').text('冬季');
                    $('#divStickedModal .radio:last label').children('span').text('夏季');
                }else{
                    $('#divStickedModal .radio:first label').children('span').text('开启');
                    $('#divStickedModal .radio:last label').children('span').text('关闭');
                }
                $('#divStickedModal').show(function(){
                    $('.radio').find('input').prop('checked',false);
                    $('.stickedTitle').children('button').off('click').on('click',function(){
                        $('#divStickedModal').hide();
                        $('#divContent').show();
                        $('#divStickedSummit').hide();
                    });
                    $('.radio').off('click').on('click',function(){
                        var $inputCheck = $(this).find('input');
                        $('#divContent').hide();
                        $('#divStickedSummit').show();
                        $('.stickedTitle>span').text('选择'+$(this).children('label').text()+'状态');
                        $('#divStickedSummit .btnSummit').off('click').on('click',function(){
                            //if($iuputCheck.val()==='0'){
                            //    $current.attr('data-enum','0');
                            //}else{
                            //    $current.attr('data-enum','1');
                            //}
                            var optRead = {
                                'deviceInfo': {
                                    name: 'dotInputPara.json',
                                    url:'tuanbo'
                                }
                            }
                            var dataFromFile = _this.fileStorage.read(optRead);
                            var data = dataFromFile ? dataFromFile : {
                                projId: 200,
                                point: [pointEName],
                                value: [parseInt($inputCheck.val())]
                            }
                            var optWrite = {
                                'deviceInfo': {
                                    name: 'dotInputPara.json',
                                    url:'tuanbo',
                                    data: data
                                }
                            }
                            _this.fileStorage.write(optWrite);
                            //_this.fileStorage.read(opt);
                            WebAPI.post("/set_realtimedata_from_site",data).done(function(){
                                $('#divStickedModal').hide();
                                $('#divStickedSummit').hide();
                                $('#divContent').show();
                                $('.stickedTitle>span').text('请选择运行状态');
                                //$('#divAlert').html('运行状态改变成功！').show();
                                window.plugins && window.plugins.toast.show('运行状态改变成功！', 'short', 'center');
                            }).always(function(){
                                //timer = window.setTimeout("$('#divAlert').hide()", 1000);
                            })
                        });
                        $('#divStickedSummit .btnCancel').off('click').on('click',function(){
                            $('#divStickedSummit').hide();
                            $('#divContent').show();
                            //$('#indexMain').height($('#indexMain').height()+$('#divSummit').height());
                        })
                    });
                });
            })
        },
        close:function(){
            //clearTimeout(timer);
            _this.fileStorage = null;
        }
    };
    return ObserverScreen;
})();

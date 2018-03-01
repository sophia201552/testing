/**
 * Created by vicky on 2016/3/14.
 */
var Controllers = (function(){
    var _this;

    function Controllers(){
        _this = this;
        this.init();
    }

    Controllers.navOptions = {
        top: '<span class="topNavTitle">控制器列表</span>'
    };

    Controllers.prototype = {
        show: function () {
            WebAPI.get('/static/app/temperatureControl/views/admin/controllers.html').done(function(resultHtml){
                $('#indexMain').html(resultHtml);
                var $tableCtn = $('#tableCtn');
                router.controlles.showController({parent: $tableCtn});
                _this.attachPatchEvents();
            });
        },
        init: function(){
            var postData ={
                dsItemIds: []
            }
            this.$indexMain = $('#indexMain');
            this.$wrapController = $('<div id="wrapController"></div>');

            for(var i = 0; i < ctrAll.length; i++){
                for(var j in ctrAll[i].arrP){
                    postData.dsItemIds.push(ctrAll[i].arrP[j]);
                }
            }
            WebAPI.post('/analysis/startWorkspaceDataGenPieChart',postData).done(function(result){
                _this.render(ctrAll,result.dsItemList);
            });


        },
        render: function (ctrData, arrData) {
            var strHtml = '\
                <style>\
                    .list-unstyled .item{\
                        border-top: 1px solid #eee;\
                        padding: 10px 20px;\
                    }\
                    .list-unstyled .item .glyphicon{\
                        display: none;\
                    }\
                    .list-unstyled .item.selected .glyphicon{\
                        display: inline-block;\
                        color: #ff0000;\
                    }\
                </style>\
                <table class="table" id="tbController">\
                    <thead><tr><th class=""></th><th>名称</th><th>温度</th><th>风速</th><th>启停</th><th>季节模式</th><th>阀位</th><th>自动</th></tr></thead>\
                    <tbody></tbody>\
                </table>';
            var tpl = '<tr data-id="{_id}"><td class=""><input type="checkbox" id="checkbox_{_id}" class="regular-checkbox"><label for="checkbox_{_id}"></label></td><td>{name}</td><td>{temp}</td><td>{speed}</td><td>{switch}</td><td>{sp}</td><td>{valueL}</td><td>{auto}</td></tr>'

            this.$wrapController.append(strHtml);
            this.$indexMain.append(this.$wrapController);
            var $tbController = $('#tbController');
            var strTR = '';
            for(var i = 0, attr = {}; i < ctrData.length; i++){
                for(var j in ctrData[i].arrP){
                    for(var k = 0; k < arrData.length; k++){
                        if(ctrData[i].arrP[j] == arrData[k].dsItemId){
                            attr[j] = arrData[k].data;
                            break;
                        }
                    }
                }
                strTR += tpl.formatEL({
                    _id: ctrData[i]._id,
                    name: ctrData[i].name ? ctrData[i].name : '--' ,
                    temp: attr.FCUTSet ? attr.FCUTSet : '--',//FCUTSet 温度
                    speed: attr.FCUSpeedDSet ? attr.FCUSpeedDSet : '--',//FCUSpeedDSet风速
                    switch: attr.FCUOnOffSet == 0 ? '停' : '开',//FCUOnOffSet启停
                    sp: attr.FCUSeasonMode == 0 ? '制冷' : '制热',
                    valueL: attr.FCUValvePositionDSet ? attr.FCUValvePositionDSet : '--',//水阀开度设定(数字量)
                    auto: attr.FCUAutoMode == 0 ? '手动' : '自动'//FCUAutoMode手自动
                })
            }
            $tbController.find('tbody').html(strTR);
        },
        attachEvents: function () {
            var $tbController = $('#tbController')
            $('input', $tbController).off('change').on('change', function(){
                var selectedLen = $('input:checked:not(#checkAll)', $tbController).length;
                if(selectedLen == $('input:not(#checkAll)', $tbController).length){
                    $('#checkAll').prop('checked',true);
                }else{
                    $('#checkAll').prop('checked',false);
                }
            });

            //全选按钮
            $('#checkAll').off('change').on('change', function(){
                if($(this).is(':checked')){
                    $tbController.find('tr input').prop('checked',true);
                }else{
                    $tbController.find('tr input').prop('checked',false);
                }
            });
        },
        close:function(){
            var $tbController = $('#tbController');
            this.$wrapController.hide();

            $tbController.find('tr input:checked').prop('checked', false);
        },
        showController: function (option) {
            var $parent = this.$indexMain;
            if(option){
                if(option.parent) $parent = option.parent;
                if(option.style) this.$wrapController.attr('style', option.style);
            }
            $parent.append(this.$wrapController);
            this.$wrapController.show();
            this.attachEvents();
        },
        boot: function(){
            var arrData = [];
            var $tbController = $('#tbController');
            $tbController.find('tbody tr input:checked').each(function(){
                var id = $(this).closest('tr').attr('data-id');
                if(!id) return;
                var data = {_id: _this.device._id, prefix: _this.device.prefix, projectId: curRoom.projId, attrs: {}};
                data.attrs['FCUOnOffSet'] = 1;
                arrData.push(data);
            });
            if(arrData.length == 0){ return; }
            this.patchSetController(arrData);
        },
        shutdown: function(){
            var arrData = [];
            var $tbController = $('#tbController');
            $tbController.find('tbody tr input:checked').each(function(){
                var id = $(this).closest('tr').attr('data-id');
                if(!id) return;
                var data = {_id: _this.device._id, prefix: _this.device.prefix, projectId: curRoom.projId, attrs: {}};
                data.attrs['FCUOnOffSet'] = 1;
                arrData.push(data);
            });
            if(arrData.length == 0){ return; }
            this.patchSetController(arrData);
        },
        attachPatchEvents: function(){
            $('#btnPatchBoot').off('touchstart').on('touchstart', function(){
                router.controlles.boot();
            });
            $('#btnPatchShut').off('touchstart').on('touchstart', function(){
                router.controlles.shutdown();
            });
            $('#btnPatchHist').off('touchstart').on('touchstart', function(){
                router.to({
                    typeClass: HistoryChart,
                    data: {ids:[]}//todo
                })
            });
        },
        patchSetController: function(arrData){
            WebAPI.post('/appTemperature/setControllers',arrData).done(function(result){

            })
        }
    };

    return Controllers;
})();

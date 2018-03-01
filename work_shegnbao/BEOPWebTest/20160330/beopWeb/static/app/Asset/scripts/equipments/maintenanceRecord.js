/**
 * Created by vicky on 2016/1/28.
 */

var MaintenanceRecord = (function(){

    function MaintenanceRecord(){

    }

    MaintenanceRecord.prototype.show = function(data){
        var arrIds = (function(trs){
            var arr = [];
            for(var i = 0; i < trs.length; i++){
                arr.push(trs[i].id);
            }
            return arr;
        }(data));

        this.getMaintainList(arrIds);
    };

    MaintenanceRecord.prototype.close = function(arrIds){};

    MaintenanceRecord.prototype.getMaintainList = function(arrIds){
        var $tabCtn = $('#tabMaintenance'), $listMaintenance = $('#listMaintenance').empty();

        //状态枚举
        var EnumStatus ={
            0: '新建',
            1: '进行中',
            2: '停止',
            3: '完成',
            4: '停止,验证不通过',
            5: '完成,验证通过',
            6: '停止,验证通过',
            7: '完成,验证通过'
        }
        //TODO 工单严重程度 label label-danger label-warning label-info
        var EnumLevel ={
            0: '一般',
            1: '紧急',
            2: '严重'
        }
        var EnumLevelClass = {
            0: 'info',
            1: 'warning',
            2: 'danger'
        }
        Spinner.spin($tabCtn[0]);
        WebAPI.post('/asset/getMaintainList', {arrTId: new Array('cccccccccccff32fbc300003')}).done(function(result){
            var tempHtml = '';
            for(var i = 0, data; i < result.data.length; i++){
                data = result.data[i];
                tempHtml += ('<div class="paneWfItem" data-id="'+ data._id +'" data-toggle="modal" data-target="#wfDetail">\
                    <div><span>'+ data.createTime +'</span> -- <span>'+ data.endTime +'</span></div>\
                    <span><span class="label label-danger"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span> 维修</span> '+ data.creator +'</span>\
                    <span class="text-'+ EnumLevelClass[data.critical] +'">'+ EnumLevel[data.critical] +'</span>\
                    <span>'+ EnumStatus[data.status] +'</span>\
                </div>');
            }
            //TODO 临时假数据
            $listMaintenance.append('<div class="paneWfItem" data-id="111151137ddcf32fbc302221" data-toggle="modal" data-target="#wfDetail2">\
                    <div><span>截止时间</span> <label class="text-warning" title="2016-02-25">明天</label></div>\
                    <span class="label label-success"><span class="glyphicon glyphicon-grain" aria-hidden="true"></span> 保养</span>\
                    <span>golding2</span>\
                    <span>检查AHU-E-1 温度传感器</span>\
                </div>\
                <div class="paneWfItem" data-id="111151137ddcf32fbc302221" data-toggle="modal" data-target="#wfDetail3">\
                    <div><span>截止时间</span> <label class="text-danger" title="2016-02-25">今天</label></div>\
                    <span class="label label-success"><span class="glyphicon glyphicon-grain" aria-hidden="true"></span> 保养</span>\
                    <span>golding2</span>\
                    <span>清洗5#冷却水泵过滤器。</span>\
                </div>');

            $listMaintenance.append(tempHtml);
        }).always(function(){
            Spinner.stop();
        });
    };

    return new MaintenanceRecord();

}());
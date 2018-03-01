/**
 * Created by vicky on 2016/3/1.
 */
var PatrolPoint = (function(){
    var _this;
    function PatrolPoint(){
        _this = this;
        this.container = $('#paneRightCtn');
    }

    PatrolPoint.prototype.init = function(){
        var $tablePoints = $('#tablePoints');
        var tpl = '';
        var $spanRemove = $('#spanRemove');
        var $spanSearch = $('#spanSearch');
        WebAPI.get('/patrol/point/getList/' + AppConfig.projectId).done(function (result){
            for(var i in result.data){
                if(result.data[i].type === 0){
                    var pointType = '设备';
                }else{
                    var pointType = '地点';
                }
                tpl += '<tr id="'+ result.data[i]._id +'">' +
                    '<td class="tdType" data-type="'+ result.data[i].type +'">'+ pointType +'</td>' +
                    '<td class="tdName">'+ result.data[i].name +'</td>' +
                    '<td class="tdContent">'+ result.data[i].content +'</td>' +
                    '<td class="tdLasttime">'+ result.data[i].lastTime +'</td>' +
                    '<td class="tdPaths" data-value="'+ result.data[i].arrPaths.length +'"><button type="button" class="btn btn-success btn-xs">查看'+ result.data[i].arrPaths.length +'条相关路线</button></td>' +
                    '<td class="tdCode" id="'+ result.data[i].codeQR +'">' +
                    '<button type="button" class="btn btn-success btn-xs"><span class="glyphicon glyphicon-qrcode"></span>查看</button>' +
                    '</td>'+
                    '</tr>';
            }
            $tablePoints.children('tbody').html(tpl);
            $tablePoints.children('tbody').on('click','tr',function(e){
                if(e.ctrlKey){
                    if($(this).hasClass('trChecked')){
                        $(this).removeClass('trChecked');
                    }else{
                        $(this).addClass('trChecked');
                    }
                }else{
                    $(this).siblings().removeClass('trChecked');
                    $(this).addClass('trChecked');
                }
            });
            $('#tablePoints tbody tr td.tdCode').on('click','button',function(){
                var $codeQR = $(this);
                _this.code($codeQR);
            });
            $('#tablePoints tbody tr td.tdPaths').on('click','button',function(){
                var $infoModal = $('#infoModal');
                $infoModal.modal('show');
                WebAPI.get('/patrol/path/getListByPointId/'+ AppConfig.projectId +'/'+ $(this).closest('tr').attr('id')).done(function(result){
                    var tpli = '',tpol='';
                    for(var i = 0;i<result.data.length;i++){
                        for(var j = 0;j< result.data[i].path.length - 1;j++){
                            tpol += '<li><a>'+ result.data[i].path[j].name +' -&nbsp;</a></li>';
                        }
                        tpol += '<li><a>'+ result.data[i].path[j].name +'</a></li>';
                        tpli += '<li><span>'+ result.data[i].name +'</span><ol>'+ tpol +'</ol></li>'
                    }
                    $infoModal.find('ul').html(tpli);
                }).always(function(){

                })
            });
            $('#iptSearch').bind('keypress',function(event){
                var searchVal = $('#iptSearch').val();
                if (event.keyCode == "13" && searchVal != '') {
                    $spanRemove.show();
                    $spanSearch.hide();
                    for(var i = 0; i < result.data.length; i++){
                        if(result.data[i].name.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0){
                            $('#' + result.data[i]._id).show();
                        }else{
                            $('#' + result.data[i]._id).hide();
                        }
                    }
                } else if(event.keyCode == "13" && searchVal == '') {
                    $spanRemove.hide();
                    $spanSearch.show();
                    for(var i = 0; i < result.data.length; i++){
                        $('#' + result.data[i]._id).hide();
                    }
                }
            });
            $spanRemove.click(function(){
                $spanRemove.hide();
                $spanSearch.show();
                $('#iptSearch').val('');
                for(var i = 0; i < result.data.length; i++){
                    $('#' + result.data[i]._id).show();
                }
            });
        }).always(function (){

        })
    };

    PatrolPoint.prototype.show = function(){
        var _this = this;
        WebAPI.get('/static/app/Patrol/views/patrolPoint.html').done(function(resultHtml){
            _this.container.html(resultHtml);
            _this.init();
            $('#btnAddpoint').off('click').on('click',function(){
                _this.add();
            });
            $('#btnEditpoint').off('click').on('click',function(){
                _this.edit();
            });
            $('#btnRemove').off('click').on('click',function(){
                _this.remove();
            });
            $('#btnafresh').off('click').on('click',function(){
                _this.afresh();
            });
            $('#btnBatch').off('click').on('click',function(){
                _this.batch();
            });
        })
    };

    PatrolPoint.prototype.add = function(){
        var $addpointModal = $('#addpointModal');
        var $pointType = $addpointModal.find('select.pointType');
        var $pointName = $addpointModal.find('input.pointName');
        var $pointRequest = $addpointModal.find('textarea');
        //$pointType.val('');
        $pointName.val('');
        $pointRequest.val('');
        $addpointModal.on('show.bs.modal',function(){
            $addpointModal.find('h4').text('新增巡更点');
            $('#btnSave').text('添加');
        });
        $addpointModal.modal('show');
        $('#btnSave').off('click').on('click',function(){
            if($pointType.val() == '' || $pointName.val() == '' || $pointRequest.val() ==''){
                alert('巡更点的信息没填写完整！');
            }
            if($pointType.val() != '' && $pointName.val() != '' && $pointRequest.val() !=''){
                $('#addpointModal').modal('hide');
                var $tablePoints = $('#tablePoints');
                if($pointType.val() == '0'){
                    var $pointTypeVal = '设备';
                }else{
                    var $pointTypeVal = '地点';
                }
                $tablePoints.children('tbody').append('<tr id=""><td class="tdType" data-type="'+ $pointType.val() +'">'+$pointTypeVal+ '</td>' +
                    '<td class="tdName">'+$pointName.val()+'</td>' +
                    '<td class="tdContent">'+$pointRequest.val()+'</td>' +
                    '<td class="tdLasttime"></td>' +
                    '<td class="tdPaths" data-value="0"><button type="button" class="btn btn-success btn-xs">无相关路线</button></td>' +
                    '<td class="tdCode">' +
                    '<button type="button" class="btn btn-success btn-xs"><span class="glyphicon glyphicon-qrcode"></span>查看</button>' +
                    '</td></tr>');
                var addCode = $('#tablePoints tbody tr:last td.tdName').text() + new Date().format('yyyy-MM-dd HH:mm:ss');
                var lastTdCode = $('#tablePoints tbody tr:last td.tdCode');
                lastTdCode.attr('id',hex_sha1(addCode));
                lastTdCode.on('click','button',function(){
                    var $codeQR = $('#tablePoints tbody tr:last td.tdCode');
                    _this.code($codeQR);
                });
                var data = {
                    _id: null,
                    type: $pointType.val(),
                    name: $pointName.val(),
                    content: $pointRequest.val(),
                    codeQR: lastTdCode.attr('id'),
                    creatorId: AppConfig.userId
                };
                WebAPI.post('/patrol/point/save/'+ AppConfig.projectId,data).done(function(result){
                    $tablePoints.find('tr:last').attr('id',result.data);
                }).always(function(){

                })
            }
        })
    };
    PatrolPoint.prototype.edit = function(){
        var $tablePoints = $('#tablePoints');
        var $trCheckeds = $('#tablePoints tbody tr.trChecked');
        if($trCheckeds.length === 1){
            var $trChecked = $tablePoints.find('tr.trChecked');
            var $tdPointName = $trChecked.children('td.tdName');
            var $tdPointType = $trChecked.children('td.tdType');
            var $tdPointRequest = $trChecked.children('td.tdContent');
            var $tdCodeQR = $trChecked.children('td.tdCode');
            var $addpointModal = $('#addpointModal');
            $addpointModal.on('show.bs.modal',function(){
                $addpointModal.find('h4').text('编辑巡更点');
                $('#btnSave').text('确认');
            });
            $addpointModal.modal('show');
            var $pointType = $addpointModal.find('select.pointType');
            var $pointName = $addpointModal.find('input.pointName');
            var $pointRequest = $addpointModal.find('textarea');
            $pointType.val($tdPointType.data('type'));
            $pointName.val($tdPointName.text());
            $pointRequest.val($tdPointRequest.text());
            $('#btnSave').off('click').on('click',function(){
                $('#addpointModal').modal('hide');
                var data = {
                    _id: $tablePoints.find('tr.trChecked').attr('id'),
                    type: $pointType.val(),
                    name: $pointName.val(),
                    content: $pointRequest.val(),
                };
                WebAPI.post('/patrol/point/save/'+ AppConfig.projectId,data).done(function(result){

                }).always(function(){
                    $tdPointName.html(data.name);
                    $tdPointType.html($addpointModal.find('select option:selected').text());
                    $tdPointRequest.html(data.content);
                })
            });
        }
    };
    PatrolPoint.prototype.remove = function(){
        var $tablePoints = $('#tablePoints');
        var $trCheckeds = $('#tablePoints tbody tr.trChecked');
        if($trCheckeds.length === 1) {
            confirm("该巡更点已关联"+ $trCheckeds.find('.tdPaths').attr('data-value') +"条线路，确定删除？",function(){
                var $trChecked = $tablePoints.find('tr.trChecked');
                var data = {
                    _id: $tablePoints.find('tr.trChecked').attr('id')
                };
                WebAPI.post('/patrol/point/remove/' + AppConfig.projectId + '/' + data._id, data).done(function (result) {

                }).always(function () {
                    $trChecked.remove();
                })
            },function(){
                return;
            });
        }else{
            alert('一次只能删除一个巡更点！');
        }
    };
    PatrolPoint.prototype.code = function($codeQR){
        //var _this = this;
        var $codeModal = $('#codeModal');
        if($codeQR.parent('td').length === 0){
           $codeQR = $codeQR.children('button');
        }
        $('#btnPrint').on('click',function(){
            var newstr = document.getElementById('printCode').innerHTML;
            //document.body.innerHTML=document.getElementById('printCode').innerHTML;
            printWindow = window.open();
            printWindow.document.write(newstr);
            $(printWindow.document.getElementsByClassName('ewm-p')).css('font-family','Microsoft YaHei');
            $(printWindow.document.getElementById('qrcodeCanvas')).empty().qrcode({
                text: $codeQR.parent('td').attr('id')
            });
            printWindow.print();
            $(printWindow.document.getElementById('qrcodeCanvas')).parent('div').hide();
        })
        $codeModal.modal('show').find('.modal-body').find('p').text($codeQR.parent().siblings('td.tdName').text());
        $('#qrcodeCanvas').empty().qrcode({
            text: $codeQR.parent('td').attr('id')
        });
    };
    PatrolPoint.prototype.afresh = function(){
        var $batchModal = $('#batchModal');
        var $trCheckeds = $('#tablePoints tbody tr.trChecked');
        var nameData = [],codeData = [];
        for(var i = 0;i < $trCheckeds.length;i++){
            var $tdPointName = $($trCheckeds[i]).children('td.tdName');
            var $tdCodeQR = $($trCheckeds[i]).children('td.tdCode');
            var newCode = $tdPointName.text() + new Date().format('yyyy-MM-dd HH:mm:ss');
            var newCodeQR = hex_sha1(newCode);
            var data = {
                _id: $($trCheckeds[i]).attr('id'),
                codeQR: newCodeQR
            };
            nameData.push($tdPointName.text());
            codeData.push(data.codeQR);
            $tdCodeQR.attr('id',newCodeQR);
            WebAPI.post('/patrol/point/save/'+ AppConfig.projectId,data).done(function(result){

            }).always(function(){

            })
        }
        $batchModal.modal('show').find('.modal-body .row').empty().html(beopTmpl('temp_print_data', {
            data: codeData
        }));
        $('#btnBatchPrint').hide();
        $('.qrcodes').each(function (index, item) {
            $(item).qrcode({
                text: codeData[index]
            })
        });
        $('#batchModal .ewm-p').each(function (index, item) {
            $(item).html(nameData[index])
        });
    };
    PatrolPoint.prototype.batch = function(){
        var $trCheckeds = $('#tablePoints tbody tr.trChecked');
        var $batchModal = $('#batchModal');
        var printData = [],printTitleData = [];
        if($trCheckeds.length > 1 && $trCheckeds.length < 7) {
            for (var i = 0; i < $trCheckeds.length; i++) {
                if($($trCheckeds[i]).children('td.tdCode').attr('id') == 'null'){
                    alert('所选二维码中有无效二维码！');
                    return;
                }
                printData.push($($trCheckeds[i]).children('td.tdCode').attr('id'));
                printTitleData.push($($trCheckeds[i]).children('td.tdName').text());
            }
        }else if($trCheckeds.length > 6){
            alert('最多同时打印六个二维码！');
            return;
        }else{
            alert('请选择至少两个巡更点！');
            return;
        }
        //打印二维码
        $('#btnBatchPrint').on('click',function(){
            var $trCheckeds = $('#tablePoints tbody tr.trChecked');
            var printData = [],printTitleData = [];
            if($trCheckeds.length > 1) {
                for (var i = 0; i < $trCheckeds.length; i++) {
                    printData.push($($trCheckeds[i]).children('td.tdCode').attr('id'));
                    printTitleData.push($($trCheckeds[i]).children('td.tdName').text());
                }
            }
            var newstr = document.getElementById('divBatchPrint').innerHTML;
            printWindow = window.open();
            printWindow.document.write(newstr);
            $(printWindow.document.getElementById('divRow')).empty().html(beopTmpl('temp_print_data', {
                data: printData
            }));
            $(printWindow.document.getElementsByClassName('col-xs-4')).css({'display':'inline-block','margin-left':'6%'});
            $(printWindow.document.getElementsByClassName('ewm-p')).css({'font-weight':'bold','text-align':'center','font-family':'Microsoft YaHei'});
            $(printWindow.document.getElementsByClassName('qrcodes')).each(function (index, item) {
                $(item).qrcode({
                    text: printData[index]
                })
            });
            $(printWindow.document.getElementsByClassName('ewm-p')).each(function (index, item) {
                $(item).html(printTitleData[index])
            });
            printWindow.print();
            $(printWindow.document.getElementById('divRow')).hide();
        })
        $batchModal.modal('show').find('.modal-body .row').empty().html(beopTmpl('temp_print_data', {
            data: printData
        }));
        $('#btnBatchPrint').show();
        $('.qrcodes').each(function (index, item) {
            $(item).qrcode({
                text: printData[index]
            })
        });
        $('#batchModal .ewm-p').each(function (index, item) {
            $(item).html(printTitleData[index])
        });
    };

    PatrolPoint.prototype.close = function(){
        this.container.empty();
    };

    return PatrolPoint;
}());


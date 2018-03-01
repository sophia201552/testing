/**
 * Created by vicky on 2016/3/1.
 */
var PatrolPoint = (function(){
    var _this;
    function PatrolPoint(screen){
        _this = this;
        this.container = $('#paneRightCtn');
        if(screen){
            screen.close();
            this.screen = screen;
        }
    }

    PatrolPoint.prototype.init = function(){
        var $tablePoints = $('#tablePoints');
        var tpl = '';
        var $spanRemove = $('#spanRemove');
        var $spanSearch = $('#spanSearch');
        var target = $('#divPatrolPoint')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/point/getList/' + AppConfig.projectId).done(function (result){
            if(_this.screen.sortData === '0'){
                result.data.sort(function (a, b) {
                    return (a.name).localeCompare(b.name);
                });
            }else{
                result.data.sort(function (a, b) {
                    return (b.name).localeCompare(a.name);
                });
            }
            for(var i in result.data){
                if(result.data[i].type === 0){
                    var pointType = '设备';
                }else{
                    var pointType = '地点';
                }
                if(result.data[i].status === 1){
                tpl += '<tr id="'+ result.data[i]._id +'">' +
                    '<td class="tdType" data-type="'+ result.data[i].type +'">'+ pointType +'</td>' +
                    '<td class="tdName">'+ result.data[i].name +'</td>' +
                    '<td class="tdContent" title="'+ result.data[i].content +'">'+ result.data[i].content +'</td>' +
                    //'<td class="tdLasttime">'+ result.data[i].lastTime +'</td>' +
                    '<td class="tdPaths" data-value="'+ result.data[i].arrPaths.length +'"><button type="button" class="btn btn-success btn-xs">查看'+ result.data[i].arrPaths.length +'条相关路线</button></td>' +
                    '<td class="tdCode" id="'+ result.data[i].codeQR +'">' +
                    '<button type="button" class="btn btn-success btn-xs"><span class="glyphicon glyphicon-qrcode"></span>查看</button>' +
                    '</td>'+
                    '</tr>';
                }
            }
            $tablePoints.children('tbody').html(tpl);
            //每行被选中的增加样式
            var start = null;
            $tablePoints.children('tbody').on('click','tr',function(e){
                if(e.ctrlKey){
                    if($(this).hasClass('trChecked')){
                        $(this).removeClass('trChecked');
                    }else{
                        $(this).addClass('trChecked');
                    }
                }else if(!$(this).hasClass('trChecked')){
                    $(this).siblings().removeClass('trChecked');
                    $(this).addClass('trChecked');
                }else{
                    $(this).removeClass('trChecked');
                }
                if(e.shiftKey){
                    var allTr = $('#tablePoints tbody tr');
                    var startIndex = $(start).index();
                    var endIndex = $(this).index();
                    var selectedTr = allTr.slice(Math.min(startIndex,endIndex),Math.max(startIndex,endIndex)+1);
                    selectedTr.addClass('trChecked');
                    allTr.not(selectedTr).removeClass('trChecked');
                }
                start = this;
            });
            //查看二维码
            $('#tablePoints tbody tr td.tdCode').on('click','button',function(){
                var $codeQR = $(this);
                _this.code($codeQR);
            });
            //查看路线
            $('#tablePoints tbody tr td.tdPaths').on('click','button',function(){
                var $infoModal = $('#infoModal');
                $infoModal.modal('show');
                WebAPI.get('/patrol/path/getListByPointId/'+ AppConfig.projectId +'/'+ $(this).closest('tr').attr('id')).done(function(result){
                    var tpli = '';
                    for(var i = 0;i<result.data.length;i++){
                        var tpol='';
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
            //搜素框
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
                        $('#' + result.data[i]._id).show();
                    }
                }
            });
            $spanSearch.click(function(){
                var searchVal = $('#iptSearch').val();
                if (searchVal != '') {
                    $spanRemove.show();
                    $spanSearch.hide();
                    for(var i = 0; i < result.data.length; i++){
                        if(result.data[i].name.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0){
                            $('#' + result.data[i]._id).show();
                        }else{
                            $('#' + result.data[i]._id).hide();
                        }
                    }
                } else if(searchVal == '') {
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
            Spinner.stop();
        })
    };

    PatrolPoint.prototype.show = function(){
        var _this = this;
        WebAPI.get('/static/app/Patrol/views/patrolPoint.html').done(function(resultHtml){
            _this.container.html(resultHtml);
            if(_this.screen.sortData === '0'){
                $('#btnSort').find('.sortText').text('升序排序');
            }else{
                $('#btnSort').find('.sortText').text('降序排序');
            }
            _this.init();
            $('#btnAddpoint').off('click').on('click',function(){
                _this.add();
            });
            $('#btnEditpoint').off('click').on('click',function(){
                _this.edit();
            });
            $('#btnRemove').off('click').on('click keydown',function(e){
                if (e.keyCode) {
                    return false;
                }
                _this.remove();
            });
            $('#btnafresh').off('click').on('click',function(){
                _this.afresh();
            });
            $('#btnBatch').off('click').on('click',function(){
                _this.batch();
            });
            $('#btnSort').off('click').on('click',function(){
                _this.sort();
            })
        })
    };

    //点排序
    PatrolPoint.prototype.sort = function () {
        var $tablePoints = $('#tablePoints');
        //var sortTr = $tablePoints.children('tbody').children('tr');
        //sortTr.sort(function (a, b) {
        //    return ($(a).find('.tdName').text()).localeCompare($(b).find('.tdName').text());
        //});
        //var tpl = '';
        //sortTr.each(function(index,item){
        //    var joinTr = "<tr>"+item.innerHTML+ "</tr>";
        //    tpl += joinTr;
        //})
        $tablePoints.children('tbody').empty();
        if(_this.screen.sortData === '0'){
            $('#btnSort').children('.sortText').text('降序排序');
            _this.screen.sortData = '1';
        }else{
            $('#btnSort').children('.sortText').text('升序排序');
            _this.screen.sortData = '0';
        }
        _this.init();
    };
    //增加点
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
            if($pointType.val() == '' || $pointName.val().replace(/(^\s*)|(\s*$)/g, "") == ''){
                alert('巡更点的信息没填写完整！');
                return;
            }else if($pointRequest.val().length > 50){
                alert('巡更要求字数不能超过50个字！');
                return;
            }else if($pointName.val().length > 23){
                alert('巡更名称字数不能超过23个字！');
                return;
            }
            if($pointType.val() != '' && $pointName.val() != ''){
                $('#addpointModal').modal('hide');
                var $tablePoints = $('#tablePoints');
                if($pointType.val() == '0'){
                    var $pointTypeVal = '设备';
                }else{
                    var $pointTypeVal = '地点';
                }
                $tablePoints.children('tbody').append('<tr id=""><td class="tdType" data-type="'+ $pointType.val() +'">'+$pointTypeVal+ '</td>' +
                    '<td class="tdName">'+$pointName.val()+'</td>' +
                    '<td class="tdContent" title="'+ $pointRequest.val() +'">'+$pointRequest.val()+'</td>' +
                    //'<td class="tdLasttime"></td>' +
                    '<td class="tdPaths" data-value="0"><button type="button" class="btn btn-success btn-xs">无相关路线</button></td>' +
                    '<td class="tdCode">' +
                    '<button type="button" class="btn btn-success btn-xs"><span class="glyphicon glyphicon-qrcode"></span>查看</button>' +
                    '</td></tr>');
                var addCode = $('#tablePoints tbody tr:last td.tdName').text() + new Date().format('yyyy-MM-dd HH:mm:ss');
                var lastTdCode = $('#tablePoints tbody tr:last td.tdCode');
                lastTdCode.attr('id',hex_sha1(addCode));
                lastTdCode.on('click','button',function(){
                    var $codeQR = $(this);
                    _this.code($codeQR);
                });
                var data = {
                    _id: null,
                    type: $pointType.val(),
                    name: $pointName.val(),
                    status: 1,
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
    //编辑点
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
                if($pointType.val() == '' || $pointName.val().replace(/(^\s*)|(\s*$)/g, "") == ''){
                    alert('巡更点的信息没填写完整！');
                    return;
                }else if($pointRequest.val().length > 50){
                    alert('巡更要求字数不能超过50个字！');
                    return;
                }else if($pointName.val().length > 20){
                    alert('巡更名称字数不能超过23个字！');
                    return;
                }
                $('#addpointModal').modal('hide');
                var data = {
                    _id: $tablePoints.find('tr.trChecked').attr('id'),
                    type: $pointType.val(),
                    name: $pointName.val(),
                    content: $pointRequest.val()
                };
                WebAPI.post('/patrol/point/save/'+ AppConfig.projectId,data).done(function(result){

                }).always(function(){
                    $tdPointName.html(data.name);
                    $tdPointType.html($addpointModal.find('select option:selected').text());
                    $tdPointRequest.html(data.content);
                    $tdPointRequest.attr('title',data.content);
                })
            });
        }else if($trCheckeds.length === 0){
            alert('没有选择巡更点！');
        }else{
            alert('一次只能编辑一个巡更点！');
        }
    };
    //删除点
    PatrolPoint.prototype.remove = function(){
        var $tablePoints = $('#tablePoints');
        var $trCheckeds = $('#tablePoints tbody tr.trChecked');
        if($trCheckeds.length === 1) {
            var confirmInfo = $trCheckeds.find('.tdPaths').attr('data-value') === '0'?'是否删除该巡更点':"该巡更点已关联"+ $trCheckeds.find('.tdPaths').attr('data-value') +"条线路，确定删除？";
            confirm(confirmInfo,function(){
                var $trChecked = $tablePoints.find('tr.trChecked');
                var data = {
                    _id: $tablePoints.find('tr.trChecked').attr('id'),
                    status: 0
                };
                WebAPI.post('/patrol/point/remove/' + AppConfig.projectId + '/' + data._id, data).done(function (result) {

                }).always(function () {
                    $trChecked.remove();
                })
            },function(){
                return;
            });
        }else if($trCheckeds.length === 0){
            alert('没有选择巡更点！');
        }else{
            alert('一次只能删除一个巡更点！');
        }
    };
    //打印二维码
    PatrolPoint.prototype.code = function($codeQR){
        var _this = this;
        var $codeModal = $('#codeModal');
        if($codeQR.parent('td').length === 0){
           $codeQR = $codeQR.children('button');
        }
        $('#btnPrint').off('click').on('click',function(){
            //$codeModal.find('.ewm-t').text(new Date().format('yyyy-MM-dd HH:mm'));
            var newstr = document.getElementById('printCode').innerHTML;
            //document.body.innerHTML=document.getElementById('printCode').innerHTML;
            var printWindow = window.open();
            printWindow.document.write(newstr);
            //$(printWindow.document.getElementsByClassName('divCode')).prepend('<img class="bgImg" src="/static/app/Patrol/img/rnb.png"/>');
            //$(printWindow.document.getElementsByClassName('bgImg')).on('load',function(){
            //    $(printWindow.document.getElementsByClassName('bgImg')).css({'position':'absolute','width':'73mm','top':'30%','left':'-6px','height':'35mm'});
                $(printWindow.document.getElementsByClassName('divCode')).prepend('<img class="titleImg" src="/static/app/Patrol/img/beop.png" style="height:8mm"/>');
                $(printWindow.document.getElementsByClassName('titleImg')).on('load',function(){
                    $(printWindow.document.getElementsByClassName('divCode')).css({'width':'66mm','height':'66mm','border': '2mm solid #026EB9','position':'relative','display':'table','padding':'0'});
                    $(printWindow.document.getElementsByTagName('p')).css({'font-family':'Microsoft YaHei','margin':'0','line-height':'4mm','text-align':'center','font-size':'12px'});
                    $(printWindow.document.getElementsByClassName('divCode')).append('<div class="divLeftTriangle divTriangle"></div><div class="divRightTriangle divTriangle"></div>');
                    $(printWindow.document.getElementsByClassName('divTriangle')).css({'width':'0','height':'0','top':'38%','border-top':'14px solid transparent','border-bottom':'14px solid transparent','position':'absolute'});
                    $(printWindow.document.getElementsByClassName('divLeftTriangle')).css({'left':'-1px','border-left':'14px solid #026EB9'});
                    $(printWindow.document.getElementsByClassName('divRightTriangle')).css({'right':'-1px','border-right':'14px solid #026EB9'});
                    $(printWindow.document.getElementById('qrcodeCanvas')).css('width','66mm').empty().qrcode({
                    text: $codeQR.parent('td').attr('id')
                    });
                    $(printWindow.document.getElementsByTagName('canvas')).css('width','50mm');
                    $(printWindow.document.getElementsByClassName('ewm-t')).html(new Date().format('yyyyMMdd'));
                    _this.print(printWindow);
                    $codeModal.find('.ewm-t').text('');
                });
            //});
        });
        $codeModal.modal('show').find('.modal-body').find('.ewm-p').text($codeQR.parent().siblings('td.tdName').text());
        $('#qrcodeCanvas').empty().qrcode({
            text: $codeQR.parent('td').attr('id')
        });
    };
    PatrolPoint.prototype.print = function(printWindow){
        printWindow.print();
        $(printWindow.document.getElementById('qrcodeCanvas')).parent('div').hide();
    }
    //重新生成二维码
    PatrolPoint.prototype.afresh = function(){
        var $batchModal = $('#batchModal');
        var $trCheckeds = $('#tablePoints tbody tr.trChecked');
        var nameData = [],codeData = [];
        if($trCheckeds.length === 0){
            alert('请选择至少一个巡更点！');
            return;
        }
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
        infoBox.alert('重新生成二维码中！',{type: 'success', delay: 1000});
        $batchModal.modal('show').find('#divRow').empty().html(beopTmpl('temp_print_data', {
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
    //批量打印二维码
    PatrolPoint.prototype.batch = function(){
        var $trCheckeds = $('#tablePoints tbody tr.trChecked');
        var $batchModal = $('#batchModal');
        var printData = [],printTitleData = [];
        if($trCheckeds.length > 1) {
            for (var i = 0; i < $trCheckeds.length; i++) {
                if($($trCheckeds[i]).children('td.tdCode').attr('id') == 'null'){
                    alert('所选二维码中有无效二维码！');
                    return;
                }
                printData.push($($trCheckeds[i]).children('td.tdCode').attr('id'));
                printTitleData.push($($trCheckeds[i]).children('td.tdName').text());
            }
        }else{
            alert('请选择至少两个巡更点！');
            return;
        }
        //打印二维码
        $('#btnBatchPrint').off('click').on('click',function(){
            var $trCheckeds = $('#tablePoints tbody tr.trChecked');
            var printData = [],printTitleData = [];
            if($trCheckeds.length > 1) {
                for (var i = 0; i < $trCheckeds.length; i++) {
                    printData.push($($trCheckeds[i]).children('td.tdCode').attr('id'));
                    printTitleData.push($($trCheckeds[i]).children('td.tdName').text());
                }
            }
            var printTime = new Date().format('yyyyMMdd');
            var newstr = document.getElementById('divBatchPrint').innerHTML;
            var printWindow = window.open();
            printWindow.document.write(newstr);
            $(printWindow.document.getElementById('divRow')).empty().html(beopTmpl('temp_print_data', {
                data: printData
            }));
            //$(printWindow.document.getElementsByClassName('ewm-container')).prepend('<img class="bgImg" src="/static/app/Patrol/img/rnb.png"/>');
            //var bgImgLength = $(printWindow.document.getElementsByClassName('bgImg')).length;
            //var i = 0;
            //$(printWindow.document.getElementsByClassName('bgImg')).on('load',function(){
            //    i++;
            //    if(i === bgImgLength){
            //        $(printWindow.document.getElementsByClassName('bgImg')).css({'position':'absolute','width':'73mm','top':'30%','left':'-6px','height':'35mm'});
                    $(printWindow.document.getElementsByClassName('ewm-container')).prepend('<img class="titleImg" src="/static/app/Patrol/img/beop.png" style="height:8mm"/>');
                    var titleImgLength = $(printWindow.document.getElementsByClassName('titleImg')).length;
                    var j = 0;
                    $(printWindow.document.getElementsByClassName('titleImg')).on('load',function(){
                        j++;
                        if(j === titleImgLength){
                            $(printWindow.document.getElementsByClassName('ewm-container')).css({'width':'66mm','height':'66mm','text-align':'center','border': '2mm solid #026EB9','position':'relative','display':'inline-block','padding':'0','margin':'5mm 10mm 10mm 6mm'});
                            $(printWindow.document.getElementsByTagName('p')).css({'font-size':'12px','text-align':'center','font-family':'Microsoft YaHei','margin':'0','line-height':'4mm'});
                            $(printWindow.document.getElementsByClassName('ewm-container')).append('<div class="divLeftTriangle divTriangle"></div><div class="divRightTriangle divTriangle"></div>');
                            $(printWindow.document.getElementsByClassName('divTriangle')).css({'width':'0','height':'0','top':'38%','border-top':'14px solid transparent','border-bottom':'14px solid transparent','position':'absolute'});
                            $(printWindow.document.getElementsByClassName('divLeftTriangle')).css({'left':'-1px','border-left':'14px solid #026EB9'});
                            $(printWindow.document.getElementsByClassName('divRightTriangle')).css({'right':'-1px','border-right':'14px solid #026EB9'});
                            $(printWindow.document.getElementsByClassName('qrcodes')).css('width','66mm').each(function (index, item) {
                                $(item).qrcode({
                                    text: printData[index]
                                })
                            });
                            $(printWindow.document.getElementsByTagName('canvas')).css('width','50mm');
                            $(printWindow.document.getElementsByClassName('ewm-p')).each(function (index, item) {
                                $(item).html(printTitleData[index])
                            });
                            $(printWindow.document.getElementsByClassName('ewm-t')).each(function (index, item) {
                                $(item).html(printTime);
                            });
                            printWindow.print();
                            $(printWindow.document.getElementById('divRow')).show();
                        }
                    });
            //    }
            //});
        });
        var target = $('#divPatrolPoint')[0];
        Spinner.spin(target);
        $batchModal.on('shown.bs.modal', function () {
            Spinner.stop();
        })
        $batchModal.modal('show').find('#divRow').empty().html(beopTmpl('temp_print_data', {
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


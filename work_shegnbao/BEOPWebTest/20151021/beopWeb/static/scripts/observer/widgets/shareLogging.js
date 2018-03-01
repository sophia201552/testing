var shareLogging = (function(){
    var _this = this;
    function shareLogging(userId) {
        this.userId = userId;
        _this = this;
        _this.shareLogList = undefined;
    }
    shareLogging.prototype = {
        show: function(){
            WebAPI.get('/static/views/observer/widgets/shareLogging.html').done(function(resultHtml){
                $(ElScreenContainer).html(resultHtml);
                _this.init();
            });
        },
        init: function(){
            Spinner.spin(ElScreenContainer);
            WebAPI.get('/analysis/getShareLog/'+ this.userId).done(function(result){
                _this.shareLogList = JSON.parse(result).shareLogList;
                var totalShareLog = '';
                //for (var i = 0; i < _this.shareLogList.length; ++i){
                //    var shareTime = new Date(_this.shareLogList[i].shareDate.slice(0,_this.shareLogList[i].shareDate.indexOf('GMT'))).format('yyyy-MM-dd HH:mm:ss');
                //    var strShareLog = new StringBuilder();
                //    strShareLog.append('<a href="" style="display:block;text-decoration:none;"><div class="row rowShareLogContent" id="' + _this.shareLogList[i].shareLogId + '">');
                //    strShareLog.append('    <div class="col-xs-1"><span class="glyphicon glyphicon-remove btnShareRemove grow" title="删除"></span><span class="glyphicon glyphicon-edit btnSharePageEdit grow" title="编辑页面">' +
                //                        '</span><span class="shareLogIndex">'+ String(i + 1) + '</span></div>');
                //    strShareLog.append('    <div class="col-xs-5 shareURL">'+ window.location.origin + '/share/db/' + _this.shareLogList[i].userId + '/' + _this.shareLogList[i].menuItemId + '</div>');
                //    strShareLog.append('    <div class="col-xs-4 shareDesc"><span>' + _this.shareLogList[i].shareDesc + '</span></div>');
                //    strShareLog.append('    <div class="col-xs-2 shareDate">' + shareTime + '</div>');
                //    strShareLog.append('</div></a>');
                //    totalShareLog += strShareLog;
                //}

                for (var i = 0; i < _this.shareLogList.length; ++i) {
                    //var GMTime = new Date(_this.shareLogList[i].shareDate.slice(0, _this.shareLogList[i].shareDate.indexOf('GMT')));<!--shareOrder  shareDescribe   shareDate   shareOperate-->
                    var shareTime = new Date(_this.shareLogList[i].shareDate.slice(0, _this.shareLogList[i].shareDate.indexOf('GMT'))).format('yyyy-MM-dd HH:mm');//:ss
                    var strShareLog = new StringBuilder();
                    //strShareLog.append('<a href="' + window.location.origin + '/share/db/' + _this.shareLogList[i].userId + '/' + _this.shareLogList[i].menuItemId + '" style="display:block;text-decoration:none;"><div class="row rowShareLogContent" id="' + _this.shareLogList[i].shareLogId + '">');
                    strShareLog.append('<div class="row rowShareLogContent" menuId ="' + _this.shareLogList[i].menuItemId +'" id="' + _this.shareLogList[i].shareLogId + '">');
                    strShareLog.append('    <div class="shareOrder">' +
                                        '<span class="shareLogIndex">' + String(i + 1) + '</span></div>');
                    //strShareLog.append('    <div class="col-xs-5 shareURL">' + window.location.origin + '/share/db/' + _this.shareLogList[i].userId + '/' + _this.shareLogList[i].menuItemId + '</div>');
                    //shareTimeSimple +
                    strShareLog.append('    <div class="shareDescribe shareCon"><span style="text-align:left;vertical-align:middle;display:inline-block;width:90%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" class="shareVal" title="">' +
                                            _this.shareLogList[i].shareDesc + '</span><span class="glyphicon glyphicon-pencil shareDesc" style="vertical-align:middle;display:none;"></span></div>');
                    strShareLog.append('    <div class="shareDate shareDate">' + shareTime + '</div>');
                    strShareLog.append('    <div class="shareOperate"><span class="glyphicon glyphicon-edit btnSharePageEdit grow" title="编辑页面"></span><span class="glyphicon glyphicon-remove btnShareRemove grow" title="删除"></span></div>');
                    strShareLog.append('<br style="clear:both;"></div>');
                    totalShareLog += strShareLog;
                }

                if (totalShareLog == ''){
                    $('.divShareLog').parent().html('<div class="shareNone">' + I18n.resource.analysis.shareLog.NONE_LOG + '</div>');
                    $('.shareNone').off('click').click(function(){
                        ScreenManager.show(AnalysisScreen);
                    });
                }else {
                    $('.divShareLog').html(totalShareLog);
                }
                $('.shareURL').click(function(e){
                   window.open(e.target.innerHTML)
                });
                $('.btnShareLogClose').off('click').click(function(){
                    ScreenManager.show(AnalysisScreen);
                });
                $('.shareCon').off('click').hover(function () {
                    if ($('.shareCon input').length > 0) return;
                    $(this).children('.shareDesc').show();
                    $(this).children('.shareVal').attr('title', $(this).children('.shareVal').text());
                        //console.log($('shareCon input').length);
                }, function () {
                    $(this).children('.shareDesc').hide();
                });
                $('.rowShareLogContent').off('click').hover(function () {
                    $(this).children('.shareOperate').show();
                }, function () {
                    $(this).children('.shareOperate').hide();
                });

                //链接到页面
                $('.rowShareLogContent').click(function (e) {
                    window.open(window.location.origin + '/share/db/' + AppConfig.userId + '/' + $(e.currentTarget).attr('menuId'),'_blank');
                    //console.log($(e.target).attr('menuId'));
                })
                _this.initEdit();
                _this.initDelete();
                _this.initDashboardPageEdit();
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            });
        },
        initEdit: function(){
            //$('shareDesc').each(function(index){
            //    if ($(this).text() == '') {
            //        shareDesShow();
            //    }
            //});
            $('.shareDesc').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var shareOldVal = $(e.currentTarget).prev('span').text();
                $(e.currentTarget).parent().children().css('display','none');
                var inputDescEdit = document.createElement('input');
                inputDescEdit.setAttribute('type','text');
                inputDescEdit.setAttribute('placeholder',I18n.resource.analysis.shareLog.DESC_TIP);
                inputDescEdit.style.width = '80%';
                inputDescEdit.value = shareOldVal;//$(e.target).text();
                $(e.currentTarget).parent().append(inputDescEdit);
                inputDescEdit.focus();
                var oldDesc = inputDescEdit.value;
                $(inputDescEdit).click(function(e){
                    e.stopPropagation();
                });
                inputDescEdit.onblur = function(e){
                    //var shareId = $(e.target).closest('.rowShareLogContent').attr('id');
                    //e.preventDefault();
                    //e.stopPropagation();
                    var postData =
                    {
                        desc:e.target.value,
                        shareId:$(e.target).closest('.rowShareLogContent').attr('id')
                    };
                    if (oldDesc != e.target.value) {
                        WebAPI.post('/analysis/editShareLog/0', postData).done(function (result) {
                            console.log(result);
                        }).error(function () {
                            alert('Edit ShareLog Error');
                        });
                    }
                    $(e.target).prev().html(e.target.value).css('display', '');
                    $(e.target).siblings('.shareVal').css('display', 'inline-block').html(e.target.value);
                    $(e.target).siblings('.shareDesc').html('');
                    e.target.remove();
                }
            });
        },
        initDelete: function(){
            $('.btnShareRemove').click(function(e){
                var retCon = confirm(I18n.resource.analysis.shareLog.REMOVE_ALERT);
                if (true === retCon) {
                    var index = $('.btnShareRemove').index($(e.target));
                    var postData =
                    {
                        menuItemId: _this.shareLogList[index].menuItemId,
                        shareId:$(e.target).closest('.rowShareLogContent').attr('id')
                    };
                    WebAPI.post('/analysis/editShareLog/1',postData).done(function(result){
                        console.log(result);
                    }).error(function(){
                        alert('Remove ShareLog Error');
                    });
                    _this.shareLogList.splice(index,1);
                    $(e.target).closest('.rowShareLogContent').remove();
                    $('.shareLogIndex').each(function(index){
                        $(this).text(index + 1)
                    });
                    if ($('.rowShareLogContent').length == 0){
                        $('#shareLogPanel .panel-body').html('<div class="shareNone">' + I18n.resource.analysis.shareLog.NONE_LOG + '</div>');
                        $('.shareNone').off('click').click(function(){
                            ScreenManager.show(AnalysisScreen);
                        });
                    }
                }
            });
        },
        initDashboardPageEdit: function(){
            $('.btnSharePageEdit').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var index = $('.btnSharePageEdit').index($(e.target));
                var menuItemId = _this.shareLogList[index].menuItemId;
                var postData = {
                    shareLogId: _this.shareLogList[index].shareLogId,
                    desc:_this.shareLogList[index].shareDesc
                    };
                ScreenManager.show(EnergyScreen, menuItemId,null,postData);
            });
        },
        close: function(){
            _this.shareLogList = null;
        }
    };
    return shareLogging;
})();
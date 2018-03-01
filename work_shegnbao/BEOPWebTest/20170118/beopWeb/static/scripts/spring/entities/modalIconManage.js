/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalIconManage = (function(){
    var _this;
    function ModalIconManage(currentDataList,currentId) {
        _this = this;
        //if (!entityParams) return;
    }
    ModalIconManage.prototype = new ModalIconManage();

    ModalIconManage.prototype.show = function(currentDataList,currentId,callback){
        var $iptColor;
        _this.currentDataList = currentDataList;
        _this.currentId = currentId;
        if (_this.$modal) {
            _this.$modal.modal('show');
            $iptColor = _this.$modal.find('#iptColorSel');
            if (_this.currentDataList.iconColor) {
                $iptColor.val(_this.currentDataList.iconColor);
            }
            var nowIcon = _this.currentDataList.icon;
            var currentIconType = _this.currentDataList.iconType?_this.currentDataList.iconType:'bootIcon';
            if (nowIcon) {
                if(currentIconType==='svg'||currentIconType==='image'){
                    _this.$modal.find('.bs-glyphicons-list .' + currentIcon.split('@*')[0]).parent().addClass('selected');
                }else{
                    _this.$modal.find('.bs-glyphicons-list .' + currentIcon.split(' ')[1]).parent().addClass('selected');
                }
            }
        }else{
            WebAPI.get('static/scripts/spring/entities/modalMonitor.html').done(function (resultHTML) {
                _this.$modal = $(resultHTML);
                $iptColor = _this.$modal.find('#iptColorSel');
                _this.$modal.modal('show');
                if(_this.currentDataList.iconColor){
                   $iptColor.val(_this.currentDataList.iconColor);
                }
                var currentIcon = _this.currentDataList.icon;
                var currentIconType = _this.currentDataList.iconType?_this.currentDataList.iconType:'bootIcon';
                if (currentIcon) {
                    if(currentIconType==='svg'||currentIconType==='image'){
                        _this.$modal.find('.bs-glyphicons-list .' + currentIcon.split('@*')[0]).parent().addClass('selected');
                    }else{
                        _this.$modal.find('.bs-glyphicons-list .' + currentIcon.split(' ')[1]).parent().addClass('selected');
                    }
                }
                _this.$modal.find('.bs-glyphicons-list>li').click(function (e) {
                    if ($(e.currentTarget).hasClass('selected')) return;
                    $('.bs-glyphicons-list>li.selected').removeClass('selected');
                    $(e.currentTarget).addClass('selected');
                });
                //icon里面的确认button
                _this.$modal.find('.btnSure').click(function (e) {
                    e.stopPropagation();
                    //var $divMonitor = $('#ctnMonitor .divMonitor.selected');
                    //var index = $ctnMonitor.children().index($divMonitor);
                    var $glyphiconClass = $('.bs-glyphicons-list>li.selected>.glyphicon-class');
                    var icon = $glyphiconClass.html();
                    var iconType = $glyphiconClass.attr('type');
                    if(iconType==='svg'||iconType==='image'){
                        _this.currentDataList.icon = $('.bs-glyphicons-list>li.selected>span:first').attr('class')+'@*'+icon;

                    }else{
                        _this.currentDataList.icon = icon;
                    }
                    _this.currentDataList.iconType = iconType

                    _this.currentDataList.iconColor = $iptColor.val();
                    _this.currentDataList.entityId = _this.currentId;
                    _this.$modal.modal('hide');
                    if(callback&&Object.prototype.toString.call(callback)==='[object Function]'){
                        callback(_this.currentDataList.icon,_this.currentDataList.iconColor,_this.currentDataList.iconType);
                    }
                    return _this.currentDataList;
                })
            })
        }
    };

    return ModalIconManage;
})();



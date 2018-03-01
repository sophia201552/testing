/**
 * Created by vicky on 2016/1/29.
 */

var AssetInfoPanel =(function(){
    var _this;
    function AssetInfoPanel(screen, $parentPane){
        _this = this;
        this.screen = screen;
        this.$panel = $parentPane;
    }

    AssetInfoPanel.prototype.show = function(){
        //this.initPanel();
    }

    AssetInfoPanel.prototype.close = function(){

    }

    AssetInfoPanel.prototype.initPanel = function(){
        WebAPI.get('/static/app/Asset/views/panels/assetInfoPanel.html').done(function(resultHtml){
            _this.$panel.html(resultHtml);
            _this.attachEvent();
        })

    }

    AssetInfoPanel.prototype.attachEvent = function(){

        this.$btnAddMaintenance = $('#btnAddMaintenance');
        this.$btnDataSrcEdit = $('#btnDataSrcEdit');
        this.$btnDataView = $('#btnDataView');
        this.$realtimeDataTab = $('#realtimeData');

        //实时数据编辑
        this.$btnDataSrcEdit[0].onclick = function(){
            $(this).hide();
            _this.$btnDataView.show();
            _this.$realtimeDataTab.addClass('edit');
        }

        this.$btnDataView[0].onclick = function(){
            $(this).hide();
            _this.$btnDataSrcEdit.show();
            _this.$realtimeDataTab.removeClass('edit');
        }

        //时间选择控件初始化
        $('.datetimepicker').datetimepicker('remove');
        $('.datetimepicker').datetimepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
            minView: 'month'
        });

        //增加维修记录
        this.$btnAddMaintenance[0].onclick = function(){

        }
    }

    return AssetInfoPanel;
}())




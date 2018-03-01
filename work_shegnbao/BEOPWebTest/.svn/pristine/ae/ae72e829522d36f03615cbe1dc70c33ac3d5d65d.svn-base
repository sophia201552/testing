/**
 * Created by vicky on 2016/1/29.
 */

var AssetListPanel = (function(){
    function AssetListPanel(screen, parentPane){
        this.screen = screen;
        this.$parentPanel = parentPane;
    }

    AssetListPanel.prototype.show = function(){
        this.initPanel();

    }

    AssetListPanel.prototype.initPanel = function(){
        this.attachEvent();
    }

    AssetListPanel.prototype.render = function(data, treeNode){
        var pathNode = treeNode.getPath(), pathStr = '', nodeHtml = '';
        var pathLen = pathNode.length, $path = this.$parentPanel.find('#spanPath'), $tbodyAsset = this.$parentPanel.find('#tbAsset tbody');
        var dicStatus = {
             '0': '已停止',
             '1': '已启动',
             '2': '维修中'
        }

         //拼接路径
         for(var i = 0; i < pathLen; i++){
            pathStr = (pathStr + pathNode[i].name + ' / ');
         }
         $path.text(pathStr);



         for(var i = 0, type, endTime, updateTime, status, obj, desc; i < data.length; i++){
             obj = data[i];
             updateTime = obj.updateTime ? obj.updateTime.split(' ')[0] : '--:--'
             endTime = obj.endTime ? obj.endTime.split(' ')[0] : '--:--';
             status = obj.status ? dicStatus[obj.status] : '--';
             desc = obj.desc ? obj.desc : '--';
             type = this.screen.filterPanel.dictClass.things[obj.type] ? this.screen.filterPanel.dictClass.things[obj.type].name : "";
             nodeHtml += ('<tr data-id="'+ obj._id +'" data-model="'+ obj.model +'" data-name="'+ obj.name +'" data-type="'+ obj.type +'" data-endtime = "'+ endTime +'">\
                          <td class="type">'+ type +'</td>\
                          <td class="name">'+ obj.name +'</td>\
                          <td><div class="tdDes" title="'+ desc +'">'+ desc +'</div></td>\
                          <td class="manager">'+ (obj.manager ? obj.manager : '--') +'</td>\
                          <td>'+ updateTime +'</td>\
                          <td>'+ endTime +'</td>\
                          <td>'+ status +'</td>\
                        </tr>');
         }
         $tbodyAsset.html(nodeHtml);
    }

    AssetListPanel.prototype.close = function(){

    }

    AssetListPanel.prototype.attachEvent = function(){
        var _this = this, $tbAsset = $('#tbAsset'), index = 1;
        this.infoPanel = undefined;
        this.arrAsset = [];

        //todo 获取当前面板 tab-handle
        $('.tab-handle').off('click').on('click', function(){
            index = $(".tab-handle").index($(this));

            //根据当前激活的信息面板,决定调用渲染方法
            //todo 代码有待优化, 不必每次都new 一个对象
            switch (index){
                /*case 1:
                    _this.infoPanel = BasicInfo;//基本信息
                    break;*/
                case 2:
                    _this.infoPanel = NameplateInfo;//铭牌信息
                    break;
                case 3:
                    _this.infoPanel = new RealtimeData(_this);//实时数据
                    break;
                case 4:
                    _this.infoPanel = MaintenanceRecord;//维修记录
                    break;
                case 5:
                    _this.infoPanel = DiagnosisRecord;//诊断记录
                    break;
                case 6:
                    _this.infoPanel = WorkOrder;//发送管理
                    break;
                default :
                    _this.infoPanel = BasicInfo;
                    break;
            }

            //如果当前有选中的资产项
            if($tbAsset.find('.selected').length > 0){
                _this.infoPanel.show(_this.arrAsset);
            }
        });

        //todo 多选还有问题
        $tbAsset.find('tbody').on('click', 'tr', function(e){
            if(e.ctrlKey && $.inArray(index, [1, 2, 3]) < 0){//只有 维修记录 诊断记录 文件管理 可以多选
                $(this).addClass('selected');
                _this.arrAsset.push({id: this.dataset.id, model: this.dataset.model});

                //如果选择了2个及以上, 那么隐藏 基本信息/铭牌信息/实时数据
                $(".tab-handle:eq(1)").hide();
                $(".tab-handle:eq(2)").hide();
                $(".tab-handle:eq(3)").hide();
            }else{
                $(this).addClass('selected').siblings().removeClass('selected');
                _this.arrAsset.length = 0;
                _this.arrAsset.push({id: this.dataset.id, model: this.dataset.model});

                $(".tab-handle:eq(1)").show();
                $(".tab-handle:eq(2)").show();
                $(".tab-handle:eq(3)").show();
            }
            _this.infoPanel.show(_this.arrAsset);
        })
    }

    return AssetListPanel;
}())

/**
 * Created by win7 on 2016/8/29.
 */
/*数据源拖拽工作区 start*/
var DataSourceWorkSpace = (function(){
    function DataSourceWorkSpace($ctn,opt,callback){
        this.$ctn = $ctn;
        this.opt = opt;
        this.callback = callback?callback:{};
        this.dataSource = this.opt.dataSource ? this.opt.dataSource:AppConfig.datasource;
    }
    DataSourceWorkSpace.prototype = {
        init:function(){
            this.initWorkSpaceDom();
            this.attachEvent();
        },
        initWorkSpaceDom:function(){
            if(this.opt.appendMode == 'single') {
                this.$ctn.addClass('ctnDataSourceWorkSpace singleDataSource');
            }else if (this.opt.appendMode == 'multi'){
                this.$ctn.addClass('ctnDataSourceWorkSpace multiDataSource');
            }
            if (this.opt.isVertical)this.$ctn.addClass('vertical');
            if (this.opt.data && this.opt.data.length > 0) {
                for (var i= 0; i < this.opt.data.length ;i++) {
                    this.$ctn.append(this.createDataRole(this.opt.data[i]))
                }
            }else{
                this.$ctn.append(this.createDataRole());
            }
        },
        createDataRole:function(data){
            var dataTypeDom = document.createElement('div');
            dataTypeDom.className = 'divDataRole clearfix';
            data && data.role && (dataTypeDom.dataset.role = type);
            dataTypeDom.innerHTML =`
            <label class='labelDataRole'>${data && data.name?data.name:'数据点位'}</label>
            <div class="divDataAppendTip">
                <span class="glyphicon glyphicon-plus spGeneralTip"></span>
                <span class="spHoverTip">请将数据拖拽至此</span>
            </div>`;
            if (data && data.length > 0){
                for (var i= 0; i < data.length ;i++) {
                    dataTypeDom.insertBefore(this.createDataPoint(data.point[i]), dataTypeDom.lastChild)
                }
            }
            return dataTypeDom
        },
        createDataPoint:function(id){
            var unit = document.createElement('div');
            unit.className = 'divDataSource';
            unit.innerHTML = `<span class='spDataSource'></span><span class='btnDataSourceDel glyphicon glyphicon-remove'></span>`;
            if (id){
                unit.dataset.id = id;
                this.dataSource && (unit.querySelector('.spDataSource').innerHTML = this.dataSource.getDSItemById(id).alias);
            }
            return unit
        },
        attachEvent:function(){
            //if (this.opt && this.opt.filter){
            //    this.$ctn.off('dragover').on('dragover',this.opt.filter,dragOver);
            //    this.$ctn.off('dragover').on('dragleave',this.opt.filter,dragLeave);
            //    this.$ctn.off('dragover').on('drop',this.opt.filter,drop);
            //}else{
            //
                this.$ctn.off('dragover').on('dragover','.divDataRole',dragOver);
                this.$ctn.off('dragleave').on('dragleave','.divDataRole',dragLeave);
                this.$ctn.off('drop').on('drop','.divDataRole',drop);
            //}
            var _this = this;
            function dragLeave(e){
                e.preventDefault();
                if (_this.callback && jQuery.isFunction(_this.callback.dragLeave)){
                    _this.callback.dragLeave(e);
                }
            }
            function dragOver(e){
                e.preventDefault();
                if (_this.callback && jQuery.isFunction(_this.callback.dragOver)){
                    _this.callback.dragOver(e);
                }
            }
            function drop(e){
                e.preventDefault();
                _this.dropDataSource($(e.currentTarget));
                if (jQuery.isFunction(_this.callback)){
                    _this.callback(e);
                }else if(jQuery.isFunction(_this.callback.drop)){
                    _this.callback.drop(e);
                }
            }


            this.$ctn.off('click').on('click','.btnDataSourceDel',function(e){
                var $target = $(e.currentTarget).parent();
                $target.remove();
                if($target.parent().find('.divDataSource').length == 0){
                    $target.parent().removeClass('hasDs')
                }
            })
        },
        getData:function(){
            var arrData = [];
            var dataRs = {};
            var arrPointId;
            var $divDataRole = this.$ctn.find('.divDataRole');
            var $divDataSource;
            for (var i= 0 ; i< $divDataRole.length ;i++) {
                dataRs = {
                    role: $divDataRole[i].dataset.role ?$divDataRole[i].dataset.role:'',
                    id:[]
                };
                $divDataSource = $divDataRole.eq(i).find('.divDataSource');
                for (var j = 0 ; j < $divDataSource.length ;j++){
                    $divDataSource[j].dataset.id && dataRs.id.push($divDataSource[j].dataset.id)
                }
                arrData.push(dataRs);
            }
            return arrData;
        },
        getDataIdList:function(){
            var arrId = this.getData().map(point=>{return point.id});
            var idList = [];
            for (let i = 0 ; i < arrId.length ;i++){
                idList = idList.concat(arrId[i])
            }
            return idList;
        },
        dropDataSource:function($target){
            var id;
            if (this.opt.idKey){
                id = EventAdapter.getData()[this.opt.idKey];
            }else{
                id = EventAdapter.getData().dsItemId;
            }
            if (this.opt.appendMode == 'multi'){
                $target.addClass('hasDs');
                $target.find('.divDataAppendTip').before(this.createDataPoint(id))
            }else if(this.opt.appendMode == 'single'){
                $target.addClass('hasDs');
                var $ds = $target.find('.divDataSource');
                if ($ds.length == 0){
                    $ds = $(this.createDataPoint(id));
                    $target.append($ds);
                }else{
                    $ds[0].dataset.id = id;
                    $ds.find('.spDataSource').text(this.dataSource.getDSItemById(id))
                }
            }
        },
        destroy:function(){
        }
    };
    return DataSourceWorkSpace
})();
/*数据源拖拽工作区 end*/
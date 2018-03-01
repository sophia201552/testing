(function(exports) {
    var _this;
    var modalHtml = '\
        <div class="modal fade" id="heat3DModal">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
                        <h4 class="modal-title">3D热力图配置</h4>\
                    </div>\
                    <div class="modal-body">\
                        <button id="imageBtn" type="button" class="btn btn-default">选择蒙层</button>\
                        <div class="bgPreviewShow" style="background-repeat: no-repeat; background-size: 100% 100%; height: 200px; border: 1px solid #ccc;">\
                            <p i18n="mainPanel.bgSelect.PREVIEW" style="text-align: center; line-height: 200px; font-size: 18px;">效果图</p>\
                        </div>\
                    </div>\
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
                        <button type="button" class="btn btn-primary" id="addBtn">Save</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
    ';
    function THeat3D(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;
        this.layer = this.painter.interactiveLayer;

        this.objId = ObjectId();
        this.$heat3DModal = undefined;
        _this = this;
        this.init();
    };

    THeat3D.prototype.option = {
        cursor: 'crosshair'
    };

    THeat3D.prototype.init = function() {
        this.$heat3DModal = $(modalHtml);
        $(document.body).append(this.$heat3DModal);
        this.removeEvent();
        this.attachEvent();
    };

    THeat3D.prototype.show = function() {
        this.$heat3DModal.modal('show');
    };

    THeat3D.prototype.attachEvent = function() {
        var imageUrl = undefined;
        this.$heat3DModal.on('shown.bs.modal', function (e) {
            
        });
        this.$heat3DModal.on('hidden.bs.modal', function (e) {
            $(document.body).find('#heat3DModal').remove();
        });
        $('#addBtn', this.$heat3DModal).on('click',function(e){
            var old = _this.painter.store.widgetModelSet.findByProperty('type','HtmlHeat3D');
            if(imageUrl){
                if(old){
                    old['option.url'](imageUrl);
                }else{
                    _this.tools._save(imageUrl);
                }
                _this.$heat3DModal.modal('hide');
            }
        });
        $('#imageBtn', this.$heat3DModal).on('click',function(){
            MaterialModal.show([{'title':'Template',data:['Image']}], function (data) {
                $('.bgPreviewShow')[0].style.backgroundImage = 'url("'+data.url+'")';
                imageUrl = data.url;
            });
        });
    };

    THeat3D.prototype.removeEvent = function() {
        $('#addBtn', this.$heat3DModal).off('click');
        $('#imageBtn', this.$heat3DModal).off('click');
    };

    THeat3D.prototype.tools = {

        _save: function(url) {
            var entity, layerId;
            entity = this._createEntity(url);
            entity.layerId = _this.painter.getLayerId();
            entity.isHide = 0;
            _this.painter.store.widgetModelSet.append(new NestedModel(entity));
            var canvasHeatPArr = _this.painter.store.widgetModelSet.findListByProperty('type','CanvasHeatP');
            canvasHeatPArr.forEach(function(v){
                v['option.heat3DId'](_this.objId);
            });
        },

        _createEntity: function(url) {
            var entity = {};
            //this.info = GUtil.getPipeRect(points);

            entity.type = 'HtmlHeat3D';
            entity._id = _this.objId;
            entity.x = 0;
            entity.y = 0;
            entity.w = 60;
            entity.h = 30;
            entity.option = {
                data:{},
                url: url,
                width: _this.painter.pageWidth,
                height: _this.painter.pageHeight
            };
            return entity;
        }
    };

    window.THeat3D = THeat3D;

    exports.THeat3D = THeat3D;
}(namespace('toolbar')));
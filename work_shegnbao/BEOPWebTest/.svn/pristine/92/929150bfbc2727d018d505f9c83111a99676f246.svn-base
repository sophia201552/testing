(function (exports,facCanvasText, TooltipMixin) {

    function CanvasText(layer, model) {
        facCanvasText.apply(this, arguments);
    }

    CanvasText.prototype = Object.create(facCanvasText.prototype);
    CanvasText.prototype.constructor = CanvasText;

    /** override */
    CanvasText.prototype.show = function () {
        var _this = this;
        var model = this.store.model;
        var screens = namespace('observer.screens');
        var options = model.option();
        var pageId = options.pageId;
        var pageType = options.pageType;
        var tpl = '<div class="modal fade" id="buttonModal" style="display:none;">\
            <div class="modal-dialog" style="width: 80%; height: calc(100% - 60px);">\
                <div class="modal-content" style="width: 100%;height: 100%;border: none;">\
                    <div class="modal-header" style="border-bottom:0;height:0;min-height: 0;padding:0;">\
                        <button type="button" class="close" data-dismiss="modal" style="position:absolute;top:7px;\
                        right:5px;z-index:2;width:25px;height:25px;border-radius:12.5px;background:#fff;padding-bottom:2px;">\
                        <span aria-hidden="true">&times;</span></button>\
                    </div>\
                    <div class="modal-body" style="padding:0;width: 100%;height: 100%;overflow:hidden;z-index:1;"></div>\
                </div>\
            </div>\
        </div>';

        facCanvasText.prototype.show.apply(this, arguments);

        if (model.idDs().length) {
            this.enableTooltip && this.initTooltip({
                clickable: AppConfig.isFactory === 0
            });
        }

        if(pageId && pageId != ''){
            this.shape.on('mouseover', function () {
                _this.page.painterCtn.style.cursor = 'pointer';
            });

            this.shape.on('mouseout', function () {
                _this.page.painterCtn.style.cursor = 'auto';
            });
        }
        this.shape.on('click',function(e){
            var $modal;
            var floatScreen;

            if (!pageId) {
                return;
            }

            if (options.float === 1) {
                $modal = $(tpl);
                $modal.appendTo(document.body);

                $modal.one('shown.bs.modal',function () {
                    floatScreen = new screens[pageType || 'PageScreen']({
                        id: pageId,
                        isFactory: AppConfig.isFactory
                    }, $('.modal-body', $modal)[0]);

                    floatScreen.show();
                });
                $modal.one('hidden.bs.modal',function () {
                    floatScreen && floatScreen.close();
                    $modal.remove();
                });

                WebAPI.get('/factory/page/'+pageId).done(function (rs) {
                    var $modalDialog = $modal.find('.modal-dialog');
                    var page;
                    if (rs.status !== 'OK') {
                        return;
                    }
                    page = rs.data;
                    if (page.display === 1) {
                        $modalDialog.width(page.width);
                        $modalDialog.height(page.height+30);
                    }
                    $modal.modal('show');
                });
                
            } else {
                floatScreen = new screens[pageType || 'PageScreen']({
                    id: pageId,
                    isFactory: AppConfig.isFactory
                }, _this.page.painterCtn);

                // 重置一下鼠标，因为页面切换的时候，可能图片的 mouseout 事件不会被触发，导致鼠标未还原
                _this.page.painterCtn.style.cursor = 'default';

                // 辞旧迎新
                _this.page.close();
                floatScreen.show();
            }
        });
    };

    CanvasText.prototype = Mixin(CanvasText.prototype, TooltipMixin);

    //覆盖
    exports.CanvasText = CanvasText;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.CanvasText'),
    namespace('mixins.TooltipMixin')
));
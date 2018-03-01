(function (facCanvasImage) {

    function CanvasImage(layer, model) {
        facCanvasImage.apply(this, arguments);
    }

    CanvasImage.prototype = Object.create(facCanvasImage.prototype);
    CanvasImage.prototype.constructor = CanvasImage;

    CanvasImage.prototype.defaultColor = 'transparent';

    CanvasImage.prototype.transparent = function (imageModel) {
        imageModel.url('');
    };

    /** @override */
    CanvasImage.prototype.startAnimation = function (imageModel) {
        this.shape.animations({
            main: imageModel.list()
        });
        this.shape.frameRate( Math.round(1000/imageModel.interval()) );
        this.shape.start();
    };

    /** @override */
    CanvasImage.prototype.stopAnimation = function () {
        this.shape.stop();
    };

    CanvasImage.prototype.showS3dbModal = function (pageId, title) {
        if (ScreenModal) ScreenModal.close();
        ScreenModal = new ObserverScreen(pageId);
        title && (ScreenModal.title = title);
        ScreenModal.isDetailPage = true;
        ScreenModal.show();
    };

    CanvasImage.prototype.addEvents = function () {
        var _this = this;
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

        var w = this.shape.attrs.width;
        var h = this.shape.attrs.height;
        var x = this.shape.attrs.x;
        var y = this.shape.attrs.y;
        
        this.shape.on('mouseover', function () {
            _this.page.painterCtn.style.cursor = 'pointer';
            _this.shape.scale({
                x: 1.1,
                y: 1.1
            });

            _this.shape.draw();
        });

        this.shape.on('mouseout', function () {
            _this.page.painterCtn.style.cursor = 'default';
            _this.shape.scale({
                x: 1,
                y: 1
            });

            _this.shape.draw();
        });

        this.shape.on('click', function () {
            var options = _this.store.model.option();
            var pageId = options.pageId;
            var pageType = options.pageType;
            var screens = namespace('observer.screens');
            var $modal;
            var floatScreen;

            if (!pageId) {
                return;
            }

            if (pageType === 's3db') {
                // 处理 s3db 页面
                if (AppConfig.isFactory) {
                    alert('s3db 页面只支持在主网站中进行查看!');
                } else {
                    // 重置一下鼠标，因为页面切换的时候，可能图片的 mouseout 事件不会被触发，导致鼠标未还原
                    _this.page.painterCtn.style.cursor = 'default';
                    if (options.float === 1) {
                        _this.showS3dbModal(pageId);
                    } else {
                        _this.page.close();
                        Spinner.spin(ElScreenContainer);
                        ScreenManager.goTo({
                            page: 'ObserverScreen',
                            id: pageId
                        }); 
                    }
                }
                return;
            } else {
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
            }
        });
    };

    //覆盖window.widgets.factory.CanvasImage
    window.widgets.factory.CanvasImage = CanvasImage;

} (window.widgets.factory.CanvasImage));
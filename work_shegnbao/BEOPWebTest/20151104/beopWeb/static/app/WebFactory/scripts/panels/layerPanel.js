(function () {

    var itemTpl = '<div data-id={id} class="layer-row" draggable="false">\
            <span class="layer-visibility fa fa-eye layer-default" title="Toggle Visibility"></span>\
            <span class="layer-lock fa fa-fw fa-unlock layer-default" title="Toggle Lock"></span>\
            <span class="layer-icon fa fa-stop"></span>\
            <span class="layer-title" draggable="true">{name}</span>\
        </div>';

    var layerTypes = {
        BACKGROUND_LAYER: 1,
        COMMON_LAYER: 2
    };

    function LayerPanel(screen) {
        this.screen = screen;
        this.container = screen.layerPanelCtn;
        this.painter = screen.page.painter;

        this.init();
    }

    LayerPanel.prototype.init = function () {
        
    };

    LayerPanel.prototype.show = function () {
        
    };

    LayerPanel.prototype.add = function (type, entity) {
        
    };

    LayerPanel.prototype.remove = function () {

    };

    window.LayerPanel = LayerPanel;

} ());
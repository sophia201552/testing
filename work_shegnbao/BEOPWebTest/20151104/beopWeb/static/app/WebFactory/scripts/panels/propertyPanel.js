(function () {

    var itemTpl = '<div data-id={id} class="layer-row" draggable="false">\
            <span class="layer-visibility fa fa-eye layer-default" title="Toggle Visibility"></span>\
            <span class="layer-lock fa fa-fw fa-unlock layer-default" title="Toggle Lock"></span>\
            <span class="layer-icon fa fa-stop"></span>\
            <span class="layer-title" draggable="true">{name}</span>\
        </div>';

    function PropertyPanel(screen) {
        this.screen = screen;
        this.container = screen.propertyPanelCtn;
        this.painter = screen.painter;

        this.layers = [];

        this.activeLayer = undefined;

        this.init();
    }

    PropertyPanel.prototype.init = function () {
        
    };

    PropertyPanel.prototype.show = function () {
    };

    PropertyPanel.prototype.add = function (type, entity) {
    };

    PropertyPanel.prototype.remove = function () {

    };

    window.PropertyPanel = PropertyPanel;

} ());
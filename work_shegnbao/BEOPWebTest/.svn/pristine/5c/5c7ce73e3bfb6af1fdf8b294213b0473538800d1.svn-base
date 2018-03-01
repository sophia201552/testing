(function () {
    var _this;
    function DataSourcePanel(screen) {
        _this = this;
        this.screen = screen;
        this.container = screen.dataSourcePanelCtn;
        this.project = screen.project;
        this.store = {};
        window.ElScreenContainer = this.container;
        this.arrColor = ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700", "#6699FF", "#ff6666", "#3cb371", "#b8860b", "#30e0e0"];
    }

    DataSourcePanel.prototype.init = function(){
    };

    DataSourcePanel.prototype.show = function(){
        if (typeof _this.store.group != 'undefined')return;
        Spinner.spin(_this.container);
        $(_this.container).append('<div id="dataSrcContain" class="gray-scrollbar" style="height: 100%;overflow-y: auto;"></div>');
        WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
            _this.store.group = result.group;

            _this.paneDatasource = new DataSource(_this);
            AppConfig.datasource = _this.paneDatasource;

            _this.paneDatasource.show();

        }).always(function (e) {
            Spinner.stop();
        });
    };


    DataSourcePanel.prototype.hide = function () {};

    window.DataSourcePanel = DataSourcePanel;

} ());
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

        //this.layer = this.screen.painter.interactiveLayer;
        //this.previewRect = null;
    }

    //DataSourcePanel.prototype.init = function () {
    //    this.layer.addEventListener('drag')
    //};
    DataSourcePanel.prototype.dragEndActionPerformed = function(){

    };
    DataSourcePanel.prototype.show = function () {
        // 如果已经预加载过了，则直接显示
        if (typeof _this.store.group !== 'undefined') return;

        $(_this.container).append('<div id="dataSrcContain" class="gray-scrollbar" style="height: 100%;"></div>');

        if (!AppConfig.datasource) {
            // 如果没有预加载，则先去加载数据，再做显示
            Spinner.spin(_this.container);
            WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
                _this.store.group = result.group;

                AppConfig.datasource = _this.paneDatasource = new DataSource(_this);

                _this.paneDatasource.show();
                //_this.init();

            }).always(function (e) {
                Spinner.stop();
            });
        } else {
            this.store.group = AppConfig.datasource.m_parent.store.group;
            this.paneDatasource = AppConfig.datasource = new DataSource(this);
            this.paneDatasource.show();
            //_this.init();
        }
    };

    DataSourcePanel.prototype.hide = function () {};

    window.DataSourcePanel = DataSourcePanel;

} ());
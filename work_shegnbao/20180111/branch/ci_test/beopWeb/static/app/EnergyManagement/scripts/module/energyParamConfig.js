class EnergyParamConfig {
    constructor(screen, container) {
        this.container = container;
        this.screen = screen;

        this.nodeList = this.screen.store[0];
        this.dataSrc = undefined;
        this.store = [];
    }
    show() {
        WebAPI.get('/static/app/EnergyManagement/views/module/energyParamConfig.html').done(result => {
            this.container.innerHTML = result;
            this.init();
        })
    }
    init() {
        // this.initDatasource();
        this.initConfigDetail();
        this.attachEvent();
    }
    initDatasource() {
        var container = document.getElementById('dataSrcContain')
        this.dataSrc = new DataSource(this);
        this.dataSrc.show();
    }
    initConfigDetail() {
        this.initConfigByJSON(this.screen.store[0]);
    }
    initConfigByJSON(node) {
        if (!node) return;
        var $iptConfigJSON = $('#iptConfigJSON');
        var ele = node.config;
        if (node.config) {
            var rsData = {
                energy: ele.energy ? ele.energy : "",
                cost: ele.cost ? ele.cost : "",
                power: ele.power ? ele.power : "",
                detail: ele.detail ? ele.detail : []
            }
        } else {
            var rsData = {
                energy: "",
                cost: "",
                power: "",
                detail: []
            }
        }
        $iptConfigJSON.val(JSON.stringify(rsData, undefined, 4));
    }
    attachEvent() {
        var _this = this;
        $('#btnSure').off('click').on('click', function () {
            var $iptConfigVal;
            try {
                $iptConfigVal = JSON.parse($('#iptConfigJSON').val());
                if (!$iptConfigVal.energy || !$iptConfigVal.power || !$iptConfigVal.cost) {
                    alert('no power,energy,cost');
                }
                var psData = $iptConfigVal;
                psData.projectId = AppConfig.projectId;
                psData.entityId = _this.nodeList.id;
                Spinner.spin($('#workspaceCtn')[0]);
                WebAPI.post('/energy/updateConfigInfo', psData).done(function (result) {
                    //result.success?alert(I18n.resource.energyManagement.param_config.CONFIG_SUCCSS):alert(I18n.resource.energyManagement.param_config.CONFIG_FAILED);                    
                }).always(function () {
                    Spinner.stop();
                });
            } catch (e) {
                alert('JSON error \n' + e.toString());
            }


        });

    }
    onNodeClick(nodes) {
        this.nodeList = nodes[0];
        this.initConfigByJSON(nodes[0]);
    }
    close() {

    }
}
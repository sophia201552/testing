;(function (exports, SuperClass) {

    function EquipmentTab() {
        SuperClass.apply(this, arguments);
    }

    EquipmentTab.prototype = Object.create(SuperClass.prototype);
    EquipmentTab.prototype.constructor = EquipmentTab;

    +function () {

        /** @override */
        this.tabOptions = {
            title: '<span>模板</span>',
            toolsTpl: '<span>{type}模板</span>',
            itemTpl:'<div class="divBox col-sm-2" data-id="{_id}"><div class="thumbnail"><img data-src-page-id="{srcPageId}" class="img-responsive" src="/static/app/DiagnosisEngine/themes/default/images/{srcPageId}.png"></div>' +
            '<div class="caption"><h3>{name}</h3></div></div>',
            dataUrl:'/diagnosisEngine/getTemplateList'
        };

        /** @override */
        this.getData = function () {
            var _this = this;
            return WebAPI.get(this.tabOptions.dataUrl).then(function (rs) {
                _this.store = rs.data;
            });
        };
        /** @override */
        this.attachEvents = function () {
            var _this = this;
            var $tabContent = $('#tabContent');
            $tabContent.children('.divBox').off().on('click',function(){
                var $this = $(this);
                var currentId = $this.attr('data-id');
                var data;
                _this.store.forEach(function(row){
                    if(row._id === currentId){
                        data = row;
                        data._id = _this.treeNode._id;
                        data.name = _this.treeNode.name;
                    }
                })
                infoBox.confirm('To determine the application templates?',function(){
                    WebAPI.post('/diagnosisEngine/saveThings',[data]).done(function(){
                        this.diagnosisScreen = new DiagnosisConfigScreen({
                            name: data.name,
                            projId: AppConfig.projectId,
                            thingId: data._id,
                            srcPageId: data.srcPageId,
                            type: data.type,
                            dictVariable: data.dictVariable
                        });
                        this.diagnosisScreen.show();
                        _this.treeNode.srcPageId = data.srcPageId;
                        TemplateTree.tree.updateNode(_this.treeNode);
                    })
                })
            })
        };

    }.call(EquipmentTab.prototype);

    exports.EquipmentTab = EquipmentTab;

} (
    namespace('factory.components.template.tabs'),
    namespace('factory.components.template.tabs.Tab')
));

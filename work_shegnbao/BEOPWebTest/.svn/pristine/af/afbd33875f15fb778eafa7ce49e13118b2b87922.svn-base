;(function (exports, Super) {

    function ReportModulePanel(screen) {
        Super.apply(this, arguments);
    }

    ReportModulePanel.prototype = Object.create(Super.prototype);

    +function () {

        this.tpl = '<div id="modalCt" class="panel-body"></div>';

        this.attachEvents = function () {};

        this.detachEvents = function () {};

        this.initModuleList = (function () {

            function getModuleList(title, group) {
                var _this = this;
                var $ul = $('<ul class="nav nav-list accordion-group">');
                var $liList = $('<li class="rows">').appendTo($ul);

                // 添加组标题
                var $liHd = $('<li class="nav-header">'+title+'</li>');/*I18n.findContent(title)*/
                $ul.prepend($liHd);

                group.forEach(function (row) {
                    var $div = $('<div class="lyrow">'+row.name+'<span draggable="true" class="badge">拖拽</span></div>').attr('data-type', row.type);
                    $div.on('dragstart', function (e) {
                        e.originalEvent.dataTransfer.setData("type", this.dataset.type);
                        e.stopPropagation();
                    });
                    $liList.append($div);
                });
                return $ul;
            }

            return function () {
                var list, groupMap = {};
                var list = this.screen.factoryIoC.getList();

                var $modals = $(this.tpl);

                for (var i = 0, len = list.length, option; i < len; i++) {
                    option = list[i].prototype.optionTemplate;
                    if(option && option.group != null) {
                        groupMap[option.group] = groupMap[option.group] || [];
                        groupMap[option.group].push(option);
                    }
                }

                for (var name in groupMap) {
                    if (groupMap.hasOwnProperty(name)) {
                        $modals.append( getModuleList.call(this, name, groupMap[name]) );
                    }
                }

                $(this.container).append($modals);
            };
        } ());

    }.call(ReportModulePanel.prototype);

    exports.ReportModulePanel = ReportModulePanel;

} ( namespace('factory.panels'), ModulePanel ));
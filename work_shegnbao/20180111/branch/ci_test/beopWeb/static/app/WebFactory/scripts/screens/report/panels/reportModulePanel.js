;
(function(exports, Super) {

    function ReportModulePanel(screen) {
        Super.apply(this, arguments);
    }

    ReportModulePanel.prototype = Object.create(Super.prototype);

    +

    function() {

        this.tpl = '<div id="modalCt" class="panel-body"></div>';

        this.attachEvents = function() {};

        this.detachEvents = function() {};

        this.initModuleList = (function() {

            function getModuleList(title, group) {
                var _this = this;
                var $ul = $('<ul class="nav nav-list accordion-group">');
                var $liList = $('<li class="rows">').appendTo($ul);
                // 添加组标题
                switch (title) {
                    case '0':
                        title = '实时图';
                        break;
                    case '1':
                        title = '历史图';
                        break;
                    case '2':
                        title = '数据分析';
                        break;
                    case '3':
                        title = 'APP';
                        break;
                }
                var $liHd = $('<li class="nav-header">' + title + '</li>'); /*I18n.findContent(title)*/
                $ul.prepend($liHd);

                group.forEach(function(row) {
                    var name = row.name;
                    if (row.name !== '' && row.name.indexOf('I18n.resource.') === -1) {
                        name = 'I18n.resource.' + row.name;
                    }
                    var parent = row.parent === undefined ? row.group : 'dashboardWidget';
                    var $div = $('<div class="lyrow" data-type="' + row.type + '" data-parent="' + parent + '"><span class="lyRowName">' + new Function('return ' + name)() + '</span><span draggable="true" class="badge">拖拽</span></div>');
                    $div.on('dragstart', function(e) {
                        e.originalEvent.dataTransfer.setData("type", this.dataset.type);
                        e.originalEvent.dataTransfer.setData("parent", this.dataset.parent);
                        e.stopPropagation();
                    });
                    $liList.append($div);
                });
                return $ul;
            }

            return function() {
                var list, groupMap = {};
                var list = this.screen.factoryIoC.getList();

                var $modals = $(this.tpl);

                for (var i = 0, len = list.length, option; i < len; i++) {
                    option = list[i].prototype.optionTemplate;
                    if (option && option.group != null) {
                        groupMap[option.group] = groupMap[option.group] || [];
                        groupMap[option.group].push(option);
                    }
                    if (option && option.parent != null) {
                        groupMap[option.parent] = groupMap[option.parent] || [];
                        groupMap[option.parent].push(option);
                    }
                }

                for (var name in groupMap) {
                    if (groupMap.hasOwnProperty(name)) {
                        $modals.append(getModuleList.call(this, name, groupMap[name]));
                    }
                }

                $(this.container).append($modals);
                $('.lyrow').find('.badge').text(I18n.resource.report.optionModal.DRAG);
                // $('.nav-header').text(I18n.resource.report.optionModal.TITLE);
            };
        }());

    }.call(ReportModulePanel.prototype);

    exports.ReportModulePanel = ReportModulePanel;

}(namespace('factory.panels'), ModulePanel));
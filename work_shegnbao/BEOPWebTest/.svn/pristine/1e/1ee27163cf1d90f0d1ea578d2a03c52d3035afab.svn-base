(function () {
    var _this;
    function ModulePanel(screen) {
        _this = this;
        this.screen = screen;
        this.container = screen.modulePanelCtn;
    }

    ModulePanel.prototype.tpl = '<div id="modalCt" class="panel-body"><button id="btnModalAdd">新增</button></div>';


    ModulePanel.prototype.show = function() {
        this.init();
    };

    ModulePanel.prototype.init = function () {
        this.initModuleList();

        this.attachEvents();
    };

    ModulePanel.prototype.attachEvents = function () {
        var _this = this;

        $('#btnModalAdd', this.container).off('click').click(function (e) {
            var entity = new ModalNone(_this.screen, {
                id: (+new Date()).toString(),
                spanC: 6,
                spanR: 2,
                modal: {type:"ModalNone"}
            });
            _this.screen.arrEntityOrder.push(entity.entity.id);
            _this.screen.listEntity[entity.entity.id] = entity;
            entity.render();
            entity.configure();
        });
    };

    ModulePanel.prototype.initModuleList = (function () {

        function getModuleList(group) {
            var $ul = $('<ul class="nav nav-list accordion-group">');
            var $liList = $('<li class="rows" style="display: none;">').appendTo($ul);
            for (var i in group) {
                if (i == 0) {
                    var $liHd = $('<li class="nav-header">').append('<i class="icon-plus icon-white"></i>' + I18n.findContent(group[i].name))
                        .click(function () {
                            var $otherUl = $(this).parent('ul').siblings('ul');
                            $otherUl.find('.rows').slideUp();
                            $otherUl.find('i').removeClass('icon-minus').addClass('icon-plus');
                            $(this).next('.rows').slideToggle();
                            var $i = $(this).find('i');
                            var toggleClass = (function () {
                                if ($i.hasClass('icon-minus'))
                                    return 'icon-plus icon-white'
                                else
                                    return 'icon-minus icon-white'
                            })();
                            $(this).find('i').removeClass().addClass(toggleClass)
                        });
                    $ul.prepend($liHd);
                } else {
                    var $div = $('<div class="lyrow ui-draggable" draggable="true"> ').html(I18n.findContent(group[i].name)).attr('type',group[i].type);
                    $div[0].ondragstart = function(e){
                        e.dataTransfer.setData("type",$(this).attr('type'));
                        e.dataTransfer.setData("title",$(this).text());
                    }
                    $liList.append($div);
                }
            }
            return $ul;
        }

        return function () {
            var list, groupList = [];
            var list = this.screen.factoryIoC.getList();

            var $modals = $(this.tpl);

            for (var i = 0, len = list.length, option; i < list.length; i++) {
                option = list[i].prototype.optionTemplate;
                if(option && option.parent != null) {
                    groupList[option.parent] = groupList[option.parent] || [];
                    groupList[option.parent].push(option)
                }
            }
            for(var i = 0; i < groupList.length; i++){
                $modals.append(getModuleList(groupList[i]));
            }

            $(this.container).append($modals);
        };
    } ());

    ModulePanel.prototype.hide = function () {};

    window.ModulePanel = ModulePanel;

} ());
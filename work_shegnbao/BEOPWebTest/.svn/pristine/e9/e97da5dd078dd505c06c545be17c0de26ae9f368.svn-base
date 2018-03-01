(function () {
    var _this;
    function ModulePanel(screen) {
        _this = this;
        this.screen = screen;
        this.container = screen.modulePanelCtn;

        this.init();
    }

    ModulePanel.prototype.tpl = '<div id="modalCt" class="panel-body"><span id="btnModalAdd" class="glyphicon glyphicon-plus-sign" style="position:absolute;top: 5px;right: 15px;font-size: 16px;"></span></div>';

    ModulePanel.prototype.show = function() {
        //默认显示第一组
        //$('#modalCt').children('ul:eq(0)').children('.nav-header').click();
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

    ModulePanel.prototype.detachEvents = function () {
        $('#btnModalAdd', this.container).off('click');
    };

    ModulePanel.prototype.initModuleList = (function () {

        function getModuleList(group) {
            var $ul = $('<ul class="nav nav-list accordion-group">');
            var $liList = $('<li class="rows" style="display: none;">').appendTo($ul);
            var icon = '';
            var hideGroup=['ModalRank','ModalPointKPI'];
            for (var i in group) {
                if (i == 0) {   
                    switch (group[0].type){
                        case 'ModalChart':
                            icon = 'glyphicon glyphicon-align-left';
                            break;
                        case 'ModalHistoryChart':
                            icon = 'glyphicon glyphicon-stats';
                            break;
                        case 'ModalAppChart':
                            icon = 'glyphicon glyphicon-align-right';
                            break;
                    }
                    var $liHd = $('<li class="nav-header">').append('<span class="'+ icon +'"></span>').append('<i class="icon-plus icon-white"></i>' + I18n.findContent(group[i].name))
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
                    var $div = $('<div class="lyrow ui-draggable" draggable="true"> ').html('<span class="glyphicon glyphicon-menu-right"></span>' + I18n.findContent(group[i].name)).attr('type',group[i].type);
                    $div[0].ondragstart = function(e){
                        e.dataTransfer.setData("type",$(this).attr('type'));
                        e.dataTransfer.setData("title",$(this).text());
                    }
                    if(hideGroup.indexOf(group[i].type)!=-1){
                        continue;
                    }else{
                        $liList.append($div);
                    }
                    
                }
            }
            return $ul;
        }

        return function () {
            var list, groupList = [];
            var list = this.screen.factoryIoC.getList();
            var $modals = $(this.tpl);

            for (var i = 0, len = list.length, option; i < len; i++) {
                option = list[i].prototype.optionTemplate;
                if(option && option.parent != null) {
                    groupList[option.parent] = groupList[option.parent] || [];
                    groupList[option.parent].push(option)
                }
            }
            for(var i = 0; i < groupList.length; i++){
                //暂时不显示 数据分析
                if(groupList[i][0].type == 'ModalAnalysis'){
                    continue;
                }
                $modals.append(getModuleList(groupList[i]));
            }

            $(this.container).append($modals);

            //factory 暂时隐藏 报表章节
            $('[type="ModalReportChapter"]', '#modalCt').hide();

            //默认展开第一个
            $('#modalCt').children('ul:eq(0)').children('.nav-header').click();
        };
    } ());

    ModulePanel.prototype.hide = function () {};

    ModulePanel.prototype.close = function () {
        this.container.innerHTML = '';
    };

    window.ModulePanel = ModulePanel;

} ());
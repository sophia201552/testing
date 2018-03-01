var IOTFilter = (function () {
    function IOTFilter($panel) {
        this.$panel = $panel;
        this.store = {};
        this.$paneData = undefined;
    }

    IOTFilter.prototype = {
        show: function () {
            var _this = this;
            WebAPI.get("/static/scripts/iot/iotFilter.html").done(function (resultHtml) {
                _this.$panel.html(resultHtml);
                _this.init();
            });
        },

        close: function () {
            this.store = undefined;
            this.$paneData = undefined;
        },

        init: function () {
            var _this = this;
            this.$paneData = $('#paneIotData');

            WebAPI.get("/iot/search").done(function (result) {
                _this.store = result;

                for (var i = 0; i < _this.store.groups.length; i++) {
                    _this.store.groups[i].isParents = true;
                    _this.store.groups[i].open = true;
                }

                _this.initPaneFilter();
                _this.initTree(result);
            });
        },

        initPaneFilter: function () {
            var _this = this;
            var clss, cls, attr, attrs;
            var $selector, $paneFilter, $paneType = $('#paneIotType'), $pane;
            var $projectsSel = $paneType.find('#projectsSel');
            var $groupsSel = $paneType.find('#groupsSel');
            var $thingsSel = $paneType.find('#thingsSel');

            //baseClass: projects, groups, things
            for (var keyType in this.store['class']) {
                clss = this.store['class'][keyType];
                if (!clss) continue;

                $pane = $('#paneIot-' + keyType);
                $selector = $('<select class="form-control">').attr('id', 'selectorIot-' + keyType)
                            .on('change', function () {
                                var opt = {
                                    'type': this.id.split('-')[1],
                                    'val': this.value
                                }

                                _this.initTree(opt);
                            });
                $selector.append($('<option selected>').attr('value', 'none').text('__不显示__'))
                         .append($('<option selected>').attr('value', 'all').text('__全部__'));


                for (var keyCls in clss) {
                    cls = clss[keyCls];
                    $selector.append($('<option>').attr('value', keyCls).text(cls.name));
                    $paneFilter = $('<div>');

                    attrs = cls.attrs;
                    for (var keyAttr in attrs) {
                        attr = attrs[keyAttr];
                        if (attr.filter) {
                            $paneFilter.append($('<span style="margin-left: 5px; font-weight: bold;">').text(attr.name));

                            var $controller;
                            switch (attr.filter.t) {
                                case 'range': $controller = this.createFilterRange(attr.filter); break;
                                case 'enum': $controller = this.createFilterEnum(attr.filter); break;
                                default: break;
                            }
                            $paneFilter.append($controller);
                        }
                    }
                    $pane.append($('<span>').text(cls.name + ": ")).append($paneFilter);
                }

                $paneType.append($('<span>').text(keyType + ": ")).append($selector);

                if(keyType == 'projects'){
                    $projectsSel.append($('<span>').text(keyType + ": ")).append($selector);
                }else if(keyType == 'groups'){
                    $groupsSel.append($('<span>').text(keyType + ": ")).append($selector);
                }else if(keyType == 'things'){
                    $thingsSel.append($('<span>').text(keyType + ": ")).append($selector);
                }
            }
        },

        createFilterRange: function (filter) {
            var $selector = $('<select class="form-control">');
            for (var key in filter.opt) {
                $selector.append($('<option>').attr('value', filter.opt).text(filter.opt[key]));
            }
            return $selector;
        },

        createFilterEnum: function (filter) {
            var $selector = $('<select class="form-control">');
            for (var key in filter.opt) {
                $selector.append($('<option>').attr('value', filter.opt).text(filter.opt[key]));
            }
            return $selector;
        },

        prepareData: function (option) {
            var data = [];

            if (option.type == 'groups') {
                if(option.val != 'none'){
                    data = data.concat(this.store.groups);
                }
                data = data.concat(this.store.things);
            }
            else if (option.type == 'things') {
                data = data.concat(this.store.groups);
                if (option.val == 'all') {
                    data = data.concat(this.store.things);
                } else {
                    for (var key in this.store.things) {
                        if (this.store.things[key].type == option.val) {
                            data.push(this.store.things[key]);
                        }
                    }
                }
            } else {
                data = data.concat(this.store.groups);
                data = data.concat(this.store.things);
            }

            return data;
        },

        initTree: function (option) {
            var _this = this;

            var setting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: '_id'
                    }
                },

                callback: {
                    onRightClick: function (event, treeId, item) {
                        var cls = {};
                        for (var type in _this.store.class) {
                            var dictClass = _this.store.class[type];
                            if (dictClass) {
                                for (var keyCls in dictClass) {
                                    if (keyCls == item.type) {
                                        cls = dictClass[keyCls];
                                        break;
                                    }
                                }
                            }
                        }

                        var str = '', i = 0;

                        for (var attr in cls.attrs) {
                            str += cls.attrs[attr].name + ": " + item.arrP[i++] + ";  \n";
                        }

                        alert(str);
                    },
                    onClick: _this.onNodeClick
                }
            };

            var zNodes = this.prepareData(option);

            $.fn.zTree.init(this.$paneData, setting, zNodes);
        }
    }
    return IOTFilter;
})();
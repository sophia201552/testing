var BenchmarkConfigure = (function () {
    var static_id = 0;

    function MenuItem(id, name, type, title, points, unit, description, desc, children, parentId) {
        this.name = name;
        this.type = type;
        this.title = title;
        this.points = points;
        this.unit = unit;
        this.description = description;
        this.desc = isNaN(+desc) ? 0 : (+desc);
        if (!children) {
            this.children = []
        } else {
            this.children = children;
        }
        if (!id) {
            this._id = this.uniqueId();
        } else {
            this._id = id;
        }
        if (parentId) {
            this.parent = parentId;
        }
    }

    MenuItem.prototype = {
        uniqueId: function () {
            return 'new_' + (static_id++);
        }
    };


    function BenchmarkConfigure() {
        this.viewModel = {
            traverseNav: function (navCollection, id, cb) {//遍历菜单树形结构
                if (!id) {
                    if (cb && typeof cb === 'function') {
                        return cb(navCollection);
                    } else {
                        return navCollection;
                    }
                }

                if (navCollection && navCollection.length !== 0) {
                    for (var m = 0; m < navCollection.length; m++) {
                        var collectionItem = navCollection[m];
                        if (collectionItem._id === id) {
                            if (cb && typeof cb === 'function') {
                                cb(navCollection, m);
                            } else {
                                return collectionItem;
                            }
                        } else {
                            this.traverseNav(collectionItem.children, id, cb);
                        }
                    }
                }
            },
            setNav: function (id, name, type, title, points, unit, description, desc, menuId) {
                var ret = {};
                this.traverseNav(this.nav, id, function (collection, index) {
                    if (collection && collection.length) {
                        ret = collection[index];
                        ret.name = name;
                        ret.type = type;
                        ret.title = title;
                        if ($.isArray(points)) {
                            ret.points = points;
                        } else {
                            ret.points = points && points.split && points.split(',');
                        }
                        ret.unit = unit;
                        ret.description = description;
                        ret.desc = isNaN(+desc) ? 0 : (+desc);
                        ret.menuId = menuId;
                    }
                });
                return ret;
            },
            getNav: function (id) {
                if (!id) {
                    return {};
                }
                var ret = {};
                this.traverseNav(this.nav, id, function (collection, index) {
                    ret = collection[index];
                });
                return ret;
            },
            removeNav: function (id) {
                var ret = {};
                this.traverseNav(this.nav, id, function (collection, index) {
                    if (collection && collection.length) {
                        ret = collection.splice(index, 1);
                    }
                });
                return ret;
            },

            clearChildren: function (id) {
                this.traverseNav(this.nav, id, function (collection, index) {
                    collection[index].children = []
                });
            },

            addNav: function (parentId, name, type, title, points, unit, description, desc) {//parentId不存在,就加到最外层
                if (!type) {
                    return {};
                }
                var nav = this.nav, ret = {};
                this.traverseNav(this.nav, parentId, function (collection, index) {
                    if (!parentId) {
                        ret = new MenuItem(null, name, type, title, points, unit, description, desc);
                        nav.push(ret);
                    } else {
                        if (collection && collection.length && collection[index]) {
                            if (BEOPUtil.isUndefined(collection[index].children)) {
                                collection[index].children = [];
                            }
                            ret = new MenuItem(null, name, type, title, points, unit, description, desc, null, parentId);
                            collection[index].children.push(ret);
                        }
                    }
                });
                return ret;
            }
        }
    }

    BenchmarkConfigure.prototype = {
        defaultTopNavNum: 8,
        defaultSubNavNum: 10,
        init: function () {
            Spinner.spin(ElScreenContainer);
            var _this = this;
            WebAPI.get('/static/views/admin/benchmark/benchmarkConfigure.html').done(function (htmlResult) {
                $(ElScreenContainer).html(htmlResult);
                I18n.fillArea($(ElScreenContainer));
                WebAPI.post('/admin/benchmarkConfigure', {
                    userId: AppConfig.userId
                }).done(function (result) {
                    if (result.success) {
                        $.extend(_this.viewModel, result.data);
                    }
                    _this.renderBenchmarkMenu(_this.viewModel);
                    Spinner.stop();
                });

                _this.bindEvents();
            })
        },
        show: function () {
            $("#ulPages").empty();
            this.init();
        },
        close: function () {

        },
        bindEvents: function () {
            var _this = this;
            var $con = $("#benchmarkConfigure");
            var $topNavConfigWin = $('#benchmarkConfigureInfo');

            //点击配置benchmark页面
            $con.on('click', '.benchmarkSetMenuBtn', function () {
                ScreenManager.show(EnergyScreen, event.target.attributes['data-menu-id'].value);
            })

            //选择其它项目切换配置
            $con.on('click', '#projectSelector li', function () {
                var projectId = parseInt($(this).attr("project-id"));
                var projectName = $(this).find("a").text();
                var projectSrc = $(this).find("img").attr("src");
                Spinner.spin(ElScreenContainer);
                WebAPI.post('/admin/loadProjectMenu', {projectId: projectId}).done(function (result) {
                    if (result.success) {
                        $("#projectMenu").text(projectName);
                        $("#projectName").text(projectName).attr("project-id", projectId);
                        $("#itemMainPic").attr("src", projectSrc);
                        AppConfig.projectId = projectId;
                        _this.viewModel.nav = result.data.nav;
                        _this.renderBenchmarkMenu();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });

            //划过显示修改可对内容进行修改
            $con.on("mouseover", '.itemLi', function (e) {
                $(this).find(".menuOperation .subItemEdit").show();
            }).on("mouseout", '.itemLi', function (e) {
                $(this).find(".menuOperation .subItemEdit").hide();
            });

            //切换select
            $con.off('change', 'select').on('change', 'select', function () {
                var $this = $(this), selectText = $this.val();
                $this.closest('li.itemLi').addClass('editing');
                if (!selectText) {//不显示内容时
                    $this.next(".itemInfo").empty();
                } else {
                    $this.next(".itemInfo").html(beopTmpl('benchmark_editing_tmpl', {nav: {}}));
                }
            });

            //点击修改图标
            $con.on('click', '.subItemEdit', function () {
                var $item = $(this).parents(".itemLi"), itemId = $item.attr('nav-id');
                var $mainMenu = $item.find(".mainMenu");
                var $itemInfo = $mainMenu.next(".itemInfo");
                var mainMenuText = $mainMenu.next('.itemInfo').find(".mainMenuText").text();
                var $ul = $item.find(".configDropDownDenuUl");
                var navModel = _this.viewModel.getNav(itemId);
                if ($ul.find("li").length > 0) {
                    $ul.slideDown(100);
                } else {
                    $ul.html(beopTmpl('sub_nav_tmpl', {type: _this.viewModel.type})).slideDown(100);
                }
                $item.find(".menuOperation").html(beopTmpl('dropDown_okOrNo_tmpl'));
                $itemInfo.html(beopTmpl('benchmark_editing_tmpl', {nav: navModel}));
                $item.addClass('editing');
                $(this).remove();
            });

            // 点击下拉菜单取消按钮
            $con.on('click', '.itemCancel', function () {
                var $itemLi = $(this).parents(".itemLi");
                var index = $("#navTopUl>li").index($itemLi);
                var $li = $itemLi.find(".configDropDownDenuUl li");
                var dataNav = _this.viewModel.nav[index].children;
                $itemLi.find(".mainInfo").html(beopTmpl('itemText_Content_tmpl', {'text': _this.viewModel.nav[index].text}));
                $.each($li, function (indexItem, item) {
                    var $item = $(item);
                    if (indexItem < dataNav.length) {//之前已保存的数据
                        var originalSelectValue = $(item).find(".secondaryMenu").val();
                        $item.find(".secondaryMenu").val(dataNav[indexItem].type);
                        $item.find(".displayName").val(dataNav[indexItem].text).attr("disabled", false);
                        if (dataNav[indexItem].type == 'ReportScreen') {//之前select保存时为运营报表
                            if (originalSelectValue != 'ReportScreen') {//当前select不为运营报表
                                $item.find(".itemInfo").append(beopTmpl('operating_Report_tmpl'));
                                $item.css("width", '100%');
                            }
                            $item.find(".reportTypeSelect").val(dataNav[indexItem].reportType);
                            $item.find(".directoryTypeInput").val(dataNav[indexItem].reportFolder);
                        }
                    } else {//无数据，为不显示内容
                        $item.find(".secondaryMenu").val("");
                        $item.find(".displayName").val("").attr({
                            "disabled": "disabled",
                            "placeholder": ""
                        });
                    }
                });
                $itemLi.find("ul").slideUp();
                $itemLi.find(".menuOperation").html(beopTmpl('item_edit_tmpl'));
            });

            var getMenuModelFromPage = function ($item) {
                var model = {
                    navId: $item.attr('nav-id'),
                    name: $item.find('.benchmark-name').val(),
                    title: $item.find('.benchmark-title').val(),
                    points: $item.find('.benchmark-points').val(),
                    description: $item.find('.benchmark-description').val(),
                    unit: $item.find('.benchmark-unit').val(),
                    type: $item.find('.typeSelector option:selected').val(),
                    desc: $item.find('.benchmark-desc option:selected').val(),
                    menuId: $item.find('.benchmarkSetMenuBtn').data('menu-id')
                };
                if (model.points) {
                    model.points = model.points.split(',');
                }
                return model;
            };

            var updateMenuModel = function ($item, parentId) {
                var menuModel = getMenuModelFromPage($item);

                if (!menuModel.type) {
                    if (menuModel.navId) {
                        _this.viewModel.removeNav(menuModel.navId);
                        $item.attr('nav-id', '');
                    }
                } else {
                    if (menuModel.navId) {
                        _this.viewModel.setNav(menuModel.navId, menuModel.name, menuModel.type,
                            menuModel.title, menuModel.points, menuModel.unit,
                            menuModel.description, menuModel.desc, menuModel.menuId);
                    } else {
                        var newItem = _this.viewModel.addNav(parentId, menuModel.name, menuModel.type,
                            menuModel.title, menuModel.points, menuModel.unit,
                            menuModel.description, menuModel.desc);
                        $item.attr('nav-id', newItem._id);
                    }
                }
            };

            //点击保存设置按钮保存所有数据
            $("#saveSet").click(function () {
                // 可写文本框不能为空
                var commitFlag = true;
                $.each($("#navTopUl input.benchmark-name:visible:enabled"), function (i, inputItem) {
                    var val = $.trim($(inputItem).val());
                    if (val == "") {
                        $(inputItem).focus();
                        commitFlag = false;
                        $("#errorConfigure").text("文本框不能为空！").show();
                        return false;
                    }
                });
                if (!commitFlag) {
                    return false;
                }

                Spinner.spin(ElScreenContainer);
                $.each($("#navTopUl>li"), function (index, item) {
                    var $item = $(item);
                    if (!$item.hasClass('editing')) {
                        return;
                    }
                    updateMenuModel($item);
                    if ($item.find(".configDropDownDenuUl li").length) {//有下拉菜单
                        var $li = $item.find(".configDropDownDenuUl li");
                        $.each($li, function (indexChild, itemChild) {
                            updateMenuModel($(itemChild), $item.attr('nav-id'))
                        });
                    }
                });
                WebAPI.post('/admin/benchmarkEdit', {
                    userId: AppConfig.userId,
                    menu: _this.viewModel
                }).done(function (result) {
                    if (result.success) {
                        new Alert($topNavConfigWin, Alert.type.success, I18n.resource.code[result.code]).showAtTop(2000);
                        _this.viewModel.nav = result.data.nav;
                        _this.renderBenchmarkMenu();
                    } else {
                        new Alert($topNavConfigWin, Alert.type.danger, I18n.resource.code[result.code]).showAtTop(2000);
                    }
                    $("#errorConfigure").text("").hide();
                }).always(function () {
                    Spinner.stop();
                });
            });

        },
        renderBenchmarkMenu: function (model) {
            if (!model) {
                model = this.viewModel;
            }

            var html = beopTmpl('benchmark_tmpl', {
                nav: model.nav,
                type: model.type,
                defaultNum: this.defaultTopNavNum,
                reportType: this.viewModel.type
            });
            $('#navTop').empty().append(html);
            $.each($(".configDropDownDenuUl li"), function (index, item) {
                var $item = $(item);
                $item.attr("parent-id", $item.parents(".itemLi").attr("nav-id"));
            });
        }
    };
    return BenchmarkConfigure;
})();
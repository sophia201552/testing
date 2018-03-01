/**
 * Created by liqian on 2015/4/23.
 */
var MenuConfigure = (function () {
    var static_id = 0,
        reportType = {
            0: '日报',
            1: '月报',
            2: '周报'
        },
        menuType = {
            ObserverScreen: 'ObserverScreen',
            DiagnosisScreen: 'DiagnosisScreen',
            AnalysisScreen: 'AnalysisScreen',
            ReportScreen: 'ReportScreen',
            DropDownList: 'DropDownList',
            EnergyScreen: 'EnergyScreen',
            EnergyScreen_M: 'EnergyScreen_M'
        };

    function MenuItem(id, text, type, reportType, reportFolder, children, parentId) {
        this.text = text;
        this.type = type;
        this.reportType = reportType;
        this.reportFolder = reportFolder;
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

    function MenuConfigure(projectId) {
        this.projectId = projectId ? projectId : AppConfig.projectId;
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
            setNav: function (id, text, type, reportType, reportFolder) {
                var ret = {};
                this.traverseNav(this.nav, id, function (collection, index) {
                    if (collection && collection.length) {
                        ret = collection[index];
                        //原来是DropDownList,现在不是的时候,删除所有的子菜单
                        if (ret.type === menuType.DropDownList && type !== menuType.DropDownList) {
                            ret.children = [];
                        }
                        ret.text = text;
                        ret.type = type;
                        if (type === menuType.ReportScreen) {
                            ret.reportType = reportType;
                            ret.reportFolder = reportFolder;
                        }
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

            addNav: function (parentId, text, type, reportType, reportFolder) {//parentId不存在,就加到最外层
                if (!type) {
                    return {};
                }
                var nav = this.nav, ret = {};
                this.traverseNav(this.nav, parentId, function (collection, index) {
                    if (!parentId) {
                        ret = new MenuItem(null, text, type, reportType, reportFolder);
                        nav.push(ret);
                    } else {
                        if (collection && collection.length && collection[index]) {
                            if (BEOPUtil.isUndefined(collection[index].children)) {
                                collection[index].children = [];
                            }
                            ret = new MenuItem(null, text, type, reportType, reportFolder, null, parentId);
                            collection[index].children.push(ret);
                        }
                    }
                });
                return ret;
            }
        };
        this.userMenuPic = {
            default: [],
            dark: []
        }
    }

    MenuConfigure.prototype = {
        defaultTopNavNum: 12,
        init: function () {
            var _this = this;
            WebAPI.get('/static/views/admin/menuConfigure.html').done(function (htmlResult) {
                $(ElScreenContainer).html(htmlResult);
                Spinner.spin(ElScreenContainer);
                WebAPI.post('/admin/menuConfigure', {
                    userId: AppConfig.userId,
                    projectId: _this.projectId
                }).done(function (result) {
                    if (result.success) {
                        $.extend(_this.viewModel, result.data.firstProjectMenu);
                    }
                    _this.renderProjectMenu(_this.viewModel);
                    _this.renderProjectSelector(result.data.projects);
                    _this.initDrag();
                }).always(function () {
                    Spinner.stop();
                });
                _this.bindEvents();
            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
            })
        },
        show: function () {
            $("#ulPages").empty();
            this.init();
        },
        close: function () {


        },
        getIndexedMenuIds: function () {
            var indexedIds = [], $item;
            $.each($('#navTop').find('li[nav-id]'), function (index, item) {
                $item = $(item);
                if ($item.attr('nav-id')) {
                    indexedIds.push($item.attr('nav-id'));
                }
            });
            return indexedIds;
        },
        bindEvents: function () {
            var _this = this;
            var $con = $("#menuConfigure");
            var $topNavConfigWin = $('#menuConfigureInfo');
            //划过显示修改可对内容进行修改
            $con.off("liShow").on("mouseover.liShow", '.itemLi', function (e) {
                $(this).find(".menuOperation .itemEdit").show();
            }).on("mouseout", '.itemLi', function (e) {
                $(this).find(".menuOperation .itemEdit").hide();
            });

            //切换select
            $con.off('change', 'select').on('change', 'select', function () {
                var $this = $(this);
                var val = $this.val();
                var $li = $this.closest('li');
                var $input = $li.find(".displayName");
                var $itemInfo = $this.next(".itemInfo");
                var $configDropDownDenuUl = $this.parent("li").children(".configDropDownDenuUl");
                //var $configDropDownDenuUl = $this.parents(".itemLi").find(".configDropDownDenuUl");
                if ($this.hasClass("reportTypeSelect")) {
                    return;
                }
                $li.find("input").val("").attr("draggable", true);
                $li.find(".itemTextContent").remove();
                $li.find(".itemInfo").html('<input type="text" value="" class="form-control displayName menuName" placeholder="' + I18n.resource.admin.menuConfigure.MENU_INPUT_NAME_PLACEHOLDER
                    + '" draggable="true" />'
                );
                var lang = window.localStorage.getItem("language") == 'en' ? 'enText' : 'text';
                if ($this.hasClass("mainMenu")) { //一级菜单
                    $this.parents(".itemLi").find(".menuOperation").remove();
                    if (val == menuType.DropDownList) { //下拉菜单
                        $configDropDownDenuUl.html(beopTmpl('sub_nav_tmpl', {
                            data: _this.viewModel,
                            lang: lang
                        })).slideDown(100);
                        $configDropDownDenuUl.find("li").attr("parent-id", $(this).parents(".itemLi").attr("nav-id"));
                    } else {
                        $configDropDownDenuUl.slideUp(100).html("");
                    }
                } else {//二级菜单

                    if (val == menuType.DropDownList) { //下拉菜单
                        $configDropDownDenuUl.html(beopTmpl('three_nav_tmpl', {
                            data: _this.viewModel,
                            lang: lang
                        })).slideDown(100);
                        $configDropDownDenuUl.find("li").attr("parent-id", $(this).parent("li").attr("nav-id"));
                    } else {
                        $configDropDownDenuUl.slideUp(100).html("");
                    }
                }
                $li.attr("draggable", true);
                if (!val) {//不显示内容时
                    $li.find(".displayName").attr({
                        "value": "",
                        "disabled": true,
                        "placeholder": ""
                    });
                    $itemInfo.find(".reportContent").remove();
                    $li.attr("draggable", false);
                } else if (val == menuType.DropDownList) { //下拉菜单
                    $input.attr("disabled", false).attr("draggable", false);
                    $itemInfo.find(".reportContent").remove();
                } else if (val == "ReportScreen") { //报表
                    $input.attr("disabled", false).attr("draggable", false);
                    $itemInfo.append(beopTmpl('operating_Report_tmpl'));
                } else {//其它
                    $input.attr("disabled", false).attr("draggable", false);
                    $itemInfo.find(".reportContent").remove();
                }
            });

            //点击修改图标
            $con.on('click', '.itemEdit', function () {
                var $itemLi = $(this).parents(".itemLi");
                var $mainMenu = $itemLi.find(".mainMenu");
                var $itemInfo = $mainMenu.next(".itemInfo");
                var mainMenuText = $mainMenu.next('.itemInfo').find(".mainMenuText").text();
                var $ul = $itemLi.children(".configDropDownDenuUl");
                if ($mainMenu.val() == menuType.DropDownList) {
                    if ($ul.children("li").length > 0) {
                        $ul.slideDown(100);
                        $ul.find(".threeUL").has('li').slideDown(200);
                    } else {
                        $ul.html(beopTmpl('sub_nav_tmpl', _this.viewModel)).slideDown(100);
                        $ul.find("li").attr("parent-id", $itemLi.attr("nav-id"));
                    }
                    $itemLi.find(".menuOperation").html(beopTmpl('dropDown_okOrNo_tmpl'));
                    $itemInfo.html('<input type="text" originalValue="' + mainMenuText + '" value="' + mainMenuText + '" class="form-control displayName menuName" placeholder="' + I18n.resource.admin.menuConfigure.MENU_INPUT_NAME_PLACEHOLDER + '" draggable="true" />');
                    $itemLi.find(".itemCancel").show();
                } else if ($mainMenu.val() == 'ReportScreen') {
                    var directoryTypeText = $itemInfo.find(".directoryType").text();
                    var reportTypeText = $itemInfo.find(".reportType").text();
                    $itemInfo.html('<input type="text" originalValue="' + mainMenuText + '" value="' + mainMenuText + '" class="form-control displayName menuName" placeholder="' + I18n.resource.admin.menuConfigure.MENU_INPUT_NAME_PLACEHOLDER + '" draggable="true" />').append(beopTmpl('operating_Report_tmpl'));
                    $itemInfo.find(".directoryTypeInput").val(directoryTypeText).attr("originalValue", directoryTypeText);
                    var selectVal;
                    if (reportTypeText == I18n.resource.admin.menuConfigure.DAILY) {
                        selectVal = 0;
                    } else {
                        selectVal = 1;
                    }
                    $itemInfo.find(".reportTypeSelect").val(selectVal).attr("originalValue", reportTypeText);
                } else {
                    $itemInfo.html('<input type="text" originalValue="' + mainMenuText + '" value="' + mainMenuText + '" class="form-control displayName menuName" placeholder="' + I18n.resource.admin.menuConfigure.MENU_INPUT_NAME_PLACEHOLDER + '" draggable="true" />');
                }
                $itemInfo.find(".displayName").focus();
                I18n.fillArea($itemLi);
                $(this).remove();
            });

            // 点击下拉菜单取消按钮
            $con.on('click', '.itemCancel', function () {
                var $itemLi = $(this).parents(".itemLi");
                var index = $("#navTopUl>li").index($itemLi);
                var $li = $itemLi.find(".configDropDownDenuUl li");
                var dataNav = _this.viewModel.nav[index].children;
                $itemLi.find(".mainInfo").html(beopTmpl('itemText_Content_tmpl', {
                    'text': _this.viewModel.nav[index]['text']
                }));
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
                I18n.fillArea($li);
            });

            var getMenuModelFromPage = function ($item) {
                return {
                    navId: $item.attr('nav-id'),
                    text: $item.find(".menuName").text() || $item.find('.menuName').val(),
                    type: $item.find('.typeSelector option:selected').val(),
                    reportFolder: $item.find('.directoryType').text() || $item.find('.directoryTypeInput').val(),
                    reportType: $item.find('.reportTypeSelect').length ? $item.find('.reportTypeSelect option:selected').val() : $item.find('.reportType').attr('report-type')
                }
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
                        _this.viewModel.setNav(menuModel.navId, menuModel.text, menuModel.type, menuModel.reportType, menuModel.reportFolder);
                    } else {
                        var newItem = _this.viewModel.addNav(parentId, menuModel.text, menuModel.type, menuModel.reportType, menuModel.reportFolder);
                        $item.attr('nav-id', newItem._id);
                    }
                }
            };

            //点击保存设置按钮保存所有数据
            $("#saveSet").click(function () {
                // 可写文本框不能为空
                var commitFlag = true;
                $.each($("#navTopUl input:enabled"), function (i, inputItem) {
                    var val = $.trim($(inputItem).val());
                    if (val == "") {
                        $(inputItem).focus();
                        commitFlag = false;
                        $("#errorConfigure").text(I18n.resource.admin.menuConfigure.MENU_INPUT_EMPTY_TIPS).show();
                        return false;
                    }
                });
                if (!commitFlag) {
                    return false;
                }

                Spinner.spin(ElScreenContainer);
                $.each($("#navTopUl>li"), function (index, item) {
                    var $item = $(item);
                    updateMenuModel($item);
                    if ($item.children(".configDropDownDenuUl").children("li").length) {//有下拉菜单
                        var $li = $item.children(".configDropDownDenuUl").children("li");
                        $.each($li, function (indexChild, itemChild) {
                            updateMenuModel($(itemChild), $item.attr('nav-id'));
                            //
                            if ($(itemChild).children(".configDropDownDenuUl").children("li").length) {
                                var $threeli = $(itemChild).children(".configDropDownDenuUl").children("li");
                                $.each($threeli, function (indexThreeChild, itemThreeChild) {
                                    updateMenuModel($(itemThreeChild), $(itemChild).attr('nav-id'));
                                });
                            }
                        });
                    }
                });
                _this.resetViewModelNav();
                WebAPI.post('/admin/menuEdit', {
                    userId: AppConfig.userId,
                    projectId: parseInt($("#projectName").attr("project-id")),
                    menu: _this.viewModel,
                    indexedMenuIds: _this.getIndexedMenuIds()
                }).done(function (result) {
                    if (result.success) {
                        new Alert($topNavConfigWin, Alert.type.success, I18n.resource.code[result.code]).showAtTop(2000);
                        _this.renderProjectMenu();
                    } else {
                        new Alert($topNavConfigWin, Alert.type.danger, I18n.resource.code[result.code]).showAtTop(2000);
                    }
                    $("#errorConfigure").text("").hide();
                }).always(function () {
                    _this.initDrag();
                    Spinner.stop();
                });
            });

        },
        resetViewModelNav: function () {
            var _this = this;
            var navList = [];
            $.each($("#navTopUl>li"), function (index, item) { //更新主菜单
                var $item = $(item);
                if ($item.attr("nav-id") != '') {
                    for (var i = 0; i < _this.viewModel.nav.length; i++) {
                        if ($item.attr("nav-id") == _this.viewModel.nav[i]._id) {
                            navList.push(_this.viewModel.nav[i]);
                        }
                    }
                }
            });
            _this.viewModel.nav = navList; //更新主菜单
        },
        resetSubViewModel: function () {//一个下拉菜单中的不同选项互换
            var _this = this;
            for (var i = 0; i < _this.viewModel.nav.length; i++) {
                if (_this.viewModel.nav[i].children) {
                    var navSubList = [];
                    var $li = $("#navTopUl>li[nav-id='" + _this.viewModel.nav[i]._id + "']").find("li");
                    $.each($li, function (index, item) { //更新子菜单
                        var $item = $(item);
                        if ($item.attr("nav-id") != '') {
                            for (var j = 0; j < _this.viewModel.nav[i].children.length; j++) {
                                if ($item.attr("nav-id") == _this.viewModel.nav[i].children[j]._id) {
                                    navSubList.push(_this.viewModel.nav[i].children[j]);
                                }
                            }
                        }
                    });
                    _this.viewModel.nav[i].children = navSubList; //更新子菜单
                }
            }
        },
        resetSubTwoModel: function (id_source, id_target) {//不同下拉菜单中的选项互换
            var _this = this;
            var i_source, i_target;
            for (var i = 0; i < _this.viewModel.nav.length; i++) {
                if (_this.viewModel.nav[i].children) {
                    if (_this.viewModel.nav[i]._id == id_source) {
                        i_source = i;
                        continue;
                    }
                    if (_this.viewModel.nav[i]._id == id_target) {
                        i_target = i;
                        continue;
                    }
                }
            }
            var $li_target = $("#navTopUl>li[nav-id='" + id_target + "']").find("li");
            var targetId_list = [];
            for (var i = 0; i < _this.viewModel.nav[i_target].children.length; i++) {
                targetId_list.push(_this.viewModel.nav[i_target].children[i]._id);
            }
            $.each($li_target, function (index, item) { //更新子菜单
                var $item = $(item);
                if ($item.attr("nav-id") != '') {
                    if ($.inArray($item.attr("nav-id"), targetId_list) < 0) {//不在目标数组中
                        for (var i = 0; i < _this.viewModel.nav[i_source].children.length; i++) {
                            if (_this.viewModel.nav[i_source].children[i]._id == $item.attr("nav-id")) {
                                _this.viewModel.nav[i_source].children[i].parent = id_target;
                                _this.viewModel.nav[i_target].children.unshift(_this.viewModel.nav[i_source].children[i]);
                                _this.viewModel.nav[i_source].children.splice(i, 1);
                            }
                        }
                    }
                }
            });
        },
        initDrag: function () {
            var _this = this;
            var $navTopUl = $("#navTopUl");
            var $li_source;
            // 拖拽配置菜单
            $navTopUl.find(".itemLi").each(function () {
                // 被拖曳元素
                this.ondragstart = function (e) {
                    var $target = $(e.target);
                    if (e.target.tagName.toLowerCase() == "input") {
                        $target.draggable = true;
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                    var $li = $target.closest("li");
                    var $ul_source = $li.closest("ul");
                    var index_drag;
                    if (!$li.children("select").val()) {
                        return;
                    }
                    if (typeof($li.attr("parent-id")) != "undefined") {//子菜单
                        index_drag = $ul_source.find("li").index($li);
                        e.dataTransfer.setData("source", 'subItem');
                        e.dataTransfer.setData("parent-id", $li.parents(".itemLi").attr("nav-id"));
                        $li_source = $li;
                        if (!$(this).attr("nav-id")) {
                            return;
                        }
                    } else {
                        e.dataTransfer.setData("source", 'mainItem');
                        index_drag = $("#navTopUl>li").index($(this));
                    }
                    e.dataTransfer.setData("index_drag", index_drag);
                };

                // 目标元素
                this.ondragover = function (e) {
                    var $li = $(e.target).closest("li");
                    if ($li.children("select").val()) {
                        $li.addClass("color_drop");
                    }
                    ;
                    e.preventDefault();
                    e.stopPropagation();
                };

                this.ondragleave = function (e) {
                    $("#navTopUl .color_drop").removeClass("color_drop");
                    e.preventDefault();
                    e.stopPropagation();
                };

                this.ondrop = function (e) {
                    var $target = $(e.target);
                    var $li = $target.closest("li");
                    var $ul_target = $li.closest("ul");
                    var index_drag = parseInt(e.dataTransfer.getData("index_drag"));
                    var index_target;
                    $("#navTopUl .color_drop").removeClass("color_drop");

                    $li.closest(".itemLi").removeClass("color_drop");
                    if (typeof($li.attr("parent-id")) != "undefined") {//目标为子菜单
                        if (e.dataTransfer.getData("source") == "mainItem") { //源为主菜单
                            return;
                        } else { //源为子菜单
                            index_target = Number($ul_target.find("li").index($li));
                            var parentId_source = e.dataTransfer.getData("parent-id");
                            var parentId_target = $li.attr("parent-id");
                            if (parentId_source == parentId_target) {//同一个下拉菜单之间移动
                                var $li_sub = $ul_target.find("li");
                                if (index_drag < index_target) {
                                    $li_sub.eq(index_target).after($li_sub.eq(index_drag));
                                } else {
                                    $li_sub.eq(index_target).before($li_sub.eq(index_drag));
                                }
                                _this.resetSubViewModel();
                            } else {//不同下拉菜单之间移动
                                $ul_target.prepend($li_source.attr("parent-id", $li.attr("parent-id")));
                                if (parentId_source) {
                                    _this.resetSubTwoModel(parentId_source, $li.closest(".itemLi").attr("nav-id"));
                                }
                                //_this.initDrag();
                            }
                        }
                    } else {//目标为主菜单
                        if (!$li.children("select").val()) {
                            return;
                        }
                        if (!$(this).find(".mainMenu").val()) { //目标为不显示内容
                            return;
                        }
                        if (e.dataTransfer.getData("source") == "subItem") { //源为子菜单
                            return;
                        } else {
                            index_target = Number($("#navTopUl>li").index($(this)));
                            var $li_main = $("#navTopUl>li");
                            if (index_drag < index_target) {
                                $li_main.eq(index_target).after($li_main.eq(index_drag));
                            } else {
                                $li_main.eq(index_target).before($li_main.eq(index_drag));
                            }
                        }
                    }
                };
            });
        },
        interactionLine: function ($con, index_drag, index_target) {
            var $li = $con.children('li');
            var itemList = [];
            for (var i = 0; i < $li.length; i++) {
                itemList.push($li[i]);
            }
            var temp = itemList[index_target];
            itemList[index_target] = itemList[index_drag];
            itemList[index_drag] = temp;
            $con.empty();
            for (var i = 0; i < itemList.length; i++) {
                $con.append(itemList[i]);
            }
        },
        renderProjectMenu: function (model) {
            if (!model) {
                model = this.viewModel;
            }
            var lang = window.localStorage.getItem("language") == 'en' ? 'enText' : 'text';
            var html = beopTmpl('top_nav_tmpl', {
                nav: model.nav,
                type: model.type,
                defaultNum: this.defaultTopNavNum,
                reportType: reportType,
                systemSkin: window.localStorage.getItem('systemSkin_' + AppConfig.userId),
                lang: lang
            });
            var $navTop = $('#navTop'), _this = this;
            $navTop.empty().append(html);
            I18n.fillArea($navTop);
            $.each($(".configDropDownDenuUl li"), function (index, item) {
                var $item = $(item);
                $item.attr("parent-id", $item.parents(".itemLi").attr("nav-id"));
            });
            this.initDrag();
            var getUserMenuPicFlag = false;
            var getUserMenuPic = function ($dropDownMenu) {
                if (!getUserMenuPicFlag) {
                    Spinner.spin($dropDownMenu.get(0));
                    return WebAPI.get('/admin/ossMenuPic').done(function (result) {
                        //处理路径
                        result.data.default.forEach(function (item) {
                            _this.userMenuPic.default.push('/' + item.path);
                        });
                        result.data.dark.forEach(function (item) {
                            _this.userMenuPic.dark.push('/' + item.path);
                        });
                    }).fail(function () {
                    }).always(function () {
                        getUserMenuPicFlag = true;
                        Spinner.stop();
                    });
                } else {
                    return $.Deferred().resolve();
                }
            };
            $navTop.find('li').on('show.bs.dropdown', function () {
                var $this = $(this);
                var $dropDownMenu = $this.find('.dropdown-menu');
                var systemSkin = window.localStorage.getItem('systemSkin_' + AppConfig.userId);
                if (!systemSkin || systemSkin == null || systemSkin == undefined) {
                    systemSkin = 'default';
                }
                if (systemSkin == 'default') {
                    $dropDownMenu.css('background', '#fff')
                }
                if (systemSkin == 'dark') {
                    $dropDownMenu.css('background', '#000')
                }
                getUserMenuPic($dropDownMenu).done(function () {
                    //如果有 .open  就说明已经处理过而且绑定过一次事件了
                    if (!$dropDownMenu.is('.' + systemSkin)) {
                        var remove = '';
                        if (systemSkin == 'default') {
                            remove = 'dark';
                        } else if (systemSkin == 'dark') {
                            remove = 'default';
                        }
                        $dropDownMenu.empty().html(beopTmpl('tpl_userMenuPicList', {
                            list: _this.userMenuPic[systemSkin]
                        })).removeClass(remove).addClass(systemSkin);
                        $dropDownMenu.find("li").off().on('click', function () {
                            if ($(this).find('img').is(':visible')) {
                                var src = $(this).find('img').attr('src');
                                $dropDownMenu.find('li').removeClass('active');
                                $(this).addClass('active');
                                $dropDownMenu.prev().removeClass(remove).addClass(systemSkin).empty().append('<img src="' + src + '"' + '>');
                                //更新viewModel
                                _this.viewModel.nav[$navTop.find('#navTopUl>li').index($this)].pic = src;
                            }
                        })
                    }
                })
            });
        },
        renderProjectSelector: function (projects) {
            var lang = window.localStorage.getItem("language") == 'en' ? 'en' : 'cn';
            var html = beopTmpl('project_selector_tmpl', {
                projects: projects,
                lang: lang
            });
            var $projectSelector = $('#projectSelector').empty().append(html);
            var projectName = $projectSelector.find("li[project-id=" + this.projectId + "] a").text();
            var projectSrc = $projectSelector.find("li[project-id=" + this.projectId + "] img").attr("src");
            $("#projectName").text(projectName).attr("project-id", this.projectId);
            $("#itemMainPic").attr("src", projectSrc);
            $("#saveSet").show();
        }
    };
    return MenuConfigure;
})();
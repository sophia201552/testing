/**
 * Created by liqian on 2015/4/23.
 */
var MenuConfigure = (function () {
    var static_id = 0,
        reportType = {
            0: '日报',
            1: '月报'
        },
        menuType = {
            ObserverScreen: 'ObserverScreen',
            DiagnosisScreen: 'DiagnosisScreen',
            AnalysisScreen: 'AnalysisScreen',
            ReportScreen: 'ReportScreen',
            DropDownList: 'DropDownList',
            EnergyScreen: 'EnergyScreen'
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


    function MenuConfigure() {
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
        }
    }

    MenuConfigure.prototype = {
        defaultTopNavNum: 8,
        defaultSubNavNum: 10,
        init: function () {
            Spinner.spin(ElScreenContainer);
            var _this = this;
            $.get('/static/views/admin/menuConfigure.html').done(function (htmlResult) {
                $(ElScreenContainer).html(htmlResult);
                WebAPI.post('/admin/menuConfigure', {
                    userId: AppConfig.userId,
                    projectId: AppConfig.projectId
                }).done(function (result) {
                    if (result.success) {
                        $.extend(_this.viewModel, result.data.firstProjectMenu);
                    }
                    _this.renderProjectMenu(_this.viewModel);
                    _this.renderProjectSelector(result.data.projects);
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
            var $con = $("#menuConfigure");
            var $topNavConfigWin = $('#menuConfigureInfo');

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
                        _this.renderProjectMenu();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });

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
                var $configDropDownDenuUl = $this.parents(".itemLi").find(".configDropDownDenuUl");
                if ($this.hasClass("reportTypeSelect")) {
                    return;
                }
                $li.find("input").val("");
                $li.find(".itemTextContent").remove();
                $li.find(".itemInfo").html('<input type="text" value="" class="form-control displayName menuName" placeholder="请填入显示名称"/>');
                if ($this.hasClass("mainMenu")) { //一级菜单
                    $this.parents(".itemLi").find(".menuOperation").remove();
                    if (val == menuType.DropDownList) { //下拉菜单
                        $configDropDownDenuUl.html(beopTmpl('sub_nav_tmpl', _this.viewModel)).slideDown(100);
                        $configDropDownDenuUl.find("li").attr("parent-id", $(this).parents(".itemLi").attr("nav-id"));
                    } else {
                        $configDropDownDenuUl.slideUp(100).html("");
                    }
                } else {
                    if (val == "ReportScreen") { //报表
                        $(this).parents("li[parent-id]").css("width", "100%");
                    } else {
                        $(this).parents("li[parent-id]").css("width", "50%");
                    }
                }

                if (!val) {//不显示内容时
                    $li.find(".displayName").attr({
                        "value": "",
                        "disabled": true,
                        "placeholder": ""
                    });
                    $itemInfo.find(".reportContent").remove();
                } else if (val == menuType.DropDownList) { //下拉菜单
                    $input.attr("disabled", false);
                    $itemInfo.find(".reportContent").remove();
                } else if (val == "ReportScreen") { //报表
                    $input.attr("disabled", false);
                    $itemInfo.append(beopTmpl('operating_Report_tmpl'));
                } else {//其它
                    $input.attr("disabled", false);
                    $itemInfo.find(".reportContent").remove();
                }
            });

            //点击修改图标
            $con.on('click', '.itemEdit', function () {
                var $itemLi = $(this).parents(".itemLi");
                var $mainMenu = $itemLi.find(".mainMenu");
                var $itemInfo = $mainMenu.next(".itemInfo");
                var mainMenuText = $mainMenu.next('.itemInfo').find(".mainMenuText").text();
                var $ul = $itemLi.find(".configDropDownDenuUl");
                if ($mainMenu.val() == menuType.DropDownList) {
                    if ($ul.find("li").length > 0) {
                        $ul.slideDown(100);
                    } else {
                        $ul.html(beopTmpl('sub_nav_tmpl', _this.viewModel)).slideDown(100);
                        $ul.find("li").attr("parent-id", $itemLi.attr("nav-id"));
                    }
                    $itemLi.find(".menuOperation").html(beopTmpl('dropDown_okOrNo_tmpl'));
                    $itemInfo.html('<input type="text" originalValue="' + mainMenuText + '" value="' + mainMenuText + '" class="form-control displayName menuName" placeholder="请填入显示名称"/>');
                    $itemLi.find(".itemCancel").show();
                } else if ($mainMenu.val() == 'ReportScreen') {
                    var directoryTypeText = $itemInfo.find(".directoryType").text();
                    var reportTypeText = $itemInfo.find(".reportType").text();
                    $itemInfo.html('<input type="text" originalValue="' + mainMenuText + '" value="' + mainMenuText + '" class="form-control displayName menuName" placeholder="请填入显示名称"/>').append(beopTmpl('operating_Report_tmpl'));
                    $itemInfo.find(".directoryTypeInput").val(directoryTypeText).attr("originalValue", directoryTypeText);
                    var selectVal;
                    if (reportTypeText == "日报") {
                        selectVal = 0;
                    } else {
                        selectVal = 1;
                    }
                    $itemInfo.find(".reportTypeSelect").val(selectVal).attr("originalValue", reportTypeText);
                } else {
                    $itemInfo.html('<input type="text" originalValue="' + mainMenuText + '" value="' + mainMenuText + '" class="form-control displayName menuName" placeholder="请填入显示名称"/>');
                }
                $itemInfo.find(".displayName").focus();
                $(this).remove();
            });

            // 点击下拉菜单取消按钮
            $con.on('click', '.itemCancel', function () {
                var $itemLi = $(this).parents(".itemLi");
                var index = $("#navTopUl>li").index($itemLi);
                var $li = $itemLi.find(".configDropDownDenuUl li");
                var dataNav = _this.viewModel.nav[index].children;
                $itemLi.find(".mainInfo .displayName").val(_this.viewModel.nav[index].text);
                $.each($li, function (indexItem, item) {
                    if (indexItem < dataNav.length) {
                        var type = dataNav[indexItem].type;
                        var text = dataNav[indexItem].text;
                        $(item).find(".secondaryMenu").val(type);
                        $(item).find(".displayName").val(text);
                    } else {
                        $(item).find(".secondaryMenu").val("");
                        $(item).find(".displayName").val("").attr({
                            "disabled": "disabled",
                            "placeholder": ""
                        });
                    }
                });
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
                    updateMenuModel($item);
                    if ($item.find(".configDropDownDenuUl li").length) {//有下拉菜单
                        var $li = $item.find(".configDropDownDenuUl li");
                        $.each($li, function (indexChild, itemChild) {
                            updateMenuModel($(itemChild), $item.attr('nav-id'))
                        });
                    }
                });
                var projectId = parseInt($("#projectName").attr("project-id"));
                WebAPI.post('/admin/menuEdit', {
                    userId: AppConfig.userId,
                    projectId: projectId,
                    menu: _this.viewModel
                }).done(function (result) {
                    if (result.success) {
                        new Alert($topNavConfigWin, Alert.type.success, I18n.resource.code[result.code]).showAtTop(2000);
                        _this.viewModel.nav = result.data.nav;
                        _this.renderProjectMenu();
                    } else {
                        new Alert($topNavConfigWin, Alert.type.danger, I18n.resource.code[result.code]).showAtTop(2000);
                    }
                    $("#errorConfigure").text("").hide();
                }).always(function () {
                    Spinner.stop();
                });
            });

        },
        renderProjectMenu: function (model) {
            if (!model) {
                model = this.viewModel;
            }

            var html = beopTmpl('top_nav_tmpl', {
                nav: model.nav,
                type: model.type,
                defaultNum: this.defaultTopNavNum,
                reportType: reportType
            });
            $('#navTop').empty().append(html);
            $.each($(".configDropDownDenuUl li"), function (index, item) {
                var $item = $(item);
                $item.attr("parent-id", $item.parents(".itemLi").attr("nav-id"));
            });
        },
        renderProjectSelector: function (projects) {
            var html = beopTmpl('project_selector_tmpl', {projects: projects});
            $('#projectSelector').empty().append(html);
            var projectName = $('#projectSelector').find("li[project-id=" + AppConfig.projectId + "] a").text();
            var projectSrc = $('#projectSelector').find("li[project-id=" + AppConfig.projectId + "] img").attr("src");
            $("#projectName").text(projectName).attr("project-id", AppConfig.projectId);
            $("#itemMainPic").attr("src", projectSrc);
            $("#saveSet").show();
        }
    };
    return MenuConfigure;
})();
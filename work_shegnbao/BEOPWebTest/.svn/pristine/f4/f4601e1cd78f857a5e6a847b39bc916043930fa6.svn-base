/**
 * Created by liqian on 2015/4/23.
 */

var MenuConfigure = (function () {

    function MenuItem(id, text, type, children, parentId) {
        this.text = text;
        this.type = type;
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
            return 'new_' + new Date().getTime();
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
            setNav: function (id, text, type) {
                var ret = {}
                this.traverseNav(this.nav, id, function (collection, index) {
                    if (collection && collection.length) {
                        ret = collection[index];
                        //原来是DropDownList,现在不是的时候,删除所有的子菜单
                        if (ret.type === 'DropDownList' && type !== 'DropDownList') {
                            ret.children = [];
                        }
                        ret.text = text;
                        ret.type = type;
                    }
                })
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

            addNav: function (parentId, text, type) {//parentId不存在,就加到最外层
                if (!type) {
                    return {};
                }
                var nav = this.nav, ret = {};
                this.traverseNav(this.nav, parentId, function (collection, index) {
                    if (!parentId) {
                        ret = new MenuItem(null, text, type);
                        nav.push(ret);
                    } else {
                        if (collection && collection.length && collection[index]) {
                            if (typeof collection[index].children === 'undefined') {
                                collection[index].children = []
                            }
                            ret = new MenuItem(null, text, type, null, parentId);
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
                });
                _this.bindEvents();
            });
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
            var $subNavConfigWin = $("#configDropDownDenuWin");
            var $topNavConfigWin = $('#menuConfigureInfo');
            //点击配置下拉菜单按钮弹出窗口
            $con.off('click', '.configdropDownMenu').on('click', '.configdropDownMenu', function () {
                var $this = $(this),
                    $li = $this.closest('li'),
                    id = $li.attr('nav-id'), model = {};
                if (!id) {
                    //新增下拉菜单,创建新的菜单项,使二级菜单加入到新创建的菜单里
                    var text = $li.find('.displayName').val();
                    var type = $li.find('option:selected').val();
                    model = _this.viewModel.addNav(null, text, type);
                    $li.attr('nav-id', model._id)
                    id = model._id;
                } else {
                    model = _this.viewModel.getNav(id);
                }
                _this.setDropDownMenuUl(model, id);
                $subNavConfigWin.modal();
            });

            $con.off('change', '.projectSelector').on('change', '.projectSelector', function () {
                var projectId = getSelectProjectId();
                Spinner.spin(ElScreenContainer);
                WebAPI.post('/admin/loadProjectMenu', {projectId: projectId}).done(function (result) {
                    if (result.success) {
                        _this.viewModel.nav = result.data.nav;
                        _this.renderProjectMenu();
                    }
                }).always(function () {
                    Spinner.stop();
                })
            });

            //点击下拉菜单的确认按钮，对下级菜单进行保存
            $("#btnConfrim").click(function () {
                $.each($subNavConfigWin.find('li'), function (index, item) {
                    var $item = $(item),
                        parentId = $item.attr('parent-id'),
                        navId = $item.attr('nav-id'),
                        text = $item.find('.displayName').val(),
                        type = $item.find('option:selected').val();
                    if (!parentId) {
                        return false;
                    }
                    if (!type) {
                        if (navId) {
                            _this.viewModel.removeNav(navId);
                            $item.attr('nav-id', '')
                        }
                    } else {
                        if (navId) {
                            _this.viewModel.setNav(navId, text, type);
                        } else {
                            var newItem = _this.viewModel.addNav(parentId, text, type);
                            $item.attr('nav-id', newItem._id)
                        }
                    }
                });
                $subNavConfigWin.modal("hide");
                console.log(_this.viewModel);
            });
            //点击配置下拉菜单按钮弹出窗口
            $con.off('change', 'select').on('change', 'select', function () {
                var $this = $(this);
                var $li = $this.closest('li')
                var $input = $li.find(".displayName");

                var val = $this.val();
                if (!val) {//不显示内容时
                    $input.val("").attr("value", "").attr("disabled", true);
                    $li.find('.configdropDownMenu').hide();
                } else if (val == "DropDownList") {
                    $li.find('.configdropDownMenu').show();
                    $input.attr("disabled", false);
                } else {
                    $li.find('.configdropDownMenu').hide();
                    $input.attr("disabled", false);
                }
            });

            var getSelectProjectId = function () {
                var projectId = $('.projectSelector option:selected').val();
                return parseInt(projectId);
            };

            //点击保存设置按钮保存所有数据
            $("#saveSet").click(function () {
                $.each($topNavConfigWin.find('li'), function (index, item) {
                    var $item = $(item),
                        navId = $item.attr('nav-id'),
                        text = $item.find('.displayName').val(),
                        type = $item.find('option:selected').val();
                    if (!type) {
                        if (navId) {
                            _this.viewModel.removeNav(navId);
                            $item.attr('nav-id', '')
                        }
                    } else {
                        if (navId) {
                            _this.viewModel.setNav(navId, text, type);
                        } else {
                            var newItem = _this.viewModel.addNav(null, text, type);
                            $item.attr('nav-id', newItem._id);
                        }
                    }
                });
                $subNavConfigWin.modal("hide");
                console.log(_this.viewModel);
                var projectId = getSelectProjectId();
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
                    console.log(result);
                })
            });

        },
        setDropDownMenuUl: function (data, parentId) {
            var $configDropDownDenuUl = $("#configDropDownDenuUl");
            var sub_nav = beopTmpl('sub_nav_tmpl', {
                type: this.viewModel.type,
                defaultNum: this.defaultSubNavNum,
                children: data && data.children ? data.children : [],
                parentId: parentId
            });
            $configDropDownDenuUl.html(sub_nav);
        },
        renderProjectMenu: function (model) {
            if (!model) {
                model = this.viewModel;
            }
            var html = beopTmpl('top_nav_tmpl', {
                nav: model.nav,
                type: model.type,
                defaultNum: this.defaultTopNavNum
            });
            $('#navTop').empty().append(html);
        },
        renderProjectSelector: function (projects) {
            var html = beopTmpl('project_selector_tmpl', {projects: projects});
            $('#projectSelectorWrap').empty().append(html)
        }
    };
    return MenuConfigure;
})();
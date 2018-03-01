var SideNavComponent = (function() {
    function SideNavComponent(screen, container) {
        this.screen = screen;
        this.container = container;

        this.projectCtn = undefined;
        this.menuCtn = undefined;
        this.userCtn = undefined;
        this.recentProjectCtn = undefined;
        this.functionCtn = undefined;
        this.projectFunctionCtn = undefined;

        this.wrapFunctionCtn = undefined;
    }
    SideNavComponent.prototype = {
        init: function() {
            this.projectCtn = document.getElementById('navProject');
            this.recentProjectCtn = document.getElementById('navRecentProject')
            this.menuCtn = document.getElementById('navMenu');
            this.userCtn = document.querySelector('.wrapUserProfile');

            this.functionCtn = document.getElementById('navFunction')
            this.projectFunctionCtn = document.getElementById('navProjectFunction')
            this.wrapFunctionCtn = document.getElementById('wrapFunction')
            this.initBaseFunctionList();
            this.initGroupList();
            this.initProjectList();
            this.initUserProfile();
            this.initFunctionList();
            this.getAlarmCount();
            this.attachEvent();
            ModuleIOC.checkPermission(this.container);
            this.setModuleStyle();
        },
        setModuleStyle: function() {
            var baseHeight = document.querySelector('.wrapNavModule[data-block="base"]').offsetHeight;
            var groupHeight = document.querySelector('.wrapNavModule[data-block="group"]').offsetHeight;
            // var groupHeight =document.querySelector('.wrapNavModule[data-block="group"]').offsetHeight;
            // var recentProjectHeight = document.getElementById('navRecentProject').offsetHeight;
            // document.querySelector('.wrapNavModule[data-block="project"]').style.height = 'calc(100% - ' + baseHeight + 'px)';
            document.querySelector('.wrapNavModule[data-block="project"]').style.height = `calc(100% - ${baseHeight}px - ${groupHeight}px)`;
            // document.getElementById('navProject').style.height= 'calc(100% - 69px - ' + recentProjectHeight +'px)'
            document.getElementById('navProject').style.height = 'calc(100% - 73px)';
        },
        setFunctionModuleStyle: function() {
            var functionHeight = document.querySelector('.wrapNavModule[data-block="function"]').offsetHeight;
            var projectFunctionHeight = document.querySelector('.wrapNavModule[data-block="project-function"]').offsetHeight;
            var userHeight = document.querySelector('.wrapUser').offsetHeight;

            var bottomDom = document.querySelector('.functionBottomWrap');
            bottomDom.style.height = 'calc(100% - ' + functionHeight + 'px - ' + projectFunctionHeight + 'px - ' + userHeight + 'px - 20px)'

            // if (bottomDom.offsetHeight < 350){
            //     this.container.classList.add('navWide')
            //     ElScreenContainer.classList.add('navWide')
            // }else{
            //     this.container.classList.remove('navWide')
            //     ElScreenContainer.classList.remove('navWide')
            // }

            // functionHeight = document.querySelector('.wrapNavModule[data-block="function"]').offsetHeight;
            // projectFunctionHeight = document.querySelector('.wrapNavModule[data-block="project-function"]').offsetHeight;
            // bottomDom.style.height= 'calc(100% - '+ functionHeight+'px - '+projectFunctionHeight+'px - '+userHeight+'px)';
        },
        // initBaseFunctionList:function(){
        //     var container = document.getElementById('sideNavComponent').querySelector('#navProjectConfig')
        //     var navDom;
        //     ModuleIOC.list.filter(function(item){return (item.block == 'base' && (!item.parent))}).forEach(function(item){
        //         navDom = document.createElement('div');
        //         navDom.innerHTML = `<span class="icon ${item.icon}"></span><span class="text">${item.title}</span>`;
        //         navDom.dataset.module = item.module;
        //         navDom.className = 'navItem';
        //         if (!item.cls)navDom.classList.add('noInstance')
        //         if (item.attr){
        //             Object.keys(item.attr).forEach(function(key){
        //                 if (key == 'class'){
        //                     navDom.classList.add(item.attr[key])
        //                 }else{
        //                     navDom.setAttribute(key,item.attr[key])
        //                 }
        //             })
        //         }
        //         container.appendChild(navDom)
        //     });
        // },      
        initGroupList: function() {
            var groupList = AppConfig.groupProjectList;
            var groupContainer = document.getElementById('navGroup');
            if (groupList.length > 0) {
                var firstGroupName = AppConfig.language == 'en' ? groupList[0].name_en : groupList[0].name_cn;
                groupContainer.innerHTML = `<div id="divSelectBox"><div class="selectGroupProject isFold">${firstGroupName}</div><div class="selectGroupList"></div></div>`;
                groupList.forEach((ele) => {
                    var groupName = AppConfig.language == 'en' ? ele.name_en : ele.name_cn;
                    var optionDom = `<div class="groupListItem" data-id="${ele.id}">${groupName}</div>`;
                    groupContainer.querySelector('.selectGroupList').appendChild($(optionDom)[0]);
                })
                $('.groupListItem:first-child').addClass('isSelected');
            }
        },
        initBaseFunctionList: function() {
            var container = document.getElementById('navProjectConfig')
            var navDom;
            ModuleIOC.list.filter(function(item) { return (item.block == 'base') }).forEach(item => {
                this.setNavItemDom(item, container)
            })
        },
        initFunctionList: function() {
            var _this = this;
            _this.initUserInFunctionCtn();
            _this.initNavListInFunctionCtn();
            // _this.initMessage();
        },
        initUserProfile: function() {
            this.userCtn.title = AppConfig.userProfile.fullname
            this.userCtn.innerHTML = `
                <span class="portrait"><img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com${AppConfig.userProfile.picture}"/></span>
                <span class="name">${AppConfig.userProfile.fullname}</span>
                <span class="icon iconfont icon-xiaoxi" style="position: relative;margin-left: 6px;top: -10px;"></span>
                <span class="alarmCount"></span>
                <span class="projectStatus" style=""></span>
            `
        },
        initProjectList: function() {
            this.projectCtn.innerHTML = '';
            this.initRecentProjectList();
            var _this = this;
            var projects = AppConfig.groupProjectCurrent.projectList;
            var countryDict = {};
            projects.forEach((proj) => {
                let key = proj.country_name_twoletter;
                if (!key) key = 'CN';
                if (!countryDict[key]) {
                    countryDict[key] = { name: I18n.resource.platform_app.project.NATIONAL[key], list: [] }
                }
                countryDict[key].list.push(proj)
            })
            this.setProjectDivideByNational(countryDict);
            $(this.projectCtn).find('.projectList').each((item, list) => {
                if ($(list)[0].children.length > 4) {
                    $(list).hide();
                    $(list).parent().find('.iconNational').addClass('isShowed')
                }
            });
            //重新刷新项目状态
            $('#navProject .navItem').each(function(i) {
                var id = $(this).attr('data-id');
                if (id) {
                    AppConfig.projectList.forEach(item => {
                        if (item.id == id) {
                            var onlineClass = item.online == null || item.online == 'Offline' ? 'offline' : 'online';
                            $(this).removeClass('offline online');
                            $(this).addClass(onlineClass);
                            $(this).attr('data-online', onlineClass == 'offline' ? 0 : 1)
                        }
                    })
                }
            });
            // projects.forEach((item)=>{
            //     // item.online==null||item.online=='Offline'?item.online='0':1
            //     var onlineClass = '',onlineValue='0';
            //     if (item.online==null||item.online=='Offline'){
            //         onlineValue='0'
            //         onlineClass = 'offline'
            //     }else{
            //         onlineValue= 1
            //         onlineClass = 'online';
            //     }
            //     this.projectCtn.appendChild(this.createNavItemDom((AppConfig.language == 'en' ? item.name_english:item.name_cn),'',{
            //                 'class':onlineClass,'data-block':'project','data-id':item.id,'data-online':onlineValue}))
            // })
            // $(_this.container).find('[data-online]').each(function(){
            //     var isOnlie=$(this).attr('data-online');
            //     if(isOnlie!='0'){
            //         $(this).addClass('online');
            //     }else{
            //         $(this).addClass('offlineColor')
            //         $(this).addClass('offline');
            //     }
            // })
        },
        setProjectDivideByNational: function(dict) {
            var countryList = Object.keys(dict);
            countryList.forEach((key) => {
                let dom = document.createElement('div');
                dom.className = 'divNational'
                dom.innerHTML = `
                <div class="nationalInfo">
                    <span class="flag"><img class="imgFlag" src="/static/images/mod_platform/nationalFlag/${key }.png"></span>
                    <span class="name">${dict[key].name}</span>
                    <span class="nationalDownBtn">
                        <span class="number">${dict[key].list.length}</span>
                        <span class="glyphicon  iconfont  iconNational icon-fanhui3 menu-arrow"></span>
                    </span>
                </div>
                <div class="projectList"></div>`;
                var container = dom.querySelector('.projectList');
                var projects = dict[key].list;
                projects.forEach((item) => {
                    // item.online==null||item.online=='Offline'?item.online='0':1
                    var onlineClass = '',
                        onlineValue = '0';
                    if (item.online == null || item.online == 'Offline') {
                        onlineValue = '0'
                        onlineClass = 'offline'
                    } else {
                        onlineValue = 1
                        onlineClass = 'online';
                    }
                    var name = '';
                    if (AppConfig.permission.DemoAccount && item.type && I18n.resource.platform_app.project.PAGE_NAME_ALT[item.type]) {
                        name = I18n.resource.platform_app.project.PAGE_NAME_ALT[item.type]
                    } else {
                        name = (AppConfig.language == 'en' ? item.name_english : item.name_cn);
                    }
                    container.appendChild(this.createNavItemDom(name, '', {
                        'class': onlineClass,
                        'data-block': 'project',
                        'data-id': item.id,
                        'data-online': onlineValue
                    }))
                })
                this.projectCtn.appendChild(dom)
            })
        },
        initRecentProjectList: function() {
            var container = this.projectCtn;
            var arr = this.screen.sortProjectByPriority(AppConfig.groupProjectCurrent.projectList);
            arr.length > 3 ? arr.splice(3, arr.length - 3) : 1;
            container.innerHTML = '';
            container.innerHTML = ` <div class="recentProjectDiv"><span class="iconfont icon-lishi"></span><span class="recentProjectSpan">${I18n.resource.platform_app.menu.RECENT}</span></div><div id="rencentContaier"></div`
            var rencentContaier = document.querySelector('#rencentContaier')
            arr.forEach(function(item) {
                // item.online==null||item.online=='Offline'?item.online='0':1;
                var onlineClass = ''
                if (item.online == null || item.online == 'Offline') {
                    item.online = '0'
                    onlineClass = 'offline'
                } else {
                    item.online = 1
                    onlineClass = 'online';
                }
                var name = '';
                if (AppConfig.permission.DemoAccount && item.type && I18n.resource.platform_app.project.PAGE_NAME_ALT[item.type]) {
                    name = I18n.resource.platform_app.project.PAGE_NAME_ALT[item.type]
                } else {
                    name = (AppConfig.language == 'en' ? item.name_english : item.name_cn);
                }
                rencentContaier.appendChild(this.createNavItemDom((name), '', {
                    'class': onlineClass,
                    'data-block': 'project',
                    'data-id': item.id,
                    'data-online': item.online
                }))
            }.bind(this))


        },
        setNavItemDom: function(item, container) {
            if (!item) return false;
            var navDom;
            var parent, subList;
            if (item.parent) {
                // navDom.classList.add('dropdown-submenu');
                parent = container.querySelector('[data-id="' + item.parent + '"]')
                if (!parent) parent = container.querySelector('[data-module="' + item.parent + '"]');
                if (!parent) {
                    parent = this.setNavItemDom(ModuleIOC.getModuleById(item.parent, item.block), container)
                }
                if (parent) {
                    subList = $(parent).find('>.subNavList')[0];
                    if (!subList) {
                        this.setParentItem(parent);
                        subList = $(parent).find('>.subNavList')[0];
                    }

                    navDom = this.createNavItemDom(item.title, item.icon, item.attr, { level: parseInt(parent.dataset.level) + 1, block: item.block, module: item.module, id: item.id })
                    navDom.classList.add('sub');

                    if (subList) subList.appendChild(navDom)
                }
                // else{
                //     navDom = this.createNavItemDom(item.title,item.icon,item.attr,{level:0,block:item.block,module:item.module,id:item.id})
                //     container.appendChild(navDom)
                // }
            } else {
                navDom = this.createNavItemDom(item.title, item.icon, item.attr, { level: 0, block: item.block, module: item.module, id: item.id })
                container.appendChild(navDom)
            }
            return navDom;
        },
        setParentItem: function(dom) {
            var sub = document.createElement('div');
            sub.className = 'subNavList';
            dom.appendChild(sub);
            $(dom).find('>.content')[0].innerHTML += '<span class="glyphicon  iconfont  icon-fanhui3 menu-arrow"></span>';
            dom.classList.add('isParent');
            // dom.dataset.toggle = 'tooltip';
        },
        createNavItemDom: function(text, icon, attr, dataset) {
            var dom = document.createElement('div');
            dom.className = 'navItem';
            // dom.dataset.toggle = 'tooltip';
            // dom.dataset.placement = 'right';
            // dom.setAttribute('title',text);
            if (AppConfig.projectCurrent && AppConfig.projectCurrent.i18n == 1) {
                text = I18n.trans(text);
            }
            if (icon) {
                if (icon.search(/<|>/) == -1) {
                    dom.innerHTML = `<div class="content"><span class="icon ${icon}"></span><span class="text">${text}</span></div>`;
                } else {
                    dom.innerHTML = '<div class="content">' + icon + `<span class="text">${text}</span></div>`;
                }
            } else {
                dom.innerHTML = `<div class="content"><span class="text">${text}</span></div>`;
            }
            var domContent = dom.querySelector('.content')
            domContent.dataset.toggle = 'tooltip';
            domContent.dataset.placement = 'right';
            domContent.setAttribute('title', text);
            //dom.innerHTML =`<span class="icon ${icon}" data-toggle="tooltip" data-placement="right" title="${text}"></span><span class="text">${text}</span>`
            if (attr) {
                Object.keys(attr).forEach(function(key) {
                    if (!attr[key]) return;
                    if (key == 'class') {
                        $(dom).addClass(attr[key])
                    } else {
                        dom.setAttribute(key, attr[key])

                    }
                });
                // if(!(Object.keys(attr).indexOf('class') > -1)){
                //     //父级增加tooltip
                //     dom.dataset.toggle = 'tooltip';
                // }
            }
            if (dataset) {
                Object.keys(dataset).forEach(function(key) {
                    if (typeof dataset[key] != 'number' && !dataset[key]) return;
                    dom.dataset[key] = dataset[key];
                });
            }
            return dom;
        },
        initMenuList: function() {
            var _this = this;
            this.menuCtn.innerHTML = '';
            var spinner = new LoadingSpinner({ color: '#00FFFF' });
            // spinner.spin(this.menuCtn)
            return ModuleIOC.initMenuList().done((list) => {
                ModuleIOC.list.filter(function(item) { return item.block == 'menu' }).forEach(item => {
                    this.setNavItemDom(item, _this.menuCtn)
                });
                ModuleIOC.checkPermission(document.getElementById('sideNavComponent'));
                $(this.menuCtn).find('[data-toggle="tooltip"]').tooltip();
            }).always(function() {
                // spinner.stop()
            })
        },
        setSubNavStyle(target) {
            var $target = $(target);
            if (!$target.hasClass('expand')) {
                // if(target.dataset.level == 0){
                //     $('.navModule>.navItem').removeClass('active');
                // }else{
                $target.find('.expand').removeClass('expand');
                $target.siblings().removeClass('expand')
                    // }
                $target.addClass('expand');
                var $list = $('#sideNavComponent.isInProject .wrapNavModule[data-block="menu"] .navItem.isParent.expand').find('.subNavList').eq(0);
                if ($list.length) {
                    var height = $list.height();
                    var offsetHeight = $list.offset().top;
                    var bodyHeight = $('body').height();
                    if (!(bodyHeight - offsetHeight - height > 0)) {
                        var newHeight = bodyHeight - offsetHeight;
                        $list.css({ "top": newHeight - height + 'px' })
                    } else {
                        $list.css({ "top": '0px' })
                    }
                }

            } else {
                $target.removeClass('expand')
            }
        },
        setActiveNavStyle: function(module, block) {
            var $target;
            if (typeof module == 'string' || typeof module == 'number') {
                $target = $('.navItem[data-id="' + module + '"][data-block="' + block + '"]')
                if ($target.length == 0) {
                    $target = $('.navItem[data-module="' + module + '"][data-block="' + block + '"]')
                }
            } else {
                $target = module;
            }
            $('.navItem').removeClass('active');
            if (!$target) return;
            $target.addClass('active');
            if ($target.hasClass('sub')) {
                $target.parentsUntil('.navModule', '.navItem[data-level="0"]').addClass('active')
            }
            // else{
            $('.navItem[data-level="0"]').removeClass('expand')
                // }
        },
        attachEvent: function() {
            var _this = this;
            // $(this.projectCtn).find('.projectList').each((item,list)=>{
            //     if($(list)[0].children.length>7){
            //         $(list).hide();
            //         $(list).parent().find('.iconNational').addClass('isShowed')
            //     }
            // })
            $(this.projectCtn).off('click').on('click', '.nationalInfo', function() {
                var $iconNational = $(this).find('.iconNational')
                if ($($iconNational).hasClass('isShowed')) {
                    $($iconNational).removeClass('isShowed');
                    $($iconNational).parent().parent().parent().find('.projectList').show();
                } else {
                    $($iconNational).addClass('isShowed');
                    $($iconNational).parent().parent().parent().find('.projectList').hide();
                }
            });
            $('.selectGroupProject').off('click').on('click', function(e) {
                var divGroupList = $('.selectGroupList');
                $(e.currentTarget).toggleClass('isFold');
                if ($(e.currentTarget).hasClass('isFold')) {
                    divGroupList.slideUp(150);
                } else {
                    divGroupList.slideDown(150);
                }
            })
            $('.selectGroupList').off('click').on('click', '.groupListItem', function(e) {
                var divGroupProject = $('.selectGroupProject');
                var target = e.currentTarget;
                $(target).addClass('isSelected').siblings().removeClass('isSelected');
                divGroupProject.html(target.innerHTML);
                if (target.dataset.id) {
                    divGroupProject.attr('data-id', target.dataset.id);
                    _this.screen.toggleGroup(target.dataset.id);
                    divGroupProject.click();
                    //this.setModuleStyle();
                }
            }.bind(this));
            $(this.container).off('click').on('click', '.navItem', function(e) {
                var target = e.currentTarget;
                var $target = $(target);
                // if(!$target.hasClass('sub')){
                //     $('.navItem').removeClass('active');
                //     target.classList.add('active');
                // }else{
                //     _this.setSubNavStyle(target);
                // }
                // var moduleCls = _this.screen.getModuleByName(target.dataset.module);
                // if (!moduleCls)return;
                if ($(target).hasClass('isParent')) {
                    _this.setSubNavStyle(target);
                } else {
                    // if(!$target.hasClass('sub')){
                    //     $('.navModule>.navItem').removeClass('active');
                    //     // $('.navItem:not(.isParent)').removeClass('active');
                    // }
                    // $('.navItem:not(.isParent)').removeClass('active');
                    // $target.addClass('active');
                    // $('.navItem.focus').removeClass('focus')
                    // $target.parentsUntil('.navModule','.navItem[data-level="0"]').addClass('focus')

                    // _this.setActiveNavStyle($target)
                    if (target.dataset.id) {
                        _this.screen.toggleModule(target.dataset.id, target.dataset.block)
                    } else {
                        _this.screen.toggleModule(target.dataset.module, target.dataset.block)
                    }
                }
                e.stopPropagation();
            })


            // $(this.recentProjectCtn).on('click','.navItem',function(e){
            //     var target = e.currentTarget;
            //     $(target).addClass('selected').siblings().removeClass('selected');
            //     // $(_this.projectCtn).find('.navItem:not([data-id="'+ target.dataset.id +'"])').removeClass('selected');
            //     $(_this.projectCtn).find('.navItem').removeClass('selected');
            //     _this.screen.toggleProject(target.dataset.id);                
            //     $(_this.projectCtn).find('.navItem[data-id="'+ target.dataset.id +'"]').addClass('selected');
            // })
            $(this.projectCtn).on('click', '.navItem', function(e) {
                var target = e.currentTarget;
                // $(_this.container).find('.navItem.expand[data-level=0]').removeClass('expand')
                // $(target).addClass('selected').siblings().removeClass('selected');
                // document.querySelector('.iptProjectSearch').value="";
                // $(_this.projectCtn).find('.navItem').removeClass('hide');
                // _this.screen.toggleProject(target.dataset.id);
                _this.toggleProject(null, target)
            })
            $(this.userCtn).on('click', function(e) {
                //防止重复点击样式错乱
                $(_this.container).find('.navItem.expand[data-level="0"]').removeClass('expand');
                _this.showFunctionNav();
                var hideModuleArr = ['modbus', 'dataManagement', 'algorithmDeveloper'];
                if (!AppConfig.projectId) {
                    hideModuleArr.forEach(item => {
                        $(_this.wrapFunctionCtn).find('.navItem[data-module="' + item + '"]').hide();
                        _this.setFunctionModuleStyle();
                    })
                } else {
                    hideModuleArr.forEach(item => {
                        $(_this.wrapFunctionCtn).find('.navItem[data-module="' + item + '"]').show();
                        _this.setFunctionModuleStyle();
                    })
                }
            })
            $('#exitFunction').off('click').on('click', function() {
                    _this.hideFunctionNav();
                })
                // $(this.menuCtn).on('click','.navItem',function(e){
                //     var target = e.currentTarget;
                //     $(target).addClass('selected').siblings().removeClass('selected');
                //     document.querySelector('.iptProjectSearch').value="";
                //     $(_this.projectCtn).find('.navItem').removeClass('hide');
                //     _this.screen.toggleProject(target.dataset.id);
                // })

            this.container.querySelector('.imgBrand').onclick = function() {
                _this.screen.backToProjectNav();
                if (AppConfig.groupProjectList && AppConfig.groupProjectList.length > 0) {
                    args = ['summary', 'base'];
                } else {
                    args = ['overview', 'base'];
                }
                _this.screen.toggleModule(...args);
            }

            // document.getElementById('btnNewProject').onclick = function(){
            //     _this.screen.addNewProject();
            // }

            document.querySelector('.btnNavExpand ').onclick = function() {
                _this.container.classList.toggle('navOff');
                document.getElementById('indexMain').classList.toggle('navOff');
                if (_this.container.classList.contains('navOff')) {
                    $(_this.menuCtn).find('[data-toggle="tooltip"]').tooltip();
                } else {
                    $(_this.menuCtn).find('[data-toggle="tooltip"]').tooltip('destroy');
                    $(_this.menuCtn).find('[data-toggle="tooltip"]').each((index, dom) => {
                        dom.setAttribute('title', dom.getAttribute('data-original-title'));
                    })
                }
                var timer = window.setTimeout(function() {
                    Router.resize.onResize();
                    window.clearTimeout(timer);
                }, 500)
            }

            $('.wrapNavModule[data-block="menu"] .navLabel').off('click').on('click', function() {
                _this.screen.backToProjectNav();
                window.history.go(-1);
                // var args = []
                // if(AppConfig.groupProjectList && AppConfig.groupProjectList.length > 0){
                //     args = ['summary','base']
                // }else{
                //     args = ['overview','base']
                // }
                // _this.screen.toggleModule(...args)
                // _this.setActiveNavStyle(...args);
            })

            $('.wrapNavModule[data-block="menu"] .projectInfo').off('click').on('click', function(e) {
                e.stopPropagation();
                var currentProjectId = AppConfig.projectId;
                var attrWhiteList = ['id','area','raw_count','equipment_count','country_name_twoletter','datadb','insertTime','isAdvance','isFavorite','online','source','system','type','lastReceivedTime','name_en','name_cn','s3dbname','mysqlname','update_time','latlng','address','name_english','weather_station_id','pic','collectionname','SaveSvrHistory','is_delete','is_advance','logo','data_time_zone','time_format','is_diag','arrDp','unit_system','unit_currency','hisdata_structure_v2_from_time','management','i18n'];
                var unitPara;
                var currentProject = BEOPUtil.getProjectById(currentProjectId);
                var unitSystem = currentProject.unit_system;//可能为null
                if (!unitSystem){
                    unitPara = AppConfig.language=='zh'?0:1;
                }else{
                    unitPara = unitSystem;
                }
                var currentUnit = '';
                function getprojectDetail(pid){
                    if (!pid) return
                    return WebAPI.get('/get/projectDetail/' + pid);
                }
                Spinner.spin($('#mainContainer')[0]);
                Unit.prototype.getUnitSystem(unitPara).always(function(rsUinit) {
                    eval(rsUinit);
                    currentUnit = unitSystem['m2'];
                    getprojectDetail(currentProjectId).done(function(result) {                
                        var propertyListDom = '';
                        for (var key in result) {
                            if (key && attrWhiteList.indexOf(key) < 0) {
                                propertyListDom += `<div class="mapRow">
                                <div class="mapRowLeft" title="${key}">${key}:</div>
                                <div class="mapRowRight">${result[key]!=''?result[key]:'-'}</div></div> `;
                            }
                        }
                        var dom = `
                                <div class="mapTitle">
                                    <span class="mapTitleTag"i18n="platform_app.group.PHOTO">项目照片</span>
                                    <span class="mapTitleLine"></span>
                                </div>
                                <div class="mapBody">
                                    <div class="mapImg">
                                    <img class="img-responsive" src="/static/images/project_img/${result.pic}" onerror="javascript:this.style.height='200px';">                            
                                    </div>
                                </div>
                                    
                                    <div class="mapTitle">
                                    <span class="mapTitleTag"i18n="platform_app.group.INFO">基本信息</span>
                                    <span class="mapTitleLine"></span>
                            </div>
                            <div class="mapBody" id="propertyList">
                                    <div class="mapRow">
                                        <div class="mapRowLeft"i18n="platform_app.group.NAME">项目名称：</div>
                                        <div class="mapRowRight">${AppConfig.language=='zh'?result.name_cn:result.name_en}</div>       
                                    </div>
                                    <div class="mapRow">
                                            <div class="mapRowLeft"i18n="platform_app.group.ADDRESS">地址:</div>
                                            <div class="mapRowRight">${result.address!=''?result.address:'-'}</div>       
                                    </div> 
                                    <div class="mapRow">
                                            <div class="mapRowLeft"i18n="platform_app.group.TYPE">类型：</div>
                                            <div class="mapRowRight">${result.type!='' && I18n.resource.platform_app.project.PAGE_NAME_ALT[result.type]?I18n.resource.platform_app.project.PAGE_NAME_ALT[result.type]:'-'}</div>       
                                    </div>  
                                    <div class="mapRow">
                                            <div class="mapRowLeft"i18n="platform_app.group.SYSTEM">接入系统:</div>
                                            <div class="mapRowRight">${result.system!=''?result.system:'-'}</div>       
                                    </div>  
                                    <div class="mapRow">
                                            <div class="mapRowLeft"i18n="platform_app.group.TIME">接入时间:</div>
                                            <div class="mapRowRight">${result.insertTime!=''?result.insertTime:'-'}</div>       
                                    </div>  
                                    <div class="mapRow">
                                            <div class="mapRowLeft" i18n="platform_app.group.ROW_POINT">接入点位：</div>
                                            <div class="mapRowRight">${result.raw_count!=''?result.raw_count:'-'}</div>       
                                    </div>  
                                    <div class="mapRow">
                                            <div class="mapRowLeft"i18n="platform_app.group.SOURCE">数据来源：</div>
                                            <div class="mapRowRight">${result.source!=''?result.source:'-'}</div>       
                                    </div>
                                    <div class="mapRow">
                                            <div class="mapRowLeft mapRowWarn"i18n="platform_app.group.EQUIPMENT">接入设备</div>
                                            <div class="mapRowRight mapRowWarn mapEquipment">${result.equipment_count!=''?result.equipment_count:'-'}</div>       
                                    </div>
                                    <div class="mapRow">
                                            <div class="mapRowLeft mapRowWarn" i18n="platform_app.group.AREA">建筑面积：</div>
                                            <div class="mapRowRight mapRowWarn">${result.area!=''?result.area + currentUnit:'-'}</div>       
                                    </div>   
                            </div>`;  
                            
                            var projectInfoModal = `<div class="modal fade" id="projectInfoModal" tabindex="-1" role="dialog" aria-labelledby="">
                            <div class="modal-dialog" role="document">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                </div>
                                <div class="modal-body">
                                  
                                </div>
                              </div>
                            </div>
                          </div>`;
                        if($('#projectInfoModal').length==0){
                            $('#mainContainer').append(projectInfoModal);
                        }
                        var $projectInfoModal = $('#projectInfoModal');
                        $projectInfoModal.find('.modal-body').html(dom)
                        $('#propertyList').append(propertyListDom);
                        I18n.fillArea($projectInfoModal.find('.modal-body'));
                        $projectInfoModal.modal('show');
                    }).always(() => {
                        Spinner.stop()
                    })
                });
            })

            $('.wrapNavModule[data-block="menu"] .navLabelHome').off('click').on('click', function() {
                _this.screen.backToProjectNav();
                var args = []
                if (AppConfig.groupProjectList && AppConfig.groupProjectList.length > 0) {
                    args = ['summary', 'base']
                } else {
                    args = ['overview', 'base']
                }
                _this.screen.toggleModule(...args)
                    // _this.setActiveNavStyle(...args);
            })
            this.attachSearchProjectEvent();

            /*            $(this.menuCtn).on('click.dropdown-submenu', '.dropdown-submenu',function(e){
                            var $this = $(this),
                                $ul = $this.closest('.dropdown-submenu').children("ul");
                            if ($this.hasClass('showUl')) {
                                $this.removeClass('showUl').find(".arrow").removeClass('rot');
                                $ul.slideUp().removeClass('active');
                            } else {
                                $this.addClass('showUl').find(".arrow").addClass('rot');
                                $ul.slideDown().addClass('active');
                            }
                            if ($(e.currentTarget).find('.navItem').length > 0 ){
                                e.stopPropagation();
                            }
                        });*/
        },
        toggleProject: function(id, target) {
            this.setActiveProjectStyle(id, target)
            return this.screen.toggleProject(target.dataset.id).done(() => { this.screen.toProjectDefaultModule() });
        },
        setActiveProjectStyle: function(id, target) {
            var _this = this;
            if (!target) {
                target = document.querySelector('.navItem[data-block="project"][data-id="' + id + '"]')
            }
            $(_this.container).find('.navItem.expand[data-level=0]').removeClass('expand')
            $(target).addClass('selected').siblings().removeClass('selected');
            document.querySelector('.iptProjectSearch').value = "";
            $(_this.projectCtn).find('.navItem').removeClass('hide');
        },
        attachSearchProjectEvent: function() {
            var _this = this;
            var ipt = document.querySelector('.iptProjectSearch')
            ipt.onpropertychange = function(e) {
                if (e.currentTarget.value == '') {
                    $(_this.projectCtn).find('.navItem').removeClass('hide');
                    _this.findShowProject();
                } else {
                    var result = _this.searchProjectByName(e.currentTarget.value)
                    $(_this.projectCtn).find('.navItem').addClass('hide')
                    result.forEach(function(item) {
                        $(_this.projectCtn).find('[data-id="' + item.id + '"]').removeClass('hide')
                    })
                    _this.findShowProject();
                }
            }
            ipt.oninput = function(e) {
                if (e.currentTarget.value == '') {
                    $(_this.projectCtn).find('.navItem').removeClass('hide');
                    _this.findShowProject();
                } else {
                    var result = _this.searchProjectByName(e.currentTarget.value)
                    $(_this.projectCtn).find('.navItem').addClass('hide')
                    result.forEach(function(item) {
                        $(_this.projectCtn).find('[data-id="' + item.id + '"]').removeClass('hide')
                    });
                    _this.findShowProject();
                }
            }
        },
        findShowProject: function() {
            var $divNational = $('.divNational');
            var nactionNum = $divNational.length;
            for (var i = 0; i <= nactionNum - 1; i++) {
                let all = $divNational.eq(i).find('.navItem').length;
                let hide = $divNational.eq(i).find('.navItem.hide').length;
                $divNational.eq(i).find('.number').text(Number(all - hide));
                $divNational.eq(i).find('.iconNational').removeClass('isShowed');
                $divNational.eq(i).find('.projectList').show();
            }

        },
        searchProjectByName: function (key) {
            var projects = AppConfig.projectList;
            var result = [];
            var pyQueryArray = this.getPYFormat();
            var reg = /[a-z0-9A-Z\- ]/,
                searchValueList = key.split('');
            var isPullEnglish = true;
            searchValueList.forEach(function (item) {
                if (!reg.test(item)) {
                    isPullEnglish = false;
                }
            });
            if (isPullEnglish) {
                //如果搜索的内容是纯英文，有可能是英文和拼音
                //英文里面如果搜索不到就去搜索拼音
                //纯数字按id来查
                pyQueryArray.forEach(function (item) {
                    if ((item.name_english && $.trim(item.name_english.toString()).toLowerCase().indexOf(key.toLowerCase()) !== -1)
                        || (item.PY && item.PY.toString().toLocaleLowerCase().indexOf(key.toString().toLocaleLowerCase()) !== -1)
                        || (item.id && $.trim(item.id).indexOf($.trim(key)) !== -1)) {//加入根据id搜索
                        result.push({
                            pic: '/static/images/project_img/' + item.pic,
                            address: item.address,
                            latlng: item.latlng,
                            name_en: item.name_en,
                            id: item.id
                        });
                    }
                });
            } else {
                projects.forEach(function (item) {
                    if (item.name_cn && item.name_cn.toLowerCase().indexOf(key.toLowerCase()) > -1) {
                        result.push(item);
                        return;
                    }
                    // if (item.name_english && item.name_english.toLowerCase().indexOf(key.toLowerCase()) > -1) {
                    //     result.push(item);
                    //     return;
                    // }
                    // if (item.id == key) {
                    //     result.push(item);
                    //     return;
                    // }
                })
            }
            return result;
        },
        setFunctionModuleDisplay: function() {
            $(this.wrapFunctionCtn).find('[data-for]').each(function(item) {
                var arrFor = [];
                if (this.dataset.for) {
                    arrFor = this.dataset.for.split(';')
                }
                if (ModuleIOC.curModuleOpt && ModuleIOC.curModuleOpt.module && arrFor.indexOf(ModuleIOC.curModuleOpt.module) > -1) {
                    this.classList.remove('hide')
                } else {
                    this.classList.add('hide')
                }
            })

            if (AppConfig.projectId) {
                this.wrapFunctionCtn.querySelector('.toolBtn[data-sort="project"]').classList.remove('toolBtnDisabled')
            } else {
                this.wrapFunctionCtn.querySelector('.toolBtn[data-sort="project"]').classList.add('toolBtnDisabled')
            }
        },
        showFunctionNav: function() {
            var _this = this;
            _this.initMessage();
            _this.setFunctionModuleDisplay();
            //点击离开添加Class一个动画效果，并remove DOM
            $(_this.wrapFunctionCtn).addClass('focus');
            _this.setFunctionModuleStyle();
        },
        hideFunctionNav: function() {
            var _this = this;
            $(_this.wrapFunctionCtn).addClass('wrapFunctionNew')
                // $(_this.wrapFunctionCtn).empty();
            $(_this.wrapFunctionCtn).children().addClass('hide')
            $(_this.wrapFunctionCtn).append('<div class="ciycleDivNew"></div>');
            var functionTimer = window.setTimeout(function() {
                // $(_this.wrapFunctionCtn).remove();
                $(_this.wrapFunctionCtn).find('.ciycleDivNew').remove();
                $(_this.wrapFunctionCtn).removeClass('focus')
                $(_this.wrapFunctionCtn).children().removeClass('hide')
                window.clearTimeout(functionTimer);
            }, 600)
        },
        initUserInFunctionCtn: function() {
            var userDom = ``;
            userDom = `<div class="wrapuserImg"> 
                           <img class="wrapImg" src="https://beopweb.oss-cn-hangzhou.aliyuncs.com${AppConfig.userProfile.picture}"/>
                          </div>
                         <div class="wrapuserName" >
                          <span class="name" >${AppConfig.userProfile.fullname}</span>
                          <span class="btnUserEdit iconfont  icon-wenjianjia-"></span> 
                         </div>
                         <div  id="exitFunction" class=" iconfont icon-close"></div>`;
            this.wrapFunctionCtn.querySelector('.wrapUser').innerHTML = userDom;
            this.wrapFunctionCtn.querySelector('.btnUserEdit').onclick = function() {
                // location.hash = 'page=UserManagerController&manager=AccountManager'
                Router.goTo({
                    page: 'UserManagerController',
                    manager: 'AccountManager'
                })
            };
        },
        initNavListInFunctionCtn: function() {
            var item = ModuleIOC.list;
            item.filter(function(item) { return item.block == 'function' }).forEach(item => {
                this.functionCtn.appendChild(this.createNavItemDom(item.title, item.icon, {
                    needProject: item.needProject ? true : false
                }, { 'module': item.module, 'for': item.for }))
            })
            item.filter(function(item) { return item.block == 'project-function' }).forEach(item => {

                var permission = '';
                switch (item.module) {
                    case 'modbus': // 数据终端
                        permission = 'DataConnect';
                        break;
                    case 'dataManagement': // 数据管理
                        permission = 'RTDataView';
                        break;
                    case 'algorithmDeveloper': // 策略组态
                        permission = '';
                        break;
                    case 'factory': // factory
                        permission = 'CPage;DPage;Epage;WFRManagement;RRublishProject;APProject;CreateProject;DeleteProject;';
                        break;
                    case 'analysis': // 数据分析
                        permission = 'DAnalysis;Danalysis;';
                        break;
                    case 'workorder': // 工单
                        permission = 'WorkOrder';
                        break;
                    case 'system': // 后台管理   
                        permission = 'TeamSet;SOPermissions;MOAccount;';
                        break;
                    case 'terminal': // 终端调试
                        permission = 'DataConnect';
                        break;
                    default:
                        permission = '';
                        break;
                };
                this.projectFunctionCtn.appendChild(this.createNavItemDom(item.title, item.icon, { 'permission': permission }, { 'module': item.module }))
            })
        },
        initMessage: function() {
            var _this = this;
            var sort;
            var toolsWrap = this.wrapFunctionCtn.querySelector('.toolsWrap');
            var projectId = AppConfig.projectId
            if (projectId == undefined) {
                $('[data-sort|=project]').addClass('toolBtnDisabled');
                $('[data-sort|=project]').attr('disabled', 'disabled');

            } else {
                $('[data-sort|=project]').removeAttr('disabled');
            }
            $(toolsWrap).find('.toolBtn').off('click').on('click', function() {
                if ($(this).attr('disabled') === 'disabled') {
                    return
                }
                $(this).addClass('actived')
                $(this).siblings().removeClass('actived')
                sort = $(this).attr('data-sort')
                _this.getMessage(sort)
            })
            $(toolsWrap).find('.toolBtn').eq(0).click();

        },
        getMessage: function(sort) {
            var container = this.wrapFunctionCtn.querySelector('.messageBox')
            container.innerHTML = '';
            var data = [];
            var warn;
            var tag;
            var word;
            var postData = {
                "userId": AppConfig.userId,
                "type": "noRead",
                "page": '1',
                "limit": "30"
            }
            if (sort === 'message') {
                $('.messageBox').show();
                $('.projectBox').hide();
                $('.messageWrap .loading').remove();
                var SpinnerMessage = new LoadingSpinner({ color: '#00FFFF' });
                SpinnerMessage.spin($('.messageWrap')[0]);
                WebAPI.post('/message/api/v1/queryUserMessage', postData).done((list) => {
                    $(this.messageWrap).find('.messageBox').empty();
                    list.data.message.forEach(item => {
                        item.tags[0] == 'workflow' ? tag = '工单' : tag = '诊断';
                        item.tags[0] == 'workflow' ? warn = '' : warn = 'red';
                        item.messageInfo.sender.senderInfo ? '' : item.messageInfo.sender.senderInfo = {
                            userpic: "",
                            userfullname: '',
                            useremail: '',
                            id: ''
                        }
                        word = item.messageInfo.sender.senderInfo.userfullname + ' 创建' + item.messageInfo.title;
                        var id = item.tags[0] == 'workflow' ? item.messageInfo.task.id : '';
                        container.appendChild(this.createMessageList(tag, word, warn, id));
                        $('.messageRow').off('click').on('click', function(e) {
                            $(this).attr('href') ? window.open($(this).attr('href'),'_blank')  : 0;
                            e.stopPropagation();
                        })

                    })
                }).always(() => {
                    SpinnerMessage.stop();
                })
            }
            if (sort == 'project') {
                $('.messageBox').hide();
                $('.projectBox').show();
                this.getProjectStatus();
            }
        },
        getAlarmCount: function() {
            //报警数量
            var postData = {
                "userId": AppConfig.userId,
                "type": "noRead",
                "page": '1',
                "limit": "30"
            }
            var alarmCount = this.userCtn.querySelector('.alarmCount');
            WebAPI.post('/message/api/v1/queryUserMessage', postData).done((list) => {
                alarmCount.classList.add('showAlarm');
                alarmCount.innerHTML = list.data.totalCount;
            })
        },
        getProjectStatus: function() {
            var container = this.wrapFunctionCtn.querySelector('.projectBox');
            var parentCtn = this.wrapFunctionCtn.querySelector('.messageWrap');
            container.innerHTML = '';
            var _this = this;
            var projectData = AppConfig.projectId;
            $('.messageWrap .loading').remove();
            var SpinnerMessage = new LoadingSpinner({ color: '#00FFFF' });
            SpinnerMessage.spin(parentCtn);
            WebAPI.post('/project/status', { projectId: projectData }).done((list) => {
                $(this.wrapFunctionCtn).find('.projectBox').empty();
                var lastUpdateTime = list.data.lastUpdateTime ? list.data.lastUpdateTime.substring(5, 16) : '--';
                var length = list.data.detail.length;
                var dom;
                dom = document.createElement('div');
                dom.innerHTML = `
                        <div class="projectTimeRow ">  <span i18n="platform_app.extend_tip.LAST_TIME">最近更新时间:</span> <span>${lastUpdateTime}</span> <span class="glyphicon glyphicon-th-list" id="statusBtnMore"style="position: absolute;right: 18px;top: 6px;cursor: pointer;"></span></div>
                        <div class="statusTitle " > <span class="statusTitleColor" i18n="platform_app.extend_tip.OFFLINE_TIME">Mothly off line times :</span> <span>${length}</span></div> 
                    `
                for (var i = list.data.detail.length - 1; i >= 0; i--) {
                    var time = list.data.detail[i].offTotalTime.split(':');
                    var hour = '';
                    for (var k = 0; k <= time.length - 1; k++) {
                        if (time[k] != 0) {
                            hour += time[k] + ' ' + _this.getMIN(k);
                        }
                    }
                    dom.innerHTML += `<div class="statusRow " title="${list.data.detail[i].dtu+":"+i18n_resource.platform_app.extend_tip.TIP+hour}"> <div class="statusRowWrap"> 
                                    <div class="statusRowTime ">${list.data.detail[i].offStartTime.substring(5,16)}</div> 
                                    <div class="statusRowName">${list.data.detail[i].dtu}</div></div></div> `
                }

                container.appendChild(dom);
                this.showStatusModal(list.data.detail)
                I18n.fillArea($(parentCtn));
            }).always(() => {
                SpinnerMessage.stop();
            })
        },

        showStatusModal: function(detail) {
            this.initClickNum = 1;
            var html = ``;
            var _this = this;
            var dtuArr = [];
            detail.forEach(item => {
                dtuArr.push(item.dtu);
            })
            var dtuArrs = [];
            // for(let i = 0; i < dtuArr.length; dtuArrs.indexOf(dtuArr[i++]) === -1 && dtuArrs.push(dtuArr[i - 1]));
            // dtuArrs.forEach(item=>{
            //     html+=`<li class="cp statusLi" data-key="${item}" title="${item}"><label><input class="dtuInput" type="checkbox"><span class="offDtu">${item}</span></label></li>
            //     `
            // })
            var dom = `
                <div class="modal fade" id="statusModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <style>
                @media (min-width: 1000px){
                    #statusModal .modal-dialog{
                        width:750px;
                    }
                }
                @media (min-width: 1366px){
                    #statusModal .modal-dialog{
                        width:950px;
                    }
                }
                #statusModal .statusLi{
                    list-style: none;
                }
                .statusLiWell{
                    overflow: auto;
                    height: 400px;
                    width: 171px;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    border-radius: 0px;
                }
                #collapseStatus{
                    padding-top: 1px;
                }
                .dtuInput{
                    line-height: 20px;
                    height: 20px;
                    outline: none;
                }
                #statusTable{
                    color:#666;
                }
                #statusTable tbody{
                    height:300px;
                    overflow-y:auto;
                }
                .statusThead{
                    color: #222;
                    line-height: 30px;
                }
                .statusTheadTr{

                }
                .statusTheadTr span{
                    width:20%;
                    display:inline-block;
                    border-bottom: 1px solid #ddd;
                }
                .statusTbody{
                    overflow-y: auto;
                    height: 300px;
                }
                .statusTbodyTr{
                    line-height: 40px;
                    height: 40px;
                }
                .statusTbodyTr span{
                    width:20%;
                    display:inline-block;
                    border-top: 1px solid #ddd;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 40px;
                    height: 40px;   
                }
                .tipForStatus{
                    text-align: center;
                    padding-top: 10px;
                }
                .statusLiWell .dtuSpan{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                    width: 100px;
                    line-height: 20px;
                }
                .overview-scroll2{}
                .overview-scroll2::-webkit-scrollbar {
                    width: 6px;
                } 
                .overview-scroll2::-webkit-scrollbar-thumb {
                    background-color: #435b63;
                }
                .overview-scroll2::-webkit-scrollbar-track {
                    background-color: #beccd1;
                }
                </style>
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title" id="myModalLabel" i18n="platform_app.extend_tip.PROJ_STATUS">${i18n_resource.platform_app.extend_tip.PROJ_STATUS}</h4>
                    </div>
                    <div class="modal-body">
                            <div id="curveSelectBox" class="mb20 clearfix" style="line-height: 30px;">
                                <div class="clearfix min-screen fl" style="margin-right: 20px;">
                                    <span class="mr10 fl" i18n="platform_app.extend_tip.TIME_RANGE">${i18n_resource.platform_app.extend_tip.TIME_RANGE}</span>
                                    <div class="fl time-box" style="    padding: 0 10px;border: 1px solid #ebebeb;border-radius: 2px;background: #fafafa;display: inline-block;">
                                        <div class="fl cp time-group time-groupStart">
                                            <span class="glyphicon glyphicon-time"></span>
                                            <input class="form-control dib time" size="16" type="text" style="width: 148px; background: none;box-shadow: none;border: none;" value="" id="curveDateStartStatus" i18n="placeholder=energyManagement.overview.SELECT_START_TIME">
                                            <span class="glyphicon glyphicon-chevron-down"></span>
                                        </div>
                                        <span class="fl to" i18n="platform_app.extend_tip.TO"  style="padding: 0 15px;margin: 0 20px;border-left: 1px solid #ebebeb;border-right: 1px solid #ebebeb;position: relative; top: 2px;">${i18n_resource.platform_app.extend_tip.TO}</span>

                                        <div class="fl cp time-group time-groupEnd">
                                            <span class="glyphicon glyphicon-time"></span>
                                            <input class="form-control dib time" size="16" type="text" value="" style="width: 148px; background: none;box-shadow: none;border: none;" id="curveDateEndStatus" i18n="placeholder=energyManagement.overview.SELECT_CLOSING_TIME">
                                            <span class="glyphicon glyphicon-chevron-down"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="min-screen fl">
                                    <div style="background: white;padding-right:6px;">
                                        <input  id="statusListInput"  readonly  class="form-control" type="text" style="width: 148px; background: none;  border:none;  box-shadow: none;display: inline-block;">
                                        <span id="collapseSpan" class="glyphicon glyphicon-chevron-down"  data-toggle="collapse" data-target="#collapseStatus" aria-expanded="false" aria-controls="collapseStatus"></span>
                                    </div>
                                     <div class="collapse" id="collapseStatus" style="position:fixed;">
                                        <div class="well statusLiWell overview-scroll2">
                                            <div class="allDtuBox"><label><input class="allDtu1 dtuInput" style="top: 2px;" type="checkbox"><span  class="dtuSpan"style="display: inline-block;width: 90px;">all</span></label></div>
                                                ${html}
                                            </div>
                                        </div>
                                     </div>
                                 <button type="button" class="btn btn-primary mr10"  style="margin-left: 10px;" id="filterCurveConfirmStatus" i18n="energyManagement.overview.CONFIRM">${i18n_resource.platform_app.extend_tip.CONFIRM}</button>
                                 
                                 </div>
                                <div id="statusTable" class="table table-striped">
                                    <div class="statusThead">
                                        <div class="statusTheadTr">
                                            <span style="width:15%">${i18n_resource.platform_app.extend_tip.NO}</span><span  style="width:25%">${i18n_resource.platform_app.extend_tip.DTU_NO}</span><span >${i18n_resource.platform_app.extend_tip.MISS}</span><span>${i18n_resource.platform_app.extend_tip.OFF_TIME}</span><span style="">${i18n_resource.platform_app.extend_tip.ON_TIME}</span>
                                        </div>
                                    </div>
                                    <div class="statusTbody overview-scroll2">

                                    </div>
                                </div>
                            </div>
                            
                   
                  </div>
                </div>
              </div>`;

            $('#statusBtnMore').off('click').on('click', function() {
                $('#statusModal').remove();
                $('#indexMain').append(dom);
                $('#statusModal').modal();
                var postData = { "projId": AppConfig.projectId, };
                var SpinnerStatus = new LoadingSpinner({ color: '#00FFFF' });
                SpinnerStatus.spin($('#statusModal')[0]);
                WebAPI.post('/terminal/project/dtu/status', postData).done(function(rs) {
                    var dtuArr = [];
                    for (var key in rs.data) {
                        dtuArr.push(rs.data[key].dtuName);
                    };
                    var html = ``;
                    dtuArr.forEach(item => {
                        html += `<li class="cp statusLi" data-key="${item}" title="${item}"><label><input class="dtuInput" type="checkbox"><span class="offDtu dtuSpan">${item}</span></label></li>
                                `
                    })
                    $('.statusLiWell').append(html);
                    //////////
                    _this.startList = 0;
                    _this.initClickNum = 1;
                    _this.dtuNameBoxJson = null;

                    var newDate = new Date();
                    $('#curveDateStartStatus').val(toDate(toDate(newDate).valueOf() - 2592000000).format('yyyy-MM-dd 00:00')).datetimepicker('remove').datetimepicker({
                        format: 'yyyy-mm-dd hh:ii',
                        autoclose: true,
                        minView: 1,
                        startView: 2,
                    });
                    $('#curveDateEndStatus').val(toDate(newDate).format('yyyy-MM-dd HH:mm')).datetimepicker('remove').datetimepicker({
                        format: 'yyyy-mm-dd hh:ii',
                        autoclose: true,
                        minView: 1,
                        startView: 2,
                        endDate: newDate,
                    });
                    $('.time-groupStart').off('click', '.glyphicon').on('click', '.glyphicon', function(e) {
                        $('#curveDateStartStatus').datetimepicker('show')
                        e.stopPropagation();
                    })
                    $('.time-groupEnd').off('click', '.glyphicon').on('click', '.glyphicon', function(e) {
                        $('#curveDateEndStatus').datetimepicker('show')
                        e.stopPropagation();
                    })
                    $('.dtuInput').off('click.dtuInput').on('click.dtuInput', function() {
                        _this.showHistory();
                    });
                    $('.allDtu1').off('click.allDtu1').on('click.allDtu1', function() {
                        var $this = $(this);
                        var isAll = !$this.is(':checked');
                        $(this).prop("checked", isAll);
                        var $offDtuHistoryUl = $('#collapseStatus .well');
                        $offDtuHistoryUl.find('li .dtuInput').prop('checked', isAll);
                        _this.showHistory();
                    });
                    $('.statusLiWell .allDtu1').trigger('click');
                    $('#curveDateStartStatus').off('change.start').on('change.start', function() {
                        if ($('#curveDateStartStatus').val() > $('#curveDateEndStatus').val()) {
                            alert(i18n_resource.platform_app.extend_tip.TIMETIP);
                            return;
                        }
                        // _this.startList+=1;
                        // var nowList=_this.startList;
                        // var postData={"projectId":AppConfig.projectId,"dtu":'',"startTime":$('#curveDateStartStatus').val(),"endTime":$('#curveDateEndStatus').val()};
                        // WebAPI.post('/project/status',postData).done(function(rs){
                        //     _this.showStatusList(rs,nowList);
                        //     _this.checkAttact();
                        // })
                    });
                    $('#curveDateEndStatus').off('change.end').on('change.end', function() {
                        if ($('#curveDateStartStatus').val() > $('#curveDateEndStatus').val()) {
                            alert(i18n_resource.platform_app.extend_tip.TIMETIP);
                            return;
                        }
                        // _this.startList+=1;
                        // var nowList=_this.startList;
                        // var postData={"projId":AppConfig.projectId,};
                        // WebAPI.post('/terminal/project/dtu/status',postData).done(function(rs){
                        //     _this.showStatusList(rs,nowList);
                        //     _this.checkAttact();
                        // })
                    });
                }).always(() => {
                    SpinnerStatus.stop();
                })

            })

        },
        checkAttact: function() {
            var _this = this;
            $('.dtuInput').off('click.dtuInput').on('click.dtuInput', function() {
                _this.showHistory();
            });
            $('.allDtu1').off('click.allDtu1').on('click.allDtu1', function() {
                var $this = $(this);
                var isAll = !$this.is(':checked');
                $(this).prop("checked", isAll);
                var $offDtuHistoryUl = $('#collapseStatus .well');
                $offDtuHistoryUl.find('li .dtuInput').prop('checked', isAll);
                _this.showHistory();
            });
        },
        showStatusList: function(rs, list) {
            var dtuArr = [];
            $('.statusLiWell').empty();
            if (list == this.startList) { //是否最新点击时间
                rs.data.detail.forEach(item => {
                    dtuArr.push(item.dtu);
                })
                var dtuArrs = [];
                var html = `<div class="allDtuBox"><label><input class="allDtu1 dtuInput" style="top: 2px;" type="checkbox"><span style="display: inline-block;width: 90px;">all</span></label></div>
                `;
                for (let i = 0; i < dtuArr.length; dtuArrs.indexOf(dtuArr[i++]) === -1 && dtuArrs.push(dtuArr[i - 1]));
                dtuArrs.forEach(item => {
                    html += `<li class="cp statusLi" data-key="${item}" title="${item}"><label><input class="dtuInput" type="checkbox"><span class="offDtu">${item}</span></label></li>
                    `;
                });
                $('.statusLiWell').append(html);
                // $('#statusListInput').val('');
                if ($('#statusListInput').val() == 'all') {
                    this.checkAttact();
                    $('.allDtuBox .allDtu1').prop('checked', true);
                    $('.statusLiWell .allDtu1').trigger('click');
                    this.dtuNameBoxJson = null;
                } else {
                    var str = $('#statusListInput').val();
                    this.dtuNameBoxJson = str.split(',');
                    this.dtuNameBoxJson.forEach(item => {
                        $('.statusLi[data-key|=' + item + ']').find('.dtuInput').prop('checked', true);
                    });
                }


            }

        },
        showHistory: function() {
            var dtuNameBox = [];
            var _this = this;
            var $offDtuHistoryUl = $('#collapseStatus .well'),
                $offDtu = $offDtuHistoryUl.find('li .offDtu');
            var allNum = $offDtu.length;
            var nowNum = 0;
            for (var i = 0; i < $offDtu.length; i++) {
                if ($offDtu.eq(i).siblings('.dtuInput').is(':checked')) {
                    dtuNameBox.push($offDtu.eq(i).text());
                    nowNum += 1;
                }
            }
            if (nowNum == allNum) {
                $('.allDtuBox .allDtu1').prop('checked', true);
            } else {
                $('.allDtuBox .allDtu1').prop('checked', false);
            }
            if ($('.allDtuBox .allDtu1').is(':checked')) {
                $('#statusListInput').val('all');
            } else {
                $('#statusListInput').val(dtuNameBox.join(','));
            }
            $('#filterCurveConfirmStatus').off('click').on('click', function() {
                $('#collapseStatus').collapse('hide');
                var startTime = $('#curveDateStartStatus').val();
                var endTime = $('#curveDateEndStatus').val();
                if ($('#statusListInput').val() == '') {
                    alert(i18n_resource.platform_app.extend_tip.DTU);
                    return;
                }
                dtuNameBox = _this.dtuNameBoxJson ? _this.dtuNameBoxJson : dtuNameBox;
                _this.showHistoryDetail(dtuNameBox, startTime, endTime);
            });
            if (this.initClickNum == 1) {
                var timea = setTimeout(function() {
                    $('#filterCurveConfirmStatus').trigger('click');
                    clearTimeout(timea)
                }, 500)
            }
            this.initClickNum += 1;

        },

        showHistoryDetail: function(dtuNameBox, startTime, endTime) {
            var _this = this;
            if (startTime > endTime) {
                alert(i18n_resource.platform_app.extend_tip.TIMETIP);
                return;
            }
            if (dtuNameBox.length == 0) {
                // alert(i18n_resource.platform_app.extend_tip.DTU);
                var dom = `<div class="tipForStatus">${i18n_resource.platform_app.extend_tip.NO_RECORD}</div>`
                $('#statusTable .statusTbody').html(dom);
                return
            }
            var $statusTbody = $('.statusTbody');
            var spinner = new LoadingSpinner({ color: '#00FFFF' });
            spinner.spin($statusTbody[0]);
            var postData = { "projectId": AppConfig.projectId, "dtu": dtuNameBox, "startTime": new Date(startTime).format('yyyy-MM-dd HH:mm:ss'), "endTime": new Date(endTime).format('yyyy-MM-dd HH:mm:ss') };
            WebAPI.post('/project/status', postData).done(function(rs) {
                var dom = ``;
                rs.data.detail.forEach((item, i) => {
                    var time = item.offTotalTime.split(':');
                    var hour = '';
                    for (var k = 0; k <= time.length - 1; k++) {
                        if (time[k] != 0) {
                            hour += time[k] + ' ' + _this.getMIN(k);
                        }
                    }
                    dom += `<div class="statusTbodyTr"><span  style="width:15%">${i+1}</span><span   title="${item.dtu}"style="width:25%">${item.dtu}</span><span title="${hour}">${hour}</span><span title="${item.offStartTime}">${item.offStartTime}</span><span title="${item.offEndTime}">${item.offEndTime}</span> </div>`
                });
                rs.data.detail.length == 0 ? dom += `<div class="tipForStatus">${i18n_resource.platform_app.extend_tip.NO_RECORD}</div>` : 0;
                $('#statusTable .statusTbody').html(dom);
            }).always(() => {
                spinner.stop()
            })
        },
        getMIN: function(index) {
            switch (index) {
                case 0:
                    return i18n_resource.platform_app.extend_tip.DAY
                case 1:
                    return i18n_resource.platform_app.extend_tip.HOUR
                case 2:
                    return i18n_resource.platform_app.extend_tip.MIN
                default:
                    return
            }
        },

        createNavList: function(text, icon, attr) {
            var dom = document.createElement('div');
            dom.className = 'navItem';
            dom.dataset.toggle = 'tooltip';
            dom.dataset.placement = 'right';
            dom.setAttribute('title', text);
            dom.innerHTML = `<span class=" ${icon}"></span><span class="text">${text}</span>`
            if (attr) {
                Object.keys(attr).forEach(function(key) {
                    if (!attr[key]) return;
                    if (key == 'class') {
                        dom.classList.add(attr[key])
                    } else {
                        dom.setAttribute(key, attr[key])
                    }
                })
            }
            return dom;
        },
        createMessageList: function(tag, text, warn, id) {
            var dom = document.createElement('div');
            dom.className = 'messageRow';
            dom.dataset.toggle = 'tooltip';
            dom.dataset.placement = 'right';
            id != '' ? dom.setAttribute('href', '/observer#page=workflow&type=transaction&transactionId=' + id) : dom.style.cursor = "default";
            dom.setAttribute('title', text);
            dom.innerHTML = `<span class="messageTag ${warn}">${tag}</span><span class="messageText  ${warn}">${text}</span>`
            return dom;
        },
        getNavListIcon: function(item) {
            switch (item.module) {
                case 'analysis':
                    return 'iconfont  icon-fenxi navIcon'
                case 'workorder':
                    return 'iconfont  icon-gongdan1 navIcon'
                case 'system':
                    return 'iconfont  icon-houtaiguanli navIcon'
                case 'fullscreen':
                    return 'iconfont  icon-quanping navIcon'
                case 'terminal':
                    return 'iconfont  icon-zhongduan navIcon'
                case 'dataManagement':
                    return 'iconfont  icon-Code navIcon'
                case 'algorithmDeveloper':
                    return 'iconfont  icon-kaifazhepingtai navIcon'
                case 'factory':
                    return 'iconfont  icon-wangyepeizhi navIcon'
                case 'operationRecord':
                    return 'iconfont  icon-icon-caozuojilu navIcon'
                default:
                    return 'iconfont  icon-shujuguanlisvg65 navIcon'
            }

        },
        getPYFormat: function() {
            var PYFormat = new pyFormat(), PYProjectList = [], PYItem;
            PYFormat.getPYLocalStorage().done(function (result) {
                AppConfig.projectList.forEach(function (item) {
                    var pinyin = ' ';
                    PYItem = PYFormat.getPYMap(result.data, item.name_cn);
                    if (Array.isArray(PYItem)) {
                        PYItem.forEach(function (i) {
                            pinyin += i.pinyin;
                        });
                        PYProjectList.push($.extend(true, {}, item, {
                            "id": item.id,
                            "PY": $.trim(pinyin),
                            "latlng": item.latlng,
                            "name_en": item.name_en
                        }));
                    } else {
                        PYProjectList.push($.extend(true, {}, item, {
                            "id": item.id,
                            "PY": $.trim(pinyin),
                            "latlng": item.latlng,
                            "name_en": item.name_en
                        }));
                    }
                });
                PYFormat = null;
            });
            return PYProjectList;
        },
        destroy: function() {

        }
    }
    return SideNavComponent
})()
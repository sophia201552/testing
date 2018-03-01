var PlatformScreen = (function() {
    function PlatformScreen() {
        this.nav = undefined;

        this.moduleCtn = undefined;

        return this.show();
    }
    PlatformScreen.prototype = {
        show: function() {
            this.setGlobalVariable();
            return $.when(this.getLayout(), this.getGroupProjectInfo()).done(() => {
                this.toFirstGroup();
                this.setCustomMadeInfo();
                this.setProjectSortByPriority();
                this.registerModule();
                this.initBaseModule();
                this.init();

                // $(this.nav.container).find('[data-toggle="tooltip"]').tooltip()

                this.setFirstModule();
            })
        },
        setCustomMadeInfo: function() {
            if (CompanyConfig.logoId) {
                document.querySelector('.imgBrand').src = `https://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/project_img/${CompanyConfig.logoId}_logo.png`
            } else if (location.host == 'industrytech.smartbeop.com' || location.host == 'industrytech.rnbadopt.com') {
                // }else if(location.host=="localhost"){
                var rurl = "";
                var links = document.getElementsByTagName("link");
                var link = {};
                for (var i = 0; i < links.length; i++) {
                    link = links[i];
                    if (link.rel === "shortcut icon") {
                        link.href = '/static/images/AdOPT.ico';
                        break;
                    }
                }
                document.querySelector('title').text = 'AdOPT'
                document.querySelector('.imgBrand').src = `/static/images/AdOPT_logo.png`
            } else {
                document.querySelector('.imgBrand').src = `/static/images/beop_green_logo.png`
            }
        },
        setGlobalVariable: function() {
            window.AppDriver = this;
            AppConfig.isPlatform = true;
            Router.resize.init();
            // window.ElScreenContainer || (window.ElScreenContainer = document.getElementById('moduleCtn'))
        },
        getLayout: function() {
            var _this = this;
            return WebAPI.get('/static/app/Platform/views/core/frame.html').done(function(resultHTML) {
                document.getElementById('mainContainer').innerHTML = resultHTML;
                _this.moduleCtn = document.getElementById('indexMain')
                window.ElScreenContainer || (window.ElScreenContainer = _this.moduleCtn)
                I18n.fillPage()
            })
        },
        initBaseModule: function() {
            var args = [];
            // if (AppConfig.groupProjectList && AppConfig.groupProjectList.length > 0) {
            //     ModuleIOC.initGroupProjectList(AppConfig.groupProjectList);
            //     args = ['summary', 'base']
            // } else {
            //     args = ['overview', 'base'];
            // }
            args = ['summary', 'base'];

            // this.toggleModule(...args);
        },
        getGroupProjectInfo_bak: function() {
            var $promise = $.Deferred();
            AppConfig.groupProjectList = [];
            WebAPI.get('/admin/getManagementList').done(function(result) {
                if (result.data) {
                    if (AppConfig.permission.DemoAccount || result.data.length == 0) {
                        result.data = [{ code_name: 'tempGroup', name_cn: '我的项目', name_en: 'My Projects', name_englisth: 'My Projects', id: 'tempGroup', projectList: [].concat(AppConfig.projectList) }]
                    }
                    var dataARR = [];
                    if (AppConfig.permission.DemoAccount) {

                        result.data.forEach(item => {
                            item.projectList.forEach(proj => {
                                let projInfo = BEOPUtil.getProjectById(proj.id);
                                if (projInfo.type) {
                                    proj.name_en = I18n.resource.platform_app.project.PAGE_NAME_ALT[projInfo.type]
                                    proj.name_cn = I18n.resource.platform_app.project.PAGE_NAME_ALT[projInfo.type]
                                    proj.name_english = I18n.resource.platform_app.project.PAGE_NAME_ALT[projInfo.type]
                                }
                            })
                            dataARR.push(item)

                        })
                    } else {
                        result.data.forEach(item => {
                            dataARR.push(item)
                        })
                    }
                    result.data = dataARR;
                    //凯德置顶---
                    AppConfig.groupProjectList = result.data;
                }
            }).always(function() {
                $promise.resolve();
            })
            return $promise.promise();
        },
        getGroupProjectInfo: function() {
            var $promise = $.Deferred();
            AppConfig.groupProjectList = [];
            WebAPI.get('/admin/getManagementList').done(function(result) {
                if (result.data) {
                    var projectAll = { code_name: 'all', name_cn: '所有项目', name_en: 'All Projects', name_english: 'All Projects', id: 'all', projectList: [].concat(AppConfig.projectList) }
                    var projectUnassigned = { code_name: 'unassigned', name_cn: '未分配项目', name_en: 'Unassigned Projects', name_english: 'Unassigned Projects', id: 'unassigned', projectList: [].concat(AppConfig.projectList.filter((item) => { return !item.management })) }

                    if (result.data.length == 0) {
                        result.data = [projectAll]
                    } else if (projectUnassigned.projectList.length == 0 && result.data.length == 1) {
                        if (AppConfig.permission.DemoAccount) {
                            result.data[0].name_en = 'Some Group';
                            result.data[0].name_english = 'Some Group';
                            result.data[0].name_cn = '某集团'
                        }
                    } else {
                        result.data.unshift(projectAll);
                        result.data.push(projectUnassigned);
                    }

                    var dataARR = [];
                    if (AppConfig.permission.DemoAccount) {

                        result.data.forEach(item => {
                            item.projectList.forEach(proj => {
                                let projInfo = BEOPUtil.getProjectById(proj.id);
                                if (projInfo.type) {
                                    proj.name_en = I18n.resource.platform_app.project.PAGE_NAME_ALT[projInfo.type]
                                    proj.name_cn = I18n.resource.platform_app.project.PAGE_NAME_ALT[projInfo.type]
                                    proj.name_english = I18n.resource.platform_app.project.PAGE_NAME_ALT[projInfo.type]
                                }
                            })
                            dataARR.push(item)

                        })
                    } else {
                        result.data.forEach(item => {
                            dataARR.push(item)
                        })
                    }
                    dataARR.forEach(item=>{
                        item.projectList.forEach(it=>{
                            for(var i=0;i<AppConfig.projectList.length;i++){
                                if(it.id==AppConfig.projectList[i].id){
                                    if(!it.country_name_twoletter){it.country_name_twoletter=AppConfig.projectList[i].country_name_twoletter;}//赋值集团项目国籍;
                                    it.area = AppConfig.projectList[i].area;
                                }
                            }
                        })
                    })
                    AppConfig.groupProjectList = dataARR;
                }
            }).always(function() {
                $promise.resolve();
            })
            return $promise.promise();
        },
        // getGroupProjectInfo:function(){
        //     var $promise = $.Deferred();
        //     AppConfig.groupProjectList = [];
        //     AppConfig.projectList.forEach((item)=>{
        //         App
        //     })
        //     $promise.resolve();
        //     // WebAPI.get('/admin/getManagementList').done(function(result){
        //     //     if (result.data){
        //     //         //凯德置顶--
        //     //         var dataARR=[];
        //     //         result.data.forEach(item=>{
        //     //             if(item.id==18){
        //     //                 dataARR.unshift(item)
        //     //             }else{
        //     //                 dataARR.push(item)
        //     //             }
        //     //         })
        //     //         result.data=dataARR;
        //     //          //凯德置顶---
        //     //         AppConfig.groupProjectList = result.data;
        //     //     }
        //     // }).always(function(){
        //     //     $promise.resolve();
        //     // })
        //     return $promise.promise();
        // },
        init: function() {
            this.nav = new SideNavComponent(this, document.getElementById('sideNavComponent'));
            this.nav.init();
            this.attachEvent();
        },
        registerModule: function() {
            window.ModuleIOC = new moduleIOC(this);
        },
        setFirstModule: function() {
            // temp_edit
            var _this=this;
            if (location.hash == '') {
                var arg = [];
                if (AppConfig.projectList.length == 1) {
                    this.toggleProject(AppConfig.projectList[0].id).done(function() {
                        _this.toProjectDefaultModule();
                    })
                } else {
                    // if(AppConfig.groupProjectList && AppConfig.groupProjectList.length > 0){
                    //     var id = ModuleIOC.getModuleByName('summary','base').id
                    //     arg = [id,'base']
                    // }else{
                    //     arg = ['overview','base']
                    // }
                    if (AppConfig.permission.GroupUser) {
                        var id = ModuleIOC.getModuleByName('summary', 'base').id
                        arg = [id, 'base']
                    } else if (AppConfig.permission.PlatformUser) {
                        arg = ['overview', 'base']
                    } else {
                        var id = ModuleIOC.getModuleByName('summary', 'base').id
                        arg = [id, 'base']
                    }
                    if (arg.length > 0) {
                        this.toggleModule.apply(this, arg)
                            // this.nav.setActiveNavStyle.apply(this.nav,arg)
                    }
                }
            } else {
                var arg = [];
                Router.screenChange().done(() => {
                    // if(AppConfig.projectId){
                    //     var id = ModuleIOC.curModule.id;
                    //     if(id){
                    //         arg = [id,'menu'];
                    //     }
                    // }else{
                    //     if(location.hash.page)
                    //     var id = ModuleIOC.getModuleByParam('base')
                    //     arg = ['','base']
                    // }
                    // this.nav.setActiveNavStyle.apply(this.nav,arg)
                });
            }
        },
        toggleGroup: function(id) {
            var group = {};
            for (let i = 0; i < AppConfig.groupProjectList.length; i++) {
                if (AppConfig.groupProjectList[i].id == id) {
                    group = AppConfig.groupProjectList[i];
                    break;
                }
            }
            AppConfig.groupProjectCurrent = group;
            this.nav && this.nav.initProjectList();
            // ModuleIOC.initBaseList();

            typeof ModuleIOC != typeof undefined && ModuleIOC.curModule && ModuleIOC.curModule.onGroupToggle && ModuleIOC.curModule.onGroupToggle();
        },
        toggleModule: function(target, block) {
            if (!target) return;
            var moduleOption;
            if(target!='appConfig'&&target!='dbConfig'){
                ScreenCurrent && ScreenCurrent.close && ScreenCurrent.close();
                ScreenCurrent = null;
                ElScreenContainer.innerHTML = '';
            }else{
                ModuleIOC.copyOpt=ModuleIOC.curModuleOpt;
            }
            moduleOption = ModuleIOC.getModuleById(target, block)
            if (!moduleOption) moduleOption = ModuleIOC.getModuleByName(target, block)
            if (!moduleOption) return;
            // $('.navItem').removeClass('active');
            // if(moduleOption.id){
            //     $('.wrapNavModule[data-block="'+ block +'"] .navItem[data-id="'+ moduleOption.id +'"]').addClass('active');
            // }else{
            //     $('.wrapNavModule[data-block="'+ block +'"] .navItem[data-module="'+ moduleOption.module +'"]').addClass('active');
            // }
            // var moduleCls = moduleOption.cls;
            // if(!moduleCls && moduleOption.module != 'iframe')return;
            ElScreenContainer.dataset.module = moduleOption.module;
            ModuleIOC.toggle(moduleOption);
            // ScreenCurrent && ScreenCurrent.close && ScreenCurrent.close()
            // if (moduleOption.id) {
            //     var pageId = moduleOption.id;
            //     if (moduleOption.module === 'ReportScreen') {
            //         Router.goTo({
            //             page: 'ReportScreen',
            //             reportId: pageId,
            //             reportType: moduleOption.reportTpye,
            //             reportFolder: moduleOption.reportFolder,
            //             reportText: moduleOption.reportText
            //         });
            //     } else if (moduleOption.module == 'EnergyScreen_M') {
            //         Router.show(moduleOption.cls, pageId, null, null, null, true);
            //     } else if ([namespace('observer.screens.PageScreen'),
            //             namespace('observer.screens.FacReportScreen'),
            //             namespace('observer.screens.FacReportWrapScreen')
            //         ].indexOf(moduleOption.cls) > -1) {
            //         Router.show(moduleOption.cls, {
            //             id: pageId
            //         }, 'indexMain');
            //     } else {
            //         Router.goTo({
            //             page: moduleOption.module,
            //             id: pageId
            //         });
            //     }
            // } else {
            //     // ScreenManager.goTo({
            //     //     page:  moduleOption.module
            //     // });
            //     // this.module = new moduleCls(this,this.moduleCtn,moduleOption.option)
            //     Router.show(moduleOption.cls,this.moduleCtn,moduleOption.option);
            // }
            // this.module = new moduleCls(this,this.moduleCtn,moduleOption.option)
            // this.module.show();
        },
        attachEvent: function() {
            // var _this = this;
            // var $navModule = $(document.getElementById('sideNavComponent').querySelector('#navProjectConfig'))
            // $navModule.off('click').on('click','.navItem',function(e){
            //     var moduleCls = _this.getModuleByName(e.currentTarget.dataset.module);
            //     if (!moduleCls)return;
            //     _this.toggleModule(moduleCls.name)
            // })
        },
        toggleProject: function(projectId) {
            this.nav.container.classList.add('navOff')
            this.moduleCtn.classList.add('navOff')
            AppConfig.projectId = projectId;
            AppConfig.projectCurrent = ModuleIOC.getProjectById(projectId)
            AppConfig.projectName = AppConfig.projectCurrent.name_en
            this.setRecentProject(projectId);
            this.nav.initProjectList();
            // this.nav.initRecentProjectList();
            // this.nav.setModuleStyle();
            document.getElementById('sideNavComponent').classList.add('isInProject')
            var name = '';
            var iconName = '';
            if (AppConfig.permission.DemoAccount && AppConfig.projectCurrent.type && I18n.resource.platform_app.project.PAGE_NAME_ALT[AppConfig.projectCurrent.type]) {
                name = I18n.resource.platform_app.project.PAGE_NAME_ALT[AppConfig.projectCurrent.type];
                iconName = I18n.resource.platform_app.menu.PROJECT_LIST;
            } else {
                name = (AppConfig.language == 'en' ? AppConfig.projectCurrent.name_english : AppConfig.projectCurrent.name_cn);
                iconName = I18n.resource.platform_app.menu.PROJECT_LIST;
            }
            document.querySelector('.project').innerHTML = name;
            document.querySelector('.project').title = name;
            document.querySelector('.iconName').innerHTML = iconName;
            if (AppConfig.projectCurrent && AppConfig.projectCurrent.online != 1&&AppConfig.permission.OffLTimeView) {
                document.querySelector('.projectStatus').innerHTML = AppConfig.language == 'en' ? 'offline' : '已离线';
                document.querySelector('.projectStatus').classList.add('showText');
                document.querySelector('.wrapUserProfile').classList.add('showRed');
            } else {
                document.querySelector('.projectStatus').innerHTML = '';
                document.querySelector('.wrapUserProfile').classList.remove('showRed');
                document.querySelector('.projectStatus').classList.remove('showText');
            }
            // ElScreenContainer.style.opacity = 0;

            var preRequest = [this.nav.initMenuList()];
            if (AppConfig.projectCurrent.i18n == true) {
                preRequest.push(this.getProjectI18n())
            }

            ScreenCurrent && ScreenCurrent.close && ScreenCurrent.close();
            ScreenCurrent = null;
            ElScreenContainer.innerHTML = '';
            var spinner = new LoadingSpinner({ color: '#00FFFF' });
            spinner.spin(ElScreenContainer);

            return $.when.apply(this, preRequest).done(() => {
                // ElScreenContainer.style.opacity = 1;
            }).always(function() {
                spinner.stop();
            });
        },

        toProjectDefaultModule: function() {
            var targetModule = ModuleIOC.getProjectDefaultModule();
            if (targetModule && targetModule.id) {
                this.toggleModule(targetModule.id, 'menu')
                this.nav.setActiveNavStyle(targetModule.id, 'menu')
            } else {
                this.toggleModule(targetModule.module, 'menu')
                this.nav.setActiveNavStyle(targetModule.module, 'menu')
            }
        },
        getProjectI18n: function() {
            return I18n.getProjectI18n(AppConfig.projectId, AppConfig.language);
        },
        setProjectSortByPriority: function() {
            var projList = this.sortProjectByPriority();
            localStorage.setItem('recent_project_list', JSON.stringify(projList.map(function(item) { return item.id })));
            return projList;
        },
        sortProjectByPriority: function(arrProject) {
            var arr = this.getRecentProjectList();
            var arrProject = arrProject || AppConfig.projectList;
            var projList = [];
            if ((arrProject instanceof Array)) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < arrProject.length; j++) {
                        if (arrProject[j] && arrProject[j].id == arr[i]) {
                            projList.push(arrProject[j])
                                // AppConfig.projectList[j] = null;
                        }
                    }
                }
            } else {
                arrProject = [];
            }
            // AppConfig.projectList = [].concat(projList,AppConfig.projectList.filter(function(item){return item != null;}));
            return projList;
        },
        getRecentProjectList: function() {
            var arr = []
            try {
                arr = JSON.parse(localStorage.getItem('recent_project_list'))
                if (!(arr instanceof Array)) arr = [];
            } catch (e) {
                arr = [];
            }
            return arr;
        },
        setRecentProject: function(id) {
            var arr = this.getRecentProjectList();
            arr = arr.filter(function(item) { return item != id });
            arr.unshift(id);
            // arr = arr.slice(0,5)
            localStorage.setItem('recent_project_list', JSON.stringify(arr));
            this.sortProjectByPriority();
        },
        backToProjectNav: function() {
            if (!this.nav.container.classList.contains('isInProject')) return;
            AppConfig.projectId = null;
            this.nav.container.classList.remove('isInProject')
            this.nav.container.classList.remove('navOff')
            this.moduleCtn.classList.remove('navOff')

        },
        addNewProject: function(name) {
            //id = AppConfig.projectList[AppConfig.projectList.length - 1].id + 1;
            id = AppConfig.projectList[AppConfig.projectList.length - 1].id;
            var dom = this.nav.createNavItemDom(name, '', { 'class': 'noInstance', 'data-id': id })
                // AppConfig.projectList.push({
                //     name_cn:name,
                //     name_en:name,
                //     id:id
                // })
            $(this.nav.projectCtn).find('.navItem').removeClass('selected')
            dom.classList.add('selected');
            this.nav.projectCtn.insertBefore(dom, this.nav.projectCtn.children[0])
            this.toggleProject(id).done(() => {
                this.toProjectDefaultModule();
            })
        },
        setActiveNavStyleByOption: function(option) {
            if (option.projectId) {
                var id = this.getActiveMenuModuleIdByOption(option)
                if (id) {
                    this.nav.setActiveNavStyle(id, 'menu')
                } else {
                    var tarModule = ModuleIOC.getModuleByParam('cls', window[option.page], 'menu') || {}
                    this.nav.setActiveNavStyle(tarModule.module, 'menu')
                }
            } else {
                var tarModule, param;
                switch (option.page) {
                    case 'GroupProjectOverview':
                        tarModule = ModuleIOC.getModuleByMultiParam({ 'module': 'summary', 'option.projectGrpId': option.id }, 'base')[0]
                        break;
                    case 'PlatformStandard':
                        tarModule = ModuleIOC.getModuleByMultiParam({ 'module': 'standard', 'option.projectGrpId': option.id, 'template': option.template }, 'base')[0]
                        break;
                    default:
                        tarModule = ModuleIOC.getModuleByParam('cls', window[option.page], 'base')
                        break;
                }
                if (tarModule) {
                    if (tarModule.id) {
                        param = tarModule.id
                    } else if (tarModule.module) {
                        param = tarModule.module
                    }
                }
                this.nav.setActiveNavStyle(param, 'base');
            }
        },
        toFirstGroup: function() {
            this.toggleGroup(AppConfig.groupProjectList[0].id)
        },
        getActiveMenuModuleIdByOption: function(hashMap) {
            var params;
            if (typeof hashMap.id !== typeof undefined) {
                return hashMap.id;
            }
            if (hashMap.reportId) {
                return hashMap.reportId;
            }

            if (typeof hashMap.options === 'string') {
                params = {};
                try {
                    params = JSON.parse(window.decodeURIComponent(hashMap.options));
                } catch (e) {}

                return params.id;
            }
            if (typeof hashMap.options === 'object' && hashMap.options) {
                return hashMap.options.id;
            }
        },
        destory: function() {

        }
    }
    return PlatformScreen
})()
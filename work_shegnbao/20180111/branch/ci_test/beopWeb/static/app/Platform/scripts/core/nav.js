var SideNavComponent = (function(){
    function SideNavComponent(screen,container){
        this.screen = screen;
        this.container = container;

        this.projectCtn = undefined;
        this.menuCtn = undefined;
        this.userCtn = undefined;
    }
    SideNavComponent.prototype = {
        init:function(){
            this.projectCtn = document.getElementById('navProject');
            this.menuCtn = document.getElementById('navMenu');
            this.userCtn = document.querySelector('.wrapUserProfile')

            this.initProjectList();
            this.initUserProfile();
            this.attachEvent();
        },
        initUserProfile:function(){
            this.userCtn.title = AppConfig.userProfile.fullname
            this.userCtn.innerHTML = `
                <span class="portrait"><img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com${AppConfig.userProfile.picture}"/></span>
                <span class="name">${AppConfig.userProfile.fullname}</span>
                <span class="project"></span>
            `
        },
        initProjectList:function(){
            var projects = AppConfig.projectList;
            projects.forEach((item)=>{
                this.projectCtn.appendChild(this.createNavItemDom(item.name_en,'',{'class':'noInstance','data-id':item.id}))
            })
        },
        createNavItemDom:function(text,icon,attr){
            var dom = document.createElement('div');
            dom.className = 'navItem';
            dom.dataset.toggle = 'tooltip';
            dom.dataset.placement = 'right';
            dom.setAttribute('title',text);
            dom.innerHTML =`<span class="icon ${icon}"></span><span class="text">${text}</span>`
            //dom.innerHTML =`<span class="icon ${icon}" data-toggle="tooltip" data-placement="right" title="${text}"></span><span class="text">${text}</span>`
            if (attr){
                Object.keys(attr).forEach(function(key){
                    if (!attr[key])return;
                    if (key == 'class'){
                        dom.classList.add(attr[key])
                    }else{
                        dom.setAttribute(key,attr[key])
                    }
                })
            }
            return dom;
        },
        initMenuList:function(){
            var userId = AppConfig.userId;
            var projectId = AppConfig.projectId;
            this.menuCtn.innerHTML = '';
            return WebAPI.get('/get_plant_pagedetails/'+ projectId +'/' + userId).done((list)=>{
                var menuList = list.navItems;
                this.screen.moduleList = this.screen.moduleList.filter(function(item){
                    return item.block != 'menu';
                })
                this.screen.moduleList.push({
                    cls:PlatformGuide,
                    name:'config',
                    title:'Config',
                    block:'menu',
                    option:{}
                })
                this.screen.moduleList.push({
                    cls:PlatformCopy,
                    name:'maintain',
                    title:'Maintain',
                    block:'menu',
                    option:{}
                })
                this.screen.moduleList = this.screen.moduleList.concat(list.navItems.map(function(item){
                    return {
                        cls:PlatformOverview,
                        name:item.type,
                        title:item.text,
                        block:'menu',
                        id:item.id,
                        // option:{
                        //     id:item.id,
                        // }
                    }
                })) 
                this.screen.moduleList.filter(function(item){return item.block == 'menu'}).forEach(item=>{
                    this.menuCtn.appendChild(this.createNavItemDom(item.title,this.getMenuListIcon(item),{'data-id':item.id,'data-module':item.name}))
                })
                $(this.container).find('[data-toggle="tooltip"]').tooltip()
            })
        },
        getMenuListIcon:function(item){
            switch (item.name){
                case 'ObserverScreen':
                    return 'glyphicon glyphicon-home'
                case 'AnalysisScreen':
                    return 'iconfont icon-shujufenxi'
                case 'EnergyScreen':
                    return 'iconfont icon-nihequxian'
                case 'EnergyScreen_M':
                    return 'glyphicon glyphicon-phone'
                case 'DropDownList':
                    return 'glyphicon glyphicon-menu-hamburger'
                case 'FacReportWrapScreen':
                case 'ReportScreen':
                    return 'glyphicon glyphicon-file'
                case 'DiagnosisScreen':
                    return 'glyphicon glyphicon-wrench'
                default:
                    return 'glyphicon glyphicon-folder-close'
            }
            // if (item.pic){
            //     return 'glyphicon glyphicon-th'
            // }else{
            //     return 'glyphicon glyphicon-th'
            // }
        },
        attachEvent:function(){
            var _this = this;
            $(this.container).off('click').on('click','.navItem',function(e){
                var target = e.currentTarget;
                $('.navItem').removeClass('active');
                target.classList.add('active');
                if (!target.dataset.module || target.classList.contains('noInstance'))return;
                // var moduleCls = _this.screen.getModuleByName(target.dataset.module);
                // if (!moduleCls)return;
                if (target.dataset.id){
                    _this.screen.toggleModule(target.dataset.id,target.parentNode.parentNode.dataset.block)
                }else{
                    _this.screen.toggleModule(target.dataset.module,target.parentNode.parentNode.dataset.block)
                }
            })
            $(this.projectCtn).on('click','.navItem',function(e){
                var target = e.currentTarget;
                $(target).addClass('selected').siblings().removeClass('selected');
                document.querySelector('.iptProjectSearch').value="";
                $(_this.projectCtn).find('.navItem').removeClass('hide');
                _this.screen.toggleProject(target.dataset.id);
            })

            this.container.querySelector('.imgBrand').onclick = function(){
                _this.screen.backToProjectNav();
            }

            // document.getElementById('btnNewProject').onclick = function(){
            //     _this.screen.addNewProject();
            // }

            document.querySelector('.btnNavExpand ').onclick = function(){
                _this.container.classList.toggle('navOff');
                document.getElementById('moduleCtn').classList.toggle('navOff')
                var timer = window.setTimeout(function(){
                    _this.screen.module.show()
                    window.clearTimeout(timer);
                },500)
            }

            $('.wrapNavModule[data-block="menu"] .navLabel').off('click').on('click',function(){
                _this.screen.backToProjectNav();
                _this.screen.toggleModule('overview','config')
            })
            this.attachSearchProjectEvent();
        },
        attachSearchProjectEvent:function(){
            var _this = this;
            var ipt = document.querySelector('.iptProjectSearch')
            ipt.onpropertychange = function(e){
                if (e.currentTarget.value == ''){
                    $(_this.projectCtn).find('.navItem').removeClass('hide');
                }else{
                    var result = _this.searchProjectByName(e.currentTarget.value)
                    $(_this.projectCtn).find('.navItem').addClass('hide')
                    result.forEach(function(item){
                        _this.projectCtn.querySelector('[data-id="'+ item.id +'"]').classList.remove('hide')
                    })
                }
            }
            ipt.oninput = function(e){
                if (e.currentTarget.value == ''){
                    $(_this.projectCtn).find('.navItem').removeClass('hide');
                }else{
                    var result = _this.searchProjectByName(e.currentTarget.value)
                    $(_this.projectCtn).find('.navItem').addClass('hide')
                    result.forEach(function(item){
                        _this.projectCtn.querySelector('[data-id="'+ item.id +'"]').classList.remove('hide')
                    })
                }
            }
        },
        searchProjectByName:function(key){
            var projects = AppConfig.projectList;
            var result = [];
            projects.forEach(function(item){
                if (item.name_en && item.name_en.indexOf(key)>-1){
                    result.push(item);
                    return;
                }
                if (item.name_cn && item.name_cn.indexOf(key)>-1){
                    result.push(item);
                    return;
                }
                if (item.id == key){
                    result.push(item);
                    return;
                }
            })
            return result;
        },
        destroy:function(){

        }
    }
    return SideNavComponent
})()
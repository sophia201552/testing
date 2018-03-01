var PlatformScreen = (function(){
    function PlatformScreen(){
        this.nav = undefined;

        this.module = undefined;
        this.moduleList = [];
        this.moduleCtn = undefined;
    }
    PlatformScreen.prototype = {
        show:function(){
            this.setGlobalVariable();
            $.when(this.getLayout()).done(()=>{
                this.registreModule();
                this.initModuleNav();
                this.init();

                $(this.nav.container).find('[data-toggle="tooltip"]').tooltip()

                this.setFirstModule();
            })
        },
        setGlobalVariable:function(){
            window.ElScreenContainer || (window.ElScreenContainer = document.getElementById('indexMain'))
        },
        getLayout:function(){
            var _this =this;
            return WebAPI.get('/static/app/Platform/views/core/frame.html').done(function(resultHTML){
                ElScreenContainer.innerHTML = resultHTML;
                _this.moduleCtn = document.getElementById('moduleCtn')
            })
        },
        init:function(){
            this.nav = new SideNavComponent(this,document.getElementById('sideNavComponent'));
            this.nav.init();

            this.attachEvent();
        },
        registreModule:function(){
            this.moduleList.push({cls:ProjectCreate,name:'create',title:'New Project ',block:'config',attr:{'id':'btnNewProject'}})
            this.moduleList.push({cls:PlatformOverview,name:'overview',title:'Overview',block:'config'})
        },
        initModuleNav:function(){
            this.initConfigNav();
        },
        initConfigNav:function(){
            var container = document.getElementById('sideNavComponent').querySelector('#navProjectConfig')
            var navDom;
            this.moduleList.filter(function(item){return item.block == 'config'}).forEach(function(item){
                navDom = document.createElement('div');
                navDom.innerHTML = `<span class="icon"></span><span class="text">${item.title}</span>`;
                navDom.dataset.module = item.name;
                navDom.className = 'navItem';
                if (!item.cls)navDom.classList.add('noInstance')
                if (item.attr){
                    Object.keys(item.attr).forEach(function(key){
                        if (key == 'class'){
                            navDom.classList.add(item.attr[key])
                        }else{
                            navDom.setAttribute(key,item.attr[key])
                        }
                    })
                }
                container.appendChild(navDom)
            });
        },      
        setFirstModule:function(){
            this.toggleModule('overview','config')
        },
        toggleModule:function(target,block){
            if (!target)return;
            var moduleOption;
            moduleOption = this.getModuleById(target,block)
            if (!moduleOption)moduleOption = this.getModuleByName(target,block)
            if(!moduleOption)return;
            $('.navItem').removeClass('active');
            if(moduleOption.id){
                $('.navItem[data-id="'+ moduleOption.id +'"]').addClass('active');
            }else{
                $('.navItem[data-module="'+ moduleOption.name +'"]').addClass('active');
            }
            var moduleCls = moduleOption.cls;
            if(!moduleCls)return;
            this.module && this.module.close && this.module.close()
            this.module = new moduleCls(this,this.moduleCtn,moduleOption.option)
            this.module.show();
        },
        getModuleByName:function(name,block){
            return this.getModuleByParam('name',name,block);
        },
        getModuleById:function(id,block){
            return this.getModuleByParam('id',id,block);
        },
        getModuleByParam:function(key,value,block){
            var list = [];
            if (!block){
                list = this.moduleList;
            }else{
                list = this.moduleList.filter(function(item){return item == block})
            }
            for (var i = 0; i < this.moduleList.length; i++){
                if (this.moduleList[i][key] == value){
                    return this.moduleList[i]
                }
            }
            return false;
        },
        attachEvent:function(){
            // var _this = this;
            // var $navModule = $(document.getElementById('sideNavComponent').querySelector('#navProjectConfig'))
            // $navModule.off('click').on('click','.navItem',function(e){
            //     var moduleCls = _this.getModuleByName(e.currentTarget.dataset.module);
            //     if (!moduleCls)return;
            //     _this.toggleModule(moduleCls.name)
            // })
        },
        toggleProject:function(projectId){
            AppConfig.projectId = projectId;
            AppConfig.projectInfo = this.getProjectById(projectId)
            document.getElementById('sideNavComponent').classList.add('menuMode')
            this.nav.userCtn.querySelector('.project').innerHTML = AppConfig.projectInfo.name_en;
            this.nav.initMenuList().done(()=>{
                this.toggleModule('config','menu')
            });
        },
        backToProjectNav:function(){
            if (!this.nav.container.classList.contains('menuMode'))return;
            this.nav.container.classList.remove('menuMode')
            this.nav.container.classList.remove('navOff')
            this.moduleCtn.classList.remove('navOff')
        },
        getProjectById:function(id){
            for (var i = 0; i < AppConfig.projectList.length ;i++){
                if (AppConfig.projectList[i].id == id){
                    return AppConfig.projectList[i]
                }
            }
            return false;
        },
        addNewProject:function(name){
            id = AppConfig.projectList[AppConfig.projectList.length - 1].id + 1;
            var dom = this.nav.createNavItemDom(name,'',{'class':'noInstance','data-id':id})
            AppConfig.projectList.push({
                name_cn:name,
                name_en:name,
                id:id
            })
            $(this.nav.projectCtn).find('.navItem').removeClass('selected')
            dom.classList.add('selected');
            this.nav.projectCtn.insertBefore(dom,this.nav.projectCtn.children[0])
            this.toggleProject(id)
        },
        close:function(){

        }
    }
    return PlatformScreen
})()
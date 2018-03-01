
var listPanel = (function(){
    function listPanel($ctn,projectId,parent,theme,path){
        this.$ctn = $ctn;
        this.projectId = projectId;
        this.theme = theme;

        this.opt = undefined;
        this.defaultOpt = {
                title:{
                    show:false
                },
                base:{
                    divideByProject:true
                },
                search:{
                    show:true
                },
                class: {
                    show:true,
                    projects: {
                        show: true,
                        class: 'all',
                        showAll: true,
                        showNone: true,
                        add:true,
                        delete:true
                    },
                    groups: {
                        show: true,
                        class: 'all',
                        showAll: true,
                        showNone: true,
                        add:true,
                        delete:true
                    },
                    things: {
                        show: true,
                        class: 'all',
                        showAll: true,
                        showNone: true,
                        add:true,
                        delete:true
                    }
                },
                tree:{
                    show:true,
                    event:{},
                    drag:{
                        enable:true
                    },
                    base:{
                        expandReload:true,
                    },
                    tool:{
                        add:{

                        },
                        beforeAdd:{

                        },
                        edit:{

                        },
                        del:{

                        }
                    },
                    check:{
                        enable:false
                    }
                }
            };
        this.dictClass = {};
        this.store = undefined;

        this.initDeferred = $.Deferred();
        this.showStatus = {'projects':'all','groups':'all','things':'all'};
    }
    listPanel.prototype = {
        init:function(ctn,theme){
            var _this = this;
            _this.$ctn = ctn?ctn:_this.$ctn;
            _this.theme = theme?theme:_this.theme;
            if(!_this.projectId) {
                if (AppConfig && AppConfig.projectId) {
                    _this.projectId = AppConfig.projectId;
                } else {
                    if (window.parent && window.parent.AppConfig.projectId) {
                        _this.projectId = window.parent.AppConfig.projectId;
                    }
                }
            }
            if(!_this.projectId)_this.projectId = 122;
            
            I18n.fillArea($('#filterWrapper'));
            _this.initDeferred.resolve();
        },
        setOption:function(projectId){
            // this.$ctn.prev().hide();
            var _this = this;
            _this.initDeferred.done(function() {
                _this.opt = $.extend(true, {}, _this.defaultOpt);
                var projectId = projectId ? projectId : _this.projectId;
                var postData = {
                    parent: [],
                    projId:[projectId]
                };
                if (!_this.opt.base.divideByProject)delete postData.projId;
                $.when(
                    WebAPI.get('/iot/getClassFamily/group/cn'),
                    WebAPI.get('/iot/getClassFamily/thing/cn'),
                    WebAPI.get('/iot/getClassFamily/project/cn')
                ).done(function (groups,things,projects) {
                    _this.dictClass['groups'] = groups[0];
                    _this.dictClass['things'] = things[0];
                    _this.dictClass['projects'] = projects[0];
                    WebAPI.post('/iot/search', postData).done(function (resultDate) {
                        _this.store = {
                            groups: resultDate.groups,
                            projects: resultDate.projects,
                            things: resultDate.things
                        };
                        _this.isSearch = false;
                        var $Deffer = $.Deferred();
                        if (resultDate.projects.length == 0) {
                            _this.setIotProject().done(function(result){
                                if (result && result.status == 'success') {
                                    _this.store.projects[0]._id = result._id;
                                    $Deffer.resolve();
                                }else{
                                    $Deffer.reject();
                                }
                            }).fail(function(){
                                $Deffer.reject();
                            });
                        }else{
                            $Deffer.resolve();
                        }
                        $Deffer.done(function(){
                            for (var i = 0; i < _this.store.groups.length; i++) {
                                _this.store.groups[i].isParent = true;
                                _this.store.groups[i].baseType = 'groups';
                            }
                            for (var i = 0; i < _this.store.projects.length; i++) {
                                _this.store.projects[i].isParent = true;
                                _this.store.projects[i].baseType = 'projects';
                            }
                            for (var i = 0; i < _this.store.things.length; i++) {
                                _this.store.things[i].baseType = 'things';
                            }
                            for (var type in _this.store) {
                                if (_this.opt.class && _this.opt.class[type] && _this.opt.class[type].class) {
                                    if (_this.dictClass[type][_this.opt.class[type].class] && _this.dictClass[type][_this.opt.class[type].class].parent == 'BaseIOT') {
                                        _this.showStatus[type] = 'all'
                                    } else {
                                        _this.showStatus[type] = _this.opt.class[type].class
                                    }
                                }
                            }
                            _this.initProject(_this.store);
                            _this.initGroups(_this.store);
                           
                        });
                    });
                });
            });
        },
        initProject:function(opt){
            this.$ctn.html("");
            var _id = opt.projects[0]._id
            var baseType = opt.projects[0].baseType;
            var name = opt.projects[0].name;
            var projectInfo = '<div class="projectInfo" data-baseType="'+baseType+'" data-id="'+_id+'">\
                                    <h3>'+name+'</h3>\
                                </div>';
            $(projectInfo).appendTo(this.$ctn);
        },
        initGroups:function(opt){
            var _this = this;
            if(opt.baseType == 'things') {
                func();
                _this.tree.expandNode(opt,null,false,true,true);
                return;
            }else {
                var postData = {
                    parent: [{
                        id: opt.projects[0]._id,
                        type: opt.projects[0].baseType
                    }]
                };
                WebAPI.post('/iot/search', postData).done(function (resultData) {
                    var groupsInfo = resultData.groups;
                    for(var i=0,length=groupsInfo.length;i<length;i++){
                        var groupInfo = '<div class="groupInfo" data-id="'+groupsInfo[i]._id+'">\
                                            <span class="groupTitle">'+groupsInfo[i].name+'</span>\
                                            <span class="glyphicon glyphicon-menu-right"></span>\
                                        </div>';
                        $(groupInfo).appendTo(this.$ctn);
                    }
                }.bind(this));
            }
        },
        initThings:function(postData,groupTitle){
            var _this = this;
            WebAPI.post('/iot/search', postData).done(function (resultData) {
                this.$ctn.html("");
                if(!resultData.groups.length == 0){
                    var groupsInfo = resultData.groups;
                    for(var i=0,length=groupsInfo.length;i<length;i++){
                        var groupInfo = '<div class="groupInfo" data-id="'+groupsInfo[i]._id+'">\
                                            <span class="groupTitle">'+groupsInfo[i].name+'</span>\
                                            <span class="glyphicon glyphicon-menu-right"></span>\
                                        </div>';
                        $(groupInfo).appendTo(this.$ctn);
                    }
                }else{
                    var thingsInfo = resultData.things;
                    for(var i=0,length=thingsInfo.length;i<length;i++){
                        var thingInfo = '<div class="thingInfo" data-id="'+thingsInfo[i]._id+'" data-type="'+thingsInfo[i].type+'" data-parentName="'+groupTitle+'">\
                                            <span class="thingTitle">'+thingsInfo[i].name+'</span>\
                                            <span class="glyphicon glyphicon-menu-right"></span>\
                                        </div>';
                        $(thingInfo).appendTo(this.$ctn);
                    }
                }
            }.bind(this));
        }

    };


    return listPanel;
})()
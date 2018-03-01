/**
 * Created by vicky on 2015/8/21.
 */

var ModalWiki = (function(){
    function ModalWiki(parent){
        this.parent = parent;
        this.$modal = undefined;
        this.$modalContent = undefined;
        this.searchWikis = {};
        this.isManager = false;//是否在wiki管理页面,
        this.managerWikis = {};

        var tempHtml = '\
            <div class="modal fade in" id="modalWikiConfig" role="dialog" aria-labelledby="templateType" aria-hidden="false">\
                <div class="modal-dialog">\
                    <div class="modal-content">\
                    </div>\
                </div>\
            </div>';
        $('body').append(tempHtml);
        this.$modal = $('#modalWikiConfig');
        this.$modalContent = this.$modal.find('.modal-content');
    }

    /* wiki manager start */
    ModalWiki.prototype.show = function(){
        var _this = this;
        WebAPI.get('/static/scripts/observer/widgets/modalWiki.html').done(function(resultHTML){
            $(ElScreenContainer).html(resultHTML);
            _this.init();
        });

    }

    ModalWiki.prototype.init = function(){
        var _this = this;
        var data = {projectIds: this.getProjectIds()};
        WebAPI.post('/getAllWiki', data).done(function (rlst) {
            if(rlst.length > 0){
                var $divWiki = $('.divWiki'), temp = '';
                for(var i = 0, wiki; i < rlst.length; i++){
                    wiki = rlst[i];
                    if(!_this.managerWikis[wiki.id]){
                        _this.managerWikis[wiki.id] = wiki;
                    }
                    temp += _this.tpl_wiki_mng.formatEL({
                        id: wiki.id,
                        title: wiki.title,
                        tagArr: _this.addTagOfKewWord(wiki.tagStrArr),
                        tagProjectArr: _this.addTagOfProject(wiki.tagProjectIdArr),
                        modifyTime: wiki.modifyTime
                    })
                }
                $divWiki.html(temp);

            }else{
                alert('There is no wiki currently, you can create wiki.')
            }
            _this.$wikiListPanel = $('#wikiListPanel');
            _this.isManager = true;
            _this.attachEvent();
        }).fail(function(){

        }).always(function(){

        });
    }

    ModalWiki.prototype.close = function(){
        this.parent = null;
        this.$modal = null;
        this.$modalContent = null;
        this.searchWikis = null;
        this.isManager = null;
        this.managerWikis = null;
    }

    ModalWiki.prototype.tpl_wiki_mng = '\
        <div class="row" id="{id}">\
            <div class="col-xs-3">{id}</div>\
            <div class="col-xs-2">{title}</div>\
            <div class="col-xs-2">{tagArr}</div>\
            <div class="col-xs-2">{tagProjectArr}</div>\
            <div class="col-xs-2">{modifyTime}</div>\
            <div class="col-xs-1 btns">\
                <span class="glyphicon glyphicon-remove grow" title="Delete"></span>\
                <span class="glyphicon glyphicon-edit grow" title="Edit"></span>\
            </div>\
        </div>';

    ModalWiki.prototype.attachEvent = function(){
        var _this = this;
        this.$wikiListPanel.find('#mngCreateWiki').off('click').on('click',function(e){
            e.stopPropagation();
            _this.showWikiCreate();
        });
        this.$wikiListPanel.on('click','.glyphicon-edit',function(e){
             e.stopPropagation();
            _this.showWikiEdit(_this.managerWikis[$(this).closest('.row').attr('id')]);
        });
        this.$wikiListPanel.on('click','.glyphicon-remove',function(e){
             e.stopPropagation();
            _this.removeWiki($(this).closest('.row').attr('id'));
        });
        this.$wikiListPanel.on('click','.row',function(e){
             e.stopPropagation();
            _this.showWikiDetail(_this.managerWikis[$(this).attr('id')]);
        });
    };

    ModalWiki.prototype.removeWiki = function (wikiId) {
        //TODO 测试confirm
        confirm('Delete this wiki ?', function () {
            WebAPI.get('/deleteWiki/' + wikiId).done(function (result) {
                $('#' + wikiId).remove();
            }).fail(function () {
                alert('delete failed !');
            });
        })
    };

    /* wiki manager end */

    ModalWiki.prototype.showWikiSearch = function(){
        var _this = this, $addWiki, $searchResultList, $configAlert;
        var tempHtml = '\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>\
                <h4 class="modal-title" id="" i18n="modalConfig.TITLE">Config Wiki</h4>\
            </div>\
            <div class="modal-body" id="">\
                <div class="bodyTop">\
                    <div class="">\
                        <div class="form-inline">\
                          <div class="form-group" style="width: 260px;">\
                            <label class="sr-only" for="wikiKeyWord"></label>\
                            <input type="text" class="form-control" id="wikiKeyWord" placeholder="Input Keyword" style="width: 100%;">\
                          </div>\
                          <div class="form-group">\
                            <label class="sr-only" for="wikiProject"></label>\
                            <select id="wikiProject" class="form-control">\
                            </select>\
                          </div>\
                          <button type="" class="btn btn-default" id="btnSearchWiki">Search</button>\
                        </div>\
                    </div>\
                </div>\
                <div class="bodyMiddle">\
                    <div class="searchResultCtn">\
                        <ul class="list-unstyled" id="searchResultList">\
                        </ul>\
                    </div>\
                </div>\
            </div>\
            <div class="modal-footer">\
                <div id="configAlert"></div>\
                <button type="button" class="btn btn-primary" id="addWiki" i18n="">Create</button>\
            </div>';

        this.$modalContent.html(tempHtml);
        this.$modalContent.find('#wikiProject').html(renderSelectProject())
        $addWiki = this.$modal.find('#addWiki');
        $searchResultList = this.$modal.find('#searchResultList');
        $configAlert = _this.$modalContent.find("#configAlert");
        //attach event
        $addWiki.off().on('click', function(e){
            e.stopPropagation();
            _this.showWikiCreate();
        });

        this.$modalContent.find('#btnSearchWiki').click(function(){
            var selectPrj = $('#wikiProject').val();
            var queryCondition = {
                keywords: $('#wikiKeyWord').val().split(' '),
                projectId: (selectPrj != '') ? new Array(selectPrj): _this.getProjectIds()
            }
            $searchResultList.empty();
            WebAPI.post('/getWikiByKeywordsAndProjectId', queryCondition).done(function (rslt) {
                var temp = '';
                var tpl_search = '<li wikiId="{id}"><span class="title">{title}</span><span class="keywordTags" title="Tag">{tagArr}</span><span class="projectTags" title="Project">{tagProjectArr}</span><span class="glyphicon glyphicon-link"></span></li>';
                if(rslt.length > 0){
                    for(var i = 0, wiki; i < rslt.length; i++){
                        wiki = rslt[i];
                        if(!_this.searchWikis[wiki.id]){
                            _this.searchWikis[wiki.id] = wiki;
                        }
                        //$searchResultList.append('<li wikiId="'+ wiki.id +'"><span class="">'+ wiki.title +'</span><span class="glyphicon glyphicon-link"></span></li>');
                        temp += tpl_search.formatEL({
                            id: wiki.id,
                            title: wiki.title,
                            tagArr: _this.addTagOfKewWord(wiki.tagStrArr),
                            tagProjectArr: _this.addTagOfProject(wiki.tagProjectIdArr)
                        })
                    }
                    $searchResultList.html(temp);
                }else{
                    $configAlert.parent().show();
                    var $tip = $('<span>There is no wiki match input,you can create a new wiki !</span>');
                    $configAlert.html($tip)
                    $tip.fadeOut(3000);
                }
            });
        });

        $searchResultList.off().on('click','li',function(e){
            e.stopPropagation();
            var wikiId = $(this).attr('wikiId');
            _this.showWikiDetail(_this.searchWikis[wikiId]);
            _this.$modalContent.find('.modal-footer').show();
            //绑定wiki
            _this.$modalContent.find('#confirm').off().on('click', function(){
                if(_this.parent.entity.modal.type == 'ModalPointKPI'){
                    _this.parent.kpiItem.wikiId = wikiId;
                    _this.parent.entity.modal.option.kpiList.forEach(function(kpiItem){
                        traverseTree(kpiItem);
                    })
                    _this.parent.parentArgt.screen.isScreenChange = true;
                }else{
                    _this.parent.entity.modal.wikiId = wikiId;
                    _this.parent.screen.isScreenChange = true;
                    $('#wikiId','#divContainer_' + _this.parent.entity.id).val(wikiId).hide().next('.chartTitleShow').show().html(wikiId);
                }
                $(this).addClass('disabled').html('Binding');

                function traverseTree(tree) {
                        traverse(tree, 0);
                }
                function traverse(node, i) {
                    var children = node.list;
                    if(node.id == _this.parent.kpiItem.id){
                        node.wikiId = wikiId;
                        return;
                    }
                    if (children != null && children.length > 0) {
                        if (i == children.length - 1) {
                            for(var j = 0; j < children.length; j++){
                                traverse(children[j], 0);
                            }
                        } else {
                            traverse(node, i + 1);
                        }
                    }
                }
            });
        });

        this.$modal.off('show.bs.modal').on('show.bs.modal', function (e) {

        });
        this.$modal.off('hidden.bs.modal').on('hidden.bs.modal', function () {

        });
        this.$modal.modal('show');

        function renderSelectProject(){
            var projectName = '', option = '',
            temp = '<option value="">Choose project(Optional)</option>';
            for(var i = 0; i < AppConfig.projectList.length; i++){
                var project = AppConfig.projectList[i];
                if(I18n.type == 'zh'){
                    projectName = project.name_cn;
                }else{
                    projectName = project.name_en;
                }
                option = '<option value="'+ AppConfig.projectList[i].id +'">'+ projectName +'</option>';
                temp += option;
            }
            return temp;
        }
    }

    ModalWiki.prototype.showWikiCreate = function(){
        var _this = this;
        var tempHtml = '\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>\
                <h4 class="modal-title" id="" i18n="">Create Wiki</h4>\
            </div>\
            <div class="modal-body" id="">\
                <div class="bodyTop">\
                    <div class="">\
                        <form class="form-horizontal">\
                            <div class="form-group">\
                                <label class="col-sm-1 control-label" for="wikiTitle">Title</label>\
                                <div class="col-sm-9"><input type="text" class="form-control" id="wikiTitle" placeholder="Input title"/></div>\
                            </div>\
                            <div class="form-group">\
                                <label class="col-sm-1 control-label" for="">Tag</label>\
                                <div class="col-sm-9">\
                                    <ul class="list-inline tagCtn" id="tagStr">\
                                        <li><span class="glyphicon glyphicon-remove-circle add"></span></li>\
                                    </ul>\
                                </div>\
                            </div>\
                            <div class="form-group">\
                                <label class="col-sm-1 control-label" for="">Project</label>\
                                <div class="col-sm-9">\
                                    <ul class="list-inline tagCtn" id="tagProject">\
                                        <li><span class="glyphicon glyphicon-remove-circle add"></span></li>\
                                    </ul>\
                                </div>\
                            </div>\
                        </form>\
                    </div>\
                </div>\
                <div class="bodyMiddle">\
                    <div id="wikiContentCtn">\
                        <label for="">Content</label>\
                        <hr style="position: absolute;width: calc(100% - 70px);right: 0;top: -8px;"/>\
                        <script id="ueditor" type="text/plain"></script>\
                    </div>\
                </div>\
            </div>\
            <div class="modal-footer">\
                <div id="configAlert"></div>\
                <button type="button" class="btn btn-primary" id="confirm" i18n="modalConfig.btnStartConfig.TYPE2">Confirm</button>\
            </div>';
        this.$modalContent = this.$modal.find('.modal-content');
        this.$modalContent.html(tempHtml);
        this.showUEditor();
        this.$modalContent.find('#confirm').off().on('click',function(e){
            e.stopPropagation();
            _this.createWiki();
        });
        this.$modalContent.find('#tagStr .add').off().on('click',function(e){
            e.stopPropagation();
            _this.addTagStr(this);
        });
        this.$modalContent.find('#tagProject .add').off().on('click',function(e){
            e.stopPropagation();
            _this.addTagProject(this);
        });
        this.$modalContent.on('click','.glyphicon.remove',function(){
            $(this).closest('li').remove();
        });
        this.$modal.modal('show');
    }

    ModalWiki.prototype.getWikiById = function(){
        var _this = this;
        var wiki = this.parent.parentArgt.wikis[this.parent.kpiItem.wikiId];
        if(wiki){
            _this.showWikiEdit(wiki);
        }else{
            WebAPI.get('/getWikiById/'+ this.parent.kpiItem.wikiId)
            .done(function(result){
                if(result.id){
                    _this.parent.parentArgt.wikis[result.id] = result;
                    _this.showWikiEdit(result);
                }else{
                    _this.showWikiSearch();
                }
            })
            .fail(function(result){
                alert(result)
            });
        }
    }

    ModalWiki.prototype.showWikiEdit = function(wiki){
        var _this = this, $tagStrAdd, $tagProjectAdd;
        var tempHtml = '\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>\
                <h4 class="modal-title" id="" i18n="">Edit Wiki\
                    <a id="btnChangeWiki" style="position: absolute;right: 150px;top: 18px;font-size:14px;" title="Change Wiki">Change</a>\
                    <a id="btnRemoveWiki" style="position: absolute;right: 80px;top: 18px;font-size:14px;" title="Unbind Wiki">Unbind</a>\
                </h4>\
            </div>\
            <div class="modal-body" id="">\
                <div class="bodyTop">\
                    <div class="">\
                        <form class="form-horizontal">\
                            <div class="form-group">\
                                <label class="col-sm-1 control-label" for="wikiTitle">Title</label>\
                                <div class="col-sm-9"><input type="text" class="form-control" id="wikiTitle" placeholder="Input title"/></div>\
                            </div>\
                            <div class="form-group">\
                                <label class="col-sm-1 control-label" for="">Tag</label>\
                                <div class="col-sm-9">\
                                    <ul class="list-inline tagCtn" id="tagStr">\
                                        <li><span class="glyphicon glyphicon-remove-circle add"></span></li>\
                                    </ul>\
                                </div>\
                            </div>\
                            <div class="form-group">\
                                <label class="col-sm-1 control-label" for="">Project</label>\
                                <div class="col-sm-9">\
                                    <ul class="list-inline tagCtn" id="tagProject">\
                                        <li><span class="glyphicon glyphicon-remove-circle add"></span></li>\
                                    </ul>\
                                </div>\
                            </div>\
                        </form>\
                    </div>\
                </div>\
                <div class="bodyMiddle">\
                    <div id="wikiContentCtn">\
                        <label for="">Content</label>\
                        <hr style="position: absolute;width: calc(100% - 70px);right: 0;top: -8px;"/>\
                        <script id="ueditor" type="text/plain"></script>\
                    </div>\
                </div>\
            </div>\
            <div class="modal-footer">\
                <div id="configAlert"></div>\
                <button type="button" class="btn btn-primary" id="confirm" i18n="modalConfig.btnStartConfig.TYPE2">Confirm</button>\
            </div>';
        this.$modalContent = this.$modal.find('.modal-content');
        this.$modalContent.html(tempHtml);

        $tagStrAdd = this.$modalContent.find('#tagStr li');
        $tagProjectAdd = this.$modalContent.find('#tagProject li');
        //$divWikiEditor = this.$modalContent.find('.divWikiEditor');
        //$editor = this.$modalContent.find('#editor').wysiwyg().html(wiki.content);
        this.showUEditor(wiki);
        if(this.isManager){
            this.$modalContent.find('#btnChangeWiki').hide();
            this.$modalContent.find('#btnRemoveWiki').hide();
        }
        this.$modalContent.find('#wikiTitle').val(wiki.title);
        (wiki.tagStrArr instanceof Array) && wiki.tagStrArr.forEach(function(tag){
            $tagStrAdd.before($('<li class="tagItem"><span class="tag">'+ tag +'</span><span class="glyphicon remove">&times;</span></li>'));
        });
        (wiki.tagProjectIdArr instanceof Array) && wiki.tagProjectIdArr.forEach(function(tag){
            var projectName = undefined;
            for(var i = 0; i < AppConfig.projectList.length; i++){
                if(AppConfig.projectList[i].id == tag){
                    if(I18n.type == 'zh'){
                        projectName = AppConfig.projectList[i].name_cn;
                    }else{
                        projectName = AppConfig.projectList[i].name_en;
                    }
                }
            }
            $tagProjectAdd.before($('<li class="tagItem"><span class="tag" projectId="'+ tag +'">'+ projectName +'</span><span class="glyphicon remove">&times;</span></li>'));
        });

        this.$modalContent.find('#editor').css({height: 'calc(100% - 88px)', width: 'calc(100% - 18px)'});

        this.$modalContent.find('#btnChangeWiki').off().on('click',function(e){
            _this.showWikiSearch();
        });
        this.$modalContent.find('#btnRemoveWiki').off().on('click',function(e){
            //TODO 测试confirm
            confirm('Are you sure to unbind this wiki ?', function () {
                if (_this.parent.entity.modal.type == 'ModalPointKPI') {
                    _this.parent.kpiItem.wikiId = '';
                    _this.parent.entity.modal.option.kpiList.forEach(function (kpiItem) {
                        traverseTree(kpiItem);
                    });
                    _this.parent.parentArgt.screen.isScreenChange = true;
                    function traverseTree(tree) {
                        traverse(tree, 0);
                    }

                    function traverse(node, i) {
                        var children = node.list;
                        if (node.id == _this.parent.kpiItem.id) {
                            node.wikiId = '';
                            return;
                        }
                        if (children != null && children.length > 0) {
                            if (i == children.length - 1) {
                                for (var j = 0; j < children.length; j++) {
                                    traverse(children[j], 0);
                                }
                            } else {
                                traverse(node, i + 1);
                            }
                        }
                    }
                } else {
                    _this.parent.entity.modal.wikiId = '';
                    _this.parent.screen.isScreenChange = true;
                    $('#wikiId', '#divContainer_' + _this.parent.entity.id).val('').show().next('.chartTitleShow').hide().html('');
                }
                _this.$modalContent.find('#configAlert').html('Unbind success !');

                setTimeout(function () {
                    _this.$modal.modal('hide');
                }, 1000);
            });
        });
        this.$modalContent.find('#tagStr .add').off().on('click',function(e){
            e.stopPropagation();
            _this.addTagStr(this);
        });
        this.$modalContent.find('#tagProject .add').off().on('click',function(e){
            e.stopPropagation();
            _this.addTagProject(this);
        });
        this.$modalContent.on('click','.glyphicon.remove',function(){
            $(this).closest('li').remove();
        });

        this.$modalContent.find('#confirm').off().on('click',function(){
            var tagStrArr = [], tagProjectIdArr = [];
            var title = _this.$modalContent.find('#wikiTitle').val();
            var content = _this.ue.getContent().replace(/_ueditor_page_break_tag_/,'<hr class="pagebreak" noshade="noshade" size="5" style="-webkit-user-select: none;">');
            if(title.trim() == ''){
                alert('Title is required !');
                return false;
            }
            if(content.trim() == ''){
                alert('Content is required !');
                return false;
            }
            _this.$modalContent.find('#tagStr .tag').each(function(){
                tagStrArr.push($.trim(this.innerHTML));
            });
            _this.$modalContent.find('#tagProject .tag').each(function(){
                tagProjectIdArr.push(parseInt($(this).attr('projectId')));
            });
            var newWiki = {
                id: wiki.id,
                modifierId: AppConfig.userId,
                title: title,
                content: content,
                tagStrArr: tagStrArr,
                tagProjectIdArr: tagProjectIdArr
            }
            WebAPI.post('/updateWiki', newWiki).done(function(result){
                if(_this.isManager){
                    _this.managerWikis[wiki.id] = newWiki;

                    $('#'+ newWiki.id).after(_this.tpl_wiki_mng.formatEL({
                        id: newWiki.id,
                        title: newWiki.title,
                        tagArr: _this.addTagOfKewWord(newWiki.tagStrArr),
                        tagProjectArr: _this.addTagOfProject(newWiki.tagProjectIdArr),
                        modifyTime: new Date().format('yyyy-MM-dd HH:mm')
                    }));
                    $('#'+ newWiki.id).remove();
                }else{
                    if(_this.parent.entity.modal.type == 'ModalPointKPI'){
                        _this.parent.parentArgt.screen.isScreenChange = true;
                        _this.parent.parentArgt.wikis[newWiki.id] = newWiki;
                    }else{
                        _this.parent.screen.isScreenChange = true;
                        _this.parent.wikis[newWiki.id] = newWiki;
                    }
                }
                _this.$modalContent.find('#configAlert').html('Modify success !');
                setTimeout(function(){
                    _this.$modal.modal('hide');
                }, 1000);
            }).fail(function(result){

            }).always(function(){
                _this.$modal.modal('show')
            });
        });
        this.$modal.modal('show');
    }

    ModalWiki.prototype.viewWikiInfo = function(wikiId){
        var _this = this, wiki;
        if(this.parent.entity.modal.type == 'ModalPointKPI'){
            wiki = this.parent.parentArgt.wikis[wikiId];
        }else{
            wiki = this.parent.wikis[wikiId]
        }
        if(wiki){
            _this.showWikiDetail(wiki);
        }else{
            WebAPI.get('/getWikiById/'+ wikiId)
            .done(function(result){
                if(result.id){
                    if(_this.parent.parentArgt){
                        _this.parent.parentArgt.wikis[result.id] = result
                    }else{
                        _this.parent.wikis[result.id] = result
                    }
                    _this.showWikiDetail(result);
                }else{
                    alert('The wiki may be have been removed, please bind a new wiki !');
                }
            })
            .fail(function(result){
                alert(result)
            });
        }
    }

    ModalWiki.prototype.showWikiDetail = function(wiki){
        var tempHtml = '\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>\
                <h4 class="modal-title" id="" i18n="">{title}</h4>\
            </div>\
            <div class="modal-body" id="">\
                <div class="bodyTop" style="display:none;">\
                    <div class="">\
                        <form class="form-horizontal">\
                            <div class="form-group">\
                                <label class="col-sm-1 control-label" for="">Tag</label>\
                                <div class="col-sm-9">\
                                    <ul class="list-inline tagCtn" id="tagStr">\
                                    </ul>\
                                </div>\
                            </div>\
                            <div class="form-group">\
                                <label class="col-sm-1 control-label" for="">Project</label>\
                                <div class="col-sm-9">\
                                    <ul class="list-inline tagCtn" id="tagProject">\
                                    </ul>\
                                </div>\
                            </div>\
                        </form>\
                    </div>\
                </div>\
                <div class="bodyMiddle">\
                    <div id="wikiContentCtn" style="position: relative; padding-top: 10px;">\
                        <label for="" style="display:none;">Content</label>\
                        <div id="divWikiContent" style="min-height: 180px;"></div>\
                    </div>\
                </div>\
            </div>\
            <div class="modal-footer" style="display: none;">\
                <div id="configAlert"></div>\
                <button type="button" class="btn btn-primary" id="confirm" i18n="">Bind</button>\
            </div>';

        this.$modalContent.html(tempHtml.formatEL(wiki));
        var $tagStrAdd = this.$modalContent.find('#tagStr');
        var $tagProjectAdd = this.$modalContent.find('#tagProject');
        this.$modalContent.find('#divWikiContent').html(wiki.content);

        var tempTagStr = '', tempTagProj = '';
        (wiki.tagStrArr instanceof Array) && wiki.tagStrArr.forEach(function(tag){
            tempTagStr += '<li class="tagItem"><span class="tag">'+ tag +'</span></li>';
        });
        $tagStrAdd.html(tempTagStr);
        (wiki.tagProjectIdArr instanceof Array) && wiki.tagProjectIdArr.forEach(function(tag){
            var projectName = undefined;
            for(var i = 0; i < AppConfig.projectList.length; i++){
                if(AppConfig.projectList[i].id == tag){
                    if(I18n.type == 'zh'){
                        projectName = AppConfig.projectList[i].name_cn;
                    }else{
                        projectName = AppConfig.projectList[i].name_en;
                    }
                }
            }
            tempTagProj = '<li class="tagItem"><span class="tag" projectId="'+ tag +'">'+ projectName +'</span></li>';
        });
        $tagProjectAdd.html(tempTagProj);
        this.$modal.modal('show');


    }

    //项目标签
    ModalWiki.prototype.addTagOfProject = function(arr){
        var str = '';
        if(arr instanceof Array){
            for(var i = 0; i < arr.length; i++){
                for(var j = 0; j < AppConfig.projectList.length; j++){
                    if(arr[i] == AppConfig.projectList[j].id){
                        if(I18n.type = 'zh'){
                            str += ('<span class="wikiTag">' + AppConfig.projectList[j].name_cn + '</span>');
                        }else{
                            str += ('<span class="wikiTag">' + AppConfig.projectList[j].name_en + '</span>');
                        }
                    }
                }
            }
        }
        return str;
    }

    //关键字标签
    ModalWiki.prototype.addTagOfKewWord = function(arr){
        var str = '';
        if(arr instanceof Array){
            for(var i = 0; i < arr.length; i++){
                str += ('<span class="wikiTag">' + arr[i] + '</span>');
            }
        }
        return str;
    }

    ModalWiki.prototype.createWiki = function(){
        var tagStrArr = [], tagProjectIdArr = [], _this = this;
        var title = this.$modalContent.find('#wikiTitle').val();
        var content = this.ue.getContent().replace(/_ueditor_page_break_tag_/,'<hr class="pagebreak" noshade="noshade" size="5" style="-webkit-user-select: none;">');
        this.$modalContent.find('#tagStr .tag').each(function(){
            tagStrArr.push($.trim(this.innerHTML));
        });
        this.$modalContent.find('#tagProject .tag').each(function(){
            tagProjectIdArr.push(parseInt($(this).attr('projectId')));
        });
        if(title.trim() == ''){
            alert('Title is required !');
            return false;
        }
        if(content.trim() == ''){
            alert('Content is required !');
            return false;
        }
        var wiki = {
            creatorId : AppConfig.userId,
            title : title,
            content : content,
            tagStrArr: tagStrArr,
            tagProjectIdArr: tagProjectIdArr,
            modifyTime: new Date().format('yyyy-MM-dd HH:mm')
        }
        //spin
        WebAPI.post('/createWiki', wiki).done(function (rslt) {
            if(rslt.wikiId){
                wiki.id = rslt.wikiId;
                if(_this.isManager){
                    _this.managerWikis[wiki.id] = wiki;

                    _this.$wikiListPanel.find('.divWiki').append(_this.tpl_wiki_mng.formatEL({
                        id: wiki.id,
                        title: wiki.title,
                        tagArr: _this.addTagOfKewWord(wiki.tagStrArr),
                        tagProjectArr: _this.addTagOfProject(wiki.tagProjectIdArr),
                        modifyTime: wiki.modifyTime
                    }))
                }else{
                    if(_this.parent.entity.modal.type == 'ModalPointKPI'){
                        _this.parent.kpiItem.wikiId = rslt.wikiId;
                        _this.parent.entity.modal.option.kpiList.forEach(function(kpiItem){
                            traverseTree(kpiItem);
                        });
                        _this.parent.parentArgt.screen.isScreenChange = true;
                    }else{
                        _this.parent.entity.modal.wikiId = rslt.wikiId;
                        _this.parent.wikis[rslt.wikiId] = wiki;
                        _this.parent.screen.isScreenChange = true;
                        $('#wikiId','#divContainer_' + _this.parent.entity.id).val(rslt.wikiId).hide().next('.chartTitleShow').show().html(rslt.wikiId);
                    }
                }
                _this.$modalContent.find('#configAlert').html('Create success !');
                setTimeout(function(){
                    _this.$modal.modal('hide');
                }, 1000);

                // modal disappear
                function traverseTree(tree) {
                    traverse(tree, 0);
                }
                function traverse(node, i) {
                    var children = node.list;
                    if(node.id == _this.parent.kpiItem.id){
                        node.wikiId = rslt.wikiId;
                        return;
                    }
                    if (children != null && children.length > 0) {
                        if (i == children.length - 1) {
                            for(var j = 0; j < children.length; j++){
                                traverse(children[j], 0);
                            }
                        } else {
                            traverse(node, i + 1);
                        }
                    }
                }
            }
        }).fail(function(){

        }).always(function(){

        });
    }

    ModalWiki.prototype.addTagStr = function(obj){
        if($('#tagStr input').length > 0) return;
        var $input = $('<input type="text"/>');
        $input.blur(function(){
            var inputTxt = $input.val();
            if($.trim(inputTxt) != ''){
                var $li = $('<li class="tagItem"><span class="tag">'+ inputTxt +'</span><span class="glyphicon remove">&times;</span></li>');
                $(obj.parentElement).prev().remove();
                $(obj.parentElement).before($li);
            }
        });
        $(obj.parentElement).before($input);
    }

    ModalWiki.prototype.addTagProject = function(obj){
        if($('#tagProject select').length > 0) return;
        var $select = $('<select class="">'), name;
        $select[0].options.add(new Option('Select a project', ''))
        for(var i = 0; i < AppConfig.projectList.length; i ++){
            var project = AppConfig.projectList[i];
            if(I18n.type == 'zh'){
                name = project.name_cn;
            }else{
                name = project.name_en;
            }
            $select[0].options.add(new Option(name, project.id))
        }
        $select.change(function(){
            var selectTxt = $select[0].options[$select[0].selectedIndex].text;
            var selectVal = $select.val();
            if(selectVal != ''){
                var $li = $('<li class="tagItem"><span class="tag" projectId="'+ selectVal +'">'+ selectTxt +'</span><span class="glyphicon remove">&times;</span></li>');
                $(obj.parentElement).prev().remove();
                $(obj.parentElement).before($li);
            }
        });
        $(obj.parentElement).before($select);
    }

    ModalWiki.prototype.getProjectIds = function(){
        var arrProjectId = [];
        for(var i = 0; i < AppConfig.projectList.length; i++){
            arrProjectId.push(AppConfig.projectList[i].id);
        }
        return arrProjectId;
    }

    ModalWiki.prototype.showUEditor = function(wiki){
        var _this = this;
        if(!this.ue){
            UE.delEditor('ueditor');
            this.ue = UE.getEditor('ueditor',{lang: (I18n.type == 'zh' ? 'zh-cn': 'en')});
            this.ue.ready(function(){
                UE.insertPic(this);//绑定插入图片事件
                //wiki && _this.ue.setContent(wiki.content);
                var bodyEditor = _this.ue.container.querySelector('iframe').contentWindow.document.querySelector('body');
                bodyEditor && (bodyEditor.innerHTML = wiki ? wiki.content : '');
            });
        }else{
            var ue = this.ue;
            $('#ueditor').replaceWith(this.ue.container.parentNode);
            this.ue.reset();
            setTimeout(function(){
                if(wiki){
                    //ue.setContent(wiki.content);
                    var bodyEditor = ue.container.querySelector('iframe').contentWindow.document.querySelector('body');
                    bodyEditor && (bodyEditor.innerHTML = wiki ? wiki.content : '');
                }else{
                    ue.setContent('');
                }
            },200)
        }
    }

    return ModalWiki;
})();

/// <reference path="../../../lib/jquery-1.11.1.min.js" />
var AnlzBase = (function () {
    var _this ;
    function AnlzBase(container, option, screen) {
        _this = this;
        this.container = container;
        this.options = option;
        this.screen = screen;
        this.paneChart = undefined;
        this.paneNotes = undefined;
        this.chart = undefined;
        this.noteCount = 0;
        this.chartAnimationDuration = 500;
        this.spinnerRender = new LoadingSpinner({ color: '#00FFFF' });
    }

    AnlzBase.prototype = {
        show: function () {
            this.initTools();
            this.container.innerHTML = '';

            this.paneNotes = $('<div style="position: relative; width: 100%; height: 100%;">')[0];
            $(this.container).append($('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">').append(this.paneNotes));
            if(!this.screen.curModal.noteList){
                this.screen.curModal.noteList = [];
            }else{
                _this.initNotes(this.screen.curModal.noteList);
            }

            $divBackgroundContainer = $('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">');
            if (!this.paneChart) {
                this.paneChart = $('<div style="width: 100%; height: 100%;">')[0];
                $(this.container).append($divBackgroundContainer).append(this.paneChart);
            }
            else {
                $(this.container).append($divBackgroundContainer);
            }
            _this.spinnerRender.spin(this.container);
            this.init();
        },
        renderModal: function (data) {
            _this = this;
            _this.render(data);
            setTimeout(function () {
                _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, _this.chart,$('#divWSPane .selected'),_this.screen.curModal,true]);
                _this.spinnerRender.stop();
            }, _this.chartAnimationDuration);
        },
        spinnerStop: function(){
            Spinner.stop();
            _this.spinnerRender.stop();
        },
        close: function () { },

        init: function () { },
        errAlert: function(err){
            var $dataAlert = $('#dataAlert');
            switch(err){
                case 'no data history':
                    new Alert($dataAlert, "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE6 + "</strong>").show().close();
                    break;
                case 'time':
                    new Alert($dataAlert, "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE7 + "</strong>").show().close();
                    break;
                case 'invalid time string':
                    new Alert($dataAlert, "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE8 + "</strong>").show().close();
                    break;
                default :
                    new Alert($dataAlert, "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE9 + "</strong>").show().close();
                    break;
            }
            setTimeout(function () {
                _this.screen.refreshPaneCenter(new AnalysisTemplate(_this.screen));
            }, 500);
        },
        //配置按钮
        initTools: function () {
            var _this = this;
            $('.itemTools .glyphicon-log-out').off('click').on('click',function() {
                _this.screen.refreshPaneCenter(new AnalysisTemplate(_this.screen));
                $('.divPage.selected').removeClass('selected');
                $('.itemTools .glyphicon-cog').off('click');
            });
            $('.itemTools .glyphicon-cog').off('click').on('click',function() {
                var optionTemplate = _this.screen.factoryIoC.getModel(_this.screen.curModal.type).prototype.optionTemplate;
                var data = [];
                for (var i = 0; i < _this.screen.curModal.itemDS.length; i++) {
                    data.push({});
                    data[i].dsType = _this.screen.curModal.itemDS[i].type;
                    data[i].dsId = _this.screen.curModal.itemDS[i].arrId;
                    data[i].dsName = [];
                    for (var j = 0; j < _this.screen.curModal.itemDS[i].arrId.length; j++) {
                        data[i].dsName.push(AppConfig.datasource.getDSItemById(_this.screen.curModal.itemDS[i].arrId[j]).alias);
                    }
                }
                var option = {};
                option = {
                    modeUsable: optionTemplate.chartConfig,
                    allDataNeed: (optionTemplate.templateParams.paraAnlysMode == 'all'),
                    rowDataType: optionTemplate.templateParams.paraName,
                    dataTypeMaxNum: optionTemplate.templateParams.dataTypeMaxNum,
                    templateType: _this.screen.curModal.type,
                    optionPara: {
                        mode: _this.screen.curModal.mode,
                        startTime: _this.screen.curModal.startTime,
                        endTime: _this.screen.curModal.endTime,
                        interval: _this.screen.curModal.format,
                        dataItem: data
                    }
                };
                _this.screen.modalConfig.showModalInit(false,option)
            });

            $('.itemTools .glyphicon-bookmark').off('click').click(function(){
                _this.createNote();
            });
        },

        createNote: function (note) {
            var origZIndex;
            this.noteDefaultWidth = 440;
            this.noteDefaultHeight = 220;
            var notePos = getDivNotePos();
            var $divNote = $('<div class="divNote">')
                .click(function(){
                    if($('.divNote').length > 1){
                        _this.curtNote = $divNote[0];
                        if(this.style.zIndex < _this.getNoteMaxZIndex()){
                            this.style.zIndex = _this.getNoteMaxZIndex() + 1;
                            origZIndex = this.style.zIndex;
                        }
                    }
                })
                .hover(function(e){
                    if(this.style.zIndex < _this.getNoteMaxZIndex()){
                        origZIndex = getComputedStyle(this).zIndex;
                        this.style.zIndex = _this.getNoteMaxZIndex() + 1;
                    }
                })
                .attr('id', note ? note.id : (new Date()).valueOf())
                .css({
                    zIndex: _this.getNoteMaxZIndex() + 1,
                    left: note ? note.x : 'auto',
                    right: note ? 'auto' : notePos.x + 'px',
                    top: note ? note.y : notePos.y,
                    width: note ? note.width : this.noteDefaultWidth + 'px',
                    height: note ? note.height : this.noteDefaultHeight + 'px'
                })
                .mousedown(_this.doDown)
                .mouseup(_this.doUp);

            var $divTitle = $('<div class="title">').appendTo($divNote);

            var panePos = getDomPosOffsetWindow(document.getElementById('paneContent'));
            $divTitle[0].draggable = true;

            $divTitle[0].ondragstart = function(e){
                this.dragParent = $(this).closest('.divNote');
                this.dragParent[0].style.width = getComputedStyle(this.dragParent[0]).width;
                this.lastOffset = { x: e.offsetX, y: e.offsetY };
            };

            $divTitle[0].ondragend = function(e){
                if(!this.dragParent){
                    return;
                }
                var note = {
                    id: this.dragParent.attr('id'),
                    x: ((this.dragParent.position().left/this.dragParent.offsetParent().width())*100).toFixed(2) + '%',
                    y: ((this.dragParent.position().top/this.dragParent.offsetParent().height())*100).toFixed(2) + '%'
                };
                _this.saveNote(note);
                this.dragParent = null;
            };
            $divTitle[0].ondrag = function(e){
                if(!this.dragParent){
                    return;
                }
                if(e.clientX > 0){
                    var isTop = e.clientY - panePos.top - 60 < 0;
                    var isLeft = e.clientX - panePos.left - this.dragParent[0].offsetWidth < 0;
                    if(isTop || isLeft){
                        if(isTop && !isLeft){
                            this.dragParent.css({
                                top: 0,
                                left: e.clientX - panePos.left - this.dragParent[0].offsetWidth,
                                width: this.dragParent[0].style.width
                            });
                        }
                        if(!isTop &&isLeft){
                            this.dragParent.css({
                                top: e.clientY - panePos.top - 60,
                                left: 0,
                                width: this.dragParent[0].style.width
                            });
                        }
                        if(isTop && isLeft){
                            this.dragParent.css({
                                top: 0,
                                left: 0,
                                width: this.dragParent[0].style.width
                            });
                        }
                    }else{
                        this.dragParent.css({
                            top: e.clientY - panePos.top - 60,
                            left: e.clientX - panePos.left - this.dragParent[0].offsetWidth,
                            width: this.dragParent[0].style.width
                        });
                    }
                    if(this.dragParent.offsetParent()[0].offsetWidth - this.dragParent[0].offsetLeft - this.dragParent[0].offsetWidth < 0) {
                        this.dragParent.css({
                            left: 'auto',
                            right: 0,
                            width: this.dragParent[0].style.width
                        });
                    }
                    if(this.dragParent.offsetParent()[0].offsetHeight - this.dragParent[0].offsetTop - this.dragParent[0].offsetHeight < 0) {
                        this.dragParent.css({
                            top: 'auto',
                            bottom: 0,
                            width: this.dragParent[0].style.width
                        });
                    }
                }

            }

            var $divPin = $('<div class="glyphicon glyphicon-pushpin pinIcon grow">').appendTo($divTitle);
            $divPin.click(function(){
                _this.removeNote(this);
            });

            var $divText = $('<div class="divText">').appendTo($divNote);

            $divText.click(function (e) {
                var thisDiv = this;
                var strTemp = this.textContent;
                this.style.display = 'none';
                var $editor = $divNote.find('.divTextEditor');
                if($editor.length == 0){
                    $divNote.append($(getToolbar()));
                    var $divTextEditor = $('<div class="divTextEditor"/>')
                        .keydown(function () {
                            if (event.keyCode == 13) {
                                saveText(this,strTemp);
                            }
                        })
                        .appendTo($divNote)
                        .focus(function(){
                            $divNote.find('.btn-toolbar').slideDown('1000');
                            $divNote.find('.divTextEditor').addClass('editing')
                            _this.curtNote = $divNote[0];
                            $divNote.find('.divTextEditor').show();
                            $(thisDiv).hide();
                        })
                        .wysiwyg();
                    $divTextEditor.show().focus().html(note ? note.text : '');
                }else{
                    $editor.show().focus();
                }


                function saveText(obj,strTemp){
                    if($.trim(obj.value) != $.trim(strTemp)){
                        var note = {
                            id: $(obj).closest('.divNote').attr('id'),
                            text: obj.value
                        }
                        _this.saveNote(note)
                    }
                }
                function getToolbar(){
                    var btnHtml = '<div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor" style="display:none;"> \
                    <div class="btn-group"> \
                    <a class="btn dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Font"><i class="icon-font"></i><b class="caret"></b></a> \
                      <ul class="dropdown-menu"> \
                      <li><a data-edit="fontName Serif" style="font-family:\'Serif\'">Serif</a></li><li><a data-edit="fontName Sans" style="font-family:\'Sans\'">Sans</a></li><li><a data-edit="fontName Arial" style="font-family:\'Arial\'">Arial</a></li><li><a data-edit="fontName Arial Black" style="font-family:\'Arial Black\'">Arial Black</a></li><li><a data-edit="fontName Courier" style="font-family:\'Courier\'">Courier</a></li><li><a data-edit="fontName Courier New" style="font-family:\'Courier New\'">Courier New</a></li><li><a data-edit="fontName Comic Sans MS" style="font-family:\'Comic Sans MS\'">Comic Sans MS</a></li><li><a data-edit="fontName Helvetica" style="font-family:\'Helvetica\'">Helvetica</a></li><li><a data-edit="fontName Impact" style="font-family:\'Impact\'">Impact</a></li><li><a data-edit="fontName Lucida Grande" style="font-family:\'Lucida Grande\'">Lucida Grande</a></li><li><a data-edit="fontName Lucida Sans" style="font-family:\'Lucida Sans\'">Lucida Sans</a></li><li><a data-edit="fontName Tahoma" style="font-family:\'Tahoma\'">Tahoma</a></li><li><a data-edit="fontName Times" style="font-family:\'Times\'">Times</a></li><li><a data-edit="fontName Times New Roman" style="font-family:\'Times New Roman\'">Times New Roman</a></li><li><a data-edit="fontName Verdana" style="font-family:\'Verdana\'">Verdana</a></li></ul> \
                    </div> \
                  <div class="btn-group"> \
                    <a class="btn dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Font Size"><i class="icon-text-height"></i>&nbsp;<b class="caret"></b></a> \
                      <ul class="dropdown-menu"> \
                      <li><a data-edit="fontSize 5"><font size="5">Huge</font></a></li> \
                      <li><a data-edit="fontSize 3"><font size="3">Normal</font></a></li> \
                      <li><a data-edit="fontSize 1"><font size="1">Small</font></a></li> \
                      </ul> \
                  </div> \
                  <div class="btn-group"> \
                    <a class="btn" data-edit="bold" title="" data-original-title="Bold (Ctrl/Cmd+B)"><i class="icon-bold"></i></a>\
                    <a class="btn" data-edit="italic" title="" data-original-title="Italic (Ctrl/Cmd+I)"><i class="icon-italic"></i></a>\
                    <a class="btn" data-edit="strikethrough" title="" data-original-title="Strikethrough"><i class="icon-strikethrough"></i></a>\
                    <a class="btn" data-edit="underline" title="" data-original-title="Underline (Ctrl/Cmd+U)"><i class="icon-underline"></i></a>\
                  </div>\
                  <div class="btn-group">\
                    <a class="btn" data-edit="insertunorderedlist" title="" data-original-title="Bullet list"><i class="icon-list-ul"></i></a>\
                    <a class="btn" data-edit="insertorderedlist" title="" data-original-title="Number list"><i class="icon-list-ol"></i></a>\
                    <a class="btn" data-edit="outdent" title="" data-original-title="Reduce indent (Shift+Tab)"><i class="icon-indent-left"></i></a>\
                    <a class="btn" data-edit="indent" title="" data-original-title="Indent (Tab)"><i class="icon-indent-right"></i></a>\
                  </div>\
                  <div class="btn-group">\
                    <a class="btn btn-info" data-edit="justifyleft" title="" data-original-title="Align Left (Ctrl/Cmd+L)"><i class="icon-align-left"></i></a>\
                    <a class="btn" data-edit="justifycenter" title="" data-original-title="Center (Ctrl/Cmd+E)"><i class="icon-align-center"></i></a>\
                    <a class="btn" data-edit="justifyright" title="" data-original-title="Align Right (Ctrl/Cmd+R)"><i class="icon-align-right"></i></a>\
                    <a class="btn" data-edit="justifyfull" title="" data-original-title="Justify (Ctrl/Cmd+J)"><i class="icon-align-justify"></i></a>\
                  </div>\
                  <div class="btn-group">\
                      <a class="btn dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Hyperlink"><i class="icon-link"></i></a>\
                        <div class="dropdown-menu input-append">\
                            <input class="span2" placeholder="URL" type="text" data-edit="createLink">\
                            <button class="btn" type="button">Add</button>\
                    </div>\
                    <a class="btn" data-edit="unlink" title="" data-original-title="Remove Hyperlink"><i class="icon-cut"></i></a>\
                  </div>\
                  <div class="btn-group">\
                    <a class="btn" title="" id="pictureBtn" data-original-title="Insert picture (or just drag &amp; drop)"><i class="icon-picture"></i></a>\
                    <input type="file" data-role="magic-overlay" data-target="#pictureBtn" data-edit="insertImage" style="opacity: 0; position: absolute; top: 0px; left: 0px; width: 41px; height: 30px;">\
                  </div>\
                  <div class="btn-group">\
                    <a class="btn" data-edit="undo" title="" data-original-title="Undo (Ctrl/Cmd+Z)"><i class="icon-undo"></i></a>\
                    <a class="btn" data-edit="redo" title="" data-original-title="Redo (Ctrl/Cmd+Y)"><i class="icon-repeat"></i></a>\
                  </div>\
                  <input type="text" data-edit="inserttext" id="voiceBtn" x-webkit-speech="" style="display: none;">\
                </div>';
                    return btnHtml;
                }
            });
            $divText.html(note ? note.text : '');
            $(this.paneNotes).append($divNote);

            /*if(!note){
                var note = {
                    id: $divNote.attr('id'),
                    x: (($divNote.position().left/$divNote.offsetParent().width())*100).toFixed(2) + '%',
                    y: (($divNote.position().top/$divNote.offsetParent().height())*100).toFixed(2) + '%',
                    height: this.noteDefaultHeight +'px',
                    width: this.noteDefaultWidth + 'px',
                    text: $divNote.find('.divTextEditor').html()
                };
                _this.screen.curModal.noteList.push(note);
                //_this.saveNote(note);
            }*/

            $(document).on('click','#st-container',_this.doClick);
            $(document).on('mousemove','#st-container',_this.doMove);

            function getDivNotePos(){
                var pos = {}
                var $lastNote = $('.divNote:nth-last-child(1)');

                if($lastNote[0]){
                    if($lastNote[0].offsetLeft < 100){
                        pos.x = 0;
                        pos.y = $lastNote[0].offsetTop + $lastNote[0].offsetHeight + 20;
                        _this.noteCount = 0;
                    }else{
                        ++_this.noteCount;
                        pos.x = _this.noteCount * 130;
                        pos.y = $lastNote[0].offsetTop;
                    }
                }else{
                    pos.x = 0;
                    pos.y = 0;
                }
                return pos;
            }

            function getDomPosOffsetWindow(el){
                var _x = 0, _y = 0;
                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return { top: _y, left: _x };
            }
        },

        removeNote: function (obj) {
            if(confirm(i18n_resource.analysis.workspace.CONFIRM_NOTE_DELETE)){
                var $divNote = $(obj).closest('.divNote');
                $divNote.remove();
                var index = _this.getNoteListIndex($divNote.attr('id'));
                if(index != undefined){
                    _this.screen.curModal.noteList.splice(index,1);
                    _this.screen.saveModal();
                    _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, _this.chart,$('#divWSPane .selected'),_this.screen.curModal,true]);
                }
            }
        },

        initNotes: function (notes) {
            if(notes.length > 0){
                for(var i = 0; i < notes.length; i++){
                    _this.createNote(notes[i]);
                }
            }
        },

        hideNotes: function () {
        },

        showNotes: function () {
        },

        getNoteMaxZIndex: function(){
            var divNoteList = $('.divNote');
            var maxZIndex = 1;
            for(var i = 0; i < divNoteList.length; i++){
                var zIndex = parseInt(getComputedStyle(divNoteList[i]).zIndex);
                if(zIndex > maxZIndex){
                    maxZIndex = zIndex;
                }
            }
            return maxZIndex;
        },

        getNoteListIndex: function(id){
            for(var i = 0; i < _this.screen.curModal.noteList.length; i++){
                if(_this.screen.curModal.noteList[i].id == id){
                    return i;
                }
            }
        },

        //resize
        resizeObject: function() {
            this.el        = null;
            this.dir    = "";      //type of current resize (n, s, e, w, ne, nw, se, sw)
            this.grabx = null;
            this.graby = null;
            this.width = null;
            this.height = null;
            this.left = null;
            this.top = null;
        },

        getDirection:function(el) {
             var xPos, yPos, offset, dir;
             dir = "";

             xPos = window.event.offsetX;
             yPos = window.event.offsetY;

             offset = 8;
             if (yPos<offset) dir += "n";
             else if (yPos > el.offsetHeight-offset) dir += "s";
             if (xPos<offset) dir += "w";
             else if (xPos > el.offsetWidth-offset) dir += "e";

             return dir;
        },

        doDown:function() {
            if(this.style.cursor.indexOf('-resize') > -1){
                $('.divTextEditor').blur();
                var el = _this.getReal(event.srcElement, "className", "divNote");
                 if (el == null) {
                     _this.theobject = null;
                     return;
                 }

                if(el.className && el.className.indexOf('divNote') < 0) return;

                _this.dir = _this.getDirection(el);
                 if (_this.dir == "") return;

                 _this.leftObject = new _this.resizeObject();

                 _this.leftObject.el = el;
                 _this.leftObject.dir = _this.dir;

                 _this.leftObject.grabx = window.event.clientX;
                 _this.leftObject.graby = window.event.clientY;
                 _this.leftObject.width = el.offsetWidth;
                 _this.leftObject.height = el.offsetHeight;
                 _this.leftObject.left = el.offsetLeft;
                 _this.leftObject.top = el.offsetTop;

                 window.event.returnValue = false;
                 window.event.cancelBubble = true;
            }
        },

        doUp:function(e) {
            if(e.target.classList.contains('pinIcon')) return;
            if (_this.leftObject != null) {
                var note = {
                    id: _this.leftObject.el.id,
                    width: _this.leftObject.el.style.width,
                    height: _this.leftObject.el.style.height
                }
                _this.saveNote(note);
                _this.leftObject = null;
            }
        },

        doMove:function(e) {
            var el, str, xMin, yMin;
            xMin = _this.noteDefaultWidth; //The smallest width possible
            yMin = _this.noteDefaultHeight-60; //             height

            el = _this.getReal(event.srcElement, "className", "divNote");
            if(!el) return;
            if (el.className && typeof(el.className) == 'string' && el.className.indexOf("divNote" ) > -1 ) {
                str = _this.getDirection(el);
                //Fix the cursor
                if (str == "") str = "default";
                else str += "-resize";
                el.style.cursor = str;
            }

            //Dragging starts here
             if(_this.leftObject != null) {
                  if (_this.dir.indexOf("e") != -1)
                   _this.leftObject.el.style.width = Math.max(xMin, _this.leftObject.width + window.event.clientX - _this.leftObject.grabx) + "px";

                  if (_this.dir.indexOf("s") != -1)
                   _this.leftObject.el.style.height = Math.max(yMin, _this.leftObject.height + window.event.clientY - _this.leftObject.graby) + "px";

                  if (_this.dir.indexOf("w") != -1) {
                   _this.leftObject.el.style.left = Math.min(_this.leftObject.left + window.event.clientX - _this.leftObject.grabx, _this.leftObject.left + _this.leftObject.width - xMin) + "px";
                   _this.leftObject.el.style.width = Math.max(xMin, _this.leftObject.width - window.event.clientX + _this.leftObject.grabx) + "px";
                  }
                  if (_this.dir.indexOf("n") != -1) {
                   _this.leftObject.el.style.top = Math.min(_this.leftObject.top + window.event.clientY - _this.leftObject.graby, _this.leftObject.top + _this.leftObject.height - yMin) + "px";
                   _this.leftObject.el.style.height = Math.max(yMin, _this.leftObject.height - window.event.clientY + _this.leftObject.graby) + "px";
                  }

                  window.event.returnValue = false;
                  window.event.cancelBubble = true;
             }
        },

        doClick:function(e){
            if (!_this.screen || !_this.screen.curModal)return;

            if(_this.curtNote){
                if(e.target.classList.contains('pinIcon')) return;

                if(e.target == _this.curtNote || $(e.target).closest('.divNote')[0] == _this.curtNote){
                    _this.curtNote.style.zIndex = _this.getNoteMaxZIndex() + 1;
                }else{
                    var $thisEditor = $(_this.curtNote).find('.divTextEditor');
                    $(_this.curtNote).find('.btn-toolbar').slideUp('1000',function(){
                        $thisEditor.hide();
                        $(_this.curtNote).find('.divText').html($thisEditor.html()).show();
                    });
                    $thisEditor.removeClass('editing');

                    var id = $(_this.curtNote).attr('id');
                    var index = _this.getNoteListIndex(id);

                    var note = {
                        id: id,
                        text: $(_this.curtNote).find('.divTextEditor').html(),
                        width: $(_this.curtNote).css('width'),
                        height: $(_this.curtNote).css('height')
                    }
                    _this.saveNote(note)
                }
            }
        },

        getReal:function(el, type, value) {
            var temp = el;
            while ((temp != null) && (temp.tagName != "BODY")) {
                 if (eval("temp." + type) == value) {
                      el = temp;
                      return el;
                 }
                 temp = temp.parentElement;
             }
             return el;
        },

        saveNote:function(note){
            var id = note.id;
            var isSave = false
            if (_this.screen.curModal.noteList == undefined)return;
            var index = _this.getNoteListIndex(id);
            if(index == undefined){
                if(!note.text || $.trim(note.text.length) == 0) return;
                var $divNote = $('#'+id);
                var pos = $divNote.position();
                var note = {
                     id: id,
                     x: ((pos.left/$divNote.offsetParent().width())*100).toFixed(2) + '%',
                     y: ((pos.top/$divNote.offsetParent().height)*100).toFixed(2) + '%',
                     width: note.width,
                     height: note.height,
                     text: note.text
                 }
                _this.screen.curModal.noteList.push(note);
                doSave();
            }else{
                var note_old = _this.screen.curModal.noteList[index];
                if(note.x && note.x != note_old.x){
                     isSave = true
                }
                if(!isSave && note.y && note.y != note_old.y){
                     isSave = true
                }
                if(!isSave && note.width && note.width != note_old.width){
                     isSave = true
                }
                if(!isSave && note.height && note.height != note_old.height){
                     isSave = true
                }
                if(!isSave && note.text && note.text != note_old.text){
                     isSave = true
                }
                if(isSave){
                    _this.screen.curModal.noteList[index] = {
                         id: id,
                         x: note.x ? note.x :note_old.x,
                         y: note.y ? note.y : note_old.y,
                         width: note.width ? note.width : note_old.width,
                         height: note.height ? note.height : note_old.height,
                         text: note.text ? note.text : note_old.text
                     }
                    doSave();
                }
            }

            function doSave(){
                 _this.screen.saveModal();
                 _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, _this.chart,$('#divWSPane .selected'),_this.screen.curModal,true]);
            }
        }
    };

    return AnlzBase;
})();
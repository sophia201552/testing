/**
 * Created by vicky on 2015/12/16.
 * 编辑相关控件内容,比如:HTMLContainer, HTMLText
 */
(function(win){
    var _this = undefined;
    var ue = undefined;
    function EditorModal(){
        _this = this;
        this.htmlContent = undefined;
        this.$editorModal = undefined;
        this.callback = undefined;
    };

    EditorModal.prototype.show = function(htmlContent,callback){
        this.htmlContent = htmlContent;
        this.callback = callback;
        if($('#editorModal').length === 0){
            WebAPI.get('/static/app/WebFactory/scripts/modals/editorModal/editorModal.html').done(function (resultHTML) {
                $('#mainframe').append(resultHTML);
                _this.$editorModal = $('#editorModal');
                _this.init();
            })
        }else{
            this.init();
        }
    };

    EditorModal.prototype.init = function(){
        this.$editorModal.show();
        if(!ue){
            ue = UE.getEditor('ueditor',{lang: (I18n.type == 'zh' ? 'zh-cn': 'en')});
            ue.ready(function(){
                //设置内容
                UE.insertPic(this);
                ue.setContent(_this.htmlContent ? _this.htmlContent : '');
                $('.btnWrap').show();
            });
            this.attachEvent();
        }else{
            ue.reset();
            ue.setContent(_this.htmlContent ? _this.htmlContent : '');
            ue.setShow();
            $('.btnWrap').show();
        }
    };

    EditorModal.prototype.close = function(){
        ue.destory();
        this.$editorModal.remove();
    };

    EditorModal.prototype.attachEvent = function(){
        $('#btnSaveContent', this.$editorModal)[0].onclick = function(){
            _this.callback(ue.getContent());
            ue.setHide();
            $('.btnWrap').hide();
            $('#closeEditorModel').trigger('click');
        }

        $('#btnCancelEdit', this.$editorModal)[0].onclick = function(){
            ue.setHide();
            $('.btnWrap').hide();
            $('#closeEditorModel').trigger('click');
        }

        $('#closeEditorModel', this.$editorModal)[0].onclick = function(){
            _this.$editorModal.hide();
        }
    };

    win.EditorModal = new EditorModal();
}(window))
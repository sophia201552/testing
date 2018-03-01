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
        this.$wrap = undefined;
        this.callback = undefined;
        this.showEditor = undefined;
    };

    EditorModal.prototype.show = function (htmlContent, showEditor, callback) {
        this.htmlContent = htmlContent;
        this.callback = callback;
        this.showEditor = showEditor;
        if($('#editorModal').length === 0){
            WebAPI.get('/static/app/WebFactory/scripts/screens/page/modals/editorModal/editorModal.html').done(function (resultHTML) {
                $('#mainframe').parent().append(resultHTML);
                _this.$wrap = $('#editorModalWrap');
                _this.$editorModal = $('#editorModal', _this.$wrap);
                _this.init();
                _this.$editorModal.modal('show');
                _this.$editorModal.on('hidden.bs.modal',function(){
                    //_this.close();
                });
            })
        }else{
            this.init();
            _this.$editorModal.modal('show');
            _this.$editorModal.on('hidden.bs.modal',function(){
                //_this.close();
            });
        }
    };

    EditorModal.prototype.init = function () {
        var $ueditorWrap = _this.$editorModal.find('.ueditorWrap');
        var $textareaWrap = _this.$editorModal.find('.textareaWrap');
        if (_this.showEditor === true) {
            $ueditorWrap.show();
            $textareaWrap.hide();
            this.$editorModal.show();
            if (!ue) {
                ue = UE.getEditor('ueditor', { lang: (I18n.type == 'zh' ? 'zh-cn' : 'en') });
                ue.ready(function () {
                    //设置内容
                    UE.insertPic(this);
                    ue.setContent(_this.htmlContent ? _this.htmlContent : '');
                    if (_this.htmlContent && _this.htmlContent == '请此处输入文本') {
                        ue.execCommand('selectall')
                    }
                    $('.btnWrap').show();
                });
                this.attachEvent();
            } else {
                ue.reset();
                ue.setContent(_this.htmlContent ? _this.htmlContent : '');

                if (_this.htmlContent && _this.htmlContent == '请此处输入文本') {
                    ue.execCommand('selectall')
                }
                $('.btnWrap').show();
            }
        } else {
            $ueditorWrap.hide();
            $textareaWrap.show();
            _this.$editorModal.find('.textareaCon').val('');
            _this.$editorModal.find('.textareaCon').val(_this.htmlContent ? _this.htmlContent : '');
            this.attachEvent();
        }
    };

    EditorModal.prototype.close = function(){
        ue.destory();
        this.$wrap.remove();
    };

    EditorModal.prototype.attachEvent = function () {
        $('#btnSaveContent', this.$editorModal)[0].onclick = function () {
            var newContent = _this.showEditor ? ue.getContent() : _this.$editorModal.find('.textareaCon').val();
            //_this.callback(newContent);//ue.getContent()
            if (!_this.callback(newContent)) {
                _this.$editorModal.modal('hide');
            } 
        }

        $('#btnCancelEdit', this.$editorModal)[0].onclick = function(){
            _this.$editorModal.modal('hide');
        }
    };

    win.EditorModal = new EditorModal();
}(window));
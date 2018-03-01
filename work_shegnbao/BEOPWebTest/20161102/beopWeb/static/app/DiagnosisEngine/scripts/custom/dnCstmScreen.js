/**
 * Created by vicky on 2016/5/23.
 * 诊断自定义
 */
var DnCstmScreen = (function(){
    var _this = undefined;
    function DnCstmScreen(params){// params 实例化自定义诊断对象的相关参数
        this.codemirror = undefined;
        this.params = params;
        _this = this;
        AppConfig.module = 'customAlgorithm';
    }
    DnCstmScreen.prototype = {
        show:function(){
            WebAPI.get('/static/app/DiagnosisEngine/views/custom/dnCstmScreen.html').done(function(resultHTML){
                PanelToggle.panelCenter.innerHTML = resultHTML;
                PanelToggle.toggle({
                    left: {
                        show:true
                    },
                    center:{
                        show:true
                    },
                    right:{
                        show:false
                    }
                });
                _this.init();
            })
        },
        init:function(){
            //初始化codemirror
            this.dCodeEditor = document.getElementById('dCodeEditor')
            this.codemirror = CodeMirror(this.dCodeEditor,{
                mode:  "python",
                lineNumbers: true,
                autofocus: true
            });

            TemplateTree.setOpt({
                click:{
                    'customAlgorithm':function(e,treeNode){
                            _this.getAlgorithmByIds(treeNode);
                    }
                }
            });
            //默认显示第一个
            if(TemplateTree.tree.getNodes().length > 0){
                this.getAlgorithmByIds(TemplateTree.tree.getNodes()[0]);
            }

            document.getElementById('btnSaveAlgorithm').onclick = this.saveAlgorithm;
        },
        onresize:function(){
            PanelToggle.onresize();
        },
        close:function(){

        },
        getAlgorithmByIds: function(treeNode){
            Spinner.spin(_this.dCodeEditor);
            var deviceNm = treeNode.name;
            WebAPI.post('/diagnosisEngine/getAlgorithmByIds',{data: [AppConfig.projectId]}).done(function(result){
                if(result && result.data && result.data.length > 0){
                    $('#crtDevice').html(deviceNm);
                    _this.codemirror.doc.setValue(result.data[0].content);
                    _this.codemirror.algorithmId = result.data[0]._id;
                }else{
                    _this.codemirror.doc.setValue('');
                    _this.codemirror.algorithmId = '';
                }
            }).fail(function(){

            }).always(function(){
                Spinner.stop();
            });
        },
        saveAlgorithm: function(){
            var postData = {
                'creatorId': AppConfig.userId,             //创建者ID
                'timeLastModify': new Date().format('yyyy-MM-dd HH:mm:ss'),       //最后修改时间
                'content': _this.codemirror.doc.getValue(),              //算法内容，为python代码段，可为空
                'src': '',                  //远程算法地址，为空则取content内容, 暂时都为空
                'status': 1
            }
            //'_id': ObjectId(''),        //编号   (有ID为update,无ID为insert)
            if(_this.codemirror.algorithmId){
                postData._id = _this.codemirror.algorithmId;
            }
            WebAPI.post('/diagnosisEngine/saveAlgorithm', {data: ''}).done(function(){
                alert('Save success',{delay: 1000});
            }).fail(function(){
                alert('Save failed',{delay: 1000});
            }).always(function(){

            });
        }
    };
    return DnCstmScreen;
})();
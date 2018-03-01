/**
 * Created by win7 on 2016/7/7.
 */
class BaseFooterWidget extends BaseConfigWidget{
    constructor (objModal,widget,area){
        super(objModal,widget,area);
    }
    setWidget(){
        this.widget.dom = document.createElement('div');
        this.widget.dom.className = 'cfgWidget cfgFooterWidget div' + this.upperCaseText(this.widget.type);
        this.widget.dom.setAttribute('type',this.widget.type);
        this.initWidgetLabel();
        this.initWidgetAttr();
        this.initWidgetStyle();
        this.initWidgetId();
        this.widget.dom.appendChild(this.createWidgetDom(this.widget.opt));
        this.area.dom.appendChild(this.widget.dom);
    }
}

class ConfirmFooter extends BaseFooterWidget{
    constructor (objModal,widget,area){
        super(objModal,widget,area);
        this.defaultOpt = {
            type:'confirm',
            name:I18n.resource.modalConfig.data.PT_COG_SURE,
            opt:{
                needLabel:false
            }
        }
    }

    createWidgetDom(opt){
        var btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn btn-primary btnConfirm';
        btnConfirm.textContent = this.widget.name;
        return btnConfirm;
    }

    setData(data){
        this.store = data;
    }

    attachEvent(){
        if (typeof this.widget.func == 'function'){
            var _this = this;
            this.widget.dom.onclick = function(e){
                var result = _this.objModal.getResult();
                _this.widget.func(result,_this.objModal.opt.data)
            }
        }
    }
}

class CancelFooter extends BaseFooterWidget{
    constructor (objModal,widget,area){
        super(objModal,widget,area);
        this.defaultOpt = {
            type:'cancel',
            name:I18n.resource.modalConfig.data.PT_COG_CANCEL,
            opt:{
                needLabel:false
            }
        }
    }


    createWidgetDom(opt){
        var btnCancel = document.createElement('button');
        btnCancel.className = 'btn btn-default btnCancel';
        btnCancel.textContent = this.widget.name;
        btnCancel.dataset.dismiss = 'modal';
        return btnCancel;
    }

    attachEvent(){
        var _this = this;
        if (typeof this.widget.func == 'function'){
            this.widget.dom.onclick = function(e){
                _this.widget.func(e)
            }
        }else{
            this.widget.dom.onclick = function(e){
                _this.objModal.hide();
            }
        }
    }
}
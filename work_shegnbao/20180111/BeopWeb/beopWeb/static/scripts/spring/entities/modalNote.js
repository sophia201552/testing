/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalNote = (function(){
    function ModalNote(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalNote.prototype = new ModalBase();
    ModalNote.prototype.optionTemplate = {
        name:'toolBox.modal.NOTE',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 30,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalNote',
        tooltip: {
            'imgPC': false,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalNote.prototype.show = function(){
        this.init();
    }

    ModalNote.prototype.init = function(){

    }

    ModalNote.prototype.renderModal = function (e) {
        this.spinner && this.spinner.stop();
        if(!this.entity.modal.modalText) return;
        var temp = this.entity.modal.modalText;
        temp = temp.replace(/&lt;%\S+\.*\S+%&gt;/g,'--');
        this.container.style.padding = '8px';
        this.container.innerHTML = temp;
    }

    ModalNote.prototype.showConfigMode = function () {
    }
    ModalNote.prototype.updateModal = function (points) {
        var arrId = [];
        for(var i = 0; i < points.length; i++){
            var data = points[i].data;
            if(!isNaN(data)){
                data = parseFloat(data).toFixed(2);
            }else if(['Null', 'null', 'undefined'].indexOf(data) > -1){
                data = '--'
            }
            var $target = $('#divContainer_' + this.entity.id).find('#'+points[i].dsItemId);
            var textUrl = this.entity.modal.modalTextUrl?this.entity.modal.modalTextUrl:undefined;
            var index = $target.closest('.springContent').find('.pointValue').index($target);
            $target.html(data);
            arrId.push('');
            if (textUrl && textUrl.length > 0){
                for(var j = 0; j < textUrl[index].ptTextUrl.length; ++j){
                    if (textUrl[index].ptTextUrl[j].value == parseInt(data)) {
                        arrId[index] = textUrl[index].ptTextUrl[j].url;
                        if (arrId[index] != '') {
                            $target.css({
                                'cursor': 'pointer',
                                'text-decoration': 'underline'
                            });
                            if (textUrl[index].ptTextUrl[j].name && textUrl[index].ptTextUrl[j].name !='') {
                                $target.html(textUrl[index].ptTextUrl[j].name);
                            }
                        }
                        break;
                    }

                }
            }
        }
        var _this = this;
        arrId.forEach(function(value,index){
            if(arrId[index] == '')return;
            var $target = $('#ulPages').find('[pageId="' + arrId[index] + '"]');
            var ScreenType;
            for (var i = 0 ; i < AppConfig.navItems.length;i++){
                if(AppConfig.navItems[i].id == arrId[index]){
                    ScreenType = AppConfig.navItems[i].type;
                    break;
                }
            }
            if (!ScreenType){
                $('#divContainer_' + _this.entity.id).find('.pointValue').eq(index).off('click').on('click',function(e){
                    ScreenManager.show(ScreenType,arrId[index]);
                })
            }else{
                if(ScreenType == 'ReportScreen'){
                    $('#divContainer_' + _this.entity.id).find('.pointValue').eq(index).off('click').on('click',function(e){
                        var $ev =  $('#ulPages [pageid="'+ arrId[index] +'"]');
                        if($ev[0].className != 'nav-btn-a'){
                            $ev = $ev.children('a');
                            $ev.closest('.dropdown').children('a').trigger('click');
                        }
                        $ev.trigger('click');
                    })
                }else if(ScreenType == 'EnergyScreen'){
                    $('#divContainer_' + _this.entity.id).find('.pointValue').eq(index).off('click').on('click',function(e){
                        ScreenManager.show(EnergyScreen,arrId[index]);
                    })
                }
            }
        })
    }
    ModalNote.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    }
    return ModalNote;
})();
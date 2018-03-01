/**
 * Created by vicky on 2016/12/2.
 */
class ImgGallery{
    constructor(screen, parent){
        this.screen = screen
        this.dataGallery = screen.dataGallery;
        this.repair = screen.dictTab.repair;
        this.maintain = screen.dictTab.maintain;
        this.$parent = !parent ? $('body') : parent;
        this.show();
    }

    show(){
        WebAPI.get('/static/app/Asset/views/widget/imgGallery.html').done(rsHtml => {
            this.$parent.append(rsHtml);
            this.init();
            this.attachEvent();
        });
    }

    init(){
        this.$modalAlbum = $('#iAlbumModal').modal('show');
        this.$albumWrap = $('#albumWrap', this.$modalAlbum);
        this.$albumTitle = $('#albumTitle', this.$modalAlbum);
        this.renderAlbum();
    }

    close(){
        //todo
        this.screen = null;
        this.dataGallery = null;
        this.repair = null;
        this.maintain = null;
        this.$parent = null;
        this.$modalAlbum = null;
        this.$albumWrap = null;
        this.$albumTitle = null;
        $('#iAlbumModal').empty().remove();
    }

    attachEvent(){


    }

    renderAlbum(){
        new ImgAblum(this.dataGallery,this.repair,this.maintain).show();
    }
}

class ImgAblum{
    constructor(dataGallery,repairData,maintainData){
        this.dataGallery = dataGallery;
        this.repairData = repairData;
        this.maintainData = maintainData;
        this.init();
    }

    init(){
        this.$modalAlbum = $('#iAlbumModal');
        this.$albumWrap = $('#albumWrap', this.$modalAlbum);
        this.$albumList = $('#albumList', this.$modalAlbum);
        this.$albumTitle = $('#albumTitle', this.$modalAlbum);
    }

    show(){
        var strHtml = '';
        var tpl = '<div class="albumItem" data-type="{type}"><div class="albumImg"><img src="{cover}" onerror="this.src=\'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png\'"/><span class="count">{count}</span></div><div class="name">{name}</div></div>';
        this.$albumTitle.text('图库');
        for(var i in this.dataGallery){
            strHtml += tpl.formatEL({
                cover: this.dataGallery[i].arrImg[0] ? this.dataGallery[i].arrImg[0].url : 'http://images.rnbtech.com.hk/assets/equipment/57b57b1d25752304384fabf5.jpg',
                name: this.dataGallery[i].name,
                count: this.dataGallery[i].arrImg.length,
                type: this.dataGallery[i].type
            });
        }
        this.$albumWrap.empty().append(strHtml);

        $('.albumItem').off('click').on('click', (e) => {
            this.curtAlbum = this.dataGallery[e.currentTarget.dataset.type];
            new ImgInAblum(this.curtAlbum,this.repairData,this.maintainData).show()
        });
    }

    close(){
        //todo
        this.dataGallery = null;
        this.repairData = null;
        this.$modalAlbum = null;
        this.$albumWrap = null;
        this.$albumList = null;
        this.$albumTitle = null;
        this.maintainData = null;
    }
}

class ImgInAblum{
    constructor(curtAlbum,repairData,maintainData){
        this.curtAlbum = curtAlbum;
        this.repairData = repairData;
        this.maintainData = maintainData;
        this.init();
    }
    init(){
        this.$modalAlbum = $('#iAlbumModal');
        this.$albumWrap = $('#albumWrap', this.$modalAlbum);
        this.$albumList = $('#albumList', this.$modalAlbum);
        this.$albumTitle = $('#albumTitle', this.$modalAlbum);
        this.$btnBackAlbum = $('#btnBackAlbum', this.$modalAlbum).removeClass('hidden');
        this.$btnBatchEdit = $('#btnBatchEdit', this.$modalAlbum).removeClass('hidden');
        this.$btnFinishEdit = $('#btnFinishEdit', this.$modalAlbum).addClass('hidden');
        this.$btnBatchDelete = $('#btnBatchDelete', this.$modalAlbum).addClass('hidden');
        this.attachEvent();
    }
    show(){
        var strHtml = ''
        var tplHtml = '<div class="imgItem" data-type="'+this.curtAlbum.type+'" data-uid="{uid}"><div class="albumImg"><img src="{url}" onerror="this.src=\'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png\'"/></div><div class="fileName" title="{fileName}">{fileName}</div><div class="imgAlbumInfo"><span class="modifier">{modifier}</span><span class="modifyTime">{modifyTime}</span></div><span class="iconfont checkBox hidden">&#xe803;</span></div>';
        this.$albumTitle.text('图库/'+ this.curtAlbum.name);
        for(var i of this.curtAlbum.arrImg){
            strHtml += (tplHtml.formatEL({
                url: i.url,
                fileName: i.fileName,
                modifier: i.modifier['userfullname'],
                modifyTime: i.modifyTime,
                uid:i.uid
            }));
        }
        this.$albumWrap.addClass('hidden');
        this.$albumList.empty().append(strHtml).removeClass('hidden');
    }

    attachEvent(){
        //相册列表返回到图库
        this.$btnBackAlbum.off('click').on('click', () => {
            this.$albumList.addClass('hidden');
            this.$albumWrap.removeClass('hidden');
            this.$btnBackAlbum.addClass('hidden');
            this.$btnBatchEdit.addClass('hidden');
            this.$btnFinishEdit.addClass('hidden');
            this.$btnBatchDelete.addClass('hidden');
            this.$albumTitle.text('图库');
        });
        this.$albumList.off('click').on('click', '.imgItem', (e) => {
            new ImgDetail(this.curtAlbum, this.$albumList.children('.imgItem').index(e.currentTarget),this.repairData,this.maintainData).show();
        });
        this.$btnBatchEdit.off('click').on('click', (e) => {
            $(e.currentTarget).addClass('hidden');
            //显示checkbox
            $('.imgItem .checkBox', this.$albumList).removeClass('hidden').off('click').on('click', e => {
                e.stopPropagation();
                $(e.currentTarget).closest('.imgItem').toggleClass('selected');
            });
            //删除按钮
            this.$btnBatchDelete.removeClass('hidden').off('click').on('click', e => {
                e.stopPropagation();
                this.$btnBatchEdit.removeClass('hidden');
                this.$btnBatchDelete.addClass('hidden');
                this.$btnFinishEdit.addClass('hidden');
                this.deleteImg();

            });
            //完成按钮
            this.$btnFinishEdit.removeClass('hidden').off('click').on('click', e => {
                e.stopPropagation();
                this.$btnBatchEdit.removeClass('hidden');
                this.$btnBatchDelete.addClass('hidden');
                this.$btnFinishEdit.addClass('hidden');
                $('.imgItem .checkBox', this.$albumList).addClass('hidden');
            });
        });
    }
    deleteImg(){
        var arrUrl = [];
        $('.imgItem.selected .checkBox', this.$albumList).each(function(){
            var url = $(this).siblings('.albumImg').children('img').attr('src');
            url = url.indexOf('http://images.rnbtech.com.hk') > -1 ? url.split('http://images.rnbtech.com.hk')[1] : url;
            arrUrl.push(url);
        });

        var postDate = {
            'file_path[]':arrUrl
        }
        WebAPI.post('/oss/delete', postDate).done(rs => {
            var _this = this;
            var type;
            $('.imgItem.selected .checkBox', this.$albumList).each(function(){
                var $currentItem = $(this).closest('.imgItem');
                type = $currentItem.attr('data-type');
                $currentItem.removeClass('.selected');
                $(this).siblings('.albumImg').children('img').attr('src', 'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png');
                var uid = $currentItem.attr('data-uid');
                var dataAll = type==='maintain'?_this.maintainData.data.records:_this.repairData.data.records;
                for(var i = 0;i<dataAll.length;i++){
                    var item = dataAll[i];
                    var attachments =  type==='maintain'?item.attachment:item.attachments;
                    if(attachments.length>0){
                        for(var j = 0;j<attachments.length;j++){
                            if(attachments[j].uid===uid){
                                attachments[j].url = 'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png';
                            }
                        }
                    }
                }
            });
            if(type==='maintain'){
                new AssetStatePanel().renderMaintain(this.maintainData);
            }else{
                new AssetStatePanel().renderRepair(this.repairData);
            }
        }).fail(rs => {

        }).always(rs => {

        });
    }

    close(){
        //todo
        this.curtAlbum = null;
        this.repairData = null;
        this.$modalAlbum = null;
        this.$albumWrap = null;
        this.$albumList = null;
        this.$albumTitle = null;
        this.$btnBackAlbum = null;
        this.$btnBatchEdit = null;
        this.$btnFinishEdit = null;
        this.$btnBatchDelete = null;
        this.maintainData = null;
    }
}

class ImgDetail{
    constructor(curtAlbum, index,repairData,maintainData){
        this.curtAlbum = curtAlbum;
        this.repairData = repairData;
        this.imgIndex = (index && index) > 0 ? index: 0;
        this.$imgCurt = undefined;
        this.$modalGallery = undefined;
        this.maintainData = maintainData;
        this.init();
    }

    init(){
        this.$modalAlbum = $('#iAlbumModal').modal('hide');
        this.$modalGallery = $('#iGalleryModal').modal('show');
        this.$imgCurt = $('#imgCurt', this.$modalGallery);
        this.attachEvent();
    }

    show(){
        var $tips = $('.tips', this.$modalGallery);
        $('.imgName', this.$modalGallery).text(this.curtAlbum.arrImg[this.imgIndex].filName).attr('title', this.curtAlbum.arrImg[this.imgIndex].filName);
        $('.modifier', this.$modalGallery).text(this.curtAlbum.arrImg[this.imgIndex].modifier.userfullname);
        $('.modifyTime', this.$modalGallery).text(this.curtAlbum.arrImg[this.imgIndex].modifyTime);
        this.$imgCurt.attr('src', this.curtAlbum.arrImg[this.imgIndex].url);
        if(this.imgIndex == this.curtAlbum.arrImg.length - 1){
            $tips.show().text('最后一张图片').fadeOut(5000);
        }else if(this.imgIndex == 0){
            $tips.show().text('第一张图片').fadeOut(5000);
        }
    }

    attachEvent(){
        //前一张图片
        $('.btnPrev', this.$modalGallery).off('click').on('click', () => {
            this.imgIndex --;
            if(this.imgIndex < 0){
                this.imgIndex = this.curtAlbum.arrImg.length - 1;
            }
            this.show();
        });
        //后一张图片
        $('.btnNext', this.$modalGallery).off('click').on('click', () => {
            this.imgIndex ++;
            if(this.imgIndex > this.curtAlbum.arrImg.length - 1){
                this.imgIndex = 0;
            }
            this.show();
        });
        //关闭模态框
        $('.btnClose', this.$modalGallery).off('click').on('click', () => {
            this.$modalGallery.modal('hide');
        });
         //相片详细返回到相册
        $('#btnDelete', this.$modalGallery).off('click').on('click', () => {
            this.deleteImg();
        });
        $('#btnBack', this.$modalGallery).off('click').on('click', () => {
            this.$modalGallery.modal('hide');
            this.$modalAlbum.modal('show');
        });
    }

    deleteImg(){
        var url = this.curtAlbum.arrImg[this.imgIndex].url;
        var uid = this.curtAlbum.arrImg[this.imgIndex].uid;
        var type = this.curtAlbum.type;
        url = url.indexOf('http://images.rnbtech.com.hk') > -1 ? url.split('http://images.rnbtech.com.hk')[1] : url;
        var postDate = {
            'file_path[]':[url]
        }
        WebAPI.post('/oss/delete', postDate).done(rs => {
            var _this = this;
            this.curtAlbum.arrImg.splice(this.imgIndex, 1);
            if(this.curtAlbum.arrImg.length > 1) {this.show();}
            var dataAll = type==='maintain'?_this.maintainData.data.records:_this.repairData.data.records;
            for(var i = 0;i<dataAll.length;i++){
                var item = dataAll[i];
                var attachments =  type==='maintain'?item.attachment:item.attachments;
                if(attachments.length>0){
                    for(var j = 0;j<attachments.length;j++){
                        if(attachments[j].uid===uid){
                            attachments[j].url = 'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png';
                        }
                    }
                }
            }
            if(type==='maintain'){
                new AssetStatePanel().renderMaintain(this.maintainData);
            }else{
                new AssetStatePanel().renderRepair(this.repairData);
            }
        }).fail(rs => {

        }).always(rs => {

        });
    }

    close(){
        //todo
        this.curtAlbum = null;
        this.repairData = null;
        this.imgIndex = null;
        this.$imgCurt = null;
        this.$modalGallery = null;
        this.$modalAlbum = null;
        this.$modalGallery = null;
        this.$imgCurt = null;
        this.maintainData = null;
    }
}
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

        this.attachEvent();
    }

    close(){
        this.screen = null;
        this.dataGallery = null;
        this.repair = null;
        this.maintain = null;
        this.$parent = null;
        this.$modalAlbum = null;
        this.$albumWrap = null;
        this.$albumTitle = null;
        $('#iAlbumModal').empty().remove();
        $('.iGalleryModal').empty().remove();
    }

    attachEvent(){
        // this.$modalAlbum.on('hidden.bs.modal', e => {
        //     this.close();
        // })
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
        var tpl = '<div class="albumItem" data-type="{type}"><div class="albumImg"><img src="{cover}" onerror="onImgError(this)"/><span class="count">{count}</span></div><div class="name">{name}</div></div>';
        this.$albumTitle.text('图库');
        for(var i in this.dataGallery){
            strHtml += tpl.formatEL({
                cover: this.dataGallery[i].arrImg[0] ? this.dataGallery[i].arrImg[0].url : 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/assets/equipment/57b57b1d25752304384fabf5.jpg',
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
        var tplHtml = '<div class="imgItem" data-type="'+this.curtAlbum.type+'" data-uid="{uid}"><div class="albumImg"><img src="{url}" onerror="onImgError(this)"/></div><div class="fileName" title="{fileName}">{fileName}</div><div class="imgAlbumInfo"><span class="modifier">{modifier}</span><span class="modifyTime">{modifyTime}</span></div><span class="iconfont checkBox hidden">&#xe803;</span></div>';
        this.$albumTitle.text('图库/'+ this.curtAlbum.name);
        for(var i of this.curtAlbum.arrImg){
            strHtml += (tplHtml.formatEL({
                url: i.url,
                fileName: i.fileName,
                modifier: i.modifier['userfullname'],
                modifyTime: i.modifyTime,
                uid:i.fileName
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
            //批量删除按钮
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
            var $albumImg = $(this).siblings('.albumImg');
            var url = $albumImg.children('img').attr('src');
            url = url.indexOf('https://beopweb.oss-cn-hangzhou.aliyuncs.com') > -1 ? url.split('https://beopweb.oss-cn-hangzhou.aliyuncs.com')[1] : url;
            url && (url = url.split('?')[0])
            arrUrl.push(url);
        });

        var postDate = {
            'file_path[]':arrUrl
        }
        WebAPI.post('/oss/delete', postDate).done(rs => {
            $('.imgItem.selected .checkBox', this.$albumList).each((index, elem) => {
                var $albumImg = $(elem).siblings('.albumImg');
                var url = $albumImg.children('img').attr('src');
                //dom上的图片删除
                $('[src="'+ url +'"]').attr('src','');
                //数据更新
                for(let i of this.curtAlbum.arrImg){
                    if(url.indexOf(i.url) > -1){
                        i.url = '';
                    }
                }
            });
            this.show();
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
        this.$imgCurt.attr('src', this.curtAlbum.arrImg[this.imgIndex].url).show().next('i').hide();
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
        // this.$modalAlbum.off('hidden.bs.modal').on('hidden.bs.modal', e => {
        //     this.close();
        // });
    }

    deleteImg(){
        var url = this.curtAlbum.arrImg[this.imgIndex].url;
        var uid = this.curtAlbum.arrImg[this.imgIndex].uid;
        var type = this.curtAlbum.type;
        //dom上的图片也删除
        $('[src="'+ url +'"]').attr('src','');
        url = url.indexOf('https://beopweb.oss-cn-hangzhou.aliyuncs.com') > -1 ? url.split('https://beopweb.oss-cn-hangzhou.aliyuncs.com')[1] : url;
        url && (url = url.split('?')[0])
        var postDate = {
            'file_path[]':[url]
        }
        WebAPI.post('/oss/delete', postDate).done(rs => {
            this.curtAlbum.arrImg[this.imgIndex].url = '';
            if(this.curtAlbum.arrImg.length > 1) {this.show();}
        }).fail(rs => {

        }).always(rs => {

        });
    }

    close(){
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

function onImgError(img){
    var $iDelete = $(img).siblings('.iconfont');
    $(img).hide();
    if($iDelete.length == 0){
        $(img).after('<i class="iconfont icon-shujuguanlisvg670" title="原图已被删除"></i>');
    }else{
        $iDelete.show();
    }
}
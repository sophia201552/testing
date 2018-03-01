/**
 * Created by vicky on 2016/11/25.
 */

class AssetStatePanel{
    constructor(){
        this.$panel = undefined;
        this.dictTab = {
            maintain: undefined,
            repair: undefined,
            operation: undefined
        };
    }

    show(){
        WebAPI.get('/static/app/Asset/views/panels/assetStatePanel.html').done(rsHtml => {
            $(ElScreenContainer).append(rsHtml);
            var leftWidth = $('#paneAssetFilter').width();
            this.$panel = $('#statePanel').css({left: leftWidth, width:'calc(100% - '+ leftWidth +'px)'});
            this.$tabMaintain = $('#maintain', this.$panel);
            this.$tabRepair = $('#repair', this.$panel);
            this.$tabOperation = $('#operation', this.$panel);
            this.init();
            this.attachEvent();
        });
    }

    init(){
        var time = new Date();
        this.dataGallery = {};
        //时间输入框初始化
        $('input.timeStyle').datetime();
        //开始时间:当前时间 结束时间:7天前
        $('[id="iptTimeEnd"]').val(time.format('yyyy-MM-dd'));
        time.setDate(time.getDate()-7);
        $('[id="iptTimeStart"]').val(time.format('yyyy-MM-dd'));

        I18n.fillArea(this.$panel);
        //默认查询预防性维保数据
        this.getMaintainData();
    }

    close(){
        $('.statePane').empty().remove();
        this.dictTab = null;
        this.dictThing = null;
        this.dataGallery = null;
        this.$panel = null;
        this.$tabMaintain = null;
        this.$tabRepair = null;
        this.$tabOperation = null;
    }

    attachEvent(){
        $('#btnImgGallery').off('click').on('click', (e) => {
            new ImgGallery(this);
        });
        $('#ulStateTab').off('click').on('click', 'a', (e) => {
            var tabName = $(e.currentTarget).attr('aria-controls');
            if(!this.dictTab[tabName]){
                switch(tabName){
                    case 'repair':
                        this.getRepairData();
                        break;
                    case 'operation':
                        this.getOperationData();
                        break;
                    default:
                        this.getMaintainData();
                        break;
                }
            }
        });

        //查询维护数据
        $('.btnQuery', this.$tabMaintain).off('click').on('click', () => {
            this.getMaintainData();
        });

        //查询维修数据
        $('.btnQuery', this.$tabRepair).off('click').on('click', () => {
            this.getRepairData();
        });

        //查询操作记录数据
        $('.btnQuery', this.$tabOperation).off('click').on('click', () => {
            this.getOperationData();
        });

        this.$panel.off('click').on('click', '.imgAttachmt', function(e){
            var imgSrc = $(this).prop('src');
            $('.showImg').off('click').on('click', function (e) {
                if(e.target == this.children[1]){
                    return;
                }
                e.stopPropagation();
                $(this).fadeOut();
            }).fadeIn().find('img').prop('src', imgSrc);
        });
    }

    //维护记录
    getMaintainData(){
        var startTime = $('#iptTimeStart', this.$tabMaintain).val();
        var endTime = $('#iptTimeEnd', this.$tabMaintain).val();

        startTime = new Date(startTime).format('yyyy-MM-dd 00:00:00');
        endTime = new Date(endTime).format('yyyy-MM-dd 23:59:59');
        //check startTime, endTime
        if(startTime == "NaN-aN-aN aN:aN:aN" || endTime == "NaN-aN-aN aN:aN:aN"){
            alert('请输入有效时间');
            return;
        }
        var postData = {
            pageNumber: 1,
            pageSize: 10000,
            startTime: startTime,
            endTime: endTime,
            query: {'fields.projId': AppConfig.projectId, 'fields.type': 4,'createTime': {'$gt': startTime, '$lt': endTime}}//fields.type: 4 ==> 预防性维护{'$gt': datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S'), '$lt': datetime.strptime(end_time, '%Y-%m-%d %H:%M:%S')}
        }
        Spinner.spin(this.$tabMaintain[0]);
        WebAPI.post('/workflow/task/filter', postData).done((rs) => this.renderMaintain(rs))
        .fail(rs => {})
        .always(rs => {
            Spinner.stop();
        });
    }

    getRepairData(){
        var startTime = new Date($('#iptTimeStart', this.$tabRepair).val());
        var endTime = new Date($('#iptTimeEnd', this.$tabRepair).val());

        startTime.setDate(startTime.getDate()-1);
        endTime.setDate(endTime.getDate()+1);

        startTime = new Date(startTime).format('yyyy-MM-dd 23:59:59');
        endTime = new Date(endTime).format('yyyy-MM-dd 00:00:00');
        //check startTime, endTime
        if(startTime == "NaN-aN-aN aN:aN:aN" || endTime == "NaN-aN-aN aN:aN:aN"){
            alert('请输入有效时间');
            return;
        }
        var postData = {
            endTime: endTime,
            pageNum: 1,
            pageSize: 10000,
            startTime: startTime
        }
        Spinner.spin(this.$tabRepair[0]);
        WebAPI.post('/asset/maintainRecords/list', postData).done((rs) => this.renderRepair(rs))
        .fail(rs => {})
        .always(rs => {
            Spinner.stop();
        });
    }

    getOperationData(){
        var startTime = $('#iptTimeStart', this.$tabOperation).val();
        var endTime = $('#iptTimeEnd', this.$tabOperation).val();

        startTime = new Date(startTime).format('yyyy-MM-dd 00:00:00');
        endTime = new Date(endTime).format('yyyy-MM-dd 23:59:59');
        //check startTime, endTime
        if(startTime == "NaN-aN-aN aN:aN:aN" || endTime == "NaN-aN-aN aN:aN:aN"){
            alert('请输入有效时间');
            return;
        }
        var postData = {
            projId: AppConfig.projectId,
            endTime: endTime,
            startTime: startTime
        }
        Spinner.spin(this.$tabOperation[0]);
        WebAPI.post('/iot/getIOTRecords', postData).done((rs) => this.renderOperation(rs))
        .fail(rs => {})
        .always(rs => {
            Spinner.stop();
        });
    }

    renderMaintain(data){
        !this.dictTab && (this.dictTab={});
        this.dictTab['maintain'] = data;
        var $dataListCtn = $('.dataListCtn', this.$tabMaintain);
        var strHtml = '', tplHtml = '<div class="commentItem">\
            <div class="baseInfoCtn">\
                <span class="userPic"><img src="{userpic}" onerror="this.src=\'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png\'"/></span>\
                <span class="name userName">{userName}</span>\
                <span class="time">{createTime}</span>\
            </div>\
            <div class="wkDescription">\
                <div class="title">{title}</div>\
                <div class="description">{detail}</div>\
            </div>\
            <div class="attachment">{attachment}</div>\
        </div>';
        var dataImg = {
            name: '预防性维护',
            type: 'maintain',
            arrImg: []
        };
        if(data.data && data.data.records){
            for(var i of data.data.records){
                strHtml += (tplHtml.formatEL({
                    userpic: i.creatorInfo ? (i.creatorInfo.userpic.indexOf('static') < 2 ? 'http://images.rnbtech.com.hk' + i.creatorInfo.userpic : i.creatorInfo.userpic) : 'http://images.rnbtech.com.hk/static/images/avatar/default/4.png',
                    userName: i.creator,
                    createTime: i.createTime,
                    title: i.title,
                    detail: i.fields.detail,
                    attachment: ((arr) => {
                        var str = '', fileName = '', tpl = '<span class="itemAttachmt"><span>{fileName}</span><a href="{url}" class="lkDownload">下载</a></span>';
                        for(var j of arr){
                            if(/.jpg|.jpeg|.png|.gif/.test(j.url)){
                                fileName = '<img src="'+ j.url +'" class="imgAttachmt" title="查看大图" data-uid="'+j.uid+'" onerror="this.src=\'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png\'"/>';
                                dataImg.arrImg.push({
                                    fileName:j.fileName,
                                    url: j.url,
                                    from: '',
                                    link: '',
                                    modifier: i.creatorInfo,
                                    modifyTime: i.createTime,
                                    uid:j.uid
                                });
                            }else{
                                fileName = i.fileName;
                            }
                            str += (tpl.formatEL({
                                url: j.url,
                                fileName: fileName
                            }));
                        }
                        return str;
                    })(i.attachment)
                }));
            }
            if(this.dataGallery){
                this.dataGallery['maintain'] = dataImg;
            }
        }
        $dataListCtn.html(strHtml);
    }

    renderRepair(data){
        !this.dictTab && (this.dictTab={});
        this.dictTab['repair'] = data;

        var $dataListCtn = $('.dataListCtn', this.$tabRepair);
        var strHtml = '', tplHtml = '<div class="commentItem">\
            <div class="baseInfoCtn">\
                <span class="userPic"><img src="{userpic}" onerror="this.src=\'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png\'"/></span>\
                <span class="name userName">{userName}</span>\
                <span class="time">{createTime}</span>\
            </div>\
            <div class="wkDescription">\
                <div class="title"><span class="spanTitle">{title}</span><span class="spanLight">开始时间:{startTime}&nbsp;&nbsp;&nbsp;&nbsp;结束时间:{endTime}</span><span class="spanLight">负责人: {operator}</span></div>\
                <div class="description">{detail}</div>\
            </div>\
            <div class="attachment">{attachment}</div>\
        </div>';

        this.dictThing = {};
        for(var thing of data.data.things){
            this.dictThing[thing._id] = thing;
        }
        var dataImg = {
            name: '维修记录',
            type: 'repair',
            arrImg: []
        };
        if(data.data && data.data.records){
            for(var i of data.data.records){
                if(this.dictThing[i.thing_id].projId != AppConfig.projectId) continue;
                strHtml += (tplHtml.formatEL({
                    userpic: i.creatorInfo ? (i.creatorInfo.userpic.indexOf('static') < 2 ? 'http://images.rnbtech.com.hk' + i.creatorInfo.userpic : i.creatorInfo.userpic) : 'http://images.rnbtech.com.hk/static/images/avatar/default/4.png',
                    userName: i.creatorInfo ? i.creatorInfo.userfullname : '',
                    createTime: i.createTime,
                    title: this.dictThing[i.thing_id].name,
                    operator: i.operator,
                    detail: i.content,
                    startTime: i.startTime,
                    endTime: i.endTime,
                    attachment: ((arr) => {
                        var str = '', fileName = '', tpl = '<span class="itemAttachmt"><span>{fileName}</span><a href="{url}" class="lkDownload">下载</a></span>';
                        for(var j of arr){
                            if(/.jpg|.jpeg|.png|.gif/.test(j.url)){
                                fileName = '<img src="'+ j.url +'" class="imgAttachmt" data-uid="'+j.uid+'" title="查看大图" onerror="this.src=\'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png\'"/>';
                                dataImg.arrImg.push({
                                    fileName:j.fileName,
                                    url: j.url,
                                    from: '',
                                    link: '',
                                    modifier: i.creatorInfo,
                                    modifyTime: i.createTime,
                                    uid:j.uid
                                });
                            }else{
                                fileName = i.fileName;
                            }
                            str += (tpl.formatEL({
                                url: i.url,
                                fileName: fileName
                            }));
                        }
                        return str;
                    })(i.attachments)
                }));
            }
            if(this.dataGallery){
                this.dataGallery['repair'] = dataImg;
            }
        }
        $dataListCtn.html(strHtml);
    }

    renderOperation(data){
        !this.dictTab && (this.dictTab={});
        this.dictTab['operation'] = data;
        var $dataListCtn = $('.dataListCtn', this.$tabOperation);
        var strHtml = '';
        var timeStamp = new Date().getTime();//为了刷新图片
        var tpl = '<div class="commentItem">\
            <div class="baseInfoCtn">\
                <span class="userPic"><img src="{userpic}" onerror="this.src=\'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png\'"/></span>\
                <span class="name userName">{userName}</span>\
                <span class="time">{time}</span>\
            </div>\
            <div class="wkDescription">\
                <div class="title">{title}</div>\
                <div class="description">{detail}</div>\
            </div>\
        </div>';


        var dictOprtType = {
            'add': '增加',
            'delete': '删除',
            'modify': '修改',
            'modifyImg': '修改设备照片'
        };
        var dataImg = {
            name: '操作记录',
            type: 'operation',
            arrImg: []
        };
        if(data.data){
            for(var i of data.data){
                var title = '<span class="oprtInfo tableName">表:' + i.tableName + '</span><span class="oprtInfo oprtName">操作:' + dictOprtType[i.type] + '</span>';
                var detail = '', imgUrl = '';
                if(i.type === "modify"){
                    title += ('<span>id:'+ i.newData['_id'] +'</span>');
                    //对比修改的属性
                    for(var j in i.newData){
                        i.newData[j] == 'None' && (i.newData[j] = '');
                        i.oldData[j] == 'None' && (i.oldData[j] = '');

                        !i.newData[j] && (i.newData[j] = '');
                        !i.oldData[j] && (i.oldData[j] = '');

                        if(j == 'updateTime'){
                            continue;
                        }

                        if(i.newData[j] != i.oldData[j] && (i.newData[j] || i.oldData[j])){
                            if(typeof i.newData[j] == 'object' || typeof i.oldData[j] == 'object'){
                                for(var k in i.newData[j]){
                                    if(i.newData[j][k] != i.oldData[j][k]){
                                        detail += (j + (i.oldData[j][k]?'由'+i.oldData[j][k]:'') + '修改为' + i.newData[j][k] + ';\t');
                                    }
                                }
                            }else{
                                detail += (j + (i.oldData[j]?'由'+i.oldData[j]:'') + '修改为' + i.newData[j] + ';\t');
                            }
                        }
                    }
                }else if(i.type === "delete"){
                    title += ('<span>id:'+ i.oldData['_id'] +'</span>');
                    detail = i.oldData ? (i.oldData.name ? ('name:'+ i.oldData.name) : (i.oldData._id ? 'id:'+ i.oldData._id: '')) : '';
                }else if(i.type === "add"){
                    title += ('<span>id:'+ i.newData['_id'] +'</span>');
                    detail = i.newData ? i.newData.name : '';
                }else if(i.type === 'modifyImg'){
                    title += ('<span>id:'+ i.newData['_id'] +'</span>');
                    imgUrl = 'http://images.rnbtech.com.hk/'+ i.newData['urlImg'] + '?'+ timeStamp;
                    dataImg.arrImg.push({
                                    fileName:i.newData['_id'],
                                    url: imgUrl,
                                    from: '',
                                    link: '',
                                    modifier: i.creatorInfo,
                                    modifyTime: i.time
                                });
                    detail += ('目前为: <img class="imgAttachmt imgAsset" src="'+ imgUrl +'" onerror="this.src=\'http://images.rnbtech.com.hk/workflow/attachment/599a931ec0-矩形-28.png\'"/>');
                }
                strHtml += (tpl.formatEL({
                    userpic: i.creatorInfo ? (i.creatorInfo.userpic.indexOf('static') < 2 ? 'http://images.rnbtech.com.hk' + i.creatorInfo.userpic : i.creatorInfo.userpic) : 'http://images.rnbtech.com.hk/static/images/avatar/default/4.png',
                    userName: i.creatorInfo ? i.creatorInfo.userfullname : '',
                    time: i.time,
                    title: title,
                    detail: detail
                }));
            }
            this.dataGallery['operation'] = dataImg;
        }

        $dataListCtn.html(strHtml);
    }
}


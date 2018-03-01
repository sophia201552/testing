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
        //开始时间:当前时间 结束时间:上个月的今天
        $('[id="iptTimeEnd"]').val(time.format('yyyy-MM-dd'));
        time.setMonth(time.getMonth()-1);
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
            $('.showImg:eq(0)').off('click').on('click', function (e) {
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
                <span class="userPic"><img src="{userpic}" onerror="imgError(this)"/></span>\
                <span class="name userName">{userName}</span>\
                <span class="time">{createTime}</span>\
            </div>\
            <div class="wkDescription">\
                <div class="title">{title}</div>\
                <div class="description">{detail}</div>\
            </div>\
            <div class="attachment gray-scrollbar">{attachment}</div>\
        </div>';
        var dataImg = {
            name: '预防性维护',
            type: 'maintain',
            arrImg: []
        };
        if(data.data && data.data.records){
            for(var i of data.data.records){
                strHtml += (tplHtml.formatEL({
                    userpic: i.executorInfo ? (i.executorInfo.userpic.indexOf('static') < 2 ? 'https://beopweb.oss-cn-hangzhou.aliyuncs.com' + i.executorInfo.userpic : i.executorInfo.userpic) : 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                    userName: i.executor,
                    createTime: i.createTime,
                    title: i.title,
                    detail: i.fields.detail,
                    attachment: ((arr) => {
                        var str = '', fileName = '', tpl = '<span class="itemAttachmt"><span>{fileName}</span><a href="{url}" class="lkDownload">下载</a></span>';
                        for(var j of arr){
                            if(/.jpg|.jpeg|.png|.gif/.test(j.url)){
                                fileName = '<img src="'+ j.url +'" class="imgAttachmt" title="查看大图" data-uid="'+j.uid+'" onerror="imgError(this)"/>';
                                dataImg.arrImg.push({
                                    fileName:j.fileName,
                                    url: j.url,
                                    from: '',
                                    link: '',
                                    modifier: i.executorInfo,
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
                <span class="userPic"><img src="{userpic}" onerror="imgError(this)"/></span>\
                <span class="name userName">{userName}</span>\
                <span class="time">{createTime}</span>\
            </div>\
            <div class="wkDescription">\
                <div class="title"><span class="spanTitle" title="{title}">{title}</span><span class="spanLight">开始时间:{startTime}&nbsp;&nbsp;&nbsp;&nbsp;结束时间:{endTime}</span><span class="spanLight">负责人: {operator}</span></div>\
                <div class="description">{detail}</div>\
            </div>\
            <div class="attachment gray-scrollbar">{attachment}</div>\
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
                if(!this.dictThing[i.thing_id] || !this.dictThing[i.thing_id].projId || this.dictThing[i.thing_id].projId != AppConfig.projectId) continue;
                strHtml += (tplHtml.formatEL({
                    userpic: i.creatorInfo ? (i.creatorInfo.userpic.indexOf('static') < 2 ? 'https://beopweb.oss-cn-hangzhou.aliyuncs.com' + i.creatorInfo.userpic : i.creatorInfo.userpic) : 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
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
                                fileName = '<img src="'+ j.url +'" class="imgAttachmt" data-uid="'+j.uid+'" title="查看大图" onerror="imgError(this)"/>';
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
                    })(i.attachments)
                }));
            }
            if(this.dataGallery){
                this.dataGallery['repair'] = dataImg;
            }
        }
        $dataListCtn.html(strHtml);
    }

    renderOperation(rs){
        !this.dictTab && (this.dictTab={});
        var data = this.dictTab['operation'] = rs.data.result;
        var $dataListCtn = $('.dataListCtn', this.$tabOperation);
        var strHtml = '';
        var timeStamp = new Date().getTime();//为了刷新图片
        var  dict_Id_Name = {}, dictModel={};
        var tpl = '<div class="commentItem">\
            <div class="baseInfoCtn">\
                <span class="userPic"><img src="{userpic}" onerror="imgError(this)"/></span>\
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
        var dictAttr = {
            'activeTime':'投入使用',
            'brand':'品牌',
            'buyer':'采购人',
            'buyingTime':'购置时间',
            'desc':'描述',
            'guaranteeTime':'过保时间',
            'model':'型号',
            'other':'其他',
            'price':'购置价格',
            'sn':'序列号',
            'manager':'责任人',
            'status':'状态',
            'supplier':'供应商',
            'updateTime':'更新日期',
            'endTime':'到期时间',
            'urlImg':'图片来源',
            'productArea':'产地',
            'productTime':'出厂时间',
            'serviceLife':'使用寿命',
            'name':'名称',
            'type':'资产类型'
        }

        //表id转换成设备/组名称
        for(let i in rs.data.dictRs){
            let dictRs = rs.data.dictRs[i];
            for(let j = 0; j < dictRs.length; j++){
                dict_Id_Name[dictRs[j]._id] = dictRs[j].name;
            }
            
        }

        //模型model转换成字典
        for(let i in rs.data.dictModel){
            let dictRs = rs.data.dictModel[i];
            dictModel[dictRs._id] = dictRs.name;
        }

        if(data){
            var iotType = '';
            for(var i of data){
                if(i.tableName.indexOf('Thing') > -1){
                    iotType = '设备';
                }else{
                    iotType = '组';
                }
                var title = '<span class="oprtInfo oprtName" data-tableName="'+ i.tableName +'">操作:' + dictOprtType[i.type] + iotType + '</span>';
                var detail = '', imgUrl = '', name = '';
                
                if(i.type === "modify"){
                    name = i.newData.name ? i.newData.name : (dict_Id_Name[i.newData['_id']] ? dict_Id_Name[i.newData['_id']] : undefined);
                    if(!name) continue;
                    title += ('<span data-id="'+ i.newData._id +'">名称:'+ name +'</span>');
                    //对比修改的属性
                    for(var j in i.newData){
                        i.newData[j] == 'None' && (i.newData[j] = '');
                        i.oldData[j] == 'None' && (i.oldData[j] = '');

                        !i.newData[j] && (i.newData[j] = '');
                        !i.oldData[j] && (i.oldData[j] = '');

                        if(j == 'updateTime'){
                            continue;
                        }
                        if(dictAttr[j]){
                            if(i.newData[j] != i.oldData[j] && (i.newData[j] || i.oldData[j])){
                                if(typeof i.newData[j] == 'object' || typeof i.oldData[j] == 'object'){
                                    for(var k in i.newData[j]){
                                        if(i.newData[j][k] != i.oldData[j][k]){
                                            detail += (dictAttr[j] + (i.oldData[j][k]?'由'+i.oldData[j][k]:'') + '修改为' + i.newData[j][k] + ';\t');
                                        }
                                    }
                                }else{
                                    if(j == 'model'){
                                        detail += (dictAttr[j] + (i.oldData[j]?'由'+dictModel[i.oldData[j]]:'') + '修改为' + (i.newData[j] ? dictModel[i.newData[j]] : '--') + ';\t');
                                    }else{
                                        detail += (dictAttr[j] + (i.oldData[j]?'由'+i.oldData[j]:'') + '修改为' + i.newData[j] + ';\t');
                                    }
                                }
                            }
                        }                        
                    }
                }else if(i.type === "delete"){
                    //删除一个thing会有2条操作记录,过滤掉其中一条
                    name = i.oldData.name || dict_Id_Name[i.oldData['_id']];
                    if(name){
                        title += ('<span data-id="'+ i.oldData._id +'">名称:'+ (i.oldData.name ? i.oldData.name : (dict_Id_Name[i.oldData['_id']] ? dict_Id_Name[i.oldData['_id']] : '--')) +'</span>');
                        detail = i.oldData ? (i.oldData.name ? ('name:'+ i.oldData.name) : (i.oldData._id ? 'id:'+ i.oldData._id: '')) : '';
                    }else{
                        continue;
                    }
                    
                }else if(i.type === "add"){
                    title += ('<span data-id="'+ i.newData._id +'">名称:'+ (i.newData.name ? i.newData.name : '--') +'</span>');
                    detail = i.newData ? i.newData.name : '';
                }else if(i.type === 'modifyImg'){
                    title = '<span class="oprtInfo oprtName" data-tableName="'+ i.tableName +'">操作:' + dictOprtType[i.type] + '</span>';
                    name = i.newData.name ? i.newData.name : (dict_Id_Name[i.newData['_id']] ? dict_Id_Name[i.newData['_id']] : undefined);
                    if(!name) continue;
                    title += ('<span data-id="'+ i.newData._id +'">名称:'+ name +'</span>');
                    imgUrl = 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/'+ i.newData['urlImg'] + '?'+ timeStamp;
                    dataImg.arrImg.push({
                                    fileName:i.newData['_id'],
                                    url: imgUrl,
                                    from: '',
                                    link: '',
                                    modifier: i.creatorInfo,
                                    modifyTime: i.time
                                });
                    detail += ('目前为: <img class="imgAttachmt imgAsset" src="'+ imgUrl +'" onerror="imgError(this)"/>');
                }
                strHtml += (tpl.formatEL({
                    userpic: i.creatorInfo ? (i.creatorInfo.userpic.indexOf('static') < 2 ? 'https://beopweb.oss-cn-hangzhou.aliyuncs.com' + i.creatorInfo.userpic : i.creatorInfo.userpic) : 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
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
function imgError(img){
    $(img).hide().after('<i class="iconfont icon-shujuguanlisvg670" title="原图已被删除"></i>').closest('.itemAttachmt').find('.lkDownload').hide();
}


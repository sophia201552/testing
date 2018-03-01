/**
 * Created by vicky on 2015/9/21.
 */
var ModalReportFactory = (function(FacReportScreen){

    function ModalReportFactory(screen, entityParams, configModalOpt) {
        if (!entityParams) return;

        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode, configModalOpt);
        this.reportList = [];
        this.getReportWrap();
    };

    ModalReportFactory.prototype = new ModalBase();

    ModalReportFactory.prototype.optionTemplate = {
        name:'toolBox.modal.REPORT_CHAPTER',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 30,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalReportFactory',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalReportFactory.prototype.show = function(){
        this.init();
    }

    ModalReportFactory.prototype.init = function(){

    }

    ModalReportFactory.prototype.renderModal = function (e) {
        var _this = this;
        var arr = this.entity.modal.option.arrReport;
        var domWrap = this.container;

        domWrap.style.overflowY = 'auto';

        //todo 支持换肤
        domWrap.innerHTML = '';
        arr.forEach(function (row) {
            var container = document.createElement('div');
            container.style.width = '100%';
            container.style.position = 'relative';
            //TODO 字体颜色
            //container.className = '';//container的背景可能的值:transparent(图片),#fff
            domWrap.appendChild(container);

            // 渲染
            namespace('api.report').renderReport(container, row.pageId, row.chapterId, {
                onlySummary: row.isSummary === 1
            }).done(function(){
                //"查看更多"按钮
                var a = document.createElement('a');
                a.href = '/factory/preview/report/' + row.pageId + '/' + AppConfig.isFactory + '?projectId=' + AppConfig.projectId;
                a.innerText = '查看更多';
                a.target="_blank";
                if(container.offsetHeight > 20){//在PageScreen有固定的高度,按钮固定在左下角
                    a.style.position = 'absolute';
                    a.style.bottom = '20px';
                    a.style.left = '35px';
                }else{//dashboard, 高度自适应
                    a.style.marginTop = '10px';
                    a.style.marginBottom = '30px';
                    a.style.marginLeft = '35px';
                    a.style.color = '#fff';
                }

                a.className = 'btn btn-primary';
                container.appendChild(a);

                var reportName, report, date, title;
                //标题
                for(var i = 0,l = _this.reportList.length; i < l; i++){
                    if(row.pageId === _this.reportList[i].reportId){
                        report = _this.reportList[i];
                        break;
                    }
                }

                if(report){
                    reportName = report.reportName;
                    if(report.period === 'day'){
                        date = new Date().format('MM月dd日')
                    }else if(report.period === 'month'){
                        date = new Date().format('MM月')
                    }
                    title = document.createElement('h4');
                    title.style.marginLeft = '35px';
                    title.innerText = reportName + '-' + date;
                    $(container).prepend(title);
                }
            });
        });

        this.spinner && _this.spinner.stop();
    }

    ModalReportFactory.prototype.showConfigMode = function () {

    };
    ModalReportFactory.prototype.updateModal = function (points) {

    };
    ModalReportFactory.prototype.setModalOption = function (option) {

    };

    ModalReportFactory.prototype.getReportWrap = function () {
        var _this = this, projectId;
        _this.reportList = [];
        //获取项目所有的报表(第一级目录)
        if(AppConfig.project && AppConfig.project.id){
            projectId = AppConfig.project.id;
        }else if(this.entity.modal.option.facProjectId){
            projectId = this.entity.modal.option.facProjectId;
        }

        if(!projectId){
            return;
        }

        WebAPI.get('/factory/getFirstLevelReports/' + projectId).done(function(result){
            if(!result.data || result.data.length == 0) return;
            result.data.forEach(function(item){
                if(item.list && item.list.length > 0){
                    item.list.forEach(function(report){
                        _this.reportList.push(report);
                    });
                }
            });
        })
    };
    ModalReportFactory.prototype.modalDialog = '\
                <style>.btnRemove{height: 34px;line-height: 34px;font-size: 16px;}</style>\
                <div style="position: absolute;top: 0;right: 10px;z-index: 1;padding: 15px 10px;font-size: 24px;">\
                    <span class="glyphicon glyphicon-plus-sign" id="btnAddSummary"></span>\
                </div>\
                <div class="row" style="margin-bottom: 15px;"><div class="col-xs-4 col-xs-offset-1"><input class="form-control" id="title" type="text" placeholder="标题"/></div></div>';

    ModalReportFactory.prototype.showConfigModal = function () {
        var _this = this;
        //this.$dialogModal = $('#modalConfig');
        this.configModal = new ConfigModal(this.configModalOptDefault, this.screen.container, this);
        this.configModal.init();
        this.configModal.modalBody.innerHTML = this.modalDialog;
        this.attachEvents();
        if(this.entity.modal.option && this.entity.modal.option.arrReport){
            this.entity.modal.option.arrReport.forEach(function(report){
                _this.createItem(report);
            });
        }else{
            $('#btnAddSummary', this.configModal.modal).click();
        }

        if(this.entity.modal.title){
            $('#title', this.configModal.modal).val(this.entity.modal.title);
        }

        this.configModal.show();
    };
    ModalReportFactory.prototype.attachEvents = function () {
        var _this = this;
        $('#btnAddSummary', this.configModal.modal).off('click').on('click',function(){
            _this.createItem();
        });

        $('.btnConfirm', this.configModal.modal).off('click').on('click',function(){
            var title = $('#title', _this.configModal.modal).val();
            _this.configModal.hide();

            if(!_this.entity.modal.option) _this.entity.modal.option = {};
            if(!_this.entity.modal.option.arrReport) _this.entity.modal.option.arrReport = [];
            var arrParams = [];
            $('.summaryRow', _this.configModal.modal).each(function(){
                arrParams.push({
                    pageId: $(this).find('.pageList').val(),
                    //chapterId: $(this).find('.typeList').val(),
                    isSummary: $(this).find('.isSummary').prop('checked') ? 1 : 0
                });
            });
            _this.entity.modal.option.arrReport = arrParams;
            _this.entity.modal.option.facProjectId = AppConfig.project.id;
            _this.entity.modal.title = title;

            _this.render();
        });
    };

    ModalReportFactory.prototype.configModalOptDefault= {
        "header" : {
            "needBtnClose" : true,
            "title" : "配置"
        },
        "area" : [
            {
                'type':'footer',
                "widget":[{type:'confirm',opt:{needClose:false}},{type:'cancel'}]
            }
        ],
        result:{}
    };

    // 根据报表id，获取报表的章节列表
    ModalReportFactory.prototype.getChapterListByReportId = function (reportId) {
        // 做深度搜索，从而控制拿到章节的顺序
        return WebAPI.get("/spring/get/" + reportId + '/' + AppConfig.isFactory).then(function (rs) {
            var list = [];
            var data = rs.layout;
            var layouts = rs.layout[0];
            var layout, modal, path = [1];

            while(layout = layouts.shift()) {
                modal = layout.modal;

                // 处理章节号
                if (layout === 'end') {
                    path.pop();
                    path[path.length-1] += 1;
                    continue;
                }

                // 如果是报表，则添加一条记录“全部”
                if (modal.type === 'ReportContainer') {
                    list.push({
                        name: '全部',
                        value: layout.id
                    });
                    // 将当前容器的子控件追加到 layouts 数组的前面
                    // 加个标记位，用于做章节编号的计算
                    layouts.unshift('end');
                    // 追加到前面相当于 DFS，追加到后面相当于 BFS，这里做 DFS
                    layouts = modal.option.layouts.concat(layouts);
                } else if (modal.type === 'ChapterContainer') {
                    list.push({
                        name: '第' + path.join('.') + '章 - ' + (modal.option.chapterTitle || '未命名'),
                        value: layout.id
                    });
                    layouts.unshift('end');
                    layouts = modal.option.layouts.concat(layouts);
                    path.push(1);
                }
            }

            return list;
        });
    };


    ModalReportFactory.prototype.initOption = function($row, report){
        var _this = this;
        var strHtml = '';
        var $pageList = $('.pageList', $row), $isSummary = $('.isSummary', $row);
        if(!report){ report = {}}
        if(report.isSummary == 0){
            $isSummary.prop('checked', false);
        }
        if(this.reportList && this.reportList.length > 0){
            this.reportList.forEach(function(item){
                strHtml += ('<option value="'+ item.reportId +'">'+ item.reportName +'</option>');
            });
            $pageList.append(strHtml);
            setValue($pageList, report.pageId);
        }

        //page更改后,对应的章节数据显示
        $pageList.change(function(){
            var pageVal = this.value;
            var $typeList = $(this).closest('.row').find('.typeList');
            $typeList.children().hide();
            $typeList.children('[parent-id="'+ pageVal +'"]').show();
            $typeList.val($typeList.children('[parent-id="'+ pageVal +'"]:eq(0)').val());
        });

        $('.btnRemove',$row).off('click').on('click', function(){
            for(var i = 0, l = _this.entity.modal.option.arrReport.length; i < l; i++){
                if(_this.entity.modal.option.arrReport[i].pageId === report.pageId){
                    _this.entity.modal.option.arrReport.splice(i,1);
                    break;
                }
            }
            $(this).closest('.summaryRow').remove();
        });

        function setValue($select ,val){
            if(!!val){
                $select.val(val);
            }
        }

        /*function renderType(item){
            var tempStr = '', isShow = '';
            //根据当前pageList的值决定是否显示option
            ($pageList.val() ? $pageList.val(): $pageList.children('option:eq(0)').val())== item._id ? isShow = 'inline-block' : isShow = 'none';

            _this.dictChapter[item._id].forEach(function(i){
                tempStr += ('<option value="'+ i.value +'" parent-id="'+ item._id +'" style="display:'+ isShow +'">'+ i.name +'</option>');
            });
            $typeList.append(tempStr);
            setValue($typeList, report.chapterId);
        }*/
    };

    ModalReportFactory.prototype.createItem = function(report){
        $('.modal-body', this.configModal.modal).append('<div class="row summaryRow" style="margin-bottom: 15px;">\
            <div class="col-xs-4 col-xs-offset-1">\
                <select class="form-control pageList"></select>\
            </div>\
            <div class="col-xs-4">\
                <label class="checkbox-inline form-control" style="border: none;box-shadow: none;"> <input type="checkbox" class="isSummary" checked disabled> 仅显示摘要 </label>\
            </div>\
            <div class="col-xs-2">\
                <span class="glyphicon glyphicon-remove-sign btnRemove"></span>\
            </div>\
        </div>');
        this.initOption($('.modal-body .summaryRow', this.configModal.modal).last(), report);
    };

    return ModalReportFactory;
})();

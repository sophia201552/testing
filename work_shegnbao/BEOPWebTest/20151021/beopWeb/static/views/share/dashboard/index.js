// index.js
var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenModal = undefined;                                   //共用弹出框中，加载对象的引用。若模块有私有弹出框，无需赋值。
var ScreenPrevious = undefined;                                //前一页面对象的引用
var ToolCurrent = undefined;
var Spinner = new LoadingSpinner({color: '#00FFFF'});        //等待加载时的转圈圈

var AppConfig = {
    projectId: 1,
    projectName: undefined,
    userId: undefined,
    account: undefined,
    level: undefined,
    projectList: undefined,
    isMobile: false,
    chartTheme: 'macarons'
}; //配置文件
var I18n = undefined;                                          //国际化对象的引用

(function ($, window, undefined) {
    var userMailList = null;

    var reportItemTpl = '<div class="rp-ctn" style="width: {width}; height:{height}">\
        <div class="panel panel-default rp-ctn-p">\
            <div class="panel-heading rp-ctn-p-h">\
                <h3 class="panel-title" style="font-weight: bold;">{title}</h3>\
            </div>\
            <div class="panel-body rp-ctn-p-b">\
                <img src="{imgSrc}" style="top:{imgTop}px; left: {imgLeft}px; width:{imgWidth}px; height:{imgHeight}px;"/>\
                {note}\
                {graph}\
            </div>\
        </div>\
    </div>';

    // 1mm 等于多少 px
    var MM2PX = $('#mm2px').width();

    var InitI18nResource = function (strLanguage, isForce) {
        if (strLanguage == '') return;

        if (isForce) {
            localStorage["isUserSelectedLanguage"] = strLanguage;
        }
        else if (localStorage["isUserSelectedLanguage"]) {
            strLanguage = localStorage["isUserSelectedLanguage"];
        }

        $.getScript("/static/views/js/i18n/" + strLanguage + ".js")
            .done(function (e) {
                localStorage["language"] = strLanguage;
                localStorage["i18n"] = JSON.stringify(i18n_resource);
                Init();
            })
            .error(function (e) {
                if (!localStorage["i18n"]) {
                    $.getScript("/static/views/js/i18n/en.js").done(function (e) {
                        localStorage["language"] = "en";
                        localStorage["i18n"] = JSON.stringify(i18n_resource);
                        Init();
                    })
                }
            });
    };

    var Init = function () {
        var hidData = JSON.parse($('#hidData').html());
        AppConfig.userId = hidData.userId;
        I18n = new Internationalization();

        I18n.fillArea( $('body') );

        ScreenManager.show(EnergyScreen, hidData.menuId);
    }

    var attachEvents = function () {
        var $lkCopyLink = $('#lkCopyLink');
        var $lkSendEmail = $('#lkSendEmail');
        var $lkPrint = $('#lkPrint');
        // var $lkCopyLink = $('#lkCopyLink');
        // var $lkCopyLink = $('#lkCopyLink');
        // email modal
        var $modalSendEmail = $('#modalSendEmail');

        // copy the link
        $lkCopyLink.click(function () {
            var input = document.createElement('textarea');
            var successful;

            document.body.appendChild(input);
            input.value = window.location.href;
            input.focus();
            input.select();
            successful = document.execCommand('Copy');
            input.remove();
            if(successful) {
                alert('复制链接成功！');
            } else {
                alert('复制链接失败，可能您的浏览器不支持此功能，请在地址栏手动复制。');
            }
        });

        // send emails
        $lkSendEmail.click(function () {
            $modalSendEmail.modal('show');
        });
        initEmailBox();

        // print
        $lkPrint.click(function () {
            var entities = ScreenCurrent.listEntity;
            var entity, params;
            var noteList, noteHtml, layout, graphList, graphHtml;
            var arrHtml = [];
            var promise;

            // 显示 loading
            Spinner.spin(document.body);

            // 默认给 navbar 的高度
            // 单位 px
            // pageHeight 的高度应该等于 (navbar 的高度)+entities 的高度
            // 最后的 50 应该相当于加上一些损耗
            var pageHeight = 56 + $('#paneCenter')[0].scrollHeight + 50;

            // 先去服务端拉打印需要的模板
            promise = WebAPI.get('/static/views/share/export/pdfTemplate.html');

            // 拉数据的同时，处理页面数据
            for (var k in entities) {
                if (!entities.hasOwnProperty(k)) return;
                entity = entities[k];
                // 根据每个 entity 的信息，渲染出打印可用的 item 模板和样式
                // 如果 chart 实例不存在，则跳过这个 entity
                if(!entity.entityAnalysis || !entity.entityAnalysis.chart) return;

                // 开始取参数
                params = {};
                noteHtml = [];
                graphHtml = [];

                // 拿 entity 的标题
                params.title = entity.entity.modal.title;

                // 拿到 springContainer 的宽度高度（实际宽度，实际高度）
                var divCtn = document.getElementById('divContainer_'+k);
                var style = getComputedStyle(divCtn);
                params.width = style.width;
                params.height = style.height;
                // 如果 chart 实例存在，则先拿到这个 chart 的 image，这里使用
                // echart 的 getImage() 方法
                // getImage() 方法的返回值是一个 DOM 对象，但这里我们只需要它的 src
                var $target = $(divCtn).find('.springContent div:eq(0)');
                var pos = $target.position();
                params.imgTop = pos.top;
                params.imgLeft = pos.left;
                params.imgWidth = $target.width();
                params.imgHeight = $target.height();
                params.imgSrc = entity.entityAnalysis.chart.getImage().src;
                
                // 接下来拿 note 的信息
                noteList = entity.curModal.noteList;
                layout = entity.curModal.layout || {};
                if(!noteList || !noteList.length) {
                    params.note = '';
                } else {
                    noteList.forEach(function (row, i) {
                        var dockPosition = null;
                        for (var t in layout) {
                            if ( !layout.hasOwnProperty(t) ) {
                                continue;
                            }
                            if(!layout[t] || !layout[t].length) {
                                continue;
                            }
                            if( layout[t].indexOf(row.id) > -1 ) {
                                dockPosition = t;
                                break;
                            }
                        }
                        if(!!dockPosition) {
                            noteHtml.push(createDockNote(row, dockPosition));
                        } else {
                            noteHtml.push(
                                '<div class="note" style="left:{x};top:{y};width:{width};height:{height};background-color:{bgColor}">{text}</div>'
                                .formatEL(row)
                            )
                        }
                    });
                    params.note = noteHtml.join('');
                }

                //获取graph信息
                graphList = entity.curModal.graphList;
                if(!graphList || graphList.length == 0){
                    params.graph = '';
                }else{
                    //svg模板
                    var temp;
                    var tpl_arrow = '<svg class="svgGraphCopy" id="{id}" viewBox="0 0 {width} {height}" width="{width}" height="{height}" >' +
                                    '<defs><marker id="{marker_id}" orient="auto" markerWidth="2" markerHeight="4" refX="0.1" refY="2"><path d="M0,0 V4 L2,2 Z" fill="{color}"/></marker></defs>' +
                                    '<path class="arrow-line2" marker-end="url(#{marker_id})" stroke-width="4" stroke="{color}" d="{path_d}"/>' +
                                    '</svg>';
                    var tpl_circle = '<svg class="svgGraphCopy" id="{id}" viewBox="0 0 {width} {height}" width="{width}" height="{height}" >' +
                                    '<ellipse style="fill:rgba(0,0,0,0);stroke-width:3px;stroke:{color}" orient="auto" cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" x="0" y="0"/>' +
                                    '</svg>';
                    var tpl_rect = '<svg class="svgGraphCopy" id="{id}" viewBox="0 0 {width} {height}" width="{width}" height="{height}" >' +
                                    '<rect style="fill:rgba(0,0,0,0);stroke-width:4px;stroke:{color}" orient="auto" width="{width}" height="{height}"/>' +
                                    '</svg>';
                    graphList.forEach(function(row){
                        var wrap = '<div class="svgCopyBox" style="width:' + (row.width + 8) + 'px;height:' + (row.height + 8) + 'px;padding:2px;position:absolute;left:' + row.left + ';top:' + row .top+ ';z-index:201;">';
                        if (row.type == 'arrow') {
                            temp = wrap + tpl_arrow.formatEL(row) + '</div>';
                        } else if (row.type == 'rect') {
                            temp = wrap + tpl_rect.formatEL(row) + '</div>';
                        } else if (row.type == 'circle') {
                            temp = wrap + tpl_circle.formatEL(row) + '</div>';
                        }
                        graphHtml.push(temp)
                    })
                    params.graph = graphHtml.join('');
                }

                // 到这里为止，一个 item 生成完毕了，将它加入到列表中
                arrHtml.push(
                    reportItemTpl.formatEL(params)
                );
            }

            function createDockNote(note, direction) {
                var $ctn = $('<div class="dock-window-ctn">');
                var $divNote = $('<div class="dock-note" style="background-color: '+ note.bgColor +'">'+
                    '<div class="dock-note-ct gray-scrollbar" data-id="'+note.id+'"></div>'+
                    '</div>');
                var $divNoteCt = $divNote.children('.dock-note-ct');
                var $layoutCtn, $layoutCtnWrap;
                // 包裹 layoutCtn 的容器，因为 top/bottom 和 left/right 的存放容器不一样
                var $layoutContainer;
                if( ['top', 'bottom'].indexOf(direction) > -1 ) {
                    $layoutContainer = $ctn;
                    $divNoteCt.height(note.height);
                }
                if( ['left', 'right'].indexOf(direction) > -1 ) {
                    $layoutCtnWrap = $ctn.children('.dock-layout-wrap');
                    if($layoutCtnWrap.length === 0) {
                        var $wrap = $('[data-id="'+ note.id +'"]').closest('.dock-layout-wrap');
                        var style = getComputedStyle($wrap[0])
                        $layoutCtnWrap = $('<div class="dock-layout-wrap" style="bottom: '+ style.bottom +'; top: '+ style.top +';">');
                        $ctn.append($layoutCtnWrap);
                    }
                    $layoutContainer = $layoutCtnWrap;
                    $divNoteCt.width(note.width);
                }

                $layoutCtn = $layoutContainer.children('.dock-layout-'+direction);
                if($layoutCtn.length === 0) {
                    $layoutCtn = $('<div class="dock-layout dock-layout-'+direction+'" data-direction="'+direction+'">');
                    $layoutContainer.append($layoutCtn);
                }

                $divNoteCt.html(note.text.replace(/body/g,'div'));
                $layoutCtn.append($divNote);
                return $ctn[0].outerHTML;
            }

            // 在这里定义成功事件
            promise.done(function (html) {
                var xhr, formData;
                // 生成最终的 html
                html = html.formatEL({
                    pageWidth: window.screen.width/MM2PX + 'mm',
                    pageHeight: pageHeight/MM2PX + 'mm',
                    encoding: 'UTF-8',
                    entitiesHtml: arrHtml.join('')
                });

                // 表单数据
                formData = new FormData();
                formData.append('html', html);

                xhr = new XMLHttpRequest();
                xhr.responseType = 'arraybuffer';
                xhr.open('POST', '/admin/getShareReportPDF');
                xhr.onload = function () {
                    var blob, url, lkPdfFile;
                    if (this.status === 200) {
                        blob = new Blob([xhr.response], {type: "application/pdf"});
                        url = URL.createObjectURL(blob);

                        // 这里用 a 标签来模拟下载，而不直接使用 window.open
                        // 是因为 window.open 不能自定义下载文件的名称
                        // 而 a 标签可以通过设置 download 属性来自定义下载文件的名称
                        lkPdfFile = document.createElement('a');
                        lkPdfFile.style = "display: none";
                        lkPdfFile.id = "lkPdfFile";
                        lkPdfFile.href = url;
                        lkPdfFile.download = 'BeopReport_' + new Date().format('yyyy-MM-dd HH-mm-ss') + '.pdf';
                        
                        document.body.appendChild(lkPdfFile);
                        lkPdfFile.click();
                        window.URL.revokeObjectURL(url);
                    } else {
                        alert('生成报告失败，请刷新页面重试！');
                    }
                    // 隐藏 loading
                    Spinner.stop();
                }
                xhr.send(formData);

            }).fail(function (e) {
                throw e;
            });
        });

    };

    var initEmailBox = function () {
        var $modalSendEmail = $('#modalSendEmail');
        var $mailList = $('#mailList');
        var $mailTo = $('#mailTo');
        var $btnSend = $('#btnSend');
        var store = null;

        function displayLoading() {
            $mailList.html('<div class="list-group-item item-loading">Loading...</div>');
        }
        function displayErr() {
            $mailList.html('<div class="list-group-item item-failed">load failed, \
                    <a href="javascript:;">click to reload</a></div>');
        }
        function displayEmpty() {
            $mailList.html('<div class="list-group-item item-empty">No avaliable users.</div>');
        }

        function addEmail(index) {
            var row = store[index];
            // 如果指定的地址已经存在，则不添加
            if($mailTo.find('[data-mail="'+row.useremail+'"]').length > 0) return;
            var html = '<div class="inner-mail-wrap" spellcheck="false" data-mail="{2}" data-index="{0}"><div class="inner-mail" contenteditable="false">\
                        <span class="user-name">{1}</span>\
                        <span class="mail-addr">&lt;{2}&gt;;</span>\
                        </div>&nbsp;</div>'
                        .format(index, row.userfullname, row.useremail)
            $mailTo.append(html);
        }
        function removeEmail(index) {
            $mailTo.find('[data-index="'+index+'"]').remove();
        }

        function loadMailList() {
            // 如果已经加载过一次，则无需再次加载
            if($mailList.find('.item-mail').length > 0) return;

            return WebAPI.get('/admin/sharedUserList/'+AppConfig.userId)
                .done(function (rs) {
                    var arrHtml = [];
                    if(rs.success === true) {
                        // 过滤掉没有 email 的账号
                        rs.data = rs.data.filter(function (row, i) {
                            if(row.useremail) return true;
                            return false;
                        });
                        store = rs.data || [];
                        if(rs.data && rs.data.length > 0) {
                            $mailList.empty();
                            rs.data.forEach(function (row, i) {
                                arrHtml.push(
                                    '<div class="list-group-item item-mail" data-index="{0}">\
                                    <span class="user-name">{1}</span>\
                                    <span class="mail-addr">&lt;{2}&gt;</span>\
                                    <span class="item-status glyphicon glyphicon-ok-circle"></span>\
                                    </div>'
                                    .format(i, row.userfullname, row.useremail)
                                );
                            });
                            $mailList.html(arrHtml.join(''));
                        } else {
                            displayEmpty();
                        }
                    } else {
                        displayErr();
                    }
                })
                .fail(function () {
                    displayErr();
                });
        }

        $modalSendEmail.off('shown').on('shown.bs.modal', function () {
            window.setTimeout(loadMailList, 500);
        });

        $modalSendEmail.off('hidden').on('hidden.bs.modal', function () {
            // 清空邮件输入栏
            $mailTo.empty();
            // 取消联系人列表的选中状态
            $mailList.children('.on').removeClass('on');
        });

        $modalSendEmail.on('click', 'item-failed>a', function (e) {
            loadMailList();
            e.stopPropagation();
        });

        $modalSendEmail.on('click', '.item-mail', function () {
            var $this = $(this);
            var isRemove = $this.hasClass('on');
            if(isRemove) {
                $this.removeClass('on');
                removeEmail($this.attr('data-index'));
            } else {
                $this.addClass('on');
                addEmail($this.attr('data-index'));
            }
        });

        // 邮件发送事件
        $btnSend.click(function () {
            var list = $mailTo.children('.inner-mail-wrap').map(function () {return $(this).attr('data-mail')});
            if(!list || !list.length) return;
            $.post('/sendEmail', {
                'subject': 'Beop 数据分析报告分享',
                'body': '%s %s用户使用BeOP平台向您发送了一份报告，请点击链接进行查看: '+window.location.href,
                'recipients': ([]).join.call(list, ';'),
                'userId': AppConfig.userId,
            }).done(function (rs) {
                rs = JSON.parse(rs);
                if(rs.status === 'OK') {
                    alert('邮件发送成功!');
                } else {
                    alert('邮件发送失败!');
                }
            });
        });
    };

    $(function () {
        //whether is running with mobile device.
        if (navigator.userAgent.match(/iP(ad|hone|od)/i)) AppConfig.isMobile = true;

        ElScreenContainer.innerHTML = '';
        InitI18nResource(navigator.language.split('-')[0]);
        // attach events
        attachEvents();
    }); 

} (jQuery, window));
;(function (exports) {

    function ReportTplPanel(screen) {
        this.close();

        this.screen = screen;
        this.container = screen.reportTplPanelCtn;
        this.treeCtn = null;
    }

    +function () {
        
        this.show = function () {
            var _this = this;
            
            this.treeCtn = document.createElement('ul');
            this.treeCtn.id = 'reportTplTree';
            this.treeCtn.className = 'ztree';
            this.container.appendChild(this.treeCtn);

            $.fn.zTree.init($(this.treeCtn), {
                async: {
                    enable: true,
                    type: 'get',
                    url: function (treeId, treeNode) {
                        var url = "/factory/material/group/report";
                        // 首次加载
                        if (!treeNode) {
                            return url;
                        } else {
                            return url + '/' + treeNode.id;
                        }
                    },
                    // 将 PO 转换成 VO
                    dataFilter: function (treeId, parentNode, rs) {
                        if (rs.status !== 'OK') {
                            return [];
                        }
                        // 因为用不到数据，所以这里就不对数据进行缓存
                        
                        return rs.data.map(function (row) {
                            return {
                                id: row._id,
                                name: row.name,
                                isParent: row.isFolder === 1
                            }
                        });
                    }
                },
                view: {
                    showIcon:false,
                    showLine: false,
                    // 不允许用户同时选中多个进行拖拽
                    selectedMulti: false
                },
                callback: {
                    onNodeCreated: function (e, treeId, treeNode) {
                        var domA;
                        $('#'+ treeNode.tId + '_switch').prependTo($('#'+ treeNode.tId + '_a'));
                        if (!treeNode.isParent) {
                            domA = _this.treeCtn.querySelector('#'+treeNode.tId + '_a');
                            domA.setAttribute('draggable', 'true');
                            domA.classList.add('.report-tpl-item');
                            domA.dataset.id = treeNode.id;
                            domA.ondragstart = function (e) {
                                var dataTransfer = e.dataTransfer;
                                dataTransfer.setData('id', this.dataset.id);
                                dataTransfer.setData('type', 'template');
                            };
                        }
                    }
                }
            });

        };

        this.attachEvents = function () {
            var _this = this;

        };

        this.close = function () {
            this.screen = null;

            $.fn.zTree.destroy("reportTplTree");

            this.container = '';
        };

    }.call(ReportTplPanel.prototype);

    exports.ReportTplPanel = ReportTplPanel;

} ( namespace('factory.panels') ));
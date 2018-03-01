;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.StrategyTable'), function (exports) {

    function View(container) {
        this.container = container;
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = View;

        this.init = function (intents) {
            this.theme.intents = intents;
        };

        this.ready = function (model) {

            return (
                '<div>' + 
                this.theme.leftBtnGroup(model.selectedIds) +
                this.theme.searchField(model.searchKey) +
                this.theme.rightBtnGroup(model.items, model.selectedIds) +
                '</div><div>' + 
                this.theme.table(model.items, model.selectedIds, model.searchKey) +
                '</div>'+
                this.theme.modalFrame()

            );
        };

        this.display = function (representation) {
            this.container.innerHTML = representation;

            this.attachEvents();
        };

        this.attachEvents = function () {

        };

    }.call(View.prototype);

    +function () {

        this.intents = {};

        this.leftBtnGroup = function (selectedIds) {
            var state = selectedIds.length ? '' : 'disabled';
            return (
                '<div class="navLeftBtn">\
                    <button class="btn btn-default addBtn" onclick="'+this.intents['clickAddBtn']+'()">新增</button>\
                    <button class="btn btn-default removeBtn" '+state+' onclick="'+this.intents['removeSelectedRows']+'({})">删除</button>\
                </div>'
            );
        };

        this.searchField = function (searchKey) {
            var searchKey = searchKey === undefined ? '' : searchKey;
            return (
                '<div class="navSearch">\
                    <input type="text" placeholder="搜索" value="'+searchKey+'" onchange="'+this.intents['search']+'({target:this})">\
                </div>'
            );
        };

        this.rightBtnGroup = function (items, selectedIds) {
            var startBtnState;
            var stopBtnState;
            if(selectedIds.length === 0){
                startBtnState = 'disabled';
                stopBtnState = 'disabled';
            }else{
                var enableArr = [];
                items.forEach(function(row){
                    if(selectedIds.indexOf(row._id) !== -1){
                        if(row.status === 1){//选中的是启用状态
                            enableArr.push(row);
                        }
                    }
                })
                if(enableArr.length === 0){//选中的控件都是未启用的状态
                    startBtnState = '';
                    stopBtnState = 'disabled';
                }else if(enableArr.length === selectedIds.length){//选中的控件都是启用状态
                    startBtnState = 'disabled';
                    stopBtnState = '';
                }else{//都是启用的  或者 有启用的 有未启用的
                    startBtnState = '';
                    stopBtnState = '';
                }
            }
            return (
                '<div class="navRightBtn">\
                    <button class="btn btn-default startBtn" '+startBtnState+' onclick="'+this.intents['enableStrategy']+'({target: this})">启用</button>\
                    <button class="btn btn-default stopBtn" '+stopBtnState+' onclick="'+this.intents['disableStrategy']+'({target: this})">禁用</button>\
                </div>'
            );
        };

        this.table= function(items, selectedIds, searchKey) {
            var _this = this;
            var renderTrDatas = [];
            var tbodyStr;
            if(searchKey !== ''){
                items.forEach(function(row){
                    if($.trim(row.name).indexOf(searchKey) !== -1){
                        renderTrDatas.push( _this.layoutTr(row) );
                    }
                })
            }else{
                if(selectedIds.length === 0){
                    items.forEach(function(row){
                        renderTrDatas.push( _this.layoutTr(row) );
                    })
                } else {
                    items.forEach(function(row){
                        if(selectedIds.indexOf(row._id) !== -1){
                            renderTrDatas.push( _this.layoutTr(row,true) );
                        }else{
                            renderTrDatas.push( _this.layoutTr(row) );
                        }
                    })
                }
            }
            return (
                '<table class="strategyTable">\
                    <thead>\
                        <tr>\
                            <th style="width:12%">名称</th>\
                            <th style="width:12%">从属</th>\
                            <th style="width:5%">状态</th>\
                            <th style="width:12%">上次执行</th>\
                            <th style="width:5%">运行间隔</th>\
                            <th style="width:5%">类型</th>\
                            <th style="width:5%">修改人</th>\
                            <th style="width:12%">修改时间</th>\
                            <th style="width:20%">描述</th>\
                        </tr>\
                    </thead>\
                    <tbody>'+renderTrDatas.join('')+'</tbody>\
                </table>'
            );
        };

        this.layoutTr = function(detail,flag) {
            var type = detail.type === 0 ? '诊断': (detail.type === 1 ? 'KPI' : '计算点' );
            var status = detail.status === 0 ? '未启用' : '启用';
            var className = flag ? 'selected' : '' ;
            return ('<tr data-id="'+detail._id+'" parent-id="'+detail.nodeId+'" ondblclick="'+this.intents['dblclickRow']+'({target: this});" \
                        onclick="'+this.intents['clickRow']+'({target: this});" class="'+className+'">\
                        <td title="'+detail.name+'">'+detail.name+'</td>\
                        <td title="'+detail.nodeId+'">'+detail.nodeId+'</td>\
                        <td>'+status+'</td>\
                        <td>'+detail.lastRuntime+'</td>\
                        <td>'+detail.interval+'</td>\
                        <td>'+type+'</td>\
                        <td>'+detail.userId+'</td>\
                        <td>'+detail.lastTime+'</td>\
                        <td title="'+detail.desc+'">'+detail.desc+'</td>\
                    </tr>')
        };  

        this.modalFrame = function() {
            return ' <div class="modal fade" id="strategyTableModal">\
                        <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                                    <span class="glyphicon glyphicon-remove"></span>\
                                </button>\
                                <h4 class="modal-title">新增</h4>\
                            </div>\
                            <div class="modal-body gray-scrollbar" style="height:260px;">\
                                <table id="strategyAddTable">\
                                    <thead>\
                                        <tr>\
                                            <th>名称</th>\
                                            <th>从属</th>\
                                            <th>状态</th>\
                                            <th>上次执行</th>\
                                            <th>运行间隔</th>\
                                            <th>类型</th>\
                                            <th>修改人</th>\
                                            <th>修改时间</th>\
                                            <th>描述</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody>\
                                        <tr>\
                                            <td class="name"></td>\
                                            <td class="nodeId"></td>\
                                                <td class="status"></td>\
                                                <td class="lastRuntime"></td>\
                                                <td class="interval"></td>\
                                                <td class="type"></td>\
                                                <td class="userId"></td>\
                                                <td class="lastTime"></td>\
                                                <td class="desc"></td>\
                                            </tr>\
                                        </tbody>\
                                    </table>\
                            </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-default">取消</button>\
                                <button type="button" class="btn btn-primary btn-submit" onclick="'+this.intents['sureAdd']+'({})">确定</button>\
                                </div>\
                            </div>\
                        </div>\
                    </div>';
        };

    }.call(View.prototype.theme = {});

    exports.View = View;
}));
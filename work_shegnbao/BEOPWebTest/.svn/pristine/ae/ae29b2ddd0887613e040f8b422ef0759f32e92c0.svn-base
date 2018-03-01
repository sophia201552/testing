var ModalDataMonitorList = (function(){
    function ModalDataMonitorList(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
    };

    ModalDataMonitorList.prototype = new ModalBase();
    ModalDataMonitorList.prototype.optionTemplate = {
        name:'toolBox.modal.DATA_MONITOR_LIST',
        parent:0,
        mode:['dataMonitorList'],
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalDataMonitorList',
        scroll:false
    };
    ModalDataMonitorList.prototype.configModalOpt= {
        
    };
    ModalDataMonitorList.prototype.initLeftMonitorList = function(monitorList,data){
        var _this = this;
        var _value;
        var listLeft = document.createElement('div');
        listLeft.className = 'monitorListLeft gray-scrollbar';

        var listLeftContentGroup = document.createElement('div');
            listLeftContentGroup.className = 'listLeftContentGroup';
        
        for(var i = 0;i<monitorList.content.length;i++){
            var item = monitorList.content[i];
            var listLeftContent = document.createElement('div');
            listLeftContent.className = 'panel panel-default';

            var listLeftTitle = document.createElement('div');
            listLeftTitle.className = 'listLeftTitle';

            var listLeftContentList = document.createElement('div');
            listLeftContentList.className = 'listLeftContentList';
            
            listLeftTitle.innerHTML += '\
                    <div class="panel-title">\
                        <table class="table table-hover">\
                            <tbody>\
                                <tr class="kpi-tr-index show-detail">\
                                    <td>' + item.system + '</td>\
                                </tr>\
                            </tbody>\
                        </table>\
                    </div>\
                    ';
            listLeftContentList.innerHTML = '\
                <table>\
                    <tbody>\
                        <tr>\
                            <td>参数</td>\
                            <td>当前值</td>\
                            <td>选择</td>\
                        </tr>\
                    </tbody>\
                </table>\
                ';
            listLeftContent.appendChild(listLeftTitle);
            for(var j = 0; j < item.parameter.length;j++){
                for(var m = 0;m < data.length;m++){
                    if(item.parameter[j].point != data[m].name){
                             continue;
                        }else{
                            _value = data[m].value;
                        }
                };    
                listLeftContentList.innerHTML += '\
                    <div id="para-collapse" class="">\
                        <div class="bodyPn borderColorTemp4">\
                            <table class="table table-hover">\
                                <tbody>\
                                    <tr class="kpi-tr-index show-detail">\
                                        <td>' + item.parameter[j].legend + '</td>\
                                        <td>' + Number(_value).toFixed(1) + '</td>\
                                        <td>\
                                            <form>\
                                                <input type="checkbox" id="selectedCheckbox" value="'+ item.parameter[i].point +'" name="'+ item.parameter[j].legend +'">\
                                            </form>\
                                       </td>\
                                    </tr>\
                                </tbody>\
                            </table>\
                        </div>\
                    </div>\
                ';
            listLeftContent.appendChild(listLeftContentList);
            };
            listLeftContentGroup.appendChild(listLeftContent);
        };
        listLeft.appendChild(listLeftContentGroup);
        this.container.appendChild(listLeft);
        this.attachEvent();
        if($._data($('#selectedCheckbox')[0],"events") && $._data($('.table tr'),"events")){
            $('.monitorListLeft').css("width","24%");
        }else{
            $('.monitorListLeft').css("width","100%");
        }
    };
    ModalDataMonitorList.prototype.renderModal = function () {
        this.spinner.stop();
        var _this = this;
        var _pId = 393;
        var postData = this.entity.modal.points;
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds: postData}).done(function(result){
            if($(_this.container).find(".alertErrorInfo")){
                $(_this.container).find(".alertErrorInfo").remove();
            }
            if(!(result.dsItemList[0] && result.dsItemList[0].data))return;
            if(result.dsItemList[0].data.indexOf('content')!==-1){
                var monitorList = JSON.parse(result.dsItemList[0].data);
                    var pArr = [];
                    for(var i = 0;i<monitorList.content.length;i++){
                        var arr = monitorList.content[i].parameter;
                        for(var j = 0;j<arr.length;j++){
                            pArr.push(arr[j].point);
                        }
                    }
                    var opt1= { pointList: pArr , proj: _pId  }
                    console.log(opt1);
                    WebAPI.post('/get_realtimedata', opt1).done(function (data){
                        console.log(data);
                        _this.initLeftMonitorList(monitorList,data);
                    })
            }else{
                var alertErrorInfo = document.createElement('div');
                alertErrorInfo.className = 'alertErrorInfo';
                alertErrorInfo.innerHTML = '所拖入数据点的格式不符合该控件所需的数据格式,数据点格式参考上海来福士的Proj_ParaQueyInfo';
                _this.container.appendChild(alertErrorInfo);
            }
        });
    }; 
    ModalDataMonitorList.prototype.updateModal = function (points) {
        var _this = this;
    };
    ModalDataMonitorList.prototype.attachEvent = function(){
        $('.listLeftTitle').on('click',function(e){
            var index = $(".listLeftTitle").index($(this));
            $('.listLeftContentList').eq(index).toggle('slow');
        })
    }
    ModalDataMonitorList.prototype.showConfigMode = function () {

    };
    ModalDataMonitorList.prototype.initConfigModalOpt = function () {

    };
    ModalDataMonitorList.prototype.setModalOption = function(option){

    };
    
    return ModalDataMonitorList;

})();
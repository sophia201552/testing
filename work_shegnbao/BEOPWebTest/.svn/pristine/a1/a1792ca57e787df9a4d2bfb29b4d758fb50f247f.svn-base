var ModalAppKPICollect = (function(){
	function ModalAppKPICollect(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
    };

    ModalAppKPICollect.prototype = new ModalBase();
    ModalAppKPICollect.prototype.optionTemplate = {
        name:'toolBox.modal.APP_KPI_COLLECT',
        parent:3,
        mode:'custom',
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalAppKPICollect',
		scroll:false
    };
	ModalAppKPICollect.prototype.configModalOptDefault= {
		header:{
			'title':'配置',
			'needBtnClose':true
		},
		area:[{
			'module':'multiDataConfig',
			'data':{
				'variable':[],
				'param':[{'type':'name','name':'数据标题'},{'type':'data','name':'数据点位'},{'type':'unit','name':'数据单位'},{'type':'scale','name':'小数点位'}]
			}
		}],
		result:{}
    };

    ModalAppKPICollect.prototype.renderModal = function () {
    	this.spinner.stop();
		var _this = this;
		var divAppKPi = document.createElement('div');
		var divKpiList = document.createElement('div');
		divAppKPi.className= 'appKpi';
		divKpiList.className = 'divKPIList';
		this.container.appendChild(divAppKPi);
		divAppKPi.appendChild(divKpiList);
		divKpiList.innerHTML = '';
		var optTitle = _this.entity.modal.option.title;
		if(optTitle){
			if(optTitle.text || optTitle.data){
				divKpiList.innerHTML = '\
				<div class="divSingleType divListTitle">\
	                <div class="divTypeTitle ">'+ _this.entity.modal.option.title.text +'</div>\
	                <div class="divKPIListRight">\
						<div class="divTypeVal divKPINow" data-pt="'+ _this.entity.modal.option.title.data +'" data-scale="' + _this.entity.modal.option.title.scale + '"></div>\
	               		<div class="divTypeUnit divKPIUnit">'+ (_this.entity.modal.option.title.unit?_this.entity.modal.option.title.unit:'') +'</div>\
	                </div>\
	            </div>';
			}
		}
		for(var i = 0;i<_this.entity.modal.option.param.length;i++) {
			divKpiList.innerHTML += '\
	        	<div class="divSingleType">\
	                <div class="divTypeTitle ">' + _this.entity.modal.option.param[i].name + '</div>\
	                <div class="divKPIListRight">\
						<div class="divTypeVal" data-scale="' + _this.entity.modal.option.param[i].scale + '" data-pt="' + _this.entity.modal.option.param[i].data + '"></div>\
	               		<div class="divTypeUnit ">' + _this.entity.modal.option.param[i].unit + '</div>\
	                </div>\
	            </div>\
			';
		}
		this.container.appendChild(divAppKPi);

    };

    ModalAppKPICollect.prototype.updateModal = function (points) {
		var data;
		for (var i = 0; i < points.length ;i++){
			var dom = this.container.querySelector('[data-pt="'+ points[i].dsItemId +'"]');
			if(dom){
				if(!isNaN(Number(points[i].data))) {
					if(dom.dataset.scale && !isNaN(parseInt(dom.dataset.scale))) {
						if (parseInt(dom.dataset.scale) > 10) {
							data = parseFloat(points[i].data).toFixed(10);
						} else {
							data = parseFloat(points[i].data).toFixed(parseInt(dom.dataset.scale));
						}
					}else{
						data = parseFloat(points[i].data).toFixed(2);
					}
				}else{
					data = points[i].data;
				}
				dom.innerText = data;
			}
		}
        //拖入数据的页面渲染;
    };	
    ModalAppKPICollect.prototype.showConfigMode = function () {
    };
	ModalAppKPICollect.prototype.initConfigModalOpt = function () {
		var _this = this;
		if(this.entity.modal.option)this.configModalOpt.area[0].data.variable = [this.entity.modal.option];
		this.configModalOpt.result.func = function(option){
			_this.setModalOption(option);
		}
    };
	ModalAppKPICollect.prototype.setModalOption = function(option){
    	//配置框中各项数据的保存；
    	this.entity.modal.points = [];
		this.entity.modal.option = {};
		for(var i = 0;i< option.dataInfoList.length;i++){
			option.dataInfoList[i].title.data && this.entity.modal.points.push(option.dataInfoList[i].title.data);
			this.entity.modal.option = option.dataInfoList[i];
			for (var j = 0; j < option.dataInfoList[i].param.length ;j++){
				if(option.dataInfoList[i].param[j].data)this.entity.modal.points.push(option.dataInfoList[i].param[j].data);
			}
		}
    	this.entity.modal.interval = 5;
	};
    ModalAppKPICollect.prototype.goBackTrace = function (data) {

    };
    
    return ModalAppKPICollect;

})();
/**
/**
 * Created by win7 on 2016/7/15.
 */
class BaseConfigModule{
    constructor(objModal,area){
        this.objModal = objModal;
        this.area = area;
        this.store = {};
    }
    init(){
        this.initOption();
        this.initOptionDetail();
        this.initData();
        this.initStyle();
        this.attachEvent();
    }
    attachEvent(){
    }
    initStyle(){
        if (this.area.style){
            this.objModal.modalStyle.innerHTML += this.area.style;
        }
    }
    initOption(){
        if (this.defaultOpt){
            //Object.assign(this.defaultOpt,this.widget)
            $.extend(true,this.area,this.defaultOpt,this.area)
        }
    }
    initOptionDetail(){

    }
    initData(){

    }
    getData(){
        var store;
        for (let i = 0; i < this.area.widget.length; i++) {
            store = this.area.widget[i].instantiation.getData();
            store && (this.store[this.area.widget[i].type] = store);
        }
        return this.store;
    }
    destroy(){
        for (let i = 0 ; i < this.area.widget.length ;i++){
            this.area.widget[i].instantiation.destroy();
            this.area.widget[i].instantiation = null;
        }
    }
}

class TimeConfigModule extends BaseConfigModule{
    constructor (objModal,area){
        super(objModal,area);
        this.defaultOpt = {
            name:'option',
            type:'option',
            module:'timeConfig',
            widget:[
                {type:'mode',
                    subWidget:[
                        {
                            type: 'interval', callback: function (type,store) {
                                if (type == 'mode'){
                                    switch (store.val){
                                        case '0':
                                            $(this.widget.dom).hide();
                                            break;
                                        default:
                                            $(this.widget.dom).show();
                                            break;
                                    }
                                }
                            }},
                        {
                            type:'recentTimeCustom',
                            callback:function(type,store){
                                if (type == 'mode'){
                                    switch (store.val){
                                        case '2':
                                            $(this.widget.dom).show();
                                            break;
                                        default:
                                            $(this.widget.dom).hide();
                                            break;
                                    }
                                }
                        }},{
                            type:'recentTime',
                            callback:function(type,store){
                            if (type == 'mode'){
                                    switch (store.val){
                                        case '0':
                                            $(this.widget.dom).show();
                                            break;
                                        default:
                                            $(this.widget.dom).hide();
                                            break;
                                    }
                                }
                        }},{
                            type:'date',
                            callback:function(type,store){
                            if (type == 'mode'){
                                switch (store.val){
                                    case '1':
                                        $(this.widget.dom).show();
                                        break;
                                    default:
                                        $(this.widget.dom).hide();
                                        break;
                                }
                            }
                        }}
                ]},
                {type:'recentTimeCustom',subWidget:[{type:'interval',callback:function(type,store){
                    if(type == 'recentTimeCustom'){
                        if(this.area.dom.querySelector('.divMode>select').value != '2' )return;
                        var firstSelect,secondSelect;
                        switch(store.unit){
                            case 'second' :
                            firstSelect = 'm5';
                            secondSelect = 'm1';
                            break;
                        case 'minute' :
                            firstSelect = 'm5';
                            secondSelect = 'm1';
                            break;
                        case 'hour':
                            firstSelect = 'h1';
                            secondSelect = 'm5';
                            break;
                        case 'day' :
                            firstSelect = 'd1';
                            secondSelect = 'h1';
                            break;
                        case 'month' :
                            firstSelect = 'M1';
                            secondSelect = 'd1';
                            break;
                        }
                        $(this.widget.dom).find('option').hide();
                        this.widget.dom.querySelector('select').value = firstSelect;
                        $(this.widget.dom.querySelector('[value=' + firstSelect + ']')).show();
                        $(this.widget.dom.querySelector('[value=' + secondSelect + ']')).show();
                    }
                }}]},
                {type:'recentTime',subWidget:[{
                    type: 'interval',
                    callback: function (type, store) {
                        if (type != 'recentTime')return;
                        if(this.area.dom.querySelector('.divMode>select').value != '0' )return;
                        var interval;
                        switch (store.val) {
                            case 'today' :
                                interval = 'h1';
                                break;
                            case 'yesterday' :
                                interval = 'h1';
                                break;
                            case 'thisWeek':
                                interval = 'd1';
                                break;
                            case 'lastWeek' :
                                interval = 'd1';
                                break;
                            case 'thisYear' :
                                interval = 'M1';
                                break;
                        }
                        return interval
                    }
                }
                ]},
                {type:'interval'},
                {type:'date',subWidget:[{type: 'interval',callback:function(){
                    if(this.area.dom.querySelector('.divMode>select').value != '1' )return;
                    $(this.widget.dom).find('option').show();
                }}]}
            ]
        }
    }
    initOptionDetail(){
        if (!this.area.opt)return;
        for (let i = 0; i < this.area.widget.length; i++) {
            if(!this.area.widget[i].opt)this.area.widget[i].opt = {};
            if (this.area.opt.recentTime && this.area.widget[i].type == 'recentTime') {
                this.area.widget[i].opt.option = this.area.opt.recentTime
            }
        }
    }
    initData(){
        if (!this.area.data)return;
        for (let i = 0; i < this.area.widget.length; i++) {
            if (this.area.data.mode && this.area.widget[i].type == 'mode') {
                this.area.widget[i].data = {val:this.area.data.mode};
            }
            if (this.area.data.interval && this.area.widget[i].type == 'interval') {
                this.area.widget[i].data = this.area.data.interval;
            }
            if (this.area.data.recentTimeCustom && this.area.widget[i].type == 'recentTimeCustom') {
                this.area.widget[i].data = this.area.data.recentTimeCustom
            }
            if (this.area.data.date && this.area.widget[i].type == 'date'){
                this.area.widget[i].data = this.area.data.date;
            }
        }
    }
    getData(){
        for (let i = 0; i < this.area.widget.length; i++) {
            this.store[this.area.widget[i].type] = this.area.widget[i].instantiation.getData();
        }
        var result = {};
        if (this.store.mode.val == '0'){
            result = {
                startTime:this.store.recentTime.startTime,
                endTime:this.store.recentTime.endTime,
                recentTime:this.store.recentTime.recentTime,
                format:this.store.recentTime.format
            }
        }else if (this.store.mode.val == '1'){
            result = {
                startTime:this.store.date.startTime,
                endTime:this.store.date.endTime
            }
        }else if (this.store.mode.val == '2'){
            result = {
                unit:this.store.recentTimeCustom.unit,
                val: this.store.recentTimeCustom.val
            }
        }
        result.mode = this.store.mode.val;
        !result.format && (result.format = this.store.interval.val);
        return result;
    }
}
class DataSourceDragModule extends BaseConfigModule{
    constructor (objModal,area) {
        super(objModal, area);
        this.defaultOpt = {
            name:'datasource',
            type:'datasource',
            module:'dsDrag',
            widget:[
                {
                    type:'datasource',
                    opt:{
                        variable:[
                            {type:'x',name:'X',data:[]},
                            {type:'y',name:'Y',data:[]}
                        ]
                    }
                }
            ]
        }
    }
    initData(){
        if (!this.area.data)return;
        for (let i = 0; i < this.area.widget.length; i++) {
            if(this.area.widget[i].type == 'datasource'){
                this.area.widget[i].opt.variable = this.area.data;
                break;
            }
        }
    }
    getData(){
        for (let i = 0; i < this.area.widget.length; i++) {
            this.store[this.area.widget[i].type] = this.area.widget[i].instantiation.getData();
        }
        var points = [],cog = [];
        var arrDsParam = Object.keys(this.store['datasource']);
        for (let i = 0; i < arrDsParam.length; i++){
            points.push(this.store['datasource'][arrDsParam[i]].data);
            cog.push(this.store['datasource'][arrDsParam[i]].cog)
        }
        return {points:points,chartCog:cog};
    }
}

class DataInfoListModule extends BaseConfigModule{
    constructor (objModal,area) {
        super(objModal, area);
        this.defaultOpt = {
            name:'dataInfoList',
            type:'dataInfoList',
            module:'dataInfoList',
            style:`
                .divDataBindList .glyphicon {
                    cursor:pointer;
                }
                .divDiaTitle{
                    display: block;
                    padding: 0;
                    margin-top: -15px;
                }
                .modal-body .col-xs-2 {
                    font-size: 16px;
                    font-weight: bold;
                    line-height: 34px;
                    text-align: left;
                    width:16.6666667%;
                }
                .col-xs-10{
                    width:83.3333333%;
                }
                .divBtnAddParam{
                    margin-top: 20px;
                    left: 542px;
                    top:20px;
                }
                .divBtnAddContent{
                    left: 95%;
                    top: -37px;
                }
                .divDataListTtl {
                    font-size: 16px;
                    margin-bottom: 20px;
                    padding-right: 5%;
                }
                .spDataListTtl {
                    width: 39%;
                    text-align: center;
                }
                .spDataListNameTtl {
                    width: 26%;
                }
                .spDataListUnitTtl {
                    width: 20%;
                }
                .spDataListScaleTtl{
                    width:16%;
                }
                .spDataListDsTtl {
                    width: 41%;
                }
                .divDataParam {
                    margin-bottom:1%;
                }
                .divDataParam .form-control {
                    margin: 0 2%;
                }
                .divDataParam .iptName {
                    width:26%;
                }
                .divDataParam .iptUnit {
                    width:16%;
                }
                .divDataParam .iptScale{
                    width:16%;
                }
                .divDataParam .divDs  {
                    margin: 0 2%;
                    width: 41%;
                    text-align: center;
                    color: #ccc;
                    border: 1px dashed #ccc;
                    height: 34px;
                    display: inline-block;
                    padding: 6px 15px;
                    border-radius: 5px;
                }
                .divDataParam .divDs:hover  {
                    border-color: #66afe9;
                    cursor: pointer;
                    outline: 0;
                    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
                    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
                }
                .divDataParam .divDs.hasDs  {
                    background-color: #fff;
                    border: 1px solid #dcdcdc;
                    color: #4c9f42;
                    border-radius: 5px;
                }
                .divDataParam .divDs.hasDs:hover  {
                    cursor: pointer;
                    outline: 0;
                    -webkit-box-shadow: none;
                    box-shadow: none;
                }
                .divDataParam .divDs .spDs{
                    display:none;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    width: 90%;
                }
                .divDataParam .divDs .btnDsDel{
                    display:none;
                    top: 2px;
                    color: #ccc;
                    float: right;
                }
                .divDataParam .divDs .spHoverTip{
                    display:none;
                }
                .divDataParam .divDs:hover .spNormalTip  {
                    display:none;
                }
                .divDataParam .divDs:hover .spHoverTip  {
                    display:inline-block;
                }
                .divDataParam .divDs.hasDs .btnDsDel  {
                    display:inline-block;
                }
                .divDataParam .divDs.hasDs:hover .btnDsDel  {
                    color: darkorange;
                }
                .divDataParam .divDs.hasDs .spDsTip {
                    display:none;
                }
                .divDataParam .divDs.hasDs .spDs {
                    display:inline-block;
                }
                .btnParamDel {
                    width: 4%;
                }
                .glyphiconPlus{
                    position:relative;
                    top:-16px;
                }
            `,
            widget:[
                {
                    type:'dataInfoList',
                    opt:{
                        variable:[
                            {name:'',unit:'',data:[]}
                        ]
                    }
                }
            ]
        }
    }
    initData(){
        if (!this.area.data)return;
        for (let i = 0; i < this.area.widget.length; i++) {
            if(this.area.widget[i].type == 'dataInfoList'){
                this.area.widget[i].opt.variable = this.area.data;
                break;
            }
        }
    }
    getData(){
        for (let i = 0; i < this.area.widget.length; i++) {
            this.store[this.area.widget[i].type] = this.area.widget[i].instantiation.getData();
        }
        return {dataInfoList:this.store['dataInfoList']};
    }
}

class MultiDataConfigModule extends BaseConfigModule{
    constructor (objModal,area) {
        super(objModal, area);
        this.defaultOpt = {
            name:'multiDataConfig',
            type:'multiDataConfig',
            module:'multiDataConfig',
            widget:[
                {
                    type:'multiDataConfig',
                    opt:{
                        role:'',
                        variable:[],
                        param:[{'type':'name','name':'数据标题'},{'type':'data','name':'数据点位'},{'type':'unit','name':'数据单位'}]
                    }
                }
            ]
        }
    }
    initData(){
        if (!this.area.data)return;
        for (let i = 0; i < this.area.widget.length; i++) {
            if(this.area.widget[i].type == 'multiDataConfig'){
                if (!this.area.data)break;
                this.area.widget[i].opt.variable = this.area.data.variable?this.area.data.variable:[];
                this.area.data.param && (this.area.widget[i].opt.param = this.area.data.param);
                break;
            }
        }
    }
    getData(){
        for (let i = 0; i < this.area.widget.length; i++) {
            this.store[this.area.widget[i].type] = this.area.widget[i].instantiation.getData();
        }
        return {dataInfoList:this.store['multiDataConfig']};
    }
}

class RealTimeConfigModule extends BaseConfigModule{
    constructor (objModal,area) {
        super(objModal, area);
        this.defaultOpt = {
            type:'realTime',
            module:'realTime',
            widget:[
                {
                    type:'refreshInterval'
                }
            ],
            style:''
        }
    }
}

class GaugeConfigModule extends BaseConfigModule {
    constructor (objModal,area) {
        super(objModal, area);
        this.defaultOpt = {
            type:'gauge',
            module:'gauge',
            style:'',
            widget:[
                {
                    type:'select',
                    opt:{
                        option:[
                            {val:'high',name:'高值异常'},
                            {val:'low',name:'低值异常'}
                        ]
                    },
                    subWidget:[
                        {type:'range',callback:function(type,store){
                            var iptGrp = this.widget.dom.querySelector('.input-group');
                            if (store.val == 'high'){
                                iptGrp.insertBefore(iptGrp.querySelector('.gaugeGreen'),iptGrp.querySelectorAll('input')[1]);
                                iptGrp.insertBefore(iptGrp.querySelector('.gaugeRed'),iptGrp.querySelectorAll('input')[3]);
                            }else if(store.val == 'low'){
                                iptGrp.insertBefore(iptGrp.querySelector('.gaugeGreen'),iptGrp.querySelectorAll('input')[3]);
                                iptGrp.insertBefore(iptGrp.querySelector('.gaugeRed'),iptGrp.querySelectorAll('input')[1]);
                            }
                        }}
                    ]
                },
                {
                    type:'range',
                    opt:{
                        input:[
                            {val:'',suffix:{text:'节能',style:{background:'lightseagreen'},cls:'gaugeGreen'}},
                            {val:'',suffix:{text:'正常',style:{background:'#428bca'},cls:'gaugeBlue'}},
                            {val:'',suffix:{text:'报警',style:{background:'#ff6c60'},cls:'gaugeRed'}},
                            {val:''}
                        ]
                    }
                }
            ]
        }
    }
    initData(){
        if(!this.area.data)return;
        for (var i = 0; i < this.area.widget.length ;i++){
            if(this.area.widget[i].type == 'select'){
                this.area.widget[i].opt.data = this.area.data.mode;
            }
            if (this.area.widget[i].type == 'range'){
                if (!(this.area.data.range instanceof Array && this.area.data.range.length >= 3))continue;
                this.area.widget[i].opt.input = [
                    {val:this.area.data.range[0],suffix:{text:'节能',style:{background:'lightseagreen'},cls:'gaugeGreen'}},
                    {val:this.area.data.range[1],suffix:{text:'正常',style:{background:'#428bca'},cls:'gaugeBlue'}},
                    {val:this.area.data.range[2],suffix:{text:'报警',style:{background:'#ff6c60'},cls:'gaugeRed'}},
                    {val:this.area.data.range[3]}
                ];
            }
        }
    }
    getData(){
        for (let i = 0; i < this.area.widget.length; i++) {
            this.store[this.area.widget[i].type] = this.area.widget[i].instantiation.getData();
        }
        return this.store;
    }
}

class BaseFooterModule extends BaseConfigModule {
    constructor (objModal,area){
        super (objModal,area);
        this.defaultOpt = {
            type:'footer',
            module:'footer',
            widget:[
                {type:'cancel',
                    func:function(){

                    }
                },
                {type:'confirm',
                    func:function(){

                    }
                }
            ]
        }
    }
}
class FactoryTplFooterModule extends BaseFooterModule {
    constructor (objModal,area){
        super (objModal,area);
        this.defaultOpt = {
            type:'footer',
            module:'factoryTplFooter',
            widget:[
                {type:'cancel'},
                {
                    type:'confirm',
                    func:this.createWidgetTpl
                }
            ]
        }
    }
    createWidgetTpl(opt,data){
        if (!data.tpl.tplJs)return;
        var event = data.event;
        var painter = data.painter;
        var entity,pos;
        if(!data.entity) {
            entity = THtml.prototype.createEntity();
            var model;
            entity._id = ObjectId();
            entity.layerId = '';
            pos = {
                x: event.layerX,
                y: event.layerY
            };
            entity.x = pos.x - 50;
            entity.y = pos.y - 25;
            entity.w = 400;
            entity.h = 400;

            entity.widgetTpl = {
                config:data.tpl.config,
                tplJs:data.tpl.tplJs
            };
            data.tpl.tplJs && eval(data.tpl.tplJs);

            model = new NestedModel(entity);
            painter.store.widgetModelSet.append(model);
        }else{
            var objEntity = data.entity;
            entity = {};

            entity.widgetTpl = {
                config:data.tpl.config,
                tplJs:data.tpl.tplJs
            };

            data.tpl.tplJs && eval(data.tpl.tplJs);

            objEntity.property('widgetTpl');
            objEntity.update({'widgetTpl':entity.widgetTpl});
            objEntity.option($.extend(false, {}, entity.option, {
                'html': entity.option.html,
                'css': entity.option.css,
                'js': entity.option.js
            }));
        }


        // 选中生成的 widget
        painter.setActiveWidgets(entity._id);

        this.instantiation.objModal.hide();
    }

}

class ColorConfigModule extends BaseConfigModule{
    constructor (objModal,area){
        super(objModal,area);
        this.defaultOpt = {
            name:'option',
            type:'option',
            module:'colorConfig',
            widget:[
                {
                    type:'select',
                    opt:{
                        option: [
                                {val: 'transparent', name: '无'},
                                {val: '#ffffff', name: '白'},
                                {val: '#000000', name: '黑'},
                                {val: '#337ab7', name: '蓝'},
                                {val: '#5cb85c', name: '绿'},
                                {val: 'custom', name: '自定义'}
                        ],
                        attr:{
                            class:'col-xs-4 inlineBlock selBgColor'
                        }
                    },
                    subWidget:[{'type':'color',callback:function(type,store){
                        var iptBgColor = this.area.dom.querySelector('.iptBgColor input');
                        var iptBgColorCfg = this.area.dom.querySelector('.iptBgColor');
                        var bgColorView = this.area.dom.querySelector('.bgColorView input');

                        switch(store.val){
                            case 'transparent':
                                bgColorView.style.display = 'none';
                                iptBgColorCfg.style.display = 'none';
                                break;
                            case 'custom':
                                iptBgColorCfg.style.display = 'inline-block';
                                iptBgColor.value = '';
                                iptBgColor.focus();
                                break;
                            default:
                                bgColorView.style.display = 'inline-block';
                                bgColorView.value = store.val;
                                iptBgColor.value = store.val;
                                iptBgColorCfg.style.display = 'none';
                                break;
                        }
                    }}],
                    name:'背景颜色'
                },{
                    type: 'text',
                    opt:{
                        attr:{
                            class:'col-xs-3 iptBgColor',
                            placeholder: '#ffffff'
                        }
                    },
                    subWidget:[{'type':'text',callback:function(type,store){
                        var reg = /^#[0-9a-fA-F]{6}$/;
                        var bgColorView = this.area.dom.querySelector('.bgColorView input');
                        if(reg.test(store.val)){
                            bgColorView.value = store.val;
                        }
                    }}],
                    name: ''
                },{
                    type: 'color',
                    name: '',
                    opt:{
                        attr:{
                            class: 'col-xs-2 bgColorView'
                        }
                    }
                }
            ]
        }
    }
    initData(){
        /*if (!this.area.data)return;
        for (let i = 0; i < this.area.widget.length; i++) {
            if (this.area.data.mode && this.area.widget[i].type == 'mode') {
                this.area.widget[i].store = this.area.data.mode;
            }
            if (this.area.data.interval && this.area.widget[i].type == 'interval') {
                this.area.widget[i].store = this.area.data.interval;
            }
            if (this.area.data.recentTimeCustom && this.area.widget[i].type == 'recentTimeCustom') {
                this.area.widget[i].store = this.area.data.recentTimeCustom
            }
            if (this.area.data.date && this.area.widget[i].type == 'date'){
                this.area.widget[i].store = this.area.data.date;
            }
        }*/
    }
    getData(){
        /*for (let i = 0; i < this.area.widget.length; i++) {
            this.store[this.area.widget[i].type] = this.area.widget[i].instantiation.getData();
        }
        var result = {};
        if (this.store.mode.val == '0'){
            result = {
                startTime:this.store.recentTime.startTime,
                endTime:this.store.recentTime.endTime
            }
        }else if (this.store.mode.val == '1'){
            result = {
                startTime:this.store.date.startTime,
                endTime:this.store.date.endTime
            }
        }else if (this.store.mode.val == '2'){
            result = {
                startTime:this.store.recentTimeCustom.startTime,
                endTime:this.store.recentTimeCustom.endTime
            }
        }
        result.mode = this.store.mode.val;
        result.format = this.store.interval.val;
        return result;*/
    }
    attachEvent(){

    }
}

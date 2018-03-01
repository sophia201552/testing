(function () {

    function TSimpleText(toolbar, container) {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }
    TSimpleText.prototype = Object.create(TShape.prototype);

    TSimpleText.prototype.constructor = TSimpleText;

    TSimpleText.prototype.tpl = '<button class="btn-switch" title="简单文本" data-type="simpleTextCtrl"><span class = "iconfont icon-wenzigongju"></span></button>';

    void function () {

        this.createEntity = function () {
            return {
                option: {
                    text: '<%value%>',
                    float: 0,
                    pageId: '',
                    pageType: '',
                    trigger:{},
                    precision: 2,
                    preview:[],
                    fontFamily:'Calibri',
                    fontSize:12,
                    fontStyle:'normal',
                    textAlign:'left',
                    verticalAlign:'top',
                    fontColor:'#000000',
                    bgColor: '#ffffff',
                    equipments: []
                },
                type: 'CanvasText',
                idDs: []
            }
        }

    }.call(TSimpleText.prototype);

    window.TSimpleText = TSimpleText;
} ());
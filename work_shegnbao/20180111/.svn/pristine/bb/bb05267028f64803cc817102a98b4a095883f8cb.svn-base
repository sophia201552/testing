import React from 'react';
import $ from 'jquery';
import Handsontable from 'handsontable/dist/handsontable.full.js';
import 'handsontable/dist/handsontable.full.min.css';
import s from './HotTable.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
/*
  className,
  skin:'header-color-xxx header-height-xxx',
  option {
    
    checkBox:{
      isShow: false,
      selectedIndexes:[],
      selectedChanged:(selectedIndexs)=>{}
    },
    mousedown:()=>{},
    mouseup:()=>{}
   }https://docs.handsontable.com/0.35.1/Options.html
*/
export default class HotTable extends React.Component {
  constructor(props) {
    super(props);
    this.hot = null;
    this.options = null;
    this.defaultOption={
      checkBox:{
        isShow: false,
        selectedIndexes:[],
        selectedChanged:(selectedIndexes)=>{}
      },
      //event
      mousedown:()=>{},
      mouseup:()=>{}
    };
    this.state={};
  }
  get Handsontable(){
    return Handsontable;
  }
  componentDidMount() {
    
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const {
      option
    } = nextProps;
    let options = Object.assign(
      this.defaultOption,
      option
    );
    let height = $(this.refs.container).height();
    options.height = options.height || (height+'px');
    options = this._setCheckBoxOption(options);
    options = this._setSkinOption(options);
    this.options = options;
    if(this.hot){
      this.hot.updateSettings(options);
      // this.hot.render();
    }else{
      this.hot = new Handsontable(this.refs.container, options);
      this._attachEvent();
    }
    this._setCheckBoxAll();
    
  }
  shouldComponentUpdate(nextProps) {
    return false;
  }
  componentDidUpdate() {}
  render() {
    const {className,skin=''} = this.props;

    return (
      <div ref="container" className={css(`hotTable ${skin}`,className)}>
        
      </div>
    );
  }
  _attachEvent(){
    const _this = this;
    let {mousedown=()=>{},mouseup=()=>{},checkBox={},data=[]} = this.options;
    let $container = $(this.refs.container);
    $container.off('mousedown.main').on('mousedown.main',mousedown);
    $container.off('mouseup.main').on('mouseup.main',mouseup);
    //自定义事件
    let {isShow=false,selectedChanged=()=>{}} = checkBox;
    if(isShow){
      $container.off('click.check',`.${s['checkbox-wrapper']}`).on('click.check',`.${s['checkbox-wrapper']}`,function(){
        let $this = $(this),
          $checkbox = $this.find(`.${s['checkbox']}`);
        
        let row = $this.data('index') >> 0;
        let selectedIndexes = _this.options.checkBox.selectedIndexes.concat();
        
        if ($checkbox.hasClass(s['checked'])) {
          $checkbox.removeClass(s['checked']);
          if($this.hasClass('all')){
            selectedIndexes = [];
            $(`.${s['checkbox-wrapper']}:not(.all) .${s['checkbox']}`,$container).removeClass(s['checked']);
          }else{
            selectedIndexes = selectedIndexes.filter(v => v != row);
          }
        } else {
          $checkbox.addClass(s['checked']);
          if($this.hasClass('all')){
            let $targets = $(`.${s['checkbox-wrapper']}:not(.all) .${s['checkbox']}`,$container).addClass(s['checked']);
            let startIndex = 0;
            // let timer = setInterval(()=>{
            //   if(startIndex<=$targets.length){
            //     $targets.eq(startIndex++).addClass(s['checked']);
            //   }else{
            //     timer = undefined;
            //   }
            // },40);
            // setTimeout(() => {
            //   if(timer){
            //     clearInterval(timer);
            //   }
            // }, 200);
            selectedIndexes = _this.options.data.map((v,i)=>i);
          }else{
            selectedIndexes.push(row);
          }
        }
        setTimeout(() => {
          selectedChanged(selectedIndexes);
        }, 200);
      })
    }
    
  }
  _setSkinOption(options){
    let {skin=''} = this.props;
    skin = skin.split(' ');
    let height = skin.find(v=>v.startsWith('header_height_'));
    
    if(height){
      height = height.replace('header_height_','')>>0;
      options.columnHeaderHeight = height;
    }
    return options;
  }
  _setCheckBoxOption(options){
    let {checkBox={}} = options;
    let {isShow=false,selectedIndexes=[],selectedChanged=()=>{}} = checkBox;
    if(isShow){
      options.rowHeaders=col => {
        return `<label class="${s['checkbox-wrapper']}" data-index="${col}"><span class="${s['checkbox']} ${selectedIndexes.indexOf(col) >= 0 ?s['checked']:''}"><input class="${s['checkbox-input']}" type="checkbox" /><span class="${s['checkbox-inner']}"></span></span></label>`;
      }
    }
    return options;
  }
  _setCheckBoxAll(){
    let $container = $(this.refs.container);
    let {checkBox={},data=[]} = this.options;
    let {isShow=false,selectedIndexes=[],selectedChanged=()=>{}} = checkBox;
    if(isShow){
      $(`.${s['checkbox-all']}`,$container).remove();
      let isCheckAll = selectedIndexes.length == data.length && selectedIndexes.length!=0;
      $('.ht_clone_top_left_corner .wtHolder',$container).append(`<div class="${s['checkbox-all']}"><label class="${s['checkbox-wrapper']} all" data-index="all"><span class="${s['checkbox']} ${isCheckAll ?s['checked']:''}"><input class="${s['checkbox-input']}" type="checkbox" /><span class="${s['checkbox-inner']}"></span></span></label></div>`);
    }
  }
}

//自定义td类型
// (function(Handsontable){
//   let MyEditor = Handsontable.editors.TextEditor.prototype.extend();

//   function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
//     // ...renderer logic
//   }

//   function customValidator(query, callback) {
//     // ...validator logic
//     callback(/* Pass `true` or `false` */);
//   }

//   // Register an alias
//   Handsontable.cellTypes.registerCellType('my.showTags', {
//     editor: MyEditor,
//     renderer: customRenderer,
//     validator: customValidator,
//     // You can add additional options to the cell type based on Handsontable settings
//     className: 'my-cell',
//     allowInvalid: true,
//     // Or you can add custom properties which will be accessible in `cellProperties`
//     myCustomCellState: 'complete',
//   });

// })(Handsontable);

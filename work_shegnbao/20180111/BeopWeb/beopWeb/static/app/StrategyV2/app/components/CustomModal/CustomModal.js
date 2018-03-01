import React from 'react';
import $ from 'jquery';
import s from './CustomModal.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
export default //props         模态框控件
/*
afterClose	        Modal 完全关闭后的回调	                                  function	        无
bodyStyle	        Modal body 样式	                                       object	         {}
cancelText	        取消按钮文字	                                            string	          取消
closable	        是否显示右上角的关闭按钮	                               boolean	         true
footer	            底部内容，当不需要默认底部按钮时，可以设为 footer={null}	    string|ReactNode  确定取消按钮
mask	            是否展示遮罩	                                            Boolean	          true
maskClosable	    点击蒙层是否允许关闭	                                     boolean	       true
maskStyle	        遮罩样式	                                              object	        {}
okText	            确认按钮文字	                                            string	          确定
style	            可用于设置浮层的样式，调整浮层位置等	                      object	        -
title	            标题	                                                   string|ReactNode	 无
visible	            对话框是否可见	                                           boolean	         无
width	            宽度	                                                   string|number     520
wrapClassName	    对话框外层容器的类名	                                     string	            -
zIndex	            设置 Modal 的 z-index	                                   Number	        1000
onCancel	        点击遮罩层或右上角叉或取消按钮的回调	                       function(e)	    无
onOk	            点击确定回调	                                            function(e)	      无
*/
class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.lastWrap = undefined;
    this.state = {};
    this._onMaskClick = this._onMaskClick.bind(this);
    this._onCancelClick = this._onCancelClick.bind(this);
    this._onOkClick = this._onOkClick.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillUnmount() {
    this.lastWrap && this.lastWrap.remove();
  }
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {
    const { visible = false, afterClose = () => {} } = this.props;
    this.lastWrap && this.lastWrap.remove();
    this.lastWrap = $(this.refs.wrap);
    $('body').append(this.lastWrap.detach());
    if (visible) {
      this.lastWrap.fadeIn();
    } else {
      this.lastWrap.fadeOut(afterClose);
    }
  }
  render() {
    const {
      zIndex = 1000,
      mask = true,
      maskStyle = {},
      wrapClassName = '',
      width = 520,
      style = {},
      bodyStyle={},
      title = '',
      children = [],
      footer,
      i18n,
      cancelText = i18n.CANCEL,
      okText =  i18n.OK,
      closable = true
    } = this.props;
    const childrenNodes = children instanceof Array ? children : [children],
      footerNodes =
        footer === null
          ? [
              <button className={css('btn')} onClick={this._onOkClick}>{okText}</button>,
              <button className={css('btn')} onClick={this._onCancelClick}>{cancelText}</button>
            ]
          : footer;

    let maskStyles = Object.assign({ zIndex }, maskStyle),
      modalMaskStyles = Object.assign({ zIndex }, style),
      modalWrapStyles = { width };
    return (
      <div ref="wrap" className={css('wrap')}>
        {mask ? (
          <div
            className={css('mask')}
            style={maskStyles}
            onClick={this._onMaskClick}
          />
        ) : null}
        <div
          className={css(`modalMask ${wrapClassName}`)}
          style={modalMaskStyles}
        >
          <div className={css('modalWrap')} style={modalWrapStyles}>
            <div className={css('modal')}>
              <div className={css('modal_header')}>{title}</div>
              <div className={css('modal_body')} style={bodyStyle}>{childrenNodes}</div>
              {footer == null ? null : (
                <div className={css('modal_footer')}>{footerNodes}</div>
              )}
              {closable?<div className={css('modal_close')} onClick={this._onCancelClick}>x</div>:null}
            </div>
          </div>
        </div>
      </div>
    );
  }
  _onMaskClick() {
    const { maskClosable = true, onCancel = () => {} } = this.props;
    if (maskClosable) {
      onCancel();
    }
  }
  _onCancelClick(){
    const {onCancel = () => {} } = this.props;
    onCancel();
  }
  _onOkClick(){
    const {onOk = () => {} } = this.props;
    onOk();
  }
}

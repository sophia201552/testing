import React from 'react';
import $ from 'jquery';
import css from './List.css';


// props
//keyId  id
//color  border颜色
//title  文字
const ChildName = Symbol('ListItem');
class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }
  static childName = ChildName;
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

// props
// defaultSelectedKeys
// onChange
const titleHeight = 40;
class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: new Set()
    };
  }
  componentDidMount() {
    const { defaultSelectedKeys = [] } = this.props;
    this.setState({
      selectedKeys: new Set(defaultSelectedKeys)
    });
  }
  componentDidUpdate() {
    const { selectedKeys } = this.state;
    const children =
      this.props.children instanceof Array
        ? this.props.children
        : [this.props.children];
    const wrapHeight =
        (this.refs && this.refs.wrap && this.refs.wrap.offsetHeight) || 0,
      maxHeight = wrapHeight - children.length * titleHeight - children.length;
    $('.openWrap', this.refs.wrap)
      .stop()
      .animate({
        height: 0
      });
    selectedKeys.forEach(k => {
      $(this.refs[`openWrap_${k}`])
        .stop()
        .animate({
          height: maxHeight
        });
    });
  }
  render() {
    const children =
      this.props.children instanceof Array
        ? this.props.children
        : [this.props.children];
    const { selectedKeys } = this.state;
    return (
      <div ref="wrap" className={css['listWrap']}>
        <ul>
          {children.map(child => {
            const { keyId, color = 'transparent', title = '' } = child.props;
            let isOpen = selectedKeys.has(keyId);
            let fontColor =
              (isOpen && color != 'transparent' && color) ||
              'rgb(220, 222, 226)';
            return child && child.type.childName == ChildName ? (
              <li key={keyId}>
                <div
                  className={
                    css['titleWrap'] + (isOpen ? ' ' + css['selected'] : '')
                  }
                  onClick={this._onClick.bind(this, keyId)}
                  style={{
                    lineHeight: `${titleHeight}px`,
                    borderLeft: `3px solid ${color}`
                  }}
                >
                  <div
                    className={css['title']}
                    style={{
                      lineHeight: `${titleHeight}px`,
                      height: `${titleHeight}px`,
                      color: fontColor,
                      boxShadow: isOpen
                        ? `${fontColor} 15px 0px 15px -15px inset`
                        : ''
                    }}
                  >
                    {title}
                  </div>
                  {isOpen ? (
                    <i
                      className="ms-Icon ms-Icon--ChevronUp"
                      aria-hidden="true"
                      style={{
                        color: isOpen ? fontColor : ' rgb(104, 114, 150)'
                      }}
                    />
                  ) : (
                    <i
                      className="ms-Icon ms-Icon--ChevronDownMed"
                      aria-hidden="true"
                      style={{
                        color: isOpen ? fontColor : ' rgb(104, 114, 150)'
                      }}
                    />
                  )}
                </div>
                <div
                  ref={`openWrap_${keyId}`}
                  className={'openWrap'}
                  style={{
                    height: 0,
                    overflowY: 'auto'
                  }}
                >
                  {child}
                </div>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    );
  }
  _onClick(keyId) {
    const { onChange = () => {} } = this.props;
    let { selectedKeys } = this.state;
    if (selectedKeys.has(keyId)) {
      selectedKeys.delete(keyId);
    } else {
      selectedKeys.clear();
      selectedKeys.add(keyId);
    }
    this.setState({
      selectedKeys
    });
    onChange(Array.from(selectedKeys));
  }
}


export { List, ListItem };

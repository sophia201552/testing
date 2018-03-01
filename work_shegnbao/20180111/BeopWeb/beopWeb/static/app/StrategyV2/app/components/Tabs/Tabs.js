import React from 'react';
import $ from 'jquery';
import s from './Tabs.css';

const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
//props
//tab       文字
//keyId     value
//iconClass 图标
//tools: [{iconClass, title, onClick}]
//title     鼠标移上提示, 默认为tab
const ChildName = Symbol('TabPane');
class TabPane extends React.Component {
  constructor(props) {
    super(props);
  }
  static childName = ChildName;
  render() {
    const { children } = this.props;
    return (
      <div
        className={css('', 'ms-slideRightIn20')}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {children}
      </div>
    );
  }
}

//props
//align: horizontal||vertical
//titleWidth: 标题宽度
//titleHeight: 标题高度
//selecteddTabId 选中某一tab
//onChange Tab改变
class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: props.activeKey
    };
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.activeKey){
        this.setState({activeKey:nextProps.activeKey})
    }
    if (nextProps.selecteddTabId) {
      this.onClick(nextProps.selecteddTabId);
    }
  }
  render() {
    const {
      titleWidth,
      titleHeight,
      align = 'horizontal',
      isShowhelpContainer = false
    } = this.props;
    const children =
      this.props.children instanceof Array
        ? this.props.children
        : [this.props.children];
    let { activeKey } = this.state;
    activeKey =
      activeKey == undefined
        ? children[0] ? children[0].props.keyId : undefined
        : activeKey;
    let width =
        align == 'horizontal'
          ? titleWidth
            ? parseFloat(titleWidth) + 'px'
            : 100 / children.length + '%'
          : titleWidth ? parseFloat(titleWidth) + 'px' : '50px',
      height =
        align == 'horizontal'
          ? titleHeight ? parseFloat(titleHeight) + 'px' : '40px'
          : titleHeight ? parseFloat(titleHeight) + 'px' : '80px',
      ulHeight = align == 'horizontal' ? height : '100%',
      ulWidth = align == 'horizontal' ? '100%' : width,
      contentWidth = align == 'horizontal' ? '100%' : `calc(100% - ${width})`,
      contentHeight = align == 'horizontal' ? `calc(100% - ${height})` : '100%';
    let index = children.findIndex(v => v.props.keyId == activeKey);
    return (
      <div className={s['tabsWrap']}>
        <ul
          className={s[align]}
          style={{ height: ulHeight, width: ulWidth, position: 'relative' }}
        >
          {children.map((child, num) => {
            const { keyId, iconClass, tab, tools = [], title } =
              (child && child.props) || {};
            return child && child.type.childName == ChildName ? (
              <li
                key={keyId}
                className={
                  s['tabsTitle'] + (activeKey == keyId ? ' ' + s['active'] : '')
                }
                style={{
                  width,
                  height
                }}
                data-id={keyId}
                onClick={this.onClick.bind(this, keyId)}
                title={title ? title : tab}
              >
                {iconClass ? (
                  align == 'horizontal' ? (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        lineHeight: height
                      }}
                    >
                      {tab}
                    </div>
                  ) : (
                    <div className={s['iconTitle']}>
                      {typeof iconClass === 'object' &&
                      iconClass.props !== null ? (
                        iconClass
                      ) : (
                        <i className={iconClass} aria-hidden="true" />
                      )}
                      <div>{tab}</div>
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      lineHeight: height
                    }}
                  >
                    {tab}
                  </div>
                )}
                {num === index && tools.length !== 0 ? (
                  <ul
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: align == 'horizontal' ? 0 : 'auto',
                      borderTop:
                        align == 'horizontal'
                          ? 'none'
                          : '1px solid rgba(23, 29, 52, .5)',
                      borderLeft:
                        align == 'horizontal'
                          ? '1px solid rgba(23, 29, 52, .5)'
                          : 'none'
                    }}
                  >
                    {tools.map((tool, inx) => {
                      return (
                        <li
                          key={inx}
                          style={{
                            width:
                              align == 'horizontal'
                                ? `${width / tools.length}px`
                                : width,
                            height,
                            float: align == 'horizontal' ? 'left' : ''
                          }}
                          data-id={inx}
                          onClick={this._onClick.bind(this, num, inx)}
                          className={s['tabsTitle']}
                          title={tool.title ? tool.title : tool.name}
                        >
                          {tool.iconClass ? (
                            align == 'horizontal' ? (
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  lineHeight: height,
                                  padding: ' 0 12px'
                                }}
                              >
                                {typeof tool.iconClass === 'object' &&
                                tool.iconClass.props !== null ? (
                                  tool.iconClass
                                ) : (
                                  <i
                                    className={tool.iconClass}
                                    aria-hidden="true"
                                    style={{
                                      verticalAlign: 'bottom',
                                      paddingRight: '4px'
                                    }}
                                  />
                                )}

                                {tool.name}
                              </div>
                            ) : (
                              <div className={s['iconTitle']}>
                                {typeof tool.iconClass === 'object' &&
                                tool.iconClass.props !== null ? (
                                  tool.iconClass
                                ) : (
                                  <i
                                    className={tool.iconClass}
                                    aria-hidden="true"
                                  />
                                )}
                                <div>{tool.name}</div>
                              </div>
                            )
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                lineHeight: height
                              }}
                            >
                              {tool.name}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            ) : null;
          })}
        </ul>
        <div
          style={{
            width: contentWidth,
            height: contentHeight,
            overflow: 'auto',
            backgroundImage:
              'linear-gradient(45deg, rgba(24, 30, 54, 0.3) 25%, transparent 25%, transparent 50%, rgba(24, 30, 54, 0.3) 50%, rgba(24, 30, 54, 0.3) 75%, transparent 75%, transparent)',
            backgroundSize: '6px 6px'
          }}
        >
          {children[index]}
        </div>
      </div>
    );
  }
  onClick(keyId) {
    const { onChange = () => {} } = this.props;
    const { activeKey } = this.state;
    if (activeKey != keyId) {
      this.setState({
        activeKey: keyId
      });
      this.props.resetStateFn.reset(keyId);
      onChange(keyId);
    }
  }
  _onClick(num, index) {
    const { tools = [] } = this.props.children[num].props;
    const { onClick = () => {} } = tools[index];
    onClick(index);
  }
}
export { TabPane, Tabs };

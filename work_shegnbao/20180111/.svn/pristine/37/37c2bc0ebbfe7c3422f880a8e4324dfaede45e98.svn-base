/**
 * checkbox group
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';

import UnknownTooltip from '../../../components/UnknownTooltip';

import s from './CheckboxGroup.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
/**
 * items: [ {
    key: ObjectId(''),
    name: '备注',
  }]
  * title: 名称
  * selectChange () => {items}
  * selectedKeys: []
  * onExtend ()=>{}
  * onResize ()=>{}
 */

class CheckboxGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.isNeedResize = false;
    this.state = {
      isSpreadCheck: true,
      selected: false
    };
    this.width = 0;
  }
  componentDidUpdate() {
    const { onResize = () => {} } = this.props;
    if (this.isNeedResize) {
      this.isNeedResize = false;
      onResize();
    }
  }
  render() {
    const { isSpreadCheck, selected } = this.state;
    const { items = [], title = '', selectedKeys = [] } = this.props;
    return (
      <div className={s['checkboxGroupWrap']}>
        <ul>
          <li className={s['clear']}>
            <div
              className={css('navWrap clear', 'labelWrap')}
              onClick={this._spreadCheck.bind(this)}
            >
              <div className={s['iconWrap']}>
                <i
                  className={`ms-Icon ms-Icon--${
                    isSpreadCheck ? 'FlickUp' : 'FlickLeft'
                  } `}
                />
              </div>
              <div className={s['titleWrap']}>
                <span>{title}</span>
              </div>
            </div>
            <div
              className={css('groupWrap')}
              style={{
                width: `calc(100% - ${
                  appConfig.language == 'zh'
                    ? title.length * 16 + 32
                    : title.length * 8 + 32
                }px)`
              }}
            >
              <ul className={css('clear', isSpreadCheck ? '' : 'hide')}>
                {items.map((item, index) => {
                  return (
                    <li className={css('checkboxWrap clear')} key={index}>
                      {/* <TooltipHost
                        content={item.toolTip}
                        id={`myToolTip${index}`}
                        calloutProps={{
                          gapSpace: 0,
                          className: css(
                            'toolTipWrap',
                            item.toolTip == '' ? 'hide' : ''
                          )
                        }}
                      // aria-describedby={
                        //   item.toolTip === '暂无描述'
                        //     ? undefined
                        //     : `myToolTip${index}`
                        // }
                      > */}
                      <Checkbox
                        label={item.name}
                        checked={
                          selectedKeys.indexOf(item.key) !== -1 ? true : false
                        }
                        onChange={(e, checked) => {
                          this._checkChange(checked, item.key);
                        }}
                      />
                      {item.toolTip !== '' && (
                        <UnknownTooltip content={item.toolTip} />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    );
  }
  _checkChange(selected, key) {
    let { items, selectedKeys = [], selectChange = () => {} } = this.props;
    items.forEach((v, i) => {
      if (v.key === key) {
        if (selected) {
          selectedKeys = selectedKeys.concat([key]);
        } else {
          selectedKeys = selectedKeys.filter(v => v.indexOf(key) === -1);
        }
      }
    });
    selectChange(selectedKeys);
  }
  _spreadCheck() {
    const { isSpreadCheck } = this.state;
    const { onExtend = () => {} } = this.props;
    this.isNeedResize = true;
    this.setState({
      isSpreadCheck: !isSpreadCheck
    });
    onExtend(!isSpreadCheck);
  }
}

CheckboxGroup.propTypes = {};

export default CheckboxGroup;

/**
 * 添加规则
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

import s from './AddRule.css';
import ObjectId from '../../../common/objectId';
import Confirm from '../../../components/Confirm';

const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
/**
 *
 * onChange: (items)=>{}
 * items: []
 * onSelectChange: (item)=>{}
 * activeId
 */
class AddRule extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let { items, activeId, i18n } = this.props;
    return (
      <div className={s['AddRuleWrap']}>
        <div className={s['titleWrap']}>
          <div className={s['titleText']}>{i18n.RULE}</div>
          <div className={s['titleBtn']} onClick={this._addItem.bind(this)}>
            <i className="ms-Icon ms-Icon--Add" />
            <span>{i18n.ADD}</span>
          </div>
        </div>
        <div className={s['contentWrap']}>
          {items.map((item, index) => {
            return (
              <div
                className={`${s['itemWrap']} + ${
                  activeId == item.id ? ' active' : ''
                } `}
                key={index}
                onClick={this._selectItem.bind(this, item)}
              >
                <div className={s['itemHeader']}>
                  <span className={s['titleText']}>{'rule-' + ++index}</span>
                  <span
                    className={s['iconWrap']}
                    onClick={this._deleteItem.bind(this, item.id)}
                  >
                    <i className="ms-Icon ms-Icon--Cancel" />
                  </span>
                </div>
                <div className={s['itemRule']}>
                  <label>Rule</label>
                  <div className={s['inputWrap']}>
                    <input
                      value={item.rule}
                      onChange={this._valueChange.bind(this, item.id, 'rule')}
                      onKeyUp={this._onKeyUp.bind(this, item.id, 'rule')}
                    />
                  </div>
                </div>
                {item.rules.map((rule, i) => {
                  return (
                    <div className={css('addRule clear')} key={i}>
                      <input
                        className={css('ruleName', 'show')}
                        value={rule.key}
                        onChange={this._valueChange.bind(
                          this,
                          i,
                          'key',
                          item.id
                        )}
                        onBlur={this._checkNameRepeat.bind(
                          this,
                          item.id,
                          rule.key
                        )}
                        onKeyUp={this._onKeyUp.bind(this, i, 'key', item.id)}
                      />
                      <input
                        className={s['ruleText']}
                        value={rule.value}
                        onChange={this._valueChange.bind(
                          this,
                          i,
                          'value',
                          item.id
                        )}
                        onKeyUp={this._onKeyUp.bind(this, i, 'value', item.id)}
                      />
                      <span
                        className={s['iconWrap']}
                        onClick={this._deleteRule.bind(this, item.id, i)}
                      >
                        <i className="ms-Icon ms-Icon--ChromeMinimize" />
                      </span>
                    </div>
                  );
                })}
                <div
                  className={s['addIcon']}
                  onClick={this._addRule.bind(this, item.id)}
                >
                  <i className="ms-Icon ms-Icon--Add" />
                  <span>{i18n.ADD}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  _addItem() {
    let { onChange = () => {}, items = [] } = this.props;
    items = items.concat([
      {
        id: ObjectId(''),
        rule: '{pre}_{prop}',
        rules: [
          {
            key: 'pre',
            value: ''
          }
        ],
        rows: []
      }
    ]);
    onChange(items);
  }
  _deleteItem(id, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    let { onChange = () => {}, items = [] } = this.props;
    items = items.filter(v => v.id.indexOf(id) <= -1);
    onChange(items);
  }
  _selectItem(item) {
    const { onSelectChange = () => {} } = this.props;
    onSelectChange(item);
  }
  _addRule(id) {
    let { onChange = () => {}, items = [] } = this.props;
    items = items.concat([]);
    let item = items.find(v => v.id.indexOf(id) !== -1);
    item.rules.push({
      key: '',
      value: ''
    });
    items.forEach((v, i) => {
      if (v.id === item.id) v.rules.concat(item.rules);
    });
    onChange(items);
  }
  _deleteRule(id, index, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    let { onChange = () => {}, items = [] } = this.props;
    items = items.concat([]);
    items.forEach(item => {
      if (item.id == id) {
        item.rules = item.rules.filter((v, i) => i !== index);
      }
    });
    onChange(items);
  }
  _valueChange(id, args, _id, e) {
    let { onChange = () => {}, items = [] } = this.props;
    if (e === undefined) {
      e = _id;
      _id = undefined;
    }
    items = items.concat([]);
    let newValue = e.currentTarget.value;
    items.forEach(v => {
      if (v.id === id) {
        v.rule = newValue;
      } else {
        v.rules.forEach((value, index) => {
          if (index == id && v.id === _id) {
            value[args] = newValue;
          }
        });
      }
    });
    onChange(items);
  }
  _checkNameRepeat(id, key, e) {
    let { onChange = () => {}, items = [], i18n } = this.props;
    items = items.concat([]);
    let count = 0;
    items.forEach(v => {
      if (v.id == id) {
        v.rules.forEach(value => {
          if (value.key === key) {
            count++;
            if (count >= 2) {
              Confirm({
                title: i18n.WARNING,
                content: i18n.RULE_NAEM_NOT_EMPTY,
                type: 'warning',
                onOk: v => {
                  value.key = '';
                  onChange(items);
                  return;
                },
                isShowInput: false
              });
            }
          }
        });
      }
    });
  }
  _onKeyUp(id, args, _id, e) {
    if ((e !== undefined && e.key == 'Enter') || _id.key == 'Enter') {
      this._valueChange(id, args, _id, e);
    }
  }
}

AddRule.propTypes = {};

export default AddRule;

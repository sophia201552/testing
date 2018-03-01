/**
 * 逻辑分析
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import I from 'seamless-immutable';

import { moduleTypes, dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import fuzzyRuleParser from '../../../common/fuzzyRuleParser';
import Pagination from '../../../components/Pagination';
import DropdownList from '../../../components/DropdownList';
import { TabPane, Tabs } from '../../../components/Tabs';
import ObjectId from '../../../common/objectId.js';

import s from './LogicAnalysisPanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
class LogicAnalysisPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.nameOptions = [];
    this.itemTermOptions = [];
    this.resultTermOptions = [
      { key: 'Big', text: 'Big' },
      { key: 'Small', text: 'Small' }
    ];
    this.continuityOptions = [
      { key: 'and', text: 'And' },
      { key: 'or', text: 'Or' }
    ];
    this.itemContinuityOptions = [{ key: 'if', text: 'If' }];
    this.resultContinuityOptions = [{ key: 'then', text: 'Then' }];
    this.dnOutputOpt = { data: false };
    this.dnInputOpt = { data: false };
    this.toBottom = false;
    this.state = {
      current: 1,
      pageSize: 10,
      datasource: [],
      searchValue: ''
    };
    this._onListAdd = this._onListAdd.bind(this);
    this._onItemAdd = this._onItemAdd.bind(this);
    this._onResultAdd = this._onResultAdd.bind(this);
    this._onListRemove = this._onListRemove.bind(this);
    this._onItemRemove = this._onItemRemove.bind(this);
    this._onResultRemove = this._onResultRemove.bind(this);
    this._onItemUpdate = this._onItemUpdate.bind(this);
    this._onResultUpdate = this._onResultUpdate.bind(this);
    this._onPageChange = this._onPageChange.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {
    const { data, moduleInputData, moduleOutputData } = nextProps;
    let datasource = I.asMutable(data.options.ruleBlock) || [];
    let datasourceNew = [];
    datasource.forEach(v => {
      let vNew = { id: ObjectId(), items: [], results: [] };
      v.items.forEach(item => {
        vNew.items.push(I.asMutable(item));
      });
      v.results.forEach(item => {
        vNew.results.push(I.asMutable(item));
      });
      datasourceNew.push(vNew);
    });

    this.nameOptions = [];
    this.itemTermOptions = [];
    this.dnInputOpt = moduleInputData.find(
      v => v.dataType == dataTypes.DN_INPUT_OPT
    ) || { data: false };
    this.dnOutputOpt = moduleOutputData.find(
      v => v.dataType == dataTypes.DN_OUTPUT_OPT
    ) || { data: false };

    this.dnInputOpt.data &&
      this.dnInputOpt.data.forEach((v, i) => {
        if (this.nameOptions.findIndex(a => a.key == v.name) == -1) {
          this.nameOptions.push({ key: v.name, text: v.name });
          v.terms.forEach(t => {
            if (this.itemTermOptions.findIndex(b => b.key == t.name) == -1) {
              this.itemTermOptions.push({ key: t.name, text: t.name });
            }
          });
        }
      });
    this.dnOutputOpt.data &&
      this.dnOutputOpt.data.forEach((v, i) => {
        if (this.nameOptions.findIndex(a => a.key == v.name) == -1) {
          this.nameOptions.push({ key: v.name, text: v.name });
        }
      });
    this.setState({
      datasource: datasourceNew
    });
  }
  componentDidUpdate() {
    if (this.toBottom) {
      this.refs.listWrap.scrollTop = this.refs.listWrap.scrollHeight;
      this.toBottom = false;
    }
  }
  render() {
    const { data, i18n } = this.props;
    const {
      current,
      pageSize,
      datasource,
      treeItems,
      treeExpandedKeys,
      searchValue
    } = this.state;
    let list = datasource,
      total = datasource.length;
    if (searchValue) {
      list = datasource.filter(data => {
        let namesSet = new Set();
        data.items.forEach(v => {
          namesSet.add(v.name.toLocaleLowerCase());
          namesSet.add(v.term.toLocaleLowerCase());
        });
        data.results.forEach(v => {
          namesSet.add(v.name.toLocaleLowerCase());
          namesSet.add(v.term.toLocaleLowerCase());
        });
        return namesSet.has(searchValue.toLocaleLowerCase());
      });
      total = list.length;
    }
    list = list.slice(
      (current - 1) * pageSize,
      (current - 1) * pageSize + pageSize
    );

    return (
      <div className={css('logicAnalysisWrap clear')}>
        <div className={css('top')}>
          <div className={css('title')}>{i18n.MODULE_NAME}</div>
          <div className={css(`btn ${searchValue ? 'disabled': ''}`)} onClick={this._onListAdd}>
            {i18n.ADD}
          </div>
        </div>
        <div className={css('bottom')}>
          <div className={css('t')}>
            <div className={css('t_l')}>
              <SearchBox
                labelText={i18n.SEARCH}
                onSearch={v => {
                  this.setState({
                    searchValue: v,
                    current: 1
                  });
                }}
                onClear={v => {
                  this.setState({
                    searchValue: '',
                    current: 1
                  });
                }}
                onChange={v => {
                  if (v == '') {
                    this.setState({
                      searchValue: '',
                      current: 1
                    });
                  }
                }}
              />
            </div>
          </div>
          <div ref={'listWrap'} className={css('m')}>
            {list.map((data, listIndex) => {
              let { items, results, id } = data;
              return (
                <div key={id} className={css('wrapLv1')}>
                  <div className={css('wrapLv2 clear')}>
                    <div className={css('name')}>
                      <span>{i18n.CONDITIONS}</span>
                    </div>
                    <div
                      className={css('listRemove')}
                      onClick={this._onListRemove.bind(this, id, id)}
                    >
                      <i className="ms-Icon ms-Icon--Cancel" />
                    </div>
                    <div className={css('content clear')}>
                      {items.map((item, index) => {
                        return (
                          <div
                            key={`${id}_${index}`}
                            className={css('itemWrap clear')}
                          >
                            <div className={css('itemL')}>
                              <DropdownList
                                skin="white text333"
                                height={68}
                                selectedKey={item.continuity}
                                options={
                                  index == 0
                                    ? this.itemContinuityOptions
                                    : this.continuityOptions
                                }
                                onChanged={this._onItemUpdate.bind(
                                  this,
                                  id,
                                  index,
                                  'continuity'
                                )}
                                caretDown={{
                                  iconName: 'ChevronDown',
                                  className: 'ChevronDown'
                                }}
                              />
                            </div>
                            <div className={css('itemR')}>
                              <div className={css('itemT')}>
                                <DropdownList
                                  skin="white text333"
                                  height={38}
                                  selectedKey={item.name}
                                  options={this.nameOptions}
                                  onChanged={this._onItemUpdate.bind(
                                    this,
                                    id,
                                    index,
                                    'name'
                                  )}
                                  caretDown={{
                                    iconName: 'ChevronDown',
                                    className: 'ChevronDown'
                                  }}
                                />
                              </div>
                              <div className={css('itemB clear')}>
                                <div className={css('itemBL')}>
                                  <DropdownList
                                    skin="white text333"
                                    height={30}
                                    selectedKey={item.judge}
                                    options={[
                                      { key: 'is', text: 'Is' },
                                      { key: 'is not', text: 'Is not' }
                                    ]}
                                    onChanged={this._onItemUpdate.bind(
                                      this,
                                      id,
                                      index,
                                      'judge'
                                    )}
                                    caretDown={{
                                      iconName: 'ChevronDown',
                                      className: 'ChevronDown'
                                    }}
                                  />
                                </div>
                                <div className={css('itemBR')}>
                                  <DropdownList
                                    skin="white text333"
                                    height={30}
                                    selectedKey={item.term}
                                    options={this.itemTermOptions}
                                    onChanged={this._onItemUpdate.bind(
                                      this,
                                      id,
                                      index,
                                      'term'
                                    )}
                                    caretDown={{
                                      iconName: 'ChevronDown',
                                      className: 'ChevronDown'
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div
                              className={css('remove')}
                              onClick={this._onItemRemove.bind(this, id, index)}
                            >
                              x
                            </div>
                          </div>
                        );
                      })}
                      <div className={css('itemWrap itemAdd')}>
                        <div className={css('addWrap')}>
                          <div
                            className={css('add')}
                            onClick={this._onItemAdd.bind(this, id)}
                          >
                            <i className="ms-Icon ms-Icon--CircleAddition" />
                            <span>{i18n.ADD_SUBCONDITIONS}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={css('wrapLv2 clear')}>
                    <div className={css('name')}>
                      <span>{i18n.RESULT}</span>
                    </div>
                    <div className={css('content clear')}>
                      {results.map((item, index) => {
                        return (
                          <div
                            key={`${id}_${index}`}
                            className={css('itemWrap clear')}
                          >
                            <div className={css('itemL')}>
                              <DropdownList
                                skin="transparent text333"
                                height={68}
                                selectedKey={item.continuity}
                                options={
                                  index == 0
                                    ? this.resultContinuityOptions
                                    : this.continuityOptions
                                }
                                onChanged={this._onResultUpdate.bind(
                                  this,
                                  id,
                                  index,
                                  'continuity'
                                )}
                                caretDown={{
                                  iconName: 'ChevronDown',
                                  className: 'ChevronDown'
                                }}
                              />
                            </div>
                            <div className={css('itemR')}>
                              <div className={css('itemT')}>
                                <DropdownList
                                  skin="transparent text333"
                                  height={36}
                                  selectedKey={item.name}
                                  options={this.nameOptions}
                                  onChanged={this._onResultUpdate.bind(
                                    this,
                                    id,
                                    index,
                                    'name'
                                  )}
                                  caretDown={{
                                    iconName: 'ChevronDown',
                                    className: 'ChevronDown'
                                  }}
                                />
                              </div>
                              <div className={css('itemB clear')}>
                                <div className={css('itemBL')}>
                                  <DropdownList
                                    skin="transparent text333"
                                    height={30}
                                    selectedKey={item.judge}
                                    options={[
                                      { key: 'is', text: 'Is' },
                                      { key: 'is not', text: 'Is not' }
                                    ]}
                                    onChanged={this._onResultUpdate.bind(
                                      this,
                                      id,
                                      index,
                                      'judge'
                                    )}
                                    caretDown={{
                                      iconName: 'ChevronDown',
                                      className: 'ChevronDown'
                                    }}
                                  />
                                </div>
                                <div className={css('itemBR')}>
                                  <DropdownList
                                    skin={'transparent text333'}
                                    height={30}
                                    selectedKey={item.term}
                                    options={this.resultTermOptions}
                                    onChanged={this._onResultUpdate.bind(
                                      this,
                                      id,
                                      index,
                                      'term'
                                    )}
                                    caretDown={{
                                      iconName: 'ChevronDown',
                                      className: 'ChevronDown'
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div
                              className={css('remove')}
                              onClick={this._onResultRemove.bind(
                                this,
                                id,
                                index
                              )}
                            >
                              x
                            </div>
                          </div>
                        );
                      })}
                      <div className={css('itemWrap itemAdd')}>
                        <div className={css('addWrap')}>
                          <div
                            className={css('add')}
                            onClick={this._onResultAdd.bind(this, id)}
                          >
                            <i className="ms-Icon ms-Icon--CircleAddition" />
                            <span>{i18n.ADD_CHILD_RESULT}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={css('b')}>
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={this._onPageChange}
            />
          </div>
        </div>
      </div>
    );
  }
  _onListAdd() {
    const { data } = this.props;
    const { current, pageSize, datasource } = this.state;
    let startListIndex = (current - 1) * pageSize;
    let listNum = datasource.slice(startListIndex, startListIndex + pageSize)
      .length;
    let arr = datasource.concat();
    let index = startListIndex + listNum;
    if (listNum == pageSize) {
      index -= 1;
    }
    arr.splice(index, 0, {
      id: ObjectId(),
      items: [{ continuity: 'if', judge: 'is', name: '', term: '' }],
      results: [
        {
          continuity: 'then',
          judge: 'is',
          name: '',
          term: ''
        }
      ]
    });
    this.toBottom = true;
    this._updateRule(arr);
  }
  _onListRemove(listId) {
    const { current, pageSize, datasource } = this.state;
    let arr = datasource.filter(v => v.id != listId);
    let currentNum = current;
    if (current > Math.ceil(Math.max(arr.length, 1) / pageSize)) {
      currentNum = Math.max(1, currentNum - 1);
    }
    this.setState({
      current: currentNum
    });
    this._updateRule(arr);
  }
  _onItemAdd(listId) {
    const { datasource } = this.state;
    let arr = datasource.concat();
    let listIndex = datasource.findIndex(v => v.id == listId);
    arr[listIndex]['items'].push({
      continuity: 'and',
      judge: 'is',
      name: '',
      term: ''
    });
    this._updateRule(arr);
  }
  _onItemRemove(listId, index) {
    const { datasource } = this.state;
    let listIndex = datasource.findIndex(v => v.id == listId);
    let arr = datasource.concat();
    if (index == 0) {
      if (arr[listIndex]['items'][1]) {
        arr[listIndex]['items'][1]['continuity'] = 'if';
      } else {
        arr[listIndex]['items'][1] = {
          continuity: 'if',
          judge: 'is',
          name: '',
          term: ''
        };
      }
    }
    arr[listIndex]['items'].splice(index, 1);
    this._updateRule(arr);
  }
  _onResultAdd(listId) {
    const { datasource } = this.state;
    let listIndex = datasource.findIndex(v => v.id == listId);
    let arr = datasource.concat();
    arr[listIndex]['results'].push({
      continuity: 'and',
      judge: 'is',
      name: '',
      term: ''
    });
    this._updateRule(arr);
  }
  _onResultRemove(listId, index) {
    const { datasource } = this.state;
    let listIndex = datasource.findIndex(v => v.id == listId);
    let arr = datasource.concat();
    if (index == 0) {
      if (arr[listIndex]['results'][1]) {
        arr[listIndex]['results'][1]['continuity'] = 'then';
      } else {
        arr[listIndex]['results'][1] = {
          continuity: 'then',
          judge: 'is',
          name: '',
          term: ''
        };
      }
    }
    arr[listIndex]['results'].splice(index, 1);
    this._updateRule(arr);
  }
  _onItemUpdate(listId, index, propName, option, key) {
    const { datasource } = this.state;
    let listIndex = datasource.findIndex(v => v.id == listId);
    let arr = datasource.concat();
    arr[listIndex]['items'][index][propName] = key;
    this._updateRule(arr);
  }
  _onResultUpdate(listId, index, propName, option, key) {
    const { datasource } = this.state;
    let listIndex = datasource.findIndex(v => v.id == listId);
    let arr = datasource.concat();
    arr[listIndex]['results'][index][propName] = key;
    this._updateRule(arr);
  }
  _onPageChange(num) {
    this.setState({
      current: num
    });
  }
  _updateRule(ruleBlock) {
    const { updateModule, data } = this.props;
    let rule = fuzzyRuleParser.stringify(
      this.dnInputOpt.data || [],
      this.dnOutputOpt.data || [],
      { name: 'default', ruleBlock: ruleBlock }
    );
    updateModule(
      data
        .setIn(['options', 'ruleBlock'], ruleBlock)
        .setIn(['options', 'rule'], rule)
    );
  }
}

LogicAnalysisPanel.propTypes = {};

export default LogicAnalysisPanel;

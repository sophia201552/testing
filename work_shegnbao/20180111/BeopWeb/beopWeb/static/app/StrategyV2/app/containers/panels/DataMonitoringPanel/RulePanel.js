/**
 * 批量配置面板
 */

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import I from 'seamless-immutable';
import HotTable from '../../../components/HotTable';
import AddRule from './AddRule';
import CheckboxGroup from './CheckboxGroup';
import Confirm from '../../../components/Confirm';

import s from './RulePanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
const baseRow = {
  condition: '',
  continues: '',
  dataSourceType: '',
  max: '',
  min: '',
  offlineCheckTime: '',
  oscillationCheck: '',
  relation: '',
  slopeNegativeCheck: '',
  suddenChange: '',
  suddenChangeRatio: '',
  typeCh: '',
  typeEn: '',
  unit: ''
};
class RulePanel extends React.Component {
  static resetName(name, names, index = 0) {
    let finName = index == 0 ? name : `${name}_${index}`;
    if (names.indexOf(finName) < 0) {
      return finName;
    } else {
      return RulePanel.resetName(name, names, index + 1);
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedRuleId: undefined,
      ruleItems: [],
      //表格相关
      tableHeight: 350,
      selectedIndexes: [],
      columnSelectedKeys: []
    };
    this._onRuleItemsChange = this._onRuleItemsChange.bind(this);
    this._onRuleItemsSelected = this._onRuleItemsSelected.bind(this);
    this._addColumn = this._addColumn.bind(this);
    this._deleteColumn = this._deleteColumn.bind(this);
    this._onCheckboxGroupChnage = this._onCheckboxGroupChnage.bind(this);
    this._onTableResize = this._onTableResize.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._onSave = this._onSave.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { data, columnSelectedKeys } = nextProps;
    const { ruleItems } = data.options;
    let selectedRuleId =
      this.state.selectedRuleId ||
      (ruleItems[0] && ruleItems[0].id) ||
      undefined;
    let newRuleItems = [];
    I.asMutable(ruleItems).forEach(v => {
      let vNew = { id: v.id, rule: v.rule, rules: [], rows: [] };
      v.rules.forEach(item => {
        vNew.rules.push(I.asMutable(item));
      });
      v.rows.forEach(item => {
        vNew.rows.push(I.asMutable(item));
      });
      newRuleItems.push(vNew);
    });
    this.setState({
      selectedRuleId,
      columnSelectedKeys,
      ruleItems: newRuleItems
    });
    this._onTableResize();
  }
  componentDidUpdate() {}
  render() {
    const { data, columnNames, i18n } = this.props;
    const {
      selectedRuleId,
      columnSelectedKeys,
      tableHeight,
      ruleItems,
      selectedIndexes
    } = this.state;
    let columns = this._columnsGetter();
    let selectedRuleItem = ruleItems.find(v => v.id == selectedRuleId),
      rows = (selectedRuleItem && selectedRuleItem.rows) || [];
    return (
      <div className={css('rulePanel clear')} ref={'rulePanel'}>
        <div className={s['left']}>
          <AddRule
            activeId={selectedRuleId}
            items={ruleItems}
            onChange={this._onRuleItemsChange}
            onSelectChange={this._onRuleItemsSelected}
            i18n={i18n}
          />
        </div>
        <div className={s['right']}>
          <div className={s['titleWrap']}>
            <div className={s['titleText']}>{i18n.ATTRIBUTE}</div>
            <div
              className={css(
                `titleBtn ${selectedIndexes.length ? '' : 'disabled'}`
              )}
              onClick={this._deleteColumn.bind(this)}
            >
              <i className="ms-Icon ms-Icon--Cancel" />
              <span>{i18n.DELETE}</span>
            </div>
            <div
              className={css(
                `titleBtn ${
                  selectedRuleId && ruleItems.length ? '' : 'disabled'
                }`
              )}
              onClick={this._addColumn.bind(this)}
            >
              <i className="ms-Icon ms-Icon--Add" />
              <span>{i18n.ADD}</span>
            </div>
            <div
              className={css(`titleBtn ${ruleItems.length ? '' : 'disabled'}`)}
              onClick={this._exportExecl.bind(this)}
            >
              <i className="ms-Icon ms-Icon--ExcelLogo" />
              <span>{i18n.EXPORT_TO_EXCEL}</span>
            </div>
          </div>
          <div className={s['contentWrap']}>
            <div className={css('checkGroupWrap')} ref={'checkGroupWrap'}>
              <CheckboxGroup
                title={i18n.CONFIGURATION_ATTRIBUTE}
                selectedKeys={columnSelectedKeys}
                items={columnNames}
                selectChange={this._onCheckboxGroupChnage}
                onResize={this._onTableResize}
              />
            </div>
            <div className={css('tableWrap')} ref={'tableWrap'}>
              <div className={css('toolbar clear')} ref={'toolbar'} />
              <div className={css('content')}>
                <HotTable
                  skin={'header_color_7da2f5 header_height_40'}
                  option={{
                    data: rows,
                    colHeaders: columns.map(v => v.name),
                    columns: columns.map(v => {
                      return {
                        data: v.key,
                        readOnly: !v.editable,
                        colWidths: '120px',
                        rowHeights: '45px',
                        type: v.isNumber ? 'numeric' : 'text',
                        renderer: v.renderer
                      };
                    }),
                    afterChange: (changes, source) => {
                      let editSource = [
                        'edit',
                        'Autofill.fill',
                        'CopyPaste.paste'
                      ];
                      const { selectedRuleId, ruleItems } = this.state;
                      let selectedRuleItem = ruleItems.find(v => v.id == selectedRuleId)||{rows:[]};
                      let datasource = selectedRuleItem['rows'].slice(),
                        isChanged = false;
                      //编辑状态
                      if (editSource.indexOf(source) >= 0) {
                        changes.forEach(row => {
                          let index = row[0],
                            propName = row[1],
                            oldV = row[2],
                            newV = row[3];
                          newV = this._repairUpdateDatasourceType(
                            propName,
                            newV,
                            oldV
                          );
                          
                          if (oldV != newV) {
                            switch (propName) {
                              case 'propsName':
                                newV = RulePanel.resetName(
                                  newV,
                                  datasource.map(v => v[propName])
                                );
                                break;
                            }
                            isChanged = true;
                            let rowToUpdate = datasource[index];
                            let updated = { [propName]: newV };
                            Object.assign(rowToUpdate, updated);
                          }
                        });
                      }
                      if (isChanged) {
                        let newRuleItems = ruleItems.slice();
                        newRuleItems.find(v => v.id == selectedRuleId)['rows'] = datasource;
                        this.setState({ ruleItems: newRuleItems });
                      }
                    },
                    manualColumnResize: true,
                    maxRows: rows.length,
                    checkBox: {
                      isShow: true,
                      selectedIndexes: selectedIndexes,
                      selectedChanged: selectedIndexes => {
                        this.setState({
                          selectedIndexes
                        });
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className={css('footWrap clear')}>
            <button className={css('cancel')} onClick={this._onCancel}>
              {i18n.CANCEL}
            </button>
            <button className={css('save')} onClick={this._onSave}>
              {i18n.SAVE}
            </button>
          </div>
        </div>
      </div>
    );
  }
  _columnsGetter() {
    const { columnNames, i18n } = this.props;
    const { columnSelectedKeys } = this.state;
    let columns = columnNames.filter(
      v => columnSelectedKeys.indexOf(v.key) > -1
    );
    columns.unshift({
      key: 'propsName',
      name: i18n.ATTRIBUTE_NAME,
      width: 200,
      resizable: true,
      editable: true,
      toolTip: ''
    });
    return columns;
  }

  _repairUpdateDatasourceType(propName, newV, oldV) {
    let numberArr = [
      'min',
      'max',
      'continues',
      'offlineCheckTime',
      'suddenChange',
      'suddenChangeRatio'
    ];
    let rs = newV;
    if (numberArr.indexOf(propName) >= 0) {
      if (typeof newV == 'string') {
        let temp = newV.trim();
        rs = temp === '' ? '' : isNaN(Number(temp)) ? oldV : Number(temp);
      }
    }
    return rs;
  }

  _onRuleItemsChange(newRuleItems) {
    let { selectedRuleId, ruleItems } = this.state;
    if (newRuleItems.length == 1) {
      selectedRuleId = newRuleItems[0].id;
    }
    if (newRuleItems.map(v => v.id).indexOf(selectedRuleId) < 0) {
      selectedRuleId = (newRuleItems[0] && newRuleItems[0].id) || undefined;
    }
    this.setState({
      ruleItems: newRuleItems,
      selectedRuleId
    });
  }
  _onRuleItemsSelected(item) {
    const { ruleItems } = this.state;
    this.setState({
      selectedRuleId: item.id
    });
  }
  _deleteColumn(e) {
    if (
      $(e.target)
        .closest('div')
        .hasClass(s['disabled'])
    ) {
      return false;
    }
    const { selectedRuleId, ruleItems, selectedIndexes } = this.state;
    const { i18n } = this.props;
    if (selectedIndexes.length <= 0) {
      return;
    }
    let newRuleItems = ruleItems.slice();
    let deleteData = [],
      filterData = [];
    let selectedRuleItem = ruleItems.find(v => v.id == selectedRuleId);
    selectedRuleItem['rows'].forEach((v, i) => {
      if (selectedIndexes.indexOf(i) > -1) {
        deleteData.push(v);
      } else {
        filterData.push(v);
      }
    });
    newRuleItems.find(v => v.id == selectedRuleId)['rows'] = filterData;

    Confirm({
      title: i18n.TOOLTIP,
      content: `${i18n.IS_DELETE_CONFIGURATION_ONE}${deleteData
        .slice(0, 3)
        .map(v => v.propsName)
        .join(',')}${
        selectedIndexes.length > 3
          ? i18n.IS_DELETE_CONFIGURATION_TWO
          : i18n.IS_DELETE_CONFIGURATION_THREE
      }${i18n.IS_DELETE_CONFIGURATION_FOUR}`,
      type: 'info',
      onOk: () => {
        this.setState({
          ruleItems: newRuleItems,
          selectedIndexes: []
        });
      },
      onCancel: () => {}
    });
  }
  _addColumn(e) {
    if (
      $(e.target)
        .closest('div')
        .hasClass(s['disabled'])
    ) {
      return false;
    }
    const { selectedRuleId, ruleItems } = this.state;
    const { i18n } = this.props;
    Confirm({
      title: i18n.ENTER_ATTRIBUTE_NAME,
      content: '',
      type: 'info',
      onOk: v => {
        let newRuleItems = ruleItems.slice();
        let rows = newRuleItems.find(v => v.id == selectedRuleId)['rows'];
        if (rows.map(v => v.propsName).indexOf(v) > -1 || v.trim() == '') {
          Confirm({
            title: i18n.WARNING,
            type: 'warning',
            content: i18n.EMPTY_ATTRIBUTE_NAME,
            onOk: () => {}
          });
          return;
        }
        rows.push(
          Object.assign({}, baseRow, {
            propsName: v
          })
        );
        this.setState({
          ruleItems: newRuleItems
        });
        return true;
      },
      onCancel: () => {},
      isShowInput: true
    });
  }
  _exportExecl() {
    let { rs, ruleItems } = this._exportData();
    let data = [],
      head = [];
    this._columnsGetter().forEach(v => {
      head.push(v.key);
      rs.forEach((r, i) => {
        data[i] = data[i] || [];
        data[i].push(r[v.key]);
      });
    });
    let query = {
      head: head,
      data: data
    };
    apiFetch.exportDataExcel(query).subscribe({
      fail: rs => {},
      next: rs => {
        if (rs.status != 'OK') {
          return;
        }
        let aTag = document.createElement('a');
        aTag.download = `${this.props.i18n.EXCEL_BULK_CONFIGURATION}.xls`;
        aTag.href = rs.data;
        document.body.appendChild(aTag);
        aTag.onclick = function() {
          document.body.removeChild(aTag);
        };
        aTag.click();
      }
    });
  }
  _onCheckboxGroupChnage(v) {
    this.setState({
      columnSelectedKeys: v
    });
  }
  _onTableResize() {
    let fixedHeight = this.refs.checkGroupWrap.offsetHeight;
    let tableHeight =
      $(this.refs.tableWrap)
        .css({
          height: `calc(100% - ${fixedHeight}px)`
        })
        .height() - $(this.refs.toolbar).height();
    this.setState({
      tableHeight
    });
  }
  _onCancel() {
    const { onCancel } = this.props;
    let { rs, ruleItems } = this._exportData();
    onCancel(rs, ruleItems);
  }
  _onSave() {
    const { onOK } = this.props;
    let { rs, ruleItems } = this._exportData();
    onOK(rs, ruleItems);
  }
  _exportData() {
    const { ruleItems } = this.state;
    let rs = [];
    ruleItems.forEach(ruleItem => {
      let keys = ruleItem.rule.match(/([^\{\}]+)(?=\})/g) || [];
      let arr = [];
      keys.forEach(key => {
        let rule = ruleItem.rules.find(o => o.key == key);
        if (key == 'prop') {
          rule = {
            value: ruleItem.rows.map(v => v.propsName).join('|')
          };
        }
        if (rule) {
          arr.push(rule.value.split('|'));
        }
      });
      let sarr = [[]];
      for (let i = 0; i < arr.length; i++) {
        let tarr = [];
        for (let j = 0; j < sarr.length; j++)
          for (let k = 0; k < arr[i].length; k++)
            tarr.push(sarr[j].concat(arr[i][k]));
        sarr = tarr;
      }
      sarr.forEach(v => {
        let ruleStr = ruleItem.rule,
          item = Object.assign({}, baseRow);
        keys.forEach((key, index) => {
          if (key == 'prop') {
            Object.assign(
              item,
              ruleItem.rows.find(row => row.propsName == v[index])
            );
          }

          ruleStr = ruleStr.replace(new RegExp(`{${key}}`, 'gm'), v[index]);
        });
        Object.assign(item, {
          propsName: ruleStr
        });
        rs.push(item);
      });
    });
    return { rs, ruleItems };
  }
}
export default RulePanel;

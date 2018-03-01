/**
 * 数据源模块
 */
import React from 'react';
import PropTypes from 'prop-types';

import * as moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import {
  DetailsList,
  Selection,
  DetailsRow,
  DetailsListLayoutMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { connect } from 'react-redux';

import Tree from '../../../components/Tree';
import Confirm from '../../../components/Confirm';
import ObjectId from '../../../common/objectId.js';
import HistoryChartConfig from '../HistoryChartConfigModal';
import { getTagDict } from '../../../redux/epics/home.js';
import CustomSpinner from '../../../components/CustomSpinner';
import ShowDataChart from '../../../components/ShowDataChart';

import ParametricExampleModal from './ParametricExampleModal.js';
import { tagMatch } from '../../../common/utils';
import s from './DataSourcePanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
const isCommonObj = (o1 = {}, o2 = {}) => {
  let rs = true;
  let keys1 = Object.keys(o1),
    keys2 = Object.keys(o2);
  if (
    keys1.length != keys2.length ||
    keys1.filter(v => keys2.indexOf(v) < 0).length > 0
  ) {
    return false;
  }
  keys1.forEach(k => {
    if (o1[k] != o2[k]) {
      rs = false;
    }
  });
  return rs;
};
class PointText extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      errorMsg: ''
    };
    this._onTextFocus = this._onTextFocus.bind(this);
    this._onTextBlur = this._onTextBlur.bind(this);
    this._onTextKeyDown = this._onTextKeyDown.bind(this);
    this._onTextClick = this._onTextClick.bind(this);
    this._onTextChanged = this._onTextChanged.bind(this);
    this._onTextDrop = this._onTextDrop.bind(this);
  }
  componentDidMount() {
    const { data } = this.props;
    const { isError } = this.state;
    if (!isError) {
      this.refs.input.value = data.name == undefined ? '' : data.name;
    }
    // this.componentDidUpdate();
  }
  componentDidUpdate(pp, ps) {
    if (pp.data.name != this.props.data.name) {
      this.componentDidMount();
    }
  }
  render() {
    const { dom = [], data } = this.props;
    const { isError, errorMsg } = this.state;
    return (
      <div className={css('PointText')}>
        <input
          ref="input"
          className={css(`text ${isError ? 'error' : ''}`)}
          onFocus={this._onTextFocus}
          onBlur={this._onTextBlur}
          onKeyDown={this._onTextKeyDown}
          onClick={this._onTextClick}
          onChange={this._onTextChanged}
          onDragOver={this._onTextClick}
          onDrop={this._onTextDrop}
        />
        <label className={css(`errorText ${isError ? '' : 'hide'}`)}>
          {errorMsg}
        </label>
      </div>
    );
  }
  _onTextFocus() {
    this.setState({ isError: false, errorMsg: '' });
  }
  _onTextBlur() {
    const {
      data,
      resetItem = () => {},
      verification = () => {
        return { status: true };
      }
    } = this.props;
    let rs = verification(this.refs.input.value);
    if (rs.status) {
      resetItem(data.key, this.refs.input.value);
      // this.setState({ isError: false, errorMsg: '' });
    } else {
      this.setState({ isError: true, errorMsg: rs.msg });
    }
  }
  _onTextKeyDown(e) {
    if (e.key == 'Enter') {
      $(this.refs.input).blur();
    }
  }
  _onTextClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  _onTextChanged(e) {}
  _onTextDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    let dragTagInfo = ev.dataTransfer.getData('dragTagInfo'),
      dragDsInfo = ev.dataTransfer.getData('dragDsInfo'),
      dragInfo = dragTagInfo || dragDsInfo;
    if (dragInfo) {
      let info = JSON.parse(dragInfo);
      this.refs.input.value = info.id;
      $(this.refs.input)
        .focus()
        .blur();
    }
  }
}
class RenameText extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowInput: false
    };
    this._removeItem = this._removeItem.bind(this);
    this._renameItem = this._renameItem.bind(this);
    this._onTextBlur = this._onTextBlur.bind(this);
    this._onTextKeyDown = this._onTextKeyDown.bind(this);
    this._onTextClick = this._onTextClick.bind(this);
  }
  componentDidMount() {
    const { defaultShowInput = false } = this.props;
    this.setState({
      isShowInput: defaultShowInput
    });
  }
  componentDidUpdate() {
    const { isShowInput } = this.state;
    const { data } = this.props;
    if (isShowInput) {
      this.refs.input.focus();
      this.refs.input.value = data.name;
      this.refs.input.select();
    }
  }
  render() {
    const { dom = [], data, i18n } = this.props;
    const { isShowInput } = this.state;
    return isShowInput ? (
      <div className={css('RenameText')}>
        <input
          ref="input"
          className={css('text')}
          onBlur={this._onTextBlur}
          onKeyDown={this._onTextKeyDown}
          onClick={this._onTextClick}
        />
      </div>
    ) : (
      <div className={css('RenameText')}>
        <div className={css('domWrap')}>{dom}</div>
        <div className={css('toolbar')}>
          <button title={i18n.RENAME} onClick={this._renameItem}>
            <i className={'ms-Icon ms-Icon--Rename'} />
          </button>
          <button title={i18n.DELETE_POINT}>
            <i
              className={'ms-Icon ms-Icon--Delete'}
              onClick={this._removeItem}
            />
          </button>
        </div>
      </div>
    );
  }
  _removeItem(e) {
    e.preventDefault();
    e.stopPropagation();
    const { data, removeItem = () => {} } = this.props;
    removeItem(data.id);
  }
  _renameItem(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isShowInput: true
    });
  }
  _onTextBlur() {
    const { data, renameItem = () => {} } = this.props;
    renameItem(data.id, this.refs.input.value);
    this.setState({
      isShowInput: false
    });
  }
  _onTextKeyDown(e) {
    if (e.key == 'Enter') {
      this._onTextBlur();
    }
  }
  _onTextClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}
class DataSourcePanel extends React.PureComponent {
  static isNeedWranWrapSpinner = false;
  constructor(props) {
    super(props);
    this.getDsItemsAsync = undefined;
    this.getDsValuesAsync = undefined;
    this.getDsHistoryAsync = undefined;
    this.dsMap = new Map(); //缓存
    this._selection = new Selection();
    this.state = {
      dataSource: [],
      spinner: false,
      chartSpinner: false,
      treeSpinner: false,
      treeSpinnerLabel: '0.0%',
      selectedColumns: [],
      historyData: {
        list: [],
        timeShaft: []
      },
      showAddItem: false
    };
    this._onGroupSelect = this._onGroupSelect.bind(this);
    this._onAddGroupBtn = this._onAddGroupBtn.bind(this);
    this._addGroup = this._addGroup.bind(this);
    this._removeGroup = this._removeGroup.bind(this);
    this._renameGroup = this._renameGroup.bind(this);
    this._onColumnSelected = this._onColumnSelected.bind(this);
    this._setChartCondition = this._setChartCondition.bind(this);
    this._showModal = this._showModal.bind(this);
    this._showChartConfig = this._showChartConfig.bind(this);
    this._onCheckboxChang = this._onCheckboxChang.bind(this);
    this._updateData = this._updateData.bind(this);
    this._onTreeDrop = this._onTreeDrop.bind(this);
    this._onTabelDrop = this._onTabelDrop.bind(this);
    this._onExportExcel = this._onExportExcel.bind(this);
    this._onImportExcel = this._onImportExcel.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { data, tagDict, getTagDict, updateModule } = nextProps;
    let activedGroup = data.options.activedGroup;
    if (
      !activedGroup ||
      data.options.groups.find(v => v._id == data.options.activedGroup) ==
        undefined
    ) {
      activedGroup = data.options.groups[0]._id;
      updateModule(data.setIn(['options', 'activedGroup'], activedGroup));
    } else {
      if (activedGroup != this.props.data.options.activedGroup) {
        //切换配置
        this.dsMap = new Map();
      }
      this._getDsItems(nextProps);
    }

    if (tagDict.length == 0) {
      getTagDict();
    }
    if (!data.options.timeConfig || !data.options.timeConfig.timeStart) {
      let now = +new Date(),
        yestady = now - 24 * 60 * 60 * 1000;
      let timeEnd = moment.default(now).format('YYYY-MM-DD HH:mm:00'),
        timeStart = moment.default(yestady).format('YYYY-MM-DD HH:mm:00');
      this._setChartCondition({
        timeStart,
        timeEnd,
        timeFormat: 'h1'
      });
    }
  }
  componentWillUpdate(nextProps, nextState) {
    const { data } = this.props;
    if (
      (nextState.selectedColumns[0] != undefined &&
        nextState.selectedColumns[0] != this.state.selectedColumns[0]) ||
      !isCommonObj(nextProps.data.options.timeConfig, data.options.timeConfig)
    ) {
      this._getDsHistory(nextState, nextProps);
    }
  }
  componentDidUpdate() {
    const { data } = this.props;
  }
  componentWillUnmount() {
    if (this.getDsHistoryAsync) {
      this.getDsHistoryAsync.unsubscribe &&
        this.getDsHistoryAsync.unsubscribe();
    }
    if (this.getDsItemsAsync) {
      this.getDsItemsAsync.unsubscribe && this.getDsItemsAsync.unsubscribe();
    }
    if (this.getDsValuesAsync) {
      this.getDsValuesAsync.unsubscribe && this.getDsValuesAsync.unsubscribe();
    }
  }
  render() {
    const { data, tagDict, i18n } = this.props;
    const {
      dataSource,
      spinner,
      chartSpinner,
      treeSpinner,
      treeSpinnerLabel,
      selectedColumns,
      showAddItem
    } = this.state;

    const activedGroup = data.options.activedGroup;
    const timeConfig = data.options.timeConfig || {};
    let params = data.options.params,
      completing = data.options.completing || 0;
    //添加参数组控件
    let addItem = [];
    if (showAddItem) {
      addItem = [
        {
          id: ObjectId(),
          name: 'Default',
          parent: 0,
          isParent: 0,
          render: (dom, data, parent) => {
            return (
              <RenameText
                dom={dom}
                data={data}
                defaultShowInput={true}
                renameItem={this._addGroup}
                i18n={i18n}
              />
            );
          }
        }
      ];
    }
    return (
      <div className={css('dataSourceWrap clear')}>
        <div className={s['left']}>
          <div className={s['title']}>
            {i18n.MODULE_NAME}
            <div className={css('btnGroup clear')}>
              <button title={i18n.TITLE_ADD} onClick={this._onAddGroupBtn}>
                <i className={'ms-Icon ms-Icon--Add'} />
              </button>
            </div>
          </div>
          <div className={s['lt']}>
            <button onClick={this._showModal}>
              {i18n.PARAMETERS_OF_THE_SAMPLE}
            </button>
          </div>
          <div
            className={s['lm']}
            onDrop={this._onTreeDrop.bind(this)}
            onDragOver={ev => {
              ev.preventDefault();
            }}
          >
            <Tree
              selectedKeys={[activedGroup]}
              items={data.options.groups
                .map(v => ({
                  id: v._id,
                  name: v.name,
                  parent: 0,
                  isParent: 0,
                  render: (dom, data, parent) => {
                    return (
                      <RenameText
                        dom={dom}
                        data={data}
                        parent={parent}
                        removeItem={this._removeGroup}
                        renameItem={this._renameGroup}
                        i18n={i18n}
                      />
                    );
                  }
                }))
                .concat(addItem)}
              onSelect={this._onGroupSelect}
              leafIcon={
                <i
                  className="ms-Icon ms-Icon--FabricFolder"
                  aria-hidden="true"
                />
              }
              indent={8}
              skin="whiteSkin h40"
            />
            <CustomSpinner visible={treeSpinner} label={treeSpinnerLabel} />
          </div>
          <div className={s['lb2']}>
            <Checkbox
              className={s['checkbox']}
              label={i18n.IS_COMPLETE}
              onChange={this._onCheckboxChang}
              checked={!!completing}
            />
          </div>
          <div className={s['lb1']}>
            <HistoryChartConfig
              chartCondition={timeConfig}
              changeCondition={this._setChartCondition}
            />
          </div>
        </div>
        <div className={s['right']}>
          <div className={css('btnGroup clear')}>
            <button
              onClick={() => {
                this.refs.excelFileIpt.click();
              }}
            >
              <input
                ref="excelFileIpt"
                style={{ display: 'none' }}
                type="file"
                onChange={this._onImportExcel}
              />
              <i className={'ms-Icon ms-Icon--ExcelDocument'} />
              <span>{i18n.IMPORT_TO_EXCEL}</span>
            </button>
            <button onClick={this._onExportExcel}>
              <i className={'ms-Icon ms-Icon--ExcelDocument'} />
              <span>{i18n.EXPORT_TO_EXCEL}</span>
            </button>
          </div>
          <div
            className={css('tableWrap')}
            onDrop={this._onTabelDrop.bind(this)}
            onDragOver={ev => {
              ev.preventDefault();
            }}
          >
            <DetailsList
              items={dataSource}
              // selection={this._selection}
              // selectionPreservedOnEmptyClick={false}
              columns={this._getColumns()}
              enterModalSelectionOnTouch={false}
              onRenderRow={this._onRenderRow.bind(this)}
              onActiveItemChanged={(item, index) => {
                this.setState({
                  selectedColumns: []
                });
              }}
              layoutMode={DetailsListLayoutMode.fixedColumns}
            />
            <div
              className={css('chartWrap')}
              style={{
                height: selectedColumns.length > 0 ? '40%' : '0'
              }}
            >
              <div
                className={css('configWrap')}
                style={{
                  display: 'none'
                }}
              >
                {`${timeConfig.timeStart}-${timeConfig.timeEnd}`}
                <div
                  className={css('chartConfig')}
                  onClick={this._showChartConfig}
                >
                  <i className={'ms-Icon ms-Icon--Settings'} />
                </div>
              </div>
              {this._createChart()}
              <CustomSpinner visible={chartSpinner} />
            </div>
          </div>
        </div>
        <ParametricExampleModal
          ref="ParametricExampleModal"
          data={params}
          tagDict={tagDict}
          updateData={this._updateData}
          i18n={i18n}
        />
        <CustomSpinner visible={spinner} />
      </div>
    );
  }
  _onRenderRow(props) {
    return (
      <DetailsRow
        {...props}
        onRenderCheck={props => (
          <div style={{ width: '40px', height: '32px' }} />
        )}
        aria-busy={false}
      />
    );
  }
  _getDsItems(props) {
    if (this.getDsItemsAsync) {
      this.getDsItemsAsync.unsubscribe && this.getDsItemsAsync.unsubscribe();
    }
    const { data, updateModule, i18n } = props;
    let activedGroup = data.options.activedGroup;
    let selectedItem = data.options.groups.find(v => v._id == activedGroup),
      index = data.options.groups.findIndex(v => v._id == activedGroup),
      ids = [];
    let dataSource = [],
      params = data.options.params;
    if (selectedItem) {
      params.forEach((v, i) => {
        const point = selectedItem.data[v.name] || '';
        let proj = '';
        if (point !== '') {
          let projId = point.split('|')[0].slice(1);
          proj = appConfig.projectList.find(v => v.id == projId);
          let lang = localStorage.getItem('language');
          if (lang === 'en') {
            proj = proj.name_en;
          } else {
            proj = proj.name_cn;
          }
        }
        let item = this.dsMap.get(point);
        let alias = (item && item.alias) || '',
          value = (item && item.data) || '';
        dataSource.push({
          key: i,
          projName: proj,
          name: v.name,
          point: point,
          value: value,
          tag: v.tags,
          alias: alias
        });
      });
    }
    Object.keys(selectedItem.data).forEach(v => {
      let key = selectedItem.data[v];
      if (key && !this.dsMap.has(key) && ids.indexOf(key) < 0) {
        ids.push(key);
      }
    });

    if (ids.length == 0) {
      this.setState({
        dataSource
      });
      return;
    }
    this.setState({
      spinner: true
    });
    this.getDsItemsAsync = apiFetch.getDsItemsById(ids).subscribe({
      complete: () => {
        this.getDsItemsAsync = undefined;
      },
      error: rs => {
        console.log(rs);
      },
      next: rs => {
        let deleteIds = [];
        ids.forEach((id, i) => {
          if (rs[i]) {
            if (rs[i].projId != -1) {
              this.dsMap.set(id, rs[i]);
            } else {
              this.dsMap.set(id, { data: i18n.POINT_ERROR });
              deleteIds.push(id);
            }
          }
        });
        ids = ids.filter(v => deleteIds.indexOf(v) < 0);
        dataSource.forEach((v, i) => {
          let data = this.dsMap.get(v.point);
          if (data) {
            v.value = data.data || '';
            v.alias = data.alias || '';
          } else {
            if (v.point == undefined) {
              v.point = '';
            }
          }
        });
        this.setState({
          spinner: false,
          dataSource
        });
        this._getDsValues(ids);
      }
    });
  }
  _getDsValues(ids) {
    if (this.getDsValuesAsync) {
      this.getDsValuesAsync.unsubscribe && this.getDsValuesAsync.unsubscribe();
    }
    const { i18n } = this.props;
    this.setState({
      spinner: true
    });
    this.getDsValuesAsync = apiFetch.getRealtimeData(ids).subscribe({
      complete: () => {
        this.getDsValuesAsync = undefined;
      },
      error: rs => {
        console.log(rs);
      },
      next: rs => {
        if (rs.error) {
          rs = {
            dsItemList: []
          };
        }

        let { dataSource } = this.state;
        rs.dsItemList.forEach(v => {
          let data = this.dsMap.get(v.dsItemId);
          if (data) {
            let num = v.data == undefined ? '' : v.data;
            num += '';
            let temp = num.trim();
            num =
              temp === ''
                ? ''
                : isNaN(Number(temp)) ? temp : Number(temp).toFixed(2);
            data.data = num;
          }
        });
        dataSource.forEach((v, i) => {
          let data = this.dsMap.get(v.point);
          if (data && data.data == i18n.POINT_ERROR) {
            return false;
          }

          v.value = data && data.data != undefined ? data.data : '';
        });
        this.setState({
          spinner: false,
          dataSource
        });
      }
    });
  }
  _getDsHistory(state, props) {
    if (this.getDsHistoryAsync) {
      this.getDsHistoryAsync.unsubscribe &&
        this.getDsHistoryAsync.unsubscribe();
    }
    const { dataSource, selectedColumns } = state;
    const timeConfig = props.data.options.timeConfig || {};
    const { timeStart, timeEnd, timeFormat } = timeConfig;
    let ids = selectedColumns.map(
      id => dataSource.find(d => d.key == id).point || ''
    );
    this.setState({
      chartSpinner: true
    });
    this.getDsHistoryAsync = apiFetch
      .getHistoryData(ids.filter(v => v != ''), timeStart, timeEnd, timeFormat)
      .subscribe({
        complete: () => {
          this.getDsHistoryAsync = undefined;
        },
        error: rs => {
          console.log(rs);
        },
        next: rs => {
          if (rs.error || !rs.list) {
            rs = {
              list: [],
              timeShaft: []
            };
          }
          this.setState({
            chartSpinner: false,
            historyData: rs
          });
        }
      });
  }
  _doNothing(ev) {
    ev.preventDefault();
  }
  _onGroupSelect(selectedKeys) {
    const { data, updateModule } = this.props;
    this.setState({
      selectedColumns: []
    });
    updateModule(data.setIn(['options', 'activedGroup'], selectedKeys[0]));
  }
  _onAddGroupBtn() {
    this.setState({
      showAddItem: true
    });
  }
  _addGroup(activeId, val, groupData = {}, entityId = null) {
    const { data, updateModule, i18n } = this.props;
    this.setState({
      showAddItem: false
    });
    if (!val || data.options.groups.map(v => v.name).indexOf(val) > -1) {
      Confirm({
        title: i18n.TOOLTIP,
        type: 'info',
        content: i18n.PARAM_GROUP_NAME_BEEN_USED.replace('{num}', val),
        onOk: () => {}
      });
      return;
    } else {
      updateModule(
        data.setIn(['options', 'groups', data.options.groups.length], {
          _id: activeId,
          name: val,
          data: groupData,
          entityId: entityId
        })
      );
    }
  }
  _renameGroup(activeId, val) {
    const { data, updateModule } = this.props;
    const activedGroup = activeId || data.options.activedGroup;
    let selectedItem = data.options.groups.find(v => v._id == activedGroup);
    if (val == selectedItem.name) {
      return;
    }
    if (!val || data.options.groups.map(v => v.name).indexOf(val) > -1) {
      Confirm({
        title: i18n.TOOLTIP,
        type: 'info',
        content: i18n.PARAM_GROUP_NAME_BEEN_USED.replace('{num}', val),
        onOk: () => {}
      });
      return;
    } else {
      let index = data.options.groups.findIndex(v => v._id == activedGroup);
      updateModule(
        data.setIn(['options', 'groups', index], selectedItem.set('name', val))
      );
    }
  }
  _removeGroup(activeId) {
    const { data, updateModule, i18n } = this.props;
    const activedGroup = activeId || data.options.activedGroup;
    let selectedItem = data.options.groups.find(v => v._id == activedGroup);
    Confirm({
      title: i18n.TOOLTIP,
      type: 'info',
      content: i18n.SURE_DELETE_PARAM.replace('{num}', selectedItem.name),
      onOk: () => {
        this.setState({
          selectedColumns: []
        });
        if (data.options.groups.length == 1) {
          //必须剩下一个默认的
          let index = data.options.groups.findIndex(v => v._id == activedGroup);
          let newId = ObjectId();
          updateModule(
            data
              .setIn(['options', 'groups', index], {
                _id: newId,
                name: 'Default',
                data: {},
                entityId: null
              })
              .setIn(['options', 'activedGroup'], newId)
          );
        } else {
          updateModule(
            data
              .setIn(
                ['options', 'groups'],
                data.options.groups.flatMap(
                  v => (v._id == activedGroup ? [] : v)
                )
              )
              .setIn(['options', 'activedGroup'], data.options.groups[0]._id)
          );
        }
      },
      onCancel: () => {}
    });
  }
  _onColumnSelected(keys) {
    this.setState({
      selectedColumns: keys
    });
  }
  _changePoint(name, key, value) {
    const { updateModule, data } = this.props;
    const activedGroup = data.options.activedGroup;
    this.setState({
      selectedColumns: []
    });
    let index = data.options.groups.findIndex(v => v._id == activedGroup);
    updateModule(
      data.setIn(
        ['options', 'groups', index, 'data'],
        data.options.groups[index].data.set(name, value)
      )
    );
  }
  _getColumns() {
    const { i18n } = this.props;
    const columns = [
      {
        fieldName: 'projName',
        key: 'projName',
        minWidth: 100,
        maxWidth: 100,
        name: i18n.PROJECT_NAME,
        className: css('row'),
        isCollapsable: true,
        isMultiline: true,
        isResizable: true
      },
      {
        fieldName: 'name',
        key: 'name',
        minWidth: 120,
        name: i18n.PARAMETER_NAME,
        className: css('row'),
        isCollapsable: true,
        isMultiline: true,
        isResizable: true
      },

      {
        fieldName: 'point',
        key: 'point',
        minWidth: 200,
        maxWidth: 200,
        name: i18n.POINT_VALUE,
        className: css('row'),
        isCollapsable: true,
        isMultiline: true,
        isResizable: true,
        onRender: (item, index, headItem) => {
          return (
            <PointText
              dom={item[headItem['fieldName']]}
              data={{
                key: headItem['fieldName'],
                name: item[headItem['fieldName']]
              }}
              resetItem={this._changePoint.bind(this, item.name)}
              verification={value => {
                let reg = /^@\d+\|\w+$/;
                const { items } = this.state;
                if (value != '' && !reg.test(value)) {
                  return {
                    status: false,
                    msg: i18n.POINT_FORMAT
                  };
                }
                return {
                  status: true
                };
              }}
            />
          );
        }
      },
      {
        fieldName: 'value',
        key: 'value',
        name: i18n.REAL_TIME_VALUE,
        className: css('row'),
        isCollapsable: true,
        isMultiline: true,
        isResizable: true,
        minWidth: 120,
        maxWidth: 120
      },
      {
        fieldName: 'tag',
        key: 'tag',
        minWidth: 120,
        maxWidth: 120,
        name: i18n.TAG,
        className: css('row'),
        isCollapsable: true,
        isMultiline: true,
        isResizable: true,
        onRender: (item, index, headItem) => {
          let tags = item.tag;
          return (
            <ul className={css('tagUl')}>
              {tags.map((tag, i) => <li key={i}>{tag}</li>)}
            </ul>
          );
        }
      },
      {
        fieldName: 'alias',
        key: 'alias',
        minWidth: 120,
        maxWidth: 120,
        name: i18n.ANNOTATION,
        className: css('row'),
        isCollapsable: true,
        isMultiline: true,
        isResizable: true
      },
      {
        fieldName: 'chart',
        key: 'chart',
        minWidth: 50,
        maxWidth: 50,
        name: i18n.HISTORY,
        className: css('row'),
        isCollapsable: true,
        isMultiline: true,
        isResizable: false,
        onRender: (item, index, headItem) => {
          return (
            <i
              className={css('chartIcon', 'ms-Icon ms-Icon--Chart')}
              onClick={this._onColumnSelected.bind(this, [item.key])}
            />
          );
        }
      }
    ];
    return columns;
  }
  _onTabelDrop(ev) {
    const { updateModule, data, i18n } = this.props;
    const activedGroup = data.options.activedGroup;
    let dragTagInfo = ev.dataTransfer.getData('dragTagInfo'),
      dragDsInfo = ev.dataTransfer.getData('dragDsInfo'),
      dragInfo = dragTagInfo || dragDsInfo;
    if (dragInfo) {
      let info = JSON.parse(dragInfo);
      let index = data.options.groups.findIndex(v => v._id == activedGroup);
      if (data.options.params.map(v => v.name).indexOf(info.name) > -1) {
        Confirm({
          title: i18n.TOOLTIP,
          type: 'info',
          content: i18n.PARAM_NAME_BEEN_USED.replace('{name}', info.name),
          onOk: () => {}
        });
      } else {
        updateModule(
          data
            .setIn(['options', 'params', data.options.params.length], {
              description: '',
              name: info.name,
              sample: '',
              tags: info.tags
            })
            .setIn(
              ['options', 'groups', index, 'data'],
              data.options.groups[index].data.set(info.name, info.id)
            )
        );
      }
    }
  }
  _onTreeDrop(ev) {
    const {
      updateModule,
      data,
      i18n,
      selectedDataSourceProjectId
    } = this.props;
    const activedGroup = data.options.activedGroup;
    let dragTagGroupInfo = ev.dataTransfer.getData('dragTagGroupInfo');
    if (dragTagGroupInfo) {
      let info = JSON.parse(dragTagGroupInfo);
      this.setState({
        treeSpinner: true
      });
      let asyncArr = [],
        async = $.Deferred();
      const check = () => {
        let statusArr = asyncArr.map(v => v.status);
        if (statusArr.indexOf(0) < 0) {
          async.resolve(asyncArr);
        } else {
          let txt =
            (
              statusArr.filter(v => v == 1).length /
              statusArr.length *
              100
            ).toFixed(1) + '%';
          this.setState({
            treeSpinnerLabel: txt
          });
        }
      };
      const loop = (id, name, entityId = null) => {
        asyncArr.push({
          id: id,
          data: [],
          status: 0,
          name,
          entityId
        });
        apiFetch.getDataSourceList(selectedDataSourceProjectId, id).subscribe({
          error: rs => {},
          next: rs => {
            if (rs.data && rs.data.length) {
              let target = asyncArr.find(v => v.id == id);
              target.status = 1;
              target.data = rs.data.filter(v => v.type == 'thing');
              let groups = rs.data.filter(v => v.type != 'thing');
              if (groups.length > 0) {
                groups.forEach(g => {
                  loop(g._id, `${name}_${g.name}`, g.entityId);
                });
              } else {
                check();
              }
            } else {
              check();
            }
          }
        });
      };
      loop(info._id, info.name, info.entityId);
      async.done(rs => {
        this.setState({
          treeSpinner: false,
          treeSpinnerLabel: '0.0%'
        });
        rs.forEach(info => {
          let groupData = {};
          data.options.params.forEach(param => {
            let targetName = '';
            let maxNum = 0;
            info.data.forEach(v => {
              let tagMatchRs = tagMatch(param.tags, v.tag);
              if (tagMatchRs >= maxNum) {
                targetName = v.name;
                maxNum = tagMatchRs;
              }
            });
            groupData[param.name] = targetName
              ? `@${selectedDataSourceProjectId}|${targetName}`
              : '';
          });
          this._addGroup(ObjectId(), info.name, groupData, info.entityId);
        });
      });
    }
  }
  _createChart() {
    const { dataSource, selectedColumns, historyData } = this.state;
    if (selectedColumns.length == 0) {
      return null;
    }
    return (
      <ShowDataChart
        data={{
          data: historyData.list.map((v, i) => ({
            value: v.data,
            name: dataSource.find(v => v.key == selectedColumns[i]).name
          })),
          time: historyData.timeShaft
        }}
      />
    );
  }
  _setChartCondition(conditions) {
    const { updateModule, data } = this.props;
    let timeConfig = Object.assign(
      {},
      data.options.timeConfig || {},
      conditions
    );
    updateModule(data.setIn(['options', 'timeConfig'], timeConfig));
  }
  _showModal() {
    this.refs.ParametricExampleModal.toggleShow(true);
  }
  _showChartConfig() {}
  _updateData(arr) {
    let names = arr.flatMap(v => v.name);
    let newGroups = this.props.data.options.groups.flatMap(group => {
      let newData = {};
      names.forEach(name => {
        if (group.data[name] != undefined) {
          newData[name] = group.data[name];
        }
      });
      return group.set('data', newData);
    });
    this.setState({
      selectedColumns: [],
      historyData: {
        list: [],
        timeShaft: []
      }
    });
    this.props.updateModule(
      this.props.data
        .setIn(['options', 'params'], arr)
        .setIn(['options', 'groups'], newGroups)
    );
  }
  _onCheckboxChang(ev, isChecked) {
    const { updateModule, data } = this.props;
    updateModule(data.setIn(['options', 'completing'], isChecked ? 1 : 0));
  }
  _onExportExcel() {
    const { data } = this.props;
    let head = data.options.params.map(v => v.name),
      body = [];
    data.options.groups.forEach((g, i) => {
      body[i] = body[i] || [g.name];
      head.forEach(k => {
        body[i].push(g.data[k] == undefined ? '' : g.data[k]);
      });
    });
    let query = {
      head: ['参数组名称', ...head],
      data: body
    };
    apiFetch.exportDataExcel(query).subscribe({
      error: rs => {},
      next: rs => {
        if (rs.status != 'OK') {
          return;
        }
        let aTag = document.createElement('a');
        aTag.download = `${this.props.i18n.MODULE_NAME}.xls`;
        aTag.href = rs.data;
        document.body.appendChild(aTag);
        aTag.onclick = function() {
          document.body.removeChild(aTag);
        };
        aTag.click();
      }
    });
  }
  _onImportExcel(e) {
    const { i18n, data, updateModule } = this.props;
    let file = e.target.files[0];
    let types = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (types.indexOf(file.type) < 0) {
      Confirm({
        title: i18n.WARNING,
        type: 'warning',
        content: i18n.UNSUPPORTED_FILE_FORMAT,
        onOk: () => {}
      });
      return;
    }
    let formData = new FormData();
    formData.append('file', e.target.files[0]);
    apiFetch.readDataSourceExcel(formData).subscribe(resp => {
      if (resp.status === 'OK') {
        let groups = data.options.groups,
          params = data.options.params;
        Object.keys(resp.data).forEach(name => {
          let newGroupData = resp.data[name];
          let targetGroup = groups.find(v => v.name == name);
          let newData = {};
          if (targetGroup) {
            let index = groups.findIndex(v => v.name == name);

            params.forEach(p => {
              let k = p.name;
              newData[k] =
                newGroupData[k] == undefined
                  ? targetGroup.data[k]
                  : newGroupData[k];
            });
            targetGroup = targetGroup.set('data', newData);
            groups = groups.set(index, targetGroup);
          } else {
            params.forEach(p => {
              let k = p.name;
              newData[k] = newGroupData[k] == undefined ? '' : newGroupData[k];
            });
            groups = groups.set(groups.length, {
              _id: ObjectId(),
              data: newData,
              name: name,
              entityId: null
            });
          }
        });
        updateModule(data.setIn(['options', 'groups'], groups));
      }
    });
  }
}

DataSourcePanel.propTypes = {};
var mapDispatchToProps = {
  getTagDict
};

var mapStateToProps = function(state) {
  return {
    tagDict: state.home.tagDict,
    selectedDataSourceProjectId: state.home.selectedDataSourceProjectId
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSourcePanel);

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import * as moment from 'moment';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

import HotTable from '../../../components/HotTable';
import CustomSpinner from '../../../components/CustomSpinner';
import Pagination from '../../../components/Pagination';
import Confirm from '../../../components/Confirm';
import ChartViewModal from './ChartViewModal';
import CheckboxGroup from './CheckboxGroup';
import SearchGroup from './SearchGroup';
import RulePanel from './RulePanel';

import s from './DataMonitoringPanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
const shouldStop = e => {
  return $(e.target)
    .closest('div')
    .hasClass(s['disabled']);
};

class DataMonitoringPanel extends React.Component {
  constructor(props) {
    super(props);
    this.isNeedAsyncData = true;
    this.couldUpdate = true;
    this.state = {
      //分页数据相关
      current: 1,
      pageSize: 2000,
      total: 0,
      //数据相关
      datasource: [],
      updateDatasource: [],
      //筛选条件
      filterCfg: [],
      searchType: 'originalPointName',
      searchMode: 'regex',
      searcValue: '',
      //表格相关
      tableHeight: 350,
      selectedIndexes: [],
      //批量配置相关
      batchConfigShow: false,
      //历史相关
      chartHistoryShow: false,
      chartHistoryNames: [],
      //表格spinner
      tableSpinner: false
    };
    this.baseColumns = [
      {
        key: 'originalPointName',
        name: props.i18n.ORIGINAL_POINT_NAME,
        width: 200,
        resizable: true,
        toolTip: '',
        disabled: true
      },
      {
        key: 'sitePointName',
        name: props.i18n.SITE_POINT_NAME,
        width: 200,
        resizable: true,
        toolTip: '',
        disabled: true
      },
      {
        key: 'pointAnnotation',
        name: props.i18n.POINT_ANNOTATION,
        width: 200,
        resizable: true,
        toolTip: '',
        disabled: true
      },
      {
        key: 'realtimeValue',
        name: props.i18n.REALTIME_VALUE,
        width: 200,
        resizable: true,
        toolTip: '',
        disabled: true
      },
      {
        key: 'realtimeValueUpdateTime',
        name: props.i18n.REALTIME_VALUE_UPDATE_TIME,
        width: 200,
        resizable: true,
        toolTip: ''
      },
      {
        key: 'dtuName',
        name: props.i18n.DTU_NAME,
        width: 200,
        resizable: true,
        toolTip: '',
        disabled: true
      },
      {
        key: 'dtuDisplayName',
        name: props.i18n.DTU_DISPLAY_NAME,
        width: 200,
        resizable: true,
        toolTip: props.i18n.ANNOTATION_DTU_DISPLAY_NAME,
        disabled: true
      },
      {
        key: 'exchangerDisplayName',
        name: props.i18n.EXCHANGER_DISPLAY_NAME,
        width: 200,
        resizable: true,
        toolTip: props.i18n.ANNOTATION_EXCHANGER_DISPLAY_NAME,
        disabled: true
      },
      {
        key: 'updateTimePointName',
        name: props.i18n.UPDATE_TIME_POINT_NAME,
        width: 200,
        resizable: true,
        toolTip: '',
        disabled: true
      },
      {
        key: 'tag',
        name: props.i18n.TAG,
        width: 400,
        resizable: true,
        toolTip: '',
        disabled: true,
        renderer: (instance, td, row, col, prop, value, cellProperties) => {
          if ($.isArray(value)) {
            let wrap = document.createElement('DIV');
            wrap.classList.add(s['tagUl']);
            wrap.classList.add(s['clear']);
            value.forEach(v => {
              let item = document.createElement('DIV');
              item.classList.add(s['tagLi']);
              item.innerHTML = v;
              wrap.appendChild(item);
            });
            td.innerHTML = '';
            td.appendChild(wrap);
          }
          return td;
        }
      }
    ];
    this.wrangColumns = [
      {
        key: 'unit',
        name: props.i18n.UNIT,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: ''
      },
      {
        key: 'min',
        name: props.i18n.MIN,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: '',
        isNumber: true
      },
      {
        key: 'max',
        name: props.i18n.MAX,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: '',
        isNumber: true
      },
      {
        key: 'continues',
        name: props.i18n.CONTINUOUS,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: props.i18n.ANNOTATION_CONTINOUS,
        isNumber: true
      },
      {
        key: 'condition',
        name: props.i18n.CONDITION,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: props.i18n.ANNOTATION_CONDITION
      },
      // {
      //   key: 'type_en',
      //   name: '设备类型(英文)',
      //   width: 200,
      //   resizable: true,
      //   editable: true,
      //   toolTip: ''
      // },
      // {
      //   key: 'type_zh',
      //   name: '设备类型(中文)',
      //   width: 200,
      //   resizable: true,
      //   editable: true,
      //   toolTip: ''
      // },
      {
        key: 'relation',
        name: props.i18n.RELATION,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: props.i18n.ANNOTATION_RELATION
      },
      {
        key: 'offlineCheckTime',
        name: props.i18n.OFFLINE_CHECK_TIME,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: props.i18n.ANNOTATION_OFFLINE_CHECK_TIME,
        isNumber: true
      },
      {
        key: 'suddenChange',
        name: props.i18n.SUDDEN_CHANGE,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: props.i18n.ANNOTATION_SUDDEN_CHANGE,
        isNumber: true
      },
      {
        key: 'suddenChangeRatio',
        name: props.i18n.SUDDEN_CHANGE_RATIO,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: props.i18n.ANNOTATION_SUDDEN_CHANGE_RATIO,
        isNumber: true
      },
      {
        key: 'oscillationCheck',
        name: props.i18n.OSCILLATION_CHECK,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: props.i18n.ANNOTATION_OSCILLATION_CHECK
      },
      {
        key: 'dataSourceType',
        name: props.i18n.DATA_SOURCE_TYPE,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: props.i18n.ANNOTATION_DATA_SOURCE_TYPE
      },
      {
        key: 'slopeNegativeCheck',
        name: props.i18n.SLOPE_NEGATIVE_CHECK,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: props.i18n.ANNOTATION_SLOPE_NEGATIVE_CHECK
      },
      {
        key: 'annotation',
        name: props.i18n.ANNOTATION,
        width: 200,
        resizable: true,
        editable: true,
        toolTip: ''
      }
    ];
    //表格相关
    this._onCheckboxGroupChnage = this._onCheckboxGroupChnage.bind(this);
    this._onTableResize = this._onTableResize.bind(this);
    //分页相关
    this._onPageChange = this._onPageChange.bind(this);
    this._onChangeValue = this._onChangeValue.bind(this);
    //筛选搜索相关
    this._onFilterCfgChange = this._onFilterCfgChange.bind(this);
    this._onSearchTypeChange = this._onSearchTypeChange.bind(this);
    this._onSearch = this._onSearch.bind(this);
    //toolbar相关
    this._onBatchConfigBtn = this._onBatchConfigBtn.bind(this);
    this._onDeleteRowBtn = this._onDeleteRowBtn.bind(this);
    this._onHistoryBtn = this._onHistoryBtn.bind(this);
    this._onAsyncBtn = this._onAsyncBtn.bind(this);
    this._onSaveChangeBtn = this._onSaveChangeBtn.bind(this);
    this._onRebackChangeBtn = this._onRebackChangeBtn.bind(this);
    this._onFromTag = this._onFromTag.bind(this);
    this._onFromExcel = this._onFromExcel.bind(this);
    this._importFile = this._importFile.bind(this);
    //历史相关

    //批量配置相关
    this._onBatchConfigOK = this._onBatchConfigOK.bind(this);
    this._onBatchConfigCancel = this._onBatchConfigCancel.bind(this);
  }
  componentDidMount() {
    this._onTableResize();
  }
  componentDidUpdate() {
    this._getTableAsync();
  }
  componentWillUnmount() {
    this.couldUpdate = false;
  }
  componentWillUpdate(nextProps, nextState) {
    const { updateModule, data } = nextProps;
    const { updateDatasource } = nextState;
    if (updateDatasource.length > 0 && !data.options.isItemChanged) {
      updateModule(data.setIn(['options', 'isItemChanged'], true));
    } else if (updateDatasource.length == 0 && data.options.isItemChanged) {
      updateModule(data.setIn(['options', 'isItemChanged'], false));
    }
  }
  render() {
    const {
      current,
      pageSize,
      total,
      datasource,
      updateDatasource,
      filterCfg,
      searchType,
      searcValue,
      tableHeight,
      batchConfigShow,
      selectedIndexes,
      chartHistoryShow,
      chartHistoryNames,
      tableSpinner
    } = this.state;
    const { data, updateModule, i18n } = this.props;
    const { columnSelectedKeys } = data.options;
    let columns = this._columnsGetter();
    return (
      <div className={css('dataMonitoringPanel')} ref={'dataMonitoringPanel'}>
        <div className={css('checkGroupWrap')} ref={'checkGroupWrap'}>
          <CheckboxGroup
            title={i18n.BASIC_ATTRIBUTES}
            selectedKeys={columnSelectedKeys}
            items={this.baseColumns}
            selectChange={this._onCheckboxGroupChnage}
            onResize={this._onTableResize}
          />
          <CheckboxGroup
            title={i18n.CONFIGURABLE_ATTRIBUTES}
            selectedKeys={columnSelectedKeys}
            items={this.wrangColumns}
            selectChange={this._onCheckboxGroupChnage}
            onResize={this._onTableResize}
          />
        </div>
        <div className={css('tableWrap')} ref={'tableWrap'}>
          <div className={css('toolbar clear')} ref={'toolbar'}>
            <div className={css('toolbarL clear')}>
              <div className={css('item')}>
                <Checkbox
                  label={i18n.NOT_CONFIGURED}
                  checked={filterCfg.indexOf('isNoCfg') >= 0}
                  onChange={this._onFilterCfgChange.bind(this, 'isNoCfg')}
                />
              </div>

              <div className={css('item')}>
                <Checkbox
                  label={i18n.CONFIGURED}
                  checked={filterCfg.indexOf('isAllCfg') >= 0}
                  onChange={this._onFilterCfgChange.bind(this, 'isAllCfg')}
                />
              </div>
            </div>
            <div className={css('toolbarC clear')}>
              <div className={css('item')} onClick={this._onBatchConfigBtn}>
                <i className={'ms-Icon ms-Icon--Share'} />
                <span>{i18n.BATCH_CONFIGURATION}</span>
              </div>
              <div
                className={css(
                  `item ${selectedIndexes.length > 0 ? '' : 'disabled'}`
                )}
                onClick={this._onDeleteRowBtn}
              >
                <i className={'ms-Icon ms-Icon--Save'} />
                <span>
                  {i18n.CLEAR_CONFIGURATION}
                  {selectedIndexes.length > 0
                    ? `(${selectedIndexes.length})`
                    : ''}
                </span>
              </div>
              <div
                className={css(
                  `item ${selectedIndexes.length > 0 ? '' : 'disabled'}`
                )}
                onClick={this._onHistoryBtn}
              >
                <i className={'ms-Icon ms-Icon--Share'} />
                <span>
                  {i18n.HISTORY}
                  {selectedIndexes.length > 0
                    ? `(${selectedIndexes.length})`
                    : ''}
                  {/* {chartHistoryNames.length > 0
                    ? `(${chartHistoryNames.length})`
                    : ''} */}
                </span>
              </div>
              <div className={css('item')} onClick={this._onAsyncBtn}>
                <i className={'ms-Icon ms-Icon--Download'} />
                <span>{i18n.REFRESH}</span>
              </div>
              <div className={css('item')} onClick={this._onFromTag}>
                <i className={'ms-Icon ms-Icon--Download'} />
                <span>{i18n.FROM_TAG_IMPORT}</span>
              </div>
              <div className={css('item')} onClick={this._onFromExcel}>
                <input
                  ref="excelFileIpt"
                  style={{ display: 'none' }}
                  type="file"
                  onChange={this._importFile}
                />
                <i className={'ms-Icon ms-Icon--Download'} />
                <span>{i18n.FROM_EXCEL}</span>
              </div>
              <div className={css('item disabled')}>
                <span>|</span>
              </div>
              <div
                className={css(
                  `item ${updateDatasource.length > 0 ? '' : 'disabled'}`
                )}
                onClick={this._onSaveChangeBtn}
              >
                <i className={'ms-Icon ms-Icon--Save'} />
                <span>{i18n.SAVE}</span>
              </div>
              <div
                className={css(
                  `item ${updateDatasource.length > 0 ? '' : 'disabled'}`
                )}
                onClick={this._onRebackChangeBtn}
              >
                <i className={'ms-Icon ms-Icon--DisableUpdates'} />
                <span>{i18n.RESET}</span>
              </div>
            </div>
            <div className={css('toolbarR clear')}>
              <SearchGroup
                selectedKey={searchType}
                selectedValue={searcValue}
                onChange={this._onSearchTypeChange}
                onSearch={this._onSearch}
                i18n={i18n}
              />
            </div>
          </div>
          <div className={css('content')}>
            <HotTable
              skin={'header_color_7da2f5 header_height_40'}
              option={{
                data: datasource.map(v => Object.assign({}, v, v.rule)),
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
                  let editSource = ['edit', 'Autofill.fill', 'CopyPaste.paste'];
                  let datasource = this.state.datasource.slice(),
                    updateDatasource = this.state.updateDatasource.slice(),
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
                        isChanged = true;
                        let rowToUpdate = datasource[index];
                        let temp = updateDatasource.find(
                          v =>
                            v.originalPointName == rowToUpdate.originalPointName
                        );
                        let updated = { [propName]: newV };
                        if (temp) {
                          Object.assign(temp, updated);
                        } else {
                          updateDatasource.push(
                            Object.assign(
                              {
                                originalPointName: rowToUpdate.originalPointName
                              },
                              updated
                            )
                          );
                        }
                        rowToUpdate.rule = Object.assign(
                          {},
                          rowToUpdate.rule,
                          updated
                        );
                      }
                    });
                  }
                  if (isChanged) {
                    this.setState({ datasource, updateDatasource });
                  }
                },
                manualColumnResize: true,
                maxRows: datasource.length,
                checkBox:{
                  isShow: true,
                  selectedIndexes:selectedIndexes,
                  selectedChanged:(selectedIndexes)=>{
                    this.setState({
                      selectedIndexes
                    });
                  }
                },
              }}
            />
            <CustomSpinner
              visible={tableSpinner}
              backgroundColor="rgba(255,255,255,.4)"
            />
          </div>
        </div>
        <div className={css('pageWrap')} ref={'pageWrap'}>
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={this._onPageChange}
            onChangeValue={this._onChangeValue}
            isShowPageSize={true}
            isShowTotalRecords={true}
          />
        </div>
        <ChartViewModal
          ids={chartHistoryNames.map(
            name => `@${appConfig.project.id}|${name}`
          )}
          isOpen={chartHistoryShow}
          onCancel={() => {
            this.setState({ chartHistoryShow: false });
          }}
          onDelete={a => {
            let x = a.map(v => v.replace(`@${appConfig.project.id}|`, ''));
            this.setState({
              chartHistoryNames: x
            });
          }}
          i18n={i18n}
        />
        <Panel
          className={s['rulePanel']}
          isOpen={batchConfigShow}
          type={PanelType.smallFluid}
          // onDismiss={this._onBatchConfigCancel}
          forceFocusInsideTrap={false}
          ignoreExternalFocusing={true}
          isBlocking={false}
          isLightDismiss={true}
          isHiddenOnDismiss={true}
          hasCloseButton={false}
        >
          <RulePanel
            data={data}
            columnNames={this.wrangColumns}
            columnSelectedKeys={columnSelectedKeys}
            onOK={this._onBatchConfigOK}
            onCancel={this._onBatchConfigCancel}
            i18n={i18n}
          />
        </Panel>
      </div>
    );
  }
  isStopChangeTab(next) {
    const { i18n } = this.props;
    const { updateDatasource } = this.state;
    if (updateDatasource.length > 0) {
      Confirm({
        title: i18n.TOOLTIP,
        type: 'info',
        content: i18n.UNSAVED_CONTENT_CONFIRM_EXIT,
        onOk: () => {
          next();
        },
        onCancel: () => {}
      });
      return true;
    }
  }
  _getTableAsync() {
    if (!this.isNeedAsyncData) {
      return;
    }
    const { data } = this.props;
    const { columnSelectedKeys } = data.options;
    const {
      current,
      pageSize,
      filterCfg,
      searchType,
      searcValue,
      searchMode
    } = this.state;
    let fieldsConfigured = [];
    filterCfg.forEach(v => {
      switch (v) {
        case 'isNoCfg':
          columnSelectedKeys.forEach(v => {
            fieldsConfigured.push(`${v}|0`);
          });
          break;
        case 'isAllCfg':
          columnSelectedKeys.forEach(v => {
            fieldsConfigured.push(`${v}|1`);
          });
          break;
      }
    });
    if (filterCfg.length == 0 || filterCfg.length == 2) {
      fieldsConfigured = [];
    }
    let fieldsConfiguredSet = new Set(this.wrangColumns.map(v => v.key));
    fieldsConfigured = fieldsConfigured.filter(v => fieldsConfiguredSet.has(v));
    let query = {
      pageIndex: current,
      pageSize,
      searchKeyName: searchType.split('_')[0],
      searchType: searchMode,
      searchPattern:
        searchMode == 'regex' || searchMode == 'list'
          ? searcValue
          : `${searcValue[0]}|${searcValue[1]}`,
      fieldsConfigured: fieldsConfigured.join(','),
      sortKeyName: '',
      sortOrder: 'ASC'
    };
    this.isNeedAsyncData = false;
    let tableSpinner = true;
    apiFetch.dqdConfigsGet(appConfig.project.id, query).subscribe({
      fail: rs => {},
      next: rs => {
        if (!this.couldUpdate) {
          return;
        }
        let newState = {};
        if (rs.data) {
          newState.datasource = rs.data.configs;
          newState.total = rs.data.total;
          newState.selectedIndexes = [];
        }

        newState.tableSpinner = false;
        this.setState(newState);
      }
    });
    this.setState({
      tableSpinner
    });
  }
  _columnsGetter() {
    const { data } = this.props;
    const { columnSelectedKeys } = data.options;
    let columns = this.baseColumns
      .concat(this.wrangColumns)
      .filter(v => columnSelectedKeys.indexOf(v.key) > -1);
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
  _onPageChange(num) {
    this.isNeedAsyncData = true;
    this.setState({
      current: num
    });
  }
  _onChangeValue(pageSize) {
    this.isNeedAsyncData = true;
    this.setState({
      pageSize
    });
  }
  _onFilterCfgChange(key, ev, isChecked) {
    const { filterCfg } = this.state;
    let newData = filterCfg.concat();
    if (isChecked) {
      newData.push(key);
    } else {
      newData = newData.filter(v => v != key);
    }
    this.isNeedAsyncData = true;
    this.setState({ filterCfg: newData, current: 1 });
  }
  _onSearchTypeChange(key, value, type) {
    // this.setState({
    //   searchMode: type,
    //   searchType: key,
    //   searcValue: value
    // });
  }
  _onSearch(key, value, type) {
    this.isNeedAsyncData = true;
    this.setState({
      searchMode: type,
      searchType: key,
      searcValue: value,
      current: 1
    });
  }
  _onCheckboxGroupChnage(v) {
    const { updateModule, data } = this.props;
    updateModule(data.setIn(['options', 'columnSelectedKeys'], v));
  }
  _onTableResize() {
    let fixedHeight =
      this.refs.pageWrap.offsetHeight + this.refs.checkGroupWrap.offsetHeight;
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
  _onBatchConfigBtn() {
    this.couldUpdate = false;
    this.setState({
      batchConfigShow: true
    });
  }
  _onDeleteRowBtn(e) {
    if (shouldStop(e)) {
      return false;
    }
    const { selectedIndexes, datasource, updateDatasource } = this.state;
    const { i18n } = this.props;
    let newDatasource = datasource.slice(),
      newUpdateDatasource = updateDatasource.slice();
    let names = [],
      baseDetectionSettings = {};
    Object.keys(newDatasource[0].rule).forEach(v => {
      baseDetectionSettings[v] = null;
    });
    selectedIndexes.forEach(index => {
      let originalPointName = newDatasource[index].originalPointName;
      names.push(originalPointName);
      newDatasource[index].rule = baseDetectionSettings;
      let temp = newUpdateDatasource.find(v => {
        v.originalPointName == originalPointName;
      });
      if (temp) {
        temp = Object.assign(temp, baseDetectionSettings);
      } else {
        newUpdateDatasource.push(
          Object.assign({ originalPointName }, baseDetectionSettings)
        );
      }
    });
    Confirm({
      title: i18n.TOOLTIP,
      content: `${i18n.IS_CLEAR_CONFIGURATION_ONE}${names
        .slice(0, 3)
        .join(',')}${
        selectedIndexes.length > 3
          ? i18n.IS_CLEAR_CONFIGURATION_TWO
          : i18n.IS_CLEAR_CONFIGURATION_THREE
      }${i18n.IS_CLEAR_CONFIGURATION_FOUR}`,
      type: 'info',
      onOk: () => {
        this.setState({
          datasource: newDatasource,
          selectedIndexes: [],
          updateDatasource: newUpdateDatasource
        });
      },
      onCancel: () => {}
    });
  }
  _onHistoryBtn(e) {
    if (shouldStop(e)) {
      return false;
    }
    const { i18n } = this.props;
    const { selectedIndexes, chartHistoryNames, datasource } = this.state;
    if (selectedIndexes.length > 10) {
      Confirm({
        title: i18n.TOOLTIP,
        content: i18n.UP_TO_COMPARISONS.replace('{num}', 10),
        type: 'info',
        onOk: () => {},
        onCancel: () => {}
      });
      return false;
    }
    let newChartHistoryNames = [];
    selectedIndexes.forEach(v => {
      newChartHistoryNames.push(datasource[v]['originalPointName']);
    });
    this.setState({
      chartHistoryShow: true,
      chartHistoryNames: newChartHistoryNames
    });
  }
  _onAsyncBtn() {
    this.isNeedAsyncData = true;
    this.setState({
      updateDatasource: []
    });
  }
  _onSaveChangeBtn(e) {
    if (shouldStop(e)) {
      return false;
    }
    const { updateDatasource } = this.state;
    let configs = {};
    updateDatasource.forEach(v => {
      configs[v.originalPointName] = v;
      Reflect.deleteProperty(v, 'originalPointName');
    });
    let tableSpinner = true;
    apiFetch.dqdConfigsSave(appConfig.project.id, configs).subscribe({
      fail: rs => {},
      next: rs => {
        tableSpinner = false;
        if (!this.couldUpdate) {
          return;
        }
        if (rs.success) {
          this.setState({ updateDatasource: [], tableSpinner });
        }
      }
    });
    this.setState({
      tableSpinner
    });
  }
  _onRebackChangeBtn(e) {
    if (shouldStop(e)) {
      return false;
    }
    this.isNeedAsyncData = true;
    this.setState({
      updateDatasource: []
    });
  }

  _onBatchConfigOK(datas, ruleItems) {
    const { updateModule, data } = this.props;
    const { datasource } = this.state;
    let newDatasource = datasource.slice();
    let oldName = newDatasource.map(v => v.originalPointName);
    datas.forEach(v => {
      let index = oldName.indexOf(v.originalPointName) >= 0;
      // if (index) {
      //   newDatasource[index] = v;
      // } else {
      //   newDatasource.push(v);
      // }
    });
    this.couldUpdate = true;
    this.setState({ batchConfigShow: false, datasource: newDatasource});
    updateModule(data.setIn(['options', 'ruleItems'], ruleItems));
    if(this.state.tableSpinner){
      this._onAsyncBtn();
    }
  }
  _onBatchConfigCancel(datas, ruleItems) {
    const { i18n } = this.props;
    Confirm({
      title: i18n.TOOLTIP,
      type: 'info',
      content: i18n.UNSAVED_CONTENT_CONFIRM_EXIT,
      onSave: () => {
        this._onBatchConfigOK(datas, ruleItems);
      },
      onDoNotSave: () => {
        this.couldUpdate = true;
        this.setState({
          batchConfigShow: false
        });
        if(this.state.tableSpinner){
          this._onAsyncBtn();
        }
      },
      onCancel: () => {}
    });
  }
  _onFromTag() {
    const { data, i18n } = this.props;
    const { datasource, updateDatasource } = this.state;
    if (this.state.tableSpinner) {
      return;
    }
    Confirm({
      title: i18n.ENTER_MATCH_DEGREE,
      type: 'info',
      value: '0.7',
      onOk: v => {
        if (v.trim() == '' || Number(v) < 0 || Number(v) > 1) {
          Confirm({
            title: i18n.WARNING,
            type: 'warning',
            content: i18n.EMPTY_MATCH_DEGREE,
            onOk: () => {}
          });
          return;
        }
        let query = {
          pointname: datasource.map(v => v.originalPointName),
          pointtag: datasource.map(v => v.tag),
          pointvalue: datasource.map(v => v.realtimeValue),
          ratioline: Number(v)
        };
        let tableSpinner = true;
        apiFetch.dataAttributebyTagInfo(query).subscribe({
          fail: rs => {},
          next: rs => {
            if (!this.couldUpdate) {
              return;
            }
            let newState = {};
            let newUpdateDatasource = updateDatasource.slice(),
              newDatasource = datasource.slice();
            Object.keys(rs).forEach(name => {
              let rule = rs[name];
              Reflect.deleteProperty(rule, 'tags');
              let temp = newUpdateDatasource.find(
                  v => v.originalPointName == name
                ),
                temp2 = newDatasource.find(v => v.originalPointName == name);
              if (temp) {
                Object.assign(temp, rule);
              } else {
                newUpdateDatasource.push(
                  Object.assign({ originalPointName: name }, rule)
                );
              }

              Object.assign(temp2, {
                rule: rule
              });
            });

            newState.updateDatasource = newUpdateDatasource;
            newState.datasource = newDatasource;
            newState.tableSpinner = false;
            this.setState(newState);
          }
        });
        this.setState({
          tableSpinner
        });
        return true;
      },
      onCancel: () => {},
      isShowInput: true
    });
  }
  _onFromExcel() {
    this.refs.excelFileIpt.click();
  }
  _importFile(e) {
    const { i18n } = this.props;
    let file = e.target.files[0];
    let types = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    // if (types.indexOf(file.type) < 0) {
    //   Confirm({
    //     title: i18n.WARNING,
    //     type: 'warning',
    //     content: i18n.UNSUPPORTED_FILE_FORMAT,
    //     onOk: () => {}
    //   });
    //   return;
    // }
    let formData = new FormData();
    formData.append('file', e.target.files[0]);
    apiFetch
      .readDataMonitoringExcel(appConfig.project.id, formData)
      .subscribe(resp => {
        if (resp.status === 'OK') {
          this._onAsyncBtn();
        }
      });
  }
}
export default DataMonitoringPanel;

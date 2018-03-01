/**
 * 测试评估右侧
 */
import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';
import {
  Pivot,
  PivotItem,
  PivotLinkFormat
} from 'office-ui-fabric-react/lib/Pivot';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';
import {
  faultGrade,
  faultGradeName,
  fuzzyRuleFaultSource,
  fuzzyRuleFaultSourceNames
} from '../../../common/enum.js';
import UnknownTooltip from '../../../components/UnknownTooltip';

import s from './EvaluateDetails.css';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

const columnStyles = {
  lineHeight: '40px',
  padding: '0 3px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

class Table extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { items, columns, content } = this.props;
    return (
      <div>
        <table className={s['operation']}>
          <thead className={s['operation-header']}>
            <tr className={s['thead-row']}>
              {columns.map((item, index) => (
                <th key={index}>
                  {item}{' '}
                  {content[item] !== undefined && (
                    <UnknownTooltip content={content[item]} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={s['operation-body']}>
            {items.map((item, index) => (
              <tr key={index} className={s['operation-row']}>
                {Object.values(item).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

class EvaluateDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: new Date(),
      items: [],
      rows: [],
      isSelected: 'OPERATION_PROCESS',
      faultInfoMap: {},
      searchValue: ''
    };
    this.getFaultsInfoAsync = undefined;
    // 控制列数
    this._columns = [
      {
        key: 1,
        name: props.i18n.FAULT_NAME,
        fieldName: 'name',
        minWidth: 130,
        isResizable: true,
        onRender: item => (
          <div style={columnStyles} title={item['name']}>
            {item['name']}
          </div>
        )
      },
      {
        key: 2,
        name: props.i18n.GRADE,
        fieldName: 'grade',
        maxWidth: 80,
        maxWidth: 80
        // onRender: item => <div style={columnStyles}>{item['grade']}</div>
      },
      {
        key: 3,
        name: props.i18n.DESCRIPTION,
        fieldName: 'description',
        minWidth: 130,
        isResizable: true,
        onRender: item => (
          <div style={columnStyles} title={item['description']}>
            {item['description']}
          </div>
        )
      },
      {
        key: 4,
        name: props.i18n.CLASSIFY,
        fieldName: 'type',
        maxWidth: 80,
        minWidth: 80
        // onRender: item => <div style={columnStyles}>{item['type']}</div>
      },
      {
        key: 5,
        name: props.i18n.IS_OCCUR,
        fieldName: 'isHappend',
        minWidth: 100,
        maxWidth: 100,
        onRender: item => <div style={columnStyles}>{item['isHappend']}</div>
      }
    ];
  }
  render() {
    let {
      items1,
      items2,
      rows,
      items,
      isSelected,
      faultInfoMap,
      searchValue
    } = this.state;
    const { moduleInputData, moduleOutputData, i18n } = this.props;
    let dnAnlsOpt = moduleInputData.find(
        v => v.dataType == dataTypes['DN_ANLS_OPT']
      ) || { data: false },
      dnOutputOpt = moduleInputData.find(
        v => v.dataType == dataTypes['DN_OUTPUT_OPT']
      ) || { data: false },
      dnInputOpt = moduleInputData.find(
        v => v.dataType == dataTypes['DN_INPUT_OPT']
      ) || { data: false },
      dsOpt = moduleInputData.find(v => v.dataType == dataTypes['DS_OPT']) || {
        data: false
      },
      dnTestScoreOutput = moduleOutputData.find(
        v => v.dataType == dataTypes['DN_TEST_SCORE_OUTPUT']
      ) || { data: false };
    let ruleBlock = (dnAnlsOpt.data && dnAnlsOpt.data.ruleBlock) || [
      { items: [], results: [] }
    ];
    let resultsItems = [],
      faultIds = [];

    dnOutputOpt.data &&
      dnOutputOpt.data.forEach((v, i) => {
        let target =
          dnTestScoreOutput.data &&
          dnTestScoreOutput.data.find(d => d.FaultName == v.name);
        if (!target) {
          return;
        }
        if (
          !faultInfoMap[appConfig.language] ||
          !faultInfoMap[appConfig.language][v.faultId]
        ) {
          faultIds.push(v.faultId);
          return;
        }
        let info = faultInfoMap[appConfig.language][v.faultId];
        resultsItems.push({
          key: '' + i,
          name: info.name,
          grade: faultGradeName[info.grade],
          description: info.description,
          type: fuzzyRuleFaultSourceNames[v.targetGroup] || i18n.UNKNOWN,
          isHappend: target.Status == 1 ? i18n.HAS_OCCURRED : i18n.NOT_OCCURR
        });
      });
    this._getFaultInfo(faultIds);
    let newResultsItems = [];
    if (searchValue !== '') {
      newResultsItems = resultsItems.filter(
        v => v.isHappend.indexOf(searchValue) !== -1
      );
    } else {
      newResultsItems = resultsItems;
    }
    return (
      <div className={s['details-container']}>
        <div className={s['details-navbar']}>
          <ul>
            {/* <li
              className={`${s['item']} ${isSelected === 'OPERATING_INDEX' &&
                ' selected'}`}
              onClick={this._changeSelected.bind(this, 'OPERATING_INDEX')}
            >
              <button>
                <span>{i18n.OPERATING_INDEX}</span>
              </button>
            </li> */}
            <li
              className={`${s['item']} ${isSelected === 'OPERATION_PROCESS' &&
                ' selected'}`}
              onClick={this._changeSelected.bind(this, 'OPERATION_PROCESS')}
            >
              <button>
                <span>{i18n.OPERATION_PROCESS}</span>
              </button>
            </li>
            <li
              className={`${s['item']} ${isSelected ===
                'COMPUTATIONAL_RESULTS' && ' selected'}`}
              onClick={this._changeSelected.bind(this, 'COMPUTATIONAL_RESULTS')}
            >
              <button>
                <span>{i18n.COMPUTATIONAL_RESULTS}</span>
              </button>
            </li>
          </ul>
          {isSelected === 'OPERATING_INDEX' && (
            <div className={s['operation-table']}>
              <Table
                items={[]}
                columns={[
                  i18n.METHOD,
                  'AUC',
                  'F1',
                  'CA',
                  'Precision',
                  'Recall'
                ]}
                content={{
                  [i18n.METHOD]: undefined,
                  AUC: i18n.ANNOTATION_AUC,
                  F1: i18n.ANNOTATION_F1,
                  Precision: i18n.ANNOTATION_PRECISION,
                  Recall: i18n.ANNOTATION_RECALL
                }}
              />
              <Table
                items={[]}
                columns={[i18n.METHOD, i18n.RESULT_HIT, i18n.CONSUMING_TIME]}
                content={{
                  [i18n.METHOD]: undefined,
                  [i18n.RESULT_HIT]: i18n.ANNOTATION_RESULT_HIT,
                  [i18n.CONSUMING_TIME]: undefined
                }}
              />
            </div>
          )}
          {isSelected === 'OPERATION_PROCESS' && (
            <div className={s['process']}>
              <div>
                <ul>
                  {ruleBlock.map((row, index) => (
                    <div key={index} className={s['process-row']}>
                      <li key={`items_${index}`} className={s['item']}>
                        {row.items.map((v, i) => (
                          <span key={`span_items_${i}`}>
                            <span>{v.continuity}</span>
                            <span className={s['item-value']}>
                              {` ${v.name} ` || ' '}
                            </span>
                            <span>{v.judge}</span>
                            <span className={s['item-value']}>
                              {` ${v.term} ` || ' '}
                            </span>
                          </span>
                        ))}
                        {row.results.map((v, i) => (
                          <span key={`span_results_${i}`}>
                            <span>{v.continuity}</span>
                            <span className={s['item-value']}>
                              {` ${v.name} ` || ' '}
                            </span>
                            <span>{v.judge}</span>
                            <span className={s['item-value']}>
                              {` ${v.term} ` || ' '}
                            </span>
                          </span>
                        ))}
                      </li>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {isSelected === 'COMPUTATIONAL_RESULTS' && (
            <div className={s['searchBox']}>
              <SearchBox
                onSearch={this._onSearch.bind(this)}
                onChange={this._onChange.bind(this)}
              />
            </div>
          )}
          {isSelected === 'COMPUTATIONAL_RESULTS' && (
            <div className={s['result']}>
              <div>
                <DetailsList
                  className="strategyList"
                  headerClassName="headers"
                  items={newResultsItems}
                  columns={this._columns}
                  groupProps={{
                    showEmptyGroups: true
                  }}
                  setKey="set"
                  layoutMode={DetailsListLayoutMode.justified}
                  selection={this._selection}
                  onItemInvoked={this._onItemInvoked}
                  compact={true}
                  selectionPreservedOnEmptyClick={false}
                  onRenderMissingItem
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  _onSearch(v) {
    this.setState({
      searchValue: v
    });
  }
  _onChange(v) {
    if (v == '') {
      this.setState({
        searchValue: v
      });
    }
  }
  _changeSelected(isSelected) {
    this.setState({
      isSelected
    });
  }
  _getFaultInfo(ids = []) {
    if (ids.length < 1 || this.getFaultsInfoAsync) {
      return;
    }
    let { faultInfoMap } = this.state;
    let postData = {
      pageNum: 1,
      pageSize: 20,
      grades: [],
      consequences: [],
      keywords: '',
      classNames: [],
      sort: [],
      lan: appConfig.language,
      ids: ids
    };
    this.getFaultsInfoAsync = apiFetch.getFaultsInfo(postData).subscribe(rs => {
      this.getFaultsInfoAsync = undefined;
      if (rs.status == 'OK') {
        let data = rs.data.data;
        faultInfoMap[appConfig.language] =
          faultInfoMap[appConfig.language] || {};
        data.forEach(info => {
          faultInfoMap[appConfig.language][info.id] = info;
        });
        this.setState({
          faultInfoMap
        });
      }
    });
  }
}
EvaluateDetails.propTypes = {};

export default EvaluateDetails;
/**
 * 诊断项配置模态框
 */

import React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import Pagination from '../../../components/Pagination';
import CustomSpinner from '../../../components/CustomSpinner';

import s from './FaultsManage.css';
//故障分类 faultMannger 弹出框页面左侧列表
//props
// selectedName    父级组件方法 处理所选中的是哪一类型的数据
// isAll           已选择/查看全部
// params          为已选择的时候需要用到的上次保存的输出参数
class FaultsClassification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classification: [],
      selectedName: []
    };
    this.selectedName = this.selectedName.bind(this);
    this.names = [
      {
        className: 'category',
        name: props.i18n.TYPE
      },
      {
        className: 'consequence',
        name: props.i18n.AFFECT
      },
      {
        className: 'grade',
        name: props.i18n.LEVEL
      }
    ];
    this.selectedCategory = [];
    this.selectedConsequence = [];
    this.selectedGrade = [];
    this.selectedNameArr = [];

    this.allClassification = [];
    this.chosenClassification = [];
  }
  componentWillReceiveProps(nextProps) {
    const { isAll, params } = nextProps;
    let _this = this;
    if (this.allClassification.length) {
      getRealClassification();
    } else {
      apiFetch.getFaultsClassNames(I18n.type).subscribe(rs => {
        this.allClassification = rs.data;
        getRealClassification();
      });
    }
    function getRealClassification() {
      if (isAll) {
        _this.setState({
          classification: _this.allClassification
        });
      } else {
        if (!_this.chosenClassification.length) {
          let ids = params.map(row => row.faultId);
          if (!ids.length) {
            let realDataArr = [];
            _this.allClassification.forEach((row, i) => {
              realDataArr.push({
                nameArr: [],
                count: []
              });
              row.nameArr.forEach((name, index) => {
                realDataArr[i]['nameArr'].push(name);
                realDataArr[i]['count'].push(0);
              });
            });
            _this.setState({
              classification: realDataArr
            });
          } else {
            apiFetch.getFaultsClassNamesByIds(I18n.type, ids).subscribe(rs => {
              let data = rs.data;
              _this.allClassification.forEach((row, i) => {
                row.nameArr.forEach((name, index) => {
                  if (data[i].nameArr.indexOf(name) === -1) {
                    data[i].nameArr.push(name);
                    data[i].count.push(0);
                  }
                });
              });
              _this.chosenClassification = data;
              _this.setState({
                classification: data
              });
            });
          }
        } else {
          _this.setState({
            classification: _this.chosenClassification
          });
        }
      }
    }
  }
  render() {
    const { i18n } = this.props;
    const { classification, selectedName } = this.state;
    let category, consequence, grade;
    if (classification && classification.length !== 0) {
      category = classification[0];
      consequence = classification[1];
      grade = classification[2];
    } else {
      return null;
    }
    return (
      <div className={s['listCtn']}>
        {classification.map((row, index) => {
          let singleName = this.names[index];
          return (
            <div className={s[singleName.className]} key={index}>
              <h3 className={s['titleName']}>{singleName.name}</h3>
              <div className={s['detail']}>
                {row.nameArr.map((v, i) => {
                  let name = v;
                  if (index === 2) {
                    switch (v) {
                      case 0:
                        name = i18n.SUGGESTION;
                        break;
                      case 1:
                        name = i18n.EXCEPTION;
                        break;
                      case 2:
                        name = i18n.FAULT;
                        break;
                    }
                  }
                  return (
                    <div
                      key={i}
                      className={
                        selectedName.indexOf(v.toString()) !== -1
                          ? s['selectedName']
                          : ''
                      }
                      onClick={this.selectedName}
                    >
                      <span className={s['typeName']} data-value={v}>
                        {name}
                      </span>
                      <span className={s['countNum']}>{row.count[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  selectedName(e) {
    let target = e.currentTarget;
    let name = target.children[0].dataset.value;
    let index = this.selectedNameArr.indexOf(name);
    if (index === -1) {
      this.selectedNameArr.push(name);
    } else {
      this.selectedNameArr.splice(index, 1);
    }
    this.setState({
      selectedName: this.selectedNameArr
    });

    let parent = e.currentTarget.parentNode.parentNode;
    let arr, type;
    if (parent.className.indexOf('category') !== -1) {
      arr = this.selectedCategory;
      type = 'category';
    } else if (parent.className.indexOf('consequence') !== -1) {
      arr = this.selectedConsequence;
      type = 'consequence';
    } else if (parent.className.indexOf('grade') !== -1) {
      arr = this.selectedGrade;
      type = 'grade';
      name = Number(name);
    }
    let partIndex = arr.indexOf(name);
    if (partIndex === -1) {
      arr.push(name);
    } else {
      arr.splice(partIndex, 1);
    }
    this.props.selectedName(arr, type);
  }
}
// faultMannger 弹出框页面右侧详情
//props
class FaultsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faults: [],
      nums: 0,
      copyData: {},
      selectionDetails: [],
      spinner: false
    };
    this.togglePageNumber = this.togglePageNumber.bind(this);
    let styleJson = {
      lineHeight: '38px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    };
    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectionDetails: this._selection.getSelection()
        });
        props.updateModule(this._selection.getSelection());
      },
      getKey: item => {
        return item.id;
      }
    });
    this._columns = [
      {
        key: 'parameterName',
        name: props.i18n.DIAGNOSIS_PARAM_NAME,
        minWidth: 120,
        maxWidth: 120,
        onRender: item => (
          <div style={styleJson} title={item['paramName']}>
            {item['paramName']}
          </div>
        )
      },
      {
        key: 'name',
        name: props.i18n.FAULT_NAME,
        minWidth: 130,
        onRender: item => (
          <div style={styleJson} title={item['name']}>
            {item['name']}
          </div>
        )
      },
      {
        key: 'description',
        name: props.i18n.DESCRIPTION,
        minWidth: 130,
        onRender: item => (
          <div style={styleJson} title={item['description']}>
            {item['description']}
          </div>
        )
      },
      {
        key: 'lastModifyTime',
        name: props.i18n.TIME,
        minWidth: 120,
        maxWidth: 120,
        onRender: item => <div style={styleJson}>{item['lastModifyTime']}</div>
      },
      {
        key: 'lastModifyUser',
        name: props.i18n.MODIFIER,
        minWidth: 100,
        maxWidth: 120,
        onRender: item => <div style={styleJson}>{item['lastModifyUser']}</div>
      },
      {
        key: 'diagnosisButton',
        name: props.i18n.DIAGNOSIS,
        minWidth: 100,
        maxWidth: 120,
        onRender: item => (
          <div
            className={
              this.state.selectionDetails && this.state.selectionDetails.length
                ? this.state.selectionDetails.find(row => row.id === item['id'])
                  ? s['configButton'] + ' ' + s['showConfigBtn']
                  : s['configButton']
                : s['configButton']
            }
            onClick={this.showConfigModal.bind(this, item)}
          >
            {props.i18n.CONFIGURATION}
          </div>
        )
      }
    ];
  }
  componentWillReceiveProps(nextProps) {
    // if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
    const { condition, isAll, params } = nextProps;
    let ids = [];
    if (!isAll) {
      if (params.length) {
        ids = params.map(row => row.faultId);
      } else {
        this.setState({
          faults: [],
          nums: 0
        });
        return;
      }
    }
    let postData = {
      pageNum: condition.selectedPageNum,
      pageSize: 20,
      grades: condition.grade,
      consequences: condition.consequence,
      keywords: condition.searchKey,
      classNames: condition.category,
      sort: [],
      lan: I18n.type,
      ids: ids,
      searchType: condition.optKey
    };
    apiFetch.getFaultsInfo(postData).subscribe(rs => {
      let data = rs.data.data;
      let selectedItems = [],
        newData = [];
      this._selection.setChangeEvents(false, true);
      this._selection.setItems(data);
      data.forEach(row => {
        let paramName;
        let paramInfo = params.find(v => v.faultId === row.id);
        if (paramInfo) {
          paramName = paramInfo.name || '';
          this._selection.setKeySelected(row.id, true, false);
          selectedItems.push(row);
        } else {
          paramName = '';
        }
        row = Object.assign({}, row, {
          paramName: paramName
        });
        newData.push(row);
      });
      this._selection.setChangeEvents(true, true);
      this.setState({
        faults: newData,
        nums: rs.data.total,
        selectionDetails: selectedItems,
        spinner: false
      });
    });
    // }
  }
  render() {
    const { condition, params, i18n } = this.props;
    const { faults, nums, spinner } = this.state;
    return (
      <div className={s['faultsInfoCtn']}>
        <div className={s['faultsCtn']}>
          <DetailsList
            className={s['faultsList']}
            items={faults}
            columns={this._columns}
            setKey="id"
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
          />
          <CustomSpinner visible={spinner} />
        </div>
        <div className={s['pageNumCtn']}>
          <Pagination
            current={condition.selectedPageNum}
            total={nums}
            onChange={this.togglePageNumber}
            pageSize={200}
            isShowTotalRecords={true}
          />
        </div>
      </div>
    );
  }
  togglePageNumber(pageNum) {
    this.setState({
      spinner: true
    });
    this.props.togglePageNumber(pageNum);
  }
  showConfigModal(item, e) {
    const { selectionDetails } = this.state;
    e.preventDefault();
    e.stopPropagation();
    if (
      selectionDetails &&
      selectionDetails.length &&
      selectionDetails.find(row => row.id === item.id)
    ) {
      this.props.showConfigModal(item);
    }
  }
}

//faultMannger 弹出框页面
//props
// isShow             是否显示的状态
// isShowFaultManger  改变显示状态的方法
class FaultsManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      condition: {
        category: [],
        consequence: [],
        grade: [],
        searchKey: '',
        selectedPageNum: 1
      },
      nums: 0,
      isAll: false,
      optKey: 'param',
      placeholder: props.i18n.ENTER_PARAM_NAME
    };
    this.faults = [];
    this.nums = 0;
    this.togglePageNumber = this.togglePageNumber.bind(this);
    this.getNums = this.getNums.bind(this);
    this.searchKey = this.searchKey.bind(this);
    this.changeSearchKeyClear = this.changeSearchKeyClear.bind(this);
    this.showConfigModal = this.showConfigModal.bind(this);
    this.changeIsAll = this.changeIsAll.bind(this);
    this.updateModule = this.updateModule.bind(this);
    this._onChange = this._onChange.bind(this);
  }
  render() {
    const { params, i18n } = this.props;
    const { condition, nums, isAll, optKey, placeholder } = this.state;
    return (
      <div className={s['faultManagerCtn']}>
        <div className={s['leftSlider']}>
          <div className={s['panelTitle']}>
            <span>{i18n.MODULE_NAME}</span>
          </div>
          <div className={s['faultsClassification']}>
            <FaultsClassification
              selectedName={this.selectedName.bind(this)}
              isAll={isAll}
              params={params}
              i18n={i18n}
            />
          </div>
        </div>
        <div className={s['faultsInfo']}>
          <div className={s['toolCtn']}>
            <div className={s['buttonCtn']}>
              <div>
                <i className="ms-Icon ms-Icon--AddEvent" />
                <span>{i18n.ADD}</span>
              </div>
              <div>
                <i className="ms-Icon ms-Icon--Import" />
                <span>{i18n.IMPORT}</span>
              </div>
            </div>
            <div className={s['centerWrap']}>
              <ul>
                <li
                  className={isAll ? '' : s['active']}
                  onClick={this.changeIsAll}
                >
                  {i18n.SELECTED}
                </li>
                <li
                  className={isAll ? s['active'] : ''}
                  onClick={this.changeIsAll}
                >
                  {i18n.VIEW_ALL}
                </li>
              </ul>
            </div>
            <div className={s['searchGroup']}>
              <div className={s['dropDownCtn']}>
                <Dropdown
                  className={s['Dropdown']}
                  onChanged={this._onChange}
                  selectedKey={optKey}
                  options={[
                    { key: 'param', text: i18n.SEARCH_BY_PARAM_NAME },
                    { key: 'fault', text: i18n.SEARCH_BY_FAULT_NAME },
                    { key: 'description', text: i18n.SEARCH_BY_DESCRIPTION }
                  ]}
                  dropdownWidth={224}
                />
              </div>
              <div className={s['searchCtn']}>
                <SearchBox
                  onSearch={this.searchKey}
                  onClear={this.searchKey}
                  onChange={this.changeSearchKeyClear}
                  value={condition.searchKey}
                  labelText={placeholder}
                />
              </div>
            </div>
          </div>
          <FaultsInfo
            condition={condition}
            getNums={this.getNums}
            togglePageNumber={this.togglePageNumber}
            showConfigModal={this.showConfigModal}
            isAll={isAll}
            params={params}
            updateModule={this.updateModule}
            i18n={i18n}
          />
        </div>
      </div>
    );
  }
  _onChange(dropOpt) {
    const { i18n } = this.props;
    let placeholder = '',
      optKey = '';
    switch (dropOpt.key) {
      case 'param':
        optKey = 'param';
        placeholder = i18n.ENTER_PARAM_NAME;
        break;
      case 'fault':
        optKey = 'fault';
        placeholder = i18n.ENTER_FAULT_NAME;
        break;
      case 'description':
        optKey = 'description';
        placeholder = i18n.ENTER_DESCRIPTION;
        break;
    }
    this.setState({ optKey, placeholder });
  }
  selectedName(arr, type) {
    this.setState({
      condition: Object.assign({}, this.state.condition, {
        [type]: arr,
        selectedPageNum: 1
      })
    });
  }
  changeSearchKeyClear(value) {
    if (value === '') {
      this.setState({
        condition: Object.assign({}, this.state.condition, {
          searchKey: ''
        })
      });
    }
  }
  searchKey(value) {
    if (value.currentTarget) {
      value = '';
    }
    this.setState({
      condition: Object.assign({}, this.state.condition, {
        searchKey: value,
        optKey: this.state.optKey
      })
    });
  }
  getNums(nums) {
    this.setState({
      nums: nums
    });
  }
  togglePageNumber(num) {
    this.setState({
      condition: Object.assign({}, this.state.condition, {
        selectedPageNum: num
      })
    });
  }
  showConfigModal(item) {
    this.props.showConfigModal(item);
  }
  changeIsAll(e) {
    const { isAll } = this.state;
    const { i18n } = this.props;
    let name = e.target.innerHTML;
    if (name === i18n.SELECTED && isAll) {
      this.setState({
        isAll: false
      });
    } else if (name === i18n.VIEW_ALL && !isAll) {
      this.setState({
        isAll: true,
        selectedPageNum: 1
      });
    }
    this.setState({
      condition: Object.assign({}, this.state.condition, {
        selectedPageNum: 1
      })
    });
  }
  updateModule(items) {
    const { params } = this.props;
    const { isAll } = this.state;
    if (!isAll) {
      let newParams = [];
      items.forEach(row => {
        let param = params.find(v => row.id === v.faultId);
        if (param) {
          newParams.push(param);
        }
      });
      this.props.updateModule(newParams);
    }
  }
}
export default FaultsManage;

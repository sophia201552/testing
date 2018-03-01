import React from 'react';
import { connect } from 'react-redux';
import I from 'seamless-immutable';
import moment from 'moment';
import { moduleTypes, dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import HotTable from '../../../components/HotTable';
import Confirm from '../../../components/Confirm';
import s from './DataExportPanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

class DataExportPanel extends React.Component {
  constructor(props) {
    super(props);
    this.dataMap = new Map();
    this.state = {
      items: []
    };
    this._onExport = this._onExport.bind(this);
    this._onExportExcel = this._onExportExcel.bind(this);
  }
  static nameSuffix(nameArr = []) {
    let newNameArr = [];
    let nameSet = new Set();
    const rename = function(name, num, set) {
      if (set.has(name)) {
        let arr = name.split('_'),
          last = parseInt(arr[arr.length - 1]);
        if (isNaN(last)) {
          arr.push(++num);
        } else {
          num = ++last;
          arr[arr.length - 1] = num;
        }
        name = arr.join('_');
        return rename(name, num, set);
      } else {
        set.add(name);
        return name;
      }
    };
    nameArr.forEach(name => {
      newNameArr.push(rename(name, 0, nameSet));
    });
    return newNameArr;
  }
  static resetName(name, names, index = 0) {
    let finName = index == 0 ? name : `${name}_${index}`;
    if (names.indexOf(finName) < 0) {
      return finName;
    } else {
      return DataExportPanel.resetName(name, names, index + 1);
    }
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { data, moduleInputData } = nextProps;
    let moduleInputDataMap = {},
      items = [];
    moduleInputData.forEach(v => {
      moduleInputDataMap[v.dataType] = moduleInputDataMap[v.dataType] || [];
      moduleInputDataMap[v.dataType].push(v);
    });
    moduleInputDataMap[dataTypes.DS_HIS_OUTPUT].forEach((v, i) => {
      let moduleInfo = moduleInputDataMap[dataTypes.MODULE_INFO][i],
        moduleInfoData = moduleInfo.data ? moduleInfo.data : {},
        dsOptData = v.data ? v.data : { data: [], time: [] },
        dsOptTime = dsOptData.time;
      dsOptData = dsOptData.data;
      let moduleId = moduleInfoData.id,
        moduleName = moduleInfoData.name;
      let dsOptDataNames = dsOptData.map(v => v.name);
      dsOptData.forEach(dsOpt => {
        let id = `${moduleId}_${dsOpt.name}`;
        let item = (data.options.source[id] &&
          data.options.source[id].asMutable()) || {
          id: id,
          moduleName: moduleName,
          oldName: dsOpt.name,
          newName: dsOpt.name,
          remarks: '',
          type: 'none',
          format: 'none'
        };
        this.dataMap.set(id, {
          data: dsOpt,
          time: dsOptTime,
          name: item.newName,
          type: item.type,
          format: item.format
        });
        item.type = this._getTypeOptions(item.type);
        item.format = this._getFormatOptions(item.type, item.format);
        items.push(item);
      });
    });
    //解决重名
    let isChangedName = false;
    let newNamesArr = DataExportPanel.nameSuffix(items.map(v => v.newName));
    items.forEach((it, i) => {
      if (it.newName != newNamesArr[i]) {
        isChangedName = true;
        it.newName = newNamesArr[i];
      }
    });

    let isNeedSynchronization = (() => {
      if (!items.length) {
        return false;
      }
      let oldKeys = new Set(Object.keys(data.options.source)),
        newKeys = new Set(items.map(v => v.id));
      let difference1 = new Set([...oldKeys].filter(x => !newKeys.has(x))),
        difference2 = new Set([...oldKeys].filter(x => !newKeys.has(x)));
      return !(difference1.size == 0 && difference2.size == 0);
    })();
    if (isChangedName || isNeedSynchronization) {
      this._changeSourceByItems(items);
    } else {
      this.setState({
        items
      });
    }
  }
  render() {
    const _this = this;
    const { data, updateModule, moduleInputData, i18n } = this.props;
    const { items } = this.state;
    return (
      <div className={css('dataExportPanel')}>
        <div className={css('top-panel')}>
          {/* <div className={css('title')}>{i18n.MODULE_NAME}</div> */}
          <div className={css('content')}>
            <DefaultButton
              className={css('exportBtn')}
              primary={true}
              data-automation-id="test"
              text={i18n.EXPORT}
              onClick={this._onExport}
            />
            <DefaultButton
              className={css('exportBtn2')}
              primary={true}
              data-automation-id="test"
              text={i18n.EXPORT_EXCEL}
              onClick={this._onExportExcel}
            />
          </div>
        </div>
        <div className={css('bottom-panel')}>
          <HotTable
            ref="HotTable"
            option={{
              data: [
                {
                  moduleName: i18n.moduleName,
                  oldName: i18n.oldName,
                  newName: i18n.newName,
                  remarks: i18n.remarks,
                  type: i18n.type,
                  format: i18n.format
                },
                ...items.map(v => Object.assign({}, v))
              ],
              cells: function(row, col, prop) {
                let cellProperties = {};
                let visualRowIndex = this.instance.toVisualRow(row);
                // let visualColIndex = this.instance.toVisualColumn(col);
                if (visualRowIndex === 0) {
                  cellProperties.readOnly = true;
                }
                return cellProperties;
              },
              colHeaders: true,
              columns: [
                { data: 'moduleName', readOnly: true, colWidths: 1 },
                { data: 'oldName', readOnly: true, colWidths: 2 },
                { data: 'newName', colWidths: 2 },
                { data: 'remarks', colWidths: 1 },
                {
                  data: 'type',
                  type: 'dropdown',
                  source: this._getTypeOptions(),
                  colWidths: 1
                },
                {
                  data: 'format',
                  type: 'dropdown',
                  source: function(v, fn) {
                    let type = this.instance.getDataAtRowProp(this.row, 'type');
                    fn(_this._getFormatOptions(type));
                  },
                  colWidths: 2
                }
              ],
              afterChange: (changes, source) => {
                let editSource = ['edit', 'Autofill.fill', 'CopyPaste.paste'];
                //编辑状态
                if (editSource.indexOf(source) >= 0) {
                  let items = this.state.items.concat();

                  changes.forEach(row => {
                    let index = row[0],
                      propName = row[1],
                      oldV = row[2],
                      newV = row[3];
                    index = index - 1; //第一行不可编辑
                    switch (propName) {
                      case 'type':
                        if (newV != items[index][propName]) {
                          items[index]['format'] = this._getFormatOptions(
                            items[index][propName],
                            'none'
                          );
                        }
                        break;
                      case 'format':
                        newV = this._getFormatOptions(
                          items[index]['type'],
                          newV
                        )
                          ? newV
                          : items[index][propName];
                        break;
                      case 'newName':
                        let reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/;
                        let isOk = true,
                          msg = '';
                        if (!reg.test(newV)) {
                          isOk = false;
                          msg = i18n.error_name_1;
                        }
                        if (!isOk) {
                          newV = items[index][propName];
                          Confirm({
                            title: i18n.WARNING,
                            type: 'warning',
                            content: msg,
                            onOk: () => {}
                          });
                        }
                        if (items[index][propName] != newV) {
                          newV = DataExportPanel.resetName(
                            newV,
                            items.map(v => v[propName])
                          );
                        }
                        break;
                    }
                    items[index][propName] = newV;
                  });
                  this._changeSourceByItems(items);
                }
              },
              manualColumnResize: true,
              rowHeaders: true,
              // autoRowSize: {syncLimit: 300},
              maxRows: items.length,
              // colHeaders={true}
              // rowHeaders={false}
              // width="600"
              // height="300"
              // autoWrapRow={true}
              stretchH: 'all'
              // minSpareRows={0}
            }}
          />
        </div>
      </div>
    );
  }
  _getTypeOptions(key) {
    const { i18n } = this.props;
    let dict1 = {
        none: i18n['type_none'],
        decimal: i18n['type_decimal'],
        time: i18n['type_time']
      },
      dict2 = {
        [i18n['type_none']]: 'none',
        [i18n['type_decimal']]: 'decimal',
        [i18n['type_time']]: 'time'
      };
    if (key) {
      return dict1[key] || dict2[key];
    } else {
      return [i18n['type_none'], i18n['type_decimal'], i18n['type_time']];
    }
  }
  _getFormatOptions(type, key) {
    const { i18n } = this.props;
    let _getNoneOptions = key => {
      let dict1 = {
          none: i18n['type_none']
        },
        dict2 = {
          [i18n['type_none']]: 'none'
        };
      if (key) {
        return dict1[key] || dict2[key];
      } else {
        return [i18n['type_none']];
      }
    };
    let _getDecimalOptions = key => {
      let dict1 = {
          none: i18n['type_none']
        },
        dict2 = {
          [i18n['type_none']]: 'none',
          '0': '0',
          '1': '1',
          '2': '2'
        };
      if (key) {
        return dict1[key] || dict2[key];
      } else {
        return [i18n['type_none'], '0', '1', '2'];
      }
    };
    let _getTimeOptions = key => {
      let dict1 = {
          none: i18n['type_none'],
          'YYYY-MM-DD HH:mm:ss': i18n['format_1'],
          'YYYY-MM-DD': i18n['format_2'],
          'YYYY-MM-DD HH:mm:00': i18n['format_3']
        },
        dict2 = {
          [i18n['type_none']]: 'none',
          [i18n['format_1']]: 'YYYY-MM-DD HH:mm:ss',
          [i18n['format_2']]: 'YYYY-MM-DD',
          [i18n['format_3']]: 'YYYY-MM-DD HH:mm:00'
        };
      if (key) {
        return dict1[key] || dict2[key];
      } else {
        return [
          i18n['type_none'],
          i18n['format_1'],
          i18n['format_2'],
          i18n['format_3']
        ];
      }
    };
    let types = this._getTypeOptions();
    switch (type) {
      case types[0]:
        return _getNoneOptions(key);
      case types[1]:
        return _getDecimalOptions(key);
      case types[2]:
        return _getTimeOptions(key);
    }
    return [];
  }
  _changeSourceByItems(items) {
    const { data, updateModule } = this.props;
    items.forEach(item => {
      item.format = this._getFormatOptions(item.type, item.format);
      item.type = this._getTypeOptions(item.type);
    });
    let newSource = {};
    items.forEach(it => {
      newSource[it.id] = it;
    });
    updateModule(
      data.setIn(['options', 'source'], Object.assign({}, newSource))
    );
  }
  _dataFormat(dataArr, type, format) {
    dataArr = dataArr.concat();
    switch (type) {
      case 'decimal':
        if (format != 'none') {
          dataArr = dataArr.map(v =>
            Number((isNaN(Number(v)) ? 0 : Number(v)).toFixed(format))
          );
        }
        break;
      case 'time':
        if (format != 'none') {
          dataArr = dataArr.map(
            v => (moment(v) && moment(v).format(format)) || ''
          );
        }
        break;
    }
    return dataArr;
  }
  _onExport() {
    let point = [],
      value = [];
    this.dataMap.forEach(v => {
      let dataValue = this._dataFormat(v.data.value, v.type, v.format),
        dataTime = v.time.concat();
      point.push(v.name);
      value.push(
        JSON.stringify({
          data: dataValue,
          time: dataTime
        })
      );
    });
    let postData = {
      projId: 512 || appConfig.project.id,
      point: ['billTest3'], //point,
      value: [value[0]] //value
    };
    apiFetch.setMutileRealtimedata(postData).subscribe(resp => {
      if (resp.status === 'OK') {
      }
    });
  }
  _onExportExcel() {
    let headerData = this.refs.HotTable.options.data[0],
      bodyData = this.refs.HotTable.options.data.filter((v, i) => i != 0);
    let keys = Object.keys(headerData);
    let head = Object.values(headerData),
      body = bodyData.map(v => keys.map(k => v[k]));
    let query = {
      head,
      data: body
    };
    apiFetch.exportDataExcel(query).subscribe({
      fail: rs => {},
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
}
export default DataExportPanel;

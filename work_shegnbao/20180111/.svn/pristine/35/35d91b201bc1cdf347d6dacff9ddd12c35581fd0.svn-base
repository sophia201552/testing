/**
 * excel表格 导入并解析 模块
 */

import React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import s from './ConfigFileExcel.css';

export default class ConfigFileExcel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfig: false
    };
    this.setIsConfig = this.setIsConfig.bind(this);
    this.updateData = this.updateData.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { data, moduleResponseData } = nextProps;
  }
  render() {
    const { data, i18n } = this.props;
    const { isConfig } = this.state;
    let name = data.options.file ? data.options.file.name : '',
      size = data.options.file ? data.options.file.size : '';
    let width,
      dataObj = {};
    if (data.options.data && data.options.data.data) {
      dataObj = data.options.data;
      width = 100 / dataObj.data.length + '%';
    }
    return (
      <div className={s['excelImportAnalysisPanel']}>
        <div className={s['leftCtn']}>
          <div className={s['panelTitle']}>
            <span>{i18n.MODULE_NAME}</span>
          </div>
          <div className={s['body']}>
            <div className={s['importButton']}>
              <input type="file" onChange={this.importFile.bind(this)} />
              <DefaultButton text={i18n.SELECT_FILE} />
            </div>
          </div>
          <div className={s['footer']}>
            <div className={s['title']}>{i18n.FILE_INFO}</div>
            <div className={s['fileInfo']}>
              <div>
                <label>{i18n.FILE_NAME}</label>
                <span title={name}>{name}</span>
              </div>
              <div>
                <label>{i18n.FILE_SIZE}</label>
                <span>{size}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={s['rightCtn']}>
          <div className={s['buttonCtn']}>
            <DefaultButton
              text={i18n.CONFIGURATION}
              onClick={this.setIsConfig}
              primary={true}
            />
          </div>
          <div className={s['tableCtn']}>
            <div>
              <div className={s['tableHeader']}>
                <div>
                  <div className={s['singleTime']}>{i18n.TIME}</div>
                  <div
                    className={s['singleData']}
                    style={{
                      justifyContent: 'center'
                    }}
                  >
                    {i18n.DATA}
                  </div>
                </div>
                {!dataObj.data ? (
                  ''
                ) : (
                  <div>
                    <div className={s['singleTime']}>Time</div>
                    <div className={s['singleData']}>
                      {dataObj.data.map((v, i) => (
                        <div key={i} style={{ width: width }}>
                          {v.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className={s['tableBody']}>
                {!dataObj.data ? (
                  <div className={s['isNoneCtn']}>
                    {i18n.EXCEL_FILE_NOT_EXREAXT}
                  </div>
                ) : (
                  dataObj.time.map((row, index) => (
                    <div key={index}>
                      <div className={s['singleTime']}>{row}</div>
                      <div className={s['singleData']}>
                        {dataObj.data.map((v, i) => (
                          <div key={i} style={{ width: width }}>
                            {isConfig ? (
                              <input
                                value={
                                  this.state[v.name + '_' + index] ||
                                  this.state[v.name + '_' + index] === ''
                                    ? this.state[v.name + '_' + index]
                                    : v.value[index]
                                }
                                onChange={this.changeValue}
                                onBlur={this.updateData}
                                onKeyUp={this._onKeyUp.bind(this)}
                                name={v.name + '_' + index}
                              />
                            ) : (
                              v.value[index]
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  importFile(e) {
    var file = e.target.files[0];
    let newData = {
      file: {
        name: file.name,
        size: file.size
      },
      data: []
    };
    var formData = new FormData();
    formData.append('file', e.target.files[0]);
    apiFetch.readExcelFile(formData).subscribe(resp => {
      const { data } = this.props;
      if (resp.status === 'OK') {
        newData = Object.assign({}, data.options, {
          data: {
            data: resp.data.data,
            time: resp.data.time
          }
        });
        this.updataMpdule(newData);
      }
    });
    this.updataMpdule(newData);
  }
  setIsConfig() {
    this.setState({
      isConfig: this.state.isConfig ? false : true
    });
  }
  changeValue(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value
    });
  }
  updateData(e) {
    const { data } = this.props;
    let updateValue = Number(e.target.value);
    let name = e.target.name;
    let index = name.lastIndexOf('_');
    let updateIndex = Number(name.substr(index + 1, name.length));
    let updateName = name.substr(0, index);
    let realData;
    if (data.options.data && data.options.data.data) {
      let oldData = data.options.data.data;
      let newData = oldData.map(row => {
        if (updateName === row.name) {
          let newValues = row.value.map(
            (v, i) => (updateIndex === i ? updateValue : v)
          );
          row = Object.assign({}, row, {
            value: newValues
          });
        }
        return row;
      });
      let optionsData = Object.assign({}, data.options.data, {
        data: newData
      });
      let updateData = Object.assign({}, data.options, {
        data: optionsData
      });
      this.updataMpdule(updateData);
    }
  }
  _onKeyUp(ev) {
    if (ev.key == 'Enter') {
      this.updateData(ev);
    }
  }
  updataMpdule(newData) {
    const { data } = this.props;
    let url = ['options'];
    let propsData = data.setIn(url, newData);
    this.props.updateModule(propsData);
  }
}

/**
 * State
 *
 * 图形添加的总行数
 * terms: [{
 *  type: 1, // 图形类型
 *  points:[19, 20], // 点位x轴, 默认两个
 *  _id:  // 唯一辨识 id
 *  showInput: 'none', // 图形改变显示多个 x 轴, 默认 none 显示两个
 *  name: 'untitled' // 图形名称, 默认未命名
 *  }]
 * termsData 图形每添加一行的数据
 * selItem: 弹出模态框当前点击的行
 * code: 参数代码
 * min: 最小值
 * max: 最大值
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import {
  fuzzyRuleShapeTypes,
  fuzzyRuleShapeTypeNames
} from '../../../common/enum.js';
import CodeView from '../../../components/CodeView';
import UnknownTooltip from '../../../components/UnknownTooltip';
import FuzzyRuleChartView from '../../../components/FuzzyRuleChartView';

import s from './FuzzyRulesModalView.css';
import { arch } from 'os';

let _options = [
  {
    key: 'TRIANGLE',
    text: fuzzyRuleShapeTypeNames[fuzzyRuleShapeTypes['TRIANGLE']]
  },
  {
    key: 'RECTANGLE',
    text: fuzzyRuleShapeTypeNames[fuzzyRuleShapeTypes['RECTANGLE']]
  },
  {
    key: 'TRAPEZOID',
    text: fuzzyRuleShapeTypeNames[fuzzyRuleShapeTypes['TRAPEZOID']]
  },
  {
    key: 'GAUSSIAN',
    text: fuzzyRuleShapeTypeNames[fuzzyRuleShapeTypes['GAUSSIAN']]
  },
  {
    key: 'ZSHAPE',
    text: fuzzyRuleShapeTypeNames[fuzzyRuleShapeTypes['ZSHAPE']]
  },
  {
    key: 'SSHAPE',
    text: fuzzyRuleShapeTypeNames[fuzzyRuleShapeTypes['SSHAPE']]
  }
];
class FuzzyRulesModalView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formula: 'μ(x) = ?',
      min: 0,
      max: 100,
      changeValue: 0,
      progress: 0,
      selectedItem: null
    };
    this.selItem = [];
    this._sliderValueChange = this._sliderValueChange.bind(this);
    this._getCompleteParameters = this._getCompleteParameters.bind(this);
    this._graphTransformation = this._graphTransformation.bind(this);
    this._createFormula = this._createFormula.bind(this);
    this._changeProgress = this._changeProgress.bind(this);
    this._addRow = this._addRow.bind(this);
    this._inputValueChanged = this._inputValueChanged.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    const { selItem = [], params = [], index = 0 } = nextProps;
    const { terms, min, max } = params[index];
    if (selItem.length > 0) {
      const { name, status } = selItem[0];
      this.code = `InputVariable: ${name} /n  enabled: ${
        status == 0 ? false : true
      }/n  range: ${min ? min : 0.0} ${max ? max : 100.0} /n`;
      terms.forEach(v => {
        this.code += `  term: ${v.name} ${fuzzyRuleShapeTypeNames[v.type] ||
          'Triangle'} ${v.points[0] !== undefined ? v.points[0] : ''} ${
          v.points[1] !== undefined ? v.points[1] : ''
        } ${v.points[2] !== undefined ? v.points[2] : ''} ${
          v.points[3] !== undefined ? v.points[3] : ''
        }  /n`;
      });
      let newTerms = terms.map(row => {
        let newPoints = row.points.map(v => Number(v));
        return Object.assign({}, row, { points: newPoints });
      });
      this.selItem = Object.assign({}, selItem[0], {
        terms: newTerms
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { selItem = [], params = [], index = 0 } = nextProps;
    const { min = 0, max = 100 } = params[index] || selItem[0];
    this.setState({
      min,
      max
    });
  }
  render() {
    const { changeValue, formula, selectedItem } = this.state;
    const { params = [], index = 0, selItem = [], i18n } = this.props;
    const { terms = [], pos = [0, 0], min = 0, max = 100 } =
      params[index] || selItem[0];
    return (
      <div className={s['container']}>
        <div className={s['modal-body']}>
          <div className={s['modal-chart-view'] + ' clear-both'}>
            <div className={s['chart-label']}>
              <label>{i18n.VIEW} </label>
              <div className={s['slider-formula']} title={formula}>
                <div>{formula}</div>
              </div>
            </div>
            <div className={s['chart-container'] + ' clear-both'}>
              <div className={s['chart-view']}>
                <FuzzyRuleChartView
                  terms={terms}
                  pos={pos}
                  min={min}
                  max={max}
                />
              </div>
              <div className={s['slider-bar']}>
                <Slider
                  step={0.001}
                  min={min}
                  max={max}
                  value={changeValue}
                  showValue={false}
                  onChange={this._sliderValueChange}
                />
              </div>
              <div className={s['slider-input'] + ' clear-both'}>
                <div>
                  <label>{i18n.MIN}</label>
                  <input
                    value={this.state.min}
                    onChange={this._setSliderValue.bind(this, 'min')}
                    onBlur={this._sliderBlur.bind(this, 'min')}
                    onKeyUp={this._sliderKeyUp.bind(this, 'min')}
                  />
                </div>
                <div>
                  <label>{i18n.CURRENT}</label>
                  <input
                    value={changeValue}
                    onChange={this._setSliderValue.bind(this, 'changeValue')}
                    onBlur={this._sliderBlur.bind(this, 'changeValue')}
                    onKeyUp={this._sliderKeyUp.bind(this, 'changeValue')}
                  />
                </div>
                <div>
                  <label>{i18n.MAX}</label>
                  <input
                    value={this.state.max}
                    onChange={this._setSliderValue.bind(this, 'max')}
                    onBlur={this._sliderBlur.bind(this, 'max')}
                    onKeyUp={this._sliderKeyUp.bind(this, 'max')}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={s['settingsInput'] + ' clear-both'}>
            <div className={s['row-label']}>
              <label>{i18n.SETTINGS}</label>
              <span />
            </div>
            <div className={s['row-container']}>
              {terms.map((value, index) => {
                return (
                  <div className={s['row'] + ' clear-both'} key={index}>
                    <div className={s['rowHeader']}>
                      <label>
                        term <UnknownTooltip content={i18n.ANNOTATION_TERM} />
                      </label>
                      <span onClick={this._deleteRow.bind(this, index)}>
                        <i
                          className="ms-Icon ms-Icon--Cancel"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className={s['name'] + ' clear-both'}>
                      <input
                        type="text"
                        value={value.name}
                        placeholder={i18n.NAME}
                        className={s['row-cell']}
                        onChange={this._inputValueChanged.bind(
                          this,
                          'name',
                          index
                        )}
                        onKeyUp={this._inputKeyUp.bind(this, 'name', index)}
                      />
                      <Dropdown
                        className={s['Dropdown']}
                        onChanged={drop => {
                          this._dropselectChange(drop, index);
                        }}
                        options={_options}
                        selectedKey={
                          value.type ? _options[value.type].key : 'TRIANGLE'
                        }
                      />
                    </div>
                    <div className={s['type'] + ' clear-both'}>
                      <input
                        value={value.points[0] || ''}
                        placeholder="x1"
                        className={s['row-cell']}
                        onChange={this._inputValueChanged.bind(
                          this,
                          'x1',
                          index
                        )}
                        onKeyUp={this._inputKeyUp.bind(this, 'x1', index)}
                      />
                      <input
                        value={value.points[1] || ''}
                        placeholder="x2"
                        className={s['row-cell']}
                        onChange={this._inputValueChanged.bind(
                          this,
                          'x2',
                          index
                        )}
                        onKeyUp={this._inputKeyUp.bind(this, 'x2', index)}
                      />
                      <input
                        value={value.points[2] || ''}
                        placeholder="x3"
                        className={s['row-cell']}
                        onChange={this._inputValueChanged.bind(
                          this,
                          'x3',
                          index
                        )}
                        onKeyUp={this._inputKeyUp.bind(this, 'x3', index)}
                        data-show={
                          _options[value.type].key === 'TRIANGLE' ||
                          _options[value.type].key === 'TRAPEZOID'
                            ? 'show'
                            : 'hide'
                        }
                      />
                      <input
                        value={value.points[3] || ''}
                        placeholder="x4"
                        className={s['row-cell']}
                        onChange={this._inputValueChanged.bind(
                          this,
                          'x4',
                          index
                        )}
                        onKeyUp={this._inputKeyUp.bind(this, 'x4', index)}
                        data-show={
                          _options[value.type].key === 'TRAPEZOID'
                            ? 'show'
                            : 'hide'
                        }
                      />
                    </div>
                  </div>
                );
              })}

              <div className={s['row']}>
                <div onClick={this._addRow} className={s['addRow']}>
                  <span className={s['addButton']}>
                    <i className="ms-Icon ms-Icon--Add" />
                  </span>
                  {i18n.ADD_TERM}
                </div>
              </div>
            </div>
          </div>
          <div className={s['show-params']}>
            <div className={s['row-label']}>
              <label>{i18n.PARAMETER_CODE}</label>
              <span />
            </div>
            <div className={s['codeView-container']}>
              <CodeView
                option={{
                  lint: {},
                  lineNumbers: false,
                  lineSeparator: '/n',
                  readOnly: 'nocursor'
                }}
                value={this.code}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  _onChange(field, value) {
    const { onChange = () => {}, params = [], index = 0 } = this.props;
    onChange('params', params.set(index, params[index].set(field, value)));
  }
  _getCompleteParameters(terms) {
    var arr = [];
    var data = terms.concat([]);
    if (data.length > 0) {
      data.forEach(function(row) {
        var isComplete = false;
        if (row.type === 0) {
          if (row.points.length === 3) {
            isComplete = true;
          }
        } else if (row.type === 1) {
          if (row.points.length === 2) {
            isComplete = true;
          }
        } else {
          if (row.points.length === 4) {
            isComplete = true;
          }
        }
        if (isComplete) {
          var allNumber = true;
          row.points.some(function(a, i) {
            if (isNaN(parseFloat(a))) {
              allNumber = false;
              return true;
            }
          });
          allNumber && arr.push(row);
        }
      });
    }
    return arr;
  }
  // input 框值改变
  _sliderValueChange(value) {
    if (value) {
      value = this._transformNumber(value);
    } else {
      value = 0;
    }
    let progressHeight = this._createFormula(value);
    this.setState({
      changeValue: value
    });
    this._onChange('pos', [value, progressHeight > 1 ? 1 : progressHeight]);
  }
  // 设置sliderbar 的最大值最小值和滑到的位置
  _setSliderValue(args, e) {
    this.setState({
      [args]: e.target.value
    });
  }
  _sliderBlur(args, e) {
    if (args === 'changeValue') {
      const newValue = e.target.value - 0;
      let progressHeight = this._createFormula(newValue);
      this._onChange('pos', [
        newValue,
        progressHeight > 1 ? 1 : progressHeight
      ]);
    } else {
      this._onChange(args, this.state[args] - 0);
    }
  }
  _sliderKeyUp(args, e) {
    if (e.key === 'Enter') {
      this._sliderBlur(args, e);
    }
  }
  _graphTransformation(value) {
    const { selItem = [], params = [], index = 0 } = this.props;
    const { terms = [] } = params[index] || selItem[0];
    var _this = this;
    var parameters = this._getCompleteParameters(terms);
    var tpl = 'μ(x) = ';
    var len = parameters.length - 1;
    var arr = [];
    parameters.forEach(function(row, i) {
      var item;
      if (row.type === 0) {
        arr.push(_this._triangle(row.points, value));
        item = _this._triangle(row.points, value) + '/' + row.name;
      } else if (row.type === 1) {
        arr.push(_this._rectangle(row.points, value));
        item = _this._rectangle(row.points, value) + '/' + row.name;
      } else if (row.type === 2) {
        arr.push(_this._trapezoid(row.points, value));
        item = _this._trapezoid(row.points, value) + '/' + row.name;
      }
      tpl += item;
      if (i < len) {
        tpl += ' + ';
      }
    });
    var newArr = arr.sort(function(a, b) {
      return a - b;
    });
    var maxValue = newArr[newArr.length - 1];
    var data = {
      maxValue: maxValue,
      tpl: tpl
    };
    this._onChange('formula', tpl);
    return data;
  }
  _createFormula(value) {
    var data = this._graphTransformation(value);
    this.setState({
      formula: data.tpl
    });
    return data.maxValue;
  }
  _changeProgress(value) {
    var value = value;
    if (value) {
      value = this._transformNumber(value);
    } else {
      value = 0;
    }
    var progressHeight = this._createFormula(value);
    this.setState({
      precision: [value, progressHeight > 1 ? 1 : progressHeight],
      progress: value
    });
  }
  _transformNumber(value) {
    var result;
    if (!value && value != 0) {
      return;
    }
    if (typeof value === 'string') {
      if (value === ('-' || '-0' || '-0.')) {
        result = 0;
      } else {
        result = value;
      }
    } else {
      result = value;
    }
    return parseFloat(result);
  }
  _triangle(data, value) {
    var result;
    var x = value;
    if (data[1] - data[0] === 0) {
      if (data[0] === value) {
        result = 1;
      } else if (data[0] < value) {
        result = 2;
      } else {
        result = -1;
      }
    } else {
      var linearOne = {
        k: 1 / (data[1] - data[0]),
        b: -data[0] * 1 / (data[1] - data[0])
      };
      result = parseFloat((linearOne.k * x + linearOne.b).toFixed(3));
    }
    if (isNaN(result)) {
      result = 0;
    }
    if (result > 1) {
      if (data[1] - data[2] === 0) {
        if (data[1] === value) {
          result = 1;
        } else {
          result = 0;
        }
      } else {
        var linearTwo = {
          k: 1 / (data[1] - data[2]),
          b: -data[2] * 1 / (data[1] - data[2])
        };
        result = parseFloat((linearTwo.k * x + linearTwo.b).toFixed(3));
      }
      if (result < 0) {
        return 0;
      } else {
        return result;
      }
    } else if (result < 0) {
      return 0;
    } else {
      return result;
    }
  }
  _rectangle(data, value) {
    var x = value;
    if (x >= data[0] && x <= data[1]) {
      return 1;
    } else {
      return 0;
    }
  }
  _trapezoid(data, value) {
    var result;
    var x = value;
    if (data[1] - data[0] === 0) {
      if (data[0] === value) {
        result = 1;
      } else if (data[0] < value) {
        result = 2;
      } else {
        result = -1;
      }
    } else {
      var linearOne = {
        k: 1 / (data[1] - data[0]),
        b: -data[0] * 1 / (data[1] - data[0])
      };
      result = parseFloat((linearOne.k * x + linearOne.b).toFixed(3));
    }
    if (isNaN(result)) {
      result = 0;
    }
    if (result > 1) {
      if (value >= data[1] && value <= data[2]) {
        return 1;
      } else {
        if (data[2] - data[3] === 0) {
          if (data[2] === value) {
            result = 1;
          } else {
            result = 0;
          }
        } else {
          var linearTwo = {
            k: 1 / (data[2] - data[3]),
            b: -data[3] * 1 / (data[2] - data[3])
          };
          result = parseFloat((linearTwo.k * x + linearTwo.b).toFixed(3));
        }
        if (result < 0) {
          return 0;
        } else if (result > 1) {
          return 1;
        } else {
          return result;
        }
      }
    } else if (result < 0) {
      return 0;
    } else {
      return result;
    }
  }
  /* 添加新的行 */
  _addRow(e) {
    const { selItem = [], params = [], index = 0 } = this.props;
    let { terms } = params[index] || selItem[0];
    terms = terms.concat([
      {
        name: '',
        points: [],
        type: 0
      }
    ]);
    this._onChange('terms', terms);
  }
  /* 删除一行 */
  _deleteRow(inx) {
    const { selItem = [], params = [], index = 0 } = this.props;
    const { terms } = params[index] || selItem[0];
    let currentTerms = [];
    terms.forEach((row, i) => {
      if (i !== inx) {
        currentTerms.push(row);
      }
    });
    this._onChange('terms', currentTerms);
  }
  /* input onChange 事件*/
  _inputValueChanged(name, inx, e) {
    const { selItem = [], params = [], index = 0 } = this.props;
    const { terms } = params[index] || selItem[0];
    let newValue = e.currentTarget.value;
    let termsData = terms.map((row, i) => {
      if (i === inx) {
        let points = [];
        row.points.forEach(row => {
          points.push(row);
        });
        switch (name) {
          case 'name':
            row = Object.assign({}, row, { name: newValue });
            break;
          case 'x1':
            points[0] = newValue;
            break;
          case 'x2':
            points[1] = newValue;
            break;
          case 'x3':
            points[2] = newValue;
            break;
          case 'x4':
            points[3] = newValue;
            break;
          default:
            break;
        }
        row = Object.assign({}, row, { points: points });
      }
      this._onChange('terms');
      return row;
    });
    this._onChange('terms', termsData);
  }
  _inputKeyUp(name, inx, e) {
    if (e.key === 'Enter') {
      this._inputValueChanged(name, inx, e);
      e.target.blur();
    }
  }
  /* 下拉选中改变 */
  _dropselectChange(drop, inx) {
    const { selItem = [], params = [], index = 0 } = this.props;
    const { terms } = params[index] || selItem[0];
    let droptType = drop.key;
    let newData = terms.map((row, i) => {
      if (i === inx) {
        return Object.assign({}, row, {
          type: fuzzyRuleShapeTypes[droptType]
        });
      }
      return row;
    });
    this.setState({
      selectedItem: {
        index: inx,
        value: drop
      }
    });
    this._onChange('terms', newData);
  }
}
FuzzyRulesModalView.propTypes = {};

export default FuzzyRulesModalView;
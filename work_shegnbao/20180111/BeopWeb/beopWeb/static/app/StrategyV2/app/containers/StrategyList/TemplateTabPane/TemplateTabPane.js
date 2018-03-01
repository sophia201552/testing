/**
 * 策略树
 * @author Carol
 */
import React from 'react';
import { connect } from 'react-redux';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { setCondition } from './../../../redux/epics/template.js';


import css from './TemplateTabPane.css';
class TemplateTabPane extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedName: undefined,
      gradeName: undefined,
      sourceName: undefined
    };
    this.checkedArr = [];
  }
  componentWillMount() {
    //TODO 获取数据 getTags
    let data = [
      'AHU',
      'PAU',
      'Pump',
      'Chiller',
      'CoolingTower',
      'CWP',
      'ChWP',
      'Temperature',
      'Supply',
      'Fan'
    ];
    this.setState({
      data
    });
    this.props.setCondition({
      source: '',
      grade: '',
      tags: [],
      key: ''
    });
  }
  render() {
    const {i18n} = this.props;
    const { data, selectedName, gradeName, sourceName } = this.state;
    const gradeNames = [
      {
        name: i18n.STRATEGY_TEMPLATE,
        idName: 'strategyTemplate'
      },
      {
        name: i18n.WIDGET_TEMPLATE,
        idName: 'widgetTemplates'
      }
    ];
    const sourceNames = [
      {
        name: i18n.MY,
        idName: 'owen'
      },
      {
        name: i18n.SHARE,
        idName: 'share'
      },
      {
        name: i18n.OFFICIAL,
        idName: 'official'
      }
    ];
    return (
      <div className={css['templateCtn']}>
        <div className={css['conditionCtn']}>
          <div className={css['gradeCtn']}>
            <Label className={css['title']}>{i18n.GRADE}</Label>
            <div className={css['checkBoxCtn']}>
              {gradeNames.map((row, index) => {
                return (
                  <div className={css['check_block_ctn']} key={index}>
                    <span>
                      <input
                        className={css['input_check']}
                        type="radio"
                        name="grade"
                        id={row.idName}
                        checked={gradeName === row.idName ? true : false}
                        onChange={this.changeGradeStatus.bind(this)}
                      />
                      <label htmlFor={row.idName} />
                    </span>
                    <label htmlFor={row.idName}>{row.name}</label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={css['sourceCtn']}>
            <Label className={css['title']}>{i18n.SOURCE}</Label>
            <div className={css['checkBoxCtn']}>
              {sourceNames.map((row, index) => {
                return (
                  <div className={css['check_block_ctn']} key={index}>
                    <span>
                      <input
                        className={css['input_check']}
                        type="radio"
                        name="source"
                        id={row.idName}
                        checked={sourceName === row.idName ? true : false}
                        onChange={this.changeSourceStatus.bind(this)}
                      />
                      <label htmlFor={row.idName} />
                    </span>
                    <label htmlFor={row.idName}>{row.name}</label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={css['tagCtn']}>
            <Label className={css['title']}>Tag</Label>
            <div className={css['templateNavCtn']}>
              <div className={css['itemData']}>
                {data.map((row, index) => {
                  let className =
                    selectedName && selectedName === row ? css['selected'] : '';
                  return (
                    <div
                      className={className}
                      key={index}
                      title={row}
                      onClick={this.clickItemData.bind(this, row)}
                    >
                      {row}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className={css['clearCondition']}>
          <DefaultButton
            text={i18n.CLEAR_FILTER_CONDITION}
            onClick={this.clearCondition.bind(this)}
          />
        </div>
      </div>
    );
  }
  clickItemData(name, e) {
    e.stopPropagation();
    this.setState({
      selectedName: name
    });
    this.props.setCondition({ tags: [name] });
  }
  changeGradeStatus(e) {
    e.stopPropagation();
    let checkedStatus = e.currentTarget.checked;
    let name = e.currentTarget.id;
    if (checkedStatus) {
      this.setState({
        gradeName: name
      });
      this.props.setCondition({ grade: name });
    }
  }
  changeSourceStatus(e) {
    e.stopPropagation();
    let checkedStatus = e.currentTarget.checked;
    let name = e.currentTarget.id;
    if (checkedStatus) {
      this.setState({
        sourceName: name
      });
      this.props.setCondition({ source: name });
    }
  }
  clearCondition() {
    this.props.setCondition({
      source: '',
      grade: '',
      tags: [],
      key: ''
    });
    this.setState({
      selectedName: undefined,
      gradeName: undefined,
      sourceName: undefined
    });
  }
}

var mapDispatchToProps = {
  setCondition
};

var mapStateToProps = function(state) {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplateTabPane);
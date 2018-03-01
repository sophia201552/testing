/**
 * Python 模块
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'codemirror/lib/codemirror.css';

import CodeView from '../../../components/CodeView';
import SearchTree from '../../../components/SearchTree';
import { Tabs, TabPane } from '../../../components/Tabs';
import { getAPIList } from '../../../redux/epics/painter.js';
import CustomSpinner from '../../../components/CustomSpinner';

import s from './PythonPanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

class PythonResult extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {}
  render() {
    const { moduleOutputData, i18n } = this.props;
    let rs =
      (moduleOutputData && moduleOutputData[0] && moduleOutputData[0].data) ||
      [];
    return (
      <div className={css('pythonResult', 'ms-slideRightIn20')}>
        <div className={css('item')}>
          <label>{i18n.CALCULATION_PEOCESS}: </label>
          <label>
            {rs['process'] && rs['process'].len
              ? rs[v].map((row, index) => (
                  <div>
                    <span>{row}</span>
                  </div>
                ))
              : i18n.NONE}
          </label>
        </div>
        <div className={css('item')}>
          <label>{i18n.CALCULATION_RESULTS}: </label>
          <label>{rs['result'] == undefined ? '' : rs['result']}</label>
        </div>
      </div>
    );
  }
}

class PythonPanel extends React.Component {
  constructor(props) {
    super(props);
    //tooltip相关
    this.tooltipTimer = undefined;
    this.tooltipId = undefined;
    this.state = {
      treeItems: [],
      expandedKeys: [],
      spinner: true,
      autoCompleteList: []
    };
    this._onDragStart = this._onDragStart.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onExpand = this._onExpand.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this._onMouseOuver = this._onMouseOuver.bind(this);
    this._onMouseOut = this._onMouseOut.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { getAPIList, APIList } = nextProps;
    let treeItems = [],
      parentsMap = {},
      spinner = true,
      autoCompleteList = [];
    if (APIList.length == 0) {
      getAPIList(I18n.type);
    } else {
      APIList.forEach((v, i) => {
        parentsMap[v.api_type] = parentsMap[v.api_type] || [];
        parentsMap[v.api_type].push(v);
        autoCompleteList.push({
          text: v.sample,
          displayText: v.name
        });
      });
      Object.keys(parentsMap).forEach((name, i) => {
        let parentId = i + 1;
        treeItems.push({
          id: parentId,
          name: name,
          parent: 0,
          isParent: 1,
          info: name
        });
        treeItems = treeItems.concat(
          parentsMap[name].map((child, index) => {
            return {
              id: `${parentId}_${child.add_id}_${index}`,
              name: `${child.name}`,
              parent: parentId,
              isParent: 0,
              info: child
            };
          })
        );
      });
      spinner = false;
    }

    this.setState({
      treeItems,
      spinner,
      autoCompleteList
    });
  }
  render() {
    const {
      data,
      moduleInputData,
      moduleOutputData,
      updateModule,
      i18n
    } = this.props;
    const { treeItems, expandedKeys, spinner, autoCompleteList } = this.state;
    return (
      <div className={css('pythonPanel', 'clear-both')}>
        <div className={css('left')}>
          <div className={css('top')}>
            <div className={css('title')}>{i18n.MODULE_NAME}</div>
            <div
              className={css('content')}
              onDrop={this._onDrop}
              onDragOver={ev => {
                ev.preventDefault();
              }}
            >
              <CodeView
                ref={'CodeView'}
                autoCompleteList={autoCompleteList}
                option={{}}
                value={data.options.content || ''}
                onBlur={this.onBlur}
              />
            </div>
          </div>
          <div className={css('bottom')}>
            <Tabs titleWidth={200}>
              <TabPane tab={i18n.RESULT} keyId="result">
                <PythonResult moduleOutputData={moduleOutputData} i18n={i18n} />
              </TabPane>
              <TabPane tab={i18n.COMMENT} keyId="comment" />
            </Tabs>
            <div className={css('runButton')} onClick={this.onRun}>
              <i className="ms-Icon ms-Icon--Running" />
              <span>{i18n.TEST}</span>
            </div>
          </div>
        </div>
        <div className={css('right', 'ms-slideLeftIn20')}>
          <Tabs>
            <TabPane tab="API" keyId="API">
              <div className={css('treeWrap')} ref="treeWrap">
                <SearchTree
                  items={treeItems}
                  expandedKeys={expandedKeys}
                  onExpand={this._onExpand}
                  folderIconOpen={
                    <i
                      className="ms-Icon ms-Icon--OpenFolderHorizontal"
                      aria-hidden="true"
                    />
                  }
                  folderIconClose={
                    <i
                      className="ms-Icon ms-Icon--OpenFolderHorizontal"
                      aria-hidden="true"
                    />
                  }
                  leafIcon={
                    <i
                      className="ms-Icon ms-Icon--Questionnaire"
                      aria-hidden="true"
                    />
                  }
                  draggable={true}
                  onDragStart={this._onDragStart}
                  onMouseOver={this._onMouseOuver}
                  onMouseOut={this._onMouseOut}
                />
                <div ref="tooltipWrap" className={css('tooltipWrap')} />
                <CustomSpinner visible={spinner} />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
  _onMouseOut(id, isParent, it, e) {
    this.tooltipId = undefined;
    this._onTooltipEnd();
  }
  _onMouseOuver(id, isParent, it, e) {
    let ev = Object.assign({}, e);
    if (it.id != this.tooltipId) {
      this.tooltipId = it.id;
      if (this.tooltipTimer) {
        clearTimeout(this.tooltipTimer);
      }
      this.tooltipTimer = setTimeout(() => {
        this.tooltipTimer = undefined;
        this._onTooltip(it.id, it.isParent, it, ev);
      }, 500);
    }
  }

  _onTooltip(id, isParent, it, e) {
    if (isParent) {
      return;
    }
    let $targetLi = $(e.target.closest('li')),
      $parent = $(this.refs.treeWrap),
      $tooltip = $(this.refs.tooltipWrap);
    let y = $targetLi.offset().top - $parent.offset().top + $parent.scrollTop();
    $tooltip.html(`<ul>
      <li> Name: ${it.name}</li>
      <li> Description: ${it.info.dis_cription}</li>
      <li> Example: ${it.info.sample}</li>
    </ul>`);
    let tooltipH = $tooltip.height(),
      targetLiH = $targetLi.height();
    //上方
    y = y - tooltipH - 12;
    //下方
    // y = y + targetLiH + 4;
    $tooltip
      .css({
        top: `${y}px`
      })
      .fadeIn();
  }
  _onTooltipEnd(id, isParent, it, e) {
    $(this.refs.tooltipWrap).fadeOut();
  }
  _onDragStart(it, ev) {
    let target = ev.target;

    let info = {};
    if (it.isParent == 0) {
      info.name = it.name;
      info.sample = it.info.sample;
    }

    ev.dataTransfer.setData('dragAPIInfo', JSON.stringify(info));
  }
  _onDrop(ev) {
    let infoAPI = ev.dataTransfer.getData('dragAPIInfo');
    let infoTAG = ev.dataTransfer.getData('dragTagInfo'),
      infoDs = ev.dataTransfer.getData('dragDsInfo');
    let code = '';
    if (infoAPI) {
      infoAPI = JSON.parse(infoAPI);
      code = infoAPI.sample;
    }
    if (infoTAG) {
      infoTAG = JSON.parse(infoTAG);
      code = infoTAG.id;
    }
    if (infoDs) {
      infoDs = JSON.parse(infoDs);
      code = infoDs.id;
    }
    this.refs.CodeView.setCursorValue(code);
  }
  _onExpand(expandedKeys) {
    this.setState({
      expandedKeys
    });
  }
  onBlur() {
    const { data } = this.props;
    let code = this.refs.CodeView.getValue();
    if(code!=data.options.content){
      this.onRun();
    }
  }
  onRun() {
    const { updateModule, data } = this.props;
    let code = this.refs.CodeView.getValue();
    updateModule(data.setIn(['options', 'content'], code));
  }
}
let mapDispatchToProps = {
  getAPIList
};

let mapStateToProps = function(state) {
  return {
    APIList: state.painter.APIList
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PythonPanel);
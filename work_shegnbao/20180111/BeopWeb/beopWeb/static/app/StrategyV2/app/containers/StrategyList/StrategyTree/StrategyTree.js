import React from 'react';
import { connect } from 'react-redux';

import { Tabs, TabPane } from '../../../components/Tabs';
import ElementsTabPane from '../ElementsTabPane';
import TemplateTabPane from '../TemplateTabPane';
import FilesTabPane from '../FilesTabPane';
import ConfigTabPane from '../ConfigTabPane';
import DataSourcePane from '../DataSourcePane';
import { getHelpInfo } from '../../../redux/epics/painter.js';
import HelpInfo from '../../../components/HelpInfo';
import { setLang } from '../../../components/I18n';
import TextToggle from '../../../components/TextToggle';

import s from './StrategyTree.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

//props
//width         宽度
//type          home||painter
//strategyId    策略id
class StrategyTree extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowHelps: false,
      isShowToolWrap: false,
      activeKey: undefined 
    };
    this.showConfigPanel = this.showConfigPanel.bind(this);
    this.resetState = this.resetState.bind(this);
  }
  render(props) {
    const {
      width = '100%',
      strategyId,
      changeTabId,
      selecteddTabId,
      i18n,
      strategyPanelFn,
      selectedItems,
      updateSelectedItems = () => {},
      helpInfo
    } = this.props;
    const { isShowHelps, isShowToolWrap , activeKey} = this.state;
    return (
      <div id="strategyTree" style={{ width, height: '100%' }}>
        <Tabs
          align="vertical"
          onChange={changeTabId}
          selecteddTabId={selecteddTabId}
          isShowhelpContainer={true}
          activeKey = {activeKey}
          resetStateFn = {{reset:this.resetState}}
        >
          <TabPane
            tab={i18n.CATALOG}
            keyId="catalog"
            iconClass={
              <svg className="icon" aria-hidden="true">
                <use xlinkHref={'#icon-mulu'} />
              </svg>
            }
            tools={[
              {
                name: i18n.TOOLS,
                title: i18n.OPTION,
                iconClass: (
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={'#icon-peizhi'} />
                  </svg>
                ),
                onClick: this._showTools.bind(this)
              }
            ]}
          >
            <div
              style={{
                width: '100%',
                height: isShowHelps ? 'calc(100% - 168px)' : '100%'
              }}
            >
              <FilesTabPane
                selectedItems = {selectedItems}
                strategyId={strategyId}
                strategyPanelFn={strategyPanelFn}
                changeStateFn = {{
                    edit: this.showConfigPanel,
                }}
              />
            </div>
            {isShowHelps ? (
              <div>
                <HelpInfo isShowHelps={isShowHelps} helpInfo={helpInfo} />
              </div>
            ) : null}
          </TabPane>
          <TabPane
            tab={strategyId ? i18n.ELEMENT : i18n.ATTRIBUTE}
            title={strategyId ? i18n.ELEMENT : i18n.ATTR}
            keyId="props"
            iconClass={
              strategyId ? (
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={'#icon-yuansu'} />
                </svg>
              ) : (
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={'#icon-peizhi'} />
                </svg>
              )
            }
            tools={[
              {
                name: i18n.TOOLS,
                title: i18n.OPTION,
                iconClass: (
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={'#icon-peizhi'} />
                  </svg>
                ),
                onClick: this._showTools.bind(this)
              }
            ]}
          >
            <div
              style={{
                width: '100%',
                height: isShowHelps ? 'calc(100% - 168px)' : '100%'
              }}
            >
              {strategyId ? (
                <ElementsTabPane isShowHelps={isShowHelps} />
              ) : (
                <ConfigTabPane
                  selectedItems={selectedItems}
                  updateSelectedItems={updateSelectedItems}
                />
              )}
            </div>
            {isShowHelps ? (
              <div>
                <HelpInfo isShowHelps={isShowHelps} helpInfo={helpInfo} />
              </div>
            ) : null}
          </TabPane>
          <TabPane
            tab={strategyId ? i18n.DATA : i18n.TEMPLATE}
            title={strategyId ? i18n.DATA : i18n.TEMP}
            keyId="modals"
            iconClass={
              <svg className="icon" aria-hidden="true">
                <use xlinkHref={'#icon-mokuai'} />
              </svg>
            }
            tools={[
              {
                name: i18n.TOOLS,
                title: i18n.OPTION,
                iconClass: (
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={'#icon-peizhi'} />
                  </svg>
                ),
                onClick: this._showTools.bind(this)
              }
            ]}
          >
            <div
              style={{
                width: '100%',
                height: isShowHelps ? 'calc(100% - 168px)' : '100%'
              }}
            >
              {strategyId ? <DataSourcePane /> : <TemplateTabPane />}
            </div>
            {isShowHelps ? (
              <div>
                <HelpInfo isShowHelps={isShowHelps} helpInfo={helpInfo} />
              </div>
            ) : null}
          </TabPane>
          {strategyId ? (
            <TabPane
              tab={i18n.ATTRIBUTE}
              title={i18n.ATTR}
              keyId="config"
              iconClass={
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={'#icon-peizhi1'} />
                </svg>
              }
              tools={[
                {
                  name: i18n.TOOLS,
                  title: i18n.OPTION,
                  iconClass: (
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref={'#icon-peizhi'} />
                    </svg>
                  ),
                  onClick: this._showTools.bind(this)
                }
              ]}
            >
              <div
                style={{
                  width: '100%',
                  height: isShowHelps ? 'calc(100% - 168px)' : '100%'
                }}
              >
                <ConfigTabPane
                  selectedItems={selectedItems}
                  updateSelectedItems={updateSelectedItems}
                />
              </div>
              {isShowHelps ? (
                <div>
                  <HelpInfo isShowHelps={isShowHelps} helpInfo={helpInfo} />
                </div>
              ) : null}
            </TabPane>
          ) : null}
        </Tabs>

        <ToolWrap
          showToolWrap={isShowToolWrap}
          i18n={i18n}
          onClick={this.toggleHelpWrap.bind(this)}
        />
      </div>
    );
  }
  _showTools() {
    this.setState({
      isShowToolWrap: !this.state.isShowToolWrap
    });
  }
  toggleHelpWrap() {
    this.setState({
      isShowHelps: !this.state.isShowHelps
      // isShowToolWrap: false
    });
  }

  showConfigPanel(){
      this.setState({
        activeKey: 'config'
      });
  }

  resetState(activeKey){
    this.setState({
        activeKey: activeKey
      });
  }
}

class ToolWrap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowselectLan: false
    };
    this._changeLanguage = this._changeLanguage.bind(this);
  }
  render() {
    const { showToolWrap, i18n } = this.props;
    const { isShowselectLan } = this.state;
    return (
      <div className={css(`toolWrap ${showToolWrap ? 'show' : ''}`)}>
        <div className={s['tool']}>
          <div className={s['toolIcon']}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={'#icon-ziranyuyanchuli'} />
            </svg>
          </div>
          <div className={s['toolName']}>
            <span>{i18n.LANGUAGE}</span>
          </div>
          <div className={s['toolToggle']}>
            <div className={s['language']}>
              <div onClick={this._selectedLanguage.bind(this)}>
                <span>
                  {localStorage.getItem('language') == 'en'
                    ? i18n.ENGLISH
                    : i18n.CHINESE}
                </span>
                <i
                  className={
                    'ms-Icon ms-Icon--ChevronDown ' + s['iconLanguage']
                  }
                />
              </div>
              {isShowselectLan && (
                <div className={s['selectLan']} onClick={this._changeLanguage}>
                  <span>
                    {localStorage.getItem('language') == 'en'
                      ? i18n.CHINESE
                      : i18n.ENGLISH}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={s['tool']}>
          <div className={s['toolIcon']}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={'#icon-bangzhu1'} />
            </svg>
          </div>
          <div className={s['toolName']}>
            <span>{i18n.GUIDE}</span>
          </div>
          <div className={s['toolToggle']}>
            <TextToggle
              offText="No"
              onText="Yes"
              onClick={ev => {
                const { onClick = () => {} } = this.props;
                onClick();
              }}
            />
          </div>
        </div>
        <div className={s['tool']}>
          <div className={s['toolIcon']}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={'#icon-tuichu'} />
            </svg>
          </div>
          <div className={s['toolName']}>
            <span>{i18n.EXIT}</span>
          </div>
          <div className={s['toolToggle']} />
        </div>
      </div>
    );
  }
  _changeLanguage() {
    appConfig.language = localStorage.getItem('language') == 'en' ? 'zh' : 'en';
    setLang(appConfig.language);
    location.reload(true);
  }
  _selectedLanguage() {
    this.setState({
      isShowselectLan: !this.state.isShowselectLan
    });
  }
}

const mapDispatchToProps = {
  getHelpInfo
};

const mapStateToProps = function(state) {
  return {
    helpInfo: state.painter.helpInfo
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StrategyTree);

/**
 * 首页
 * @author Peter
 */
import React from 'react';
import PropTypes from 'prop-types';

import StrategyTree from '../containers/StrategyList/StrategyTree';
import StrategyList from '../containers/StrategyList/StrategyList';
import StrategyTemplate from '../containers/StrategyList/StrategyTemplate';
import CreateStrategyModal from '../containers/modals/CreateStrategyModal/CreateStrategyModal';
import CreateStrategyPanel from '../containers/CreateStrategyPanel';
import NoStrategyPromptPanel from '../containers/panels/NoStrategyPromptPanel';

import s from './Home.css';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      TabId: 'catalog',
      selectedItems: []
    };
  }

  render() {
    const { TabId, selectedItems } = this.state;
    return (
      <div className={s['container']}>
        <div className={s['containerLeft']}>
          <StrategyTree
            changeTabId={this._changeTabId.bind(this)}
            selecteddTabId={TabId}
            selectedItems={selectedItems}
            updateSelectedItems={this._selectedItems.bind(this)}
          />
        </div>
        <div className={s['containerRight']}>
          {(TabId === 'catalog' || TabId === 'props') && (
            <StrategyList
              changeTabId={this._changeTabId.bind(this)}
              selectedItems={this._selectedItems.bind(this)}
            />
          )}
          {TabId === 'modals' && <StrategyTemplate />}
        </div>
      </div>
    );
  }
  _changeTabId(id) {
    this.setState({
      TabId: id
    });
  }
  _selectedItems(items) {
    this.setState({
      selectedItems: items
    });
  }
}

Home.propTypes = {};

export default Home;

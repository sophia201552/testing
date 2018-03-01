/**
 * Painter 页面
 * @author Peter
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import s from './Painter.css';
import StrategyTree from '../containers/StrategyList/StrategyTree';
import StrategyPanel from '../containers/StrategyPanel';

class Painter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: []
    };
    this._strategyPanelGetDiff = this._strategyPanelGetDiff.bind(this);
    this._updateSelectedItems = this._updateSelectedItems.bind(this);
    this._strategyPanelonSave = this._strategyPanelonSave.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { selectedItems } = this.state;
    const { match, strategyItem } = nextProps;
    if (
      selectedItems.length === 0 ||
      selectedItems[0] === undefined ||
      match.params.id !== this.props.match.params.id ||
      strategyItem.strategy._id !== selectedItems[0]._id
    ) {
      this.setState({
        selectedItems: [strategyItem.strategy]
      });
    }
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  render() {
    const { selectedItems } = this.state;
    const { match } = this.props;
    return (
      <div className={s['container']}>
        <div className={s['sidebar']}>
          <StrategyTree
            strategyId={match.params.id}
            strategyPanelFn={{
              onSave: this._strategyPanelonSave,
              getDiff: this._strategyPanelGetDiff
            }}
            selectedItems={selectedItems}
            updateSelectedItems={this._updateSelectedItems}
          />
        </div>
        <div className={s['content']}>
          <StrategyPanel
            ref="StrategyPanel"
            strategyId={match.params.id}
            selectedItems={selectedItems}
          />
        </div>
      </div>
    );
  }
  _strategyPanelonSave() {
    return this.refs.StrategyPanel.getWrappedInstance()
      .getWrappedInstance()
      ._onSave();
  }
  _strategyPanelGetDiff() {
    return this.refs.StrategyPanel.getWrappedInstance()
      .getWrappedInstance()
      .getDiff();
  }
  _updateSelectedItems(selectedItems) {
    this.setState({
      selectedItems
    });
  }
}

const mapDispatchToProps = {};

const mapStateToProps = function(state) {
  return {
    strategyItem: state.painter.strategyItem
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Painter);

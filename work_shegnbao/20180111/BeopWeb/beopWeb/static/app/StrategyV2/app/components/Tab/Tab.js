import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import s from './Tab.css';

class MoreWrap extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <input />
      </div>
    );
  }
}

export default class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.childIndex = undefined;
    this.state = {
      isShowMoreWrap: false,
      isShowMoreIcon: false
    };
  }
  getMenu() {
    const { panes, activePaneKey } = this.props;

    if (!panes || panes.length === 0) {
      return null;
    }

    return panes.map(row => (
      <a
        key={row.key}
        className={cx(
          {
            [s['active']]: row.key === activePaneKey
          },
          s['tab-menu-item']
        )}
        onClick={() => this.props.onTabChange(row.key)}
      >
        <span>
          <Icon iconName="Cancel" className={s['menu-item-icon']} />
        </span>
        <span>{row.title}</span>
      </a>
    ));
  }
  getPane() {
    const { panes, activePaneKey } = this.props;
    const pane = panes.find(row => row.key === activePaneKey);

    if (!pane) {
      return null;
    }
    return pane.content;
  }
  getMoreMenu() {
    const { panes, activePaneKey } = this.props;
    if (this.childIndex == undefined) {
      return null;
    }
    return panes.slice(this.childIndex).map(row => {
      return (
        <a
          key={row.key}
          className={s['more-menu-item']}
          onClick={ev => {
            this.setState({
              isShowMoreWrap: false
            });
            this.props.onTabChange(row.key);
          }}
        >
          {row.key === activePaneKey ? (
            <Icon iconName="Accept" className={s['more-item-icon']} />
          ) : null}
          <span>{row.title}</span>
        </a>
      );
    });
  }
  componentWillUpdate(nextProps, nextState) {
    const { panes } = nextProps;
    if (
      panes.length - this.props.panes.length < 0 &&
      panes.slice(this.childIndex).length == 0
    ) {
      this.setState({
        isShowMoreIcon: false
      });
    }
  }
  componentDidUpdate(prevProps) {
    const { panes, activePaneKey } = this.props;
    const $container = $('#__menuCtn'),
      len = panes.slice(this.childIndex).length,
      gap = panes.length - prevProps.panes.length;
    if (gap > 0) {
      const layoutWidth = $('#tabCtn').width();
      let childWidth = 0,
        sumWidth = 0,
        childIndex = undefined;
      $container.children().each(function(index, value) {
        sumWidth += $(value).innerWidth();
        if (sumWidth > layoutWidth) {
          childWidth = $(value).innerWidth();
          childIndex = index;
          return false;
        }
      });
      if (childIndex !== undefined) {
        this.setState({
          isShowMoreIcon: true
        });
        $container.find(`a:gt(${childIndex - 1})`).hide();
        if (this.childIndex == undefined || this.childIndex !== childIndex) {
          this.childIndex = childIndex;
        }
      }
    } else if (gap < 0) {
      if (len === 0) {
        $container.find('a').show();
      } else {
        $container.find(`a:lt(${this.childIndex - 1 + gap + len})`).show();
      }
    } else if (gap == 0 && len == 0) {
      $container.find(`a:lt(${this.childIndex})`).show();
    }
  }
  render() {
    const { isShowMoreWrap, isShowMoreIcon } = this.state;
    return (
      <div className={cx(s['tab-container'], this.props.className)}>
        <div id="tabCtn" key="menu" className={s['tab-menu']}>
          <div
            id="__menuCtn"
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap'
            }}
          >
            {this.getMenu()}
          </div>
          {isShowMoreIcon ? (
            <div className={s['more']} onClick={this._showMore.bind(this)}>
              <div
                className={s['moreWrap']}
                style={{
                  display: isShowMoreWrap ? 'block' : 'none'
                }}
              >
                {this.getMoreMenu()}
              </div>
              <input
                onBlur={() => {
                  setTimeout(() => {
                    this.setState({ isShowMoreWrap: false });
                  }, 250);
                }}
              />
              <i className="ms-Icon ms-Icon--DoubleChevronLeftMedMirrored" />
            </div>
          ) : null}
        </div>
        <div key="pane" className={s['tab-pane']}>
          {this.getPane()}
        </div>
      </div>
    );
  }
  _showMore() {
    this.setState({
      isShowMoreWrap: !this.state.isShowMoreWrap
    });
  }
}

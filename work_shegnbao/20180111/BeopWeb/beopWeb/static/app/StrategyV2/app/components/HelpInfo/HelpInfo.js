import React from 'react';

import css from './HelpInfo.css';

export default class HelpInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { isShowHelps = false, helpInfo = [] } = this.props;
    return (
      <div>
        {isShowHelps ? (
          <div className={css['helpInfo']}>
            <div className={css['module-name']}>{helpInfo[0] || ''}</div>
            <div className={css['module-desc']}>{helpInfo[0] || ''}</div>
          </div>
        ) : null}
      </div>
    );
  }
}


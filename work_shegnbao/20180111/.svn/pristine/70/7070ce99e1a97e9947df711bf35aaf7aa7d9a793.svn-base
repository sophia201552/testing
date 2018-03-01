import {
  TooltipHost,
  TooltipOverflowMode
} from 'office-ui-fabric-react/lib/Tooltip';
import React from 'react';
import PropTypes from 'prop-types';

import s from './UnknownTooltip.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
class UnknownTooltip extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { content = '' } = this.props;
    return (
      <TooltipHost
        content={content}
        id={`myToolTip`}
        calloutProps={{
          gapSpace: 0,
          directionalHint: 12,
          className: css('toolTipWrap')
        }}
      >
        <div aria-describedby="myToolTip" className={css('toolTipIcon')}>
          <i className="ms-Icon ms-Icon--Unknown" />
        </div>
      </TooltipHost>
    );
  }
}
export default UnknownTooltip;

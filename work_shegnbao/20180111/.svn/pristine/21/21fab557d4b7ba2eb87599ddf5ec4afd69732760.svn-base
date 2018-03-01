/**
 * 测试评估
 */
import React from 'react';
import PropTypes from 'prop-types';

import EvaluateSlider from './EvaluateSlider';
import EvaluateDetails from './EvaluateDetails';

const containerStyle = {
  height: '100%'
};
class EvaluatePanel extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {}
  render() {
    const {
      data,
      moduleInputData,
      moduleOutputData,
      updateModule,
      i18n
    } = this.props;
    return (
      <div style={containerStyle}>
        <EvaluateSlider
          data={data}
          moduleInputData={moduleInputData}
          moduleOutputData={moduleOutputData}
          updateModule={updateModule}
          i18n={i18n}
        />
        <EvaluateDetails
          data={data}
          moduleInputData={moduleInputData}
          moduleOutputData={moduleOutputData}
          updateModule={updateModule}
          i18n={i18n}
        />
      </div>
    );
  }
}

EvaluatePanel.propTypes = {};

export default EvaluatePanel;

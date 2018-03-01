import React from 'react';
import PropTypes from 'prop-types';
import zh from './I18n-zh.js';
import en from './I18n-en.js';
const MESSAGES = { en, zh };
const LOCALE = appConfig.language;

export default Component => {
  return class NewComponent extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {};
    }
    get(key) {
      let msg = MESSAGES[LOCALE];
      if (msg == null) {
        return key || MESSAGES.zh;
      }
      return msg;
    }
    render() {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <Component {...this.props} I18n={this.get()} />
        </div>
      );
    }
  };
};
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { linkTo } from '../../';
import s from './PanelHeader.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
class PanelHeader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleBack = this.handleBack.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }
  handleBack() {
    const { onBack } = this.props;
    onBack();
  }
  handleSave() {
    const { onSave } = this.props;
    onSave();
  }
  handleExport() {
    const { showExportModal } = this.props;
    showExportModal();
  }
  render() {
    const { title, i18n } = this.props;
    return (
      <header className={s['container']}>
        <div className={s['title']}>
          <button
            className={css('btn-back')}
            title={i18n.CLICK_BACK}
            onClick={this.handleBack}
          >
            <span className={s['backIcon']}>
              <i
                className="ms-Icon ms-Icon--ChevronLeftMed"
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
        <div className={s['titleText']}>
          <span>{title}</span>
        </div>
        <div className={s['toolbox']}>
          <div className={s['exportBtn']} onClick={this.handleExport}>
            <span>{i18n.EXPORT}</span>
          </div>
          <div className={s['saveBtn']} onClick={this.handleSave}>
            <span>{i18n.SAVE}</span>
          </div>
        </div>
      </header>
    );
  }
}

export default PanelHeader;

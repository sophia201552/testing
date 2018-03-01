/**
 * 离群点去除
 * 
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';


import s from './OutlierRemovingPanel.css';

class OutlierRemovingPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={s['outlierRemovingWrap']}>
        <div className={s['slider']}>
          <div className={s['configWrap']}>
            <h3>参数配置</h3>
            <div>
              <div className={s['checkboxleft']}>
                <div className={s['checkboxWrap']}>
                  <Checkbox className={s['checkbox']} label="3σ" />
                </div>
              </div>
            </div>
            <div>
              <div className={s['checkboxleft']}>
                <div className={s['checkboxWrap']}>
                  <Checkbox className={s['checkbox']} label="上下限" />
                </div>
              </div>
              <div className={s['inputWrap']}>
                <div className={s['labelInput']}>
                  <label>Min:</label>
                  <input />
                </div>
              </div>
            </div>
            <div>
              <div className={s['inputWrap']}>
                <div className={s['labelInput']}>
                  <label>Max:</label>
                  <input />
                </div>
              </div>
            </div>
            <div>
              <div className={s['checkboxleft']}>
                <div className={s['checkboxWrap']}>
                  <Checkbox className={s['checkbox']} label="分位点" />
                </div>
              </div>
              <div className={s['inputWrap']}>
                <div className={s['labelInput']}>
                  <label>上四分位:</label>
                  <input />
                </div>
              </div>
            </div>
            <div>
              <div className={s['inputWrap']}>
                <div className={s['labelInput']}>
                  <label>下四分位:</label>
                  <input />
                </div>
              </div>
            </div>
            <div>
              <div className={s['inputWrap']}>
                <div className={s['labelInput']}>
                  <label>中位点:</label>
                  <input />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={s['chart']}>
          <div />
        </div>
      </div>
    );
  }
}

OutlierRemovingPanel.propTypes = {};

export default OutlierRemovingPanel;

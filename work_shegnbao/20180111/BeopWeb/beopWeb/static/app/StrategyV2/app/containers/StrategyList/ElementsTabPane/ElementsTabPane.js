/**
 * 模块详情及默认值
 */
import React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';

import {
  moduleTypes,
  moduleTypeNames
} from '@beopcloud/StrategyV2-Engine/src/enum';
import { getHelpInfo } from '../../../redux/epics/painter.js';
import moduleIconConfig from '../../../common/moduleIconConfig.js';
import { List, ListItem } from '../../../components/List';
import ObjectId from '../../../common/objectId.js';
import en from './en.js';
import zh from './zh.js';
import { I18N, getI18n } from '../../../components/I18n';
import css from './ElementsTabPane.css';
const i18n = getI18n({ en, zh });
let shouldClearTimeOut = undefined;

const historyGroupId = ObjectId();
const historyTimeConfig = (() => {
  let now = +new Date(),
    yestady = now - 24 * 60 * 60 * 1000;
  let timeEnd = moment.default(now).format('YYYY-MM-DD HH:mm:00'),
    timeStart = moment.default(yestady).format('YYYY-MM-DD HH:mm:00');
  return {
    timeStart,
    timeEnd,
    timeFormat: 'm5'
  };
})();

class ElementsTabPane extends React.Component {
  static getList() {
    return [
      {
        keyId: 'a',
        color: 'rgb(92,104,238)',
        title: i18n.DATA_ACCESS,
        data: [
          {
            name: moduleTypeNames[moduleTypes['CON_DATASOURCE']],
            type: moduleTypes['CON_DATASOURCE'],
            iconName: moduleIconConfig[moduleTypes['CON_DATASOURCE']],
            option: {
              type: 'history',
              timeConfig: historyTimeConfig,
              completing: 1,
              params: [
                {
                  projName: '',
                  name: 'default',
                  description: i18n.NO_DESCRIPTION,
                  sample: '',
                  tags: []
                }
              ],
              activedGroup: historyGroupId,
              groups: [
                {
                  _id: historyGroupId,
                  name: 'Default',
                  data: {
                    Default: ''
                  },
                  entityId: null
                }
              ]
            }
          },
          {
            name: moduleTypeNames[moduleTypes['CON_FILE_EXCEL']],
            type: moduleTypes['CON_FILE_EXCEL'],
            iconName: moduleIconConfig[moduleTypes['CON_FILE_EXCEL']],
            option: {}
          }
        ]
      },
      {
        keyId: 'b',
        color: 'rgb(238,167,49)',
        title: i18n.DATA_PROCESSING,
        data: [
          {
            name: moduleTypeNames[moduleTypes['PRE_TRANS_FUZZY']],
            type: moduleTypes['PRE_TRANS_FUZZY'],
            iconName: moduleIconConfig[moduleTypes['PRE_TRANS_FUZZY']],
            option: {
              params: []
            }
          },
          {
            name: moduleTypeNames[moduleTypes['PRE_DATA_DEDUPLICATION']],
            type: moduleTypes['PRE_DATA_DEDUPLICATION'],
            iconName: moduleIconConfig[moduleTypes['PRE_DATA_DEDUPLICATION']],
            option: {
              methods: {
                type: 'SIMPLE',
                toleranceLimits: 10
              }
            }
          },
          {
            name: moduleTypeNames[moduleTypes['PRE_DATA_COMPLEMENT']],
            type: moduleTypes['PRE_DATA_COMPLEMENT'],
            iconName: moduleIconConfig[moduleTypes['PRE_DATA_COMPLEMENT']],
            option: {
              methods: {
                type: 'LINEAR_INSERT'
              },
              options: {
                maxPaddingInterval: 10
              }
            }
          },
          {
            name: moduleTypeNames[moduleTypes['PRE_DATA_NORMALIZATION']],
            type: moduleTypes['PRE_DATA_NORMALIZATION'],
            iconName: moduleIconConfig[moduleTypes['PRE_DATA_NORMALIZATION']],
            option: {
              methods: [
                {
                  type: '0-1'
                }
              ],
              options: {}
            }
          },
          {
            name: moduleTypeNames[moduleTypes['EXEC_OUTLIER_DETECTION']],
            type: moduleTypes['EXEC_OUTLIER_DETECTION'],
            iconName: moduleIconConfig[moduleTypes['EXEC_OUTLIER_DETECTION']],
            option: {
              data: [],
              time: [],
              methods: [
                {
                  type: 'RANGE',
                  thresh: 5,
                  meassure: 'abs'
                }
              ],
              options: {
                shouldRemoveOutliers: 0
              }
            }
          },
          {
            name: moduleTypeNames[moduleTypes['PRE_DATA_MONITORING']],
            type: moduleTypes['PRE_DATA_MONITORING'],
            iconName: moduleIconConfig[moduleTypes['PRE_DATA_MONITORING']],
            option: {
              timeConfig: historyTimeConfig,
              columnSelectedKeys: [
                'sitePointName',
                'realtimeValue',
                'pointAnnotation',
                'unit',
                'max',
                'min',
                'continues',
                'condition'
              ],
              ruleItems: [
                {
                  id: ObjectId(''),
                  rule: '{pre}_{prop}',
                  rules: [
                    {
                      key: 'pre',
                      value: ''
                    }
                  ],
                  rows: []
                }
              ],
              isItemChanged: false
            }
          },
          {
            name: moduleTypeNames[moduleTypes['PCA']],
            type: moduleTypes['PCA'],
            iconName: moduleIconConfig[moduleTypes['PCA']],
            option: {
              data: [],
              time: [],
              methods: [
                {
                  type: 'PCA',
                  n_comp: 1,
                  explain_ratio: 0.9
                }
              ],
              options: {}
            }
          },
          {
            name: moduleTypeNames[moduleTypes['FEATURE_SELECTION']],
            type: moduleTypes['FEATURE_SELECTION'],
            iconName: moduleIconConfig[moduleTypes['FEATURE_SELECTION']],
            option: {
              methods: [
                {
                  type: 'VARIANCE',
                  thresh: 0
                },
                {
                  type: 'KBEST',
                  k: 3,
                  y: 'y1',
                  score_func: 'f_classif'
                },
                {
                  type: 'PERCENTILEBEST',
                  percentile: 10,
                  y: 'y1',
                  score_func: 'f_classif'
                }
              ],
              options: {
                selectedTypes: ['VARIANCE', 'KBEST', 'PERCENTILEBEST']
              }
            }
          },
          {
            name: moduleTypeNames[moduleTypes['PRE_DATA_SORTING']],
            type: moduleTypes['PRE_DATA_SORTING'],
            iconName: moduleIconConfig[moduleTypes['PRE_DATA_SORTING']],
            option: {
              source: {}
            }
          },
          {
            name: moduleTypeNames[moduleTypes['PRE_DATA_EXPORT']],
            type: moduleTypes['PRE_DATA_EXPORT'],
            iconName: moduleIconConfig[moduleTypes['PRE_DATA_EXPORT']],
            option: {
              source: {}
            }
          }
        ]
      },

      {
        keyId: 'c',
        color: 'rgb(151,67,217)',
        title: i18n.METHODOLOGY,
        data: [
          {
            name: moduleTypeNames[moduleTypes['FUNC_LOGIC_BOOLEAN']],
            type: moduleTypes['FUNC_LOGIC_BOOLEAN'],
            iconName: moduleIconConfig[moduleTypes['FUNC_LOGIC_BOOLEAN']],
            option: {
              rule: '',
              ruleBlock: []
            }
          }
        ]
      },
      {
        keyId: 'd',
        color: 'rgb(43,193,191)',
        title: i18n.DATA_VISUALIZATION,
        data: [
          {
            name: moduleTypeNames[moduleTypes['VSL_CHART']],
            type: moduleTypes['VSL_CHART'],
            iconName: moduleIconConfig[moduleTypes['VSL_CHART']],
            option: {
              methods: {
                type: 'line'
              }
            }
          }
        ]
      },
      {
        keyId: 'e',
        color: 'rgb(0,167,207)',
        title: i18n.DATA_OUTPUT,
        data: [
          {
            name: moduleTypeNames[moduleTypes['OP_DIAGNOSIS_ITEM']],
            type: moduleTypes['OP_DIAGNOSIS_ITEM'],
            iconName: moduleIconConfig[moduleTypes['OP_DIAGNOSIS_ITEM']],
            option: {
              params: []
            }
          }

          // {
          //   name: moduleTypeNames[moduleTypes['OP_DATASOURCE']],
          //   type: moduleTypes['OP_DATASOURCE'],
          //   iconName: 'dian'
          // }
        ]
      },
      {
        keyId: 'f',
        color: 'rgb(189,67,134)',
        title: i18n.UTILITY,
        data: [
          {
            name: moduleTypeNames[moduleTypes['EXEC_PYTHON']],
            type: moduleTypes['EXEC_PYTHON'],
            iconName: moduleIconConfig[moduleTypes['EXEC_PYTHON']],
            option: {
              content: ''
            }
          },
          {
            name: moduleTypeNames[moduleTypes['EXEC_ANLS_CORRELATION']],
            type: moduleTypes['EXEC_ANLS_CORRELATION'],
            iconName: moduleIconConfig[moduleTypes['EXEC_ANLS_CORRELATION']],
            option: {
              dataset: {
                mode: 'datasource',
                options: {
                  startTime: '',
                  endTime: '',
                  data: []
                }
              },
              model: 'SVM'
            }
          },
          {
            name: moduleTypeNames[moduleTypes['EXEC_TEST']],
            type: moduleTypes['EXEC_TEST'],
            iconName: moduleIconConfig[moduleTypes['EXEC_TEST']],
            option: {
              dataset: {
                mode: 'datasource',
                options: {
                  time: '',
                  data: []
                }
              },
              methods: [
                {
                  type: '逻辑判断',
                  enable: 1,
                  options: {}
                }
              ]
            }
          },
          {
            name: moduleTypeNames[moduleTypes['EXEC_ANLS_PREDICTION']],
            type: moduleTypes['EXEC_ANLS_PREDICTION'],
            iconName: moduleIconConfig[moduleTypes['EXEC_ANLS_PREDICTION']],
            option: {
              dataset: {
                mode: 'datasource',
                options: {
                  startTime: '',
                  endTime: '',
                  timeFormat: '',
                  data: []
                }
              },
              methods: ['SVM']
            }
          },
          {
            name: moduleTypeNames[moduleTypes['CLT_DB_SCAN']],
            type: moduleTypes['CLT_DB_SCAN'],
            iconName: moduleIconConfig[moduleTypes['CLT_DB_SCAN']],
            option: {
              data: [],
              time: [],
              methods: [
                {
                  type: 'DB-SCAN',
                  eps: 1.5,
                  min_samples: 12
                }
              ]
            }
          },
          {
            name: moduleTypeNames[moduleTypes['PRE_DATA_EVALUATE']],
            type: moduleTypes['PRE_DATA_EVALUATE'],
            iconName: moduleIconConfig[moduleTypes['PRE_DATA_EVALUATE']],
            option: { selectedMethods: [], timeConfig: historyTimeConfig }
          }
        ]
      },
      {
        keyId: 'g',
        color: 'rgb(252, 128, 128)',
        title: i18n.FORECAST,
        data: [
          {
            name: moduleTypeNames[moduleTypes['PDT_SVM']],
            type: moduleTypes['PDT_SVM'],
            iconName: moduleIconConfig[moduleTypes['PDT_SVM']],
            option: {
              name: '',
              svmType: {
                type: 'PDT_SVM',
                cost: 1,
                epsilon: 1
              },
              kernel: {
                type: 'rbf'
              },
              options: {
                cvSplitRatio: 0.2,
                independenVariables: [],
                dependenVariables: []
              }
            }
          }
        ]
      }
    ];
  }
  constructor(props) {
    super(props);
    this._onChnageList = this._onChnageList.bind(this);
    this.listItem = ElementsTabPane.getList();
  }
  componentDidMount() {}
  render() {
    let defaultSelectedKeys =
      window.localStorage.getItem(`${appConfig.user.id}_openElementsGroup`) ||
      `["b"]`;
    defaultSelectedKeys = JSON.parse(defaultSelectedKeys);
    return (
      <div className={css['wrap'] + ' ms-slideRightIn20'}>
        <List
          defaultSelectedKeys={defaultSelectedKeys}
          onChange={this._onChnageList}
        >
          {this.listItem.map((v, index) => (
            <ListItem
              key={index}
              keyId={v.keyId}
              title={v.title}
              color={v.color}
            >
              {this._createDragEl(v.data)}
            </ListItem>
          ))}
        </List>
      </div>
    );
  }

  _createDragEl(data) {
    return (
      <div className={css['templateWrap']}>
        {data.map((v, i) => (
          <div
            key={i}
            data-type={v.type}
            className={css['iconTitle']}
            draggable
            onDragStart={this._onDragStart.bind(this, v)}
            title={v.name}
            onMouseEnter={this._onEnter.bind(this, v)}
            onMouseLeave={this._onLeave.bind(this, v)}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={'#icon-' + v.iconName} />
            </svg>
            <div className={css['iconName']}>{v.name}</div>
          </div>
        ))}
      </div>
    );
  }
  _onEnter(info) {
    const { getHelpInfo = () => {} } = this.props;
    getHelpInfo([moduleTypeNames[info.type], moduleTypeNames[info.type]]);
  }
  _onLeave(info) {
    const { getHelpInfo = () => {} } = this.props;
    getHelpInfo(['', '']);
  }
  _onDragStart(v, ev) {
    let target = ev.target;
    let info = {
      x: ev.clientX - target.offsetLeft,
      y: ev.clientY - target.offsetTop,
      w: target.offsetWidth,
      h: target.offsetHeight,
      type: target.dataset.type,
      option: v.option || {}
    };
    ev.dataTransfer.setData('dragModuleInfo', JSON.stringify(info));
  }
  _onChnageList(keys) {
    let keysStr = JSON.stringify(keys);
    window.localStorage.setItem(
      `${appConfig.user.id}_openElementsGroup`,
      keysStr
    );
  }
}
const mapDispatchToProps = {
  getHelpInfo
};

const mapStateToProps = function(state) {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ElementsTabPane);

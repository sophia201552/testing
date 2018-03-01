/**
 *添加策略模态框
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as moment from 'moment';
import { getTemplates } from '../../../redux/epics/template.js';
import { copyTemplateAddNew } from '../../../redux/epics/home.js';
import { createStrategy } from '../../../redux/epics/home.js';
import Confirm from '../../../components/Confirm/Confirm';
import ObjectId from '../../../common/objectId.js';

import s from './CreateStrategyModal.css';

class CreateStrategyModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      selectIndex: undefined
    };
    this.closeModal = this.closeModal.bind(this);
    this._onChange = this._onChange.bind(this);
    this.getMore = this.getMore.bind(this);
  }
  componentWillMount() {
    this.props.getTemplates([1], '', '', [], '', appConfig.user.id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.showModal !== this.props.showModal) {
      this.setState({
        selectIndex: '-1',
        value: ''
      });
    }
  }
  render() {
    const { viewList, showModal, i18n } = this.props;
    const { value, selectIndex } = this.state;
    let items = [];
    viewList.forEach(row => {
      if (!row.isParent && items.length < 4) {
        items.push(row);
      }
    });
    if (!showModal) {
      return false;
    }
    return (
      <Modal
        isOpen={showModal}
        onDismiss={this.closeModal}
        containerClassName={s['modal-container']}
      >
        <div className={s['modal-header']}>
          <div>
            <div>
              <div className={s['title']}>
                <span className={s['leftLine']} />
                <span className={s['titleName']}>{i18n.NEW_STRATEGY}</span>
                <span className={s['rightLine']} />
              </div>
              <div className={s['iptCtn']}>
                <TextField
                  label={i18n.STRATEGY_NAME}
                  placeholder={i18n.ENTER_STRATEGY_NAME}
                  value={value}
                  onChanged={this._onChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={s['modal-body']}>
          <ul>
            {[
              <li
                key="-1"
                data-id="-1"
                onClick={this._onSelectedItem.bind(this)}
                className={selectIndex === '-1' ? s['highLight'] : ''}
              >
                <div>
                  <div className={s['blank']}>
                    <i className="ms-Icon ms-Icon--Add" aria-hidden="true" />
                  </div>
                </div>
                <span className={s['itemName']}>{i18n.NEW_PAGE}</span>
              </li>,
              ...items.map((row, index) => (
                <li
                  key={index}
                  data-id={index}
                  onClick={this._onSelectedItem.bind(this, row)}
                  className={
                    Number(selectIndex) === index ? s['highLight'] : ''
                  }
                >
                  <div>
                    <span>
                      <img src={row.imgUrl} />
                    </span>
                  </div>
                  <span className={s['itemName']}>{row.name}</span>
                </li>
              )),
              <li key="-2" onClick={this.getMore}>
                <div>
                  <div className={s['blank']}>
                    <i className="ms-Icon ms-Icon--More" aria-hidden="true" />
                  </div>
                </div>
                <span className={s['itemName']}>{i18n.MORE}...</span>
              </li>
            ]}
          </ul>
        </div>
        <div className={s['modal-footer']}>
          <div className={s['buttonGroup']}>
            <DefaultButton
              primary={true}
              text={i18n.CREATE}
              onClick={this._createItem.bind(this)}
            />
            <DefaultButton text={i18n.CLOSE} onClick={this.closeModal} />
          </div>
        </div>
      </Modal>
    );
  }
  // 点击li当前颜色高亮
  _onSelectedItem(strategy, e) {
    let dataId;
    if (strategy.currentTarget) {
      dataId = strategy.currentTarget.dataset.id;
    } else {
      dataId = e.currentTarget.dataset.id;
    }
    if (dataId) {
      this.setState({
        selectIndex: dataId,
        selectedStrategy: strategy
      });
    }
  }
  _onChange(newValue) {
    this.setState({
      value: newValue
    });
  }
  // 创建新的策略
  _createItem() {
    const { value, selectedStrategy, selectIndex } = this.state;
    if (!value) {
      Confirm({
        title: this.props.i18n.STRATEGY_NAME_NOT_EMPTY,
        type: 'warning',
        onOk: () => {},
        onCancel: () => {}
      });
      return;
    }

    let data = {
      // # 编号
      _id: ObjectId(''),
      // # 父节点 id,
      parentId: '',
      // # 所属项目Id
      projId: appConfig.project.id,
      // # 名称
      name: value,
      // # 描述
      desc: '',
      // # 创建人
      creatorId: appConfig.user.id,
      // # 创建时间
      createTime: '2017-01-01 00:00:00',
      // # 最后修改人
      lastModifierId: appConfig.user.id,
      // # 最后修改人名
      userFullName: appConfig.userProfile.fullname,
      // # 最后修改时间
      lastModifyTime: '2016-04-12 19:00:00',
      // # 关键字，便于检索
      keywords: [],
      // # 类型：0，诊断；1，KPI；2，计算点；
      type: 0,
      // # 触发器，用于配置策略何时执行
      trigger: [{type:'once',options:{intervalSeconds:0,startTime:moment.default(new Date()).format('YYYY-MM-DD HH:mm:ss')}}],
      // # 最后运行时间
      lastRuntime: '--',
      // # 最后发布时间
      lastPublishTime: '',
      // # 状态： 0，未启用；1，启用；
      status: 0,
      // # 是否发布:  0，未发布；1，已发布；
      syncStatus: 0,
      // # 策略其他配置
      options: {
        // # 策略自定义参数
        config: {}
      },
      // # 前置任务
      preTasks: [
        // # 策略 id
        ObjectId('')
      ]
    };
    if (selectIndex !== '-1') {
      data.desc = selectedStrategy.desc;
      let idDatas = [];
      let modules = selectedStrategy.modules.map(row => {
        let oldId = row._id;
        let newId = ObjectId('');
        idDatas.push({
          oldId: oldId,
          newId: newId
        });
        row = Object.assign({}, row, {
          _id: newId,
          strategyId: data._id
        });
        return row;
      });
      modules = modules.map(row => {
        let outputs = row.outputs.map(j => {
          let idData = idDatas.find(i => i.oldId === j._id);
          return {
            _id: idData.newId
          };
        });
        row = Object.assign({}, row, {
          outputs: outputs
        });
        return row;
      });
      this.props.copyTemplateAddNew(data, modules);
    } else {
      this.props.createStrategy(1, data);
    }
    this.closeModal();
  }
  //获得更多策略
  getMore() {
    this.closeModal();
    //跳到模板页面
    this.props.changetTabId('modals');
  }
  closeModal() {
    this.props.closeModal();
  }
}

var mapDispatchToProps = {
  createStrategy,
  getTemplates,
  copyTemplateAddNew
};

var mapStateToProps = function(state) {
  return { viewList: state.template.viewList };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  CreateStrategyModal
);

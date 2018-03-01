/**
 *添加策略模块
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { getTemplates } from '../../redux/epics/template.js';
import { copyTemplateAddNew } from '../../redux/epics/home.js';
import { createStrategy } from '../../redux/epics/home.js';
import Confirm from '../../components/Confirm/Confirm';
import ObjectId from '../../common/objectId.js';

import s from './CreateStrategyPanel.css';


class CreateStrategyPanel extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            value: props.i18n.NEW_STRATEGY_NAME,
            selecteIndex: undefined,
        };
        this.hideStrategyModal = this.hideStrategyModal.bind(this);
        this.showStrategyModal = this.showStrategyModal.bind(this);
        this.showMoreStrategy = this.showMoreStrategy.bind(this);
        this._handleClick = this._handleClick.bind(this);
    }

    componentWillMount() {
        this.props.getTemplates([1], '', '', [], '', appConfig.user.id);
    }

    componentWillReceiveProps(nextProps) { 
        
    }

    render() {
        const { showStrategyPanel, viewList, i18n} = this.props;
        const {isShowAddPanel, selecteIndex } = this.state;
        let items = [];
        viewList.forEach( row=>{
            if( !row.isParent && items.length < 4){
                items.push(row);
            }
        })

        return (
            <div className={s['add-strategy-main']}>
                <div className={s['header']}>
                    <div className={s['pdlr20']}>
                        <div className={s['titleName']}>{i18n.CREATE_NEW_STRATEGY}</div>
                        <div className={s['eventButton']}>
                        {
                           showStrategyPanel ?  <DefaultButton className={s['hide-strategy-btn']} text={ i18n.HIDE_STRATEGY_MODAL} onClick={this.hideStrategyModal} /> :
                           <DefaultButton className={s['hide-strategy-btn']} text={ i18n.SHOW_STRATEGY_MODAL} onClick={this.showStrategyModal} /> 
                        }
                            
                            <DefaultButton className={s['more-strategy-btn']} text={i18n.MORE_MODALS} onClick={this.showMoreStrategy} /> 
                        </div>
                    </div>
                </div>

                <div style={{ display: showStrategyPanel ? 'block' : 'none' }} className={s['select-strategy-main']}>
                    <ul>
                        {[
                        <li
                            key="-1"
                            data-id="-1"
                            onClick={this._handleClick.bind(this)}
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
                            onClick={this._handleClick.bind(this, row)}
                    
                            >
                            <div>
                                <span>
                                <img src={row.imgUrl} />
                                </span>
                            </div>
                            <span className={s['itemName']}>{row.name}</span>
                            </li>
                        ))
                        ]}
                    </ul>
                </div>
            </div>
        );
    }

    hideStrategyModal() {
        this.props.isShowStrategyPanel('hide');  
    }

    showStrategyModal(){
        this.props.isShowStrategyPanel('show');
    }

    showMoreStrategy() {
        this.props.changetTabId('modals');
    }

    //点击创建 
    _handleClick(strategy, e) {
        let dataId;
        if (strategy.currentTarget) {
            dataId = strategy.currentTarget.dataset.id;
        } else {
            dataId = e.currentTarget.dataset.id;
        }
        if (dataId) {
            const selectIndex = dataId;
            const selectedStrategy = strategy;
            const { value } = this.state;
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
                // # 最后修改时间
                lastModifyTime: '2016-04-12 19:00:00',
                // # 关键字，便于检索
                keywords: [],
                // # 类型：0，诊断；1，KPI；2，计算点；
                type: 0,
                // # 触发器，用于配置策略何时执行
                trigger: [],
                // # 最后运行时间
                lastRuntime: '',
                // # 最后发布时间
                lastPublishTime: '2000-01-01 00:00:00',
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
                data.desc = strategy.desc;
                let idDatas = [];
                let modules = strategy.modules.map(row => {
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
        }
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
    CreateStrategyPanel
);



import React from 'react';
import { connect } from 'react-redux';
import { getTemplates } from '../../redux/epics/template.js';
import { createStrategy, removeStrategy} from '../../redux/epics/home.js';
import ObjectId from '../../common/objectId.js';

import { linkTo } from '../../';

import css from './OperateTree.css';

class OperateTree extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        value : props.i18n.NAME
    }
  }

  componentWillMount() {
    this.props.getTemplates([1], '', '', [], '', appConfig.user.id);
  }

  render() {
    const { i18n , selectedKeys} = this.props;
  
    return (
        <div className={css['operateContent']}>
            <div className={css['add']} title={i18n.ADD}
                onClick={this.handleClick.bind(this,'add')}>
                <div>
                    <i className='ms-Icon ms-Icon--PageAdd'></i>
                </div>
            </div>
            <div className={css['edit'] + ' ' + (selectedKeys[0] ? '' : css['disabled'])} title={i18n.EDIT}
                onClick={this.handleClick.bind(this,'edit')}>
                <div>
                    <i className='ms-Icon ms-Icon--Edit'></i>
                </div>
            </div>
            <div className={css['delete'] + ' ' +(selectedKeys[0] ? '' : css['disabled'])} title={i18n.DELETE}
                onClick={this.handleClick.bind(this,'delete')}>
                <div>
                    <i className='ms-Icon ms-Icon--Delete'></i>
                </div>
            </div>
        </div>
    );
  }

  handleClick(type){
    if(type =='add'){
        const { value } = this.state;
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
            lastRuntime: '2016-04-12 19:00:00',
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
        this.props.createStrategy(1, data);
    }else if(type =='edit'){
        this.props.changeStateFn.edit(); 
    }else if(type =='delete'){
        const {selectedItems } = this.props; 
        this.props.removeStrategy(
            appConfig.project.id,
            selectedItems.map(v => v._id),
            selectedItems.map(v => v.creatorId)
        );

        linkTo('');
    }
  }

}

var  mapDispatchToProps = {
    createStrategy,
    getTemplates,
    removeStrategy
};

var mapStateToProps = function(state) {
    return { viewList: state.template.viewList };
};

export default connect( mapStateToProps, mapDispatchToProps)(
    OperateTree
);


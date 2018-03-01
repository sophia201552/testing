import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import DropdownList from '../../../components/DropdownList';
import { updateStrategy } from '../../../redux/epics/home.js';

import css from './ConfigTabPane.css';

class ConfigTabPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'cyclical',
      status: 0,
      intervalSeconds: 86400,
      startTime: moment()
        .add(1, 'day')
        .toDate()
    };
    this.changeValue = this.changeValue.bind(this);
    this.updateStrategy = this.updateStrategy.bind(this);
    this.changeTypeDropdown = this.changeTypeDropdown.bind(this);
    this.changeStatusDropdown = this.changeStatusDropdown.bind(this);
    this.recoverStrategy = this.recoverStrategy.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { selectedItems } = nextProps;
    if (selectedItems.length === 0 || selectedItems[0] === undefined) {
      return;
    }
    let status =
        selectedItems[0].status !== undefined ? selectedItems[0].status : 0,
      trigger = selectedItems[0].trigger[0] || {},
      options = trigger.options || {},
      type = trigger.type || 'cyclical',
      intervalSeconds = options.intervalSeconds == undefined?86400:options.intervalSeconds,
      startTime = options.startTime
        ? moment(options.startTime).toDate()
        : moment()
            .add(1, 'day')
            .toDate(),
      name = selectedItems[0].name,
      desc = selectedItems[0].desc;
    this.setState({
      type,
      status,
      intervalSeconds,
      startTime,
      name,
      desc
    });
  }
  render() {
    const { i18n } = this.props;
    const {
      type,
      status,
      intervalSeconds = '',
      startTime = '',
      name,
      desc
    } = this.state;
    return (
      <div className={css['configTabPane'] + ' ms-slideRightIn20'}>
        <div className={css['propertyCtn']}>
          <div className={css['group']}>
            <Label title={i18n.NAME}>{i18n.NAME}</Label>
            <div className={css['dropdownlistWrap']}>
              <input name="name" value={name} onChange={this.changeValue} />
            </div>
          </div>
          <div className={css['group']}>
            <Label title={i18n.DESC}>{i18n.DESC}</Label>
            <div className={css['dropdownlistWrap']}>
              <input name="desc" value={desc} onChange={this.changeValue} />
            </div>
          </div>
          <div className={css['group']}>
            <Label title={i18n.STATE}>{i18n.STATE}</Label>
            <div className={css['dropdownlistWrap']}>
              <DropdownList
                options={[
                  { key: 0, text: i18n.NOT_ENABLED },
                  { key: 1, text: i18n.ENABLED }
                ]}
                selectedKey={status}
                onChanged={this.changeStatusDropdown}
              />
            </div>
          </div>
          <div className={css['group']}>
            <Label title={i18n.SCHEDULE}>{i18n.SCHEDULE}</Label>
            <div className={css['dropdownlistWrap']}>
              <DropdownList
                options={[
                  { key: 'once', text: i18n.ONCE },
                  { key: 'cyclical', text: i18n.CYCLICAL }
                ]}
                selectedKey={type}
                onChanged={this.changeTypeDropdown}
              />
            </div>
          </div>
          <div className={css['group']}>
            <Label title={i18n.CYCLE_INTERVALS}>{i18n.CYCLE_INTERVALS}</Label>
            <div className={css['dropdownlistWrap']}>
              <input
                name="intervalSeconds"
                value={type === 'once' ? 0 : intervalSeconds}
                disabled={type === 'once' ? true : false}
                onChange={this.changeValue}
              />
            </div>
          </div>
          <div className={css['group']}>
            <Label title={i18n.PRELIMINARY_TIME}>{i18n.PRELIMINARY_TIME}</Label>
            <div className={css['dropdownlistWrap']}>
              <DatePicker
                highlightCurrentMonth={true}
                isMonthPickerVisible={false}
                allowTextInput={true}
                value={startTime}
                formatDate={value => {
                  return moment(value).format('YYYY-MM-DD HH:mm:ss');
                }}
                showGoToToday={false}
                disableAutoFocus={true}
                onSelectDate={this.updateStartTime.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className={css['buttonCtn']}>
          <DefaultButton text={i18n.CANCEL} onClick={this.recoverStrategy} />
          <DefaultButton
            primary={true}
            text={i18n.SAVE}
            onClick={this.updateStrategy}
          />
        </div>
      </div>
    );
  }
  changeValue(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value
    });
  }
  changeTypeDropdown(item) {
    let intervalSeconds = 0;
    switch(item.key){
      case 'once':
      intervalSeconds = 0;
      break;
      case 'cyclical':
      intervalSeconds = 86400;
      break;
    }
    console.log(item);
    this.setState({
      type: item.key,
      intervalSeconds
    });
  }
  changeStatusDropdown(item) {
    this.setState({
      status: item.key
    });
  }
  updateStartTime(date) {
    this.setState({
      startTime: date
    });
  }
  updateStrategy() {
    const { name, desc, type, status, intervalSeconds, startTime } = this.state;
    const {
      selectedItems,
      updateSelectedItems = () => {},
      updateStrategy = () => {}
    } = this.props;
    let trigger = Object.assign({}, selectedItems[0].trigger[0], {
      type: type,
      options: {
        intervalSeconds: intervalSeconds,
        startTime: moment(startTime).format('YYYY-MM-DD HH:mm:ss')
      }
    });
    let strategy = Object.assign({}, selectedItems[0], {
      name: name,
      desc: desc,
      status: status,
      trigger: [trigger],
      syncStatus: 0
    });
    updateStrategy(appConfig.project.id, strategy._id, strategy);
    updateSelectedItems([strategy]);
  }
  recoverStrategy() {
    this.componentWillReceiveProps(this.props);
  }
}
let mapDispatchToProps = {
  updateStrategy
};

let mapStateToProps = function(state) {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigTabPane);
/**
 * 以何种方式搜索控件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I from 'seamless-immutable';

import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import Confirm from '../../../components/Confirm';

import moment from 'moment';
import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings
} from 'office-ui-fabric-react/lib/DatePicker';

import Select from '../../../components/Select';
import { getTagDict } from '../../../redux/epics/home.js';

import s from './SearchGroup.css';
import { get } from 'http';

/**
 * Props
 *
 * type: regex|range 搜索类型
 * selectedValue: '' | [] 搜索值
 * selectedKey: '' 搜索名
 * onChange: ()=>{} 选项改变
 * onSearch: ()=>{} 点击搜索按钮开始搜索
 */

/**
 * State
 *
 * key: '' 搜索名
 * value: ''| [] 搜索值
 * type: regex|range 搜索类型
 * placeholder: '' | []
 * startTime: 开始时间(以时间搜索时存在)
 * endTime: 结束时间(以时间搜索时存在)
 * pointValueRange: [最小值, 最大值](以点值范围搜索是存在)
 *
 */

class SearchGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      key: props.selectedKey || 'originalPointName',
      value: props.selectedValue || '',
      startTime: '',
      endTime: '',
      pointValueRange: ['', ''],
      placeholder: props.i18n.ENTER_ORIGINAL_POINT_NAME,
      type: props.type || 'regex',
      selectTags: []
    };
    this._onChange = this._onChange.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._tagsChange = this._tagsChange.bind(this);
    this.options = [
      {
        key: 'originalPointName',
        text: props.i18n.SEACH_BY_ORIGINAL_POINT_NAME,
        type: 'regex'
      },
      {
        key: 'tag',
        text: props.i18n.SEARCH_BY_TAG,
        type: 'list'
      },
      {
        key: 'sitePointName',
        text: props.i18n.SEARCH_BY_SITE_POINT_NAME,
        type: 'regex'
      },
      {
        key: 'realtimeValue',
        text: props.i18n.SEARCH_BY_POINT_VALUE,
        type: 'regex'
      },
      {
        key: 'realtimeValue_range',
        text: props.i18n.SEARCH_BY_POINT_VALUE_RANGE,
        type: 'range'
      },
      {
        key: 'realtimeValueUpdateTime',
        text: props.i18n.SEARCH_BY_UPDATE_TIME,
        type: 'range'
      },
      {
        key: 'pointAnnotation',
        text: props.i18n.SEARCH_BY_ANNOTATION,
        type: 'regex'
      }
    ];
  }
  componentWillReceiveProps(nextProps) {
    const { tagDict, getTagDict } = nextProps;
    if (tagDict.length === 0) {
      getTagDict();
    }
  }
  render() {
    const {
      startTime,
      endTime,
      pointValueRange,
      placeholder,
      key,
      value
    } = this.state;
    const { i18n, tagDict } = this.props;
    let tags = [],tagParents=new Set(['Custom']);
    tagDict.forEach(v => {
      tags.push(v.groupNm);
      tagParents.add(v.groupNm);
      tags = tags.concat(v.tags.map(t => t.name));
    });
    let selectedTags = Array.isArray(value)?value:[];
    let customTags = selectedTags.filter(v=>tags.indexOf(v)<0);
    tags = tags.concat(['Custom',...customTags]);
    return (
      <div className={s['SearchGroupWrap']}>
        <div className={s['dropDownWrap']}>
          <Dropdown
            className={s['Dropdown']}
            onChanged={this._onChange}
            selectedKey={key}
            options={this.options}
            dropdownWidth={224}
          />
        </div>
        <div className={s['searchWrap']}>
          <div
            className={`${s['timePickerWrap']}${
              key === 'realtimeValueUpdateTime' ? '' : ' hide'
            } `}
          >
            <DatePicker
              highlightCurrentMonth={true}
              isMonthPickerVisible={false}
              allowTextInput={true}
              value={startTime}
              disabled={false}
              placeholder={placeholder[0] ? placeholder[0] : ''}
              formatDate={value => moment(value).format('YYYY-MM-DD')}
              showGoToToday={false}
              disableAutoFocus={true}
              onSelectDate={date => this._onSelectDate(date, 'startTime')}
            />
            <div className={s['toTime']}>
              <span>to</span>
            </div>
            <DatePicker
              highlightCurrentMonth={true}
              isMonthPickerVisible={false}
              allowTextInput={true}
              value={endTime}
              disabled={false}
              placeholder={placeholder[1] ? placeholder[1] : ''}
              formatDate={value => moment(value).format('YYYY-MM-DD')}
              showGoToToday={false}
              disableAutoFocus={true}
              onSelectDate={date => this._onSelectDate(date, 'endTime')}
            />
          </div>
          <div
            className={`${s['search']}${
              key === 'realtimeValue_range' ||
              key === 'tag' ||
              key === 'realtimeValueUpdateTime'
                ? ' hide'
                : ''
            } `}
          >
            <SearchBox
              labelText={placeholder}
              onChange={this._onSearchValueChange.bind(this)}
              value={value}
              onSearch={this._onSearch}
            />
          </div>
          <div
            className={`${s['selectTagsWrap']}${key === 'tag' ? '' : ' hide'}`}
          >
            {Array.isArray(value) && (
              <Select
                onChanged={this._tagsChange}
                options={I.asMutable(
                  Array.from(new Set(tags)).map(v => ({
                    key: v,
                    text: v,
                    type:tagParents.has(v)?'header':'item'
                  }))
                )}
                selectedKeys={value}
              />
            )}
          </div>
          <div
            className={`${s['pointValueWrap']}${
              key === 'realtimeValue_range' ? '' : ' hide'
            } `}
          >
            <div className={s['spinButtonWrap']}>
              <SpinButton
                value={
                  (key === 'realtimeValue_range' && value[0]) ||
                  pointValueRange[0]
                }
                typeText={placeholder[0] ? placeholder[0] : ''}
                changeValue={this._changeValue.bind(this, 'min')}
                onSearch={this._onSearch}
              />
            </div>
            <div className={s['toTime']}>
              <span>to</span>
            </div>
            <div className={s['spinButtonWrap']}>
              <SpinButton
                value={
                  (key === 'realtimeValue_range' && value[1]) ||
                  pointValueRange[1]
                }
                typeText={placeholder[1] ? placeholder[1] : ''}
                changeValue={this._changeValue.bind(this, 'max')}
                onSearch={this._onSearch}
              />
            </div>
          </div>
        </div>
        <div className={s['searchBtn']} onClick={this._onSearch.bind(this)}>
          <span>{i18n.SEARCH}</span>
        </div>
      </div>
    );
  }
  _onChange(dropOpt) {
    let {
      pointValueRange,
      startTime,
      endTime,
      placeholder,
      value,
      key,
      selectTags
    } = this.state;
    let { onChange = () => {}, i18n } = this.props;
    key = dropOpt.key;
    switch (dropOpt.key) {
      case 'originalPointName':
        placeholder = i18n.ENTER_ORIGINAL_POINT_NAME;
        value = '';
        break;
      case 'tag':
        placeholder = i18n.ENTER_ORIGINAL_POINT_NAME;
        value = [];
        break;
      case 'sitePointName':
        placeholder = i18n.ENTER_SITE_POINT_NAME;
        value = '';
        break;
      case 'realtimeValue':
        placeholder = i18n.ENTER_POINT_VALUE;
        value = '';
        break;
      case 'realtimeValue_range':
        placeholder = [i18n.MIN, i18n.MAX];
        value = pointValueRange;
        break;
      case 'realtimeValueUpdateTime':
        placeholder = [i18n.START_TIME, i18n.END_TIME];
        value = ['', ''];
        break;
      case 'pointAnnotation':
        placeholder = i18n.ENTER_ANNOTATION;
        value = '';
        break;
    }
    this.setState({
      placeholder,
      type: dropOpt.type,
      key,
      value
    });
    if (dropOpt.type === 'list') {
      value = value.join(',');
    }
    onChange(key, value, dropOpt.type);
  }
  /* 时间改变*/
  _onSelectDate(date, timeType) {
    const { value } = this.state;
    if (timeType == 'startTime') {
      this.setState({
        startTime: date,
        value: [moment(date).format('YYYY-MM-DD'), value[1]]
      });
    } else {
      this.setState({
        endTime: date,
        value: [value[0], moment(date).format('YYYY-MM-DD')]
      });
    }
  }
  _changeValue(arg, value) {
    let { pointValueRange } = this.state;
    pointValueRange = pointValueRange.concat([]);
    if (arg == 'min') {
      pointValueRange = [value, pointValueRange[1]];
    } else {
      pointValueRange = [pointValueRange[0], value];
    }
    this.setState({
      pointValueRange,
      value: pointValueRange
    });
  }
  _onSearchValueChange(value) {
    this.setState({
      value
    });
  }
  _onSearch() {
    let { key, value, type } = this.state;
    const { onSearch = () => {}, i18n } = this.props;
    if (type == 'list') {
      value = value.join(',');
    }
    if (Array.isArray(value)) {
      if (value[0] === '' || value[1] === '') {
        Confirm({
          title: i18n.WARNING,
          content: i18n.SEARCH_VALUE_NOT_EMPTY,
          type: 'warning',
          onOk: () => {},
          onCancel: () => {}
        });
        return false;
      }
    }
    if ( key === 'realtimeValueUpdateTime') {
      value =  [moment(value[0]).format('YYYY-MM-DD 00:00:00'), moment(value[1]).format('YYYY-MM-DD 23:59:59')]
    }
    onSearch(key, value, type);
  }

  _tagsChange(selectedKeys, isAdd, item, items) {
    this.setState({
      value: items.map(v => v.text)
    });
  }
}

class SpinButton extends React.PureComponent {
  render() {
    const { value, typeText } = this.props;
    return (
      <div className={s['inputWrap']}>
        <input
          id="input"
          placeholder={typeText}
          onChange={this._changeValue.bind(this)}
          value={value}
          onKeyUp={this._onSearch.bind(this)}
        />
        <label
          className={s['ChevronUp']}
          onClick={this._changeValue.bind(this, 'add')}
        >
          <i className="ms-Icon ms-Icon--ChevronUp" aria-hidden="true" />
        </label>
        <label
          className={s['ChevronDown']}
          onClick={this._changeValue.bind(this, 'delete')}
        >
          <i className="ms-Icon ms-Icon--ChevronDown" aria-hidden="true" />
        </label>
      </div>
    );
  }

  _changeValue(e) {
    const { value, changeValue = () => {} } = this.props;
    let newValue = Number(value);
    if (e.target) {
      newValue = e.target.value;
    } else {
      if (e === 'add') {
        newValue = newValue + 1;
      } else if (e === 'delete') {
        newValue = newValue - 1;
      }
    }
    changeValue(newValue);
  }
  _onSearch(e) {
    const { onSearch = () => {}, value } = this.props;
    let newValue = Number(value);
    if (e.keyCode === 13) {
      onSearch(newValue);
    }
  }
}

var mapDispatchToProps = {
  getTagDict
};

var mapStateToProps = function(state) {
  return {
    tagDict: state.home.tagDict
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchGroup);

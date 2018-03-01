/**
 * 数据源参数样本模态框
 */
import React from 'react';
import PropTypes from 'prop-types';
import I from 'seamless-immutable';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';

import Select from '../../../components/Select';
import Confirm from '../../../components/Confirm';

import s from './ParametricExampleModal.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

class ParametricExampleModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this._selection = undefined;
    this._isAddRow = false;
    this.state = {
      isShow: false,
      isSHowRow: false,
      selectedItems: [],
      rowData: {
        name: '',
        description: '',
        sample: '',
        tags: []
      }
    };
    this._columns = [
      {
        key: 'name',
        name: this.props.i18n.PARAMETER_NAME,
        fieldName: 'name',
        maxWidth: 160
      },
      {
        key: 'description',
        name: this.props.i18n.DESCRIPTION,
        fieldName: 'description',
        maxWidth: 160
      },
      {
        key: 'sample',
        name: this.props.i18n.THE_SAMPLE_POINTS,
        fieldName: 'sample',
        maxWidth: 160
      },
      {
        key: 'tags',
        name: 'Tags',
        fieldName: 'tags',
        className: 'modal-tag',
        maxWidth: 200,
        onRender: (item, index) => {
          return (
            <ul className={css('tagUl')}>
              {item.tags.map((tag, i) => <li key={i}>{tag}</li>)}
            </ul>
          );
        }
      }
    ];
    this._initSelection();
    this.toggleShow = this.toggleShow.bind(this);
    this._editRow = this._editRow.bind(this);
    this._addRow = this._addRow.bind(this);
    this._deleteRow = this._deleteRow.bind(this);
    this._rowOnchange = this._rowOnchange.bind(this);
    this._rowCancel = this._rowCancel.bind(this);
    this._rowOK = this._rowOK.bind(this);
    this._tagsChange = this._tagsChange.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    const { data, tagDict, i18n } = this.props;
    let items = [];
    data.forEach((v, i) => {
      items.push(Object.assign({ id: i }, v));
    });
    const { isShow, isSHowRow, selectedItems, rowData } = this.state;
    let tags = [],
      tagParents = new Set(['Custom']);
    tagDict.forEach(v => {
      tags.push(v.groupNm);
      tagParents.add(v.groupNm);
      tags = tags.concat(v.tags.map(t => t.name));
    });
    let selectedTags = Array.isArray(rowData.tags) ? rowData.tags : [];
    let customTags = selectedTags.filter(v => tags.indexOf(v) < 0);
    tags = tags.concat(['Custom', ...customTags]);
    return (
      <Modal isOpen={isShow}>
        <div className={s['listModalWrap']}>
          <div className={s['head']}>
            {i18n.PARAMETERS_OF_THE_SAMPLE}
            <span
              className={s['remove']}
              onClick={this.toggleShow.bind(this, false)}
            >
              <i className="ms-Icon ms-Icon--Cancel" aria-hidden="true" />
            </span>
          </div>
          <div className={s['content']}>
            <div className={css('btnGroup clear')}>
              <button onClick={this._addRow}>
                <i className={'ms-Icon ms-Icon--AddEvent'} />
                <span>{i18n.NEW_POINT}</span>
              </button>
              <button onClick={this._deleteRow}>
                <i className={'ms-Icon ms-Icon--Delete'} />
                <span>{i18n.DELETE_POINT}</span>
              </button>
            </div>
            <div className={s['detailsListWrap']}>
              <DetailsList
                items={items}
                columns={this._columns}
                selection={this._selection}
                groupProps={{
                  showEmptyGroups: true
                }}
                setKey="set"
                layoutMode={DetailsListLayoutMode.fixedColumns}
                onItemInvoked={this._editRow}
                compact={true}
                selectionPreservedOnEmptyClick={true}
              />
            </div>
            <Modal isOpen={isSHowRow}>
              <div className={s['rowModalWrap']}>
                <div className={s['head']}>
                  {(selectedItems[0] && i18n.EDIT) || i18n.ADD}
                </div>
                <div className={s['content']}>
                  <div key={`input_name`} className={css('item clear')}>
                    <label>{i18n.PARAMETER_NAME}</label>
                    <input
                      value={rowData.name}
                      placeholder=""
                      onChange={this._rowOnchange.bind(this, 'name')}
                      onKeyUp={this._onKeyUp.bind(this, 'name')}
                    />
                  </div>
                  <div key={`input_description`} className={css('item clear')}>
                    <label>{i18n.DESCRIPTION}</label>
                    <input
                      value={rowData.description}
                      placeholder={i18n.NO_DESCRIPTION}
                      onChange={this._rowOnchange.bind(this, 'description')}
                      onKeyUp={this._onKeyUp.bind(this, 'description')}
                    />
                  </div>
                  <div key={`input_sample`} className={css('item clear')}>
                    <label>{i18n.THE_SAMPLE_POINTS}</label>
                    <input
                      value={rowData.sample}
                      placeholder="@projectId|name"
                      onChange={this._rowOnchange.bind(this, 'sample')}
                      onKeyUp={this._onKeyUp.bind(this, 'sample')}
                    />
                  </div>
                  <div key={`input_tags`} className={css('item clear')}>
                    <label>Tags</label>
                    <div
                      style={{
                        display: 'inline-block',
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <Select
                        onChanged={this._tagsChange}
                        options={I.asMutable(
                          Array.from(new Set(tags)).map(v => ({
                            key: v,
                            text: v,
                            type: tagParents.has(v) ? 'header' : 'item'
                          }))
                        )}
                        selectedKeys={rowData.tags}
                      />
                    </div>
                  </div>
                </div>
                <div className={s['foot']}>
                  <button onClick={this._rowOK} className={s['ok']}>
                    {i18n.OK}
                  </button>
                  <button onClick={this._rowCancel} className={s['cancel']}>
                    {i18n.CANCEL}
                  </button>
                </div>
              </div>
            </Modal>
          </div>
          <div className={s['foot']} />
        </div>
      </Modal>
    );
  }
  toggleShow(isShow = false) {
    this.setState({
      isShow
    });
  }
  _initSelection() {
    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectedItems: this._selection.getSelection()
        });
      }
    });
  }
  _rowOnchange(key, ev) {
    const { rowData } = this.state;
    let value = (ev.target && ev.target.value) || '';
    if (key == 'tags') {
      value = ev;
    }
    let newData = Object.assign({}, rowData, { [key]: value });
    this.setState({
      rowData: newData
    });
  }
  _onKeyUp(key, ev) {
    if (ev.key === 'Enter') {
      this._rowOnchange(key, ev);
      ev.target.blur();
    }
  }
  _onBlur(key, ev) {}
  _tagsChange(selectedKeys, isAdd, item, items) {
    this._rowOnchange('tags', selectedKeys);
  }
  _editRow() {
    const { selectedItems } = this.state;
    this._isAddRow = false;
    let item = selectedItems[0];
    this.setState({
      isSHowRow: true,
      rowData: {
        name: item.name,
        description: item.description,
        sample: item.sample,
        tags: item.tags
      }
    });
  }
  _addRow() {
    this._isAddRow = true;
    this.setState({
      isSHowRow: true,
      rowData: {
        name: '',
        description: '',
        sample: '',
        tags: []
      },
      selectedItems: []
    });
    this._selection.setItems([]);
  }
  _deleteRow() {
    const { i18n } = this.props;
    const { selectedItems } = this.state;
    let pointName = [];
    selectedItems.forEach(v => {
      pointName.push(v.name);
    });
    Confirm({
      type: 'warning',
      title: i18n.WARNING,
      content: i18n.SURE_DELETE_PARAM_POINT.replace(
        '{num}',
        pointName.join(',')
      ),
      onOk: () => {
        const { updateData, data } = this.props;
        let namesArr = selectedItems.map(v => v.name);
        let newData = data.flatMap(v => {
          if (namesArr.indexOf(v.name) > -1) {
            return [];
          } else {
            return v;
          }
        });
        updateData(newData);
      },
      onCancel: () => {}
    });
  }
  _rowCancel() {
    this.setState({
      isSHowRow: false
    });
  }
  _rowOK() {
    const { rowData, selectedItems } = this.state;
    const { updateData, data, i18n } = this.props;
    let isSameName = false;
    data.forEach(v => {
      if (v.name == rowData.name) {
        isSameName = true;
      }
    });
    if (rowData.name == '') {
      isSameName = true;
    }
    if (this._isAddRow && isSameName) {
      Confirm({
        type: 'warning',
        title: i18n.WARNING,
        content: i18n.PARAM_NAME_NOT_EMPTY,
        onOk: () => {}
      });
      return;
    }
    rowData.description = rowData.description || i18n.NO_DESCRIPTION;
    rowData.sample = rowData.sample || '@projectId|name';
    let newData;
    if (selectedItems.length > 0) {
      newData = data.flatMap(v => {
        if (v.name == selectedItems[0].name) {
          return rowData;
        } else {
          return v;
        }
      });
    } else {
      newData = data.set(data.length, rowData);
    }
    updateData(newData);
    this.setState({
      isSHowRow: false,
      selectedItems: []
    });
    this._selection.setItems([]);
  }
}

ParametricExampleModal.propTypes = {};

export default ParametricExampleModal;

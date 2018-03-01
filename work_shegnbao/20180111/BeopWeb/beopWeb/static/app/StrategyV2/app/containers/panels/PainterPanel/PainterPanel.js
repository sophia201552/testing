import React from 'react';
import PropTypes from 'prop-types';
import I from 'seamless-immutable';
import { connect } from 'react-redux';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { diff, merge as mergeDiff } from '@beopcloud/diff';

import {
  getStrategyItem,
  saveStrategyItem
} from '../../../redux/epics/painter.js';
import ObjectId from '../../../common/objectId.js';
import Sketchpad from '../../../sketchpad/index.js';
import { updateStrategy } from '../../../redux/epics/home.js';
import StageContextMenu from '../../../components/StageContextMenu';
import ElementsTabPane from '../../StrategyList/ElementsTabPane/ElementsTabPane';
import Confirm from '../../../components/Confirm';

import { moduleTypeNames } from '@beopcloud/StrategyV2-Engine/src/enum';

import css from './PainterPanel.css';

const preventFn = function(e) {
  e.preventDefault();
};
let lastViewInfo = undefined;
class PainterPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true
    };
    //右键菜单
    this.isShowMenu = true;
    this.moduleMenu = undefined;
    this.stageMenu = undefined;
    this.addModuleMenu = undefined;

    this.sketchpad = undefined;
    this.isInSketchpad = true;

    this._onDragover = this._onDragover.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onScaleWheel = this._onScaleWheel.bind(this);
    this._onStageMouseDown = this._onStageMouseDown.bind(this);
    this._onStageMouseUp = this._onStageMouseUp.bind(this);
    this._onStageContextMenu = this._onStageContextMenu.bind(this);
  }
  componentDidMount() {
    const { i18n } = this.props;
    //绑定浏览器resize事件与键盘事件
    $(window)
      .off('keydown.delete')
      .on('keydown.delete', this._domKeyDown.bind(this));
    $(window)
      .off('resize.sketchpad')
      .on('resize.sketchpad', this._domResize.bind(this));
    $(`.${css['sketchpadWrap']}`)
      .off('mouseenter')
      .on('mouseenter', e => {
        this.isInSketchpad = true;
      });
    $(`.${css['sketchpadWrap']}`)
      .off('mouseleave')
      .on('mouseleave', e => {
        this.isInSketchpad = false;
      });
    this._initSketchpad(this.props.modules.asMutable(), this.props);

    let elementsList = ElementsTabPane.getList();
    let addChildren = elementsList.map(e => ({
        key: e.keyId,
        value: e.title,
        children: e.data.map((v, i) => ({
          key: `${e.keyId}-${i}`,
          value: v.name,
          data: v,
          onClick: o => {
            this._doAddModule(o.item.data, o.ev);
          }
        }))
      })),
      addLinkChildren = elementsList.map(e => ({
        key: e.keyId,
        value: e.title,
        children: e.data.map((v, i) => ({
          key: `${e.keyId}-${i}`,
          value: v.name,
          data: v,
          onClick: o => {
            let id = this._doAddModule(o.item.data, o.ev);
            o.ev.excessLinkTo(id);
          }
        }))
      }));
    this.moduleMenu = new StageContextMenu(this.refs.sketchpad, {
      items: [
        { key: 'copy', value: i18n.COPY },
        { key: 'delete', value: i18n.DELETE }
      ]
    });
    this.addModuleMenu = new StageContextMenu(this.refs.sketchpad, {
      items: [
        { key: 'link', value: i18n.LINK, type: 'header' },
        ...addLinkChildren
      ]
    });
    this.stageMenu = new StageContextMenu(this.refs.sketchpad, {
      items: [
        { key: 'add', value: i18n.ADD, children: addChildren },
        { key: 'paste', value: i18n.PASTE },
        { key: 'enlarge', value: i18n.ENLARGE },
        { key: 'narrow', value: i18n.NARROW }
      ],
      onClick: o => {
        switch (o.item.key) {
          case 'add':
            break;
          case 'paste':
            this._doPaste(o.ev.clientX, o.ev.clientY);
            break;
          case 'enlarge':
            this._doScale(this.sketchpad.viewbox.zoom + 0.2);
            break;
          case 'narrow':
            this._doScale(this.sketchpad.viewbox.zoom - 0.2);
            break;
        }
      }
    });
  }
  componentWillUnmount() {
    lastViewInfo = this.sketchpad && this.sketchpad.getDrawViewBox();
    this.sketchpad && this.sketchpad.clear();
    $(window).off('keydown.delete');
    $(window).off('resize.sketchpad');
    this.moduleMenu&&this.moduleMenu.destroy();
    this.addModuleMenu&&this.addModuleMenu.destroy();
    this.stageMenu&&this.stageMenu.destroy();
  }
  componentWillReceiveProps(nextProps) {
    const { strategy } = nextProps;
    if (strategy._id != this.props.strategy._id) {
      //切换策略
      this._initSketchpad(nextProps.modules.asMutable(), nextProps);
    } else {
      this.sketchpad.updateOption({
        data: nextProps.modules.asMutable()
      });
    }
  }
  _onDrop(ev) {
    ev.preventDefault();
    let dragModuleInfo = ev.dataTransfer.getData('dragModuleInfo');
    if (dragModuleInfo) {
      this._doAddModule(JSON.parse(dragModuleInfo), ev);
    }
  }
  _onDragover(ev) {
    ev.preventDefault();
  }
  _onStageMouseDown(ev) {
    let startPos = {
      x: ev.clientX,
      y: ev.clientY
    };
    if (ev.nativeEvent.which == 3) {
      this.isShowMenu = true;
      this.refs.sketchpad.style.cursor = 'pointer';
      $(this.refs.sketchpad)
        .off('mousemove.move')
        .on('mousemove.move', evt => {
          this.refs.sketchpad.style.cursor = 'pointer';
          let dx = evt.clientX - startPos.x,
            dy = evt.clientY - startPos.y;
          startPos.x = evt.clientX;
          startPos.y = evt.clientY;
          this.sketchpad.moveTo(-dx, -dy);

          if (dx * dx + dy * dy > 10) {
            this.isShowMenu = false;
          }
        })
        .off('mouseup.move')
        .on('mouseup.move', evt => {
          this.refs.sketchpad.style.cursor = 'default';
          $(this.refs.sketchpad)
            .off('mousemove.move')
            .off('mouseup.move');
        });
    } else {
      let offset = $(this.refs.sketchpad).offset(),
        viewbox = this.sketchpad.viewbox;
      let clientX = (ev.clientX - offset.left) / viewbox.zoom + viewbox.x,
        clientY = (ev.clientY - offset.top) / viewbox.zoom + viewbox.y;
      let isOK = this.sketchpad.createSelectGroup(clientX, clientY);
      if (isOK) {
        $(this.refs.sketchpad)
          .off('mousemove.selectGroup')
          .on('mousemove.selectGroup', evt => {
            let dx = evt.clientX - startPos.x,
              dy = evt.clientY - startPos.y;
            this.sketchpad.updateSelectGroup(dx, dy);
          })
          .off('mouseup.selectGroup')
          .on('mouseup.selectGroup', evt => {
            $(this.refs.sketchpad)
              .off('mousemove.selectGroup')
              .off('mouseup.selectGroup');
            this.sketchpad.removeSelectGroup();
          });
      }
    }
  }
  _onStageMouseUp(ev) {
    if (ev.nativeEvent.which == 3) {
      if (this.isShowMenu) {
        ev.preventDefault();
        ev.stopPropagation();
        this._onStageContextMenu(Object.assign({}, ev));
      }
    }
  }
  _onStageContextMenu(ev) {
    let offset = $(this.refs.sketchpad).offset(),
      viewbox = this.sketchpad.viewbox;
    let clientX = (ev.clientX - offset.left) / viewbox.zoom + viewbox.x,
      clientY = (ev.clientY - offset.top) / viewbox.zoom + viewbox.y;
    let isInModule = this.sketchpad.isInModule(clientX, clientY);
    if (isInModule) {
      this.sketchpad.selectModule([isInModule]);
      let option = {};
      option.onClick = o => {
        switch (o.item.key) {
          case 'copy':
            this._doCopy();
            break;
          case 'delete':
            this._doDelete();
            break;
        }
      };
      this.moduleMenu.setOption(option);
      this.moduleMenu.show(ev);
    } else {
      let option = {},
        items = this.stageMenu.items;
      if (viewbox.zoom == 0.2) {
        let it = items.find(v => v.key == 'narrow');
        it.disabled = true;
        option.items = items;
      } else {
        let it = items.find(v => v.key == 'narrow');
        it.disabled = false;
        option.items = items;
      }
      if (viewbox.zoom == 2) {
        let it = items.find(v => v.key == 'enlarge');
        it.disabled = true;
        option.items = items;
      } else {
        let it = items.find(v => v.key == 'enlarge');
        it.disabled = false;
        option.items = items;
      }
      if (!window.sessionStorage.getItem('strategyV2CopyInfos')) {
        let it = items.find(v => v.key == 'paste');
        it.disabled = true;
        option.items = items;
      } else {
        let it = items.find(v => v.key == 'paste');
        it.disabled = false;
        option.items = items;
      }
      this.stageMenu.setOption(option);
      this.stageMenu.show(ev);
    }
  }
  _onScaleWheel(ev) {
    let num = -1;
    if (ev.nativeEvent.wheelDelta > 0) {
      num = 1;
    }
    this._doScale(this.sketchpad.viewbox.zoom + num * 0.2);
  }
  _domResize(ev) {}
  _domKeyDown(ev) {
    const { i18n } = this.props;
    if (this.isInSketchpad && (ev.key == 'Delete' || ev.key == 'Backspace')) {
      Confirm({
        title: i18n.TOOLTIP,
        content: i18n.CONFIRM_DELETE_MODULE,
        type: 'info',
        onCancel: () => {},
        onOk: () => {
          this._doDelete();
        }
      });
    }
    if (this.isInSketchpad && (ev.ctrlKey || ev.metaKey) && ev.key == 'c') {
      this._doCopy();
    }
    if (this.isInSketchpad && (ev.ctrlKey || ev.metaKey) && ev.key == 'v') {
      this._doPaste();
    }
  }
  _initSketchpad(data, props) {
    const {
      handleEnterModule,
      handleLeaveModule,
      handleDblClickModule,
      updateModule,
      isFirstLoadData
    } = props;
    if (this.sketchpad) {
      this.sketchpad.clear();
      this.sketchpad = undefined;
      lastViewInfo = undefined;
      if (isFirstLoadData) {
        this._doScale(1);
      }
    }

    this.sketchpad = new Sketchpad(
      this.refs.sketchpad,
      {
        id: this.refs.sketchpad.id,
        data,
        isFirstLoadData,
        lastViewInfo: lastViewInfo
      },
      {
        moduleEnter: handleEnterModule,
        moduleLeave: handleLeaveModule,
        moduleDbClick: handleDblClickModule,
        moduleUpdate: propNames => {
          updateModule(this.sketchpad.getInfo(), propNames);
        },
        sketchpadScale: zoom => {
          this.refs.slider.setState({ renderedValue: zoom, value: zoom });
          this.refs.slider.props.onChange(zoom);
        },
        sketchpadDropLinkMouseUp: ev => {
          this.addModuleMenu.show(ev);
        }
      }
    );
  }
  _doAddModule(dragModuleInfo, ev) {
    const { strategy } = this.props;
    let viewbox = this.sketchpad.viewbox,
      offset = $(this.refs.sketchpad).offset();
    let id = undefined;
    if (dragModuleInfo) {
      //新增
      id = ObjectId();
      let clientX = (ev.clientX - offset.left) / viewbox.zoom,
        clientY = (ev.clientY - offset.top) / viewbox.zoom;
      let x = clientX - (dragModuleInfo.x || 0) + viewbox.x,
        y = clientY - (dragModuleInfo.y || 0) + viewbox.y;
      let newModule = {
        _id: id,
        name: moduleTypeNames[parseInt(dragModuleInfo.type)],
        strategyId: strategy._id,
        type: parseInt(dragModuleInfo.type),
        x: Math.round(x),
        y: Math.round(y),
        outputs: [],
        options: dragModuleInfo.option
      };

      this.sketchpad.addModule(newModule);
      this.props.updateModule(this.sketchpad.getInfo(), ['addModule']);
    }
    return id;
  }
  _doScale(v) {
    let zoom = parseFloat(Math.min(2, Math.max(0.2, v)).toFixed(1));
    //调用组件内部state 风险
    this.refs.slider.setState({ renderedValue: zoom, value: zoom });
    this.refs.slider.props.onChange(zoom);
  }
  _doDelete() {
    //删除
    const { strategy } = this.props;
    let viewbox = this.sketchpad.viewbox,
      offset = $(this.refs.sketchpad).offset();
    let removeModuleIds = this.sketchpad.removeModule(),
      removeLinkIds = this.sketchpad.removeLink();
    let propNames = [];
    if (removeModuleIds.length > 0) {
      propNames.push('removeModule');
    }
    if (removeLinkIds.length > 0) {
      propNames.push('removeLink');
    }

    this.props.updateModule(this.sketchpad.getInfo(), propNames);
  }
  _doCopy() {
    //复制
    const { strategy } = this.props;
    let viewbox = this.sketchpad.viewbox,
      offset = $(this.refs.sketchpad).offset();
    let copyModuleInfos = this.sketchpad.copyModule();
    window.sessionStorage.setItem(
      'strategyV2CopyInfos',
      JSON.stringify({
        modules: copyModuleInfos,
        lastStrategyId: strategy._id,
        count: 0
      })
    );
  }
  _doPaste(eX, eY) {
    //粘贴
    const { strategy } = this.props;
    let viewbox = this.sketchpad.viewbox,
      offset = $(this.refs.sketchpad).offset();
    let strategyV2CopyInfos = window.sessionStorage.getItem(
      'strategyV2CopyInfos'
    );
    if (!strategyV2CopyInfos) {
      return;
    }
    let copyInfos = JSON.parse(strategyV2CopyInfos),
      copyModuleInfos = copyInfos.modules,
      count = copyInfos.lastStrategyId == strategy._id ? copyInfos.count : 0;

    let minX = Math.min(...copyModuleInfos.map(v => v.x)),
      minY = Math.min(...copyModuleInfos.map(v => v.y));
    let clientX =
        (eX != undefined ? eX - offset.left : count * 10 + 10) / viewbox.zoom,
      clientY =
        (eY != undefined ? eY - offset.top : count * 10 + 10) / viewbox.zoom;
    let x = clientX + viewbox.x,
      y = clientY + viewbox.y;
    let idDict = {};
    copyModuleInfos.forEach(m => {
      idDict[m._id] = ObjectId();
    });
    let oldIdsSet = new Set(Object.keys(idDict));
    copyModuleInfos.forEach(m => {
      m._id = idDict[m._id];
      m.strategyId = strategy._id;
      m.x = Math.round(m.x - minX + x);
      m.y = Math.round(m.y - minY + y);
      m.outputs = m.outputs
        .filter(v => oldIdsSet.has(v._id))
        .map(v => Object.assign({}, v, { _id: idDict[v._id] }));
      this.sketchpad.addModule(m);
    });
    copyModuleInfos.forEach(m => {
      this.sketchpad.addLink(m);
    });
    this.props.updateModule(this.sketchpad.getInfo(), ['addModule']);

    copyInfos.lastStrategyId = strategy._id;
    copyInfos.count = eX != undefined ? count : count + 1;
    window.sessionStorage.setItem(
      'strategyV2CopyInfos',
      JSON.stringify(copyInfos)
    );
  }
  render() {
    return (
      <div className={css['sketchpadWrap']}>
        <div
          ref="sketchpad"
          id="sketchpad"
          style={{ width: '100%', height: '100%' }}
          onDrop={this._onDrop.bind(this)}
          onDragOver={this._onDragover.bind(this)}
          onContextMenu={preventFn}
          onMouseDown={this._onStageMouseDown}
          onMouseUp={this._onStageMouseUp}
          onWheel={this._onScaleWheel}
        />
        <div className={css['sliderWrap']} onWheel={this._onScaleWheel}>
          <Slider
            ref={'slider'}
            label={this.props.i18n.ZOOM}
            min={0.2}
            max={2}
            step={0.2}
            defaultValue={1}
            showValue={true}
            vertical={true}
            onChange={value => {
              this.sketchpad && this.sketchpad.scaleTo(value);
            }}
          />
        </div>
      </div>
    );
  }
}

PainterPanel.propTypes = {};

export default PainterPanel;

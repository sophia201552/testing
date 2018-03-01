import SVG from './elements/svg-module.js';
import SVGIntersections from 'svg.intersections.js';
import $ from 'jquery';
import I from 'seamless-immutable';
import ObjectId from '../common/objectId.js';
import { moduleTypes, moduleTypeNames } from '@beopcloud/StrategyV2-Engine/src/enum';
import moduleIconConfig from '../common/moduleIconConfig.js';

class Sketchpad {
  constructor(contain, option, action) {
    const { id } = option;
    this.contain = contain;
    this.option = option;
    this.action = action;
    this.draw = SVG(id).size('100%', '100%');
    this.viewbox = {
      x: 0,
      y: 0,
      width: this.draw.viewbox().width,
      height: this.draw.viewbox().height,
      zoom: 1
    };
    this.offset = {
      x: 0,
      y: 0
    };
    this.linkGroup = this.draw.group().id('linkGroup');
    this.moduleGroup = this.draw.group().id('moduleGroup');
    this.markGroup = this.draw.group().id('markGroup');
    this._init();
    if (option.isFirstLoadData) {
      this._fix();//页面缩放居中
    } else if (option.lastViewInfo) {
      this._reFix();//回到上一次的状态
    }
  }
  _init() {
    const { data = [] } = this.option;
    data.forEach(info => {
      info = I.asMutable(info);
      this._createModule(info);
    });
    data.forEach(info => {
      info = I.asMutable(info);
      this._createLink(info);
    });
    // data.modules.forEach(module => {
    //   this.moduleMap[module.id] = new ModuleCreate(this.moduleGroup, module);
    // });
    // Object.keys(this.moduleMap).forEach(id => {
    //   this.moduleMap[id].setOutputModules(this.moduleMap);
    //   this.moduleMap[id].createLine(this.linkGroup);
    // });
  }
  _fix() {
    const { data = [] } = this.option;
    if (data.length < 1) {
      return;
    }
    let xArr = [],
      yArr = [],
      xwArr = [],
      yhArr = [];
    data.forEach(v => {
      let target = SVG.get(v._id);
      xArr.push(v.x);
      yArr.push(v.y);
      xwArr.push(v.x + target.width());
      yhArr.push(v.y + target.height());
    });
    let minX = Math.min(...xArr),
      minY = Math.min(...yArr),
      maxX = Math.max(...xwArr),
      maxY = Math.max(...yhArr);
    let mWidth = maxX - minX,
      mHieght = maxY - minY,
      mCX = mWidth / 2 + minX,
      mCY = mHieght / 2 + minY;
    let dx = 0,
      dy = 0,
      cx = this.viewbox.width / 2,
      cy = this.viewbox.height / 2;
    if (this.viewbox.width >= mWidth && this.viewbox.height >= mHieght) {
      dx = cx - mCX + this.viewbox.x;
      dy = cy - mCY + this.viewbox.y;
      this.moveTo(-dx * this.viewbox.zoom, -dy * this.viewbox.zoom);
    } else {
      let isChanged = this.scaleTo('-', false);
      if (isChanged) {
        this._fix();
      }
    }
  }
  _reFix() {
    let lastViewInfo = this.option.lastViewInfo;
    let count = 0;
    const setZoom = ()=>{
      count++;
      let viewInfo = this.draw.viewbox();
      let isChanged = false;
      if (viewInfo.zoom.toFixed(1) > lastViewInfo.zoom.toFixed(1)) {
        isChanged = this.scaleTo('-', false);
      } else if (viewInfo.zoom.toFixed(1) < lastViewInfo.zoom.toFixed(1)) {
        isChanged = this.scaleTo('+', false);
      }
      if(isChanged && count<10){
        setZoom();
      } 
    }
    setZoom();
    let viewInfo = this.draw.viewbox();
    if (viewInfo.x != lastViewInfo.x || viewInfo.y != lastViewInfo.y) {
      this.moveTo((lastViewInfo.x - viewInfo.x)*viewInfo.zoom, (lastViewInfo.y - viewInfo.y)*viewInfo.zoom);
    }
    
  }
  _createModule(info) {
    const { type } = info;
    let shapeColor = 'red',
      shapeOpacity = 0.3,
      fontsize = 14,
      shapeH = 3 * fontsize,
      shapeRadius = 3,
      iconW = 44,
      lineColor = '#687296',
      pointColor = '#687296',
      typeText = '未定义的类型',
      desc = '',
      isNeedLeftPath = true,
      isNeedRightPath = true,
      icon = `icon-${moduleIconConfig[type]}`,
      iconColor = '#687296';
    switch (type) {
      case moduleTypes['FUNC_LOGIC_BOOLEAN']:
        desc = typeText = moduleTypeNames[moduleTypes['FUNC_LOGIC_BOOLEAN']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(151,67,217)';
        break;
      case moduleTypes['DEEP_STUDY']:
        desc = typeText = moduleTypeNames[moduleTypes['DEEP_STUDY']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(151,67,217)';
        break;
      case moduleTypes['EXEC_ANLS_PREDICTION']:
        desc = typeText = moduleTypeNames[moduleTypes['EXEC_ANLS_PREDICTION']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(189,67,134)';
        break;
      case moduleTypes['PDT_SVM']:
        desc = typeText = moduleTypeNames[moduleTypes['PDT_SVM']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(252, 128, 128)';
        break;
      case moduleTypes['SCATTER']:
        desc = typeText = moduleTypeNames[moduleTypes['SCATTER']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(43,193,191)';
        break;
      case moduleTypes['VSL_CHART']:
        desc = typeText = moduleTypeNames[moduleTypes['VSL_CHART']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(43,193,191)';
        break;
      case moduleTypes['EXEC_ANLS_CORRELATION']:
        desc = typeText = moduleTypeNames[moduleTypes['EXEC_ANLS_CORRELATION']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(189,67,134)';
        break;
      case moduleTypes['EXEC_ANLS_PREDICTION']:
        desc = typeText = moduleTypeNames[moduleTypes['EXEC_ANLS_PREDICTION']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(189,67,134)';
        break;
      case moduleTypes['EXEC_OUTLIER_DETECTION']:
        desc = typeText =
          moduleTypeNames[moduleTypes['EXEC_OUTLIER_DETECTION']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
      case moduleTypes['OP_DIAGNOSIS_ITEM']:
        desc = typeText = moduleTypeNames[moduleTypes['OP_DIAGNOSIS_ITEM']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(0,167,207)';
        break;
      case moduleTypes['EXEC_TEST']:
        desc = typeText = moduleTypeNames[moduleTypes['EXEC_TEST']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(189,67,134)';
        break;
      case moduleTypes['CLT_DB_SCAN']:
        desc = typeText = moduleTypeNames[moduleTypes['CLT_DB_SCAN']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(189,67,134)';
        break;

      case moduleTypes['CON_FILE_EXCEL']:
        desc = typeText = moduleTypeNames[moduleTypes['CON_FILE_EXCEL']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(92,104,238)';
        break;
      case moduleTypes['EXEC_PYTHON']:
        desc = typeText = moduleTypeNames[moduleTypes['EXEC_PYTHON']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(189,67,134)';
        break;
      case moduleTypes['CON_DATASOURCE']:
        desc = typeText = moduleTypeNames[moduleTypes['CON_DATASOURCE']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(92,104,238)';
        break;
      case moduleTypes['PRE_TRANS_FUZZY']:
        desc = typeText = moduleTypeNames[moduleTypes['PRE_TRANS_FUZZY']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
      case moduleTypes['PRE_DATA_DEDUPLICATION']:
        desc = typeText =
          moduleTypeNames[moduleTypes['PRE_DATA_DEDUPLICATION']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
      case moduleTypes['PRE_DATA_COMPLEMENT']:
        desc = typeText = moduleTypeNames[moduleTypes['PRE_DATA_COMPLEMENT']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
      case moduleTypes['PRE_DATA_NORMALIZATION']:
        desc = typeText =
          moduleTypeNames[moduleTypes['PRE_DATA_NORMALIZATION']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
      case moduleTypes['PRE_DATA_MONITORING']:
        desc = typeText = moduleTypeNames[moduleTypes['PRE_DATA_MONITORING']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
      case moduleTypes['PCA']:
        desc = typeText = moduleTypeNames[moduleTypes['PCA']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
      case moduleTypes['FEATURE_SELECTION']:
        desc = typeText = moduleTypeNames[moduleTypes['FEATURE_SELECTION']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
      case moduleTypes['PRE_DATA_EVALUATE']:
        desc = typeText = moduleTypeNames[moduleTypes['PRE_DATA_EVALUATE']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(189,67,134)';
        break;
      case moduleTypes['PRE_DATA_SORTING']:
        desc = typeText = moduleTypeNames[moduleTypes['PRE_DATA_SORTING']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
      case moduleTypes['PRE_DATA_EXPORT']:
        desc = typeText = moduleTypeNames[moduleTypes['PRE_DATA_EXPORT']];
        pointColor = lineColor = shapeColor = iconColor = 'rgb(238,167,49)';
        break;
    }
    const {
      moduleDbClick,
      moduleEnter,
      moduleLeave,
      moduleUpdate,
      sketchpadDropLinkMouseUp
    } = this.action;
    this.moduleGroup.module(
      info,
      {
        shapeColor,
        shapeOpacity,
        fontsize,
        shapeH,
        shapeRadius,
        iconW,
        lineColor,
        desc,
        typeText,
        isNeedLeftPath,
        isNeedRightPath,
        pointColor,
        icon,
        iconColor,
        //actions
        moduleDbClick,
        moduleEnter,
        moduleLeave,
        moduleUpdate,
        sketchpadDropLinkMouseUp
      },
      this
    );
  }
  _createLink(info) {
    const { _id, outputs = [] } = info;
    outputs.forEach(output => {
      SVG.get(_id).linkTo(SVG.get(output._id), true);
    });
  }
  scaleTo(zoom, isAnimate = true) {
    let isChanged = false;
    if (zoom == '+') {
      zoom = Math.min(this.viewbox.zoom + 0.2, 2);
      this.action.sketchpadScale(parseFloat(zoom.toFixed(1)));
    }
    if (zoom == '-') {
      zoom = Math.max(this.viewbox.zoom - 0.2, 0.2);
      this.action.sketchpadScale(parseFloat(zoom.toFixed(1)));
    }
    if (zoom != this.viewbox.zoom) {
      isChanged = true;
    }
    let lastViewbox = this.draw.viewbox();
    let height = lastViewbox.height * lastViewbox.zoom,
      width = lastViewbox.width * lastViewbox.zoom,
      x = width * (zoom - 1) / 2 / zoom + this.offset.x,
      y = height * (zoom - 1) / 2 / zoom + this.offset.y;
    if (isAnimate) {
      this.draw
        .stop()
        .animate(200)
        .viewbox(x, y, width / zoom, height / zoom);
    } else {
      this.draw.viewbox(x, y, width / zoom, height / zoom);
    }

    this.viewbox.zoom = zoom;
    this.viewbox.x = x;
    this.viewbox.y = y;
    this.viewbox.width = width / zoom;
    this.viewbox.height = height / zoom;
    return isChanged;
  }
  moveTo(dx, dy) {
    let viewbox = this.draw.viewbox(),
      viewboxX = viewbox.x,
      viewboxY = viewbox.y,
      zoom = viewbox.zoom;
    let x = viewboxX + dx / zoom,
      y = viewboxY + dy / zoom;
    this.draw.viewbox(Object.assign({}, viewbox, { x, y }));
    this.viewbox.x = x;
    this.viewbox.y = y;
    this.offset.x += dx / zoom;
    this.offset.y += dy / zoom;
  }
  addModule(info) {
    this.option.data.push(info);
    this._createModule(info);
  }
  addLink(info) {
    this._createLink(info);
  }
  removeModule() {
    let targets = this.moduleGroup.select('.module.selected');
    let ids = targets.members.map(v => v.id());
    targets.fire('remove');
    this.option.data = this.option.data.filter(v => ids.indexOf(v._id) < 0);
    return ids;
  }
  removeLink() {
    let targets = this.linkGroup.select('.avatarLine.selected');
    let ids = targets.members.map(v => v.id());
    targets.fire('remove');
    return ids;
  }
  copyModule() {
    let targets = this.moduleGroup.select('.module.selected');
    let idsSet = new Set(targets.members.map(v => v.id()));
    return this.option.data.filter(v => idsSet.has(v._id));
  }
  selectModule(ids) {
    //清除选中
    this.moduleGroup.select('.module.selected').fire('removeSelected');
    this.linkGroup.select('.avatarLine.selected').fire('removeSelected');
    ids.forEach(id => {
      SVG.get(id).fire('selected');
    });
  }
  getInfo() {
    let rs = [];
    this.moduleGroup.select('.module').each((i, modules) => {
      rs.push(modules[i].customInfo);
    });
    return rs;
  }
  updateOption(option) {
    this.option = Object.assign(this.option, option);
  }
  _rectToLinePos(x, y, w, h) {
    return [
      { x1: x, y1: y, x2: x + w, y2: y },

      {
        x1: x + w,
        y1: y,
        x2: x + w,
        y2: y + h
      },
      {
        x1: x + w,
        y1: y + h,
        x2: x,
        y2: y + h
      },
      { x1: x, y1: y + h, x2: x, y2: y }
    ];
  }
  isInModule(x, y) {
    let rs = false;
    this.moduleGroup.select('.module').members.some(el => {
      let ex = x - el.x(),
        ey = y - el.y();
      if (
        el.customElements.rect.inside(ex, ey) ||
        el.customElements.lDropArea.inside(ex, ey) ||
        el.customElements.rDropArea.inside(ex, ey)
      ) {
        rs = el.id();
        return true;
      } else {
        return false;
      }
    });
    return rs;
  }
  isInLink(x, y) {
    let r = 5;
    let targetLinePos = this._rectToLinePos(x - r / 2, y - r / 2, r, r);
    return this.linkGroup.select('.avatarLine').members.some(el => {
      return targetLinePos.some(
        v => SVGIntersections.path_linePos(el, v).length > 0
      );
    });
  }
  createSelectGroup(x, y) {
    let isInModule = this.isInModule(x, y);
    let isInLines = false;
    if (!isInModule) {
      isInLines = this.isInLink(x, y);
    }
    if (isInModule || isInLines) {
      return false;
    }
    this.markGroup
      .rect()
      .id('selectGroup')
      .move(x, y)
      .size(1, 1)
      .stroke({
        color: 'rgba(15, 184, 249, 1)',
        width: 1,
        linecap: 'round',
        linejoin: 'round'
      })
      .fill('rgba(15, 184, 249, .1)')
      .data('startPos', { x, y });

    //清除选中
    this.moduleGroup.select('.module.selected').fire('removeSelected');
    this.linkGroup.select('.avatarLine.selected').fire('removeSelected');
    return true;
  }
  updateSelectGroup(dx, dy) {
    if (dx == 0) {
      dx = 1;
    }
    if (dy == 0) {
      dy = 1;
    }
    let viewbox = this.draw.viewbox(),
      zoom = viewbox.zoom,
      target = SVG.get('selectGroup'),
      startPos = target.data('startPos');
    let width = dx / zoom,
      height = dy / zoom;
    if (width < 0) {
      width = -width;
      target.x(startPos.x - width);
    }
    if (height < 0) {
      height = -height;
      target.y(startPos.y - height);
    }
    target.size(width, height);
  }
  removeSelectGroup() {
    let target = SVG.get('selectGroup'),
      moduleGroup = SVG.get('moduleGroup'),
      linkGroup = SVG.get('linkGroup'),
      modules = moduleGroup.select('.module').members,
      lines = linkGroup.select('.avatarLine').members;
    let targetX = target.x(),
      targetY = target.y(),
      targetW = target.width(),
      targetH = target.height(),
      targetMX = targetX + targetW,
      targetMY = targetY + targetH,
      targetLinePos = this._rectToLinePos(targetX, targetY, targetW, targetH);
    let selectedModules = modules.filter(module => {
        let x = module.x(),
          y = module.y(),
          width = module.width(),
          height = module.height();
        let mX = x + width,
          mY = y + height;
        if(mX<targetX||y>targetMY||x>targetMX||mY<targetY){//简单筛选 速度优化
          return false;
        }
        let pointsArr = [
            [x, y],
            [x, y + height],
            [x + width, y],
            [x + width, y + height]
          ],
          moduleLinePos = this._rectToLinePos(x, y, width, height);
        return (
          pointsArr.some(v => target.inside(...v)) ||
          moduleLinePos.some(v =>
            targetLinePos.some(v2 => SVGIntersections.linePos_linePos(v, v2))
          )
        );
      }),
      selectedLines = lines.filter(line => {
        let x = line.x(),
          y = line.y(),
          width = line.width(),
          height = line.height();
        let mX = x + width,
          mY = y + height;
        let pointsArr = [[x, y], [x + width, y + height]];
        if(mX<targetX||y>targetMY||x>targetMX||mY<targetY){//简单筛选 速度优化
          return false;
        }
        if(mX>=targetX && mX<=targetMX && x>=targetX && x<=targetMX && y>=targetY && y<=targetMY && mY>=targetY && mY<=targetMY ){//判断包裹
          return true;
        }
        return (
          targetLinePos.some(
            v => SVGIntersections.path_linePos(line, v).length > 0
          )
        );
      });
    target.remove();
    selectedModules.forEach(m => {
      m.fire('selected');
    });
    selectedLines.forEach(l => {
      l.fire('selected');
    });
  }
  clear() {
    this.draw.remove();
  }
  getModuleById(id) {
    return SVG.get(id);
  }
  getDrawViewBox() {
    return this.draw.viewbox();
  }
}
export default Sketchpad;

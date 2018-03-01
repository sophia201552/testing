/**
 * DataSource 模块视图层
 */
import SVG from 'svg.js';
import I from 'seamless-immutable';
import 'svg.draggy.js';
const getDetectZoom = () => {
  let ratio = 1,
    screen = window.screen, //有关用户屏幕的信息
    ua = navigator.userAgent.toLowerCase(); //声明了浏览器用于 HTTP 请求的用户代理头的值
  if (~ua.indexOf('msie')) {
    //IE浏览器
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI; //获取设备像素点比
    }
  } else if (
    window.outerWidth !== undefined &&
    window.innerWidth !== undefined
  ) {
    ratio = window.outerWidth / window.innerWidth; //屏幕宽度显示宽度比
  }
  if (ratio) {
    ratio = Math.round(ratio * 100);
  }
  // 360安全浏览器下的innerWidth包含了侧边栏的宽度
  if (ratio !== 100) {
    if (ratio >= 95 && ratio <= 105) {
      ratio = 100;
    }
  }
  return ratio;
};
const leftPadding = 10,
  dasharray = 4,
  isNeedSplitPoint = false;
let mouseEnterTarget = undefined;
SVG.module = SVG.invent({
  create: 'g',
  inherit: SVG.G,
  extend: {
    _addIcon() {
      const {
        fontsize,
        iconW,
        shapeH,
        shapeRadius,
        icon,
        iconColor
      } = this.customOption;
      let width = 1.6 * fontsize;
      this.customElements.icon = this.use(icon)
        .move(
          // shapeRadius + (iconW - width) / 2,居中
          shapeRadius + leftPadding,
          shapeRadius + (shapeH - width) / 2
        )
        .size(width, width)
        .fill(iconColor);
      return this;
    },
    _addText() {
      const {
        typeText,
        fontsize,
        iconW,
        shapeH,
        shapeRadius
      } = this.customOption;
      const wucha = 2; //误差范围
      let text = (this.customElements.text = this.plain(typeText)
        .font({
          family: 'Helvetica, Arial, Microsoft YaHei, 微软雅黑',
          size: fontsize
          // anchor: 'middle',
          // leading: '1.5em'
        })
        .fill('#111111')
        .move(iconW, (shapeH + 2 * shapeRadius - fontsize - wucha) / 2)
        .style({
          'user-select': 'none'
        }));

      this.customOption.shapeW =
        text.node.clientWidth * (getDetectZoom() / 100) -
        iconW +
        (leftPadding - wucha);
      return this;
    },
    _addRect() {
      const {
        shapeW,
        shapeH,
        shapeRadius,
        shapeColor,
        shapeOpacity
      } = this.customOption;
      let mouseDownTime,
        mouseDownPos,
        mousedownTimer,
        isDb = false;
      this.customElements.rect = this.rect(shapeW, shapeH)
        .radius(shapeRadius)
        .attr({
          fill: shapeColor,
          opacity: shapeOpacity
        })
        .move(shapeRadius, shapeRadius)
        .on('mousedown', event => {
          if (event.which == 3) {
            return;
          }
          this.draggy();
          let viewbox = this.parent()
            .parent()
            .viewbox();
          mouseDownTime = +new Date();
          mouseDownPos = {
            x: event.clientX / viewbox.zoom + viewbox.x,
            y: event.clientY / viewbox.zoom + viewbox.y
          };
        })
        .on('mouseup', event => {
          if (event.which == 3 || !this.fixed) {
            return;
          }
          this.fixed();
          let viewbox = this.parent()
            .parent()
            .viewbox();
          if (
            +new Date() - (mouseDownTime || 0) > 500 ||
            Math.abs(
              event.clientX / viewbox.zoom + viewbox.x - mouseDownPos.x
            ) > 30 ||
            Math.abs(
              event.clientY / viewbox.zoom + viewbox.y - mouseDownPos.y
            ) > 30
          ) {
            //非点击
            return;
          }
          if (mousedownTimer) {
            //双击
            isDb = true;
            clearTimeout(mousedownTimer);
            mousedownTimer = undefined;
            this.customOption.moduleDbClick(this.customInfo);
          } else {
            //单击
            mousedownTimer = setTimeout(() => {
              mousedownTimer = undefined;
            }, 500);
          }
        })
        .on('click', () => {
          if (isDb == true || +new Date() - (mouseDownTime || 0) > 500) {
            isDb = false;
            return;
          }
          let moduleGroup = SVG.get('moduleGroup'),
            linkGroup = SVG.get('linkGroup'),
            isNeedSelect = this.hasClass('selected') ? false : true;
          moduleGroup.select('.module.selected').fire('removeSelected');
          linkGroup.select('.avatarLine.selected').fire('removeSelected');
          if (isNeedSelect) {
            this.fire('selected');
          }
        })
        .on('mouseenter', event => {
          this.customOption.moduleEnter(this.customInfo);
        })
        .on('mouseleave', event => {
          this.customOption.moduleLeave(this.customInfo);
        });
      return this;
    },
    _addLeftPath() {
      const {
        shapeW,
        shapeH,
        shapeRadius,
        lineColor,
        isNeedLeftPath
      } = this.customOption;
      if (!isNeedLeftPath) {
        return this;
      }
      this.customElements.lPath = this.path(
        `M${shapeRadius} 0 A ${shapeRadius} ${shapeRadius} 0 0 0 0 ${shapeRadius} v ${shapeH} a ${shapeRadius} ${shapeRadius} 0 0 0 ${shapeRadius} ${shapeRadius}`
      )
        .fill('none')
        .stroke({
          color: lineColor,
          width: 1,
          linecap: 'round',
          linejoin: 'round',
          dasharray: dasharray
        });

      return this;
    },
    _addLeftDropArea() {
      const { shapeW, shapeH, shapeRadius, isNeedLeftPath } = this.customOption;
      if (!isNeedLeftPath) {
        return this;
      }
      let rectWidth = 8;
      this.customElements.lDropArea = this.rect(
        rectWidth,
        shapeH + 2 * shapeRadius
      )
        .fill('transparent')
        .radius(10)
        .opacity(0.4)
        .dx(-rectWidth / 2)
        .on('mouseenter', () => {
          mouseEnterTarget = this;
          this.customElements.lPath.attr('stroke-width', 3);
        })
        .on('mouseleave', () => {
          mouseEnterTarget = undefined;
          this.customElements.lPath.attr('stroke-width', 1);
        })
        .on('mousedown', event => {
          let line = SVG.get('pointAvatarLine');
          let viewbox = this.parent()
            .parent()
            .viewbox();
          let domOffset = $(this.customController.contain).offset();
          let x = (event.clientX - domOffset.left) / viewbox.zoom + viewbox.x,
            y = (event.clientY - domOffset.top) / viewbox.zoom + viewbox.y;
          SVG.on(window, 'mousemove', event => {
            let ex =
                (event.clientX - domOffset.left - this.x()) / viewbox.zoom +
                viewbox.x,
              ey =
                (event.clientY - domOffset.top - this.y()) / viewbox.zoom +
                viewbox.y;
            this.customElements.pointAvatar.move(ex, ey);
            this._createLine(
              (event.clientX - domOffset.left) / viewbox.zoom + viewbox.x,
              (event.clientY - domOffset.top) / viewbox.zoom + viewbox.y,
              x,
              y,
              undefined,
              undefined,
              line.id()
            );
          });
          SVG.on(window, 'mouseup', ev => {
            SVG.off(window, 'mousemove');
            SVG.off(window, 'mouseup');
            this.customElements.pointAvatar.move(0, 0);
            this._createLine(0, 0, 0, 0, undefined, undefined, line.id());
            if (mouseEnterTarget && mouseEnterTarget != this) {
              mouseEnterTarget.linkTo(this);
              this.customOption.moduleUpdate(['addLink']);
            } else if (!mouseEnterTarget) {
              ev.excessLinkTo = targetModuleId => {
                let targetModule = SVG.get(targetModuleId);
                if (!targetModule) {
                  return;
                }
                targetModule.linkTo(this);
                this.customOption.moduleUpdate(['addLink']);
              };
              this.customOption.sketchpadDropLinkMouseUp(ev);
            }
          });
        });
      return this;
    },
    _addRightPath() {
      const {
        shapeW,
        shapeH,
        shapeRadius,
        lineColor,
        isNeedRightPath
      } = this.customOption;
      if (!isNeedRightPath) {
        return this;
      }
      this.customElements.rPath = this.path(
        `M${shapeW +
          shapeRadius} 0 a ${shapeRadius} ${shapeRadius} 0 0 1 ${shapeRadius} ${shapeRadius} v${shapeH} a ${shapeRadius} ${shapeRadius} 0 0 1 -${shapeRadius} ${shapeRadius}`
      )
        .fill('none')
        .stroke({
          color: lineColor,
          width: 1,
          linecap: 'round',
          linejoin: 'round',
          dasharray: dasharray
        });

      return this;
    },
    _addRightDropArea() {
      const {
        shapeW,
        shapeH,
        shapeRadius,
        isNeedRightPath
      } = this.customOption;
      if (!isNeedRightPath) {
        return this;
      }
      let rectWidth = 8;
      this.customElements.rDropArea = this.rect(
        rectWidth,
        shapeH + 2 * shapeRadius
      )
        .fill('transparent')
        .radius(10)
        .opacity(0.4)
        .dx(shapeW + 2 * shapeRadius - rectWidth / 2)
        .on('mouseenter', () => {
          mouseEnterTarget = this;
          this.customElements.rPath.attr('stroke-width', 3);
        })
        .on('mouseleave', () => {
          mouseEnterTarget = undefined;
          this.customElements.rPath.attr('stroke-width', 1);
        })
        .on('mousedown', event => {
          let viewbox = this.parent()
            .parent()
            .viewbox();
          let line = SVG.get('pointAvatarLine');
          let domOffset = $(this.customController.contain).offset();
          let x = (event.clientX - domOffset.left) / viewbox.zoom + viewbox.x,
            y = (event.clientY - domOffset.top) / viewbox.zoom + viewbox.y;
          SVG.on(window, 'mousemove', event => {
            let ex =
                (event.clientX - domOffset.left - this.x()) / viewbox.zoom +
                viewbox.x,
              ey =
                (event.clientY - domOffset.top - this.y()) / viewbox.zoom +
                viewbox.y;
            this.customElements.pointAvatar.move(ex, ey);
            this._createLine(
              x,
              y,
              (event.clientX - domOffset.left) / viewbox.zoom + viewbox.x,
              (event.clientY - domOffset.top) / viewbox.zoom + viewbox.y,
              undefined,
              undefined,
              line.id()
            );
          });
          SVG.on(window, 'mouseup', ev => {
            SVG.off(window, 'mousemove');
            SVG.off(window, 'mouseup');
            this.customElements.pointAvatar.move(0, 0);
            this._createLine(0, 0, 0, 0, undefined, undefined, line.id());
            if (mouseEnterTarget && mouseEnterTarget != this) {
              this.linkTo(mouseEnterTarget);
              this.customOption.moduleUpdate(['addLink']);
            } else if (!mouseEnterTarget) {
              ev.excessLinkTo = targetModuleId => {
                let targetModule = SVG.get(targetModuleId);
                if (!targetModule) {
                  return;
                }
                this.linkTo(targetModule);
                this.customOption.moduleUpdate(['addLink']);
              };
              this.customOption.sketchpadDropLinkMouseUp(ev);
            }
          });
        });
      return this;
    },
    _addPointAvatar() {
      let target = SVG.get('pointAvatarLine');
      if (!target) {
        this._createLine(0, 0, 0, 0, undefined, undefined, 'pointAvatarLine');
      }

      this.customElements.pointAvatar = this.circle(4).fill('transparent');
      return this;
    },
    _addOutPoint(targetId) {
      const {
        shapeW,
        shapeH,
        shapeRadius,
        pointColor,
        fontsize
      } = this.customOption;
      this.customElements.rPath &&
        this.customElements.rPath.stroke({
          dasharray: 0
        });
      this.customElements.outPoint = this.customElements.outPoint || {};
      this.customOption.outPoint = this.customOption.outPoint || {};
      let outPointR = 4,
        inPointH = fontsize / 2,
        inPointW = inPointH / 2,
        x = 2 * shapeRadius + shapeW,
        y = (2 * shapeRadius + shapeH) / 2;

      this.customOption.outPoint[targetId] = { x, y };
      if (isNeedSplitPoint) {
        this.customElements.outPoint[targetId] = this.circle(outPointR)
          .cx(x)
          .cy(y)
          .fill(pointColor);
        this._updateOutPoint();
      } else {
        this.customElements.outPoint[targetId] = this.rect()
          .x(x - inPointW / 2)
          .y(y - inPointH / 2)
          .size(inPointW, inPointH)
          .fill(pointColor);
      }

      return this;
    },
    _addInPoint(fromId) {
      const {
        shapeW,
        shapeH,
        shapeRadius,
        pointColor,
        fontsize
      } = this.customOption;
      this.customElements.lPath &&
        this.customElements.lPath.stroke({
          dasharray: 0
        });
      this.customElements.inPoint = this.customElements.inPoint || {};
      this.customOption.inPoint = this.customOption.inPoint || {};
      let inPointR = 4,
        inPointH = fontsize / 2,
        inPointW = inPointH / 2,
        x = 0,
        y = (2 * shapeRadius + shapeH) / 2;
      this.customOption.inPoint[fromId] = { x, y };
      if (isNeedSplitPoint) {
        this.customElements.inPoint[fromId] = this.circle(inPointR)
          .cx(x)
          .cy(y)
          .fill(pointColor);
        this._updateInPoint();
      } else {
        this.customElements.inPoint[fromId] = this.rect()
          .x(x - inPointW / 2)
          .y(y - inPointH / 2)
          .size(inPointW, inPointH)
          .fill(pointColor);
      }

      return this;
    },
    _updateOutPoint() {
      const {
        shapeW,
        shapeH,
        shapeRadius,
        outPoint = {},
        inPoint = {}
      } = this.customOption;
      //输出点排序
      let targetIdArr = Object.keys(outPoint);
      if (targetIdArr.length == 1) {
        let x = 2 * shapeRadius + shapeW,
          y = (2 * shapeRadius + shapeH) / 2;

        outPoint[targetIdArr[0]] = { x, y };
        this.customElements.outPoint[targetIdArr[0]].cx(x).cy(y);
      } else if (targetIdArr.length > 0) {
        let minDH = Math.min(shapeH / (targetIdArr.length - 1), shapeH / 4),
          height = (targetIdArr.length - 1) * minDH,
          startY = (shapeH - height) / 2 + shapeRadius;
        targetIdArr.sort((id1, id2) => {
          let target1 = SVG.get(id1),
            target2 = SVG.get(id2),
            y1 = target1.y() + target1.height() / 2,
            y2 = target2.y() + target2.height() / 2;
          return y1 - y2;
        });
        targetIdArr.forEach((targetId, i) => {
          let x = 2 * shapeRadius + shapeW,
            y = startY + i * minDH;

          outPoint[targetId] = { x, y };
          this.customElements.outPoint[targetId].cx(x).cy(y);
        });
      }
      this._updateLines();
      return this;
    },
    _updateInPoint() {
      const {
        shapeW,
        shapeH,
        shapeRadius,
        outPoint = {},
        inPoint = {}
      } = this.customOption;
      //输入点排序
      let fromIdArr = Object.keys(inPoint);

      if (fromIdArr.length == 1) {
        let x = 0,
          y = (2 * shapeRadius + shapeH) / 2;

        inPoint[fromIdArr[0]] = { x, y };
        this.customElements.inPoint[fromIdArr[0]].cx(x).cy(y);
      } else if (fromIdArr.length > 0) {
        let minDH = Math.min(shapeH / (fromIdArr.length - 1), shapeH / 4),
          height = (fromIdArr.length - 1) * minDH,
          startY = (shapeH - height) / 2 + shapeRadius;
        fromIdArr.sort((id1, id2) => {
          let target1 = SVG.get(id1),
            target2 = SVG.get(id2),
            y1 = target1.y() + target1.height() / 2,
            y2 = target2.y() + target2.height() / 2;
          return y1 - y2;
        });
        fromIdArr.forEach((targetId, i) => {
          let x = 0,
            y = startY + i * minDH;

          inPoint[targetId] = { x, y };
          this.customElements.inPoint[targetId].cx(x).cy(y);
        });
      }
      this._updateLines();
      return this;
    },
    _addElements(info, option, controller) {
      this.customInfo = info;
      this.customElements = {};
      this.customOption = Object.assign({}, option);
      this.customController = controller;
      this._addIcon()
        ._addText()
        ._addRect()
        ._addLeftPath()
        ._addRightPath()
        ._addPointAvatar()
        ._addLeftDropArea()
        ._addRightDropArea();
      let { shapeRadius, shapeH, shapeW } = this.customOption;
      this.width(2 * shapeRadius + shapeW);
      this.height(2 * shapeRadius + shapeH);
      return this;
    },
    _addEvents() {
      this.on('dragmove', function(ev) {
        if (isNeedSplitPoint) {
          //更新线段与inpoint outpoint位置
          let linkGroup = SVG.get('linkGroup');
          let className = `line_${this.id()}`;
          let lines = linkGroup.select(`.${className}`);
          lines.each((i, l) => {
            let classArr = l[i].classes(),
              index = classArr.findIndex(v => v == className),
              toModuleId = classArr[1].split('_')[1],
              fromModuleId = classArr[0].split('_')[1];
            if (index !== 0) {
              //inPoint
              SVG.get(fromModuleId)._updateOutPoint();
            } else {
              //outPoint
              SVG.get(toModuleId)._updateInPoint();
            }
          });
        } else {
          this._updateLines();
        }

        this.customInfo.x = this.x();
        this.customInfo.y = this.y();
        this.customOption.moduleUpdate(['moveModule']);
        //超出界限缩放
        //this.parent().parent().viewbox() 有200延迟
        let viewbox = this.customController.viewbox;
        if (
          viewbox.y > this.customInfo.y ||
          viewbox.x > this.customInfo.x ||
          viewbox.y + viewbox.height - this.height() < this.customInfo.y ||
          viewbox.x + viewbox.width - this.width() < this.customInfo.x
        ) {
          this.customController.scaleTo('-');
        }
      });
      this.on('removeSelected', () => {
        const { shapeW, shapeH, shapeRadius } = this.customOption;
        this.removeClass('selected');
        if (this.customElements.pathTop) {
          this.customElements.pathTop
            .animate(100)
            .plot(shapeRadius + shapeW / 2, 0, shapeRadius + shapeW / 2, 0)
            .after(function() {
              this.remove();
            });
          this.customElements.pathTop = undefined;
        }
        if (this.customElements.pathBottom) {
          this.customElements.pathBottom
            .animate(100)
            .plot(
              shapeRadius + shapeW / 2,
              2 * shapeRadius + shapeH,
              shapeRadius + shapeW / 2,
              2 * shapeRadius + shapeH
            )
            .after(function() {
              this.remove();
            });
          this.customElements.pathBottom = undefined;
        }
      });
      this.on('selected', () => {
        this.addClass('selected');
        const { shapeW, shapeH, shapeRadius, lineColor } = this.customOption;
        this.customElements.pathTop = this.line(
          shapeRadius + shapeW / 2,
          0,
          shapeRadius + shapeW / 2,
          0
        )
          .stroke({ color: lineColor, width: 1 })
          .fill(lineColor);
        this.customElements.pathTop
          .animate(100)
          .plot(shapeRadius, 0, shapeW + shapeRadius, 0);
        this.customElements.pathBottom = this.line(
          shapeRadius + shapeW / 2,
          2 * shapeRadius + shapeH,
          shapeRadius + shapeW / 2,
          2 * shapeRadius + shapeH
        ).stroke({ color: lineColor, width: 1 });
        this.customElements.pathBottom
          .animate(100)
          .plot(
            shapeRadius,
            2 * shapeRadius + shapeH,
            shapeW + shapeRadius,
            2 * shapeRadius + shapeH
          );
      });
      this.on('remove', () => {
        this.parent()
          .select('.module')
          .fire('removeLink', this);
        this.customElements.rect.fire('mouseleave');
        this.remove();
      });
      this.on('removeLink', e => {
        if (e.detail == this) {
          this.customInfo.outputs.forEach(output => {
            this.removeLink(SVG.get(output._id));
          });
        } else {
          this.removeLink(e.detail);
        }
      });
      return this;
    },
    _updateLines() {
      let linkGroup = SVG.get('linkGroup');
      let className = `line_${this.id()}`;
      let lines = linkGroup.select(`.${className}`);

      lines.each((i, l) => {
        let classArr = l[i].classes(),
          index = classArr.findIndex(v => v == className),
          toModuleId = classArr[1].split('_')[1],
          fromModuleId = classArr[0].split('_')[1];
        let x1, y1, isInpoint, x2, y2;
        if (index !== 0) {
          //inPoint
          isInpoint = true;
          x1 = this.x() + this.customOption.inPoint[fromModuleId].x;
          y1 = this.y() + this.customOption.inPoint[fromModuleId].y;
        } else {
          //outPoint
          isInpoint = false;
          x1 = this.x() + this.customOption.outPoint[toModuleId].x;
          y1 = this.y() + this.customOption.outPoint[toModuleId].y;
        }
        let targetId = classArr[1 - index].replace('line_', ''),
          targetEl = SVG.get(targetId);
        if (isInpoint) {
          x2 = targetEl.x() + targetEl.customOption.outPoint[toModuleId].x;
          y2 = targetEl.y() + targetEl.customOption.outPoint[toModuleId].y;
          this._createLine(x2, y2, x1, y1, undefined, undefined, l[i].id());
        } else {
          x2 = targetEl.x() + targetEl.customOption.inPoint[fromModuleId].x;
          y2 = targetEl.y() + targetEl.customOption.inPoint[fromModuleId].y;
          this._createLine(x1, y1, x2, y2, undefined, undefined, l[i].id());
        }
      });
      return this;
    },
    _createLine(x1, y1, x2, y2, id1, id2, id, isAnimate = false) {
      let linkGroup = SVG.get('linkGroup'),
        target = SVG.get(id || `line_${id1}_${id2}`);
      /*
        计算贝赛尔曲线控制点逻辑
        在起点到中点的线段上画中垂线 中垂线与起点横轴交点为贝赛尔曲线控制点 

        变量说明
        x1 y1           起始点坐标
        x2 y2           终点坐标
        radian          1弧度
        centerX centerY 起点到终点的中点坐标（因为两个弧线对称 只需画起点到中点弧线）
        dx dy           起点到终点的横轴距离 纵轴距离
        angle           起点到终点直线与纵轴之间的角度
        distance_4      起点到终点直线的四分之一距离 即 起始点到中点的中点的距离（与angle cos sin可算出其它必要长度）
        controlPointX   贝赛尔曲线控制点横坐标
        
        path说明
        M x y           起始点移动到xy
        Q x1 y1, x2, y2 二次贝塞尔曲线 x1 y1为控制点坐标 用来确定起点和终点的曲线斜率 x2 y2 终点坐标
        T x1 y1         接在二次贝塞尔曲线Q后面  根据Q的控制点 推算出对称的另一个控制点 x1 y1 终点坐标
      */

      let radian = 2 * Math.PI / 360,
        centerX = x1 + (x2 - x1) / 2,
        centerY = y1 + (y2 - y1) / 2,
        dx = Math.abs(x2 - x1),
        dy = Math.abs(y2 - y1),
        angle = isNaN(Math.atan(dx / dy) / radian)
          ? 0
          : Math.atan(dx / dy) / radian,
        distance_4 = Math.sqrt(dx * dx + dy * dy) / 4,
        controlPointX = x1 + distance_4 / Math.sin(angle * radian),
        path = '';

      if (centerY >= y1) {
        if (angle > 45) {
          path = `M ${x1} ${y1} Q ${controlPointX} ${y1}, ${centerX} ${centerY} T ${x2} ${y2}`;
        } else {
          angle = 90 - angle;
          controlPointX = x1 + distance_4 / Math.sin(angle * radian);
          path = `M ${x1} ${y1} Q ${controlPointX} ${y1}, ${centerX} ${centerY} T ${x2} ${y2}`;
        }
      } else {
        angle = 90 - angle;
        if (angle > 45) {
          controlPointX = x1 + distance_4 / Math.sin(angle * radian);
          path = `M ${x1} ${y1} Q ${controlPointX} ${y1}, ${centerX} ${centerY} T ${x2} ${y2}`;
        } else {
          angle = 90 - angle;
          controlPointX = x1 + distance_4 / Math.sin(angle * radian);
          path = `M ${x1} ${y1} Q ${controlPointX} ${y1}, ${centerX} ${centerY} T ${x2} ${y2}`;
        }
      }
      this._createAvatarLine(id || `line_${id1}_${id2}`, path);
      if (target) {
        target.plot(path);
        return;
      }
      target = linkGroup
        .path(
          `M ${centerX} ${centerY} Q ${centerX + 0.5} ${centerY}, ${centerX +
            1} ${centerY} T ${centerX + 2} ${centerY}`
        )
        .fill('none')
        .stroke({
          color: '#ccd0df',
          width: 2,
          linecap: 'round',
          linejoin: 'round'
        })
        .opacity(1)
        .addClass(`line_${id1}`)
        .addClass(`line_${id2}`)
        .addClass('line')
        .id(id || `line_${id1}_${id2}`);
      if (isAnimate) {
        target
          .animate(200)
          .plot(path)
          .after(() => {
            this._updateLines();
          });
      } else {
        target.plot(path);
      }
    },
    _createAvatarLine(id, path) {
      let targetId = id + '_avatar';
      let linkGroup = SVG.get('linkGroup'),
        target = SVG.get(targetId);
      if (target) {
        target.plot(path);
        return;
      }
      let lineColor = 'rgba(15, 184, 249, 0)',
        activeLineColor = 'rgba(15, 184, 249, .4)';
      target = linkGroup
        .path(path)
        .fill('none')
        .stroke({
          color: lineColor,
          width: 10,
          linecap: 'round',
          linejoin: 'round'
        })
        .id(targetId)
        .addClass('avatarLine')
        .on('selected', function() {
          let orignLine = SVG.get(id);
          this.addClass('selected');
          // this.stroke({
          //   color: activeLineColor
          // });
          orignLine.attr('stroke-width', 4);
        })
        .on('removeSelected', function() {
          let orignLine = SVG.get(id);
          this.removeClass('selected');
          // this.stroke({
          //   color: lineColor
          // });
          orignLine.attr('stroke-width', 2);
        })
        .on('click', function() {
          let moduleGroup = SVG.get('moduleGroup');
          moduleGroup.select('.module.selected').fire('removeSelected');
          let isNeedAdd = this.hasClass('selected') ? false : true;
          linkGroup.select('.avatarLine').fire('removeSelected');
          if (isNeedAdd) {
            this.fire('selected');
          }
        })
        .on('remove', function() {
          let ids = this.id().split('_'),
            moduleId = ids[1],
            targetId = ids[2];
          SVG.get(moduleId).removeLink(SVG.get(targetId));
        });
    },
    linkTo(targetEl, isAnimate = false) {
      let moduleId = this.id(),
        targetId = targetEl.id();
      this._addOutPoint(targetId);
      targetEl._addInPoint(moduleId);
      let x1 = this.x() + this.customOption.outPoint[targetId].x,
        y1 = this.y() + this.customOption.outPoint[targetId].y,
        x2 = targetEl.x() + targetEl.customOption.inPoint[moduleId].x,
        y2 = targetEl.y() + targetEl.customOption.inPoint[moduleId].y;
      this._createLine(
        x1,
        y1,
        x2,
        y2,
        moduleId,
        targetId,
        undefined,
        isAnimate
      );
      if (this.customInfo.outputs.findIndex(v => v._id == targetId) == -1) {
        this.customInfo.outputs = I.asMutable(this.customInfo.outputs);
        this.customInfo.outputs.push({ _id: targetId });
      }
      return this;
    },
    removeLink(targetEl) {
      let moduleId = this.id(),
        targetId = targetEl.id();
      let target = SVG.get(`line_${moduleId}_${targetId}`),
        target_avatar = SVG.get(`line_${moduleId}_${targetId}_avatar`),
        linkGroup = SVG.get('linkGroup');
      if (target) {
        this.customInfo.outputs = I.asMutable(this.customInfo.outputs);
        this.customInfo.outputs = this.customInfo.outputs.filter(
          v => v._id != targetId
        );
        //删除输出点
        this.customElements.outPoint[targetId].remove();
        delete this.customElements.outPoint[targetId];
        delete this.customOption.outPoint[targetId];
        if (this.customInfo.outputs.length == 0) {
          this.customElements.rPath &&
            this.customElements.rPath.stroke({
              dasharray: dasharray
            });
        }
        //删除线
        target.remove();
        target_avatar.remove();
        //删除输入点
        targetEl.customElements.inPoint[moduleId].remove();
        delete targetEl.customElements.inPoint[moduleId];
        delete targetEl.customOption.inPoint[moduleId];
        if (Object.keys(targetEl.customElements.inPoint).length == 0) {
          targetEl.customElements.lPath &&
            targetEl.customElements.lPath.stroke({
              dasharray: dasharray
            });
        }
        if (isNeedSplitPoint) {
          this._updateOutPoint();
          targetEl._updateInPoint();
        }
      }
    }
  },
  construct: {
    module(info, option, controller) {
      const { _id, x, y } = info;
      return this.put(new SVG.module())
        .addClass('module')
        .id(_id)
        ._addEvents()
        ._addElements(info, option, controller)
        .move(x, y);
    }
  }
});

export default SVG;
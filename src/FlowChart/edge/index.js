import G6 from '@antv/g6';
import { edgeShapeOptions, deleteShapeOptions, textShapeOptions, rectShapeOptions } from './options'
import {EdgeGroupName} from '../index.d.ts'
import './event'

const uniqBy = (arr,key)=>{
  const result = [];
  arr.forEach( i => {
    if(!result.find(r => r[key] === i[key]))
      result.push(i)
  });
  return result;
};


G6.registerEdge('sz-edge', {
  options: edgeShapeOptions,
  drawLabel() { }, // 去除edge自带的label 使用自带的textShape
  updateLabel() { },// 去除edge自带的label 使用自带的textShape
  setState(state, value, item) {
    item.toFront()
    switch (state) {
      case 'selected': {
        this.updateShape(state, value, item)
        break;
      }
      case 'hover': {
        const currentStates = item.getStates()
        if (currentStates.indexOf('selected') !== -1) break;
        
        this.updateShape(state, value, item)
        break;
      }
      case 'hover-delete': {
        this.updateDeleteShapeState('hover', value, item)
        break;
      }
      default: break;
    }
  },
  // 更新allShape属性
  updateShape(state, value, item) {
    const { stateStyles, style } = this.options
    
    const { id, styleType } = item.getModel() 
    const group = item.getContainer()
    const keyShape = group.getFirst()
    const deleteGroup = group.findById(`${id}-${EdgeGroupName.DeleteShape}`)

    keyShape.attr(value ? stateStyles[state] : {...style, ...this.options[styleType]})
    deleteGroup[value ? 'show' : 'hide']()
  },

  // 更新deleteShape属性
  updateDeleteShapeState(state, value, item) {
    const { style, stateStyles, iconShape: iconShapeCfg } = deleteShapeOptions
    const { style: iconStyle, stateStyles: iconStateStyles} = iconShapeCfg

    const { id } = item.getModel() 
    const group = item.getContainer()
    const keyShape = group.getFirst()
    const deleteGroup = group.findById(`${id}-${EdgeGroupName.DeleteShape}`)
    const [deleteShape, iconShape] = deleteGroup.getChildren()
    // 边虚线
    keyShape.attr(value ? {lineDash: [4,2]} : {lineDash: []})
    deleteShape.attr(value ? stateStyles[state] : style)
    iconShape.attr(value ? iconStateStyles[state] : iconStyle)
  },

  draw(cfg, group) {
    const { styleType } = cfg
    const points = this.getPoints(cfg)
    const path = this.getPath(points)
    cfg.centerPoint = this.getCenterPoint(points)

    const keyShape = group.addShape('path', {
      attrs: {
        ...this.options.style,
        ...this.options[styleType],
        path,
      },
      name: this.options.name,
    });

    return keyShape;
  },
  afterDraw(cfg, group) {
    this.addTextGroup(cfg, group)
    this.addDeleteGroup(cfg, group)
  },
  afterUpdate(cfg, item) { 
    const { id } = cfg
    const points = this.getPoints(cfg)
    cfg.centerPoint = this.getCenterPoint(points)
    const { x, y } = cfg.centerPoint

    const group = item.getContainer()

    for (const groupName in EdgeGroupName) {
      const sGroup = group.findById(`${id}-${EdgeGroupName[groupName]}`)
      if (sGroup) {
        sGroup.resetMatrix()
        sGroup.move(x, y)
      }
    }
  },

  // 添加textGroup
  addTextGroup(cfg, group) {
    if (!cfg.label) return
    
    const { id, centerPoint, label, labelCfg = {}, styleType } = cfg
    const { x, y } = centerPoint
    
    const textGroup = group.addGroup({
      id: `${id}-${EdgeGroupName.TextShape}`,
      name: EdgeGroupName.TextShape
    })

    textGroup.move(x, y)

    const textShape = textGroup.addShape('text', {
      attrs: {
        ...textShapeOptions.style,
        ...textShapeOptions[styleType],
        ...labelCfg,
        text: label
      },
      name: textShapeOptions.name
    })

    const bbox = textShape.getBBox()

    const rectShape = textGroup.addShape('rect', {
      attrs: {
        ...rectShapeOptions.style,
        x: bbox.x - 4,
        y: bbox.y - 5,
        width: bbox.width + 8,
        height: bbox.height + 10
      },
      name: rectShapeOptions.name
    })

    rectShape.toBack()
  },

  // 添加删除的group
  addDeleteGroup(cfg,group) {
    const { id, centerPoint } = cfg
    const { x, y } = centerPoint
    
    const deleteGroup = group.addGroup({
      id: `${id}-${EdgeGroupName.DeleteShape}`,
      name: EdgeGroupName.DeleteShape,
    })

    deleteGroup.move(x, y)
    deleteGroup.hide()

    const { style, name, iconShape } = deleteShapeOptions
    const { style: iconStyle, name: iconName } = iconShape

    deleteGroup.addShape('circle', {
      attrs: {
        ...style,
        flowBlockId: id,
      },
      name,
    })

    deleteGroup.addShape('text', {
      attrs: {
        ...iconStyle,
        x: - iconStyle.fontSize / 2
      },
      name: iconName,
    })
  },

  getPoints(cfg) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;
    const controlPoints = this.getControlPoints(cfg);
    let points = [startPoint];
    
    if (controlPoints) {
      points = points.concat(controlPoints);
    }
    points.push(endPoint);

    return points
  },

  getCenterPoint(points) {
    const edgeLenght = points.reduce((pre, curPoint, index) => {
      if(!points[index + 1]) return pre
      const nextPoint = points[index + 1]
      const distance = Math.abs(curPoint.x - nextPoint.x + curPoint.y - nextPoint.y)
      return pre + distance
    }, 0)
    let halfEdgeLenght = edgeLenght / 2
    
    const centerPoint = points.reduce((pre, curPoint, index) => {
      if(halfEdgeLenght < 0 || !points[index + 1]) return pre
      const nextPoint = points[index + 1]
      const distanceTemp = curPoint.x - nextPoint.x + curPoint.y - nextPoint.y
      const distance = Math.abs(distanceTemp)
      
      if (halfEdgeLenght > 0 && (halfEdgeLenght -= distance) <= 0) {
        if (curPoint.x === nextPoint.x) return {x: nextPoint.x, y: nextPoint.y + halfEdgeLenght * (distanceTemp > 0 ? -1 : 1)}
        else return {x: nextPoint.x + halfEdgeLenght * (distanceTemp > 0 ? -1 : 1), y: nextPoint.y}
      }
      return pre
    }, {})
    
    return centerPoint
  },
  getPath(points){
    const path = [];
    for(let i = 0; i < points.length; i++){
      const point = points[i];
      if (i === 0) {
        path.push([ 'M', point.x, point.y ]);
      } else if(i === points.length - 1) {
        path.push([ 'L', point.x, point.y ]);
      } else {
        const prevPoint = points[i - 1];
        let nextPoint = points[i + 1];
        let cornerLen = 6; // radio
        if(Math.abs(point.y - prevPoint.y) > cornerLen || Math.abs(point.x - prevPoint.x) > cornerLen){
          if(prevPoint.x === point.x) {
            path.push(['L', point.x, point.y > prevPoint.y ? point.y - cornerLen : point.y + cornerLen]);
          } else if(prevPoint.y === point.y) {
            path.push(['L', point.x > prevPoint.x ? point.x - cornerLen : point.x + cornerLen, point.y]);
          }
        }
        const yLen = Math.abs(point.y - nextPoint.y);
        const xLen = Math.abs(point.x - nextPoint.x);
        if(yLen > 0 && yLen < cornerLen){
          cornerLen = yLen;
        }else if(xLen > 0 && xLen < cornerLen){
          cornerLen = xLen;
        }
        if(prevPoint.x !== nextPoint.x && nextPoint.x === point.x) {
          path.push([ 'Q', point.x, point.y, point.x, point.y > nextPoint.y ? point.y - cornerLen : point.y + cornerLen]);
        } else if(prevPoint.y !== nextPoint.y && nextPoint.y === point.y) {
          path.push([ 'Q', point.x, point.y, point.x > nextPoint.x ? point.x - cornerLen : point.x + cornerLen, point.y]);
        }
      }
    }

    return path;
  },
  getControlPoints(cfg) {
    if(!cfg.sourceNode){
      return cfg.controlPoints;
    }
    return this.polylineFinding(cfg.sourceNode,cfg.targetNode,cfg.startPoint,cfg.endPoint,15);
  },
  getExpandedBBox(bbox, offset) {
    return 0 === bbox.width && 0 === bbox.height ? bbox : {
      centerX: bbox.centerX,
      centerY: bbox.centerY,
      minX: bbox.minX - offset,
      minY: bbox.minY - offset,
      maxX: bbox.maxX + offset,
      maxY: bbox.maxY + offset,
      height: bbox.height + 2 * offset,
      width: bbox.width + 2 * offset,
    };
  },
  getExpandedPort(bbox, point) {
    return Math.abs(point.x - bbox.centerX) / bbox.width > Math.abs(point.y - bbox.centerY) / bbox.height
      ? { x: point.x > bbox.centerX ? bbox.maxX : bbox.minX, y: point.y }
      : { x: point.x, y: point.y > bbox.centerY ? bbox.maxY : bbox.minY };
  },
  combineBBoxes(sBBox, tBBox) {
    const minX = Math.min(sBBox.minX, tBBox.minX), minY = Math.min(sBBox.minY, tBBox.minY),
      maxX = Math.max(sBBox.maxX, tBBox.maxX), maxY = Math.max(sBBox.maxY, tBBox.maxY);
    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
      height: maxY - minY,
      width: maxX - minX,
    };
  },
  getBBoxFromVertexes(sPoint, tPoint){
    const minX = Math.min(sPoint.x,tPoint.x), maxX = Math.max(sPoint.x,tPoint.x),
      minY = Math.min(sPoint.y,tPoint.y), maxY = Math.max(sPoint.y,tPoint.y);
    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      maxX: maxX,
      maxY: maxY,
      minX: minX,
      minY: minY,
      height: maxY - minY,
      width: maxX - minX,
    };
  },
  vertexOfBBox(bbox){
    return [{ x: bbox.minX, y: bbox.minY }, { x: bbox.maxX, y: bbox.minY }, { x: bbox.maxX, y: bbox.maxY }, { x: bbox.minX, y: bbox.maxY }];
  },
  crossPointsByLineAndBBox(bbox,centerPoint){
    let crossPoints = [];
    if(!(centerPoint.x < bbox.minX || centerPoint.x > bbox.maxX))
      crossPoints = crossPoints.concat([{ x: centerPoint.x, y: bbox.minY }, { x: centerPoint.x, y: bbox.maxY }]);
    if(!(centerPoint.y < bbox.minY || centerPoint.y > bbox.maxY))
      crossPoints = crossPoints.concat([{ x: bbox.minX, y: centerPoint.y }, { x: bbox.maxX, y: centerPoint.y }]);
    return crossPoints;
  },
  getConnectablePoints(sBBox, tBBox, sPoint, tPoint){
    const lineBBox = this.getBBoxFromVertexes(sPoint, tPoint);
    const outerBBox = this.combineBBoxes(sBBox, tBBox);
    const sLineBBox = this.combineBBoxes(sBBox, lineBBox);
    const tLineBBox = this.combineBBoxes(tBBox, lineBBox);
    let points = [];
    points = points.concat(this.vertexOfBBox(sLineBBox),this.vertexOfBBox(tLineBBox),this.vertexOfBBox(outerBBox));
    const centerPoint = { x: outerBBox.centerX, y: outerBBox.centerY };
    [ outerBBox, sLineBBox, tLineBBox, lineBBox ].forEach(bbox => {
      points = points.concat(this.crossPointsByLineAndBBox(bbox, centerPoint))
    });
    
    points.push({ x: sPoint.x, y: tPoint.y });
    points.push({ x: tPoint.x, y: sPoint.y });
    return points
  },
  filterConnectablePoints(points,bbox){
    return points.filter(point => point.x <= bbox.minX || point.x >= bbox.maxX || point.y <= bbox.minY || point.y >= bbox.maxY)
  },
  AStar(points, sPoint, tPoint, sBBox, tBBox){
    const openList = [sPoint];
    const closeList = [];
    points = uniqBy(this.fillId(points),'id');
    points.push(tPoint);
    let endPoint;
    while(openList.length > 0){
      let minCostPoint;
      openList.forEach((p,i) => {
        if(!p.parent)
          p.f = 0;
        if(!minCostPoint)
          minCostPoint = p;
        if(p.f < minCostPoint.f)
          minCostPoint = p;
      });
      if(minCostPoint.x === tPoint.x && minCostPoint.y === tPoint.y) {
        endPoint = minCostPoint;
        break;
      }
      openList.splice(openList.findIndex(o => o.x === minCostPoint.x && o.y === minCostPoint.y),1);
      closeList.push(minCostPoint);
      const neighbor = points.filter(p => (p.x === minCostPoint.x || p.y === minCostPoint.y)
        && !(p.x === minCostPoint.x && p.y === minCostPoint.y)
        && !this.crossBBox([sBBox,tBBox],minCostPoint,p));
      neighbor.forEach(p => {
        const inOpen = openList.find(o => o.x === p.x && o.y === p.y);
        const currentG = this.getCost(p,minCostPoint);
        if(closeList.find(o => o.x === p.x && o.y === p.y)){

        }else if(inOpen) {
          if(p.g > currentG) {
            p.parent = minCostPoint;
            p.g = currentG;
            p.f = p.g + p.h;
          }
        }else {
          p.parent = minCostPoint;
          p.g = currentG;
          let h = this.getCost(p,tPoint);
          if(this.crossBBox([tBBox],p,tPoint)){
            h += (tBBox.width/2+tBBox.height/2); //如果穿过bbox则增加该点的预估代价为bbox周长的一半
          }
          p.h = h;
          p.f = p.g + p.h;
          openList.push(p)
        }
      });
    }
    if(endPoint){
      const result = [];
      result.push({x:endPoint.x,y:endPoint.y});
      while(endPoint.parent){
        endPoint = endPoint.parent;
        result.push({x:endPoint.x,y:endPoint.y});
      }
      return result.reverse();
    }
    return [];
  },
  crossBBox(bboxes,p1,p2){
    for(let i=0; i < bboxes.length; i++) {
      const bbox = bboxes[i];
      if (p1.x === p2.x && bbox.minX < p1.x && bbox.maxX > p1.x) {
        if (p1.y < bbox.maxY && p2.y >= bbox.maxY || p2.y < bbox.maxY && p1.y >= bbox.maxY)
          return true
      } else if (p1.y === p2.y && bbox.minY < p1.y && bbox.maxY > p1.y) {
        if (p1.x < bbox.maxX && p2.x >= bbox.maxX || p2.x < bbox.maxX && p1.x >= bbox.maxX)
          return true
      }
    }
    return false;
  },
  getCost(p1,p2){
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  },
  getPointBBox(t) {
    return { centerX: t.x, centerY: t.y, minX: t.x, minY: t.y, maxX: t.x, maxY: t.y, height: 0, width: 0 };
  },
  fillId(points) {
    points.forEach(p => {
      p.id = p.x + '-' + p.y;
    });
    return points;
  },
  polylineFinding(sNode, tNode, sPort, tPort, offset) {
    const sourceBBox = sNode && sNode.getBBox() ? sNode.getBBox() : this.getPointBBox(sPort);
    const targetBBox = tNode && tNode.getBBox() ? tNode.getBBox() : this.getPointBBox(tPort);
    const sBBox = this.getExpandedBBox(sourceBBox,offset);
    const tBBox = this.getExpandedBBox(targetBBox,offset);
    const sPoint = this.getExpandedPort(sBBox,sPort);
    const tPoint = this.getExpandedPort(tBBox,tPort);
    let points = this.getConnectablePoints(sBBox, tBBox, sPoint, tPoint);
    points = this.filterConnectablePoints(points, sBBox);
    points = this.filterConnectablePoints(points, tBBox);
    const polylinePoints = this.AStar(points, sPoint, tPoint, sBBox, tBBox);
    return polylinePoints;
  },
}, 'polyline');
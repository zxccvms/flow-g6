import G6 from '@antv/g6';
import { ShapeName, inTypeAchorPoints, outTypeAchorPoints, EdgeStyleType, UtilGroupChildrenName, EdgeType } from '../index.d.ts'
import { edgeShapeOptions ,textShapeOptions } from '../edge/options'

G6.registerBehavior('flow-block-event', {
  offset: 0.5, // 更新坐标的偏移值 g6会将更新的坐标数值 - 0.5
  getDefaultCfg() {
    return {
      multiple: true
    };
  },
  getEvents() {
    return {
      'afteradditem': 'onAfterAddNode',
      'node:mousedown': 'onNodeDown',
      'mousemove': 'onMouseMove',
      'mouseup': 'onMouseUp',
      'canvas:click': 'onCanvasClick',
      'node:click': 'onNodeClick',
      'node:mouseover': 'onNodeMouseOver',
      'node:mouseout': 'onNodeMouseOut',
      'node:drag': 'onNodeDrag',
      'node:dragend': 'onNodeDragEnd',
    };
  },

  onAfterAddNode({ item, model }) {
    if (item.getType() !== 'node') return
    // this.setFlowBlockBBoxs()
    item.setState('anchor-active', 'out')
  },
  onAfterRemoveNode(item, model) {
    this.setFlowBlockBBoxs()
  },

  onNodeDown(e) {
    this.onAnchorPointNodeDown(e)
  },
  onMouseMove(e) {
    this.updateCurrentEdge(e)
  },
  onMouseUp(e) {
    this.removeCurrentEdge()
  },


  onCanvasClick(e) {
    this.removeFlowBlockNodeSelectedState()
  },
  onNodeClick(e) {
    this.onFlowBlockShapeClick(e)

    const parent = e.target.getParent()
    if (!parent) return
    
    const name = parent.get('name')

    if (name === UtilGroupChildrenName.DeleteShapeGroup) { // 删除按钮
      this.onDeleteShapeClick(e)
    } else if (name === UtilGroupChildrenName.EditorShapeGroup) { // 编辑按钮
      this.onEditorShapeClick(e)
    }
  },
  onNodeMouseOver(e) {
    const parent = e.target.getParent()
    const name = parent.get('name')

    this.onFlowBlockShapeMouseOver(e)

    if (Object.keys(UtilGroupChildrenName).some(key =>
      UtilGroupChildrenName[key] === name)
    ) { // 删除按钮 和 编辑按钮
      this.onUtilGroupMouseOver(e)
    }
  },
  onNodeMouseOut(e) {
    const parent = e.target.getParent()
    const name = parent.get('name')

    this.onFlowBlockShapeMouseOut(e)

    if (Object.keys(UtilGroupChildrenName).some(key =>
      UtilGroupChildrenName[key] === name)
    ) { // 删除按钮 和 编辑按钮
      this.onUtilGroupMouseOut(e)
    }
  },

  onNodeDrag(e) {
    this.moveFlowBlockOnGrid(e)
    this.flowBlockAutoAlign(e)
  },

  onNodeDragEnd(e) {
    this.removeGuideEdgeX()
    this.removeGuideEdgeY()
  },

  /**
   * 节点状态设置
   */
  // 移除流程块选择的状态
  removeFlowBlockNodeSelectedState() {
    if (this.selectedNode) {
      this.selectedNode.setState('selected', false)
      this.selectedNode = null
    }
  },
  // 点击流程块keyShape
  onFlowBlockShapeClick(e) {
    const { item } = e;
    const currentStates = item.getStates()
    
    const nextSelectedState = currentStates.indexOf('selected') === -1

    this.removeFlowBlockNodeSelectedState()

    item.setState('selected', nextSelectedState)
    this.selectedNode = item
  },
  // 鼠标移入流程块keyShape
  onFlowBlockShapeMouseOver(e) {
    const { item } = e;
    
    // 连线中不触发源节点的hover状态
    if (this.currentEdge && this.currentEdge.getSource() === item) return

    item.setState('hover', true)
  },
  // 鼠标移出流程块keyShape
  onFlowBlockShapeMouseOut(e) {
    const { item } = e;
    item.setState('hover', false)
  },

  // 设置所有流程块锚点激活类型
  setFlowNodesAnchorActiveState(value) {
    this.graph.getNodes().forEach(node => node.setState('anchor-active', value))
  },

  // 点击deleteShape按钮
  onDeleteShapeClick(e) {
    const { item } = e

    this.removeFlowBlockNodeSelectedState()
    this.graph.removeItem(item)
  },

  // 点击editorShape按钮
  onEditorShapeClick(e) {
    const { item } = e
    console.log("onEditorShapeClick -> item", item)

  },

  // 鼠标移入UtiGroup
  onUtilGroupMouseOver(e) {
    const { item, target } = e
    const parent = target.getParent()
    const { name } = parent.cfg

    item.setState('hover-utilGroup', name)
  },

  // 鼠标移出UtiGroup
  onUtilGroupMouseOut(e) {
    const { item } = e

    item.setState('hover-utilGroup', false)
  },

  /**
   * 连线事件
   */

  // 鼠标左键按下锚点上的节点
  onAnchorPointNodeDown(e) {
    const graph = this.graph;
    const { item, target, x, y } = e;
    const { attrs, cfg } = target
    const { flowBlockId, anchorPointIndex, anchorPointType } = attrs
    
    // 不是锚点上的节点
    if (cfg.name !== ShapeName.AnchorPointShape) return 
    // 是in类型的节点
    if (!outTypeAchorPoints.some(outType => outType === anchorPointType)) return


    // 此锚点是否已连接
    // const outEdges = item.getOutEdges()
    // const isLinked = outEdges.some(edge => edge._cfg.sourceAnchorIndex === anchorPointIndex)
    // if(isLinked) return

    let specialAttr = {}
    let styleType = EdgeStyleType.Normal

    if (textShapeOptions[anchorPointType]) {
      specialAttr = {
        ...specialAttr,
        label: anchorPointType,
      }
    }

    if (edgeShapeOptions[anchorPointType] || textShapeOptions[anchorPointType]) styleType = anchorPointType

    this.currentEdge = graph.addItem('edge', {
      id: Math.ceil(Math.random() * 1000) + '', // todo
      type: EdgeType,
      source: flowBlockId,
      sourceAnchor: anchorPointIndex,
      target: { x, y },
      ...specialAttr,
      styleType
    })

    if (this.currentEdge) {
      this.graph.isLinking = true
      this.setFlowNodesAnchorActiveState('in')
    }
  },

  // 更新连接中的边实例
  updateCurrentEdge(e) {
    // 不是连线中 || 不存在边
    if (!this.graph.isLinking || !this.currentEdge) return

    const graph = this.graph;
    const { x, y } = e
    const { target, targetAnchor} = this.findTargetAnchorPointByHoverNode(e)

    let config = {
      target: {x, y}
    }

    if (target) {
      config = {
        target,
        targetAnchor
      }
    }

    graph.updateItem(this.currentEdge, config)
  },

  // 移除连接中的边实例
  removeCurrentEdge() {
    if (!this.currentEdge) return

    const targetNode = this.currentEdge.getTarget()
    // 连接的是同一个节点
    if (targetNode === this.currentEdge.getSource()) {
      this.graph.removeItem(this.currentEdge)
    }
    // 判断目标节点是否拥有锚点
    if (!targetNode.getAnchorPoints ||
      !targetNode.getAnchorPoints().length) {
      this.graph.removeItem(this.currentEdge)
    }
    
    this.graph.isLinking = false
    this.currentEdge = null
    this.setFlowNodesAnchorActiveState('out')
  },
  
  // 查找hover状态的Node上离鼠标最近的锚点
  findTargetAnchorPointByHoverNode(e) {
    const { x, y } = e
    const graph = this.graph

    const hoverNode = graph.findAllByState('node', 'hover')[0]
    if (!hoverNode) return {}
    if (hoverNode === this.currentEdge.getSource()) return {}

    const { id, x: nodeX, y: nodeY } = hoverNode.getModel()
    const relativeX = x - nodeX
    const relativeY = y - nodeY

    const group = hoverNode.getContainer()
    const anchorPointGroup = group.getChildByIndex(1)
    const anchorPointShapes = anchorPointGroup.getChildren()

    const { anchorPointIndex } = anchorPointShapes.reduce((pre, shape) => {
      const { anchorPointIndex, anchorPointType, x: shapeX, y: shapeY } = shape.attrs
      
      if(!inTypeAchorPoints.some(inType => inType === anchorPointType)) return pre
      
      const r = Math.sqrt(Math.pow(relativeX - shapeX, 2) + Math.pow(relativeY - shapeY, 2))
      
      return r < pre.r || !pre.r ? { anchorPointIndex, r } : pre
    }, {})
    
    return typeof anchorPointIndex === 'number' ? {
      target: id,
      targetAnchor: anchorPointIndex
    } : {}
  },

  /**
   * 移动事件
   */

  // 在格子上移动流程块
  moveFlowBlockOnGrid(e) {
    const { item } = e
    const graph = this.graph
    const { x, y } = item.getBBox()

    const moveBase = {
      x: 20, // 移动基数x
      y: 20, // 移动基数y
    }

    graph.updateItem(item, {
      x: x - x % moveBase.x + this.offset,
      y: y - y % moveBase.y + this.offset
    })
  },

  // 流程块自动对齐
  flowBlockAutoAlign(e) {
    const { item } = e
    const graph = this.graph
    const { id } = item.getModel()
    const { minX, minY, maxX, maxY, width, height } = item.getBBox()

    const triggerRange = {
      x: 300, // 节点间触发引导线的距离x
      y: 300, // 节点间触发引导线的距离y
      r: 10 // 吸附半径
    }

    const flowBlockNodes = graph.getNodes()
    let flagX = false
    let flagY = false

    for (const node of flowBlockNodes) {
      if (node.getModel().id === id) continue
      
      const bBox = node.getBBox()
      
      const source = {
        x: minX - bBox.minX < 0 ? maxX : minX,
        y: minY - bBox.minY < 0 ? maxY : minY
      }
      
      const target = {
        x: minX - bBox.minX < 0 ? bBox.minX : bBox.maxX,
        y: minY - bBox.minY < 0 ? bBox.minY : bBox.maxY
      }

      // 大于节点间触发引导线的距离
      if (
        Math.abs(source.x - target.x) > triggerRange.x ||
        Math.abs(source.y - target.y) > triggerRange.y
      ) continue

      // x轴引导线
      if (!flagX) {
        switch (true) {
          case Math.abs(minX - bBox.minX) <= triggerRange.r: {
            graph.updateItem(item, { x: bBox.minX + this.offset })
            this.addGuideEdgeX({ x: bBox.minX, y: source.y }, { x: bBox.minX, y: target.y})
            flagX = true
            break
          }
          case Math.abs(minX - bBox.maxX) <= triggerRange.r: {
            graph.updateItem(item, { x: bBox.maxX + this.offset })
            this.addGuideEdgeX({x: bBox.maxX, y: source.y}, {x: bBox.maxX, y: target.y})
            flagX = true
            break
          }
          case Math.abs(maxX - bBox.minX) <= triggerRange.r: {
            graph.updateItem(item, { x: bBox.minX - width + this.offset })
            this.addGuideEdgeX({x: bBox.minX, y: source.y}, {x: bBox.minX, y: target.y})
            flagX = true
            break
          }
          case Math.abs(maxX - bBox.maxX) <= triggerRange.r: {
            graph.updateItem(item, { x: bBox.maxX - width + this.offset })
            this.addGuideEdgeX({x: bBox.maxX, y: source.y}, {x: bBox.maxX, y: target.y})
            flagX = true
            break
          }
          default: break
        }
      }

      // y轴引导线
      if (!flagY) {
        switch (true) {
          case Math.abs(minY - bBox.minY) <= triggerRange.r: {
            graph.updateItem(item, { y: bBox.minY + this.offset })
            this.addGuideEdgeY({x: source.x, y: bBox.minY}, {x: target.x, y: bBox.minY})
            flagY = true
            break
          }
          case Math.abs(minY - bBox.maxY) <= triggerRange.r: {
            graph.updateItem(item, { y: bBox.maxY + this.offset })
            this.addGuideEdgeY({x: source.x, y: bBox.maxY}, {x: target.x, y: bBox.maxY})
            flagY = true
            break
          }
          case Math.abs(maxY - bBox.minY) <= triggerRange.r: {
            graph.updateItem(item, { y: bBox.minY - height + this.offset })
            this.addGuideEdgeY({x: source.x, y: bBox.minY}, {x: target.x, y: bBox.minY})
            flagY = true
            break
          }
          case Math.abs(maxY - bBox.maxY) <= triggerRange.r: {
            graph.updateItem(item, { y: bBox.maxY - height + this.offset })
            this.addGuideEdgeY({x: source.x, y: bBox.maxY}, {x: target.x, y: bBox.maxY})
            flagY = true
            break
          }
          default: break
        }
      }

      if (flagX && flagY) break
    }
    
    if(!flagX) this.removeGuideEdgeX()
    if(!flagY) this.removeGuideEdgeY()
  },

  // 添加引导线
  addGuideEdgeX(source, target) {
    if (this.guideEdgeX) {
      return this.graph.updateItem(this.guideEdgeX, {source, target})
    }

    const guideEdge = this.createGuideEdge(source, target)

    this.guideEdgeX = guideEdge
  },

  addGuideEdgeY(source, target) {
    if (this.guideEdgeY) {
      return this.graph.updateItem(this.guideEdgeY, {source, target})
    }

    const guideEdge = this.createGuideEdge(source, target)

    this.guideEdgeY = guideEdge
  },

  createGuideEdge(source, target) {
    return this.graph.addItem('edge', {
      id: Math.ceil(Math.random() * 1000) + '', // todo
      shape: 'line',
      source,
      target,
      style: {
        stroke: '#666',
        lineDash: [4,2],
      }
    })
  },

  // 移除引导线
  removeGuideEdgeX() {
    if (this.guideEdgeX) {
      this.graph.removeItem(this.guideEdgeX)
      this.guideEdgeX = null
    }
  },
  removeGuideEdgeY() {
    if (this.guideEdgeY) {
      this.graph.removeItem(this.guideEdgeY)
      this.guideEdgeY = null
    }
  },
});
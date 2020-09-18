import G6 from '@antv/g6';
import { ShapeName, AnchorPointType } from '../index.d.ts'

G6.registerBehavior('flow-block-event', {
  getDefaultCfg() {
    return {
      multiple: true
    };
  },
  getEvents() {
    return {
      'afteradditem': 'onAfterAddNode',
      'afterremoveitem': 'onAfterRemoveNode',
      'node:mousedown': 'onNodeDown',
      'mousemove': 'onMouseMove',
      'mouseup': 'onMouseUp',
      'canvas:click': 'onCanvasClick',
      'node:click': 'onNodeClick',
      'node:mouseover': 'onNodeMouseOver',
      'node:mouseout': 'onNodeMouseOut',



      'canvas:dblclick': 'onDbClick',

    };
  },
  onDbClick(e) {
    const { x, y } = e
    const graph = this.graph

    const node = graph.addItem('node', {
      id: Math.ceil(Math.random() * 1000) + '',
      type: 'sz-task',
      x: x,
      y: y
    })
  },

  onAfterAddNode(item, model) {
    this.fetchFlowBlocks()
  },
  onAfterRemoveNode(item, model) {
    this.fetchFlowBlocks()
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
    this.onFlowBlockNodeClick(e)
  },
  onNodeMouseOver(e) {
    this.onFlowBlockNodeMouseOver(e)
  },
  onNodeMouseOut(e) {
    this.onFlowBlockNodeMouseOut(e)
  },

  // 获取所有流程块节点
  fetchFlowBlocks() {
    const graph = this.graph

    const flowBlockNodes = graph.getNodes() || []
    graph.set('flowBlockNodes', flowBlockNodes)
  },

  /**
   * 节点状态设置
   */
  // 移除流程块选择的状态
  removeFlowBlockNodeSelectedState() {
    if (this.selectedNode) {
      this.selectedNode.setState('selected', false)
    }
  },
  // 点击流程块
  onFlowBlockNodeClick(e) {
    const { item } = e;
    const currentStates = item.getStates()
    
    const nextSelectedState = currentStates.indexOf('selected') === -1

    this.removeFlowBlockNodeSelectedState()

    item.setState('selected', nextSelectedState)
    this.selectedNode = item
  },
  // 鼠标移入流程块
  onFlowBlockNodeMouseOver(e) {
    const { item } = e;
    item.setState('hover', true)
  },
  // 鼠标移出流程块
  onFlowBlockNodeMouseOut(e) {
    const { item } = e;
    item.setState('hover', false)
  },

  /**
   * 连线事件
   */

  // 鼠标左键按下锚点上的节点
  onAnchorPointNodeDown(e) {
    const graph = this.graph;
    const { item, target, x, y } = e;
    const { attrs, cfg } = target

    // 不是锚点上的节点
    if (cfg.name !== ShapeName.AnchorPointShape) return 
    // 是in类型的节点
    if (attrs.anchorPointType === AnchorPointType.In) return

    const { flowBlockId, anchorPointIndex } = attrs

    // 此锚点是否已连接
    // const outEdges = item.getOutEdges()
    // const isLinked = outEdges.some(edge => edge._cfg.sourceAnchorIndex === anchorPointIndex)
    // if(isLinked) return

    this.currentEdge = graph.addItem('edge', {
      id: Math.ceil(Math.random() * 1000) + '', // todo
      type: 'sz-edge',
      source: flowBlockId,
      sourceAnchor: anchorPointIndex,
      target: {x, y}
    })

    if (this.currentEdge) {
      this.isLinking = true
    }
  },

  // 更新连接中的边实例
  updateCurrentEdge(e) {
    // 不是连线中 || 不存在边
    if (!this.isLinking || !this.currentEdge) return

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

    // 判断目标节点是否拥有锚点
    if (!targetNode.getAnchorPoints ||
      !targetNode.getAnchorPoints().length) {
      // this.currentEdge.destroy()
      this.graph.removeItem(this.currentEdge)
    }
    
    this.isLinking = false
    this.currentEdge = null
  },
  // 查找hover状态的Node上离鼠标最近的锚点
  findTargetAnchorPointByHoverNode(e) {
    const { x, y } = e
    const graph = this.graph

    const hoverNode = graph.findAllByState('node', 'hover')[0]
    if (!hoverNode) return {}

    const { id, x: nodeX, y: nodeY } = hoverNode.getModel()
    const relativeX = x - nodeX
    const relativeY = y - nodeY

    const group = hoverNode.getContainer()
    const anchorPointGroup = group.getChildByIndex(1)
    const anchorPointShapes = anchorPointGroup.getChildren()

    const { anchorPointIndex } = anchorPointShapes.reduce((pre, shape) => {
      const { anchorPointIndex, anchorPointType, x: shapeX, y: shapeY } = shape.attrs
      
      if(anchorPointType === AnchorPointType.Out) return pre
      
      const r = Math.sqrt(Math.pow(relativeX - shapeX, 2) + Math.pow(relativeY - shapeY, 2))
      
      return r < pre.r || !pre.r ? { anchorPointIndex, r } : pre
    }, {})
    
    return typeof anchorPointIndex === 'number' ? {
      target: id,
      targetAnchor: anchorPointIndex
    } : {}
  }

  
});
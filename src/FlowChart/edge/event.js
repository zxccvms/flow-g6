import G6 from '@antv/g6';
import { EdgeGroupName } from '../index.d.ts'

G6.registerBehavior('edge-event', {
  getDefaultCfg() {
    return {
      multiple: true
    };
  },
  getEvents() {
    return {
      'canvas:click': 'onClick',
      'edge:mouseover': 'onEdgeMouseOver',
      'edge:mouseout': 'onEdgeMouseOut',
      'edge:click': 'onEdgeClick',
    };
  },
  onClick(e) {
    this.removeEdgeSelectedState()
  },

  // 鼠标移入线
  onEdgeMouseOver(e) {
    // 正在连线中。。。
    if (this.graph.isLinking) return
    
    const parent = e.target.getParent()
    const { name } = parent.cfg

    this.onEdgeShapeMouseOver(e)

    if (name === EdgeGroupName.DeleteShape) { // 删除按钮
      this.onDeleteShapeMouseOver(e)
    }
  },
  // 鼠标移出线
  onEdgeMouseOut(e) {
    // 正在连线中。。。
    if (this.graph.isLinking) return

    const parent = e.target.getParent()
    const { name } = parent.cfg
    
    this.onEdgeShapeMouseOut(e)

    if (name === EdgeGroupName.DeleteShape) { // 删除按钮
      this.onDeleteShapeMouseOut(e)
    }
  },
  // 鼠标点击线
  onEdgeClick(e) {
    const parent = e.target.getParent()
    const { name } = parent.cfg
    
    if (!name || name === EdgeGroupName.TextShape) { // 线图形 || 文字Group
      this.onEdgeShapeClick(e)
    } else if (name === EdgeGroupName.DeleteShape) { // 删除按钮
      this.onDeleteShapeClick(e)
    }
  },





  // 鼠标移入线shape || 文字Group
  onEdgeShapeMouseOver(e) {
    const { item } = e;
    item.setState('hover', true)
  },

  // 鼠标移入deleteGroup
  onDeleteShapeMouseOver(e) {
    const { item } = e;
    item.setState('hover-delete', true)
  },

  // 鼠标移出线shape || 文字Group
  onEdgeShapeMouseOut(e) {
    const { item } = e;
    item.setState('hover', false)
  },

  // 鼠标移出deleteGroup
  onDeleteShapeMouseOut(e) {
    const { item } = e;
    item.setState('hover-delete', false)
  },

  // 移除选择的线的selected状态
  removeEdgeSelectedState() {
    if (this.selectedEdge) {
      this.selectedEdge.setState('selected', false)
      this.selectedEdge = null
    }
  },

  // 点击线图形 || 文字Group
  onEdgeShapeClick(e) {
    const { item } = e;
    const currentStates = item.getStates()
    
    const nextSelectedState = currentStates.indexOf('selected') === -1

    this.removeEdgeSelectedState()

    item.setState('selected', nextSelectedState)
    this.selectedEdge = item
  },

  // 点击删除按钮Group
  onDeleteShapeClick(e) {
    const { item } = e;

    this.graph.removeItem(item)
  }
});
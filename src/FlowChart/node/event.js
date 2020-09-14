import G6 from '@antv/g6';
import { OtherNodeType } from '../index.d.ts'

G6.registerBehavior('flow-block-event', {
  getDefaultCfg() {
    return {
      multiple: true
    };
  },
  getEvents() {
    return {
      'node:mousedown': 'onNodeDown',
      'canvas:mousemove': 'onMouseMove'
    };
  },
  onNodeDown(e) {
    console.log("onNodeClick -> e", e)
    this.onAnchorPointNodeDown(e)
  },
  onMouseMove(e) {
  console.log("onMouseMove -> e", e)
    
  },
  // 鼠标左键按下锚点上的节点
  onAnchorPointNodeDown(e) {
    const graph = this.graph;
    const { item, target } = e;
    const { attrs, cfg } = target
    // 不是锚点上的节点
    if (cfg.name !== OtherNodeType.AnchorPointNode) return 
    
    const { flowBlockId, anchorPointIndex } = attrs
    // const points = item.getAnchorPoints()

    
  }
});
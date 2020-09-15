import G6 from '@antv/g6';
import {
  flowBlockOptionsMap,
  anchorPointNodeOptions
} from './options'
import {
  FlowBlockType
} from '../index.d.ts'

import './event'

const getNodeDefinition = type => {
  return {
    options: flowBlockOptionsMap[type],
    /**
     * 绘制节点，包含文本
     * @param  {Object} cfg 节点的配置项
     * @param  {G.Group} group 图形分组，节点中图形对象的容器
     * @return {G.Shape} 返回一个绘制的图形作为 keyShape，通过 node.get('keyShape') 可以获取。
     * 关于 keyShape 可参考文档 核心概念-节点/边/Combo-图形 Shape 与 keyShape
     */
    draw(cfg, group) {
      const { name, x, y } = cfg
      
      const _cfg = {
        attrs: {
          ...this.options.style,
          x,
          y
        },
        name,
      }
  
      const keyShape = group.addShape('rect', _cfg)
  
      return keyShape
    },
    /**
     * 绘制后的附加操作，默认没有任何操作
     * @param  {Object} cfg 节点的配置项
     * @param  {G.Group} group 图形分组，节点中图形对象的容器
     */
    afterDraw(cfg, group) {
      this.addAnchorPointNodes(cfg, group)
    },
    /**
     * 更新节点，包含文本
     * @override
     * @param  {Object} cfg 节点的配置项
     * @param  {Node} node 节点
     */
    update(cfg, node) {},
    /**
     * 更新节点后的操作，一般同 afterDraw 配合使用
     * @override
     * @param  {Object} cfg 节点的配置项
     * @param  {Node} node 节点
     */
    afterUpdate(cfg, node) {},
    setState(state, value, item) {
      const { stateStyles, style } = this.options
      const { stateStyles: anchorStateStyles, style: anchorStyle} = anchorPointNodeOptions
      const currentStates = item.getStates()
      const group = item.getContainer()
      const [keyShape, anchorPointGroup] = group.getChildren()
      const anchorPointNodes = anchorPointGroup.getChildren()
  
      switch (state) {
        case 'selected': {
          keyShape.attr(value ? stateStyles.selected : style)
          anchorPointNodes.forEach(node => node.attr(value ? anchorStateStyles[state] : anchorStyle))
          break;
        }
        case 'hover': {
          if (currentStates.indexOf('selected') !== -1) break 
          
          keyShape.attr(value ? stateStyles.hover : style)
          anchorPointNodes.forEach(node => node.attr(value ? anchorStateStyles[state] : anchorStyle))
          break;
        }
        default: break;
      }
    },
    /**
     * 获取锚点（相关边的连入点）
     */
    // getAnchorPoints(cfg) {
    //   return this.options.anchorPoints
    // },
  
    // 添加锚点上的node
    addAnchorPointNodes(cfg, group) {
      const { style, name } = anchorPointNodeOptions
      const { x: flowBlockX, y: flowBlockY, id } = cfg
      const { width, height } = this.options.style
      const anchorPoints = this.getAnchorPoints(cfg)
  
      const anchorPointGroup = group.addGroup({
        id: `${id}-anchor-point-group`,
        name: 'anchor-point-group'
      })
  
      anchorPoints.forEach(([xPercentage, yPercentage], index) => {
        const x = flowBlockX + xPercentage * width
        const y = flowBlockY + yPercentage * height
  
        const _cfg = {
          attrs: {
            ...style,
            x,
            y,
            flowBlockId: id,
            anchorPointIndex: index
          },
          name,
        }
  
        anchorPointGroup.addShape('circle', _cfg)
      })
    },
  }
}


for (const value in FlowBlockType) {
  const type = FlowBlockType[value]
  G6.registerNode(type , getNodeDefinition(type))
}



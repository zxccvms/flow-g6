import G6 from '@antv/g6';
import {
  flowBlockOptionsMap,
  anchorPointNodeOptions
} from './options'

import './event'


G6.registerNode('demoNode',{
  /**
   * 绘制节点，包含文本
   * @param  {Object} cfg 节点的配置项
   * @param  {G.Group} group 图形分组，节点中图形对象的容器
   * @return {G.Shape} 返回一个绘制的图形作为 keyShape，通过 node.get('keyShape') 可以获取。
   * 关于 keyShape 可参考文档 核心概念-节点/边/Combo-图形 Shape 与 keyShape
   */
  draw(cfg, group) {
    const {name, x, y } = cfg
    const _cfg = {
      attrs: {
        ...flowBlockOptionsMap[name].style,
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
  /**
   * 响应节点的状态变化。
   * 在需要使用动画来响应状态变化时需要被复写，其他样式的响应参见下文提及的 [配置状态样式] 文档
   * @param  {String} name 状态名称
   * @param  {Object} value 状态值
   * @param  {Node} node 节点
   */
  setState(name, value, node) {},
  /**
   * 获取锚点（相关边的连入点）
   * @param  {Object} cfg 节点的配置项
   * @return {Array|null} 锚点（相关边的连入点）的数组,如果为 null，则没有控制点
   */
  getAnchorPoints(cfg) {
    const { name } = cfg
    const { anchorPoints } = flowBlockOptionsMap[name]
    return anchorPoints
  },

  // 添加锚点上的node
  addAnchorPointNodes(cfg, group) {
    const { style, name } = anchorPointNodeOptions
    const { x: flowBlockX, y: flowBlockY, name: flowBlockName, id } = cfg
    const { width, height } = flowBlockOptionsMap[flowBlockName].style
    const anchorPoints = this.getAnchorPoints(cfg)

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

      group.addShape('circle', _cfg)
    })
  },
}, 'Rect');
import G6 from '@antv/g6';
import {
  flowBlockOptionsMap,
  anchorPointShapeOptions,
  iconShapeOptions,
  textShapeOptions,
  utilShapesOptionsMap
} from './options'

import {
  FlowBlockType,
  GroupName,
  ShapeName,
  UtilGroupChildrenName
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
      const _cfg = {
        attrs: {
          ...this.options.style,
        },
        name: this.options.name,
      }
  
      const keyShape = group.addShape('rect', _cfg)
  
      return keyShape
    },
    afterDraw(cfg, group) {
      this.addAnchorPointShapes(cfg, group)
      this.addIconShape(cfg, group)
      this.addTextShape(cfg, group)
      this.addUtilShapes(cfg, group)
    },
    update(cfg, node) {},
    afterUpdate(cfg, node) {},
    
    setState(state, value, item) {
      item.toFront()
      switch (state) {
        case 'selected': {
          this.updateShapeState(state, value, item)
          break;
        }
        case 'hover': {
          const currentStates = item.getStates()
          if (currentStates.indexOf('selected') !== -1) break;
          
          this.updateShapeState(state, value, item)
          break;
        }
        default: break;
      }
    },
    // 更新allShape属性
    updateShapeState(state, value, item) {
      const { stateStyles, style } = this.options
      const { stateStyles: anchorStateStyles, style: anchorStyle} = anchorPointShapeOptions
      const { stateStyles: iconStateStyles, style: iconStyle} = iconShapeOptions
      const { stateStyles: textStateStyles, style: textStyle} = textShapeOptions
      
      const group = item.getContainer()
      const [keyShape, anchorPointGroup, iconShape, textShape, utilGroup] = group.getChildren()
      const anchorPointShapes = anchorPointGroup.getChildren()
  
      keyShape.attr(value ? stateStyles[state] : style)
      anchorPointShapes.forEach(shape => shape.attr(value ? anchorStateStyles[state] : anchorStyle))
      iconShape.attr(value ? iconStateStyles[state] : iconStyle)
      textShape.attr(value ? textStateStyles[state] : textStyle)
      if (state === 'selected') {
        utilGroup[value ? 'show' : 'hide']()
      }
    },
    
    /**
     * 获取锚点（相关边的连入点）
     */
    getAnchorPoints(cfg) {
      return this.options.anchorPoints
    },
  
    // 添加锚点上的Shape
    addAnchorPointShapes(cfg, group) {
      const { style, name } = anchorPointShapeOptions
      const { id } = cfg
      const { width, height } = this.options.style
      const anchorPoints = this.getAnchorPoints(cfg)
  
      const anchorPointGroup = group.addGroup({
        id: `${id}-${GroupName.AnchorPointGroup}`,
        name: GroupName.AnchorPointGroup
      })
  
      anchorPoints.forEach(([xPercentage, yPercentage], index) => {
        const x = xPercentage * width
        const y = yPercentage * height
  
        const _cfg = {
          attrs: {
            ...style,
            x,
            y,
            flowBlockId: id,
            anchorPointIndex: index,
            anchorPointType: this.options.anchorPointsType[index]
          },
          name,
        }
  
        anchorPointGroup.addShape('circle', _cfg)
      })
    },

    // 增加icon shape
    addIconShape(cfg, group) {
      const { icon } = this.options
      const { style, name } = iconShapeOptions
      const { id } = cfg

      const _cfg = {
        attrs: {
          ...style,
          text: icon,
          flowBlockId: id,
        },
        name,
        draggable: true,
      }

      group.addShape('text', _cfg)
    },

    // 增加text shape
    addTextShape(cfg, group) {
      const { text } = this.options
      const { style, name } = textShapeOptions
      const { id } = cfg

      const _cfg = {
        attrs: {
          ...style,
          text,
          flowBlockId: id,
        },
        name,
        draggable: true
      }

      group.addShape('text', _cfg)
    },

    // 增加util shape
    addUtilShapes(cfg, group) {
      const { id } = cfg

      const utilShapeGroup = group.addGroup({
        id: `${id}-${GroupName.UtilGroup}`,
        name: GroupName.UtilGroup,
      })

      utilShapeGroup.hide()

      for(const groupKey in UtilGroupChildrenName) {
        const groupName = UtilGroupChildrenName[groupKey]
        
        if (groupName === UtilGroupChildrenName.EditorShape && type !== FlowBlockType.Task) continue

        const { length } = utilShapeGroup.getChildren()
        
        const shapeGroup = utilShapeGroup.addGroup({
          id: `${id}-${groupName}`,
          name: groupName,
        })

        const shapeName = ShapeName[groupKey]// groupKey 在定义的时候和ShapeName的 key 相同
        const { style, name, iconShape } = utilShapesOptionsMap[shapeName] 
        const { x, y } = style
        const { style: iconStyle } = iconShape
        
        const realX = x + length * 30
    
        const circleCfg = {
          attrs: {
            ...style,
            flowBlockId: id,
            x: realX
          },
          name,
        }
  
        shapeGroup.addShape('circle', circleCfg)

        const iconCfg = {
          attrs: {
            ...iconStyle,
            x: realX - iconStyle.fontSize / 2,
            y: y,
          },
          name: ShapeName.IconShape
        }

        shapeGroup.addShape('text', iconCfg)
      }
    }

  }
}


for (const value in FlowBlockType) {
  const type = FlowBlockType[value]
  G6.registerNode(type , getNodeDefinition(type))
}



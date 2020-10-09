import G6 from '@antv/g6';
import {
  flowBlockOptionsMap,
  anchorPointShapeOptions,
  iconShapeOptions,
  textShapeOptions,
  utilGroupsOptionsMap,
} from './options'

import {
  FlowBlockType,
  GroupName,
  ShapeName,
  UtilGroupChildrenName,
  AnchorPointType,
  inTypeAchorPoints,
  outTypeAchorPoints
} from '../index.d.ts'

import './event'

/**
 * 计算字符串的长度
 * @param {string} str 指定的字符串
 * @return {number} 字符串长度
 */
const calcStrLen = str => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
};

/**
* 计算显示的字符串
* @param {string} str 要裁剪的字符串
* @param {number} maxWidth 最大宽度
* @param {number} fontSize 字体大小
* @return {string} 处理后的字符串
*/
const fittingString = (str, maxWidth, fontSize) => {
  const fontWidth = fontSize * 1.3; // 字号+边距
  maxWidth = maxWidth * 1.5; // 需要根据自己项目调整
  const width = calcStrLen(str) * fontWidth;
  const ellipsis = '…';
  if (width > maxWidth) {
    const actualLen = Math.floor((maxWidth - 10) / fontWidth);
    const result = str.substring(0, actualLen) + ellipsis;
    return result;
  }
  return str;
};


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
      this.addUtilGroup(cfg, group)
    },
    // update(cfg, node) {},
    // afterUpdate(cfg, node) {},
    
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
        case 'anchor-active': {
          this.updateAnchorShapeState(state, value, item)
          break;
        }
        case 'hover-utilGroup': {
          this.updateUtilGroupState(state, value, item)
          break;
        }
        default: break;
      }
    },

    // 更新所有Shape属性
    updateShapeState(state, value, item) {
      const { stateStyles, style, iconCfg = {} } = this.options
      const { stateStyles: iconSpecialStateStyles = {}, style: iconSpecialStyle = {} } = iconCfg
      const { stateStyles: iconStateStyles, style: iconStyle } = iconShapeOptions
      const { stateStyles: textStateStyles, style: textStyle} = textShapeOptions
      
      const group = item.getContainer()
      const [keyShape, anchorPointGroup, iconShape, textShape, utilGroup] = group.getChildren()
  
      keyShape.attr(value ? stateStyles[state] : style)
      anchorPointGroup[value ? 'show' : 'hide']()
      iconShape.attr(value ?
        { ...iconStateStyles[state], ...iconSpecialStateStyles[state] } :
        { ...iconStyle, ...iconSpecialStyle }
      )
      textShape.attr(value ? textStateStyles[state] : textStyle)

      if (state === 'selected') {
        utilGroup[value ? 'show' : 'hide']()
      }
    },

    // 更新锚点
    updateAnchorShapeState(state, value, item) {
      const { stateStyles } = anchorPointShapeOptions
      const { id } = item.getModel()
      const group = item.getContainer()
      const anchorPointGroup = group.findById(`${id}-${GroupName.AnchorPointGroup}`)
      const anchorPointShapes = anchorPointGroup.getChildren()

      if (value === 'in') {
        anchorPointShapes.forEach(shape =>
          inTypeAchorPoints.some(inType => inType === shape.attr('anchorPointType')) ?
            shape.attr(stateStyles.able) :
            shape.attr(stateStyles.unable)
        )
      } else if (value === 'out') {
        anchorPointShapes.forEach(shape =>
          outTypeAchorPoints.some(outType => outType === shape.attr('anchorPointType')) ?
            shape.attr(stateStyles.able) :
            shape.attr(stateStyles.unable)
        )
      }
    },

    // 更新utilGroup
    updateUtilGroupState(state, value, item) {
      const { id } = item.getModel()
      const group = item.getContainer()
      const utilGroup = group.findById(`${id}-${GroupName.UtilGroup}`)
      const utilGroupChilds = utilGroup.getChildren()

      utilGroupChilds.forEach(group => { 
        const groupName = group.cfg.name

        group.getChildren().forEach(shape => { 
          const shapeName = shape.get('name')
          const { style, stateStyles} = utilGroupsOptionsMap[groupName][shapeName]
          shape.attr(groupName === value ? stateStyles.hover : style)
        })
      })
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

      anchorPointGroup.hide()
  
      anchorPoints.forEach(([percentageX, percentageY], index) => {
        const x = percentageX * width
        const y = percentageY * height

        const anchorPointType = this.options.anchorPointsType[index]
  
        const _cfg = {
          attrs: {
            ...style,
            ...anchorPointShapeOptions[anchorPointType],
            x,
            y,
            flowBlockId: id,
            anchorPointIndex: index,
            anchorPointType
          },
          name,
        }
  
        anchorPointGroup.addShape('circle', _cfg)
      })
    },

    // 增加icon shape
    addIconShape(cfg, group) {
      const { icon, iconCfg = {} } = this.options
      const { style, name } = iconShapeOptions
      const { style: specialStyle = {} } = iconCfg
      const { id } = cfg

      const _cfg = {
        attrs: {
          ...style,
          ...specialStyle,
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
      const { id, label } = cfg

      const _cfg = {
        attrs: {
          ...style,
          text: fittingString(label || text, 84, 12),
          flowBlockId: id,
        },
        name,
        draggable: true
      }

      group.addShape('text', _cfg)
    },

    // 增加util shape
    addUtilGroup(cfg, group) {
      const { id } = cfg

      const utilShapeGroup = group.addGroup({
        id: `${id}-${GroupName.UtilGroup}`,
        name: GroupName.UtilGroup,
      })

      utilShapeGroup.hide()

      for(const groupKey in UtilGroupChildrenName) {
        const groupName = UtilGroupChildrenName[groupKey]
        
        if (groupName === UtilGroupChildrenName.EditorShapeGroup && type !== FlowBlockType.Task) continue

        const { length } = utilShapeGroup.getChildren()
        
        const shapeGroup = utilShapeGroup.addGroup({
          id: `${id}-${groupName}`,
          name: groupName,
        })

        const utilGroupOptions = utilGroupsOptionsMap[groupName]
        const utilShape = utilGroupOptions[groupName.replace('-group', '')]
        const iconShape = utilGroupOptions[ShapeName.IconShape]
        const { style, name } = utilShape
        const { style: iconStyle } = iconShape
        
        const realX = 140 + 8 + 12 + length * 30
    
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
            y: style.y,
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


